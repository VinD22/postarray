/** Calendar, queue, action center and approvals. */
export const calendarMessages = {
  'calendar.title': 'Kalendaryo',
  'calendar.view.day': 'Araw',
  'calendar.view.week': 'Linggo',
  'calendar.view.month': 'buwan',
  'calendar.view.list': 'Listahan',
  'calendar.view.label': 'View ng kalendaryo',
  'calendar.today': 'Ngayong araw',
  'calendar.goToDate': 'Pumunta sa date',
  'calendar.previousPeriod': 'Nakaraang panahon',
  'calendar.nextPeriod': 'Susunod na panahon',
  'calendar.timeZoneNote': 'Ang mga oras ay ipinapakita sa {timeZone}.',
  'calendar.weekOf': 'Linggo ng {date}',
  'calendar.dayHeading': '{weekday}, {date}',
  'calendar.slotCount': '{count, plural, =0 {Walang nakaiskedyul} one {# post} other {# mga post}}',
  'calendar.slotOverflow': '{count, plural, one {# higit pa} other {# higit pa}}',
  'calendar.newPostAt': 'Bagong post sa {time}',

  'calendar.filter.project': 'Proyekto',
  'calendar.filter.account': 'Account',
  'calendar.filter.platform': 'Plataporma',
  'calendar.filter.status': 'Katayuan',
  'calendar.filter.locale': 'Wika ng nilalaman',
  'calendar.filter.campaign': 'Kampanya',
  'calendar.filter.applied':
    '{count, plural, one {# inilapat ang filter} other {# inilapat ang mga filter}}',

  'calendar.drag.instructions':
    'I-drag ang isang post sa isang bagong slot, o piliin ito at gamitin ang mga arrow key upang ilipat ito.',
  'calendar.drag.confirmTitle': 'Ilipat ang post na ito?',
  'calendar.drag.confirmBody': 'Mula sa {from} sa {to} sa {timeZone}.',
  'calendar.drag.dstNotice':
    'Ang mga orasan ay nagbabago sa pagitan ng mga oras na ito {timeZone}. Ang bagong panahon ay {utc} UTC.',
  'calendar.drag.publishedNotice':
    'Na-publish na ang post na ito. Ang paglipat nito ay nagbabago lamang sa lokal na tala. Ang pag-publish muli nito ay isang hiwalay na aksyon.',
  'calendar.drag.conflictNotice':
    '{account} mayroon na {count, plural, one {# post} other {# mga post}} sa loob ng isang oras ng bagong oras.',

  'calendar.queue.title': 'Nakapila',
  'calendar.queue.upcoming': 'Paparating',
  'calendar.queue.needsApproval': 'Naghihintay ng pag-apruba',
  'calendar.queue.drafts': 'Mga draft',
  'calendar.queue.published': 'Nai-publish',
  'calendar.queue.failed': 'Nabigo',
  'calendar.queue.nextSlot': 'Ang susunod na libreng slot ay {time}.',

  'calendar.post.publishesAt': 'Naglalathala {time} sa {timeZone}',
  'calendar.post.publishedAt': 'Nai-publish {time}',
  'calendar.post.targetCount': '{count, plural, one {# account} other {# mga account}}',
  'calendar.post.mediaType.text': 'Text',
  'calendar.post.mediaType.image': 'Imahe',
  'calendar.post.mediaType.carousel': 'Carousel',
  'calendar.post.mediaType.video': 'Video',
  'calendar.post.mediaType.document': 'Dokumento',

  'actionCenter.title': 'Sentro ng pagkilos',
  'actionCenter.description': 'Lahat ng kailangan ng desisyon o ayusin, sa isang pila.',
  'actionCenter.empty': 'Walang nangangailangan ng pansin sa ngayon.',
  'actionCenter.item.connectionExpiring':
    '{account} kailangang ikonekta muli bago {date} o mabibigo ang mga naka-iskedyul na post.',
  'actionCenter.item.connectionActionRequired':
    '{account} nangangailangan ng pansin sa {provider} bago ito mai-publish muli.',
  'actionCenter.item.validationFailed':
    'Isang draft para sa {account} hindi pumasa {provider} pagpapatunay.',
  'actionCenter.item.approvalOverdue':
    'Isang kahilingan sa pag-apruba ang naghihintay mula noon {date}.',
  'actionCenter.item.scheduleConflict':
    '{account} may mga post na naka-iskedyul na malapit sa {date}.',
  'actionCenter.item.providerIncident':
    '{provider} ay nag-uulat ng problema. Susubukang muli ang mga naka-iskedyul na post.',
  'actionCenter.item.commentFailed':
    'Na-publish ang pangunahing post, ngunit isang follow up na item para sa {account} nabigo.',
  'actionCenter.item.analyticsStale':
    'Analytics para sa {account} hindi nag-update mula noon {date}.',
  'actionCenter.item.rssStalled':
    'Ang feed {name} ay hindi nagbalik ng wastong item mula noon {date}.',
  'actionCenter.item.webhookFailing':
    'Mga paghahatid sa {endpoint} nabigo {count, plural, one {# oras} other {# beses}} magkasunod.',
  'actionCenter.item.usageBalance':
    'Isang metered na aksyon para sa {provider} kailangan ng balanse sa paggamit bago ito tumakbo.',

  'approval.title': 'Mga pag-apruba',
  'approval.requestTitle': 'Kahilingan sa pag-apruba',
  'approval.requestedBy': 'Hiniling ni {name} {relativeTime}',
  'approval.requestedFrom': 'Naghihintay sa {name}',
  'approval.policy.none': 'Walang kinakailangang pag-apruba para sa mga target na ito.',
  'approval.policy.anyApprover': 'Maaaring aprubahan ito ng sinumang approver.',
  'approval.policy.namedApprover': '{name} dapat aprubahan ito.',
  'approval.policy.everyApprover': 'Dapat aprubahan ito ng bawat approver.',
  'approval.decision.approvedBy': 'Inaprubahan ni {name} sa {date}',
  'approval.decision.rejectedBy': 'Tinanggihan ni {name} sa {date}',
  'approval.decision.changesRequestedBy': 'Mga pagbabagong hiniling ni {name} sa {date}',
  'approval.comment.label': 'Paalala para sa may-akda',
  'approval.comment.placeholder': 'Sabihin kung ano ang kailangang baguhin at bakit.',
  'approval.reapproval.needed':
    'Nagbago ang post na ito pagkatapos ng pag-apruba. Nangangailangan itong muli ng pag-apruba bago ito mai-publish.',
  'approval.reapproval.reason.content': 'Nagbago ang nilalaman.',
  'approval.reapproval.reason.account': 'Nagbago ang mga target na account.',
  'approval.reapproval.reason.media': 'Nagbago ang media.',
  'approval.reapproval.reason.schedule': 'Nagbago ang oras ng pag-publish.',
  'approval.reapproval.reason.privacy': 'The privacy or disclosure settings changed.',
  'approval.reapproval.reason.locale': 'Nagbago ang wika ng nilalaman.',
  'approval.expiresAt': 'Mag-e-expire ang kahilingang ito sa {date}.',
} as const;
