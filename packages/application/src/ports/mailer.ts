import type { Logger } from '@relay/observability';

import type { MailMessage, MailerPort } from '../types';

/**
 * The default mailer writes to the logger.
 *
 * The product runs end to end with no SMTP credential: an invitation, an
 * approval request or an expiry warning is visible in the log with its message
 * key and parameters, exactly as it would be sent. Recipients are logged as
 * counts and domains rather than addresses, because the logger redacts by
 * default and an address is personal data.
 */
export class LoggingMailer implements MailerPort {
  readonly #logger: Logger;

  constructor(logger: Logger) {
    this.#logger = logger;
  }

  async send(message: MailMessage): Promise<void> {
    this.#logger.info(
      {
        workspaceId: message.workspaceId,
        subjectKey: message.subjectKey,
        bodyKey: message.bodyKey,
        locale: message.locale,
        recipientCount: message.to.length,
        recipientDomains: [...new Set(message.to.map(domainOf))],
        params: message.params,
      },
      'mail.send',
    );
  }
}

function domainOf(address: string): string {
  const at = address.lastIndexOf('@');
  return at === -1 ? 'unknown' : address.slice(at + 1).toLowerCase();
}

/** Captures messages so a test can assert what would have been sent. */
export class RecordingMailer implements MailerPort {
  readonly sent: MailMessage[] = [];

  async send(message: MailMessage): Promise<void> {
    this.sent.push(message);
  }
}
