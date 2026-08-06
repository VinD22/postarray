/**
 * Web composer and media library chrome.
 *
 * The domain vocabulary (master draft, overrides, limits, cost, schedule) lives
 * in `composer.ts`. This file holds the strings the web surface adds on top:
 * panes, steps, the summary bar, the picture editor, upload states, rights and
 * provenance. Keys are namespaced `composerWeb.` and `mediaLib.` so they never
 * collide with the shared composer catalog.
 */
export const webComposerMessages = {
  // ---------------------------------------------------------------- shell
  'composerWeb.pane.targets': 'Inrikta konton och uppsättningar',
  'composerWeb.pane.master': 'Masterutkast och delade inställningar',
  'composerWeb.pane.variant': 'Version för det öppna målet',
  'composerWeb.pane.review': 'Förhandsgranskning, validering, kostnad och godkännande',
  'composerWeb.pane.showPreview': 'Visa förhandsvisning',
  'composerWeb.pane.hidePreview': 'Dölj förhandsgranskning',
  'composerWeb.pane.previewCollapsed':
    'Förhandsgranskningspanelen är dold. Öppna den för att kontrollera det sista inlägget.',

  'composerWeb.step.targets': 'Mål',
  'composerWeb.step.write': 'Skriv',
  'composerWeb.step.perTarget': 'Per mål',
  'composerWeb.step.review': 'Granska',
  'composerWeb.step.progress': 'Steg {current} av {total}',
  'composerWeb.step.legend': 'Kompositörssteg',

  'composerWeb.summary.label': 'Utkast till sammanfattning',
  'composerWeb.summary.targets': '{count, plural, =0 {Inga mål} one {# mål} other {# mål}}',
  'composerWeb.summary.issues':
    '{count, plural, =0 {Inga problem} one {# nummer} other {# nummer}}',
  'composerWeb.summary.notScheduled': 'Ingen tid vald',
  'composerWeb.summary.scheduledFor': '{time}',
  'composerWeb.summary.costUnknown': 'Kostnad inte prissatt ännu',
  'composerWeb.summary.openReview': 'Öppna recension',

  // ---------------------------------------------------------------- rail
  'composerWeb.rail.masterEntry': 'Masterutkast',
  'composerWeb.rail.masterHint': 'Redigera här för att nå alla mål som fortfarande ärver.',
  'composerWeb.rail.accountsHeading': 'Målkonton',
  'composerWeb.rail.setsHeading': 'Uppsättningar och grupper',
  'composerWeb.rail.setsHelp':
    'En uppsättning är en sparad grupp av konton och standardinställningar. Genom att använda en kopieras dess värden till detta utkast. Senare redigeringar av uppsättningen ändrar inte detta utkast.',
  'composerWeb.rail.openTarget': 'Öppna versionen för {account}',
  'composerWeb.rail.counter': '{used}/{limit}',
  'composerWeb.rail.counterUnknown': 'Gräns okänd',
  'composerWeb.rail.mediaCounter':
    '{count, plural, =0 {ingen media} one {# mediefil} other {# mediefiler}}',
  'composerWeb.rail.paused': 'Pausad. Den publiceras inte förrän du återupptar den.',
  'composerWeb.rail.state.notBuilt': 'Inte byggt ännu',
  'composerWeb.rail.state.unsupported': 'Leverantören stöder inte',
  'composerWeb.rail.empty': 'Inga konton har valts ännu.',
  'composerWeb.rail.emptyHelp':
    'Välj de konton som detta inlägg ska nå. Du kan lägga till mer senare.',
  'composerWeb.rail.divergenceHint':
    'Öppna ett mål för att se dess egen version. Huvudutkastet är oförändrat.',
  'composerWeb.rail.searchLabel': 'Filtrera konton',
  'composerWeb.rail.removeTarget': 'Ta bort {account}',

  // ---------------------------------------------------------- global edit
  'composerWeb.globalEdit.open': 'Global redigering',
  'composerWeb.globalEdit.title': 'Tillämpa denna ändring på alla valda mål',
  'composerWeb.globalEdit.description':
    'Huvudutkastet ändras alltid. Mål som fortfarande ärver detta fält följer det. Mål med sin egen version behåller det.',
  'composerWeb.globalEdit.fieldLabel': 'Fält',
  'composerWeb.globalEdit.compatibleHeading': 'Dessa mål tar förändringen',
  'composerWeb.globalEdit.keepsOverrideHeading': 'Dessa mål behåller sin egen version',
  'composerWeb.globalEdit.incompatibleHeading': 'Dessa mål klarar inte av förändringen',
  'composerWeb.globalEdit.incompatibleHelp':
    'Ingenting tappas utan att berätta det för dig. Varje konto nedan får en explicit version med ändringen anpassad, och du kan redigera den i efterhand.',
  'composerWeb.globalEdit.reason.textTooLong':
    '{account} tillåter {limit} tecken. Den här texten är {actual}.',
  'composerWeb.globalEdit.reason.linkNotAllowed':
    '{account} accepterar inte en länk i detta fält. Länken stannar i huvudutkastet och i målen som tillåter det.',
  'composerWeb.globalEdit.reason.mediaCountExceeded':
    '{account} accepterar {limit, plural, one {# fil} other {# filer}}. Detta utkast har {actual}.',
  'composerWeb.globalEdit.reason.mediaKindUnsupported':
    '{account} accepterar inte {mimeType} filer.',
  'composerWeb.globalEdit.reason.threadUnsupported':
    '{account} stöder inte uppföljningsobjekt, så sekvensen stannar på huvudutkastet.',
  'composerWeb.globalEdit.reason.markdownUnsupported':
    '{account} publicerar vanlig text. Formateringsmärkena visas som tecken.',
  'composerWeb.globalEdit.adaptedPreview': 'Vad {account} får istället',
  'composerWeb.globalEdit.confirm': 'Applicera och skapa versionerna',
  'composerWeb.globalEdit.nothingToApply':
    'Ingenting förändras. Huvudutkastet har redan detta värde.',
  'composerWeb.globalEdit.announced':
    '{applied, plural, one {Ändring tillämpad på # mål} other {Ändring tillämpad på # mål}}. {adapted, plural, =0 {Inget mål behövde en anpassad version} one {# mål fick en anpassad version} other {# mål fick anpassade versioner}}.',

  // ------------------------------------------------------------- override
  'composerWeb.override.heading': 'Detta mål har sin egen version',
  'composerWeb.override.fieldsChanged':
    '{count, plural, one {# fält skiljer sig från huvudutkastet} other {# fält skiljer sig från huvudutkastet}}',
  'composerWeb.override.field.body': 'Posta text',
  'composerWeb.override.field.contentKind': 'Typ av inlägg',
  'composerWeb.override.field.locale': 'Innehållsspråk',
  'composerWeb.override.field.mediaIds': 'Media',
  'composerWeb.override.field.links': 'Länkar',
  'composerWeb.override.field.signature': 'Signatur',
  'composerWeb.override.field.threadItems': 'Kommentarer och tråd',
  'composerWeb.override.field.schedule': 'Schema',
  'composerWeb.override.resetField': 'Återställ {field} till master',
  'composerWeb.override.resetFieldTitle': 'Återställa {field} för {account}?',
  'composerWeb.override.resetFieldBody':
    'Den version av {field} som skrivits för {account} kasseras och huvudutkastet används igen. Inga andra måländringar.',
  'composerWeb.override.resetAll': 'Återställ varje fält för att bemästra',
  'composerWeb.override.inheritNotice':
    'Detta mål följer masterutkastet. Om du redigerar något här skapas en version som endast {account} tar emot.',
  'composerWeb.override.created': '{account} har nu sin egen {field}.',

  // --------------------------------------------------------------- limits
  'composerWeb.limits.heading': 'Gränser för {account}',
  'composerWeb.limits.text': 'Text upp till {limit} tecken',
  'composerWeb.limits.linkCost':
    'En länk räknas som {count, plural, one {# tecken} other {# tecken}} oavsett dess längd.',
  'composerWeb.limits.images':
    '{count, plural, =0 {Inga bilder} one {# bild} other {upp till # bilder}}',
  'composerWeb.limits.videos':
    '{count, plural, =0 {Ingen video} one {# video} other {upp till # videor}}',
  'composerWeb.limits.duration': 'Video upp till {duration}',
  'composerWeb.limits.aspect': 'Bildförhållande mellan {min} och {max}',
  'composerWeb.limits.fileSize': 'Filer upp till {size}',
  'composerWeb.limits.mimeTypes': 'Godkända filtyper: {types}',
  'composerWeb.limits.source': 'Från kapacitetsögonblicksbild {version}, läs {relativeTime}.',
  'composerWeb.limits.thumbnailRequired': 'En miniatyrbild krävs.',

  // --------------------------------------------------------- native fields
  'composerWeb.native.heading': '{provider} inställningar',
  'composerWeb.native.privacy': 'Who can see this',
  'composerWeb.native.privacyChoose': 'Välj en publik',
  'composerWeb.native.privacyExplicit':
    '{provider} tillåter inte en förvald publik. Välj en innan detta kan schemaläggas.',
  'composerWeb.native.community': 'gemenskapen',
  'composerWeb.native.board': 'Styrelse',
  'composerWeb.native.group': 'Grupp eller sida',
  'composerWeb.native.organization': 'Organisation',
  'composerWeb.native.channel': 'Kanal',
  'composerWeb.native.publication': 'Publicering',
  'composerWeb.native.disclosureHeading': 'Avslöjande',
  'composerWeb.native.disclosureCommercial': 'Det här inlägget marknadsför en produkt eller tjänst',
  'composerWeb.native.disclosureBranded':
    'Det här inlägget är varumärkesinnehåll för ett annat företag',
  'composerWeb.native.disclosureAi': 'En del av detta innehåll gjordes med ett AI-verktyg',
  'composerWeb.native.disclosureUnsupported':
    '{provider} erbjuder inte denna information via sitt API. Lägg till det i texten istället.',
  'composerWeb.native.none': 'Inga {provider}-inställningar gäller för denna inläggstyp.',

  // ---------------------------------------------------- entity resolution
  'composerWeb.entity.resolvedHeading': 'Löst den {provider}',
  'composerWeb.entity.resolvedId': 'Konto-ID {externalId}',
  'composerWeb.entity.plainTextWarning':
    'Inte matchad. Den publiceras som vanlig text, vilket inte är en inbyggd tagg på {provider}.',
  'composerWeb.entity.removeMention': 'Ta bort omnämnandet av {label}',
  'composerWeb.entity.addMention': 'Lägg till ett omnämnande',
  'composerWeb.entity.mentionCount':
    '{count, plural, =0 {Inga omnämnanden} one {# omnämnande} other {# omnämnanden}}, {resolved} matchade med ett riktigt konto',
  'composerWeb.entity.lookupUnsupported':
    '{provider} erbjuder inte entitetssökning för den här kontotypen.',
  'composerWeb.entity.lookupNotBuilt':
    'Relay har inte byggt entity lookup för {provider} ännu. Inget gissas under tiden.',
  'composerWeb.entity.searchHint': 'Skriv minst två tecken och välj sedan ett resultat.',
  'composerWeb.entity.resultCount':
    '{count, plural, =0 {Inga matchningar} one {# matchning} other {# matchningar}}',

  // ---------------------------------------------------------------- links
  'composerWeb.links.heading': 'Länkar',
  'composerWeb.links.detected':
    '{count, plural, one {# länk hittades i detta utkast} other {# länkar hittades i detta utkast}}',
  'composerWeb.links.noneDetected': 'Inga länkar i detta utkast ännu.',
  'composerWeb.links.modeLabel': 'Hur den här länken publiceras',
  'composerWeb.links.original': 'Ursprunglig URL',
  'composerWeb.links.utmSource': 'Källa',
  'composerWeb.links.utmMedium': 'Medium',
  'composerWeb.links.utmCampaign': 'Kampanj',
  'composerWeb.links.utmTerm': 'Termin',
  'composerWeb.links.utmContent': 'Innehåll',
  'composerWeb.links.domainVerified': '{domain}, verifierad för denna arbetsyta',
  'composerWeb.links.domainDefault': 'Relä standarddomän',
  'composerWeb.links.domainNone': 'Ingen varumärkesdomän har verifierats ännu.',
  'composerWeb.links.notAllowedHere': '{account} tillåter inte en länk här.',

  // ------------------------------------------------------------- sequence
  'composerWeb.sequence.kindComment': 'Kommentera',
  'composerWeb.sequence.kindThread': 'Tråddel',
  'composerWeb.sequence.kindLabel': 'Artikeltyp',
  'composerWeb.sequence.moveUp': 'Flytta detta objekt tidigare',
  'composerWeb.sequence.moveDown': 'Flytta detta objekt senare',
  'composerWeb.sequence.remove': 'Ta bort det här objektet',
  'composerWeb.sequence.absoluteTime': 'Körs vid {time}, vilket är {utc} UTC.',
  'composerWeb.sequence.partialFailure':
    'Om ett objekt misslyckas förblir det redan publicerade inlägget publicerat och objekten efter det körs inte. Du får en åtgärd.',
  'composerWeb.sequence.maxReached':
    '{account} accepterar {limit, plural, one {# uppföljningsobjekt} other {# uppföljningsobjekt}}.',
  'composerWeb.sequence.minDelay':
    'Den kortaste fördröjningen {provider} tillåter här är {duration}.',
  'composerWeb.sequence.inheritAuthor': 'Samma konto som inlägget',
  'composerWeb.sequence.itemIssues':
    '{count, plural, =0 {Inga problem} one {# nummer} other {# nummer}} på denna artikel',
  'composerWeb.sequence.customMinutes': 'Protokoll efter föregående punkt',

  // --------------------------------------------------------------- repeat
  'composerWeb.repeat.enable': 'Upprepa detta inlägg',
  'composerWeb.repeat.cadenceLabel': 'Hur ofta',
  'composerWeb.repeat.maximum': 'Ett upprepande inlägg kan köras högst {limit} gånger.',
  'composerWeb.repeat.occurrenceLabel': 'Antal inlägg',
  'composerWeb.repeat.duplicateCheck':
    'Varje förekomst kontrolleras för duplicerat innehåll innan den publiceras. En händelse som inte klarar kontrollen blir en åtgärd istället för att publiceras.',
  'composerWeb.repeat.occurrenceList': 'Första händelserna',
  'composerWeb.repeat.occurrenceMore':
    '{count, plural, one {och # fler förekomster} other {och # fler förekomster}}',

  // ------------------------------------------------------ sets, signature
  'composerWeb.set.heading': 'Set och signatur',
  'composerWeb.set.pickerTitle': 'Börja från ett set',
  'composerWeb.set.pickerDescription':
    'En uppsättning fyller i mål, text och inställningar. Utkastet som skapas är oberoende, så att redigera uppsättningen senare ändrar aldrig ett godkänt eller schemalagt inlägg.',
  'composerWeb.set.accountCount': '{count, plural, one {# konto} other {# konton}}',
  'composerWeb.set.apply': 'Använd denna uppsättning',
  'composerWeb.set.none': 'Inga set sparade ännu.',
  'composerWeb.signature.pickerLabel': 'Signatur',
  'composerWeb.signature.scope': 'För {brand} på {provider} i {language}',
  'composerWeb.signature.previewHeading': 'Hur det slutar inlägget',
  'composerWeb.signature.notMatching':
    'Denna signatur är avsedd för ett annat varumärke, plattform eller språk, så den erbjuds inte här.',

  // --------------------------------------------------------------- assist
  'composerWeb.assist.menuLabel': 'Hjälp till med denna text',
  'composerWeb.assist.unavailableTitle': 'Texthjälp är inte konfigurerad',
  'composerWeb.assist.unavailableBody':
    'Ingen AI-gateway har konfigurerats för den här arbetsytan, så assistansåtgärderna är avstängda. Allt annat i kompositören fungerar normalt.',
  'composerWeb.assist.targetLabel': 'Gäller',
  'composerWeb.assist.targetMaster': 'Masterutkastet',
  'composerWeb.assist.targetVariant': 'Versionen för {account}',
  'composerWeb.assist.beforeLabel': 'Aktuell text',
  'composerWeb.assist.afterLabel': 'Föreslagen text',
  'composerWeb.assist.regionLabel': 'Föreslagen textändring, inte tillämpad ännu',
  'composerWeb.assist.added': 'lagt till',
  'composerWeb.assist.removed': 'tas bort',
  'composerWeb.assist.evidence': 'Bevis och källor',
  'composerWeb.assist.claimChecked': '{claim}',
  'composerWeb.assist.claimUnverified':
    'Ingen källa hittades för detta påstående. Kontrollera det innan du publicerar.',
  'composerWeb.assist.failed': 'Biståndsbegäran slutfördes inte. Din text är oförändrad.',
  'composerWeb.assist.noMediaGeneration':
    'Relay skapar inte bilder eller video. Ta med färdiga filer till biblioteket och publicera dem här.',

  // ------------------------------------------------------------- autosave
  'composerWeb.autosave.pinned':
    'Detta är den godkända versionen. Om du redigerar den skapas en ny version och godkännandet rensas.',
  'composerWeb.autosave.pinnedAcknowledge': 'Redigera och rensa godkännandet',
  'composerWeb.autosave.conflictTitle': 'Två versioner av detta utkast',
  'composerWeb.autosave.conflictKeepMine': 'Behåll det jag skrev',
  'composerWeb.autosave.conflictKeepTheirs': 'Använd versionen från {name}',
  'composerWeb.autosave.conflictHelp':
    'Ingenting slås samman automatiskt. Välj per fält och spara sedan.',
  'composerWeb.autosave.retry': 'Försök att spara igen',

  // ------------------------------------------------------------ shortcuts
  'composerWeb.shortcuts.title': 'Kompositörsgenvägar',
  'composerWeb.shortcuts.nextTarget': 'Nästa mål',
  'composerWeb.shortcuts.previousTarget': 'Tidigare mål',
  'composerWeb.shortcuts.nextIssue': 'Nästa nummer',
  'composerWeb.shortcuts.previousIssue': 'Föregående nummer',
  'composerWeb.shortcuts.save': 'Spara utkast nu',
  'composerWeb.shortcuts.openSchedule': 'Öppna schemabladet',
  'composerWeb.shortcuts.open': 'Visa genvägar',

  // --------------------------------------------------------------- review
  'composerWeb.review.heading': 'Granska',
  'composerWeb.review.contentVersion': 'Innehållsversion {checksum}',
  'composerWeb.review.approvalPolicy': 'Policy: {policy}',
  'composerWeb.review.approverPending': 'Väntar på beslut från {approver}.',
  'composerWeb.review.approverNone': 'Inget godkännande krävs för dessa mål.',
  'composerWeb.review.perTargetHeading': 'Vad varje konto får',
  'composerWeb.review.finalUrl': 'Publicerad länk',
  'composerWeb.review.privacyState': 'Publik: {value}',
  'composerWeb.review.disclosureState': 'Upplysning: {value}',
  'composerWeb.review.disclosureNone': 'Ingen avslöjande',
  'composerWeb.review.mediaVersion': '{name}, version {version}',
  'composerWeb.review.blocked':
    '{count, plural, one {# mål kan inte schemaläggas ännu} other {# mål kan inte schemaläggas ännu}}',
  'composerWeb.review.offlineBlocked':
    'Schemaläggning och publicering behöver en koppling. Ditt utkast är säkert på den här enheten.',
  'composerWeb.review.publishConfirm':
    'Detta publiceras till {count, plural, one {# konto} other {# konton}} direkt. Det går inte att ångra härifrån.',

  // ------------------------------------------------------------ page-level
  'composerWeb.page.newDraft': 'Nytt utkast',
  'composerWeb.page.loading': 'Laddar utkastet, dess mål och deras gränser',
  'composerWeb.page.errorTitle': 'Detta utkast kunde inte öppnas',
  'composerWeb.page.errorBody':
    'Ingenting gick förlorat. Försök igen, och om det fortsätter att misslyckas hjälper referensen nedan supporten att hitta begäran.',
  'composerWeb.page.noConnectionsTitle': 'Anslut ett konto innan du skriver',
  'composerWeb.page.noConnectionsBody':
    'Ett utkast behöver minst ett anslutet konto så att Relay känner till gränserna, förhandsgranskningen och inställningarna som ska visas.',
  'composerWeb.page.noConnectionsExample':
    'Exempel: med X och LinkedIn anslutna blir ett utkast till två inbyggda versioner med sina egna räknare.',
  'composerWeb.page.permissionTitle': 'Du kan inte skapa inlägg i den här arbetsytan',
  'composerWeb.page.permissionBody':
    'För att komponera krävs redaktörsrollen eller högre. En ägare eller administratör kan ändra din roll.',
  'composerWeb.page.rateLimitTitle': 'För många utkasträddningar på kort tid',
  'composerWeb.page.rateLimitCause':
    'Den här arbetsytan nådde sin skrivgräns för det aktuella fönstret. Din text sparas på den här enheten under tiden.',
  'composerWeb.page.rateLimitAlternative':
    'Fortsätt skriva. Sparandet återupptas automatiskt när fönstret återställs.',

  // ==================================================== media library ====
  'mediaLib.view.grid': 'Grid',
  'mediaLib.view.list': 'Lista',
  'mediaLib.view.label': 'Layout',
  'mediaLib.sort.label': 'Sortera',
  'mediaLib.sort.newest': 'Nyaste först',
  'mediaLib.sort.name': 'Namn',
  'mediaLib.sort.size': 'Störst först',
  'mediaLib.select': 'Välj {name}',
  'mediaLib.column.file': 'Arkiv',
  'mediaLib.column.type': 'Typ',
  'mediaLib.column.size': 'Storlek',
  'mediaLib.column.altText': 'Alt text',
  'mediaLib.column.rights': 'Rättigheter',
  'mediaLib.column.added': 'Tillagd',
  'mediaLib.openDetail': 'Öppna {name}',

  'mediaLib.empty.title': 'Ingen media än',
  'mediaLib.empty.body':
    'Ladda upp bilder och video du redan har, eller importera en fil från en URL. Relay kontrollerar typ och storlek mot varje konto du publicerar till.',
  'mediaLib.empty.example':
    'Exempel: launch_hero.jpg, 1600 x 900, alternativ textuppsättning, används i 2 inlägg.',
  'mediaLib.error.title': 'Biblioteket kunde inte laddas',
  'mediaLib.error.body': 'Dina filer är säkra. Ingenting förändrades av detta misslyckande.',
  'mediaLib.loading': 'Laddar ditt mediebibliotek',
  'mediaLib.permission.title': 'Du kan inte se detta arbetsytabibliotek',
  'mediaLib.permission.body':
    'Att titta på media behöver tittarrollen eller högre på detta varumärke. En ägare eller administratör kan bevilja det.',

  'mediaLib.upload.heading': 'Lägg till media',
  'mediaLib.upload.browse': 'Välj filer',
  'mediaLib.upload.dropHint':
    'Dra filer hit eller välj dem. Uppladdningarna återupptas om anslutningen avbryts.',
  'mediaLib.upload.queueHeading': 'Uppladdningar',
  'mediaLib.upload.progress': '{name}, {percent} av {size} skickas',
  'mediaLib.upload.paused': 'Pausad. {sent} av {size} är redan lagrad.',
  'mediaLib.upload.resume': 'Återuppta uppladdningen',
  'mediaLib.upload.pause': 'Pausa uppladdningen',
  'mediaLib.upload.cancel': 'Avbryt denna uppladdning',
  'mediaLib.upload.retry': 'Försök med den här uppladdningen igen',
  'mediaLib.upload.finalizing': 'Avslutar {name}',
  'mediaLib.upload.done': '{name} finns i ditt bibliotek',
  'mediaLib.upload.failed': '{name} slutfördes inte. {reason}',
  'mediaLib.upload.offline':
    'Offline. Uppladdningar fortsätter där de slutade när du återansluter.',
  'mediaLib.upload.rejectedType':
    '{name} är {mimeType}, vilket inget av dina valda konton accepterar.',
  'mediaLib.upload.rejectedSize':
    '{name} är {size}. Den lägsta gränsen för dina konton är {limit}.',
  'mediaLib.upload.acceptedBy':
    '{count, plural, one {Godkänd av # av dina konton} other {Godkänd av # av dina konton}}',
  'mediaLib.upload.rejectedBy': 'Inte accepterat av {accounts}',
  'mediaLib.upload.checkedAgainst': 'Kontrolleras mot de konton som valts i detta utkast.',
  'mediaLib.upload.noTargets':
    'Inga konton är valda, så filen kontrolleras endast mot standardinställningarna för arbetsytan.',

  'mediaLib.alt.heading': 'Alt text',
  'mediaLib.alt.help':
    'Beskriv vad som är viktigt i bilden för någon som inte kan se den. En eller två meningar brukar räcka.',
  'mediaLib.alt.count': '{used} av {limit} tecken',
  'mediaLib.alt.requiredBy': 'Krävs av {accounts}',
  'mediaLib.alt.waive': 'Denna bild innehåller ingen information',
  'mediaLib.alt.waiveReason': 'Varför det behöver ingen beskrivning',
  'mediaLib.alt.waiveHelp':
    'Använd denna endast för dekoration. En avstått bild publiceras med en tom beskrivning där plattformen tillåter det.',
  'mediaLib.alt.waived': 'Avstod från {name} den {date}. Orsak: {reason}',
  'mediaLib.alt.unsupported': '{provider} accepterar inte alt-text via sitt API för detta konto.',
  'mediaLib.alt.missingCount':
    '{count, plural, one {# fil har ingen alternativ text} other {# filer har ingen alternativ text}}',

  'mediaLib.rights.heading': 'Rättigheter och samtycke',
  'mediaLib.rights.declared': 'Deklareras av {name} den {date}',
  'mediaLib.rights.undeclared':
    'Inte deklarerat ännu. Deklarera det innan den här filen publiceras.',
  'mediaLib.rights.ownerLabel': 'Vem äger den här filen',
  'mediaLib.rights.ownerSelf': 'Denna arbetsyta',
  'mediaLib.rights.ownerLicensed': 'Licensierad från någon annan',
  'mediaLib.rights.ownerUgc': 'En kund eller skapare gav tillstånd',
  'mediaLib.rights.licenseLabel': 'Licens- eller behörighetsreferens',
  'mediaLib.rights.peopleLabel': 'Personer visas i den här filen',
  'mediaLib.rights.peopleConsent': 'Alla som visas har gått med på att publiceras',
  'mediaLib.rights.musicLabel': 'Den här filen innehåller musik eller ett ljudspår',
  'mediaLib.rights.confirm':
    'Jag har rättigheterna att publicera den här filen, inklusive alla personer, musik, logotyper och varumärken i den.',
  'mediaLib.rights.blocking':
    'Den här filen kan inte schemaläggas förrän rättigheterna har deklarerats.',

  'mediaLib.editor.heading': 'Redigera bild',
  'mediaLib.editor.description':
    'Varje redigering sparas som en ny version. Den ursprungliga filen behålls och kan återställas.',
  'mediaLib.editor.tab.crop': 'Crop',
  'mediaLib.editor.tab.transform': 'Ändra storlek och rotera',
  'mediaLib.editor.tab.canvas': 'Canvas',
  'mediaLib.editor.tab.output': 'Format och storlek',
  'mediaLib.editor.tab.thumbnail': 'Miniatyrbild',
  'mediaLib.editor.presetLabel': 'Aspekt förinställd',
  'mediaLib.editor.presetFree': 'Gratis',
  'mediaLib.editor.presetFor': '{ratio}, används av {accounts}',
  'mediaLib.editor.cropX': 'Beskär från startkanten',
  'mediaLib.editor.cropY': 'Beskär från toppen',
  'mediaLib.editor.cropWidth': 'Beskärningsbredd',
  'mediaLib.editor.cropHeight': 'Grödhöjd',
  'mediaLib.editor.cropKeyboardHint':
    'Beskärningsrutan är inställd med nummerfält, så den fungerar fullt ut från tangentbordet.',
  'mediaLib.editor.widthLabel': 'Bredd i pixlar',
  'mediaLib.editor.heightLabel': 'Höjd i pixlar',
  'mediaLib.editor.lockRatio': 'Behåll det nuvarande förhållandet',
  'mediaLib.editor.rotateLabel': 'Rotation',
  'mediaLib.editor.rotateDegrees': '{degrees} grader',
  'mediaLib.editor.flipHorizontal': 'Vänd över den vertikala axeln',
  'mediaLib.editor.flipVertical': 'Vänd över den horisontella axeln',
  'mediaLib.editor.canvasColor': 'Bakgrundsfärg',
  'mediaLib.editor.canvasFit': 'Hur bilden sitter på duken',
  'mediaLib.editor.canvasFitCover': 'Fyll duken och beskära brädden',
  'mediaLib.editor.canvasFitContain': 'Passa in hela bilden och stoppa resten',
  'mediaLib.editor.formatLabel': 'Utdataformat',
  'mediaLib.editor.qualityLabel': 'Kompressionskvalitet',
  'mediaLib.editor.qualityValue': '{value} av 100',
  'mediaLib.editor.estimatedSize': 'Beräknad effekt {size}, från {original}',
  'mediaLib.editor.estimatedSizeUnknown': 'Utdatastorleken är bara känd när filen har bearbetats.',
  'mediaLib.editor.thumbnailHelp':
    'Välj ramen eller filen som används som videominiatyr där plattformen accepterar en.',
  'mediaLib.editor.thumbnailFrame': 'Ram vid {time}',
  'mediaLib.editor.save': 'Spara som en ny version',
  'mediaLib.editor.saving': 'Sparar version {version}',
  'mediaLib.editor.saved': 'Version {version} sparad. Originalet finns kvar.',
  'mediaLib.editor.discard': 'Släng dessa ändringar',
  'mediaLib.editor.noChanges': 'Inga ändringar att spara ännu.',
  'mediaLib.editor.revalidate':
    'När du sparar kontrolleras den här filen mot varje konto i utkasten som använder den.',
  'mediaLib.editor.noGeneration':
    'Den här redigeraren ändrar filen du laddade upp. Det skapar inte nya bilder.',

  'mediaLib.versions.heading': 'Versioner',
  'mediaLib.versions.original': 'Originaluppladdning',
  'mediaLib.versions.current': 'Aktuell version',
  'mediaLib.versions.restore': 'Återställ version {version}',
  'mediaLib.versions.item': 'Version {version}, {dimensions}, {size}, {date}',

  'mediaLib.provenance.heading': 'Var denna fil kom ifrån',
  'mediaLib.provenance.sourceUrl': 'Källa URL',
  'mediaLib.provenance.fetchedAt': 'Hämtade {date}',
  'mediaLib.provenance.declaredAuthor': 'Uppgiven författare',
  'mediaLib.provenance.declaredLicense': 'Uppgiven licens',
  'mediaLib.provenance.contentCredentials': 'Autentiseringsuppgifter för inbäddat innehåll',
  'mediaLib.provenance.contentCredentialsNone':
    'Den här filen innehåller inga autentiseringsuppgifter för inbäddat innehåll. Det är vanligt och betyder inte att något är fel.',
  'mediaLib.provenance.unverified':
    'Dessa detaljer kommer från källan, inte från Relay. Kontrollera dem innan du litar på dem.',

  'mediaLib.picker.title': 'Välj media',
  'mediaLib.picker.description': 'Filer kontrolleras mot de konton som valts i detta utkast.',
  'mediaLib.picker.confirm':
    '{count, plural, =0 {Välj filer} one {Lägg till # fil} other {Lägg till # filer}}',
  'mediaLib.picker.forMaster': 'Lägger till i huvudutkastet',
  'mediaLib.picker.forVariant': 'Lägger till versionen endast för {account}',
} as const;
