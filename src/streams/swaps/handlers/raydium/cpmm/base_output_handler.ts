import { type TokenBalance } from '@subsquid/solana-stream';
import type { SolanaSwapTransfer } from '../../../';
import {
  type Block,
  type Instruction,
  getInstructionBalances,
  sortAccounts,
} from '../../../../../utils';
import { RaydiumCpmmSwapBaseHandler } from './base_cpmm_handler';

export class RaydiumCpmmSwapBaseOutputHandler extends RaydiumCpmmSwapBaseHandler {
  constructor(instruction: Instruction, block: Block) {
    super(instruction, block, 'swapBaseOutput');
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

    const account = authority || owner;
    if (!account) {
      throw new Error('Expected either authority or owner account');
    }

    const slippage = this.getSlippageSwapBaseOutput(
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
      type: 'raydium_cpmm',
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

  private getSlippageSwapBaseOutput(
    inputToken: { amount: bigint; decimals: number },
    outputToken: { amount: bigint; decimals: number },
    inputTokenReserves: { amount: bigint; decimals: number },
    outputTokenReserves: { amount: bigint; decimals: number }
  ) {
    const expectedAmountInBigInt = this.getAmountIn(
      outputToken.amount,
      inputTokenReserves.amount,
      outputTokenReserves.amount
    );

    const amountIn = Number(inputToken.amount) / 10 ** inputToken.decimals;
    const expectedAmountIn =
      Number(expectedAmountInBigInt) / 10 ** inputToken.decimals;

    const slippage = ((amountIn - expectedAmountIn) / expectedAmountIn) * 100;

    return slippage;
  }

  private getAmountIn(
    amountOut: bigint,
    reserveIn: bigint,
    reserveOut: bigint
  ): number {
    const numerator =
      reserveIn * amountOut * RaydiumCpmmSwapBaseHandler.FEE_DENOMINATOR;
    const denominator =
      (reserveOut - amountOut) *
      (RaydiumCpmmSwapBaseHandler.FEE_DENOMINATOR -
        RaydiumCpmmSwapBaseHandler.PROTOCOL_FEE);
    return Number(numerator / denominator);
  }
}
