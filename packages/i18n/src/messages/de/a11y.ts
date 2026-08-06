/**
 * Screen reader announcements and accessible names.
 *
 * These are read aloud, not shown. Keep them short, factual and in the order a
 * listener needs them. Live region announcements must not repeat decoration.
 */
export const a11yMessages = {
  'a11y.region.navigation': 'Primäre Navigation',
  'a11y.region.main': 'Hauptinhalt',
  'a11y.region.composer': 'Komponist',
  'a11y.region.preview': 'Vorschau',
  'a11y.region.validation': 'Validierungsprobleme',
  'a11y.region.targets': 'Zielkonten',
  'a11y.region.notifications': 'Benachrichtigungen',

  'a11y.announce.saved': 'Entwurf gespeichert',
  'a11y.announce.saving': 'Entwurf speichern',
  'a11y.announce.saveFailed': 'Entwurf konnte nicht gespeichert werden. Dein Text ist noch da.',
  'a11y.announce.offline': 'Du bist offline. Änderungen werden auf diesem Gerät gespeichert.',
  'a11y.announce.online': 'Wieder online',
  'a11y.announce.validationCount':
    '{count, plural, =0 {Keine Validierungsprobleme} one {# Validierungsproblem} other {# Validierungsprobleme}}',
  'a11y.announce.validationCleared': 'Alle Validierungsprobleme behoben',
  'a11y.announce.targetSelected':
    '{account} ausgewählt. {count, plural, one {# Ziel} other {# Ziele}} insgesamt.',
  'a11y.announce.targetOverridden': '{account} hat jetzt eine eigene Version',
  'a11y.announce.targetReset': '{account} auf den Master-Entwurf zurückgesetzt',
  'a11y.announce.uploadProgress': '{name}, {percent} hochgeladen',
  'a11y.announce.uploadComplete': '{name} hochgeladen',
  'a11y.announce.uploadFailed': '{name} konnte nicht hochgeladen werden',
  'a11y.announce.scheduled': 'Geplant für {time} in {timeZone}',
  'a11y.announce.rescheduled': 'Verschoben nach {time} in {timeZone}',
  'a11y.announce.publishing': 'Veröffentlichung',
  'a11y.announce.published':
    '{count, plural, one {Veröffentlicht auf # Konto} other {Veröffentlicht auf # Konten}}',
  'a11y.announce.publishPartial':
    'Veröffentlicht auf {published} von {total} Konten. {failed, plural, one {# Konto benötigt Aufmerksamkeit} other {# Konten erfordern Aufmerksamkeit}}.',
  'a11y.announce.publishFailed':
    'Die Veröffentlichung ist fehlgeschlagen. Ihr Inhalt bleibt erhalten.',
  'a11y.announce.approvalRequested': 'Genehmigung angefordert von {approver}',
  'a11y.announce.approved': 'Genehmigt',
  'a11y.announce.connectionAdded': '{account} verbunden',
  'a11y.announce.connectionRemoved': '{account} nicht verbunden',
  'a11y.announce.filterApplied':
    '{count, plural, =0 {Filter gelöscht} one {# Filter angewendet} other {# Filter angewendet}}, {results, plural, one {# Ergebnis} other {# Ergebnisse}}',
  'a11y.announce.pageChanged': '{title}',
  'a11y.announce.copiedToClipboard': 'In die Zwischenablage kopiert',
  'a11y.announce.suggestionApplied': 'Vorschlag angewendet',
  'a11y.announce.suggestionRejected': 'Vorschlag abgelehnt',

  'a11y.label.closeDialog': 'Dialog schließen',
  'a11y.label.openMenu': 'Menü öffnen',
  'a11y.label.sortBy': 'Sortieren nach {field}',
  'a11y.label.sortAscending': 'Aufsteigend sortiert',
  'a11y.label.sortDescending': 'Absteigend sortiert',
  'a11y.label.removeTarget': 'Entfernen Sie {account} von den Zielen',
  'a11y.label.removeMedia': '{name} entfernen',
  'a11y.label.editAltText': 'Alternativtext für {name} bearbeiten',
  'a11y.label.mediaPreview': 'Vorschau von {name}',
  'a11y.label.playVideo': 'Spielen Sie {name}',
  'a11y.label.pauseVideo': 'Pause {name}',
  'a11y.label.calendarCell':
    '{date}, {count, plural, =0 {nichts geplant} one {# Beitrag} other {# Beiträge}}',
  'a11y.label.postSummary': '{account} auf {provider}, {state}, {time}',
  'a11y.label.characterCount': '{used} von {limit} Zeichen verwendet',
  'a11y.label.requiredField': 'Erforderlich',
  'a11y.label.externalLink': 'Öffnet in einem neuen Tab',
  'a11y.label.loadingRegion': 'Inhalt wird geladen',
  'a11y.label.expandRow': 'Details anzeigen für {name}',
  'a11y.label.collapseRow': 'Details für {name} ausblenden',
  'a11y.languagePicker.label': 'Wählen Sie die Sprache der Benutzeroberfläche',
  'a11y.languagePicker.filterLabel': 'Sprachen filtern',
  'a11y.languagePicker.announceChanged':
    'Die Sprache der Benutzeroberfläche wurde in {language} geändert.',

  'a11y.keyboard.hint.calendar':
    'Verwenden Sie die Pfeiltasten, um zwischen den Slots zu wechseln. Drücken Sie die Eingabetaste, um einen Beitrag zu öffnen. Drücken Sie die Leertaste und dann die Pfeiltasten, um den Termin neu zu planen.',
  'a11y.keyboard.hint.composer':
    'Drücken Sie die Strg-Taste und die Klammertasten, um zwischen den Zielen zu wechseln. Drücken Sie Strg und I, um zur nächsten Ausgabe zu gelangen.',
  'a11y.keyboard.hint.dialog': 'Drücken Sie zum Schließen die Escape-Taste.',
  'a11y.keyboard.shortcutsTitle': 'Tastaturkürzel',

  'a11y.table.alternative': 'Tabellenansicht',
  'a11y.table.alternativeHint': 'Der gleiche Zeitplan wie eine sortierbare Tabelle.',
  'a11y.motion.reduced': 'Animationen werden aufgrund Ihrer Systemeinstellung reduziert.',
} as const;
