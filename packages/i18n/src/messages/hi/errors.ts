/**
 * One entry per `RelayError` code.
 *
 * Every code has `error.<code>.message`, the sentence a person reads, and
 * `error.<code>.action`, what they can do next. Messages name the account or
 * the action. They never leak a provider payload, a token or an internal ID.
 */
export const errorMessages = {
  'error.unknown.message': 'कुछ ग़लत हुआ और हम उसका वर्गीकरण नहीं कर सके.',
  'error.unknown.action': 'पुनः प्रयास करें. यदि ऐसा होता रहता है, तो हमें नीचे संदर्भ भेजें।',
  'error.internal.message': 'यह हमारी ओर से समस्या है, आपकी सामग्री के साथ नहीं।',
  'error.internal.action':
    'आपका कार्य सहेजा गया है. हमें सतर्क कर दिया गया है. कुछ मिनटों में पुनः प्रयास करें.',
  'error.not_implemented.message': 'Post Array ने अभी तक इसे नहीं बनाया है।',
  'error.not_implemented.action': 'यह कब भेजा जाएगा इसके लिए चेंजलॉग का पालन करें।',
  'error.offline.message': 'आप ऑफ़लाइन हैं.',
  'error.offline.action':
    'आपका ड्राफ्ट इस डिवाइस पर रखा जाता है. कनेक्शन वापस आने पर प्रकाशन और शेड्यूलिंग फिर से शुरू करें।',
  'error.network_unreachable.message': 'हम सर्वर तक नहीं पहुंच सके.',
  'error.network_unreachable.action': 'अपना कनेक्शन जांचें और पुनः प्रयास करें। कुछ भी नहीं खोया.',
  'error.request_invalid.message': 'अनुरोध उस आकार का नहीं था जिसे हम स्वीकार कर सकें।',
  'error.request_invalid.action': 'नीचे सूचीबद्ध फ़ील्ड की जाँच करें और इसे दोबारा भेजें।',
  'error.validation_failed.message': 'इसे सहेजे जाने से पहले कुछ फ़ील्ड में बदलाव की आवश्यकता है.',
  'error.validation_failed.action': 'हाइलाइट किए गए फ़ील्ड ठीक करें.',
  'error.unauthenticated.message': 'ऐसा करने के लिए आपको साइन इन करना होगा.',
  'error.unauthenticated.action': 'साइन इन करें और हम आपको यहां वापस लाएंगे।',
  'error.session_expired.message': 'आपका सत्र समाप्त हो गया.',
  'error.session_expired.action': 'पुनः साइन इन करें. आपका ड्राफ्ट सहेजा गया है.',
  'error.mfa_required.message': 'इस कार्रवाई के लिए दो कारकों की पुष्टि की आवश्यकता है।',
  'error.mfa_required.action': 'जारी रखने के लिए अपने प्रमाणक ऐप से पुष्टि करें।',
  'error.forbidden.message': 'आपकी भूमिका इस कार्रवाई की अनुमति नहीं देती.',
  'error.forbidden.action': 'पहुंच के लिए इस कार्यक्षेत्र के स्वामी या व्यवस्थापक से पूछें।',
  'error.insufficient_scope.message': 'इस क्रेडेंशियल का दायरा नहीं है {scope}.',
  'error.insufficient_scope.action':
    'वह दायरा प्रदान करें या उस क्रेडेंशियल का उपयोग करें जो पहले से ही मौजूद है।',
  'error.workspace_not_found.message': 'वह कार्यक्षेत्र मौजूद नहीं है या आप सदस्य नहीं हैं।',
  'error.workspace_not_found.action': 'वह कार्यक्षेत्र चुनें जिससे आप संबंधित हैं।',
  'error.workspace_suspended.message': 'यह कार्यस्थान निलंबित है.',
  'error.workspace_suspended.action':
    'इसे हल करने के लिए सहायता से संपर्क करें. आपका डेटा बरकरार है.',
  'error.not_found.message': 'वह वस्तु अब मौजूद नहीं है.',
  'error.not_found.action': 'हो सकता है कि इसे हटा दिया गया हो. वापस जाएं और सूची ताज़ा करें.',
  'error.conflict.message': 'जब आप इस पर काम कर रहे थे तो किसी और ने इसे बदल दिया।',
  'error.conflict.action': 'दोनों संस्करणों की समीक्षा करें, फिर दोबारा सहेजें।',
  'error.idempotency_key_reused.message':
    'इस निष्क्रियता कुंजी का उपयोग पहले से ही एक अलग अनुरोध के लिए किया गया था।',
  'error.idempotency_key_reused.action': 'नई कुंजी का उपयोग करें, या बिल्कुल मूल अनुरोध दोहराएं।',
  'error.rate_limited.message': 'बहुत सारे अनुरोध.',
  'error.rate_limited.action': 'बाद में पुनः प्रयास करें {time}.',
  'error.quota_exceeded.message': 'यह कार्रवाई वर्तमान अवधि की सीमा से अधिक है.',
  'error.quota_exceeded.action': 'सीमा रीसेट हो जाती है {relativeTime}.',
  'error.payment_required.message': 'इस कार्यक्षेत्र में कोई सक्रिय सदस्यता नहीं है.',
  'error.payment_required.action':
    'पुनः प्रकाशित करने के लिए सदस्यता प्रारंभ करें. कुछ भी नहीं हटाया गया है.',
  'error.subscription_past_due.message': 'पिछला भुगतान नहीं हुआ.',
  'error.subscription_past_due.action': 'पोलर पोर्टल में भुगतान विधि को अपडेट करें।',
  'error.trial_expired.message': 'मुक़दमा ख़त्म हो गया {date}.',
  'error.trial_expired.action': 'प्रकाशन जारी रखने के लिए सदस्यता प्रारंभ करें.',
  'error.post_credits_exhausted.message':
    'इस वर्कस्पेस ने अपनी सभी मुफ़्त पोस्ट इस्तेमाल कर ली हैं। बाकी सब पहले जैसा काम कर रहा है।',
  'error.post_credits_exhausted.action':
    'प्रकाशित करते रहने के लिए कोई प्लान चुनें। आपके खाते जुड़े रहेंगे और आपके ड्राफ़्ट और शेड्यूल सुरक्षित रहेंगे।',
  'error.entitlement_missing.message': 'इस कार्यस्थान के पास उस सुविधा तक पहुंच नहीं है.',
  'error.entitlement_missing.action': 'बिलिंग सेटिंग जांचें, या सहायता से संपर्क करें।',
  'error.channel_limit_reached.message':
    'यह कार्यक्षेत्र पहले से ही सभी का उपयोग करता है {limit} सक्रिय चैनल.',
  'error.channel_limit_reached.action': 'किसी अन्य को जोड़ने से पहले एक चैनल को डिस्कनेक्ट करें।',
  'error.connection_not_found.message': 'वह कनेक्शन अब इस कार्यक्षेत्र में नहीं है.',
  'error.connection_not_found.action': 'खाते में प्रकाशन जारी रखने के लिए उसे फिर से कनेक्ट करें।',
  'error.connection_revoked.message': '{account} पर पहुंच रद्द कर दी गई {provider}.',
  'error.connection_revoked.action':
    'खाता पुनः कनेक्ट करें. अनुसूचित पोस्ट उसके बाद फिर से शुरू होती हैं।',
  'error.connection_expired.message': 'के लिए प्रवेश {account} समाप्त हो गया.',
  'error.connection_expired.action':
    'प्रकाशन और विश्लेषण को पुनर्स्थापित करने के लिए खाते को पुनः कनेक्ट करें।',
  'error.connection_paused.message': '{account} रुका हुआ है.',
  'error.connection_paused.action': 'जब आप तैयार हों तो कनेक्शंस से इसे फिर से शुरू करें।',
  'error.connection_permission_missing.message':
    '{account} ने ऐसा करने के लिए आवश्यक अनुमति नहीं दी है।',
  'error.connection_permission_missing.action':
    'पुनः कनेक्ट करें और स्वीकार करें {permission} सहमति स्क्रीन पर.',
  'error.connection_account_type_invalid.message':
    'Instagram को एक पेशेवर खाते की आवश्यकता है। {account} एक व्यक्तिगत खाता है.',
  'error.connection_account_type_invalid.action':
    'इसे Instagram ऐप में किसी बिजनेस या क्रिएटर अकाउंट में स्विच करें, फिर दोबारा कनेक्ट करें।',
  'error.connection_review_pending.message':
    '{provider} अभी भी इस ऐप की समीक्षा कर रहा है {account}.',
  'error.connection_review_pending.action':
    'समीक्षा पारित होने तक पोस्ट निजी तौर पर प्रकाशित की जाती हैं। जब भी यह बदलता है तो हम इस पेज को अपडेट कर देते हैं।',
  'error.capability_unsupported.message':
    '{provider} यह अपने आधिकारिक API के माध्यम से यह पेशकश नहीं करता है।',
  'error.capability_unsupported.action': 'उस प्रारूप का उपयोग करें जिसका यह खाता समर्थन करता है।',
  'error.capability_not_implemented.message':
    'Post Array ने इसे इसके लिए नहीं बनाया है {provider} अभी तक.',
  'error.capability_not_implemented.action':
    'क्षमता पृष्ठ सूचीबद्ध करता है कि प्रत्येक कनेक्टर आज क्या कर सकता है।',
  'error.capability_requires_review.message':
    '{provider} ऐप या खाते की समीक्षा करने के बाद ही यह अनुदान देता है।',
  'error.capability_requires_review.action':
    'यह तब तक अनुपलब्ध रहता है जब तक कि समीक्षा पारित नहीं हो जाती.',
  'error.content_invalid.message': '{provider} इस सामग्री को स्वीकार नहीं करेंगे {account}.',
  'error.content_invalid.action':
    'मुद्दे लक्ष्य पर सूचीबद्ध हैं. उन्हें ठीक करें और पुनः प्रयास करें.',
  'error.content_changed_after_approval.message': 'मंजूरी मिलने के बाद यह पद बदल गया।',
  'error.content_changed_after_approval.action':
    'प्रकाशित होने से पहले पुनः अनुमोदन का अनुरोध करें।',
  'error.duplicate_content.message':
    'बहुत समान सामग्री प्रकाशित की गई थी {account} {relativeTime}.',
  'error.duplicate_content.action':
    'पाठ बदलें, या इसे बाद में प्रकाशित करें। प्लेटफ़ॉर्म डुप्लिकेट पोस्ट को प्रतिबंधित करते हैं।',
  'error.cadence_limit_reached.message':
    '{account} इस कार्यक्षेत्र के लिए निर्धारित पोस्टिंग ताल तक पहुंच गया है।',
  'error.cadence_limit_reached.action': 'इसे बाद के स्लॉट के लिए शेड्यूल करें, या ताल सीमा बढ़ाएँ।',
  'error.media_invalid.message': 'इस फ़ाइल को प्रकाशित नहीं किया जा सकता {provider}.',
  'error.media_invalid.action': 'सटीक सीमा फ़ाइल के आगे दिखाई गई है.',
  'error.media_too_large.message': 'यह फ़ाइल इससे बड़ी है {provider} स्वीकार करता है.',
  'error.media_too_large.action': 'इसे संपीड़ित करें या छोटा संस्करण अपलोड करें। मूल रखा हुआ है.',
  'error.media_processing_failed.message': 'हम इस फ़ाइल को तैयार नहीं कर सके {provider}.',
  'error.media_processing_failed.action':
    'इसे दोबारा अपलोड करने का प्रयास करें, या किसी भिन्न प्रारूप का उपयोग करें।',
  'error.media_rights_undeclared.message': 'इस मीडिया के पास कोई अधिकार घोषणा नहीं है.',
  'error.media_rights_undeclared.action':
    'पुष्टि करें कि आपके पास इसे प्रकाशित करने का अधिकार है, जिसमें इसमें शामिल सभी लोग भी शामिल हैं।',
  'error.alt_text_required.message': 'इस छवि के लिए वैकल्पिक पाठ की आवश्यकता है {provider}.',
  'error.alt_text_required.action': 'छवि का वर्णन करें, या इसे सजावटी के रूप में चिह्नित करें।',
  'error.approval_required.message': 'इस कार्यक्षेत्र को प्रकाशन से पहले अनुमोदन की आवश्यकता है।',
  'error.approval_required.action': 'से अनुमोदन का अनुरोध करें {approver}.',
  'error.approval_expired.message': 'इस पद के लिए अनुमोदन समाप्त हो गया {date}.',
  'error.approval_expired.action': 'पुनः अनुमोदन का अनुरोध करें.',
  'error.schedule_in_past.message': 'वह समय पहले ही बीत चुका है {timeZone}.',
  'error.schedule_in_past.action': 'बाद का समय चुनें, या अभी प्रकाशित करें।',
  'error.schedule_conflict.message': '{account} अंदर पहले से ही एक पोस्ट है {duration} इस समय का.',
  'error.schedule_conflict.action':
    'उनमें से एक को स्थानांतरित करें, या यदि रिक्ति का इरादा है तो जारी रखें।',
  'error.time_zone_invalid.message': 'हम समय क्षेत्र को नहीं पहचानते {timeZone}.',
  'error.time_zone_invalid.action': 'सूची से एक क्षेत्र चुनें.',
  'error.destination_unavailable.message': 'गंतव्य {destination} पर अब उपलब्ध नहीं है {provider}.',
  'error.destination_unavailable.action': 'गंतव्य सूची को ताज़ा करें और दूसरा चुनें।',
  'error.mention_unresolved.message':
    'एक उल्लेख का वास्तविक से मिलान नहीं किया गया है {provider} खाता.',
  'error.mention_unresolved.action':
    'खाता खोजें और चुनें, या उल्लेख हटा दें। हम कभी भी नकली देशी टैग प्रकाशित नहीं करते।',
  'error.provider_transient.message': '{provider} अभी इस पर कार्रवाई नहीं की जा सकी.',
  'error.provider_transient.action':
    'हम स्वचालित रूप से पुनः प्रयास करेंगे. कुछ भी डुप्लिकेट नहीं है.',
  'error.provider_permanent.message':
    '{provider} इसे अस्वीकार कर दिया और पुनः प्रयास स्वीकार नहीं करेंगे।',
  'error.provider_permanent.action': 'रसीद पर स्वच्छ प्रतिक्रिया है।',
  'error.provider_rate_limited.message': '{provider} दर इस कार्यक्षेत्र को सीमित करती है।',
  'error.provider_rate_limited.action': 'हम बाद में पुनः प्रयास करेंगे {time}.',
  'error.provider_unavailable.message': '{provider} जवाब नहीं दे रहा है.',
  'error.provider_unavailable.action':
    'स्थिति पृष्ठ जांचें. शेड्यूल किए गए पोस्ट पुनः प्रयास करते रहते हैं.',
  'error.provider_content_rejected.message':
    '{provider} अपनी नीतियों के तहत इस सामग्री को अस्वीकार कर दिया।',
  'error.provider_content_rejected.action':
    'इसका कारण रसीद पर बताया गया है। सामग्री संपादित करें या इसके साथ अपील करें {provider}.',
  'error.user_action_required.message': '{account} प्रकाशित होने से पहले इसे आपसे कुछ चाहिए।',
  'error.user_action_required.action': 'क्या गायब है यह देखने के लिए कनेक्शन खोलें।',
  'error.short_link_destination_blocked.message': 'उस मंजिल को छोटा नहीं किया जा सकता.',
  'error.short_link_destination_blocked.action':
    'निजी नेटवर्क, असुरक्षित योजनाएं और ज्ञात अपमानजनक गंतव्य अवरुद्ध हैं।',
  'error.short_link_domain_unverified.message': 'डोमेन {domain} अभी तक सत्यापित नहीं हुआ है.',
  'error.short_link_domain_unverified.action':
    'सेटिंग्स में दिखाया गया DNS रिकॉर्ड जोड़ें, फिर सत्यापित करें।',
  'error.rss_feed_invalid.message': 'उस URL ने वैध RSS या एटम फ़ीड नहीं लौटाया।',
  'error.rss_feed_invalid.action':
    'पता जांचें. हम इसे सुरक्षित रूप से लाते हैं और किसी भी निजी रीडायरेक्ट का पालन नहीं करते हैं।',
  'error.webhook_signature_invalid.message': 'उस वेबहुक पर हस्ताक्षर सत्यापित नहीं हुआ।',
  'error.webhook_signature_invalid.action':
    'जांचें कि प्रेषक वर्तमान हस्ताक्षर रहस्य का उपयोग करता है। पेलोड संसाधित नहीं किया गया था.',
  'error.webhook_delivery_failed.message': 'को डिलीवरी {endpoint} विफल.',
  'error.webhook_delivery_failed.action':
    'हम बैकऑफ़ के साथ पुनः प्रयास करते हैं। डिलीवरी लॉग में प्रतिक्रिया है.',
  'error.automation_rule_not_permitted.message':
    'वह नियम प्लेटफ़ॉर्म नियम को तोड़ देगा, इसलिए इसे नहीं बनाया जा सकता है।',
  'error.automation_rule_not_permitted.action':
    'स्वचालित लाइक, फ़ॉलो, अनचाहे उत्तर और डुप्लिकेट सामूहिक पोस्टिंग कभी उपलब्ध नहीं होती हैं।',
  'error.ai_unavailable.message': 'लेखन सहायक अभी उपलब्ध नहीं है.',
  'error.ai_unavailable.action': 'आपका पाठ अछूता है. शीघ्र ही पुनः प्रयास करें.',
  'error.ai_output_invalid.message': 'सहायक ने कुछ ऐसा लौटाया जिसे हम सत्यापित नहीं कर सके।',
  'error.ai_output_invalid.action': 'आपके ड्राफ्ट पर कुछ भी लागू नहीं किया गया. पुनः प्रयास करें।',
  'error.ai_budget_exceeded.message': 'यह कार्यक्षेत्र अभी अपनी सहायक सीमा तक पहुंच गया है।',
  'error.ai_budget_exceeded.action':
    'सीमा रीसेट हो जाती है {relativeTime}. हाथ से लिखना अभी भी काम करता है।',
  'error.storage_unavailable.message': 'हम मीडिया संग्रहण तक नहीं पहुंच सके.',
  'error.storage_unavailable.action':
    'आपका टेक्स्ट सहेजा गया है. थोड़ी देर में दोबारा अपलोड करने का प्रयास करें.',
  'error.export_unavailable.message': 'वह निर्यात नहीं हो सका.',
  'error.export_unavailable.action': 'छोटी रेंज आज़माएं, या संदर्भ के साथ समर्थन से संपर्क करें।',

  'error.reference': 'संदर्भ {correlationId}',
  'error.reportToSupport': 'समर्थन के लिए इसे भेजें',
  'error.contentPreserved': 'आपकी सामग्री संरक्षित है. कुछ भी प्रकाशित नहीं हुआ.',
} as const;
