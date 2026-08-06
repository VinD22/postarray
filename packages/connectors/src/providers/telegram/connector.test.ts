import { describe, expect, it } from 'vitest';

import {
  createTestDeps,
  expectPublished,
  mustImplement,
  testConnection,
  testDraft,
  testGrant,
  testPublishRequest,
  testStatusRequest,
  type TestDepsOptions,
} from '../shared/testing';
import { createTelegramConnector } from './connector';
import { buildTelegramCapabilities } from './capabilities';

const NOW = '2026-08-04T12:00:00.000Z';

const chatId = '-1001234567890';

function connectorFor(routes: TestDepsOptions['routes']) {
  return createTestDeps({ routes, now: new Date(NOW) });
}

const connection = () =>
  testConnection({
    provider: 'telegram',
    externalAccountId: 'bot-42',
    accountType: 'community',
    metadata: {
      providerOptions: { chatId },
    },
  });

const getMeRoute = {
  method: 'POST' as const,
  match: '/getMe',
  body: {
    ok: true,
    result: { id: 42, is_bot: true, first_name: 'Relay Bot', username: 'relay_bot' },
  },
};

const sendMessageRoute = {
  method: 'POST' as const,
  match: '/sendMessage',
  body: {
    ok: true,
    result: {
      message_id: 9001,
      chat: { id: Number(chatId), type: 'channel', title: 'News' },
      text: 'Hello',
    },
  },
};

const sendPhotoRoute = {
  method: 'POST' as const,
  match: '/sendPhoto',
  body: {
    ok: true,
    result: {
      message_id: 9002,
      chat: { id: Number(chatId), type: 'channel', title: 'News' },
      text: 'Caption',
    },
  },
};

describe('telegram connector', () => {
  it('declares honest identity metadata', () => {
    const { deps } = connectorFor([]);
    const connector = createTelegramConnector(deps);
    expect(connector.identity().provider).toBe('telegram');
    expect(connector.identity().features['publish']).toBe('supported');
    expect(connector.identity().features['post_analytics']).toBe('unsupported');
  });

  it('discovers the bot as the connected account', async () => {
    const { deps } = connectorFor([getMeRoute]);
    const connector = createTelegramConnector(deps);
    const accounts = await connector.discoverAccounts(
      testGrant({ provider: 'telegram', scopes: ['bot'] }),
    );
    expect(accounts).toHaveLength(1);
    expect(accounts[0]?.externalAccountId).toBe('42');
    expect(accounts[0]?.handle).toBe('relay_bot');
  });

  it('publishes a text post into the configured chat', async () => {
    const { deps, simulator } = connectorFor([sendMessageRoute]);
    const connector = createTelegramConnector(deps);
    const snap = buildTelegramCapabilities({ connection: connection(), observedAt: NOW });
    const draft = testDraft({ connection: connection(), capabilities: snap, body: 'Hello world' });
    const result = expectPublished(
      await connector.publish(testPublishRequest({ draft, preparedMedia: [] })),
    );
    expect(result.externalPostId).toBe('9001');
    const sent = simulator.callsTo('/sendMessage')[0];
    expect(sent?.json).toMatchObject({ chat_id: chatId, text: 'Hello world' });
  });

  it('sends an image post by URL through sendPhoto', async () => {
    const { deps, simulator } = connectorFor([sendPhotoRoute]);
    const connector = createTelegramConnector(deps);
    const snap = buildTelegramCapabilities({ connection: connection(), observedAt: NOW });
    const media = [
      {
        mediaId: 'media_photo_1',
        derivativeId: null,
        kind: 'image' as const,
        mimeType: 'image/jpeg',
        byteSize: 120_000,
        width: 1200,
        height: 900,
        durationSeconds: null,
        altText: null,
        altTextWaived: false,
        checksum: 'a'.repeat(64),
        sourceUrl: 'https://storage.invalid/media/photo',
        sourceUrlExpiresAt: '2026-08-04T13:00:00.000Z',
      },
    ];
    const draft = testDraft({
      connection: connection(),
      capabilities: snap,
      body: 'Look at this',
      media,
    });
    const prepared = await connector.prepareMedia({
      connection: connection(),
      postVariantId: 'pv_test_0001',
      contentKind: 'image',
      media,
      idempotencyKey: 'idem-test-00000001',
      capabilities: snap,
    });
    const result = expectPublished(
      await connector.publish(testPublishRequest({ draft, preparedMedia: prepared })),
    );
    expect(result.externalPostId).toBe('9002');
    const sent = simulator.callsTo('/sendPhoto')[0];
    expect(sent?.json).toMatchObject({
      chat_id: chatId,
      photo: 'https://storage.invalid/media/photo',
      caption: 'Look at this',
    });
  });

  it('reports unknown when there is no read-back for a message', async () => {
    const { deps } = connectorFor([]);
    const connector = createTelegramConnector(deps);
    const status = await connector.getStatus(
      testStatusRequest({ connection: connection(), externalPostId: '9001' }),
    );
    expect(status.state).toBe('unknown');
    expect(status.sanitizedResponse).toEqual({ reason: 'no_message_read_back' });
  });

  it('deletes a message with the stored chat id', async () => {
    const { deps, simulator } = connectorFor([
      { method: 'POST', match: '/deleteMessage', body: { ok: true, result: true } },
    ]);
    const connector = createTelegramConnector(deps);
    await mustImplement(
      connector.deletePost,
      'deletePost',
    )({
      connection: connection(),
      externalPostId: '9001',
      confirmedByActorId: 'usr_1',
    });
    const sent = simulator.callsTo('/deleteMessage')[0];
    expect(sent?.json).toMatchObject({ chat_id: chatId, message_id: 9001 });
  });
});
