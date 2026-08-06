/** Composer: master draft, per target overrides, previews, validation, cost. */
export const composerMessages = {
  'composer.title': 'Composer',
  'composer.titleWithBrand': 'Verfassen Sie für {brand}',
  'composer.master.label': 'Masterentwurf',
  'composer.master.description':
    'Schreiben Sie einmal hier. Kompatible Änderungen erreichen jedes ausgewählte Ziel. Öffnen Sie ein Ziel, um eine Version zu schreiben, die nur dieses Konto erhält.',
  'composer.master.globalEdit': 'Globale Bearbeitung',
  'composer.master.placeholder': 'Was möchten Sie veröffentlichen?',
  'composer.brief.label': 'Briefing',
  'composer.brief.placeholder':
    'Beschreiben Sie die Idee, das Publikum und das gewünschte Ergebnis.',
  'composer.sources.label': 'Quellenangaben',
  'composer.sources.empty': 'Keine Quellen beigefügt.',
  'composer.campaign.label': 'Kampagne',
  'composer.campaign.none': 'Keine Kampagne',
  'composer.contentLocale.label': 'Inhaltssprache',
  'composer.contentLocale.help':
    'Die Sprache des Beitrags. Dies ist unabhängig von der Sprache Ihrer Benutzeroberfläche.',
  'composer.market.label': 'Publikumsmarkt',

  'composer.targets.title': 'Ziele',
  'composer.targets.count':
    '{count, plural, =0 {Keine Konten ausgewählt} one {# Konto} other {# Konten}}',
  'composer.targets.publishSummary':
    '{count, plural, one {Dies wird auf # Konto veröffentlicht} other {Dies wird auf # Konten veröffentlicht}} {when, select, now {jetzt} scheduled {zur geplanten Zeit} other {}}',
  'composer.targets.add': 'Konten hinzufügen',
  'composer.targets.empty': 'Wählen Sie mindestens ein Konto für die Veröffentlichung aus.',
  'composer.targets.state.ready': 'Bereit',
  'composer.targets.state.inherited': 'Vom Masterentwurf übernommen',
  'composer.targets.state.overridden': 'Überschrieben',
  'composer.targets.state.warning': 'Vor der Veröffentlichung prüfen',
  'composer.targets.state.error': 'Benötigt eine Lösung',
  'composer.targets.state.approvalNeeded': 'Genehmigung erforderlich',
  'composer.targets.overrideBadge': 'Überschreiben',
  'composer.targets.resetConfirm.title': 'Dieses Ziel auf den Masterentwurf zurücksetzen?',
  'composer.targets.resetConfirm.body':
    'Die Kopie, Medien und Einstellungen, die Sie für {account} geändert haben, werden durch den Masterentwurf ersetzt. Andere Ziele sind nicht betroffen.',
  'composer.targets.divergence':
    '{count, plural, one {# Ziel weicht vom Master-Entwurf ab} other {# Ziele weichen vom Master-Entwurf ab}}',

  'composer.applyToAll.title': 'Auf alle Ziele anwenden',
  'composer.applyToAll.compatible':
    '{count, plural, one {# Feld ist mit jedem ausgewählten Ziel kompatibel} other {# Felder sind mit jedem ausgewählten Ziel kompatibel}}',
  'composer.applyToAll.incompatible':
    '{count, plural, one {# Feld kann nicht angewendet werden und bleibt pro Ziel} other {# Felder können nicht angewendet werden und bleiben pro Ziel}}',
  'composer.applyToAll.creates':
    'Beim Anwenden wird für jedes Ziel eine explizite Version erstellt.',

  'composer.editor.label': 'Text posten',
  'composer.editor.characterCount': '{used} von {limit} Zeichen',
  'composer.editor.characterCountOver':
    '{over} Zeichen über der {limit} Zeichenbeschränkung liegen',
  'composer.editor.characterCountUnknown': 'Zeichenbeschränkung für dieses Konto nicht verfügbar',
  'composer.editor.remaining': '{count, plural, one {# Zeichen übrig} other {# Zeichen übrig}}',
  'composer.editor.hashtagCount': '{count, plural, one {# Hashtag} other {# Hashtags}}',
  'composer.editor.formatting': 'Formatierung',
  'composer.editor.emoji': 'Emoji',
  'composer.editor.mention': 'Erwähnen',
  'composer.editor.link': 'Link',

  'composer.mentions.search': 'Suchen Sie nach Personen, Seiten und Unternehmen',
  'composer.mentions.searching': 'Suche {provider}',
  'composer.mentions.resolved': 'Markiert mit {label} auf {provider}',
  'composer.mentions.unresolved':
    'Diese Erwähnung wurde noch keinem {provider}-Konto zugeordnet. Sie wird als Klartext veröffentlicht, bis Sie ein Ergebnis auswählen.',
  'composer.mentions.noResults': 'Keine übereinstimmenden Konten auf {provider}.',
  'composer.mentions.unsupported': 'Natives Tagging ist für dieses Konto nicht verfügbar.',

  'composer.destination.label': 'Ziel',
  'composer.destination.placeholder': 'Wählen Sie aus, wo dies veröffentlicht wird',
  'composer.destination.community': 'Gemeinschaft',
  'composer.destination.board': 'Pinnwand',
  'composer.destination.group': 'Gruppe',
  'composer.destination.page': 'Seite',
  'composer.destination.organization': 'Organisation',
  'composer.destination.channel': 'Kanal',
  'composer.destination.refresh': 'Ziele aktualisieren',
  'composer.destination.lastRefreshed': 'Ziele aktualisiert {relativeTime}',

  'composer.media.title': 'Medien',
  'composer.media.count': '{count, plural, one {# Datei} other {# Dateien}}',
  'composer.media.dropHint': 'Ziehen Sie Dateien hierher oder durchsuchen Sie Ihre Bibliothek.',
  'composer.media.inheritFromMaster': 'Verwendung des Mastermediums',
  'composer.media.overridden': 'Dieses Ziel verwendet seine eigenen Medien',
  'composer.media.altText.label': 'Alt-Text',
  'composer.media.altText.placeholder':
    'Beschreiben Sie das Bild für Personen, die einen Bildschirmleser verwenden.',
  'composer.media.altText.missing': 'Alt-Text fehlt.',
  'composer.media.altText.waive': 'Dieses Bild benötigt keinen Alternativtext',
  'composer.media.altText.generate': 'Schreiben Sie Alternativtext',
  'composer.media.crop': 'Zuschneiden',
  'composer.media.resize': 'Größe ändern',
  'composer.media.rotate': 'Drehen',
  'composer.media.compress': 'Komprimieren',
  'composer.media.convertFormat': 'Format konvertieren',
  'composer.media.thumbnail': 'Miniaturansicht',
  'composer.media.aspectPreset': 'Plattformvoreinstellung',
  'composer.media.original': 'Original',
  'composer.media.originalPreserved':
    'Die Originaldatei bleibt erhalten. Durch Bearbeitungen wird eine neue Version erstellt.',
  'composer.media.uploading': 'Hochladen von {name}',
  'composer.media.processing': 'Vorbereitung {name}',
  'composer.media.rights.label': 'Rechte und Einwilligung',
  'composer.media.rights.confirm':
    'Ich habe das Recht, dieses Medium zu veröffentlichen, einschließlich aller darin enthaltenen Personen, Musik, Logos und Marken.',

  'composer.sequence.title': 'Kommentare und Thread',
  'composer.sequence.root': 'Hauptbeitrag',
  'composer.sequence.item': 'Element {position}',
  'composer.sequence.add': 'Kommentar oder Thread-Element hinzufügen',
  'composer.sequence.delayLabel': 'Verzögerung nach dem vorherigen Element',
  'composer.sequence.delayImmediate': 'Sofort',
  'composer.sequence.delayMinutes': '{count, plural, one {# Minute} other {# Minuten}}',
  'composer.sequence.delayCustom': 'Benutzerdefinierte Verzögerung',
  'composer.sequence.accountLabel': 'Veröffentlichen Sie diesen Artikel als',
  'composer.sequence.unsupported': 'Dieses Konto unterstützt keine geplanten Folgeelemente.',

  'composer.repeat.title': 'Wiederholen',
  'composer.repeat.off': 'Nicht wiederholen',
  'composer.repeat.everyDays': '{count, plural, one {Jeden Tag} other {Alle # Tage}}',
  'composer.repeat.endLabel': 'Wiederholung beenden',
  'composer.repeat.endOnDate': 'An einem Datum',
  'composer.repeat.endAfterCount': 'Nach einer Anzahl von Beiträgen',
  'composer.repeat.endRequired': 'Wählen Sie ein Enddatum oder eine Anzahl von Wiederholungen.',
  'composer.repeat.summary':
    'Wiederholt {cadence} bis {end}. Jedes Vorkommnis erhält seine eigene Genehmigung und Quittung.',

  'composer.links.title': 'Links',
  'composer.links.keepOriginal': 'Behalten Sie die ursprüngliche URL bei',
  'composer.links.track': 'Durch einen nachverfolgten Kurzlink ersetzen',
  'composer.links.utm': 'UTM-Parameter',
  'composer.links.domain': 'Domain verlinken',
  'composer.links.finalUrl': 'Dies wird als {url} veröffentlicht.',
  'composer.links.frozenAtApproval':
    'Die genaue Kurz-URL und das Ziel werden in der genehmigten Version eingefroren.',

  'composer.signature.title': 'Unterschrift',
  'composer.signature.none': 'Keine Unterschrift',
  'composer.signature.autoApplied':
    'Die Signatur {name} wurde automatisch hinzugefügt. Sie können es ändern.',

  'composer.set.title': 'Sets',
  'composer.set.startFrom': 'Beginnen Sie mit einem Set',
  'composer.set.continueWithout': 'Fahren Sie ohne Set fort',
  'composer.set.applied': 'Set {name} angewendet. Dieser Entwurf ist nun unabhängig vom Set.',

  'composer.validation.title': 'Validierung',
  'composer.validation.clean': 'Für die ausgewählten Ziele wurden keine Probleme gefunden.',
  'composer.validation.issueCount':
    '{count, plural, one {# Problem} other {# Probleme}} über {targets, plural, one {# Ziel} other {# Ziele}}',
  'composer.validation.blocking': 'Dies muss vor der Planung behoben werden.',
  'composer.validation.warning': 'Überprüfen Sie dies vor der Veröffentlichung.',
  'composer.validation.revalidated':
    'Nochmals anhand der aktuellen Plattformgrenzen überprüft {relativeTime}.',

  'composer.preview.title': 'Vorschau',
  'composer.preview.forAccount': 'Vorschau für {account} auf {provider}',
  'composer.preview.approximate':
    'Diese Vorschau verwendet die von uns aufgezeichneten Plattformregeln. Der veröffentlichte Beitrag kann abweichen, wenn sich die Plattform ändert.',
  'composer.preview.unavailable': 'Eine echte Vorschau ist für dieses Konto noch nicht verfügbar.',

  'composer.cost.title': 'Geschätzte Anbieterkosten',
  'composer.cost.estimate': '{provider} schätzt die {amount} API-Nutzung für diesen Beitrag.',
  'composer.cost.linkSurcharge':
    '{provider} berechnet mehr für Beiträge, die eine URL enthalten. Das Entfernen des Links verringert die Schätzung.',
  'composer.cost.bulkWarning':
    '{count, plural, one {# Veröffentlichung} other {# Veröffentlichungen}} in einer Aktion. Überprüfen Sie den Kostenvoranschlag, bevor Sie fortfahren.',
  'composer.cost.reconciled':
    'Die tatsächliche Nutzung wird nach der Veröffentlichung abgeglichen.',
  'composer.cost.none': 'Für diesen Beitrag fallen keine Gebühren des Anbieters an.',

  'composer.autosave.saving': 'Wird gespeichert',
  'composer.autosave.saved': 'Gespeichert {relativeTime}',
  'composer.autosave.offline':
    'Offline. Ihr Entwurf wird auf diesem Gerät gespeichert und synchronisiert.',
  'composer.autosave.conflict':
    '{name} hat diesen Entwurf bearbeitet, während Sie geschrieben haben. Überprüfen Sie beide Versionen, bevor Sie sie speichern.',
  'composer.autosave.failed': 'Speichern nicht möglich. Ihr Text ist noch da. Erneut versuchen.',

  'composer.ai.title': 'Hilfe',
  'composer.ai.makeConcise': 'Machen Sie es prägnanter',
  'composer.ai.adaptForPlatform': 'Anpassen für {provider}',
  'composer.ai.transcreate': 'Transkreieren nach {language}',
  'composer.ai.checkClaims': 'Ansprüche prüfen',
  'composer.ai.writeAltText': 'Schreiben Sie Alternativtext',
  'composer.ai.suggestHooks': 'Einstiege vorschlagen',
  'composer.ai.suggestCta': 'Handlungsaufforderung vorschlagen',
  'composer.ai.diffTitle': 'Vorgeschlagene Änderung',
  'composer.ai.diffHelp': 'Es ändert sich nichts, bis Sie es akzeptieren.',
  'composer.ai.working': 'Wird erstellt',
  'composer.ai.sources':
    'Basierend auf {count, plural, one {# Quelle} other {# Quellen}}, die Sie genehmigt haben',
  'composer.ai.uncertain':
    'Dieser Satz hat in {language} kein klares Äquivalent. Überprüfen Sie es vor der Veröffentlichung mit einem Muttersprachler.',

  'composer.schedule.title': 'Zeitplan',
  'composer.schedule.dateLabel': 'Datum',
  'composer.schedule.timeLabel': 'Zeit',
  'composer.schedule.timeZoneLabel': 'Zeitzone',
  'composer.schedule.nextFreeSlot': 'Nächster freier Slot',
  'composer.schedule.localAndUtc': '{local} in {timeZone}. {utc} UTC.',
  'composer.schedule.dstWarning':
    'In {timeZone} wird die Uhr an diesem Datum umgestellt. Dieser Beitrag wird um {local}, also um {utc} UTC, veröffentlicht.',
  'composer.schedule.pastWarning':
    'Diese Uhrzeit liegt in der Vergangenheit. Wählen Sie eine spätere Uhrzeit.',
  'composer.schedule.confirmTitle': 'Bestätigen Sie dies vor der Planung',
  'composer.schedule.confirmPublishNow': 'Bestätigen Sie dies, bevor Sie es jetzt veröffentlichen',
  'composer.schedule.approverLabel': 'Genehmiger',
  'composer.schedule.policyLabel': 'Genehmigungsrichtlinie',
  'composer.schedule.duplicateWarning':
    'Ähnliche Inhalte wurden unter {account} {relativeTime} veröffentlicht. Eine erneute Veröffentlichung kann gegen die Plattformregeln für doppelte Inhalte verstoßen.',
  'composer.schedule.cadenceWarning':
    '{account} hat für diesen Tag bereits {count, plural, one {# Beitrag} other {# Beiträge}} geplant.',
} as const;
