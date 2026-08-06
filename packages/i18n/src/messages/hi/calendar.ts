/** Calendar, queue, action center and approvals. */
export const calendarMessages = {
  'calendar.title': 'कैलेंडर',
  'calendar.view.day': 'दिन',
  'calendar.view.week': 'सप्ताह',
  'calendar.view.month': 'महीना',
  'calendar.view.list': 'सूची',
  'calendar.view.label': 'कैलेंडर दृश्य',
  'calendar.today': 'आज',
  'calendar.goToDate': 'डेट पर जाएं',
  'calendar.previousPeriod': 'पिछली अवधि',
  'calendar.nextPeriod': 'अगली अवधि',
  'calendar.timeZoneNote': 'टाइम्स में दिखाया गया है {timeZone}.',
  'calendar.weekOf': 'का सप्ताह {date}',
  'calendar.dayHeading': '{weekday}, {date}',
  'calendar.slotCount': '{count, plural, =0 {कुछ भी निर्धारित नहीं} one {# पोस्ट} other {# पोस्ट}}',
  'calendar.slotOverflow': '{count, plural, one {# अधिक} other {# अधिक}}',
  'calendar.newPostAt': 'नई पोस्ट पर {time}',

  'calendar.filter.brand': 'ZZZप्रोटेक्टेड11ZZZ',
  'calendar.filter.account': 'खाता',
  'calendar.filter.platform': 'मंच',
  'calendar.filter.status': 'स्थिति',
  'calendar.filter.locale': 'सामग्री भाषा',
  'calendar.filter.campaign': 'अभियान',
  'calendar.filter.applied':
    '{count, plural, one {# फ़िल्टर लागू किया गया} other {# फ़िल्टर लागू किए गए}}',

  'calendar.drag.instructions':
    'किसी पोस्ट को नए स्लॉट पर खींचें, या उसे चुनें और उसे स्थानांतरित करने के लिए तीर कुंजियों का उपयोग करें।',
  'calendar.drag.confirmTitle': 'इस पोस्ट को स्थानांतरित करें?',
  'calendar.drag.confirmBody': 'से {from} को {to} में {timeZone}.',
  'calendar.drag.dstNotice':
    'इन समयों के बीच घड़ियाँ बदलती रहती हैं {timeZone}. नया समय है {utc} यूटीसी.',
  'calendar.drag.publishedNotice':
    'यह पोस्ट पहले ही प्रकाशित हो चुकी है. इसे हिलाने से केवल स्थानीय रिकॉर्ड बदल जाता है। इसे दोबारा प्रकाशित करना एक अलग कार्रवाई है.',
  'calendar.drag.conflictNotice':
    '{account} पहले से ही है {count, plural, one {# पोस्ट} other {# पोस्ट}} नए समय के एक घंटे के भीतर.',

  'calendar.queue.title': 'कतार',
  'calendar.queue.upcoming': 'आगामी',
  'calendar.queue.needsApproval': 'मंजूरी का इंतजार है',
  'calendar.queue.drafts': 'ड्राफ्ट',
  'calendar.queue.published': 'प्रकाशित',
  'calendar.queue.failed': 'असफल',
  'calendar.queue.nextSlot': 'अगला फ्री स्लॉट है {time}.',

  'calendar.post.publishesAt': 'प्रकाशित करता है {time} में {timeZone}',
  'calendar.post.publishedAt': 'प्रकाशित {time}',
  'calendar.post.targetCount': '{count, plural, one {# खाता} other {# खाते}}',
  'calendar.post.mediaType.text': 'पाठ',
  'calendar.post.mediaType.image': 'छवि',
  'calendar.post.mediaType.carousel': 'हिंडोला',
  'calendar.post.mediaType.video': 'वीडियो',
  'calendar.post.mediaType.document': 'दस्तावेज़',

  'actionCenter.title': 'क्रिया केंद्र',
  'actionCenter.description': 'वह सब कुछ जिसे निर्णय या समाधान की आवश्यकता है, एक कतार में।',
  'actionCenter.empty': 'अभी किसी भी चीज़ पर ध्यान देने की ज़रूरत नहीं है.',
  'actionCenter.item.connectionExpiring':
    '{account} पहले पुनः कनेक्ट करने की आवश्यकता है {date} या शेड्यूल किए गए पोस्ट विफल हो जाएंगे.',
  'actionCenter.item.connectionActionRequired':
    '{account} पर ध्यान देने की जरूरत है {provider} इससे पहले कि यह दोबारा प्रकाशित हो सके।',
  'actionCenter.item.validationFailed':
    'के लिए एक मसौदा {account} पास नहीं होता {provider} सत्यापन.',
  'actionCenter.item.approvalOverdue': 'तब से अनुमोदन अनुरोध की प्रतीक्षा की जा रही है {date}.',
  'actionCenter.item.scheduleConflict': '{account} पर पोस्टें एक साथ शेड्यूल की गई हैं {date}.',
  'actionCenter.item.providerIncident':
    '{provider} एक समस्या बता रहा है. अनुसूचित पोस्ट पुनः प्रयास करेंगे.',
  'actionCenter.item.commentFailed':
    'मुख्य पोस्ट प्रकाशित, लेकिन इसके लिए एक अनुवर्ती आइटम {account} विफल.',
  'actionCenter.item.analyticsStale':
    'के लिए विश्लेषिकी {account} तब से अद्यतन नहीं किया गया है {date}.',
  'actionCenter.item.rssStalled': 'चारा {name} तब से कोई वैध वस्तु वापस नहीं की है {date}.',
  'actionCenter.item.webhookFailing':
    'को डिलीवरी {endpoint} असफल हो गए हैं {count, plural, one {# समय} other {# बार}} एक पंक्ति में.',
  'actionCenter.item.usageBalance':
    'के लिए एक पैमाइश कार्रवाई {provider} इसे चलाने से पहले उपयोग संतुलन की आवश्यकता है।',

  'approval.title': 'स्वीकृतियाँ',
  'approval.requestTitle': 'अनुमोदन अनुरोध',
  'approval.requestedBy': 'द्वारा अनुरोध किया गया {name} {relativeTime}',
  'approval.requestedFrom': 'इंतज़ार कर रहा हूँ {name}',
  'approval.policy.none': 'इन लक्ष्यों के लिए किसी अनुमोदन की आवश्यकता नहीं है.',
  'approval.policy.anyApprover': 'कोई भी अनुमोदनकर्ता इसे मंजूरी दे सकता है.',
  'approval.policy.namedApprover': '{name} इसे अनुमोदित करना होगा.',
  'approval.policy.everyApprover': 'प्रत्येक अनुमोदक को इसका अनुमोदन करना होगा।',
  'approval.decision.approvedBy': 'द्वारा अनुमोदित {name} पर {date}',
  'approval.decision.rejectedBy': 'द्वारा अस्वीकृत {name} पर {date}',
  'approval.decision.changesRequestedBy': 'परिवर्तन का अनुरोध किया गया {name} पर {date}',
  'approval.comment.label': 'लेखक के लिए नोट',
  'approval.comment.placeholder': 'बताएं कि क्या बदलाव की जरूरत है और क्यों।',
  'approval.reapproval.needed':
    'अनुमोदन के बाद यह पद बदल गया. प्रकाशित होने से पहले इसे फिर से अनुमोदन की आवश्यकता है।',
  'approval.reapproval.reason.content': 'सामग्री बदल गई.',
  'approval.reapproval.reason.account': 'लक्ष्य खाते बदल गए.',
  'approval.reapproval.reason.media': 'मीडिया बदल गया.',
  'approval.reapproval.reason.schedule': 'प्रकाशन का समय बदल गया.',
  'approval.reapproval.reason.privacy': 'गोपनीयता या प्रकटीकरण सेटिंग बदल गईं.',
  'approval.reapproval.reason.locale': 'सामग्री की भाषा बदल गई.',
  'approval.expiresAt': 'यह अनुरोध समाप्त हो रहा है {date}.',
} as const;
