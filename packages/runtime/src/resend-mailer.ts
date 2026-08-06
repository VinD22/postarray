import { z } from 'zod';

import type { MailMessage, MailerPort } from '@relay/application';
import { ERROR_CODES, RelayError } from '@relay/contracts';
import { createTranslator, loadCatalog, messageKeys } from '@relay/i18n';
import type { Logger } from '@relay/observability';

const resendResponseSchema = z.object({ id: z.string().min(1) }).strict();
const knownMessageKeys = new Set<string>(messageKeys());

export interface ResendMailerOptions {
  readonly apiUrl: string;
  readonly apiKey: string;
  readonly from: string;
  readonly logger: Logger;
  readonly fetchImpl?: typeof fetch;
  readonly timeoutMs?: number;
}

/** Transactional email adapter. Message content is rendered only from i18n catalogs. */
export class ResendMailer implements MailerPort {
  readonly #apiUrl: string;
  readonly #apiKey: string;
  readonly #from: string;
  readonly #logger: Logger;
  readonly #fetch: typeof fetch;
  readonly #timeoutMs: number;

  constructor(options: ResendMailerOptions) {
    this.#apiUrl = options.apiUrl;
    this.#apiKey = options.apiKey;
    this.#from = options.from;
    this.#logger = options.logger;
    this.#fetch = options.fetchImpl ?? fetch;
    this.#timeoutMs = options.timeoutMs ?? 15_000;
  }

  async send(message: MailMessage): Promise<void> {
    this.#assertMessageKey(message.subjectKey);
    this.#assertMessageKey(message.bodyKey);

    const catalog = await loadCatalog(message.locale);
    const translator = createTranslator(message.locale, catalog);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.#timeoutMs);

    let response: Response;
    try {
      response = await this.#fetch(this.#apiUrl, {
        method: 'POST',
        headers: {
          authorization: `Bearer ${this.#apiKey}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          from: this.#from,
          to: message.to,
          subject: translator.format(message.subjectKey, message.params),
          text: translator.format(message.bodyKey, message.params),
        }),
        signal: controller.signal,
      });
    } catch (cause) {
      throw this.#unavailable('request_failed', cause);
    } finally {
      clearTimeout(timer);
    }

    if (!response.ok) {
      throw this.#unavailable('response_rejected');
    }

    const body: unknown = await response.json().catch(() => null);
    const parsed = resendResponseSchema.safeParse(body);
    if (!parsed.success) {
      throw this.#unavailable('response_invalid');
    }

    this.#logger.info(
      {
        workspaceId: message.workspaceId,
        locale: message.locale,
        recipientCount: message.to.length,
        provider: 'resend',
      },
      'mail.sent',
    );
  }

  #assertMessageKey(key: string): void {
    if (!knownMessageKeys.has(key)) {
      throw new RelayError(ERROR_CODES.INTERNAL, {
        details: { reason: 'unknown_mail_message_key', key },
      });
    }
  }

  #unavailable(reason: string, cause?: unknown): RelayError {
    return new RelayError(ERROR_CODES.PROVIDER_UNAVAILABLE, {
      messageKey: 'error.provider_unavailable.message',
      details: { provider: 'email', reason },
      ...(cause === undefined ? {} : { cause }),
    });
  }
}
