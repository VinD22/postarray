/** Sign in, sign up, alias login, password reset and session handling. */
export const authMessages = {
  'auth.signIn.title': 'Fazer login',
  'auth.signIn.subtitle': 'Publique, aprove e veja exatamente o que aconteceu.',
  'auth.signUp.title': 'Crie sua conta',
  'auth.continueWithGoogle': 'Continue com Google',
  'auth.continueWithFacebook': 'Continue com o Facebook',
  'auth.orUseEmail': 'Ou use seu e-mail',
  'auth.email.label': 'E-mail',
  'auth.email.placeholder': 'você@empresa.com',
  'auth.password.label': 'Senha',
  'auth.password.show': 'Mostrar senha',
  'auth.password.hide': 'Ocultar senha',
  'auth.password.strength.weak': 'Muito fácil de adivinhar',
  'auth.password.strength.fair': 'Poderia ser mais forte',
  'auth.password.strength.strong': 'Forte',
  'auth.password.breached': 'Esta senha apareceu em uma violação pública. Escolha um diferente.',
  'auth.password.requirements':
    'Pelo menos 12 caracteres. O comprimento é mais importante do que os símbolos.',
  'auth.username.label': 'Nome de usuário',
  'auth.username.help':
    'Um nome de usuário conecta você à sua conta de e-mail existente. Ele nunca substitui sua senha.',
  'auth.magicLink.send': 'Envie-me um e-mail com link de login',
  'auth.magicLink.sent':
    'Se esse endereço tiver uma conta, um link de login estará a caminho. O link funciona uma vez e expira em {minutes, plural, one {# minuto} other {# minutos} many {# minutos}}.',
  'auth.magicLink.checkEmail': 'Verifique seu e-mail',
  'auth.magicLink.resend': 'Envie outro link',
  'auth.magicLink.resendIn':
    'Você pode enviar outro link em {seconds, plural, one {# segundo} other {# segundos} many {# segundos}}.',
  'auth.forgotPassword': 'Esqueceu sua senha?',
  'auth.resetPassword.title': 'Escolha uma nova senha',
  'auth.resetPassword.sent':
    'Se esse endereço tiver uma conta, as instruções de redefinição estão a caminho.',
  'auth.resetPassword.done': 'Sua senha foi atualizada. Faça login com ele.',
  'auth.noAccount': 'Ainda não tem conta?',
  'auth.haveAccount': 'Já tem uma conta?',

  'auth.mfa.title': 'Autenticação de dois fatores',
  'auth.mfa.enterCode': 'Insira o código de seis dígitos do seu aplicativo autenticador',
  'auth.mfa.recoveryCode': 'Use um código de recuperação',
  'auth.mfa.setupTitle': 'Configurar autenticação de dois fatores',
  'auth.mfa.setupScan': 'Digitalize este código com seu aplicativo autenticador.',
  'auth.mfa.setupManual': 'Ou insira esta chave manualmente',
  'auth.mfa.recoveryCodes': 'Códigos de recuperação',
  'auth.mfa.recoveryCodesHelp':
    'Guarde-os em algum lugar seguro. Cada um funciona uma vez se você perder seu dispositivo.',
  'auth.mfa.requiredForAction': 'Confirme com autenticação de dois fatores para continuar.',

  'auth.passkey.title': 'Chaves de acesso',
  'auth.passkey.add': 'Adicione uma chave de acesso',
  'auth.passkey.signIn': 'Faça login com uma chave de acesso',
  'auth.passkey.added': 'Senha adicionada {date}',

  'auth.session.expired': 'Sua sessão expirou. Faça login novamente para continuar.',
  'auth.session.signedOut': 'Você está desconectado.',
  'auth.session.otherDevice': 'Você fez login em outro dispositivo.',

  'auth.invite.title': '{inviter} convidou você para {workspace}',
  'auth.invite.accept': 'Aceitar convite',
  'auth.invite.declined': 'Convite recusado.',
  'auth.invite.expired': 'Este convite expirou. Peça a {inviter} para enviar outro.',
  'auth.invite.roleNote': 'Você ingressará como {role}.',

  'auth.verifyEmail.title': 'Confirme seu e-mail',
  'auth.verifyEmail.body': 'Enviamos um link de confirmação para {email}.',
  'auth.verifyEmail.done': 'Seu email está confirmado.',

  'auth.rateLimited':
    'Muitas tentativas. Tente novamente em {minutes, plural, one {# minuto} other {# minutos} many {# minutos}}.',
  'auth.genericFailure': 'Isso não funcionou. Verifique os detalhes e tente novamente.',
  'auth.newPassword.help':
    'Escolha uma senha que você ainda não tenha usado aqui. Ela conecta você em todos os dispositivos.',
  'auth.newPassword.label': 'Nova senha',
  'auth.newPassword.confirmLabel': 'Confirme a nova senha',
  'auth.newPassword.mismatch': 'As duas senhas não coincidem.',
  'auth.newPassword.submit': 'Salvar a nova senha',
  'auth.newPassword.linkMissing': 'Esta página precisa do link do seu e-mail de redefinição.',
  'auth.newPassword.linkInvalid': 'Este link de redefinição expirou ou já foi usado.',
  'auth.newPassword.linkInvalidAction': 'Solicitar um novo link',
  'auth.newPassword.signInNow': 'Entrar',
} as const;
