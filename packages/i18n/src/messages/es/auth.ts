/** Sign in, sign up, alias login, password reset and session handling. */
export const authMessages = {
  'auth.signIn.title': 'Iniciar sesión',
  'auth.signIn.subtitle': 'Publique, apruebe y vea exactamente lo que sucedió.',
  'auth.signUp.title': 'Crea tu cuenta',
  'auth.signUp.subtitle': 'Seven days with every feature. $0 due today.',
  'auth.continueWithGoogle': 'Continuar con Google',
  'auth.continueWithFacebook': 'Continuar con Facebook',
  'auth.orUseEmail': 'O usa tu correo electrónico',
  'auth.email.label': 'Correo electrónico',
  'auth.email.placeholder': 'usted@empresa.com',
  'auth.password.label': 'Contraseña',
  'auth.password.show': 'Mostrar contraseña',
  'auth.password.hide': 'Ocultar contraseña',
  'auth.password.strength.weak': 'Demasiado fácil de adivinar',
  'auth.password.strength.fair': 'Podría ser más fuerte',
  'auth.password.strength.strong': 'fuerte',
  'auth.password.breached':
    'Esta contraseña ha aparecido en una vulneración pública. Elige uno diferente.',
  'auth.password.requirements': 'Al menos 12 caracteres. La longitud importa más que los símbolos.',
  'auth.username.label': 'Nombre de usuario',
  'auth.username.help':
    'Un nombre de usuario inicia sesión en su cuenta de correo electrónico existente. Nunca reemplaza su contraseña.',
  'auth.magicLink.send': 'Envíeme un correo electrónico con un enlace para iniciar sesión',
  'auth.magicLink.sent':
    'Si esa dirección tiene una cuenta, un enlace de inicio de sesión está en camino. El enlace funciona una vez y caduca in {minutes, plural, one {# minuto} many {# minutos} other {# minutos}}.',
  'auth.magicLink.checkEmail': 'Revisa tu correo electrónico',
  'auth.magicLink.resend': 'enviar otro enlace',
  'auth.magicLink.resendIn':
    'Puedes enviar otro enlace in {seconds, plural, one {# segundo} many {# segundos} other {# segundos}}.',
  'auth.forgotPassword': '¿Olvidaste tu contraseña?',
  'auth.resetPassword.title': 'Elija una nueva contraseña',
  'auth.resetPassword.sent':
    'Si esa dirección tiene una cuenta, las instrucciones de restablecimiento están en camino.',
  'auth.resetPassword.done': 'Tu contraseña está actualizada. Inicia sesión con él.',
  'auth.noAccount': '¿Aún no tienes cuenta?',
  'auth.haveAccount': '¿Ya tienes una cuenta?',
  'auth.terms.accept':
    'Al continuar aceptas los Términos y el Aviso de Privacidad, version {version}.',
  'auth.terms.updated':
    'Los Términos cambiaron on {date}. Lea el resumen de lo que cambió y luego acepte continuar.',

  'auth.mfa.title': 'Autenticación de dos factores',
  'auth.mfa.enterCode': 'Ingrese el código de seis dígitos de su aplicación de autenticación',
  'auth.mfa.recoveryCode': 'Utilice un código de recuperación',
  'auth.mfa.setupTitle': 'Configurar la autenticación de dos factores',
  'auth.mfa.setupScan': 'Escanee este código con su aplicación de autenticación.',
  'auth.mfa.setupManual': 'O ingrese esta clave manualmente',
  'auth.mfa.recoveryCodes': 'Códigos de recuperación',
  'auth.mfa.recoveryCodesHelp':
    'Guárdelos en un lugar seguro. Cada uno funciona una vez si pierdes tu dispositivo.',
  'auth.mfa.requiredForAction': 'Confirme con autenticación de dos factores para continuar.',

  'auth.passkey.title': 'Claves de acceso',
  'auth.passkey.add': 'Agregar una clave de acceso',
  'auth.passkey.signIn': 'Iniciar sesión con una clave de acceso',
  'auth.passkey.added': 'Clave de acceso added {date}',

  'auth.session.expired': 'Tu sesión expiró. Inicia sesión nuevamente para continuar.',
  'auth.session.signedOut': 'Has cerrado sesión.',
  'auth.session.otherDevice': 'Iniciaste sesión en otro dispositivo.',

  'auth.invite.title': '{inviter} te invitó to {workspace}',
  'auth.invite.accept': 'Aceptar invitación',
  'auth.invite.declined': 'Invitación rechazada.',
  'auth.invite.expired': 'Esta invitación expiró. Ask {inviter} para enviar otro.',
  'auth.invite.roleNote': 'Te unirás a as {role}.',

  'auth.verifyEmail.title': 'Confirma tu correo electrónico',
  'auth.verifyEmail.body': 'Enviamos un enlace de confirmación to {email}.',
  'auth.verifyEmail.done': 'Su correo electrónico está confirmado.',

  'auth.rateLimited':
    'Demasiados intentos. Inténtalo de nuevo in {minutes, plural, one {# minutos} many {# minutos} other {# minutos}}.',
  'auth.genericFailure': 'Eso no funcionó. Verifique los detalles y vuelva a intentarlo.',
  'auth.newPassword.help':
    'Elige una contraseña que no hayas usado aquí antes. Te da acceso en todos los dispositivos.',
  'auth.newPassword.label': 'Nueva contraseña',
  'auth.newPassword.confirmLabel': 'Confirma la nueva contraseña',
  'auth.newPassword.mismatch': 'Las dos contraseñas no coinciden.',
  'auth.newPassword.submit': 'Guardar la nueva contraseña',
  'auth.newPassword.linkMissing': 'Esta página necesita el enlace del correo de restablecimiento.',
  'auth.newPassword.linkInvalid': 'Este enlace de restablecimiento caducó o ya se usó.',
  'auth.newPassword.linkInvalidAction': 'Solicitar un enlace nuevo',
  'auth.newPassword.signInNow': 'Iniciar sesión',
} as const;
