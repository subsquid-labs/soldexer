import assert from 'assert'
import { getInstructionData } from '@subsquid/solana-stream'
import { toHex } from '@subsquid/util-internal-hex'
import * as tokenProgram from '../abi/tokenProgram'

export * from './logger'

export function getSortFunction(tokes: string[]) {
  const SORT_ORDER: Record<string, number> = tokes.reduce((acc, token, index) => ({ ...acc, [token]: index + 1 }), {})

  return (a: string, b: string) => {
    const sort = (SORT_ORDER[b] || Number.MAX_SAFE_INTEGER) - (SORT_ORDER[a] || Number.MAX_SAFE_INTEGER)

    if (sort !== 0) return sort > 0

    return a.localeCompare(b) > 0
  }
}

export type Instruction = any
export type Block = any

export function getInstructionBalances(ins: Instruction, block: Block) {
  return block.tokenBalances?.filter((t) => t.transactionIndex === ins.transactionIndex) || []
}

export function getTransactionHash(ins: Instruction, block: Block) {
  const tx = block.transactions.find((t) => t.transactionIndex === ins.transactionIndex)
  assert(tx, 'transaction not found')

  return tx.signatures[0]
}

export function getInnerTransfersByLevel(parent: Instruction, instructions: Instruction[], level: number) {
  return instructions.filter((inner) => {
    if (inner.transactionIndex !== parent.transactionIndex) return false
    if (inner.instructionAddress.length !== parent.instructionAddress.length + level) return false
    if (inner.programId !== tokenProgram.programId) return false

    // All child instructions should have the same prefix as the parent
    return parent.instructionAddress.every((v, i) => v === inner.instructionAddress[i])
  })
}

export function getInstructionD1(instruction: Instruction) {
  return toHex(getInstructionData(instruction)).slice(0, 4)
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
        log.instructionAddress.every((v, i) => v === ins.instructionAddress[i]),
    ) || []
  )
}
