import { SolanaSwapTransfer } from '.'
import * as tokenProgram from '../../abi/tokenProgram'
import { Block, Instruction, getInnerTransfersByLevel, getInstructionBalances } from '../../utils'

export function handleWhirlpool(ins: Instruction, block: Block): SolanaSwapTransfer {
  const [src, dest] = getInnerTransfersByLevel(ins, block.instructions, 1).map((t) =>
    tokenProgram.instructions.transfer.decode(t),
  )
  const tokenBalances = getInstructionBalances(ins, block)

  return {
    type: 'orca_whirlpool',
    account: src.accounts.authority,
    in: {
      amount: src.data.amount,
      token: tokenBalances.find((b) => b.account === src.accounts.destination),
    },
    out: {
      amount: dest.data.amount,
      token: tokenBalances.find((b) => b.account === dest.accounts.source),
    },
  }
}
