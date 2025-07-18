import * as raydiumCpmm from '../../../../../abi/raydium_cpmm';
import type {
  SolanaSwapTransfer,
  TokenAmount,
} from '../../../';
import {
  type Block,
  type Instruction,
  getDecodedInnerTransfers,
  getInstructionBalances,
} from '../../../../../utils';

interface Token {
  mint: string;
  decimals: number;
}

/**
 * Base class for Raydium CPMM swap handlers
 */
export abstract class RaydiumCpmmSwapBaseHandler {
  // 0.25%
  protected static PROTOCOL_FEE = 25n;
  protected static FEE_DENOMINATOR = 10000n;

  constructor(
    protected instruction: Instruction,
    protected block: Block,
    private decodeMethod: 'swapBaseInput' | 'swapBaseOutput'
  ) {}

  abstract handleSwap(): SolanaSwapTransfer;

  protected getInputAndOutputTokenAmounts(): {
    inputTokenAmount: TokenAmount;
    outputTokenAmount: TokenAmount;
    tokenInAccount: string;
    tokenOutAccount: string;
    authority?: string;
    owner?: string;
  } {
    const { inputToken, outputToken } = this.getTokenData();
    const swapTransfers = getDecodedInnerTransfers(
      this.instruction,
      this.block
    );
    if (swapTransfers.length < 2) {
      throw new Error(
        'Expected 2 decoded transfers accounting for tokenIn and tokenOut'
      );
    }

    const [
      {
        // Transfer instructions take in authority account while TransferChecked instructions take in owner account
        accounts: { destination: tokenInAccount, authority, owner },
        data: { amount: amountInputToken },
      },
      {
        accounts: { source: tokenOutAccount },
        data: { amount: amountOutputToken },
      },
    ] = swapTransfers;

    return {
      authority,
      owner,
      tokenInAccount,
      tokenOutAccount,
      inputTokenAmount: {
        mint: inputToken.mint,
        amount: amountInputToken,
        decimals: inputToken.decimals,
      },
      outputTokenAmount: {
        mint: outputToken.mint,
        amount: amountOutputToken,
        decimals: outputToken.decimals,
      },
    };
  }

  protected getAccounts(): {
    poolAddress: string;
    inputVault: string;
    outputVault: string;
    inputTokenMint: string;
    outputTokenMint: string;
  } {
    const {
      accounts: {
        inputTokenMint,
        outputTokenMint,
        inputVault,
        outputVault,
        poolState: poolAddress,
      },
    } = raydiumCpmm.instructions[this.decodeMethod].decode(this.instruction);

    return {
      poolAddress,
      inputVault,
      outputVault,
      inputTokenMint,
      outputTokenMint,
    };
  }

  protected getTokenData(): { inputToken: Token; outputToken: Token } {
    const { inputVault, outputVault } = this.getAccounts();
    const tokenBalances = getInstructionBalances(this.instruction, this.block);
    const inputVaultTokenBalance = tokenBalances.find(
      (tb) => tb.account === inputVault
    );
    const outputVaultTokenBalance = tokenBalances.find(
      (tb) => tb.account === outputVault
    );

    return {
      inputToken: {
        mint: inputVaultTokenBalance.account,
        decimals: inputVaultTokenBalance.postDecimals,
      },
      outputToken: {
        mint: outputVaultTokenBalance.account,
        decimals: outputVaultTokenBalance.postDecimals,
      },
    };
  }

  protected getTokenReserves({
    inputVault,
    outputVault,
    token0Mint,
    token1Mint,
    inputTokenMint,
  }: {
    inputVault: string;
    outputVault: string;
    token0Mint: string;
    token1Mint: string;
    inputTokenMint: string;
  }): { token0: TokenAmount; token1: TokenAmount } {
    const tokenBalances = getInstructionBalances(this.instruction, this.block);

    const inputVaultTokenBalance = tokenBalances.find(
      (tb) => tb.account === inputVault
    );
    const outputVaultTokenBalance = tokenBalances.find(
      (tb) => tb.account === outputVault
    );

    if (!inputVaultTokenBalance) {
      throw new Error('Input reserves balance not found');
    }

    if (!outputVaultTokenBalance) {
      throw new Error('Output reserves balance not found');
    }

    const {
      preAmount: preSwapInputTokenReserves,
      postDecimals: inputTokenDecimals,
    } = inputVaultTokenBalance;

    const {
      preAmount: preSwapOutputTokenReserves,
      postDecimals: outputTokenDecimals,
    } = outputVaultTokenBalance;

    const isToken0Input = inputTokenMint === token0Mint;
    const isToken1Input = inputTokenMint === token1Mint;

    const token0Reserves = {
      amount: isToken0Input
        ? BigInt(preSwapInputTokenReserves)
        : BigInt(preSwapOutputTokenReserves),
      decimals: isToken0Input ? inputTokenDecimals : outputTokenDecimals,
    };

    const token1Reserves = {
      amount: isToken1Input
        ? BigInt(preSwapInputTokenReserves)
        : BigInt(preSwapOutputTokenReserves),
      decimals: isToken1Input ? inputTokenDecimals : outputTokenDecimals,
    };

    return {
      token0: {
        mint: token0Mint,
        amount: token0Reserves.amount,
        decimals: token0Reserves.decimals,
      },
      token1: {
        mint: token1Mint,
        amount: token1Reserves.amount,
        decimals: token1Reserves.decimals,
      },
    };
  }

  protected getPoolPrice(token0: TokenAmount, token1: TokenAmount): number {
    const token0Reserves = Number(token0.amount) / 10 ** token0.decimals;
    const token1Reserves = Number(token1.amount) / 10 ** token1.decimals;
    return token0Reserves / token1Reserves;
  }
}
