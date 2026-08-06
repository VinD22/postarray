/**
 * Web app copy for the calendar and queue, the publication receipt, and the
 * connections surfaces.
 *
 * The domain vocabulary for these areas already lives in `calendar.ts`,
 * `receipt.ts`, `connections.ts`, `states.ts`, `status.ts` and `actions.ts`.
 * This file only adds the strings the web screens need on top of that: view
 * switchers, table column headings, keyboard affordances, the reschedule
 * decision a published post forces, receipt section headings, the capability
 * matrix, and the pre-OAuth permission explainer.
 *
 * Keys are intent based. Values are ICU MessageFormat. No em dashes.
 */
export const webCalendarMessages = {
  /* ---------------------------------------------------------------------
   * Platform and account vocabulary
   *
   * Platform names are proper nouns and stay as they are in English, but they
   * live in the catalog anyway: a locale that uses a different script needs to
   * transliterate them, and a component must never hold a literal.
   * ------------------------------------------------------------------- */
  'web.provider.x': 'X',
  'web.provider.linkedin': 'LinkedIn',
  'web.provider.instagram': 'Instagram',
  'web.provider.facebook': 'Facebook',
  'web.provider.youtube': 'YouTube',
  'web.provider.tiktok': 'TikTok',
  'web.provider.threads': 'Threads',
  'web.provider.bluesky': 'Bluesky',
  'web.provider.mastodon': 'Mastodon',
  'web.provider.telegram': 'Telegram',
  'web.provider.reddit': 'Reddit',
  'web.provider.wordpress': 'WordPress',
  'web.provider.medium': 'Medium',
  'web.provider.devto': 'Dev.to',
  'web.provider.pinterest': 'Pinterest',
  'web.provider.discord': 'Discord',
  'web.provider.slack': 'Slack',
  'web.connection.requirement.mastodon':
    'Kumokonekta ang Mastodon gamit ang access token na ginawa mo sa iyong sariling instance, hindi ang iyong password.',
  'web.connection.requirement.telegram':
    'Nagpo-post ang Relay bilang bot. Idagdag ang bot sa channel o grupo kung saan mo gustong mag-post.',
  'web.connection.requirement.reddit':
    'Ang pagsulat sa Reddit ay nangangailangan ng aprubadong app, at bawat post ay nangangailangan ng titulo at subreddit.',
  'web.connection.requirement.wordpress':
    'Nagpapublish ang Relay sa pamamagitan ng REST API ng site gamit ang app password na ginawa mo sa WordPress.',
  'web.connection.requirement.medium':
    'Kumokonekta ang Medium sa pamamagitan ng OAuth at nagpapublish ang Relay ng pampublikong kwento sa Markdown.',
  'web.connection.requirement.devto':
    'Kumokonekta ang Dev.to gamit ang API key na ginawa sa iyong mga setting ng Dev.to.',
  'web.connection.requirement.pinterest':
    'Ang pagsulat sa Pinterest ay nangangailangan ng aprubadong access ng app, at ang pin ay nangangailangan ng larawan at sariling board.',
  'web.connection.requirement.discord':
    'Nagpo-post ang Relay bilang bot. Idagdag ang bot sa mga server at channel kung saan mo gustong mag-post.',
  'web.connection.requirement.slack':
    'Nagpo-post ang Relay bilang app. Idagdag ang app sa mga channel kung saan mo gustong mag-post.',
  'web.provider.fake': 'Subukan ang connector',

  'web.accountType.personal_profile': 'Personal na profile',
  'web.accountType.creator_profile': 'Account ng tagalikha',
  'web.accountType.business_profile': 'Account ng negosyo',
  'web.accountType.page': 'Pahina',
  'web.accountType.organization': 'Organisasyon',
  'web.accountType.channel': 'Channel',
  'web.accountType.group': 'Grupo',
  'web.accountType.board': 'Lupon',
  'web.accountType.community': 'Komunidad',
  'web.accountType.publication': 'Lathalain',

  /* ---------------------------------------------------------------------
   * Calendar and queue
   * ------------------------------------------------------------------- */
  'web.calendar.description':
    'Nakaiskedyul ang lahat, naghihintay ng pag-apruba, na-publish o na-block, sa isang lugar.',
  'web.calendar.view.agenda': 'Agenda',
  'web.calendar.view.table': 'mesa',
  'web.calendar.view.switchLabel': 'Piliin kung paano inilatag ang iskedyul',
  'web.calendar.range.day': '{date}',
  'web.calendar.range.week': '{start} sa {end}',
  'web.calendar.range.month': '{month}',
  'web.calendar.range.label': 'Nagpapakita {range} sa {timeZone}',
  'web.calendar.timeZone.workspace': 'Workspace time zone: {timeZone}',
  'web.calendar.timeZone.change': 'Baguhin ang mga setting ng workspace',
  'web.calendar.jumpToDate': 'Tumalon sa isang petsa',
  'web.calendar.nowLabel': 'Ngayon',
  'web.calendar.allDayHeading': 'Wala pang eksaktong oras',

  'web.calendar.filter.group': 'Grupo ng customer',
  'web.calendar.filter.anyBrand': 'Kahit anong brand',
  'web.calendar.filter.anyAccount': 'Kahit anong account',
  'web.calendar.filter.anyPlatform': 'Kahit anong platform',
  'web.calendar.filter.anyStatus': 'Kahit anong status',
  'web.calendar.filter.anyLocale': 'Anumang wika ng nilalaman',
  'web.calendar.filter.anyCampaign': 'Anumang kampanya',
  'web.calendar.filter.anyGroup': 'Bawat grupo',
  'web.calendar.filter.regionLabel': 'I-filter ang iskedyul',
  'web.calendar.bucket.scheduled': 'Naka-iskedyul',
  'web.calendar.bucket.draft': 'Mga draft at pag-apruba',
  'web.calendar.bucket.published': 'Nai-publish',
  'web.calendar.bucket.failed': 'Kailangan ng atensyon',
  'web.calendar.filter.summary':
    '{count, plural, =0 {Walang mga filter} one {# salain} other {# mga filter}}, {results, plural, =0 {walang posts} one {# post} other {# mga post}}',

  'web.calendar.grid.label': 'Mag-iskedyul ng grid para sa {range}',
  'web.calendar.grid.hourLabel': '{time}',
  'web.calendar.grid.emptySlot': 'Wala sa {time} sa {date}',
  'web.calendar.grid.dayColumn': '{weekday} {day}',
  'web.calendar.grid.overflow':
    '{count, plural, one {Ipakita # mas maraming post} other {Ipakita # mas maraming post}}',
  'web.calendar.month.label': 'Buwan grid para sa {month}',
  'web.calendar.agenda.label': 'Agenda para sa {range}',
  'web.calendar.agenda.dayHeading': '{weekday}, {date}',
  'web.calendar.agenda.emptyDay': 'Walang nakaiskedyul',

  'web.calendar.table.caption':
    'Bawat post sa {range}, pinagsunod-sunod ayon sa oras ng pag-publish.',
  'web.calendar.table.column.time': 'Oras',
  'web.calendar.table.column.account': 'Account',
  'web.calendar.table.column.content': 'Nilalaman',
  'web.calendar.table.column.language': 'Wika',
  'web.calendar.table.column.media': 'Media',
  'web.calendar.table.column.status': 'Katayuan',
  'web.calendar.table.column.approver': 'Approver',
  'web.calendar.table.column.campaign': 'Kampanya',
  'web.calendar.table.column.actions': 'Mga aksyon',
  'web.calendar.table.rowMenu': 'Mga aksyon para sa {title}',
  'web.calendar.table.noApprover': 'Walang kinakailangang pag-apruba',
  'web.calendar.table.noCampaign': 'Walang kampanya',

  'web.calendar.entry.untitled': 'Walang pamagat na draft',
  'web.calendar.entry.language': 'Wika {locale}',
  'web.calendar.entry.openDetail': 'Bukas {title}',
  'web.calendar.entry.selected': '{title} pinili. {hint}',
  'web.calendar.detail.title': 'Naka-iskedyul na post',
  'web.calendar.detail.close': 'Isara ang post na ito',

  'web.calendar.keyboard.title': 'Maglipat ng post gamit ang keyboard',
  'web.calendar.keyboard.body':
    'Ituon ang isang post at pindutin ang Enter upang buksan ito. Pindutin ang M upang kunin ang isang post, pagkatapos ay gamitin ang mga arrow key upang ilipat ito sa isang puwang at Enter upang kumpirmahin. Pindutin ang Escape para ibalik ito.',
  'web.calendar.keyboard.pickUp': 'Ilipat ang post na ito',
  'web.calendar.keyboard.grabbed':
    '{title} kinuha mula sa {from}. Ginagalaw ito ng mga arrow key. Kinukumpirma ng Enter. Kinansela ang pagtakas.',
  'web.calendar.keyboard.moved': 'Iminungkahing oras {to}. Kinukumpirma ng Enter.',
  'web.calendar.keyboard.released': '{title} ibalik sa {from}.',
  'web.calendar.keyboard.stepMinutes': 'Ang bawat hakbang ay {minutes} minuto.',

  'web.calendar.reschedule.title': 'Ilipat ang post na ito?',
  'web.calendar.reschedule.subject': '{account} sa {provider}',
  'web.calendar.reschedule.from': 'Mula sa {local} ({utc} UTC)',
  'web.calendar.reschedule.to': 'Upang {local} ({utc} UTC)',
  'web.calendar.reschedule.confirm': 'Ilipat ang post',
  'web.calendar.reschedule.dstTitle':
    'Ang mga orasan ay nagbabago sa pagitan ng dalawang oras na ito',
  'web.calendar.reschedule.dstBody':
    'Ang offset sa {timeZone} ay {fromOffset} noong unang panahon at {toOffset} sa bagong panahon. Ang lokal na oras na iyong pinili ay pinananatili, kaya ang UTC instant shifts.',
  'web.calendar.reschedule.conflictTitle': 'Ang iba pang mga post ay malapit na sa oras na ito',
  'web.calendar.reschedule.conflictBody':
    '{account} mayroon na {count, plural, one {# post} other {# mga post}} sa loob {window} ng bagong panahon.',
  'web.calendar.reschedule.campaignTitle': 'Salungatan sa kampanya',
  'web.calendar.reschedule.campaignBody':
    'Kampanya {campaign} tumatakbo mula sa {start} sa {end}. Ang bagong oras ay nasa labas ng bintanang iyon.',
  'web.calendar.reschedule.leadTimeTitle': 'Ito ay malapit na',
  'web.calendar.reschedule.leadTimeBody':
    'Ang bagong panahon ay {duration} mula ngayon. {provider} pangangailangan {required} upang ihanda ang media para sa ganitong uri ng post.',
  'web.calendar.reschedule.pastTitle': 'Lumipas ang panahong iyon',
  'web.calendar.reschedule.pastBody': 'Pumili ng oras sa hinaharap, o i-publish na lang ngayon.',

  'web.calendar.published.title': 'Na-publish na ang post na ito',
  'web.calendar.published.body':
    'May post sa {provider} sa {permalinkLabel}. Ang paglipat ng entry sa Relay ay hindi gumagalaw sa post sa platform. Piliin mo ang gusto mong mangyari.',
  'web.calendar.published.optionLocal': 'I-update lamang ang lokal na tala',
  'web.calendar.published.optionLocalHint':
    'Pinapanatili ng resibo ang totoong oras ng pag-publish. Ang planning entry lang ang gumagalaw, kaya tumugma ang iyong kalendaryo sa iyong plano.',
  'web.calendar.published.optionNew': 'Mag-iskedyul ng bagong post sa bagong oras',
  'web.calendar.published.optionNewHint':
    'Lumilikha ito ng pangalawang, hiwalay na panlabas na post. Yung naka on na {provider} nananatiling online.',
  'web.calendar.published.optionLabel': 'Ano ang dapat mangyari',

  'web.calendar.attention.title':
    '{count, plural, one {# Ang post ay nangangailangan ng desisyon o ayusin} other {# kailangan ng desisyon o pag-aayos ng mga post}}',
  'web.calendar.attention.body':
    'Nananatili sila dito at sa action center hanggang sa sila ay naresolba.',
  'web.calendar.attention.open': 'Buksan ang action center',
  'web.calendar.attention.showOnly': 'Ipakita lamang ang mga ito',

  'web.calendar.loading': 'Nilo-load ang iskedyul',
  'web.calendar.error.title': 'Hindi ma-load ang iskedyul',
  'web.calendar.error.body':
    'Walang nagbago sa nakaiskedyul. Ang iyong mga post ay nagpa-publish pa rin sa kanilang mga nakaplanong oras.',
  'web.calendar.error.retry': 'Subukan muli',
  'web.calendar.empty.example':
    '09:30 Europe/Berlin, X @acme, "Live ang mga nakaiskedyul na unang komento", Naka-iskedyul, 1 larawan',
  'web.calendar.emptyFiltered.body':
    'Walang post sa {range} tumutugma sa mga filter na ito. Palawakin ang saklaw o i-clear ang isang filter.',
  'web.calendar.offline.title': 'Offline ka',
  'web.calendar.offline.body':
    'Ang iskedyul sa ibaba ay ang huling kopya na na-load ng device na ito. Ang muling pag-iskedyul at pag-publish ay hindi magagamit hanggang sa bumalik ang koneksyon.',
  'web.calendar.rateLimited.cause':
    'Binabasa ng workspace na ito ang kalendaryo nang mas maraming beses kaysa sa pinapayagan ng kasalukuyang window.',
  'web.calendar.rateLimited.resetLabel': 'Maaari mong subukan muli sa',
  'web.calendar.rateLimited.resetUnknown': '{provider} hindi sinabi kung kailan ito ni-reset.',
  'web.calendar.permission.requirementsLabel': 'Kinakailangang saklaw',
  'web.calendar.permission.title': 'Hindi mo makikita ang kalendaryong ito',
  'web.calendar.permission.body':
    'Ang access sa kalendaryo ay ibinibigay sa bawat brand. Ang iyong account ay wala sa mga brand sa view na ito.',

  /* ---------------------------------------------------------------------
   * Post job and publication receipt
   * ------------------------------------------------------------------- */
  'web.receipt.breadcrumb.calendar': 'Kalendaryo',
  'web.receipt.breadcrumb.post': 'Post',
  'web.receipt.heading': '{title}',
  'web.receipt.loading': 'Nilo-load ang resibo ng publikasyon',
  'web.receipt.notFound.title': 'Walang resibo na may reference na iyon',
  'web.receipt.notFound.body':
    'May resibo kapag naipadala na ang isang post. Suriin ang reference, o buksan ang post mula sa kalendaryo.',
  'web.receipt.error.title': 'Hindi ma-load ang resibo',
  'web.receipt.error.body':
    'Ang resibo ay hindi nababago at hindi apektado nito. Walang na-republish.',

  'web.receipt.section.summary': 'Anong nangyari',
  'web.receipt.section.timeline': 'Timeline ng kaganapan',
  'web.receipt.section.items': 'Root post at follow up na mga item',
  'web.receipt.section.attempts': 'Mga pagtatangka',
  'web.receipt.section.provenance': 'Provenance',
  'web.receipt.section.cost': 'Paggamit ng provider',
  'web.receipt.section.analytics': 'Pag-sync ng Analytics',
  'web.receipt.section.targets': 'Mga target sa campaign na ito',

  'web.receipt.item.root': 'Root post',
  'web.receipt.item.comment': 'Magkomento {position}',
  'web.receipt.item.thread': 'Bahagi ng thread {position}',
  'web.receipt.item.delay': 'Tumatakbo {delay} pagkatapos ng root post',
  'web.receipt.item.noDelay': 'Tumatakbo gamit ang root post',
  'web.receipt.item.pending': 'Hindi pa nagsisimula',
  'web.receipt.item.rootUnaffected':
    'Live ang root post. Ang isang follow up na item na nabigo ay hindi kailanman nagbabago iyon.',

  'web.receipt.attempt.heading': 'Pagtatangka {number}',
  'web.receipt.attempt.startedAt': 'Nagsimula {time}',
  'web.receipt.attempt.startedLabel': 'Nagsimula',
  'web.receipt.attempt.responseSummary': 'Sanitized na tugon ng provider',
  'web.receipt.attempt.duration': 'Kinuha {duration}',
  'web.receipt.attempt.httpStatus': 'Katayuan ng HTTP',
  'web.receipt.attempt.providerRequestId': 'Reperensya sa kahilingan ng provider',
  'web.receipt.attempt.retryable': 'Awtomatikong sinubukang muli',
  'web.receipt.attempt.notRetryable': 'Hindi awtomatikong sinubukang muli',
  'web.receipt.attempt.nextRetry': 'Susunod na pagtatangka sa {time}',
  'web.receipt.attempt.nextRetryLabel': 'Susunod na pagtatangka',
  'web.receipt.attempt.showResponse': 'Ipakita ang sanitized na tugon ng provider',
  'web.receipt.attempt.hideResponse': 'Itago ang sanitized na tugon ng provider',
  'web.receipt.attempt.none': 'Isang pagsubok, walang kabiguan.',

  'web.receipt.provenance.capabilityVersion': 'snapshot ng kakayahan',
  'web.receipt.provenance.capabilityHint':
    'Ang snapshot na ginamit sa pag-apruba at muling sinuri bago ipadala.',
  'web.receipt.provenance.accountType': 'Uri ng account',
  'web.receipt.provenance.externalAccount': 'Panlabas na sanggunian ng account',
  'web.receipt.provenance.workflow': 'Sanggunian sa daloy ng trabaho',
  'web.receipt.provenance.createdAt': 'May nakasulat na resibo {time}',

  'web.receipt.approval.notRequired': 'Walang kinakailangang pag-apruba para sa target na ito.',
  'web.receipt.approval.policy': 'Patakaran {policy}',
  'web.receipt.approval.unknownPolicy': 'Hindi naitala ang sanggunian sa patakaran',

  'web.receipt.cost.currency': 'Naka-charge in {currency}',
  'web.receipt.cost.estimatedLabel': 'Tinantya bago i-publish',
  'web.receipt.cost.actualLabel': 'Reconciled actual',
  'web.receipt.provenance.writtenLabel': 'May nakasulat na resibo',
  'web.receipt.cost.reconciledAt': 'Nagkasundo {time}',
  'web.receipt.cost.notMetered':
    '{provider} hindi naniningil bawat operasyon para sa uri ng post na ito.',

  'web.receipt.analytics.never': 'Hindi pa nagsi-sync ang Analytics para sa post na ito.',
  'web.receipt.analytics.explain':
    'Pinagsasama-sama ng mga provider sa sarili nilang mga iskedyul. Ang oras sa ibaba ay kung kailan huling binasa ni Relay ang mga ito, hindi noong totoo ang mga numero.',

  'web.receipt.export.download': 'I-download ang resibo',
  'web.receipt.export.copyReference': 'Kopyahin ang sanggunian ng resibo',
  'web.receipt.export.denied':
    'Ang pagbabahagi ng resibo ay nangangailangan ng tungkulin ng may-ari, admin, o approver. ikaw ay {role}.',

  'web.receipt.partial.retryFailedOnly': 'Subukan lamang ang mga target na nabigo',
  'web.receipt.partial.retryHint':
    'Ang isang muling pagsubok ay hindi kailanman makakaapekto sa isang target na nakagawa na ng isang panlabas na post.',

  'web.receipt.remediation.user_action_required':
    'Kailangan nito ng pagbabago sa Relay o sa {provider} bago ito muling tumakbo.',
  'web.receipt.remediation.content_invalid':
    'I-edit ang nilalaman para pumasa ito {provider} pagpapatunay, pagkatapos ay iiskedyul itong muli.',
  'web.receipt.remediation.transient_provider':
    '{provider} nagbalik ng pansamantalang error. Relay muling sinubukan sa sarili nitong iskedyul.',
  'web.receipt.remediation.permanent_provider':
    '{provider} tumanggi ito nang tuluyan. Ang muling pagsubok sa parehong nilalaman ay hindi magbabago sa sagot.',
  'web.receipt.remediation.internal':
    'Ito ay isang kasalanan sa aming panig. Ito ay naitala kasama ang sanggunian sa ibaba.',
  'web.receipt.remediation.unknown':
    '{provider} nagbalik ng isang bagay na wala kaming panuntunan. Nasa ibaba ang sanitized na tugon.',

  /* ---------------------------------------------------------------------
   * Connections
   * ------------------------------------------------------------------- */
  'web.connection.tab.accounts': 'Mga account',
  'web.connection.tab.capabilities': 'Matrix ng kakayahan',
  'web.connection.tab.groups': 'Mga pangkat ng customer',
  'web.connection.loading': 'Naglo-load ng mga konektadong account',
  'web.connection.error.title': 'Hindi ma-load ang mga konektadong account',
  'web.connection.error.body':
    'Ang pag-publish ay hindi naaapektuhan. Ang mga naka-iskedyul na post ay tumatakbo pa rin laban sa nakaimbak na pag-access.',
  'web.connection.list.label': 'Mga konektadong account',
  'web.connection.empty.example':
    'X, @acme, personal na profile, konektado noong Hunyo 12 ni Ana Ruiz, pag-publish at mga sukatan, huling na-publish noong Agosto 6',
  'web.connection.filter.provider': 'Plataporma',
  'web.connection.filter.health': 'Kalusugan',
  'web.connection.filter.group': 'Grupo ng customer',
  'web.connection.filter.anyHealth': 'Anumang kalusugan',
  'web.connection.healthFilter.healthy': 'Nagtatrabaho',
  'web.connection.healthFilter.expiring_soon': 'Malapit nang mag-expire',
  'web.connection.healthFilter.expired': 'Nag-expire ang access',
  'web.connection.healthFilter.revoked': 'Binawi ang access',
  'web.connection.healthFilter.permission_missing': 'Nawawalang pahintulot',
  'web.connection.healthFilter.review_pending': 'Naghihintay sa pagsusuri sa platform',
  'web.connection.healthFilter.paused': 'Naka-pause',
  'web.connection.healthFilter.unknown': 'Hindi available ang kalusugan',

  'web.connection.row.summaryLabel': 'Ano ang magagawa ng account na ito',
  'web.connection.row.expand': 'Ipakita ang buong buod para sa {account}',
  'web.connection.row.collapse': 'Itago ang buong buod para sa {account}',
  'web.connection.row.metered': 'Meter bawat operasyon. Tinatantya {amount} bawat post na gawa.',
  'web.connection.row.limitationHeading': 'Mga limitasyon sa account na ito',
  'web.connection.row.noLimitations': 'Walang limitasyon sa produksyon o beta sa account na ito.',
  'web.connection.row.beta': 'Beta connector',
  'web.connection.row.betaBody':
    'Gumagana ang connector na ito, na may mga limitasyon na hindi pa namin natapos sa pag-verify. Suriin ang nai-publish na post bago ka umasa dito.',

  'web.connection.detail.expiryLabel': 'Mag-e-expire ang access',
  'web.connection.health.expiresIn': 'Mag-e-expire ang access {relativeTime}, sa {date}',
  'web.connection.health.noExpiry':
    'Ang access na ito ay hindi mag-e-expire sa isang iskedyul {provider} nagsasabi sa amin.',
  'web.connection.health.checkedAt': 'Sinusuri ang kalusugan {relativeTime}',

  'web.connection.action.inspect': 'Suriin ang mga pahintulot',
  'web.connection.action.viewCapabilities': 'Tingnan kung ano ang sinusuportahan nito',
  'web.connection.action.moveGroup': 'Lumipat sa ibang grupo',
  'web.connection.action.menu': 'Higit pang mga aksyon para sa {account}',

  'web.connection.pause.title': 'I-pause {account}?',
  'web.connection.resume.title': 'Ipagpatuloy {account}?',
  'web.connection.resume.body':
    'Ang mga naka-iskedyul na post para sa account na ito ay magsisimulang mag-publish muli sa kanilang mga nakaplanong oras. Ang mga post na lumipas na ang oras ay hindi gumagana nang retroactive.',
  'web.connection.disconnect.confirmWord': 'Idiskonekta',
  'web.connection.disconnect.consequence.scheduled':
    '{count, plural, one {# naka-iskedyul na post} other {# naka-iskedyul na mga post}} para sa account na ito ay hindi mag-publish.',
  'web.connection.disconnect.consequence.published':
    'Ang mga post na nai-publish ay nananatili sa {provider}. Hindi tinatanggal ng Relay ang mga ito.',
  'web.connection.disconnect.consequence.analytics':
    'Ang mga sukatan na nakolekta na ay nananatili sa workspace na ito at huminto sa pag-update.',

  'web.connection.connect.title': 'Ikonekta ang isang account',
  'web.connection.connect.chooseProvider': 'Aling plataporma',
  'web.connection.connect.permissionHeading': 'Ano ang itatanong ni Relay {provider} para sa',
  'web.connection.connect.requirementHeading': 'Bago ka magpatuloy',
  'web.connection.connect.continue': 'Magpatuloy sa {provider}',
  'web.connection.connect.handoffNote':
    'Ang susunod na screen ay {provider}, hindi Relay. Hindi kailanman nakikita ng Relay ang iyong password.',
  'web.connection.connect.noWriteWithoutApproval':
    'Ang pagkonekta ng isang account ay hindi naglalathala ng anuman. Sinusunod pa rin ng bawat post ang patakaran sa pag-apruba ng workspace na ito.',

  'web.connection.requirement.instagram':
    'Ang Instagram publishing ay nangangailangan ng isang propesyonal na account, na nangangahulugang isang negosyo o creator account na naka-link sa isang Facebook Page.',
  'web.connection.requirement.facebook':
    'Nag-publish ang Relay sa Facebook Pages. Ang isang personal na profile ay hindi maaaring maging target sa pag-publish.',
  'web.connection.requirement.linkedin':
    'Upang mag-publish para sa isang organisasyon kailangan mo ng tungkulin ng admin ng nilalaman sa LinkedIn Page na iyon.',
  'web.connection.requirement.youtube':
    'Hanggang sa makumpleto ng Google ang pag-audit ng app, ang mga pag-upload mula sa proyektong ito ay ipa-publish bilang pribado. Maaari mong baguhin ang visibility sa YouTube pagkatapos.',
  'web.connection.requirement.tiktok':
    'Hinihiling sa iyo ng TikTok na ikaw mismo ang pumili ng audience para sa bawat post. Hindi maaaring piliin ng Relay ang isa para sa iyo.',
  'web.connection.requirement.x':
    'X na singil sa bawat operasyon. Ang isang post na naglalaman ng isang URL ay nagkakahalaga ng higit sa isang plain text na post, at ang pagtatantya ay ipinapakita bago ka mag-iskedyul.',
  'web.connection.requirement.threads':
    'Ginagamit ng Threads publishing ang account na naka-link sa iyong Instagram na propesyonal na account.',
  'web.connection.requirement.bluesky':
    'Kumokonekta ang Bluesky sa isang password ng app na ginawa sa iyong mga setting ng Bluesky, hindi sa password ng iyong account.',
  'web.connection.requirement.generic':
    'Kailangan mo ng pahintulot na mag-post sa account na ito mula sa platform mismo. Hindi ito maibibigay ng Relay.',

  'web.connection.purpose.publish': 'Pag-publish ng mga post na iniiskedyul mo sa Relay.',
  'web.connection.purpose.readPosts':
    'Binabasa muli ang isang post na Relay na na-publish, para mapatunayan ng resibo na live ito.',
  'web.connection.purpose.identity':
    'Ipinapakita ang eksaktong pangalan ng account sa Relay, kaya hindi ka mag-publish sa mali.',
  'web.connection.purpose.analytics':
    'Ang pagbabasa ng mga sukatan na iniuulat ng platform na ito para sa sarili mong mga post.',
  'web.connection.purpose.refresh':
    'Pagpapanatiling buhay ang pag-access upang ang isang naka-iskedyul na post ay hindi mabibigo sa magdamag.',
  'web.connection.purpose.chooseDestination':
    'Paglilista ng Mga Pahina at channel na maaari mong piliin bilang target sa pag-publish.',

  'web.connection.permissions.title': 'Mga pahintulot sa {account}',
  'web.connection.permissions.scopeColumn': 'Pahintulot',
  'web.connection.permissions.stateColumn': 'Estado',
  'web.connection.permissions.purposeColumn': 'Para saan ito ginagamit ng Relay',
  'web.connection.permissions.missingWarning':
    '{count, plural, one {# nawawala ang pahintulot} other {# nawawala ang mga pahintulot}}. Muling kumonekta at tanggapin ito upang maibalik ang mga feature sa ibaba.',
  'web.connection.permissions.snapshot': 'Basahin mula sa {provider} {relativeTime}',

  'web.connection.capability.title': 'Matrix ng kakayahan',
  'web.connection.capability.subtitle':
    'Binuo mula sa mga bersyong kahulugan ng connector sa build na ito, pagkatapos ay sinuri gamit ang kamay. Ito ay ang parehong data na ginagamit ng kompositor at ng pampublikong kakayahan sa pahina.',
  'web.connection.capability.tableLabel': 'Mga kakayahan ayon sa platform',
  'web.connection.capability.featureColumn': 'Kakayahan',
  'web.connection.capability.legendTitle': 'Paano basahin ito',
  'web.connection.capability.legend.supported':
    'Magagawa ito ng Relay ngayon para sa isang konektadong account na may tamang uri.',
  'web.connection.capability.legend.not_implemented':
    'Iniaalok ito ng platform at hindi pa ito binuo ng Relay. Ito ay nasa roadmap ng connector.',
  'web.connection.capability.legend.unsupported':
    'Hindi ito inaalok ng platform sa pamamagitan ng opisyal nitong API, kaya walang tool ang makakagawa nito nang ligtas.',
  'web.connection.capability.legend.requires_review':
    'Binuo, at ibinibigay lamang ito ng platform pagkatapos nitong suriin ang app o ang account.',
  'web.connection.capability.versionLabel': 'Mga kahulugan ng connector',
  'web.connection.capability.version': 'Bersyon ng mga kahulugan ng connector {version}',
  'web.connection.capability.observedAt': 'Nabasa ang snapshot {relativeTime}',
  'web.connection.capability.forAccount': 'Ipinakita para sa {account}',
  'web.connection.capability.noSnapshot':
    'Wala pang capability snapshot para sa account na ito. Muling kumonekta upang basahin ang isa.',
  'web.connection.capability.cellLabel': '{feature} sa {provider}: {state}',

  'web.connection.group.title': 'Mga pangkat ng customer',
  'web.connection.group.listLabel': 'Mga pangkat ng customer',
  'web.connection.group.accountCount':
    '{count, plural, =0 {Walang mga account} one {# account} other {# mga account}}',
  'web.connection.group.create': 'Gumawa ng grupo',
  'web.connection.group.nameLabel': 'Pangalan ng grupo',
  'web.connection.group.namePlaceholder': 'Acme EU',
  'web.connection.group.moveTitle': 'Ilipat {account}',
  'web.connection.group.moveLabel': 'Ilipat sa',
  'web.connection.group.moveConfirm': 'Ilipat ang account',
  'web.connection.group.movedAnnouncement': '{account} inilipat sa {group}',
  'web.connection.group.filterCalendarHint':
    'Sinasala ng isang grupo ang kalendaryo at analytics. Ang paglipat ng isang account ay nagpapanatili sa bawat post, resibo at sukatan na mayroon na ito.',
  'web.connection.group.empty.title': 'Wala pang grupo ng customer',
  'web.connection.group.empty.body':
    'Ang isang grupo ay isang kliyente o isang tatak. Igrupo ang mga account para i-filter ang kalendaryo at analytics ayon sa customer.',

  'web.connection.incident.title': 'Ang account na ito ay nangangailangan ng pansin',
  'web.connection.incident.remediationHeading': 'Ano ang gagawin',
  'web.connection.incident.scheduledOnHold':
    '{count, plural, one {# naka-hold ang naka-iskedyul na post} other {# naka-hold ang mga naka-iskedyul na post}} para sa account na ito.',
  'web.connection.incident.nothingLost': 'Walang nawawala at walang nadodoble.',
} as const;
