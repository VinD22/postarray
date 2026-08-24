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
  'web.provider.x': 'एक्स',
  'web.provider.linkedin': 'LinkedIn',
  'web.provider.instagram': 'Instagram',
  'web.provider.facebook': 'फेसबुक',
  'web.provider.youtube': 'YouTube',
  'web.provider.tiktok': 'ZZZप्रोटेक्टेड6ZZZ',
  'web.provider.threads': 'Threads',
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
    'Mastodon आपके अपने इंस्टेंस पर बनाए गए एक्सेस टोकन से जुड़ता है, आपके पासवर्ड से नहीं।',
  'web.connection.requirement.telegram':
    'Post Array एक बॉट के रूप में पोस्ट करता है। जिस चैनल या ग्रुप में पोस्ट करना है उसमें बॉट जोड़ें।',
  'web.connection.requirement.reddit':
    'Reddit पर लिखने के लिए अनुमोदित ऐप आवश्यक है, और हर पोस्ट को शीर्षक और सबरेडिट चाहिए।',
  'web.connection.requirement.wordpress':
    'Post Array वर्डप्रेस में बनाए गए ऐप पासवर्ड से साइट के REST API के माध्यम से प्रकाशित करता है।',
  'web.connection.requirement.medium':
    'Medium OAuth से जुड़ता है और Post Array मार्कडाउन में सार्वजनिक कहानियाँ प्रकाशित करता है।',
  'web.connection.requirement.devto':
    'Dev.to आपकी Dev.to सेटिंग्स में बनाई गई API कुंजी से जुड़ता है।',
  'web.connection.requirement.pinterest':
    'Pinterest पर लिखने के लिए अनुमोदित ऐप पहुँच आवश्यक है, और पिन को छवि और अपना बोर्ड चाहिए।',
  'web.connection.requirement.discord':
    'Post Array एक बॉट के रूप में पोस्ट करता है। जिन सर्वरों और चैनलों में पोस्ट करना है उनमें बॉट जोड़ें।',
  'web.connection.requirement.slack':
    'Post Array एक ऐप के रूप में पोस्ट करता है। जिन चैनलों में पोस्ट करना है उनमें ऐप जोड़ें।',
  'web.provider.fake': 'कनेक्टर का परीक्षण करें',

  'web.accountType.personal_profile': 'व्यक्तिगत प्रोफ़ाइल',
  'web.accountType.creator_profile': 'निर्माता खाता',
  'web.accountType.business_profile': 'व्यवसाय खाता',
  'web.accountType.page': 'पेज',
  'web.accountType.organization': 'संगठन',
  'web.accountType.channel': 'चैनल',
  'web.accountType.group': 'समूह',
  'web.accountType.board': 'बोर्ड',
  'web.accountType.community': 'समुदाय',
  'web.accountType.publication': 'प्रकाशन',

  /* ---------------------------------------------------------------------
   * Calendar and queue
   * ------------------------------------------------------------------- */
  'web.calendar.description':
    'सब कुछ एक ही स्थान पर शेड्यूल किया गया, अनुमोदन की प्रतीक्षा में, प्रकाशित या अवरुद्ध किया गया।',
  'web.calendar.view.agenda': 'एजेंडा',
  'web.calendar.view.table': 'टेबल',
  'web.calendar.view.switchLabel': 'चुनें कि शेड्यूल कैसे निर्धारित किया जाता है',
  'web.calendar.range.day': '{date}',
  'web.calendar.range.week': '{start} to {end}',
  'web.calendar.range.month': '{month}',
  'web.calendar.range.label': 'Showing {range} in {timeZone}',
  'web.calendar.timeZone.workspace': 'Workspace time zone: {timeZone}',
  'web.calendar.timeZone.change': 'कार्यस्थान सेटिंग्स में परिवर्तन',
  'web.calendar.jumpToDate': 'डेट पर जाएं',
  'web.calendar.nowLabel': 'अभी',
  'web.calendar.allDayHeading': 'अभी कोई सटीक समय नहीं है',

  'web.calendar.filter.group': 'ग्राहक समूह',
  'web.calendar.filter.anyProject': 'कोई भी परियोजना',
  'web.calendar.filter.anyAccount': 'कोई भी खाता',
  'web.calendar.filter.anyPlatform': 'कोई भी मंच',
  'web.calendar.filter.anyStatus': 'कोई भी स्थिति',
  'web.calendar.filter.anyLocale': 'कोई भी सामग्री भाषा',
  'web.calendar.filter.anyCampaign': 'कोई भी अभियान',
  'web.calendar.filter.anyGroup': 'हर समूह',
  'web.calendar.filter.regionLabel': 'शेड्यूल फ़िल्टर करें',
  'web.calendar.bucket.scheduled': 'अनुसूचित',
  'web.calendar.bucket.draft': 'ड्राफ्ट और अनुमोदन',
  'web.calendar.bucket.published': 'प्रकाशित',
  'web.calendar.bucket.failed': 'ध्यान देने की जरूरत है',
  'web.calendar.filter.summary':
    '{count, plural, =0 {No filters} one {# filter} other {# filters}}, {results, plural, =0 {no posts} one {# post} other {# posts}}',

  'web.calendar.grid.label': 'Schedule grid for {range}',
  'web.calendar.grid.hourLabel': '{time}',
  'web.calendar.grid.emptySlot': 'Nothing at {time} on {date}',
  'web.calendar.grid.dayColumn': '{weekday} {day}',
  'web.calendar.grid.overflow': '{count, plural, one {Show # more post} other {Show # more posts}}',
  'web.calendar.month.label': 'Month grid for {month}',
  'web.calendar.agenda.label': 'Agenda for {range}',
  'web.calendar.agenda.dayHeading': '{weekday}, {date}',
  'web.calendar.agenda.emptyDay': 'कुछ भी निर्धारित नहीं',

  'web.calendar.table.caption': 'Every post in {range}, sorted by publish time.',
  'web.calendar.table.column.time': 'समय',
  'web.calendar.table.column.account': 'खाता',
  'web.calendar.table.column.content': 'सामग्री',
  'web.calendar.table.column.language': 'भाषा',
  'web.calendar.table.column.media': 'मीडिया',
  'web.calendar.table.column.status': 'स्थिति',
  'web.calendar.table.column.approver': 'अनुमोदनकर्ता',
  'web.calendar.table.column.campaign': 'अभियान',
  'web.calendar.table.column.actions': 'क्रियाएँ',
  'web.calendar.table.rowMenu': 'Actions for {title}',
  'web.calendar.table.noApprover': 'किसी अनुमोदन की आवश्यकता नहीं',
  'web.calendar.table.noCampaign': 'कोई अभियान नहीं',

  'web.calendar.entry.untitled': 'शीर्षक रहित ड्राफ्ट',
  'web.calendar.entry.language': 'Language {locale}',
  'web.calendar.entry.openDetail': 'Open {title}',
  'web.calendar.entry.selected': '{title} selected. {hint}',
  'web.calendar.detail.title': 'अनुसूचित पद',
  'web.calendar.detail.close': 'इस पोस्ट को बंद करें',

  'web.calendar.keyboard.title': 'कीबोर्ड से किसी पोस्ट को स्थानांतरित करें',
  'web.calendar.keyboard.body':
    'किसी पोस्ट पर फ़ोकस करें और उसे खोलने के लिए Enter दबाएँ। किसी पोस्ट को लेने के लिए M दबाएँ, फिर उसे एक स्लॉट में ले जाने के लिए तीर कुंजियों का उपयोग करें और पुष्टि करने के लिए Enter दबाएँ। इसे वापस रखने के लिए एस्केप दबाएँ।',
  'web.calendar.keyboard.pickUp': 'इस पोस्ट को स्थानांतरित करें',
  'web.calendar.keyboard.grabbed':
    '{title} picked up from {from}. Arrow keys move it. Enter confirms. Escape cancels.',
  'web.calendar.keyboard.moved': 'Proposed time {to}. Enter confirms.',
  'web.calendar.keyboard.released': '{title} put back at {from}.',
  'web.calendar.keyboard.stepMinutes': 'Each step is {minutes} minutes.',

  'web.calendar.reschedule.title': 'इस पोस्ट को स्थानांतरित करें?',
  'web.calendar.reschedule.subject': '{account} on {provider}',
  'web.calendar.reschedule.from': 'From {local} ({utc} UTC)',
  'web.calendar.reschedule.to': 'To {local} ({utc} UTC)',
  'web.calendar.reschedule.confirm': 'पोस्ट ले जाएँ',
  'web.calendar.reschedule.dstTitle': 'इन दोनों समयों के बीच घड़ियाँ बदल जाती हैं',
  'web.calendar.reschedule.dstBody':
    'The offset in {timeZone} is {fromOffset} at the old time and {toOffset} at the new time. The local hour you picked is kept, so the UTC instant shifts.',
  'web.calendar.reschedule.conflictTitle': 'अन्य पोस्ट इस समय के करीब हैं',
  'web.calendar.reschedule.conflictBody':
    '{account} already has {count, plural, one {# post} other {# posts}} within {window} of the new time.',
  'web.calendar.reschedule.campaignTitle': 'अभियान संघर्ष',
  'web.calendar.reschedule.campaignBody':
    'Campaign {campaign} runs from {start} to {end}. The new time is outside that window.',
  'web.calendar.reschedule.leadTimeTitle': 'ये बहुत जल्दी है',
  'web.calendar.reschedule.leadTimeBody':
    'The new time is {duration} from now. {provider} needs {required} to prepare media for this post type.',
  'web.calendar.reschedule.pastTitle': 'वह समय बीत चुका है',
  'web.calendar.reschedule.pastBody': 'भविष्य में कोई समय चुनें, या इसके बजाय अभी प्रकाशित करें।',

  'web.calendar.published.title': 'यह पोस्ट पहले ही प्रकाशित हो चुकी है',
  'web.calendar.published.body':
    'A post exists on {provider} at {permalinkLabel}. Moving the entry in Post Array does not move the post on the platform. Choose what you want to happen.',
  'web.calendar.published.optionLocal': 'स्थानीय रिकार्ड को ही अपडेट करें',
  'web.calendar.published.optionLocalHint':
    'रसीद वास्तविक प्रकाशन समय रखती है। केवल नियोजन प्रविष्टि चलती है, इसलिए आपका कैलेंडर आपकी योजना से मेल खाता है।',
  'web.calendar.published.optionNew': 'नये समय पर नयी पोस्ट शेड्यूल करें',
  'web.calendar.published.optionNewHint':
    'This creates a second, separate external post. The one already on {provider} stays online.',
  'web.calendar.published.optionLabel': 'क्या होना चाहिए',

  'web.calendar.attention.title':
    '{count, plural, one {# post needs a decision or a fix} other {# posts need a decision or a fix}}',
  'web.calendar.attention.body':
    'जब तक उनका समाधान नहीं हो जाता, वे यहीं और कार्रवाई केंद्र में रहते हैं।',
  'web.calendar.attention.open': 'क्रिया केंद्र खोलें',
  'web.calendar.attention.showOnly': 'इन्हें ही दिखाओ',

  'web.calendar.loading': 'शेड्यूल लोड हो रहा है',
  'web.calendar.error.title': 'शेड्यूल लोड नहीं किया जा सका',
  'web.calendar.error.body':
    'कुछ भी निर्धारित नहीं बदला गया है. आपकी पोस्ट अभी भी अपने नियोजित समय पर प्रकाशित होती हैं।',
  'web.calendar.error.retry': 'पुनः प्रयास करें',
  'web.calendar.empty.example':
    '09:30 यूरोप/बर्लिन, एक्स @acme, "शेड्यूल की गई पहली टिप्पणियाँ लाइव हैं", शेड्यूल किया गया, 1 छवि',
  'web.calendar.emptyFiltered.body':
    'No post in {range} matches these filters. Widen the range or clear a filter.',
  'web.calendar.offline.title': 'आप ऑफ़लाइन हैं',
  'web.calendar.offline.body':
    'नीचे दिया गया शेड्यूल इस डिवाइस द्वारा लोड की गई अंतिम प्रति है। कनेक्शन वापस आने तक पुनर्निर्धारण और प्रकाशन अनुपलब्ध है।',
  'web.calendar.rateLimited.cause':
    'यह कार्यस्थान कैलेंडर को वर्तमान विंडो की अनुमति से अधिक बार पढ़ता है।',
  'web.calendar.rateLimited.resetLabel': 'आप पुनः प्रयास कर सकते हैं',
  'web.calendar.rateLimited.resetUnknown': '{provider} did not say when this resets.',
  'web.calendar.permission.requirementsLabel': 'आवश्यक दायरा',
  'web.calendar.permission.title': 'आप यह कैलेंडर नहीं देख सकते',
  'web.calendar.permission.body':
    'प्रति परियोजना कैलेंडर एक्सेस प्रदान किया जाता है। इस दृश्य में आपका खाता इन परियोजनाओं पर नहीं है।',

  /* ---------------------------------------------------------------------
   * Post job and publication receipt
   * ------------------------------------------------------------------- */
  'web.receipt.breadcrumb.calendar': 'कैलेंडर',
  'web.receipt.breadcrumb.post': 'पोस्ट',
  'web.receipt.heading': '{title}',
  'web.receipt.loading': 'प्रकाशन रसीद लोड हो रही है',
  'web.receipt.notFound.title': 'उस संदर्भ के साथ कोई रसीद नहीं',
  'web.receipt.notFound.body':
    'एक बार पोस्ट भेज दिए जाने के बाद एक रसीद मौजूद रहती है। संदर्भ की जाँच करें, या कैलेंडर से पोस्ट खोलें।',
  'web.receipt.error.title': 'रसीद लोड नहीं की जा सकी',
  'web.receipt.error.body':
    'रसीद अपरिवर्तनीय है और इससे प्रभावित नहीं होती है। कुछ भी पुनः प्रकाशित नहीं किया गया.',

  'web.receipt.section.summary': 'क्या हुआ?',
  'web.receipt.section.timeline': 'घटना समयरेखा',
  'web.receipt.section.items': 'रूट पोस्ट और अनुवर्ती आइटम',
  'web.receipt.section.attempts': 'प्रयास',
  'web.receipt.section.provenance': 'उद्गम',
  'web.receipt.section.cost': 'प्रदाता उपयोग',
  'web.receipt.section.analytics': 'एनालिटिक्स सिंक',
  'web.receipt.section.targets': 'इस अभियान में लक्ष्य',

  'web.receipt.item.root': 'मूल पोस्ट',
  'web.receipt.item.comment': 'Comment {position}',
  'web.receipt.item.thread': 'Thread part {position}',
  'web.receipt.item.delay': 'Runs {delay} after the root post',
  'web.receipt.item.noDelay': 'रूट पोस्ट के साथ चलता है',
  'web.receipt.item.pending': 'अभी तक शुरू नहीं हुआ',
  'web.receipt.item.rootUnaffected':
    'रूट पोस्ट लाइव है. एक अनुवर्ती आइटम जो विफल हो जाता है वह कभी नहीं बदलता है।',

  'web.receipt.attempt.heading': 'Attempt {number}',
  'web.receipt.attempt.startedAt': 'Started {time}',
  'web.receipt.attempt.startedLabel': 'शुरू हुआ',
  'web.receipt.attempt.responseSummary': 'स्वच्छता प्रदाता प्रतिक्रिया',
  'web.receipt.attempt.duration': 'Took {duration}',
  'web.receipt.attempt.httpStatus': 'HTTP स्थिति',
  'web.receipt.attempt.providerRequestId': 'प्रदाता अनुरोध संदर्भ',
  'web.receipt.attempt.retryable': 'स्वचालित रूप से पुनः प्रयास किया गया',
  'web.receipt.attempt.notRetryable': 'स्वचालित रूप से पुनः प्रयास नहीं किया गया',
  'web.receipt.attempt.nextRetry': 'Next attempt at {time}',
  'web.receipt.attempt.nextRetryLabel': 'अगला प्रयास',
  'web.receipt.attempt.showResponse': 'स्वच्छता प्रदाता प्रतिक्रिया दिखाएँ',
  'web.receipt.attempt.hideResponse': 'स्वच्छता प्रदाता प्रतिक्रिया छिपाएँ',
  'web.receipt.attempt.none': 'एक प्रयास, कोई असफलता नहीं.',

  'web.receipt.provenance.capabilityVersion': 'क्षमता स्नैपशॉट',
  'web.receipt.provenance.capabilityHint':
    'स्नैपशॉट का उपयोग अनुमोदन के समय किया गया और प्रेषण से पहले दोबारा जांचा गया।',
  'web.receipt.provenance.accountType': 'खाता प्रकार',
  'web.receipt.provenance.externalAccount': 'बाहरी खाता संदर्भ',
  'web.receipt.provenance.workflow': 'वर्कफ़्लो संदर्भ',
  'web.receipt.provenance.createdAt': 'Receipt written {time}',

  'web.receipt.approval.notRequired': 'इस लक्ष्य के लिए किसी अनुमोदन की आवश्यकता नहीं थी.',
  'web.receipt.approval.policy': 'Policy {policy}',
  'web.receipt.approval.unknownPolicy': 'नीति संदर्भ दर्ज नहीं किया गया',

  'web.receipt.cost.currency': 'Charged in {currency}',
  'web.receipt.cost.estimatedLabel': 'प्रकाशन से पहले अनुमान लगाया गया',
  'web.receipt.cost.actualLabel': 'वास्तविक रूप से मेल मिलाप हुआ',
  'web.receipt.provenance.writtenLabel': 'रसीद लिखी',
  'web.receipt.cost.reconciledAt': 'Reconciled {time}',
  'web.receipt.cost.notMetered': '{provider} does not charge per operation for this post type.',

  'web.receipt.analytics.never': 'एनालिटिक्स ने अभी तक इस पोस्ट के लिए समन्वयन नहीं किया है।',
  'web.receipt.analytics.explain':
    'प्रदाता अपने स्वयं के शेड्यूल पर एकत्रित होते हैं। नीचे दिया गया समय वह है जब Post Array ने उन्हें आखिरी बार पढ़ा था, न कि तब जब संख्याएँ सत्य थीं।',

  'web.receipt.export.download': 'रसीद डाउनलोड करें',
  'web.receipt.export.copyReference': 'रसीद संदर्भ की प्रतिलिपि बनाएँ',
  'web.receipt.export.denied':
    'Sharing a receipt needs the owner, admin or approver role. You are {role}.',

  'web.receipt.partial.retryFailedOnly': 'केवल उन्हीं लक्ष्यों का पुनः प्रयास करें जो विफल रहे',
  'web.receipt.partial.retryHint':
    'पुनः प्रयास कभी भी उस लक्ष्य को नहीं छूता जो पहले से ही एक बाहरी पोस्ट उत्पन्न कर चुका है।',

  'web.receipt.remediation.user_action_required':
    'This needs a change in Post Array or on {provider} before it can run again.',
  'web.receipt.remediation.content_invalid':
    'Edit the content so it passes {provider} validation, then schedule it again.',
  'web.receipt.remediation.transient_provider':
    '{provider} returned a temporary error. Post Array retried on its own schedule.',
  'web.receipt.remediation.permanent_provider':
    '{provider} refused this permanently. Retrying the same content will not change the answer.',
  'web.receipt.remediation.internal':
    'यह हमारी तरफ से गलती थी. इसे नीचे संदर्भ के साथ दर्ज किया गया है।',
  'web.receipt.remediation.unknown':
    '{provider} returned something we do not have a rule for. The sanitized response is below.',

  /* ---------------------------------------------------------------------
   * Connections
   * ------------------------------------------------------------------- */
  'web.connection.tab.accounts': 'लेखा',
  'web.connection.tab.capabilities': 'क्षमता मैट्रिक्स',
  'web.connection.tab.groups': 'ग्राहक समूह',
  'web.connection.loading': 'कनेक्टेड खाते लोड हो रहे हैं',
  'web.connection.error.title': 'कनेक्टेड खाते लोड नहीं किए जा सके',
  'web.connection.error.body':
    'प्रकाशन अप्रभावित है. शेड्यूल किए गए पोस्ट अभी भी संग्रहीत पहुंच के विरुद्ध चलते हैं।',
  'web.connection.list.label': 'जुड़े हुए खाते',
  'web.connection.empty.example':
    'X, @acme, व्यक्तिगत प्रोफ़ाइल, एना रुइज़ द्वारा 12 जून को कनेक्टेड, प्रकाशन और मेट्रिक्स, अंतिम बार 6 अगस्त को प्रकाशित',
  'web.connection.filter.provider': 'मंच',
  'web.connection.filter.health': 'स्वास्थ्य',
  'web.connection.filter.group': 'ग्राहक समूह',
  'web.connection.filter.anyHealth': 'कोई भी स्वास्थ्य',
  'web.connection.healthFilter.healthy': 'कार्य करना',
  'web.connection.healthFilter.expiring_soon': 'जल्द ही समाप्त हो रहा है',
  'web.connection.healthFilter.expired': 'प्रवेश समाप्त हो गया',
  'web.connection.healthFilter.revoked': 'प्रवेश रद्द कर दिया गया',
  'web.connection.healthFilter.permission_missing': 'अनुमति अनुपलब्ध',
  'web.connection.healthFilter.review_pending': 'प्लेटफ़ॉर्म समीक्षा की प्रतीक्षा है',
  'web.connection.healthFilter.paused': 'रुका हुआ',
  'web.connection.healthFilter.unknown': 'स्वास्थ्य अनुपलब्ध',

  'web.connection.row.summaryLabel': 'यह खाता क्या कर सकता है',
  'web.connection.row.expand': 'Show the full summary for {account}',
  'web.connection.row.collapse': 'Hide the full summary for {account}',
  'web.connection.row.metered': 'Metered per operation. Estimated {amount} per post create.',
  'web.connection.row.limitationHeading': 'इस खाते पर सीमाएँ',
  'web.connection.row.noLimitations': 'इस खाते पर कोई उत्पादन या बीटा सीमा नहीं है।',
  'web.connection.row.beta': 'बीटा कनेक्टर',
  'web.connection.row.betaBody':
    'यह कनेक्टर उन सीमाओं के साथ काम करता है जिनकी हमने पुष्टि नहीं की है। प्रकाशित पोस्ट पर भरोसा करने से पहले उसे जांच लें।',

  'web.connection.detail.expiryLabel': 'प्रवेश समाप्त हो रहा है',
  'web.connection.health.expiresIn': 'Access expires {relativeTime}, on {date}',
  'web.connection.health.noExpiry':
    'This access does not expire on a schedule {provider} tells us.',
  'web.connection.health.checkedAt': 'Health checked {relativeTime}',

  'web.connection.action.inspect': 'अनुमतियों का निरीक्षण करें',
  'web.connection.action.viewCapabilities': 'देखें कि यह किसका समर्थन करता है',
  'web.connection.action.moveGroup': 'दूसरे समूह में जाएँ',
  'web.connection.action.menu': 'More actions for {account}',

  'web.connection.pause.title': 'Pause {account}?',
  'web.connection.resume.title': 'Resume {account}?',
  'web.connection.resume.body':
    'इस खाते के लिए निर्धारित पोस्ट अपने नियोजित समय पर फिर से प्रकाशित होने लगती हैं। जिन पोस्टों का समय पहले ही बीत चुका है, वे पूर्वव्यापी प्रभाव से सक्रिय नहीं होतीं।',
  'web.connection.disconnect.confirmWord': 'डिस्कनेक्ट करें',
  'web.connection.disconnect.consequence.scheduled':
    '{count, plural, one {# scheduled post} other {# scheduled posts}} for this account will not publish.',
  'web.connection.disconnect.consequence.published':
    'Posts already published stay on {provider}. Post Array does not delete them.',
  'web.connection.disconnect.consequence.analytics':
    'पहले से एकत्र किए गए मेट्रिक्स इस कार्यक्षेत्र में बने रहते हैं और अपडेट होना बंद कर देते हैं।',

  'web.connection.connect.title': 'एक खाता कनेक्ट करें',
  'web.connection.connect.chooseProvider': 'कौन सा मंच',
  'web.connection.connect.permissionHeading': 'What Post Array will ask {provider} for',
  'web.connection.connect.requirementHeading': 'इससे पहले कि आप जारी रखें',
  'web.connection.connect.continue': 'Continue to {provider}',
  'web.connection.connect.handoffNote':
    'The next screen is {provider}, not Post Array. Post Array never sees your password.',
  'web.connection.connect.noWriteWithoutApproval':
    'किसी खाते को जोड़ने से कुछ भी प्रकाशित नहीं होता है. प्रत्येक पोस्ट अभी भी इस कार्यक्षेत्र अनुमोदन नीति का पालन करती है।',

  'web.connection.requirement.instagram':
    'Instagram प्रकाशन के लिए एक पेशेवर खाते की आवश्यकता होती है, जिसका अर्थ है फेसबुक पेज से जुड़ा एक व्यवसाय या निर्माता खाता।',
  'web.connection.requirement.facebook':
    'Post Array Facebook Pages पर प्रकाशित होता है। एक व्यक्तिगत प्रोफ़ाइल प्रकाशन लक्ष्य नहीं हो सकती.',
  'web.connection.requirement.linkedin':
    'किसी संगठन के लिए प्रकाशित करने के लिए आपको उस LinkedIn पृष्ठ पर एक सामग्री व्यवस्थापक भूमिका की आवश्यकता होती है।',
  'web.connection.requirement.youtube':
    'जब तक Google ऐप ऑडिट पूरा नहीं कर लेता, तब तक इस प्रोजेक्ट के अपलोड निजी के रूप में प्रकाशित होंगे। आप बाद में YouTube पर दृश्यता बदल सकते हैं।',
  'web.connection.requirement.tiktok':
    'TikTok के लिए आवश्यक है कि आप प्रत्येक पोस्ट के लिए दर्शकों का चयन स्वयं करें। Post Array आपके लिए किसी एक का पूर्व-चयन नहीं कर सकता।',
  'web.connection.requirement.x':
    'प्रति ऑपरेशन एक्स शुल्क। एक पोस्ट जिसमें URL शामिल है, उसकी कीमत एक सादे टेक्स्ट पोस्ट से अधिक है, और अनुमान आपके शेड्यूल करने से पहले दिखाया जाता है।',
  'web.connection.requirement.threads':
    'Threads प्रकाशन आपके Instagram पेशेवर खाते से जुड़े खाते का उपयोग करता है।',
  'web.connection.requirement.bluesky':
    'Bluesky आपके Bluesky सेटिंग्स में बनाए गए ऐप पासवर्ड से कनेक्ट होता है, न कि आपके अकाउंट पासवर्ड से।',
  'web.connection.requirement.generic':
    'आपको इस खाते पर पोस्ट करने के लिए प्लेटफ़ॉर्म से ही अनुमति की आवश्यकता है। Post Array इसे प्रदान नहीं कर सकता।',

  'web.connection.purpose.publish': 'Post Array में आपके द्वारा शेड्यूल किए गए पोस्ट प्रकाशित करना।',
  'web.connection.purpose.readPosts':
    'Post Array द्वारा प्रकाशित एक पोस्ट को दोबारा पढ़ना, ताकि रसीद यह साबित कर सके कि यह लाइव है।',
  'web.connection.purpose.identity':
    'Post Array में सटीक खाता नाम दिखाया जा रहा है, ताकि आप कभी भी गलत खाता प्रकाशित न करें।',
  'web.connection.purpose.analytics':
    'आपके अपने पोस्ट के लिए यह प्लेटफ़ॉर्म रिपोर्ट करने वाले मेट्रिक्स को पढ़ना।',
  'web.connection.purpose.refresh':
    'पहुंच को जीवित रखना ताकि कोई निर्धारित पोस्ट रातों-रात विफल न हो जाए।',
  'web.connection.purpose.chooseDestination':
    'पेजों और चैनलों को सूचीबद्ध करके आप प्रकाशन लक्ष्य के रूप में चुन सकते हैं।',

  'web.connection.permissions.title': 'Permissions on {account}',
  'web.connection.permissions.scopeColumn': 'अनुमति',
  'web.connection.permissions.stateColumn': 'राज्य',
  'web.connection.permissions.purposeColumn': 'Post Array इसका उपयोग किस लिए करता है',
  'web.connection.permissions.missingWarning':
    '{count, plural, one {# permission is missing} other {# permissions are missing}}. Reconnect and accept it to restore the features below.',
  'web.connection.permissions.snapshot': 'Read from {provider} {relativeTime}',

  'web.connection.capability.title': 'क्षमता मैट्रिक्स',
  'web.connection.capability.subtitle':
    'इस बिल्ड में संस्करणित कनेक्टर परिभाषाओं से उत्पन्न किया गया, फिर हाथ से समीक्षा की गई। यह वही डेटा है जिसका उपयोग कंपोज़र और सार्वजनिक क्षमता पृष्ठ करते हैं।',
  'web.connection.capability.tableLabel': 'मंच द्वारा क्षमताएँ',
  'web.connection.capability.featureColumn': 'क्षमता',
  'web.connection.capability.legendTitle': 'इसे कैसे पढ़ें',
  'web.connection.capability.legend.supported':
    'Post Array सही प्रकार के कनेक्टेड खाते के लिए आज ही ऐसा कर सकता है।',
  'web.connection.capability.legend.not_implemented':
    'प्लेटफ़ॉर्म इसे प्रदान करता है और Post Array ने इसे अभी तक नहीं बनाया है। यह कनेक्टर रोडमैप पर है.',
  'web.connection.capability.legend.unsupported':
    'प्लेटफ़ॉर्म इसे अपने आधिकारिक API के माध्यम से पेश नहीं करता है, इसलिए कोई भी टूल इसे सुरक्षित रूप से नहीं कर सकता है।',
  'web.connection.capability.legend.requires_review':
    'निर्मित, और प्लेटफ़ॉर्म इसे ऐप या खाते की समीक्षा करने के बाद ही अनुदान देता है।',
  'web.connection.capability.versionLabel': 'कनेक्टर परिभाषाएँ',
  'web.connection.capability.version': 'Connector definitions version {version}',
  'web.connection.capability.observedAt': 'Snapshot read {relativeTime}',
  'web.connection.capability.forAccount': 'Shown for {account}',
  'web.connection.capability.noSnapshot':
    'इस खाते के लिए अभी तक कोई क्षमता स्नैपशॉट नहीं है. एक को पढ़ने के लिए पुनः कनेक्ट करें.',
  'web.connection.capability.cellLabel': '{feature} on {provider}: {state}',

  'web.connection.group.title': 'ग्राहक समूह',
  'web.connection.group.listLabel': 'ग्राहक समूह',
  'web.connection.group.accountCount':
    '{count, plural, =0 {No accounts} one {# account} other {# accounts}}',
  'web.connection.group.create': 'एक समूह बनाएं',
  'web.connection.group.nameLabel': 'समूह का नाम',
  'web.connection.group.namePlaceholder': 'एक्मे ईयू',
  'web.connection.group.moveTitle': 'Move {account}',
  'web.connection.group.moveLabel': 'की ओर बढ़ें',
  'web.connection.group.moveConfirm': 'खाता ले जाएँ',
  'web.connection.group.movedAnnouncement': '{account} moved to {group}',
  'web.connection.group.filterCalendarHint':
    'एक समूह कैलेंडर और विश्लेषण को फ़िल्टर करता है। किसी खाते को स्थानांतरित करने से उसमें पहले से मौजूद प्रत्येक पोस्ट, रसीद और मीट्रिक रहती है।',
  'web.connection.group.empty.title': 'अभी तक कोई ग्राहक समूह नहीं',
  'web.connection.group.empty.body':
    'एक समूह एक ग्राहक या एक परियोजना है। ग्राहक द्वारा कैलेंडर और एनालिटिक्स को फ़िल्टर करने के लिए समूह खाते।',

  'web.connection.incident.title': 'इस खाते पर ध्यान देने की जरूरत है',
  'web.connection.incident.remediationHeading': 'क्या करें?',
  'web.connection.incident.scheduledOnHold':
    '{count, plural, one {# scheduled post is on hold} other {# scheduled posts are on hold}} for this account.',
  'web.connection.incident.nothingLost': 'कुछ भी खोया नहीं है और कुछ भी दोहराया नहीं गया है।',
} as const;
