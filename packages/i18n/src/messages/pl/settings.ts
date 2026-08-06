/** Workspace settings: members, roles, brands, localization, security, data. */
export const settingsMessages = {
  'settings.title': 'Ustawienia',
  'settings.saved': 'Zapisano',
  'settings.unsavedChanges': 'Masz niezapisane zmiany.',

  'settings.workspace.title': 'Przestrzeń robocza',
  'settings.workspace.name': 'Nazwa obszaru roboczego',
  'settings.workspace.defaultTimeZone': 'Domyślna strefa czasowa',
  'settings.workspace.defaultLocale': 'Domyślny język interfejsu',
  'settings.workspace.defaultContentLocale': 'Domyślny język treści',
  'settings.workspace.transferOwnership': 'Przeniesienie własności',
  'settings.workspace.delete': 'Usuń obszar roboczy',
  'settings.workspace.deleteWarning':
    'Usunięcie obszaru roboczego anuluje zaplanowane posty, unieważnia połączenia i usuwa zapisane multimedia. Paragony są przechowywane przez okres przechowywania określony w Warunkach.',

  'settings.members.title': 'Członkowie i role',
  'settings.members.invite': 'Zaproś osoby',
  'settings.members.inviteEmail': 'Adres e-mail',
  'settings.members.inviteSent': 'Zaproszenie wysłane do {email}.',
  'settings.members.pending': 'Zaproszono, jeszcze nie zaakceptowano',
  'settings.members.count':
    '{count, plural, one {# członek} other {# członkowie} few {# członkowie} many {# członkowie}}',
  'settings.members.removeConfirm':
    'Usuń {name} z tego obszaru roboczego? Ich wcześniejsze działania pozostają w dzienniku audytu.',
  'settings.role.owner.label': 'Właściciel',
  'settings.role.admin.label': 'Administrator',
  'settings.role.manager.label': 'Menedżer',
  'settings.role.editor.label': 'Edytor',
  'settings.role.approver.label': 'Zatwierdzający',
  'settings.role.analyst.label': 'Analityk',
  'settings.role.viewer.label': 'Przeglądający',
  'settings.role.owner.description': 'Wszystko, w tym rozliczenia, bezpieczeństwo i usuwanie.',
  'settings.role.admin.description': 'Wszystko oprócz rozliczeń i usunięcia obszaru roboczego.',
  'settings.role.manager.description':
    'Zarządzaj markami, połączeniami, harmonogramami i zasadami.',
  'settings.role.editor.description': 'Twórz i edytuj treści, poproś o zatwierdzenie.',
  'settings.role.approver.description': 'Zatwierdź lub odrzuć treść i zaplanuj zatwierdzenie.',
  'settings.role.analyst.description': 'Przeczytaj statystyki i rachunki.',
  'settings.role.viewer.description': 'Tylko do odczytu.',
  'settings.role.scopeLabel': 'Ograniczenie do marek i kont',
  'settings.role.mfaRequired': 'Właściciele muszą korzystać z uwierzytelniania dwuskładnikowego.',

  'settings.brands.title': 'Marki',
  'settings.brands.add': 'Dodaj markę',
  'settings.brands.voice': 'Głos',
  'settings.brands.audience': 'Odbiorcy',
  'settings.brands.approvedClaims': 'Zatwierdzone roszczenia',
  'settings.brands.blockedTerms': 'Zablokowane terminy',
  'settings.brands.disclosureDefaults': 'Domyślne ustawienia ujawniania informacji',
  'settings.brands.domains': 'Domeny',
  'settings.brands.glossary.title': 'Słownik',
  'settings.brands.glossary.term': 'Termin',
  'settings.brands.glossary.preferred': 'Preferowane tłumaczenie',
  'settings.brands.glossary.prohibited': 'Nie tłumacz jako',
  'settings.brands.glossary.context': 'Kontekst',
  'settings.brands.glossary.keepUntranslated': 'Zachowaj nieprzetłumaczone',
  'settings.brands.localeRules.title': 'Reguły regionalne',
  'settings.brands.localeRules.formality': 'Formalność',
  'settings.brands.localeRules.pronouns': 'Zaimki i zwroty grzecznościowe',
  'settings.brands.localeRules.idioms': 'Idiomy, których należy unikać',
  'settings.brands.localeRules.emoji': 'Normy dotyczące emoji i hashtagów',
  'settings.brands.localeRules.legal': 'Regionalne informacje prawne',
  'settings.brands.localeRules.cta': 'Wezwanie do działania przez rynek',
  'settings.brands.localeRules.reviewedExamples':
    'Przykłady zatwierdzone przez natywnego recenzenta',

  'settings.sets.title': 'Zestawy',
  'settings.sets.description':
    'Grupa celów, wariantów, ustawień, komentarzy i opóźnień wielokrotnego użytku. Zastosowanie zestawu tworzy niezależny szkic.',
  'settings.sets.editNote':
    'Edytowanie zestawu nie powoduje zmiany postów, które są już zatwierdzone lub zaplanowane.',
  'settings.signatures.title': 'Podpisy',
  'settings.signatures.description':
    'Tekst końcowy, hashtagi, linki lub ujawnienia, w zakresie marki, platformy i języka.',
  'settings.signatures.autoApply': 'Dodaj automatycznie, gdy kontekst pasuje',

  'settings.localization.title': 'Lokalizacja',
  'settings.localization.interfaceLocale': 'Język interfejsu',
  'settings.localization.interfaceLocaleHelp':
    'Język tej aplikacji dla Ciebie. Nie zmienia to języka Twoich postów.',
  'settings.localization.contentLocales': 'Języki treści',
  'settings.localization.contentLocalesHelp':
    'Języki, w których publikujesz. Każda marka może ustawić zasady i glosariusz dla każdego języka.',
  'settings.localization.marketLocales': 'Rynki odbiorców',
  'settings.localization.beta': 'Tłumaczenie wersji beta',
  'settings.localization.betaHelp':
    'Ten język jest wspomagany maszynowo i nie został jeszcze w pełni sprawdzony przez osobę. Nieprzetłumaczony tekst wraca do języka angielskiego.',
  'settings.localization.humanReviewed': 'Recenzja przez native speakera',
  'settings.localization.timeZone': 'Strefa czasowa',
  'settings.localization.weekStart': 'Pierwszy dzień tygodnia',
  'settings.localization.hourCycle.label': 'Format czasu',
  'settings.localization.hourCycle.h12': '12 godzin',
  'settings.localization.hourCycle.h23': '24 godziny',

  'settings.notifications.title': 'Powiadomienia',
  'settings.notifications.email': 'E-mail',
  'settings.notifications.inApp': 'W aplikacji',
  'settings.notifications.approvalRequests': 'Prośby o zatwierdzenie',
  'settings.notifications.publishResults': 'Opublikuj wyniki',
  'settings.notifications.connectionHealth': 'Stan połączenia',
  'settings.notifications.ruleFailures': 'Awarie automatyki',
  'settings.notifications.weeklySummary': 'Podsumowanie tygodniowe',
  'settings.notifications.digestOnly': 'Zgrupuj je w jedną codzienną wiadomość',

  'settings.security.title': 'Bezpieczeństwo',
  'settings.security.mfa': 'Uwierzytelnianie dwuskładnikowe',
  'settings.security.mfaEnable': 'Włącz uwierzytelnianie dwuskładnikowe',
  'settings.security.mfaRequiredFor':
    'Wymagane w przypadku zmian w rozliczeniach, kont usługowych, ponownego łączenia konta i unieważniania danych uwierzytelniających.',
  'settings.security.passkeys': 'Klucze dostępu',
  'settings.security.sessions': 'Aktywne sesje',
  'settings.security.sessionRevoke': 'Wyloguj się z tej sesji',
  'settings.security.auditLog.title': 'Dziennik audytu',
  'settings.security.auditLog.description':
    'Każda czynność, kto lub co ją wykonało i kiedy. Możliwość eksportu przez właścicieli i administratorów.',
  'settings.security.killSwitch': 'Zatrzymanie awaryjne',
  'settings.security.killSwitchBody':
    'Natychmiast zatrzymuje każdą zaplanowaną publikację i automatyzację w tym obszarze roboczym. Nic nie jest usuwane. Możesz to wyłączyć ponownie.',
  'settings.security.killSwitchActive':
    'Zatrzymanie awaryjne jest włączone. Żaden post nie zostanie opublikowany.',

  'settings.data.title': 'Kontrola danych',
  'settings.data.export': 'Eksportuj swoje dane',
  'settings.data.exportPreparing':
    'Przygotowywanie eksportu. Wyślemy Ci e-mail, gdy będzie gotowy.',
  'settings.data.deletionRequest': 'Poproś o usunięcie',
  'settings.data.deletionExplain':
    'Usunięcie anuluje zaplanowane przepływy pracy, odbiera dostęp dostawcy, usuwa zapisane multimedia i analizy nagrobków tam, gdzie dostawca tego wymaga.',
  'settings.data.retention': 'Przechowywanie',
  'settings.data.consents': 'Zgody',
  'settings.data.consent.productAnalytics': 'Analiza produktu',
  'settings.data.consent.diagnostics': 'Udostępnij diagnostykę ze wsparciem',
  'settings.data.consent.aiImprovement':
    'Wykorzystaj moje treści, aby ulepszyć asystenta. Ta opcja jest wyłączona, chyba że ją włączysz.',
  'settings.data.consent.marketingEmail': 'Nowości o produktach e-mailem',
} as const;
