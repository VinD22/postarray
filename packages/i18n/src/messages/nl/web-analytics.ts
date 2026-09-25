/**
 * Web surface strings for Analytics, Automation Rules, RSS autopost and
 * tracked links.
 *
 * `analytics.ts` and `automation.ts` hold the domain vocabulary shared by every
 * surface (metric names, trigger sentences, provider caveats). This file holds
 * what only the web screens need: column headings, filter labels, wizard steps,
 * the sentence builder chrome and the per screen empty, error, offline,
 * permission and rate limit copy.
 *
 * Every leaf name here is new. Nothing in this file overwrites a key defined in
 * `analytics.ts` or `automation.ts`, which is asserted by `lint.test.ts`.
 */
export const webAnalyticsMessages = {
  /* ======================================================================
     Analytics shell
     ====================================================================== */
  'analytics.chart.legend': 'Serie weergegeven in dit diagram',
  'analytics.tab.overview': 'Overzicht',
  'analytics.tab.experiments': 'Experimenten',
  'analytics.tab.links': 'Bijgehouden links',
  'analytics.tab.label': 'Analytics-secties',

  'analytics.question.baseline': 'Welke posts zijn verwijderd van je eigen baseline?',
  'analytics.question.baselineHelp':
    'Elk bericht wordt vergeleken met uw eigen recente berichten op hetzelfde account en in hetzelfde formaat. Niets hier vergelijkt u met een andere werkplek of een ander bedrijf.',
  'analytics.question.accounts': 'Welke rekeningen hebben aandacht nodig?',
  'analytics.question.next': 'Wat is het volgende waard om te testen?',

  'analytics.filter.project': 'Project',
  'analytics.filter.accounts': 'Rekeningen',
  'analytics.filter.allAccounts': 'Alle gekoppelde accounts',
  'analytics.filter.range': 'Datumbereik',
  'analytics.filter.format': 'Inhoud formaat',
  'analytics.filter.allFormats': 'Alle formaten',
  'analytics.filter.comparePrevious': 'Vergelijk met de vorige periode',
  'analytics.filter.applied':
    '{count, plural, =0 {Geen filters} one {# filter} other {# filters}} toegepast. {results, plural, =0 {Er komen geen berichten overeen} one {# berichten komen overeen} other {# berichten komen overeen}}.',

  'analytics.rankMetric.label': 'Rangschik berichten op',
  'analytics.rankMetric.help':
    'Er is geen gecombineerde score in Post Array. Kies één metriek waarvan u de definitie vertrouwt, en de tabel wordt alleen op die metriek geordend.',
  'analytics.rankMetric.chosen':
    'Gerangschikt op {metric}, zoals gerapporteerd door elke accountaanbieder.',

  /* ----------------------------------------------------------------------
     Outcome groups. Never summed together.
     ---------------------------------------------------------------------- */
  'analytics.outcome.awareness': 'Bewustzijn',
  'analytics.outcome.awarenessHelp':
    'Hoe vaak de post is bezorgd of gezien. Aanbieders rekenen dit anders, waardoor een waarde pas in de loop van de tijd met zichzelf vergelijkbaar is.',
  'analytics.outcome.consumption': 'Verbruik',
  'analytics.outcome.consumptionHelp':
    'Hoeveel van de berichten mensen daadwerkelijk hebben bekeken of gelezen.',
  'analytics.outcome.interaction': 'Interactie',
  'analytics.outcome.interactionHelp':
    'Wat mensen op het platform deden: likes, reacties, shares en saves.',
  'analytics.outcome.conversion': 'Conversie',
  'analytics.outcome.conversionHelp':
    'Wat mensen deden nadat ze het platform hadden verlaten. Alleen gevolgde links kunnen dit beantwoorden, en alleen voor de links die u wilt volgen.',
  'analytics.outcome.separateNote':
    'Deze vier groepen worden afzonderlijk geteld. Als u ze bij elkaar optelt, wordt dezelfde persoon meer dan één keer geteld.',

  /* ----------------------------------------------------------------------
     Comparison table
     ---------------------------------------------------------------------- */
  'analytics.table.caption':
    'Berichten gepubliceerd in het geselecteerde bereik, waarbij elk bericht wordt vergeleken met uw eigen recente basislijn.',
  'analytics.table.post': 'Post',
  'analytics.table.account': 'Rekening',
  'analytics.table.format': 'Formaat',
  'analytics.table.published': 'Gepubliceerd',
  'analytics.table.value': 'Waarde',
  'analytics.table.delta': 'Tegen basislijn',
  'analytics.table.sample': 'Voorbeeld',
  'analytics.table.sampleSize': 'n = {count}',
  'analytics.table.evidence': 'Bewijs',
  'analytics.table.openEvidence': 'Toon het bewijs voor {post}',
  'analytics.table.rowActions': 'Acties voor {post}',
  'analytics.table.openPost': 'Statistieken voor open berichten',
  'analytics.table.openReceipt': 'Open de publicatiebon',
  'analytics.table.noBaseline': 'Nog geen basislijn',
  'analytics.table.noBaselineReason':
    'Er zijn minder dan {required} vergelijkbare berichten op dit account. Een vergelijking zou ruis zijn, dus er wordt er geen getoond.',
  'analytics.table.sortBy': 'Sorteren op {column}',
  'analytics.table.detailToggle': 'Details',

  'analytics.delta.above': '{percent} boven basislijn',
  'analytics.delta.below': '{percent} onder de basislijn',
  'analytics.delta.level': 'In lijn met de basislijn',
  'analytics.delta.unavailable': 'Geen vergelijking',

  'analytics.evidence.title': 'Hoe deze vergelijking tot stand kwam',
  'analytics.evidence.baseline':
    'Basislijn: de mediaan {metric} van de vorige {count, plural, one {# vergelijkbaar bericht} other {# vergelijkbare berichten}} op {account}.',
  'analytics.evidence.comparableBy':
    'Vergelijkbaar betekent hetzelfde account, hetzelfde inhoudsformaat ({format}) en een publicatietijd binnen dezelfde periode.',
  'analytics.evidence.postsUsed': 'Posten gebruikt voor de basislijn',
  'analytics.evidence.excluded':
    '{count, plural, =0 {Er zijn geen berichten uitgesloten} one {# bericht is uitgesloten} other {# berichten zijn uitgesloten}} omdat de statistiek voor hen niet beschikbaar was.',
  'analytics.evidence.smallSample':
    'Met {count, plural, one {# post} other {# posts}} in de basislijn verplaatst een enkele ongebruikelijke post de mediaan een heel eind. Beschouw dit als een signaal om opnieuw te testen, niet als resultaat.',
  'analytics.evidence.confounders': 'Waar dit niet op slaat',
  'analytics.evidence.confounder.time':
    'Het publicatietijdstip van de dag varieerde voor de basisposts.',
  'analytics.evidence.confounder.format':
    'Beeldposts en videoposts zijn hier niet direct vergelijkbaar.',
  'analytics.evidence.confounder.followers':
    'Het aantal volgers op {account} is tijdens deze periode gewijzigd door {percent}.',
  'analytics.evidence.confounder.paid':
    'Post Array kan niet zeggen of deze berichten een betaalde distributie hebben ontvangen.',
  'analytics.evidence.confounder.provider':
    '{provider} heeft in deze periode de manier gewijzigd waarop {metric} wordt gerapporteerd.',

  /* ----------------------------------------------------------------------
     Metric definitions
     ---------------------------------------------------------------------- */
  'analytics.definition.open': 'Wat {metric} betekent',
  'analytics.definition.inlineHeading': 'Definitie',
  'analytics.definition.observedAt': '{dateTime} waargenomen.',
  'analytics.definition.sourceLink': 'Documentatie van de leverancier',
  'analytics.definition.verifiedOn':
    'Gecontroleerd aan de hand van de documentatie van de provider op {date}.',
  'analytics.definition.panelTitle': 'Metrische definities in deze weergave',
  'analytics.definition.panelIntro':
    'Elk nummer op dit scherm komt uit één genoemd providerveld. De onderstaande definities worden ook naast elke waarde herhaald, dus niets belangrijks staat alleen in een tooltip.',
  'analytics.definition.aggregation.sum': 'Geaggregeerd door elke waarneming toe te voegen.',
  'analytics.definition.aggregation.average': 'Geaggregeerd als gemiddelde.',
  'analytics.definition.aggregation.median': 'Geaggregeerd als mediaan.',
  'analytics.definition.aggregation.last': 'De meest recente waarneming.',
  'analytics.definition.aggregation.delta':
    'De verandering tussen de eerste en de laatste waarneming.',
  'analytics.definition.aggregation.none': 'Gerapporteerd als een enkele waarneming.',
  'analytics.definition.denominator.none': 'Dit is een telling, geen tarief.',
  'analytics.definition.historyWindow':
    '{provider} bewaart {days, plural, one {# dag} other {# dagen}} geschiedenis voor dit veld.',
  'analytics.definition.historyWindowNone':
    '{provider} vermeldt geen geschiedenislimiet voor dit veld.',

  'analytics.definition.term.providerField': 'Providerveld',
  'analytics.definition.term.unit': 'Eenheid',
  'analytics.definition.term.denominator': 'Noemer',
  'analytics.definition.term.aggregation': 'Hoe het wordt samengevoegd',
  'analytics.definition.term.history': 'Geschiedenis die de aanbieder bijhoudt',
  'analytics.definition.term.definition': 'Wat de aanbieder zegt dat het betekent',

  'analytics.unit.count': 'Een telling van gebeurtenissen',
  'analytics.unit.seconds': 'Seconden',
  'analytics.unit.percent': 'Een percentage dat de aanbieder al heeft berekend',
  'analytics.unit.ratio': 'Een ratio Post Array berekend op basis van twee providervelden',
  'analytics.unit.currency_minor': 'Een geldbedrag in kleine eenheden',

  'analytics.denominator.none': 'Dit is een telling, geen tarief. Het heeft geen noemer.',
  'analytics.denominator.impressions': 'Verdeeld door indrukken',
  'analytics.denominator.reach': 'Verdeeld naar bereik',
  'analytics.denominator.views': 'Verdeeld door weergaven',
  'analytics.denominator.followers':
    'Gedeeld door het aantal volgers op het moment van de observatie',
  'analytics.denominator.sessions': 'Verdeeld per sessies',

  'analytics.format.text': 'Tekst',
  'analytics.format.image': 'Afbeelding',
  'analytics.format.carousel': 'Carrousel',
  'analytics.format.video': 'Video',
  'analytics.format.short_video': 'Kort filmpje',
  'analytics.format.long_video': 'Lang filmpje',
  'analytics.format.document': 'Documenteren',
  'analytics.format.thread': 'Draad',

  'analytics.value.unavailableReason.notImplemented':
    'Post Array heeft de mapping voor deze statistiek nog niet op {provider} gebouwd.',
  'analytics.value.estimated': 'Geschat',
  'analytics.value.estimatedMethod': 'Methode: {method}.',

  /* ----------------------------------------------------------------------
     Freshness and account attention
     ---------------------------------------------------------------------- */
  'analytics.freshness.title': 'Waar deze cijfers vandaan komen',
  'analytics.freshness.intro':
    'Aanbieders verzamelen volgens hun eigen schema. Niets op dit scherm is live.',
  'analytics.freshness.accountRow': '{account} op {provider}',
  'analytics.freshness.never': 'Nooit gesynchroniseerd',
  'analytics.freshness.nextAttempt': 'Volgende synchronisatiepoging {relativeTime}.',
  'analytics.freshness.openStatus': 'Aanbiederstatus',

  'analytics.accounts.title': 'Accounts die aandacht behoeven',
  'analytics.accounts.empty':
    'Elk verbonden account heeft in deze periode gegevens geretourneerd. Niets heeft jou hier nodig.',
  'analytics.accounts.reason.permission':
    'De analysetoestemming werd niet verleend toen dit account werd verbonden.',
  'analytics.accounts.reason.expired':
    'De toegang is verlopen, dus er is geen statistiek verzameld sinds {date}.',
  'analytics.accounts.reason.stale': 'De laatste succesvolle synchronisatie was {relativeTime}.',
  'analytics.accounts.reason.syncFailing':
    '{count, plural, one {# synchronisatiepoging} other {# synchronisatiepogingen}} is op rij mislukt. De geregistreerde reden was {reason}.',
  'analytics.accounts.reason.noPosts':
    'Er is niets gepubliceerd naar dit account in het geselecteerde bereik.',

  /* ----------------------------------------------------------------------
     Observations and next tests
     ---------------------------------------------------------------------- */
  'analytics.observations.title': 'Waarnemingen',
  'analytics.observations.intro':
    'Dit zijn beschrijvingen van wat de cijfers laten zien. Het zijn geen voorspellingen en ze leggen geen oorzaak vast.',
  'analytics.observations.empty':
    'Er is nog niet genoeg gepubliceerde geschiedenis om een patroon te beschrijven. Publiceer nog een paar berichten op hetzelfde account en in hetzelfde formaat.',
  'analytics.observations.citedPosts': 'Gebaseerd op',
  'analytics.observations.citedPeriod': 'Periode: {start} tot {end}.',
  'analytics.observations.nextTestTitle': 'Een test die u vervolgens kunt uitvoeren',
  'analytics.observations.nextTestBody':
    'Publiceer {count, plural, one {# meer bericht} other {# meer berichten}} op {account}, waarbij alleen {variable} wordt gewijzigd, en vergelijk vervolgens dezelfde statistiek. Tag het als een experiment voordat het wordt gepubliceerd, zodat de vergelijking wordt gepland in plaats van achteraf te worden gevonden.',
  'analytics.observations.tagFirst': 'Tag een experiment',

  /* ----------------------------------------------------------------------
     Charts
     ---------------------------------------------------------------------- */
  'analytics.chart.title': '{metric} in de loop van de tijd',
  'analytics.chart.summary':
    '{metric} op {account}, {count, plural, one {# punt} other {# punten}} van {start} naar {end}.',
  'analytics.chart.showTable': 'Toon als tabel',
  'analytics.chart.hideTable': 'Verberg de tabel',
  'analytics.chart.tableCaption': 'Dezelfde serie als een tafel.',
  'analytics.chart.columnPeriod': 'Periode',
  'analytics.chart.columnValue': 'Waarde',
  'analytics.chart.gapLabel': 'Geen gegevens verzameld',
  'analytics.chart.gapExplained':
    'Een breuk in de lijn betekent dat er voor die periode geen waarneming is verzameld. Het betekent niet nul.',
  'analytics.chart.annotation': 'Annotatie',
  'analytics.chart.pointLabel': '{period}: {value}',
  'analytics.chart.empty': 'Binnen dit bereik zijn geen waarnemingen verzameld.',

  /* ----------------------------------------------------------------------
     Experiments
     ---------------------------------------------------------------------- */
  'analytics.experiment.new': 'Plan een experiment',
  'analytics.experiment.empty':
    'Nog geen experimenten. Een experiment is een vergelijking die u maakt voordat u deze publiceert, en is de enige soort die een vraag kan beantwoorden.',
  'analytics.experiment.emptyExample':
    'Voorbeeld: publiceer dezelfde aankondiging twee keer op X, één keer met de link in het bericht en één keer met de link in de eerste opmerking, en vergelijk vervolgens het aantal klikken op de link gedurende 72 uur.',
  'analytics.experiment.name': 'Wat ben je aan het testen',
  'analytics.experiment.namePlaceholder': 'Eerste commentaar op 5 minuten tegen 30 minuten',
  'analytics.experiment.hypothesisPlaceholder':
    'Een kortere vertraging voordat de eerste reactie meer reacties op X oplevert.',
  'analytics.experiment.variantLabel': 'Variant {index}',
  'analytics.experiment.variantDescription': 'Wat is er anders in deze variant',
  'analytics.experiment.addVariant': 'Voeg een variant toe',
  'analytics.experiment.removeVariant': 'Variant {index} verwijderen',
  'analytics.experiment.accounts': 'Rekeningen inbegrepen',
  'analytics.experiment.windowHelp':
    'Statistieken blijven in beweging nadat een bericht live is gegaan. Repareer het venster nu zodat de vergelijking niet wordt gemaakt op een moment dat toevallig bij één variant past.',
  'analytics.experiment.windowDays':
    'Meet voor {count, plural, one {# dag} other {# dagen}} nadat elk bericht is gepubliceerd',
  'analytics.experiment.minSample': 'Minimale berichten per variant',
  'analytics.experiment.minSampleHelp':
    'Onder deze telling wordt het resultaat weergegeven als niet doorslaggevend in plaats van als winnaar.',
  'analytics.experiment.status.planned': 'Gepland',
  'analytics.experiment.status.collecting':
    'Verzamelen. {published} van {target}-berichten gepubliceerd.',
  'analytics.experiment.status.inconclusive': 'Compleet, geen duidelijk verschil',
  'analytics.experiment.result.difference':
    '{variant} registreerde {percent} meer {metric} dan {otherVariant}.',
  'analytics.experiment.result.noDifference':
    'De twee varianten liggen binnen {percent} van elkaar op {metric}. Dat ligt sowieso binnen het bereik waarin deze berichten variëren.',
  'analytics.experiment.result.association':
    'Dit is een associatie gemeten op {count, plural, one {# post} other {# posts}}. Het bewijst niet dat de verandering het verschil veroorzaakte.',
  'analytics.experiment.result.unavailable':
    '{metric} was niet beschikbaar voor {count, plural, one {# post} other {# posts}} in dit experiment, dus deze posts worden uitgesloten in plaats van als nul geteld.',
  'analytics.experiment.result.title': 'Resultaat',
  'analytics.experiment.completeNow': 'Sluit dit experiment',
  'analytics.experiment.completeConfirm':
    'Sluiting stopt met ophalen. De berichten blijven gepubliceerd en de cijfers blijven beschikbaar.',
  'analytics.experiment.postsTitle': 'Berichten in dit experiment',

  /* ----------------------------------------------------------------------
     Analytics states
     ---------------------------------------------------------------------- */
  'analytics.state.loading': 'Analyses laden voor de geselecteerde accounts',
  'analytics.state.loadingProvider': '{provider}-analyses ophalen',
  'analytics.state.empty': 'Niets gepubliceerd in dit bereik',
  'analytics.state.emptyBody':
    'Analytics beschrijft berichten die al zijn verschenen. Publiceer iets of verbreed het datumbereik.',
  'analytics.state.emptyExample':
    'Zodra een bericht live is, zie je een rij als: X @acme, "Thread starten", 12.400 vertoningen, 58 procent boven je mediaan van de vorige 10.',
  'analytics.state.errorTitle': 'Analytics kan niet worden geladen',
  'analytics.state.errorBody':
    'Er wordt geen getal getoond in plaats van een geraden getal. Uw berichten en ontvangstbewijzen blijven onaangetast.',
  'analytics.state.partialTitle': '{loaded} van de {total}-accounts hebben gegevens geretourneerd',
  'analytics.state.partialBody':
    'De accounts die hebben geantwoord, worden met hun eigen frisheid weergegeven. De rest wordt vermeld met de reden waarom ze dat niet deden.',
  'analytics.state.partialSucceeded': 'Geretourneerde gegevens',
  'analytics.state.partialFailed': 'Heeft geen gegevens geretourneerd',
  'analytics.state.offlineTitle': 'Je bent offline',
  'analytics.state.offlineBody':
    'De onderstaande figuren zijn geladen voordat de verbinding werd verbroken en zijn dus ouder dan de versheidslabels suggereren.',
  'analytics.state.permissionTitle': 'U kunt geen analyses zien in deze werkruimte',
  'analytics.state.permissionBody':
    'Analytics heeft de rol van analist of hoger nodig. Een eigenaar of beheerder van deze werkruimte kan deze verlenen.',
  'analytics.state.rateLimitTitle': '{provider} zijn snelheidsbeperkende analyseverzoeken',
  'analytics.state.rateLimitCause':
    'Het account heeft zijn deel van het providerquotum voor dit venster opgebruikt. Post Array probeert het niet harder, omdat dat de publicatie zou vertragen.',
  'analytics.state.rateLimitAlternative':
    'Verfijn het datumbereik of het accountfilter, waarbij de aanbieder om minder vraagt.',
  'analytics.state.rateLimitReset': 'Verzoeken CV',
  'analytics.state.reference': 'Diagnostische referentie',

  /* ======================================================================
     Tracked links (first party redirect measurement)
     ====================================================================== */
  'analytics.links.new': 'Maak een bijgehouden link',
  'analytics.links.empty': 'Nog geen gevolgde links',
  'analytics.links.emptyBody':
    'Een bijgehouden link is een korte URL waar Post Array doorheen verwijst, zodat u klikken kunt zien, zelfs als een platform geen klikken rapporteert. De oorspronkelijke bestemming wordt nooit gewijzigd zonder een auditinvoer.',
  'analytics.links.emptyExample':
    'Voorbeeld: pa.link/a7Kq2 verwijst door naar acme.com/blog/launch met campagne q3-launch.',
  'analytics.links.table.caption':
    'Bijgehouden links in deze werkruimte en het aantal eerste klikken van partijen.',
  'analytics.links.campaign': 'Campagne',
  'analytics.links.created': 'Gemaakt',
  'analytics.links.usedIn':
    '{count, plural, =0 {Nog niet gebruikt in een bericht} one {Gebruikt in # bericht} other {Gebruikt in # berichten}}',
  'analytics.links.state.active': 'Actief',
  'analytics.links.state.expired': 'Verlopen {date}',
  'analytics.links.state.disabled': 'Uitgeschakeld',
  'analytics.links.state.disabledAt':
    'Uitgeschakeld op {date}. Deze korte URL verwijst niet meer door.',
  'analytics.links.state.blocked': 'Geblokkeerd voor veiligheid',
  'analytics.links.state.blockedBody':
    'Deze omleiding is niet beschikbaar omdat de bestemming niet door een veiligheidscontrole kwam. Wijzig de bestemming of neem contact op met support.',
  'analytics.links.state.disabledReason':
    'Uitgeschakeld door {actor} op {date}. Reden geregistreerd: {reason}.',
  'analytics.links.detailTitle': 'Bijgehouden link {slug}',
  'analytics.links.exactRedirect': 'Exacte omleiding',
  'analytics.links.exactRedirectHelp':
    'Dit is de bestemming die een bezoeker op dit moment bereikt, inclusief elke UTM-parameter, volledig weergegeven en niet ingekort.',
  'analytics.links.editDestination': 'Wijzig de bestemming',
  'analytics.links.editDestinationWarning':
    'Het wijzigen van de bestemming heeft invloed op elke plaats waar deze link al is gepubliceerd. Rapporten voor perioden vóór de wijziging behouden de bestemming die op dat moment actief was.',
  'analytics.links.editDestinationAudit':
    'De wijziging wordt vastgelegd in het auditlogboek met uw naam, de oude bestemming en de nieuwe.',
  'analytics.links.destinationHistory': 'Bestemmingsgeschiedenis',
  'analytics.links.destinationHistoryRow': '{destination}, actief van {start} tot {end}',
  'analytics.links.destinationHistoryCurrent': '{destination}, actief sinds {start}',
  'analytics.links.domainLabel': 'Kort domein',
  'analytics.links.domainDefault': 'Post Array standaarddomein',
  'analytics.links.domainVerified': 'Geverifieerd door DNS op {date}',
  'analytics.links.domainPending': 'Wachten op het DNS-record',
  'analytics.links.domainPendingHelp':
    'Voeg het onderstaande TXT-record toe bij {domain} en controleer het vervolgens opnieuw. Totdat dit is geverifieerd, kan dit domein niet worden geselecteerd voor een nieuwe link.',
  'analytics.links.domainFailed': 'Het DNS-record kwam niet overeen met {date}',
  'analytics.links.domainCheck': 'Controleer DNS opnieuw',
  'analytics.links.expiry': 'Vervaldatum',
  'analytics.links.expiryNone': 'Geen vervaldatum ingesteld',
  'analytics.links.expiryHelp':
    'Na het verstrijken van de link retourneert de link een gewone pagina waarin staat dat deze is beëindigd. Er wordt nooit stilzwijgend ergens anders naar verwezen.',
  'analytics.links.disable': 'Schakel deze link nu uit',
  'analytics.links.disableTitle': '{slug} uitschakelen?',
  'analytics.links.disableBody':
    'Bezoekers komen op een pagina waarop staat dat de link niet langer beschikbaar is. Gepubliceerde berichten bevatten nog steeds de korte URL, dus deze is zichtbaar voor iedereen die klikt.',
  'analytics.links.disableReason': 'Reden voor uitschakelen',
  'analytics.links.enable': 'Schakel deze link opnieuw in',
  'analytics.links.abuseTitle': 'Meld misbruik van deze link',
  'analytics.links.abuseBody':
    'Als deze korte URL wordt gebruikt voor iets dat u niet bedoelde, rapporteer dit dan en de omleiding wordt opgeschort terwijl deze wordt beoordeeld.',
  'analytics.links.abuseAction': 'Rapporteer deze link',
  'analytics.links.measurementLabel': 'Meting van omleiding door eerste partij',
  'analytics.links.measurementExplained':
    'Post Array telt een verzoek wanneer de omleidingsservice om deze URL wordt gevraagd. Een gededupliceerde klik verwijdert herhaalde verzoeken van dezelfde bezoeker binnen een kort venster, en verzoeken die overeenkomen met bekende crawlerpatronen worden uitgesloten in plaats van verwijderd.',
  'analytics.links.botsNote':
    '{count, plural, one {# verzoek} other {# verzoeken}} zijn geclassificeerd als geautomatiseerd en zijn uitgesloten van de ontdubbelde telling.',
  'analytics.links.series.title': 'Verzoeken en gededupliceerde klikken in de loop van de tijd',
  'analytics.links.series.requests': 'Totaal aantal verzoeken',
  'analytics.links.series.clicks': 'Gededupliceerde klikken',
  'analytics.links.breakdownTitle': 'Waar de klikken vandaan kwamen',
  'analytics.links.breakdown.share': '{percent} gededupliceerde klikken',
  'analytics.links.referrer.direct': 'Geen verwijzer verzonden',
  'analytics.links.referrer.social': 'Sociaal platform',
  'analytics.links.referrer.search': 'Zoekmachine',
  'analytics.links.referrer.email': 'E-mailclient',
  'analytics.links.referrer.other': 'Andere website',
  'analytics.links.device.mobile': 'Mobiel',
  'analytics.links.device.desktop': 'Bureaublad',
  'analytics.links.device.tablet': 'Tablet',
  'analytics.links.device.unknown': 'Niet bepaald',
  'analytics.links.countryUnknown': 'Land niet bepaald',
  'analytics.links.lastEventLabel': 'Laatste klik',
  'analytics.links.noEvents': 'Er zijn nog geen klikken geregistreerd',
  'analytics.links.noEventsBody':
    'Deze link is niet meer aangevraagd sinds deze is gemaakt. Dat is een echte nul, gemeten door onze eigen omleidingsdienst.',
  'analytics.links.compareWarning':
    '{provider} rapporteert {providerValue}-linkklikken voor dit bericht. Post Array registreerde {relayValue} gededupliceerde klikken. De twee tellen verschillende gebeurtenissen en geen van beide vervangt de andere.',
  'analytics.links.errorTitle': 'Linkstatistieken konden niet worden geladen',
  'analytics.links.errorBody':
    'De omleidingsservice werkt nog steeds, dus de link blijft bezoekers naar de bestemming sturen. Alleen de rapportage wordt beïnvloed.',
  'analytics.links.createDestination': 'Bestemmings-URL',
  'analytics.links.createDestinationHelp':
    'Moet een openbaar https-adres zijn. Privénetwerkadressen en omleidingsketens worden afgewezen door de omleidingsservice.',
  'analytics.links.createCampaign': 'Campagnenaam',
  'analytics.links.createSlug': 'Aangepast einde',
  'analytics.links.createSlugHelp': 'Laat dit leeg en Post Array genereert een kort willekeurig einde.',
  'analytics.links.createUtm': 'UTM-parameters',
  'analytics.links.blockedScheme': 'Alleen https-bestemmingen worden geaccepteerd.',
  'analytics.links.blockedPrivate':
    'Dat adres bevindt zich op een particulier netwerk, dus de omleidingsservice accepteert het niet.',

  /* ======================================================================
     Automation: list and shell
     ====================================================================== */
  'automation.tab.rules': 'Regels',
  'automation.tab.feeds': 'RSS-feeds',
  'automation.tab.label': 'Automatiseringssecties',

  'automation.rules.table.caption': 'Automatiseringsregels in deze werkruimte.',
  'automation.rules.table.rule': 'Regel',
  'automation.rules.table.state': 'Staat',
  'automation.rules.table.accounts': 'Rekeningen',
  'automation.rules.table.lastRun': 'Laatste run',
  'automation.rules.table.nextCheck': 'Volgende controle',
  'automation.rules.neverRun': 'Nog niet uitgevoerd',
  'automation.rules.emptyExample':
    'Voorbeeld: wanneer een nieuw item verschijnt in de Acme-blogfeed en de taal Engels is, maakt u een concept op basis van de blogaankondigingssjabloon en vraagt u om goedkeuring.',
  'automation.rules.summaryAccounts':
    '{count, plural, =0 {Geen accounts geselecteerd} one {# account} other {# accounts}}',
  'automation.rules.openRule': 'Open {name}',
  'automation.rules.duplicateRule': 'Dupliceer {name}',
  'automation.rules.deleteTitle': '{name} verwijderen?',
  'automation.rules.deleteBody':
    'De regel stopt onmiddellijk en de uitvoeringsgeschiedenis wordt bewaard voor het auditlogboek. Dit heeft geen invloed op berichten die al zijn gemaakt.',

  /* ----------------------------------------------------------------------
     Catalog entries the shared automation vocabulary does not cover yet
     ---------------------------------------------------------------------- */
  'automation.trigger.commentFailed': 'een gepland commentaar of draaditem mislukt',

  'automation.condition.timeWindow': 'de tijd ligt tussen {start} en {end} in {timeZone}',
  'automation.condition.domainPresent': 'de tekst linkt naar {domain}',
  'automation.condition.hashtagPresent': 'de tekst bevat de hashtag {hashtag}',
  'automation.condition.providerCapability': 'het account kan daadwerkelijk {capability} doen',
  'automation.condition.planStatus': 'het abonnement is actief',

  'automation.action.continueSequence': 'ga door met de voorbereide thread of commentaarreeks',
  'automation.action.notifyEmail': 'stuur een e-mail naar {target}',
  'automation.action.notifyWebhook': 'stuur een webhook naar {target}',
  'automation.action.pauseConnection': 'onderbreek het getroffen account',
  'automation.action.quotePost': 'citeer het bronbericht een keer',
  'automation.action.followUpComment': 'voeg een voorbereid commentaar toe aan het bronbericht',

  'automation.param.feed': 'Voer',
  'automation.param.template': 'Sjabloon',
  'automation.param.signature': 'Handtekening',
  'automation.param.disclosure': 'Openbaarmaking',
  'automation.param.locale': 'Taal',
  'automation.param.project': 'Project',
  'automation.param.campaign': 'Campagne',
  'automation.param.account': 'Rekening',
  'automation.param.platform': 'Platform',
  'automation.param.contentType': 'Inhoudstype',
  'automation.param.keyword': 'Trefwoord',
  'automation.param.hashtag': 'Hashtag',
  'automation.param.domain': 'Domein',
  'automation.param.capability': 'Vermogen',
  'automation.param.timeZone': 'Tijdzone',
  'automation.param.startTime': 'Van',
  'automation.param.endTime': 'Aan',
  'automation.param.duration': 'Duur',
  'automation.param.metric': 'Metrisch',
  'automation.param.value': 'Waarde',
  'automation.param.target': 'Verzenden naar',
  'automation.param.time': 'Tijd',
  'automation.param.cadence': 'Hoe vaak',
  'automation.param.notSet': 'niet ingesteld',

  /* ----------------------------------------------------------------------
     Sentence builder
     ---------------------------------------------------------------------- */
  'automation.editor.name': 'Regelnaam',
  'automation.editor.namePlaceholder': 'Van bloggen naar sociaal',
  'automation.editor.when': 'Wanneer',
  'automation.editor.if': 'Als',
  'automation.editor.then': 'Dan',
  'automation.editor.after': 'Na',
  'automation.editor.until': 'Tot',
  'automation.editor.sentenceLabel': 'Regel zin',
  'automation.editor.readBack': 'Lees de zin terug voordat je dit aanzet. Het is de hele regel.',
  'automation.editor.chooseTrigger': 'Kies waarmee deze regel begint',
  'automation.editor.addCondition': 'Voeg een voorwaarde toe',
  'automation.editor.addAction': 'Voeg een actie toe',
  'automation.editor.removeCondition': 'Verwijder de voorwaarde {label}',
  'automation.editor.removeAction': 'Verwijder de actie {label}',
  'automation.editor.moveActionUp': 'Verplaats {label} eerder',
  'automation.editor.moveActionDown': 'Verplaats {label} later',
  'automation.editor.actionOrder':
    'Acties worden in deze volgorde uitgevoerd, van boven naar beneden.',
  'automation.editor.noConditions':
    'Geen voorwaarden. De regel wordt elke keer uitgevoerd wanneer deze wordt geactiveerd.',
  'automation.editor.noActions':
    'Nog geen acties. Een regel zonder actie kan niet worden opgeslagen.',
  'automation.editor.delayNone': 'geen vertraging',
  'automation.editor.delayLabel': 'Vertraging voordat de acties worden uitgevoerd',
  'automation.editor.endLabel': 'Wanneer deze regel stopt',
  'automation.editor.end.manual': 'Ik schakel dit uit',
  'automation.editor.end.date': 'een datum die ik kies',
  'automation.editor.end.count':
    'het heeft {count, plural, one {# keer} other {# keer}} uitgevoerd',
  'automation.editor.end.dateValue': 'Stop maar',
  'automation.editor.end.countValue': 'Stop na zoveel runs',
  'automation.editor.parameterFor': 'Instellingen voor {label}',
  'automation.editor.saveDraft': 'Opslaan als concept',
  'automation.editor.savedAt': '{time} opgeslagen',
  'automation.editor.unsaved': 'Niet-opgeslagen wijzigingen',

  'automation.editor.view.sentence': 'Zin',
  'automation.editor.view.structured': 'Gestructureerd',
  'automation.editor.view.api': 'API-weergave',
  'automation.editor.view.label': 'Editor-weergave',
  'automation.editor.apiHelp':
    'Dit is precies wat de REST API, de CLI en de MCP-server verzenden. Als u het hier bewerkt en terugschakelt naar de zin, blijft elk veld behouden.',
  'automation.editor.apiInvalid':
    'Dit is geen geldige regel-JSON, dus deze is niet toegepast: {reason}',
  'automation.editor.apiApply': 'Pas deze JSON toe',
  'automation.editor.structuredHelp':
    'Dezelfde regel als velden. Gebruik dit als een regel veel voorwaarden heeft en de zin lang wordt.',

  'automation.editor.error.noAction': 'Voeg ten minste één actie toe voordat u opslaat.',
  'automation.editor.error.noTrigger': 'Kies een trigger voordat u opslaat.',
  'automation.editor.error.noAccounts':
    'Kies ten minste één account waarop deze regel van toepassing kan zijn.',
  'automation.editor.error.missingParameter': '{label} heeft een waarde nodig.',
  'automation.editor.error.summary':
    '{count, plural, one {# ding heeft je aandacht nodig} other {# dingen hebben je aandacht nodig}} voordat deze regel kan worden opgeslagen.',

  /* ----------------------------------------------------------------------
     Trigger, condition and action pickers
     ---------------------------------------------------------------------- */
  'automation.picker.triggerTitle': 'Waarmee begint deze regel',
  'automation.picker.conditionTitle': 'Voeg een voorwaarde toe',
  'automation.picker.actionTitle': 'Voeg een actie toe',
  'automation.picker.search': 'Filter deze lijst',
  'automation.picker.noResults': 'Niets in deze lijst komt overeen met wat u heeft getypt.',
  'automation.picker.groupContent': 'Inhoud',
  'automation.picker.groupPublishing': 'Publiceren',
  'automation.picker.groupNotify': 'Mensen en systemen',
  'automation.picker.groupControl': 'Regelcontrole',
  'automation.picker.groupSchedule': 'Tijd',
  'automation.picker.groupExternal': 'Externe evenementen',
  'automation.picker.groupMeasurement': 'Meting',
  'automation.picker.hiddenForProvider':
    '{count, plural, one {# actie is} other {# acties zijn}} niet vermeld omdat de geselecteerde accounts deze niet kunnen uitvoeren.',
  'automation.picker.hiddenDetail': '{action} is niet beschikbaar voor {provider}. {reason}',
  'automation.picker.consequential': 'Creëert iets op een platform',
  'automation.picker.internalOnly': 'Blijft binnen Post Array',

  'automation.accounts.label': 'Accounts waarop deze regel van toepassing kan zijn',
  'automation.accounts.help':
    'Een regel kan nooit van invloed zijn op een account dat hier niet wordt vermeld, ongeacht de voorwaarden ervan.',
  'automation.accounts.none': 'Nog geen accounts geselecteerd',

  /* ----------------------------------------------------------------------
     Engagement threshold controls
     ---------------------------------------------------------------------- */
  'automation.threshold.title': 'Meetregels voor deze trigger',
  'automation.threshold.intro':
    'Een regel die op een getal reageert, moet weten welk getal, gemeten over welke periode, en hoe vaak het kan optreden.',
  'automation.threshold.metric': 'Metrisch om naar te kijken',
  'automation.threshold.value': 'Drempelwaarde',
  'automation.threshold.window': 'Meetvenster',
  'automation.threshold.windowHelp':
    'Geteld vanaf het moment dat het bronbericht werd gepubliceerd. Buiten dit venster stopt de regel met het bekijken van de post.',
  'automation.threshold.expiry': 'Stop daarna met het bekijken van een bericht',
  'automation.threshold.cooldown': 'Cooldown tussen executies',
  'automation.threshold.cooldownHelp':
    'De kortste toegestane tijd tussen twee runs voor hetzelfde bronbericht.',
  'automation.threshold.maxPerPost': 'Maximale uitvoeringen per bronpost',
  'automation.threshold.defaultsTitle':
    'Standaardwaarden die ingeschakeld blijven, tenzij u ze wijzigt',
  'automation.threshold.defaultOncePerPost': 'Eén keer uitvoeren per bronpost.',
  'automation.threshold.defaultStale':
    'Voer deze niet uit als de statistiek niet beschikbaar of verouderd is. De gebruikte versheidslimiet is {duration}.',
  'automation.threshold.staleLimit': 'Behandel een metriek daarna als verouderd',
  'automation.threshold.providerNote':
    '{provider} meldt {metric} met vertraging, dus deze regel kan pas in werking treden nadat de provider het nummer heeft gepubliceerd.',

  /* ----------------------------------------------------------------------
     Cross account follow up
     ---------------------------------------------------------------------- */
  'automation.crossAccount.title': 'Opvolgen vanaf een ander account',
  'automation.crossAccount.off': 'Uit. Deze regel werkt alleen op het bronaccount.',
  'automation.crossAccount.enable': 'Sta een vervolgactie vanaf een ander account toe',
  'automation.crossAccount.body':
    'Beide accounts moeten verbonden zijn met deze werkruimte en beide moeten hier een naam hebben. Het vervolg is een voorbereid bericht dat u van tevoren schrijft, en het volgt hetzelfde goedkeuringsbeleid als al het andere.',
  'automation.crossAccount.sourceAccount': 'Bronaccount',
  'automation.crossAccount.followUpAccount': 'Account dat de follow-up publiceert',
  'automation.crossAccount.preauthorize':
    'Ik bevestig dat deze werkruimte zowel {sourceAccount} als {followUpAccount} beheert, en dat het vervolg niet als onafhankelijke goedkeuring wordt gepresenteerd.',
  'automation.crossAccount.preauthorizeRequired':
    'Bevestig de pre-autorisatie voordat deze regel kan worden opgeslagen.',
  'automation.crossAccount.duplicateCheck':
    'Cross-account duplicaat- en cadanscontroles worden uitgevoerd vóór de follow-up, en deze worden overgeslagen in plaats van uitgesteld als de bronpost wordt herhaald.',

  /* ----------------------------------------------------------------------
     Preflight
     ---------------------------------------------------------------------- */
  'automation.preflight.intro':
    'Alles wat deze regel kan doen, voordat hij er ook maar iets van kan doen.',
  'automation.preflight.accountsLabel': 'Accounts waarop het kan reageren',
  'automation.preflight.maxActionsLabel': 'De meeste externe acties per run',
  'automation.preflight.maxActionsPeriod':
    'Maximaal {count, plural, one {# externe actie} other {# externe acties}} in {period}.',
  'automation.preflight.approvalLabel': 'Goedkeuring',
  'automation.preflight.approvalNone':
    'Geen enkele actie in deze regel creëert iets op een platform, dus er is geen goedkeuring van toepassing.',
  'automation.preflight.providerLabel': 'Beperkingen van aanbieders',
  'automation.preflight.providerNone': 'Geen enkele is van toepassing op de acties in deze regel.',
  'automation.preflight.costLabel': 'Geschatte gemeten kosten',
  'automation.preflight.costUnknown':
    'De kosten voor deze acties kunnen pas worden geschat als de prijs van de aanbieder bekend is.',
  'automation.preflight.costMethod':
    'Geschat op basis van de prijslijst van de aanbieder op {date}. Op de kassabon staat vermeld wat er daadwerkelijk in rekening is gebracht.',
  'automation.preflight.cadenceLabel': 'Cadans en duplicaten',
  'automation.preflight.cadenceBody':
    'Vóór elke actie worden duplicaat- en cadanscontroles uitgevoerd. Een actie die het cadansbudget voor een account zou overschrijden, wordt overgeslagen en geregistreerd, en niet in de wachtrij geplaatst.',
  'automation.preflight.failureLabel': 'Als een run mislukt',
  'automation.preflight.failure.pauseAfter':
    'De regel pauzeert na {count, plural, one {# opeenvolgende mislukkingen} other {# opeenvolgende mislukkingen}} en archiveert een actie-item.',
  'automation.preflight.failure.continue':
    'De regel blijft actief en elke fout wordt vastgelegd in het uitvoeringslogboek.',
  'automation.preflight.exampleLabel': 'Voorbeeld uitgevoerd',
  'automation.preflight.exampleIntro':
    'Bij gebruik van de meest recente gebeurtenis zou deze trigger overeenkomen.',
  'automation.preflight.exampleNone':
    'Er heeft nog geen overeenkomende gebeurtenis plaatsgevonden, dus er kan geen voorbeeld worden getoond. Voer in plaats daarvan een testgebeurtenis uit.',
  'automation.preflight.activate': 'Schakel deze regel in',
  'automation.preflight.activateConfirmTitle': '{name} inschakelen?',
  'automation.preflight.activateConfirmBody':
    'Vanaf nu geldt deze regel zonder dat u dit eerst hoeft te vragen, binnen de hierboven genoemde limieten.',
  'automation.preflight.blocked':
    'Deze regel kan nog niet worden ingeschakeld. {count, plural, one {# item} other {# items}} hierboven heeft een beslissing nodig.',

  /* ----------------------------------------------------------------------
     Test runs, runs, versions, kill switch
     ---------------------------------------------------------------------- */
  'automation.test.title': 'Testevenement',
  'automation.test.body':
    'Een testrun evalueert de hele zin en laat zien wat deze zou doen. Het publiceert nooit, plaatst nooit commentaar en stuurt nooit een webhook naar een echt eindpunt.',
  'automation.test.useLastEvent': 'Gebruik de meest recente overeenkomende gebeurtenis',
  'automation.test.usePayload': 'Plak een gebeurtenispayload',
  'automation.test.run': 'Voer de test uit',
  'automation.test.running': 'Het uitvoeren van de test',
  'automation.test.resultTitle': 'Wat de test deed',
  'automation.test.conditionPassed': '{condition} geslaagd',
  'automation.test.conditionFailed': '{condition} ging niet door, dus de regel stopte hier',
  'automation.test.actionSimulated': '{action} zou worden uitgevoerd',
  'automation.test.actionSkipped': '{action} zou worden overgeslagen: {reason}',
  'automation.test.noExternalEffect': 'Tijdens deze test is er niets meer van Post Array overgebleven.',
  'automation.test.failed': 'De test kan niet worden voltooid: {reason}',

  'automation.runs.table.caption': 'Recente uitvoeringen van deze regel.',
  'automation.runs.startedAt': 'Gestart',
  'automation.runs.outcome.label': 'Resultaat',
  'automation.runs.actionsTaken': 'Acties',
  'automation.runs.trigger': 'Getriggerd door',
  'automation.runs.outcome.completed': 'Voltooid',
  'automation.runs.outcome.skipped': 'Overgeslagen',
  'automation.runs.outcome.failed': 'Mislukt',
  'automation.runs.outcome.testMode': 'Testmodus',
  'automation.runs.actionCount':
    '{count, plural, =0 {Geen externe actie} one {# externe actie} other {# externe acties}}',
  'automation.runs.skippedReason': 'Overgeslagen omdat {reason}',
  'automation.runs.openDetail': 'Open de run vanaf {time}',
  'automation.runs.createdItems': 'Gemaakt',

  'automation.versions.caption': 'Elke opgeslagen versie van deze regel.',
  'automation.versions.current': 'Huidig',
  'automation.versions.savedBy': 'Bewaard door {actor} op {date}',
  'automation.versions.compare': 'Vergelijk met de huidige versie',
  'automation.versions.restore': 'Herstel deze versie',
  'automation.versions.restoreConfirm':
    'Door te herstellen wordt een nieuwe versie gemaakt. Er wordt niets overschreven en de regel blijft in de huidige staat totdat u deze inschakelt.',
  'automation.versions.diffTitle': 'Versie {from} vergeleken met versie {to}',

  'automation.kill.title': 'Stop {name} nu',
  'automation.kill.body':
    'De regel stopt onmiddellijk, midden in een run als er een plaatsvindt. Alles wat al naar een platform is verzonden, blijft gepubliceerd, omdat een extern bericht nooit wordt teruggedraaid.',
  'automation.kill.confirmPhrase': 'STOP',
  'automation.kill.confirmLabel': 'Typ STOP om te bevestigen',
  'automation.kill.stopped':
    'Deze regel werd stopgezet door {actor} op {date}. Het kan niet opnieuw worden uitgevoerd totdat u het weer inschakelt.',

  /* ----------------------------------------------------------------------
     Automation states
     ---------------------------------------------------------------------- */
  'automation.state.loading': 'Automatiseringsregels laden',
  'automation.state.loadingRule': 'De regel en de recente uitvoeringen ervan worden geladen',
  'automation.state.errorTitle': 'De regels konden niet worden geladen',
  'automation.state.errorBody':
    'Reeds lopende regels worden hierdoor niet beïnvloed. Alleen dit scherm mislukte.',
  'automation.state.offlineTitle': 'Je bent offline',
  'automation.state.offlineBody':
    'U kunt een regel lezen en het concept bewerken, maar het blijft op dit apparaat staan. Voor het opslaan, testen en inschakelen van een regel is een verbinding nodig.',
  'automation.state.permissionTitle': 'U kunt de automatiseringsregels niet wijzigen',
  'automation.state.permissionBody':
    'Regels zijn van toepassing op verbonden accounts, dus voor het wijzigen ervan is de managerrol of hoger nodig. U kunt nog steeds elke regel en de bijbehorende rungeschiedenis lezen.',
  'automation.state.rateLimitTitle': 'Regelruns worden vertraagd',
  'automation.state.rateLimitCause':
    'Deze werkruimte heeft de toegestane hoeveelheid automatiseringsruns voor het huidige venster bereikt. Geplande berichten en handmatig publiceren worden niet beïnvloed.',
  'automation.state.rateLimitAlternative':
    'Regels met een cadans kunnen een langer interval krijgen, waardoor er minder runs nodig zijn.',

  /* ======================================================================
     RSS autopost
     ====================================================================== */
  'automation.rss.subtitle':
    'Zet een feed om in concepten of geplande berichten, met dezelfde validatie en goedkeuring als alles wat u zelf schrijft.',
  'automation.rss.empty': 'Nog geen feeds',
  'automation.rss.emptyBody':
    'Voeg een feed toe en Post Array controleert deze volgens een schema. Elk nieuw item wordt een concept, een gepland bericht of een goedkeuringsverzoek, wat u ook kiest.',
  'automation.rss.emptyExample':
    'Voorbeeld: de Acme-blogfeed maakt elke keer dat een artikel wordt gepubliceerd een concept voor X en LinkedIn, en wacht op goedkeuring.',
  'automation.rss.table.caption': 'Voedt peilingen van deze werkruimte.',
  'automation.rss.table.feed': 'Voer',
  'automation.rss.table.policy': 'Wat gebeurt er met een nieuw artikel',
  'automation.rss.table.health': 'Gezondheid',

  'automation.rss.step.url': 'Feed-adres',
  'automation.rss.step.preview': 'Controleer de feed',
  'automation.rss.step.seen': 'Uitgangspunt',
  'automation.rss.step.targets': 'Waar het heen gaat',
  'automation.rss.step.template': 'Wat het bericht zegt',
  'automation.rss.step.policy': 'Hoe het wordt gepubliceerd',
  'automation.rss.stepOf': 'Stap {current} van {total}',

  'automation.rss.urlHelp':
    'Post Array haalt de feed op van onze servers, niet van uw browser. Privénetwerkadressen worden geweigerd.',
  'automation.rss.validateAction': 'Controleer deze feed',
  'automation.rss.validateFailed': 'Dat adres heeft geen leesbare feed opgeleverd',
  'automation.rss.validateFailedReason': 'Wat we terug kregen: {reason}',
  'automation.rss.validateBlocked':
    'Dat adres verwijst naar een particulier netwerk en is dus niet opgehaald.',
  'automation.rss.previewTitle': 'Feedvoorbeeld',
  'automation.rss.previewMeta':
    '{title}. {count, plural, one {# item} other {# items}} terug, nieuwste eerst.',
  'automation.rss.previewItemPublished': 'Gepubliceerd {dateTime}',
  'automation.rss.previewNoImage': 'Geen afbeelding in dit artikel',
  'automation.rss.previewImageAlt': 'Afbeelding uit het feeditem {title}',
  'automation.rss.previewNoDate':
    'Dit item heeft geen tijdstempel, dus Post Array gebruikt de tijd waarop het het voor het eerst zag.',
  'automation.rss.previewFieldsTitle': 'Velden die deze feed biedt',
  'automation.rss.previewFieldMissing': 'Niet aanwezig in deze feed',

  'automation.rss.seenTitle': 'Wat telt als al gezien',
  'automation.rss.seenLatest':
    'Behandel alles wat momenteel in de feed staat zoals gezien. Er worden alleen toekomstige artikelen geplaatst.',
  'automation.rss.seenAll':
    'Behandel het nieuwste artikel als nieuw en plaats het bij de volgende controle.',
  'automation.rss.seenHelp':
    'De meeste feeds bevatten oude artikelen. Door voor de eerste optie te kiezen, voorkomt u dat u een achterstand publiceert.',

  'automation.rss.targetsHelp':
    'Kies de accounts of de opgeslagen groep. Elk doel krijgt nog steeds zijn eigen validatie voordat er iets wordt gepland.',
  'automation.rss.targetGroup': 'Opgeslagen groep',
  'automation.rss.targetIndividual': 'Individuele rekeningen',

  'automation.rss.templateFields': 'Beschikbare velden',
  'automation.rss.templateInsert': 'Voer {field} in',
  'automation.rss.templateField.title': 'Titel van item',
  'automation.rss.templateField.summary': 'Artikeloverzicht',
  'automation.rss.templateField.link': 'Artikellink',
  'automation.rss.templateField.author': 'Auteur van item',
  'automation.rss.templateField.published': 'Publicatiedatum',
  'automation.rss.templateField.categories': 'Categorieën',
  'automation.rss.templatePreview': 'Preview met het nieuwste item',
  'automation.rss.adaptWithAi': 'Pas de tekst voor elk doel aan',
  'automation.rss.adaptHelp':
    'De formulering is herschreven om op elk platform te passen en wordt weergegeven als een verschil dat u accepteert of afwijst. Media zijn afkomstig van het feeditem. Post Array genereert geen afbeeldingen.',
  'automation.rss.noImageGeneration':
    'Als een feeditem geen afbeelding heeft, wordt het bericht zonder afbeelding verzonden.',
  'automation.rss.imageFromFeed': 'Gebruik de afbeelding uit het feeditem als deze er is',

  'automation.rss.policyHelp':
    'Een feeditem is niet bijzonder. Het volgt hetzelfde goedkeuringsbeleid als een bericht dat u zelf schrijft.',
  'automation.rss.cadenceInterval': 'Maximaal één item per stuk',
  'automation.rss.cadenceHelp':
    'Extra items wachten in de wachtrij in plaats van samen te publiceren, dus een feed die tien artikelen tegelijk plaatst, overspoelt een account niet.',
  'automation.rss.immediateWarning':
    'Bij onmiddellijke publicatie wordt een bericht naar een platform verzonden zonder dat iemand het eerst leest. Het is alleen beschikbaar als het goedkeuringsbeleid voor deze accounts dit toestaat.',

  'automation.rss.healthTitle': 'Voed gezondheid',
  'automation.rss.healthOk': 'Werken',
  'automation.rss.healthStalled': 'Geen nieuw item voor {duration}',
  'automation.rss.healthFailing':
    'De laatste {count, plural, one {controle} other {# controles}} is mislukt',
  'automation.rss.health.nextPoll': 'Controleer vervolgens {relativeTime}',
  'automation.rss.health.itemsProcessed':
    '{count, plural, =0 {Nog geen artikelen verwerkt} one {# artikel verwerkt} other {# artikelen verwerkt}}',
  'automation.rss.health.duplicatesSkipped':
    '{count, plural, =0 {Geen duplicaten overgeslagen} one {# duplicaat overgeslagen} other {# duplicaten overgeslagen}}',
  'automation.rss.health.lastPollLabel': 'Laatst gecontroleerd',
  'automation.rss.health.lastItemLabel': 'Laatste nieuwe item in de feed',
  'automation.rss.health.lastPostLabel': 'Laatste concept of bericht gemaakt',
  'automation.rss.health.processedLabel': 'Artikelen verwerkt',
  'automation.rss.recentItems': 'Recente artikelen',
  'automation.rss.itemOutcome.draft': 'Concept gemaakt',
  'automation.rss.itemOutcome.scheduled': 'Gepland voor {time}',
  'automation.rss.itemOutcome.published': 'Gepubliceerd',
  'automation.rss.itemOutcome.awaitingApproval': 'Wachten op goedkeuring',
  'automation.rss.itemOutcome.duplicate': 'Overgeslagen, al gezien',
  'automation.rss.itemOutcome.failed': 'Mislukt: {reason}',
  'automation.rss.pauseFeed': 'Pauzeer deze feed',
  'automation.rss.resumeFeed': 'Hervat deze feed',
  'automation.rss.deleteTitle': '{title} verwijderen?',
  'automation.rss.deleteBody':
    'Post Array stopt met het controleren van deze feed. Concepten en berichten die al zijn gemaakt, blijven precies zoals ze zijn.',
  'automation.rss.errorTitle': 'Deze feed kan niet worden gelezen',
  'automation.rss.errorBody':
    'Post Array blijft het normale schema controleren. Van een gedeeltelijke reactie is niets gepubliceerd.',

  /* ----------------------------------------------------------------------
     What Post Array refuses to automate
     ---------------------------------------------------------------------- */
  'automation.refuse.title': 'In geen enkele regel beschikbaar',
  'automation.refuse.body':
    'Automatisch leuk vinden en volgen, betrokkenheidsgroepen, ongevraagde antwoorden en berichten, en het plaatsen van dezelfde inhoud vanuit verschillende accounts om het populair te laten lijken, zijn hier geen opties. Platforms verbieden ze en ze beschadigen de accounts die ze gebruiken.',
  'automation.refuse.readPolicy': 'Lees het beleid voor acceptabel gebruik',
} as const;
