/**
 * Screen reader announcements and accessible names.
 *
 * These are read aloud, not shown. Keep them short, factual and in the order a
 * listener needs them. Live region announcements must not repeat decoration.
 */
export const a11yMessages = {
  'a11y.region.navigation': 'Pangunahing nabigasyon',
  'a11y.region.main': 'Pangunahing nilalaman',
  'a11y.region.composer': 'Composer',
  'a11y.region.preview': 'Silipin',
  'a11y.region.validation': 'Mga isyu sa pagpapatunay',
  'a11y.region.targets': 'Mga target na account',
  'a11y.region.notifications': 'Mga abiso',

  'a11y.announce.saved': 'Na-save ang draft',
  'a11y.announce.saving': 'Nagse-save ng draft',
  'a11y.announce.saveFailed': 'Hindi ma-save ang draft. Nandito pa rin ang text mo.',
  'a11y.announce.offline': 'Offline ka. Pinapanatili ang mga pagbabago sa device na ito.',
  'a11y.announce.online': 'Balik online',
  'a11y.announce.validationCount':
    '{count, plural, =0 {Walang mga isyu sa pagpapatunay} one {# isyu sa pagpapatunay} other {# mga isyu sa pagpapatunay}}',
  'a11y.announce.validationCleared': 'Nalutas ang lahat ng isyu sa pagpapatunay',
  'a11y.announce.targetSelected':
    '{account} pinili. {count, plural, one {# target} other {# mga target}} sa kabuuan.',
  'a11y.announce.targetOverridden': '{account} ngayon ay may sariling bersyon',
  'a11y.announce.targetReset': '{account} i-reset sa master draft',
  'a11y.announce.uploadProgress': '{name}, {percent} na-upload',
  'a11y.announce.uploadComplete': '{name} na-upload',
  'a11y.announce.uploadFailed': '{name} nabigong mag-upload',
  'a11y.announce.scheduled': 'Naka-iskedyul para sa {time} sa {timeZone}',
  'a11y.announce.rescheduled': 'Inilipat sa {time} sa {timeZone}',
  'a11y.announce.publishing': 'Paglalathala',
  'a11y.announce.published':
    '{count, plural, one {Na-publish sa # account} other {Na-publish sa # mga account}}',
  'a11y.announce.publishPartial':
    'Na-publish sa {published} ng {total} mga account. {failed, plural, one {# nangangailangan ng pansin ang account} other {# ang mga account ay nangangailangan ng pansin}}.',
  'a11y.announce.publishFailed': 'Nabigo ang pag-publish. Ang iyong nilalaman ay napanatili.',
  'a11y.announce.approvalRequested': 'Hiniling ang pag-apruba mula sa {approver}',
  'a11y.announce.approved': 'Naaprubahan',
  'a11y.announce.connectionAdded': '{account} konektado',
  'a11y.announce.connectionRemoved': '{account} nadiskonekta',
  'a11y.announce.filterApplied':
    '{count, plural, =0 {Na-clear ang mga filter} one {# inilapat ang filter} other {# inilapat ang mga filter}}, {results, plural, one {# resulta} other {# resulta}}',
  'a11y.announce.pageChanged': '{title}',
  'a11y.announce.copiedToClipboard': 'Kinopya sa clipboard',
  'a11y.announce.suggestionApplied': 'Inilapat ang mungkahi',
  'a11y.announce.suggestionRejected': 'Tinanggihan ang mungkahi',

  'a11y.label.closeDialog': 'Isara ang dialog',
  'a11y.label.openMenu': 'Buksan ang menu',
  'a11y.label.sortBy': 'Pagbukud-bukurin ayon sa {field}',
  'a11y.label.sortAscending': 'Pinagsunod-sunod pataas',
  'a11y.label.sortDescending': 'Pinagsunod-sunod pababa',
  'a11y.label.removeTarget': 'Alisin {account} mula sa mga target',
  'a11y.label.removeMedia': 'Alisin {name}',
  'a11y.label.editAltText': 'I-edit ang alt text para sa {name}',
  'a11y.label.mediaPreview': 'Preview ng {name}',
  'a11y.label.playVideo': 'Maglaro {name}',
  'a11y.label.pauseVideo': 'I-pause {name}',
  'a11y.label.calendarCell':
    '{date}, {count, plural, =0 {walang naka-schedule} one {# post} other {# mga post}}',
  'a11y.label.postSummary': '{account} sa {provider}, {state}, {time}',
  'a11y.label.characterCount': '{used} ng {limit} mga karakter na ginamit',
  'a11y.label.requiredField': 'Kinakailangan',
  'a11y.label.externalLink': 'Nagbubukas sa isang bagong tab',
  'a11y.label.loadingRegion': 'Naglo-load ng content',
  'a11y.label.expandRow': 'Ipakita ang mga detalye para sa {name}',
  'a11y.label.collapseRow': 'Itago ang mga detalye para sa {name}',
  'a11y.languagePicker.label': 'Pumili ng wika ng interface',
  'a11y.languagePicker.filterLabel': 'I-filter ang mga wika',
  'a11y.languagePicker.announceChanged': 'Binago ang wika ng interface sa {language}',

  'a11y.keyboard.hint.calendar':
    'Gamitin ang mga arrow key upang lumipat sa pagitan ng mga puwang. Pindutin ang Enter para magbukas ng post. Pindutin ang Space pagkatapos ay ang mga arrow key para mag-reschedule.',
  'a11y.keyboard.hint.composer':
    'Pindutin ang Control at ang mga bracket key upang lumipat sa pagitan ng mga target. Pindutin ang Control and I para lumipat sa susunod na isyu.',
  'a11y.keyboard.hint.dialog': 'Pindutin ang Escape para isara.',
  'a11y.keyboard.shortcutsTitle': 'Mga keyboard shortcut',

  'a11y.table.alternative': 'View ng mesa',
  'a11y.table.alternativeHint': 'Ang parehong iskedyul bilang isang sortable table.',
  'a11y.motion.reduced': 'Nababawasan ang mga animation dahil sa setting ng iyong system.',
} as const;
