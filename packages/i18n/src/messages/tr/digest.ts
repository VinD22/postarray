/**
 * The weekly digest email. Only the `email.digest.*` keys are translated here
 * (the `digest.*` in-app keys are outside this locale's current coverage and
 * fall back to English).
 */
export const digestMessages = {
  'email.digest.subject': '{workspaceName} çalışma alanında bu hafta',
  'email.digest.intro':
    '{workspaceName} için {windowStart} ile {windowEnd} arasında görebildiklerimiz burada.',
  'email.digest.noData':
    'Bu hafta hiçbir şey ölçemedik. Bir sayı eksikse, sıfır olduğu için değil, onu okuyamadığımız için eksiktir.',
  'email.digest.footer':
    'Bunu alıyorsunuz çünkü {workspaceName} için haftalık özet açık. Çalışma alanı ayarlarından kapatabilirsiniz.',
} as const;
