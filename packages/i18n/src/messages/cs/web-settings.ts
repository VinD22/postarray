/**
 * Web catalog for settings, the developer portal, billing and the Growth
 * Advisor.
 *
 * This file only adds what the web screens need on top of the intent catalogs
 * in `settings.ts`, `developer.ts`, `billing.ts` and `growth.ts`. Everything
 * here lives under a `.ui.` segment so a key can never collide with one of
 * those files when the catalogs are merged.
 *
 * Several strings are mandated word for word and must not be softened:
 *  - `billing.ui.annualFraming` states the saving in currency, never a percent.
 *  - `billing.ui.cancelConfirmedBeforeConversion` must read
 *    "Canceled. You will not be charged."
 *  - the media generation boundary paragraph is NOT restated here. It already
 *    exists as `billing.mediaGeneration.explanation`, and the Tool Radar
 *    renders that same key so there is one sentence to review and translate.
 */
export const webSettingsMessages = {
  /* ------------------------------------------------------------------ shell */

  'settings.ui.subtitle': 'Vše, co konfiguruje tento pracovní prostor. Nic zde nic nepublikuje.',
  'settings.ui.nav.label': 'Sekce nastavení',
  'settings.ui.index.help':
    'Vyberte sekci. Každá změna je připsána vám a objeví se v protokolu auditu.',

  'settings.ui.section.members': 'Členové a role',
  'settings.ui.section.membersSummary': 'Kdo je v tomto pracovním prostoru a co každý může dělat.',
  'settings.ui.section.projects': 'Projekty',
  'settings.ui.section.projectsSummary':
    'Hlas, publikum, schválené nároky, blokované výrazy, pravidla národního prostředí, domény a glosář.',
  'settings.ui.section.agents': 'Agenti a API',
  'settings.ui.section.agentsSummary':
    'Servisní účty, rozsahy, limity, pověření, aktivita a hřiště na sucho.',
  'settings.ui.section.apps': 'Aplikace pro vývojáře',
  'settings.ui.section.appsSummary':
    'Aplikace OAuth třetích stran, seznamy povolených přesměrování, souhlas a udělení.',
  'settings.ui.section.webhooks': 'Webhooky',
  'settings.ui.section.webhooksSummary':
    'Podepsané odchozí události, protokoly doručení, opětovné doručení a tajná rotace.',
  'settings.ui.section.billing': 'Fakturace',
  'settings.ui.section.billingSummary':
    'Plán, zkušební období, interval, měřené využití poskytovatele, faktury a zrušení.',
  'settings.ui.section.referrals': 'Doporučení a přidružení',
  'settings.ui.section.referralsSummary':
    'Váš zveřejněný odkaz na doporučení, přiřazené registrace a stav provize.',
  'settings.ui.section.localization': 'Lokalizace',
  'settings.ui.section.localizationSummary':
    'Jazyk rozhraní, jazyky obsahu, trhy, časové pásmo a formát času.',
  'settings.ui.section.security': 'Zabezpečení',
  'settings.ui.section.securitySummary':
    'Relace, dvoufaktorové ověřování, přihlašovací údaje, agenti, webhooky a granty aplikací.',
  'settings.ui.section.data': 'Ovládací prvky dat',
  'settings.ui.section.dataSummary':
    'Exportujte, zrušte připojení, smažte značku, odstraňte obsah nebo zavřete účet.',

  /* ------------------------------------------------------- shared UI states */

  'settings.ui.state.loading': 'Načítání {section}',
  'settings.ui.state.errorTitle': 'Nelze načíst {section}',
  'settings.ui.state.errorRetry': 'Zkuste to znovu',
  'settings.ui.state.savingAnnouncement': 'Ukládání {section}',
  'settings.ui.state.savedAnnouncement': '{section} uloženo',
  'settings.ui.state.saveFailedAnnouncement':
    '{section} nebylo uloženo. Váš příspěvek je stále zde.',
  'settings.ui.state.offlineTitle': 'Jste offline',
  'settings.ui.state.offlineBody':
    'Tuto stránku si můžete přečíst. Změny nelze uložit, dokud se připojení neobnoví.',
  'settings.ui.state.permissionTitle': 'Nemáte přístup k {section}',
  'settings.ui.state.permissionBody':
    'Tato část mění chování pracovního prostoru, takže je omezena rolí.',
  'settings.ui.state.permissionRequirements': 'Co potřebujete',
  'settings.ui.state.permissionContact':
    'Vlastník nebo správce tohoto pracovního prostoru to může udělit. Jsou uvedeny v části Členové a role.',
  'settings.ui.state.rateLimitTitle': 'Příliš mnoho změn v krátkém čase',
  'settings.ui.state.rateLimitCause':
    'Tento pracovní prostor dosáhl limitu zápisu pro změny nastavení.',
  'settings.ui.state.rateLimitReset': 'Resetování limitu',
  'settings.ui.state.rateLimitAlternative':
    'Nic, co jste uložili, se neztratilo. Akce pouze pro čtení na počkání stále fungují.',
  'settings.ui.state.rateLimitUsage': 'Nastavení zapisuje tuto hodinu',
  'settings.ui.state.rateLimitUsageText': '{used} z {limit} použito',
  'settings.ui.state.unsavedTitle': 'Máte neuložené změny',
  'settings.ui.state.unsavedBody': 'Uložte si je, než opustíte tuto sekci.',
  'settings.ui.state.readOnlyTitle': 'Tento pracovní prostor je pouze pro čtení',
  'settings.ui.state.readOnlyBody':
    'Fakturace je po splatnosti. Váš obsah, účtenky a spojení jsou nedotčeny. Nastavení lze číst, ale nelze je měnit.',

  'settings.ui.state.referenceLabel': 'Reference podpory',

  'settings.ui.attribution': 'Změněno uživatelem {name} {relativeTime}',
  'settings.ui.attributionNever': 'Nezměněno od svého vytvoření',
  'settings.ui.copyFailed': 'Váš prohlížeč kopii zablokoval. Vyberte text a ručně jej zkopírujte.',

  /* ------------------------------------------------------- members and roles */

  'settings.ui.members.description':
    'Každá pozvánka, změna role a odebrání je zaznamenáno s vaším jménem a časem.',
  'settings.ui.members.tableCaption': 'Lidé v tomto pracovním prostoru s rolí a rozsahem',
  'settings.ui.members.column.person': 'Osoba',
  'settings.ui.members.column.role': 'Role',
  'settings.ui.members.column.scope': 'Rozsah',
  'settings.ui.members.column.approvals': 'Schválení',
  'settings.ui.members.column.lastActive': 'Poslední aktivní',
  'settings.ui.members.column.actions': 'Akce',
  'settings.ui.members.scopeAll': 'Všechny značky a účty',
  'settings.ui.members.scopeLimited':
    '{count, plural, one {# značka} other {# značky} few {# značky} many {# značky}}: {names}',
  'settings.ui.members.approvals.canApprove': 'Může schválit',
  'settings.ui.members.approvals.cannotApprove': 'Nelze schválit',
  'settings.ui.members.approvals.canApproveOwnProjects': 'Lze schválit pro uvedené projekty',
  'settings.ui.members.lastActiveNever': 'Zatím se nepřihlásil',
  'settings.ui.members.changeRole': 'Změnit roli pro {name}',
  'settings.ui.members.remove': 'Odebrat {name}',
  'settings.ui.members.lastOwnerTitle': 'Pracovní prostor má alespoň jednoho vlastníka',
  'settings.ui.members.lastOwnerBody':
    'Nejprve udělejte vlastníka někoho jiného a pak bude tato změna dostupná.',
  'settings.ui.members.inviteTitle': 'Pozvěte někoho do tohoto pracovního prostoru',
  'settings.ui.members.inviteBody':
    'Obdrží e-mail s odkazem. Platnost pozvánky vyprší po sedmi dnech a do té doby ji můžete odvolat.',
  'settings.ui.members.inviteRole': 'Role',
  'settings.ui.members.inviteScope': 'Značky, se kterými mohou pracovat',
  'settings.ui.members.inviteScopeAll': 'Každá značka v tomto pracovním prostoru',
  'settings.ui.members.inviteScopeSelected': 'Pouze mnou vybrané značky',
  'settings.ui.members.inviteApprovals': 'Může rozhodnout o žádostech o schválení',
  'settings.ui.members.inviteApprovalsHelp':
    'Toto lze přidělit pouze rolím, které již zahrnují recenzi. Je oddělená od úprav.',
  'settings.ui.members.inviteSubmit': 'Poslat pozvánku',
  'settings.ui.members.invitePending': 'Pozván {relativeTime} od {name}',
  'settings.ui.members.inviteRevoke': 'Zrušit pozvánku',
  'settings.ui.members.inviteResend': 'Pošlete pozvánku znovu',
  'settings.ui.members.emptyTitle': 'Jste zde jediná osoba',
  'settings.ui.members.emptyBody':
    'Pozvěte lidi, kteří píší, schvalují nebo čtou výsledky. Každý dostane roli a rozsah značky.',
  'settings.ui.members.emptyExample':
    'Obvyklý tvar: jeden vlastník pro fakturaci, jeden schvalovatel na značku a redaktoři, kteří navrhují, ale nikdy nepublikují.',
  'settings.ui.members.roleReferenceTitle': 'Co může každá role dělat',
  'settings.ui.members.roleReferenceCaption': 'Role a akce, které každá z nich umožňuje',
  'settings.ui.members.roleColumn.role': 'Role',
  'settings.ui.members.roleColumn.can': 'Umí',
  'settings.ui.members.roleColumn.cannot': 'Nelze udělat',
  'settings.ui.members.roleCannot.owner': 'Vlastníkovi není nic zadržováno.',
  'settings.ui.members.roleCannot.admin': 'Změňte fakturaci nebo odstraňte pracovní prostor.',
  'settings.ui.members.roleCannot.manager':
    'Změna fakturace, smazání rolí nebo pracovního prostoru.',
  'settings.ui.members.roleCannot.editor':
    'Schvalujte, plánujte, publikujte nebo změňte připojení.',
  'settings.ui.members.roleCannot.approver': 'Změňte připojení, pravidla nebo fakturaci.',
  'settings.ui.members.roleCannot.analyst':
    'Vytvářejte, upravujte, schvalujte nebo publikujte cokoli.',
  'settings.ui.members.roleCannot.viewer': 'Změňte vůbec cokoli.',
  'settings.ui.members.removeTitle': 'Odebrat {name} z tohoto pracovního prostoru',
  'settings.ui.members.removeConsequence.access': 'Okamžitě ztratí přístup na každém povrchu.',
  'settings.ui.members.removeConsequence.drafts':
    'Koncepty, které napsali, zůstávají v pracovním prostoru a lze je upravovat.',
  'settings.ui.members.removeConsequence.audit':
    'Jejich minulé akce zůstávají v protokolu auditu a na účtenkách.',
  'settings.ui.members.removeConsequence.approvals':
    'Žádosti o schválení, které na ně čekají, se vrátí do fronty pro jiného schvalovatele.',

  /* ----------------------------------------------------------------- projects */

  'settings.ui.projects.description':
    'Značka má pravidla, podle kterých je obsah kontrolován: co si můžete nárokovat, co nesmíte říkat a jak jsou jednotlivé jazyky napsány.',
  'settings.ui.projects.listCaption': 'Projekty v tomto pracovním prostoru',
  'settings.ui.projects.column.project': 'Projekt',
  'settings.ui.projects.column.locales': 'Jazyky obsahu',
  'settings.ui.projects.column.accounts': 'Účty',
  'settings.ui.projects.column.updated': 'Aktualizováno',
  'settings.ui.projects.accountCount':
    '{count, plural, =0 {Žádné účty} one {# účet} other {# účty} few {# účty} many {# účty}}',
  'settings.ui.projects.emptyTitle': 'Zatím žádné projekty',
  'settings.ui.projects.emptyBody':
    'Značka seskupuje účty, pravidla schvalování a jazyková pravidla. Většina týmů začíná s jedním a přidává druhý, když klient nebo trh potřebuje jiná pravidla.',
  'settings.ui.projects.emptyExample':
    'Příklad: značka „Acme EU“, jazyky angličtina a němčina, blokovaný výraz „zaručeno“, zveřejnění „placeného partnerství“ na Instagramu.',
  'settings.ui.projects.voiceHelp':
    'Jak tento projekt zní. Používá se, když žádáte o přepsání a když se kontrolují nároky.',
  'settings.ui.projects.audienceHelp': 'Pro koho je obsah určen podle trhu.',
  'settings.ui.projects.approvedClaimsHelp':
    'Výroky, které recenzent vymazal. Cokoli mimo tento seznam je označeno před schválením, nikoli po zveřejnění.',
  'settings.ui.projects.blockedTermsHelp':
    'Slova, která blokují plánování pro tento projekt. Jeden na řádek.',
  'settings.ui.projects.domainsHelp':
    'Domény, na které může tento projekt odkazovat a zkracovat je. Ve skladateli lze vybrat pouze ověřené domény.',
  'settings.ui.projects.domainVerified': 'Ověřeno {date}',
  'settings.ui.projects.domainPending': 'DNS záznam ještě nebyl zobrazen',
  'settings.ui.projects.domainVerificationUnavailable': 'Ověření zatím není postaveno',
  'settings.ui.projects.disclosureUnavailable':
    'Výchozí zveřejnění pro jednotlivé kanály zatím není postaveno. Přidejte požadované zveřejnění do příspěvku, dokud toto nebude vydáno.',
  'settings.ui.projects.glossaryUnavailable':
    'Slovník pracovního prostoru zatím není postaven. Tón, publikum, schválená tvrzení a blokované výrazy výše se ukládají a vynucují.',
  'settings.ui.projects.localeRulesUnavailable':
    'Pravidla psaní pro jednotlivé jazyky zatím nejsou postavena. Jazyky a trhy pracovního prostoru zůstávají dostupné v části Lokalizace.',
  'settings.ui.projects.disclosureHelp':
    'Ve výchozím nastavení použito ve skladateli pro platformy, které zde vyberete. Před schválením jej lze změnit u příspěvku.',
  'settings.ui.projects.glossaryHelp':
    'Názvy produktů, právní podmínky a vše, co musí vydržet překlad beze změny.',
  'settings.ui.projects.glossaryCaption':
    'Chráněné výrazy a způsob, jakým je každý z nich zpracován v jednotlivých jazycích',
  'settings.ui.projects.glossaryEmpty':
    'Zatím žádné chráněné výrazy. Přidejte názvy produktů a právní termíny, které se nesmí překládat ani přeformulovat.',
  'settings.ui.projects.localeRulesHelp':
    'Pravidla pro jazyk obsahu. Použijí se, když se přizpůsobíte nebo přeměníte, a zobrazí se recenzentovi.',
  'settings.ui.projects.saveProject': 'Uložit projekt',
  'settings.ui.projects.capacityTitle': 'Kapacita projektů',
  'settings.ui.projects.capacityHelp':
    'Základní plán za 29 $ zahrnuje 3 aktivní projekty. Pracovní prostor může mít nárok až na 20 bez vytváření dalšího účtu.',
  'settings.ui.projects.capacitySummary': '{used} z {limit}',
  'settings.ui.projects.atLimitTitle': 'Tento pracovní prostor využil každé místo pro projekt',
  'settings.ui.projects.atLimitBody':
    'Před přidáním dalšího archivujte neaktivní projekt nebo změňte nárok pracovního prostoru. Aktuální limit je {limit}.',
  'settings.ui.projects.listLabel': 'Vyberte projekt k úpravě',
  'settings.ui.projects.detailsTitle': 'Podrobnosti projektu',
  'settings.ui.projects.projectMeta':
    '{accounts, plural, =0 {Žádné kanály} one {# kanál} few {# kanály} many {# kanálu} other {# kanálů}} · Aktualizováno {updated}',
  'settings.ui.projects.archiveAction': 'Archivovat projekt',
  'settings.ui.projects.archiveTitle': 'Archivovat {project}?',
  'settings.ui.projects.archiveBody':
    'Tento neaktivní projekt opouští aktivní pracovní prostor a uvolňuje jedno místo pro projekt.',
  'settings.ui.projects.archiveChannels':
    'Jeho propojené kanály přestanou zobrazovat se v tocích aktivních projektů.',
  'settings.ui.projects.archiveHistory':
    'Koncepty, publikované příspěvky, potvrzenky a auditní historie se zachovávají.',
  'settings.ui.projects.archiveLastDisabled': 'Zachovejte v pracovním prostoru alespoň jeden aktivní projekt.',
  'settings.ui.projects.archiveConnectedDisabled': 'Před archivací odpojte kanály tohoto projektu.',

  /* ------------------------------------------------------------ localization */

  'settings.ui.localization.description':
    'Tři samostatná nastavení: jazyk této aplikace, jazyky, ve kterých publikujete, a trhy, pro které píšete. Změna jednoho nikdy nezmění druhého.',
  'settings.ui.localization.interfaceOnlyEnglish':
    'Vyberte jazyk rozhraní pro tuto aplikaci. Jazyky obsahu jsou samostatné a již jsou k dispozici.',
  'settings.ui.localization.marketHelp':
    'Trh mění příklady, právní zveřejnění a výzvy k akci. Nemění to jazyk příspěvku.',
  'settings.ui.localization.previewTitle': 'Jak se budou číst data a čísla',
  'settings.ui.localization.previewDate': 'Datum',
  'settings.ui.localization.previewTime': 'Čas',
  'settings.ui.localization.previewNumber': 'Číslo',
  'settings.ui.localization.previewCurrency': 'Měna',
  'settings.ui.localization.weekStartHelp': 'Používá se zobrazením kalendářního týdne.',

  /* ---------------------------------------------------------------- security */

  'settings.ui.security.description':
    'Vše, co může na tomto pracovním prostoru působit na jednom místě: vaše relace, přihlašovací údaje, agenti, webhooky a aplikace, ke kterým jste udělili přístup.',
  'settings.ui.security.sessionsCaption': 'Relace přihlášení k vašemu účtu',
  'settings.ui.security.sessionColumn.device': 'Zařízení a prohlížeč',
  'settings.ui.security.sessionColumn.location': 'Přibližná poloha',
  'settings.ui.security.sessionColumn.lastSeen': 'Naposledy použito',
  'settings.ui.security.sessionCurrent': 'Tato relace',
  'settings.ui.security.sessionRevokeAll': 'Odhlaste se každou další relaci',
  'settings.ui.security.sessionLocationUnknown': 'Poloha není zaznamenána',
  'settings.ui.security.mfaOn': 'Dvoufaktorové ověřování je zapnuto',
  'settings.ui.security.mfaOff': 'Dvoufaktorové ověřování je vypnuto',
  'settings.ui.security.mfaBody':
    'Před změnami fakturace, vytvořením servisního účtu, opětovným připojením účtu a zrušením přihlašovacích údajů je vyžadován druhý faktor.',
  'settings.ui.security.credentialsTitle': 'Klíče API',
  'settings.ui.security.credentialsBody':
    'Klíče vlastněné tímto pracovním prostorem. Jsou oddělené od grantů na aplikace a od vaší vlastní relace.',
  'settings.ui.security.agentsTitle': 'Služební účty',
  'settings.ui.security.webhooksTitle': 'Koncové body webhooku',
  'settings.ui.security.grantsTitle': 'Aplikace, které jste povolili',
  'settings.ui.security.grantsBody':
    'Odvolání aplikace okamžitě zastaví její tokeny. Vaše vlastní připojení a naplánované příspěvky nejsou ovlivněny.',
  'settings.ui.security.grantScopes': 'Udělená oprávnění',
  'settings.ui.security.socialPermissionsTitle': 'Oprávnění k sociálnímu účtu',
  'settings.ui.security.socialPermissionsBody':
    'Co každý připojený účet umožnil Relay dělat, ze snímku schopností pořízeného v době připojení.',
  'settings.ui.security.viewInSection': 'Spravovat v {section}',
  'settings.ui.security.emptySessions': 'Přihlášena je pouze tato relace.',
  'settings.ui.security.emptyGrants':
    'K tomuto pracovnímu prostoru nemá přístup žádná aplikace třetí strany. Aplikace se zde zobrazí poté, co je povolíte na obrazovce souhlasu.',
  'settings.ui.security.revokeGrantTitle': 'Zrušit přístup pro {app}',
  'settings.ui.security.revokeGrantConsequence.tokens':
    'Jeho přístupové a obnovovací tokeny okamžitě přestanou fungovat.',
  'settings.ui.security.revokeGrantConsequence.scheduled':
    'Zveřejňuje již naplánovaný pobyt. Pokud je chcete zastavit, zrušte je samostatně.',
  'settings.ui.security.revokeGrantConsequence.reconnect':
    'Aplikace může znovu požádat o přístup a vy můžete odmítnout.',

  /* ----------------------------------------------------------- data controls */

  'settings.ui.data.description':
    'Vyjměte svá data, odeberte jednu věc nebo zavřete účet. Každá destruktivní akce přesně pojmenuje to, čeho se dotkne jako první.',
  'settings.ui.data.exportTitle': 'Exportovat',
  'settings.ui.data.exportBody':
    'Přenosný archiv obsahu, plánů, účtenek, analytických a auditních událostí a vašich nahraných médií.',
  'settings.ui.data.exportJson': 'Strukturovaný JSON',
  'settings.ui.data.exportCsv': 'Tabulkový soubor CSV',
  'settings.ui.data.exportMedia': 'Archiv médií',
  'settings.ui.data.exportJsonHelp':
    'Jeden soubor na typ záznamu. Dokumentováno a stabilní napříč verzemi.',
  'settings.ui.data.exportCsvHelp': 'Příspěvky, účtenky a metriky jako ploché tabulky pro tabulku.',
  'settings.ui.data.exportMediaHelp':
    'Původní soubory, které jste nahráli nebo importovali, s kontrolními součty.',
  'settings.ui.data.exportStart': 'Připravit export',
  'settings.ui.data.exportRunning':
    'Příprava exportu. Po zavření této stránky pokračuje v provozu.',
  'settings.ui.data.exportReady': 'Export připraven, připraven {date}',
  'settings.ui.data.exportDownload': 'Stáhnout export',
  'settings.ui.data.exportExpires': 'Platnost odkazu ke stažení vyprší {date}.',
  'settings.ui.data.deleteTitle': 'Smazat',
  'settings.ui.data.deleteBody':
    'Vyberte si tu nejmenší věc, která vyřeší váš problém. Každá níže uvedená možnost říká, co přežije.',
  'settings.ui.data.deleteConnection': 'Odvolat jedno sociální spojení',
  'settings.ui.data.deleteConnectionHelp':
    'Odebere přenosový přístup k tomuto účtu. Pracovní prostor, jeho obsah a účtenky zůstávají.',
  'settings.ui.data.deleteProject': 'Archivovat projekt',
  'settings.ui.data.deleteProjectHelp':
    'Odstraní projekt, jeho pravidla a jeho glosář. Obsah publikovaný pod ním si uchovává účtenky.',
  'settings.ui.data.deleteContent': 'Smazat obsah a média',
  'settings.ui.data.deleteContentHelp':
    'Odstraní koncepty a uložené soubory. Neodstraňuje nic, co již bylo na platformě zveřejněno.',
  'settings.ui.data.deleteAccount': 'Zavřít tento pracovní prostor',
  'settings.ui.data.deleteAccountHelp':
    'Zruší naplánované úlohy, zruší každé připojení, odebere uložená média a zavře pracovní prostor.',
  'settings.ui.data.scheduledJobsTitle': 'Plánovaná práce, která bude zrušena jako první',
  'settings.ui.data.scheduledJobsCount':
    '{count, plural, =0 {Nyní není nic naplánováno} one {# plánovaný příspěvek} other {# plánované příspěvky} few {# plánované příspěvky} many {# plánované příspěvky}}',
  'settings.ui.data.cancelJobsFirst': 'Zrušit naplánované příspěvky',
  'settings.ui.data.cancelJobsDone': 'Plánované příspěvky byly zrušeny. Nic se nezveřejní.',
  'settings.ui.data.deleteConfirmPhraseLabel': 'Pro potvrzení zadejte název pracovního prostoru',
  'settings.ui.data.deleteConsequence.jobs':
    'Každý naplánovaný příspěvek je zrušen, než bude cokoli odstraněno.',
  'settings.ui.data.deleteConsequence.connections':
    'Každé sociální připojení je u poskytovatele zrušeno.',
  'settings.ui.data.deleteConsequence.media': 'Uložená média jsou smazána a nelze je obnovit.',
  'settings.ui.data.deleteConsequence.receipts':
    'Potvrzení o publikaci jsou uchovávány po dobu uchování uvedenou v podmínkách a poté odstraněny.',
  'settings.ui.data.deleteConsequence.published':
    'Příspěvky, které jsou již zveřejněny na platformě, nebudou smazány. Odstraňte ty na platformě.',
  'settings.ui.data.exportFirst': 'Exportujte svá data, než je smažete.',

  /* --------------------------------------------------------------- referrals */

  'settings.ui.referral.description':
    'Sdílejte relé se zveřejněným odkazem. Provize není nikdy podmíněna kladnou kontrolou.',
  'settings.ui.referral.linkLabel': 'Váš odkaz na doporučení',
  'settings.ui.referral.tableCaption': 'Přiřazené registrace a jejich stav provize',
  'settings.ui.referral.column.signup': 'Registrace',
  'settings.ui.referral.column.date': 'Datum',
  'settings.ui.referral.column.state': 'Provize',
  'settings.ui.referral.column.amount': 'Částka',
  'settings.ui.referral.emptyTitle': 'Zatím žádné přiřazené registrace',
  'settings.ui.referral.emptyBody':
    'Zde se objeví registrace, jakmile někdo zahájí zkušební verzi prostřednictvím vašeho odkazu. Částky zůstávají nevyřízené, dokud se neuzavře okno pro vrácení peněz.',
  'settings.ui.referral.emptyExample':
    'Příklad řádku: acme.example, zkušební verze zahájena 12. června, čeká se do 12. července, poté schválena.',
  'settings.ui.referral.termsLink': 'Přečtěte si podmínky partnera',
  'settings.ui.referral.balance': 'Schválená provize',
  'settings.ui.referral.balanceUnavailableReason':
    'Kniha provizí za toto období ještě nebyla odsouhlasena.',

  /* --------------------------------------------------------- agents and API */

  'developer.ui.agents.description':
    'Účet služby je pojmenovaná identita pro agenta, skript nebo pracovní postup. Má své vlastní rozsahy, vlastní limity a vlastní audit trail.',
  'developer.ui.agents.emptyTitle': 'Zatím žádné servisní účty',
  'developer.ui.agents.emptyBody':
    'Vytvořte jeden pro každou automatizaci, kterou spustíte. Oddělené účty znamenají, že můžete jeden odvolat, aniž byste zastavili ostatní.',
  'developer.ui.agents.emptyExample':
    'Příklad: "Obsahový agent", značka Acme EU, může navrhnout a naplánovat až 6 příspěvků denně mezi 7:00 a 22:00, nikdy se nepublikuje okamžitě.',
  'developer.ui.agents.step.identity': 'Název a účel',
  'developer.ui.agents.step.scope': 'Čeho může dosáhnout',
  'developer.ui.agents.step.limits': 'Limity',
  'developer.ui.agents.purpose': 'K čemu je tento účet určen',
  'developer.ui.agents.purposeHelp':
    'Jedna věta. Zobrazuje se vedle každé akce, kterou tento účet provede v protokolu auditu.',
  'developer.ui.agents.scopeHelp': 'Rozsah se uděluje přesně sám. Nic zde nenaznačuje nic jiného.',
  'developer.ui.agents.limitsHelp':
    'Limity vynucuje rozhraní API, nikoli agent. Agent nemůže zvýšit svůj vlastní limit.',
  'developer.ui.agents.quietHours': 'Tiché hodiny',
  'developer.ui.agents.quietHoursHelp':
    'Účet nemůže naplánovat ani publikovat během těchto hodin, v časovém pásmu pracovního prostoru.',
  'developer.ui.agents.lookAheadHelp': 'Jak daleko do budoucnosti může umístit příspěvek.',
  'developer.ui.agents.cadenceHelp':
    'Největší počet externích publikací, které může způsobit za jeden den.',
  'developer.ui.agents.expiry': 'Vypršení platnosti pověření',
  'developer.ui.agents.expiryHelp': 'Kratší životnost je bezpečnější. Otočit můžete kdykoli.',
  'developer.ui.agents.summaryTitle': 'Než jej vytvoříte',
  'developer.ui.agents.summaryAccounts': 'Účty, na které může dosáhnout',
  'developer.ui.agents.summaryMaxActions':
    'Maximálně {count, plural, one {# externí publikace} other {# externí publikace} few {# externí publikace} many {# externí publikace}} za den.',
  'developer.ui.agents.summaryApproval': 'Chování při schvalování',
  'developer.ui.agents.summaryCreate': 'Vytvořit servisní účet',
  'developer.ui.agents.detailTitle': 'Servisní účet',
  'developer.ui.agents.statusActive': 'Aktivní',
  'developer.ui.agents.statusStopped': 'Zastaveno',
  'developer.ui.agents.statusExpired': 'Platnost pověření vypršela',
  'developer.ui.agents.stoppedBody':
    'Tento účet je zastaven. Každý hovor je odmítnut s jasným důvodem. Nebylo odstraněno nic, co vytvořil.',
  'developer.ui.agents.killTitle': 'Zastavit {name}',
  'developer.ui.agents.killConsequence.calls':
    'Každé volání API, MCP a CLI z tohoto účtu je najednou odmítnuto.',
  'developer.ui.agents.killConsequence.scheduled':
    'Zveřejňuje již naplánovaný pobyt. Pokud je chcete zastavit, zrušte je z kalendáře.',
  'developer.ui.agents.killConsequence.reversible': 'Můžete to spustit znovu později.',
  'developer.ui.agents.resume': 'Spustit tohoto agenta znovu',
  'developer.ui.agents.rotate': 'Otočit přihlašovací údaje',
  'developer.ui.agents.rotateTitle': 'Otočte pověření pro {name}',
  'developer.ui.agents.rotateConsequence.old': 'Aktuální pověření okamžitě přestane fungovat.',
  'developer.ui.agents.rotateConsequence.new': 'Nový je zobrazen jednou, na této stránce.',
  'developer.ui.agents.rotateConsequence.clients':
    'Cokoli používající starou hodnotu selže, dokud ji neaktualizujete.',
  'developer.ui.agents.credentialStored': 'Uložil jsem tyto přihlašovací údaje',
  'developer.ui.agents.credentialLabel': 'Pověření servisního účtu',
  'developer.ui.agents.credentialWarning':
    'Toto je jediný případ, kdy jsou tyto přihlašovací údaje zobrazeny',
  'developer.ui.agents.credentialWarningBody':
    'Zkopírujte jej do svého tajného obchodu. Uchováváme pouze hash, takže jej nemůžeme znovu zobrazit. Otočením se vytvoří nový.',
  'developer.ui.agents.credentialConsumed':
    'Přihlašovací údaje se již nezobrazují. Otočte jej, pokud jste jej neuložili.',
  'developer.ui.agents.credentialReveal': 'Zobrazit přihlašovací údaje',
  'developer.ui.agents.credentialHide': 'Skrýt přihlašovací údaje',

  /* Scope sentences written for the person granting them, not for the
     developer requesting them. The developer facing wording lives in
     `developer.scope.*`. */
  'developer.ui.scope.accounts_read':
    'Podívejte se na své propojené účty a na to, co každý z nich umí',
  'developer.ui.scope.accounts_write': 'Přejmenujte účty a změňte způsob jejich seskupování',
  'developer.ui.scope.drafts_read': 'Přečtěte si své koncepty a jejich varianty',
  'developer.ui.scope.drafts_write': 'Vytvářejte a upravujte koncepty',
  'developer.ui.scope.posts_schedule': 'Naplánujte schválený obsah do svých účtů',
  'developer.ui.scope.posts_publish': 'Okamžitě publikujte do svých účtů',
  'developer.ui.scope.posts_cancel': 'Zrušit naplánované příspěvky',
  'developer.ui.scope.analytics_read': 'Přečtěte si analýzy pro své účty',
  'developer.ui.scope.media_read': 'Zobrazit soubory ve vaší knihovně',
  'developer.ui.scope.media_write': 'Nahrávejte a upravujte soubory ve vaší knihovně',
  'developer.ui.scope.rules_read': 'Přečtěte si pravidla automatizace',
  'developer.ui.scope.rules_write':
    'Vytvářejte a měňte pravidla automatizace, která mohou publikovat',
  'developer.ui.scope.growth_read': 'Přečtěte si své plány růstu',
  'developer.ui.scope.growth_write': 'Vytvářejte a upravujte plány růstu',
  'developer.ui.scope.webhooks_manage': 'Vytváření a změna koncových bodů webhooku',
  'developer.ui.scope.billing_read': 'Přečtěte si svůj plán, zkušební stav a využití',
  'developer.ui.scope.connections_admin': 'Připojování a odpojování sociálních účtů',

  'developer.ui.activity.caption': 'Nedávná volání nástrojů s těmi, která byla odmítnuta',
  'developer.ui.activity.column.time': 'Čas',
  'developer.ui.activity.column.tool': 'Nástroj nebo trasa',
  'developer.ui.activity.column.outcome': 'Výsledek',
  'developer.ui.activity.column.subject': 'Předmět',
  'developer.ui.activity.outcome.ok': 'Povoleno',
  'developer.ui.activity.outcome.denied': 'Zamítnuto',
  'developer.ui.activity.outcome.failed': 'Neúspěšné',
  'developer.ui.activity.filterDenied': 'Zobrazit pouze odmítnuté pokusy',
  'developer.ui.activity.deniedExplain':
    'Odmítnutý pokus je způsob, jakým se projevuje špatně nakonfigurovaný agent. Tyto řádky jsou zachovány, nejsou skryté.',
  'developer.ui.activity.emptyTitle': 'Zatím nebyly zaznamenány žádné hovory',
  'developer.ui.activity.emptyBody':
    'Volání se zde objeví během několika sekund od uskutečnění, včetně těch, které byly odmítnuty.',
  'developer.ui.activity.emptyExample':
    'Příklad řádku: 12:03, draft_post, Allowed, draft for X account @acme.',

  'developer.ui.setup.help':
    'Vložte toto do klienta, ke kterému se připojujete. Nahraďte zástupný symbol pověření hodnotou, kterou jste uložili.',
  'developer.ui.setup.credentialPlaceholder':
    'Úryvek používá zástupný symbol. Nikdy neodesílejte skutečné pověření do úložiště.',
  'developer.ui.setup.copySnippet': 'Kopírovat úryvek pro {client}',
  'developer.ui.setup.snippetCopied': 'Úryvek zkopírován',
  'developer.ui.setup.tabLabel': 'Úryvky nastavení klienta',

  'developer.ui.playground.help':
    'Volání běží proti nasazené kopii tohoto pracovního prostoru. Není kontaktován žádný poskytovatel a nic není naplánováno.',
  'developer.ui.playground.tool': 'Nástroj',
  'developer.ui.playground.arguments': 'Argumenty',
  'developer.ui.playground.argumentsHelp': 'JSON. Stejné tělo jako skutečné API akceptuje.',
  'developer.ui.playground.result': 'Výsledek',
  'developer.ui.playground.resultEmpty':
    'Spusťte nástroj, abyste viděli odpověď, kterou by vrátil.',
  'developer.ui.playground.invalidJson': 'Toto zatím není platný JSON, takže jej nelze odeslat.',
  'developer.ui.playground.deniedByApproval':
    'Úroveň schválení {level} toto volání nepovoluje. Suchý běh to odmítne přesně tak, jak by to udělalo API.',
  'developer.ui.playground.announceResult': 'Suchý běh byl dokončen. {outcome}.',

  /* --------------------------------------------------------- developer apps */

  'developer.ui.apps.description':
    'Zaregistrujte aplikaci, aby jí ostatní lidé mohli udělit přístup ke svému pracovnímu prostoru. Každá aplikace má svou vlastní identitu, svůj vlastní seznam povolených přesměrování a vlastní audit trail.',
  'developer.ui.apps.emptyTitle': 'Žádné registrované aplikace',
  'developer.ui.apps.emptyBody':
    'Zaregistrujte aplikaci, když jiný produkt potřebuje jednat jménem uživatele Relay. Pro vlastní automatizaci použijte místo toho servisní účet.',
  'developer.ui.apps.emptyExample':
    'Příklad: "Acme Publisher", důvěrný klient, přesměrování https://acme.example/oauth/callback, rozsahy účty:čtení a koncepty:zápis.',
  'developer.ui.apps.typeHelp':
    'Důvěrný klient běží na serveru, který ovládáte, a může udržovat tajemství. Veřejný klient je prohlížeč nebo desktopová aplikace a používá PKCE bez tajemství.',
  'developer.ui.apps.redirectAdd': 'Přidejte URI přesměrování',
  'developer.ui.apps.redirectRemove': 'Odebrat {uri}',
  'developer.ui.apps.redirectInvalid':
    'Zadejte úplný https URI bez zástupných znaků a bez řetězce dotazu. Musí přesně odpovídat hodnotě, kterou vaše aplikace odesílá.',
  'developer.ui.apps.linksTitle': 'Publikované odkazy',
  'developer.ui.apps.linksHelp':
    'Objeví se na obrazovce souhlasu. Uživatel, který je nemůže zastihnout, jim neudělí přístup.',
  'developer.ui.apps.linkUnreachable':
    'Při poslední kontrole se nám nepodařilo získat tuto adresu URL, {date}.',
  'developer.ui.apps.linkReachable': 'Dosažitelné, zaškrtnuté {date}',
  'developer.ui.apps.scopesTitle': 'Oprávnění, která může tato aplikace vyžadovat',
  'developer.ui.apps.scopesHelp':
    'Požádejte o to nejméně, co potřebujete. Uživatel vidí oprávnění ke čtení a následná oprávnění jako dvě samostatné skupiny.',
  'developer.ui.apps.scopeGroup.read': 'Oprávnění ke čtení',
  'developer.ui.apps.scopeGroup.reversible': 'Změny, které můžete vrátit zpět',
  'developer.ui.apps.scopeGroup.consequential': 'Následná oprávnění',
  'developer.ui.apps.scopeGroupHelp.read': 'Umožňují aplikaci podívat se na data. Nic se nemění.',
  'developer.ui.apps.scopeGroupHelp.reversible':
    'Umožňují aplikaci vytvářet nebo upravovat věci uvnitř Relay. Na platformu se nic nedostane.',
  'developer.ui.apps.scopeGroupHelp.consequential':
    'Můžou způsobit příspěvek na skutečném účtu nebo změnit, kdo se může dostat k vašim účtům. Jsou vždy uvedeny samostatně a nikdy nejsou spojeny.',
  'developer.ui.apps.noBundling':
    'Neexistuje žádný kombinovaný rozsah přístupu. Fakturace a správa připojení jsou vždy požadovány podle jména.',
  'developer.ui.apps.secretTitle': 'Tajný klíč klienta',
  'developer.ui.apps.secretWarning': 'Toto je jediný případ, kdy je zobrazen tajný klíč klienta',
  'developer.ui.apps.secretWarningBody':
    'Uložte jej nyní ve správci tajných informací na straně serveru. Uchováváme pouze hash. Pokud ji ztratíte, otočte ji: neexistuje způsob, jak ji znovu odhalit.',
  'developer.ui.apps.secretConsumed':
    'Tajný klíč se již nezobrazuje. Otočte jej, pokud jste jej neuložili.',
  'developer.ui.apps.secretStored': 'Uložil jsem toto tajemství',
  'developer.ui.apps.secretPublicClient':
    'Veřejný klient nemá žádné tajemství. Používá tok autorizačního kódu s PKCE.',
  'developer.ui.apps.rotateTitle': 'Otočte tajný klíč klienta pro {app}',
  'developer.ui.apps.rotateConsequence.old': 'Aktuální tajný klíč okamžitě přestane fungovat.',
  'developer.ui.apps.rotateConsequence.grants': 'Stávající uživatelská oprávnění nejsou odvolána.',
  'developer.ui.apps.rotateConsequence.deploy':
    'Vaše servery neobnoví tokeny, dokud nenasadíte novou hodnotu.',
  'developer.ui.apps.consentPreviewTitle': 'Náhled obrazovky souhlasu',
  'developer.ui.apps.consentPreviewHelp':
    'Toto vidí uživatel. Generuje se ze záznamu aplikace, takže nemůže slíbit víc, než o co aplikace žádá.',
  'developer.ui.apps.consentPreviewSample':
    'Pouze náhled. Nic není uděleno a není vydán žádný token.',
  'developer.ui.apps.grantsCaption': 'Pracovní prostory, které této aplikaci udělily přístup',
  'developer.ui.apps.grantColumn.workspace': 'Pracovní prostor',
  'developer.ui.apps.grantColumn.scopes': 'Rozsahy',
  'developer.ui.apps.grantColumn.granted': 'Uděleno',
  'developer.ui.apps.grantColumn.lastUsed': 'Naposledy použito',
  'developer.ui.apps.grantsEmpty': 'Této aplikaci zatím nikdo neudělil přístup.',
  'developer.ui.apps.logsCaption':
    'Poslední požadavky s odstraněnými tajnými informacemi a užitečnými zatíženími',
  'developer.ui.apps.logColumn.time': 'Čas',
  'developer.ui.apps.logColumn.route': 'Trasa',
  'developer.ui.apps.logColumn.status': 'Stav',
  'developer.ui.apps.logColumn.workspace': 'Pracovní prostor',
  'developer.ui.apps.logsRedacted':
    'Těla požadavků a odpovědí jsou uložena s odstraněnými přihlašovacími údaji, tokeny a uživatelským obsahem.',
  'developer.ui.apps.sandboxTitle': 'Přihlašovací údaje do izolovaného prostoru',
  'developer.ui.apps.sandboxBody':
    'Samostatné ID klienta a pracovní prostor s nasazenými daty. Hovory uskutečněné s ním se nikdy nedostanou k poskytovateli.',
  'developer.ui.apps.rateLimitLabel': 'Limit sazby',
  'developer.ui.apps.rateLimitUsage': '{used} z {limit} požaduje tuto hodinu',
  'developer.ui.apps.disable': 'Zakázat aplikaci',
  'developer.ui.apps.enable': 'Povolit aplikaci',
  'developer.ui.apps.disabledBody':
    'Tato aplikace je zakázána. Stávající tokeny jsou odmítnuty a nelze zahájit žádný nový grant. Granty jsou zachovány, takže je můžete znovu aktivovat.',
  'developer.ui.apps.deleteTitle': 'Smazat {app}',
  'developer.ui.apps.deleteConsequence.grants':
    'Každý grant je odvolán a každý token přestane fungovat.',
  'developer.ui.apps.deleteConsequence.logs':
    'Protokoly požadavků jsou uchovávány po dobu uchovávání auditu.',
  'developer.ui.apps.deleteConsequence.irreversible': 'ID klienta nelze znovu použít.',

  /* ---------------------------------------------------------------- webhooks */

  'developer.ui.webhooks.description':
    'Podepsané doručení HTTPS pro události, které si vyberete. Každá zásilka je zaprotokolována se svou odpovědí a každou zásilku lze odeslat znovu.',
  'developer.ui.webhooks.emptyTitle': 'Zatím žádné koncové body',
  'developer.ui.webhooks.emptyBody':
    'Přidejte koncový bod pro příjem výsledků publikování, rozhodnutí o schválení a stavu připojení ve vašich vlastních systémech.',
  'developer.ui.webhooks.emptyExample':
    'Příklad: https://hooks.acme.example/relay, přihlášen k odběru post.published, post.failed a connection.action_required.',
  'developer.ui.webhooks.create': 'Přidat koncový bod',
  'developer.ui.webhooks.url': 'Adresa URL koncového bodu',
  'developer.ui.webhooks.urlHelp':
    'Pouze HTTPS. Nesledujeme žádná přesměrování a nepokoušíme se o 2xx.',
  'developer.ui.webhooks.eventsTitle': 'Události',
  'developer.ui.webhooks.eventsHelp':
    'Vyberte události, které zpracováváte. Odeslání všeho do koncového bodu, který většinu toho ignoruje, ztěžuje viditelnost selhání.',
  'developer.ui.webhooks.eventsAll': 'Každá událost',
  'developer.ui.webhooks.eventsSelected': 'Pouze mnou vybrané události',
  'developer.ui.webhooks.eventsCount':
    '{count, plural, one {# událost} other {# události} few {# události} many {# události}}',
  'developer.ui.webhooks.eventGroup.connections': 'Připojení',
  'developer.ui.webhooks.eventGroup.content': 'Obsah a schválení',
  'developer.ui.webhooks.eventGroup.publishing': 'Publikování',
  'developer.ui.webhooks.eventGroup.automation': 'Automatizace a zdroje',
  'developer.ui.webhooks.eventGroup.workspace': 'Pracovní prostor',
  'developer.ui.webhooks.scopeTitle': 'Značky a účty',
  'developer.ui.webhooks.scopeAll': 'Každá značka a účet',
  'developer.ui.webhooks.scopeSelected': 'Pouze ty, které vyberu',
  'developer.ui.webhooks.secretTitle': 'Tajný podpis',
  'developer.ui.webhooks.secretBody':
    'Před analýzou těla ověřte záhlaví podpisu. Deduplikujte ID doručení, které je stabilní při opakování.',
  'developer.ui.webhooks.secretRotateTitle': 'Otočte tajemství podpisu',
  'developer.ui.webhooks.secretRotateConsequence.overlap':
    'Oba tajné informace jsou přijímány po dobu 24 hodin, takže je můžete nasadit bez přerušení dodávky.',
  'developer.ui.webhooks.secretRotateConsequence.after':
    'Po tomto okně se použije pouze nový tajný klíč.',
  'developer.ui.webhooks.testDeliveryHelp':
    'Odešle jednu podepsanou ukázkovou událost označenou jako test, takže ji váš přijímač může bezpečně ignorovat.',
  'developer.ui.webhooks.testDeliverySent':
    'Zkušební zásilka odeslána. Výsledek se objeví v protokolu níže.',
  'developer.ui.webhooks.deliveriesCaption':
    'Poslední dodávky a odpověď, kterou každá z nich obdržela',
  'developer.ui.webhooks.deliveryColumn.time': 'Požadováno',
  'developer.ui.webhooks.deliveryColumn.event': 'Událost',
  'developer.ui.webhooks.deliveryColumn.attempt': 'Pokus',
  'developer.ui.webhooks.deliveryColumn.response': 'Odpověď',
  'developer.ui.webhooks.deliveryColumn.status': 'Stav',
  'developer.ui.webhooks.deliveryStatus.pending': 'Čekání',
  'developer.ui.webhooks.deliveryStatus.succeeded': 'Doručeno',
  'developer.ui.webhooks.deliveryStatus.failed': 'Selhalo, zkusím to znovu',
  'developer.ui.webhooks.deliveryStatus.exhausted': 'Selhalo, žádné další pokusy',
  'developer.ui.webhooks.deliveryStatus.disabled': 'Neodesláno, koncový bod deaktivován',
  'developer.ui.webhooks.deliveryNoResponse': 'Nepřišla žádná odpověď',
  'developer.ui.webhooks.deliveryNextAttempt': 'Další pokus {relativeTime}',
  'developer.ui.webhooks.inspect': 'Kontrola dodávky',
  'developer.ui.webhooks.inspectTitle': 'Doručení {id}',
  'developer.ui.webhooks.inspectRequest': 'Tělo požadavku',
  'developer.ui.webhooks.inspectResponse': 'Tělo odpovědi',
  'developer.ui.webhooks.redeliver': 'Odeslat tuto zásilku znovu',
  'developer.ui.webhooks.redeliverHelp':
    'Stejné ID události je odesláno znovu s nastaveným příznakem opětovného doručení, takže idempotentní příjemce jej bezpečně ignoruje.',
  'developer.ui.webhooks.redelivered': 'Ve frontě na opětovné doručení.',
  'developer.ui.webhooks.failureTitle': 'Tento koncový bod selhává',
  'developer.ui.webhooks.failureBody':
    '{count, plural, one {# dodávka v řadě selhala} other {# dodávky za sebou se nezdařily} few {# dodávky za sebou se nezdařily} many {# dodávky za sebou se nezdařily}}. Po {limit} po sobě jdoucích selhání koncový bod je deaktivován a je zadán úkol.',
  'developer.ui.webhooks.disabledTitle':
    'Tento koncový bod byl deaktivován po opakovaných selháních',
  'developer.ui.webhooks.disabledBody':
    'Přestali jsme do něj odesílat, takže se vaše fronta nezaplní. Opravte přijímač, odešlete zkušební doručení a poté jej znovu povolte.',
  'developer.ui.webhooks.lastSuccessLabel': 'Poslední úspěch',
  'developer.ui.webhooks.lastSuccessNever': 'Žádné doručení nebylo nikdy úspěšné',
  'developer.ui.webhooks.deleteTitle': 'Smazat tento koncový bod',
  'developer.ui.webhooks.deleteConsequence.stop': 'Na tuto adresu URL se již nic neposílá.',
  'developer.ui.webhooks.deleteConsequence.logs':
    'Protokoly o doručení jsou uchovávány po dobu uchování auditu.',

  /* ----------------------------------------------------------------- billing */

  'billing.ui.description':
    'Jeden plán, dva intervaly. Polar je rekordním obchodníkem: drží platební metodu, vystavuje faktury a řeší zrušení.',
  'billing.ui.statusHeading': 'Aktuální stav',
  'billing.ui.planHeading': 'Plán',
  'billing.ui.intervalHeading': 'Fakturační interval',
  'billing.ui.usageHeading': 'Měřené využití poskytovatele',
  'billing.ui.invoicesHeading': 'Faktury',
  'billing.ui.cancelHeading': 'Zrušení',
  'billing.ui.trialDaysRemaining':
    'Zkušební verze, {count, plural, =0 {končí dnes} one {# zbývající den} other {# zbývající dny} few {# zbývající dny} many {# zbývající dny}}',
  'billing.ui.convertsOn': 'Konvertuje na {date} až {amount} za {interval}.',
  'billing.ui.dueToday': '0 $ splatných dnes',
  'billing.ui.conversionLabel': 'Konvertuje',
  'billing.ui.channelsLabel': 'Aktivní kanály',
  'billing.ui.paymentMethodPolar': 'Platební metoda držená společností Polar',
  'billing.ui.paymentMethodDescriptor': '{project} končící {last4}, platnost vyprší {expiry}',
  'billing.ui.paymentMethodMissing': 'Zatím není zapsána žádná platební metoda',
  'billing.ui.cancelBeforeDate': 'Zrušit do {date} a nebudou vám účtovány žádné poplatky.',
  'billing.ui.annualFraming': '25 $ měsíčně účtováno ročně. Ušetřete 48 $ ročně.',
  'billing.ui.monthlyOption': '29 $ měsíčně',
  'billing.ui.annualOption': '300 $ ročně',
  'billing.ui.intervalChangeHelp':
    'Změna intervalu se projeví při příštím obnovení. Polar to rozděluje a ukazuje přesnou částku, než to potvrdíte.',
  'billing.ui.intervalChangedAnnouncement': 'Fakturační interval nastaven na {interval}.',
  'billing.ui.allowanceChannels':
    '30 aktivních sociálních kanálů. Kanál je jeden propojený účet, stránka nebo kanál.',
  'billing.ui.allowanceChannelsUsage': '{used} z {limit} aktivní kanály',
  'billing.ui.allowanceFairUse':
    'Spravedlivé použití znamená kontrolu proti spamu, sazbě a nákladům poskytovatele. Platí stejným způsobem pro každého předplatitele a jsou zveřejněny, nikoli podle vlastního uvážení.',
  'billing.ui.allowanceMetered':
    'X a někteří další poskytovatelé účtují za operaci. Tyto poplatky jsou účtovány v ceně a nejsou součástí ceny plánu.',
  'billing.ui.allowanceNoMedia':
    'Vytváření obrázků a videí není součástí dodávky a neprodává se. Relé negeneruje média.',
  'billing.ui.readFairUse': 'Přečtěte si zásady fair use',
  'billing.ui.readMeteredPolicy': 'Přečtěte si, jak se účtuje měřená spotřeba',
  'billing.ui.usageCaption': 'Měřené využití poskytovatele v tomto období, účtováno v ceně',
  'billing.ui.usageColumn.item': 'Položka',
  'billing.ui.usageColumn.quantity': 'Množství',
  'billing.ui.usageColumn.unitPrice': 'Jednotková cena',
  'billing.ui.usageColumn.amount': 'Částka',
  'billing.ui.usageTotal': 'Celkem za toto období',
  'billing.ui.usagePeriod': 'Období {start} až {end}',
  'billing.ui.usageSource': 'Ceny zveřejněné poskytovatelem. Ověřeno {date}.',
  'billing.ui.usageReconciled': 'Odsouhlaseno s fakturou poskytovatele dne {date}.',
  'billing.ui.usagePending': 'Zatím nebylo odsouhlaseno. Konečná částka se může mírně posunout.',
  'billing.ui.usageUnavailableReason':
    'Poskytovatel zatím využití za toto období nevrátil. Obvykle je k dispozici do 24 hodin.',
  'billing.ui.usageEmpty': 'Žádné měřené využití v tomto období.',
  'billing.ui.spendAlert': 'Upozornění na útratu',
  'billing.ui.spendAlertHelp':
    'Když měřené využití překročí tuto částku ve fakturačním období, zašleme vám e-mail.',
  'billing.ui.spendAlertPause': 'Při dosažení výstrahy také pozastavit měřené akce',
  'billing.ui.balanceLabel': 'Zůstatek využití',
  'billing.ui.balanceHelp':
    'Naměřená spotřeba je čerpána z tohoto zůstatku a fakturována společností Polar.',
  'billing.ui.invoicesCaption': 'Faktury vystavené společností Polar',
  'billing.ui.invoiceColumn.date': 'Datum',
  'billing.ui.invoiceColumn.description': 'Popis',
  'billing.ui.invoiceColumn.amount': 'Částka',
  'billing.ui.invoiceColumn.state': 'Stav',
  'billing.ui.invoiceState.paid': 'Zaplaceno',
  'billing.ui.invoiceState.open': 'Otevřeno',
  'billing.ui.invoiceState.uncollectible': 'Nevyzvednuto',
  'billing.ui.invoiceState.refunded': 'Vráceno',
  'billing.ui.invoicesEmpty': 'Zatím žádná faktura. První se vydá, když se zkušební verze převede.',
  'billing.ui.invoicesInPortal': 'Každá faktura a účtenka jsou k dispozici na portálu Polar.',
  'billing.ui.portalHelp':
    'Na portálu můžete měnit způsob platby, stahovat faktury a rušit. Otevře se na nové kartě.',
  'billing.ui.pastDueHeading': 'Platba po splatnosti',
  'billing.ui.pastDueBody':
    'Poslední platba neprošla. Aktualizujte platební metodu na portálu Polar, abyste mohli nadále publikovat.',
  'billing.ui.gracePolicy':
    'Naplánované příspěvky běží do {date}. Poté se pracovní prostor stane pouze pro čtení: nic se nesmaže a nic se nepublikuje.',
  'billing.ui.cancelBody':
    'Zrušení je jedna akce a vstoupí v platnost na konci období, za které jste zaplatili. Není třeba zavolat ani vyplnit formulář.',
  'billing.ui.cancelStart': 'Zrušit předplatné',
  'billing.ui.cancelDialogTitle': 'Zrušit toto předplatné',
  'billing.ui.cancelConsequence.noCharge':
    'Nebudou vám účtovány žádné poplatky. Dnes ani na {date}.',
  'billing.ui.cancelConsequence.accessUntil': 'Ponecháte si každou funkci do {date}.',
  'billing.ui.cancelConsequence.dataKept':
    'Koncepty, účtenky, média a analýzy zůstávají v tomto pracovním prostoru.',
  'billing.ui.cancelConsequence.scheduled':
    'Příspěvky naplánované po {date} nebude publikováno. Do té doby je zrušte nebo přeplánujte.',
  'billing.ui.cancelConsequence.restart': 'Předplatné můžete kdykoli znovu zahájit.',
  'billing.ui.cancelConfirm': 'Zrušit předplatné',
  'billing.ui.cancelKeep': 'Zachovat předplatné',
  'billing.ui.cancelConfirmedBeforeConversion': 'Zrušeno. Nebude vám nic účtováno.',
  'billing.ui.cancelConfirmedAfterConversion': 'Zrušeno. Přístup pokračuje do {date}.',
  'billing.ui.cancelAnnouncement': 'Předplatné zrušeno.',
  'billing.ui.canceledNotice': 'Toto předplatné je zrušeno.',
  'billing.ui.resume': 'Začněte předplatné znovu',
  'billing.ui.noSubscriptionTitle': 'Žádné předplatné v tomto pracovním prostoru',
  'billing.ui.noSubscriptionBody':
    'Zahajte sedmidenní zkušební verzi pro publikování. Polar vybírá platební metodu a dnes si nic neúčtuje.',
  'billing.ui.noSubscriptionExample':
    'Měsíčně 29 $. Roční je 300 USD, což je 25 USD měsíčně účtováno ročně. Ušetřete 48 $ ročně.',
  'billing.ui.overChannelLimitAction': 'Zkontrolujte připojené kanály',

  /* ---------------------------------------------------------- growth advisor */

  'growth.ui.entryHelp':
    'Odpovězte na krátký příspěvek, potvrďte, co jsme pochopili, a získejte plán, který můžete přijmout položku po položce. Navrhuje práci. Nikdy nic neplánuje ani nepublikuje sám o sobě.',
  'growth.ui.step.intake': 'Příjem',
  'growth.ui.step.confirm': 'Potvrdit',
  'growth.ui.step.plan': 'Plán',
  'growth.ui.stepIndicator': 'Krok {current} z {total}: {name}',
  'growth.ui.intake.section.product': 'Produkt',
  'growth.ui.intake.section.audience': 'Publikum a trhy',
  'growth.ui.intake.section.objective': 'Cíl',
  'growth.ui.intake.section.capacity': 'Kanály a kapacita',
  'growth.ui.intake.section.limits': 'Co je mimo limity',
  'growth.ui.intake.help':
    'Nic se vám tu nehádá. Vše, co necháte prázdné, je označeno jako chybějící, nikoli vyplněné.',
  'growth.ui.intake.productNameHelp': 'Jméno, které používáte u zákazníků.',
  'growth.ui.intake.siteUrlHelp':
    'Čteme stránku, kterou nám poskytujete jako zdrojový materiál. Potvrzujete každou skutečnost, kterou si z toho vezmeme.',
  'growth.ui.intake.descriptionHelp': 'Co prodáváte a pro koho to je, podle vašich vlastních slov.',
  'growth.ui.intake.marketsHelp': 'Země nebo oblasti. Jeden na řádek.',
  'growth.ui.intake.localesHelp': 'Jazyky, ve kterých budete publikovat.',
  'growth.ui.intake.objectiveHelp': 'Co chcete více v příštím čtvrtletí.',
  'growth.ui.intake.conversionHelp': 'Akce, kterou můžete skutečně měřit. Registrace, demo, nákup.',
  'growth.ui.intake.proofHelp':
    'Případové studie, srovnávací testy, které jste spustili, snímky obrazovky, které vlastníte, oprávnění, která již máte. Jeden na řádek.',
  'growth.ui.intake.proofNone': 'Zatím nemám žádný schválený důkaz',
  'growth.ui.intake.proofNoneEffect':
    'Plán zcela zabrání výsledkům zákazníků a reklamacím výsledků.',
  'growth.ui.intake.channelsHelp': 'Účty, ze kterých již publikujete.',
  'growth.ui.intake.capacityHelp': 'Buďte upřímní. Plán, který nemůžete spustit, není plán.',
  'growth.ui.intake.competitorsHelp': 'Volitelné. Jeden na řádek.',
  'growth.ui.intake.prohibitedClaimsHelp':
    'Nároky, které nemůžete vznést z právních nebo politických důvodů. Jeden na řádek.',
  'growth.ui.intake.prohibitedTopicsHelp': 'Témata, od kterých se držet dál. Jeden na řádek.',
  'growth.ui.intake.submit': 'Zkontrolujte, co jsme pochopili',
  'growth.ui.intake.savedAnnouncement': 'Firemní profil byl uložen.',
  'growth.ui.intake.requiredMissing': 'Než budete pokračovat, vyplňte pole označená jako povinná.',

  'growth.ui.confirm.factsTitle': 'Fakta, která jste potvrdil',
  'growth.ui.confirm.factsHelp': 'Tyto lze použít v kopii.',
  'growth.ui.confirm.assumptionsTitle': 'Předpoklady, které jsme učinili',
  'growth.ui.confirm.assumptionsHelp':
    'Toto nejsou fakta. Formují plán, ale nikdy se nestanou nárokem v příspěvku.',
  'growth.ui.confirm.missingTitle': 'Chybí',
  'growth.ui.confirm.missingHelp': 'Plán se týká každého z nich a říká to tam, kde na tom záleží.',
  'growth.ui.confirm.confidence.label': 'Důvěra: {level}',
  'growth.ui.confirm.confidence.low': 'nízká',
  'growth.ui.confirm.confidence.medium': 'střední',
  'growth.ui.confirm.confidence.high': 'vysoké',
  'growth.ui.confirm.promote': 'Potvrdit jako fakt',
  'growth.ui.confirm.correct': 'Opravit',
  'growth.ui.confirm.correctLabel': 'Vaše oprava',
  'growth.ui.confirm.generate': 'Vygenerujte plán',
  'growth.ui.confirm.announcement': 'Obchodní profil potvrzen.',

  'growth.ui.plan.generatingBody':
    'To trvá několik sekund. Tuto stránku můžete opustit: plán se dokončí sám.',
  'growth.ui.plan.stateDraft': 'Koncept, neschváleno',
  'growth.ui.plan.stateApproved': 'Schváleno',
  'growth.ui.plan.stateSuperseded': 'Nahrazeno novější verzí',
  'growth.ui.plan.newVersionNotice':
    'Obnovení vytvoří verzi {version} a ponechává schválenou verzi nedotčenou.',
  'growth.ui.plan.emptyTitle': 'Zatím žádný plán',
  'growth.ui.plan.emptyBody':
    'Vyplňte obchodní profil a my sestavíme plán z faktů, které potvrdíte.',
  'growth.ui.plan.emptyExample':
    'Plán obsahuje strategii, čtyři týdny briefů, jednu kampaň UGC, příležitosti podporované katalogem a až pět nástrojů.',
  'growth.ui.plan.tabsLabel': 'Sekce plánu',
  'growth.ui.plan.modelNote': 'Vygenerováno {model}, výzva {promptVersion}, dne {date}.',

  'growth.ui.strategy.snapshotTitle': 'Snímek firmy',
  'growth.ui.strategy.channelPriority': 'Priorita {rank}',
  'growth.ui.strategy.channelFormats': 'Nativní formáty',
  'growth.ui.strategy.pillarProof': 'Důkaz, o který se tento sloup opírá',
  'growth.ui.strategy.pillarProofNone': 'Žádný schválený důkaz. Udržujte tento pilíř popisný.',
  'growth.ui.strategy.cadenceCaption': 'Příspěvky za týden podle kanálu',
  'growth.ui.strategy.cadenceColumn.channel': 'Kanál',
  'growth.ui.strategy.cadenceColumn.perWeek': 'Příspěvky za týden',
  'growth.ui.strategy.cadenceTotal': 'Celkem za týden',
  'growth.ui.strategy.capacityWarning':
    'Tato kadence je {planned} příspěvky týdně oproti uvedené kapacitě {capacity} hodin. Snižte jej nebo zvyšte kapacitu v profilu.',
  'growth.ui.strategy.measurementBody':
    'Ve srovnání s vašimi vlastními koncovými příspěvky na stejném kanálu a formátu. Nepoužívá se žádný externí benchmark, protože žádný není srovnatelný s vaším účtem.',
  'growth.ui.strategy.localeAdaptations': 'Jazykové poznámky',

  'growth.ui.fourWeek.caption': 'Navrhované briefy podle týdne a dne',
  'growth.ui.fourWeek.column.date': 'Datum',
  'growth.ui.fourWeek.column.channel': 'Kanál',
  'growth.ui.fourWeek.column.pillar': 'Sloupek',
  'growth.ui.fourWeek.column.format': 'Formát',
  'growth.ui.fourWeek.column.brief': 'Stručně',
  'growth.ui.fourWeek.column.cta': 'Výzva k akci',
  'growth.ui.fourWeek.column.measurement': 'Značka měření',
  'growth.ui.fourWeek.column.actions': 'Akce',
  'growth.ui.fourWeek.approvalRequired': 'Před zveřejněním je vyžadováno schválení',
  'growth.ui.fourWeek.approvalNotRequired': 'Pro tento účet není vyžadováno žádné schválení',
  'growth.ui.fourWeek.noCta': 'Žádná výzva k akci',
  'growth.ui.fourWeek.weekEmpty': 'Na tento týden nejsou navrženy žádné slipy.',
  'growth.ui.fourWeek.acceptedCount': '{accepted} z {total} briefy přijaty jako koncepty',
  'growth.ui.fourWeek.acceptAnnouncement': 'Koncept vytvořený z tohoto briefu.',
  'growth.ui.fourWeek.proposeAnnouncement': 'Přidán návrh kalendáře pro {date}.',

  'growth.ui.ugc.promptAngle': 'Úhel {number}',
  'growth.ui.ugc.checklistTitle': 'Práva, souhlas a zveřejnění',
  'growth.ui.ugc.checklistHelp':
    'Projděte si to s každým účastníkem, než bude cokoli zveřejněno. Souhlas se zobrazováním neznamená souhlas s reklamou.',
  'growth.ui.ugc.incentiveNone': 'Žádná pobídka není nabízena',
  'growth.ui.ugc.incentiveDisclosure':
    'Pobídka musí být zveřejněna u každého příspěvku, který z něj vyplývá, vámi i účastníkem.',
  'growth.ui.ugc.honesty':
    'Toto plánuje kampaň, kterou spustíte se skutečnými lidmi. Relay nenachází tvůrce, nekontaktuje je, nepíše reference ani nevytváří zákaznický obsah.',

  'growth.ui.opportunities.caption':
    'Ověřené příležitosti z katalogu, seřazené podle shody s vaším profilem',
  'growth.ui.opportunities.column.opportunity': 'Příležitost',
  'growth.ui.opportunities.column.type': 'Typ',
  'growth.ui.opportunities.column.audience': 'Publikum',
  'growth.ui.opportunities.column.fit': 'Proč se to hodí',
  'growth.ui.opportunities.column.requirements': 'Požadavky',
  'growth.ui.opportunities.column.rules': 'Pravidla vlastní propagace',
  'growth.ui.opportunities.column.cost': 'Cena',
  'growth.ui.opportunities.column.effort': 'Úsilí',
  'growth.ui.opportunities.column.verified': 'Poslední ověření',
  'growth.ui.opportunities.column.actions': 'Akce',
  'growth.ui.opportunities.costFree': 'Zdarma',
  'growth.ui.opportunities.effort.low': 'Nízká',
  'growth.ui.opportunities.effort.medium': 'Střední',
  'growth.ui.opportunities.effort.high': 'Vysoká',
  'growth.ui.opportunities.noRequiredAsset': 'Není vyžadován žádný podklad',
  'growth.ui.opportunities.prepareTitle': 'Připravte příspěvek pro {name}',
  'growth.ui.opportunities.prepareRules': 'Jejich pravidla, citovaná',
  'growth.ui.opportunities.prepareChecklist': 'Co mít připraveno',
  'growth.ui.opportunities.prepareManual':
    'Toto odešlete sami na jejich webu. Relay nevyplňuje formuláře, nevytváří účty ani nikomu neposílá e-maily.',
  'growth.ui.opportunities.pitchTitle': 'Návrh nabídky',
  'growth.ui.opportunities.pitchHelp':
    'Před odesláním jej upravte. Používá pouze fakta, která jste potvrdili.',
  'growth.ui.opportunities.submittedOn': 'Odesláno {date}',
  'growth.ui.opportunities.staleTitle': 'Některé záznamy vyžadují opětovné ověření',
  'growth.ui.opportunities.staleBody':
    '{count, plural, one {# záznam je po datu kontroly} other {# položky jsou po datu kontroly} few {# položky jsou po datu kontroly} many {# položky jsou po datu kontroly}}. Než se na ně spolehnete, zkontrolujte si aktuální pravidla na webu.',
  'growth.ui.opportunities.emptyExample':
    'Řádek katalogu obsahuje oficiální adresu URL, publikum, pravidla odesílání citovaná z webu, náklady, úsilí a datum, kdy jej osoba naposledy zkontrolovala.',

  'growth.ui.tools.shown': '{shown} z {max} zobrazeno',
  'growth.ui.tools.fewerThanMax':
    'Pouze {count, plural, one {# nástroj odpovídá} other {# nástroje odpovídají} few {# nástroje odpovídají} many {# nástroje odpovídají}} tento pracovní postup s aktuální recenzí. Raději ukážeme méně než vyplníme seznam.',
  'growth.ui.tools.emptyTitle':
    'Tomuto pracovnímu postupu zatím nevyhovuje žádný zkontrolovaný nástroj',
  'growth.ui.tools.emptyBody':
    'Každá položka potřebuje před zobrazením zde zkontrolovanou cenu, zkontrolované podmínky práv a pojmenované omezení.',
  'growth.ui.tools.emptyExample':
    'Záznam říká, k čemu je nejlepší, proč vyhovuje vašemu plánu, co neumí, dovednosti, které potřebuje, jak se výstup vrací do relé a kdy byla naposledy zkontrolována cena.',
  'growth.ui.tools.openSite': 'Otevřete oficiální stránky pro {name}',
  'growth.ui.tools.stale': 'Po datu revize. Vyloučeno z generovaných plánů.',

  'growth.ui.item.explainTitle': 'Proč to bylo navrženo',
  'growth.ui.item.explainEvidence': 'Na čem je založen',
  'growth.ui.item.explainNoEvidence':
    'To vyplynulo z cíle a pravidel kanálu, nikoli z potvrzených faktů o vašem podnikání.',
  'growth.ui.item.dismissTitle': 'Odmítnout tento návrh',
  'growth.ui.item.dismissBody': 'Řekněte nám proč. Důvod je uložen s plánem a tvarem další verze.',
  'growth.ui.item.dismissReasonLabel': 'Důvod',
  'growth.ui.item.dismissReason.notRelevant': 'Netýká se tohoto podnikání',
  'growth.ui.item.dismissReason.noCapacity': 'Nemáme kapacitu',
  'growth.ui.item.dismissReason.wrongAudience': 'Špatné publikum',
  'growth.ui.item.dismissReason.alreadyDone': 'Už to děláme',
  'growth.ui.item.dismissReason.policy': 'Proti našim zásadám nebo nárokům',
  'growth.ui.item.dismissReason.other': 'Něco jiného',
  'growth.ui.item.dismissNote': 'Vše, co chcete přidat',
  'growth.ui.item.dismissed': 'Zamítnuto. Zůstane viditelná, takže ji můžete vrátit zpět.',
  'growth.ui.item.undoDismiss': 'Zrušit zamítnutí',

  'growth.ui.export.title': 'Exportovat tento plán',
  'growth.ui.export.formatLabel': 'Formát',
  'growth.ui.export.copy': 'Kopírovat do schránky',
  'growth.ui.export.download': 'Stáhnout soubor',
  'growth.ui.export.copied': 'Plán zkopírován do schránky.',
  'growth.ui.export.schemaNote':
    'Všechny tři formáty pocházejí z jednoho ověřeného schématu, verze {version}. Strukturované pohledy jsou bezpečné pro ovládání zdroje a neobsahují žádná tajemství.',
  'growth.ui.export.previewLabel': 'Náhled exportu',
} as const;
