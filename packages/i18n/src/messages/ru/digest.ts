/** Russian beta translations for the weekly digest and its email. */
export const digestMessages = {
  'digest.title': 'Эта неделя',
  'digest.subtitle': 'Вот что мы можем увидеть с {windowStart} по {windowEnd}.',
  'digest.empty': 'На этой неделе пока нечего обобщать. Опубликуйте что-нибудь, и это появится здесь.',
  'digest.regenerate': 'Собрать неделю заново',
  'digest.generating': 'Составляем сводку за эту неделю',
  'digest.source.deterministic': 'Создано по вашим записям о публикациях и собственным измерениям, без помощника письма.',
  'digest.source.ai': 'Создано помощником по вашим записям. Каждое число проверено по этим записям.',
  'digest.unavailable.aiOff': 'Помощник письма выключен, поэтому показана обычная версия. Ничего не пропущено.',
  'digest.unavailable.rejected': 'Версия помощника не совпала с вашими данными и была удалена. Показана обычная версия.',
  'digest.headline.published':
    '{published, plural, =0 {Не завершено ни одной публикации} one {Завершена # публикация} few {Завершены # публикации} many {Завершено # публикаций} other {Завершено # публикации}} с {windowStart} по {windowEnd}.',
  'digest.headline.nothingPublished': 'С {windowStart} по {windowEnd} ничего не было опубликовано.',
  'digest.outcome.published':
    '{count, plural, one {На платформе {provider} завершена # публикация} few {На платформе {provider} завершены # публикации} many {На платформе {provider} завершено # публикаций} other {На платформе {provider} завершено # публикации}}.',
  'digest.outcome.partial':
    '{count, plural, one {На платформе {provider} # публикация достигла некоторых мест назначения, но не других} few {На платформе {provider} # публикации достигли некоторых мест назначения, но не других} many {На платформе {provider} # публикаций достигли некоторых мест назначения, но не других} other {На платформе {provider} # публикации достигли некоторых мест назначения, но не других}}.',
  'digest.outcome.failed':
    '{count, plural, one {На платформе {provider} не вышла # публикация} few {На платформе {provider} не вышли # публикации} many {На платформе {provider} не вышло # публикаций} other {На платформе {provider} не вышло # публикации}}.',
  'digest.metrics.noneYet': 'Измерения за эту неделю ещё не поступили. Это значит, что мы не знаем результат публикаций, а не то, что он был плохим.',
  'digest.freshness.statement':
    '{label, select, fresh {Измерения в последний раз синхронизировались в {lastObservedAt}.} stale {Измерения не синхронизировались с {lastObservedAt}, поэтому приведённые выше числа могут быть устаревшими.} other {Пока ничего не синхронизировано, поэтому выше нет измеренных данных.}}',
  'digest.narrative.headline': '{statement}',
  'digest.narrative.observation': '{statement}',
  'digest.narrative.confounder': 'Важно знать: {confounder}',
  'digest.narrative.notSupported': '{statement}',
  'digest.narrative.nextAction': '{statement}',
  'digest.settings.title': 'Еженедельная сводка по электронной почте',
  'digest.settings.description': 'Короткое письмо каждую неделю о том, что вышло и что мы смогли измерить. Включено по умолчанию.',
  'digest.settings.enabled': 'Отправлять еженедельную сводку',
  'email.digest.subject': 'Ваша неделя в {workspaceName}',
  'email.digest.intro':
    'Вот что мы можем видеть для {workspaceName} с {windowStart} по {windowEnd}.',
  'email.digest.noData':
    'Мы ничего не смогли измерить на этой неделе. Если число отсутствует, оно отсутствует потому, что мы не смогли его прочитать, а не потому, что оно было равно нулю.',
  'email.digest.footer':
    'Вы получаете это письмо, потому что для {workspaceName} включена еженедельная сводка. Отключите её в настройках рабочего пространства.',
} as const;
