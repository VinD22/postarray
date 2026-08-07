/**
 * Screen reader announcements and accessible names.
 *
 * These are read aloud, not shown. Keep them short, factual and in the order a
 * listener needs them. Live region announcements must not repeat decoration.
 */
export const a11yMessages = {
  'a11y.region.navigation': 'Primär navigering',
  'a11y.region.breadcrumb': 'Brödsmulor',
  'a11y.region.main': 'Huvudinnehåll',
  'a11y.region.composer': 'Kompositör',
  'a11y.region.preview': 'Förhandsgranska',
  'a11y.region.validation': 'Valideringsproblem',
  'a11y.region.targets': 'Målkonton',
  'a11y.region.notifications': 'Aviseringar',

  'a11y.announce.saved': 'Utkast sparat',
  'a11y.announce.saving': 'Sparar utkast',
  'a11y.announce.saveFailed': 'Det gick inte att spara utkastet. Din text finns fortfarande kvar.',
  'a11y.announce.offline': 'Du är offline. Ändringar sparas på den här enheten.',
  'a11y.announce.online': 'Tillbaka online',
  'a11y.announce.validationCount':
    '{count, plural, =0 {Inga valideringsproblem} one {# valideringsproblem} other {# valideringsproblem}}',
  'a11y.announce.validationCleared': 'Alla valideringsproblem lösta',
  'a11y.announce.targetSelected':
    '{account} valt. {count, plural, one {# mål} other {# mål}} totalt.',
  'a11y.announce.targetOverridden': '{account} har nu sin egen version',
  'a11y.announce.targetReset': '{account} återställ till huvudutkastet',
  'a11y.announce.uploadProgress': '{name}, {percent} laddat upp',
  'a11y.announce.uploadComplete': '{name} laddat upp',
  'a11y.announce.uploadFailed': '{name} kunde inte laddas upp',
  'a11y.announce.scheduled': 'Schemalagt till {time} i {timeZone}',
  'a11y.announce.rescheduled': 'Flyttade till {time} i {timeZone}',
  'a11y.announce.publishing': 'Publicering',
  'a11y.announce.published':
    '{count, plural, one {Publicerad till # konto} other {Publicerad till # konton}}',
  'a11y.announce.publishPartial':
    'Publicerad till {published} av {total} konton. {failed, plural, one {# konto behöver uppmärksamhet} other {# konton behöver uppmärksamhet}}.',
  'a11y.announce.publishFailed': 'Publiceringen misslyckades. Ditt innehåll är bevarat.',
  'a11y.announce.approvalRequested': 'Godkännande begärs från {approver}',
  'a11y.announce.approved': 'Godkänd',
  'a11y.announce.connectionAdded': '{account} ansluten',
  'a11y.announce.connectionRemoved': '{account} frånkopplad',
  'a11y.announce.filterApplied':
    '{count, plural, =0 {Filter raderade} one {# filter tillämpat} other {# filter tillämpat}}, {results, plural, one {# resultat} other {# resultat}}',
  'a11y.announce.pageChanged': '{title}',
  'a11y.announce.copiedToClipboard': 'Kopierade till urklipp',
  'a11y.announce.suggestionApplied': 'Förslaget tillämpas',
  'a11y.announce.suggestionRejected': 'Förslaget avvisades',

  'a11y.label.closeDialog': 'Stäng dialogrutan',
  'a11y.label.openMenu': 'Öppna menyn',
  'a11y.label.sortBy': 'Sortera efter {field}',
  'a11y.label.sortAscending': 'Sorterat stigande',
  'a11y.label.sortDescending': 'Sorterat fallande',
  'a11y.label.removeTarget': 'Ta bort {account} från målen',
  'a11y.label.removeMedia': 'Ta bort {name}',
  'a11y.label.editAltText': 'Redigera alt-text för {name}',
  'a11y.label.mediaPreview': 'Förhandsvisning av {name}',
  'a11y.label.playVideo': 'Spela {name}',
  'a11y.label.pauseVideo': 'Pausa {name}',
  'a11y.label.calendarCell':
    '{date}, {count, plural, =0 {inget schemalagt} one {# inlägg} other {# inlägg}}',
  'a11y.label.postSummary': '{account} på {provider}, {state}, {time}',
  'a11y.label.characterCount': '{used} av {limit} tecken som används',
  'a11y.label.requiredField': 'Obligatoriskt',
  'a11y.label.externalLink': 'Öppnas i en ny flik',
  'a11y.label.loadingRegion': 'Laddar innehåll',
  'a11y.label.expandRow': 'Visa detaljer för {name}',
  'a11y.label.collapseRow': 'Dölj detaljer för {name}',
  'a11y.languagePicker.label': 'Välj gränssnittsspråk',
  'a11y.languagePicker.filterLabel': 'Filtrera språk',
  'a11y.languagePicker.announceChanged': 'Gränssnittsspråk ändrat till {language}',

  'a11y.keyboard.hint.calendar':
    'Använd piltangenterna för att flytta mellan fack. Tryck på Enter för att öppna ett inlägg. Tryck på mellanslag och sedan på piltangenterna för att ändra schemaläggning.',
  'a11y.keyboard.hint.composer':
    'Tryck på Ctrl och konsoltangenterna för att flytta mellan målen. Tryck på Control och I för att gå till nästa nummer.',
  'a11y.keyboard.hint.dialog': 'Tryck på Escape för att stänga.',
  'a11y.keyboard.shortcutsTitle': 'Kortkommandon',

  'a11y.table.alternative': 'Tabellvy',
  'a11y.table.alternativeHint': 'Samma schema som ett sorterbart bord.',
  'a11y.motion.reduced': 'Animationer reduceras på grund av din systeminställning.',
} as const;
