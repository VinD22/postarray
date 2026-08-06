/**
 * The fifteen publish states and the approval states.
 *
 * `state.<state>.label` is the short badge. `state.<state>.description` is the
 * sentence shown next to it. A state never relies on colour alone.
 */
export const stateMessages = {
  'state.draft.label': 'Bozza',
  'state.draft.description':
    "Solo le persone in quest'area di lavoro possono vederlo. Non è previsto nulla.",
  'state.validation_needed.label': 'Necessaria la convalida',
  'state.validation_needed.description':
    'Uno o più target presentano un problema che deve essere risolto prima di poterlo pianificare.',
  'state.approval_requested.label': 'Richiesta approvazione',
  'state.approval_requested.description': 'Aspetto che {approver} decida.',
  'state.approved.label': 'Approvato',
  'state.approved.description': 'Approvato da {approver}. Ora può essere programmato o pubblicato.',
  'state.scheduled.label': 'Programmato',
  'state.scheduled.description': 'Pubblica {time} in {timeZone}.',
  'state.preparing_media.label': 'Preparazione dei media',
  'state.preparing_media.description': 'Caricamento e conversione di file per la piattaforma.',
  'state.dispatching.label': 'Dispacciamento',
  'state.dispatching.description': 'Invio a {provider} adesso.',
  'state.provider_processing.label': 'Elaborazione del fornitore',
  'state.provider_processing.description':
    '{provider} ha accettato il caricamento e lo sta ancora elaborando. Confermiamo quando sarà live.',
  'state.published.label': 'Pubblicato',
  'state.published.description': 'In diretta su {provider} da {time}.',
  'state.partially_published.label': 'Parzialmente pubblicato',
  'state.partially_published.description':
    '{published, plural, one {# target pubblicato} many {# target pubblicati} other {# target pubblicati}}, {failed, plural, one {# fallito} many {# fallito} other {# fallito}}. I post pubblicati sono attivi e non sono stati sottoposti a rollback.',
  'state.action_required.label': 'Azione richiesta',
  'state.action_required.description': 'Questo non può continuare finché non fai qualcosa.',
  'state.retry_scheduled.label': 'Nuovo tentativo programmato',
  'state.retry_scheduled.description':
    'Il tentativo {attempt} di {max} verrà eseguito su {time}. Niente è duplicato.',
  'state.failed_permanently.label': 'Fallito',
  'state.failed_permanently.description':
    "L'operazione non verrà ripetuta. Il tuo contenuto viene preservato e il motivo è sulla ricevuta.",
  'state.canceled.label': 'Annullato',
  'state.canceled.description': 'Annullato da {actor} su {date}. Non è stato pubblicato nulla.',
  'state.deleted_externally.label': 'Eliminato sulla piattaforma',
  'state.deleted_externally.description':
    'Questo post non è più su {provider}. La ricevuta e le metriche raccolte prima della partenza vengono conservate.',

  'state.approval.not_required.label': 'Non è necessaria alcuna approvazione',
  'state.approval.not_required.description':
    'La politica per questi obiettivi non richiede approvazione.',
  'state.approval.requested.label': 'Richiesto',
  'state.approval.requested.description': 'Inviato a {approver} {relativeTime}.',
  'state.approval.in_review.label': 'In revisione',
  'state.approval.in_review.description': '{approver} lo sta guardando adesso.',
  'state.approval.approved.label': 'Approvato',
  'state.approval.approved.description': 'Approvato da {approver} su {date}.',
  'state.approval.changes_requested.label': 'Modifiche richieste',
  'state.approval.changes_requested.description': '{approver} ha chiesto modifiche su {date}.',
  'state.approval.rejected.label': 'Rifiutato',
  'state.approval.rejected.description': 'Rifiutato da {approver} su {date}.',
  'state.approval.expired.label': 'Scaduto',
  'state.approval.expired.description': 'Questa richiesta è scaduta il {date} senza una decisione.',
  'state.approval.withdrawn.label': 'Ritirato',
  'state.approval.withdrawn.description': "L'autore ha ritirato questa richiesta su {date}.",

  'state.summary.targets':
    '{ready, plural, one {# target pronto} many {# target pronti} other {# target pronti}}, {blocked, plural, =0 {nessuno bloccato} one {# bloccato} many {# bloccato} other {# bloccato}}',
  'state.changedAt': 'Modificato {relativeTime}',
} as const;
