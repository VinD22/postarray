/** Sign in, sign up, alias login, password reset and session handling. */
export const authMessages = {
  'auth.signIn.title': 'Увійдіть',
  'auth.signIn.subtitle': 'Опублікуйте, підтвердіть і подивіться, що саме сталося.',
  'auth.signUp.title': 'Створіть свій акаунт',
  'auth.signUp.subtitle': 'Сім днів із кожною функцією. 0 доларів США до сплати сьогодні',
  'auth.continueWithGoogle': 'Продовжуйте з Google',
  'auth.continueWithFacebook': 'Продовжуйте з Facebook',
  'auth.orUseEmail': 'Або скористайтеся своєю електронною поштою',
  'auth.email.label': 'Електронна пошта',
  'auth.email.placeholder': 'you@company.com',
  'auth.password.label': 'Пароль',
  'auth.password.show': 'Показати пароль',
  'auth.password.hide': 'Приховати пароль',
  'auth.password.strength.weak': 'Надто легко здогадатися',
  'auth.password.strength.fair': 'Міг бути сильнішим',
  'auth.password.strength.strong': 'Сильний',
  'auth.password.breached': 'Цей пароль з’явився в публічному доступі. Виберіть інший.',
  'auth.password.requirements': 'Мінімум 12 символів. Довжина важливіша за символи.',
  'auth.username.label': "Ім'я користувача",
  'auth.username.help':
    'Ім’я користувача дозволяє входити у ваш існуючий обліковий запис електронної пошти. Він ніколи не замінює ваш пароль.',
  'auth.magicLink.send': 'Надішліть мені посилання для входу електронною поштою',
  'auth.magicLink.sent':
    'Якщо ця адреса має обліковий запис, посилання для входу вже готове. Посилання працює один раз і діє через {minutes, plural, one {# хвилина} few {# хвилин} many {# хвилин} other {# хвилин}}.',
  'auth.magicLink.checkEmail': 'Перевір свою електронну пошту',
  'auth.magicLink.resend': 'Надішліть інше посилання',
  'auth.magicLink.resendIn':
    'Ви можете надіслати інше посилання {seconds, plural, one {# другий} few {# секунд} many {# секунд} other {# секунд}}.',
  'auth.forgotPassword': 'Забули пароль?',
  'auth.resetPassword.title': 'Виберіть новий пароль',
  'auth.resetPassword.sent':
    'Якщо ця адреса має обліковий запис, інструкції щодо скидання вже готові.',
  'auth.resetPassword.done': 'Ваш пароль оновлено. Увійдіть за допомогою нього.',
  'auth.noAccount': 'Ще немає облікового запису?',
  'auth.haveAccount': 'Вже маєте акаунт?',
  'auth.terms.accept':
    'Продовжуючи, ви приймаєте Умови та Повідомлення про конфіденційність, версія {version}.',
  'auth.terms.updated':
    'Умови змінено {date}. Прочитайте короткий опис того, що змінилося, а потім прийміть, щоб продовжити.',

  'auth.mfa.title': 'Двофакторна аутентифікація',
  'auth.mfa.enterCode': 'Введіть шестизначний код із програми автентифікації',
  'auth.mfa.recoveryCode': 'Використовуйте код відновлення',
  'auth.mfa.setupTitle': 'Налаштуйте двофакторну автентифікацію',
  'auth.mfa.setupScan': 'Відскануйте цей код за допомогою програми автентифікації.',
  'auth.mfa.setupManual': 'Або введіть цей ключ вручну',
  'auth.mfa.recoveryCodes': 'Коди відновлення',
  'auth.mfa.recoveryCodesHelp':
    'Зберігайте їх у безпечному місці. Кожен з них працює один раз, якщо ви втратите свій пристрій.',
  'auth.mfa.requiredForAction': 'Щоб продовжити, підтвердьте двофакторну автентифікацію.',

  'auth.passkey.title': 'Ключі доступу',
  'auth.passkey.add': 'Додайте ключ доступу',
  'auth.passkey.signIn': 'Увійдіть за допомогою ключа доступу',
  'auth.passkey.added': 'Ключ доступу додано {date}',

  'auth.session.expired': 'Ваш сеанс закінчився. Увійдіть знову, щоб продовжити.',
  'auth.session.signedOut': 'Ви вийшли.',
  'auth.session.otherDevice': 'Ви ввійшли на іншому пристрої.',

  'auth.invite.title': '{inviter} запросив вас на {workspace}',
  'auth.invite.accept': 'Прийняти запрошення',
  'auth.invite.declined': 'Запрошення відхилено.',
  'auth.invite.expired':
    'Термін дії цього запрошення минув. Запитуйте {inviter} щоб надіслати інший.',
  'auth.invite.roleNote': 'Ви приєднуєтеся як {role}.',

  'auth.verifyEmail.title': 'Підтвердьте свою електронну адресу',
  'auth.verifyEmail.body': 'Ми надіслали посилання для підтвердження {email}.',
  'auth.verifyEmail.done': 'Ваш email підтверджено.',

  'auth.rateLimited':
    'Забагато спроба. Повторіть спробу {minutes, plural, one {# хвилина} few {# хвилин} many {# хвилин} other {# хвилин}}.',
  'auth.genericFailure': 'Це не спрацювало. Перевірте деталі та повторіть спробу.',
} as const;
