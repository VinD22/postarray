export const mediaMessages = {
  'mediaLib.derivative.heading': 'इस चित्र को संपादित करें',
  'mediaLib.derivative.description':
    'क्रॉप करें, घुमाएं, आकार बदलें, प्रारूप बदलें या संपीड़ित करें। हर बदलाव आपकी फ़ाइल में पहले से मौजूद पिक्सेल पर काम करता है। जो पहले नहीं था, वह कुछ भी नहीं जोड़ा जाता।',
  'mediaLib.derivative.originalKept':
    'मूल कभी नहीं बदला जाता। हर संपादन एक अलग संस्करण के रूप में सहेजा जाता है जिसे आप रचना करते समय चुन सकते हैं।',
  'mediaLib.derivative.apply': 'यह संस्करण सहेजें',
  'mediaLib.derivative.applying': 'यह संस्करण सहेजा जा रहा है',
  'mediaLib.derivative.discard': 'बदलाव त्यागें',
  'mediaLib.derivative.noChanges': 'अभी तक सहेजने के लिए कुछ नहीं है। ऊपर एक मान बदलें।',

  'mediaLib.derivative.tab.crop': 'क्रॉप करें',
  'mediaLib.derivative.tab.transform': 'घुमाएं और आकार बदलें',
  'mediaLib.derivative.tab.output': 'प्रारूप',

  'mediaLib.derivative.cropHint':
    'संख्याएं टाइप करें, या किसी भी फ़ील्ड में तीर कुंजियों का उपयोग करें। यहां किसी भी चरण के लिए माउस की आवश्यकता नहीं है।',
  'mediaLib.derivative.cropX': 'बायां किनारा, पिक्सेल में',
  'mediaLib.derivative.cropY': 'ऊपरी किनारा, पिक्सेल में',
  'mediaLib.derivative.cropWidth': 'क्रॉप चौड़ाई, पिक्सेल में',
  'mediaLib.derivative.cropHeight': 'क्रॉप ऊंचाई, पिक्सेल में',
  'mediaLib.derivative.rotate': 'घुमाएं',
  'mediaLib.derivative.rotateNone': 'कोई घुमाव नहीं',
  'mediaLib.derivative.rotateDegrees': 'दक्षिणावर्त {degrees} डिग्री',
  'mediaLib.derivative.resizeWidth': 'नई चौड़ाई, पिक्सेल में',
  'mediaLib.derivative.resizeHeight': 'नई ऊंचाई, पिक्सेल में',
  'mediaLib.derivative.lockRatio': 'एक पक्ष बदलने पर आकार बनाए रखें',
  'mediaLib.derivative.format': 'इस रूप में सहेजें',
  'mediaLib.derivative.formatSame': 'वर्तमान प्रारूप बनाए रखें',
  'mediaLib.derivative.quality': 'गुणवत्ता',
  'mediaLib.derivative.qualityHint':
    'कम गुणवत्ता एक छोटी फ़ाइल बनाती है। यह JPEG और WebP पर लागू होती है। PNG हानिरहित है और इसे अनदेखा करता है।',
  'mediaLib.derivative.projected': 'यह संस्करण {width} गुणा {height} पिक्सेल का होगा।',
  'mediaLib.derivative.projectedUnavailable': 'इस संस्करण का आकार बनने तक अनुपलब्ध है।',

  'mediaLib.derivative.listHeading': 'संस्करण',
  'mediaLib.derivative.original': 'मूल',
  'mediaLib.derivative.originalHint': 'हमेशा रखा जाता है। कभी ओवरराइट नहीं किया जाता।',
  'mediaLib.derivative.item': '{width} गुणा {height}, {mimeType}, {size}',
  'mediaLib.derivative.empty': 'अभी तक कोई संपादित संस्करण नहीं है। मूल यहां एकमात्र फ़ाइल है।',
  'mediaLib.derivative.select': 'यह संस्करण उपयोग करें',
  'mediaLib.derivative.selected': 'इस पोस्ट के लिए उपयोग में',
  'mediaLib.derivative.useOriginal': 'मूल का उपयोग करें',
  'mediaLib.derivative.processing': 'यह संस्करण बनाया जा रहा है। तैयार होने पर यह यहां दिखाई देगा।',
  'mediaLib.derivative.alreadyExists':
    'आपने यह ठीक वही संपादन पहले किया है, इसलिए दूसरा बनाने के बजाय हमने वह संस्करण फिर से उपयोग किया।',
  'mediaLib.derivative.failedTitle': 'यह संस्करण नहीं बनाया जा सका',
  'mediaLib.derivative.failedBody':
    'कुछ भी सहेजा नहीं गया और आपका मूल अछूता है। मान बदलें और फिर से कोशिश करें।',
  'mediaLib.derivative.openEditor': '{name} संपादित करें',

  'mediaLib.derivative.unsupportedTitle': 'संपादन केवल चित्रों पर काम करता है',
  'mediaLib.derivative.unsupportedBody':
    'वीडियो, ऑडियो और दस्तावेज़ यहां संपादित नहीं किए जा सकते। अपलोड करने से पहले फ़ाइल तैयार करें। किसी भी स्थिति में आपका मूल अपलोड नहीं बदलता।',

  'mediaLib.derivative.nonGenerative':
    'Relay चित्र या वीडियो जनरेट नहीं करता। यह संपादक केवल वही क्रॉप, घुमाता, आकार बदलता, परिवर्तित और संपीड़ित करता है जो आपने अपलोड किया।',

  'error.media_derivative_no_operations.message': 'संस्करण सहेजने से पहले कम से कम एक बदलाव चुनें।',
  'error.media_derivative_duplicate_operation.message':
    'हर तरह का बदलाव केवल एक बार दिखाई दे सकता है। दूसरा {operation} हटाएं।',
  'error.media_derivative_crop_out_of_bounds.message':
    'वह क्रॉप चित्र के किनारे से आगे जाता है, जो {sourceWidth} गुणा {sourceHeight} पिक्सेल का है। इसे स्थानांतरित करें या छोटा करें।',
  'error.media_derivative_upscale_rejected.message':
    'यह संपादक कभी किसी चित्र को बड़ा नहीं करता, क्योंकि अतिरिक्त पिक्सेल आपके नहीं बल्कि गढ़े हुए होंगे। इस संस्करण का सबसे बड़ा आकार {availableWidth} गुणा {availableHeight} है।',
  'error.media_derivative_source_unsupported.message':
    'संपादन JPEG, PNG, WebP और GIF चित्रों पर काम करता है। यह फ़ाइल {mimeType} है।',
  'error.media_derivative_dimensions_unknown.message':
    'हमें अभी तक इस चित्र का आकार पता नहीं है, इसलिए हम बदलाव की जांच नहीं कर सकते। प्रोसेसिंग पूरी होने के बाद फिर से कोशिश करें।',
  'error.media_derivative_format_required.message':
    'सहेजने के लिए एक प्रारूप चुनें। {sourceMimeType} फ़ाइल यहां स्वयं के रूप में वापस सहेजी नहीं जा सकती।',
  'error.media_derivative_quality_unsupported.message':
    'PNG हानिरहित है, इसलिए गुणवत्ता सेटिंग का कोई असर नहीं होगा। इसे हटाएं, या JPEG या WebP के रूप में सहेजें।',
  'error.media_derivative_no_change.message':
    'यह वही प्रारूप है जो यह फ़ाइल पहले से उपयोग करती है।',
  'error.media_derivative_source_unavailable.message':
    'जिस फ़ाइल से यह संस्करण आना था वह अब भंडारण में नहीं है।',
  'error.media_derivative_preset_mismatch.message':
    'यह संपादन अनुरोध उन बदलावों से मेल नहीं खाता जिनका यह वर्णन करता है। कुछ नहीं बनाया गया। संपादक से फिर से कोशिश करें।',
  'error.media_derivative_empty_result.message':
    'संपादन से कोई चित्र नहीं बना, इसलिए कुछ भी सहेजा नहीं गया। आपका मूल अछूता है।',
  'error.media_derivative_transform_failed.message':
    'यह चित्र पढ़ा या लिखा नहीं जा सका। कुछ भी सहेजा नहीं गया और आपका मूल अछूता है।',
  'error.media_derivative_write_failed.message':
    'यह संस्करण दर्ज नहीं किया जा सका। कुछ भी सहेजा नहीं गया और आपका मूल अछूता है।',
} as const;
