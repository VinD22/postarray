export const emailMessages = {
  'email.invitation.subject': 'Anda diundang ke {workspaceName}',
  'email.invitation.body':
    'Anda diundang ke {workspaceName} dengan peran {role}. Terima undangan di sini: {invitationUrl}. Tautan ini kedaluwarsa pada {expiresAt}.',
  'email.oauth_redirect_changed.subject': 'Pengaturan masuk untuk {appName} berubah',
  'email.oauth_redirect_changed.body':
    'Alamat pengalihan yang disetujui untuk {appName} telah berubah. Tinjau aplikasi ini di pengaturan ruang kerja Anda jika Anda tidak menyangka hal ini.',
} as const;
