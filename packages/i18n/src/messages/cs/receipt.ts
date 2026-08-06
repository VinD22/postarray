/** Publication receipt: the immutable record of what actually happened. */
export const receiptMessages = {
  'receipt.title': 'Potvrzení o publikaci',
  'receipt.subtitle': 'Přesně to, co bylo zveřejněno, kde, kdy a na čí schválení.',
  'receipt.target': '{account} na {provider}',
  'receipt.externalId': 'ID externího příspěvku',
  'receipt.permalink': 'Trvalý odkaz',
  'receipt.permalinkUnavailable': '{provider} nevrací permalink pro tento typ příspěvku.',
  'receipt.contentVersion': 'Verze obsahu',
  'receipt.contentHash': 'Kontrolní součet obsahu',
  'receipt.mediaVersion': 'Verze pro média',
  'receipt.idempotencyKey': 'Reference o idempotenci',
  'receipt.correlationId': 'Reference na korelaci',

  'receipt.surface.label': 'Vytvořeno z',
  'receipt.surface.web': 'Webová aplikace',
  'receipt.surface.api': 'REST API',
  'receipt.surface.mcp': 'MCP server',
  'receipt.surface.cli': 'CLI',
  'receipt.surface.rss': 'RSS autopost',
  'receipt.surface.automation': 'Pravidlo automatizace',
  'receipt.surface.webhook': 'Příchozí webhook',

  'receipt.actor.user': '{name}',
  'receipt.actor.serviceAccount': 'Servisní účet {name}',
  'receipt.actor.oauthApp': '{app} zastupuje {name}',
  'receipt.actor.system': 'Relé',

  'receipt.timeline.title': 'Časová osa',
  'receipt.timeline.created': 'Koncept vytvořil {actor}',
  'receipt.timeline.approvalRequested': 'Požadováno schválení od {approver}',
  'receipt.timeline.approved': 'Schváleno {actor} podle zásad {policy}',
  'receipt.timeline.scheduled': 'Naplánováno na {local} v {timeZone}',
  'receipt.timeline.revalidated': 'Ověřovací údaje a limity platformy byly znovu zkontrolovány',
  'receipt.timeline.mediaPrepared':
    '{count, plural, one {# soubor připravený pro platformu} other {# soubory připravené pro platformu} few {# soubory připravené pro platformu} many {# soubory připravené pro platformu}}',
  'receipt.timeline.dispatched': 'Odesláno na {provider}',
  'receipt.timeline.providerAccepted': '{provider} přijal příspěvek',
  'receipt.timeline.providerProcessing': '{provider} stále zpracovává médium',
  'receipt.timeline.published': 'Publikováno jako {externalId}',
  'receipt.timeline.commentPublished': 'Následná položka {position} publikováno',
  'receipt.timeline.retryScheduled': 'Zkusit znovu {attempt} naplánováno na {time}',
  'receipt.timeline.failed': 'Pokus {attempt} se nezdařilo',
  'receipt.timeline.canceled': 'Zrušeno uživatelem {actor}',
  'receipt.timeline.analyticsSynced': 'Analytics synchronizováno',
  'receipt.timeline.deletedExternally': 'Příspěvek již není na {provider}',

  'receipt.times.scheduled': 'Plánovaný čas',
  'receipt.times.dispatched': 'Doba odeslání',
  'receipt.times.published': 'Čas zveřejnění',
  'receipt.times.latency': 'Odesláno {duration} po naplánovaném čase.',

  'receipt.attempts.title': 'Pokusy',
  'receipt.attempts.count':
    '{count, plural, one {# pokus} other {# pokusy} few {# pokusy} many {# pokusy}}',
  'receipt.attempts.classification': 'Klasifikace',
  'receipt.attempts.providerResponse': 'Odpověď poskytovatele',
  'receipt.attempts.responseRedacted':
    'Odpověď poskytovatele je uložena s odstraněnými tokeny a osobními údaji.',
  'receipt.attempts.remediation': 'Co dělat dále',

  'receipt.cost.estimated': 'Odhad {amount}',
  'receipt.cost.actual': 'Odsouhlaseno {amount}',
  'receipt.cost.pending': 'Skutečné využití ještě není odsouhlaseno.',

  'receipt.partial.title': 'Částečně publikováno',
  'receipt.partial.body':
    '{published, plural, one {# cíl zveřejněn} other {# cíle zveřejněny} few {# cíle zveřejněny} many {# cíle zveřejněny}}. {failed, plural, one {# cíl selhal} other {# cíle se nezdařily} few {# cíle se nezdařily} many {# cíle se nezdařily}}. Publikované příspěvky na platformě stále existují.',
  'receipt.partial.doNotRollback':
    'Příspěvek, který již byl publikován, nemažeme. Pokud to chcete, smažte jej na platformě.',

  'receipt.export.title': 'Sdílet toto potvrzení',
  'receipt.export.pdf': 'Stáhnout jako PDF',
  'receipt.export.json': 'Stáhnout jako JSON',
  'receipt.export.permissionNote':
    'Pouze vlastníci, administrátoři a schvalovatelé mohou sdílet účtenku.',

  'receipt.analytics.lastSync': 'Poslední synchronizace služby Analytics {relativeTime}.',
  'receipt.analytics.nextSync': 'Další synchronizace kolem {time}.',
} as const;
