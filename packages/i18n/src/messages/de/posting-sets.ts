export const postingSetMessages = {
  /* ------------------------------------------------------------- die Pause */
  'calendar.hold.action': 'Pausieren',
  'calendar.hold.resumeAction': 'Fortsetzen',
  'calendar.hold.badge': 'Pausiert',
  'calendar.hold.badgeBilling': 'Durch Abrechnung pausiert',
  'calendar.hold.term': 'Pause',
  'calendar.hold.byPerson': 'Von dir am {date} pausiert.',
  'calendar.hold.byBilling': 'Am {date} pausiert, weil dieser Workspace den vollen Zugriff verloren hat.',
  'calendar.hold.none': 'Nicht pausiert',

  'calendar.hold.confirmTitle': 'Diesen Beitrag pausieren?',
  'calendar.hold.confirmBody':
    'Dieser Beitrag bleibt, wo er ist, und geht nicht um {time} raus. Du kannst ihn jederzeit vorher fortsetzen, oder eine neue Uhrzeit wählen, falls diese schon vergangen ist.',
  'calendar.hold.confirmScope':
    'Pausieren stoppt, was noch nicht passiert ist. Alles, was bereits auf einer Plattform veröffentlicht wurde, bleibt veröffentlicht, und Pausieren löscht oder bearbeitet es nicht.',
  'calendar.hold.confirmNoteLabel': 'Warum pausierst du das? (optional)',
  'calendar.hold.confirmNoteHint':
    'Wird im Prüfprotokoll deines Teams festgehalten. Wird an keine Plattform gesendet.',
  'calendar.hold.confirm': 'Diesen Beitrag pausieren',
  'calendar.hold.cancel': 'Geplant lassen',

  'calendar.hold.resumeTitle': 'Diesen Beitrag fortsetzen?',
  'calendar.hold.resumeBody': 'Er geht um {time} raus, in {timeZone}.',
  'calendar.hold.resumeMissedTitle': 'Diese Uhrzeit ist vergangen',
  'calendar.hold.resumeMissedBody':
    'Dieser Beitrag war für {time} fällig, während er pausiert war. Wähle eine neue Uhrzeit, damit er nicht im Moment des Fortsetzens rausgeht.',
  'calendar.hold.resumeTimeLabel': 'Neue Veröffentlichungszeit',
  'calendar.hold.resumeConfirm': 'Fortsetzen',

  'calendar.hold.paused': 'Pausiert. Geht nicht raus, bis du fortsetzt.',
  'calendar.hold.resumed': 'Fortgesetzt. Geht um {time} raus.',

  'calendar.hold.blocked.published':
    'Dieser Beitrag ist schon raus. Pausieren kann ihn nicht von der Plattform zurückholen.',
  'calendar.hold.blocked.inFlight':
    'Dieser Beitrag wird gerade gesendet. Es ist zu spät, ihn zu pausieren, und ein Abbruch mittendrin könnte ihn nur teilweise veröffentlicht lassen.',
  'calendar.hold.blocked.finished': 'Dieser Beitrag ist bereits abgeschlossen, es gibt also nichts zu pausieren.',
  'calendar.hold.blocked.billing':
    'Dieser Beitrag ist in Pause, weil der Workspace den vollen Zugriff verloren hat. Ihn fortzusetzen ist eine Abrechnungsfrage, keine Planungsfrage.',
  'calendar.hold.blocked.billingAction': 'Zur Abrechnung',

  /* ------------------------------------------------------- posting sets */
  'set.title': 'Posting Sets',
  'set.lede':
    'Eine gespeicherte Antwort auf "wem poste ich das, und wie". Ein Set anzuwenden kopiert seine Einstellungen in einen neuen Entwurf.',
  'set.appliedOnce':
    'Ein Set wird einmal gelesen, wenn du es anwendest. Es später zu bearbeiten ändert, womit der nächste Beitrag startet. Entwürfe und geplante Beiträge, die du bereits daraus erstellt hast, bleiben genau, wie sie sind.',
  'set.empty.title': 'Noch keine Sets',
  'set.empty.body': 'Erstelle eines, damit du nicht bei jedem Beitrag dieselbe Kontoliste neu aufbauen musst.',
  'set.create': 'Neues Set',
  'set.edit': 'Set bearbeiten',
  'set.archive': 'Set archivieren',
  'set.archived': 'Archiviert',
  'set.archivedNote': 'Archivierte Sets sind in der Auswahl ausgeblendet. Beiträge, die daraus erstellt wurden, bleiben unverändert.',
  'set.showArchived': 'Archivierte anzeigen',
  'set.saved': 'Set gespeichert.',
  'set.archivedToast': 'Set archiviert. Bereits daraus erstellte Beiträge bleiben unverändert.',

  'set.field.name': 'Name',
  'set.field.nameHint': 'Wonach du in der Auswahl suchen wirst. Eines pro Projekt.',
  'set.field.description': 'Beschreibung',
  'set.field.descriptionHint': 'Optional. Wofür dieses Set gedacht ist.',
  'set.field.targets': 'Konten',
  'set.field.targetsHint': 'Jedes Konto, mit dem ein aus diesem Set erstellter Beitrag startet.',
  'set.field.targetCount': '{count, plural, =0 {Keine Konten} one {# Konto} other {# Konten}}',
  'set.field.signature': 'Signatur',
  'set.field.signatureNone': 'Keine Signatur',
  'set.field.approval': 'Genehmigung',
  'set.field.approvalHint': 'Die Genehmigung, die ein aus diesem Set erstellter Beitrag vor der Veröffentlichung braucht.',
  'set.field.schedule': 'Wann veröffentlichen',

  'set.approval.none': 'Keine Genehmigung nötig',
  'set.approval.single_approver': 'Ein benannter Genehmiger',
  'set.approval.any_approver': 'Beliebiger Genehmiger',
  'set.approval.named_approver': 'Ein bestimmter Genehmiger',
  'set.approval.policy_auto': 'Was die Workspace-Richtlinie sagt',

  'set.slot.next_free_slot': 'Nächster freier Slot aus der Warteschlange',
  'set.slot.next_free_slotHint':
    'Nutzt die Warteschlangenregeln dieses Projekts, um eine Uhrzeit anzubieten. Sie schlägt vor; du akzeptierst.',
  'set.slot.pick_time': 'Frag mich nach einer Uhrzeit',
  'set.slot.pick_timeHint': 'Das Set anzuwenden lässt die Uhrzeit leer, damit du sie wählst.',
  'set.slot.draft_only': 'Als Entwurf belassen',
  'set.slot.draft_onlyHint': 'Das Set anzuwenden rührt den Zeitplan überhaupt nicht an.',
  'set.slot.noRules':
    'Dieses Projekt hat noch keine Warteschlangenregeln, also bietet die Warteschlange die erste freie Stunde an und sagt das auch.',
  'set.slot.rulesLink': 'Warteschlangenregeln',

  'set.defaults.title': 'Standardwerte pro Plattform',
  'set.defaults.body':
    'Ausgangswerte, die in jeden neuen Beitrag kopiert werden. Du kannst jeden davon im Composer danach ändern.',
  'set.defaults.add': 'Plattform hinzufügen',
  'set.defaults.remove': 'Standardwerte für {platform} entfernen',
  'set.defaults.privacy': 'Datenschutz',
  'set.defaults.privacyNone': 'Plattformstandard',
  'set.defaults.bodyPrefix': 'Text vor dem Beitrag',
  'set.defaults.bodySuffix': 'Text nach dem Beitrag',
  'set.defaults.requireAltText': 'Alt-Text bei jedem Bild verlangen',
  'set.defaults.requireAltTextHint':
    'Ein aus diesem Set erstellter Beitrag kann für diese Plattform erst geplant werden, wenn jedes Bild einen Alt-Text hat.',
  'set.defaults.empty': 'Keine Standardwerte pro Plattform. Jedes Konto startet vom Hauptbeitrag.',

  'set.error.nameTaken': 'Ein anderes Set in diesem Projekt verwendet diesen Namen bereits.',
  'set.error.archived': 'Dieses Set ist archiviert. Stelle es vor der Bearbeitung wieder her.',
  'set.error.duplicateTarget': 'Dieses Konto ist bereits in diesem Set.',
  'set.error.duplicatePlatform': 'Dieses Set hat für diese Plattform bereits Standardwerte.',

  /* --------------------------------------------------- gespeicherte Ziele */
  'targetMemory.setting.title': 'Konten zwischen Beiträgen merken',
  'targetMemory.setting.body':
    'Wenn dies eingeschaltet ist, startet der Composer jeden neuen Beitrag mit den Konten, die diese Person zuletzt in diesem Projekt gewählt hat. Es ist ausgeschaltet, solange du es nicht einschaltest.',
  'targetMemory.setting.stored':
    'Nur die Kontoliste wird gespeichert, und nur für die Person, die sie gewählt hat. Keine Beschriftung, keine Uhrzeit, keine Datenschutzeinstellung und kein Genehmigungsstatus wird gespeichert, und niemand sonst im Projekt kann deine Liste sehen.',
  'targetMemory.setting.offNote': 'Solange dies ausgeschaltet ist, wird nichts gespeichert.',
  'targetMemory.setting.turnOffWarning':
    'Dies auszuschalten löscht jede gespeicherte Auswahl in diesem Projekt, für alle.',
  'targetMemory.setting.enabled': 'An',
  'targetMemory.setting.disabled': 'Aus',
  'targetMemory.setting.saved': 'Einstellung gespeichert.',
  'targetMemory.setting.cleared': 'Einstellung gespeichert. Gespeicherte Auswahlen in diesem Projekt wurden gelöscht.',

  'targetMemory.composer.restored':
    '{count, plural, one {Mit # Konto von letztem Mal gestartet.} other {Mit # Konten von letztem Mal gestartet.}}',
  'targetMemory.composer.droppedSome':
    '{count, plural, one {# Konto, das du letztes Mal verwendet hast, wurde ausgelassen, weil es Aufmerksamkeit braucht.} other {# Konten, die du letztes Mal verwendet hast, wurden ausgelassen, weil sie Aufmerksamkeit brauchen.}}',
  'targetMemory.composer.droppedAll':
    'Keines der Konten, die du letztes Mal verwendet hast, ist gerade verfügbar, also wurde nichts vorausgewählt.',
  'targetMemory.composer.undo': 'Auswahl löschen',
  'targetMemory.composer.forget': 'Meine Konten nicht mehr merken',
  'targetMemory.composer.forgotten': 'Deine gespeicherte Auswahl wurde gelöscht.',
  'targetMemory.composer.reviewAccounts': 'Konten überprüfen',
} as const;
