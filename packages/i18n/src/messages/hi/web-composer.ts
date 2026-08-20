/**
 * Web composer and media library chrome.
 *
 * The domain vocabulary (master draft, overrides, limits, cost, schedule) lives
 * in `composer.ts`. This file holds the strings the web surface adds on top:
 * panes, steps, the summary bar, the picture editor, upload states, rights and
 * provenance. Keys are namespaced `composerWeb.` and `mediaLib.` so they never
 * collide with the shared composer catalog.
 */
export const webComposerMessages = {
  // ---------------------------------------------------------------- shell
  'composerWeb.pane.targets': 'लक्ष्य खाते और सेट',
  'composerWeb.pane.master': 'मास्टर ड्राफ्ट और साझा सेटिंग्स',
  'composerWeb.pane.variant': 'खुले लक्ष्य के लिए संस्करण',
  'composerWeb.pane.review': 'पूर्वावलोकन, सत्यापन, लागत और अनुमोदन',
  'composerWeb.pane.showPreview': 'पूर्वावलोकन दिखाएँ',
  'composerWeb.pane.hidePreview': 'पूर्वावलोकन छिपाएँ',
  'composerWeb.pane.previewCollapsed':
    'पूर्वावलोकन पैनल छिपा हुआ है. अंतिम पोस्ट देखने के लिए इसे खोलें.',

  'composerWeb.step.targets': 'लक्ष्य',
  'composerWeb.step.write': 'लिखो',
  'composerWeb.step.perTarget': 'प्रति लक्ष्य',
  'composerWeb.step.review': 'समीक्षा',
  'composerWeb.step.progress': 'Step {current} of {total}',
  'composerWeb.step.legend': 'Composer चरण',

  'composerWeb.summary.label': 'ड्राफ्ट सारांश',
  'composerWeb.summary.targets':
    '{count, plural, =0 {No targets} one {# target} other {# targets}}',
  'composerWeb.summary.issues': '{count, plural, =0 {No issues} one {# issue} other {# issues}}',
  'composerWeb.summary.notScheduled': 'कोई समय नहीं चुना गया',
  'composerWeb.summary.scheduledFor': '{time}',
  'composerWeb.summary.costUnknown': 'लागत अभी तय नहीं हुई है',
  'composerWeb.summary.openReview': 'समीक्षा खोलें',

  // ---------------------------------------------------------------- rail
  'composerWeb.rail.masterEntry': 'मास्टर ड्राफ्ट',
  'composerWeb.rail.masterHint':
    'प्रत्येक लक्ष्य तक पहुंचने के लिए यहां संपादित करें जो अभी भी विरासत में मिला है।',
  'composerWeb.rail.accountsHeading': 'लक्ष्य खाते',
  'composerWeb.rail.setsHeading': 'सेट और समूह',
  'composerWeb.rail.setsHelp':
    'सेट खातों और डिफॉल्ट्स का एक सहेजा गया समूह है। किसी को लागू करने से उसके मान इस ड्राफ्ट में कॉपी हो जाते हैं। सेट में बाद के संपादनों से इस मसौदे में कोई परिवर्तन नहीं आता।',
  'composerWeb.rail.openTarget': 'Open the version for {account}',
  'composerWeb.rail.counter': '{used}/{limit}',
  'composerWeb.rail.counterUnknown': 'सीमा अज्ञात',
  'composerWeb.rail.mediaCounter':
    '{count, plural, =0 {no media} one {# media file} other {# media files}}',
  'composerWeb.rail.paused':
    'रुका हुआ. जब तक आप इसे दोबारा शुरू नहीं करेंगे तब तक यह प्रकाशित नहीं होगा।',
  'composerWeb.rail.state.notBuilt': 'अभी तक नहीं बना',
  'composerWeb.rail.state.unsupported': 'प्रदाता समर्थन नहीं करता',
  'composerWeb.rail.empty': 'अभी तक कोई खाता चयनित नहीं है.',
  'composerWeb.rail.emptyHelp':
    'वे खाते चुनें जिन तक यह पोस्ट पहुंचनी चाहिए. आप बाद में और भी जोड़ सकते हैं.',
  'composerWeb.rail.divergenceHint':
    'किसी लक्ष्य का अपना संस्करण देखने के लिए उसे खोलें. मास्टर ड्राफ्ट अपरिवर्तित है.',
  'composerWeb.rail.searchLabel': 'खाते फ़िल्टर करें',
  'composerWeb.rail.removeTarget': 'Remove {account}',

  // ---------------------------------------------------------- global edit
  'composerWeb.globalEdit.open': 'वैश्विक संपादन',
  'composerWeb.globalEdit.title': 'इस परिवर्तन को प्रत्येक चयनित लक्ष्य पर लागू करें',
  'composerWeb.globalEdit.description':
    'मास्टर ड्राफ्ट हमेशा बदलता रहता है. जो लक्ष्य अभी भी इस क्षेत्र को प्राप्त करते हैं वे इसका अनुसरण करते हैं। लक्ष्य अपने स्वयं के संस्करण के साथ इसे रखते हैं।',
  'composerWeb.globalEdit.fieldLabel': 'मैदान',
  'composerWeb.globalEdit.compatibleHeading': 'ये लक्ष्य परिवर्तन लेते हैं',
  'composerWeb.globalEdit.keepsOverrideHeading': 'ये लक्ष्य अपना स्वयं का संस्करण रखते हैं',
  'composerWeb.globalEdit.incompatibleHeading': 'ये लक्ष्य परिवर्तन नहीं ले सकते',
  'composerWeb.globalEdit.incompatibleHelp':
    'आपको बिना बताये कोई भी चीज़ नहीं गिराई जाती. नीचे दिए गए प्रत्येक खाते को अनुकूलित परिवर्तन के साथ एक स्पष्ट संस्करण मिलता है, और आप इसे बाद में संपादित कर सकते हैं।',
  'composerWeb.globalEdit.reason.textTooLong':
    '{account} allows {limit} characters. This text is {actual}.',
  'composerWeb.globalEdit.reason.linkNotAllowed':
    '{account} does not accept a link in this field. The link stays in the master draft and in the targets that allow it.',
  'composerWeb.globalEdit.reason.mediaCountExceeded':
    '{account} accepts {limit, plural, one {# file} other {# files}}. This draft has {actual}.',
  'composerWeb.globalEdit.reason.mediaKindUnsupported':
    '{account} does not accept {mimeType} files.',
  'composerWeb.globalEdit.reason.threadUnsupported':
    '{account} does not support follow up items, so the sequence stays on the master draft.',
  'composerWeb.globalEdit.reason.markdownUnsupported':
    '{account} publishes plain text. The formatting marks would appear as characters.',
  'composerWeb.globalEdit.adaptedPreview': 'What {account} gets instead',
  'composerWeb.globalEdit.confirm': 'संस्करण लागू करें और बनाएं',
  'composerWeb.globalEdit.nothingToApply':
    'कुछ भी नहीं बदलता. मास्टर ड्राफ्ट में यह मान पहले से ही है।',
  'composerWeb.globalEdit.announced':
    '{applied, plural, one {Change applied to # target} other {Change applied to # targets}}. {adapted, plural, =0 {No target needed an adapted version} one {# target got an adapted version} other {# targets got adapted versions}}.',

  // ------------------------------------------------------------- override
  'composerWeb.override.heading': 'इस लक्ष्य का अपना संस्करण है',
  'composerWeb.override.fieldsChanged':
    '{count, plural, one {# field differs from the master draft} other {# fields differ from the master draft}}',
  'composerWeb.override.field.body': 'पाठ पोस्ट करें',
  'composerWeb.override.field.contentKind': 'पोस्ट प्रकार',
  'composerWeb.override.field.locale': 'सामग्री भाषा',
  'composerWeb.override.field.mediaIds': 'मीडिया',
  'composerWeb.override.field.links': 'कड़ियाँ',
  'composerWeb.override.field.signature': 'हस्ताक्षर',
  'composerWeb.override.field.threadItems': 'टिप्पणियाँ और सूत्र',
  'composerWeb.override.field.schedule': 'अनुसूची',
  'composerWeb.override.resetField': 'Reset {field} to master',
  'composerWeb.override.resetFieldTitle': 'Reset {field} for {account}?',
  'composerWeb.override.resetFieldBody':
    'The version of {field} written for {account} is discarded and the master draft is used again. No other target changes.',
  'composerWeb.override.resetAll': 'मास्टर करने के लिए प्रत्येक फ़ील्ड को रीसेट करें',
  'composerWeb.override.inheritNotice':
    'This target follows the master draft. Editing anything here creates a version only {account} receives.',
  'composerWeb.override.created': '{account} now has its own {field}.',

  // --------------------------------------------------------------- limits
  'composerWeb.limits.heading': 'Limits for {account}',
  'composerWeb.limits.text': 'Text up to {limit} characters',
  'composerWeb.limits.linkCost':
    'A link counts as {count, plural, one {# character} other {# characters}} whatever its length.',
  'composerWeb.limits.images':
    '{count, plural, =0 {No images} one {# image} other {up to # images}}',
  'composerWeb.limits.videos':
    '{count, plural, =0 {No video} one {# video} other {up to # videos}}',
  'composerWeb.limits.duration': 'Video up to {duration}',
  'composerWeb.limits.aspect': 'Aspect ratio between {min} and {max}',
  'composerWeb.limits.fileSize': 'Files up to {size}',
  'composerWeb.limits.mimeTypes': 'Accepted file types: {types}',
  'composerWeb.limits.source': 'From capability snapshot {version}, read {relativeTime}.',
  'composerWeb.limits.thumbnailRequired': 'एक थंबनेल आवश्यक है.',

  // --------------------------------------------------------- native fields
  'composerWeb.native.heading': '{provider} settings',
  'composerWeb.native.privacy': 'इसे कौन देख सकता है',
  'composerWeb.native.privacyChoose': 'एक श्रोता चुनें',
  'composerWeb.native.privacyExplicit':
    '{provider} does not allow a preselected audience. Choose one before this can be scheduled.',
  'composerWeb.native.community': 'समुदाय',
  'composerWeb.native.board': 'बोर्ड',
  'composerWeb.native.group': 'समूह या पेज',
  'composerWeb.native.organization': 'संगठन',
  'composerWeb.native.channel': 'चैनल',
  'composerWeb.native.publication': 'प्रकाशन',
  'composerWeb.native.disclosureHeading': 'प्रकटीकरण',
  'composerWeb.native.disclosureCommercial': 'यह पोस्ट किसी उत्पाद या सेवा का प्रचार करती है',
  'composerWeb.native.disclosureBranded': 'यह पोस्ट किसी अन्य कंपनी के लिए ब्रांडेड सामग्री है',
  'composerWeb.native.disclosureAi': 'इनमें से कुछ सामग्री AI टूल से बनाई गई थी',
  'composerWeb.native.disclosureUnsupported':
    '{provider} does not offer this disclosure through its API. Add it in the text instead.',
  'composerWeb.native.none': 'No {provider} settings apply to this post type.',

  // ---------------------------------------------------- entity resolution
  'composerWeb.entity.resolvedHeading': 'Resolved on {provider}',
  'composerWeb.entity.resolvedId': 'Account ID {externalId}',
  'composerWeb.entity.plainTextWarning':
    'Not matched. It will publish as plain text, which is not a native tag on {provider}.',
  'composerWeb.entity.removeMention': 'Remove the mention of {label}',
  'composerWeb.entity.addMention': 'एक उल्लेख जोड़ें',
  'composerWeb.entity.mentionCount':
    '{count, plural, =0 {No mentions} one {# mention} other {# mentions}}, {resolved} matched to a real account',
  'composerWeb.entity.lookupUnsupported':
    '{provider} does not offer entity lookup for this account type.',
  'composerWeb.entity.lookupNotBuilt':
    'Relay has not built entity lookup for {provider} yet. Nothing is guessed in the meantime.',
  'composerWeb.entity.searchHint': 'कम से कम दो अक्षर टाइप करें, फिर एक परिणाम चुनें।',
  'composerWeb.entity.resultCount':
    '{count, plural, =0 {No matches} one {# match} other {# matches}}',

  // ---------------------------------------------------------------- links
  'composerWeb.links.heading': 'कड़ियाँ',
  'composerWeb.links.detected':
    '{count, plural, one {# link found in this draft} other {# links found in this draft}}',
  'composerWeb.links.noneDetected': 'इस ड्राफ्ट में अभी तक कोई लिंक नहीं है.',
  'composerWeb.links.modeLabel': 'यह लिंक कैसे प्रकाशित होता है',
  'composerWeb.links.original': 'मूल URL',
  'composerWeb.links.utmSource': 'स्रोत',
  'composerWeb.links.utmMedium': 'मध्यम',
  'composerWeb.links.utmCampaign': 'अभियान',
  'composerWeb.links.utmTerm': 'अवधि',
  'composerWeb.links.utmContent': 'सामग्री',
  'composerWeb.links.domainVerified': '{domain}, verified for this workspace',
  'composerWeb.links.domainDefault': 'Relay डिफ़ॉल्ट डोमेन',
  'composerWeb.links.domainNone': 'अभी तक कोई ब्रांडेड डोमेन सत्यापित नहीं है.',
  'composerWeb.links.notAllowedHere': '{account} does not allow a link here.',

  // ------------------------------------------------------------- sequence
  'composerWeb.sequence.kindComment': 'टिप्पणी करें',
  'composerWeb.sequence.kindThread': 'धागा भाग',
  'composerWeb.sequence.kindLabel': 'आइटम प्रकार',
  'composerWeb.sequence.moveUp': 'इस आइटम को पहले ले जाएँ',
  'composerWeb.sequence.moveDown': 'इस आइटम को बाद में स्थानांतरित करें',
  'composerWeb.sequence.remove': 'इस वस्तु को हटा दें',
  'composerWeb.sequence.absoluteTime': 'Runs at {time}, which is {utc} UTC.',
  'composerWeb.sequence.partialFailure':
    'यदि कोई आइटम विफल हो जाता है, तो पहले से प्रकाशित पोस्ट प्रकाशित रहती है और उसके बाद के आइटम नहीं चलते हैं। आपको एक एक्शन आइटम मिलता है.',
  'composerWeb.sequence.maxReached':
    '{account} accepts {limit, plural, one {# follow up item} other {# follow up items}}.',
  'composerWeb.sequence.minDelay': 'The shortest delay {provider} allows here is {duration}.',
  'composerWeb.sequence.inheritAuthor': 'पोस्ट जैसा ही अकाउंट',
  'composerWeb.sequence.itemIssues':
    '{count, plural, =0 {No issues} one {# issue} other {# issues}} on this item',
  'composerWeb.sequence.customMinutes': 'पिछले आइटम के कुछ मिनट बाद',

  // --------------------------------------------------------------- repeat
  'composerWeb.repeat.enable': 'इस पोस्ट को दोहराएँ',
  'composerWeb.repeat.cadenceLabel': 'कितनी बार',
  'composerWeb.repeat.maximum': 'A repeating post can run at most {limit} times.',
  'composerWeb.repeat.occurrenceLabel': 'पदों की संख्या',
  'composerWeb.repeat.duplicateCheck':
    'प्रत्येक घटना को प्रकाशित करने से पहले डुप्लिकेट सामग्री के लिए जाँच की जाती है। एक घटना जो जाँच में विफल हो जाती है वह प्रकाशन के बजाय एक क्रिया आइटम बन जाती है।',
  'composerWeb.repeat.occurrenceList': 'पहली घटनाएँ',
  'composerWeb.repeat.occurrenceMore':
    '{count, plural, one {and # more occurrence} other {and # more occurrences}}',

  // ------------------------------------------------------ sets, signature
  'composerWeb.set.heading': 'सेट और हस्ताक्षर',
  'composerWeb.set.pickerTitle': 'एक सेट से शुरू करें',
  'composerWeb.set.pickerDescription':
    'एक सेट लक्ष्य, पाठ और सेटिंग्स भरता है। इसके द्वारा बनाया गया ड्राफ्ट स्वतंत्र होता है, इसलिए बाद में सेट को संपादित करने से स्वीकृत या शेड्यूल की गई पोस्ट कभी नहीं बदलती।',
  'composerWeb.set.accountCount': '{count, plural, one {# account} other {# accounts}}',
  'composerWeb.set.apply': 'इस सेट का प्रयोग करें',
  'composerWeb.set.none': 'अभी तक कोई सेट सहेजा नहीं गया.',
  'composerWeb.signature.pickerLabel': 'हस्ताक्षर',
  'composerWeb.signature.scope': 'For {project} on {provider} in {language}',
  'composerWeb.signature.previewHeading': 'पोस्ट कैसे ख़त्म होती है',
  'composerWeb.signature.notMatching':
    'यह हस्ताक्षर किसी भिन्न ब्रांड, प्लेटफ़ॉर्म या भाषा तक सीमित है, इसलिए इसे यहां पेश नहीं किया गया है।',

  // --------------------------------------------------------------- assist
  'composerWeb.assist.menuLabel': 'इस पाठ में सहायता करें',
  'composerWeb.assist.unavailableTitle': 'पाठ सहायता कॉन्फ़िगर नहीं की गई है',
  'composerWeb.assist.unavailableBody':
    'इस कार्यक्षेत्र के लिए कोई AI गेटवे स्थापित नहीं है, इसलिए सहायता गतिविधियाँ बंद हैं। संगीतकार में बाकी सब कुछ सामान्य रूप से काम करता है।',
  'composerWeb.assist.targetLabel': 'पर लागू होता है',
  'composerWeb.assist.targetMaster': 'मास्टर ड्राफ्ट',
  'composerWeb.assist.targetVariant': 'The version for {account}',
  'composerWeb.assist.beforeLabel': 'वर्तमान पाठ',
  'composerWeb.assist.afterLabel': 'प्रस्तावित पाठ',
  'composerWeb.assist.regionLabel': 'प्रस्तावित पाठ परिवर्तन, अभी तक लागू नहीं किया गया',
  'composerWeb.assist.added': 'जोड़ा गया',
  'composerWeb.assist.removed': 'हटा दिया गया',
  'composerWeb.assist.evidence': 'साक्ष्य और स्रोत',
  'composerWeb.assist.claimChecked': '{claim}',
  'composerWeb.assist.claimUnverified':
    'इस दावे का कोई स्रोत नहीं मिला. प्रकाशन से पहले इसकी जांच कर लें.',
  'composerWeb.assist.failed': 'सहायता अनुरोध पूरा नहीं हुआ. आपका पाठ अपरिवर्तित है.',
  'composerWeb.assist.noMediaGeneration':
    'Relay चित्र या वीडियो नहीं बनाता है। तैयार फ़ाइलें लाइब्रेरी में लाएँ और उन्हें यहाँ प्रकाशित करें।',

  // ------------------------------------------------------------- autosave
  'composerWeb.autosave.pinned':
    'यह स्वीकृत संस्करण है. इसे संपादित करने से एक नया संस्करण बनता है और अनुमोदन साफ़ हो जाता है।',
  'composerWeb.autosave.pinnedAcknowledge': 'अनुमोदन संपादित करें और साफ़ करें',
  'composerWeb.autosave.conflictTitle': 'इस मसौदे के दो संस्करण',
  'composerWeb.autosave.conflictKeepMine': 'मैंने जो लिखा है उसे रखो',
  'composerWeb.autosave.conflictKeepTheirs': 'Use the version from {name}',
  'composerWeb.autosave.conflictHelp':
    'कुछ भी स्वचालित रूप से विलय नहीं होता है। प्रति फ़ील्ड चुनें, फिर सहेजें।',
  'composerWeb.autosave.retry': 'पुनः सहेजने का प्रयास करें',

  // ------------------------------------------------------------ shortcuts
  'composerWeb.shortcuts.title': 'Composer शॉर्टकट',
  'composerWeb.shortcuts.nextTarget': 'अगला लक्ष्य',
  'composerWeb.shortcuts.previousTarget': 'पिछला लक्ष्य',
  'composerWeb.shortcuts.nextIssue': 'अगला अंक',
  'composerWeb.shortcuts.previousIssue': 'पिछला अंक',
  'composerWeb.shortcuts.save': 'अभी ड्राफ्ट सहेजें',
  'composerWeb.shortcuts.openSchedule': 'शेड्यूल शीट खोलें',
  'composerWeb.shortcuts.open': 'शॉर्टकट दिखाएँ',

  // --------------------------------------------------------------- review
  'composerWeb.review.heading': 'समीक्षा',
  'composerWeb.review.contentVersion': 'Content version {checksum}',
  'composerWeb.review.approvalPolicy': 'Policy: {policy}',
  'composerWeb.review.approverPending': 'Waiting for a decision from {approver}.',
  'composerWeb.review.approverNone': 'इन लक्ष्यों के लिए किसी अनुमोदन की आवश्यकता नहीं है।',
  'composerWeb.review.perTargetHeading': 'प्रत्येक खाते को क्या प्राप्त होता है',
  'composerWeb.review.finalUrl': 'प्रकाशित लिंक',
  'composerWeb.review.privacyState': 'Audience: {value}',
  'composerWeb.review.disclosureState': 'Disclosure: {value}',
  'composerWeb.review.disclosureNone': 'कोई प्रकटीकरण सेट नहीं',
  'composerWeb.review.mediaVersion': '{name}, version {version}',
  'composerWeb.review.blocked':
    '{count, plural, one {# target cannot be scheduled yet} other {# targets cannot be scheduled yet}}',
  'composerWeb.review.offlineBlocked':
    'शेड्यूलिंग और प्रकाशन के लिए एक कनेक्शन की आवश्यकता है. आपका ड्राफ्ट इस डिवाइस पर सुरक्षित है.',
  'composerWeb.review.publishConfirm':
    'This publishes to {count, plural, one {# account} other {# accounts}} straight away. It cannot be undone from here.',

  // ------------------------------------------------------------ page-level
  'composerWeb.page.newDraft': 'नया मसौदा',
  'composerWeb.page.loading': 'ड्राफ्ट, उसके लक्ष्य और उनकी सीमाएँ लोड हो रही हैं',
  'composerWeb.page.errorTitle': 'यह ड्राफ्ट खोला नहीं जा सका',
  'composerWeb.page.errorBody':
    'कुछ भी नहीं खोया. पुनः प्रयास करें, और यदि यह विफल रहता है तो नीचे दिया गया संदर्भ अनुरोध ढूंढने में सहायता करता है।',
  'composerWeb.page.noConnectionsTitle': 'रचना करने से पहले एक खाता कनेक्ट करें',
  'composerWeb.page.noConnectionsBody':
    'ड्राफ्ट के लिए कम से कम एक कनेक्टेड खाते की आवश्यकता होती है ताकि Relay को सीमाएं, पूर्वावलोकन और दिखाने के लिए सेटिंग्स पता हो।',
  'composerWeb.page.noConnectionsExample':
    'उदाहरण: X और LinkedIn कनेक्ट होने पर, एक ड्राफ्ट अपने स्वयं के काउंटरों के साथ दो मूल संस्करण बन जाता है।',
  'composerWeb.page.permissionTitle': 'आप इस कार्यक्षेत्र में पोस्ट नहीं बना सकते',
  'composerWeb.page.permissionBody':
    'रचना के लिए संपादक या उससे अधिक भूमिका की आवश्यकता होती है। कोई स्वामी या व्यवस्थापक आपकी भूमिका बदल सकता है.',
  'composerWeb.page.rateLimitTitle': 'कम समय में बहुत अधिक ड्राफ्ट सहेजा जाता है',
  'composerWeb.page.rateLimitCause':
    'यह कार्यक्षेत्र वर्तमान विंडो के लिए अपनी लेखन सीमा तक पहुंच गया। इस बीच आपका टेक्स्ट इस डिवाइस पर रखा जाता है।',
  'composerWeb.page.rateLimitAlternative':
    'लिखते रहो. विंडो रीसेट होने पर सेव स्वचालित रूप से शुरू हो जाता है।',

  // ==================================================== media library ====
  'mediaLib.view.grid': 'ग्रिड',
  'mediaLib.view.list': 'सूची',
  'mediaLib.view.label': 'लेआउट',
  'mediaLib.sort.label': 'क्रमबद्ध करें',
  'mediaLib.sort.newest': 'सबसे पहले नवीनतम',
  'mediaLib.sort.name': 'नाम',
  'mediaLib.sort.size': 'सबसे पहले सबसे बड़ा',
  'mediaLib.select': 'Select {name}',
  'mediaLib.column.file': 'फ़ाइल',
  'mediaLib.column.type': 'प्रकार',
  'mediaLib.column.size': 'आकार',
  'mediaLib.column.altText': 'वैकल्पिक पाठ',
  'mediaLib.column.rights': 'अधिकार',
  'mediaLib.column.added': 'जोड़ा गया',
  'mediaLib.openDetail': 'Open {name}',

  'mediaLib.empty.title': 'अभी तक कोई मीडिया नहीं',
  'mediaLib.empty.body':
    'आपके पास पहले से मौजूद चित्र और वीडियो अपलोड करें, या URL से एक फ़ाइल आयात करें। Relay आपके द्वारा प्रकाशित प्रत्येक खाते के प्रकार और आकार की जाँच करता है।',
  'mediaLib.empty.example':
    'उदाहरण: लॉन्च_हीरो.जेपीजी, 1600 गुणा 900, वैकल्पिक टेक्स्ट सेट, 2 पोस्ट में उपयोग किया गया।',
  'mediaLib.error.title': 'लाइब्रेरी लोड नहीं की जा सकी',
  'mediaLib.error.body': 'आपकी फ़ाइलें सुरक्षित हैं. इस विफलता से कुछ भी नहीं बदला.',
  'mediaLib.loading': 'आपकी मीडिया लाइब्रेरी लोड हो रही है',
  'mediaLib.permission.title': 'आप इस कार्यस्थान लाइब्रेरी को नहीं देख सकते',
  'mediaLib.permission.body':
    'मीडिया को देखने के लिए इस ब्रांड पर दर्शक की भूमिका या उससे अधिक की आवश्यकता होती है। कोई स्वामी या व्यवस्थापक इसे अनुदान दे सकता है.',

  'mediaLib.upload.heading': 'मीडिया जोड़ें',
  'mediaLib.upload.browse': 'फ़ाइलें चुनें',
  'mediaLib.upload.dropHint':
    'फ़ाइलें यहां खींचें, या उन्हें चुनें. यदि कनेक्शन बंद हो जाता है तो अपलोड फिर से शुरू हो जाता है।',
  'mediaLib.upload.queueHeading': 'अपलोड',
  'mediaLib.upload.progress': '{name}, {percent} of {size} sent',
  'mediaLib.upload.paused': 'Paused. {sent} of {size} is already stored.',
  'mediaLib.upload.resume': 'अपलोड फिर से शुरू करें',
  'mediaLib.upload.pause': 'अपलोड रोकें',
  'mediaLib.upload.cancel': 'यह अपलोड रद्द करें',
  'mediaLib.upload.retry': 'इस अपलोड को पुनः प्रयास करें',
  'mediaLib.upload.finalizing': 'Finishing {name}',
  'mediaLib.upload.done': '{name} is in your library',
  'mediaLib.upload.failed': '{name} did not finish. {reason}',
  'mediaLib.upload.offline':
    'ऑफ़लाइन. आपके पुन: कनेक्ट होने पर अपलोड वहीं से जारी रहते हैं जहां वे रुके थे।',
  'mediaLib.upload.rejectedType':
    '{name} is {mimeType}, which none of your selected accounts accept.',
  'mediaLib.upload.rejectedSize':
    '{name} is {size}. The lowest limit across your accounts is {limit}.',
  'mediaLib.upload.acceptedBy':
    '{count, plural, one {Accepted by # of your accounts} other {Accepted by # of your accounts}}',
  'mediaLib.upload.rejectedBy': 'Not accepted by {accounts}',
  'mediaLib.upload.checkedAgainst': 'इस ड्राफ्ट में चयनित खातों के विरुद्ध जाँच की गई।',
  'mediaLib.upload.noTargets':
    'कोई खाता नहीं चुना गया है, इसलिए फ़ाइल को केवल कार्यस्थान डिफ़ॉल्ट के विरुद्ध जांचा जाता है।',

  'mediaLib.alt.heading': 'वैकल्पिक पाठ',
  'mediaLib.alt.help':
    'बताएं कि जो व्यक्ति इसे नहीं देख सकता, उसके लिए छवि में क्या मायने रखता है। आमतौर पर एक या दो वाक्य पर्याप्त होते हैं।',
  'mediaLib.alt.count': '{used} of {limit} characters',
  'mediaLib.alt.requiredBy': 'Required by {accounts}',
  'mediaLib.alt.waive': 'इस छवि में कोई जानकारी नहीं है',
  'mediaLib.alt.waiveReason': 'इसके विवरण की आवश्यकता क्यों है?',
  'mediaLib.alt.waiveHelp':
    'इसका प्रयोग केवल सजावट के लिए करें। एक माफ की गई छवि एक खाली विवरण के साथ प्रकाशित होती है जहां प्लेटफ़ॉर्म इसकी अनुमति देता है।',
  'mediaLib.alt.waived': 'Waived by {name} on {date}. Reason: {reason}',
  'mediaLib.alt.unsupported':
    '{provider} does not accept alt text through its API for this account.',
  'mediaLib.alt.missingCount':
    '{count, plural, one {# file has no alt text} other {# files have no alt text}}',

  'mediaLib.rights.heading': 'अधिकार और सहमति',
  'mediaLib.rights.declared': 'Declared by {name} on {date}',
  'mediaLib.rights.undeclared':
    'अभी तक घोषित नहीं किया गया है. इस फ़ाइल के प्रकाशित होने से पहले इसकी घोषणा करें.',
  'mediaLib.rights.ownerLabel': 'इस फ़ाइल का स्वामी कौन है',
  'mediaLib.rights.ownerSelf': 'यह कार्यक्षेत्र',
  'mediaLib.rights.ownerLicensed': 'किसी और से लाइसेंस प्राप्त',
  'mediaLib.rights.ownerUgc': 'किसी ग्राहक या निर्माता ने अनुमति दी',
  'mediaLib.rights.licenseLabel': 'लाइसेंस या अनुमति संदर्भ',
  'mediaLib.rights.peopleLabel': 'लोग इस फ़ाइल में दिखाई देते हैं',
  'mediaLib.rights.peopleConsent': 'दिखाए गए सभी लोग प्रकाशित होने के लिए सहमत हुए हैं',
  'mediaLib.rights.musicLabel': 'इस फ़ाइल में संगीत या साउंडट्रैक है',
  'mediaLib.rights.confirm':
    'मेरे पास इस फ़ाइल को प्रकाशित करने का अधिकार है, जिसमें इसमें मौजूद सभी लोग, संगीत, लोगो और ब्रांड शामिल हैं।',
  'mediaLib.rights.blocking': 'अधिकार घोषित होने तक यह फ़ाइल शेड्यूल नहीं की जा सकती.',

  'mediaLib.editor.heading': 'चित्र संपादित करें',
  'mediaLib.editor.description':
    'प्रत्येक संपादन एक नए संस्करण के रूप में सहेजा जाता है। मूल फ़ाइल रखी जाती है और उसे पुनर्स्थापित किया जा सकता है।',
  'mediaLib.editor.tab.crop': 'फसल',
  'mediaLib.editor.tab.transform': 'आकार बदलें और घुमाएँ',
  'mediaLib.editor.tab.canvas': 'कैनवास',
  'mediaLib.editor.tab.output': 'प्रारूप और आकार',
  'mediaLib.editor.tab.thumbnail': 'थंबनेल',
  'mediaLib.editor.presetLabel': 'पहलू पूर्व निर्धारित',
  'mediaLib.editor.presetFree': 'निःशुल्क',
  'mediaLib.editor.presetFor': '{ratio}, used by {accounts}',
  'mediaLib.editor.cropX': 'आरंभ किनारे से काटें',
  'mediaLib.editor.cropY': 'ऊपर से काटें',
  'mediaLib.editor.cropWidth': 'फसल की चौड़ाई',
  'mediaLib.editor.cropHeight': 'फसल की ऊंचाई',
  'mediaLib.editor.cropKeyboardHint':
    'क्रॉप बॉक्स को संख्या फ़ील्ड के साथ सेट किया गया है, इसलिए यह पूरी तरह से कीबोर्ड से काम करता है।',
  'mediaLib.editor.widthLabel': 'पिक्सेल में चौड़ाई',
  'mediaLib.editor.heightLabel': 'ऊंचाई पिक्सेल में',
  'mediaLib.editor.lockRatio': 'वर्तमान अनुपात रखें',
  'mediaLib.editor.rotateLabel': 'घूर्णन',
  'mediaLib.editor.rotateDegrees': '{degrees} degrees',
  'mediaLib.editor.flipHorizontal': 'ऊर्ध्वाधर अक्ष पर पलटें',
  'mediaLib.editor.flipVertical': 'क्षैतिज अक्ष पर पलटें',
  'mediaLib.editor.canvasColor': 'पृष्ठभूमि का रंग',
  'mediaLib.editor.canvasFit': 'चित्र कैनवास पर कैसे बैठता है',
  'mediaLib.editor.canvasFitCover': 'कैनवास भरें और ओवरफ्लो को क्रॉप करें',
  'mediaLib.editor.canvasFitContain': 'पूरी तस्वीर फिट करें और बाकी को पैड करें',
  'mediaLib.editor.formatLabel': 'आउटपुट स्वरूप',
  'mediaLib.editor.qualityLabel': 'संपीड़न गुणवत्ता',
  'mediaLib.editor.qualityValue': '{value} of 100',
  'mediaLib.editor.estimatedSize': 'Estimated output {size}, from {original}',
  'mediaLib.editor.estimatedSizeUnknown': 'फ़ाइल संसाधित होने के बाद ही आउटपुट आकार ज्ञात होता है।',
  'mediaLib.editor.thumbnailHelp':
    'वीडियो थंबनेल के रूप में उपयोग किए जाने वाले फ़्रेम या फ़ाइल को चुनें जहां प्लेटफ़ॉर्म किसी को स्वीकार करता है।',
  'mediaLib.editor.thumbnailFrame': 'Frame at {time}',
  'mediaLib.editor.save': 'नये संस्करण के रूप में सहेजें',
  'mediaLib.editor.saving': 'Saving version {version}',
  'mediaLib.editor.saved': 'Version {version} saved. The original is still here.',
  'mediaLib.editor.discard': 'इन संपादनों को त्यागें',
  'mediaLib.editor.noChanges': 'सहेजने के लिए अभी तक कोई परिवर्तन नहीं.',
  'mediaLib.editor.revalidate':
    'सेविंग इस फ़ाइल को ड्राफ्ट में प्रत्येक खाते के विरुद्ध दोबारा जांचती है जो इसका उपयोग करती है।',
  'mediaLib.editor.noGeneration':
    'यह संपादक आपके द्वारा अपलोड की गई फ़ाइल को बदल देता है। यह नई कल्पना का सृजन नहीं करता.',

  'mediaLib.versions.heading': 'संस्करण',
  'mediaLib.versions.original': 'मूल अपलोड',
  'mediaLib.versions.current': 'वर्तमान संस्करण',
  'mediaLib.versions.restore': 'Restore version {version}',
  'mediaLib.versions.item': 'Version {version}, {dimensions}, {size}, {date}',

  'mediaLib.provenance.heading': 'यह फाइल कहां से आई',
  'mediaLib.provenance.sourceUrl': 'स्रोत URL',
  'mediaLib.provenance.fetchedAt': 'Fetched {date}',
  'mediaLib.provenance.declaredAuthor': 'लेखक ने कहा',
  'mediaLib.provenance.declaredLicense': 'बताया गया लाइसेंस',
  'mediaLib.provenance.contentCredentials': 'एंबेडेड सामग्री क्रेडेंशियल',
  'mediaLib.provenance.contentCredentialsNone':
    'इस फ़ाइल में कोई एम्बेडेड सामग्री क्रेडेंशियल नहीं है। यह सामान्य है और इसका मतलब यह नहीं है कि कुछ भी गलत है।',
  'mediaLib.provenance.unverified':
    'ये विवरण स्रोत से आते हैं, Relay से नहीं। उन पर भरोसा करने से पहले उनकी जांच कर लें।',

  'mediaLib.picker.title': 'मीडिया चुनें',
  'mediaLib.picker.description': 'इस ड्राफ्ट में चयनित खातों के विरुद्ध फाइलों की जाँच की जाती है।',
  'mediaLib.picker.confirm':
    '{count, plural, =0 {Choose files} one {Add # file} other {Add # files}}',
  'mediaLib.picker.forMaster': 'मास्टर ड्राफ्ट में जोड़ा जा रहा है',
  'mediaLib.picker.forVariant': 'Adding to the version for {account} only',
} as const;
