/**
 * The fifteen publish states and the approval states.
 *
 * `state.<state>.label` is the short badge. `state.<state>.description` is the
 * sentence shown next to it. A state never relies on colour alone.
 */
export const stateMessages = {
  'state.draft.label': 'ड्राफ्ट',
  'state.draft.description':
    'केवल इस कार्यक्षेत्र के लोग ही इसे देख सकते हैं. कुछ भी निर्धारित नहीं है.',
  'state.validation_needed.label': 'सत्यापन की आवश्यकता है',
  'state.validation_needed.description':
    'एक या अधिक लक्ष्यों में कोई समस्या है जिसे शेड्यूल करने से पहले ठीक किया जाना चाहिए।',
  'state.approval_requested.label': 'अनुमोदन का अनुरोध किया गया',
  'state.approval_requested.description': 'इंतज़ार कर रहा हूँ {approver} निर्णय लेना.',
  'state.approved.label': 'स्वीकृत',
  'state.approved.description':
    'द्वारा अनुमोदित {approver}. इसे अब शेड्यूल या प्रकाशित किया जा सकता है।',
  'state.scheduled.label': 'अनुसूचित',
  'state.scheduled.description': 'प्रकाशित करता है {time} में {timeZone}.',
  'state.preparing_media.label': 'मीडिया तैयार कर रहा है',
  'state.preparing_media.description': 'प्लेटफ़ॉर्म के लिए फ़ाइलें अपलोड करना और परिवर्तित करना।',
  'state.dispatching.label': 'प्रेषण',
  'state.dispatching.description': 'को भेजा जा रहा है {provider} अभी.',
  'state.provider_processing.label': 'प्रदाता प्रसंस्करण',
  'state.provider_processing.description':
    '{provider} अपलोड स्वीकार कर लिया गया है और अभी भी इसे संसाधित किया जा रहा है। हम पुष्टि करते हैं कि यह कब लाइव होगा।',
  'state.published.label': 'प्रकाशित',
  'state.published.description': 'जियो {provider} तब से {time}.',
  'state.partially_published.label': 'आंशिक रूप से प्रकाशित',
  'state.partially_published.description':
    '{published, plural, one {# लक्ष्य प्रकाशित} other {# लक्ष्य प्रकाशित}}, {failed, plural, one {# विफल} other {# विफल}}. प्रकाशित पोस्ट लाइव हैं और उन्हें वापस नहीं लिया गया।',
  'state.action_required.label': 'कार्रवाई आवश्यक है',
  'state.action_required.description': 'यह तब तक जारी नहीं रह सकता जब तक आप कुछ नहीं करते.',
  'state.retry_scheduled.label': 'पुनः प्रयास शेड्यूल किया गया',
  'state.retry_scheduled.description':
    'प्रयास {attempt} का {max} पर चलेगा {time}. कुछ भी डुप्लिकेट नहीं है.',
  'state.failed_permanently.label': 'असफल',
  'state.failed_permanently.description':
    'इसका दोबारा प्रयास नहीं किया जाएगा. आपकी सामग्री सुरक्षित है और इसका कारण रसीद पर है।',
  'state.canceled.label': 'रद्द कर दिया गया',
  'state.canceled.description':
    'द्वारा रद्द कर दिया गया {actor} पर {date}. कुछ भी प्रकाशित नहीं हुआ.',
  'state.deleted_externally.label': 'प्लेटफ़ॉर्म पर हटा दिया गया',
  'state.deleted_externally.description':
    'यह पोस्ट अब चालू नहीं है {provider}. रसीद और उसके जाने से पहले एकत्र किए गए मेट्रिक्स रखे जाते हैं।',

  'state.approval.not_required.label': 'किसी अनुमोदन की आवश्यकता नहीं',
  'state.approval.not_required.description':
    'इन लक्ष्यों के लिए नीति को अनुमोदन की आवश्यकता नहीं है।',
  'state.approval.requested.label': 'अनुरोध किया',
  'state.approval.requested.description': 'को भेजा गया {approver} {relativeTime}.',
  'state.approval.in_review.label': 'समीक्षा में',
  'state.approval.in_review.description': '{approver} अभी इस पर गौर कर रहा है.',
  'state.approval.approved.label': 'स्वीकृत',
  'state.approval.approved.description': 'द्वारा अनुमोदित {approver} पर {date}.',
  'state.approval.changes_requested.label': 'परिवर्तन का अनुरोध किया गया',
  'state.approval.changes_requested.description': '{approver} में बदलाव के लिए कहा {date}.',
  'state.approval.rejected.label': 'अस्वीकृत',
  'state.approval.rejected.description': 'द्वारा अस्वीकृत {approver} पर {date}.',
  'state.approval.expired.label': 'समाप्त हो गया',
  'state.approval.expired.description': 'यह अनुरोध समाप्त हो गया {date} बिना किसी निर्णय के.',
  'state.approval.withdrawn.label': 'वापस ले लिया गया',
  'state.approval.withdrawn.description': 'लेखक ने यह अनुरोध वापस ले लिया {date}.',

  'state.summary.targets':
    '{ready, plural, one {# लक्ष्य तैयार} other {# लक्ष्य तैयार}}, {blocked, plural, =0 {किसी को भी अवरुद्ध नहीं किया गया} one {# अवरुद्ध} other {# अवरुद्ध}}',
  'state.changedAt': 'बदल गया {relativeTime}',
} as const;
