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
  'import.title': 'Importera inlägg från en CSV',
  'import.subtitle':
    'Ladda upp ett kalkylblad, läs vad det kommer att göra, och bestäm sedan. Uppladdning kontrollerar filen. Det skapar inget.',

  'import.step.upload': 'Ladda upp',
  'import.step.columns': 'Kolumner',
  'import.step.review': 'Granska',
  'import.step.apply': 'Tillämpa',
  'import.step.results': 'Resultat',
  'import.step.position': 'Steg {current} av {total}',

  'import.upload.heading': 'Välj en CSV-fil',
  'import.upload.help':
    'Endast CSV. Kalkylbladsfiler som .xlsx läses inte. Exportera ditt blad som CSV först.',
  'import.upload.field': 'CSV-fil',
  'import.upload.fieldHelp': 'Välj en fil, eller klistra in raderna i rutan nedan.',
  'import.upload.paste': 'Eller klistra in CSV-text',
  'import.upload.pasteHelp': 'Inkludera rubrikraden. Allt kontrolleras innan något skapas.',
  'import.upload.project': 'Projekt',
  'import.upload.projectHelp': 'Varje rad i en fil hör till detta projekt.',
  'import.upload.submit': 'Kontrollera denna fil',
  'import.upload.submitting': 'Läser filen',
  'import.upload.allowPast': 'Tillåt tider som redan har passerat',
  'import.upload.allowPastHelp':
    'Av som standard. En rad daterad i det förflutna rapporteras så att du kan rätta den, i stället för att den flyttas åt dig.',
  'import.upload.tooLarge': 'Den filen är större än {limit} tecken. Dela upp den och försök igen.',
  'import.upload.duplicate':
    'Detta är samma fil du laddade upp tidigare, så du tittar på den importen i stället för en andra kopia av den.',

  'import.template.heading': 'Vad kolumnerna betyder',
  'import.template.download': 'Ladda ner en CSV-mall',
  'import.template.required': 'Obligatoriska kolumner',
  'import.template.optional': 'Valfria kolumner',
  'import.column.external_row_id': 'Ditt eget id för raden. Måste vara unikt inom filen.',
  'import.column.project': 'Projektets namn eller id som raden hör till.',
  'import.column.targets':
    'Antingen set: följt av ett målset-id, eller konto-id:n åtskilda med ett lodrätt streck.',
  'import.column.caption': 'Inläggstexten.',
  'import.column.scheduled_local_time': 'Lokalt datum och tid, skrivet som 2026-09-01T10:00.',
  'import.column.time_zone': 'IANA-zonen den lokala tiden läses i, till exempel Europe/Berlin.',
  'import.column.media':
    'Ett media-id, sha256: följt av kontrollsumman för media du redan har, eller en https-adress för servern att hämta.',
  'import.column.title': 'En titel, där destinationen använder en.',
  'import.column.destination': 'Sidan, tavlan eller kanalen inom kontot.',
  'import.column.privacy': 'Sekretessvärdet destinationen förväntar sig.',
  'import.column.first_comment': 'Text publicerad som första kommentar efter inlägget.',
  'import.column.approval_policy': 'Godkännandepolicyn att koppla till varje utkast.',
  'import.column.perPlatform':
    'En caption_ eller title_ kolumn uppkallad efter en plattform åsidosätter bara den plattformen, till exempel caption_instagram.',

  'import.columns.heading': 'Kolumnkontroll',
  'import.columns.ok': 'Varje obligatorisk kolumn finns.',
  'import.columns.missing':
    '{count, plural, one {# obligatorisk kolumn saknas} other {# obligatoriska kolumner saknas}}',
  'import.columns.unknown':
    '{count, plural, one {# kolumn kändes inte igen och ignoreras} other {# kolumner kändes inte igen och ignoreras}}',
  'import.columns.present': 'Hittade kolumner',

  'import.review.heading': 'Vad denna fil kommer att göra',
  'import.review.counts':
    '{valid, plural, =0 {Inga rader är klara} one {# rad är klar} other {# rader är klara}}, {invalid, plural, =0 {inga behöver uppmärksamhet} one {# behöver uppmärksamhet} other {# behöver uppmärksamhet}}.',
  'import.review.empty': 'Inga rader lästes från denna fil.',
  'import.review.rowsHeading': 'Rader',
  'import.review.filterAll': 'Alla rader',
  'import.review.filterValid': 'Klara',
  'import.review.filterInvalid': 'Behöver uppmärksamhet',
  'import.review.filterFailed': 'Misslyckades',
  'import.review.downloadErrors': 'Ladda ner problemen som CSV',
  'import.review.parsedWith': 'Läst med parser {version}',

  'import.table.row': 'Rad-id',
  'import.table.line': 'Rad',
  'import.table.state': 'Status',
  'import.table.caption': 'Text',
  'import.table.time': 'Schemalagd',
  'import.table.problems': 'Problem',
  'import.table.draft': 'Utkast',
  'import.table.noProblems': 'Inga',

  'import.state.pending': 'Inte kontrollerad',
  'import.state.valid': 'Klar',
  'import.state.invalid': 'Behöver uppmärksamhet',
  'import.state.applied': 'Utkast skapat',
  'import.state.skipped': 'Redan gjort',
  'import.state.failed': 'Misslyckades',

  'import.job.state.uploaded': 'Uppladdad',
  'import.job.state.validating': 'Kontrollerar',
  'import.job.state.validated': 'Kontrollerad',
  'import.job.state.applying': 'Tillämpar',
  'import.job.state.applied': 'Tillämpad',
  'import.job.state.failed': 'Kunde inte läsas',

  'import.apply.heading': 'Vad ska hända med raderna som är klara?',
  'import.apply.drafts': 'Skapa utkast',
  'import.apply.draftsHelp':
    'Standard. Varje klar rad blir ett utkast du kan öppna, redigera och godkänna. Inget schemaläggs.',
  'import.apply.scheduled': 'Skapa utkast och schemalägg dem',
  'import.apply.scheduledHelp':
    'Varje klar rad blir ett utkast och tar tiden som är skriven i filen. Välj detta bara om tiderna är rätt.',
  'import.apply.confirm': 'Tillämpa {count, plural, one {# rad} other {# rader}}',
  'import.apply.confirmScheduled':
    'Skapa och schemalägg {count, plural, one {# rad} other {# rader}}',
  'import.apply.running': 'Tillämpar rader',
  'import.apply.safeToRepeat':
    'Att tillämpa två gånger är säkert. En rad som redan skapat ett utkast lämnas orörd.',

  'import.results.heading': 'Resultat',
  'import.results.applied': '{count, plural, one {# utkast skapat} other {# utkast skapade}}',
  'import.results.skipped':
    '{count, plural, one {# rad var redan gjord} other {# rader var redan gjorda}}',
  'import.results.failed': '{count, plural, one {# rad misslyckades} other {# rader misslyckades}}',
  'import.results.retry': 'Tillämpa återstående rader igen',
  'import.results.openDrafts': 'Öppna utkasten',
  'import.results.unavailable': 'inte tillgängligt',

  'import.history.heading': 'Tidigare importer',
  'import.history.empty': 'Inga importer än.',
  'import.history.open': 'Öppna',

  'import.a11y.rowsTable': 'Manifestrader och deras problem',
  'import.a11y.stepList': 'Importsteg',
  'import.a11y.uploadedFile': 'Vald fil: {filename}',

  'import.error.emptyFile': 'Den filen har inga rader i sig.',
  'import.error.missingColumn': 'Kolumnen {column} saknas.',
  'import.error.unknownColumn': 'Kolumnen {column} kändes inte igen, så den ignoreras.',
  'import.error.duplicateRowId': 'Rad-id:t {value} används mer än en gång i denna fil.',
  'import.error.required': 'Denna cell får inte vara tom.',
  'import.error.invalidCell': 'Denna cell är inte i en form vi kan läsa.',
  'import.error.rowShape': 'Denna rad har {actual} celler men rubriken har {expected}.',
  'import.error.invalidLocalTime':
    'Tiden {value} är inte ett lokalt datum och tid som 2026-09-01T10:00.',
  'import.error.invalidTimeZone': 'Zonen {value} är inte ett IANA-tidszonsnamn.',
  'import.error.nonexistentLocalTime':
    'Tiden {value} finns inte i {zone}. Klockan hoppar över den.',
  'import.error.ambiguousLocalTime':
    'Tiden {value} inträffar två gånger i {zone} den dagen. Välj en annan tid.',
  'import.error.scheduleInPast': 'Tiden {value} i {zone} har redan passerat.',
  'import.error.invalidTargets':
    'Värdet {value} är inte ett sparat målset eller en lista av konto-id:n.',
  'import.error.invalidMedia':
    'Värdet {value} är inte ett media-id, en sha256-kontrollsumma eller en https-adress.',
  'import.error.mediaNotFound': 'Inget media i denna arbetsyta matchar {value}.',
  'import.error.mediaImportStarted':
    'Mediet på {value} hämtas. Tillämpa denna fil igen när det finns i biblioteket.',
  'import.error.unknownVariantTarget':
    'Denna rad har inget {provider}-konto, så {provider}-texten användes inte.',
  'import.error.applyFailed': 'Denna rad kunde inte tillämpas. Referens: {code}.',
  'import.error.alreadyApplied': 'Denna rad har redan skapat ett utkast, så den lämnades orörd.',
  'import.error.tooManyRows': 'Endast de första {limit} raderna i en fil läses.',
} as const;
