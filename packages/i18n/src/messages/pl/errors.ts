/**
 * One entry per `RelayError` code.
 *
 * Every code has `error.<code>.message`, the sentence a person reads, and
 * `error.<code>.action`, what they can do next. Messages name the account or
 * the action. They never leak a provider payload, a token or an internal ID.
 */
export const errorMessages = {
  'error.unknown.message': 'Coś poszło nie tak i nie mogliśmy tego sklasyfikować.',
  'error.unknown.action':
    'Spróbuj ponownie. Jeśli problem będzie się powtarzał, prześlij nam numer referencyjny poniżej.',
  'error.internal.message': 'To problem po naszej stronie, a nie związany z Twoją treścią.',
  'error.internal.action':
    'Twoja praca została zapisana. Zostaliśmy zaalarmowani. Spróbuj ponownie za kilka minut.',
  'error.not_implemented.message': 'Przekaźnik jeszcze tego nie zbudował.',
  'error.not_implemented.action':
    'Śledź dziennik zmian, aby dowiedzieć się, kiedy zostanie dostarczony.',
  'error.offline.message': 'Jesteś offline.',
  'error.offline.action':
    'Twoja wersja robocza jest przechowywana na tym urządzeniu. Publikowanie i planowanie zostaną wznowione po przywróceniu połączenia.',
  'error.network_unreachable.message': 'Nie mogliśmy połączyć się z serwerem.',
  'error.network_unreachable.action': 'Sprawdź połączenie i spróbuj ponownie. Nic nie zginęło.',
  'error.request_invalid.message': 'Żądanie nie było w formie, którą możemy zaakceptować.',
  'error.request_invalid.action': 'Sprawdź pola wymienione poniżej i wyślij ponownie.',
  'error.validation_failed.message':
    'Niektóre pola wymagają zmiany, zanim będzie można je zapisać.',
  'error.validation_failed.action': 'Napraw podświetlone pola.',
  'error.unauthenticated.message': 'Aby to zrobić, musisz się zalogować.',
  'error.unauthenticated.action': 'Zaloguj się, a my Cię tu przeniesiemy.',
  'error.session_expired.message': 'Twoja sesja wygasła.',
  'error.session_expired.action': 'Zaloguj się ponownie. Twoja wersja robocza została zapisana.',
  'error.mfa_required.message': 'To działanie wymaga potwierdzenia dwuskładnikowego.',
  'error.mfa_required.action': 'Potwierdź w aplikacji uwierzytelniającej, aby kontynuować.',
  'error.forbidden.message': 'Twoja rola nie pozwala na tę akcję.',
  'error.forbidden.action':
    'Poproś właściciela lub administratora tego obszaru roboczego o dostęp.',
  'error.insufficient_scope.message': 'To dane uwierzytelniające nie mają zakresu {scope}.',
  'error.insufficient_scope.action':
    'Przyznaj ten zakres lub użyj danych uwierzytelniających, które już go zawierają.',
  'error.workspace_not_found.message':
    'Ten obszar roboczy nie istnieje lub nie jesteś jego członkiem.',
  'error.workspace_not_found.action': 'Wybierz obszar roboczy, do którego należysz.',
  'error.workspace_suspended.message': 'Ten obszar roboczy jest zawieszony.',
  'error.workspace_suspended.action':
    'Skontaktuj się z pomocą techniczną, aby rozwiązać ten problem. Twoje dane są nienaruszone.',
  'error.not_found.message': 'Ten przedmiot już nie istnieje.',
  'error.not_found.action': 'Mógł zostać usunięty. Wróć i odśwież listę.',
  'error.conflict.message': 'Ktoś inny zmienił to, gdy nad tym pracowałeś.',
  'error.conflict.action': 'Przejrzyj obie wersje, a następnie zapisz ponownie.',
  'error.idempotency_key_reused.message':
    'Ten klucz idempotencji został już użyty w innym żądaniu.',
  'error.idempotency_key_reused.action':
    'Użyj nowego klucza lub powtórz dokładnie oryginalne żądanie.',
  'error.rate_limited.message': 'Zbyt wiele żądań.',
  'error.rate_limited.action': 'Spróbuj ponownie po {time}.',
  'error.quota_exceeded.message': 'To działanie przekroczyło limit dla bieżącego okresu.',
  'error.quota_exceeded.action': 'Limit resetuje się {relativeTime}.',
  'error.payment_required.message': 'Ten obszar roboczy nie ma aktywnej subskrypcji.',
  'error.payment_required.action':
    'Rozpocznij subskrypcję, aby opublikować ponownie. Nic nie zostało usunięte.',
  'error.subscription_past_due.message': 'Ostatnia płatność nie została zrealizowana.',
  'error.subscription_past_due.action': 'Zaktualizuj metodę płatności w portalu Polar.',
  'error.trial_expired.message': 'Próba zakończyła się {date}.',
  'error.trial_expired.action': 'Rozpocznij subskrypcję, aby kontynuować publikowanie.',
  'error.entitlement_missing.message': 'Ten obszar roboczy nie ma dostępu do tej funkcji.',
  'error.entitlement_missing.action':
    'Sprawdź ustawienia rozliczeń lub skontaktuj się z pomocą techniczną.',
  'error.channel_limit_reached.message':
    'W tym obszarze roboczym używane są już wszystkie {limit} aktywne kanały.',
  'error.channel_limit_reached.action': 'Odłącz kanał przed podłączeniem kolejnego.',
  'error.project_limit_reached.message':
    'Ten obszar roboczy używa już wszystkich {limit} aktywnych projektów.',
  'error.project_limit_reached.action':
    'Zarchiwizuj nieaktywny projekt lub zmień limit projektów obszaru roboczego.',
  'error.project_has_connections.message':
    'Ten projekt ma jeszcze {connected, plural, one {# połączony kanał} few {# połączone kanały} many {# połączonych kanałów} other {# połączonego kanału}}.',
  'error.project_has_connections.action': 'Odłącz każdy kanał w tym projekcie przed jego zarchiwizowaniem.',
  'error.project_last_active.message': 'Obszar roboczy musi zachować co najmniej jeden aktywny projekt.',
  'error.project_last_active.action': 'Utwórz inny projekt przed zarchiwizowaniem tego.',
  'error.connection_not_found.message': 'Tego połączenia nie ma już w tym obszarze roboczym.',
  'error.connection_not_found.action': 'Połącz konto ponownie, aby dalej publikować na nim.',
  'error.connection_revoked.message': '{account} cofnął dostęp w dniu {provider}.',
  'error.connection_revoked.action':
    'Połącz ponownie konto. Zaplanowane posty zostaną wznowione po tym czasie.',
  'error.connection_expired.message': 'Dostęp dla {account} wygasło.',
  'error.connection_expired.action':
    'Połącz ponownie konto, aby przywrócić publikowanie i analizy.',
  'error.connection_paused.message': '{account} zostało wstrzymane.',
  'error.connection_paused.action': 'Wznów działanie w Połączeniach, gdy będziesz gotowy.',
  'error.connection_permission_missing.message':
    '{account} nie udzielił wymaganego do tego pozwolenia.',
  'error.connection_permission_missing.action':
    'Połącz ponownie i zaakceptuj {permission} na ekranie zgody.',
  'error.connection_account_type_invalid.message':
    'Instagram potrzebuje konta profesjonalnego. {account} to konto osobiste.',
  'error.connection_account_type_invalid.action':
    'Przełącz je na konto firmowe lub twórcy w aplikacji Instagram, a następnie połącz się ponownie.',
  'error.connection_review_pending.message':
    '{provider} nadal sprawdza tę aplikację dla {account}.',
  'error.connection_review_pending.action':
    'Posty są publikowane prywatnie do czasu zatwierdzenia recenzji. Aktualizujemy tę stronę, gdy się zmienia.',
  'error.capability_unsupported.message':
    '{provider} nie oferuje tego za pośrednictwem oficjalnego interfejsu API.',
  'error.capability_unsupported.action': 'Użyj formatu obsługiwanego przez to konto.',
  'error.capability_not_implemented.message':
    'Przekaźnik nie zbudował tego dla {provider} jeszcze.',
  'error.capability_not_implemented.action':
    'Strona możliwości zawiera listę możliwości każdego złącza na dzień dzisiejszy.',
  'error.capability_requires_review.message':
    '{provider} przyznaje to dopiero po sprawdzeniu aplikacji lub konta.',
  'error.capability_requires_review.action':
    'Pozostaje niedostępny do czasu zakończenia tej recenzji.',
  'error.content_invalid.message': '{provider} nie zaakceptuje tej treści dla {account}.',
  'error.content_invalid.action':
    'Problemy są wymienione w miejscu docelowym. Napraw je i spróbuj ponownie.',
  'error.content_changed_after_approval.message': 'Ten post został zmieniony po zatwierdzeniu.',
  'error.content_changed_after_approval.action':
    'Poproś o ponowne zatwierdzenie, zanim będzie można opublikować.',
  'error.duplicate_content.message':
    'Bardzo podobna treść została opublikowana w {account} {relativeTime}.',
  'error.duplicate_content.action':
    'Zmień tekst lub opublikuj go później. Platformy ograniczają duplikowanie postów.',
  'error.cadence_limit_reached.message':
    '{account} osiągnął częstotliwość publikowania ustawioną dla tego obszaru roboczego.',
  'error.cadence_limit_reached.action': 'Zaplanuj to na później lub zwiększ limit rytmu.',
  'error.media_invalid.message': 'Tego pliku nie można opublikować w {provider}.',
  'error.media_invalid.action': 'Dokładny limit jest pokazany obok pliku.',
  'error.media_too_large.message': 'Ten plik jest większy niż {provider} akceptuje.',
  'error.media_too_large.action':
    'Skompresuj lub prześlij mniejszą wersję. Oryginał zostaje zachowany.',
  'error.media_processing_failed.message': 'Nie mogliśmy przygotować tego pliku dla {provider}.',
  'error.media_processing_failed.action': 'Spróbuj przesłać go ponownie lub użyj innego formatu.',
  'error.media_rights_undeclared.message': 'Ten nośnik nie zawiera deklaracji praw.',
  'error.media_rights_undeclared.action':
    'Potwierdź, że masz prawa do jego opublikowania, łącznie z wszystkimi znajdującymi się na nim osobami.',
  'error.alt_text_required.message': 'Ten obraz wymaga tekstu alternatywnego dla {provider}.',
  'error.alt_text_required.action': 'Opisz obraz lub oznacz go jako dekoracyjny.',
  'error.approval_required.message': 'Ten obszar roboczy wymaga zatwierdzenia przed publikacją.',
  'error.approval_required.action': 'Poproś o zatwierdzenie od {approver}.',
  'error.approval_expired.message': 'Zatwierdzenie tego wpisu wygasło {date}.',
  'error.approval_expired.action': 'Poproś o ponowne zatwierdzenie.',
  'error.schedule_in_past.message': 'Ten czas już minął {timeZone}.',
  'error.schedule_in_past.action': 'Wybierz późniejszy termin lub opublikuj teraz.',
  'error.schedule_conflict.message': '{account} ma już post w {duration} tego czasu.',
  'error.schedule_conflict.action':
    'Przesuń jeden z nich lub kontynuuj, jeśli taki odstęp jest zamierzony.',
  'error.time_zone_invalid.message': 'Nie rozpoznajemy strefy czasowej {timeZone}.',
  'error.time_zone_invalid.action': 'Wybierz strefę z listy.',
  'error.destination_unavailable.message':
    'Miejsce docelowe {destination} nie jest już dostępny w {provider}.',
  'error.destination_unavailable.action': 'Odśwież listę miejsc docelowych i wybierz inną.',
  'error.mention_unresolved.message':
    'Wzmianka nie została dopasowana do prawdziwej {provider} konto.',
  'error.mention_unresolved.action':
    'Wyszukaj i wybierz konto lub usuń wzmiankę. Nigdy nie publikujemy fałszywych tagów natywnych.',
  'error.provider_transient.message': '{provider} nie mógł tego teraz przetworzyć.',
  'error.provider_transient.action': 'Spróbujemy automatycznie. Nic nie jest duplikowane.',
  'error.provider_permanent.message': '{provider} odrzucił to i nie zaakceptuje ponownej próby.',
  'error.provider_permanent.action': 'Odkażona odpowiedź znajduje się na paragonie.',
  'error.provider_rate_limited.message': '{provider} szybkość ograniczała ten obszar roboczy.',
  'error.provider_rate_limited.action': 'Spróbujemy ponownie po {time}.',
  'error.provider_unavailable.message': '{provider} nie odpowiada.',
  'error.provider_unavailable.action': 'Sprawdź stronę stanu. Zaplanowane posty są ponawiane.',
  'error.provider_content_rejected.message':
    '{provider} odrzucił tę treść zgodnie ze swoimi własnymi zasadami.',
  'error.provider_content_rejected.action':
    'Powód podany jest na paragonie. Edytuj treść lub odwołaj się za pomocą {provider}.',
  'error.user_action_required.message':
    '{account} potrzebuje czegoś od Ciebie, zanim będzie mogło opublikować.',
  'error.user_action_required.action': 'Otwórz połączenie, aby zobaczyć, czego brakuje.',
  'error.short_link_destination_blocked.message': 'Nie można skrócić tego miejsca docelowego.',
  'error.short_link_destination_blocked.action':
    'Sieci prywatne, niebezpieczne schematy i znane miejsca docelowe powodujące nadużycia są blokowane.',
  'error.short_link_domain_unverified.message': 'Domena {domain} nie został jeszcze zweryfikowany.',
  'error.short_link_domain_unverified.action':
    'Dodaj rekord DNS pokazany w ustawieniach, a następnie sprawdź.',
  'error.rss_feed_invalid.message': 'Ten adres URL nie zwrócił prawidłowego kanału RSS lub Atom.',
  'error.rss_feed_invalid.action':
    'Sprawdź adres. Pobieramy go bezpiecznie i nie stosujemy żadnych prywatnych przekierowań.',
  'error.webhook_signature_invalid.message': 'Podpis tego webhooka nie został zweryfikowany.',
  'error.webhook_signature_invalid.action':
    'Sprawdź, czy nadawca używa bieżącego sekretu podpisu. Ładunek nie został przetworzony.',
  'error.webhook_delivery_failed.message': 'Dostawa do {endpoint} nie powiodło się.',
  'error.webhook_delivery_failed.action':
    'Ponawiamy próbę z wycofywaniem. Dziennik dostaw zawiera odpowiedź.',
  'error.automation_rule_not_permitted.message':
    'Ta reguła złamałaby regułę platformy, więc nie można jej utworzyć.',
  'error.automation_rule_not_permitted.action':
    'Automatyczne polubienia, obserwowanie, niechciane odpowiedzi i zduplikowane masowe publikowanie nigdy nie są dostępne.',
  'error.ai_unavailable.message': 'Asystent pisania jest obecnie niedostępny.',
  'error.ai_unavailable.action': 'Twój tekst jest nietknięty. Spróbuj ponownie wkrótce.',
  'error.ai_output_invalid.message': 'Asystent zwrócił coś, czego nie mogliśmy sprawdzić.',
  'error.ai_output_invalid.action':
    'Do Twojej wersji roboczej nic nie zostało zastosowane. Spróbuj ponownie.',
  'error.ai_budget_exceeded.message': 'W tym obszarze roboczym osiągnięto już limit asystentów.',
  'error.ai_budget_exceeded.action':
    'Limit resetuje się {relativeTime}. Ręczne pisanie nadal działa.',
  'error.storage_unavailable.message':
    'Nie udało nam się uzyskać dostępu do pamięci multimedialnej.',
  'error.storage_unavailable.action':
    'Twój tekst został zapisany. Spróbuj przesłać ponownie za chwilę.',
  'error.export_unavailable.message': 'Nie udało się wygenerować tego eksportu.',
  'error.export_unavailable.action':
    'Wypróbuj mniejszy zakres lub skontaktuj się z pomocą techniczną i podaj referencję.',

  'error.reference': 'Odniesienie {correlationId}',
  'error.reportToSupport': 'Wyślij to do wsparcia',
  'error.contentPreserved': 'Twoja treść zostanie zachowana. Nic nie zostało opublikowane.',
} as const;
