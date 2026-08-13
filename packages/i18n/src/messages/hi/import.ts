export const importMessages = {
  'import.title': 'CSV से पोस्ट आयात करें',
  'import.subtitle':
    'एक स्प्रेडशीट अपलोड करें, पढ़ें कि यह क्या करेगी, फिर निर्णय लें। अपलोड करना केवल फ़ाइल की जांच करता है। इससे कुछ भी नहीं बनता।',

  'import.step.upload': 'अपलोड करें',
  'import.step.columns': 'कॉलम',
  'import.step.review': 'समीक्षा करें',
  'import.step.apply': 'लागू करें',
  'import.step.results': 'परिणाम',
  'import.step.position': 'चरण {current} / {total}',

  'import.upload.heading': 'एक CSV फ़ाइल चुनें',
  'import.upload.help':
    'केवल CSV। .xlsx जैसी स्प्रेडशीट फ़ाइलें नहीं पढ़ी जातीं। पहले अपनी शीट को CSV के रूप में निर्यात करें।',
  'import.upload.field': 'CSV फ़ाइल',
  'import.upload.fieldHelp': 'एक फ़ाइल चुनें, या नीचे बॉक्स में पंक्तियां पेस्ट करें।',
  'import.upload.paste': 'या CSV टेक्स्ट पेस्ट करें',
  'import.upload.pasteHelp': 'हेडर पंक्ति शामिल करें। कुछ भी बनाए जाने से पहले सब कुछ जांचा जाता है।',
  'import.upload.project': 'प्रोजेक्ट',
  'import.upload.projectHelp': 'एक फ़ाइल में हर पंक्ति इसी प्रोजेक्ट से संबंधित है।',
  'import.upload.submit': 'इस फ़ाइल की जांच करें',
  'import.upload.submitting': 'फ़ाइल पढ़ी जा रही है',
  'import.upload.allowPast': 'बीत चुके समय की अनुमति दें',
  'import.upload.allowPastHelp':
    'डिफ़ॉल्ट रूप से बंद। अतीत की तारीख वाली पंक्ति की रिपोर्ट दी जाती है ताकि आप इसे स्वयं ठीक कर सकें, इसे स्वतः स्थानांतरित नहीं किया जाता।',
  'import.upload.tooLarge': 'वह फ़ाइल {limit} अक्षरों से बड़ी है। इसे विभाजित करें और फिर से कोशिश करें।',
  'import.upload.duplicate':
    'यह वही फ़ाइल है जिसे आपने पहले अपलोड किया था, इसलिए आप इसकी दूसरी प्रति के बजाय वही आयात देख रहे हैं।',

  'import.template.heading': 'कॉलम का मतलब',
  'import.template.download': 'एक टेम्पलेट CSV डाउनलोड करें',
  'import.template.required': 'आवश्यक कॉलम',
  'import.template.optional': 'वैकल्पिक कॉलम',
  'import.column.external_row_id': 'इस पंक्ति के लिए आपकी अपनी id। यह फ़ाइल के भीतर अद्वितीय होनी चाहिए।',
  'import.column.project': 'वह प्रोजेक्ट नाम या id जिससे यह पंक्ति संबंधित है।',
  'import.column.targets':
    'या तो: लक्ष्य सेट id से पहले, या ऊर्ध्वाधर पट्टी से अलग किए गए खाता id।',
  'import.column.caption': 'पोस्ट का पाठ।',
  'import.column.scheduled_local_time': 'स्थानीय तारीख और समय, 2026-09-01T10:00 के रूप में लिखा गया।',
  'import.column.time_zone': 'वह IANA क्षेत्र जिसमें स्थानीय समय पढ़ा जाता है, उदाहरण के लिए Europe/Berlin।',
  'import.column.media':
    'एक मीडिया id, sha256: जिसके बाद आपके पास पहले से मौजूद मीडिया का चेकसम, या सर्वर के लाने के लिए एक https पता।',
  'import.column.title': 'एक शीर्षक, जहां गंतव्य इसका उपयोग करता है।',
  'import.column.destination': 'खाते के भीतर पेज, बोर्ड या चैनल।',
  'import.column.privacy': 'गंतव्य द्वारा अपेक्षित गोपनीयता मान।',
  'import.column.first_comment': 'पोस्ट के बाद पहली टिप्पणी के रूप में पोस्ट किया गया पाठ।',
  'import.column.approval_policy': 'प्रत्येक ड्राफ्ट से जुड़ी अनुमोदन नीति।',
  'import.column.perPlatform':
    'किसी प्लेटफ़ॉर्म के नाम पर रखा गया caption_ या title_ कॉलम केवल उस प्लेटफ़ॉर्म को ओवरराइड करता है, उदाहरण के लिए caption_instagram।',

  'import.columns.heading': 'कॉलम जांच',
  'import.columns.ok': 'हर आवश्यक कॉलम मौजूद है।',
  'import.columns.missing':
    '{count, plural, one {# आवश्यक कॉलम गायब है} other {# आवश्यक कॉलम गायब हैं}}',
  'import.columns.unknown':
    '{count, plural, one {# कॉलम पहचाना नहीं गया और अनदेखा किया गया} other {# कॉलम पहचाने नहीं गए और अनदेखे किए गए}}',
  'import.columns.present': 'मिले कॉलम',

  'import.review.heading': 'यह फ़ाइल क्या करेगी',
  'import.review.counts':
    '{valid, plural, =0 {कोई पंक्ति तैयार नहीं है} one {# पंक्ति तैयार है} other {# पंक्तियां तैयार हैं}}, {invalid, plural, =0 {किसी पर ध्यान देने की आवश्यकता नहीं} one {# को ध्यान देने की आवश्यकता है} other {# को ध्यान देने की आवश्यकता है}}।',
  'import.review.empty': 'इस फ़ाइल से कोई पंक्ति नहीं पढ़ी गई।',
  'import.review.rowsHeading': 'पंक्तियां',
  'import.review.filterAll': 'सभी पंक्तियां',
  'import.review.filterValid': 'तैयार',
  'import.review.filterInvalid': 'ध्यान देने योग्य',
  'import.review.filterFailed': 'विफल',
  'import.review.downloadErrors': 'समस्याओं को CSV के रूप में डाउनलोड करें',
  'import.review.parsedWith': 'पार्सर {version} से पढ़ा गया',

  'import.table.row': 'पंक्ति id',
  'import.table.line': 'पंक्ति',
  'import.table.state': 'स्थिति',
  'import.table.caption': 'कैप्शन',
  'import.table.time': 'निर्धारित',
  'import.table.problems': 'समस्याएं',
  'import.table.draft': 'ड्राफ्ट',
  'import.table.noProblems': 'कोई नहीं',

  'import.state.pending': 'जांचा नहीं गया',
  'import.state.valid': 'तैयार',
  'import.state.invalid': 'ध्यान देने योग्य',
  'import.state.applied': 'ड्राफ्ट बनाया गया',
  'import.state.skipped': 'पहले से हो चुका',
  'import.state.failed': 'विफल',

  'import.job.state.uploaded': 'अपलोड किया गया',
  'import.job.state.validating': 'जांचा जा रहा है',
  'import.job.state.validated': 'जांचा गया',
  'import.job.state.applying': 'लागू किया जा रहा है',
  'import.job.state.applied': 'लागू किया गया',
  'import.job.state.failed': 'पढ़ा नहीं जा सका',

  'import.apply.heading': 'तैयार पंक्तियों के साथ क्या होना चाहिए?',
  'import.apply.drafts': 'ड्राफ्ट बनाएं',
  'import.apply.draftsHelp':
    'डिफ़ॉल्ट। हर तैयार पंक्ति एक ड्राफ्ट बन जाती है जिसे आप खोल, संपादित और स्वीकृत कर सकते हैं। कुछ भी निर्धारित नहीं होता।',
  'import.apply.scheduled': 'ड्राफ्ट बनाएं और उन्हें शेड्यूल करें',
  'import.apply.scheduledHelp':
    'हर तैयार पंक्ति एक ड्राफ्ट बन जाती है और फ़ाइल में लिखा गया समय लेती है। इसे केवल तभी चुनें जब समय सही हों।',
  'import.apply.confirm': '{count, plural, one {# पंक्ति} other {# पंक्तियां}} लागू करें',
  'import.apply.confirmScheduled':
    '{count, plural, one {# पंक्ति} other {# पंक्तियां}} बनाएं और शेड्यूल करें',
  'import.apply.running': 'पंक्तियां लागू की जा रही हैं',
  'import.apply.safeToRepeat':
    'दो बार लागू करना सुरक्षित है। जिस पंक्ति ने पहले ही ड्राफ्ट बना दिया है उसे नहीं छेड़ा जाता।',

  'import.results.heading': 'परिणाम',
  'import.results.applied': '{count, plural, one {# ड्राफ्ट बनाया गया} other {# ड्राफ्ट बनाए गए}}',
  'import.results.skipped':
    '{count, plural, one {# पंक्ति पहले से हो चुकी थी} other {# पंक्तियां पहले से हो चुकी थीं}}',
  'import.results.failed': '{count, plural, one {# पंक्ति विफल हुई} other {# पंक्तियां विफल हुईं}}',
  'import.results.retry': 'शेष पंक्तियों को फिर से लागू करें',
  'import.results.openDrafts': 'ड्राफ्ट खोलें',
  'import.results.unavailable': 'अनुपलब्ध',

  'import.history.heading': 'पिछले आयात',
  'import.history.empty': 'अभी तक कोई आयात नहीं।',
  'import.history.open': 'खोलें',

  'import.a11y.rowsTable': 'मैनिफेस्ट पंक्तियां और उनकी समस्याएं',
  'import.a11y.stepList': 'आयात चरण',
  'import.a11y.uploadedFile': 'चयनित फ़ाइल: {filename}',

  'import.error.emptyFile': 'उस फ़ाइल में कोई पंक्ति नहीं है।',
  'import.error.missingColumn': 'कॉलम {column} गायब है।',
  'import.error.unknownColumn': 'कॉलम {column} पहचाना नहीं गया, इसलिए इसे अनदेखा किया गया।',
  'import.error.duplicateRowId': 'पंक्ति id {value} इस फ़ाइल में एक से अधिक बार उपयोग की गई है।',
  'import.error.required': 'यह सेल खाली नहीं हो सकता।',
  'import.error.invalidCell': 'यह सेल उस आकार में नहीं है जिसे हम पढ़ सकें।',
  'import.error.rowShape': 'इस पंक्ति में {actual} सेल हैं लेकिन हेडर में {expected} हैं।',
  'import.error.invalidLocalTime':
    'समय {value} 2026-09-01T10:00 जैसी स्थानीय तारीख और समय नहीं है।',
  'import.error.invalidTimeZone': 'क्षेत्र {value} एक IANA समय क्षेत्र नाम नहीं है।',
  'import.error.nonexistentLocalTime':
    'समय {value} {zone} में मौजूद नहीं है। घड़ियां इसे लांघ जाती हैं।',
  'import.error.ambiguousLocalTime':
    'समय {value} {zone} में उस दिन दो बार होता है। एक अलग समय चुनें।',
  'import.error.scheduleInPast': '{zone} में समय {value} पहले ही बीत चुका है।',
  'import.error.invalidTargets':
    'मान {value} न तो एक सहेजा गया लक्ष्य सेट है और न ही खाता id की सूची।',
  'import.error.invalidMedia':
    'मान {value} न तो मीडिया id है, न sha256 चेकसम, न ही https पता।',
  'import.error.mediaNotFound': 'इस वर्कस्पेस में कोई मीडिया {value} से मेल नहीं खाता।',
  'import.error.mediaImportStarted':
    '{value} पर मीडिया लाया जा रहा है। इसके लाइब्रेरी में आने के बाद इस फ़ाइल को फिर से लागू करें।',
  'import.error.unknownVariantTarget':
    'इस पंक्ति में कोई {provider} खाता नहीं है, इसलिए {provider} कैप्शन का उपयोग नहीं किया गया।',
  'import.error.applyFailed': 'यह पंक्ति लागू नहीं की जा सकी। संदर्भ: {code}।',
  'import.error.alreadyApplied': 'इस पंक्ति ने पहले ही एक ड्राफ्ट बना दिया, इसलिए इसे नहीं छेड़ा गया।',
  'import.error.tooManyRows': 'फ़ाइल की केवल पहली {limit} पंक्तियां पढ़ी जाती हैं।',
} as const;
