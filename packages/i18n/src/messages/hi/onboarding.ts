/** First run: checkout, workspace, role, first connection, first post. */
export const onboardingMessages = {
  'onboarding.title': 'Relay सेट करें',
  'onboarding.progress': 'कदम {current} का {total}',
  'onboarding.skipForNow': 'अभी के लिए छोड़ें',
  'onboarding.goal': 'दस मिनट से कम समय में एक सत्यापित निर्धारित पोस्ट।',

  'onboarding.plan.title': 'चुनें कि आप भुगतान कैसे करना चाहते हैं',
  'onboarding.plan.help': 'योजना एक, सुविधा हर। जब चाहें अंतराल बदलें।',

  'onboarding.workspace.title': 'अपने कार्यक्षेत्र को नाम दें',
  'onboarding.workspace.namePlaceholder': 'आपकी कंपनी या ग्राहक का नाम',
  'onboarding.workspace.timeZone': 'शेड्यूलिंग के लिए समय क्षेत्र',
  'onboarding.workspace.timeZoneHelp':
    'प्रत्येक निर्धारित समय इस क्षेत्र में संग्रहीत होता है, इसलिए घड़ी में बदलाव से आपकी पोस्ट कभी भी दुर्घटनावश स्थानांतरित नहीं होती है।',
  'onboarding.workspace.locale': 'इंटरफ़ेस भाषा',

  'onboarding.role.title': 'आपका सबसे अच्छा वर्णन क्या करता है?',
  'onboarding.role.creator': 'रचयिता',
  'onboarding.role.team': 'घरेलू टीम में',
  'onboarding.role.agency': 'एजेंसी',
  'onboarding.role.developer': 'डेवलपर या एजेंट बिल्डर',
  'onboarding.role.help':
    'इससे हमारे द्वारा सुझाए गए डिफ़ॉल्ट बदल जाते हैं। आप बाद में सब कुछ बदल सकते हैं.',

  'onboarding.connect.title': 'अपना पहला खाता कनेक्ट करें',
  'onboarding.connect.help':
    'हम आपको दिखाएंगे कि किसी भी चीज को मंजूरी देने से पहले प्रत्येक प्लेटफॉर्म से कौन सी अनुमतियां मांगी जाती हैं।',
  'onboarding.connect.skipNote':
    'आप पहले नमूना खाते से पता लगा सकते हैं। इससे कुछ भी प्रकाशित नहीं होता.',
  'onboarding.connect.success': '{account} जुड़ा है।',

  'onboarding.content.title': 'किसी ऐसी चीज़ से शुरुआत करें जो आपके पास पहले से है',
  'onboarding.content.useAsset': 'किसी छवि या वीडियो का उपयोग करें',
  'onboarding.content.useBrief': 'संक्षिप्त विवरण से शुरुआत करें',
  'onboarding.content.useText': 'इसे स्वयं लिखें',

  'onboarding.preview.title': 'यही प्रकाशित करेंगे',
  'onboarding.preview.help': 'इस खाते के लिए प्लेटफ़ॉर्म नियमों का एक वास्तविक पूर्वावलोकन।',

  'onboarding.schedule.title': 'चुनें कि यह कब निकलेगा',
  'onboarding.schedule.help':
    'समय, गोपनीयता सेटिंग, प्रकटीकरण और अनुमानित प्रदाता लागत की समीक्षा करें।',

  'onboarding.done.title': 'अनुसूचित',
  'onboarding.done.body': 'आपकी पोस्ट के लिए निर्धारित है {time} में {timeZone}.',
  'onboarding.done.nextStep.title': 'आगे क्या करना है',
  'onboarding.done.nextStep.connectMore': 'दूसरा खाता कनेक्ट करें',
  'onboarding.done.nextStep.inviteTeam': 'किसी साथी को आमंत्रित करें',
  'onboarding.done.nextStep.setApproval': 'एक अनुमोदन नीति निर्धारित करें',
  'onboarding.done.nextStep.exploreApi': 'API और MCP सर्वर का अन्वेषण करें',

  'onboarding.checklist.title': 'आरंभ करना',
  'onboarding.checklist.connectAccount': 'एक खाता कनेक्ट करें',
  'onboarding.checklist.firstPost': 'किसी पोस्ट को प्रकाशित या शेड्यूल करें',
  'onboarding.checklist.inviteTeammate': 'किसी साथी को आमंत्रित करें',
  'onboarding.checklist.setProjectVoice': 'अपनी परियोजना की आवाज़ का वर्णन करें',
  'onboarding.checklist.tryAutomation': 'स्वचालन नियम आज़माएँ',
  'onboarding.checklist.remaining':
    '{count, plural, =0 {सब हो गया} one {# बाएँ कदम} other {# कदम बचे हैं}}',
} as const;
