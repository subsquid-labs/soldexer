import * as tokenProgram from '../../abi/tokenProgram';
import { SolanaSwapTransfer } from '.';
import { Block, Instruction, getInnerTransfersByLevel, getInstructionBalances } from '../../utils';

export function handleRaydiumClmm(ins: Instruction, block: Block): SolanaSwapTransfer {
  const [src, dest] = getInnerTransfersByLevel(ins, block.instructions, 1).map((t) =>
    tokenProgram.instructions.transfer.decode(t),
  );

  const tokenBalances = getInstructionBalances(ins, block);
  return {
    type: 'raydium_clmm',
    account: src.accounts.authority,
    in: {
      amount: src.data.amount,
      token: tokenBalances.find((b) => b.account === src.accounts.destination),
    },
    out: {
      amount: dest.data.amount,
      token: tokenBalances.find((b) => b.account === dest.accounts.source),
    },
  };
}

export function handleRaydiumAmm(ins: Instruction, block: Block): SolanaSwapTransfer {
  const [src, dest] = getInnerTransfersByLevel(ins, block.instructions, 1).map((t) =>
    tokenProgram.instructions.transfer.decode(t),
  );

  const tokenBalances = getInstructionBalances(ins, block);
  return {
    type: 'raydium_amm',
    account: src.accounts.authority,
    in: {
      amount: src.data.amount,
      token: tokenBalances.find((b) => b.account === src.accounts.destination),
    },
    out: {
      amount: dest.data.amount,
      token: tokenBalances.find((b) => b.account === dest.accounts.source),
    },
  };
}
