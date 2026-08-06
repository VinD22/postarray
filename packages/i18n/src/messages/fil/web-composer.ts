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
  'composerWeb.pane.targets': 'Mga target na account at Set',
  'composerWeb.pane.master': 'Master draft at nakabahaging mga setting',
  'composerWeb.pane.variant': 'Bersyon para sa bukas na target',
  'composerWeb.pane.review': 'Preview, validation, gastos at pag-apruba',
  'composerWeb.pane.showPreview': 'Ipakita ang preview',
  'composerWeb.pane.hidePreview': 'Itago ang preview',
  'composerWeb.pane.previewCollapsed':
    'Nakatago ang preview panel. Buksan ito upang suriin ang huling post.',

  'composerWeb.step.targets': 'Mga target',
  'composerWeb.step.write': 'Sumulat',
  'composerWeb.step.perTarget': 'Bawat target',
  'composerWeb.step.review': 'Balik-aral',
  'composerWeb.step.progress': 'Hakbang {current} ng {total}',
  'composerWeb.step.legend': 'Composer hakbang',

  'composerWeb.summary.label': 'Buod ng draft',
  'composerWeb.summary.targets':
    '{count, plural, =0 {Walang target} one {# target} other {# mga target}}',
  'composerWeb.summary.issues': '{count, plural, =0 {Walang isyu} one {# isyu} other {# mga isyu}}',
  'composerWeb.summary.notScheduled': 'Walang pinipiling oras',
  'composerWeb.summary.scheduledFor': '{time}',
  'composerWeb.summary.costUnknown': 'Hindi pa napresyuhan ang gastos',
  'composerWeb.summary.openReview': 'Buksan ang pagsusuri',

  // ---------------------------------------------------------------- rail
  'composerWeb.rail.masterEntry': 'Master draft',
  'composerWeb.rail.masterHint': 'I-edit dito para maabot ang bawat target na nagmamana pa rin.',
  'composerWeb.rail.accountsHeading': 'Mga target na account',
  'composerWeb.rail.setsHeading': 'Mga set at grupo',
  'composerWeb.rail.setsHelp':
    'Ang Set ay isang naka-save na grupo ng mga account at default. Ang paglalapat ng isa ay kinokopya ang mga halaga nito sa draft na ito. Ang mga pag-edit sa ibang pagkakataon sa Set ay hindi nagbabago sa draft na ito.',
  'composerWeb.rail.openTarget': 'Buksan ang bersyon para sa {account}',
  'composerWeb.rail.counter': '{used}/{limit}',
  'composerWeb.rail.counterUnknown': 'Hindi alam ang limitasyon',
  'composerWeb.rail.mediaCounter':
    '{count, plural, =0 {walang media} one {# file ng media} other {# mga file ng media}}',
  'composerWeb.rail.paused': 'Naka-pause. Hindi ito mai-publish hanggang sa ipagpatuloy mo ito.',
  'composerWeb.rail.state.notBuilt': 'Hindi pa nagagawa',
  'composerWeb.rail.state.unsupported': 'Hindi sinusuportahan ng provider',
  'composerWeb.rail.empty': 'Wala pang napiling mga account.',
  'composerWeb.rail.emptyHelp':
    'Piliin ang mga account na dapat maabot ng post na ito. Maaari kang magdagdag ng higit pa sa ibang pagkakataon.',
  'composerWeb.rail.divergenceHint':
    'Magbukas ng target para makita ang sarili nitong bersyon. Ang master draft ay hindi nagbabago.',
  'composerWeb.rail.searchLabel': 'I-filter ang mga account',
  'composerWeb.rail.removeTarget': 'Alisin {account}',

  // ---------------------------------------------------------- global edit
  'composerWeb.globalEdit.open': 'Pandaigdigang pag-edit',
  'composerWeb.globalEdit.title': 'Ilapat ang pagbabagong ito sa bawat napiling target',
  'composerWeb.globalEdit.description':
    'Palaging nagbabago ang master draft. Sinusundan ito ng mga target na nagmamana pa rin ng field na ito. Pinapanatili ito ng mga target na may sariling bersyon.',
  'composerWeb.globalEdit.fieldLabel': 'Patlang',
  'composerWeb.globalEdit.compatibleHeading': 'Ang mga target na ito ay kumukuha ng pagbabago',
  'composerWeb.globalEdit.keepsOverrideHeading':
    'Pinapanatili ng mga target na ito ang sarili nilang bersyon',
  'composerWeb.globalEdit.incompatibleHeading':
    'Hindi kayang tanggapin ng mga target na ito ang pagbabago',
  'composerWeb.globalEdit.incompatibleHelp':
    'Walang nahuhulog nang hindi sinasabi sa iyo. Ang bawat account sa ibaba ay nakakakuha ng tahasang bersyon na may pagbabagong inangkop, at maaari mo itong i-edit pagkatapos.',
  'composerWeb.globalEdit.reason.textTooLong':
    '{account} nagpapahintulot {limit} mga karakter. Ang tekstong ito ay {actual}.',
  'composerWeb.globalEdit.reason.linkNotAllowed':
    '{account} ay hindi tumatanggap ng link sa field na ito. Ang link ay nananatili sa master draft at sa mga target na nagbibigay-daan dito.',
  'composerWeb.globalEdit.reason.mediaCountExceeded':
    '{account} tinatanggap {limit, plural, one {# file} other {# mga file}}. Ang draft na ito ay may {actual}.',
  'composerWeb.globalEdit.reason.mediaKindUnsupported':
    '{account} hindi tumatanggap {mimeType} mga file.',
  'composerWeb.globalEdit.reason.threadUnsupported':
    '{account} ay hindi sumusuporta sa mga follow up na item, kaya ang sequence ay nananatili sa master draft.',
  'composerWeb.globalEdit.reason.markdownUnsupported':
    '{account} naglalathala ng payak na teksto. Ang mga marka ng pag-format ay lilitaw bilang mga character.',
  'composerWeb.globalEdit.adaptedPreview': 'ano {account} nakukuha sa halip',
  'composerWeb.globalEdit.confirm': 'Ilapat at gawin ang mga bersyon',
  'composerWeb.globalEdit.nothingToApply':
    'Walang nagbabago. Ang master draft ay mayroon nang ganitong halaga.',
  'composerWeb.globalEdit.announced':
    '{applied, plural, one {Inilapat ang pagbabago sa # target} other {Inilapat ang pagbabago sa # mga target}}. {adapted, plural, =0 {Walang target na kailangan ng inangkop na bersyon} one {# ang target ay nakakuha ng inangkop na bersyon} other {# ang mga target ay nakakuha ng mga inangkop na bersyon}}.',

  // ------------------------------------------------------------- override
  'composerWeb.override.heading': 'Ang target na ito ay may sariling bersyon',
  'composerWeb.override.fieldsChanged':
    '{count, plural, one {# Naiiba ang field sa master draft} other {# iba ang mga field sa master draft}}',
  'composerWeb.override.field.body': 'Mag-post ng text',
  'composerWeb.override.field.contentKind': 'Uri ng post',
  'composerWeb.override.field.locale': 'Wika ng nilalaman',
  'composerWeb.override.field.mediaIds': 'Media',
  'composerWeb.override.field.links': 'Mga link',
  'composerWeb.override.field.signature': 'Lagda',
  'composerWeb.override.field.threadItems': 'Mga komento at thread',
  'composerWeb.override.field.schedule': 'Iskedyul',
  'composerWeb.override.resetField': 'I-reset {field} sa master',
  'composerWeb.override.resetFieldTitle': 'I-reset {field} para sa {account}?',
  'composerWeb.override.resetFieldBody':
    'Ang bersyon ng {field} isinulat para sa {account} ay itinatapon at ang master draft ay ginamit muli. Walang ibang target na pagbabago.',
  'composerWeb.override.resetAll': 'I-reset ang bawat field sa master',
  'composerWeb.override.inheritNotice':
    'Ang target na ito ay sumusunod sa master draft. Ang pag-edit ng anuman dito ay lumilikha lamang ng isang bersyon {account} tumatanggap.',
  'composerWeb.override.created': '{account} ngayon ay may sariling {field}.',

  // --------------------------------------------------------------- limits
  'composerWeb.limits.heading': 'Mga limitasyon para sa {account}',
  'composerWeb.limits.text': 'Text hanggang sa {limit} mga karakter',
  'composerWeb.limits.linkCost':
    'Ang isang link ay binibilang bilang {count, plural, one {# karakter} other {# mga karakter}} anuman ang haba nito.',
  'composerWeb.limits.images':
    '{count, plural, =0 {Walang mga larawan} one {# larawan} other {hanggang sa # mga larawan}}',
  'composerWeb.limits.videos':
    '{count, plural, =0 {Walang video} one {# video} other {hanggang sa # mga video}}',
  'composerWeb.limits.duration': 'Video hanggang sa {duration}',
  'composerWeb.limits.aspect': 'Aspect ratio sa pagitan {min} at {max}',
  'composerWeb.limits.fileSize': 'Mga file hanggang sa {size}',
  'composerWeb.limits.mimeTypes': 'Mga tinatanggap na uri ng file: {types}',
  'composerWeb.limits.source': 'Mula sa snapshot ng kakayahan {version}, basahin {relativeTime}.',
  'composerWeb.limits.thumbnailRequired': 'Kailangan ng thumbnail.',

  // --------------------------------------------------------- native fields
  'composerWeb.native.heading': '{provider} mga setting',
  'composerWeb.native.privacy': 'Who can see this',
  'composerWeb.native.privacyChoose': 'Pumili ng madla',
  'composerWeb.native.privacyExplicit':
    '{provider} hindi pinapayagan ang isang paunang napiling madla. Pumili ng isa bago ito maiiskedyul.',
  'composerWeb.native.community': 'Komunidad',
  'composerWeb.native.board': 'Lupon',
  'composerWeb.native.group': 'Grupo o Pahina',
  'composerWeb.native.organization': 'Organisasyon',
  'composerWeb.native.channel': 'Channel',
  'composerWeb.native.publication': 'Lathalain',
  'composerWeb.native.disclosureHeading': 'Pagbubunyag',
  'composerWeb.native.disclosureCommercial':
    'Ang post na ito ay nagpo-promote ng isang produkto o serbisyo',
  'composerWeb.native.disclosureBranded':
    'Ang post na ito ay may tatak na nilalaman para sa ibang kumpanya',
  'composerWeb.native.disclosureAi': 'Ang ilan sa nilalamang ito ay ginawa gamit ang isang AI tool',
  'composerWeb.native.disclosureUnsupported':
    '{provider} ay hindi nag-aalok ng pagsisiwalat na ito sa pamamagitan ng API nito. Sa halip, idagdag ito sa teksto.',
  'composerWeb.native.none': 'Hindi {provider} naaangkop ang mga setting sa ganitong uri ng post.',

  // ---------------------------------------------------- entity resolution
  'composerWeb.entity.resolvedHeading': 'Nalutas sa {provider}',
  'composerWeb.entity.resolvedId': 'Account ID {externalId}',
  'composerWeb.entity.plainTextWarning':
    'Hindi tugma. Ipa-publish ito bilang plain text, na hindi naka-on ang native na tag {provider}.',
  'composerWeb.entity.removeMention': 'Alisin ang pagbanggit ng {label}',
  'composerWeb.entity.addMention': 'Magdagdag ng pagbanggit',
  'composerWeb.entity.mentionCount':
    '{count, plural, =0 {Walang pagbanggit} one {# banggitin} other {# pagbanggit}}, {resolved} itinugma sa isang tunay na account',
  'composerWeb.entity.lookupUnsupported':
    '{provider} ay hindi nag-aalok ng paghahanap ng entity para sa uri ng account na ito.',
  'composerWeb.entity.lookupNotBuilt':
    'Relay ay hindi nakagawa ng entity lookup para sa {provider} pa. Walang nahuhulaan sa ngayon.',
  'composerWeb.entity.searchHint':
    'Mag-type ng hindi bababa sa dalawang character, pagkatapos ay pumili ng resulta.',
  'composerWeb.entity.resultCount':
    '{count, plural, =0 {Walang tugma} one {# tugma} other {# mga posporo}}',

  // ---------------------------------------------------------------- links
  'composerWeb.links.heading': 'Mga link',
  'composerWeb.links.detected':
    '{count, plural, one {# link na matatagpuan sa draft na ito} other {# mga link na matatagpuan sa draft na ito}}',
  'composerWeb.links.noneDetected': 'Wala pang mga link sa draft na ito.',
  'composerWeb.links.modeLabel': 'Paano nag-publish ang link na ito',
  'composerWeb.links.original': 'Orihinal na URL',
  'composerWeb.links.utmSource': 'Pinagmulan',
  'composerWeb.links.utmMedium': 'Katamtaman',
  'composerWeb.links.utmCampaign': 'Kampanya',
  'composerWeb.links.utmTerm': 'Termino',
  'composerWeb.links.utmContent': 'Nilalaman',
  'composerWeb.links.domainVerified': '{domain}, na-verify para sa workspace na ito',
  'composerWeb.links.domainDefault': 'Relay default na domain',
  'composerWeb.links.domainNone': 'Wala pang branded na domain ang na-verify.',
  'composerWeb.links.notAllowedHere': '{account} hindi pinapayagan ang isang link dito.',

  // ------------------------------------------------------------- sequence
  'composerWeb.sequence.kindComment': 'Magkomento',
  'composerWeb.sequence.kindThread': 'Bahagi ng thread',
  'composerWeb.sequence.kindLabel': 'Uri ng item',
  'composerWeb.sequence.moveUp': 'Ilipat ang item na ito nang mas maaga',
  'composerWeb.sequence.moveDown': 'Ilipat ang item na ito mamaya',
  'composerWeb.sequence.remove': 'Alisin ang item na ito',
  'composerWeb.sequence.absoluteTime': 'Tumatakbo sa {time}, which is {utc} UTC.',
  'composerWeb.sequence.partialFailure':
    'Kung nabigo ang isang item, mananatiling naka-publish ang post na nai-publish na at hindi tatakbo ang mga item pagkatapos nito. Makakakuha ka ng item ng pagkilos.',
  'composerWeb.sequence.maxReached':
    '{account} tinatanggap {limit, plural, one {# follow up item} other {# follow up item}}.',
  'composerWeb.sequence.minDelay':
    'Ang pinakamaikling pagkaantala {provider} pinapayagan dito ay {duration}.',
  'composerWeb.sequence.inheritAuthor': 'Parehong account sa post',
  'composerWeb.sequence.itemIssues':
    '{count, plural, =0 {Walang isyu} one {# isyu} other {# mga isyu}} sa item na ito',
  'composerWeb.sequence.customMinutes': 'Mga minuto pagkatapos ng nakaraang item',

  // --------------------------------------------------------------- repeat
  'composerWeb.repeat.enable': 'Ulitin ang post na ito',
  'composerWeb.repeat.cadenceLabel': 'Gaano kadalas',
  'composerWeb.repeat.maximum':
    'Ang isang paulit-ulit na post ay maaaring tumakbo nang higit pa {limit} beses.',
  'composerWeb.repeat.occurrenceLabel': 'Bilang ng mga post',
  'composerWeb.repeat.duplicateCheck':
    'Ang bawat pangyayari ay sinusuri para sa duplicate na nilalaman bago ito mag-publish. Ang isang pangyayari na nabigo sa pagsusuri ay nagiging isang item ng pagkilos sa halip na i-publish.',
  'composerWeb.repeat.occurrenceList': 'Mga unang pangyayari',
  'composerWeb.repeat.occurrenceMore':
    '{count, plural, one {at # mas maraming pangyayari} other {at # mas maraming pangyayari}}',

  // ------------------------------------------------------ sets, signature
  'composerWeb.set.heading': 'Mga set at lagda',
  'composerWeb.set.pickerTitle': 'Magsimula sa isang Set',
  'composerWeb.set.pickerDescription':
    'Ang isang Set ay pumupuno sa mga target, teksto at mga setting. Ang draft na ginawa nito ay independyente, kaya ang pag-edit sa Set sa ibang pagkakataon ay hindi kailanman nagbabago ng isang naaprubahan o nakaiskedyul na post.',
  'composerWeb.set.accountCount': '{count, plural, one {# account} other {# mga account}}',
  'composerWeb.set.apply': 'Gamitin ang Set na ito',
  'composerWeb.set.none': 'Wala pang na-save na Set.',
  'composerWeb.signature.pickerLabel': 'Lagda',
  'composerWeb.signature.scope': 'Para sa {brand} sa {provider} sa {language}',
  'composerWeb.signature.previewHeading': 'Paano ito nagtatapos sa post',
  'composerWeb.signature.notMatching':
    'Ang lagda na ito ay saklaw sa ibang brand, platform o wika, kaya hindi ito inaalok dito.',

  // --------------------------------------------------------------- assist
  'composerWeb.assist.menuLabel': 'Tumulong sa tekstong ito',
  'composerWeb.assist.unavailableTitle': 'Hindi naka-configure ang tulong sa text',
  'composerWeb.assist.unavailableBody':
    'Walang AI gateway na naka-set up para sa workspace na ito, kaya naka-off ang mga tulong na aksyon. Lahat ng iba pa sa kompositor ay gumagana nang normal.',
  'composerWeb.assist.targetLabel': 'Nalalapat sa',
  'composerWeb.assist.targetMaster': 'Ang master draft',
  'composerWeb.assist.targetVariant': 'Ang bersyon para sa {account}',
  'composerWeb.assist.beforeLabel': 'Kasalukuyang text',
  'composerWeb.assist.afterLabel': 'Iminungkahing teksto',
  'composerWeb.assist.regionLabel': 'Iminungkahing pagbabago ng text, hindi pa nalalapat',
  'composerWeb.assist.added': 'idinagdag',
  'composerWeb.assist.removed': 'tinanggal',
  'composerWeb.assist.evidence': 'Katibayan at mga mapagkukunan',
  'composerWeb.assist.claimChecked': '{claim}',
  'composerWeb.assist.claimUnverified':
    'Walang nakitang source para sa claim na ito. Suriin ito bago i-publish.',
  'composerWeb.assist.failed':
    'Hindi nakumpleto ang kahilingan sa tulong. Ang iyong text ay hindi nagbabago.',
  'composerWeb.assist.noMediaGeneration':
    'Ang Relay ay hindi gumagawa ng mga larawan o video. Dalhin ang mga natapos na file sa library at i-publish ang mga ito dito.',

  // ------------------------------------------------------------- autosave
  'composerWeb.autosave.pinned':
    'Ito ang naaprubahang bersyon. Ang pag-edit nito ay lumilikha ng bagong bersyon at iki-clear ang pag-apruba.',
  'composerWeb.autosave.pinnedAcknowledge': 'I-edit at i-clear ang pag-apruba',
  'composerWeb.autosave.conflictTitle': 'Dalawang bersyon ng draft na ito',
  'composerWeb.autosave.conflictKeepMine': 'Panatilihin ang aking isinulat',
  'composerWeb.autosave.conflictKeepTheirs': 'Gamitin ang bersyon mula sa {name}',
  'composerWeb.autosave.conflictHelp':
    'Walang awtomatikong pinagsama. Pumili sa bawat field, pagkatapos ay i-save.',
  'composerWeb.autosave.retry': 'Subukang mag-ipon muli',

  // ------------------------------------------------------------ shortcuts
  'composerWeb.shortcuts.title': 'Composer na mga shortcut',
  'composerWeb.shortcuts.nextTarget': 'Susunod na target',
  'composerWeb.shortcuts.previousTarget': 'Nakaraang target',
  'composerWeb.shortcuts.nextIssue': 'Susunod na isyu',
  'composerWeb.shortcuts.previousIssue': 'Nakaraang isyu',
  'composerWeb.shortcuts.save': 'I-save ang draft ngayon',
  'composerWeb.shortcuts.openSchedule': 'Buksan ang sheet ng iskedyul',
  'composerWeb.shortcuts.open': 'Ipakita ang mga shortcut',

  // --------------------------------------------------------------- review
  'composerWeb.review.heading': 'Balik-aral',
  'composerWeb.review.contentVersion': 'Bersyon ng nilalaman {checksum}',
  'composerWeb.review.approvalPolicy': 'Patakaran: {policy}',
  'composerWeb.review.approverPending': 'Naghihintay ng desisyon mula sa {approver}.',
  'composerWeb.review.approverNone': 'Walang kinakailangang pag-apruba para sa mga target na ito.',
  'composerWeb.review.perTargetHeading': 'Ano ang natatanggap ng bawat account',
  'composerWeb.review.finalUrl': 'Na-publish na link',
  'composerWeb.review.privacyState': 'Madla: {value}',
  'composerWeb.review.disclosureState': 'Pagbubunyag: {value}',
  'composerWeb.review.disclosureNone': 'Walang hanay ng pagbubunyag',
  'composerWeb.review.mediaVersion': '{name}, bersyon {version}',
  'composerWeb.review.blocked':
    '{count, plural, one {# hindi pa maiiskedyul ang target} other {# hindi pa maiiskedyul ang mga target}}',
  'composerWeb.review.offlineBlocked':
    'Ang pag-iskedyul at pag-publish ay nangangailangan ng koneksyon. Ligtas ang iyong draft sa device na ito.',
  'composerWeb.review.publishConfirm':
    'Ito ay naglalathala sa {count, plural, one {# account} other {# mga account}}kaagad. Hindi na ito maaaring bawiin mula rito.',

  // ------------------------------------------------------- loud system (WP-8)
  'composerWeb.savedFlash': 'Saved',
  'composerWeb.validation.clear.v2': 'Nothing blocking.',
  'composerWeb.schedule.confirmed': 'Scheduled',

  // ------------------------------------------------------------ page-level
  'composerWeb.page.newDraft': 'Bagong draft',
  'composerWeb.page.loading':
    'Nilo-load ang draft, ang mga target nito at ang kanilang mga limitasyon',
  'composerWeb.page.errorTitle': 'Hindi mabuksan ang draft na ito',
  'composerWeb.page.errorBody':
    'Walang nawala. Subukang muli, at kung patuloy itong nabigo, ang sanggunian sa ibaba ay tumutulong sa suporta na mahanap ang kahilingan.',
  'composerWeb.page.noConnectionsTitle': 'Ikonekta ang isang account bago gumawa',
  'composerWeb.page.noConnectionsBody':
    'Ang isang draft ay nangangailangan ng hindi bababa sa isang konektadong account upang malaman ng Relay ang mga limitasyon, preview at mga setting na ipapakita.',
  'composerWeb.page.noConnectionsExample':
    'Halimbawa: kapag konektado ang X at LinkedIn, ang isang draft ay nagiging dalawang katutubong bersyon na may sariling mga counter.',
  'composerWeb.page.permissionTitle': 'Hindi ka makakagawa ng mga post sa workspace na ito',
  'composerWeb.page.permissionBody':
    'Ang pag-compose ay nangangailangan ng papel na editor o mas mataas. Maaaring baguhin ng may-ari o admin ang iyong tungkulin.',
  'composerWeb.page.rateLimitTitle': 'Masyadong maraming draft ang nagse-save sa maikling panahon',
  'composerWeb.page.rateLimitCause':
    'Naabot ng workspace na ito ang limitasyon sa pagsulat nito para sa kasalukuyang window. Ang iyong text ay pinananatili sa device na ito samantala.',
  'composerWeb.page.rateLimitAlternative':
    'Patuloy na magsulat. Awtomatikong magpapatuloy ang pag-save kapag nag-reset ang window.',

  // ==================================================== media library ====
  'mediaLib.view.grid': 'Grid',
  'mediaLib.view.list': 'Listahan',
  'mediaLib.view.label': 'Layout',
  'mediaLib.sort.label': 'Pagbukud-bukurin',
  'mediaLib.sort.newest': 'Pinakabago muna',
  'mediaLib.sort.name': 'Pangalan',
  'mediaLib.sort.size': 'Pinakamalaki muna',
  'mediaLib.select': 'Pumili {name}',
  'mediaLib.column.file': 'file',
  'mediaLib.column.type': 'Uri',
  'mediaLib.column.size': 'Sukat',
  'mediaLib.column.altText': 'Alt text',
  'mediaLib.column.rights': 'Mga karapatan',
  'mediaLib.column.added': 'Idinagdag',
  'mediaLib.openDetail': 'Bukas {name}',

  'mediaLib.empty.title': 'Wala pang media',
  'mediaLib.empty.body':
    'Mag-upload ng mga larawan at video na mayroon ka na, o mag-import ng file mula sa isang URL. Sinusuri ng Relay ang uri at laki laban sa bawat account kung saan ka mag-publish.',
  'mediaLib.empty.example':
    'Halimbawa: launch_hero.jpg, 1600 by 900, alt text set, ginamit sa 2 post.',
  'mediaLib.error.title': 'Hindi ma-load ang library',
  'mediaLib.error.body': 'Ligtas ang iyong mga file. Walang nabago sa kabiguan na ito.',
  'mediaLib.loading': 'Nilo-load ang iyong media library',
  'mediaLib.permission.title': 'Hindi mo makikita ang workspace library na ito',
  'mediaLib.permission.body':
    'Ang panonood ng media ay nangangailangan ng tungkulin ng manonood o mas mataas sa brand na ito. Maaaring ibigay ito ng may-ari o admin.',

  'mediaLib.upload.heading': 'Magdagdag ng media',
  'mediaLib.upload.browse': 'Pumili ng mga file',
  'mediaLib.upload.dropHint':
    'I-drag ang mga file dito, o piliin ang mga ito. Magpapatuloy ang pag-upload kung bumaba ang koneksyon.',
  'mediaLib.upload.queueHeading': 'Mga pag-upload',
  'mediaLib.upload.progress': '{name}, {percent} ng {size} ipinadala',
  'mediaLib.upload.paused': 'Naka-pause. {sent} ng {size} ay nakaimbak na.',
  'mediaLib.upload.resume': 'Ipagpatuloy ang pag-upload',
  'mediaLib.upload.pause': 'I-pause ang pag-upload',
  'mediaLib.upload.cancel': 'Kanselahin ang pag-upload na ito',
  'mediaLib.upload.retry': 'Subukang muli ang pag-upload na ito',
  'mediaLib.upload.finalizing': 'Pagtatapos {name}',
  'mediaLib.upload.done': '{name} ay nasa iyong library',
  'mediaLib.upload.failed': '{name} hindi natapos. {reason}',
  'mediaLib.upload.offline':
    'Offline. Ang mga pag-upload ay nagpapatuloy mula sa kung saan sila huminto kapag muli kang kumonekta.',
  'mediaLib.upload.rejectedType':
    '{name} ay {mimeType}, na hindi tinatanggap ng alinman sa iyong mga napiling account.',
  'mediaLib.upload.rejectedSize':
    '{name} ay {size}. Ang pinakamababang limitasyon sa iyong mga account ay {limit}.',
  'mediaLib.upload.acceptedBy':
    '{count, plural, one {Tinanggap ni # ng iyong mga account} other {Tinanggap ni # ng iyong mga account}}',
  'mediaLib.upload.rejectedBy': 'Hindi tinanggap ng {accounts}',
  'mediaLib.upload.checkedAgainst': 'Sinuri laban sa mga account na napili sa draft na ito.',
  'mediaLib.upload.noTargets':
    'Walang napiling mga account, kaya ang file ay sinusuri laban sa mga default ng workspace lamang.',

  'mediaLib.alt.heading': 'Alt text',
  'mediaLib.alt.help':
    'Ilarawan kung ano ang mahalaga sa larawan para sa isang taong hindi ito nakikita. Karaniwang sapat na ang isa o dalawang pangungusap.',
  'mediaLib.alt.count': '{used} ng {limit} mga karakter',
  'mediaLib.alt.requiredBy': 'Kinakailangan ng {accounts}',
  'mediaLib.alt.waive': 'Walang impormasyon ang larawang ito',
  'mediaLib.alt.waiveReason': 'Bakit hindi ito nangangailangan ng paglalarawan',
  'mediaLib.alt.waiveHelp':
    'Gamitin lamang ito para sa dekorasyon. Ang isang na-waive na larawan ay nagpa-publish na may walang laman na paglalarawan kung saan pinapayagan ito ng platform.',
  'mediaLib.alt.waived': 'Tinalikuran ni {name} sa {date}. Dahilan: {reason}',
  'mediaLib.alt.unsupported':
    '{provider} ay hindi tumatanggap ng alt text sa pamamagitan ng API nito para sa account na ito.',
  'mediaLib.alt.missingCount':
    '{count, plural, one {# walang alt text ang file} other {# walang alt text ang mga file}}',

  'mediaLib.rights.heading': 'Mga karapatan at pahintulot',
  'mediaLib.rights.declared': 'Idineklara ni {name} sa {date}',
  'mediaLib.rights.undeclared': 'Hindi pa idineklara. Ipahayag ito bago i-publish ang file na ito.',
  'mediaLib.rights.ownerLabel': 'Sino ang nagmamay-ari ng file na ito',
  'mediaLib.rights.ownerSelf': 'Ang workspace na ito',
  'mediaLib.rights.ownerLicensed': 'Lisensyado mula sa ibang tao',
  'mediaLib.rights.ownerUgc': 'Isang customer o creator ang nagbigay ng pahintulot',
  'mediaLib.rights.licenseLabel': 'Sanggunian ng lisensya o pahintulot',
  'mediaLib.rights.peopleLabel': 'Lumilitaw ang mga tao sa file na ito',
  'mediaLib.rights.peopleConsent': 'Lahat ng ipinakita ay sumang-ayon na mai-publish',
  'mediaLib.rights.musicLabel': 'Ang file na ito ay naglalaman ng musika o isang soundtrack',
  'mediaLib.rights.confirm':
    'Mayroon akong mga karapatan na i-publish ang file na ito, kasama ang sinumang tao, musika, mga logo at mga tatak sa loob nito.',
  'mediaLib.rights.blocking':
    "Hindi maiiskedyul ang file na ito hangga't hindi naideklara ang mga karapatan.",

  'mediaLib.editor.heading': 'I-edit ang larawan',
  'mediaLib.editor.description':
    'Ang bawat pag-edit ay nai-save bilang isang bagong bersyon. Ang orihinal na file ay pinananatili at maaaring ibalik.',
  'mediaLib.editor.tab.crop': 'I-crop',
  'mediaLib.editor.tab.transform': 'Baguhin ang laki at paikutin',
  'mediaLib.editor.tab.canvas': 'Canvas',
  'mediaLib.editor.tab.output': 'Format at laki',
  'mediaLib.editor.tab.thumbnail': 'Thumbnail',
  'mediaLib.editor.presetLabel': 'Aspect preset',
  'mediaLib.editor.presetFree': 'Libre',
  'mediaLib.editor.presetFor': '{ratio}, ginagamit ng {accounts}',
  'mediaLib.editor.cropX': 'I-crop mula sa simulang gilid',
  'mediaLib.editor.cropY': 'I-crop mula sa itaas',
  'mediaLib.editor.cropWidth': 'Lapad ng crop',
  'mediaLib.editor.cropHeight': 'Taas ng pananim',
  'mediaLib.editor.cropKeyboardHint':
    'Nakatakda ang crop box na may mga field ng numero, kaya ganap itong gumagana mula sa keyboard.',
  'mediaLib.editor.widthLabel': 'Lapad sa pixel',
  'mediaLib.editor.heightLabel': 'Taas sa mga pixel',
  'mediaLib.editor.lockRatio': 'Panatilihin ang kasalukuyang ratio',
  'mediaLib.editor.rotateLabel': 'Pag-ikot',
  'mediaLib.editor.rotateDegrees': '{degrees} digri',
  'mediaLib.editor.flipHorizontal': 'I-flip sa vertical axis',
  'mediaLib.editor.flipVertical': 'I-flip sa pahalang na axis',
  'mediaLib.editor.canvasColor': 'Kulay ng background',
  'mediaLib.editor.canvasFit': 'Paano nakalagay ang larawan sa canvas',
  'mediaLib.editor.canvasFitCover': 'Punan ang canvas at i-crop ang overflow',
  'mediaLib.editor.canvasFitContain': 'Pagkasyahin ang buong larawan at ilagay ang natitira',
  'mediaLib.editor.formatLabel': 'Output format',
  'mediaLib.editor.qualityLabel': 'Kalidad ng compression',
  'mediaLib.editor.qualityValue': '{value} ng 100',
  'mediaLib.editor.estimatedSize': 'Tinantyang output {size}, mula sa {original}',
  'mediaLib.editor.estimatedSizeUnknown':
    'Malalaman lang ang laki ng output kapag naproseso na ang file.',
  'mediaLib.editor.thumbnailHelp':
    'Piliin ang frame o file na ginamit bilang thumbnail ng video kung saan tumatanggap ang platform ng isa.',
  'mediaLib.editor.thumbnailFrame': 'Frame sa {time}',
  'mediaLib.editor.save': 'I-save bilang bagong bersyon',
  'mediaLib.editor.saving': 'Sine-save ang bersyon {version}',
  'mediaLib.editor.saved': 'Bersyon{version}nailigtas. Nandito pa rin ang orihinal.',
  'mediaLib.editor.discard': 'Itapon ang mga pag-edit na ito',
  'mediaLib.editor.noChanges': 'Wala pang mga pagbabagong ise-save.',
  'mediaLib.editor.revalidate':
    'Sinusuri ng pag-save ang file na ito laban sa bawat account sa mga draft na gumagamit nito.',
  'mediaLib.editor.noGeneration':
    'Binabago ng editor na ito ang file na iyong na-upload. Hindi ito lumilikha ng bagong imahe.',

  'mediaLib.versions.heading': 'Mga bersyon',
  'mediaLib.versions.original': 'Orihinal na pag-upload',
  'mediaLib.versions.current': 'Kasalukuyang bersyon',
  'mediaLib.versions.restore': 'Ibalik ang bersyon {version}',
  'mediaLib.versions.item': 'Bersyon {version}, {dimensions}, {size}, {date}',

  'mediaLib.provenance.heading': 'Saan nanggaling ang file na ito',
  'mediaLib.provenance.sourceUrl': 'URL ng pinagmulan',
  'mediaLib.provenance.fetchedAt': 'Nakuha {date}',
  'mediaLib.provenance.declaredAuthor': 'Nakasaad na may-akda',
  'mediaLib.provenance.declaredLicense': 'Nakasaad na lisensya',
  'mediaLib.provenance.contentCredentials': 'Mga kredensyal ng naka-embed na nilalaman',
  'mediaLib.provenance.contentCredentialsNone':
    'Ang file na ito ay walang mga naka-embed na kredensyal ng nilalaman. Iyon ay karaniwan at hindi nangangahulugang may mali.',
  'mediaLib.provenance.unverified':
    'Ang mga detalyeng ito ay nagmula sa pinagmulan, hindi mula sa Relay. Suriin ang mga ito bago ka umasa sa kanila.',

  'mediaLib.picker.title': 'Pumili ng media',
  'mediaLib.picker.description':
    'Sinusuri ang mga file laban sa mga account na napili sa draft na ito.',
  'mediaLib.picker.confirm':
    '{count, plural, =0 {Pumili ng mga file} one {Idagdag # file} other {Idagdag # mga file}}',
  'mediaLib.picker.forMaster': 'Pagdaragdag sa master draft',
  'mediaLib.picker.forVariant': 'Pagdaragdag sa bersyon para sa {account} lamang',
} as const;
