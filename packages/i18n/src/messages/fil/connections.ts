/** Connections, provider capabilities and connection health. */
export const connectionMessages = {
  'connection.title': 'Mga koneksyon',
  'connection.subtitle':
    'Ang mga account, Page at channel na maaaring i-publish ng workspace na ito.',
  'connection.add': 'Ikonekta ang isang account',
  'connection.count':
    '{used, plural, one {# aktibong channel} other {# mga aktibong channel}} ng {limit}',
  'connection.limitReached':
    'Ginagamit ng workspace na ito ang lahat {limit} mga channel. Idiskonekta ang isa bago ikonekta ang isa pa.',

  'connection.account.label': 'Account',
  'connection.account.type.profile': 'Profile',
  'connection.account.type.page': 'Pahina',
  'connection.account.type.channel': 'Channel',
  'connection.account.type.group': 'Grupo',
  'connection.account.type.organization': 'Organisasyon',
  'connection.account.type.business': 'Account ng negosyo',
  'connection.account.type.creator': 'Account ng tagalikha',
  'connection.connectedBy': 'Ikinonekta ni {name} sa {date}',
  'connection.lastPublished': 'Huling na-publish {relativeTime}',
  'connection.lastPublishedNever': 'Wala pang nai-publish mula sa account na ito',
  'connection.lastAnalyticsSync': 'Na-sync ang Analytics {relativeTime}',

  'connection.status.healthy': 'Nagtatrabaho',
  'connection.status.expiringSoon': 'Mag-e-expire {relativeTime}',
  'connection.status.expired': 'Nag-expire ang access',
  'connection.status.revoked': 'Binawi ang access',
  'connection.status.paused': 'Naka-pause',
  'connection.status.permissionMissing': 'Nawawalang pahintulot',
  'connection.status.reviewPending': 'Naghihintay sa pagsusuri sa platform',
  'connection.status.unknown': 'Hindi available ang kalusugan',

  'connection.token.expiresAt': 'Mag-e-expire ang access {date}',
  'connection.token.expiryUnknown':
    '{provider} ay hindi nagsasabi sa amin kung kailan mag-e-expire ang access na ito.',

  'connection.permissions.title': 'Mga Pahintulot',
  'connection.permissions.granted': 'ipinagkaloob',
  'connection.permissions.missing': 'Hindi pinagbigyan',
  'connection.permissions.explainBeforeOAuth':
    'Magtatanong si Relay {provider} para sa mga pahintulot na ito. Maaari kang magdiskonekta anumang oras.',
  'connection.permissions.whyNeeded': 'Bakit kailangan ito',

  'connection.reconnect.title': 'Kumonekta muli {account}',
  'connection.reconnect.body':
    'Ang mga naka-iskedyul na post para sa account na ito ay naka-hold hanggang sa ito ay muling maikonekta. Walang mawawala.',
  'connection.disconnect.title': 'Idiskonekta {account}?',
  'connection.disconnect.body':
    'Ang mga naka-iskedyul na post para sa account na ito ay hindi mai-publish. Ang mga resibo at analytics na nakolekta na ay mananatili sa workspace na ito.',
  'connection.pause.body':
    'Ang isang naka-pause na account ay nagpapanatili ng kasaysayan at iskedyul nito, ngunit hindi nag-publish hanggang sa ipagpatuloy mo ito.',

  'connection.incident.invalidToken':
    '{provider} tinanggihan ang nakaimbak na access para sa {account}. Muling kumonekta upang maibalik ang pag-publish.',
  'connection.incident.permissionLost':
    '{account} hindi na nagbibigay {permission}. Muling kumonekta at tanggapin ang pahintulot na iyon.',
  'connection.incident.roleLost':
    'Iyong {provider} wala nang tungkulin ang user {account}. Hilingin sa isang admin ng Page na iyon na i-restore ito.',
  'connection.incident.accountTypeInvalid':
    'Kailangan ng Instagram ng isang propesyonal na account. Lumipat {account} sa isang negosyo o creator account, pagkatapos ay muling kumonekta.',
  'connection.incident.reviewRestricted':
    '{provider} ay pinaghigpitan ang app na ito habang nakabinbin ang pagsusuri. Mga post mula sa {account} i-publish nang pribado hanggang sa makumpleto ang pagsusuri.',

  'connection.group.title': 'Mga pangkat ng customer',
  'connection.group.description':
    'Igrupo ang mga account ayon sa kliyente o brand para i-filter ang bawat screen.',
  'connection.group.assign': 'Ilipat sa pangkat',
  'connection.group.none': 'Hindi nakapangkat',
  'connection.group.moveNote':
    'Ang paglipat ng isang account ay nagpapanatili ng mga post, resibo at analytics nito.',

  'connection.oauth.starting': 'Pagbubukas {provider}',
  'connection.oauth.returned': 'Tinatapos ang koneksyon',
  'connection.oauth.chooseAccounts': 'Piliin kung aling mga account ang ikokonekta',
  'connection.oauth.noEligibleAccounts':
    'Walang mga account tungkol dito {provider} maaaring konektado ang pag-login. {reason}',
  'connection.oauth.canceled': 'Kinansela ang koneksyon noong {provider}. Walang nagbago.',
  'connection.oauth.alreadyConnected': '{account} ay nakakonekta na sa workspace na ito.',
  'connection.oauth.connectedToAnotherWorkspace':
    '{account} ay konektado sa isa pang workspace. Idiskonekta mo muna diyan.',

  'capability.title': 'Ano ang sinusuportahan ng account na ito',
  'capability.matrix.title': 'Mga kakayahan sa platform',
  'capability.matrix.subtitle':
    'Binuo mula sa mga kahulugan ng connector na pinapanatili namin at sinusuri sa pamamagitan ng kamay.',
  'capability.level.supported': 'Sinusuportahan',
  'capability.level.unsupported': 'Hindi inaalok ng platform',
  'capability.level.not_implemented': 'Hindi pa nagagawa',
  'capability.level.requires_review': 'Nangangailangan ng pagsusuri sa platform',
  'capability.level.beta': 'Beta',
  'capability.level.unknown': 'Hindi magagamit',
  'capability.explain.supported': 'Magagawa ito ng Relay para sa account na ito ngayon.',
  'capability.explain.unsupported':
    '{provider} ay hindi nag-aalok nito sa pamamagitan ng opisyal nitong API, kaya walang tool ang makakagawa nito nang ligtas.',
  'capability.explain.not_implemented':
    '{provider} nag-aalok nito, ngunit hindi pa ito binuo ng Relay. Ito ay nasa roadmap ng connector.',
  'capability.explain.requires_review':
    '{provider} ibibigay lang ito pagkatapos nitong suriin ang app o ang account. Ito ay mananatiling hindi available hanggang sa matapos ang pagsusuring iyon.',
  'capability.explain.beta':
    'Gumagana ito, na may mga limitasyon na hindi pa namin natapos sa pag-verify. Suriin ang resulta bago ka umasa dito.',
  'capability.explain.unknown':
    'Hindi namin mabasa ang kasalukuyang mga pahintulot para sa account na ito. Kumonekta muli upang i-refresh ang mga ito.',
  'capability.lastChecked': 'Sinuri {relativeTime}',
  'capability.feature.text': 'Mga text post',
  'capability.feature.image': 'Mga imahe',
  'capability.feature.carousel': 'Mga carousel',
  'capability.feature.video': 'Video',
  'capability.feature.document': 'Mga dokumento',
  'capability.feature.firstComment': 'Naka-iskedyul na unang komento',
  'capability.feature.thread': 'Threads',
  'capability.feature.mentions': 'Mga katutubong pagbanggit',
  'capability.feature.destinations': 'Pagpili ng destinasyon',
  'capability.feature.privacy': 'Privacy controls',
  'capability.feature.thumbnail': 'Custom na thumbnail',
  'capability.feature.altText': 'Alt text',
  'capability.feature.analytics': 'Analytics',
  'capability.feature.delete': 'Tanggalin ang isang nai-publish na post',
  'capability.feature.commentCount': 'Bilang ng komento',
  'capability.feature.commentReplies': 'Pagbasa at pagsagot sa mga komento',
  'capability.feature.disclosure': 'Pagsisiwalat ng automation',
} as const;
