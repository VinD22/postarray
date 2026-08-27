/** Developer surfaces: API keys, service accounts, MCP, CLI, OAuth apps. */
export const developerMessages = {
  'developer.title': 'Agenten en API',
  'developer.subtitle':
    'De API, de MCP-server en de CLI gebruiken dezelfde machtigingen, goedkeuringsbeleid en ontvangstbewijzen als de app.',

  'developer.serviceAccount.title': 'Serviceaccounts',
  'developer.serviceAccount.create': 'Maak een serviceaccount aan',
  'developer.serviceAccount.name': 'Naam',
  'developer.serviceAccount.scopeProjects': 'Projecten en accounts die het kan gebruiken',
  'developer.serviceAccount.scopePlatforms': 'Platformen',
  'developer.serviceAccount.scopeLocales': 'Inhoud talen',
  'developer.serviceAccount.scopeDomains': 'Toegestane linkdomeinen',
  'developer.serviceAccount.scopeHours': 'Toegestane uren',
  'developer.serviceAccount.scopeCadence': 'Maximaal aantal berichten per dag',
  'developer.serviceAccount.scopeLookAhead': 'Hoe ver vooruit het kan plannen',
  'developer.serviceAccount.approvalLevel': 'Goedkeuringsniveau',
  'developer.serviceAccount.killSwitch': 'Houd deze agent tegen',

  'developer.approvalLevel.0': 'Alleen lezen en valideren',
  'developer.approvalLevel.1': 'Concepten maken en bewerken',
  'developer.approvalLevel.2': 'Plan binnen de hierboven gestelde limieten',
  'developer.approvalLevel.3': 'Vraag het aan iemand voordat je publiceert',
  'developer.approvalLevel.description.0':
    "De agent kan accounts, mogelijkheden, agenda's en analyses bekijken. Het verandert niets.",
  'developer.approvalLevel.description.1':
    'De agent kan concepten schrijven. Iemand plant en publiceert nog steeds.',
  'developer.approvalLevel.description.2':
    'De agent kan plannen binnen de door u ingestelde accounts, uren, cadans, talen, domeinen en vooruitblik. Alles buiten deze grenzen heeft een persoon nodig.',
  'developer.approvalLevel.description.3':
    'Voor onmiddellijke publicatie, een nieuw account of domein, een bulkactie, gevoelige content of een gewijzigde privacy-instelling is altijd een expliciete bevestiging van een persoon nodig.',
  'developer.bulkThreshold':
    'Bulk betekent meer dan {publications, plural, one {# externe publicatie} other {# externe publicaties}} in één verzoek, of dezelfde inhoud naar meer dan {accounts, plural, one {# account} other {# accounts}}.',

  'developer.credential.title': 'Referenties',
  'developer.credential.create': 'Maak een API-sleutel',
  'developer.credential.shownOnce':
    'Deze identificatie wordt één keer getoond. Kopieer het nu. We bewaren er slechts een hash van.',
  'developer.credential.prefix': 'Voorvoegsel',
  'developer.credential.created': '{date} gemaakt door {name}',
  'developer.credential.lastUsed': 'Laatst gebruikte {relativeTime}',
  'developer.credential.neverUsed': 'Nooit gebruikt',
  'developer.credential.expires': 'Verloopt {date}',
  'developer.credential.revokeConfirm':
    'Deze identificatie intrekken? Alles wat er gebruik van maakt, stopt onmiddellijk met werken.',

  'developer.scope.title': 'Bereik',
  'developer.scope.accountsRead': 'Lees verbonden accounts en hun mogelijkheden',
  'developer.scope.draftsWrite': 'Concepten maken en bewerken',
  'developer.scope.postsSchedule': 'Plan goedgekeurde inhoud',
  'developer.scope.postsPublish': 'Publiceer onmiddellijk',
  'developer.scope.analyticsRead': 'Lees analyses',
  'developer.scope.receiptsRead': 'Lees de publicatiebevestigingen',
  'developer.scope.webhooksWrite': 'Beheer webhooks',
  'developer.scope.connectionsAdmin': 'Accounts koppelen en ontkoppelen',
  'developer.scope.billingRead': 'Factuurstatus lezen',
  'developer.scope.consequential': 'Gevolg',
  'developer.scope.readOnly': 'Alleen lezen',

  'developer.setup.title': 'Verbind een klant',
  'developer.setup.claudeCode': 'Claude Code',
  'developer.setup.codex': 'Codex',
  'developer.setup.hermes': 'Hermes',
  'developer.setup.buzz': 'Buzz-workflow',
  'developer.setup.cli': 'CLI',
  'developer.setup.genericMcp': 'Elke MCP-client',
  'developer.setup.copyConfig': 'Configuratie kopiëren',
  'developer.setup.mcpEndpoint': 'MCP-eindpunt',
  'developer.setup.apiBaseUrl': 'API-basis-URL',

  'developer.playground.title': 'Drooglopen',
  'developer.playground.description':
    'Voer tools uit op basis van geplaatste gegevens. Niets bereikt een echt platform.',
  'developer.playground.run': 'Rennen',
  'developer.playground.sandboxBadge': 'Zandbak',

  'developer.activity.title': 'Recente activiteit',
  'developer.activity.toolCall': '{tool} aangeroepen door {actor} {relativeTime}',
  'developer.activity.denied': 'Geweigerd: {reason}',
  'developer.activity.empty': 'Nog geen oproepen.',
  'developer.activity.redacted':
    'Verzoek- en antwoordteksten worden opgeslagen en de geheimen worden verwijderd.',

  'developer.apps.title': 'Ontwikkelaar-apps',
  'developer.apps.subtitle':
    'Laat een ander product via Post Array werken met de machtigingen die een gebruiker eraan verleent.',
  'developer.apps.create': 'Registreer een app',
  'developer.apps.name': 'App-naam',
  'developer.apps.type.label': 'Type klant',
  'developer.apps.type.public': 'Openbaar, kan geen geheim bewaren',
  'developer.apps.type.confidential': 'Vertrouwelijk, draait op een server',
  'developer.apps.homepage': 'Homepagina-URL',
  'developer.apps.privacyUrl': 'Privacybeleid-URL',
  'developer.apps.termsUrl': 'Termen-URL',
  'developer.apps.logo': 'Logo',
  'developer.apps.redirectUris': "Omleidings-URI's",
  'developer.apps.redirectUrisHelp':
    'Alleen exacte overeenkomsten. Jokertekens en gedeeltelijke paden worden afgewezen.',
  'developer.apps.clientId': 'Klant-ID',
  'developer.apps.clientSecret': 'Klantgeheim',
  'developer.apps.secretShownOnce':
    'Het geheim wordt één keer getoond. Draai het als je het verliest. Wij zullen het niet nog een keer laten zien.',
  'developer.apps.status.draft': 'Diepgang',
  'developer.apps.status.active': 'Actief',
  'developer.apps.status.disabled': 'Uitgeschakeld',
  'developer.apps.consentPreview': 'Voorbeeld van toestemmingsscherm',
  'developer.apps.grants.title': 'Actieve subsidies',
  'developer.apps.grants.count': '{count, plural, one {# subsidie} other {# subsidies}}',
  'developer.apps.deleteConfirm':
    'Deze app verwijderen? Elke subsidie ​​wordt ingetrokken en de tokens werken niet meer.',

  'developer.consent.title': '{app} wil toegang tot uw werkruimte',
  'developer.consent.workspace': 'Workspace',
  'developer.consent.projects': 'Projecten en accounts',
  'developer.consent.willBeAbleTo': '{app} zal dat kunnen',
  'developer.consent.willNotBeAbleTo': '{app} zal dit niet kunnen',
  'developer.consent.approvalStillApplies':
    'Uw goedkeuringsbeleid is nog steeds van toepassing. Deze app kan er niet omheen publiceren.',
  'developer.consent.revokeAnyTime': 'U kunt dit op elk gewenst moment intrekken via Instellingen.',
  'developer.consent.allow': 'Toegang toestaan',
  'developer.consent.deny': 'Niet toestaan',
  'developer.consent.developerIdentity': 'Gepubliceerd door {developer}',

  'developer.grants.title': 'Apps met toegang',
  'developer.grants.grantedOn': 'Toegekend {date}',
  'developer.grants.lastUsed': 'Laatst gebruikte {relativeTime}',
  'developer.grants.revoke': 'Toegang intrekken',
  'developer.grants.revoked':
    'Toegang ingetrokken. Uw eigen verbindingen en geplande berichten worden niet beïnvloed.',

  'developer.docs.openapi': 'OpenAPI-document',
  'developer.docs.clients': 'Gegenereerde klanten',
  'developer.docs.idempotency':
    'Stuur een idempotency-sleutel bij elk creatie-, plannings- en publicatieverzoek. Het herhalen van een verzoek met dezelfde sleutel retourneert het oorspronkelijke resultaat in plaats van twee keer te publiceren.',
  'developer.docs.pagination':
    'De resultaten zijn met cursor gepagineerd. De tijden zijn expliciet en bevatten een zone.',
  'developer.docs.rateLimits':
    'Tarieflimieten gelden per werkruimte, credential, route en connector.',
} as const;
