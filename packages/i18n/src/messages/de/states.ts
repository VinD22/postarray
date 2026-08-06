/**
 * The fifteen publish states and the approval states.
 *
 * `state.<state>.label` is the short badge. `state.<state>.description` is the
 * sentence shown next to it. A state never relies on colour alone.
 */
export const stateMessages = {
  'state.draft.label': 'Entwurf',
  'state.draft.description':
    'Nur Personen in diesem Arbeitsbereich können es sehen. Es ist nichts geplant.',
  'state.validation_needed.label': 'Validierung erforderlich',
  'state.validation_needed.description':
    'Bei einem oder mehreren Zielen liegt ein Problem vor, das behoben werden muss, bevor dies geplant werden kann.',
  'state.approval_requested.label': 'Genehmigung beantragt',
  'state.approval_requested.description': 'Warten auf die Entscheidung von {approver}.',
  'state.approved.label': 'Genehmigt',
  'state.approved.description':
    'Genehmigt von {approver}. Es kann nun geplant oder veröffentlicht werden.',
  'state.scheduled.label': 'Geplant',
  'state.scheduled.description': 'Veröffentlicht {time} in {timeZone}.',
  'state.preparing_media.label': 'Medien vorbereiten',
  'state.preparing_media.description': 'Hochladen und Konvertieren von Dateien für die Plattform.',
  'state.dispatching.label': 'Versand',
  'state.dispatching.description': 'Jetzt an {provider} senden.',
  'state.provider_processing.label': 'Verarbeitung durch den Anbieter',
  'state.provider_processing.description':
    '{provider} hat den Upload akzeptiert und verarbeitet ihn noch. Wir bestätigen, wann es live ist.',
  'state.published.label': 'Veröffentlicht',
  'state.published.description': 'Live auf {provider} seit {time}.',
  'state.partially_published.label': 'Teilweise veröffentlicht',
  'state.partially_published.description':
    '{published, plural, one {# Ziel veröffentlicht} other {# Ziele veröffentlicht}}, {failed, plural, one {# fehlgeschlagen} other {# fehlgeschlagen}}. Die veröffentlichten Beiträge sind live und wurden nicht zurückgesetzt.',
  'state.action_required.label': 'Aktion erforderlich',
  'state.action_required.description': 'Dies kann nicht so weitergehen, bis Sie etwas tun.',
  'state.retry_scheduled.label': 'Wiederholung geplant',
  'state.retry_scheduled.description':
    'Der Versuch {attempt} von {max} wird bei {time} ausgeführt. Nichts wird dupliziert.',
  'state.failed_permanently.label': 'Fehlgeschlagen',
  'state.failed_permanently.description':
    'Dies wird nicht wiederholt. Ihr Inhalt bleibt erhalten und der Grund steht auf der Quittung.',
  'state.canceled.label': 'Abgesagt',
  'state.canceled.description': 'Abgesagt von {actor} am {date}. Es wurde nichts veröffentlicht.',
  'state.deleted_externally.label': 'Auf der Plattform gelöscht',
  'state.deleted_externally.description':
    'Dieser Beitrag ist nicht mehr auf {provider}. Der Beleg und die vor dem Versand gesammelten Messwerte werden aufbewahrt.',

  'state.approval.not_required.label': 'Keine Genehmigung erforderlich',
  'state.approval.not_required.description':
    'Die Richtlinie für diese Ziele bedarf keiner Genehmigung.',
  'state.approval.requested.label': 'Angefordert',
  'state.approval.requested.description': 'Gesendet an {approver} {relativeTime}.',
  'state.approval.in_review.label': 'Im Rückblick',
  'state.approval.in_review.description': '{approver} schaut sich das gerade an.',
  'state.approval.approved.label': 'Genehmigt',
  'state.approval.approved.description': 'Genehmigt von {approver} am {date}.',
  'state.approval.changes_requested.label': 'Änderungen erbeten',
  'state.approval.changes_requested.description': '{approver} hat um Änderungen an {date} gebeten.',
  'state.approval.rejected.label': 'Abgelehnt',
  'state.approval.rejected.description': 'Abgelehnt von {approver} am {date}.',
  'state.approval.expired.label': 'Abgelaufen',
  'state.approval.expired.description': 'Diese Anfrage ist am {date} ohne Entscheidung abgelaufen.',
  'state.approval.withdrawn.label': 'Zurückgezogen',
  'state.approval.withdrawn.description': 'Der Autor hat diese Anfrage am {date} zurückgezogen.',

  'state.summary.targets':
    '{ready, plural, one {# Ziel bereit} other {# Ziele bereit}}, {blocked, plural, =0 {keine blockiert} one {# blockiert} other {# blockiert}}',
  'state.changedAt': 'Geändert {relativeTime}',
} as const;
