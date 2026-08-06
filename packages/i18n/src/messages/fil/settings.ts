/** Workspace settings: members, roles, brands, localization, security, data. */
export const settingsMessages = {
  'settings.title': 'Mga setting',
  'settings.saved': 'Nai-save',
  'settings.unsavedChanges': 'Mayroon kang mga hindi na-save na pagbabago.',

  'settings.workspace.title': 'Workspace',
  'settings.workspace.name': 'Workspace pangalan',
  'settings.workspace.defaultTimeZone': 'Default na time zone',
  'settings.workspace.defaultLocale': 'Default na wika ng interface',
  'settings.workspace.defaultContentLocale': 'Default na wika ng nilalaman',
  'settings.workspace.transferOwnership': 'Ilipat ang pagmamay-ari',
  'settings.workspace.delete': 'Tanggalin ang workspace',
  'settings.workspace.deleteWarning':
    'Ang pagtanggal ng workspace ay makakakansela ng mga nakaiskedyul na post, nagpapawalang-bisa sa mga koneksyon at nag-aalis ng nakaimbak na media. Ang mga resibo ay itinatago para sa panahon ng pagpapanatili na nakasaad sa Mga Tuntunin.',

  'settings.members.title': 'Mga miyembro at tungkulin',
  'settings.members.invite': 'Mag-imbita ng mga tao',
  'settings.members.inviteEmail': 'Email address',
  'settings.members.inviteSent': 'Ipinadala ang imbitasyon kay {email}.',
  'settings.members.pending': 'Inimbitahan, hindi pa tinatanggap',
  'settings.members.count': '{count, plural, one {# miyembro} other {# mga miyembro}}',
  'settings.members.removeConfirm':
    'Alisin {name} mula sa workspace na ito? Ang kanilang mga nakaraang aksyon ay nananatili sa audit log.',
  'settings.role.owner.label': 'May-ari',
  'settings.role.admin.label': 'Admin',
  'settings.role.manager.label': 'Manager',
  'settings.role.editor.label': 'Editor',
  'settings.role.approver.label': 'Approver',
  'settings.role.analyst.label': 'Analyst',
  'settings.role.viewer.label': 'manonood',
  'settings.role.owner.description': 'Lahat, kabilang ang pagsingil, seguridad at pagtanggal.',
  'settings.role.admin.description': 'Lahat maliban sa pagsingil at pagtanggal ng workspace.',
  'settings.role.manager.description':
    'Pamahalaan ang mga tatak, koneksyon, iskedyul at panuntunan.',
  'settings.role.editor.description': 'Lumikha at mag-edit ng nilalaman, humiling ng pag-apruba.',
  'settings.role.approver.description':
    'Aprubahan o tanggihan ang nilalaman, at iiskedyul kung ano ang naaprubahan.',
  'settings.role.analyst.description': 'Basahin ang analytics at mga resibo.',
  'settings.role.viewer.description': 'Basahin lamang.',
  'settings.role.scopeLabel': 'Limitahan sa mga brand at account',
  'settings.role.mfaRequired': 'Dapat gumamit ang mga may-ari ng dalawang salik na pagpapatotoo.',

  'settings.brands.title': 'Mga tatak',
  'settings.brands.add': 'Magdagdag ng tatak',
  'settings.brands.voice': 'Boses',
  'settings.brands.audience': 'Madla',
  'settings.brands.approvedClaims': 'Mga naaprubahang claim',
  'settings.brands.blockedTerms': 'Mga naka-block na termino',
  'settings.brands.disclosureDefaults': 'Disclosure defaults',
  'settings.brands.domains': 'Mga domain',
  'settings.brands.glossary.title': 'Talasalitaan',
  'settings.brands.glossary.term': 'Termino',
  'settings.brands.glossary.preferred': 'Ginustong pagsasalin',
  'settings.brands.glossary.prohibited': 'Huwag isalin bilang',
  'settings.brands.glossary.context': 'Konteksto',
  'settings.brands.glossary.keepUntranslated': 'Panatilihing hindi naisalin',
  'settings.brands.localeRules.title': 'Mga panuntunan sa lokal',
  'settings.brands.localeRules.formality': 'Formality',
  'settings.brands.localeRules.pronouns': 'Mga panghalip at parangal',
  'settings.brands.localeRules.idioms': 'Mga idyoma na dapat iwasan',
  'settings.brands.localeRules.emoji': 'Mga pamantayan ng emoji at hashtag',
  'settings.brands.localeRules.legal': 'Regional legal disclosures',
  'settings.brands.localeRules.cta': 'Call to action ayon sa market',
  'settings.brands.localeRules.reviewedExamples':
    'Mga halimbawang inaprubahan ng isang katutubong tagasuri',

  'settings.sets.title': 'Mga set',
  'settings.sets.description':
    'Isang muling magagamit na pangkat ng mga target, variant, setting, komento at pagkaantala. Ang paglalapat ng isang Set ay lumilikha ng isang independiyenteng draft.',
  'settings.sets.editNote':
    'Ang pag-edit ng isang Set ay hindi binabago ang mga post na naaprubahan na o nakaiskedyul na.',
  'settings.signatures.title': 'Mga lagda',
  'settings.signatures.description':
    'Pangwakas na text, hashtag, link o pagsisiwalat, na saklaw ng brand, platform at wika.',
  'settings.signatures.autoApply': 'Awtomatikong magdagdag kapag tumugma ang konteksto',

  'settings.localization.title': 'Lokalisasyon',
  'settings.localization.interfaceLocale': 'Wika ng interface',
  'settings.localization.interfaceLocaleHelp':
    'Ang wika ng app na ito para sa iyo. Hindi nito binabago ang wika ng iyong mga post.',
  'settings.localization.contentLocales': 'Mga wika ng nilalaman',
  'settings.localization.contentLocalesHelp':
    'Ang mga wikang iyong pina-publish. Ang bawat brand ay maaaring magtakda ng mga panuntunan at isang glossary bawat wika.',
  'settings.localization.marketLocales': 'Mga merkado ng madla',
  'settings.localization.beta': 'Beta pagsasalin',
  'settings.localization.betaHelp':
    'Ang wikang ito ay tinulungan ng makina at hindi pa ganap na sinusuri ng isang tao. Ang hindi na-translate na text ay bumabalik sa English.',
  'settings.localization.humanReviewed': 'Sinuri ng isang katutubong nagsasalita',
  'settings.localization.timeZone': 'Time zone',
  'settings.localization.weekStart': 'Unang araw ng linggo',
  'settings.localization.hourCycle.label': 'Format ng oras',
  'settings.localization.hourCycle.h12': '12 oras',
  'settings.localization.hourCycle.h23': '24 oras',

  'settings.notifications.title': 'Mga abiso',
  'settings.notifications.email': 'Email',
  'settings.notifications.inApp': 'Sa app',
  'settings.notifications.approvalRequests': 'Mga kahilingan sa pag-apruba',
  'settings.notifications.publishResults': 'I-publish ang mga resulta',
  'settings.notifications.connectionHealth': 'Kalusugan ng koneksyon',
  'settings.notifications.ruleFailures': 'Mga pagkabigo sa automation',
  'settings.notifications.weeklySummary': 'Lingguhang buod',
  'settings.notifications.digestOnly': 'Pangkatin ang mga ito sa isang pang-araw-araw na mensahe',

  'settings.security.title': 'Seguridad',
  'settings.security.mfa': 'Dalawang kadahilanan na pagpapatunay',
  'settings.security.mfaEnable': 'I-on ang two-factor authentication',
  'settings.security.mfaRequiredFor':
    'Kinakailangan para sa mga pagbabago sa pagsingil, mga account ng serbisyo, muling pagkonekta ng isang account at pagbawi ng mga kredensyal.',
  'settings.security.passkeys': 'Mga passkey',
  'settings.security.sessions': 'Mga aktibong session',
  'settings.security.sessionRevoke': 'Mag-sign out sa session na ito',
  'settings.security.auditLog.title': 'Log ng audit',
  'settings.security.auditLog.description':
    'Bawat aksyon, sino o ano ang nagsagawa nito, at kailan. Nai-export ng mga may-ari at admin.',
  'settings.security.killSwitch': 'Emergency stop',
  'settings.security.killSwitchBody':
    'Agad na ihihinto ang bawat nakaiskedyul na publikasyon at automation sa workspace na ito. Walang tinatanggal. Maaari mo itong i-off muli.',
  'settings.security.killSwitchActive': 'Naka-on ang emergency stop. Walang mag-publish na post.',

  'settings.data.title': 'Data controls',
  'settings.data.export': 'Export your data',
  'settings.data.exportPreparing': 'Preparing your export. We will email you when it is ready.',
  'settings.data.deletionRequest': 'Request deletion',
  'settings.data.deletionExplain':
    'Deletion cancels scheduled workflows, revokes provider access, removes stored media and tombstones analytics where the provider requires it.',
  'settings.data.retention': 'Retention',
  'settings.data.consents': 'Consents',
  'settings.data.consent.productAnalytics': 'Product analytics',
  'settings.data.consent.diagnostics': 'Share diagnostics with support',
  'settings.data.consent.aiImprovement':
    'Use my content to improve the assistant. This is off unless you turn it on.',
  'settings.data.consent.marketingEmail': 'Product news by email',
} as const;
