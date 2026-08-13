export const emailMessages = {
  'email.invitation.subject': 'आपको {workspaceName} में आमंत्रित किया गया है',
  'email.invitation.body':
    'आपको {role} भूमिका के साथ {workspaceName} में आमंत्रित किया गया है। यहां आमंत्रण स्वीकार करें: {invitationUrl}। यह लिंक {expiresAt} पर समाप्त हो जाता है।',
  'email.oauth_redirect_changed.subject': '{appName} के लिए साइन-इन सेटिंग्स बदल गई हैं',
  'email.oauth_redirect_changed.body':
    '{appName} के लिए स्वीकृत रीडायरेक्ट पते बदल गए हैं। यदि आपको इसकी उम्मीद नहीं थी, तो अपनी वर्कस्पेस सेटिंग्स में एप्लिकेशन की समीक्षा करें।',
} as const;
