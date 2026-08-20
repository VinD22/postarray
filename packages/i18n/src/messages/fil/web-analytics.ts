/**
 * Web surface strings for Analytics, Automation Rules, RSS autopost and
 * tracked links.
 *
 * `analytics.ts` and `automation.ts` hold the domain vocabulary shared by every
 * surface (metric names, trigger sentences, provider caveats). This file holds
 * what only the web screens need: column headings, filter labels, wizard steps,
 * the sentence builder chrome and the per screen empty, error, offline,
 * permission and rate limit copy.
 *
 * Every leaf name here is new. Nothing in this file overwrites a key defined in
 * `analytics.ts` or `automation.ts`, which is asserted by `lint.test.ts`.
 */
export const webAnalyticsMessages = {
  /* ======================================================================
     Analytics shell
     ====================================================================== */
  'analytics.chart.legend': 'Mga serye na ipinapakita sa tsart na ito',
  'analytics.tab.overview': 'Pangkalahatang-ideya',
  'analytics.tab.experiments': 'Mga eksperimento',
  'analytics.tab.links': 'Mga sinusubaybayang link',
  'analytics.tab.label': 'Mga seksyon ng Analytics',

  'analytics.question.baseline': 'Aling mga post ang lumayo sa sarili mong baseline?',
  'analytics.question.baselineHelp':
    'Ang bawat post ay inihahambing sa iyong sariling kamakailang mga post sa parehong account at sa parehong format. Wala dito ang nagkukumpara sa iyo sa ibang workspace o ibang kumpanya.',
  'analytics.question.accounts': 'Aling mga account ang nangangailangan ng pansin?',
  'analytics.question.next': 'Ano ang susunod na sulit na pagsubok?',

  'analytics.filter.project': 'Project',
  'analytics.filter.accounts': 'Mga account',
  'analytics.filter.allAccounts': 'Lahat ng konektadong account',
  'analytics.filter.range': 'Saklaw ng petsa',
  'analytics.filter.format': 'Format ng nilalaman',
  'analytics.filter.allFormats': 'Lahat ng mga format',
  'analytics.filter.comparePrevious': 'Ikumpara sa nakaraang panahon',
  'analytics.filter.applied':
    '{count, plural, =0 {Walang mga filter} one {# salain} other {# mga filter}} inilapat. {results, plural, =0 {Walang mga post na tumutugma} one {# mag-post ng mga tugma} other {# magkatugma ang mga post}}.',

  'analytics.rankMetric.label': 'I-rank ang mga post ni',
  'analytics.rankMetric.help':
    'Walang pinagsamang marka sa Relay. Pumili ng isang sukatan kung saan ang kahulugan ay pinagkakatiwalaan mo at ang talahanayan ay nakaayos ayon sa sukatan na iyon lamang.',
  'analytics.rankMetric.chosen':
    'Niraranggo ayon sa {metric}, gaya ng iniulat ng bawat provider ng account.',

  /* ----------------------------------------------------------------------
     Outcome groups. Never summed together.
     ---------------------------------------------------------------------- */
  'analytics.outcome.awareness': 'Kamalayan',
  'analytics.outcome.awarenessHelp':
    'Ilang beses naihatid o nakita ang post. Ang mga provider ay nagbibilang nito nang iba, kaya ang isang halaga ay maihahambing lamang sa sarili nito sa paglipas ng panahon.',
  'analytics.outcome.consumption': 'Pagkonsumo',
  'analytics.outcome.consumptionHelp':
    'Gaano karami sa post ang aktwal na napanood o nabasa ng mga tao.',
  'analytics.outcome.interaction': 'Pakikipag-ugnayan',
  'analytics.outcome.interactionHelp':
    'Ang ginawa ng mga tao sa platform: pag-like, komento, pagbabahagi at pag-save.',
  'analytics.outcome.conversion': 'Pagbabalik-loob',
  'analytics.outcome.conversionHelp':
    'Ano ang ginawa ng mga tao pagkatapos umalis sa platform. Ang mga sinusubaybayang link lang ang makakasagot nito, at para lang sa mga link na pinili mong subaybayan.',
  'analytics.outcome.separateNote':
    'Ang apat na pangkat na ito ay binibilang nang hiwalay. Ang pagdaragdag sa kanila ay mabibilang ang parehong tao nang higit sa isang beses.',

  /* ----------------------------------------------------------------------
     Comparison table
     ---------------------------------------------------------------------- */
  'analytics.table.caption':
    'Mga post na na-publish sa napiling hanay, na ang bawat isa ay inihambing sa sarili mong kamakailang baseline.',
  'analytics.table.post': 'Post',
  'analytics.table.account': 'Account',
  'analytics.table.format': 'Format',
  'analytics.table.published': 'Nai-publish',
  'analytics.table.value': 'Halaga',
  'analytics.table.delta': 'Laban sa baseline',
  'analytics.table.sample': 'Sample',
  'analytics.table.sampleSize': 'n = {count}',
  'analytics.table.evidence': 'Ebidensya',
  'analytics.table.openEvidence': 'Ipakita ang ebidensya para sa {post}',
  'analytics.table.rowActions': 'Mga aksyon para sa {post}',
  'analytics.table.openPost': 'Buksan ang mga sukatan ng post',
  'analytics.table.openReceipt': 'Buksan ang resibo ng publikasyon',
  'analytics.table.noBaseline': 'Wala pang baseline',
  'analytics.table.noBaselineReason':
    'Mas kaunti sa {required} may mga maihahambing na post sa account na ito. Ang paghahambing ay ingay, kaya walang ipinapakita.',
  'analytics.table.sortBy': 'Pagbukud-bukurin ayon sa {column}',
  'analytics.table.detailToggle': 'Mga Detalye',

  'analytics.delta.above': '{percent} sa itaas ng baseline',
  'analytics.delta.below': '{percent} sa ibaba ng baseline',
  'analytics.delta.level': 'Alinsunod sa baseline',
  'analytics.delta.unavailable': 'Walang paghahambing',

  'analytics.evidence.title': 'Paano ginawa ang paghahambing na ito',
  'analytics.evidence.baseline':
    'Baseline: ang median {metric} ng nauna {count, plural, one {# maihahambing na post} other {# maihahambing na mga post}} sa {account}.',
  'analytics.evidence.comparableBy':
    'Ang maihahambing ay nangangahulugan ng parehong account, ang parehong format ng nilalaman ({format}) at isang oras ng pag-publish sa loob ng parehong panahon.',
  'analytics.evidence.postsUsed': 'Mga post na ginamit para sa baseline',
  'analytics.evidence.excluded':
    '{count, plural, =0 {Walang mga post na ibinukod} one {# ibinukod ang post} other {# ang mga post ay hindi kasama}} dahil hindi available ang sukatan para sa kanila.',
  'analytics.evidence.smallSample':
    'Sa {count, plural, one {# post} other {# mga post}} sa baseline, isang hindi pangkaraniwang post ang gumagalaw sa median nang malayo. Tratuhin ito bilang isang senyales upang muling subukan, hindi bilang isang resulta.',
  'analytics.evidence.confounders': 'Ano ito ay hindi account para sa',
  'analytics.evidence.confounder.time':
    'Ang oras ng pag-publish ng araw ay iba-iba sa mga baseline na post.',
  'analytics.evidence.confounder.format':
    'Ang mga post ng larawan at mga post ng video ay hindi direktang maihahambing dito.',
  'analytics.evidence.confounder.followers':
    'Umaasa ang tagasunod {account} binago ng {percent} sa panahong ito.',
  'analytics.evidence.confounder.paid':
    'Hindi masabi ng Relay kung nakatanggap ng bayad na pamamahagi ang alinman sa mga post na ito.',
  'analytics.evidence.confounder.provider':
    '{provider} binago kung paano ito nag-uulat {metric} sa loob ng panahong ito.',

  /* ----------------------------------------------------------------------
     Metric definitions
     ---------------------------------------------------------------------- */
  'analytics.definition.open': 'ano {metric} ibig sabihin',
  'analytics.definition.inlineHeading': 'Kahulugan',
  'analytics.definition.observedAt': 'Naobserbahan {dateTime}.',
  'analytics.definition.sourceLink': 'Dokumentasyon ng provider',
  'analytics.definition.verifiedOn': 'Sinuri laban sa dokumentasyon ng provider sa {date}.',
  'analytics.definition.panelTitle': 'Mga kahulugan ng panukat sa view na ito',
  'analytics.definition.panelIntro':
    'Ang bawat numero sa screen na ito ay nagmumula sa isang pinangalanang field ng provider. Ang mga kahulugan sa ibaba ay inuulit din sa tabi ng bawat halaga, kaya walang mahalagang nabubuhay lamang sa isang tooltip.',
  'analytics.definition.aggregation.sum':
    'Pinagsama-sama sa pamamagitan ng pagdaragdag ng bawat obserbasyon.',
  'analytics.definition.aggregation.average': 'Pinagsama-sama bilang isang ibig sabihin.',
  'analytics.definition.aggregation.median': 'Pinagsama-sama bilang isang median.',
  'analytics.definition.aggregation.last': 'Ang pinakahuling obserbasyon.',
  'analytics.definition.aggregation.delta':
    'Ang pagbabago sa pagitan ng una at huling obserbasyon.',
  'analytics.definition.aggregation.none': 'Iniulat bilang iisang obserbasyon.',
  'analytics.definition.denominator.none': 'Ito ay isang bilang, hindi isang rate.',
  'analytics.definition.historyWindow':
    '{provider} nagpapanatili {days, plural, one {# araw} other {# araw}}ng kasaysayan para sa larangang ito.',
  'analytics.definition.historyWindowNone':
    '{provider} hindi nagsasaad ng limitasyon sa kasaysayan para sa field na ito.',

  'analytics.definition.term.providerField': 'Field ng provider',
  'analytics.definition.term.unit': 'Yunit',
  'analytics.definition.term.denominator': 'Denominator',
  'analytics.definition.term.aggregation': 'Paano ito pinagsama-sama',
  'analytics.definition.term.history': 'Kasaysayan na pinapanatili ng provider',
  'analytics.definition.term.definition': 'Ang ibig sabihin ng sinasabi ng provider',

  'analytics.unit.count': 'Isang bilang ng mga kaganapan',
  'analytics.unit.seconds': 'Mga segundo',
  'analytics.unit.percent': 'Isang porsyento na nakalkula na ng provider',
  'analytics.unit.ratio': 'Isang ratio na Relay na kinakalkula mula sa dalawang field ng provider',
  'analytics.unit.currency_minor': 'Isang halaga ng pera sa mga menor de edad na yunit',

  'analytics.denominator.none': 'Ito ay isang bilang, hindi isang rate. Wala itong denominator.',
  'analytics.denominator.impressions': 'Hinati ng mga impression',
  'analytics.denominator.reach': 'Hinati sa abot',
  'analytics.denominator.views': 'Nahahati sa mga pananaw',
  'analytics.denominator.followers': 'Hinati sa bilang ng tagasunod sa oras ng pagmamasid',
  'analytics.denominator.sessions': 'Nahahati sa mga sesyon',

  'analytics.format.text': 'Text',
  'analytics.format.image': 'Imahe',
  'analytics.format.carousel': 'Carousel',
  'analytics.format.video': 'Video',
  'analytics.format.short_video': 'Maikling video',
  'analytics.format.long_video': 'Mahabang video',
  'analytics.format.document': 'Dokumento',
  'analytics.format.thread': 'Thread',

  'analytics.value.unavailableReason.notImplemented':
    'Hindi pa binuo ng Relay ang pagmamapa para sa sukatang ito {provider} pa.',
  'analytics.value.estimated': 'Tinatantya',
  'analytics.value.estimatedMethod': 'Paraan: {method}.',

  /* ----------------------------------------------------------------------
     Freshness and account attention
     ---------------------------------------------------------------------- */
  'analytics.freshness.title': 'Kung saan nanggaling ang mga numerong ito',
  'analytics.freshness.intro':
    'Pinagsasama-sama ng mga provider sa kanilang sariling iskedyul. Walang live sa screen na ito.',
  'analytics.freshness.accountRow': '{account} sa {provider}',
  'analytics.freshness.never': 'Hindi kailanman naka-sync',
  'analytics.freshness.nextAttempt': 'Susunod na pagtatangka sa pag-sync {relativeTime}.',
  'analytics.freshness.openStatus': 'Katayuan ng provider',

  'analytics.accounts.title': 'Mga account na nangangailangan ng pansin',
  'analytics.accounts.empty':
    'Ang bawat konektadong account ay nagbalik ng data sa panahong ito. Walang kailangan sayo dito.',
  'analytics.accounts.reason.permission':
    'Ang pahintulot sa analytics ay hindi ibinigay noong nakakonekta ang account na ito.',
  'analytics.accounts.reason.expired':
    'Nag-expire ang access, kaya walang sukatan na nakolekta mula noon {date}.',
  'analytics.accounts.reason.stale': 'Ang huling matagumpay na pag-sync ay {relativeTime}.',
  'analytics.accounts.reason.syncFailing':
    '{count, plural, one {# pagtatangka sa pag-sync} other {# mga pagtatangka sa pag-sync}} sunod-sunod na nabigo. Ang dahilan na naitala ay {reason}.',
  'analytics.accounts.reason.noPosts': 'Walang na-publish sa account na ito sa napiling hanay.',

  /* ----------------------------------------------------------------------
     Observations and next tests
     ---------------------------------------------------------------------- */
  'analytics.observations.title': 'Mga obserbasyon',
  'analytics.observations.intro':
    'Ito ay mga paglalarawan kung ano ang ipinapakita ng mga numero. Ang mga ito ay hindi mga hula at hindi sila nagtatatag ng dahilan.',
  'analytics.observations.empty':
    'Wala pang sapat na nai-publish na kasaysayan upang ilarawan ang isang pattern. Mag-publish ng ilan pang post sa parehong account at format.',
  'analytics.observations.citedPosts': 'Batay sa',
  'analytics.observations.citedPeriod': 'Panahon: {start} sa {end}.',
  'analytics.observations.nextTestTitle': 'Isang pagsubok na maaari mong gawin sa susunod',
  'analytics.observations.nextTestBody':
    'I-publish {count, plural, one {# mas maraming post} other {# mas maraming post}} sa {account} nagbabago lamang {variable}, pagkatapos ay ihambing ang parehong sukatan. I-tag ito bilang isang eksperimento bago i-publish upang ang paghahambing ay pinaplano sa halip na makita pagkatapos.',
  'analytics.observations.tagFirst': 'Mag-tag ng eksperimento',

  /* ----------------------------------------------------------------------
     Charts
     ---------------------------------------------------------------------- */
  'analytics.chart.title': '{metric} sa paglipas ng panahon',
  'analytics.chart.summary':
    '{metric} sa {account}, {count, plural, one {# punto} other {# puntos}} mula sa {start} sa {end}.',
  'analytics.chart.showTable': 'Ipakita bilang isang talahanayan',
  'analytics.chart.hideTable': 'Itago ang mesa',
  'analytics.chart.tableCaption': 'Ang parehong serye bilang isang talahanayan.',
  'analytics.chart.columnPeriod': 'Panahon',
  'analytics.chart.columnValue': 'Halaga',
  'analytics.chart.gapLabel': 'Walang nakolektang data',
  'analytics.chart.gapExplained':
    'Ang isang break sa linya ay nangangahulugan na walang nakolektang obserbasyon para sa panahong iyon. Hindi ibig sabihin ay zero.',
  'analytics.chart.annotation': 'Anotasyon',
  'analytics.chart.pointLabel': '{period}: {value}',
  'analytics.chart.empty': 'Walang mga obserbasyon na nakolekta sa hanay na ito.',

  /* ----------------------------------------------------------------------
     Experiments
     ---------------------------------------------------------------------- */
  'analytics.experiment.new': 'Magplano ng eksperimento',
  'analytics.experiment.empty':
    'Wala pang mga eksperimento. Ang eksperimento ay isang paghahambing na pagpapasya mo bago mag-publish, na siyang tanging uri na makakasagot sa isang tanong.',
  'analytics.experiment.emptyExample':
    'Halimbawa: i-publish ang parehong anunsyo sa X dalawang beses, isang beses na may link sa post at isang beses na may link sa unang komento, pagkatapos ay ihambing ang mga pag-click sa link sa loob ng 72 oras.',
  'analytics.experiment.name': 'Ano ang iyong sinusubok',
  'analytics.experiment.namePlaceholder': 'Unang komento sa 5 minuto laban sa 30 minuto',
  'analytics.experiment.hypothesisPlaceholder':
    'Ang isang mas maikling pagkaantala bago ang unang komento ay makakuha ng higit pang mga tugon sa X.',
  'analytics.experiment.variantLabel': 'Variant {index}',
  'analytics.experiment.variantDescription': 'Ano ang naiiba sa variant na ito',
  'analytics.experiment.addVariant': 'Magdagdag ng variant',
  'analytics.experiment.removeVariant': 'Alisin ang variant {index}',
  'analytics.experiment.accounts': 'Kasama ang mga account',
  'analytics.experiment.windowHelp':
    'Patuloy na gumagalaw ang mga sukatan pagkatapos maging live ang isang post. Ayusin ang window ngayon upang hindi magawa ang paghahambing sa isang sandali na mangyayari na umangkop sa isang variant.',
  'analytics.experiment.windowDays':
    'Sukatin para sa {count, plural, one {# araw} other {# araw}} pagkatapos ma-publish ang bawat post',
  'analytics.experiment.minSample': 'Mga minimum na post sa bawat variant',
  'analytics.experiment.minSampleHelp':
    'Sa ibaba ng bilang na ito ang resulta ay ipinapakita bilang walang tiyak na paniniwala sa halip na bilang isang nagwagi.',
  'analytics.experiment.status.planned': 'Nakaplano',
  'analytics.experiment.status.collecting':
    'Nangongolekta. {published} ng {target} mga post na nai-publish.',
  'analytics.experiment.status.inconclusive': 'Kumpleto, walang malinaw na pagkakaiba',
  'analytics.experiment.result.difference':
    '{variant} naitala {percent} higit pa {metric} kaysa sa {otherVariant}.',
  'analytics.experiment.result.noDifference':
    'Ang dalawang variant ay nasa loob {percent} ng bawat isa sa {metric}. Iyon ay nasa loob ng hanay ng mga post na ito ay nag-iiba pa rin.',
  'analytics.experiment.result.association':
    'Ito ay isang asosasyon na sinusukat sa {count, plural, one {# post} other {# mga post}}. Hindi ito nagpapatunay na ang pagbabago ay nagdulot ng pagkakaiba.',
  'analytics.experiment.result.unavailable':
    '{metric} ay hindi magagamit para sa {count, plural, one {# post} other {# mga post}} sa eksperimentong ito, kaya ang mga post na iyon ay hindi kasama sa halip na binibilang na zero.',
  'analytics.experiment.result.title': 'Resulta',
  'analytics.experiment.completeNow': 'Isara ang eksperimentong ito',
  'analytics.experiment.completeConfirm':
    'Ang pagsasara ay huminto sa koleksyon. Ang mga post ay mananatiling naka-publish at ang mga numero ay mananatiling available.',
  'analytics.experiment.postsTitle': 'Mga post sa eksperimentong ito',

  /* ----------------------------------------------------------------------
     Analytics states
     ---------------------------------------------------------------------- */
  'analytics.state.loading': 'Nilo-load ang analytics para sa mga napiling account',
  'analytics.state.loadingProvider': 'Kinukuha {provider} pagsusuri',
  'analytics.state.empty': 'Walang nai-publish sa hanay na ito',
  'analytics.state.emptyBody':
    'Inilalarawan ng Analytics ang mga post na lumabas na. Mag-publish ng isang bagay, o palawakin ang hanay ng petsa.',
  'analytics.state.emptyExample':
    'Kapag live na ang isang post, makakakita ka ng row tulad ng: X @acme, "Launch thread", 12,400 impressions, 58 percent above your median of the previous 10.',
  'analytics.state.errorTitle': 'Hindi ma-load ang Analytics',
  'analytics.state.errorBody':
    'Walang ipinapakitang numero sa halip na isang nahulaan. Ang iyong mga post at resibo ay hindi naaapektuhan.',
  'analytics.state.partialTitle': '{loaded} ng {total} ibinalik na data ng mga account',
  'analytics.state.partialBody':
    'Ang mga account na sumagot ay ipinapakita sa kanilang sariling pagiging bago. Ang iba ay nakalista na may dahilan kung bakit hindi nila ginawa.',
  'analytics.state.partialSucceeded': 'Ibinalik na data',
  'analytics.state.partialFailed': 'Hindi nagbalik ng data',
  'analytics.state.offlineTitle': 'Offline ka',
  'analytics.state.offlineBody':
    'Na-load ang mga figure sa ibaba bago bumaba ang koneksyon, kaya mas luma ang mga ito kaysa sa iminumungkahi ng mga label ng pagiging bago.',
  'analytics.state.permissionTitle': 'Hindi mo makikita ang analytics sa workspace na ito',
  'analytics.state.permissionBody':
    'Kailangan ng Analytics ang tungkulin ng analyst o mas mataas. Maaaring ibigay ito ng may-ari o admin ng workspace na ito.',
  'analytics.state.rateLimitTitle':
    '{provider} ay nililimitahan ng rate ang mga kahilingan sa analytics',
  'analytics.state.rateLimitCause':
    'Ginamit ng account ang bahagi nito sa quota ng provider para sa window na ito. Ang Relay ay hindi muling nagsusumikap, dahil maaantala nito ang pag-publish.',
  'analytics.state.rateLimitAlternative':
    'Paliitin ang hanay ng petsa o ang filter ng account, na humihingi ng mas mura sa provider.',
  'analytics.state.rateLimitReset': 'Ipagpatuloy ang mga kahilingan',
  'analytics.state.reference': 'Sanggunian sa diagnostic',

  /* ======================================================================
     Tracked links (first party redirect measurement)
     ====================================================================== */
  'analytics.links.new': 'Gumawa ng sinusubaybayang link',
  'analytics.links.empty': 'Wala pang sinusubaybayang link',
  'analytics.links.emptyBody':
    'Ang isang sinusubaybayang link ay isang maikling URL na Relay na nagre-redirect, upang makakakita ka ng mga pag-click kahit na walang nag-uulat ng isang platform. Ang orihinal na destinasyon ay hindi kailanman mababago nang walang audit entry.',
  'analytics.links.emptyExample':
    'Halimbawa: nagre-redirect ang relay.to/a7Kq2 sa acme.com/blog/launch na may campaign q3-launch.',
  'analytics.links.table.caption':
    'Ang mga sinusubaybayang link sa workspace na ito at ang kanilang first party click ay binibilang.',
  'analytics.links.campaign': 'Kampanya',
  'analytics.links.created': 'Nilikha',
  'analytics.links.usedIn':
    '{count, plural, =0 {Hindi pa ginagamit sa isang post} one {Ginamit sa # post} other {Ginamit sa # mga post}}',
  'analytics.links.state.active': 'Aktibo',
  'analytics.links.state.expired': 'Nag-expire na {date}',
  'analytics.links.state.disabled': 'Hindi pinagana',
  'analytics.links.state.disabledAt':
    'Hindi pinagana noong {date}. Hindi na nagre-redirect ang maikling URL na ito.',
  'analytics.links.state.blocked': 'Na-block para sa kaligtasan',
  'analytics.links.state.blockedBody':
    'Hindi available ang redirect na ito dahil hindi pumasa sa safety check ang destinasyon. Palitan ang destinasyon o makipag-ugnayan sa support.',
  'analytics.links.state.disabledReason':
    'Hindi pinagana ng {actor} sa {date}. Naitala ang dahilan: {reason}.',
  'analytics.links.detailTitle': 'Sinusubaybayang link {slug}',
  'analytics.links.exactRedirect': 'Eksaktong pag-redirect',
  'analytics.links.exactRedirectHelp':
    'Ito ang destinasyong nararating ng isang bisita ngayon, kasama ang bawat parameter ng UTM, na ipinapakita nang buo at hindi pinaikling.',
  'analytics.links.editDestination': 'Baguhin ang destinasyon',
  'analytics.links.editDestinationWarning':
    'Ang pagbabago ng patutunguhan ay nakakaapekto sa bawat lugar na na-publish na ang link na ito. Ang mga ulat para sa mga panahon bago ang pagbabago ay nagpapanatili sa destinasyon na aktibo noong panahong iyon.',
  'analytics.links.editDestinationAudit':
    'Ang pagbabago ay naitala sa audit log kasama ang iyong pangalan, ang lumang destinasyon at ang bago.',
  'analytics.links.destinationHistory': 'Kasaysayan ng patutunguhan',
  'analytics.links.destinationHistoryRow': '{destination}, aktibo mula sa {start} sa {end}',
  'analytics.links.destinationHistoryCurrent': '{destination}, aktibo mula noon {start}',
  'analytics.links.domainLabel': 'Maikling domain',
  'analytics.links.domainDefault': 'Relay default na domain',
  'analytics.links.domainVerified': 'Na-verify ng DNS sa {date}',
  'analytics.links.domainPending': 'Naghihintay para sa tala ng DNS',
  'analytics.links.domainPendingHelp':
    'Idagdag ang TXT record sa ibaba sa {domain}, pagkatapos ay suriin muli. Hanggang sa ma-verify ito, hindi mapipili ang domain na ito para sa isang bagong link.',
  'analytics.links.domainFailed': 'Hindi tumugma ang DNS record noong {date}',
  'analytics.links.domainCheck': 'Suriin muli ang DNS',
  'analytics.links.expiry': 'Expiry',
  'analytics.links.expiryNone': 'Walang expiration set',
  'analytics.links.expiryHelp':
    'Pagkatapos ng pag-expire ang link ay nagbabalik ng isang simpleng pahina na nagsasabing ito ay natapos na. Hindi ito tahimik na nakaturo sa ibang lugar.',
  'analytics.links.disable': 'Huwag paganahin ang link na ito ngayon',
  'analytics.links.disableTitle': 'Huwag paganahin {slug}?',
  'analytics.links.disableBody':
    'Naabot ng mga bisita ang isang page na nagsasabing hindi na available ang link. Ang mga nai-publish na post ay naglalaman pa rin ng maikling URL, kaya makikita ito ng sinumang mag-click.',
  'analytics.links.disableReason': 'Dahilan para sa hindi pagpapagana',
  'analytics.links.enable': 'Paganahin muli ang link na ito',
  'analytics.links.abuseTitle': 'Mag-ulat ng pang-aabuso sa link na ito',
  'analytics.links.abuseBody':
    'Kung ang maikling URL na ito ay ginagamit para sa isang bagay na hindi mo nilayon, iulat ito at ang pag-redirect ay sinuspinde habang ito ay sinusuri.',
  'analytics.links.abuseAction': 'Iulat ang link na ito',
  'analytics.links.measurementLabel': 'Pagsukat ng pag-redirect ng first party',
  'analytics.links.measurementExplained':
    'Binibilang ng Relay ang isang kahilingan kapag hiniling ang serbisyo sa pag-redirect para sa URL na ito. Ang na-deduplicate na pag-click ay nag-aalis ng mga paulit-ulit na kahilingan mula sa parehong bisita sa loob ng maikling window, at ang mga kahilingang tumutugma sa mga kilalang pattern ng crawler ay hindi kasama sa halip na tanggalin.',
  'analytics.links.botsNote':
    '{count, plural, one {# kahilingan} other {# mga kahilingan}} ay inuri bilang awtomatiko at hindi kasama sa na-deduplicate na bilang.',
  'analytics.links.series.title':
    'Mga kahilingan at na-deduplicate na pag-click sa paglipas ng panahon',
  'analytics.links.series.requests': 'Kabuuang mga kahilingan',
  'analytics.links.series.clicks': 'Mga na-deduplicate na pag-click',
  'analytics.links.breakdownTitle': 'Kung saan nanggaling ang mga pag-click',
  'analytics.links.breakdown.share': '{percent} ng mga deduplicated na pag-click',
  'analytics.links.referrer.direct': 'Walang ipinadalang referrer',
  'analytics.links.referrer.social': 'Social platform',
  'analytics.links.referrer.search': 'Search engine',
  'analytics.links.referrer.email': 'Email client',
  'analytics.links.referrer.other': 'Iba pang website',
  'analytics.links.device.mobile': 'Mobile',
  'analytics.links.device.desktop': 'Desktop',
  'analytics.links.device.tablet': 'Tableta',
  'analytics.links.device.unknown': 'Hindi determinado',
  'analytics.links.countryUnknown': 'Hindi natukoy ang bansa',
  'analytics.links.lastEventLabel': 'Huling pag-click',
  'analytics.links.noEvents': 'Wala pang naitalang pag-click',
  'analytics.links.noEventsBody':
    'Ang link na ito ay hindi pa hiniling mula noong ito ay nilikha. Totoong zero iyon, na sinusukat ng sarili naming serbisyo sa pag-redirect.',
  'analytics.links.compareWarning':
    '{provider} mga ulat {providerValue} mga pag-click ng link para sa post na ito. Naitala ang Relay {relayValue} mga deduplicated na pag-click. Ang dalawa ay nagbibilang ng magkaibang mga kaganapan at hindi pumapalit sa isa pa.',
  'analytics.links.errorTitle': 'Hindi ma-load ang mga istatistika ng link',
  'analytics.links.errorBody':
    'Gumagana pa rin ang serbisyo sa pag-redirect, kaya ang link ay patuloy na nagpapadala ng mga bisita sa destinasyon nito. Ang pag-uulat lamang ang apektado.',
  'analytics.links.createDestination': 'Destination URL',
  'analytics.links.createDestinationHelp':
    'Dapat ay isang pampublikong https address. Ang mga pribadong network address at redirect chain ay tinanggihan ng serbisyo sa pag-redirect.',
  'analytics.links.createCampaign': 'Pangalan ng kampanya',
  'analytics.links.createSlug': 'Pasadyang pagtatapos',
  'analytics.links.createSlugHelp':
    'Iwanan itong walang laman at Relay ay bumubuo ng isang maikling random na pagtatapos.',
  'analytics.links.createUtm': 'Mga parameter ng UTM',
  'analytics.links.blockedScheme': 'Tanging ang mga patutunguhan sa https ang tinatanggap.',
  'analytics.links.blockedPrivate':
    'Ang address na iyon ay nasa isang pribadong network, kaya hindi ito tatanggapin ng serbisyo sa pag-redirect.',

  /* ======================================================================
     Automation: list and shell
     ====================================================================== */
  'automation.tab.rules': 'Mga tuntunin',
  'automation.tab.feeds': 'Mga RSS feed',
  'automation.tab.label': 'Mga seksyon ng automation',

  'automation.rules.table.caption': 'Mga panuntunan sa pag-automate sa workspace na ito.',
  'automation.rules.table.rule': 'Panuntunan',
  'automation.rules.table.state': 'Estado',
  'automation.rules.table.accounts': 'Mga account',
  'automation.rules.table.lastRun': 'Huling pagtakbo',
  'automation.rules.table.nextCheck': 'Susunod na check',
  'automation.rules.neverRun': 'Hindi pa tumatakbo',
  'automation.rules.emptyExample':
    'Halimbawa: kapag may lumabas na bagong item sa blog feed ng Acme, kung English ang wika, gumawa ng draft mula sa template ng announce ng Blog at humiling ng pag-apruba.',
  'automation.rules.summaryAccounts':
    '{count, plural, =0 {Walang napiling mga account} one {# account} other {# mga account}}',
  'automation.rules.openRule': 'Bukas {name}',
  'automation.rules.duplicateRule': 'Duplicate {name}',
  'automation.rules.deleteTitle': 'Tanggalin {name}?',
  'automation.rules.deleteBody':
    'Ang panuntunan ay hihinto kaagad at ang kasaysayan ng pagtakbo nito ay pinananatili para sa audit log. Hindi apektado ang mga post na nagawa na nito.',

  /* ----------------------------------------------------------------------
     Catalog entries the shared automation vocabulary does not cover yet
     ---------------------------------------------------------------------- */
  'automation.trigger.commentFailed': 'nabigo ang nakaiskedyul na komento o thread item',

  'automation.condition.timeWindow': 'ang oras ay nasa pagitan {start} at {end} sa {timeZone}',
  'automation.condition.domainPresent': 'ang teksto ay nagli-link sa {domain}',
  'automation.condition.hashtagPresent': 'ang teksto ay naglalaman ng hashtag {hashtag}',
  'automation.condition.providerCapability': 'talagang magagawa ng account {capability}',
  'automation.condition.planStatus': 'aktibo ang subscription',

  'automation.action.continueSequence': 'ipagpatuloy ang inihandang thread o comment sequence',
  'automation.action.notifyEmail': 'magpadala ng email sa {target}',
  'automation.action.notifyWebhook': 'magpadala ng webhook sa {target}',
  'automation.action.pauseConnection': 'i-pause ang apektadong account',
  'automation.action.quotePost': 'quote ang source post ng isang beses',
  'automation.action.followUpComment': 'magdagdag ng inihandang komento sa pinagmulang post',

  'automation.param.feed': 'Pakainin',
  'automation.param.template': 'Template',
  'automation.param.signature': 'Lagda',
  'automation.param.disclosure': 'Pagbubunyag',
  'automation.param.locale': 'Wika',
  'automation.param.project': 'Project',
  'automation.param.campaign': 'Kampanya',
  'automation.param.account': 'Account',
  'automation.param.platform': 'Plataporma',
  'automation.param.contentType': 'Uri ng nilalaman',
  'automation.param.keyword': 'Keyword',
  'automation.param.hashtag': 'Hashtag',
  'automation.param.domain': 'Domain',
  'automation.param.capability': 'Kakayahan',
  'automation.param.timeZone': 'Time zone',
  'automation.param.startTime': 'Mula sa',
  'automation.param.endTime': 'Upang',
  'automation.param.duration': 'Tagal',
  'automation.param.metric': 'Sukatan',
  'automation.param.value': 'Halaga',
  'automation.param.target': 'Ipadala sa',
  'automation.param.time': 'Oras',
  'automation.param.cadence': 'Gaano kadalas',
  'automation.param.notSet': 'hindi nakatakda',

  /* ----------------------------------------------------------------------
     Sentence builder
     ---------------------------------------------------------------------- */
  'automation.editor.name': 'Pangalan ng panuntunan',
  'automation.editor.namePlaceholder': 'Blog sa sosyal',
  'automation.editor.when': 'kailan',
  'automation.editor.if': 'Kung',
  'automation.editor.then': 'Pagkatapos',
  'automation.editor.after': 'Pagkatapos',
  'automation.editor.until': 'Hanggang sa',
  'automation.editor.sentenceLabel': 'Panuntunang pangungusap',
  'automation.editor.readBack':
    'Basahin muli ang pangungusap bago mo ito i-on. Ito ang buong tuntunin.',
  'automation.editor.chooseTrigger': 'Piliin kung ano ang magsisimula sa panuntunang ito',
  'automation.editor.addCondition': 'Magdagdag ng kundisyon',
  'automation.editor.addAction': 'Magdagdag ng aksyon',
  'automation.editor.removeCondition': 'Alisin ang kundisyon {label}',
  'automation.editor.removeAction': 'Alisin ang aksyon {label}',
  'automation.editor.moveActionUp': 'Ilipat {label} kanina',
  'automation.editor.moveActionDown': 'Ilipat {label} mamaya',
  'automation.editor.actionOrder':
    'Ang mga aksyon ay tumatakbo sa ganitong pagkakasunud-sunod, mula sa itaas hanggang sa ibaba.',
  'automation.editor.noConditions':
    'Walang kundisyon. Gumagana ang panuntunan sa tuwing ma-trigger ito.',
  'automation.editor.noActions':
    'Wala pang aksyon. Hindi mase-save ang isang panuntunan na walang aksyon.',
  'automation.editor.delayNone': 'walang delay',
  'automation.editor.delayLabel': 'Pagkaantala bago tumakbo ang mga aksyon',
  'automation.editor.endLabel': 'Kapag huminto ang panuntunang ito',
  'automation.editor.end.manual': 'Pinapatay ko ito',
  'automation.editor.end.date': 'isang petsa na pipiliin ko',
  'automation.editor.end.count': 'tumakbo na ito {count, plural, one {# oras} other {# beses}}',
  'automation.editor.end.dateValue': 'Tumigil ka na',
  'automation.editor.end.countValue': 'Huminto pagkatapos nitong maraming pagtakbo',
  'automation.editor.parameterFor': 'Mga setting para sa {label}',
  'automation.editor.saveDraft': 'I-save bilang draft',
  'automation.editor.savedAt': 'Nai-save {time}',
  'automation.editor.unsaved': 'Mga hindi na-save na pagbabago',

  'automation.editor.view.sentence': 'Pangungusap',
  'automation.editor.view.structured': 'Nakabalangkas',
  'automation.editor.view.api': 'API representasyon',
  'automation.editor.view.label': 'View ng editor',
  'automation.editor.apiHelp':
    'Ito mismo ang ipinapadala ng REST API, ang CLI at ang MCP server. Ang pag-edit dito at ang paglipat pabalik sa pangungusap ay nagpapanatili sa bawat field.',
  'automation.editor.apiInvalid':
    'Hindi ito wastong panuntunang JSON, kaya hindi ito nailapat: {reason}',
  'automation.editor.apiApply': 'Ilapat itong JSON',
  'automation.editor.structuredHelp':
    'Ang parehong panuntunan bilang mga patlang. Gamitin ito kapag maraming kundisyon ang isang tuntunin at humahaba ang pangungusap.',

  'automation.editor.error.noAction': 'Magdagdag ng kahit isang aksyon bago i-save.',
  'automation.editor.error.noTrigger': 'Pumili ng trigger bago i-save.',
  'automation.editor.error.noAccounts':
    'Pumili ng hindi bababa sa isang account na maaaring kumilos ang panuntunang ito.',
  'automation.editor.error.missingParameter': '{label} nangangailangan ng halaga.',
  'automation.editor.error.summary':
    '{count, plural, one {# bagay na nangangailangan ng iyong pansin} other {# bagay na kailangan ng iyong atensyon}} bago ma-save ang panuntunang ito.',

  /* ----------------------------------------------------------------------
     Trigger, condition and action pickers
     ---------------------------------------------------------------------- */
  'automation.picker.triggerTitle': 'Ano ang nagsisimula sa panuntunang ito',
  'automation.picker.conditionTitle': 'Magdagdag ng kundisyon',
  'automation.picker.actionTitle': 'Magdagdag ng aksyon',
  'automation.picker.search': 'I-filter ang listahang ito',
  'automation.picker.noResults': 'Wala sa listahang ito ang tumutugma sa iyong na-type.',
  'automation.picker.groupContent': 'Nilalaman',
  'automation.picker.groupPublishing': 'Paglalathala',
  'automation.picker.groupNotify': 'Mga tao at sistema',
  'automation.picker.groupControl': 'Kontrol sa panuntunan',
  'automation.picker.groupSchedule': 'Oras',
  'automation.picker.groupExternal': 'Panlabas na mga kaganapan',
  'automation.picker.groupMeasurement': 'Pagsukat',
  'automation.picker.hiddenForProvider':
    '{count, plural, one {# aksyon ay} other {# mga aksyon ay}} hindi nakalista dahil hindi maisagawa ng mga napiling account ang mga ito.',
  'automation.picker.hiddenDetail': '{action} ay hindi magagamit para sa {provider}. {reason}',
  'automation.picker.consequential': 'Lumilikha ng isang bagay sa isang platform',
  'automation.picker.internalOnly': 'Nananatili sa loob ng Relay',

  'automation.accounts.label': 'Mga account na maaaring kumilos ang panuntunang ito',
  'automation.accounts.help':
    'Hindi kailanman maaaring hawakan ng isang panuntunan ang isang account na hindi nakalista dito, anuman ang sinasabi ng mga kundisyon nito.',
  'automation.accounts.none': 'Wala pang napiling mga account',

  /* ----------------------------------------------------------------------
     Engagement threshold controls
     ---------------------------------------------------------------------- */
  'automation.threshold.title': 'Mga panuntunan sa pagsukat para sa trigger na ito',
  'automation.threshold.intro':
    'Ang isang panuntunan na tumutugon sa isang numero ay kailangang malaman kung aling numero, sinusukat sa kung anong panahon, at kung gaano kadalas ito maaaring kumilos.',
  'automation.threshold.metric': 'Sukatan upang panoorin',
  'automation.threshold.value': 'Halaga ng threshold',
  'automation.threshold.window': 'Window ng pagsukat',
  'automation.threshold.windowHelp':
    'Binibilang mula sa sandaling nai-publish ang source post. Sa labas ng window na ito, huminto ang panuntunan sa panonood sa post.',
  'automation.threshold.expiry': 'Itigil ang panonood ng post pagkatapos',
  'automation.threshold.cooldown': 'Cooldown sa pagitan ng mga execution',
  'automation.threshold.cooldownHelp':
    'Ang pinakamaikling oras na pinapayagan sa pagitan ng dalawang run para sa parehong source post.',
  'automation.threshold.maxPerPost': 'Pinakamataas na execution bawat source post',
  'automation.threshold.defaultsTitle':
    'Mga default na mananatili maliban kung babaguhin mo ang mga ito',
  'automation.threshold.defaultOncePerPost': 'Patakbuhin nang isang beses bawat source post.',
  'automation.threshold.defaultStale':
    'Huwag isagawa kung hindi available o lipas ang sukatan. Ang ginamit na limitasyon sa pagiging bago ay {duration}.',
  'automation.threshold.staleLimit': 'Tratuhin ang isang sukatan bilang lipas pagkatapos',
  'automation.threshold.providerNote':
    '{provider} mga ulat {metric} sa isang pagkaantala, kaya maaari lamang kumilos ang panuntunang ito pagkatapos na i-publish ng provider ang numero.',

  /* ----------------------------------------------------------------------
     Cross account follow up
     ---------------------------------------------------------------------- */
  'automation.crossAccount.title': 'Mag-follow up mula sa ibang account',
  'automation.crossAccount.off':
    'Naka-off. Ang panuntunang ito ay kumikilos lamang sa pinagmulang account.',
  'automation.crossAccount.enable': 'Payagan ang pag-follow up mula sa isa pang account',
  'automation.crossAccount.body':
    'Ang parehong mga account ay dapat na konektado sa workspace na ito at pareho ay dapat na pinangalanan dito. Ang pag-follow up ay isang inihandang post na isusulat mo nang maaga, at dumadaan ito sa parehong patakaran sa pag-apruba gaya ng iba pa.',
  'automation.crossAccount.sourceAccount': 'Pinagmulan ng account',
  'automation.crossAccount.followUpAccount': 'Account na nagpa-publish ng follow up',
  'automation.crossAccount.preauthorize':
    'Kinukumpirma kong pareho silang kumokontrol sa workspace na ito {sourceAccount} at {followUpAccount}, at ang pag-follow up ay hindi ipinakita bilang independiyenteng pag-endorso.',
  'automation.crossAccount.preauthorizeRequired':
    'Kumpirmahin ang paunang pahintulot bago ma-save ang panuntunang ito.',
  'automation.crossAccount.duplicateCheck':
    'Tumatakbo ang cross account duplicate at cadence check bago ang pag-follow up, at nilaktawan ito sa halip na maantala kung uulitin nito ang source na post.',

  /* ----------------------------------------------------------------------
     Preflight
     ---------------------------------------------------------------------- */
  'automation.preflight.intro':
    'Lahat ng magagawa ng panuntunang ito, bago nito magawa ang anuman dito.',
  'automation.preflight.accountsLabel': 'Mga account kung saan maaari itong kumilos',
  'automation.preflight.maxActionsLabel': 'Karamihan sa mga panlabas na pagkilos sa bawat pagtakbo',
  'automation.preflight.maxActionsPeriod':
    'Sa karamihan {count, plural, one {# panlabas na pagkilos} other {# mga panlabas na aksyon}} sa {period}.',
  'automation.preflight.approvalLabel': 'Pag-apruba',
  'automation.preflight.approvalNone':
    'Walang aksyon sa panuntunang ito ang gumagawa ng anuman sa isang platform, kaya walang nalalapat na pag-apruba.',
  'automation.preflight.providerLabel': 'Mga paghihigpit ng provider',
  'automation.preflight.providerNone': 'Walang nalalapat sa mga aksyon sa panuntunang ito.',
  'automation.preflight.costLabel': 'Tinantyang nasusukat na gastos',
  'automation.preflight.costUnknown':
    'Hindi matantya ang gastos para sa mga pagkilos na ito hanggang sa malaman ang presyo ng provider.',
  'automation.preflight.costMethod':
    'Tinatantya mula sa listahan ng presyo ng provider sa {date}. Itinala ng resibo kung ano ang aktwal na siningil.',
  'automation.preflight.cadenceLabel': 'Indayog at mga duplicate',
  'automation.preflight.cadenceBody':
    'Ang mga duplicate at cadence na pagsusuri ay tumatakbo bago ang bawat aksyon. Ang isang aksyon na lalampas sa cadence na badyet para sa isang account ay nilaktawan at naitala, hindi nakapila.',
  'automation.preflight.failureLabel': 'Kung nabigo ang isang pagtakbo',
  'automation.preflight.failure.pauseAfter':
    'Ang panuntunan ay huminto pagkatapos {count, plural, one {# magkasunod na kabiguan} other {# magkakasunod na kabiguan}} at mag-file ng item ng aksyon.',
  'automation.preflight.failure.continue':
    'Ang panuntunan ay patuloy na tumatakbo at ang bawat pagkabigo ay naitala sa run log.',
  'automation.preflight.exampleLabel': 'Halimbawa run',
  'automation.preflight.exampleIntro':
    'Gamit ang pinakakamakailang kaganapan ay tumugma ang trigger na ito.',
  'automation.preflight.exampleNone':
    'Wala pang tugmang kaganapan ang nangyari, kaya walang halimbawang maipapakita. Magpatakbo na lang ng test event.',
  'automation.preflight.activate': 'I-on ang panuntunang ito',
  'automation.preflight.activateConfirmTitle': 'I-on {name}?',
  'automation.preflight.activateConfirmBody':
    'Mula ngayon, ang panuntunang ito ay kumikilos nang hindi muna tinatanong sa iyo, sa loob ng mga limitasyong nakalista sa itaas.',
  'automation.preflight.blocked':
    'Hindi pa maaaring i-on ang panuntunang ito. {count, plural, one {# aytem} other {# mga bagay}} kailangan ng desisyon sa itaas.',

  /* ----------------------------------------------------------------------
     Test runs, runs, versions, kill switch
     ---------------------------------------------------------------------- */
  'automation.test.title': 'Pagsubok na kaganapan',
  'automation.test.body':
    'Sinusuri ng test run ang buong pangungusap at ipinapakita kung ano ang gagawin nito. Hindi ito kailanman nagpa-publish, hindi kailanman nagpo-post ng komento at hindi nagpapadala ng webhook sa isang tunay na endpoint.',
  'automation.test.useLastEvent': 'Gamitin ang pinakabagong tumutugmang kaganapan',
  'automation.test.usePayload': 'Mag-paste ng payload ng kaganapan',
  'automation.test.run': 'Patakbuhin ang pagsubok',
  'automation.test.running': 'Pagpapatakbo ng pagsubok',
  'automation.test.resultTitle': 'Ano ang ginawa ng pagsubok',
  'automation.test.conditionPassed': '{condition} pumasa',
  'automation.test.conditionFailed': '{condition} hindi pumasa, kaya huminto ang panuntunan dito',
  'automation.test.actionSimulated': '{action} tatakbo sana',
  'automation.test.actionSkipped': '{action} ay laktawan: {reason}',
  'automation.test.noExternalEffect': 'Walang natira Relay sa panahon ng pagsubok na ito.',
  'automation.test.failed': 'Hindi makumpleto ang pagsusulit: {reason}',

  'automation.runs.table.caption': 'Mga kamakailang pagpapatakbo ng panuntunang ito.',
  'automation.runs.startedAt': 'Nagsimula',
  'automation.runs.outcome.label': 'kinalabasan',
  'automation.runs.actionsTaken': 'Mga aksyon',
  'automation.runs.trigger': 'Na-trigger ng',
  'automation.runs.outcome.completed': 'Nakumpleto',
  'automation.runs.outcome.skipped': 'Nilaktawan',
  'automation.runs.outcome.failed': 'Nabigo',
  'automation.runs.outcome.testMode': 'Test mode',
  'automation.runs.actionCount':
    '{count, plural, =0 {Walang panlabas na pagkilos} one {# panlabas na pagkilos} other {# mga panlabas na aksyon}}',
  'automation.runs.skippedReason': 'Nilaktawan kasi {reason}',
  'automation.runs.openDetail': 'Buksan ang run mula sa {time}',
  'automation.runs.createdItems': 'Nilikha',

  'automation.versions.caption': 'Ang bawat naka-save na bersyon ng panuntunang ito.',
  'automation.versions.current': 'Kasalukuyan',
  'automation.versions.savedBy': 'Nai-save ni {actor} sa {date}',
  'automation.versions.compare': 'Ikumpara sa kasalukuyang bersyon',
  'automation.versions.restore': 'Ibalik ang bersyon na ito',
  'automation.versions.restoreConfirm':
    'Ang pagpapanumbalik ay lumilikha ng bagong bersyon. Walang na-overwrite at nananatili ang panuntunan sa kasalukuyang estado nito hanggang sa i-on mo ito.',
  'automation.versions.diffTitle': 'Bersyon {from} kumpara sa bersyon {to}',

  'automation.kill.title': 'Tumigil ka {name} ngayon',
  'automation.kill.body':
    'Hihinto kaagad ang panuntunan, sa gitna ng pagtakbo kung may nangyayari. Ang anumang bagay na naipadala na sa isang platform ay mananatiling naka-publish, dahil ang isang panlabas na post ay hindi kailanman ibabalik.',
  'automation.kill.confirmPhrase': 'TUMIGIL',
  'automation.kill.confirmLabel': 'I-type ang STOP para kumpirmahin',
  'automation.kill.stopped':
    "Ang panuntunang ito ay itinigil {actor} sa {date}. Hindi ito maaaring tumakbo muli hangga't hindi mo ito i-on muli.",

  /* ----------------------------------------------------------------------
     Automation states
     ---------------------------------------------------------------------- */
  'automation.state.loading': 'Naglo-load ng mga panuntunan sa automation',
  'automation.state.loadingRule': 'Nilo-load ang panuntunan at ang mga kamakailang pagtakbo nito',
  'automation.state.errorTitle': 'Hindi ma-load ang mga panuntunan',
  'automation.state.errorBody':
    'Ang mga patakarang tumatakbo na ay hindi naaapektuhan nito. Tanging ang screen na ito ang nabigo.',
  'automation.state.offlineTitle': 'Offline ka',
  'automation.state.offlineBody':
    'Maaari kang magbasa ng panuntunan at mag-edit ng draft, at mananatili ito sa device na ito. Ang pag-save, pagsubok at pag-on ng isang panuntunan ay nangangailangan ng koneksyon.',
  'automation.state.permissionTitle': 'Hindi mo maaaring baguhin ang mga panuntunan sa automation',
  'automation.state.permissionBody':
    'Ang mga panuntunan ay kumikilos sa mga konektadong account, kaya ang pagbabago ng isa ay nangangailangan ng tungkulin ng manager o mas mataas. Mababasa mo pa rin ang bawat panuntunan at kasaysayan ng pagtakbo nito.',
  'automation.state.rateLimitTitle': 'Pinapabagal ang mga pagpapatakbo ng panuntunan',
  'automation.state.rateLimitCause':
    'Naabot ng workspace na ito ang automation run allowance nito para sa kasalukuyang window. Ang mga naka-iskedyul na post at manu-manong pag-publish ay hindi apektado.',
  'automation.state.rateLimitAlternative':
    'Ang mga panuntunang may cadence ay maaaring bigyan ng mas mahabang agwat, na gumagamit ng mas kaunting pagtakbo.',

  /* ======================================================================
     RSS autopost
     ====================================================================== */
  'automation.rss.subtitle':
    'Gawing mga draft o naka-iskedyul na mga post ang isang feed, na may parehong pagpapatunay at pag-apruba sa anumang bagay na isinulat mo mismo.',
  'automation.rss.empty': 'Wala pang feeds',
  'automation.rss.emptyBody':
    'Magdagdag ng feed at tinitingnan ito ng Relay sa isang iskedyul. Ang bawat bagong item ay nagiging draft, nakaiskedyul na post o kahilingan sa pag-apruba, alinman ang pipiliin mo.',
  'automation.rss.emptyExample':
    'Halimbawa: ang Acme blog feed ay lumilikha ng draft para sa X at LinkedIn sa bawat oras na ma-publish ang isang artikulo, at naghihintay para sa isang approver.',
  'automation.rss.table.caption': 'Pinapakain ang mga poll sa workspace na ito.',
  'automation.rss.table.feed': 'Pakainin',
  'automation.rss.table.policy': 'Ano ang mangyayari sa isang bagong item',
  'automation.rss.table.health': 'Kalusugan',

  'automation.rss.step.url': 'Address ng feed',
  'automation.rss.step.preview': 'Suriin ang feed',
  'automation.rss.step.seen': 'Panimulang punto',
  'automation.rss.step.targets': 'Kung saan ito pupunta',
  'automation.rss.step.template': 'Kung ano ang sinasabi ng post',
  'automation.rss.step.policy': 'Paano ito nai-publish',
  'automation.rss.stepOf': 'Hakbang {current} ng {total}',

  'automation.rss.urlHelp':
    'Kinukuha ng Relay ang feed mula sa aming mga server, hindi mula sa iyong browser. Ang mga address ng pribadong network ay tinanggihan.',
  'automation.rss.validateAction': 'Suriin ang feed na ito',
  'automation.rss.validateFailed': 'Ang address na iyon ay hindi nagbalik ng nababasang feed',
  'automation.rss.validateFailedReason': 'Ano ang nabawi namin: {reason}',
  'automation.rss.validateBlocked':
    'Ang address na iyon ay tumuturo sa isang pribadong network, kaya hindi ito nakuha.',
  'automation.rss.previewTitle': 'Preview ng feed',
  'automation.rss.previewMeta':
    '{title}. {count, plural, one {# aytem} other {# mga bagay}} ibinalik, pinakabago muna.',
  'automation.rss.previewItemPublished': 'Nai-publish {dateTime}',
  'automation.rss.previewNoImage': 'Walang larawan sa item na ito',
  'automation.rss.previewImageAlt': 'Larawan mula sa feed item {title}',
  'automation.rss.previewNoDate':
    'Walang timestamp ang item na ito, kaya ginagamit ng Relay ang oras na una nitong nakita.',
  'automation.rss.previewFieldsTitle': 'Mga field na ibinibigay ng feed na ito',
  'automation.rss.previewFieldMissing': 'Wala sa feed na ito',

  'automation.rss.seenTitle': 'Ano ang binibilang bilang nakita na',
  'automation.rss.seenLatest':
    'Tratuhin ang lahat ng kasalukuyang nasa feed tulad ng nakikita. Ang mga hinaharap na item lamang ang nai-post.',
  'automation.rss.seenAll':
    'Tratuhin ang pinakabagong item bilang bago at i-post ito sa susunod na tseke.',
  'automation.rss.seenHelp':
    'Karamihan sa mga feed ay naglalaman ng mga lumang artikulo. Ang pagpili sa unang opsyon ay kung paano mo maiiwasan ang pag-publish ng backlog.',

  'automation.rss.targetsHelp':
    'Piliin ang mga account o ang naka-save na grupo. Ang bawat target ay nakakakuha pa rin ng sarili nitong pagpapatunay bago ang anumang bagay ay nakaiskedyul.',
  'automation.rss.targetGroup': 'Naka-save na grupo',
  'automation.rss.targetIndividual': 'Mga indibidwal na account',

  'automation.rss.templateFields': 'Magagamit na mga patlang',
  'automation.rss.templateInsert': 'Ipasok {field}',
  'automation.rss.templateField.title': 'Pamagat ng item',
  'automation.rss.templateField.summary': 'Buod ng item',
  'automation.rss.templateField.link': 'Link ng item',
  'automation.rss.templateField.author': 'May-akda ng item',
  'automation.rss.templateField.published': 'Petsa ng pag-publish',
  'automation.rss.templateField.categories': 'Mga kategorya',
  'automation.rss.templatePreview': 'I-preview gamit ang pinakabagong item',
  'automation.rss.adaptWithAi': 'Iangkop ang teksto para sa bawat target',
  'automation.rss.adaptHelp':
    'Ang mga salita ay muling isinulat upang magkasya sa bawat platform at ipinapakita bilang isang pagkakaiba na tinatanggap o tinatanggihan mo. Ang media ay nagmula sa feed item. Ang Relay ay hindi bumubuo ng mga larawan.',
  'automation.rss.noImageGeneration':
    'Kung walang larawan ang isang feed item, lalabas ang post nang walang larawan.',
  'automation.rss.imageFromFeed': 'Gamitin ang larawan mula sa feed item kapag mayroon na ito',

  'automation.rss.policyHelp':
    'Ang feed item ay hindi espesyal. Sinusunod nito ang parehong patakaran sa pag-apruba bilang isang post na ikaw mismo ang sumulat.',
  'automation.rss.cadenceInterval': 'Isang item sa halos bawat isa',
  'automation.rss.cadenceHelp':
    'Ang mga karagdagang item ay naghihintay sa queue sa halip na mag-publish nang magkasama, kaya ang isang feed na nagpo-post ng sampung artikulo nang sabay-sabay ay hindi bumabaha sa isang account.',
  'automation.rss.immediateWarning':
    'Ang agarang pag-publish ay nagpapadala ng isang post sa isang platform nang hindi muna ito binabasa ng isang tao. Available lang ito kung pinapayagan ito ng patakaran sa pag-apruba para sa mga account na ito.',

  'automation.rss.healthTitle': 'Pakainin ang kalusugan',
  'automation.rss.healthOk': 'Nagtatrabaho',
  'automation.rss.healthStalled': 'Walang bagong item para sa {duration}',
  'automation.rss.healthFailing':
    'Ang huli {count, plural, one {suriin} other {# mga tseke}} nabigo',
  'automation.rss.health.nextPoll': 'Susunod na check {relativeTime}',
  'automation.rss.health.itemsProcessed':
    '{count, plural, =0 {Wala pang mga item na naproseso} one {# naproseso ang item} other {# mga bagay na naproseso}}',
  'automation.rss.health.duplicatesSkipped':
    '{count, plural, =0 {Walang nalaktawan na mga duplicate} one {# nilaktawan ang duplicate} other {# nilaktawan ang mga duplicate}}',
  'automation.rss.health.lastPollLabel': 'Huling sinuri',
  'automation.rss.health.lastItemLabel': 'Huling bagong item sa feed',
  'automation.rss.health.lastPostLabel': 'Huling draft o post na ginawa',
  'automation.rss.health.processedLabel': 'Naproseso ang mga item',
  'automation.rss.recentItems': 'Mga kamakailang item',
  'automation.rss.itemOutcome.draft': 'Nagawa ang draft',
  'automation.rss.itemOutcome.scheduled': 'Naka-iskedyul para sa {time}',
  'automation.rss.itemOutcome.published': 'Nai-publish',
  'automation.rss.itemOutcome.awaitingApproval': 'Naghihintay ng pag-apruba',
  'automation.rss.itemOutcome.duplicate': 'Nilaktawan, nakita na',
  'automation.rss.itemOutcome.failed': 'Nabigo: {reason}',
  'automation.rss.pauseFeed': 'I-pause ang feed na ito',
  'automation.rss.resumeFeed': 'Ipagpatuloy ang feed na ito',
  'automation.rss.deleteTitle': 'Alisin {title}?',
  'automation.rss.deleteBody':
    'Huminto ang Relay sa pagsuri sa feed na ito. Ang mga draft at post na nagawa na nito ay mananatiling eksakto kung ano ang mga ito.',
  'automation.rss.errorTitle': 'Hindi mabasa ang feed na ito',
  'automation.rss.errorBody':
    'Ang Relay ay patuloy na tumitingin sa normal na iskedyul. Walang nai-publish mula sa isang bahagyang tugon.',

  /* ----------------------------------------------------------------------
     What Relay refuses to automate
     ---------------------------------------------------------------------- */
  'automation.refuse.title': 'Hindi available sa anumang panuntunan',
  'automation.refuse.body':
    'Ang mga awtomatikong pag-like at pagsubaybay, mga pangkat ng pakikipag-ugnayan, mga hindi hinihinging tugon at mensahe, at pag-post ng parehong nilalaman mula sa ilang mga account upang magmukhang sikat ay hindi mga opsyon dito. Ipinagbabawal sila ng mga platform at sinisira nila ang mga account na gumagamit sa kanila.',
  'automation.refuse.readPolicy': 'Basahin ang patakaran sa katanggap-tanggap na paggamit',
} as const;
