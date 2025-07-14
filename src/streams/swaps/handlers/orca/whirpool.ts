import * as tokenProgram from "../../../../abi/tokenProgram";
import * as whirlpool from "../../../../abi/orca_whirlpool";
import type { Traded } from "../../../../abi/orca_whirlpool/types";
import type {
  SolanaSwapTransfer,
  TokenAmount,
} from "../../";
import {
  type Block,
  type Instruction,
  getInnerTransfersByLevel,
  getInstructionBalances,
  getInstructionLogs,
  sqrtPriceX64ToPrice,
} from "../../../../utils";
import {
  getInstructionDescriptor,
  type TokenBalance,
} from "@subsquid/solana-stream";

export function handleWhirlpool(
  ins: Instruction,
  block: Block
): SolanaSwapTransfer {
  const swapEvent = getSwapEvent(ins, block);
  const [
    {
      accounts: { destination: tokenInAccount, authority },
      data: { amount: inputTokenAmount },
    },
    {
      accounts: { source: tokenOutAccount },
      data: { amount: outputTokenAmount },
    },
  ] = getInnerTransfersByLevel(ins, block.instructions, 1).map((t) =>
    tokenProgram.instructions.transfer.decode(t)
  );
  const tokenBalances = getInstructionBalances(ins, block);
  const tokenIn = tokenBalances.find(
    (b: TokenBalance) => b.account === tokenInAccount
  );
  const tokenOut = tokenBalances.find(
    (b: TokenBalance) => b.account === tokenOutAccount
  );

  const swapPrice =
    tokenIn && tokenOut && swapEvent
      ? getPoolPrice(swapEvent, tokenIn, tokenOut)
      : null;

  const slippage =
    tokenIn && tokenOut && swapPrice && swapEvent
      ? getSlippage(
          tokenIn,
          tokenOut,
          inputTokenAmount,
          outputTokenAmount,
          swapEvent,
          swapPrice
        )
      : null;

  const {
    whirlpool: poolAddress,
    tokenVaultA,
    tokenVaultB,
  } = getPoolAccounts(ins);

  return {
    type: "orca_whirlpool",
    poolAddress,
    tokenA: swapEvent?.aToB ? tokenIn.postMint : tokenOut.postMint,
    tokenB: swapEvent?.aToB ? tokenOut.postMint : tokenIn.postMint,
    account: authority,
    in: {
      amount: inputTokenAmount,
      token: tokenIn,
    },
    out: {
      amount: outputTokenAmount,
      token: tokenOut,
    },
    slippage,
    reserves: getTokenReserves(ins, block, tokenVaultA, tokenVaultB),
  };
}

function getPoolPrice(
  swapEvent: Traded,
  tokenIn: TokenBalance,
  tokenOut: TokenBalance
) {
  const sqrtPrice = swapEvent.preSqrtPrice;
  const tokenADecimals = swapEvent.aToB
    ? tokenIn.postDecimals
    : tokenOut.postDecimals;
  const tokenBDecimals = swapEvent.aToB
    ? tokenOut.postDecimals
    : tokenIn.postDecimals;

  if (tokenADecimals === undefined || tokenBDecimals === undefined) {
    console.error("No token decimals found");
    return null;
  }
  const poolPrice = sqrtPriceX64ToPrice(
    sqrtPrice,
    tokenADecimals,
    tokenBDecimals
  );

  return poolPrice;
}

// Calculate slippage based on the pre-swap price and the amount of tokens received
function getSlippage(
  tokenIn: TokenBalance,
  tokenOut: TokenBalance,
  inputTokenAmount: bigint,
  outputTokenAmount: bigint,
  swapEvent: Traded,
  poolPrice: number
): number {
  if (tokenIn.postDecimals === undefined || tokenOut.postDecimals === undefined) {
    throw new Error("No token decimals found");
  }

  const inputAmount = Number(inputTokenAmount) / 10 ** tokenIn.postDecimals;
  const expectedAmount = swapEvent.aToB
    ? inputAmount * poolPrice
    : inputAmount / poolPrice;
  const actualAmount = Number(outputTokenAmount) / 10 ** tokenOut.postDecimals;
  const slippage = ((expectedAmount - actualAmount) / expectedAmount) * 100;

  return slippage;
}

function getSwapEvent(ins: Instruction, block: Block): Traded | null {
  const logs = getInstructionLogs(ins, block);
  if (logs.length > 1) {
    const hex = Buffer.from(logs[1].message, "base64").toString("hex");
    return whirlpool.events.Traded.decode({ msg: `0x${hex}` });
  }

  return null;
}

function getPoolAccounts(ins: Instruction) {
  const descriptor = getInstructionDescriptor(ins);
  if (descriptor === whirlpool.instructions.swap.d8) {
    return whirlpool.instructions.swap.decode(ins).accounts;
  }

  return whirlpool.instructions.swapV2.decode(ins).accounts;
}

function getTokenReserves(
  ins: Instruction,
  block: Block,
  tokenAVault: string,
  tokenBVault: string
): {
  tokenA: TokenAmount;
  tokenB: TokenAmount;
} {
  const tokenBalances = getInstructionBalances(ins, block);
  const tokenA = tokenBalances.find(
    (b: TokenBalance) => b.account === tokenAVault
  );
  const tokenB = tokenBalances.find(
    (b: TokenBalance) => b.account === tokenBVault
  );

  if (!tokenA || !tokenB) {
    throw new Error("No token balances found");
  }

  return {
    tokenA: {
      mint: tokenA.preMint,
      amount: BigInt(tokenA.preAmount),
      decimals: tokenA.preDecimals,
    },
    tokenB: {
      mint: tokenB.preMint,
      amount: BigInt(tokenB.preAmount),
      decimals: tokenB.preDecimals,
    },
  };
}
