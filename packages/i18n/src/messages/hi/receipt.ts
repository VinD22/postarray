/** Publication receipt: the immutable record of what actually happened. */
export const receiptMessages = {
  'receipt.title': 'प्रकाशन रसीद',
  'receipt.subtitle': 'वास्तव में क्या, कहां, कब और किसकी मंजूरी पर प्रकाशित किया गया था।',
  'receipt.target': '{account} पर {provider}',
  'receipt.externalId': 'बाहरी पोस्ट आईडी',
  'receipt.permalink': 'स्थायी लिंक',
  'receipt.permalinkUnavailable': '{provider} इस पोस्ट प्रकार के लिए पर्मलिंक नहीं लौटाता।',
  'receipt.contentVersion': 'सामग्री संस्करण',
  'receipt.contentHash': 'सामग्री चेकसम',
  'receipt.mediaVersion': 'मीडिया संस्करण',
  'receipt.idempotencyKey': 'नपुंसकता संदर्भ',
  'receipt.correlationId': 'सहसंबंध संदर्भ',

  'receipt.surface.label': 'से बनाया गया',
  'receipt.surface.web': 'वेब ऐप',
  'receipt.surface.api': 'ZZZप्रोटेक्टेड19ZZZ ZZZप्रोटेक्टेड14ZZZ',
  'receipt.surface.mcp': 'MCP सर्वर',
  'receipt.surface.cli': 'ZZZप्रोटेक्टेड16ZZZ',
  'receipt.surface.rss': 'आरएसएस ऑटोपोस्ट',
  'receipt.surface.automation': 'स्वचालन नियम',
  'receipt.surface.webhook': 'इनबाउंड वेबहुक',

  'receipt.actor.user': '{name}',
  'receipt.actor.serviceAccount': 'सेवा खाता {name}',
  'receipt.actor.oauthApp': '{app} के लिए अभिनय {name}',
  'receipt.actor.system': 'ZZZप्रोटेक्टेड12ZZZ',

  'receipt.timeline.title': 'समयरेखा',
  'receipt.timeline.created': 'ड्राफ्ट द्वारा बनाया गया {actor}',
  'receipt.timeline.approvalRequested': 'से अनुमोदन का अनुरोध किया गया है {approver}',
  'receipt.timeline.approved': 'द्वारा अनुमोदित {actor} नीति के तहत {policy}',
  'receipt.timeline.scheduled': 'के लिए शेड्यूल किया गया {local} में {timeZone}',
  'receipt.timeline.revalidated': 'क्रेडेंशियल्स और प्लेटफ़ॉर्म सीमाओं की दोबारा जाँच की गई',
  'receipt.timeline.mediaPrepared':
    '{count, plural, one {# प्लेटफ़ॉर्म के लिए फ़ाइल तैयार की गई} other {# प्लेटफ़ॉर्म के लिए फ़ाइलें तैयार की गईं}}',
  'receipt.timeline.dispatched': 'को भेजा {provider}',
  'receipt.timeline.providerAccepted': '{provider} पद स्वीकार कर लिया',
  'receipt.timeline.providerProcessing': '{provider} अभी भी मीडिया पर कार्रवाई हो रही है',
  'receipt.timeline.published': 'के रूप में प्रकाशित किया गया {externalId}',
  'receipt.timeline.commentPublished': 'आइटम का अनुसरण करें {position} प्रकाशित',
  'receipt.timeline.retryScheduled': 'पुनः प्रयास करें {attempt} के लिए निर्धारित {time}',
  'receipt.timeline.failed': 'प्रयास {attempt} विफल',
  'receipt.timeline.canceled': 'द्वारा रद्द कर दिया गया {actor}',
  'receipt.timeline.analyticsSynced': 'एनालिटिक्स सिंक हो गया',
  'receipt.timeline.deletedExternally': 'पोस्ट अब चालू नहीं है {provider}',

  'receipt.times.scheduled': 'निर्धारित समय',
  'receipt.times.dispatched': 'प्रेषण समय',
  'receipt.times.published': 'प्रकाशित करने का समय',
  'receipt.times.latency': 'भेजा गया {duration} निर्धारित समय के बाद.',

  'receipt.attempts.title': 'प्रयास',
  'receipt.attempts.count': '{count, plural, one {# प्रयास} other {# प्रयास}}',
  'receipt.attempts.classification': 'वर्गीकरण',
  'receipt.attempts.providerResponse': 'प्रदाता प्रतिक्रिया',
  'receipt.attempts.responseRedacted':
    'प्रदाता की प्रतिक्रिया को टोकन और व्यक्तिगत डेटा को हटाकर संग्रहीत किया जाता है।',
  'receipt.attempts.remediation': 'आगे क्या करना है',

  'receipt.cost.estimated': 'अनुमानित {amount}',
  'receipt.cost.actual': 'मेल मिलाप {amount}',
  'receipt.cost.pending': 'वास्तविक उपयोग का अभी तक समाधान नहीं हुआ है।',

  'receipt.partial.title': 'आंशिक रूप से प्रकाशित',
  'receipt.partial.body':
    '{published, plural, one {# लक्ष्य प्रकाशित} other {# लक्ष्य प्रकाशित}}. {failed, plural, one {# लक्ष्य विफल} other {# लक्ष्य विफल रहे}}. प्रकाशित पोस्ट अभी भी प्लेटफ़ॉर्म पर मौजूद हैं।',
  'receipt.partial.doNotRollback':
    'हम पहले से प्रकाशित किसी पोस्ट को नहीं हटाते. यदि आप यही चाहते हैं तो इसे प्लेटफ़ॉर्म पर हटा दें।',

  'receipt.export.title': 'इस रसीद को साझा करें',
  'receipt.export.pdf': 'पीडीएफ के रूप में डाउनलोड करें',
  'receipt.export.json': 'JSON के रूप में डाउनलोड करें',
  'receipt.export.permissionNote': 'केवल स्वामी, व्यवस्थापक और अनुमोदक ही रसीद साझा कर सकते हैं।',

  'receipt.analytics.lastSync': 'एनालिटिक्स अंतिम बार समन्वयित हुआ {relativeTime}.',
  'receipt.analytics.nextSync': 'अगला सिंक चारों ओर {time}.',
} as const;
