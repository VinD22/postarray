/**
 * The logging seam.
 *
 * This package refuses to depend on a concrete logger: `@relay/observability`
 * owns redaction and transport, and the worker, the API and a test each want a
 * different sink. Callers pass one of these in; the default discards everything
 * so importing the package never writes to stdout on its own.
 *
 * TODO(database): swap the local type for `Logger` from `@relay/observability`
 * once that package exists. The shape below is deliberately a subset of it.
 */

export interface DatabaseLogFields {
  readonly [key: string]: string | number | boolean | undefined;
}

export interface DatabaseLogger {
  debug(message: string, fields?: DatabaseLogFields): void;
  info(message: string, fields?: DatabaseLogFields): void;
  warn(message: string, fields?: DatabaseLogFields): void;
  error(message: string, fields?: DatabaseLogFields): void;
}

export const noopLogger: DatabaseLogger = {
  debug: () => undefined,
  info: () => undefined,
  warn: () => undefined,
  error: () => undefined,
};

/**
 * A logger that writes JSON lines to stderr. Intended for the migrate, seed and
 * reset entry points, which are operator tools run in a terminal, not shipped
 * request paths.
 */
export function createStderrLogger(minimumLevel: LogLevel = 'info'): DatabaseLogger {
  const threshold = LEVEL_ORDER[minimumLevel];

  const write = (level: LogLevel, message: string, fields?: DatabaseLogFields): void => {
    if (LEVEL_ORDER[level] < threshold) return;
    const line = JSON.stringify({
      level,
      message,
      time: new Date().toISOString(),
      ...fields,
    });
    process.stderr.write(`${line}\n`);
  };

  return {
    debug: (message, fields) => write('debug', message, fields),
    info: (message, fields) => write('info', message, fields),
    warn: (message, fields) => write('warn', message, fields),
    error: (message, fields) => write('error', message, fields),
  };
}

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};
