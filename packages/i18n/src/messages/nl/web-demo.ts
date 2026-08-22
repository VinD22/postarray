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

  'web.meta.demo.title': 'Bekijk hoe Relay werkt',
  'web.meta.demo.description':
    'Een geleide rondleiding door de publicatieworkflow, van een nieuw project tot de ontvangstbevestiging, getoond in de echte interface met voorbeeldinhoud. Er wordt nog niets gepubliceerd, en de rondleiding laat zien waar die grens ligt.',

  'web.demo.nav.label': 'Zie het in actie',
  'web.demo.nav.summary':
    'Een geleide rondleiding door het product in de volgorde waarin je het tegenkomt, opgebouwd uit de echte interface met voorbeeldinhoud.',

  /* ---------------------------------------------------------------------- */
  /* The frame every demonstration panel sits in                             */
  /* ---------------------------------------------------------------------- */

  'web.demo.frame.badge': 'Demonstratie',
  'web.demo.frame.sample':
    'Een demonstratie opgebouwd uit de echte interface, gevuld met voorbeeldinhoud voor een bedrijf dat niet bestaat. Geen live account. Niets hier dient iets in.',

  'web.demo.control.pause': 'Demonstratie pauzeren',
  'web.demo.control.play': 'Demonstratie afspelen',
  'web.demo.control.replay': 'Demonstratie opnieuw afspelen',

  /* ---------------------------------------------------------------------- */
  /* The home page hero demonstration                                        */
  /* ---------------------------------------------------------------------- */

  'web.demo.hero.caption':
    'Eén concept wordt een versie per platform, krijgt een tijdstip, en landt op de week. Voorbeeldinhoud, geen live account.',
  'web.demo.hero.more': 'Doorloop de hele workflow',

  /* ---------------------------------------------------------------------- */
  /* The walkthrough page                                                    */
  /* ---------------------------------------------------------------------- */

  'web.demo.title': 'Hoe het werkt, in de volgorde waarin je het tegenkomt',
  'web.demo.lede':
    'Negen stappen, van een lege werkruimte tot het verslag van wat er is gebeurd. Elke stap toont het oppervlak waar je echt naar zou kijken, met voorbeeldinhoud erin. Niets op deze pagina beweegt vanzelf, dus je kunt het in je eigen tempo lezen.',
  'web.demo.notice.title': 'Dit is een demonstratie, geen live account',
  'web.demo.notice.body':
    'Elk paneel hier is de productinterface met voorbeeldinhoud erin. Geen enkele connector heeft providerverificatie voltooid, dus er wordt vandaag via dit product niets op een platform gepubliceerd. Waar de workflow stopt, staat dat op de pagina in plaats van de rest te tekenen.',
  'web.demo.contents.title': 'De negen stappen',
  'web.demo.stepLabel': 'Stap {position} van {total}',
  'web.demo.next': 'Volgende: {step}',
  'web.demo.closing.pricing': 'Bekijk wat het kost',
  'web.demo.closing.title': 'Dat is de hele cyclus',
  'web.demo.closing.body':
    'Niets hierboven is een mock-up van een product dat we hopen te bouwen. Het is de interface zoals hij nu is, met de publicatiehelft eerlijk gemarkeerd als onaf.',

  /* ---------------------------------------------------------------------- */
  /* The nine steps                                                          */
  /* ---------------------------------------------------------------------- */

  'web.demo.step.project.title': 'Maak een project',
  'web.demo.step.project.body':
    'Een project bevat accounts, concepten, goedkeuringen en een tijdzone. Elke query in het product is beperkt tot één project, in de toepassingsservice en opnieuw in de database, zodat een klant niet per ongeluk een andere klant kan zien.',

  'web.demo.step.connect.title': 'Koppel een account',
  'web.demo.step.connect.body':
    "Koppelen verloopt alleen via officiële platform-API's, en vertelt je wat het platform van het account vereist voordat je begint. Vandaag stopt elke connector bij verificatie, daarom zegt elke rij hieronder dat in plaats van een groen vinkje te tonen.",

  'web.demo.step.compose.title': 'Schrijf het één keer, pas het per platform aan',
  'web.demo.step.compose.body':
    'Je schrijft een hoofdconcept. Eén account selecteren opent een override voor alleen dat account, met zijn eigen limieten en zijn eigen voorbeeld. Niets wat je voor LinkedIn schrijft, verandert wat X ontvangt, en de controles onder elke versie draaien voordat er iets wordt gepland.',

  'web.demo.step.variants.title': 'Zie wat elk account daadwerkelijk ontvangt',
  'web.demo.step.variants.body':
    'Eén concept wordt één versie per account, elk geschreven voor het platform waar het naartoe gaat: een kortere regel voor X, de volledige releasenota voor LinkedIn, een bijschrift en alt-tekst voor Instagram. Je bewerkt elke versie zonder de andere aan te raken, en elke versie draagt de controle die erop van toepassing is.',

  'web.demo.step.schedule.title': 'Geef het een tijdstip, of geef het aan de wachtrij',
  'web.demo.step.schedule.body':
    'Een tijdstip wordt opgeslagen als een moment plus de tijdzone van het project, nooit als een naïeve lokale tijd, zodat een zomertijdverandering niets onder je verschuift. De wachtrij is de andere route: die neemt het volgende tijdstip dat de regels die je hebt ingesteld toestaan.',

  'web.demo.step.calendar.title': 'Bekijk de kalender',
  'web.demo.step.calendar.body':
    'De week toont het platform, het account, de status en het tijdstip voor elk bericht. Er een verplaatsen kan met een knop en met slepen, dus de kalender is volledig bruikbaar vanaf het toetsenbord.',

  'web.demo.step.receipt.title': 'Lees de ontvangstbevestiging achteraf',
  'web.demo.step.receipt.body':
    'Elke poging schrijft een onveranderlijke ontvangstbevestiging: wie het schreef, wie het goedkeurde, onder welk beleid, op welk moment. De publicatiehelft van dat verslag wordt geschreven door de publicatierun, wat het deel is dat nog niet bestaat.',

  /* ---------------------------------------------------------------------- */
  /* Panel labels                                                            */
  /* ---------------------------------------------------------------------- */

  'web.demo.project.label': 'Project',
  'web.demo.project.zone': 'Tijdzone: {zone}',
  'web.demo.project.scope':
    'Concepten, accounts, goedkeuringen en ontvangstbevestigingen horen bij dit project en nergens anders.',

  'web.demo.accounts.label': 'Accounts in dit project',
  'web.demo.accounts.state': 'Verificatie niet voltooid',
  'web.demo.accounts.note':
    'Elke rij zou de tokenstatus, de verleende rechten en het laatst geslaagde bericht dragen. Geen enkele daarvan kan vandaag publiceren.',

  'web.demo.master.label': 'Hoofdconcept',
  'web.demo.master.project': 'In project {project}',

  'web.demo.variants.label': 'Wat elk account ontvangt',

  'web.demo.schedule.label': 'Gepland',
  'web.demo.schedule.value': '{when} in {zone}',
  'web.demo.schedule.approval':
    'Er is één goedkeuring vereist voordat er iets kan worden verzonden.',
  'web.demo.schedule.queue':
    'De wachtrij is de andere route: die kiest het volgende tijdstip dat je regels toestaan, in deze tijdzone.',

  'web.demo.week.label': 'De week',
  'web.demo.week.caption':
    'Dezelfde drie berichten op de kalender, gelezen in de tijdzone van het project.',
  'web.demo.week.empty': 'Niets gepland',

  'web.demo.receipt.label': 'Ontvangstbevestiging tot nu toe',
  'web.demo.receipt.pending':
    'Wat werd verzonden, wat het platform antwoordde, de externe bericht-id en de permalink worden geschreven door de publicatierun. Ze blijven niet beschikbaar totdat een connector providerverificatie doorstaat.',
  'web.demo.receipt.field.externalId': 'Externe bericht-id',
  'web.demo.receipt.field.permalink': 'Permalink',

  /* ---------------------------------------------------------------------- */
  /* Sample content                                                          */
  /*                                                                         */
  /* Northbound Tools is the sample company the marketing pages already use.  */
  /* Its handles sit on the reserved `.example` domain and its people are     */
  /* first names with no surname, so nothing here can be mistaken for a real  */
  /* customer, a real account or a real endorsement.                          */
  /* ---------------------------------------------------------------------- */

  'web.demo.sample.project': 'Northbound Tools (voorbeeld)',
  'web.demo.sample.actor': 'Ada, voorbeeldteamgenoot',
  'web.demo.sample.approver': 'Ravi, voorbeeldbeoordelaar',
  'web.demo.sample.policy': 'Eén goedkeuring vóór verzending',
  'web.demo.sample.master':
    'Northbound 2.4 is vandaag uit. Imports zijn sneller, zoeken heeft een sneltoets, en de exportbug die twee van jullie meldden is opgelost.',

  'web.demo.sample.x.account': 'X, @northbound',
  'web.demo.sample.x.body':
    'Northbound 2.4 is uit. Snellere imports, zoeken via toetsenbord, en die exportbug is opgelost.',
  'web.demo.sample.x.check': 'Tekentelling en threadvolgorde',

  'web.demo.sample.linkedin.account': 'LinkedIn, Northbound Tools',
  'web.demo.sample.linkedin.body':
    'Northbound 2.4 is vandaag uit. De releasenota legt de importwijzigingen en de exportfix volledig uit.',
  'web.demo.sample.linkedin.check': 'Organisatierol en berichtlengte',

  'web.demo.sample.instagram.account': 'Instagram, @northbound.tools',
  'web.demo.sample.instagram.body':
    'Dezelfde releaseafbeelding, met een bijschrift geschreven voor de feed en alt-tekst geschreven door een persoon.',
  'web.demo.sample.instagram.check': 'Accounttype, beeldverhouding en alt-tekst',

  /* ---------------------------------------------------------------------- */
  /* The nine scene product tour                                             */
  /*                                                                         */
  /* The step names are the indicator's button labels, so they are short      */
  /* enough to sit in a row of nine and specific enough to be worth clicking. */
  /* They are also the labels of the stacked walkthrough a reader gets with   */
  /* reduced motion or no JavaScript, which is the same tour with the timing  */
  /* taken out rather than a reduced version of it.                           */
  /* ---------------------------------------------------------------------- */

  'web.demo.tour.stepsLabel': 'Rondleidingsstappen',
  'web.demo.tour.jump': 'Toon stap {position}: {step}',
  'web.demo.tour.step.project': 'Maak een project',
  'web.demo.tour.step.connect': 'Koppel accounts',
  'web.demo.tour.step.compose': 'Eén keer opstellen',
  'web.demo.tour.step.variants': 'Aanpassen per platform',
  'web.demo.tour.step.validate': 'Controleer het',
  'web.demo.tour.step.schedule': 'Geef het een tijdstip',
  'web.demo.tour.step.week': 'Bekijk de week',
  'web.demo.tour.step.publish': 'Publiceer en registreer',
  'web.demo.tour.step.digest': 'Lees de samenvatting',

  /* ---------------------------------------------------------------------- */
  /* Checks (step 5)                                                         */
  /*                                                                         */
  /* Only checks the composer genuinely runs today: the per account character */
  /* limit (`validation.text_too_long`), alt text on every image             */
  /* (`validation.alt_text_missing`), and whether a first comment is allowed  */
  /* on the account it was written for (the `firstComment` capability).       */
  /* ---------------------------------------------------------------------- */

  'web.demo.validate.label': 'Controles vóór het plannen',
  'web.demo.validate.check.length': 'Tekenlimiet, per account',
  'web.demo.validate.check.lengthDetail':
    'Elke versie wordt gemeten tegen de limiet die het platform dat account geeft.',
  'web.demo.validate.check.altText': 'Alt-tekst op elke afbeelding',
  'web.demo.validate.check.altTextDetail':
    'Een afbeelding zonder omschrijving, of zonder als decoratief gemarkeerd te zijn, stopt de planning.',
  'web.demo.validate.check.firstComment': 'Eerste reactie hier toegestaan',
  'web.demo.validate.check.firstCommentDetail':
    'Een eerste reactie wordt alleen aangeboden op accounts waarvan het platform er een ondersteunt.',
  'web.demo.validate.note':
    'Deze draaien in de opsteller voordat er iets wordt gepland, en opnieuw voordat er iets wordt verzonden.',

  /* ---------------------------------------------------------------------- */
  /* Publish and receipt (step 8)                                            */
  /*                                                                         */
  /* The steps a scheduled post has really passed are completed. Everything   */
  /* the publish run would write is pending, because no connector has passed  */
  /* provider verification, so there is no publish run to write it.           */
  /* ---------------------------------------------------------------------- */

  'web.demo.live.label': 'Publiceren en het verslag ervan',
  'web.demo.live.step.approved': 'Goedgekeurd door {approver}',
  'web.demo.live.step.queued': 'In de wachtrij voor zijn tijdstip',
  'web.demo.live.step.sent': 'Verzonden naar het platform',
  'web.demo.live.step.confirmed': 'Bevestigd door het platform',
  'web.demo.live.badge.pending': 'Niet gepubliceerd',
  'web.demo.live.badge.live': 'Live',
  'web.demo.live.pending':
    'De laatste twee stappen worden geschreven door de publicatierun. Geen enkele connector heeft nog providerverificatie doorstaan, dus ze blijven in behandeling en de externe bericht-id en permalink blijven niet beschikbaar.',

  /* ---------------------------------------------------------------------- */
  /* The weekly digest (step 9)                                              */
  /*                                                                         */
  /* Sentences about what the product did, never engagement figures. There is */
  /* no reach, no impression count and no score here, because the product has */
  /* none to read and a digest that invented one would be a fabricated        */
  /* dashboard with a friendlier voice.                                       */
  /* ---------------------------------------------------------------------- */

  'web.demo.digest.label': 'Je week, in zinnen',
  'web.demo.digest.sample': 'Voorbeeld',
  'web.demo.digest.line.variants':
    'Deze week gingen er drie platform-eigen versies uit vanuit één concept.',
  'web.demo.digest.line.earliest': 'Dinsdagochtend was je vroegste tijdstip.',
  'web.demo.digest.line.approval': 'Elke versie werd goedgekeurd voordat ze in de wachtrij kwam.',
  'web.demo.digest.line.alt': 'Elke afbeelding droeg alt-tekst geschreven door een persoon.',
  'web.demo.digest.footer':
    'Live analyses verschijnen hier zodra je berichten worden gepubliceerd.',

  /* ---------------------------------------------------------------------- */
  /* The three added walkthrough steps                                       */
  /* ---------------------------------------------------------------------- */

  'web.demo.step.validate.title': 'Controleer het voordat het wordt gepland',
  'web.demo.step.validate.body':
    'De opsteller meet elke versie tegen het account waarvoor hij is geschreven: de tekenlimiet die dat account echt heeft, alt-tekst op elke afbeelding, en of het platform überhaupt een eerste reactie aanbiedt. Een versie die een controle niet doorstaat, kan niet worden gepland.',

  'web.demo.step.publish.title': 'Publiceer, en bewaar het verslag',
  'web.demo.step.publish.body':
    'Een publicatierun verzendt elke versie op zijn moment, registreert wat het platform antwoordde, en schrijft een onveranderlijke ontvangstbevestiging. Die run is het deel dat nog niet bestaat, dus de laatste twee stappen hieronder staan in behandeling in plaats van als voltooid getekend.',

  'web.demo.step.digest.title': 'Lees de wekelijkse samenvatting',
  'web.demo.step.digest.body':
    'De samenvatting beschrijft in zinnen wat het product heeft gedaan: hoeveel versies uit één concept gingen, welk tijdstip het vroegst was, wat werd goedgekeurd. Er staan geen betrokkenheidscijfers in, omdat analyses van de platforms komen nadat een bericht is gepubliceerd en er nog niets wordt gepubliceerd.',
} as const;
