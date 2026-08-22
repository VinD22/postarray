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
  'calendar.hold.action': 'I-pause',
  'calendar.hold.resumeAction': 'Ipagpatuloy',
  'calendar.hold.badge': 'Naka-pause',
  'calendar.hold.badgeBilling': 'Naka-pause dahil sa billing',
  'calendar.hold.term': 'Pause',
  'calendar.hold.byPerson': 'Na-pause mo ito noong {date}.',
  'calendar.hold.byBilling':
    'Na-pause noong {date} dahil nawalan ng buong access ang workspace na ito.',
  'calendar.hold.none': 'Hindi naka-pause',

  'calendar.hold.confirmTitle': 'I-pause ang post na ito?',
  'calendar.hold.confirmBody':
    'Mananatili ang post na ito kung saan ito at hindi lalabas sa {time}. Puwede mo itong ipagpatuloy anumang oras bago iyon, o pumili ng bagong oras kung nakalipas na ang oras na iyon.',
  'calendar.hold.confirmScope':
    'Ihihinto ng pag-pause ang hindi pa nangyari. Ang anumang na-publish na sa isang platform ay mananatiling published, at hindi ito binubura o ino-edit ng pag-pause.',
  'calendar.hold.confirmNoteLabel': 'Bakit mo ipe-pause ito? (opsyonal)',
  'calendar.hold.confirmNoteHint':
    'Naka-record sa audit record para sa team mo. Hindi ito ipinapadala sa anumang platform.',
  'calendar.hold.confirm': 'I-pause ang post na ito',
  'calendar.hold.cancel': 'Panatilihin itong naka-iskedyul',

  'calendar.hold.resumeTitle': 'Ipagpatuloy ang post na ito?',
  'calendar.hold.resumeBody': 'Lalabas ito sa {time}, sa {timeZone}.',
  'calendar.hold.resumeMissedTitle': 'Nakalipas na ang oras na iyon',
  'calendar.hold.resumeMissedBody':
    'Ang post na ito ay dapat sana ay lumabas sa {time} habang naka-pause ito. Pumili ng bagong oras para hindi ito lumabas agad kapag ipinagpatuloy mo.',
  'calendar.hold.resumeTimeLabel': 'Bagong oras ng publish',
  'calendar.hold.resumeConfirm': 'Ipagpatuloy',

  'calendar.hold.paused': "Naka-pause. Hindi ito lalabas hangga't hindi mo ipinagpapatuloy.",
  'calendar.hold.resumed': 'Ipinagpatuloy na. Lalabas ito sa {time}.',

  'calendar.hold.blocked.published':
    'Nailabas na ang post na ito. Hindi na maibabalik ito ng pag-pause mula sa platform.',
  'calendar.hold.blocked.inFlight':
    'Ipinapadala ang post na ito ngayon. Huli na para i-pause ito, at kung ihihinto ito sa kalagitnaan, puwede itong maiwang bahagyang naipublish.',
  'calendar.hold.blocked.finished': 'Tapos na ang post na ito, kaya walang i-pa-pause.',
  'calendar.hold.blocked.billing':
    'Naka-hold ang post na ito dahil nawalan ng buong access ang workspace. Usaping billing ang pagpapatuloy nito, hindi pag-iiskedyul.',
  'calendar.hold.blocked.billingAction': 'Pumunta sa billing',

  /* ------------------------------------------------------- posting sets */
  'set.title': 'Mga Posting Set',
  'set.lede':
    'Isang naka-save na sagot sa "kanino ko ipapadala ito, at paano". Ang pag-apply ng Set ay kinokopya ang mga setting nito sa isang bagong draft.',
  'set.appliedOnce':
    'Isang beses lang binabasa ang isang Set, kapag inapply mo ito. Ang pag-edit dito pagkatapos ay nagbabago lang sa simula ng susunod na post. Mananatiling eksaktong pareho ang mga draft at naka-iskedyul na post na nagawa mo na mula rito.',
  'set.empty.title': 'Wala pang Set',
  'set.empty.body':
    'Gumawa ng isa para hindi mo na kailangang gawin ulit ang parehong listahan ng account sa bawat post.',
  'set.create': 'Bagong Set',
  'set.edit': 'I-edit ang Set',
  'set.archive': 'I-archive ang Set',
  'set.archived': 'Naka-archive',
  'set.archivedNote':
    'Nakatago sa picker ang mga naka-archive na Set. Hindi nagbabago ang mga post na nagawa mula sa mga ito.',
  'set.showArchived': 'Ipakita ang mga naka-archive',
  'set.saved': 'Na-save ang Set.',
  'set.archivedToast': 'Na-archive ang Set. Hindi nagbabago ang mga post na nagawa na mula rito.',

  'set.field.name': 'Pangalan',
  'set.field.nameHint': 'Ang hahanapin mo sa picker. Isa bawat proyekto.',
  'set.field.description': 'Deskripsyon',
  'set.field.descriptionHint': 'Opsyonal. Para saan ang Set na ito.',
  'set.field.targets': 'Mga account',
  'set.field.targetsHint': 'Bawat account na sisimulan ng post na nagawa mula sa Set na ito.',
  'set.field.targetCount':
    '{count, plural, =0 {Walang account} one {# account} other {# na account}}',
  'set.field.signature': 'Lagda',
  'set.field.signatureNone': 'Walang lagda',
  'set.field.approval': 'Pag-apruba',
  'set.field.approvalHint':
    'Ang pag-apruba na kailangan bago ma-publish ng post na nagawa mula sa Set na ito.',
  'set.field.schedule': 'Kailan i-publish',

  'set.approval.none': 'Walang kailangang pag-apruba',
  'set.approval.single_approver': 'Isang tinukoy na approver',
  'set.approval.any_approver': 'Kahit sinong approver',
  'set.approval.named_approver': 'Isang tiyak na approver',
  'set.approval.policy_auto': 'Kung ano ang sinasabi ng patakaran ng workspace',

  'set.slot.next_free_slot': 'Susunod na libreng slot mula sa queue',
  'set.slot.next_free_slotHint':
    'Ginagamit ang mga panuntunan ng queue ng proyektong ito para mag-alok ng oras. Nag-aalok ito; ikaw ang tatanggap.',
  'set.slot.pick_time': 'Patanungin mo ako ng oras',
  'set.slot.pick_timeHint': 'Iiwanang blangko ng pag-apply sa Set ang oras para pumili ka.',
  'set.slot.draft_only': 'Panatilihin itong draft lang',
  'set.slot.draft_onlyHint': 'Hindi ganap na ginagalaw ng pag-apply sa Set ang iskedyul.',
  'set.slot.noRules':
    'Wala pang panuntunan ng queue ang proyektong ito, kaya ia-alok ng queue ang unang libreng oras at sasabihin ito.',
  'set.slot.rulesLink': 'Mga panuntunan ng queue',

  'set.defaults.title': 'Mga default kada platform',
  'set.defaults.body':
    'Mga panimulang value na kinokopya sa bawat bagong post. Puwede mong baguhin ang alinman sa mga ito sa composer pagkatapos.',
  'set.defaults.add': 'Magdagdag ng platform',
  'set.defaults.remove': 'Alisin ang mga default ng {platform}',
  'set.defaults.privacy': 'Madla',
  'set.defaults.privacyNone': 'Default ng platform',
  'set.defaults.bodyPrefix': 'Teksto bago ang post',
  'set.defaults.bodySuffix': 'Teksto pagkatapos ng post',
  'set.defaults.requireAltText': 'Kailanganin ang alt text sa bawat larawan',
  'set.defaults.requireAltTextHint':
    "Hindi maiiskedyul sa platform na iyon ang post na nagawa mula sa Set na ito hangga't walang alt text ang bawat larawan.",
  'set.defaults.empty':
    'Walang default kada platform. Nagsisimula ang bawat account mula sa pangunahing post.',

  'set.error.nameTaken': 'May ibang Set na sa proyektong ito ang gumagamit na ng pangalang iyon.',
  'set.error.archived': 'Naka-archive na ang Set na ito. Ibalik ito bago i-edit.',
  'set.error.duplicateTarget': 'Nasa Set na ito na ang account na iyon.',
  'set.error.duplicatePlatform': 'May default na ang Set na ito para sa platform na iyon.',

  /* --------------------------------------------------- remembered targets */
  'targetMemory.setting.title': 'Alalahanin ang mga account sa pagitan ng mga post',
  'targetMemory.setting.body':
    'Kapag naka-on ito, sinisimulan ng composer ang bawat bagong post gamit ang mga account na pinili ng taong iyon huling beses sa proyektong ito. Naka-off ito maliban kung i-on mo ito.',
  'targetMemory.setting.stored':
    'Ang listahan lang ng mga account ang naitatago, at para lang sa taong pumili sa mga ito. Walang caption, oras, privacy setting, o approval state na naitatago, at walang ibang tao sa proyekto ang makakakita ng listahan mo.',
  'targetMemory.setting.offNote': 'Habang naka-off ito, wala talagang naitatago.',
  'targetMemory.setting.turnOffWarning':
    'Ang pag-off nito ay magbubura ng bawat naka-save na seleksyon sa proyektong ito, para sa lahat.',
  'targetMemory.setting.enabled': 'Naka-on',
  'targetMemory.setting.disabled': 'Naka-off',
  'targetMemory.setting.saved': 'Na-save ang setting.',
  'targetMemory.setting.cleared':
    'Na-save ang setting. Nabura ang mga naka-save na seleksyon sa proyektong ito.',

  'targetMemory.composer.restored':
    '{count, plural, one {Nagsimula gamit ang # account mula sa huling beses.} other {Nagsimula gamit ang # na account mula sa huling beses.}}',
  'targetMemory.composer.droppedSome':
    '{count, plural, one {Naiwan ang # account na ginamit mo noon dahil kailangan itong bigyan ng atensyon.} other {Naiwan ang # na account na ginamit mo noon dahil kailangan silang bigyan ng atensyon.}}',
  'targetMemory.composer.droppedAll':
    'Walang available ngayon sa mga account na ginamit mo noon, kaya walang napili nang paunang panahon.',
  'targetMemory.composer.undo': 'I-clear ang seleksyon',
  'targetMemory.composer.forget': 'Itigil ang pag-alala sa mga account ko',
  'targetMemory.composer.forgotten': 'Nabura ang naka-save mong seleksyon.',
  'targetMemory.composer.reviewAccounts': 'I-review ang mga account',
} as const;
