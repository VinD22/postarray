/** Weekly digest copy for the Filipino interface. */
export const digestMessages = {
  'digest.title': 'Ngayong linggo',
  'digest.subtitle': 'Kung ano ang nakikita namin mula {windowStart} hanggang {windowEnd}.',
  'digest.empty': 'Wala pang dapat ibuod ngayong linggo. Mag-publish ka at lalabas ito dito.',
  'digest.regenerate': 'Buuing muli ang buod ng linggong ito',
  'digest.generating': 'Binubuo ang buod ng linggong ito',
  'digest.source.deterministic':
    'Isinulat mula sa iyong mga tala ng pag-publish at sariling sukat, nang walang writing assistant.',
  'digest.source.ai':
    'Isinulat ng assistant mula sa iyong sariling mga tala. Bawat numero ay sinuri laban sa kanila.',
  'digest.unavailable.aiOff':
    'Naka-off ang writing assistant, kaya ito ang simpleng bersyon. Walang kulang dito.',
  'digest.unavailable.rejected':
    'Ang bersyon ng assistant ay hindi tumugma sa iyong data kaya itinapon ito. Ito ang simpleng bersyon.',
  'digest.headline.published':
    '{published, plural, =0 {Walang natapos na post} one {# post na natapos} other {# post na natapos}} sa pagitan ng {windowStart} at {windowEnd}.',
  'digest.headline.nothingPublished': 'Walang na-publish sa pagitan ng {windowStart} at {windowEnd}.',
  'digest.outcome.published':
    '{count, plural, one {# post na natapos sa {provider}} other {# post na natapos sa {provider}}}.',
  'digest.outcome.partial':
    '{count, plural, one {# post ay nakarating lamang sa ilan sa mga destinasyon nito sa {provider}} other {# post ay nakarating lamang sa ilan sa mga destinasyon nito sa {provider}}}.',
  'digest.outcome.failed':
    '{count, plural, one {# post ay hindi lumabas sa {provider}} other {# post ay hindi lumabas sa {provider}}}.',
  'digest.metrics.noneYet':
    'Wala pang sukat na dumating ngayong linggo. Ibig sabihin hindi namin alam kung paano gumanap ang mga post na ito, hindi na pangit ang performance nila.',
  'digest.freshness.statement':
    '{label, select, fresh {Huling na-sync ang mga sukat noong {lastObservedAt}.} stale {Hindi na-sync ang mga sukat mula noong {lastObservedAt}, kaya maaaring luma na ang mga numero sa itaas.} other {Wala pang na-sync, kaya walang nasusukat sa itaas.}}',
  'digest.narrative.headline': '{statement}',
  'digest.narrative.observation': '{statement}',
  'digest.narrative.confounder': 'Dapat malaman: {confounder}',
  'digest.narrative.notSupported': '{statement}',
  'digest.narrative.nextAction': '{statement}',
  'digest.settings.title': 'Lingguhang buod sa email',
  'digest.settings.description':
    'Isang maikling email bawat linggo kung ano ang nailabas at kung ano ang nasukat namin. Naka-on bilang default.',
  'digest.settings.enabled': 'Ipadala ang lingguhang buod',
  'email.digest.subject': 'Ang iyong linggo sa {workspaceName}',
  'email.digest.intro':
    'Ito ang nakikita namin para sa {workspaceName} mula {windowStart} hanggang {windowEnd}.',
  'email.digest.noData':
    'Wala kaming naisukat ngayong linggo. Kung may kulang na numero, kulang ito dahil hindi namin ito nabasa, hindi dahil zero ito.',
  'email.digest.footer':
    'Natatanggap mo ito dahil naka-on ang weekly summary para sa {workspaceName}. I-off ito sa mga setting ng workspace.',
} as const;
