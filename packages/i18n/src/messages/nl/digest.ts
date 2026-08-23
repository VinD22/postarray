/** Weekly digest copy for the Dutch interface. */
export const digestMessages = {
  'digest.title': 'Deze week',
  'digest.subtitle': 'Wat we kunnen zien van {windowStart} tot {windowEnd}.',
  'digest.empty':
    'Er valt deze week nog niets samen te vatten. Publiceer iets en het verschijnt hier.',
  'digest.regenerate': 'Samenvatting van deze week opnieuw maken',
  'digest.generating': 'Samenvatting van deze week maken',
  'digest.source.deterministic':
    'Geschreven vanuit je publicatieregisters en je eigen metingen, zonder de schrijfassistent.',
  'digest.source.ai':
    'Geschreven door de assistent vanuit je eigen registers. Elk getal is daarmee gecontroleerd.',
  'digest.unavailable.aiOff':
    'De schrijfassistent staat uit, dus dit is de eenvoudige versie. Er ontbreekt niets.',
  'digest.unavailable.rejected':
    'De assistentversie kwam niet overeen met je gegevens en is verwijderd. Dit is de eenvoudige versie.',
  'digest.headline.published':
    '{published, plural, =0 {Geen posts voltooid} one {# post voltooid} other {# posts voltooid}} tussen {windowStart} en {windowEnd}.',
  'digest.headline.nothingPublished':
    'Er is niets gepubliceerd tussen {windowStart} en {windowEnd}.',
  'digest.outcome.published':
    '{count, plural, one {# post voltooid op {provider}} other {# posts voltooid op {provider}}}.',
  'digest.outcome.partial':
    '{count, plural, one {# post bereikte sommige bestemmingen op {provider}, maar niet alle} other {# posts bereikten sommige bestemmingen op {provider}, maar niet alle}}.',
  'digest.outcome.failed':
    '{count, plural, one {# post is niet geplaatst op {provider}} other {# posts zijn niet geplaatst op {provider}}}.',
  'digest.metrics.noneYet':
    'Er zijn deze week nog geen metingen binnengekomen. Dat betekent dat we niet weten hoe deze posts presteerden, niet dat ze slecht presteerden.',
  'digest.freshness.statement':
    '{label, select, fresh {De metingen zijn voor het laatst gesynchroniseerd om {lastObservedAt}.} stale {De metingen zijn sinds {lastObservedAt} niet gesynchroniseerd, dus de bovenstaande cijfers kunnen verouderd zijn.} other {Er is nog niets gesynchroniseerd, dus niets hierboven is gemeten.}}',
  'digest.narrative.headline': '{statement}',
  'digest.narrative.observation': '{statement}',
  'digest.narrative.confounder': 'Goed om te weten: {confounder}',
  'digest.narrative.notSupported': '{statement}',
  'digest.narrative.nextAction': '{statement}',
  'digest.settings.title': 'Wekelijkse samenvatting per e-mail',
  'digest.settings.description':
    'Elke week een korte e-mail met wat er is gepubliceerd en wat we konden meten. Standaard ingeschakeld.',
  'digest.settings.enabled': 'De wekelijkse samenvatting sturen',
  'email.digest.subject': 'Jouw week in {workspaceName}',
  'email.digest.intro':
    'Dit is wat we voor {workspaceName} kunnen zien tussen {windowStart} en {windowEnd}.',
  'email.digest.noData':
    'We konden deze week niets meten. Als een getal ontbreekt, komt dat doordat we het niet konden lezen, niet doordat het nul was.',
  'email.digest.footer':
    'Je ontvangt dit omdat de wekelijkse samenvatting is ingeschakeld voor {workspaceName}. Schakel deze uit in de werkruimte-instellingen.',
} as const;

