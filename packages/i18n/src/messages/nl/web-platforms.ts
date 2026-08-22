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

  'web.meta.schedule.title': 'Plannen, platform voor platform',
  'web.meta.schedule.description':
    'Wat elk platform in het lanceringscohort vraagt van een gekoppeld account, de limieten die de officiële API afdwingt, en hoever dit product is gekomen daarin.',
  'web.meta.schedulePlatform.title': 'Plannen voor {platform}',
  'web.meta.schedulePlatform.description':
    'Wat {platform} vraagt van een gekoppeld account, de limieten die de officiële API afdwingt, en welke delen daarvan dit product heeft gebouwd.',

  /* ---------------------------------------------------------------------- */
  /* Index                                                                  */
  /* ---------------------------------------------------------------------- */

  'web.schedule.index.title': 'Plannen, platform voor platform',
  'web.schedule.index.lede':
    'Eén pagina per platform in het lanceringscohort. Elke pagina vermeldt wat het platform vraagt van een gekoppeld account, de limieten die de officiële API afdwingt, en waar de bouw staat. Elk getal draagt het document waar het vandaan komt en de datum waarop iemand het las.',
  'web.schedule.index.listLabel': 'Platforms in het lanceringscohort',
  'web.schedule.index.cohortNote':
    'Het cohort is de verzameling platforms waarvoor dit product wordt gebouwd. Het is een plan, geen beschikbaarheidslijst.',
  'web.schedule.index.limitsKnown': 'Limieten vastgelegd',
  'web.schedule.index.limitsUnknown': 'Limieten nog niet vastgelegd',

  /* ---------------------------------------------------------------------- */
  /* Platform page                                                          */
  /* ---------------------------------------------------------------------- */

  'web.schedule.platform.title': 'Plannen voor {platform}',
  'web.schedule.platform.lede':
    'Wat {platform} vraagt van een gekoppeld account, de limieten die de officiële API afdwingt, en tegen welke daarvan dit product tot nu toe is gebouwd.',

  'web.schedule.notice.title': 'Er wordt nog niets naar {platform} gepubliceerd',
  'web.schedule.notice.body':
    'Geen enkele connector heeft zijn definition of done gehaald, en geen enkele is geverifieerd in productie. Deze pagina beschrijft wat het platform vereist en wat dit product van plan is te ondersteunen. Het beschrijft geen werkende planner.',

  'web.schedule.requirements.title': 'Wat {platform} vereist',
  'web.schedule.requirements.accountTypes': 'Accounttype',
  'web.schedule.requirements.restriction': 'Platformbeperking',
  'web.schedule.requirements.cost': 'API-kosten',
  'web.schedule.requirements.unavailable.title': 'Nog geen beoordeeld connectorrecord',
  'web.schedule.requirements.unavailable.body':
    'Dit platform sloot zich aan bij het cohort na de laatste connectoranalyse, dus er is geen gedateerd overzicht van zijn accountvereisten om te tonen. Het verschijnt hier zodra iemand de officiële documentatie heeft gelezen en vastgelegd.',
  'web.schedule.requirements.apiSource': 'Officiële API-documentatie',
  'web.schedule.requirements.policySource': 'Platformbeleid',

  /* ---------------------------------------------------------------------- */
  /* Limits                                                                 */
  /* ---------------------------------------------------------------------- */

  'web.schedule.limits.title': 'Limieten die {platform} afdwingt',
  'web.schedule.limits.lede':
    'Gelezen voor een net gekoppeld account zonder verhoogde geschiktheid. Een platform kan elk van deze verhogen of verlagen zonder iemand te waarschuwen, daarom draagt elke set de datum waarop ze is gelezen.',
  'web.schedule.limits.unavailable.title': 'Geen limieten vastgelegd voor {platform}',
  'web.schedule.limits.unavailable.body':
    'Deze build bevat geen adapter voor dit platform, dus er is geen vastgelegde limiet om te tonen. Een verzonnen getal zou erger zijn dan geen getal.',
  'web.schedule.limits.sourceLabel': 'Officiële platformdocumentatie',

  'web.schedule.limits.text': 'Berichttekst',
  'web.schedule.limits.title_field': 'Titelveld',
  'web.schedule.limits.countingUnit': 'Hoe tekens worden geteld',
  'web.schedule.limits.links': 'Hoe links worden geteld',
  'web.schedule.limits.images': 'Afbeeldingen per bericht',
  'web.schedule.limits.videos': "Video's per bericht",
  'web.schedule.limits.videoDuration': 'Videolengte',
  'web.schedule.limits.imageBytes': 'Grootste afbeelding',
  'web.schedule.limits.gifBytes': 'Grootste geanimeerde afbeelding',
  'web.schedule.limits.videoBytes': 'Grootste video',
  'web.schedule.limits.documentBytes': 'Grootste document',
  'web.schedule.limits.altText': 'Alternatieve tekst',
  'web.schedule.limits.mimeTypes': 'Geaccepteerde bestandstypen',
  'web.schedule.limits.markdown': 'Opmaaktekens',

  'web.schedule.value.characters': '{count, plural, one {# teken} other {# tekens}}',
  'web.schedule.value.files': '{count, plural, =0 {Geen} one {# bestand} other {# bestanden}}',
  'web.schedule.value.durationRange': 'Tussen {min} en {max}',
  'web.schedule.value.durationMax': 'Tot {max}',
  'web.schedule.value.markdownYes': 'Geaccepteerd',
  'web.schedule.value.markdownNo': 'Gepubliceerd als platte tekens',

  'web.schedule.unit.utf16':
    'Per UTF-16-code-eenheid, wat de meeste editors rapporteren als tekenaantal.',
  'web.schedule.unit.grapheme':
    'Per grafeem, zodat een emoji van meerdere codepunten toch één teken kost.',
  'web.schedule.unit.weighted':
    'Volgens een gewogen schema waarbij de meeste niet-Latijnse tekens twee in plaats van één kosten.',

  'web.schedule.link.none': 'Links tellen niet mee voor de limiet.',
  'web.schedule.link.actual': 'Een link kost precies de tekens die hij inneemt.',
  'web.schedule.link.fixed':
    'Elke link wordt herschreven naar de verkorter van het platform en kost {count, plural, one {# teken} other {# tekens}}, ongeacht de werkelijke lengte.',

  /* ---------------------------------------------------------------------- */
  /* Capability state                                                       */
  /* ---------------------------------------------------------------------- */

  'web.schedule.capabilities.title': 'Wat is gebouwd voor {platform}',
  'web.schedule.capabilities.lede':
    'Gegenereerd uit het connectorregister, niet hier geschreven. "Niet aangeboden door het platform" is een feit over het platform en is definitief. "Nog niet gebouwd" is een feit over dit product en is de eerlijke standaard zolang geen enkele connector zijn definition of done heeft gehaald.',
  'web.schedule.capabilities.unavailable.title': 'Nog geen capaciteitsrecord voor {platform}',
  'web.schedule.capabilities.unavailable.body':
    'Er is geen adapter in deze build, dus het register heeft niets te melden. De rij verschijnt in de capaciteitsmatrix zodra er iets echts te zeggen is.',
  'web.schedule.capabilities.matrixLink': 'Lees de volledige capaciteitsmatrix',

  'web.schedule.next.title': 'Waar je verder kunt kijken',
  'web.schedule.next.body':
    "De capaciteitsmatrix bevat elk platform en elke capaciteit in één tabel. De use case-pagina's beschrijven de workflows waar dit product omheen wordt gebouwd.",
} as const;
