import {
  type Block,
  type Instruction,
  getInnerTransfersByLevel,
  getInstructionBalances,
} from '../../../../utils';

import * as tokenProgram from '../../../../abi/tokenProgram';
import type { SolanaSwapTransfer } from '../../';
export function handleMeteoraDlmm(ins: Instruction, block: Block): SolanaSwapTransfer {
  const transfers = getInnerTransfersByLevel(ins, block.instructions, 1).map((t) => {
    return tokenProgram.instructions.transferChecked.decode(t);
  });

  // DAMM could have internal transfers, the last two transfers are final src and dest
  // TODO if there are more than 2 transfers, is the first one fee?
  // 2fsnqWFXfmPkNPMTe2BVrDgSEhgezDTtvXxedrDHJrrLXNWR7K2DpPZ13N2DppGrYmTpofAfToXzaqyBWiumJGZ4
  const [src, dest] = transfers.slice(-2);
  const tokenBalances = getInstructionBalances(ins, block);

  return {
    type: 'meteora_dlmm',
    account: src.accounts.owner,
    in: {
      amount: src.data.amount,
      token: tokenBalances.find((b: any) => b.account === src.accounts.destination),
    },
    out: {
      amount: dest.data.amount,
      token: tokenBalances.find((b: any) => b.account === dest.accounts.source),
    },
    poolAddress: null,
    tokenA: null,
    tokenB: null,
    slippage: null,
    reserves: null,
  };
}

