import path from 'node:path';
import { ClickhouseState } from '@sqd-pipes/core';
import { SolanaPumpfunTokensStream } from '../streams/pumpfun';
import { ensureTables, createClickhouseClient } from '../db/clickhouse'
import { logger } from '../utils/logger';

export async function pumpfunIndexer() {
  const clickhouse = createClickhouseClient()

  const ds = new SolanaPumpfunTokensStream({
    portal: process.env.PORTAL_URL || 'https://portal.sqd.dev/datasets/solana-beta',
    blockRange: {
      from: process.env.PUMPFUN_FROM_BLOCK || 332557468,
      to: process.env.PUMPFUN_TO_BLOCK,
    },
    state: new ClickhouseState(clickhouse, {
      table: 'solana_sync_status',
      id: 'solana_pumpfun',
    }),
    logger,
  });

  await ensureTables(clickhouse, path.join(__dirname, '../db/sql/pumpfun.sql'));

  for await (const tokens of await ds.stream()) {
    await clickhouse.insert({
      table: 'solana_pumpfun_tokens',
      format: 'JSONEachRow',
      values: tokens.map((t) => ({
        name: t.name,
        symbol: t.symbol,
        address: t.address,
        metadata_uri: t.uri,
        timestamp: t.deployTime,
      })),
    });

    await ds.ack();
  }
}

