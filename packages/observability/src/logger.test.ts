import { beforeEach, describe, expect, it } from 'vitest';

import { runWithContext } from './context';
import { childLogger, createLogger, resetLoggingConfiguration } from './logger';

const FAKE_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0In0.c2lnbmF0dXJlLXBsYWNlaG9sZGVy';

function collector(): { lines: Record<string, unknown>[]; stream: { write(chunk: string): void } } {
  const lines: Record<string, unknown>[] = [];
  return {
    lines,
    stream: {
      write(chunk: string) {
        for (const line of chunk.split('\n')) {
          if (line.trim() === '') continue;
          lines.push(JSON.parse(line) as Record<string, unknown>);
        }
      },
    },
  };
}

beforeEach(() => {
  resetLoggingConfiguration();
});

describe('createLogger', () => {
  it('emits JSON with the bound fields', () => {
    const sink = collector();
    const logger = createLogger(
      { service: 'worker', component: 'publish' },
      { pretty: false, destination: sink.stream, level: 'info' },
    );
    logger.info({ jobId: 'job_1', connectionId: 'conn_1', provider: 'x' }, 'publish.dispatched');

    expect(sink.lines).toHaveLength(1);
    const line = sink.lines[0] as Record<string, unknown>;
    expect(line['msg']).toBe('publish.dispatched');
    expect(line['service']).toBe('worker');
    expect(line['component']).toBe('publish');
    expect(line['jobId']).toBe('job_1');
    expect(line['connectionId']).toBe('conn_1');
    expect(line['provider']).toBe('x');
    expect(line['level']).toBe('info');
  });

  it('redacts a secret in the payload before serialization', () => {
    const sink = collector();
    const logger = createLogger({}, { pretty: false, destination: sink.stream });
    logger.info({ credentials: { accessToken: 'abc' }, provider: 'x' }, 'connection.refreshed');

    const line = sink.lines[0] as Record<string, unknown>;
    expect(line['credentials']).toBe('[redacted]');
    expect(JSON.stringify(line)).not.toContain('abc');
  });

  it('redacts a secret pasted into the message itself', () => {
    const sink = collector();
    const logger = createLogger({}, { pretty: false, destination: sink.stream });
    logger.warn(`provider replied ${FAKE_JWT}`);

    expect(String(sink.lines[0]?.['msg'])).not.toContain('eyJhbGciOi');
  });

  it('redacts a secret in a bound field', () => {
    const sink = collector();
    const logger = createLogger(
      { service: 'api', apiKey: 'super-secret' },
      { pretty: false, destination: sink.stream },
    );
    logger.info('boot');

    const line = sink.lines[0] as Record<string, unknown>;
    expect(line['apiKey']).toBe('[redacted]');
    expect(line['service']).toBe('api');
  });

  it('adds the ambient context to every line', () => {
    const sink = collector();
    const logger = createLogger({ service: 'api' }, { pretty: false, destination: sink.stream });

    runWithContext(
      {
        correlationId: 'corr_7',
        workspaceId: 'ws_9',
        actor: { type: 'user', id: 'user_1' },
        surface: 'api',
      },
      () => {
        logger.info('request.received');
      },
    );

    const line = sink.lines[0] as Record<string, unknown>;
    expect(line['correlationId']).toBe('corr_7');
    expect(line['workspaceId']).toBe('ws_9');
    expect(line['actorType']).toBe('user');
    expect(line['surface']).toBe('api');
  });

  it('honours the configured level', () => {
    const sink = collector();
    const logger = createLogger({}, { pretty: false, destination: sink.stream, level: 'warn' });
    logger.debug('ignored');
    logger.error('kept');
    expect(sink.lines).toHaveLength(1);
    expect(sink.lines[0]?.['msg']).toBe('kept');
  });

  it('serializes an error without leaking a token', () => {
    const sink = collector();
    const logger = createLogger({}, { pretty: false, destination: sink.stream });
    logger.error({ err: new Error(`publish failed ${FAKE_JWT}`) }, 'publish.failed');

    expect(JSON.stringify(sink.lines[0])).not.toContain('eyJhbGciOi');
  });
});

describe('childLogger', () => {
  it('inherits parent bindings and adds its own', () => {
    const sink = collector();
    const parent = createLogger({ service: 'worker' }, { pretty: false, destination: sink.stream });
    const child = childLogger(parent, { connectionId: 'conn_2', provider: 'linkedin' });
    child.info('activity.started');

    const line = sink.lines[0] as Record<string, unknown>;
    expect(line['service']).toBe('worker');
    expect(line['connectionId']).toBe('conn_2');
    expect(line['provider']).toBe('linkedin');
  });

  it('redacts child bindings, which pino serializes outside the formatter', () => {
    const sink = collector();
    const parent = createLogger({}, { pretty: false, destination: sink.stream });
    const child = childLogger(parent, { refreshToken: 'abc123' });
    child.info('activity.started');

    expect(JSON.stringify(sink.lines[0])).not.toContain('abc123');
  });
});
