/** Automation rules, RSS autopost, webhooks and inbound integrations. */
export const automationMessages = {
  'automation.title': 'Automation',
  'automation.subtitle':
    'Mga panuntunan, feed at webhook, na may nakasaad na mga limitasyon bago mo i-on ang mga ito.',
  'automation.rules.title': 'Mga panuntunan sa automation',
  'automation.rules.create': 'Bagong panuntunan',
  'automation.rules.empty':
    'Wala pang rules. Ang isang tuntunin ay tumutugon sa isang bagay at nagmumungkahi o nagsasagawa ng isang aksyon.',
  'automation.rules.sentence':
    'kailan {trigger}, kung {conditions}, pagkatapos {actions}, pagkatapos {delay}, hanggang {endCondition}.',
  'automation.rules.sentenceNoConditions':
    'kailan {trigger}, pagkatapos {actions}, pagkatapos {delay}, hanggang {endCondition}.',
  'automation.rules.structuredEditor': 'Nakabalangkas na editor',
  'automation.rules.sentenceEditor': 'Editor ng pangungusap',

  'automation.trigger.label': 'Trigger',
  'automation.trigger.atTime': 'isang tiyak na oras',
  'automation.trigger.nextSlot': 'ang susunod na naaprubahang puwang ng kalendaryo',
  'automation.trigger.rssItem': 'may lalabas na bagong item sa {feed}',
  'automation.trigger.inboundWebhook': 'dumating ang isang napatotohanang webhook',
  'automation.trigger.mediaImported': 'bagong media ay ini-import sa pamamagitan ng API',
  'automation.trigger.postPublished': 'isang post ang nag-publish',
  'automation.trigger.postFailed': 'nabigo ang isang post',
  'automation.trigger.postPartiallyPublished':
    'ang isang post ay naglalathala sa ilang mga target lamang',
  'automation.trigger.commentCompleted':
    'isang naka-iskedyul na komento o thread na item ay nakumpleto',
  'automation.trigger.analyticsThreshold': '{metric} sa isang post na umaabot {value}',
  'automation.trigger.connectionExpiring': 'kailangang i-refresh ang isang koneksyon',
  'automation.trigger.manual': 'may nagpapatakbo nito mula sa app, API, MCP o CLI',
  'automation.trigger.recurring': 'isang umuulit na iskedyul ng apoy',

  'automation.condition.label': 'Mga kundisyon',
  'automation.condition.project': 'ang proyekto ay {project}',
  'automation.condition.campaign': 'ang kampanya ay {campaign}',
  'automation.condition.account': 'ang account ay {account}',
  'automation.condition.platform': 'ang plataporma ay {platform}',
  'automation.condition.locale': 'ang wika ng nilalaman ay{locale}',
  'automation.condition.contentType': 'ang uri ng nilalaman ay {contentType}',
  'automation.condition.quietHours': 'ito ay sa labas ng tahimik na oras sa {timeZone}',
  'automation.condition.approved': 'ang nilalaman ay naaprubahan',
  'automation.condition.engagementAtLeast': '{metric} ay hindi bababa sa {value}',
  'automation.condition.engagementAtMost': '{metric} ay higit sa lahat {value}',
  'automation.condition.timeSincePublish': 'ang post ay nai-publish ng higit sa {duration} kanina',
  'automation.condition.containsKeyword': 'naglalaman ang teksto {keyword}',
  'automation.condition.notDuplicate': 'ang nilalaman ay hindi isang malapit na duplicate',
  'automation.condition.withinCadenceBudget': 'pinapayagan ito ng cadence budget',
  'automation.condition.connectionHealthy': 'gumagana ang koneksyon',
  'automation.condition.usageAvailable': 'sinasaklaw ito ng balanse ng paggamit',

  'automation.action.label': 'Mga aksyon',
  'automation.action.createDraft': 'gumawa ng draft mula sa {template}',
  'automation.action.transcreate': 'iakma ang teksto para sa {locale}',
  'automation.action.addSignature': 'idagdag ang pirma {signature}',
  'automation.action.addUtm': 'magdagdag ng mga parameter ng UTM',
  'automation.action.addDisclosure': 'idagdag ang pagsisiwalat {disclosure}',
  'automation.action.addFirstComment': 'idagdag ang inaprubahang unang komento',
  'automation.action.requestApproval': 'humiling ng pag-apruba ng tao',
  'automation.action.schedule': 'iiskedyul ito sa pamamagitan ng patakaran sa pag-apruba',
  'automation.action.publish': 'i-publish ito sa pamamagitan ng patakaran sa pag-apruba',
  'automation.action.wait': 'maghintay {duration}',
  'automation.action.notify': 'ipaalam {target}',
  'automation.action.pauseRule': 'i-pause ang panuntunang ito',
  'automation.action.repost': 'i-repost o i-quote ang source post nang isang beses',
  'automation.action.followUpFromAccount': 'mag-publish ng inihandang follow up mula sa {account}',

  'automation.preflight.title': 'Bago mo ito i-on',
  'automation.preflight.accounts':
    'Maaaring kumilos ang panuntunang ito {count, plural, one {# account} other {# mga account}}.',
  'automation.preflight.maxActions':
    'Maaari itong lumikha ng higit sa lahat {count, plural, one {# panlabas na pagkilos} other {# mga panlabas na aksyon}} bawat pagtakbo.',
  'automation.preflight.approval': 'Sumusunod pa rin ang bawat publish {policy}.',
  'automation.preflight.providerLimits': 'Nalalapat ang mga limitasyon ng provider',
  'automation.preflight.estimatedCost': 'Tinantyang metered cost per run: {amount}.',
  'automation.preflight.duplicateImpact':
    'Ang mga duplicate at cadence na pagsusuri ay tumatakbo bago ang bawat aksyon.',
  'automation.preflight.failureBehaviour':
    'Kung ang isang aksyon ay nabigo, ang panuntunan {behaviour}.',
  'automation.preflight.example': 'Halimbawa run',

  'automation.threshold.windowRequired': 'Pumili ng window ng pagsukat.',
  'automation.threshold.cooldownRequired': 'Pumili ng cooldown sa pagitan ng mga execution.',
  'automation.threshold.maxExecutions':
    'Tumatakbo nang halos lahat {count, plural, one {# oras} other {# beses}} para sa bawat source post.',
  'automation.threshold.staleMetric':
    'Kung nawawala o lipas ang sukatan, hindi tatakbo ang panuntunang ito. Pinoprotektahan ka ng default na iyon mula sa pagkilos sa isang numero na hindi namin ma-verify.',

  'automation.rules.state.draft': 'Draft',
  'automation.rules.state.testing': 'Test mode',
  'automation.rules.state.active': 'Aktibo',
  'automation.rules.state.paused': 'Naka-pause',
  'automation.rules.state.stopped': 'Huminto sa pamamagitan ng kill switch',
  'automation.rules.killSwitch': 'Itigil ang panuntunang ito ngayon',
  'automation.rules.runs.title': 'Mga kamakailang pagtakbo',
  'automation.rules.runs.empty': 'Hindi pa tumatakbo ang panuntunang ito.',
  'automation.rules.runs.succeeded': 'Nakumpleto {relativeTime}',
  'automation.rules.runs.failed': 'Nabigo {relativeTime}',
  'automation.rules.versionHistory': 'Kasaysayan ng bersyon',

  'automation.notPermitted.title': 'Ang panuntunang ito ay hindi maaaring gawin',
  'automation.notPermitted.body':
    'Hindi ino-automate ng Post Array ang mga like, follow, hindi hinihinging mga tugon o mensahe, duplicate na mass posting o anumang bagay na nakasalalay sa pag-automate ng browser. {provider} ipinagbabawal ito at gayon din tayo.',
  'automation.notPermitted.providerCapability':
    '{provider} hindi nag-aalok {action} sa pamamagitan ng opisyal nitong API, kaya hindi mapipili ang pagkilos na ito para dito.',

  'automation.rss.title': 'RSS autopost',
  'automation.rss.add': 'Magdagdag ng feed',
  'automation.rss.urlLabel': 'URL ng feed',
  'automation.rss.validating': 'Sinusuri ang feed',
  'automation.rss.validated': '{title} mukhang may bisa. Pinakabagong item: {itemTitle}.',
  'automation.rss.markSeen': 'Tratuhin ang kasalukuyang pinakabagong item bilang nakita na',
  'automation.rss.targets': 'I-publish sa',
  'automation.rss.template': 'Template ng teksto',
  'automation.rss.templateHelp':
    'Gamitin ang mga field ng feed na iyong nakamapa. Ang Post Array ay hindi bumubuo ng mga larawan para sa mga feed item.',
  'automation.rss.policy.draft': 'Gumawa ng draft',
  'automation.rss.policy.approval': 'Gumawa ng draft at humiling ng pag-apruba',
  'automation.rss.policy.nextSlot': 'Mag-iskedyul sa susunod na libreng puwang',
  'automation.rss.policy.cadence': 'Mag-iskedyul sa isang nakapirming ritmo',
  'automation.rss.policy.immediate': 'I-publish kaagad',
  'automation.rss.dedupe':
    'Naka-fingerprint ang mga item sa pamamagitan ng identifier, link, at content, kaya hindi na-publish nang dalawang beses ang parehong item.',
  'automation.rss.health.lastPoll': 'Huling sinuri {relativeTime}',
  'automation.rss.health.lastItem': 'Huling bagong item {relativeTime}',
  'automation.rss.health.lastPost': 'Huling post na ginawa {relativeTime}',
  'automation.rss.health.error': 'Huling error: {reason}',

  'automation.webhooks.title': 'Mga Webhook',
  'automation.webhooks.add': 'Magdagdag ng endpoint',
  'automation.webhooks.urlLabel': 'URL ng Endpoint',
  'automation.webhooks.eventsLabel': 'Mga kaganapan',
  'automation.webhooks.allEvents': 'Lahat ng kaganapan',
  'automation.webhooks.scopeLabel': 'Mga proyekto at account',
  'automation.webhooks.allAccounts': 'Lahat ng account',
  'automation.webhooks.secret': 'Lihim na pumipirma',
  'automation.webhooks.secretShownOnce':
    'Ang lihim na ito ay ipinakita nang isang beses. Itabi ito ngayon.',
  'automation.webhooks.rotateSecret': 'I-rotate ang signing secret',
  'automation.webhooks.testSend': 'Magpadala ng pagsubok na kaganapan',
  'automation.webhooks.testSent':
    'Ipinadala ang kaganapan ng pagsubok. Suriin ang tala ng paghahatid.',
  'automation.webhooks.deliveries.title': 'Mga paghahatid',
  'automation.webhooks.deliveries.status': 'Tugon {status} sa {duration}',
  'automation.webhooks.deliveries.redeliver': 'Muling ihatid',
  'automation.webhooks.deliveries.retrying':
    'Sinusubukang muli nang may backoff. Pagtatangka {attempt} ng {max}.',
  'automation.webhooks.disabledAfterFailures':
    'Ang endpoint na ito ay hindi pinagana pagkatapos ng paulit-ulit na pagkabigo. Ayusin ito at paganahin itong muli.',
  'automation.webhooks.event.connectionConnected': 'May idinagdag na koneksyon',
  'automation.webhooks.event.connectionActionRequired':
    'Ang isang koneksyon ay nangangailangan ng pansin',
  'automation.webhooks.event.draftCreated': 'Isang draft ang ginawa',
  'automation.webhooks.event.approvalRequested': 'Hiniling ang pag-apruba',
  'automation.webhooks.event.approvalDecided': 'Napagpasyahan ang isang pag-apruba',
  'automation.webhooks.event.postScheduled': 'May nakaiskedyul na post',
  'automation.webhooks.event.postDispatching': 'Isang post ang ipinapadala',
  'automation.webhooks.event.postPublished': 'Na-publish ang isang post',
  'automation.webhooks.event.postPartiallyPublished':
    'Isang post na na-publish sa ilang mga target',
  'automation.webhooks.event.postFailed': 'Nabigo ang isang post',
  'automation.webhooks.event.commentPublished': 'Isang komento o thread item na na-publish',
  'automation.webhooks.event.commentFailed': 'Nabigo ang isang komento o thread item',
  'automation.webhooks.event.analyticsUpdated': 'Na-update ang Analytics',
  'automation.webhooks.event.rssItemProcessed': 'Isang RSS item ang naproseso',
  'automation.webhooks.event.ruleRunCompleted': 'Nakumpleto ang isang pagpapatakbo ng panuntunan',
  'automation.webhooks.event.ruleRunFailed': 'Nabigo ang isang pagpapatakbo ng panuntunan',
  'automation.webhooks.event.subscriptionChanged': 'Nagbago ang subscription',

  'automation.inbound.title': 'Mga papasok na pagsasama',
  'automation.inbound.description':
    'Magpadala ng na-authenticate na JSON para gumawa ng draft o magsimula ng pinangalanang panuntunan. Ang papasok na data ay hindi kailanman lumalampas sa pagpapatunay, saklaw ng account o pag-apruba.',
  'automation.inbound.endpoint': 'Endpoint',
  'automation.inbound.credential': 'kredensyal',
} as const;
