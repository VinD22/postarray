/** First run: checkout, workspace, role, first connection, first post. */
export const onboardingMessages = {
  'onboarding.title': 'Nastavit relé',
  'onboarding.progress': 'Krok {current} z {total}',
  'onboarding.skipForNow': 'Prozatím přeskočit',
  'onboarding.goal': 'Ověřený naplánovaný příspěvek za méně než deset minut.',

  'onboarding.plan.title': 'Vyberte si, jak chcete platit',
  'onboarding.plan.help': 'Jeden plán, každá funkce. Změňte interval, kdykoli budete chtít.',

  'onboarding.workspace.title': 'Pojmenujte svůj pracovní prostor',
  'onboarding.workspace.namePlaceholder': 'Jméno vaší společnosti nebo klienta',
  'onboarding.workspace.timeZone': 'Časové pásmo pro plánování',
  'onboarding.workspace.timeZoneHelp':
    'V této zóně je uložen každý naplánovaný čas, takže změna času nikdy neposune váš příspěvek náhodně.',
  'onboarding.workspace.locale': 'Jazyk rozhraní',

  'onboarding.role.title': 'Co vás nejlépe vystihuje?',
  'onboarding.role.creator': 'Tvůrce',
  'onboarding.role.team': 'Vlastní tým',
  'onboarding.role.agency': 'Agentura',
  'onboarding.role.developer': 'Tvůrce vývojářů nebo agentů',
  'onboarding.role.help':
    'Toto změní výchozí hodnoty, které navrhujeme. Vše můžete později změnit.',

  'onboarding.connect.title': 'Připojte svůj první účet',
  'onboarding.connect.help':
    'Předtím, než cokoli schválíte, vám přesně ukážeme, o která oprávnění jsou jednotlivé platformy požadovány.',
  'onboarding.connect.skipNote':
    'Nejprve můžete prozkoumat pomocí ukázkového účtu. Nic se z něj nepublikuje.',
  'onboarding.connect.success': '{account} je připojen.',

  'onboarding.content.title': 'Začněte s něčím, co již máte',
  'onboarding.content.useAsset': 'Použít obrázek nebo video',
  'onboarding.content.useBrief': 'Začněte krátkým briefem',
  'onboarding.content.useText': 'Napište to sami',

  'onboarding.preview.title': 'Toto bude zveřejněno',
  'onboarding.preview.help': 'Skutečný náhled z pravidel platformy pro tento účet.',

  'onboarding.schedule.title': 'Vyberte, kdy zhasne',
  'onboarding.schedule.help':
    'Zkontrolujte čas, nastavení soukromí, zveřejnění a odhadované náklady poskytovatele.',

  'onboarding.done.title': 'Naplánováno',
  'onboarding.done.body': 'Váš příspěvek je naplánován na {time} v {timeZone}.',
  'onboarding.done.nextStep.title': 'Co dělat dále',
  'onboarding.done.nextStep.connectMore': 'Připojit další účet',
  'onboarding.done.nextStep.inviteTeam': 'Pozvat spoluhráče',
  'onboarding.done.nextStep.setApproval': 'Nastavit zásady schvalování',
  'onboarding.done.nextStep.exploreApi': 'Prozkoumejte rozhraní API a MCP server',

  'onboarding.checklist.title': 'Začínáme',
  'onboarding.checklist.connectAccount': 'Připojit účet',
  'onboarding.checklist.firstPost': 'Publikujte nebo naplánujte příspěvek',
  'onboarding.checklist.inviteTeammate': 'Pozvat spoluhráče',
  'onboarding.checklist.setProjectVoice': 'Popište hlas svého projektu',
  'onboarding.checklist.tryAutomation': 'Vyzkoušejte pravidlo automatizace',
  'onboarding.checklist.remaining':
    '{count, plural, =0 {Vše hotovo} one {# krok doleva} other {# kroky doleva} few {# kroky doleva} many {# kroky doleva}}',
} as const;
