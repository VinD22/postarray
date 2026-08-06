/** Publication receipt: the immutable record of what actually happened. */
export const receiptMessages = {
  'receipt.title': 'Resibo ng publikasyon',
  'receipt.subtitle': 'Eksakto kung ano ang nai-publish, saan, kailan at kung kaninong pag-apruba.',
  'receipt.target': '{account} sa {provider}',
  'receipt.externalId': 'Panlabas na post ID',
  'receipt.permalink': 'Permalink',
  'receipt.permalinkUnavailable':
    '{provider} ay hindi nagbabalik ng permalink para sa uri ng post na ito.',
  'receipt.contentVersion': 'Bersyon ng nilalaman',
  'receipt.contentHash': 'Checksum ng nilalaman',
  'receipt.mediaVersion': 'bersyon ng media',
  'receipt.idempotencyKey': 'Sanggunian ng Idepotency',
  'receipt.correlationId': 'Sanggunian ng ugnayan',

  'receipt.surface.label': 'Nilikha mula sa',
  'receipt.surface.web': 'Web app',
  'receipt.surface.api': 'REST API',
  'receipt.surface.mcp': 'MCP server',
  'receipt.surface.cli': 'CLI',
  'receipt.surface.rss': 'RSS autopost',
  'receipt.surface.automation': 'Panuntunan sa automation',
  'receipt.surface.webhook': 'Papasok na webhook',

  'receipt.actor.user': '{name}',
  'receipt.actor.serviceAccount': 'Account ng serbisyo {name}',
  'receipt.actor.oauthApp': '{app} kumikilos para sa {name}',
  'receipt.actor.system': 'Relay',

  'receipt.timeline.title': 'Timeline',
  'receipt.timeline.created': 'Draft na ginawa ni {actor}',
  'receipt.timeline.approvalRequested': 'Hiniling ang pag-apruba mula sa {approver}',
  'receipt.timeline.approved': 'Inaprubahan ni {actor} sa ilalim ng patakaran {policy}',
  'receipt.timeline.scheduled': 'Naka-iskedyul para sa {local} sa {timeZone}',
  'receipt.timeline.revalidated': 'Muling sinuri ang mga kredensyal at limitasyon sa platform',
  'receipt.timeline.mediaPrepared':
    '{count, plural, one {# file na inihanda para sa platform} other {# mga file na inihanda para sa platform}}',
  'receipt.timeline.dispatched': 'Ipinadala sa {provider}',
  'receipt.timeline.providerAccepted': '{provider} tinanggap ang post',
  'receipt.timeline.providerProcessing': '{provider} pinoproseso pa rin ang media',
  'receipt.timeline.published': 'Nai-publish bilang {externalId}',
  'receipt.timeline.commentPublished': 'I-follow up ang item {position} inilathala',
  'receipt.timeline.retryScheduled': 'Subukan muli {attempt} naka-iskedyul para sa {time}',
  'receipt.timeline.failed': 'Pagtatangka {attempt} nabigo',
  'receipt.timeline.canceled': 'Kinansela ni {actor}',
  'receipt.timeline.analyticsSynced': 'Na-sync ang Analytics',
  'receipt.timeline.deletedExternally': 'Wala na ang post {provider}',

  'receipt.times.scheduled': 'Nakatakdang oras',
  'receipt.times.dispatched': 'Oras ng pagpapadala',
  'receipt.times.published': 'Oras ng pag-publish',
  'receipt.times.latency': 'Ipinadala {duration} pagkatapos ng nakatakdang oras.',

  'receipt.attempts.title': 'Mga pagtatangka',
  'receipt.attempts.count': '{count, plural, one {# pagtatangka} other {# mga pagtatangka}}',
  'receipt.attempts.classification': 'Pag-uuri',
  'receipt.attempts.providerResponse': 'Tugon ng provider',
  'receipt.attempts.responseRedacted':
    'Ang tugon ng provider ay iniimbak na may mga token at personal na data na inalis.',
  'receipt.attempts.remediation': 'Ano ang susunod na gagawin',

  'receipt.cost.estimated': 'Tinatantya {amount}',
  'receipt.cost.actual': 'Nagkasundo {amount}',
  'receipt.cost.pending': 'Ang aktwal na paggamit ay hindi pa nagkakasundo.',

  'receipt.partial.title': 'Bahagyang nai-publish',
  'receipt.partial.body':
    '{published, plural, one {# na-publish na target} other {# mga target na nai-publish}}. {failed, plural, one {# nabigo ang target} other {# nabigo ang mga target}}. Ang mga nai-publish na mga post ay umiiral pa rin sa platform.',
  'receipt.partial.doNotRollback':
    'Hindi namin tinatanggal ang isang post na nai-publish na. Tanggalin ito sa platform kung iyon ang gusto mo.',

  'receipt.export.title': 'Ibahagi ang resibo na ito',
  'receipt.export.pdf': 'I-download bilang PDF',
  'receipt.export.json': 'I-download bilang JSON',
  'receipt.export.permissionNote':
    'Ang mga may-ari, admin, at approver lang ang makakapagbahagi ng resibo.',

  'receipt.analytics.lastSync': 'Huling na-sync ang Analytics {relativeTime}.',
  'receipt.analytics.nextSync': 'Susunod na pag-sync sa paligid {time}.',
} as const;
