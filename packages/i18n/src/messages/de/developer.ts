/** Developer surfaces: API keys, service accounts, MCP, CLI, OAuth apps. */
export const developerMessages = {
  'developer.title': 'Agents und API',
  'developer.subtitle':
    'Die API, der MCP-Server und die CLI verwenden dieselben Berechtigungen, Genehmigungsrichtlinien und Belege wie die App.',

  'developer.serviceAccount.title': 'Dienstkonten',
  'developer.serviceAccount.create': 'Erstellen Sie ein Dienstkonto',
  'developer.serviceAccount.name': 'Name',
  'developer.serviceAccount.scopeProjects': 'Projekte und Konten, die es verwenden kann',
  'developer.serviceAccount.scopePlatforms': 'Plattformen',
  'developer.serviceAccount.scopeLocales': 'Inhaltssprachen',
  'developer.serviceAccount.scopeDomains': 'Erlaubte Link-Domains',
  'developer.serviceAccount.scopeHours': 'Erlaubte Stunden',
  'developer.serviceAccount.scopeCadence': 'Maximale Beiträge pro Tag',
  'developer.serviceAccount.scopeLookAhead': 'Wie weit voraus kann es sein?',
  'developer.serviceAccount.approvalLevel': 'Genehmigungsstufe',
  'developer.serviceAccount.killSwitch': 'Stoppen Sie diesen Agenten',

  'developer.approvalLevel.0': 'Nur lesen und validieren',
  'developer.approvalLevel.1': 'Entwürfe erstellen und bearbeiten',
  'developer.approvalLevel.2': 'Planen Sie innerhalb der oben festgelegten Grenzen',
  'developer.approvalLevel.3': 'Fragen Sie eine Person, bevor Sie etwas veröffentlichen',
  'developer.approvalLevel.description.0':
    'Der Agent kann Konten, Funktionen, Kalender und Analysen einsehen. Es ändert nichts.',
  'developer.approvalLevel.description.1':
    'Der Agent kann Entwürfe verfassen. Eine Person plant und veröffentlicht immer noch.',
  'developer.approvalLevel.description.2':
    'Der Agent kann innerhalb der von Ihnen festgelegten Konten, Stunden, Kadenz, Sprachen, Domänen und Vorausschau planen. Alles außerhalb dieser Grenzen braucht einen Menschen.',
  'developer.approvalLevel.description.3':
    'Eine sofortige Veröffentlichung, ein neues Konto oder eine neue Domain, eine Massenaktion, sensible Inhalte oder eine geänderte Datenschutzeinstellung erfordert immer eine ausdrückliche Bestätigung einer Person.',
  'developer.bulkThreshold':
    'Bulk bedeutet mehr als {publications, plural, one {# externe Veröffentlichung} other {# externe Veröffentlichungen}} in einer Anfrage oder der gleiche Inhalt für mehr als {accounts, plural, one {# Konto} other {# Konten}}.',

  'developer.credential.title': 'Anmeldeinformationen',
  'developer.credential.create': 'Erstellen Sie einen API-Schlüssel',
  'developer.credential.shownOnce':
    'Dieser Berechtigungsnachweis wird einmal angezeigt. Kopieren Sie es jetzt. Wir speichern nur einen Hash davon.',
  'developer.credential.prefix': 'Präfix',
  'developer.credential.created': 'Erstellt {date} von {name}',
  'developer.credential.lastUsed': 'Zuletzt verwendet {relativeTime}',
  'developer.credential.neverUsed': 'Nie benutzt',
  'developer.credential.expires': 'Läuft ab {date}',
  'developer.credential.revokeConfirm':
    'Diesen Berechtigungsnachweis widerrufen? Alles, was es verwendet, funktioniert sofort nicht mehr.',

  'developer.scope.title': 'Bereiche',
  'developer.scope.accountsRead': 'Lesen Sie verbundene Konten und ihre Funktionen',
  'developer.scope.draftsWrite': 'Entwürfe erstellen und bearbeiten',
  'developer.scope.postsSchedule': 'Planen Sie genehmigte Inhalte',
  'developer.scope.postsPublish': 'Sofort veröffentlichen',
  'developer.scope.analyticsRead': 'Lesen Sie Analysen',
  'developer.scope.receiptsRead': 'Lesen Sie Veröffentlichungsbelege',
  'developer.scope.webhooksWrite': 'Webhooks verwalten',
  'developer.scope.connectionsAdmin': 'Konten verbinden und trennen',
  'developer.scope.billingRead': 'Abrechnungsstatus lesen',
  'developer.scope.consequential': 'Konsequent',
  'developer.scope.readOnly': 'Nur lesen',

  'developer.setup.title': 'Verbinden Sie einen Client',
  'developer.setup.claudeCode': 'Claude Code',
  'developer.setup.codex': 'Codex',
  'developer.setup.hermes': 'Hermes',
  'developer.setup.buzz': 'Buzz-Workflow',
  'developer.setup.cli': 'CLI',
  'developer.setup.genericMcp': 'Jeder MCP-Client',
  'developer.setup.copyConfig': 'Konfiguration kopieren',
  'developer.setup.mcpEndpoint': 'MCP-Endpunkt',
  'developer.setup.apiBaseUrl': 'API-Basis-URL',

  'developer.playground.title': 'Trockenlauf',
  'developer.playground.description':
    'Führen Sie Tools anhand von Seed-Daten aus. Nichts erreicht eine echte Plattform.',
  'developer.playground.run': 'Ausführen',
  'developer.playground.sandboxBadge': 'Sandkasten',

  'developer.activity.title': 'Aktuelle Aktivität',
  'developer.activity.toolCall': '{tool} aufgerufen von {actor} {relativeTime}',
  'developer.activity.denied': 'Abgelehnt: {reason}',
  'developer.activity.empty': 'Noch keine Anrufe.',
  'developer.activity.redacted':
    'Anforderungs- und Antworttexte werden ohne Geheimnisse gespeichert.',

  'developer.apps.title': 'Entwickler-Apps',
  'developer.apps.subtitle':
    'Lassen Sie ein anderes Produkt über Post Array mit den Berechtigungen agieren, die ein Benutzer ihm gewährt.',
  'developer.apps.create': 'Registrieren Sie eine App',
  'developer.apps.name': 'App-Name',
  'developer.apps.type.label': 'Kundentyp',
  'developer.apps.type.public': 'Öffentlich, kann kein Geheimnis für sich behalten',
  'developer.apps.type.confidential': 'Vertraulich, läuft auf einem Server',
  'developer.apps.homepage': 'Homepage-URL',
  'developer.apps.privacyUrl': 'URL der Datenschutzrichtlinie',
  'developer.apps.termsUrl': 'Begriffs-URL',
  'developer.apps.logo': 'Logo',
  'developer.apps.redirectUris': 'Umleitungs-URIs',
  'developer.apps.redirectUrisHelp':
    'Nur exakte Übereinstimmungen. Platzhalter und Teilpfade werden abgelehnt.',
  'developer.apps.clientId': 'Client-ID',
  'developer.apps.clientSecret': 'Client-Secret',
  'developer.apps.secretShownOnce':
    'Das Geheimnis wird einmal gezeigt. Drehen Sie es, wenn Sie es verlieren. Wir werden es nicht noch einmal zeigen.',
  'developer.apps.status.draft': 'Entwurf',
  'developer.apps.status.active': 'Aktiv',
  'developer.apps.status.disabled': 'Deaktiviert',
  'developer.apps.consentPreview': 'Vorschau des Einwilligungsbildschirms',
  'developer.apps.grants.title': 'Aktive Zuschüsse',
  'developer.apps.grants.count': '{count, plural, one {# Zuschuss} other {# Zuschüsse}}',
  'developer.apps.deleteConfirm':
    'Diese App löschen? Jeder Zuschuss wird widerrufen und seine Token funktionieren nicht mehr.',

  'developer.consent.title': '{app} wants access to your workspace',
  'developer.consent.workspace': 'Workspace',
  'developer.consent.projects': 'Projects and accounts',
  'developer.consent.willBeAbleTo': '{app} will be able to',
  'developer.consent.willNotBeAbleTo': '{app} will not be able to',
  'developer.consent.approvalStillApplies':
    'Your approval policy still applies. This app cannot publish around it.',
  'developer.consent.revokeAnyTime': 'You can revoke this from Settings at any time.',
  'developer.consent.allow': 'Allow access',
  'developer.consent.deny': 'Do not allow',
  'developer.consent.developerIdentity': 'Published by {developer}',

  'developer.grants.title': 'Apps mit Zugriff',
  'developer.grants.grantedOn': 'Zugegeben {date}',
  'developer.grants.lastUsed': 'Zuletzt verwendet {relativeTime}',
  'developer.grants.revoke': 'Zugriff widerrufen',
  'developer.grants.revoked':
    'Zugriff widerrufen. Ihre eigenen Verbindungen und geplanten Beiträge sind davon nicht betroffen.',

  'developer.docs.openapi': 'OpenAPI-Dokument',
  'developer.docs.clients': 'Generierte Kunden',
  'developer.docs.idempotency':
    'Senden Sie bei jeder Erstellungs-, Planungs- und Veröffentlichungsanfrage einen Idempotenzschlüssel. Das Wiederholen einer Anfrage mit demselben Schlüssel gibt das ursprüngliche Ergebnis zurück, anstatt es zweimal zu veröffentlichen.',
  'developer.docs.pagination':
    'Die Ergebnisse werden mit dem Cursor paginiert. Die Zeiten sind explizit und beinhalten eine Zone.',
  'developer.docs.rateLimits':
    'Es gelten Ratenbegrenzungen pro Arbeitsbereich, Anmeldeinformation, Route und Connector.',
} as const;
