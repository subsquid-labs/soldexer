import path from 'node:path';
import { ClickhouseState } from '@sqd-pipes/core';
import { SolanaPumpfunTokensStream } from '../streams/pumpfun';
import { NodeClickHouseClient } from '@clickhouse/client/dist/client';
import { ensureTables } from '../db/clickhouse'
import { logger } from '../utils/logger';
import { IndexerFunction, PipeConfig } from 'src/main';

export const pumpfunIndexer: IndexerFunction = async (portalUrl: string, clickhouse: NodeClickHouseClient, config: PipeConfig) => {
  const ds = new SolanaPumpfunTokensStream({
    portal: `${portalUrl}/datasets/solana-beta`,
    blockRange: {
      from: config.fromBlock,
      to: config.toBlock,
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


