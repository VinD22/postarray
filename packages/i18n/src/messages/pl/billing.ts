/**
 * Billing, trial and plan copy.
 *
 * Several strings here are mandated word for word by the research and by the
 * launch acceptance checklist. Do not soften or restyle them:
 *  - `billing.trial.dueToday` must read "$0 due today".
 *  - `billing.plan.annualFraming` must state the saving in currency, never a
 *    percentage discount.
 *  - `billing.mediaGeneration.explanation` is the approved boundary paragraph.
 *    Tool Radar and the pricing page use this same key.
 */
export const billingMessages = {
  'billing.title': 'Rozliczenia',
  'billing.plan.name': 'Przekaźnik',
  'billing.plan.single': 'Jeden plan. Każda funkcja. Brak progów.',
  'billing.plan.monthlyPrice': '29 USD/miesiąc',
  'billing.plan.annualPrice': '300 USD/rok',
  'billing.plan.annualFraming': '25 USD miesięcznie, opłata roczna. Zaoszczędź 48 USD rocznie.',
  'billing.plan.interval.monthly': 'Miesięcznie',
  'billing.plan.interval.annual': 'Roczne',
  'billing.plan.selectInterval': 'Wybierz okres rozliczeniowy',
  'billing.plan.includes.title': 'Co obejmuje',
  'billing.plan.includes.channels': 'Do 30 aktywnych kanałów społecznościowych',
  'billing.plan.includes.members': 'Nieograniczona liczba członków zespołu',
  'billing.plan.includes.posts':
    'Nieograniczona liczba wersji roboczych i zaplanowanych postów w ramach dozwolonego użytku',
  'billing.plan.includes.connectors': 'Każde zatwierdzone złącze',
  'billing.plan.includes.analytics': 'Analizy przechowywane od dnia połączenia konta',
  'billing.plan.includes.api': 'REST API, zdalny serwer MCP, CLI i webhooks',
  'billing.plan.includes.automation': 'Reguły automatyzacji, autopost RSS i linki śledzone',
  'billing.plan.includes.ai': 'Pomoc SMS-owa DeepSeek w ramach nadużyć i limitów kosztów',
  'billing.plan.includes.support': 'Pomoc przez e-mail i aplikację',
  'billing.plan.fairUse':
    'Dozwolony użytek oznacza ochronę przed spamem, kontrolę stawek i kosztów dostawcy, która chroni Twoje konta. Działają tak samo dla każdego abonenta.',

  'billing.trial.dueToday': 'Należność 0 USD na dzisiaj',
  'billing.trial.paymentMethodRequired':
    'Polar wybiera teraz metodę płatności i dzisiaj nic nie pobiera.',
  'billing.trial.firstCharge': 'Pierwsze ładowanie {amount} na {date}',
  'billing.trial.renewal': 'Odnawia {amount} co {interval} potem',
  'billing.trial.cancelBefore':
    'Anuluj w Ustawieniach przed tą datą, a nie poniesiesz żadnych opłat.',
  'billing.trial.reminder': 'Polar wyśle Ci e-mail na trzy dni przed konwersją wersji próbnej.',
  'billing.trial.daysRemaining':
    '{count, plural, =0 {Próba kończy się dzisiaj} one {Próba, # pozostały dzień} other {Próba, # pozostałe dni} few {Próba, # pozostałe dni} many {Próba, # pozostałe dni}}',
  'billing.trial.converted': 'Twoja wersja próbna została przekonwertowana w dniu {date}.',
  'billing.trial.canceled':
    'Twój okres próbny został anulowany. Nie pobierzemy od Ciebie żadnej opłaty.',
  'billing.trial.abusePrevention':
    'Powtarzanie prób jest ograniczone. Jeśli wersja próbna tego konta nie jest dostępna, skontaktuj się z pomocą techniczną.',

  'billing.checkout.open': 'Kontynuuj płatność',
  'billing.checkout.hostedBy': 'Zapłaty i faktury obsługuje Polar, nasz sprawdzony sprzedawca.',
  'billing.checkout.taxNote':
    'Polar pobiera i odprowadza wszelkie obowiązujące podatki od sprzedaży i VAT.',
  'billing.checkout.notEntitledYet':
    'Dostęp przyznajemy po potwierdzeniu subskrypcji przez Polar, a nie poprzez przekierowanie przeglądarki. Zwykle zajmuje to kilka sekund.',
  'billing.checkout.returning': 'Potwierdzanie subskrypcji w Polar',

  'billing.subscription.status.trialing': 'Wersja próbna',
  'billing.subscription.status.active': 'Aktywny',
  'billing.subscription.status.pastDue': 'Zaległa płatność',
  'billing.subscription.status.canceled': 'Anulowano',
  'billing.subscription.status.unpaid': 'Niezapłacone',
  'billing.subscription.status.none': 'Brak subskrypcji',
  'billing.subscription.renewsOn': 'Odnawia {amount} na {date}',
  'billing.subscription.endsOn': 'Dostęp będzie kontynuowany do {date}',
  'billing.subscription.pastDueBody':
    'Ostatnia płatność nie została zrealizowana. Aby kontynuować publikowanie, zaktualizuj formę płatności. Po upływie okresu karencji obszar roboczy stanie się tylko do odczytu, a zaplanowane posty zostaną zatrzymane.',
  'billing.subscription.readOnly':
    'Ten obszar roboczy jest tylko do odczytu. Twoje treści, rachunki i połączenia są nienaruszone.',
  'billing.subscription.portal': 'Otwórz portal klienta Polar',
  'billing.subscription.invoices': 'Faktury',
  'billing.subscription.paymentMethod': 'Metoda płatności',
  'billing.subscription.managedByPolar': 'Zarządzane przez Polar',

  'billing.cancel.title': 'Anuluj subskrypcję',
  'billing.cancel.beforeTrialEnd':
    'Anuluj teraz, a nie poniesiesz żadnych opłat. Zachowujesz każdą funkcję do {date}.',
  'billing.cancel.afterTrial': 'Zachowujesz dostęp do {date}. Po zakończeniu nic nie jest usuwane.',
  'billing.cancel.confirm': 'Anuluj subskrypcję',
  'billing.cancel.confirmed': 'Anulowano. Nie zostaniesz obciążony żadną opłatą.',
  'billing.cancel.keepData':
    'Twoje wersje robocze, rachunki i analizy pozostają w tym obszarze roboczym.',

  'billing.usage.title': 'Wykorzystanie',
  'billing.usage.meteredNote':
    'Niektóre koszty dostawcy są przenoszone na koszt, ponieważ dostawca pobiera opłaty za operację.',
  'billing.usage.xCharges':
    'X opłat za każdy post. Posty zawierające adres URL kosztują więcej niż zwykły tekst.',
  'billing.usage.balance': 'Saldo wykorzystania {amount}',
  'billing.usage.estimatedBeforeAction': 'To działanie jest szacowane na {amount}.',
  'billing.usage.periodTotal': '{amount} używane od {date}',
  'billing.usage.noMediaCredits':
    'Nie ma przypisów do wygenerowania obrazów ani filmów, ponieważ Post Array nie generuje multimediów.',

  'billing.downgrade.overLimit':
    'W tym obszarze roboczym znajduje się {count, plural, one {# kanał} other {# kanały} few {# kanały} many {# kanały}} przekroczył limit. Nowe akcje na tych kanałach są blokowane. Nic nie jest dla Ciebie odłączone.',

  'billing.mediaGeneration.title': 'Dlaczego nie generujemy obrazów ani filmów',
  'billing.mediaGeneration.explanation':
    'Koncentrujemy się na pomaganiu Ci w planowaniu, zatwierdzaniu, publikowaniu i uczeniu się. Nie generujemy obrazów ani filmów w wersji 1, ponieważ media gotowe do marki wymagają czegoś więcej niż krótkiego podpowiedzi: wymagają kompletnego systemu wizualnego, dokładnych szczegółów produktu, licencjonowanych zasobów, osób i pozwoleń na użytkowanie oraz dokładnego przeglądu. Modele kreatywne również szybko się zmieniają. Polecamy aktualnie sprawdzone specjalistyczne narzędzia i ułatwiamy wprowadzenie ich gotowych prac do Twoich kampanii, zachowując jednocześnie kontrolę nad kreacją.',

  'billing.referral.title': 'Polecani',
  'billing.referral.disclosure':
    'Linki polecające muszą być ujawniane wszędzie tam, gdzie je udostępniasz. Komisja nigdy nie jest uzależniona od pozytywnej recenzji.',
  'billing.referral.link': 'Twój link polecający',
  'billing.referral.attributed':
    '{count, plural, one {# przypisana rejestracja} other {# przypisane rejestracje} few {# przypisane rejestracje} many {# przypisane rejestracje}}',
  'billing.referral.commissionPending': 'Oczekuje, wstrzymane do zamknięcia okna zwrotu środków',
  'billing.referral.commissionApproved': 'Zatwierdzono',
  'billing.referral.commissionReversed': 'Cofnięto po zwrocie środków',
  'billing.referral.payout': 'Wypłaty trwają {schedule}.',
} as const;
