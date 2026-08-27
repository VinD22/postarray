/** Sign in, sign up, alias login, password reset and session handling. */
export const authMessages = {
  'auth.signIn.title': 'Accedi',
  'auth.signIn.subtitle': 'Pubblica, approva e guarda esattamente cosa è successo.',
  'auth.signUp.title': 'Crea il tuo account',
  'auth.continueWithGoogle': 'Continua con Google',
  'auth.continueWithFacebook': 'Continua con Facebook',
  'auth.orUseEmail': 'Oppure usa la tua email',
  'auth.email.label': 'E-mail',
  'auth.email.placeholder': 'tu@azienda.com',
  'auth.password.label': "Parola d'ordine",
  'auth.password.show': 'Mostra password',
  'auth.password.hide': 'Nascondi la password',
  'auth.password.strength.weak': 'Troppo facile da indovinare',
  'auth.password.strength.fair': 'Potrebbe essere più forte',
  'auth.password.strength.strong': 'Forte',
  'auth.password.breached':
    'Questa password è apparsa in una violazione pubblica. Scegline uno diverso.',
  'auth.password.requirements': 'Almeno 12 caratteri. La lunghezza conta più dei simboli.',
  'auth.username.label': 'Nome utente',
  'auth.username.help':
    'Un nome utente ti consente di accedere al tuo account di posta elettronica esistente. Non sostituisce mai la tua password.',
  'auth.magicLink.send': 'Inviami tramite e-mail un collegamento di accesso',
  'auth.magicLink.sent':
    "Se quell'indirizzo ha un account, sarà in arrivo un collegamento di accesso. Il collegamento funziona una volta e scade tra {minutes, plural, one {# minuto} many {# minuti} other {# minuti}}.",
  'auth.magicLink.checkEmail': 'Controlla la tua email',
  'auth.magicLink.resend': 'Invia un altro collegamento',
  'auth.magicLink.resendIn':
    'Puoi inviare un altro collegamento in {seconds, plural, one {# secondo} many {# secondi} other {# secondi}}.',
  'auth.forgotPassword': 'Hai dimenticato la password?',
  'auth.resetPassword.title': 'Scegli una nuova password',
  'auth.resetPassword.sent':
    "Se quell'indirizzo ha un account, sono in arrivo le istruzioni per la reimpostazione.",
  'auth.resetPassword.done': 'La tua password è aggiornata. Accedi con esso.',
  'auth.noAccount': 'Non hai ancora un account?',
  'auth.haveAccount': 'Hai già un account?',
  'auth.terms.accept':
    "Continuando accetti i Termini e l'Informativa sulla Privacy, versione {version}.",
  'auth.terms.updated':
    'I Termini sono cambiati il {date}. Leggi il riepilogo di ciò che è cambiato, quindi accetta per continuare.',

  'auth.mfa.title': 'Autenticazione a due fattori',
  'auth.mfa.enterCode': 'Inserisci il codice a sei cifre dalla tua app di autenticazione',
  'auth.mfa.recoveryCode': 'Utilizza un codice di ripristino',
  'auth.mfa.setupTitle': "Configura l'autenticazione a due fattori",
  'auth.mfa.setupScan': 'Scansiona questo codice con la tua app di autenticazione.',
  'auth.mfa.setupManual': 'Oppure inserisci questa chiave manualmente',
  'auth.mfa.recoveryCodes': 'Codici di ripristino',
  'auth.mfa.recoveryCodesHelp':
    'Conservali in un posto sicuro. Ognuno funziona una volta se perdi il dispositivo.',
  'auth.mfa.requiredForAction': "Conferma con l'autenticazione a due fattori per continuare.",

  'auth.passkey.title': 'Chiavi di accesso',
  'auth.passkey.add': 'Aggiungi una chiave di accesso',
  'auth.passkey.signIn': 'Accedi con una passkey',
  'auth.passkey.added': 'Password aggiunta {date}',

  'auth.session.expired': 'La tua sessione è scaduta. Accedi nuovamente per continuare.',
  'auth.session.signedOut': 'Sei disconnesso.',
  'auth.session.otherDevice': "Hai effettuato l'accesso su un altro dispositivo.",

  'auth.invite.title': '{inviter} ti ha invitato a {workspace}',
  'auth.invite.accept': "Accetta l'invito",
  'auth.invite.declined': 'Invito rifiutato.',
  'auth.invite.expired': 'Questo invito è scaduto. Chiedi a {inviter} di inviarne un altro.',
  'auth.invite.roleNote': 'Ti unirai come {role}.',

  'auth.verifyEmail.title': 'Conferma la tua email',
  'auth.verifyEmail.body': 'Abbiamo inviato un link di conferma a {email}.',
  'auth.verifyEmail.done': 'La tua email è confermata.',

  'auth.rateLimited':
    'Troppi tentativi. Riprova tra {minutes, plural, one {# minuto} many {# minuti} other {# minuti}}.',
  'auth.genericFailure': 'Non ha funzionato. Controlla i dettagli e riprova.',
} as const;
