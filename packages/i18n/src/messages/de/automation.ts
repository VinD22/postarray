/** Automation rules, RSS autopost, webhooks and inbound integrations. */
export const automationMessages = {
  'automation.title': 'Automatisierung',
  'automation.subtitle':
    'Regeln, Feeds und Webhooks mit den angegebenen Grenzen, bevor Sie sie aktivieren.',
  'automation.rules.title': 'Automatisierungsregeln',
  'automation.rules.create': 'Neue Regel',
  'automation.rules.empty':
    'Noch keine Regeln. Eine Regel reagiert auf etwas und schlägt eine Aktion vor oder führt sie aus.',
  'automation.rules.sentence':
    'Wenn {trigger}, wenn {conditions}, dann {actions}, nach {delay}, bis {endCondition}.',
  'automation.rules.sentenceNoConditions':
    'Wenn {trigger}, dann {actions}, nach {delay}, bis {endCondition}.',
  'automation.rules.structuredEditor': 'Strukturierter Editor',
  'automation.rules.sentenceEditor': 'Satzeditor',

  'automation.trigger.label': 'Auslösen',
  'automation.trigger.atTime': 'zu einer bestimmten Uhrzeit',
  'automation.trigger.nextSlot': 'der nächste genehmigte Kalenderplatz',
  'automation.trigger.rssItem': 'ein neues Element erscheint in {feed}',
  'automation.trigger.inboundWebhook': 'Ein authentifizierter Webhook kommt an',
  'automation.trigger.mediaImported': 'Neue Medien werden über die API importiert',
  'automation.trigger.postPublished': 'ein Beitrag veröffentlicht',
  'automation.trigger.postFailed': 'ein Beitrag schlägt fehl',
  'automation.trigger.postPartiallyPublished':
    'Ein Beitrag wird nur für einige Ziele veröffentlicht',
  'automation.trigger.commentCompleted':
    'Ein geplanter Kommentar oder Thread-Beitrag wurde abgeschlossen',
  'automation.trigger.analyticsThreshold': '{metric} in einem Beitrag erreicht {value}',
  'automation.trigger.connectionExpiring': 'Eine Verbindung muss aktualisiert werden',
  'automation.trigger.manual': 'Jemand führt es über die App, API, MCP oder CLI aus',
  'automation.trigger.recurring': 'Ein wiederkehrender Zeitplan wird ausgelöst',

  'automation.condition.label': 'Bedingungen',
  'automation.condition.brand': 'Die Marke ist {brand}',
  'automation.condition.campaign': 'Die Kampagne ist {campaign}',
  'automation.condition.account': 'Das Konto lautet {account}',
  'automation.condition.platform': 'Die Plattform ist {platform}',
  'automation.condition.locale': 'Die Inhaltssprache ist {locale}',
  'automation.condition.contentType': 'Der Inhaltstyp ist {contentType}',
  'automation.condition.quietHours': 'Es ist außerhalb der ruhigen Stunden in {timeZone}',
  'automation.condition.approved': 'Der Inhalt ist genehmigt',
  'automation.condition.engagementAtLeast': '{metric} ist mindestens {value}',
  'automation.condition.engagementAtMost': '{metric} ist höchstens {value}',
  'automation.condition.timeSincePublish':
    'Der Beitrag wurde vor mehr als {duration} veröffentlicht',
  'automation.condition.containsKeyword': 'Der Text enthält {keyword}',
  'automation.condition.notDuplicate': 'Der Inhalt ist kein annäherndes Duplikat',
  'automation.condition.withinCadenceBudget': 'Das Frequenzbudget erlaubt es',
  'automation.condition.connectionHealthy': 'Die Verbindung ist funktionsfähig',
  'automation.condition.usageAvailable': 'der Nutzungssaldo deckt dies ab',

  'automation.action.label': 'Aktionen',
  'automation.action.createDraft': 'einen Entwurf aus {template} erstellen',
  'automation.action.transcreate': 'Passen Sie den Text für {locale} an',
  'automation.action.addSignature': 'die Signatur {signature} hinzufügen',
  'automation.action.addUtm': 'UTM-Parameter hinzufügen',
  'automation.action.addDisclosure': 'den Hinweis {disclosure} hinzufügen',
  'automation.action.addFirstComment': 'den genehmigten ersten Kommentar hinzufügen',
  'automation.action.requestApproval': 'menschliche Zustimmung einholen',
  'automation.action.schedule': 'ihn gemäß der Genehmigungsrichtlinie planen',
  'automation.action.publish': 'ihn gemäß der Genehmigungsrichtlinie veröffentlichen',
  'automation.action.wait': '{duration} warten',
  'automation.action.notify': '{target} benachrichtigen',
  'automation.action.pauseRule': 'diese Regel pausieren',
  'automation.action.repost': 'den Quellbeitrag einmal erneut veröffentlichen oder zitieren',
  'automation.action.followUpFromAccount':
    'einen vorbereiteten Folgebeitrag von {account} veröffentlichen',

  'automation.preflight.title': 'Bevor Sie dies einschalten',
  'automation.preflight.accounts':
    'Diese Regel kann auf {count, plural, one {# Konto} other {# Konten}} wirken.',
  'automation.preflight.maxActions':
    'Es können höchstens {count, plural, one {# externe Aktion} other {# externe Aktionen}} pro Lauf erstellt werden.',
  'automation.preflight.approval': 'Jede Veröffentlichung folgt weiterhin {policy}.',
  'automation.preflight.providerLimits': 'Es gelten die Anbieterbeschränkungen',
  'automation.preflight.estimatedCost': 'Geschätzte gemessene Kosten pro Lauf: {amount}.',
  'automation.preflight.duplicateImpact':
    'Vor jeder Aktion werden Duplikat- und Rhythmusprüfungen durchgeführt.',
  'automation.preflight.failureBehaviour':
    'Wenn eine Aktion fehlschlägt, wird die Regel {behaviour}.',
  'automation.preflight.example': 'Beispiellauf',

  'automation.threshold.windowRequired': 'Wählen Sie ein Messfenster.',
  'automation.threshold.cooldownRequired': 'Wählen Sie eine Abklingzeit zwischen den Ausführungen.',
  'automation.threshold.maxExecutions':
    'Wird für jeden Quellbeitrag höchstens {count, plural, one {# Mal} other {# Mal}} ausgeführt.',
  'automation.threshold.staleMetric':
    'Wenn die Kennzahl fehlt oder veraltet ist, wird diese Regel nicht ausgeführt. Diese Standardeinstellung schützt Sie davor, auf einen Wert zu reagieren, den wir nicht überprüfen können.',

  'automation.rules.state.draft': 'Entwurf',
  'automation.rules.state.testing': 'Testmodus',
  'automation.rules.state.active': 'Aktiv',
  'automation.rules.state.paused': 'Angehalten',
  'automation.rules.state.stopped': 'Gestoppt durch Kill-Schalter',
  'automation.rules.killSwitch': 'Stoppen Sie diese Regel jetzt',
  'automation.rules.runs.title': 'Aktuelle Läufe',
  'automation.rules.runs.empty': 'Diese Regel wurde noch nicht ausgeführt.',
  'automation.rules.runs.succeeded': 'Abgeschlossen {relativeTime}',
  'automation.rules.runs.failed': 'Fehlgeschlagen {relativeTime}',
  'automation.rules.versionHistory': 'Versionsgeschichte',

  'automation.notPermitted.title': 'Diese Regel kann nicht erstellt werden',
  'automation.notPermitted.body':
    'Relay automatisiert keine Likes, Follower, unerwünschte Antworten oder Nachrichten, doppelte Massenbeiträge oder alles, was von der Browserautomatisierung abhängt. {provider} verbietet es und wir auch.',
  'automation.notPermitted.providerCapability':
    '{provider} bietet {action} nicht über seine offizielle API an, daher ist diese Aktion dafür nicht auswählbar.',

  'automation.rss.title': 'RSS-Autopost',
  'automation.rss.add': 'Feed hinzufügen',
  'automation.rss.urlLabel': 'Feed-URL',
  'automation.rss.validating': 'Überprüfung des Feeds',
  'automation.rss.validated': '{title} sieht gültig aus. Letzter Eintrag: {itemTitle}.',
  'automation.rss.markSeen': 'Behandeln Sie den aktuell neuesten Artikel als bereits gesehen',
  'automation.rss.targets': 'Veröffentlichen auf',
  'automation.rss.template': 'Textvorlage',
  'automation.rss.templateHelp':
    'Verwenden Sie die von Ihnen zugeordneten Feedfelder. Relay generiert keine Bilder für Feed-Elemente.',
  'automation.rss.policy.draft': 'Erstellen Sie einen Entwurf',
  'automation.rss.policy.approval':
    'Erstellen Sie einen Entwurf und fordern Sie die Genehmigung an',
  'automation.rss.policy.nextSlot': 'Planen Sie den nächsten freien Slot ein',
  'automation.rss.policy.cadence': 'Mit fester Frequenz planen',
  'automation.rss.policy.immediate': 'Sofort veröffentlichen',
  'automation.rss.dedupe':
    'Elemente werden anhand ihrer Kennung, ihres Links und ihres Inhalts mit einem Fingerabdruck versehen, sodass dasselbe Element nicht zweimal veröffentlicht wird.',
  'automation.rss.health.lastPoll': 'Zuletzt überprüft {relativeTime}',
  'automation.rss.health.lastItem': 'Letzter neuer Artikel {relativeTime}',
  'automation.rss.health.lastPost': 'Letzter Beitrag erstellt {relativeTime}',
  'automation.rss.health.error': 'Letzter Fehler: {reason}',

  'automation.webhooks.title': 'Webhooks',
  'automation.webhooks.add': 'Endpunkt hinzufügen',
  'automation.webhooks.urlLabel': 'Endpunkt-URL',
  'automation.webhooks.eventsLabel': 'Ereignisse',
  'automation.webhooks.allEvents': 'Alle Ereignisse',
  'automation.webhooks.scopeLabel': 'Marken und Konten',
  'automation.webhooks.allAccounts': 'Alle Konten',
  'automation.webhooks.secret': 'Unterzeichnungsgeheimnis',
  'automation.webhooks.secretShownOnce':
    'Dieses Geheimnis wird einmal gezeigt. Bewahren Sie es jetzt auf.',
  'automation.webhooks.rotateSecret': 'Rotieren Sie das Signaturgeheimnis',
  'automation.webhooks.testSend': 'Senden Sie ein Testereignis',
  'automation.webhooks.testSent': 'Testereignis gesendet. Überprüfen Sie das Lieferprotokoll.',
  'automation.webhooks.deliveries.title': 'Lieferungen',
  'automation.webhooks.deliveries.status': 'Antwort {status} in {duration}',
  'automation.webhooks.deliveries.redeliver': 'Erneut zustellen',
  'automation.webhooks.deliveries.retrying':
    'Erneuter Versuch mit Backoff. Versuchen Sie {attempt} von {max}.',
  'automation.webhooks.disabledAfterFailures':
    'Dieser Endpunkt wurde nach wiederholten Fehlern deaktiviert. Beheben Sie das Problem und aktivieren Sie es erneut.',
  'automation.webhooks.event.connectionConnected': 'Eine Verbindung wurde hinzugefügt',
  'automation.webhooks.event.connectionActionRequired': 'Eine Verbindung braucht Aufmerksamkeit',
  'automation.webhooks.event.draftCreated': 'Es wurde ein Entwurf erstellt',
  'automation.webhooks.event.approvalRequested': 'Die Genehmigung wurde beantragt',
  'automation.webhooks.event.approvalDecided': 'Eine Genehmigung wurde beschlossen',
  'automation.webhooks.event.postScheduled': 'Ein Beitrag wurde geplant',
  'automation.webhooks.event.postDispatching': 'Ein Beitrag wird gesendet',
  'automation.webhooks.event.postPublished': 'Ein Beitrag veröffentlicht',
  'automation.webhooks.event.postPartiallyPublished':
    'Ein Beitrag wurde nur für einige Ziele veröffentlicht',
  'automation.webhooks.event.postFailed': 'Ein Beitrag ist fehlgeschlagen',
  'automation.webhooks.event.commentPublished':
    'Ein veröffentlichter Kommentar oder Thread-Eintrag',
  'automation.webhooks.event.commentFailed': 'Ein Kommentar oder Thread-Element ist fehlgeschlagen',
  'automation.webhooks.event.analyticsUpdated': 'Analysen aktualisiert',
  'automation.webhooks.event.rssItemProcessed': 'Ein RSS-Element wurde verarbeitet',
  'automation.webhooks.event.ruleRunCompleted': 'Ein Regellauf wurde abgeschlossen',
  'automation.webhooks.event.ruleRunFailed': 'Eine Regelausführung ist fehlgeschlagen',
  'automation.webhooks.event.subscriptionChanged': 'Das Abonnement hat sich geändert',

  'automation.inbound.title': 'Eingehende Integrationen',
  'automation.inbound.description':
    'Senden Sie authentifiziertes JSON, um einen Entwurf zu erstellen oder eine benannte Regel zu starten. Eingehende Daten umgehen niemals die Validierung, den Kontoumfang oder die Genehmigung.',
  'automation.inbound.endpoint': 'Endpunkt',
  'automation.inbound.credential': 'Zugangsdaten',
} as const;
