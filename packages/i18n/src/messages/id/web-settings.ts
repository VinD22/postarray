/** id beta catalog namespace. */
export const webSettingsMessages = {
  'settings.ui.subtitle':
    'Segala sesuatu yang mengonfigurasi ruang kerja ini. Tidak ada apa pun di sini yang menerbitkan apa pun.',
  'settings.ui.nav.label': 'Bagian pengaturan',
  'settings.ui.index.help':
    'Pilih satu bagian. Setiap perubahan dikaitkan dengan Anda dan muncul di log audit.',
  'settings.ui.section.members': 'Anggota dan peran',
  'settings.ui.section.membersSummary':
    'Siapa yang ada di ruang kerja ini dan apa yang dapat dilakukan setiap orang.',
  'settings.ui.section.projects': 'Proyek',
  'settings.ui.section.projectsSummary':
    'Suara, audiens, klaim yang disetujui, istilah yang diblokir, aturan lokal, domain, dan glosarium.',
  'settings.ui.section.agents': 'Agen dan API',
  'settings.ui.section.agentsSummary':
    'Akun layanan, cakupan, batasan, kredensial, aktivitas, dan area uji coba.',
  'settings.ui.section.apps': 'Aplikasi pengembang',
  'settings.ui.section.appsSummary':
    'Aplikasi OAuth pihak ketiga, daftar pengalihan yang diizinkan, persetujuan, dan pemberian.',
  'settings.ui.section.webhooks': 'Webhook',
  'settings.ui.section.webhooksSummary':
    'Acara keluar yang ditandatangani, log pengiriman, pengiriman ulang, dan rotasi rahasia.',
  'settings.ui.section.billing': 'Penagihan',
  'settings.ui.section.billingSummary':
    'Paket, uji coba, interval, penggunaan penyedia terukur, faktur, dan pembatalan.',
  'settings.ui.section.referrals': 'Referensi dan afiliasi',
  'settings.ui.section.referralsSummary':
    'Tautan rujukan yang Anda ungkapkan, pendaftaran yang diatribusikan, dan status komisi.',
  'settings.ui.section.localization': 'Lokalisasi',
  'settings.ui.section.localizationSummary':
    'Bahasa antarmuka, bahasa konten, pasar, zona waktu, dan format waktu.',
  'settings.ui.section.security': 'Keamanan',
  'settings.ui.section.securitySummary':
    'Sesi, autentikasi dua faktor, kredensial, agen, webhook, dan hibah aplikasi.',
  'settings.ui.section.data': 'Kontrol data',
  'settings.ui.section.dataSummary':
    'Ekspor, cabut koneksi, hapus proyek, hapus konten, atau tutup akun.',
  'settings.ui.state.loading': 'Memuat {section}',
  'settings.ui.state.errorTitle': 'Kami tidak dapat memuat {section}',
  'settings.ui.state.errorRetry': 'Coba lagi',
  'settings.ui.state.savingAnnouncement': 'Menyimpan {section}',
  'settings.ui.state.savedAnnouncement': '{section} disimpan',
  'settings.ui.state.saveFailedAnnouncement':
    '{section} tidak disimpan. Masukan Anda masih ada di sini.',
  'settings.ui.state.offlineTitle': 'Anda sedang luring',
  'settings.ui.state.offlineBody':
    'Anda dapat membaca halaman ini. Perubahan tidak dapat disimpan sampai sambungan kembali.',
  'settings.ui.state.permissionTitle': 'Anda tidak memiliki akses ke {section}',
  'settings.ui.state.permissionBody':
    'Bagian ini mengubah perilaku ruang kerja, sehingga dibatasi oleh peran.',
  'settings.ui.state.permissionRequirements': 'Apa yang Anda butuhkan',
  'settings.ui.state.permissionContact':
    'Pemilik atau admin ruang kerja ini dapat memberikannya. Mereka terdaftar di bawah Anggota dan peran.',
  'settings.ui.state.rateLimitTitle': 'Terlalu banyak perubahan dalam waktu singkat',
  'settings.ui.state.rateLimitCause':
    'Ruang kerja ini mencapai batas penulisan untuk perubahan pengaturan.',
  'settings.ui.state.rateLimitReset': 'Batasi penyetelan ulang',
  'settings.ui.state.rateLimitAlternative':
    'Tidak ada yang Anda simpan yang hilang. Tindakan hanya baca masih berfungsi selagi Anda menunggu.',
  'settings.ui.state.rateLimitUsage': 'Pengaturan menulis jam ini',
  'settings.ui.state.rateLimitUsageText': '{used} dari {limit} digunakan',
  'settings.ui.state.unsavedTitle': 'Anda memiliki perubahan yang belum disimpan',
  'settings.ui.state.unsavedBody': 'Simpan sebelum Anda meninggalkan bagian ini.',
  'settings.ui.state.readOnlyTitle': 'Ruang kerja ini bersifat hanya baca',
  'settings.ui.state.readOnlyBody':
    'Penagihan sudah lewat jatuh tempo. Konten, tanda terima, dan koneksi Anda masih utuh. Pengaturan dapat dibaca tetapi tidak diubah.',
  'settings.ui.state.referenceLabel': 'Referensi dukungan',
  'settings.ui.attribution': 'Diubah oleh {name} {relativeTime}',
  'settings.ui.attributionNever': 'Tidak berubah sejak diciptakan',
  'settings.ui.copyFailed':
    'Browser Anda memblokir salinan tersebut. Pilih teks dan salin secara manual.',
  'settings.ui.members.description':
    'Setiap undangan, perubahan peran, dan penghapusan dicatat dengan nama dan waktu Anda.',
  'settings.ui.members.tableCaption':
    'Orang-orang di ruang kerja ini, dengan peran dan ruang lingkup',
  'settings.ui.members.column.person': 'Orang',
  'settings.ui.members.column.role': 'Peran',
  'settings.ui.members.column.scope': 'Ruang lingkup',
  'settings.ui.members.column.approvals': 'Persetujuan',
  'settings.ui.members.column.lastActive': 'Terakhir aktif',
  'settings.ui.members.column.actions': 'Tindakan',
  'settings.ui.members.scopeAll': 'Semua proyek dan akun',
  'settings.ui.members.scopeLimited':
    '{count, plural, one {# project} other {# projects}}: {names}',
  'settings.ui.members.approvals.canApprove': 'Dapat menyetujui',
  'settings.ui.members.approvals.cannotApprove': 'Tidak dapat menyetujui',
  'settings.ui.members.approvals.canApproveOwnProjects': 'Dapat menyetujui proyek yang terdaftar',
  'settings.ui.members.lastActiveNever': 'Belum masuk',
  'settings.ui.members.changeRole': 'Ubah peran untuk {name}',
  'settings.ui.members.remove': 'Hapus {name}',
  'settings.ui.members.lastOwnerTitle': 'Ruang kerja menampung setidaknya satu pemilik',
  'settings.ui.members.lastOwnerBody':
    'Jadikan orang lain sebagai pemilik terlebih dahulu, lalu perubahan ini akan tersedia.',
  'settings.ui.members.inviteTitle': 'Undang seseorang ke ruang kerja ini',
  'settings.ui.members.inviteBody':
    'Mereka menerima email dengan tautan. Undangan akan habis masa berlakunya setelah tujuh hari dan Anda dapat membatalkannya sebelum tanggal tersebut.',
  'settings.ui.members.inviteRole': 'Peran',
  'settings.ui.members.inviteScope': 'Proyek tempat mereka dapat bekerja',
  'settings.ui.members.inviteScopeAll': 'Setiap proyek di ruang kerja ini',
  'settings.ui.members.inviteScopeSelected': 'Hanya proyek yang saya pilih',
  'settings.ui.members.inviteApprovals': 'Dapat memutuskan permintaan persetujuan',
  'settings.ui.members.inviteApprovalsHelp':
    'Hanya peran yang sudah menyertakan ulasan yang dapat diberikan ini. Ini terpisah dari pengeditan.',
  'settings.ui.members.inviteSubmit': 'Kirim undangan',
  'settings.ui.members.invitePending': 'Diundang {relativeTime} oleh {name}',
  'settings.ui.members.inviteRevoke': 'Cabut undangan',
  'settings.ui.members.inviteResend': 'Kirim undangan lagi',
  'settings.ui.members.emptyTitle': 'Anda adalah satu-satunya orang di sini',
  'settings.ui.members.emptyBody':
    'Undang orang yang menulis, menyetujui, atau membaca hasilnya. Masing-masing mendapat peran dan cakupan proyek.',
  'settings.ui.members.emptyExample':
    'Bentuk umum: satu pemilik penagihan, satu pemberi persetujuan per proyek, dan editor yang membuat draf tetapi tidak pernah memublikasikannya.',
  'settings.ui.members.roleReferenceTitle': 'Apa yang bisa dilakukan setiap peran',
  'settings.ui.members.roleReferenceCaption':
    'Peran dan tindakan yang diperbolehkan oleh masing-masing peran',
  'settings.ui.members.roleColumn.role': 'Peran',
  'settings.ui.members.roleColumn.can': 'Bisa',
  'settings.ui.members.roleColumn.cannot': 'Tidak bisa melakukannya',
  'settings.ui.members.roleCannot.owner': 'Tidak ada yang ditahan dari pemiliknya.',
  'settings.ui.members.roleCannot.admin': 'Ubah penagihan, atau hapus ruang kerja.',
  'settings.ui.members.roleCannot.manager': 'Ubah penagihan, peran, atau penghapusan ruang kerja.',
  'settings.ui.members.roleCannot.editor': 'Setujui, jadwalkan, publikasikan, atau ubah koneksi.',
  'settings.ui.members.roleCannot.approver': 'Ubah koneksi, aturan, atau penagihan.',
  'settings.ui.members.roleCannot.analyst': 'Buat, edit, setujui, atau publikasikan apa pun.',
  'settings.ui.members.roleCannot.viewer': 'Ubah apa pun.',
  'settings.ui.members.removeTitle': 'Hapus {name} dari ruang kerja ini',
  'settings.ui.members.removeConsequence.access':
    'Mereka segera kehilangan akses, di semua permukaan.',
  'settings.ui.members.removeConsequence.drafts':
    'Draf yang mereka tulis tetap berada di ruang kerja dan tetap dapat diedit.',
  'settings.ui.members.removeConsequence.audit':
    'Tindakan mereka di masa lalu tetap tersimpan dalam log audit dan tanda terima.',
  'settings.ui.members.removeConsequence.approvals':
    'Permintaan persetujuan yang menunggunya kembali ke antrean untuk pemberi persetujuan lain.',
  'settings.ui.projects.description':
    'Sebuah proyek memiliki aturan yang harus dipatuhi: apa yang boleh Anda klaim, apa yang tidak boleh Anda katakan, dan bagaimana setiap bahasa ditulis.',
  'settings.ui.projects.listCaption': 'Proyek di ruang kerja ini',
  'settings.ui.projects.column.project': 'Proyek',
  'settings.ui.projects.column.locales': 'Bahasa konten',
  'settings.ui.projects.column.accounts': 'Akun',
  'settings.ui.projects.column.updated': 'Diperbarui',
  'settings.ui.projects.accountCount':
    '{count, plural, =0 {No accounts} one {# account} other {# accounts}}',
  'settings.ui.projects.emptyTitle': 'Belum ada proyek',
  'settings.ui.projects.emptyBody':
    'Sebuah proyek mengelompokkan akun, aturan persetujuan, dan aturan bahasa. Kebanyakan tim memulai dengan satu aturan dan menambahkan aturan kedua ketika klien atau pasar membutuhkan aturan yang berbeda.',
  'settings.ui.projects.emptyExample':
    'Contoh: proyek "Acme EU", bahasa Inggris dan Jerman, istilah "dijamin" diblokir, pengungkapan "Kemitraan berbayar" aktif untuk Instagram.',
  'settings.ui.projects.voiceHelp':
    'Bagaimana proyek ini terdengar. Digunakan saat Anda meminta penulisan ulang dan saat klaim diperiksa.',
  'settings.ui.projects.audienceHelp': 'Untuk siapa konten tersebut, per pasar.',
  'settings.ui.projects.approvedClaimsHelp':
    'Pernyataan yang telah diselesaikan oleh pengulas. Apa pun di luar daftar ini ditandai sebelum disetujui, bukan setelah dipublikasikan.',
  'settings.ui.projects.blockedTermsHelp':
    'Kata-kata yang menghalangi penjadwalan untuk proyek ini. Satu per baris.',
  'settings.ui.projects.domainsHelp':
    'Domain yang mungkin ditautkan dan diperpendek oleh proyek ini. Hanya domain terverifikasi yang dapat dipilih di komposer.',
  'settings.ui.projects.domainVerified': '{date} terverifikasi',
  'settings.ui.projects.domainPending': 'Catatan DNS belum terlihat',
  'settings.ui.projects.disclosureHelp':
    'Diterapkan secara default di komposer untuk platform yang Anda pilih di sini. Itu dapat diubah per posting sebelum disetujui.',
  'settings.ui.projects.glossaryHelp':
    'Nama produk, istilah hukum, dan apa pun yang harus diubah dalam terjemahan.',
  'settings.ui.projects.glossaryCaption':
    'Istilah yang dilindungi dan cara masing-masing istilah tersebut ditangani per bahasa',
  'settings.ui.projects.glossaryEmpty':
    'Belum ada persyaratan yang dilindungi. Tambahkan nama produk dan istilah hukum yang tidak boleh diterjemahkan atau diungkapkan ulang.',
  'settings.ui.projects.localeRulesHelp':
    'Aturan per bahasa konten. Aturan ini diterapkan saat Anda mengadaptasi atau melakukan transkreasi, dan ditampilkan kepada peninjau.',
  'settings.ui.projects.saveProject': 'Simpan proyek',
  'settings.ui.localization.description':
    'Tiga pengaturan terpisah: bahasa aplikasi ini, bahasa yang Anda publikasikan, dan pasar tempat Anda menulis. Mengubah yang satu tidak akan pernah mengubah yang lain.',
  'settings.ui.localization.interfaceOnlyEnglish':
    'Pilih bahasa antarmuka untuk aplikasi ini. Bahasa konten terpisah dan sudah tersedia.',
  'settings.ui.localization.marketHelp':
    'Contoh perubahan pasar, pengungkapan hukum, dan ajakan bertindak. Itu tidak mengubah bahasa postingan.',
  'settings.ui.localization.previewTitle': 'Bagaimana tanggal dan angka akan terbaca',
  'settings.ui.localization.previewDate': 'Tanggal',
  'settings.ui.localization.previewTime': 'Waktu',
  'settings.ui.localization.previewNumber': 'Nomor',
  'settings.ui.localization.previewCurrency': 'Mata uang',
  'settings.ui.localization.weekStartHelp': 'Digunakan oleh tampilan minggu kalender.',
  'settings.ui.security.description':
    'Segala sesuatu yang dapat bertindak di ruang kerja ini, di satu tempat: sesi Anda, kredensial, agen, webhook, dan aplikasi yang aksesnya telah Anda berikan.',
  'settings.ui.security.sessionsCaption': 'Sesi masuk untuk akun Anda',
  'settings.ui.security.sessionColumn.device': 'Perangkat dan browser',
  'settings.ui.security.sessionColumn.location': 'Perkiraan lokasi',
  'settings.ui.security.sessionColumn.lastSeen': 'Terakhir digunakan',
  'settings.ui.security.sessionCurrent': 'Sesi ini',
  'settings.ui.security.sessionRevokeAll': 'Keluar setiap sesi lainnya',
  'settings.ui.security.sessionLocationUnknown': 'Lokasi tidak dicatat',
  'settings.ui.security.mfaOn': 'Otentikasi dua faktor aktif',
  'settings.ui.security.mfaOff': 'Otentikasi dua faktor tidak aktif',
  'settings.ui.security.mfaBody':
    'Faktor kedua diperlukan sebelum perubahan penagihan, pembuatan akun layanan, menghubungkan kembali akun, dan mencabut kredensial.',
  'settings.ui.security.credentialsTitle': 'Kunci API',
  'settings.ui.security.credentialsBody':
    'Kunci yang dimiliki oleh ruang kerja ini. Ini terpisah dari hibah aplikasi dan dari sesi Anda sendiri.',
  'settings.ui.security.agentsTitle': 'Akun layanan',
  'settings.ui.security.webhooksTitle': 'Titik akhir webhook',
  'settings.ui.security.grantsTitle': 'Aplikasi yang Anda izinkan',
  'settings.ui.security.grantsBody':
    'Mencabut aplikasi akan segera menghentikan tokennya. Koneksi Anda sendiri dan postingan terjadwal tidak terpengaruh.',
  'settings.ui.security.grantScopes': 'Izin yang diberikan',
  'settings.ui.security.socialPermissionsTitle': 'Izin akun sosial',
  'settings.ui.security.socialPermissionsBody':
    'Apa yang diizinkan oleh setiap akun yang terhubung untuk dilakukan oleh Relay, dari snapshot kemampuan yang diambil pada waktu koneksi.',
  'settings.ui.security.viewInSection': 'Kelola di {section}',
  'settings.ui.security.emptySessions': 'Hanya sesi ini yang masuk.',
  'settings.ui.security.emptyGrants':
    'Tidak ada aplikasi pihak ketiga yang memiliki akses ke ruang kerja ini. Aplikasi muncul di sini setelah Anda mengizinkannya di layar persetujuan.',
  'settings.ui.security.revokeGrantTitle': 'Cabut akses untuk {app}',
  'settings.ui.security.revokeGrantConsequence.tokens':
    'Akses dan token penyegarannya segera berhenti berfungsi.',
  'settings.ui.security.revokeGrantConsequence.scheduled':
    'Postingannya sudah dijadwalkan tinggal dijadwalkan. Batalkan secara terpisah jika Anda ingin menghentikannya.',
  'settings.ui.security.revokeGrantConsequence.reconnect':
    'Aplikasi dapat meminta akses lagi, dan Anda dapat menolaknya.',
  'settings.ui.data.description':
    'Keluarkan data Anda, hapus sesuatu, atau tutup akun. Setiap tindakan destruktif menyebutkan dengan tepat apa yang pertama kali disentuhnya.',
  'settings.ui.data.exportTitle': 'Ekspor',
  'settings.ui.data.exportBody':
    'Arsip portabel berisi konten, jadwal, tanda terima, analisis, dan acara audit, serta media yang Anda unggah.',
  'settings.ui.data.exportJson': 'JSON terstruktur',
  'settings.ui.data.exportCsv': 'CSV lembar bentang',
  'settings.ui.data.exportMedia': 'Arsip media',
  'settings.ui.data.exportJsonHelp':
    'Satu file per jenis rekaman. Didokumentasikan dan stabil di seluruh versi.',
  'settings.ui.data.exportCsvHelp':
    'Postingan, tanda terima, dan metrik sebagai tabel datar untuk spreadsheet.',
  'settings.ui.data.exportMediaHelp': 'File asli yang Anda unggah atau impor, dengan checksum.',
  'settings.ui.data.exportStart': 'Siapkan ekspor',
  'settings.ui.data.exportRunning':
    'Mempersiapkan ekspor Anda. Itu terus berjalan jika Anda menutup halaman ini.',
  'settings.ui.data.exportReady': 'Siap ekspor, siap {date}',
  'settings.ui.data.exportDownload': 'Unduh ekspor',
  'settings.ui.data.exportExpires': 'Tautan unduhan kedaluwarsa {date}.',
  'settings.ui.data.deleteTitle': 'Hapus',
  'settings.ui.data.deleteBody':
    'Pilih hal terkecil yang memecahkan masalah Anda. Setiap opsi di bawah menunjukkan apa yang bertahan.',
  'settings.ui.data.deleteConnection': 'Cabut satu koneksi sosial',
  'settings.ui.data.deleteConnectionHelp':
    'Menghapus akses Relay ke akun itu. Ruang kerja, isinya, dan kuitansinya tetap ada.',
  'settings.ui.data.deleteProject': 'Hapus merek',
  'settings.ui.data.deleteProjectHelp':
    'Menghapus merek, aturannya, dan glosariumnya. Konten yang diterbitkan di bawahnya menyimpan kuitansinya.',
  'settings.ui.data.deleteContent': 'Hapus konten dan media',
  'settings.ui.data.deleteContentHelp':
    'Menghapus draf dan file yang disimpan. Itu tidak menghapus apa pun yang sudah dipublikasikan di platform.',
  'settings.ui.data.deleteAccount': 'Tutup ruang kerja ini',
  'settings.ui.data.deleteAccountHelp':
    'Membatalkan pekerjaan terjadwal, mencabut setiap koneksi, menghapus media yang disimpan dan menutup ruang kerja.',
  'settings.ui.data.scheduledJobsTitle': 'Pekerjaan terjadwal yang akan dibatalkan terlebih dahulu',
  'settings.ui.data.scheduledJobsCount':
    '{count, plural, =0 {Nothing is scheduled right now} one {# scheduled post} other {# scheduled posts}}',
  'settings.ui.data.cancelJobsFirst': 'Batalkan postingan terjadwal sekarang',
  'settings.ui.data.cancelJobsDone':
    'Postingan terjadwal dibatalkan. Tidak ada yang akan dipublikasikan.',
  'settings.ui.data.deleteConfirmPhraseLabel': 'Ketikkan nama ruang kerja untuk mengonfirmasi',
  'settings.ui.data.deleteConsequence.jobs':
    'Setiap postingan terjadwal dibatalkan sebelum ada yang dihapus.',
  'settings.ui.data.deleteConsequence.connections': 'Setiap koneksi sosial dicabut di penyedia.',
  'settings.ui.data.deleteConsequence.media':
    'Media yang disimpan akan dihapus dan tidak dapat dipulihkan.',
  'settings.ui.data.deleteConsequence.receipts':
    'Tanda terima publikasi disimpan selama periode penyimpanan yang dinyatakan dalam Persyaratan, kemudian dihapus.',
  'settings.ui.data.deleteConsequence.published':
    'Postingan yang sudah ada di platform tidak dihapus. Hapus yang ada di platform.',
  'settings.ui.data.exportFirst': 'Ekspor data Anda sebelum Anda menghapusnya.',
  'settings.ui.referral.description':
    'Bagikan Relay dengan tautan yang diungkapkan. Komisi tidak pernah bergantung pada tinjauan positif.',
  'settings.ui.referral.linkLabel': 'Tautan referensi Anda',
  'settings.ui.referral.tableCaption': 'Pendaftaran yang diatribusikan dan status komisinya',
  'settings.ui.referral.column.signup': 'Daftar',
  'settings.ui.referral.column.date': 'Tanggal',
  'settings.ui.referral.column.state': 'Komisi',
  'settings.ui.referral.column.amount': 'Jumlah',
  'settings.ui.referral.emptyTitle': 'Belum ada pendaftaran yang diatribusikan',
  'settings.ui.referral.emptyBody':
    'Pendaftaran muncul di sini setelah seseorang memulai uji coba melalui tautan Anda. Jumlahnya tetap tertunda hingga jendela pengembalian dana ditutup.',
  'settings.ui.referral.emptyExample':
    'Contoh baris: acme.example, memulai uji coba pada 12 Juni, tertunda hingga 12 Juli, lalu disetujui.',
  'settings.ui.referral.termsLink': 'Baca ketentuan mitra',
  'settings.ui.referral.balance': 'Komisi yang disetujui',
  'settings.ui.referral.balanceUnavailableReason':
    'Buku besar komisi untuk periode ini belum direkonsiliasi.',
  'developer.ui.agents.description':
    'Akun layanan adalah identitas bernama untuk agen, skrip, atau alur kerja. Ia mempunyai ruang lingkupnya sendiri, batasannya sendiri, dan jejak auditnya sendiri.',
  'developer.ui.agents.emptyTitle': 'Belum ada akun layanan',
  'developer.ui.agents.emptyBody':
    'Buat satu untuk setiap otomatisasi yang Anda jalankan. Akun terpisah berarti Anda dapat mencabut satu akun tanpa menghentikan akun lainnya.',
  'developer.ui.agents.emptyExample':
    'Contoh: "Agen konten", proyek Acme EU, dapat membuat draf dan menjadwalkan hingga 6 postingan sehari antara pukul 07:00 dan 22:00, tidak pernah langsung dipublikasikan.',
  'developer.ui.agents.step.identity': 'Nama dan tujuan',
  'developer.ui.agents.step.scope': 'Apa yang bisa dijangkaunya',
  'developer.ui.agents.step.limits': 'Batasan',
  'developer.ui.agents.purpose': 'Untuk apa akun ini',
  'developer.ui.agents.purposeHelp':
    'Satu kalimat. Ini muncul di samping setiap tindakan yang dilakukan akun ini di log audit.',
  'developer.ui.agents.scopeHelp':
    'Sebuah ruang lingkup memberikan dirinya sendiri. Tidak ada apa pun di sini yang menyiratkan hal lain.',
  'developer.ui.agents.limitsHelp':
    'Batasan diberlakukan oleh API, bukan oleh agen. Agen tidak dapat menaikkan batasnya sendiri.',
  'developer.ui.agents.quietHours': 'Saat-saat tenang',
  'developer.ui.agents.quietHoursHelp':
    'Akun tidak dapat menjadwalkan atau mempublikasikan dalam jam tersebut, dalam zona waktu ruang kerja.',
  'developer.ui.agents.lookAheadHelp':
    'Seberapa jauh di masa depan ia dapat menempatkan sebuah pos.',
  'developer.ui.agents.cadenceHelp':
    'Publikasi paling eksternal yang mungkin ditimbulkannya dalam satu hari.',
  'developer.ui.agents.expiry': 'Kedaluwarsa kredensial',
  'developer.ui.agents.expiryHelp':
    'Hidup yang lebih pendek lebih aman. Anda dapat memutarnya kapan saja.',
  'developer.ui.agents.summaryTitle': 'Sebelum Anda membuatnya',
  'developer.ui.agents.summaryAccounts': 'Akun yang dapat dijangkau',
  'developer.ui.agents.summaryMaxActions':
    'At most {count, plural, one {# external publication} other {# external publications}} per day.',
  'developer.ui.agents.summaryApproval': 'Perilaku persetujuan',
  'developer.ui.agents.summaryCreate': 'Buat akun layanan',
  'developer.ui.agents.detailTitle': 'Akun layanan',
  'developer.ui.agents.statusActive': 'Aktif',
  'developer.ui.agents.statusStopped': 'Berhenti',
  'developer.ui.agents.statusExpired': 'Kredensial sudah habis masa berlakunya',
  'developer.ui.agents.stoppedBody':
    'Akun ini dihentikan. Setiap panggilan yang dibuatnya ditolak dengan alasan yang jelas. Tidak ada yang dibuatnya yang dihapus.',
  'developer.ui.agents.killTitle': 'Hentikan {name}',
  'developer.ui.agents.killConsequence.calls':
    'Setiap panggilan API, MCP, dan CLI dari akun ini ditolak sekaligus.',
  'developer.ui.agents.killConsequence.scheduled':
    'Postingannya sudah dijadwalkan tinggal dijadwalkan. Batalkan dari kalender jika Anda ingin menghentikannya.',
  'developer.ui.agents.killConsequence.reversible': 'Anda dapat memulainya lagi nanti.',
  'developer.ui.agents.resume': 'Mulai agen ini lagi',
  'developer.ui.agents.rotate': 'Putar kredensial',
  'developer.ui.agents.rotateTitle': 'Putar kredensial untuk {name}',
  'developer.ui.agents.rotateConsequence.old': 'Kredensial saat ini segera berhenti berfungsi.',
  'developer.ui.agents.rotateConsequence.new': 'Yang baru ditampilkan satu kali, di halaman ini.',
  'developer.ui.agents.rotateConsequence.clients':
    'Apa pun yang menggunakan nilai lama akan gagal sampai Anda memperbaruinya.',
  'developer.ui.agents.credentialStored': 'Saya telah menyimpan kredensial ini',
  'developer.ui.agents.credentialLabel': 'Kredensial akun layanan',
  'developer.ui.agents.credentialWarning':
    'Ini adalah satu-satunya saat kredensial ini ditampilkan',
  'developer.ui.agents.credentialWarningBody':
    'Salin ke toko rahasia Anda sekarang. Kami hanya menyimpan hash, jadi kami tidak dapat menampilkannya lagi. Memutar menciptakan yang baru.',
  'developer.ui.agents.credentialConsumed':
    'Kredensial tidak lagi ditampilkan. Putar jika Anda tidak menyimpannya.',
  'developer.ui.agents.credentialReveal': 'Tunjukkan kredensial',
  'developer.ui.agents.credentialHide': 'Sembunyikan kredensial',
  'developer.ui.scope.accounts_read':
    'Lihat akun Anda yang terhubung dan apa yang dapat dilakukan masing-masing akun',
  'developer.ui.scope.accounts_write': 'Ganti nama akun dan ubah cara pengelompokannya',
  'developer.ui.scope.drafts_read': 'Baca draf Anda dan variannya',
  'developer.ui.scope.drafts_write': 'Membuat dan mengedit draf',
  'developer.ui.scope.posts_schedule': 'Jadwalkan konten yang disetujui ke akun Anda',
  'developer.ui.scope.posts_publish': 'Publikasikan ke akun Anda segera',
  'developer.ui.scope.posts_cancel': 'Batalkan postingan terjadwal',
  'developer.ui.scope.analytics_read': 'Baca analitik untuk akun Anda',
  'developer.ui.scope.media_read': 'Lihat file di perpustakaan Anda',
  'developer.ui.scope.media_write': 'Unggah dan edit file di perpustakaan Anda',
  'developer.ui.scope.rules_read': 'Baca aturan otomatisasi Anda',
  'developer.ui.scope.rules_write':
    'Membuat dan mengubah aturan otomatisasi yang dapat dipublikasikan',
  'developer.ui.scope.growth_read': 'Baca rencana pertumbuhan Anda',
  'developer.ui.scope.growth_write': 'Membuat dan mengedit rencana pertumbuhan',
  'developer.ui.scope.webhooks_manage': 'Membuat dan mengubah titik akhir webhook',
  'developer.ui.scope.billing_read': 'Baca paket Anda, status uji coba, dan penggunaan',
  'developer.ui.scope.connections_admin': 'Hubungkan dan putuskan sambungan akun sosial',
  'developer.ui.activity.caption': 'Panggilan alat terbaru, dengan panggilan yang ditolak',
  'developer.ui.activity.column.time': 'Waktu',
  'developer.ui.activity.column.tool': 'Alat atau rute',
  'developer.ui.activity.column.outcome': 'Hasil',
  'developer.ui.activity.column.subject': 'Subyek',
  'developer.ui.activity.outcome.ok': 'Diizinkan',
  'developer.ui.activity.outcome.denied': 'Ditolak',
  'developer.ui.activity.outcome.failed': 'Gagal',
  'developer.ui.activity.filterDenied': 'Tampilkan upaya yang ditolak saja',
  'developer.ui.activity.deniedExplain':
    'Upaya yang ditolak adalah cara agen yang salah dikonfigurasi menampilkan dirinya. Baris-baris ini disimpan, bukan disembunyikan.',
  'developer.ui.activity.emptyTitle': 'Belum ada panggilan yang direkam',
  'developer.ui.activity.emptyBody':
    'Panggilan muncul di sini dalam beberapa detik setelah panggilan terjadi, termasuk panggilan yang ditolak.',
  'developer.ui.activity.emptyExample':
    'Contoh baris: 12:03, draft_post, Allowed, draft untuk akun X @acme.',
  'developer.ui.setup.help':
    'Rekatkan ini ke klien yang Anda sambungkan. Ganti placeholder kredensial dengan nilai yang Anda simpan.',
  'developer.ui.setup.credentialPlaceholder':
    'Cuplikan menggunakan placeholder. Jangan pernah memasukkan kredensial asli ke repositori.',
  'developer.ui.setup.copySnippet': 'Salin cuplikan untuk {client}',
  'developer.ui.setup.snippetCopied': 'Cuplikan disalin',
  'developer.ui.setup.tabLabel': 'Cuplikan pengaturan klien',
  'developer.ui.playground.help':
    'Panggilan dijalankan terhadap salinan ruang kerja ini yang diunggulkan. Tidak ada penyedia yang dihubungi dan tidak ada yang dijadwalkan.',
  'developer.ui.playground.tool': 'Alat',
  'developer.ui.playground.arguments': 'Argumen',
  'developer.ui.playground.argumentsHelp': 'JSON. Badan yang sama yang diterima API asli.',
  'developer.ui.playground.result': 'Hasil',
  'developer.ui.playground.resultEmpty':
    'Jalankan alat untuk melihat respons yang akan dihasilkannya.',
  'developer.ui.playground.invalidJson': 'JSON ini belum valid, sehingga tidak dapat dikirim.',
  'developer.ui.playground.deniedByApproval':
    'Tingkat persetujuan {level} tidak mengizinkan panggilan ini. Uji coba menolaknya persis seperti yang dilakukan API.',
  'developer.ui.playground.announceResult': 'Uji coba selesai. {outcome}.',
  'developer.ui.apps.description':
    'Daftarkan aplikasi agar orang lain dapat memberinya akses ke ruang kerja mereka. Setiap aplikasi memiliki identitasnya sendiri, daftar pengalihan yang diizinkan, dan jejak auditnya sendiri.',
  'developer.ui.apps.emptyTitle': 'Tidak ada aplikasi yang terdaftar',
  'developer.ui.apps.emptyBody':
    'Daftarkan aplikasi ketika produk lain perlu bertindak atas nama pengguna Relay. Untuk otomatisasi Anda sendiri, gunakan akun layanan sebagai gantinya.',
  'developer.ui.apps.emptyExample':
    'Contoh: "Acme Publisher", klien rahasia, pengalihan https://acme.example/oauth/callback, cakupan akun:baca dan draf:tulis.',
  'developer.ui.apps.typeHelp':
    'Klien rahasia berjalan di server yang Anda kendalikan dan dapat menyimpan rahasia. Klien publik adalah browser atau aplikasi desktop dan menggunakan PKCE tanpa rahasia.',
  'developer.ui.apps.redirectAdd': 'Tambahkan URI pengalihan',
  'developer.ui.apps.redirectRemove': 'Hapus {uri}',
  'developer.ui.apps.redirectInvalid':
    'Masukkan URI https lengkap tanpa wildcard dan tanpa string kueri. Nilai tersebut harus sama persis dengan nilai yang dikirimkan aplikasi Anda.',
  'developer.ui.apps.linksTitle': 'Tautan yang dipublikasikan',
  'developer.ui.apps.linksHelp':
    'Ini muncul di layar persetujuan. Pengguna yang tidak dapat menjangkaunya tidak akan memberikan akses.',
  'developer.ui.apps.linkUnreachable':
    'Kami tidak dapat mencapai URL ini saat terakhir kali kami memeriksanya, {date}.',
  'developer.ui.apps.linkReachable': 'Dapat dijangkau, dicentang {date}',
  'developer.ui.apps.scopesTitle': 'Izin yang mungkin diminta oleh aplikasi ini',
  'developer.ui.apps.scopesHelp':
    'Mintalah paling sedikit yang Anda perlukan. Pengguna melihat izin baca dan izin konsekuensial sebagai dua grup terpisah.',
  'developer.ui.apps.scopeGroup.read': 'Izin baca',
  'developer.ui.apps.scopeGroup.reversible': 'Perubahan yang dapat Anda batalkan',
  'developer.ui.apps.scopeGroup.consequential': 'Izin konsekuensial',
  'developer.ui.apps.scopeGroupHelp.read':
    'Ini memungkinkan aplikasi melihat data. Tidak ada yang berubah.',
  'developer.ui.apps.scopeGroupHelp.reversible':
    'Ini memungkinkan aplikasi membuat atau mengedit sesuatu di dalam Relay. Tidak ada yang mencapai platform.',
  'developer.ui.apps.scopeGroupHelp.consequential':
    'Hal ini dapat menyebabkan postingan di akun nyata, atau mengubah siapa yang dapat menghubungi akun Anda. Mereka selalu dicantumkan secara terpisah dan tidak pernah dibundel.',
  'developer.ui.apps.noBundling':
    'Tidak ada cakupan akses gabungan. Penagihan dan administrasi koneksi selalu ditanyakan namanya.',
  'developer.ui.apps.secretTitle': 'Rahasia klien',
  'developer.ui.apps.secretWarning': 'Ini adalah satu-satunya saat rahasia klien ditampilkan',
  'developer.ui.apps.secretWarningBody':
    'Simpan di manajer rahasia sisi server Anda sekarang. Kami hanya menyimpan hash. Jika Anda kehilangannya, putarlah: tidak ada cara untuk mengungkapkannya lagi.',
  'developer.ui.apps.secretConsumed':
    'Rahasianya tidak lagi ditampilkan. Putar jika Anda tidak menyimpannya.',
  'developer.ui.apps.secretStored': 'Saya telah menyimpan rahasia ini',
  'developer.ui.apps.secretPublicClient':
    'Klien publik tidak memiliki rahasia. Ini menggunakan aliran kode otorisasi dengan PKCE.',
  'developer.ui.apps.rotateTitle': 'Putar rahasia klien untuk {app}',
  'developer.ui.apps.rotateConsequence.old': 'Rahasia saat ini segera berhenti bekerja.',
  'developer.ui.apps.rotateConsequence.grants': 'Hibah pengguna yang ada tidak dicabut.',
  'developer.ui.apps.rotateConsequence.deploy':
    'Server Anda gagal menyegarkan token sampai Anda menerapkan nilai baru.',
  'developer.ui.apps.consentPreviewTitle': 'Pratinjau layar persetujuan',
  'developer.ui.apps.consentPreviewHelp':
    'Inilah yang dilihat pengguna. Itu dihasilkan dari catatan aplikasi, jadi tidak bisa menjanjikan lebih dari yang diminta aplikasi.',
  'developer.ui.apps.consentPreviewSample':
    'Hanya pratinjau. Tidak ada yang diberikan dan tidak ada token yang dikeluarkan.',
  'developer.ui.apps.grantsCaption': 'Workspace yang telah memberikan akses aplikasi ini',
  'developer.ui.apps.grantColumn.workspace': 'Workspace',
  'developer.ui.apps.grantColumn.scopes': 'Lingkup',
  'developer.ui.apps.grantColumn.granted': 'Memang benar',
  'developer.ui.apps.grantColumn.lastUsed': 'Terakhir digunakan',
  'developer.ui.apps.grantsEmpty': 'Belum ada yang memberikan akses aplikasi ini.',
  'developer.ui.apps.logsCaption': 'Permintaan terbaru, dengan rahasia dan muatan dihapus',
  'developer.ui.apps.logColumn.time': 'Waktu',
  'developer.ui.apps.logColumn.route': 'Rute',
  'developer.ui.apps.logColumn.status': 'Status',
  'developer.ui.apps.logColumn.workspace': 'Workspace',
  'developer.ui.apps.logsRedacted':
    'Badan permintaan dan respons disimpan dengan kredensial, token, dan konten pengguna dihapus.',
  'developer.ui.apps.sandboxTitle': 'Kredensial kotak pasir',
  'developer.ui.apps.sandboxBody':
    'ID klien dan ruang kerja terpisah dengan data unggulan. Panggilan yang dilakukan dengannya tidak pernah sampai ke penyedia.',
  'developer.ui.apps.rateLimitLabel': 'Batas tarif',
  'developer.ui.apps.rateLimitUsage': '{used} dari {limit} permintaan jam ini',
  'developer.ui.apps.disable': 'Nonaktifkan aplikasi',
  'developer.ui.apps.enable': 'Aktifkan aplikasi',
  'developer.ui.apps.disabledBody':
    'Aplikasi ini dinonaktifkan. Token yang ada ditolak dan hibah baru tidak dapat dimulai. Hibah disimpan sehingga Anda dapat mengaktifkannya kembali.',
  'developer.ui.apps.deleteTitle': 'Hapus {app}',
  'developer.ui.apps.deleteConsequence.grants':
    'Setiap hibah dicabut dan setiap token berhenti berfungsi.',
  'developer.ui.apps.deleteConsequence.logs':
    'Log permintaan disimpan untuk periode retensi audit.',
  'developer.ui.apps.deleteConsequence.irreversible': 'ID klien tidak dapat digunakan kembali.',
  'developer.ui.webhooks.description':
    'Pengiriman HTTPS yang ditandatangani untuk acara yang Anda pilih. Setiap pengiriman dicatat beserta responsnya, dan pengiriman apa pun dapat dikirim kembali.',
  'developer.ui.webhooks.emptyTitle': 'Belum ada titik akhir',
  'developer.ui.webhooks.emptyBody':
    'Tambahkan titik akhir untuk menerima hasil publikasi, keputusan persetujuan, dan kesehatan koneksi di sistem Anda sendiri.',
  'developer.ui.webhooks.emptyExample':
    'Contoh: https://hooks.acme.example/relay, berlangganan post.published, post.failed, dan connection.action_required.',
  'developer.ui.webhooks.create': 'Tambahkan titik akhir',
  'developer.ui.webhooks.url': 'URL titik akhir',
  'developer.ui.webhooks.urlHelp':
    'HTTPS saja. Kami tidak mengikuti pengalihan dan kami tidak mencoba lagi 2xx.',
  'developer.ui.webhooks.eventsTitle': 'Acara',
  'developer.ui.webhooks.eventsHelp':
    'Pilih acara yang Anda tangani. Mengirim semuanya ke titik akhir yang mengabaikan sebagian besarnya membuat kegagalan lebih sulit dilihat.',
  'developer.ui.webhooks.eventsAll': 'Setiap acara',
  'developer.ui.webhooks.eventsSelected': 'Hanya acara yang saya pilih',
  'developer.ui.webhooks.eventsCount': '{count, plural, one {# event} other {# events}}',
  'developer.ui.webhooks.eventGroup.connections': 'Koneksi',
  'developer.ui.webhooks.eventGroup.content': 'Konten dan persetujuan',
  'developer.ui.webhooks.eventGroup.publishing': 'Penerbitan',
  'developer.ui.webhooks.eventGroup.automation': 'Otomatisasi dan umpan',
  'developer.ui.webhooks.eventGroup.workspace': 'Workspace',
  'developer.ui.webhooks.scopeTitle': 'Proyek dan akun',
  'developer.ui.webhooks.scopeAll': 'Setiap proyek dan akun',
  'developer.ui.webhooks.scopeSelected': 'Hanya yang saya pilih',
  'developer.ui.webhooks.secretTitle': 'Rahasia penandatanganan',
  'developer.ui.webhooks.secretBody':
    'Verifikasi header tanda tangan sebelum Anda mengurai isi. Hapus duplikat pada id pengiriman, yang stabil di seluruh percobaan ulang.',
  'developer.ui.webhooks.secretRotateTitle': 'Putar rahasia penandatanganan',
  'developer.ui.webhooks.secretRotateConsequence.overlap':
    'Kedua rahasia tersebut diterima selama 24 jam sehingga Anda dapat menerapkannya tanpa membatalkan pengiriman.',
  'developer.ui.webhooks.secretRotateConsequence.after':
    'Setelah jendela itu hanya rahasia baru yang digunakan.',
  'developer.ui.webhooks.testDeliveryHelp':
    'Mengirimkan satu contoh peristiwa bertanda tangan yang ditandai sebagai ujian, sehingga penerima Anda dapat mengabaikannya dengan aman.',
  'developer.ui.webhooks.testDeliverySent':
    'Pengiriman tes terkirim. Hasilnya muncul di log di bawah ini.',
  'developer.ui.webhooks.deliveriesCaption':
    'Pengiriman terbaru dan tanggapan yang diterima masing-masing',
  'developer.ui.webhooks.deliveryColumn.time': 'Diminta',
  'developer.ui.webhooks.deliveryColumn.event': 'Acara',
  'developer.ui.webhooks.deliveryColumn.attempt': 'Mencoba',
  'developer.ui.webhooks.deliveryColumn.response': 'Respon',
  'developer.ui.webhooks.deliveryColumn.status': 'Status',
  'developer.ui.webhooks.deliveryStatus.pending': 'Menunggu',
  'developer.ui.webhooks.deliveryStatus.succeeded': 'Terkirim',
  'developer.ui.webhooks.deliveryStatus.failed': 'Gagal, akan mencoba lagi',
  'developer.ui.webhooks.deliveryStatus.exhausted': 'Gagal, tidak ada lagi percobaan ulang',
  'developer.ui.webhooks.deliveryStatus.disabled': 'Tidak terkirim, titik akhir dinonaktifkan',
  'developer.ui.webhooks.deliveryNoResponse': 'Tidak ada tanggapan yang diterima',
  'developer.ui.webhooks.deliveryNextAttempt': 'Upaya berikutnya {relativeTime}',
  'developer.ui.webhooks.inspect': 'Periksa pengiriman',
  'developer.ui.webhooks.inspectTitle': 'Pengiriman {id}',
  'developer.ui.webhooks.inspectRequest': 'Permintaan tubuh',
  'developer.ui.webhooks.inspectResponse': 'Badan respons',
  'developer.ui.webhooks.redeliver': 'Kirim kiriman ini lagi',
  'developer.ui.webhooks.redeliverHelp':
    'ID peristiwa yang sama dikirim lagi dengan tanda pengiriman ulang yang disetel, sehingga penerima idempoten mengabaikannya dengan aman.',
  'developer.ui.webhooks.redelivered': 'Mengantri untuk pengiriman ulang.',
  'developer.ui.webhooks.failureTitle': 'Titik akhir ini gagal',
  'developer.ui.webhooks.failureBody':
    '{count, plural, one {# delivery in a row failed} other {# deliveries in a row failed}}. After {limit} consecutive failures the endpoint is disabled and an action item is filed.',
  'developer.ui.webhooks.disabledTitle':
    'Titik akhir ini dinonaktifkan setelah kegagalan berulang kali',
  'developer.ui.webhooks.disabledBody':
    'Kami berhenti mengirimkannya sehingga antrean Anda tidak terisi. Perbaiki penerima, kirim pengiriman tes, lalu aktifkan kembali.',
  'developer.ui.webhooks.lastSuccessLabel': 'Kesuksesan terakhir',
  'developer.ui.webhooks.lastSuccessNever': 'Tidak ada pengiriman yang berhasil',
  'developer.ui.webhooks.deleteTitle': 'Hapus titik akhir ini',
  'developer.ui.webhooks.deleteConsequence.stop': 'Tidak ada lagi yang dikirim ke URL ini.',
  'developer.ui.webhooks.deleteConsequence.logs':
    'Log pengiriman disimpan untuk periode retensi audit.',
  'billing.ui.description':
    'Satu rencana, dua interval. Polar adalah pedagang yang tercatat: Polar memegang metode pembayaran, menerbitkan faktur, dan menangani pembatalan.',
  'billing.ui.statusHeading': 'Status saat ini',
  'billing.ui.planHeading': 'Rencana',
  'billing.ui.intervalHeading': 'Interval penagihan',
  'billing.ui.usageHeading': 'Penggunaan penyedia terukur',
  'billing.ui.invoicesHeading': 'Faktur',
  'billing.ui.cancelHeading': 'Pembatalan',
  'billing.ui.trialDaysRemaining':
    'Trial, {count, plural, =0 {ends today} one {# day remaining} other {# days remaining}}',
  'billing.ui.convertsOn': 'Mengonversi {date} menjadi {amount} untuk setiap {interval}.',
  'billing.ui.dueToday': '$0 jatuh tempo hari ini',
  'billing.ui.conversionLabel': 'Bertobat',
  'billing.ui.channelsLabel': 'Saluran aktif',
  'billing.ui.paymentMethodPolar': 'Metode pembayaran dipegang oleh Polar',
  'billing.ui.paymentMethodDescriptor':
    '{project} berakhir {last4}, habis masa berlakunya {expiry}',
  'billing.ui.paymentMethodMissing': 'Belum ada metode pembayaran yang tercatat',
  'billing.ui.cancelBeforeDate': 'Batalkan sebelum {date} dan Anda tidak akan dikenakan biaya.',
  'billing.ui.annualFraming': '$25/bulan ditagih setiap tahun. Hemat $48/tahun.',
  'billing.ui.monthlyOption': '$29 per bulan',
  'billing.ui.annualOption': '$300 per tahun',
  'billing.ui.intervalChangeHelp':
    'Perubahan interval akan berlaku pada perpanjangan berikutnya. Polar memproratanya dan menunjukkan jumlah pastinya sebelum Anda mengonfirmasi.',
  'billing.ui.intervalChangedAnnouncement': 'Interval penagihan disetel ke {interval}.',
  'billing.ui.allowanceChannels':
    '30 saluran sosial aktif. Saluran adalah satu akun, halaman, atau saluran yang terhubung.',
  'billing.ui.allowanceChannelsUsage': '{used} dari saluran aktif {limit}',
  'billing.ui.allowanceFairUse':
    'Penggunaan wajar berarti anti spam, kontrol tarif dan biaya penyedia. Aturan ini berlaku dengan cara yang sama untuk setiap pelanggan dan dipublikasikan, bukan berdasarkan kebijakan.',
  'billing.ui.allowanceMetered':
    'X dan beberapa penyedia lainnya mengenakan biaya per operasi. Biaya tersebut dibebankan sebesar biayanya dan bukan merupakan bagian dari harga paket.',
  'billing.ui.allowanceNoMedia':
    'Pembuatan gambar dan pembuatan video tidak termasuk dan tidak dijual. Relay tidak menghasilkan media.',
  'billing.ui.readFairUse': 'Baca kebijakan penggunaan wajar',
  'billing.ui.readMeteredPolicy': 'Baca cara penagihan penggunaan terukur',
  'billing.ui.usageCaption':
    'Penggunaan penyedia terukur pada periode ini, ditagih berdasarkan biaya',
  'billing.ui.usageColumn.item': 'Barang',
  'billing.ui.usageColumn.quantity': 'Kuantitas',
  'billing.ui.usageColumn.unitPrice': 'Harga satuan',
  'billing.ui.usageColumn.amount': 'Jumlah',
  'billing.ui.usageTotal': 'Total periode ini',
  'billing.ui.usagePeriod': 'Periode {start} hingga {end}',
  'billing.ui.usageSource': 'Harga dipublikasikan oleh penyedia. {date} terverifikasi.',
  'billing.ui.usageReconciled': 'Direkonsiliasi dengan faktur penyedia di {date}.',
  'billing.ui.usagePending': 'Belum berdamai. Jumlah akhir mungkin sedikit berubah.',
  'billing.ui.usageUnavailableReason':
    'Penyedia belum mengembalikan penggunaan untuk periode ini. Biasanya tersedia dalam waktu 24 jam.',
  'billing.ui.usageEmpty': 'Tidak ada penggunaan terukur pada periode ini.',
  'billing.ui.spendAlert': 'Peringatan pembelanjaan',
  'billing.ui.spendAlertHelp':
    'Kami mengirimkan email kepada Anda ketika penggunaan terukur melampaui jumlah ini dalam periode penagihan.',
  'billing.ui.spendAlertPause': 'Jeda juga tindakan terukur saat peringatan tercapai',
  'billing.ui.balanceLabel': 'Saldo penggunaan',
  'billing.ui.balanceHelp': 'Penggunaan terukur diambil dari saldo ini dan ditagih oleh Polar.',
  'billing.ui.invoicesCaption': 'Faktur yang dikeluarkan oleh Polar',
  'billing.ui.invoiceColumn.date': 'Tanggal',
  'billing.ui.invoiceColumn.description': 'Deskripsi',
  'billing.ui.invoiceColumn.amount': 'Jumlah',
  'billing.ui.invoiceColumn.state': 'Negara',
  'billing.ui.invoiceState.paid': 'Dibayar',
  'billing.ui.invoiceState.open': 'Buka',
  'billing.ui.invoiceState.uncollectible': 'Tidak dikumpulkan',
  'billing.ui.invoiceState.refunded': 'Dikembalikan',
  'billing.ui.invoicesEmpty': 'Belum ada faktur. Yang pertama dikeluarkan ketika sidang berubah.',
  'billing.ui.invoicesInPortal': 'Setiap faktur dan tanda terima tersedia di portal Polar.',
  'billing.ui.portalHelp':
    'Portal adalah tempat Anda mengubah metode pembayaran, mengunduh faktur, dan membatalkan. Itu terbuka di tab baru.',
  'billing.ui.pastDueHeading': 'Pembayaran terlambat',
  'billing.ui.pastDueBody':
    'Pembayaran terakhir tidak berhasil. Perbarui metode pembayaran di portal Polar untuk terus menerbitkan.',
  'billing.ui.gracePolicy':
    'Postingan terjadwal tetap berjalan hingga {date}. Setelah itu ruang kerja menjadi hanya baca: tidak ada yang dihapus dan tidak ada yang dipublikasikan.',
  'billing.ui.cancelBody':
    'Pembatalan merupakan salah satu tindakan dan berlaku pada akhir periode yang telah Anda bayar. Tidak ada panggilan yang harus dilakukan dan tidak ada formulir yang harus diisi.',
  'billing.ui.cancelStart': 'Batalkan langganan',
  'billing.ui.cancelDialogTitle': 'Batalkan langganan ini',
  'billing.ui.cancelConsequence.noCharge':
    'Anda tidak akan dikenakan biaya. Tidak ada yang diambil hari ini atau pada {date}.',
  'billing.ui.cancelConsequence.accessUntil': 'Anda menyimpan setiap fitur hingga {date}.',
  'billing.ui.cancelConsequence.dataKept':
    'Draf, tanda terima, media, dan analitik tetap ada di ruang kerja ini.',
  'billing.ui.cancelConsequence.scheduled':
    'Postingan yang dijadwalkan setelah {date} tidak akan dipublikasikan. Batalkan atau jadwalkan ulang sebelum itu.',
  'billing.ui.cancelConsequence.restart': 'Anda dapat memulai berlangganan lagi kapan saja.',
  'billing.ui.cancelConfirm': 'Batalkan langganan',
  'billing.ui.cancelKeep': 'Tetap berlangganan',
  'billing.ui.cancelConfirmedBeforeConversion': 'Dibatalkan. Anda tidak akan dikenakan biaya.',
  'billing.ui.cancelConfirmedAfterConversion': 'Dibatalkan. Akses berlanjut hingga {date}.',
  'billing.ui.cancelAnnouncement': 'Langganan dibatalkan.',
  'billing.ui.canceledNotice': 'Langganan ini dibatalkan.',
  'billing.ui.resume': 'Mulai berlangganan lagi',
  'billing.ui.noSubscriptionTitle': 'Tidak ada langganan di ruang kerja ini',
  'billing.ui.noSubscriptionBody':
    'Mulai uji coba tujuh hari untuk dipublikasikan. Polar mengumpulkan metode pembayaran dan tidak mengenakan biaya apa pun hari ini.',
  'billing.ui.noSubscriptionExample':
    'Bulanan adalah $29. Tahunan adalah $300, yaitu $25/bulan yang ditagih setiap tahun. Hemat $48/tahun.',
  'billing.ui.overChannelLimitAction': 'Tinjau saluran yang terhubung',
  'growth.ui.entryHelp':
    'Jawablah masukan singkat, konfirmasikan apa yang kita pahami, dan dapatkan rencana yang dapat Anda terima item demi item. Ini mengusulkan pekerjaan. Itu tidak pernah menjadwalkan atau menerbitkan apa pun sendiri.',
  'growth.ui.step.intake': 'Asupan',
  'growth.ui.step.confirm': 'Konfirmasikan',
  'growth.ui.step.plan': 'Rencana',
  'growth.ui.stepIndicator': 'Langkah {current} dari {total}: {name}',
  'growth.ui.intake.section.product': 'Produk',
  'growth.ui.intake.section.audience': 'Audiens dan pasar',
  'growth.ui.intake.section.objective': 'Objektif',
  'growth.ui.intake.section.capacity': 'Saluran dan kapasitas',
  'growth.ui.intake.section.limits': 'Apa yang terlarang',
  'growth.ui.intake.help':
    'Tidak ada apa pun di sini yang dapat Anda tebak. Apa pun yang Anda biarkan kosong akan ditandai sebagai hilang, bukan diisi.',
  'growth.ui.intake.productNameHelp': 'Nama yang Anda gunakan dengan pelanggan.',
  'growth.ui.intake.siteUrlHelp':
    'Kami membaca halaman yang Anda berikan kepada kami sebagai bahan sumber. Anda mengkonfirmasi setiap fakta yang kami ambil darinya.',
  'growth.ui.intake.descriptionHelp':
    'Apa yang Anda jual dan untuk siapa, dengan kata-kata Anda sendiri.',
  'growth.ui.intake.marketsHelp': 'Negara atau wilayah. Satu per baris.',
  'growth.ui.intake.localesHelp': 'Bahasa yang akan Anda gunakan untuk mempublikasikan.',
  'growth.ui.intake.objectiveHelp': 'Apa yang Anda inginkan lebih banyak di kuartal berikutnya.',
  'growth.ui.intake.conversionHelp':
    'Tindakan yang sebenarnya bisa Anda ukur. Pendaftaran, demo, pembelian.',
  'growth.ui.intake.proofHelp':
    'Studi kasus, tolok ukur yang Anda jalankan, tangkapan layar yang Anda miliki, izin yang sudah Anda miliki. Satu per baris.',
  'growth.ui.intake.proofNone': 'Saya belum memiliki bukti yang disetujui',
  'growth.ui.intake.proofNoneEffect':
    'Rencana tersebut akan sepenuhnya menghindari hasil pelanggan dan klaim hasil.',
  'growth.ui.intake.channelsHelp': 'Akun tempat Anda menerbitkan.',
  'growth.ui.intake.capacityHelp':
    'Jujurlah. Sebuah rencana yang tidak dapat Anda jalankan bukanlah sebuah rencana.',
  'growth.ui.intake.competitorsHelp': 'Opsional. Satu per baris.',
  'growth.ui.intake.prohibitedClaimsHelp':
    'Klaim yang tidak boleh Anda ajukan, karena alasan hukum atau kebijakan. Satu per baris.',
  'growth.ui.intake.prohibitedTopicsHelp': 'Topik yang harus dihindari. Satu per baris.',
  'growth.ui.intake.submit': 'Tinjau kembali apa yang kami pahami',
  'growth.ui.intake.savedAnnouncement': 'Profil bisnis disimpan.',
  'growth.ui.intake.requiredMissing': 'Isi kolom yang ditandai wajib diisi sebelum melanjutkan.',
  'growth.ui.confirm.factsTitle': 'Fakta yang Anda konfirmasi',
  'growth.ui.confirm.factsHelp': 'Ini dapat digunakan dalam bentuk salinan.',
  'growth.ui.confirm.assumptionsTitle': 'Asumsi yang kami buat',
  'growth.ui.confirm.assumptionsHelp':
    'Ini bukanlah fakta. Mereka membentuk rencana tetapi tidak pernah menjadi klaim dalam sebuah postingan.',
  'growth.ui.confirm.missingTitle': 'Hilang',
  'growth.ui.confirm.missingHelp':
    'Rencana tersebut mengatasi masing-masing hal ini dan menjelaskan hal-hal yang penting.',
  'growth.ui.confirm.confidence.label': 'Keyakinan: {level}',
  'growth.ui.confirm.confidence.low': 'rendah',
  'growth.ui.confirm.confidence.medium': 'sedang',
  'growth.ui.confirm.confidence.high': 'tinggi',
  'growth.ui.confirm.promote': 'Konfirmasikan sebagai fakta',
  'growth.ui.confirm.correct': 'Perbaiki ini',
  'growth.ui.confirm.correctLabel': 'Koreksi Anda',
  'growth.ui.confirm.generate': 'Hasilkan rencana',
  'growth.ui.confirm.announcement': 'Profil bisnis dikonfirmasi.',
  'growth.ui.plan.generatingBody':
    'Ini memerlukan waktu beberapa detik. Anda dapat meninggalkan halaman ini: rencana selesai dengan sendirinya.',
  'growth.ui.plan.stateDraft': 'Draf, tidak disetujui',
  'growth.ui.plan.stateApproved': 'Disetujui',
  'growth.ui.plan.stateSuperseded': 'Digantikan oleh versi yang lebih baru',
  'growth.ui.plan.newVersionNotice':
    'Penyegaran membuat versi {version} dan membiarkan versi yang disetujui tidak tersentuh.',
  'growth.ui.plan.emptyTitle': 'Belum ada rencana',
  'growth.ui.plan.emptyBody':
    'Isi profil bisnis dan kami akan membuat rencana berdasarkan fakta yang Anda konfirmasi.',
  'growth.ui.plan.emptyExample':
    'Sebuah rencana berisi strategi, ringkasan empat minggu, satu kampanye UGC, peluang yang didukung katalog, dan hingga lima alat.',
  'growth.ui.plan.tabsLabel': 'Bagian rencana',
  'growth.ui.plan.modelNote': 'Dihasilkan oleh {model}, prompt {promptVersion}, di {date}.',
  'growth.ui.strategy.snapshotTitle': 'Cuplikan bisnis',
  'growth.ui.strategy.channelPriority': 'Prioritas {rank}',
  'growth.ui.strategy.channelFormats': 'Format asli',
  'growth.ui.strategy.pillarProof': 'Buktikan bahwa pilar ini bersandar',
  'growth.ui.strategy.pillarProofNone':
    'Tidak ada bukti yang disetujui. Jaga agar pilar ini tetap deskriptif.',
  'growth.ui.strategy.cadenceCaption': 'Postingan per minggu berdasarkan saluran',
  'growth.ui.strategy.cadenceColumn.channel': 'Saluran',
  'growth.ui.strategy.cadenceColumn.perWeek': 'Postingan per minggu',
  'growth.ui.strategy.cadenceTotal': 'Jumlah per minggu',
  'growth.ui.strategy.capacityWarning':
    'Irama ini adalah postingan {planned} dalam seminggu terhadap kapasitas yang dinyatakan sebesar {capacity} jam. Kurangi atau naikkan kapasitas di profil.',
  'growth.ui.strategy.measurementBody':
    'Dibandingkan dengan postingan tambahan Anda di saluran dan format yang sama. Tidak ada tolok ukur eksternal yang digunakan, karena tidak ada yang sebanding dengan akun Anda.',
  'growth.ui.strategy.localeAdaptations': 'Catatan bahasa',
  'growth.ui.fourWeek.caption': 'Ringkasan yang diusulkan berdasarkan minggu dan hari',
  'growth.ui.fourWeek.column.date': 'Tanggal',
  'growth.ui.fourWeek.column.channel': 'Saluran',
  'growth.ui.fourWeek.column.pillar': 'Pilar',
  'growth.ui.fourWeek.column.format': 'Format',
  'growth.ui.fourWeek.column.brief': 'Singkat',
  'growth.ui.fourWeek.column.cta': 'Ajakan untuk bertindak',
  'growth.ui.fourWeek.column.measurement': 'Label pengukuran',
  'growth.ui.fourWeek.column.actions': 'Tindakan',
  'growth.ui.fourWeek.approvalRequired': 'Persetujuan diperlukan sebelum dapat dipublikasikan',
  'growth.ui.fourWeek.approvalNotRequired': 'Tidak diperlukan persetujuan untuk akun ini',
  'growth.ui.fourWeek.noCta': 'Tidak ada ajakan untuk bertindak',
  'growth.ui.fourWeek.weekEmpty': 'Tidak ada arahan yang diusulkan untuk minggu ini.',
  'growth.ui.fourWeek.acceptedCount': '{accepted} dari laporan {total} diterima sebagai draf',
  'growth.ui.fourWeek.acceptAnnouncement': 'Draf dibuat dari ringkasan ini.',
  'growth.ui.fourWeek.proposeAnnouncement': 'Proposal kalender ditambahkan untuk {date}.',
  'growth.ui.ugc.promptAngle': 'Sudut {number}',
  'growth.ui.ugc.checklistTitle': 'Hak, persetujuan dan pengungkapan',
  'growth.ui.ugc.checklistHelp':
    'Kerjakan hal ini dengan masing-masing peserta sebelum semuanya dipublikasikan. Persetujuan untuk tampil bukanlah persetujuan untuk beriklan.',
  'growth.ui.ugc.incentiveNone': 'Tidak ada insentif yang ditawarkan',
  'growth.ui.ugc.incentiveDisclosure':
    'Insentif harus diungkapkan pada setiap postingan yang dihasilkan darinya, oleh Anda, dan oleh peserta.',
  'growth.ui.ugc.honesty':
    'Ini merencanakan kampanye yang Anda jalankan dengan orang sungguhan. Relay tidak menemukan pembuat, menghubungi mereka, menulis testimonial, atau membuat konten pelanggan.',
  'growth.ui.opportunities.caption':
    'Peluang terverifikasi dari katalog, diberi peringkat berdasarkan kesesuaian dengan profil Anda',
  'growth.ui.opportunities.column.opportunity': 'Peluang',
  'growth.ui.opportunities.column.type': 'Ketik',
  'growth.ui.opportunities.column.audience': 'Penonton',
  'growth.ui.opportunities.column.fit': 'Mengapa ini cocok',
  'growth.ui.opportunities.column.requirements': 'Persyaratan',
  'growth.ui.opportunities.column.rules': 'Aturan promosi diri',
  'growth.ui.opportunities.column.cost': 'Biaya',
  'growth.ui.opportunities.column.effort': 'Upaya',
  'growth.ui.opportunities.column.verified': 'Terakhir diverifikasi',
  'growth.ui.opportunities.column.actions': 'Tindakan',
  'growth.ui.opportunities.costFree': 'Gratis',
  'growth.ui.opportunities.effort.low': 'Rendah',
  'growth.ui.opportunities.effort.medium': 'Sedang',
  'growth.ui.opportunities.effort.high': 'Tinggi',
  'growth.ui.opportunities.noRequiredAsset': 'Tidak diperlukan aset',
  'growth.ui.opportunities.prepareTitle': 'Siapkan kiriman untuk {name}',
  'growth.ui.opportunities.prepareRules': 'Aturan mereka, dikutip',
  'growth.ui.opportunities.prepareChecklist': 'Apa yang harus dipersiapkan',
  'growth.ui.opportunities.prepareManual':
    'Anda mengirimkannya sendiri di situs mereka. Relay tidak mengisi formulir, membuat akun atau mengirim email kepada siapa pun.',
  'growth.ui.opportunities.pitchTitle': 'Draf promosi',
  'growth.ui.opportunities.pitchHelp':
    'Edit sebelum Anda mengirimkannya. Ini hanya menggunakan fakta yang Anda konfirmasi.',
  'growth.ui.opportunities.submittedOn': 'Dikirim {date}',
  'growth.ui.opportunities.staleTitle': 'Beberapa entri memerlukan verifikasi ulang',
  'growth.ui.opportunities.staleBody':
    '{count, plural, one {# entry is past its review date} other {# entries are past their review date}}. Check the current rules on the site before you rely on them.',
  'growth.ui.opportunities.emptyExample':
    'Baris katalog memuat URL resmi, audiens, aturan pengiriman yang dikutip dari situs, biaya, upaya, dan tanggal terakhir kali seseorang memeriksanya.',
  'growth.ui.tools.shown': '{shown} dari {max} ditampilkan',
  'growth.ui.tools.fewerThanMax':
    'Only {count, plural, one {# tool matches} other {# tools match}} this workflow with a current review. We would rather show fewer than pad the list.',
  'growth.ui.tools.emptyTitle': 'Belum ada alat yang ditinjau yang sesuai dengan alur kerja ini',
  'growth.ui.tools.emptyBody':
    'Setiap entri memerlukan harga yang diperiksa, ketentuan hak yang diperiksa, dan batasan yang disebutkan sebelum muncul di sini.',
  'growth.ui.tools.emptyExample':
    'Sebuah entri menyatakan kegunaan terbaiknya, mengapa sesuai dengan rencana Anda, apa yang tidak dapat dilakukan, keterampilan yang dibutuhkan, bagaimana output kembali ke Relay, dan kapan harga terakhir diperiksa.',
  'growth.ui.tools.openSite': 'Buka situs resmi untuk {name}',
  'growth.ui.tools.stale':
    'Melewati tanggal peninjauannya. Dikecualikan dari rencana yang dihasilkan.',
  'growth.ui.item.explainTitle': 'Mengapa hal ini disarankan',
  'growth.ui.item.explainEvidence': 'Berdasarkan apa hal itu',
  'growth.ui.item.explainNoEvidence':
    'Hal ini berasal dari tujuan dan aturan saluran, bukan dari fakta yang dikonfirmasi tentang bisnis Anda.',
  'growth.ui.item.dismissTitle': 'Tolak saran ini',
  'growth.ui.item.dismissBody':
    'Beritahu kami alasannya. Alasannya disimpan dengan rencana dan membentuk versi berikutnya.',
  'growth.ui.item.dismissReasonLabel': 'Alasan',
  'growth.ui.item.dismissReason.notRelevant': 'Tidak relevan dengan bisnis ini',
  'growth.ui.item.dismissReason.noCapacity': 'Kami tidak memiliki kapasitas',
  'growth.ui.item.dismissReason.wrongAudience': 'Penonton yang salah',
  'growth.ui.item.dismissReason.alreadyDone': 'Kami sudah melakukan ini',
  'growth.ui.item.dismissReason.policy': 'Terhadap kebijakan atau klaim kami',
  'growth.ui.item.dismissReason.other': 'Sesuatu yang lain',
  'growth.ui.item.dismissNote': 'Apa pun yang ingin Anda tambahkan',
  'growth.ui.item.dismissed':
    'Diberhentikan. Itu tetap terlihat sehingga Anda dapat membatalkannya.',
  'growth.ui.item.undoDismiss': 'Urungkan pemberhentian',
  'growth.ui.export.title': 'Ekspor rencana ini',
  'growth.ui.export.formatLabel': 'Format',
  'growth.ui.export.copy': 'Salin ke papan klip',
  'growth.ui.export.download': 'Unduh berkas',
  'growth.ui.export.copied': 'Rencana disalin ke clipboard.',
  'growth.ui.export.schemaNote':
    'Ketiga format tersebut berasal dari satu skema yang divalidasi, versi {version}. Tampilan terstruktur aman untuk kontrol sumber dan tidak mengandung rahasia.',
  'growth.ui.export.previewLabel': 'Ekspor pratinjau',
} as const;
