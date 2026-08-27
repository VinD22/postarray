/** id beta catalog namespace. */
export const webAnalyticsMessages = {
  'analytics.chart.legend': 'Seri yang ditunjukkan dalam bagan ini',
  'analytics.tab.overview': 'Ikhtisar',
  'analytics.tab.experiments': 'Eksperimen',
  'analytics.tab.links': 'Tautan yang dilacak',
  'analytics.tab.label': 'Bagian analisis',
  'analytics.question.baseline': 'Postingan mana yang menyimpang dari baseline Anda?',
  'analytics.question.baselineHelp':
    'Setiap postingan dibandingkan dengan postingan terbaru Anda di akun yang sama dan dalam format yang sama. Tidak ada apa pun di sini yang membandingkan Anda dengan ruang kerja lain atau perusahaan lain.',
  'analytics.question.accounts': 'Akun mana yang perlu diperhatikan?',
  'analytics.question.next': 'Apa yang layak untuk diuji selanjutnya?',
  'analytics.filter.project': 'Proyek',
  'analytics.filter.accounts': 'Akun',
  'analytics.filter.allAccounts': 'Semua akun terhubung',
  'analytics.filter.range': 'Rentang tanggal',
  'analytics.filter.format': 'Format konten',
  'analytics.filter.allFormats': 'Semua format',
  'analytics.filter.comparePrevious': 'Bandingkan dengan periode sebelumnya',
  'analytics.filter.applied':
    '{count, plural, =0 {No filters} one {# filter} other {# filters}} applied. {results, plural, =0 {No posts match} one {# post matches} other {# posts match}}.',
  'analytics.rankMetric.label': 'Beri peringkat postingan berdasarkan',
  'analytics.rankMetric.help':
    'Tidak ada skor gabungan di Post Array. Pilih satu metrik yang definisinya Anda percayai dan tabel akan diurutkan berdasarkan metrik tersebut saja.',
  'analytics.rankMetric.chosen':
    'Diurutkan berdasarkan {metric}, seperti yang dilaporkan oleh masing-masing penyedia akun.',
  'analytics.outcome.awareness': 'Kesadaran',
  'analytics.outcome.awarenessHelp':
    'Berapa kali postingan dikirimkan atau dilihat. Penyedia menghitungnya secara berbeda, sehingga suatu nilai hanya dapat dibandingkan dengan dirinya sendiri seiring waktu.',
  'analytics.outcome.consumption': 'Konsumsi',
  'analytics.outcome.consumptionHelp':
    'Berapa banyak postingan yang benar-benar ditonton atau dibaca orang.',
  'analytics.outcome.interaction': 'Interaksi',
  'analytics.outcome.interactionHelp':
    'Apa yang dilakukan orang-orang di platform: suka, berkomentar, berbagi, dan menyimpan.',
  'analytics.outcome.conversion': 'Konversi',
  'analytics.outcome.conversionHelp':
    'Apa yang dilakukan orang-orang setelah meninggalkan platform. Hanya tautan terlacak yang dapat menjawab ini, dan hanya untuk tautan yang Anda pilih untuk dilacak.',
  'analytics.outcome.separateNote':
    'Keempat kelompok ini dihitung secara terpisah. Menambahkannya bersama-sama akan menghitung orang yang sama lebih dari satu kali.',
  'analytics.table.caption':
    'Postingan dipublikasikan dalam rentang yang dipilih, dan masing-masing postingan dibandingkan dengan baseline terbaru Anda.',
  'analytics.table.post': 'Posting',
  'analytics.table.account': 'Akun',
  'analytics.table.format': 'Format',
  'analytics.table.published': 'Diterbitkan',
  'analytics.table.value': 'Nilai',
  'analytics.table.delta': 'Melawan garis dasar',
  'analytics.table.sample': 'Sampel',
  'analytics.table.sampleSize': 'n = {count}',
  'analytics.table.evidence': 'Bukti',
  'analytics.table.openEvidence': 'Tunjukkan bukti untuk {post}',
  'analytics.table.rowActions': 'Tindakan untuk {post}',
  'analytics.table.openPost': 'Buka metrik postingan',
  'analytics.table.openReceipt': 'Buka tanda terima publikasi',
  'analytics.table.noBaseline': 'Belum ada garis dasar',
  'analytics.table.noBaselineReason':
    'Kurang dari {required} postingan serupa ada di akun ini. Perbandingannya adalah noise, jadi tidak ada yang ditampilkan.',
  'analytics.table.sortBy': 'Urutkan berdasarkan {column}',
  'analytics.table.detailToggle': 'Detail',
  'analytics.delta.above': '{percent} di atas garis dasar',
  'analytics.delta.below': '{percent} di bawah garis dasar',
  'analytics.delta.level': 'Sejalan dengan garis dasar',
  'analytics.delta.unavailable': 'Tidak ada perbandingan',
  'analytics.evidence.title': 'Bagaimana perbandingan ini dibuat',
  'analytics.evidence.baseline':
    'Baseline: the median {metric} of the previous {count, plural, one {# comparable post} other {# comparable posts}} on {account}.',
  'analytics.evidence.comparableBy':
    'Sebanding berarti akun yang sama, format konten yang sama ({format}) dan waktu publikasi dalam periode yang sama.',
  'analytics.evidence.postsUsed': 'Posting yang digunakan untuk baseline',
  'analytics.evidence.excluded':
    '{count, plural, =0 {No posts were excluded} one {# post was excluded} other {# posts were excluded}} because the metric was unavailable for them.',
  'analytics.evidence.smallSample':
    'With {count, plural, one {# post} other {# posts}} in the baseline, a single unusual post moves the median a long way. Treat this as a signal to test again, not as a result.',
  'analytics.evidence.confounders': 'Hal ini tidak diperhitungkan',
  'analytics.evidence.confounder.time': 'Waktu publikasi bervariasi di seluruh postingan dasar.',
  'analytics.evidence.confounder.format':
    'Postingan gambar dan postingan video tidak dapat dibandingkan secara langsung di sini.',
  'analytics.evidence.confounder.followers':
    'Jumlah pengikut di {account} diubah oleh {percent} selama periode ini.',
  'analytics.evidence.confounder.paid':
    'Post Array tidak dapat memastikan apakah postingan ini menerima distribusi berbayar.',
  'analytics.evidence.confounder.provider':
    '{provider} mengubah cara melaporkan {metric} dalam periode ini.',
  'analytics.definition.open': 'Apa yang dimaksud dengan {metric}',
  'analytics.definition.inlineHeading': 'Definisi',
  'analytics.definition.observedAt': 'Mengamati {dateTime}.',
  'analytics.definition.sourceLink': 'Dokumentasi penyedia',
  'analytics.definition.verifiedOn': 'Diperiksa berdasarkan dokumentasi penyedia di {date}.',
  'analytics.definition.panelTitle': 'Definisi metrik dalam tampilan ini',
  'analytics.definition.panelIntro':
    'Setiap nomor di layar ini berasal dari satu bidang penyedia bernama. Definisi di bawah ini juga diulangi di samping setiap nilai, jadi tidak ada hal penting yang hanya ada di tooltip.',
  'analytics.definition.aggregation.sum': 'Dikumpulkan dengan menambahkan setiap observasi.',
  'analytics.definition.aggregation.average': 'Diagregasi sebagai mean.',
  'analytics.definition.aggregation.median': 'Dikumpulkan sebagai median.',
  'analytics.definition.aggregation.last': 'Pengamatan terbaru.',
  'analytics.definition.aggregation.delta': 'Perubahan antara observasi pertama dan terakhir.',
  'analytics.definition.aggregation.none': 'Dilaporkan sebagai observasi tunggal.',
  'analytics.definition.denominator.none': 'Ini adalah hitungan, bukan tarif.',
  'analytics.definition.historyWindow':
    '{provider} keeps {days, plural, one {# day} other {# days}} of history for this field.',
  'analytics.definition.historyWindowNone':
    '{provider} tidak menyatakan batas riwayat untuk bidang ini.',
  'analytics.definition.term.providerField': 'Bidang penyedia',
  'analytics.definition.term.unit': 'Satuan',
  'analytics.definition.term.denominator': 'Penyebut',
  'analytics.definition.term.aggregation': 'Bagaimana itu dikumpulkan',
  'analytics.definition.term.history': 'Riwayat yang disimpan penyedia',
  'analytics.definition.term.definition': 'Maksudnya apa yang dikatakan penyedia',
  'analytics.unit.count': 'Hitungan peristiwa',
  'analytics.unit.seconds': 'Detik',
  'analytics.unit.percent': 'Persentase yang sudah dihitung oleh penyedia',
  'analytics.unit.ratio': 'Rasio Post Array dihitung dari dua bidang penyedia',
  'analytics.unit.currency_minor': 'Sejumlah uang dalam satuan kecil',
  'analytics.denominator.none': 'Ini adalah hitungan, bukan tarif. Ia tidak memiliki penyebut.',
  'analytics.denominator.impressions': 'Dibagi berdasarkan tayangan',
  'analytics.denominator.reach': 'Dibagi berdasarkan jangkauan',
  'analytics.denominator.views': 'Dibagi berdasarkan pandangan',
  'analytics.denominator.followers': 'Dibagi dengan jumlah pengikut pada saat observasi',
  'analytics.denominator.sessions': 'Dibagi berdasarkan sesi',
  'analytics.format.text': 'Teks',
  'analytics.format.image': 'Gambar',
  'analytics.format.carousel': 'Korsel',
  'analytics.format.video': 'Video',
  'analytics.format.short_video': 'Video pendek',
  'analytics.format.long_video': 'Video panjang',
  'analytics.format.document': 'Dokumen',
  'analytics.format.thread': 'Benang',
  'analytics.value.unavailableReason.notImplemented':
    'Post Array belum membuat pemetaan untuk metrik ini di {provider}.',
  'analytics.value.estimated': 'Diperkirakan',
  'analytics.value.estimatedMethod': 'Metode: {method}.',
  'analytics.freshness.title': 'Dari mana angka-angka ini berasal',
  'analytics.freshness.intro':
    'Penyedia mengumpulkan jadwal mereka sendiri. Tidak ada apa pun di layar ini yang ditayangkan secara langsung.',
  'analytics.freshness.accountRow': '{account} di {provider}',
  'analytics.freshness.never': 'Tidak pernah disinkronkan',
  'analytics.freshness.nextAttempt': 'Upaya sinkronisasi berikutnya {relativeTime}.',
  'analytics.freshness.openStatus': 'Status penyedia',
  'analytics.accounts.title': 'Akun yang perlu diperhatikan',
  'analytics.accounts.empty':
    'Setiap akun yang terhubung mengembalikan data pada periode ini. Tidak ada yang membutuhkanmu di sini.',
  'analytics.accounts.reason.permission': 'Izin analitik tidak diberikan saat akun ini terhubung.',
  'analytics.accounts.reason.expired':
    'Akses sudah habis masa berlakunya, jadi tidak ada metrik yang dikumpulkan sejak {date}.',
  'analytics.accounts.reason.stale': 'Sinkronisasi terakhir yang berhasil adalah {relativeTime}.',
  'analytics.accounts.reason.syncFailing':
    '{count, plural, one {# sync attempt} other {# sync attempts}} failed in a row. The reason recorded was {reason}.',
  'analytics.accounts.reason.noPosts':
    'Tidak ada yang dipublikasikan ke akun ini dalam rentang yang dipilih.',
  'analytics.observations.title': 'Pengamatan',
  'analytics.observations.intro':
    'Ini adalah deskripsi dari apa yang ditunjukkan oleh angka-angka tersebut. Itu bukan prediksi dan tidak menentukan penyebabnya.',
  'analytics.observations.empty':
    'Sejarah yang diterbitkan belum cukup untuk menggambarkan suatu pola. Publikasikan beberapa postingan lagi pada akun dan format yang sama.',
  'analytics.observations.citedPosts': 'Berdasarkan',
  'analytics.observations.citedPeriod': 'Periode: {start} hingga {end}.',
  'analytics.observations.nextTestTitle': 'Tes yang bisa Anda jalankan selanjutnya',
  'analytics.observations.nextTestBody':
    'Publish {count, plural, one {# more post} other {# more posts}} on {account} changing only {variable}, then compare the same metric. Tag it as an experiment before publishing so the comparison is planned rather than found afterwards.',
  'analytics.observations.tagFirst': 'Tandai eksperimen',
  'analytics.chart.title': '{metric} seiring berjalannya waktu',
  'analytics.chart.summary':
    '{metric} on {account}, {count, plural, one {# point} other {# points}} from {start} to {end}.',
  'analytics.chart.showTable': 'Tampilkan sebagai tabel',
  'analytics.chart.hideTable': 'Sembunyikan mejanya',
  'analytics.chart.tableCaption': 'Seri yang sama dengan tabel.',
  'analytics.chart.columnPeriod': 'Titik',
  'analytics.chart.columnValue': 'Nilai',
  'analytics.chart.gapLabel': 'Tidak ada data yang dikumpulkan',
  'analytics.chart.gapExplained':
    'Garis putus-putus berarti tidak ada observasi yang dikumpulkan pada periode tersebut. Bukan berarti nol.',
  'analytics.chart.annotation': 'Anotasi',
  'analytics.chart.pointLabel': '{period}: {value}',
  'analytics.chart.empty': 'Tidak ada pengamatan yang dikumpulkan dalam rentang ini.',
  'analytics.experiment.new': 'Rencanakan eksperimen',
  'analytics.experiment.empty':
    'Belum ada eksperimen. Eksperimen adalah perbandingan yang Anda putuskan sebelum dipublikasikan, yang merupakan satu-satunya perbandingan yang dapat menjawab pertanyaan.',
  'analytics.experiment.emptyExample':
    'Contoh: publikasikan pengumuman yang sama di X dua kali, sekali dengan link di postingan dan sekali dengan link di komentar pertama, lalu bandingkan klik link selama 72 jam.',
  'analytics.experiment.name': 'Apa yang kamu uji',
  'analytics.experiment.namePlaceholder': 'Komentar pertama pada 5 menit versus 30 menit',
  'analytics.experiment.hypothesisPlaceholder':
    'Penundaan lebih singkat sebelum komentar pertama mendapat lebih banyak balasan di X.',
  'analytics.experiment.variantLabel': 'Varian {index}',
  'analytics.experiment.variantDescription': 'Apa yang berbeda pada varian ini',
  'analytics.experiment.addVariant': 'Tambahkan varian',
  'analytics.experiment.removeVariant': 'Hapus varian {index}',
  'analytics.experiment.accounts': 'Termasuk akun',
  'analytics.experiment.windowHelp':
    'Metrik terus bergerak setelah postingan ditayangkan. Perbaiki jendelanya sekarang agar perbandingan tidak dilakukan pada saat yang kebetulan sesuai dengan satu varian.',
  'analytics.experiment.windowDays':
    'Measure for {count, plural, one {# day} other {# days}} after each post publishes',
  'analytics.experiment.minSample': 'Minimal postingan per varian',
  'analytics.experiment.minSampleHelp':
    'Di bawah hitungan ini, hasilnya ditampilkan sebagai tidak meyakinkan dan bukannya sebagai pemenang.',
  'analytics.experiment.status.planned': 'Direncanakan',
  'analytics.experiment.status.collecting':
    'Mengumpulkan. {published} dari postingan {target} diterbitkan.',
  'analytics.experiment.status.inconclusive': 'Lengkap, tidak ada perbedaan yang jelas',
  'analytics.experiment.result.difference':
    '{variant} mencatat {percent} lebih banyak {metric} dibandingkan {otherVariant}.',
  'analytics.experiment.result.noDifference':
    'Kedua varian berada dalam {percent} satu sama lain di {metric}. Itu berada dalam kisaran yang bervariasi dari postingan ini.',
  'analytics.experiment.result.association':
    'This is an association measured on {count, plural, one {# post} other {# posts}}. It does not prove that the change caused the difference.',
  'analytics.experiment.result.unavailable':
    '{metric} was unavailable for {count, plural, one {# post} other {# posts}} in this experiment, so those posts are excluded rather than counted as zero.',
  'analytics.experiment.result.title': 'Hasil',
  'analytics.experiment.completeNow': 'Tutup eksperimen ini',
  'analytics.experiment.completeConfirm':
    'Penutupan menghentikan pengumpulan. Postingannya tetap dipublikasikan dan nomornya tetap tersedia.',
  'analytics.experiment.postsTitle': 'Postingan dalam eksperimen ini',
  'analytics.state.loading': 'Memuat analitik untuk akun yang dipilih',
  'analytics.state.loadingProvider': 'Mengambil analitik {provider}',
  'analytics.state.empty': 'Tidak ada yang dipublikasikan dalam rentang ini',
  'analytics.state.emptyBody':
    'Analytics mendeskripsikan postingan yang sudah keluar. Publikasikan sesuatu, atau perluas rentang tanggal.',
  'analytics.state.emptyExample':
    'Setelah postingan ditayangkan, Anda akan melihat baris seperti: X @acme, "Luncurkan rangkaian pesan", 12.400 tayangan, 58 persen di atas median 10 tayangan sebelumnya.',
  'analytics.state.errorTitle': 'Analytics tidak dapat dimuat',
  'analytics.state.errorBody':
    'Tidak ada nomor yang ditampilkan selain nomor yang ditebak. Postingan dan tanda terima Anda tidak terpengaruh.',
  'analytics.state.partialTitle': '{loaded} dari akun {total} mengembalikan data',
  'analytics.state.partialBody':
    'Akun-akun yang menjawab ditampilkan dengan kesegarannya masing-masing. Sisanya dicantumkan dengan alasan mereka tidak melakukannya.',
  'analytics.state.partialSucceeded': 'Data yang dikembalikan',
  'analytics.state.partialFailed': 'Tidak mengembalikan data',
  'analytics.state.offlineTitle': 'Anda sedang luring',
  'analytics.state.offlineBody':
    'Gambar di bawah ini dimuat sebelum sambungan terputus, sehingga lebih tua dari yang tertera pada label kesegaran.',
  'analytics.state.permissionTitle': 'Anda tidak dapat melihat analitik di ruang kerja ini',
  'analytics.state.permissionBody':
    'Analytics memerlukan peran analis atau lebih tinggi. Pemilik atau admin ruang kerja ini dapat memberikannya.',
  'analytics.state.rateLimitTitle': '{provider} adalah permintaan analitik yang membatasi laju',
  'analytics.state.rateLimitCause':
    'Akun telah menggunakan bagiannya dari kuota penyedia untuk jendela ini. Post Array tidak mencoba lagi lebih keras, karena hal itu akan menunda penerbitan.',
  'analytics.state.rateLimitAlternative':
    'Persempit rentang tanggal atau filter akun, yang meminta lebih sedikit kepada penyedia.',
  'analytics.state.rateLimitReset': 'Permintaan dilanjutkan',
  'analytics.state.reference': 'Referensi diagnostik',
  'analytics.links.new': 'Buat tautan terlacak',
  'analytics.links.empty': 'Belum ada tautan terlacak',
  'analytics.links.emptyBody':
    'Tautan terlacak adalah URL pendek yang dialihkan Post Array, sehingga Anda dapat melihat klik bahkan ketika platform tidak melaporkan apa pun. Tujuan awal tidak pernah berubah tanpa entri audit.',
  'analytics.links.emptyExample':
    'Contoh: relay.to/a7Kq2 dialihkan ke acme.com/blog/launch dengan kampanye q3-launch.',
  'analytics.links.table.caption':
    'Tautan yang dilacak di ruang kerja ini dan jumlah klik pihak pertamanya.',
  'analytics.links.campaign': 'Kampanye',
  'analytics.links.created': 'Dibuat',
  'analytics.links.usedIn':
    '{count, plural, =0 {Not used in a post yet} one {Used in # post} other {Used in # posts}}',
  'analytics.links.state.active': 'Aktif',
  'analytics.links.state.expired': 'Kadaluwarsa {date}',
  'analytics.links.state.disabled': 'Dinonaktifkan',
  'analytics.links.state.disabledAt':
    'Dinonaktifkan pada {date}. URL pendek ini tidak lagi mengalihkan.',
  'analytics.links.state.blocked': 'Diblokir demi keamanan',
  'analytics.links.state.blockedBody':
    'Pengalihan ini tidak tersedia karena tujuannya gagal dalam pemeriksaan keamanan. Ubah tujuan atau hubungi dukungan.',
  'analytics.links.state.disabledReason':
    'Dinonaktifkan oleh {actor} di {date}. Alasan dicatat: {reason}.',
  'analytics.links.detailTitle': 'Tautan terlacak {slug}',
  'analytics.links.exactRedirect': 'Pengalihan yang tepat',
  'analytics.links.exactRedirectHelp':
    'Inilah tujuan yang dijangkau pengunjung saat ini, termasuk setiap parameter UTM, ditampilkan secara lengkap dan tidak dipersingkat.',
  'analytics.links.editDestination': 'Ubah tujuan',
  'analytics.links.editDestinationWarning':
    'Mengubah tujuan akan memengaruhi setiap tempat tautan ini dipublikasikan. Laporan untuk periode sebelum perubahan menyimpan tujuan yang aktif pada saat itu.',
  'analytics.links.editDestinationAudit':
    'Perubahan tersebut dicatat dalam log audit dengan nama Anda, tujuan lama dan yang baru.',
  'analytics.links.destinationHistory': 'Sejarah tujuan',
  'analytics.links.destinationHistoryRow': '{destination}, aktif dari {start} hingga {end}',
  'analytics.links.destinationHistoryCurrent': '{destination}, aktif sejak {start}',
  'analytics.links.domainLabel': 'Domain pendek',
  'analytics.links.domainDefault': 'Post Array domain bawaan',
  'analytics.links.domainVerified': 'Diverifikasi oleh DNS di {date}',
  'analytics.links.domainPending': 'Menunggu catatan DNS',
  'analytics.links.domainPendingHelp':
    'Tambahkan record TXT di bawah ini pada {domain}, lalu periksa kembali. Hingga diverifikasi, domain ini tidak dapat dipilih untuk tautan baru.',
  'analytics.links.domainFailed': 'Catatan DNS tidak cocok di {date}',
  'analytics.links.domainCheck': 'Periksa DNS lagi',
  'analytics.links.expiry': 'Kedaluwarsa',
  'analytics.links.expiryNone': 'Tidak ada kadaluarsa yang ditetapkan',
  'analytics.links.expiryHelp':
    'Setelah masa berlakunya habis, tautan tersebut mengembalikan halaman biasa yang menyatakan bahwa tautan tersebut telah berakhir. Hal ini tidak pernah secara diam-diam diarahkan ke tempat lain.',
  'analytics.links.disable': 'Nonaktifkan tautan ini sekarang',
  'analytics.links.disableTitle': 'Nonaktifkan {slug}?',
  'analytics.links.disableBody':
    'Pengunjung membuka halaman yang mengatakan bahwa link tersebut tidak lagi tersedia. Postingan yang dipublikasikan masih berisi URL pendek, sehingga dapat dilihat oleh siapa saja yang mengklik.',
  'analytics.links.disableReason': 'Alasan untuk menonaktifkan',
  'analytics.links.enable': 'Aktifkan kembali tautan ini',
  'analytics.links.abuseTitle': 'Laporkan penyalahgunaan tautan ini',
  'analytics.links.abuseBody':
    'Jika URL pendek ini digunakan untuk sesuatu yang tidak Anda inginkan, laporkan dan pengalihan akan ditangguhkan sementara URL tersebut ditinjau.',
  'analytics.links.abuseAction': 'Laporkan tautan ini',
  'analytics.links.measurementLabel': 'Pengukuran pengalihan pihak pertama',
  'analytics.links.measurementExplained':
    'Post Array menghitung permintaan ketika layanan pengalihan diminta untuk URL ini. Klik yang dihapus duplikatnya akan menghapus permintaan berulang dari pengunjung yang sama di dalam jendela pendek, dan permintaan yang cocok dengan pola perayap yang diketahui akan dikecualikan, bukan dihapus.',
  'analytics.links.botsNote':
    '{count, plural, one {# request} other {# requests}} were classified as automated and are excluded from the deduplicated count.',
  'analytics.links.series.title': 'Permintaan dan penghapusan duplikat dari waktu ke waktu',
  'analytics.links.series.requests': 'Jumlah permintaan',
  'analytics.links.series.clicks': 'Klik yang dihapus duplikatnya',
  'analytics.links.breakdownTitle': 'Dari mana klik itu berasal',
  'analytics.links.breakdown.share': '{percent} dari klik yang dihapus duplikatnya',
  'analytics.links.referrer.direct': 'Tidak ada perujuk yang dikirim',
  'analytics.links.referrer.social': 'Platform sosial',
  'analytics.links.referrer.search': 'Mesin pencari',
  'analytics.links.referrer.email': 'klien email',
  'analytics.links.referrer.other': 'Situs web lainnya',
  'analytics.links.device.mobile': 'Seluler',
  'analytics.links.device.desktop': 'Desktop',
  'analytics.links.device.tablet': 'tablet',
  'analytics.links.device.unknown': 'Tidak ditentukan',
  'analytics.links.countryUnknown': 'Negara tidak ditentukan',
  'analytics.links.lastEventLabel': 'Klik terakhir',
  'analytics.links.noEvents': 'Belum ada klik yang tercatat',
  'analytics.links.noEventsBody':
    'Tautan ini belum diminta sejak dibuat. Itu benar-benar nol, diukur dengan layanan pengalihan kami sendiri.',
  'analytics.links.compareWarning':
    '{provider} melaporkan klik tautan {providerValue} untuk posting ini. Post Array mencatat klik yang dihapus duplikatnya {relayValue}. Keduanya menghitung peristiwa yang berbeda dan tidak ada yang menggantikan yang lain.',
  'analytics.links.errorTitle': 'Statistik tautan tidak dapat dimuat',
  'analytics.links.errorBody':
    'Layanan redirect masih berfungsi sehingga link tetap mengarahkan pengunjung ke tujuannya. Hanya pelaporan yang terpengaruh.',
  'analytics.links.createDestination': 'URL Tujuan',
  'analytics.links.createDestinationHelp':
    'Harus berupa alamat https publik. Alamat jaringan pribadi dan rantai pengalihan ditolak oleh layanan pengalihan.',
  'analytics.links.createCampaign': 'Nama kampanye',
  'analytics.links.createSlug': 'Akhiran khusus',
  'analytics.links.createSlugHelp': 'Biarkan ini kosong dan Post Array menghasilkan akhir acak pendek.',
  'analytics.links.createUtm': 'Parameter UTM',
  'analytics.links.blockedScheme': 'Hanya tujuan https yang diterima.',
  'analytics.links.blockedPrivate':
    'Alamat tersebut berada di jaringan pribadi, sehingga layanan pengalihan tidak akan menerimanya.',
  'automation.tab.rules': 'Aturan',
  'automation.tab.feeds': 'Umpan RSS',
  'automation.tab.label': 'Bagian otomatisasi',
  'automation.rules.table.caption': 'Aturan otomatisasi di ruang kerja ini.',
  'automation.rules.table.rule': 'Aturan',
  'automation.rules.table.state': 'Negara',
  'automation.rules.table.accounts': 'Akun',
  'automation.rules.table.lastRun': 'Lari terakhir',
  'automation.rules.table.nextCheck': 'Periksa selanjutnya',
  'automation.rules.neverRun': 'Belum dijalankan',
  'automation.rules.emptyExample':
    'Contoh: ketika item baru muncul di feed blog Acme, jika bahasanya Inggris, buat draft dari template pengumuman Blog dan minta persetujuan.',
  'automation.rules.summaryAccounts':
    '{count, plural, =0 {No accounts selected} one {# account} other {# accounts}}',
  'automation.rules.openRule': 'Buka {name}',
  'automation.rules.duplicateRule': 'Duplikat {name}',
  'automation.rules.deleteTitle': 'Hapus {name}?',
  'automation.rules.deleteBody':
    'Aturan segera dihentikan dan riwayat eksekusinya disimpan untuk log audit. Postingan yang sudah dibuat tidak terpengaruh.',
  'automation.trigger.commentFailed': 'komentar terjadwal atau item rangkaian pesan gagal',
  'automation.condition.timeWindow': 'waktu antara {start} dan {end} di {timeZone}',
  'automation.condition.domainPresent': 'tautan teks ke {domain}',
  'automation.condition.hashtagPresent': 'teks tersebut berisi hashtag {hashtag}',
  'automation.condition.providerCapability':
    'akun tersebut sebenarnya dapat melakukan {capability}',
  'automation.condition.planStatus': 'langganannya aktif',
  'automation.action.continueSequence':
    'lanjutkan thread atau urutan komentar yang sudah disiapkan',
  'automation.action.notifyEmail': 'kirim email ke {target}',
  'automation.action.notifyWebhook': 'kirim webhook ke {target}',
  'automation.action.pauseConnection': 'jeda akun yang terpengaruh',
  'automation.action.quotePost': 'mengutip postingan sumber satu kali',
  'automation.action.followUpComment':
    'tambahkan komentar yang sudah disiapkan pada postingan sumber',
  'automation.param.feed': 'Pakan',
  'automation.param.template': 'Templat',
  'automation.param.signature': 'Tanda tangan',
  'automation.param.disclosure': 'Pengungkapan',
  'automation.param.locale': 'Bahasa',
  'automation.param.project': 'Proyek',
  'automation.param.campaign': 'Kampanye',
  'automation.param.account': 'Akun',
  'automation.param.platform': 'Peron',
  'automation.param.contentType': 'Jenis konten',
  'automation.param.keyword': 'Kata kunci',
  'automation.param.hashtag': 'Tagar',
  'automation.param.domain': 'Domain',
  'automation.param.capability': 'Kemampuan',
  'automation.param.timeZone': 'Zona waktu',
  'automation.param.startTime': 'Dari',
  'automation.param.endTime': 'Untuk',
  'automation.param.duration': 'Durasi',
  'automation.param.metric': 'Metrik',
  'automation.param.value': 'Nilai',
  'automation.param.target': 'Kirim ke',
  'automation.param.time': 'Waktu',
  'automation.param.cadence': 'Seberapa sering',
  'automation.param.notSet': 'tidak disetel',
  'automation.editor.name': 'Nama aturan',
  'automation.editor.namePlaceholder': 'Blog ke sosial',
  'automation.editor.when': 'Kapan',
  'automation.editor.if': 'Jika',
  'automation.editor.then': 'Lalu',
  'automation.editor.after': 'Setelah',
  'automation.editor.until': 'Sampai',
  'automation.editor.sentenceLabel': 'Kalimat aturan',
  'automation.editor.readBack':
    'Baca kembali kalimat tersebut sebelum Anda menyalakannya. Itu adalah keseluruhan aturannya.',
  'automation.editor.chooseTrigger': 'Pilih apa yang memulai aturan ini',
  'automation.editor.addCondition': 'Tambahkan kondisi',
  'automation.editor.addAction': 'Tambahkan tindakan',
  'automation.editor.removeCondition': 'Hapus kondisi {label}',
  'automation.editor.removeAction': 'Hapus tindakan {label}',
  'automation.editor.moveActionUp': 'Pindahkan {label} tadi',
  'automation.editor.moveActionDown': 'Pindahkan {label} nanti',
  'automation.editor.actionOrder': 'Tindakan dijalankan dalam urutan ini, dari atas ke bawah.',
  'automation.editor.noConditions': 'Tidak ada syarat. Aturan ini berjalan setiap kali dipicu.',
  'automation.editor.noActions': 'Belum ada tindakan. Aturan tanpa tindakan tidak dapat disimpan.',
  'automation.editor.delayNone': 'tidak ada penundaan',
  'automation.editor.delayLabel': 'Penundaan sebelum tindakan dijalankan',
  'automation.editor.endLabel': 'Ketika aturan ini berhenti',
  'automation.editor.end.manual': 'Saya mematikannya',
  'automation.editor.end.date': 'tanggal yang saya pilih',
  'automation.editor.end.count': 'it has run {count, plural, one {# time} other {# times}}',
  'automation.editor.end.dateValue': 'Berhenti',
  'automation.editor.end.countValue': 'Berhenti setelah berlari sebanyak ini',
  'automation.editor.parameterFor': 'Pengaturan untuk {label}',
  'automation.editor.saveDraft': 'Simpan sebagai draf',
  'automation.editor.savedAt': '{time} yang disimpan',
  'automation.editor.unsaved': 'Perubahan yang belum disimpan',
  'automation.editor.view.sentence': 'Kalimat',
  'automation.editor.view.structured': 'Terstruktur',
  'automation.editor.view.api': 'Representasi API',
  'automation.editor.view.label': 'Tampilan penyunting',
  'automation.editor.apiHelp':
    'Inilah yang dikirimkan oleh REST API, CLI, dan server MCP. Mengeditnya di sini dan beralih kembali ke kalimat akan mempertahankan setiap bidang.',
  'automation.editor.apiInvalid':
    'Ini bukan aturan JSON yang valid, jadi tidak diterapkan: {reason}',
  'automation.editor.apiApply': 'Terapkan JSON ini',
  'automation.editor.structuredHelp':
    'Aturan yang sama seperti bidang. Gunakan ini ketika suatu aturan memiliki banyak kondisi dan kalimatnya menjadi panjang.',
  'automation.editor.error.noAction': 'Tambahkan setidaknya satu tindakan sebelum menyimpan.',
  'automation.editor.error.noTrigger': 'Pilih pemicu sebelum menyimpan.',
  'automation.editor.error.noAccounts':
    'Pilih setidaknya satu akun yang dapat ditindaklanjuti oleh aturan ini.',
  'automation.editor.error.missingParameter': '{label} membutuhkan nilai.',
  'automation.editor.error.summary':
    '{count, plural, one {# thing needs your attention} other {# things need your attention}} before this rule can be saved.',
  'automation.picker.triggerTitle': 'Apa yang memulai aturan ini',
  'automation.picker.conditionTitle': 'Tambahkan kondisi',
  'automation.picker.actionTitle': 'Tambahkan tindakan',
  'automation.picker.search': 'Filter daftar ini',
  'automation.picker.noResults':
    'Tidak ada satu pun dalam daftar ini yang cocok dengan apa yang Anda ketik.',
  'automation.picker.groupContent': 'Konten',
  'automation.picker.groupPublishing': 'Penerbitan',
  'automation.picker.groupNotify': 'Orang dan sistem',
  'automation.picker.groupControl': 'Kontrol aturan',
  'automation.picker.groupSchedule': 'Waktu',
  'automation.picker.groupExternal': 'Peristiwa eksternal',
  'automation.picker.groupMeasurement': 'Pengukuran',
  'automation.picker.hiddenForProvider':
    '{count, plural, one {# action is} other {# actions are}} not listed because the selected accounts cannot perform them.',
  'automation.picker.hiddenDetail': '{action} tidak tersedia untuk {provider}. {reason}',
  'automation.picker.consequential': 'Menciptakan sesuatu pada platform',
  'automation.picker.internalOnly': 'Tetap di dalam Post Array',
  'automation.accounts.label': 'Akun yang dapat ditindaklanjuti oleh aturan ini',
  'automation.accounts.help':
    'Sebuah aturan tidak akan pernah bisa menyentuh akun yang tidak tercantum di sini, apa pun ketentuannya.',
  'automation.accounts.none': 'Belum ada akun yang dipilih',
  'automation.threshold.title': 'Aturan pengukuran untuk pemicu ini',
  'automation.threshold.intro':
    'Aturan yang bereaksi terhadap suatu bilangan perlu mengetahui bilangan yang mana, diukur pada periode berapa, dan seberapa sering bilangan tersebut dapat bertindak.',
  'automation.threshold.metric': 'Metrik yang harus diperhatikan',
  'automation.threshold.value': 'Nilai ambang batas',
  'automation.threshold.window': 'Jendela pengukuran',
  'automation.threshold.windowHelp':
    'Dihitung sejak postingan sumber dipublikasikan. Di luar jendela ini, aturan berhenti mengawasi postingan.',
  'automation.threshold.expiry': 'Berhenti menonton postingan setelahnya',
  'automation.threshold.cooldown': 'Cooldown antar eksekusi',
  'automation.threshold.cooldownHelp':
    'Waktu terpendek yang diperbolehkan antara dua proses untuk postingan sumber yang sama.',
  'automation.threshold.maxPerPost': 'Eksekusi maksimum per postingan sumber',
  'automation.threshold.defaultsTitle': 'Default yang tetap aktif kecuali Anda mengubahnya',
  'automation.threshold.defaultOncePerPost': 'Jalankan sekali per posting sumber.',
  'automation.threshold.defaultStale':
    'Jangan jalankan jika metrik tidak tersedia atau kedaluwarsa. Batas kesegaran yang digunakan adalah {duration}.',
  'automation.threshold.staleLimit': 'Perlakukan metrik sebagai basi setelahnya',
  'automation.threshold.providerNote':
    '{provider} melaporkan {metric} tentang penundaan, jadi aturan ini hanya dapat berlaku setelah penyedia memublikasikan nomor tersebut.',
  'automation.crossAccount.title': 'Tindak lanjut dari akun lain',
  'automation.crossAccount.off': 'Mati. Aturan ini hanya berlaku pada akun sumber.',
  'automation.crossAccount.enable': 'Izinkan tindak lanjut dari akun lain',
  'automation.crossAccount.body':
    'Kedua akun harus terhubung ke ruang kerja ini dan keduanya harus diberi nama di sini. Tindak lanjutnya adalah postingan yang telah disiapkan yang Anda tulis sebelumnya, dan melalui kebijakan persetujuan yang sama seperti postingan lainnya.',
  'automation.crossAccount.sourceAccount': 'Akun sumber',
  'automation.crossAccount.followUpAccount': 'Akun yang mempublikasikan tindak lanjutnya',
  'automation.crossAccount.preauthorize':
    'Saya mengonfirmasi bahwa ruang kerja ini mengontrol {sourceAccount} dan {followUpAccount}, dan tindak lanjutnya tidak disajikan sebagai dukungan independen.',
  'automation.crossAccount.preauthorizeRequired':
    'Konfirmasikan praotorisasi sebelum aturan ini dapat disimpan.',
  'automation.crossAccount.duplicateCheck':
    'Pemeriksaan duplikat dan irama lintas akun dijalankan sebelum tindak lanjut, dan dilewati daripada ditunda jika akan mengulangi postingan sumber.',
  'automation.preflight.intro':
    'Segala sesuatu yang dapat dilakukan oleh aturan ini, sebelum ia dapat melakukan apa pun.',
  'automation.preflight.accountsLabel': 'Akun yang dapat ditindaklanjuti',
  'automation.preflight.maxActionsLabel': 'Sebagian besar tindakan eksternal per proses',
  'automation.preflight.maxActionsPeriod':
    'At most {count, plural, one {# external action} other {# external actions}} in {period}.',
  'automation.preflight.approvalLabel': 'Persetujuan',
  'automation.preflight.approvalNone':
    'Tidak ada tindakan dalam aturan ini yang menghasilkan apa pun di platform, jadi tidak ada persetujuan yang berlaku.',
  'automation.preflight.providerLabel': 'Pembatasan penyedia',
  'automation.preflight.providerNone':
    'Tidak ada satu pun yang berlaku untuk tindakan dalam aturan ini.',
  'automation.preflight.costLabel': 'Perkiraan biaya terukur',
  'automation.preflight.costUnknown':
    'Biaya tidak dapat diperkirakan untuk tindakan ini sampai harga penyedia diketahui.',
  'automation.preflight.costMethod':
    'Perkiraan dari daftar harga penyedia di {date}. Tanda terima mencatat apa yang sebenarnya dibebankan.',
  'automation.preflight.cadenceLabel': 'Irama dan duplikat',
  'automation.preflight.cadenceBody':
    'Pemeriksaan duplikat dan irama dijalankan sebelum setiap tindakan. Tindakan yang melebihi anggaran irama untuk sebuah akun dilewati dan dicatat, bukan dimasukkan dalam antrean.',
  'automation.preflight.failureLabel': 'Jika proses gagal',
  'automation.preflight.failure.pauseAfter':
    'The rule pauses after {count, plural, one {# consecutive failure} other {# consecutive failures}} and files an action item.',
  'automation.preflight.failure.continue':
    'Aturan ini terus berjalan dan setiap kegagalan dicatat dalam log eksekusi.',
  'automation.preflight.exampleLabel': 'Contoh dijalankan',
  'automation.preflight.exampleIntro':
    'Dengan menggunakan peristiwa terbaru, pemicu ini akan cocok.',
  'automation.preflight.exampleNone':
    'Belum ada peristiwa yang cocok yang terjadi, jadi belum ada contoh yang dapat ditampilkan. Jalankan acara pengujian sebagai gantinya.',
  'automation.preflight.activate': 'Aktifkan aturan ini',
  'automation.preflight.activateConfirmTitle': 'Aktifkan {name}?',
  'automation.preflight.activateConfirmBody':
    'Mulai sekarang, aturan ini berlaku tanpa diminta terlebih dahulu, dalam batasan yang tercantum di atas.',
  'automation.preflight.blocked':
    'This rule cannot be turned on yet. {count, plural, one {# item} other {# items}} above needs a decision.',
  'automation.test.title': 'Acara uji',
  'automation.test.body':
    'Uji coba mengevaluasi keseluruhan kalimat dan menunjukkan apa yang akan dilakukannya. Ia tidak pernah menerbitkan, tidak pernah memposting komentar, dan tidak pernah mengirimkan webhook ke titik akhir yang sebenarnya.',
  'automation.test.useLastEvent': 'Gunakan peristiwa pencocokan terbaru',
  'automation.test.usePayload': 'Tempelkan payload acara',
  'automation.test.run': 'Jalankan tes',
  'automation.test.running': 'Menjalankan tes',
  'automation.test.resultTitle': 'Apa yang dilakukan tes tersebut',
  'automation.test.conditionPassed': '{condition} berlalu',
  'automation.test.conditionFailed': '{condition} tidak lolos, jadi aturan berhenti di sini',
  'automation.test.actionSimulated': '{action} akan berjalan',
  'automation.test.actionSkipped': '{action} akan dilewati: {reason}',
  'automation.test.noExternalEffect': 'Tidak ada yang tersisa Post Array selama pengujian ini.',
  'automation.test.failed': 'Tes tidak dapat diselesaikan: {reason}',
  'automation.runs.table.caption': 'Aturan ini baru saja dijalankan.',
  'automation.runs.startedAt': 'Dimulai',
  'automation.runs.outcome.label': 'Hasil',
  'automation.runs.actionsTaken': 'Tindakan',
  'automation.runs.trigger': 'Dipicu oleh',
  'automation.runs.outcome.completed': 'Selesai',
  'automation.runs.outcome.skipped': 'Dilewati',
  'automation.runs.outcome.failed': 'Gagal',
  'automation.runs.outcome.testMode': 'Modus uji',
  'automation.runs.actionCount':
    '{count, plural, =0 {No external action} one {# external action} other {# external actions}}',
  'automation.runs.skippedReason': 'Dilewati karena {reason}',
  'automation.runs.openDetail': 'Buka proses dari {time}',
  'automation.runs.createdItems': 'Dibuat',
  'automation.versions.caption': 'Setiap versi aturan ini yang disimpan.',
  'automation.versions.current': 'Saat ini',
  'automation.versions.savedBy': 'Disimpan oleh {actor} di {date}',
  'automation.versions.compare': 'Bandingkan dengan versi saat ini',
  'automation.versions.restore': 'Pulihkan versi ini',
  'automation.versions.restoreConfirm':
    'Memulihkan membuat versi baru. Tidak ada yang ditimpa dan aturan tetap dalam kondisi saat ini hingga Anda mengaktifkannya.',
  'automation.versions.diffTitle': 'Versi {from} dibandingkan dengan versi {to}',
  'automation.kill.title': 'Hentikan {name} sekarang',
  'automation.kill.body':
    'Aturan tersebut segera berhenti, di tengah-tengah lari jika hal tersebut terjadi. Apa pun yang sudah dikirim ke platform tetap dipublikasikan, karena postingan eksternal tidak pernah dibatalkan.',
  'automation.kill.confirmPhrase': 'BERHENTI',
  'automation.kill.confirmLabel': 'Ketik STOP untuk mengonfirmasi',
  'automation.kill.stopped':
    'Aturan ini dihentikan oleh {actor} di {date}. Itu tidak dapat berjalan lagi sampai Anda menyalakannya kembali.',
  'automation.state.loading': 'Memuat aturan otomatisasi',
  'automation.state.loadingRule': 'Memuat aturan dan eksekusi terbarunya',
  'automation.state.errorTitle': 'Aturan tidak dapat dimuat',
  'automation.state.errorBody':
    'Aturan yang sudah berjalan tidak terpengaruh dengan hal ini. Hanya layar ini yang gagal.',
  'automation.state.offlineTitle': 'Anda sedang luring',
  'automation.state.offlineBody':
    'Anda dapat membaca aturan dan mengedit drafnya, dan draf tersebut tetap ada di perangkat ini. Menyimpan, menguji, dan mengaktifkan aturan memerlukan koneksi.',
  'automation.state.permissionTitle': 'Anda tidak dapat mengubah aturan otomatisasi',
  'automation.state.permissionBody':
    'Aturan berlaku pada akun yang terhubung, jadi untuk mengubahnya memerlukan peran manajer atau lebih tinggi. Anda masih dapat membaca setiap aturan dan riwayat pengoperasiannya.',
  'automation.state.rateLimitTitle': 'Berjalannya peraturan diperlambat',
  'automation.state.rateLimitCause':
    'Ruang kerja ini telah mencapai batas proses otomatisasi untuk jendela saat ini. Postingan terjadwal dan penerbitan manual tidak terpengaruh.',
  'automation.state.rateLimitAlternative':
    'Aturan dengan irama dapat diberikan interval yang lebih panjang, sehingga menggunakan lebih sedikit lari.',
  'automation.rss.subtitle':
    'Ubah feed menjadi draf atau postingan terjadwal, dengan validasi dan persetujuan yang sama seperti apa pun yang Anda tulis sendiri.',
  'automation.rss.empty': 'Belum ada feed',
  'automation.rss.emptyBody':
    'Tambahkan feed dan Post Array memeriksanya sesuai jadwal. Setiap item baru menjadi draf, postingan terjadwal, atau permintaan persetujuan, mana pun yang Anda pilih.',
  'automation.rss.emptyExample':
    'Contoh: feed blog Acme membuat draf untuk X dan LinkedIn setiap kali artikel diterbitkan, dan menunggu pemberi persetujuan.',
  'automation.rss.table.caption': 'Memberi makan jajak pendapat ruang kerja ini.',
  'automation.rss.table.feed': 'Pakan',
  'automation.rss.table.policy': 'Apa yang terjadi pada item baru',
  'automation.rss.table.health': 'Kesehatan',
  'automation.rss.step.url': 'Alamat umpan',
  'automation.rss.step.preview': 'Periksa umpannya',
  'automation.rss.step.seen': 'Titik awal',
  'automation.rss.step.targets': 'Ke mana perginya',
  'automation.rss.step.template': 'Apa yang dikatakan postingan tersebut',
  'automation.rss.step.policy': 'Bagaimana hal itu dipublikasikan',
  'automation.rss.stepOf': 'Langkah {current} dari {total}',
  'automation.rss.urlHelp':
    'Post Array mengambil feed dari server kami, bukan dari browser Anda. Alamat jaringan pribadi ditolak.',
  'automation.rss.validateAction': 'Periksa umpan ini',
  'automation.rss.validateFailed': 'Alamat tersebut tidak menghasilkan feed yang dapat dibaca',
  'automation.rss.validateFailedReason': 'Apa yang kami dapatkan kembali: {reason}',
  'automation.rss.validateBlocked':
    'Alamat tersebut menunjuk pada jaringan pribadi, sehingga tidak diambil.',
  'automation.rss.previewTitle': 'Pratinjau umpan',
  'automation.rss.previewMeta':
    '{title}. {count, plural, one {# item} other {# items}} returned, newest first.',
  'automation.rss.previewItemPublished': 'Diterbitkan {dateTime}',
  'automation.rss.previewNoImage': 'Tidak ada gambar di item ini',
  'automation.rss.previewImageAlt': 'Gambar dari item umpan {title}',
  'automation.rss.previewNoDate':
    'Item ini tidak memiliki stempel waktu, jadi Post Array menggunakan waktu pertama kali melihatnya.',
  'automation.rss.previewFieldsTitle': 'Bidang yang disediakan feed ini',
  'automation.rss.previewFieldMissing': 'Tidak ada di feed ini',
  'automation.rss.seenTitle': 'Apa yang dianggap sudah terlihat',
  'automation.rss.seenLatest':
    'Perlakukan semua yang ada di feed saat ini seperti yang terlihat. Hanya item masa depan yang diposting.',
  'automation.rss.seenAll':
    'Perlakukan item terbaru sebagai baru dan posting pada pemeriksaan berikutnya.',
  'automation.rss.seenHelp':
    'Kebanyakan feed berisi artikel lama. Memilih opsi pertama adalah cara Anda menghindari penerbitan simpanan.',
  'automation.rss.targetsHelp':
    'Pilih akun atau grup yang disimpan. Setiap target masih mendapatkan validasinya sendiri sebelum dijadwalkan.',
  'automation.rss.targetGroup': 'Grup yang disimpan',
  'automation.rss.targetIndividual': 'Akun individu',
  'automation.rss.templateFields': 'Bidang yang tersedia',
  'automation.rss.templateInsert': 'Masukkan {field}',
  'automation.rss.templateField.title': 'Judul barang',
  'automation.rss.templateField.summary': 'Ringkasan barang',
  'automation.rss.templateField.link': 'Tautan barang',
  'automation.rss.templateField.author': 'Penulis barang',
  'automation.rss.templateField.published': 'Tanggal penerbitan',
  'automation.rss.templateField.categories': 'Kategori',
  'automation.rss.templatePreview': 'Pratinjau dengan item terbaru',
  'automation.rss.adaptWithAi': 'Sesuaikan teks untuk setiap target',
  'automation.rss.adaptHelp':
    'Kata-katanya ditulis ulang agar sesuai dengan setiap platform dan ditampilkan sebagai perbedaan yang Anda terima atau tolak. Media berasal dari item feed. Post Array tidak menghasilkan gambar.',
  'automation.rss.noImageGeneration':
    'Jika item feed tidak memiliki gambar, postingan akan ditampilkan tanpa gambar.',
  'automation.rss.imageFromFeed': 'Gunakan gambar dari item feed jika ada',
  'automation.rss.policyHelp':
    'Item feed tidak istimewa. Ini mengikuti kebijakan persetujuan yang sama seperti postingan yang Anda tulis sendiri.',
  'automation.rss.cadenceInterval': 'Paling banyak satu item untuk setiap item',
  'automation.rss.cadenceHelp':
    'Item tambahan menunggu dalam antrian daripada dipublikasikan secara bersamaan, sehingga feed yang memposting sepuluh artikel sekaligus tidak membanjiri akun.',
  'automation.rss.immediateWarning':
    'Penerbitan segera mengirimkan postingan ke platform tanpa ada orang yang membacanya terlebih dahulu. Ini hanya tersedia jika kebijakan persetujuan untuk akun ini mengizinkannya.',
  'automation.rss.healthTitle': 'Kesehatan pakan',
  'automation.rss.healthOk': 'Bekerja',
  'automation.rss.healthStalled': 'Tidak ada item baru untuk {duration}',
  'automation.rss.healthFailing': 'The last {count, plural, one {check} other {# checks}} failed',
  'automation.rss.health.nextPoll': 'Selanjutnya cek {relativeTime}',
  'automation.rss.health.itemsProcessed':
    '{count, plural, =0 {No items processed yet} one {# item processed} other {# items processed}}',
  'automation.rss.health.duplicatesSkipped':
    '{count, plural, =0 {No duplicates skipped} one {# duplicate skipped} other {# duplicates skipped}}',
  'automation.rss.health.lastPollLabel': 'Terakhir diperiksa',
  'automation.rss.health.lastItemLabel': 'Item baru terakhir di feed',
  'automation.rss.health.lastPostLabel': 'Draf atau postingan terakhir dibuat',
  'automation.rss.health.processedLabel': 'Barang diproses',
  'automation.rss.recentItems': 'Item terbaru',
  'automation.rss.itemOutcome.draft': 'Draf dibuat',
  'automation.rss.itemOutcome.scheduled': 'Dijadwalkan untuk {time}',
  'automation.rss.itemOutcome.published': 'Diterbitkan',
  'automation.rss.itemOutcome.awaitingApproval': 'Menunggu persetujuan',
  'automation.rss.itemOutcome.duplicate': 'Dilewatkan, sudah terlihat',
  'automation.rss.itemOutcome.failed': 'Gagal: {reason}',
  'automation.rss.pauseFeed': 'Jeda umpan ini',
  'automation.rss.resumeFeed': 'Lanjutkan umpan ini',
  'automation.rss.deleteTitle': 'Hapus {title}?',
  'automation.rss.deleteBody':
    'Post Array berhenti memeriksa feed ini. Draf dan postingan yang sudah dibuat tetap sama persis seperti aslinya.',
  'automation.rss.errorTitle': 'Umpan ini tidak dapat dibaca',
  'automation.rss.errorBody':
    'Post Array terus mengecek jadwal normal. Tidak ada yang dipublikasikan dari tanggapan parsial.',
  'automation.refuse.title': 'Tidak tersedia dalam aturan apa pun',
  'automation.refuse.body':
    'Suka dan mengikuti otomatis, grup keterlibatan, balasan dan pesan yang tidak diminta, dan memposting konten yang sama dari beberapa akun agar terlihat populer bukanlah pilihan di sini. Platform melarangnya dan merusak akun yang menggunakannya.',
  'automation.refuse.readPolicy': 'Baca kebijakan penggunaan yang dapat diterima',
} as const;
