/** Developer surfaces: API keys, service accounts, MCP, CLI, OAuth apps. */
export const developerMessages = {
  'developer.title': 'एजेंट और API',
  'developer.subtitle':
    'API, MCP सर्वर और CLI ऐप के समान अनुमतियों, अनुमोदन नीति और रसीदों का उपयोग करते हैं।',

  'developer.serviceAccount.title': 'सेवा खाते',
  'developer.serviceAccount.create': 'एक सेवा खाता बनाएँ',
  'developer.serviceAccount.name': 'नाम',
  'developer.serviceAccount.scopeProjects': 'परियोजनाएं और खाते जिनका वह उपयोग कर सकता है',
  'developer.serviceAccount.scopePlatforms': 'प्लेटफार्म',
  'developer.serviceAccount.scopeLocales': 'सामग्री भाषाएँ',
  'developer.serviceAccount.scopeDomains': 'अनुमत लिंक डोमेन',
  'developer.serviceAccount.scopeHours': 'अनुमत घंटे',
  'developer.serviceAccount.scopeCadence': 'प्रति दिन अधिकतम पोस्ट',
  'developer.serviceAccount.scopeLookAhead': 'यह कितना आगे का शेड्यूल हो सकता है',
  'developer.serviceAccount.approvalLevel': 'अनुमोदन स्तर',
  'developer.serviceAccount.killSwitch': 'इस एजेंट को रोकें',

  'developer.approvalLevel.0': 'केवल पढ़ें और मान्य करें',
  'developer.approvalLevel.1': 'ड्राफ्ट बनाएं और संपादित करें',
  'developer.approvalLevel.2': 'ऊपर निर्धारित सीमा के अंदर शेड्यूल करें',
  'developer.approvalLevel.3': 'प्रकाशित करने से पहले किसी व्यक्ति से पूछें',
  'developer.approvalLevel.description.0':
    'एजेंट खातों, क्षमताओं, कैलेंडर और विश्लेषण को देख सकता है। इससे कुछ नहीं बदलता.',
  'developer.approvalLevel.description.1':
    'एजेंट ड्राफ्ट लिख सकता है. एक व्यक्ति अभी भी शेड्यूल और प्रकाशन करता है।',
  'developer.approvalLevel.description.2':
    'एजेंट खातों, घंटों, ताल, भाषाओं, डोमेन के भीतर शेड्यूल कर सकता है और आपके द्वारा निर्धारित भविष्य को देख सकता है। उन सीमाओं के बाहर किसी भी चीज़ के लिए एक व्यक्ति की आवश्यकता होती है।',
  'developer.approvalLevel.description.3':
    'तत्काल प्रकाशन, एक नया खाता या डोमेन, एक बड़ी कार्रवाई, संवेदनशील सामग्री या बदली हुई गोपनीयता सेटिंग को हमेशा किसी व्यक्ति से स्पष्ट पुष्टि की आवश्यकता होती है।',
  'developer.bulkThreshold':
    'थोक का अर्थ है इससे अधिक {publications, plural, one {# बाह्य प्रकाशन} other {# बाहरी प्रकाशन}} एक अनुरोध में, या एक ही सामग्री से अधिक में {accounts, plural, one {# खाता} other {# खाते}}.',

  'developer.credential.title': 'साख',
  'developer.credential.create': 'एक API कुंजी बनाएं',
  'developer.credential.shownOnce':
    'यह क्रेडेंशियल एक बार दिखाया गया है. इसे अभी कॉपी करें. हम इसका केवल एक हैश संग्रहित करते हैं।',
  'developer.credential.prefix': 'उपसर्ग',
  'developer.credential.created': 'बनाया गया {date} द्वारा {name}',
  'developer.credential.lastUsed': 'अंतिम समय प्रयोग हुआ {relativeTime}',
  'developer.credential.neverUsed': 'कभी उपयोग नहीं किया गया',
  'developer.credential.expires': 'समय-सीमा समाप्त {date}',
  'developer.credential.revokeConfirm':
    'इस क्रेडेंशियल को रद्द करें? इसका उपयोग करने वाली कोई भी चीज़ तुरंत काम करना बंद कर देती है।',

  'developer.scope.title': 'दायरा',
  'developer.scope.accountsRead': 'कनेक्टेड खाते और उनकी क्षमताएं पढ़ें',
  'developer.scope.draftsWrite': 'ड्राफ्ट बनाएं और संपादित करें',
  'developer.scope.postsSchedule': 'अनुमोदित सामग्री शेड्यूल करें',
  'developer.scope.postsPublish': 'तुरंत प्रकाशित करें',
  'developer.scope.analyticsRead': 'विश्लेषण पढ़ें',
  'developer.scope.receiptsRead': 'प्रकाशन रसीदें पढ़ें',
  'developer.scope.webhooksWrite': 'वेबहुक प्रबंधित करें',
  'developer.scope.connectionsAdmin': 'खाते कनेक्ट और डिस्कनेक्ट करें',
  'developer.scope.billingRead': 'बिलिंग स्थिति पढ़ें',
  'developer.scope.consequential': 'परिणामी',
  'developer.scope.readOnly': 'केवल पढ़ें',

  'developer.setup.title': 'एक ग्राहक कनेक्ट करें',
  'developer.setup.claudeCode': 'क्लाउड कोड',
  'developer.setup.codex': 'कोडेक्स',
  'developer.setup.hermes': 'हेमीज़',
  'developer.setup.buzz': 'बज़ वर्कफ़्लो',
  'developer.setup.cli': 'ZZZप्रोटेक्टेड16ZZZ',
  'developer.setup.genericMcp': 'कोई भी MCP क्लाइंट',
  'developer.setup.copyConfig': 'कॉन्फ़िगरेशन कॉपी करें',
  'developer.setup.mcpEndpoint': 'MCP समापन बिंदु',
  'developer.setup.apiBaseUrl': 'API आधार URL',

  'developer.playground.title': 'ड्राई रन',
  'developer.playground.description':
    'सीडेड डेटा के विरुद्ध उपकरण चलाएँ। कुछ भी वास्तविक मंच तक नहीं पहुंचता।',
  'developer.playground.run': 'भागो',
  'developer.playground.sandboxBadge': 'सैंडबॉक्स',

  'developer.activity.title': 'हाल की गतिविधि',
  'developer.activity.toolCall': '{tool} से बुलाया {actor} {relativeTime}',
  'developer.activity.denied': 'अस्वीकृत: {reason}',
  'developer.activity.empty': 'अभी तक कोई कॉल नहीं.',
  'developer.activity.redacted':
    'अनुरोध और प्रतिक्रिया निकायों को रहस्य हटाकर संग्रहीत किया जाता है।',

  'developer.apps.title': 'डेवलपर ऐप्स',
  'developer.apps.subtitle':
    'किसी अन्य उत्पाद को उपयोगकर्ता द्वारा दी गई अनुमतियों के साथ Post Array के माध्यम से कार्य करने दें।',
  'developer.apps.create': 'एक ऐप पंजीकृत करें',
  'developer.apps.name': 'ऐप का नाम',
  'developer.apps.type.label': 'ग्राहक प्रकार',
  'developer.apps.type.public': 'जनता, राज़ नहीं रख सकती',
  'developer.apps.type.confidential': 'गोपनीय, सर्वर पर चलता है',
  'developer.apps.homepage': 'मुखपृष्ठ URL',
  'developer.apps.privacyUrl': 'गोपनीयता नीति URL',
  'developer.apps.termsUrl': 'शर्तें URL',
  'developer.apps.logo': 'लोगो',
  'developer.apps.redirectUris': 'यूआरआई को पुनर्निर्देशित करें',
  'developer.apps.redirectUrisHelp':
    'केवल सटीक मिलान. वाइल्डकार्ड और आंशिक पथ अस्वीकार कर दिए गए हैं।',
  'developer.apps.clientId': 'ग्राहक आईडी',
  'developer.apps.clientSecret': 'ग्राहक रहस्य',
  'developer.apps.secretShownOnce':
    'राज़ एक बार दिखाया गया है. यदि आप इसे खो देते हैं तो इसे घुमाएँ। हम इसे दोबारा नहीं दिखाएंगे.',
  'developer.apps.status.draft': 'ड्राफ्ट',
  'developer.apps.status.active': 'सक्रिय',
  'developer.apps.status.disabled': 'विकलांग',
  'developer.apps.consentPreview': 'सहमति स्क्रीन पूर्वावलोकन',
  'developer.apps.grants.title': 'सक्रिय अनुदान',
  'developer.apps.grants.count': '{count, plural, one {# अनुदान} other {# अनुदान}}',
  'developer.apps.deleteConfirm':
    'यह ऐप हटाएं? प्रत्येक अनुदान रद्द कर दिया जाता है और उसके टोकन काम करना बंद कर देते हैं।',

  'developer.consent.title': '{app} आपके कार्यक्षेत्र तक पहुंच चाहता है',
  'developer.consent.workspace': 'ZZZप्रोटेक्टेड10ZZZ',
  'developer.consent.projects': 'परियोजनाएं और खाते',
  'developer.consent.willBeAbleTo': '{app} के लिए योग्य होगा',
  'developer.consent.willNotBeAbleTo': '{app} में सक्षम नहीं होगा',
  'developer.consent.approvalStillApplies':
    'आपकी अनुमोदन नीति अभी भी लागू होती है. यह ऐप इसके आसपास प्रकाशित नहीं कर सकता.',
  'developer.consent.revokeAnyTime': 'आप इसे किसी भी समय सेटिंग्स से रद्द कर सकते हैं।',
  'developer.consent.allow': 'पहुंच की अनुमति दें',
  'developer.consent.deny': 'अनुमति न दें',
  'developer.consent.developerIdentity': 'द्वारा प्रकाशित {developer}',

  'developer.grants.title': 'पहुंच वाले ऐप्स',
  'developer.grants.grantedOn': 'मंज़ूर किया गया {date}',
  'developer.grants.lastUsed': 'अंतिम समय प्रयोग हुआ {relativeTime}',
  'developer.grants.revoke': 'पहुंच निरस्त करें',
  'developer.grants.revoked':
    'प्रवेश रद्द कर दिया गया. आपके अपने कनेक्शन और शेड्यूल किए गए पोस्ट प्रभावित नहीं होंगे.',

  'developer.docs.openapi': 'OpenAPI दस्तावेज़',
  'developer.docs.clients': 'ग्राहक उत्पन्न किये',
  'developer.docs.idempotency':
    'प्रत्येक निर्माण, शेड्यूल और प्रकाशन अनुरोध के साथ एक इडेम्पोटेंसी कुंजी भेजें। एक ही कुंजी के साथ एक अनुरोध को दोहराने से दो बार प्रकाशित करने के बजाय मूल परिणाम मिलता है।',
  'developer.docs.pagination':
    'परिणाम कर्सर पृष्ठांकित हैं. समय स्पष्ट है और इसमें एक क्षेत्र शामिल है।',
  'developer.docs.rateLimits':
    'दर सीमाएँ प्रति कार्यस्थान, क्रेडेंशियल, मार्ग और कनेक्टर पर लागू होती हैं।',
} as const;
