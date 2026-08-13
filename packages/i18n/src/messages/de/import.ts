export const importMessages = {
  'import.title': 'Beiträge aus einer CSV importieren',
  'import.subtitle':
    'Lade eine Tabelle hoch, sieh, was sie tun wird, dann entscheide. Der Upload prüft nur die Datei. Er erstellt nichts.',

  'import.step.upload': 'Hochladen',
  'import.step.columns': 'Spalten',
  'import.step.review': 'Überprüfen',
  'import.step.apply': 'Anwenden',
  'import.step.results': 'Ergebnisse',
  'import.step.position': 'Schritt {current} von {total}',

  'import.upload.heading': 'Wähle eine CSV-Datei',
  'import.upload.help':
    'Nur CSV. Tabellenkalkulationsdateien wie .xlsx werden nicht gelesen. Exportiere deine Tabelle zuerst als CSV.',
  'import.upload.field': 'CSV-Datei',
  'import.upload.fieldHelp': 'Wähle eine Datei aus, oder füge die Zeilen in das Feld unten ein.',
  'import.upload.paste': 'Oder CSV-Text einfügen',
  'import.upload.pasteHelp': 'Füge die Kopfzeile mit ein. Alles wird geprüft, bevor irgendetwas erstellt wird.',
  'import.upload.project': 'Projekt',
  'import.upload.projectHelp': 'Jede Zeile in einer Datei gehört zu diesem Projekt.',
  'import.upload.submit': 'Diese Datei prüfen',
  'import.upload.submitting': 'Datei wird gelesen',
  'import.upload.allowPast': 'Bereits vergangene Zeiten zulassen',
  'import.upload.allowPastHelp':
    'Standardmäßig aus. Eine Zeile mit einem Datum in der Vergangenheit wird gemeldet, damit du sie korrigieren kannst, statt für dich verschoben zu werden.',
  'import.upload.tooLarge': 'Diese Datei ist größer als {limit} Zeichen. Teile sie und versuche es erneut.',
  'import.upload.duplicate':
    'Das ist dieselbe Datei, die du zuvor hochgeladen hast, du siehst also diesen Import statt einer zweiten Kopie davon.',

  'import.template.heading': 'Was die Spalten bedeuten',
  'import.template.download': 'CSV-Vorlage herunterladen',
  'import.template.required': 'Erforderliche Spalten',
  'import.template.optional': 'Optionale Spalten',
  'import.column.external_row_id': 'Deine eigene ID für die Zeile. Muss innerhalb der Datei eindeutig sein.',
  'import.column.project': 'Der Projektname oder die ID, zu der die Zeile gehört.',
  'import.column.targets':
    'Entweder set: gefolgt von einer Konten-Set-ID, oder Konto-IDs getrennt durch einen senkrechten Strich.',
  'import.column.caption': 'Der Beitragstext.',
  'import.column.scheduled_local_time': 'Lokales Datum und Uhrzeit, geschrieben als 2026-09-01T10:00.',
  'import.column.time_zone': 'Die IANA-Zone, in der diese Ortszeit gelesen wird, zum Beispiel Europe/Berlin.',
  'import.column.media':
    'Eine Medien-ID, sha256: gefolgt von der Prüfsumme eines Mediums, das du bereits hast, oder eine https-Adresse, die der Server abrufen soll.',
  'import.column.title': 'Ein Titel, wo das Ziel einen verwendet.',
  'import.column.destination': 'Die Seite, Pinnwand oder der Kanal innerhalb des Kontos.',
  'import.column.privacy': 'Der Datenschutzwert, den das Ziel erwartet.',
  'import.column.first_comment': 'Text, der als erster Kommentar nach dem Beitrag veröffentlicht wird.',
  'import.column.approval_policy': 'Die Genehmigungsrichtlinie, die jedem Entwurf zugeordnet wird.',
  'import.column.perPlatform':
    'Eine caption_- oder title_-Spalte mit dem Namen einer Plattform überschreibt nur diese Plattform, zum Beispiel caption_instagram.',

  'import.columns.heading': 'Spaltenprüfung',
  'import.columns.ok': 'Jede erforderliche Spalte ist vorhanden.',
  'import.columns.missing':
    '{count, plural, one {# erforderliche Spalte fehlt} other {# erforderliche Spalten fehlen}}',
  'import.columns.unknown':
    '{count, plural, one {# Spalte wurde nicht erkannt und wird ignoriert} other {# Spalten wurden nicht erkannt und werden ignoriert}}',
  'import.columns.present': 'Gefundene Spalten',

  'import.review.heading': 'Was diese Datei tun wird',
  'import.review.counts':
    '{valid, plural, =0 {Keine Zeile ist bereit} one {# Zeile ist bereit} other {# Zeilen sind bereit}}, {invalid, plural, =0 {keine braucht Aufmerksamkeit} one {# braucht Aufmerksamkeit} other {# brauchen Aufmerksamkeit}}.',
  'import.review.empty': 'Aus dieser Datei wurden keine Zeilen gelesen.',
  'import.review.rowsHeading': 'Zeilen',
  'import.review.filterAll': 'Alle Zeilen',
  'import.review.filterValid': 'Bereit',
  'import.review.filterInvalid': 'Braucht Aufmerksamkeit',
  'import.review.filterFailed': 'Fehlgeschlagen',
  'import.review.downloadErrors': 'Probleme als CSV herunterladen',
  'import.review.parsedWith': 'Gelesen mit Parser {version}',

  'import.table.row': 'Zeilen-ID',
  'import.table.line': 'Zeile',
  'import.table.state': 'Status',
  'import.table.caption': 'Beschriftung',
  'import.table.time': 'Geplant',
  'import.table.problems': 'Probleme',
  'import.table.draft': 'Entwurf',
  'import.table.noProblems': 'Keine',

  'import.state.pending': 'Nicht geprüft',
  'import.state.valid': 'Bereit',
  'import.state.invalid': 'Braucht Aufmerksamkeit',
  'import.state.applied': 'Entwurf erstellt',
  'import.state.skipped': 'Bereits erledigt',
  'import.state.failed': 'Fehlgeschlagen',

  'import.job.state.uploaded': 'Hochgeladen',
  'import.job.state.validating': 'Wird geprüft',
  'import.job.state.validated': 'Geprüft',
  'import.job.state.applying': 'Wird angewendet',
  'import.job.state.applied': 'Angewendet',
  'import.job.state.failed': 'Konnte nicht gelesen werden',

  'import.apply.heading': 'Was soll mit den fertigen Zeilen passieren?',
  'import.apply.drafts': 'Entwürfe erstellen',
  'import.apply.draftsHelp':
    'Der Standard. Jede fertige Zeile wird zu einem Entwurf, den du öffnen, bearbeiten und genehmigen kannst. Nichts wird geplant.',
  'import.apply.scheduled': 'Entwürfe erstellen und planen',
  'import.apply.scheduledHelp':
    'Jede fertige Zeile wird zu einem Entwurf und übernimmt die in der Datei geschriebene Uhrzeit. Wähle das nur, wenn die Uhrzeiten stimmen.',
  'import.apply.confirm': '{count, plural, one {# Zeile} other {# Zeilen}} anwenden',
  'import.apply.confirmScheduled':
    '{count, plural, one {# Zeile} other {# Zeilen}} erstellen und planen',
  'import.apply.running': 'Zeilen werden angewendet',
  'import.apply.safeToRepeat':
    'Zweimal anwenden ist sicher. Eine Zeile, die bereits einen Entwurf erstellt hat, wird in Ruhe gelassen.',

  'import.results.heading': 'Ergebnisse',
  'import.results.applied': '{count, plural, one {# Entwurf erstellt} other {# Entwürfe erstellt}}',
  'import.results.skipped':
    '{count, plural, one {# Zeile war bereits erledigt} other {# Zeilen waren bereits erledigt}}',
  'import.results.failed': '{count, plural, one {# Zeile ist fehlgeschlagen} other {# Zeilen sind fehlgeschlagen}}',
  'import.results.retry': 'Verbleibende Zeilen erneut anwenden',
  'import.results.openDrafts': 'Entwürfe öffnen',
  'import.results.unavailable': 'nicht verfügbar',

  'import.history.heading': 'Frühere Importe',
  'import.history.empty': 'Noch keine Importe.',
  'import.history.open': 'Öffnen',

  'import.a11y.rowsTable': 'Manifestzeilen und ihre Probleme',
  'import.a11y.stepList': 'Importschritte',
  'import.a11y.uploadedFile': 'Ausgewählte Datei: {filename}',

  'import.error.emptyFile': 'Diese Datei hat keine Zeilen.',
  'import.error.missingColumn': 'Die Spalte {column} fehlt.',
  'import.error.unknownColumn': 'Die Spalte {column} wurde nicht erkannt und wird daher ignoriert.',
  'import.error.duplicateRowId': 'Die Zeilen-ID {value} wird in dieser Datei mehr als einmal verwendet.',
  'import.error.required': 'Diese Zelle darf nicht leer sein.',
  'import.error.invalidCell': 'Diese Zelle hat kein lesbares Format.',
  'import.error.rowShape': 'Diese Zeile hat {actual} Zellen, aber der Kopf hat {expected}.',
  'import.error.invalidLocalTime':
    'Die Zeit {value} ist kein lokales Datum mit Uhrzeit wie 2026-09-01T10:00.',
  'import.error.invalidTimeZone': 'Die Zone {value} ist kein IANA-Zeitzonenname.',
  'import.error.nonexistentLocalTime':
    'Die Zeit {value} existiert in {zone} nicht. Die Uhren springen darüber hinweg.',
  'import.error.ambiguousLocalTime':
    'Die Zeit {value} kommt in {zone} an diesem Tag zweimal vor. Wähle eine andere Uhrzeit.',
  'import.error.scheduleInPast': 'Die Zeit {value} in {zone} ist bereits vergangen.',
  'import.error.invalidTargets':
    'Der Wert {value} ist weder ein gespeichertes Konten-Set noch eine Liste von Konto-IDs.',
  'import.error.invalidMedia':
    'Der Wert {value} ist weder eine Medien-ID, eine sha256-Prüfsumme noch eine https-Adresse.',
  'import.error.mediaNotFound': 'Kein Medium in diesem Workspace stimmt mit {value} überein.',
  'import.error.mediaImportStarted':
    'Das Medium bei {value} wird abgerufen. Wende diese Datei erneut an, sobald es in der Bibliothek ist.',
  'import.error.unknownVariantTarget':
    'Diese Zeile hat kein {provider}-Konto, also wurde die {provider}-Beschriftung nicht verwendet.',
  'import.error.applyFailed': 'Diese Zeile konnte nicht angewendet werden. Referenz: {code}.',
  'import.error.alreadyApplied': 'Diese Zeile hat bereits einen Entwurf erstellt und wurde daher in Ruhe gelassen.',
  'import.error.tooManyRows': 'Es werden nur die ersten {limit} Zeilen einer Datei gelesen.',
} as const;
