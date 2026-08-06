/**
 * Web surface strings for Analytics, Automation Rules, RSS autopost and
 * tracked links.
 *
 * `analytics.ts` and `automation.ts` hold the domain vocabulary shared by every
 * surface (metric names, trigger sentences, provider caveats). This file holds
 * what only the web screens need: column headings, filter labels, wizard steps,
 * the sentence builder chrome and the per screen empty, error, offline,
 * permission and rate limit copy.
 *
 * Every leaf name here is new. Nothing in this file overwrites a key defined in
 * `analytics.ts` or `automation.ts`, which is asserted by `lint.test.ts`.
 */
export const webAnalyticsMessages = {
  /* ======================================================================
     Analytics shell
     ====================================================================== */
  'analytics.chart.legend': 'इस चार्ट में श्रृंखला दिखाई गई है',
  'analytics.tab.overview': 'सिंहावलोकन',
  'analytics.tab.experiments': 'प्रयोग',
  'analytics.tab.links': 'ट्रैक किए गए लिंक',
  'analytics.tab.label': 'विश्लेषिकी अनुभाग',

  'analytics.question.baseline': 'कौन सी पोस्ट आपकी अपनी आधार रेखा से दूर चली गईं?',
  'analytics.question.baselineHelp':
    'प्रत्येक पोस्ट की तुलना उसी खाते पर और उसी प्रारूप में आपकी अपनी हाल की पोस्ट से की जाती है। यहां कोई भी चीज़ आपकी तुलना किसी अन्य कार्यक्षेत्र या किसी अन्य कंपनी से नहीं करती है।',
  'analytics.question.accounts': 'किन खातों पर ध्यान देने की आवश्यकता है?',
  'analytics.question.next': 'आगे परीक्षण के लायक क्या है?',

  'analytics.filter.brand': 'ZZZप्रोटेक्टेड11ZZZ',
  'analytics.filter.accounts': 'लेखा',
  'analytics.filter.allAccounts': 'सभी जुड़े हुए खाते',
  'analytics.filter.range': 'तिथि सीमा',
  'analytics.filter.format': 'सामग्री प्रारूप',
  'analytics.filter.allFormats': 'सभी प्रारूप',
  'analytics.filter.comparePrevious': 'पिछली अवधि से तुलना करें',
  'analytics.filter.applied':
    '{count, plural, =0 {No filters} one {# filter} other {# filters}} applied. {results, plural, =0 {No posts match} one {# post matches} other {# posts match}}.',

  'analytics.rankMetric.label': 'पोस्ट को इसके अनुसार रैंक करें',
  'analytics.rankMetric.help':
    'Relay में कोई संयुक्त स्कोर नहीं है। एक मीट्रिक चुनें जिसकी परिभाषा पर आप भरोसा करते हैं और तालिका अकेले उस मीट्रिक द्वारा क्रमबद्ध की जाती है।',
  'analytics.rankMetric.chosen': 'Ranked by {metric}, as reported by each account provider.',

  /* ----------------------------------------------------------------------
     Outcome groups. Never summed together.
     ---------------------------------------------------------------------- */
  'analytics.outcome.awareness': 'जागरूकता',
  'analytics.outcome.awarenessHelp':
    'पोस्ट कितनी बार डिलीवर हुई या देखी गई. प्रदाता इसे अलग-अलग तरीके से गिनते हैं, इसलिए एक मूल्य केवल समय के साथ ही तुलनीय होता है।',
  'analytics.outcome.consumption': 'उपभोग',
  'analytics.outcome.consumptionHelp': 'लोगों ने वास्तव में कितनी पोस्ट देखी या पढ़ी।',
  'analytics.outcome.interaction': 'इंटरेक्शन',
  'analytics.outcome.interactionHelp':
    'लोगों ने प्लेटफ़ॉर्म पर क्या किया: लाइक, कमेंट, शेयर और सेव।',
  'analytics.outcome.conversion': 'रूपांतरण',
  'analytics.outcome.conversionHelp':
    'मंच से हटने के बाद लोगों ने क्या किया. केवल ट्रैक किए गए लिंक ही इसका उत्तर दे सकते हैं, और केवल उन लिंक के लिए जिन्हें आपने ट्रैक करने के लिए चुना है।',
  'analytics.outcome.separateNote':
    'इन चारों समूहों की अलग-अलग गणना की जाती है। उन्हें एक साथ जोड़ने पर एक ही व्यक्ति को एक से अधिक बार गिना जाएगा।',

  /* ----------------------------------------------------------------------
     Comparison table
     ---------------------------------------------------------------------- */
  'analytics.table.caption':
    'चयनित श्रेणी में प्रकाशित पोस्ट, प्रत्येक की तुलना आपकी अपनी हाल की बेसलाइन से की गई है।',
  'analytics.table.post': 'पोस्ट',
  'analytics.table.account': 'खाता',
  'analytics.table.format': 'प्रारूप',
  'analytics.table.published': 'प्रकाशित',
  'analytics.table.value': 'मूल्य',
  'analytics.table.delta': 'बेसलाइन के विरुद्ध',
  'analytics.table.sample': 'नमूना',
  'analytics.table.sampleSize': 'n = {count}',
  'analytics.table.evidence': 'सबूत',
  'analytics.table.openEvidence': 'Show the evidence for {post}',
  'analytics.table.rowActions': 'Actions for {post}',
  'analytics.table.openPost': 'पोस्ट मेट्रिक्स खोलें',
  'analytics.table.openReceipt': 'प्रकाशन रसीद खोलें',
  'analytics.table.noBaseline': 'अभी तक कोई आधार रेखा नहीं है',
  'analytics.table.noBaselineReason':
    'Fewer than {required} comparable posts exist on this account. A comparison would be noise, so none is shown.',
  'analytics.table.sortBy': 'Sort by {column}',
  'analytics.table.detailToggle': 'विवरण',

  'analytics.delta.above': '{percent} above baseline',
  'analytics.delta.below': '{percent} below baseline',
  'analytics.delta.level': 'बेसलाइन के अनुरूप',
  'analytics.delta.unavailable': 'कोई तुलना नहीं',

  'analytics.evidence.title': 'ये तुलना कैसे की गई',
  'analytics.evidence.baseline':
    'Baseline: the median {metric} of the previous {count, plural, one {# comparable post} other {# comparable posts}} on {account}.',
  'analytics.evidence.comparableBy':
    'Comparable means the same account, the same content format ({format}) and a publish time inside the same period.',
  'analytics.evidence.postsUsed': 'बेसलाइन के लिए उपयोग किए गए पोस्ट',
  'analytics.evidence.excluded':
    '{count, plural, =0 {No posts were excluded} one {# post was excluded} other {# posts were excluded}} because the metric was unavailable for them.',
  'analytics.evidence.smallSample':
    'With {count, plural, one {# post} other {# posts}} in the baseline, a single unusual post moves the median a long way. Treat this as a signal to test again, not as a result.',
  'analytics.evidence.confounders': 'इसका क्या हिसाब नहीं है',
  'analytics.evidence.confounder.time': 'बेसलाइन पोस्टों में दिन का प्रकाशन समय अलग-अलग होता है।',
  'analytics.evidence.confounder.format':
    'यहां छवि पोस्ट और वीडियो पोस्ट सीधे तौर पर तुलनीय नहीं हैं।',
  'analytics.evidence.confounder.followers':
    'The follower count on {account} changed by {percent} during this period.',
  'analytics.evidence.confounder.paid':
    'Relay यह नहीं बता सकता कि इनमें से किसी पोस्ट को भुगतान वितरण प्राप्त हुआ या नहीं।',
  'analytics.evidence.confounder.provider':
    '{provider} changed how it reports {metric} inside this period.',

  /* ----------------------------------------------------------------------
     Metric definitions
     ---------------------------------------------------------------------- */
  'analytics.definition.open': 'What {metric} means',
  'analytics.definition.inlineHeading': 'परिभाषा',
  'analytics.definition.observedAt': 'Observed {dateTime}.',
  'analytics.definition.sourceLink': 'प्रदाता दस्तावेज़ीकरण',
  'analytics.definition.verifiedOn': 'Checked against provider documentation on {date}.',
  'analytics.definition.panelTitle': 'इस दृष्टि से मीट्रिक परिभाषाएँ',
  'analytics.definition.panelIntro':
    'इस स्क्रीन पर प्रत्येक नंबर एक नामित प्रदाता फ़ील्ड से आता है। नीचे दी गई परिभाषाएँ भी प्रत्येक मान के आगे दोहराई गई हैं, इसलिए कोई भी महत्वपूर्ण चीज़ केवल टूलटिप में नहीं रहती है।',
  'analytics.definition.aggregation.sum': 'प्रत्येक अवलोकन को जोड़कर एकत्रित किया गया।',
  'analytics.definition.aggregation.average': 'माध्य के रूप में एकत्र किया गया।',
  'analytics.definition.aggregation.median': 'माध्यिका के रूप में एकत्र किया गया।',
  'analytics.definition.aggregation.last': 'सबसे ताज़ा अवलोकन.',
  'analytics.definition.aggregation.delta': 'प्रथम और अंतिम अवलोकन के बीच परिवर्तन.',
  'analytics.definition.aggregation.none': 'एकल अवलोकन के रूप में रिपोर्ट किया गया।',
  'analytics.definition.denominator.none': 'यह गिनती है, दर नहीं.',
  'analytics.definition.historyWindow':
    '{provider} keeps {days, plural, one {# day} other {# days}} of history for this field.',
  'analytics.definition.historyWindowNone':
    '{provider} does not state a history limit for this field.',

  'analytics.definition.term.providerField': 'प्रदाता क्षेत्र',
  'analytics.definition.term.unit': 'इकाई',
  'analytics.definition.term.denominator': 'भाजक',
  'analytics.definition.term.aggregation': 'इसे कैसे एकत्रित किया जाता है',
  'analytics.definition.term.history': 'इतिहास प्रदाता रखता है',
  'analytics.definition.term.definition': 'प्रदाता जो कहता है उसका मतलब है',

  'analytics.unit.count': 'घटनाओं की गिनती',
  'analytics.unit.seconds': 'सेकंड',
  'analytics.unit.percent': 'एक प्रतिशत की गणना प्रदाता पहले ही कर चुका है',
  'analytics.unit.ratio': 'दो प्रदाता क्षेत्रों से एक अनुपात Relay की गणना की गई',
  'analytics.unit.currency_minor': 'छोटी इकाइयों में धन की राशि',

  'analytics.denominator.none': 'यह गिनती है, दर नहीं. इसका कोई हर नहीं है.',
  'analytics.denominator.impressions': 'छापों से विभाजित',
  'analytics.denominator.reach': 'पहुंच से विभाजित',
  'analytics.denominator.views': 'विचारों से विभाजित',
  'analytics.denominator.followers': 'अवलोकन के समय अनुयायियों की संख्या से विभाजित',
  'analytics.denominator.sessions': 'सत्रों द्वारा विभाजित',

  'analytics.format.text': 'पाठ',
  'analytics.format.image': 'छवि',
  'analytics.format.carousel': 'हिंडोला',
  'analytics.format.video': 'वीडियो',
  'analytics.format.short_video': 'लघु वीडियो',
  'analytics.format.long_video': 'लंबा वीडियो',
  'analytics.format.document': 'दस्तावेज़',
  'analytics.format.thread': 'धागा',

  'analytics.value.unavailableReason.notImplemented':
    'Relay has not built the mapping for this metric on {provider} yet.',
  'analytics.value.estimated': 'अनुमानित',
  'analytics.value.estimatedMethod': 'Method: {method}.',

  /* ----------------------------------------------------------------------
     Freshness and account attention
     ---------------------------------------------------------------------- */
  'analytics.freshness.title': 'ये नंबर कहां से आए',
  'analytics.freshness.intro':
    'प्रदाता अपने स्वयं के शेड्यूल पर एकत्रित होते हैं। इस स्क्रीन पर कुछ भी लाइव नहीं है.',
  'analytics.freshness.accountRow': '{account} on {provider}',
  'analytics.freshness.never': 'कभी समन्वयित नहीं किया गया',
  'analytics.freshness.nextAttempt': 'Next sync attempt {relativeTime}.',
  'analytics.freshness.openStatus': 'प्रदाता स्थिति',

  'analytics.accounts.title': 'वे खाते जिन पर ध्यान देने की आवश्यकता है',
  'analytics.accounts.empty':
    'इस अवधि में प्रत्येक कनेक्टेड खाते ने डेटा लौटाया। यहां आपकी किसी चीज की जरूरत नहीं है.',
  'analytics.accounts.reason.permission':
    'जब यह खाता कनेक्ट किया गया था तब एनालिटिक्स की अनुमति नहीं दी गई थी।',
  'analytics.accounts.reason.expired':
    'Access expired, so no metric has been collected since {date}.',
  'analytics.accounts.reason.stale': 'The last successful sync was {relativeTime}.',
  'analytics.accounts.reason.syncFailing':
    '{count, plural, one {# sync attempt} other {# sync attempts}} failed in a row. The reason recorded was {reason}.',
  'analytics.accounts.reason.noPosts':
    'इस खाते पर चयनित श्रेणी में कुछ भी प्रकाशित नहीं किया गया था।',

  /* ----------------------------------------------------------------------
     Observations and next tests
     ---------------------------------------------------------------------- */
  'analytics.observations.title': 'टिप्पणियाँ',
  'analytics.observations.intro':
    'ये संख्याएँ क्या दर्शाती हैं इसका विवरण हैं। वे भविष्यवाणियाँ नहीं हैं और वे कारण स्थापित नहीं करते हैं।',
  'analytics.observations.empty':
    'किसी पैटर्न का वर्णन करने के लिए अभी तक पर्याप्त प्रकाशित इतिहास नहीं है। उसी खाते और प्रारूप पर कुछ और पोस्ट प्रकाशित करें।',
  'analytics.observations.citedPosts': 'पर आधारित',
  'analytics.observations.citedPeriod': 'Period: {start} to {end}.',
  'analytics.observations.nextTestTitle': 'एक परीक्षण जिसे आप आगे चला सकते हैं',
  'analytics.observations.nextTestBody':
    'Publish {count, plural, one {# more post} other {# more posts}} on {account} changing only {variable}, then compare the same metric. Tag it as an experiment before publishing so the comparison is planned rather than found afterwards.',
  'analytics.observations.tagFirst': 'एक प्रयोग टैग करें',

  /* ----------------------------------------------------------------------
     Charts
     ---------------------------------------------------------------------- */
  'analytics.chart.title': '{metric} over time',
  'analytics.chart.summary':
    '{metric} on {account}, {count, plural, one {# point} other {# points}} from {start} to {end}.',
  'analytics.chart.showTable': 'तालिका के रूप में दिखाएँ',
  'analytics.chart.hideTable': 'मेज छिपाओ',
  'analytics.chart.tableCaption': 'तालिका के समान श्रृंखला।',
  'analytics.chart.columnPeriod': 'अवधि',
  'analytics.chart.columnValue': 'मूल्य',
  'analytics.chart.gapLabel': 'कोई डेटा एकत्र नहीं किया गया',
  'analytics.chart.gapExplained':
    'पंक्ति में विराम का मतलब है कि उस अवधि के लिए कोई अवलोकन एकत्र नहीं किया गया था। इसका मतलब शून्य नहीं है.',
  'analytics.chart.annotation': 'एनोटेशन',
  'analytics.chart.pointLabel': '{period}: {value}',
  'analytics.chart.empty': 'इस श्रेणी में कोई अवलोकन एकत्र नहीं किया गया।',

  /* ----------------------------------------------------------------------
     Experiments
     ---------------------------------------------------------------------- */
  'analytics.experiment.new': 'एक प्रयोग की योजना बनाएं',
  'analytics.experiment.empty':
    'अभी तक कोई प्रयोग नहीं. प्रयोग एक तुलना है जिसे आप प्रकाशित करने से पहले तय करते हैं, जो एकमात्र प्रकार है जो किसी प्रश्न का उत्तर दे सकता है।',
  'analytics.experiment.emptyExample':
    'उदाहरण: एक ही घोषणा को एक्स पर दो बार प्रकाशित करें, एक बार पोस्ट में लिंक के साथ और एक बार पहली टिप्पणी में लिंक के साथ, फिर 72 घंटों में लिंक क्लिक की तुलना करें।',
  'analytics.experiment.name': 'आप क्या परीक्षण कर रहे हैं?',
  'analytics.experiment.namePlaceholder': 'पहली टिप्पणी 30 मिनट के मुकाबले 5 मिनट पर',
  'analytics.experiment.hypothesisPlaceholder':
    'पहली टिप्पणी से पहले थोड़ी देर की देरी से एक्स पर अधिक उत्तर मिलते हैं।',
  'analytics.experiment.variantLabel': 'Variant {index}',
  'analytics.experiment.variantDescription': 'इस वेरिएंट में क्या अलग है',
  'analytics.experiment.addVariant': 'एक प्रकार जोड़ें',
  'analytics.experiment.removeVariant': 'Remove variant {index}',
  'analytics.experiment.accounts': 'खाते शामिल हैं',
  'analytics.experiment.windowHelp':
    'किसी पोस्ट के लाइव होने के बाद मेट्रिक्स बदलते रहते हैं। विंडो को अभी ठीक करें ताकि किसी एक प्रकार के अनुरूप होने पर तुलना न की जाए।',
  'analytics.experiment.windowDays':
    'Measure for {count, plural, one {# day} other {# days}} after each post publishes',
  'analytics.experiment.minSample': 'प्रति संस्करण न्यूनतम पोस्ट',
  'analytics.experiment.minSampleHelp':
    'इस गणना के नीचे परिणाम को विजेता के बजाय अनिर्णायक के रूप में दिखाया गया है।',
  'analytics.experiment.status.planned': 'योजना बनाई',
  'analytics.experiment.status.collecting': 'Collecting. {published} of {target} posts published.',
  'analytics.experiment.status.inconclusive': 'पूर्ण, कोई स्पष्ट अंतर नहीं',
  'analytics.experiment.result.difference':
    '{variant} recorded {percent} more {metric} than {otherVariant}.',
  'analytics.experiment.result.noDifference':
    'The two variants are within {percent} of each other on {metric}. That is inside the range these posts vary by anyway.',
  'analytics.experiment.result.association':
    'This is an association measured on {count, plural, one {# post} other {# posts}}. It does not prove that the change caused the difference.',
  'analytics.experiment.result.unavailable':
    '{metric} was unavailable for {count, plural, one {# post} other {# posts}} in this experiment, so those posts are excluded rather than counted as zero.',
  'analytics.experiment.result.title': 'नतीजा',
  'analytics.experiment.completeNow': 'इस प्रयोग को बंद करें',
  'analytics.experiment.completeConfirm':
    'समापन से संग्रह रुक जाता है। पोस्ट प्रकाशित रहती हैं और नंबर उपलब्ध रहते हैं।',
  'analytics.experiment.postsTitle': 'इस प्रयोग में पोस्ट',

  /* ----------------------------------------------------------------------
     Analytics states
     ---------------------------------------------------------------------- */
  'analytics.state.loading': 'चयनित खातों के लिए विश्लेषण लोड हो रहा है',
  'analytics.state.loadingProvider': 'Fetching {provider} analytics',
  'analytics.state.empty': 'इस श्रेणी में कुछ भी प्रकाशित नहीं हुआ',
  'analytics.state.emptyBody':
    'एनालिटिक्स उन पोस्टों का वर्णन करता है जो पहले ही प्रकाशित हो चुकी हैं। कुछ प्रकाशित करें, या दिनांक सीमा बढ़ाएँ।',
  'analytics.state.emptyExample':
    'एक बार पोस्ट लाइव होने पर आपको एक पंक्ति दिखाई देगी जैसे: X @acme, "लॉन्च थ्रेड", 12,400 इंप्रेशन, आपके पिछले 10 के औसत से 58 प्रतिशत ऊपर।',
  'analytics.state.errorTitle': 'एनालिटिक्स लोड नहीं किया जा सका',
  'analytics.state.errorBody':
    'अनुमानित संख्या के बजाय कोई संख्या नहीं दिखाई गई है। आपकी पोस्ट और रसीदें अप्रभावित हैं.',
  'analytics.state.partialTitle': '{loaded} of {total} accounts returned data',
  'analytics.state.partialBody':
    'जिन वृत्तांतों का उत्तर दिया गया, वे अपनी ताजगी के साथ दिखाए गए हैं। बाकी को कारण सहित सूचीबद्ध किया गया है कि उन्होंने ऐसा क्यों नहीं किया।',
  'analytics.state.partialSucceeded': 'डेटा लौटाया गया',
  'analytics.state.partialFailed': 'डेटा वापस नहीं किया',
  'analytics.state.offlineTitle': 'आप ऑफ़लाइन हैं',
  'analytics.state.offlineBody':
    'नीचे दिए गए आंकड़े कनेक्शन बंद होने से पहले लोड किए गए थे, इसलिए वे ताजगी लेबल के सुझाव से पुराने हैं।',
  'analytics.state.permissionTitle': 'आप इस कार्यक्षेत्र में विश्लेषण नहीं देख सकते',
  'analytics.state.permissionBody':
    'एनालिटिक्स को विश्लेषक या उससे अधिक की भूमिका की आवश्यकता होती है। इस कार्यक्षेत्र का कोई स्वामी या व्यवस्थापक इसे अनुदान दे सकता है.',
  'analytics.state.rateLimitTitle': '{provider} is rate limiting analytics requests',
  'analytics.state.rateLimitCause':
    'खाते ने इस विंडो के लिए प्रदाता कोटा के अपने हिस्से का उपयोग किया है। Relay अधिक पुनः प्रयास नहीं करता है, क्योंकि इससे प्रकाशन में देरी होगी।',
  'analytics.state.rateLimitAlternative':
    'दिनांक सीमा या खाता फ़िल्टर को सीमित करें, जो प्रदाता से कम मांगता है।',
  'analytics.state.rateLimitReset': 'अनुरोध फिर से शुरू करें',
  'analytics.state.reference': 'निदानात्मक संदर्भ',

  /* ======================================================================
     Tracked links (first party redirect measurement)
     ====================================================================== */
  'analytics.links.new': 'एक ट्रैक किया गया लिंक बनाएं',
  'analytics.links.empty': 'अभी तक कोई ट्रैक नहीं किया गया लिंक',
  'analytics.links.emptyBody':
    'ट्रैक किया गया लिंक एक छोटा URL Relay रीडायरेक्ट होता है, जिससे आप तब भी क्लिक देख सकते हैं जब कोई प्लेटफ़ॉर्म रिपोर्ट नहीं करता है। ऑडिट प्रविष्टि के बिना मूल गंतव्य कभी नहीं बदला जाता है।',
  'analytics.links.emptyExample':
    'उदाहरण: रिले.to/a7Kq2 अभियान q3-लॉन्च के साथ acme.com/blog/launch पर रीडायरेक्ट करता है।',
  'analytics.links.table.caption':
    'इस कार्यक्षेत्र में ट्रैक किए गए लिंक और उनके प्रथम पक्ष क्लिक की गणना।',
  'analytics.links.campaign': 'अभियान',
  'analytics.links.created': 'बनाया गया',
  'analytics.links.usedIn':
    '{count, plural, =0 {Not used in a post yet} one {Used in # post} other {Used in # posts}}',
  'analytics.links.state.active': 'सक्रिय',
  'analytics.links.state.expired': 'Expired {date}',
  'analytics.links.state.disabled': 'विकलांग',
  'analytics.links.state.disabledReason':
    'Disabled by {actor} on {date}. Reason recorded: {reason}.',
  'analytics.links.detailTitle': 'Tracked link {slug}',
  'analytics.links.exactRedirect': 'सटीक रीडायरेक्ट',
  'analytics.links.exactRedirectHelp':
    'यह वह गंतव्य है जहां आगंतुक अभी पहुंचता है, जिसमें प्रत्येक यूटीएम पैरामीटर शामिल है, जिसे पूर्ण रूप से दिखाया गया है और छोटा नहीं किया गया है।',
  'analytics.links.editDestination': 'गंतव्य बदलें',
  'analytics.links.editDestinationWarning':
    'गंतव्य बदलने से हर वह स्थान प्रभावित होता है जहां यह लिंक पहले ही प्रकाशित हो चुका है। परिवर्तन से पहले की अवधि की रिपोर्ट उस गंतव्य को रखती है जो उस समय सक्रिय था।',
  'analytics.links.editDestinationAudit':
    'परिवर्तन ऑडिट लॉग में आपके नाम, पुराने गंतव्य और नए के साथ दर्ज किया गया है।',
  'analytics.links.destinationHistory': 'गंतव्य इतिहास',
  'analytics.links.destinationHistoryRow': '{destination}, active from {start} to {end}',
  'analytics.links.destinationHistoryCurrent': '{destination}, active since {start}',
  'analytics.links.domainLabel': 'लघु डोमेन',
  'analytics.links.domainDefault': 'Relay डिफ़ॉल्ट डोमेन',
  'analytics.links.domainVerified': 'Verified by DNS on {date}',
  'analytics.links.domainPending': 'DNS रिकॉर्ड की प्रतीक्षा की जा रही है',
  'analytics.links.domainPendingHelp':
    'Add the TXT record below at {domain}, then check again. Until it verifies, this domain cannot be selected for a new link.',
  'analytics.links.domainFailed': 'The DNS record did not match on {date}',
  'analytics.links.domainCheck': 'डीएनएस फिर से जांचें',
  'analytics.links.expiry': 'समाप्ति',
  'analytics.links.expiryNone': 'कोई समाप्ति सेट नहीं',
  'analytics.links.expiryHelp':
    'समाप्ति के बाद लिंक एक सादा पृष्ठ लौटाता है जिसमें लिखा होता है कि यह समाप्त हो गया है। इसे कभी भी चुपचाप कहीं और इंगित नहीं किया जाता है।',
  'analytics.links.disable': 'इस लिंक को अभी अक्षम करें',
  'analytics.links.disableTitle': 'Disable {slug}?',
  'analytics.links.disableBody':
    'विज़िटर एक पृष्ठ पर पहुंचते हैं और कहते हैं कि लिंक अब उपलब्ध नहीं है। प्रकाशित पोस्ट में अभी भी संक्षिप्त URL शामिल है, इसलिए यह क्लिक करने वाले किसी भी व्यक्ति को दिखाई देता है।',
  'analytics.links.disableReason': 'अक्षम करने का कारण',
  'analytics.links.enable': 'इस लिंक को पुनः सक्षम करें',
  'analytics.links.abuseTitle': 'इस लिंक के दुरुपयोग की रिपोर्ट करें',
  'analytics.links.abuseBody':
    'यदि इस संक्षिप्त URL का उपयोग किसी ऐसी चीज़ के लिए किया जा रहा है जिसका आप इरादा नहीं रखते हैं, तो इसकी रिपोर्ट करें और समीक्षा के दौरान रीडायरेक्ट को निलंबित कर दिया जाएगा।',
  'analytics.links.abuseAction': 'इस लिंक की रिपोर्ट करें',
  'analytics.links.measurementLabel': 'प्रथम पक्ष पुनर्निर्देशन माप',
  'analytics.links.measurementExplained':
    'जब इस URL के लिए रीडायरेक्ट सेवा मांगी जाती है तो Relay एक अनुरोध की गणना करता है। एक डुप्लिकेट क्लिक एक छोटी विंडो के अंदर एक ही विज़िटर से दोहराए गए अनुरोधों को हटा देता है, और ज्ञात क्रॉलर पैटर्न से मेल खाने वाले अनुरोधों को हटाने के बजाय बाहर रखा जाता है।',
  'analytics.links.botsNote':
    '{count, plural, one {# request} other {# requests}} were classified as automated and are excluded from the deduplicated count.',
  'analytics.links.series.title': 'समय के साथ अनुरोध और डुप्लिकेट किए गए क्लिक',
  'analytics.links.series.requests': 'कुल अनुरोध',
  'analytics.links.series.clicks': 'डुप्लिकेट किए गए क्लिक',
  'analytics.links.breakdownTitle': 'क्लिक कहां से आए',
  'analytics.links.breakdown.share': '{percent} of deduplicated clicks',
  'analytics.links.referrer.direct': 'कोई रेफरर नहीं भेजा गया',
  'analytics.links.referrer.social': 'सामाजिक मंच',
  'analytics.links.referrer.search': 'खोज इंजन',
  'analytics.links.referrer.email': 'ईमेल क्लाइंट',
  'analytics.links.referrer.other': 'अन्य वेबसाइट',
  'analytics.links.device.mobile': 'मोबाइल',
  'analytics.links.device.desktop': 'डेस्कटॉप',
  'analytics.links.device.tablet': 'गोली',
  'analytics.links.device.unknown': 'तय नहीं',
  'analytics.links.countryUnknown': 'देश तय नहीं',
  'analytics.links.lastEventLabel': 'अंतिम क्लिक',
  'analytics.links.noEvents': 'अभी तक कोई क्लिक रिकॉर्ड नहीं किया गया',
  'analytics.links.noEventsBody':
    'इस लिंक के निर्माण के बाद से इसका अनुरोध नहीं किया गया है। यह एक वास्तविक शून्य है, जिसे हमारी अपनी रीडायरेक्ट सेवा द्वारा मापा जाता है।',
  'analytics.links.compareWarning':
    '{provider} reports {providerValue} link clicks for this post. Relay recorded {relayValue} deduplicated clicks. The two count different events and neither replaces the other.',
  'analytics.links.errorTitle': 'लिंक आँकड़े लोड नहीं किए जा सके',
  'analytics.links.errorBody':
    'रीडायरेक्ट सेवा अभी भी काम कर रही है, इसलिए लिंक आगंतुकों को उनके गंतव्य तक भेजता रहता है। केवल रिपोर्टिंग प्रभावित होती है.',
  'analytics.links.createDestination': 'गंतव्य URL',
  'analytics.links.createDestinationHelp':
    'एक सार्वजनिक https पता होना चाहिए. निजी नेटवर्क पते और रीडायरेक्ट श्रृंखलाएं रीडायरेक्ट सेवा द्वारा अस्वीकार कर दी जाती हैं।',
  'analytics.links.createCampaign': 'अभियान का नाम',
  'analytics.links.createSlug': 'कस्टम अंत',
  'analytics.links.createSlugHelp':
    'इसे खाली छोड़ दें और Relay एक संक्षिप्त यादृच्छिक अंत उत्पन्न करता है।',
  'analytics.links.createUtm': 'यूटीएम पैरामीटर',
  'analytics.links.blockedScheme': 'केवल https गंतव्य स्वीकार किए जाते हैं।',
  'analytics.links.blockedPrivate':
    'वह पता एक निजी नेटवर्क पर है, इसलिए रीडायरेक्ट सेवा इसे स्वीकार नहीं करेगी।',

  /* ======================================================================
     Automation: list and shell
     ====================================================================== */
  'automation.tab.rules': 'नियम',
  'automation.tab.feeds': 'आरएसएस फ़ीड',
  'automation.tab.label': 'स्वचालन अनुभाग',

  'automation.rules.table.caption': 'इस कार्यक्षेत्र में स्वचालन नियम.',
  'automation.rules.table.rule': 'नियम',
  'automation.rules.table.state': 'राज्य',
  'automation.rules.table.accounts': 'लेखा',
  'automation.rules.table.lastRun': 'आखिरी रन',
  'automation.rules.table.nextCheck': 'अगली जांच',
  'automation.rules.neverRun': 'अभी तक नहीं चला',
  'automation.rules.emptyExample':
    'उदाहरण: जब एक्मे ब्लॉग फ़ीड में कोई नया आइटम दिखाई देता है, यदि भाषा अंग्रेजी है, तो ब्लॉग घोषणा टेम्पलेट से एक ड्राफ्ट बनाएं और अनुमोदन का अनुरोध करें।',
  'automation.rules.summaryAccounts':
    '{count, plural, =0 {No accounts selected} one {# account} other {# accounts}}',
  'automation.rules.openRule': 'Open {name}',
  'automation.rules.duplicateRule': 'Duplicate {name}',
  'automation.rules.deleteTitle': 'Delete {name}?',
  'automation.rules.deleteBody':
    'नियम तुरंत बंद हो जाता है और इसका रन इतिहास ऑडिट लॉग के लिए रखा जाता है। इसके द्वारा पहले से बनाए गए पोस्ट प्रभावित नहीं होंगे.',

  /* ----------------------------------------------------------------------
     Catalog entries the shared automation vocabulary does not cover yet
     ---------------------------------------------------------------------- */
  'automation.trigger.commentFailed': 'एक निर्धारित टिप्पणी या थ्रेड आइटम विफल हो जाता है',

  'automation.condition.timeWindow': 'the time is between {start} and {end} in {timeZone}',
  'automation.condition.domainPresent': 'the text links to {domain}',
  'automation.condition.hashtagPresent': 'the text contains the hashtag {hashtag}',
  'automation.condition.providerCapability': 'the account can actually do {capability}',
  'automation.condition.planStatus': 'सदस्यता सक्रिय है',

  'automation.action.continueSequence': 'तैयार थ्रेड या टिप्पणी क्रम जारी रखें',
  'automation.action.notifyEmail': 'send an email to {target}',
  'automation.action.notifyWebhook': 'send a webhook to {target}',
  'automation.action.pauseConnection': 'प्रभावित खाते को रोकें',
  'automation.action.quotePost': 'स्रोत पोस्ट को एक बार उद्धृत करें',
  'automation.action.followUpComment': 'स्रोत पोस्ट पर एक तैयार टिप्पणी जोड़ें',

  'automation.param.feed': 'फ़ीड',
  'automation.param.template': 'टेम्पलेट',
  'automation.param.signature': 'हस्ताक्षर',
  'automation.param.disclosure': 'प्रकटीकरण',
  'automation.param.locale': 'भाषा',
  'automation.param.brand': 'ZZZप्रोटेक्टेड11ZZZ',
  'automation.param.campaign': 'अभियान',
  'automation.param.account': 'खाता',
  'automation.param.platform': 'मंच',
  'automation.param.contentType': 'सामग्री प्रकार',
  'automation.param.keyword': 'कीवर्ड',
  'automation.param.hashtag': 'हैशटैग',
  'automation.param.domain': 'डोमेन',
  'automation.param.capability': 'क्षमता',
  'automation.param.timeZone': 'समय क्षेत्र',
  'automation.param.startTime': 'से',
  'automation.param.endTime': 'को',
  'automation.param.duration': 'अवधि',
  'automation.param.metric': 'मैट्रिक',
  'automation.param.value': 'मूल्य',
  'automation.param.target': 'को भेजें',
  'automation.param.time': 'समय',
  'automation.param.cadence': 'कितनी बार',
  'automation.param.notSet': 'सेट नहीं',

  /* ----------------------------------------------------------------------
     Sentence builder
     ---------------------------------------------------------------------- */
  'automation.editor.name': 'नियम का नाम',
  'automation.editor.namePlaceholder': 'सामाजिक के लिए ब्लॉग',
  'automation.editor.when': 'कब',
  'automation.editor.if': 'यदि',
  'automation.editor.then': 'फिर',
  'automation.editor.after': 'के बाद',
  'automation.editor.until': 'तक',
  'automation.editor.sentenceLabel': 'नियम वाक्य',
  'automation.editor.readBack': 'इसे चालू करने से पहले वाक्य को दोबारा पढ़ें। यह पूरा नियम है.',
  'automation.editor.chooseTrigger': 'चुनें कि यह नियम किससे प्रारंभ होता है',
  'automation.editor.addCondition': 'एक शर्त जोड़ें',
  'automation.editor.addAction': 'एक क्रिया जोड़ें',
  'automation.editor.removeCondition': 'Remove the condition {label}',
  'automation.editor.removeAction': 'Remove the action {label}',
  'automation.editor.moveActionUp': 'Move {label} earlier',
  'automation.editor.moveActionDown': 'Move {label} later',
  'automation.editor.actionOrder': 'क्रियाएँ इसी क्रम में चलती हैं, ऊपर से नीचे तक।',
  'automation.editor.noConditions': 'कोई शर्त नहीं. नियम हर बार ट्रिगर होने पर चलता है।',
  'automation.editor.noActions':
    'अभी तक कोई कार्रवाई नहीं. बिना किसी कार्रवाई वाला नियम सहेजा नहीं जा सकता.',
  'automation.editor.delayNone': 'कोई देरी नहीं',
  'automation.editor.delayLabel': 'कार्रवाई चलने से पहले विलंब',
  'automation.editor.endLabel': 'जब यह नियम बंद हो जायेगा',
  'automation.editor.end.manual': 'मैं इसे बंद कर देता हूं',
  'automation.editor.end.date': 'मेरे द्वारा चुनी गई तारीख',
  'automation.editor.end.count': 'it has run {count, plural, one {# time} other {# times}}',
  'automation.editor.end.dateValue': 'रुकें',
  'automation.editor.end.countValue': 'इतने रन के बाद रुकें',
  'automation.editor.parameterFor': 'Settings for {label}',
  'automation.editor.saveDraft': 'ड्राफ्ट के रूप में सहेजें',
  'automation.editor.savedAt': 'Saved {time}',
  'automation.editor.unsaved': 'सहेजे न गए परिवर्तन',

  'automation.editor.view.sentence': 'वाक्य',
  'automation.editor.view.structured': 'संरचित',
  'automation.editor.view.api': 'API प्रतिनिधित्व',
  'automation.editor.view.label': 'संपादक का दृष्टिकोण',
  'automation.editor.apiHelp':
    'यह बिल्कुल वही है जो REST API, CLI और MCP सर्वर भेजते हैं। इसे यहां संपादित करना और वाक्य पर वापस स्विच करना हर फ़ील्ड को बनाए रखता है।',
  'automation.editor.apiInvalid': 'This is not valid rule JSON, so it was not applied: {reason}',
  'automation.editor.apiApply': 'इस JSON को लागू करें',
  'automation.editor.structuredHelp':
    'फ़ील्ड के समान नियम. इसका उपयोग तब करें जब किसी नियम में कई शर्तें हों और वाक्य लंबा हो जाए।',

  'automation.editor.error.noAction': 'सहेजने से पहले कम से कम एक क्रिया जोड़ें.',
  'automation.editor.error.noTrigger': 'सहेजने से पहले एक ट्रिगर चुनें.',
  'automation.editor.error.noAccounts': 'कम से कम एक खाता चुनें जिस पर यह नियम लागू हो सके।',
  'automation.editor.error.missingParameter': '{label} needs a value.',
  'automation.editor.error.summary':
    '{count, plural, one {# thing needs your attention} other {# things need your attention}} before this rule can be saved.',

  /* ----------------------------------------------------------------------
     Trigger, condition and action pickers
     ---------------------------------------------------------------------- */
  'automation.picker.triggerTitle': 'यह नियम किससे प्रारंभ होता है',
  'automation.picker.conditionTitle': 'एक शर्त जोड़ें',
  'automation.picker.actionTitle': 'एक क्रिया जोड़ें',
  'automation.picker.search': 'इस सूची को फ़िल्टर करें',
  'automation.picker.noResults': 'इस सूची में कुछ भी आपके द्वारा टाइप किए गए से मेल नहीं खाता।',
  'automation.picker.groupContent': 'सामग्री',
  'automation.picker.groupPublishing': 'प्रकाशन',
  'automation.picker.groupNotify': 'लोग और सिस्टम',
  'automation.picker.groupControl': 'नियम नियंत्रण',
  'automation.picker.groupSchedule': 'समय',
  'automation.picker.groupExternal': 'बाहरी घटनाएँ',
  'automation.picker.groupMeasurement': 'मापन',
  'automation.picker.hiddenForProvider':
    '{count, plural, one {# action is} other {# actions are}} not listed because the selected accounts cannot perform them.',
  'automation.picker.hiddenDetail': '{action} is not available for {provider}. {reason}',
  'automation.picker.consequential': 'एक मंच पर कुछ बनाता है',
  'automation.picker.internalOnly': 'Relay के अंदर रहता है',

  'automation.accounts.label': 'जिन खातों पर यह नियम लागू हो सकता है',
  'automation.accounts.help':
    'कोई नियम कभी भी किसी ऐसे खाते को नहीं छू सकता जो यहां सूचीबद्ध नहीं है, चाहे उसकी शर्तें कुछ भी कहती हों।',
  'automation.accounts.none': 'अभी तक कोई खाता चयनित नहीं है',

  /* ----------------------------------------------------------------------
     Engagement threshold controls
     ---------------------------------------------------------------------- */
  'automation.threshold.title': 'इस ट्रिगर के लिए माप नियम',
  'automation.threshold.intro':
    'एक नियम जो किसी संख्या पर प्रतिक्रिया करता है, उसे यह जानना आवश्यक है कि कौन सी संख्या, किस अवधि में मापी गई है, और कितनी बार यह कार्य कर सकती है।',
  'automation.threshold.metric': 'देखने लायक मीट्रिक',
  'automation.threshold.value': 'दहलीज मूल्य',
  'automation.threshold.window': 'मापन खिड़की',
  'automation.threshold.windowHelp':
    'स्रोत पोस्ट प्रकाशित होने के क्षण से गिना जाता है। इस विंडो के बाहर नियम पोस्ट देखना बंद कर देता है।',
  'automation.threshold.expiry': 'इसके बाद पोस्ट देखना बंद करें',
  'automation.threshold.cooldown': 'फाँसी के बीच ठंडा होना',
  'automation.threshold.cooldownHelp':
    'एक ही स्रोत पोस्ट के लिए दो रनों के बीच सबसे कम समय की अनुमति।',
  'automation.threshold.maxPerPost': 'प्रति स्रोत पोस्ट अधिकतम निष्पादन',
  'automation.threshold.defaultsTitle': 'डिफ़ॉल्ट तब तक बने रहते हैं जब तक आप उन्हें नहीं बदलते',
  'automation.threshold.defaultOncePerPost': 'प्रति स्रोत पोस्ट एक बार चलाएँ।',
  'automation.threshold.defaultStale':
    'Do not execute if the metric is unavailable or stale. The freshness limit used is {duration}.',
  'automation.threshold.staleLimit': 'इसके बाद किसी मीट्रिक को पुराना मान लें',
  'automation.threshold.providerNote':
    '{provider} reports {metric} on a delay, so this rule can only act after the provider publishes the number.',

  /* ----------------------------------------------------------------------
     Cross account follow up
     ---------------------------------------------------------------------- */
  'automation.crossAccount.title': 'दूसरे खाते से फ़ॉलो अप करें',
  'automation.crossAccount.off': 'बंद. यह नियम केवल स्रोत खाते पर कार्य करता है.',
  'automation.crossAccount.enable': 'किसी अन्य खाते से फ़ॉलो अप की अनुमति दें',
  'automation.crossAccount.body':
    'दोनों खाते इस कार्यक्षेत्र से जुड़े होने चाहिए और दोनों का नाम यहां होना चाहिए। अनुवर्ती एक तैयार पोस्ट है जिसे आप पहले से लिखते हैं, और यह किसी भी अन्य चीज़ की तरह ही अनुमोदन नीति से गुजरता है।',
  'automation.crossAccount.sourceAccount': 'स्रोत खाता',
  'automation.crossAccount.followUpAccount': 'वह खाता जो अनुवर्ती कार्रवाई प्रकाशित करता है',
  'automation.crossAccount.preauthorize':
    'I confirm this workspace controls both {sourceAccount} and {followUpAccount}, and that the follow up is not presented as independent endorsement.',
  'automation.crossAccount.preauthorizeRequired':
    'इस नियम को सहेजने से पहले पूर्वप्राधिकरण की पुष्टि करें।',
  'automation.crossAccount.duplicateCheck':
    'क्रॉस अकाउंट डुप्लिकेट और कैडेंस चेक फॉलोअप से पहले चलते हैं, और यदि यह स्रोत पोस्ट को दोहराता है तो इसे विलंबित करने के बजाय छोड़ दिया जाता है।',

  /* ----------------------------------------------------------------------
     Preflight
     ---------------------------------------------------------------------- */
  'automation.preflight.intro':
    'वह सब कुछ जो यह नियम कर सकता है, इससे पहले कि वह इसमें से कुछ भी कर सके।',
  'automation.preflight.accountsLabel': 'जिन खातों पर यह कार्रवाई कर सकता है',
  'automation.preflight.maxActionsLabel': 'प्रति रन अधिकांश बाहरी क्रियाएँ',
  'automation.preflight.maxActionsPeriod':
    'At most {count, plural, one {# external action} other {# external actions}} in {period}.',
  'automation.preflight.approvalLabel': 'अनुमोदन',
  'automation.preflight.approvalNone':
    'इस नियम में कोई भी कार्रवाई किसी प्लेटफ़ॉर्म पर कुछ भी नहीं बनाती है, इसलिए कोई अनुमोदन लागू नहीं होता है।',
  'automation.preflight.providerLabel': 'प्रदाता प्रतिबंध',
  'automation.preflight.providerNone': 'इस नियम की कार्रवाइयों पर कोई भी लागू नहीं होता.',
  'automation.preflight.costLabel': 'अनुमानित मीटर लागत',
  'automation.preflight.costUnknown':
    'इन कार्यों के लिए लागत का अनुमान तब तक नहीं लगाया जा सकता जब तक कि प्रदाता की कीमत ज्ञात न हो।',
  'automation.preflight.costMethod':
    'Estimated from the provider price list on {date}. The receipt records what was actually charged.',
  'automation.preflight.cadenceLabel': 'ताल और डुप्लिकेट',
  'automation.preflight.cadenceBody':
    'प्रत्येक कार्रवाई से पहले डुप्लिकेट और ताल जांच चलती है। किसी खाते के लिए ताल बजट से अधिक होने वाली कार्रवाई को छोड़ दिया जाता है और रिकॉर्ड किया जाता है, कतारबद्ध नहीं किया जाता है।',
  'automation.preflight.failureLabel': 'यदि कोई रन विफल हो जाता है',
  'automation.preflight.failure.pauseAfter':
    'The rule pauses after {count, plural, one {# consecutive failure} other {# consecutive failures}} and files an action item.',
  'automation.preflight.failure.continue':
    'नियम चलता रहता है और प्रत्येक विफलता रन लॉग में दर्ज की जाती है।',
  'automation.preflight.exampleLabel': 'उदाहरण चलाएँ',
  'automation.preflight.exampleIntro': 'नवीनतम घटना का उपयोग करते हुए यह ट्रिगर मेल खा गया होगा।',
  'automation.preflight.exampleNone':
    'अभी तक कोई मेल खाने वाली घटना नहीं हुई है, इसलिए कोई उदाहरण नहीं दिखाया जा सकता. इसके बजाय एक परीक्षण ईवेंट चलाएँ।',
  'automation.preflight.activate': 'इस नियम को चालू करें',
  'automation.preflight.activateConfirmTitle': 'Turn on {name}?',
  'automation.preflight.activateConfirmBody':
    'अब से यह नियम आपसे पहले पूछे बिना, ऊपर सूचीबद्ध सीमाओं के भीतर कार्य करेगा।',
  'automation.preflight.blocked':
    'This rule cannot be turned on yet. {count, plural, one {# item} other {# items}} above needs a decision.',

  /* ----------------------------------------------------------------------
     Test runs, runs, versions, kill switch
     ---------------------------------------------------------------------- */
  'automation.test.title': 'परीक्षण घटना',
  'automation.test.body':
    'एक परीक्षण पूरे वाक्य का मूल्यांकन करता है और दिखाता है कि यह क्या करेगा। यह कभी प्रकाशित नहीं होता, कभी कोई टिप्पणी पोस्ट नहीं करता और कभी भी वेबहुक को वास्तविक समापन बिंदु पर नहीं भेजता।',
  'automation.test.useLastEvent': 'नवीनतम मिलान ईवेंट का उपयोग करें',
  'automation.test.usePayload': 'इवेंट पेलोड चिपकाएँ',
  'automation.test.run': 'परीक्षण चलाएँ',
  'automation.test.running': 'परीक्षण चल रहा है',
  'automation.test.resultTitle': 'परीक्षण ने क्या किया',
  'automation.test.conditionPassed': '{condition} passed',
  'automation.test.conditionFailed': '{condition} did not pass, so the rule stopped here',
  'automation.test.actionSimulated': '{action} would run',
  'automation.test.actionSkipped': '{action} would be skipped: {reason}',
  'automation.test.noExternalEffect': 'इस परीक्षण के दौरान कुछ भी नहीं बचा Relay।',
  'automation.test.failed': 'The test could not complete: {reason}',

  'automation.runs.table.caption': 'इस नियम के हालिया रन.',
  'automation.runs.startedAt': 'शुरू हुआ',
  'automation.runs.outcome.label': 'परिणाम',
  'automation.runs.actionsTaken': 'क्रियाएँ',
  'automation.runs.trigger': 'द्वारा ट्रिगर किया गया',
  'automation.runs.outcome.completed': 'पूरा हुआ',
  'automation.runs.outcome.skipped': 'छोड़ दिया गया',
  'automation.runs.outcome.failed': 'असफल',
  'automation.runs.outcome.testMode': 'परीक्षण मोड',
  'automation.runs.actionCount':
    '{count, plural, =0 {No external action} one {# external action} other {# external actions}}',
  'automation.runs.skippedReason': 'Skipped because {reason}',
  'automation.runs.openDetail': 'Open the run from {time}',
  'automation.runs.createdItems': 'बनाया गया',

  'automation.versions.caption': 'इस नियम का प्रत्येक सहेजा गया संस्करण.',
  'automation.versions.current': 'वर्तमान',
  'automation.versions.savedBy': 'Saved by {actor} on {date}',
  'automation.versions.compare': 'मौजूदा संस्करण से तुलना करें',
  'automation.versions.restore': 'इस संस्करण को पुनर्स्थापित करें',
  'automation.versions.restoreConfirm':
    'पुनर्स्थापित करने से एक नया संस्करण बनता है. कुछ भी ओवरराइट नहीं किया गया है और जब तक आप इसे चालू नहीं करते तब तक नियम अपनी वर्तमान स्थिति में रहता है।',
  'automation.versions.diffTitle': 'Version {from} compared with version {to}',

  'automation.kill.title': 'Stop {name} now',
  'automation.kill.body':
    'यदि कोई चल रहा हो तो नियम तुरंत, दौड़ के बीच में ही रुक जाता है। किसी प्लेटफ़ॉर्म पर पहले से भेजी गई कोई भी चीज़ प्रकाशित रहती है, क्योंकि बाहरी पोस्ट को कभी भी वापस नहीं किया जाता है।',
  'automation.kill.confirmPhrase': 'रुकें',
  'automation.kill.confirmLabel': 'पुष्टि करने के लिए STOP टाइप करें',
  'automation.kill.stopped':
    'This rule was stopped by {actor} on {date}. It cannot run again until you turn it back on.',

  /* ----------------------------------------------------------------------
     Automation states
     ---------------------------------------------------------------------- */
  'automation.state.loading': 'स्वचालन नियम लोड हो रहे हैं',
  'automation.state.loadingRule': 'नियम और उसके हालिया रन लोड हो रहे हैं',
  'automation.state.errorTitle': 'नियम लोड नहीं किये जा सके',
  'automation.state.errorBody': 'पहले से चल रहे नियम इससे अप्रभावित हैं. केवल यह स्क्रीन विफल रही.',
  'automation.state.offlineTitle': 'आप ऑफ़लाइन हैं',
  'automation.state.offlineBody':
    'आप एक नियम पढ़ सकते हैं और ड्राफ्ट संपादित कर सकते हैं, और यह इस डिवाइस पर रहता है। किसी नियम को सहेजने, परीक्षण करने और चालू करने के लिए कनेक्शन की आवश्यकता होती है।',
  'automation.state.permissionTitle': 'आप स्वचालन नियम नहीं बदल सकते',
  'automation.state.permissionBody':
    'नियम जुड़े हुए खातों पर कार्य करते हैं, इसलिए किसी खाते को बदलने के लिए प्रबंधक या उच्चतर भूमिका की आवश्यकता होती है। आप अभी भी प्रत्येक नियम और उसके संचालन इतिहास को पढ़ सकते हैं।',
  'automation.state.rateLimitTitle': 'नियम संचालन को धीमा किया जा रहा है',
  'automation.state.rateLimitCause':
    'यह कार्यक्षेत्र वर्तमान विंडो के लिए अपने स्वचालन रन भत्ते तक पहुंच गया। अनुसूचित पोस्ट और मैन्युअल प्रकाशन प्रभावित नहीं होते हैं.',
  'automation.state.rateLimitAlternative':
    'ताल वाले नियमों को लंबा अंतराल दिया जा सकता है, जिसमें कम रनों का उपयोग होता है।',

  /* ======================================================================
     RSS autopost
     ====================================================================== */
  'automation.rss.subtitle':
    'किसी फ़ीड को ड्राफ्ट या शेड्यूल किए गए पोस्ट में बदलें, उसी सत्यापन और अनुमोदन के साथ जो आप स्वयं लिखते हैं।',
  'automation.rss.empty': 'अभी तक कोई फ़ीड नहीं',
  'automation.rss.emptyBody':
    'एक फ़ीड जोड़ें और Relay इसे एक शेड्यूल पर जांचता है। प्रत्येक नया आइटम एक ड्राफ्ट, एक निर्धारित पोस्ट या एक अनुमोदन अनुरोध बन जाता है, जो भी आप चुनते हैं।',
  'automation.rss.emptyExample':
    'उदाहरण: एक्मे ब्लॉग फ़ीड हर बार एक लेख प्रकाशित होने पर X और LinkedIn के लिए एक ड्राफ्ट बनाता है, और एक अनुमोदनकर्ता की प्रतीक्षा करता है।',
  'automation.rss.table.caption': 'इस कार्यक्षेत्र पोल को फ़ीड करता है.',
  'automation.rss.table.feed': 'फ़ीड',
  'automation.rss.table.policy': 'किसी नई वस्तु का क्या होता है',
  'automation.rss.table.health': 'स्वास्थ्य',

  'automation.rss.step.url': 'फ़ीड पता',
  'automation.rss.step.preview': 'फ़ीड की जाँच करें',
  'automation.rss.step.seen': 'आरंभिक बिंदु',
  'automation.rss.step.targets': 'यह कहां जाता है',
  'automation.rss.step.template': 'पोस्ट क्या कहती है',
  'automation.rss.step.policy': 'इसे कैसे प्रकाशित किया जाता है',
  'automation.rss.stepOf': 'Step {current} of {total}',

  'automation.rss.urlHelp':
    'Relay आपके ब्राउज़र से नहीं, बल्कि हमारे सर्वर से फ़ीड लाता है। निजी नेटवर्क पते अस्वीकार कर दिए गए हैं.',
  'automation.rss.validateAction': 'इस फ़ीड की जाँच करें',
  'automation.rss.validateFailed': 'उस पते पर पठनीय फ़ीड नहीं लौटाई गई',
  'automation.rss.validateFailedReason': 'What we got back: {reason}',
  'automation.rss.validateBlocked':
    'वह पता एक निजी नेटवर्क की ओर इशारा करता है, इसलिए उसे प्राप्त नहीं किया गया।',
  'automation.rss.previewTitle': 'फ़ीड पूर्वावलोकन',
  'automation.rss.previewMeta':
    '{title}. {count, plural, one {# item} other {# items}} returned, newest first.',
  'automation.rss.previewItemPublished': 'Published {dateTime}',
  'automation.rss.previewNoImage': 'इस आइटम में कोई छवि नहीं',
  'automation.rss.previewImageAlt': 'Image from the feed item {title}',
  'automation.rss.previewNoDate':
    'इस आइटम पर कोई टाइमस्टैम्प नहीं है, इसलिए Relay उस समय का उपयोग करता है जब उसने इसे पहली बार देखा था।',
  'automation.rss.previewFieldsTitle': 'फ़ील्ड यह फ़ीड प्रदान करता है',
  'automation.rss.previewFieldMissing': 'इस फ़ीड में मौजूद नहीं है',

  'automation.rss.seenTitle': 'क्या मायने रखता है जैसा पहले ही देखा जा चुका है',
  'automation.rss.seenLatest':
    'फ़ीड में वर्तमान में मौजूद हर चीज़ को वैसा ही मानें जैसा देखा गया है। केवल भविष्य के आइटम पोस्ट किए जाते हैं.',
  'automation.rss.seenAll': 'नवीनतम वस्तु को नया मानें और उसे अगले चेक पर पोस्ट करें।',
  'automation.rss.seenHelp':
    'अधिकांश फ़ीड में पुराने लेख होते हैं. पहला विकल्प चुनना यह है कि आप बैकलॉग प्रकाशित करने से कैसे बचते हैं।',

  'automation.rss.targetsHelp':
    'खाते या सहेजा गया समूह चुनें. कुछ भी निर्धारित होने से पहले प्रत्येक लक्ष्य को अभी भी अपनी मान्यता मिलती है।',
  'automation.rss.targetGroup': 'सहेजा गया समूह',
  'automation.rss.targetIndividual': 'व्यक्तिगत खाते',

  'automation.rss.templateFields': 'उपलब्ध फ़ील्ड',
  'automation.rss.templateInsert': 'Insert {field}',
  'automation.rss.templateField.title': 'आइटम का शीर्षक',
  'automation.rss.templateField.summary': 'आइटम सारांश',
  'automation.rss.templateField.link': 'आइटम लिंक',
  'automation.rss.templateField.author': 'आइटम लेखक',
  'automation.rss.templateField.published': 'प्रकाशन तिथि',
  'automation.rss.templateField.categories': 'श्रेणियाँ',
  'automation.rss.templatePreview': 'नवीनतम आइटम के साथ पूर्वावलोकन करें',
  'automation.rss.adaptWithAi': 'प्रत्येक लक्ष्य के लिए पाठ को अनुकूलित करें',
  'automation.rss.adaptHelp':
    'शब्दों को प्रत्येक प्लेटफ़ॉर्म पर फिट करने के लिए फिर से लिखा जाता है और आपके द्वारा स्वीकार या अस्वीकार किए जाने वाले अंतर के रूप में दिखाया जाता है। मीडिया फ़ीड आइटम से आता है. Relay छवियां उत्पन्न नहीं करता है।',
  'automation.rss.noImageGeneration':
    'यदि किसी फ़ीड आइटम में कोई छवि नहीं है, तो पोस्ट बिना किसी छवि के बाहर चला जाता है।',
  'automation.rss.imageFromFeed': 'जब फ़ीड आइटम में कोई छवि हो तो उसका उपयोग करें',

  'automation.rss.policyHelp':
    'एक फ़ीड आइटम विशेष नहीं है. यह आपके द्वारा स्वयं लिखी गई पोस्ट के समान अनुमोदन नीति का पालन करता है।',
  'automation.rss.cadenceInterval': 'प्रत्येक में अधिकतम एक आइटम',
  'automation.rss.cadenceHelp':
    'अतिरिक्त आइटम एक साथ प्रकाशित होने के बजाय कतार में प्रतीक्षा करते हैं, इसलिए एक बार में दस लेख पोस्ट करने वाली फ़ीड किसी खाते में बाढ़ नहीं लाती है।',
  'automation.rss.immediateWarning':
    'तत्काल प्रकाशन किसी पोस्ट को बिना किसी व्यक्ति द्वारा पहले पढ़े एक मंच पर भेज देता है। यह तभी उपलब्ध है जब इन खातों के लिए अनुमोदन नीति इसकी अनुमति देती है।',

  'automation.rss.healthTitle': 'स्वास्थ्य खिलाओ',
  'automation.rss.healthOk': 'कार्य करना',
  'automation.rss.healthStalled': 'No new item for {duration}',
  'automation.rss.healthFailing': 'The last {count, plural, one {check} other {# checks}} failed',
  'automation.rss.health.nextPoll': 'Next check {relativeTime}',
  'automation.rss.health.itemsProcessed':
    '{count, plural, =0 {No items processed yet} one {# item processed} other {# items processed}}',
  'automation.rss.health.duplicatesSkipped':
    '{count, plural, =0 {No duplicates skipped} one {# duplicate skipped} other {# duplicates skipped}}',
  'automation.rss.health.lastPollLabel': 'अंतिम बार जाँच की गई',
  'automation.rss.health.lastItemLabel': 'फ़ीड में अंतिम नया आइटम',
  'automation.rss.health.lastPostLabel': 'अंतिम ड्राफ्ट या पोस्ट बनाया गया',
  'automation.rss.health.processedLabel': 'आइटम संसाधित',
  'automation.rss.recentItems': 'हाल के आइटम',
  'automation.rss.itemOutcome.draft': 'ड्राफ्ट बनाया गया',
  'automation.rss.itemOutcome.scheduled': 'Scheduled for {time}',
  'automation.rss.itemOutcome.published': 'प्रकाशित',
  'automation.rss.itemOutcome.awaitingApproval': 'मंजूरी का इंतजार है',
  'automation.rss.itemOutcome.duplicate': 'छोड़ दिया, पहले ही देख लिया',
  'automation.rss.itemOutcome.failed': 'Failed: {reason}',
  'automation.rss.pauseFeed': 'इस फ़ीड को रोकें',
  'automation.rss.resumeFeed': 'इस फ़ीड को फिर से शुरू करें',
  'automation.rss.deleteTitle': 'Remove {title}?',
  'automation.rss.deleteBody':
    'Relay इस फ़ीड की जाँच करना बंद कर देता है। इसके द्वारा पहले से बनाए गए ड्राफ्ट और पोस्ट बिल्कुल वैसे ही बने रहते हैं जैसे वे हैं।',
  'automation.rss.errorTitle': 'इस फ़ीड को पढ़ा नहीं जा सका',
  'automation.rss.errorBody':
    'Relay सामान्य शेड्यूल पर जाँच करता रहता है। आंशिक प्रतिक्रिया से कुछ भी प्रकाशित नहीं हुआ।',

  /* ----------------------------------------------------------------------
     What Relay refuses to automate
     ---------------------------------------------------------------------- */
  'automation.refuse.title': 'किसी भी नियम में उपलब्ध नहीं है',
  'automation.refuse.body':
    'स्वचालित पसंद और अनुसरण, सहभागिता समूह, अनचाहे उत्तर और संदेश, और इसे लोकप्रिय दिखाने के लिए एक ही सामग्री को कई खातों से पोस्ट करना यहां विकल्प नहीं हैं। प्लेटफ़ॉर्म उन्हें प्रतिबंधित करते हैं और वे उन खातों को नुकसान पहुंचाते हैं जो उनका उपयोग करते हैं।',
  'automation.refuse.readPolicy': 'स्वीकार्य उपयोग नीति पढ़ें',
} as const;
