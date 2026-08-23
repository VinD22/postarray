/** Weekly digest copy for the Polish interface. */
export const digestMessages = {
  'digest.title': 'Ten tydzień',
  'digest.subtitle': 'To, co widzimy od {windowStart} do {windowEnd}.',
  'digest.empty':
    'Nie ma jeszcze nic do podsumowania z tego tygodnia. Opublikuj coś, a pojawi się tutaj.',
  'digest.regenerate': 'Utwórz podsumowanie tego tygodnia ponownie',
  'digest.generating': 'Tworzenie podsumowania tego tygodnia',
  'digest.source.deterministic':
    'Utworzone na podstawie rejestrów publikacji i własnych pomiarów, bez asystenta pisania.',
  'digest.source.ai':
    'Utworzone przez asystenta na podstawie własnych rejestrów. Każda liczba została z nimi sprawdzona.',
  'digest.unavailable.aiOff':
    'Asystent pisania jest wyłączony, więc to jest wersja podstawowa. Niczego w niej nie brakuje.',
  'digest.unavailable.rejected':
    'Wersja asystenta nie pasowała do danych i została odrzucona. To jest wersja podstawowa.',
  'digest.headline.published':
    '{published, plural, =0 {Nie ukończono żadnych postów} one {Ukończono # post} few {Ukończono # posty} many {Ukończono # postów} other {Ukończono # posta}} między {windowStart} a {windowEnd}.',
  'digest.headline.nothingPublished':
    'Między {windowStart} a {windowEnd} niczego nie opublikowano.',
  'digest.outcome.published':
    '{count, plural, one {Ukończono # post na {provider}} few {Ukończono # posty na {provider}} many {Ukończono # postów na {provider}} other {Ukończono # posta na {provider}}}.',
  'digest.outcome.partial':
    '{count, plural, one {# post dotarł do części miejsc docelowych na {provider}, ale nie do pozostałych} few {# posty dotarły do części miejsc docelowych na {provider}, ale nie do pozostałych} many {# postów dotarło do części miejsc docelowych na {provider}, ale nie do pozostałych} other {# posta dotarło do części miejsc docelowych na {provider}, ale nie do pozostałych}}}.',
  'digest.outcome.failed':
    '{count, plural, one {# post nie został opublikowany na {provider}} few {# posty nie zostały opublikowane na {provider}} many {# postów nie zostało opublikowanych na {provider}} other {# posta nie zostało opublikowane na {provider}}}.',
  'digest.metrics.noneYet':
    'W tym tygodniu nie dotarły jeszcze żadne pomiary. Oznacza to, że nie wiemy, jak poradziły sobie te posty, a nie że poradziły sobie źle.',
  'digest.freshness.statement':
    '{label, select, fresh {Pomiary zostały ostatnio zsynchronizowane o {lastObservedAt}.} stale {Pomiary nie były synchronizowane od {lastObservedAt}, więc powyższe liczby mogą być nieaktualne.} other {Nic jeszcze nie zsynchronizowano, więc nic powyżej nie jest zmierzone.}}',
  'digest.narrative.headline': '{statement}',
  'digest.narrative.observation': '{statement}',
  'digest.narrative.confounder': 'Warto wiedzieć: {confounder}',
  'digest.narrative.notSupported': '{statement}',
  'digest.narrative.nextAction': '{statement}',
  'digest.settings.title': 'Cotygodniowe podsumowanie e-mail',
  'digest.settings.description':
    'Krótki e-mail co tydzień z informacją o tym, co opublikowano i co udało się zmierzyć. Domyślnie włączone.',
  'digest.settings.enabled': 'Wysyłaj cotygodniowe podsumowanie',
  'email.digest.subject': 'Twój tydzień w {workspaceName}',
  'email.digest.intro':
    'Oto, co widzimy dla {workspaceName} między {windowStart} a {windowEnd}.',
  'email.digest.noData':
    'W tym tygodniu nie udało nam się niczego zmierzyć. Brak liczby oznacza, że nie mogliśmy jej odczytać, a nie że wynosiła zero.',
  'email.digest.footer':
    'Otrzymujesz tę wiadomość, ponieważ cotygodniowe podsumowanie jest włączone dla {workspaceName}. Wyłącz je w ustawieniach obszaru roboczego.',
} as const;
