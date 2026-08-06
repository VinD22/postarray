/** id beta catalog namespace. */
export const errorMessages = {
  'error.unknown.message': 'Ada yang tidak beres dan kami tidak dapat mengklasifikasikannya.',
  'error.unknown.action':
    'Coba lagi. Jika hal ini terus terjadi, kirimkan referensi di bawah ini kepada kami.',
  'error.internal.message': 'Ini adalah masalah di pihak kami, bukan pada konten Anda.',
  'error.internal.action':
    'Pekerjaan Anda disimpan. Kami telah diperingatkan. Coba lagi dalam beberapa menit.',
  'error.not_implemented.message': 'Relay belum membuat ini.',
  'error.not_implemented.action': 'Ikuti log perubahan saat dikirimkan.',
  'error.offline.message': 'Anda sedang luring.',
  'error.offline.action':
    'Draf Anda disimpan di perangkat ini. Penerbitan dan penjadwalan dilanjutkan ketika koneksi kembali.',
  'error.network_unreachable.message': 'Kami tidak dapat menjangkau server.',
  'error.network_unreachable.action': 'Periksa koneksi Anda dan coba lagi. Tidak ada yang hilang.',
  'error.request_invalid.message': 'Permintaan tersebut tidak dalam bentuk yang dapat kami terima.',
  'error.request_invalid.action': 'Periksa bidang yang tercantum di bawah dan kirimkan lagi.',
  'error.validation_failed.message': 'Beberapa bidang memerlukan perubahan sebelum dapat disimpan.',
  'error.validation_failed.action': 'Perbaiki bidang yang disorot.',
  'error.unauthenticated.message': 'Anda harus masuk untuk melakukan ini.',
  'error.unauthenticated.action': 'Masuk dan kami akan membawa Anda kembali ke sini.',
  'error.session_expired.message': 'Sesi Anda telah berakhir.',
  'error.session_expired.action': 'Masuk lagi. Draf Anda telah disimpan.',
  'error.mfa_required.message': 'Tindakan ini memerlukan konfirmasi dua faktor.',
  'error.mfa_required.action': 'Konfirmasikan dengan aplikasi autentikator Anda untuk melanjutkan.',
  'error.forbidden.message': 'Peran Anda tidak mengizinkan tindakan ini.',
  'error.forbidden.action': 'Mintalah akses kepada pemilik atau admin ruang kerja ini.',
  'error.insufficient_scope.message': 'Kredensial ini tidak memiliki cakupan {scope}.',
  'error.insufficient_scope.action':
    'Berikan cakupan tersebut atau gunakan kredensial yang sudah memilikinya.',
  'error.workspace_not_found.message': 'Ruang kerja tersebut tidak ada atau Anda bukan anggota.',
  'error.workspace_not_found.action': 'Pilih ruang kerja tempat Anda berada.',
  'error.workspace_suspended.message': 'Ruang kerja ini ditangguhkan.',
  'error.workspace_suspended.action': 'Hubungi dukungan untuk mengatasinya. Data Anda utuh.',
  'error.not_found.message': 'Barang itu sudah tidak ada lagi.',
  'error.not_found.action': 'Itu mungkin telah dihapus. Kembali dan segarkan daftarnya.',
  'error.conflict.message': 'Orang lain mengubahnya saat Anda sedang mengerjakannya.',
  'error.conflict.action': 'Tinjau kedua versi, lalu simpan lagi.',
  'error.idempotency_key_reused.message':
    'Kunci idempotensi ini telah digunakan untuk permintaan yang berbeda.',
  'error.idempotency_key_reused.action':
    'Gunakan kunci baru, atau ulangi permintaan awal yang sama persis.',
  'error.rate_limited.message': 'Terlalu banyak permintaan.',
  'error.rate_limited.action': 'Coba lagi setelah {time}.',
  'error.quota_exceeded.message': 'Tindakan ini melebihi batas untuk periode saat ini.',
  'error.quota_exceeded.action': 'Batasnya disetel ulang {relativeTime}.',
  'error.payment_required.message': 'Ruang kerja ini tidak memiliki langganan aktif.',
  'error.payment_required.action':
    'Mulai berlangganan untuk menerbitkan lagi. Tidak ada yang dihapus.',
  'error.subscription_past_due.message': 'Pembayaran terakhir tidak berhasil.',
  'error.subscription_past_due.action': 'Perbarui metode pembayaran di portal Polar.',
  'error.trial_expired.message': 'Uji coba berakhir pada {date}.',
  'error.trial_expired.action': 'Mulai berlangganan untuk melanjutkan penerbitan.',
  'error.entitlement_missing.message': 'Ruang kerja ini tidak memiliki akses ke fitur tersebut.',
  'error.entitlement_missing.action': 'Periksa pengaturan penagihan, atau hubungi dukungan.',
  'error.channel_limit_reached.message':
    'Ruang kerja ini sudah menggunakan semua saluran aktif {limit}.',
  'error.channel_limit_reached.action':
    'Putuskan sambungan saluran sebelum menyambungkan saluran lain.',
  'error.connection_not_found.message': 'Koneksi tersebut tidak lagi ada di ruang kerja ini.',
  'error.connection_not_found.action':
    'Hubungkan kembali akun tersebut untuk terus memublikasikannya.',
  'error.connection_revoked.message': '{account} mencabut akses pada {provider}.',
  'error.connection_revoked.action':
    'Hubungkan kembali akun tersebut. Postingan terjadwal dilanjutkan setelah itu.',
  'error.connection_expired.message': 'Akses untuk {account} telah habis masa berlakunya.',
  'error.connection_expired.action':
    'Hubungkan kembali akun untuk memulihkan penerbitan dan analitik.',
  'error.connection_paused.message': '{account} dijeda.',
  'error.connection_paused.action': 'Lanjutkan dari Connections ketika Anda siap.',
  'error.connection_permission_missing.message':
    '{account} belum memberikan izin yang diperlukan untuk melakukan ini.',
  'error.connection_permission_missing.action':
    'Hubungkan kembali dan terima {permission} di layar persetujuan.',
  'error.connection_account_type_invalid.message':
    'Instagram membutuhkan akun profesional. {account} adalah akun pribadi.',
  'error.connection_account_type_invalid.action':
    'Alihkan ke akun bisnis atau kreator di aplikasi Instagram, lalu sambungkan kembali.',
  'error.connection_review_pending.message':
    '{provider} masih meninjau aplikasi ini untuk {account}.',
  'error.connection_review_pending.action':
    'Postingan dipublikasikan secara pribadi hingga peninjauan lolos. Kami memperbarui halaman ini jika ada perubahan.',
  'error.capability_unsupported.message': '{provider} tidak menawarkan ini melalui API resminya.',
  'error.capability_unsupported.action': 'Gunakan format yang didukung akun ini.',
  'error.capability_not_implemented.message': 'Relay belum membuat ini untuk {provider}.',
  'error.capability_not_implemented.action':
    'Halaman kemampuan mencantumkan apa yang dapat dilakukan setiap konektor saat ini.',
  'error.capability_requires_review.message':
    '{provider} memberikan ini hanya setelah meninjau aplikasi atau akun.',
  'error.capability_requires_review.action':
    'Itu tetap tidak tersedia sampai peninjauan itu berlalu.',
  'error.content_invalid.message': '{provider} tidak akan menerima konten ini untuk {account}.',
  'error.content_invalid.action':
    'Masalah-masalah tersebut tercantum pada target. Perbaiki dan coba lagi.',
  'error.content_changed_after_approval.message': 'Postingan ini berubah setelah disetujui.',
  'error.content_changed_after_approval.action':
    'Minta persetujuan lagi sebelum dapat dipublikasikan.',
  'error.duplicate_content.message':
    'Konten yang sangat mirip dipublikasikan ke {account} {relativeTime}.',
  'error.duplicate_content.action':
    'Ubah teksnya, atau publikasikan nanti. Platform membatasi postingan duplikat.',
  'error.cadence_limit_reached.message':
    '{account} telah mencapai irama postingan yang ditetapkan untuk ruang kerja ini.',
  'error.cadence_limit_reached.action':
    'Jadwalkan ini untuk slot berikutnya, atau naikkan batas irama.',
  'error.media_invalid.message': 'File ini tidak dapat dipublikasikan ke {provider}.',
  'error.media_invalid.action': 'Batas pastinya ditampilkan di sebelah file.',
  'error.media_too_large.message': 'File ini lebih besar dari yang diterima {provider}.',
  'error.media_too_large.action': 'Kompres atau unggah versi yang lebih kecil. Yang asli disimpan.',
  'error.media_processing_failed.message': 'Kami tidak dapat menyiapkan file ini untuk {provider}.',
  'error.media_processing_failed.action': 'Coba unggah lagi, atau gunakan format lain.',
  'error.media_rights_undeclared.message': 'Media ini tidak memiliki deklarasi hak.',
  'error.media_rights_undeclared.action':
    'Konfirmasikan bahwa Anda mempunyai hak untuk memublikasikannya, termasuk siapa pun yang ada di dalamnya.',
  'error.alt_text_required.message': 'Gambar ini memerlukan teks alternatif untuk {provider}.',
  'error.alt_text_required.action':
    'Deskripsikan gambar tersebut, atau tandai sebagai gambar dekoratif.',
  'error.approval_required.message':
    'Ruang kerja ini memerlukan persetujuan sebelum dipublikasikan.',
  'error.approval_required.action': 'Minta persetujuan dari {approver}.',
  'error.approval_expired.message': 'Persetujuan untuk posting ini berakhir pada {date}.',
  'error.approval_expired.action': 'Minta persetujuan lagi.',
  'error.schedule_in_past.message': 'Waktu itu telah berlalu di {timeZone}.',
  'error.schedule_in_past.action': 'Pilih waktu lain, atau publikasikan sekarang.',
  'error.schedule_conflict.message':
    '{account} sudah memiliki postingan di dalam {duration} kali ini.',
  'error.schedule_conflict.action':
    'Pindahkan salah satunya, atau lanjutkan jika spasi tersebut diinginkan.',
  'error.time_zone_invalid.message': 'Kami tidak mengenali zona waktu {timeZone}.',
  'error.time_zone_invalid.action': 'Pilih zona dari daftar.',
  'error.destination_unavailable.message':
    '{destination} tujuan tidak lagi tersedia di {provider}.',
  'error.destination_unavailable.action': 'Segarkan daftar tujuan dan pilih yang lain.',
  'error.mention_unresolved.message': 'Penyebutan belum cocok dengan akun {provider} asli.',
  'error.mention_unresolved.action':
    'Cari dan pilih akun, atau hapus penyebutannya. Kami tidak pernah mempublikasikan tag asli palsu.',
  'error.provider_transient.message': '{provider} tidak dapat memprosesnya saat ini.',
  'error.provider_transient.action':
    'Kami akan mencoba lagi secara otomatis. Tidak ada yang diduplikasi.',
  'error.provider_permanent.message':
    '{provider} menolak ini dan tidak akan menerima percobaan ulang.',
  'error.provider_permanent.action': 'Respons yang sudah dibersihkan ada di tanda terima.',
  'error.provider_rate_limited.message': 'Tarif {provider} membatasi ruang kerja ini.',
  'error.provider_rate_limited.action': 'Kami akan mencoba lagi setelah {time}.',
  'error.provider_unavailable.message': '{provider} tidak merespons.',
  'error.provider_unavailable.action':
    'Periksa halaman status. Postingan terjadwal terus dicoba ulang.',
  'error.provider_content_rejected.message':
    '{provider} menolak konten ini berdasarkan kebijakannya sendiri.',
  'error.provider_content_rejected.action':
    'Alasan yang diberikan ada pada tanda terima. Edit konten atau banding dengan {provider}.',
  'error.user_action_required.message':
    '{account} memerlukan sesuatu dari Anda sebelum dapat dipublikasikan.',
  'error.user_action_required.action': 'Buka koneksi untuk melihat apa yang hilang.',
  'error.short_link_destination_blocked.message': 'Tujuan itu tidak dapat dipersingkat.',
  'error.short_link_destination_blocked.action':
    'Jaringan pribadi, skema tidak aman, dan tujuan yang diketahui melanggar akan diblokir.',
  'error.short_link_domain_unverified.message': 'Domain {domain} belum diverifikasi.',
  'error.short_link_domain_unverified.action':
    'Tambahkan data DNS yang ditampilkan di pengaturan, lalu verifikasi.',
  'error.rss_feed_invalid.message':
    'URL tersebut tidak mengembalikan umpan RSS atau Atom yang valid.',
  'error.rss_feed_invalid.action':
    'Periksa alamatnya. Kami mengambilnya dengan aman dan tidak mengikuti pengalihan pribadi.',
  'error.webhook_signature_invalid.message': 'Tanda tangan di webhook itu tidak terverifikasi.',
  'error.webhook_signature_invalid.action':
    'Periksa apakah pengirim menggunakan rahasia penandatanganan saat ini. Payload tidak diproses.',
  'error.webhook_delivery_failed.message': 'Pengiriman ke {endpoint} gagal.',
  'error.webhook_delivery_failed.action':
    'Kami mencoba lagi dengan backoff. Log pengiriman memiliki respons.',
  'error.automation_rule_not_permitted.message':
    'Aturan tersebut akan melanggar aturan platform, sehingga tidak dapat dibuat.',
  'error.automation_rule_not_permitted.action':
    'Suka otomatis, mengikuti, balasan yang tidak diminta, dan duplikat postingan massal tidak pernah tersedia.',
  'error.ai_unavailable.message': 'Asisten menulis tidak tersedia saat ini.',
  'error.ai_unavailable.action': 'Teks Anda tidak tersentuh. Coba lagi sebentar lagi.',
  'error.ai_output_invalid.message':
    'Asisten mengembalikan sesuatu yang tidak dapat kami validasi.',
  'error.ai_output_invalid.action': 'Tidak ada yang diterapkan pada draf Anda. Coba lagi.',
  'error.ai_budget_exceeded.message':
    'Ruang kerja ini telah mencapai batas asistennya untuk saat ini.',
  'error.ai_budget_exceeded.action':
    'Batasnya disetel ulang {relativeTime}. Menulis dengan tangan masih berfungsi.',
  'error.storage_unavailable.message': 'Kami tidak dapat menjangkau penyimpanan media.',
  'error.storage_unavailable.action': 'Teks Anda disimpan. Coba unggah lagi sebentar lagi.',
  'error.export_unavailable.message': 'Ekspor itu tidak dapat diproduksi.',
  'error.export_unavailable.action':
    'Coba rentang yang lebih kecil, atau hubungi dukungan dengan referensi.',
  'error.reference': 'Referensi {correlationId}',
  'error.reportToSupport': 'Kirimkan ini ke dukungan',
  'error.contentPreserved': 'Konten Anda dipertahankan. Tidak ada yang dipublikasikan.',
} as const;
