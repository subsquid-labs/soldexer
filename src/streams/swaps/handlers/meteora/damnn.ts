import type { Logger } from '@sqd-pipes/core';
import {
  type Block,
  type Instruction,
  getInstructionBalances,
  getInstructionD1,
  getTransactionHash,
} from '../../../../utils';
import * as tokenProgram from '../../../../abi/tokenProgram';
import type { SolanaSwapTransfer } from '../../';

export function handleMeteoraDamm(
  logger: Logger,
  ins: Instruction,
  block: Block,
): SolanaSwapTransfer | null {

  /**
   * Meteora DAMM has two transfers on the second level and also other tokenProgram instructions
   */
  const transfers = block.instructions
    .filter((inner: any) => {
      if (inner.transactionIndex !== ins.transactionIndex) return false;
      if (inner.instructionAddress.length <= ins.instructionAddress.length) return false;
      if (inner.programId !== tokenProgram.programId) return false;

      if (getInstructionD1(inner) !== tokenProgram.instructions.transfer.d1) {
        return false;
      }

      return ins.instructionAddress.every((v: any, i: any) => v === inner.instructionAddress[i]);
    })
    .map((t: any) => {
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
