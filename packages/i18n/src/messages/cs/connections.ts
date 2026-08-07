/** Connections, provider capabilities and connection health. */
export const connectionMessages = {
  'connection.title': 'Připojení',
  'connection.subtitle':
    'Účty, stránky a kanály, na kterých může tento pracovní prostor publikovat.',
  'connection.add': 'Připojit účet',
  'connection.count':
    '{used, plural, one {# aktivní kanál} other {# aktivní kanály} few {# aktivní kanály} many {# aktivní kanály}} z {limit}',
  'connection.limitReached':
    'Tento pracovní prostor používá všechny {limit} kanálů. Před připojením dalšího odpojte jeden.',

  'connection.account.label': 'Účet',
  'connection.account.type.profile': 'Profil',
  'connection.account.type.page': 'Stránka',
  'connection.account.type.channel': 'Kanál',
  'connection.account.type.group': 'Skupina',
  'connection.account.type.organization': 'Organizace',
  'connection.account.type.business': 'Firemní účet',
  'connection.account.type.creator': 'Účet tvůrce',
  'connection.connectedBy': 'Připojeno uživatelem {name} na {date}',
  'connection.lastPublished': 'Naposledy publikováno {relativeTime}',
  'connection.lastPublishedNever': 'Z tohoto účtu zatím nebylo nic publikováno',
  'connection.lastAnalyticsSync': 'Analytics synchronizováno {relativeTime}',

  'connection.status.healthy': 'Pracuje',
  'connection.status.expiringSoon': 'Platnost vyprší {relativeTime}',
  'connection.status.expired': 'Platnost přístupu vypršela',
  'connection.status.revoked': 'Přístup odvolán',
  'connection.status.paused': 'Pozastaveno',
  'connection.status.permissionMissing': 'Chybí oprávnění',
  'connection.status.reviewPending': 'Čekání na kontrolu platformy',
  'connection.status.unknown': 'Zdraví nedostupné',

  'connection.token.expiresAt': 'Platnost přístupu vyprší {date}',
  'connection.token.expiryUnknown': '{provider} nám neřekne, kdy vyprší platnost tohoto přístupu.',

  'connection.permissions.title': 'Oprávnění',
  'connection.permissions.granted': 'Uděleno',
  'connection.permissions.missing': 'Neposkytováno',
  'connection.permissions.explainBeforeOAuth':
    'Relé se zeptá {provider} pro tato oprávnění. Odpojit se můžete kdykoli.',
  'connection.permissions.whyNeeded': 'Proč je to potřeba',

  'connection.reconnect.title': 'Znovu připojit {account}',
  'connection.reconnect.body':
    'Naplánované příspěvky pro tento účet jsou pozastaveny, dokud nebude znovu připojen. Nic není ztraceno.',
  'connection.disconnect.title': 'Odpojit {account}?',
  'connection.disconnect.body':
    'Naplánované příspěvky pro tento účet nebudou publikovány. Již shromážděné účtenky a analýzy zůstávají v tomto pracovním prostoru.',
  'connection.pause.body':
    'Pozastavený účet uchovává svou historii a plán, ale nepublikuje se, dokud jej neobnovíte.',

  'connection.incident.invalidToken':
    '{provider} odmítl uložený přístup pro {account}. Chcete-li obnovit publikování, znovu se připojte.',
  'connection.incident.permissionLost':
    '{account} již neuděluje {permission}. Znovu se připojte a přijměte toto oprávnění.',
  'connection.incident.roleLost':
    'Váš {provider} uživatel již nemá roli na {account}. Požádejte administrátora této stránky, aby ji obnovil.',
  'connection.incident.accountTypeInvalid':
    'Instagram potřebuje profesionální účet. Přepnout {account} k obchodnímu účtu nebo účtu autora a poté se znovu připojte.',
  'connection.incident.reviewRestricted':
    '{provider} omezil tuto aplikaci čekající na kontrolu. Příspěvky od {account} publikovat soukromě do dokončení kontroly.',

  'connection.group.title': 'Skupiny zákazníků',
  'connection.group.description':
    'Seskupit účty podle klienta nebo značky a filtrovat každou obrazovku.',
  'connection.group.assign': 'Přesunout do skupiny',
  'connection.group.none': 'Neseskupeno',
  'connection.group.moveNote':
    'Přesunutím účtu zůstanou zachovány jeho příspěvky, účtenky a analýzy.',

  'connection.oauth.starting': 'Otevření {provider}',
  'connection.oauth.returned': 'Dokončení připojení',
  'connection.oauth.chooseAccounts': 'Vyberte, které účty chcete připojit',
  'connection.oauth.connectSelected': 'Connect selected accounts',
  'connection.oauth.claimComplete': 'Selected accounts are connected',
  'connection.oauth.accountUnavailable': 'This account cannot be connected',
  'connection.oauth.noEligibleAccounts': 'Na tomto {provider} přihlášení lze připojit. {reason}',
  'connection.oauth.canceled': 'Připojení bylo zrušeno dne {provider}. Nic se nezměnilo.',
  'connection.oauth.alreadyConnected': '{account} je již připojen k tomuto pracovnímu prostoru.',
  'connection.oauth.connectedToAnotherWorkspace':
    '{account} je připojen k jinému pracovnímu prostoru. Nejprve jej tam odpojte.',

  'capability.title': 'Co tento účet podporuje',
  'capability.matrix.title': 'Možnosti platformy',
  'capability.matrix.subtitle':
    'Vytvořeno z definic konektorů, které udržujeme a ručně revidujeme.',
  'capability.level.supported': 'Podporováno',
  'capability.level.unsupported': 'Není nabízeno platformou',
  'capability.level.not_implemented': 'Zatím nepostaveno',
  'capability.level.requires_review': 'Potřebuje kontrolu platformy',
  'capability.level.beta': 'Beta',
  'capability.level.unknown': 'Nedostupné',
  'capability.explain.supported': 'Relé to dnes pro tento účet umí.',
  'capability.explain.unsupported':
    '{provider} to prostřednictvím svého oficiálního rozhraní API nenabízí, takže to žádný nástroj nemůže bezpečně provést.',
  'capability.explain.not_implemented':
    '{provider} to nabízí, ale Relay to ještě nepostavilo. Je na mapě konektoru.',
  'capability.explain.requires_review':
    '{provider} toto uděluje až poté, co zkontroluje aplikaci nebo účet. Dokud tato kontrola neprojde, zůstane nedostupná.',
  'capability.explain.beta':
    'Toto funguje, s limity, které jsme nedokončili. Zkontrolujte výsledek, než se na něj spolehnete.',
  'capability.explain.unknown':
    'Nemohli jsme přečíst aktuální oprávnění pro tento účet. Znovu se připojte a obnovte je.',
  'capability.lastChecked': 'Zaškrtnuto {relativeTime}',
  'capability.feature.text': 'Textové příspěvky',
  'capability.feature.image': 'Obrázky',
  'capability.feature.carousel': 'Kolotoče',
  'capability.feature.video': 'Video',
  'capability.feature.document': 'Dokumenty',
  'capability.feature.firstComment': 'Plánovaný první komentář',
  'capability.feature.thread': 'Vlákna',
  'capability.feature.mentions': 'Nativní zmínky',
  'capability.feature.destinations': 'Výběr destinace',
  'capability.feature.privacy': 'Ovládací prvky ochrany osobních údajů',
  'capability.feature.thumbnail': 'Vlastní miniatura',
  'capability.feature.altText': 'Alternativní text',
  'capability.feature.analytics': 'Analytics',
  'capability.feature.delete': 'Smazat publikovaný příspěvek',
  'capability.feature.commentCount': 'Počty komentářů',
  'capability.feature.commentReplies': 'Čtení a odpovídání na komentáře',
  'capability.feature.disclosure': 'Zveřejnění automatizace',
} as const;
