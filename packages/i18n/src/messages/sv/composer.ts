/** Composer: master draft, per target overrides, previews, validation, cost. */
export const composerMessages = {
  'composer.title': 'Komponera',
  'composer.titleWithBrand': 'Skriv för {brand}',
  'composer.master.label': 'Masterutkast',
  'composer.master.description':
    'Skriv en gång här. Kompatibla ändringar når alla valda mål. Öppna ett mål för att skriva en version som bara det kontot kommer att få.',
  'composer.master.globalEdit': 'Global redigering',
  'composer.master.placeholder': 'Vad vill du publicera?',
  'composer.brief.label': 'Kort',
  'composer.brief.placeholder': 'Beskriv idén, publiken och resultatet du vill ha.',
  'composer.sources.label': 'Källhänvisningar',
  'composer.sources.empty': 'Inga källor bifogade.',
  'composer.campaign.label': 'Kampanj',
  'composer.campaign.none': 'Ingen kampanj',
  'composer.contentLocale.label': 'Innehållsspråk',
  'composer.contentLocale.help': 'Språket i inlägget. Detta är separat från ditt gränssnittsspråk.',
  'composer.market.label': 'Publikmarknad',

  'composer.targets.title': 'Mål',
  'composer.targets.count':
    '{count, plural, =0 {Inga konton har valts} one {# konto} other {# konton}}',
  'composer.targets.publishSummary':
    '{count, plural, one {Detta kommer att publiceras på # konto} other {Detta kommer att publiceras på # konton}} {when, select, nu {now} schemalagt {vid schemalagd tid} other {}}',
  'composer.targets.add': 'Lägg till konton',
  'composer.targets.empty': 'Välj minst ett konto att publicera till.',
  'composer.targets.state.ready': 'Klar',
  'composer.targets.state.inherited': 'Ärvt av husse',
  'composer.targets.state.overridden': 'Åsidosatt',
  'composer.targets.state.warning': 'Kontrollera innan du publicerar',
  'composer.targets.state.error': 'Behöver en fix',
  'composer.targets.state.approvalNeeded': 'Godkännande behövs',
  'composer.targets.overrideBadge': 'Åsidosätt',
  'composer.targets.resetConfirm.title': 'Vill du återställa det här målet till huvudutkastet?',
  'composer.targets.resetConfirm.body':
    'Kopian, media och inställningar du ändrade för {account} kommer att ersättas av huvudutkastet. Andra mål berörs inte.',
  'composer.targets.divergence':
    '{count, plural, one {# mål skiljer sig från huvudutkastet} other {# mål skiljer sig från huvudutkastet}}',

  'composer.applyToAll.title': 'Tillämpa på alla mål',
  'composer.applyToAll.compatible':
    '{count, plural, one {# fält är kompatibelt med varje valt mål} other {# fält är kompatibla med varje valt mål}}',
  'composer.applyToAll.incompatible':
    '{count, plural, one {# fält kan inte tillämpas och stannar per mål} other {# fält kan inte tillämpas och stannar per mål}}',
  'composer.applyToAll.creates': 'Genom att tillämpa skapas en explicit version för varje mål.',

  'composer.editor.label': 'Posta text',
  'composer.editor.characterCount': '{used} av {limit} tecken',
  'composer.editor.characterCountOver': '{over} tecken över {limit} teckengränsen',
  'composer.editor.characterCountUnknown': 'Teckengränsen är inte tillgänglig för det här kontot',
  'composer.editor.remaining': '{count, plural, one {# tecken kvar} other {# tecken kvar}}',
  'composer.editor.hashtagCount': '{count, plural, one {# hashtag} other {# hashtags}}',
  'composer.editor.formatting': 'Formatering',
  'composer.editor.emoji': 'Emoji',
  'composer.editor.mention': 'Nämn',
  'composer.editor.link': 'Länk',

  'composer.mentions.search': 'Sök efter personer, sidor och företag',
  'composer.mentions.searching': 'Söker {provider}',
  'composer.mentions.resolved': 'Taggad {label} på {provider}',
  'composer.mentions.unresolved':
    'Detta omnämnande har inte matchats med ett {provider}-konto ännu. Den publiceras som vanlig text tills du väljer ett resultat.',
  'composer.mentions.noResults': 'Inga matchande konton på {provider}.',
  'composer.mentions.unsupported': 'Inbyggd taggning är inte tillgänglig för det här kontot.',

  'composer.destination.label': 'Destination',
  'composer.destination.placeholder': 'Välj var detta publiceras',
  'composer.destination.community': 'gemenskapen',
  'composer.destination.board': 'Styrelse',
  'composer.destination.group': 'Grupp',
  'composer.destination.page': 'Sida',
  'composer.destination.organization': 'Organisation',
  'composer.destination.channel': 'Kanal',
  'composer.destination.refresh': 'Uppdatera destinationer',
  'composer.destination.lastRefreshed': 'Resmål uppdaterade {relativeTime}',

  'composer.media.title': 'Media',
  'composer.media.count': '{count, plural, one {# fil} other {# filer}}',
  'composer.media.dropHint': 'Dra filer hit eller bläddra i ditt bibliotek.',
  'composer.media.inheritFromMaster': 'Använda mastermedia',
  'composer.media.overridden': 'Detta mål använder sina egna medier',
  'composer.media.altText.label': 'Alt text',
  'composer.media.altText.placeholder': 'Beskriv bilden för personer som använder en skärmläsare.',
  'composer.media.altText.missing': 'Alt-text saknas.',
  'composer.media.altText.waive': 'Den här bilden behöver ingen alternativ text',
  'composer.media.altText.generate': 'Skriv alternativ text',
  'composer.media.crop': 'Crop',
  'composer.media.resize': 'Ändra storlek',
  'composer.media.rotate': 'Rotera',
  'composer.media.compress': 'Komprimera',
  'composer.media.convertFormat': 'Konvertera format',
  'composer.media.thumbnail': 'Miniatyrbild',
  'composer.media.aspectPreset': 'Förinställd plattform',
  'composer.media.original': 'Original',
  'composer.media.originalPreserved': 'Originalfilen behålls. Redigeringar skapar en ny version.',
  'composer.media.uploading': 'Laddar upp {name}',
  'composer.media.processing': 'Förbereder {name}',
  'composer.media.rights.label': 'Rättigheter och samtycke',
  'composer.media.rights.confirm':
    'Jag har rättigheterna att publicera detta media, inklusive alla personer, musik, logotyper och varumärken i det.',

  'composer.sequence.title': 'Kommentarer och tråd',
  'composer.sequence.root': 'Huvudinlägg',
  'composer.sequence.item': 'Artikel {position}',
  'composer.sequence.add': 'Lägg till kommentar eller trådobjekt',
  'composer.sequence.delayLabel': 'Fördröjning efter föregående punkt',
  'composer.sequence.delayImmediate': 'Omedelbart',
  'composer.sequence.delayMinutes': '{count, plural, one {# minut} other {# minuter}}',
  'composer.sequence.delayCustom': 'Anpassad fördröjning',
  'composer.sequence.accountLabel': 'Publicera detta objekt som',
  'composer.sequence.unsupported': 'Det här kontot stöder inte schemalagda uppföljningsobjekt.',

  'composer.repeat.title': 'Upprepa',
  'composer.repeat.off': 'Upprepa inte',
  'composer.repeat.everyDays': '{count, plural, one {Varje dag} other {Var #:e dag}}',
  'composer.repeat.endLabel': 'Sluta upprepa',
  'composer.repeat.endOnDate': 'På en dejt',
  'composer.repeat.endAfterCount': 'Efter ett antal inlägg',
  'composer.repeat.endRequired': 'Välj ett slutdatum eller ett antal repetitioner.',
  'composer.repeat.summary':
    'Upprepar {cadence} tills {end}. Varje händelse får sitt eget godkännande och kvitto.',

  'composer.links.title': 'Länkar',
  'composer.links.keepOriginal': 'Behåll den ursprungliga webbadressen',
  'composer.links.track': 'Ersätt med en spårad kort länk',
  'composer.links.utm': 'UTM-parametrar',
  'composer.links.domain': 'Länka domän',
  'composer.links.finalUrl': 'Detta kommer att publiceras som {url}',
  'composer.links.frozenAtApproval':
    'Den exakta korta webbadressen och destinationen fryses i den godkända versionen.',

  'composer.signature.title': 'Signatur',
  'composer.signature.none': 'Ingen signatur',
  'composer.signature.autoApplied': 'Signaturen {name} lades till automatiskt. Du kan ändra det.',

  'composer.set.title': 'Uppsättningar',
  'composer.set.startFrom': 'Börja från ett set',
  'composer.set.continueWithout': 'Fortsätt utan ett set',
  'composer.set.applied': 'Tillämpad uppsättning {name}. Detta utkast är nu oberoende av setet.',

  'composer.validation.title': 'Validering',
  'composer.validation.clean': 'Inga problem hittades för de valda målen.',
  'composer.validation.issueCount':
    '{count, plural, one {# nummer} other {# nummer}} över {targets, plural, one {# mål} other {# mål}}',
  'composer.validation.blocking': 'Detta måste åtgärdas innan schemaläggning.',
  'composer.validation.warning': 'Kontrollera detta innan du publicerar.',
  'composer.validation.revalidated':
    'Omkontrollerad mot nuvarande plattformsgränser {relativeTime}.',

  'composer.preview.title': 'Förhandsgranska',
  'composer.preview.forAccount': 'Förhandsgranska för {account} på {provider}',
  'composer.preview.approximate':
    'Denna förhandsvisning använder plattformsreglerna som vi har registrerat. Det publicerade inlägget kan skilja sig om plattformen ändras.',
  'composer.preview.unavailable':
    'En sann förhandsgranskning är inte tillgänglig för det här kontot ännu.',

  'composer.cost.title': 'Beräknad leverantörskostnad',
  'composer.cost.estimate':
    '{provider} uppskattar {amount} av API-användning för det här inlägget.',
  'composer.cost.linkSurcharge':
    '{provider} tar mer betalt för inlägg som innehåller en URL. Att ta bort länken sänker uppskattningen.',
  'composer.cost.bulkWarning':
    '{count, plural, one {# publikation} other {# publikationer}} i en åtgärd. Granska uppskattningen innan du fortsätter.',
  'composer.cost.reconciled': 'Faktisk användning stäms av efter publicering.',
  'composer.cost.none': 'Ingen uppmätt leverantörskostnad för detta inlägg.',

  'composer.autosave.saving': 'Sparar',
  'composer.autosave.saved': 'Sparad {relativeTime}',
  'composer.autosave.offline': 'Offline. Ditt utkast sparas på den här enheten och synkroniseras.',
  'composer.autosave.conflict':
    '{name} redigerade det här utkastet medan du skrev. Granska båda versionerna innan du sparar.',
  'composer.autosave.failed': 'Kunde inte spara. Din text finns fortfarande kvar. Försöker igen.',

  'composer.ai.title': 'Assist',
  'composer.ai.makeConcise': 'Gör mer kortfattat',
  'composer.ai.adaptForPlatform': 'Anpassa för {provider}',
  'composer.ai.transcreate': 'Transcreate till {language}',
  'composer.ai.checkClaims': 'Kontrollera anspråk',
  'composer.ai.writeAltText': 'Skriv alternativ text',
  'composer.ai.suggestHooks': 'Föreslå krokar',
  'composer.ai.suggestCta': 'Föreslå en uppmaning',
  'composer.ai.diffTitle': 'Förslag till ändring',
  'composer.ai.diffHelp': 'Ingenting förändras förrän du accepterar det.',
  'composer.ai.working': 'Jobbar på det',
  'composer.ai.sources': 'Baserat på {count, plural, one {# källa} other {# källor}} du godkände',
  'composer.ai.uncertain':
    'Den här frasen har ingen ren motsvarighet i {language}. Granska den med en infödd talare innan du publicerar den.',

  'composer.schedule.title': 'Schema',
  'composer.schedule.dateLabel': 'Datum',
  'composer.schedule.timeLabel': 'Tid',
  'composer.schedule.timeZoneLabel': 'Tidszon',
  'composer.schedule.nextFreeSlot': 'Nästa gratis slot',
  'composer.schedule.localAndUtc': '{local} i {timeZone}. {utc} UTC.',
  'composer.schedule.dstWarning':
    'Klockorna ändras i {timeZone} detta datum. Det här inlägget körs vid {local}, vilket är {utc} UTC.',
  'composer.schedule.pastWarning': 'Den tiden har gått. Välj ett senare tillfälle.',
  'composer.schedule.confirmTitle': 'Bekräfta innan schemaläggning',
  'composer.schedule.confirmPublishNow': 'Bekräfta innan du publicerar nu',
  'composer.schedule.approverLabel': 'Godkännare',
  'composer.schedule.policyLabel': 'Godkännandepolicy',
  'composer.schedule.duplicateWarning':
    'Liknande innehåll publicerades till {account} {relativeTime}. Att publicera det igen kan bryta mot plattformsreglerna för duplicerat innehåll.',
  'composer.schedule.cadenceWarning':
    '{account} har redan {count, plural, one {# post} other {# posts}} schemalagt den dagen.',
} as const;
