/**
 * Billing, trial and plan copy.
 *
 * Several strings here are mandated word for word by the research and by the
 * launch acceptance checklist. Do not soften or restyle them:
 *  - `billing.trial.dueToday` must read "$0 due today".
 *  - `billing.plan.annualFraming` must state the saving in currency, never a
 *    percentage discount.
 *  - `billing.mediaGeneration.explanation` is the approved boundary paragraph.
 *    Tool Radar and the pricing page use this same key.
 */
export const billingMessages = {
  'billing.title': 'बिलिंग',
  'billing.plan.name': 'ZZZप्रोटेक्टेड12ZZZ',
  'billing.plan.single': 'एक योजना. हर सुविधा. कोई स्तर नहीं.',
  'billing.plan.monthlyPrice': '$29/माह',
  'billing.plan.annualPrice': '$300/वर्ष',
  'billing.plan.annualFraming': 'सालाना $25/माह का बिल भेजा जाता है। $48/वर्ष बचाएं।',
  'billing.plan.interval.monthly': 'मासिक',
  'billing.plan.interval.annual': 'वार्षिक',
  'billing.plan.selectInterval': 'एक बिलिंग अंतराल चुनें',
  'billing.plan.includes.title': 'क्या शामिल है',
  'billing.plan.includes.channels': '30 सक्रिय सोशल चैनल तक',
  'billing.plan.includes.members': 'असीमित टीम के सदस्य',
  'billing.plan.includes.posts': 'उचित उपयोग के अंतर्गत असीमित ड्राफ्ट और अनुसूचित पोस्ट',
  'billing.plan.includes.connectors': 'प्रत्येक स्वीकृत कनेक्टर',
  'billing.plan.includes.analytics':
    'जिस दिन से आप खाता जोड़ते हैं उसी दिन से एनालिटिक्स रखा जाता है',
  'billing.plan.includes.api': 'REST API, रिमोट MCP सर्वर, CLI और वेबहुक',
  'billing.plan.includes.automation': 'स्वचालन नियम, आरएसएस ऑटोपोस्ट और ट्रैक किए गए लिंक',
  'billing.plan.includes.ai': 'दुरुपयोग और लागत सीमा के तहत डीपसीक टेक्स्ट सहायता',
  'billing.plan.includes.support': 'ईमेल और ऐप समर्थन में',
  'billing.plan.fairUse':
    'उचित उपयोग का अर्थ है एंटी स्पैम, दर और प्रदाता लागत नियंत्रण जो आपके खातों की सुरक्षा करते हैं। वे प्रत्येक ग्राहक के लिए समान रूप से कार्य करते हैं।',

  'billing.trial.dueToday': '$0 आज देय है',
  'billing.trial.paymentMethodRequired':
    'पोलर अभी एक भुगतान विधि एकत्र करता है और आज कोई शुल्क नहीं लेता है।',
  'billing.trial.firstCharge': 'पहला आरोप {amount} पर {date}',
  'billing.trial.renewal': 'नवीनीकरण {amount} प्रत्येक {interval} उसके बाद',
  'billing.trial.cancelBefore':
    'इस तिथि से पहले सेटिंग्स में रद्द करें और आपसे शुल्क नहीं लिया जाएगा।',
  'billing.trial.reminder': 'परीक्षण में परिवर्तित होने से तीन दिन पहले पोलर आपको ईमेल करता है।',
  'billing.trial.daysRemaining':
    '{count, plural, =0 {ट्रायल आज ख़त्म हो रहा है} one {परीक्षण, # दिन शेष} other {परीक्षण, # दिन शेष हैं}}',
  'billing.trial.converted': 'आपका परीक्षण चालू हो गया {date}.',
  'billing.trial.canceled': 'आपका परीक्षण रद्द कर दिया गया है. आपसे शुल्क नहीं लिया जाएगा.',
  'billing.trial.abusePrevention':
    'बार-बार परीक्षण सीमित हैं। यदि इस खाते के लिए परीक्षण उपलब्ध नहीं है, तो सहायता से संपर्क करें।',

  'billing.checkout.open': 'चेकआउट करना जारी रखें',
  'billing.checkout.hostedBy':
    'चेकआउट और चालान का प्रबंधन हमारे रिकॉर्ड विक्रेता पोलर द्वारा किया जाता है।',
  'billing.checkout.taxNote':
    'पोलर लागू होने वाले किसी भी बिक्री कर या वैट को एकत्र करता है और जमा करता है।',
  'billing.checkout.notEntitledYet':
    'पोलर द्वारा सदस्यता की पुष्टि करने के बाद हम एक्सेस प्रदान करते हैं, ब्राउज़र रीडायरेक्ट से नहीं। इसमें आमतौर पर कुछ सेकंड लगते हैं.',
  'billing.checkout.returning': 'पोलर के साथ आपकी सदस्यता की पुष्टि की जा रही है',

  'billing.subscription.status.trialing': 'परीक्षण',
  'billing.subscription.status.active': 'सक्रिय',
  'billing.subscription.status.pastDue': 'भुगतान अतिदेय',
  'billing.subscription.status.canceled': 'रद्द कर दिया गया',
  'billing.subscription.status.unpaid': 'अवैतनिक',
  'billing.subscription.status.none': 'कोई सदस्यता नहीं',
  'billing.subscription.renewsOn': 'नवीनीकरण {amount} पर {date}',
  'billing.subscription.endsOn': 'तक पहुंच जारी है {date}',
  'billing.subscription.pastDueBody':
    'पिछला भुगतान नहीं हुआ. प्रकाशन जारी रखने के लिए भुगतान विधि अपडेट करें. अनुग्रह अवधि के बाद कार्यक्षेत्र केवल पढ़ने योग्य हो जाता है और निर्धारित पोस्ट रुक जाती हैं।',
  'billing.subscription.readOnly':
    'यह कार्यक्षेत्र केवल पढ़ने योग्य है. आपकी सामग्री, रसीदें और कनेक्शन बरकरार हैं।',
  'billing.subscription.portal': 'पोलर ग्राहक पोर्टल खोलें',
  'billing.subscription.invoices': 'चालान',
  'billing.subscription.paymentMethod': 'भुगतान विधि',
  'billing.subscription.managedByPolar': 'पोलर द्वारा प्रबंधित',

  'billing.cancel.title': 'अपनी सदस्यता रद्द करें',
  'billing.cancel.beforeTrialEnd':
    'अभी रद्द करें और आपसे शुल्क नहीं लिया जाएगा। आप हर सुविधा को तब तक बनाए रखें {date}.',
  'billing.cancel.afterTrial':
    'आप तक पहुंच बनाए रखें {date}. इसके समाप्त होने पर कुछ भी नहीं हटाया जाता है।',
  'billing.cancel.confirm': 'सदस्यता रद्द करें',
  'billing.cancel.confirmed': 'रद्द कर दिया गया. आपसे शुल्क नहीं लिया जाएगा.',
  'billing.cancel.keepData': 'आपके ड्राफ्ट, रसीदें और विश्लेषण इस कार्यक्षेत्र में रहते हैं।',

  'billing.usage.title': 'उपयोग',
  'billing.usage.meteredNote':
    'कुछ प्रदाता लागतें लागत के रूप में पारित की जाती हैं क्योंकि प्रदाता प्रति ऑपरेशन शुल्क लेता है।',
  'billing.usage.xCharges':
    'प्रत्येक पोस्ट के लिए एक्स शुल्क। जिन पोस्टों में URL होता है उनकी कीमत सादे टेक्स्ट से अधिक होती है।',
  'billing.usage.balance': 'उपयोग संतुलन {amount}',
  'billing.usage.estimatedBeforeAction': 'इस कार्रवाई का अनुमान है {amount}.',
  'billing.usage.periodTotal': '{amount} तब से उपयोग किया जाता है {date}',
  'billing.usage.noMediaCredits':
    'कोई छवि या वीडियो निर्माण क्रेडिट नहीं है, क्योंकि Post Array मीडिया उत्पन्न नहीं करता है।',

  'billing.downgrade.overLimit':
    'इस कार्यक्षेत्र में है {count, plural, one {# चैनल} other {# चैनल}} सीमा से अधिक. उन चैनलों पर नई कार्रवाइयां अवरुद्ध हैं. आपके लिए कुछ भी डिस्कनेक्ट नहीं है.',

  'billing.mediaGeneration.title': 'हम चित्र या वीडियो क्यों नहीं बनाते?',
  'billing.mediaGeneration.explanation':
    'हम आपको योजना बनाने, अनुमोदन करने, प्रकाशित करने और सीखने में मदद करने पर ध्यान केंद्रित करते हैं। हम V1 में चित्र या वीडियो उत्पन्न नहीं करते हैं क्योंकि ब्रांड-तैयार मीडिया को एक संक्षिप्त संकेत से अधिक की आवश्यकता होती है: इसे आपके संपूर्ण दृश्य सिस्टम, सटीक उत्पाद विवरण, लाइसेंस प्राप्त संपत्ति, लोगों और उपयोग की अनुमतियों और सावधानीपूर्वक समीक्षा की आवश्यकता होती है। रचनात्मक मॉडल भी तेजी से बदलते हैं। हम वर्तमान में सत्यापित विशेषज्ञ टूल की अनुशंसा करते हैं और रचनात्मक नियंत्रण बनाए रखते हुए उनके तैयार काम को अपने अभियानों में लाना आसान बनाते हैं।',

  'billing.referral.title': 'रेफरल',
  'billing.referral.disclosure':
    'जहाँ भी आप रेफरल लिंक साझा करते हैं, उनका खुलासा अवश्य किया जाना चाहिए। आयोग कभी भी सकारात्मक समीक्षा पर सशर्त नहीं होता।',
  'billing.referral.link': 'आपका रेफरल लिंक',
  'billing.referral.attributed':
    '{count, plural, one {# जिम्मेदार साइनअप} other {# जिम्मेदार साइनअप}}',
  'billing.referral.commissionPending': 'लंबित, रिफंड विंडो बंद होने तक रोके रखा जाता है',
  'billing.referral.commissionApproved': 'स्वीकृत',
  'billing.referral.commissionReversed': 'धनवापसी के बाद उलट दिया गया',
  'billing.referral.payout': 'भुगतान चलता है {schedule}.',
} as const;
