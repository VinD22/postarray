/**
 * The free tools on the public site.
 *
 * These pages exist because this repository already knows every launch cohort
 * platform's real publishing limits from its connector capability code. A tool
 * here may therefore state a number, but only a number the generated dataset
 * carries, always beside the official source and the date a person read it.
 *
 * Rules that bind this file specifically:
 *
 *  - A tool never claims the product publishes anywhere. Nothing in the launch
 *    cohort is verified for production yet, and these pages say so.
 *  - Every calculation described here runs in the reader's browser. Copy that
 *    promises privacy must stay true of the component that renders it.
 *  - No tool writes, rewrites, suggests or scores content. No tool looks up a
 *    handle, a follower count or anything else that would need an unofficial
 *    endpoint.
 *  - A limit we do not have is "unavailable". Never zero, never a guess.
 */
export const webToolsMessages = {
  /* ---------------------------------------------------------------------- */
  /* Metadata                                                                */
  /* ---------------------------------------------------------------------- */

  'web.meta.tools.title': 'Mga libreng tool sa publishing',
  'web.meta.tools.description':
    'Maliliit at pribadong tool para sa mga taong nagpu-publish sa maraming platform: pag-check ng limitasyon kada platform, UTM link builder, pag-check ng haba ng pamagat sa YouTube, at time zone planner.',
  'web.meta.tools.preflight.title': 'Tagasuri ng post bago mag-publish',
  'web.meta.tools.preflight.description':
    'I-check ang isang draft laban sa mga limitasyon ng teksto at media ng sampung platform, kasama ang source at petsa ng pagbasa ng bawat limitasyon.',
  'web.meta.tools.utm.title': 'Panggawa ng UTM link',
  'web.meta.tools.utm.description':
    'Gumawa ng naka-tag na campaign URL at tingnan ang ibig sabihin ng bawat UTM parameter. Tumatakbo nang buo sa browser mo.',
  'web.meta.tools.youtubeTitle.title': 'Tagasuri ng haba ng pamagat sa YouTube',
  'web.meta.tools.youtubeTitle.description':
    'Sukatin ang isang pamagat sa YouTube laban sa naka-dokumentong ceiling, binibilang sa paraang binibilang ng isang tao ang mga character.',
  'web.meta.tools.timeZone.title': 'Time zone at daylight saving planner',
  'web.meta.tools.timeZone.description':
    'Tingnan ang isang oras ng pag-post sa maraming time zone ng audience at hanapin ang mga linggong lumilipat ang lokal na oras dahil sa daylight saving.',
  'web.meta.tools.engagementRate.title': 'Kalkulator ng engagement rate',
  'web.meta.tools.engagementRate.description':
    'Hatiin ang interactions sa reach, followers, o impressions. Tatlong simpleng kalkulasyon, walang gawa-gawang benchmark.',

  /* ---------------------------------------------------------------------- */
  /* Shared tool furniture                                                   */
  /* ---------------------------------------------------------------------- */

  'web.tools.index.title': 'Mga libreng tool',
  'web.tools.index.summary':
    'Maliliit na calculator na nakabatay sa parehong data ng limitasyon ng platform na binabasa ng mga koneksyon namin.',
  'web.tools.index.lede':
    'Apat na maliliit na tool, nakabatay sa parehong data ng limitasyon ng platform na ginagamit ng mga koneksyon namin. Walang account, walang upload, walang pag-track ng in-type mo.',
  'web.tools.index.dataTitle': 'Saan galing ang mga numero',
  'web.tools.index.dataBody':
    'Nagagawa ang bawat limitasyon mula sa connector capability code sa repository na ito, at dala ng bawat row ng platform ang opisyal na dokumentasyon page na pinagmulan nito at ang petsang binasa iyon ng isang tao.',
  'web.tools.index.honesty':
    'Wala itong ini-publish na anuman ang mga tool na ito. Wala pang koneksyon na nakumpleto ang provider verification, kaya wala pang kumokonekta ng account dito.',
  'web.tools.shared.privacyTitle': 'Tumatakbo ito sa browser mo',
  'web.tools.shared.privacyBody':
    'Nananatili sa page na ito ang lahat ng in-type mo. Walang request sa isang server, walang storage, at walang analytics event na dala ang teksto mo.',
  'web.tools.shared.sourceLink': 'Dokumentasyon ng platform',
  'web.tools.shared.sourceRead': 'Nabasa noong {date}',
  'web.tools.shared.unavailable': 'hindi available',
  'web.tools.shared.unavailableWhy':
    'Wala pa kaming koneksyon para sa platform na ito, kaya wala kaming na-verify na limitasyon na ipapakita. Mas gusto naming walang sabihin kaysa manghula.',
  'web.tools.shared.copy': 'Kopyahin',
  'web.tools.shared.copied': 'Nakopya',
  'web.tools.shared.copyFailed':
    'Hinarang ng browser mo ang pagkopya. Piliin ang teksto at kopyahin ito.',
  'web.tools.shared.faqTitle': 'Mga tanong',
  'web.tools.shared.baselineTitle': 'Aling account ang inilalarawan ng mga numerong ito',
  'web.tools.shared.baselineBody':
    'Ang pinaka-maingat na kaso: isang bagong konektadong account na walang elevated eligibility. Itinataas ng ilang platform ang isang ceiling kapag na-verify na ang isang channel o negosyo, at sinasabi ito ng page kung saan nangyayari iyon.',
  'web.tools.shared.otherTools': 'Ibang tool',

  /* ---------------------------------------------------------------------- */
  /* Tool names and one line summaries, shared by the index and the footer   */
  /* ---------------------------------------------------------------------- */

  'web.tools.preflight.name': 'Tagasuri ng post bago mag-publish',
  'web.tools.preflight.summary':
    'Isang draft, chine-check laban sa mga limitasyon ng teksto at media ng sampung platform nang sabay.',
  'web.tools.utm.name': 'Panggawa ng UTM link',
  'web.tools.utm.summary':
    'Gumawa ng naka-tag na campaign URL nang hindi sinisira ang query string na dati na roon.',
  'web.tools.youtubeTitle.name': 'Tagasuri ng haba ng pamagat sa YouTube',
  'web.tools.youtubeTitle.summary':
    'Sukatin ang isang pamagat sa paraang binibilang ng isang tao ang mga character.',
  'web.tools.timeZone.name': 'Time zone at daylight saving planner',
  'web.tools.timeZone.summary':
    'Isang oras ng pag-post sa maraming time zone ng audience, may markang lugar ang mga daylight saving shift.',
  'web.tools.engagementRate.name': 'Kalkulator ng engagement rate',
  'web.tools.engagementRate.summary':
    'Interactions na hinati sa reach, followers, o impressions. Walang hinanap, walang binenchmark.',

  /* ---------------------------------------------------------------------- */
  /* Post preflight checker                                                  */
  /* ---------------------------------------------------------------------- */

  'web.tools.preflight.title': 'Tagasuri ng post bago mag-publish',
  'web.tools.preflight.lede':
    'I-paste ang isang draft, piliin ang mga platform kung saan ka nagpu-post, at tingnan kung alin ang tatanggi bago mo pa ito malaman mula sa isang API error.',
  'web.tools.preflight.explainer.title': 'Bakit hindi sapat ang character counter lang',
  'web.tools.preflight.explainer.body':
    'Hindi sang-ayon ang mga platform sa kung ano ang isang character. Binibilang ng ilan ang code unit, kaya ang isang emoji ay may halagang dalawa. Binibilang ng ilan ang grapheme, kaya ang isang flag o family emoji ay may halagang isa. Isinusulat ulit ng ilan ang bawat link sa isang fixed width, kaya ang 200 character na URL ay may halagang pareho sa isang 20 character na URL. Ina-apply ng tool na ito ang bawat panuntunan ng platform nang hiwalay.',
  'web.tools.preflight.explainer.counting':
    'Sinusukat ang draft gamit ang Intl segmenter ng browser, na naghahati sa teksto sa mga unit na tatawagin ng isang mambabasa na mga character, saka in-a-adjust ayon sa panuntunan ng platform.',
  'web.tools.preflight.field.draft.label': 'Ang draft mo',
  'web.tools.preflight.field.draft.help':
    'I-paste ang katawan ng post. Awtomatikong nadedetect ang mga link para mai-apply ang gastos nila kada platform.',
  'web.tools.preflight.field.platforms.label': 'Mga platform na che-checkin',
  'web.tools.preflight.field.platforms.help': 'Piliin kasing dami ng saanman ka nagpu-post.',
  'web.tools.preflight.field.mediaKind.label': 'Naka-attach na media',
  'web.tools.preflight.field.mediaKind.none': 'Walang media',
  'web.tools.preflight.field.mediaKind.image': 'Mga larawan',
  'web.tools.preflight.field.mediaKind.video': 'Isang video',
  'web.tools.preflight.field.mediaCount.label': 'Ilang larawan',
  'web.tools.preflight.field.byteSize.label': 'Laki ng file, sa megabyte',
  'web.tools.preflight.field.byteSize.help':
    'Ang pinakamalaking single file. Iwanang blangko para laktawan.',
  'web.tools.preflight.field.duration.label': 'Haba ng video, sa segundo',
  'web.tools.preflight.field.duration.help':
    'Iwanang blangko para laktawan ang pag-check ng duration.',
  'web.tools.preflight.field.width.label': 'Lapad ng media, sa pixel',
  'web.tools.preflight.field.height.label': 'Taas ng media, sa pixel',
  'web.tools.preflight.field.dimensions.help':
    'Opsyonal. Ginagamit lang para ipakita ang aspect ratio na ipu-publish mo.',
  'web.tools.preflight.results.title': 'Resulta kada platform',
  'web.tools.preflight.results.empty': 'Pumili ng kahit isang platform para makita ang resulta.',
  'web.tools.preflight.results.summary':
    '{fail, plural, =0 {Walang humaharang} other {# na tatanggi}}, {warning, plural, =0 {walang babala} other {# na dapat tingnan}}.',
  'web.tools.preflight.status.pass': 'Kasya',
  'web.tools.preflight.status.warning': 'Dapat tingnan',
  'web.tools.preflight.status.fail': 'Tatanggi',
  'web.tools.preflight.status.unavailable': 'Hindi available',
  'web.tools.preflight.count.label':
    '{count} sa {limit} {unit, select, grapheme {character} utf16 {code unit} weighted {weighted character} other {character}}',
  'web.tools.preflight.finding.textOver':
    'Lampas sa limitasyon nang {over, plural, one {# character} other {# character}}.',
  'web.tools.preflight.finding.textNear': 'May {remaining} character na lang bago sa limitasyon.',
  'web.tools.preflight.finding.textFits': 'Kasya ang katawan.',
  'web.tools.preflight.finding.linkFixed':
    'Isinusulat ulit ang bawat link sa fixed width, kaya may halagang {cost} character ang bawat isa anuman ang totoong haba nito.',
  'web.tools.preflight.finding.linkActual':
    'May halaga ang mga link na eksaktong bilang ng character na sinasakop nila.',
  'web.tools.preflight.finding.imagesOver':
    'Tumatanggap ang platform na ito ng {limit, plural, =0 {walang larawan} other {# larawan}} sa isang post.',
  'web.tools.preflight.finding.videosOver':
    'Tumatanggap ang platform na ito ng {limit, plural, =0 {walang video} other {# video}} sa isang post.',
  'web.tools.preflight.finding.bytesOver': 'Mas malaki ang file kaysa sa ceiling na {limit}.',
  'web.tools.preflight.finding.bytesUnknown':
    'Walang na-publish na byte ceiling para sa uri ng media na ito, kaya hindi na-check ang laki.',
  'web.tools.preflight.finding.durationOver': 'Mas mahaba kaysa sa {limit} segundong ceiling.',
  'web.tools.preflight.finding.durationUnder': 'Mas maikli kaysa sa {limit} segundong minimum.',
  'web.tools.preflight.finding.durationUnknown':
    'Walang na-publish na duration ceiling, kaya hindi na-check ang haba.',
  'web.tools.preflight.finding.altText':
    'Tinatanggap ang alt text hanggang {limit} character, na sulit gamitin.',
  'web.tools.preflight.finding.ratio':
    'Mag-pu-publish ka sa halagang humigit-kumulang {ratio} sa 1.',
  'web.tools.preflight.faq.counting.q': 'Paano mo binibilang ang mga character?',
  'web.tools.preflight.faq.counting.a':
    'Sa grapheme, gamit ang Intl segmenter ng browser, na siyang unit na ibig sabihin ng isang mambabasa sa isang character. Kung saan nagdodokumento ang isang platform ng ibang panuntunan, tulad ng pagbilang ng code unit o pagsingil ng fixed width kada link, ina-apply iyon sa ibabaw nito.',
  'web.tools.preflight.faq.accuracy.q': 'Gaano ka-updated ang mga limitasyong ito?',
  'web.tools.preflight.faq.accuracy.a':
    'Nagagawa ang bawat limitasyon mula sa connector code sa repository namin sa halip na na-type sa isang page, at ipinapakita ng bawat row ng platform ang opisyal na dokumentong pinagmulan nito at ang petsang binasa iyon ng isang tao. Kung nagbago ang isang platform ng numero, isang code change lang ang ayos at sinusunod ito ng bawat tool dito.',
  'web.tools.preflight.faq.privacy.q': 'Ina-upload ba ang draft ko?',
  'web.tools.preflight.faq.privacy.a':
    'Hindi. Tumatakbo ang pag-check sa browser mo. Walang request na may dalang teksto mo, walang naitatago, at sapat na ang pagsara ng tab para itapon ito.',
  'web.tools.preflight.faq.publish.q': 'Puwede ba akong i-post ng tool na ito?',
  'web.tools.preflight.faq.publish.a':
    'Hindi pa ngayon. Wala pang koneksyon na nakumpleto ang provider verification, kaya wala pang nagpu-publish sa isang platform sa site na ito. Isang pag-check ng limitasyon ang page na ito, hindi isang composer.',

  /* ---------------------------------------------------------------------- */
  /* UTM builder                                                             */
  /* ---------------------------------------------------------------------- */

  'web.tools.utm.title': 'Panggawa ng UTM link',
  'web.tools.utm.lede':
    'Magdagdag ng mga campaign parameter sa isang URL nang hindi nawawala ang query string na dati na roon, at nang hindi humuhula kung ano ang ibig sabihin ng bawat parameter.',
  'web.tools.utm.explainer.title': 'Para saan ang bawat parameter',
  'web.tools.utm.explainer.body':
    'Binabasa ang mga UTM parameter ng mga analytics tool, hindi ng platform kung saan ka nagpu-post. Nagbibiyahe ang mga ito sa URL, kaya nakikita rin ang mga ito ng sinumang nakakakita sa link. Panatilihin itong maikli, maliit na letra, at pare-pareho, dahil ang dalawang spelling ng parehong campaign ay nagiging dalawang row sa isang report.',
  'web.tools.utm.field.url.label': 'URL ng destinasyon',
  'web.tools.utm.field.url.help': 'Ang page na gusto mong marating ng mga tao, kasama ang https.',
  'web.tools.utm.field.url.invalid': 'Hindi iyon nagpa-parse bilang isang http o https na URL.',
  'web.tools.utm.field.source.label': 'Pinagmulan ng campaign',
  'web.tools.utm.field.source.help': 'Saan galing ang click. Halimbawa isang pangalan ng platform.',
  'web.tools.utm.field.medium.label': 'Medium ng campaign',
  'web.tools.utm.field.medium.help': 'Ang uri ng link. Halimbawa social, email, o referral.',
  'web.tools.utm.field.campaign.label': 'Pangalan ng campaign',
  'web.tools.utm.field.campaign.help': 'Ang launch, promosyon, o tema na pag-aari ng link na ito.',
  'web.tools.utm.field.term.label': 'Termino ng campaign',
  'web.tools.utm.field.term.help': 'Opsyonal. Tradisyunal na ang paid keyword.',
  'web.tools.utm.field.content.label': 'Content ng campaign',
  'web.tools.utm.field.content.help':
    'Opsyonal. Nagpapaiba ng dalawang link papunta sa parehong page, halimbawa dalawang bersyon ng isang post.',
  'web.tools.utm.result.title': 'Ang naka-tag mong URL',
  'web.tools.utm.result.empty': 'Maglagay ng destination URL para makita ang resulta.',
  'web.tools.utm.result.label': 'Ginawang URL',
  'web.tools.utm.result.preserved':
    'Pananatilihin ang query string na dati nang nasa URL mo nang eksaktong kagaya ng in-type mo.',
  'web.tools.utm.result.replaced':
    'May isa na sa mga parameter na ito ang URL mo. Papalitan ito ng value na inilagay mo dito.',
  'web.tools.utm.faq.encoding.q': 'Ano ang nangyayari sa mga space at accent?',
  'web.tools.utm.faq.encoding.a':
    'Naka-percent encode ang mga ito, na siyang nagpapa-survive sa isang link kapag na-paste ito sa isang post. Ang isang space ay nagiging plus sign at ang isang letrang may accent ay nagiging naka-encode na anyo nito, at dine-decode iyong dalawa ng mga analytics tool.',
  'web.tools.utm.faq.existing.q': 'Sisirain ba nito ang URL na may parameter na?',
  'web.tools.utm.faq.existing.a':
    'Hindi. Pinapanatili ang mga umiiral nang parameter sa orihinal na pagkakasunod-sunod, at isang UTM parameter na pinunan mo lang ang idaragdag o papalitan. Nananatili sa dulo ang isang fragment sa dulo ng URL.',
  'web.tools.utm.faq.privacy.q': 'Ipinapadala ba kung saan ang URL ko?',
  'web.tools.utm.faq.privacy.a':
    'Hindi. Ginagawa ang URL sa browser mo at hindi kailanman umaalis sa page na ito.',

  /* ---------------------------------------------------------------------- */
  /* YouTube title length checker                                            */
  /* ---------------------------------------------------------------------- */

  'web.tools.youtubeTitle.title': 'Tagasuri ng haba ng pamagat sa YouTube',
  'web.tools.youtubeTitle.lede':
    'Tinatanggihan sa upload ang isang pamagat na isang character lang ang sobra. Ang isang pamagat na matagal lang ay pinuputol sa isang lugar na hindi mo pinili.',
  'web.tools.youtubeTitle.explainer.title': 'Dalawang magkaibang limitasyon',
  'web.tools.youtubeTitle.explainer.body':
    'Ang hard ceiling ay ang tinatanggap ng upload endpoint. Ang saan ipinapakita ang isang pamagat ay ibang tanong: naiiba ang punto ng pagputol ng isang search result, sidebar, at telepono, at wala sa mga puntong iyon ang na-publish. Sinasabi ng tool na ito ang naka-dokumentong ceiling at ipinapakita ang hugis ng pamagat mo, at hindi ito gumagawa ng gawa-gawang truncation number.',
  'web.tools.youtubeTitle.field.title.label': 'Pamagat ng video',
  'web.tools.youtubeTitle.field.title.help':
    'Binibilang bawat grapheme, kaya may halagang isa ang isang emoji.',
  'web.tools.youtubeTitle.result.count': '{count} sa {limit} character',
  'web.tools.youtubeTitle.result.over':
    'Sobra nang {over, plural, one {# character} other {# character}}. Tatanggihan ang upload.',
  'web.tools.youtubeTitle.result.fits': 'Nasa loob ng naka-dokumentong ceiling.',
  'web.tools.youtubeTitle.result.front':
    'Ang unang {count} character ang may pinakamalaking timbang, dahil iyon ang halos katumbas ng espasyo ng isang makipot na layout. Nagsisimula ang sa iyo: {preview}',
  'web.tools.youtubeTitle.result.unavailable':
    'Hindi available ang limitasyon ng pamagat sa build na ito, kaya walang chine-check dito.',
  'web.tools.youtubeTitle.faq.limit.q': 'Saan galing ang limitasyong ito?',
  'web.tools.youtubeTitle.faq.limit.a':
    'Mula sa opisyal na videos insert reference, nagawa sa page na ito mula sa parehong connector code na gagamitin sana ng uploader namin. Ang petsang huling binasa ng isang tao ang page na iyon ay ipinapakita sa tabi ng numero.',
  'web.tools.youtubeTitle.faq.truncation.q': 'Saan talaga pinuputol ng YouTube ang isang pamagat?',
  'web.tools.youtubeTitle.faq.truncation.a':
    'Nakadepende ito sa surface at viewport, at hindi nag-publish ang YouTube ng character count para dito. Ipinapakita namin ang ceiling, na naka-dokumento, at hindi kami nagpi-print ng cut off number na magiging hula lang.',
  'web.tools.youtubeTitle.faq.emoji.q': 'May halaga bang isang character ang isang emoji?',
  'web.tools.youtubeTitle.faq.emoji.a':
    'Sa counter na ito, oo, dahil binibilang namin ang grapheme. Puwedeng singilin nang mas mataas ng isang platform na nagbibilang ng code unit sa loob ang parehong emoji, kaya ina-apply ng preflight checker ang bawat panuntunan ng platform nang hiwalay.',

  /* ---------------------------------------------------------------------- */
  /* Time zone and daylight saving planner                                   */
  /* ---------------------------------------------------------------------- */

  'web.tools.timeZone.title': 'Time zone at daylight saving planner',
  'web.tools.timeZone.lede':
    'Isang lingguhang slot na mukhang stable sa kalendaryo mo ay lumilipat para sa kalahati ng audience mo dalawang beses sa isang taon. Ipinapakita nito kung saan at kailan.',
  'web.tools.timeZone.explainer.title':
    'Bakit hindi fixed na oras ang isang fixed na lokal na oras',
  'web.tools.timeZone.explainer.body':
    'May kahulugan lang ang isang oras kung may kasamang time zone. Nagbabago ang offset ng mga time zone sa mga petsang naiiba kada bansa, at ang dalawang rehiyong limang oras ang layo sa Enero ay puwedeng apat na oras na lang ang layo sa Abril. Nakakaligtas dito ang isang schedule na naka-store bilang isang instant kasama ang isang zone. Hindi nakakaligtas ang isang schedule na naka-store bilang isang lokal na oras.',
  'web.tools.timeZone.field.date.label': 'Petsa',
  'web.tools.timeZone.field.time.label': 'Oras',
  'web.tools.timeZone.field.zone.label': 'Zone mo',
  'web.tools.timeZone.field.audience.label': 'Mga time zone ng audience',
  'web.tools.timeZone.field.audience.help':
    'Piliin ang mga zone na talagang kinaroroonan ng mga mambabasa mo.',
  'web.tools.timeZone.result.title': 'Ang parehong sandali, sa lahat ng napili mo',
  'web.tools.timeZone.result.empty': 'Pumili ng kahit isang time zone ng audience.',
  'web.tools.timeZone.result.shift':
    'May daylight saving change na mangyayari sa pagitan ng petsang ito at ng parehong weekday apat na linggo ang layo, kaya lumilipat ang lokal na oras.',
  'web.tools.timeZone.result.stable': 'Walang pagbabago ng offset sa susunod na apat na linggo.',
  'web.tools.timeZone.result.later': 'Apat na linggo mula ngayon, {time}.',
  'web.tools.timeZone.result.invalidDate':
    'Maglagay ng petsa at oras para makita ang paghahambing.',
  'web.tools.timeZone.faq.dst.q': 'Saang direksyon lumilipat ang oras?',
  'web.tools.timeZone.faq.dst.a':
    'Nakadepende ito sa zone at direksyon ng pagbabago, kaya ipinapakita ng table ang totoong lokal na oras apat na linggo mula ngayon sa halip na ilarawan ang panuntunan. Binabasa mula sa time zone database ng browser mo ang offset ng bawat zone.',
  'web.tools.timeZone.faq.storage.q':
    'Paano dapat i-store ng isang naka-iskedyul na post ang oras nito?',
  'web.tools.timeZone.faq.storage.a':
    'Bilang isang instant kasama ang IANA zone na pinili ng tao, hindi kailanman bilang isang plain na lokal na oras. Iyon ang ginagawa namin sa loob ng sistema, at iyon ang dahilan kung bakit ang isang post na naka-iskedyul bago ang isang pagbabago ng orasan ay tumatama pa rin sa nilalayong lokal na oras.',

  /* ---------------------------------------------------------------------- */
  /* Engagement rate calculator                                              */
  /* ---------------------------------------------------------------------- */

  'web.tools.engagementRate.title': 'Kalkulator ng engagement rate',
  'web.tools.engagementRate.lede':
    'I-type ang mga numerong ipinapakita na ng sarili mong dashboard. Hinahati nito iyon nang tatlong paraan tapos huminto: walang benchmark, walang "magandang" threshold, walang wala talaga sa amin.',
  'web.tools.engagementRate.explainer.title': 'Bakit tatlong denominator, hindi isa',
  'web.tools.engagementRate.explainer.body':
    'Naiibang tanong ang sinasagot ng reach, followers, at impressions. Sinasabi ng rate by reach kung paano tumugon ang mga taong talagang nakakita sa post. Sinasabi ng rate by followers kung anong bahagi ng audience mo ang nag-engage, na-reach man o hindi ang lahat ng post. Binibilang ng rate by impressions ang bawat view, kasama ang mga ulit. Karaniwang pinagmumulan ng isang mukhang maling engagement number ang paghahambing ng rate na kinalkula sa isang paraan sa rate na kinalkula sa ibang paraan.',
  'web.tools.engagementRate.field.interactions.label': 'Mga interaction',
  'web.tools.engagementRate.field.interactions.help':
    'Mga like, comment, share, at save na pinagsama, mula sa post na sinusukat mo.',
  'web.tools.engagementRate.field.reach.label': 'Reach',
  'web.tools.engagementRate.field.reach.help':
    'Mga account na nakakita sa post nang kahit isang beses.',
  'web.tools.engagementRate.field.followers.label': 'Mga follower',
  'web.tools.engagementRate.field.followers.help': 'Ang laki ng account noong panahon ng post.',
  'web.tools.engagementRate.field.impressions.label': 'Mga impression',
  'web.tools.engagementRate.field.impressions.help':
    'Kabuuang view, kasama ang isang taong nakakita nito nang dalawang beses.',
  'web.tools.engagementRate.result.title': 'Engagement rate, sa tatlong paraan',
  'web.tools.engagementRate.result.empty': 'hindi available',
  'web.tools.engagementRate.result.note':
    'Walang universal na magandang rate para ihambing. Nakadepende ito sa platform, format, laki ng audience, at industriya, at ang anumang solong numerong iniaalok bilang benchmark ay isang hula na naka-costume bilang datos.',
  'web.tools.engagementRate.basis.reach': 'Base sa reach',
  'web.tools.engagementRate.basis.followers': 'Base sa followers',
  'web.tools.engagementRate.basis.impressions': 'Base sa impressions',
  'web.tools.engagementRate.faq.formula.q': 'Ano ang talagang formula?',
  'web.tools.engagementRate.faq.formula.a':
    'Interactions na hinati sa denominator na pinili mo, ipinapakita bilang porsyento. Ang interactions dito ay ibig sabihin like, comment, share, at save na pinagsama; iniuulat ng ilang platform ang mga ito nang hiwalay, kung saan idagdag mo na lang ang mga ito bago i-type ang kabuuan.',
  'web.tools.engagementRate.faq.basis.q': 'Aling denominator ang dapat kong gamitin?',
  'web.tools.engagementRate.faq.basis.a':
    'Alinman ang iniuulat ng platform mo kasabay ng post, para parehong window ng pagsukat ang pinagmulan ng dalawang numero. Hindi patas na paghahambing ang paghahambing ng isang rate by reach sa isang post laban sa isang rate by followers sa iba, kahit tinatawag pareho itong engagement rate.',
} as const;
