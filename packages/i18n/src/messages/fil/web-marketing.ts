/**
 * The public marketing site and public documentation surfaces.
 *
 * Rules that bind this file specifically, beyond the catalog rules in
 * `lint.ts`:
 *
 *  - Every claim here is either a product fact we control (price, channel
 *    allowance, surfaces) or a provider fact that carries a source link and a
 *    verification date in the page that renders it. No adjective stands in for
 *    a number.
 *  - Nothing here promises reach, ranking, engagement or "going" anywhere.
 *  - Nothing here describes AI image or AI video generation as a Relay
 *    feature, because it is not one.
 *  - No integration is called official until the provider has approved it. The
 *    connector matrix uses `capability.level.*` from `connections.ts` so the
 *    marketing site and the product cannot drift apart.
 *  - Legal wording that must be drafted by counsel is marked with
 *    `web.legal.counselPending.*` rather than guessed at here.
 */
export const webMarketingMessages = {
  /* ---------------------------------------------------------------------- */
  /* Shared marketing furniture                                              */
  /* ---------------------------------------------------------------------- */

  'web.brand.name': 'Relay',
  'web.brand.tagline': 'Ang multilingguwal na publishing control plane para sa mga tao at ahente.',
  'web.skipToContent': 'Lumaktaw sa pangunahing nilalaman',
  'web.nav.label': 'Pag-navigate sa site',
  'web.nav.openMenu': 'Menu',
  'web.nav.closeMenu': 'Isara ang menu',
  'web.nav.footerLabel': 'Pag-navigate sa footer',

  'web.cta.startTrial': 'Start the 7 day trial',
  'web.cta.seePricing': 'See the price',
  'web.cta.seeCapabilities': 'Basahin ang capability matrix',
  'web.cta.readDocs': 'Basahin ang dokumentasyon',
  'web.cta.trialFootnote':
    'Polar collects a payment method, charges $0 today, and shows the exact first charge date before you confirm.',

  'web.label.lastReviewed': 'Huling nasuri {date}',
  'web.label.nextReview': 'Susunod na pagsusuri {date}',
  'web.label.researchDate': 'Sinaliksik {date}',
  'web.label.officialSource': 'Opisyal na pinagmulan',
  'web.label.onThisPage': 'Sa pahinang ito',
  'web.label.provider': 'Plataporma',
  'web.label.capability': 'Kakayahan',

  'web.notFound.title': 'Walang pahina sa address na ito',
  'web.notFound.body':
    'Maaaring luma na ang link, o itinigil na namin ang page. Ang mga pahinang huminto sa pagiging tumpak ay itinigil sa halip na iwan, at itinatala ito ng changelog kapag nangyari iyon.',
  'web.notFound.action': 'Pumunta sa home page',

  'web.correction.title': 'May nakitang mali sa page na ito',
  'web.correction.body':
    'Nagbabago ang mga panuntunan sa platform at nagkakamali tayo. Ipadala ang URL at kung ano ang hindi tumpak at itatama namin ang pahina o ireretiro ito.',
  'web.correction.email': 'corrections@relay.example',

  /* ---------------------------------------------------------------------- */
  /* Metadata                                                                */
  /* ---------------------------------------------------------------------- */

  'web.meta.home.title': 'Relay, ang multilinggwal na publishing control plane',
  'web.meta.home.description':
    'Gawing platform-native na content ang isang pinagkunan na ideya, aprubahan ito nang isang beses, i-publish ito nang maaasahan sa pamamagitan ng mga opisyal na API ng platform, at alamin kung ano ang susunod na pagbutihin.',
  'web.meta.product.title': 'Paano gumagana ang Relay',
  'web.meta.product.description':
    'Isang paglalakad sa publishing desk: gumawa ng isang beses, iakma bawat platform, patunayan laban sa mga tunay na limitasyon, aprubahan, iiskedyul, i-publish, at panatilihin ang resibo.',
  'web.meta.integrations.title': 'Mga Platform na ini-publish ng Relay sa',
  'web.meta.integrations.description':
    'Aling mga platform ang kinokonekta ng Relay, kung ano ang magagawa ng bawat koneksyon ngayon, at kung ano ang hindi pinapayagan ng platform mismo.',
  'web.meta.capabilities.title': 'Matrix ng kakayahan ng connector',
  'web.meta.capabilities.description':
    'A per platform, per capability table na nabuo mula sa aming mga kahulugan ng connector, na naghihiwalay sa kung ano ang binuo namin mula sa kung ano ang hindi inaalok ng platform.',
  'web.meta.creators.title': 'Relay para sa mga creator',
  'web.meta.creators.description':
    'Para sa mga solo creator na naglalathala ng parehong ideya sa ilang mga format at wika nang hindi ito muling sinusulat nang limang beses.',
  'web.meta.agencies.title': 'Relay para sa mga ahensya',
  'web.meta.agencies.description':
    'Paghihiwalay ng kliyente, mga pag-apruba, mga link ng naibabahaging pagsusuri, mga resibo at pag-uulat para sa mga team na nag-publish sa ngalan ng ibang mga tao.',
  'web.meta.developers.title': 'Relay para sa mga developer',
  'web.meta.developers.description':
    'Isang backend sa likod ng web app, ang REST API, isang malayuang MCP server, ang CLI at mga naka-sign na webhook. Parehong mga panuntunan sa pag-apruba sa bawat surface.',
  'web.meta.pricing.title': 'Pricing',
  'web.meta.pricing.description':
    'One plan. $29 a month, or $300 a year which is $25 a month billed annually. 30 active channels, unlimited team members, no feature tiers.',
  'web.meta.resources.title': 'Mga mapagkukunan',
  'web.meta.resources.description':
    'Katayuan, changelog, dokumentasyon, pamamaraan, paghahambing, ang tool radar at ang katalogo ng pagkakataon.',
  'web.meta.status.title': 'Katayuan',
  'web.meta.status.description':
    'Kasalukuyang estado ng bawat Relay surface at bawat connector, kasama ang history ng insidente.',
  'web.meta.changelog.title': 'Changelog',
  'web.meta.changelog.description':
    'Ano ang ipinadala, kung ano ang nagbago para sa mga konektor, at kung ano ang naitama.',
  'web.meta.docs.title': 'Dokumentasyon',
  'web.meta.docs.description':
    'REST API, MCP server, CLI at dokumentasyon ng webhook para sa pagbuo sa Relay.',
  'web.meta.methodology.title': 'Pamamaraan',
  'web.meta.methodology.description':
    'Kung paano namin sinasaliksik ang mga claim sa platform, kung paano namin nilakikipag-date ang mga ito, kung paano namin inihahambing ang iba pang mga produkto, at kung paano namin itinatama ang mga pagkakamali.',
  'web.meta.compare.title': 'Mga paghahambing',
  'web.meta.compare.description':
    'Mga tapat, may petsang paghahambing sa iba pang mga tool sa pag-publish, kasama kung kanino ang bawat isa ay pinakamainam.',
  'web.meta.toolRadar.title': 'Creative tool radar',
  'web.meta.toolRadar.description':
    'Isang napetsahan, editoryal na sinuri na catalog ng mga espesyal na tool sa creative, na may mga limitasyon, mga caveat ng karapatan at komersyal na pagsisiwalat.',
  'web.meta.opportunities.title': 'Mga pagkakataon sa promosyon',
  'web.meta.opportunities.description':
    'Isang na-curate na catalog ng mga lugar na maaaring ilista, ilunsad o talakayin ang isang produkto, na may sariling mga panuntunan sa pagsusumite ng bawat destinasyon.',
  'web.meta.legal.title': 'Legal and policies',
  'web.meta.legal.description':
    'Terms, privacy, acceptable use, AI use, cookies, subprocessors, refunds, copyright, security, accessibility, developer terms and affiliate terms.',

  /* ---------------------------------------------------------------------- */
  /* Home                                                                    */
  /* ---------------------------------------------------------------------- */

  'web.home.promise':
    'Gawing platform-native na content ang isang pinagkunan na ideya, aprubahan ito nang isang beses, i-publish ito nang mapagkakatiwalaan, at alamin kung ano ang susunod na pagbutihin.',
  'web.home.lede':
    'Ang Relay ay isang publishing desk para sa mga taong may pananagutan sa kung ano ang lumalabas. Sumulat ka nang isang beses, umangkop sa bawat platform, tingnan ang mga tunay na limitasyon bago ka mag-iskedyul, kunin ang pag-apruba na kailangan mo, mag-publish sa pamamagitan ng mga opisyal na API ng platform, at magtago ng resibo para sa bawat post.',
  'web.home.summaryLine':
    'One plan at $29 a month or $300 a year. 30 active social channels, unlimited team members, no feature tiers. The seven day trial collects a payment method and charges $0 at checkout.',

  'web.home.example.title': 'Isang ideya, limang platform-native na bersyon',
  'web.home.example.body':
    'Nagsisimula ang kompositor sa isang master version. Ang pagpili ng isang account ay magbubukas ng override para sa account na iyon lamang, na may sarili nitong mga live na limitasyon at sarili nitong preview. Walang anumang isusulat mo para sa LinkedIn ang nagbabago sa natatanggap ng X.',
  'web.home.example.column.account': 'Account',
  'web.home.example.column.variant': 'Ano ang natatanggap ng account na ito',
  'web.home.example.column.check': 'Sinuri bago mag-iskedyul',
  'web.home.example.caption':
    'Isang mapaglarawang komposisyon. Ang mga limitasyon at setting na ipinakita ay nagmumula sa kahulugan ng connector para sa bawat platform, hindi mula sa isang pagtatantya.',
  'web.home.example.x.account': 'X, @northbound',
  'web.home.example.x.variant': 'Master text, pinaikling, kasama ang dalawang post na thread',
  'web.home.example.x.check':
    'Bilang ng character, pagkakasunud-sunod ng thread, tinantyang halaga ng API para sa isang post ng link',
  'web.home.example.linkedin.account': 'LinkedIn, Northbound Tools',
  'web.home.example.linkedin.variant': 'Mas mahabang master text na may nakalakip na dokumento',
  'web.home.example.linkedin.check': 'Tungkulin ng organisasyon, haba ng post, uri ng dokumento',
  'web.home.example.instagram.account': 'Instagram, @northbound.tools',
  'web.home.example.instagram.variant':
    'Square crop ng parehong larawan, muling isinulat ang caption para sa feed',
  'web.home.example.instagram.check':
    'Propesyonal na uri ng account, aspect ratio, alt text na naroroon',
  'web.home.example.youtube.account': 'YouTube, pahilaga',
  'web.home.example.youtube.variant':
    'Ang parehong clip bilang isang Maikling, na may sariling pamagat at paglalarawan',
  'web.home.example.youtube.check':
    'Saklaw ng pag-upload, estado ng pag-audit, privacy kung saan mapupunta ang pag-upload',
  'web.home.example.bluesky.account': 'Bluesky, northbound.example',
  'web.home.example.bluesky.variant': 'Master text gamit ang link card',
  'web.home.example.bluesky.check':
    'Bilang ng character, resolution ng link card, naroroon ang alt text',

  'web.home.pillars.title': 'Ang Relay ay binuo upang maging mahusay',
  'web.home.pillars.confidence.title': 'I-publish nang may kumpiyansa',
  'web.home.pillars.confidence.body':
    'Isang tunay na preview sa bawat account, mapagpasyang patakaran at mga pagsusuri sa platform bago ang anumang bagay ay naka-queue, ang pag-apruba na kailangan ng iyong workspace, isang hindi nababagong resibo na may external na post ID, at isang estado ng kalusugan para sa bawat koneksyon.',
  'web.home.pillars.confidence.proof':
    'Ang bawat panlabas na pagsusulat ay may dalang idempotency key, kaya ang isang manggagawa ay nag-crash pagkatapos na tanggapin ng platform ang isang post ay hindi lumikha ng pangalawa.',
  'web.home.pillars.adapt.title': 'Ibagay sa halip na duplicate',
  'web.home.pillars.adapt.body':
    'Bawat variant ng platform na maaari mong i-override ang isang account nang paisa-isa, at transcreation sa halip na literal na pagsasalin, na may glossary ng proyekto at may pangalang tagasuri sa bawat wika.',
  'web.home.pillars.adapt.proof':
    'Ang interface ay magagamit sa mga piling wika. Sinasaklaw ng adaptasyon ng nilalaman ang 30 wika ng nilalaman at bawat isa sa mga ito ay masusuri bago ito mag-publish.',
  'web.home.pillars.loop.title': 'Isara ang loop',
  'web.home.pillars.loop.body':
    'Analytics na pinangalanan ang sukatan, ang platform na nag-ulat nito, ang denominator at kung kailan ito huling na-refresh. Kung saan ang isang platform ay hindi nag-uulat ng isang bagay, Relay ang nagsasabi nito sa halip na magpakita ng zero.',
  'web.home.pillars.loop.proof':
    'Ang isang post ay inihambing laban sa iyong sariling median sa halip na laban sa isang marka na walang sinuman ang maaaring mag-audit.',
  'web.home.pillars.anywhere.title': 'Magtrabaho mula sa kung nasaan ka na',
  'web.home.pillars.anywhere.body':
    'Ang web app, isang REST API, isang malayuang MCP server, isang CLI at mga naka-sign na webhook ay tumatawag sa parehong mga serbisyo ng aplikasyon, sa parehong mga panuntunan sa pagpapahintulot at sa parehong mga validator.',
  'web.home.pillars.anywhere.proof':
    'Hindi ma-bypass ng isang ahente ang isang patakaran sa pag-apruba sa pamamagitan ng paggamit ng ibang surface, dahil ipinapatupad ang patakaran sa serbisyo, hindi sa interface.',
  'web.home.pillars.economics.title': 'Economics you can predict',
  'web.home.pillars.economics.body':
    'One price, every shipped feature, 30 active channels and unlimited team members. Platform usage that a provider charges per operation is passed through at cost and shown before you confirm the action.',
  'web.home.pillars.economics.proof':
    'There is no image or video generation credit system, because Relay does not generate media.',

  'web.home.honest.title': 'Ano ang hindi ginagawa ng Relay',
  'web.home.honest.lede':
    'Ito ay mga hangganan, hindi isang roadmap tease. Kung magbabago ang isa sa kanila, magbabago muna ito sa changelog.',
  'web.home.honest.noMedia':
    'No AI image generation and no AI video generation. Relay adapts, approves, publishes and measures the media you bring.',
  'web.home.honest.noAutomationOfEngagement':
    'Walang awtomatikong pag-like, pagsubaybay, pag-repost, hindi hinihinging tugon o direktang mensahe. Walang engagement pods at walang fabricated engagement.',
  'web.home.honest.noUnofficial':
    'Walang pag-automate ng browser, walang replay ng cookie, walang pag-scrape at walang hindi opisyal na mga endpoint sa pag-post. Mga opisyal na platform API lamang.',
  'web.home.honest.noPromises':
    'Walang pangako tungkol sa abot, pagraranggo o pakikipag-ugnayan. Masasabi sa iyo ng Relay kung ano ang nangyari at kung ano ang susunod na susuriin. Hindi nito masasabi sa iyo kung ano ang gagawin ng isang madla.',
  'web.home.honest.noUnattendedPublishing':
    'Walang unattended publishing bilang default. Ang isang ahente ay maaaring mag-draft, mag-validate at humiling ng pag-apruba. Ang isang tao ay magpapasya bago ang anumang bagay ay maging pampubliko, maliban kung sinasadya mong mag-opt out ng isang partikular na patakaran.',

  'web.home.surfaces.title': 'Limang ibabaw, isang backend',
  'web.home.surfaces.body':
    'Ang parehong mga kaso ng paggamit, ang parehong mga pagsusuri sa pangungupahan, ang parehong mga validator at ang parehong mga daloy ng trabaho sa pag-publish. Ang ibabaw ay isang daanan, hindi kailanman isang shortcut na lampas sa isang panuntunan.',
  'web.home.surfaces.web': 'Web app',
  'web.home.surfaces.webBody':
    'Composer, kalendaryo, mga pag-apruba, analytics, mga koneksyon at mga setting.',
  'web.home.surfaces.api': 'REST API',
  'web.home.surfaces.apiBody':
    'Mga scoped key, idempotency key sa bawat pagsusulat, pagbilang ng cursor, mga error sa pag-type.',
  'web.home.surfaces.mcp': 'Remote MCP server',
  'web.home.surfaces.mcpBody':
    'Streamable HTTP, OAuth, bawat saklaw ng tool at isang preview bago ang bawat kinahinatnang tawag.',
  'web.home.surfaces.cli': 'CLI',
  'web.home.surfaces.cliBody':
    'Matatag na nababasa ng makina na output para sa mga script at tuluy-tuloy na pagsasama.',
  'web.home.surfaces.webhooks': 'Mga naka-sign na webhook',
  'web.home.surfaces.webhooksBody':
    'I-publish ang mga resulta, mga desisyon sa pag-apruba at kalusugan ng koneksyon, na may muling paghahatid.',

  'web.home.closing.title': 'Magsimula sa isang account at isang post',
  'web.home.closing.body':
    'Ikonekta ang isang account, mag-draft ng isang post, panoorin ang validation run, iiskedyul ito at basahin ang resibo. Iyon ang buong produkto sa loob ng halos sampung minuto.',

  /*
   * Home v2 (WP-1, loud system). Additive only: every key above this block
   * still renders somewhere on the page. B5 English-fallback exemption for
   * this whole prefix is recorded in `beta-fallbacks.ts`, matching the
   * existing precedent for `web.home.summaryLine` and
   * `web.home.pillars.economics.*` above.
   */
  'web.home.v2.heroTemplate': 'Native, on-brand posts for {platform}.',
  'web.home.v2.sticker.trial': '7 day trial',
  'web.home.v2.sticker.official': 'Official APIs only',
  'web.home.v2.marqueeCaption': 'Official APIs only.',
  'web.home.v2.surfacesStat': 'Surfaces on one shared backend',
  'web.home.v2.pricingTeaser.title': 'What it costs',
  'web.home.v2.variantScene.masterLabel': 'Master draft',
  'web.home.v2.variantScene.progress': '{revealed} of {total}',

  /* ---------------------------------------------------------------------- */
  /* Product                                                                 */
  /* ---------------------------------------------------------------------- */

  'web.product.title': 'Ang publishing desk',
  'web.product.lede':
    'Dapat na masasagot ang pitong tanong sa bawat hakbang nang hindi nagki-click ng anuman: ano ang pino-post, saan, aling bersyon ang matatanggap ng bawat account, kailan at sa anong time zone, sino ang nag-apruba nito, kung ano ang maaaring gastos, at kung ano ang nangyari.',

  'web.product.step.source.title': 'Pinagmulan',
  'web.product.step.source.body':
    'Magsimula sa isang maikling, isang file na mayroon ka na, isang RSS item o isang kahilingan mula sa isang ahente. Pinapanatili ng imported na media ang pinanggalingan na ibinigay mo dito, kasama na kung saan ito nanggaling at kung sino ang may hawak ng mga karapatan.',
  'web.product.step.compose.title': 'Gumawa ng isang beses, pagkatapos ay i-override',
  'web.product.step.compose.body':
    'Ang isang master na bersyon ay nagtutulak sa bawat target. Ang pagpili ng isang account ay magbubukas ng override para sa account na iyon lamang: sarili nitong text, sarili nitong media crop, sarili nitong mga setting, sarili nitong live limit counter at sarili nitong preview. Ang pag-reset ng override ay ire-restore ang master sa isang aksyon at ipapakita muna sa iyo ang pagkakaiba.',
  'web.product.step.validate.title': 'Patunayan bago ang anumang bagay ay nakapila',
  'web.product.step.validate.body':
    'Ang pagpapatunay ay deterministic at tumatakbo sa server. Sinusuri nito ang mga limitasyon ng platform mula sa naka-bersyon na snapshot ng kakayahan, ang uri ng account, alt text, mga karapatan sa media, mga duplicate at cadence na panuntunan, pagbanggit at resolusyon ng patutunguhan, at ang tinantyang gastos sa paggamit ng platform. Ang bawat isyu ay pinangalanan ang target na kinabibilangan nito at kung paano ito ayusin.',
  'web.product.step.approve.title': 'Approve minsan',
  'web.product.step.approve.body':
    'Ang pag-apruba ay isang patakaran sa workspace, hindi isang ugali. Nakikita ng isang tagasuri ang bawat target, bawat variant, ang time zone, ang estado ng privacy at ang tinantyang gastos sa isang screen, at gumagana ito sa isang telepono. Ang nilalaman ay nagbago pagkatapos ng pag-apruba ay nangangailangan ng pag-apruba muli.',
  'web.product.step.schedule.title': 'Mag-iskedyul sa isang real time zone',
  'web.product.step.schedule.body':
    'Ang bawat naka-iskedyul na post ay nag-iimbak ng isang instant at isang time zone ng IANA, hindi kailanman isang walang muwang na lokal na oras. Ang mga daylight saving transition ay ipinapakita bago mo kumpirmahin, hindi natuklasan pagkatapos.',
  'web.product.step.publish.title': 'I-publish at itago ang resibo',
  'web.product.step.publish.body':
    'Ang bawat target ay ipinapadala na may isang idempotency key. Ang isang target na nabigo ay hindi ibabalik ang isang target na nagtagumpay, at ang estado na iyon ay may sariling pangalan: bahagyang na-publish. Ang bawat resulta ay gumagawa ng hindi nababagong resibo na may external na post ID, ang request identifier, ang history ng pagsubok at ang eksaktong error kung mayroon man.',
  'web.product.step.learn.title': 'Matuto',
  'web.product.step.learn.body':
    'Ang mga sukatan ay na-normalize, pinangalanan, iniuugnay sa platform na nag-ulat sa kanila at nakatatak ng oras ng pagiging bago. Ang isang sukatan na hindi iniulat ng isang platform ay minarkahan na hindi available kasama ng dahilan. Ito ay hindi kailanman nai-render bilang isang zero.',

  'web.product.shot.caption':
    'Ang mga screenshot sa page na ito ay nakunan mula sa tumatakbong produkto. Hanggang sa ang isang ibabaw ay sapat na kumpleto upang kunan ng larawan nang tapat, inilalarawan namin ito sa mga salita sa halip na gumuhit ng larawan nito.',
  'web.product.shot.pending': 'Nakabinbing screenshot ang pagkuha',
  'web.product.shot.pendingReason':
    'Ang ibabaw na ito ay ginagawa pa rin. Magpa-publish kami ng isang tunay na pagkuha sa halip na isang paglalarawan.',

  'web.product.states.title': 'Ang mga estado na walang gustong magdisenyo',
  'web.product.states.body':
    'Ang isang tool sa pag-publish ay hinuhusgahan sa masamang araw, hindi sa mabuti. Ang bawat isa sa mga ito ay may dinisenyong screen, isang simpleng pangungusap at isang susunod na aksyon.',
  'web.product.states.partial':
    'Bahagyang na-publish: aling mga target ang live, alin ang nabigo at bakit.',
  'web.product.states.revoked':
    'Isang binawi na token ang natagpuan sa oras ng pagpapadala, na may path na muling kumonekta.',
  'web.product.states.rateLimited':
    'Isang limitasyon sa rate ng platform, kung kailan ito nagre-reset at kung ano ang nakapila sa likod nito.',
  'web.product.states.duplicate':
    'Isang duplicate o cadence block, na may panuntunang nagpagana at ang path ng apela.',
  'web.product.states.offline': 'Offline habang nagko-compose: walang nawala sa isinulat mo.',
  'web.product.states.permission':
    'Isang aksyon na hindi pinahihintulutan ng iyong tungkulin, na pinangalanan ang tungkulin na ginagawa nito.',

  /* ---------------------------------------------------------------------- */
  /* Integrations and capability matrix                                      */
  /* ---------------------------------------------------------------------- */

  'web.integrations.title': 'Mga plataporma',
  'web.integrations.lede':
    'Kumokonekta ang Relay sa pamamagitan ng mga opisyal na platform API. Ang bawat connector ay may pinangalanang may-ari, isang naka-record na URL ng patakaran at isang petsa ng pagsusuri. Ang isang connector ay hindi nakalista bilang suportado hanggang sa pumasa ito sa connector definition ng tapos na.',
  'web.integrations.reviewNotice.title':
    'Walang connector na inilarawan bilang opisyal bago ito aprubahan ng platform',
  'web.integrations.reviewNotice.body':
    'Maraming platform ang nangangailangan ng pagsusuri sa app bago mag-publish ang isang application sa ngalan ng isang customer. Kung saan ang pagsusuri na iyon ay hindi pa nababayaran, sinasabi ito ng connector at eksaktong inilalarawan kung ano ang pinaghihigpitan hanggang sa pumasa ito.',
  'web.integrations.accountTypes': 'Mga uri ng account na maaaring i-publish ng connector na ito',
  'web.integrations.restriction': 'Paghihigpit na dapat mong malaman bago kumonekta',
  'web.integrations.cost': 'Gastos sa paggamit ng platform',
  'web.integrations.viewMatrix': 'Tingnan ang bawat kakayahan para sa platform na ito',

  'web.capabilities.title': 'Matrix ng kakayahan ng connector',
  'web.capabilities.lede':
    'Binuo mula sa parehong mga kahulugan ng connector na binabasa ng produkto, pagkatapos ay sinuri ng isang tao bago i-publish. Hindi maipapangako ng marketing ang isang bagay na hindi magagawa ng isang adaptor.',
  'web.capabilities.legend.title': 'Paano basahin ang talahanayang ito',
  'web.capabilities.legend.body':
    'Apat na estado, at ang pagkakaiba sa pagitan ng gitnang dalawang bagay. Hindi pa nabubuo ang backlog natin. Ang hindi inaalok ng platform ay isang katotohanan tungkol sa platform na walang tool na maaaring gumana sa paligid.',
  'web.capabilities.tableCaption':
    'Mga kakayahan ayon sa platform. Ang bawat cell ay pinangalanan ang estado nito sa mga salita pati na rin sa pamamagitan ng kulay.',
  'web.capabilities.snapshot': 'Bersyon ng mga kahulugan ng connector {version}, nirepaso {date}',
  'web.capabilities.sourceNote':
    'Ang bawat claim ng platform sa talahanayang ito ay nagli-link sa opisyal na dokumentasyong pinanggalingan nito at sa petsa kung kailan namin ito huling binasa.',

  /* ---------------------------------------------------------------------- */
  /* Audience pages                                                          */
  /* ---------------------------------------------------------------------- */

  'web.creators.title': 'Para sa mga creator',
  'web.creators.lede':
    'Ini-publish mo ang parehong ideya sa ilang mga format, minsan sa higit sa isang wika, at ikaw ang buong koponan. Ang gawaing tinatanggal ng Relay ay ang muling pag-type, ang muling pag-crop at ang pagsuri.',
  'web.creators.job.adapt.title':
    'Isulat ito nang isang beses, ipadala ang limang katutubong bersyon',
  'web.creators.job.adapt.body':
    'Ang master na bersyon ay nagdadala ng ideya. Nakukuha ng bawat account ang haba, ang crop, ang mga setting at ang tono na inaasahan ng platform, at makikita mo silang lahat nang magkatabi bago ka gumawa.',
  'web.creators.job.languages.title': 'Mag-publish sa ibang wika nang hindi nanghuhula',
  'web.creators.job.languages.body':
    'Pinapanatili ng transcreation ang layunin sa halip na ang mga salita, ginagamit ang glossary ng iyong proyekto, at minarkahan kung nabasa ito ng isang katutubong tagasuri. Walang naglalathala sa wikang hindi mo mapapatunayan maliban kung sasabihin mo ito.',
  'web.creators.job.rights.title': 'Panatilihin ang iyong rekord ng mga karapatan kasama ang file',
  'web.creators.job.rights.body':
    'Dinadala ng media kung saan ito nanggaling, kung sino ang may hawak ng mga karapatan at kung ito ay nilikha gamit ang isang generative tool. Ang mga platform ay lalong nagtatanong. Iniimbak ng Relay ang iyong sagot kasama ng asset sa halip na tanungin ka muli.',
  'web.creators.job.cost.title': 'Alamin ang halaga bago ka mag-post',
  'web.creators.job.cost.body':
    'Ang X ay naniningil sa bawat operasyon at naniningil ng higit pa para sa isang post na naglalaman ng URL. Tinatantya ng Relay na bago mo kumpirmahin, kaya isang desisyon ang mabigat na link sa halip na isang sorpresa sa invoice.',
  'web.creators.notFor.title': 'Ano ito ay hindi',
  'web.creators.notFor.body':
    'Ang Relay ay hindi bumubuo ng mga larawan o video, hindi nagpapatakbo ng automation ng pakikipag-ugnayan, at hindi hinuhulaan kung paano gaganap ang isang post. Kung iyon ang mga tool na gusto mo, ginagawa ito ng ibang mga produkto at mas gusto naming malaman mo na ngayon.',

  'web.agencies.title': 'Para sa mga ahensya',
  'web.agencies.lede':
    'Nag-publish ka sa ngalan ng ibang tao, na ginagawang bahagi ng trabaho ang pagpapatungkol, pag-apruba at ebidensya sa halip na isang kagandahang-loob.',
  'web.agencies.job.separation.title': 'Paghihiwalay ng kliyente na tumatagal',
  'web.agencies.job.separation.body':
    'Ang bawat workspace ay nakahiwalay sa antas ng database pati na rin sa application. Ang isang query na tumatawid sa isang hangganan ng workspace ay nabigo sa Postgres, hindi lamang sa isang code path na maaaring makalimutan ng isang tao.',
  'web.agencies.job.approval.title': 'Mga pag-apruba na talagang magagamit ng isang kliyente',
  'web.agencies.job.approval.body':
    'Nakikita ng isang tagasuri ang bawat target, bawat variant, ang iskedyul kasama ang time zone nito at ang tinantyang gastos sa isang screen, at gumagana ang screen sa isang telepono. Ang mga desisyon sa pag-apruba ay naitala kung sino, kailan at ano ang kanilang nakita.',
  'web.agencies.job.receipts.title': 'Ebidensya para sa awkward na usapan',
  'web.agencies.job.receipts.body':
    'Ang bawat publikasyon ay gumagawa ng hindi nababagong resibo kasama ang panlabas na post ID at ang buong kasaysayan ng pagsubok. Kapag nagtanong ang isang kliyente kung may lumabas sa alas-nuwebe, ang sagot ay may timestamp at isang platform identifier na naka-attach.',
  'web.agencies.job.roles.title': 'Mga tungkulin na tumutugma sa kung paano nahahati ang gawain',
  'web.agencies.job.roles.body':
    'May-ari, admin, manager, editor, approver, analyst at viewer, na saklaw sa bawat proyekto at bawat account. Walang limitasyong mga miyembro ng koponan, dahil ang pagsingil sa bawat upuan ay ginagawang magbahagi ang mga ahensya ng mga login at iyon ay isang problema sa seguridad.',
  'web.agencies.limits.title': 'Ang hangganan, malinaw na nakasaad',
  'web.agencies.limits.body':
    'Sinasaklaw ng isang plano ang 30 aktibong social channel. Ang channel ay isang social account, Page, profile, grupo o koneksyon sa publikasyon. Kung kailangan mo ng higit sa 30, sabihin sa amin kung ano ang kailangan mo at bibigyan ka namin ng isang tuwid na sagot sa halip na isang nakatagong antas.',

  'web.developers.title': 'Para sa mga developer',
  'web.developers.lede':
    'Ang pag-publish ay bahagi ng isang workflow kung saan pampubliko at permanente ang isang pagkakamali. Binibigyan ka ng Relay ng isang backend, mga error sa pag-type, kawalan ng lakas sa bawat pagsusulat at isang modelo ng pag-apruba na hindi kayang pag-usapan ng isang ahente.',
  'web.developers.surface.api.title': 'REST API',
  'web.developers.surface.api.body':
    'Saklaw na API key, isang idempotency key na kinakailangan sa bawat pagsulat, pagbilang ng cursor, at isang naka-type na error envelope na may stable na code, isang message key at mga detalyeng na-sanitize. Walang payload ng provider na ipapakita pabalik sa iyo nang hilaw.',
  'web.developers.surface.mcp.title': 'Remote MCP server',
  'web.developers.surface.mcp.body':
    'Streamable HTTP na may OAuth. Butil-butil ang mga tool at ipinapahayag ng bawat isa ang mga side effect nito. Ang pagbabasa, pag-draft, paghiling ng pag-apruba, pag-iskedyul at pag-publish ay magkahiwalay na saklaw, kaya ang isang modelo na maaaring mag-draft ay hindi maaaring mag-publish.',
  'web.developers.surface.cli.title': 'CLI',
  'web.developers.surface.cli.body':
    'Sinusuportahan ng bawat command ang output na nababasa ng makina na may matatag na hugis, kaya ma-parse ito ng isang script at maaaring mabigo ang tuluy-tuloy na trabaho sa pagsasama.',
  'web.developers.surface.webhooks.title': 'Mga naka-sign na webhook',
  'web.developers.surface.webhooks.body':
    'Mag-publish ng mga resulta, mga desisyon sa pag-apruba, kalusugan ng koneksyon at mga resulta ng pagpapatunay, pinirmahan, lumalaban sa replay at maihahatid muli mula sa dashboard.',
  'web.developers.safety.title': 'Ang modelo ng kaligtasan ng ahente',
  'web.developers.safety.body':
    'Ang kredensyal ng ahente ay isang saklaw na account ng serbisyo, hindi isang kopya ng session ng isang tao. Nagdadala ito ng mga paghihigpit sa bawat project, bawat account, bawat lokal, bawat domain, bawat cadence at bawat tingin, at muling pinapahintulutan ng server ang bawat tawag sa halip na magtiwala sa host ng ahente.',
  'web.developers.safety.injection':
    'Ang mga web page, feed, komento at tugon sa platform ay itinuturing bilang hindi pinagkakatiwalaang data. Ang output ng modelo ay muling na-validate nang deterministiko, dahil ang isang modelo na nagsasabing maayos ang isang post ay hindi isang desisyon sa seguridad.',
  'web.developers.safety.killSwitch':
    'Ang bawat ahente at bawat workspace ay may kill switch na humihinto sa nakabinbing trabaho nang hindi ito tinatanggal.',
  'web.developers.openSource.title': 'Buksan ang mga piraso',
  'web.developers.openSource.body':
    'Ang kontrata ng connector, ang CLI, mga halimbawa ng schema, mga kahulugan ng tool ng MCP at ang provider simulator ay ang mga bahaging kailangan mong buuin laban sa Relay nang walang sandbox account. Kung saan hindi pa nai-publish ang isang repositoryo, sinasabi ng page na ito sa halip na mag-link sa wala.',

  /* ---------------------------------------------------------------------- */
  /* Pricing                                                                 */
  /* ---------------------------------------------------------------------- */

  'web.pricing.title': 'One plan',
  'web.pricing.lede':
    'There are no feature tiers, so there is no comparison table to read. Both billing intervals unlock every shipped feature.',
  'web.pricing.intervalHeading': 'Choose how you pay',
  'web.pricing.monthlyLabel': 'Billed monthly',
  'web.pricing.annualLabel': 'Billed annually',
  'web.pricing.annualDetail': '$300 charged once a year.',
  'web.pricing.monthlyDetail': '$29 charged every month.',
  'web.pricing.perMonthNote':
    'Prices are in US dollars. Polar adds any sales tax or VAT that applies where you are.',

  'web.pricing.beside.title': 'What you are agreeing to',
  'web.pricing.beside.channels':
    '30 active social channels. A channel is one social account, Page, profile, group or publication connection.',
  'web.pricing.beside.members':
    'Unlimited team members, workspaces and project groups. There is no per seat charge.',
  'web.pricing.beside.fairUse':
    'Unlimited drafts, scheduled posts and stored receipts under a published fair use and anti spam policy. Those controls exist to protect your connected accounts and they apply identically to every subscriber.',
  'web.pricing.beside.metered':
    'X charges per API operation and charges more for a post that contains a URL. Relay passes that through at cost, estimates it before you confirm the action, and shows it in your usage. Other platform fees are passed through only when they are disclosed before the action.',
  'web.pricing.beside.noMedia':
    'AI image generation and AI video generation are not included and are not sold. There are no media credits, because Relay does not generate media.',
  'web.pricing.beside.trial':
    'The trial runs for seven days with every feature. Polar collects a payment method at checkout and charges $0 today. The exact first charge amount and date are shown next to the start action before you confirm.',
  'web.pricing.beside.conversion':
    'If you do nothing, the trial converts on day seven to the interval you chose and Polar charges the amount shown at checkout. Polar emails a reminder three days before that happens.',
  'web.pricing.beside.cancel':
    'Cancel from Settings at any time without contacting support. Cancel before the trial converts and no charge is attempted. Cancel after that and you keep access until the paid period ends.',
  'web.pricing.beside.data':
    'Nothing is deleted when a subscription ends. You can export your content, receipts and analytics, and you can delete them yourself.',

  'web.pricing.included.title': 'Included, in both intervals',
  'web.pricing.compare.title': 'Why there is no comparison table here',
  'web.pricing.compare.body':
    'A comparison table exists to show what a cheaper plan takes away. There is one plan, so the table would have one column. If we ever add a tier, we will say what moved and why on the changelog before the price page changes.',

  'web.pricing.testimonials.title': 'There are no customer quotes on this page yet',
  'web.pricing.testimonials.body':
    'A quote goes up only when the customer wrote it, gave written permission for it, and we can point to the work it describes. Until then an empty space is more honest than a wall of invented praise.',

  'web.pricing.faq.title': 'Questions people ask before paying',
  'web.pricing.faq.channels.q': 'What happens if I go over 30 channels',
  'web.pricing.faq.channels.a':
    'Nothing is disconnected and nothing is deleted. Channels over the limit become read only, you choose which ones stay active, and we tell you before it happens.',
  'web.pricing.faq.refund.q': 'Do you refund',
  'web.pricing.faq.refund.a':
    'Yes, under the published refund and cancellation policy, and always where consumer law requires it. Billing is handled by Polar as merchant of record and refunds are issued through Polar.',
  'web.pricing.faq.selfHost.q': 'Can I run it myself',
  'web.pricing.faq.selfHost.a':
    'Not today. Whether there will be a self hosted edition, and under which licence, is an open decision. We will publish the answer rather than imply one.',
  'web.pricing.faq.xCost.q': 'How much will X actually cost me',
  'web.pricing.faq.xCost.a':
    'It depends on how many posts you publish and how many of them contain a URL, because X prices those differently. Relay estimates each action before you confirm it and totals it in your usage view. We do not mark it up.',
  'web.pricing.faq.trialAbuse.q': 'Can I start a second trial',
  'web.pricing.faq.trialAbuse.a':
    'Repeat trials are limited by Polar. If you have a legitimate reason, contact support and a person will look at it.',

  /*
   * Pricing v2 (WP-2, loud system). Additive only: every key above this
   * block still renders somewhere on the page. B5 English-fallback
   * exemption for this whole prefix is recorded in `beta-fallbacks.ts`,
   * matching the existing precedent for `web.pricing.*` above and
   * `web.home.v2.*` on the landing page.
   */
  'web.pricing.v2.closing.title': 'Seven days to try it, on your own accounts',
  'web.pricing.v2.closing.body':
    'Start the trial, connect the accounts you actually run, and see how validation and scheduling feel before anything is charged.',

  /* ---------------------------------------------------------------------- */
  /* Resources index                                                         */
  /* ---------------------------------------------------------------------- */

  'web.resources.title': 'Mga mapagkukunan',
  'web.resources.lede':
    'Katotohanan sa pagpapatakbo tungkol sa produkto, at ang pananaliksik sa likod ng anumang sinasabi namin tungkol sa isang platform.',
  'web.resources.status.body':
    'Kasalukuyang estado ng bawat surface at bawat connector, na may history ng insidente.',
  'web.resources.changelog.body':
    'Ano ang ipinadala, kung ano ang nagbago para sa isang connector, at kung ano ang aming naitama.',
  'web.resources.docs.body': 'REST API, MCP, CLI at dokumentasyon ng webhook.',
  'web.resources.methodology.body':
    'Kung paano namin sinasaliksik, napetsahan, pinagmumulan at itinatama ang bawat claim sa platform.',
  'web.resources.compare.body':
    'Mga napetsahan na paghahambing sa iba pang mga tool, kabilang kung sino ang nababagay sa bawat isa.',
  'web.resources.capabilities.body':
    'Bawat platform, bawat kakayahan, na nabuo mula sa mga kahulugan ng connector.',
  'web.resources.toolRadar.body':
    'Mga espesyal na tool sa creative, napetsahan, na may mga limitasyon at pagsisiwalat.',
  'web.resources.opportunities.body':
    'Mga na-curate na lugar na ilulunsad, ilista o iaambag, kasama ang bawat panuntunan ng patutunguhan.',
  'web.resources.legal.body':
    'Terms, privacy, acceptable use, AI use, security and the rest of the policy set.',
  'web.resources.guides.title': 'Mga gabay at daloy ng trabaho',
  'web.resources.guides.empty': 'Wala pang na-publish na gabay',
  'web.resources.guides.emptyBody':
    'Ang pamantayang pang-editoryal ay nangangailangan ng orihinal na data ng produkto, isang reproducible na daloy ng trabaho, pangunahing pinagmumulan ng platform na may petsa ng pag-verify, at isang pinangalanang editor ng tao. Ang mga unang gabay ay nag-publish kapag natugunan nila ito.',

  /* ---------------------------------------------------------------------- */
  /* Status                                                                  */
  /* ---------------------------------------------------------------------- */

  'web.status.title': 'Katayuan',
  'web.status.lede':
    'Ang estado ng bawat Relay surface at bawat connector. Sinasaklaw ng estado ng konektor ang aming adaptor at ang platform na API kung saan ito nakasalalay.',
  'web.status.updated': 'Mano-manong itinatakda ang mga status. Huling na-update {time}.',
  'web.status.surfaces.title': 'Mga ibabaw',
  'web.status.connectors.title': 'Mga konektor',
  'web.status.level.operational': 'Normal na gumagana',
  'web.status.level.degraded': 'Degraded',
  'web.status.level.partial': 'Bahagyang outage',
  'web.status.level.outage': 'Outage',
  'web.status.level.maintenance': 'Nakaplanong pagpapanatili',
  'web.status.level.notLive': 'Hindi pa live',
  'web.status.notLiveBody':
    'Ang connector na ito ay binuo ngunit hindi pa nagdadala ng trapiko ng customer, kaya walang dapat iulat.',
  'web.status.incidents.title': 'Kasaysayan ng insidente',
  'web.status.incidents.empty': 'Walang naitala na insidente',
  'web.status.incidents.emptyBody':
    'Nagsisimulang walang laman ang page na ito. Ini-publish namin ang bawat insidente na nakaapekto sa pag-publish, kabilang ang mga dulot ng sarili naming mga pagkakamali, kasama ang timeline at kung ano ang nagbago pagkatapos.',
  'web.status.incident.started': 'Nagsimula {time}',
  'web.status.incident.resolved': 'Nalutas {time}',
  'web.status.incident.impact': 'Epekto',
  'web.status.incident.cause': 'Dahilan',
  'web.status.incident.followUp': 'Ano ang nagbago pagkatapos',
  'web.status.subscribe.title': 'Sabihan kapag may nasira',
  'web.status.subscribe.body':
    'Ang kalusugan ng koneksyon, mga pagkabigo sa pag-publish at mga insidente sa platform ay inihahatid bilang mga naka-sign na webhook sa iyong sariling endpoint. Wala pang hiwalay na status mailing list.',

  /* ---------------------------------------------------------------------- */
  /* Changelog                                                               */
  /* ---------------------------------------------------------------------- */

  'web.changelog.title': 'Changelog',
  'web.changelog.lede':
    'Mga pagbabago sa produkto, pagbabago sa connector at pagwawasto. Ang isang pagbabago sa kakayahan na nakakaapekto sa kung ano ang maaari mong i-publish ay lilitaw dito bago ito lumitaw saanman sa site na ito.',
  'web.changelog.kind.shipped': 'Ipinadala',
  'web.changelog.kind.changed': 'Nagbago',
  'web.changelog.kind.fixed': 'Naayos na',
  'web.changelog.kind.connector': 'Konektor',
  'web.changelog.kind.correction': 'Pagwawasto',
  'web.changelog.kind.security': 'Seguridad',
  'web.changelog.empty': 'Wala pang naipadala sa publiko',
  'web.changelog.emptyBody':
    'Ang Relay ay nasa build. Ang unang entry dito ay ang unang bagay na magagamit ng isang customer, hindi isang milestone tungkol sa ating sarili.',

  /* ---------------------------------------------------------------------- */
  /* Docs shell                                                              */
  /* ---------------------------------------------------------------------- */

  'web.docs.title': 'Dokumentasyon',
  'web.docs.lede':
    'Isang backend, apat na paraan sa loob. Ang bawat seksyon ay nagdodokumento ng parehong mga kaso ng paggamit, kaya ang isang konsepto na natutunan mo sa REST API ay ang parehong konsepto sa MCP at sa CLI.',
  'web.docs.section.start.title': 'Pagsisimula',
  'web.docs.section.start.body':
    'Pagpapatotoo, mga workspace, proyekto, at ang iyong unang na-publish na post.',
  'web.docs.section.api.title': 'REST API',
  'web.docs.section.api.body':
    'Mga mapagkukunan, pagination, idempotency, error code at mga limitasyon sa rate.',
  'web.docs.section.mcp.title': 'MCP server',
  'web.docs.section.mcp.body':
    'Transport, OAuth, tool catalog, mga saklaw at ang pagkakamay ng pag-apruba.',
  'web.docs.section.cli.title': 'CLI',
  'web.docs.section.cli.body':
    'I-install, i-authenticate, at ang kontrata ng output na nababasa ng makina.',
  'web.docs.section.webhooks.title': 'Mga Webhook',
  'web.docs.section.webhooks.body':
    'Catalog ng kaganapan, pag-verify ng lagda, muling pagsubok at muling paghahatid.',
  'web.docs.section.connectors.title': 'Mga konektor',
  'web.docs.section.connectors.body':
    'Alinsunod sa mga kinakailangan sa platform, mga uri ng account, mga limitasyon at kilalang mga paghihigpit.',
  'web.docs.section.errors.title': 'Sanggunian ng error',
  'web.docs.section.errors.body':
    'Bawat error code, kung ano ang sanhi nito, at kung ano ang gagawin tungkol dito.',
  'web.docs.pending': 'Hindi pa nai-publish',
  'web.docs.pendingBody':
    'Isinulat ang seksyong ito laban sa ipinadalang API at nag-publish kasama nito. Mas gugustuhin naming magpakita sa iyo ng wala kaysa sa dokumentasyon para sa isang endpoint na maaaring magbago.',
  'web.docs.principles.title': 'Kung ano ang maaasahan mo',
  'web.docs.principles.idempotency':
    'Ang bawat pagsusulat ay tumatagal ng isang idempotency key. Ang pag-replay ng kahilingan gamit ang parehong key ay nagbabalik ng orihinal na resulta sa halip na lumikha ng pangalawang post.',
  'web.docs.principles.errors':
    'Ang bawat error ay may stable na code, message key at mga detalyeng na-sanitize. Ang mga code ay hindi nagbabago ng kahulugan sa pagitan ng mga bersyon.',
  'web.docs.principles.versioning':
    'Ang mga paglabag sa mga pagbabago ay makakakuha ng bagong bersyon at isang inihayag na window ng paghinto sa paggamit. Ang mga additive na pagbabago ay hindi.',
  'web.docs.principles.scopes':
    'Ang pagbabasa, pag-draft, paghiling ng pag-apruba, pag-iskedyul at pag-publish ay magkahiwalay na saklaw. Nakukuha ng kredensyal ang pinakamaliit na hanay na gumagawa ng trabaho nito.',

  /* ---------------------------------------------------------------------- */
  /* Methodology                                                             */
  /* ---------------------------------------------------------------------- */

  'web.methodology.title': 'Pamamaraan',
  'web.methodology.lede':
    'Paano matatawag na totoo ang anumang bagay sa site na ito, at kung ano ang mangyayari kapag naging hindi totoo.',
  'web.methodology.claims.title': 'Mga claim sa platform',
  'web.methodology.claims.body':
    'Ang bawat claim tungkol sa kung ano ang pinapayagan ng isang platform ay nagmumula sa sariling dokumentasyon o pahina ng patakaran ng platform na iyon. Itinatala namin ang URL, ang petsa kung kailan ito binasa, ang bersyon ng API kung saan nalalapat ang isa, at ang taong nagmamay-ari ay muling nagsuri nito. Ang isang paghahabol na wala ang apat na bagay na iyon ay hindi napupunta sa site.',
  'web.methodology.recheck.title': 'Pag recheck namin',
  'web.methodology.recheck.beforeConnector':
    'Bago magsimula ang isang connector, at muli bago ito magdala ng trapiko ng customer.',
  'web.methodology.recheck.monthly':
    'Bawat buwan para sa mga changelog ng platform at pagpepresyo ng vendor.',
  'web.methodology.recheck.quarterly':
    'Bawat quarter para sa mga plano ng katunggali, mga patakaran ng komunidad at mga legal na dokumento.',
  'web.methodology.recheck.immediate':
    'Kaagad pagkatapos ng anumang pagtanggi sa platform, abiso sa pagpapatupad, pagtigil sa paggamit, o isang hindi maipaliwanag na pagbabago sa pag-uugali sa pag-publish o analytics.',
  'web.methodology.comparison.title': 'Mga paghahambing',
  'web.methodology.comparison.bestFor':
    'Ang bawat paghahambing ay nagsasaad kung kanino ang bawat produkto ay pinakamahusay para sa, kasama na kapag iyon ay hindi sa amin.',
  'web.methodology.comparison.dated':
    'Ang bawat paghahambing ay naglalaman ng petsa ng pananaliksik at nag-uugnay sa pangunahing pagpepresyo at mga mapagkukunan ng kakayahan.',
  'web.methodology.comparison.distinction':
    'Ang isang nawawalang kakayahan ay may label na alinman bilang isang bagay na hindi namin binuo o bilang isang bagay na hindi pinapayagan ng platform. Magkaiba ang mga pangungusap na ito at hindi namin sila pinagsasama.',
  'web.methodology.comparison.noLogos':
    'Hindi kami gumagamit ng mga logo ng customer ng ibang kumpanya, mga quote o mga screenshot ng interface, at hindi kami naghahabol ng pag-endorso na wala kami.',
  'web.methodology.benchmarks.title': 'Mga benchmark at data ng produkto',
  'web.methodology.benchmarks.body':
    'Ang anumang numerong nakuha mula sa aktibidad ng customer ay nagsasaad ng sample nito, mga pagbubukod nito, kahulugan ng sukatan nito at limitasyon ng privacy nito, at pinagsama-sama upang walang workspace na matukoy. Kung masyadong maliit ang isang sample para ligtas na mai-publish, sinasabi namin iyon sa halip na i-publish pa rin ito.',
  'web.methodology.ai.title': 'AI sa sarili nating nilalaman',
  'web.methodology.ai.body':
    'Ang isang modelo ay maaaring magsaliksik, magbalangkas, magsalin, magsuri at mag-format. Ang isang pinangalanang tao ang nagmamay-ari ng bawat paghahabol, ine-edit ang piraso at pinapanatili itong napapanahon. Hindi kami naglalathala ng hindi nasuri na nabuong mga artikulo, at hindi kami gumagawa ng mga screenshot.',
  'web.methodology.corrections.title': 'Mga pagwawasto',
  'web.methodology.corrections.body':
    'Kapag mali ang isang page, itinatama namin ito sa lugar, magdagdag ng may petsang tala sa pagwawasto, at ilista ang pagwawasto sa changelog. Kapag ang isang pahina ay masyadong lipas upang ayusin, ireretiro namin ito sa halip na iwanan ito.',

  /* ---------------------------------------------------------------------- */
  /* Compare                                                                 */
  /* ---------------------------------------------------------------------- */

  'web.compare.title': 'Mga paghahambing',
  'web.compare.lede':
    'Ang mga page na ito ay kapaki-pakinabang kahit na pumili ka ng ibang produkto. Iyan ang pamantayan na dapat nilang matugunan bago sila mag-publish.',
  'web.compare.rules.title': 'Ang mga patakarang sinusunod ng mga pahinang ito',
  'web.compare.rules.bestFor':
    'Ang bawat pahina ay nagsasaad kung kanino ang iba pang produkto ay pinakamahusay para sa, sa sarili nitong seksyon, muna.',
  'web.compare.rules.dated':
    'Ang bawat claim ay may petsa at nagli-link sa pangunahing pinagmulan kung saan ito nanggaling.',
  'web.compare.rules.distinction':
    'Inihiwalay namin ang hindi namin binuo mula sa hindi pinapayagan ng platform.',
  'web.compare.rules.axes':
    'Ang bawat page ay naghahambing ng parehong mga bagay: allowance ng account, mga limitasyon sa pag-post, koponan at pag-apruba, API, MCP at CLI access, mga wika ng content, analytics, paghawak ng video, naka-embed na paggamit, self-host, suporta, at ang halaga ng platform na API na babayaran mo sa itaas.',
  'web.compare.rules.correction':
    'Ang bawat pahina ay may dalang contact sa pagwawasto at petsa ng pagsusuri.',
  'web.compare.planned.title': 'Mga nakaplanong pahina',
  'web.compare.planned.body':
    'Ang mga ito ay nagpa-publish kapag ang kasalukuyang pagpepresyo at pagsusuri ng kakayahan ay kumpleto na. Ang paghahambing na isinulat mula sa memorya ay mas masahol kaysa sa walang paghahambing.',
  'web.compare.empty': 'Wala pang nai-publish na paghahambing',
  'web.compare.emptyBody':
    'Ang bawat page ay nangangailangan ng bagong fact check laban sa ibang produkto na sariling pagpepresyo at dokumentasyon. Isa-isa silang naglalathala habang natapos ang gawaing iyon.',

  /* ---------------------------------------------------------------------- */
  /* Tool radar                                                              */
  /* ---------------------------------------------------------------------- */

  'web.toolRadar.title': 'Creative tool radar',
  'web.toolRadar.lede':
    'Ang Relay ay hindi bumubuo ng mga larawan o video. Nakakatulong ito sa iyo na magpasya kung aling tool ng espesyalista ang gagamitin at dalhin ang natapos na asset nang buo ang rekord ng mga karapatan nito.',
  'web.toolRadar.record.title': 'Ano ang dapat dalhin ng bawat tala',
  'web.toolRadar.record.url': 'Ang opisyal na URL at ang organisasyong nagmamay-ari ng produkto.',
  'web.toolRadar.record.useCase':
    'Ang daloy ng trabaho kung saan ito inirerekomenda, at ang mga nakadokumentong limitasyon nito.',
  'web.toolRadar.record.pricing':
    'Ang modelo ng pagpepresyo nito at ang petsa na sinuri namin ito.',
  'web.toolRadar.record.rights':
    'Ang mga karapatan nito, paglilisensya, pagpapanatili at mga babala sa privacy, sa sariling salita ng vendor.',
  'web.toolRadar.record.disclosure':
    'Kung mayroon kaming anumang komersyal na relasyon dito. Ang pagraranggo ay hindi kailanman nakasalalay doon.',
  'web.toolRadar.record.verified':
    'Isang huling na-verify na petsa, at isang nakikitang babala kapag ang isang talaan ay lumampas sa window ng pagsusuri nito.',
  'web.toolRadar.category.title': 'Mga kategorya',
  'web.toolRadar.empty': 'Hindi pa populated ang catalog',
  'web.toolRadar.emptyBody':
    'Ang mga rekord ay isinulat ng isang tao mula sa sariling dokumentasyon ng vendor. Hindi namin pupunuin ang pahinang ito ng mga link na binuo ng modelo na mukhang kapani-paniwala.',
  'web.toolRadar.noAffiliateYet':
    'Walang kaugnayang kaakibat sa anumang tool na nakalista dito ngayon.',

  /* ---------------------------------------------------------------------- */
  /* Opportunities                                                           */
  /* ---------------------------------------------------------------------- */

  'web.opportunities.title': 'Mga pagkakataon sa promosyon',
  'web.opportunities.lede':
    'Isang na-curate na catalog ng mga lugar kung saan maaaring ilunsad, ilista, talakayin o iambag ang isang produkto, kasama ang mga panuntunang itinakda ng bawat destinasyon para sa sarili nito.',
  'web.opportunities.rules.title': 'Paano kumikilos ang catalog na ito',
  'web.opportunities.rules.curated':
    'Ang bawat entry ay isang nasuri na tala na may opisyal na URL, ang kasalukuyang mga panuntunan sa pagsusumite at petsa ng pag-verify. Walang natuklasan ng isang modelo at ipinakita bilang na-verify.',
  'web.opportunities.rules.noAutomation':
    'Ang Relay ay hindi kailanman nagsusumite ng isang form, nag-scrape ng isang contact, nagpapadala ng maramihang email o mga post sa isang komunidad para sa iyo. Ikaw ang gumawa ng pagsusumite.',
  'web.opportunities.rules.noGuarantee':
    'Ang isang listahan ay hindi isang pangako sa pagraranggo at ang isang link ay hindi isang diskarte sa paglago. Nagpapakita kami ng mga kinakailangan, madla, pagsisikap, gastos at pagsisiwalat para makapagpasya ka kung sulit ang iyong hapon.',
  'web.opportunities.rules.stale':
    'Ang isang record na lampas sa petsa ng pagsusuri nito ay may label o nakatago sa halip na ipakita bilang kasalukuyan.',
  'web.opportunities.category.title': 'Mga kategorya',
  'web.opportunities.empty': 'Hindi pa populated ang catalog',
  'web.opportunities.emptyBody':
    'Ang bawat tuntunin sa patutunguhan ay kailangang basahin at itala ng isang tao bago ito mairekomenda. Ang mga kategorya ay nakalista sa itaas upang makita mo ang hugis ng kung ano ang darating.',

  /* ---------------------------------------------------------------------- */
  /* Legal, shared                                                           */
  /* ---------------------------------------------------------------------- */

  'web.legal.title': 'Legal and policies',
  'web.legal.lede':
    'The documents that govern using Relay. Where the wording has to be drafted by a lawyer for a specific company and jurisdiction, the page says so instead of pretending.',
  'web.legal.counselPending.title': 'Pending review by counsel before launch',
  'web.legal.counselPending.body':
    'The substance on this page reflects how the product actually behaves and is accurate today. The binding legal wording, the governing jurisdiction and the liability terms are being drafted with qualified counsel and will replace this text before Relay is generally available. This page is not legal advice and it is not a contract yet.',
  'web.legal.contact.title': 'Contact',
  'web.legal.contact.privacy': 'privacy@relay.example',
  'web.legal.contact.legal': 'legal@relay.example',
  'web.legal.contact.security': 'security@relay.example',
  'web.legal.contact.abuse': 'abuse@relay.example',
  'web.legal.contact.copyright': 'copyright@relay.example',
  'web.legal.contact.affiliates': 'affiliates@relay.example',
  'web.legal.contact.accessibility': 'accessibility@relay.example',
  'web.legal.entity.pending':
    'The contracting entity, its registered address and the governing jurisdiction are an open decision and will be named here before launch.',
  'web.legal.index.updated': 'Updated {date}',

  /* Terms ---------------------------------------------------------------- */
  'web.legal.terms.title': 'Terms of Service',
  'web.legal.terms.summary':
    'What Relay agrees to provide, what you agree to do, and what happens when either side stops.',
  'web.legal.terms.service.title': 'What the service is',
  'web.legal.terms.service.body':
    'Relay is a hosted service for creating, approving, scheduling and publishing content to social platforms through those platforms official APIs, together with the receipts, analytics and audit records that result. It is not a social platform and it does not control what any platform does with a post once it is published.',
  'web.legal.terms.content.title': 'Your content stays yours',
  'web.legal.terms.content.body':
    'You keep ownership of everything you upload, write or import. You grant Relay only the licence needed to store it, process it, adapt it into the variants you ask for, and transmit it to the accounts you selected. That licence ends when you delete the content, apart from records we are required to keep.',
  'web.legal.terms.warranties.title': 'What you are confirming when you publish',
  'web.legal.terms.warranties.body':
    'That you are authorized to publish to the accounts you connected, that you hold the rights to the content and the media, that you have the consent required for any person appearing in it, and that publishing it does not breach the destination platform rules.',
  'web.legal.terms.platforms.title': 'Platform dependence',
  'web.legal.terms.platforms.body':
    'Connectors depend on third party APIs that those companies control. A platform can change its API, restrict a permission, revoke an application or close access with little notice. Relay cannot guarantee that any connector remains available, and a connector becoming unavailable is not a failure of this agreement. We will tell you on the status page and the changelog when it happens.',
  'web.legal.terms.ai.title': 'AI output',
  'web.legal.terms.ai.body':
    'Text assistance, translation, transcreation and planning features produce suggestions. They can be wrong, out of date or unsuitable. You are responsible for reviewing anything you publish. Relay does not generate images or video.',
  'web.legal.terms.billing.title': 'Payment',
  'web.legal.terms.billing.body':
    'Polar is the merchant of record. Polar handles checkout, taxes, invoices and refunds. Subscriptions renew automatically at the interval you chose until you cancel. Platform usage that a provider charges per operation is billed separately at cost and is disclosed before the action that incurs it.',
  'web.legal.terms.suspension.title': 'Suspension and scheduled posts',
  'web.legal.terms.suspension.body':
    'If a subscription lapses or a workspace is suspended, scheduled posts stop rather than publishing silently, and the workspace becomes read only. Your content, receipts and connections are preserved and remain exportable.',
  'web.legal.terms.aup.title': 'Acceptable use',
  'web.legal.terms.aup.body':
    'The Acceptable Use Policy forms part of these terms. We may rate limit, pause, require verification, revoke agent or API access, suspend or terminate for a breach of it, and you may appeal any of those decisions to a person.',
  'web.legal.terms.termination.title': 'Ending the agreement',
  'web.legal.terms.termination.body':
    'You can cancel at any time from Settings. After termination you keep an export window before deletion, and deletion is never made conditional on paying an outstanding invoice, other than the billing records we are legally required to retain.',
  'web.legal.terms.developer.title': 'API, MCP and service accounts',
  'web.legal.terms.developer.body':
    'Programmatic access is governed additionally by the API and MCP Terms, including rate limits, scope requirements and the rule that a service account never inherits a human full permissions.',

  /* Privacy -------------------------------------------------------------- */
  'web.legal.privacy.title': 'Privacy Policy',
  'web.legal.privacy.summary':
    'What Relay collects, why, who processes it, how long it is kept, and how to get it out or have it deleted.',
  'web.legal.privacy.collect.title': 'What we hold',
  'web.legal.privacy.collect.account':
    'Account and profile: your name, email, workspace membership and role.',
  'web.legal.privacy.collect.connections':
    'Social connections: the platform account identifier, its display name, its type, the granted scopes and an encrypted access token. Tokens are stored with envelope encryption and are never written to a log.',
  'web.legal.privacy.collect.content':
    'Content and media you create, upload or import, including the rights and provenance you record with it.',
  'web.legal.privacy.collect.schedules':
    'Schedules, approval decisions, publication receipts and audit events.',
  'web.legal.privacy.collect.analytics':
    'Metrics retrieved from platforms about posts you published through Relay.',
  'web.legal.privacy.collect.billing':
    'Billing references held by Polar. Relay does not store your card details.',
  'web.legal.privacy.collect.technical':
    'Device and log data needed to operate and secure the service, redacted by default.',
  'web.legal.privacy.collect.agent':
    'Agent and API activity: which credential took which action, with an input hash rather than the input.',
  'web.legal.privacy.minimization.title': 'What we deliberately do not do',
  'web.legal.privacy.minimization.scopes':
    'We request only the platform scopes the features you have enabled actually need.',
  'web.legal.privacy.minimization.history':
    'We do not ingest your entire social history in order to draw a chart.',
  'web.legal.privacy.minimization.logs':
    'Post content is redacted from general logs and from support tooling.',
  'web.legal.privacy.minimization.training':
    'Your content is not used to train our models or anyone models by default.',
  'web.legal.privacy.subprocessors.title': 'Who else processes it',
  'web.legal.privacy.subprocessors.body':
    'The current subprocessor list is published separately and changes are announced there before they take effect.',
  'web.legal.privacy.retention.title': 'How long we keep it',
  'web.legal.privacy.rights.title': 'Your controls',
  'web.legal.privacy.rights.export':
    'Download your content, receipts and analytics as JSON and CSV with a media archive.',
  'web.legal.privacy.rights.revoke':
    'Disconnect one social account without deleting the workspace. Tokens are revoked at the platform and deleted here.',
  'web.legal.privacy.rights.delete':
    'Delete a project, a piece of content, a media file or the entire account.',
  'web.legal.privacy.rights.cancelJobs':
    'Cancel scheduled jobs before deleting anything, so nothing publishes after you leave.',
  'web.legal.privacy.rights.sessions':
    'See and revoke active sessions, API keys, agent credentials, webhooks and platform permissions.',
  'web.legal.privacy.rights.consent':
    'Consent preferences are versioned and auditable, so you can see what you agreed to and when.',
  'web.legal.privacy.deletion.title': 'Deleting data held at a platform',
  'web.legal.privacy.deletion.body':
    'Disconnecting an account in Relay revokes the token at the platform and deletes the credential here. Content already published on a platform is governed by that platform and has to be deleted there. Where a platform requires deletion of derived data within a fixed period after revocation, we meet that period. For Google and YouTube data that period is currently 30 days.',
  'web.legal.privacy.transfers.title': 'International transfers',
  'web.legal.privacy.transfers.body':
    'Hosting regions and the transfer mechanism are being finalized with counsel and will be named here, together with the safeguards that apply, before launch.',

  /* Acceptable use ------------------------------------------------------- */
  'web.legal.aup.title': 'Acceptable Use Policy',
  'web.legal.aup.summary':
    'Relay helps you publish content you are authorized to publish. It is not built to help anyone evade a platform limit, fake an endorsement or send unwanted messages.',
  'web.legal.aup.prohibited.title': 'Not permitted',
  'web.legal.aup.prohibited.spam':
    'Spam, unsolicited bulk messages, replies or mentions, engagement bait, and repeated unwanted content.',
  'web.legal.aup.prohibited.linkSchemes':
    'Automated directory or form submissions, bulk outreach, link schemes, paid or reciprocal links intended to manipulate search ranking, and community promotion that breaks the destination rules.',
  'web.legal.aup.prohibited.inauthentic':
    'Coordinated inauthentic behaviour, multi account amplification presented as independent, engagement pods, fake reviews, ratings or install counts, automated likes and follows, and trend manipulation.',
  'web.legal.aup.prohibited.duplicate':
    'Publishing duplicate or substantially similar content across many accounts where the platform prohibits it.',
  'web.legal.aup.prohibited.impersonation':
    'Impersonation, phishing, fraud, scams, malware, credential theft and deceptive installation.',
  'web.legal.aup.prohibited.harm':
    'Harassment, doxxing, sexual exploitation, non consensual intimate media, hate or violent extremist content, and illegal goods or services.',
  'web.legal.aup.prohibited.political':
    'Political manipulation and automated political persuasion where it is prohibited. Political content, where permitted at all, is subject to enhanced review.',
  'web.legal.aup.prohibited.rights':
    'Copyright, trademark and publicity violations, unlicensed music or media, synthetic likenesses without rights and disclosure, and undisclosed paid endorsements.',
  'web.legal.aup.prohibited.circumvention':
    'Bypassing official APIs, rate limits, audits, account controls or platform enforcement using browser automation, cookie replay or scraping.',
  'web.legal.aup.prohibited.restrictedStores':
    'Automated submission to app stores, the Chrome Web Store or other restricted submission systems through unauthorized interfaces.',
  'web.legal.aup.prohibited.banEvasion':
    'Evading an account ban or running coordinated account farms.',
  'web.legal.aup.prohibited.training':
    'Training or evaluating models on third party or other customers content without authorization.',
  'web.legal.aup.controls.title': 'The controls that enforce this',
  'web.legal.aup.controls.duplicate':
    'Exact and near duplicate fingerprinting by workspace, account, platform and time window, with a cross account similarity check.',
  'web.legal.aup.controls.cadence':
    'Account level and workspace level cadence budgets, plus mention, hashtag, URL and domain volume checks.',
  'web.legal.aup.controls.escalation':
    'New account, new domain and bulk action escalation, and a maximum number of repetitions for any repeating campaign.',
  'web.legal.aup.controls.linkSafety':
    'Destination scanning on short links, with emergency disable and an abuse report channel.',
  'web.legal.aup.controls.workspaceCaps':
    'A workspace owner can set stricter limits than the plan allows. Risk controls cannot be loosened by paying more.',
  'web.legal.aup.enforcement.title': 'Enforcement and appeal',
  'web.legal.aup.enforcement.body':
    'Where we can, we block before the external action rather than after it, and we record the reason, the rule version and the appeal path. Repeated or serious behaviour goes to a trust review by a person. You will be told what happened, without a level of detail that would help someone evade the check. Every decision can be appealed and reversed.',
  'web.legal.aup.report.title': 'Reporting abuse',
  'web.legal.aup.report.body':
    'If content published through Relay breaks these rules, tell us. Include the post URL and what is wrong with it.',

  /* AI policy ------------------------------------------------------------ */
  'web.legal.ai.title': 'AI Use and Generated Content Policy',
  'web.legal.ai.summary':
    'Which features use a model, what is sent, what is kept, what you stay responsible for, and why Relay does not generate media.',
  'web.legal.ai.features.title': 'Where a model is used',
  'web.legal.ai.features.text':
    'Text assistance in the composer: rewriting, shortening and adapting for a platform.',
  'web.legal.ai.features.translation':
    'Translation and transcreation into your content languages, against your project glossary.',
  'web.legal.ai.features.feedback': 'Content feedback and the four week growth plan.',
  'web.legal.ai.features.provider':
    'These features call DeepSeek. The model identifiers currently in use are published in the documentation and any change is listed on the changelog.',
  'web.legal.ai.data.title': 'What is sent, and what happens to it',
  'web.legal.ai.data.sent':
    'Only the text you asked us to work on, the instruction, and the project context you chose to attach. Credentials, tokens and other customers content are never in a model context.',
  'web.legal.ai.data.training':
    'Your content is not used to train our models. We configure providers so it is not used to train theirs.',
  'web.legal.ai.data.optOut':
    'Optional AI features can be turned off per workspace. Publishing, scheduling, approvals and analytics do not depend on them.',
  'web.legal.ai.responsibility.title': 'What stays yours',
  'web.legal.ai.responsibility.body':
    'A model can be confidently wrong. You are responsible for checking facts, claims, names, numbers and tone before you publish, and for any disclosure a platform requires. No AI feature guarantees reach, engagement or ranking, and none is offered as one.',
  'web.legal.ai.disclosure.title': 'Disclosure and provenance',
  'web.legal.ai.disclosure.body':
    'Relay records whether content was AI assisted in its internal history, reminds you where a platform requires an altered or synthetic media disclosure, and stores the provenance you provide with an imported asset. Where a platform offers a disclosure field, Relay sets it from your declaration rather than guessing.',
  'web.legal.ai.blocks.title': 'What the AI features refuse',
  'web.legal.ai.blocks.impersonation': 'Impersonating a real person or a public figure.',
  'web.legal.ai.blocks.ncii': 'Non consensual intimate imagery, in any form.',
  'web.legal.ai.blocks.fabrication':
    'Fabricated testimonials, invented customers and invented performance figures.',
  'web.legal.ai.blocks.unverified':
    'Presenting a model generated URL as a verified opportunity. Opportunity and tool recommendations come only from the curated catalog.',
  'web.legal.ai.noMedia.title': 'Why there is no image or video generation',
  'web.legal.ai.noMedia.body':
    'Relay has not collected the verified visual system, product detail, asset rights, likeness permissions and campaign context that brand ready output would require, and in app generation would need its own consent, provenance, safety evaluation and cost controls. Media model capability, licensing, pricing and retention also change quickly, which is why our tool recommendations carry dates. You keep creative control by choosing a specialist tool and importing the approved asset. Relay handles adaptation, approval, publishing and measurement.',
  'web.legal.ai.noMedia.caveat':
    'A tool appearing in our radar is not a statement that its output is safe or rights cleared. Its documented caveats are shown with it and your normal rights declaration still applies.',

  /* Cookies -------------------------------------------------------------- */
  'web.legal.cookies.title': 'Cookie Policy',
  'web.legal.cookies.summary':
    'What is stored in your browser, why, and what happens if you refuse the optional parts.',
  'web.legal.cookies.essential.title': 'Strictly necessary',
  'web.legal.cookies.essential.body':
    'A session cookie that keeps you signed in, a cross site request forgery token, and a preference cookie holding your theme and time zone choice. These cannot be turned off without breaking sign in, and they are not used for advertising.',
  'web.legal.cookies.analytics.title': 'Product analytics',
  'web.legal.cookies.analytics.body':
    'Aggregate, first party measurement of which screens are used, so we can fix the ones that are not working. It is optional, it is off until you allow it, and refusing it changes nothing about the product.',
  'web.legal.cookies.marketing.title': 'Advertising',
  'web.legal.cookies.marketing.body':
    'We do not run advertising cookies, we do not embed third party advertising pixels, and we do not sell or share personal information for cross context behavioural advertising.',
  'web.legal.cookies.shortLinks.title': 'Tracked short links',
  'web.legal.cookies.shortLinks.body':
    'A short link click creates first party analytics for the workspace that owns the link. Location and device data are minimized, bot traffic is classified out, IP addresses are truncated or discarded promptly, and a workspace can turn tracking off or shorten retention. Nothing sensitive is ever put in a slug or a query parameter.',
  'web.legal.cookies.control.title': 'Changing your mind',
  'web.legal.cookies.control.body':
    'The consent choice is stored with a version and can be changed at any time in Settings, under data controls. Withdrawing consent takes effect immediately.',

  /* Subprocessors -------------------------------------------------------- */
  'web.legal.subprocessors.title': 'Subprocessors',
  'web.legal.subprocessors.summary':
    'The companies that process customer data on our behalf, what they do, and where.',
  'web.legal.subprocessors.notice.title': 'Change notice',
  'web.legal.subprocessors.notice.body':
    'A new subprocessor is published here before it starts processing customer data, with at least 30 days notice for a change that materially affects processing. Customers with a data processing addendum can object during that window.',
  'web.legal.subprocessors.column.name': 'Subprocessor',
  'web.legal.subprocessors.column.purpose': 'What it processes for us',
  'web.legal.subprocessors.column.data': 'Data categories',
  'web.legal.subprocessors.column.region': 'Processing region',
  'web.legal.subprocessors.platforms.title': 'Social platforms are not subprocessors',
  'web.legal.subprocessors.platforms.body':
    'When you publish, Relay transmits your content to the platform account you selected, at your instruction. Those platforms are independent controllers of what they receive and their own terms govern it.',

  /* Refunds -------------------------------------------------------------- */
  'web.legal.refunds.title': 'Refund and Cancellation Policy',
  'web.legal.refunds.summary':
    'How to cancel, what happens to your data, and when you get money back.',
  'web.legal.refunds.cancel.title': 'Cancelling',
  'web.legal.refunds.cancel.body':
    'Cancel from Settings without contacting support. Cancelling during the seven day trial means no charge is attempted and the cancellation screen confirms that in writing. Cancelling after the trial keeps your access until the end of the period you already paid for.',
  'web.legal.refunds.refund.title': 'Refunds',
  'web.legal.refunds.refund.body':
    'If the service did not work as described, contact support and we will refund the affected period. Mandatory consumer withdrawal rights, including the statutory cooling off period where it applies to you, are honoured in full and are not limited by anything on this page. Refunds are issued by Polar, our merchant of record, to the original payment method.',
  'web.legal.refunds.usage.title': 'Platform usage charges',
  'web.legal.refunds.usage.body':
    'Usage passed through from a platform, such as X per operation pricing, covers a cost we already paid on your behalf for an action you confirmed. It is refundable when the charge was our error, for example a duplicate dispatch caused by a defect on our side.',
  'web.legal.refunds.data.title': 'What happens to your data',
  'web.legal.refunds.data.body':
    'Nothing is deleted at cancellation. The workspace becomes read only, scheduled posts stop rather than publishing, and you keep an export window before deletion. Deletion is never made conditional on paying an invoice, apart from the billing records we must keep by law.',
  'web.legal.refunds.failed.title': 'A failed payment',
  'web.legal.refunds.failed.body':
    'Polar retries and emails you. During the grace period publishing continues. After it, the workspace becomes read only and scheduled posts stop. Nothing is disconnected and nothing is deleted.',

  /* DMCA ----------------------------------------------------------------- */
  'web.legal.dmca.title': 'Copyright and Takedown',
  'web.legal.dmca.summary':
    'How to report content hosted by Relay that infringes your rights, and how to respond if yours was removed.',
  'web.legal.dmca.scope.title': 'What we can act on',
  'web.legal.dmca.scope.body':
    'Relay can remove material stored in our systems, such as a media file or a draft. Content already published on a social platform lives on that platform and has to be reported to it, because we cannot delete a post we do not host. We will tell you which of the two applies to your report.',
  'web.legal.dmca.notice.title': 'Sending a notice',
  'web.legal.dmca.notice.identify':
    'Identify the copyrighted work and the material you say infringes it, with a URL we can reach.',
  'web.legal.dmca.notice.contact': 'Give your name, address, telephone number and email.',
  'web.legal.dmca.notice.goodFaith':
    'State that you believe in good faith that the use is not authorized by the rights holder, its agent or the law.',
  'web.legal.dmca.notice.accuracy':
    'State that the information is accurate and, under penalty of perjury, that you are authorized to act for the rights holder.',
  'web.legal.dmca.notice.signature': 'Sign it, physically or electronically.',
  'web.legal.dmca.counter.title': 'Counter notice',
  'web.legal.dmca.counter.body':
    'If your material was removed and you believe that was a mistake or a misidentification, you can send a counter notice with the same contact details, identifying the material and where it was, and consenting to the jurisdiction that will be named here. We will forward it to the person who complained.',
  'web.legal.dmca.repeat.title': 'Repeat infringers',
  'web.legal.dmca.repeat.body':
    'Accounts that repeatedly infringe are suspended and then terminated. Bad faith notices, used to remove a competitor content, are also grounds for termination.',

  /* Security ------------------------------------------------------------- */
  'web.legal.security.title': 'Security and Responsible Disclosure',
  'web.legal.security.summary':
    'How Relay protects the credentials you trust it with, and how to report a problem you find.',
  'web.legal.security.tokens.title': 'Social credentials',
  'web.legal.security.tokens.body':
    'Platform tokens are encrypted with envelope encryption under a managed key, rotated, stored apart from content and billing data, and redacted from every log. A token is never sent to a browser, never placed in a model context and never included in an error message.',
  'web.legal.security.tenancy.title': 'Tenancy',
  'web.legal.security.tenancy.body':
    'Isolation is enforced three times: at the edge when you authenticate, in the application service when it authorizes the action, and in PostgreSQL through row level security. Being signed in is never treated as permission. Cross workspace access attempts are tested in continuous integration and must fail.',
  'web.legal.security.publishing.title': 'Publishing integrity',
  'web.legal.security.publishing.body':
    'Every external write carries an idempotency key and produces an immutable receipt. Duplicate publication is treated as a defect with a target of zero, and the test suite includes worker crashes after platform acceptance, platform timeouts, duplicated webhooks, revoked tokens at dispatch and daylight saving transitions.',
  'web.legal.security.program.title': 'The programme',
  'web.legal.security.program.threatModel':
    'A written threat model covering OAuth, tenancy, publishing, MCP, media, billing and analytics.',
  'web.legal.security.program.pentest':
    'An independent security review focused on token leakage and cross tenant access before paid launch.',
  'web.legal.security.program.access':
    'Least privilege production access, multi factor authentication, and a device and session inventory.',
  'web.legal.security.program.supplyChain':
    'Dependency and container scanning with patch service levels, and signed build provenance where practical.',
  'web.legal.security.program.logging':
    'Centralized logging that redacts by default, with anomaly alerting.',
  'web.legal.security.program.backups':
    'Encrypted backups with tested restoration and a documented rotation.',
  'web.legal.security.disclosure.title': 'Reporting a vulnerability',
  'web.legal.security.disclosure.body':
    'Email us with enough detail to reproduce the issue. We acknowledge within two business days, keep you updated, and credit you when you want the credit. Please do not access another customer data, degrade the service, or run automated scanning against production. Test against your own workspace.',
  'web.legal.security.disclosure.safeHarbor':
    'We will not pursue legal action for good faith research that follows this policy. The exact safe harbour wording is with counsel.',
  'web.legal.security.incidents.title': 'If something goes wrong',
  'web.legal.security.incidents.body':
    'We have an incident response plan with named decision makers, severity levels, evidence preservation and notification duties. Incidents that affected publishing are published on the status page with a timeline and what changed afterwards, including the ones we caused.',

  /* Accessibility -------------------------------------------------------- */
  'web.legal.accessibility.title': 'Accessibility Statement',
  'web.legal.accessibility.summary':
    'The standard Relay is built to, what we have verified, what we know is not right yet, and how to tell us.',
  'web.legal.accessibility.standard.title': 'The standard',
  'web.legal.accessibility.standard.body':
    'Relay targets WCAG 2.2 level AA across the product and this site. Accessibility is a merge requirement here, not a later ticket, and a screen that fails it does not ship.',
  'web.legal.accessibility.measures.title': 'What that means in practice',
  'web.legal.accessibility.measures.keyboard':
    'Everything is operable from the keyboard, with a visible focus ring and a logical focus order. There is no drag only interaction anywhere.',
  'web.legal.accessibility.measures.contrast':
    'Every colour pair in the design system is asserted at 4.5 to 1 for body text and 3 to 1 for large text and control edges, in both the light and the dark theme, by an automated test.',
  'web.legal.accessibility.measures.colour':
    'Status, capability and freshness always carry an icon and a word as well as a colour.',
  'web.legal.accessibility.measures.announcements':
    'Save state, validation changes, upload progress, schedule confirmation and publish results are announced to screen readers.',
  'web.legal.accessibility.measures.zoom':
    'Layouts work at 320 pixels wide and at 200 percent zoom without horizontal page scrolling. Wide tables scroll inside their own container.',
  'web.legal.accessibility.measures.motion':
    'A reduced motion preference removes every non essential transition.',
  'web.legal.accessibility.measures.targets':
    'Touch targets are at least 44 pixels on a coarse pointer.',
  'web.legal.accessibility.known.title': 'Known gaps',
  'web.legal.accessibility.known.body':
    'We will list specific known issues here with a fix date as they are found, rather than claiming full conformance. An independent audit is planned before general availability and its findings will be published here.',
  'web.legal.accessibility.feedback.title': 'Tell us about a barrier',
  'web.legal.accessibility.feedback.body':
    'Describe what you were trying to do, the page, and the assistive technology you use. We reply within five business days and will offer another way to complete the task while we fix it.',

  /* API and MCP terms ---------------------------------------------------- */
  'web.legal.apiTerms.title': 'API and MCP Terms',
  'web.legal.apiTerms.summary':
    'Additional terms for programmatic access, including agent credentials, rate limits and what a service account may never do.',
  'web.legal.apiTerms.credentials.title': 'Credentials',
  'web.legal.apiTerms.credentials.body':
    'An API key or agent credential identifies a scoped service account. It is not a copy of a person account and it never inherits their full permissions. Keys are shown once, are revocable at any time, and must not be embedded in a client application or a public repository.',
  'web.legal.apiTerms.scopes.title': 'Scopes',
  'web.legal.apiTerms.scopes.body':
    'Reading, drafting, requesting approval, scheduling, publishing immediately, cancelling, analytics and billing are separate scopes. Request the smallest set the integration needs. Immediate publishing and other high risk actions require explicit human confirmation by default and that default is set per workspace, not per credential.',
  'web.legal.apiTerms.limits.title': 'Rate limits and idempotency',
  'web.legal.apiTerms.limits.body':
    'Every write requires an idempotency key. Replaying a request with the same key returns the original result. Rate limits are published in the documentation and are returned in the response headers, and a limit response tells you when it resets.',
  'web.legal.apiTerms.agents.title': 'Agent behaviour',
  'web.legal.apiTerms.agents.body':
    'A single call may not silently publish to every connected account. Bulk actions, a new domain, a new account, a sensitive category, a paid endorsement, a privacy change or content altered after approval always escalate for a human decision. Every agent and every workspace has a kill switch.',
  'web.legal.apiTerms.prohibited.title': 'Not permitted through the API',
  'web.legal.apiTerms.prohibited.body':
    'Reselling access without a written agreement, using Relay as a relay for content you are not authorized to publish, circumventing approval policy, and any use that breaks the Acceptable Use Policy. Programmatic access is subject to the same anti spam controls as the web app.',
  'web.legal.apiTerms.changes.title': 'Change policy',
  'web.legal.apiTerms.changes.body':
    'Additive changes ship without notice. Breaking changes get a new version, an announced deprecation window and a migration note on the changelog. Error codes do not change meaning within a version.',

  /* Affiliate terms ------------------------------------------------------ */
  'web.legal.affiliate.title': 'Affiliate and Creator Terms',
  'web.legal.affiliate.summary':
    'What we pay, what we require, and what will get an account closed.',
  'web.legal.affiliate.commission.title': 'Commission',
  'web.legal.affiliate.commission.body':
    'Recurring commission on referred subscriptions for up to twelve months, subject to fraud review. Commission is held until the refund window closes and is reversed if the customer refunds. Payouts run through Polar.',
  'web.legal.affiliate.disclosure.title': 'Disclosure is not optional',
  'web.legal.affiliate.disclosure.body':
    'Every place you share a referral link must disclose the commercial relationship clearly and close to the link, in the language of the audience. This applies to videos, posts, newsletters, articles and community replies alike.',
  'web.legal.affiliate.honesty.title': 'Paid for work, not for praise',
  'web.legal.affiliate.honesty.body':
    'A sponsored tutorial contract never requires a positive conclusion. You may publish criticism and still be paid. We do not buy reviews, votes, ratings or installs, and we do not offer an incentive conditional on a positive review.',
  'web.legal.affiliate.prohibited.title': 'Grounds for closing an affiliate account',
  'web.legal.affiliate.prohibited.brandBidding':
    'Bidding on our brand terms in paid search, or running ads that imply you are us.',
  'web.legal.affiliate.prohibited.spam':
    'Unsolicited email, mass community posting, or link dropping in threads that did not ask.',
  'web.legal.affiliate.prohibited.cookieStuffing':
    'Cookie stuffing, forced clicks, self referral and coupon squatting.',
  'web.legal.affiliate.prohibited.claims':
    'Inventing customer results, fabricating a testimonial, or claiming Relay does something it does not, including anything about AI media generation.',
  'web.legal.affiliate.prohibited.trademark':
    'Registering a domain, handle or app listing that uses our name in a way that suggests you are the company.',

  /* ---------------------------------------------------------------------- */
  /* Platform names and per platform facts                                   */
  /* ---------------------------------------------------------------------- */

  'web.marketing.provider.x.label': 'X',
  'web.marketing.provider.linkedin.label': 'LinkedIn',
  'web.marketing.provider.instagram.label': 'Instagram',
  'web.marketing.provider.facebook.label': 'Facebook',
  'web.marketing.provider.youtube.label': 'YouTube',
  'web.marketing.provider.tiktok.label': 'TikTok',
  'web.marketing.provider.threads.label': 'Threads',
  'web.marketing.provider.bluesky.label': 'Bluesky',

  'web.marketing.provider.x.accountTypes':
    'Isang personal o negosyo na X account na kinokontrol mo.',
  'web.marketing.provider.x.restriction':
    'Ang awtomatikong pag-post ay nangangailangan ng may-ari ng account ng malinaw na pahintulot, na itinala ng Relay. Hindi pinahihintulutan ang mga duplicate o halos kaparehong post sa mga account, at hindi ginagawa ang mga hindi hinihinging automated na tugon.',
  'web.marketing.provider.x.cost':
    'Ang X ay naniningil para sa bawat API na operasyon at naniningil ng higit pa para sa isang post na naglalaman ng URL. Tinatantya ng Relay ang gastos bago mo kumpirmahin at ipasa ito nang walang markup.',

  'web.marketing.provider.linkedin.accountTypes':
    'Isang profile ng miyembro, o isang Pahina ng organisasyon kung saan hawak mo ang tamang tungkulin.',
  'web.marketing.provider.linkedin.restriction':
    'Ang pag-publish sa ngalan ng isang organisasyon ay nangangailangan ng isang aprubadong produkto ng Pamamahala ng Komunidad at isang na-verify na pagkakakilanlan ng negosyo. Ang analytics ng post ng miyembro ay nakadepende sa isang pahintulot sa pagbabasa Nagsara ang LinkedIn sa mga bagong application, kaya hindi ito iaalok ng Relay.',
  'web.marketing.provider.linkedin.cost':
    'Walang bayad sa bawat operasyon. Nalalapat ang mga limitasyon sa araw-araw na aplikasyon at miyembro.',

  'web.marketing.provider.instagram.accountTypes':
    'Isang propesyonal na Instagram account, negosyo o tagalikha.',
  'web.marketing.provider.instagram.restriction':
    'Ang Instagram content publishing ay available lang para sa mga propesyonal na account. Ang isang consumer account ay hindi maaaring mai-publish sa pamamagitan ng anumang application, kabilang ang isang ito. Ginagamit ng pag-publish ang opisyal na lalagyan at pagkakasunud-sunod ng pag-publish, at kinukumpirma ng Relay ang huling estado sa halip na iulat ang pag-upload bilang tagumpay.',
  'web.marketing.provider.instagram.cost':
    'Walang bayad sa bawat operasyon. Kinakailangan ang pagsusuri sa meta app at pag-verify ng negosyo.',

  'web.marketing.provider.facebook.accountTypes': 'Isang Facebook Page na iyong pinangangasiwaan.',
  'web.marketing.provider.facebook.restriction':
    'Ang target sa pag-publish ay isang Pahina. Ang pag-automate ng personal na profile ay hindi inaalok ng API at hindi ito sinusubukan ng Relay.',
  'web.marketing.provider.facebook.cost':
    'Walang bayad sa bawat operasyon. Kinakailangan ang pagsusuri sa meta app at pag-verify ng negosyo.',

  'web.marketing.provider.youtube.accountTypes':
    'Isang YouTube channel na konektado sa pamamagitan ng iyong Google account.',
  'web.marketing.provider.youtube.restriction':
    'Ang isang proyektong hindi nakapasa sa Google API compliance audit ay maaari lamang mag-upload bilang pribado. Hindi ilalarawan ng Relay ang pampublikong pag-upload bilang available hanggang sa pumasa ang audit na iyon, at ang screen ng koneksyon ay nagsasaad kung saan ang iyong mga pag-upload ay mapupunta.',
  'web.marketing.provider.youtube.cost':
    'Walang bayad sa bawat operasyon. Nalalapat ang pang-araw-araw na quota at hindi maaaring ibahagi sa mga proyekto.',

  'web.marketing.provider.tiktok.accountTypes':
    'Isang TikTok account na may awtorisasyon sa Direct Post.',
  'web.marketing.provider.tiktok.restriction':
    'Hanggang sa pumasa ang pag-audit ng Pag-post ng Nilalaman na API, pribado ang mga post at nalalapat ang mga limitasyon sa bawat account. Sa oras ng pag-publish, kinukuha ng Relay ang kasalukuyang impormasyon ng creator, ipinapakita ang mga available na opsyon sa privacy nang hindi pinipili ang isa, at humihingi ng komento, mga setting ng duet at stitch at ang deklarasyon ng komersyal na nilalaman.',
  'web.marketing.provider.tiktok.cost':
    'Walang bayad sa bawat operasyon. Inilalapat ng unaudited mode ang mga pang-araw-araw na takip sa pag-post.',

  'web.marketing.provider.threads.accountTypes':
    'Isang Threads profile na naka-link sa isang propesyonal na Instagram account.',
  'web.marketing.provider.threads.restriction':
    'Ang pag-publish ay sumusunod sa Meta container at pagkakasunud-sunod ng pag-publish. Bine-verify ang mga kakayahan laban sa opisyal na koleksyon bago ang anumang bagay dito ay tinatawag na suportado.',
  'web.marketing.provider.threads.cost': 'Walang bayad sa bawat operasyon.',

  'web.marketing.provider.bluesky.accountTypes':
    'Isang Bluesky account sa anumang hosting provider.',
  'web.marketing.provider.bluesky.restriction':
    'Isang bukas na protocol na walang hakbang sa pagsusuri ng aplikasyon. Nalalapat pa rin ang mga limitasyon sa rate at mga limitasyon sa laki ng talaan at ipinapatupad bago ipadala.',
  'web.marketing.provider.bluesky.cost': 'Walang bayad sa bawat operasyon.',
  'web.marketing.provider.mastodon.label': 'Mastodon',
  'web.marketing.provider.mastodon.accountTypes': 'Isang Mastodon account sa anumang instance.',
  'web.marketing.provider.mastodon.restriction':
    'Isang bukas na protocol na walang review ng app. Ang limit sa karakter ay itinatakda ng bawat instance at iginagalang ang mga rate limit nito.',
  'web.marketing.provider.mastodon.cost': 'Walang bayad bawat operasyon.',
  'web.marketing.provider.telegram.label': 'Telegram',
  'web.marketing.provider.telegram.accountTypes':
    'Isang Telegram bot na kontrolado mo, nagpo-post sa channel o grupo.',
  'web.marketing.provider.telegram.restriction':
    'Makapagpo-post lang ang bot kung saan ito idinagdag. Ang token ay credential ng app at pinipili ang target chat bawat koneksyon.',
  'web.marketing.provider.telegram.cost': 'Walang bayad bawat operasyon.',
  'web.marketing.provider.reddit.label': 'Reddit',
  'web.marketing.provider.reddit.accountTypes': 'Isang Reddit account na pinapayagang mag-post.',
  'web.marketing.provider.reddit.restriction':
    'Ang pagsulat sa Reddit ay nangangailangan ng aprubadong app. Ang mga post ay text o link sa mga pinapayagang subreddit; walang awtomatikong komento o boto.',
  'web.marketing.provider.reddit.cost': 'Walang bayad bawat operasyon.',
  'web.marketing.provider.wordpress.label': 'WordPress',
  'web.marketing.provider.wordpress.accountTypes': 'Isang WordPress site na may password ng app.',
  'web.marketing.provider.wordpress.restriction':
    'Lumalabas ang mga post sa REST API ng site bilang konektadong user. Hindi pa itinatayo ang pag-upload ng larawan at video.',
  'web.marketing.provider.wordpress.cost': 'Walang bayad bawat operasyon.',
  'web.marketing.provider.medium.label': 'Medium',
  'web.marketing.provider.medium.accountTypes':
    'Isang profile ng may-akda sa Medium na konektado sa pamamagitan ng OAuth.',
  'web.marketing.provider.medium.restriction':
    'Lumalabas ang mga post bilang pampublikong kuwento sa Markdown. Walang pagtanggal ang integration API, kaya hindi ito inaalok.',
  'web.marketing.provider.medium.cost': 'Walang bayad bawat operasyon.',
  'web.marketing.provider.devto.label': 'Dev.to',
  'web.marketing.provider.devto.accountTypes':
    'Isang Dev.to profile na konektado gamit ang API key nito.',
  'web.marketing.provider.devto.restriction':
    'Lumalabas ang mga artikulo bilang pampublikong Markdown post. Hindi pa itinatayo ang pag-upload ng larawan at analytics.',
  'web.marketing.provider.devto.cost': 'Walang bayad bawat operasyon.',
  'web.marketing.provider.pinterest.label': 'Pinterest',
  'web.marketing.provider.pinterest.accountTypes':
    'Isang Pinterest business account na konektado sa pamamagitan ng OAuth.',
  'web.marketing.provider.pinterest.restriction':
    'Ang pin ay nangangailangan ng larawan at sariling board. Nangangailangan ng review ng app ang pagsulat; binabasa ang mga board sa koneksyon.',
  'web.marketing.provider.pinterest.cost': 'Walang bayad bawat operasyon.',
  'web.marketing.provider.discord.label': 'Discord',
  'web.marketing.provider.discord.accountTypes':
    'Isang Discord bot na kontrolado mo, nagpo-post sa mga text channel.',
  'web.marketing.provider.discord.restriction':
    'Makapagpo-post lang ang bot sa mga channel na nakikita nito. Suportado ang mga text message; hindi pa ang mga attachment.',
  'web.marketing.provider.discord.cost': 'Walang bayad bawat operasyon.',
  'web.marketing.provider.slack.label': 'Slack',
  'web.marketing.provider.slack.accountTypes':
    'Isang Slack workspace na konektado sa pamamagitan ng OAuth app.',
  'web.marketing.provider.slack.restriction':
    'Napupunta ang mga mensahe sa pampubliko at pribadong channel kung nasaan ang app. Hindi pa itinatayo ang pag-upload ng file at analytics.',
  'web.marketing.provider.slack.cost': 'Walang bayad bawat operasyon.',

  /* ---------------------------------------------------------------------- */
  /* Capability matrix notes                                                 */
  /* ---------------------------------------------------------------------- */

  'web.capabilities.short.supported': 'Sinusuportahan',
  'web.capabilities.short.unsupported': 'Hindi ito inaalok ng platform',
  'web.capabilities.short.not_implemented': 'Hindi pa nagagawa',
  'web.capabilities.short.requires_review': 'Nangangailangan ng pagsusuri sa platform',
  'web.capabilities.notesTitle': 'Mga tala at mapagkukunan',
  'web.capabilities.noteRef': 'Tandaan {number}',
  'web.capabilities.summary':
    '{supported, plural, one {# suportadong kakayahan} other {# mga kakayahan na suportado}}, {requiresReview, plural, one {# naghihintay sa isang pagsusuri sa platform} other {# naghihintay sa isang pagsusuri sa platform}}, {notImplemented, plural, one {# hindi pa natatayo} other {# hindi pa natatayo}}, {unsupported, plural, one {# hindi nag-aalok ang platform} other {# hindi nag-aalok ang platform}}.',
  'web.capabilities.buildState.title': 'Wala pang connector na nagdadala ng trapiko ng customer',
  'web.capabilities.buildState.body':
    "Ang Relay ay nasa build. Ang talahanayang ito ay sumasalamin sa mga kahulugan ng connector sa kasalukuyan, kung kaya't ang karamihan sa mga cell ay nagbabasa bilang hindi pa binuo. Ang isang cell ay magiging suportado lamang pagkatapos maipasa ng connector na iyon ang kahulugan nito na tapos na, kasama ang mga pagsubok sa kontrata laban sa mga naitalang platform fixture. Ang mga cell na nagsasabing ang isang platform ay hindi nag-aalok ng isang bagay, o naglalagay nito sa likod ng isang pagsusuri, ay mga katotohanan tungkol sa platform at pinal na.",
  'web.capabilities.note.instagramProfessional':
    'Mga propesyonal na account lamang. Ang isang consumer account ay hindi maaaring mai-publish sa pamamagitan ng anumang application.',
  'web.capabilities.note.facebookPagesOnly':
    'Mga pahina lamang. Ang API ay hindi nagpa-publish sa isang personal na profile.',
  'web.capabilities.note.youtubeAudit':
    'Hanggang sa pumasa ang Google API compliance audit, mag-a-upload ng lupa bilang pribado.',
  'web.capabilities.note.tiktokAudit':
    'Hanggang sa pumasa ang pag-audit ng Pag-post ng Nilalaman na API, pribado at may limitasyon ang mga post.',
  'web.capabilities.note.tiktokPrivacy':
    'Ang opsyon sa privacy ay kinukuha sa oras ng pag-publish at dapat piliin ng isang tao.',
  'web.capabilities.note.linkedinMemberAnalytics':
    'Ang analytics ng post ng miyembro ay nangangailangan ng pahintulot sa pagbasa LinkedIn ay nagsara sa mga bagong application.',
  'web.capabilities.note.linkedinOrgAccess':
    'Nangangailangan ng inaprubahang produkto ng Pamamahala ng Komunidad at isang na-verify na negosyo.',
  'web.capabilities.note.linkedinDocuments':
    'Ang LinkedIn ay ang tanging konektadong platform na may uri ng post ng dokumento.',
  'web.capabilities.note.metaReview':
    'Nangangailangan ng pagsusuri sa Meta app at pag-verify ng negosyo.',
  'web.capabilities.note.xConsent':
    'Nangangailangan ng naitalang pahintulot mula sa may hawak ng account para sa awtomatikong pag-post.',
  'web.capabilities.note.xDisclosure':
    'Nagbibigay ang platform ng field na gawa sa AI, na itinakda ng Relay mula sa iyong deklarasyon.',
  'web.capabilities.note.noDestinations':
    'Ang platform na ito ay walang patutunguhan na konsepto tulad ng isang Pahina, board o komunidad.',
  'web.capabilities.note.noThreads':
    'Ang platform na ito ay walang katutubong multi post sequence.',
  'web.capabilities.note.noDocuments': 'Walang uri ng post ng dokumento ang platform na ito.',
  'web.capabilities.note.videoOnly':
    'Ang platform na ito ay tumatanggap lamang ng mga pag-upload ng video.',
  'web.capabilities.note.noAltText':
    'Ang platform na ito ay hindi tumatanggap ng alt text sa pamamagitan ng pag-publish nito API.',
  'web.capabilities.note.noPrivacyChoice':
    'Ang platform na ito ay hindi nag-aalok ng bawat post na opsyon sa privacy sa pamamagitan ng API nito.',
  'web.capabilities.note.noThumbnail':
    'Ang platform na ito ay hindi tumatanggap ng custom na thumbnail sa pamamagitan ng API nito.',
  'web.capabilities.note.inBuild':
    'Ang platform ay nag-aalok nito. Hindi pa ito naipapadala ng Relay.',
  'web.capabilities.note.noCarousel': 'Hindi nag-aalok ang platform ng swipeable carousel.',
  'web.capabilities.note.noDisclosure':
    'Walang patlang sa platform para sa paglalahad ng AI o komersyal na nilalaman.',
  'web.capabilities.note.noAnalytics':
    'Hindi naglalabas ang platform ng engagement metrics sa opisyal na API nito.',
  'web.capabilities.note.redditReview':
    'Ang pagsulat sa Reddit ay nangangailangan ng aprubadong data API app.',
  'web.capabilities.note.redditMedia': 'Hindi pa itinatayo ang image at video post para sa Reddit.',
  'web.capabilities.note.mediumImages':
    'Hindi tumatanggap ang integration API ng mga attachment na larawan.',
  'web.capabilities.note.mediumNoDelete': 'Walang delete endpoint ang integration API.',
  'web.capabilities.note.devtoImages':
    'Tumatanggap lang ang API ng katawan ng artikulo; hindi pa itinatayo ang pag-upload ng larawan.',
  'web.capabilities.note.pinterestNeedsImage':
    'Ang pin ay nangangailangan ng larawan; walang text-only pin.',
  'web.capabilities.note.pinterestReview':
    'Ang pagsulat sa Pinterest ay nangangailangan ng aprubadong access ng app.',

  /* ---------------------------------------------------------------------- */
  /* Status page surfaces                                                    */
  /* ---------------------------------------------------------------------- */

  'web.status.surface.web': 'Web app',
  'web.status.surface.api': 'REST API',
  'web.status.surface.mcp': 'MCP server',
  'web.status.surface.cli': 'CLI',
  'web.status.surface.webhooks': 'Paghahatid ng webhook',
  'web.status.surface.publishing': 'Mga manggagawa sa pag-publish',
  'web.status.surface.media': 'Pagproseso ng media',
  'web.status.surface.analytics': 'Pagkolekta ng Analytics',
  'web.status.surface.links': 'Mga pag-redirect ng maikling link',
  'web.status.surface.checkout': 'Checkout at pagsingil',
  'web.status.preLaunch.title': 'Ang Relay ay hindi pa available sa pangkalahatan',
  'web.status.preLaunch.body':
    'Live ang page na ito bago ang produkto, upang ang ugali sa pag-uulat ay umiiral mula sa unang customer sa halip na idagdag pagkatapos ng unang pagkawala. Ang mga ibabaw na nasa build ay minarkahan bilang ganoon sa halip na ipakita bilang malusog.',

  /* ---------------------------------------------------------------------- */
  /* Comparison targets                                                      */
  /* ---------------------------------------------------------------------- */

  'web.compare.product.postiz': 'Postiz',
  'web.compare.product.buffer': 'Buffer',
  'web.compare.product.hootsuite': 'Hootsuite',
  'web.compare.product.later': 'Mamaya',
  'web.compare.product.metricool': 'Metricool',
  'web.compare.product.publer': 'Tagapaglathala',
  'web.compare.product.socialbee': 'SocialBee',
  'web.compare.product.typefully': 'Typefully',
  'web.compare.product.publishingApis': 'Mga API sa pag-publish ng developer',
  'web.compare.state.factCheckPending': 'Kasalukuyang isinasagawa ang fact check',

  /* ---------------------------------------------------------------------- */
  /* Tool radar categories                                                   */
  /* ---------------------------------------------------------------------- */

  'web.toolRadar.category.video': 'Pagbuo at pag-edit ng video',
  'web.toolRadar.category.image': 'Pagbuo ng imahe at pag-edit',
  'web.toolRadar.category.audio': 'Audio, boses at musika',
  'web.toolRadar.category.ugc': 'Avatar at creator style na video',
  'web.toolRadar.category.clipping': 'Mahabang video hanggang sa maiikling clip',
  'web.toolRadar.category.design': 'Disenyo at layout',
  'web.toolRadar.category.research': 'Pananaliksik at pangangalap ng pinagmulan',
  'web.toolRadar.category.workflow': 'Automation ng daloy ng trabaho',

  /* ---------------------------------------------------------------------- */
  /* Opportunity categories                                                  */
  /* ---------------------------------------------------------------------- */

  'web.opportunities.category.launch': 'Paglunsad ng produkto at mga direktoryo ng pagsisimula',
  'web.opportunities.category.review': 'Mga direktoryo ng software at pagsusuri',
  'web.opportunities.category.marketplace': 'Integration at automation marketplaces',
  'web.opportunities.category.community':
    'Mga thread ng showcase ng komunidad na nagpapahintulot sa mga pagsusumite',
  'web.opportunities.category.partner': 'Mga kasosyong ecosystem at mga direktoryo ng pagsasama',
  'web.opportunities.category.editorial': 'Mga tutorial ng bisita, podcast at newsletter',
  'web.opportunities.category.openSource':
    'Mga listahan ng open source at mga mapagkukunan ng dokumentasyon',

  /* ---------------------------------------------------------------------- */
  /* Subprocessors and retention                                             */
  /* ---------------------------------------------------------------------- */

  'web.legal.subprocessors.neon.label': 'Neon',
  'web.legal.subprocessors.neon.purpose': 'Managed PostgreSQL, authentication and object storage.',
  'web.legal.subprocessors.neon.data':
    'Account records, content, media, schedules, receipts and audit events.',
  'web.legal.subprocessors.temporal.label': 'Temporal Cloud',
  'web.legal.subprocessors.temporal.purpose':
    'Durable execution of publishing, retry and scheduling workflows.',
  'web.legal.subprocessors.temporal.data':
    'Workflow inputs limited to identifiers and minimized payloads.',
  'web.legal.subprocessors.polar.label': 'Polar',
  'web.legal.subprocessors.polar.purpose':
    'Merchant of record: checkout, subscriptions, taxes, invoices and refunds.',
  'web.legal.subprocessors.polar.data':
    'Name, email, billing address, payment method held by Polar, and subscription state.',
  'web.legal.subprocessors.deepseek.label': 'DeepSeek',
  'web.legal.subprocessors.deepseek.purpose':
    'Text assistance, translation and transcreation, and planning suggestions.',
  'web.legal.subprocessors.deepseek.data':
    'Only the text you submit to an AI feature and the project context you attached to it.',
  'web.legal.subprocessors.hosting.label': 'Application hosting and content delivery',
  'web.legal.subprocessors.hosting.purpose':
    'Serving the web app, the API and the short link service.',
  'web.legal.subprocessors.hosting.data': 'Request metadata and redacted logs.',
  'web.legal.subprocessors.email.label': 'Transactional email delivery',
  'web.legal.subprocessors.email.purpose':
    'Sign in links, approval requests, publish result notifications and trial reminders.',
  'web.legal.subprocessors.email.data': 'Name, email address and the message content.',
  'web.legal.subprocessors.monitoring.label': 'Error and performance monitoring',
  'web.legal.subprocessors.monitoring.purpose':
    'Diagnosing failures in publishing and in the interface.',
  'web.legal.subprocessors.monitoring.data':
    'Redacted stack traces, request identifiers and workspace identifiers. Post content is stripped.',
  'web.legal.subprocessors.region.pending': 'Region being confirmed',
  'web.legal.subprocessors.vendorPending': 'Vendor being selected',

  'web.legal.retention.column.data': 'Data',
  'web.legal.retention.column.period': 'How long it is kept',
  'web.legal.retention.credentials.label': 'Active platform credentials',
  'web.legal.retention.credentials.period':
    'Encrypted while the connection is active. Revoked at the platform and deleted here as soon as you disconnect.',
  'web.legal.retention.oauthState.label': 'OAuth transaction state',
  'web.legal.retention.oauthState.period': 'Minutes, then deleted.',
  'web.legal.retention.drafts.label': 'Drafts and media',
  'web.legal.retention.drafts.period':
    'While the account is active, or your own retention setting, with a trash grace period.',
  'web.legal.retention.receipts.label': 'Publication receipts and audit events',
  'web.legal.retention.receipts.period':
    'Kept for the plan and legal retention period, minimized, and exportable at any time.',
  'web.legal.retention.rawProvider.label': 'Raw platform responses',
  'web.legal.retention.rawProvider.period':
    'The shortest period needed for debugging and compliance, then minimized or deleted.',
  'web.legal.retention.metrics.label': 'Analytics observations',
  'web.legal.retention.metrics.period':
    'The plan retention period, within what the platform terms allow.',
  'web.legal.retention.securityLogs.label': 'Security logs',
  'web.legal.retention.securityLogs.period':
    'A fixed window between 30 and 180 days depending on the risk of the event.',
  'web.legal.retention.billing.label': 'Billing records',
  'web.legal.retention.billing.period':
    'The statutory accounting retention period, held by Polar and by us.',
  'web.legal.retention.deletedAccount.label': 'A deleted account',
  'web.legal.retention.deletedAccount.period':
    'Credentials revoked and scheduled work cancelled immediately. Full deletion completes within the published window, apart from lawful billing records.',
  'web.legal.retention.backups.label': 'Backups',
  'web.legal.retention.backups.period':
    'Encrypted and access controlled, expiring on a documented rotation. A deletion propagates through the restore process.',

  /* ---------------------------------------------------------------------- */
  /* Footer                                                                  */
  /* ---------------------------------------------------------------------- */

  'web.footer.product': 'produkto',
  'web.footer.company': 'kumpanya',
  'web.footer.resources': 'Mga mapagkukunan',
  'web.footer.legal': 'Legal',
  'web.footer.developers': 'Mga developer',
  'web.footer.statement':
    'Ang Relay ay nag-publish sa pamamagitan ng mga opisyal na API ng platform lamang. Ang availability ng connector ay nakasalalay sa mga pag-apruba na kinokontrol ng mga platform, at ang bawat claim ng kakayahan sa site na ito ay may petsa at pinanggalingan.',
  'web.footer.noAffiliation':
    'Ang mga pangalan at marka ng platform ay pag-aari ng mga may-ari nito. Ang kanilang paggamit dito ay tumutukoy sa isang connector at hindi nagpapahiwatig ng pag-endorso o pakikipagsosyo.',
  'web.footer.copyright': 'Relay {year}',

  /* ---------------------------------------------------------------------- */
  /* WP-3 (loud system) — remaining marketing pages. Additive only: every    */
  /* key above this block still renders somewhere on its page. New keys are */
  /* appended here rather than inlined into their page's own section so a   */
  /* concurrent edit to this file never has to merge inside this block.     */
  /* B5 English-fallback exemption for each key is recorded individually in */
  /* `beta-fallbacks.ts`, matching the `web.home.v2.*` precedent above.     */
  /* ---------------------------------------------------------------------- */

  /** Reused by every WP-3 page whose closing band has no page-specific copy. */
  'web.marketing.v2.closing.title': 'Subukan ito sa iyong sariling mga account',
  'web.marketing.v2.closing.body':
    'Pitong araw, tunay na mga konektor, walang naka-stage na data ng demo. Kanselahin anumang oras bago ito mag-convert.',

  'web.product.v2.demo.title': 'Isang maikli, limang platform-native na draft',
  'web.product.v2.demo.body':
    'Ang parehong eksena mula sa home page, na sumasaklaw sa kung ano talaga ang ginagawa ng hakbang sa pag-email.',

  'web.integrations.v2.marqueeCaption':
    'Ang bawat connector sa page na ito, na naglalathala sa pamamagitan ng opisyal nitong API.',

  /** The compare index's single honest claim: no invented competitor numbers. */
  'web.compare.v2.honest': 'Walang gawa-gawang numero',

  'web.creators.v2.phone.caption': 'Isang maikling, inangkop sa platform kung saan ito dumarating.',

  'web.agencies.v2.channelsLabel': 'Mga aktibong social channel, isang plano',
  'web.agencies.v2.membersSticker': 'Walang limitasyong mga miyembro ng koponan',

  'web.developers.v2.terminal.title': 'Dalawang utos, nababasa ng makina',

  'web.notFound.v2.line': 'Walang link sa site na ito na sadyang tumuturo dito.',
} as const;
