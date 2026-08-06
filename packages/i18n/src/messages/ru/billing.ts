/**
 * Billing, trial and plan copy.
 *
 * Several strings here are mandated word for word by the research and by the
 * launch acceptance checklist. Do not soften or restyle them:
 *  - `billing.trial.dueToday` must read "$0 due today".
 *  - `billing.plan.annualFraming` must state the saving in currency, never a
 *    percentage discount.
 *  - `billing.mediaGeneration.explanation` is the approved boundary paragraph.
 *    Tool Radar and the pricing page use this same key.
 */
export const billingMessages = {
  'billing.title': 'Биллинг',
  'billing.plan.name': 'Relay',
  'billing.plan.single': 'Один план. Каждая функция. Никаких уровней.',
  'billing.plan.monthlyPrice': '29 долларов США в месяц',
  'billing.plan.annualPrice': '300 долларов США в год',
  'billing.plan.annualFraming':
    '25 долларов США в месяц при ежегодной оплате. Экономьте 48 долларов в год.',
  'billing.plan.interval.monthly': 'Ежемесячно',
  'billing.plan.interval.annual': 'Ежегодный',
  'billing.plan.selectInterval': 'Выберите интервал выставления счетов',
  'billing.plan.includes.title': 'Что включено',
  'billing.plan.includes.channels': 'До 30 активных социальных каналов',
  'billing.plan.includes.members': 'Неограниченное количество членов команды',
  'billing.plan.includes.posts':
    'Неограниченное количество черновиков и запланированных публикаций при добросовестном использовании',
  'billing.plan.includes.connectors': 'Каждый утвержденный разъем',
  'billing.plan.includes.analytics': 'Аналитика сохраняется с момента подключения аккаунта',
  'billing.plan.includes.api':
    'REST API, удаленный сервер MCP, интерфейс командной строки и веб-перехватчики.',
  'billing.plan.includes.automation':
    'Правила автоматизации, автопостинг RSS и отслеживаемые ссылки',
  'billing.plan.includes.ai':
    'Текстовая помощь DeepSeek при злоупотреблениях и ограничениях по стоимости',
  'billing.plan.includes.support': 'Поддержка по электронной почте и в приложении',
  'billing.plan.fairUse':
    'Добросовестное использование означает защиту от спама, контроль тарифов и затрат поставщиков, которые защищают ваши учетные записи. Они работают одинаково для каждого абонента.',

  'billing.trial.length': 'Семидневная пробная версия со всеми функциями',
  'billing.trial.dueToday': '0 долларов США к оплате сегодня',
  'billing.trial.paymentMethodRequired':
    'Polar сейчас выбирает способ оплаты и сегодня ничего не взимает.',
  'billing.trial.firstCharge': 'Первая зарядка {amount} на {date}',
  'billing.trial.renewal': 'Обновляет {amount} каждый {interval} после этого.',
  'billing.trial.cancelBefore':
    'Отмените подписку в настройках до этой даты, и с вас не будет взиматься плата.',
  'billing.trial.reminder':
    'Polar отправит вам электронное письмо за три дня до перехода на пробную версию.',
  'billing.trial.daysRemaining':
    '{count, plural, =0 {Пробная версия заканчивается сегодня} one {Пробная версия, осталось # дня} few {Пробная версия, осталось # дней} many {Пробная версия, осталось # дней} other {Пробная версия, осталось # дней}}',
  'billing.trial.converted': 'Ваша пробная версия конвертирована на {date}.',
  'billing.trial.canceled': 'Пробная версия отменена. С вас не будет взиматься плата.',
  'billing.trial.abusePrevention':
    'Повторные испытания ограничены. Если пробная версия недоступна для этой учетной записи, обратитесь в службу поддержки.',

  'billing.checkout.open': 'Продолжить оформление заказа',
  'billing.checkout.hostedBy':
    'Оформление заказа и счета обрабатываются компанией Polar, нашим официальным продавцом.',
  'billing.checkout.taxNote':
    'Polar собирает и перечисляет любые применимые налоги с продаж или НДС.',
  'billing.checkout.notEntitledYet':
    'Мы предоставляем доступ после того, как Polar подтвердит подписку, а не через перенаправление браузера. Обычно это занимает несколько секунд.',
  'billing.checkout.returning': 'Подтверждение подписки на Polar',

  'billing.subscription.status.trialing': 'Пробная версия',
  'billing.subscription.status.active': 'Активный',
  'billing.subscription.status.pastDue': 'Платеж просрочен',
  'billing.subscription.status.canceled': 'Отменено',
  'billing.subscription.status.unpaid': 'Неоплачиваемый',
  'billing.subscription.status.none': 'Нет подписки',
  'billing.subscription.renewsOn': 'Продлевает {amount} на {date}',
  'billing.subscription.endsOn': 'Доступ продолжается до {date}.',
  'billing.subscription.pastDueBody':
    'Последний платеж не прошел. Обновите способ оплаты, чтобы продолжить публикацию. По истечении льготного периода рабочая область становится доступной только для чтения, а запланированные публикации прекращаются.',
  'billing.subscription.readOnly':
    'Это рабочее пространство доступно только для чтения. Ваш контент, квитанции и соединения нетронуты.',
  'billing.subscription.portal': 'Откройте портал для клиентов Polar',
  'billing.subscription.invoices': 'Счета-фактуры',
  'billing.subscription.paymentMethod': 'Способ оплаты',
  'billing.subscription.managedByPolar': 'Под управлением Polar',

  'billing.cancel.title': 'Отмените подписку',
  'billing.cancel.beforeTrialEnd':
    'Отмените сейчас, и с вас не будет взиматься плата. Вы сохраняете все функции до {date}.',
  'billing.cancel.afterTrial': 'Вы сохраняете доступ до {date}. По окончании ничего не удаляется.',
  'billing.cancel.confirm': 'Отменить подписку',
  'billing.cancel.confirmed': 'Отменено. С вас не будет взиматься плата.',
  'billing.cancel.keepData':
    'Ваши черновики, квитанции и аналитика остаются в этом рабочем пространстве.',

  'billing.usage.title': 'Использование',
  'billing.usage.meteredNote':
    'Некоторые затраты поставщика учитываются по себестоимости, поскольку поставщик взимает плату за операцию.',
  'billing.usage.xCharges':
    'X взимает плату за каждое сообщение. Сообщения, содержащие URL-адрес, стоят дороже, чем обычный текст.',
  'billing.usage.balance': 'Баланс использования {amount}',
  'billing.usage.estimatedBeforeAction': 'Это действие оценивается в {amount}.',
  'billing.usage.periodTotal': '{amount} используется с {date}',
  'billing.usage.noMediaCredits':
    'Авторские права на создание изображений или видео не взимаются, поскольку Relay не генерирует медиафайлы.',

  'billing.downgrade.overLimit':
    'В этой рабочей области {count, plural, one {# канала} few {# каналов} many {# каналов} other {# каналов}} превышен лимит. Новые действия на этих каналах блокируются. У вас ничего не отключено.',

  'billing.mediaGeneration.title': 'Почему мы не генерируем изображения или видео',
  'billing.mediaGeneration.explanation':
    'Мы стремимся помочь вам планировать, утверждать, публиковать и учиться. Мы не создаем изображения или видео в версии 1, поскольку готовые к брендированию медиа требуют большего, чем простое короткое приглашение: для этого нужна ваша полная визуальная система, точные сведения о продукте, лицензированные активы, люди и разрешения на использование, а также тщательная проверка. Креативные модели также быстро меняются. Мы рекомендуем проверенные на данный момент специализированные инструменты и упрощаем внедрение их готовой работы в ваши кампании, сохраняя при этом творческий контроль.',

  'billing.referral.title': 'Рефералы',
  'billing.referral.disclosure':
    'Реферальные ссылки должны быть раскрыты везде, где вы ими делитесь. Комиссия никогда не ставит условием положительного отзыва.',
  'billing.referral.link': 'Ваша реферальная ссылка',
  'billing.referral.attributed':
    '{count, plural, one {# зарегистрированных регистраций} few {# зарегистрированных регистраций} many {# зарегистрированных регистраций} other {# зарегистрированных регистраций}}',
  'billing.referral.commissionPending': 'Ожидается, удерживается до закрытия окна возврата средств',
  'billing.referral.commissionApproved': 'Утверждено',
  'billing.referral.commissionReversed': 'Отменено после возврата денег',
  'billing.referral.payout': 'Выплаты осуществляются {schedule}.',
} as const;
