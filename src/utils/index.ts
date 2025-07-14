import assert from 'assert'
import { getInstructionData } from '@subsquid/solana-stream'
import { toHex } from '@subsquid/util-internal-hex'
import * as token2022Program from '../abi/token_2022_program'
import * as tokenProgram from '../abi/tokenProgram'
import { PublicKey } from '@solana/web3.js'

export * from './logger'

interface DecodedTransfer {
  accounts: {
    destination: string;
    source: string;
    authority?: string;
    owner?: string;
  };
  data: {
    amount: bigint;
  };
}

export type Instruction = any
export type Block = any

export function getSortFunction(tokes: string[]) {
  const SORT_ORDER: Record<string, number> = tokes.reduce((acc, token, index) => ({ ...acc, [token]: index + 1 }), {})

  return (a: string, b: string) => {
    const sort = (SORT_ORDER[b] || Number.MAX_SAFE_INTEGER) - (SORT_ORDER[a] || Number.MAX_SAFE_INTEGER)

    if (sort !== 0) return sort > 0

    return a.localeCompare(b) > 0
  }
}

export function getInstructionBalances(ins: Instruction, block: Block) {
  return block.tokenBalances?.filter((t) => t.transactionIndex === ins.transactionIndex) || []
}

export function getTransactionHash(ins: Instruction, block: Block) {
  const tx = block.transactions.find((t) => t.transactionIndex === ins.transactionIndex)
  assert(tx, 'transaction not found')

  return tx.signatures[0]
}

/**
 * Get the inner token transfer instructions of a parent instruction at a given level
 * @param parent
 * @param instructions
 * @param level
 * @returns
 */
export function getInnerTransfersByLevel(
  parent: Instruction,
  instructions: Instruction[],
  level: number
) {
  return instructions.filter((inner) => {
    if (inner.transactionIndex !== parent.transactionIndex) return false;
    if (
      inner.instructionAddress.length !==
      parent.instructionAddress.length + level
    )
      return false;
    if (
      inner.programId !== tokenProgram.programId &&
      inner.programId !== token2022Program.programId
    )
      return false;

    if (
      getInstructionD1(inner) !== tokenProgram.instructions.transfer.d1 &&
      getInstructionD1(inner) !==
        tokenProgram.instructions.transferChecked.d1 &&
      getInstructionD1(inner) !== token2022Program.instructions.transfer.d1 &&
      getInstructionD1(inner) !==
        token2022Program.instructions.transferChecked.d1
    )
      return false;

    // All child instructions should have the same prefix as the parent
    return parent.instructionAddress.every(
      (v: any, i: any) => v === inner.instructionAddress[i]
    );
  });
}

export function getInstructionD1(instruction: Instruction) {
  return toHex(getInstructionData(instruction)).slice(0, 4)
}

/**
 * Sort two accounts by their public key
 * @param accountA
 * @param accountB
 * @returns
 */
export function sortAccounts(
  accountA: string,
  accountB: string
): [string, string] {
  const aBytes = new PublicKey(accountA).toBytes();
  const bBytes = new PublicKey(accountB).toBytes();

  for (let i = 0; i < 32; i++) {
    if (aBytes[i] < bBytes[i]) {
      return [accountA, accountB];
    }
    if (aBytes[i] > bBytes[i]) {
      return [accountB, accountA];
    }
  }

  throw new Error("Accounts must be different");
}

/**
 * Get all the logs of an instruction
 * @param ins
 * @param block
 * @returns
 */
export function getInstructionLogs(ins: Instruction, block: Block) {
  return (
    block.logs?.filter(
      (log) =>
        log.transactionIndex === ins.transactionIndex &&
        log.instructionAddress.length === ins.instructionAddress.length &&
        log.instructionAddress.every((v, i) => v === ins.instructionAddress[i])
    ) || []
  );
}

/**
 * Convert a sqrtPrice in x64, commmon in concentrated liquidity protocols, to a human readable price
 * @param sqrtPriceX64
 * @param tokenADecimals
 * @param tokenBDecimals
 * @returns
 */
export function sqrtPriceX64ToPrice(
  sqrtPriceX64: bigint,
  tokenADecimals: number,
  tokenBDecimals: number
): number {
  const price =
    (Number(sqrtPriceX64) / 2 ** 64) ** 2 *
    10 ** (tokenADecimals - tokenBDecimals);
  return Number(price);
}

/**
 * Returns decoded token transfers from direct child instructions
 * @param ins
 * @param block
 * @returns
 */
export function getDecodedInnerTransfers(
  ins: Instruction,
  block: Block
): DecodedTransfer[] {
  return getInnerTransfersByLevel(ins, block.instructions, 1).map((t) => {
    const programId = t.programId;
    const d1 = getInstructionD1(t);

    if (programId === tokenProgram.programId) {
      if (d1 === tokenProgram.instructions.transferChecked.d1) {
        return tokenProgram.instructions.transferChecked.decode(t);
      }
      if (d1 === tokenProgram.instructions.transfer.d1) {
        return tokenProgram.instructions.transfer.decode(t);
      }
    }
    if (programId === token2022Program.programId) {
      if (d1 === token2022Program.instructions.transferChecked.d1) {
        return token2022Program.instructions.transferChecked.decode(t);
      }
      if (d1 === token2022Program.instructions.transfer.d1) {
        return token2022Program.instructions.transfer.decode(t);
      }
    }

    throw new Error(`Unknown token transfer instruction: ${t.d1}`);
  });
}

/**
 * Get the account that is the source of the transaction
 * @param ins - The instruction to get the account from
 * @param block - The block containing the instruction
 * @return The account that is the source of the transaction
 */
export function getTransactionAccount(ins: Instruction, block: Block) {
  const tx = getTransaction(ins, block);
  return tx.accountKeys[0];
}

/**
 * Get the transaction that contains the instruction
 * @param ins - The instruction to get the transaction from
 * @param block - The block containing the instruction
 * @return The transaction that contains the instruction
 */
export function getTransaction(ins: Instruction, block: Block) {
  const tx = block.transactions.find(
    (t: any) => t.transactionIndex === ins.transactionIndex,
  );
  assert(tx, "transaction not found");

  return tx;
}


