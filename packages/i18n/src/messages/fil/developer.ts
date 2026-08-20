/** Developer surfaces: API keys, service accounts, MCP, CLI, OAuth apps. */
export const developerMessages = {
  'developer.title': 'Mga Ahente at API',
  'developer.subtitle':
    'Ang API, ang MCP server, at ang CLI ay gumagamit ng parehong mga pahintulot, patakaran sa pag-apruba at mga resibo gaya ng app.',

  'developer.serviceAccount.title': 'Mga account ng serbisyo',
  'developer.serviceAccount.create': 'Gumawa ng account ng serbisyo',
  'developer.serviceAccount.name': 'Pangalan',
  'developer.serviceAccount.scopeProjects': 'Mga project at account na magagamit nito',
  'developer.serviceAccount.scopePlatforms': 'Mga plataporma',
  'developer.serviceAccount.scopeLocales': 'Mga wika ng nilalaman',
  'developer.serviceAccount.scopeDomains': 'Pinapayagan ang mga domain ng link',
  'developer.serviceAccount.scopeHours': 'Mga oras na pinapayagan',
  'developer.serviceAccount.scopeCadence': 'Pinakamataas na mga post bawat araw',
  'developer.serviceAccount.scopeLookAhead': 'Gaano kalayo ang maiiskedyul nito',
  'developer.serviceAccount.approvalLevel': 'Antas ng pag-apruba',
  'developer.serviceAccount.killSwitch': 'Itigil ang ahente na ito',

  'developer.approvalLevel.0': 'Basahin at patunayan lamang',
  'developer.approvalLevel.1': 'Gumawa at mag-edit ng mga draft',
  'developer.approvalLevel.2': 'Mag-iskedyul sa loob ng mga limitasyong itinakda sa itaas',
  'developer.approvalLevel.3': 'Magtanong sa isang tao bago mag-publish',
  'developer.approvalLevel.description.0':
    'Maaaring tumingin ang ahente sa mga account, kakayahan, kalendaryo at analytics. Wala itong pagbabago.',
  'developer.approvalLevel.description.1':
    'Ang ahente ay maaaring magsulat ng mga draft. Nag-iskedyul at nag-publish pa rin ang isang tao.',
  'developer.approvalLevel.description.2':
    'Maaaring mag-iskedyul ang ahente sa loob ng mga account, oras, ritmo, wika, domain at tumingin sa hinaharap na itinakda mo. Ang anumang bagay sa labas ng mga limitasyong iyon ay nangangailangan ng isang tao.',
  'developer.approvalLevel.description.3':
    'Ang agarang pag-publish, isang bagong account o domain, isang maramihang pagkilos, sensitibong nilalaman o isang binagong setting ng privacy ay palaging nangangailangan ng isang tahasang kumpirmasyon mula sa isang tao.',
  'developer.bulkThreshold':
    'Ang ibig sabihin ng maramihan ay higit sa {publications, plural, one {# panlabas na publikasyon} other {# panlabas na mga publikasyon}} sa isang kahilingan, o sa parehong nilalaman sa higit sa {accounts, plural, one {# account} other {# mga account}}.',

  'developer.credential.title': 'Mga kredensyal',
  'developer.credential.create': 'Gumawa ng API key',
  'developer.credential.shownOnce':
    'Ang kredensyal na ito ay ipinapakita nang isang beses. Kopyahin ito ngayon. Nag-iimbak lamang kami ng isang hash nito.',
  'developer.credential.prefix': 'Prefix',
  'developer.credential.created': 'Nilikha {date} sa pamamagitan ng {name}',
  'developer.credential.lastUsed': 'Huling ginamit {relativeTime}',
  'developer.credential.neverUsed': 'Hindi kailanman ginamit',
  'developer.credential.expires': 'Mag-e-expire {date}',
  'developer.credential.revokeConfirm':
    'Bawiin ang kredensyal na ito? Ang anumang bagay na gumagamit nito ay hihinto kaagad sa paggana.',

  'developer.scope.title': 'Saklaw',
  'developer.scope.accountsRead':
    'Basahin ang mga konektadong account at ang kanilang mga kakayahan',
  'developer.scope.draftsWrite': 'Gumawa at mag-edit ng mga draft',
  'developer.scope.postsSchedule': 'Mag-iskedyul ng naaprubahang nilalaman',
  'developer.scope.postsPublish': 'I-publish kaagad',
  'developer.scope.analyticsRead': 'Basahin ang analytics',
  'developer.scope.receiptsRead': 'Basahin ang mga resibo ng publikasyon',
  'developer.scope.webhooksWrite': 'Pamahalaan ang mga webhook',
  'developer.scope.connectionsAdmin': 'Ikonekta at idiskonekta ang mga account',
  'developer.scope.billingRead': 'Basahin ang estado ng pagsingil',
  'developer.scope.consequential': 'Consequential',
  'developer.scope.readOnly': 'Basahin lamang',

  'developer.setup.title': 'Ikonekta ang isang kliyente',
  'developer.setup.claudeCode': 'Claude Code',
  'developer.setup.codex': 'Codex',
  'developer.setup.hermes': 'Hermes',
  'developer.setup.buzz': 'Buzz workflow',
  'developer.setup.cli': 'CLI',
  'developer.setup.genericMcp': 'Anumang MCP client',
  'developer.setup.copyConfig': 'Kopyahin ang configuration',
  'developer.setup.mcpEndpoint': 'MCP endpoint',
  'developer.setup.apiBaseUrl': 'API base URL',

  'developer.playground.title': 'Dry run',
  'developer.playground.description':
    'Magpatakbo ng mga tool laban sa seeded data. Walang nakakarating sa isang tunay na plataporma.',
  'developer.playground.run': 'Takbo',
  'developer.playground.sandboxBadge': 'Sandbox',

  'developer.activity.title': 'Kamakailang aktibidad',
  'developer.activity.toolCall': '{tool} tinawag ni {actor} {relativeTime}',
  'developer.activity.denied': 'Tinanggihan: {reason}',
  'developer.activity.empty': 'Wala pang tawag.',
  'developer.activity.redacted':
    'Ang mga katawan ng kahilingan at pagtugon ay iniimbak na may mga lihim na inalis.',

  'developer.apps.title': 'Mga app ng developer',
  'developer.apps.subtitle':
    'Hayaang kumilos ang isa pang produkto sa pamamagitan ng Relay na may mga pahintulot na ibinibigay dito ng isang user.',
  'developer.apps.create': 'Magrehistro ng app',
  'developer.apps.name': 'Pangalan ng app',
  'developer.apps.type.label': 'Uri ng kliyente',
  'developer.apps.type.public': 'Public, hindi pwedeng magtago ng sikreto',
  'developer.apps.type.confidential': 'Kumpidensyal, tumatakbo sa isang server',
  'developer.apps.homepage': 'URL ng homepage',
  'developer.apps.privacyUrl': 'URL ng patakaran sa privacy',
  'developer.apps.termsUrl': 'URL ng mga tuntunin',
  'developer.apps.logo': 'Logo',
  'developer.apps.redirectUris': 'I-redirect ang mga URI',
  'developer.apps.redirectUrisHelp':
    'Mga eksaktong tugma lamang. Tinatanggihan ang mga wildcard at partial path.',
  'developer.apps.clientId': 'Client ID',
  'developer.apps.clientSecret': 'Sikreto ng kliyente',
  'developer.apps.secretShownOnce':
    'Ang sikreto ay ipinakita nang isang beses. I-rotate ito kung mawala ito. Hindi na kami magpapakita.',
  'developer.apps.status.draft': 'Draft',
  'developer.apps.status.active': 'Aktibo',
  'developer.apps.status.disabled': 'Hindi pinagana',
  'developer.apps.consentPreview': 'Preview ng screen ng pahintulot',
  'developer.apps.grants.title': 'Mga aktibong gawad',
  'developer.apps.grants.count': '{count, plural, one {# bigyan} other {# mga gawad}}',
  'developer.apps.deleteConfirm':
    'Tanggalin ang app na ito? Ang bawat grant ay binawi at ang mga token nito ay hindi na gumagana.',

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

  'developer.grants.title': 'Mga app na may access',
  'developer.grants.grantedOn': 'ipinagkaloob {date}',
  'developer.grants.lastUsed': 'Huling ginamit {relativeTime}',
  'developer.grants.revoke': 'Bawiin ang access',
  'developer.grants.revoked':
    'Binawi ang access. Ang iyong sariling mga koneksyon at naka-iskedyul na mga post ay hindi apektado.',

  'developer.docs.openapi': 'OpenAPI na dokumento',
  'developer.docs.clients': 'Binuo ng mga kliyente',
  'developer.docs.idempotency':
    'Magpadala ng idempotency key sa bawat kahilingan sa paggawa, iskedyul at pag-publish. Ang pag-uulit ng kahilingan na may parehong key ay nagbabalik ng orihinal na resulta sa halip na mag-publish nang dalawang beses.',
  'developer.docs.pagination':
    'Ang mga resulta ay cursor paginated. Ang mga oras ay tahasan at may kasamang zone.',
  'developer.docs.rateLimits':
    'Nalalapat ang mga limitasyon sa rate sa bawat workspace, kredensyal, ruta at connector.',
} as const;
