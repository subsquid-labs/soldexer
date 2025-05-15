import { ClickHouseError } from '@clickhouse/client';
import { NodeClickHouseClient } from '@clickhouse/client/dist/client';
import { Logger, Offset } from '../portal_abstract_stream';
import { AbstractState, State } from '../state';

const table = (table: string) => `
    CREATE TABLE IF NOT EXISTS ${table}
    (
        "id"      String,
        "initial" String,
        "offset"  String,
        "ts"      DateTime(3)
    ) ENGINE = ReplacingMergeTree()
ORDER BY (id)
`;

type Options = {
  database?: string;
  table: string;
  id?: string;
  logger?: Logger;
  onStateRollback?: (state: ClickhouseState, offset: Offset) => Promise<void>;
};

export class ClickhouseState extends AbstractState implements State {
  options: Options & Required<Pick<Options, 'database' | 'id'>>;
  initial?: Offset;

  private readonly fullTableName: string;

  constructor(
    private client: NodeClickHouseClient,
    options: Options,
  ) {
    super();

    this.options = {
      database: 'default',
      id: 'stream',
      ...options,
    };

    this.fullTableName = `"${this.options.database}"."${this.options.table}"`;
  }

  async saveOffset(offset: Offset) {
    await this.client.insert({
      table: this.options.table,
      values: [
        {
          id: this.options.id,
          initial: this.initial,
          offset: this.encodeOffset(offset),
          ts: Date.now(),
        },
      ].filter(Boolean),
      format: 'JSONEachRow',
    });
  }

  async getOffset(defaultValue: Offset) {
    try {
      const res = await this.client.query({
        query: `SELECT *
                FROM "${this.options.database}"."${this.options.table}" FINAL
                WHERE id = {id:String}
                LIMIT 1`,
        format: 'JSONEachRow',
        query_params: { id: this.options.id },
      });

      const [row] = await res.json<{ initial: string; offset: string }>();

      if (row) {
        this.initial = this.decodeOffset(row.initial);

        return { current: this.decodeOffset(row.offset), initial: this.initial };
      } else {
        this.initial = defaultValue;
        await this.saveOffset(defaultValue);

        return;
      }
    } catch (e: unknown) {
      if (e instanceof ClickHouseError && e.type === 'UNKNOWN_TABLE') {
        await this.client.command({
          query: table(this.fullTableName),
        });

        this.initial = defaultValue;
        await this.saveOffset(defaultValue);

        return;
      }

      throw e;
    }
  }

  async cleanAllBeforeOffset({
    table,
    offset,
    column,
    filter,
  }: { table: string | string[]; offset: number; column: string; filter?: string }) {
    if (!offset) return;

    const tables = typeof table === 'string' ? [table] : table;

    await Promise.all(
      tables.map(async (table) => {
        // FIXME Can cause OOM
        const res = await this.client.query({
          query: `SELECT *
                FROM ${table} FINAL
                WHERE ${column} >= {current_offset:UInt32} ${filter ? `AND ${filter}` : ''}`,
          format: 'JSONEachRow',
          query_params: { current_offset: offset },
        });

        const rows = await res.json();
        if (rows.length === 0) {
          return;
        }

        this.options.logger?.info(`Rolling back ${rows.length} rows from ${table}`);

        await this.client.insert({
          table,
          values: rows.map((row: any) => ({ ...row, sign: -1 })),
          format: 'JSONEachRow',
        });
      }),
    );
  }
}
