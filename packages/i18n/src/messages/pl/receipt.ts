/** Publication receipt: the immutable record of what actually happened. */
export const receiptMessages = {
  'receipt.title': 'Potwierdzenie publikacji',
  'receipt.subtitle': 'Dokładnie co, gdzie, kiedy i za czyją zgodą zostało opublikowane.',
  'receipt.target': '{account} na {provider}',
  'receipt.externalId': 'Identyfikator wpisu zewnętrznego',
  'receipt.permalink': 'Bezpośredni odnośnik',
  'receipt.permalinkUnavailable': '{provider} nie zwraca bezpośredniego linku dla tego typu postu.',
  'receipt.contentVersion': 'Wersja treści',
  'receipt.contentHash': 'Suma kontrolna treści',
  'receipt.mediaVersion': 'Wersja multimedialna',
  'receipt.idempotencyKey': 'Odniesienie do idempotencji',
  'receipt.correlationId': 'Odniesienie do korelacji',

  'receipt.surface.label': 'Utworzono z',
  'receipt.surface.web': 'Aplikacja internetowa',
  'receipt.surface.api': 'API REST',
  'receipt.surface.mcp': 'Serwer MCP',
  'receipt.surface.cli': 'CLI',
  'receipt.surface.rss': 'Automatyczna poczta RSS',
  'receipt.surface.automation': 'Reguła automatyzacji',
  'receipt.surface.webhook': 'Przychodzący webhook',

  'receipt.actor.user': '{name}',
  'receipt.actor.serviceAccount': 'Konto usługi {name}',
  'receipt.actor.oauthApp': '{app} działający w imieniu {name}',
  'receipt.actor.system': 'Przekaźnik',

  'receipt.timeline.title': 'Oś czasu',
  'receipt.timeline.created': 'Wersja robocza utworzona przez {actor}',
  'receipt.timeline.approvalRequested': 'Prośba o zgodę od {approver}',
  'receipt.timeline.approved': 'Zatwierdzone przez {actor} zgodnie z zasadami {policy}',
  'receipt.timeline.scheduled': 'Zaplanowano na {local} w {timeZone}',
  'receipt.timeline.revalidated': 'Ponownie sprawdzono dane uwierzytelniające i limity platformy',
  'receipt.timeline.mediaPrepared':
    '{count, plural, one {# plik przygotowany na platformę} other {# pliki przygotowane na platformę} few {# pliki przygotowane na platformę} many {# pliki przygotowane na platformę}}',
  'receipt.timeline.dispatched': 'Wysłano do {provider}',
  'receipt.timeline.providerAccepted': '{provider} zaakceptował post',
  'receipt.timeline.providerProcessing': '{provider} nadal przetwarza multimedia',
  'receipt.timeline.published': 'Opublikowano jako {externalId}',
  'receipt.timeline.commentPublished': 'Element uzupełniający {position} opublikowano',
  'receipt.timeline.retryScheduled': 'Ponów próbę {attempt} zaplanowane na {time}',
  'receipt.timeline.failed': 'Próba {attempt} nie powiodło się',
  'receipt.timeline.canceled': 'Anulowane przez {actor}',
  'receipt.timeline.analyticsSynced': 'Zsynchronizowano statystyki',
  'receipt.timeline.deletedExternally': 'Wpis nie jest już dostępny w {provider}',

  'receipt.times.scheduled': 'Zaplanowany czas',
  'receipt.times.dispatched': 'Czas wysyłki',
  'receipt.times.published': 'Czas publikacji',
  'receipt.times.latency': 'Wysłano {duration} po zaplanowanej godzinie.',

  'receipt.attempts.title': 'Próby',
  'receipt.attempts.count':
    '{count, plural, one {# próba} other {# próby} few {# próby} many {# próby}}',
  'receipt.attempts.classification': 'Klasyfikacja',
  'receipt.attempts.providerResponse': 'Odpowiedź dostawcy',
  'receipt.attempts.responseRedacted':
    'Odpowiedź dostawcy jest przechowywana z tokenami i usuniętymi danymi osobowymi.',
  'receipt.attempts.remediation': 'Co dalej robić',

  'receipt.cost.estimated': 'Szacowany {amount}',
  'receipt.cost.actual': 'Pojednane {amount}',
  'receipt.cost.pending': 'Rzeczywiste wykorzystanie nie zostało jeszcze uzgodnione.',

  'receipt.partial.title': 'Częściowo opublikowane',
  'receipt.partial.body':
    '{published, plural, one {# cel opublikowany} other {# cele opublikowane} few {# cele opublikowane} many {# cele opublikowane}}. {failed, plural, one {# cel nie powiódł się} other {# cele nie powiodły się} few {# cele nie powiodły się} many {# cele nie powiodły się}}. Opublikowane posty nadal istnieją na platformie.',
  'receipt.partial.doNotRollback':
    'Nie usuwamy postów, które zostały już opublikowane. Usuń go na platformie, jeśli tego właśnie chcesz.',

  'receipt.export.title': 'Udostępnij ten paragon',
  'receipt.export.pdf': 'Pobierz jako PDF',
  'receipt.export.json': 'Pobierz jako JSON',
  'receipt.export.permissionNote':
    'Tylko właściciele, administratorzy i osoby zatwierdzające mogą udostępniać rachunki.',

  'receipt.analytics.lastSync': 'Ostatnia synchronizacja statystyk {relativeTime}.',
  'receipt.analytics.nextSync': 'Następna synchronizacja wokół {time}.',
} as const;
