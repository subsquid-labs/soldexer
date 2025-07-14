import { Block, Instruction } from '../../../../../utils';
import type { SolanaSwapTransfer } from '../../../';
import * as raydiumCpmm from '../../../../../abi/raydium_cpmm';
import { RaydiumCpmmSwapBaseInputHandler } from './base_input_handler';
import { RaydiumCpmmSwapBaseOutputHandler } from './base_output_handler';

const handlerRegistry = {
  [raydiumCpmm.instructions.swapBaseInput.d8]: RaydiumCpmmSwapBaseInputHandler,
  [raydiumCpmm.instructions.swapBaseOutput.d8]: RaydiumCpmmSwapBaseOutputHandler,
} as const;

export function handleRaydiumCpmm(
  instruction: Instruction,
  block: Block
): SolanaSwapTransfer {
  const Handler = handlerRegistry[instruction.d8];

  if (!Handler) {
    throw new Error(`Unknown swap instruction: ${instruction.d8}`);
  }

  return new Handler(instruction, block).handleSwap();
}


