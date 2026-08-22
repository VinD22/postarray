/** First run: checkout, workspace, role, first connection, first post. */
export const onboardingMessages = {
  'onboarding.title': 'I-set up ang Relay',
  'onboarding.progress': 'Hakbang {current} ng {total}',
  'onboarding.skipForNow': 'Laktawan sa ngayon',
  'onboarding.goal':
    'Isang na-verify na naka-iskedyul na post sa loob ng wala pang sampung minuto.',

  'onboarding.plan.title': 'Piliin kung paano mo gustong magbayad',
  'onboarding.plan.help': 'Isang plano, bawat tampok. Baguhin ang pagitan kung kailan mo gusto.',

  'onboarding.workspace.title': 'Pangalanan ang iyong workspace',
  'onboarding.workspace.namePlaceholder': 'Ang pangalan ng iyong kumpanya o kliyente',
  'onboarding.workspace.timeZone': 'Time zone para sa pag-iiskedyul',
  'onboarding.workspace.timeZoneHelp':
    'Ang bawat naka-iskedyul na oras ay naka-imbak sa zone na ito, kaya ang pagbabago ng orasan ay hindi kailanman gumagalaw sa iyong post nang hindi sinasadya.',
  'onboarding.workspace.locale': 'Wika ng interface',

  'onboarding.role.title': 'Ano ang pinakamahusay na naglalarawan sa iyo?',
  'onboarding.role.creator': 'Tagapaglikha',
  'onboarding.role.team': 'In house team',
  'onboarding.role.agency': 'Ahensya',
  'onboarding.role.developer': 'Developer o tagabuo ng ahente',
  'onboarding.role.help':
    'Binabago nito ang mga default na iminumungkahi namin. Mababago mo ang lahat mamaya.',

  'onboarding.connect.title': 'Ikonekta ang iyong unang account',
  'onboarding.connect.help':
    'Ipapakita namin sa iyo nang eksakto kung aling mga pahintulot ang hinihiling sa bawat platform bago mo aprubahan ang anuman.',
  'onboarding.connect.skipNote':
    'Maaari kang mag-explore gamit ang sample na account muna. Walang nag-publish mula dito.',
  'onboarding.connect.success': '{account} ay konektado.',

  'onboarding.content.title': 'Magsimula sa isang bagay na mayroon ka na',
  'onboarding.content.useAsset': 'Gumamit ng larawan o video',
  'onboarding.content.useBrief': 'Magsimula sa isang maikling brief',
  'onboarding.content.useText': 'Isulat mo ito sa iyong sarili',

  'onboarding.preview.title': 'Ito ang ilalathala',
  'onboarding.preview.help':
    'Isang tunay na preview mula sa mga panuntunan sa platform para sa account na ito.',

  'onboarding.schedule.title': 'Piliin kung kailan ito lumabas',
  'onboarding.schedule.help':
    'Suriin ang oras, ang setting ng privacy, ang pagbubunyag at ang tinantyang halaga ng provider.',

  'onboarding.done.title': 'Naka-iskedyul',
  'onboarding.done.body': 'Ang iyong post ay naka-iskedyul para sa {time} sa {timeZone}.',
  'onboarding.done.nextStep.title': 'Ano ang susunod na gagawin',
  'onboarding.done.nextStep.connectMore': 'Ikonekta ang isa pang account',
  'onboarding.done.nextStep.inviteTeam': 'Mag-imbita ng isang kasamahan sa koponan',
  'onboarding.done.nextStep.setApproval': 'Magtakda ng patakaran sa pag-apruba',
  'onboarding.done.nextStep.exploreApi': 'I-explore ang API at MCP server',

  'onboarding.checklist.title': 'Pagsisimula',
  'onboarding.checklist.connectAccount': 'Ikonekta ang isang account',
  'onboarding.checklist.firstPost': 'Mag-publish o mag-iskedyul ng post',
  'onboarding.checklist.inviteTeammate': 'Mag-imbita ng isang kasamahan sa koponan',
  'onboarding.checklist.setProjectVoice': 'Ilarawan ang boses ng iyong proyekto',
  'onboarding.checklist.tryAutomation': 'Subukan ang isang panuntunan sa automation',
  'onboarding.checklist.remaining':
    '{count, plural, =0 {Tapos na lahat} one {# hakbang pakaliwa} other {# hakbang na natitira}}',
} as const;
