/** Weekly digest copy for the Turkish interface. */
export const digestMessages = {
  'digest.title': 'Bu hafta',
  'digest.subtitle': '{windowStart} ile {windowEnd} arasında görebildiklerimiz.',
  'digest.empty':
    'Bu hafta için henüz özetlenecek bir şey yok. Bir şey yayınlayın, burada görünsün.',
  'digest.regenerate': 'Bu haftayı yeniden oluştur',
  'digest.generating': 'Bu haftanın özeti oluşturuluyor',
  'digest.source.deterministic':
    'Yazma asistanı olmadan, yayın kayıtlarınızdan ve kendi ölçümlerinizden yazıldı.',
  'digest.source.ai':
    'Asistan tarafından kendi kayıtlarınızdan yazıldı. İçindeki her sayı kayıtlarla karşılaştırıldı.',
  'digest.unavailable.aiOff':
    'Yazma asistanı kapalı, bu nedenle bu sade sürümdür. Eksik olan bir şey yok.',
  'digest.unavailable.rejected':
    'Asistan sürümü verilerinizle eşleşmedi ve atıldı. Bu sade sürümdür.',
  'digest.headline.published':
    '{published, plural, =0 {Hiçbir gönderi tamamlanmadı} one {# gönderi tamamlandı} other {# gönderi tamamlandı}} {windowStart} ile {windowEnd} arasında.',
  'digest.headline.nothingPublished':
    '{windowStart} ile {windowEnd} arasında hiçbir şey yayınlanmadı.',
  'digest.outcome.published':
    '{count, plural, one {# gönderi {provider} üzerinde tamamlandı} other {# gönderi {provider} üzerinde tamamlandı}}.',
  'digest.outcome.partial':
    '{count, plural, one {# gönderi {provider} üzerindeki hedeflerinin bazılarına ulaştı, diğerlerine ulaşmadı} other {# gönderi {provider} üzerindeki hedeflerinin bazılarına ulaştı, diğerlerine ulaşmadı}}.',
  'digest.outcome.failed':
    '{count, plural, one {# gönderi {provider} üzerinde yayınlanmadı} other {# gönderi {provider} üzerinde yayınlanmadı}}.',
  'digest.metrics.noneYet':
    'Bu hafta henüz hiçbir ölçüm gelmedi. Bu, bu gönderilerin nasıl performans gösterdiğini bilmediğimiz anlamına gelir, kötü performans gösterdikleri anlamına gelmez.',
  'digest.freshness.statement':
    '{label, select, fresh {Ölçümler en son {lastObservedAt} tarihinde senkronize edildi.} stale {Ölçümler {lastObservedAt} tarihinden beri senkronize edilmedi, bu nedenle yukarıdaki sayılar güncel olmayabilir.} other {Henüz hiçbir şey senkronize edilmedi, bu nedenle yukarıdakilerin hiçbiri ölçülmedi.}}',
  'digest.narrative.headline': '{statement}',
  'digest.narrative.observation': '{statement}',
  'digest.narrative.confounder': 'Bilmekte fayda var: {confounder}',
  'digest.narrative.notSupported': '{statement}',
  'digest.narrative.nextAction': '{statement}',
  'digest.settings.title': 'Haftalık özet e-postası',
  'digest.settings.description':
    'Her hafta nelerin yayınlandığını ve neleri ölçebildiğimizi anlatan kısa bir e-posta. Varsayılan olarak açık.',
  'digest.settings.enabled': 'Haftalık özeti gönder',
  'email.digest.subject': '{workspaceName} çalışma alanında haftanız',
  'email.digest.intro':
    '{workspaceName} için {windowStart} ile {windowEnd} arasında görebildiklerimiz burada.',
  'email.digest.noData':
    'Bu hafta hiçbir şeyi ölçemedik. Bir sayı eksikse, sıfır olduğu için değil, onu okuyamadığımız için eksiktir.',
  'email.digest.footer':
    'Bunu {workspaceName} için haftalık özet açık olduğu için alıyorsunuz. Çalışma alanı ayarlarından kapatabilirsiniz.',
} as const;
