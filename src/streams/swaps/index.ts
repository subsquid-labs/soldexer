import { getInstructionDescriptor } from '@subsquid/solana-stream';
import { BlockRef, OptionalArgs, PortalAbstractStream } from '@sqd-pipes/core';
import * as meteora_damm from '../../abi/meteora_damm/index';
import * as meteora_dlmm from '../../abi/meteora_dlmm/index';
import * as whirlpool from '../../abi/orca_whirlpool/index';
import * as raydium_amm from '../../abi/raydium_amm/index';
import * as raydium_clmm from '../../abi/raydium_clmm/index';
import { handleMeteoraDamm, handleMeteoraDlmm } from './handle_meteora';
import { handleWhirlpool } from './handle_orca';
import { handleRaydiumAmm, handleRaydiumClmm } from './handle_raydium';
import { getInstructionD1, getTransactionHash } from '../../utils';

export type SwapType = 'orca_whirlpool' | 'meteora_damm' | 'meteora_dlmm' | 'raydium_clmm' | 'raydium_amm';

export type SolanaSwap = {
  id: string;
  type: SwapType;
  account: string;
  transaction: { hash: string; index: number };
  input: {
    amount: bigint;
    mint: string;
    decimals: number;
  };
  output: {
    amount: bigint;
    mint: string;
    decimals: number;
  };
  instruction: { address: number[] };
  block: BlockRef;
  timestamp: Date;
};

export type SolanaSwapTransfer = {
  type: SwapType;
  account: string;
  in: { amount: bigint; token: { postMint: string; postDecimals: number } };
  out: { amount: bigint; token: { postMint: string; postDecimals: number } };
};

export class SolanaSwapsStream extends PortalAbstractStream<
  SolanaSwap,
  OptionalArgs<{
    tokens?: string[];
    type?: SwapType[];
  }>
> {
  async stream(): Promise<ReadableStream<SolanaSwap[]>> {
    const { args } = this.options;

    const types = args?.type || ['orca_whirlpool', 'meteora_damm', 'meteora_dlmm', 'raydium_clmm', 'raydium_amm'];

    const source = await this.getStream({
      type: 'solana',
      fields: {
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
        log: {
          transactionIndex: true,
          instructionAddress: true,
          logIndex: true,
          message: true,
        },
        tokenBalance: {
          transactionIndex: true,
          account: true,
          preMint: true,
          postMint: true,
          postDecimals: true,
        },
      },
      instructions: types.map((type) => {
        switch (type) {
          case 'orca_whirlpool':
            return {
              programId: [whirlpool.programId], // where executed by Whirlpool program
              d8: [whirlpool.instructions.swap.d8],
              isCommitted: true,
              innerInstructions: true,
              transaction: true,
              transactionTokenBalances: true,
              logs: true,
            };
          case 'meteora_damm':
            return {
              programId: [meteora_damm.programId],
              d8: [meteora_damm.instructions.swap.d8],
              isCommitted: true,
              innerInstructions: true,
              transaction: true,
              transactionTokenBalances: true,
            };
          case 'meteora_dlmm':
            return {
              programId: [meteora_dlmm.programId],
              d8: [meteora_dlmm.instructions.swap.d8, meteora_dlmm.instructions.swapExactOut.d8],
              isCommitted: true,
              innerInstructions: true,
              transaction: true,
              transactionTokenBalances: true,
            };
          case 'raydium_clmm':
            return {
              programId: [raydium_clmm.programId],
              d8: [
                raydium_clmm.instructions.swap.d8,
                raydium_clmm.instructions.swapV2.d8,
                raydium_clmm.instructions.swapRouterBaseIn.d8,
              ],
              isCommitted: true,
              innerInstructions: true,
              transaction: true,
              transactionTokenBalances: true,
            };
          case 'raydium_amm':
            return {
              programId: [raydium_amm.programId],
              d1: [raydium_amm.instructions.swapBaseIn.d1, raydium_amm.instructions.swapBaseOut.d1],
              isCommitted: true,
              innerInstructions: true,
              transaction: true,
              transactionTokenBalances: true,
            };
        }
      }),
    });

    const stream = source.pipeThrough(
      new TransformStream({
        transform: ({ blocks }, controller) => {
          // FIXME
          const res = blocks.flatMap((block: any) => {
            if (!block.instructions) return [];

            const swaps: SolanaSwap[] = [];

            for (const ins of block.instructions) {
              let swap: SolanaSwapTransfer | null = null;

              switch (ins.programId) {
                case whirlpool.programId:
                  if (whirlpool.instructions.swap.d8 === getInstructionDescriptor(ins)) {
                    swap = handleWhirlpool(ins, block);
                    break;
                  }
                  break;
                case meteora_damm.programId:
                  switch (getInstructionDescriptor(ins)) {
                    case meteora_damm.instructions.swap.d8:
                      swap = handleMeteoraDamm(this.logger, ins, block);
                      break;
                  }
                  break;
                case meteora_dlmm.programId:
                  switch (getInstructionDescriptor(ins)) {
                    case meteora_dlmm.instructions.swap.d8:
                    case meteora_dlmm.instructions.swapExactOut.d8:
                      swap = handleMeteoraDlmm(ins, block);
                      break;
                  }
                  break;
                case raydium_amm.programId:
                  switch (getInstructionD1(ins)) {
                    case raydium_amm.instructions.swapBaseIn.d1:
                    case raydium_amm.instructions.swapBaseOut.d1:
                      swap = handleRaydiumAmm(ins, block);
                      break;
                  }
                  break;
                case raydium_clmm.programId:
                  switch (getInstructionD1(ins)) {
                    case raydium_clmm.instructions.swap.d8:
                    case raydium_clmm.instructions.swapV2.d8:
                    case raydium_clmm.instructions.swapRouterBaseIn.d8:
                      swap = handleRaydiumClmm(ins, block);
                      break;
                  }
                  break;
              }

              if (!swap) continue;
              else if (
                args?.tokens &&
                !args?.tokens.includes(swap.in.token.postMint) &&
                !args?.tokens.includes(swap.out.token.postMint)
              ) {
                continue;
              }

              const txHash = getTransactionHash(ins, block);

              swaps.push({
                id: `${txHash}/${ins.transactionIndex}`,
                type: swap.type,
                block: {
                  number: block.header.number,
                  hash: block.header.hash,
                  timestamp: block.header.timestamp,
                },
                instruction: {
                  address: ins.instructionAddress,
                },
                input: {
                  amount: swap.in.amount,
                  mint: swap.in.token.postMint,
                  decimals: swap.in.token.postDecimals,
                },
                output: {
                  amount: swap.out.amount,
                  mint: swap.out.token.postMint,
                  decimals: swap.out.token.postDecimals,
                },
                account: swap.account,
                transaction: {
                  hash: txHash,
                  index: ins.transactionIndex,
                },
                timestamp: new Date(block.header.timestamp * 1000),
              });
            }

            return swaps;
          });

          controller.enqueue(res);
        },
      }),
    );

    return stream;
  }
}
