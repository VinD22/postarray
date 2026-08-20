/**
 * The per platform scheduler pages.
 *
 * Rules that bind this file specifically:
 *
 *  - Not one string here names a platform, states a character ceiling, a file
 *    size or a capability. Every one of those comes from the generated
 *    datasets the page reads, so a page physically cannot claim support the
 *    connectors do not have. The strings below are labels and framing only.
 *  - The framing is always "what the platform requires" and "what this product
 *    intends to support". Never "what you can publish". No connector has
 *    passed its definition of done, so nothing publishes.
 *  - Anything a platform does not document is `common.unavailable`, never a
 *    zero and never a guess.
 */
export const webPlatformsMessages = {
  /* ---------------------------------------------------------------------- */
  /* Metadata                                                               */
  /* ---------------------------------------------------------------------- */

  'web.meta.schedule.title': 'Pag-iiskedyul, kada platform',
  'web.meta.schedule.description':
    'Ang kinakailangan ng bawat platform sa launch cohort mula sa isang konektadong account, ang mga limitasyong ipinapatupad ng opisyal na API nito, at gaano na kalayo ang narating ng produktong ito laban sa mga iyon.',
  'web.meta.schedulePlatform.title': 'Pag-iiskedyul para sa {platform}',
  'web.meta.schedulePlatform.description':
    'Ang kinakailangan ng {platform} mula sa isang konektadong account, ang mga limitasyong ipinapatupad ng opisyal na API nito, at aling mga parte nito ang nagawa na ng produktong ito.',

  /* ---------------------------------------------------------------------- */
  /* Index                                                                  */
  /* ---------------------------------------------------------------------- */

  'web.schedule.index.title': 'Pag-iiskedyul, kada platform',
  'web.schedule.index.lede':
    'Isang page kada platform sa launch cohort. Sinasabi ng bawat isa kung ano ang hinihingi ng platform mula sa isang konektadong account, ang mga limitasyong ipinapatupad ng opisyal na API nito, at kung nasaan na ang build. Ang bawat numero ay dala ang dokumentong pinagmulan nito at ang petsang binasa iyon ng isang tao.',
  'web.schedule.index.listLabel': 'Mga platform sa launch cohort',
  'web.schedule.index.cohortNote':
    'Ang cohort ay ang set ng mga platform na pinagbubuuan ng produktong ito. Isa itong plano, hindi isang listahan ng availability.',
  'web.schedule.index.limitsKnown': 'Naka-record ang mga limitasyon',
  'web.schedule.index.limitsUnknown': 'Hindi pa naka-record ang mga limitasyon',

  /* ---------------------------------------------------------------------- */
  /* Platform page                                                          */
  /* ---------------------------------------------------------------------- */

  'web.schedule.platform.title': 'Pag-iiskedyul para sa {platform}',
  'web.schedule.platform.lede':
    'Ang hinihingi ng {platform} mula sa isang konektadong account, ang mga limitasyong ipinapatupad ng opisyal na API nito, at alin sa mga iyon ang nagawa na ng produktong ito sa ngayon.',

  'web.schedule.notice.title': 'Wala pang na-publish sa {platform}',
  'web.schedule.notice.body':
    'Walang koneksyon na nakumpleto ang definition of done nito, at wala nang na-verify sa production. Inilalarawan ng page na ito kung ano ang kinakailangan ng platform at kung ano ang balak suportahan ng produktong ito. Hindi nito inilalarawan ang isang gumaganang scheduler.',

  'web.schedule.requirements.title': 'Ano ang kinakailangan ng {platform}',
  'web.schedule.requirements.accountTypes': 'Uri ng account',
  'web.schedule.requirements.restriction': 'Restriksyon ng platform',
  'web.schedule.requirements.cost': 'Gastos sa API',
  'web.schedule.requirements.unavailable.title': 'Wala pang na-review na connector record',
  'web.schedule.requirements.unavailable.body':
    'Sumali ang platform na ito sa cohort pagkatapos ng huling connector research pass, kaya wala pang record na may petsa tungkol sa mga kinakailangan ng account nito para ipakita. Lalabas ito rito kapag nabasa na ng isang tao ang opisyal na dokumentasyon at na-record ito.',
  'web.schedule.requirements.apiSource': 'Opisyal na dokumentasyon ng API',
  'web.schedule.requirements.policySource': 'Patakaran ng platform',

  /* ---------------------------------------------------------------------- */
  /* Limits                                                                 */
  /* ---------------------------------------------------------------------- */

  'web.schedule.limits.title': 'Mga limitasyong ipinapatupad ng {platform}',
  'web.schedule.limits.lede':
    'Binasa para sa isang bagong konektadong account na walang elevated eligibility. Puwedeng itaas o ibaba ng isang platform ang alinman sa mga ito nang hindi sinasabi kaninuman, kaya dala ng bawat set ang petsang binasa ito.',
  'web.schedule.limits.unavailable.title': 'Hindi pa naka-record ang mga limitasyon para sa {platform}',
  'web.schedule.limits.unavailable.body':
    'Walang adapter ang build na ito para sa platform na ito, kaya walang naka-record na ceiling para ipakita. Mas malala ang isang gawa-gawang numero kaysa sa wala.',
  'web.schedule.limits.sourceLabel': 'Opisyal na dokumentasyon ng platform',

  'web.schedule.limits.text': 'Teksto ng katawan',
  'web.schedule.limits.title_field': 'Field ng pamagat',
  'web.schedule.limits.countingUnit': 'Paano binibilang ang mga character',
  'web.schedule.limits.links': 'Paano binibilang ang mga link',
  'web.schedule.limits.images': 'Larawan kada post',
  'web.schedule.limits.videos': 'Video kada post',
  'web.schedule.limits.videoDuration': 'Haba ng video',
  'web.schedule.limits.imageBytes': 'Pinakamalaking larawan',
  'web.schedule.limits.gifBytes': 'Pinakamalaking animated na larawan',
  'web.schedule.limits.videoBytes': 'Pinakamalaking video',
  'web.schedule.limits.documentBytes': 'Pinakamalaking dokumento',
  'web.schedule.limits.altText': 'Alt text',
  'web.schedule.limits.mimeTypes': 'Mga tinatanggap na uri ng file',
  'web.schedule.limits.markdown': 'Mga marka ng pag-format',

  'web.schedule.value.characters': '{count, plural, one {# character} other {# character}}',
  'web.schedule.value.files': '{count, plural, =0 {Wala} one {# file} other {# file}}',
  'web.schedule.value.durationRange': 'Sa pagitan ng {min} at {max}',
  'web.schedule.value.durationMax': 'Hanggang {max}',
  'web.schedule.value.markdownYes': 'Tinatanggap',
  'web.schedule.value.markdownNo': 'Nagpu-publish bilang plain character',

  'web.schedule.unit.utf16':
    'Sa UTF-16 code unit, na siyang iniuulat ng karamihan ng editor bilang bilang ng character.',
  'web.schedule.unit.grapheme':
    'Sa grapheme, kaya ang isang emoji na binubuo ng ilang code point ay isang character pa rin ang halaga.',
  'web.schedule.unit.weighted':
    'Sa isang weighted na scheme kung saan karamihan sa mga character na hindi Latin ay may halagang dalawa sa halip na isa.',

  'web.schedule.link.none': 'Hindi binibilang ang mga link sa ceiling.',
  'web.schedule.link.actual': 'Ang isang link ay may halagang eksaktong bilang ng character na sinasakop nito.',
  'web.schedule.link.fixed':
    'Isinusulat ulit ang bawat link sa platform shortener at may halagang {count, plural, one {# character} other {# character}} anuman ang totoong haba nito.',

  /* ---------------------------------------------------------------------- */
  /* Capability state                                                       */
  /* ---------------------------------------------------------------------- */

  'web.schedule.capabilities.title': 'Ang nagawa na para sa {platform}',
  'web.schedule.capabilities.lede':
    'Nagawa mula sa connector registry, hindi isinulat dito. Ang "hindi inaalok ng platform" ay isang katotohanan tungkol sa platform at pinal ito. Ang "hindi pa nagagawa" ay isang katotohanan tungkol sa produktong ito at ito ang tapat na default habang wala pang koneksyon na nakumpleto ang definition of done nito.',
  'web.schedule.capabilities.unavailable.title': 'Walang capability record para sa {platform}',
  'web.schedule.capabilities.unavailable.body':
    'Walang adapter sa build na ito, kaya walang maiuulat ang registry. Lalabas ang row na ito sa capability matrix sa sandaling may totoong sasabihin.',
  'web.schedule.capabilities.matrixLink': 'Basahin ang buong capability matrix',

  'web.schedule.next.title': 'Saan susunod pupunta',
  'web.schedule.next.body':
    'Dala ng capability matrix ang bawat platform at bawat capability sa isang table. Inilalarawan ng mga page ng use case ang mga workflow na pinagbubuuan ng produktong ito.',

  /* ---------------------------------------------------------------------- */
  /* Post specs cluster (/specs)                                            */
  /* ---------------------------------------------------------------------- */

  'web.meta.specs.title': 'Mga spec ng post, kada platform',
  'web.meta.specs.description':
    'Ang mga limitasyong ipinapatupad ng bawat platform sa launch cohort sa isang post, nagawa mula sa connector code, na ang bawat isa ay dala ang opisyal na dokumentong pinagmulan nito at ang petsang binasa iyon ng isang tao.',
  'web.meta.specsPlatform.title': 'Mga spec ng post para sa {platform}',
  'web.meta.specsPlatform.description':
    'Ang bawat limitasyong naka-record para sa {platform}: ano ito, ang opisyal na dokumentong pinagmulan ng numero, at ang petsang binasa iyon ng isang tao.',

  'web.specs.index.title': 'Mga spec ng post, kada platform',
  'web.specs.index.lede':
    'Isang page kada limitasyon, kada platform. Sinasabi ng bawat page ang naka-record na value, ang opisyal na dokumentong pinagmulan nito, at ang petsang binasa iyon ng isang tao. Wala ritong na-type nang manwal: nagawa ang mga value mula sa connector code, kaya may page lang kung may value ang dataset.',
  'web.specs.index.listLabel': 'Mga platform na may naka-record na limitasyon',
  'web.specs.index.count': '{count, plural, one {# naka-record na limitasyon} other {# na naka-record na limitasyon}}',
  'web.specs.index.missingTitle': 'Bakit puwedeng kulang ang isang platform dito',
  'web.specs.index.missingBody':
    'Lalabas lang ang isang platform kung may adapter ang build na ito para dito at may kahit isang value ang nagawang dataset. Walang page ang platform na walang naka-record, dahil mas malala ang isang page na nakabatay sa gawa-gawang numero kaysa sa walang page.',
  'web.specs.index.methodTitle': 'Saan galing ang mga value na ito',
  'web.specs.index.methodBody':
    'Nagagawang muli ang dataset mula sa connector capability code, na siyang parehong code na sinusukat laban sa isang draft. Binabasa ang mga value para sa isang bagong konektadong account na walang elevated eligibility.',

  'web.specs.platform.listLabel': 'Mga naka-record na limitasyon para sa platform na ito',
  'web.specs.platform.limitsTitle': 'Ang naka-record para sa {platform}',
  'web.specs.platform.limitsBody':
    'Ang bawat row ay nagli-link sa isang page na nagsasabi ng sariling value nito, kasama ang dokumentong pinagmulan nito. Walang row at walang page ang limitasyong hindi dokumentado ng platform na ito.',

  'web.specs.detail.valueTitle': 'Ang naka-record na value',
  'web.specs.detail.sourceLabel': 'Opisyal na dokumentasyon ng platform',
  'web.specs.detail.freshnessTitle': 'Gaano ito ka-updated',
  'web.specs.detail.freshnessBody':
    'Puwedeng itaas o ibaba ng isang platform ang isang limitasyon nang hindi ito ianunsyo. Ang value sa itaas ay binasa para sa isang bagong konektadong account na walang elevated eligibility, at ang petsa sa tabi ng source ay ang araw na huling binasa ng isang tao ang dokumentong iyon.',
  'web.specs.detail.checkTitle': 'Suriin ang isang totoong post laban dito',
  'web.specs.detail.checkBody':
    'Sinusukat ng preflight checker ang isang draft at isang media file laban sa bawat limitasyong naka-record para sa isang platform, sa browser, nang hindi nag-a-upload ng anuman. Napipili na agad ang platform na ito kapag binuksan mula sa page na ito.',
  'web.specs.detail.checkLink': 'Buksan ang preflight checker para sa platform na ito',
  'web.specs.detail.siblingTitle': 'Lahat pang naka-record para sa platform na ito',
  'web.specs.detail.siblingBody':
    'Ang ibang mga value sa parehong nagawang dataset, mula sa parehong source.',
  'web.specs.detail.scheduleLink': 'Basahin ang buong page ng platform',

  'web.specs.notice.title': 'Isang limitasyon ng platform, hindi isang gumaganang scheduler',
  'web.specs.notice.body':
    'Walang koneksyon na nakumpleto ang definition of done nito. Sinasabi ng page na ito ang ipinapatupad ng platform. Hindi nito sinasabing nagpu-publish na ang produktong ito roon.',

  'web.specs.constraint.characterLimit.name': 'Limitasyon ng character',
  'web.specs.constraint.characterLimit.title': 'Limitasyon ng character ng {platform}',
  'web.specs.constraint.characterLimit.lede':
    'Ang pinakamahabang teksto ng katawan na tinatanggap ng {platform} sa isang post sa pamamagitan ng opisyal na API nito, binasa mula sa parehong nagawang dataset na sinusukat laban dito ng preflight checker sa isang draft.',
  'web.specs.constraint.characterLimit.description':
    'Ang ceiling ng teksto ng katawan na ipinapatupad ng {platform} sa isang post, kasama ang opisyal na dokumentong pinagmulan ng numero at ang petsang binasa iyon ng isang tao.',

  'web.specs.constraint.titleLimit.name': 'Limitasyon ng haba ng pamagat',
  'web.specs.constraint.titleLimit.title': 'Limitasyon ng haba ng pamagat ng {platform}',
  'web.specs.constraint.titleLimit.lede':
    'Ang pinakamahabang pamagat na tinatanggap ng {platform} sa hiwalay na field ng pamagat na inilalantad ng API nito, binasa mula sa parehong nagawang dataset na sinusukat laban dito ng preflight checker sa isang draft.',
  'web.specs.constraint.titleLimit.description':
    'Ang ceiling ng field ng pamagat na ipinapatupad ng {platform}, kasama ang opisyal na dokumentong pinagmulan ng numero at ang petsang binasa iyon ng isang tao.',

  'web.specs.constraint.imageSize.name': 'Limitasyon ng laki ng larawan',
  'web.specs.constraint.imageSize.title': 'Limitasyon ng laki ng larawan ng {platform}',
  'web.specs.constraint.imageSize.lede':
    'Ang pinakamalaking still image file na tinatanggap ng {platform} sa pamamagitan ng opisyal na API nito, binasa mula sa parehong nagawang dataset na sinusukat laban dito ng preflight checker sa isang file.',
  'web.specs.constraint.imageSize.description':
    'Ang pinakamalaking image file na tinatanggap ng {platform}, kasama ang opisyal na dokumentong pinagmulan ng numero at ang petsang binasa iyon ng isang tao.',

  'web.specs.constraint.videoSize.name': 'Limitasyon ng laki ng video',
  'web.specs.constraint.videoSize.title': 'Limitasyon ng laki ng video ng {platform}',
  'web.specs.constraint.videoSize.lede':
    'Ang pinakamalaking video file na tinatanggap ng {platform} sa pamamagitan ng opisyal na API nito, binasa mula sa parehong nagawang dataset na sinusukat laban dito ng preflight checker sa isang file.',
  'web.specs.constraint.videoSize.description':
    'Ang pinakamalaking video file na tinatanggap ng {platform}, kasama ang opisyal na dokumentong pinagmulan ng numero at ang petsang binasa iyon ng isang tao.',

  'web.specs.constraint.videoLength.name': 'Limitasyon ng haba ng video',
  'web.specs.constraint.videoLength.title': 'Limitasyon ng haba ng video ng {platform}',
  'web.specs.constraint.videoLength.lede':
    'Kung gaano katagal puwedeng tumakbo ang isang video na na-post sa {platform} sa pamamagitan ng opisyal na API nito, binasa mula sa parehong nagawang dataset na sinusukat laban dito ng preflight checker sa isang file.',
  'web.specs.constraint.videoLength.description':
    'Kung gaano katagal puwedeng tumakbo ang isang video na na-post sa {platform}, kasama ang opisyal na dokumentong pinagmulan ng numero at ang petsang binasa iyon ng isang tao.',

  'web.specs.constraint.imageCount.name': 'Larawan kada post',
  'web.specs.constraint.imageCount.title': 'Larawan kada post ng {platform}',
  'web.specs.constraint.imageCount.lede':
    'Kung ilang larawan ang tinatanggap ng {platform} sa isang post sa pamamagitan ng opisyal na API nito, binasa mula sa parehong nagawang dataset na sinusukat laban dito ng preflight checker sa isang draft.',
  'web.specs.constraint.imageCount.description':
    'Kung ilang larawan ang kasya sa isang post sa {platform}, kasama ang opisyal na dokumentong pinagmulan ng numero at ang petsang binasa iyon ng isang tao.',

  'web.specs.constraint.altTextLimit.name': 'Limitasyon ng alt text',
  'web.specs.constraint.altTextLimit.title': 'Limitasyon ng alt text ng {platform}',
  'web.specs.constraint.altTextLimit.lede':
    'Ang pinakamahabang alt text na tinatanggap ng {platform} sa isang naka-attach na larawan sa pamamagitan ng opisyal na API nito, binasa mula sa parehong nagawang dataset na sinusukat laban dito ng preflight checker sa isang draft.',
  'web.specs.constraint.altTextLimit.description':
    'Ang ceiling ng alt text na ipinapatupad ng {platform} sa isang naka-attach na larawan, kasama ang opisyal na dokumentong pinagmulan ng numero at ang petsang binasa iyon ng isang tao.',

  'web.specs.constraint.fileTypes.name': 'Mga tinatanggap na uri ng file',
  'web.specs.constraint.fileTypes.title': 'Mga tinatanggap na uri ng file ng {platform}',
  'web.specs.constraint.fileTypes.lede':
    'Ang mga uri ng media na tinatanggap ng {platform} sa pamamagitan ng opisyal na API nito, binasa mula sa parehong nagawang dataset na sinusukat laban dito ng preflight checker sa isang file.',
  'web.specs.constraint.fileTypes.description':
    'Aling mga uri ng media ang tinatanggap ng {platform}, kasama ang opisyal na dokumentong pinagmulan ng listahan at ang petsang binasa iyon ng isang tao.',
} as const;
