import { describe, expect, it, vi } from 'vitest';

import type { Logger } from '@relay/observability';

import { ResendMailer } from './resend-mailer';

function logger(): Logger {
  return { info: vi.fn() } as unknown as Logger;
}

const invitation = {
  to: ['person@example.com'],
  subjectKey: 'email.invitation.subject',
  bodyKey: 'email.invitation.body',
  params: {
    workspaceName: 'Studio North',
    role: 'editor',
    invitationUrl: 'https://relay.example/invitations/accept?token=hidden',
    expiresAt: '2026-08-07T00:00:00.000Z',
  },
  locale: 'en',
  workspaceId: 'ws_test',
} as const;

const spanishDigest = {
  to: ['person@example.com'],
  subjectKey: 'email.digest.subject',
  bodyKey: 'email.digest.intro',
  params: {
    workspaceName: 'Studio North',
    windowStart: '2026-08-03',
    windowEnd: '2026-08-09',
  },
  locale: 'es',
  workspaceId: 'ws_test',
} as const;

describe('ResendMailer', () => {
  it('renders a catalog message and sends it without logging the address', async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ id: 'email_1' }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    );
    const testLogger = logger();
    const mailer = new ResendMailer({
      apiUrl: 'https://api.resend.com/emails',
      apiKey: 'test_key',
      from: 'Relay <mail@example.com>',
      logger: testLogger,
      fetchImpl,
    });

    await mailer.send(invitation);

    const request = fetchImpl.mock.calls[0];
    expect(request?.[0]).toBe('https://api.resend.com/emails');
    expect(JSON.parse(String(request?.[1]?.body))).toEqual({
      from: 'Relay <mail@example.com>',
      to: ['person@example.com'],
      subject: 'You were invited to Studio North',
      text: 'You were invited to Studio North with the editor role. Accept the invitation here: https://relay.example/invitations/accept?token=hidden. This link expires at 2026-08-07T00:00:00.000Z.',
    });
    expect(testLogger.info).toHaveBeenCalledWith(
      expect.objectContaining({ recipientCount: 1 }),
      'mail.sent',
    );
    expect(testLogger.info).not.toHaveBeenCalledWith(
      expect.objectContaining({ to: expect.anything() }),
      expect.anything(),
    );
  });

  it('sanitizes provider failures', async () => {
    const mailer = new ResendMailer({
      apiUrl: 'https://api.resend.com/emails',
      apiKey: 'test_key',
      from: 'mail@example.com',
      logger: logger(),
      fetchImpl: vi.fn<typeof fetch>().mockResolvedValue(new Response('secret', { status: 500 })),
    });

    await expect(mailer.send(invitation)).rejects.toMatchObject({
      code: 'PROVIDER_UNAVAILABLE',
      details: { provider: 'email', reason: 'response_rejected' },
    });
  });

  it('rejects message content outside the i18n catalog', async () => {
    const fetchImpl = vi.fn<typeof fetch>();
    const mailer = new ResendMailer({
      apiUrl: 'https://api.resend.com/emails',
      apiKey: 'test_key',
      from: 'mail@example.com',
      logger: logger(),
      fetchImpl,
    });

    await expect(
      mailer.send({ ...invitation, subjectKey: 'literal user-visible subject' }),
    ).rejects.toMatchObject({ code: 'INTERNAL' });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('renders a weekly digest with the locale carried by its MailMessage', async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ id: 'email_digest_1' }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    );
    const testLogger = logger();
    const mailer = new ResendMailer({
      apiUrl: 'https://api.resend.com/emails',
      apiKey: 'test_key',
      from: 'Relay <mail@example.com>',
      logger: testLogger,
      fetchImpl,
    });

    await mailer.send(spanishDigest);

    const request = fetchImpl.mock.calls[0];
    expect(JSON.parse(String(request?.[1]?.body))).toEqual({
      from: 'Relay <mail@example.com>',
      to: ['person@example.com'],
      subject: 'Tu semana en Studio North',
      text: 'Esto es lo que podemos ver para Studio North entre 2026-08-03 y 2026-08-09.',
    });
    expect(testLogger.info).toHaveBeenCalledWith(
      expect.objectContaining({ locale: 'es', recipientCount: 1 }),
      'mail.sent',
    );
  });
});
