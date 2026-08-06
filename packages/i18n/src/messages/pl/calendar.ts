/** Calendar, queue, action center and approvals. */
export const calendarMessages = {
  'calendar.title': 'Kalendarz',
  'calendar.view.day': 'Dzień',
  'calendar.view.week': 'Tydzień',
  'calendar.view.month': 'Miesiąc',
  'calendar.view.list': 'Lista',
  'calendar.view.label': 'Widok kalendarza',
  'calendar.today': 'Dziś',
  'calendar.goToDate': 'Przejdź do daty',
  'calendar.previousPeriod': 'Poprzedni okres',
  'calendar.nextPeriod': 'Następny okres',
  'calendar.timeZoneNote': 'Czasy są wyświetlane w {timeZone}.',
  'calendar.weekOf': 'Tydzień {date}',
  'calendar.dayHeading': '{weekday}, {date}',
  'calendar.slotCount':
    '{count, plural, =0 {Nic nie jest zaplanowane} one {# post} other {# posty} few {# posty} many {# posty}}',
  'calendar.slotOverflow':
    '{count, plural, one {# więcej} other {# więcej} few {# więcej} many {# więcej}}',
  'calendar.newPostAt': 'Nowy post w {time}',

  'calendar.filter.brand': 'Marka',
  'calendar.filter.account': 'Konto',
  'calendar.filter.platform': 'Platforma',
  'calendar.filter.status': 'Stan',
  'calendar.filter.locale': 'Język treści',
  'calendar.filter.campaign': 'Kampania',
  'calendar.filter.applied':
    '{count, plural, one {# zastosowano filtr} other {# zastosowano filtry} few {# zastosowano filtry} many {# zastosowano filtry}}',

  'calendar.drag.instructions':
    'Przeciągnij post do nowego miejsca lub wybierz go i użyj klawiszy strzałek, aby go przenieść.',
  'calendar.drag.confirmTitle': 'Przenieść ten post?',
  'calendar.drag.confirmBody': 'Od {from} do {to} w {timeZone}.',
  'calendar.drag.dstNotice':
    'Zegary zmieniają się między tymi godzinami w {timeZone}. Nowy czas to {utc} UTC.',
  'calendar.drag.publishedNotice':
    'Ten post został już opublikowany. Przeniesienie go zmienia tylko rekord lokalny. Ponowne opublikowanie go to osobna czynność.',
  'calendar.drag.conflictNotice':
    '{account} ma już {count, plural, one {# post} other {# posty} few {# posty} many {# posty}} w ciągu godziny od nowego czasu.',

  'calendar.queue.title': 'Kolejka',
  'calendar.queue.upcoming': 'Nadchodzące',
  'calendar.queue.needsApproval': 'Oczekiwanie na zatwierdzenie',
  'calendar.queue.drafts': 'Wersje robocze',
  'calendar.queue.published': 'Opublikowano',
  'calendar.queue.failed': 'Niepowodzenie',
  'calendar.queue.nextSlot': 'Następny wolny slot to {time}.',

  'calendar.post.publishesAt': 'Publikuje {time} w {timeZone}',
  'calendar.post.publishedAt': 'Opublikowano {time}',
  'calendar.post.targetCount':
    '{count, plural, one {# konto} other {# konta} few {# konta} many {# konta}}',
  'calendar.post.mediaType.text': 'Tekst',
  'calendar.post.mediaType.image': 'Obraz',
  'calendar.post.mediaType.carousel': 'Karuzela',
  'calendar.post.mediaType.video': 'Wideo',
  'calendar.post.mediaType.document': 'Dokument',

  'actionCenter.title': 'Centrum akcji',
  'actionCenter.description': 'Wszystko, co wymaga decyzji lub naprawy, w jednej kolejce.',
  'actionCenter.empty': 'W tej chwili nic nie wymaga uwagi.',
  'actionCenter.item.connectionExpiring':
    '{account} należy ponownie połączyć przed {date} lub zaplanowane posty nie powiodą się.',
  'actionCenter.item.connectionActionRequired':
    '{account} wymaga uwagi na {provider}, zanim będzie można go ponownie opublikować.',
  'actionCenter.item.validationFailed':
    'Wersja robocza dla {account} nie przechodzi {provider} walidacja.',
  'actionCenter.item.approvalOverdue': 'Prośba o zatwierdzenie czeka od {date}.',
  'actionCenter.item.scheduleConflict': '{account} ma zaplanowane posty blisko siebie w {date}.',
  'actionCenter.item.providerIncident':
    '{provider} zgłasza problem. Zaplanowane posty zostaną ponowione.',
  'actionCenter.item.commentFailed':
    'Opublikowano główny post, ale jest to kolejny element dotyczący {account} nie powiodło się.',
  'actionCenter.item.analyticsStale': 'Analizy dla {account} nie były aktualizowane od {date}.',
  'actionCenter.item.rssStalled': 'Kanał {name} nie zwrócił prawidłowego przedmiotu od {date}.',
  'actionCenter.item.webhookFailing':
    'Dostawy do {endpoint} nie powiodło się {count, plural, one {# czas} other {# razy} few {# razy} many {# razy}} z rzędu.',
  'actionCenter.item.usageBalance':
    'Odmierzone działanie dla {provider} wymaga bilansu wykorzystania, zanim będzie można uruchomić.',

  'approval.title': 'Zatwierdzenia',
  'approval.requestTitle': 'Prośba o zatwierdzenie',
  'approval.requestedBy': 'Na prośbę {name} {relativeTime}',
  'approval.requestedFrom': 'Czekam na {name}',
  'approval.policy.none': 'W przypadku tych celów nie jest wymagana zgoda.',
  'approval.policy.anyApprover': 'Każda osoba zatwierdzająca może to zatwierdzić.',
  'approval.policy.namedApprover': '{name} musi to zatwierdzić.',
  'approval.policy.everyApprover': 'Każda osoba zatwierdzająca musi to zatwierdzić.',
  'approval.decision.approvedBy': 'Zatwierdzone przez {name} na {date}',
  'approval.decision.rejectedBy': 'Odrzucony przez {name} na {date}',
  'approval.decision.changesRequestedBy': 'Zmiany zażądał {name} na {date}',
  'approval.comment.label': 'Uwaga dla autora',
  'approval.comment.placeholder': 'Powiedz, co należy zmienić i dlaczego.',
  'approval.reapproval.needed':
    'Ten post został zmieniony po zatwierdzeniu. Zanim będzie można go opublikować, wymaga ponownego zatwierdzenia.',
  'approval.reapproval.reason.content': 'Treść uległa zmianie.',
  'approval.reapproval.reason.account': 'Zmieniły się konta docelowe.',
  'approval.reapproval.reason.media': 'Nośnik uległ zmianie.',
  'approval.reapproval.reason.schedule': 'Zmienił się czas publikacji.',
  'approval.reapproval.reason.privacy':
    'Zmieniły się ustawienia prywatności lub ujawniania informacji.',
  'approval.reapproval.reason.locale': 'Zmieniono język treści.',
  'approval.expiresAt': 'To żądanie wygasa {date}.',
} as const;
