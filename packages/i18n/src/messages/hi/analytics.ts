/** Analytics, metric definitions, experiments and tracked links. */
export const analyticsMessages = {
  'analytics.title': 'विश्लेषिकी',
  'analytics.subtitle': 'क्या हुआ, यह कितना ताज़ा है और आगे परीक्षण के लायक क्या है।',
  'analytics.range.7d': 'पिछले 7 दिन',
  'analytics.range.30d': 'पिछले 30 दिन',
  'analytics.range.90d': 'पिछले 90 दिन',
  'analytics.range.custom': 'कस्टम रेंज',
  'analytics.range.limitedByProvider':
    '{provider} ज्यादा से ज्यादा लौटता है {days, plural, one {# दिन} other {# दिन}} इस खाते के लिए इतिहास का.',
  'analytics.account.select': 'एक खाता चुनें',
  'analytics.compareTo': 'के साथ तुलना {baseline}',
  'analytics.baseline.trailingMedian':
    'आपका पूर्व का माध्य {count, plural, one {# तुलनीय पोस्ट} other {# तुलनीय पोस्ट}}',

  'analytics.metric.followers': 'अनुयायी',
  'analytics.metric.subscribers': 'सदस्य',
  'analytics.metric.profileViews': 'प्रोफ़ाइल दृश्य',
  'analytics.metric.impressions': 'इंप्रेशन',
  'analytics.metric.reach': 'पहुंचें',
  'analytics.metric.views': 'दृश्य',
  'analytics.metric.videoViews': 'वीडियो दृश्य',
  'analytics.metric.watchTime': 'देखने का समय',
  'analytics.metric.averageViewDuration': 'औसत दृश्य अवधि',
  'analytics.metric.averageViewPercentage': 'औसत प्रतिशत देखा गया',
  'analytics.metric.likes': 'पसंद और प्रतिक्रियाएँ',
  'analytics.metric.comments': 'टिप्पणियाँ और उत्तर',
  'analytics.metric.shares': 'शेयर, रीपोस्ट और उद्धरण',
  'analytics.metric.saves': 'सहेजें और बुकमार्क करें',
  'analytics.metric.linkClicks': 'लिंक क्लिक',
  'analytics.metric.clickThroughRate': 'क्लिक थ्रू दर',
  'analytics.metric.engagementRate': 'सगाई की दर',
  'analytics.metric.publishedCount': 'पोस्ट प्रकाशित',
  'analytics.metric.followerChange': 'अनुयायी परिवर्तन',

  'analytics.definition.title': 'कैसे {metric} परिभाषित किया गया है',
  'analytics.definition.provider': 'द्वारा रिपोर्ट किया गया {provider} जैसे {providerField}.',
  'analytics.definition.denominator.label': 'भाजक: {denominator}.',
  'analytics.definition.unit': 'इकाई: {unit}.',
  'analytics.definition.normalized': 'प्रदाता मूल्य से सामान्यीकृत। कच्चा मूल्य रखा और उपलब्ध है.',
  'analytics.definition.notComparable':
    '{provider} और {otherProvider} इसे अलग ढंग से परिभाषित करें. उनकी तुलना सावधानी से करें.',

  'analytics.value.unavailable': 'अनुपलब्ध',
  'analytics.value.unavailableReason.permission':
    'इस खाते ने इस मीट्रिक के लिए आवश्यक अनुमति नहीं दी है.',
  'analytics.value.unavailableReason.unsupported': '{provider} इस मीट्रिक की रिपोर्ट नहीं करता.',
  'analytics.value.unavailableReason.tooEarly':
    '{provider} इस मीट्रिक को बाद में प्रकाशित करेगा. बाद में दोबारा जांचें {time}.',
  'analytics.value.unavailableReason.syncFailed':
    'अंतिम समन्वयन विफल रहा. हम पुनः प्रयास कर रहे हैं और कोई अनुमानित संख्या नहीं दिखाएंगे.',
  'analytics.freshness.synced': 'सिंक किया गया {relativeTime}',
  'analytics.freshness.stale': 'अंतिम सफल सिंक {relativeTime}. यह पुराना हो सकता है.',
  'analytics.freshness.coverage': '{covered} का {total} इस श्रेणी की पोस्ट में वर्तमान डेटा है।',

  'analytics.feedback.title': 'इससे क्या पता चलता है',
  'analytics.feedback.aboveBaseline': 'यह पोस्ट प्राप्त हुआ {percent} अधिक {metric} से {baseline}.',
  'analytics.feedback.belowBaseline': 'यह पोस्ट प्राप्त हुआ {percent} कम {metric} से {baseline}.',
  'analytics.feedback.notComparableFormats':
    'यहां छवि पोस्ट और वीडियो पोस्ट सीधे तौर पर तुलनीय नहीं हैं।',
  'analytics.feedback.smallSample':
    'नमूना छोटा है. निष्कर्ष निकालने से पहले उसी हुक का दोबारा परीक्षण करें।',
  'analytics.feedback.association':
    'पहली टिप्पणी विलंब से बदलने के बाद टिप्पणियाँ बढ़ गईं {before} को {after}. यह एक संगति है, कारण का प्रमाण नहीं।',
  'analytics.feedback.nextTest': 'आगे क्या परीक्षण करना है',
  'analytics.feedback.doNotInfer': 'ये क्या नहीं दिखाता',
  'analytics.feedback.noScore':
    'यहां कोई एकल क्रॉस प्लेटफ़ॉर्म स्कोर नहीं है। ऐसी परिभाषा वाला मीट्रिक चुनें जिस पर आपको भरोसा हो।',

  'analytics.experiment.title': 'प्रयोग',
  'analytics.experiment.hypothesis': 'परिकल्पना',
  'analytics.experiment.variants': 'वेरिएंट',
  'analytics.experiment.successMetric': 'सफलता मीट्रिक',
  'analytics.experiment.window': 'मापन खिड़की',
  'analytics.experiment.status.running': 'तक चल रहा है {date}',
  'analytics.experiment.status.complete': 'पूर्ण',
  'analytics.experiment.tagBeforePublishing':
    'प्रकाशित करने से पहले किसी प्रयोग को टैग करें ताकि तथ्य के बाद तुलना न की जाए।',
  'analytics.experiment.caveats': 'चेतावनियाँ',

  'analytics.export.title': 'निर्यात करें',
  'analytics.export.csv': 'सीएसवी डाउनलोड करें',
  'analytics.export.json': 'JSON डाउनलोड करें',
  'analytics.export.providerRestriction':
    '{provider} यह प्रतिबंधित करता है कि इसके डेटा को कैसे संयोजित या संग्रहीत किया जा सकता है। कुछ फ़ील्ड शामिल नहीं हैं.',

  'analytics.links.title': 'ट्रैक किए गए लिंक',
  'analytics.links.subtitle':
    'प्रथम पक्ष पुनर्निर्देशन माप। ये लिंक पर क्लिक करने वाली प्लेटफ़ॉर्म रिपोर्ट से एक अलग श्रृंखला है।',
  'analytics.links.destination': 'गंतव्य',
  'analytics.links.shortUrl': 'लघु URL',
  'analytics.links.totalRequests': 'कुल अनुरोध',
  'analytics.links.humanClicks': 'डुप्लिकेट किए गए क्लिक',
  'analytics.links.suspectedBots': 'संदिग्ध बॉट',
  'analytics.links.referrerClass': 'सन्दर्भदाता',
  'analytics.links.deviceClass': 'युक्ति',
  'analytics.links.country': 'देश',
  'analytics.links.lastEvent': 'अंतिम क्लिक {relativeTime}',
  'analytics.links.privacyNote':
    'हम केवल मोटे स्थान और उपकरण वर्ग को ही रखते हैं। कच्चे आईपी पते को दुरुपयोग और डुप्लिकेट का पता लगाने के लिए थोड़े समय के लिए रखा जाता है, फिर छोड़ दिया जाता है।',
  'analytics.links.separateSources':
    'इन क्लिकों को किसी प्लेटफ़ॉर्म रिपोर्ट किए गए नंबर में न जोड़ें। वे अलग-अलग चीजें गिनते हैं।',
} as const;
