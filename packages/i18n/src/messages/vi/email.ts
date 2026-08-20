/** vi beta catalog namespace. */
export const emailMessages = {
  'email.invitation.subject': 'Bạn đã được mời vào {workspaceName}',
  'email.invitation.body':
    'Bạn đã được mời vào {workspaceName} với vai trò {role}. Chấp nhận lời mời tại đây: {invitationUrl}. Liên kết này hết hạn vào {expiresAt}.',
  'email.oauth_redirect_changed.subject': 'Cài đặt đăng nhập cho {appName} đã thay đổi',
  'email.oauth_redirect_changed.body':
    'Các địa chỉ chuyển hướng được chấp thuận cho {appName} đã thay đổi. Hãy xem lại ứng dụng trong cài đặt không gian làm việc của bạn nếu bạn không ngờ tới điều này.',
} as const;
