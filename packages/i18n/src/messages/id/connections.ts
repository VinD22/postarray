/** id beta catalog namespace. */
export const connectionMessages = {
  'connection.title': 'Koneksi',
  'connection.subtitle': 'Akun, Halaman, dan saluran tempat ruang kerja ini dapat dipublikasikan.',
  'connection.add': 'Hubungkan akun',
  'connection.count': '{used, plural, one {# active channel} other {# active channels}} of {limit}',
  'connection.limitReached':
    'Ruang kerja ini menggunakan semua saluran {limit}. Putuskan sambungan satu sebelum menghubungkan yang lain.',
  'connection.account.label': 'Akun',
  'connection.account.type.profile': 'Profil',
  'connection.account.type.page': 'Halaman',
  'connection.account.type.channel': 'Saluran',
  'connection.account.type.group': 'Kelompok',
  'connection.account.type.organization': 'Organisasi',
  'connection.account.type.business': 'Akun bisnis',
  'connection.account.type.creator': 'Akun pencipta',
  'connection.connectedBy': 'Terhubung oleh {name} di {date}',
  'connection.lastPublished': '{relativeTime} yang terakhir diterbitkan',
  'connection.lastPublishedNever': 'Belum ada yang dipublikasikan dari akun ini',
  'connection.lastAnalyticsSync': 'Analisis disinkronkan {relativeTime}',
  'connection.status.healthy': 'Bekerja',
  'connection.status.expiringSoon': 'Kedaluwarsa {relativeTime}',
  'connection.status.expired': 'Akses sudah habis masa berlakunya',
  'connection.status.revoked': 'Akses dicabut',
  'connection.status.paused': 'Dijeda',
  'connection.status.permissionMissing': 'Izin tidak ada',
  'connection.status.reviewPending': 'Menunggu ulasan platform',
  'connection.status.unknown': 'Kesehatan tidak tersedia',
  'connection.token.expiresAt': 'Akses berakhir {date}',
  'connection.token.expiryUnknown': '{provider} tidak memberi tahu kami kapan akses ini berakhir.',
  'connection.permissions.title': 'Izin',
  'connection.permissions.granted': 'Memang benar',
  'connection.permissions.missing': 'Tidak diberikan',
  'connection.permissions.explainBeforeOAuth':
    'Relay akan meminta izin ini kepada {provider}. Anda dapat memutuskan sambungan kapan saja.',
  'connection.permissions.whyNeeded': 'Mengapa hal ini diperlukan',
  'connection.reconnect.title': 'Hubungkan kembali {account}',
  'connection.reconnect.body':
    'Postingan terjadwal untuk akun ini ditangguhkan hingga tersambung kembali. Tidak ada yang hilang.',
  'connection.disconnect.title': 'Putuskan sambungan {account}?',
  'connection.disconnect.body':
    'Postingan terjadwal untuk akun ini tidak akan dipublikasikan. Tanda terima dan analisis yang sudah dikumpulkan tetap berada di ruang kerja ini.',
  'connection.pause.body':
    'Akun yang dijeda menyimpan riwayat dan jadwalnya, namun tidak dipublikasikan hingga Anda melanjutkannya.',
  'connection.incident.invalidToken':
    '{provider} menolak akses tersimpan untuk {account}. Hubungkan kembali untuk memulihkan penerbitan.',
  'connection.incident.permissionLost':
    '{account} tidak lagi memberikan {permission}. Hubungkan kembali dan terima izin itu.',
  'connection.incident.roleLost':
    'Pengguna {provider} Anda tidak lagi memiliki peran di {account}. Mintalah admin Halaman tersebut untuk memulihkannya.',
  'connection.incident.accountTypeInvalid':
    'Instagram membutuhkan akun profesional. Alihkan {account} ke akun bisnis atau kreator, lalu sambungkan kembali.',
  'connection.incident.reviewRestricted':
    '{provider} telah membatasi aplikasi ini sambil menunggu peninjauan. Postingan dari {account} dipublikasikan secara pribadi hingga peninjauan selesai.',
  'connection.group.title': 'Kelompok pelanggan',
  'connection.group.description':
    'Kelompokkan akun berdasarkan klien atau proyek untuk memfilter setiap layar.',
  'connection.group.assign': 'Pindah ke grup',
  'connection.group.none': 'Tidak dikelompokkan',
  'connection.group.moveNote':
    'Memindahkan akun akan menyimpan postingan, tanda terima, dan analitiknya.',
  'connection.oauth.starting': 'Membuka {provider}',
  'connection.oauth.returned': 'Menyelesaikan koneksi',
  'connection.oauth.chooseAccounts': 'Pilih akun mana yang akan dihubungkan',
  'connection.oauth.connectSelected': 'Connect selected accounts',
  'connection.oauth.claimComplete': 'Selected accounts are connected',
  'connection.oauth.accountUnavailable': 'This account cannot be connected',
  'connection.oauth.noEligibleAccounts':
    'Tidak ada akun pada login {provider} ini yang dapat dihubungkan. {reason}',
  'connection.oauth.canceled': 'Koneksi dibatalkan pada {provider}. Tidak ada yang berubah.',
  'connection.oauth.alreadyConnected': '{account} sudah terhubung ke ruang kerja ini.',
  'connection.oauth.connectedToAnotherWorkspace':
    '{account} terhubung ke ruang kerja lain. Putuskan sambungannya di sana terlebih dahulu.',
  'capability.title': 'Apa yang didukung akun ini',
  'capability.matrix.title': 'Kemampuan platform',
  'capability.matrix.subtitle':
    'Dihasilkan dari definisi konektor yang kami pelihara dan ditinjau secara manual.',
  'capability.level.supported': 'Didukung',
  'capability.level.unsupported': 'Tidak ditawarkan oleh platform',
  'capability.level.not_implemented': 'Belum dibangun',
  'capability.level.requires_review': 'Perlu peninjauan platform',
  'capability.level.beta': 'Beta',
  'capability.level.unknown': 'Tidak tersedia',
  'capability.explain.supported': 'Relay dapat melakukan ini untuk akun ini hari ini.',
  'capability.explain.unsupported':
    '{provider} tidak menawarkan ini melalui API resminya, jadi tidak ada alat yang dapat melakukannya dengan aman.',
  'capability.explain.not_implemented':
    '{provider} menawarkan ini, tetapi Relay belum membuatnya. Itu ada di peta jalan konektor.',
  'capability.explain.requires_review':
    '{provider} memberikan ini hanya setelah meninjau aplikasi atau akun. Itu tetap tidak tersedia sampai peninjauan itu berlalu.',
  'capability.explain.beta':
    'Ini berhasil, dengan batasan yang belum selesai kami verifikasi. Periksa hasilnya sebelum Anda mengandalkannya.',
  'capability.explain.unknown':
    'Kami tidak dapat membaca izin saat ini untuk akun ini. Hubungkan kembali untuk menyegarkannya.',
  'capability.lastChecked': 'Diperiksa {relativeTime}',
  'capability.feature.text': 'Postingan teks',
  'capability.feature.image': 'Gambar',
  'capability.feature.carousel': 'Korsel',
  'capability.feature.video': 'Video',
  'capability.feature.document': 'Dokumen',
  'capability.feature.firstComment': 'Komentar pertama yang dijadwalkan',
  'capability.feature.thread': 'Threads',
  'capability.feature.mentions': 'Sebutan asli',
  'capability.feature.destinations': 'Pemilihan tujuan',
  'capability.feature.privacy': 'Kontrol privasi',
  'capability.feature.thumbnail': 'Gambar mini khusus',
  'capability.feature.altText': 'teks alternatif',
  'capability.feature.analytics': 'Analisis',
  'capability.feature.delete': 'Hapus postingan yang dipublikasikan',
  'capability.feature.commentCount': 'Komentar penting',
  'capability.feature.commentReplies': 'Membaca dan membalas komentar',
  'capability.feature.disclosure': 'Pengungkapan otomatisasi',
} as const;
