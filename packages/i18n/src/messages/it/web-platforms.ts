/**
 * The per platform scheduler pages.
 *
 * Rules that bind this file specifically:
 *
 *  - Not one string here names a platform, states a character ceiling, a file
 *    size or a capability. Every one of those comes from the generated
 *    datasets the page reads, so a page physically cannot claim support the
 *    connectors do not have. The strings below are labels and framing only.
 *  - The framing is always "what the platform requires" and "what this product
 *    intends to support". Never "what you can publish". No connector has
 *    passed its definition of done, so nothing publishes.
 *  - Anything a platform does not document is `common.unavailable`, never a
 *    zero and never a guess.
 *
 * Note: this locale file translates only the `web.schedule.*` and
 * `web.meta.schedule*` keys. The `web.specs.*` and `web.meta.specs*` keys in
 * the English source stay on the reviewed English fallback for beta locales
 * and are intentionally not duplicated here.
 */
export const webPlatformsMessages = {
  /* ---------------------------------------------------------------------- */
  /* Metadata                                                               */
  /* ---------------------------------------------------------------------- */

  'web.meta.schedule.title': 'Programmazione, piattaforma per piattaforma',
  'web.meta.schedule.description':
    'Cosa richiede ogni piattaforma del gruppo di lancio da un account collegato, i limiti imposti dalla sua API ufficiale, e quanto questo prodotto è arrivato rispetto ad essi.',
  'web.meta.schedulePlatform.title': 'Programmazione per {platform}',
  'web.meta.schedulePlatform.description':
    'Cosa richiede {platform} da un account collegato, i limiti imposti dalla sua API ufficiale, e quali parti di questo questo prodotto ha costruito.',

  /* ---------------------------------------------------------------------- */
  /* Index                                                                  */
  /* ---------------------------------------------------------------------- */

  'web.schedule.index.title': 'Programmazione, piattaforma per piattaforma',
  'web.schedule.index.lede':
    'Una pagina per ogni piattaforma del gruppo di lancio. Ciascuna indica cosa chiede la piattaforma a un account collegato, i limiti imposti dalla sua API ufficiale, e a che punto è la costruzione. Ogni numero porta il documento da cui proviene e la data in cui una persona lo ha letto.',
  'web.schedule.index.listLabel': 'Piattaforme nel gruppo di lancio',
  'web.schedule.index.cohortNote':
    "Il gruppo è l'insieme di piattaforme per cui questo prodotto viene costruito. È un piano, non un elenco di disponibilità.",
  'web.schedule.index.limitsKnown': 'Limiti registrati',
  'web.schedule.index.limitsUnknown': 'Limiti non ancora registrati',

  /* ---------------------------------------------------------------------- */
  /* Platform page                                                          */
  /* ---------------------------------------------------------------------- */

  'web.schedule.platform.title': 'Programmazione per {platform}',
  'web.schedule.platform.lede':
    'Cosa chiede {platform} a un account collegato, i limiti imposti dalla sua API ufficiale, e quali di essi questo prodotto ha costruito finora.',

  'web.schedule.notice.title': 'Niente viene ancora pubblicato su {platform}',
  'web.schedule.notice.body':
    'Nessun connettore ha superato la sua definizione di completamento, e nessuno è verificato in produzione. Questa pagina descrive cosa richiede la piattaforma e cosa questo prodotto intende supportare. Non descrive un programmatore funzionante.',

  'web.schedule.requirements.title': 'Cosa richiede {platform}',
  'web.schedule.requirements.accountTypes': 'Tipo di account',
  'web.schedule.requirements.restriction': 'Restrizione della piattaforma',
  'web.schedule.requirements.cost': 'Costo API',
  'web.schedule.requirements.unavailable.title': 'Ancora nessun record di connettore verificato',
  'web.schedule.requirements.unavailable.body':
    "Questa piattaforma si è unita al gruppo dopo l'ultima analisi dei connettori, quindi non c'è un record datato dei suoi requisiti di account da mostrare. Comparirà qui non appena una persona avrà letto la documentazione ufficiale e la avrà registrata.",
  'web.schedule.requirements.apiSource': 'Documentazione API ufficiale',
  'web.schedule.requirements.policySource': 'Politica della piattaforma',

  /* ---------------------------------------------------------------------- */
  /* Limits                                                                 */
  /* ---------------------------------------------------------------------- */

  'web.schedule.limits.title': 'Limiti imposti da {platform}',
  'web.schedule.limits.lede':
    'Letti per un account appena collegato senza idoneità elevata. Una piattaforma può alzare o abbassare uno qualsiasi di questi senza avvisare nessuno, motivo per cui ogni insieme porta la data in cui è stato letto.',
  'web.schedule.limits.unavailable.title': 'Limiti non registrati per {platform}',
  'web.schedule.limits.unavailable.body':
    "Questa build non include un adattatore per questa piattaforma, quindi non c'è un limite registrato da mostrare. Un numero inventato sarebbe peggio di nessun numero.",
  'web.schedule.limits.sourceLabel': 'Documentazione ufficiale della piattaforma',

  'web.schedule.limits.text': 'Testo del post',
  'web.schedule.limits.title_field': 'Campo titolo',
  'web.schedule.limits.countingUnit': 'Come vengono contati i caratteri',
  'web.schedule.limits.links': 'Come vengono contati i link',
  'web.schedule.limits.images': 'Immagini per post',
  'web.schedule.limits.videos': 'Video per post',
  'web.schedule.limits.videoDuration': 'Durata del video',
  'web.schedule.limits.imageBytes': 'Immagine più grande',
  'web.schedule.limits.gifBytes': 'Immagine animata più grande',
  'web.schedule.limits.videoBytes': 'Video più grande',
  'web.schedule.limits.documentBytes': 'Documento più grande',
  'web.schedule.limits.altText': 'Testo alternativo',
  'web.schedule.limits.mimeTypes': 'Tipi di file accettati',
  'web.schedule.limits.markdown': 'Segni di formattazione',

  'web.schedule.value.characters':
    '{count, plural, one {# carattere} many {# caratteri} other {# caratteri}}',
  'web.schedule.value.files':
    '{count, plural, =0 {Nessuno} one {# file} many {# file} other {# file}}',
  'web.schedule.value.durationRange': 'Tra {min} e {max}',
  'web.schedule.value.durationMax': 'Fino a {max}',
  'web.schedule.value.markdownYes': 'Accettato',
  'web.schedule.value.markdownNo': 'Pubblicato come caratteri semplici',

  'web.schedule.unit.utf16':
    'Per unità di codice UTF-16, che è ciò che la maggior parte degli editor riporta come conteggio dei caratteri.',
  'web.schedule.unit.grapheme':
    "Per grafema, così un'emoji composta da più punti di codice costa comunque un carattere.",
  'web.schedule.unit.weighted':
    'Con uno schema ponderato in cui la maggior parte dei caratteri non latini costa due invece di uno.',

  'web.schedule.link.none': 'I link non vengono conteggiati rispetto al limite.',
  'web.schedule.link.actual': 'Un link costa esattamente i caratteri che occupa.',
  'web.schedule.link.fixed':
    "Ogni link viene riscritto nell'abbreviatore della piattaforma e costa {count, plural, one {# carattere} many {# caratteri} other {# caratteri}} indipendentemente dalla sua lunghezza reale.",

  /* ---------------------------------------------------------------------- */
  /* Capability state                                                       */
  /* ---------------------------------------------------------------------- */

  'web.schedule.capabilities.title': 'Cosa è costruito per {platform}',
  'web.schedule.capabilities.lede':
    'Generato dal registro dei connettori, non scritto qui. "Non offerto dalla piattaforma" è un fatto sulla piattaforma ed è definitivo. "Non ancora costruito" è un fatto su questo prodotto ed è il valore predefinito onesto finché nessun connettore ha superato la sua definizione di completamento.',
  'web.schedule.capabilities.unavailable.title': 'Ancora nessun record di capacità per {platform}',
  'web.schedule.capabilities.unavailable.body':
    "Non c'è un adattatore in questa build, quindi il registro non ha nulla da segnalare. La riga apparirà nella matrice delle capacità non appena ci sarà qualcosa di reale da dire.",
  'web.schedule.capabilities.matrixLink': 'Leggi la matrice completa delle capacità',

  'web.schedule.next.title': 'Dove andare adesso',
  'web.schedule.next.body':
    "La matrice delle capacità porta ogni piattaforma e ogni capacità in una sola tabella. Le pagine dei casi d'uso descrivono i flussi di lavoro attorno ai quali viene costruito questo prodotto.",
} as const;
