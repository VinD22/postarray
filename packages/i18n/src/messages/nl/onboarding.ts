/** First run: checkout, workspace, role, first connection, first post. */
export const onboardingMessages = {
  'onboarding.title': 'Stel Post Array in',
  'onboarding.progress': 'Stap {current} van {total}',
  'onboarding.skipForNow': 'Overslaan voor nu',
  'onboarding.goal': 'Een geverifieerd gepland bericht in minder dan tien minuten.',

  'onboarding.plan.title': 'Kies hoe je wilt betalen',
  'onboarding.plan.help': 'Eén abonnement, elke functie. Wijzig het interval wanneer u maar wilt.',

  'onboarding.workspace.title': 'Geef uw werkruimte een naam',
  'onboarding.workspace.namePlaceholder': 'Uw bedrijfs- of klantnaam',
  'onboarding.workspace.timeZone': 'Tijdzone voor planning',
  'onboarding.workspace.timeZoneHelp':
    'Elke geplande tijd wordt in deze zone opgeslagen, zodat een klokverandering uw post nooit per ongeluk verplaatst.',
  'onboarding.workspace.locale': 'Interfacetaal',

  'onboarding.role.title': 'Wat beschrijft jou het beste?',
  'onboarding.role.creator': 'Schepper',
  'onboarding.role.team': 'In-house-team',
  'onboarding.role.agency': 'Agentschap',
  'onboarding.role.developer': 'Ontwikkelaar of agentbouwer',
  'onboarding.role.help':
    'Dit verandert de standaardinstellingen die wij voorstellen. Je kunt alles later wijzigen.',

  'onboarding.connect.title': 'Koppel uw eerste account',
  'onboarding.connect.help':
    'We laten u precies zien welke machtigingen voor elk platform worden gevraagd voordat u iets goedkeurt.',
  'onboarding.connect.skipNote':
    'U kunt eerst verkennen met het voorbeeldaccount. Er wordt niets van gepubliceerd.',
  'onboarding.connect.success': '{account} is verbonden.',

  'onboarding.content.title': 'Begin met iets dat je al hebt',
  'onboarding.content.useAsset': 'Gebruik een afbeelding of video',
  'onboarding.content.useBrief': 'Begin met een korte briefing',
  'onboarding.content.useText': 'Schrijf het zelf',

  'onboarding.preview.title': 'Dit is wat zal worden gepubliceerd',
  'onboarding.preview.help': 'Een echt voorbeeld van de platformregels voor dit account.',

  'onboarding.schedule.title': 'Kies wanneer het uitgaat',
  'onboarding.schedule.help':
    'Bekijk het tijdstip, de privacy-instelling, de openbaarmaking en de geschatte providerkosten.',

  'onboarding.done.title': 'Gepland',
  'onboarding.done.body': 'Je bericht is gepland voor {time} in {timeZone}.',
  'onboarding.done.nextStep.title': 'Wat nu te doen',
  'onboarding.done.nextStep.connectMore': 'Koppel een ander account',
  'onboarding.done.nextStep.inviteTeam': 'Nodig een teamgenoot uit',
  'onboarding.done.nextStep.setApproval': 'Stel een goedkeuringsbeleid in',
  'onboarding.done.nextStep.exploreApi': 'Verken de API- en MCP-server',

  'onboarding.checklist.title': 'Aan de slag',
  'onboarding.checklist.connectAccount': 'Koppel een account',
  'onboarding.checklist.firstPost': 'Publiceer of plan een bericht',
  'onboarding.checklist.inviteTeammate': 'Nodig een teamgenoot uit',
  'onboarding.checklist.setProjectVoice': 'Beschrijf uw projectstem',
  'onboarding.checklist.tryAutomation': 'Probeer een automatiseringsregel',
  'onboarding.checklist.remaining':
    '{count, plural, =0 {Alles gedaan} one {# stap naar links} other {# stappen naar links}}',
} as const;
