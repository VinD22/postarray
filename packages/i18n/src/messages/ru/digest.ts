/**
 * The weekly digest email. Only the `email.digest.*` keys are translated here
 * (the `digest.*` in-app keys are outside this locale's current coverage and
 * fall back to English).
 */
export const digestMessages = {
  'email.digest.subject': 'Ваша неделя в {workspaceName}',
  'email.digest.intro':
    'Вот что мы можем видеть для {workspaceName} с {windowStart} по {windowEnd}.',
  'email.digest.noData':
    'Мы ничего не смогли измерить на этой неделе. Если число отсутствует, оно отсутствует потому, что мы не смогли его прочитать, а не потому, что оно было равно нулю.',
  'email.digest.footer':
    'Вы получаете это письмо, потому что для {workspaceName} включена еженедельная сводка. Отключите её в настройках рабочего пространства.',
} as const;
