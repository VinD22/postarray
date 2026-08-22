/**
 * One entry per deterministic validation issue code.
 *
 * Every code has `validation.<code>.message`. Messages state the limit and the
 * account, so the fix is obvious without opening a provider document.
 */
export const validationMessages = {
  'validation.text_required.message': '{provider} इस पोस्ट प्रकार के लिए कुछ पाठ की आवश्यकता है.',
  'validation.text_too_long.message':
    '{over, plural, one {# के लिए सीमा से अधिक चरित्र {account}} other {# के लिए सीमा से अधिक वर्ण {account}}}',
  'validation.text_too_long.hint': '{provider} अनुमति देता है {limit} इस खाते के लिए वर्ण.',
  'validation.text_too_short.message': '{provider} कम से कम जरूरत है {min} यहाँ पात्र.',
  'validation.title_required.message': '{provider} एक शीर्षक की जरूरत है.',
  'validation.title_too_long.message': 'शीर्षक के ऊपर है {limit} चरित्र सीमा.',
  'validation.description_too_long.message': 'विवरण खत्म हो गया है {limit} चरित्र सीमा.',
  'validation.media_required.message':
    '{provider} इस पोस्ट प्रकार के लिए कम से कम एक छवि या वीडियो की आवश्यकता है।',
  'validation.media_count_exceeded.message':
    '{provider} अधिक से अधिक स्वीकार करता है {limit, plural, one {# फ़ाइल} other {# फ़ाइलें}} यहाँ. इस पोस्ट में है {count}.',
  'validation.media_type_unsupported.message': '{provider} स्वीकार नहीं करता {mimeType} फ़ाइलें.',
  'validation.media_aspect_ratio_unsupported.message':
    'यह फ़ाइल है {actual}. {provider} के बीच अनुपात की आवश्यकता है {min} और {max}.',
  'validation.media_aspect_ratio_unsupported.hint':
    'इसे ठीक करने के लिए प्लेटफ़ॉर्म प्रीसेट से इसे क्रॉप करें।',
  'validation.media_resolution_too_low.message':
    'यह फ़ाइल है {actual}. {provider} कम से कम जरूरत है {required}.',
  'validation.media_duration_too_long.message':
    'ये वीडियो है {actual}. {provider} तक स्वीकार करता है {limit} इस खाते के लिए.',
  'validation.media_duration_too_short.message':
    'ये वीडियो है {actual}. {provider} कम से कम जरूरत है {limit}.',
  'validation.media_file_too_large.message':
    'यह फ़ाइल है {actual}. {provider} तक स्वीकार करता है {limit}.',
  'validation.media_mixed_types_unsupported.message':
    '{provider} एक ही पोस्ट में चित्र और वीडियो प्रकाशित नहीं कर सकते.',
  'validation.alt_text_missing.message':
    'ऑल्ट टेक्स्ट गायब है {count, plural, one {# छवि} other {# छवियाँ}}.',
  'validation.alt_text_missing.hint': 'छवि का वर्णन करें, या इसे सजावटी के रूप में चिह्नित करें।',
  'validation.thumbnail_unsupported.message': '{provider} यहां कस्टम थंबनेल स्वीकार नहीं करता.',
  'validation.destination_required.message': 'चुनें कि यह कहां प्रकाशित होगा {provider}.',
  'validation.destination_unsupported.message':
    '{destination} इस पोस्ट प्रकार को स्वीकार नहीं करता {provider}.',
  'validation.mention_unresolved.message':
    '{count, plural, one {# उल्लेख का वास्तविक विवरण से मिलान नहीं किया गया है} other {# उल्लेखों का वास्तविक खातों से मिलान नहीं किया गया है}}.',
  'validation.mention_unresolved.hint':
    'खोज परिणामों से खाता चुनें, या उल्लेख हटा दें। सादा पाठ कभी भी मूल टैग के रूप में प्रकाशित नहीं होता।',
  'validation.hashtag_count_exceeded.message':
    '{count} हैशटैग. {provider} से अधिक मायने रखता है {limit} स्पैम के रूप में.',
  'validation.link_not_allowed.message': '{provider} इस क्षेत्र में लिंक की अनुमति नहीं देता.',
  'validation.link_destination_unverified.message':
    'लिंक डोमेन {domain} इस कार्यस्थान के लिए सत्यापित नहीं है.',
  'validation.privacy_setting_required.message':
    '{provider} प्रकाशन से पहले एक स्पष्ट गोपनीयता विकल्प की आवश्यकता होती है।',
  'validation.privacy_setting_required.hint':
    'कोई डिफ़ॉल्ट नहीं है. चुनें कि इस पोस्ट को कौन देख सकता है.',
  'validation.disclosure_required.message':
    'इस पोस्ट के लिए परियोजना नियमों के तहत प्रकटीकरण की आवश्यकता है {market}.',
  'validation.first_comment_unsupported.message':
    '{provider} इस खाते के लिए निर्धारित पहली टिप्पणी का समर्थन नहीं करता.',
  'validation.thread_unsupported.message': '{provider} इस खाते के लिए थ्रेड का समर्थन नहीं करता.',
  'validation.repeat_end_required.message':
    'दोहराई जाने वाली पोस्ट के लिए अंतिम तिथि या कई बार दोहराव की आवश्यकता होती है।',
  'validation.schedule_in_past.message': 'वह समय बीत चुका है {timeZone}.',
  'validation.schedule_too_far_ahead.message':
    'ये उससे भी आगे है {limit} इस क्रेडेंशियल के लिए आगे देखें।',
  'validation.schedule_outside_quiet_hours.message':
    'यह निर्धारित शांत घंटों के अंतर्गत आता है {project}.',
  'validation.duplicate_within_window.message':
    'बहुत समान सामग्री पहले से ही निर्धारित या प्रकाशित की गई है {account} भीतर {window}.',
  'validation.blocked_term_present.message': 'पाठ में इसके लिए एक अवरुद्ध शब्द है {project}.',
  'validation.unsupported_claim.message': 'यह दावा स्वीकृत दावों में नहीं है {project}.',
  'validation.unsupported_claim.hint':
    'इसे साक्ष्य के साथ स्वीकृत दावों में जोड़ें, या वाक्य को दोबारा लिखें।',
  'validation.cadence_exceeded.message':
    '{account} प्रकाशित करेंगे {count, plural, one {# समय} other {# बार}} उस दिन, की सीमा से अधिक {limit}.',
  'validation.connection_paused.message': '{account} रोक दिया गया है और प्रकाशित नहीं किया जाएगा.',
  'validation.account_type_invalid.message':
    '{account} खाता प्रकार नहीं है {provider} इस पोस्ट प्रकार के लिए आवश्यक है.',

  'validation.severity.error': 'ठीक करना होगा',
  'validation.severity.warning': 'इसकी जांच करें',
  'validation.severity.info': 'आपकी जानकारी के लिए',
  'validation.field.required': 'यह फ़ील्ड आवश्यक है.',
  'validation.field.tooShort':
    'कम से कम प्रयोग करें {min, plural, one {# चरित्र} other {# अक्षर}}.',
  'validation.field.tooLong':
    'अधिक से अधिक प्रयोग करें {max, plural, one {# चरित्र} other {# अक्षर}}.',
  'validation.field.invalidEmail': 'एक वैध ईमेल पता दर्ज करें.',
  'validation.field.invalidUrl': 'https सहित पूर्ण URL दर्ज करें।',
  'validation.field.invalidDate': 'एक वैध तिथि दर्ज करें.',
  'validation.field.invalidTime': 'एक वैध समय दर्ज करें.',
  'validation.field.invalidNumber': 'एक नंबर दर्ज करें.',
  'validation.field.outOfRange': 'के बीच एक मान दर्ज करें {min} और {max}.',
  'validation.field.mustMatch': 'ये दोनों मान मेल खाने चाहिए.',
  'validation.field.alreadyTaken': 'वह पहले से ही उपयोग में है.',
  'validation.field.unsafeValue': 'उस मान की यहां अनुमति नहीं है.',
} as const;
