/** Analytics, metric definitions, experiments and tracked links. */
export const analyticsMessages = {
  'analytics.title': 'Analizy',
  'analytics.subtitle': 'Co się stało, jakie to świeże i co warto przetestować dalej.',
  'analytics.range.7d': 'Ostatnie 7 dni',
  'analytics.range.30d': 'Ostatnie 30 dni',
  'analytics.range.90d': 'Ostatnie 90 dni',
  'analytics.range.custom': 'Zakres niestandardowy',
  'analytics.range.limitedByProvider':
    '{provider} zwraca co najwyżej {days, plural, one {# dzień} other {# dni} few {# dni} many {# dni}} historii tego konta.',
  'analytics.account.select': 'Wybierz konto',
  'analytics.compareTo': 'W porównaniu z {baseline}',
  'analytics.baseline.trailingMedian':
    'Twoja mediana poprzedniego {count, plural, one {# porównywalny post} other {# porównywalne posty} few {# porównywalne posty} many {# porównywalne posty}}',

  'analytics.metric.followers': 'Obserwatorzy',
  'analytics.metric.subscribers': 'Abonenci',
  'analytics.metric.profileViews': 'Wyświetlenia profilu',
  'analytics.metric.impressions': 'Wyświetlenia',
  'analytics.metric.reach': 'Zasięg',
  'analytics.metric.views': 'Wyświetlenia',
  'analytics.metric.videoViews': 'Wyświetlenia wideo',
  'analytics.metric.watchTime': 'Czas oglądania',
  'analytics.metric.averageViewDuration': 'Średni czas oglądania',
  'analytics.metric.averageViewPercentage': 'Średni odsetek obejrzeń',
  'analytics.metric.likes': 'Polubienia i reakcje',
  'analytics.metric.comments': 'Komentarze i odpowiedzi',
  'analytics.metric.shares': 'Udostępnienia, reposty i cytaty',
  'analytics.metric.saves': 'Zapisane i zakładki',
  'analytics.metric.linkClicks': 'Kliknięcia linku',
  'analytics.metric.clickThroughRate': 'Współczynnik klikalności',
  'analytics.metric.engagementRate': 'Wskaźnik zaangażowania',
  'analytics.metric.publishedCount': 'Opublikowane posty',
  'analytics.metric.followerChange': 'Zmiana obserwujących',

  'analytics.definition.title': 'Jak {metric} jest zdefiniowane',
  'analytics.definition.provider': 'Zgłoszone przez {provider} jako {providerField}.',
  'analytics.definition.denominator.label': 'Mianownik: {denominator}.',
  'analytics.definition.unit': 'Jednostka: {unit}.',
  'analytics.definition.normalized':
    'Znormalizowane na podstawie wartości dostawcy. Wartość surowa jest zachowywana i dostępna.',
  'analytics.definition.notComparable':
    '{provider} i {otherProvider} zdefiniuj to inaczej. Porównaj je ostrożnie.',

  'analytics.value.unavailable': 'Niedostępne',
  'analytics.value.unavailableReason.permission':
    'To konto nie przyznało uprawnień wymaganych dla tego wskaźnika.',
  'analytics.value.unavailableReason.unsupported': '{provider} nie raportuje tej metryki.',
  'analytics.value.unavailableReason.tooEarly':
    '{provider} publikuje tę metrykę później. Sprawdź ponownie po {time}.',
  'analytics.value.unavailableReason.syncFailed':
    'Ostatnia synchronizacja nie powiodła się. Próbujemy ponownie i nie pokażemy odgadniętej liczby.',
  'analytics.freshness.synced': 'Zsynchronizowano {relativeTime}',
  'analytics.freshness.stale':
    'Ostatnia udana synchronizacja {relativeTime}. To może być nieaktualne.',
  'analytics.freshness.coverage':
    '{covered} z {total} posty w tym zakresie zawierają aktualne dane.',

  'analytics.feedback.title': 'Co to sugeruje',
  'analytics.feedback.aboveBaseline': 'Ten post otrzymał {percent} więcej {metric} niż {baseline}.',
  'analytics.feedback.belowBaseline': 'Ten post otrzymał {percent} mniej {metric} niż {baseline}.',
  'analytics.feedback.notComparableFormats':
    'Posty graficzne i posty wideo nie są tutaj bezpośrednio porównywalne.',
  'analytics.feedback.smallSample':
    'Próbka jest mała. Zanim wyciągniesz wnioski, przetestuj ten sam hak ponownie.',
  'analytics.feedback.association':
    'Większa liczba komentarzy po zmianie opóźnienia pierwszego komentarza z {before} do {after}. To jest skojarzenie, a nie dowód przyczyny.',
  'analytics.feedback.nextTest': 'Co dalej przetestować',
  'analytics.feedback.doNotInfer': 'Czego to nie pokazuje',
  'analytics.feedback.noScore':
    'Nie ma tutaj jednego wyniku na wielu platformach. Wybierz wskaźnik z definicją, której ufasz.',

  'analytics.experiment.title': 'Eksperymenty',
  'analytics.experiment.hypothesis': 'Hipoteza',
  'analytics.experiment.variants': 'Warianty',
  'analytics.experiment.successMetric': 'Miernik sukcesu',
  'analytics.experiment.window': 'Okno pomiarowe',
  'analytics.experiment.status.running': 'Uruchamiane do {date}',
  'analytics.experiment.status.complete': 'Ukończono',
  'analytics.experiment.tagBeforePublishing':
    'Oznacz eksperyment przed publikacją, aby porównanie nie było dokonywane po fakcie.',
  'analytics.experiment.caveats': 'Zastrzeżenia',

  'analytics.export.title': 'Eksportuj',
  'analytics.export.csv': 'Pobierz plik CSV',
  'analytics.export.json': 'Pobierz JSON',
  'analytics.export.providerRestriction':
    '{provider} ogranicza sposób łączenia lub przechowywania jego danych. Niektóre pola nie są uwzględnione.',

  'analytics.links.title': 'Śledzone linki',
  'analytics.links.subtitle':
    'Własne pomiary przekierowań. To osobna seria od kliknięć linków zgłaszanych przez platformę.',
  'analytics.links.destination': 'Miejsce docelowe',
  'analytics.links.shortUrl': 'Krótki adres URL',
  'analytics.links.totalRequests': 'Wszystkie żądania',
  'analytics.links.humanClicks': 'Deduplikowane kliknięcia',
  'analytics.links.suspectedBots': 'Podejrzane boty',
  'analytics.links.referrerClass': 'Osoba polecająca',
  'analytics.links.deviceClass': 'Urządzenie',
  'analytics.links.country': 'Kraj',
  'analytics.links.lastEvent': 'Ostatnie kliknięcie {relativeTime}',
  'analytics.links.privacyNote':
    'Zachowujemy tylko przybliżoną lokalizację i klasę urządzenia. Surowe adresy IP są przechowywane przez krótki czas w celu wykrycia nadużyć i duplikatów, a następnie odrzucane.',
  'analytics.links.separateSources':
    'Nie dodawaj tych kliknięć do liczby zgłaszanej przez platformę. Liczą różne rzeczy.',
} as const;
