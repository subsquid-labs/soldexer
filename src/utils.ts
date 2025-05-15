import * as process from 'node:process';
import { pino } from 'pino';

export function createLogger(ns: string) {
  return pino({
    level: process.env.LOG_LEVEL || 'info',
    messageKey: 'message',
    transport: {
      target: 'pino-pretty',
      options: {
        messageKey: 'message',
        singleLine: true,
      },
    },

    base: { ns: ns },
  });
}

export function getSortFunction(tokes: string[]) {
  const SORT_ORDER: Record<string, number> = tokes.reduce((acc, token, index) => ({ ...acc, [token]: index + 1 }), {});

  return (a: string, b: string) => {
    const sort = (SORT_ORDER[b] || Number.MAX_SAFE_INTEGER) - (SORT_ORDER[a] || Number.MAX_SAFE_INTEGER);

    if (sort !== 0) return sort > 0;

    return a.localeCompare(b) > 0;
  };
}
