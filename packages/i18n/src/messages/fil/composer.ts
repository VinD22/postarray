/** Composer: master draft, per target overrides, previews, validation, cost. */
export const composerMessages = {
  'composer.title': 'Mag-compose',
  'composer.titleWithBrand': 'Mag-compose para sa {brand}',
  'composer.master.label': 'Master draft',
  'composer.master.description':
    'Sumulat ng isang beses dito. Naaabot ng mga katugmang pagbabago ang bawat napiling target. Magbukas ng target para magsulat ng bersyon na matatanggap lang ng account na iyon.',
  'composer.master.globalEdit': 'Pandaigdigang pag-edit',
  'composer.master.placeholder': 'Ano ang gusto mong i-publish?',
  'composer.brief.label': 'Maikling',
  'composer.brief.placeholder': 'Ilarawan ang ideya, ang madla at ang kinalabasan na gusto mo.',
  'composer.sources.label': 'Mga sanggunian sa pinagmulan',
  'composer.sources.empty': 'Walang naka-attach na source.',
  'composer.campaign.label': 'Kampanya',
  'composer.campaign.none': 'Walang kampanya',
  'composer.contentLocale.label': 'Wika ng nilalaman',
  'composer.contentLocale.help': 'Ang wika ng post. Ito ay hiwalay sa iyong wika ng interface.',
  'composer.market.label': 'Market ng madla',

  'composer.targets.title': 'Mga target',
  'composer.targets.count':
    '{count, plural, =0 {Walang napiling mga account} one {# account} other {# mga account}}',
  'composer.targets.publishSummary':
    '{count, plural, one {Ipa-publish ito sa # account} other {Ipa-publish ito sa # mga account}} {when, select, now {ngayon} scheduled {sa nakatakdang oras} other {}}',
  'composer.targets.add': 'Magdagdag ng mga account',
  'composer.targets.empty': 'Pumili ng hindi bababa sa isang account kung saan i-publish.',
  'composer.targets.state.ready': 'handa na',
  'composer.targets.state.inherited': 'Nagmana sa master',
  'composer.targets.state.overridden': 'Na-override',
  'composer.targets.state.warning': 'Suriin bago i-publish',
  'composer.targets.state.error': 'Kailangan ng ayusin',
  'composer.targets.state.approvalNeeded': 'Kinakailangan ang pag-apruba',
  'composer.targets.overrideBadge': 'I-override',
  'composer.targets.resetConfirm.title': 'I-reset ang target na ito sa master draft?',
  'composer.targets.resetConfirm.body':
    'Ang kopya, media at mga setting na binago mo {account} ay papalitan ng master draft. Ang ibang mga target ay hindi apektado.',
  'composer.targets.divergence':
    '{count, plural, one {# iba ang target sa master draft} other {# iba ang mga target sa master draft}}',

  'composer.applyToAll.title': 'Mag-apply sa lahat ng target',
  'composer.applyToAll.compatible':
    '{count, plural, one {# tugma ang field sa bawat napiling target} other {# ang mga field ay tugma sa bawat napiling target}}',
  'composer.applyToAll.incompatible':
    '{count, plural, one {# hindi mailalapat ang field at nananatili sa bawat target} other {# hindi maaaring ilapat ang mga field at manatili sa bawat target}}',
  'composer.applyToAll.creates':
    'Ang paglalapat ay lumilikha ng isang tahasang bersyon para sa bawat target.',

  'composer.editor.label': 'Mag-post ng text',
  'composer.editor.characterCount': '{used} ng {limit} mga karakter',
  'composer.editor.characterCountOver':
    '{over} mga karakter sa ibabaw ng {limit} limitasyon ng karakter',
  'composer.editor.characterCountUnknown':
    'Hindi available ang limitasyon sa karakter para sa account na ito',
  'composer.editor.remaining':
    '{count, plural, one {# character na naiwan} other {# mga character na natitira}}',
  'composer.editor.hashtagCount': '{count, plural, one {# hashtag} other {# mga hashtag}}',
  'composer.editor.formatting': 'Pag-format',
  'composer.editor.emoji': 'Emoji',
  'composer.editor.mention': 'Banggitin',
  'composer.editor.link': 'Link',

  'composer.mentions.search': 'Maghanap ng mga tao, pahina at kumpanya',
  'composer.mentions.searching': 'Naghahanap {provider}',
  'composer.mentions.resolved': 'Na-tag {label} sa {provider}',
  'composer.mentions.unresolved':
    'Ang pagbanggit na ito ay hindi naitugma sa a {provider} account pa. Ipa-publish ito bilang plain text hanggang sa pumili ka ng resulta.',
  'composer.mentions.noResults': 'Walang tumutugmang account sa {provider}.',
  'composer.mentions.unsupported': 'Hindi available ang native na pag-tag para sa account na ito.',

  'composer.destination.label': 'Patutunguhan',
  'composer.destination.placeholder': 'Piliin kung saan ito mag-publish',
  'composer.destination.community': 'Komunidad',
  'composer.destination.board': 'Lupon',
  'composer.destination.group': 'Grupo',
  'composer.destination.page': 'Pahina',
  'composer.destination.organization': 'Organisasyon',
  'composer.destination.channel': 'Channel',
  'composer.destination.refresh': 'I-refresh ang mga destinasyon',
  'composer.destination.lastRefreshed': 'Na-refresh ang mga destinasyon {relativeTime}',

  'composer.media.title': 'Media',
  'composer.media.count': '{count, plural, one {# file} other {# mga file}}',
  'composer.media.dropHint': 'I-drag ang mga file dito o i-browse ang iyong library.',
  'composer.media.inheritFromMaster': 'Gamit ang master media',
  'composer.media.overridden': 'Ang target na ito ay gumagamit ng sarili nitong media',
  'composer.media.altText.label': 'Alt text',
  'composer.media.altText.placeholder':
    'Ilarawan ang larawan para sa mga taong gumagamit ng screen reader.',
  'composer.media.altText.missing': 'Nawawala ang alt text.',
  'composer.media.altText.waive': 'Ang larawang ito ay hindi nangangailangan ng alt text',
  'composer.media.altText.generate': 'Sumulat ng alt text',
  'composer.media.crop': 'I-crop',
  'composer.media.resize': 'Baguhin ang laki',
  'composer.media.rotate': 'Iikot',
  'composer.media.compress': 'I-compress',
  'composer.media.convertFormat': 'I-convert ang format',
  'composer.media.thumbnail': 'Thumbnail',
  'composer.media.aspectPreset': 'Preset ng platform',
  'composer.media.original': 'Orihinal',
  'composer.media.originalPreserved':
    'Ang orihinal na file ay pinananatili. Lumilikha ng bagong bersyon ang mga pag-edit.',
  'composer.media.uploading': 'Nag-a-upload {name}',
  'composer.media.processing': 'Naghahanda {name}',
  'composer.media.rights.label': 'Mga karapatan at pahintulot',
  'composer.media.rights.confirm':
    'Mayroon akong mga karapatan na i-publish ang media na ito, kabilang ang sinumang tao, musika, mga logo at mga tatak dito.',

  'composer.sequence.title': 'Mga komento at thread',
  'composer.sequence.root': 'Pangunahing post',
  'composer.sequence.item': 'item {position}',
  'composer.sequence.add': 'Magdagdag ng komento o item sa thread',
  'composer.sequence.delayLabel': 'Pagkaantala pagkatapos ng nakaraang item',
  'composer.sequence.delayImmediate': 'Kaagad',
  'composer.sequence.delayMinutes': '{count, plural, one {# minuto} other {# minuto}}',
  'composer.sequence.delayCustom': 'Pasadyang pagkaantala',
  'composer.sequence.accountLabel': 'I-publish ang item na ito bilang',
  'composer.sequence.unsupported':
    'Hindi sinusuportahan ng account na ito ang mga naka-iskedyul na follow up na item.',

  'composer.repeat.title': 'Ulitin',
  'composer.repeat.off': 'Huwag ulitin',
  'composer.repeat.everyDays': '{count, plural, one {Araw-araw} other {Bawat # araw}}',
  'composer.repeat.endLabel': 'Itigil ang pag-uulit',
  'composer.repeat.endOnDate': 'Sa isang date',
  'composer.repeat.endAfterCount': 'Pagkatapos ng ilang mga post',
  'composer.repeat.endRequired': 'Pumili ng petsa ng pagtatapos o isang bilang ng mga pag-uulit.',
  'composer.repeat.summary':
    'Nauulit {cadence} hanggang {end}. Ang bawat pangyayari ay nakakakuha ng sarili nitong pag-apruba at resibo.',

  'composer.links.title': 'Mga link',
  'composer.links.keepOriginal': 'Panatilihin ang orihinal na URL',
  'composer.links.track': 'Palitan ng isang sinusubaybayang maikling link',
  'composer.links.utm': 'Mga parameter ng UTM',
  'composer.links.domain': 'I-link ang domain',
  'composer.links.finalUrl': 'Ito ay maglalathala bilang {url}',
  'composer.links.frozenAtApproval':
    'Ang eksaktong maikling URL at patutunguhan ay naka-freeze sa naaprubahang bersyon.',

  'composer.signature.title': 'Lagda',
  'composer.signature.none': 'Walang pirma',
  'composer.signature.autoApplied':
    'Lagda {name} ay awtomatikong naidagdag. Maaari mo itong baguhin.',

  'composer.set.title': 'Mga set',
  'composer.set.startFrom': 'Magsimula sa isang Set',
  'composer.set.continueWithout': 'Magpatuloy nang walang Set',
  'composer.set.applied':
    'Inilapat na Set {name}. Ang draft na ito ay independyente na ngayon sa Set.',

  'composer.validation.title': 'Pagpapatunay',
  'composer.validation.clean': 'Walang nakitang isyu para sa mga napiling target.',
  'composer.validation.issueCount':
    '{count, plural, one {# isyu} other {# mga isyu}} sa kabila {targets, plural, one {# target} other {# mga target}}',
  'composer.validation.blocking': 'Dapat itong ayusin bago mag-iskedyul.',
  'composer.validation.warning': 'Suriin ito bago i-publish.',
  'composer.validation.revalidated':
    'Muling sinuri laban sa kasalukuyang mga limitasyon ng platform {relativeTime}.',

  'composer.preview.title': 'Silipin',
  'composer.preview.forAccount': 'Silipin para sa {account} sa {provider}',
  'composer.preview.approximate':
    'Ginagamit ng preview na ito ang mga panuntunan sa platform na naitala namin. Maaaring mag-iba ang nai-publish na post kung magbabago ang platform.',
  'composer.preview.unavailable':
    'Ang isang tunay na preview ay hindi pa magagamit para sa account na ito.',

  'composer.cost.title': 'Tinantyang halaga ng provider',
  'composer.cost.estimate':
    '{provider} mga pagtatantya {amount} ng paggamit ng API para sa post na ito.',
  'composer.cost.linkSurcharge':
    '{provider} mas mataas ang singil para sa mga post na naglalaman ng URL. Ang pag-alis ng link ay nagpapababa sa pagtatantya.',
  'composer.cost.bulkWarning':
    '{count, plural, one {# publikasyon} other {# mga publikasyon}} sa isang aksyon. Suriin ang pagtatantya bago ka magpatuloy.',
  'composer.cost.reconciled': 'Ang aktwal na paggamit ay pinagkasundo pagkatapos mai-publish.',
  'composer.cost.none': 'Walang sinukat na halaga ng provider para sa post na ito.',

  'composer.autosave.saving': 'Nagtitipid',
  'composer.autosave.saved': 'Nai-save {relativeTime}',
  'composer.autosave.offline':
    'Offline. Ang iyong draft ay pinananatili sa device na ito at magsi-sync.',
  'composer.autosave.conflict':
    '{name} na-edit ang draft na ito habang nagsusulat ka. Suriin ang parehong bersyon bago i-save.',
  'composer.autosave.failed': 'Hindi makapag-save. Nandito pa rin ang text mo. Sinusubukang muli.',

  'composer.ai.title': 'Tumulong',
  'composer.ai.makeConcise': 'Gumawa ng mas maigsi',
  'composer.ai.adaptForPlatform': 'Iangkop para sa {provider}',
  'composer.ai.transcreate': 'I-transcreate sa {language}',
  'composer.ai.checkClaims': 'Suriin ang mga claim',
  'composer.ai.writeAltText': 'Sumulat ng alt text',
  'composer.ai.suggestHooks': 'Magmungkahi ng mga kawit',
  'composer.ai.suggestCta': 'Magmungkahi ng call to action',
  'composer.ai.diffTitle': 'Iminungkahing pagbabago',
  'composer.ai.diffHelp': "Walang magbabago hangga't hindi mo tinatanggap.",
  'composer.ai.working': 'Nagtatrabaho dito',
  'composer.ai.sources':
    'Batay sa {count, plural, one {# pinagmulan} other {# pinagmumulan}} inaprubahan mo',
  'composer.ai.uncertain':
    'Ang pariralang ito ay walang malinis na katumbas sa {language}. Suriin ito sa isang katutubong nagsasalita bago i-publish.',

  'composer.schedule.title': 'Iskedyul',
  'composer.schedule.dateLabel': 'Petsa',
  'composer.schedule.timeLabel': 'Oras',
  'composer.schedule.timeZoneLabel': 'Time zone',
  'composer.schedule.nextFreeSlot': 'Susunod na libreng slot',
  'composer.schedule.localAndUtc': '{local} sa {timeZone}. {utc} UTC.',
  'composer.schedule.dstWarning':
    'Nagbabago ang mga orasan {timeZone} sa petsang ito. Ang post na ito ay tumatakbo sa {local}, which is {utc} UTC.',
  'composer.schedule.pastWarning': 'Lumipas ang panahong iyon. Pumili ng ibang pagkakataon.',
  'composer.schedule.confirmTitle': 'Kumpirmahin bago mag-iskedyul',
  'composer.schedule.confirmPublishNow': 'Kumpirmahin bago i-publish ngayon',
  'composer.schedule.approverLabel': 'Approver',
  'composer.schedule.policyLabel': 'Patakaran sa pag-apruba',
  'composer.schedule.duplicateWarning':
    'Ang katulad na nilalaman ay nai-publish sa {account} {relativeTime}. Ang pag-publish muli nito ay maaaring lumabag sa mga panuntunan ng platform sa duplicate na content.',
  'composer.schedule.cadenceWarning':
    '{account} mayroon na {count, plural, one {# post} other {# mga post}} naka-iskedyul sa araw na iyon.',
} as const;
