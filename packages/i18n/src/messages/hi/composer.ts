/** Composer: master draft, per target overrides, previews, validation, cost. */
export const composerMessages = {
  'composer.title': 'रचना',
  'composer.titleWithProject': 'के लिए लिखें {project}',
  'composer.master.label': 'मास्टर ड्राफ्ट',
  'composer.master.description':
    'एक बार यहाँ लिखें. संगत परिवर्तन प्रत्येक चयनित लक्ष्य तक पहुंचते हैं। केवल उस खाते को प्राप्त होने वाला संस्करण लिखने के लिए एक लक्ष्य खोलें।',
  'composer.master.globalEdit': 'वैश्विक संपादन',
  'composer.master.placeholder': 'आप क्या प्रकाशित करना चाहते हैं?',
  'composer.brief.label': 'संक्षिप्त',
  'composer.brief.placeholder': 'विचार, श्रोतागण और आप जो परिणाम चाहते हैं उसका वर्णन करें।',
  'composer.sources.label': 'स्रोत संदर्भ',
  'composer.sources.empty': 'कोई स्रोत संलग्न नहीं है.',
  'composer.campaign.label': 'अभियान',
  'composer.campaign.none': 'कोई अभियान नहीं',
  'composer.contentLocale.label': 'सामग्री भाषा',
  'composer.contentLocale.help': 'पोस्ट की भाषा. यह आपकी इंटरफ़ेस भाषा से अलग है.',
  'composer.market.label': 'श्रोता बाज़ार',

  'composer.targets.title': 'लक्ष्य',
  'composer.targets.count': '{count, plural, =0 {कोई खाता चयनित नहीं} one {# खाता} other {# खाते}}',
  'composer.targets.publishSummary':
    '{count, plural, one {इसे प्रकाशित किया जाएगा # खाता} other {इसे प्रकाशित किया जाएगा # खाते}} {when, select, now {अभी} scheduled {निर्धारित समय पर} other {}}',
  'composer.targets.add': 'खाते जोड़ें',
  'composer.targets.empty': 'प्रकाशित करने के लिए कम से कम एक खाता चुनें.',
  'composer.targets.state.ready': 'तैयार',
  'composer.targets.state.inherited': 'गुरु से विरासत में मिला',
  'composer.targets.state.overridden': 'ओवरराइड किया गया',
  'composer.targets.state.warning': 'प्रकाशन से पहले जाँच लें',
  'composer.targets.state.error': 'समाधान की आवश्यकता है',
  'composer.targets.state.approvalNeeded': 'अनुमोदन की आवश्यकता है',
  'composer.targets.overrideBadge': 'ओवरराइड',
  'composer.targets.resetConfirm.title': 'इस लक्ष्य को मास्टर ड्राफ्ट पर रीसेट करें?',
  'composer.targets.resetConfirm.body':
    'आपके द्वारा बदली गई कॉपी, मीडिया और सेटिंग्स {account} मास्टर ड्राफ्ट द्वारा प्रतिस्थापित किया जाएगा। अन्य लक्ष्य प्रभावित नहीं होते.',
  'composer.targets.divergence':
    '{count, plural, one {# लक्ष्य मास्टर ड्राफ्ट से भिन्न है} other {# लक्ष्य मास्टर ड्राफ्ट से भिन्न हैं}}',

  'composer.applyToAll.title': 'सभी लक्ष्यों पर लागू करें',
  'composer.applyToAll.compatible':
    '{count, plural, one {# फ़ील्ड प्रत्येक चयनित लक्ष्य के अनुकूल है} other {# फ़ील्ड प्रत्येक चयनित लक्ष्य के साथ संगत हैं}}',
  'composer.applyToAll.incompatible':
    '{count, plural, one {# फ़ील्ड लागू नहीं किया जा सकता और लक्ष्य के अनुसार ही रहता है} other {# फ़ील्ड लागू नहीं किए जा सकते और प्रति लक्ष्य बने रहते हैं}}',
  'composer.applyToAll.creates': 'लागू करने से प्रत्येक लक्ष्य के लिए एक स्पष्ट संस्करण बनता है।',

  'composer.editor.label': 'पाठ पोस्ट करें',
  'composer.editor.characterCount': '{used} का {limit} अक्षर',
  'composer.editor.characterCountOver': '{over} के ऊपर अक्षर {limit} चरित्र सीमा',
  'composer.editor.characterCountUnknown': 'इस खाते के लिए वर्ण सीमा अनुपलब्ध है',
  'composer.editor.remaining': '{count, plural, one {# चरित्र छोड़ दिया} other {# पात्र बचे}}',
  'composer.editor.hashtagCount': '{count, plural, one {# हैशटैग} other {# हैशटैग}}',
  'composer.editor.formatting': 'स्वरूपण',
  'composer.editor.emoji': 'इमोजी',
  'composer.editor.mention': 'उल्लेख करें',
  'composer.editor.link': 'लिंक',

  'composer.mentions.search': 'लोगों, पेजों और कंपनियों को खोजें',
  'composer.mentions.searching': 'खोज रहे हैं {provider}',
  'composer.mentions.resolved': 'टैग किया गया {label} पर {provider}',
  'composer.mentions.unresolved':
    'इस उल्लेख का मिलान a से नहीं किया गया है {provider} खाता अभी तक. जब तक आप कोई परिणाम नहीं चुन लेते, यह सादे पाठ के रूप में प्रकाशित होगा।',
  'composer.mentions.noResults': 'कोई मेल खाता खाता चालू नहीं {provider}.',
  'composer.mentions.unsupported': 'इस खाते के लिए मूल टैगिंग उपलब्ध नहीं है.',

  'composer.destination.label': 'गंतव्य',
  'composer.destination.placeholder': 'चुनें कि यह कहां प्रकाशित होता है',
  'composer.destination.community': 'समुदाय',
  'composer.destination.board': 'बोर्ड',
  'composer.destination.group': 'समूह',
  'composer.destination.page': 'पेज',
  'composer.destination.organization': 'संगठन',
  'composer.destination.channel': 'चैनल',
  'composer.destination.refresh': 'गंतव्यों को ताज़ा करें',
  'composer.destination.lastRefreshed': 'गंतव्य ताज़ा हो गए {relativeTime}',

  'composer.media.title': 'मीडिया',
  'composer.media.count': '{count, plural, one {# फ़ाइल} other {# फ़ाइलें}}',
  'composer.media.dropHint': 'फ़ाइलें यहां खींचें या अपनी लाइब्रेरी ब्राउज़ करें.',
  'composer.media.inheritFromMaster': 'मास्टर मीडिया का उपयोग करना',
  'composer.media.overridden': 'यह लक्ष्य अपने स्वयं के मीडिया का उपयोग करता है',
  'composer.media.altText.label': 'वैकल्पिक पाठ',
  'composer.media.altText.placeholder':
    'स्क्रीन रीडर का उपयोग करने वाले लोगों के लिए छवि का वर्णन करें।',
  'composer.media.altText.missing': 'ऑल्ट टेक्स्ट गायब है.',
  'composer.media.altText.waive': 'इस छवि को वैकल्पिक पाठ की आवश्यकता नहीं है',
  'composer.media.altText.generate': 'वैकल्पिक पाठ लिखें',
  'composer.media.crop': 'फसल',
  'composer.media.resize': 'आकार बदलें',
  'composer.media.rotate': 'घुमाएँ',
  'composer.media.compress': 'संपीड़ित करें',
  'composer.media.convertFormat': 'प्रारूप परिवर्तित करें',
  'composer.media.thumbnail': 'थंबनेल',
  'composer.media.aspectPreset': 'प्लेटफ़ॉर्म प्रीसेट',
  'composer.media.original': 'मौलिक',
  'composer.media.originalPreserved': 'मूल फ़ाइल रखी गई है. संपादन एक नया संस्करण बनाते हैं.',
  'composer.media.uploading': 'अपलोड हो रहा है {name}',
  'composer.media.processing': 'तैयारी {name}',
  'composer.media.rights.label': 'अधिकार और सहमति',
  'composer.media.rights.confirm':
    'मेरे पास इस मीडिया को प्रकाशित करने का अधिकार है, जिसमें इसमें शामिल सभी लोग, संगीत, लोगो और ब्रांड शामिल हैं।',

  'composer.sequence.title': 'टिप्पणियाँ और सूत्र',
  'composer.sequence.root': 'मुख्य पोस्ट',
  'composer.sequence.item': 'वस्तु {position}',
  'composer.sequence.add': 'टिप्पणी या थ्रेड आइटम जोड़ें',
  'composer.sequence.delayLabel': 'पिछले आइटम के बाद विलंब',
  'composer.sequence.delayImmediate': 'तुरंत',
  'composer.sequence.delayMinutes': '{count, plural, one {# मिनट} other {# मिनट}}',
  'composer.sequence.delayCustom': 'कस्टम विलंब',
  'composer.sequence.accountLabel': 'इस आइटम को इस रूप में प्रकाशित करें',
  'composer.sequence.unsupported': 'यह खाता निर्धारित अनुवर्ती आइटमों का समर्थन नहीं करता है.',

  'composer.repeat.title': 'दोहराएँ',
  'composer.repeat.off': 'दोहराना मत',
  'composer.repeat.everyDays': '{count, plural, one {हर दिन} other {हर # दिन}}',
  'composer.repeat.endLabel': 'दोहराना बंद करो',
  'composer.repeat.endOnDate': 'डेट पर',
  'composer.repeat.endAfterCount': 'कई पोस्ट के बाद',
  'composer.repeat.endRequired': 'एक समाप्ति तिथि या कई दोहराव चुनें।',
  'composer.repeat.summary':
    'दोहराता है {cadence} जब तक {end}. प्रत्येक घटना को अपनी स्वीकृति और रसीद मिलती है।',

  'composer.links.title': 'कड़ियाँ',
  'composer.links.keepOriginal': 'मूल URL रखें',
  'composer.links.track': 'ट्रैक किए गए संक्षिप्त लिंक से बदलें',
  'composer.links.utm': 'यूटीएम पैरामीटर',
  'composer.links.domain': 'डोमेन लिंक करें',
  'composer.links.finalUrl': 'इसे इस रूप में प्रकाशित किया जाएगा {url}',
  'composer.links.frozenAtApproval':
    'सटीक संक्षिप्त URL और गंतव्य अनुमोदित संस्करण में जमे हुए हैं।',

  'composer.signature.title': 'हस्ताक्षर',
  'composer.signature.none': 'कोई हस्ताक्षर नहीं',
  'composer.signature.autoApplied':
    'हस्ताक्षर {name} स्वचालित रूप से जोड़ा गया था. आप इसे बदल सकते हैं.',

  'composer.set.title': 'सेट',
  'composer.set.startFrom': 'एक सेट से शुरू करें',
  'composer.set.continueWithout': 'सेट के बिना जारी रखें',
  'composer.set.applied': 'लागू सेट {name}. यह ड्राफ्ट अब सेट से स्वतंत्र है।',

  'composer.validation.title': 'मान्यता',
  'composer.validation.clean': 'चयनित लक्ष्यों के लिए कोई समस्या नहीं मिली.',
  'composer.validation.issueCount':
    '{count, plural, one {# मुद्दा} other {# मुद्दे}} पार {targets, plural, one {# लक्ष्य} other {# लक्ष्य}}',
  'composer.validation.blocking': 'इसे शेड्यूल करने से पहले तय किया जाना चाहिए.',
  'composer.validation.warning': 'प्रकाशन से पहले इसे जांचें.',
  'composer.validation.revalidated':
    'वर्तमान प्लेटफ़ॉर्म सीमाओं के विरुद्ध पुनः जाँच की गई {relativeTime}.',

  'composer.preview.title': 'पूर्वावलोकन',
  'composer.preview.forAccount': 'के लिए पूर्वावलोकन करें {account} पर {provider}',
  'composer.preview.approximate':
    'यह पूर्वावलोकन हमारे द्वारा रिकॉर्ड किए गए प्लेटफ़ॉर्म नियमों का उपयोग करता है। यदि प्लेटफ़ॉर्म बदलता है तो प्रकाशित पोस्ट भिन्न हो सकती है।',
  'composer.preview.unavailable': 'इस खाते के लिए वास्तविक पूर्वावलोकन अभी तक उपलब्ध नहीं है.',

  'composer.cost.title': 'अनुमानित प्रदाता लागत',
  'composer.cost.estimate': '{provider} अनुमान {amount} इस पोस्ट के लिए API का उपयोग।',
  'composer.cost.linkSurcharge':
    '{provider} उन पोस्ट के लिए अधिक शुल्क लिया जाता है जिनमें URL शामिल होता है। लिंक हटाने से अनुमान कम हो जाता है.',
  'composer.cost.bulkWarning':
    '{count, plural, one {# प्रकाशन} other {# प्रकाशन}} एक क्रिया में. जारी रखने से पहले अनुमान की समीक्षा करें.',
  'composer.cost.reconciled': 'प्रकाशन के बाद वास्तविक उपयोग का मिलान किया जाता है।',
  'composer.cost.none': 'इस पोस्ट के लिए कोई मीटर प्रदाता शुल्क नहीं।',

  'composer.autosave.saving': 'सहेजा जा रहा है',
  'composer.autosave.saved': 'सहेजा गया {relativeTime}',
  'composer.autosave.offline': 'ऑफ़लाइन. आपका ड्राफ्ट इस डिवाइस पर रखा जाएगा और सिंक हो जाएगा।',
  'composer.autosave.conflict':
    '{name} जब आप लिख रहे थे तब इस मसौदे को संपादित किया। सहेजने से पहले दोनों संस्करणों की समीक्षा करें.',
  'composer.autosave.failed': 'सहेजा नहीं जा सका. आपका पाठ अभी भी यहाँ है. पुनः प्रयास कर रहा हूँ.',

  'composer.ai.title': 'सहायता करें',
  'composer.ai.makeConcise': 'और अधिक संक्षिप्त करें',
  'composer.ai.adaptForPlatform': 'के लिए अनुकूलित करें {provider}',
  'composer.ai.transcreate': 'को ट्रांसक्रिएट करें {language}',
  'composer.ai.checkClaims': 'दावों की जाँच करें',
  'composer.ai.writeAltText': 'वैकल्पिक पाठ लिखें',
  'composer.ai.suggestHooks': 'हुक सुझाएँ',
  'composer.ai.suggestCta': 'कार्रवाई हेतु कॉल का सुझाव दें',
  'composer.ai.diffTitle': 'प्रस्तावित परिवर्तन',
  'composer.ai.diffHelp': 'जब तक आप इसे स्वीकार नहीं करते तब तक कुछ भी नहीं बदलता।',
  'composer.ai.working': 'इस पर काम कर रहे हैं',
  'composer.ai.sources':
    'पर आधारित {count, plural, one {# स्रोत} other {# स्रोत}} आपने मंजूरी दे दी',
  'composer.ai.uncertain':
    'इस वाक्यांश का कोई शुद्ध समकक्ष नहीं है {language}. प्रकाशन से पहले किसी देशी वक्ता से इसकी समीक्षा करें।',

  'composer.schedule.title': 'अनुसूची',
  'composer.schedule.dateLabel': 'दिनांक',
  'composer.schedule.timeLabel': 'समय',
  'composer.schedule.timeZoneLabel': 'समय क्षेत्र',
  'composer.schedule.nextFreeSlot': 'अगला मुफ़्त स्लॉट',
  'composer.schedule.localAndUtc': '{local} में {timeZone}. {utc} यूटीसी.',
  'composer.schedule.dstWarning':
    'घड़ियाँ बदल जाती हैं {timeZone} इस तारीख को. यह पोस्ट चलती है {local}, जो है {utc} यूटीसी.',
  'composer.schedule.pastWarning': 'वह समय बीत चुका है. बाद का समय चुनें.',
  'composer.schedule.confirmTitle': 'शेड्यूल करने से पहले पुष्टि करें',
  'composer.schedule.confirmPublishNow': 'अभी प्रकाशित करने से पहले पुष्टि करें',
  'composer.schedule.approverLabel': 'अनुमोदनकर्ता',
  'composer.schedule.policyLabel': 'अनुमोदन नीति',
  'composer.schedule.duplicateWarning':
    'इसी तरह की सामग्री प्रकाशित की गई थी {account} {relativeTime}. इसे दोबारा प्रकाशित करने से डुप्लिकेट सामग्री पर प्लेटफ़ॉर्म नियमों का उल्लंघन हो सकता है।',
  'composer.schedule.cadenceWarning':
    '{account} पहले से ही है {count, plural, one {# पोस्ट} other {# पोस्ट}} उस दिन निर्धारित.',
} as const;
