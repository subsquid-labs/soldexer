import { type TokenBalance } from "@subsquid/solana-stream";
import type { SolanaSwapTransfer } from '../../../';
import {
  type Block,
  type Instruction,
  getInstructionBalances,
  sortAccounts,
} from "../../../../../utils";
import { RaydiumCpmmSwapBaseHandler } from "./base_cpmm_handler";

interface TokenAmount {
  amount: bigint;
  decimals: number;
}

export class RaydiumCpmmSwapBaseInputHandler extends RaydiumCpmmSwapBaseHandler {
  constructor(instruction: Instruction, block: Block) {
    super(instruction, block, "swapBaseInput");
  }

  handleSwap(): SolanaSwapTransfer {
    const {
      inputVault,
      outputVault,
      inputTokenMint,
      outputTokenMint,
      poolAddress,
    } = this.getAccounts();

    const [token0Mint, token1Mint] = sortAccounts(
      inputTokenMint,
      outputTokenMint
    );

    const { token0, token1 } = this.getTokenReserves({
      inputVault,
      outputVault,
      token0Mint,
      token1Mint,
      inputTokenMint,
    });

    const {
      inputTokenAmount,
      outputTokenAmount,
      authority,
      owner,
      tokenInAccount,
      tokenOutAccount,
    } = this.getInputAndOutputTokenAmounts();

    const account = authority || owner
    if (!account) {
      throw new Error('Expected either authority or owner account');
    }

    const slippage = this.getSlippageSwapBaseInput(
      inputTokenAmount,
      outputTokenAmount,
      token0,
      token1
    );

    const instructionTokenBalances = getInstructionBalances(
      this.instruction,
      this.block
    );

    return {
      type: "raydium_cpmm",
      poolAddress,
      tokenA: token0Mint,
      tokenB: token1Mint,
      account,
      in: {
        amount: inputTokenAmount.amount,
        token: instructionTokenBalances.find(
          (b: TokenBalance) => b.account === tokenInAccount
        ),
      },
      out: {
        amount: outputTokenAmount.amount,
        token: instructionTokenBalances.find(
          (b: TokenBalance) => b.account === tokenOutAccount
        ),
      },
      slippage,
      reserves: {
        tokenA: token0,
        tokenB: token1,
      },
    };
  }

  private getSlippageSwapBaseInput(
    inputToken: TokenAmount,
    outputToken: TokenAmount,
    inputTokenReserves: TokenAmount,
    outputTokenReserves: TokenAmount
  ) {
    const expectedAmountOutBigInt = this.getAmountOut(
      inputToken.amount,
      inputTokenReserves.amount,
      outputTokenReserves.amount
    );

    const amountOut = Number(outputToken.amount) / 10 ** outputToken.decimals;
    const expectedAmountOut =
      Number(expectedAmountOutBigInt) / 10 ** outputToken.decimals;

    const slippage =
      ((expectedAmountOut - amountOut) / expectedAmountOut) * 100;

    return slippage;
  }

  private getAmountOut(
    amountIn: bigint,
    reserveIn: bigint,
    reserveOut: bigint
  ): number {
    const amountInWithFee =
      amountIn *
      (RaydiumCpmmSwapBaseHandler.FEE_DENOMINATOR -
        RaydiumCpmmSwapBaseHandler.PROTOCOL_FEE);
    const numerator = amountInWithFee * reserveOut;
    const denominator =
      reserveIn * RaydiumCpmmSwapBaseHandler.FEE_DENOMINATOR + amountInWithFee;
    return Number(numerator / denominator);
  }
}

