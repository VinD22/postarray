import { LOG_LEVELS, redactRecord, redactString, type LogLevel } from '@relay/config';
import pino, { type DestinationStream, type Logger, type LoggerOptions } from 'pino';

import { contextFields } from './context';

/**
 * Structured logging.
 *
 * Every line carries the ambient correlation id, workspace, actor and surface,
 * plus whatever job, connection and provider the caller binds. Every payload
 * goes through `@relay/config` redaction BEFORE serialization, so a token can
 * never reach a transport buffer.
 *
 * Pretty output in development, newline delimited JSON everywhere else.
 */

export interface LogBindings {
  /** The app emitting the line: web, api, worker, mcp, cli, links. */
  readonly service?: string;
  readonly component?: string;
  readonly correlationId?: string;
  readonly workspaceId?: string;
  readonly jobId?: string;
  readonly connectionId?: string;
  readonly provider?: string;
  readonly [key: string]: unknown;
}

export interface LoggerSettings {
  readonly level?: LogLevel;
  /** Human readable output. Defaults to true only in development. */
  readonly pretty?: boolean;
  readonly environment?: string;
  /** Write somewhere other than stdout. Used by tests. */
  readonly destination?: DestinationStream;
}

let defaults: LoggerSettings = {};

/** Set process wide logger defaults once, from the loaded configuration. */
export function configureLogging(settings: LoggerSettings): void {
  defaults = { ...defaults, ...settings };
}

/** Reset to environment derived defaults. Used by tests. */
export function resetLoggingConfiguration(): void {
  defaults = {};
}

function isLogLevel(value: string | undefined): value is LogLevel {
  return value !== undefined && (LOG_LEVELS as readonly string[]).includes(value);
}

function resolveLevel(settings: LoggerSettings): LogLevel {
  if (settings.level !== undefined) return settings.level;
  if (defaults.level !== undefined) return defaults.level;
  const fromEnv = process.env['LOG_LEVEL'];
  return isLogLevel(fromEnv) ? fromEnv : 'info';
}

function resolveEnvironment(settings: LoggerSettings): string {
  return settings.environment ?? defaults.environment ?? process.env['NODE_ENV'] ?? 'development';
}

function resolvePretty(settings: LoggerSettings, environment: string): boolean {
  if (settings.pretty !== undefined) return settings.pretty;
  if (defaults.pretty !== undefined) return defaults.pretty;
  return environment === 'development';
}

/** Redact a single log argument. Strings are scanned, objects are deep cloned. */
function redactArgument(argument: unknown): unknown {
  if (typeof argument === 'string') return redactString(argument);
  if (argument === null || typeof argument !== 'object') return argument;
  return redactRecord(argument as Record<string, unknown>);
}

function buildOptions(bindings: LogBindings, settings: LoggerSettings): LoggerOptions {
  const environment = resolveEnvironment(settings);
  const pretty = resolvePretty(settings, environment);

  const options: LoggerOptions = {
    level: resolveLevel(settings),
    base: redactRecord({ environment, ...bindings }),
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: {
      level: (label: string) => ({ level: label }),
      // The single choke point for object payloads: the merged log object and
      // the mixin output both pass through here before serialization.
      log: (payload: Record<string, unknown>) => redactRecord(payload),
    },
    // Message strings and interpolation arguments are scanned here, before the
    // formatters run, so a token pasted into a message never survives.
    hooks: {
      logMethod(args, method) {
        method.apply(this, args.map(redactArgument) as Parameters<typeof method>);
      },
    },
    mixin: () => contextFields(),
  };

  if (pretty) {
    return {
      ...options,
      transport: {
        target: 'pino-pretty',
        options: { colorize: true, translateTime: 'SYS:standard', ignore: 'pid,hostname' },
      },
    };
  }
  return options;
}

/**
 * Create a root logger for a surface.
 *
 * ```ts
 * const logger = createLogger({ service: 'worker', component: 'publish' });
 * logger.info({ jobId, connectionId, provider }, 'publish.dispatched');
 * ```
 */
export function createLogger(bindings: LogBindings = {}, settings: LoggerSettings = {}): Logger {
  const options = buildOptions(bindings, settings);
  const destination = settings.destination ?? defaults.destination;
  if (destination !== undefined) {
    // A transport and an explicit destination are mutually exclusive in pino.
    const { transport: _transport, ...withoutTransport } = options;
    return pino(withoutTransport, destination);
  }
  return pino(options);
}

/**
 * Derive a child logger. Bindings are redacted here because pino serializes
 * child bindings once, outside the log formatter.
 */
export function childLogger(parent: Logger, bindings: LogBindings): Logger {
  return parent.child(redactRecord(bindings));
}

let rootLogger: Logger | undefined;

/** A lazily created process wide logger for code with nowhere to inject one. */
export function getRootLogger(): Logger {
  rootLogger ??= createLogger({ service: process.env['RELAY_SERVICE'] ?? 'relay' });
  return rootLogger;
}

/** Replace the process wide logger. Used by app bootstraps and by tests. */
export function setRootLogger(logger: Logger | undefined): void {
  rootLogger = logger;
}

export type { Logger } from 'pino';
