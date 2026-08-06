/** First run: checkout, workspace, role, first connection, first post. */
export const onboardingMessages = {
  'onboarding.title': 'Ställ in relä',
  'onboarding.progress': 'Steg {current} av {total}',
  'onboarding.skipForNow': 'Hoppa över nu',
  'onboarding.goal': 'Ett verifierat schemalagt inlägg på under tio minuter.',

  'onboarding.plan.title': 'Välj hur du vill betala',
  'onboarding.plan.help': 'En plan, varje funktion. Ändra intervallet när du vill.',

  'onboarding.workspace.title': 'Namnge din arbetsyta',
  'onboarding.workspace.namePlaceholder': 'Ditt företags- eller kundnamn',
  'onboarding.workspace.timeZone': 'Tidszon för schemaläggning',
  'onboarding.workspace.timeZoneHelp':
    'Varje schemalagd tid lagras med denna zon, så en klockändring flyttar aldrig ditt inlägg av misstag.',
  'onboarding.workspace.locale': 'Gränssnittsspråk',

  'onboarding.role.title': 'Vad beskriver dig bäst?',
  'onboarding.role.creator': 'Skapare',
  'onboarding.role.team': 'In-house team',
  'onboarding.role.agency': 'byrå',
  'onboarding.role.developer': 'Utvecklare eller agentbyggare',
  'onboarding.role.help':
    'Detta ändrar standardinställningarna vi föreslår. Du kan ändra allt senare.',

  'onboarding.connect.title': 'Anslut ditt första konto',
  'onboarding.connect.help':
    'Vi kommer att visa dig exakt vilka behörigheter varje plattform efterfrågas innan du godkänner något.',
  'onboarding.connect.skipNote':
    'Du kan utforska med exempelkontot först. Ingenting publiceras från det.',
  'onboarding.connect.success': '{account} är ansluten.',

  'onboarding.content.title': 'Börja med något du redan har',
  'onboarding.content.useAsset': 'Använd en bild eller video',
  'onboarding.content.useBrief': 'Börja från en kort brief',
  'onboarding.content.useText': 'Skriv det själv',

  'onboarding.preview.title': 'Detta är vad som kommer att publiceras',
  'onboarding.preview.help': 'En riktig förhandstitt från plattformsreglerna för detta konto.',

  'onboarding.schedule.title': 'Välj när den slocknar',
  'onboarding.schedule.help':
    'Granska tiden, integritetsinställningen, avslöjandet och den beräknade leverantörskostnaden.',

  'onboarding.done.title': 'Schemalagt',
  'onboarding.done.body': 'Ditt inlägg är schemalagt till {time} i {timeZone}.',
  'onboarding.done.nextStep.title': 'Vad du ska göra härnäst',
  'onboarding.done.nextStep.connectMore': 'Anslut ett annat konto',
  'onboarding.done.nextStep.inviteTeam': 'Bjud in en lagkamrat',
  'onboarding.done.nextStep.setApproval': 'Ange en godkännandepolicy',
  'onboarding.done.nextStep.exploreApi': 'Utforska API- och MCP-servern',

  'onboarding.checklist.title': 'Komma igång',
  'onboarding.checklist.connectAccount': 'Anslut ett konto',
  'onboarding.checklist.firstPost': 'Publicera eller schemalägg ett inlägg',
  'onboarding.checklist.inviteTeammate': 'Bjud in en lagkamrat',
  'onboarding.checklist.setBrandVoice': 'Beskriv din varumärkesröst',
  'onboarding.checklist.tryAutomation': 'Prova en automatiseringsregel',
  'onboarding.checklist.remaining':
    '{count, plural, =0 {Allt klart} one {# steg kvar} other {# steg kvar}}',
} as const;
