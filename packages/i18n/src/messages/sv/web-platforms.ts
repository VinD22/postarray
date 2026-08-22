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

  'web.meta.schedule.title': 'Schemaläggning, plattform för plattform',
  'web.meta.schedule.description':
    'Vad varje plattform i lanseringsgruppen kräver av ett anslutet konto, gränserna dess officiella API tillämpar, och hur långt denna produkt har kommit mot dem.',
  'web.meta.schedulePlatform.title': 'Schemaläggning för {platform}',
  'web.meta.schedulePlatform.description':
    'Vad {platform} kräver av ett anslutet konto, gränserna dess officiella API tillämpar, och vilka delar av detta denna produkt har byggt.',

  /* ---------------------------------------------------------------------- */
  /* Index                                                                  */
  /* ---------------------------------------------------------------------- */

  'web.schedule.index.title': 'Schemaläggning, plattform för plattform',
  'web.schedule.index.lede':
    'En sida per plattform i lanseringsgruppen. Varje sida anger vad plattformen kräver av ett anslutet konto, gränserna dess officiella API tillämpar, och var bygget står. Varje siffra bär dokumentet den kommer från och datumet en person läste det.',
  'web.schedule.index.listLabel': 'Plattformar i lanseringsgruppen',
  'web.schedule.index.cohortNote':
    'Gruppen är den uppsättning plattformar denna produkt byggs för. Det är en plan, inte en tillgänglighetslista.',
  'web.schedule.index.limitsKnown': 'Gränser registrerade',
  'web.schedule.index.limitsUnknown': 'Gränser inte registrerade än',

  /* ---------------------------------------------------------------------- */
  /* Platform page                                                          */
  /* ---------------------------------------------------------------------- */

  'web.schedule.platform.title': 'Schemaläggning för {platform}',
  'web.schedule.platform.lede':
    'Vad {platform} kräver av ett anslutet konto, gränserna dess officiella API tillämpar, och vilka av dem denna produkt har byggt mot hittills.',

  'web.schedule.notice.title': 'Inget publiceras till {platform} än',
  'web.schedule.notice.body':
    'Ingen anslutning har klarat sin definition of done, och ingen är verifierad i produktion. Denna sida beskriver vad plattformen kräver och vad denna produkt avser att stödja. Den beskriver inte en fungerande schemaläggare.',

  'web.schedule.requirements.title': 'Vad {platform} kräver',
  'web.schedule.requirements.accountTypes': 'Kontotyp',
  'web.schedule.requirements.restriction': 'Plattformsbegränsning',
  'web.schedule.requirements.cost': 'API-kostnad',
  'web.schedule.requirements.unavailable.title': 'Ingen granskad anslutningsregistrering än',
  'web.schedule.requirements.unavailable.body':
    'Denna plattform anslöt till gruppen efter den senaste anslutningsundersökningen, så det finns ingen daterad registrering av dess kontokrav att visa. Den visas här så snart en person har läst den officiella dokumentationen och registrerat den.',
  'web.schedule.requirements.apiSource': 'Officiell API-dokumentation',
  'web.schedule.requirements.policySource': 'Plattformens policy',

  /* ---------------------------------------------------------------------- */
  /* Limits                                                                 */
  /* ---------------------------------------------------------------------- */

  'web.schedule.limits.title': 'Gränser {platform} tillämpar',
  'web.schedule.limits.lede':
    'Lästa för ett nyanslutet konto utan förhöjd behörighet. En plattform kan höja eller sänka vilken som helst av dessa utan att meddela någon, vilket är varför varje uppsättning bär datumet den lästes.',
  'web.schedule.limits.unavailable.title': 'Gränser inte registrerade för {platform}',
  'web.schedule.limits.unavailable.body':
    'Denna build levererar ingen adapter för denna plattform, så det finns ingen registrerad gräns att visa. Ett påhittat tal skulle vara värre än inget.',
  'web.schedule.limits.sourceLabel': 'Officiell plattformsdokumentation',

  'web.schedule.limits.text': 'Brödtext',
  'web.schedule.limits.title_field': 'Titelfält',
  'web.schedule.limits.countingUnit': 'Hur tecken räknas',
  'web.schedule.limits.links': 'Hur länkar räknas',
  'web.schedule.limits.images': 'Bilder per inlägg',
  'web.schedule.limits.videos': 'Videor per inlägg',
  'web.schedule.limits.videoDuration': 'Videolängd',
  'web.schedule.limits.imageBytes': 'Största bild',
  'web.schedule.limits.gifBytes': 'Största animerade bild',
  'web.schedule.limits.videoBytes': 'Största video',
  'web.schedule.limits.documentBytes': 'Största dokument',
  'web.schedule.limits.altText': 'Alternativ text',
  'web.schedule.limits.mimeTypes': 'Accepterade filtyper',
  'web.schedule.limits.markdown': 'Formateringstecken',

  'web.schedule.value.characters': '{count, plural, one {# tecken} other {# tecken}}',
  'web.schedule.value.files': '{count, plural, =0 {Inga} one {# fil} other {# filer}}',
  'web.schedule.value.durationRange': 'Mellan {min} och {max}',
  'web.schedule.value.durationMax': 'Upp till {max}',
  'web.schedule.value.markdownYes': 'Accepterat',
  'web.schedule.value.markdownNo': 'Publicerat som vanliga tecken',

  'web.schedule.unit.utf16':
    'Per UTF-16-kodenhet, vilket är vad de flesta redigerare rapporterar som teckenantal.',
  'web.schedule.unit.grapheme':
    'Per grafem, så en emoji gjord av flera kodpunkter kostar ändå ett tecken.',
  'web.schedule.unit.weighted':
    'Enligt ett viktat schema där de flesta icke-latinska tecken kostar två i stället för ett.',

  'web.schedule.link.none': 'Länkar räknas inte mot gränsen.',
  'web.schedule.link.actual': 'En länk kostar exakt de tecken den upptar.',
  'web.schedule.link.fixed':
    'Varje länk skrivs om till plattformens förkortare och kostar {count, plural, one {# tecken} other {# tecken}} oavsett dess verkliga längd.',

  /* ---------------------------------------------------------------------- */
  /* Capability state                                                       */
  /* ---------------------------------------------------------------------- */

  'web.schedule.capabilities.title': 'Vad som är byggt för {platform}',
  'web.schedule.capabilities.lede':
    'Genererat från connectorregistret, inte skrivet här. ”Erbjuds inte av plattformen” är ett faktum om plattformen och är slutgiltigt. ”Inte byggt än” är ett faktum om denna produkt och är standardvärdet i ärlighetens namn så länge ingen anslutning har klarat sin definition of done.',
  'web.schedule.capabilities.unavailable.title': 'Ingen förmågeregistrering för {platform} än',
  'web.schedule.capabilities.unavailable.body':
    'Det finns ingen adapter i denna build, så registret har inget att rapportera. Raden visas i förmågematrisen så snart det finns något verkligt att säga.',
  'web.schedule.capabilities.matrixLink': 'Läs hela förmågematrisen',

  'web.schedule.next.title': 'Vart du kan gå härnäst',
  'web.schedule.next.body':
    'Förmågematrisen bär varje plattform och varje förmåga i en tabell. Användningsfallssidorna beskriver arbetsflödena denna produkt byggs kring.',
} as const;
