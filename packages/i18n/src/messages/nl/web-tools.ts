/**
 * The free tools on the public site.
 *
 * These pages exist because this repository already knows every launch cohort
 * platform's real publishing limits from its connector capability code. A tool
 * here may therefore state a number, but only a number the generated dataset
 * carries, always beside the official source and the date a person read it.
 *
 * Rules that bind this file specifically:
 *
 *  - A tool never claims the product publishes anywhere. Nothing in the launch
 *    cohort is verified for production yet, and these pages say so.
 *  - Every calculation described here runs in the reader's browser. Copy that
 *    promises privacy must stay true of the component that renders it.
 *  - No tool writes, rewrites, suggests or scores content. No tool looks up a
 *    handle, a follower count or anything else that would need an unofficial
 *    endpoint.
 *  - A limit we do not have is "unavailable". Never zero, never a guess.
 */
export const webToolsMessages = {
  /* ---------------------------------------------------------------------- */
  /* Metadata                                                                */
  /* ---------------------------------------------------------------------- */

  'web.meta.tools.title': 'Gratis publicatietools',
  'web.meta.tools.description':
    'Kleine, private tools voor mensen die op meerdere platforms publiceren: een limietcontrole per platform, een UTM-bouwer, een YouTube-titellengtecontrole en een tijdzoneplanner.',
  'web.meta.tools.preflight.title': 'Post preflight-controle',
  'web.meta.tools.preflight.description':
    'Controleer één concept tegen de gepubliceerde tekst- en medialimieten van tien platforms, met de bron en de datum waarop elke limiet werd gelezen.',
  'web.meta.tools.utm.title': 'UTM-linkbouwer',
  'web.meta.tools.utm.description':
    'Stel een getagde campagne-URL samen en zie wat elke UTM-parameter betekent. Werkt volledig in je browser.',
  'web.meta.tools.youtubeTitle.title': 'YouTube-titellengtecontrole',
  'web.meta.tools.youtubeTitle.description':
    'Meet een YouTube-titel tegen het gedocumenteerde plafond, geteld zoals een persoon tekens telt.',
  'web.meta.tools.timeZone.title': 'Tijdzone- en zomertijdplanner',
  'web.meta.tools.timeZone.description':
    'Bekijk één publicatietijdstip in meerdere doelgroepzones en vind de weken waarin een zomertijdverschuiving het lokale uur verplaatst.',
  'web.meta.tools.engagementRate.title': 'Betrokkenheidspercentage-calculator',
  'web.meta.tools.engagementRate.description':
    'Deel interacties door bereik, volgers of vertoningen. Drie eenvoudige berekeningen, geen verzonnen benchmark.',

  /* ---------------------------------------------------------------------- */
  /* Shared tool furniture                                                   */
  /* ---------------------------------------------------------------------- */

  'web.tools.index.title': 'Gratis tools',
  'web.tools.index.summary':
    'Kleine rekenmachines gebouwd op dezelfde platformlimietgegevens die onze connectoren lezen.',
  'web.tools.index.lede':
    'Vier kleine tools, gebouwd op dezelfde platformlimietgegevens die onze connectoren gebruiken. Geen account, geen upload, geen tracking van wat je typt.',
  'web.tools.index.dataTitle': 'Waar de cijfers vandaan komen',
  'web.tools.index.dataBody':
    'Elke limiet wordt gegenereerd uit de connector-capaciteitscode in deze repository, en elke platformrij draagt de officiële documentatiepagina waar hij vandaan komt en de datum waarop iemand die pagina las.',
  'web.tools.index.honesty':
    'Deze tools publiceren niets. Geen enkele connector heeft nog providerverificatie voltooid, dus niets hier koppelt een account.',
  'web.tools.shared.privacyTitle': 'Dit werkt in je browser',
  'web.tools.shared.privacyBody':
    'Alles wat je typt blijft op deze pagina. Er is geen verzoek naar een server, geen opslag en geen analyse-event dat je tekst draagt.',
  'web.tools.shared.sourceLink': 'Platformdocumentatie',
  'web.tools.shared.sourceRead': 'Gelezen op {date}',
  'web.tools.shared.unavailable': 'niet beschikbaar',
  'web.tools.shared.unavailableWhy':
    'We leveren nog geen connector voor dit platform, dus we hebben geen geverifieerde limiet om te tonen. We zeggen liever niets dan te gokken.',
  'web.tools.shared.copy': 'Kopiëren',
  'web.tools.shared.copied': 'Gekopieerd',
  'web.tools.shared.copyFailed':
    'Je browser blokkeerde het kopiëren. Selecteer de tekst en kopieer die.',
  'web.tools.shared.faqTitle': 'Vragen',
  'web.tools.shared.baselineTitle': 'Welk account deze cijfers beschrijven',
  'web.tools.shared.baselineBody':
    'Het voorzichtige geval: een net gekoppeld account zonder verhoogde geschiktheid. Sommige platforms verhogen een limiet zodra een kanaal of een bedrijf is geverifieerd, en waar dat gebeurt, staat het op de pagina.',
  'web.tools.shared.otherTools': 'Andere tools',

  /* ---------------------------------------------------------------------- */
  /* Tool names and one line summaries, shared by the index and the footer   */
  /* ---------------------------------------------------------------------- */

  'web.tools.preflight.name': 'Post preflight-controle',
  'web.tools.preflight.summary':
    'Eén concept, gecontroleerd tegen de tekst- en medialimieten van tien platforms tegelijk.',
  'web.tools.utm.name': 'UTM-linkbouwer',
  'web.tools.utm.summary':
    'Bouw een getagde campagne-URL zonder de querystring die hij al had te verpesten.',
  'web.tools.youtubeTitle.name': 'YouTube-titellengtecontrole',
  'web.tools.youtubeTitle.summary': 'Meet een titel zoals een persoon tekens telt.',
  'web.tools.timeZone.name': 'Tijdzone- en zomertijdplanner',
  'web.tools.timeZone.summary':
    'Eén publicatietijdstip in meerdere doelgroepzones, met de zomertijdverschuivingen gemarkeerd.',
  'web.tools.engagementRate.name': 'Betrokkenheidspercentage-calculator',
  'web.tools.engagementRate.summary':
    'Interacties gedeeld door bereik, volgers of vertoningen. Niets opgezocht, niets vergeleken met een benchmark.',

  /* ---------------------------------------------------------------------- */
  /* Post preflight checker                                                  */
  /* ---------------------------------------------------------------------- */

  'web.tools.preflight.title': 'Post preflight-controle',
  'web.tools.preflight.lede':
    'Plak een concept, kies de platforms waarop je publiceert, en zie welke het zouden afwijzen voordat je het via een API-fout ontdekt.',
  'web.tools.preflight.explainer.title': 'Waarom een tekenteller niet genoeg is',
  'web.tools.preflight.explainer.body':
    'Platforms zijn het oneens over wat een teken is. Sommige tellen code-eenheden, dus één emoji kost twee. Sommige tellen grafemen, dus een vlag of een familie-emoji kost één. Sommige herschrijven elke link naar een vaste breedte, zodat een URL van 200 tekens hetzelfde kost als een van 20. Deze tool past elke platformregel apart toe.',
  'web.tools.preflight.explainer.counting':
    'Het concept wordt gemeten met de Intl-segmenteerder van de browser, die tekst opdeelt in de eenheden die een lezer tekens zou noemen, en vervolgens aangepast aan de platformregel.',
  'web.tools.preflight.field.draft.label': 'Je concept',
  'web.tools.preflight.field.draft.help':
    'Plak de berichttekst. Links worden automatisch gedetecteerd zodat hun kosten per platform kunnen worden toegepast.',
  'web.tools.preflight.field.platforms.label': 'Te controleren platforms',
  'web.tools.preflight.field.platforms.help': 'Kies er zoveel als je gebruikt om te publiceren.',
  'web.tools.preflight.field.mediaKind.label': 'Bijgevoegde media',
  'web.tools.preflight.field.mediaKind.none': 'Geen media',
  'web.tools.preflight.field.mediaKind.image': 'Afbeeldingen',
  'web.tools.preflight.field.mediaKind.video': 'Eén video',
  'web.tools.preflight.field.mediaCount.label': 'Hoeveel afbeeldingen',
  'web.tools.preflight.field.byteSize.label': 'Bestandsgrootte in megabytes',
  'web.tools.preflight.field.byteSize.help':
    'Het grootste enkele bestand. Laat leeg om over te slaan.',
  'web.tools.preflight.field.duration.label': 'Videolengte in seconden',
  'web.tools.preflight.field.duration.help': 'Laat leeg om de duurcontrole over te slaan.',
  'web.tools.preflight.field.width.label': 'Mediabreedte in pixels',
  'web.tools.preflight.field.height.label': 'Mediahoogte in pixels',
  'web.tools.preflight.field.dimensions.help':
    'Optioneel. Alleen gebruikt om de beeldverhouding te tonen die je zou publiceren.',
  'web.tools.preflight.results.title': 'Resultaat per platform',
  'web.tools.preflight.results.empty': 'Kies minstens één platform om een resultaat te zien.',
  'web.tools.preflight.results.summary':
    '{fail, plural, =0 {Niets blokkerends} other {# zouden mislukken}}, {warning, plural, =0 {geen waarschuwingen} other {# om te bekijken}}.',
  'web.tools.preflight.status.pass': 'Past',
  'web.tools.preflight.status.warning': 'Het bekijken waard',
  'web.tools.preflight.status.fail': 'Zou mislukken',
  'web.tools.preflight.status.unavailable': 'Niet beschikbaar',
  'web.tools.preflight.count.label':
    '{count} van {limit} {unit, select, grapheme {tekens} utf16 {code-eenheden} weighted {gewogen tekens} other {tekens}}',
  'web.tools.preflight.finding.textOver':
    'Over de limiet met {over, plural, one {# teken} other {# tekens}}.',
  'web.tools.preflight.finding.textNear': 'Binnen {remaining} tekens van de limiet.',
  'web.tools.preflight.finding.textFits': 'De tekst past.',
  'web.tools.preflight.finding.linkFixed':
    'Elke link wordt herschreven naar een vaste breedte, dus elke kost {cost} tekens ongeacht de werkelijke lengte.',
  'web.tools.preflight.finding.linkActual': 'Links tellen als de tekens die ze innemen.',
  'web.tools.preflight.finding.imagesOver':
    'Dit platform accepteert {limit, plural, =0 {geen afbeeldingen} one {# afbeelding} other {# afbeeldingen}} in één bericht.',
  'web.tools.preflight.finding.videosOver':
    "Dit platform accepteert {limit, plural, =0 {geen video} one {# video} other {# video's}} in één bericht.",
  'web.tools.preflight.finding.bytesOver': 'Het bestand is groter dan het plafond van {limit}.',
  'web.tools.preflight.finding.bytesUnknown':
    'Geen gepubliceerd byteplafond voor dit mediatype, dus de grootte is niet gecontroleerd.',
  'web.tools.preflight.finding.durationOver': 'Langer dan het plafond van {limit} seconden.',
  'web.tools.preflight.finding.durationUnder': 'Korter dan het minimum van {limit} seconden.',
  'web.tools.preflight.finding.durationUnknown':
    'Geen gepubliceerd duurplafond, dus de lengte is niet gecontroleerd.',
  'web.tools.preflight.finding.altText':
    'Alt-tekst wordt geaccepteerd tot {limit} tekens, wat het gebruiken waard is.',
  'web.tools.preflight.finding.ratio': 'Je zou publiceren op ongeveer {ratio} op 1.',
  'web.tools.preflight.faq.counting.q': 'Hoe tellen jullie tekens?',
  'web.tools.preflight.faq.counting.a':
    'Per grafeem, met de Intl-segmenteerder van de browser, wat de eenheid is die een lezer bedoelt met een teken. Waar een platform een andere regel documenteert, zoals code-eenheden tellen of een vaste breedte per link berekenen, wordt die regel daarbovenop toegepast.',
  'web.tools.preflight.faq.accuracy.q': 'Hoe actueel zijn deze limieten?',
  'web.tools.preflight.faq.accuracy.a':
    'Elke limiet wordt gegenereerd uit de connectorcode in onze repository in plaats van in een pagina getypt, en elke platformrij toont het officiële document waar hij vandaan komt en de datum waarop iemand het las. Als een platform een getal wijzigt, is de correctie één codewijziging en volgt elke tool hier.',
  'web.tools.preflight.faq.privacy.q': 'Wordt mijn concept ergens geüpload?',
  'web.tools.preflight.faq.privacy.a':
    'Nee. De controle werkt in je browser. Er is geen verzoek dat je tekst draagt, er wordt niets opgeslagen, en het tabblad sluiten is genoeg om het te verwijderen.',
  'web.tools.preflight.faq.publish.q': 'Kan deze tool voor mij publiceren?',
  'web.tools.preflight.faq.publish.a':
    'Nog niet. Geen enkele connector heeft providerverificatie voltooid, dus niets op deze site publiceert nog naar een platform. Deze pagina is een limietcontrole, geen opsteller.',

  /* ---------------------------------------------------------------------- */
  /* UTM builder                                                             */
  /* ---------------------------------------------------------------------- */

  'web.tools.utm.title': 'UTM-linkbouwer',
  'web.tools.utm.lede':
    'Voeg campagneparameters toe aan een URL zonder de querystring te verliezen die hij al had, en zonder te gokken wat elke parameter betekent.',
  'web.tools.utm.explainer.title': 'Waar elke parameter voor dient',
  'web.tools.utm.explainer.body':
    'UTM-parameters worden gelezen door analysetools, niet door het platform waarop je publiceert. Ze reizen mee in de URL, dus iedereen die de link ziet, ziet ze. Houd ze kort, in kleine letters en consistent, want twee spellingen van dezelfde campagne worden twee rijen in een rapport.',
  'web.tools.utm.field.url.label': 'Bestemmings-URL',
  'web.tools.utm.field.url.help': 'De pagina waar je mensen naartoe wilt sturen, inclusief https.',
  'web.tools.utm.field.url.invalid': 'Dit wordt niet geparst als een http- of https-URL.',
  'web.tools.utm.field.source.label': 'Campagnebron',
  'web.tools.utm.field.source.help': 'Waar de klik vandaan kwam. Bijvoorbeeld een platformnaam.',
  'web.tools.utm.field.medium.label': 'Campagnemedium',
  'web.tools.utm.field.medium.help': 'Het soort link. Bijvoorbeeld social, e-mail of referral.',
  'web.tools.utm.field.campaign.label': 'Campagnenaam',
  'web.tools.utm.field.campaign.help':
    'De lancering, promotie of het thema waartoe deze link behoort.',
  'web.tools.utm.field.term.label': 'Campagneterm',
  'web.tools.utm.field.term.help': 'Optioneel. Traditioneel het betaalde trefwoord.',
  'web.tools.utm.field.content.label': 'Campagne-inhoud',
  'web.tools.utm.field.content.help':
    'Optioneel. Onderscheidt twee links naar dezelfde pagina, bijvoorbeeld twee versies van een bericht.',
  'web.tools.utm.result.title': 'Je getagde URL',
  'web.tools.utm.result.empty': 'Voer een bestemmings-URL in om het resultaat te zien.',
  'web.tools.utm.result.label': 'Samengestelde URL',
  'web.tools.utm.result.preserved':
    'De querystring die al op je URL stond, wordt precies zo bewaard als je hem typte.',
  'web.tools.utm.result.replaced':
    'Je URL bevatte al een van deze parameters. De waarde die je hier invulde, vervangt hem.',
  'web.tools.utm.faq.encoding.q': 'Wat gebeurt er met spaties en accenten?',
  'web.tools.utm.faq.encoding.a':
    'Ze worden percent-gecodeerd, wat een link laat overleven wanneer hij in een bericht wordt geplakt. Een spatie wordt een plusteken en een letter met accent wordt zijn gecodeerde vorm, en analysetools decoderen beide terug.',
  'web.tools.utm.faq.existing.q': 'Breekt het een URL die al parameters heeft?',
  'web.tools.utm.faq.existing.a':
    'Nee. Bestaande parameters worden in hun oorspronkelijke volgorde bewaard, en alleen een UTM-parameter die je invulde, wordt toegevoegd of vervangen. Een fragment aan het einde van de URL blijft aan het einde.',
  'web.tools.utm.faq.privacy.q': 'Wordt mijn URL ergens naartoe gestuurd?',
  'web.tools.utm.faq.privacy.a':
    'Nee. De URL wordt in je browser samengesteld en verlaat deze pagina nooit.',

  /* ---------------------------------------------------------------------- */
  /* YouTube title length checker                                            */
  /* ---------------------------------------------------------------------- */

  'web.tools.youtubeTitle.title': 'YouTube-titellengtecontrole',
  'web.tools.youtubeTitle.lede':
    'Een titel die één teken te lang is, wordt bij uploaden geweigerd. Een titel die gewoon lang is, wordt ergens afgekapt waar je niet voor koos.',
  'web.tools.youtubeTitle.explainer.title': 'Twee verschillende limieten',
  'web.tools.youtubeTitle.explainer.body':
    'Het harde plafond is wat het uploadeindpunt accepteert. Waar een titel wordt getoond, is een aparte vraag: een zoekresultaat, een zijbalk en een telefoon kappen een titel allemaal op een ander punt af, en geen van die afkappunten wordt gepubliceerd. Deze tool geeft het gedocumenteerde plafond en toont de vorm van je titel, en verzint geen afkapgetal.',
  'web.tools.youtubeTitle.field.title.label': 'Videotitel',
  'web.tools.youtubeTitle.field.title.help': 'Geteld per grafeem, dus een emoji kost er één.',
  'web.tools.youtubeTitle.result.count': '{count} van {limit} tekens',
  'web.tools.youtubeTitle.result.over':
    'Over de limiet met {over, plural, one {# teken} other {# tekens}}. De upload zou worden geweigerd.',
  'web.tools.youtubeTitle.result.fits': 'Binnen het gedocumenteerde plafond.',
  'web.tools.youtubeTitle.result.front':
    'De eerste {count} tekens dragen het meeste gewicht, omdat dat ongeveer is wat een smalle indeling ruimte voor heeft. De jouwe beginnen: {preview}',
  'web.tools.youtubeTitle.result.unavailable':
    'De titellimiet is niet beschikbaar in deze build, dus hier wordt niets gecontroleerd.',
  'web.tools.youtubeTitle.faq.limit.q': 'Waar komt de limiet vandaan?',
  'web.tools.youtubeTitle.faq.limit.a':
    'Uit de officiële videos insert-referentie, gegenereerd op deze pagina uit dezelfde connectorcode die onze uploader zou gebruiken. De datum waarop iemand die pagina voor het laatst las, staat naast het getal.',
  'web.tools.youtubeTitle.faq.truncation.q': 'Waar precies kapt YouTube een titel af?',
  'web.tools.youtubeTitle.faq.truncation.a':
    'Dat hangt af van het oppervlak en de viewport, en YouTube publiceert daar geen tekenaantal voor. We tonen het plafond, dat gedocumenteerd is, en we drukken geen afkapgetal af dat een gok zou zijn.',
  'web.tools.youtubeTitle.faq.emoji.q': 'Telt een emoji als één teken?',
  'web.tools.youtubeTitle.faq.emoji.a':
    'In deze teller wel, omdat we grafemen tellen. Een platform dat intern code-eenheden telt, kan meer in rekening brengen voor dezelfde emoji, wat waarom de preflight-controle elke platformregel apart toepast.',

  /* ---------------------------------------------------------------------- */
  /* Time zone and daylight saving planner                                   */
  /* ---------------------------------------------------------------------- */

  'web.tools.timeZone.title': 'Tijdzone- en zomertijdplanner',
  'web.tools.timeZone.lede':
    'Een wekelijks tijdslot dat stabiel lijkt in je agenda, verschuift voor de helft van je publiek twee keer per jaar. Dit toont waar en wanneer.',
  'web.tools.timeZone.explainer.title': 'Waarom een vaste lokale tijd geen vaste tijd is',
  'web.tools.timeZone.explainer.body':
    "Een tijdstip betekent alleen iets met een zone erbij. Zones veranderen hun verschil op data die per land verschillen, en twee regio's die in januari vijf uur uit elkaar liggen, kunnen in april vier uur uit elkaar liggen. Een schema opgeslagen als moment plus zone overleeft dat. Een schema opgeslagen als lokaal uur niet.",
  'web.tools.timeZone.field.date.label': 'Datum',
  'web.tools.timeZone.field.time.label': 'Tijd',
  'web.tools.timeZone.field.zone.label': 'Jouw zone',
  'web.tools.timeZone.field.audience.label': 'Doelgroepzones',
  'web.tools.timeZone.field.audience.help': 'Kies de zones waarin je lezers daadwerkelijk zitten.',
  'web.tools.timeZone.result.title': 'Hetzelfde moment, overal waar je koos',
  'web.tools.timeZone.result.empty': 'Kies minstens één doelgroepzone.',
  'web.tools.timeZone.result.shift':
    'Er valt een zomertijdverandering tussen deze datum en dezelfde weekdag vier weken later, dus het lokale uur verschuift.',
  'web.tools.timeZone.result.stable': 'Geen verschuiving in de komende vier weken.',
  'web.tools.timeZone.result.later': 'Vier weken later, {time}.',
  'web.tools.timeZone.result.invalidDate': 'Voer een datum en tijd in om de vergelijking te zien.',
  'web.tools.timeZone.faq.dst.q': 'In welke richting verschuift het uur?',
  'web.tools.timeZone.faq.dst.a':
    'Dat hangt af van de zone en de richting van de verandering, daarom toont de tabel de werkelijke lokale tijd vier weken vooruit in plaats van de regel te beschrijven. Het verschil per zone wordt gelezen uit de tijdzonedatabase van je browser.',
  'web.tools.timeZone.faq.storage.q': 'Hoe moet een gepland bericht zijn tijd opslaan?',
  'web.tools.timeZone.faq.storage.a':
    'Als een moment plus de IANA-zone die de persoon koos, nooit als een naïeve lokale tijd. Dat is wat we intern doen, en daarom landt een bericht dat voor een klokverandering is gepland, toch op het bedoelde lokale uur.',

  /* ---------------------------------------------------------------------- */
  /* Engagement rate calculator                                              */
  /* ---------------------------------------------------------------------- */

  'web.tools.engagementRate.title': 'Betrokkenheidspercentage-calculator',
  'web.tools.engagementRate.lede':
    'Typ de cijfers die je eigen dashboard je al toont. Dit deelt ze op drie manieren en stopt daar: geen benchmark, geen "goede" drempel, niets dat we niet echt hebben.',
  'web.tools.engagementRate.explainer.title': 'Waarom drie noemers, niet één',
  'web.tools.engagementRate.explainer.body':
    'Bereik, volgers en vertoningen beantwoorden verschillende vragen. Percentage op bereik vertelt je hoe de mensen die het bericht daadwerkelijk zagen, reageerden. Percentage op volgers vertelt je welk deel van je publiek betrokken was, ongeacht of het bericht iedereen bereikte. Percentage op vertoningen telt elke weergave, inclusief herhalingen. Een op de ene manier berekend percentage vergelijken met een op een andere manier berekend percentage is een veelvoorkomende bron van een betrokkenheidscijfer dat verkeerd oogt.',
  'web.tools.engagementRate.field.interactions.label': 'Interacties',
  'web.tools.engagementRate.field.interactions.help':
    'Likes, reacties, shares en bewaringen bij elkaar opgeteld, van het bericht dat je meet.',
  'web.tools.engagementRate.field.reach.label': 'Bereik',
  'web.tools.engagementRate.field.reach.help': 'Accounts die het bericht minstens één keer zagen.',
  'web.tools.engagementRate.field.followers.label': 'Volgers',
  'web.tools.engagementRate.field.followers.help':
    'De accountgrootte op het moment van het bericht.',
  'web.tools.engagementRate.field.impressions.label': 'Vertoningen',
  'web.tools.engagementRate.field.impressions.help':
    'Totaal aantal weergaven, inclusief een persoon die het twee keer zag.',
  'web.tools.engagementRate.result.title': 'Betrokkenheidspercentage, op drie manieren',
  'web.tools.engagementRate.result.empty': 'niet beschikbaar',
  'web.tools.engagementRate.result.note':
    'Er is geen universeel goed percentage om mee te vergelijken. Het hangt af van platform, formaat, publieksgrootte en branche, en elk enkel getal dat als benchmark wordt aangeboden, is een gok vermomd als data.',
  'web.tools.engagementRate.basis.reach': 'Op bereik',
  'web.tools.engagementRate.basis.followers': 'Op volgers',
  'web.tools.engagementRate.basis.impressions': 'Op vertoningen',
  'web.tools.engagementRate.faq.formula.q': 'Wat is de werkelijke formule?',
  'web.tools.engagementRate.faq.formula.a':
    'Interacties gedeeld door de noemer die je kiest, getoond als percentage. Interacties betekent hier likes, reacties, shares en bewaringen bij elkaar opgeteld; sommige platforms rapporteren die apart, in welk geval jij ze zelf optelt voordat je het totaal invoert.',
  'web.tools.engagementRate.faq.basis.q': 'Welke noemer moet ik gebruiken?',
  'web.tools.engagementRate.faq.basis.a':
    'Welke je platform ook rapporteert naast het bericht, zodat de twee cijfers uit hetzelfde meetvenster komen. Een percentage op bereik van het ene bericht vergelijken met een percentage op volgers van een ander bericht is geen eerlijke vergelijking, ook al worden beide een betrokkenheidspercentage genoemd.',
} as const;
