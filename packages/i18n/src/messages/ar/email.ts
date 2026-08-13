export const emailMessages = {
  'email.invitation.subject': 'تمت دعوتك إلى {workspaceName}',
  'email.invitation.body':
    'تمت دعوتك إلى {workspaceName} بدور {role}. اقبل الدعوة هنا: {invitationUrl}. تنتهي صلاحية هذا الرابط في {expiresAt}.',
  'email.oauth_redirect_changed.subject': 'تغيّرت إعدادات تسجيل الدخول لـ {appName}',
  'email.oauth_redirect_changed.body':
    'تغيّرت عناوين إعادة التوجيه المعتمدة لـ {appName}. راجع التطبيق في إعدادات مساحة العمل إذا لم تكن تتوقع هذا.',
} as const;
