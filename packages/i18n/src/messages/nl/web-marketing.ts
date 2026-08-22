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

  'web.brand.name': 'Relay',
  'web.brand.tagline': 'Het meertalige publicatiecontrolevlak voor mensen en agenten.',
  'web.skipToContent': 'Ga naar de hoofdinhoud',
  'web.nav.label': 'Sitenavigatie',
  'web.nav.openMenu': 'Menukaart',
  'web.nav.closeMenu': 'Sluit het menu',
  'web.nav.footerLabel': 'Voettekstnavigatie',

  'web.cta.startTrial': 'Start de proefperiode van 7 dagen',
  'web.cta.seePricing': 'Zie de prijs',
  'web.cta.seeCapabilities': 'Lees de capaciteitenmatrix',
  'web.cta.readDocs': 'Lees de documentatie',
  'web.cta.trialFootnote':
    'Polar collects a payment method, charges $0 today, and shows the exact first charge date before you confirm.',

  'web.label.lastReviewed': 'Laatst beoordeeld {date}',
  'web.label.nextReview': 'Volgende recensie {date}',
  'web.label.researchDate': 'Onderzoek gedaan naar {date}',
  'web.label.officialSource': 'Officiële bron',
  'web.label.onThisPage': 'Op deze pagina',
  'web.label.provider': 'Platform',
  'web.label.capability': 'Vermogen',

  'web.notFound.title': 'Er is geen pagina op dit adres',
  'web.notFound.body':
    "Het kan zijn dat de link verouderd is, of dat we de pagina buiten gebruik hebben gesteld. Pagina's die niet meer accuraat zijn, worden verwijderd in plaats van achtergelaten, en de changelog registreert dit wanneer dat gebeurt.",
  'web.notFound.action': 'Ga naar de startpagina',

  'web.correction.title': 'Er is iets misgegaan op deze pagina',
  'web.correction.body':
    'Platformregels veranderen en we maken dingen verkeerd. Stuur de URL en wat er niet klopt, en wij zullen de pagina corrigeren of verwijderen.',
  'web.correction.email': 'correcties@relay.voorbeeld',

  /* ---------------------------------------------------------------------- */
  /* Metadata                                                                */
  /* ---------------------------------------------------------------------- */

  'web.meta.home.title': 'Relay, het meertalige publicatiecontrolevlak',
  'web.meta.home.description':
    "Zet een idee om in platform-native content, keur het één keer goed, publiceer het op betrouwbare wijze via officiële platform-API's en ontdek wat u vervolgens kunt verbeteren.",
  'web.meta.product.title': 'Hoe Relay werkt',
  'web.meta.product.description':
    'Een wandeling door de uitgeefdesk: één keer opstellen, per platform aanpassen, valideren tegen de echte limieten, goedkeuren, plannen, publiceren en de bon bewaren.',
  'web.meta.integrations.title': 'Platforms Relay publiceert naar',
  'web.meta.integrations.description':
    'Met welke platforms Relay verbinding maakt, wat elke verbinding vandaag de dag kan doen en wat het platform zelf niet toestaat.',
  'web.meta.capabilities.title': 'Matrix voor connectormogelijkheden',
  'web.meta.capabilities.description':
    'Een tabel per platform, per mogelijkheden, gegenereerd op basis van onze connectordefinities, waarin wordt gescheiden wat we hebben gebouwd en wat het platform niet biedt.',
  'web.meta.creators.title': 'Relay voor makers',
  'web.meta.creators.description':
    'Voor solo-makers die hetzelfde idee in verschillende formaten en talen publiceren zonder het vijf keer te herschrijven.',
  'web.meta.agencies.title': 'Relay voor agentschappen',
  'web.meta.agencies.description':
    'Klantscheiding, goedkeuringen, deelbare recensielinks, ontvangstbewijzen en rapportage voor teams die namens andere mensen publiceren.',
  'web.meta.developers.title': 'Relay voor ontwikkelaars',
  'web.meta.developers.description':
    'Eén backend achter de webapp, de REST API, een externe MCP-server, de CLI en ondertekende webhooks. Op elke ondergrond dezelfde goedkeuringsregels.',
  'web.meta.pricing.title': 'Pricing',
  'web.meta.pricing.description':
    'One plan. $29 a month, or $300 a year which is $25 a month billed annually. 30 active channels, unlimited team members, no feature tiers.',
  'web.meta.resources.title': 'Hulpbronnen',
  'web.meta.resources.description':
    'Status, changelog, documentatie, methodologie, vergelijkingen, de toolradar en de kansencatalogus.',
  'web.meta.status.title': 'Status',
  'web.meta.status.description':
    'Huidige status van elk Relay-oppervlak en elke connector, plus de incidentgeschiedenis.',
  'web.meta.changelog.title': 'Wijzigingslog',
  'web.meta.changelog.description':
    'Wat is er verzonden, wat is er veranderd voor connectoren en wat is gecorrigeerd.',
  'web.meta.docs.title': 'Documentatie',
  'web.meta.docs.description':
    'REST API, MCP-server, CLI en webhook-documentatie voor het bouwen op Relay.',
  'web.meta.methodology.title': 'Methodologie',
  'web.meta.methodology.description':
    'Hoe we platformclaims onderzoeken, hoe we ze dateren, hoe we andere producten vergelijken en hoe we fouten corrigeren.',
  'web.meta.compare.title': 'Vergelijkingen',
  'web.meta.compare.description':
    'Eerlijke, gedateerde vergelijkingen met andere publicatietools, inclusief voor wie ze het beste zijn.',
  'web.meta.toolRadar.title': 'Creatieve gereedschapsradar',
  'web.meta.toolRadar.description':
    'Een gedateerde, redactioneel beoordeelde catalogus van gespecialiseerde creatieve tools, met beperkingen, rechtenvoorbehouden en commerciële openbaarmaking.',
  'web.meta.opportunities.title': 'Promotiemogelijkheden',
  'web.meta.opportunities.description':
    'Een samengestelde catalogus met plaatsen waar een product kan worden vermeld, gelanceerd of besproken, met voor elke bestemming eigen indieningsregels.',
  'web.meta.legal.title': 'Juridisch en beleid',
  'web.meta.legal.description':
    'Voorwaarden, privacy, acceptabel gebruik, AI-gebruik, cookies, subverwerkers, restituties, auteursrecht, beveiliging, toegankelijkheid, ontwikkelaarsvoorwaarden en affiliatevoorwaarden.',

  /* ---------------------------------------------------------------------- */
  /* Home                                                                    */
  /* ---------------------------------------------------------------------- */

  'web.home.promise':
    'Zet een idee uit een bron om in platform-native content, keur het één keer goed, publiceer het op betrouwbare wijze en ontdek wat u vervolgens kunt verbeteren.',
  'web.home.lede':
    "Relay is een uitgeefbureau voor mensen die verantwoordelijk zijn voor wat er uitgaat. Je schrijft één keer, past je aan per platform, ziet de echte limieten voordat je plant, krijgt de goedkeuring die je nodig hebt, publiceert via officiële platform-API's en bewaart een ontvangstbewijs voor elk bericht.",
  'web.home.summaryLine':
    'One plan at $29 a month or $300 a year. 30 active social channels, unlimited team members, no feature tiers. The seven day trial collects a payment method and charges $0 at checkout.',

  'web.home.example.title': 'Eén idee, vijf platform-native versies',
  'web.home.example.body':
    'De componist begint met een masterversie. Als u één account selecteert, wordt er alleen voor dat account een overschrijving geopend, met zijn eigen livelimieten en zijn eigen voorbeeld. Niets wat u voor LinkedIn schrijft, verandert wat X ontvangt.',
  'web.home.example.column.account': 'Rekening',
  'web.home.example.column.variant': 'Wat deze rekening ontvangt',
  'web.home.example.column.check': 'Gecontroleerd vóór de planning',
  'web.home.example.caption':
    'Een illustratieve compositie. De weergegeven limieten en instellingen zijn afkomstig van de connectordefinitie voor elk platform, en niet van een schatting.',
  'web.home.example.x.account': 'X, @noordwaarts',
  'web.home.example.x.variant': 'Hoofdtekst, ingekort, plus een thread met twee berichten',
  'web.home.example.x.check':
    'Aantal tekens, volgorde van threads, geschatte API-kosten voor een linkpost',
  'web.home.example.linkedin.account': 'LinkedIn, Northbound Tools',
  'web.home.example.linkedin.variant': 'Langere hoofdtekst met het document als bijlage',
  'web.home.example.linkedin.check': 'Organisatierol, berichtlengte, documenttype',
  'web.home.example.instagram.account': 'Instagram, @northbound.tools',
  'web.home.example.instagram.variant':
    'Vierkant uitsnede van dezelfde afbeelding, onderschrift herschreven voor de feed',
  'web.home.example.instagram.check':
    'Professioneel accounttype, beeldverhouding, alt-tekst aanwezig',
  'web.home.example.youtube.account': 'YouTube, Noordwaarts',
  'web.home.example.youtube.variant':
    'Dezelfde clip als een Short, met een eigen titel en beschrijving',
  'web.home.example.youtube.check':
    'Uploadbereik, auditstatus en privacy waarin de upload terechtkomt',
  'web.home.example.bluesky.account': 'Bluesky, noordwaarts.voorbeeld',
  'web.home.example.bluesky.variant': 'Hoofdtekst met de linkkaart',
  'web.home.example.bluesky.check': 'Aantal tekens, resolutie van de linkkaart, alt-tekst aanwezig',

  'web.home.pillars.title': 'Waar Relay is gebouwd om goed in te zijn',
  'web.home.pillars.confidence.title': 'Publiceer met vertrouwen',
  'web.home.pillars.confidence.body':
    'Een echte preview per account, deterministisch beleid en platformcontroles voordat er iets in de wachtrij wordt geplaatst, de goedkeuring die uw werkruimte vereist, een onveranderlijke bon met de externe post-ID en een gezondheidsstatus voor elke verbinding.',
  'web.home.pillars.confidence.proof':
    'Elke externe schrijfbewerking bevat een idempotency-sleutel, dus een crash van een werker nadat het platform een bericht heeft geaccepteerd, creëert geen tweede.',
  'web.home.pillars.adapt.title': 'Aanpassen in plaats van dupliceren',
  'web.home.pillars.adapt.body':
    'Varianten per platform waarmee u één account tegelijk kunt overschrijven, en transcreatie in plaats van letterlijke vertaling, met een projectwoordenlijst en een benoemde recensent per taal.',
  'web.home.pillars.adapt.proof':
    'De interface is beschikbaar in geselecteerde talen. Inhoudsaanpassing omvat 30 inhoudstalen en elk daarvan kan worden beoordeeld voordat het wordt gepubliceerd.',
  'web.home.pillars.loop.title': 'Sluit de lus',
  'web.home.pillars.loop.body':
    'Analytics die de statistiek een naam geven, het platform dat deze heeft gerapporteerd, de noemer en wanneer deze voor het laatst is vernieuwd. Waar een platform iets niet rapporteert, zegt Relay dat in plaats van een nul te tonen.',
  'web.home.pillars.loop.proof':
    'Een bericht wordt vergeleken met uw eigen mediaan in plaats van met een score die niemand kan controleren.',
  'web.home.pillars.anywhere.title': 'Werk vanuit waar je al bent',
  'web.home.pillars.anywhere.body':
    'De webapp, een REST API, een externe MCP-server, een CLI en ondertekende webhooks roepen dezelfde applicatieservices, dezelfde autorisatieregels en dezelfde validators aan.',
  'web.home.pillars.anywhere.proof':
    'Een agent kan een goedkeuringsbeleid niet omzeilen door een ander oppervlak te gebruiken, omdat het beleid wordt afgedwongen in de service en niet in de interface.',
  'web.home.pillars.economics.title': 'Economics you can predict',
  'web.home.pillars.economics.body':
    'One price, every shipped feature, 30 active channels and unlimited team members. Platform usage that a provider charges per operation is passed through at cost and shown before you confirm the action.',
  'web.home.pillars.economics.proof':
    'There is no image or video generation credit system, because Relay does not generate media.',

  'web.home.honest.title': 'Wat Relay niet doet',
  'web.home.honest.lede':
    'Dit zijn grenzen, geen plagerij van een routekaart. Als een van deze verandert, verandert dit eerst in de changelog.',
  'web.home.honest.noMedia':
    'Geen AI-beeldgeneratie en geen AI-videogeneratie. Relay past, keurt, publiceert en meet de media die u inbrengt.',
  'web.home.honest.noAutomationOfEngagement':
    'Geen automatische likes, volgers, reposts, ongevraagde antwoorden of directe berichten. Geen verlovingspods en geen verzonnen verloving.',
  'web.home.honest.noUnofficial':
    "Geen browserautomatisering, geen herhaling van cookies, geen scraping en geen onofficiële eindpunten voor het plaatsen van berichten. Alleen officiële platform-API's.",
  'web.home.honest.noPromises':
    'Geen belofte over bereik, ranking of betrokkenheid. Relay kan u vertellen wat er is gebeurd en wat u vervolgens moet testen. Het kan je niet vertellen wat een publiek zal doen.',
  'web.home.honest.noUnattendedPublishing':
    'Standaard geen publicatie zonder toezicht. Een agent kan een document opstellen, valideren en goedkeuring aanvragen. Een mens beslist voordat er iets openbaar wordt, tenzij je bewust afziet van een specifiek beleid.',

  'web.home.surfaces.title': 'Vijf oppervlakken, één backend',
  'web.home.surfaces.body':
    "Dezelfde gebruiksscenario's, dezelfde huurcontroles, dezelfde validators en dezelfde publicatieworkflows. Een oppervlak is een manier om binnen te komen, nooit een sluiproute langs een regel.",
  'web.home.surfaces.web': 'Web-app',
  'web.home.surfaces.webBody':
    'Composer, kalender, goedkeuringen, analyses, verbindingen en instellingen.',
  'web.home.surfaces.api': 'REST-API',
  'web.home.surfaces.apiBody':
    'Scoped-sleutels, idempotentie-sleutels bij elke schrijfbewerking, cursorpaginering, getypte fouten.',
  'web.home.surfaces.mcp': 'Externe MCP-server',
  'web.home.surfaces.mcpBody':
    'Streambare HTTP, OAuth, per toolbereik en een voorbeeld vóór elke vervolgaanroep.',
  'web.home.surfaces.cli': 'CLI',
  'web.home.surfaces.cliBody':
    'Stabiele machineleesbare uitvoer voor scripts en continue integratie.',
  'web.home.surfaces.webhooks': 'Ondertekende webhooks',
  'web.home.surfaces.webhooksBody':
    'Publiceer resultaten, goedkeuringsbeslissingen en verbindingsstatus, met herlevering.',

  'web.home.closing.title': 'Begin met één account en één bericht',
  'web.home.closing.body':
    'Koppel één account, stel één bericht op, bekijk de validatierun, plan deze in en lees de ontvangstbevestiging. Dat is het hele product in ongeveer tien minuten.',

  'web.home.v2.heroTemplate': 'Native posts in je Brand-stijl voor {platform}.',
  'web.home.v2.sticker.trial': 'Proefperiode van 7 dagen',
  'web.home.v2.sticker.official': "Alleen officiële API's",
  'web.home.v2.marqueeCaption': "Alleen officiële API's.",
  'web.home.v2.surfacesStat': 'Oppervlakken op één gedeelde backend',
  'web.home.v2.pricingTeaser.title': 'Wat het kost',
  'web.home.v2.variantScene.masterLabel': 'Hoofdconcept',
  'web.home.v2.variantScene.progress': '{revealed} van {total}',

  /* ---------------------------------------------------------------------- */
  /* Product                                                                 */
  /* ---------------------------------------------------------------------- */

  'web.product.title': 'De uitgeverij',
  'web.product.lede':
    'Bij elke stap moeten zeven vragen worden beantwoord zonder ergens op te klikken: wat wordt er gepost, waar, welke versie elk account ontvangt, wanneer en in welke tijdzone, wie het heeft goedgekeurd, wat het mag kosten en wat er is gebeurd.',

  'web.product.step.source.title': 'Bron',
  'web.product.step.source.body':
    'Begin met een briefing, een bestand dat u al heeft, een RSS-item of een verzoek van een agent. Geïmporteerde media behouden de herkomst die u eraan hebt gegeven, inclusief waar het vandaan komt en wie de rechten bezit.',
  'web.product.step.compose.title': 'Eén keer opstellen en vervolgens overschrijven',
  'web.product.step.compose.body':
    'Een masterversie stuurt elk doel aan. Als u één account selecteert, wordt er alleen een overschrijving voor dat account geopend: zijn eigen tekst, zijn eigen media-uitsnede, zijn eigen instellingen, zijn eigen livelimietteller en zijn eigen voorbeeld. Het resetten van een override herstelt de master in één handeling en toont u als eerste het verschil.',
  'web.product.step.validate.title': 'Valideer voordat er iets in de wachtrij wordt geplaatst',
  'web.product.step.validate.body':
    'Validatie is deterministisch en draait op de server. Het controleert de platformlimieten op basis van de momentopname van de versiebeheermogelijkheden, het accounttype, alternatieve tekst, mediarechten, duplicaat- en cadansregels, vermeldings- en bestemmingsresolutie en de geschatte platformgebruikskosten. Bij elk probleem wordt het doel genoemd waartoe het behoort en hoe dit kan worden opgelost.',
  'web.product.step.approve.title': 'Eén keer goedkeuren',
  'web.product.step.approve.body':
    'Goedkeuring is een werkruimtebeleid, geen gewoonte. Een reviewer ziet elk doel, elke variant, de tijdzone, de privacystatus en de geschatte kosten op één scherm en het werkt op een telefoon. Voor inhoud die na goedkeuring is gewijzigd, is opnieuw goedkeuring vereist.',
  'web.product.step.schedule.title': 'Plan in een realtimezone',
  'web.product.step.schedule.body':
    'Elke geplande post slaat een moment en een IANA-tijdzone op, nooit een naïeve lokale tijd. Zomertijdovergangen worden weergegeven voordat u bevestigt, en niet achteraf ontdekt.',
  'web.product.step.publish.title': 'Publiceer en bewaar de kassabon',
  'web.product.step.publish.body':
    'Elk doelwit wordt verzonden met een idempotentiesleutel. Een doel dat faalt, draait een doel dat wel slaagde niet terug, en die staat heeft zijn eigen naam: gedeeltelijk gepubliceerd. Elk resultaat levert een onveranderlijk ontvangstbewijs op met de externe post-ID, de verzoek-ID, de pogingsgeschiedenis en de exacte fout als die er was.',
  'web.product.step.learn.title': 'Leer',
  'web.product.step.learn.body':
    'Metrieken worden genormaliseerd, benoemd, toegeschreven aan het platform dat ze heeft gerapporteerd en voorzien van een versheidstijd. Een statistiek die een platform niet rapporteert, wordt met de reden gemarkeerd als niet beschikbaar. Het wordt nooit weergegeven als een nul.',

  'web.product.shot.caption':
    'Schermafbeeldingen op deze pagina zijn gemaakt van het actieve product. Totdat een oppervlak compleet genoeg is om eerlijk te fotograferen, beschrijven we het met woorden in plaats van er een tekening van te maken.',
  'web.product.shot.pending': 'Screenshot in afwachting van opname',
  'web.product.shot.pendingReason':
    'Dit oppervlak wordt nog steeds gebouwd. We zullen een echte opname publiceren in plaats van een illustratie.',

  'web.product.states.title': 'De staten waar niemand graag ontwerpt',
  'web.product.states.body':
    'Een publicatietool wordt beoordeeld op de slechte dag, niet op de goede. Elk van deze heeft een ontworpen scherm, een duidelijke zin en een volgende actie.',
  'web.product.states.partial':
    'Gedeeltelijk gepubliceerd: welke doelstellingen zijn live, welke zijn mislukt en waarom.',
  'web.product.states.revoked':
    'Een ingetrokken token gevonden op het moment van verzending, met het pad voor opnieuw verbinden.',
  'web.product.states.rateLimited':
    'Een platformsnelheidslimiet, met wanneer deze wordt gereset en wat erachter in de wachtrij staat.',
  'web.product.states.duplicate':
    'Een duplicaat- of cadansblok, met de regel die heeft geschoten en het beroepspad.',
  'web.product.states.offline':
    'Offline tijdens het componeren: niets wat je hebt geschreven gaat verloren.',
  'web.product.states.permission':
    'Een actie die uw rol niet toestaat, met vermelding van de rol die dat wel doet.',

  /* ---------------------------------------------------------------------- */
  /* Integrations and capability matrix                                      */
  /* ---------------------------------------------------------------------- */

  'web.integrations.title': 'Platformen',
  'web.integrations.lede':
    "Relay maakt verbinding via officiële platform-API's. Elke connector heeft een genoemde eigenaar, een vastgelegde beleids-URL en een beoordelingsdatum. Een connector wordt pas vermeld als ondersteund als deze voldoet aan de connectordefinitie 'klaar'.",
  'web.integrations.reviewNotice.title':
    'Geen enkele connector wordt als officieel omschreven voordat het platform deze heeft goedgekeurd',
  'web.integrations.reviewNotice.body':
    'Verschillende platforms vereisen een app-beoordeling voordat een applicatie namens een klant mag publiceren. Waar die beoordeling uitstekend is, zegt de connector dat en beschrijft precies wat er beperkt is totdat het slaagt.',
  'web.integrations.accountTypes': 'Accounttypen waarnaar deze connector kan publiceren',
  'web.integrations.restriction': 'Beperking die u moet kennen voordat u verbinding maakt',
  'web.integrations.cost': 'Kosten voor platformgebruik',
  'web.integrations.viewMatrix': 'Bekijk alle mogelijkheden voor dit platform',

  'web.capabilities.title': 'Matrix voor connectormogelijkheden',
  'web.capabilities.lede':
    'Gegenereerd op basis van dezelfde connectordefinities die het product leest en vervolgens door iemand wordt beoordeeld vóór publicatie. Marketing kan niet iets beloven wat een adapter niet kan doen.',
  'web.capabilities.legend.title': 'Hoe deze tabel te lezen',
  'web.capabilities.legend.body':
    'Vier staten, en het verschil tussen de middelste twee doet ertoe. Nog niet opgebouwd is onze achterstand. Niet aangeboden door het platform is een feit over het platform waar geen enkele tool omheen kan.',
  'web.capabilities.tableCaption':
    'Mogelijkheden per platform. Elke cel noemt zijn toestand zowel in woorden als in kleur.',
  'web.capabilities.snapshot': 'Connectordefinities versie {version}, beoordeeld {date}',
  'web.capabilities.sourceNote':
    'Elke platformclaim in deze tabel linkt naar de officiële documentatie waar deze vandaan komt en de datum waarop we deze voor het laatst hebben gelezen.',

  /* ---------------------------------------------------------------------- */
  /* Audience pages                                                          */
  /* ---------------------------------------------------------------------- */

  'web.creators.title': 'Voor makers',
  'web.creators.lede':
    'Je publiceert hetzelfde idee in verschillende formaten, soms in meer dan één taal, en je bent het hele team. Het werk dat Relay uit handen neemt, is het overtypen, het opnieuw bijsnijden en het controleren.',
  'web.creators.job.adapt.title': 'Schrijf het één keer, verzend vijf native versies',
  'web.creators.job.adapt.body':
    'De masterversie draagt het idee over. Elk account krijgt de lengte, de uitsnede, de instellingen en de toon die het platform verwacht, en je kunt ze allemaal naast elkaar zien voordat je een commit maakt.',
  'web.creators.job.languages.title': 'Publiceer in een andere taal zonder te raden',
  'web.creators.job.languages.body':
    'Transcreatie houdt de intentie vast in plaats van de woorden, gebruikt de woordenlijst van uw project en geeft aan of een native recensent het heeft gelezen. Er wordt niets gepubliceerd in een taal waar u niet voor kunt instaan, tenzij u het zegt.',
  'web.creators.job.rights.title': 'Bewaar uw rechtenregistratie bij het bestand',
  'web.creators.job.rights.body':
    'Media geven aan waar het vandaan komt, wie de rechten heeft en of het met een generatief hulpmiddel is gemaakt. Platformen vragen er steeds meer om. Relay slaat uw antwoord op bij het item in plaats van u opnieuw te vragen.',
  'web.creators.job.cost.title': 'Ken de kosten voordat u post',
  'web.creators.job.cost.body':
    'X brengt kosten in rekening per bewerking en brengt meer in rekening voor een bericht met een URL. Relay schat dat voordat u dit bevestigt, een week met veel koppelingen dus eerder een beslissing dan een factuurverrassing is.',
  'web.creators.notFor.title': 'Wat dit niet is',
  'web.creators.notFor.body':
    'Relay genereert geen afbeeldingen of video, voert geen betrokkenheidsautomatisering uit en voorspelt niet hoe een bericht zal presteren. Als dit de tools zijn die u wilt, zijn er andere producten die dat ook doen, en we hebben liever dat u het nu weet.',

  'web.agencies.title': 'Voor agentschappen',
  'web.agencies.lede':
    'Je publiceert namens andere mensen, waardoor attributie, goedkeuring en bewijsmateriaal deel uitmaken van het werk in plaats van een aardigheidje.',
  'web.agencies.job.separation.title': 'Cliëntscheiding die standhoudt',
  'web.agencies.job.separation.body':
    'Elke werkruimte is geïsoleerd, zowel op databaseniveau als in de applicatie. Een query die de grens van een werkruimte overschrijdt, mislukt in Postgres, niet alleen in een codepad dat iemand zou kunnen vergeten.',
  'web.agencies.job.approval.title':
    'Goedkeuringen waar een klant daadwerkelijk gebruik van kan maken',
  'web.agencies.job.approval.body':
    'Een recensent ziet elk doel, elke variant, het schema met zijn tijdzone en de geschatte kosten op één scherm, en het scherm werkt op een telefoon. Goedkeuringsbesluiten worden vastgelegd met wie, wanneer en wat ze hebben gezien.',
  'web.agencies.job.receipts.title': 'Bewijs voor het ongemakkelijke gesprek',
  'web.agencies.job.receipts.body':
    'Elke publicatie produceert een onveranderlijk ontvangstbewijs met het externe post-ID en de volledige poginggeschiedenis. Wanneer een klant vraagt ​​of er om negen uur iets is uitgegaan, is het antwoord voorzien van een tijdstempel en een platform-ID.',
  'web.agencies.job.roles.title': 'Rollen die aansluiten bij de manier waarop het werk is verdeeld',
  'web.agencies.job.roles.body':
    'Eigenaar, beheerder, manager, redacteur, goedkeurder, analist en kijker, per project en per account. Onbeperkt aantal teamleden, omdat het in rekening brengen per stoel ervoor zorgt dat bureaus logins delen en dat is een veiligheidsprobleem.',
  'web.agencies.limits.title': 'De grens, duidelijk aangegeven',
  'web.agencies.limits.body':
    'Eén plan omvat 30 actieve sociale kanalen. Een kanaal is één sociaal account, pagina, profiel, groep of publicatieverbinding. Als u er meer dan 30 nodig heeft, vertel ons dan wat u nodig heeft en wij geven u een duidelijk antwoord in plaats van een verborgen niveau.',

  'web.developers.title': 'Voor ontwikkelaars',
  'web.developers.lede':
    'Publiceren is het deel van een workflow waarin een fout openbaar en permanent is. Relay biedt u één backend, typefouten, idempotentie bij elke schrijfbewerking en een goedkeuringsmodel waar een agent niet omheen kan praten.',
  'web.developers.surface.api.title': 'REST-API',
  'web.developers.surface.api.body':
    'Scoped API-sleutels, een idempotency-sleutel vereist bij elke schrijfbeurt, cursorpaginering en een getypte fout-envelop met een stabiele code, een berichtsleutel en opgeschoonde details. Geen enkele providerpayload wordt ooit onbewerkt naar u teruggekaatst.',
  'web.developers.surface.mcp.title': 'Externe MCP-server',
  'web.developers.surface.mcp.body':
    'Streambare HTTP met OAuth. Hulpmiddelen zijn gedetailleerd en elk ervan vermeldt zijn bijwerkingen. Lezen, opstellen, goedkeuring aanvragen, plannen en publiceren zijn afzonderlijke scopes, dus een model dat kan opstellen, kan niet publiceren.',
  'web.developers.surface.cli.title': 'CLI',
  'web.developers.surface.cli.body':
    'Elke opdracht ondersteunt machinaal leesbare uitvoer met een stabiele vorm, zodat een script deze kan parseren en een continue integratietaak erop kan mislukken.',
  'web.developers.surface.webhooks.title': 'Ondertekende webhooks',
  'web.developers.surface.webhooks.body':
    'Publiceer resultaten, goedkeuringsbeslissingen, verbindingsstatus en validatieresultaten, ondertekend, bestand tegen opnieuw afspelen en opnieuw leverbaar vanaf het dashboard.',
  'web.developers.safety.title': 'Het agentveiligheidsmodel',
  'web.developers.safety.body':
    'Een agentreferentie is een serviceaccount met een bereik, en geen kopie van een persoonssessie. Er zijn beperkingen per merk, per account, per landinstelling, per domein, per cadans en per vooruitblik, en de server autoriseert elke oproep opnieuw in plaats van de host van de agent te vertrouwen.',
  'web.developers.safety.injection':
    "Webpagina's, feeds, opmerkingen en platformreacties worden behandeld als niet-vertrouwde gegevens. Modeluitvoer wordt deterministisch opnieuw gevalideerd, omdat een model dat zegt dat een bericht in orde is, geen veiligheidsbeslissing is.",
  'web.developers.safety.killSwitch':
    'Elke agent en elke werkruimte heeft een kill-schakelaar die wachtend werk stopt zonder het te verwijderen.',
  'web.developers.openSource.title': 'Open stukken',
  'web.developers.openSource.body':
    'Het connectorcontract, de CLI, schemavoorbeelden, MCP-tooldefinities en de providerssimulator zijn de onderdelen die u nodig hebt om tegen Relay te bouwen zonder een sandbox-account. Als een repository nog niet is gepubliceerd, zegt deze pagina dat in plaats van naar niets te linken.',

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

  'web.resources.title': 'Hulpbronnen',
  'web.resources.lede':
    'Operationele waarheid over het product en het onderzoek achter alles wat we beweren over een platform.',
  'web.resources.status.body':
    'Huidige status van elk oppervlak en elke connector, met incidentgeschiedenis.',
  'web.resources.changelog.body':
    'Wat is er verzonden, wat is er veranderd voor een connector en wat hebben we gecorrigeerd.',
  'web.resources.docs.body': 'REST API-, MCP-, CLI- en webhookdocumentatie.',
  'web.resources.methodology.body':
    'Hoe we elke platformclaim onderzoeken, dateren, verkrijgen en corrigeren.',
  'web.resources.compare.body':
    'Gedateerde vergelijkingen met andere tools, inclusief bij wie ze passen.',
  'web.resources.capabilities.body':
    'Per platform, per mogelijkheid, gegenereerd op basis van de connectordefinities.',
  'web.resources.toolRadar.body':
    'Gespecialiseerde creatieve tools, gedateerd, met beperkingen en openbaarmaking.',
  'web.resources.opportunities.body':
    'Samengestelde plaatsen om te lanceren, te vermelden of bij te dragen, met elke bestemmingsregels.',
  'web.resources.legal.body':
    'Terms, privacy, acceptable use, AI use, security and the rest of the policy set.',
  'web.resources.guides.title': 'Handleidingen en workflows',
  'web.resources.guides.empty': 'Er is nog geen gids gepubliceerd',
  'web.resources.guides.emptyBody':
    'De redactionele standaard vereist originele productgegevens, een reproduceerbare workflow, primaire platformbronnen met een verificatiedatum en een benoemde menselijke redacteur. De eerste gidsen publiceren wanneer ze deze tegenkomen.',

  /* ---------------------------------------------------------------------- */
  /* Status                                                                  */
  /* ---------------------------------------------------------------------- */

  'web.status.title': 'Status',
  'web.status.lede':
    'De staat van elk Relay-oppervlak en elke connector. De connectorstatus omvat onze adapter en de platform-API waarvan deze afhankelijk is.',
  'web.status.updated': 'Statussen worden handmatig bijgehouden. Laatst bijgewerkt {time}.',
  'web.status.surfaces.title': 'Oppervlakken',
  'web.status.connectors.title': 'Connectoren',
  'web.status.level.operational': 'Normaal functionerend',
  'web.status.level.degraded': 'Gedegradeerd',
  'web.status.level.partial': 'Gedeeltelijke uitval',
  'web.status.level.outage': 'Storing',
  'web.status.level.maintenance': 'Gepland onderhoud',
  'web.status.level.notLive': 'Nog niet live',
  'web.status.notLiveBody':
    'Deze connector is gebouwd maar verwerkt nog geen klantenverkeer, dus er valt niets over te rapporteren.',
  'web.status.incidents.title': 'Incidentgeschiedenis',
  'web.status.incidents.empty': 'Er is geen incident geregistreerd',
  'web.status.incidents.emptyBody':
    'Deze pagina begint met opzet leeg. We publiceren elk incident dat invloed heeft gehad op de publicatie, inclusief de incidenten die zijn veroorzaakt door onze eigen fouten, met de tijdlijn en wat er daarna is veranderd.',
  'web.status.incident.started': '{time} gestart',
  'web.status.incident.resolved': '{time} opgelost',
  'web.status.incident.impact': 'Impact',
  'web.status.incident.cause': 'Oorzaak',
  'web.status.incident.followUp': 'Wat er daarna veranderde',
  'web.status.subscribe.title': 'Krijg bericht als er iets kapot gaat',
  'web.status.subscribe.body':
    'Verbindingsstatus, publicatiefouten en platformincidenten worden als ondertekende webhooks aan uw eigen eindpunt geleverd. Er is nog geen aparte statusmailinglijst.',

  /* ---------------------------------------------------------------------- */
  /* Changelog                                                               */
  /* ---------------------------------------------------------------------- */

  'web.changelog.title': 'Wijzigingslog',
  'web.changelog.lede':
    'Productwijzigingen, connectorwijzigingen en correcties. Een mogelijkheidswijziging die van invloed is op wat u kunt publiceren, wordt hier weergegeven voordat deze ergens anders op deze site verschijnt.',
  'web.changelog.kind.shipped': 'Verzonden',
  'web.changelog.kind.changed': 'Gewijzigd',
  'web.changelog.kind.fixed': 'Vast',
  'web.changelog.kind.connector': 'Connector',
  'web.changelog.kind.correction': 'Correctie',
  'web.changelog.kind.security': 'Beveiliging',
  'web.changelog.empty': 'Er is nog niets openbaar verzonden',
  'web.changelog.emptyBody':
    'Relay is in de maak. De eerste vermelding hier is het eerste dat een klant kan gebruiken, geen mijlpaal over onszelf.',

  /* ---------------------------------------------------------------------- */
  /* Docs shell                                                              */
  /* ---------------------------------------------------------------------- */

  'web.docs.title': 'Documentatie',
  'web.docs.lede':
    "Eén backend, vier manieren. Elke sectie documenteert dezelfde gebruiksscenario's, dus een concept dat u leert in de REST API is hetzelfde concept in MCP en in de CLI.",
  'web.docs.section.start.title': 'Aan de slag',
  'web.docs.section.start.body':
    'Authenticatie, werkruimten, projecten en uw eerste gepubliceerde bericht.',
  'web.docs.section.api.title': 'REST-API',
  'web.docs.section.api.body': 'Bronnen, paginering, idempotentie, foutcodes en tarieflimieten.',
  'web.docs.section.mcp.title': 'MCP-server',
  'web.docs.section.mcp.body':
    'Transport, OAuth, gereedschapscatalogus, scopes en de goedkeuringshandshake.',
  'web.docs.section.cli.title': 'CLI',
  'web.docs.section.cli.body':
    'Installeer, authenticeer en contracteer het machineleesbare uitvoercontract.',
  'web.docs.section.webhooks.title': 'Webhaken',
  'web.docs.section.webhooks.body':
    'Evenementencatalogus, handtekeningverificatie, nieuwe pogingen en herlevering.',
  'web.docs.section.connectors.title': 'Connectoren',
  'web.docs.section.connectors.body':
    'Per platformvereisten, accounttypen, limieten en bekende beperkingen.',
  'web.docs.section.errors.title': 'Foutreferentie',
  'web.docs.section.errors.body':
    'Elke foutcode, wat de oorzaak ervan is en wat u eraan kunt doen.',
  'web.docs.pending': 'Nog niet gepubliceerd',
  'web.docs.pendingBody':
    'Deze sectie is geschreven op basis van de verzonden API en publiceert ermee. Wij laten u liever niets zien dan documentatie voor een eindpunt dat mogelijk verandert.',
  'web.docs.principles.title': 'Waar u op kunt vertrouwen',
  'web.docs.principles.idempotency':
    'Voor elke schrijfbewerking is een idempotentiesleutel nodig. Als u een verzoek opnieuw afspeelt met dezelfde sleutel, wordt het oorspronkelijke resultaat geretourneerd in plaats van dat er een tweede bericht wordt gemaakt.',
  'web.docs.principles.errors':
    'Elke fout bevat een stabiele code, een berichtsleutel en opgeschoonde details. Codes veranderen de betekenis tussen versies niet.',
  'web.docs.principles.versioning':
    'Brekende wijzigingen krijgen een nieuwe versie en een aangekondigde beëindigingsperiode. Additieve veranderingen niet.',
  'web.docs.principles.scopes':
    'Lezen, opstellen, goedkeuring aanvragen, plannen en publiceren zijn aparte scopes. Een credential krijgt de kleinste set die zijn werk doet.',

  /* ---------------------------------------------------------------------- */
  /* Methodology                                                             */
  /* ---------------------------------------------------------------------- */

  'web.methodology.title': 'Methodologie',
  'web.methodology.lede':
    'Hoe iets op deze site waar wordt genoemd, en wat er gebeurt als dit niet zo blijkt te zijn.',
  'web.methodology.claims.title': 'Platformclaims',
  'web.methodology.claims.body':
    'Elke claim over wat een platform toestaat, komt uit de eigen documentatie of beleidspagina van dat platform. We registreren de URL, de datum waarop deze is gelezen, de API-versie waarop deze van toepassing is en de persoon die de eigenaar is van de hercontrole. Een claim zonder die vier zaken komt niet op de site.',
  'web.methodology.recheck.title': 'Wanneer we opnieuw controleren',
  'web.methodology.recheck.beforeConnector':
    'Voordat een connector start, en nogmaals voordat deze klantverkeer doorvoert.',
  'web.methodology.recheck.monthly': 'Elke maand voor platformchangelogs en leveranciersprijzen.',
  'web.methodology.recheck.quarterly':
    'Elk kwartaal voor plannen van concurrenten, gemeenschapsregels en juridische documenten.',
  'web.methodology.recheck.immediate':
    'Onmiddellijk na een platformafwijzing, handhavingskennisgeving, beëindiging of een onverklaarbare verandering in publicatie- of analysegedrag.',
  'web.methodology.comparison.title': 'Vergelijkingen',
  'web.methodology.comparison.bestFor':
    'Bij elke vergelijking staat voor wie welk product het beste is, ook als dat niet bij ons het geval is.',
  'web.methodology.comparison.dated':
    'Elke vergelijking bevat de onderzoeksdatum en koppelt de primaire bronnen voor prijzen en capaciteiten.',
  'web.methodology.comparison.distinction':
    'Een ontbrekende mogelijkheid wordt bestempeld als iets dat we niet hebben gebouwd of als iets dat het platform niet toestaat. Dit zijn verschillende zinnen en we voegen ze nooit samen.',
  'web.methodology.comparison.noLogos':
    "We gebruiken geen klantlogo's, citaten of interface-screenshots van een ander bedrijf, en we claimen geen goedkeuring die we niet hebben.",
  'web.methodology.benchmarks.title': 'Benchmarks en productgegevens',
  'web.methodology.benchmarks.body':
    'Elk getal dat uit klantactiviteiten wordt getrokken vermeldt de steekproef, de uitsluitingen, de metrische definitie en de privacydrempel, en wordt samengevoegd zodat er geen werkruimte kan worden geïdentificeerd. Als een monster te klein is om veilig te publiceren, zeggen we dat in plaats van het toch te publiceren.',
  'web.methodology.ai.title': 'AI in onze eigen inhoud',
  'web.methodology.ai.body':
    'Een model kan onderzoeken, schetsen, vertalen, controleren en formatteren. Een genoemde persoon is eigenaar van elke claim, bewerkt het stuk en houdt het actueel. We publiceren geen niet-beoordeelde gegenereerde artikelen en we genereren geen schermafbeeldingen.',
  'web.methodology.corrections.title': 'Correcties',
  'web.methodology.corrections.body':
    'Wanneer een pagina verkeerd is, corrigeren we deze ter plekke, voegen een gedateerde correctienota toe en vermelden de correctie in de changelog. Wanneer een pagina te oud is om te repareren, verwijderen we deze in plaats van deze te laten staan.',

  /* ---------------------------------------------------------------------- */
  /* Compare                                                                 */
  /* ---------------------------------------------------------------------- */

  'web.compare.title': 'Vergelijkingen',
  'web.compare.lede':
    "Deze pagina's zijn zelfs nuttig als u het andere product kiest. Dat is de norm waaraan ze moeten voldoen voordat ze publiceren.",
  'web.compare.rules.title': "De regels die deze pagina's volgen",
  'web.compare.rules.bestFor':
    'Op elke pagina staat eerst in een eigen sectie voor wie het andere product het beste is.',
  'web.compare.rules.dated':
    'Elke claim is gedateerd en linkt naar de primaire bron waar deze vandaan komt.',
  'web.compare.rules.distinction':
    'We scheiden wat we niet hebben gebouwd en wat een platform niet toestaat.',
  'web.compare.rules.axes':
    'Elke pagina vergelijkt dezelfde dingen: accountlimiet, postlimieten, team en goedkeuring, API-, MCP- en CLI-toegang, inhoudstalen, analyses, videoverwerking, ingebed gebruik, zelfhosting, ondersteuning en de platform-API-kosten die u erbovenop betaalt.',
  'web.compare.rules.correction':
    'Elke pagina bevat een correctiecontact en een beoordelingsdatum.',
  'web.compare.planned.title': "Geplande pagina's",
  'web.compare.planned.body':
    'Deze worden gepubliceerd zodra de huidige prijs- en capaciteitscontrole is voltooid. Een vergelijking die uit het geheugen wordt geschreven, is erger dan geen vergelijking.',
  'web.compare.empty': 'Er is nog geen vergelijking gepubliceerd',
  'web.compare.emptyBody':
    'Elke pagina heeft een nieuwe feitencontrole nodig ten opzichte van de eigen prijzen en documentatie van het andere product. Ze publiceren één voor één zodra dat werk klaar is.',

  /* ---------------------------------------------------------------------- */
  /* Tool radar                                                              */
  /* ---------------------------------------------------------------------- */

  'web.toolRadar.title': 'Creatieve gereedschapsradar',
  'web.toolRadar.lede':
    'Relay genereert geen afbeeldingen of video. Het helpt u beslissen welk specialistisch hulpmiddel u moet gebruiken en het voltooide bedrijfsmiddel met intacte rechten binnen te brengen.',
  'web.toolRadar.record.title': 'Wat elke plaat met zich mee moet brengen',
  'web.toolRadar.record.url': 'De officiële URL en de organisatie die eigenaar is van het product.',
  'web.toolRadar.record.useCase':
    'De workflow waarvoor het wordt aanbevolen en de gedocumenteerde beperkingen ervan.',
  'web.toolRadar.record.pricing': 'Het prijsmodel en de datum waarop we het hebben gecontroleerd.',
  'web.toolRadar.record.rights':
    'De rechten, licenties, retentie en privacyvoorbehouden, in de eigen woorden van de leverancier.',
  'web.toolRadar.record.disclosure':
    'Of we er een commerciële relatie mee hebben. De ranking hangt daar nooit van af.',
  'web.toolRadar.record.verified':
    'Een datum voor de laatste verificatie en een zichtbare waarschuwing zodra een record de beoordelingsperiode heeft overschreden.',
  'web.toolRadar.category.title': 'Categorieën',
  'web.toolRadar.empty': 'De catalogus is nog niet gevuld',
  'web.toolRadar.emptyBody':
    'Records worden door een persoon geschreven op basis van de eigen documentatie van de leverancier. We zullen deze pagina niet vullen met modelgegenereerde links die er plausibel uitzien.',
  'web.toolRadar.noAffiliateYet':
    'Er is geen partnerrelatie met welke tool dan ook die hier vandaag wordt vermeld.',

  /* ---------------------------------------------------------------------- */
  /* Opportunities                                                           */
  /* ---------------------------------------------------------------------- */

  'web.opportunities.title': 'Promotiemogelijkheden',
  'web.opportunities.lede':
    'Een samengestelde catalogus van plaatsen waar een product kan worden gelanceerd, vermeld, besproken of bijgedragen, met de regels die elke bestemming voor zichzelf stelt.',
  'web.opportunities.rules.title': 'Hoe deze catalogus zich gedraagt',
  'web.opportunities.rules.curated':
    'Elke inzending is een beoordeeld record met een officiële URL, de huidige inzendingsregels en een verificatiedatum. Niets wordt door een model ontdekt en als geverifieerd gepresenteerd.',
  'web.opportunities.rules.noAutomation':
    'Relay verzendt nooit een formulier, schrapt nooit een contactpersoon, verzendt geen bulk-e-mail of plaatst geen berichten voor u in een community. Jij doet de inzending.',
  'web.opportunities.rules.noGuarantee':
    'Een vermelding is geen rankingbelofte en een link is geen groeistrategie. We laten de geschiktheid, het publiek, de inspanning, de kosten en de openbaarmakingsvereisten zien, zodat u kunt beslissen of het uw middag waard is.',
  'web.opportunities.rules.stale':
    'Een record waarvan de beoordelingsdatum is verstreken, wordt gelabeld of verborgen in plaats van als actueel weergegeven.',
  'web.opportunities.category.title': 'Categorieën',
  'web.opportunities.empty': 'De catalogus is nog niet gevuld',
  'web.opportunities.emptyBody':
    'Elke bestemmingsregel moet door een persoon worden gelezen en vastgelegd voordat deze kan worden aanbevolen. De categorieën staan ​​hierboven vermeld, zodat u de vorm kunt zien van wat er gaat komen.',

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
  'web.marketing.provider.threads.label': 'Threads',
  'web.marketing.provider.bluesky.label': 'Bluesky',

  'web.marketing.provider.x.accountTypes': 'Een persoonlijk of zakelijk X-account dat u beheert.',
  'web.marketing.provider.x.restriction':
    'Voor automatisch posten is de uitdrukkelijke toestemming van de accounthouder vereist, die Relay registreert. Dubbele of substantieel vergelijkbare berichten tussen accounts zijn niet toegestaan, en er worden geen ongevraagde geautomatiseerde antwoorden geplaatst.',
  'web.marketing.provider.x.cost':
    'X brengt kosten in rekening voor elke API-bewerking en brengt meer in rekening voor een bericht met een URL. Relay schat de kosten voordat u deze bevestigt en geeft deze door zonder toeslag.',

  'web.marketing.provider.linkedin.accountTypes':
    'Een ledenprofiel of een organisatiepagina waar u de juiste rol vervult.',
  'web.marketing.provider.linkedin.restriction':
    'Voor publiceren namens een organisatie zijn een goedgekeurd Community Management-product en een geverifieerde bedrijfsidentiteit vereist. De analyse van ledenposten is afhankelijk van een leestoestemming die LinkedIn heeft gesloten voor nieuwe sollicitaties, dus Relay zal deze niet aanbieden.',
  'web.marketing.provider.linkedin.cost':
    'Geen kosten per operatie. Dagelijkse limieten voor aanmelding en leden zijn van toepassing.',

  'web.marketing.provider.instagram.accountTypes':
    'Een professioneel Instagram-account, bedrijf of maker.',
  'web.marketing.provider.instagram.restriction':
    'Het publiceren van inhoud op Instagram is alleen beschikbaar voor professionele accounts. Een consumentenaccount kan door geen enkele toepassing worden gepubliceerd, inclusief deze. Bij het publiceren wordt de officiële container- en publicatievolgorde gebruikt, en Relay bevestigt de uiteindelijke status in plaats van de upload als succesvol te rapporteren.',
  'web.marketing.provider.instagram.cost':
    'Geen kosten per operatie. Meta-app-beoordeling en bedrijfsverificatie zijn vereist.',

  'web.marketing.provider.facebook.accountTypes': 'Een Facebook-pagina die u beheert.',
  'web.marketing.provider.facebook.restriction':
    'Het publicatiedoel is een pagina. Het automatiseren van een persoonlijk profiel wordt niet aangeboden door de API en Relay probeert dit ook niet.',
  'web.marketing.provider.facebook.cost':
    'Geen kosten per operatie. Meta-app-beoordeling en bedrijfsverificatie zijn vereist.',

  'web.marketing.provider.youtube.accountTypes':
    'Een YouTube-kanaal dat is gekoppeld via uw Google-account.',
  'web.marketing.provider.youtube.restriction':
    'Een project dat de Google API-compliance-audit niet heeft doorstaan, kan alleen als privé uploaden. Relay beschrijft openbare uploads pas als beschikbaar als de audit is geslaagd en op het verbindingsscherm staat in welke status uw uploads terechtkomen.',
  'web.marketing.provider.youtube.cost':
    'Geen kosten per operatie. Er geldt een dagelijks quotum dat niet tussen projecten kan worden gedeeld.',

  'web.marketing.provider.tiktok.accountTypes': 'Een TikTok-account met Direct Post-autorisatie.',
  'web.marketing.provider.tiktok.restriction':
    'Totdat de Content Posting API-audit is geslaagd, zijn berichten privé en gelden er limieten per account. Op het moment van publicatie haalt Relay de huidige makerinformatie op, toont de beschikbare privacyopties zonder er een vooraf te selecteren, en vraagt ​​om de commentaar-, duet- en steekinstellingen en de commerciële inhoudsdeclaratie.',
  'web.marketing.provider.tiktok.cost':
    'Geen kosten per operatie. In de niet-gecontroleerde modus worden dagelijkse boekingslimieten toegepast.',

  'web.marketing.provider.threads.accountTypes':
    'Een Threads-profiel gekoppeld aan een professioneel Instagram-account.',
  'web.marketing.provider.threads.restriction':
    'Publiceren volgt de Meta-container en publicatievolgorde. Mogelijkheden worden geverifieerd aan de hand van de officiële verzameling voordat iets hier ondersteund wordt genoemd.',
  'web.marketing.provider.threads.cost': 'Geen kosten per operatie.',

  'web.marketing.provider.bluesky.accountTypes': 'Een Bluesky-account bij elke hostingprovider.',
  'web.marketing.provider.bluesky.restriction':
    'Een open protocol zonder stap voor het beoordelen van aanvragen. Tarieflimieten en limieten voor de recordgrootte zijn nog steeds van toepassing en worden vóór verzending gehandhaafd.',
  'web.marketing.provider.bluesky.cost': 'Geen kosten per operatie.',
  'web.marketing.provider.mastodon.label': 'Mastodon',
  'web.marketing.provider.mastodon.accountTypes': 'Een Mastodon-account op elke instance.',
  'web.marketing.provider.mastodon.restriction':
    'Een open protocol zonder app-review. De tekenlimiet wordt per instance bepaald en de snelheidslimieten worden gerespecteerd.',
  'web.marketing.provider.mastodon.cost': 'Geen kosten per bewerking.',
  'web.marketing.provider.telegram.label': 'Telegram',
  'web.marketing.provider.telegram.accountTypes':
    'Een Telegram-bot die jij beheert en die post in een kanaal of groep.',
  'web.marketing.provider.telegram.restriction':
    'Een bot kan alleen posten waar hij is toegevoegd. De token is een applicatiegeheim en de doelchat wordt per verbinding gekozen.',
  'web.marketing.provider.telegram.cost': 'Geen kosten per bewerking.',
  'web.marketing.provider.reddit.label': 'Reddit',
  'web.marketing.provider.reddit.accountTypes': 'Een Reddit-account dat mag publiceren.',
  'web.marketing.provider.reddit.restriction':
    'Schrijven op Reddit vereist een goedgekeurde app. Posts zijn tekst- of linkposts in toegestane subreddits; geen automatische reacties of stemmen.',
  'web.marketing.provider.reddit.cost': 'Geen kosten per bewerking.',
  'web.marketing.provider.wordpress.label': 'WordPress',
  'web.marketing.provider.wordpress.accountTypes': 'Een WordPress-site met een app-wachtwoord.',
  'web.marketing.provider.wordpress.restriction':
    'Posts gaan via de REST API van de site als de verbonden gebruiker. Upload van afbeeldingen en video is nog niet gebouwd.',
  'web.marketing.provider.wordpress.cost': 'Geen kosten per bewerking.',
  'web.marketing.provider.medium.label': 'Medium',
  'web.marketing.provider.medium.accountTypes': 'Een Medium-auteursprofiel verbonden via OAuth.',
  'web.marketing.provider.medium.restriction':
    'Posts verschijnen als openbare verhalen in Markdown. De integratie-API heeft geen verwijderen, dus dat wordt niet aangeboden.',
  'web.marketing.provider.medium.cost': 'Geen kosten per bewerking.',
  'web.marketing.provider.devto.label': 'Dev.to',
  'web.marketing.provider.devto.accountTypes': 'Een Dev.to-profiel verbonden met de API-sleutel.',
  'web.marketing.provider.devto.restriction':
    'Artikelen verschijnen als openbare Markdown-posts. Upload van afbeeldingen en analyses zijn nog niet gebouwd.',
  'web.marketing.provider.devto.cost': 'Geen kosten per bewerking.',
  'web.marketing.provider.pinterest.label': 'Pinterest',
  'web.marketing.provider.pinterest.accountTypes':
    'Een Pinterest-bedrijfsaccount verbonden via OAuth.',
  'web.marketing.provider.pinterest.restriction':
    'Een pin vereist een afbeelding en een eigen bord. Schrijven vereist app-review; de borden worden bij het verbinden gelezen.',
  'web.marketing.provider.pinterest.cost': 'Geen kosten per bewerking.',
  'web.marketing.provider.discord.label': 'Discord',
  'web.marketing.provider.discord.accountTypes':
    'Een Discord-bot die jij beheert en die post in tekstkanalen.',
  'web.marketing.provider.discord.restriction':
    'De bot kan alleen posten in kanalen die hij kan zien. Tekstberichten worden ondersteund; bijlagen nog niet.',
  'web.marketing.provider.discord.cost': 'Geen kosten per bewerking.',
  'web.marketing.provider.slack.label': 'Slack',
  'web.marketing.provider.slack.accountTypes': 'Een Slack-werkruimte verbonden via een OAuth-app.',
  'web.marketing.provider.slack.restriction':
    'Berichten gaan naar openbare en privékanalen waar de app is. Upload van bestanden en analyses zijn nog niet gebouwd.',
  'web.marketing.provider.slack.cost': 'Geen kosten per bewerking.',

  /* ---------------------------------------------------------------------- */
  /* Capability matrix notes                                                 */
  /* ---------------------------------------------------------------------- */

  'web.capabilities.short.supported': 'Ondersteund',
  'web.capabilities.short.unsupported': 'Platform biedt het niet',
  'web.capabilities.short.not_implemented': 'Nog niet gebouwd',
  'web.capabilities.short.requires_review': 'Platformbeoordeling vereist',
  'web.capabilities.notesTitle': 'Notities en bronnen',
  'web.capabilities.noteRef': 'Opmerking {number}',
  'web.capabilities.summary':
    '{supported, plural, one {# mogelijkheid ondersteund} other {# ondersteunde mogelijkheden}}, {requiresReview, plural, one {# wacht op een platformbeoordeling} other {# wacht op een platformbeoordeling}}, {notImplemented, plural, one {# nog niet gebouwd} other {# nog niet gebouwd}}, {unsupported, plural, one {# het platform biedt geen aanbod} other {# het platform biedt geen aanbod}}.',
  'web.capabilities.buildState.title': 'Er is nog geen enkele connector die klantverkeer verwerkt',
  'web.capabilities.buildState.body':
    'Relay is in de maak. Deze tabel geeft de connectordefinities weer zoals ze er nu uitzien. Daarom worden de meeste cellen gelezen als nog niet gebouwd. Een cel wordt pas ondersteund nadat die connector voldoet aan de definitie van voltooid, inclusief contracttests tegen de opgenomen platformbevestigingen. De cellen die zeggen dat een platform iets niet aanbiedt, of het achter een recensie plaatst, zijn feiten over het platform en zijn al definitief.',
  'web.capabilities.note.instagramProfessional':
    'Alleen professionele accounts. Een consumentenaccount kan door geen enkele toepassing worden gepubliceerd.',
  'web.capabilities.note.facebookPagesOnly':
    "Alleen pagina's. De API publiceert niet naar een persoonlijk profiel.",
  'web.capabilities.note.youtubeAudit':
    'Totdat de Google API-nalevingsaudit is geslaagd, wordt land als privé geüpload.',
  'web.capabilities.note.tiktokAudit':
    'Totdat de Content Posting API-audit is geslaagd, zijn berichten privé en beperkt.',
  'web.capabilities.note.tiktokPrivacy':
    'De privacyoptie wordt opgehaald tijdens het publiceren en moet door een persoon worden gekozen.',
  'web.capabilities.note.linkedinMemberAnalytics':
    'Voor de analyse van ledenposten is leestoestemming vereist. LinkedIn heeft de toegang tot nieuwe sollicitaties gesloten.',
  'web.capabilities.note.linkedinOrgAccess':
    'Vereist een goedgekeurd Community Management-product en een geverifieerd bedrijf.',
  'web.capabilities.note.linkedinDocuments':
    'LinkedIn is het enige verbonden platform met een documentposttype.',
  'web.capabilities.note.metaReview': 'Vereist beoordeling van de Meta-app en bedrijfsverificatie.',
  'web.capabilities.note.xConsent':
    'Vereist geregistreerde toestemming van de accounthouder voor automatisch posten.',
  'web.capabilities.note.xDisclosure':
    'Het platform biedt een gemaakt met AI-veld, dat Relay instelt op basis van uw aangifte.',
  'web.capabilities.note.noDestinations':
    'Dit platform heeft geen bestemmingsconcept zoals een pagina, bord of community.',
  'web.capabilities.note.noThreads': 'Dit platform heeft geen native multi-post-reeks.',
  'web.capabilities.note.noDocuments': 'Dit platform heeft geen documentposttype.',
  'web.capabilities.note.videoOnly': 'Dit platform accepteert alleen video-uploads.',
  'web.capabilities.note.noAltText':
    'Dit platform accepteert geen alternatieve tekst via de publicatie-API.',
  'web.capabilities.note.noPrivacyChoice':
    'Dit platform biedt via zijn API geen privacyoptie per post.',
  'web.capabilities.note.noThumbnail':
    'Dit platform accepteert geen aangepaste thumbnail via de API.',
  'web.capabilities.note.inBuild': 'Het platform biedt dit. Relay heeft het nog niet verzonden.',
  'web.capabilities.note.noCarousel': 'Het platform biedt geen veegbare carrousel.',
  'web.capabilities.note.noDisclosure':
    'Het platform heeft geen openbaarmakingsveld voor AI- of commerciële inhoud.',
  'web.capabilities.note.noAnalytics':
    'Het platform stelt geen betrokkenheidsstatistieken beschikbaar via zijn officiële API.',
  'web.capabilities.note.redditReview':
    'Schrijven op Reddit vereist een goedgekeurde data-API-app.',
  'web.capabilities.note.redditMedia':
    'Afbeeldings- en videoposts zijn nog niet gebouwd voor Reddit.',
  'web.capabilities.note.mediumImages': 'De integratie-API accepteert geen afbeeldingsbijlagen.',
  'web.capabilities.note.mediumNoDelete': 'De integratie-API heeft geen verwijder-endpoint.',
  'web.capabilities.note.devtoImages':
    'De API accepteert alleen artikelteksten; afbeeldingsupload is nog niet gebouwd.',
  'web.capabilities.note.pinterestNeedsImage':
    'Een pin vereist een afbeelding; alleen-tekst-pins bestaan niet.',
  'web.capabilities.note.pinterestReview':
    'Schrijven op Pinterest vereist goedgekeurde app-toegang.',

  /* ---------------------------------------------------------------------- */
  /* Status page surfaces                                                    */
  /* ---------------------------------------------------------------------- */

  'web.status.surface.web': 'Web-app',
  'web.status.surface.api': 'REST-API',
  'web.status.surface.mcp': 'MCP-server',
  'web.status.surface.cli': 'CLI',
  'web.status.surface.webhooks': 'Webhook-levering',
  'web.status.surface.publishing': 'Uitgeversarbeiders',
  'web.status.surface.media': 'Mediaverwerking',
  'web.status.surface.analytics': 'Analytics-collectie',
  'web.status.surface.links': 'Korte linkomleidingen',
  'web.status.surface.checkout': 'Afrekenen en factureren',
  'web.status.preLaunch.title': 'Relay is nog niet algemeen beschikbaar',
  'web.status.preLaunch.body':
    'Deze pagina is live voordat het product er is, zodat de rapportagegewoonte al bestaat vanaf de eerste klant en niet wordt toegevoegd na de eerste storing. Oppervlakken die nog in bebouwing zijn, worden als zodanig gemarkeerd en niet als gezond weergegeven.',

  /* ---------------------------------------------------------------------- */
  /* Comparison targets                                                      */
  /* ---------------------------------------------------------------------- */

  'web.compare.product.postiz': 'Postiz',
  'web.compare.product.buffer': 'Buffer',
  'web.compare.product.hootsuite': 'Hootsuite',
  'web.compare.product.later': 'Later',
  'web.compare.product.metricool': 'Metrisch',
  'web.compare.product.publer': 'Uitgever',
  'web.compare.product.socialbee': 'SociaalBee',
  'web.compare.product.typefully': 'Typerend',
  'web.compare.product.publishingApis': "API's voor ontwikkelaarspublicatie",
  'web.compare.state.factCheckPending': 'Factcheck wordt uitgevoerd',

  /* ---------------------------------------------------------------------- */
  /* Tool radar categories                                                   */
  /* ---------------------------------------------------------------------- */

  'web.toolRadar.category.video': 'Video genereren en bewerken',
  'web.toolRadar.category.image': 'Genereren en bewerken van afbeeldingen',
  'web.toolRadar.category.audio': 'Audio, stem en muziek',
  'web.toolRadar.category.ugc': 'Video in avatar- en makerstijl',
  'web.toolRadar.category.clipping': 'Lange video naar korte clips',
  'web.toolRadar.category.design': 'Ontwerp en lay-out',
  'web.toolRadar.category.research': 'Onderzoek en bronnenverzameling',
  'web.toolRadar.category.workflow': 'Automatisering van de workflow',

  /* ---------------------------------------------------------------------- */
  /* Opportunity categories                                                  */
  /* ---------------------------------------------------------------------- */

  'web.opportunities.category.launch': 'Productlancerings- en opstartmappen',
  'web.opportunities.category.review': 'Software- en recensiemappen',
  'web.opportunities.category.marketplace': 'Marktplaatsen voor integratie en automatisering',
  'web.opportunities.category.community': 'Community-showthreads die inzendingen toestaan',
  'web.opportunities.category.partner': 'Partnerecosystemen en integratiemappen',
  'web.opportunities.category.editorial': 'Gastlessen, podcasts en nieuwsbrieven',
  'web.opportunities.category.openSource': 'Open source-lijsten en documentatiebronnen',

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

  'web.footer.product': 'Product',
  'web.footer.company': 'Bedrijf',
  'web.footer.resources': 'Hulpbronnen',
  'web.footer.legal': 'Legaal',
  'web.footer.developers': 'Ontwikkelaars',
  'web.footer.statement':
    "Relay publiceert alleen via officiële platform-API's. De beschikbaarheid van connectoren is afhankelijk van goedkeuringen die door de platforms worden beheerd, en elke claim op deze site is gedateerd en afkomstig.",
  'web.footer.noAffiliation':
    'Platformnamen en -merken zijn eigendom van hun eigenaren. Het gebruik ervan hier identificeert een connector en impliceert geen goedkeuring of partnerschap.',
  'web.footer.copyright': 'Relay {year}',
} as const;
