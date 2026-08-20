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
  'shell.appName': 'Relay',
  'shell.documentTitle': '{page} · Relay',
  'shell.tagline': 'Isang publishing desk para sa mga tao at ahente.',
  'shell.menu.open': 'Buksan ang menu',
  'shell.menu.title': 'Menu',
  'shell.nav.more': 'Higit pa',
  'shell.help.title': 'Tulong',
  'shell.help.documentation': 'Dokumentasyon',
  'shell.help.keyboardShortcuts': 'Mga keyboard shortcut',
  'shell.help.platformStatus': 'Katayuan ng platform',
  'shell.help.whatChanged': 'Ano ang nagbago',
  'shell.help.contactSupport': 'Makipag-ugnayan sa suporta',
  'shell.account.settings': 'Mga setting',
  'shell.account.profile': 'Ang iyong profile',
  'shell.workspace.create': 'Gumawa ng workspace',
  'shell.workspace.manage': 'Mga setting ng Workspace',
  'shell.workspace.role': 'ikaw ay {role} dito',

  /* -- Demo data --------------------------------------------------------- */
  'shell.demo.badge': 'Demo data',
  'shell.demo.title': 'Tinitingnan mo ang data ng demo',
  'shell.demo.body':
    'Ang Relay API ay hindi maabot mula sa browser na ito, kaya ang mga screen ay puno ng isang seeded na halimbawang workspace. Walang nakakonekta rito sa totoong account at walang makakapag-publish.',
  'shell.demo.howToConnect':
    'Itakda ang NEXT_PUBLIC_RELAY_API_URL at i-restart ang app para gumamit ng live na data.',

  /* -- Connectivity ------------------------------------------------------ */
  'shell.offline.title': 'Offline ka',
  'shell.offline.body':
    'Ang mga draft ay pinananatili sa device na ito. Ipagpatuloy ang pag-iskedyul at pag-publish kapag bumalik ang koneksyon.',
  'shell.offline.retry': 'Suriin ang koneksyon',

  /* -- Command palette --------------------------------------------------- */
  'palette.open': 'Buksan ang command palette',
  'palette.title': 'Command palette',
  'palette.description': 'Maghanap ng isang screen, isang account o isang aksyon.',
  'palette.placeholder': 'Mag-type ng command o screen name',
  'palette.empty': 'Walang tugma {query}.',
  'palette.group.actions': 'Mga aksyon',
  'palette.group.goTo': 'Pumunta sa',
  'palette.group.workspaces': 'Mga workspace',
  'palette.group.settings': 'Mga setting',
  'palette.hint.navigate': 'Ilipat gamit ang mga arrow key',
  'palette.hint.select': 'Buksan gamit ang Enter',
  'palette.hint.close': 'Isara sa Escape',
  'palette.action.compose': 'Gumawa ng post',
  'palette.action.connectAccount': 'Ikonekta ang isang account',
  'palette.action.openActionCenter': 'Buksan ang Action center',
  'palette.action.uploadMedia': 'Mag-upload ng media',
  'palette.action.createRule': 'Gumawa ng panuntunan sa automation',
  'palette.action.toggleTheme': 'Ilipat ang tema',
  'palette.action.signOut': 'Mag-sign out',

  /* -- Action center ----------------------------------------------------- */
  'actionCenter.open': 'Buksan ang Action center',
  'actionCenter.group.now.label': 'Ngayon',
  'actionCenter.group.soon.label': 'Malapit na',
  'actionCenter.group.watching.label': 'Nanonood',
  'actionCenter.group.now.hint': 'Nanganganib ang pag-publish hanggang sa mahawakan ang mga ito.',
  'actionCenter.group.soon.hint': 'Ang mga ito ay may deadline na maaari mo pa ring matugunan.',
  'actionCenter.group.watching.hint': 'Hindi urgent. Sulit na tingnan ngayong linggo.',
  'actionCenter.severity.now': 'Kailangan kita ngayon',
  'actionCenter.severity.soon': 'Kailangan ka sa lalong madaling panahon',
  'actionCenter.severity.watching': 'Nanonood',
  'actionCenter.filter.all': 'Lahat',
  'actionCenter.filter.connections': 'Mga koneksyon',
  'actionCenter.filter.publishing': 'Paglalathala',
  'actionCenter.filter.automation': 'Automation',
  'actionCenter.filter.billing': 'Billing',
  'actionCenter.snoozed': 'Naka-snooze',
  'actionCenter.snoozeOneDay': 'I-snooze nang isang araw',
  'actionCenter.snoozedUntil': 'Naka-snooze hanggang {date}',
  'actionCenter.unsnooze': 'Ibalik mo ito',
  'actionCenter.resolved': 'Nalutas {relativeTime}',
  'actionCenter.emptyFiltered': 'Wala sa grupong ito ang nangangailangan ng pansin.',
  'actionCenter.errorTitle': 'Hindi ma-load ang Action center',
  'actionCenter.loading': 'Naglo-load ng nangangailangan ng pansin',
  'actionCenter.affectedAccount': 'Nakakaapekto {account}',
  'actionCenter.itemCount':
    '{count, plural, =0 {Walang nangangailangan ng pansin} one {# aytem} other {# mga bagay}}',
  'actionCenter.action.reconnect': 'Kumonekta muli',
  'actionCenter.action.openReceipt': 'Buksan ang resibo',
  'actionCenter.action.review': 'Balik-aral',
  'actionCenter.action.openDraft': 'Buksan ang draft',
  'actionCenter.action.openCalendar': 'Buksan ang kalendaryo',
  'actionCenter.action.viewStatus': 'Tingnan ang katayuan',
  'actionCenter.action.checkFeed': 'Suriin ang feed',
  'actionCenter.action.inspectDeliveries': 'Suriin ang mga paghahatid',
  'actionCenter.action.addBalance': 'Suriin ang paggamit',
  'actionCenter.action.fixConnection': 'Ayusin ang koneksyon',

  /* -- Home -------------------------------------------------------------- */
  'home.title': 'Bahay',
  'home.subtitle': 'Ano ang kailangan mo ngayon, at kung ano ang susunod na lalabas.',
  'home.greetingSummary':
    '{actions, plural, =0 {Walang nangangailangan sa iyo ngayon} one {# kailangan ka ng item} other {# kailangan ka ng mga item}}. {upcoming, plural, =0 {Walang nakaiskedyul sa susunod na 24 na oras} one {# lalabas ang post sa susunod na 24 na oras} other {# lalabas ang mga post sa susunod na 24 na oras}}.',
  'home.needsYou.title': 'Kailangan kita ngayon',
  'home.needsYou.empty': 'Walang nangangailangan sa iyo ngayon.',
  'home.needsYou.emptyBody':
    'Lumalabas dito ang kalusugan ng koneksyon, mga pag-apruba at mga nabigong pag-publish sa sandaling mangyari ang mga ito.',
  'home.needsYou.viewAll': 'Buksan ang Action center',
  'home.needsYou.emptyQuiet':
    'Tangkilikin ang tahimik. Ang anumang bagay na nangangailangan ng desisyon ay lalabas dito sa sandaling gawin nito.',
  'home.upcoming.title': 'Susunod na 24 na oras',
  'home.upcoming.empty': 'Walang nakaiskedyul sa susunod na 24 na oras.',
  'home.upcoming.emptyBody':
    'Sumulat ng post at pumili ng oras. Maaari mo itong baguhin sa ibang pagkakataon.',
  'home.upcoming.viewAll': 'Buksan ang kalendaryo',
  'home.upcoming.timeZoneNote': 'Ang mga oras ay ipinapakita sa {timeZone}, ang workspace zone.',
  'home.upcoming.columnTime': 'Oras',
  'home.upcoming.columnAccount': 'Account',
  'home.upcoming.columnContent': 'Nilalaman',
  'home.upcoming.columnStatus': 'Katayuan',
  'home.receipts.title': 'Mga kamakailang resibo',
  'home.receipts.empty': 'Wala pang post na na-publish mula sa workspace na ito.',
  'home.receipts.emptyBody':
    'Ang bawat publikasyon ay gumagawa ng isang resibo na maaari mong suriin at ibahagi.',
  'home.receipts.viewAll': 'Lahat ng resibo',
  'home.receipts.publishedTo': 'Na-publish sa {account}',
  'home.connections.title': 'Kalusugan ng koneksyon',
  'home.connections.summary':
    '{healthy, plural, one {# gumagana ang account} other {# gumagana ang mga account}}. {attention, plural, =0 {Walang nangangailangan ng pansin} one {# nangangailangan ng atensyon} other {# kailangan ng atensyon}}.',
  'home.connections.viewAll': 'Lahat ng koneksyon',
  'home.connections.empty': 'Wala pang mga account na nakakonekta.',
  'home.advisor.title': 'Tagapayo sa paglago',
  'home.advisor.summary':
    'Bersyon ng plano {version} ay naaprubahan {date}. Linggo {week} ng {total} may {briefs, plural, one {# maikling hindi pa nakabalangkas} other {# brief na hindi pa nakadraft}}.',
  'home.advisor.noPlan':
    'Ang tagapayo ay bubuo ng plano mula sa mga katotohanang kinumpirma mo. Ito ay nagmumungkahi ng trabaho at hindi kailanman naglalathala nang mag-isa.',
  'home.advisor.openPlan': 'Buksan ang plano',
  'home.advisor.createDrafts': 'Gumawa ng mga draft mula sa linggo {week}',
  'home.advisor.start': 'Simulan ang profile ng negosyo',
  'home.trial.banner':
    'Trial, {days, plural, =0 {ends today} one {# day left} other {# days left}}. Converts {date} to {amount}.',
  'home.trial.manage': 'Manage or cancel',
  'home.error.title': 'Hindi makapag-load ang bahay',
  'home.error.body': 'Ang iyong workspace ay buo. Ito ay isang problema sa pag-abot sa Relay API.',

  /* -- Auth: provider consent, alias sign in, honest failure ------------- */
  'auth.aside.title':
    'Mag-publish sa pamamagitan ng mga opisyal na API at tingnan kung ano mismo ang nangyari.',
  'auth.aside.point.receipts':
    'Ang bawat publikasyon ay gumagawa ng isang resibo: sino ang nag-apruba nito, noong ipinadala nito, kung ano ang ibinalik ng platform.',
  'auth.aside.point.approvals':
    'Walang makakarating sa isang platform nang walang pag-apruba na kailangan ng iyong patakaran.',
  'auth.aside.point.surfaces':
    'Ang parehong daloy ng trabaho mula sa web app, ang REST API, MCP, ang CLI at mga webhook.',
  'auth.provider.title': 'Bago ka magpatuloy',
  'auth.provider.google.access':
    'Ibinahagi ng Google ang iyong pangalan, email address at larawan sa profile sa Relay. Hindi mabasa ng Relay ang iyong Gmail, Drive o Calendar.',
  'auth.provider.facebook.access':
    'Ibinahagi ng Facebook ang iyong pangalan, email address at larawan sa profile sa Relay. Ang pagkonekta sa isang Pahina kung saan i-publish ay isang hiwalay na hakbang na aaprubahan mo sa ibang pagkakataon.',
  'auth.provider.note':
    'Sina-sign in ka nito. Hindi ito nagkokonekta ng account kung saan mag-publish.',
  'auth.continueWithEmail': 'Magpatuloy sa email',
  'auth.method.password': 'Password',
  'auth.method.magicLink': 'Link ng email',
  'auth.method.username': 'Username',
  'auth.method.chooseLabel': 'Paano mo gustong mag-sign in?',
  'auth.username.placeholder': 'iyong-username',
  'auth.username.aliasNote':
    'Ang isang username ay isang alias para sa email address sa iyong account. Ang password ay pareho.',
  'auth.password.placeholder': 'Ang iyong password',
  'auth.submit.signIn': 'Mag-sign in',
  'auth.submit.signUp': 'Gumawa ng account',
  'auth.submit.working': 'Sinusuri',
  'auth.failure.credentials':
    'Ang email address at password na iyon ay hindi tumutugma sa isang account. Suriin pareho at subukang muli.',
  'auth.failure.usernameCredentials':
    'Ang username at password na iyon ay hindi tumutugma sa isang account. Suriin pareho at subukang muli.',
  'auth.failure.noAccountLeak':
    'Para sa iyong kaligtasan hindi namin sinasabi kung nakarehistro ang isang address.',
  'auth.failure.provider':
    'Ang pag-sign in gamit ang {provider} hindi nakumpleto. Walang pinagbago.',
  'auth.failure.network':
    'Hindi namin maabot ang Relay. Suriin ang iyong koneksyon at subukang muli.',
  'auth.signUp.trialNote':
    'Pitong buong araw ng pagsubok. Kailangan ng paraan ng pagbabayad. $0 na dapat bayaran ngayon.',
  'auth.signUp.emailInUseNote':
    'Kung mayroon nang account ang address na ito, nag-email kami ng link sa pag-sign in sa halip na gumawa ng pangalawa.',
  'auth.legal.readTerms': 'Basahin ang Mga Tuntunin',
  'auth.legal.readPrivacy': 'Basahin ang Paunawa sa Privacy',
  'auth.switchToSignUp': 'Gumawa ng account',
  'auth.switchToSignIn': 'Mag-sign in na lang',
  'auth.checkEmail.body':
    'Nagpadala kami ng link sa pag-sign in {email}. Ito ay gumagana nang isang beses.',
  'auth.checkEmail.wrongAddress': 'Gumamit ng ibang address',

  /* -- Onboarding: the parts the shared catalog does not carry ----------- */
  'onboarding.stepName.plan': 'Pagsingil',
  'onboarding.stepName.workspace': 'Workspace',
  'onboarding.stepName.role': 'Use case',
  'onboarding.stepName.connect': 'Kumonekta',
  'onboarding.stepName.compose': 'Unang post',
  'onboarding.stepName.receipt': 'Kumpirmasyon',
  'onboarding.stepList': 'Mga hakbang sa pag-setup',
  'onboarding.stepComplete': 'Tapos na',
  'onboarding.stepCurrent': 'Kasalukuyang hakbang',
  'onboarding.exit': 'Tapusin mamaya',
  'onboarding.plan.intervalMonthlyLabel': '$29 bawat buwan',
  'onboarding.plan.intervalAnnualLabel': '$300 bawat taon',
  'onboarding.plan.checkoutHint':
    'Ang susunod na screen ay si Polar, ang aming merchant of record. Ibinibigay ang access kapag kinumpirma ng Polar ang subscription, hindi kapag bumalik ang browser.',
  'onboarding.plan.factsTitle': 'Ano ang mangyayari kapag nagpatuloy ka',
  'onboarding.workspace.help':
    'Hawak ng isang workspace ang iyong mga proyekto, konektadong account, draft, at resibo. Maaari kang lumikha ng higit pa sa ibang pagkakataon.',
  'onboarding.workspace.localeNote':
    'Binabago ng iyong wika sa interface ang app na ito. Pinipili ang mga wika ng nilalaman bawat post at hiwalay sa setting na ito.',
  'onboarding.workspace.timeZoneDetected': 'Nakita mula sa device na ito: {timeZone}',
  'onboarding.connect.permissionsTitle': 'ano {provider} hihilingin',
  'onboarding.connect.permissionsFooter':
    'Ang Relay ay hindi kailanman humihingi ng pahintulot na hindi nito ginagamit, at maaari kang magdiskonekta anumang oras.',
  'onboarding.connect.chooseProvider': 'Pumili ng platform',
  'onboarding.connect.opensProvider': 'Ang patuloy na pagbukas {provider} sa tab na ito.',
  'onboarding.compose.help':
    'Isulat ang post, pagkatapos ay suriin ang preview at ang validation bago ka pumili ng oras.',
  'onboarding.compose.openComposer': 'Buksan ang buong kompositor',
  'onboarding.receipt.title': 'Ang iyong unang post ay naka-iskedyul',
  'onboarding.receipt.body':
    'Narito ang rekord sa ngayon. Patuloy itong nag-a-update sa pamamagitan ng dispatch, tugon ng provider at ang unang pag-sync ng analytics.',
  'onboarding.receipt.goHome': 'Pumunta sa Bahay',
  'onboarding.blocked.title': 'Ang hakbang na ito ay nangangailangan ng nauna',
  'onboarding.blocked.body': 'Tapusin {step} una. Walang nawala sa pinasok mo.',
} as const;
