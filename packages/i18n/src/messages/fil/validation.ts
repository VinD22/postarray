/**
 * One entry per deterministic validation issue code.
 *
 * Every code has `validation.<code>.message`. Messages state the limit and the
 * account, so the fix is obvious without opening a provider document.
 */
export const validationMessages = {
  'validation.text_required.message':
    '{provider} nangangailangan ng ilang teksto para sa uri ng post na ito.',
  'validation.text_too_long.message':
    '{over, plural, one {# karakter na lampas sa limitasyon para sa {account}} other {# mga character na lampas sa limitasyon para sa {account}}}',
  'validation.text_too_long.hint':
    '{provider} nagpapahintulot {limit} mga character para sa account na ito.',
  'validation.text_too_short.message':
    '{provider} nangangailangan ng hindi bababa sa {min} mga karakter dito.',
  'validation.title_required.message': '{provider} nangangailangan ng pamagat.',
  'validation.title_too_long.message': 'Tapos na ang pamagat {limit} limitasyon ng karakter.',
  'validation.description_too_long.message':
    'Ang paglalarawan ay tapos na {limit} limitasyon ng karakter.',
  'validation.media_required.message':
    '{provider} nangangailangan ng kahit isang larawan o video para sa uri ng post na ito.',
  'validation.media_count_exceeded.message':
    '{provider} tinatanggap ng karamihan {limit, plural, one {# file} other {# mga file}} dito. Ang post na ito ay may {count}.',
  'validation.media_type_unsupported.message': '{provider} hindi tumatanggap {mimeType} mga file.',
  'validation.media_aspect_ratio_unsupported.message':
    'Ang file na ito ay {actual}. {provider} nangangailangan ng ratio sa pagitan {min} at {max}.',
  'validation.media_aspect_ratio_unsupported.hint':
    'I-crop ito gamit ang preset ng platform para ayusin ito.',
  'validation.media_resolution_too_low.message':
    'Ang file na ito ay {actual}. {provider} nangangailangan ng hindi bababa sa {required}.',
  'validation.media_duration_too_long.message':
    'Ang video na ito ay {actual}. {provider} tumatanggap ng hanggang {limit} para sa account na ito.',
  'validation.media_duration_too_short.message':
    'Ang video na ito ay {actual}. {provider} nangangailangan ng hindi bababa sa {limit}.',
  'validation.media_file_too_large.message':
    'Ang file na ito ay {actual}. {provider} tumatanggap ng hanggang {limit}.',
  'validation.media_mixed_types_unsupported.message':
    '{provider} hindi maaaring mag-publish ng mga larawan at video sa parehong post.',
  'validation.media_unavailable.message':
    'Isang naka-attach na file ay hindi na available. Alisin ito sa post o i-upload ulit.',
  'validation.alt_text_missing.message':
    'Nawawala ang alt text {count, plural, one {# larawan} other {# mga larawan}}.',
  'validation.alt_text_missing.hint': 'Ilarawan ang larawan, o markahan ito bilang pandekorasyon.',
  'validation.thumbnail_unsupported.message':
    '{provider} ay hindi tumatanggap ng custom na thumbnail dito.',
  'validation.destination_required.message': 'Piliin kung saan ito mag-publish {provider}.',
  'validation.destination_unsupported.message':
    '{destination} ay hindi tumatanggap ng ganitong uri ng post sa {provider}.',
  'validation.mention_unresolved.message':
    '{count, plural, one {# hindi naitugma ang pagbanggit sa isang tunay na account} other {# hindi naitugma ang mga pagbanggit sa mga totoong account}}.',
  'validation.mention_unresolved.hint':
    'Piliin ang account mula sa mga resulta ng paghahanap, o alisin ang pagbanggit. Ang simpleng text ay hindi kailanman na-publish bilang isang native na tag.',
  'validation.hashtag_count_exceeded.message':
    '{count} mga hashtag. {provider} binibilang ng higit sa {limit} bilang spam.',
  'validation.link_not_allowed.message':
    '{provider} hindi pinapayagan ang mga link sa field na ito.',
  'validation.link_destination_unverified.message':
    'Ang link na domain {domain} ay hindi na-verify para sa workspace na ito.',
  'validation.privacy_setting_required.message':
    '{provider} nangangailangan ng tahasang pagpili sa privacy bago i-publish.',
  'validation.privacy_setting_required.hint':
    'Walang default. Piliin kung sino ang makakakita sa post na ito.',
  'validation.disclosure_required.message':
    'Ang post na ito ay nangangailangan ng pagsisiwalat sa ilalim ng mga panuntunan ng proyekto para sa {market}.',
  'validation.first_comment_unsupported.message':
    '{provider} ay hindi sumusuporta sa isang naka-iskedyul na unang komento para sa account na ito.',
  'validation.thread_unsupported.message':
    '{provider} ay hindi sumusuporta sa mga thread para sa account na ito.',
  'validation.repeat_end_required.message':
    'Ang isang umuulit na post ay nangangailangan ng isang petsa ng pagtatapos o isang bilang ng mga pag-uulit.',
  'validation.schedule_in_past.message': 'Lumipas ang oras na iyon {timeZone}.',
  'validation.schedule_too_far_ahead.message':
    'Ito ay mas maaga kaysa sa {limit} tumingin sa unahan nakatakda para sa kredensyal na ito.',
  'validation.schedule_outside_quiet_hours.message':
    'Ito ay nasa loob ng tahimik na oras na itinakda {project}.',
  'validation.duplicate_within_window.message':
    'Ang napakakatulad na nilalaman ay naka-iskedyul na o nai-publish para sa {account} sa loob {window}.',
  'validation.blocked_term_present.message':
    'Ang teksto ay naglalaman ng isang naka-block na termino para sa {project}.',
  'validation.unsupported_claim.message':
    'Ang claim na ito ay wala sa inaprubahang claim para sa {project}.',
  'validation.unsupported_claim.hint':
    'Idagdag ito sa mga naaprubahang claim na may ebidensya, o muling salitain ang pangungusap.',
  'validation.cadence_exceeded.message':
    '{account} maglalathala {count, plural, one {# oras} other {# beses}} sa araw na iyon, lampas sa limitasyon ng {limit}.',
  'validation.connection_paused.message': '{account} ay naka-pause at hindi ipa-publish.',
  'validation.account_type_invalid.message':
    '{account} ay hindi ang uri ng account {provider} kinakailangan para sa uri ng post na ito.',

  'validation.severity.error': 'Dapat ayusin',
  'validation.severity.warning': 'Suriin ito',
  'validation.severity.info': 'Para sa iyong kaalaman',
  'validation.field.required': 'Kinakailangan ang field na ito.',
  'validation.field.tooShort':
    'Gumamit ng hindi bababa sa {min, plural, one {# karakter} other {# mga karakter}}.',
  'validation.field.tooLong':
    'Gamitin sa pinakamaraming {max, plural, one {# karakter} other {# mga karakter}}.',
  'validation.field.invalidEmail': 'Maglagay ng wastong email address.',
  'validation.field.invalidUrl': 'Maglagay ng buong URL, kasama ang https.',
  'validation.field.invalidDate': 'Maglagay ng wastong petsa.',
  'validation.field.invalidTime': 'Maglagay ng wastong oras.',
  'validation.field.invalidNumber': 'Maglagay ng numero.',
  'validation.field.outOfRange': 'Maglagay ng halaga sa pagitan {min} at {max}.',
  'validation.field.mustMatch': 'Dapat magkatugma ang dalawang value na ito.',
  'validation.field.alreadyTaken': 'Ginagamit na yan.',
  'validation.field.unsafeValue': 'Ang halagang iyon ay hindi pinapayagan dito.',
} as const;
