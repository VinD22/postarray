/** Publication receipt: the immutable record of what actually happened. */
export const receiptMessages = {
  'receipt.title': 'Veröffentlichungsbeleg',
  'receipt.subtitle': 'Genau das, was wo, wann und mit wessen Genehmigung veröffentlicht wurde.',
  'receipt.target': '{account} auf {provider}',
  'receipt.externalId': 'Externe Beitrags-ID',
  'receipt.permalink': 'Permalink',
  'receipt.permalinkUnavailable': '{provider} gibt für diesen Beitragstyp keinen Permalink zurück.',
  'receipt.contentVersion': 'Inhaltsversion',
  'receipt.contentHash': 'Inhaltsprüfsumme',
  'receipt.mediaVersion': 'Medienversion',
  'receipt.idempotencyKey': 'Referenz zur Idempotenz',
  'receipt.correlationId': 'Korrelationsreferenz',

  'receipt.surface.label': 'Erstellt aus',
  'receipt.surface.web': 'Web-App',
  'receipt.surface.api': 'REST-API',
  'receipt.surface.mcp': 'MCP-Server',
  'receipt.surface.cli': 'CLI',
  'receipt.surface.rss': 'RSS-Autopost',
  'receipt.surface.automation': 'Automatisierungsregel',
  'receipt.surface.webhook': 'Eingehender Webhook',

  'receipt.actor.user': '{name}',
  'receipt.actor.serviceAccount': 'Dienstkonto {name}',
  'receipt.actor.oauthApp': '{app} handelnd für {name}',
  'receipt.actor.system': 'Post Array',

  'receipt.timeline.title': 'Zeitleiste',
  'receipt.timeline.created': 'Entwurf erstellt von {actor}',
  'receipt.timeline.approvalRequested': 'Genehmigung angefordert von {approver}',
  'receipt.timeline.approved': 'Genehmigt von {actor} gemäß der Richtlinie {policy}',
  'receipt.timeline.scheduled': 'Geplant für {local} in {timeZone}',
  'receipt.timeline.revalidated': 'Anmeldedaten und Plattformlimits erneut überprüft',
  'receipt.timeline.mediaPrepared':
    '{count, plural, one {# Datei für die Plattform vorbereitet} other {# Dateien für die Plattform vorbereitet}}',
  'receipt.timeline.dispatched': 'Gesendet an {provider}',
  'receipt.timeline.providerAccepted': '{provider} hat den Beitrag angenommen',
  'receipt.timeline.providerProcessing': '{provider} verarbeitet die Medien noch',
  'receipt.timeline.published': 'Veröffentlicht als {externalId}',
  'receipt.timeline.commentPublished': 'Folgeelement {position} veröffentlicht',
  'receipt.timeline.retryScheduled': 'Wiederholen Sie {attempt} geplant für {time}',
  'receipt.timeline.failed': 'Versuch {attempt} fehlgeschlagen',
  'receipt.timeline.canceled': 'Abgesagt von {actor}',
  'receipt.timeline.analyticsSynced': 'Analytics synchronisiert',
  'receipt.timeline.deletedExternally': 'Der Beitrag ist nicht mehr auf {provider}',

  'receipt.times.scheduled': 'Geplant time',
  'receipt.times.dispatched': 'Versand time',
  'receipt.times.published': 'Veröffentlichen time',
  'receipt.times.latency': 'Wird {duration} nach dem geplanten time gesendet.',

  'receipt.attempts.title': 'Versuche',
  'receipt.attempts.count': '{count, plural, one {# Versuch} other {# Versuche}}',
  'receipt.attempts.classification': 'Einstufung',
  'receipt.attempts.providerResponse': 'Antwort des Anbieters',
  'receipt.attempts.responseRedacted':
    'Die Antwort des Anbieters wird mit entfernten Token und personenbezogenen Daten gespeichert.',
  'receipt.attempts.remediation': 'Was als nächstes zu tun ist',

  'receipt.cost.estimated': 'Geschätzte {amount}',
  'receipt.cost.actual': 'Abgeglichen {amount}',
  'receipt.cost.pending': 'Die tatsächliche Nutzung ist noch nicht abgeglichen.',

  'receipt.partial.title': 'Teilweise veröffentlicht',
  'receipt.partial.body':
    '{published, plural, one {# Ziel veröffentlicht} other {# Ziele veröffentlicht}}. {failed, plural, one {# Ziel fehlgeschlagen} other {# Ziele fehlgeschlagen}}. Die veröffentlichten Beiträge sind weiterhin auf der Plattform vorhanden.',
  'receipt.partial.doNotRollback':
    'Wir löschen keinen Beitrag, der bereits veröffentlicht wurde. Löschen Sie es auf der Plattform, wenn Sie das möchten.',

  'receipt.export.title': 'Teilen Sie diese Quittung',
  'receipt.export.pdf': 'Als PDF herunterladen',
  'receipt.export.json': 'Als JSON herunterladen',
  'receipt.export.permissionNote':
    'Nur Besitzer, Administratoren und Genehmiger können eine Quittung teilen.',

  'receipt.analytics.lastSync': 'Analytics wurde zuletzt {relativeTime} synchronisiert.',
  'receipt.analytics.nextSync': 'Nächste Synchronisierung um {time}.',
} as const;
