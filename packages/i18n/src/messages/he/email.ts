import { withHebrewPluralForms } from './catalog-helpers';

export const emailMessages = withHebrewPluralForms({
  'email.invitation.subject': 'הוזמנת אל {workspaceName}',
  'email.invitation.body':
    'הוזמנת אל {workspaceName} בתפקיד {role}. אשר את ההזמנה כאן: {invitationUrl}. הקישור הזה יפוג ב-{expiresAt}.',
  'email.oauth_redirect_changed.subject': 'הגדרות ההתחברות עבור {appName} השתנו',
  'email.oauth_redirect_changed.body':
    'כתובות ההפניה המאושרות עבור {appName} השתנו. בדוק את האפליקציה בהגדרות סביבת העבודה שלך אם לא ציפית לזה.',
});
