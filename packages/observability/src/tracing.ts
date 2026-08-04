import {
  SpanStatusCode,
  trace,
  type Attributes,
  type Span,
  type Tracer,
} from '@opentelemetry/api';

import { getRootLogger } from './logger.js';

/**
 * Tracing.
 *
 * A complete no-op when `OTEL_EXPORTER_OTLP_ENDPOINT` is unset: the SDK is not
 * even imported, and `withSpan` still runs the wrapped function through the
 * OpenTelemetry API's built-in no-op tracer.
 *
 * Telemetry never changes program behaviour. Every call in this module is
 * wrapped so a broken exporter cannot fail a publish.
 */

export const TRACER_NAME = '@relay/observability';

interface ShutdownableSdk {
  shutdown(): Promise<void>;
}

let sdk: ShutdownableSdk | undefined;
let started = false;

export interface TracingOptions {
  /** Defaults to `OTEL_EXPORTER_OTLP_ENDPOINT`. Tracing is off when absent. */
  readonly endpoint?: string;
  readonly serviceVersion?: string;
  readonly environment?: string;
  readonly headers?: Readonly<Record<string, string>>;
}

export function isTracingEnabled(): boolean {
  return started;
}

/**
 * Boot the OpenTelemetry Node SDK. Returns false when tracing is not
 * configured, which is the normal local development state.
 */
export async function startTracing(
  serviceName: string,
  options: TracingOptions = {},
): Promise<boolean> {
  if (started) return true;

  const endpoint = options.endpoint ?? process.env['OTEL_EXPORTER_OTLP_ENDPOINT'];
  if (endpoint === undefined || endpoint.trim() === '') return false;

  try {
    const [{ NodeSDK }, { OTLPTraceExporter }] = await Promise.all([
      import('@opentelemetry/sdk-node'),
      import('@opentelemetry/exporter-trace-otlp-http'),
    ]);

    const exporter = new OTLPTraceExporter({
      url: `${endpoint.replace(/\/$/, '')}/v1/traces`,
      headers: { ...options.headers },
    });

    const instance = new NodeSDK({
      serviceName,
      traceExporter: exporter,
      instrumentations: [],
    });
    instance.start();
    sdk = instance;
    started = true;
    return true;
  } catch (error) {
    getRootLogger().warn(
      { err: error, component: 'tracing' },
      'tracing.start_failed',
    );
    return false;
  }
}

/** Flush and stop the SDK. Safe to call when tracing never started. */
export async function shutdownTracing(): Promise<void> {
  const instance = sdk;
  sdk = undefined;
  started = false;
  if (instance === undefined) return;
  try {
    await instance.shutdown();
  } catch (error) {
    getRootLogger().warn({ err: error, component: 'tracing' }, 'tracing.shutdown_failed');
  }
}

function getTracer(): Tracer | undefined {
  try {
    return trace.getTracer(TRACER_NAME);
  } catch {
    return undefined;
  }
}

function safe(action: () => void): void {
  try {
    action();
  } catch {
    // Telemetry must never break the operation it is measuring.
  }
}

/** Record an attribute on the active span, if there is one. */
export function setSpanAttributes(attributes: Attributes): void {
  safe(() => {
    trace.getActiveSpan()?.setAttributes(attributes);
  });
}

/** Add an event to the active span, if there is one. */
export function addSpanEvent(name: string, attributes?: Attributes): void {
  safe(() => {
    trace.getActiveSpan()?.addEvent(name, attributes);
  });
}

/**
 * Run `fn` inside a span. Errors are recorded and rethrown unchanged. Failures
 * inside the tracing calls themselves are swallowed.
 */
export async function withSpan<T>(
  name: string,
  attributes: Attributes,
  fn: (span: Span | undefined) => Promise<T> | T,
): Promise<T> {
  const tracer = getTracer();
  if (tracer === undefined) return await fn(undefined);

  let invoked = false;

  const run = async (span: Span | undefined): Promise<T> => {
    invoked = true;
    try {
      const result = await fn(span);
      if (span !== undefined) safe(() => span.setStatus({ code: SpanStatusCode.OK }));
      return result;
    } catch (error) {
      if (span !== undefined) {
        safe(() => {
          span.setStatus({
            code: SpanStatusCode.ERROR,
            message: error instanceof Error ? error.name : 'error',
          });
          if (error instanceof Error) span.recordException(error);
        });
      }
      throw error;
    } finally {
      if (span !== undefined) safe(() => span.end());
    }
  };

  try {
    return await tracer.startActiveSpan(name, { attributes }, (span: Span) => run(span));
  } catch (error) {
    // If the failure came from `fn`, propagate it. If the tracer itself broke
    // before `fn` ran, run the work anyway: telemetry never blocks the product.
    if (invoked) throw error;
    return await run(undefined);
  }
}
