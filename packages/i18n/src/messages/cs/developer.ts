/** Developer surfaces: API keys, service accounts, MCP, CLI, OAuth apps. */
export const developerMessages = {
  'developer.title': 'Agenti a API',
  'developer.subtitle':
    'Rozhraní API, server MCP a CLI používají stejná oprávnění, zásady schvalování a potvrzení jako aplikace.',

  'developer.serviceAccount.title': 'Služební účty',
  'developer.serviceAccount.create': 'Vytvořit servisní účet',
  'developer.serviceAccount.name': 'Jméno',
  'developer.serviceAccount.scopeProjects': 'Projekty a účty, které může používat',
  'developer.serviceAccount.scopePlatforms': 'Platformy',
  'developer.serviceAccount.scopeLocales': 'Jazyky obsahu',
  'developer.serviceAccount.scopeDomains': 'Povolené odkazové domény',
  'developer.serviceAccount.scopeHours': 'Povolené hodiny',
  'developer.serviceAccount.scopeCadence': 'Maximální počet příspěvků za den',
  'developer.serviceAccount.scopeLookAhead': 'Jak daleko dopředu to může naplánovat',
  'developer.serviceAccount.approvalLevel': 'Úroveň schválení',
  'developer.serviceAccount.killSwitch': 'Zastavit tohoto agenta',

  'developer.approvalLevel.0': 'Pouze číst a ověřovat',
  'developer.approvalLevel.1': 'Vytvářejte a upravujte koncepty',
  'developer.approvalLevel.2': 'Rozvrh v rámci výše stanovených limitů',
  'developer.approvalLevel.3': 'Před publikováním se zeptejte osoby',
  'developer.approvalLevel.description.0':
    'Agent může prohlížet účty, funkce, kalendáře a analýzy. Nic to nemění.',
  'developer.approvalLevel.description.1':
    'Agent může psát koncepty. Člověk stále plánuje a publikuje.',
  'developer.approvalLevel.description.2':
    'Agent může plánovat v rámci účtů, hodin, kadence, jazyků, domén a dívat se dopředu, které nastavíte. Cokoli mimo tyto limity potřebuje člověka.',
  'developer.approvalLevel.description.3':
    'Okamžité zveřejnění, nový účet nebo doména, hromadná akce, citlivý obsah nebo změněné nastavení soukromí vždy vyžaduje výslovné potvrzení od osoby.',
  'developer.bulkThreshold':
    'Hromadné znamená více než {publications, plural, one {# externí publikace} other {# externí publikace} few {# externí publikace} many {# externí publikace}} v jedné žádosti nebo stejný obsah na více než {accounts, plural, one {# účet} other {# účty} few {# účty} many {# účty}}.',

  'developer.credential.title': 'Přihlašovací údaje',
  'developer.credential.create': 'Vytvořte klíč API',
  'developer.credential.shownOnce':
    'Toto pověření se zobrazí jednou. Zkopírujte to hned. Ukládáme pouze její hash.',
  'developer.credential.prefix': 'Předpona',
  'developer.credential.created': 'Vytvořeno {date} od {name}',
  'developer.credential.lastUsed': 'Naposledy použito {relativeTime}',
  'developer.credential.neverUsed': 'Nikdy nepoužito',
  'developer.credential.expires': 'Platnost vyprší {date}',
  'developer.credential.revokeConfirm':
    'Zrušit toto pověření? Cokoli, co ji používá, přestane okamžitě fungovat.',

  'developer.scope.title': 'Rozsahy',
  'developer.scope.accountsRead': 'Přečtěte si připojené účty a jejich možnosti',
  'developer.scope.draftsWrite': 'Vytvářejte a upravujte koncepty',
  'developer.scope.postsSchedule': 'Naplánovat schválený obsah',
  'developer.scope.postsPublish': 'Okamžitě publikovat',
  'developer.scope.analyticsRead': 'Přečíst statistiky',
  'developer.scope.receiptsRead': 'Přečíst potvrzení o publikaci',
  'developer.scope.webhooksWrite': 'Správa webhooků',
  'developer.scope.connectionsAdmin': 'Připojování a odpojování účtů',
  'developer.scope.billingRead': 'Přečíst stav fakturace',
  'developer.scope.consequential': 'Důsledné',
  'developer.scope.readOnly': 'Pouze pro čtení',

  'developer.setup.title': 'Připojit klienta',
  'developer.setup.claudeCode': 'Claude Code',
  'developer.setup.codex': 'Kodex',
  'developer.setup.hermes': 'Hermes',
  'developer.setup.buzz': 'Pracovní postup Buzz',
  'developer.setup.cli': 'CLI',
  'developer.setup.genericMcp': 'Jakýkoli klient MCP',
  'developer.setup.copyConfig': 'Kopírovat konfiguraci',
  'developer.setup.mcpEndpoint': 'Koncový bod MCP',
  'developer.setup.apiBaseUrl': 'Základní adresa URL rozhraní API',

  'developer.playground.title': 'Provoz nasucho',
  'developer.playground.description':
    'Spouštějte nástroje proti nasazeným datům. Nic nedosáhne skutečné platformy.',
  'developer.playground.run': 'Spustit',
  'developer.playground.sandboxBadge': 'Sandbox',

  'developer.activity.title': 'Nedávná aktivita',
  'developer.activity.toolCall': '{tool} volalo {actor} {relativeTime}',
  'developer.activity.denied': 'Zamítnuto: {reason}',
  'developer.activity.empty': 'Zatím žádné hovory.',
  'developer.activity.redacted': 'Těla požadavků a odpovědí jsou uložena s odstraněným tajemstvím.',

  'developer.apps.title': 'Aplikace pro vývojáře',
  'developer.apps.subtitle':
    'Nechte jiný produkt jednat prostřednictvím Relay s oprávněními, která mu uživatel udělí.',
  'developer.apps.create': 'Zaregistrujte si aplikaci',
  'developer.apps.name': 'Název aplikace',
  'developer.apps.type.label': 'Typ klienta',
  'developer.apps.type.public': 'Veřejnost, nemůže udržet tajemství',
  'developer.apps.type.confidential': 'Důvěrné, běží na serveru',
  'developer.apps.homepage': 'Adresa URL domovské stránky',
  'developer.apps.privacyUrl': 'Adresa URL zásad ochrany osobních údajů',
  'developer.apps.termsUrl': 'Adresa URL podmínek',
  'developer.apps.logo': 'Logo',
  'developer.apps.redirectUris': 'URI přesměrování',
  'developer.apps.redirectUrisHelp':
    'Pouze přesné shody. Zástupné znaky a částečné cesty jsou odmítnuty.',
  'developer.apps.clientId': 'ID klienta',
  'developer.apps.clientSecret': 'Tajný klíč klienta',
  'developer.apps.secretShownOnce':
    'Tajemka se zobrazí jednou. Otočte jej, pokud jej ztratíte. Už to neukážeme.',
  'developer.apps.status.draft': 'Koncept',
  'developer.apps.status.active': 'Aktivní',
  'developer.apps.status.disabled': 'Zakázáno',
  'developer.apps.consentPreview': 'Náhled obrazovky souhlasu',
  'developer.apps.grants.title': 'Aktivní granty',
  'developer.apps.grants.count':
    '{count, plural, one {# grant} other {# granty} few {# granty} many {# granty}}',
  'developer.apps.deleteConfirm':
    'Smazat tuto aplikaci? Každý grant je odvolán a jeho tokeny přestanou fungovat.',

  'developer.consent.title': '{app} chce přístup k vašemu pracovnímu prostoru',
  'developer.consent.workspace': 'Pracovní prostor',
  'developer.consent.projects': 'Projekty a účty',
  'developer.consent.willBeAbleTo': '{app} bude moci',
  'developer.consent.willNotBeAbleTo': '{app} nebude moci',
  'developer.consent.approvalStillApplies':
    'Vaše zásady schvalování stále platí. Tato aplikace nemůže kolem ní publikovat.',
  'developer.consent.revokeAnyTime': 'Toto můžete kdykoli zrušit v Nastavení.',
  'developer.consent.allow': 'Povolit přístup',
  'developer.consent.deny': 'Nepovolit',
  'developer.consent.developerIdentity': 'Zveřejněno {developer}',

  'developer.grants.title': 'Aplikace s přístupem',
  'developer.grants.grantedOn': 'Uděleno {date}',
  'developer.grants.lastUsed': 'Naposledy použito {relativeTime}',
  'developer.grants.revoke': 'Zrušit přístup',
  'developer.grants.revoked':
    'Přístup odvolán. Vaše vlastní připojení a naplánované příspěvky nejsou ovlivněny.',

  'developer.docs.openapi': 'Dokument OpenAPI',
  'developer.docs.clients': 'Generovaní klienti',
  'developer.docs.idempotency':
    'Pošlete klíč idempotency s každým požadavkem na vytvoření, naplánování a zveřejnění. Opakování požadavku se stejným klíčem vrátí původní výsledek namísto publikování dvakrát.',
  'developer.docs.pagination':
    'Výsledky jsou stránkovány kurzorem. Časy jsou explicitní a zahrnují zónu.',
  'developer.docs.rateLimits':
    'Omezení sazby platí pro pracovní prostor, pověření, trasu a konektor.',
} as const;
