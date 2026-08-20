/**
 * The public marketing site and public documentation surfaces.
 *
 * Rules that bind this file specifically, beyond the catalog rules in
 * `lint.ts`:
 *
 *  - Every claim here is either a product fact we control (price, channel
 *    allowance, surfaces) or a provider fact that carries a source link and a
 *    verification date in the page that renders it. No adjective stands in for
 *    a number.
 *  - Nothing here promises reach, ranking, engagement or "going" anywhere.
 *  - Nothing here describes AI image or AI video generation as a Relay
 *    feature, because it is not one.
 *  - No integration is called official until the provider has approved it. The
 *    connector matrix uses `capability.level.*` from `connections.ts` so the
 *    marketing site and the product cannot drift apart.
 *  - Legal wording that must be drafted by counsel is marked with
 *    `web.legal.counselPending.*` rather than guessed at here.
 */
export const webMarketingMessages = {
  /* ---------------------------------------------------------------------- */
  /* Shared marketing furniture                                              */
  /* ---------------------------------------------------------------------- */

  'web.brand.name': 'Relä',
  'web.brand.tagline': 'Det flerspråkiga publiceringskontrollplanet för personer och agenter.',
  'web.skipToContent': 'Hoppa till huvudinnehållet',
  'web.nav.label': 'Webbplatsnavigering',
  'web.nav.openMenu': 'Meny',
  'web.nav.closeMenu': 'Stäng menyn',
  'web.nav.footerLabel': 'Sidfotsnavigering',

  'web.cta.startTrial': 'Start the 7 day trial',
  'web.cta.seePricing': 'See the price',
  'web.cta.seeCapabilities': 'Läs kapacitetsmatrisen',
  'web.cta.readDocs': 'Läs dokumentationen',
  'web.cta.trialFootnote':
    'Polar collects a payment method, charges $0 today, and shows the exact first charge date before you confirm.',

  'web.label.lastReviewed': 'Senast granskad {date}',
  'web.label.nextReview': 'Nästa recension {date}',
  'web.label.researchDate': 'Undersökte {date}',
  'web.label.officialSource': 'Officiell källa',
  'web.label.onThisPage': 'På den här sidan',
  'web.label.provider': 'Plattform',
  'web.label.capability': 'Förmåga',

  'web.notFound.title': 'Det finns ingen sida på den här adressen',
  'web.notFound.body':
    'Länken kan vara inaktuell eller så har vi tagit bort sidan. Sidor som slutar vara korrekta tas bort snarare än lämnas upp, och ändringsloggen registrerar det när det händer.',
  'web.notFound.action': 'Gå till startsidan',

  'web.correction.title': 'Hittade något fel på denna sida',
  'web.correction.body':
    'Plattformsreglerna ändras och vi får saker fel. Skicka webbadressen och vad som är felaktigt så korrigerar vi sidan eller drar tillbaka den.',
  'web.correction.email': 'corrections@relay.example',

  /* ---------------------------------------------------------------------- */
  /* Metadata                                                                */
  /* ---------------------------------------------------------------------- */

  'web.meta.home.title': 'Relay, det flerspråkiga publiceringskontrollplanet',
  'web.meta.home.description':
    'Förvandla en idé till plattformsinnehåll, godkänn den en gång, publicera den på ett tillförlitligt sätt genom officiella plattforms-API:er och lär dig vad du kan förbättra härnäst.',
  'web.meta.product.title': 'Hur relä fungerar',
  'web.meta.product.description':
    'En genomgång av publiceringsbordet: komponera en gång, anpassa per plattform, validera mot de verkliga gränserna, godkänn, schemalägg, publicera och behåll kvittot.',
  'web.meta.integrations.title': 'Plattformar Relay publicerar till',
  'web.meta.integrations.description':
    'Vilka plattformar Relay ansluter till, vad varje anslutning kan göra idag och vad själva plattformen inte tillåter.',
  'web.meta.capabilities.title': 'Anslutningskapacitetsmatris',
  'web.meta.capabilities.description':
    'En per plattform, per funktionstabell genererad från våra anslutningsdefinitioner, som skiljer det vi har byggt från det som plattformen inte erbjuder.',
  'web.meta.creators.title': 'Relä för kreatörer',
  'web.meta.creators.description':
    'För soloskapare som publicerar samma idé i flera format och språk utan att skriva om den fem gånger.',
  'web.meta.agencies.title': 'Relä för byråer',
  'web.meta.agencies.description':
    'Klientseparering, godkännanden, delbara granskningslänkar, kvitton och rapportering för team som publicerar på uppdrag av andra.',
  'web.meta.developers.title': 'Relä för utvecklare',
  'web.meta.developers.description':
    'En backend bakom webbappen, REST API, en fjärransluten MCP-server, CLI och signerade webhooks. Samma godkännanderegler på alla ytor.',
  'web.meta.pricing.title': 'Pricing',
  'web.meta.pricing.description':
    'One plan. $29 a month, or $300 a year which is $25 a month billed annually. 30 active channels, unlimited team members, no feature tiers.',
  'web.meta.resources.title': 'Resurser',
  'web.meta.resources.description':
    'Status, ändringslogg, dokumentation, metodik, jämförelser, verktygsradarn och möjlighetskatalogen.',
  'web.meta.status.title': 'Status',
  'web.meta.status.description':
    'Aktuellt tillstånd för varje reläyta och varje kontakt, plus incidenthistorik.',
  'web.meta.changelog.title': 'Ändringslogg',
  'web.meta.changelog.description':
    'Vad som skickades, vad som ändrades för kontakter och vad som korrigerades.',
  'web.meta.docs.title': 'Dokumentation',
  'web.meta.docs.description':
    'REST API, MCP server, CLI och webhook dokumentation för att bygga på Relay.',
  'web.meta.methodology.title': 'Metodik',
  'web.meta.methodology.description':
    'Hur vi undersöker plattformsanspråk, hur vi daterar dem, hur vi jämför andra produkter och hur vi rättar till misstag.',
  'web.meta.compare.title': 'Jämförelser',
  'web.meta.compare.description':
    'Ärliga, daterade jämförelser med andra publiceringsverktyg, inklusive vem var och en är bäst för.',
  'web.meta.toolRadar.title': 'Kreativ verktygsradar',
  'web.meta.toolRadar.description':
    'En daterad, redaktionellt granskad katalog med specialiserade kreativa verktyg, med begränsningar, förbehåll för rättigheter och kommersiellt avslöjande.',
  'web.meta.opportunities.title': 'Marknadsföringsmöjligheter',
  'web.meta.opportunities.description':
    'En kurerad katalog över platser där en produkt kan listas, lanseras eller diskuteras, med varje destinations egna inlämningsregler.',
  'web.meta.legal.title': 'Legal and policies',
  'web.meta.legal.description':
    'Terms, privacy, acceptable use, AI use, cookies, subprocessors, refunds, copyright, security, accessibility, developer terms and affiliate terms.',

  /* ---------------------------------------------------------------------- */
  /* Home                                                                    */
  /* ---------------------------------------------------------------------- */

  'web.home.promise':
    'Förvandla en idé till plattformsinnehåll, godkänn den en gång, publicera den på ett tillförlitligt sätt och lär dig vad du kan förbättra härnäst.',
  'web.home.lede':
    'Relay är en publiceringsdisk för personer som är ansvariga för vad som går ut. Du skriver en gång, anpassar dig per plattform, ser de verkliga gränserna innan du planerar, får det godkännande du behöver, publicerar via officiella plattforms-API:er och behåller ett kvitto för varje inlägg.',
  'web.home.summaryLine':
    'One plan at $29 a month or $300 a year. 30 active social channels, unlimited team members, no feature tiers. The seven day trial collects a payment method and charges $0 at checkout.',

  'web.home.example.title': 'En idé, fem plattformsbaserade versioner',
  'web.home.example.body':
    'Kompositören börjar med en masterversion. Om du väljer ett konto öppnas en åsidosättande endast för det kontot, med sina egna live-gränser och en egen förhandsvisning. Inget du skriver för LinkedIn förändrar vad X tar emot.',
  'web.home.example.column.account': 'konto',
  'web.home.example.column.variant': 'Vad detta konto tar emot',
  'web.home.example.column.check': 'Kontrolleras innan schemaläggning',
  'web.home.example.caption':
    'En illustrativ komposition. De visade gränserna och inställningarna kommer från anslutningsdefinitionen för varje plattform, inte från en uppskattning.',
  'web.home.example.x.account': 'X, @northbound',
  'web.home.example.x.variant': 'Huvudtext, förkortad, plus en tråd med två inlägg',
  'web.home.example.x.check': 'Antal tecken, trådordning, beräknad API-kostnad för ett länkinlägg',
  'web.home.example.linkedin.account': 'LinkedIn, Northbound Tools',
  'web.home.example.linkedin.variant': 'Längre mastertext med bifogat dokument',
  'web.home.example.linkedin.check': 'Organisationsroll, inläggslängd, dokumenttyp',
  'web.home.example.instagram.account': 'Instagram, @northbound.tools',
  'web.home.example.instagram.variant':
    'Fyrkantig beskärning av samma bild, bildtexten omskriven för flödet',
  'web.home.example.instagram.check':
    'Professionell kontotyp, bildförhållande, alternativ text finns',
  'web.home.example.youtube.account': 'YouTube, norrgående',
  'web.home.example.youtube.variant': 'Samma klipp som en Short, med egen titel och beskrivning',
  'web.home.example.youtube.check':
    'Uppladdningsomfång, revisionstillstånd, sekretess som uppladdningen hamnar i',
  'web.home.example.bluesky.account': 'Bluesky, norrgående.exempel',
  'web.home.example.bluesky.variant': 'Mastertext med länkkortet',
  'web.home.example.bluesky.check': 'Antal tecken, länkkortsupplösning, alternativ text närvarande',

  'web.home.pillars.title': 'Vad Relay är byggt för att vara bra på',
  'web.home.pillars.confidence.title': 'Publicera med tillförsikt',
  'web.home.pillars.confidence.body':
    'En sann förhandsgranskning per konto, deterministisk policy och plattformskontroller innan någonting ställs i kö, godkännandet som din arbetsyta kräver, ett oföränderligt kvitto med det externa post-ID:t och ett hälsotillstånd för varje anslutning.',
  'web.home.pillars.confidence.proof':
    'Varje extern skrivning har en idempotensnyckel, så en arbetarkrasch efter att plattformen accepterat ett inlägg skapar inte en andra.',
  'web.home.pillars.adapt.title': 'Anpassa snarare än duplicera',
  'web.home.pillars.adapt.body':
    'Per plattformsvarianter som du kan åsidosätta ett konto i taget, och transcreation snarare än bokstavlig översättning, med en varumärkesordlista och en namngiven granskare per språk.',
  'web.home.pillars.adapt.proof':
    'Gränssnittet är tillgängligt på utvalda språk. Innehållsanpassning täcker 30 innehållsspråk och vart och ett av dem kan granskas innan det publiceras.',
  'web.home.pillars.loop.title': 'Stäng slingan',
  'web.home.pillars.loop.body':
    'Analyser som namnger måttet, plattformen som rapporterade det, nämnaren och när det senast uppdaterades. Där en plattform inte rapporterar något säger Relay det istället för att visa en nolla.',
  'web.home.pillars.loop.proof':
    'Ett inlägg jämförs mot din egen median snarare än mot en poäng som ingen kan granska.',
  'web.home.pillars.anywhere.title': 'Arbeta där du redan är',
  'web.home.pillars.anywhere.body':
    'Webbappen, ett REST API, en fjärransluten MCP-server, en CLI och signerade webhooks anropar samma applikationstjänster, samma auktoriseringsregler och samma validerare.',
  'web.home.pillars.anywhere.proof':
    'En agent kan inte kringgå en godkännandepolicy genom att använda en annan yta, eftersom policyn tillämpas i tjänsten, inte i gränssnittet.',
  'web.home.pillars.economics.title': 'Economics you can predict',
  'web.home.pillars.economics.body':
    'One price, every shipped feature, 30 active channels and unlimited team members. Platform usage that a provider charges per operation is passed through at cost and shown before you confirm the action.',
  'web.home.pillars.economics.proof':
    'There is no image or video generation credit system, because Relay does not generate media.',

  'web.home.honest.title': 'Vad Relay inte gör',
  'web.home.honest.lede':
    'Det här är gränser, inte en färdplan retas. Om en av dem ändras, ändras den i ändringsloggen först.',
  'web.home.honest.noMedia':
    'No AI image generation and no AI video generation. Relay adapts, approves, publishes and measures the media you bring.',
  'web.home.honest.noAutomationOfEngagement':
    'Inga automatiska likes, follows, reposts, oönskade svar eller direktmeddelanden. Inga förlovningsskidor och inget påhittat engagemang.',
  'web.home.honest.noUnofficial':
    'Ingen webbläsarautomatisering, ingen återuppspelning av cookies, ingen skrapning och inga inofficiella slutpunkter för inlägg. Endast officiella plattforms-API:er.',
  'web.home.honest.noPromises':
    'Inget löfte om räckvidd, ranking eller engagemang. Relay kan berätta vad som hände och vad du ska testa härnäst. Det kan inte berätta vad en publik kommer att göra.',
  'web.home.honest.noUnattendedPublishing':
    'Ingen obevakad publicering som standard. En agent kan utarbeta, validera och begära godkännande. En människa bestämmer innan någonting blir offentligt, såvida du inte medvetet väljer bort en specifik policy.',

  'web.home.surfaces.title': 'Fem ytor, en backend',
  'web.home.surfaces.body':
    'Samma användningsfall, samma hyreskontroller, samma validerare och samma publiceringsarbetsflöden. En yta är en väg in, aldrig en genväg förbi en regel.',
  'web.home.surfaces.web': 'Webbapp',
  'web.home.surfaces.webBody':
    'Kompositör, kalender, godkännanden, analyser, anslutningar och inställningar.',
  'web.home.surfaces.api': 'REST API',
  'web.home.surfaces.apiBody':
    'Omfattade nycklar, idempotensnycklar vid varje skrivning, markörpaginering, skrivfel.',
  'web.home.surfaces.mcp': 'Fjärr MCP-server',
  'web.home.surfaces.mcpBody':
    'Strömbar HTTP, OAuth, per verktygsomfång och en förhandsvisning före varje följdsamtal.',
  'web.home.surfaces.cli': 'CLI',
  'web.home.surfaces.cliBody':
    'Stabil maskinläsbar utdata för skript och kontinuerlig integration.',
  'web.home.surfaces.webhooks': 'Signerade webhooks',
  'web.home.surfaces.webhooksBody':
    'Publicera resultat, godkännandebeslut och anslutningshälsa, med återleverans.',

  'web.home.closing.title': 'Börja med ett konto och ett inlägg',
  'web.home.closing.body':
    'Anslut ett konto, skapa ett inlägg, se valideringskörningen, schemalägg den och läs kvittot. Det är hela produkten på cirka tio minuter.',

  /*
   * Home v2 (WP-1, loud system). Additive only: every key above this block
   * still renders somewhere on the page. B5 English-fallback exemption for
   * this whole prefix is recorded in `beta-fallbacks.ts`, matching the
   * existing precedent for `web.home.summaryLine` and
   * `web.home.pillars.economics.*` above.
   */
  'web.home.v2.heroTemplate': 'Inhemska, varumärkesbaserade inlägg för {platform}.',
  'web.home.v2.sticker.trial': '7 dagars provperiod',
  'web.home.v2.sticker.official': 'Endast officiella API:er',
  'web.home.v2.marqueeCaption': 'Endast officiella API:er.',
  'web.home.v2.surfacesStat': 'Ytor på en delad backend',
  'web.home.v2.pricingTeaser.title': 'Vad det kostar',
  'web.home.v2.variantScene.masterLabel': 'Masterutkast',
  'web.home.v2.variantScene.progress': '{revealed} av {total}',

  /* ---------------------------------------------------------------------- */
  /* Product                                                                 */
  /* ---------------------------------------------------------------------- */

  'web.product.title': 'Förlagsdisken',
  'web.product.lede':
    'Sju frågor måste kunna besvaras vid varje steg utan att klicka på någonting: vad som publiceras, var, vilken version varje konto får, när och i vilken tidszon, vem som godkände det, vad det kan kosta och vad som hände.',

  'web.product.step.source.title': 'Källa',
  'web.product.step.source.body':
    'Utgå från en brief, en fil du redan har, ett RSS-objekt eller en förfrågan från en agent. Importerad media behåller ursprunget du gav det, inklusive var det kom ifrån och vem som innehar rättigheterna.',
  'web.product.step.compose.title': 'Skriv en gång och åsidosätt sedan',
  'web.product.step.compose.body':
    'En masterversion driver varje mål. Om du väljer ett konto öppnas en åsidosättande endast för det kontot: dess egen text, dess egen mediabeskärning, dess egna inställningar, en egen live-gränsräknare och en egen förhandsvisning. Att återställa en åsidosättning återställer mastern i en åtgärd och visar dig skillnaden först.',
  'web.product.step.validate.title': 'Validera innan något står i kö',
  'web.product.step.validate.body':
    'Validering är deterministisk och körs på servern. Den kontrollerar plattformsgränserna från den versionerade kapacitetsögonblicksbilden, kontotypen, alt-text, mediarättigheter, dubbletter och kadensregler, omnämnande och destinationsupplösning, och den beräknade plattformsanvändningskostnaden. Varje problem namnger målet det tillhör och hur man åtgärdar det.',
  'web.product.step.approve.title': 'Godkänn en gång',
  'web.product.step.approve.body':
    'Godkännande är en arbetsplatspolicy, inte en vana. En granskare ser varje mål, varje variant, tidszon, sekretessstatus och den beräknade kostnaden på en skärm, och det fungerar på en telefon. Innehåll som ändras efter godkännande kräver godkännande igen.',
  'web.product.step.schedule.title': 'Schemalägg i en realtidszon',
  'web.product.step.schedule.body':
    'Varje schemalagt inlägg lagrar ett ögonblick och en IANA-tidszon, aldrig en naiv lokal tid. Sommartidsövergångar visas innan du bekräftar, upptäcks inte efteråt.',
  'web.product.step.publish.title': 'Publicera och spara kvittot',
  'web.product.step.publish.body':
    'Varje mål skickas med en idempotensnyckel. Ett mål som misslyckas rullar inte tillbaka ett mål som lyckades, och det tillståndet har sitt eget namn: delvis publicerat. Varje resultat ger ett oföränderligt kvitto med det externa inläggs-ID, förfrågningsidentifieraren, försökshistoriken och det exakta felet om det fanns något.',
  'web.product.step.learn.title': 'Lär dig',
  'web.product.step.learn.body':
    'Mätvärden normaliseras, namnges, tillskrivs plattformen som rapporterade dem och stämplas med en färskhetstid. Ett mått som en plattform inte rapporterar markeras som otillgängligt med anledningen. Det återges aldrig som en nolla.',

  'web.product.shot.caption':
    'Skärmdumparna på den här sidan är tagna från den pågående produkten. Tills en yta är tillräckligt komplett för att fotografera ärligt beskriver vi den med ord istället för att rita en bild av den.',
  'web.product.shot.pending': 'Skärmdump väntar på inspelning',
  'web.product.shot.pendingReason':
    'Denna yta byggs fortfarande. Vi kommer att publicera en verklig bild snarare än en illustration.',

  'web.product.states.title': 'De stater som ingen gillar att designa',
  'web.product.states.body':
    'Ett publiceringsverktyg bedöms på den dåliga dagen, inte den bra. Var och en av dessa har en designad skärm, en enkel mening och en nästa åtgärd.',
  'web.product.states.partial':
    'Delvis publicerad: vilka mål är live, vilka misslyckades och varför.',
  'web.product.states.revoked':
    'En återkallad token hittades vid leveranstid, med återanslutningssökvägen.',
  'web.product.states.rateLimited':
    'En plattformshastighetsgräns, med när den återställs och vad som står i kö bakom den.',
  'web.product.states.duplicate':
    'En dubblett eller kadensblock, med regeln som avfyrades och överklagandevägen.',
  'web.product.states.offline': 'Offline när du skriver: ingenting du skrivit har förlorats.',
  'web.product.states.permission':
    'En handling som din roll inte tillåter, namnge rollen som gör det.',

  /* ---------------------------------------------------------------------- */
  /* Integrations and capability matrix                                      */
  /* ---------------------------------------------------------------------- */

  'web.integrations.title': 'Plattformar',
  'web.integrations.lede':
    'Relä ansluter via officiella plattforms-API:er. Varje anslutare har en namngiven ägare, en registrerad policy-URL och ett granskningsdatum. En anslutning listas inte som stödd förrän den klarar anslutningsdefinitionen av klar.',
  'web.integrations.reviewNotice.title':
    'Ingen kontakt beskrivs som officiell innan plattformen godkänner den',
  'web.integrations.reviewNotice.body':
    'Flera plattformar kräver en appgranskning innan en applikation kan publiceras på uppdrag av en kund. Där den recensionen är enastående säger kontakten det och beskriver exakt vad som är begränsat tills det går igenom.',
  'web.integrations.accountTypes': 'Kontotyper som den här anslutaren kan publicera till',
  'web.integrations.restriction': 'Begränsning du bör känna till innan du ansluter',
  'web.integrations.cost': 'Kostnad för plattformsanvändning',
  'web.integrations.viewMatrix': 'Se alla funktioner för den här plattformen',

  'web.capabilities.title': 'Anslutningskapacitetsmatris',
  'web.capabilities.lede':
    'Genereras från samma anslutningsdefinitioner som produkten läser, sedan granskad av en person innan publicering. Marknadsföring kan inte lova något en adapter inte kan göra.',
  'web.capabilities.legend.title': 'Hur man läser den här tabellen',
  'web.capabilities.legend.body':
    'Fyra tillstånd, och skillnaden mellan de två mitten är viktiga. Inte byggt ännu är vår eftersläpning. Inte erbjuds av plattformen är ett faktum om plattformen som inget verktyg kan kringgå.',
  'web.capabilities.tableCaption':
    'Förmåga per plattform. Varje cell namnger sitt tillstånd i ord och efter färg.',
  'web.capabilities.snapshot': 'Anslutningsdefinitioner version {version}, granskad {date}',
  'web.capabilities.sourceNote':
    'Varje plattformsanspråk i den här tabellen länkar till den officiella dokumentationen den kom ifrån och det datum vi senast läste den.',

  /* ---------------------------------------------------------------------- */
  /* Audience pages                                                          */
  /* ---------------------------------------------------------------------- */

  'web.creators.title': 'För kreatörer',
  'web.creators.lede':
    'Du publicerar samma idé i flera format, ibland på mer än ett språk, och du är hela teamet. Arbetet som Relay tar bort är omskrivning, ombeskärning och kontroll.',
  'web.creators.job.adapt.title': 'Skriv det en gång, skicka fem inbyggda versioner',
  'web.creators.job.adapt.body':
    'Masterversionen bär idén. Varje konto får längden, skörden, inställningarna och tonen som plattformen förväntar sig, och du kan se dem alla sida vid sida innan du förbinder dig.',
  'web.creators.job.languages.title': 'Publicera på ett annat språk utan att gissa',
  'web.creators.job.languages.body':
    'Transcreation behåller avsikten snarare än orden, använder din varumärkesordlista och markerar om en inbyggd recensent har läst den. Ingenting publiceras på ett språk du inte kan gå i god för om du inte säger det.',
  'web.creators.job.rights.title': 'Spara dina rättigheter tillsammans med filen',
  'web.creators.job.rights.body':
    'Media bär varifrån det kommer, vem som har rättigheterna och om det skapades med ett generativt verktyg. Plattformar frågar alltmer. Relay lagrar ditt svar med tillgången istället för att fråga dig igen.',
  'web.creators.job.cost.title': 'Ta reda på kostnaden innan du postar',
  'web.creators.job.cost.body':
    'X debiterar per operation och tar mer betalt för ett inlägg som innehåller en URL. Relay uppskattar det innan du bekräftar, så en länktung vecka är ett beslut snarare än en fakturaöverraskning.',
  'web.creators.notFor.title': 'Vad detta inte är',
  'web.creators.notFor.body':
    'Relay genererar inte bilder eller video, kör inte engagemangsautomatisering och förutsäger inte hur ett inlägg kommer att prestera. Om det är de verktyg du vill ha, gör andra produkter dem och vi vill hellre att du vet det nu.',

  'web.agencies.title': 'För byråer',
  'web.agencies.lede':
    'Du publicerar på uppdrag av andra, vilket gör tillskrivning, godkännande och bevis till en del av jobbet snarare än en trevlighet.',
  'web.agencies.job.separation.title': 'Klientseparation som håller i sig',
  'web.agencies.job.separation.body':
    'Varje arbetsyta är isolerad på databasnivå såväl som i applikationen. En fråga som korsar en arbetsytas gräns misslyckas i Postgres, inte bara i en kodsökväg som någon kan glömma.',
  'web.agencies.job.approval.title': 'Godkännanden som en klient faktiskt kan använda',
  'web.agencies.job.approval.body':
    'En granskare ser varje mål, varje variant, schemat med dess tidszon och den beräknade kostnaden på en enda skärm, och skärmen fungerar på en telefon. Godkännandebeslut registreras med vem, när och vad de såg.',
  'web.agencies.job.receipts.title': 'Bevis för det obekväma samtalet',
  'web.agencies.job.receipts.body':
    'Varje publikation producerar ett oföränderligt kvitto med det externa inläggets ID och hela försökshistoriken. När en klient frågar om något gick ut vid nio, har svaret en tidsstämpel och en plattformsidentifierare bifogade.',
  'web.agencies.job.roles.title': 'Roller som matchar hur arbetet är uppdelat',
  'web.agencies.job.roles.body':
    'Ägare, administratör, chef, redaktör, godkännare, analytiker och tittare, omfattning per varumärke och per konto. Obegränsat antal teammedlemmar, eftersom laddning per plats gör att byråer delar inloggningar och det är ett säkerhetsproblem.',
  'web.agencies.limits.title': 'Gränsen, klart och tydligt',
  'web.agencies.limits.body':
    'En plan omfattar 30 aktiva sociala kanaler. En kanal är ett socialt konto, sida, profil, grupp eller publikationsanslutning. Om du behöver fler än 30, berätta vad du behöver så ger vi dig ett rakt svar snarare än en dold nivå.',

  'web.developers.title': 'För utvecklare',
  'web.developers.lede':
    'Publicering är den del av ett arbetsflöde där ett misstag är offentligt och permanent. Relay ger dig en backend, skrivfel, idempotens vid varje skrivning och en godkännandemodell som en agent inte kan prata om.',
  'web.developers.surface.api.title': 'REST API',
  'web.developers.surface.api.body':
    'Omfattade API-nycklar, en idempotensnyckel som krävs vid varje skrivning, markörpaginering och ett maskinskrivet felkuvert med en stabil kod, en meddelandenyckel och sanerade detaljer. Ingen leverantörs nyttolast reflekteras någonsin tillbaka till dig rå.',
  'web.developers.surface.mcp.title': 'Fjärr MCP-server',
  'web.developers.surface.mcp.body':
    'Strömbar HTTP med OAuth. Verktygen är granulära och var och en förklarar sina biverkningar. Att läsa, rita, begära godkännande, schemalägga och publicera är separata omfattningar, så en modell som kan rita kan inte publicera.',
  'web.developers.surface.cli.title': 'CLI',
  'web.developers.surface.cli.body':
    'Varje kommando stöder maskinläsbar utdata med en stabil form, så ett skript kan analysera det och ett kontinuerligt integrationsjobb kan misslyckas på det.',
  'web.developers.surface.webhooks.title': 'Signerade webhooks',
  'web.developers.surface.webhooks.body':
    'Publicera resultat, godkännandebeslut, anslutningshälsa och valideringsresultat, signerade, replay-resistenta och återlevereras från instrumentpanelen.',
  'web.developers.safety.title': 'Agentsäkerhetsmodellen',
  'web.developers.safety.body':
    'En agentreferens är ett tjänstkonto med omfattning, inte en kopia av en personsession. Den har begränsningar per varumärke, per konto, per plats, per domän, per kadens och per look ahead, och servern godkänner varje samtal istället för att lita på agentvärden.',
  'web.developers.safety.injection':
    'Webbsidor, flöden, kommentarer och plattformssvar behandlas som otillförlitlig data. Modellutdata omvalideras deterministiskt, eftersom en modell som säger att ett inlägg är bra inte är ett säkerhetsbeslut.',
  'web.developers.safety.killSwitch':
    'Varje agent och varje arbetsyta har en kill-switch som slutar väntande arbete utan att ta bort den.',
  'web.developers.openSource.title': 'Öppna bitar',
  'web.developers.openSource.body':
    'Anslutningskontraktet, CLI, schemaexempel, MCP-verktygsdefinitioner och leverantörssimulatorn är de delar du behöver bygga mot Relay utan ett sandlådekonto. Där ett arkiv inte har publicerats ännu, säger den här sidan det snarare än att länka till ingenting.',

  /* ---------------------------------------------------------------------- */
  /* Pricing                                                                 */
  /* ---------------------------------------------------------------------- */

  'web.pricing.title': 'One plan',
  'web.pricing.lede':
    'There are no feature tiers, so there is no comparison table to read. Both billing intervals unlock every shipped feature.',
  'web.pricing.intervalHeading': 'Choose how you pay',
  'web.pricing.monthlyLabel': 'Billed monthly',
  'web.pricing.annualLabel': 'Billed annually',
  'web.pricing.annualDetail': '$300 charged once a year.',
  'web.pricing.monthlyDetail': '$29 charged every month.',
  'web.pricing.perMonthNote':
    'Prices are in US dollars. Polar adds any sales tax or VAT that applies where you are.',

  'web.pricing.beside.title': 'What you are agreeing to',
  'web.pricing.beside.channels':
    '30 active social channels. A channel is one social account, Page, profile, group or publication connection.',
  'web.pricing.beside.members':
    'Unlimited team members, workspaces and project groups. There is no per seat charge.',
  'web.pricing.beside.fairUse':
    'Unlimited drafts, scheduled posts and stored receipts under a published fair use and anti spam policy. Those controls exist to protect your connected accounts and they apply identically to every subscriber.',
  'web.pricing.beside.metered':
    'X charges per API operation and charges more for a post that contains a URL. Relay passes that through at cost, estimates it before you confirm the action, and shows it in your usage. Other platform fees are passed through only when they are disclosed before the action.',
  'web.pricing.beside.noMedia':
    'AI image generation and AI video generation are not included and are not sold. There are no media credits, because Relay does not generate media.',
  'web.pricing.beside.trial':
    'The trial runs for seven days with every feature. Polar collects a payment method at checkout and charges $0 today. The exact first charge amount and date are shown next to the start action before you confirm.',
  'web.pricing.beside.conversion':
    'If you do nothing, the trial converts on day seven to the interval you chose and Polar charges the amount shown at checkout. Polar emails a reminder three days before that happens.',
  'web.pricing.beside.cancel':
    'Cancel from Settings at any time without contacting support. Cancel before the trial converts and no charge is attempted. Cancel after that and you keep access until the paid period ends.',
  'web.pricing.beside.data':
    'Nothing is deleted when a subscription ends. You can export your content, receipts and analytics, and you can delete them yourself.',

  'web.pricing.included.title': 'Included, in both intervals',
  'web.pricing.compare.title': 'Why there is no comparison table here',
  'web.pricing.compare.body':
    'A comparison table exists to show what a cheaper plan takes away. There is one plan, so the table would have one column. If we ever add a tier, we will say what moved and why on the changelog before the price page changes.',

  'web.pricing.testimonials.title': 'There are no customer quotes on this page yet',
  'web.pricing.testimonials.body':
    'A quote goes up only when the customer wrote it, gave written permission for it, and we can point to the work it describes. Until then an empty space is more honest than a wall of invented praise.',

  'web.pricing.faq.title': 'Questions people ask before paying',
  'web.pricing.faq.channels.q': 'What happens if I go over 30 channels',
  'web.pricing.faq.channels.a':
    'Nothing is disconnected and nothing is deleted. Channels over the limit become read only, you choose which ones stay active, and we tell you before it happens.',
  'web.pricing.faq.refund.q': 'Do you refund',
  'web.pricing.faq.refund.a':
    'Yes, under the published refund and cancellation policy, and always where consumer law requires it. Billing is handled by Polar as merchant of record and refunds are issued through Polar.',
  'web.pricing.faq.selfHost.q': 'Can I run it myself',
  'web.pricing.faq.selfHost.a':
    'Not today. Whether there will be a self hosted edition, and under which licence, is an open decision. We will publish the answer rather than imply one.',
  'web.pricing.faq.xCost.q': 'How much will X actually cost me',
  'web.pricing.faq.xCost.a':
    'It depends on how many posts you publish and how many of them contain a URL, because X prices those differently. Relay estimates each action before you confirm it and totals it in your usage view. We do not mark it up.',
  'web.pricing.faq.trialAbuse.q': 'Can I start a second trial',
  'web.pricing.faq.trialAbuse.a':
    'Repeat trials are limited by Polar. If you have a legitimate reason, contact support and a person will look at it.',

  /* ---------------------------------------------------------------------- */
  /* Resources index                                                         */
  /* ---------------------------------------------------------------------- */

  'web.resources.title': 'Resurser',
  'web.resources.lede':
    'Operationell sanning om produkten och forskningen bakom allt vi hävdar om en plattform.',
  'web.resources.status.body':
    'Aktuellt tillstånd för varje yta och varje anslutning, med incidenthistorik.',
  'web.resources.changelog.body':
    'Vad som skickades, vad som ändrades för en kontakt och vad vi korrigerade.',
  'web.resources.docs.body': 'REST API, MCP, CLI och webhook dokumentation.',
  'web.resources.methodology.body':
    'Hur vi undersöker, daterar, källa och korrigerar varje plattformsanspråk.',
  'web.resources.compare.body':
    'Daterade jämförelser med andra verktyg, inklusive vem var och en passar.',
  'web.resources.capabilities.body':
    'Per plattform, per kapacitet, genererad från anslutningsdefinitionerna.',
  'web.resources.toolRadar.body':
    'Specialiserade kreativa verktyg, daterade, med begränsningar och avslöjande.',
  'web.resources.opportunities.body':
    'Utvalda platser att lansera, lista eller bidra med, med varje destinationsregler.',
  'web.resources.legal.body':
    'Terms, privacy, acceptable use, AI use, security and the rest of the policy set.',
  'web.resources.guides.title': 'Guider och arbetsflöden',
  'web.resources.guides.empty': 'Ingen guide har publicerats ännu',
  'web.resources.guides.emptyBody':
    'Den redaktionella standarden kräver original produktdata, ett reproducerbart arbetsflöde, primära plattformskällor med ett verifieringsdatum och en namngiven mänsklig redaktör. De första guiderna publicerar när de träffar den.',

  /* ---------------------------------------------------------------------- */
  /* Status                                                                  */
  /* ---------------------------------------------------------------------- */

  'web.status.title': 'Status',
  'web.status.lede':
    'Tillståndet för varje reläyta och varje kontakt. Anslutningsstatus täcker vår adapter och plattformens API som den beror på.',
  'web.status.updated': 'Markerad {time}',
  'web.status.surfaces.title': 'Ytor',
  'web.status.connectors.title': 'Kontakter',
  'web.status.level.operational': 'Fungerar normalt',
  'web.status.level.degraded': 'Försämrad',
  'web.status.level.partial': 'Partiellt avbrott',
  'web.status.level.outage': 'Avbrott',
  'web.status.level.maintenance': 'Planerat underhåll',
  'web.status.level.notLive': 'Inte live än',
  'web.status.notLiveBody':
    'Den här kontakten är byggd men bär inte kundtrafik ännu, så det finns inget att rapportera om.',
  'web.status.incidents.title': 'Incidentens historia',
  'web.status.incidents.empty': 'Ingen incident har registrerats',
  'web.status.incidents.emptyBody':
    'Den här sidan börjar tom med avsikt. Vi publicerar varje incident som påverkade publicering, inklusive de som orsakats av våra egna misstag, med tidslinjen och vad som ändrades efteråt.',
  'web.status.incident.started': 'Startade {time}',
  'web.status.incident.resolved': 'Löst {time}',
  'web.status.incident.impact': 'Inverkan',
  'web.status.incident.cause': 'Orsak',
  'web.status.incident.followUp': 'Vad förändrades efteråt',
  'web.status.subscribe.title': 'Få höra när något går sönder',
  'web.status.subscribe.body':
    'Anslutningshälsa, publiceringsfel och plattformsincidenter levereras som signerade webhooks till din egen slutpunkt. Det finns ingen separat statuspostlista ännu.',

  /* ---------------------------------------------------------------------- */
  /* Changelog                                                               */
  /* ---------------------------------------------------------------------- */

  'web.changelog.title': 'Ändringslogg',
  'web.changelog.lede':
    'Produktändringar, kopplingsbyten och korrigeringar. En funktionsändring som påverkar vad du kan publicera visas här innan den visas någon annanstans på den här webbplatsen.',
  'web.changelog.kind.shipped': 'Skickas',
  'web.changelog.kind.changed': 'Ändrad',
  'web.changelog.kind.fixed': 'Fixat',
  'web.changelog.kind.connector': 'Anslutning',
  'web.changelog.kind.correction': 'Rättelse',
  'web.changelog.kind.security': 'Säkerhet',
  'web.changelog.empty': 'Inget har skickats offentligt än',
  'web.changelog.emptyBody':
    'Reläet är byggt. Det första inlägget här är det första en kund kan använda, inte en milstolpe om oss själva.',

  /* ---------------------------------------------------------------------- */
  /* Docs shell                                                              */
  /* ---------------------------------------------------------------------- */

  'web.docs.title': 'Dokumentation',
  'web.docs.lede':
    'En backend, fyra vägar in. Varje avsnitt dokumenterar samma användningsfall, så ett koncept du lär dig i REST API är samma koncept i MCP och i CLI.',
  'web.docs.section.start.title': 'Komma igång',
  'web.docs.section.start.body':
    'Autentisering, arbetsytor, varumärken och ditt första publicerade inlägg.',
  'web.docs.section.api.title': 'REST API',
  'web.docs.section.api.body': 'Resurser, paginering, idempotens, felkoder och hastighetsgränser.',
  'web.docs.section.mcp.title': 'MCP-server',
  'web.docs.section.mcp.body':
    'Transport, OAuth, verktygskatalog, scopes och godkännandehandslaget.',
  'web.docs.section.cli.title': 'CLI',
  'web.docs.section.cli.body': 'Installera, autentisera och det maskinläsbara utdatakontraktet.',
  'web.docs.section.webhooks.title': 'Webhooks',
  'web.docs.section.webhooks.body':
    'Händelsekatalog, signaturverifiering, omförsök och återleverans.',
  'web.docs.section.connectors.title': 'Kontakter',
  'web.docs.section.connectors.body':
    'Krav per plattform, kontotyper, gränser och kända begränsningar.',
  'web.docs.section.errors.title': 'Felreferens',
  'web.docs.section.errors.body': 'Varje felkod, vad som orsakar det och vad man ska göra åt det.',
  'web.docs.pending': 'Inte publicerat ännu',
  'web.docs.pendingBody':
    'Det här avsnittet är skrivet mot det levererade API:et och publiceras med det. Vi vill hellre visa dig ingenting än dokumentation för en slutpunkt som kan ändras.',
  'web.docs.principles.title': 'Vad du kan lita på',
  'web.docs.principles.idempotency':
    'Varje skrivning kräver en idempotensnyckel. Att spela om en begäran med samma nyckel returnerar det ursprungliga resultatet istället för att skapa ett andra inlägg.',
  'web.docs.principles.errors':
    'Varje fel har en stabil kod, en meddelandenyckel och sanerade detaljer. Koder ändrar inte betydelse mellan versioner.',
  'web.docs.principles.versioning':
    'Brytande ändringar får en ny version och ett meddelat utfasningsfönster. Additiva ändringar gör det inte.',
  'web.docs.principles.scopes':
    'Läsning, utarbetande, begära godkännande, schemaläggning och publicering är separata omfattningar. En legitimation får den minsta uppsättningen som gör sitt jobb.',

  /* ---------------------------------------------------------------------- */
  /* Methodology                                                             */
  /* ---------------------------------------------------------------------- */

  'web.methodology.title': 'Metodik',
  'web.methodology.lede':
    'Hur någonting på den här sidan kommer att kallas sant, och vad händer när det visar sig inte vara det.',
  'web.methodology.claims.title': 'Plattformsanspråk',
  'web.methodology.claims.body':
    'Varje påstående om vad en plattform tillåter kommer från den plattformens egen dokumentation eller policysida. Vi registrerar webbadressen, datumet den lästes, API-versionen där en gäller och personen som äger kontrollerar den igen. Ett påstående utan dessa fyra saker går inte in på sajten.',
  'web.methodology.recheck.title': 'När vi kollar igen',
  'web.methodology.recheck.beforeConnector':
    'Innan en koppling startar, och igen innan den bär kundtrafik.',
  'web.methodology.recheck.monthly':
    'Varje månad för plattformsändringsloggar och leverantörspriser.',
  'web.methodology.recheck.quarterly':
    'Varje kvartal för konkurrentplaner, gemenskapsregler och juridiska dokument.',
  'web.methodology.recheck.immediate':
    'Omedelbart efter avslag på plattformar, verkställighetsmeddelande, utfasning eller en oförklarlig förändring i publicerings- eller analysbeteende.',
  'web.methodology.comparison.title': 'Jämförelser',
  'web.methodology.comparison.bestFor':
    'Varje jämförelse anger vem varje produkt är bäst för, även när det inte är oss.',
  'web.methodology.comparison.dated':
    'Varje jämförelse innehåller forskningsdatumet och länkar de primära prissättnings- och kapacitetskällorna.',
  'web.methodology.comparison.distinction':
    'En saknad förmåga märks antingen som något vi inte har byggt eller som något plattformen inte tillåter. Det här är olika meningar och vi slår aldrig ihop dem.',
  'web.methodology.comparison.noLogos':
    'Vi använder inte ett annat företags kundlogotyper, offerter eller skärmdumpar av gränssnitt, och vi gör inte anspråk på ett stöd som vi inte har.',
  'web.methodology.benchmarks.title': 'Benchmarks och produktdata',
  'web.methodology.benchmarks.body':
    'Alla siffror som dras från kundaktivitet anger dess urval, dess uteslutningar, dess metriska definition och dess sekretessgräns, och är aggregerade så att ingen arbetsyta kan identifieras. Om ett urval är för litet för att publicera säkert säger vi det istället för att publicera det ändå.',
  'web.methodology.ai.title': 'AI i vårt eget innehåll',
  'web.methodology.ai.body':
    'En modell kan undersöka, skissera, översätta, kontrollera och formatera. En namngiven person äger varje anspråk, redigerar stycket och håller det aktuellt. Vi publicerar inte genererade artiklar som inte har granskats och vi genererar inte skärmdumparna.',
  'web.methodology.corrections.title': 'Rättelser',
  'web.methodology.corrections.body':
    'När en sida är fel korrigerar vi den på plats, lägger till en daterad korrigeringsnotis och listar korrigeringen i ändringsloggen. När en sida är för inaktuell för att åtgärdas tar vi bort den istället för att lämna den.',

  /* ---------------------------------------------------------------------- */
  /* Compare                                                                 */
  /* ---------------------------------------------------------------------- */

  'web.compare.title': 'Jämförelser',
  'web.compare.lede':
    'Dessa sidor är användbara även om du väljer den andra produkten. Det är den standard de måste uppfylla innan de publicerar.',
  'web.compare.rules.title': 'Reglerna som dessa sidor följer',
  'web.compare.rules.bestFor':
    'Varje sida anger vem den andra produkten är bäst för, i sin egen sektion, först.',
  'web.compare.rules.dated':
    'Varje påstående är daterat och länkar till den primära källan det kom ifrån.',
  'web.compare.rules.distinction':
    'Vi skiljer det vi inte har byggt från det en plattform inte tillåter.',
  'web.compare.rules.axes':
    'Varje sida jämför samma saker: kontotillägg, inläggsgränser, team och godkännande, API-, MCP- och CLI-åtkomst, innehållsspråk, analyser, videohantering, inbäddad användning, självhotell, support och plattformens API-kostnad du betalar ovanpå.',
  'web.compare.rules.correction': 'Varje sida har en korrigeringskontakt och ett granskningsdatum.',
  'web.compare.planned.title': 'Planerade sidor',
  'web.compare.planned.body':
    'Dessa publiceras när den aktuella pris- och funktionskontrollen är klar. En jämförelse skriven från minnet är värre än ingen jämförelse.',
  'web.compare.empty': 'Ingen jämförelse har publicerats ännu',
  'web.compare.emptyBody':
    'Varje sida behöver en ny faktakontroll mot den andra produktens egen prissättning och dokumentation. De publicerar en i taget när det arbetet avslutas.',

  /* ---------------------------------------------------------------------- */
  /* Tool radar                                                              */
  /* ---------------------------------------------------------------------- */

  'web.toolRadar.title': 'Kreativ verktygsradar',
  'web.toolRadar.lede':
    'Relä genererar inte bilder eller video. Det hjälper dig att bestämma vilket specialistverktyg du ska använda och föra in den färdiga tillgången med dess rättighetsregister intakt.',
  'web.toolRadar.record.title': 'Vad varje skiva har att bära',
  'web.toolRadar.record.url': 'Den officiella webbadressen och organisationen som äger produkten.',
  'web.toolRadar.record.useCase':
    'Arbetsflödet det rekommenderas för och dess dokumenterade begränsningar.',
  'web.toolRadar.record.pricing': 'Dess prismodell och datumet då vi kontrollerade den.',
  'web.toolRadar.record.rights':
    'Dess rättigheter, licensiering, bevarande och integritetsförbehåll, med säljarens egna ord.',
  'web.toolRadar.record.disclosure':
    'Om vi har någon kommersiell relation med den. Rankning beror aldrig på det.',
  'web.toolRadar.record.verified':
    'Ett senast verifierat datum och en synlig varning när en post har passerat granskningsfönstret.',
  'web.toolRadar.category.title': 'Kategorier',
  'web.toolRadar.empty': 'Katalogen är inte ifylld ännu',
  'web.toolRadar.emptyBody':
    'Register skrivs av en person från säljarens egen dokumentation. Vi kommer inte att fylla den här sidan med modellgenererade länkar som ser rimliga ut.',
  'web.toolRadar.noAffiliateYet':
    'Det finns ingen affiliate relation med något verktyg listat här idag.',

  /* ---------------------------------------------------------------------- */
  /* Opportunities                                                           */
  /* ---------------------------------------------------------------------- */

  'web.opportunities.title': 'Marknadsföringsmöjligheter',
  'web.opportunities.lede':
    'En kurerad katalog över platser där en produkt kan lanseras, listas, diskuteras eller bidra med de regler som varje destination sätter för sig själv.',
  'web.opportunities.rules.title': 'Hur den här katalogen beter sig',
  'web.opportunities.rules.curated':
    'Varje inlägg är en granskad post med en officiell URL, de aktuella inlämningsreglerna och ett verifieringsdatum. Ingenting upptäcks av en modell och presenteras som verifierat.',
  'web.opportunities.rules.noAutomation':
    'Relay skickar aldrig in ett formulär, skrapar en kontakt, skickar massmail eller inlägg till en community åt dig. Du gör inlämningen.',
  'web.opportunities.rules.noGuarantee':
    'En notering är inte ett rankningslöfte och en länk är inte en tillväxtstrategi. Vi visar passform, publik, ansträngning, kostnad och upplysningskrav så att du kan avgöra om det är värt din eftermiddag.',
  'web.opportunities.rules.stale':
    'En post efter granskningsdatumet märks eller döljs istället för att visas som aktuell.',
  'web.opportunities.category.title': 'Kategorier',
  'web.opportunities.empty': 'Katalogen är inte ifylld ännu',
  'web.opportunities.emptyBody':
    'Varje destinationsregler måste läsas och registreras av en person innan den kan rekommenderas. Kategorier listas ovan så att du kan se formen på vad som kommer.',

  /* ---------------------------------------------------------------------- */
  /* Legal, shared                                                           */
  /* ---------------------------------------------------------------------- */

  'web.legal.title': 'Legal and policies',
  'web.legal.lede':
    'The documents that govern using Relay. Where the wording has to be drafted by a lawyer for a specific company and jurisdiction, the page says so instead of pretending.',
  'web.legal.counselPending.title': 'Pending review by counsel before launch',
  'web.legal.counselPending.body':
    'The substance on this page reflects how the product actually behaves and is accurate today. The binding legal wording, the governing jurisdiction and the liability terms are being drafted with qualified counsel and will replace this text before Relay is generally available. This page is not legal advice and it is not a contract yet.',
  'web.legal.contact.title': 'Contact',
  'web.legal.contact.privacy': 'privacy@relay.example',
  'web.legal.contact.legal': 'legal@relay.example',
  'web.legal.contact.security': 'security@relay.example',
  'web.legal.contact.abuse': 'abuse@relay.example',
  'web.legal.contact.copyright': 'copyright@relay.example',
  'web.legal.contact.affiliates': 'affiliates@relay.example',
  'web.legal.contact.accessibility': 'accessibility@relay.example',
  'web.legal.entity.pending':
    'The contracting entity, its registered address and the governing jurisdiction are an open decision and will be named here before launch.',
  'web.legal.index.updated': 'Updated {date}',

  /* Terms ---------------------------------------------------------------- */
  'web.legal.terms.title': 'Terms of Service',
  'web.legal.terms.summary':
    'What Relay agrees to provide, what you agree to do, and what happens when either side stops.',
  'web.legal.terms.service.title': 'What the service is',
  'web.legal.terms.service.body':
    'Relay is a hosted service for creating, approving, scheduling and publishing content to social platforms through those platforms official APIs, together with the receipts, analytics and audit records that result. It is not a social platform and it does not control what any platform does with a post once it is published.',
  'web.legal.terms.content.title': 'Your content stays yours',
  'web.legal.terms.content.body':
    'You keep ownership of everything you upload, write or import. You grant Relay only the licence needed to store it, process it, adapt it into the variants you ask for, and transmit it to the accounts you selected. That licence ends when you delete the content, apart from records we are required to keep.',
  'web.legal.terms.warranties.title': 'What you are confirming when you publish',
  'web.legal.terms.warranties.body':
    'That you are authorized to publish to the accounts you connected, that you hold the rights to the content and the media, that you have the consent required for any person appearing in it, and that publishing it does not breach the destination platform rules.',
  'web.legal.terms.platforms.title': 'Platform dependence',
  'web.legal.terms.platforms.body':
    'Connectors depend on third party APIs that those companies control. A platform can change its API, restrict a permission, revoke an application or close access with little notice. Relay cannot guarantee that any connector remains available, and a connector becoming unavailable is not a failure of this agreement. We will tell you on the status page and the changelog when it happens.',
  'web.legal.terms.ai.title': 'AI output',
  'web.legal.terms.ai.body':
    'Text assistance, translation, transcreation and planning features produce suggestions. They can be wrong, out of date or unsuitable. You are responsible for reviewing anything you publish. Relay does not generate images or video.',
  'web.legal.terms.billing.title': 'Payment',
  'web.legal.terms.billing.body':
    'Polar is the merchant of record. Polar handles checkout, taxes, invoices and refunds. Subscriptions renew automatically at the interval you chose until you cancel. Platform usage that a provider charges per operation is billed separately at cost and is disclosed before the action that incurs it.',
  'web.legal.terms.suspension.title': 'Suspension and scheduled posts',
  'web.legal.terms.suspension.body':
    'If a subscription lapses or a workspace is suspended, scheduled posts stop rather than publishing silently, and the workspace becomes read only. Your content, receipts and connections are preserved and remain exportable.',
  'web.legal.terms.aup.title': 'Acceptable use',
  'web.legal.terms.aup.body':
    'The Acceptable Use Policy forms part of these terms. We may rate limit, pause, require verification, revoke agent or API access, suspend or terminate for a breach of it, and you may appeal any of those decisions to a person.',
  'web.legal.terms.termination.title': 'Ending the agreement',
  'web.legal.terms.termination.body':
    'You can cancel at any time from Settings. After termination you keep an export window before deletion, and deletion is never made conditional on paying an outstanding invoice, other than the billing records we are legally required to retain.',
  'web.legal.terms.developer.title': 'API, MCP and service accounts',
  'web.legal.terms.developer.body':
    'Programmatic access is governed additionally by the API and MCP Terms, including rate limits, scope requirements and the rule that a service account never inherits a human full permissions.',

  /* Privacy -------------------------------------------------------------- */
  'web.legal.privacy.title': 'Privacy Policy',
  'web.legal.privacy.summary':
    'What Relay collects, why, who processes it, how long it is kept, and how to get it out or have it deleted.',
  'web.legal.privacy.collect.title': 'What we hold',
  'web.legal.privacy.collect.account':
    'Account and profile: your name, email, workspace membership and role.',
  'web.legal.privacy.collect.connections':
    'Social connections: the platform account identifier, its display name, its type, the granted scopes and an encrypted access token. Tokens are stored with envelope encryption and are never written to a log.',
  'web.legal.privacy.collect.content':
    'Content and media you create, upload or import, including the rights and provenance you record with it.',
  'web.legal.privacy.collect.schedules':
    'Schedules, approval decisions, publication receipts and audit events.',
  'web.legal.privacy.collect.analytics':
    'Metrics retrieved from platforms about posts you published through Relay.',
  'web.legal.privacy.collect.billing':
    'Billing references held by Polar. Relay does not store your card details.',
  'web.legal.privacy.collect.technical':
    'Device and log data needed to operate and secure the service, redacted by default.',
  'web.legal.privacy.collect.agent':
    'Agent and API activity: which credential took which action, with an input hash rather than the input.',
  'web.legal.privacy.minimization.title': 'What we deliberately do not do',
  'web.legal.privacy.minimization.scopes':
    'We request only the platform scopes the features you have enabled actually need.',
  'web.legal.privacy.minimization.history':
    'We do not ingest your entire social history in order to draw a chart.',
  'web.legal.privacy.minimization.logs':
    'Post content is redacted from general logs and from support tooling.',
  'web.legal.privacy.minimization.training':
    'Your content is not used to train our models or anyone models by default.',
  'web.legal.privacy.subprocessors.title': 'Who else processes it',
  'web.legal.privacy.subprocessors.body':
    'The current subprocessor list is published separately and changes are announced there before they take effect.',
  'web.legal.privacy.retention.title': 'How long we keep it',
  'web.legal.privacy.rights.title': 'Your controls',
  'web.legal.privacy.rights.export':
    'Download your content, receipts and analytics as JSON and CSV with a media archive.',
  'web.legal.privacy.rights.revoke':
    'Disconnect one social account without deleting the workspace. Tokens are revoked at the platform and deleted here.',
  'web.legal.privacy.rights.delete':
    'Delete a project, a piece of content, a media file or the entire account.',
  'web.legal.privacy.rights.cancelJobs':
    'Cancel scheduled jobs before deleting anything, so nothing publishes after you leave.',
  'web.legal.privacy.rights.sessions':
    'See and revoke active sessions, API keys, agent credentials, webhooks and platform permissions.',
  'web.legal.privacy.rights.consent':
    'Consent preferences are versioned and auditable, so you can see what you agreed to and when.',
  'web.legal.privacy.deletion.title': 'Deleting data held at a platform',
  'web.legal.privacy.deletion.body':
    'Disconnecting an account in Relay revokes the token at the platform and deletes the credential here. Content already published on a platform is governed by that platform and has to be deleted there. Where a platform requires deletion of derived data within a fixed period after revocation, we meet that period. For Google and YouTube data that period is currently 30 days.',
  'web.legal.privacy.transfers.title': 'International transfers',
  'web.legal.privacy.transfers.body':
    'Hosting regions and the transfer mechanism are being finalized with counsel and will be named here, together with the safeguards that apply, before launch.',

  /* Acceptable use ------------------------------------------------------- */
  'web.legal.aup.title': 'Acceptable Use Policy',
  'web.legal.aup.summary':
    'Relay helps you publish content you are authorized to publish. It is not built to help anyone evade a platform limit, fake an endorsement or send unwanted messages.',
  'web.legal.aup.prohibited.title': 'Not permitted',
  'web.legal.aup.prohibited.spam':
    'Spam, unsolicited bulk messages, replies or mentions, engagement bait, and repeated unwanted content.',
  'web.legal.aup.prohibited.linkSchemes':
    'Automated directory or form submissions, bulk outreach, link schemes, paid or reciprocal links intended to manipulate search ranking, and community promotion that breaks the destination rules.',
  'web.legal.aup.prohibited.inauthentic':
    'Coordinated inauthentic behaviour, multi account amplification presented as independent, engagement pods, fake reviews, ratings or install counts, automated likes and follows, and trend manipulation.',
  'web.legal.aup.prohibited.duplicate':
    'Publishing duplicate or substantially similar content across many accounts where the platform prohibits it.',
  'web.legal.aup.prohibited.impersonation':
    'Impersonation, phishing, fraud, scams, malware, credential theft and deceptive installation.',
  'web.legal.aup.prohibited.harm':
    'Harassment, doxxing, sexual exploitation, non consensual intimate media, hate or violent extremist content, and illegal goods or services.',
  'web.legal.aup.prohibited.political':
    'Political manipulation and automated political persuasion where it is prohibited. Political content, where permitted at all, is subject to enhanced review.',
  'web.legal.aup.prohibited.rights':
    'Copyright, trademark and publicity violations, unlicensed music or media, synthetic likenesses without rights and disclosure, and undisclosed paid endorsements.',
  'web.legal.aup.prohibited.circumvention':
    'Bypassing official APIs, rate limits, audits, account controls or platform enforcement using browser automation, cookie replay or scraping.',
  'web.legal.aup.prohibited.restrictedStores':
    'Automated submission to app stores, the Chrome Web Store or other restricted submission systems through unauthorized interfaces.',
  'web.legal.aup.prohibited.banEvasion':
    'Evading an account ban or running coordinated account farms.',
  'web.legal.aup.prohibited.training':
    'Training or evaluating models on third party or other customers content without authorization.',
  'web.legal.aup.controls.title': 'The controls that enforce this',
  'web.legal.aup.controls.duplicate':
    'Exact and near duplicate fingerprinting by workspace, account, platform and time window, with a cross account similarity check.',
  'web.legal.aup.controls.cadence':
    'Account level and workspace level cadence budgets, plus mention, hashtag, URL and domain volume checks.',
  'web.legal.aup.controls.escalation':
    'New account, new domain and bulk action escalation, and a maximum number of repetitions for any repeating campaign.',
  'web.legal.aup.controls.linkSafety':
    'Destination scanning on short links, with emergency disable and an abuse report channel.',
  'web.legal.aup.controls.workspaceCaps':
    'A workspace owner can set stricter limits than the plan allows. Risk controls cannot be loosened by paying more.',
  'web.legal.aup.enforcement.title': 'Enforcement and appeal',
  'web.legal.aup.enforcement.body':
    'Where we can, we block before the external action rather than after it, and we record the reason, the rule version and the appeal path. Repeated or serious behaviour goes to a trust review by a person. You will be told what happened, without a level of detail that would help someone evade the check. Every decision can be appealed and reversed.',
  'web.legal.aup.report.title': 'Reporting abuse',
  'web.legal.aup.report.body':
    'If content published through Relay breaks these rules, tell us. Include the post URL and what is wrong with it.',

  /* AI policy ------------------------------------------------------------ */
  'web.legal.ai.title': 'AI Use and Generated Content Policy',
  'web.legal.ai.summary':
    'Which features use a model, what is sent, what is kept, what you stay responsible for, and why Relay does not generate media.',
  'web.legal.ai.features.title': 'Where a model is used',
  'web.legal.ai.features.text':
    'Text assistance in the composer: rewriting, shortening and adapting for a platform.',
  'web.legal.ai.features.translation':
    'Translation and transcreation into your content languages, against your project glossary.',
  'web.legal.ai.features.feedback': 'Content feedback and the four week growth plan.',
  'web.legal.ai.features.provider':
    'These features call DeepSeek. The model identifiers currently in use are published in the documentation and any change is listed on the changelog.',
  'web.legal.ai.data.title': 'What is sent, and what happens to it',
  'web.legal.ai.data.sent':
    'Only the text you asked us to work on, the instruction, and the project context you chose to attach. Credentials, tokens and other customers content are never in a model context.',
  'web.legal.ai.data.training':
    'Your content is not used to train our models. We configure providers so it is not used to train theirs.',
  'web.legal.ai.data.optOut':
    'Optional AI features can be turned off per workspace. Publishing, scheduling, approvals and analytics do not depend on them.',
  'web.legal.ai.responsibility.title': 'What stays yours',
  'web.legal.ai.responsibility.body':
    'A model can be confidently wrong. You are responsible for checking facts, claims, names, numbers and tone before you publish, and for any disclosure a platform requires. No AI feature guarantees reach, engagement or ranking, and none is offered as one.',
  'web.legal.ai.disclosure.title': 'Disclosure and provenance',
  'web.legal.ai.disclosure.body':
    'Relay records whether content was AI assisted in its internal history, reminds you where a platform requires an altered or synthetic media disclosure, and stores the provenance you provide with an imported asset. Where a platform offers a disclosure field, Relay sets it from your declaration rather than guessing.',
  'web.legal.ai.blocks.title': 'What the AI features refuse',
  'web.legal.ai.blocks.impersonation': 'Impersonating a real person or a public figure.',
  'web.legal.ai.blocks.ncii': 'Non consensual intimate imagery, in any form.',
  'web.legal.ai.blocks.fabrication':
    'Fabricated testimonials, invented customers and invented performance figures.',
  'web.legal.ai.blocks.unverified':
    'Presenting a model generated URL as a verified opportunity. Opportunity and tool recommendations come only from the curated catalog.',
  'web.legal.ai.noMedia.title': 'Why there is no image or video generation',
  'web.legal.ai.noMedia.body':
    'Relay has not collected the verified visual system, product detail, asset rights, likeness permissions and campaign context that brand ready output would require, and in app generation would need its own consent, provenance, safety evaluation and cost controls. Media model capability, licensing, pricing and retention also change quickly, which is why our tool recommendations carry dates. You keep creative control by choosing a specialist tool and importing the approved asset. Relay handles adaptation, approval, publishing and measurement.',
  'web.legal.ai.noMedia.caveat':
    'A tool appearing in our radar is not a statement that its output is safe or rights cleared. Its documented caveats are shown with it and your normal rights declaration still applies.',

  /* Cookies -------------------------------------------------------------- */
  'web.legal.cookies.title': 'Cookie Policy',
  'web.legal.cookies.summary':
    'What is stored in your browser, why, and what happens if you refuse the optional parts.',
  'web.legal.cookies.essential.title': 'Strictly necessary',
  'web.legal.cookies.essential.body':
    'A session cookie that keeps you signed in, a cross site request forgery token, and a preference cookie holding your theme and time zone choice. These cannot be turned off without breaking sign in, and they are not used for advertising.',
  'web.legal.cookies.analytics.title': 'Product analytics',
  'web.legal.cookies.analytics.body':
    'Aggregate, first party measurement of which screens are used, so we can fix the ones that are not working. It is optional, it is off until you allow it, and refusing it changes nothing about the product.',
  'web.legal.cookies.marketing.title': 'Advertising',
  'web.legal.cookies.marketing.body':
    'We do not run advertising cookies, we do not embed third party advertising pixels, and we do not sell or share personal information for cross context behavioural advertising.',
  'web.legal.cookies.shortLinks.title': 'Tracked short links',
  'web.legal.cookies.shortLinks.body':
    'A short link click creates first party analytics for the workspace that owns the link. Location and device data are minimized, bot traffic is classified out, IP addresses are truncated or discarded promptly, and a workspace can turn tracking off or shorten retention. Nothing sensitive is ever put in a slug or a query parameter.',
  'web.legal.cookies.control.title': 'Changing your mind',
  'web.legal.cookies.control.body':
    'The consent choice is stored with a version and can be changed at any time in Settings, under data controls. Withdrawing consent takes effect immediately.',

  /* Subprocessors -------------------------------------------------------- */
  'web.legal.subprocessors.title': 'Subprocessors',
  'web.legal.subprocessors.summary':
    'The companies that process customer data on our behalf, what they do, and where.',
  'web.legal.subprocessors.notice.title': 'Change notice',
  'web.legal.subprocessors.notice.body':
    'A new subprocessor is published here before it starts processing customer data, with at least 30 days notice for a change that materially affects processing. Customers with a data processing addendum can object during that window.',
  'web.legal.subprocessors.column.name': 'Subprocessor',
  'web.legal.subprocessors.column.purpose': 'What it processes for us',
  'web.legal.subprocessors.column.data': 'Data categories',
  'web.legal.subprocessors.column.region': 'Processing region',
  'web.legal.subprocessors.platforms.title': 'Social platforms are not subprocessors',
  'web.legal.subprocessors.platforms.body':
    'When you publish, Relay transmits your content to the platform account you selected, at your instruction. Those platforms are independent controllers of what they receive and their own terms govern it.',

  /* Refunds -------------------------------------------------------------- */
  'web.legal.refunds.title': 'Refund and Cancellation Policy',
  'web.legal.refunds.summary':
    'How to cancel, what happens to your data, and when you get money back.',
  'web.legal.refunds.cancel.title': 'Cancelling',
  'web.legal.refunds.cancel.body':
    'Cancel from Settings without contacting support. Cancelling during the seven day trial means no charge is attempted and the cancellation screen confirms that in writing. Cancelling after the trial keeps your access until the end of the period you already paid for.',
  'web.legal.refunds.refund.title': 'Refunds',
  'web.legal.refunds.refund.body':
    'If the service did not work as described, contact support and we will refund the affected period. Mandatory consumer withdrawal rights, including the statutory cooling off period where it applies to you, are honoured in full and are not limited by anything on this page. Refunds are issued by Polar, our merchant of record, to the original payment method.',
  'web.legal.refunds.usage.title': 'Platform usage charges',
  'web.legal.refunds.usage.body':
    'Usage passed through from a platform, such as X per operation pricing, covers a cost we already paid on your behalf for an action you confirmed. It is refundable when the charge was our error, for example a duplicate dispatch caused by a defect on our side.',
  'web.legal.refunds.data.title': 'What happens to your data',
  'web.legal.refunds.data.body':
    'Nothing is deleted at cancellation. The workspace becomes read only, scheduled posts stop rather than publishing, and you keep an export window before deletion. Deletion is never made conditional on paying an invoice, apart from the billing records we must keep by law.',
  'web.legal.refunds.failed.title': 'A failed payment',
  'web.legal.refunds.failed.body':
    'Polar retries and emails you. During the grace period publishing continues. After it, the workspace becomes read only and scheduled posts stop. Nothing is disconnected and nothing is deleted.',

  /* DMCA ----------------------------------------------------------------- */
  'web.legal.dmca.title': 'Copyright and Takedown',
  'web.legal.dmca.summary':
    'How to report content hosted by Relay that infringes your rights, and how to respond if yours was removed.',
  'web.legal.dmca.scope.title': 'What we can act on',
  'web.legal.dmca.scope.body':
    'Relay can remove material stored in our systems, such as a media file or a draft. Content already published on a social platform lives on that platform and has to be reported to it, because we cannot delete a post we do not host. We will tell you which of the two applies to your report.',
  'web.legal.dmca.notice.title': 'Sending a notice',
  'web.legal.dmca.notice.identify':
    'Identify the copyrighted work and the material you say infringes it, with a URL we can reach.',
  'web.legal.dmca.notice.contact': 'Give your name, address, telephone number and email.',
  'web.legal.dmca.notice.goodFaith':
    'State that you believe in good faith that the use is not authorized by the rights holder, its agent or the law.',
  'web.legal.dmca.notice.accuracy':
    'State that the information is accurate and, under penalty of perjury, that you are authorized to act for the rights holder.',
  'web.legal.dmca.notice.signature': 'Sign it, physically or electronically.',
  'web.legal.dmca.counter.title': 'Counter notice',
  'web.legal.dmca.counter.body':
    'If your material was removed and you believe that was a mistake or a misidentification, you can send a counter notice with the same contact details, identifying the material and where it was, and consenting to the jurisdiction that will be named here. We will forward it to the person who complained.',
  'web.legal.dmca.repeat.title': 'Repeat infringers',
  'web.legal.dmca.repeat.body':
    'Accounts that repeatedly infringe are suspended and then terminated. Bad faith notices, used to remove a competitor content, are also grounds for termination.',

  /* Security ------------------------------------------------------------- */
  'web.legal.security.title': 'Security and Responsible Disclosure',
  'web.legal.security.summary':
    'How Relay protects the credentials you trust it with, and how to report a problem you find.',
  'web.legal.security.tokens.title': 'Social credentials',
  'web.legal.security.tokens.body':
    'Platform tokens are encrypted with envelope encryption under a managed key, rotated, stored apart from content and billing data, and redacted from every log. A token is never sent to a browser, never placed in a model context and never included in an error message.',
  'web.legal.security.tenancy.title': 'Tenancy',
  'web.legal.security.tenancy.body':
    'Isolation is enforced three times: at the edge when you authenticate, in the application service when it authorizes the action, and in PostgreSQL through row level security. Being signed in is never treated as permission. Cross workspace access attempts are tested in continuous integration and must fail.',
  'web.legal.security.publishing.title': 'Publishing integrity',
  'web.legal.security.publishing.body':
    'Every external write carries an idempotency key and produces an immutable receipt. Duplicate publication is treated as a defect with a target of zero, and the test suite includes worker crashes after platform acceptance, platform timeouts, duplicated webhooks, revoked tokens at dispatch and daylight saving transitions.',
  'web.legal.security.program.title': 'The programme',
  'web.legal.security.program.threatModel':
    'A written threat model covering OAuth, tenancy, publishing, MCP, media, billing and analytics.',
  'web.legal.security.program.pentest':
    'An independent security review focused on token leakage and cross tenant access before paid launch.',
  'web.legal.security.program.access':
    'Least privilege production access, multi factor authentication, and a device and session inventory.',
  'web.legal.security.program.supplyChain':
    'Dependency and container scanning with patch service levels, and signed build provenance where practical.',
  'web.legal.security.program.logging':
    'Centralized logging that redacts by default, with anomaly alerting.',
  'web.legal.security.program.backups':
    'Encrypted backups with tested restoration and a documented rotation.',
  'web.legal.security.disclosure.title': 'Reporting a vulnerability',
  'web.legal.security.disclosure.body':
    'Email us with enough detail to reproduce the issue. We acknowledge within two business days, keep you updated, and credit you when you want the credit. Please do not access another customer data, degrade the service, or run automated scanning against production. Test against your own workspace.',
  'web.legal.security.disclosure.safeHarbor':
    'We will not pursue legal action for good faith research that follows this policy. The exact safe harbour wording is with counsel.',
  'web.legal.security.incidents.title': 'If something goes wrong',
  'web.legal.security.incidents.body':
    'We have an incident response plan with named decision makers, severity levels, evidence preservation and notification duties. Incidents that affected publishing are published on the status page with a timeline and what changed afterwards, including the ones we caused.',

  /* Accessibility -------------------------------------------------------- */
  'web.legal.accessibility.title': 'Accessibility Statement',
  'web.legal.accessibility.summary':
    'The standard Relay is built to, what we have verified, what we know is not right yet, and how to tell us.',
  'web.legal.accessibility.standard.title': 'The standard',
  'web.legal.accessibility.standard.body':
    'Relay targets WCAG 2.2 level AA across the product and this site. Accessibility is a merge requirement here, not a later ticket, and a screen that fails it does not ship.',
  'web.legal.accessibility.measures.title': 'What that means in practice',
  'web.legal.accessibility.measures.keyboard':
    'Everything is operable from the keyboard, with a visible focus ring and a logical focus order. There is no drag only interaction anywhere.',
  'web.legal.accessibility.measures.contrast':
    'Every colour pair in the design system is asserted at 4.5 to 1 for body text and 3 to 1 for large text and control edges, in both the light and the dark theme, by an automated test.',
  'web.legal.accessibility.measures.colour':
    'Status, capability and freshness always carry an icon and a word as well as a colour.',
  'web.legal.accessibility.measures.announcements':
    'Save state, validation changes, upload progress, schedule confirmation and publish results are announced to screen readers.',
  'web.legal.accessibility.measures.zoom':
    'Layouts work at 320 pixels wide and at 200 percent zoom without horizontal page scrolling. Wide tables scroll inside their own container.',
  'web.legal.accessibility.measures.motion':
    'A reduced motion preference removes every non essential transition.',
  'web.legal.accessibility.measures.targets':
    'Touch targets are at least 44 pixels on a coarse pointer.',
  'web.legal.accessibility.known.title': 'Known gaps',
  'web.legal.accessibility.known.body':
    'We will list specific known issues here with a fix date as they are found, rather than claiming full conformance. An independent audit is planned before general availability and its findings will be published here.',
  'web.legal.accessibility.feedback.title': 'Tell us about a barrier',
  'web.legal.accessibility.feedback.body':
    'Describe what you were trying to do, the page, and the assistive technology you use. We reply within five business days and will offer another way to complete the task while we fix it.',

  /* API and MCP terms ---------------------------------------------------- */
  'web.legal.apiTerms.title': 'API and MCP Terms',
  'web.legal.apiTerms.summary':
    'Additional terms for programmatic access, including agent credentials, rate limits and what a service account may never do.',
  'web.legal.apiTerms.credentials.title': 'Credentials',
  'web.legal.apiTerms.credentials.body':
    'An API key or agent credential identifies a scoped service account. It is not a copy of a person account and it never inherits their full permissions. Keys are shown once, are revocable at any time, and must not be embedded in a client application or a public repository.',
  'web.legal.apiTerms.scopes.title': 'Scopes',
  'web.legal.apiTerms.scopes.body':
    'Reading, drafting, requesting approval, scheduling, publishing immediately, cancelling, analytics and billing are separate scopes. Request the smallest set the integration needs. Immediate publishing and other high risk actions require explicit human confirmation by default and that default is set per workspace, not per credential.',
  'web.legal.apiTerms.limits.title': 'Rate limits and idempotency',
  'web.legal.apiTerms.limits.body':
    'Every write requires an idempotency key. Replaying a request with the same key returns the original result. Rate limits are published in the documentation and are returned in the response headers, and a limit response tells you when it resets.',
  'web.legal.apiTerms.agents.title': 'Agent behaviour',
  'web.legal.apiTerms.agents.body':
    'A single call may not silently publish to every connected account. Bulk actions, a new domain, a new account, a sensitive category, a paid endorsement, a privacy change or content altered after approval always escalate for a human decision. Every agent and every workspace has a kill switch.',
  'web.legal.apiTerms.prohibited.title': 'Not permitted through the API',
  'web.legal.apiTerms.prohibited.body':
    'Reselling access without a written agreement, using Relay as a relay for content you are not authorized to publish, circumventing approval policy, and any use that breaks the Acceptable Use Policy. Programmatic access is subject to the same anti spam controls as the web app.',
  'web.legal.apiTerms.changes.title': 'Change policy',
  'web.legal.apiTerms.changes.body':
    'Additive changes ship without notice. Breaking changes get a new version, an announced deprecation window and a migration note on the changelog. Error codes do not change meaning within a version.',

  /* Affiliate terms ------------------------------------------------------ */
  'web.legal.affiliate.title': 'Affiliate and Creator Terms',
  'web.legal.affiliate.summary':
    'What we pay, what we require, and what will get an account closed.',
  'web.legal.affiliate.commission.title': 'Commission',
  'web.legal.affiliate.commission.body':
    'Recurring commission on referred subscriptions for up to twelve months, subject to fraud review. Commission is held until the refund window closes and is reversed if the customer refunds. Payouts run through Polar.',
  'web.legal.affiliate.disclosure.title': 'Disclosure is not optional',
  'web.legal.affiliate.disclosure.body':
    'Every place you share a referral link must disclose the commercial relationship clearly and close to the link, in the language of the audience. This applies to videos, posts, newsletters, articles and community replies alike.',
  'web.legal.affiliate.honesty.title': 'Paid for work, not for praise',
  'web.legal.affiliate.honesty.body':
    'A sponsored tutorial contract never requires a positive conclusion. You may publish criticism and still be paid. We do not buy reviews, votes, ratings or installs, and we do not offer an incentive conditional on a positive review.',
  'web.legal.affiliate.prohibited.title': 'Grounds for closing an affiliate account',
  'web.legal.affiliate.prohibited.brandBidding':
    'Bidding on our brand terms in paid search, or running ads that imply you are us.',
  'web.legal.affiliate.prohibited.spam':
    'Unsolicited email, mass community posting, or link dropping in threads that did not ask.',
  'web.legal.affiliate.prohibited.cookieStuffing':
    'Cookie stuffing, forced clicks, self referral and coupon squatting.',
  'web.legal.affiliate.prohibited.claims':
    'Inventing customer results, fabricating a testimonial, or claiming Relay does something it does not, including anything about AI media generation.',
  'web.legal.affiliate.prohibited.trademark':
    'Registering a domain, handle or app listing that uses our name in a way that suggests you are the company.',

  /* ---------------------------------------------------------------------- */
  /* Platform names and per platform facts                                   */
  /* ---------------------------------------------------------------------- */

  'web.marketing.provider.x.label': 'X',
  'web.marketing.provider.linkedin.label': 'LinkedIn',
  'web.marketing.provider.instagram.label': 'Instagram',
  'web.marketing.provider.facebook.label': 'Facebook',
  'web.marketing.provider.youtube.label': 'YouTube',
  'web.marketing.provider.tiktok.label': 'TikTok',
  'web.marketing.provider.threads.label': 'Trådar',
  'web.marketing.provider.bluesky.label': 'Bluesky',

  'web.marketing.provider.x.accountTypes':
    'Ett personligt eller affärsmässigt X-konto du kontrollerar.',
  'web.marketing.provider.x.restriction':
    'Automatisk inlägg kräver kontoinnehavarens uttryckliga samtycke, vilket Relay registrerar. Dubbletter eller väsentligen liknande inlägg på flera konton är inte tillåtna, och oönskade automatiska svar skapas inte.',
  'web.marketing.provider.x.cost':
    'X tar betalt för varje API-operation och tar mer betalt för ett inlägg som innehåller en URL. Relay uppskattar kostnaden innan du bekräftar och skickar igenom den utan en markering.',

  'web.marketing.provider.linkedin.accountTypes':
    'En medlemsprofil, eller en organisationssida där du har rätt roll.',
  'web.marketing.provider.linkedin.restriction':
    'Publicering på uppdrag av en organisation kräver en godkänd produkt för Community Management och en verifierad företagsidentitet. Medlemsinläggsanalys beror på en läsbehörighet som LinkedIn har stängt för nya applikationer, så Relay kommer inte att erbjuda det.',
  'web.marketing.provider.linkedin.cost':
    'Ingen avgift per operation. Ansöknings- och dagliga gränser för medlemmar gäller.',

  'web.marketing.provider.instagram.accountTypes':
    'Ett professionellt Instagram-konto, företag eller kreatör.',
  'web.marketing.provider.instagram.restriction':
    'Instagram-innehållspublicering är endast tillgängligt för professionella konton. Ett konsumentkonto kan inte publiceras av någon applikation, inklusive denna. Publicering använder den officiella behållaren och publiceringssekvensen, och Relay bekräftar det slutliga tillståndet snarare än att rapportera uppladdningen som framgång.',
  'web.marketing.provider.instagram.cost':
    'Ingen avgift per operation. Meta-appgranskning och företagsverifiering krävs.',

  'web.marketing.provider.facebook.accountTypes': 'En Facebook-sida som du administrerar.',
  'web.marketing.provider.facebook.restriction':
    'Publiceringsmålet är en sida. Automatisering av en personlig profil erbjuds inte av API:t och Relay försöker inte det.',
  'web.marketing.provider.facebook.cost':
    'Ingen avgift per operation. Meta-appgranskning och företagsverifiering krävs.',

  'web.marketing.provider.youtube.accountTypes': 'En YouTube-kanal kopplad via ditt Google-konto.',
  'web.marketing.provider.youtube.restriction':
    'Ett projekt som inte har klarat granskningen av Googles API-efterlevnad kan bara laddas upp som privat. Relay kommer inte att beskriva offentlig uppladdning som tillgänglig förrän granskningen har passerat, och anslutningsskärmen anger vilket tillstånd dina uppladdningar kommer att landa i.',
  'web.marketing.provider.youtube.cost':
    'Ingen avgift per operation. En daglig kvot gäller och kan inte delas mellan projekt.',

  'web.marketing.provider.tiktok.accountTypes': 'Ett TikTok-konto med direktpostauktorisering.',
  'web.marketing.provider.tiktok.restriction':
    'Tills granskningen av API:et för innehållspostering har passerat är inlägg privata och begränsningar per konto gäller. Vid publiceringstid hämtar Relay den aktuella skaparinformationen, visar tillgängliga sekretessalternativ utan att förvälja ett, och frågar efter inställningarna för kommentar, duett och stygn och deklarationen av kommersiellt innehåll.',
  'web.marketing.provider.tiktok.cost':
    'Ingen avgift per operation. Oreviderat läge tillämpar dagliga bokföringstak.',

  'web.marketing.provider.threads.accountTypes':
    'En trådprofil länkad till ett professionellt Instagram-konto.',
  'web.marketing.provider.threads.restriction':
    'Publicering följer Meta-behållaren och publiceringssekvensen. Funktionerna verifieras mot den officiella samlingen innan något här kallas stöd.',
  'web.marketing.provider.threads.cost': 'Ingen avgift per operation.',

  'web.marketing.provider.bluesky.accountTypes':
    'Ett Bluesky-konto hos vilken värdleverantör som helst.',
  'web.marketing.provider.bluesky.restriction':
    'Ett öppet protokoll utan applikationsgranskningssteg. Prisgränser och poststorleksgränser gäller fortfarande och tillämpas före avsändning.',
  'web.marketing.provider.bluesky.cost': 'Ingen avgift per operation.',
  'web.marketing.provider.mastodon.label': 'Mastodon',
  'web.marketing.provider.mastodon.accountTypes': 'Ett Mastodon-konto på vilken instans som helst.',
  'web.marketing.provider.mastodon.restriction':
    'Ett öppet protokoll utan appgranskning. Teckenbegränsningen bestäms av varje instans och dess hastighetsgränser respekteras.',
  'web.marketing.provider.mastodon.cost': 'Ingen kostnad per åtgärd.',
  'web.marketing.provider.telegram.label': 'Telegram',
  'web.marketing.provider.telegram.accountTypes':
    'En Telegram-bot du kontrollerar som publicerar i en kanal eller grupp.',
  'web.marketing.provider.telegram.restriction':
    'En bot kan bara publicera där den har lagts till. Token är en applikationsuppgift och målchatten väljs per anslutning.',
  'web.marketing.provider.telegram.cost': 'Ingen kostnad per åtgärd.',
  'web.marketing.provider.reddit.label': 'Reddit',
  'web.marketing.provider.reddit.accountTypes': 'Ett Reddit-konto som får publicera.',
  'web.marketing.provider.reddit.restriction':
    'Att skriva på Reddit kräver en godkänd app. Inlägg är text- eller länkinlägg i tillåtna subreddits; inga automatiska kommentarer eller röster.',
  'web.marketing.provider.reddit.cost': 'Ingen kostnad per åtgärd.',
  'web.marketing.provider.wordpress.label': 'WordPress',
  'web.marketing.provider.wordpress.accountTypes': 'En WordPress-webbplats med applösenord.',
  'web.marketing.provider.wordpress.restriction':
    'Inlägg publiceras via webbplatsens REST API som den anslutna användaren. Uppladdning av bilder och video är inte byggd ännu.',
  'web.marketing.provider.wordpress.cost': 'Ingen kostnad per åtgärd.',
  'web.marketing.provider.medium.label': 'Medium',
  'web.marketing.provider.medium.accountTypes': 'En Medium-författarprofil ansluten via OAuth.',
  'web.marketing.provider.medium.restriction':
    'Inlägg publiceras som offentliga berättelser i Markdown. Integrations-API:et har ingen radering, så den erbjuds inte.',
  'web.marketing.provider.medium.cost': 'Ingen kostnad per åtgärd.',
  'web.marketing.provider.devto.label': 'Dev.to',
  'web.marketing.provider.devto.accountTypes': 'En Dev.to-profil ansluten med dess API-nyckel.',
  'web.marketing.provider.devto.restriction':
    'Artiklar publiceras som offentliga Markdown-inlägg. Bilduppladdning och analys är inte byggda ännu.',
  'web.marketing.provider.devto.cost': 'Ingen kostnad per åtgärd.',
  'web.marketing.provider.pinterest.label': 'Pinterest',
  'web.marketing.provider.pinterest.accountTypes':
    'Ett Pinterest-företagskonto anslutet via OAuth.',
  'web.marketing.provider.pinterest.restriction':
    'En pin kräver en bild och en egen anslagstavla. Att skriva kräver appgranskning; tavlorna läses vid anslutning.',
  'web.marketing.provider.pinterest.cost': 'Ingen kostnad per åtgärd.',
  'web.marketing.provider.discord.label': 'Discord',
  'web.marketing.provider.discord.accountTypes':
    'En Discord-bot du kontrollerar som publicerar i textkanaler.',
  'web.marketing.provider.discord.restriction':
    'Boten kan bara publicera i kanaler den ser. Textmeddelanden stöds; bilagor inte ännu.',
  'web.marketing.provider.discord.cost': 'Ingen kostnad per åtgärd.',
  'web.marketing.provider.slack.label': 'Slack',
  'web.marketing.provider.slack.accountTypes': 'En Slack-arbetsyta ansluten via en OAuth-app.',
  'web.marketing.provider.slack.restriction':
    'Meddelanden går till offentliga och privata kanaler där appen finns. Filuppladdning och analys är inte byggda ännu.',
  'web.marketing.provider.slack.cost': 'Ingen kostnad per åtgärd.',

  /* ---------------------------------------------------------------------- */
  /* Capability matrix notes                                                 */
  /* ---------------------------------------------------------------------- */

  'web.capabilities.short.supported': 'Stöds',
  'web.capabilities.short.unsupported': 'Plattformen erbjuder det inte',
  'web.capabilities.short.not_implemented': 'Inte byggt ännu',
  'web.capabilities.short.requires_review': 'Behöver granskning av plattformen',
  'web.capabilities.notesTitle': 'Anteckningar och källor',
  'web.capabilities.noteRef': 'Observera {number}',
  'web.capabilities.summary':
    '{supported, plural, one {# funktion stöds} other {# funktioner stöds}}, {requiresReview, plural, one {# väntar på plattformsgranskning} other {# väntar på plattformsgranskning}}, {notImplemented, plural, one {# inte byggd ännu} other {# inte byggda ännu}}, {unsupported, plural, one {# funktion erbjuds inte av plattformen} other {# funktioner erbjuds inte av plattformen}}.',
  'web.capabilities.buildState.title': 'Ingen anslutning bär kundtrafik ännu',
  'web.capabilities.buildState.body':
    'Reläet är byggt. Den här tabellen återspeglar anslutningsdefinitionerna som de ser ut idag, vilket är anledningen till att de flesta celler läses som inte byggda ännu. En cell stöds först efter att anslutningen klarar sin definition av klar, inklusive kontraktstester mot de inspelade plattformsfixturerna. Cellerna som säger att en plattform inte erbjuder något, eller som slussar den bakom en recension, är fakta om plattformen och är redan slutgiltiga.',
  'web.capabilities.note.instagramProfessional':
    'Endast professionella konton. Ett konsumentkonto kan inte publiceras av någon applikation.',
  'web.capabilities.note.facebookPagesOnly':
    'Endast sidor. API:et publiceras inte till en personlig profil.',
  'web.capabilities.note.youtubeAudit':
    'Tills granskningen av efterlevnad av Googles API passerar, landar uppladdningar som privata.',
  'web.capabilities.note.tiktokAudit':
    'Tills granskningen av API:et för innehållspostering har passerat är inlägg privata och begränsade.',
  'web.capabilities.note.tiktokPrivacy':
    'Sekretessalternativet hämtas vid publiceringstidpunkten och måste väljas av en person.',
  'web.capabilities.note.linkedinMemberAnalytics':
    'Medlemsinläggsanalys behöver läsbehörighet LinkedIn har stängt för nya ansökningar.',
  'web.capabilities.note.linkedinOrgAccess':
    'Kräver en godkänd produkt för Community Management och en verifierad verksamhet.',
  'web.capabilities.note.linkedinDocuments':
    'LinkedIn är den enda uppkopplade plattformen med en typ av dokumentinlägg.',
  'web.capabilities.note.metaReview': 'Kräver granskning av Meta-appen och företagsverifiering.',
  'web.capabilities.note.xConsent':
    'Kräver registrerat samtycke från kontoinnehavaren för automatisk bokföring.',
  'web.capabilities.note.xDisclosure':
    'Plattformen tillhandahåller ett gjort med AI-fält, som Relay ställer in från din deklaration.',
  'web.capabilities.note.noDestinations':
    'Denna plattform har inget destinationskoncept som en sida, tavla eller community.',
  'web.capabilities.note.noThreads': 'Den här plattformen har ingen inbyggd multipostsekvens.',
  'web.capabilities.note.noDocuments': 'Denna plattform har ingen typ av dokumentpost.',
  'web.capabilities.note.videoOnly': 'Denna plattform accepterar endast videouppladdningar.',
  'web.capabilities.note.noAltText':
    'Den här plattformen accepterar inte alt-text via dess publicerings-API.',
  'web.capabilities.note.noPrivacyChoice':
    'Denna plattform erbjuder inte ett sekretessalternativ per post via sitt API.',
  'web.capabilities.note.noThumbnail':
    'Den här plattformen accepterar inte en anpassad miniatyrbild via sitt API.',
  'web.capabilities.note.inBuild': 'Plattformen erbjuder detta. Relay har inte skickat den än.',
  'web.capabilities.note.noCarousel': 'Plattformen erbjuder ingen svepbar karusell.',
  'web.capabilities.note.noDisclosure':
    'Plattformen har inget fält för avslöjande av AI- eller kommersiellt innehåll.',
  'web.capabilities.note.noAnalytics':
    'Plattformen exponerar inga engagemangsmått via sitt officiella API.',
  'web.capabilities.note.redditReview': 'Att skriva på Reddit kräver en godkänd data-API-app.',
  'web.capabilities.note.redditMedia': 'Bild- och videoinlägg är inte byggda för Reddit ännu.',
  'web.capabilities.note.mediumImages': 'Integrations-API:et accepterar inte bildbilagor.',
  'web.capabilities.note.mediumNoDelete': 'Integrations-API:et har ingen raderingsslutpunkt.',
  'web.capabilities.note.devtoImages':
    'API:et accepterar endast artikeltexter; bilduppladdning är inte byggd ännu.',
  'web.capabilities.note.pinterestNeedsImage': 'En pin kräver en bild; textonly-pins finns inte.',
  'web.capabilities.note.pinterestReview': 'Att skriva på Pinterest kräver godkänd appåtkomst.',

  /* ---------------------------------------------------------------------- */
  /* Status page surfaces                                                    */
  /* ---------------------------------------------------------------------- */

  'web.status.surface.web': 'Webbapp',
  'web.status.surface.api': 'REST API',
  'web.status.surface.mcp': 'MCP-server',
  'web.status.surface.cli': 'CLI',
  'web.status.surface.webhooks': 'Webhook leverans',
  'web.status.surface.publishing': 'Förlagsarbetare',
  'web.status.surface.media': 'Mediebearbetning',
  'web.status.surface.analytics': 'Analyssamling',
  'web.status.surface.links': 'Korta länkomdirigeringar',
  'web.status.surface.checkout': 'Kassa och fakturering',
  'web.status.preLaunch.title': 'Relä är inte allmänt tillgängligt ännu',
  'web.status.preLaunch.body':
    'Den här sidan är aktiv innan produkten finns, så att rapporteringsvanan existerar från den första kunden istället för att läggas till efter det första avbrottet. Ytor som fortfarande är byggda markeras som sådana istället för att visas som friska.',

  /* ---------------------------------------------------------------------- */
  /* Comparison targets                                                      */
  /* ---------------------------------------------------------------------- */

  'web.compare.product.postiz': 'Postiz',
  'web.compare.product.buffer': 'Buffert',
  'web.compare.product.hootsuite': 'Hootsuite',
  'web.compare.product.later': 'Senare',
  'web.compare.product.metricool': 'Metricool',
  'web.compare.product.publer': 'Publisher',
  'web.compare.product.socialbee': 'SocialBee',
  'web.compare.product.typefully': 'Typiskt',
  'web.compare.product.publishingApis': 'Utvecklare för publicering av API:er',
  'web.compare.state.factCheckPending': 'Faktakontroll pågår',

  /* ---------------------------------------------------------------------- */
  /* Tool radar categories                                                   */
  /* ---------------------------------------------------------------------- */

  'web.toolRadar.category.video': 'Videogenerering och redigering',
  'web.toolRadar.category.image': 'Bildgenerering och redigering',
  'web.toolRadar.category.audio': 'Ljud, röst och musik',
  'web.toolRadar.category.ugc': 'Avatar- och skaparstilsvideo',
  'web.toolRadar.category.clipping': 'Lång video till korta klipp',
  'web.toolRadar.category.design': 'Design och layout',
  'web.toolRadar.category.research': 'Forskning och källinsamling',
  'web.toolRadar.category.workflow': 'Arbetsflödesautomatisering',

  /* ---------------------------------------------------------------------- */
  /* Opportunity categories                                                  */
  /* ---------------------------------------------------------------------- */

  'web.opportunities.category.launch': 'Kataloger för produktlansering och start',
  'web.opportunities.category.review': 'Programvara och recensionskataloger',
  'web.opportunities.category.marketplace': 'Integrations- och automationsmarknadsplatser',
  'web.opportunities.category.community': 'Communitytrådar som tillåter inlämningar',
  'web.opportunities.category.partner': 'Partnerekosystem och integrationskataloger',
  'web.opportunities.category.editorial': 'Gästhandledningar, podcaster och nyhetsbrev',
  'web.opportunities.category.openSource': 'Öppen källkodslistor och dokumentationsresurser',

  /* ---------------------------------------------------------------------- */
  /* Subprocessors and retention                                             */
  /* ---------------------------------------------------------------------- */

  'web.legal.subprocessors.neon.label': 'Neon',
  'web.legal.subprocessors.neon.purpose': 'Managed PostgreSQL, authentication and object storage.',
  'web.legal.subprocessors.neon.data':
    'Account records, content, media, schedules, receipts and audit events.',
  'web.legal.subprocessors.temporal.label': 'Temporal Cloud',
  'web.legal.subprocessors.temporal.purpose':
    'Durable execution of publishing, retry and scheduling workflows.',
  'web.legal.subprocessors.temporal.data':
    'Workflow inputs limited to identifiers and minimized payloads.',
  'web.legal.subprocessors.polar.label': 'Polar',
  'web.legal.subprocessors.polar.purpose':
    'Merchant of record: checkout, subscriptions, taxes, invoices and refunds.',
  'web.legal.subprocessors.polar.data':
    'Name, email, billing address, payment method held by Polar, and subscription state.',
  'web.legal.subprocessors.deepseek.label': 'DeepSeek',
  'web.legal.subprocessors.deepseek.purpose':
    'Text assistance, translation and transcreation, and planning suggestions.',
  'web.legal.subprocessors.deepseek.data':
    'Only the text you submit to an AI feature and the project context you attached to it.',
  'web.legal.subprocessors.hosting.label': 'Application hosting and content delivery',
  'web.legal.subprocessors.hosting.purpose':
    'Serving the web app, the API and the short link service.',
  'web.legal.subprocessors.hosting.data': 'Request metadata and redacted logs.',
  'web.legal.subprocessors.email.label': 'Transactional email delivery',
  'web.legal.subprocessors.email.purpose':
    'Sign in links, approval requests, publish result notifications and trial reminders.',
  'web.legal.subprocessors.email.data': 'Name, email address and the message content.',
  'web.legal.subprocessors.monitoring.label': 'Error and performance monitoring',
  'web.legal.subprocessors.monitoring.purpose':
    'Diagnosing failures in publishing and in the interface.',
  'web.legal.subprocessors.monitoring.data':
    'Redacted stack traces, request identifiers and workspace identifiers. Post content is stripped.',
  'web.legal.subprocessors.region.pending': 'Region being confirmed',
  'web.legal.subprocessors.vendorPending': 'Vendor being selected',

  'web.legal.retention.column.data': 'Data',
  'web.legal.retention.column.period': 'How long it is kept',
  'web.legal.retention.credentials.label': 'Active platform credentials',
  'web.legal.retention.credentials.period':
    'Encrypted while the connection is active. Revoked at the platform and deleted here as soon as you disconnect.',
  'web.legal.retention.oauthState.label': 'OAuth transaction state',
  'web.legal.retention.oauthState.period': 'Minutes, then deleted.',
  'web.legal.retention.drafts.label': 'Drafts and media',
  'web.legal.retention.drafts.period':
    'While the account is active, or your own retention setting, with a trash grace period.',
  'web.legal.retention.receipts.label': 'Publication receipts and audit events',
  'web.legal.retention.receipts.period':
    'Kept for the plan and legal retention period, minimized, and exportable at any time.',
  'web.legal.retention.rawProvider.label': 'Raw platform responses',
  'web.legal.retention.rawProvider.period':
    'The shortest period needed for debugging and compliance, then minimized or deleted.',
  'web.legal.retention.metrics.label': 'Analytics observations',
  'web.legal.retention.metrics.period':
    'The plan retention period, within what the platform terms allow.',
  'web.legal.retention.securityLogs.label': 'Security logs',
  'web.legal.retention.securityLogs.period':
    'A fixed window between 30 and 180 days depending on the risk of the event.',
  'web.legal.retention.billing.label': 'Billing records',
  'web.legal.retention.billing.period':
    'The statutory accounting retention period, held by Polar and by us.',
  'web.legal.retention.deletedAccount.label': 'A deleted account',
  'web.legal.retention.deletedAccount.period':
    'Credentials revoked and scheduled work cancelled immediately. Full deletion completes within the published window, apart from lawful billing records.',
  'web.legal.retention.backups.label': 'Backups',
  'web.legal.retention.backups.period':
    'Encrypted and access controlled, expiring on a documented rotation. A deletion propagates through the restore process.',

  /* ---------------------------------------------------------------------- */
  /* Footer                                                                  */
  /* ---------------------------------------------------------------------- */

  'web.footer.product': 'Produkt',
  'web.footer.company': 'Företag',
  'web.footer.resources': 'Resurser',
  'web.footer.legal': 'Lagligt',
  'web.footer.developers': 'Utvecklare',
  'web.footer.statement':
    'Relä publicerar endast via officiella plattforms-API:er. Anslutningens tillgänglighet beror på godkännanden som plattformarna kontrollerar, och varje kapacitetsanspråk på den här webbplatsen är daterat och hämtat.',
  'web.footer.noAffiliation':
    'Plattformens namn och märken tillhör deras ägare. Deras användning här identifierar en koppling och innebär inte stöd eller partnerskap.',
  'web.footer.copyright': 'Relä {year}',
} as const;
