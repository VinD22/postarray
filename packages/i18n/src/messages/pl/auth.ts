/** Sign in, sign up, alias login, password reset and session handling. */
export const authMessages = {
  'auth.signIn.title': 'Zaloguj się',
  'auth.signIn.subtitle': 'Opublikuj, zatwierdź i zobacz dokładnie, co się stało.',
  'auth.signUp.title': 'Utwórz swoje konto',
  'auth.signUp.subtitle': 'Siedem dni z każdą funkcją. Termin płatności: 0 USD na dzisiaj.',
  'auth.continueWithGoogle': 'Kontynuuj korzystanie z Google',
  'auth.continueWithFacebook': 'Kontynuuj na Facebooku',
  'auth.orUseEmail': 'Lub użyj swojego adresu e-mail',
  'auth.email.label': 'E-mail',
  'auth.email.placeholder': 'ty@firma.com',
  'auth.password.label': 'Hasło',
  'auth.password.show': 'Pokaż hasło',
  'auth.password.hide': 'Ukryj hasło',
  'auth.password.strength.weak': 'Zbyt łatwo zgadnąć',
  'auth.password.strength.fair': 'Mogłoby być mocniej',
  'auth.password.strength.strong': 'Silny',
  'auth.password.breached': 'To hasło pojawiło się w wyniku publicznego naruszenia. Wybierz inny.',
  'auth.password.requirements': 'Co najmniej 12 znaków. Długość ma większe znaczenie niż symbole.',
  'auth.username.label': 'Nazwa użytkownika',
  'auth.username.help':
    'Nazwa użytkownika loguje Cię do istniejącego konta e-mail. Nigdy nie zastępuje Twojego hasła.',
  'auth.magicLink.send': 'Wyślij mi e-mailem link do logowania',
  'auth.magicLink.sent':
    'Jeśli pod tym adresem znajduje się konto, link do logowania jest już w drodze. Link działa raz i wygasa za {minutes, plural, one {# minuta} other {# minuty} few {# minuty} many {# minuty}}.',
  'auth.magicLink.checkEmail': 'Sprawdź swoją pocztę e-mail',
  'auth.magicLink.resend': 'Wyślij kolejny link',
  'auth.magicLink.resendIn':
    'Możesz wysłać kolejny link w {seconds, plural, one {# sekunda} other {# sekundy} few {# sekundy} many {# sekundy}}.',
  'auth.forgotPassword': 'Zapomniałeś hasła?',
  'auth.resetPassword.title': 'Wybierz nowe hasło',
  'auth.resetPassword.sent':
    'Jeśli pod tym adresem znajduje się konto, instrukcje resetowania są już w drodze.',
  'auth.resetPassword.done': 'Twoje hasło zostało zaktualizowane. Zaloguj się za jego pomocą.',
  'auth.noAccount': 'Nie masz jeszcze konta?',
  'auth.haveAccount': 'Masz już konto?',
  'auth.terms.accept': 'Kontynuując, akceptujesz Warunki i Politykę prywatności, wersja {version}.',
  'auth.terms.updated':
    'Warunki uległy zmianie w dniu {date}. Przeczytaj podsumowanie zmian, a następnie zaakceptuj, aby kontynuować.',

  'auth.mfa.title': 'Uwierzytelnianie dwuskładnikowe',
  'auth.mfa.enterCode': 'Wprowadź sześciocyfrowy kod z aplikacji uwierzytelniającej',
  'auth.mfa.recoveryCode': 'Użyj kodu odzyskiwania',
  'auth.mfa.setupTitle': 'Skonfiguruj uwierzytelnianie dwuskładnikowe',
  'auth.mfa.setupScan': 'Zeskanuj ten kod za pomocą aplikacji uwierzytelniającej.',
  'auth.mfa.setupManual': 'Lub wprowadź ten klucz ręcznie',
  'auth.mfa.recoveryCodes': 'Kody odzyskiwania',
  'auth.mfa.recoveryCodesHelp':
    'Przechowuj je w bezpiecznym miejscu. Każdy z nich działa raz, jeśli zgubisz urządzenie.',
  'auth.mfa.requiredForAction':
    'Potwierdź za pomocą uwierzytelniania dwuskładnikowego, aby kontynuować.',

  'auth.passkey.title': 'Klucze dostępu',
  'auth.passkey.add': 'Dodaj klucz dostępu',
  'auth.passkey.signIn': 'Zaloguj się za pomocą hasła',
  'auth.passkey.added': 'Dodano klucz dostępu {date}',

  'auth.session.expired': 'Twoja sesja wygasła. Zaloguj się ponownie, aby kontynuować.',
  'auth.session.signedOut': 'Jesteś wylogowany.',
  'auth.session.otherDevice': 'Zalogowałeś się na innym urządzeniu.',

  'auth.invite.title': '{inviter} zaprosił Cię do {workspace}',
  'auth.invite.accept': 'Zaakceptuj zaproszenie',
  'auth.invite.declined': 'Zaproszenie odrzucone.',
  'auth.invite.expired': 'To zaproszenie wygasło. Zapytaj {inviter}, aby wysłać kolejny.',
  'auth.invite.roleNote': 'Dołączysz jako {role}.',

  'auth.verifyEmail.title': 'Potwierdź swój adres e-mail',
  'auth.verifyEmail.body': 'Wysłaliśmy link potwierdzający do {email}.',
  'auth.verifyEmail.done': 'Twój adres e-mail został potwierdzony.',

  'auth.rateLimited':
    'Zbyt wiele prób. Spróbuj ponownie za {minutes, plural, one {# minuta} other {# minuty} few {# minuty} many {# minuty}}.',
  'auth.genericFailure': 'To nie zadziałało. Sprawdź szczegóły i spróbuj ponownie.',
} as const;
