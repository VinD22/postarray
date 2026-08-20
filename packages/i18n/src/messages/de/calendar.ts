/** Calendar, queue, action center and approvals. */
export const calendarMessages = {
  'calendar.title': 'Kalender',
  'calendar.view.day': 'Tag',
  'calendar.view.week': 'Woche',
  'calendar.view.month': 'Monat',
  'calendar.view.list': 'Liste',
  'calendar.view.label': 'Kalenderansicht',
  'calendar.today': 'Heute',
  'calendar.goToDate': 'Zu einem Datum wechseln',
  'calendar.previousPeriod': 'Vorheriger Zeitraum',
  'calendar.nextPeriod': 'Nächste Periode',
  'calendar.timeZoneNote': 'Die Zeiten werden in {timeZone} angezeigt.',
  'calendar.weekOf': 'Woche von {date}',
  'calendar.dayHeading': '{weekday}, {date}',
  'calendar.slotCount': '{count, plural, =0 {Nichts geplant} one {# Beitrag} other {# Beiträge}}',
  'calendar.slotOverflow': '{count, plural, one {# mehr} other {# mehr}}',
  'calendar.newPostAt': 'Neuer Beitrag um {time}',

  'calendar.filter.project': 'Marke',
  'calendar.filter.account': 'Konto',
  'calendar.filter.platform': 'Plattform',
  'calendar.filter.status': 'Status',
  'calendar.filter.locale': 'Inhaltssprache',
  'calendar.filter.campaign': 'Kampagne',
  'calendar.filter.applied':
    '{count, plural, one {# Filter angewendet} other {# Filter angewendet}}',

  'calendar.drag.instructions':
    'Ziehen Sie einen Beitrag auf einen neuen Slot oder wählen Sie ihn aus und verschieben Sie ihn mit den Pfeiltasten.',
  'calendar.drag.confirmTitle': 'Diesen Beitrag verschieben?',
  'calendar.drag.confirmBody': 'Von {from} bis {to} in {timeZone}.',
  'calendar.drag.dstNotice':
    'Zwischen diesen Zeiten wird die Uhr in {timeZone} umgestellt. Die neue Uhrzeit ist {utc} UTC.',
  'calendar.drag.publishedNotice':
    'Dieser Beitrag ist bereits veröffentlicht. Durch Verschieben wird nur der lokale Datensatz geändert. Das erneute Veröffentlichen ist eine separate Aktion.',
  'calendar.drag.conflictNotice':
    '{account} hat bereits {count, plural, one {# Beitrag} other {# Beiträge}} innerhalb einer Stunde nach der neuen Uhrzeit.',

  'calendar.queue.title': 'Warteschlange',
  'calendar.queue.upcoming': 'Demnächst',
  'calendar.queue.needsApproval': 'Warten auf Genehmigung',
  'calendar.queue.drafts': 'Entwürfe',
  'calendar.queue.published': 'Veröffentlicht',
  'calendar.queue.failed': 'Fehlgeschlagen',
  'calendar.queue.nextSlot': 'Der nächste freie Slot ist {time}.',

  'calendar.post.publishesAt': 'Veröffentlicht {time} in {timeZone}',
  'calendar.post.publishedAt': 'Veröffentlicht {time}',
  'calendar.post.targetCount': '{count, plural, one {# Konto} other {# Konten}}',
  'calendar.post.mediaType.text': 'Text',
  'calendar.post.mediaType.image': 'Bild',
  'calendar.post.mediaType.carousel': 'Karussell',
  'calendar.post.mediaType.video': 'Video',
  'calendar.post.mediaType.document': 'Dokument',

  'actionCenter.title': 'Action Center',
  'actionCenter.description':
    'Alles, was eine Entscheidung oder eine Lösung erfordert, in einer Warteschlange.',
  'actionCenter.empty': 'Im Moment braucht nichts Aufmerksamkeit.',
  'actionCenter.item.connectionExpiring':
    '{account} muss vor {date} erneut verbunden werden, sonst schlagen geplante Beiträge fehl.',
  'actionCenter.item.connectionActionRequired':
    '{account} benötigt Aufmerksamkeit auf {provider}, bevor es erneut veröffentlicht werden kann.',
  'actionCenter.item.validationFailed':
    'Ein Entwurf für {account} besteht die Validierung von {provider} nicht.',
  'actionCenter.item.approvalOverdue': 'Eine Genehmigungsanfrage wartet seit {date}.',
  'actionCenter.item.scheduleConflict':
    '{account} hat Beiträge, die nahe beieinander auf {date} geplant sind.',
  'actionCenter.item.providerIncident':
    '{provider} meldet ein Problem. Geplante Beiträge werden erneut versucht.',
  'actionCenter.item.commentFailed':
    'Der Hauptbeitrag wurde veröffentlicht, aber ein Folgeeintrag für {account} ist fehlgeschlagen.',
  'actionCenter.item.analyticsStale':
    'Die Analysen für {account} wurden seit {date} nicht aktualisiert.',
  'actionCenter.item.rssStalled':
    'Der Feed {name} hat seit {date} kein gültiges Element zurückgegeben.',
  'actionCenter.item.webhookFailing':
    'Lieferungen an {endpoint} sind {count, plural, one {# Mal} other {# Mal}} in Folge fehlgeschlagen.',
  'actionCenter.item.usageBalance':
    'Eine gemessene Aktion für {provider} benötigt einen Nutzungsausgleich, bevor sie ausgeführt werden kann.',

  'approval.title': 'Genehmigungen',
  'approval.requestTitle': 'Genehmigungsanfrage',
  'approval.requestedBy': 'Angefordert von {name} {relativeTime}',
  'approval.requestedFrom': 'Warten auf {name}',
  'approval.policy.none': 'Für diese Ziele ist keine Genehmigung erforderlich.',
  'approval.policy.anyApprover': 'Jeder Genehmiger kann dies genehmigen.',
  'approval.policy.namedApprover': '{name} muss dies genehmigen.',
  'approval.policy.everyApprover': 'Jeder Genehmiger muss dies genehmigen.',
  'approval.decision.approvedBy': 'Genehmigt von {name} am {date}',
  'approval.decision.rejectedBy': 'Abgelehnt von {name} am {date}',
  'approval.decision.changesRequestedBy': 'Änderungen angefordert von {name} am {date}',
  'approval.comment.label': 'Hinweis für den Autor',
  'approval.comment.placeholder': 'Sagen Sie, was sich ändern muss und warum.',
  'approval.reapproval.needed':
    'Dieser Beitrag wurde nach der Genehmigung geändert. Bevor er veröffentlicht werden kann, muss er erneut genehmigt werden.',
  'approval.reapproval.reason.content': 'Der Inhalt hat sich geändert.',
  'approval.reapproval.reason.account': 'Die Zielkonten haben sich geändert.',
  'approval.reapproval.reason.media': 'Die Medien wurden geändert.',
  'approval.reapproval.reason.schedule': 'Die Veröffentlichungszeit wurde geändert.',
  'approval.reapproval.reason.privacy':
    'Die Datenschutz- oder Offenlegungseinstellungen wurden geändert.',
  'approval.reapproval.reason.locale': 'Die Inhaltssprache hat sich geändert.',
  'approval.expiresAt': 'Diese Anfrage läuft am {date} ab.',
} as const;
