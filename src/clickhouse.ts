import fs from 'node:fs/promises';
import path from 'node:path';
import * as process from 'node:process';
import { ClickHouseClient, createClient } from '@clickhouse/client';

export async function loadSqlFiles(directoryOrFile: string): Promise<string[]> {
  let sqlFiles: string[] = [];

  if (directoryOrFile.endsWith('.sql')) {
    sqlFiles = [directoryOrFile];
  } else {
    const files = await fs.readdir(directoryOrFile);
    sqlFiles = files.filter((file) => path.extname(file) === '.sql').map((file) => path.join(directoryOrFile, file));
  }

  const tables = await Promise.all(sqlFiles.map((file) => fs.readFile(file, 'utf-8')));

  return tables.flatMap((table) => table.split(';').filter((t) => t.trim().length > 0));
}

export async function ensureTables(clickhouse: ClickHouseClient, dir: string) {
  const tables = await loadSqlFiles(dir);

  for (const table of tables) {
    try {
      await clickhouse.command({ query: table });
    } catch (e: any) {
      console.error(`======================`);
      console.error(table.trim());
      console.error(`======================`);
      console.error(`Failed to create table: ${e.message}`);
      if (!e.message) console.error(e);

      process.exit(1);
    }
  }
}

export function createClickhouseClient() {
  return createClient({
    url: process.env.CLICKHOUSE_URL || 'http://localhost:8123',
    username: process.env.CLICKHOUSE_USER || 'default',
    password: process.env.CLICKHOUSE_PASSWORD || '',
    clickhouse_settings: {
      date_time_input_format: 'best_effort',
    },
  });
}
