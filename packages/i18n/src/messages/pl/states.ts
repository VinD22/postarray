/**
 * The fifteen publish states and the approval states.
 *
 * `state.<state>.label` is the short badge. `state.<state>.description` is the
 * sentence shown next to it. A state never relies on colour alone.
 */
export const stateMessages = {
  'state.draft.label': 'Wersja robocza',
  'state.draft.description':
    'Tylko osoby w tym obszarze roboczym mogą to zobaczyć. Nic nie jest zaplanowane.',
  'state.validation_needed.label': 'Wymagana weryfikacja',
  'state.validation_needed.description':
    'Co najmniej jeden cel ma problem, który należy rozwiązać, zanim będzie można zaplanować tę operację.',
  'state.approval_requested.label': 'Prośba o zatwierdzenie',
  'state.approval_requested.description': 'Czekam na {approver} zdecydować.',
  'state.approved.label': 'Zatwierdzono',
  'state.approved.description':
    'Zatwierdzone przez {approver}. Można go teraz zaplanować lub opublikować.',
  'state.scheduled.label': 'Zaplanowane',
  'state.scheduled.description': 'Publikuje {time} w {timeZone}.',
  'state.preparing_media.label': 'Przygotowywanie multimediów',
  'state.preparing_media.description': 'Przesyłanie i konwertowanie plików na platformę.',
  'state.dispatching.label': 'Wysyłanie',
  'state.dispatching.description': 'Wysyłanie do {provider} teraz.',
  'state.provider_processing.label': 'Przetwarzanie przez dostawcę',
  'state.provider_processing.description':
    '{provider} zaakceptował przesyłanie i nadal go przetwarza. Potwierdzamy, kiedy będzie dostępny.',
  'state.published.label': 'Opublikowano',
  'state.published.description': 'Na żywo w {provider} od {time}.',
  'state.partially_published.label': 'Częściowo opublikowane',
  'state.partially_published.description':
    '{published, plural, one {# cel opublikowany} other {# cele opublikowane} few {# cele opublikowane} many {# cele opublikowane}}, {failed, plural, one {# nie powiodło się} other {# nie powiodło się} few {# nie powiodło się} many {# nie powiodło się}}. Opublikowane posty są aktywne i nie zostały wycofane.',
  'state.action_required.label': 'Wymagane działanie',
  'state.action_required.description': 'To nie może trwać, dopóki czegoś nie zrobisz.',
  'state.retry_scheduled.label': 'Zaplanowano ponowną próbę',
  'state.retry_scheduled.description':
    'Próba {attempt} z {max} będzie działać o {time}. Nic nie jest duplikowane.',
  'state.failed_permanently.label': 'Niepowodzenie',
  'state.failed_permanently.description':
    'To nie zostanie ponowione. Twoja treść zostanie zachowana, a powód jest podany na paragonie.',
  'state.canceled.label': 'Anulowano',
  'state.canceled.description': 'Anulowane przez {actor} na {date}. Nic nie zostało opublikowane.',
  'state.deleted_externally.label': 'Usunięte na platformie',
  'state.deleted_externally.description':
    'Ten post nie jest już dostępny w {provider}. Potwierdzenie odbioru i dane zebrane przed jego wysłaniem zostaną zachowane.',

  'state.approval.not_required.label': 'Zgoda nie jest wymagana',
  'state.approval.not_required.description':
    'Zasady dotyczące tych celów nie wymagają zatwierdzenia.',
  'state.approval.requested.label': 'Zażądano',
  'state.approval.requested.description': 'Wysłano do {approver} {relativeTime}.',
  'state.approval.in_review.label': 'W trakcie przeglądu',
  'state.approval.in_review.description': '{approver} teraz na to patrzy.',
  'state.approval.approved.label': 'Zatwierdzono',
  'state.approval.approved.description': 'Zatwierdzone przez {approver} na {date}.',
  'state.approval.changes_requested.label': 'Zażądano zmian',
  'state.approval.changes_requested.description': '{approver} poprosił o zmiany w {date}.',
  'state.approval.rejected.label': 'Odrzucony',
  'state.approval.rejected.description': 'Odrzucony przez {approver} na {date}.',
  'state.approval.expired.label': 'Wygasło',
  'state.approval.expired.description': 'To żądanie wygasło {date} bez decyzji.',
  'state.approval.withdrawn.label': 'Wycofane',
  'state.approval.withdrawn.description': 'Autor wycofał tę prośbę w dniu {date}.',

  'state.summary.targets':
    '{ready, plural, one {# cel gotowy} other {# cele gotowe} few {# cele gotowe} many {# cele gotowe}}, {blocked, plural, =0 {żaden nie został zablokowany} one {# zablokowane} other {# zablokowane} few {# zablokowane} many {# zablokowane}}',
  'state.changedAt': 'Zmieniono {relativeTime}',
} as const;
