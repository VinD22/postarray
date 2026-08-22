/**
 * The weekly digest email. Only the `email.digest.*` keys are translated here
 * (the `digest.*` in-app keys are outside this locale's current coverage and
 * fall back to English).
 */
export const digestMessages = {
  'email.digest.subject': 'Ваш тиждень у {workspaceName}',
  'email.digest.intro':
    'Ось що ми можемо побачити для {workspaceName} з {windowStart} по {windowEnd}.',
  'email.digest.noData':
    'Цього тижня ми нічого не змогли виміряти. Якщо число відсутнє, це тому, що ми не змогли його прочитати, а не тому, що воно дорівнювало нулю.',
  'email.digest.footer':
    'Ви отримуєте цей лист, бо для {workspaceName} увімкнено щотижневий підсумок. Вимкніть його в налаштуваннях робочої області.',
} as const;
