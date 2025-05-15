import { Logger, Offset } from './portal_abstract_stream';

export interface State<Args extends any[] = any[]> {
  logger: Logger;

  setLogger(logger: Logger): void;

  saveOffset(offset: Offset, ...args: Args): Promise<unknown>;

  getOffset(v: Offset): Promise<{ current: Offset; initial: Offset } | undefined>;

  onStateRollback?(offset: Offset): Promise<void>;
}

export abstract class AbstractState {
  logger: Logger;

  setLogger(logger: Logger) {
    this.logger = logger;
  }

  encodeOffset(offset: Offset): string {
    return JSON.stringify(offset);
  }

  decodeOffset(offset: string): Offset {
    return {
      timestamp: 0,
      number: 0,
      parentBlockHash: '',
      ...(JSON.parse(offset) || {}),
    };
  }
}
