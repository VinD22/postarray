/**
 * The three project-led use case pages.
 *
 * These describe workflows, not capabilities. The rule that binds every string
 * here: a sentence may describe how the product is designed and what has been
 * built, and may never imply that anything reaches a platform. Nothing
 * publishes, so "what works today" is written in the past and present tense of
 * the build, not of a live service.
 */
export const webUseCaseMessages = {
  /* ---------------------------------------------------------------------- */
  /* Metadata                                                               */
  /* ---------------------------------------------------------------------- */

  'web.meta.useCases.title': 'Mga use case',
  'web.meta.useCases.description':
    'Tatlong workflow na pinagbubuuan ng produktong ito: pagpapatakbo ng maraming kliyente sa isang lugar, pagpapaaproba ng trabaho bago ito ilabas, at pagdadala ng isang ideya sa maraming platform nang hindi ito isinusulat ulit.',
  'web.meta.useCase.clients.title': 'Pamamahala ng maraming kliyente',
  'web.meta.useCase.clients.description':
    'Magkakahiwalay na project, magkakahiwalay na konektadong account, magkakahiwalay na pag-apruba, at magkakahiwalay na report, para sa mga team na nagpu-publish para sa ibang tao.',
  'web.meta.useCase.approvals.title': 'Mga workflow ng pag-apruba',
  'web.meta.useCase.approvals.description':
    'Paano nagiging aprubadong post ang isang draft: sino ang nagre-review nito, ano ang nagpapawalang-bisa sa isang pag-apruba, at bakit ang parehong panuntunan ang umiiral sa bawat surface.',
  'web.meta.useCase.crossPlatform.title': "Pag-publish sa iba't ibang platform",
  'web.meta.useCase.crossPlatform.description':
    'Isang pangunahing draft, isang na-adapt na bersyon kada platform, na-validate laban sa naka-record na limitasyon ng bawat platform bago mai-iskedyul ang anuman.',

  /* ---------------------------------------------------------------------- */
  /* Shared furniture                                                       */
  /* ---------------------------------------------------------------------- */

  'web.useCases.index.title': 'Mga use case',
  'web.useCases.index.lede':
    'Tatlong workflow na pinagbubuuan ng produktong ito. Sinasabi ng bawat page kung magkano ang gastos ng workflow para sa isang team ngayon, paano dinisenyo ang produkto para hawakan ito, at aling parte talaga ang nagawa na.',
  'web.useCases.index.listLabel': 'Mga use case',

  'web.useCases.notice.title':
    'Inilalarawan nito ang isang disenyo, hindi isang tumatakbong serbisyo',
  'web.useCases.notice.body':
    'Walang koneksyon na na-verify sa production, kaya wala pang na-publish saanman sa page na ito. Kung nagawa na ang isang parte ng workflow, sinasabi ito. Kung hindi pa, sinasabi rin ito.',

  'web.useCases.section.problem': 'Ang problema',
  'web.useCases.section.approach': 'Paano dinisenyo ang produkto',
  'web.useCases.section.today': 'Ang talagang nagawa na',
  'web.useCases.section.related': 'Kaugnay',

  /* ---------------------------------------------------------------------- */
  /* Managing multiple clients                                              */
  /* ---------------------------------------------------------------------- */

  'web.useCases.clients.title': 'Pamamahala ng maraming kliyente',
  'web.useCases.clients.lede':
    'Hindi dapat malayo lang ang gawain para sa isang kliyente sa isang maling click patungo sa audience ng ibang kliyente.',
  'web.useCases.clients.problem':
    'Pinaghihiwalay ng karamihan sa mga team ang mga kliyente sa pamamagitan ng pag-iingat. Isang shared account ang may hawak ng bawat konektadong page, isang kalendaryo ang may hawak ng bawat iskedyul, at ang tanging humaharang sa isang draft ng kliyente at maling audience ay ang taong nakatingin sa screen alas-sais ng gabi. Kapag umalis ang isang tao sa team, umaalis din ang paghihiwalay kasama ng gawi nito.',
  'web.useCases.clients.approach1':
    'Ang project ay ang unit ng paghihiwalay. Ang mga konektadong account, draft, queue, media, at resibo ay pag-aari ng isang project, at nakikita lang ng miyembro ang mga project na kinabibilangan niya.',
  'web.useCases.clients.approach2':
    'Ipinapatupad ang paghihiwalay nang tatlong beses: sa authentication, sa application service na nagpapahintulot sa aksyon, at sa database mismo sa pamamagitan ng row level security. Hindi kailanman itinuturing na pahintulot ang pagiging naka-sign in.',
  'web.useCases.clients.approach3':
    'Sinusunod ng reporting ang parehong hangganan, kaya ang isang report kada kliyente ang default na hugis sa halip na isang spreadsheet na iaayos ng isang tao nang manwal.',
  'web.useCases.clients.today':
    'Ang mga project, ang project-scoped na membership, at ang mga row level security policy sa likod ng mga ito ay nagawa na at nasubok, kasama ang mga test na sumusubok mag-cross-project read at nagpapatunay na nabibigo ang mga ito. Sinusukat ang laki ng mga plano batay sa bilang ng project na kailangan ng isang team. Wala pang na-publish sa isang platform mula sa anumang project.',

  /* ---------------------------------------------------------------------- */
  /* Approval workflows                                                     */
  /* ---------------------------------------------------------------------- */

  'web.useCases.approvals.title': 'Mga workflow ng pag-apruba',
  'web.useCases.approvals.lede':
    'May halaga lang ang isang pag-apruba kung ang inaprubahan ay ang talagang inilalabas.',
  'web.useCases.approvals.problem':
    'Karaniwang nangyayari ang pag-apruba sa labas ng tool na nagpu-publish. May napupuntang screenshot sa isang kliyente, sumasagot ang kliyente ng oo, tapos nagbabago ang copy. Ang pag-apruba ngayon ay tumutukoy sa isang draft na wala nang meron, at wala talagang alam ang tool, kaya ini-publish nito kung ano man ang huling ibinigay dito.',
  'web.useCases.approvals.approach1':
    'Naka-attach ang isang pag-apruba sa eksaktong nilalamang na-review. Ang pag-edit sa isang aprubadong draft ay nagpapawalang-bisa sa pag-aprubang iyon at nagsasabi kung aling field ang nagbago, sa halip na tahimik lang dalhin pasulong ang lumang desisyon.',
  'web.useCases.approvals.approach2':
    'Puwedeng aprubahan, hilingin ang mga pagbabago, o tanggihan ng isang reviewer, at kailangan ng komento para sa anumang bagay maliban sa pag-apruba, kaya hindi na kailangang manghula ng may-akda kung ano ang aayusin.',
  'web.useCases.approvals.approach3':
    'Nasa shared application layer ang panuntunan, kaya sinusunod ito ng web app, REST API, MCP server, CLI, at webhook. Walang surface na may shortcut sa review.',
  'web.useCases.approvals.today':
    'Nagawa na ang mga approval state, ang review surface, ang mga panuntunan sa muling pag-apruba, at ang mga audit event sa likod ng mga ito. Ang hindi pa nagagawa ay ang huling hakbang, dahil wala pang koneksyon na nakumpleto ang definition of done nito, kaya wala pang mapupuntahan ang isang aprubadong post.',

  /* ---------------------------------------------------------------------- */
  /* Cross-platform publishing                                              */
  /* ---------------------------------------------------------------------- */

  'web.useCases.crossPlatform.title': "Pag-publish sa iba't ibang platform",
  'web.useCases.crossPlatform.lede':
    'Isang ideya, isang edit, at isang bersyon kada platform na gumagalang sa talagang tinatanggap ng platform na iyon.',
  'web.useCases.crossPlatform.problem':
    'Ang pag-post ng parehong teksto saanman ay gumagawa ng bersyong na-truncate sa isang platform, kulang ng kinakailangang pamagat sa isa pa, at may dalang link na tahimik lang inaalis ng ikatlo. Ang alternatibo, ang muling pagsulat nang manwal nang limang beses, ay kung saan talaga napupunta ang trabaho.',
  'web.useCases.crossPlatform.approach1':
    'Hawak ng isang pangunahing draft ang ideya. Bawat napiling account ay may sariling bersyon, at ang isang edit sa pangunahing draft ay ina-apply lang kung saan ito bagay, na malinaw na sinasabi kung aling mga target ang hindi ito matatanggap at kung bakit.',
  'web.useCases.crossPlatform.approach2':
    'Tumatakbo ang validation laban sa naka-record na limitasyon ng bawat platform, binibilang sa paraang talagang binibilang ng platform na iyon, kaya chine-check ang isang limitasyon ng character sa mga grapheme kung saan gumagamit ng grapheme ang platform at sa weighted unit kung saan ginagamit iyon.',
  'web.useCases.crossPlatform.approach3':
    'Ang bawat limitasyon ng platform na ipinapakita saanman sa site na ito ay nagawa mula sa connector registry at dala ang dokumentong pinagmulan nito at ang petsang binasa iyon ng isang tao.',
  'web.useCases.crossPlatform.today':
    'Nagawa na ang composer, ang mga bersyon kada target, ang mga panuntunan sa validation, at ang nagawang dataset ng mga limitasyon. Hindi pa nagagawa ang hakbang ng pag-publish: walang koneksyon na na-verify sa production, kaya puwedeng ma-iskedyul ang isang na-validate na draft sa loob lang ng sistema at hindi pa ito makakarating sa isang platform.',
} as const;
