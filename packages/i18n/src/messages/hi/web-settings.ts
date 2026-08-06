/**
 * Web catalog for settings, the developer portal, billing and the Growth
 * Advisor.
 *
 * This file only adds what the web screens need on top of the intent catalogs
 * in `settings.ts`, `developer.ts`, `billing.ts` and `growth.ts`. Everything
 * here lives under a `.ui.` segment so a key can never collide with one of
 * those files when the catalogs are merged.
 *
 * Several strings are mandated word for word and must not be softened:
 *  - `billing.ui.annualFraming` states the saving in currency, never a percent.
 *  - `billing.ui.cancelConfirmedBeforeConversion` must read
 *    "Canceled. You will not be charged."
 *  - the media generation boundary paragraph is NOT restated here. It already
 *    exists as `billing.mediaGeneration.explanation`, and the Tool Radar
 *    renders that same key so there is one sentence to review and translate.
 */
export const webSettingsMessages = {
  /* ------------------------------------------------------------------ shell */

  'settings.ui.subtitle':
    'वह सब कुछ जो इस कार्यक्षेत्र को कॉन्फ़िगर करता है। यहां कुछ भी कुछ भी प्रकाशित नहीं करता.',
  'settings.ui.nav.label': 'सेटिंग्स अनुभाग',
  'settings.ui.index.help':
    'एक अनुभाग चुनें. प्रत्येक परिवर्तन का श्रेय आपको दिया जाता है और ऑडिट लॉग में दिखाई देता है।',

  'settings.ui.section.members': 'सदस्य और भूमिकाएँ',
  'settings.ui.section.membersSummary':
    'इस कार्यक्षेत्र में कौन है और प्रत्येक व्यक्ति क्या कर सकता है।',
  'settings.ui.section.brands': 'ZZZप्रोटेक्टेड11ZZZs',
  'settings.ui.section.brandsSummary':
    'आवाज़, दर्शक, स्वीकृत दावे, अवरुद्ध शर्तें, स्थानीय नियम, डोमेन और शब्दावली।',
  'settings.ui.section.agents': 'एजेंट और API',
  'settings.ui.section.agentsSummary':
    'सेवा खाते, कार्यक्षेत्र, सीमाएँ, साख, गतिविधि और ड्राई रन खेल का मैदान।',
  'settings.ui.section.apps': 'डेवलपर ऐप्स',
  'settings.ui.section.appsSummary':
    'तृतीय पक्ष OAuth एप्लिकेशन, अनुमति सूचियाँ, सहमति और अनुदान पुनर्निर्देशित करें।',
  'settings.ui.section.webhooks': 'वेबहुक',
  'settings.ui.section.webhooksSummary':
    'आउटबाउंड ईवेंट, डिलीवरी लॉग, पुनर्वितरण और गुप्त रोटेशन पर हस्ताक्षर किए।',
  'settings.ui.section.billing': 'बिलिंग',
  'settings.ui.section.billingSummary':
    'योजना, परीक्षण, अंतराल, मीटर्ड प्रदाता उपयोग, चालान और रद्दीकरण।',
  'settings.ui.section.referrals': 'रेफरल और संबद्ध',
  'settings.ui.section.referralsSummary':
    'आपका प्रकट किया गया रेफरल लिंक, जिम्मेदार साइनअप और कमीशन स्थिति।',
  'settings.ui.section.localization': 'स्थानीयकरण',
  'settings.ui.section.localizationSummary':
    'इंटरफ़ेस भाषा, सामग्री भाषाएँ, बाज़ार, समय क्षेत्र और समय प्रारूप।',
  'settings.ui.section.security': 'सुरक्षा',
  'settings.ui.section.securitySummary':
    'सत्र, दो कारक प्रमाणीकरण, क्रेडेंशियल्स, एजेंट, वेबहुक और ऐप अनुदान।',
  'settings.ui.section.data': 'डेटा नियंत्रण',
  'settings.ui.section.dataSummary':
    'निर्यात करें, कनेक्शन रद्द करें, ब्रांड हटाएं, सामग्री हटाएं या खाता बंद करें।',

  /* ------------------------------------------------------- shared UI states */

  'settings.ui.state.loading': 'Loading {section}',
  'settings.ui.state.errorTitle': 'We could not load {section}',
  'settings.ui.state.errorRetry': 'पुनः प्रयास करें',
  'settings.ui.state.savingAnnouncement': 'Saving {section}',
  'settings.ui.state.savedAnnouncement': '{section} saved',
  'settings.ui.state.saveFailedAnnouncement': '{section} was not saved. Your input is still here.',
  'settings.ui.state.offlineTitle': 'आप ऑफ़लाइन हैं',
  'settings.ui.state.offlineBody':
    'आप यह पेज पढ़ सकते हैं. जब तक कनेक्शन वापस नहीं आता तब तक परिवर्तन सहेजे नहीं जा सकते.',
  'settings.ui.state.permissionTitle': 'You do not have access to {section}',
  'settings.ui.state.permissionBody':
    'यह अनुभाग कार्यक्षेत्र के व्यवहार को बदलता है, इसलिए यह भूमिका द्वारा सीमित है।',
  'settings.ui.state.permissionRequirements': 'आपको क्या चाहिए',
  'settings.ui.state.permissionContact':
    'इस कार्यक्षेत्र का कोई स्वामी या व्यवस्थापक इसे अनुदान दे सकता है. उन्हें सदस्यों और भूमिकाओं के अंतर्गत सूचीबद्ध किया गया है।',
  'settings.ui.state.rateLimitTitle': 'कम समय में बहुत सारे बदलाव',
  'settings.ui.state.rateLimitCause':
    'यह कार्यक्षेत्र सेटिंग्स परिवर्तनों के लिए लिखने की सीमा तक पहुंच गया।',
  'settings.ui.state.rateLimitReset': 'सीमा रीसेट',
  'settings.ui.state.rateLimitAlternative':
    'आपके द्वारा बचाया गया कुछ भी नहीं खोया गया। आपके प्रतीक्षा करने पर भी केवल पढ़ने योग्य क्रियाएँ काम करती हैं।',
  'settings.ui.state.rateLimitUsage': 'सेटिंग्स इस घंटे लिखता है',
  'settings.ui.state.rateLimitUsageText': '{used} of {limit} used',
  'settings.ui.state.unsavedTitle': 'आपके पास सहेजे नहीं गए परिवर्तन हैं',
  'settings.ui.state.unsavedBody': 'इस अनुभाग को छोड़ने से पहले उन्हें सहेजें।',
  'settings.ui.state.readOnlyTitle': 'यह कार्यक्षेत्र केवल पढ़ने योग्य है',
  'settings.ui.state.readOnlyBody':
    'बिलिंग बकाया है. आपकी सामग्री, रसीदें और कनेक्शन बरकरार हैं। सेटिंग्स पढ़ी जा सकती हैं लेकिन बदली नहीं जा सकतीं।',

  'settings.ui.state.referenceLabel': 'समर्थन संदर्भ',

  'settings.ui.attribution': 'Changed by {name} {relativeTime}',
  'settings.ui.attributionNever': 'इसके बनने के बाद से इसमें कोई बदलाव नहीं हुआ है',
  'settings.ui.copyFailed':
    'आपके ब्राउज़र ने कॉपी को ब्लॉक कर दिया है. टेक्स्ट का चयन करें और इसे मैन्युअल रूप से कॉपी करें।',

  /* ------------------------------------------------------- members and roles */

  'settings.ui.members.description':
    'प्रत्येक आमंत्रण, भूमिका परिवर्तन और निष्कासन आपके नाम और समय के साथ दर्ज किया जाता है।',
  'settings.ui.members.tableCaption': 'इस कार्यक्षेत्र में लोग, भूमिका और दायरे के साथ',
  'settings.ui.members.column.person': 'व्यक्ति',
  'settings.ui.members.column.role': 'भूमिका',
  'settings.ui.members.column.scope': 'दायरा',
  'settings.ui.members.column.approvals': 'स्वीकृतियाँ',
  'settings.ui.members.column.lastActive': 'अंतिम सक्रिय',
  'settings.ui.members.column.actions': 'क्रियाएँ',
  'settings.ui.members.scopeAll': 'सभी ब्रांड और खाते',
  'settings.ui.members.scopeLimited': '{count, plural, one {# brand} other {# brands}}: {names}',
  'settings.ui.members.approvals.canApprove': 'अनुमोदन कर सकते हैं',
  'settings.ui.members.approvals.cannotApprove': 'अनुमोदन नहीं कर सकते',
  'settings.ui.members.approvals.canApproveOwnBrands':
    'सूचीबद्ध ब्रांडों के लिए अनुमोदन कर सकते हैं',
  'settings.ui.members.lastActiveNever': 'अभी तक साइन इन नहीं किया है',
  'settings.ui.members.changeRole': 'Change role for {name}',
  'settings.ui.members.remove': 'Remove {name}',
  'settings.ui.members.lastOwnerTitle': 'एक कार्यक्षेत्र में कम से कम एक मालिक रहता है',
  'settings.ui.members.lastOwnerBody': 'पहले किसी और को मालिक बनाएं, फिर यह बदलाव उपलब्ध होगा.',
  'settings.ui.members.inviteTitle': 'इस कार्यक्षेत्र में किसी को आमंत्रित करें',
  'settings.ui.members.inviteBody':
    'उन्हें एक लिंक के साथ एक ईमेल प्राप्त होता है। आमंत्रण सात दिनों के बाद समाप्त हो जाता है और आप उससे पहले इसे रद्द कर सकते हैं।',
  'settings.ui.members.inviteRole': 'भूमिका',
  'settings.ui.members.inviteScope': 'Brands में वे काम कर सकते हैं',
  'settings.ui.members.inviteScopeAll': 'इस कार्यक्षेत्र में प्रत्येक ब्रांड',
  'settings.ui.members.inviteScopeSelected': 'केवल वे ब्रांड जो मैं चुनता हूं',
  'settings.ui.members.inviteApprovals': 'अनुमोदन अनुरोधों पर निर्णय ले सकते हैं',
  'settings.ui.members.inviteApprovalsHelp':
    'केवल वे भूमिकाएँ जिनमें पहले से ही समीक्षा शामिल है, उन्हें यह दिया जा सकता है। यह संपादन से अलग है.',
  'settings.ui.members.inviteSubmit': 'आमंत्रण भेजें',
  'settings.ui.members.invitePending': 'Invited {relativeTime} by {name}',
  'settings.ui.members.inviteRevoke': 'आमंत्रण रद्द करें',
  'settings.ui.members.inviteResend': 'पुनः आमंत्रण भेजें',
  'settings.ui.members.emptyTitle': 'आप यहां एकमात्र व्यक्ति हैं',
  'settings.ui.members.emptyBody':
    'उन लोगों को आमंत्रित करें जो परिणाम लिखते हैं, अनुमोदित करते हैं या पढ़ते हैं। प्रत्येक को एक भूमिका और एक ब्रांड का दायरा मिलता है।',
  'settings.ui.members.emptyExample':
    'एक सामान्य आकार: बिलिंग के लिए एक मालिक, प्रति ब्रांड एक अनुमोदक, और संपादक जो मसौदा तैयार करते हैं लेकिन कभी प्रकाशित नहीं करते।',
  'settings.ui.members.roleReferenceTitle': 'प्रत्येक भूमिका क्या कर सकती है',
  'settings.ui.members.roleReferenceCaption':
    'भूमिकाएँ और क्रियाएँ जिनकी प्रत्येक व्यक्ति अनुमति देता है',
  'settings.ui.members.roleColumn.role': 'भूमिका',
  'settings.ui.members.roleColumn.can': 'कर सकते हैं',
  'settings.ui.members.roleColumn.cannot': 'नहीं कर सकते',
  'settings.ui.members.roleCannot.owner': 'मालिक से कुछ भी नहीं रोका जाता है।',
  'settings.ui.members.roleCannot.admin': 'बिलिंग बदलें, या कार्यस्थान हटाएँ.',
  'settings.ui.members.roleCannot.manager': 'बिलिंग, भूमिकाएँ बदलें या कार्यस्थान हटाएँ।',
  'settings.ui.members.roleCannot.editor':
    'कनेक्शन स्वीकृत करें, शेड्यूल करें, प्रकाशित करें या बदलें।',
  'settings.ui.members.roleCannot.approver': 'कनेक्शन, नियम या बिलिंग बदलें.',
  'settings.ui.members.roleCannot.analyst':
    'कुछ भी बनाएं, संपादित करें, स्वीकृत करें या प्रकाशित करें।',
  'settings.ui.members.roleCannot.viewer': 'कुछ भी बदलो.',
  'settings.ui.members.removeTitle': 'Remove {name} from this workspace',
  'settings.ui.members.removeConsequence.access': 'वे हर सतह पर तुरंत पहुंच खो देते हैं।',
  'settings.ui.members.removeConsequence.drafts':
    'उनके द्वारा लिखे गए ड्राफ्ट कार्यक्षेत्र में बने रहते हैं और संपादन योग्य रहते हैं।',
  'settings.ui.members.removeConsequence.audit':
    'उनके पिछले कार्य ऑडिट लॉग और प्राप्तियों में रहते हैं।',
  'settings.ui.members.removeConsequence.approvals':
    'उन पर प्रतीक्षा कर रहे अनुमोदन अनुरोध किसी अन्य अनुमोदनकर्ता के लिए कतार में लौट आते हैं।',

  /* ------------------------------------------------------------------ brands */

  'settings.ui.brands.description':
    'एक ब्रांड में ऐसे नियम होते हैं जिनके आधार पर सामग्री की जाँच की जाती है: आप क्या दावा कर सकते हैं, आप क्या नहीं कह सकते हैं, और प्रत्येक भाषा कैसे लिखी जाती है।',
  'settings.ui.brands.listCaption': 'इस कार्यक्षेत्र में Brands',
  'settings.ui.brands.column.brand': 'ZZZप्रोटेक्टेड11ZZZ',
  'settings.ui.brands.column.locales': 'सामग्री भाषाएँ',
  'settings.ui.brands.column.accounts': 'लेखा',
  'settings.ui.brands.column.updated': 'अद्यतन किया गया',
  'settings.ui.brands.accountCount':
    '{count, plural, =0 {No accounts} one {# account} other {# accounts}}',
  'settings.ui.brands.emptyTitle': 'अभी तक कोई ब्रांड नहीं',
  'settings.ui.brands.emptyBody':
    'एक ब्रांड खातों, अनुमोदन नियमों और भाषा नियमों को समूहित करता है। अधिकांश टीमें एक से शुरू करती हैं और जब किसी ग्राहक या बाज़ार को अलग-अलग नियमों की आवश्यकता होती है तो दूसरा जोड़ देती हैं।',
  'settings.ui.brands.emptyExample':
    'उदाहरण: ब्रांड "एक्मे ईयू", भाषाएं अंग्रेजी और जर्मन, अवरुद्ध शब्द "गारंटी", Instagram के लिए प्रकटीकरण "भुगतान साझेदारी"।',
  'settings.ui.brands.voiceHelp':
    'यह ब्रांड कैसा लगता है. इसका उपयोग तब किया जाता है जब आप दोबारा लिखने के लिए कहते हैं और जब दावों की जाँच की जाती है।',
  'settings.ui.brands.audienceHelp': 'सामग्री किसके लिए है, प्रति बाज़ार।',
  'settings.ui.brands.approvedClaimsHelp':
    'एक समीक्षक ने बयानों को साफ़ कर दिया है। इस सूची से बाहर की किसी भी चीज़ को अनुमोदन से पहले चिह्नित किया जाता है, प्रकाशन के बाद नहीं।',
  'settings.ui.brands.blockedTermsHelp':
    'ऐसे शब्द जो इस ब्रांड के लिए शेड्यूलिंग को अवरुद्ध करते हैं। प्रति पंक्ति एक।',
  'settings.ui.brands.domainsHelp':
    'जिन डोमेन से यह ब्रांड लिंक कर सकता है और उन्हें छोटा कर सकता है। कंपोज़र में केवल सत्यापित डोमेन का चयन किया जा सकता है।',
  'settings.ui.brands.domainVerified': 'Verified {date}',
  'settings.ui.brands.domainPending': 'DNS रिकॉर्ड अभी तक नहीं देखा गया',
  'settings.ui.brands.disclosureHelp':
    'यहां आपके द्वारा चुने गए प्लेटफ़ॉर्म के लिए कंपोज़र में डिफ़ॉल्ट रूप से लागू किया जाता है। अनुमोदन से पहले इसे प्रति पोस्ट बदला जा सकता है।',
  'settings.ui.brands.glossaryHelp':
    'उत्पाद के नाम, कानूनी शर्तें और ऐसी कोई भी चीज़ जिसका अनुवाद अपरिवर्तित रहना चाहिए।',
  'settings.ui.brands.glossaryCaption': 'संरक्षित शब्द और प्रत्येक भाषा को कैसे संभाला जाता है',
  'settings.ui.brands.glossaryEmpty':
    'अभी तक कोई संरक्षित शर्तें नहीं. उत्पाद के नाम और कानूनी शब्द जोड़ें जिनका अनुवाद या पुनर्लेखन नहीं किया जाना चाहिए।',
  'settings.ui.brands.localeRulesHelp':
    'प्रति सामग्री भाषा नियम. जब आप अनुकूलन या ट्रांसक्रिएट करते हैं तो उन्हें लागू किया जाता है और समीक्षक को दिखाया जाता है।',
  'settings.ui.brands.saveBrand': 'ब्रांड सहेजें',

  /* ------------------------------------------------------------ localization */

  'settings.ui.localization.description':
    'तीन अलग-अलग सेटिंग्स: इस ऐप की भाषा, वे भाषाएँ जिनमें आप प्रकाशित करते हैं, और वे बाज़ार जिनके लिए आप लिख रहे हैं। एक को बदलने से दूसरा कभी नहीं बदलता।',
  'settings.ui.localization.interfaceOnlyEnglish':
    'इस ऐप के लिए एक इंटरफ़ेस भाषा चुनें. सामग्री भाषाएँ अलग हैं और पहले से ही उपलब्ध हैं।',
  'settings.ui.localization.marketHelp':
    'एक बाज़ार उदाहरणों, कानूनी खुलासों और कार्रवाई के आह्वान को बदलता है। इससे किसी पोस्ट की भाषा नहीं बदलती.',
  'settings.ui.localization.previewTitle': 'तारीखें और नंबर कैसे पढ़ेंगे',
  'settings.ui.localization.previewDate': 'दिनांक',
  'settings.ui.localization.previewTime': 'समय',
  'settings.ui.localization.previewNumber': 'संख्या',
  'settings.ui.localization.previewCurrency': 'मुद्रा',
  'settings.ui.localization.weekStartHelp': 'कैलेंडर सप्ताह दृश्य द्वारा प्रयुक्त.',

  /* ---------------------------------------------------------------- security */

  'settings.ui.security.description':
    'वह सब कुछ जो इस कार्यक्षेत्र पर एक ही स्थान पर कार्य कर सकता है: आपके सत्र, क्रेडेंशियल्स, एजेंट, वेबहुक और आपके द्वारा एक्सेस प्रदान किए गए ऐप्स।',
  'settings.ui.security.sessionsCaption': 'आपके खाते के लिए सत्रों में साइन इन किया गया',
  'settings.ui.security.sessionColumn.device': 'डिवाइस और ब्राउज़र',
  'settings.ui.security.sessionColumn.location': 'अनुमानित स्थान',
  'settings.ui.security.sessionColumn.lastSeen': 'अंतिम बार उपयोग किया गया',
  'settings.ui.security.sessionCurrent': 'इस सत्र',
  'settings.ui.security.sessionRevokeAll': 'हर दूसरे सत्र से साइन आउट करें',
  'settings.ui.security.sessionLocationUnknown': 'स्थान दर्ज नहीं किया गया',
  'settings.ui.security.mfaOn': 'दो कारक प्रमाणीकरण चालू है',
  'settings.ui.security.mfaOff': 'दो कारक प्रमाणीकरण बंद है',
  'settings.ui.security.mfaBody':
    'बिलिंग परिवर्तन, सेवा खाता निर्माण, खाता पुनः कनेक्ट करने और क्रेडेंशियल रद्द करने से पहले एक दूसरे कारक की आवश्यकता होती है।',
  'settings.ui.security.credentialsTitle': 'API कुंजियाँ',
  'settings.ui.security.credentialsBody':
    'इस कार्यक्षेत्र के स्वामित्व वाली कुंजियाँ. वे ऐप अनुदान और आपके अपने सत्र से अलग हैं।',
  'settings.ui.security.agentsTitle': 'सेवा खाते',
  'settings.ui.security.webhooksTitle': 'वेबहुक समापन बिंदु',
  'settings.ui.security.grantsTitle': 'जिन ऐप्स को आपने अनुमति दी है',
  'settings.ui.security.grantsBody':
    'किसी ऐप को रद्द करने से उसके टोकन तुरंत बंद हो जाते हैं। आपके अपने कनेक्शन और शेड्यूल किए गए पोस्ट प्रभावित नहीं होंगे.',
  'settings.ui.security.grantScopes': 'अनुमतियाँ प्रदान की गईं',
  'settings.ui.security.socialPermissionsTitle': 'सामाजिक खाता अनुमतियाँ',
  'settings.ui.security.socialPermissionsBody':
    'कनेक्शन के समय लिए गए क्षमता स्नैपशॉट से, प्रत्येक कनेक्टेड खाते ने Relay को क्या करने की अनुमति दी है।',
  'settings.ui.security.viewInSection': 'Manage in {section}',
  'settings.ui.security.emptySessions': 'केवल इसी सत्र में साइन इन किया गया है.',
  'settings.ui.security.emptyGrants':
    'किसी भी तीसरे पक्ष के ऐप की इस कार्यक्षेत्र तक पहुंच नहीं है। आपके द्वारा सहमति स्क्रीन पर अनुमति देने के बाद ऐप्स यहां दिखाई देते हैं।',
  'settings.ui.security.revokeGrantTitle': 'Revoke access for {app}',
  'settings.ui.security.revokeGrantConsequence.tokens':
    'इसका एक्सेस और रिफ्रेश टोकन तुरंत काम करना बंद कर देते हैं।',
  'settings.ui.security.revokeGrantConsequence.scheduled':
    'पोस्ट यह पहले से ही निर्धारित है रहने का समय निर्धारित है। यदि आप उन्हें रोकना चाहते हैं तो उन्हें अलग से रद्द करें।',
  'settings.ui.security.revokeGrantConsequence.reconnect':
    'ऐप दोबारा एक्सेस मांग सकता है, और आप मना कर सकते हैं।',

  /* ----------------------------------------------------------- data controls */

  'settings.ui.data.description':
    'अपना डेटा निकाल लें, एक चीज़ हटा दें, या खाता बंद कर दें। प्रत्येक विनाशकारी क्रिया ठीक वही नाम बताती है जिसे वह सबसे पहले छूती है।',
  'settings.ui.data.exportTitle': 'निर्यात करें',
  'settings.ui.data.exportBody':
    'सामग्री, शेड्यूल, रसीदें, विश्लेषण और ऑडिट इवेंट, साथ ही आपके अपलोड किए गए मीडिया का एक पोर्टेबल संग्रह।',
  'settings.ui.data.exportJson': 'संरचित JSON',
  'settings.ui.data.exportCsv': 'स्प्रेडशीट सीएसवी',
  'settings.ui.data.exportMedia': 'मीडिया पुरालेख',
  'settings.ui.data.exportJsonHelp':
    'प्रति रिकॉर्ड प्रकार एक फ़ाइल. सभी संस्करणों में प्रलेखित और स्थिर।',
  'settings.ui.data.exportCsvHelp':
    'स्प्रेडशीट के लिए फ्लैट टेबल के रूप में पोस्ट, रसीदें और मेट्रिक्स।',
  'settings.ui.data.exportMediaHelp': 'चेकसम के साथ आपके द्वारा अपलोड या आयात की गई मूल फ़ाइलें।',
  'settings.ui.data.exportStart': 'निर्यात तैयार करें',
  'settings.ui.data.exportRunning':
    'आपका निर्यात तैयार किया जा रहा है. यदि आप इस पृष्ठ को बंद करते हैं तो यह चलता रहता है।',
  'settings.ui.data.exportReady': 'Export ready, prepared {date}',
  'settings.ui.data.exportDownload': 'निर्यात डाउनलोड करें',
  'settings.ui.data.exportExpires': 'The download link expires {date}.',
  'settings.ui.data.deleteTitle': 'हटाएँ',
  'settings.ui.data.deleteBody':
    'सबसे छोटी चीज़ चुनें जो आपकी समस्या का समाधान करती हो। नीचे दिया गया प्रत्येक विकल्प बताता है कि क्या बचता है।',
  'settings.ui.data.deleteConnection': 'एक सामाजिक संबंध रद्द करें',
  'settings.ui.data.deleteConnectionHelp':
    'उस खाते तक Relay पहुंच हटा देता है। कार्यक्षेत्र, उसकी सामग्री और उसकी प्राप्तियाँ बनी रहती हैं।',
  'settings.ui.data.deleteBrand': 'एक ब्रांड हटाएँ',
  'settings.ui.data.deleteBrandHelp':
    'ब्रांड, उसके नियम और उसकी शब्दावली को हटा देता है। इसके अंतर्गत प्रकाशित सामग्री अपनी रसीदें रखती है।',
  'settings.ui.data.deleteContent': 'सामग्री और मीडिया हटाएँ',
  'settings.ui.data.deleteContentHelp':
    'ड्राफ्ट और संग्रहीत फ़ाइलें हटाता है। यह किसी प्लेटफ़ॉर्म पर पहले से प्रकाशित किसी भी चीज़ को नहीं हटाता है।',
  'settings.ui.data.deleteAccount': 'इस कार्यस्थान को बंद करें',
  'settings.ui.data.deleteAccountHelp':
    'निर्धारित कार्यों को रद्द करता है, हर कनेक्शन को रद्द करता है, संग्रहीत मीडिया को हटाता है और कार्यक्षेत्र को बंद करता है।',
  'settings.ui.data.scheduledJobsTitle': 'निर्धारित कार्य जो पहले रद्द किये जायेंगे',
  'settings.ui.data.scheduledJobsCount':
    '{count, plural, =0 {Nothing is scheduled right now} one {# scheduled post} other {# scheduled posts}}',
  'settings.ui.data.cancelJobsFirst': 'निर्धारित पोस्ट अभी रद्द करें',
  'settings.ui.data.cancelJobsDone': 'अनुसूचित पद रद्द. कुछ भी प्रकाशित नहीं होगा.',
  'settings.ui.data.deleteConfirmPhraseLabel': 'पुष्टि करने के लिए कार्यक्षेत्र का नाम टाइप करें',
  'settings.ui.data.deleteConsequence.jobs':
    'कुछ भी हटाए जाने से पहले प्रत्येक निर्धारित पोस्ट रद्द कर दी जाती है।',
  'settings.ui.data.deleteConsequence.connections':
    'प्रदाता पर प्रत्येक सामाजिक कनेक्शन रद्द कर दिया जाता है।',
  'settings.ui.data.deleteConsequence.media':
    'संग्रहीत मीडिया हटा दिया गया है और पुनर्प्राप्त नहीं किया जा सकता.',
  'settings.ui.data.deleteConsequence.receipts':
    'प्रकाशन रसीदें शर्तों में बताई गई अवधारण अवधि के लिए रखी जाती हैं, फिर हटा दी जाती हैं।',
  'settings.ui.data.deleteConsequence.published':
    'किसी प्लेटफ़ॉर्म पर पहले से मौजूद पोस्ट को हटाया नहीं जाता है. प्लेटफ़ॉर्म पर मौजूद लोगों को हटा दें.',
  'settings.ui.data.exportFirst': 'अपना डेटा हटाने से पहले उसे निर्यात करें.',

  /* --------------------------------------------------------------- referrals */

  'settings.ui.referral.description':
    'एक प्रकट लिंक के साथ Relay साझा करें। आयोग कभी भी सकारात्मक समीक्षा पर सशर्त नहीं होता।',
  'settings.ui.referral.linkLabel': 'आपका रेफरल लिंक',
  'settings.ui.referral.tableCaption': 'जिम्मेदार साइनअप और उनके कमीशन की स्थिति',
  'settings.ui.referral.column.signup': 'साइन अप करें',
  'settings.ui.referral.column.date': 'दिनांक',
  'settings.ui.referral.column.state': 'आयोग',
  'settings.ui.referral.column.amount': 'रकम',
  'settings.ui.referral.emptyTitle': 'अभी तक कोई एट्रिब्यूटेड साइनअप नहीं है',
  'settings.ui.referral.emptyBody':
    'जब कोई आपके लिंक के माध्यम से परीक्षण शुरू करता है तो साइनअप यहां दिखाई देते हैं। रिफंड विंडो बंद होने तक रकम लंबित रहती है।',
  'settings.ui.referral.emptyExample':
    'उदाहरण पंक्ति: acme.example, 12 जून को परीक्षण शुरू हुआ, 12 जुलाई तक लंबित, फिर स्वीकृत।',
  'settings.ui.referral.termsLink': 'भागीदार की शर्तें पढ़ें',
  'settings.ui.referral.balance': 'स्वीकृत आयोग',
  'settings.ui.referral.balanceUnavailableReason':
    'इस अवधि के लिए अभी तक कमीशन बही का मिलान नहीं किया गया है।',

  /* --------------------------------------------------------- agents and API */

  'developer.ui.agents.description':
    'एक सेवा खाता एक एजेंट, एक स्क्रिप्ट या वर्कफ़्लो के लिए एक नामित पहचान है। इसका अपना दायरा, अपनी सीमाएं और अपना ऑडिट ट्रेल होता है।',
  'developer.ui.agents.emptyTitle': 'अभी तक कोई सेवा खाता नहीं है',
  'developer.ui.agents.emptyBody':
    'आपके द्वारा चलाए जाने वाले प्रत्येक स्वचालन के लिए एक बनाएं। अलग-अलग खातों का मतलब है कि आप दूसरे को रोके बिना एक को रद्द कर सकते हैं।',
  'developer.ui.agents.emptyExample':
    'उदाहरण: "कंटेंट एजेंट", ब्रांड एक्मे ईयू, 07:00 और 22:00 के बीच एक दिन में 6 पोस्ट तक ड्राफ्ट और शेड्यूल कर सकता है, कभी भी तुरंत प्रकाशित नहीं होता है।',
  'developer.ui.agents.step.identity': 'नाम और उद्देश्य',
  'developer.ui.agents.step.scope': 'यह कहां तक पहुंच सकता है',
  'developer.ui.agents.step.limits': 'सीमाएँ',
  'developer.ui.agents.purpose': 'यह खाता किस लिए है',
  'developer.ui.agents.purposeHelp':
    'एक वाक्य. यह इस खाते द्वारा ऑडिट लॉग में की गई प्रत्येक कार्रवाई के आगे दिखाई देता है।',
  'developer.ui.agents.scopeHelp':
    'एक दायरा स्वयं ही अनुदान देता है। यहां किसी भी चीज़ का तात्पर्य किसी और चीज़ से नहीं है।',
  'developer.ui.agents.limitsHelp':
    'सीमाएं API द्वारा लागू की जाती हैं, एजेंट द्वारा नहीं। कोई एजेंट अपनी सीमा नहीं बढ़ा सकता.',
  'developer.ui.agents.quietHours': 'शांत घंटे',
  'developer.ui.agents.quietHoursHelp':
    'कार्यस्थान समय क्षेत्र में खाता इन घंटों के भीतर शेड्यूल या प्रकाशित नहीं कर सकता है।',
  'developer.ui.agents.lookAheadHelp': 'यह भविष्य में कितनी दूर तक कोई पोस्ट डाल सकता है.',
  'developer.ui.agents.cadenceHelp': 'यह एक दिन में सबसे अधिक बाहरी प्रकाशनों का कारण बन सकता है।',
  'developer.ui.agents.expiry': 'क्रेडेंशियल समाप्ति',
  'developer.ui.agents.expiryHelp': 'छोटा जीवन अधिक सुरक्षित है. आप किसी भी समय घूम सकते हैं.',
  'developer.ui.agents.summaryTitle': 'इससे पहले कि आप इसे बनाएं',
  'developer.ui.agents.summaryAccounts': 'जिन खातों तक यह पहुंच सकता है',
  'developer.ui.agents.summaryMaxActions':
    'At most {count, plural, one {# external publication} other {# external publications}} per day.',
  'developer.ui.agents.summaryApproval': 'अनुमोदन व्यवहार',
  'developer.ui.agents.summaryCreate': 'सेवा खाता बनाएँ',
  'developer.ui.agents.detailTitle': 'सेवा खाता',
  'developer.ui.agents.statusActive': 'सक्रिय',
  'developer.ui.agents.statusStopped': 'रुक गया',
  'developer.ui.agents.statusExpired': 'क्रेडेंशियल समाप्त हो गया',
  'developer.ui.agents.stoppedBody':
    'यह खाता बंद कर दिया गया है. इसके द्वारा की जाने वाली प्रत्येक कॉल को स्पष्ट कारण बताकर अस्वीकार कर दिया जाता है। इससे निर्मित कुछ भी नहीं हटाया गया।',
  'developer.ui.agents.killTitle': 'Stop {name}',
  'developer.ui.agents.killConsequence.calls':
    'इस खाते से प्रत्येक API, MCP और CLI कॉल को तुरंत अस्वीकार कर दिया जाता है।',
  'developer.ui.agents.killConsequence.scheduled':
    'पोस्ट यह पहले से ही निर्धारित है रहने का समय निर्धारित है। यदि आप उन्हें रोकना चाहते हैं तो उन्हें कैलेंडर से रद्द कर दें।',
  'developer.ui.agents.killConsequence.reversible': 'आप इसे बाद में दोबारा शुरू कर सकते हैं.',
  'developer.ui.agents.resume': 'इस एजेंट को फिर से प्रारंभ करें',
  'developer.ui.agents.rotate': 'क्रेडेंशियल घुमाएँ',
  'developer.ui.agents.rotateTitle': 'Rotate the credential for {name}',
  'developer.ui.agents.rotateConsequence.old': 'वर्तमान क्रेडेंशियल तुरंत काम करना बंद कर देता है.',
  'developer.ui.agents.rotateConsequence.new': 'इस पृष्ठ पर नया एक बार दिखाया गया है।',
  'developer.ui.agents.rotateConsequence.clients':
    'पुराने मान का उपयोग करने वाली कोई भी चीज़ तब तक विफल रहती है जब तक आप उसे अपडेट नहीं करते।',
  'developer.ui.agents.credentialStored': 'मैंने यह क्रेडेंशियल संग्रहीत कर लिया है',
  'developer.ui.agents.credentialLabel': 'सेवा खाता क्रेडेंशियल',
  'developer.ui.agents.credentialWarning': 'यह एकमात्र समय है जब यह क्रेडेंशियल दिखाया गया है',
  'developer.ui.agents.credentialWarningBody':
    'इसे अभी अपने गुप्त स्टोर में कॉपी करें। हम केवल हैश रखते हैं, इसलिए हम इसे दोबारा नहीं दिखा सकते। घूमने से एक नया बनता है।',
  'developer.ui.agents.credentialConsumed':
    'क्रेडेंशियल अब प्रदर्शित नहीं होता है. यदि आपने इसे संग्रहित नहीं किया है तो इसे घुमाएँ।',
  'developer.ui.agents.credentialReveal': 'प्रमाण पत्र दिखाएँ',
  'developer.ui.agents.credentialHide': 'क्रेडेंशियल छुपाएं',

  /* Scope sentences written for the person granting them, not for the
     developer requesting them. The developer facing wording lives in
     `developer.scope.*`. */
  'developer.ui.scope.accounts_read':
    'अपने कनेक्टेड खाते देखें और उनमें से प्रत्येक क्या कर सकता है',
  'developer.ui.scope.accounts_write': 'खातों का नाम बदलें और उन्हें समूहीकृत करने का तरीका बदलें',
  'developer.ui.scope.drafts_read': 'अपने ड्राफ्ट और उनके प्रकार पढ़ें',
  'developer.ui.scope.drafts_write': 'ड्राफ्ट बनाएं और संपादित करें',
  'developer.ui.scope.posts_schedule': 'अपने खातों में अनुमोदित सामग्री शेड्यूल करें',
  'developer.ui.scope.posts_publish': 'तुरंत अपने खातों में प्रकाशित करें',
  'developer.ui.scope.posts_cancel': 'निर्धारित पोस्ट रद्द करें',
  'developer.ui.scope.analytics_read': 'अपने खातों के लिए विश्लेषण पढ़ें',
  'developer.ui.scope.media_read': 'अपनी लाइब्रेरी में फ़ाइलें देखें',
  'developer.ui.scope.media_write': 'अपनी लाइब्रेरी में फ़ाइलें अपलोड करें और संपादित करें',
  'developer.ui.scope.rules_read': 'अपने स्वचालन नियम पढ़ें',
  'developer.ui.scope.rules_write': 'स्वचालन नियम बनाएं और बदलें जिन्हें प्रकाशित किया जा सके',
  'developer.ui.scope.growth_read': 'अपनी विकास योजनाएं पढ़ें',
  'developer.ui.scope.growth_write': 'विकास योजनाएँ बनाएँ और संपादित करें',
  'developer.ui.scope.webhooks_manage': 'वेबहुक एंडपॉइंट बनाएं और बदलें',
  'developer.ui.scope.billing_read': 'अपनी योजना, परीक्षण स्थिति और उपयोग पढ़ें',
  'developer.ui.scope.connections_admin': 'सामाजिक खातों को कनेक्ट और डिस्कनेक्ट करें',

  'developer.ui.activity.caption': 'हाल ही में टूल कॉल, जिन्हें अस्वीकार कर दिया गया था',
  'developer.ui.activity.column.time': 'समय',
  'developer.ui.activity.column.tool': 'उपकरण या मार्ग',
  'developer.ui.activity.column.outcome': 'परिणाम',
  'developer.ui.activity.column.subject': 'विषय',
  'developer.ui.activity.outcome.ok': 'अनुमति है',
  'developer.ui.activity.outcome.denied': 'इनकार किया',
  'developer.ui.activity.outcome.failed': 'असफल',
  'developer.ui.activity.filterDenied': 'केवल अस्वीकृत प्रयास दिखाएँ',
  'developer.ui.activity.deniedExplain':
    'एक अस्वीकृत प्रयास यह है कि एक गलत कॉन्फ़िगर किया गया एजेंट खुद को कैसे दिखाता है। ये पंक्तियाँ रखी जाती हैं, छिपाई नहीं जातीं।',
  'developer.ui.activity.emptyTitle': 'अभी तक कोई कॉल रिकॉर्ड नहीं की गई',
  'developer.ui.activity.emptyBody':
    'कॉल होने के कुछ ही सेकंड के भीतर यहां दिखाई देने लगती हैं, जिनमें वे कॉल भी शामिल हैं जिन्हें अस्वीकार कर दिया गया था।',
  'developer.ui.activity.emptyExample':
    'उदाहरण पंक्ति: 12:03, ड्राफ्ट_पोस्ट, अनुमति, एक्स खाते @acme के लिए ड्राफ्ट।',

  'developer.ui.setup.help':
    'इसे उस क्लाइंट में पेस्ट करें जिसे आप कनेक्ट कर रहे हैं। क्रेडेंशियल प्लेसहोल्डर को आपके द्वारा संग्रहीत मूल्य से बदलें।',
  'developer.ui.setup.credentialPlaceholder':
    'स्निपेट प्लेसहोल्डर का उपयोग करता है. वास्तविक क्रेडेंशियल को कभी भी रिपॉजिटरी में न भेजें।',
  'developer.ui.setup.copySnippet': 'Copy snippet for {client}',
  'developer.ui.setup.snippetCopied': 'स्निपेट कॉपी किया गया',
  'developer.ui.setup.tabLabel': 'क्लाइंट सेटअप स्निपेट',

  'developer.ui.playground.help':
    'कॉल इस कार्यक्षेत्र की एक सीडेड प्रति के विरुद्ध चलती हैं। किसी प्रदाता से संपर्क नहीं किया गया है और कुछ भी निर्धारित नहीं है।',
  'developer.ui.playground.tool': 'औज़ार',
  'developer.ui.playground.arguments': 'तर्क',
  'developer.ui.playground.argumentsHelp': 'JSON. असली API वही बॉडी स्वीकार करता है।',
  'developer.ui.playground.result': 'नतीजा',
  'developer.ui.playground.resultEmpty':
    'यह देखने के लिए टूल चलाएँ कि यह किस प्रकार की प्रतिक्रिया देगा।',
  'developer.ui.playground.invalidJson':
    'यह अभी तक मान्य JSON नहीं है, इसलिए इसे भेजा नहीं जा सकता.',
  'developer.ui.playground.deniedByApproval':
    'Approval level {level} does not allow this call. The dry run refuses it exactly as the API would.',
  'developer.ui.playground.announceResult': 'Dry run finished. {outcome}.',

  /* --------------------------------------------------------- developer apps */

  'developer.ui.apps.description':
    'एक एप्लिकेशन पंजीकृत करें ताकि अन्य लोग इसे अपने कार्यक्षेत्र तक पहुंच प्रदान कर सकें। प्रत्येक ऐप की अपनी पहचान, अपनी रीडायरेक्ट अनुमति सूची और अपना ऑडिट ट्रेल होता है।',
  'developer.ui.apps.emptyTitle': 'कोई ऐप्स पंजीकृत नहीं',
  'developer.ui.apps.emptyBody':
    'जब किसी अन्य उत्पाद को Relay उपयोगकर्ता की ओर से कार्य करने की आवश्यकता हो तो एक ऐप पंजीकृत करें। अपने स्वयं के स्वचालन के लिए, इसके बजाय एक सेवा खाते का उपयोग करें।',
  'developer.ui.apps.emptyExample':
    'Example: "Acme Publisher", confidential client, redirect https://acme.example/oauth/callback, scopes accounts:read and drafts:write.',
  'developer.ui.apps.typeHelp':
    'एक गोपनीय क्लाइंट आपके नियंत्रण वाले सर्वर पर चलता है और कोई रहस्य रख सकता है। सार्वजनिक क्लाइंट एक ब्राउज़र या डेस्कटॉप ऐप है और बिना किसी रहस्य के PKCE का उपयोग करता है।',
  'developer.ui.apps.redirectAdd': 'एक रीडायरेक्ट यूआरआई जोड़ें',
  'developer.ui.apps.redirectRemove': 'Remove {uri}',
  'developer.ui.apps.redirectInvalid':
    'बिना किसी वाइल्डकार्ड और बिना किसी क्वेरी स्ट्रिंग के पूर्ण https URI दर्ज करें। यह आपके ऐप द्वारा भेजे गए मूल्य से बिल्कुल मेल खाना चाहिए।',
  'developer.ui.apps.linksTitle': 'प्रकाशित लिंक',
  'developer.ui.apps.linksHelp':
    'ये सहमति स्क्रीन पर दिखाई देते हैं। जो उपयोगकर्ता उन तक नहीं पहुंच सकता, वह पहुंच नहीं देगा।',
  'developer.ui.apps.linkUnreachable': 'We could not reach this URL when we last checked, {date}.',
  'developer.ui.apps.linkReachable': 'Reachable, checked {date}',
  'developer.ui.apps.scopesTitle': 'यह ऐप अनुमतियाँ मांग सकता है',
  'developer.ui.apps.scopesHelp':
    'आपको जो कम से कम आवश्यकता हो, वह मांगें। उपयोगकर्ता पढ़ने की अनुमति और परिणामी अनुमति को दो अलग-अलग समूहों के रूप में देखता है।',
  'developer.ui.apps.scopeGroup.read': 'अनुमतियाँ पढ़ें',
  'developer.ui.apps.scopeGroup.reversible': 'परिवर्तन आप पूर्ववत कर सकते हैं',
  'developer.ui.apps.scopeGroup.consequential': 'परिणामी अनुमतियाँ',
  'developer.ui.apps.scopeGroupHelp.read': 'ये ऐप को डेटा देखने देते हैं। कुछ भी नहीं बदलता.',
  'developer.ui.apps.scopeGroupHelp.reversible':
    'ये ऐप को Relay के अंदर चीज़ें बनाने या संपादित करने देते हैं। कोई भी चीज़ एक मंच तक नहीं पहुंचती.',
  'developer.ui.apps.scopeGroupHelp.consequential':
    'ये किसी वास्तविक खाते पर पोस्ट का कारण बन सकते हैं, या यह बदल सकते हैं कि आपके खातों तक कौन पहुंच सकता है। उन्हें हमेशा अलग से सूचीबद्ध किया जाता है और कभी भी बंडल नहीं किया जाता है।',
  'developer.ui.apps.noBundling':
    'कोई संयुक्त पहुंच का दायरा नहीं है. बिलिंग और कनेक्शन प्रशासन से हमेशा नाम पूछा जाता है।',
  'developer.ui.apps.secretTitle': 'ग्राहक रहस्य',
  'developer.ui.apps.secretWarning': 'यह एकमात्र समय है जब ग्राहक रहस्य दिखाया जाता है',
  'developer.ui.apps.secretWarningBody':
    'इसे अभी अपने सर्वर साइड सीक्रेट मैनेजर में स्टोर करें। हम केवल एक हैश रखते हैं. यदि आप इसे खो देते हैं, तो इसे घुमाएँ: इसे दोबारा प्रकट करने का कोई तरीका नहीं है।',
  'developer.ui.apps.secretConsumed':
    'रहस्य अब प्रदर्शित नहीं होता. यदि आपने इसे संग्रहित नहीं किया है तो इसे घुमाएँ।',
  'developer.ui.apps.secretStored': 'यह रहस्य मैंने संजोकर रखा है',
  'developer.ui.apps.secretPublicClient':
    'एक सार्वजनिक ग्राहक के पास कोई रहस्य नहीं होता. यह PKCE के साथ प्राधिकरण कोड प्रवाह का उपयोग करता है।',
  'developer.ui.apps.rotateTitle': 'Rotate the client secret for {app}',
  'developer.ui.apps.rotateConsequence.old': 'वर्तमान रहस्य तुरंत काम करना बंद कर देता है.',
  'developer.ui.apps.rotateConsequence.grants': 'मौजूदा उपयोगकर्ता अनुदान रद्द नहीं किया गया है।',
  'developer.ui.apps.rotateConsequence.deploy':
    'जब तक आप नया मान तैनात नहीं करते, आपके सर्वर टोकन ताज़ा करने में विफल रहते हैं।',
  'developer.ui.apps.consentPreviewTitle': 'सहमति स्क्रीन पूर्वावलोकन',
  'developer.ui.apps.consentPreviewHelp':
    'उपयोगकर्ता यही देखता है. यह ऐप रिकॉर्ड से उत्पन्न होता है, इसलिए यह ऐप द्वारा मांगे गए से अधिक का वादा नहीं कर सकता है।',
  'developer.ui.apps.consentPreviewSample':
    'केवल पूर्वावलोकन करें. कुछ भी नहीं दिया जाता है और कोई टोकन जारी नहीं किया जाता है।',
  'developer.ui.apps.grantsCaption': 'Workspaces जिन्होंने इस ऐप को एक्सेस प्रदान किया है',
  'developer.ui.apps.grantColumn.workspace': 'ZZZप्रोटेक्टेड10ZZZ',
  'developer.ui.apps.grantColumn.scopes': 'दायरा',
  'developer.ui.apps.grantColumn.granted': 'मान लिया',
  'developer.ui.apps.grantColumn.lastUsed': 'अंतिम बार उपयोग किया गया',
  'developer.ui.apps.grantsEmpty': 'अभी तक किसी ने भी इस ऐप को एक्सेस नहीं दिया है।',
  'developer.ui.apps.logsCaption': 'हाल के अनुरोध, रहस्य और पेलोड हटा दिए गए',
  'developer.ui.apps.logColumn.time': 'समय',
  'developer.ui.apps.logColumn.route': 'मार्ग',
  'developer.ui.apps.logColumn.status': 'स्थिति',
  'developer.ui.apps.logColumn.workspace': 'ZZZप्रोटेक्टेड10ZZZ',
  'developer.ui.apps.logsRedacted':
    'अनुरोध और प्रतिक्रिया निकायों को क्रेडेंशियल्स, टोकन और उपयोगकर्ता सामग्री को हटाकर संग्रहीत किया जाता है।',
  'developer.ui.apps.sandboxTitle': 'सैंडबॉक्स क्रेडेंशियल',
  'developer.ui.apps.sandboxBody':
    'सीडेड डेटा के साथ एक अलग क्लाइंट आईडी और कार्यक्षेत्र। इससे की गई कॉल कभी भी प्रदाता तक नहीं पहुंचती।',
  'developer.ui.apps.rateLimitLabel': 'दर सीमा',
  'developer.ui.apps.rateLimitUsage': '{used} of {limit} requests this hour',
  'developer.ui.apps.disable': 'ऐप अक्षम करें',
  'developer.ui.apps.enable': 'ऐप सक्षम करें',
  'developer.ui.apps.disabledBody':
    'यह ऐप अक्षम है. मौजूदा टोकन अस्वीकार कर दिए गए हैं और कोई नया अनुदान शुरू नहीं किया जा सकता है। अनुदान रखा जाता है ताकि आप इसे फिर से सक्षम कर सकें।',
  'developer.ui.apps.deleteTitle': 'Delete {app}',
  'developer.ui.apps.deleteConsequence.grants':
    'प्रत्येक अनुदान रद्द कर दिया जाता है और प्रत्येक टोकन काम करना बंद कर देता है।',
  'developer.ui.apps.deleteConsequence.logs': 'अनुरोध लॉग ऑडिट अवधारण अवधि के लिए रखे जाते हैं।',
  'developer.ui.apps.deleteConsequence.irreversible':
    'क्लाइंट आईडी का पुन: उपयोग नहीं किया जा सकता.',

  /* ---------------------------------------------------------------- webhooks */

  'developer.ui.webhooks.description':
    'आपके द्वारा चुने गए इवेंट के लिए हस्ताक्षरित HTTPS डिलीवरी। प्रत्येक डिलीवरी को उसकी प्रतिक्रिया के साथ लॉग किया जाता है, और किसी भी डिलीवरी को दोबारा भेजा जा सकता है।',
  'developer.ui.webhooks.emptyTitle': 'अभी तक कोई समापन बिंदु नहीं',
  'developer.ui.webhooks.emptyBody':
    'अपने सिस्टम में प्रकाशन परिणाम, अनुमोदन निर्णय और कनेक्शन स्वास्थ्य प्राप्त करने के लिए एक समापन बिंदु जोड़ें।',
  'developer.ui.webhooks.emptyExample':
    'Example: https://hooks.acme.example/relay, subscribed to post.published, post.failed and connection.action_required.',
  'developer.ui.webhooks.create': 'एक समापनबिंदु जोड़ें',
  'developer.ui.webhooks.url': 'समापन बिंदु URL',
  'developer.ui.webhooks.urlHelp':
    'केवल HTTPS. हम किसी भी रीडायरेक्ट का पालन नहीं करते हैं और हम 2xx का पुनः प्रयास नहीं करते हैं।',
  'developer.ui.webhooks.eventsTitle': 'घटनाएँ',
  'developer.ui.webhooks.eventsHelp':
    'वे ईवेंट चुनें जिन्हें आप प्रबंधित करते हैं. हर चीज़ को एक ऐसे अंतिम बिंदु पर भेजना जो इसके अधिकांश भाग को नज़रअंदाज़ कर देता है, विफलताओं को देखना कठिन बना देता है।',
  'developer.ui.webhooks.eventsAll': 'हर घटना',
  'developer.ui.webhooks.eventsSelected': 'केवल वे इवेंट जिन्हें मैं चुनता हूं',
  'developer.ui.webhooks.eventsCount': '{count, plural, one {# event} other {# events}}',
  'developer.ui.webhooks.eventGroup.connections': 'कनेक्शन',
  'developer.ui.webhooks.eventGroup.content': 'सामग्री और अनुमोदन',
  'developer.ui.webhooks.eventGroup.publishing': 'प्रकाशन',
  'developer.ui.webhooks.eventGroup.automation': 'स्वचालन और फ़ीड',
  'developer.ui.webhooks.eventGroup.workspace': 'ZZZप्रोटेक्टेड10ZZZ',
  'developer.ui.webhooks.scopeTitle': 'Brands और खाते',
  'developer.ui.webhooks.scopeAll': 'प्रत्येक ब्रांड और खाता',
  'developer.ui.webhooks.scopeSelected': 'केवल वे ही जिन्हें मैं चुनता हूं',
  'developer.ui.webhooks.secretTitle': 'हस्ताक्षर करने का रहस्य',
  'developer.ui.webhooks.secretBody':
    'किसी बॉडी को पार्स करने से पहले हस्ताक्षर हेडर को सत्यापित करें। डिलीवरी आईडी पर डुप्लीकेट बनाएं, जो पुन: प्रयास के दौरान स्थिर रहता है।',
  'developer.ui.webhooks.secretRotateTitle': 'हस्ताक्षर रहस्य को घुमाएँ',
  'developer.ui.webhooks.secretRotateConsequence.overlap':
    'दोनों रहस्य 24 घंटों के लिए स्वीकार किए जाते हैं ताकि आप डिलीवरी को छोड़े बिना तैनात कर सकें।',
  'developer.ui.webhooks.secretRotateConsequence.after':
    'उस विंडो के बाद ही नये रहस्य का प्रयोग किया जाता है।',
  'developer.ui.webhooks.testDeliveryHelp':
    'परीक्षण के रूप में चिह्नित एक हस्ताक्षरित उदाहरण ईवेंट भेजता है, ताकि आपका प्राप्तकर्ता इसे सुरक्षित रूप से अनदेखा कर सके।',
  'developer.ui.webhooks.testDeliverySent':
    'परीक्षण वितरण भेजा गया. परिणाम नीचे लॉग में दिखाई देता है.',
  'developer.ui.webhooks.deliveriesCaption': 'हाल की डिलीवरी और प्रत्येक को मिली प्रतिक्रिया',
  'developer.ui.webhooks.deliveryColumn.time': 'अनुरोध किया',
  'developer.ui.webhooks.deliveryColumn.event': 'घटना',
  'developer.ui.webhooks.deliveryColumn.attempt': 'प्रयास',
  'developer.ui.webhooks.deliveryColumn.response': 'प्रतिक्रिया',
  'developer.ui.webhooks.deliveryColumn.status': 'स्थिति',
  'developer.ui.webhooks.deliveryStatus.pending': 'इंतज़ार कर रहा हूँ',
  'developer.ui.webhooks.deliveryStatus.succeeded': 'वितरित',
  'developer.ui.webhooks.deliveryStatus.failed': 'असफल, पुनः प्रयास करेंगे',
  'developer.ui.webhooks.deliveryStatus.exhausted': 'विफल, अब पुनः प्रयास नहीं',
  'developer.ui.webhooks.deliveryStatus.disabled': 'नहीं भेजा गया, समापन बिंदु अक्षम है',
  'developer.ui.webhooks.deliveryNoResponse': 'कोई प्रतिक्रिया नहीं मिली',
  'developer.ui.webhooks.deliveryNextAttempt': 'Next attempt {relativeTime}',
  'developer.ui.webhooks.inspect': 'डिलीवरी का निरीक्षण करें',
  'developer.ui.webhooks.inspectTitle': 'Delivery {id}',
  'developer.ui.webhooks.inspectRequest': 'निकाय से अनुरोध करें',
  'developer.ui.webhooks.inspectResponse': 'प्रतिक्रिया निकाय',
  'developer.ui.webhooks.redeliver': 'यह डिलीवरी दोबारा भेजें',
  'developer.ui.webhooks.redeliverHelp':
    'उसी ईवेंट आईडी को रिडिलीवरी फ़्लैग सेट के साथ दोबारा भेजा जाता है, इसलिए एक निष्क्रिय रिसीवर इसे सुरक्षित रूप से अनदेखा कर देता है।',
  'developer.ui.webhooks.redelivered': 'पुनर्वितरण के लिए कतारबद्ध।',
  'developer.ui.webhooks.failureTitle': 'यह समापन बिंदु विफल हो रहा है',
  'developer.ui.webhooks.failureBody':
    '{count, plural, one {# delivery in a row failed} other {# deliveries in a row failed}}. After {limit} consecutive failures the endpoint is disabled and an action item is filed.',
  'developer.ui.webhooks.disabledTitle':
    'बार-बार विफलताओं के बाद यह समापन बिंदु अक्षम कर दिया गया था',
  'developer.ui.webhooks.disabledBody':
    'हमने इसे भेजना बंद कर दिया ताकि आपकी कतार न भर जाए। रिसीवर को ठीक करें, एक परीक्षण डिलीवरी भेजें, फिर इसे फिर से सक्षम करें।',
  'developer.ui.webhooks.lastSuccessLabel': 'आखिरी सफलता',
  'developer.ui.webhooks.lastSuccessNever': 'कोई भी डिलीवरी कभी सफल नहीं हुई',
  'developer.ui.webhooks.deleteTitle': 'इस समापनबिंदु को हटाएँ',
  'developer.ui.webhooks.deleteConsequence.stop': 'इस URL पर और कुछ नहीं भेजा गया है।',
  'developer.ui.webhooks.deleteConsequence.logs':
    'डिलीवरी लॉग ऑडिट प्रतिधारण अवधि के लिए रखे जाते हैं।',

  /* ----------------------------------------------------------------- billing */

  'billing.ui.description':
    'एक योजना, दो अंतराल. पोलर रिकॉर्ड का व्यापारी है: यह भुगतान विधि रखता है, चालान जारी करता है और रद्दीकरण को संभालता है।',
  'billing.ui.statusHeading': 'वर्तमान स्थिति',
  'billing.ui.planHeading': 'योजना',
  'billing.ui.intervalHeading': 'बिलिंग अंतराल',
  'billing.ui.usageHeading': 'मीटर प्रदाता का उपयोग',
  'billing.ui.invoicesHeading': 'चालान',
  'billing.ui.cancelHeading': 'रद्दीकरण',
  'billing.ui.trialDaysRemaining':
    'Trial, {count, plural, =0 {ends today} one {# day remaining} other {# days remaining}}',
  'billing.ui.convertsOn': 'Converts on {date} to {amount} per {interval}.',
  'billing.ui.dueToday': '$0 आज देय है',
  'billing.ui.conversionLabel': 'परिवर्तित करता है',
  'billing.ui.channelsLabel': 'सक्रिय चैनल',
  'billing.ui.paymentMethodPolar': 'भुगतान विधि पोलर के पास है',
  'billing.ui.paymentMethodDescriptor': '{brand} ending {last4}, expires {expiry}',
  'billing.ui.paymentMethodMissing': 'फ़ाइल पर अभी तक कोई भुगतान विधि नहीं है',
  'billing.ui.cancelBeforeDate': 'Cancel before {date} and you will not be charged.',
  'billing.ui.annualFraming': 'सालाना $25/माह का बिल भेजा जाता है। $48/वर्ष बचाएं।',
  'billing.ui.monthlyOption': '$29 प्रति माह',
  'billing.ui.annualOption': '$300 प्रति वर्ष',
  'billing.ui.intervalChangeHelp':
    'अंतराल बदलना अगले नवीनीकरण पर प्रभावी होता है। पोलर इसकी पुष्टि करता है और आपके पुष्टि करने से पहले सटीक मात्रा दिखाता है।',
  'billing.ui.intervalChangedAnnouncement': 'Billing interval set to {interval}.',
  'billing.ui.allowanceChannels':
    '30 सक्रिय सामाजिक चैनल। एक चैनल एक जुड़ा हुआ खाता, पेज या चैनल है।',
  'billing.ui.allowanceChannelsUsage': '{used} of {limit} active channels',
  'billing.ui.allowanceFairUse':
    'उचित उपयोग का अर्थ है एंटी स्पैम, दर और प्रदाता लागत नियंत्रण। वे प्रत्येक ग्राहक पर समान तरीके से लागू होते हैं और प्रकाशित होते हैं, विवेकाधीन नहीं।',
  'billing.ui.allowanceMetered':
    'एक्स और कुछ अन्य प्रदाता प्रति ऑपरेशन शुल्क लेते हैं। वे शुल्क लागत पर लगाए जाते हैं और योजना मूल्य का हिस्सा नहीं होते हैं।',
  'billing.ui.allowanceNoMedia':
    'छवि निर्माण और वीडियो निर्माण शामिल नहीं हैं और बेचे नहीं जाते हैं। Relay मीडिया उत्पन्न नहीं करता है।',
  'billing.ui.readFairUse': 'उचित उपयोग नीति पढ़ें',
  'billing.ui.readMeteredPolicy': 'पढ़ें कि मीटर्ड उपयोग का बिल कैसे दिया जाता है',
  'billing.ui.usageCaption': 'मीटर प्रदाता द्वारा इस अवधि का उपयोग, लागत पर बिल किया गया',
  'billing.ui.usageColumn.item': 'वस्तु',
  'billing.ui.usageColumn.quantity': 'मात्रा',
  'billing.ui.usageColumn.unitPrice': 'इकाई मूल्य',
  'billing.ui.usageColumn.amount': 'रकम',
  'billing.ui.usageTotal': 'इस अवधि का कुल',
  'billing.ui.usagePeriod': 'Period {start} to {end}',
  'billing.ui.usageSource': 'Prices published by the provider. Verified {date}.',
  'billing.ui.usageReconciled': 'Reconciled against the provider invoice on {date}.',
  'billing.ui.usagePending': 'अभी तक समझौता नहीं हुआ है. अंतिम राशि थोड़ी बढ़ सकती है.',
  'billing.ui.usageUnavailableReason':
    'प्रदाता ने अभी तक इस अवधि का उपयोग वापस नहीं किया है। यह सामान्यतः 24 घंटे के भीतर उपलब्ध हो जाता है।',
  'billing.ui.usageEmpty': 'इस अवधि में कोई मीटरयुक्त उपयोग नहीं।',
  'billing.ui.spendAlert': 'सतर्क रहकर खर्च करें',
  'billing.ui.spendAlertHelp':
    'जब मीटर का उपयोग बिलिंग अवधि में इस राशि को पार कर जाता है तो हम आपको ईमेल करते हैं।',
  'billing.ui.spendAlertPause': 'अलर्ट पहुंचने पर मीटर की गई कार्रवाइयों को भी रोक दें',
  'billing.ui.balanceLabel': 'उपयोग संतुलन',
  'billing.ui.balanceHelp':
    'मीटर का उपयोग इस शेष राशि से लिया जाता है और पोलर द्वारा चालान किया जाता है।',
  'billing.ui.invoicesCaption': 'पोलर द्वारा जारी किए गए चालान',
  'billing.ui.invoiceColumn.date': 'दिनांक',
  'billing.ui.invoiceColumn.description': 'विवरण',
  'billing.ui.invoiceColumn.amount': 'रकम',
  'billing.ui.invoiceColumn.state': 'राज्य',
  'billing.ui.invoiceState.paid': 'भुगतान किया गया',
  'billing.ui.invoiceState.open': 'खुला',
  'billing.ui.invoiceState.uncollectible': 'एकत्र नहीं किया गया',
  'billing.ui.invoiceState.refunded': 'वापस कर दिया गया',
  'billing.ui.invoicesEmpty':
    'अभी तक कोई चालान नहीं. पहला तब जारी किया जाता है जब परीक्षण परिवर्तित हो जाता है।',
  'billing.ui.invoicesInPortal': 'प्रत्येक चालान और रसीद पोलर पोर्टल पर उपलब्ध है।',
  'billing.ui.portalHelp':
    'पोर्टल वह जगह है जहां आप भुगतान विधि बदलते हैं, चालान डाउनलोड करते हैं और रद्द करते हैं। यह एक नए टैब में खुलता है.',
  'billing.ui.pastDueHeading': 'भुगतान अतिदेय',
  'billing.ui.pastDueBody':
    'पिछला भुगतान नहीं हुआ. प्रकाशन जारी रखने के लिए पोलर पोर्टल में भुगतान विधि को अपडेट करें।',
  'billing.ui.gracePolicy':
    'Scheduled posts keep running until {date}. After that the workspace becomes read only: nothing is deleted and nothing is published.',
  'billing.ui.cancelBody':
    'रद्द करना एक कार्रवाई है और आपके द्वारा भुगतान की गई अवधि के अंत में प्रभावी होती है। न तो कोई कॉल करनी है और न ही कोई फॉर्म भरना है।',
  'billing.ui.cancelStart': 'सदस्यता रद्द करें',
  'billing.ui.cancelDialogTitle': 'यह सदस्यता रद्द करें',
  'billing.ui.cancelConsequence.noCharge':
    'You will not be charged. Nothing is taken today or on {date}.',
  'billing.ui.cancelConsequence.accessUntil': 'You keep every feature until {date}.',
  'billing.ui.cancelConsequence.dataKept':
    'ड्राफ्ट, रसीदें, मीडिया और विश्लेषण इस कार्यक्षेत्र में रहते हैं।',
  'billing.ui.cancelConsequence.scheduled':
    'Posts scheduled after {date} will not publish. Cancel or reschedule them before then.',
  'billing.ui.cancelConsequence.restart': 'आप किसी भी समय सदस्यता दोबारा शुरू कर सकते हैं.',
  'billing.ui.cancelConfirm': 'सदस्यता रद्द करें',
  'billing.ui.cancelKeep': 'सदस्यता बनाये रखें',
  'billing.ui.cancelConfirmedBeforeConversion': 'रद्द कर दिया गया. आपसे शुल्क नहीं लिया जाएगा.',
  'billing.ui.cancelConfirmedAfterConversion': 'Canceled. Access continues until {date}.',
  'billing.ui.cancelAnnouncement': 'सदस्यता रद्द कर दी गई.',
  'billing.ui.canceledNotice': 'यह सदस्यता रद्द कर दी गई है.',
  'billing.ui.resume': 'सदस्यता पुनः प्रारंभ करें',
  'billing.ui.noSubscriptionTitle': 'इस कार्यक्षेत्र पर कोई सदस्यता नहीं',
  'billing.ui.noSubscriptionBody':
    'प्रकाशित करने के लिए सात दिवसीय परीक्षण प्रारंभ करें. पोलर एक भुगतान विधि एकत्र करता है और आज कोई शुल्क नहीं लेता है।',
  'billing.ui.noSubscriptionExample':
    'मासिक $29 है. वार्षिक शुल्क $300 है, जिसका वार्षिक बिल $25/माह है। $48/वर्ष बचाएं।',
  'billing.ui.overChannelLimitAction': 'कनेक्टेड चैनलों की समीक्षा करें',

  /* ---------------------------------------------------------- growth advisor */

  'growth.ui.entryHelp':
    'एक संक्षिप्त विवरण का उत्तर दें, जो हमने समझा उसकी पुष्टि करें, और एक योजना प्राप्त करें जिसे आप आइटम दर आइटम स्वीकार कर सकें। यह कार्य प्रस्तावित करता है। यह कभी भी अपने आप कुछ भी शेड्यूल या प्रकाशित नहीं करता है।',
  'growth.ui.step.intake': 'सेवन',
  'growth.ui.step.confirm': 'पुष्टि करें',
  'growth.ui.step.plan': 'योजना',
  'growth.ui.stepIndicator': 'Step {current} of {total}: {name}',
  'growth.ui.intake.section.product': 'उत्पाद',
  'growth.ui.intake.section.audience': 'दर्शक और बाज़ार',
  'growth.ui.intake.section.objective': 'उद्देश्य',
  'growth.ui.intake.section.capacity': 'चैनल और क्षमता',
  'growth.ui.intake.section.limits': 'क्या सीमा से बाहर है',
  'growth.ui.intake.help':
    'यहां आपके लिए कुछ भी अनुमान नहीं लगाया गया है। जो कुछ भी आप खाली छोड़ देते हैं उसे भरे जाने के बजाय गायब के रूप में चिह्नित किया जाता है।',
  'growth.ui.intake.productNameHelp': 'वह नाम जो आप ग्राहकों के साथ उपयोग करते हैं.',
  'growth.ui.intake.siteUrlHelp':
    'हम वह पृष्ठ पढ़ते हैं जो आप हमें स्रोत सामग्री के रूप में देते हैं। आप हमारे द्वारा लिए गए प्रत्येक तथ्य की पुष्टि करते हैं।',
  'growth.ui.intake.descriptionHelp': 'आप क्या बेचते हैं और यह किसके लिए है, आपके अपने शब्दों में।',
  'growth.ui.intake.marketsHelp': 'देश या क्षेत्र. प्रति पंक्ति एक।',
  'growth.ui.intake.localesHelp': 'आप जिन भाषाओं में प्रकाशित करेंगे.',
  'growth.ui.intake.objectiveHelp': 'आप अगली तिमाही में और क्या चाहते हैं।',
  'growth.ui.intake.conversionHelp':
    'वह क्रिया जिसे आप वास्तव में माप सकते हैं. एक साइनअप, एक डेमो, एक खरीदारी।',
  'growth.ui.intake.proofHelp':
    'केस अध्ययन, आपके द्वारा चलाए गए बेंचमार्क, आपके पास मौजूद स्क्रीनशॉट, आपके पास पहले से मौजूद अनुमतियाँ। प्रति पंक्ति एक।',
  'growth.ui.intake.proofNone': 'मेरे पास अभी तक कोई स्वीकृत प्रमाण नहीं है',
  'growth.ui.intake.proofNoneEffect':
    'यह योजना ग्राहक परिणामों और परिणाम दावों से पूरी तरह बच जाएगी।',
  'growth.ui.intake.channelsHelp': 'वे खाते जिनसे आप पहले ही प्रकाशित कर चुके हैं.',
  'growth.ui.intake.capacityHelp': 'ईमानदार रहें. जिस योजना को आप चला नहीं सकते वह योजना नहीं है।',
  'growth.ui.intake.competitorsHelp': 'वैकल्पिक. प्रति पंक्ति एक।',
  'growth.ui.intake.prohibitedClaimsHelp':
    'कानूनी या नीतिगत कारणों से आप दावा नहीं कर सकते। प्रति पंक्ति एक।',
  'growth.ui.intake.prohibitedTopicsHelp': 'दूर रहने योग्य विषय. प्रति पंक्ति एक।',
  'growth.ui.intake.submit': 'हमने जो समझा उसकी समीक्षा करें',
  'growth.ui.intake.savedAnnouncement': 'व्यावसायिक प्रोफ़ाइल सहेजी गई.',
  'growth.ui.intake.requiredMissing': 'जारी रखने से पहले आवश्यक चिह्नित फ़ील्ड भरें।',

  'growth.ui.confirm.factsTitle': 'आपके द्वारा पुष्टि किये गये तथ्य',
  'growth.ui.confirm.factsHelp': 'इन्हें कॉपी में इस्तेमाल किया जा सकता है.',
  'growth.ui.confirm.assumptionsTitle': 'हमने जो धारणाएँ बनाईं',
  'growth.ui.confirm.assumptionsHelp':
    'ये तथ्य नहीं हैं. वे योजना को आकार देते हैं लेकिन वे कभी किसी पोस्ट में दावा नहीं बनते।',
  'growth.ui.confirm.missingTitle': 'लापता',
  'growth.ui.confirm.missingHelp':
    'योजना इनमें से प्रत्येक के आसपास काम करती है और जहां यह मायने रखती है वहां ऐसा कहती है।',
  'growth.ui.confirm.confidence.label': 'Confidence: {level}',
  'growth.ui.confirm.confidence.low': 'कम',
  'growth.ui.confirm.confidence.medium': 'मध्यम',
  'growth.ui.confirm.confidence.high': 'उच्च',
  'growth.ui.confirm.promote': 'तथ्य के रूप में पुष्टि करें',
  'growth.ui.confirm.correct': 'इसे ठीक करो',
  'growth.ui.confirm.correctLabel': 'आपका सुधार',
  'growth.ui.confirm.generate': 'योजना तैयार करें',
  'growth.ui.confirm.announcement': 'व्यावसायिक प्रोफ़ाइल की पुष्टि की गई.',

  'growth.ui.plan.generatingBody':
    'इसमें कुछ सेकंड लगते हैं. आप इस पृष्ठ को छोड़ सकते हैं: योजना अपने आप समाप्त हो जाती है।',
  'growth.ui.plan.stateDraft': 'ड्राफ्ट, स्वीकृत नहीं',
  'growth.ui.plan.stateApproved': 'स्वीकृत',
  'growth.ui.plan.stateSuperseded': 'एक नये संस्करण द्वारा प्रतिस्थापित',
  'growth.ui.plan.newVersionNotice':
    'A refresh creates version {version} and leaves the approved version untouched.',
  'growth.ui.plan.emptyTitle': 'अभी कोई योजना नहीं',
  'growth.ui.plan.emptyBody':
    'व्यवसाय प्रोफ़ाइल भरें और हम आपके द्वारा पुष्टि किए गए तथ्यों के आधार पर एक योजना बनाएंगे।',
  'growth.ui.plan.emptyExample':
    'एक योजना में एक रणनीति, चार सप्ताह की संक्षिप्त जानकारी, एक यूजीसी अभियान, कैटलॉग समर्थित अवसर और अधिकतम पांच टूल शामिल होते हैं।',
  'growth.ui.plan.tabsLabel': 'योजना अनुभाग',
  'growth.ui.plan.modelNote': 'Generated by {model}, prompt {promptVersion}, on {date}.',

  'growth.ui.strategy.snapshotTitle': 'बिजनेस स्नैपशॉट',
  'growth.ui.strategy.channelPriority': 'Priority {rank}',
  'growth.ui.strategy.channelFormats': 'मूल स्वरूप',
  'growth.ui.strategy.pillarProof': 'प्रमाण यह स्तंभ जिस पर टिका है',
  'growth.ui.strategy.pillarProofNone': 'कोई स्वीकृत प्रमाण नहीं. इस स्तम्भ को वर्णनात्मक रखें।',
  'growth.ui.strategy.cadenceCaption': 'चैनल द्वारा प्रति सप्ताह पोस्ट',
  'growth.ui.strategy.cadenceColumn.channel': 'चैनल',
  'growth.ui.strategy.cadenceColumn.perWeek': 'प्रति सप्ताह पोस्ट',
  'growth.ui.strategy.cadenceTotal': 'कुल प्रति सप्ताह',
  'growth.ui.strategy.capacityWarning':
    'This cadence is {planned} posts a week against a stated capacity of {capacity} hours. Reduce it or raise the capacity in the profile.',
  'growth.ui.strategy.measurementBody':
    'उसी चैनल और प्रारूप पर आपके अपने अनुगामी पोस्ट से तुलना की गई। किसी बाहरी बेंचमार्क का उपयोग नहीं किया जाता है, क्योंकि कोई भी आपके खाते से तुलनीय नहीं है।',
  'growth.ui.strategy.localeAdaptations': 'भाषा नोट्स',

  'growth.ui.fourWeek.caption': 'सप्ताह और दिन के अनुसार प्रस्तावित संक्षिप्त विवरण',
  'growth.ui.fourWeek.column.date': 'दिनांक',
  'growth.ui.fourWeek.column.channel': 'चैनल',
  'growth.ui.fourWeek.column.pillar': 'स्तंभ',
  'growth.ui.fourWeek.column.format': 'प्रारूप',
  'growth.ui.fourWeek.column.brief': 'संक्षिप्त',
  'growth.ui.fourWeek.column.cta': 'कार्रवाई हेतु आह्वान',
  'growth.ui.fourWeek.column.measurement': 'माप टैग',
  'growth.ui.fourWeek.column.actions': 'क्रियाएँ',
  'growth.ui.fourWeek.approvalRequired': 'इसे प्रकाशित करने से पहले अनुमोदन आवश्यक है',
  'growth.ui.fourWeek.approvalNotRequired': 'इस खाते के लिए किसी अनुमोदन की आवश्यकता नहीं है',
  'growth.ui.fourWeek.noCta': 'कार्रवाई के लिए कोई कॉल नहीं',
  'growth.ui.fourWeek.weekEmpty': 'इस सप्ताह के लिए कोई संक्षिप्त विवरण प्रस्तावित नहीं है।',
  'growth.ui.fourWeek.acceptedCount': '{accepted} of {total} briefs accepted as drafts',
  'growth.ui.fourWeek.acceptAnnouncement': 'इस संक्षिप्त विवरण से ड्राफ्ट तैयार किया गया।',
  'growth.ui.fourWeek.proposeAnnouncement': 'Calendar proposal added for {date}.',

  'growth.ui.ugc.promptAngle': 'Angle {number}',
  'growth.ui.ugc.checklistTitle': 'अधिकार, सहमति और प्रकटीकरण',
  'growth.ui.ugc.checklistHelp':
    'कुछ भी प्रकाशित होने से पहले प्रत्येक भागीदार के साथ इस पर काम करें। उपस्थित होने की सहमति विज्ञापन देने की सहमति नहीं है।',
  'growth.ui.ugc.incentiveNone': 'कोई प्रोत्साहन नहीं दिया गया',
  'growth.ui.ugc.incentiveDisclosure':
    'प्रत्येक पोस्ट पर आपके और प्रतिभागी द्वारा प्रोत्साहन का खुलासा किया जाना चाहिए।',
  'growth.ui.ugc.honesty':
    'यह आपके द्वारा वास्तविक लोगों के साथ चलाए जाने वाले अभियान की योजना है। Relay रचनाकारों को नहीं ढूंढता, उनसे संपर्क नहीं करता, प्रशंसापत्र नहीं लिखता या ग्राहक सामग्री नहीं बनाता।',

  'growth.ui.opportunities.caption': 'कैटलॉग से सत्यापित अवसर, आपकी प्रोफ़ाइल के अनुरूप क्रमबद्ध',
  'growth.ui.opportunities.column.opportunity': 'अवसर',
  'growth.ui.opportunities.column.type': 'प्रकार',
  'growth.ui.opportunities.column.audience': 'दर्शक',
  'growth.ui.opportunities.column.fit': 'ये क्यों फिट बैठता है',
  'growth.ui.opportunities.column.requirements': 'आवश्यकताएँ',
  'growth.ui.opportunities.column.rules': 'स्व-प्रचार नियम',
  'growth.ui.opportunities.column.cost': 'लागत',
  'growth.ui.opportunities.column.effort': 'प्रयास',
  'growth.ui.opportunities.column.verified': 'अंतिम बार सत्यापित',
  'growth.ui.opportunities.column.actions': 'क्रियाएँ',
  'growth.ui.opportunities.costFree': 'निःशुल्क',
  'growth.ui.opportunities.effort.low': 'नीचा',
  'growth.ui.opportunities.effort.medium': 'मध्यम',
  'growth.ui.opportunities.effort.high': 'ऊँचा',
  'growth.ui.opportunities.noRequiredAsset': 'किसी संपत्ति की आवश्यकता नहीं',
  'growth.ui.opportunities.prepareTitle': 'Prepare a submission for {name}',
  'growth.ui.opportunities.prepareRules': 'उनके नियम, उद्धृत',
  'growth.ui.opportunities.prepareChecklist': 'क्या तैयार रखना है',
  'growth.ui.opportunities.prepareManual':
    'आप इसे स्वयं उनकी साइट पर सबमिट करें। Relay फॉर्म नहीं भरता, खाता नहीं बनाता या किसी को ईमेल नहीं करता।',
  'growth.ui.opportunities.pitchTitle': 'पिच ड्राफ्ट',
  'growth.ui.opportunities.pitchHelp':
    'इसे भेजने से पहले इसे संपादित करें. यह केवल आपके द्वारा पुष्टि किये गये तथ्यों का उपयोग करता है।',
  'growth.ui.opportunities.submittedOn': 'Submitted {date}',
  'growth.ui.opportunities.staleTitle': 'कुछ प्रविष्टियों को पुनः सत्यापन की आवश्यकता है',
  'growth.ui.opportunities.staleBody':
    '{count, plural, one {# entry is past its review date} other {# entries are past their review date}}. Check the current rules on the site before you rely on them.',
  'growth.ui.opportunities.emptyExample':
    'एक कैटलॉग पंक्ति में आधिकारिक URL, दर्शक, साइट से उद्धृत सबमिशन नियम, लागत, प्रयास और किसी व्यक्ति द्वारा अंतिम बार इसकी जाँच करने की तारीख अंकित होती है।',

  'growth.ui.tools.shown': '{shown} of {max} shown',
  'growth.ui.tools.fewerThanMax':
    'Only {count, plural, one {# tool matches} other {# tools match}} this workflow with a current review. We would rather show fewer than pad the list.',
  'growth.ui.tools.emptyTitle':
    'अभी तक कोई भी समीक्षा किया गया टूल इस वर्कफ़्लो में फिट नहीं बैठता है',
  'growth.ui.tools.emptyBody':
    'प्रत्येक प्रविष्टि को यहां प्रदर्शित होने से पहले एक जाँच की गई कीमत, जाँच की गई अधिकार शर्तों और एक नामित सीमा की आवश्यकता होती है।',
  'growth.ui.tools.emptyExample':
    'एक प्रविष्टि बताती है कि यह किसके लिए सबसे अच्छा है, यह आपकी योजना में क्यों फिट बैठता है, यह क्या नहीं कर सकता है, इसके लिए आवश्यक कौशल, आउटपुट Relay में कैसे वापस आता है, और कीमत आखिरी बार कब जांची गई थी।',
  'growth.ui.tools.openSite': 'Open the official site for {name}',
  'growth.ui.tools.stale': 'इसकी समीक्षा तिथि बीत चुकी है. उत्पन्न योजनाओं से बाहर रखा गया.',

  'growth.ui.item.explainTitle': 'ऐसा क्यों सुझाया गया',
  'growth.ui.item.explainEvidence': 'यह किस पर आधारित है',
  'growth.ui.item.explainNoEvidence':
    'यह उद्देश्य और चैनल नियमों से आया है, न कि आपके व्यवसाय के बारे में किसी पुष्ट तथ्य से।',
  'growth.ui.item.dismissTitle': 'इस सुझाव को ख़ारिज करें',
  'growth.ui.item.dismissBody':
    'हमें बताओ क्यों. कारण योजना के साथ संग्रहीत होता है और अगले संस्करण को आकार देता है।',
  'growth.ui.item.dismissReasonLabel': 'कारण',
  'growth.ui.item.dismissReason.notRelevant': 'इस व्यवसाय से प्रासंगिक नहीं है',
  'growth.ui.item.dismissReason.noCapacity': 'हमारी क्षमता नहीं है',
  'growth.ui.item.dismissReason.wrongAudience': 'ग़लत दर्शक',
  'growth.ui.item.dismissReason.alreadyDone': 'हम पहले से ही ऐसा करते हैं',
  'growth.ui.item.dismissReason.policy': 'हमारी नीति या दावों के विरुद्ध',
  'growth.ui.item.dismissReason.other': 'कुछ और',
  'growth.ui.item.dismissNote': 'आप जो कुछ भी जोड़ना चाहते हैं',
  'growth.ui.item.dismissed': 'बर्खास्त. यह दृश्यमान रहता है इसलिए आप इसे पूर्ववत कर सकते हैं।',
  'growth.ui.item.undoDismiss': 'ख़ारिज पूर्ववत करें',

  'growth.ui.export.title': 'इस योजना को निर्यात करें',
  'growth.ui.export.formatLabel': 'प्रारूप',
  'growth.ui.export.copy': 'क्लिपबोर्ड पर कॉपी करें',
  'growth.ui.export.download': 'फ़ाइल डाउनलोड करें',
  'growth.ui.export.copied': 'योजना क्लिपबोर्ड पर कॉपी की गई.',
  'growth.ui.export.schemaNote':
    'All three formats come from one validated schema, version {version}. The structured views are safe for source control and contain no secrets.',
  'growth.ui.export.previewLabel': 'पूर्वावलोकन निर्यात करें',
} as const;
