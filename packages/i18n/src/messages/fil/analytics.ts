/** Analytics, metric definitions, experiments and tracked links. */
export const analyticsMessages = {
  'analytics.title': 'Analytics',
  'analytics.subtitle':
    'Ano ang nangyari, kung gaano ito kasariwa, at kung ano ang karapat-dapat na pagsubok sa susunod.',
  'analytics.range.7d': 'Huling 7 araw',
  'analytics.range.30d': 'Huling 30 araw',
  'analytics.range.90d': 'Huling 90 araw',
  'analytics.range.custom': 'Custom na hanay',
  'analytics.range.limitedByProvider':
    '{provider} bumabalik sa karamihan {days, plural, one {# araw} other {# araw}} ng kasaysayan para sa account na ito.',
  'analytics.account.select': 'Pumili ng account',
  'analytics.compareTo': 'Kung ikukumpara sa {baseline}',
  'analytics.baseline.trailingMedian':
    'ang iyong median ng nakaraan {count, plural, one {# maihahambing na post} other {# maihahambing na mga post}}',

  'analytics.metric.followers': 'Mga tagasunod',
  'analytics.metric.subscribers': 'Mga subscriber',
  'analytics.metric.profileViews': 'Mga view ng profile',
  'analytics.metric.impressions': 'Mga impression',
  'analytics.metric.reach': 'abutin',
  'analytics.metric.views': 'Mga view',
  'analytics.metric.videoViews': 'Mga view ng video',
  'analytics.metric.watchTime': 'Oras ng panonood',
  'analytics.metric.averageViewDuration': 'Average na tagal ng view',
  'analytics.metric.averageViewPercentage': 'Average na porsyento na tiningnan',
  'analytics.metric.likes': 'Mga gusto at reaksyon',
  'analytics.metric.comments': 'Mga komento at tugon',
  'analytics.metric.shares': 'Shares, reposts at quotes',
  'analytics.metric.saves': 'Sine-save at mga bookmark',
  'analytics.metric.linkClicks': 'Mga pag-click sa link',
  'analytics.metric.clickThroughRate': 'Click through rate',
  'analytics.metric.engagementRate': 'Rate ng pakikipag-ugnayan',
  'analytics.metric.publishedCount': 'Na-publish ang mga post',
  'analytics.metric.followerChange': 'Pagbabago ng tagasunod',

  'analytics.definition.title': 'Paano {metric} ay tinukoy',
  'analytics.definition.provider': 'Iniulat ni {provider} bilang {providerField}.',
  'analytics.definition.denominator.label': 'Denominator: {denominator}.',
  'analytics.definition.unit': 'Yunit: {unit}.',
  'analytics.definition.normalized':
    'Na-normalize mula sa halaga ng provider. Ang hilaw na halaga ay pinananatili at magagamit.',
  'analytics.definition.notComparable':
    '{provider} at {otherProvider} tukuyin ito nang iba. Ihambing ang mga ito nang may pag-iingat.',

  'analytics.value.unavailable': 'Hindi magagamit',
  'analytics.value.unavailableReason.permission':
    'Ang account na ito ay hindi nagbigay ng pahintulot na kailangan para sa sukatang ito.',
  'analytics.value.unavailableReason.unsupported': '{provider} hindi nag-uulat ng sukatang ito.',
  'analytics.value.unavailableReason.tooEarly':
    '{provider} ini-publish ang sukatang ito sa ibang pagkakataon. Suriin muli pagkatapos {time}.',
  'analytics.value.unavailableReason.syncFailed':
    'Nabigo ang huling pag-sync. Sinusubukan naming muli at hindi magpapakita ng nahulaan na numero.',
  'analytics.freshness.synced': 'Naka-sync {relativeTime}',
  'analytics.freshness.stale':
    'Huling matagumpay na pag-sync{relativeTime}. Ito ay maaaring luma na.',
  'analytics.freshness.coverage':
    '{covered} ng {total} may kasalukuyang data ang mga post sa hanay na ito.',

  'analytics.feedback.title': 'Ano ang iminumungkahi nito',
  'analytics.feedback.aboveBaseline':
    'Natanggap ang post na ito {percent} higit pa {metric} kaysa sa {baseline}.',
  'analytics.feedback.belowBaseline':
    'Natanggap ang post na ito {percent} mas kaunti {metric} kaysa sa {baseline}.',
  'analytics.feedback.notComparableFormats':
    'Ang mga post ng larawan at mga post ng video ay hindi direktang maihahambing dito.',
  'analytics.feedback.smallSample':
    'Maliit ang sample. Subukan muli ang parehong kawit bago gumawa ng konklusyon.',
  'analytics.feedback.association':
    'Ang mga komento ay tumaas pagkatapos ng unang pagkaantala ng komento ay nagbago mula sa {before} sa {after}. Ito ay isang asosasyon, hindi patunay ng dahilan.',
  'analytics.feedback.nextTest': 'Ano ang susunod na susuriin',
  'analytics.feedback.doNotInfer': 'Ano ang hindi ipinapakita nito',
  'analytics.feedback.noScore':
    'Walang solong marka ng cross platform dito. Pumili ng sukatan na may kahulugang pinagkakatiwalaan mo.',

  'analytics.experiment.title': 'Mga eksperimento',
  'analytics.experiment.hypothesis': 'Hypothesis',
  'analytics.experiment.variants': 'Mga variant',
  'analytics.experiment.successMetric': 'Sukatan ng tagumpay',
  'analytics.experiment.window': 'Window ng pagsukat',
  'analytics.experiment.status.running': 'Tumatakbo hanggang {date}',
  'analytics.experiment.status.complete': 'Kumpleto',
  'analytics.experiment.tagBeforePublishing':
    'Mag-tag ng isang eksperimento bago i-publish upang hindi magawa ang paghahambing pagkatapos ng katotohanan.',
  'analytics.experiment.caveats': 'Mga babala',

  'analytics.export.title': 'I-export',
  'analytics.export.csv': 'I-download ang CSV',
  'analytics.export.json': 'I-download ang JSON',
  'analytics.export.providerRestriction':
    '{provider} nililimitahan kung paano maaaring pagsamahin o iimbak ang data nito. Ang ilang mga patlang ay hindi kasama.',

  'analytics.links.title': 'Mga sinusubaybayang link',
  'analytics.links.subtitle':
    'Mga sukat sa pag-redirect ng first party. Ito ay isang hiwalay na serye mula sa mga pag-click sa link na iniulat ng isang platform.',
  'analytics.links.destination': 'Patutunguhan',
  'analytics.links.shortUrl': 'Maikling URL',
  'analytics.links.totalRequests': 'Kabuuang mga kahilingan',
  'analytics.links.humanClicks': 'Mga na-deduplicate na pag-click',
  'analytics.links.suspectedBots': 'Mga pinaghihinalaang bot',
  'analytics.links.referrerClass': 'Referrer',
  'analytics.links.deviceClass': 'Device',
  'analytics.links.country': 'Bansa',
  'analytics.links.lastEvent': 'Huling pag-click {relativeTime}',
  'analytics.links.privacyNote':
    'Pinapanatili namin ang magaspang na lokasyon at klase ng device lamang. Ang mga hilaw na IP address ay pinananatiling panandalian para sa pang-aabuso at duplicate na pagtuklas, pagkatapos ay itatapon.',
  'analytics.links.separateSources':
    "Huwag idagdag ang mga pag-click na ito sa isang iniulat na numero ng platform. Nagbibilang sila ng iba't ibang bagay.",
} as const;
