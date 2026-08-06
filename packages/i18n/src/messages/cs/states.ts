/**
 * The fifteen publish states and the approval states.
 *
 * `state.<state>.label` is the short badge. `state.<state>.description` is the
 * sentence shown next to it. A state never relies on colour alone.
 */
export const stateMessages = {
  'state.draft.label': 'Koncept',
  'state.draft.description':
    'Můžou to vidět pouze lidé v tomto pracovním prostoru. Není nic naplánováno.',
  'state.validation_needed.label': 'Potřebné ověření',
  'state.validation_needed.description':
    'Jeden nebo více cílů má problém, který je nutné před naplánováním opravit.',
  'state.approval_requested.label': 'Požadováno schválení',
  'state.approval_requested.description': 'Čekání na {approver} rozhodnout.',
  'state.approved.label': 'Schváleno',
  'state.approved.description': 'Schváleno {approver}. Nyní ji lze naplánovat nebo publikovat.',
  'state.scheduled.label': 'Naplánováno',
  'state.scheduled.description': 'Publikuje {time} v {timeZone}.',
  'state.preparing_media.label': 'Příprava média',
  'state.preparing_media.description': 'Nahrávání a převod souborů pro platformu.',
  'state.dispatching.label': 'Dispečink',
  'state.dispatching.description': 'Odesílání na {provider} nyní.',
  'state.provider_processing.label': 'Zpracování poskytovatelem',
  'state.provider_processing.description':
    '{provider} přijal nahrání a stále jej zpracovává. Potvrzujeme, až bude aktivní.',
  'state.published.label': 'Publikováno',
  'state.published.description': 'Živě na {provider} od {time}.',
  'state.partially_published.label': 'Částečně publikováno',
  'state.partially_published.description':
    '{published, plural, one {# cíl zveřejněn} other {# cíle zveřejněny} few {# cíle zveřejněny} many {# cíle zveřejněny}}, {failed, plural, one {# se nezdařilo} other {# se nezdařilo} few {# se nezdařilo} many {# se nezdařilo}}. Publikované příspěvky jsou aktivní a nebyly vráceny zpět.',
  'state.action_required.label': 'Je vyžadována akce',
  'state.action_required.description': 'Toto nemůže pokračovat, dokud něco neuděláte.',
  'state.retry_scheduled.label': 'Naplánováno opakování',
  'state.retry_scheduled.description':
    'Pokus {attempt} z {max} poběží na {time}. Nic není duplicitní.',
  'state.failed_permanently.label': 'Neúspěšné',
  'state.failed_permanently.description':
    'Tento pokus nebude opakován. Váš obsah je zachován a důvod je uveden na účtence.',
  'state.canceled.label': 'Zrušeno',
  'state.canceled.description': 'Zrušeno uživatelem {actor} na {date}. Nic nebylo zveřejněno.',
  'state.deleted_externally.label': 'Smazáno na platformě',
  'state.deleted_externally.description':
    'Tento příspěvek již není na {provider}. Účtenka a metriky shromážděné před odesláním se uchovávají.',

  'state.approval.not_required.label': 'Není potřeba žádné schválení',
  'state.approval.not_required.description': 'Zásady pro tyto cíle nevyžadují schválení.',
  'state.approval.requested.label': 'Požadováno',
  'state.approval.requested.description': 'Odesláno na {approver} {relativeTime}.',
  'state.approval.in_review.label': 'Probíhá kontrola',
  'state.approval.in_review.description': '{approver} se na to právě dívá.',
  'state.approval.approved.label': 'Schváleno',
  'state.approval.approved.description': 'Schváleno {approver} na {date}.',
  'state.approval.changes_requested.label': 'Požadované změny',
  'state.approval.changes_requested.description': '{approver} požádal o změny na {date}.',
  'state.approval.rejected.label': 'Zamítnuto',
  'state.approval.rejected.description': 'Odmítnuto uživatelem {approver} na {date}.',
  'state.approval.expired.label': 'Platnost vypršela',
  'state.approval.expired.description': 'Platnost této žádosti vypršela {date} bez rozhodnutí.',
  'state.approval.withdrawn.label': 'Staženo',
  'state.approval.withdrawn.description': 'Autor stáhl tento požadavek dne {date}.',

  'state.summary.targets':
    '{ready, plural, one {# cíl připraven} other {# cíle připraveny} few {# cíle připraveny} many {# cíle připraveny}}, {blocked, plural, =0 {žádné blokováno} one {# zablokováno} other {# zablokováno} few {# zablokováno} many {# zablokováno}}',
  'state.changedAt': 'Změněno {relativeTime}',
} as const;
