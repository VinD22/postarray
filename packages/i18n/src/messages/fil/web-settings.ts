/**
 * Web catalog for settings, the developer portal, billing and the Growth
 * Advisor.
 *
 * This file only adds what the web screens need on top of the intent catalogs
 * in `settings.ts`, `developer.ts`, `billing.ts` and `growth.ts`. Everything
 * here lives under a `.ui.` segment so a key can never collide with one of
 * those files when the catalogs are merged.
 *
 * Several strings are mandated word for word and must not be softened:
 *  - `billing.ui.annualFraming` states the saving in currency, never a percent.
 *  - `billing.ui.cancelConfirmedBeforeConversion` must read
 *    "Canceled. You will not be charged."
 *  - the media generation boundary paragraph is NOT restated here. It already
 *    exists as `billing.mediaGeneration.explanation`, and the Tool Radar
 *    renders that same key so there is one sentence to review and translate.
 */
export const webSettingsMessages = {
  /* ------------------------------------------------------------------ shell */

  'settings.ui.subtitle': 'Lahat ng nagko-configure sa workspace na ito. Walang naglalathala dito.',
  'settings.ui.nav.label': 'Mga seksyon ng mga setting',
  'settings.ui.index.help':
    'Pumili ng isang seksyon. Ang bawat pagbabago ay iniuugnay sa iyo at lumalabas sa log ng pag-audit.',

  'settings.ui.section.members': 'Mga miyembro at tungkulin',
  'settings.ui.section.membersSummary':
    'Sino ang nasa workspace na ito at kung ano ang magagawa ng bawat tao.',
  'settings.ui.section.projects': 'Mga tatak',
  'settings.ui.section.projectsSummary':
    'Boses, audience, naaprubahang claim, naka-block na termino, lokal na panuntunan, domain at glossary.',
  'settings.ui.section.agents': 'Mga Ahente at API',
  'settings.ui.section.agentsSummary':
    'Mga account ng serbisyo, saklaw, limitasyon, kredensyal, aktibidad at ang dry run na palaruan.',
  'settings.ui.section.apps': 'Mga app ng developer',
  'settings.ui.section.appsSummary':
    'Mga third party na OAuth na application, redirect allowlist, pahintulot, at grant.',
  'settings.ui.section.webhooks': 'Mga Webhook',
  'settings.ui.section.webhooksSummary':
    'Mga nilagdaang palabas na kaganapan, mga tala ng paghahatid, muling paghahatid at lihim na pag-ikot.',
  'settings.ui.section.billing': 'Billing',
  'settings.ui.section.billingSummary':
    'Plan, trial, interval, metered provider usage, invoices and cancellation.',
  'settings.ui.section.referrals': 'Referral at kaakibat',
  'settings.ui.section.referralsSummary':
    'Ang iyong isiniwalat na link ng referral, mga nauugnay na pag-signup at katayuan ng komisyon.',
  'settings.ui.section.localization': 'Lokalisasyon',
  'settings.ui.section.localizationSummary':
    'Interface na wika, mga wika ng nilalaman, mga merkado, time zone at format ng oras.',
  'settings.ui.section.security': 'Seguridad',
  'settings.ui.section.securitySummary':
    'Mga session, dalawang salik na pagpapatotoo, mga kredensyal, mga ahente, webhook at mga pagbibigay ng app.',
  'settings.ui.section.data': 'Mga kontrol sa data',
  'settings.ui.section.dataSummary':
    'I-export, bawiin ang isang koneksyon, tanggalin ang isang project, tanggalin ang nilalaman o isara ang account.',

  /* ------------------------------------------------------- shared UI states */

  'settings.ui.state.loading': 'Naglo-load {section}',
  'settings.ui.state.errorTitle': 'Hindi kami makapag-load {section}',
  'settings.ui.state.errorRetry': 'Subukan muli',
  'settings.ui.state.savingAnnouncement': 'Nagtitipid {section}',
  'settings.ui.state.savedAnnouncement': '{section} nailigtas',
  'settings.ui.state.saveFailedAnnouncement':
    '{section} ay hindi nailigtas. Ang iyong input ay narito pa rin.',
  'settings.ui.state.offlineTitle': 'Offline ka',
  'settings.ui.state.offlineBody':
    'Maaari mong basahin ang pahinang ito. Ang mga pagbabago ay hindi mai-save hanggang sa bumalik ang koneksyon.',
  'settings.ui.state.permissionTitle': 'Wala kang access sa {section}',
  'settings.ui.state.permissionBody':
    'Binabago ng seksyong ito kung paano kumikilos ang workspace, kaya nililimitahan ito ng tungkulin.',
  'settings.ui.state.permissionRequirements': 'Ang kailangan mo',
  'settings.ui.state.permissionContact':
    'Maaaring ibigay ito ng isang may-ari o isang admin ng workspace na ito. Nakalista sila sa ilalim ng Mga Miyembro at mga tungkulin.',
  'settings.ui.state.rateLimitTitle': 'Masyadong maraming pagbabago sa maikling panahon',
  'settings.ui.state.rateLimitCause':
    'Naabot ng workspace na ito ang limitasyon sa pagsusulat para sa mga pagbabago sa mga setting.',
  'settings.ui.state.rateLimitReset': 'Limitahan ang pag-reset',
  'settings.ui.state.rateLimitAlternative':
    'Walang nawala sa iyong nailigtas. Ang mga read only na aksyon ay gumagana pa rin habang naghihintay ka.',
  'settings.ui.state.rateLimitUsage': 'Sinusulat ng mga setting ang oras na ito',
  'settings.ui.state.rateLimitUsageText': '{used} ng {limit} ginamit',
  'settings.ui.state.unsavedTitle': 'Mayroon kang mga hindi na-save na pagbabago',
  'settings.ui.state.unsavedBody': 'I-save ang mga ito bago ka umalis sa seksyong ito.',
  'settings.ui.state.readOnlyTitle': 'Ang workspace na ito ay read only',
  'settings.ui.state.readOnlyBody':
    'Lampas na sa takdang petsa ang pagsingil. Ang iyong nilalaman, mga resibo at mga koneksyon ay buo. Maaaring basahin ang mga setting ngunit hindi binago.',

  'settings.ui.state.referenceLabel': 'Suporta sa sanggunian',

  'settings.ui.attribution': 'Binago ng {name} {relativeTime}',
  'settings.ui.attributionNever': 'Hindi nagbago mula nang ito ay nilikha',
  'settings.ui.copyFailed':
    'Hinarangan ng iyong browser ang kopya. Piliin ang teksto at kopyahin ito nang manu-mano.',

  /* ------------------------------------------------------- members and roles */

  'settings.ui.members.description':
    'Ang bawat imbitasyon, pagpapalit ng tungkulin at pag-alis ay itinatala kasama ng iyong pangalan at oras.',
  'settings.ui.members.tableCaption': 'Mga tao sa workspace na ito, na may tungkulin at saklaw',
  'settings.ui.members.column.person': 'Tao',
  'settings.ui.members.column.role': 'Tungkulin',
  'settings.ui.members.column.scope': 'Saklaw',
  'settings.ui.members.column.approvals': 'Mga pag-apruba',
  'settings.ui.members.column.lastActive': 'Huling aktibo',
  'settings.ui.members.column.actions': 'Mga aksyon',
  'settings.ui.members.scopeAll': 'Lahat ng project at account',
  'settings.ui.members.scopeLimited': '{count, plural, one {# tatak} other {# mga tatak}}: {names}',
  'settings.ui.members.approvals.canApprove': 'Pwedeng aprubahan',
  'settings.ui.members.approvals.cannotApprove': 'Hindi maaprubahan',
  'settings.ui.members.approvals.canApproveOwnProjects':
    'Maaaring mag-apruba para sa mga tatak na nakalista',
  'settings.ui.members.lastActiveNever': 'Hindi pa nakakapag-sign in',
  'settings.ui.members.changeRole': 'Baguhin ang tungkulin para sa {name}',
  'settings.ui.members.remove': 'Alisin {name}',
  'settings.ui.members.lastOwnerTitle':
    'Ang isang workspace ay nagpapanatili ng kahit isang may-ari',
  'settings.ui.members.lastOwnerBody':
    'Gawin munang may-ari ang ibang tao, pagkatapos ay magiging available ang pagbabagong ito.',
  'settings.ui.members.inviteTitle': 'Mag-imbita ng isang tao sa workspace na ito',
  'settings.ui.members.inviteBody':
    'Nakatanggap sila ng email na may link. Mag-e-expire ang imbitasyon pagkatapos ng pitong araw at maaari mo itong bawiin bago iyon.',
  'settings.ui.members.inviteRole': 'Tungkulin',
  'settings.ui.members.inviteScope': 'Mga tatak kung saan sila maaaring magtrabaho',
  'settings.ui.members.inviteScopeAll': 'Bawat project sa workspace na ito',
  'settings.ui.members.inviteScopeSelected': 'Tanging ang mga tatak lamang ang aking pipiliin',
  'settings.ui.members.inviteApprovals': 'Maaaring magpasya ng mga kahilingan sa pag-apruba',
  'settings.ui.members.inviteApprovalsHelp':
    'Tanging mga tungkulin na may kasamang pagsusuri ang maaaring ibigay nito. Ito ay hiwalay sa pag-edit.',
  'settings.ui.members.inviteSubmit': 'Magpadala ng imbitasyon',
  'settings.ui.members.invitePending': 'Inimbitahan {relativeTime} sa pamamagitan ng {name}',
  'settings.ui.members.inviteRevoke': 'Bawiin ang imbitasyon',
  'settings.ui.members.inviteResend': 'Ipadala muli ang imbitasyon',
  'settings.ui.members.emptyTitle': 'Ikaw lang ang tao dito',
  'settings.ui.members.emptyBody':
    'Anyayahan ang mga taong sumulat, nag-apruba o nagbabasa ng mga resulta. Ang bawat isa ay nakakakuha ng tungkulin at saklaw ng tatak.',
  'settings.ui.members.emptyExample':
    'Isang karaniwang hugis: isang may-ari para sa pagsingil, isang approver bawat project, at mga editor na nag-draft ngunit hindi kailanman nagpa-publish.',
  'settings.ui.members.roleReferenceTitle': 'Ano ang kayang gawin ng bawat tungkulin',
  'settings.ui.members.roleReferenceCaption':
    'Mga tungkulin at mga aksyon na pinapayagan ng bawat isa',
  'settings.ui.members.roleColumn.role': 'Tungkulin',
  'settings.ui.members.roleColumn.can': 'Magagawa',
  'settings.ui.members.roleColumn.cannot': 'Hindi magawa',
  'settings.ui.members.roleCannot.owner': 'Walang ipinagkait sa isang may-ari.',
  'settings.ui.members.roleCannot.admin': 'Baguhin ang pagsingil, o tanggalin ang workspace.',
  'settings.ui.members.roleCannot.manager':
    'Baguhin ang pagsingil, mga tungkulin o pagtanggal ng workspace.',
  'settings.ui.members.roleCannot.editor':
    'Aprubahan, iiskedyul, i-publish o baguhin ang mga koneksyon.',
  'settings.ui.members.roleCannot.approver': 'Baguhin ang mga koneksyon, panuntunan o pagsingil.',
  'settings.ui.members.roleCannot.analyst':
    'Lumikha, mag-edit, mag-apruba o mag-publish ng anuman.',
  'settings.ui.members.roleCannot.viewer': 'Baguhin ang anumang bagay.',
  'settings.ui.members.removeTitle': 'Alisin {name} mula sa workspace na ito',
  'settings.ui.members.removeConsequence.access': 'Nawalan agad sila ng access, sa bawat ibabaw.',
  'settings.ui.members.removeConsequence.drafts':
    'Ang mga draft na isinulat nila ay nananatili sa workspace at nananatiling nae-edit.',
  'settings.ui.members.removeConsequence.audit':
    'Ang kanilang mga nakaraang aksyon ay nananatili sa audit log at sa mga resibo.',
  'settings.ui.members.removeConsequence.approvals':
    'Ang mga kahilingan sa pag-apruba na naghihintay sa kanila ay bumalik sa pila para sa isa pang approver.',

  /* ----------------------------------------------------------------- projects */

  'settings.ui.projects.description':
    'Ang isang project ay nagdadala ng mga panuntunan kung saan sinusuri ang nilalaman: kung ano ang maaari mong i-claim, kung ano ang hindi mo maaaring sabihin, at kung paano isinusulat ang bawat wika.',
  'settings.ui.projects.listCaption': 'Mga project sa workspace na ito',
  'settings.ui.projects.column.project': 'Proyekto',
  'settings.ui.projects.column.locales': 'Mga wika ng nilalaman',
  'settings.ui.projects.column.accounts': 'Mga account',
  'settings.ui.projects.column.updated': 'Na-update',
  'settings.ui.projects.accountCount':
    '{count, plural, =0 {Walang mga account} one {# account} other {# mga account}}',
  'settings.ui.projects.emptyTitle': 'Gawin ang iyong unang proyekto',
  'settings.ui.projects.emptyBody':
    "Ang isang project ay nagpapangkat ng mga account, mga panuntunan sa pag-apruba at mga panuntunan sa wika. Karamihan sa mga koponan ay nagsisimula sa isa at nagdaragdag ng isang segundo kapag ang isang kliyente o isang market ay nangangailangan ng iba't ibang mga panuntunan.",
  'settings.ui.projects.emptyExample':
    'Halimbawa: maaaring maging tatlong hiwalay na project ang Acme App, Acme Podcast at kliyenteng Northwind sa iisang workspace.',
  'settings.ui.projects.voiceHelp':
    'Ano ang dapat na tunog ng project na ito. Ginagamit kapag humiling ka ng muling pagsulat at kapag nasuri ang mga claim.',
  'settings.ui.projects.audienceHelp': 'Para kanino ang content, bawat market.',
  'settings.ui.projects.approvedClaimsHelp':
    'Mga pahayag na na-clear ng isang reviewer. Ang anumang bagay sa labas ng listahang ito ay na-flag bago ang pag-apruba, hindi pagkatapos ng pag-publish.',
  'settings.ui.projects.blockedTermsHelp':
    'Mga salitang humaharang sa pag-iiskedyul para sa project na ito. Isa sa bawat linya.',
  'settings.ui.projects.domainsHelp':
    'Mga domain na maaaring i-link at paikliin ng project na ito. Ang mga na-verify na domain lamang ang maaaring piliin sa kompositor.',
  'settings.ui.projects.domainVerified': 'Na-verify {date}',
  'settings.ui.projects.domainPending': 'Hindi pa nakikita ang DNS record',
  'settings.ui.projects.domainVerificationUnavailable': 'Hindi pa nagagawa ang pag-verify',
  'settings.ui.projects.disclosureUnavailable':
    'Hindi pa nagagawa ang mga default na disclosure kada channel. Idagdag ang kinakailangang disclosure sa post mismo hanggang ma-launch ito.',
  'settings.ui.projects.glossaryUnavailable':
    'Hindi pa nagagawa ang glossary ng workspace. Nase-save at ipinapatupad pa rin ang tono, audience, na-approve na claim, at naka-block na termino sa itaas.',
  'settings.ui.projects.localeRulesUnavailable':
    'Hindi pa nagagawa ang mga panuntunan sa pagsulat kada locale. Available pa rin ang mga wika at market ng workspace sa ilalim ng Localization.',
  'settings.ui.projects.disclosureHelp':
    'Nailalapat bilang default sa kompositor para sa mga platform na pinili mo dito. Puwede itong baguhin kada post bago ang pag-apruba.',
  'settings.ui.projects.glossaryHelp':
    'Mga pangalan ng produkto, legal na termino at anumang bagay na dapat mabuhay sa pagsasalin nang hindi nagbabago.',
  'settings.ui.projects.glossaryCaption':
    'Mga protektadong termino at kung paano pinangangasiwaan ang bawat isa sa bawat wika',
  'settings.ui.projects.glossaryEmpty':
    'Wala pang protektadong tuntunin. Magdagdag ng mga pangalan ng produkto at legal na termino na hindi dapat isalin o i-rephrase.',
  'settings.ui.projects.localeRulesHelp':
    'Mga panuntunan sa bawat wika ng nilalaman. Inilapat ang mga ito kapag nag-adapt ka o nag-transcreate, at ipinapakita sa reviewer.',
  'settings.ui.projects.saveProject': 'I-save ang proyekto',
  'settings.ui.projects.capacityTitle': 'Kapasidad ng proyekto',
  'settings.ui.projects.capacityHelp':
    'Kasama sa $29 na base plan ang 3 aktibong proyekto. Puwedeng magkaroon ang isang workspace ng entitlement na hanggang 20 nang hindi gumagawa ng ibang account.',
  'settings.ui.projects.capacitySummary': '{used} sa {limit}',
  'settings.ui.projects.atLimitTitle': 'Nagamit na ng workspace na ito ang lahat ng slot para sa proyekto',
  'settings.ui.projects.atLimitBody':
    'I-archive ang isang hindi aktibong proyekto o baguhin ang entitlement ng workspace bago magdagdag ng iba pa. Ang kasalukuyang limitasyon ay {limit}.',
  'settings.ui.projects.listLabel': 'Pumili ng proyekto na i-e-edit',
  'settings.ui.projects.detailsTitle': 'Mga detalye ng proyekto',
  'settings.ui.projects.projectMeta':
    '{accounts, plural, =0 {Walang channel} one {# channel} other {# na channel}} · Na-update {updated}',
  'settings.ui.projects.archiveAction': 'I-archive ang proyekto',
  'settings.ui.projects.archiveTitle': 'I-archive ang {project}?',
  'settings.ui.projects.archiveBody':
    'Aalis ang hindi aktibong proyektong ito sa aktibong workspace at magpapalaya ng isang slot para sa proyekto.',
  'settings.ui.projects.archiveChannels':
    'Titigil sa pagpapakita ang mga konektadong channel nito sa mga aktibong daloy ng proyekto.',
  'settings.ui.projects.archiveHistory':
    'Pananatilihin ang mga draft, na-publish na post, resibo, at audit history.',
  'settings.ui.projects.archiveLastDisabled': 'Panatilihing may kahit isang aktibong proyekto sa workspace.',
  'settings.ui.projects.archiveConnectedDisabled':
    'Idiskonekta ang mga channel ng proyektong ito bago ito i-archive.',

  /* ------------------------------------------------------------ localization */

  'settings.ui.localization.description':
    'Tatlong magkahiwalay na setting: ang wika ng app na ito, ang mga wika kung saan ka nagpa-publish, at ang mga market kung saan ka nagsusulat. Ang pagbabago ng isa ay hindi nagbabago sa isa pa.',
  'settings.ui.localization.interfaceOnlyEnglish':
    'Pumili ng wika ng interface para sa app na ito. Ang mga wika ng nilalaman ay hiwalay at magagamit na.',
  'settings.ui.localization.marketHelp':
    'Ang isang merkado ay nagbabago ng mga halimbawa, legal na pagsisiwalat at mga tawag sa pagkilos. Hindi nito binabago ang wika ng isang post.',
  'settings.ui.localization.previewTitle': 'Paano mababasa ang mga petsa at numero',
  'settings.ui.localization.previewDate': 'Petsa',
  'settings.ui.localization.previewTime': 'Oras',
  'settings.ui.localization.previewNumber': 'Numero',
  'settings.ui.localization.previewCurrency': 'Pera',
  'settings.ui.localization.weekStartHelp': 'Ginagamit ng view ng linggo ng kalendaryo.',

  /* ---------------------------------------------------------------- security */

  'settings.ui.security.description':
    'Lahat ng maaaring kumilos sa workspace na ito, sa isang lugar: ang iyong mga session, kredensyal, ahente, webhook at ang mga app na binigyan mo ng access.',
  'settings.ui.security.sessionsCaption': 'Mga naka-sign in na session para sa iyong account',
  'settings.ui.security.sessionColumn.device': 'Device at browser',
  'settings.ui.security.sessionColumn.location': 'Tinatayang lokasyon',
  'settings.ui.security.sessionColumn.lastSeen': 'Huling ginamit',
  'settings.ui.security.sessionCurrent': 'Ang session na ito',
  'settings.ui.security.sessionRevokeAll': 'Mag-sign out sa bawat iba pang session',
  'settings.ui.security.sessionLocationUnknown': 'Hindi naitala ang lokasyon',
  'settings.ui.security.mfaOn': 'Naka-on ang two-factor authentication',
  'settings.ui.security.mfaOff': 'Naka-off ang two-factor na pagpapatotoo',
  'settings.ui.security.mfaBody':
    'Ang pangalawang kadahilanan ay kinakailangan bago ang mga pagbabago sa pagsingil, paggawa ng account ng serbisyo, muling pagkonekta ng isang account at pagbawi ng mga kredensyal.',
  'settings.ui.security.credentialsTitle': 'API key',
  'settings.ui.security.credentialsBody':
    'Mga susi na pagmamay-ari ng workspace na ito. Hiwalay ang mga ito sa mga grant ng app at sa sarili mong session.',
  'settings.ui.security.agentsTitle': 'Mga account ng serbisyo',
  'settings.ui.security.webhooksTitle': 'Mga endpoint ng webhook',
  'settings.ui.security.grantsTitle': 'Mga app na pinayagan mo',
  'settings.ui.security.grantsBody':
    'Ang pagbawi ng isang app ay huminto kaagad sa mga token nito. Ang iyong sariling mga koneksyon at naka-iskedyul na mga post ay hindi apektado.',
  'settings.ui.security.grantScopes': 'Mga binigay na pahintulot',
  'settings.ui.security.socialPermissionsTitle': 'Mga pahintulot sa social account',
  'settings.ui.security.socialPermissionsBody':
    'Ano ang pinahintulutan ng bawat konektadong account na gawin ng Relay, mula sa snapshot ng kakayahan na kinuha sa oras ng koneksyon.',
  'settings.ui.security.viewInSection': 'Pamahalaan sa {section}',
  'settings.ui.security.emptySessions': 'Tanging ang session na ito ang naka-sign in.',
  'settings.ui.security.emptyGrants':
    'Walang third party na app ang may access sa workspace na ito. Lalabas dito ang mga app pagkatapos mong payagan ang mga ito sa screen ng pahintulot.',
  'settings.ui.security.revokeGrantTitle': 'Bawiin ang access para sa {app}',
  'settings.ui.security.revokeGrantConsequence.tokens':
    'Ang pag-access at pag-refresh ng mga token nito ay hihinto kaagad sa paggana.',
  'settings.ui.security.revokeGrantConsequence.scheduled':
    'Mga post na nakaiskedyul na itong manatili na nakaiskedyul. Kanselahin ang mga ito nang hiwalay kung gusto mong ihinto ang mga ito.',
  'settings.ui.security.revokeGrantConsequence.reconnect':
    'Ang app ay maaaring humingi ng access muli, at maaari kang tumanggi.',

  /* ----------------------------------------------------------- data controls */

  'settings.ui.data.description':
    'Take your data out, remove one thing, or close the account. Every destructive action names exactly what it touches first.',
  'settings.ui.data.exportTitle': 'Export',
  'settings.ui.data.exportBody':
    'A portable archive of content, schedules, receipts, analytics and audit events, plus your uploaded media.',
  'settings.ui.data.exportJson': 'Structured JSON',
  'settings.ui.data.exportCsv': 'Spreadsheet CSV',
  'settings.ui.data.exportMedia': 'Media archive',
  'settings.ui.data.exportJsonHelp':
    'One file per record type. Documented and stable across versions.',
  'settings.ui.data.exportCsvHelp': 'Posts, receipts and metrics as flat tables for a spreadsheet.',
  'settings.ui.data.exportMediaHelp':
    'The original files you uploaded or imported, with checksums.',
  'settings.ui.data.exportStart': 'Prepare export',
  'settings.ui.data.exportRunning':
    'Preparing your export. It keeps running if you close this page.',
  'settings.ui.data.exportReady': 'Export ready, prepared {date}',
  'settings.ui.data.exportDownload': 'Download export',
  'settings.ui.data.exportExpires': 'The download link expires {date}.',
  'settings.ui.data.deleteTitle': 'Delete',
  'settings.ui.data.deleteBody':
    'Choose the smallest thing that solves your problem. Each option below says what survives.',
  'settings.ui.data.deleteConnection': 'Revoke one social connection',
  'settings.ui.data.deleteConnectionHelp':
    'Removes Relay access to that account. The workspace, its content and its receipts stay.',
  'settings.ui.data.deleteProject': 'Delete a project',
  'settings.ui.data.deleteProjectHelp':
    'Removes the project, its rules and its glossary. Content published under it keeps its receipts.',
  'settings.ui.data.deleteContent': 'Delete content and media',
  'settings.ui.data.deleteContentHelp':
    'Removes drafts and stored files. It does not remove anything already published on a platform.',
  'settings.ui.data.deleteAccount': 'Close this workspace',
  'settings.ui.data.deleteAccountHelp':
    'Cancels scheduled jobs, revokes every connection, removes stored media and closes the workspace.',
  'settings.ui.data.scheduledJobsTitle': 'Scheduled work that will be canceled first',
  'settings.ui.data.scheduledJobsCount':
    '{count, plural, =0 {Nothing is scheduled right now} one {# scheduled post} other {# scheduled posts}}',
  'settings.ui.data.cancelJobsFirst': 'Cancel scheduled posts now',
  'settings.ui.data.cancelJobsDone': 'Scheduled posts canceled. Nothing will publish.',
  'settings.ui.data.deleteConfirmPhraseLabel': 'Type the workspace name to confirm',
  'settings.ui.data.deleteConsequence.jobs':
    'Every scheduled post is canceled before anything is removed.',
  'settings.ui.data.deleteConsequence.connections':
    'Every social connection is revoked at the provider.',
  'settings.ui.data.deleteConsequence.media': 'Stored media is deleted and cannot be recovered.',
  'settings.ui.data.deleteConsequence.receipts':
    'Publication receipts are kept for the retention period stated in the Terms, then removed.',
  'settings.ui.data.deleteConsequence.published':
    'Posts already live on a platform are not deleted. Remove those on the platform.',
  'settings.ui.data.exportFirst': 'Export your data before you delete it.',

  /* --------------------------------------------------------------- referrals */

  'settings.ui.referral.description':
    'Ibahagi ang Relay sa isang isiniwalat na link. Ang komisyon ay hindi kailanman may kondisyon sa isang positibong pagsusuri.',
  'settings.ui.referral.linkLabel': 'Ang iyong referral link',
  'settings.ui.referral.tableCaption': 'Mga nauugnay na pag-signup at estado ng kanilang komisyon',
  'settings.ui.referral.column.signup': 'Signup',
  'settings.ui.referral.column.date': 'Petsa',
  'settings.ui.referral.column.state': 'Komisyon',
  'settings.ui.referral.column.amount': 'Halaga',
  'settings.ui.referral.emptyTitle': 'Wala pang na-attribute na pag-signup',
  'settings.ui.referral.emptyBody':
    'Ang mga pag-signup ay lalabas dito kapag may nagsimula ng pagsubok sa pamamagitan ng iyong link. Ang mga halaga ay mananatiling nakabinbin hanggang sa magsara ang window ng refund.',
  'settings.ui.referral.emptyExample':
    'Halimbawang row: acme.example, nagsimula ng trial noong Hunyo 12, nakabinbin hanggang Hulyo 12, pagkatapos ay naaprubahan.',
  'settings.ui.referral.termsLink': 'Basahin ang mga tuntunin ng kasosyo',
  'settings.ui.referral.balance': 'Inaprubahang komisyon',
  'settings.ui.referral.balanceUnavailableReason':
    'Ang commission ledger ay hindi pa nagkakasundo para sa panahong ito.',

  /* --------------------------------------------------------- agents and API */

  'developer.ui.agents.description':
    'Ang account ng serbisyo ay isang pinangalanang pagkakakilanlan para sa isang ahente, isang script o isang daloy ng trabaho. Dala nito ang sarili nitong mga saklaw, sarili nitong limitasyon at sarili nitong audit trail.',
  'developer.ui.agents.emptyTitle': 'Wala pang service account',
  'developer.ui.agents.emptyBody':
    'Gumawa ng isa para sa bawat automation na iyong pinapatakbo. Nangangahulugan ang mga hiwalay na account na maaari mong bawiin ang isa nang hindi pinipigilan ang iba.',
  'developer.ui.agents.emptyExample':
    'Halimbawa: Ang "Content agent", project na Acme EU, ay maaaring mag-draft at mag-iskedyul ng hanggang 6 na post sa isang araw sa pagitan ng 07:00 at 22:00, hindi kailanman mag-publish kaagad.',
  'developer.ui.agents.step.identity': 'Pangalan at layunin',
  'developer.ui.agents.step.scope': 'Kung ano ang maabot nito',
  'developer.ui.agents.step.limits': 'Mga limitasyon',
  'developer.ui.agents.purpose': 'Para saan ang account na ito',
  'developer.ui.agents.purposeHelp':
    'Isang pangungusap. Lumalabas ito sa tabi ng bawat pagkilos na ginagawa ng account na ito sa audit log.',
  'developer.ui.agents.scopeHelp':
    'Ang isang saklaw ay nagbibigay ng eksaktong sarili nito. Wala dito ang nagpapahiwatig ng iba pa.',
  'developer.ui.agents.limitsHelp':
    'Ang mga limitasyon ay ipinapatupad ng API, hindi ng ahente. Hindi maaaring itaas ng isang ahente ang sarili nitong limitasyon.',
  'developer.ui.agents.quietHours': 'Tahimik na oras',
  'developer.ui.agents.quietHoursHelp':
    'Ang account ay hindi maaaring mag-iskedyul o mag-publish sa loob ng mga oras na ito, sa workspace time zone.',
  'developer.ui.agents.lookAheadHelp':
    'Gaano kalayo sa hinaharap maaari itong maglagay ng isang post.',
  'developer.ui.agents.cadenceHelp':
    'Ang karamihan sa mga panlabas na publikasyon na maaaring idulot nito sa isang araw.',
  'developer.ui.agents.expiry': 'Pag-expire ng kredensyal',
  'developer.ui.agents.expiryHelp':
    'Ang mas maikling buhay ay mas ligtas. Maaari kang paikutin anumang oras.',
  'developer.ui.agents.summaryTitle': 'Bago mo ito likhain',
  'developer.ui.agents.summaryAccounts': 'Mga account na maaabot nito',
  'developer.ui.agents.summaryMaxActions':
    'Sa karamihan {count, plural, one {# panlabas na publikasyon} other {# panlabas na mga publikasyon}} bawat araw.',
  'developer.ui.agents.summaryApproval': 'Pag-uugali ng pag-apruba',
  'developer.ui.agents.summaryCreate': 'Lumikha ng account ng serbisyo',
  'developer.ui.agents.detailTitle': 'Account ng serbisyo',
  'developer.ui.agents.statusActive': 'Aktibo',
  'developer.ui.agents.statusStopped': 'Huminto',
  'developer.ui.agents.statusExpired': 'Nag-expire ang kredensyal',
  'developer.ui.agents.stoppedBody':
    'Itinigil ang account na ito. Ang bawat tawag na ginagawa nito ay tinatanggihan nang may malinaw na dahilan. Walang naalis na anumang nilikha nito.',
  'developer.ui.agents.killTitle': 'Tumigil ka {name}',
  'developer.ui.agents.killConsequence.calls':
    'Ang bawat API, MCP at CLI na tawag mula sa account na ito ay tinanggihan nang sabay-sabay.',
  'developer.ui.agents.killConsequence.scheduled':
    'Mga post na nakaiskedyul na itong manatili na nakaiskedyul. Kanselahin ang mga ito mula sa kalendaryo kung gusto mong ihinto ang mga ito.',
  'developer.ui.agents.killConsequence.reversible': 'Maaari mo itong simulan muli mamaya.',
  'developer.ui.agents.resume': 'Simulan muli ang ahenteng ito',
  'developer.ui.agents.rotate': 'I-rotate ang kredensyal',
  'developer.ui.agents.rotateTitle': 'I-rotate ang kredensyal para sa {name}',
  'developer.ui.agents.rotateConsequence.old':
    'Ang kasalukuyang kredensyal ay hihinto kaagad sa paggana.',
  'developer.ui.agents.rotateConsequence.new':
    'Ang bago ay ipinapakita nang isang beses, sa pahinang ito.',
  'developer.ui.agents.rotateConsequence.clients':
    'Ang anumang bagay na gumagamit ng lumang halaga ay nabigo hanggang sa i-update mo ito.',
  'developer.ui.agents.credentialStored': 'Inimbak ko ang kredensyal na ito',
  'developer.ui.agents.credentialLabel': 'Kredensyal ng account ng serbisyo',
  'developer.ui.agents.credentialWarning': 'Ngayon lang ipinakita ang kredensyal na ito',
  'developer.ui.agents.credentialWarningBody':
    'Kopyahin ito sa iyong lihim na tindahan ngayon. Isang hash lang ang itinatago namin, kaya hindi na namin ito maipapakitang muli. Lumilikha ng bago ang pag-ikot.',
  'developer.ui.agents.credentialConsumed':
    'Hindi na ipinapakita ang kredensyal. I-rotate ito kung hindi mo ito inimbak.',
  'developer.ui.agents.credentialReveal': 'Ipakita ang kredensyal',
  'developer.ui.agents.credentialHide': 'Itago ang kredensyal',

  /* Scope sentences written for the person granting them, not for the
     developer requesting them. The developer facing wording lives in
     `developer.scope.*`. */
  'developer.ui.scope.accounts_read':
    'Tingnan ang iyong mga konektadong account at kung ano ang magagawa ng bawat isa',
  'developer.ui.scope.accounts_write':
    'Palitan ang pangalan ng mga account at baguhin kung paano sila naka-grupo',
  'developer.ui.scope.drafts_read': 'Basahin ang iyong mga draft at ang kanilang mga variant',
  'developer.ui.scope.drafts_write': 'Gumawa at mag-edit ng mga draft',
  'developer.ui.scope.posts_schedule':
    'Mag-iskedyul ng naaprubahang nilalaman sa iyong mga account',
  'developer.ui.scope.posts_publish': 'I-publish kaagad sa iyong mga account',
  'developer.ui.scope.posts_cancel': 'Kanselahin ang mga naka-iskedyul na post',
  'developer.ui.scope.analytics_read': 'Magbasa ng analytics para sa iyong mga account',
  'developer.ui.scope.media_read': 'Tingnan ang mga file sa iyong library',
  'developer.ui.scope.media_write': 'Mag-upload at mag-edit ng mga file sa iyong library',
  'developer.ui.scope.rules_read': 'Basahin ang iyong mga panuntunan sa automation',
  'developer.ui.scope.rules_write':
    'Gumawa at baguhin ang mga panuntunan sa automation na maaaring mag-publish',
  'developer.ui.scope.growth_read': 'Basahin ang iyong mga plano sa paglago',
  'developer.ui.scope.growth_write': 'Gumawa at mag-edit ng mga plano sa paglago',
  'developer.ui.scope.webhooks_manage': 'Gumawa at baguhin ang mga endpoint ng webhook',
  'developer.ui.scope.billing_read': 'Basahin ang iyong plano, estado ng pagsubok at paggamit',
  'developer.ui.scope.connections_admin': 'Ikonekta at idiskonekta ang mga social account',

  'developer.ui.activity.caption': 'Mga kamakailang tawag sa tool, kasama ang mga tinanggihan',
  'developer.ui.activity.column.time': 'Oras',
  'developer.ui.activity.column.tool': 'Tool o ruta',
  'developer.ui.activity.column.outcome': 'kinalabasan',
  'developer.ui.activity.column.subject': 'Paksa',
  'developer.ui.activity.outcome.ok': 'Pinayagan',
  'developer.ui.activity.outcome.denied': 'Tinanggihan',
  'developer.ui.activity.outcome.failed': 'Nabigo',
  'developer.ui.activity.filterDenied': 'Ipakita lamang ang mga tinanggihang pagtatangka',
  'developer.ui.activity.deniedExplain':
    'Ang isang tinanggihang pagtatangka ay kung paano ipinapakita ng isang maling na-configure na ahente ang sarili nito. Ang mga row na ito ay pinananatili, hindi nakatago.',
  'developer.ui.activity.emptyTitle': 'Wala pang naitalang mga tawag',
  'developer.ui.activity.emptyBody':
    'Lalabas dito ang mga tawag sa loob ng ilang segundo pagkatapos mangyari, kasama ang mga tinanggihan.',
  'developer.ui.activity.emptyExample':
    'Halimbawang row: 12:03, draft_post, Allowed, draft para sa X account @acme.',

  'developer.ui.setup.help':
    'I-paste ito sa client na iyong kinokonekta. Palitan ang placeholder ng kredensyal ng halagang inimbak mo.',
  'developer.ui.setup.credentialPlaceholder':
    'Gumagamit ang snippet ng placeholder. Huwag kailanman ibigay ang tunay na kredensyal sa isang repositoryo.',
  'developer.ui.setup.copySnippet': 'Kopyahin ang snippet para sa {client}',
  'developer.ui.setup.snippetCopied': 'Nakopya ang snippet',
  'developer.ui.setup.tabLabel': 'Mga snippet ng setup ng kliyente',

  'developer.ui.playground.help':
    'Tumatakbo ang mga tawag laban sa isang seeded na kopya ng workspace na ito. Walang provider na nakontak at walang nakaiskedyul.',
  'developer.ui.playground.tool': 'Tool',
  'developer.ui.playground.arguments': 'Mga argumento',
  'developer.ui.playground.argumentsHelp':
    'JSON. Ang parehong katawan na tinatanggap ng tunay na API.',
  'developer.ui.playground.result': 'Resulta',
  'developer.ui.playground.resultEmpty':
    'Magpatakbo ng isang tool upang makita ang tugon na ibabalik nito.',
  'developer.ui.playground.invalidJson': 'Hindi pa ito wastong JSON, kaya hindi ito maipapadala.',
  'developer.ui.playground.deniedByApproval':
    'Antas ng pag-apruba {level} hindi pinapayagan ang tawag na ito. Ang dry run ay tinatanggihan ito nang eksakto tulad ng gagawin ng API.',
  'developer.ui.playground.announceResult': 'Tapos na ang dry run. {outcome}.',

  /* --------------------------------------------------------- developer apps */

  'developer.ui.apps.description':
    'Magrehistro ng isang application upang ang ibang mga tao ay mabigyan ito ng access sa kanilang workspace. Ang bawat app ay may sariling pagkakakilanlan, sarili nitong redirect allowlist at sarili nitong audit trail.',
  'developer.ui.apps.emptyTitle': 'Walang nakarehistrong app',
  'developer.ui.apps.emptyBody':
    'Magrehistro ng app kapag kailangang kumilos ang isa pang produkto sa ngalan ng isang user ng Relay. Para sa sarili mong automation, gumamit na lang ng service account.',
  'developer.ui.apps.emptyExample':
    'Halimbawa: "Acme Publisher", kumpidensyal na kliyente, pag-redirect ng https://acme.example/oauth/callback, sumasaklaw sa mga account:read at drafts:write.',
  'developer.ui.apps.typeHelp':
    'Ang isang kumpidensyal na kliyente ay tumatakbo sa isang server na kinokontrol mo at maaaring magtago ng lihim. Ang pampublikong kliyente ay isang browser o isang desktop app at gumagamit ng PKCE nang walang lihim.',
  'developer.ui.apps.redirectAdd': 'Magdagdag ng redirect URI',
  'developer.ui.apps.redirectRemove': 'Alisin {uri}',
  'developer.ui.apps.redirectInvalid':
    'Maglagay ng buong https URI na walang wildcard at walang query string. Dapat itong tumugma nang eksakto sa halaga na ipinapadala ng iyong app.',
  'developer.ui.apps.linksTitle': 'Nai-publish na mga link',
  'developer.ui.apps.linksHelp':
    'Lumilitaw ang mga ito sa screen ng pahintulot. Ang isang user na hindi maabot ang mga ito ay hindi magbibigay ng access.',
  'developer.ui.apps.linkUnreachable':
    'Hindi namin maabot ang URL na ito noong huli naming suriin, {date}.',
  'developer.ui.apps.linkReachable': 'Naaabot, nasuri {date}',
  'developer.ui.apps.scopesTitle': 'Mga pahintulot na maaaring hingin ng app na ito',
  'developer.ui.apps.scopesHelp':
    'Humingi ng hindi bababa sa kailangan mo. Nakikita ng isang user ang mga read permission at consequential permissions bilang dalawang magkahiwalay na grupo.',
  'developer.ui.apps.scopeGroup.read': 'Basahin ang mga pahintulot',
  'developer.ui.apps.scopeGroup.reversible': 'Mga pagbabagong maaari mong i-undo',
  'developer.ui.apps.scopeGroup.consequential': 'Mga pahintulot na kinahihinatnan',
  'developer.ui.apps.scopeGroupHelp.read':
    'Hinahayaan ng mga ito ang app na tumingin sa data. Walang nagbabago.',
  'developer.ui.apps.scopeGroupHelp.reversible':
    'Hinahayaan ng mga ito ang app na gumawa o mag-edit ng mga bagay sa loob ng Relay. Walang nakakarating sa isang plataporma.',
  'developer.ui.apps.scopeGroupHelp.consequential':
    'Ang mga ito ay maaaring magdulot ng isang post sa isang tunay na account, o magbago kung sino ang makakaabot sa iyong mga account. Palagi silang nakalista nang hiwalay at hindi kailanman naka-bundle.',
  'developer.ui.apps.noBundling':
    'Walang pinagsamang saklaw ng pag-access. Ang pangangasiwa sa pagsingil at koneksyon ay palaging hinihiling sa pamamagitan ng pangalan.',
  'developer.ui.apps.secretTitle': 'Sikreto ng kliyente',
  'developer.ui.apps.secretWarning':
    'Ito ang tanging pagkakataon na ipinakita ang sikreto ng kliyente',
  'developer.ui.apps.secretWarningBody':
    'I-store ito sa iyong server side secret manager ngayon. Isang hash lang ang itinatago namin. Kung mawala mo ito, i-rotate ito: walang paraan upang ihayag itong muli.',
  'developer.ui.apps.secretConsumed':
    'Hindi na ipinapakita ang sikreto. I-rotate ito kung hindi mo ito inimbak.',
  'developer.ui.apps.secretStored': 'Iniimbak ko ang sikretong ito',
  'developer.ui.apps.secretPublicClient':
    'Ang isang pampublikong kliyente ay walang lihim. Ginagamit nito ang daloy ng authorization code sa PKCE.',
  'developer.ui.apps.rotateTitle': 'I-rotate ang sikreto ng kliyente para sa {app}',
  'developer.ui.apps.rotateConsequence.old':
    'Ang kasalukuyang sikreto ay hihinto kaagad sa paggana.',
  'developer.ui.apps.rotateConsequence.grants':
    'Ang mga kasalukuyang gawad ng user ay hindi binabawi.',
  'developer.ui.apps.rotateConsequence.deploy':
    'Nabigo ang iyong mga server na mag-refresh ng mga token hanggang sa i-deploy mo ang bagong halaga.',
  'developer.ui.apps.consentPreviewTitle': 'Preview ng screen ng pahintulot',
  'developer.ui.apps.consentPreviewHelp':
    'Ito ang nakikita ng isang gumagamit. Ito ay nabuo mula sa rekord ng app, kaya hindi ito makakapangako ng higit pa sa hinihiling ng app.',
  'developer.ui.apps.consentPreviewSample':
    'Preview lang. Walang ipinagkaloob at walang ibinigay na token.',
  'developer.ui.apps.grantsCaption': 'Mga workspace na nagbigay ng access sa app na ito',
  'developer.ui.apps.grantColumn.workspace': 'Workspace',
  'developer.ui.apps.grantColumn.scopes': 'Saklaw',
  'developer.ui.apps.grantColumn.granted': 'ipinagkaloob',
  'developer.ui.apps.grantColumn.lastUsed': 'Huling ginamit',
  'developer.ui.apps.grantsEmpty': 'Wala pang nagbigay ng access sa app na ito.',
  'developer.ui.apps.logsCaption': 'Mga kamakailang kahilingan, na inalis ang mga lihim at payload',
  'developer.ui.apps.logColumn.time': 'Oras',
  'developer.ui.apps.logColumn.route': 'Ruta',
  'developer.ui.apps.logColumn.status': 'Katayuan',
  'developer.ui.apps.logColumn.workspace': 'Workspace',
  'developer.ui.apps.logsRedacted':
    'Ang mga katawan ng kahilingan at pagtugon ay iniimbak na may mga kredensyal, token at nilalaman ng user na inalis.',
  'developer.ui.apps.sandboxTitle': 'Mga kredensyal sa sandbox',
  'developer.ui.apps.sandboxBody':
    'Isang hiwalay na client ID at workspace na may seeded data. Ang mga tawag na ginawa gamit ito ay hindi makakarating sa isang provider.',
  'developer.ui.apps.rateLimitLabel': 'Hangganan ng rate',
  'developer.ui.apps.rateLimitUsage': '{used} ng {limit} mga kahilingan sa oras na ito',
  'developer.ui.apps.disable': 'Huwag paganahin ang app',
  'developer.ui.apps.enable': 'Paganahin ang app',
  'developer.ui.apps.disabledBody':
    'Naka-disable ang app na ito. Ang mga kasalukuyang token ay tinatanggihan at walang bagong grant ang maaaring simulan. Ang mga gawad ay pinapanatili upang mapagana mo itong muli.',
  'developer.ui.apps.deleteTitle': 'Tanggalin {app}',
  'developer.ui.apps.deleteConsequence.grants':
    'Ang bawat grant ay binawi at ang bawat token ay hihinto sa paggana.',
  'developer.ui.apps.deleteConsequence.logs':
    'Ang mga log ng kahilingan ay itinatago para sa panahon ng pagpapanatili ng audit.',
  'developer.ui.apps.deleteConsequence.irreversible': 'Hindi magagamit muli ang client ID.',

  /* ---------------------------------------------------------------- webhooks */

  'developer.ui.webhooks.description':
    'Mga sign na paghahatid ng HTTPS para sa mga kaganapang pipiliin mo. Ang bawat paghahatid ay naka-log kasama ang tugon nito, at anumang paghahatid ay maaaring ipadala muli.',
  'developer.ui.webhooks.emptyTitle': 'Wala pang mga endpoint',
  'developer.ui.webhooks.emptyBody':
    'Magdagdag ng endpoint para makatanggap ng mga resulta sa pag-publish, mga desisyon sa pag-apruba, at kalusugan ng koneksyon sa sarili mong mga system.',
  'developer.ui.webhooks.emptyExample':
    'Halimbawa: https://hooks.acme.example/relay, naka-subscribe sa post.published, post.failed at connection.action_required.',
  'developer.ui.webhooks.create': 'Magdagdag ng endpoint',
  'developer.ui.webhooks.url': 'URL ng Endpoint',
  'developer.ui.webhooks.urlHelp':
    'HTTPS lang. Wala kaming sinusunod na mga pag-redirect at hindi namin sinusubukang muli ang isang 2xx.',
  'developer.ui.webhooks.eventsTitle': 'Mga kaganapan',
  'developer.ui.webhooks.eventsHelp':
    'Piliin ang mga kaganapang iyong pinangangasiwaan. Ang pagpapadala ng lahat sa isang endpoint na binabalewala ang karamihan sa mga ito ay ginagawang mas mahirap makita ang mga pagkabigo.',
  'developer.ui.webhooks.eventsAll': 'Bawat kaganapan',
  'developer.ui.webhooks.eventsSelected': 'Tanging ang mga kaganapan ang aking pipiliin',
  'developer.ui.webhooks.eventsCount':
    '{count, plural, one {# kaganapan} other {# mga pangyayari}}',
  'developer.ui.webhooks.eventGroup.connections': 'Mga koneksyon',
  'developer.ui.webhooks.eventGroup.content': 'Nilalaman at pag-apruba',
  'developer.ui.webhooks.eventGroup.publishing': 'Paglalathala',
  'developer.ui.webhooks.eventGroup.automation': 'Automation at mga feed',
  'developer.ui.webhooks.eventGroup.workspace': 'Workspace',
  'developer.ui.webhooks.scopeTitle': 'Mga tatak at account',
  'developer.ui.webhooks.scopeAll': 'Bawat project at account',
  'developer.ui.webhooks.scopeSelected': 'Tanging ang mga pipiliin ko',
  'developer.ui.webhooks.secretTitle': 'Lihim na pumipirma',
  'developer.ui.webhooks.secretBody':
    'I-verify ang signature header bago mo i-parse ang isang katawan. I-deduplicate ang delivery id, na stable sa mga muling pagsubok.',
  'developer.ui.webhooks.secretRotateTitle': 'I-rotate ang signing secret',
  'developer.ui.webhooks.secretRotateConsequence.overlap':
    'Ang parehong mga lihim ay tinatanggap sa loob ng 24 na oras upang maaari kang mag-deploy nang hindi nag-drop ng isang paghahatid.',
  'developer.ui.webhooks.secretRotateConsequence.after':
    'Pagkatapos ng window na iyon tanging ang bagong lihim ang ginagamit.',
  'developer.ui.webhooks.testDeliveryHelp':
    'Nagpapadala ng isang nilagdaang halimbawang kaganapan na minarkahan bilang pagsubok, para ligtas itong balewalain ng iyong tatanggap.',
  'developer.ui.webhooks.testDeliverySent':
    'Ipinadala ang pagsubok na paghahatid. Lumilitaw ang resulta sa log sa ibaba.',
  'developer.ui.webhooks.deliveriesCaption':
    'Mga kamakailang paghahatid at ang tugon na natanggap ng bawat isa',
  'developer.ui.webhooks.deliveryColumn.time': 'Hiniling',
  'developer.ui.webhooks.deliveryColumn.event': 'Kaganapan',
  'developer.ui.webhooks.deliveryColumn.attempt': 'Pagtatangka',
  'developer.ui.webhooks.deliveryColumn.response': 'Tugon',
  'developer.ui.webhooks.deliveryColumn.status': 'Katayuan',
  'developer.ui.webhooks.deliveryStatus.pending': 'Naghihintay',
  'developer.ui.webhooks.deliveryStatus.succeeded': 'Naihatid',
  'developer.ui.webhooks.deliveryStatus.failed': 'Nabigo, susubukan ulit',
  'developer.ui.webhooks.deliveryStatus.exhausted': 'Nabigo, wala nang muling pagsubok',
  'developer.ui.webhooks.deliveryStatus.disabled': 'Hindi naipadala, naka-disable ang endpoint',
  'developer.ui.webhooks.deliveryNoResponse': 'Walang natanggap na tugon',
  'developer.ui.webhooks.deliveryNextAttempt': 'Susunod na pagtatangka {relativeTime}',
  'developer.ui.webhooks.inspect': 'Suriin ang paghahatid',
  'developer.ui.webhooks.inspectTitle': 'Paghahatid {id}',
  'developer.ui.webhooks.inspectRequest': 'Humiling ng katawan',
  'developer.ui.webhooks.inspectResponse': 'Katawan ng pagtugon',
  'developer.ui.webhooks.redeliver': 'Ipadala muli ang paghahatid na ito',
  'developer.ui.webhooks.redeliverHelp':
    'Ang parehong event id ay ipinadala muli kasama ang redelivery flag set, kaya hindi ito pinapansin ng isang idempotent na receiver.',
  'developer.ui.webhooks.redelivered': 'Nakapila para sa muling paghahatid.',
  'developer.ui.webhooks.failureTitle': 'Nabigo ang endpoint na ito',
  'developer.ui.webhooks.failureBody':
    '{count, plural, one {# Nabigo ang sunud-sunod na paghahatid} other {# nabigo ang sunud-sunod na paghahatid}}. Pagkatapos {limit} sunud-sunod na mga pagkabigo ang endpoint ay hindi pinagana at isang item ng aksyon ay isinampa.',
  'developer.ui.webhooks.disabledTitle':
    'Ang endpoint na ito ay hindi pinagana pagkatapos ng paulit-ulit na pagkabigo',
  'developer.ui.webhooks.disabledBody':
    'Huminto kami sa pagpapadala dito para hindi mapuno ang iyong pila. Ayusin ang receiver, magpadala ng pagsubok na paghahatid, pagkatapos ay paganahin itong muli.',
  'developer.ui.webhooks.lastSuccessLabel': 'Huling tagumpay',
  'developer.ui.webhooks.lastSuccessNever': 'Walang delivery na nagtagumpay',
  'developer.ui.webhooks.deleteTitle': 'Tanggalin ang endpoint na ito',
  'developer.ui.webhooks.deleteConsequence.stop': 'Wala nang ipapadala sa URL na ito.',
  'developer.ui.webhooks.deleteConsequence.logs':
    'Ang mga tala ng paghahatid ay itinatago para sa panahon ng pagpapanatili ng audit.',

  /* ----------------------------------------------------------------- billing */

  'billing.ui.description':
    'One plan, two intervals. Polar is the merchant of record: it holds the payment method, issues invoices and handles cancellation.',
  'billing.ui.statusHeading': 'Current status',
  'billing.ui.planHeading': 'Plan',
  'billing.ui.intervalHeading': 'Billing interval',
  'billing.ui.usageHeading': 'Metered provider usage',
  'billing.ui.invoicesHeading': 'Invoices',
  'billing.ui.cancelHeading': 'Cancellation',
  'billing.ui.trialDaysRemaining':
    'Trial, {count, plural, =0 {ends today} one {# day remaining} other {# days remaining}}',
  'billing.ui.convertsOn': 'Converts on {date} to {amount} per {interval}.',
  'billing.ui.dueToday': '$0 due today',
  'billing.ui.conversionLabel': 'Converts',
  'billing.ui.channelsLabel': 'Active channels',
  'billing.ui.paymentMethodPolar': 'Payment method held by Polar',
  'billing.ui.paymentMethodDescriptor': '{project} ending {last4}, expires {expiry}',
  'billing.ui.paymentMethodMissing': 'No payment method on file yet',
  'billing.ui.cancelBeforeDate': 'Cancel before {date} and you will not be charged.',
  'billing.ui.annualFraming': '$25/month billed annually. Save $48/year.',
  'billing.ui.monthlyOption': '$29 per month',
  'billing.ui.annualOption': '$300 per year',
  'billing.ui.intervalChangeHelp':
    'Changing the interval takes effect at the next renewal. Polar prorates it and shows the exact amount before you confirm.',
  'billing.ui.intervalChangedAnnouncement': 'Billing interval set to {interval}.',
  'billing.ui.allowanceChannels':
    '30 active social channels. A channel is one connected account, page or channel.',
  'billing.ui.allowanceChannelsUsage': '{used} of {limit} active channels',
  'billing.ui.allowanceFairUse':
    'Fair use means anti spam, rate and provider cost controls. They apply the same way to every subscriber and are published, not discretionary.',
  'billing.ui.allowanceMetered':
    'X and some other providers charge per operation. Those charges are passed through at cost and are not part of the plan price.',
  'billing.ui.allowanceNoMedia':
    'Image generation and video generation are not included and are not sold. Relay does not generate media.',
  'billing.ui.readFairUse': 'Read the fair use policy',
  'billing.ui.readMeteredPolicy': 'Read how metered usage is billed',
  'billing.ui.usageCaption': 'Metered provider usage this period, billed at cost',
  'billing.ui.usageColumn.item': 'Item',
  'billing.ui.usageColumn.quantity': 'Quantity',
  'billing.ui.usageColumn.unitPrice': 'Unit price',
  'billing.ui.usageColumn.amount': 'Amount',
  'billing.ui.usageTotal': 'Total this period',
  'billing.ui.usagePeriod': 'Period {start} to {end}',
  'billing.ui.usageSource': 'Prices published by the provider. Verified {date}.',
  'billing.ui.usageReconciled': 'Reconciled against the provider invoice on {date}.',
  'billing.ui.usagePending': 'Not reconciled yet. The final amount can move slightly.',
  'billing.ui.usageUnavailableReason':
    'The provider has not returned usage for this period yet. It is normally available within 24 hours.',
  'billing.ui.usageEmpty': 'No metered usage this period.',
  'billing.ui.spendAlert': 'Spend alert',
  'billing.ui.spendAlertHelp':
    'We email you when metered usage passes this amount in a billing period.',
  'billing.ui.spendAlertPause': 'Also pause metered actions when the alert is reached',
  'billing.ui.balanceLabel': 'Usage balance',
  'billing.ui.balanceHelp': 'Metered usage is drawn from this balance and invoiced by Polar.',
  'billing.ui.invoicesCaption': 'Invoices issued by Polar',
  'billing.ui.invoiceColumn.date': 'Date',
  'billing.ui.invoiceColumn.description': 'Description',
  'billing.ui.invoiceColumn.amount': 'Amount',
  'billing.ui.invoiceColumn.state': 'State',
  'billing.ui.invoiceState.paid': 'Paid',
  'billing.ui.invoiceState.open': 'Open',
  'billing.ui.invoiceState.uncollectible': 'Not collected',
  'billing.ui.invoiceState.refunded': 'Refunded',
  'billing.ui.invoicesEmpty': 'No invoice yet. The first one is issued when the trial converts.',
  'billing.ui.invoicesInPortal': 'Every invoice and receipt is available in the Polar portal.',
  'billing.ui.portalHelp':
    'The portal is where you change the payment method, download invoices and cancel. It opens in a new tab.',
  'billing.ui.pastDueHeading': 'Payment overdue',
  'billing.ui.pastDueBody':
    'The last payment did not go through. Update the payment method in the Polar portal to keep publishing.',
  'billing.ui.gracePolicy':
    'Scheduled posts keep running until {date}. After that the workspace becomes read only: nothing is deleted and nothing is published.',
  'billing.ui.cancelBody':
    'Cancelling is one action and takes effect at the end of the period you have paid for. There is no call to make and no form to fill in.',
  'billing.ui.cancelStart': 'Cancel subscription',
  'billing.ui.cancelDialogTitle': 'Cancel this subscription',
  'billing.ui.cancelConsequence.noCharge':
    'You will not be charged. Nothing is taken today or on {date}.',
  'billing.ui.cancelConsequence.accessUntil': 'You keep every feature until {date}.',
  'billing.ui.cancelConsequence.dataKept':
    'Drafts, receipts, media and analytics stay in this workspace.',
  'billing.ui.cancelConsequence.scheduled':
    'Posts scheduled after {date} will not publish. Cancel or reschedule them before then.',
  'billing.ui.cancelConsequence.restart': 'You can start the subscription again at any time.',
  'billing.ui.cancelConfirm': 'Cancel subscription',
  'billing.ui.cancelKeep': 'Keep subscription',
  'billing.ui.cancelConfirmedBeforeConversion': 'Canceled. You will not be charged.',
  'billing.ui.cancelConfirmedAfterConversion': 'Canceled. Access continues until {date}.',
  'billing.ui.cancelAnnouncement': 'Subscription canceled.',
  'billing.ui.canceledNotice': 'This subscription is canceled.',
  'billing.ui.resume': 'Start the subscription again',
  'billing.ui.noSubscriptionTitle': 'No subscription on this workspace',
  'billing.ui.noSubscriptionBody':
    'Start the seven day trial to publish. Polar collects a payment method and charges nothing today.',
  'billing.ui.noSubscriptionExample':
    'Monthly is $29. Annual is $300, which is $25/month billed annually. Save $48/year.',
  'billing.ui.overChannelLimitAction': 'Review connected channels',

  /* ---------------------------------------------------------- growth advisor */

  'growth.ui.entryHelp':
    'Sagutin ang isang maikling paggamit, kumpirmahin kung ano ang aming naunawaan, at kumuha ng isang plano na maaari mong tanggapin ang item sa pamamagitan ng item. Nagmumungkahi ito ng trabaho. Ito ay hindi kailanman nag-iskedyul o nag-publish ng anumang bagay sa sarili nitong.',
  'growth.ui.step.intake': 'Intake',
  'growth.ui.step.confirm': 'Kumpirmahin',
  'growth.ui.step.plan': 'Plano',
  'growth.ui.stepIndicator': 'Hakbang {current} ng {total}: {name}',
  'growth.ui.intake.section.product': 'produkto',
  'growth.ui.intake.section.audience': 'Madla at mga merkado',
  'growth.ui.intake.section.objective': 'Layunin',
  'growth.ui.intake.section.capacity': 'Mga channel at kapasidad',
  'growth.ui.intake.section.limits': 'Ano ang off limits',
  'growth.ui.intake.help':
    'Walang nahulaan dito para sa iyo. Ang anumang iiwan mong walang laman ay minarkahan bilang nawawala sa halip na napunan.',
  'growth.ui.intake.productNameHelp': 'Ang pangalang ginagamit mo sa mga customer.',
  'growth.ui.intake.siteUrlHelp':
    'Binabasa namin ang page na ibinigay mo sa amin bilang source material. Kinukumpirma mo ang bawat katotohanang kinukuha namin mula rito.',
  'growth.ui.intake.descriptionHelp':
    'Ano ang ibinebenta mo at para kanino ito, sa sarili mong salita.',
  'growth.ui.intake.marketsHelp': 'Mga bansa o rehiyon. Isa sa bawat linya.',
  'growth.ui.intake.localesHelp': 'Ang mga wika kung saan ka maglalathala.',
  'growth.ui.intake.objectiveHelp': 'Ano ang gusto mo pa sa susunod na quarter.',
  'growth.ui.intake.conversionHelp':
    'Ang aksyon na masusukat mo talaga. Isang pag-signup, isang demo, isang pagbili.',
  'growth.ui.intake.proofHelp':
    'Mga pag-aaral ng kaso, mga benchmark na pinatakbo mo, mga screenshot na pagmamay-ari mo, mga pahintulot na hawak mo na. Isa sa bawat linya.',
  'growth.ui.intake.proofNone': 'Wala pa akong aprubadong pruweba',
  'growth.ui.intake.proofNoneEffect':
    'Ang plano ay ganap na maiiwasan ang mga resulta ng customer at resulta ng paghahabol.',
  'growth.ui.intake.channelsHelp': 'Ang mga account kung saan ka na nag-publish.',
  'growth.ui.intake.capacityHelp':
    'Maging tapat ka. Ang isang plano na hindi mo maaaring patakbuhin ay hindi isang plano.',
  'growth.ui.intake.competitorsHelp': 'Opsyonal. Isa sa bawat linya.',
  'growth.ui.intake.prohibitedClaimsHelp':
    'Mga paghahabol na hindi mo maaaring gawin, para sa mga legal o patakarang dahilan. Isa sa bawat linya.',
  'growth.ui.intake.prohibitedTopicsHelp': 'Mga paksang layuan. Isa sa bawat linya.',
  'growth.ui.intake.submit': 'Suriin kung ano ang aming naunawaan',
  'growth.ui.intake.savedAnnouncement': 'Na-save ang profile ng negosyo.',
  'growth.ui.intake.requiredMissing':
    'Punan ang mga patlang na minarkahan na kinakailangan bago magpatuloy.',

  'growth.ui.confirm.factsTitle': 'Mga katotohanang kinumpirma mo',
  'growth.ui.confirm.factsHelp': 'Ang mga ito ay maaaring gamitin sa kopya.',
  'growth.ui.confirm.assumptionsTitle': 'Mga pagpapalagay na ginawa namin',
  'growth.ui.confirm.assumptionsHelp':
    'Hindi ito mga katotohanan. Binubuo nila ang plano ngunit hindi sila naging claim sa isang post.',
  'growth.ui.confirm.missingTitle': 'Nawawala',
  'growth.ui.confirm.missingHelp':
    'Gumagana ang plano sa bawat isa sa mga ito at sinasabi kung saan ito mahalaga.',
  'growth.ui.confirm.confidence.label': 'Kumpiyansa: {level}',
  'growth.ui.confirm.confidence.low': 'mababa',
  'growth.ui.confirm.confidence.medium': 'daluyan',
  'growth.ui.confirm.confidence.high': 'mataas',
  'growth.ui.confirm.promote': 'Kumpirmahin bilang isang katotohanan',
  'growth.ui.confirm.correct': 'Itama ito',
  'growth.ui.confirm.correctLabel': 'Ang iyong pagwawasto',
  'growth.ui.confirm.generate': 'Bumuo ng plano',
  'growth.ui.confirm.announcement': 'Nakumpirma ang profile ng negosyo.',

  'growth.ui.plan.generatingBody':
    'Ito ay tumatagal ng ilang segundo. Maaari kang umalis sa pahinang ito: ang plano ay matatapos nang mag-isa.',
  'growth.ui.plan.stateDraft': 'Draft, hindi naaprubahan',
  'growth.ui.plan.stateApproved': 'Naaprubahan',
  'growth.ui.plan.stateSuperseded': 'Pinalitan ng mas bagong bersyon',
  'growth.ui.plan.newVersionNotice':
    'Ang isang pag-refresh ay lumilikha ng bersyon {version} at iniiwan ang aprubadong bersyon na hindi nagalaw.',
  'growth.ui.plan.emptyTitle': 'Wala pang plano',
  'growth.ui.plan.emptyBody':
    'Punan ang profile ng negosyo at gagawa kami ng plano mula sa mga katotohanang kinumpirma mo.',
  'growth.ui.plan.emptyExample':
    'Ang isang plano ay naglalaman ng isang diskarte, apat na linggo ng brief, isang UGC campaign, catalog backed na pagkakataon at hanggang limang tool.',
  'growth.ui.plan.tabsLabel': 'Mga seksyon ng plano',
  'growth.ui.plan.modelNote': 'Binuo ni {model}, prompt {promptVersion}, sa {date}.',

  'growth.ui.strategy.snapshotTitle': 'snapshot ng negosyo',
  'growth.ui.strategy.channelPriority': 'Priyoridad {rank}',
  'growth.ui.strategy.channelFormats': 'Mga katutubong format',
  'growth.ui.strategy.pillarProof': 'Patunay na sinasandalan ng haliging ito',
  'growth.ui.strategy.pillarProofNone':
    'Walang aprubadong patunay. Panatilihing naglalarawan ang haliging ito.',
  'growth.ui.strategy.cadenceCaption': 'Mga post bawat linggo ayon sa channel',
  'growth.ui.strategy.cadenceColumn.channel': 'Channel',
  'growth.ui.strategy.cadenceColumn.perWeek': 'Mga post kada linggo',
  'growth.ui.strategy.cadenceTotal': 'Kabuuan bawat linggo',
  'growth.ui.strategy.capacityWarning':
    'Ang indayog na ito ay {planned} mga post sa isang linggo laban sa isang nakasaad na kapasidad ng {capacity} oras. Bawasan ito o itaas ang kapasidad sa profile.',
  'growth.ui.strategy.measurementBody':
    'Kumpara sa sarili mong mga sumusunod na post sa parehong channel at format. Walang ginagamit na panlabas na benchmark, dahil walang maihahambing sa iyong account.',
  'growth.ui.strategy.localeAdaptations': 'Mga tala sa wika',

  'growth.ui.fourWeek.caption': 'Iminungkahing mga salawal ayon sa linggo at araw',
  'growth.ui.fourWeek.column.date': 'Petsa',
  'growth.ui.fourWeek.column.channel': 'Channel',
  'growth.ui.fourWeek.column.pillar': 'haligi',
  'growth.ui.fourWeek.column.format': 'Format',
  'growth.ui.fourWeek.column.brief': 'Maikling',
  'growth.ui.fourWeek.column.cta': 'Call to action',
  'growth.ui.fourWeek.column.measurement': 'Tag ng pagsukat',
  'growth.ui.fourWeek.column.actions': 'Mga aksyon',
  'growth.ui.fourWeek.approvalRequired': 'Kinakailangan ang pag-apruba bago ito mai-publish',
  'growth.ui.fourWeek.approvalNotRequired':
    'Walang kinakailangang pag-apruba para sa account na ito',
  'growth.ui.fourWeek.noCta': 'Walang call to action',
  'growth.ui.fourWeek.weekEmpty': 'Walang iminungkahing brief para sa linggong ito.',
  'growth.ui.fourWeek.acceptedCount':
    '{accepted} ng {total} mga salawal na tinanggap bilang mga draft',
  'growth.ui.fourWeek.acceptAnnouncement': 'Nalikha ang draft mula sa maikling ito.',
  'growth.ui.fourWeek.proposeAnnouncement': 'Idinagdag ang panukala sa kalendaryo para sa {date}.',

  'growth.ui.ugc.promptAngle': 'Anggulo {number}',
  'growth.ui.ugc.checklistTitle': 'Karapatan, pahintulot, at disclosure',
  'growth.ui.ugc.checklistHelp':
    'Pag-usapan ito nang mabuti sa bawat kalahok bago ma-publish ang kahit ano. Ang pahintulot na lumitaw ay hindi pahintulot na mag-advertise.',
  'growth.ui.ugc.incentiveNone': 'Walang inaalok na insentibo',
  'growth.ui.ugc.incentiveDisclosure':
    'Dapat isiwalat ang isang insentibo sa bawat post na resulta nito, kapwa ng iyo at ng kalahok.',
  'growth.ui.ugc.honesty':
    'Nagpaplano ito ng isang kampanya na isasagawa mo kasama ang mga tunay na tao. Hindi naghahanap ang Relay ng mga creator, hindi ito nakikipag-ugnayan sa kanila, hindi sumusulat ng testimonial, o gumagawa ng nilalaman para sa customer.',

  'growth.ui.opportunities.caption':
    'Mga na-verify na pagkakataon mula sa catalog, na niraranggo ayon sa akma sa iyong profile',
  'growth.ui.opportunities.column.opportunity': 'Pagkakataon',
  'growth.ui.opportunities.column.type': 'Uri',
  'growth.ui.opportunities.column.audience': 'Madla',
  'growth.ui.opportunities.column.fit': 'Bakit ito magkasya',
  'growth.ui.opportunities.column.requirements': 'Mga kinakailangan',
  'growth.ui.opportunities.column.rules': 'Mga panuntunan sa pag-promote sa sarili',
  'growth.ui.opportunities.column.cost': 'Gastos',
  'growth.ui.opportunities.column.effort': 'Pagsisikap',
  'growth.ui.opportunities.column.verified': 'Huling na-verify',
  'growth.ui.opportunities.column.actions': 'Mga aksyon',
  'growth.ui.opportunities.costFree': 'Libre',
  'growth.ui.opportunities.effort.low': 'Mababa',
  'growth.ui.opportunities.effort.medium': 'Katamtaman',
  'growth.ui.opportunities.effort.high': 'Mataas',
  'growth.ui.opportunities.noRequiredAsset': 'Walang kinakailangang asset',
  'growth.ui.opportunities.prepareTitle': 'Maghanda ng pagsusumite para sa {name}',
  'growth.ui.opportunities.prepareRules': 'Ang kanilang mga tuntunin, sinipi',
  'growth.ui.opportunities.prepareChecklist': 'Ano ang dapat ihanda',
  'growth.ui.opportunities.prepareManual':
    'Ikaw mismo ang nagsusumite nito sa kanilang site. Ang Relay ay hindi pumupuno ng mga form, lumikha ng mga account o mag-email sa sinuman.',
  'growth.ui.opportunities.pitchTitle': 'Pitch draft',
  'growth.ui.opportunities.pitchHelp':
    'I-edit ito bago mo ipadala. Ginagamit lang nito ang mga katotohanang kinumpirma mo.',
  'growth.ui.opportunities.submittedOn': 'Naisumite {date}',
  'growth.ui.opportunities.staleTitle':
    'Ang ilang mga entry ay nangangailangan ng muling pag-verify',
  'growth.ui.opportunities.staleBody':
    '{count, plural, one {# ang entry ay lumampas sa petsa ng pagsusuri nito} other {# ang mga entry ay lumampas sa kanilang petsa ng pagsusuri}}. Suriin ang kasalukuyang mga panuntunan sa site bago ka umasa sa mga ito.',
  'growth.ui.opportunities.emptyExample':
    'Ang isang row ng catalog ay naglalaman ng opisyal na URL, ang madla, ang mga panuntunan sa pagsusumite na sinipi mula sa site, ang gastos, ang pagsisikap at ang petsa na huling sinuri ito ng isang tao.',

  'growth.ui.tools.shown': '{shown} ng {max} ipinakita',
  'growth.ui.tools.fewerThanMax':
    'Tanging {count, plural, one {# mga tugma ng kasangkapan} other {# magkatugma ang mga kasangkapan}} ang daloy ng trabaho na ito na may kasalukuyang pagsusuri. Mas gugustuhin naming magpakita ng mas kaunti kaysa i-pad ang listahan.',
  'growth.ui.tools.emptyTitle': 'Wala pang nasuri na tool na umaangkop sa workflow na ito',
  'growth.ui.tools.emptyBody':
    'Ang bawat entry ay nangangailangan ng isang naka-check na presyo, naka-check na mga tuntunin ng karapatan at isang pinangalanang limitasyon bago ito lumitaw dito.',
  'growth.ui.tools.emptyExample':
    'Sinasabi ng isang entry kung para saan ito pinakamahusay, kung bakit ito umaangkop sa iyong plano, kung ano ang hindi nito magagawa, ang mga kasanayang kailangan nito, kung paano bumalik ang output sa Relay, at kung kailan huling nasuri ang presyo.',
  'growth.ui.tools.openSite': 'Buksan ang opisyal na site para sa {name}',
  'growth.ui.tools.stale':
    'Lumipas ang petsa ng pagsusuri nito. Hindi kasama sa mga nabuong plano.',

  'growth.ui.item.explainTitle': 'Bakit ito iminungkahi',
  'growth.ui.item.explainEvidence': 'Kung ano ang batayan nito',
  'growth.ui.item.explainNoEvidence':
    'Nagmula ito sa layunin at sa mga panuntunan ng channel, hindi mula sa isang kumpirmadong katotohanan tungkol sa iyong negosyo.',
  'growth.ui.item.dismissTitle': 'I-dismiss ang mungkahing ito',
  'growth.ui.item.dismissBody':
    'Sabihin sa amin kung bakit. Ang dahilan ay naka-imbak kasama ng plano at hinuhubog ang susunod na bersyon.',
  'growth.ui.item.dismissReasonLabel': 'Dahilan',
  'growth.ui.item.dismissReason.notRelevant': 'Hindi nauugnay sa negosyong ito',
  'growth.ui.item.dismissReason.noCapacity': 'Wala kaming kapasidad',
  'growth.ui.item.dismissReason.wrongAudience': 'Maling audience',
  'growth.ui.item.dismissReason.alreadyDone': 'Ginagawa na namin ito',
  'growth.ui.item.dismissReason.policy': 'Laban sa aming patakaran o mga paghahabol',
  'growth.ui.item.dismissReason.other': 'ibang bagay',
  'growth.ui.item.dismissNote': 'Kahit anong gusto mong idagdag',
  'growth.ui.item.dismissed': 'Nadismiss. Ito ay mananatiling nakikita para ma-undo mo ito.',
  'growth.ui.item.undoDismiss': 'I-undo ang pag-dismiss',

  'growth.ui.export.title': 'I-export ang planong ito',
  'growth.ui.export.formatLabel': 'Format',
  'growth.ui.export.copy': 'Kopyahin sa clipboard',
  'growth.ui.export.download': 'Mag-download ng file',
  'growth.ui.export.copied': 'Ang plano ay kinopya sa clipboard.',
  'growth.ui.export.schemaNote':
    'Lahat ng tatlong format ay nagmula sa isang napatunayang schema, bersyon {version}. Ang mga structured na view ay ligtas para sa source control at walang mga lihim.',
  'growth.ui.export.previewLabel': 'I-export ang preview',
} as const;
