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
  'composerWeb.pane.targets': 'Zielkonten und Sets',
  'composerWeb.pane.master': 'Master-Entwurf und gemeinsame Einstellungen',
  'composerWeb.pane.variant': 'Version für das offene Target',
  'composerWeb.pane.review': 'Vorschau, Validierung, Kosten und Genehmigung',
  'composerWeb.pane.showPreview': 'Vorschau anzeigen',
  'composerWeb.pane.hidePreview': 'Vorschau ausblenden',
  'composerWeb.pane.previewCollapsed':
    'Das Vorschaufenster ist ausgeblendet. Öffnen Sie es, um den letzten Beitrag zu überprüfen.',

  'composerWeb.step.targets': 'Ziele',
  'composerWeb.step.write': 'Schreiben',
  'composerWeb.step.perTarget': 'Pro Ziel',
  'composerWeb.step.review': 'Rezension',
  'composerWeb.step.progress': 'Schritt {current} von {total}',
  'composerWeb.step.legend': 'Komponistenschritte',

  'composerWeb.summary.label': 'Entwurf einer Zusammenfassung',
  'composerWeb.summary.targets': '{count, plural, =0 {Keine Ziele} one {# Ziel} other {# Ziele}}',
  'composerWeb.summary.issues':
    '{count, plural, =0 {Keine Probleme} one {# Problem} other {# Probleme}}',
  'composerWeb.summary.notScheduled': 'Kein Zeitpunkt gewählt',
  'composerWeb.summary.scheduledFor': '{time}',
  'composerWeb.summary.costUnknown': 'Kosten noch nicht festgesetzt',
  'composerWeb.summary.openReview': 'Rezension öffnen',

  // ---------------------------------------------------------------- rail
  'composerWeb.rail.masterEntry': 'Masterentwurf',
  'composerWeb.rail.masterHint': 'Bearbeiten Sie hier, um jedes Ziel zu erreichen, das noch erbt.',
  'composerWeb.rail.accountsHeading': 'Zielkonten',
  'composerWeb.rail.setsHeading': 'Sets und Gruppen',
  'composerWeb.rail.setsHelp':
    'Ein Set ist eine gespeicherte Gruppe von Konten und Standardeinstellungen. Durch Anwenden werden die Werte in diesen Entwurf kopiert. Spätere Änderungen am Set ändern diesen Entwurf nicht.',
  'composerWeb.rail.openTarget': 'Öffnen Sie die Version für {account}',
  'composerWeb.rail.counter': '{used}/{limit}',
  'composerWeb.rail.counterUnknown': 'Limit unbekannt',
  'composerWeb.rail.mediaCounter':
    '{count, plural, =0 {keine Medien} one {# Mediendatei} other {# Mediendateien}}',
  'composerWeb.rail.paused':
    'Angehalten. Die Veröffentlichung erfolgt erst, wenn Sie sie fortsetzen.',
  'composerWeb.rail.state.notBuilt': 'Noch nicht gebaut',
  'composerWeb.rail.state.unsupported': 'Anbieter unterstützt nicht',
  'composerWeb.rail.empty': 'Noch keine Konten ausgewählt.',
  'composerWeb.rail.emptyHelp':
    'Wählen Sie die Konten aus, die dieser Beitrag erreichen soll. Sie können später weitere hinzufügen.',
  'composerWeb.rail.divergenceHint':
    'Öffnen Sie ein Ziel, um seine eigene Version anzuzeigen. Der Masterentwurf ist unverändert.',
  'composerWeb.rail.searchLabel': 'Konten filtern',
  'composerWeb.rail.removeTarget': 'Entfernen Sie {account}',

  // ---------------------------------------------------------- global edit
  'composerWeb.globalEdit.open': 'Globale Bearbeitung',
  'composerWeb.globalEdit.title': 'Wenden Sie diese Änderung auf jedes ausgewählte Ziel an',
  'composerWeb.globalEdit.description':
    'Der Masterentwurf ändert sich ständig. Ziele, die dieses Feld noch erben, folgen ihm. Ziele mit eigener Version behalten diese.',
  'composerWeb.globalEdit.fieldLabel': 'Feld',
  'composerWeb.globalEdit.compatibleHeading': 'Diese Ziele nehmen die Veränderung an',
  'composerWeb.globalEdit.keepsOverrideHeading': 'Diese Ziele behalten ihre eigene Version',
  'composerWeb.globalEdit.incompatibleHeading': 'Diese Ziele können die Änderung nicht annehmen',
  'composerWeb.globalEdit.incompatibleHelp':
    'Nichts wird fallen gelassen, ohne es Ihnen mitzuteilen. Jedes Konto unten erhält eine explizite Version mit der angepassten Änderung, die Sie anschließend bearbeiten können.',
  'composerWeb.globalEdit.reason.textTooLong':
    '{account} erlaubt {limit}-Zeichen. Dieser Text ist {actual}.',
  'composerWeb.globalEdit.reason.linkNotAllowed':
    '{account} akzeptiert keinen Link in diesem Feld. Der Link bleibt im Master-Entwurf und in den Zielen, die ihn zulassen.',
  'composerWeb.globalEdit.reason.mediaCountExceeded':
    '{account} akzeptiert {limit, plural, one {# Datei} other {# Dateien}}. Dieser Entwurf hat {actual}.',
  'composerWeb.globalEdit.reason.mediaKindUnsupported':
    '{account} akzeptiert keine {mimeType}-Dateien.',
  'composerWeb.globalEdit.reason.threadUnsupported':
    '{account} unterstützt keine Folgeelemente, sodass die Sequenz im Masterentwurf verbleibt.',
  'composerWeb.globalEdit.reason.markdownUnsupported':
    '{account} veröffentlicht Klartext. Die Formatierungszeichen würden als Zeichen erscheinen.',
  'composerWeb.globalEdit.adaptedPreview': 'Was {account} stattdessen bekommt',
  'composerWeb.globalEdit.confirm': 'Wenden Sie die Versionen an und erstellen Sie sie',
  'composerWeb.globalEdit.nothingToApply':
    'Es ändert sich nichts. Der Masterentwurf hat diesen Wert bereits.',
  'composerWeb.globalEdit.announced':
    '{applied, plural, one {Änderung auf # Ziel angewendet} other {Änderung auf # Ziele angewendet}}. {adapted, plural, =0 {Kein Ziel benötigte eine angepasste Version} one {# Ziel hat eine angepasste Version} other {# Ziele haben angepasste Versionen}}.',

  // ------------------------------------------------------------- override
  'composerWeb.override.heading': 'Dieses Ziel hat eine eigene Version',
  'composerWeb.override.fieldsChanged':
    '{count, plural, one {# Feld weicht vom Master-Entwurf ab} other {# Felder weichen vom Master-Entwurf ab}}',
  'composerWeb.override.field.body': 'Text posten',
  'composerWeb.override.field.contentKind': 'Beitragstyp',
  'composerWeb.override.field.locale': 'Inhaltssprache',
  'composerWeb.override.field.mediaIds': 'Medien',
  'composerWeb.override.field.links': 'Links',
  'composerWeb.override.field.signature': 'Unterschrift',
  'composerWeb.override.field.threadItems': 'Kommentare und Thread',
  'composerWeb.override.field.schedule': 'Zeitplan',
  'composerWeb.override.resetField': 'Setzen Sie {field} auf Master zurück',
  'composerWeb.override.resetFieldTitle': '{field} für {account} zurücksetzen?',
  'composerWeb.override.resetFieldBody':
    'Die für {account} geschriebene Version von {field} wird verworfen und der Masterentwurf wird erneut verwendet. Keine weiteren Zieländerungen.',
  'composerWeb.override.resetAll': 'Setzen Sie jedes Feld auf Master zurück',
  'composerWeb.override.inheritNotice':
    'Dieses Ziel folgt dem Masterentwurf. Wenn Sie hier etwas bearbeiten, wird eine Version erstellt, die nur {account} erhält.',
  'composerWeb.override.created': '{account} hat jetzt sein eigenes {field}.',

  // --------------------------------------------------------------- limits
  'composerWeb.limits.heading': 'Grenzwerte für {account}',
  'composerWeb.limits.text': 'Text mit bis zu {limit} Zeichen',
  'composerWeb.limits.linkCost':
    'Ein Link zählt unabhängig von seiner Länge als {count, plural, one {# Zeichen} other {# Zeichen}}.',
  'composerWeb.limits.images':
    '{count, plural, =0 {Keine Bilder} one {# Bild} other {bis zu # Bilder}}',
  'composerWeb.limits.videos':
    '{count, plural, =0 {Kein Video} one {# Video} other {bis zu # Videos}}',
  'composerWeb.limits.duration': 'Video bis {duration}',
  'composerWeb.limits.aspect': 'Seitenverhältnis zwischen {min} und {max}',
  'composerWeb.limits.fileSize': 'Dateien bis {size}',
  'composerWeb.limits.mimeTypes': 'Akzeptierte Dateitypen: {types}',
  'composerWeb.limits.source':
    'Lesen Sie im Funktions-Snapshot {version} den Eintrag {relativeTime}.',
  'composerWeb.limits.thumbnailRequired': 'Eine Miniaturansicht ist erforderlich.',

  // --------------------------------------------------------- native fields
  'composerWeb.native.heading': '{provider}-Einstellungen',
  'composerWeb.native.privacy': 'Wer kann das sehen?',
  'composerWeb.native.privacyChoose': 'Wählen Sie eine Zielgruppe',
  'composerWeb.native.privacyExplicit':
    '{provider} lässt keine vorab ausgewählte Zielgruppe zu. Wählen Sie eine aus, bevor dies geplant werden kann.',
  'composerWeb.native.community': 'Gemeinschaft',
  'composerWeb.native.board': 'Vorstand',
  'composerWeb.native.group': 'Gruppe oder Seite',
  'composerWeb.native.organization': 'Organisation',
  'composerWeb.native.channel': 'Kanal',
  'composerWeb.native.publication': 'Veröffentlichung',
  'composerWeb.native.disclosureHeading': 'Offenlegung',
  'composerWeb.native.disclosureCommercial':
    'Dieser Beitrag bewirbt ein Produkt oder eine Dienstleistung',
  'composerWeb.native.disclosureBranded':
    'Bei diesem Beitrag handelt es sich um Markeninhalt für ein anderes Unternehmen',
  'composerWeb.native.disclosureAi': 'Einige dieser Inhalte wurden mit einem KI-Tool erstellt',
  'composerWeb.native.disclosureUnsupported':
    '{provider} bietet diese Offenlegung nicht über seine API an. Fügen Sie es stattdessen in den Text ein.',
  'composerWeb.native.none': 'Für diesen Beitragstyp gelten keine {provider}-Einstellungen.',

  // ---------------------------------------------------- entity resolution
  'composerWeb.entity.resolvedHeading': 'Gelöst am {provider}',
  'composerWeb.entity.resolvedId': 'Konto-ID {externalId}',
  'composerWeb.entity.plainTextWarning':
    'Nicht übereinstimmend. Es wird als einfacher Text veröffentlicht, der kein natives Tag auf {provider} ist.',
  'composerWeb.entity.removeMention': 'Entfernen Sie die Erwähnung von {label}',
  'composerWeb.entity.addMention': 'Fügen Sie eine Erwähnung hinzu',
  'composerWeb.entity.mentionCount':
    '{count, plural, =0 {Keine Erwähnungen} one {# Erwähnungen} other {# Erwähnungen}}, {resolved} stimmte mit einem echten Konto überein',
  'composerWeb.entity.lookupUnsupported':
    '{provider} bietet für diesen Kontotyp keine Entitätssuche an.',
  'composerWeb.entity.lookupNotBuilt':
    'Relay hat noch keine Entitätssuche für {provider} erstellt. In der Zwischenzeit wird nichts erraten.',
  'composerWeb.entity.searchHint':
    'Geben Sie mindestens zwei Zeichen ein und wählen Sie dann ein Ergebnis aus.',
  'composerWeb.entity.resultCount':
    '{count, plural, =0 {Keine Übereinstimmungen} one {# Übereinstimmung} other {# Übereinstimmungen}}',

  // ---------------------------------------------------------------- links
  'composerWeb.links.heading': 'Links',
  'composerWeb.links.detected':
    '{count, plural, one {# Link in diesem Entwurf gefunden} other {# Links in diesem Entwurf gefunden}}',
  'composerWeb.links.noneDetected': 'In diesem Entwurf gibt es noch keine Links.',
  'composerWeb.links.modeLabel': 'Wie dieser Link veröffentlicht wird',
  'composerWeb.links.original': 'Ursprüngliche URL',
  'composerWeb.links.utmSource': 'Quelle',
  'composerWeb.links.utmMedium': 'Mittel',
  'composerWeb.links.utmCampaign': 'Kampagne',
  'composerWeb.links.utmTerm': 'Begriff',
  'composerWeb.links.utmContent': 'Inhalt',
  'composerWeb.links.domainVerified': '{domain}, für diesen Arbeitsbereich überprüft',
  'composerWeb.links.domainDefault': 'Relay-Standarddomäne',
  'composerWeb.links.domainNone': 'Es ist noch keine Markendomain verifiziert.',
  'composerWeb.links.notAllowedHere': '{account} erlaubt hier keinen Link.',

  // ------------------------------------------------------------- sequence
  'composerWeb.sequence.kindComment': 'Kommentar',
  'composerWeb.sequence.kindThread': 'Gewindeteil',
  'composerWeb.sequence.kindLabel': 'Artikeltyp',
  'composerWeb.sequence.moveUp': 'Verschieben Sie dieses Element früher',
  'composerWeb.sequence.moveDown': 'Verschieben Sie dieses Element später',
  'composerWeb.sequence.remove': 'Entfernen Sie dieses Element',
  'composerWeb.sequence.absoluteTime': 'Läuft bei {time}, also {utc} UTC.',
  'composerWeb.sequence.partialFailure':
    'Wenn ein Element fehlschlägt, bleibt der bereits veröffentlichte Beitrag veröffentlicht und die folgenden Elemente werden nicht ausgeführt. Sie erhalten ein Aktionselement.',
  'composerWeb.sequence.maxReached':
    '{account} akzeptiert {limit, plural, one {# Folgeelement} other {# Folgeelement}}.',
  'composerWeb.sequence.minDelay':
    'Die kürzeste Verzögerung, die {provider} hier zulässt, ist {duration}.',
  'composerWeb.sequence.inheritAuthor': 'Gleiches Konto wie der Beitrag',
  'composerWeb.sequence.itemIssues':
    '{count, plural, =0 {Keine Probleme} one {# Problem} other {# Probleme}} für diesen Artikel',
  'composerWeb.sequence.customMinutes': 'Minuten nach dem vorherigen Element',

  // --------------------------------------------------------------- repeat
  'composerWeb.repeat.enable': 'Wiederholen Sie diesen Beitrag',
  'composerWeb.repeat.cadenceLabel': 'Wie oft',
  'composerWeb.repeat.maximum':
    'Ein sich wiederholender Beitrag kann höchstens {limit} Mal ausgeführt werden.',
  'composerWeb.repeat.occurrenceLabel': 'Anzahl der Beiträge',
  'composerWeb.repeat.duplicateCheck':
    'Jedes Vorkommen wird vor der Veröffentlichung auf doppelten Inhalt überprüft. Ein Vorkommen, das die Prüfung nicht besteht, wird zu einem Aktionselement und nicht veröffentlicht.',
  'composerWeb.repeat.occurrenceList': 'Erste Vorkommnisse',
  'composerWeb.repeat.occurrenceMore':
    '{count, plural, one {und # weitere Vorkommen} other {und # weitere Vorkommen}}',

  // ------------------------------------------------------ sets, signature
  'composerWeb.set.heading': 'Sets und Signatur',
  'composerWeb.set.pickerTitle': 'Beginnen Sie mit einem Set',
  'composerWeb.set.pickerDescription':
    'Ein Set füllt Ziele, Text und Einstellungen aus. Der erstellte Entwurf ist unabhängig, sodass sich durch eine spätere Bearbeitung des Sets nie ein genehmigter oder geplanter Beitrag ändert.',
  'composerWeb.set.accountCount': '{count, plural, one {# Konto} other {# Konten}}',
  'composerWeb.set.apply': 'Verwenden Sie dieses Set',
  'composerWeb.set.none': 'Noch keine Sets gespeichert.',
  'composerWeb.signature.pickerLabel': 'Unterschrift',
  'composerWeb.signature.scope': 'Für {brand} auf {provider} in {language}',
  'composerWeb.signature.previewHeading': 'Wie es den Beitrag beendet',
  'composerWeb.signature.notMatching':
    'Diese Signatur bezieht sich auf eine andere Marke, Plattform oder Sprache und wird daher hier nicht angeboten.',

  // --------------------------------------------------------------- assist
  'composerWeb.assist.menuLabel': 'Helfen Sie mit diesem Text',
  'composerWeb.assist.unavailableTitle': 'Die Textunterstützung ist nicht konfiguriert',
  'composerWeb.assist.unavailableBody':
    'Für diesen Arbeitsbereich ist kein KI-Gateway eingerichtet, daher sind die Hilfsaktionen deaktiviert. Alles andere im Composer funktioniert normal.',
  'composerWeb.assist.targetLabel': 'Gilt für',
  'composerWeb.assist.targetMaster': 'Der Masterentwurf',
  'composerWeb.assist.targetVariant': 'Die Version für {account}',
  'composerWeb.assist.beforeLabel': 'Aktueller Text',
  'composerWeb.assist.afterLabel': 'Vorgeschlagener Text',
  'composerWeb.assist.regionLabel': 'Vorgeschlagene Textänderung, noch nicht angewendet',
  'composerWeb.assist.added': 'hinzugefügt',
  'composerWeb.assist.removed': 'entfernt',
  'composerWeb.assist.evidence': 'Beweise und Quellen',
  'composerWeb.assist.claimChecked': '{claim}',
  'composerWeb.assist.claimUnverified':
    'Für diese Behauptung wurde keine Quelle gefunden. Überprüfen Sie es vor der Veröffentlichung.',
  'composerWeb.assist.failed':
    'Die Unterstützungsanforderung wurde nicht abgeschlossen. Ihr Text bleibt unverändert.',
  'composerWeb.assist.noMediaGeneration':
    'Relay erstellt keine Bilder oder Videos. Bringen Sie fertige Dateien in die Bibliothek und veröffentlichen Sie sie hier.',

  // ------------------------------------------------------------- autosave
  'composerWeb.autosave.pinned':
    'Dies ist die genehmigte Version. Durch die Bearbeitung wird eine neue Version erstellt und die Genehmigung gelöscht.',
  'composerWeb.autosave.pinnedAcknowledge': 'Bearbeiten und löschen Sie die Genehmigung',
  'composerWeb.autosave.conflictTitle': 'Zwei Versionen dieses Entwurfs',
  'composerWeb.autosave.conflictKeepMine': 'Behalten Sie, was ich geschrieben habe',
  'composerWeb.autosave.conflictKeepTheirs': 'Verwenden Sie die Version von {name}',
  'composerWeb.autosave.conflictHelp':
    'Nichts wird automatisch zusammengeführt. Wählen Sie pro Feld aus und speichern Sie es.',
  'composerWeb.autosave.retry': 'Versuchen Sie erneut zu speichern',

  // ------------------------------------------------------------ shortcuts
  'composerWeb.shortcuts.title': 'Komponisten-Verknüpfungen',
  'composerWeb.shortcuts.nextTarget': 'Nächstes Ziel',
  'composerWeb.shortcuts.previousTarget': 'Vorheriges Ziel',
  'composerWeb.shortcuts.nextIssue': 'Nächste Ausgabe',
  'composerWeb.shortcuts.previousIssue': 'Vorherige Ausgabe',
  'composerWeb.shortcuts.save': 'Entwurf jetzt speichern',
  'composerWeb.shortcuts.openSchedule': 'Öffnen Sie das Zeitplanblatt',
  'composerWeb.shortcuts.open': 'Verknüpfungen anzeigen',

  // --------------------------------------------------------------- review
  'composerWeb.review.heading': 'Rezension',
  'composerWeb.review.contentVersion': 'Inhaltsversion {checksum}',
  'composerWeb.review.approvalPolicy': 'Richtlinie: {policy}',
  'composerWeb.review.approverPending': 'Warten auf eine Entscheidung von {approver}.',
  'composerWeb.review.approverNone': 'Für diese Ziele ist keine Genehmigung erforderlich.',
  'composerWeb.review.perTargetHeading': 'Was jedes Konto erhält',
  'composerWeb.review.finalUrl': 'Veröffentlichter Link',
  'composerWeb.review.privacyState': 'Zielgruppe: {value}',
  'composerWeb.review.disclosureState': 'Offenlegung: {value}',
  'composerWeb.review.disclosureNone': 'Keine Offenlegung festgelegt',
  'composerWeb.review.mediaVersion': '{name}, Version {version}',
  'composerWeb.review.blocked':
    '{count, plural, one {# Ziel kann noch nicht geplant werden} other {# Ziele können noch nicht geplant werden}}',
  'composerWeb.review.offlineBlocked':
    'Planung und Veröffentlichung benötigen eine Verbindung. Ihr Entwurf ist auf diesem Gerät sicher.',
  'composerWeb.review.publishConfirm':
    'Dies wird sofort auf {count, plural, one {# Konto} other {# Konten}} veröffentlicht. Es kann von hier aus nicht rückgängig gemacht werden.',

  // ------------------------------------------------------------ page-level
  'composerWeb.page.newDraft': 'Neuer Entwurf',
  'composerWeb.page.loading': 'Laden des Entwurfs, seiner Ziele und deren Grenzen',
  'composerWeb.page.errorTitle': 'Dieser Entwurf konnte nicht geöffnet werden',
  'composerWeb.page.errorBody':
    'Nichts ging verloren. Versuchen Sie es erneut. Wenn dies weiterhin fehlschlägt, hilft die unten stehende Referenz dem Support dabei, die Anfrage zu finden.',
  'composerWeb.page.noConnectionsTitle': 'Verbinden Sie ein Konto, bevor Sie verfassen',
  'composerWeb.page.noConnectionsBody':
    'Für einen Entwurf ist mindestens ein verbundenes Konto erforderlich, damit Relay die Grenzen, die Vorschau und die anzuzeigenden Einstellungen kennt.',
  'composerWeb.page.noConnectionsExample':
    'Beispiel: Wenn X und LinkedIn verbunden sind, werden aus einem Entwurf zwei native Versionen mit eigenen Zählern.',
  'composerWeb.page.permissionTitle':
    'In diesem Arbeitsbereich können Sie keine Beiträge erstellen',
  'composerWeb.page.permissionBody':
    'Für das Verfassen ist die Editor-Rolle oder höher erforderlich. Ein Eigentümer oder Administrator kann Ihre Rolle ändern.',
  'composerWeb.page.rateLimitTitle': 'Zu viele Draft-Speicherungen in kurzer Zeit',
  'composerWeb.page.rateLimitCause':
    'Dieser Arbeitsbereich hat sein Schreiblimit für das aktuelle Fenster erreicht. Ihr Text wird währenddessen auf diesem Gerät gespeichert.',
  'composerWeb.page.rateLimitAlternative':
    'Schreiben Sie weiter. Der Speichervorgang wird automatisch fortgesetzt, wenn das Fenster zurückgesetzt wird.',

  // ==================================================== media library ====
  'mediaLib.view.grid': 'Gitter',
  'mediaLib.view.list': 'Liste',
  'mediaLib.view.label': 'Layout',
  'mediaLib.sort.label': 'Sortieren',
  'mediaLib.sort.newest': 'Das Neueste zuerst',
  'mediaLib.sort.name': 'Name',
  'mediaLib.sort.size': 'Das Größte zuerst',
  'mediaLib.select': 'Wählen Sie {name}',
  'mediaLib.column.file': 'Datei',
  'mediaLib.column.type': 'Typ',
  'mediaLib.column.size': 'Größe',
  'mediaLib.column.altText': 'Alt-Text',
  'mediaLib.column.rights': 'Rechte',
  'mediaLib.column.added': 'Hinzugefügt',
  'mediaLib.openDetail': 'Öffnen Sie {name}',

  'mediaLib.empty.title': 'Noch keine Medien',
  'mediaLib.empty.body':
    'Laden Sie die Bilder und Videos hoch, die Sie bereits haben, oder importieren Sie eine Datei von einer URL. Relay prüft Typ und Größe anhand jedes Kontos, in dem Sie veröffentlichen.',
  'mediaLib.empty.example':
    'Beispiel: launch_hero.jpg, 1600 x 900, Alt-Text festgelegt, in 2 Beiträgen verwendet.',
  'mediaLib.error.title': 'Die Bibliothek konnte nicht geladen werden',
  'mediaLib.error.body': 'Ihre Dateien sind sicher. Durch diesen Fehler hat sich nichts geändert.',
  'mediaLib.loading': 'Laden Ihrer Medienbibliothek',
  'mediaLib.permission.title': 'Sie können diese Arbeitsbereichsbibliothek nicht sehen',
  'mediaLib.permission.body':
    'Für das Ansehen von Medien ist die Zuschauerrolle oder höher für diese Marke erforderlich. Ein Eigentümer oder Administrator kann es gewähren.',

  'mediaLib.upload.heading': 'Medien hinzufügen',
  'mediaLib.upload.browse': 'Wählen Sie Dateien aus',
  'mediaLib.upload.dropHint':
    'Ziehen Sie Dateien hierher oder wählen Sie sie aus. Der Upload wird fortgesetzt, wenn die Verbindung unterbrochen wird.',
  'mediaLib.upload.queueHeading': 'Uploads',
  'mediaLib.upload.progress': '{name}, {percent} oder {size} gesendet',
  'mediaLib.upload.paused': 'Angehalten. {sent} von {size} ist bereits gespeichert.',
  'mediaLib.upload.resume': 'Setzen Sie den Upload fort',
  'mediaLib.upload.pause': 'Hochladen pausieren',
  'mediaLib.upload.cancel': 'Brechen Sie diesen Upload ab',
  'mediaLib.upload.retry': 'Versuchen Sie diesen Upload erneut',
  'mediaLib.upload.finalizing': 'Beenden von {name}',
  'mediaLib.upload.done': '{name} befindet sich in Ihrer Bibliothek',
  'mediaLib.upload.failed': '{name} wurde nicht beendet. {reason}',
  'mediaLib.upload.offline':
    'Offline. Wenn Sie die Verbindung wiederherstellen, werden die Uploads an der Stelle fortgesetzt, an der sie gestoppt wurden.',
  'mediaLib.upload.rejectedType':
    '{name} ist {mimeType}, was keines Ihrer ausgewählten Konten akzeptiert.',
  'mediaLib.upload.rejectedSize':
    '{name} ist {size}. Das niedrigste Limit für Ihre Konten ist {limit}.',
  'mediaLib.upload.acceptedBy':
    '{count, plural, one {Akzeptiert von # Ihrer Konten} other {Akzeptiert von # Ihrer Konten}}',
  'mediaLib.upload.rejectedBy': 'Nicht akzeptiert von {accounts}',
  'mediaLib.upload.checkedAgainst': 'Mit den in diesem Entwurf ausgewählten Konten abgeglichen.',
  'mediaLib.upload.noTargets':
    'Da keine Konten ausgewählt sind, wird die Datei nur mit den Standardeinstellungen des Arbeitsbereichs verglichen.',

  'mediaLib.alt.heading': 'Alt-Text',
  'mediaLib.alt.help':
    'Beschreiben Sie, worauf es im Bild für jemanden ankommt, der es nicht sehen kann. Ein oder zwei Sätze reichen normalerweise aus.',
  'mediaLib.alt.count': '{used} von {limit} Zeichen',
  'mediaLib.alt.requiredBy': 'Erforderlich für {accounts}',
  'mediaLib.alt.waive': 'Dieses Bild enthält keine Informationen',
  'mediaLib.alt.waiveReason': 'Warum es keiner Beschreibung bedarf',
  'mediaLib.alt.waiveHelp':
    'Verwenden Sie dies nur zur Dekoration. Ein Bild, auf das verzichtet wurde, wird mit einer leeren Beschreibung veröffentlicht, sofern die Plattform dies zulässt.',
  'mediaLib.alt.waived': 'Von {name} auf {date} verzichtet. Grund: {reason}',
  'mediaLib.alt.unsupported':
    '{provider} akzeptiert über seine API für dieses Konto keinen Alternativtext.',
  'mediaLib.alt.missingCount':
    '{count, plural, one {# Datei hat keinen Alternativtext} other {# Dateien haben keinen Alternativtext}}',

  'mediaLib.rights.heading': 'Rechte und Einwilligung',
  'mediaLib.rights.declared': 'Deklariert von {name} auf {date}',
  'mediaLib.rights.undeclared':
    'Noch nicht deklariert. Deklarieren Sie es, bevor diese Datei veröffentlicht wird.',
  'mediaLib.rights.ownerLabel': 'Wem gehört diese Datei?',
  'mediaLib.rights.ownerSelf': 'Dieser Arbeitsbereich',
  'mediaLib.rights.ownerLicensed': 'Von jemand anderem lizenziert',
  'mediaLib.rights.ownerUgc': 'Ein Kunde oder Ersteller hat die Erlaubnis gegeben',
  'mediaLib.rights.licenseLabel': 'Lizenz- oder Berechtigungsreferenz',
  'mediaLib.rights.peopleLabel': 'In dieser Datei werden Personen angezeigt',
  'mediaLib.rights.peopleConsent':
    'Alle gezeigten Personen haben einer Veröffentlichung zugestimmt',
  'mediaLib.rights.musicLabel': 'Diese Datei enthält Musik oder einen Soundtrack',
  'mediaLib.rights.confirm':
    'Ich habe das Recht, diese Datei zu veröffentlichen, einschließlich aller darin enthaltenen Personen, Musik, Logos und Marken.',
  'mediaLib.rights.blocking':
    'Diese Datei kann erst eingeplant werden, wenn die Rechte deklariert sind.',

  'mediaLib.editor.heading': 'Bild bearbeiten',
  'mediaLib.editor.description':
    'Jede Bearbeitung wird als neue Version gespeichert. Die Originaldatei bleibt erhalten und kann wiederhergestellt werden.',
  'mediaLib.editor.tab.crop': 'Zuschneiden',
  'mediaLib.editor.tab.transform': 'Größe ändern und drehen',
  'mediaLib.editor.tab.canvas': 'Leinwand',
  'mediaLib.editor.tab.output': 'Format und Größe',
  'mediaLib.editor.tab.thumbnail': 'Miniaturansicht',
  'mediaLib.editor.presetLabel': 'Seitenverhältnis voreingestellt',
  'mediaLib.editor.presetFree': 'Kostenlos',
  'mediaLib.editor.presetFor': '{ratio}, verwendet von {accounts}',
  'mediaLib.editor.cropX': 'Von der Startkante aus zuschneiden',
  'mediaLib.editor.cropY': 'Von oben zuschneiden',
  'mediaLib.editor.cropWidth': 'Beschnittbreite',
  'mediaLib.editor.cropHeight': 'Erntehöhe',
  'mediaLib.editor.cropKeyboardHint':
    'Das Zuschneidefeld ist mit Zahlenfeldern ausgestattet, sodass es vollständig über die Tastatur funktioniert.',
  'mediaLib.editor.widthLabel': 'Breite in Pixel',
  'mediaLib.editor.heightLabel': 'Höhe in Pixel',
  'mediaLib.editor.lockRatio': 'Behalten Sie das aktuelle Verhältnis bei',
  'mediaLib.editor.rotateLabel': 'Drehung',
  'mediaLib.editor.rotateDegrees': '{degrees} Grad',
  'mediaLib.editor.flipHorizontal': 'Über die vertikale Achse spiegeln',
  'mediaLib.editor.flipVertical': 'Über die horizontale Achse spiegeln',
  'mediaLib.editor.canvasColor': 'Hintergrundfarbe',
  'mediaLib.editor.canvasFit': 'Wie das Bild auf der Leinwand sitzt',
  'mediaLib.editor.canvasFitCover': 'Füllen Sie die Leinwand und schneiden Sie den Überlauf ab',
  'mediaLib.editor.canvasFitContain': 'Passen Sie das gesamte Bild an und füllen Sie den Rest auf',
  'mediaLib.editor.formatLabel': 'Ausgabeformat',
  'mediaLib.editor.qualityLabel': 'Komprimierungsqualität',
  'mediaLib.editor.qualityValue': '{value} von 100',
  'mediaLib.editor.estimatedSize': 'Geschätzte Ausgabe {size}, von {original}',
  'mediaLib.editor.estimatedSizeUnknown':
    'Die Ausgabegröße ist erst bekannt, wenn die Datei verarbeitet wird.',
  'mediaLib.editor.thumbnailHelp':
    'Wählen Sie das Bild oder die Datei aus, die als Video-Miniaturansicht verwendet wird und von der Plattform akzeptiert wird.',
  'mediaLib.editor.thumbnailFrame': 'Rahmen bei {time}',
  'mediaLib.editor.save': 'Als neue Version speichern',
  'mediaLib.editor.saving': 'Version {version} wird gespeichert',
  'mediaLib.editor.saved': 'Version {version} gespeichert. Das Original ist noch hier.',
  'mediaLib.editor.discard': 'Verwerfen Sie diese Änderungen',
  'mediaLib.editor.noChanges': 'Es sind noch keine Änderungen zum Speichern vorhanden.',
  'mediaLib.editor.revalidate':
    'Beim Speichern wird diese Datei erneut mit allen Konten in den Entwürfen verglichen, die sie verwenden.',
  'mediaLib.editor.noGeneration':
    'Dieser Editor ändert die von Ihnen hochgeladene Datei. Es entstehen keine neuen Bilder.',

  'mediaLib.versions.heading': 'Versionen',
  'mediaLib.versions.original': 'Original-Upload',
  'mediaLib.versions.current': 'Aktuelle Version',
  'mediaLib.versions.restore': 'Version {version} wiederherstellen',
  'mediaLib.versions.item': 'Version {version}, {dimensions}, {size}, {date}',

  'mediaLib.provenance.heading': 'Woher diese Datei stammt',
  'mediaLib.provenance.sourceUrl': 'Quell-URL',
  'mediaLib.provenance.fetchedAt': '{date} abgerufen',
  'mediaLib.provenance.declaredAuthor': 'Angegebener Autor',
  'mediaLib.provenance.declaredLicense': 'Angegebene Lizenz',
  'mediaLib.provenance.contentCredentials': 'Anmeldeinformationen für eingebettete Inhalte',
  'mediaLib.provenance.contentCredentialsNone':
    'Diese Datei enthält keine Anmeldeinformationen für eingebettete Inhalte. Das kommt häufig vor und bedeutet nicht, dass etwas nicht stimmt.',
  'mediaLib.provenance.unverified':
    'Diese Angaben stammen von der Quelle, nicht von Relay. Überprüfen Sie sie, bevor Sie sich auf sie verlassen.',

  'mediaLib.picker.title': 'Wählen Sie Medien',
  'mediaLib.picker.description':
    'Dateien werden mit den in diesem Entwurf ausgewählten Konten verglichen.',
  'mediaLib.picker.confirm':
    '{count, plural, =0 {Dateien auswählen} one {# Datei hinzufügen} other {# Dateien hinzufügen}}',
  'mediaLib.picker.forMaster': 'Ergänzung zum Master-Entwurf',
  'mediaLib.picker.forVariant': 'Ergänzung zur Version nur für {account}',
} as const;
