/** Publication receipt: the immutable record of what actually happened. */
export const receiptMessages = {
  'receipt.title': 'Publiceringskvitto',
  'receipt.subtitle': 'Exakt vad som publicerades, var, när och på vems godkännande.',
  'receipt.target': '{account} on {provider}',
  'receipt.externalId': 'Externt post-ID',
  'receipt.permalink': 'Permalänk',
  'receipt.permalinkUnavailable': '{provider} does not return a permalink for this post type.',
  'receipt.contentVersion': 'Innehållsversion',
  'receipt.contentHash': 'Innehållskontrollsumma',
  'receipt.mediaVersion': 'Mediaversion',
  'receipt.idempotencyKey': 'Idempotensreferens',
  'receipt.correlationId': 'Korrelationsreferens',

  'receipt.surface.label': 'Skapad från',
  'receipt.surface.web': 'Webbapp',
  'receipt.surface.api': 'REST API',
  'receipt.surface.mcp': 'MCP-server',
  'receipt.surface.cli': 'CLI',
  'receipt.surface.rss': 'RSS autopost',
  'receipt.surface.automation': 'Automatiseringsregel',
  'receipt.surface.webhook': 'Inkommande webhook',

  'receipt.actor.user': '{name}',
  'receipt.actor.serviceAccount': 'Service account {name}',
  'receipt.actor.oauthApp': '{app} agerar för {name}',
  'receipt.actor.system': 'Relä',

  'receipt.timeline.title': 'Tidslinje',
  'receipt.timeline.created': 'Draft created by {actor}',
  'receipt.timeline.approvalRequested': 'Godkännande begärs från {approver}',
  'receipt.timeline.approved': 'Godkänd av {actor} enligt policy {policy}',
  'receipt.timeline.scheduled': 'Schemalagt till {local} i {timeZone}',
  'receipt.timeline.revalidated': 'Autentiseringsuppgifter och plattformsgränser kontrolleras igen',
  'receipt.timeline.mediaPrepared':
    '{count, plural, one {# file prepared for the platform} other {# files prepared for the platform}}',
  'receipt.timeline.dispatched': 'Sent to {provider}',
  'receipt.timeline.providerAccepted': '{provider} accepterade inlägget',
  'receipt.timeline.providerProcessing': '{provider} bearbetar fortfarande media',
  'receipt.timeline.published': 'Published as {externalId}',
  'receipt.timeline.commentPublished': 'Uppföljningspunkt {position} publicerad',
  'receipt.timeline.retryScheduled': 'Försök igen {attempt} schemalagt för {time}',
  'receipt.timeline.failed': 'Attempt {attempt} failed',
  'receipt.timeline.canceled': 'Canceled by {actor}',
  'receipt.timeline.analyticsSynced': 'Analytics synkroniserad',
  'receipt.timeline.deletedExternally': 'Inlägget finns inte längre på {provider}',

  'receipt.times.scheduled': 'Schemalagd tid',
  'receipt.times.dispatched': 'Utskickstid',
  'receipt.times.published': 'Publicera tid',
  'receipt.times.latency': 'Skickas {duration} efter schemalagd tid.',

  'receipt.attempts.title': 'Försök',
  'receipt.attempts.count': '{count, plural, one {# attempt} other {# attempts}}',
  'receipt.attempts.classification': 'Klassificering',
  'receipt.attempts.providerResponse': 'Leverantörens svar',
  'receipt.attempts.responseRedacted':
    'Leverantörens svar lagras med tokens och personuppgifter borttagna.',
  'receipt.attempts.remediation': 'Vad du ska göra härnäst',

  'receipt.cost.estimated': 'Estimated {amount}',
  'receipt.cost.actual': 'Reconciled {amount}',
  'receipt.cost.pending': 'Den faktiska användningen är inte avstämd ännu.',

  'receipt.partial.title': 'Delvis publicerad',
  'receipt.partial.body':
    '{published, plural, one {# mål publicerat} other {# mål publicerade}}. {failed, plural, one {# mål misslyckades} other {# mål misslyckades}}. De publicerade inläggen finns fortfarande kvar på plattformen.',
  'receipt.partial.doNotRollback':
    'Vi tar inte bort ett inlägg som redan publicerats. Ta bort det på plattformen om det är vad du vill.',

  'receipt.export.title': 'Dela detta kvitto',
  'receipt.export.pdf': 'Ladda ner som PDF',
  'receipt.export.json': 'Ladda ner som JSON',
  'receipt.export.permissionNote':
    'Endast ägare, administratörer och godkännare kan dela ett kvitto.',

  'receipt.analytics.lastSync': 'Analytics last synced {relativeTime}.',
  'receipt.analytics.nextSync': 'Next sync around {time}.',
} as const;
