import { Logger } from '../../core/portal_abstract_stream';
import * as tokenProgram from './abi/tokenProgram';
import { SolanaSwapTransfer } from './solana_swaps';
import {
  Block,
  Instruction,
  getInnerTransfersByLevel,
  getInstructionBalances,
  getInstructionD1,
  getTransactionHash,
} from './utils';

export function handleMeteoraDamm(logger: Logger, ins: Instruction, block: Block): SolanaSwapTransfer | null {
  // const swap = damm.instructions.swap.decode(ins);

  // We skip such zero transfers, this doesn't make sense
  // if (swap.data.inAmount === 0n) {
  //   return null;
  // }

  /**
   * Meteora DAMM has two transfers on the second level and also other tokenProgram instructions
   */
  const transfers = block.instructions
    .filter((inner) => {
      if (inner.transactionIndex !== ins.transactionIndex) return false;
      if (inner.instructionAddress.length <= ins.instructionAddress.length) return false;
      if (inner.programId !== tokenProgram.programId) return false;

      if (getInstructionD1(inner) !== tokenProgram.instructions.transfer.d1) {
        return false;
      }

      return ins.instructionAddress.every((v, i) => v === inner.instructionAddress[i]);
    })
    .map((t) => {
      return tokenProgram.instructions.transfer.decode(t);
    });

  // DAMM could have internal transfers, the last two transfers are final src and dest
  const [src, dest] = transfers.slice(-2);
  if (!src || !dest) {
    logger.warn({
      message: 'Meteora DAMM: src or dest not found',
      tx: getTransactionHash(ins, block),
      block_number: block.header.number,
      src,
      dest,
    });

    return null;
  }

  const tokenBalances = getInstructionBalances(ins, block);
  return {
    type: 'meteora_damm',
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

export function handleMeteoraDlmm(ins: Instruction, block: Block): SolanaSwapTransfer {
  // const swap = dlmm.instructions.swap.decode(ins);

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
      token: tokenBalances.find((b) => b.account === src.accounts.destination),
    },
    out: {
      amount: dest.data.amount,
      token: tokenBalances.find((b) => b.account === dest.accounts.source),
    },
  };
}
