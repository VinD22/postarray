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
  'import.title': 'Berichten importeren uit een CSV',
  'import.subtitle':
    'Upload een spreadsheet, lees wat het gaat doen, en beslis dan. Uploaden controleert het bestand. Er wordt niets gemaakt.',

  'import.step.upload': 'Uploaden',
  'import.step.columns': 'Kolommen',
  'import.step.review': 'Controleren',
  'import.step.apply': 'Toepassen',
  'import.step.results': 'Resultaten',
  'import.step.position': 'Stap {current} van {total}',

  'import.upload.heading': 'Kies een CSV-bestand',
  'import.upload.help':
    'Alleen CSV. Spreadsheetbestanden zoals .xlsx worden niet gelezen. Exporteer je blad eerst als CSV.',
  'import.upload.field': 'CSV-bestand',
  'import.upload.fieldHelp': 'Selecteer een bestand, of plak de rijen in het vak hieronder.',
  'import.upload.paste': 'Of plak CSV-tekst',
  'import.upload.pasteHelp': 'Neem de kopregel op. Alles wordt gecontroleerd voordat er iets wordt gemaakt.',
  'import.upload.project': 'Merk',
  'import.upload.projectHelp': 'Elke rij in één bestand hoort bij dit merk.',
  'import.upload.submit': 'Controleer dit bestand',
  'import.upload.submitting': 'Bestand wordt gelezen',
  'import.upload.allowPast': 'Sta tijden toe die al zijn verstreken',
  'import.upload.allowPastHelp':
    'Standaard uit. Een rij met een datum in het verleden wordt gerapporteerd zodat je het zelf kunt herstellen, in plaats van dat het voor je wordt verplaatst.',
  'import.upload.tooLarge': 'Dat bestand is groter dan {limit} tekens. Splits het en probeer het opnieuw.',
  'import.upload.duplicate':
    'Dit is hetzelfde bestand dat je eerder hebt geüpload, dus je bekijkt die import in plaats van een tweede kopie ervan.',

  'import.template.heading': 'Wat de kolommen betekenen',
  'import.template.download': 'Download een CSV-sjabloon',
  'import.template.required': 'Verplichte kolommen',
  'import.template.optional': 'Optionele kolommen',
  'import.column.external_row_id': 'Je eigen id voor de rij. Moet uniek zijn binnen het bestand.',
  'import.column.project': 'De merknaam of het merk-id waartoe de rij hoort.',
  'import.column.targets':
    "Ofwel set: gevolgd door een doelset-id, ofwel account-id's gescheiden door een verticale streep.",
  'import.column.caption': 'De berichttekst.',
  'import.column.scheduled_local_time': 'Lokale datum en tijd, geschreven als 2026-09-01T10:00.',
  'import.column.time_zone': 'De IANA-zone waarin die lokale tijd wordt gelezen, bijvoorbeeld Europe/Berlin.',
  'import.column.media':
    'Een media-id, sha256: gevolgd door de checksum van media die je al hebt, of een https-adres waar de server het kan ophalen.',
  'import.column.title': 'Een titel, waar de bestemming er een gebruikt.',
  'import.column.destination': 'De pagina, het bord of het kanaal binnen het account.',
  'import.column.privacy': 'De privacywaarde die de bestemming verwacht.',
  'import.column.first_comment': 'Tekst geplaatst als eerste reactie na het bericht.',
  'import.column.approval_policy': 'Het goedkeuringsbeleid om aan elk concept te koppelen.',
  'import.column.perPlatform':
    'Een caption_ of title_ kolom genoemd naar een platform overschrijft alleen dat platform, bijvoorbeeld caption_instagram.',

  'import.columns.heading': 'Kolomcontrole',
  'import.columns.ok': 'Elke verplichte kolom is aanwezig.',
  'import.columns.missing':
    '{count, plural, one {# verplichte kolom ontbreekt} other {# verplichte kolommen ontbreken}}',
  'import.columns.unknown':
    '{count, plural, one {# kolom werd niet herkend en wordt genegeerd} other {# kolommen werden niet herkend en worden genegeerd}}',
  'import.columns.present': 'Gevonden kolommen',

  'import.review.heading': 'Wat dit bestand gaat doen',
  'import.review.counts':
    '{valid, plural, =0 {Geen rijen zijn klaar} one {# rij is klaar} other {# rijen zijn klaar}}, {invalid, plural, =0 {geen behoeven aandacht} one {# behoeft aandacht} other {# behoeven aandacht}}.',
  'import.review.empty': 'Er zijn geen rijen uit dit bestand gelezen.',
  'import.review.rowsHeading': 'Rijen',
  'import.review.filterAll': 'Alle rijen',
  'import.review.filterValid': 'Klaar',
  'import.review.filterInvalid': 'Behoeven aandacht',
  'import.review.filterFailed': 'Mislukt',
  'import.review.downloadErrors': 'Download de problemen als CSV',
  'import.review.parsedWith': 'Gelezen met parser {version}',

  'import.table.row': 'Rij-id',
  'import.table.line': 'Regel',
  'import.table.state': 'Status',
  'import.table.caption': 'Tekst',
  'import.table.time': 'Gepland',
  'import.table.problems': 'Problemen',
  'import.table.draft': 'Concept',
  'import.table.noProblems': 'Geen',

  'import.state.pending': 'Niet gecontroleerd',
  'import.state.valid': 'Klaar',
  'import.state.invalid': 'Behoeft aandacht',
  'import.state.applied': 'Concept gemaakt',
  'import.state.skipped': 'Al gedaan',
  'import.state.failed': 'Mislukt',

  'import.job.state.uploaded': 'Geüpload',
  'import.job.state.validating': 'Wordt gecontroleerd',
  'import.job.state.validated': 'Gecontroleerd',
  'import.job.state.applying': 'Wordt toegepast',
  'import.job.state.applied': 'Toegepast',
  'import.job.state.failed': 'Kon niet worden gelezen',

  'import.apply.heading': 'Wat moet er gebeuren met de rijen die klaar zijn?',
  'import.apply.drafts': 'Concepten maken',
  'import.apply.draftsHelp':
    'De standaardoptie. Elke klare rij wordt een concept dat je kunt openen, bewerken en goedkeuren. Er wordt niets gepland.',
  'import.apply.scheduled': 'Concepten maken en plannen',
  'import.apply.scheduledHelp':
    'Elke klare rij wordt een concept en neemt het tijdstip uit het bestand over. Kies dit alleen als de tijden kloppen.',
  'import.apply.confirm': 'Pas {count, plural, one {# rij} other {# rijen}} toe',
  'import.apply.confirmScheduled': 'Maak en plan {count, plural, one {# rij} other {# rijen}}',
  'import.apply.running': 'Rijen worden toegepast',
  'import.apply.safeToRepeat':
    'Twee keer toepassen is veilig. Een rij die al een concept heeft gemaakt, wordt met rust gelaten.',

  'import.results.heading': 'Resultaten',
  'import.results.applied': '{count, plural, one {# concept gemaakt} other {# concepten gemaakt}}',
  'import.results.skipped': '{count, plural, one {# rij was al gedaan} other {# rijen waren al gedaan}}',
  'import.results.failed': '{count, plural, one {# rij mislukt} other {# rijen mislukt}}',
  'import.results.retry': 'Pas de overige rijen opnieuw toe',
  'import.results.openDrafts': 'Open de concepten',
  'import.results.unavailable': 'niet beschikbaar',

  'import.history.heading': 'Eerdere imports',
  'import.history.empty': 'Nog geen imports.',
  'import.history.open': 'Openen',

  'import.a11y.rowsTable': 'Manifestrijen en hun problemen',
  'import.a11y.stepList': 'Importstappen',
  'import.a11y.uploadedFile': 'Geselecteerd bestand: {filename}',

  'import.error.emptyFile': 'Dat bestand bevat geen rijen.',
  'import.error.missingColumn': 'De kolom {column} ontbreekt.',
  'import.error.unknownColumn': 'De kolom {column} werd niet herkend, dus wordt genegeerd.',
  'import.error.duplicateRowId': 'Het rij-id {value} wordt meer dan eens gebruikt in dit bestand.',
  'import.error.required': 'Deze cel mag niet leeg zijn.',
  'import.error.invalidCell': 'Deze cel is niet in een vorm die we kunnen lezen.',
  'import.error.rowShape': 'Deze regel heeft {actual} cellen maar de kop heeft er {expected}.',
  'import.error.invalidLocalTime': 'De tijd {value} is geen lokale datum en tijd zoals 2026-09-01T10:00.',
  'import.error.invalidTimeZone': 'De zone {value} is geen IANA-tijdzonenaam.',
  'import.error.nonexistentLocalTime': 'De tijd {value} bestaat niet in {zone}. De klok springt eroverheen.',
  'import.error.ambiguousLocalTime':
    'De tijd {value} komt die dag twee keer voor in {zone}. Kies een andere tijd.',
  'import.error.scheduleInPast': 'De tijd {value} in {zone} is al verstreken.',
  'import.error.invalidTargets':
    "De waarde {value} is geen opgeslagen doelset of lijst van account-id's.",
  'import.error.invalidMedia': 'De waarde {value} is geen media-id, sha256-checksum of https-adres.',
  'import.error.mediaNotFound': 'Geen media in deze werkruimte komt overeen met {value}.',
  'import.error.mediaImportStarted':
    'De media op {value} wordt opgehaald. Pas dit bestand opnieuw toe zodra het in de bibliotheek staat.',
  'import.error.unknownVariantTarget':
    'Deze rij heeft geen {provider}-account, dus de {provider}-tekst is niet gebruikt.',
  'import.error.applyFailed': 'Deze rij kon niet worden toegepast. Referentie: {code}.',
  'import.error.alreadyApplied': 'Deze rij heeft al een concept gemaakt, dus is met rust gelaten.',
  'import.error.tooManyRows': 'Alleen de eerste {limit} rijen van een bestand worden gelezen.',
} as const;
