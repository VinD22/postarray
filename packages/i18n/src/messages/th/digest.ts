/**
 * The weekly digest email. Only the `email.digest.*` keys are translated here
 * (the `digest.*` in-app keys are outside this locale's current coverage and
 * fall back to English).
 */
export const digestMessages = {
  'email.digest.subject': 'สัปดาห์ของคุณใน {workspaceName}',
  'email.digest.intro':
    'นี่คือสิ่งที่เราเห็นสำหรับ {workspaceName} ระหว่าง {windowStart} ถึง {windowEnd}',
  'email.digest.noData':
    'เราไม่สามารถวัดผลอะไรได้ในสัปดาห์นี้ เมื่อตัวเลขใดหายไป นั่นเป็นเพราะเราอ่านมันไม่ได้ ไม่ใช่เพราะมันเป็นศูนย์',
  'email.digest.footer':
    'คุณได้รับอีเมลนี้เพราะสรุปรายสัปดาห์เปิดใช้งานอยู่สำหรับ {workspaceName} ปิดการใช้งานได้ในการตั้งค่าพื้นที่ทำงาน',
} as const;
