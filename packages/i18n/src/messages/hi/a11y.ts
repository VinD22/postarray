/**
 * Screen reader announcements and accessible names.
 *
 * These are read aloud, not shown. Keep them short, factual and in the order a
 * listener needs them. Live region announcements must not repeat decoration.
 */
export const a11yMessages = {
  'a11y.region.navigation': 'प्राथमिक नेविगेशन',
  'a11y.region.main': 'मुख्य सामग्री',
  'a11y.region.composer': 'Composer',
  'a11y.region.preview': 'पूर्वावलोकन',
  'a11y.region.validation': 'सत्यापन मुद्दे',
  'a11y.region.targets': 'लक्ष्य खाते',
  'a11y.region.notifications': 'सूचनाएं',

  'a11y.announce.saved': 'ड्राफ्ट सहेजा गया',
  'a11y.announce.saving': 'ड्राफ्ट सहेजा जा रहा है',
  'a11y.announce.saveFailed': 'ड्राफ्ट सहेजा नहीं जा सका. आपका पाठ अभी भी यहाँ है.',
  'a11y.announce.offline': 'आप ऑफ़लाइन हैं. इस डिवाइस पर परिवर्तन रखे जाते हैं.',
  'a11y.announce.online': 'वापस ऑनलाइन',
  'a11y.announce.validationCount':
    '{count, plural, =0 {कोई सत्यापन समस्या नहीं} one {# सत्यापन समस्या} other {# सत्यापन समस्याएँ}}',
  'a11y.announce.validationCleared': 'सभी सत्यापन मुद्दे हल हो गए',
  'a11y.announce.targetSelected':
    '{account} अंक। {count, plural, one {# लक्ष्य} other {# लक्ष्य को}} कुल मिलाकर।',
  'a11y.announce.targetOverridden': '{account} अब यह अपना संस्करण है',
  'a11y.announce.targetReset': '{account} मास्टर ड्राफ्ट पर निवेश करें',
  'a11y.announce.uploadProgress': '{name}, {percent} अपलोड किया गया',
  'a11y.announce.uploadComplete': '{name} अपलोड किया गया',
  'a11y.announce.uploadFailed': '{name} अपलोड करने में विफलता',
  'a11y.announce.scheduled': 'के लिए योजना बनाई गई {time} में {timeZone}',
  'a11y.announce.rescheduled': 'पर चला गया {time} में {timeZone}',
  'a11y.announce.publishing': 'प्रकाशन',
  'a11y.announce.published':
    '{count, plural, one {को प्रकाशित किया गया है # ख} other {को प्रकाशित किया गया है # हिसाब किताब}}',
  'a11y.announce.publishPartial':
    'को प्रकाशित किया गया है {published} का {total} हिसाब किताब। {failed, plural, one {# ध्यान देने की जरुरत है} other {# अनुवाद पर ध्यान देने की आवश्यकता है}}.',
  'a11y.announce.publishFailed': 'प्रकाशन विफल. आपकी सामग्री संरक्षित है.',
  'a11y.announce.approvalRequested': 'से मंज़ूरी की पेशकश की गई है {approver}',
  'a11y.announce.approved': 'स्वीकृत',
  'a11y.announce.connectionAdded': '{account} जुड़े हुए',
  'a11y.announce.connectionRemoved': '{account} यह किया गया',
  'a11y.announce.filterApplied':
    '{count, plural, =0 {पूर्व स्पष्ट कर दिये गये} one {# फैक्टर लागू किया गया} other {# फैक्टर लागू किया गया}}, {results, plural, one {# परिणाम} other {# परिणाम}}',
  'a11y.announce.pageChanged': '{title}',
  'a11y.announce.copiedToClipboard': 'क्लिपबोर्ड पर कॉपी किया गया',
  'a11y.announce.suggestionApplied': 'सुझाव लागू किया गया',
  'a11y.announce.suggestionRejected': 'सुझाव अस्वीकृत',

  'a11y.label.closeDialog': 'संवाद बंद करें',
  'a11y.label.openMenu': 'मेनू खोलें',
  'a11y.label.sortBy': 'इसके अनुसार क्रमबद्ध करें {field}',
  'a11y.label.sortAscending': 'आरोही क्रम में क्रमबद्ध',
  'a11y.label.sortDescending': 'अवरोही क्रमबद्ध',
  'a11y.label.removeTarget': 'न {account} लक्ष्य से',
  'a11y.label.removeMedia': 'न {name}',
  'a11y.label.editAltText': 'के लिए वैकल्पिक पाठ्यचर्या लागू करें {name}',
  'a11y.label.mediaPreview': 'का ध्यान {name}',
  'a11y.label.playVideo': 'खेल {name}',
  'a11y.label.pauseVideo': 'अन्य {name}',
  'a11y.label.calendarCell':
    '{date}, {count, plural, =0 {कुछ भी सेट नहीं है} one {# डाक} other {# उत्तर}}',
  'a11y.label.postSummary': '{account} पर {provider}, {state}, {time}',
  'a11y.label.characterCount': '{used} का {limit} सहायक अक्षर',
  'a11y.label.requiredField': 'आवश्यक',
  'a11y.label.externalLink': 'एक नए टैब में खुलता है',
  'a11y.label.loadingRegion': 'सामग्री लोड हो रही है',
  'a11y.label.expandRow': 'के लिए विवरण दिखाएँ {name}',
  'a11y.label.collapseRow': 'के लिए विवरण छिपाएँ {name}',
  'a11y.languagePicker.label': 'इंटरफ़ेस भाषा चुनें',
  'a11y.languagePicker.filterLabel': 'भाषाएँ फ़िल्टर करें',
  'a11y.languagePicker.announceChanged': 'भाषा को बदल दिया गया {language}',

  'a11y.keyboard.hint.calendar':
    'स्लॉट के बीच जाने के लिए तीर कुंजियों का उपयोग करें। पोस्ट खोलने के लिए Enter दबाएँ. पुन: शेड्यूल करने के लिए स्पेस दबाएँ और फिर तीर कुंजियाँ दबाएँ।',
  'a11y.keyboard.hint.composer':
    'लक्ष्यों के बीच जाने के लिए कंट्रोल और ब्रैकेट कुंजियाँ दबाएँ। अगले अंक पर जाने के लिए कंट्रोल और आई दबाएँ।',
  'a11y.keyboard.hint.dialog': 'बंद करने के लिए एस्केप दबाएँ।',
  'a11y.keyboard.shortcutsTitle': 'कीबोर्ड शॉर्टकट',

  'a11y.table.alternative': 'तालिका दृश्य',
  'a11y.table.alternativeHint': 'क्रमबद्ध तालिका के समान शेड्यूल।',
  'a11y.motion.reduced': 'आपके सिस्टम सेटिंग के कारण एनिमेशन कम हो गए हैं।',
} as const;
