import { describe, expect, it } from 'vitest';

import { FixedClock } from './clock';
import { MemoryKeyValueStore } from './key-value';
import { MemoryStorage } from './storage';
import { RecordingMailer } from './mailer';
import { InMemoryScheduler, publishWorkflowId } from './scheduler';

describe('MemoryKeyValueStore', () => {
  it('round trips a value', async () => {
    const kv = new MemoryKeyValueStore(new FixedClock());
    await kv.set('a', 'one');
    expect(await kv.get('a')).toBe('one');
  });

  it('expires a value once its ttl has passed', async () => {
    const clock = new FixedClock('2026-08-04T09:00:00.000Z');
    const kv = new MemoryKeyValueStore(clock);
    await kv.set('a', 'one', { ttlSeconds: 60 });
    clock.advance(59_000);
    expect(await kv.get('a')).toBe('one');
    clock.advance(2_000);
    expect(await kv.get('a')).toBeNull();
  });

  it('refuses to overwrite when the caller asked for a reservation', async () => {
    const kv = new MemoryKeyValueStore(new FixedClock());
    expect(await kv.set('a', 'first', { ifAbsent: true })).toBe(true);
    expect(await kv.set('a', 'second', { ifAbsent: true })).toBe(false);
    expect(await kv.get('a')).toBe('first');
  });

  it('lets a reservation succeed again once the previous one expired', async () => {
    const clock = new FixedClock('2026-08-04T09:00:00.000Z');
    const kv = new MemoryKeyValueStore(clock);
    await kv.set('a', 'first', { ifAbsent: true, ttlSeconds: 10 });
    clock.advance(11_000);
    expect(await kv.set('a', 'second', { ifAbsent: true })).toBe(true);
  });

  it('increments and keeps the original expiry', async () => {
    const clock = new FixedClock('2026-08-04T09:00:00.000Z');
    const kv = new MemoryKeyValueStore(clock);
    expect(await kv.increment('count', 1, 60)).toBe(1);
    expect(await kv.increment('count', 2)).toBe(3);
    clock.advance(61_000);
    expect(await kv.get('count')).toBeNull();
  });

  it('deletes a key', async () => {
    const kv = new MemoryKeyValueStore(new FixedClock());
    await kv.set('a', 'one');
    await kv.delete('a');
    expect(await kv.get('a')).toBeNull();
  });
});

describe('MemoryStorage', () => {
  it('writes, reads and checksums an object', async () => {
    const storage = new MemoryStorage(new FixedClock());
    const bytes = new TextEncoder().encode('hello');
    const written = await storage.write('ws-1/a', bytes, 'text/plain');
    expect(written.byteSize).toBe(5);
    expect(written.checksumSha256).toMatch(/^[0-9a-f]{64}$/);
    expect(await storage.read('ws-1/a')).toEqual(bytes);
  });

  it('reports a missing object rather than inventing one', async () => {
    const storage = new MemoryStorage(new FixedClock());
    expect(await storage.head('nothing')).toBeNull();
    await expect(storage.read('nothing')).rejects.toMatchObject({ code: 'MEDIA_INVALID' });
  });

  it('issues an upload ticket carrying the expected checksum header', async () => {
    const storage = new MemoryStorage(new FixedClock());
    const ticket = await storage.createUploadTicket({
      workspaceId: 'ws-1',
      key: 'ws-1/abc',
      contentType: 'image/png',
      byteSize: 10,
      checksumSha256: 'a'.repeat(64),
    });
    expect(ticket.method).toBe('PUT');
    expect(ticket.headers['x-relay-content-sha256']).toBe('a'.repeat(64));
  });
});

describe('RecordingMailer', () => {
  it('captures the message key rather than rendered English', async () => {
    const mailer = new RecordingMailer();
    await mailer.send({
      to: ['someone@example.com'],
      subjectKey: 'email.invitation.subject',
      bodyKey: 'email.invitation.body',
      params: { role: 'editor' },
      locale: 'en',
      workspaceId: 'ws-1',
    });
    expect(mailer.sent).toHaveLength(1);
    expect(mailer.sent[0]?.subjectKey).toBe('email.invitation.subject');
  });
});

describe('InMemoryScheduler', () => {
  it('mints a deterministic workflow id', async () => {
    const scheduler = new InMemoryScheduler(new FixedClock());
    const started = await scheduler.schedulePublish({
      jobId: 'job-1',
      workspaceId: 'ws-1',
      executeAt: new Date('2026-08-05T09:00:00.000Z'),
      idempotencyKey: 'pj_abc',
    });
    expect(started.workflowId).toBe(publishWorkflowId('ws-1', 'job-1'));
  });

  it('never starts a second workflow for the same job', async () => {
    const scheduler = new InMemoryScheduler(new FixedClock());
    const input = {
      jobId: 'job-1',
      workspaceId: 'ws-1',
      executeAt: new Date('2026-08-05T09:00:00.000Z'),
      idempotencyKey: 'pj_abc',
    };
    const first = await scheduler.schedulePublish(input);
    const second = await scheduler.schedulePublish({
      ...input,
      executeAt: new Date('2026-08-06T09:00:00.000Z'),
    });
    expect(second.workflowId).toBe(first.workflowId);
    expect(scheduler.publishes.size).toBe(1);
    expect(scheduler.publishes.get('job-1')?.executeAt.toISOString()).toBe(
      '2026-08-05T09:00:00.000Z',
    );
  });

  it('records a cancellation with its reason', async () => {
    const scheduler = new InMemoryScheduler(new FixedClock());
    await scheduler.schedulePublish({
      jobId: 'job-1',
      workspaceId: 'ws-1',
      executeAt: new Date('2026-08-05T09:00:00.000Z'),
      idempotencyKey: 'pj_abc',
    });
    await scheduler.cancelPublish({ jobId: 'job-1', reason: 'user_canceled' });
    expect(scheduler.publishes.get('job-1')?.canceled).toBe(true);
    expect(await scheduler.describe('job-1')).toEqual({
      status: 'CANCELED',
      historyLength: 1,
    });
  });

  it('reports nothing for a job it never saw', async () => {
    const scheduler = new InMemoryScheduler(new FixedClock());
    expect(await scheduler.describe('job-unknown')).toBeNull();
  });
});
