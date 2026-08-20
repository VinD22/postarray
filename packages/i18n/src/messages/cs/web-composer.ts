/**
 * Web composer and media library chrome.
 *
 * The domain vocabulary (master draft, overrides, limits, cost, schedule) lives
 * in `composer.ts`. This file holds the strings the web surface adds on top:
 * panes, steps, the summary bar, the picture editor, upload states, rights and
 * provenance. Keys are namespaced `composerWeb.` and `mediaLib.` so they never
 * collide with the shared composer catalog.
 */
export const webComposerMessages = {
  // ---------------------------------------------------------------- shell
  'composerWeb.pane.targets': 'Cílové účty a sady',
  'composerWeb.pane.master': 'Hlavní koncept a sdílená nastavení',
  'composerWeb.pane.variant': 'Verze pro otevřený cíl',
  'composerWeb.pane.review': 'Náhled, ověření, cena a schválení',
  'composerWeb.pane.showPreview': 'Zobrazit náhled',
  'composerWeb.pane.hidePreview': 'Skrýt náhled',
  'composerWeb.pane.previewCollapsed':
    'Panel náhledu je skrytý. Otevřete jej a zkontrolujte poslední příspěvek.',

  'composerWeb.step.targets': 'Cíle',
  'composerWeb.step.write': 'Napište',
  'composerWeb.step.perTarget': 'Na cíl',
  'composerWeb.step.review': 'Recenze',
  'composerWeb.step.progress': 'Krok {current} z {total}',
  'composerWeb.step.legend': 'Kroky skladatele',

  'composerWeb.summary.label': 'Shrnutí konceptu',
  'composerWeb.summary.targets':
    '{count, plural, =0 {Žádné cíle} one {# cíl} other {# cíle} few {# cíle} many {# cíle}}',
  'composerWeb.summary.issues':
    '{count, plural, =0 {Žádné problémy} one {# problém} other {# problémy} few {# problémy} many {# problémy}}',
  'composerWeb.summary.notScheduled': 'Není vybrán žádný čas',
  'composerWeb.summary.scheduledFor': '{time}',
  'composerWeb.summary.costUnknown': 'Cena zatím není stanovena',
  'composerWeb.summary.openReview': 'Otevřít recenzi',

  // ---------------------------------------------------------------- rail
  'composerWeb.rail.masterEntry': 'Hlavní návrh',
  'composerWeb.rail.masterHint': 'Zde upravte, abyste dosáhli každého cíle, který stále dědí.',
  'composerWeb.rail.accountsHeading': 'Cílové účty',
  'composerWeb.rail.setsHeading': 'Sady a skupiny',
  'composerWeb.rail.setsHelp':
    'Sada je uložená skupina účtů a výchozích hodnot. Použitím jednoho zkopírujete jeho hodnoty do tohoto konceptu. Pozdější úpravy sady tento koncept nemění.',
  'composerWeb.rail.openTarget': 'Otevřít verzi pro {account}',
  'composerWeb.rail.counter': '{used}/{limit}',
  'composerWeb.rail.counterUnknown': 'Neznámý limit',
  'composerWeb.rail.mediaCounter':
    '{count, plural, =0 {žádná média} one {# mediální soubor} other {# mediální soubory} few {# mediální soubory} many {# mediální soubory}}',
  'composerWeb.rail.paused': 'Pozastaveno. Nebude publikován, dokud v něm neobnovíte.',
  'composerWeb.rail.state.notBuilt': 'Zatím nepostaveno',
  'composerWeb.rail.state.unsupported': 'Poskytovatel nepodporuje',
  'composerWeb.rail.empty': 'Zatím nejsou vybrány žádné účty.',
  'composerWeb.rail.emptyHelp':
    'Vyberte účty, do kterých by se měl tento příspěvek dostat. Později můžete přidat další.',
  'composerWeb.rail.divergenceHint':
    'Otevřete cíl, abyste viděli jeho vlastní verzi. Hlavní koncept se nezměnil.',
  'composerWeb.rail.searchLabel': 'Filtrovat účty',
  'composerWeb.rail.removeTarget': 'Odebrat {account}',

  // ---------------------------------------------------------- global edit
  'composerWeb.globalEdit.open': 'Globální úprava',
  'composerWeb.globalEdit.title': 'Použít tuto změnu na každý vybraný cíl',
  'composerWeb.globalEdit.description':
    'Hlavní koncept se vždy mění. Cíle, které toto pole stále zdědí, ho následují. Cíle s vlastní verzí si ji ponechávají.',
  'composerWeb.globalEdit.fieldLabel': 'Pole',
  'composerWeb.globalEdit.compatibleHeading': 'Tyto cíle se mění',
  'composerWeb.globalEdit.keepsOverrideHeading': 'Tyto cíle si ponechávají svou vlastní verzi',
  'composerWeb.globalEdit.incompatibleHeading': 'Tyto cíle nemohou přijmout změnu',
  'composerWeb.globalEdit.incompatibleHelp':
    'Nic nezmizí, aniž bychom vám to řekli. Každý účet níže dostane explicitní verzi s upravenou změnou a můžete ji poté upravit.',
  'composerWeb.globalEdit.reason.textTooLong':
    '{account} umožňuje {limit} znaků. Tento text je {actual}.',
  'composerWeb.globalEdit.reason.linkNotAllowed':
    '{account} nepřijímá odkaz v tomto poli. Odkaz zůstává v hlavním konceptu a v cílech, které to umožňují.',
  'composerWeb.globalEdit.reason.mediaCountExceeded':
    '{account} přijímá {limit, plural, one {# soubor} other {# soubory} few {# soubory} many {# soubory}}. Tento koncept má {actual}.',
  'composerWeb.globalEdit.reason.mediaKindUnsupported': '{account} nepřijímá {mimeType} soubory.',
  'composerWeb.globalEdit.reason.threadUnsupported':
    '{account} nepodporuje následné položky, takže sekvence zůstává na hlavním konceptu.',
  'composerWeb.globalEdit.reason.markdownUnsupported':
    '{account} publikuje prostý text. Formátovací značky se zobrazí jako znaky.',
  'composerWeb.globalEdit.adaptedPreview': 'Co {account} místo toho získá',
  'composerWeb.globalEdit.confirm': 'Použijte a vytvořte verze',
  'composerWeb.globalEdit.nothingToApply': 'Nic se nemění. Hlavní koncept již tuto hodnotu má.',
  'composerWeb.globalEdit.announced':
    '{applied, plural, one {Změna byla použita na # cíl} other {Změna byla použita na # cíle} few {Změna byla použita na # cíle} many {Změna byla použita na # cíle}}. {adapted, plural, =0 {Upravená verze nepotřebuje žádný cíl} one {# cíl dostal upravenou verzi} other {# cíle získaly upravené verze} few {# cíle získaly upravené verze} many {# cíle získaly upravené verze}}.',

  // ------------------------------------------------------------- override
  'composerWeb.override.heading': 'Tento cíl má svou vlastní verzi',
  'composerWeb.override.fieldsChanged':
    '{count, plural, one {# pole se liší od hlavního konceptu} other {# pole se liší od hlavního konceptu} few {# pole se liší od hlavního konceptu} many {# pole se liší od hlavního konceptu}}',
  'composerWeb.override.field.body': 'Text příspěvku',
  'composerWeb.override.field.contentKind': 'Typ příspěvku',
  'composerWeb.override.field.locale': 'Jazyk obsahu',
  'composerWeb.override.field.mediaIds': 'Média',
  'composerWeb.override.field.links': 'Odkazy',
  'composerWeb.override.field.signature': 'Podpis',
  'composerWeb.override.field.threadItems': 'Komentáře a vlákno',
  'composerWeb.override.field.schedule': 'Rozvrh',
  'composerWeb.override.resetField': 'Resetovat {field} zvládnout',
  'composerWeb.override.resetFieldTitle': 'Resetovat {field} pro {account}?',
  'composerWeb.override.resetFieldBody':
    'Verze {field} napsáno pro {account} se zahodí a znovu se použije hlavní koncept. Žádné další změny cíle.',
  'composerWeb.override.resetAll': 'Obnovit všechna pole na hlavní',
  'composerWeb.override.inheritNotice':
    'Tento cíl se řídí hlavním konceptem. Úpravou čehokoli zde vytvoříte pouze verzi {account} přijímá.',
  'composerWeb.override.created': '{account} má nyní vlastní {field}.',

  // --------------------------------------------------------------- limits
  'composerWeb.limits.heading': 'Limity pro {account}',
  'composerWeb.limits.text': 'Text do {limit} znaků',
  'composerWeb.limits.linkCost':
    'Odkaz se počítá jako {count, plural, one {# znak} other {# znaků} few {# znaků} many {# znaků}} bez ohledu na jeho délku.',
  'composerWeb.limits.images':
    '{count, plural, =0 {Žádné obrázky} one {# obrázek} other {až # obrázky} few {až # obrázky} many {až # obrázky}}',
  'composerWeb.limits.videos':
    '{count, plural, =0 {Žádné video} one {# video} other {až # videa} few {až # videa} many {až # videa}}',
  'composerWeb.limits.duration': 'Video až {duration}',
  'composerWeb.limits.aspect': 'Poměr stran mezi {min} a {max}',
  'composerWeb.limits.fileSize': 'Soubory až do {size}',
  'composerWeb.limits.mimeTypes': 'Přijímané typy souborů: {types}',
  'composerWeb.limits.source': 'Ze snímku schopností {version}, přečtěte si {relativeTime}.',
  'composerWeb.limits.thumbnailRequired': 'Je vyžadována miniatura.',

  // --------------------------------------------------------- native fields
  'composerWeb.native.heading': '{provider} nastavení',
  'composerWeb.native.privacy': 'Kdo to může vidět',
  'composerWeb.native.privacyChoose': 'Vyberte publikum',
  'composerWeb.native.privacyExplicit':
    '{provider} nepovoluje předem vybrané publikum. Než to bude možné naplánovat, vyberte jeden.',
  'composerWeb.native.community': 'Komunita',
  'composerWeb.native.board': 'Deska',
  'composerWeb.native.group': 'Skupina nebo stránka',
  'composerWeb.native.organization': 'Organizace',
  'composerWeb.native.channel': 'Kanál',
  'composerWeb.native.publication': 'Publikace',
  'composerWeb.native.disclosureHeading': 'Zveřejnění',
  'composerWeb.native.disclosureCommercial': 'Tento příspěvek propaguje produkt nebo službu',
  'composerWeb.native.disclosureBranded': 'Tento příspěvek je značkovým obsahem jiné společnosti',
  'composerWeb.native.disclosureAi': 'Část tohoto obsahu byla vytvořena pomocí nástroje AI',
  'composerWeb.native.disclosureUnsupported':
    '{provider} nenabízí toto zveřejnění prostřednictvím svého API. Místo toho jej přidejte do textu.',
  'composerWeb.native.none': 'Ne {provider} platí pro tento typ příspěvku.',

  // ---------------------------------------------------- entity resolution
  'composerWeb.entity.resolvedHeading': 'Vyřešeno dne {provider}',
  'composerWeb.entity.resolvedId': 'ID účtu {externalId}',
  'composerWeb.entity.plainTextWarning':
    'Neodpovídá. Publikuje se jako prostý text, což není nativní značka na {provider}.',
  'composerWeb.entity.removeMention': 'Odstranit zmínku o {label}',
  'composerWeb.entity.addMention': 'Přidat zmínku',
  'composerWeb.entity.mentionCount':
    '{count, plural, =0 {Žádné zmínky} one {# zmínka} other {# zmiňuje} few {# zmiňuje} many {# zmiňuje}}, {resolved} přiřazeno skutečnému účtu',
  'composerWeb.entity.lookupUnsupported':
    '{provider} nenabízí vyhledávání entity pro tento typ účtu.',
  'composerWeb.entity.lookupNotBuilt':
    'Relé nevytvořilo vyhledávání entity pro {provider} zatím. Mezitím se nic neuhádne.',
  'composerWeb.entity.searchHint': 'Zadejte alespoň dva znaky a poté vyberte výsledek.',
  'composerWeb.entity.resultCount':
    '{count, plural, =0 {Žádné shody} one {# shoda} other {# odpovídá} few {# odpovídá} many {# odpovídá}}',

  // ---------------------------------------------------------------- links
  'composerWeb.links.heading': 'Odkazy',
  'composerWeb.links.detected':
    '{count, plural, one {# odkaz nalezený v tomto konceptu} other {# odkazy nalezené v tomto konceptu} few {# odkazy nalezené v tomto konceptu} many {# odkazy nalezené v tomto konceptu}}',
  'composerWeb.links.noneDetected': 'V tomto konceptu zatím nejsou žádné odkazy.',
  'composerWeb.links.modeLabel': 'Jak se tento odkaz publikuje',
  'composerWeb.links.original': 'Původní adresa URL',
  'composerWeb.links.utmSource': 'Zdroj',
  'composerWeb.links.utmMedium': 'Střední',
  'composerWeb.links.utmCampaign': 'Kampaň',
  'composerWeb.links.utmTerm': 'Termín',
  'composerWeb.links.utmContent': 'Obsah',
  'composerWeb.links.domainVerified': '{domain}, ověřeno pro tento pracovní prostor',
  'composerWeb.links.domainDefault': 'Výchozí doména relé',
  'composerWeb.links.domainNone': 'Zatím není ověřena žádná značková doména.',
  'composerWeb.links.notAllowedHere': '{account} zde nepovoluje odkaz.',

  // ------------------------------------------------------------- sequence
  'composerWeb.sequence.kindComment': 'Komentář',
  'composerWeb.sequence.kindThread': 'Část závitu',
  'composerWeb.sequence.kindLabel': 'Typ položky',
  'composerWeb.sequence.moveUp': 'Přesunout tuto položku dříve',
  'composerWeb.sequence.moveDown': 'Přesunout tuto položku později',
  'composerWeb.sequence.remove': 'Odebrat tuto položku',
  'composerWeb.sequence.absoluteTime': 'Běží na {time}, což je {utc} UTC.',
  'composerWeb.sequence.partialFailure':
    'Pokud položka selže, již publikovaný příspěvek zůstane publikován a položky po něm se nespustí. Získáte akční předmět.',
  'composerWeb.sequence.maxReached':
    '{account} přijímá {limit, plural, one {# následná položka} other {# následné položky} few {# následné položky} many {# následné položky}}.',
  'composerWeb.sequence.minDelay': 'Nejkratší zpoždění {provider} umožňuje zde je {duration}.',
  'composerWeb.sequence.inheritAuthor': 'Stejný účet jako příspěvek',
  'composerWeb.sequence.itemIssues':
    '{count, plural, =0 {Žádné problémy} one {# problém} other {# problémy} few {# problémy} many {# problémy}} u této položky',
  'composerWeb.sequence.customMinutes': 'minut po předchozí položce',

  // --------------------------------------------------------------- repeat
  'composerWeb.repeat.enable': 'Opakujte tento příspěvek',
  'composerWeb.repeat.cadenceLabel': 'Jak často',
  'composerWeb.repeat.maximum': 'Opakující se příspěvek může běžet maximálně {limit} krát.',
  'composerWeb.repeat.occurrenceLabel': 'Počet příspěvků',
  'composerWeb.repeat.duplicateCheck':
    'Každý výskyt je před publikováním zkontrolován na duplicitní obsah. Výskyt, který neprojde kontrolou, se místo publikování stane akčním bodem.',
  'composerWeb.repeat.occurrenceList': 'První výskyty',
  'composerWeb.repeat.occurrenceMore':
    '{count, plural, one { a # další výskyt} other { a # další výskyty} few { a # další výskyty} many { a # další výskyty}}',

  // ------------------------------------------------------ sets, signature
  'composerWeb.set.heading': 'Sady a podpis',
  'composerWeb.set.pickerTitle': 'Začněte ze sady',
  'composerWeb.set.pickerDescription':
    'Sada vyplní cíle, text a nastavení. Koncept, který vytvoří, je nezávislý, takže pozdější úprava sady nikdy nezmění schválený nebo naplánovaný příspěvek.',
  'composerWeb.set.accountCount':
    '{count, plural, one {# účet} other {# účty} few {# účty} many {# účty}}',
  'composerWeb.set.apply': 'Použít tuto sadu',
  'composerWeb.set.none': 'Zatím nejsou uloženy žádné sady.',
  'composerWeb.signature.pickerLabel': 'Podpis',
  'composerWeb.signature.scope': 'Pro {project} na {provider} v {language}',
  'composerWeb.signature.previewHeading': 'Jak končí příspěvek',
  'composerWeb.signature.notMatching':
    'Tento podpis se vztahuje na jinou značku, platformu nebo jazyk, takže zde není nabízen.',

  // --------------------------------------------------------------- assist
  'composerWeb.assist.menuLabel': 'Pomozte s tímto textem',
  'composerWeb.assist.unavailableTitle': 'Textová asistence není nakonfigurována',
  'composerWeb.assist.unavailableBody':
    'Pro tento pracovní prostor není nastavena žádná brána AI, takže asistenční akce jsou vypnuté. Vše ostatní ve skladateli funguje normálně.',
  'composerWeb.assist.targetLabel': 'Platí pro',
  'composerWeb.assist.targetMaster': 'Hlavní návrh',
  'composerWeb.assist.targetVariant': 'Verze pro {account}',
  'composerWeb.assist.beforeLabel': 'Aktuální text',
  'composerWeb.assist.afterLabel': 'Navržený text',
  'composerWeb.assist.regionLabel': 'Navrhovaná změna textu, dosud neuplatněna',
  'composerWeb.assist.added': 'přidáno',
  'composerWeb.assist.removed': 'odebráno',
  'composerWeb.assist.evidence': 'Důkazy a zdroje',
  'composerWeb.assist.claimChecked': '{claim}',
  'composerWeb.assist.claimUnverified':
    'Pro toto tvrzení nebyl nalezen žádný zdroj. Před publikováním to zkontrolujte.',
  'composerWeb.assist.failed': 'Požadavek na asistenci nebyl dokončen. Váš text se nezměnil.',
  'composerWeb.assist.noMediaGeneration':
    'Relé nevytváří obrázky ani video. Přeneste hotové soubory do knihovny a publikujte je zde.',

  // ------------------------------------------------------------- autosave
  'composerWeb.autosave.pinned':
    'Toto je schválená verze. Jeho úpravou vytvoříte novou verzi a vymažete schválení.',
  'composerWeb.autosave.pinnedAcknowledge': 'Upravit a vymazat schválení',
  'composerWeb.autosave.conflictTitle': 'Dvě verze tohoto konceptu',
  'composerWeb.autosave.conflictKeepMine': 'Zachovejte, co jsem napsal',
  'composerWeb.autosave.conflictKeepTheirs': 'Použijte verzi z {name}',
  'composerWeb.autosave.conflictHelp':
    'Nic se automaticky nesloučí. Vyberte podle pole a poté uložte.',
  'composerWeb.autosave.retry': 'Zkuste uložit znovu',

  // ------------------------------------------------------------ shortcuts
  'composerWeb.shortcuts.title': 'Zkratky pro skladatele',
  'composerWeb.shortcuts.nextTarget': 'Další cíl',
  'composerWeb.shortcuts.previousTarget': 'Předchozí cíl',
  'composerWeb.shortcuts.nextIssue': 'Další vydání',
  'composerWeb.shortcuts.previousIssue': 'Předchozí vydání',
  'composerWeb.shortcuts.save': 'Uložit koncept nyní',
  'composerWeb.shortcuts.openSchedule': 'Otevřete rozvrhový list',
  'composerWeb.shortcuts.open': 'Zobrazit zkratky',

  // --------------------------------------------------------------- review
  'composerWeb.review.heading': 'Recenze',
  'composerWeb.review.contentVersion': 'Verze obsahu {checksum}',
  'composerWeb.review.approvalPolicy': 'Zásady: {policy}',
  'composerWeb.review.approverPending': 'Čekání na rozhodnutí od {approver}.',
  'composerWeb.review.approverNone': 'Pro tyto cíle není vyžadován žádný souhlas.',
  'composerWeb.review.perTargetHeading': 'Co obdrží každý účet',
  'composerWeb.review.finalUrl': 'Zveřejněný odkaz',
  'composerWeb.review.privacyState': 'Publikum: {value}',
  'composerWeb.review.disclosureState': 'Zveřejnění: {value}',
  'composerWeb.review.disclosureNone': 'Není nastaveno žádné zveřejnění',
  'composerWeb.review.mediaVersion': '{name}, verze {version}',
  'composerWeb.review.blocked':
    '{count, plural, one {# cíl zatím nelze naplánovat} other {# cíle zatím nelze naplánovat} few {# cíle zatím nelze naplánovat} many {# cíle zatím nelze naplánovat}}',
  'composerWeb.review.offlineBlocked':
    'Plánování a publikování vyžadují připojení. Váš koncept je na tomto zařízení v bezpečí.',
  'composerWeb.review.publishConfirm':
    'Toto publikuje na {count, plural, one {# účet} other {# účty} few {# účty} many {# účty}} ihned. Odtud to nelze vrátit zpět.',

  // ------------------------------------------------------------ page-level
  'composerWeb.page.newDraft': 'Nový koncept',
  'composerWeb.page.loading': 'Načítání návrhu, jeho cílů a jejich limitů',
  'composerWeb.page.errorTitle': 'Tento koncept nelze otevřít',
  'composerWeb.page.errorBody':
    'Nic se neztratilo. Zkuste to znovu, a pokud bude stále selhávat, odkaz níže pomůže podpoře najít požadavek.',
  'composerWeb.page.noConnectionsTitle': 'Před psaním připojte účet',
  'composerWeb.page.noConnectionsBody':
    'Draft potřebuje alespoň jeden připojený účet, takže Relay zná limity, náhled a nastavení, které se má zobrazit.',
  'composerWeb.page.noConnectionsExample':
    'Příklad: s propojením X a LinkedIn se z jednoho konceptu stanou dvě nativní verze s vlastními počítadly.',
  'composerWeb.page.permissionTitle': 'V tomto pracovním prostoru nemůžete vytvářet příspěvky',
  'composerWeb.page.permissionBody':
    'Skládání vyžaduje roli editora nebo vyšší. Vlastník nebo správce může změnit vaši roli.',
  'composerWeb.page.rateLimitTitle': 'Příliš mnoho uložení konceptu v krátkém čase',
  'composerWeb.page.rateLimitCause':
    'Tento pracovní prostor dosáhl limitu zápisu pro aktuální okno. Váš text je mezitím uložen v tomto zařízení.',
  'composerWeb.page.rateLimitAlternative':
    'Pokračujte v psaní. Ukládání se automaticky obnoví, když se okno resetuje.',

  // ==================================================== media library ====
  'mediaLib.view.grid': 'Mřížka',
  'mediaLib.view.list': 'Seznam',
  'mediaLib.view.label': 'Rozvržení',
  'mediaLib.sort.label': 'Seřadit',
  'mediaLib.sort.newest': 'Nejnovější první',
  'mediaLib.sort.name': 'Jméno',
  'mediaLib.sort.size': 'Největší první',
  'mediaLib.select': 'Vyberte {name}',
  'mediaLib.column.file': 'Soubor',
  'mediaLib.column.type': 'Typ',
  'mediaLib.column.size': 'Velikost',
  'mediaLib.column.altText': 'Alternativní text',
  'mediaLib.column.rights': 'Práva',
  'mediaLib.column.added': 'Přidáno',
  'mediaLib.openDetail': 'Otevřít {name}',

  'mediaLib.empty.title': 'Zatím žádná média',
  'mediaLib.empty.body':
    'Nahrajte obrázky a video, které již máte, nebo importujte soubor z adresy URL. Relay kontroluje typ a velikost proti každému účtu, do kterého publikujete.',
  'mediaLib.empty.example':
    'Příklad: launch_hero.jpg, 1600 x 900, sada alternativního textu, použito ve 2 příspěvcích.',
  'mediaLib.error.title': 'Knihovnu nelze načíst',
  'mediaLib.error.body': 'Vaše soubory jsou v bezpečí. Tímto selháním se nic nezměnilo.',
  'mediaLib.offline.title': 'Knihovna je offline nedostupná',
  'mediaLib.offline.body':
    'Bez připojení nemůžeme knihovnu obnovit. Soubory už na této obrazovce se nemění. Znovu se připojte a zkuste to znovu.',
  'mediaLib.rateLimited.title': 'Knihovna potřebuje krátkou pauzu',
  'mediaLib.rateLimited.cause':
    'API nás požádalo, abychom zpomalili při načítání vašich souborů. Vaše uložená média jsou v bezpečí.',
  'mediaLib.rateLimited.resetLabel': 'Zkuste to znovu po',
  'mediaLib.rateLimited.alternative':
    'Můžete pokračovat v místní tvorbě konceptů, ale nahrávání a změny knihovny čekají, dokud se limit neobnoví.',
  'mediaLib.loading': 'Načítání vaší knihovny médií',
  'mediaLib.permission.title': 'Tuto knihovnu pracovního prostoru nevidíte',
  'mediaLib.permission.body':
    'Prohlížení médií vyžaduje u této značky roli diváka nebo vyšší. Vlastník nebo správce jej může udělit.',

  'mediaLib.upload.heading': 'Přidat média',
  'mediaLib.upload.browse': 'Vyberte soubory',
  'mediaLib.upload.dropHint':
    'Sem přetáhněte soubory nebo je vyberte. Nahrávání se obnoví, pokud se spojení přeruší.',
  'mediaLib.upload.queueHeading': 'Nahrání',
  'mediaLib.upload.progress': '{name}, {percent} z {size} odesláno',
  'mediaLib.upload.paused': 'Pozastaveno. {sent} z {size} je již uložen.',
  'mediaLib.upload.resume': 'Obnovit nahrávání',
  'mediaLib.upload.pause': 'Pozastavit nahrávání',
  'mediaLib.upload.cancel': 'Zrušit toto nahrávání',
  'mediaLib.upload.retry': 'Zkuste toto nahrát znovu',
  'mediaLib.upload.finalizing': 'Dokončování {name}',
  'mediaLib.upload.done': '{name} je ve vaší knihovně',
  'mediaLib.upload.failed': '{name} nedokončil. {reason}',
  'mediaLib.upload.offline':
    'Offline. Nahrávání pokračuje od místa, kde skončilo, když se znovu připojíte.',
  'mediaLib.upload.rejectedType':
    '{name} je {mimeType}, které žádný z vašich vybraných účtů nepřijímá.',
  'mediaLib.upload.rejectedSize': '{name} je {size}. Nejnižší limit ve vašich účtech je {limit}.',
  'mediaLib.upload.acceptedBy':
    '{count, plural, one {Přijato # vašich účtů} other {Přijato # vašich účtů} few {Přijato # vašich účtů} many {Přijato # vašich účtů}}',
  'mediaLib.upload.rejectedBy': 'Nepřijímá {accounts}',
  'mediaLib.upload.checkedAgainst': 'Zkontrolováno s účty vybranými v tomto konceptu.',
  'mediaLib.upload.noTargets':
    'Nejsou vybrány žádné účty, takže se soubor kontroluje pouze podle výchozího nastavení pracovního prostoru.',
  'mediaLib.import.urlLabel': 'Veřejná URL souboru',
  'mediaLib.import.urlPlaceholder': 'https://cdn.example.com/launch-video.mp4',
  'mediaLib.import.importing': 'Import médií',
  'mediaLib.import.succeeded': 'Soubor je ve vaší knihovně',
  'mediaLib.import.scanPending':
    'Relay zaznamenal jeho zdroj. Publikování čeká, dokud nedokončí bezpečnostní kontrola.',
  'mediaLib.import.failed': 'Soubor se nepodařilo importovat',
  'mediaLib.import.failedHelp':
    'Zkontrolujte, že odkaz je veřejný a vede přímo na podporovaný mediální soubor, pak to zkuste znovu.',
  'mediaLib.import.readOnly': 'Připojte API pro import souborů v tomto prostředí.',
  'mediaLib.import.offline': 'Před importem souboru se znovu připojte.',
  'mediaLib.import.issue.invalid': 'Zadejte úplnou URL.',
  'mediaLib.import.issue.scheme': 'Použijte odkaz HTTP nebo HTTPS.',
  'mediaLib.import.issue.credentials': 'Použijte odkaz bez uživatelského jména nebo hesla.',
  'mediaLib.retention.title': 'Uložené soubory se uchovávají 30 dní po vytvoření příspěvku',
  'mediaLib.retention.body':
    'Jakmile je soubor připojen k příspěvku, trvale jej odstraníme z úložiště Relay 30 dní po vytvoření tohoto příspěvku. Soubory čekající na připojení používají jako záložní datum pro vymazání datum nahrání. Text příspěvku, potvrzenky o publikaci a auditní historie zůstávají dostupné déle. Publikovaný příspěvek na sociální platformě se neodstraní, když vyprší jeho uložený soubor.',
  'mediaLib.retention.limits':
    'Obrázky, zvuk a PDF soubory mohou mít až {imageSize}. Videa mohou mít až {videoSize}.',
  'mediaLib.retention.expiresLabel': 'Datum smazání souboru',
  'mediaLib.retention.deleted': 'Trvale smazáno',
  'mediaLib.retention.deletedTitle': 'Tento uložený soubor byl smazán',
  'mediaLib.retention.deletedBody':
    '30denní úložná doba skončila. Text příspěvku, potvrzenky o publikaci a auditní historie zůstávají.',
  'mediaLib.processing.unavailableTitle': 'Tento soubor není připraven k publikování',
  'mediaLib.processing.unavailableBody':
    'Zpracování nebo bezpečnostní kontrola stále čeká, nebo neprošla. Nahrajte soubor znovu, pokud se tento stav nevyjasní.',
  'mediaLib.processing.pendingTitle': 'Bezpečnostní skenování není v předstartovní fázi dostupné',
  'mediaLib.processing.pendingBody':
    'Soubor je uložen po dobu 30 dní, ale nelze jej připojit k publikovanému příspěvku, dokud není zapnuto bezpečnostní skenování.',
  'mediaLib.processing.blockedTitle': 'Tento soubor nelze publikovat',
  'mediaLib.processing.blockedBody':
    'Soubor neprošel zpracováním nebo bezpečnostní kontrolou. Nahrajte jiný soubor.',

  'mediaLib.alt.heading': 'Alternativní text',
  'mediaLib.alt.help':
    'Popište, na čem záleží na obrázku pro někoho, kdo to nevidí. Obvykle stačí jedna nebo dvě věty.',
  'mediaLib.alt.count': '{used} z {limit} znaků',
  'mediaLib.alt.requiredBy': 'Požadováno {accounts}',
  'mediaLib.alt.waive': 'Tento obrázek neobsahuje žádné informace',
  'mediaLib.alt.waiveReason': 'Proč nepotřebuje popis',
  'mediaLib.alt.waiveHelp':
    'Používejte pouze pro dekoraci. Pokud to platforma dovoluje, publikuje se obrázek s prázdným popisem.',
  'mediaLib.alt.waived': 'Zřeknutí se uživatelem {name} na {date}. Důvod: {reason}',
  'mediaLib.alt.unsupported':
    '{provider} nepřijímá alternativní text prostřednictvím svého rozhraní API pro tento účet.',
  'mediaLib.alt.missingCount':
    '{count, plural, one {# soubor nemá žádný alternativní text} other {# soubory nemají žádný alternativní text} few {# soubory nemají žádný alternativní text} many {# soubory nemají žádný alternativní text}}',

  'mediaLib.rights.heading': 'Práva a souhlas',
  'mediaLib.rights.declared': 'Deklarováno {name} na {date}',
  'mediaLib.rights.undeclared':
    'Dosud nedeklarováno. Deklarujte to před publikováním tohoto souboru.',
  'mediaLib.rights.ownerLabel': 'Kdo vlastní tento soubor',
  'mediaLib.rights.ownerSelf': 'Tento pracovní prostor',
  'mediaLib.rights.ownerLicensed': 'Licence od někoho jiného',
  'mediaLib.rights.ownerUgc': 'Zákazník nebo tvůrce udělil povolení',
  'mediaLib.rights.licenseLabel': 'Odkaz na licenci nebo oprávnění',
  'mediaLib.rights.peopleLabel': 'V tomto souboru se objevují lidé',
  'mediaLib.rights.peopleConsent': 'Všichni zobrazení souhlasili se zveřejněním',
  'mediaLib.rights.musicLabel': 'Tento soubor obsahuje hudbu nebo zvukový doprovod',
  'mediaLib.rights.confirm':
    'Mám právo publikovat tento soubor, včetně všech osob, hudby, log a značek v něm.',
  'mediaLib.rights.blocking': 'Tento soubor nelze naplánovat, dokud nebudou deklarována práva.',

  'mediaLib.editor.heading': 'Upravit obrázek',
  'mediaLib.editor.description':
    'Každá úprava se uloží jako nová verze. Původní soubor je zachován a lze jej obnovit.',
  'mediaLib.editor.tab.crop': 'Oříznout',
  'mediaLib.editor.tab.transform': 'Změna velikosti a otočení',
  'mediaLib.editor.tab.canvas': 'Plátno',
  'mediaLib.editor.tab.output': 'Formát a velikost',
  'mediaLib.editor.tab.thumbnail': 'Miniatura',
  'mediaLib.editor.presetLabel': 'Přednastavený poměr stran',
  'mediaLib.editor.presetFree': 'Zdarma',
  'mediaLib.editor.presetFor': '{ratio}, používá {accounts}',
  'mediaLib.editor.cropX': 'Oříznout od počátečního okraje',
  'mediaLib.editor.cropY': 'Oříznutí shora',
  'mediaLib.editor.cropWidth': 'Šířka oříznutí',
  'mediaLib.editor.cropHeight': 'Výška oříznutí',
  'mediaLib.editor.cropKeyboardHint':
    'Ořezový rámeček je nastaven s číselnými poli, takže funguje plně z klávesnice.',
  'mediaLib.editor.widthLabel': 'Šířka v pixelech',
  'mediaLib.editor.heightLabel': 'Výška v pixelech',
  'mediaLib.editor.lockRatio': 'Zachovat aktuální poměr',
  'mediaLib.editor.rotateLabel': 'Otáčení',
  'mediaLib.editor.rotateDegrees': '{degrees} stupně',
  'mediaLib.editor.flipHorizontal': 'Překlopit přes svislou osu',
  'mediaLib.editor.flipVertical': 'Překlopit přes vodorovnou osu',
  'mediaLib.editor.canvasColor': 'Barva pozadí',
  'mediaLib.editor.canvasFit': 'Jak obraz sedí na plátně',
  'mediaLib.editor.canvasFitCover': 'Vyplňte plátno a ořízněte přetečení',
  'mediaLib.editor.canvasFitContain': 'Přizpůsobte celý obrázek a zbytek podložte',
  'mediaLib.editor.formatLabel': 'Výstupní formát',
  'mediaLib.editor.qualityLabel': 'Kvalita komprese',
  'mediaLib.editor.qualityValue': '{value} ze 100',
  'mediaLib.editor.estimatedSize': 'Odhadovaný výkon {size}, od {original}',
  'mediaLib.editor.estimatedSizeUnknown': 'Výstupní velikost je známa až po zpracování souboru.',
  'mediaLib.editor.thumbnailHelp':
    'Vyberte snímek nebo soubor použitý jako miniaturu videa tam, kde je platforma přijímá.',
  'mediaLib.editor.thumbnailFrame': 'Snímek na {time}',
  'mediaLib.editor.save': 'Uložit jako novou verzi',
  'mediaLib.editor.saving': 'Ukládání verze {version}',
  'mediaLib.editor.saved': 'Verze {version} uloženo. Originál je stále zde.',
  'mediaLib.editor.discard': 'Zahodit tyto úpravy',
  'mediaLib.editor.noChanges': 'Zatím žádné změny k uložení.',
  'mediaLib.editor.revalidate':
    'Uložením se tento soubor znovu zkontroluje se všemi účty v konceptech, které jej používají.',
  'mediaLib.editor.noGeneration':
    'Tento editor změní soubor, který jste nahráli. Nevytváří nové snímky.',

  'mediaLib.versions.heading': 'Verze',
  'mediaLib.versions.original': 'Původní nahrání',
  'mediaLib.versions.current': 'Aktuální verze',
  'mediaLib.versions.restore': 'Obnovit verzi {version}',
  'mediaLib.versions.item': 'Verze {version}, {dimensions}, {size}, {date}',

  'mediaLib.provenance.heading': 'Odkud tento soubor pochází',
  'mediaLib.provenance.sourceUrl': 'Adresa URL zdroje',
  'mediaLib.provenance.fetchedAt': 'Načteno {date}',
  'mediaLib.provenance.declaredAuthor': 'Uvedený autor',
  'mediaLib.provenance.declaredLicense': 'Uvedená licence',
  'mediaLib.provenance.contentCredentials': 'Pověření pro vložený obsah',
  'mediaLib.provenance.contentCredentialsNone':
    'Tento soubor nenese žádné vložené pověření obsahu. To je běžné a neznamená to, že je něco špatně.',
  'mediaLib.provenance.unverified':
    'Tyto podrobnosti pocházejí ze zdroje, nikoli z relé. Než se na ně spolehnete, zkontrolujte je.',

  'mediaLib.picker.title': 'Vyberte média',
  'mediaLib.picker.description': 'Soubory jsou kontrolovány s účty vybranými v tomto konceptu.',
  'mediaLib.picker.confirm':
    '{count, plural, =0 {Vyberte soubory} one {Přidat # soubor} other {Přidat # soubory} few {Přidat # soubory} many {Přidat # soubory}}',
  'mediaLib.picker.forMaster': 'Přidání do hlavního konceptu',
  'mediaLib.picker.forVariant': 'Přidání k verzi pro {account} pouze',
} as const;
