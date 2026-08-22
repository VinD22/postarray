/** Developer surfaces: API keys, service accounts, MCP, CLI, OAuth apps. */
export const developerMessages = {
  'developer.title': 'Agenter och API',
  'developer.subtitle':
    'API, MCP-server och CLI använder samma behörigheter, godkännandepolicy och kvitton som appen.',

  'developer.serviceAccount.title': 'Servicekonton',
  'developer.serviceAccount.create': 'Skapa ett tjänstekonto',
  'developer.serviceAccount.name': 'Namn',
  'developer.serviceAccount.scopeProjects': 'Projekt och konton den kan använda',
  'developer.serviceAccount.scopePlatforms': 'Plattformar',
  'developer.serviceAccount.scopeLocales': 'Innehållsspråk',
  'developer.serviceAccount.scopeDomains': 'Tillåtna länkdomäner',
  'developer.serviceAccount.scopeHours': 'Tillåtna timmar',
  'developer.serviceAccount.scopeCadence': 'Max antal inlägg per dag',
  'developer.serviceAccount.scopeLookAhead': 'Hur långt fram det kan schemaläggas',
  'developer.serviceAccount.approvalLevel': 'Godkännandenivå',
  'developer.serviceAccount.killSwitch': 'Stoppa den här agenten',

  'developer.approvalLevel.0': 'Läs och validera endast',
  'developer.approvalLevel.1': 'Skapa och redigera utkast',
  'developer.approvalLevel.2': 'Schemalägg inom gränserna ovan',
  'developer.approvalLevel.3': 'Fråga en person innan du publicerar',
  'developer.approvalLevel.description.0':
    'Agenten kan titta på konton, funktioner, kalendrar och analyser. Det förändrar ingenting.',
  'developer.approvalLevel.description.1':
    'Agenten kan skriva utkast. En person schemalägger och publicerar fortfarande.',
  'developer.approvalLevel.description.2':
    'Agenten kan schemalägga inom de konton, timmar, kadens, språk, domäner och se framåt du ställer in. Allt utanför dessa gränser behöver en person.',
  'developer.approvalLevel.description.3':
    'Omedelbar publicering, ett nytt konto eller en ny domän, en massåtgärd, känsligt innehåll eller en ändrad integritetsinställning behöver alltid en uttrycklig bekräftelse från en person.',
  'developer.bulkThreshold':
    'Bulk betyder mer än {publications, plural, one {# extern publikation} other {# externa publikationer}} i en begäran, eller samma innehåll till mer än {accounts, plural, one {# konto} other {# konton}}.',

  'developer.credential.title': 'Inloggningsuppgifter',
  'developer.credential.create': 'Skapa en API-nyckel',
  'developer.credential.shownOnce':
    'Denna legitimation visas en gång. Kopiera det nu. Vi lagrar bara en hash av det.',
  'developer.credential.prefix': 'Prefix',
  'developer.credential.created': 'Skapad {date} av {name}',
  'developer.credential.lastUsed': 'Senast använda {relativeTime}',
  'developer.credential.neverUsed': 'Aldrig använd',
  'developer.credential.expires': 'Går ut {date}',
  'developer.credential.revokeConfirm':
    'Återkalla denna behörighet? Allt som använder den slutar fungera omedelbart.',

  'developer.scope.title': 'Omfattningar',
  'developer.scope.accountsRead': 'Läs anslutna konton och deras möjligheter',
  'developer.scope.draftsWrite': 'Skapa och redigera utkast',
  'developer.scope.postsSchedule': 'Schemalägg godkänt innehåll',
  'developer.scope.postsPublish': 'Publicera omedelbart',
  'developer.scope.analyticsRead': 'Läs analyser',
  'developer.scope.receiptsRead': 'Läs publikationskvitton',
  'developer.scope.webhooksWrite': 'Hantera webhooks',
  'developer.scope.connectionsAdmin': 'Anslut och koppla bort konton',
  'developer.scope.billingRead': 'Läs faktureringsstatus',
  'developer.scope.consequential': 'Följd',
  'developer.scope.readOnly': 'Endast läs',

  'developer.setup.title': 'Anslut en klient',
  'developer.setup.claudeCode': 'Claude Code',
  'developer.setup.codex': 'Codex',
  'developer.setup.hermes': 'Hermes',
  'developer.setup.buzz': 'Buzz arbetsflöde',
  'developer.setup.cli': 'CLI',
  'developer.setup.genericMcp': 'Vilken MCP-klient som helst',
  'developer.setup.copyConfig': 'Kopiera konfiguration',
  'developer.setup.mcpEndpoint': 'MCP-slutpunkt',
  'developer.setup.apiBaseUrl': 'API-bas-URL',

  'developer.playground.title': 'Torrkörning',
  'developer.playground.description':
    'Kör verktyg mot sådd data. Ingenting når en riktig plattform.',
  'developer.playground.run': 'Kör',
  'developer.playground.sandboxBadge': 'Sandlåda',

  'developer.activity.title': 'Senaste aktiviteten',
  'developer.activity.toolCall': '{tool} ringde av {actor} {relativeTime}',
  'developer.activity.denied': 'Nekad: {reason}',
  'developer.activity.empty': 'Inga samtal än.',
  'developer.activity.redacted': 'Begäran och svarsinstanser lagras med hemligheter borttagna.',

  'developer.apps.title': 'Utvecklarappar',
  'developer.apps.subtitle':
    'Låt en annan produkt agera genom Relay med de behörigheter som en användare ger den.',
  'developer.apps.create': 'Registrera en app',
  'developer.apps.name': 'Appens namn',
  'developer.apps.type.label': 'Klienttyp',
  'developer.apps.type.public': 'Offentlig, kan inte hålla en hemlighet',
  'developer.apps.type.confidential': 'Konfidentiellt, körs på en server',
  'developer.apps.homepage': 'Hemsidans URL',
  'developer.apps.privacyUrl': 'Sekretesspolicy URL',
  'developer.apps.termsUrl': 'Villkor URL',
  'developer.apps.logo': 'Logotyp',
  'developer.apps.redirectUris': 'Omdirigera URI:er',
  'developer.apps.redirectUrisHelp':
    'Endast exakta matchningar. Jokertecken och partiella sökvägar avvisas.',
  'developer.apps.clientId': 'Klient-ID',
  'developer.apps.clientSecret': 'Klienthemlighet',
  'developer.apps.secretShownOnce':
    'Hemligheten visas en gång. Vrid den om du tappar den. Vi kommer inte visa det igen.',
  'developer.apps.status.draft': 'Utkast',
  'developer.apps.status.active': 'Aktiv',
  'developer.apps.status.disabled': 'Inaktiverad',
  'developer.apps.consentPreview': 'Förhandsgranskning av samtyckesskärmen',
  'developer.apps.grants.title': 'Aktiva bidrag',
  'developer.apps.grants.count': '{count, plural, one {# grant} other {# grants}}',
  'developer.apps.deleteConfirm':
    'Vill du ta bort den här appen? Varje anslag återkallas och dess tokens slutar fungera.',

  'developer.consent.title': '{app} wants access to your workspace',
  'developer.consent.workspace': 'Workspace',
  'developer.consent.projects': 'Projekt och konton',
  'developer.consent.willBeAbleTo': '{app} will be able to',
  'developer.consent.willNotBeAbleTo': '{app} will not be able to',
  'developer.consent.approvalStillApplies':
    'Your approval policy still applies. This app cannot publish around it.',
  'developer.consent.revokeAnyTime': 'You can revoke this from Settings at any time.',
  'developer.consent.allow': 'Allow access',
  'developer.consent.deny': 'Do not allow',
  'developer.consent.developerIdentity': 'Published by {developer}',

  'developer.grants.title': 'Appar med åtkomst',
  'developer.grants.grantedOn': 'Beviljas {date}',
  'developer.grants.lastUsed': 'Senast använda {relativeTime}',
  'developer.grants.revoke': 'Återkalla åtkomst',
  'developer.grants.revoked':
    'Åtkomst återkallad. Dina egna anslutningar och schemalagda inlägg påverkas inte.',

  'developer.docs.openapi': 'Öppna API-dokument',
  'developer.docs.clients': 'Genererade kunder',
  'developer.docs.idempotency':
    'Skicka en idempotensnyckel med varje skapa, schemalägga och publicera begäran. Upprepa en begäran med samma nyckel returnerar det ursprungliga resultatet istället för att publicera två gånger.',
  'developer.docs.pagination':
    'Resultaten är markörpaginerade. Tiderna är explicita och inkluderar en zon.',
  'developer.docs.rateLimits':
    'Prisgränser gäller per arbetsyta, autentiseringsuppgifter, rutt och koppling.',
} as const;
