/** Screen level states: empty, loading, offline, permission and rate limits. */
export const statusMessages = {
  'empty.calendar.title': 'अभी तक कुछ भी निर्धारित नहीं है',
  'empty.calendar.body': 'अपनी पहली पोस्ट लिखें और एक समय चुनें. आप इसे बाद में बदल सकते हैं.',
  'empty.calendar.action': 'एक पोस्ट लिखें',
  'empty.drafts.title': 'कोई ड्राफ्ट नहीं',
  'empty.drafts.body':
    'आपके द्वारा सहेजे गए ड्राफ्ट यहां उनके लक्ष्यों और मुद्दों के साथ दिखाई देते हैं।',
  'empty.connections.title': 'कोई खाता कनेक्ट नहीं है',
  'empty.connections.body':
    'किसी खाते को प्रकाशित करने के लिए उससे कनेक्ट करें. हम आपको पहले सटीक अनुमतियाँ दिखाते हैं।',
  'empty.connections.action': 'एक खाता कनेक्ट करें',
  'empty.analytics.title': 'अभी तक कोई मेट्रिक्स नहीं',
  'empty.analytics.body':
    'आपकी पहली पोस्ट लंबे समय तक लाइव रहने के बाद प्लेटफ़ॉर्म पर उस पर रिपोर्ट करने के लिए मेट्रिक्स दिखाई देते हैं।',
  'empty.analytics.noPermission':
    'इस खाते ने एनालिटिक्स एक्सेस प्रदान नहीं किया है. इसे जोड़ने के लिए पुनः कनेक्ट करें.',
  'empty.approvals.title': 'कुछ भी आपका इंतजार नहीं कर रहा है',
  'empty.approvals.body': 'आपकी परियोजनाओं के लिए अनुमोदन अनुरोध यहां दिखाई देते हैं।',
  'empty.library.title': 'आपकी लाइब्रेरी खाली है',
  'empty.library.body': 'छवियाँ और वीडियो अपलोड करें, या उन्हें URL या API से आयात करें।',
  'empty.library.action': 'मीडिया अपलोड करें',
  'empty.automation.title': 'अभी तक कोई नियम नहीं',
  'empty.automation.body':
    'एक नियम किसी चीज़ पर प्रतिक्रिया करता है और एक कार्रवाई प्रस्तावित करता है। आपके द्वारा स्विच ऑन करने से पहले प्रत्येक नियम अपनी सीमाएं दिखाता है।',
  'empty.webhooks.title': 'कोई समापन बिंदु नहीं',
  'empty.webhooks.body':
    'प्रकाशन और कनेक्शन के बारे में हस्ताक्षरित ईवेंट प्राप्त करने के लिए एक समापन बिंदु जोड़ें।',
  'empty.searchResults.title': 'के लिए कोई परिणाम नहीं {query}',
  'empty.searchResults.body': 'वर्तनी जाँचें, या फ़िल्टर साफ़ करें।',
  'empty.filtered.title': 'इन फ़िल्टर से कुछ भी मेल नहीं खाता',
  'empty.filtered.action': 'फ़िल्टर साफ़ करें',
  'empty.auditLog.title': 'अभी तक कोई गतिविधि नहीं',
  'empty.receipts.title': 'अभी तक कोई रसीद नहीं',
  'empty.receipts.body':
    'प्रत्येक प्रकाशन एक रसीद तैयार करता है जिसका आप निरीक्षण कर सकते हैं और साझा कर सकते हैं।',

  'loading.default': 'लोड हो रहा है',
  'loading.calendar': 'आपका कैलेंडर लोड हो रहा है',
  'loading.analytics': 'मेट्रिक्स लोड हो रहा है',
  'loading.preview': 'पूर्वावलोकन का निर्माण',
  'loading.validating': 'वर्तमान प्लेटफ़ॉर्म सीमाओं के विरुद्ध जाँच की जा रही है',
  'loading.publishing': 'को प्रकाशित करना {provider}',
  'loading.uploading': 'अपलोड हो रहा है {name}',
  'loading.uploadProgress': '{percent} अपलोड किए गए',
  'loading.connecting': 'से जुड़ रहा है {provider}',
  'loading.savingDraft': 'आपका ड्राफ्ट सहेजा जा रहा है',
  'loading.generatingPlan': 'अपनी योजना बनाना',
  'loading.longRunning': 'इसमें सामान्य से अधिक समय लग रहा है. यह अभी भी चल रहा है.',

  'offline.banner': 'आप ऑफ़लाइन हैं. इस डिवाइस पर परिवर्तन रखे जाते हैं.',
  'offline.draftSafe':
    'आपका ड्राफ्ट सुरक्षित है. जब आप वापस ऑनलाइन होते हैं तो यह सिंक हो जाता है।',
  'offline.publishDisabled':
    'प्रकाशन के लिए एक कनेक्शन की आवश्यकता है. इसे चुपचाप कतारबद्ध नहीं किया जाएगा.',
  'offline.scheduleQueued':
    'यह शेड्यूल अनुरोध इस डिवाइस पर कतारबद्ध है और जब आप वापस ऑनलाइन होंगे तो भेजा जाएगा।',
  'offline.reconnected': 'वापस ऑनलाइन. आपके परिवर्तन समन्वयित हो रहे हैं.',
  'offline.syncConflict':
    'कुछ बदलावों को स्वचालित रूप से मर्ज नहीं किया जा सका. सहेजने से पहले उनकी समीक्षा करें.',

  'permission.denied.title': 'आपके पास इस तक पहुंच नहीं है',
  'permission.denied.role': 'इसकी जरूरत है {role} भूमिका. आप हैं {currentRole}.',
  'permission.denied.scope': 'इस क्रेडेंशियल को दायरे की आवश्यकता है {scope}.',
  'permission.denied.contactOwner': 'पूछो {owner} इसे देने के लिए.',
  'permission.denied.projectScope': 'आपकी पहुंच यहीं तक सीमित है {projects}.',
  'permission.readOnly': 'यह कार्यक्षेत्र अभी केवल पढ़ने के लिए है।',
  'permission.mfaRequired': 'जारी रखने के लिए दो कारक प्रमाणीकरण की पुष्टि करें।',

  'rateLimit.title': 'एक पल के लिए धीमे हो जाओ',
  'rateLimit.body': 'आपने बनाया है {count} में अनुरोध करता है {window}. हद है {limit}.',
  'rateLimit.resetsAt': 'यह पर रीसेट हो जाता है {time}.',
  'rateLimit.cheaperAlternative': 'अब प्रकाशन के बजाय शेड्यूल करने से इस सीमा से बचा जा सकता है।',
  'rateLimit.providerCost': '{provider} प्रति ऑपरेशन शुल्क। इस कार्रवाई का अनुमान है {amount}.',

  'incident.providerDegraded':
    '{provider} समस्या हो रही है. शेड्यूल किए गए पोस्ट पुनः प्रयास करते रहते हैं.',
  'incident.providerDown':
    '{provider} अनुपलब्ध है. कुछ भी खोया नहीं है और कुछ भी दोहराया नहीं गया है।',
  'incident.isolated': 'अन्य प्लेटफ़ॉर्म अप्रभावित हैं.',
  'incident.statusPage': 'कनेक्टर और सतह द्वारा लाइव स्थिति',
  'incident.startedAt': 'शुरू कर दिया {relativeTime}',

  'translation.incomplete':
    'इस स्क्रीन पर कुछ पाठ का अनुवाद नहीं किया गया है {language} अभी तक और अंग्रेजी में दिखाया गया है.',
  'translation.beta': 'यह भाषा बीटा में है. जो भी गलत पढ़ा जाए उसकी रिपोर्ट करें।',

  'confirm.discardChanges.title': 'अपने परिवर्तन त्यागें?',
  'confirm.discardChanges.body': 'इसे पूर्ववत नहीं किया जा सकता.',
  'confirm.deleteItem.title': 'हटाएँ {name}?',
  'confirm.deleteItem.body': 'इसे पूर्ववत नहीं किया जा सकता.',
  'confirm.cancelScheduled.title': 'क्या यह निर्धारित पोस्ट रद्द करें?',
  'confirm.cancelScheduled.body':
    'यह प्रकाशित नहीं होगा. ड्राफ्ट यहीं रहता है इसलिए आप इसे फिर से शेड्यूल कर सकते हैं।',
  'confirm.publishNow.title': 'अभी प्रकाशित करें?',
  'confirm.publishNow.body':
    '{count, plural, one {यह प्रकाशित करता है # तुरंत खाता} other {यह प्रकाशित करता है # तुरंत खाते}}. इसे Post Array से वापस नहीं बुलाया जा सकता।',
  'confirm.typeToConfirm': 'प्रकार {word} पुष्टि करने के लिए.',
} as const;
