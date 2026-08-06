/**
 * The fifteen publish states and the approval states.
 *
 * `state.<state>.label` is the short badge. `state.<state>.description` is the
 * sentence shown next to it. A state never relies on colour alone.
 */
export const stateMessages = {
  'state.draft.label': 'Draft',
  'state.draft.description':
    'Ang mga tao lang sa workspace na ito ang makakakita nito. Walang nakaiskedyul.',
  'state.validation_needed.label': 'Kailangan ang pagpapatunay',
  'state.validation_needed.description':
    'Ang isa o higit pang mga target ay may isyu na dapat ayusin bago ito maiiskedyul.',
  'state.approval_requested.label': 'Hiniling ang pag-apruba',
  'state.approval_requested.description': 'Naghihintay para sa {approver} upang magpasya.',
  'state.approved.label': 'Naaprubahan',
  'state.approved.description':
    'Inaprubahan ni {approver}. Maaari na itong mai-iskedyul o mai-publish.',
  'state.scheduled.label': 'Naka-iskedyul',
  'state.scheduled.description': 'Naglalathala {time} sa {timeZone}.',
  'state.preparing_media.label': 'Paghahanda ng media',
  'state.preparing_media.description': 'Pag-upload at pag-convert ng mga file para sa platform.',
  'state.dispatching.label': 'Nagpapadala',
  'state.dispatching.description': 'Ipinapadala sa {provider} ngayon.',
  'state.provider_processing.label': 'Pagproseso ng provider',
  'state.provider_processing.description':
    '{provider} tinanggap ang pag-upload at pinoproseso pa rin ito. Kinukumpirma namin kapag ito ay live.',
  'state.published.label': 'Nai-publish',
  'state.published.description': 'Mabuhay sa {provider} mula noong {time}.',
  'state.partially_published.label': 'Bahagyang nai-publish',
  'state.partially_published.description':
    '{published, plural, one {# na-publish na target} other {# mga target na nai-publish}}, {failed, plural, one {# nabigo} other {# nabigo}}. Ang mga nai-publish na post ay live at hindi ibinalik.',
  'state.action_required.label': 'Kinakailangan ang pagkilos',
  'state.action_required.description': "Hindi ito magpapatuloy hangga't wala kang ginagawa.",
  'state.retry_scheduled.label': 'Subukang muli ang nakaiskedyul',
  'state.retry_scheduled.description':
    'Pagtatangka {attempt} ng {max} tatakbo sa {time}. Walang nadoble.',
  'state.failed_permanently.label': 'Nabigo',
  'state.failed_permanently.description':
    'Hindi na ito muling susubukan. Ang iyong nilalaman ay napanatili at ang dahilan ay nasa resibo.',
  'state.canceled.label': 'Kinansela',
  'state.canceled.description': 'Kinansela ni {actor} sa {date}. Walang nai-publish.',
  'state.deleted_externally.label': 'Tinanggal sa platform',
  'state.deleted_externally.description':
    'Wala na ang post na ito {provider}. Ang resibo at ang mga sukatan na nakolekta bago ito napunta ay itinatago.',

  'state.approval.not_required.label': 'Walang kinakailangang pag-apruba',
  'state.approval.not_required.description':
    'Ang patakaran para sa mga target na ito ay hindi nangangailangan ng pag-apruba.',
  'state.approval.requested.label': 'Hiniling',
  'state.approval.requested.description': 'Ipinadala sa {approver} {relativeTime}.',
  'state.approval.in_review.label': 'Sa pagsusuri',
  'state.approval.in_review.description': '{approver} tinitingnan ito ngayon.',
  'state.approval.approved.label': 'Naaprubahan',
  'state.approval.approved.description': 'Inaprubahan ni {approver} sa {date}.',
  'state.approval.changes_requested.label': 'Mga pagbabagong hiniling',
  'state.approval.changes_requested.description': '{approver} humingi ng mga pagbabago sa {date}.',
  'state.approval.rejected.label': 'Tinanggihan',
  'state.approval.rejected.description': 'Tinanggihan ni {approver} sa {date}.',
  'state.approval.expired.label': 'Nag-expire na',
  'state.approval.expired.description':
    'Nag-expire ang kahilingang ito noong {date} nang walang desisyon.',
  'state.approval.withdrawn.label': 'Binawi',
  'state.approval.withdrawn.description': 'Binawi ng may-akda ang kahilingang ito noong {date}.',

  'state.summary.targets':
    '{ready, plural, one {# handa na ang target} other {# handa na ang mga target}}, {blocked, plural, =0 {walang naka-block} one {# hinarangan} other {# hinarangan}}',
  'state.changedAt': 'Nagbago {relativeTime}',
} as const;
