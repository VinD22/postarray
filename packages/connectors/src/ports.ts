/* eslint-disable no-restricted-globals -- this file is the single documented
   boundary where the ambient system clock is read. Everything else in this
   package takes a `Clock` so tests can fake time. */

/**
 * The small ports every other module in this package depends on.
 *
 * `packages/connectors` sits at the edge of the system: it must be usable from
 * a Temporal activity, a NestJS controller, the CLI and a unit test without
 * dragging a logging transport or a real clock behind it. So the clock, the
 * logger and the sleeper are injected, never imported.
 *
 * The `ConnectorLogger` shape is a structural subset of the logger returned by
 * `createLogger()` in `@relay/observability`, so callers pass that directly:
 *
 * ```ts
 * const http = new ProviderHttpClient({
 *   provider: 'x',
 *   logger: createLogger({ service: 'worker', component: 'connector' }),
 *   clock: systemClock,
 * });
 * ```
 */

/** Time source. `{ now(): Date }` per the shared application service contract. */
export interface Clock {
  now(): Date;
}

/** The ambient system clock. Production wiring only; tests pass a fake. */
export const systemClock: Clock = Object.freeze({
  now(): Date {
    return new Date();
  },
});

/** A clock pinned to a fixed instant, advanced explicitly. Test helper. */
export interface MutableClock extends Clock {
  advance(milliseconds: number): void;
  set(instant: Date): void;
}

export function fixedClock(start: Date | string): MutableClock {
  let current = typeof start === 'string' ? new Date(start) : new Date(start.getTime());
  return {
    now(): Date {
      return new Date(current.getTime());
    },
    advance(milliseconds: number): void {
      current = new Date(current.getTime() + milliseconds);
    },
    set(instant: Date): void {
      current = new Date(instant.getTime());
    },
  };
}

/**
 * Delay. Injected so a retry backoff, a simulated provider latency and a
 * polling loop are all instant in tests and real in production.
 */
export interface Sleeper {
  sleep(milliseconds: number, signal?: AbortSignal): Promise<void>;
}

export const realSleeper: Sleeper = Object.freeze({
  sleep(milliseconds: number, signal?: AbortSignal): Promise<void> {
    if (milliseconds <= 0) {
      return Promise.resolve();
    }
    return new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => {
        signal?.removeEventListener('abort', onAbort);
        resolve();
      }, milliseconds);
      const onAbort = (): void => {
        clearTimeout(timer);
        reject(signal?.reason ?? new Error('ABORTED'));
      };
      if (signal !== undefined) {
        if (signal.aborted) {
          clearTimeout(timer);
          reject(signal.reason ?? new Error('ABORTED'));
          return;
        }
        signal.addEventListener('abort', onAbort, { once: true });
      }
    });
  },
});

/** Records requested delays instead of waiting. Test helper. */
export interface RecordingSleeper extends Sleeper {
  readonly waits: readonly number[];
}

export function recordingSleeper(): RecordingSleeper {
  const waits: number[] = [];
  return {
    waits,
    sleep(milliseconds: number): Promise<void> {
      waits.push(milliseconds);
      return Promise.resolve();
    },
  };
}

export type LogFields = Readonly<Record<string, unknown>>;

/**
 * Structural subset of the `@relay/observability` logger. Fields go first so a
 * caller cannot accidentally interpolate a secret into the message string.
 */
export interface ConnectorLogger {
  debug(fields: LogFields, message: string): void;
  info(fields: LogFields, message: string): void;
  warn(fields: LogFields, message: string): void;
  error(fields: LogFields, message: string): void;
}

/** Discards everything. The default, so no module needs a logger to work. */
export const noopLogger: ConnectorLogger = Object.freeze({
  debug(): void {},
  info(): void {},
  warn(): void {},
  error(): void {},
});

/** Keeps lines in memory so a test can assert what was and was not logged. */
export interface CapturedLogLine {
  readonly level: 'debug' | 'info' | 'warn' | 'error';
  readonly fields: LogFields;
  readonly message: string;
}

export interface CapturingLogger extends ConnectorLogger {
  readonly lines: readonly CapturedLogLine[];
  /** Everything logged, serialized. Used by redaction assertions. */
  serialized(): string;
}

export function capturingLogger(): CapturingLogger {
  const lines: CapturedLogLine[] = [];
  const push =
    (level: CapturedLogLine['level']) =>
    (fields: LogFields, message: string): void => {
      lines.push({ level, fields, message });
    };
  return {
    lines,
    debug: push('debug'),
    info: push('info'),
    warn: push('warn'),
    error: push('error'),
    serialized(): string {
      return lines
        .map((line) => {
          try {
            return `${line.level} ${line.message} ${JSON.stringify(line.fields)}`;
          } catch {
            return `${line.level} ${line.message} [unserializable]`;
          }
        })
        .join('\n');
    },
  };
}

/** ISO instant from a clock, the only formatting helper this package needs. */
export function nowInstant(clock: Clock): string {
  return clock.now().toISOString();
}

/** Epoch milliseconds to an ISO instant. Date arithmetic, not clock reading. */
export function instantOf(epochMilliseconds: number): string {
  return new Date(epochMilliseconds).toISOString();
}

/** ISO instant to epoch milliseconds. `NaN` when the input is not parseable. */
export function epochMillisecondsOf(instant: string): number {
  return new Date(instant).getTime();
}

/** `instant` shifted by `seconds`, as an ISO instant. */
export function shiftInstant(instant: string, seconds: number): string {
  return instantOf(epochMillisecondsOf(instant) + seconds * 1000);
}
