/** Hindi beta translations for the weekly digest and its email. */
export const digestMessages = {
  'digest.title': 'इस सप्ताह',
  'digest.subtitle': '{windowStart} से {windowEnd} तक हम जो देख सकते हैं।',
  'digest.empty':
    'इस सप्ताह सारांशित करने के लिए अभी कुछ नहीं है। कुछ प्रकाशित करें और वह यहां दिखाई देगा।',
  'digest.regenerate': 'इस सप्ताह को फिर से बनाएं',
  'digest.generating': 'इस सप्ताह का सारांश बनाया जा रहा है',
  'digest.source.deterministic':
    'यह आपके प्रकाशन रिकॉर्ड और आपके अपने मापों से, लेखन सहायक के बिना लिखा गया है।',
  'digest.source.ai':
    'यह सहायक ने आपके अपने रिकॉर्ड से लिखा है। इसमें हर संख्या उन रिकॉर्ड से जांची गई है।',
  'digest.unavailable.aiOff':
    'लेखन सहायक बंद है, इसलिए यह सादा संस्करण है। इसमें कुछ भी छूटा नहीं है।',
  'digest.unavailable.rejected':
    'सहायक संस्करण आपके डेटा से मेल नहीं खाता था, इसलिए उसे हटा दिया गया। यह सादा संस्करण है।',
  'digest.headline.published':
    '{published, plural, =0 {कोई पोस्ट पूरी नहीं हुई} one {# पोस्ट पूरी हुई} other {# पोस्ट पूरी हुई}} {windowStart} और {windowEnd} के बीच।',
  'digest.headline.nothingPublished': '{windowStart} और {windowEnd} के बीच कुछ भी प्रकाशित नहीं हुआ।',
  'digest.outcome.published':
    '{count, plural, one {प्लेटफ़ॉर्म {provider} पर # पोस्ट पूरी हुई} other {प्लेटफ़ॉर्म {provider} पर # पोस्ट पूरी हुई}}।',
  'digest.outcome.partial':
    '{count, plural, one {प्लेटफ़ॉर्म {provider} पर # पोस्ट कुछ गंतव्यों तक पहुंची, अन्य तक नहीं} other {प्लेटफ़ॉर्म {provider} पर # पोस्ट कुछ गंतव्यों तक पहुंचीं, अन्य तक नहीं}}।',
  'digest.outcome.failed':
    '{count, plural, one {प्लेटफ़ॉर्म {provider} पर # पोस्ट प्रकाशित नहीं हुई} other {प्लेटफ़ॉर्म {provider} पर # पोस्ट प्रकाशित नहीं हुईं}}।',
  'digest.metrics.noneYet':
    'इस सप्ताह के लिए अभी कोई माप नहीं आया है। इसका अर्थ है कि हम नहीं जानते कि इन पोस्ट ने कैसा प्रदर्शन किया, यह नहीं कि उनका प्रदर्शन खराब था।',
  'digest.freshness.statement':
    '{label, select, fresh {माप आखिरी बार {lastObservedAt} पर सिंक हुए थे।} stale {माप {lastObservedAt} के बाद से सिंक नहीं हुए हैं, इसलिए ऊपर दिए गए आंकड़े पुराने हो सकते हैं।} other {अभी तक कुछ भी सिंक नहीं हुआ है, इसलिए ऊपर कुछ भी मापा नहीं गया है।}}',
  'digest.narrative.headline': '{statement}',
  'digest.narrative.observation': '{statement}',
  'digest.narrative.confounder': 'जानने योग्य बात: {confounder}',
  'digest.narrative.notSupported': '{statement}',
  'digest.narrative.nextAction': '{statement}',
  'digest.settings.title': 'साप्ताहिक सारांश ईमेल',
  'digest.settings.description':
    'हर सप्ताह एक छोटा ईमेल, जिसमें बताया जाता है कि क्या प्रकाशित हुआ और हम क्या माप सके। यह डिफ़ॉल्ट रूप से चालू है।',
  'digest.settings.enabled': 'साप्ताहिक सारांश भेजें',
  'email.digest.subject': '{workspaceName} में आपका सप्ताह',
  'email.digest.intro':
    '{windowStart} से {windowEnd} के बीच {workspaceName} के लिए हम जो देख सकते हैं, वह यहां है।',
  'email.digest.noData':
    'हम इस सप्ताह कुछ भी माप नहीं सके। जहां कोई संख्या नहीं है, वह इसलिए है कि हम उसे पढ़ नहीं सके, इसलिए नहीं कि वह शून्य थी।',
  'email.digest.footer':
    'यह ईमेल आपको इसलिए मिल रहा है क्योंकि {workspaceName} के लिए साप्ताहिक सारांश चालू है। इसे वर्कस्पेस सेटिंग्स में बंद करें।',
} as const;
