import { createHmac } from 'node:crypto';

/** Canonical outbound webhook signature base string. */
export function outboundWebhookSignatureBase(
  timestamp: string,
  rawBody: Buffer | string,
): string {
  const body = typeof rawBody === 'string' ? rawBody : rawBody.toString('utf8');
  return `${timestamp}.${body}`;
}

export function signOutboundWebhookPayload(
  secret: string,
  timestamp: string,
  rawBody: Buffer | string,
): string {
  return createHmac('sha256', secret)
    .update(outboundWebhookSignatureBase(timestamp, rawBody), 'utf8')
    .digest('hex');
}
