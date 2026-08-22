/**
 * Web app copy for the calendar and queue, the publication receipt, and the
 * connections surfaces.
 *
 * The domain vocabulary for these areas already lives in `calendar.ts`,
 * `receipt.ts`, `connections.ts`, `states.ts`, `status.ts` and `actions.ts`.
 * This file only adds the strings the web screens need on top of that: view
 * switchers, table column headings, keyboard affordances, the reschedule
 * decision a published post forces, receipt section headings, the capability
 * matrix, and the pre-OAuth permission explainer.
 *
 * Keys are intent based. Values are ICU MessageFormat. No em dashes.
 */
export const webCalendarMessages = {
  /* ---------------------------------------------------------------------
   * Platform and account vocabulary
   *
   * Platform names are proper nouns and stay as they are in English, but they
   * live in the catalog anyway: a locale that uses a different script needs to
   * transliterate them, and a component must never hold a literal.
   * ------------------------------------------------------------------- */
  'web.provider.x': 'X',
  'web.provider.linkedin': 'LinkedIn',
  'web.provider.instagram': 'Instagram',
  'web.provider.facebook': 'Facebook',
  'web.provider.youtube': 'YouTube',
  'web.provider.tiktok': 'TikTok',
  'web.provider.threads': 'Trådar',
  'web.provider.bluesky': 'Bluesky',
  'web.provider.mastodon': 'Mastodon',
  'web.provider.telegram': 'Telegram',
  'web.provider.reddit': 'Reddit',
  'web.provider.wordpress': 'WordPress',
  'web.provider.medium': 'Medium',
  'web.provider.devto': 'Dev.to',
  'web.provider.pinterest': 'Pinterest',
  'web.provider.discord': 'Discord',
  'web.provider.slack': 'Slack',
  'web.connection.requirement.mastodon':
    'Mastodon ansluter med en åtkomsttoken du skapar på din egen instans, inte med ditt lösenord.',
  'web.connection.requirement.telegram':
    'Relay publicerar som en bot. Lägg till boten i kanalen eller gruppen där du vill publicera.',
  'web.connection.requirement.reddit':
    'Att skriva på Reddit kräver en godkänd app och varje inlägg behöver en titel och en subreddit.',
  'web.connection.requirement.wordpress':
    'Relay publicerar via webbplatsens REST API med ett applösenord du skapar i WordPress.',
  'web.connection.requirement.medium':
    'Medium ansluter via OAuth och Relay publicerar offentliga berättelser i Markdown.',
  'web.connection.requirement.devto':
    'Dev.to ansluter med en API-nyckel skapad i dina Dev.to-inställningar.',
  'web.connection.requirement.pinterest':
    'Att skriva på Pinterest kräver godkänd appåtkomst och en pin behöver en bild och en egen anslagstavla.',
  'web.connection.requirement.discord':
    'Relay publicerar som en bot. Lägg till boten i servrarna och kanalerna där du vill publicera.',
  'web.connection.requirement.slack':
    'Relay publicerar som en app. Lägg till appen i kanalerna där du vill publicera.',
  'web.provider.fake': 'Testa kontakten',

  'web.accountType.personal_profile': 'Personlig profil',
  'web.accountType.creator_profile': 'Skaparkonto',
  'web.accountType.business_profile': 'Företagskonto',
  'web.accountType.page': 'Sida',
  'web.accountType.organization': 'Organisation',
  'web.accountType.channel': 'Kanal',
  'web.accountType.group': 'Grupp',
  'web.accountType.board': 'Styrelse',
  'web.accountType.community': 'gemenskapen',
  'web.accountType.publication': 'Publicering',

  /* ---------------------------------------------------------------------
   * Calendar and queue
   * ------------------------------------------------------------------- */
  'web.calendar.description':
    'Allt schemalagt, väntar på godkännande, publicerat eller blockerat, på ett ställe.',
  'web.calendar.view.agenda': 'Agenda',
  'web.calendar.view.table': 'Tabell',
  'web.calendar.view.switchLabel': 'Välj hur schemat ska läggas upp',
  'web.calendar.range.day': '{date}',
  'web.calendar.range.week': '{start} till {end}',
  'web.calendar.range.month': '{month}',
  'web.calendar.range.label': 'Visar {range} i {timeZone}',
  'web.calendar.timeZone.workspace': 'Arbetsytans tidszon: {timeZone}',
  'web.calendar.timeZone.change': 'Ändra arbetsytans inställningar',
  'web.calendar.jumpToDate': 'Hoppa till ett datum',
  'web.calendar.nowLabel': 'Nu',
  'web.calendar.allDayHeading': 'Ingen exakt tid än',

  'web.calendar.filter.group': 'Kundgrupp',
  'web.calendar.filter.anyProject': 'Vilket projekt som helst',
  'web.calendar.filter.anyAccount': 'Vilket konto som helst',
  'web.calendar.filter.anyPlatform': 'Vilken plattform som helst',
  'web.calendar.filter.anyStatus': 'Vilken status som helst',
  'web.calendar.filter.anyLocale': 'Alla innehållsspråk',
  'web.calendar.filter.anyCampaign': 'Vilken kampanj som helst',
  'web.calendar.filter.anyGroup': 'Varje grupp',
  'web.calendar.filter.regionLabel': 'Filtrera schemat',
  'web.calendar.bucket.scheduled': 'Schemalagt',
  'web.calendar.bucket.draft': 'Utkast och godkännanden',
  'web.calendar.bucket.published': 'Publicerad',
  'web.calendar.bucket.failed': 'Behöver uppmärksamhet',
  'web.calendar.filter.summary':
    '{count, plural, =0 {Inga filter} one {# filter} other {# filter}}, {results, plural, =0 {inga inlägg} one {# inlägg} other {# inlägg}}',

  'web.calendar.grid.label': 'Schemalägg rutnät för {range}',
  'web.calendar.grid.hourLabel': '{time}',
  'web.calendar.grid.emptySlot': 'Inget vid {time} på {date}',
  'web.calendar.grid.dayColumn': '{weekday} {day}',
  'web.calendar.grid.overflow':
    '{count, plural, one {Visa # inlägg till} other {Visa # inlägg till}}',
  'web.calendar.month.label': 'Månadsrutnät för {month}',
  'web.calendar.agenda.label': 'Agenda för {range}',
  'web.calendar.agenda.dayHeading': '{weekday}, {date}',
  'web.calendar.agenda.emptyDay': 'Inget schemalagt',

  'web.calendar.table.caption': 'Varje inlägg i {range}, sorterat efter publiceringstid.',
  'web.calendar.table.column.time': 'Tid',
  'web.calendar.table.column.account': 'konto',
  'web.calendar.table.column.content': 'Innehåll',
  'web.calendar.table.column.language': 'Språk',
  'web.calendar.table.column.media': 'Media',
  'web.calendar.table.column.status': 'Status',
  'web.calendar.table.column.approver': 'Godkännare',
  'web.calendar.table.column.campaign': 'Kampanj',
  'web.calendar.table.column.actions': 'Åtgärder',
  'web.calendar.table.rowMenu': 'Åtgärder för {title}',
  'web.calendar.table.noApprover': 'Inget godkännande behövs',
  'web.calendar.table.noCampaign': 'Ingen kampanj',

  'web.calendar.entry.untitled': 'Utkast utan titel',
  'web.calendar.entry.language': 'Språk {locale}',
  'web.calendar.entry.openDetail': 'Öppna {title}',
  'web.calendar.entry.selected': '{title} valt. {hint}',
  'web.calendar.detail.title': 'Schemalagt inlägg',
  'web.calendar.detail.close': 'Stäng detta inlägg',

  'web.calendar.keyboard.title': 'Flytta ett inlägg med tangentbordet',
  'web.calendar.keyboard.body':
    'Fokusera på ett inlägg och tryck på Retur för att öppna det. Tryck på M för att ta upp ett inlägg, använd sedan piltangenterna för att flytta det en plats och Enter för att bekräfta. Tryck på Escape för att sätta tillbaka den.',
  'web.calendar.keyboard.pickUp': 'Flytta detta inlägg',
  'web.calendar.keyboard.grabbed':
    '{title} hämtas från {from}. Piltangenterna flyttar den. Enter bekräftar. Escape avbryts.',
  'web.calendar.keyboard.moved': 'Föreslagen tid {to}. Enter bekräftar.',
  'web.calendar.keyboard.released': '{title} sätt tillbaka till {from}.',
  'web.calendar.keyboard.stepMinutes': 'Varje steg är {minutes} minuter.',

  'web.calendar.reschedule.title': 'Flytta detta inlägg?',
  'web.calendar.reschedule.subject': '{account} på {provider}',
  'web.calendar.reschedule.from': 'Från {local} ({utc} UTC)',
  'web.calendar.reschedule.to': 'Till {local} ({utc} UTC)',
  'web.calendar.reschedule.confirm': 'Flytta inlägg',
  'web.calendar.reschedule.dstTitle': 'Klockorna växlar mellan dessa två tider',
  'web.calendar.reschedule.dstBody':
    'Offset i {timeZone} är {fromOffset} vid den gamla tiden och {toOffset} vid den nya tiden. Den lokala timmen du valde behålls, så UTC-ögonblicket ändras.',
  'web.calendar.reschedule.conflictTitle': 'Andra inlägg är nära den här tiden',
  'web.calendar.reschedule.conflictBody':
    '{account} har redan {count, plural, one {# inlägg} other {# inlägg}} inom {window} efter den nya tiden.',
  'web.calendar.reschedule.campaignTitle': 'Kampanjkonflikt',
  'web.calendar.reschedule.campaignBody':
    'Kampanjen {campaign} löper från {start} till {end}. Den nya tiden är utanför det fönstret.',
  'web.calendar.reschedule.leadTimeTitle': 'Det här är väldigt snart',
  'web.calendar.reschedule.leadTimeBody':
    'Den nya tiden är {duration} från och med nu. {provider} behöver {required} för att förbereda media för denna inläggstyp.',
  'web.calendar.reschedule.pastTitle': 'Den tiden har gått',
  'web.calendar.reschedule.pastBody': 'Välj en tid i framtiden eller publicera nu istället.',

  'web.calendar.published.title': 'Det här inlägget är redan publicerat',
  'web.calendar.published.body':
    'Ett inlägg finns på {provider} vid {permalinkLabel}. Att flytta posten i Relay flyttar inte stolpen på plattformen. Välj vad du vill ska hända.',
  'web.calendar.published.optionLocal': 'Uppdatera endast den lokala posten',
  'web.calendar.published.optionLocalHint':
    'Kvittot håller den verkliga publiceringstiden. Endast planeringsposten flyttas, så din kalender matchar din plan.',
  'web.calendar.published.optionNew': 'Schemalägg ett nytt inlägg vid den nya tiden',
  'web.calendar.published.optionNewHint':
    'Detta skapar ett andra, separat externt inlägg. Den som redan är på {provider} stannar online.',
  'web.calendar.published.optionLabel': 'Vad ska hända',

  'web.calendar.attention.title':
    '{count, plural, one {# inlägg behöver ett beslut eller en fix} other {# inlägg behöver ett beslut eller en fix}}',
  'web.calendar.attention.body': 'De stannar här och i actioncentret tills de är lösta.',
  'web.calendar.attention.open': 'Öppna åtgärdscentret',
  'web.calendar.attention.showOnly': 'Visa endast dessa',

  'web.calendar.loading': 'Laddar schemat',
  'web.calendar.error.title': 'Schemat kunde inte laddas',
  'web.calendar.error.body':
    'Inget schemalagt har ändrats. Dina inlägg publiceras fortfarande på planerade tider.',
  'web.calendar.error.retry': 'Försök igen',
  'web.calendar.empty.example':
    '09:30 Europe/Berlin, X @acme, "Schemalagda första kommentarer är live", Schemalagt, 1 bild',
  'web.calendar.emptyFiltered.body':
    'Inget inlägg i {range} matchar dessa filter. Vidga intervallet eller rensa ett filter.',
  'web.calendar.offline.title': 'Du är offline',
  'web.calendar.offline.body':
    'Schemat nedan är den senaste kopian som denna enhet laddade. Omplanering och publicering är inte tillgängliga förrän anslutningen återgår.',
  'web.calendar.rateLimited.cause':
    'Denna arbetsyta läser kalendern fler gånger än vad det aktuella fönstret tillåter.',
  'web.calendar.rateLimited.resetLabel': 'Du kan försöka igen i',
  'web.calendar.rateLimited.resetUnknown': '{provider} sa inte när detta återställs.',
  'web.calendar.permission.requirementsLabel': 'Erforderligt omfattning',
  'web.calendar.permission.title': 'Du kan inte se den här kalendern',
  'web.calendar.permission.body':
    'Kalenderåtkomst beviljas per projekt. Ditt konto finns inte på projekten i den här vyn.',

  /* ---------------------------------------------------------------------
   * Post job and publication receipt
   * ------------------------------------------------------------------- */
  'web.receipt.breadcrumb.calendar': 'Kalender',
  'web.receipt.breadcrumb.post': 'Posta',
  'web.receipt.heading': '{title}',
  'web.receipt.loading': 'Laddar publikationskvittot',
  'web.receipt.notFound.title': 'Inget kvitto med den referensen',
  'web.receipt.notFound.body':
    'Ett kvitto finns när ett inlägg har skickats. Kontrollera referensen eller öppna inlägget från kalendern.',
  'web.receipt.error.title': 'Det gick inte att ladda kvittot',
  'web.receipt.error.body':
    'Kvittot är oföränderligt och påverkas inte av detta. Ingenting återpublicerades.',

  'web.receipt.section.summary': 'Vad hände',
  'web.receipt.section.timeline': 'Händelsens tidslinje',
  'web.receipt.section.items': 'Root inlägg och följ upp artiklar',
  'web.receipt.section.attempts': 'Försök',
  'web.receipt.section.provenance': 'Proveniens',
  'web.receipt.section.cost': 'Leverantörsanvändning',
  'web.receipt.section.analytics': 'Analytics-synkronisering',
  'web.receipt.section.targets': 'Mål i denna kampanj',

  'web.receipt.item.root': 'Rotinlägg',
  'web.receipt.item.comment': 'Kommentera {position}',
  'web.receipt.item.thread': 'Trädel {position}',
  'web.receipt.item.delay': 'Körs {delay} efter rotposten',
  'web.receipt.item.noDelay': 'Körs med rotposten',
  'web.receipt.item.pending': 'Inte börjat än',
  'web.receipt.item.rootUnaffected':
    'Rotinlägget är live. Ett uppföljningsobjekt som misslyckas ändrar aldrig det.',

  'web.receipt.attempt.heading': 'Försök {number}',
  'web.receipt.attempt.startedAt': 'Startade {time}',
  'web.receipt.attempt.startedLabel': 'Startade',
  'web.receipt.attempt.responseSummary': 'Sanitiserat svar från leverantören',
  'web.receipt.attempt.duration': 'Tog {duration}',
  'web.receipt.attempt.httpStatus': 'HTTP-status',
  'web.receipt.attempt.providerRequestId': 'Referens för leverantörsbegäran',
  'web.receipt.attempt.retryable': 'Försökte igen automatiskt',
  'web.receipt.attempt.notRetryable': 'Inte försökt igen automatiskt',
  'web.receipt.attempt.nextRetry': 'Nästa försök vid {time}',
  'web.receipt.attempt.nextRetryLabel': 'Nästa försök',
  'web.receipt.attempt.showResponse': 'Visa den sanerade leverantörens svar',
  'web.receipt.attempt.hideResponse': 'Dölj det sanerade leverantörens svar',
  'web.receipt.attempt.none': 'Ett försök, inga misslyckanden.',

  'web.receipt.provenance.capabilityVersion': 'Kapacitet ögonblicksbild',
  'web.receipt.provenance.capabilityHint':
    'Ögonblicksbilden som användes vid godkännande och kontrollerades igen före avsändning.',
  'web.receipt.provenance.accountType': 'Kontotyp',
  'web.receipt.provenance.externalAccount': 'Extern kontoreferens',
  'web.receipt.provenance.workflow': 'Arbetsflödesreferens',
  'web.receipt.provenance.createdAt': 'Kvitto skrivet {time}',

  'web.receipt.approval.notRequired': 'Inget godkännande krävdes för detta mål.',
  'web.receipt.approval.policy': 'Policy {policy}',
  'web.receipt.approval.unknownPolicy': 'Policyreferens har inte registrerats',

  'web.receipt.cost.currency': 'Laddas i {currency}',
  'web.receipt.cost.estimatedLabel': 'Beräknad före publicering',
  'web.receipt.cost.actualLabel': 'Avstämt faktisk',
  'web.receipt.provenance.writtenLabel': 'Kvitto skrivet',
  'web.receipt.cost.reconciledAt': 'Avstämt {time}',
  'web.receipt.cost.notMetered': '{provider} tar inte betalt per operation för denna posttyp.',

  'web.receipt.analytics.never': 'Analytics har inte synkroniserats för det här inlägget ännu.',
  'web.receipt.analytics.explain':
    'Leverantörer samlar på sina egna scheman. Tiden nedan är när Relay senast läste dem, inte när siffrorna var sanna.',

  'web.receipt.export.download': 'Ladda ner kvittot',
  'web.receipt.export.copyReference': 'Kopiera kvittotsreferensen',
  'web.receipt.export.denied':
    'För att dela ett kvitto krävs rollen ägare, administratör eller godkännare. Du är {role}.',

  'web.receipt.partial.retryFailedOnly': 'Försök endast de mål som misslyckades igen',
  'web.receipt.partial.retryHint':
    'Ett nytt försök rör aldrig ett mål som redan producerat ett externt inlägg.',

  'web.receipt.remediation.user_action_required':
    'Detta behöver ändras i relä eller på {provider} innan det kan köras igen.',
  'web.receipt.remediation.content_invalid':
    'Redigera innehållet så att det klarar {provider}-valideringen och schemalägg det sedan igen.',
  'web.receipt.remediation.transient_provider':
    '{provider} returnerade ett tillfälligt fel. Stafetten försökte igen enligt sitt eget schema.',
  'web.receipt.remediation.permanent_provider':
    '{provider} tackade nej till detta permanent. Om du försöker med samma innehåll igen ändras inte svaret.',
  'web.receipt.remediation.internal':
    'Detta var ett fel på vår sida. Det är inspelat med referensen nedan.',
  'web.receipt.remediation.unknown':
    '{provider} returnerade något vi inte har en regel för. Det sanerade svaret finns nedan.',

  /* ---------------------------------------------------------------------
   * Connections
   * ------------------------------------------------------------------- */
  'web.connection.tab.accounts': 'konton',
  'web.connection.tab.capabilities': 'Förmåga matris',
  'web.connection.tab.groups': 'Kundgrupper',
  'web.connection.loading': 'Laddar anslutna konton',
  'web.connection.error.title': 'Det gick inte att läsa in anslutna konton',
  'web.connection.error.body':
    'Publiceringen påverkas inte. Schemalagda inlägg körs fortfarande mot den lagrade åtkomsten.',
  'web.connection.list.label': 'Anslutna konton',
  'web.connection.empty.example':
    'X, @acme, personlig profil, kopplad 12 juni av Ana Ruiz, publicering och mätvärden, senast publicerad 6 augusti',
  'web.connection.filter.provider': 'Plattform',
  'web.connection.filter.health': 'Hälsa',
  'web.connection.filter.group': 'Kundgrupp',
  'web.connection.filter.anyHealth': 'Någon hälsa',
  'web.connection.healthFilter.healthy': 'Arbetar',
  'web.connection.healthFilter.expiring_soon': 'Går snart ut',
  'web.connection.healthFilter.expired': 'Åtkomsten har löpt ut',
  'web.connection.healthFilter.revoked': 'Åtkomst återkallad',
  'web.connection.healthFilter.permission_missing': 'Saknar behörighet',
  'web.connection.healthFilter.review_pending': 'Väntar på granskning av plattformen',
  'web.connection.healthFilter.paused': 'Pausad',
  'web.connection.healthFilter.unknown': 'Hälsa otillgänglig',

  'web.connection.row.summaryLabel': 'Vad det här kontot kan göra',
  'web.connection.row.expand': 'Visa hela sammanfattningen för {account}',
  'web.connection.row.collapse': 'Dölj hela sammanfattningen för {account}',
  'web.connection.row.metered': 'Mäts per operation. Beräknad {amount} per skapad inlägg.',
  'web.connection.row.limitationHeading': 'Begränsningar på detta konto',
  'web.connection.row.noLimitations': 'Ingen produktions- eller betabegränsning på detta konto.',
  'web.connection.row.beta': 'Beta-kontakt',
  'web.connection.row.betaBody':
    'Den här kontakten fungerar, med gränser som vi inte har verifierat klart. Kontrollera det publicerade inlägget innan du litar på det.',

  'web.connection.detail.expiryLabel': 'Åtkomsten löper ut',
  'web.connection.health.expiresIn': 'Åtkomsten löper ut {relativeTime}, den {date}',
  'web.connection.health.noExpiry':
    'Denna åtkomst löper inte ut enligt ett schema {provider} säger till oss.',
  'web.connection.health.checkedAt': 'Hälsokontrollerad {relativeTime}',

  'web.connection.action.inspect': 'Inspektera behörigheter',
  'web.connection.action.viewCapabilities': 'Se vad den stöder',
  'web.connection.action.moveGroup': 'Flytta till en annan grupp',
  'web.connection.action.menu': 'Fler åtgärder för {account}',

  'web.connection.pause.title': 'Pausa {account}?',
  'web.connection.resume.title': 'Återuppta {account}?',
  'web.connection.resume.body':
    'Schemalagda inlägg för det här kontot börjar publiceras igen vid planerade tider. Inlägg vars tid redan har gått avfyras inte retroaktivt.',
  'web.connection.disconnect.confirmWord': 'KOPPLA FRÅN',
  'web.connection.disconnect.consequence.scheduled':
    '{count, plural, one {# schemalagt inlägg} other {# schemalagda inlägg}} för detta konto kommer inte att publiceras.',
  'web.connection.disconnect.consequence.published':
    'Redan publicerade inlägg stannar på {provider}. Relä tar inte bort dem.',
  'web.connection.disconnect.consequence.analytics':
    'Mätvärden som redan har samlats in stannar i den här arbetsytan och slutar uppdateras.',

  'web.connection.connect.title': 'Anslut ett konto',
  'web.connection.connect.chooseProvider': 'Vilken plattform',
  'web.connection.connect.permissionHeading': 'Vad Relay kommer att fråga {provider} om',
  'web.connection.connect.requirementHeading': 'Innan du fortsätter',
  'web.connection.connect.continue': 'Fortsätt till {provider}',
  'web.connection.connect.handoffNote':
    'Nästa skärm är {provider}, inte Relä. Relay ser aldrig ditt lösenord.',
  'web.connection.connect.noWriteWithoutApproval':
    'Att ansluta ett konto publicerar ingenting. Varje inlägg följer fortfarande denna policy för godkännande av arbetsytan.',
  'web.connection.projectScope.title': 'Kanaler för {project}',
  'web.connection.projectScope.body':
    'Nya kanaler ansluter till detta projekt. Byt projekt i det övre fältet för att hantera en annan uppsättning.',
  'web.connection.projectMissing.title': 'Skapa ett projekt innan du ansluter en kanal',
  'web.connection.projectMissing.body':
    'Projekt håller kanaler, media, utkast och scheman för olika produkter eller kunder separata.',

  'web.connection.requirement.instagram':
    'Instagram-publicering behöver ett professionellt konto, vilket innebär ett företags- eller skaparkonto kopplat till en Facebook-sida.',
  'web.connection.requirement.facebook':
    'Relä publicerar på Facebook-sidor. En personlig profil kan inte vara ett publiceringsmål.',
  'web.connection.requirement.linkedin':
    'För att publicera för en organisation behöver du en innehållsadministratörsroll på den LinkedIn-sidan.',
  'web.connection.requirement.youtube':
    'Tills Google slutför appgranskningen publiceras uppladdningar från detta projekt som privata. Du kan ändra synligheten på YouTube i efterhand.',
  'web.connection.requirement.tiktok':
    'TikTok kräver att du själv väljer publik för varje inlägg. Reläet kan inte välja ett för dig.',
  'web.connection.requirement.x':
    'X avgifter per operation. Ett inlägg som innehåller en URL kostar mer än ett inlägg i vanlig text, och uppskattningen visas innan du schemalägger.',
  'web.connection.requirement.threads':
    'Trådpublicering använder kontot som är länkat till ditt professionella Instagramkonto.',
  'web.connection.requirement.bluesky':
    'Bluesky ansluter med ett applösenord som skapats i dina Bluesky-inställningar, inte ditt kontolösenord.',
  'web.connection.requirement.generic':
    'Du behöver tillstånd för att göra inlägg på det här kontot från själva plattformen. Relä kan inte ge det.',

  'web.connection.purpose.publish': 'Publicera de inlägg du schemalägger i Relay.',
  'web.connection.purpose.readPosts':
    'Läser tillbaka ett inlägg Relay publicerat, så att kvittot kan bevisa att det är live.',
  'web.connection.purpose.identity':
    'Visar det exakta kontonamnet i Relay, så att du aldrig publicerar till fel.',
  'web.connection.purpose.analytics':
    'Genom att läsa statistiken som denna plattform rapporterar för dina egna inlägg.',
  'web.connection.purpose.refresh':
    'Att hålla åtkomsten vid liv så att ett schemalagt inlägg inte misslyckas över en natt.',
  'web.connection.purpose.chooseDestination':
    'Lista de sidor och kanaler du kan välja som publiceringsmål.',

  'web.connection.permissions.title': 'Behörigheter på {account}',
  'web.connection.permissions.scopeColumn': 'Tillstånd',
  'web.connection.permissions.stateColumn': 'staten',
  'web.connection.permissions.purposeColumn': 'Vad Relay använder det till',
  'web.connection.permissions.missingWarning':
    '{count, plural, one {# behörighet saknas} other {# behörigheter saknas}}. Återanslut och acceptera det för att återställa funktionerna nedan.',
  'web.connection.permissions.snapshot': 'Läs från {provider} {relativeTime}',

  'web.connection.capability.title': 'Förmåga matris',
  'web.connection.capability.subtitle':
    'Genereras från de versionerade anslutningsdefinitionerna i den här versionen och granskas sedan för hand. Det är samma data som kompositören och den offentliga kapacitetssidan använder.',
  'web.connection.capability.tableLabel': 'Förmåga per plattform',
  'web.connection.capability.featureColumn': 'Förmåga',
  'web.connection.capability.legendTitle': 'Hur man läser detta',
  'web.connection.capability.legend.supported':
    'Relä kan göra detta idag för ett uppkopplat konto av rätt typ.',
  'web.connection.capability.legend.not_implemented':
    'Plattformen erbjuder detta och Relay har inte byggt det ännu. Det finns på anslutningsfärdplanen.',
  'web.connection.capability.legend.unsupported':
    'Plattformen erbjuder inte detta via sitt officiella API, så inget verktyg kan göra det säkert.',
  'web.connection.capability.legend.requires_review':
    'Byggd och plattformen beviljar den först efter att den granskat appen eller kontot.',
  'web.connection.capability.versionLabel': 'Anslutningsdefinitioner',
  'web.connection.capability.version': 'Anslutningsdefinitioner version {version}',
  'web.connection.capability.observedAt': 'Ögonblicksbild läst {relativeTime}',
  'web.connection.capability.forAccount': 'Visas för {account}',
  'web.connection.capability.noSnapshot':
    'Ingen kapacitetsöversikt för detta konto ännu. Återanslut för att läsa en.',
  'web.connection.capability.cellLabel': '{feature} på {provider}: {state}',

  'web.connection.group.title': 'Kundgrupper',
  'web.connection.group.listLabel': 'Kundgrupper',
  'web.connection.group.accountCount':
    '{count, plural, =0 {Inga konton} one {# konto} other {# konton}}',
  'web.connection.group.create': 'Skapa en grupp',
  'web.connection.group.nameLabel': 'Gruppnamn',
  'web.connection.group.namePlaceholder': 'Acme EU',
  'web.connection.group.moveTitle': 'Flytta {account}',
  'web.connection.group.moveLabel': 'Flytta till',
  'web.connection.group.moveConfirm': 'Flytta konto',
  'web.connection.group.movedAnnouncement': '{account} flyttas till {group}',
  'web.connection.group.filterCalendarHint':
    'En grupp filtrerar kalendern och analyserna. När du flyttar ett konto behålls varje inlägg, kvitto och mätvärde som det redan har.',
  'web.connection.group.empty.title': 'Inga kundgrupper ännu',
  'web.connection.group.empty.body':
    'En grupp är en kund eller ett projekt. Gruppera konton för att filtrera kalendern och analyser efter kund.',

  'web.connection.incident.title': 'Detta konto behöver uppmärksamhet',
  'web.connection.incident.remediationHeading': 'Vad ska man göra',
  'web.connection.incident.scheduledOnHold':
    '{count, plural, one {# schemalagt inlägg väntas} other {# schemalagda inlägg väntas}} för det här kontot.',
  'web.connection.incident.nothingLost': 'Ingenting går förlorat och ingenting dupliceras.',
} as const;
