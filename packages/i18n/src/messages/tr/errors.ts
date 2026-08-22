/**
 * One entry per `RelayError` code.
 *
 * Every code has `error.<code>.message`, the sentence a person reads, and
 * `error.<code>.action`, what they can do next. Messages name the account or
 * the action. They never leak a provider payload, a token or an internal ID.
 */
export const errorMessages = {
  'error.unknown.message': 'Bir şeyler ters gitti ve bunu sınıflandıramadık.',
  'error.unknown.action':
    'Tekrar deneyin. Bu durum devam ederse bize aşağıdaki referansı gönderin.',
  'error.internal.message': 'Bu sizin içeriğinizle ilgili değil, bizden kaynaklanan bir sorundur.',
  'error.internal.action': 'Çalışmanız kaydedildi. Uyarıldık. Birkaç dakika sonra tekrar deneyin.',
  'error.not_implemented.message': 'Relay bunu henüz oluşturmadı.',
  'error.not_implemented.action': 'Gönderildiği zaman için değişiklik günlüğünü takip edin.',
  'error.offline.message': 'Çevrimdışısınız.',
  'error.offline.action':
    'Taslağınız bu cihazda saklanıyor. Bağlantı geri geldiğinde yayınlama ve planlama devam eder.',
  'error.network_unreachable.message': 'Sunucuya ulaşamadık.',
  'error.network_unreachable.action':
    'Bağlantınızı kontrol edip tekrar deneyin. Hiçbir şey kaybolmadı.',
  'error.request_invalid.message': 'Talep kabul edebileceğimiz bir durumda değildi.',
  'error.request_invalid.action': 'Aşağıda listelenen alanları kontrol edip tekrar gönderin.',
  'error.validation_failed.message':
    'Bunun kaydedilebilmesi için bazı alanların değiştirilmesi gerekir.',
  'error.validation_failed.action': 'Vurgulanan alanları düzeltin.',
  'error.unauthenticated.message': 'Bunu yapmak için oturum açmanız gerekir.',
  'error.unauthenticated.action': 'Oturum açın ve sizi buraya geri getireceğiz.',
  'error.session_expired.message': 'Oturumunuzun süresi doldu.',
  'error.session_expired.action': 'Tekrar oturum açın. Taslağınız kaydedildi.',
  'error.mfa_required.message': 'Bu eylemin iki faktörlü onaya ihtiyacı var.',
  'error.mfa_required.action': 'Devam etmek için kimlik doğrulayıcı uygulamanızla onaylayın.',
  'error.forbidden.message': 'Rolünüz bu eyleme izin vermiyor.',
  'error.forbidden.action': 'Bu çalışma alanının sahibinden veya yöneticisinden erişim isteyin.',
  'error.insufficient_scope.message': 'Bu kimlik bilgisinin kapsamı {scope} değildir.',
  'error.insufficient_scope.action':
    'Bu kapsamı verin veya zaten bu kapsama sahip olan bir kimlik bilgisini kullanın.',
  'error.workspace_not_found.message': 'Bu çalışma alanı mevcut değil veya üye değilsiniz.',
  'error.workspace_not_found.action': 'Ait olduğunuz bir çalışma alanını seçin.',
  'error.workspace_suspended.message': 'Bu çalışma alanı askıya alındı.',
  'error.workspace_suspended.action': 'Sorunu çözmek için desteğe başvurun. Verileriniz sağlam.',
  'error.not_found.message': 'O öğe artık mevcut değil.',
  'error.not_found.action': 'Silinmiş olabilir. Geri dönüp listeyi yenileyin.',
  'error.conflict.message': 'Sen üzerinde çalışırken başka biri bunu değiştirdi.',
  'error.conflict.action': 'Her iki sürümü de inceleyin ve ardından tekrar kaydedin.',
  'error.idempotency_key_reused.message':
    'Bu idempotency anahtarı zaten farklı bir istek için kullanılmış.',
  'error.idempotency_key_reused.action':
    'Yeni bir anahtar kullanın veya orijinal isteğin aynısını tekrarlayın.',
  'error.rate_limited.message': 'Çok fazla istek var.',
  'error.rate_limited.action': '{time} sonra tekrar deneyin.',
  'error.quota_exceeded.message': 'Bu işlem cari döneme ait sınırın üzerindedir.',
  'error.quota_exceeded.action': 'Limit {relativeTime} sıfırlanır.',
  'error.payment_required.message': 'Bu çalışma alanının etkin bir aboneliği yok.',
  'error.payment_required.action':
    'Tekrar yayınlamak için aboneliği başlatın. Hiçbir şey silinmez.',
  'error.subscription_past_due.message': 'Son ödeme gerçekleşmedi.',
  'error.subscription_past_due.action': 'Ödeme yöntemini Polar portalında güncelleyin.',
  'error.trial_expired.message': "Duruşma {date}'da sona erdi.",
  'error.trial_expired.action': 'Yayınlamaya devam etmek için aboneliği başlatın.',
  'error.entitlement_missing.message': 'Bu çalışma alanının bu özelliğe erişimi yok.',
  'error.entitlement_missing.action':
    'Faturalandırma ayarlarını kontrol edin veya destek ekibiyle iletişime geçin.',
  'error.channel_limit_reached.message':
    'Bu çalışma alanı zaten tüm {limit} aktif kanalları kullanıyor.',
  'error.channel_limit_reached.action':
    'Başka bir kanalı bağlamadan önce bir kanalın bağlantısını kesin.',
  'error.project_limit_reached.message':
    'Bu çalışma alanı zaten tüm {limit} aktif projeyi kullanıyor.',
  'error.project_limit_reached.action':
    'Etkin olmayan bir projeyi arşivleyin veya çalışma alanının proje kotasını değiştirin.',
  'error.project_has_connections.message':
    'Bu projede hâlâ {connected, plural, one {# bağlı kanal} other {# bağlı kanal}} var.',
  'error.project_has_connections.action':
    'Arşivlemeden önce bu projedeki her kanalın bağlantısını kesin.',
  'error.project_last_active.message': 'Bir çalışma alanı en az bir etkin proje bulundurmalıdır.',
  'error.project_last_active.action': 'Bunu arşivlemeden önce başka bir proje oluşturun.',
  'error.connection_not_found.message': 'Bu bağlantı artık bu çalışma alanında değil.',
  'error.connection_not_found.action': 'Yayınlamaya devam etmek için hesabı tekrar bağlayın.',
  'error.connection_revoked.message': '{account} {provider} tarihinde erişimi iptal etti.',
  'error.connection_revoked.action':
    'Hesabı yeniden bağlayın. Planlanan gönderiler bundan sonra devam eder.',
  'error.connection_expired.message': '{account} erişiminin süresi doldu.',
  'error.connection_expired.action':
    'Yayınlamayı ve analizleri geri yüklemek için hesabı yeniden bağlayın.',
  'error.connection_paused.message': '{account} duraklatılır.',
  'error.connection_paused.action': "Hazır olduğunuzda Connections'dan devam edin.",
  'error.connection_permission_missing.message': '{account} bunun için gereken izni vermedi.',
  'error.connection_permission_missing.action':
    'Yeniden bağlanın ve izin ekranında {permission} seçeneğini kabul edin.',
  'error.connection_account_type_invalid.message':
    "Instagram'ın profesyonel bir hesaba ihtiyacı var. {account} kişisel bir hesaptır.",
  'error.connection_account_type_invalid.action':
    'Instagram uygulamasında bunu bir işletme veya yaratıcı hesabına geçirin ve ardından yeniden bağlanın.',
  'error.connection_review_pending.message':
    '{provider} {account} için bu uygulamayı incelemeye devam ediyor.',
  'error.connection_review_pending.action':
    'İnceleme başarılı olana kadar gönderiler gizli olarak yayınlanır. Değişiklik olduğunda bu sayfayı güncelleriz.',
  'error.capability_unsupported.message':
    "{provider} bunu resmi API'si aracılığıyla sunmamaktadır.",
  'error.capability_unsupported.action': 'Bu hesabın desteklediği bir biçimi kullanın.',
  'error.capability_not_implemented.message': 'Röle bunu henüz {provider} için oluşturmadı.',
  'error.capability_not_implemented.action':
    'Yetenek sayfası, her konektörün bugün neler yapabileceğini listeler.',
  'error.capability_requires_review.message':
    '{provider} bunu yalnızca uygulamayı veya hesabı inceledikten sonra verir.',
  'error.capability_requires_review.action':
    'Bu inceleme geçilene kadar kullanılamaz durumda kalır.',
  'error.content_invalid.message': '{provider} bu içeriği {account} için kabul etmeyecektir.',
  'error.content_invalid.action': 'Sorunlar hedefte listelenir. Bunları düzeltip tekrar deneyin.',
  'error.content_changed_after_approval.message': 'Bu yazı onaylandıktan sonra değişti.',
  'error.content_changed_after_approval.action': 'Yayınlanmadan önce tekrar onay isteyin.',
  'error.duplicate_content.message': "{account} {relativeTime}'de de çok benzer içerik yayınlandı.",
  'error.duplicate_content.action':
    'Metni değiştirin veya daha sonra yayınlayın. Platformlar yinelenen gönderileri kısıtlar.',
  'error.cadence_limit_reached.message':
    '{account} bu çalışma alanı için belirlenen kayıt ritmine ulaştı.',
  'error.cadence_limit_reached.action':
    'Bunu daha sonraki bir zaman dilimine planlayın veya kadans sınırını artırın.',
  'error.media_invalid.message': "Bu dosya {provider}'da yayınlanamaz.",
  'error.media_invalid.action': 'Kesin sınır dosyanın yanında gösterilir.',
  'error.media_too_large.message': "Bu dosya {provider}'ın kabul ettiğinden daha büyük.",
  'error.media_too_large.action':
    'Sıkıştırın veya daha küçük bir sürümünü yükleyin. Orijinali saklanır.',
  'error.media_processing_failed.message': 'Bu dosyayı {provider} için hazırlayamadık.',
  'error.media_processing_failed.action':
    'Tekrar yüklemeyi deneyin veya farklı bir format kullanın.',
  'error.media_rights_undeclared.message': 'Bu medyanın herhangi bir hak beyanı yoktur.',
  'error.media_rights_undeclared.action':
    'İçeriğindeki kişiler de dahil olmak üzere, içeriği yayınlama haklarına sahip olduğunuzu doğrulayın.',
  'error.alt_text_required.message': 'Bu görselin {provider} için alternatif metni gerekiyor.',
  'error.alt_text_required.action': 'Resmi tanımlayın veya dekoratif olarak işaretleyin.',
  'error.approval_required.message': 'Bu çalışma alanı yayınlanmadan önce onay gerektirir.',
  'error.approval_required.action': "{approver}'dan onay isteyin.",
  'error.approval_expired.message': 'Bu gönderinin onayının süresi {date} tarihinde doldu.',
  'error.approval_expired.action': 'Tekrar onay isteyin.',
  'error.schedule_in_past.message': "Bu süre {timeZone}'da çoktan geçti.",
  'error.schedule_in_past.action': 'Daha sonraki bir zamanı seçin veya şimdi yayınlayın.',
  'error.schedule_conflict.message':
    '{account} bu sürenin {duration} içinde zaten bir gönderiye sahip.',
  'error.schedule_conflict.action':
    'Bunlardan birini hareket ettirin veya bu boşluk isteniyorsa devam edin.',
  'error.time_zone_invalid.message': '{timeZone} saat dilimini tanımıyoruz.',
  'error.time_zone_invalid.action': 'Listeden bir bölge seçin.',
  'error.destination_unavailable.message': "Hedef {destination} artık {provider}'de mevcut değil.",
  'error.destination_unavailable.action': 'Hedef listesini yenileyin ve başka bir tane seçin.',
  'error.mention_unresolved.message':
    'Bir bahis gerçek bir {provider} hesabıyla eşleştirilmemiştir.',
  'error.mention_unresolved.action':
    'Hesabı arayın ve seçin veya bahsi kaldırın. Asla sahte bir yerel etiket yayınlamayız.',
  'error.provider_transient.message': '{provider} bunu şu anda işleyemiyor.',
  'error.provider_transient.action': 'Otomatik olarak yeniden deneyeceğiz. Hiçbir şey kopyalanmaz.',
  'error.provider_permanent.message':
    '{provider} bunu reddetti ve yeniden denemeyi kabul etmeyecek.',
  'error.provider_permanent.action': 'Sterilize edilmiş yanıt makbuzun üzerindedir.',
  'error.provider_rate_limited.message': '{provider} oranı bu çalışma alanını sınırladı.',
  'error.provider_rate_limited.action': '{time} sonra tekrar deneyeceğiz.',
  'error.provider_unavailable.message': '{provider} yanıt vermiyor.',
  'error.provider_unavailable.action':
    'Durum sayfasını kontrol edin. Planlanmış gönderiler yeniden denenmeye devam ediyor.',
  'error.provider_content_rejected.message':
    '{provider} bu içeriği kendi politikaları uyarınca reddetti.',
  'error.provider_content_rejected.action':
    'Gerekçesi makbuzun üzerinde yazıyor. İçeriği düzenleyin veya {provider} ile itirazda bulunun.',
  'error.user_action_required.message':
    '{account} yayınlanmadan önce sizden bir şeye ihtiyacı var.',
  'error.user_action_required.action': 'Neyin eksik olduğunu görmek için bağlantıyı açın.',
  'error.short_link_destination_blocked.message': 'O hedef kısaltılamaz.',
  'error.short_link_destination_blocked.action':
    'Özel ağlar, güvenli olmayan planlar ve kötüye kullanıldığı bilinen hedefler engellenir.',
  'error.short_link_domain_unverified.message': '{domain} alan adı henüz doğrulanmadı.',
  'error.short_link_domain_unverified.action':
    'Ayarlarda gösterilen DNS kaydını ekleyin ve doğrulayın.',
  'error.rss_feed_invalid.message': 'Bu URL geçerli bir RSS veya Atom yayını döndürmedi.',
  'error.rss_feed_invalid.action':
    'Adresi kontrol edin. Onu güvenli bir şekilde alıyoruz ve hiçbir özel yönlendirmeyi takip etmiyoruz.',
  'error.webhook_signature_invalid.message': 'Bu web kancasındaki imza doğrulanmadı.',
  'error.webhook_signature_invalid.action':
    'Gönderenin geçerli imzalama sırrını kullanıp kullanmadığını kontrol edin. Yük işlenmedi.',
  'error.webhook_delivery_failed.message': '{endpoint} adresine teslimat başarısız oldu.',
  'error.webhook_delivery_failed.action':
    'Geri çekilmeyle yeniden deneriz. Teslimat günlüğünde yanıt var.',
  'error.automation_rule_not_permitted.message':
    'Bu kural bir platform kuralını ihlal edeceğinden oluşturulamaz.',
  'error.automation_rule_not_permitted.action':
    'Otomatik beğeniler, takipler, istenmeyen yanıtlar ve yinelenen toplu gönderiler hiçbir zaman mümkün değildir.',
  'error.ai_unavailable.message': 'Yazma asistanı şu anda kullanılamıyor.',
  'error.ai_unavailable.action': 'Metninize dokunulmaz. Kısa süre sonra tekrar deneyin.',
  'error.ai_output_invalid.message': 'Asistan, doğrulayamadığımız bir şeyi geri verdi.',
  'error.ai_output_invalid.action': 'Taslağına hiçbir şey uygulanmadı. Tekrar deneyin.',
  'error.ai_budget_exceeded.message': 'Bu çalışma alanı şimdilik asistan sınırına ulaştı.',
  'error.ai_budget_exceeded.action':
    'Limit {relativeTime} sıfırlanır. Elle yazmak hala işe yarıyor.',
  'error.storage_unavailable.message': 'Medya depolama alanına ulaşamadık.',
  'error.storage_unavailable.action':
    'Metniniz kaydedildi. Bir süre sonra yüklemeyi tekrar deneyin.',
  'error.export_unavailable.message': 'O ihracat yapılamadı.',
  'error.export_unavailable.action':
    'Daha küçük bir aralık deneyin veya referansla birlikte destek ekibiyle iletişime geçin.',

  'error.reference': 'Referans {correlationId}',
  'error.reportToSupport': 'Bunu desteğe gönder',
  'error.contentPreserved': 'İçeriğiniz korunur. Hiçbir şey yayınlanmadı.',
} as const;
