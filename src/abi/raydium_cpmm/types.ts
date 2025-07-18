import {Codec, struct, u8, bool, u16, u64, address, fixedArray, u128, ref} from '@subsquid/borsh'

/**
 * Holds the current owner of the factory
 */
export interface AmmConfig {
    bump: number
    disableCreatePool: boolean
    index: number
    tradeFeeRate: bigint
    protocolFeeRate: bigint
    fundFeeRate: bigint
    createPoolFee: bigint
    protocolOwner: string
    fundOwner: string
    padding: Array<bigint>
}

/**
 * Holds the current owner of the factory
 */
export const AmmConfig: Codec<AmmConfig> = struct({
    bump: u8,
    disableCreatePool: bool,
    index: u16,
    tradeFeeRate: u64,
    protocolFeeRate: u64,
    fundFeeRate: u64,
    createPoolFee: u64,
    protocolOwner: address,
    fundOwner: address,
    padding: fixedArray(u64, 16),
})

/**
 * Emitted when deposit and withdraw
 */
export interface LpChangeEvent {
    poolId: string
    lpAmountBefore: bigint
    token0VaultBefore: bigint
    token1VaultBefore: bigint
    token0Amount: bigint
    token1Amount: bigint
    token0TransferFee: bigint
    token1TransferFee: bigint
    changeType: number
}

/**
 * Emitted when deposit and withdraw
 */
export const LpChangeEvent: Codec<LpChangeEvent> = struct({
    poolId: address,
    lpAmountBefore: u64,
    token0VaultBefore: u64,
    token1VaultBefore: u64,
    token0Amount: u64,
    token1Amount: u64,
    token0TransferFee: u64,
    token1TransferFee: u64,
    changeType: u8,
})

/**
 * The element of observations in ObservationState
 */
export interface Observation {
    blockTimestamp: bigint
    cumulativeToken0PriceX32: bigint
    cumulativeToken1PriceX32: bigint
}

/**
 * The element of observations in ObservationState
 */
export const Observation: Codec<Observation> = struct({
    blockTimestamp: u64,
    cumulativeToken0PriceX32: u128,
    cumulativeToken1PriceX32: u128,
})

export interface ObservationState {
    initialized: boolean
    observationIndex: number
    poolId: string
    observations: Array<Observation>
    padding: Array<bigint>
}

export const ObservationState: Codec<ObservationState> = struct({
    initialized: bool,
    observationIndex: u16,
    poolId: address,
    observations: fixedArray(ref(() => Observation), 100),
    padding: fixedArray(u64, 4),
})

export interface PoolState {
    ammConfig: string
    poolCreator: string
    token0Vault: string
    token1Vault: string
    lpMint: string
    token0Mint: string
    token1Mint: string
    token0Program: string
    token1Program: string
    observationKey: string
    authBump: number
    status: number
    lpMintDecimals: number
    mint0Decimals: number
    mint1Decimals: number
    lpSupply: bigint
    protocolFeesToken0: bigint
    protocolFeesToken1: bigint
    fundFeesToken0: bigint
    fundFeesToken1: bigint
    openTime: bigint
    recentEpoch: bigint
    padding: Array<bigint>
}

export const PoolState: Codec<PoolState> = struct({
    ammConfig: address,
    poolCreator: address,
    token0Vault: address,
    token1Vault: address,
    lpMint: address,
    token0Mint: address,
    token1Mint: address,
    token0Program: address,
    token1Program: address,
    observationKey: address,
    authBump: u8,
    status: u8,
    lpMintDecimals: u8,
    mint0Decimals: u8,
    mint1Decimals: u8,
    lpSupply: u64,
    protocolFeesToken0: u64,
    protocolFeesToken1: u64,
    fundFeesToken0: u64,
    fundFeesToken1: u64,
    openTime: u64,
    recentEpoch: u64,
    padding: fixedArray(u64, 31),
})

/**
 * Emitted when swap
 */
export interface SwapEvent {
    poolId: string
    inputVaultBefore: bigint
    outputVaultBefore: bigint
    inputAmount: bigint
    outputAmount: bigint
    inputTransferFee: bigint
    outputTransferFee: bigint
    baseInput: boolean
}

/**
 * Emitted when swap
 */
export const SwapEvent: Codec<SwapEvent> = struct({
    poolId: address,
    inputVaultBefore: u64,
    outputVaultBefore: u64,
    inputAmount: u64,
    outputAmount: u64,
    inputTransferFee: u64,
    outputTransferFee: u64,
    baseInput: bool,
})
