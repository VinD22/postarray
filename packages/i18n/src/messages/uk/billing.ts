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
  'billing.title': 'Виставлення рахунків',
  'billing.plan.name': 'Post Array',
  'billing.plan.single': 'Один план. Кожна функція. Без ярусів.',
  'billing.plan.monthlyPrice': '$29/місяць',
  'billing.plan.annualPrice': '300 доларів на рік',
  'billing.plan.annualFraming': '$25/місяць виставляється щорічно. Економте 48 доларів на рік.',
  'billing.plan.interval.monthly': 'Щомісяця',
  'billing.plan.interval.annual': 'Річний',
  'billing.plan.selectInterval': 'Виберіть платіжний інтервал',
  'billing.plan.includes.title': 'Що входить',
  'billing.plan.includes.channels': 'До 30 активних соціальних каналів',
  'billing.plan.includes.members': 'Необмежена кількість членів команди',
  'billing.plan.includes.posts':
    'Необмежена кількість чернеток і запланованих дописів у рамках добросовісного використання',
  'billing.plan.includes.connectors': "Кожен затверджений роз'єм",
  'billing.plan.includes.analytics': 'Аналітика зберігається з дня підключення облікового запису',
  'billing.plan.includes.api': 'REST API, віддалений сервер MCP, CLI і веб-хуки',
  'billing.plan.includes.automation':
    'Правила автоматизації, автопост RSS і відстежувані посилання',
  'billing.plan.includes.ai': 'Текстова допомога DeepSeek за обмеженнями зловживань і витрат',
  'billing.plan.includes.support': 'Підтримка електронною поштою та в програмі',
  'billing.plan.fairUse':
    'Справедливе використання означає боротьбу зі спамом, контроль тарифів і витрат постачальників, що захищає ваші облікові записи. Для кожного абонента вони діють однаково.',

  'billing.trial.dueToday': '0 доларів США до сплати сьогодні',
  'billing.trial.paymentMethodRequired':
    'Polar збирає спосіб оплати зараз і сьогодні нічого не стягує.',
  'billing.trial.firstCharge': 'Перший заряд {amount} на {date}',
  'billing.trial.renewal': 'Відновлює {amount} кожен {interval} після цього',
  'billing.trial.cancelBefore':
    'Скасуйте в налаштуваннях до цієї дати, і з вас не стягуватиметься плата.',
  'billing.trial.reminder':
    'Polar надішле вам електронний лист за три дні до переходу на пробну версію.',
  'billing.trial.daysRemaining':
    '{count, plural, =0 {Судове засідання завершується сьогодні} one {суд, # залишився день} few {суд, # залишилося днів} many {суд, # залишилося днів} other {суд, # залишилося днів}}',
  'billing.trial.converted': 'Ваш пробний період перетворено на {date}.',
  'billing.trial.canceled': 'Ваш пробний період скасовано. З вас не стягуватиметься плата.',
  'billing.trial.abusePrevention':
    'Повторні випробування обмежені. Якщо пробна версія недоступна для цього облікового запису, зверніться до служби підтримки.',

  'billing.checkout.open': 'Продовжити до оплати',
  'billing.checkout.hostedBy':
    'Оформленням і виставленням рахунків-фактур займається Polar, наш офіційний продавець.',
  'billing.checkout.taxNote':
    'Polar збирає та перераховує будь-який податок із продажів або ПДВ, які застосовуються.',
  'billing.checkout.notEntitledYet':
    'Ми надаємо доступ після того, як Polar підтвердить підписку, а не через переспрямування браузера. Зазвичай це займає кілька секунд.',
  'billing.checkout.returning': 'Підтвердження вашої підписки на Polar',

  'billing.subscription.status.trialing': 'суд',
  'billing.subscription.status.active': 'Активний',
  'billing.subscription.status.pastDue': 'Прострочена оплата',
  'billing.subscription.status.canceled': 'Скасовано',
  'billing.subscription.status.unpaid': 'Неоплачений',
  'billing.subscription.status.none': 'Немає підписки',
  'billing.subscription.renewsOn': 'Відновлює {amount} на {date}',
  'billing.subscription.endsOn': 'Доступ існує до {date}',
  'billing.subscription.pastDueBody':
    'Останній платіж не пройшов. Щоб продовжити публікацію, оновіть спосіб оплати. Після пільгового періоду робоча область стає лише для читання, а заплановані публікації припиняються.',
  'billing.subscription.readOnly':
    'Ця робоча область доступна лише для читання. Ваш вміст, квитанції та з’єднання неушкоджені.',
  'billing.subscription.portal': 'Відкрийте портал клієнтів Polar',
  'billing.subscription.invoices': 'Рахунки-фактури',
  'billing.subscription.paymentMethod': 'Спосіб оплати',
  'billing.subscription.managedByPolar': 'Керується Polar',

  'billing.cancel.title': 'Скасувати підписку',
  'billing.cancel.beforeTrialEnd':
    'Скасуйте зараз, і з вас не стягуватиметься плата. Ви зберігаєте всі функції до {date}.',
  'billing.cancel.afterTrial':
    'Ви зберігаєте доступ до {date}. Ніщо не видаляється, коли воно закінчується.',
  'billing.cancel.confirm': 'Скасувати підписку',
  'billing.cancel.confirmed': 'Скасовано. З вас не стягуватиметься плата.',
  'billing.cancel.keepData':
    'Ваші чернетки, квитанції та аналітика залишаються в цій робочій області.',

  'billing.usage.title': 'Використання',
  'billing.usage.meteredNote':
    'Деякі витрати постачальника передаються за собівартістю, оскільки постачальник стягує плату за операцію.',
  'billing.usage.xCharges':
    'X платить за кожну публікацію. Дописи, які містять URL, коштують дорожче, ніж звичайний текст.',
  'billing.usage.balance': 'Використання балансу {amount}',
  'billing.usage.estimatedBeforeAction': 'Ця дія оцінюється в {amount}.',
  'billing.usage.periodTotal': '{amount} використання з тих пір {date}',
  'billing.usage.noMediaCredits':
    'Немає кредитів для створення зображень або відео, оскільки Post Array не створює медіа.',

  'billing.downgrade.overLimit':
    'Ця робоча область має {count, plural, one {# канал} few {# канали} many {# канали} other {# канали}} понад ліміт. Нові дії на цих каналах блокуються. Вам нічого не відключається.',

  'billing.mediaGeneration.title': 'Чому ми не створюємо зображення чи відео',
  'billing.mediaGeneration.explanation':
    'Ми зосереджені на тому, щоб допомогти вам планувати, затверджувати, публікувати та вчитися. Ми не створюємо зображення чи відео у версії 1, оскільки медіа-файли, готові до бренду, потребують не лише короткої підказки: для цього потрібна ваша повна візуальна система, точні відомості про продукт, ліцензовані ресурси, люди та дозволи на використання, а також ретельний аналіз. Креативні моделі теж швидко змінюються. Ми рекомендуємо наразі перевірені спеціалізовані інструменти та полегшуємо впровадження їхньої роботи у ваші кампанії, а ви зберігаєте творчий контроль.',

  'billing.referral.title': 'Реферали',
  'billing.referral.disclosure':
    'Реферальні посилання повинні розкриватися скрізь, де ви ними ділитеся. Комісія ніколи не залежить від позитивного відгуку.',
  'billing.referral.link': 'Ваше реферальне посилання',
  'billing.referral.attributed':
    '{count, plural, one {# написана реєстрація} few {# приписані реєстрації} many {# приписані реєстрації} other {# приписані реєстрації}}',
  'billing.referral.commissionPending': 'Очікує, утримується, доки вікно повернення не закриється',
  'billing.referral.commissionApproved': 'Затверджено',
  'billing.referral.commissionReversed': 'Скасовано після відшкодування',
  'billing.referral.payout': 'Бігають виплати {schedule}.',
} as const;
