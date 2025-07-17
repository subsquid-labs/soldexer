const SCALING_FACTOR = 10n ** 18n

export function getVirtualTokenPrice(virtualSolReserves: bigint, virtualTokenReserves: bigint) {
  return (virtualSolReserves * SCALING_FACTOR) / virtualTokenReserves
}
