import path from 'node:path';
import { createClickhouseClient, ensureTables } from '../db/clickhouse';
import { ClickhouseState } from '@sqd-pipes/core';
import { SolanaSwapsStream } from '../streams/swaps';
import { logger, getSortFunction } from '../utils';

const TRACKED_TOKENS = [
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
  'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', // USDT
  'So11111111111111111111111111111111111111112', // SOL
];

/**
 * Generate sort tokens function sorting tokens naturally
 * to preserve the same pair order, i.e., ORCA/SOL and never SOL/ORCA.
 */
const sortTokens = getSortFunction(TRACKED_TOKENS);

export async function swapsIndexer() {
  const clickhouse = createClickhouseClient();

  /**
   * Create a stream to read swaps from the Solana blockchain
   * from 3 different DEXs:
   * - Orca
   * - Raydium
   * - Meteora
   */
  const ds = new SolanaSwapsStream({
    portal: process.env.PORTAL_URL || 'https://portal.sqd.dev/datasets/solana-beta',
    blockRange: {
      from: process.env.SWAPS_FROM_BLOCK || 332557468,
      to: process.env.SWAPS_TO_BLOCK,
    },
    args: {
      tokens: TRACKED_TOKENS,
    },
    /**
     * We can use the state to track the last block processed
     * and resume from there.
     */
    state: new ClickhouseState(clickhouse, {
      table: 'solana_sync_status',
      id: 'dex_swaps',
    }),

    logger,
  });

  /**
   * Ensure tables are created in ClickHouse
   */
  await ensureTables(clickhouse, path.join(__dirname, '../db/sql/swaps.sql'));

  for await (const swaps of await ds.stream()) {
    await clickhouse.insert({
      table: 'solana_swaps_raw',
      values: swaps
        /**
         * Filter out swaps with zero amounts
         */
        .filter((s) => s.input.amount > 0 && s.output.amount > 0)
        .map((s) => {
          /**
           * Check if we need to swap tokens to preserve the same pair order, i.e., ORCA/SOL and never SOL/ORCA.
           */
          const needTokenSwap = sortTokens(s.input.mint, s.output.mint);

          const tokenA = !needTokenSwap ? s.input : s.output;
          const tokenB = !needTokenSwap ? s.output : s.input;

          const amountA = ((needTokenSwap ? 1 : -1) * Number(tokenA.amount)) / 10 ** tokenA.decimals;
          const amountB = ((needTokenSwap ? -1 : 1) * Number(tokenB.amount)) / 10 ** tokenB.decimals;

          return {
            dex: s.type,
            block_number: s.block.number,
            transaction_hash: s.transaction.hash,
            transaction_index: s.transaction.index,
            instruction_address: s.instruction.address,
            account: s.account,
            token_a: tokenA.mint,
            token_b: tokenB.mint,
            amount_a: amountA.toString(),
            amount_b: amountB.toString(),
            timestamp: s.timestamp,
            sign: 1,
          };
        }),
      format: 'JSONEachRow',
    });

    await ds.ack();
  }
}
