/** Sign in, sign up, alias login, password reset and session handling. */
export const authMessages = {
  'auth.signIn.title': 'Войти',
  'auth.signIn.subtitle': 'Опубликуйте, одобрите и посмотрите, что именно произошло.',
  'auth.signUp.title': 'Создайте свою учетную запись',
  'auth.signUp.subtitle': 'Семь дней со всеми функциями. 0 долларов США к оплате сегодня.',
  'auth.continueWithGoogle': 'Продолжить с Google',
  'auth.continueWithFacebook': 'Продолжить через Facebook',
  'auth.orUseEmail': 'Или используйте свою электронную почту',
  'auth.email.label': 'электронная почта',
  'auth.email.placeholder': 'you@company.com',
  'auth.password.label': 'Пароль',
  'auth.password.show': 'Показать пароль',
  'auth.password.hide': 'Скрыть пароль',
  'auth.password.strength.weak': 'Слишком легко угадать',
  'auth.password.strength.fair': 'Могло бы быть сильнее',
  'auth.password.strength.strong': 'Сильный',
  'auth.password.breached': 'Этот пароль оказался в результате публичного взлома. Выберите другой.',
  'auth.password.requirements': 'Минимум 12 символов. Длина имеет большее значение, чем символы.',
  'auth.username.label': 'Имя пользователя',
  'auth.username.help':
    'Имя пользователя позволяет войти в существующую учетную запись электронной почты. Он никогда не заменяет ваш пароль.',
  'auth.magicLink.send': 'Отправьте мне ссылку для входа на почту',
  'auth.magicLink.sent':
    'Если на этом адресе есть учетная запись, ссылка для входа уже в пути. Ссылка работает один раз и действует через {minutes, plural, one {# минута} few {# минут} many {# минут} other {# минут}}.',
  'auth.magicLink.checkEmail': 'Проверьте свою электронную почту',
  'auth.magicLink.resend': 'Отправить еще ссылку',
  'auth.magicLink.resendIn':
    'Вы можете отправить еще одну ссылку через {seconds, plural, one {# секунд} few {# секунд} many {# секунд} other {# секунд}}.',
  'auth.forgotPassword': 'Забыли пароль?',
  'auth.resetPassword.title': 'Выберите новый пароль',
  'auth.resetPassword.sent':
    'Если на этом адресе есть учетная запись, инструкции по сбросу уже в пути.',
  'auth.resetPassword.done': 'Ваш пароль обновлен. Войдите с ним.',
  'auth.noAccount': 'Еще нет аккаунта?',
  'auth.haveAccount': 'У вас уже есть аккаунт?',
  'auth.terms.accept':
    'Продолжая, вы принимаете Условия и Уведомление о конфиденциальности версии {version}.',
  'auth.terms.updated':
    'Условия изменились на {date}. Прочтите краткую информацию о том, что изменилось, затем согласитесь, чтобы продолжить.',

  'auth.mfa.title': 'Двухфакторная аутентификация',
  'auth.mfa.enterCode': 'Введите шестизначный код из приложения для аутентификации.',
  'auth.mfa.recoveryCode': 'Используйте код восстановления',
  'auth.mfa.setupTitle': 'Настройте двухфакторную аутентификацию',
  'auth.mfa.setupScan': 'Отсканируйте этот код с помощью приложения для аутентификации.',
  'auth.mfa.setupManual': 'Или введите этот ключ вручную',
  'auth.mfa.recoveryCodes': 'Коды восстановления',
  'auth.mfa.recoveryCodesHelp':
    'Храните их в безопасном месте. Каждый из них сработает один раз, если вы потеряете устройство.',
  'auth.mfa.requiredForAction': 'Подтвердите двухфакторную аутентификацию, чтобы продолжить.',

  'auth.passkey.title': 'Ключи доступа',
  'auth.passkey.add': 'Добавить ключ доступа',
  'auth.passkey.signIn': 'Войти с помощью пароля',
  'auth.passkey.added': 'Добавлен пароль {date}',

  'auth.session.expired': 'Срок действия вашей сессии истек. Войдите еще раз, чтобы продолжить.',
  'auth.session.signedOut': 'Вы вышли из системы.',
  'auth.session.otherDevice': 'Вы вошли в систему на другом устройстве.',

  'auth.invite.title': '{inviter} пригласил вас на {workspace}',
  'auth.invite.accept': 'Принять приглашение',
  'auth.invite.declined': 'Приглашение отклонено.',
  'auth.invite.expired':
    'Срок действия этого приглашения истек. Попросите {inviter} отправить еще один.',
  'auth.invite.roleNote': 'Вы присоединитесь как {role}.',

  'auth.verifyEmail.title': 'Подтвердите свой адрес электронной почты',
  'auth.verifyEmail.body': 'Мы отправили ссылку для подтверждения на {email}.',
  'auth.verifyEmail.done': 'Ваш адрес электронной почты подтвержден.',

  'auth.rateLimited':
    'Слишком много попыток. Повторите попытку через {minutes, plural, one {# минута} few {# минут} many {# минут} other {# минут}}.',
  'auth.genericFailure': 'Это не сработало. Проверьте детали и повторите попытку.',
} as const;
