/** First run: checkout, workspace, role, first connection, first post. */
export const onboardingMessages = {
  'onboarding.title': 'Skonfiguruj przekaźnik',
  'onboarding.progress': 'Krok {current} z {total}',
  'onboarding.skipForNow': 'Na razie pomiń',
  'onboarding.goal': 'Zweryfikowany zaplanowany post w mniej niż dziesięć minut.',

  'onboarding.plan.title': 'Wybierz sposób płatności',
  'onboarding.plan.help': 'Jeden plan, każda funkcja. Zmień interwał, kiedy tylko chcesz.',

  'onboarding.workspace.title': 'Nazwij swój obszar roboczy',
  'onboarding.workspace.namePlaceholder': 'Nazwa Twojej firmy lub klienta',
  'onboarding.workspace.timeZone': 'Strefa czasowa planowania',
  'onboarding.workspace.timeZoneHelp':
    'Każdy zaplanowany czas jest zapisywany w tej strefie, więc zmiana zegara nigdy nie powoduje przypadkowego przeniesienia Twojego postu.',
  'onboarding.workspace.locale': 'Język interfejsu',

  'onboarding.role.title': 'Co najlepiej Cię opisuje?',
  'onboarding.role.creator': 'Twórca',
  'onboarding.role.team': 'Zespół wewnętrzny',
  'onboarding.role.agency': 'Agencja',
  'onboarding.role.developer': 'Programista lub kreator agentów',
  'onboarding.role.help':
    'To zmienia sugerowane przez nas ustawienia domyślne. Możesz wszystko zmienić później.',

  'onboarding.connect.title': 'Połącz swoje pierwsze konto',
  'onboarding.connect.help':
    'Zanim cokolwiek zatwierdzisz, pokażemy Ci dokładnie, o jakie uprawnienia prosi każda platforma.',
  'onboarding.connect.skipNote':
    'Możesz najpierw zapoznać się z przykładowym kontem. Nic z niego nie jest publikowane.',
  'onboarding.connect.success': '{account} jest podłączony.',

  'onboarding.content.title': 'Zacznij od czegoś, co już masz',
  'onboarding.content.useAsset': 'Użyj obrazu lub filmu',
  'onboarding.content.useBrief': 'Zacznij od krótkiego briefu',
  'onboarding.content.useText': 'Napisz to sam',

  'onboarding.preview.title': 'To właśnie opublikujemy',
  'onboarding.preview.help': 'Prawdziwy podgląd zasad platformy dla tego konta.',

  'onboarding.schedule.title': 'Wybierz, kiedy zgaśnie',
  'onboarding.schedule.help':
    'Sprawdź czas, ustawienia prywatności, ujawnienia i szacowany koszt dostawcy.',

  'onboarding.done.title': 'Zaplanowane',
  'onboarding.done.body': 'Twój post został zaplanowany na {time} w {timeZone}.',
  'onboarding.done.nextStep.title': 'Co dalej robić',
  'onboarding.done.nextStep.connectMore': 'Połącz kolejne konto',
  'onboarding.done.nextStep.inviteTeam': 'Zaproś członka drużyny',
  'onboarding.done.nextStep.setApproval': 'Ustaw zasady zatwierdzania',
  'onboarding.done.nextStep.exploreApi': 'Poznaj serwer API i MCP',

  'onboarding.checklist.title': 'Pierwsze kroki',
  'onboarding.checklist.connectAccount': 'Połącz konto',
  'onboarding.checklist.firstPost': 'Opublikuj lub zaplanuj post',
  'onboarding.checklist.inviteTeammate': 'Zaproś członka drużyny',
  'onboarding.checklist.setProjectVoice': 'Opisz głos swojego projektu',
  'onboarding.checklist.tryAutomation': 'Wypróbuj regułę automatyzacji',
  'onboarding.checklist.remaining':
    '{count, plural, =0 {Wszystko gotowe} one {# krok w lewo} other {# kroki w lewo} few {# kroki w lewo} many {# kroki w lewo}}',
} as const;
