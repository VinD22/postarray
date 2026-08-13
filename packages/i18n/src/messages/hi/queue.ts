export const queueMessages = {
  'queue.title': 'पोस्टिंग कतार',
  'queue.subtitle':
    'यह प्रोजेक्ट कब पोस्ट करने को तैयार है, और कितनी दूरी पर। किसी व्यक्ति के समय स्वीकार किए बिना कुछ भी प्रकाशित नहीं होता।',

  'queue.rules.heading': 'कतार नियम',
  'queue.rules.empty':
    'अभी तक कोई कतार नियम नहीं। जब तक आप एक नहीं जोड़ते, अगला स्लॉट बस पहला खाली घंटा है।',
  'queue.rules.create': 'नया कतार नियम',
  'queue.rules.count': '{count, plural, =0 {कोई नियम नहीं} one {# नियम} other {# नियम}}',
  'queue.rules.enabled': 'उपयोग में',
  'queue.rules.disabled': 'रोका गया',
  'queue.rules.archived': 'संग्रहित',
  'queue.rules.edit': 'नियम संपादित करें',
  'queue.rules.archive': 'नियम संग्रहित करें',
  'queue.rules.archiveHelp':
    'संग्रहित करना भविष्य के प्रस्तावों को रोकता है। पहले से आरक्षित स्लॉट अपना समय और कारण बनाए रखते हैं।',

  'queue.field.name': 'नियम का नाम',
  'queue.field.nameHelp': 'एक नाम जिसे आप बाद में पहचानेंगे, उदाहरण के लिए सप्ताह के दिनों की सुबह।',
  'queue.field.timeZone': 'समय क्षेत्र',
  'queue.field.timeZoneHelp':
    'विंडो, दैनिक गिनती और ब्लैकआउट तारीखें सभी इस क्षेत्र में पढ़ी जाती हैं।',
  'queue.field.minimumGap': 'न्यूनतम अंतराल',
  'queue.field.minimumGapHelp': 'दो पोस्ट के बीच मिनट। शून्य का मतलब कोई अंतराल नियम नहीं।',
  'queue.field.maximumPerDay': 'प्रति दिन अधिकतम',
  'queue.field.maximumPerDayHelp':
    'कोई दैनिक सीमा न होने के लिए खाली छोड़ दें। शून्य का मतलब यह नियम कुछ प्रस्तावित नहीं करता।',
  'queue.field.maximumPerDayUnlimited': 'कोई दैनिक सीमा नहीं',
  'queue.field.priority': 'प्राथमिकता',
  'queue.field.priorityHelp': 'सबसे उच्च प्राथमिकता वाला नियम जो स्लॉट दे सकता है वही उपयोग किया जाता है।',
  'queue.field.enabled': 'इस नियम का उपयोग करें',

  'queue.windows.heading': 'साप्ताहिक विंडो',
  'queue.windows.help':
    'वे स्थानीय घंटे चुनें जिनमें यह प्रोजेक्ट पोस्ट कर सकता है। दिन और समय फ़ील्ड, या ग्रिड पर बटन का उपयोग करें।',
  'queue.windows.empty': 'अभी तक कोई विंडो नहीं। बिना विंडो वाला नियम कभी स्लॉट नहीं दे सकता।',
  'queue.windows.add': 'विंडो जोड़ें',
  'queue.windows.remove': 'विंडो हटाएं',
  'queue.windows.entry': '{weekday}, {start} से {end} तक',
  'queue.windows.start': 'से',
  'queue.windows.end': 'तक',
  'queue.windows.weekday': 'दिन',
  'queue.windows.toggleCell': '{weekday} को {hour} बजे',
  'queue.windows.gridLabel': 'साप्ताहिक उपलब्धता, प्रति दिन और घंटे एक बटन',

  'queue.weekday.1': 'सोमवार',
  'queue.weekday.2': 'मंगलवार',
  'queue.weekday.3': 'बुधवार',
  'queue.weekday.4': 'गुरुवार',
  'queue.weekday.5': 'शुक्रवार',
  'queue.weekday.6': 'शनिवार',
  'queue.weekday.7': 'रविवार',

  'queue.blackouts.heading': 'ब्लैकआउट तारीखें',
  'queue.blackouts.help': 'वे तारीखें जिन पर यह प्रोजेक्ट पोस्ट नहीं करेगा, नियम के समय क्षेत्र में पढ़ी गईं।',
  'queue.blackouts.empty': 'कोई ब्लैकआउट तारीख नहीं।',
  'queue.blackouts.add': 'ब्लैकआउट जोड़ें',
  'queue.blackouts.remove': 'ब्लैकआउट हटाएं',
  'queue.blackouts.from': 'पहला दिन',
  'queue.blackouts.to': 'अंतिम दिन',
  'queue.blackouts.entry': '{from} से {to} तक',

  'queue.connections.heading': 'खाते',
  'queue.connections.all': 'इस प्रोजेक्ट में हर खाता',
  'queue.connections.scoped': '{count, plural, one {# खाता} other {# खाते}} जिन पर यह नियम लागू होता है',

  'queue.slot.heading': 'अगला कतार स्लॉट',
  'queue.slot.action': 'अगले कतार स्लॉट का उपयोग करें',
  'queue.slot.proposed': '{timeZone} में {local}',
  'queue.slot.utc': 'वह UTC में {utc} है।',
  'queue.slot.why': 'यह समय क्यों',
  'queue.slot.accept': 'यह समय उपयोग करें',
  'queue.slot.release': 'दूसरा समय चुनें',
  'queue.slot.expires': 'यह प्रस्ताव {expires} तक रखा गया है।',
  'queue.slot.unavailable': 'एक कतार स्लॉट अभी अनुपलब्ध है।',
  'queue.slot.pending': 'अगला स्लॉट खोजा जा रहा है।',
  'queue.slot.accepted': '{timeZone} में {local} के लिए निर्धारित।',
  'queue.slot.notAutomatic': 'जब तक आप यह समय नहीं चुनते तब तक कुछ भी निर्धारित नहीं है।',

  'queue.reason.noRulesConfigured':
    'इस प्रोजेक्ट में कोई कतार नियम कॉन्फ़िगर नहीं है, इसलिए कोई विंडो लागू नहीं हुई।',
  'queue.reason.fallbackFirstFreeHour': 'इसके बजाय अभी के बाद पहला खाली घंटा उपयोग किया गया।',
  'queue.reason.matchedRule': 'नियम {name} ने {zone} में यह समय चुना।',
  'queue.reason.matchedWindow': 'यह {zone} में {start} से {end} तक की विंडो में आता है।',
  'queue.reason.minimumGap': 'यह हर दूसरी पोस्ट से कम से कम {minutes} मिनट है।',
  'queue.reason.noMinimumGap': 'यह नियम पोस्ट के बीच कोई न्यूनतम अंतराल निर्धारित नहीं करता।',
  'queue.reason.dailyCap': 'वह दिन अधिकतम {limit} पोस्ट रखता है, और यह पूरा नहीं भरा है।',
  'queue.reason.dailyCapUnlimited': 'यह नियम कोई दैनिक सीमा निर्धारित नहीं करता।',
  'queue.reason.blackoutSkipped':
    'इसे पाने के लिए {days, plural, one {# ब्लैकआउट दिन} other {# ब्लैकआउट दिन}} छोड़े गए।',
  'queue.reason.dstNonexistentSkipped':
    'विंडो में पहला समय {zone} में उस तारीख पर मौजूद नहीं है, इसलिए अगला मौजूद समय उपयोग किया गया।',
  'queue.reason.dstAmbiguousFirst':
    'वह स्थानीय समय {zone} में उस तारीख पर दो बार होता है। पहली घटना उपयोग की गई।',
  'queue.reason.priorityChosen': 'इस नियम की प्राथमिकता {priority} है, जो प्रस्ताव दे सकने वाली सबसे उच्च है।',
  'queue.reason.connectionScoped':
    'यह नियम {count, plural, one {# खाते} other {# खातों}} को कवर करता है।',
  'queue.reason.horizonExhausted': '{days} दिनों के भीतर कोई विंडो खाली नहीं थी।',
} as const;
