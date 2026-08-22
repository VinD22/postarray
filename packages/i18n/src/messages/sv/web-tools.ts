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

  'web.meta.tools.title': 'Gratis publiceringsverktyg',
  'web.meta.tools.description':
    'Små, privata verktyg för dig som publicerar på flera plattformar: en gränskontroll per plattform, en UTM-byggare, en YouTube-titellängdskontroll och en tidszonsplanerare.',
  'web.meta.tools.preflight.title': 'Preflight-kontroll för inlägg',
  'web.meta.tools.preflight.description':
    'Kontrollera ett utkast mot de publicerade text- och mediegränserna för tio plattformar, med källan och datumet varje gräns lästes.',
  'web.meta.tools.utm.title': 'UTM-länkbyggare',
  'web.meta.tools.utm.description':
    'Skapa en taggad kampanj-URL och se vad varje UTM-parameter betyder. Körs helt i din webbläsare.',
  'web.meta.tools.youtubeTitle.title': 'Kontroll av YouTube-titellängd',
  'web.meta.tools.youtubeTitle.description':
    'Mät en YouTube-titel mot det dokumenterade taket, räknat som en person räknar tecken.',
  'web.meta.tools.timeZone.title': 'Planerare för tidszon och sommartid',
  'web.meta.tools.timeZone.description':
    'Se en publiceringstid över flera målgruppszoner och hitta veckorna där en sommartidsändring flyttar den lokala timmen.',
  'web.meta.tools.engagementRate.title': 'Kalkylator för engagemangsgrad',
  'web.meta.tools.engagementRate.description':
    'Dela interaktioner med räckvidd, följare eller visningar. Tre enkla beräkningar, ingen påhittad riktmärke.',

  /* ---------------------------------------------------------------------- */
  /* Shared tool furniture                                                   */
  /* ---------------------------------------------------------------------- */

  'web.tools.index.title': 'Gratis verktyg',
  'web.tools.index.summary':
    'Små kalkylatorer byggda på samma plattformsgränsdata som våra anslutningar läser.',
  'web.tools.index.lede':
    'Fyra små verktyg, byggda på samma plattformsgränsdata som våra anslutningar använder. Inget konto, ingen uppladdning, ingen spårning av vad du skriver.',
  'web.tools.index.dataTitle': 'Var siffrorna kommer ifrån',
  'web.tools.index.dataBody':
    'Varje gräns genereras från connectorförmågekoden i detta repository, och varje plattformsrad bär den officiella dokumentationssidan den kommer från och datumet en person läste den sidan.',
  'web.tools.index.honesty':
    'Dessa verktyg publicerar ingenting. Ingen anslutning har slutfört leverantörsverifiering än, så inget här ansluter ett konto.',
  'web.tools.shared.privacyTitle': 'Detta körs i din webbläsare',
  'web.tools.shared.privacyBody':
    'Allt du skriver stannar på denna sida. Det finns ingen förfrågan till en server, ingen lagring och ingen analyshändelse som bär din text.',
  'web.tools.shared.sourceLink': 'Plattformsdokumentation',
  'web.tools.shared.sourceRead': 'Läst {date}',
  'web.tools.shared.unavailable': 'inte tillgängligt',
  'web.tools.shared.unavailableWhy':
    'Vi levererar ännu ingen anslutning för denna plattform, så vi har ingen verifierad gräns att visa. Vi säger hellre inget än att gissa.',
  'web.tools.shared.copy': 'Kopiera',
  'web.tools.shared.copied': 'Kopierat',
  'web.tools.shared.copyFailed':
    'Din webbläsare blockerade kopieringen. Markera texten och kopiera den.',
  'web.tools.shared.faqTitle': 'Frågor',
  'web.tools.shared.baselineTitle': 'Vilket konto dessa siffror beskriver',
  'web.tools.shared.baselineBody':
    'Det försiktiga fallet: ett nyanslutet konto utan förhöjd behörighet. Vissa plattformar höjer ett tak när en kanal eller ett företag är verifierat, och där det händer säger sidan det.',
  'web.tools.shared.otherTools': 'Andra verktyg',

  /* ---------------------------------------------------------------------- */
  /* Tool names and one line summaries, shared by the index and the footer   */
  /* ---------------------------------------------------------------------- */

  'web.tools.preflight.name': 'Preflight-kontroll för inlägg',
  'web.tools.preflight.summary':
    'Ett utkast, kontrollerat mot text- och mediegränserna för tio plattformar samtidigt.',
  'web.tools.utm.name': 'UTM-länkbyggare',
  'web.tools.utm.summary': 'Bygg en taggad kampanj-URL utan att förstöra frågesträngen den hade.',
  'web.tools.youtubeTitle.name': 'Kontroll av YouTube-titellängd',
  'web.tools.youtubeTitle.summary': 'Mät en titel som en person räknar tecken.',
  'web.tools.timeZone.name': 'Planerare för tidszon och sommartid',
  'web.tools.timeZone.summary':
    'En publiceringstid över flera målgruppszoner, med sommartidsskiftena markerade.',
  'web.tools.engagementRate.name': 'Kalkylator för engagemangsgrad',
  'web.tools.engagementRate.summary':
    'Interaktioner delat med räckvidd, följare eller visningar. Inget uppslaget, inget riktmärkt.',

  /* ---------------------------------------------------------------------- */
  /* Post preflight checker                                                  */
  /* ---------------------------------------------------------------------- */

  'web.tools.preflight.title': 'Preflight-kontroll för inlägg',
  'web.tools.preflight.lede':
    'Klistra in ett utkast, välj plattformarna du publicerar på, och se vilka som skulle avvisa det innan du märker det via ett API-fel.',
  'web.tools.preflight.explainer.title': 'Varför en teckenräknare inte räcker',
  'web.tools.preflight.explainer.body':
    'Plattformar är oense om vad ett tecken är. Vissa räknar kodenheter, så en emoji kostar två. Vissa räknar grafem, så en flagga eller en familjeemoji kostar ett. Vissa skriver om varje länk till en fast bredd, så en URL på 200 tecken kostar detsamma som en på 20. Detta verktyg tillämpar varje plattforms regel separat.',
  'web.tools.preflight.explainer.counting':
    'Utkastet mäts med webbläsarens Intl-segmenterare, som delar upp text i de enheter en läsare skulle kalla tecken, och justeras sedan för plattformens regel.',
  'web.tools.preflight.field.draft.label': 'Ditt utkast',
  'web.tools.preflight.field.draft.help':
    'Klistra in inläggstexten. Länkar upptäcks automatiskt så deras kostnad kan tillämpas per plattform.',
  'web.tools.preflight.field.platforms.label': 'Plattformar att kontrollera',
  'web.tools.preflight.field.platforms.help': 'Välj så många som du publicerar på.',
  'web.tools.preflight.field.mediaKind.label': 'Bifogad media',
  'web.tools.preflight.field.mediaKind.none': 'Ingen media',
  'web.tools.preflight.field.mediaKind.image': 'Bilder',
  'web.tools.preflight.field.mediaKind.video': 'En video',
  'web.tools.preflight.field.mediaCount.label': 'Hur många bilder',
  'web.tools.preflight.field.byteSize.label': 'Filstorlek i megabyte',
  'web.tools.preflight.field.byteSize.help':
    'Den största enskilda filen. Lämna tomt för att hoppa över.',
  'web.tools.preflight.field.duration.label': 'Videolängd i sekunder',
  'web.tools.preflight.field.duration.help': 'Lämna tomt för att hoppa över längdkontrollen.',
  'web.tools.preflight.field.width.label': 'Mediabredd i pixlar',
  'web.tools.preflight.field.height.label': 'Mediahöjd i pixlar',
  'web.tools.preflight.field.dimensions.help':
    'Valfritt. Används endast för att visa bildförhållandet du skulle publicera.',
  'web.tools.preflight.results.title': 'Resultat per plattform',
  'web.tools.preflight.results.empty': 'Välj minst en plattform för att se ett resultat.',
  'web.tools.preflight.results.summary':
    '{fail, plural, =0 {Inget blockerar} other {# skulle misslyckas}}, {warning, plural, =0 {inga varningar} other {# att titta på}}.',
  'web.tools.preflight.status.pass': 'Passar',
  'web.tools.preflight.status.warning': 'Värt att kontrollera',
  'web.tools.preflight.status.fail': 'Skulle misslyckas',
  'web.tools.preflight.status.unavailable': 'Inte tillgängligt',
  'web.tools.preflight.count.label':
    '{count} av {limit} {unit, select, grapheme {tecken} utf16 {kodenheter} weighted {viktade tecken} other {tecken}}',
  'web.tools.preflight.finding.textOver':
    'Över gränsen med {over, plural, one {# tecken} other {# tecken}}.',
  'web.tools.preflight.finding.textNear': 'Inom {remaining} tecken från gränsen.',
  'web.tools.preflight.finding.textFits': 'Texten får plats.',
  'web.tools.preflight.finding.linkFixed':
    'Varje länk skrivs om till en fast bredd, så var och en kostar {cost} tecken oavsett dess verkliga längd.',
  'web.tools.preflight.finding.linkActual': 'Länkar räknas som de tecken de upptar.',
  'web.tools.preflight.finding.imagesOver':
    'Denna plattform accepterar {limit, plural, =0 {inga bilder} one {# bild} other {# bilder}} i ett inlägg.',
  'web.tools.preflight.finding.videosOver':
    'Denna plattform accepterar {limit, plural, =0 {ingen video} one {# video} other {# videor}} i ett inlägg.',
  'web.tools.preflight.finding.bytesOver': 'Filen är större än taket på {limit}.',
  'web.tools.preflight.finding.bytesUnknown':
    'Inget publicerat byte-tak för denna mediatyp, så storleken kontrollerades inte.',
  'web.tools.preflight.finding.durationOver': 'Längre än taket på {limit} sekunder.',
  'web.tools.preflight.finding.durationUnder': 'Kortare än minimum på {limit} sekunder.',
  'web.tools.preflight.finding.durationUnknown':
    'Inget publicerat längdtak, så längden kontrollerades inte.',
  'web.tools.preflight.finding.altText':
    'Alt-text accepteras upp till {limit} tecken, vilket är värt att använda.',
  'web.tools.preflight.finding.ratio': 'Du skulle publicera i cirka {ratio} till 1.',
  'web.tools.preflight.faq.counting.q': 'Hur räknar ni tecken?',
  'web.tools.preflight.faq.counting.a':
    'Per grafem, med webbläsarens Intl-segmenterare, vilket är den enhet en läsare menar med ett tecken. Där en plattform dokumenterar en annan regel, som att räkna kodenheter eller ta ut en fast bredd per länk, tillämpas den regeln utöver.',
  'web.tools.preflight.faq.accuracy.q': 'Hur aktuella är dessa gränser?',
  'web.tools.preflight.faq.accuracy.a':
    'Varje gräns genereras från connectorkoden i vårt repository i stället för att skrivas in på en sida, och varje plattformsrad visar det officiella dokumentet den kommer från och datumet en person läste det. Om en plattform ändrar ett tal är fixet en enda kodändring och varje verktyg här följer med.',
  'web.tools.preflight.faq.privacy.q': 'Laddas mitt utkast upp någonstans?',
  'web.tools.preflight.faq.privacy.a':
    'Nej. Kontrollen körs i din webbläsare. Det finns ingen förfrågan som bär din text, inget lagras, och att stänga fliken räcker för att kasta bort det.',
  'web.tools.preflight.faq.publish.q': 'Kan detta verktyg publicera åt mig?',
  'web.tools.preflight.faq.publish.a':
    'Inte idag. Ingen anslutning har slutfört leverantörsverifiering, så inget på denna webbplats publicerar till en plattform än. Denna sida är en gränskontroll, inte en redigerare.',

  /* ---------------------------------------------------------------------- */
  /* UTM builder                                                             */
  /* ---------------------------------------------------------------------- */

  'web.tools.utm.title': 'UTM-länkbyggare',
  'web.tools.utm.lede':
    'Lägg till kampanjparametrar till en URL utan att förlora frågesträngen den redan hade, och utan att gissa vad varje parameter betyder.',
  'web.tools.utm.explainer.title': 'Vad varje parameter är till för',
  'web.tools.utm.explainer.body':
    'UTM-parametrar läses av analysverktyg, inte av plattformen du publicerar på. De reser i URL:en, så alla som ser länken ser dem. Håll dem korta, gemener och konsekventa, eftersom två stavningar av samma kampanj blir två rader i en rapport.',
  'web.tools.utm.field.url.label': 'Destinations-URL',
  'web.tools.utm.field.url.help': 'Sidan du vill att folk ska landa på, inklusive https.',
  'web.tools.utm.field.url.invalid': 'Detta tolkas inte som en http- eller https-URL.',
  'web.tools.utm.field.source.label': 'Kampanjkälla',
  'web.tools.utm.field.source.help': 'Var klicket kom ifrån. Till exempel ett plattformsnamn.',
  'web.tools.utm.field.medium.label': 'Kampanjmedium',
  'web.tools.utm.field.medium.help': 'Typen av länk. Till exempel social, e-post eller hänvisning.',
  'web.tools.utm.field.campaign.label': 'Kampanjnamn',
  'web.tools.utm.field.campaign.help': 'Lanseringen, kampanjen eller temat denna länk hör till.',
  'web.tools.utm.field.term.label': 'Kampanjterm',
  'web.tools.utm.field.term.help': 'Valfritt. Traditionellt det betalda sökordet.',
  'web.tools.utm.field.content.label': 'Kampanjinnehåll',
  'web.tools.utm.field.content.help':
    'Valfritt. Skiljer på två länkar till samma sida, till exempel två versioner av ett inlägg.',
  'web.tools.utm.result.title': 'Din taggade URL',
  'web.tools.utm.result.empty': 'Ange en destinations-URL för att se resultatet.',
  'web.tools.utm.result.label': 'Sammansatt URL',
  'web.tools.utm.result.preserved':
    'Frågesträngen som redan fanns på din URL behålls exakt som du skrev den.',
  'web.tools.utm.result.replaced':
    'Din URL bar redan en av dessa parametrar. Värdet du angav här ersätter det.',
  'web.tools.utm.faq.encoding.q': 'Vad händer med mellanslag och accenter?',
  'web.tools.utm.faq.encoding.a':
    'De procentkodas, vilket är vad som gör att en länk överlever att klistras in i ett inlägg. Ett mellanslag blir ett plustecken och en bokstav med accent blir sin kodade form, och analysverktyg avkodar båda tillbaka.',
  'web.tools.utm.faq.existing.q': 'Förstör det en URL som redan har parametrar?',
  'web.tools.utm.faq.existing.a':
    'Nej. Befintliga parametrar bevaras i sin ursprungliga ordning, och endast en UTM-parameter du fyllde i läggs till eller ersätts. Ett fragment i slutet av URL:en förblir i slutet.',
  'web.tools.utm.faq.privacy.q': 'Skickas min URL någonstans?',
  'web.tools.utm.faq.privacy.a':
    'Nej. URL:en sätts samman i din webbläsare och lämnar aldrig denna sida.',

  /* ---------------------------------------------------------------------- */
  /* YouTube title length checker                                            */
  /* ---------------------------------------------------------------------- */

  'web.tools.youtubeTitle.title': 'Kontroll av YouTube-titellängd',
  'web.tools.youtubeTitle.lede':
    'En titel som är ett tecken för lång avvisas vid uppladdning. En titel som bara är lång klipps av på en punkt du inte valde.',
  'web.tools.youtubeTitle.explainer.title': 'Två olika gränser',
  'web.tools.youtubeTitle.explainer.body':
    'Det hårda taket är vad uppladdningsslutpunkten accepterar. Var en titel visas är en separat fråga: ett sökresultat, en sidopanel och en telefon klipper alla av en titel på olika ställen, och ingen av dessa avklippningspunkter publiceras. Detta verktyg anger det dokumenterade taket och visar formen på din titel, och hittar inte på ett avklippningstal.',
  'web.tools.youtubeTitle.field.title.label': 'Videotitel',
  'web.tools.youtubeTitle.field.title.help': 'Räknat per grafem, så en emoji kostar ett.',
  'web.tools.youtubeTitle.result.count': '{count} av {limit} tecken',
  'web.tools.youtubeTitle.result.over':
    'Över med {over, plural, one {# tecken} other {# tecken}}. Uppladdningen skulle avvisas.',
  'web.tools.youtubeTitle.result.fits': 'Inom det dokumenterade taket.',
  'web.tools.youtubeTitle.result.front':
    'De första {count} tecknen bär mest tyngd, eftersom det är ungefär vad en smal layout har plats för. Din börjar: {preview}',
  'web.tools.youtubeTitle.result.unavailable':
    'Titelgränsen är inte tillgänglig i denna build, så inget kontrolleras här.',
  'web.tools.youtubeTitle.faq.limit.q': 'Var kommer gränsen ifrån?',
  'web.tools.youtubeTitle.faq.limit.a':
    'Från den officiella videos insert-referensen, genererad på denna sida från samma connectorkod vår uppladdare skulle använda. Datumet en person senast läste den sidan visas bredvid siffran.',
  'web.tools.youtubeTitle.faq.truncation.q': 'Var exakt klipper YouTube av en titel?',
  'web.tools.youtubeTitle.faq.truncation.a':
    'Det beror på ytan och vyporten, och YouTube publicerar inget teckenantal för det. Vi visar taket, som är dokumenterat, och skriver inte ut ett avklippningstal som skulle vara en gissning.',
  'web.tools.youtubeTitle.faq.emoji.q': 'Räknas en emoji som ett tecken?',
  'web.tools.youtubeTitle.faq.emoji.a':
    'I denna räknare gör den det, eftersom vi räknar grafem. En plattform som internt räknar kodenheter kan ta ut mer för samma emoji, vilket är varför preflight-kontrollen tillämpar varje plattforms regel separat.',

  /* ---------------------------------------------------------------------- */
  /* Time zone and daylight saving planner                                   */
  /* ---------------------------------------------------------------------- */

  'web.tools.timeZone.title': 'Planerare för tidszon och sommartid',
  'web.tools.timeZone.lede':
    'En veckovis plats som ser stabil ut i din kalender flyttar sig för hälften av din publik två gånger om året. Detta visar var och när.',
  'web.tools.timeZone.explainer.title': 'Varför en fast lokal tid inte är en fast tid',
  'web.tools.timeZone.explainer.body':
    'En tid betyder bara något med en zon kopplad till sig. Zoner ändrar sin offset på datum som skiljer sig mellan länder, och två regioner som är fem timmar isär i januari kan vara fyra timmar isär i april. Ett schema lagrat som ett ögonblick plus en zon överlever det. Ett schema lagrat som en lokal timme gör inte det.',
  'web.tools.timeZone.field.date.label': 'Datum',
  'web.tools.timeZone.field.time.label': 'Tid',
  'web.tools.timeZone.field.zone.label': 'Din zon',
  'web.tools.timeZone.field.audience.label': 'Målgruppszoner',
  'web.tools.timeZone.field.audience.help': 'Välj zonerna dina läsare faktiskt är i.',
  'web.tools.timeZone.result.title': 'Samma ögonblick, överallt du valde',
  'web.tools.timeZone.result.empty': 'Välj minst en målgruppszon.',
  'web.tools.timeZone.result.shift':
    'En sommartidsändring faller mellan detta datum och samma veckodag fyra veckor senare, så den lokala timmen flyttas.',
  'web.tools.timeZone.result.stable': 'Ingen offsetändring under de kommande fyra veckorna.',
  'web.tools.timeZone.result.later': 'Fyra veckor senare, {time}.',
  'web.tools.timeZone.result.invalidDate': 'Ange ett datum och en tid för att se jämförelsen.',
  'web.tools.timeZone.faq.dst.q': 'Åt vilket håll flyttas timmen?',
  'web.tools.timeZone.faq.dst.a':
    'Det beror på zonen och riktningen på ändringen, vilket är varför tabellen visar den faktiska lokala tiden fyra veckor framåt i stället för att beskriva regeln. Offseten för varje zon läses från din webbläsares tidszondatabas.',
  'web.tools.timeZone.faq.storage.q': 'Hur ska ett schemalagt inlägg lagra sin tid?',
  'web.tools.timeZone.faq.storage.a':
    'Som ett ögonblick plus den IANA-zon personen valde, aldrig som en naiv lokal tid. Det är vad vi gör internt, och det är varför ett inlägg schemalagt före en klockändring ändå landar på den avsedda lokala timmen.',

  /* ---------------------------------------------------------------------- */
  /* Engagement rate calculator                                              */
  /* ---------------------------------------------------------------------- */

  'web.tools.engagementRate.title': 'Kalkylator för engagemangsgrad',
  'web.tools.engagementRate.lede':
    'Skriv in siffrorna din egen instrumentpanel redan visar dig. Detta delar dem tre sätt och stannar där: inget riktmärke, ingen "bra"-tröskel, inget vi inte faktiskt har.',
  'web.tools.engagementRate.explainer.title': 'Varför tre nämnare, inte en',
  'web.tools.engagementRate.explainer.body':
    'Räckvidd, följare och visningar besvarar olika frågor. Andel av räckvidd säger hur de som faktiskt såg inlägget reagerade. Andel av följare säger hur stor del av din publik som engagerade sig, oavsett om inlägget nådde alla. Andel av visningar räknar varje visning, inklusive upprepningar. Att jämföra en andel beräknad på ett sätt med en andel beräknad på ett annat är en vanlig källa till ett engagemangstal som ser fel ut.',
  'web.tools.engagementRate.field.interactions.label': 'Interaktioner',
  'web.tools.engagementRate.field.interactions.help':
    'Gillningar, kommentarer, delningar och sparningar summerade tillsammans, från inlägget du mäter.',
  'web.tools.engagementRate.field.reach.label': 'Räckvidd',
  'web.tools.engagementRate.field.reach.help': 'Konton som såg inlägget minst en gång.',
  'web.tools.engagementRate.field.followers.label': 'Följare',
  'web.tools.engagementRate.field.followers.help': 'Kontostorleken vid tiden för inlägget.',
  'web.tools.engagementRate.field.impressions.label': 'Visningar',
  'web.tools.engagementRate.field.impressions.help':
    'Totalt antal visningar, inklusive en person som såg det två gånger.',
  'web.tools.engagementRate.result.title': 'Engagemangsgrad, tre sätt',
  'web.tools.engagementRate.result.empty': 'inte tillgängligt',
  'web.tools.engagementRate.result.note':
    'Det finns ingen universellt bra andel att jämföra med. Det beror på plattform, format, publikstorlek och bransch, och varje enskild siffra som erbjuds som riktmärke är en gissning förklädd till data.',
  'web.tools.engagementRate.basis.reach': 'Per räckvidd',
  'web.tools.engagementRate.basis.followers': 'Per följare',
  'web.tools.engagementRate.basis.impressions': 'Per visningar',
  'web.tools.engagementRate.faq.formula.q': 'Vad är den faktiska formeln?',
  'web.tools.engagementRate.faq.formula.a':
    'Interaktioner delat med nämnaren du väljer, visad som en procentsats. Interaktioner betyder här gillningar, kommentarer, delningar och sparningar summerade tillsammans; vissa plattformar rapporterar dem separat, i vilket fall du själv adderar dem innan du skriver in totalen.',
  'web.tools.engagementRate.faq.basis.q': 'Vilken nämnare bör jag använda?',
  'web.tools.engagementRate.faq.basis.a':
    'Den din plattform rapporterar tillsammans med inlägget, så de två siffrorna kommer från samma mätfönster. Att jämföra en andel av räckvidd på ett inlägg med en andel av följare på ett annat är inte en rättvis jämförelse även om båda kallas en engagemangsgrad.',
} as const;
