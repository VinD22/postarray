/**
 * Bulk CSV import.
 *
 * Two groups of strings. The `import.error.*` keys are the ones the parser and
 * the apply step emit: they are stored on a row, rendered in the report and
 * written into the downloadable CSV, so they have to make sense to someone
 * reading a spreadsheet rather than a screen. Everything else is the wizard.
 *
 * The copy says drafts wherever drafts are what happens, and it says schedule
 * only on the step where a person chooses it. Nothing here promises that a post
 * reaches a platform.
 */
export const importMessages = {
  'import.title': 'Import příspěvků z CSV',
  'import.subtitle':
    'Nahrajte tabulku, přečtěte si, co udělá, a pak se rozhodněte. Nahrání soubor zkontroluje. Nic se tím nevytváří.',

  'import.step.upload': 'Nahrát',
  'import.step.columns': 'Sloupce',
  'import.step.review': 'Kontrola',
  'import.step.apply': 'Použít',
  'import.step.results': 'Výsledky',
  'import.step.position': 'Krok {current} z {total}',

  'import.upload.heading': 'Vyberte soubor CSV',
  'import.upload.help':
    'Pouze CSV. Soubory tabulek jako .xlsx se nečtou. Nejprve exportujte svůj list jako CSV.',
  'import.upload.field': 'Soubor CSV',
  'import.upload.fieldHelp': 'Vyberte soubor, nebo vložte řádky do pole níže.',
  'import.upload.paste': 'Nebo vložte text CSV',
  'import.upload.pasteHelp': 'Zahrňte řádek záhlaví. Vše se kontroluje předtím, než je cokoli vytvořeno.',
  'import.upload.project': 'Značka',
  'import.upload.projectHelp': 'Každý řádek v jednom souboru patří této značce.',
  'import.upload.submit': 'Zkontrolovat tento soubor',
  'import.upload.submitting': 'Čtení souboru',
  'import.upload.allowPast': 'Povolit časy, které už uplynuly',
  'import.upload.allowPastHelp':
    'Ve výchozím nastavení vypnuto. Řádek s datem v minulosti je ohlášen, abyste jej mohli opravit, místo aby byl přesunut za vás.',
  'import.upload.tooLarge': 'Tento soubor je větší než {limit} znaků. Rozdělte jej a zkuste to znovu.',
  'import.upload.duplicate':
    'Toto je stejný soubor, který jste nahráli dříve, takže se díváte na tamten import, ne na jeho druhou kopii.',

  'import.template.heading': 'Co znamenají sloupce',
  'import.template.download': 'Stáhnout vzorové CSV',
  'import.template.required': 'Povinné sloupce',
  'import.template.optional': 'Volitelné sloupce',
  'import.column.external_row_id': 'Vaše vlastní id řádku. Musí být v rámci souboru jedinečné.',
  'import.column.project': 'Název nebo id značky, ke které řádek patří.',
  'import.column.targets': 'Set: následované id cílové sady, nebo id účtů oddělená svislou čarou.',
  'import.column.caption': 'Text příspěvku.',
  'import.column.scheduled_local_time': 'Místní datum a čas, zapsané jako 2026-09-01T10:00.',
  'import.column.time_zone': 'Zóna IANA, ve které se tento místní čas čte, například Europe/Berlin.',
  'import.column.media':
    'Id média, sha256: následované kontrolním součtem média, které již máte, nebo adresa https, ze které jej má server stáhnout.',
  'import.column.title': 'Titulek, tam kde jej cíl používá.',
  'import.column.destination': 'Stránka, nástěnka nebo kanál uvnitř účtu.',
  'import.column.privacy': 'Hodnota soukromí, kterou cíl očekává.',
  'import.column.first_comment': 'Text publikovaný jako první komentář po příspěvku.',
  'import.column.approval_policy': 'Zásada schvalování, která se má připojit ke každému konceptu.',
  'import.column.perPlatform':
    'Sloupec caption_ nebo title_ pojmenovaný podle platformy přepíše pouze tuto platformu, například caption_instagram.',

  'import.columns.heading': 'Kontrola sloupců',
  'import.columns.ok': 'Každý povinný sloupec je přítomen.',
  'import.columns.missing':
    '{count, plural, one {Chybí # povinný sloupec} few {Chybí # povinné sloupce} many {Chybí # povinného sloupce} other {Chybí # povinných sloupců}}',
  'import.columns.unknown':
    '{count, plural, one {# sloupec nebyl rozpoznán a je ignorován} few {# sloupce nebyly rozpoznány a jsou ignorovány} many {# sloupce nebylo rozpoznáno a je ignorováno} other {# sloupců nebylo rozpoznáno a jsou ignorovány}}',
  'import.columns.present': 'Nalezené sloupce',

  'import.review.heading': 'Co tento soubor udělá',
  'import.review.counts':
    '{valid, plural, =0 {Žádný řádek není připraven} one {# řádek je připraven} few {# řádky jsou připraveny} many {# řádku je připraveno} other {# řádků je připraveno}}, {invalid, plural, =0 {žádný nevyžaduje pozornost} one {# vyžaduje pozornost} few {# vyžadují pozornost} many {# vyžaduje pozornost} other {# vyžaduje pozornost}}.',
  'import.review.empty': 'Z tohoto souboru nebyly přečteny žádné řádky.',
  'import.review.rowsHeading': 'Řádky',
  'import.review.filterAll': 'Všechny řádky',
  'import.review.filterValid': 'Připravené',
  'import.review.filterInvalid': 'Vyžadují pozornost',
  'import.review.filterFailed': 'Selhaly',
  'import.review.downloadErrors': 'Stáhnout problémy jako CSV',
  'import.review.parsedWith': 'Přečteno parserem {version}',

  'import.table.row': 'Id řádku',
  'import.table.line': 'Řádek',
  'import.table.state': 'Stav',
  'import.table.caption': 'Text',
  'import.table.time': 'Naplánováno',
  'import.table.problems': 'Problémy',
  'import.table.draft': 'Koncept',
  'import.table.noProblems': 'Žádné',

  'import.state.pending': 'Nezkontrolováno',
  'import.state.valid': 'Připraveno',
  'import.state.invalid': 'Vyžaduje pozornost',
  'import.state.applied': 'Koncept vytvořen',
  'import.state.skipped': 'Již hotovo',
  'import.state.failed': 'Selhalo',

  'import.job.state.uploaded': 'Nahráno',
  'import.job.state.validating': 'Kontroluje se',
  'import.job.state.validated': 'Zkontrolováno',
  'import.job.state.applying': 'Používá se',
  'import.job.state.applied': 'Použito',
  'import.job.state.failed': 'Nepodařilo se přečíst',

  'import.apply.heading': 'Co se má stát s připravenými řádky?',
  'import.apply.drafts': 'Vytvořit koncepty',
  'import.apply.draftsHelp':
    'Výchozí nastavení. Každý připravený řádek se stane konceptem, který můžete otevřít, upravit a schválit. Nic se neplánuje.',
  'import.apply.scheduled': 'Vytvořit koncepty a naplánovat je',
  'import.apply.scheduledHelp':
    'Každý připravený řádek se stane konceptem a převezme čas zapsaný v souboru. Zvolte to pouze tehdy, pokud jsou časy správné.',
  'import.apply.confirm': 'Použít {count, plural, one {# řádek} few {# řádky} many {# řádku} other {# řádků}}',
  'import.apply.confirmScheduled':
    'Vytvořit a naplánovat {count, plural, one {# řádek} few {# řádky} many {# řádku} other {# řádků}}',
  'import.apply.running': 'Používání řádků',
  'import.apply.safeToRepeat':
    'Použití dvakrát je bezpečné. Řádek, který již vytvořil koncept, zůstává beze změny.',

  'import.results.heading': 'Výsledky',
  'import.results.applied':
    '{count, plural, one {# koncept vytvořen} few {# koncepty vytvořeny} many {# konceptu vytvořeno} other {# konceptů vytvořeno}}',
  'import.results.skipped':
    '{count, plural, one {# řádek byl již hotov} few {# řádky byly již hotové} many {# řádku bylo již hotovo} other {# řádků bylo již hotovo}}',
  'import.results.failed':
    '{count, plural, one {# řádek selhal} few {# řádky selhaly} many {# řádku selhalo} other {# řádků selhalo}}',
  'import.results.retry': 'Znovu použít zbývající řádky',
  'import.results.openDrafts': 'Otevřít koncepty',
  'import.results.unavailable': 'nedostupné',

  'import.history.heading': 'Dřívější importy',
  'import.history.empty': 'Zatím žádné importy.',
  'import.history.open': 'Otevřít',

  'import.a11y.rowsTable': 'Řádky manifestu a jejich problémy',
  'import.a11y.stepList': 'Kroky importu',
  'import.a11y.uploadedFile': 'Vybraný soubor: {filename}',

  'import.error.emptyFile': 'Tento soubor nemá žádné řádky.',
  'import.error.missingColumn': 'Sloupec {column} chybí.',
  'import.error.unknownColumn': 'Sloupec {column} nebyl rozpoznán, proto je ignorován.',
  'import.error.duplicateRowId': 'Id řádku {value} je v tomto souboru použito více než jednou.',
  'import.error.required': 'Tato buňka nesmí být prázdná.',
  'import.error.invalidCell': 'Tato buňka není ve formátu, který dokážeme přečíst.',
  'import.error.rowShape': 'Tento řádek má {actual} buněk, ale záhlaví jich má {expected}.',
  'import.error.invalidLocalTime': 'Čas {value} není místní datum a čas jako 2026-09-01T10:00.',
  'import.error.invalidTimeZone': 'Zóna {value} není název časové zóny IANA.',
  'import.error.nonexistentLocalTime': 'Čas {value} v pásmu {zone} toho dne neexistuje. Hodiny jej přeskočí.',
  'import.error.ambiguousLocalTime':
    'Čas {value} nastává toho dne v pásmu {zone} dvakrát. Vyberte jiný čas.',
  'import.error.scheduleInPast': 'Čas {value} v pásmu {zone} už uplynul.',
  'import.error.invalidTargets': 'Hodnota {value} není uložená cílová sada ani seznam id účtů.',
  'import.error.invalidMedia':
    'Hodnota {value} není id média, kontrolní součet sha256 ani adresa https.',
  'import.error.mediaNotFound': 'V tomto pracovním prostoru žádné médium neodpovídá {value}.',
  'import.error.mediaImportStarted':
    'Médium na {value} se stahuje. Použijte tento soubor znovu, jakmile bude v knihovně.',
  'import.error.unknownVariantTarget':
    'Tento řádek nemá účet {provider}, takže text pro {provider} nebyl použit.',
  'import.error.applyFailed': 'Tento řádek se nepodařilo použít. Odkaz: {code}.',
  'import.error.alreadyApplied': 'Tento řádek už vytvořil koncept, takže zůstal beze změny.',
  'import.error.tooManyRows': 'Ze souboru se čtou pouze první {limit} řádků.',
} as const;
