/** Publication receipt: the immutable record of what actually happened. */
export const receiptMessages = {
  'receipt.title': 'Ricevuta di pubblicazione',
  'receipt.subtitle': 'Esattamente cosa è stato pubblicato, dove, quando e su approvazione di chi.',
  'receipt.target': '{account} su {provider}',
  'receipt.externalId': 'ID postale esterno',
  'receipt.permalink': 'Collegamento permanente',
  'receipt.permalinkUnavailable':
    '{provider} non restituisce un permalink per questo tipo di post.',
  'receipt.contentVersion': 'Versione del contenuto',
  'receipt.contentHash': 'Checksum del contenuto',
  'receipt.mediaVersion': 'Versione multimediale',
  'receipt.idempotencyKey': "Riferimento all'idempotenza",
  'receipt.correlationId': 'Riferimento di correlazione',

  'receipt.surface.label': 'Creato da',
  'receipt.surface.web': 'Applicazione Web',
  'receipt.surface.api': 'API REST',
  'receipt.surface.mcp': 'server MCP',
  'receipt.surface.cli': 'CLI',
  'receipt.surface.rss': 'Autopubblicazione RSS',
  'receipt.surface.automation': "Regola dell'automazione",
  'receipt.surface.webhook': 'Webhook in entrata',

  'receipt.actor.user': '{name}',
  'receipt.actor.serviceAccount': 'Account di servizio {name}',
  'receipt.actor.oauthApp': '{app} recita per {name}',
  'receipt.actor.system': 'Relay',

  'receipt.timeline.title': 'Cronologia',
  'receipt.timeline.created': 'Bozza creata da {actor}',
  'receipt.timeline.approvalRequested': 'Approvazione richiesta da {approver}',
  'receipt.timeline.approved': 'Approvato da {actor} secondo la politica {policy}',
  'receipt.timeline.scheduled': 'Previsto per {local} tra {timeZone}',
  'receipt.timeline.revalidated': 'Credenziali e limiti della piattaforma ricontrollati',
  'receipt.timeline.mediaPrepared':
    '{count, plural, one {# file preparato per la piattaforma} many {# file preparati per la piattaforma} other {# file preparati per la piattaforma}}',
  'receipt.timeline.dispatched': 'Inviato a {provider}',
  'receipt.timeline.providerAccepted': "{provider} ha accettato l'incarico",
  'receipt.timeline.providerProcessing': '{provider} sta ancora elaborando il file multimediale',
  'receipt.timeline.published': 'Pubblicato come {externalId}',
  'receipt.timeline.commentPublished': 'Articolo successivo {position} pubblicato',
  'receipt.timeline.retryScheduled': 'Riprova {attempt} programmato per {time}',
  'receipt.timeline.failed': 'Tentativo {attempt} fallito',
  'receipt.timeline.canceled': 'Annullato da {actor}',
  'receipt.timeline.analyticsSynced': 'Analisi sincronizzate',
  'receipt.timeline.deletedExternally': 'Il post non è più su {provider}',

  'receipt.times.scheduled': 'Orario previsto',
  'receipt.times.dispatched': 'Tempo di spedizione',
  'receipt.times.published': "Pubblica l'ora",
  'receipt.times.latency': "{duration} inviato dopo l'orario previsto.",

  'receipt.attempts.title': 'Tentativi',
  'receipt.attempts.count':
    '{count, plural, one {# tentativo} many {# tentativi} other {# tentativi}}',
  'receipt.attempts.classification': 'Classificazione',
  'receipt.attempts.providerResponse': 'Risposta del fornitore',
  'receipt.attempts.responseRedacted':
    'La risposta del fornitore viene archiviata con i token e i dati personali rimossi.',
  'receipt.attempts.remediation': 'Cosa fare dopo',

  'receipt.cost.estimated': '{amount} stimato',
  'receipt.cost.actual': 'Riconciliato {amount}',
  'receipt.cost.pending': "L'utilizzo effettivo non è ancora riconciliato.",

  'receipt.partial.title': 'Parzialmente pubblicato',
  'receipt.partial.body':
    '{published, plural, one {# target pubblicato} many {# target pubblicati} other {# target pubblicati}}. {failed, plural, one {# target non riuscito} many {# target non riuscito} other {# target non riuscito}}. I post pubblicati esistono ancora sulla piattaforma.',
  'receipt.partial.doNotRollback':
    'Non eliminiamo un post già pubblicato. Eliminalo sulla piattaforma se è quello che desideri.',

  'receipt.export.title': 'Condividi questa ricevuta',
  'receipt.export.pdf': 'Scarica come PDF',
  'receipt.export.json': 'Scarica come JSON',
  'receipt.export.permissionNote':
    'Solo i proprietari, gli amministratori e gli approvatori possono condividere una ricevuta.',

  'receipt.analytics.lastSync': "L'ultima sincronizzazione di Analytics è {relativeTime}.",
  'receipt.analytics.nextSync': 'Prossima sincronizzazione attorno a {time}.',
} as const;
