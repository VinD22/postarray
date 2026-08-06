/**
 * The fifteen publish states and the approval states.
 *
 * `state.<state>.label` is the short badge. `state.<state>.description` is the
 * sentence shown next to it. A state never relies on colour alone.
 */
export const stateMessages = {
  'state.draft.label': 'Diepgang',
  'state.draft.description':
    'Alleen mensen in deze werkruimte kunnen het zien. Er staat niets gepland.',
  'state.validation_needed.label': 'Validatie nodig',
  'state.validation_needed.description':
    'Een of meer doelen hebben een probleem dat moet worden opgelost voordat dit kan worden gepland.',
  'state.approval_requested.label': 'Goedkeuring gevraagd',
  'state.approval_requested.description': 'Wachten tot {approver} beslist.',
  'state.approved.label': 'Goedgekeurd',
  'state.approved.description':
    'Goedgekeurd door {approver}. Het kan nu worden gepland of gepubliceerd.',
  'state.scheduled.label': 'Gepland',
  'state.scheduled.description': 'Publiceert {time} in {timeZone}.',
  'state.preparing_media.label': 'Media voorbereiden',
  'state.preparing_media.description': 'Bestanden uploaden en converteren voor het platform.',
  'state.dispatching.label': 'Verzending',
  'state.dispatching.description': 'Verzendt nu naar {provider}.',
  'state.provider_processing.label': 'Verwerking van de aanbieder',
  'state.provider_processing.description':
    '{provider} heeft de upload geaccepteerd en is nog steeds bezig met het verwerken ervan. Wij bevestigen wanneer het live is.',
  'state.published.label': 'Gepubliceerd',
  'state.published.description': 'Live op {provider} sinds {time}.',
  'state.partially_published.label': 'Gedeeltelijk gepubliceerd',
  'state.partially_published.description':
    '{published, plural, one {# doel gepubliceerd} other {# doelstellingen gepubliceerd}}, {failed, plural, one {# mislukt} other {# mislukt}}. De gepubliceerde berichten zijn live en zijn niet teruggedraaid.',
  'state.action_required.label': 'Actie vereist',
  'state.action_required.description': 'Dit kan niet doorgaan totdat je iets doet.',
  'state.retry_scheduled.label': 'Opnieuw proberen gepland',
  'state.retry_scheduled.description':
    'Poging {attempt} van {max} wordt uitgevoerd op {time}. Er wordt niets gedupliceerd.',
  'state.failed_permanently.label': 'Mislukt',
  'state.failed_permanently.description':
    'Dit wordt niet opnieuw geprobeerd. Uw inhoud blijft behouden en de reden staat op de kassabon.',
  'state.canceled.label': 'Geannuleerd',
  'state.canceled.description': 'Geannuleerd door {actor} op {date}. Er werd niets gepubliceerd.',
  'state.deleted_externally.label': 'Verwijderd op het platform',
  'state.deleted_externally.description':
    'Dit bericht staat niet meer op {provider}. De bon en de vóór verzending verzamelde statistieken worden bewaard.',

  'state.approval.not_required.label': 'Geen goedkeuring nodig',
  'state.approval.not_required.description':
    'Het beleid voor deze doelstellingen behoeft geen goedkeuring.',
  'state.approval.requested.label': 'Gevraagd',
  'state.approval.requested.description': 'Verzonden naar {approver} {relativeTime}.',
  'state.approval.in_review.label': 'Wordt beoordeeld',
  'state.approval.in_review.description': '{approver} kijkt hier nu naar.',
  'state.approval.approved.label': 'Goedgekeurd',
  'state.approval.approved.description': 'Goedgekeurd door {approver} op {date}.',
  'state.approval.changes_requested.label': 'Wijzigingen gevraagd',
  'state.approval.changes_requested.description': '{approver} vroeg om wijzigingen op {date}.',
  'state.approval.rejected.label': 'Afgewezen',
  'state.approval.rejected.description': 'Afgewezen door {approver} op {date}.',
  'state.approval.expired.label': 'Verlopen',
  'state.approval.expired.description': 'Dit verzoek is op {date} verlopen zonder beslissing.',
  'state.approval.withdrawn.label': 'Ingetrokken',
  'state.approval.withdrawn.description': 'De auteur heeft dit verzoek op {date} ingetrokken.',

  'state.summary.targets':
    '{ready, plural, one {# doel gereed} other {# doelen gereed}}, {blocked, plural, =0 {geen geblokkeerd} one {# geblokkeerd} other {# geblokkeerd}}',
  'state.changedAt': '{relativeTime} gewijzigd',
} as const;
