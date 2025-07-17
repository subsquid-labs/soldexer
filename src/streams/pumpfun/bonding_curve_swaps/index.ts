import { type BlockRef, type OptionalArgs, PortalAbstractStream } from '@sqd-pipes/core'
import { augmentBlock } from '@subsquid/solana-objects'
import { getInstructionDescriptor } from '@subsquid/solana-stream'
import * as pumpfun from '../../../abi/pumpfun'
import { getTransactionHash } from '../../../utils'
import { handlePumpfunBuy } from './buy_handler'
import { handlePumpfunSell } from './sell_handler'

export type PumpfunSwap = {
  id: string
  type: 'sell' | 'buy'
  account: string | null
  transaction: { hash: string; index: number }
  baseToken: {
    amount: bigint
    mint: string
    decimals: number
  }
  quoteToken: {
    amount: bigint
    mint: string
    decimals: number
  }
  instruction: { address: number[] }
  block: BlockRef
  timestamp: Date
  tokenPrice: bigint
}

export type PumpfunSwapTransaction = {
  type: 'sell' | 'buy'
  account: string | null
  baseToken: {
    amount: bigint
    token: { postMint: string; postDecimals: number }
  }
  quoteToken: {
    amount: bigint
    token: { postMint: string; postDecimals: number }
  }
  tokenPrice: bigint
}

const ALL_FIELDS = {
  block: {
    number: true,
    hash: true,
    timestamp: true,
  },
  transaction: {
    transactionIndex: true,
    signatures: true,
  },
  instruction: {
    transactionIndex: true,
    data: true,
    instructionAddress: true,
    programId: true,
    accounts: true,
  },
  tokenBalance: {
    transactionIndex: true,
    account: true,
    preMint: true,
    postMint: true,
    preAmount: true,
    postAmount: true,
    preDecimals: true,
    postDecimals: true,
  },
  log: {
    transactionIndex: true,
    instructionAddress: true,
    message: true,
    logIndex: true,
  },
}

export class PumpfunBuysAndSellsStream extends PortalAbstractStream<
  PumpfunSwap,
  OptionalArgs<{
    tokens?: string[]
  }>
> {
  async stream(): Promise<ReadableStream<PumpfunSwap[]>> {
    const { args } = this.options

    const source = await this.getStream({
      type: 'solana',
      fields: ALL_FIELDS,
      instructions: [
        {
          programId: [pumpfun.programId],
          d8: [pumpfun.instructions.sell.d8, pumpfun.instructions.buy.d8],
          isCommitted: true,
          innerInstructions: true,
          transaction: true,
          transactionTokenBalances: true,
          logs: true,
        },
      ],
    })

    return source.pipeThrough(
      new TransformStream({
        transform: ({ blocks }, controller) => {
          // FIXME
          const res = blocks.flatMap((_block: any) => {
            if (!_block.instructions) return []

            const block = augmentBlock<typeof ALL_FIELDS>({
              header: {
                ..._block.header,
                height: _block.header.number,
              },
              instructions: _block.instructions || [],
              logs: _block.logs || [],
              balances: _block.balances || [],
              tokenBalances: _block.tokenBalances || [],
              rewards: _block.rewards || [],
              transactions: _block.transactions || [],
            })

            const swaps: PumpfunSwap[] = []

            for (const ins of block.instructions) {
              if (ins.programId !== pumpfun.programId) continue

              let swap: PumpfunSwapTransaction | null = null

              switch (getInstructionDescriptor(ins)) {
                case pumpfun.instructions.buy.d8:
                  swap = handlePumpfunBuy(ins, block)
                  break
                case pumpfun.instructions.sell.d8:
                  swap = handlePumpfunSell(ins, block)
                  break
              }

              if (!swap) continue

              if (
                args?.tokens &&
                !args?.tokens.includes(swap.baseToken.token.postMint) &&
                !args?.tokens.includes(swap.quoteToken.token.postMint)
              ) {
                continue
              }

              const txHash = getTransactionHash(ins, block)

              swaps.push({
                type: swap.type,
                id: `${txHash}/${ins.transactionIndex}`,
                block: {
                  number: block.header.number,
                  hash: block.header.hash,
                  timestamp: block.header.timestamp,
                },
                instruction: {
                  address: ins.instructionAddress,
                },
                baseToken: {
                  amount: swap.baseToken.amount,
                  mint: swap.baseToken.token.postMint,
                  decimals: swap.baseToken.token.postDecimals,
                },
                quoteToken: {
                  amount: swap.quoteToken.amount,
                  mint: swap.quoteToken.token.postMint,
                  decimals: swap.quoteToken.token.postDecimals,
                },
                account: swap.account,
                transaction: {
                  hash: txHash,
                  index: ins.transactionIndex,
                },
                timestamp: new Date(block.header.timestamp * 1000),
                tokenPrice: swap.tokenPrice,
              })
            }

            return swaps
          })

          if (!res.length) return

          controller.enqueue(res)
        },
      }),
    )
  }
}
