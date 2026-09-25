/**
 * The web application shell: Home, the command palette, the Action center
 * queue chrome, the demo data notice, and the parts of sign in and onboarding
 * that the shared `auth`, `onboarding` and `billing` catalogs do not cover.
 *
 * Owned by the web shell. Screen catalogs (composer, calendar, analytics)
 * belong to their own files.
 */
export const webShellMessages = {
  /* -- Document and shell chrome ----------------------------------------- */
  'shell.appName': 'ZZZप्रोटेक्टेड12ZZZ',
  'shell.documentTitle': '{page} · Post Array',
  'shell.tagline': 'लोगों और एजेंटों के लिए एक प्रकाशन डेस्क।',
  'shell.menu.open': 'मेनू खोलें',
  'shell.menu.title': 'मेनू',
  'shell.nav.more': 'अधिक',
  'shell.help.title': 'मदद',
  'shell.help.documentation': 'दस्तावेज़ीकरण',
  'shell.help.keyboardShortcuts': 'कीबोर्ड शॉर्टकट',
  'shell.help.platformStatus': 'प्लेटफार्म की स्थिति',
  'shell.help.whatChanged': 'क्या बदला',
  'shell.help.contactSupport': 'समर्थन से संपर्क करें',
  'shell.account.settings': 'सेटिंग्स',
  'shell.account.profile': 'आपकी प्रोफ़ाइल',
  'shell.workspace.create': 'एक कार्यक्षेत्र बनाएं',
  'shell.workspace.manage': 'Workspace सेटिंग्स',
  'shell.workspace.role': 'You are {role} here',

  /* -- Demo data --------------------------------------------------------- */
  'shell.demo.badge': 'डेमो डेटा',
  'shell.demo.title': 'आप डेमो डेटा देख रहे हैं',
  'shell.demo.body':
    'Post Array API इस ब्राउज़र से उपलब्ध नहीं है, इसलिए स्क्रीन एक सीडेड उदाहरण कार्यक्षेत्र से भरी हुई हैं। यहां कुछ भी वास्तविक खाते से जुड़ा नहीं है और कुछ भी प्रकाशित नहीं किया जा सकता है।',
  'shell.demo.howToConnect':
    'NEXT_PUBLIC_POSTARRAY_API_URL सेट करें और लाइव डेटा का उपयोग करने के लिए ऐप को पुनरारंभ करें।',

  /* -- Connectivity ------------------------------------------------------ */
  'shell.offline.title': 'आप ऑफ़लाइन हैं',
  'shell.offline.body':
    'इस उपकरण पर ड्राफ्ट रखे जाते हैं। कनेक्शन वापस आने पर बायोडाटा शेड्यूल करना और प्रकाशित करना।',
  'shell.offline.retry': 'कनेक्शन की जाँच करें',

  /* -- Command palette --------------------------------------------------- */
  'palette.open': 'कमांड पैलेट खोलें',
  'palette.title': 'कमांड पैलेट',
  'palette.description': 'कोई स्क्रीन, कोई खाता या कोई क्रिया खोजें.',
  'palette.placeholder': 'एक कमांड या स्क्रीन नाम टाइप करें',
  'palette.empty': 'Nothing matches {query}.',
  'palette.group.actions': 'क्रियाएँ',
  'palette.group.goTo': 'पर जाएँ',
  'palette.group.workspaces': 'ZZZप्रोटेक्टेड10ZZZs',
  'palette.group.settings': 'सेटिंग्स',
  'palette.hint.navigate': 'तीर कुंजियों के साथ आगे बढ़ें',
  'palette.hint.select': 'एंटर से खोलें',
  'palette.hint.close': 'एस्केप के साथ बंद करें',
  'palette.action.compose': 'एक पोस्ट लिखें',
  'palette.action.connectAccount': 'एक खाता कनेक्ट करें',
  'palette.action.openActionCenter': 'एक्शन सेंटर खोलें',
  'palette.action.uploadMedia': 'मीडिया अपलोड करें',
  'palette.action.createRule': 'एक स्वचालन नियम बनाएँ',
  'palette.action.toggleTheme': 'थीम स्विच करें',
  'palette.action.signOut': 'साइन आउट करें',

  /* -- Action center ----------------------------------------------------- */
  'actionCenter.open': 'एक्शन सेंटर खोलें',
  'actionCenter.group.now.label': 'अभी',
  'actionCenter.group.soon.label': 'जल्द ही',
  'actionCenter.group.watching.label': 'देख रहा हूँ',
  'actionCenter.group.now.hint': 'जब तक इन्हें संभाला नहीं जाता तब तक प्रकाशन जोखिम में है।',
  'actionCenter.group.soon.hint': 'इनकी एक समय सीमा है जिसे आप अभी भी पूरा कर सकते हैं।',
  'actionCenter.group.watching.hint': 'अत्यावश्यक नहीं. इस सप्ताह देखने लायक.',
  'actionCenter.severity.now': 'अभी आपकी जरूरत है',
  'actionCenter.severity.soon': 'जल्द ही आपकी जरूरत है',
  'actionCenter.severity.watching': 'देख रहा हूँ',
  'actionCenter.filter.all': 'सब',
  'actionCenter.filter.connections': 'कनेक्शन',
  'actionCenter.filter.publishing': 'प्रकाशन',
  'actionCenter.filter.automation': 'स्वचालन',
  'actionCenter.filter.billing': 'बिलिंग',
  'actionCenter.snoozed': 'झपकी ले ली',
  'actionCenter.snoozeOneDay': 'एक दिन के लिए झपकी लें',
  'actionCenter.snoozedUntil': 'Snoozed until {date}',
  'actionCenter.unsnooze': 'इसे वापस लाओ',
  'actionCenter.resolved': 'Resolved {relativeTime}',
  'actionCenter.emptyFiltered': 'इस समूह में किसी भी चीज़ पर ध्यान देने की आवश्यकता नहीं है।',
  'actionCenter.errorTitle': 'एक्शन सेंटर लोड नहीं हो सका',
  'actionCenter.loading': 'जिस पर ध्यान देने की आवश्यकता है उसे लोड किया जा रहा है',
  'actionCenter.affectedAccount': 'Affects {account}',
  'actionCenter.itemCount':
    '{count, plural, =0 {Nothing needs attention} one {# item} other {# items}}',
  'actionCenter.action.reconnect': 'पुनः कनेक्ट करें',
  'actionCenter.action.openReceipt': 'रसीद खोलें',
  'actionCenter.action.review': 'समीक्षा',
  'actionCenter.action.openDraft': 'ड्राफ्ट खोलें',
  'actionCenter.action.openCalendar': 'कैलेंडर खोलें',
  'actionCenter.action.viewStatus': 'स्थिति देखें',
  'actionCenter.action.checkFeed': 'फ़ीड की जाँच करें',
  'actionCenter.action.inspectDeliveries': 'डिलीवरी का निरीक्षण करें',
  'actionCenter.action.addBalance': 'उपयोग की समीक्षा करें',
  'actionCenter.action.fixConnection': 'कनेक्शन ठीक करें',

  /* -- Home -------------------------------------------------------------- */
  'home.title': 'घर',
  'home.subtitle': 'आज आपकी क्या ज़रूरत है, और आगे क्या होने वाला है।',
  'home.greetingSummary':
    '{actions, plural, =0 {Nothing needs you right now} one {# item needs you} other {# items need you}}. {upcoming, plural, =0 {Nothing is scheduled in the next 24 hours} one {# post goes out in the next 24 hours} other {# posts go out in the next 24 hours}}.',
  'home.needsYou.title': 'अभी आपकी जरूरत है',
  'home.needsYou.empty': 'अभी किसी चीज़ को तुम्हारी ज़रूरत नहीं है.',
  'home.needsYou.emptyBody':
    'कनेक्शन स्वास्थ्य, अनुमोदन और असफल प्रकाशन जैसे ही घटित होते हैं, वे यहां दिखाई देते हैं।',
  'home.needsYou.viewAll': 'एक्शन सेंटर खोलें',
  'home.needsYou.emptyQuiet':
    'शांति का आनंद लें. जिस किसी भी चीज़ के लिए निर्णय की आवश्यकता होती है, वह उसी क्षण यहाँ दिखाई देती है।',
  'home.upcoming.title': 'अगले 24 घंटे',
  'home.upcoming.empty': 'अगले 24 घंटों में कुछ भी निर्धारित नहीं है।',
  'home.upcoming.emptyBody': 'एक पोस्ट लिखें और एक समय चुनें. आप इसे बाद में बदल सकते हैं.',
  'home.upcoming.viewAll': 'कैलेंडर खोलें',
  'home.upcoming.timeZoneNote': 'Times are shown in {timeZone}, the workspace zone.',
  'home.upcoming.columnTime': 'समय',
  'home.upcoming.columnAccount': 'खाता',
  'home.upcoming.columnContent': 'सामग्री',
  'home.upcoming.columnStatus': 'स्थिति',
  'home.receipts.title': 'हाल की रसीदें',
  'home.receipts.empty': 'इस कार्यक्षेत्र से अभी तक कोई पोस्ट प्रकाशित नहीं हुई है.',
  'home.receipts.emptyBody':
    'प्रत्येक प्रकाशन एक रसीद तैयार करता है जिसका आप निरीक्षण कर सकते हैं और साझा कर सकते हैं।',
  'home.receipts.viewAll': 'सभी रसीदें',
  'home.receipts.publishedTo': 'Published to {account}',
  'home.connections.title': 'कनेक्शन स्वास्थ्य',
  'home.connections.summary':
    '{healthy, plural, one {# account is working} other {# accounts are working}}. {attention, plural, =0 {None need attention} one {# needs attention} other {# need attention}}.',
  'home.connections.viewAll': 'सभी कनेक्शन',
  'home.connections.empty': 'अभी तक कोई खाता कनेक्ट नहीं है.',
  'home.advisor.title': 'विकास सलाहकार',
  'home.advisor.summary':
    'Plan version {version} was approved {date}. Week {week} of {total} has {briefs, plural, one {# brief not yet drafted} other {# briefs not yet drafted}}.',
  'home.advisor.noPlan':
    'सलाहकार आपके द्वारा पुष्टि किए गए तथ्यों के आधार पर एक योजना बनाता है। यह कार्य का प्रस्ताव करता है और कभी भी स्वयं प्रकाशित नहीं करता है।',
  'home.advisor.openPlan': 'योजना खोलें',
  'home.advisor.createDrafts': 'Create drafts from week {week}',
  'home.advisor.start': 'व्यवसाय प्रोफ़ाइल प्रारंभ करें',
  'home.trial.banner':
    'Trial, {days, plural, =0 {ends today} one {# day left} other {# days left}}. Converts {date} to {amount}.',
  'home.trial.manage': 'प्रबंधित करें या रद्द करें',
  'home.error.title': 'होम लोड नहीं हो सका',
  'home.error.body': 'आपका कार्यक्षेत्र बरकरार है. यह Post Array API तक पहुंचने में एक समस्या है।',

  /* -- Auth: provider consent, alias sign in, honest failure ------------- */
  'auth.aside.title': 'आधिकारिक APIs के माध्यम से प्रकाशित करें और देखें कि वास्तव में क्या हुआ।',
  'auth.aside.point.receipts':
    'प्रत्येक प्रकाशन एक रसीद प्रस्तुत करता है: इसे किसने मंजूरी दी, इसे कब भेजा, मंच ने क्या लौटाया।',
  'auth.aside.point.approvals':
    'आपकी नीति के लिए आवश्यक अनुमोदन के बिना कोई भी चीज़ किसी प्लेटफ़ॉर्म तक नहीं पहुँचती है।',
  'auth.aside.point.surfaces': 'वेब ऐप, REST API, MCP, CLI और वेबहुक से समान वर्कफ़्लो।',
  'auth.provider.title': 'इससे पहले कि आप जारी रखें',
  'auth.provider.google.access':
    'Google आपका नाम, ईमेल पता और प्रोफ़ाइल चित्र Post Array के साथ साझा करता है। Post Array आपका जीमेल, ड्राइव या कैलेंडर नहीं पढ़ सकता।',
  'auth.provider.facebook.access':
    'फेसबुक आपका नाम, ईमेल पता और प्रोफ़ाइल चित्र Post Array के साथ साझा करता है। प्रकाशित करने के लिए किसी पेज को कनेक्ट करना एक अलग कदम है जिसे आप बाद में स्वीकार करेंगे।',
  'auth.provider.note':
    'यह आपको साइन इन करता है। यह प्रकाशित करने के लिए किसी खाते से कनेक्ट नहीं होता है।',
  'auth.continueWithEmail': 'ईमेल जारी रखें',
  'auth.method.password': 'पासवर्ड',
  'auth.method.magicLink': 'ईमेल लिंक',
  'auth.method.username': 'उपयोगकर्ता नाम',
  'auth.method.chooseLabel': 'आप कैसे साइन इन करना चाहते हैं?',
  'auth.username.placeholder': 'आपका-उपयोगकर्ता नाम',
  'auth.username.aliasNote':
    'उपयोगकर्ता नाम आपके खाते पर ईमेल पते के लिए एक उपनाम है। पासवर्ड वही है.',
  'auth.password.placeholder': 'आपका पासवर्ड',
  'auth.submit.signIn': 'साइन इन करें',
  'auth.submit.signUp': 'खाता बनाएं',
  'auth.submit.working': 'जाँच हो रही है',
  'auth.failure.credentials':
    'वह ईमेल पता और पासवर्ड किसी खाते से मेल नहीं खाता. दोनों की जाँच करें और पुनः प्रयास करें।',
  'auth.failure.usernameCredentials':
    'वह उपयोगकर्ता नाम और पासवर्ड किसी खाते से मेल नहीं खाता. दोनों की जाँच करें और पुनः प्रयास करें।',
  'auth.failure.noAccountLeak':
    'आपकी सुरक्षा के लिए हम यह नहीं कहते कि कोई पता पंजीकृत है या नहीं।',
  'auth.failure.provider': 'The sign in with {provider} did not complete. Nothing was changed.',
  'auth.failure.network': 'हम Post Array तक नहीं पहुंच सके। अपना कनेक्शन जांचें और पुनः प्रयास करें।',
  'auth.signUp.emailInUseNote':
    'यदि इस पते पर पहले से ही एक खाता है, तो हम दूसरा खाता बनाने के बजाय एक साइन इन लिंक ईमेल करते हैं।',
  'auth.legal.readTerms': 'शर्तें पढ़ें',
  'auth.legal.readPrivacy': 'गोपनीयता सूचना पढ़ें',
  'auth.switchToSignUp': 'एक खाता बनाएं',
  'auth.switchToSignIn': 'इसके बजाय साइन इन करें',
  'auth.checkEmail.body': 'We sent a sign in link to {email}. It works once.',
  'auth.checkEmail.wrongAddress': 'किसी भिन्न पते का उपयोग करें',

  /* -- Onboarding: the parts the shared catalog does not carry ----------- */
  'onboarding.stepName.plan': 'बिलिंग',
  'onboarding.stepName.workspace': 'ZZZप्रोटेक्टेड10ZZZ',
  'onboarding.stepName.role': 'केस का प्रयोग करें',
  'onboarding.stepName.connect': 'कनेक्ट करें',
  'onboarding.stepName.compose': 'पहली पोस्ट',
  'onboarding.stepName.receipt': 'पुष्टि',
  'onboarding.stepList': 'सेटअप चरण',
  'onboarding.stepComplete': 'हो गया',
  'onboarding.stepCurrent': 'वर्तमान कदम',
  'onboarding.exit': 'बाद में समाप्त करें',
  'onboarding.plan.intervalMonthlyLabel': '$29 प्रति माह',
  'onboarding.plan.intervalAnnualLabel': '$300 प्रति वर्ष',
  'onboarding.plan.checkoutHint':
    'अगली स्क्रीन हमारे रिकॉर्ड विक्रेता पोलर की है। एक्सेस तब दिया जाता है जब पोलर सदस्यता की पुष्टि करता है, न कि ब्राउज़र के वापस आने पर।',
  'onboarding.plan.factsTitle': 'जब आप जारी रखते हैं तो क्या होता है',
  'onboarding.workspace.help':
    'एक कार्यक्षेत्र आपकी परियोजनाएं, जुड़े खाते, ड्राफ्ट और रसीदें रखता है। आप बाद में और भी बना सकते हैं।',
  'onboarding.workspace.localeNote':
    'आपकी इंटरफ़ेस भाषा इस ऐप को बदल देती है. सामग्री भाषाएँ प्रति पोस्ट चुनी जाती हैं और इस सेटिंग से अलग होती हैं।',
  'onboarding.workspace.timeZoneDetected': 'Detected from this device: {timeZone}',
  'onboarding.connect.permissionsTitle': 'What {provider} will be asked for',
  'onboarding.connect.permissionsFooter':
    'Post Array कभी भी ऐसी अनुमति नहीं मांगता है जिसका वह उपयोग नहीं करता है, और आप किसी भी समय डिस्कनेक्ट कर सकते हैं।',
  'onboarding.connect.chooseProvider': 'एक मंच चुनें',
  'onboarding.connect.opensProvider': 'Continuing opens {provider} in this tab.',
  'onboarding.compose.help':
    'पोस्ट लिखें, फिर समय चुनने से पहले पूर्वावलोकन और सत्यापन की जांच करें।',
  'onboarding.compose.openComposer': 'पूरा कंपोज़र खोलें',
  'onboarding.receipt.title': 'आपकी पहली पोस्ट निर्धारित है',
  'onboarding.receipt.body':
    'ये है अब तक का रिकॉर्ड. यह डिस्पैच, प्रदाता प्रतिक्रिया और पहले एनालिटिक्स सिंक के माध्यम से अपडेट होता रहता है।',
  'onboarding.receipt.goHome': 'घर जाओ',
  'onboarding.blocked.title': 'इस चरण के लिए पिछले चरण की आवश्यकता है',
  'onboarding.blocked.body': 'Finish {step} first. Nothing you entered is lost.',
} as const;
