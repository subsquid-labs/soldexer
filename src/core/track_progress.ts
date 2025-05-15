import { ProgressState } from './portal_abstract_stream';

export type TrackProgressOptions<Offset> = {
  intervalSeconds?: number;
  getLatestOffset: () => Promise<Offset>;
  onProgress: (progress: ProgressState) => void;
  initial?: Offset;
};

export class TrackProgress<Offset extends { number: number } = any> {
  initial?: { offset: Offset; ts: number };
  last: { offset: Offset; ts: number };
  current: { offset: Offset; ts: number };
  interval?: NodeJS.Timeout;

  stopped = false;

  constructor(private options: TrackProgressOptions<Offset>) {
    if (options.initial) {
      this.initial = { offset: options.initial, ts: Date.now() };
    }
  }

  track(offset: Offset) {
    if (!this.initial) {
      this.initial = { offset, ts: Date.now() };
    }
    this.current = { offset, ts: Date.now() };

    if (this.interval || this.stopped) return;

    const { intervalSeconds = 5, onProgress } = this.options;

    this.interval = setInterval(async () => {
      if (!this.current || !this.initial) return;

      const last = await this.options.getLatestOffset();

      const processedTotal = this.last ? this.current.offset.number - this.last.offset.number : 0;
      const elapsed = this.last ? (Date.now() - this.last.ts) / 1000 : 0;
      const processedPerSecond = processedTotal && elapsed ? Math.floor(processedTotal / elapsed) : 0;

      const diffFromStart = this.current.offset.number - this.initial?.offset.number;
      const diffToEnd = last.number - this.initial.offset.number;

      onProgress({
        state: {
          last: last.number,
          initial: this.initial.offset.number,
          current: this.current.offset.number,
          percent: (diffFromStart / diffToEnd) * 100,
        },
        interval: {
          processedTotal,
          processedPerSecond,
        },
      });

      this.last = this.current;
    }, intervalSeconds * 1000);
  }

  stop() {
    this.stopped = true;
    clearInterval(this.interval);
  }
}
