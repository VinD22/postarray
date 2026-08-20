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

  'settings.ui.subtitle': 'كل ما يقوم بتكوين مساحة العمل هذه. لا شيء هنا ينشر أي شيء.',
  'settings.ui.nav.label': 'أقسام الإعدادات',
  'settings.ui.index.help': 'اختر قسمًا. يُنسب كل تغيير إليك ويظهر في سجل التدقيق.',

  'settings.ui.section.members': 'الأعضاء والأدوار',
  'settings.ui.section.membersSummary': 'من الموجود في مساحة العمل هذه وما يمكن لكل شخص فعله.',
  'settings.ui.section.projects': 'Projects',
  'settings.ui.section.projectsSummary':
    'الصوت والجمهور والمطالبات المعتمدة والمصطلحات المحظورة وقواعد اللغة والمجالات والمسرد.',
  'settings.ui.section.agents': 'الوكلاء وواجهة برمجة التطبيقات',
  'settings.ui.section.agentsSummary':
    'حسابات الخدمة والنطاقات والحدود وبيانات الاعتماد والنشاط وملعب التشغيل الجاف.',
  'settings.ui.section.apps': 'تطبيقات المطورين',
  'settings.ui.section.appsSummary':
    'تطبيقات OAuth التابعة لجهات خارجية، والقوائم المسموح بها لإعادة التوجيه، والموافقات والمنح.',
  'settings.ui.section.webhooks': 'خطافات الويب',
  'settings.ui.section.webhooksSummary':
    'الأحداث الصادرة الموقعة، وسجلات التسليم، وإعادة التسليم، والتناوب السري.',
  'settings.ui.section.billing': 'الفواتير',
  'settings.ui.section.billingSummary':
    'الخطة والتجربة والفاصل الزمني واستخدام المزود المقنن والفواتير والإلغاء.',
  'settings.ui.section.referrals': 'الإحالة والانتساب',
  'settings.ui.section.referralsSummary':
    'رابط الإحالة الذي تم الكشف عنه، والاشتراكات المنسوبة وحالة العمولة.',
  'settings.ui.section.localization': 'التعريب',
  'settings.ui.section.localizationSummary':
    'لغة الواجهة ولغات المحتوى والأسواق والمنطقة الزمنية وتنسيق الوقت.',
  'settings.ui.section.security': 'الأمن',
  'settings.ui.section.securitySummary':
    'الجلسات والمصادقة الثنائية وبيانات الاعتماد والوكلاء وخطافات الويب ومنح التطبيقات.',
  'settings.ui.section.data': 'ضوابط البيانات',
  'settings.ui.section.dataSummary':
    'تصدير أو إلغاء اتصال أو حذف علامة تجارية أو حذف محتوى أو إغلاق الحساب.',

  /* ------------------------------------------------------- shared UI states */

  'settings.ui.state.loading': 'جاري التحميل {section}',
  'settings.ui.state.errorTitle': 'لم نتمكن من تحميل {section}',
  'settings.ui.state.errorRetry': 'حاول مرة أخرى',
  'settings.ui.state.savingAnnouncement': 'توفير {section}',
  'settings.ui.state.savedAnnouncement': '{section} تم الحفظ',
  'settings.ui.state.saveFailedAnnouncement': 'لم يتم حفظ {section}. مدخلاتك لا تزال هنا.',
  'settings.ui.state.offlineTitle': 'أنت غير متصل',
  'settings.ui.state.offlineBody':
    'يمكنك قراءة هذه الصفحة. لا يمكن حفظ التغييرات حتى يعود الاتصال.',
  'settings.ui.state.permissionTitle': 'ليس لديك حق الوصول إلى {section}',
  'settings.ui.state.permissionBody':
    'يغير هذا القسم كيفية عمل مساحة العمل، لذا فهي محدودة حسب الدور.',
  'settings.ui.state.permissionRequirements': 'ما تحتاجه',
  'settings.ui.state.permissionContact':
    'يمكن لمالك مساحة العمل هذه أو مسؤولها منحها. تم إدراجهم ضمن الأعضاء والأدوار.',
  'settings.ui.state.rateLimitTitle': 'الكثير من التغييرات في وقت قصير',
  'settings.ui.state.rateLimitCause': 'وصلت مساحة العمل هذه إلى حد الكتابة لتغييرات الإعدادات.',
  'settings.ui.state.rateLimitReset': 'إعادة تعيين الحد',
  'settings.ui.state.rateLimitAlternative':
    'لم يضيع أي شيء مما حفظته. لا تزال إجراءات القراءة فقط تعمل أثناء الانتظار.',
  'settings.ui.state.rateLimitUsage': 'إعدادات يكتب هذه الساعة',
  'settings.ui.state.rateLimitUsageText': '{used} من {limit} مستخدم',
  'settings.ui.state.unsavedTitle': 'لديك تغييرات غير محفوظة',
  'settings.ui.state.unsavedBody': 'احفظها قبل أن تغادر هذا القسم.',
  'settings.ui.state.readOnlyTitle': 'مساحة العمل هذه للقراءة فقط',
  'settings.ui.state.readOnlyBody':
    'لقد تجاوز موعد سداد الفواتير. المحتوى الخاص بك والإيصالات والاتصالات سليمة. يمكن قراءة الإعدادات ولكن لم يتم تغييرها.',

  'settings.ui.state.referenceLabel': 'مرجع الدعم',

  'settings.ui.attribution': 'تم التغيير بواسطة {name} {relativeTime}',
  'settings.ui.attributionNever': 'لم يتغير منذ إنشائه',
  'settings.ui.copyFailed': 'لقد قام متصفحك بحظر النسخة. حدد النص وانسخه يدويًا.',

  /* ------------------------------------------------------- members and roles */

  'settings.ui.members.description': 'يتم تسجيل كل دعوة وتغيير دور وإزالة باسمك والوقت.',
  'settings.ui.members.tableCaption': 'الأشخاص في مساحة العمل هذه، لهم الدور والنطاق',
  'settings.ui.members.column.person': 'شخص',
  'settings.ui.members.column.role': 'الدور',
  'settings.ui.members.column.scope': 'النطاق',
  'settings.ui.members.column.approvals': 'الموافقات',
  'settings.ui.members.column.lastActive': 'آخر نشاط',
  'settings.ui.members.column.actions': 'الإجراءات',
  'settings.ui.members.scopeAll': 'جميع العلامات التجارية والحسابات',
  'settings.ui.members.scopeLimited':
    '{count, plural, one {#علامة تجارية} zero {#العلامات التجارية} two {#العلامات التجارية} few {#العلامات التجارية} many {#العلامات التجارية} other {#العلامات التجارية}}: {names}',
  'settings.ui.members.approvals.canApprove': 'يمكن الموافقة',
  'settings.ui.members.approvals.cannotApprove': 'لا يمكن الموافقة',
  'settings.ui.members.approvals.canApproveOwnProjects':
    'يمكن الموافقة على العلامات التجارية المدرجة',
  'settings.ui.members.lastActiveNever': 'لم يسجل الدخول بعد',
  'settings.ui.members.changeRole': 'تغيير الدور لـ {name}',
  'settings.ui.members.remove': 'إزالة {name}',
  'settings.ui.members.lastOwnerTitle': 'تحتفظ مساحة العمل بمالك واحد على الأقل',
  'settings.ui.members.lastOwnerBody': 'اجعل شخصًا آخر مالكًا أولاً، ثم يصبح هذا التغيير متاحًا.',
  'settings.ui.members.inviteTitle': 'قم بدعوة شخص ما إلى مساحة العمل هذه',
  'settings.ui.members.inviteBody':
    'يتلقون بريدًا إلكترونيًا يحتوي على رابط. تنتهي صلاحية الدعوة بعد سبعة أيام ويمكنك إلغاءها قبل ذلك.',
  'settings.ui.members.inviteRole': 'الدور',
  'settings.ui.members.inviteScope': 'Project يمكنهم العمل فيها',
  'settings.ui.members.inviteScopeAll': 'كل علامة تجارية في مساحة العمل هذه',
  'settings.ui.members.inviteScopeSelected': 'فقط العلامات التجارية التي أختارها',
  'settings.ui.members.inviteApprovals': 'يمكن أن تقرر طلبات الموافقة',
  'settings.ui.members.inviteApprovalsHelp':
    'يمكن منح هذا فقط للأدوار التي تتضمن مراجعة بالفعل. وهو منفصل عن التحرير.',
  'settings.ui.members.inviteSubmit': 'أرسل دعوة',
  'settings.ui.members.invitePending': 'تمت دعوة {relativeTime} بواسطة {name}',
  'settings.ui.members.inviteRevoke': 'إلغاء الدعوة',
  'settings.ui.members.inviteResend': 'أرسل الدعوة مرة أخرى',
  'settings.ui.members.emptyTitle': 'أنت الشخص الوحيد هنا',
  'settings.ui.members.emptyBody':
    'قم بدعوة الأشخاص الذين يكتبون النتائج أو يوافقون عليها أو يقرؤونها. كل واحد يحصل على دور ونطاق العلامة التجارية.',
  'settings.ui.members.emptyExample':
    'شكل مشترك: مالك واحد للفواتير، ومعتمد واحد لكل علامة تجارية، ومحررون يقومون بالصياغة ولكنهم لا ينشرون مطلقًا.',
  'settings.ui.members.roleReferenceTitle': 'ما يمكن أن يفعله كل دور',
  'settings.ui.members.roleReferenceCaption': 'الأدوار والإجراءات التي يسمح بها كل واحد',
  'settings.ui.members.roleColumn.role': 'الدور',
  'settings.ui.members.roleColumn.can': 'يمكن أن تفعل',
  'settings.ui.members.roleColumn.cannot': 'لا أستطيع أن أفعل',
  'settings.ui.members.roleCannot.owner': 'ولا يُمنع شيء من المالك.',
  'settings.ui.members.roleCannot.admin': 'تغيير الفواتير، أو حذف مساحة العمل.',
  'settings.ui.members.roleCannot.manager': 'تغيير الفواتير أو الأدوار أو حذف مساحة العمل.',
  'settings.ui.members.roleCannot.editor': 'الموافقة على الاتصالات أو جدولتها أو نشرها أو تغييرها.',
  'settings.ui.members.roleCannot.approver': 'تغيير الاتصالات والقواعد أو الفواتير.',
  'settings.ui.members.roleCannot.analyst': 'إنشاء أو تعديل أو الموافقة أو نشر أي شيء.',
  'settings.ui.members.roleCannot.viewer': 'تغيير أي شيء على الإطلاق.',
  'settings.ui.members.removeTitle': 'قم بإزالة {name} من مساحة العمل هذه',
  'settings.ui.members.removeConsequence.access': 'يفقدون إمكانية الوصول على الفور، على كل سطح.',
  'settings.ui.members.removeConsequence.drafts':
    'تظل المسودات التي كتبوها في مساحة العمل وقابلة للتحرير.',
  'settings.ui.members.removeConsequence.audit':
    'تظل إجراءاتهم السابقة في سجل التدقيق وفي الإيصالات.',
  'settings.ui.members.removeConsequence.approvals':
    'تعود طلبات الموافقة المنتظرة إلى قائمة الانتظار لمعتمد آخر.',

  /* ----------------------------------------------------------------- projects */

  'settings.ui.projects.description':
    'تحمل العلامة التجارية القواعد التي يتم فحص المحتوى وفقًا لها: ما قد تطالب به، وما لا يجوز لك قوله، وكيفية كتابة كل لغة.',
  'settings.ui.projects.listCaption': 'Projects في مساحة العمل هذه',
  'settings.ui.projects.column.project': 'Project',
  'settings.ui.projects.column.locales': 'لغات المحتوى',
  'settings.ui.projects.column.accounts': 'الحسابات',
  'settings.ui.projects.column.updated': 'تم التحديث',
  'settings.ui.projects.accountCount':
    '{count, plural, =0 {لا حسابات} one {# حساب} zero {#حسابات} two {#حسابات} few {#حسابات} many {#حسابات} other {#حسابات}}',
  'settings.ui.projects.emptyTitle': 'لا توجد علامات تجارية حتى الآن',
  'settings.ui.projects.emptyBody':
    'تجمع العلامة التجارية الحسابات وقواعد الموافقة وقواعد اللغة. تبدأ معظم الفرق بواحدة وتضيف ثانية عندما يحتاج العميل أو السوق إلى قواعد مختلفة.',
  'settings.ui.projects.emptyExample':
    'مثال: العلامة التجارية "Acme EU"، باللغتين الإنجليزية والألمانية، المصطلح المحظور "مضمون"، الكشف عن "شراكة مدفوعة الأجر" لـ Instagram.',
  'settings.ui.projects.voiceHelp':
    'كيف تبدو هذه العلامة التجارية. يُستخدم عندما تطلب إعادة الكتابة وعندما يتم التحقق من المطالبات.',
  'settings.ui.projects.audienceHelp': 'من هو المحتوى، لكل سوق.',
  'settings.ui.projects.approvedClaimsHelp':
    'البيانات التي قام المراجع بمسحها. يتم وضع علامة على أي شيء خارج هذه القائمة قبل الموافقة عليه، وليس بعد النشر.',
  'settings.ui.projects.blockedTermsHelp':
    'الكلمات التي تمنع الجدولة لهذه العلامة التجارية. واحد لكل سطر.',
  'settings.ui.projects.domainsHelp':
    'النطاقات التي قد ترتبط بها هذه العلامة التجارية وتختصرها. يمكن تحديد المجالات التي تم التحقق منها فقط في الملحن.',
  'settings.ui.projects.domainVerified': 'تم التحقق {date}',
  'settings.ui.projects.domainPending': 'سجل DNS لم ير بعد',
  'settings.ui.projects.disclosureHelp':
    'يتم تطبيقه افتراضيًا في الملحن للأنظمة الأساسية التي تختارها هنا. ويمكن تغييره لكل مشاركة قبل الموافقة عليها.',
  'settings.ui.projects.glossaryHelp':
    'أسماء المنتجات والمصطلحات القانونية وأي شيء يجب أن يبقى بعد الترجمة دون تغيير.',
  'settings.ui.projects.glossaryCaption': 'المصطلحات المحمية وكيفية التعامل مع كل منها لكل لغة',
  'settings.ui.projects.glossaryEmpty':
    'لا توجد شروط محمية حتى الآن. أضف أسماء المنتجات والمصطلحات القانونية التي لا يجب ترجمتها أو إعادة صياغتها.',
  'settings.ui.projects.localeRulesHelp':
    'القواعد لكل لغة المحتوى. يتم تطبيقها عند التكيف أو التحويل، ويتم عرضها للمراجع.',
  'settings.ui.projects.saveProject': 'حفظ العلامة التجارية',

  /* ------------------------------------------------------------ localization */

  'settings.ui.localization.description':
    'ثلاثة إعدادات منفصلة: لغة هذا التطبيق، واللغات التي تنشر بها، والأسواق التي تكتب لها. تغيير واحد لا يغير آخر.',
  'settings.ui.localization.interfaceOnlyEnglish':
    'اختر لغة الواجهة لهذا التطبيق. لغات المحتوى منفصلة ومتوفرة بالفعل.',
  'settings.ui.localization.marketHelp':
    'أمثلة تغيرات السوق والإفصاحات القانونية والدعوات إلى العمل. لا يغير لغة المنشور.',
  'settings.ui.localization.previewTitle': 'كيف سيتم قراءة التواريخ والأرقام',
  'settings.ui.localization.previewDate': 'التاريخ',
  'settings.ui.localization.previewTime': 'الوقت',
  'settings.ui.localization.previewNumber': 'رقم',
  'settings.ui.localization.previewCurrency': 'العملة',
  'settings.ui.localization.weekStartHelp': 'يتم استخدامه بواسطة عرض أسبوع التقويم.',

  /* ---------------------------------------------------------------- security */

  'settings.ui.security.description':
    'كل ما يمكنه العمل في مساحة العمل هذه، في مكان واحد: جلساتك وبيانات الاعتماد والوكلاء وخطافات الويب والتطبيقات التي منحتها حق الوصول إليها.',
  'settings.ui.security.sessionsCaption': 'جلسات تسجيل الدخول لحسابك',
  'settings.ui.security.sessionColumn.device': 'الجهاز والمتصفح',
  'settings.ui.security.sessionColumn.location': 'الموقع التقريبي',
  'settings.ui.security.sessionColumn.lastSeen': 'آخر استخدام',
  'settings.ui.security.sessionCurrent': 'هذه الجلسة',
  'settings.ui.security.sessionRevokeAll': 'قم بتسجيل الخروج في كل جلسة أخرى',
  'settings.ui.security.sessionLocationUnknown': 'لم يتم تسجيل الموقع',
  'settings.ui.security.mfaOn': 'المصادقة الثنائية قيد التشغيل',
  'settings.ui.security.mfaOff': 'تم إيقاف المصادقة الثنائية',
  'settings.ui.security.mfaBody':
    'هناك حاجة إلى عامل ثانٍ قبل تغيير الفواتير وإنشاء حساب الخدمة وإعادة توصيل الحساب وإلغاء بيانات الاعتماد.',
  'settings.ui.security.credentialsTitle': 'مفاتيح واجهة برمجة التطبيقات',
  'settings.ui.security.credentialsBody':
    'المفاتيح المملوكة لمساحة العمل هذه. وهي منفصلة عن منح التطبيقات وعن الجلسة الخاصة بك.',
  'settings.ui.security.agentsTitle': 'حسابات الخدمة',
  'settings.ui.security.webhooksTitle': 'نقاط نهاية Webhook',
  'settings.ui.security.grantsTitle': 'التطبيقات التي سمحت بها',
  'settings.ui.security.grantsBody':
    'يؤدي إلغاء التطبيق إلى إيقاف الرموز المميزة الخاصة به على الفور. لن تتأثر اتصالاتك الخاصة والمشاركات المجدولة.',
  'settings.ui.security.grantScopes': 'الأذونات الممنوحة',
  'settings.ui.security.socialPermissionsTitle': 'أذونات الحساب الاجتماعي',
  'settings.ui.security.socialPermissionsBody':
    'ما سمح كل حساب متصل لـ Relay بالقيام به، من لقطة القدرة التي تم التقاطها في وقت الاتصال.',
  'settings.ui.security.viewInSection': 'إدارة في {section}',
  'settings.ui.security.emptySessions': 'تم تسجيل الدخول إلى هذه الجلسة فقط.',
  'settings.ui.security.emptyGrants':
    'لا يوجد تطبيق تابع لجهة خارجية يمكنه الوصول إلى مساحة العمل هذه. تظهر التطبيقات هنا بعد السماح بها على شاشة الموافقة.',
  'settings.ui.security.revokeGrantTitle': 'إبطال الوصول لـ {app}',
  'settings.ui.security.revokeGrantConsequence.tokens':
    'تتوقف رموز الوصول والتحديث الخاصة به عن العمل على الفور.',
  'settings.ui.security.revokeGrantConsequence.scheduled':
    'المشاركات المقررة بالفعل البقاء المقرر. قم بإلغائها بشكل منفصل إذا كنت تريد إيقافها.',
  'settings.ui.security.revokeGrantConsequence.reconnect':
    'يمكن للتطبيق أن يطلب الوصول مرة أخرى، ويمكنك رفضه.',

  /* ----------------------------------------------------------- data controls */

  'settings.ui.data.description':
    'أخرج بياناتك، أو أزل شيئًا واحدًا، أو أغلق الحساب. كل عمل هدَّام يُسمِّي بالضبط ما يلمسه أولاً.',
  'settings.ui.data.exportTitle': 'تصدير',
  'settings.ui.data.exportBody':
    'أرشيف محمول للمحتوى والجداول والإيصالات والتحليلات وأحداث التدقيق، بالإضافة إلى الوسائط التي تم تحميلها.',
  'settings.ui.data.exportJson': 'JSON منظم',
  'settings.ui.data.exportCsv': 'جدول البيانات CSV',
  'settings.ui.data.exportMedia': 'أرشيف الوسائط',
  'settings.ui.data.exportJsonHelp': 'ملف واحد لكل نوع سجل. موثقة ومستقرة عبر الإصدارات.',
  'settings.ui.data.exportCsvHelp': 'المنشورات والإيصالات والمقاييس كجداول مسطحة لجدول البيانات.',
  'settings.ui.data.exportMediaHelp':
    'الملفات الأصلية التي قمت بتحميلها أو استيرادها، مع المجاميع الاختبارية.',
  'settings.ui.data.exportStart': 'تحضير التصدير',
  'settings.ui.data.exportRunning':
    'إعداد التصدير الخاص بك. ويستمر تشغيله إذا قمت بإغلاق هذه الصفحة.',
  'settings.ui.data.exportReady': 'التصدير جاهز، جاهز {date}',
  'settings.ui.data.exportDownload': 'تحميل التصدير',
  'settings.ui.data.exportExpires': 'تنتهي صلاحية رابط التنزيل {date}.',
  'settings.ui.data.deleteTitle': 'حذف',
  'settings.ui.data.deleteBody': 'اختر أصغر شيء يحل مشكلتك. كل خيار أدناه يقول ما يبقى.',
  'settings.ui.data.deleteConnection': 'قم بإلغاء اتصال اجتماعي واحد',
  'settings.ui.data.deleteConnectionHelp':
    'يزيل Relay الوصول إلى هذا الحساب. تبقى مساحة العمل ومحتواها وإيصالاتها.',
  'settings.ui.data.deleteProject': 'حذف علامة تجارية',
  'settings.ui.data.deleteProjectHelp':
    'يزيل العلامة التجارية وقواعدها ومعجمها. المحتوى المنشور تحته يحتفظ بإيصالاته.',
  'settings.ui.data.deleteContent': 'حذف المحتوى والوسائط',
  'settings.ui.data.deleteContentHelp':
    'يزيل المسودات والملفات المخزنة. ولا يزيل أي شيء منشور بالفعل على النظام الأساسي.',
  'settings.ui.data.deleteAccount': 'أغلق مساحة العمل هذه',
  'settings.ui.data.deleteAccountHelp':
    'يلغي المهام المجدولة، ويلغي كل اتصال، ويزيل الوسائط المخزنة، ويغلق مساحة العمل.',
  'settings.ui.data.scheduledJobsTitle': 'العمل المقرر الذي سيتم إلغاؤه أولاً',
  'settings.ui.data.scheduledJobsCount':
    '{count, plural, =0 {لا يوجد شيء مقرر الآن} one {# مشاركة مجدولة} zero {# منشورات مجدولة} two {# منشورات مجدولة} few {# منشورات مجدولة} many {# منشورات مجدولة} other {# منشورات مجدولة}}',
  'settings.ui.data.cancelJobsFirst': 'إلغاء المشاركات المجدولة الآن',
  'settings.ui.data.cancelJobsDone': 'تم إلغاء المشاركات المجدولة. لن ينشر شيء.',
  'settings.ui.data.deleteConfirmPhraseLabel': 'اكتب اسم مساحة العمل للتأكيد',
  'settings.ui.data.deleteConsequence.jobs': 'يتم إلغاء كل مشاركة مجدولة قبل إزالة أي شيء.',
  'settings.ui.data.deleteConsequence.connections': 'يتم إلغاء كل اتصال اجتماعي عند الموفر.',
  'settings.ui.data.deleteConsequence.media': 'يتم حذف الوسائط المخزنة ولا يمكن استعادتها.',
  'settings.ui.data.deleteConsequence.receipts':
    'يتم الاحتفاظ بإيصالات النشر لفترة الاحتفاظ المنصوص عليها في الشروط، ثم تتم إزالتها.',
  'settings.ui.data.deleteConsequence.published':
    'لا يتم حذف المشاركات الموجودة بالفعل على النظام الأساسي. قم بإزالة تلك الموجودة على المنصة.',
  'settings.ui.data.exportFirst': 'قم بتصدير بياناتك قبل حذفها.',

  /* --------------------------------------------------------------- referrals */

  'settings.ui.referral.description':
    'شارك Relay برابط مكشوف. اللجنة ليست مشروطة أبدًا بمراجعة إيجابية.',
  'settings.ui.referral.linkLabel': 'رابط الإحالة الخاص بك',
  'settings.ui.referral.tableCaption': 'الاشتراكات المنسوبة وحالة عمولتها',
  'settings.ui.referral.column.signup': 'الاشتراك',
  'settings.ui.referral.column.date': 'التاريخ',
  'settings.ui.referral.column.state': 'اللجنة',
  'settings.ui.referral.column.amount': 'المبلغ',
  'settings.ui.referral.emptyTitle': 'لا توجد اشتراكات منسوبة حتى الآن',
  'settings.ui.referral.emptyBody':
    'تظهر الاشتراكات هنا بمجرد أن يبدأ شخص ما الفترة التجريبية من خلال الرابط الخاص بك. تظل المبالغ معلقة حتى يتم إغلاق نافذة استرداد الأموال.',
  'settings.ui.referral.emptyExample':
    'مثال على الصف: acme.example، بدأت النسخة التجريبية في 12 يونيو، وكانت معلقة حتى 12 يوليو، ثم تمت الموافقة عليها.',
  'settings.ui.referral.termsLink': 'اقرأ شروط الشريك',
  'settings.ui.referral.balance': 'العمولة المعتمدة',
  'settings.ui.referral.balanceUnavailableReason': 'ولم تتم تسوية دفتر العمولة لهذه الفترة بعد.',

  /* --------------------------------------------------------- agents and API */

  'developer.ui.agents.description':
    'حساب الخدمة هو هوية مسماة للوكيل أو البرنامج النصي أو سير العمل. إنه يحمل نطاقاته الخاصة، وحدوده الخاصة، ومسار التدقيق الخاص به.',
  'developer.ui.agents.emptyTitle': 'لا توجد حسابات الخدمة حتى الآن',
  'developer.ui.agents.emptyBody':
    'قم بإنشاء واحدة لكل عملية أتمتة تقوم بتشغيلها. الحسابات المنفصلة تعني أنه يمكنك إلغاء أحد الحسابات دون إيقاف الحسابات الأخرى.',
  'developer.ui.agents.emptyExample':
    'مثال: "وكيل المحتوى"، العلامة التجارية Acme EU، قد يقوم بصياغة وجدولة ما يصل إلى 6 منشورات يوميًا بين الساعة 07:00 و22:00، ولا يتم النشر على الفور أبدًا.',
  'developer.ui.agents.step.identity': 'الاسم والغرض',
  'developer.ui.agents.step.scope': 'ما يمكن أن تصل إليه',
  'developer.ui.agents.step.limits': 'حدود',
  'developer.ui.agents.purpose': 'ما هو هذا الحساب ل',
  'developer.ui.agents.purposeHelp':
    'جملة واحدة. ويظهر بجوار كل إجراء يتخذه هذا الحساب في سجل التدقيق.',
  'developer.ui.agents.scopeHelp': 'نطاق يمنح نفسه بالضبط. لا شيء هنا يعني أي شيء آخر.',
  'developer.ui.agents.limitsHelp':
    'يتم فرض الحدود بواسطة واجهة برمجة التطبيقات (API)، وليس بواسطة الوكيل. لا يمكن للوكيل رفع الحد الخاص به.',
  'developer.ui.agents.quietHours': 'ساعات هادئة',
  'developer.ui.agents.quietHoursHelp':
    'لا يمكن للحساب جدولة أو النشر خلال هذه الساعات، في المنطقة الزمنية لمساحة العمل.',
  'developer.ui.agents.lookAheadHelp': 'إلى أي مدى في المستقبل قد يضع وظيفة.',
  'developer.ui.agents.cadenceHelp': 'أكثر المنشورات الخارجية التي قد تسببها في يوم واحد.',
  'developer.ui.agents.expiry': 'انتهاء صلاحية الاعتماد',
  'developer.ui.agents.expiryHelp': 'حياة أقصر هي أكثر أمانا. يمكنك التدوير في أي وقت.',
  'developer.ui.agents.summaryTitle': 'قبل إنشائه',
  'developer.ui.agents.summaryAccounts': 'الحسابات التي يمكن أن تصل إليها',
  'developer.ui.agents.summaryMaxActions':
    'على الأكثر {count, plural, one {#النشر الخارجي} zero {# منشورات خارجية} two {# منشورات خارجية} few {# منشورات خارجية} many {# منشورات خارجية} other {# منشورات خارجية}} يوميا.',
  'developer.ui.agents.summaryApproval': 'سلوك الموافقة',
  'developer.ui.agents.summaryCreate': 'إنشاء حساب الخدمة',
  'developer.ui.agents.detailTitle': 'حساب الخدمة',
  'developer.ui.agents.statusActive': 'نشط',
  'developer.ui.agents.statusStopped': 'توقف',
  'developer.ui.agents.statusExpired': 'انتهت صلاحية بيانات الاعتماد',
  'developer.ui.agents.stoppedBody':
    'هذا الحساب متوقف. يتم رفض كل مكالمة يتم إجراؤها لسبب واضح. لم تتم إزالة أي شيء تم إنشاؤه.',
  'developer.ui.agents.killTitle': 'توقف {name}',
  'developer.ui.agents.killConsequence.calls':
    'يتم رفض كل استدعاء API وMCP وCLI من هذا الحساب مرة واحدة.',
  'developer.ui.agents.killConsequence.scheduled':
    'المشاركات المقررة بالفعل البقاء المقرر. قم بإلغائها من التقويم إذا كنت تريد إيقافها.',
  'developer.ui.agents.killConsequence.reversible': 'يمكنك البدء مرة أخرى لاحقًا.',
  'developer.ui.agents.resume': 'ابدأ تشغيل هذا الوكيل مرة أخرى',
  'developer.ui.agents.rotate': 'تدوير بيانات الاعتماد',
  'developer.ui.agents.rotateTitle': 'قم بتدوير بيانات الاعتماد لـ {name}',
  'developer.ui.agents.rotateConsequence.old': 'تتوقف بيانات الاعتماد الحالية عن العمل على الفور.',
  'developer.ui.agents.rotateConsequence.new': 'يتم عرض الجديد مرة واحدة في هذه الصفحة.',
  'developer.ui.agents.rotateConsequence.clients':
    'أي شيء يستخدم القيمة القديمة يفشل حتى تقوم بتحديثه.',
  'developer.ui.agents.credentialStored': 'لقد قمت بتخزين بيانات الاعتماد هذه',
  'developer.ui.agents.credentialLabel': 'بيانات اعتماد حساب الخدمة',
  'developer.ui.agents.credentialWarning':
    'هذه هي المرة الوحيدة التي يتم فيها عرض بيانات الاعتماد هذه',
  'developer.ui.agents.credentialWarningBody':
    'انسخه إلى متجرك السري الآن. نحن نحتفظ بالتجزئة فقط، لذلك لا يمكننا إظهارها مرة أخرى. التدوير يخلق واحدة جديدة.',
  'developer.ui.agents.credentialConsumed':
    'لم يعد يتم عرض بيانات الاعتماد. قم بتدويرها إذا لم تقم بتخزينها.',
  'developer.ui.agents.credentialReveal': 'إظهار بيانات الاعتماد',
  'developer.ui.agents.credentialHide': 'إخفاء بيانات الاعتماد',

  /* Scope sentences written for the person granting them, not for the
     developer requesting them. The developer facing wording lives in
     `developer.scope.*`. */
  'developer.ui.scope.accounts_read': 'اطلع على حساباتك المتصلة وما يمكن أن يفعله كل واحد منها',
  'developer.ui.scope.accounts_write': 'إعادة تسمية الحسابات وتغيير كيفية تجميعها',
  'developer.ui.scope.drafts_read': 'اقرأ مسوداتك ومتغيراتها',
  'developer.ui.scope.drafts_write': 'إنشاء وتحرير المسودات',
  'developer.ui.scope.posts_schedule': 'جدولة المحتوى المعتمد لحساباتك',
  'developer.ui.scope.posts_publish': 'انشر على حساباتك على الفور',
  'developer.ui.scope.posts_cancel': 'إلغاء المشاركات المجدولة',
  'developer.ui.scope.analytics_read': 'قراءة التحليلات لحساباتك',
  'developer.ui.scope.media_read': 'شاهد الملفات الموجودة في مكتبتك',
  'developer.ui.scope.media_write': 'تحميل وتحرير الملفات في مكتبتك',
  'developer.ui.scope.rules_read': 'اقرأ قواعد الأتمتة الخاصة بك',
  'developer.ui.scope.rules_write': 'إنشاء وتغيير قواعد الأتمتة التي يمكنها النشر',
  'developer.ui.scope.growth_read': 'اقرأ خطط النمو الخاصة بك',
  'developer.ui.scope.growth_write': 'إنشاء وتحرير خطط النمو',
  'developer.ui.scope.webhooks_manage': 'إنشاء نقاط نهاية خطاف الويب وتغييرها',
  'developer.ui.scope.billing_read': 'اقرأ خطتك وحالتك التجريبية واستخدامك',
  'developer.ui.scope.connections_admin': 'ربط وفصل الحسابات الاجتماعية',

  'developer.ui.activity.caption': 'استدعاءات الأداة الأخيرة، مع تلك التي تم رفضها',
  'developer.ui.activity.column.time': 'الوقت',
  'developer.ui.activity.column.tool': 'الأداة أو الطريق',
  'developer.ui.activity.column.outcome': 'النتيجة',
  'developer.ui.activity.column.subject': 'الموضوع',
  'developer.ui.activity.outcome.ok': 'مسموح',
  'developer.ui.activity.outcome.denied': 'مرفوض',
  'developer.ui.activity.outcome.failed': 'فشل',
  'developer.ui.activity.filterDenied': 'إظهار المحاولات المرفوضة فقط',
  'developer.ui.activity.deniedExplain':
    'المحاولة المرفوضة هي الطريقة التي يظهر بها الوكيل الذي تم تكوينه بشكل خاطئ. يتم الاحتفاظ بهذه الصفوف، وليست مخفية.',
  'developer.ui.activity.emptyTitle': 'لم يتم تسجيل أي مكالمات حتى الآن',
  'developer.ui.activity.emptyBody':
    'تظهر المكالمات هنا خلال ثوانٍ قليلة من حدوثها، بما في ذلك المكالمات التي تم رفضها.',
  'developer.ui.activity.emptyExample':
    'مثال للصف: 12:03، Draft_post، مسموح به، مسودة لحساب X @acme.',

  'developer.ui.setup.help':
    'الصق هذا في العميل الذي تتصل به. استبدل العنصر النائب لبيانات الاعتماد بالقيمة التي قمت بتخزينها.',
  'developer.ui.setup.credentialPlaceholder':
    'يستخدم المقتطف عنصرًا نائبًا. لا تقم أبدًا بإلزام بيانات الاعتماد الحقيقية بالمستودع.',
  'developer.ui.setup.copySnippet': 'انسخ مقتطفًا لـ {client}',
  'developer.ui.setup.snippetCopied': 'تم نسخ المقتطف',
  'developer.ui.setup.tabLabel': 'مقتطفات إعداد العميل',

  'developer.ui.playground.help':
    'يتم تشغيل الاستدعاءات مقابل نسخة مصنفة من مساحة العمل هذه. لم يتم الاتصال بمزود ولم تتم جدولة أي شيء.',
  'developer.ui.playground.tool': 'أداة',
  'developer.ui.playground.arguments': 'الحجج',
  'developer.ui.playground.argumentsHelp':
    'JSON. نفس الجسم الذي تقبله واجهة برمجة التطبيقات الحقيقية.',
  'developer.ui.playground.result': 'النتيجة',
  'developer.ui.playground.resultEmpty': 'قم بتشغيل أداة لمعرفة الاستجابة التي ستعود بها.',
  'developer.ui.playground.invalidJson': 'هذا ليس JSON صالحًا حتى الآن، لذا لا يمكن إرساله.',
  'developer.ui.playground.deniedByApproval':
    'مستوى الموافقة {level} لا يسمح بهذه المكالمة. يرفض التشغيل الجاف ذلك تمامًا كما تفعل واجهة برمجة التطبيقات (API).',
  'developer.ui.playground.announceResult': 'انتهى التشغيل الجاف. {outcome}.',

  /* --------------------------------------------------------- developer apps */

  'developer.ui.apps.description':
    'قم بتسجيل تطبيق حتى يتمكن الآخرون من منحه حق الوصول إلى مساحة العمل الخاصة بهم. يتمتع كل تطبيق بهويته الخاصة، وقائمة السماح بإعادة التوجيه الخاصة به، ومسار التدقيق الخاص به.',
  'developer.ui.apps.emptyTitle': 'لم يتم تسجيل أي تطبيقات',
  'developer.ui.apps.emptyBody':
    'قم بتسجيل تطبيق عندما يحتاج منتج آخر إلى التصرف نيابة عن مستخدم Relay. من أجل التشغيل الآلي الخاص بك، استخدم حساب الخدمة بدلاً من ذلك.',
  'developer.ui.apps.emptyExample':
    'مثال: "Acme Publisher"، عميل سري، إعادة توجيه حسابات النطاقات https://acme.example/oauth/callback,: القراءة والمسودات: الكتابة.',
  'developer.ui.apps.typeHelp':
    'يعمل العميل السري على خادم تتحكم فيه ويمكنه الحفاظ على السر. العميل العام هو متصفح أو تطبيق سطح مكتب ويستخدم PKCE بدون سر.',
  'developer.ui.apps.redirectAdd': 'قم بإضافة عنوان URI لإعادة التوجيه',
  'developer.ui.apps.redirectRemove': 'إزالة {uri}',
  'developer.ui.apps.redirectInvalid':
    'أدخل معرف https الكامل بدون حرف بدل أو سلسلة استعلام. يجب أن يتطابق تمامًا مع القيمة التي يرسلها تطبيقك.',
  'developer.ui.apps.linksTitle': 'الروابط المنشورة',
  'developer.ui.apps.linksHelp':
    'تظهر هذه على شاشة الموافقة. المستخدم الذي لا يستطيع الوصول إليهم لن يمنح حق الوصول.',
  'developer.ui.apps.linkUnreachable':
    'لم نتمكن من الوصول إلى عنوان URL هذا عندما قمنا بالتحقق آخر مرة، {date}.',
  'developer.ui.apps.linkReachable': 'يمكن الوصول إليه، محدد {date}',
  'developer.ui.apps.scopesTitle': 'الأذونات التي قد يطلبها هذا التطبيق',
  'developer.ui.apps.scopesHelp':
    'اطلب أقل ما تحتاجه. يرى المستخدم أذونات القراءة والأذونات التبعية كمجموعتين منفصلتين.',
  'developer.ui.apps.scopeGroup.read': 'قراءة الأذونات',
  'developer.ui.apps.scopeGroup.reversible': 'التغييرات التي يمكنك التراجع عنها',
  'developer.ui.apps.scopeGroup.consequential': 'الأذونات التبعية',
  'developer.ui.apps.scopeGroupHelp.read': 'هذه تتيح للتطبيق الاطلاع على البيانات. لا شيء يتغير.',
  'developer.ui.apps.scopeGroupHelp.reversible':
    'يتيح ذلك للتطبيق إنشاء أو تعديل الأشياء داخل Relay. لا شيء يصل إلى المنصة.',
  'developer.ui.apps.scopeGroupHelp.consequential':
    'يمكن أن يؤدي ذلك إلى نشر منشور على حساب حقيقي، أو تغيير من يمكنه الوصول إلى حساباتك. يتم إدراجها دائمًا بشكل منفصل ولا يتم تجميعها أبدًا.',
  'developer.ui.apps.noBundling':
    'لا يوجد نطاق وصول مشترك. يُطلب دائمًا إدارة الفواتير والاتصال بالاسم.',
  'developer.ui.apps.secretTitle': 'سر العميل',
  'developer.ui.apps.secretWarning': 'هذه هي المرة الوحيدة التي يظهر فيها سر العميل',
  'developer.ui.apps.secretWarningBody':
    'قم بتخزينه في المدير السري من جانب الخادم الخاص بك الآن. نحن نحتفظ فقط بالتجزئة. إذا فقدته، قم بتدويره: فلا توجد طريقة للكشف عنه مرة أخرى.',
  'developer.ui.apps.secretConsumed': 'لم يعد يتم عرض السر. قم بتدويرها إذا لم تقم بتخزينها.',
  'developer.ui.apps.secretStored': 'لقد قمت بتخزين هذا السر',
  'developer.ui.apps.secretPublicClient':
    'العميل العام ليس لديه سر. ويستخدم تدفق رمز التفويض مع PKCE.',
  'developer.ui.apps.rotateTitle': 'قم بتدوير سر العميل لـ {app}',
  'developer.ui.apps.rotateConsequence.old': 'السر الحالي يتوقف عن العمل على الفور.',
  'developer.ui.apps.rotateConsequence.grants': 'لا يتم إلغاء منح المستخدم الحالية.',
  'developer.ui.apps.rotateConsequence.deploy':
    'تفشل خوادمك في تحديث الرموز المميزة حتى تقوم بنشر القيمة الجديدة.',
  'developer.ui.apps.consentPreviewTitle': 'معاينة شاشة الموافقة',
  'developer.ui.apps.consentPreviewHelp':
    'وهذا ما يراه المستخدم. يتم إنشاؤه من سجل التطبيق، لذا لا يمكنه تقديم وعد بأكثر مما يطلبه التطبيق.',
  'developer.ui.apps.consentPreviewSample':
    'معاينة فقط. لا يتم منح أي شيء ولا يتم إصدار أي رمز مميز.',
  'developer.ui.apps.grantsCaption': 'Workspaces التي منحت الوصول إلى هذا التطبيق',
  'developer.ui.apps.grantColumn.workspace': 'Workspace',
  'developer.ui.apps.grantColumn.scopes': 'النطاقات',
  'developer.ui.apps.grantColumn.granted': 'منح',
  'developer.ui.apps.grantColumn.lastUsed': 'آخر استخدام',
  'developer.ui.apps.grantsEmpty': 'لم يمنح أحد حق الوصول إلى هذا التطبيق حتى الآن.',
  'developer.ui.apps.logsCaption': 'الطلبات الأخيرة، مع إزالة الأسرار والحمولات',
  'developer.ui.apps.logColumn.time': 'الوقت',
  'developer.ui.apps.logColumn.route': 'الطريق',
  'developer.ui.apps.logColumn.status': 'الحالة',
  'developer.ui.apps.logColumn.workspace': 'Workspace',
  'developer.ui.apps.logsRedacted':
    'يتم تخزين أجسام الطلب والاستجابة مع إزالة بيانات الاعتماد والرموز المميزة ومحتوى المستخدم.',
  'developer.ui.apps.sandboxTitle': 'بيانات اعتماد وضع الحماية',
  'developer.ui.apps.sandboxBody':
    'معرف عميل منفصل ومساحة عمل مع البيانات المصنفة. المكالمات التي يتم إجراؤها باستخدامه لا تصل أبدًا إلى المزود.',
  'developer.ui.apps.rateLimitLabel': 'حد المعدل',
  'developer.ui.apps.rateLimitUsage': '{used} من {limit} طلبات هذه الساعة',
  'developer.ui.apps.disable': 'تعطيل التطبيق',
  'developer.ui.apps.enable': 'تمكين التطبيق',
  'developer.ui.apps.disabledBody':
    'تم تعطيل هذا التطبيق. يتم رفض الرموز الموجودة ولا يمكن بدء منحة جديدة. يتم الاحتفاظ بالمنح حتى تتمكن من تمكينها مرة أخرى.',
  'developer.ui.apps.deleteTitle': 'حذف {app}',
  'developer.ui.apps.deleteConsequence.grants': 'يتم إلغاء كل منحة ويتوقف كل رمز مميز عن العمل.',
  'developer.ui.apps.deleteConsequence.logs': 'يتم الاحتفاظ بسجلات الطلب لفترة الاحتفاظ بالتدقيق.',
  'developer.ui.apps.deleteConsequence.irreversible': 'لا يمكن إعادة استخدام معرف العميل.',

  /* ---------------------------------------------------------------- webhooks */

  'developer.ui.webhooks.description':
    'تسليمات HTTPS الموقعة للأحداث التي تختارها. يتم تسجيل كل تسليم مع استجابته، ويمكن إرسال أي تسليم مرة أخرى.',
  'developer.ui.webhooks.emptyTitle': 'لا توجد نقاط النهاية حتى الآن',
  'developer.ui.webhooks.emptyBody':
    'أضف نقطة نهاية لتلقي نتائج النشر وقرارات الموافقة وسلامة الاتصال في أنظمتك الخاصة.',
  'developer.ui.webhooks.emptyExample':
    'مثال: https://hooks.acme.example/relay, مشترك في post.publish وpost.failed وconnection.action_required.',
  'developer.ui.webhooks.create': 'أضف نقطة نهاية',
  'developer.ui.webhooks.url': 'عنوان URL لنقطة النهاية',
  'developer.ui.webhooks.urlHelp':
    'HTTPS فقط. نحن لا نتبع أي عمليات إعادة توجيه ولا نعيد محاولة 2xx.',
  'developer.ui.webhooks.eventsTitle': 'الأحداث',
  'developer.ui.webhooks.eventsHelp':
    'اختر الأحداث التي تتعامل معها. إن إرسال كل شيء إلى نقطة نهاية تتجاهل معظمها يجعل من الصعب رؤية الفشل.',
  'developer.ui.webhooks.eventsAll': 'كل حدث',
  'developer.ui.webhooks.eventsSelected': 'فقط الأحداث التي أختارها',
  'developer.ui.webhooks.eventsCount':
    '{count, plural, one {#حدث} zero {# الأحداث} two {# الأحداث} few {# الأحداث} many {# الأحداث} other {# الأحداث}}',
  'developer.ui.webhooks.eventGroup.connections': 'اتصالات',
  'developer.ui.webhooks.eventGroup.content': 'المحتوى والموافقة',
  'developer.ui.webhooks.eventGroup.publishing': 'النشر',
  'developer.ui.webhooks.eventGroup.automation': 'الأتمتة والأعلاف',
  'developer.ui.webhooks.eventGroup.workspace': 'Workspace',
  'developer.ui.webhooks.scopeTitle': 'Projects والحسابات',
  'developer.ui.webhooks.scopeAll': 'كل علامة تجارية وحساب',
  'developer.ui.webhooks.scopeSelected': 'فقط تلك التي أختارها',
  'developer.ui.webhooks.secretTitle': 'سر التوقيع',
  'developer.ui.webhooks.secretBody':
    'تحقق من رأس التوقيع قبل تحليل النص. قم بإلغاء تكرار معرف التسليم، والذي يكون ثابتًا عبر عمليات إعادة المحاولة.',
  'developer.ui.webhooks.secretRotateTitle': 'تدوير سر التوقيع',
  'developer.ui.webhooks.secretRotateConsequence.overlap':
    'يتم قبول كلا السرين لمدة 24 ساعة حتى تتمكن من النشر دون إسقاط التسليم.',
  'developer.ui.webhooks.secretRotateConsequence.after':
    'بعد تلك النافذة يتم استخدام السر الجديد فقط.',
  'developer.ui.webhooks.testDeliveryHelp':
    'يرسل نموذجًا واحدًا لحدث موقّع تم وضع علامة عليه كاختبار، بحيث يمكن لجهاز الاستقبال الخاص بك تجاهله بأمان.',
  'developer.ui.webhooks.testDeliverySent': 'تم إرسال تسليم الاختبار. تظهر النتيجة في السجل أدناه.',
  'developer.ui.webhooks.deliveriesCaption': 'عمليات التسليم الأخيرة والرد الذي تلقاه كل واحد',
  'developer.ui.webhooks.deliveryColumn.time': 'مطلوب',
  'developer.ui.webhooks.deliveryColumn.event': 'حدث',
  'developer.ui.webhooks.deliveryColumn.attempt': 'محاولة',
  'developer.ui.webhooks.deliveryColumn.response': 'الاستجابة',
  'developer.ui.webhooks.deliveryColumn.status': 'الحالة',
  'developer.ui.webhooks.deliveryStatus.pending': 'في انتظار',
  'developer.ui.webhooks.deliveryStatus.succeeded': 'تم التسليم',
  'developer.ui.webhooks.deliveryStatus.failed': 'فشل، سيتم إعادة المحاولة',
  'developer.ui.webhooks.deliveryStatus.exhausted': 'فشل، لا مزيد من المحاولات',
  'developer.ui.webhooks.deliveryStatus.disabled': 'لم يتم الإرسال، تم تعطيل نقطة النهاية',
  'developer.ui.webhooks.deliveryNoResponse': 'لم يتم تلقي أي رد',
  'developer.ui.webhooks.deliveryNextAttempt': 'المحاولة التالية {relativeTime}',
  'developer.ui.webhooks.inspect': 'فحص التسليم',
  'developer.ui.webhooks.inspectTitle': 'التوصيل {id}',
  'developer.ui.webhooks.inspectRequest': 'هيئة الطلب',
  'developer.ui.webhooks.inspectResponse': 'هيئة الاستجابة',
  'developer.ui.webhooks.redeliver': 'إرسال هذا التسليم مرة أخرى',
  'developer.ui.webhooks.redeliverHelp':
    'يتم إرسال معرف الحدث نفسه مرة أخرى مع مجموعة إشارة إعادة التسليم، لذلك يتجاهله جهاز الاستقبال غير القادر بأمان.',
  'developer.ui.webhooks.redelivered': 'في قائمة الانتظار لإعادة التسليم.',
  'developer.ui.webhooks.failureTitle': 'نقطة النهاية هذه فاشلة',
  'developer.ui.webhooks.failureBody':
    '{count, plural, one {# فشل التسليم على التوالي} zero {فشلت # عمليات تسليم متتالية} two {فشلت # عمليات تسليم متتالية} few {فشلت # عمليات تسليم متتالية} many {فشلت # عمليات تسليم متتالية} other {فشلت # عمليات تسليم متتالية}}. بعد فشل {limit} المتتالي، يتم تعطيل نقطة النهاية ويتم تقديم عنصر الإجراء.',
  'developer.ui.webhooks.disabledTitle': 'تم تعطيل نقطة النهاية هذه بعد الفشل المتكرر',
  'developer.ui.webhooks.disabledBody':
    'لقد توقفنا عن الإرسال إليها حتى لا تمتلئ قائمة الانتظار الخاصة بك. قم بإصلاح جهاز الاستقبال، وأرسل تسليم اختبار، ثم قم بتمكينه مرة أخرى.',
  'developer.ui.webhooks.lastSuccessLabel': 'النجاح الأخير',
  'developer.ui.webhooks.lastSuccessNever': 'لم ينجح أي تسليم من أي وقت مضى',
  'developer.ui.webhooks.deleteTitle': 'حذف نقطة النهاية هذه',
  'developer.ui.webhooks.deleteConsequence.stop': 'ولا يتم إرسال أي شيء آخر إلى عنوان URL هذا.',
  'developer.ui.webhooks.deleteConsequence.logs':
    'يتم الاحتفاظ بسجلات التسليم لفترة الاحتفاظ بالتدقيق.',

  /* ----------------------------------------------------------------- billing */

  'billing.ui.description':
    'خطة واحدة، فترتين. Polar هو التاجر المسجل: فهو يحتفظ بطريقة الدفع، ويصدر الفواتير ويتعامل مع الإلغاء.',
  'billing.ui.statusHeading': 'الوضع الحالي',
  'billing.ui.planHeading': 'خطة',
  'billing.ui.intervalHeading': 'الفاصل الزمني للفوترة',
  'billing.ui.usageHeading': 'استخدام مزود القياس',
  'billing.ui.invoicesHeading': 'الفواتير',
  'billing.ui.cancelHeading': 'الإلغاء',
  'billing.ui.trialDaysRemaining':
    'محاكمة، {count, plural, =0 {ينتهي اليوم} one {متبقي # يوم} zero {متبقي # يوم} two {متبقي # يوم} few {متبقي # يوم} many {متبقي # يوم} other {متبقي # يوم}}',
  'billing.ui.convertsOn': 'يتحول على {date} إلى {amount} لكل {interval}.',
  'billing.ui.dueToday': '0 دولار مستحقة اليوم',
  'billing.ui.conversionLabel': 'المتحولين',
  'billing.ui.channelsLabel': 'القنوات النشطة',
  'billing.ui.paymentMethodPolar': 'طريقة الدفع التي تحتفظ بها Polar',
  'billing.ui.paymentMethodDescriptor': '{project} تنتهي بـ {last4}، تنتهي بـ {expiry}',
  'billing.ui.paymentMethodMissing': 'لا توجد طريقة دفع مسجلة حتى الآن',
  'billing.ui.cancelBeforeDate': 'قم بالإلغاء قبل {date} ولن يتم تحصيل رسوم منك.',
  'billing.ui.annualFraming':
    '25 دولارًا شهريًا يتم إصدار فاتورة بها سنويًا. وفر 48 دولارًا سنويًا.',
  'billing.ui.monthlyOption': '29 دولارًا شهريًا',
  'billing.ui.annualOption': '300 دولار سنويا',
  'billing.ui.intervalChangeHelp':
    'يصبح تغيير الفاصل الزمني ساري المفعول عند التجديد التالي. يقسمها Polar بالتناسب ويظهر المبلغ المحدد قبل التأكيد.',
  'billing.ui.intervalChangedAnnouncement': 'تم ضبط الفاصل الزمني للفوترة على {interval}.',
  'billing.ui.allowanceChannels':
    '30 قناة اجتماعية نشطة. القناة هي حساب أو صفحة أو قناة واحدة متصلة.',
  'billing.ui.allowanceChannelsUsage': '{used} من {limit} القنوات النشطة',
  'billing.ui.allowanceFairUse':
    'الاستخدام العادل يعني مكافحة البريد العشوائي ومراقبة الأسعار وتكاليف المزود. وهي تنطبق بنفس الطريقة على كل مشترك ويتم نشرها، وليس تقديريًا.',
  'billing.ui.allowanceMetered':
    'X وبعض مقدمي الخدمة الآخرين يتقاضون رسومًا مقابل كل عملية. يتم تمرير هذه الرسوم بالتكلفة ولا تشكل جزءًا من سعر الخطة.',
  'billing.ui.allowanceNoMedia':
    'لا يتم تضمين إنشاء الصور وإنشاء الفيديو ولا يتم بيعهما. Relay لا يقوم بإنشاء الوسائط.',
  'billing.ui.readFairUse': 'اقرأ سياسة الاستخدام العادل',
  'billing.ui.readMeteredPolicy': 'اقرأ كيفية احتساب تكلفة الاستخدام المقنن',
  'billing.ui.usageCaption': 'يتم قياس استخدام الموفر خلال هذه الفترة، ويتم إصدار فاتورة بالتكلفة',
  'billing.ui.usageColumn.item': 'البند',
  'billing.ui.usageColumn.quantity': 'الكمية',
  'billing.ui.usageColumn.unitPrice': 'سعر الوحدة',
  'billing.ui.usageColumn.amount': 'المبلغ',
  'billing.ui.usageTotal': 'مجموع هذه الفترة',
  'billing.ui.usagePeriod': 'الفترة {start} إلى {end}',
  'billing.ui.usageSource': 'الأسعار المنشورة من قبل المزود. تم التحقق منه {date}.',
  'billing.ui.usageReconciled': 'تمت التسوية مع فاتورة المزود بتاريخ {date}.',
  'billing.ui.usagePending': 'لم تتصالح بعد. المبلغ النهائي يمكن أن يتحرك قليلا.',
  'billing.ui.usageUnavailableReason':
    'لم يقم الموفر بإرجاع الاستخدام لهذه الفترة بعد. وهي متاحة عادة في غضون 24 ساعة.',
  'billing.ui.usageEmpty': 'لا يوجد استخدام مقنن هذه الفترة.',
  'billing.ui.spendAlert': 'تنبيه الإنفاق',
  'billing.ui.spendAlertHelp':
    'نرسل إليك بريدًا إلكترونيًا عندما يتجاوز الاستخدام المقنن هذا المبلغ في فترة الفاتورة.',
  'billing.ui.spendAlertPause': 'قم أيضًا بإيقاف الإجراءات المقاسة مؤقتًا عند الوصول إلى التنبيه',
  'billing.ui.balanceLabel': 'رصيد الاستخدام',
  'billing.ui.balanceHelp':
    'يتم سحب الاستخدام المقنن من هذا الرصيد ويتم إصدار فاتورة به بواسطة Polar.',
  'billing.ui.invoicesCaption': 'الفواتير الصادرة عن القطبية',
  'billing.ui.invoiceColumn.date': 'التاريخ',
  'billing.ui.invoiceColumn.description': 'الوصف',
  'billing.ui.invoiceColumn.amount': 'المبلغ',
  'billing.ui.invoiceColumn.state': 'الدولة',
  'billing.ui.invoiceState.paid': 'مدفوعة',
  'billing.ui.invoiceState.open': 'مفتوح',
  'billing.ui.invoiceState.uncollectible': 'لم يتم جمعها',
  'billing.ui.invoiceState.refunded': 'ردها',
  'billing.ui.invoicesEmpty':
    'لا يوجد فاتورة بعد. يتم إصدار الإصدار الأول عند تحويل النسخة التجريبية.',
  'billing.ui.invoicesInPortal': 'كل فاتورة وإيصال متاح في البوابة القطبية.',
  'billing.ui.portalHelp':
    'البوابة هي المكان الذي يمكنك من خلاله تغيير طريقة الدفع وتنزيل الفواتير والإلغاء. يتم فتحه في علامة تبويب جديدة.',
  'billing.ui.pastDueHeading': 'تأخر السداد',
  'billing.ui.pastDueBody':
    'لم تتم الدفعة الأخيرة. قم بتحديث طريقة الدفع في البوابة القطبية لمواصلة النشر.',
  'billing.ui.gracePolicy':
    'تستمر المشاركات المجدولة في العمل حتى {date}. بعد ذلك تصبح مساحة العمل للقراءة فقط: لا يتم حذف أي شيء ولا يتم نشر أي شيء.',
  'billing.ui.cancelBody':
    'الإلغاء هو إجراء واحد ويصبح ساري المفعول في نهاية الفترة التي دفعت ثمنها. لا توجد مكالمة لإجراءها ولا يوجد نموذج لملءه.',
  'billing.ui.cancelStart': 'إلغاء الاشتراك',
  'billing.ui.cancelDialogTitle': 'إلغاء هذا الاشتراك',
  'billing.ui.cancelConsequence.noCharge': 'لن يتم محاسبتك. لا يتم أخذ أي شيء اليوم أو في {date}.',
  'billing.ui.cancelConsequence.accessUntil': 'يمكنك الاحتفاظ بكل ميزة حتى {date}.',
  'billing.ui.cancelConsequence.dataKept':
    'تظل المسودات والإيصالات والوسائط والتحليلات في مساحة العمل هذه.',
  'billing.ui.cancelConsequence.scheduled':
    'لن يتم نشر المشاركات المجدولة بعد {date}. قم بإلغائها أو إعادة جدولتها قبل ذلك الوقت.',
  'billing.ui.cancelConsequence.restart': 'يمكنك بدء الاشتراك مرة أخرى في أي وقت.',
  'billing.ui.cancelConfirm': 'إلغاء الاشتراك',
  'billing.ui.cancelKeep': 'استمر في الاشتراك',
  'billing.ui.cancelConfirmedBeforeConversion': 'تم الإلغاء. لن يتم محاسبتك.',
  'billing.ui.cancelConfirmedAfterConversion': 'تم الإلغاء. يستمر الوصول حتى {date}.',
  'billing.ui.cancelAnnouncement': 'تم إلغاء الاشتراك.',
  'billing.ui.canceledNotice': 'تم إلغاء هذا الاشتراك.',
  'billing.ui.resume': 'ابدأ الاشتراك مرة أخرى',
  'billing.ui.noSubscriptionTitle': 'لا يوجد اشتراك في مساحة العمل هذه',
  'billing.ui.noSubscriptionBody':
    'ابدأ النسخة التجريبية التي تستغرق سبعة أيام للنشر. تجمع Polar طريقة الدفع ولا تفرض أي رسوم اليوم.',
  'billing.ui.noSubscriptionExample':
    'الشهري 29 دولارًا. تبلغ التكلفة السنوية 300 دولارًا أمريكيًا، أي 25 دولارًا شهريًا يتم إصدار فاتورة بها سنويًا. وفر 48 دولارًا سنويًا.',
  'billing.ui.overChannelLimitAction': 'مراجعة القنوات المتصلة',

  /* ---------------------------------------------------------- growth advisor */

  'growth.ui.entryHelp':
    'أجب على مقدمة قصيرة، وأكد ما فهمناه، واحصل على خطة يمكنك قبولها بندًا بندًا. ويقترح العمل. لا يقوم أبدًا بجدولة أو نشر أي شيء بمفرده.',
  'growth.ui.step.intake': 'تناول',
  'growth.ui.step.confirm': 'تأكيد',
  'growth.ui.step.plan': 'خطة',
  'growth.ui.stepIndicator': 'الخطوة {current} من {total}: {name}',
  'growth.ui.intake.section.product': 'المنتج',
  'growth.ui.intake.section.audience': 'الجمهور والأسواق',
  'growth.ui.intake.section.objective': 'الهدف',
  'growth.ui.intake.section.capacity': 'القنوات والقدرات',
  'growth.ui.intake.section.limits': 'ما هو خارج الحدود',
  'growth.ui.intake.help':
    'لا يوجد شيء هنا محسوس بالنسبة لك. يتم وضع علامة على أي شيء تتركه فارغًا على أنه مفقود بدلاً من أن يكون مملوءًا.',
  'growth.ui.intake.productNameHelp': 'الاسم الذي تستخدمه مع العملاء.',
  'growth.ui.intake.siteUrlHelp':
    'نقرأ الصفحة التي تقدمها لنا كمواد مصدرية. أنت تؤكد كل حقيقة نأخذها منه.',
  'growth.ui.intake.descriptionHelp': 'ما الذي تبيعه ومن أجله، بكلماتك الخاصة.',
  'growth.ui.intake.marketsHelp': 'البلدان أو المناطق. واحد لكل سطر.',
  'growth.ui.intake.localesHelp': 'اللغات التي ستنشر بها.',
  'growth.ui.intake.objectiveHelp': 'ما تريد أكثر منه في الربع القادم.',
  'growth.ui.intake.conversionHelp': 'الإجراء الذي يمكنك قياسه بالفعل. الاشتراك، التجريبي، الشراء.',
  'growth.ui.intake.proofHelp':
    'دراسات الحالة، والمعايير التي أجريتها، ولقطات الشاشة التي تمتلكها، والأذونات التي تمتلكها بالفعل. واحد لكل سطر.',
  'growth.ui.intake.proofNone': 'ليس لدي أي دليل معتمد حتى الآن',
  'growth.ui.intake.proofNoneEffect': 'ستتجنب الخطة نتائج العملاء ومطالبات النتائج تمامًا.',
  'growth.ui.intake.channelsHelp': 'الحسابات التي تنشر منها بالفعل.',
  'growth.ui.intake.capacityHelp': 'كن صادقا. الخطة التي لا يمكنك تنفيذها ليست خطة.',
  'growth.ui.intake.competitorsHelp': 'اختياري. واحد لكل سطر.',
  'growth.ui.intake.prohibitedClaimsHelp':
    'المطالبات التي لا يجوز لك تقديمها، لأسباب قانونية أو تتعلق بالسياسة. واحد لكل سطر.',
  'growth.ui.intake.prohibitedTopicsHelp': 'مواضيع يجب الابتعاد عنها. واحد لكل سطر.',
  'growth.ui.intake.submit': 'مراجعة ما فهمناه',
  'growth.ui.intake.savedAnnouncement': 'تم حفظ الملف الشخصي للنشاط التجاري.',
  'growth.ui.intake.requiredMissing': 'املأ الحقول التي تم تحديدها بأنها مطلوبة قبل المتابعة.',

  'growth.ui.confirm.factsTitle': 'حقائق أكدتها',
  'growth.ui.confirm.factsHelp': 'هذه يمكن استخدامها في نسخة.',
  'growth.ui.confirm.assumptionsTitle': 'الافتراضات التي قمنا بها',
  'growth.ui.confirm.assumptionsHelp':
    'هذه ليست حقائق. إنهم يشكلون الخطة لكنهم لا يصبحون أبدًا مطالبة في أي مشاركة.',
  'growth.ui.confirm.missingTitle': 'مفقود',
  'growth.ui.confirm.missingHelp':
    'تعمل الخطة حول كل من هذه العناصر وتوضح ذلك حيثما كان ذلك مهمًا.',
  'growth.ui.confirm.confidence.label': 'الثقة: {level}',
  'growth.ui.confirm.confidence.low': 'منخفض',
  'growth.ui.confirm.confidence.medium': 'متوسطة',
  'growth.ui.confirm.confidence.high': 'عالية',
  'growth.ui.confirm.promote': 'تأكيد كحقيقة',
  'growth.ui.confirm.correct': 'تصحيح هذا',
  'growth.ui.confirm.correctLabel': 'التصحيح الخاص بك',
  'growth.ui.confirm.generate': 'إنشاء الخطة',
  'growth.ui.confirm.announcement': 'تم تأكيد الملف الشخصي للنشاط التجاري.',

  'growth.ui.plan.generatingBody':
    'يستغرق هذا بضع ثوان. يمكنك مغادرة هذه الصفحة: تنتهي الخطة من تلقاء نفسها.',
  'growth.ui.plan.stateDraft': 'مسودة، لم تتم الموافقة عليها',
  'growth.ui.plan.stateApproved': 'تمت الموافقة عليه',
  'growth.ui.plan.stateSuperseded': 'تم استبداله بإصدار أحدث',
  'growth.ui.plan.newVersionNotice':
    'يؤدي التحديث إلى إنشاء الإصدار {version} ويترك الإصدار المعتمد دون تغيير.',
  'growth.ui.plan.emptyTitle': 'لا توجد خطة بعد',
  'growth.ui.plan.emptyBody':
    'املأ الملف التعريفي للأعمال وسنقوم ببناء خطة بناءً على الحقائق التي تؤكدها.',
  'growth.ui.plan.emptyExample':
    'تحتوي الخطة على إستراتيجية وأربعة أسابيع من الملخصات وحملة واحدة من المحتوى الذي ينشئه المستخدمون وفرص مدعومة بالكتالوج وما يصل إلى خمس أدوات.',
  'growth.ui.plan.tabsLabel': 'أقسام الخطة',
  'growth.ui.plan.modelNote': 'تم إنشاؤها بواسطة {model}، موجه {promptVersion}، على {date}.',

  'growth.ui.strategy.snapshotTitle': 'لقطة الأعمال',
  'growth.ui.strategy.channelPriority': 'الأولوية {rank}',
  'growth.ui.strategy.channelFormats': 'التنسيقات الأصلية',
  'growth.ui.strategy.pillarProof': 'والدليل على ذلك أن هذا الركن يرتكز عليه',
  'growth.ui.strategy.pillarProofNone': 'لا يوجد دليل معتمد. حافظ على هذه الركيزة وصفية.',
  'growth.ui.strategy.cadenceCaption': 'المشاركات في الأسبوع حسب القناة',
  'growth.ui.strategy.cadenceColumn.channel': 'قناة',
  'growth.ui.strategy.cadenceColumn.perWeek': 'المشاركات في الأسبوع',
  'growth.ui.strategy.cadenceTotal': 'المجموع في الأسبوع',
  'growth.ui.strategy.capacityWarning':
    'هذا الإيقاع هو {planned} منشورًا أسبوعيًا مقابل سعة محددة تبلغ {capacity} ساعة. تقليله أو رفع القدرة في الملف الشخصي.',
  'growth.ui.strategy.measurementBody':
    'بالمقارنة مع منشوراتك اللاحقة على نفس القناة والتنسيق. لا يتم استخدام أي معيار خارجي، لأنه لا شيء يمكن مقارنته بحسابك.',
  'growth.ui.strategy.localeAdaptations': 'ملاحظات اللغة',

  'growth.ui.fourWeek.caption': 'ملخصات مقترحة حسب الأسبوع واليوم',
  'growth.ui.fourWeek.column.date': 'التاريخ',
  'growth.ui.fourWeek.column.channel': 'قناة',
  'growth.ui.fourWeek.column.pillar': 'عمود',
  'growth.ui.fourWeek.column.format': 'التنسيق',
  'growth.ui.fourWeek.column.brief': 'موجز',
  'growth.ui.fourWeek.column.cta': 'دعوة للعمل',
  'growth.ui.fourWeek.column.measurement': 'علامة القياس',
  'growth.ui.fourWeek.column.actions': 'الإجراءات',
  'growth.ui.fourWeek.approvalRequired': 'الموافقة مطلوبة قبل أن تتمكن من النشر',
  'growth.ui.fourWeek.approvalNotRequired': 'لا توجد موافقة مطلوبة لهذا الحساب',
  'growth.ui.fourWeek.noCta': 'لا توجد دعوة للعمل',
  'growth.ui.fourWeek.weekEmpty': 'لا توجد ملخصات مقترحة لهذا الأسبوع.',
  'growth.ui.fourWeek.acceptedCount': '{accepted} من {total} تم قبول الملخصات كمسودات',
  'growth.ui.fourWeek.acceptAnnouncement': 'تم إنشاء المسودة من هذا الموجز.',
  'growth.ui.fourWeek.proposeAnnouncement': 'تمت إضافة اقتراح التقويم لـ {date}.',

  'growth.ui.ugc.promptAngle': 'زاوية {number}',
  'growth.ui.ugc.checklistTitle': 'الحقوق والموافقة والإفصاح',
  'growth.ui.ugc.checklistHelp':
    'اعمل على ذلك مع كل مشارك قبل نشر أي شيء. الموافقة على الظهور ليست موافقة على الإعلان.',
  'growth.ui.ugc.incentiveNone': 'لم يتم تقديم أي حافز',
  'growth.ui.ugc.incentiveDisclosure':
    'يجب الإفصاح عن الحافز على كل مشاركة تنتج عنه، من قبلك ومن قبل المشارك.',
  'growth.ui.ugc.honesty':
    'يخطط هذا لحملة تديرها مع أشخاص حقيقيين. Relay لا يعثر على منشئي المحتوى أو يتصل بهم أو يكتب شهادات أو ينشئ محتوى للعملاء.',

  'growth.ui.opportunities.caption':
    'الفرص التي تم التحقق منها من الكتالوج، مرتبة حسب ما يتناسب مع ملفك الشخصي',
  'growth.ui.opportunities.column.opportunity': 'فرصة',
  'growth.ui.opportunities.column.type': 'اكتب',
  'growth.ui.opportunities.column.audience': 'الجمهور',
  'growth.ui.opportunities.column.fit': 'لماذا يناسب هذا',
  'growth.ui.opportunities.column.requirements': 'المتطلبات',
  'growth.ui.opportunities.column.rules': 'قواعد الترويج الذاتي',
  'growth.ui.opportunities.column.cost': 'التكلفة',
  'growth.ui.opportunities.column.effort': 'جهد',
  'growth.ui.opportunities.column.verified': 'آخر التحقق',
  'growth.ui.opportunities.column.actions': 'الإجراءات',
  'growth.ui.opportunities.costFree': 'مجاني',
  'growth.ui.opportunities.effort.low': 'منخفض',
  'growth.ui.opportunities.effort.medium': 'متوسط',
  'growth.ui.opportunities.effort.high': 'عالية',
  'growth.ui.opportunities.noRequiredAsset': 'لا الأصول المطلوبة',
  'growth.ui.opportunities.prepareTitle': 'قم بإعداد التقديم لـ {name}',
  'growth.ui.opportunities.prepareRules': 'قواعدهم، نقلا عن',
  'growth.ui.opportunities.prepareChecklist': 'ما يجب أن يكون جاهزا',
  'growth.ui.opportunities.prepareManual':
    'يمكنك تقديم هذا بنفسك على موقعهم. Relay لا يملأ النماذج أو ينشئ حسابات أو يرسل بريدًا إلكترونيًا إلى أي شخص.',
  'growth.ui.opportunities.pitchTitle': 'مسودة الملعب',
  'growth.ui.opportunities.pitchHelp': 'قم بتحريره قبل إرساله. ويستخدم فقط الحقائق التي أكدتها.',
  'growth.ui.opportunities.submittedOn': 'تم الإرسال {date}',
  'growth.ui.opportunities.staleTitle': 'بعض الإدخالات تحتاج إلى إعادة التحقق',
  'growth.ui.opportunities.staleBody':
    '{count, plural, one {# الإدخال تجاوز تاريخ المراجعة} zero {لقد تجاوزت # إدخالات تاريخ مراجعتها} two {لقد تجاوزت # إدخالات تاريخ مراجعتها} few {لقد تجاوزت # إدخالات تاريخ مراجعتها} many {لقد تجاوزت # إدخالات تاريخ مراجعتها} other {لقد تجاوزت # إدخالات تاريخ مراجعتها}}. تحقق من القواعد الحالية في الموقع قبل الاعتماد عليها.',
  'growth.ui.opportunities.emptyExample':
    'يحتوي صف الكتالوج على عنوان URL الرسمي والجمهور وقواعد التقديم المقتبسة من الموقع والتكلفة والجهد وتاريخ آخر مرة قام فيها الشخص بالتحقق منها.',

  'growth.ui.tools.shown': '{shown} من {max} معروض',
  'growth.ui.tools.fewerThanMax':
    'فقط {count, plural, one {# أداة متطابقة} zero {# الأدوات متطابقة} two {# الأدوات متطابقة} few {# الأدوات متطابقة} many {# الأدوات متطابقة} other {# الأدوات متطابقة}} سير العمل هذا مع المراجعة الحالية. نفضل أن نعرض عددًا أقل من القائمة.',
  'growth.ui.tools.emptyTitle': 'لا توجد أداة تمت مراجعتها تناسب سير العمل هذا حتى الآن',
  'growth.ui.tools.emptyBody':
    'يحتاج كل إدخال إلى سعر محدد وشروط حقوق محددة وقيود محددة قبل ظهوره هنا.',
  'growth.ui.tools.emptyExample':
    'يوضح الإدخال ما هو الأفضل له، ولماذا يناسب خطتك، وما لا يمكنه فعله، والمهارات التي يحتاجها، وكيف يعود الإخراج إلى Relay، ومتى تم التحقق من السعر آخر مرة.',
  'growth.ui.tools.openSite': 'افتح الموقع الرسمي لـ {name}',
  'growth.ui.tools.stale': 'تجاوز تاريخ المراجعة. مستبعد من الخطط التي تم إنشاؤها.',

  'growth.ui.item.explainTitle': 'لماذا تم اقتراح هذا',
  'growth.ui.item.explainEvidence': 'على ماذا يرتكز',
  'growth.ui.item.explainNoEvidence':
    'لقد جاء ذلك من الهدف وقواعد القناة، وليس من حقيقة مؤكدة حول عملك.',
  'growth.ui.item.dismissTitle': 'رفض هذا الاقتراح',
  'growth.ui.item.dismissBody': 'أخبرنا لماذا. يتم تخزين السبب مع الخطة وأشكال الإصدار التالي.',
  'growth.ui.item.dismissReasonLabel': 'السبب',
  'growth.ui.item.dismissReason.notRelevant': 'لا علاقة لها بهذا العمل',
  'growth.ui.item.dismissReason.noCapacity': 'ليس لدينا القدرة',
  'growth.ui.item.dismissReason.wrongAudience': 'جمهور خاطئ',
  'growth.ui.item.dismissReason.alreadyDone': 'نحن نفعل هذا بالفعل',
  'growth.ui.item.dismissReason.policy': 'ضد سياستنا أو ادعاءاتنا',
  'growth.ui.item.dismissReason.other': 'شيء آخر',
  'growth.ui.item.dismissNote': 'أي شيء تريد إضافته',
  'growth.ui.item.dismissed': 'مرفوض. ويظل مرئيًا حتى تتمكن من التراجع عنه.',
  'growth.ui.item.undoDismiss': 'التراجع عن الرفض',

  'growth.ui.export.title': 'تصدير هذه الخطة',
  'growth.ui.export.formatLabel': 'التنسيق',
  'growth.ui.export.copy': 'نسخ إلى الحافظة',
  'growth.ui.export.download': 'تنزيل الملف',
  'growth.ui.export.copied': 'تم نسخ الخطة إلى الحافظة.',
  'growth.ui.export.schemaNote':
    'جميع التنسيقات الثلاثة تأتي من مخطط واحد تم التحقق منه، الإصدار {version}. تعتبر طرق العرض المنظمة آمنة للتحكم بالمصادر ولا تحتوي على أي أسرار.',
  'growth.ui.export.previewLabel': 'معاينة التصدير',
} as const;
