/**
 * The in-page product demonstration: the hero demonstration on the home page
 * and the guided walkthrough at `/demo`.
 *
 * Rules that bind this file specifically:
 *
 *  - Every panel on those surfaces is built from the real design system, so a
 *    reader is looking at the interface rather than at a drawing of it. The
 *    copy must therefore never describe something the interface does not do.
 *  - The content is sample content for a company that does not exist, and it
 *    says so in words, in the caption a screen reader reads with the figure.
 *  - No number here is an engagement number. There is no follower count, no
 *    reach figure and no score, because the product has no such data and a
 *    demonstration that invents one is a fabricated dashboard.
 *  - Nothing publishes today. No connector has passed provider verification,
 *    so the demonstration stops at the point the product stops: a scheduled
 *    post, an approval, and a receipt whose publishing half is unavailable.
 *  - The demonstration submits nothing. It has no form, no destination and no
 *    account behind it, and the copy must not suggest otherwise.
 */
export const webDemoMessages = {
  /* ---------------------------------------------------------------------- */
  /* Metadata and navigation                                                 */
  /* ---------------------------------------------------------------------- */

  'web.meta.demo.title': 'Se hur Post Array fungerar',
  'web.meta.demo.description':
    'En guidad rundtur genom publiceringsarbetsflödet, från ett nytt projekt till kvittot, visad i det verkliga gränssnittet med exempelinnehåll. Inget publiceras än, och rundturen visar var den gränsen går.',

  'web.demo.nav.label': 'Se det i action',
  'web.demo.nav.summary':
    'En guidad rundtur genom produkten i den ordning du möter den, byggd av det verkliga gränssnittet med exempelinnehåll.',

  /* ---------------------------------------------------------------------- */
  /* The frame every demonstration panel sits in                             */
  /* ---------------------------------------------------------------------- */

  'web.demo.frame.badge': 'Demonstration',
  'web.demo.frame.sample':
    'En demonstration byggd av det verkliga gränssnittet, fylld med exempelinnehåll för ett företag som inte finns. Inget riktigt konto. Inget här skickar in något.',

  'web.demo.control.pause': 'Pausa demonstrationen',
  'web.demo.control.play': 'Spela upp demonstrationen',
  'web.demo.control.replay': 'Spela upp demonstrationen igen',

  /* ---------------------------------------------------------------------- */
  /* The home page hero demonstration                                        */
  /* ---------------------------------------------------------------------- */

  'web.demo.hero.viewCta': 'Se demon',
  'web.demo.hero.projectsLine':
    'Ett konto driver flera verksamheter. Varje projekt är en egen verksamhet med egna anslutna konton, egen kalender och egna godkännanden, och du växlar mellan dem i en enda meny, som man byter egendom i en sökkonsol.',
  'web.demo.hero.projectsChip': '{count, plural, one {# konto} other {# konton}}',
  'web.demo.hero.caption':
    'Ett utkast blir en version per plattform, får en tid och landar på veckan. Exempelinnehåll, inte ett riktigt konto.',
  'web.demo.hero.more': 'Gå igenom hela arbetsflödet',

  /* ---------------------------------------------------------------------- */
  /* The walkthrough page                                                    */
  /* ---------------------------------------------------------------------- */

  'web.demo.title': 'Hur det fungerar, i den ordning du möter det',
  'web.demo.lede':
    'Nio steg, från en tom arbetsyta till förteckningen över vad som hände. Vart och ett visar ytan du faktiskt skulle titta på, med exempelinnehåll i den. Inget på denna sida rör sig av sig själv, så du kan läsa i din egen takt.',
  'web.demo.notice.title': 'Detta är en demonstration, inte ett riktigt konto',
  'web.demo.notice.body':
    'Varje panel här är produktgränssnittet med exempelinnehåll i sig. Ingen anslutning har klarat leverantörsverifiering, så inget publiceras till någon plattform genom denna produkt idag. Där arbetsflödet stannar säger sidan det i stället för att rita resten.',
  'web.demo.contents.title': 'De nio stegen',
  'web.demo.stepLabel': 'Steg {position} av {total}',
  'web.demo.next': 'Nästa: {step}',
  'web.demo.closing.pricing': 'Se vad det kostar',
  'web.demo.closing.title': 'Det är hela loopen',
  'web.demo.closing.body':
    'Inget ovan är en mockup av en produkt vi hoppas bygga. Det är gränssnittet som det står, med publiceringshalvan ärligt märkt som oavslutad.',

  /* ---------------------------------------------------------------------- */
  /* The nine steps                                                          */
  /* ---------------------------------------------------------------------- */

  'web.demo.step.project.title': 'Skapa ett projekt',
  'web.demo.step.project.body':
    'Ett projekt rymmer konton, utkast, godkännanden och en tidszon. Varje fråga i produkten är begränsad till ett, i applikationstjänsten och igen i databasen, så en kund kan inte se en annan kund av misstag.',

  'web.demo.step.connect.title': 'Anslut ett konto',
  'web.demo.step.connect.body':
    'Anslutning går bara genom officiella plattforms-API:er, och talar om för dig vad plattformen kräver av kontot innan du börjar. Idag stannar varje anslutning vid verifiering, vilket är varför varje rad nedan säger det i stället för att visa en grön bock.',

  'web.demo.step.compose.title': 'Skriv det en gång, anpassa det per plattform',
  'web.demo.step.compose.body':
    'Du skriver ett huvudutkast. Att välja ett konto öppnar en override för bara det kontot, med sina egna gränser och sin egen förhandsgranskning. Inget du skriver för LinkedIn ändrar vad X får, och kontrollerna under varje version körs innan något schemaläggs.',

  'web.demo.step.variants.title': 'Se vad varje konto faktiskt får',
  'web.demo.step.variants.body':
    'Ett utkast blir en version per konto, var och en skriven för plattformen den går till: en kortare rad för X, hela releaseanteckningen för LinkedIn, en bildtext och alt-text för Instagram. Du redigerar vilken som helst utan att röra de andra, och varje version bär kontrollen som gäller för den.',

  'web.demo.step.schedule.title': 'Ge det en tid, eller lämna det till kön',
  'web.demo.step.schedule.body':
    'En tid lagras som ett ögonblick plus projektets tidszon, aldrig som en naiv lokal tid, så en sommartidsändring flyttar inget under dig. Kön är den andra vägen: den tar nästa plats som dina regler tillåter.',

  'web.demo.step.calendar.title': 'Titta på kalendern',
  'web.demo.step.calendar.body':
    'Veckan visar plattformen, kontot, status och tiden för varje inlägg. Att flytta ett är lika mycket en knapp som en dragning, så kalendern är helt användbar från tangentbordet.',

  'web.demo.step.receipt.title': 'Läs kvittot efteråt',
  'web.demo.step.receipt.body':
    'Varje försök skriver ett oföränderligt kvitto: vem som skrev det, vem som godkände det, under vilken policy, vid vilket ögonblick. Publiceringshalvan av det registret skrivs av publiceringskörningen, vilket är delen som inte finns än.',

  /* ---------------------------------------------------------------------- */
  /* Panel labels                                                            */
  /* ---------------------------------------------------------------------- */

  'web.demo.project.label': 'Projekt',
  'web.demo.project.zone': 'Tidszon: {zone}',
  'web.demo.project.scope':
    'Utkast, konton, godkännanden och kvitton hör till detta projekt och ingen annanstans.',

  'web.demo.accounts.label': 'Konton i detta projekt',
  'web.demo.accounts.state': 'Verifiering inte klar',
  'web.demo.accounts.note':
    'Varje rad skulle bära tokenhälsa, beviljade behörigheter och det senaste lyckade inlägget. Ingen av dem kan publicera idag.',

  'web.demo.master.label': 'Huvudutkast',
  'web.demo.master.project': 'I projektet {project}',

  'web.demo.variants.label': 'Vad varje konto får',

  'web.demo.schedule.label': 'Schemalagd',
  'web.demo.schedule.value': '{when} i {zone}',
  'web.demo.schedule.approval': 'Ett godkännande krävs innan något kan skickas.',
  'web.demo.schedule.queue':
    'Kön är den andra vägen: den väljer nästa plats dina regler tillåter, i denna tidszon.',

  'web.demo.week.label': 'Veckan',
  'web.demo.week.caption': 'Samma tre inlägg i kalendern, lästa i projektets tidszon.',
  'web.demo.week.empty': 'Inget schemalagt',

  'web.demo.receipt.label': 'Kvitto hittills',
  'web.demo.receipt.pending':
    'Vad som skickades, vad plattformen svarade, det externa inläggs-id:t och permalänken skrivs av publiceringskörningen. De förblir otillgängliga tills en anslutning klarar leverantörsverifiering.',
  'web.demo.receipt.field.externalId': 'Externt inläggs-id',
  'web.demo.receipt.field.permalink': 'Permalänk',

  /* ---------------------------------------------------------------------- */
  /* Sample content                                                          */
  /*                                                                         */
  /* Northbound Tools is the sample company the marketing pages already use.  */
  /* Its handles sit on the reserved `.example` domain and its people are     */
  /* first names with no surname, so nothing here can be mistaken for a real  */
  /* customer, a real account or a real endorsement.                          */
  /* ---------------------------------------------------------------------- */

  'web.demo.sample.project': 'Northbound Tools (exempel)',
  'web.demo.sample.actor': 'Ada, exempelkollega',
  'web.demo.sample.approver': 'Ravi, exempelgranskare',
  'web.demo.sample.policy': 'Ett godkännande före sändning',
  'web.demo.sample.master':
    'Northbound 2.4 släpps idag. Importer är snabbare, sökning har en tangentbordsgenväg, och exportfelet två av er rapporterade är fixat.',

  'web.demo.sample.x.account': 'X, @northbound',
  'web.demo.sample.x.body':
    'Northbound 2.4 är ute. Snabbare importer, tangentbordssökning, och det exportfelet är fixat.',
  'web.demo.sample.x.check': 'Teckenräkning och trådordning',

  'web.demo.sample.linkedin.account': 'LinkedIn, Northbound Tools',
  'web.demo.sample.linkedin.body':
    'Northbound 2.4 släpps idag. Releaseanteckningen förklarar importändringarna och exportfixen i sin helhet.',
  'web.demo.sample.linkedin.check': 'Organisationsroll och inläggslängd',

  'web.demo.sample.instagram.account': 'Instagram, @northbound.tools',
  'web.demo.sample.instagram.body':
    'Samma releasebild, med en bildtext skriven för flödet och alt-text skriven av en person.',
  'web.demo.sample.instagram.check': 'Kontotyp, bildförhållande och alt-text',

  /* ---------------------------------------------------------------------- */
  /* The nine scene product tour                                             */
  /*                                                                         */
  /* The step names are the indicator's button labels, so they are short      */
  /* enough to sit in a row of nine and specific enough to be worth clicking. */
  /* They are also the labels of the stacked walkthrough a reader gets with   */
  /* reduced motion or no JavaScript, which is the same tour with the timing  */
  /* taken out rather than a reduced version of it.                           */
  /* ---------------------------------------------------------------------- */

  'web.demo.tour.stepsLabel': 'Rundturssteg',
  'web.demo.tour.jump': 'Visa steg {position}: {step}',
  'web.demo.tour.step.project': 'Skapa ett projekt',
  'web.demo.tour.step.connect': 'Anslut konton',
  'web.demo.tour.step.compose': 'Skriv en gång',
  'web.demo.tour.step.variants': 'Anpassa per plattform',
  'web.demo.tour.step.validate': 'Kontrollera det',
  'web.demo.tour.step.schedule': 'Ge det en tid',
  'web.demo.tour.step.week': 'Se veckan',
  'web.demo.tour.step.publish': 'Publicera och registrera',
  'web.demo.tour.step.digest': 'Läs sammanfattningen',

  /* ---------------------------------------------------------------------- */
  /* Checks (step 5)                                                         */
  /*                                                                         */
  /* Only checks the composer genuinely runs today: the per account character */
  /* limit (`validation.text_too_long`), alt text on every image             */
  /* (`validation.alt_text_missing`), and whether a first comment is allowed  */
  /* on the account it was written for (the `firstComment` capability).       */
  /* ---------------------------------------------------------------------- */

  'web.demo.validate.label': 'Kontroller före schemaläggning',
  'web.demo.validate.check.length': 'Teckengräns, per konto',
  'web.demo.validate.check.lengthDetail':
    'Varje version mäts mot gränsen plattformen ger det kontot.',
  'web.demo.validate.check.altText': 'Alt-text på varje bild',
  'web.demo.validate.check.altTextDetail':
    'En bild utan beskrivning, eller utan att vara markerad som dekorativ, stoppar schemaläggningen.',
  'web.demo.validate.check.firstComment': 'Första kommentar tillåten här',
  'web.demo.validate.check.firstCommentDetail':
    'En första kommentar erbjuds bara på konton vars plattform stöder en sådan.',
  'web.demo.validate.note':
    'Dessa körs i redigeraren innan något schemaläggs, och igen innan något skickas.',

  /* ---------------------------------------------------------------------- */
  /* Publish and receipt (step 8)                                            */
  /*                                                                         */
  /* The steps a scheduled post has really passed are completed. Everything   */
  /* the publish run would write is pending, because no connector has passed  */
  /* provider verification, so there is no publish run to write it.           */
  /* ---------------------------------------------------------------------- */

  'web.demo.live.label': 'Publicering och dess register',
  'web.demo.live.step.approved': 'Godkänd av {approver}',
  'web.demo.live.step.queued': 'Köad för sin plats',
  'web.demo.live.step.sent': 'Skickad till plattformen',
  'web.demo.live.step.confirmed': 'Bekräftad av plattformen',
  'web.demo.live.badge.pending': 'Inte publicerad',
  'web.demo.live.badge.live': 'Live',
  'web.demo.live.pending':
    'De sista två stegen skrivs av publiceringskörningen. Ingen anslutning har klarat leverantörsverifiering än, så de förblir väntande och det externa inläggs-id:t och permalänken förblir otillgängliga.',

  /* ---------------------------------------------------------------------- */
  /* The weekly digest (step 9)                                              */
  /*                                                                         */
  /* Sentences about what the product did, never engagement figures. There is */
  /* no reach, no impression count and no score here, because the product has */
  /* none to read and a digest that invented one would be a fabricated        */
  /* dashboard with a friendlier voice.                                       */
  /* ---------------------------------------------------------------------- */

  'web.demo.digest.label': 'Din vecka, i meningar',
  'web.demo.digest.sample': 'Exempel',
  'web.demo.digest.line.variants':
    'Tre plattformsanpassade versioner gick ut från ett utkast denna vecka.',
  'web.demo.digest.line.earliest': 'Tisdag morgon var din tidigaste plats.',
  'web.demo.digest.line.approval': 'Varje version godkändes innan den köades.',
  'web.demo.digest.line.alt': 'Varje bild bar alt-text skriven av en person.',
  'web.demo.digest.footer': 'Live-analys visas här när dina inlägg publiceras.',

  /* ---------------------------------------------------------------------- */
  /* The three added walkthrough steps                                       */
  /* ---------------------------------------------------------------------- */

  'web.demo.step.validate.title': 'Kontrollera det innan det schemaläggs',
  'web.demo.step.validate.body':
    'Redigeraren mäter varje version mot kontot den är skriven för: teckengränsen det kontot faktiskt har, alt-text på varje bild, och om plattformen alls erbjuder en första kommentar. En version som inte klarar en kontroll kan inte schemaläggas.',

  'web.demo.step.publish.title': 'Publicera, och behåll registret',
  'web.demo.step.publish.body':
    'En publiceringskörning skickar varje version vid sitt ögonblick, registrerar vad plattformen svarade, och skriver ett oföränderligt kvitto. Den körningen är delen som inte finns än, så de sista två stegen nedan är väntande i stället för ritade som klara.',

  'web.demo.step.digest.title': 'Läs den veckovisa sammanfattningen',
  'web.demo.step.digest.body':
    'Sammanfattningen beskriver vad produkten gjorde i meningar: hur många versioner som gick ut från ett utkast, vilken plats som var tidigast, vad som godkändes. Den bär inga engagemangssiffror, eftersom analys kommer från plattformarna efter att ett inlägg publiceras och inget publiceras än.',
} as const;
