export const webComparisonMessages = {
  'web.comparison.eyebrow': 'तुलना',

  'web.comparison.state.yes': 'हां',
  'web.comparison.state.no': 'नहीं',
  'web.comparison.state.partial': 'आंशिक रूप से',
  'web.comparison.state.notVerified': 'सत्यापित नहीं',

  'web.comparison.label.claim': 'दावा',
  'web.comparison.label.sourceRead': '{date} को पढ़ा गया',
  'web.comparison.label.checked': 'हर पंक्ति {date} को जांची गई',
  'web.comparison.label.nextReview': 'अगली जांच {date} को देय',
  'web.comparison.label.backToIndex': 'सभी तुलनाएं',

  'web.comparison.table.title': 'हर विकल्प क्या करता है',
  'web.comparison.table.caption': 'प्रति पंक्ति एक दावा, हर उत्तर के पीछे के स्रोत के साथ',

  'web.comparison.bestFor.title': 'कौन सा उपयुक्त है',
  'web.comparison.bestFor.ours': 'इस उत्पाद को चुनें जब',
  'web.comparison.bestFor.alternative': '{name} को चुनें जब',

  'web.comparison.notDo.title': 'यह उत्पाद क्या नहीं करता',
  'web.comparison.notDo.body':
    'ये वाक्य उस कोड से पढ़े जाते हैं जो इन्हें तय करता है, हाथ से टाइप नहीं किए जाते, इसलिए यह खंड आज उत्पाद वास्तव में क्या है इससे भटक नहीं सकता।',
  'web.comparison.disclosure.connectors':
    '{count, plural, =0 {किसी भी कनेक्टर ने प्रदाता सत्यापन पूरा नहीं किया है, इसलिए आज इस उत्पाद के माध्यम से किसी भी प्लेटफ़ॉर्म पर कुछ भी प्रकाशित नहीं होता।} one {# कनेक्टर ने प्रदाता सत्यापन पूरा किया है। इस समूह के अन्य सभी प्लेटफ़ॉर्म अभी भी इरादे में हैं।} other {# कनेक्टरों ने प्रदाता सत्यापन पूरा किया है। इस समूह के अन्य सभी प्लेटफ़ॉर्म अभी भी इरादे में हैं।}}',
  'web.comparison.disclosure.locales':
    '{count, plural, =0 {किसी भी भाषा ने मानव समीक्षा पूरी नहीं की है, इसलिए इंटरफ़ेस में हर भाषा को बीटा के रूप में लेबल किया गया है।} one {# भाषा ने मानव समीक्षा पूरी की है। हर अन्य भाषा को बीटा लेबल किया गया है।} other {# भाषाओं ने मानव समीक्षा पूरी की है। हर अन्य भाषा को बीटा लेबल किया गया है।}}',
  'web.comparison.disclosure.tiers':
    '{count, plural, =0 {हर मूल्य निर्धारण स्तर तय हो चुका है और वास्तविक मूल्य रखता है।} one {# मूल्य निर्धारण स्तर अभी भी एक अनिर्णीत प्लेसहोल्डर है और खरीदा नहीं जा सकता।} other {# मूल्य निर्धारण स्तर अभी भी अनिर्णीत प्लेसहोल्डर हैं और खरीदे नहीं जा सकते।}}',

  'web.comparison.notVerified.title': 'सत्यापित नहीं का क्या मतलब है',
  'web.comparison.notVerified.body':
    'एक सेल सत्यापित नहीं कहती है जब जांच के दिन तथ्य दूसरे विकल्प के आधिकारिक सार्वजनिक दस्तावेज़ीकरण से नहीं पढ़ा जा सका। यह कभी याद से नहीं भरा जाता, और कभी किसी और के लिखे सारांश से कॉपी नहीं किया जाता।',

  'web.comparison.method.title': 'यह पेज कैसे बनाया गया है',
  'web.comparison.method.body':
    'हर पंक्ति एक दावा है, उस दस्तावेज़ के साथ जहां से यह आया और वह तारीख जब किसी व्यक्ति ने इसे पढ़ा। कोई प्रतिस्पर्धी स्क्रीनशॉट नहीं, कोई कॉपी की गई फ़ीचर शब्दावली नहीं और कोई गढ़ी हुई कमज़ोरी नहीं है।',
  'web.comparison.method.cadence':
    'हर तुलना कम से कम हर 90 दिनों में एक बार फिर से जांची जाती है, और तुरंत जब कोई प्लेटफ़ॉर्म या विकल्प किसी पंक्ति में बताई गई चीज़ बदलता है।',

  'web.comparison.questions.title': 'प्रश्न',
  'web.comparison.sources.title': 'इस पेज पर उद्धृत स्रोत',

  'web.comparison.index.title': 'प्रकाशित तुलनाएं',
  'web.comparison.index.body':
    'हर पेज इस उत्पाद की तुलना विकल्पों की उस श्रेणी से करता है जिसके तथ्य आधिकारिक दस्तावेज़ीकरण से पढ़े जा सकते हैं। एक नामित उत्पाद को तब पेज मिलता है जब उसके वर्तमान तथ्य उसके अपने सार्वजनिक पृष्ठों से पढ़े जा सकते हैं, उससे पहले नहीं।',
  'web.comparison.index.checked': '{date} को जांचा गया',
} as const;
