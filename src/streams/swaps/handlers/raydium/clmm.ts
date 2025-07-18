import { type TokenBalance, getInstructionDescriptor } from '@subsquid/solana-stream';
import {
  type Block,
  type Instruction,
  getDecodedInnerTransfers,
  getInstructionBalances,
  getInstructionLogs,
  sortAccounts,
  sqrtPriceX64ToPrice,
} from '../../../../utils';
import * as raydiumClmm from '../../../../abi/raydium_clmm';
import type { SwapEvent } from '../../../../abi/raydium_clmm/types';
import type { SolanaSwapTransfer, SwapType, TokenAmount } from '../../';

type RaydiumForks = Extract<SwapType, 'raydium_clmm' | 'byreal_clmm' | 'pancake_clmm'>

export function handleRaydiumClmm(
  ins: Instruction,
  block: Block,
  fork: RaydiumForks = 'raydium_clmm',
): SolanaSwapTransfer {
  const {
    accounts: { poolState: poolAddress, inputVault, outputVault },
  } = decodeSwap(ins);
  const swapEvent = getSwapEvent(ins, block);
  const decodedTransfers = getDecodedInnerTransfers(ins, block);
  if (decodedTransfers.length < 2) {
    throw new Error('Expected 2 decoded transfers accounting for tokenIn and tokenOut');
  }

  const [
    {
      // Transfer instructions take in authority account while TransferChecked instructions take in owner account
      accounts: { destination: tokenInAccount, authority, owner },
      data: { amount: inputTokenAmount },
    },
    {
      accounts: { source: tokenOutAccount },
      data: { amount: outputTokenAmount },
    },
  ] = decodedTransfers;

  const account = authority || owner;
  if (!account) {
    throw new Error('Account not found in transfer instruction');
  }

  const tokenBalances = getInstructionBalances(ins, block);
  const tokenIn = tokenBalances.find((b: TokenBalance) => b.account === tokenInAccount);
  const tokenOut = tokenBalances.find((b: TokenBalance) => b.account === tokenOutAccount);
  const swapPrice =
    tokenIn && tokenOut && swapEvent ? getPoolPrice(swapEvent, tokenIn, tokenOut) : null;

  const slippage =
    tokenIn && tokenOut && swapPrice && swapEvent
      ? getSlippage(tokenIn, tokenOut, inputTokenAmount, outputTokenAmount, swapEvent, swapPrice)
      : null;

  // Get vault tokens to determine token mints
  const inputVaultToken = tokenBalances.find((b: TokenBalance) => b.account === inputVault);
  const outputVaultToken = tokenBalances.find((b: TokenBalance) => b.account === outputVault);

  if (!inputVaultToken || !outputVaultToken) {
    throw new Error('Could not find vault tokens in token balances');
  }

  const [token0Mint, token1Mint] = sortAccounts(
    inputVaultToken.postMint,
    outputVaultToken.postMint,
  );

  const token0Vault = inputVaultToken.postMint === token0Mint ? inputVault : outputVault;
  const token1Vault = outputVaultToken.postMint === token1Mint ? outputVault : inputVault;

  return {
    type: 'raydium_clmm',
    poolAddress,
    tokenA: token0Mint,
    tokenB: token1Mint,
    account,
    in: {
      amount: inputTokenAmount,
      token: tokenIn,
    },
    out: {
      amount: outputTokenAmount,
      token: tokenOut,
    },
    slippage,
    reserves: getTokenReserves(ins, block, token0Vault, token1Vault),
  };
}

function getPoolPrice(
  swapEvent: raydiumClmm.events.SwapEvent,
  tokenIn: TokenBalance,
  tokenOut: TokenBalance,
): number {
  const sqrtPrice = swapEvent.sqrtPriceX64;
  const tokenADecimals = swapEvent.zeroForOne ? tokenIn.postDecimals : tokenOut.postDecimals;
  const tokenBDecimals = swapEvent.zeroForOne ? tokenOut.postDecimals : tokenIn.postDecimals;

  // Token decimals can be zero
  if (tokenADecimals === undefined || tokenBDecimals === undefined) {
    throw new Error('No token decimals found');
  }

  const poolPrice = sqrtPriceX64ToPrice(sqrtPrice, tokenADecimals, tokenBDecimals);

  return poolPrice;
}

function getSwapEvent(ins: Instruction, block: Block): SwapEvent | null {
  const logs = getInstructionLogs(ins, block);
  if (logs.length > 1) {
    const hex = Buffer.from(logs[1].message, 'base64').toString('hex');
    return raydiumClmm.events.SwapEvent.decode({ msg: `0x${hex}` });
  }
  return null;
}

// Calculate slippage based on the post-swap price and the amount of input token
function getSlippage(
  tokenIn: TokenBalance,
  tokenOut: TokenBalance,
  inputTokenAmount: bigint,
  outputTokenAmount: bigint,
  swapEvent: SwapEvent,
  postPoolPrice: number,
): number {
  if (tokenIn.postDecimals === undefined || tokenOut.postDecimals === undefined) {
    throw new Error('No token decimals found');
  }

  const actualAmount = Number(outputTokenAmount) / 10 ** tokenOut.postDecimals;
  const actualInputAmount = Number(inputTokenAmount) / 10 ** tokenIn.postDecimals;

  const expectedInputAmount = swapEvent.zeroForOne
    ? actualAmount / postPoolPrice
    : actualAmount * postPoolPrice;

  const slippage = ((actualInputAmount - expectedInputAmount) / expectedInputAmount) * 100;

  return slippage;
}

// TODO: should handle swapRouterBaseIn instruction
function decodeSwap(ins: Instruction) {
  const descriptor = getInstructionDescriptor(ins);

  if (descriptor === raydiumClmm.instructions.swap.d8) {
    return raydiumClmm.instructions.swap.decode(ins);
  }

  return raydiumClmm.instructions.swapV2.decode(ins);
}

function getTokenReserves(
  ins: Instruction,
  block: Block,
  token0Vault: string,
  token1Vault: string,
): { tokenA: TokenAmount; tokenB: TokenAmount } {
  const tokenBalances = getInstructionBalances(ins, block);
  const token0 = tokenBalances.find((b: TokenBalance) => b.account === token0Vault);
  const token1 = tokenBalances.find((b: TokenBalance) => b.account === token1Vault);

  if (!token0 || !token1) {
    throw new Error('No token balances found');
  }

  return {
    tokenA: {
      mint: token0.postMint,
      amount: BigInt(token0.postAmount),
      decimals: token0.postDecimals,
    },
    tokenB: {
      mint: token1.postMint,
      amount: BigInt(token1.postAmount),
      decimals: token1.postDecimals,
    },
  };
}
