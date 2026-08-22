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
  'analytics.chart.legend': 'Serier som visas i detta diagram',
  'analytics.tab.overview': 'Översikt',
  'analytics.tab.experiments': 'Experiment',
  'analytics.tab.links': 'Spårade länkar',
  'analytics.tab.label': 'Analytics avsnitt',

  'analytics.question.baseline': 'Vilka inlägg flyttade bort från din egen baslinje?',
  'analytics.question.baselineHelp':
    'Varje inlägg jämförs med dina egna senaste inlägg på samma konto och i samma format. Ingenting här jämför dig med en annan arbetsplats eller ett annat företag.',
  'analytics.question.accounts': 'Vilka konton behöver uppmärksamhet?',
  'analytics.question.next': 'Vad är värt att testa härnäst?',

  'analytics.filter.project': 'Projekt',
  'analytics.filter.accounts': 'konton',
  'analytics.filter.allAccounts': 'Alla anslutna konton',
  'analytics.filter.range': 'Datumintervall',
  'analytics.filter.format': 'Innehållsformat',
  'analytics.filter.allFormats': 'Alla format',
  'analytics.filter.comparePrevious': 'Jämför med föregående period',
  'analytics.filter.applied':
    '{count, plural, =0 {Inga filter} one {# filter} other {# filter}} tillämpas. {results, plural, =0 {Inga inlägg matchar} one {# inlägg matchar} other {# inlägg matchar}}.',

  'analytics.rankMetric.label': 'Rangordna inlägg efter',
  'analytics.rankMetric.help':
    'Det finns ingen sammanlagd poäng i stafett. Välj ett mätvärde vars definition du litar på och tabellen ordnas enbart efter det måttet.',
  'analytics.rankMetric.chosen':
    'Rangordnad efter {metric}, enligt rapportering från varje kontoleverantör.',

  /* ----------------------------------------------------------------------
     Outcome groups. Never summed together.
     ---------------------------------------------------------------------- */
  'analytics.outcome.awareness': 'Medvetenhet',
  'analytics.outcome.awarenessHelp':
    'Hur många gånger inlägget har levererats eller setts. Leverantörer räknar detta olika, så ett värde är bara jämförbart med sig självt över tid.',
  'analytics.outcome.consumption': 'Konsumtion',
  'analytics.outcome.consumptionHelp':
    'Hur mycket av inlägget folk faktiskt tittade på eller läste.',
  'analytics.outcome.interaction': 'Interaktion',
  'analytics.outcome.interactionHelp':
    'Vad folk gjorde på plattformen: gilla-markeringar, kommentarer, delningar och sparningar.',
  'analytics.outcome.conversion': 'Konvertering',
  'analytics.outcome.conversionHelp':
    'Vad folk gjorde efter att ha lämnat plattformen. Endast spårade länkar kan svara på detta, och endast för de länkar du valt att spåra.',
  'analytics.outcome.separateNote':
    'Dessa fyra grupper räknas separat. Att lägga ihop dem skulle räkna samma person mer än en gång.',

  /* ----------------------------------------------------------------------
     Comparison table
     ---------------------------------------------------------------------- */
  'analytics.table.caption':
    'Inlägg publicerade i det valda intervallet, med var och en jämfört med din egen senaste baslinje.',
  'analytics.table.post': 'Posta',
  'analytics.table.account': 'konto',
  'analytics.table.format': 'Format',
  'analytics.table.published': 'Publicerad',
  'analytics.table.value': 'Värde',
  'analytics.table.delta': 'Mot baslinjen',
  'analytics.table.sample': 'Prov',
  'analytics.table.sampleSize': 'n = {count}',
  'analytics.table.evidence': 'Bevis',
  'analytics.table.openEvidence': 'Visa bevisen för {post}',
  'analytics.table.rowActions': 'Åtgärder för {post}',
  'analytics.table.openPost': 'Öppna inläggsstatistik',
  'analytics.table.openReceipt': 'Öppna publikationskvitto',
  'analytics.table.noBaseline': 'Ingen baslinje ännu',
  'analytics.table.noBaselineReason':
    'Det finns färre än {required} jämförbara inlägg på det här kontot. En jämförelse skulle vara brus, så inget visas.',
  'analytics.table.sortBy': 'Sortera efter {column}',
  'analytics.table.detailToggle': 'Detaljer',

  'analytics.delta.above': '{percent} över baslinjen',
  'analytics.delta.below': '{percent} under baslinjen',
  'analytics.delta.level': 'I linje med baslinjen',
  'analytics.delta.unavailable': 'Ingen jämförelse',

  'analytics.evidence.title': 'Hur denna jämförelse gjordes',
  'analytics.evidence.baseline':
    'Baslinje: medianen {metric} för föregående {count, plural, one {# jämförbart inlägg} other {# jämförbara inlägg}} den {account}.',
  'analytics.evidence.comparableBy':
    'Jämförbar betyder samma konto, samma innehållsformat ({format}) och en publiceringstid inom samma period.',
  'analytics.evidence.postsUsed': 'Inlägg som används för baslinjen',
  'analytics.evidence.excluded':
    '{count, plural, =0 {Inga inlägg exkluderades} one {# inlägg exkluderades} other {# inlägg exkluderades}} eftersom måttet inte var tillgängligt för dem.',
  'analytics.evidence.smallSample':
    'Med {count, plural, one {# inlägg} other {# inlägg}} i baslinjen flyttar ett enda ovanligt inlägg medianen långt. Behandla detta som en signal att testa igen, inte som ett resultat.',
  'analytics.evidence.confounders': 'Vad detta inte står för',
  'analytics.evidence.confounder.time':
    'Publiceringstiden på dygnet varierade mellan baslinjeinläggen.',
  'analytics.evidence.confounder.format':
    'Bildinlägg och videoinlägg är inte direkt jämförbara här.',
  'analytics.evidence.confounder.followers':
    'Antalet följare på {account} ändrades med {percent} under denna period.',
  'analytics.evidence.confounder.paid':
    'Relay kan inte avgöra om något av dessa inlägg har fått betald distribution.',
  'analytics.evidence.confounder.provider':
    '{provider} ändrade hur den rapporterar {metric} under denna period.',

  /* ----------------------------------------------------------------------
     Metric definitions
     ---------------------------------------------------------------------- */
  'analytics.definition.open': 'Vad {metric} betyder',
  'analytics.definition.inlineHeading': 'Definition',
  'analytics.definition.observedAt': 'Observerade {dateTime}.',
  'analytics.definition.sourceLink': 'Leverantörsdokumentation',
  'analytics.definition.verifiedOn': 'Kontrolleras mot leverantörens dokumentation på {date}.',
  'analytics.definition.panelTitle': 'Metriska definitioner i denna vy',
  'analytics.definition.panelIntro':
    'Varje nummer på den här skärmen kommer från ett namngivet leverantörsfält. Definitionerna nedan upprepas också bredvid varje värde, så inget viktigt finns bara i ett verktygstips.',
  'analytics.definition.aggregation.sum': 'Aggregeras genom att lägga till varje observation.',
  'analytics.definition.aggregation.average': 'Aggregerad som medelvärde.',
  'analytics.definition.aggregation.median': 'Aggregerad som median.',
  'analytics.definition.aggregation.last': 'Den senaste observationen.',
  'analytics.definition.aggregation.delta': 'Förändringen mellan första och sista observationen.',
  'analytics.definition.aggregation.none': 'Rapporteras som en enda observation.',
  'analytics.definition.denominator.none': 'Detta är en räkning, inte en ränta.',
  'analytics.definition.historyWindow':
    '{provider} behåller {days, plural, one {# dag} other {# dagar}} av historik för detta fält.',
  'analytics.definition.historyWindowNone': '{provider} anger ingen historikgräns för detta fält.',

  'analytics.definition.term.providerField': 'Leverantörsfält',
  'analytics.definition.term.unit': 'Enhet',
  'analytics.definition.term.denominator': 'Nämnare',
  'analytics.definition.term.aggregation': 'Hur det är aggregerat',
  'analytics.definition.term.history': 'Historik som leverantören behåller',
  'analytics.definition.term.definition': 'Vad leverantören säger betyder det',

  'analytics.unit.count': 'En räkning av händelser',
  'analytics.unit.seconds': 'Sekunder',
  'analytics.unit.percent': 'En procentandel som leverantören redan har beräknat',
  'analytics.unit.ratio': 'Ett förhållande Relä beräknat från två leverantörsfält',
  'analytics.unit.currency_minor': 'En summa pengar i mindre enheter',

  'analytics.denominator.none': 'Detta är en räkning, inte en ränta. Den har ingen nämnare.',
  'analytics.denominator.impressions': 'Uppdelat efter intryck',
  'analytics.denominator.reach': 'Uppdelat efter räckvidd',
  'analytics.denominator.views': 'Uppdelat efter vyer',
  'analytics.denominator.followers': 'Delat med antalet följare vid tidpunkten för observationen',
  'analytics.denominator.sessions': 'Uppdelat efter sessioner',

  'analytics.format.text': 'Text',
  'analytics.format.image': 'Bild',
  'analytics.format.carousel': 'Karusell',
  'analytics.format.video': 'Video',
  'analytics.format.short_video': 'Kort video',
  'analytics.format.long_video': 'Lång video',
  'analytics.format.document': 'Dokument',
  'analytics.format.thread': 'Tråd',

  'analytics.value.unavailableReason.notImplemented':
    'Relay har inte byggt mappningen för detta mått på {provider} ännu.',
  'analytics.value.estimated': 'Uppskattad',
  'analytics.value.estimatedMethod': 'Metod: {method}.',

  /* ----------------------------------------------------------------------
     Freshness and account attention
     ---------------------------------------------------------------------- */
  'analytics.freshness.title': 'Var dessa siffror kom ifrån',
  'analytics.freshness.intro':
    'Leverantörer samlar på sitt eget schema. Ingenting på den här skärmen är live.',
  'analytics.freshness.accountRow': '{account} på {provider}',
  'analytics.freshness.never': 'Aldrig synkat',
  'analytics.freshness.nextAttempt': 'Nästa synkningsförsök {relativeTime}.',
  'analytics.freshness.openStatus': 'Leverantörsstatus',

  'analytics.accounts.title': 'Konton som behöver uppmärksamhet',
  'analytics.accounts.empty':
    'Varje anslutet konto returnerade data under denna period. Inget behöver dig här.',
  'analytics.accounts.reason.permission':
    'Analysbehörigheten beviljades inte när det här kontot kopplades.',
  'analytics.accounts.reason.expired':
    'Åtkomsten har löpt ut, så inget mått har samlats in sedan {date}.',
  'analytics.accounts.reason.stale': 'Den senaste lyckade synkroniseringen var {relativeTime}.',
  'analytics.accounts.reason.syncFailing':
    '{count, plural, one {# synkförsök} other {# synkförsök}} misslyckades i rad. Anledningen som registrerades var {reason}.',
  'analytics.accounts.reason.noPosts':
    'Inget publicerades på det här kontot i det valda intervallet.',

  /* ----------------------------------------------------------------------
     Observations and next tests
     ---------------------------------------------------------------------- */
  'analytics.observations.title': 'Observationer',
  'analytics.observations.intro':
    'Det här är beskrivningar av vad siffrorna visar. De är inte förutsägelser och de fastställer inte orsak.',
  'analytics.observations.empty':
    'Det finns inte tillräckligt med publicerad historia ännu för att beskriva ett mönster. Publicera några fler inlägg på samma konto och format.',
  'analytics.observations.citedPosts': 'Baserat på',
  'analytics.observations.citedPeriod': 'Period: {start} till {end}.',
  'analytics.observations.nextTestTitle': 'Ett test du kan köra härnäst',
  'analytics.observations.nextTestBody':
    'Publicera {count, plural, one {# inlägg till} other {# inlägg till}} på {account} ändra endast {variable}, jämför sedan samma mått. Tagga det som ett experiment innan publicering så att jämförelsen planeras snarare än hittas efteråt.',
  'analytics.observations.tagFirst': 'Tagga ett experiment',

  /* ----------------------------------------------------------------------
     Charts
     ---------------------------------------------------------------------- */
  'analytics.chart.title': '{metric} över tid',
  'analytics.chart.summary':
    '{metric} på {account}, {count, plural, one {# punkt} other {# poäng}} från {start} till {end}.',
  'analytics.chart.showTable': 'Visa som en tabell',
  'analytics.chart.hideTable': 'Göm bordet',
  'analytics.chart.tableCaption': 'Samma serie som ett bord.',
  'analytics.chart.columnPeriod': 'Period',
  'analytics.chart.columnValue': 'Värde',
  'analytics.chart.gapLabel': 'Inga data samlade in',
  'analytics.chart.gapExplained':
    'Ett avbrott i linjen betyder att ingen observation samlades in för den perioden. Det betyder inte noll.',
  'analytics.chart.annotation': 'Anteckning',
  'analytics.chart.pointLabel': '{period}: {value}',
  'analytics.chart.empty': 'Inga observationer samlades in i detta intervall.',

  /* ----------------------------------------------------------------------
     Experiments
     ---------------------------------------------------------------------- */
  'analytics.experiment.new': 'Planera ett experiment',
  'analytics.experiment.empty':
    'Inga experiment än. Ett experiment är en jämförelse du bestämmer dig för innan du publicerar, vilket är den enda sorten som kan svara på en fråga.',
  'analytics.experiment.emptyExample':
    'Exempel: publicera samma meddelande på X två gånger, en gång med länken i inlägget och en gång med länken i den första kommentaren, jämför sedan länkklick under 72 timmar.',
  'analytics.experiment.name': 'Vad testar du',
  'analytics.experiment.namePlaceholder': 'Första kommentaren vid 5 minuter mot 30 minuter',
  'analytics.experiment.hypothesisPlaceholder':
    'En kortare fördröjning innan den första kommentaren får fler svar på X.',
  'analytics.experiment.variantLabel': 'Variant {index}',
  'analytics.experiment.variantDescription': 'Vad är skillnaden i denna variant',
  'analytics.experiment.addVariant': 'Lägg till en variant',
  'analytics.experiment.removeVariant': 'Ta bort variant {index}',
  'analytics.experiment.accounts': 'Konton ingår',
  'analytics.experiment.windowHelp':
    'Mätvärden fortsätter att röra sig efter att ett inlägg har sänts live. Fixa fönstret nu så att jämförelsen inte görs vid ett ögonblick som råkar passa en variant.',
  'analytics.experiment.windowDays':
    'Mät för {count, plural, one {# dag} other {# dagar}} efter att varje inlägg har publicerats',
  'analytics.experiment.minSample': 'Minsta inlägg per variant',
  'analytics.experiment.minSampleHelp':
    'Under denna räkning visas resultatet som ofullständigt snarare än som en vinnare.',
  'analytics.experiment.status.planned': 'Planerad',
  'analytics.experiment.status.collecting': 'Samlar. {published} av {target} publicerade inlägg.',
  'analytics.experiment.status.inconclusive': 'Komplett, ingen tydlig skillnad',
  'analytics.experiment.result.difference':
    '{variant} spelade in {percent} mer {metric} än {otherVariant}.',
  'analytics.experiment.result.noDifference':
    'De två varianterna ligger inom {percent} från varandra på {metric}. Det är inom intervallet dessa inlägg varierar med i alla fall.',
  'analytics.experiment.result.association':
    'Detta är en association mätt på {count, plural, one {# inlägg} other {# inlägg}}. Det bevisar inte att förändringen orsakade skillnaden.',
  'analytics.experiment.result.unavailable':
    '{metric} var inte tillgängligt för {count, plural, one {# post} other {# posts}} i det här experimentet, så dessa inlägg exkluderas istället för att räknas som noll.',
  'analytics.experiment.result.title': 'Resultat',
  'analytics.experiment.completeNow': 'Stäng detta experiment',
  'analytics.experiment.completeConfirm':
    'Stängning stannar insamling. Inläggen förblir publicerade och siffrorna förblir tillgängliga.',
  'analytics.experiment.postsTitle': 'Inlägg i detta experiment',

  /* ----------------------------------------------------------------------
     Analytics states
     ---------------------------------------------------------------------- */
  'analytics.state.loading': 'Läser in analyser för de valda kontona',
  'analytics.state.loadingProvider': 'Hämtar {provider} analyser',
  'analytics.state.empty': 'Inget publicerat i detta intervall',
  'analytics.state.emptyBody':
    'Analytics beskriver inlägg som redan har gått ut. Publicera något eller utöka datumintervallet.',
  'analytics.state.emptyExample':
    'När ett inlägg är live kommer du att se en rad som: X @acme, "Launch thread", 12 400 visningar, 58 procent över din median av de föregående 10.',
  'analytics.state.errorTitle': 'Analytics kunde inte laddas',
  'analytics.state.errorBody':
    'Inget nummer visas snarare än ett gissat. Dina inlägg och kvitton påverkas inte.',
  'analytics.state.partialTitle': '{loaded} av {total} konton returnerade data',
  'analytics.state.partialBody':
    'Konton som svarat visas med sin egen fräschör. Resten är listade med anledningen till att de inte gjorde det.',
  'analytics.state.partialSucceeded': 'Returnerade data',
  'analytics.state.partialFailed': 'Returnerade inte data',
  'analytics.state.offlineTitle': 'Du är offline',
  'analytics.state.offlineBody':
    'Siffrorna nedan laddades innan anslutningen avbröts, så de är äldre än vad färskhetsetiketterna antyder.',
  'analytics.state.permissionTitle': 'Du kan inte se analyser i den här arbetsytan',
  'analytics.state.permissionBody':
    'Analytics behöver analytikerrollen eller högre. En ägare eller administratör av denna arbetsyta kan bevilja den.',
  'analytics.state.rateLimitTitle': '{provider} är hastighetsbegränsande analysförfrågningar',
  'analytics.state.rateLimitCause':
    'Kontot har använt sin andel av leverantörskvoten för det här fönstret. Relay försöker inte igen hårdare, eftersom det skulle försena publiceringen.',
  'analytics.state.rateLimitAlternative':
    'Begränsa datumintervallet eller kontofiltret, vilket ber leverantören om mindre.',
  'analytics.state.rateLimitReset': 'Begäran återupptas',
  'analytics.state.reference': 'Diagnostisk referens',

  /* ======================================================================
     Tracked links (first party redirect measurement)
     ====================================================================== */
  'analytics.links.new': 'Skapa en spårad länk',
  'analytics.links.empty': 'Inga spårade länkar ännu',
  'analytics.links.emptyBody':
    'En spårad länk är en kort URL-relä som omdirigerar genom, så att du kan se klick även när en plattform inte rapporterar några. Den ursprungliga destinationen ändras aldrig utan en granskningspost.',
  'analytics.links.emptyExample':
    'Exempel: relay.to/a7Kq2 omdirigerar till acme.com/blog/launch med kampanj q3-launch.',
  'analytics.links.table.caption':
    'Spårade länkar i den här arbetsytan och deras första parts klick räknas.',
  'analytics.links.campaign': 'Kampanj',
  'analytics.links.created': 'Skapad',
  'analytics.links.usedIn':
    '{count, plural, =0 {Används inte i ett inlägg ännu} one {Används i # inlägg} other {Används i # inlägg}}',
  'analytics.links.state.active': 'Aktiv',
  'analytics.links.state.expired': 'Utgått {date}',
  'analytics.links.state.disabled': 'Inaktiverad',
  'analytics.links.state.disabledAt':
    'Inaktiverad {date}. Den här korta webbadressen omdirigerar inte längre.',
  'analytics.links.state.blocked': 'Blockerad av säkerhetsskäl',
  'analytics.links.state.blockedBody':
    'Omdirigeringen är inte tillgänglig eftersom målet inte klarade en säkerhetskontroll. Ändra målet eller kontakta supporten.',
  'analytics.links.state.disabledReason':
    'Inaktiverad av {actor} på {date}. Antecknad orsak: {reason}.',
  'analytics.links.detailTitle': 'Spårad länk {slug}',
  'analytics.links.exactRedirect': 'Exakt omdirigering',
  'analytics.links.exactRedirectHelp':
    'Detta är destinationen en besökare når just nu, inklusive varje UTM-parameter, visad i sin helhet och inte förkortad.',
  'analytics.links.editDestination': 'Ändra destination',
  'analytics.links.editDestinationWarning':
    'Att ändra destinationen påverkar varje plats som denna länk redan har publicerats. Rapporter för perioder före ändringen behåller destinationen som var aktiv då.',
  'analytics.links.editDestinationAudit':
    'Ändringen registreras i revisionsloggen med ditt namn, den gamla destinationen och den nya.',
  'analytics.links.destinationHistory': 'Destinationshistorik',
  'analytics.links.destinationHistoryRow': '{destination}, aktiv från {start} till {end}',
  'analytics.links.destinationHistoryCurrent': '{destination}, aktiv sedan {start}',
  'analytics.links.domainLabel': 'Kort domän',
  'analytics.links.domainDefault': 'Relä standarddomän',
  'analytics.links.domainVerified': 'Verifierad av DNS den {date}',
  'analytics.links.domainPending': 'Väntar på DNS-posten',
  'analytics.links.domainPendingHelp':
    'Lägg till TXT-posten nedan vid {domain} och kontrollera sedan igen. Innan den har verifierats kan den här domänen inte väljas för en ny länk.',
  'analytics.links.domainFailed': 'DNS-posten matchade inte {date}',
  'analytics.links.domainCheck': 'Kontrollera DNS igen',
  'analytics.links.expiry': 'Utgångsdatum',
  'analytics.links.expiryNone': 'Inget utgångsdatum',
  'analytics.links.expiryHelp':
    'Efter utgången returnerar länken en vanlig sida som säger att den har avslutats. Det pekas aldrig tyst någon annanstans.',
  'analytics.links.disable': 'Inaktivera denna länk nu',
  'analytics.links.disableTitle': 'Inaktivera {slug}?',
  'analytics.links.disableBody':
    'Besökare kommer till en sida och säger att länken inte längre är tillgänglig. Publicerade inlägg innehåller fortfarande den korta webbadressen, så denna är synlig för alla som klickar.',
  'analytics.links.disableReason': 'Anledning till inaktivering',
  'analytics.links.enable': 'Aktivera den här länken igen',
  'analytics.links.abuseTitle': 'Rapportera missbruk av denna länk',
  'analytics.links.abuseBody':
    'Om den här korta webbadressen används för något du inte tänkt, rapportera det och omdirigeringen avbryts medan den granskas.',
  'analytics.links.abuseAction': 'Anmäl denna länk',
  'analytics.links.measurementLabel': 'Förstaparts omdirigeringsmätning',
  'analytics.links.measurementExplained':
    'Relä räknar en begäran när omdirigeringstjänsten tillfrågas om denna URL. Ett deduplicerat klick tar bort upprepade förfrågningar från samma besökare i ett kort fönster, och förfrågningar som matchar kända sökrobotmönster exkluderas istället för att tas bort.',
  'analytics.links.botsNote':
    '{count, plural, one {# begäran} other {# begäranden}} klassificerades som automatiserade och exkluderas från den deduplicerade räkningen.',
  'analytics.links.series.title': 'Förfrågningar och deduplicerade klick över tid',
  'analytics.links.series.requests': 'Totalt antal förfrågningar',
  'analytics.links.series.clicks': 'Avduplicerade klick',
  'analytics.links.breakdownTitle': 'Varifrån kom klicken',
  'analytics.links.breakdown.share': '{percent} av deduplicerade klick',
  'analytics.links.referrer.direct': 'Ingen hänvisning har skickats',
  'analytics.links.referrer.social': 'Social plattform',
  'analytics.links.referrer.search': 'Sökmotor',
  'analytics.links.referrer.email': 'E-postklient',
  'analytics.links.referrer.other': 'Annan webbplats',
  'analytics.links.device.mobile': 'Mobil',
  'analytics.links.device.desktop': 'Skrivbord',
  'analytics.links.device.tablet': 'Surfplatta',
  'analytics.links.device.unknown': 'Inte bestämt',
  'analytics.links.countryUnknown': 'Land ej bestämt',
  'analytics.links.lastEventLabel': 'Sista klicket',
  'analytics.links.noEvents': 'Inga klick har registrerats ännu',
  'analytics.links.noEventsBody':
    'Denna länk har inte begärts sedan den skapades. Det är en riktig nolla, mätt med vår egen omdirigeringstjänst.',
  'analytics.links.compareWarning':
    '{provider} rapporterar {providerValue} länkklick för det här inlägget. Relä registrerade {relayValue} deduplicerade klick. De två räknar olika händelser och ingen ersätter den andra.',
  'analytics.links.errorTitle': 'Länkstatistik kunde inte laddas',
  'analytics.links.errorBody':
    'Omdirigeringstjänsten fungerar fortfarande, så länken fortsätter att skicka besökare till sin destination. Endast rapporteringen påverkas.',
  'analytics.links.createDestination': 'Destinationsadress',
  'analytics.links.createDestinationHelp':
    'Måste vara en offentlig https-adress. Privata nätverksadresser och omdirigeringskedjor avvisas av omdirigeringstjänsten.',
  'analytics.links.createCampaign': 'Kampanjens namn',
  'analytics.links.createSlug': 'Anpassad avslutning',
  'analytics.links.createSlugHelp':
    'Lämna detta tomt och Relay genererar ett kort slumpmässigt slut.',
  'analytics.links.createUtm': 'UTM-parametrar',
  'analytics.links.blockedScheme': 'Endast https-destinationer accepteras.',
  'analytics.links.blockedPrivate':
    'Den adressen finns i ett privat nätverk, så omdirigeringstjänsten accepterar den inte.',

  /* ======================================================================
     Automation: list and shell
     ====================================================================== */
  'automation.tab.rules': 'Regler',
  'automation.tab.feeds': 'RSS-flöden',
  'automation.tab.label': 'Automationssektioner',

  'automation.rules.table.caption': 'Automationsregler i den här arbetsytan.',
  'automation.rules.table.rule': 'Regel',
  'automation.rules.table.state': 'staten',
  'automation.rules.table.accounts': 'konton',
  'automation.rules.table.lastRun': 'Sista körningen',
  'automation.rules.table.nextCheck': 'Nästa kontroll',
  'automation.rules.neverRun': 'Inte sprungit än',
  'automation.rules.emptyExample':
    'Exempel: när ett nytt objekt dyker upp i Acme-bloggflödet, om språket är engelska, skapa ett utkast från bloggannonsmallen och begär godkännande.',
  'automation.rules.summaryAccounts':
    '{count, plural, =0 {Inga konton har valts} one {# konto} other {# konton}}',
  'automation.rules.openRule': 'Öppna {name}',
  'automation.rules.duplicateRule': 'Duplicera {name}',
  'automation.rules.deleteTitle': 'Ta bort {name}?',
  'automation.rules.deleteBody':
    'Regeln stoppas omedelbart och dess körhistorik sparas för granskningsloggen. Inlägg som den redan har skapat påverkas inte.',

  /* ----------------------------------------------------------------------
     Catalog entries the shared automation vocabulary does not cover yet
     ---------------------------------------------------------------------- */
  'automation.trigger.commentFailed': 'en schemalagd kommentar eller trådobjekt misslyckas',

  'automation.condition.timeWindow': 'tiden är mellan {start} och {end} i {timeZone}',
  'automation.condition.domainPresent': 'texten länkar till {domain}',
  'automation.condition.hashtagPresent': 'texten innehåller hashtaggen {hashtag}',
  'automation.condition.providerCapability': 'kontot kan faktiskt göra {capability}',
  'automation.condition.planStatus': 'prenumerationen är aktiv',

  'automation.action.continueSequence': 'fortsätt den förberedda tråden eller kommentarssekvensen',
  'automation.action.notifyEmail': 'skicka ett e-postmeddelande till {target}',
  'automation.action.notifyWebhook': 'skicka en webhook till {target}',
  'automation.action.pauseConnection': 'pausa det berörda kontot',
  'automation.action.quotePost': 'citera källinlägget en gång',
  'automation.action.followUpComment': 'lägg till en förberedd kommentar på källinlägget',

  'automation.param.feed': 'Mata',
  'automation.param.template': 'Mall',
  'automation.param.signature': 'Signatur',
  'automation.param.disclosure': 'Avslöjande',
  'automation.param.locale': 'Språk',
  'automation.param.project': 'Projekt',
  'automation.param.campaign': 'Kampanj',
  'automation.param.account': 'konto',
  'automation.param.platform': 'Plattform',
  'automation.param.contentType': 'Innehållstyp',
  'automation.param.keyword': 'Nyckelord',
  'automation.param.hashtag': 'Hashtag',
  'automation.param.domain': 'Domän',
  'automation.param.capability': 'Förmåga',
  'automation.param.timeZone': 'Tidszon',
  'automation.param.startTime': 'Från',
  'automation.param.endTime': 'Till',
  'automation.param.duration': 'Varaktighet',
  'automation.param.metric': 'Metrisk',
  'automation.param.value': 'Värde',
  'automation.param.target': 'Skicka till',
  'automation.param.time': 'Tid',
  'automation.param.cadence': 'Hur ofta',
  'automation.param.notSet': 'inte inställt',

  /* ----------------------------------------------------------------------
     Sentence builder
     ---------------------------------------------------------------------- */
  'automation.editor.name': 'Regelnamn',
  'automation.editor.namePlaceholder': 'Blogg till sociala',
  'automation.editor.when': 'När',
  'automation.editor.if': 'Om',
  'automation.editor.then': 'Sedan',
  'automation.editor.after': 'Efter',
  'automation.editor.until': 'Tills',
  'automation.editor.sentenceLabel': 'Regel mening',
  'automation.editor.readBack': 'Läs tillbaka meningen innan du slår på detta. Det är hela regeln.',
  'automation.editor.chooseTrigger': 'Välj vad som startar denna regel',
  'automation.editor.addCondition': 'Lägg till ett villkor',
  'automation.editor.addAction': 'Lägg till en åtgärd',
  'automation.editor.removeCondition': 'Ta bort villkoret {label}',
  'automation.editor.removeAction': 'Ta bort åtgärden {label}',
  'automation.editor.moveActionUp': 'Flytta {label} tidigare',
  'automation.editor.moveActionDown': 'Flytta {label} senare',
  'automation.editor.actionOrder': 'Åtgärder körs i denna ordning, uppifrån och ned.',
  'automation.editor.noConditions': 'Inga villkor. Regeln körs varje gång den utlöses.',
  'automation.editor.noActions': 'Inga åtgärder än. En regel utan åtgärd kan inte sparas.',
  'automation.editor.delayNone': 'ingen fördröjning',
  'automation.editor.delayLabel': 'Fördröjning innan åtgärderna körs',
  'automation.editor.endLabel': 'När denna regel upphör',
  'automation.editor.end.manual': 'Jag stänger av det här',
  'automation.editor.end.date': 'ett datum jag väljer',
  'automation.editor.end.count': 'den har körts {count, plural, one {# gång} other {# gånger}}',
  'automation.editor.end.dateValue': 'Stanna på',
  'automation.editor.end.countValue': 'Stanna efter så här många körningar',
  'automation.editor.parameterFor': 'Inställningar för {label}',
  'automation.editor.saveDraft': 'Spara som utkast',
  'automation.editor.savedAt': 'Sparad {time}',
  'automation.editor.unsaved': 'Osparade ändringar',

  'automation.editor.view.sentence': 'Mening',
  'automation.editor.view.structured': 'Strukturerad',
  'automation.editor.view.api': 'API representation',
  'automation.editor.view.label': 'Redaktörsvy',
  'automation.editor.apiHelp':
    'Detta är exakt vad REST API, CLI och MCP-servern skickar. Redigera den här och byta tillbaka till meningen behåller varje fält.',
  'automation.editor.apiInvalid':
    'Detta är inte giltig JSON-regel, så den tillämpades inte: {reason}',
  'automation.editor.apiApply': 'Använd denna JSON',
  'automation.editor.structuredHelp':
    'Samma regel som fält. Använd detta när en regel har många villkor och meningen blir lång.',

  'automation.editor.error.noAction': 'Lägg till minst en åtgärd innan du sparar.',
  'automation.editor.error.noTrigger': 'Välj en utlösare innan du sparar.',
  'automation.editor.error.noAccounts': 'Välj minst ett konto som denna regel kan agera på.',
  'automation.editor.error.missingParameter': '{label} behöver ett värde.',
  'automation.editor.error.summary':
    '{count, plural, one {# sak behöver din uppmärksamhet} other {# saker behöver din uppmärksamhet}} innan den här regeln kan sparas.',

  /* ----------------------------------------------------------------------
     Trigger, condition and action pickers
     ---------------------------------------------------------------------- */
  'automation.picker.triggerTitle': 'Vad börjar denna regel',
  'automation.picker.conditionTitle': 'Lägg till ett villkor',
  'automation.picker.actionTitle': 'Lägg till en åtgärd',
  'automation.picker.search': 'Filtrera den här listan',
  'automation.picker.noResults': 'Inget i den här listan matchar det du skrev.',
  'automation.picker.groupContent': 'Innehåll',
  'automation.picker.groupPublishing': 'Publicering',
  'automation.picker.groupNotify': 'Människor och system',
  'automation.picker.groupControl': 'Regelkontroll',
  'automation.picker.groupSchedule': 'Tid',
  'automation.picker.groupExternal': 'Externa evenemang',
  'automation.picker.groupMeasurement': 'Mätning',
  'automation.picker.hiddenForProvider':
    '{count, plural, one {# åtgärd är} other {# åtgärder är}} visas inte eftersom de valda kontona inte kan utföra dem.',
  'automation.picker.hiddenDetail': '{action} är inte tillgängligt för {provider}. {reason}',
  'automation.picker.consequential': 'Skapar något på en plattform',
  'automation.picker.internalOnly': 'Håller sig inne i reläet',

  'automation.accounts.label': 'Konton som denna regel kan agera på',
  'automation.accounts.help':
    'En regel kan aldrig röra ett konto som inte är listat här, oavsett dess villkor säger.',
  'automation.accounts.none': 'Inga konton har valts ännu',

  /* ----------------------------------------------------------------------
     Engagement threshold controls
     ---------------------------------------------------------------------- */
  'automation.threshold.title': 'Mätningsregler för denna utlösare',
  'automation.threshold.intro':
    'En regel som reagerar på ett nummer behöver veta vilket nummer, mätt under vilken period, och hur ofta den kan agera.',
  'automation.threshold.metric': 'Mätvärde att titta på',
  'automation.threshold.value': 'Tröskelvärde',
  'automation.threshold.window': 'Mätfönster',
  'automation.threshold.windowHelp':
    'Räknat från det ögonblick då källinlägget publicerades. Utanför detta fönster slutar regeln att titta på inlägget.',
  'automation.threshold.expiry': 'Sluta titta på ett inlägg efteråt',
  'automation.threshold.cooldown': 'Nedkylning mellan utföranden',
  'automation.threshold.cooldownHelp':
    'Den kortaste tillåtna tiden mellan två körningar för samma källinlägg.',
  'automation.threshold.maxPerPost': 'Maximalt antal körningar per källinlägg',
  'automation.threshold.defaultsTitle': 'Standardvärden som förblir på om du inte ändrar dem',
  'automation.threshold.defaultOncePerPost': 'Kör en gång per källinlägg.',
  'automation.threshold.defaultStale':
    'Kör inte om mätvärdet är otillgängligt eller inaktuellt. Den använda färskhetsgränsen är {duration}.',
  'automation.threshold.staleLimit': 'Behandla ett mått som inaktuellt efter',
  'automation.threshold.providerNote':
    '{provider} rapporterar {metric} om en försening, så denna regel kan endast agera efter att leverantören publicerat numret.',

  /* ----------------------------------------------------------------------
     Cross account follow up
     ---------------------------------------------------------------------- */
  'automation.crossAccount.title': 'Följ upp från ett annat konto',
  'automation.crossAccount.off': 'Av. Denna regel fungerar bara på källkontot.',
  'automation.crossAccount.enable': 'Tillåt en uppföljning från ett annat konto',
  'automation.crossAccount.body':
    'Båda kontona måste vara kopplade till denna arbetsyta och båda måste namnges här. Uppföljningen är ett förberett inlägg du skriver i förväg, och det går igenom samma godkännandepolicy som allt annat.',
  'automation.crossAccount.sourceAccount': 'Källkonto',
  'automation.crossAccount.followUpAccount': 'Konto som publicerar uppföljningen',
  'automation.crossAccount.preauthorize':
    'Jag bekräftar att denna arbetsyta styr både {sourceAccount} och {followUpAccount}, och att uppföljningen inte presenteras som oberoende rekommendation.',
  'automation.crossAccount.preauthorizeRequired':
    'Bekräfta förauktoriseringen innan den här regeln kan sparas.',
  'automation.crossAccount.duplicateCheck':
    'Duplikat- och kadenskontroller för flera konton körs före uppföljningen, och den hoppas över snarare än försenas om den upprepar källinlägget.',

  /* ----------------------------------------------------------------------
     Preflight
     ---------------------------------------------------------------------- */
  'automation.preflight.intro': 'Allt som denna regel kan göra, innan den kan göra något av det.',
  'automation.preflight.accountsLabel': 'Konton den kan agera på',
  'automation.preflight.maxActionsLabel': 'De flesta externa åtgärder per körning',
  'automation.preflight.maxActionsPeriod':
    'Som mest {count, plural, one {# extern åtgärd} other {# extern åtgärd}} i {period}.',
  'automation.preflight.approvalLabel': 'Godkännande',
  'automation.preflight.approvalNone':
    'Ingen åtgärd i den här regeln skapar något på en plattform, så inget godkännande gäller.',
  'automation.preflight.providerLabel': 'Leverantörsbegränsningar',
  'automation.preflight.providerNone': 'Inget gäller åtgärderna i denna regel.',
  'automation.preflight.costLabel': 'Beräknad uppmätt kostnad',
  'automation.preflight.costUnknown':
    'Kostnaden kan inte uppskattas för dessa åtgärder förrän ett leverantörspris är känt.',
  'automation.preflight.costMethod':
    'Beräknad från leverantörsprislistan den {date}. På kvittot anges vad som faktiskt debiterades.',
  'automation.preflight.cadenceLabel': 'Kadens och dubbletter',
  'automation.preflight.cadenceBody':
    'Dubbletter och kadenskontroller körs före varje åtgärd. En åtgärd som skulle överskrida kadensbudgeten för ett konto hoppas över och registreras, inte i kö.',
  'automation.preflight.failureLabel': 'Om en körning misslyckas',
  'automation.preflight.failure.pauseAfter':
    'Regeln pausas efter {count, plural, one {# på varandra följande misslyckande} other {# på varandra följande misslyckanden}} och arkiverar en åtgärd.',
  'automation.preflight.failure.continue':
    'Regeln fortsätter att köras och varje fel registreras i körloggen.',
  'automation.preflight.exampleLabel': 'Exempel körning',
  'automation.preflight.exampleIntro':
    'Med den senaste händelsen skulle denna utlösare ha matchat.',
  'automation.preflight.exampleNone':
    'Ingen matchande händelse har hänt ännu, så inget exempel kan visas. Kör en testhändelse istället.',
  'automation.preflight.activate': 'Aktivera den här regeln',
  'automation.preflight.activateConfirmTitle': 'Slå på {name}?',
  'automation.preflight.activateConfirmBody':
    'Från och med nu fungerar denna regel utan att fråga dig först, inom de gränser som anges ovan.',
  'automation.preflight.blocked':
    'Den här regeln kan inte aktiveras ännu. {count, plural, one {# objekt} other {# objekt}} ovan behöver ett beslut.',

  /* ----------------------------------------------------------------------
     Test runs, runs, versions, kill switch
     ---------------------------------------------------------------------- */
  'automation.test.title': 'Testhändelse',
  'automation.test.body':
    'En testkörning utvärderar hela meningen och visar vad den skulle göra. Den publicerar aldrig, postar aldrig en kommentar och skickar aldrig en webhook till en riktig slutpunkt.',
  'automation.test.useLastEvent': 'Använd den senaste matchande händelsen',
  'automation.test.usePayload': 'Klistra in en händelsenyttolast',
  'automation.test.run': 'Kör testet',
  'automation.test.running': 'Kör testet',
  'automation.test.resultTitle': 'Vad testet gjorde',
  'automation.test.conditionPassed': '{condition} passerade',
  'automation.test.conditionFailed': '{condition} gick inte igenom, så här stannade regeln',
  'automation.test.actionSimulated': '{action} skulle köras',
  'automation.test.actionSkipped': '{action} skulle hoppas över: {reason}',
  'automation.test.noExternalEffect': 'Ingenting lämnade Relay under detta test.',
  'automation.test.failed': 'Testet kunde inte slutföras: {reason}',

  'automation.runs.table.caption': 'Senaste körningar av denna regel.',
  'automation.runs.startedAt': 'Startade',
  'automation.runs.outcome.label': 'Resultat',
  'automation.runs.actionsTaken': 'Åtgärder',
  'automation.runs.trigger': 'Utlöst av',
  'automation.runs.outcome.completed': 'Avslutad',
  'automation.runs.outcome.skipped': 'Hoppade över',
  'automation.runs.outcome.failed': 'Misslyckades',
  'automation.runs.outcome.testMode': 'Testläge',
  'automation.runs.actionCount':
    '{count, plural, =0 {Ingen extern åtgärd} one {# extern åtgärd} other {# extern åtgärd}}',
  'automation.runs.skippedReason': 'Hoppade över eftersom {reason}',
  'automation.runs.openDetail': 'Öppna löpningen från {time}',
  'automation.runs.createdItems': 'Skapad',

  'automation.versions.caption': 'Varje sparad version av denna regel.',
  'automation.versions.current': 'Aktuell',
  'automation.versions.savedBy': 'Sparad av {actor} på {date}',
  'automation.versions.compare': 'Jämför med den nuvarande versionen',
  'automation.versions.restore': 'Återställ den här versionen',
  'automation.versions.restoreConfirm':
    'Återställning skapar en ny version. Ingenting skrivs över och regeln förblir i sitt nuvarande tillstånd tills du slår på den.',
  'automation.versions.diffTitle': 'Version {from} jämfört med version {to}',

  'automation.kill.title': 'Stoppa {name} nu',
  'automation.kill.body':
    'Regeln upphör omedelbart, mitt i en löpning om en sådan inträffar. Allt som redan skickats till en plattform förblir publicerat, eftersom ett externt inlägg aldrig rullas tillbaka.',
  'automation.kill.confirmPhrase': 'STOPP',
  'automation.kill.confirmLabel': 'Skriv STOP för att bekräfta',
  'automation.kill.stopped':
    'Denna regel stoppades av {actor} den {date}. Den kan inte köras igen förrän du slår på den igen.',

  /* ----------------------------------------------------------------------
     Automation states
     ---------------------------------------------------------------------- */
  'automation.state.loading': 'Laddar automationsregler',
  'automation.state.loadingRule': 'Laddar regeln och dess senaste körningar',
  'automation.state.errorTitle': 'Reglerna kunde inte laddas',
  'automation.state.errorBody':
    'Regler som redan körs påverkas inte av detta. Bara den här skärmen misslyckades.',
  'automation.state.offlineTitle': 'Du är offline',
  'automation.state.offlineBody':
    'Du kan läsa en regel och redigera utkastet, och den stannar på den här enheten. Att spara, testa och aktivera en regel behöver en anslutning.',
  'automation.state.permissionTitle': 'Du kan inte ändra automatiseringsregler',
  'automation.state.permissionBody':
    'Regler fungerar på anslutna konton, så om du byter ett måste du ha chefsrollen eller högre. Du kan fortfarande läsa varje regel och dess körhistorik.',
  'automation.state.rateLimitTitle': 'Regelkörningar bromsas upp',
  'automation.state.rateLimitCause':
    'Den här arbetsytan nådde sin tillåtelse för automatiseringskörning för det aktuella fönstret. Schemalagda inlägg och manuell publicering påverkas inte.',
  'automation.state.rateLimitAlternative':
    'Regler med kadens kan ges ett längre intervall, vilket använder färre körningar.',

  /* ======================================================================
     RSS autopost
     ====================================================================== */
  'automation.rss.subtitle':
    'Förvandla ett flöde till utkast eller schemalagda inlägg, med samma validering och godkännande som allt du skriver själv.',
  'automation.rss.empty': 'Inga flöden ännu',
  'automation.rss.emptyBody':
    'Lägg till ett flöde och Relay kontrollerar det enligt ett schema. Varje ny post blir ett utkast, ett schemalagt inlägg eller en godkännandebegäran, vilket du än väljer.',
  'automation.rss.emptyExample':
    'Exempel: Acme-bloggflödet skapar ett utkast för X och LinkedIn varje gång en artikel publiceras och väntar på en godkännare.',
  'automation.rss.table.caption': 'Matar den här arbetsytan omröstningar.',
  'automation.rss.table.feed': 'Mata',
  'automation.rss.table.policy': 'Vad händer med ett nytt föremål',
  'automation.rss.table.health': 'Hälsa',

  'automation.rss.step.url': 'Flödesadress',
  'automation.rss.step.preview': 'Kontrollera fodret',
  'automation.rss.step.seen': 'Utgångspunkt',
  'automation.rss.step.targets': 'Vart det går',
  'automation.rss.step.template': 'Vad står det i inlägget',
  'automation.rss.step.policy': 'Hur den publiceras',
  'automation.rss.stepOf': 'Steg {current} av {total}',

  'automation.rss.urlHelp':
    'Relay hämtar flödet från våra servrar, inte från din webbläsare. Privata nätverksadresser nekas.',
  'automation.rss.validateAction': 'Kolla detta flöde',
  'automation.rss.validateFailed': 'Den adressen returnerade inte ett läsbart flöde',
  'automation.rss.validateFailedReason': 'Vad vi fick tillbaka: {reason}',
  'automation.rss.validateBlocked':
    'Den adressen pekar på ett privat nätverk, så den hämtades inte.',
  'automation.rss.previewTitle': 'Förhandsvisning av flöde',
  'automation.rss.previewMeta':
    '{title}. {count, plural, one {# objekt} other {# objekt}} returnerade, senaste först.',
  'automation.rss.previewItemPublished': 'Publicerad {dateTime}',
  'automation.rss.previewNoImage': 'Ingen bild i detta objekt',
  'automation.rss.previewImageAlt': 'Bild från flödesobjektet {title}',
  'automation.rss.previewNoDate':
    'Det här objektet har ingen tidsstämpel, så Relay använder den tid det såg det först.',
  'automation.rss.previewFieldsTitle': 'Fält som detta flöde tillhandahåller',
  'automation.rss.previewFieldMissing': 'Finns inte i detta flöde',

  'automation.rss.seenTitle': 'Det som räknas som redan sett',
  'automation.rss.seenLatest':
    'Behandla allt för närvarande i flödet som du ser. Endast framtida föremål läggs upp.',
  'automation.rss.seenAll':
    'Behandla det senaste föremålet som nytt och lägg upp det vid nästa kontroll.',
  'automation.rss.seenHelp':
    'De flesta flöden innehåller gamla artiklar. Att välja det första alternativet är hur du undviker att publicera en eftersläpning.',

  'automation.rss.targetsHelp':
    'Välj konton eller den sparade gruppen. Varje mål får fortfarande sin egen validering innan något är schemalagt.',
  'automation.rss.targetGroup': 'Sparad grupp',
  'automation.rss.targetIndividual': 'Enskilda konton',

  'automation.rss.templateFields': 'Tillgängliga fält',
  'automation.rss.templateInsert': 'Sätt i {field}',
  'automation.rss.templateField.title': 'Objektets titel',
  'automation.rss.templateField.summary': 'Artikelsammanfattning',
  'automation.rss.templateField.link': 'Artikellänk',
  'automation.rss.templateField.author': 'Artikelförfattare',
  'automation.rss.templateField.published': 'Publiceringsdatum',
  'automation.rss.templateField.categories': 'Kategorier',
  'automation.rss.templatePreview': 'Förhandsgranska med det senaste objektet',
  'automation.rss.adaptWithAi': 'Anpassa texten för varje mål',
  'automation.rss.adaptHelp':
    'Formuleringen skrivs om för att passa varje plattform och visas som en skillnad du accepterar eller förkastar. Media kommer från flödesobjektet. Relä genererar inga bilder.',
  'automation.rss.noImageGeneration':
    'Om ett flödesobjekt inte har någon bild slocknar inlägget utan en.',
  'automation.rss.imageFromFeed': 'Använd bilden från flödesobjektet när den har en',

  'automation.rss.policyHelp':
    'En fodervara är inte speciell. Det följer samma godkännandepolicy som ett inlägg du själv skriver.',
  'automation.rss.cadenceInterval': 'En vara högst varje',
  'automation.rss.cadenceHelp':
    'Extra artiklar väntar i kön snarare än att publiceras tillsammans, så ett flöde som lägger upp tio artiklar på en gång svämmar inte över ett konto.',
  'automation.rss.immediateWarning':
    'Omedelbar publicering skickar ett inlägg till en plattform utan att någon läser det först. Den är endast tillgänglig om godkännandepolicyn för dessa konton tillåter det.',

  'automation.rss.healthTitle': 'Foderhälsa',
  'automation.rss.healthOk': 'Arbetar',
  'automation.rss.healthStalled': 'Ingen ny artikel för {duration}',
  'automation.rss.healthFailing':
    'Den senaste {count, plural, one {kontrollen} other {# kontroller}} misslyckades',
  'automation.rss.health.nextPoll': 'Kontrollera nästa {relativeTime}',
  'automation.rss.health.itemsProcessed':
    '{count, plural, =0 {Inga artiklar behandlade ännu} one {# objekt behandlade} other {# artiklar bearbetade}}',
  'automation.rss.health.duplicatesSkipped':
    '{count, plural, =0 {Inga dubbletter hoppade över} one {# dubbletter hoppade över} other {# dubbletter hoppade över}}',
  'automation.rss.health.lastPollLabel': 'Senast kontrollerad',
  'automation.rss.health.lastItemLabel': 'Senaste nya objektet i flödet',
  'automation.rss.health.lastPostLabel': 'Senaste utkastet eller inlägget skapades',
  'automation.rss.health.processedLabel': 'Föremål bearbetade',
  'automation.rss.recentItems': 'Senaste föremål',
  'automation.rss.itemOutcome.draft': 'Utkast skapat',
  'automation.rss.itemOutcome.scheduled': 'Schemalagt till {time}',
  'automation.rss.itemOutcome.published': 'Publicerad',
  'automation.rss.itemOutcome.awaitingApproval': 'Väntar på godkännande',
  'automation.rss.itemOutcome.duplicate': 'Hoppade, redan sett',
  'automation.rss.itemOutcome.failed': 'Misslyckades: {reason}',
  'automation.rss.pauseFeed': 'Pausa det här flödet',
  'automation.rss.resumeFeed': 'Återuppta detta flöde',
  'automation.rss.deleteTitle': 'Ta bort {title}?',
  'automation.rss.deleteBody':
    'Reläet slutar kontrollera detta flöde. Utkast och inlägg som den redan har skapat förblir precis som de är.',
  'automation.rss.errorTitle': 'Detta flöde kunde inte läsas',
  'automation.rss.errorBody':
    'Reläet fortsätter att kontrollera det normala schemat. Inget publicerades från ett partiellt svar.',

  /* ----------------------------------------------------------------------
     What Relay refuses to automate
     ---------------------------------------------------------------------- */
  'automation.refuse.title': 'Inte tillgänglig i någon regel',
  'automation.refuse.body':
    'Automatiska gilla och följer, engagemangsgrupper, oönskade svar och meddelanden och att lägga upp samma innehåll från flera konton för att få det att se populärt ut är inte alternativ här. Plattformar förbjuder dem och de skadar konton som använder dem.',
  'automation.refuse.readPolicy': 'Läs policyn för acceptabel användning',
} as const;
