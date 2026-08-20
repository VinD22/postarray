export const emailMessages = {
  'email.invitation.subject': '{workspaceName}에 초대되었습니다',
  'email.invitation.body':
    '{workspaceName}에 {role} 역할로 초대되었습니다. 여기에서 초대를 수락하세요: {invitationUrl}. 이 링크는 {expiresAt}에 만료됩니다.',
  'email.oauth_redirect_changed.subject': '{appName}의 로그인 설정이 변경되었습니다',
  'email.oauth_redirect_changed.body':
    '{appName}의 승인된 리디렉션 주소가 변경되었습니다. 예상하지 못했다면 작업공간 설정에서 애플리케이션을 확인하세요.',
} as const;
