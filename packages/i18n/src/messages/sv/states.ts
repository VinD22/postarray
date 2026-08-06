/**
 * The fifteen publish states and the approval states.
 *
 * `state.<state>.label` is the short badge. `state.<state>.description` is the
 * sentence shown next to it. A state never relies on colour alone.
 */
export const stateMessages = {
  'state.draft.label': 'Utkast',
  'state.draft.description':
    'Endast personer i den här arbetsytan kan se den. Ingenting är schemalagt.',
  'state.validation_needed.label': 'Validering behövs',
  'state.validation_needed.description':
    'Ett eller flera mål har ett problem som måste åtgärdas innan detta kan schemaläggas.',
  'state.approval_requested.label': 'Godkännande begärts',
  'state.approval_requested.description': 'Väntar på att {approver} ska bestämma sig.',
  'state.approved.label': 'Godkänd',
  'state.approved.description': 'Godkänd av {approver}. Det kan nu schemaläggas eller publiceras.',
  'state.scheduled.label': 'Schemalagt',
  'state.scheduled.description': 'Publicerar {time} i {timeZone}.',
  'state.preparing_media.label': 'Förbereder media',
  'state.preparing_media.description': 'Ladda upp och konvertera filer för plattformen.',
  'state.dispatching.label': 'Utskick',
  'state.dispatching.description': 'Skickar till {provider} nu.',
  'state.provider_processing.label': 'Leverantörs bearbetning',
  'state.provider_processing.description':
    '{provider} accepterade uppladdningen och bearbetar den fortfarande. Vi bekräftar när det är live.',
  'state.published.label': 'Publicerad',
  'state.published.description': 'Live på {provider} sedan {time}.',
  'state.partially_published.label': 'Delvis publicerad',
  'state.partially_published.description':
    '{published, plural, one {# mål publicerat} other {# mål publicerade}}, {failed, plural, one {# misslyckades} other {# misslyckades}}. De publicerade inläggen är live och har inte återställts.',
  'state.action_required.label': 'Åtgärd krävs',
  'state.action_required.description': 'Detta kan inte fortsätta förrän du gör något.',
  'state.retry_scheduled.label': 'Försök igen planerat',
  'state.retry_scheduled.description':
    'Försök {attempt} av {max} kommer att köras vid {time}. Ingenting är duplicerat.',
  'state.failed_permanently.label': 'Misslyckades',
  'state.failed_permanently.description':
    'Detta kommer inte att prövas igen. Ditt innehåll är bevarat och anledningen finns på kvittot.',
  'state.canceled.label': 'Avbruten',
  'state.canceled.description': 'Avbröts av {actor} den {date}. Ingenting publicerades.',
  'state.deleted_externally.label': 'Raderad på plattformen',
  'state.deleted_externally.description':
    'Det här inlägget finns inte längre på {provider}. Kvittot och mätvärdena som samlades in innan det gick bevaras.',

  'state.approval.not_required.label': 'Inget godkännande behövs',
  'state.approval.not_required.description': 'Policyn för dessa mål kräver inget godkännande.',
  'state.approval.requested.label': 'Begärt',
  'state.approval.requested.description': 'Skickat till {approver} {relativeTime}.',
  'state.approval.in_review.label': 'I recension',
  'state.approval.in_review.description': '{approver} tittar på det här nu.',
  'state.approval.approved.label': 'Godkänd',
  'state.approval.approved.description': 'Godkänd av {approver} den {date}.',
  'state.approval.changes_requested.label': 'Ändringar begärda',
  'state.approval.changes_requested.description': '{approver} bad om ändringar på {date}.',
  'state.approval.rejected.label': 'Avvisad',
  'state.approval.rejected.description': 'Avvisades av {approver} den {date}.',
  'state.approval.expired.label': 'Utgått',
  'state.approval.expired.description': 'Denna begäran löpte ut {date} utan beslut.',
  'state.approval.withdrawn.label': 'Indragen',
  'state.approval.withdrawn.description': 'Författaren tog tillbaka denna begäran den {date}.',

  'state.summary.targets':
    '{ready, plural, one {# mål redo} other {# mål redo}}, {blocked, plural, =0 {ingen blockerad} one {# blockerad} other {# blocked}}',
  'state.changedAt': 'Ändrade {relativeTime}',
} as const;
