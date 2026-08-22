/** Connections, provider capabilities and connection health. */
export const connectionMessages = {
  'connection.title': 'कनेक्शन',
  'connection.subtitle': 'वे खाते, पेज और चैनल जिन पर यह कार्यक्षेत्र प्रकाशित कर सकता है।',
  'connection.add': 'एक खाता कनेक्ट करें',
  'connection.count': '{used, plural, one {# सक्रिय चैनल} other {# सक्रिय चैनल}} का {limit}',
  'connection.limitReached':
    'यह कार्यक्षेत्र सभी का उपयोग कर रहा है {limit} चैनल. दूसरे को जोड़ने से पहले एक को डिस्कनेक्ट करें।',

  'connection.account.label': 'खाता',
  'connection.account.type.profile': 'प्रोफाइल',
  'connection.account.type.page': 'पेज',
  'connection.account.type.channel': 'चैनल',
  'connection.account.type.group': 'समूह',
  'connection.account.type.organization': 'संगठन',
  'connection.account.type.business': 'व्यवसाय खाता',
  'connection.account.type.creator': 'निर्माता खाता',
  'connection.connectedBy': 'से जुड़ा हुआ है {name} पर {date}',
  'connection.lastPublished': 'अंतिम प्रकाशित {relativeTime}',
  'connection.lastPublishedNever': 'इस खाते से अभी तक कुछ भी प्रकाशित नहीं हुआ है',
  'connection.lastAnalyticsSync': 'एनालिटिक्स सिंक हो गया {relativeTime}',

  'connection.status.healthy': 'कार्य करना',
  'connection.status.expiringSoon': 'समय-सीमा समाप्त {relativeTime}',
  'connection.status.expired': 'प्रवेश समाप्त हो गया',
  'connection.status.revoked': 'प्रवेश रद्द कर दिया गया',
  'connection.status.paused': 'रुका हुआ',
  'connection.status.permissionMissing': 'अनुमति अनुपलब्ध',
  'connection.status.reviewPending': 'प्लेटफ़ॉर्म समीक्षा की प्रतीक्षा है',
  'connection.status.unknown': 'स्वास्थ्य अनुपलब्ध',

  'connection.token.expiresAt': 'प्रवेश समाप्त हो रहा है {date}',
  'connection.token.expiryUnknown': '{provider} हमें यह नहीं बताता कि यह पहुंच कब समाप्त होगी।',

  'connection.permissions.title': 'अनुमतियाँ',
  'connection.permissions.granted': 'मान लिया',
  'connection.permissions.missing': 'नहीं दिया गया',
  'connection.permissions.explainBeforeOAuth':
    'Relay पूछेगा {provider} इन अनुमतियों के लिए. आप किसी भी समय डिस्कनेक्ट कर सकते हैं.',
  'connection.permissions.whyNeeded': 'इसकी आवश्यकता क्यों है',

  'connection.reconnect.title': 'रिकनेक्ट {account}',
  'connection.reconnect.body':
    'इस खाते के लिए शेड्यूल किए गए पोस्ट तब तक होल्ड पर हैं जब तक यह दोबारा कनेक्ट न हो जाए। कुछ भी नहीं खोया है.',
  'connection.disconnect.title': 'डिस्कनेक्ट करें {account}?',
  'connection.disconnect.body':
    'इस खाते के लिए निर्धारित पोस्ट प्रकाशित नहीं की जाएंगी. पहले से एकत्र की गई रसीदें और विश्लेषण इस कार्यक्षेत्र में रहते हैं।',
  'connection.pause.body':
    'एक रुका हुआ खाता अपना इतिहास और उसका शेड्यूल रखता है, लेकिन तब तक प्रकाशित नहीं होता जब तक आप इसे फिर से शुरू नहीं करते।',

  'connection.incident.invalidToken':
    '{provider} के लिए संग्रहीत पहुँच को अस्वीकृत कर दिया {account}. प्रकाशन पुनर्स्थापित करने के लिए पुनः कनेक्ट करें.',
  'connection.incident.permissionLost':
    '{account} अब अनुदान नहीं {permission}. पुनः कनेक्ट करें और उस अनुमति को स्वीकार करें।',
  'connection.incident.roleLost':
    'आपका {provider} उपयोगकर्ता की अब कोई भूमिका नहीं है {account}. उस पेज के व्यवस्थापक से इसे पुनर्स्थापित करने के लिए कहें।',
  'connection.incident.accountTypeInvalid':
    'Instagram को एक पेशेवर खाते की आवश्यकता है। स्विच करें {account} किसी व्यवसाय या निर्माता खाते से, फिर पुनः कनेक्ट करें।',
  'connection.incident.reviewRestricted':
    '{provider} ने इस ऐप को समीक्षा लंबित रहने तक प्रतिबंधित कर दिया है। से पोस्ट {account} समीक्षा पूरी होने तक निजी तौर पर प्रकाशित करें।',

  'connection.group.title': 'ग्राहक समूह',
  'connection.group.description':
    'प्रत्येक स्क्रीन को फ़िल्टर करने के लिए क्लाइंट या परियोजना के अनुसार समूह खाते।',
  'connection.group.assign': 'समूह में ले जाएँ',
  'connection.group.none': 'असमूहीकृत',
  'connection.group.moveNote':
    'किसी खाते को स्थानांतरित करने से उसके पोस्ट, रसीदें और विश्लेषण बने रहते हैं।',

  'connection.oauth.starting': 'प्रारंभिक {provider}',
  'connection.oauth.returned': 'कनेक्शन ख़त्म करना',
  'connection.oauth.chooseAccounts': 'चुनें कि कौन से खाते कनेक्ट करने हैं',
  'connection.oauth.connectSelected': 'Connect selected accounts',
  'connection.oauth.claimComplete': 'Selected accounts are connected',
  'connection.oauth.accountUnavailable': 'This account cannot be connected',
  'connection.oauth.noEligibleAccounts':
    'इस पर कोई हिसाब नहीं {provider} लॉगिन कनेक्ट किया जा सकता है. {reason}',
  'connection.oauth.canceled': 'पर कनेक्शन रद्द कर दिया गया {provider}. कुछ भी नहीं बदला।',
  'connection.oauth.alreadyConnected': '{account} इस कार्यक्षेत्र से पहले से ही जुड़ा हुआ है.',
  'connection.oauth.connectedToAnotherWorkspace':
    '{account} दूसरे कार्यक्षेत्र से जुड़ा है. पहले इसे वहां से डिस्कनेक्ट करें.',

  'capability.title': 'यह खाता किसका समर्थन करता है',
  'capability.matrix.title': 'प्लेटफ़ॉर्म क्षमताएँ',
  'capability.matrix.subtitle':
    'कनेक्टर परिभाषाओं से उत्पन्न हम हाथ से बनाए रखते हैं और समीक्षा करते हैं।',
  'capability.level.supported': 'समर्थित',
  'capability.level.unsupported': 'मंच द्वारा प्रस्तुत नहीं किया गया',
  'capability.level.not_implemented': 'अभी तक नहीं बना',
  'capability.level.requires_review': 'मंच समीक्षा की जरूरत है',
  'capability.level.beta': 'बीटा',
  'capability.level.unknown': 'अनुपलब्ध',
  'capability.explain.supported': 'Relay आज इस खाते के लिए ऐसा कर सकता है।',
  'capability.explain.unsupported':
    '{provider} यह अपने आधिकारिक API के माध्यम से इसकी पेशकश नहीं करता है, इसलिए कोई भी उपकरण इसे सुरक्षित रूप से नहीं कर सकता है।',
  'capability.explain.not_implemented':
    '{provider} यह ऑफ़र करता है, लेकिन Relay ने इसे अभी तक नहीं बनाया है। यह कनेक्टर रोडमैप पर है.',
  'capability.explain.requires_review':
    '{provider} ऐप या खाते की समीक्षा करने के बाद ही यह अनुदान देता है। यह तब तक अनुपलब्ध रहता है जब तक कि समीक्षा पारित नहीं हो जाती.',
  'capability.explain.beta':
    'यह उन सीमाओं के साथ काम करता है जिनका हमने सत्यापन करना समाप्त नहीं किया है। इस पर भरोसा करने से पहले परिणाम की जांच कर लें।',
  'capability.explain.unknown':
    'हम इस खाते के लिए वर्तमान अनुमतियाँ नहीं पढ़ सके. उन्हें ताज़ा करने के लिए पुनः कनेक्ट करें.',
  'capability.lastChecked': 'चेक किए गए {relativeTime}',
  'capability.feature.text': 'टेक्स्ट पोस्ट',
  'capability.feature.image': 'छवियाँ',
  'capability.feature.carousel': 'हिंडोला',
  'capability.feature.video': 'वीडियो',
  'capability.feature.document': 'दस्तावेज़',
  'capability.feature.firstComment': 'पहली टिप्पणी शेड्यूल की गई',
  'capability.feature.thread': 'Threads',
  'capability.feature.mentions': 'मूलनिवासी उल्लेख',
  'capability.feature.destinations': 'गंतव्य चयन',
  'capability.feature.privacy': 'गोपनीयता नियंत्रण',
  'capability.feature.thumbnail': 'कस्टम थंबनेल',
  'capability.feature.altText': 'वैकल्पिक पाठ',
  'capability.feature.analytics': 'विश्लेषिकी',
  'capability.feature.delete': 'प्रकाशित पोस्ट हटाएँ',
  'capability.feature.commentCount': 'टिप्पणी मायने रखती है',
  'capability.feature.commentReplies': 'टिप्पणियाँ पढ़ना और उनका उत्तर देना',
  'capability.feature.disclosure': 'स्वचालन प्रकटीकरण',
} as const;
