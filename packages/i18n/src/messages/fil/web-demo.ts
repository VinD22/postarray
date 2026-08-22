/**
 * The in-page product demonstration: the hero demonstration on the home page
 * and the guided walkthrough at `/demo`.
 *
 * Rules that bind this file specifically:
 *
 *  - Every panel on those surfaces is built from the real design system, so a
 *    reader is looking at the interface rather than at a drawing of it. The
 *    copy must therefore never describe something the interface does not do.
 *  - The content is sample content for a company that does not exist, and it
 *    says so in words, in the caption a screen reader reads with the figure.
 *  - No number here is an engagement number. There is no follower count, no
 *    reach figure and no score, because the product has no such data and a
 *    demonstration that invents one is a fabricated dashboard.
 *  - Nothing publishes today. No connector has passed provider verification,
 *    so the demonstration stops at the point the product stops: a scheduled
 *    post, an approval, and a receipt whose publishing half is unavailable.
 *  - The demonstration submits nothing. It has no form, no destination and no
 *    account behind it, and the copy must not suggest otherwise.
 */
export const webDemoMessages = {
  /* ---------------------------------------------------------------------- */
  /* Metadata and navigation                                                 */
  /* ---------------------------------------------------------------------- */

  'web.meta.demo.title': 'Tingnan kung paano gumagana ang Relay',
  'web.meta.demo.description':
    'Isang guided tour ng publishing workflow, mula sa isang bagong project hanggang sa resibo, ipinapakita sa totoong interface na may sample content. Wala pang na-publish, at sinasabi ng tour kung nasaan ang linyang iyon.',

  'web.demo.nav.label': 'Tingnan itong gumagana',
  'web.demo.nav.summary':
    'Isang guided tour ng produkto ayon sa pagkakasunod-sunod ng makikilala mo ito, ginawa mula sa totoong interface na may sample content.',

  /* ---------------------------------------------------------------------- */
  /* The frame every demonstration panel sits in                             */
  /* ---------------------------------------------------------------------- */

  'web.demo.frame.badge': 'Demonstrasyon',
  'web.demo.frame.sample':
    'Isang demonstrasyong ginawa mula sa totoong interface, puno ng sample content para sa isang kumpanyang hindi umiiral. Hindi live na account. Wala ritong nagsu-submit ng anuman.',

  'web.demo.control.pause': 'I-pause ang demonstrasyon',
  'web.demo.control.play': 'I-play ang demonstrasyon',
  'web.demo.control.replay': 'I-replay ang demonstrasyon',

  /* ---------------------------------------------------------------------- */
  /* The home page hero demonstration                                        */
  /* ---------------------------------------------------------------------- */

  'web.demo.hero.caption':
    'Isang draft ay nagiging isang bersyon kada platform, nabibigyan ng oras, at napupunta sa linggo. Sample content, hindi live na account.',
  'web.demo.hero.more': 'Dumaan sa buong workflow',

  /* ---------------------------------------------------------------------- */
  /* The walkthrough page                                                    */
  /* ---------------------------------------------------------------------- */

  'web.demo.title': 'Paano ito gumagana, sa pagkakasunod-sunod ng makikilala mo ito',
  'web.demo.lede':
    'Siyam na hakbang, mula sa isang walang laman na workspace hanggang sa record ng nangyari. Ipinapakita ng bawat isa ang surface na talagang titingnan mo, may sample content ito. Walang gumagalaw sa page na ito nang mag-isa, kaya mababasa mo ito sa sarili mong bilis.',
  'web.demo.notice.title': 'Isa itong demonstrasyon, hindi live na account',
  'web.demo.notice.body':
    'Ang bawat panel dito ay ang interface ng produkto na may sample content. Wala pang koneksyon na nakumpleto ang provider verification, kaya wala pang na-publish sa anumang platform sa pamamagitan ng produktong ito ngayon. Kung saan humihinto ang workflow, sinasabi ito ng page sa halip na ipinipinta ang natitira.',
  'web.demo.contents.title': 'Ang siyam na hakbang',
  'web.demo.stepLabel': 'Hakbang {position} sa {total}',
  'web.demo.next': 'Susunod: {step}',
  'web.demo.closing.pricing': 'Tingnan ang presyo',
  'web.demo.closing.title': 'Iyan ang buong loop',
  'web.demo.closing.body':
    'Wala sa itaas ang isang mock up ng produktong sana namin gawin. Ito ang interface ayon sa kasalukuyan, na tapat na tinatandaan ang kalahati ng publishing bilang hindi pa tapos.',

  /* ---------------------------------------------------------------------- */
  /* The nine steps                                                          */
  /* ---------------------------------------------------------------------- */

  'web.demo.step.project.title': 'Gumawa ng project',
  'web.demo.step.project.body':
    'Hawak ng isang project ang mga account, draft, pag-apruba, at time zone. Nakasakop ang bawat query sa produkto sa isang project, sa application service at muli sa database, kaya hindi makikita ng isang kliyente ang ibang kliyente nang di-sinasadya.',

  'web.demo.step.connect.title': 'Ikonekta ang isang account',
  'web.demo.step.connect.body':
    'Dumadaan lang ang pagkonekta sa mga opisyal na platform API, at sinasabi nito sa iyo kung ano ang kinakailangan ng platform sa account bago ka magsimula. Ngayon, humihinto ang bawat koneksyon sa verification, kaya sinasabi ito ng bawat row sa ibaba sa halip na magpakita ng berdeng tsek.',

  'web.demo.step.compose.title': 'Isulat nang isang beses, i-adapt kada platform',
  'web.demo.step.compose.body':
    'Sumusulat ka ng pangunahing draft. Ang pagpili ng isang account ay nagbubukas ng override para lang sa account na iyon, may sariling limitasyon at sariling preview. Walang isinusulat mo para sa LinkedIn na nagbabago sa natatanggap ng X, at tumatakbo ang mga check sa ilalim ng bawat bersyon bago ma-iskedyul ang anuman.',

  'web.demo.step.variants.title': 'Tingnan kung ano talaga ang natatanggap ng bawat account',
  'web.demo.step.variants.body':
    'Ang isang draft ay nagiging isang bersyon kada account, ang bawat isa ay isinulat para sa platform kung saan ito napupunta: mas maikling linya para sa X, ang buong release note para sa LinkedIn, isang caption at alt text para sa Instagram. Nae-edit mo ang alinman sa mga ito nang hindi ginagalaw ang iba, at dala ng bawat bersyon ang check na naaangkop dito.',

  'web.demo.step.schedule.title': 'Bigyan ito ng oras, o ibigay sa queue',
  'web.demo.step.schedule.body':
    'Isang instant kasama ang time zone ng project ang naka-store bilang oras, hindi kailanman isang plain na lokal na oras, kaya walang gumagalaw sa ilalim mo kapag may pagbabago ng daylight saving. Ang queue ang ibang ruta: kinukuha nito ang susunod na slot na pinapayagan ng mga panuntunang itinakda mo.',

  'web.demo.step.calendar.title': 'Panoorin ang kalendaryo',
  'web.demo.step.calendar.body':
    'Ipinapakita ng linggo ang platform, account, katayuan, at oras ng bawat post. Ang paglipat ng isa ay parehong isang button at isang drag, kaya ganap na magagamit ang kalendaryo mula sa keyboard.',

  'web.demo.step.receipt.title': 'Basahin ang resibo pagkatapos',
  'web.demo.step.receipt.body':
    'Nagsusulat ang bawat pagsubok ng isang hindi mababagong resibo: sino ang sumulat nito, sino ang nag-aprubang nito, sa ilalim ng aling patakaran, sa aling instant. Ang kalahati ng publishing ng record na iyon ay isinusulat ng publish run, na siyang parte na hindi pa umiiral.',

  /* ---------------------------------------------------------------------- */
  /* Panel labels                                                            */
  /* ---------------------------------------------------------------------- */

  'web.demo.project.label': 'Proyekto',
  'web.demo.project.zone': 'Time zone: {zone}',
  'web.demo.project.scope':
    'Ang mga draft, account, pag-apruba, at resibo ay pag-aari ng project na ito at wala nang iba.',

  'web.demo.accounts.label': 'Mga account sa project na ito',
  'web.demo.accounts.state': 'Hindi pa kumpleto ang verification',
  'web.demo.accounts.note':
    'Dadalhin ng bawat row ang kalusugan ng token, ang mga permisong ipinagkaloob, at ang huling matagumpay na post. Wala sa mga iyon ang makapagpu-publish ngayon.',

  'web.demo.master.label': 'Pangunahing draft',
  'web.demo.master.project': 'Sa project na {project}',

  'web.demo.variants.label': 'Ang natatanggap ng bawat account',

  'web.demo.schedule.label': 'Naka-iskedyul',
  'web.demo.schedule.value': '{when} sa {zone}',
  'web.demo.schedule.approval': 'Kailangan ng isang pag-apruba bago maipadala ang anuman.',
  'web.demo.schedule.queue':
    'Ang queue ang ibang ruta: pinipili nito ang susunod na slot na pinapayagan ng mga panuntunan mo, sa time zone na ito.',

  'web.demo.week.label': 'Ang linggo',
  'web.demo.week.caption':
    'Ang parehong tatlong post sa kalendaryo, binasa sa time zone ng project.',
  'web.demo.week.empty': 'Walang naka-iskedyul',

  'web.demo.receipt.label': 'Resibo sa ngayon',
  'web.demo.receipt.pending':
    'Ang ipinadala, ang sinagot ng platform, ang external post ID, at ang permalink ay isinusulat ng publish run. Mananatiling hindi available ang mga ito hanggang makapasa ang isang koneksyon sa provider verification.',
  'web.demo.receipt.field.externalId': 'Panlabas na post ID',
  'web.demo.receipt.field.permalink': 'Permalink',

  /* ---------------------------------------------------------------------- */
  /* Sample content                                                          */
  /*                                                                         */
  /* Northbound Tools is the sample company the marketing pages already use.  */
  /* Its handles sit on the reserved `.example` domain and its people are     */
  /* first names with no surname, so nothing here can be mistaken for a real  */
  /* customer, a real account or a real endorsement.                          */
  /* ---------------------------------------------------------------------- */

  'web.demo.sample.project': 'Northbound Tools (sample)',
  'web.demo.sample.actor': 'Ada, sample na kasamahan',
  'web.demo.sample.approver': 'Ravi, sample na reviewer',
  'web.demo.sample.policy': 'Isang pag-apruba bago maipadala',
  'web.demo.sample.master':
    'Inilunsad ngayon ang Northbound 2.4. Mas mabilis na ang mga import, may keyboard shortcut na ang search, at naayos na ang export bug na iniulat ng dalawa sa inyo.',

  'web.demo.sample.x.account': 'X, @northbound',
  'web.demo.sample.x.body':
    'Inilunsad na ang Northbound 2.4. Mas mabilis na import, keyboard search, at naayos na ang export bug na iyon.',
  'web.demo.sample.x.check': 'Bilang ng character at pagkakasunod-sunod ng thread',

  'web.demo.sample.linkedin.account': 'LinkedIn, Northbound Tools',
  'web.demo.sample.linkedin.body':
    'Inilunsad ngayon ang Northbound 2.4. Ipinapaliwanag nang buo ng release note ang mga pagbabago sa import at ang ayos sa export.',
  'web.demo.sample.linkedin.check': 'Papel ng organisasyon at haba ng post',

  'web.demo.sample.instagram.account': 'Instagram, @northbound.tools',
  'web.demo.sample.instagram.body':
    'Ang parehong larawan ng paglulunsad, may caption na isinulat para sa feed at alt text na isinulat ng isang tao.',
  'web.demo.sample.instagram.check': 'Uri ng account, aspect ratio, at alt text',

  /* ---------------------------------------------------------------------- */
  /* The nine scene product tour                                             */
  /*                                                                         */
  /* The step names are the indicator's button labels, so they are short      */
  /* enough to sit in a row of nine and specific enough to be worth clicking. */
  /* They are also the labels of the stacked walkthrough a reader gets with   */
  /* reduced motion or no JavaScript, which is the same tour with the timing  */
  /* taken out rather than a reduced version of it.                           */
  /* ---------------------------------------------------------------------- */

  'web.demo.tour.stepsLabel': 'Mga hakbang ng tour',
  'web.demo.tour.jump': 'Ipakita ang hakbang {position}: {step}',
  'web.demo.tour.step.project': 'Gumawa ng project',
  'web.demo.tour.step.connect': 'Ikonekta ang mga account',
  'web.demo.tour.step.compose': 'Mag-compose nang isang beses',
  'web.demo.tour.step.variants': 'I-adapt kada platform',
  'web.demo.tour.step.validate': 'I-check ito',
  'web.demo.tour.step.schedule': 'Bigyan ito ng oras',
  'web.demo.tour.step.week': 'Tingnan ang linggo',
  'web.demo.tour.step.publish': 'I-publish at itala',
  'web.demo.tour.step.digest': 'Basahin ang digest',

  /* ---------------------------------------------------------------------- */
  /* Checks (step 5)                                                         */
  /*                                                                         */
  /* Only checks the composer genuinely runs today: the per account character */
  /* limit (`validation.text_too_long`), alt text on every image             */
  /* (`validation.alt_text_missing`), and whether a first comment is allowed  */
  /* on the account it was written for (the `firstComment` capability).       */
  /* ---------------------------------------------------------------------- */

  'web.demo.validate.label': 'Mga check bago mag-iskedyul',
  'web.demo.validate.check.length': 'Limitasyon ng character, kada account',
  'web.demo.validate.check.lengthDetail':
    'Sinusukat ang bawat bersyon laban sa limitasyong ibinibigay ng platform sa account na iyon.',
  'web.demo.validate.check.altText': 'Alt text sa bawat larawan',
  'web.demo.validate.check.altTextDetail':
    'Isang larawan na walang deskripsyon, o hindi minarkang dekorasyon, ay pumipigil sa iskedyul.',
  'web.demo.validate.check.firstComment': 'Pinapayagan dito ang unang komento',
  'web.demo.validate.check.firstCommentDetail':
    'Inaalok lang ang unang komento sa mga account na sinusuportahan ito ng platform nila.',
  'web.demo.validate.note':
    'Tumatakbo ang mga ito sa composer bago ma-iskedyul ang anuman, at muli bago maipadala ang anuman.',

  /* ---------------------------------------------------------------------- */
  /* Publish and receipt (step 8)                                            */
  /*                                                                         */
  /* The steps a scheduled post has really passed are completed. Everything   */
  /* the publish run would write is pending, because no connector has passed  */
  /* provider verification, so there is no publish run to write it.           */
  /* ---------------------------------------------------------------------- */

  'web.demo.live.label': 'Pag-publish at ang record nito',
  'web.demo.live.step.approved': 'Inaprubahan ni {approver}',
  'web.demo.live.step.queued': 'Naka-queue para sa slot nito',
  'web.demo.live.step.sent': 'Naipadala sa platform',
  'web.demo.live.step.confirmed': 'Kinumpirma ng platform',
  'web.demo.live.badge.pending': 'Hindi pa na-publish',
  'web.demo.live.badge.live': 'Naka-live',
  'web.demo.live.pending':
    'Isinusulat ng publish run ang huling dalawang hakbang. Wala pang koneksyon na nakumpleto ang provider verification, kaya nananatili itong nakabinbin at ang external post ID at permalink ay nananatiling hindi available.',

  /* ---------------------------------------------------------------------- */
  /* The weekly digest (step 9)                                              */
  /*                                                                         */
  /* Sentences about what the product did, never engagement figures. There is */
  /* no reach, no impression count and no score here, because the product has */
  /* none to read and a digest that invented one would be a fabricated        */
  /* dashboard with a friendlier voice.                                       */
  /* ---------------------------------------------------------------------- */

  'web.demo.digest.label': 'Ang linggo mo, sa mga pangungusap',
  'web.demo.digest.sample': 'Halimbawa',
  'web.demo.digest.line.variants':
    'May tatlong bersyong platform-native na naipadala mula sa isang draft ngayong linggo.',
  'web.demo.digest.line.earliest': 'Umaga ng Martes ang pinakamaagang slot mo.',
  'web.demo.digest.line.approval': 'Naaprubahan ang bawat bersyon bago ito na-queue.',
  'web.demo.digest.line.alt': 'Dala ng bawat larawan ang alt text na isinulat ng isang tao.',
  'web.demo.digest.footer': 'Lalabas dito ang live analytics kapag na-publish na ang mga post mo.',

  /* ---------------------------------------------------------------------- */
  /* The three added walkthrough steps                                       */
  /* ---------------------------------------------------------------------- */

  'web.demo.step.validate.title': 'I-check ito bago ito ma-iskedyul',
  'web.demo.step.validate.body':
    'Sinusukat ng composer ang bawat bersyon laban sa account na isinulat ito para rito: ang limitasyon ng character na talagang mayroon ang account na iyon, alt text sa bawat larawan, at kung nag-aalok ba ang platform ng unang komento. Hindi ma-i-iskedyul ang isang bersyong hindi pumasa sa isang check.',

  'web.demo.step.publish.title': 'I-publish, at panatilihin ang record',
  'web.demo.step.publish.body':
    'Ipinapadala ng publish run ang bawat bersyon sa instant nito, itinatala kung ano ang sinagot ng platform, at isinusulat ang isang hindi mababagong resibo. Ang run na iyon ang parteng hindi pa umiiral, kaya nakabinbin ang huling dalawang hakbang sa ibaba sa halip na iginuhit bilang tapos na.',

  'web.demo.step.digest.title': 'Basahin ang lingguhang digest',
  'web.demo.step.digest.body':
    'Inilalarawan ng digest kung ano ang ginawa ng produkto sa mga pangungusap: ilang bersyon ang naipadala mula sa isang draft, aling slot ang pinakamaaga, ano ang inaprubahan. Wala itong dalang engagement figure, dahil galing sa mga platform ang analytics pagkatapos mag-publish ng isang post at wala pang na-publish.',
} as const;
