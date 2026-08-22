/**
 * Posting Sets, holds on scheduled work, and remembered channel selection.
 *
 * Three features that all answer "who is this going to, and when", grouped in
 * one namespace so their vocabulary stays consistent. The hold copy is the part
 * most worth reading twice: pausing stops work that has not happened, and every
 * sentence here has to say that plainly rather than implying a post can be
 * pulled back off a platform.
 */
export const postingSetMessages = {
  /* ------------------------------------------------------------- the hold */
  'calendar.hold.action': 'Pausa',
  'calendar.hold.resumeAction': 'Återuppta',
  'calendar.hold.badge': 'Pausad',
  'calendar.hold.badgeBilling': 'Pausad på grund av fakturering',
  'calendar.hold.term': 'Paus',
  'calendar.hold.byPerson': 'Pausad av dig den {date}.',
  'calendar.hold.byBilling': 'Pausad den {date} eftersom denna arbetsyta förlorade full åtkomst.',
  'calendar.hold.none': 'Inte pausad',

  'calendar.hold.confirmTitle': 'Pausa detta inlägg?',
  'calendar.hold.confirmBody':
    'Detta inlägg stannar där det är och publiceras inte klockan {time}. Du kan återuppta det när som helst innan dess, eller välja en ny tid om den redan har passerat.',
  'calendar.hold.confirmScope':
    'Att pausa stoppar det som inte har hänt än. Allt som redan publicerats till en plattform förblir publicerat, och pausning tar inte bort eller ändrar det.',
  'calendar.hold.confirmNoteLabel': 'Varför pausar du detta? (valfritt)',
  'calendar.hold.confirmNoteHint':
    'Sparas i granskningsloggen för ditt team. Skickas inte till någon plattform.',
  'calendar.hold.confirm': 'Pausa detta inlägg',
  'calendar.hold.cancel': 'Lämna det schemalagt',

  'calendar.hold.resumeTitle': 'Återuppta detta inlägg?',
  'calendar.hold.resumeBody': 'Det publiceras klockan {time}, i {timeZone}.',
  'calendar.hold.resumeMissedTitle': 'Den tiden har passerat',
  'calendar.hold.resumeMissedBody':
    'Detta inlägg skulle publiceras klockan {time} medan det var pausat. Välj en ny tid så att det inte publiceras i samma stund du återupptar det.',
  'calendar.hold.resumeTimeLabel': 'Ny publiceringstid',
  'calendar.hold.resumeConfirm': 'Återuppta',

  'calendar.hold.paused': 'Pausad. Publiceras inte förrän du återupptar det.',
  'calendar.hold.resumed': 'Återupptagen. Publiceras klockan {time}.',

  'calendar.hold.blocked.published':
    'Detta inlägg har redan publicerats. Pausning kan inte ta tillbaka det från plattformen.',
  'calendar.hold.blocked.inFlight':
    'Detta inlägg skickas just nu. Det är för sent att pausa det, och att stoppa halvvägs kan lämna det halvpublicerat.',
  'calendar.hold.blocked.finished': 'Detta inlägg är redan avslutat, så det finns inget att pausa.',
  'calendar.hold.blocked.billing':
    'Detta inlägg är pausat eftersom denna arbetsyta förlorade full åtkomst. Att återuppta det är en faktureringsfråga, inte en schemaläggningsfråga.',
  'calendar.hold.blocked.billingAction': 'Gå till fakturering',

  /* ------------------------------------------------------- posting sets */
  'set.title': 'Publiceringsuppsättningar',
  'set.lede':
    'Ett sparat svar på ”vem skickar jag detta till, och hur”. Att tillämpa en Uppsättning kopierar dess inställningar till ett nytt utkast.',
  'set.appliedOnce':
    'En Uppsättning läses bara en gång, när du tillämpar den. Att redigera den senare ändrar vad nästa inlägg utgår från. Utkast och schemalagda inlägg du redan gjort från den förblir precis som de är.',
  'set.empty.title': 'Inga Uppsättningar än',
  'set.empty.body': 'Skapa en för att sluta bygga om samma kontolista för varje inlägg.',
  'set.create': 'Ny Uppsättning',
  'set.edit': 'Redigera Uppsättning',
  'set.archive': 'Arkivera Uppsättning',
  'set.archived': 'Arkiverad',
  'set.archivedNote':
    'Arkiverade Uppsättningar döljs i väljaren. Inlägg gjorda från dem påverkas inte.',
  'set.showArchived': 'Visa arkiverade',
  'set.saved': 'Uppsättning sparad.',
  'set.archivedToast': 'Uppsättning arkiverad. Inlägg redan gjorda från den påverkas inte.',

  'set.field.name': 'Namn',
  'set.field.nameHint': 'Vad du kommer leta efter i väljaren senare. En per varumärke.',
  'set.field.description': 'Beskrivning',
  'set.field.descriptionHint': 'Valfritt. Vad denna Uppsättning är till för.',
  'set.field.targets': 'Konton',
  'set.field.targetsHint': 'Varje konto ett inlägg gjort från denna Uppsättning börjar med.',
  'set.field.targetCount': '{count, plural, =0 {Inga konton} one {# konto} other {# konton}}',
  'set.field.signature': 'Signatur',
  'set.field.signatureNone': 'Ingen signatur',
  'set.field.approval': 'Godkännande',
  'set.field.approvalHint':
    'Det godkännande ett inlägg gjort från denna Uppsättning behöver innan det kan publiceras.',
  'set.field.schedule': 'När det ska publiceras',

  'set.approval.none': 'Inget godkännande behövs',
  'set.approval.single_approver': 'En namngiven godkännare',
  'set.approval.any_approver': 'Vilken godkännare som helst',
  'set.approval.named_approver': 'En specifik godkännare',
  'set.approval.policy_auto': 'Vad arbetsytans policy säger',

  'set.slot.next_free_slot': 'Nästa lediga plats från kön',
  'set.slot.next_free_slotHint':
    'Använder detta varumärkes köregler för att föreslå en tid. Den föreslår; du accepterar.',
  'set.slot.pick_time': 'Fråga mig om en tid',
  'set.slot.pick_timeHint': 'Att tillämpa Uppsättningen lämnar tiden tom för dig att välja.',
  'set.slot.draft_only': 'Lämna det som utkast',
  'set.slot.draft_onlyHint': 'Att tillämpa Uppsättningen rör inte schemat alls.',
  'set.slot.noRules':
    'Detta varumärke har inga köregler än, så kön kommer föreslå den första lediga timmen och säga det.',
  'set.slot.rulesLink': 'Köregler',

  'set.defaults.title': 'Standardvärden per plattform',
  'set.defaults.body':
    'Startvärden som kopieras in i varje nytt inlägg. Du kan ändra vilket som helst av dem senare i redigeraren.',
  'set.defaults.add': 'Lägg till en plattform',
  'set.defaults.remove': 'Ta bort standardvärden för {platform}',
  'set.defaults.privacy': 'Sekretess',
  'set.defaults.privacyNone': 'Plattformens standard',
  'set.defaults.bodyPrefix': 'Text före inlägget',
  'set.defaults.bodySuffix': 'Text efter inlägget',
  'set.defaults.requireAltText': 'Kräv alt-text på varje bild',
  'set.defaults.requireAltTextHint':
    'Ett inlägg gjort från denna Uppsättning kan inte schemaläggas till denna plattform förrän varje bild har alt-text.',
  'set.defaults.empty': 'Inga standardvärden per plattform. Varje konto utgår från huvudinlägget.',

  'set.error.nameTaken': 'En annan Uppsättning i detta varumärke använder redan det namnet.',
  'set.error.archived': 'Denna Uppsättning är arkiverad. Återställ den innan du redigerar.',
  'set.error.duplicateTarget': 'Det kontot finns redan i denna Uppsättning.',
  'set.error.duplicatePlatform': 'Denna Uppsättning har redan standardvärden för den plattformen.',

  /* --------------------------------------------------- remembered targets */
  'targetMemory.setting.title': 'Kom ihåg konton mellan inlägg',
  'targetMemory.setting.body':
    'När detta är på börjar redigeraren varje nytt inlägg med de konton personen valde senast i detta varumärke. Det är av tills du slår på det.',
  'targetMemory.setting.stored':
    'Endast listan över konton sparas, och bara för personen som valde dem. Ingen bildtext, tid, sekretessinställning eller godkännandestatus sparas, och ingen annan i varumärket kan se din lista.',
  'targetMemory.setting.offNote': 'Medan detta är av sparas ingenting alls.',
  'targetMemory.setting.turnOffWarning':
    'Att stänga av detta raderar alla sparade val i detta varumärke, för alla.',
  'targetMemory.setting.enabled': 'På',
  'targetMemory.setting.disabled': 'Av',
  'targetMemory.setting.saved': 'Inställning sparad.',
  'targetMemory.setting.cleared': 'Inställning sparad. Sparade val i detta varumärke har raderats.',

  'targetMemory.composer.restored':
    '{count, plural, one {Startade med # konto från senast.} other {Startade med # konton från senast.}}',
  'targetMemory.composer.droppedSome':
    '{count, plural, one {# konto du använde senast utelämnades eftersom det behöver uppmärksamhet.} other {# konton du använde senast utelämnades eftersom de behöver uppmärksamhet.}}',
  'targetMemory.composer.droppedAll':
    'Inget av kontona du använde senast är tillgängligt just nu, så inget förvaldes.',
  'targetMemory.composer.undo': 'Rensa val',
  'targetMemory.composer.forget': 'Sluta komma ihåg mina konton',
  'targetMemory.composer.forgotten': 'Ditt sparade val har raderats.',
  'targetMemory.composer.reviewAccounts': 'Granska konton',
} as const;
