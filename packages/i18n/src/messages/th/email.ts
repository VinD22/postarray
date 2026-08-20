/** th beta catalog namespace. */
export const emailMessages = {
  'email.invitation.subject': 'คุณได้รับเชิญให้เข้าร่วม {workspaceName}',
  'email.invitation.body':
    'คุณได้รับเชิญให้เข้าร่วม {workspaceName} ด้วยบทบาท {role} ยอมรับคำเชิญได้ที่นี่: {invitationUrl} ลิงก์นี้จะหมดอายุเมื่อ {expiresAt}',
  'email.oauth_redirect_changed.subject': 'การตั้งค่าการเข้าสู่ระบบสำหรับ {appName} มีการเปลี่ยนแปลง',
  'email.oauth_redirect_changed.body':
    'ที่อยู่เปลี่ยนเส้นทางที่ได้รับอนุมัติสำหรับ {appName} มีการเปลี่ยนแปลง หากคุณไม่ได้คาดคิดสิ่งนี้ ให้ตรวจสอบแอปพลิเคชันในการตั้งค่าพื้นที่ทำงานของคุณ',
} as const;
