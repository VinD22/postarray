export const webToolsMessages = {
  /* ---------------------------------------------------------------------- */
  /* Metadata                                                                */
  /* ---------------------------------------------------------------------- */

  'web.meta.tools.title': 'Alat penerbitan gratis',
  'web.meta.tools.description':
    'Alat kecil dan privat untuk orang yang memposting ke beberapa platform: pemeriksa batas per platform, pembuat UTM, pemeriksa panjang judul YouTube, dan perencana zona waktu.',
  'web.meta.tools.preflight.title': 'Pemeriksa pra-terbang postingan',
  'web.meta.tools.preflight.description':
    'Periksa satu draf terhadap batas teks dan media yang diterbitkan dari sepuluh platform, dengan sumber dan tanggal setiap batas dibaca.',
  'web.meta.tools.utm.title': 'Pembuat tautan UTM',
  'web.meta.tools.utm.description':
    'Susun URL kampanye bertag dan lihat arti setiap parameter UTM. Berjalan sepenuhnya di browser Anda.',
  'web.meta.tools.youtubeTitle.title': 'Pemeriksa panjang judul YouTube',
  'web.meta.tools.youtubeTitle.description':
    'Ukur judul YouTube terhadap batas terdokumentasi, dihitung seperti cara seseorang menghitung karakter.',
  'web.meta.tools.timeZone.title': 'Perencana zona waktu dan waktu musim panas',
  'web.meta.tools.timeZone.description':
    'Lihat satu waktu posting di beberapa zona audiens dan temukan minggu di mana pergeseran waktu musim panas menggeser jam lokal.',
  'web.meta.tools.engagementRate.title': 'Kalkulator tingkat keterlibatan',
  'web.meta.tools.engagementRate.description':
    'Bagi interaksi dengan jangkauan, pengikut, atau tayangan. Tiga perhitungan sederhana, tanpa tolok ukur rekaan.',

  /* ---------------------------------------------------------------------- */
  /* Perangkat alat bersama                                                  */
  /* ---------------------------------------------------------------------- */

  'web.tools.index.title': 'Alat gratis',
  'web.tools.index.summary':
    'Kalkulator kecil yang dibangun di atas data batas platform yang sama yang dibaca konektor kami.',
  'web.tools.index.lede':
    'Empat alat kecil, dibangun di atas data batas platform yang sama yang digunakan konektor kami. Tanpa akun, tanpa unggahan, tanpa pelacakan apa yang Anda ketik.',
  'web.tools.index.dataTitle': 'Dari mana angka-angka ini berasal',
  'web.tools.index.dataBody':
    'Setiap batas dihasilkan dari kode kemampuan konektor dalam repositori ini, dan setiap baris platform membawa halaman dokumentasi resmi asalnya dan tanggal seseorang membaca halaman itu.',
  'web.tools.index.honesty':
    'Alat ini tidak menerbitkan apa pun. Belum ada konektor yang menyelesaikan verifikasi penyedia, jadi tidak ada yang menghubungkan akun di sini.',
  'web.tools.shared.privacyTitle': 'Ini berjalan di browser Anda',
  'web.tools.shared.privacyBody':
    'Semua yang Anda ketik tetap di halaman ini. Tidak ada permintaan ke server, tidak ada penyimpanan, dan tidak ada peristiwa analitik yang membawa teks Anda.',
  'web.tools.shared.sourceLink': 'Dokumentasi platform',
  'web.tools.shared.sourceRead': 'Dibaca pada {date}',
  'web.tools.shared.unavailable': 'tidak tersedia',
  'web.tools.shared.unavailableWhy':
    'Kami belum mengirimkan konektor untuk platform ini, jadi kami tidak memiliki batas terverifikasi untuk ditampilkan. Kami lebih memilih tidak mengatakan apa pun daripada menebak.',
  'web.tools.shared.copy': 'Salin',
  'web.tools.shared.copied': 'Disalin',
  'web.tools.shared.copyFailed': 'Browser Anda memblokir penyalinan. Pilih teks dan salin.',
  'web.tools.shared.faqTitle': 'Pertanyaan',
  'web.tools.shared.baselineTitle': 'Akun mana yang digambarkan angka-angka ini',
  'web.tools.shared.baselineBody':
    'Kasus konservatif: akun yang baru terhubung tanpa kelayakan yang ditingkatkan. Beberapa platform menaikkan batas begitu kanal atau bisnis diverifikasi, dan di mana itu terjadi, halaman mengatakannya.',
  'web.tools.shared.otherTools': 'Alat lainnya',

  /* ---------------------------------------------------------------------- */
  /* Nama alat dan ringkasan satu baris                                     */
  /* ---------------------------------------------------------------------- */

  'web.tools.preflight.name': 'Pemeriksa pra-terbang postingan',
  'web.tools.preflight.summary':
    'Satu draf, diperiksa terhadap batas teks dan media dari sepuluh platform sekaligus.',
  'web.tools.utm.name': 'Pembuat tautan UTM',
  'web.tools.utm.summary': 'Bangun URL kampanye bertag tanpa merusak string kueri yang sudah ada.',
  'web.tools.youtubeTitle.name': 'Pemeriksa panjang judul YouTube',
  'web.tools.youtubeTitle.summary': 'Ukur judul seperti cara seseorang menghitung karakter.',
  'web.tools.timeZone.name': 'Perencana zona waktu dan waktu musim panas',
  'web.tools.timeZone.summary':
    'Satu waktu posting di beberapa zona audiens, dengan pergeseran waktu musim panas ditandai.',
  'web.tools.engagementRate.name': 'Kalkulator tingkat keterlibatan',
  'web.tools.engagementRate.summary':
    'Interaksi dibagi jangkauan, pengikut, atau tayangan. Tidak ada yang dicari, tidak ada yang dijadikan tolok ukur.',

  /* ---------------------------------------------------------------------- */
  /* Pemeriksa pra-terbang postingan                                        */
  /* ---------------------------------------------------------------------- */

  'web.tools.preflight.title': 'Pemeriksa pra-terbang postingan',
  'web.tools.preflight.lede':
    'Tempel draf, pilih platform yang Anda posting, dan lihat mana yang akan menolaknya sebelum Anda mengetahuinya dari kesalahan API.',
  'web.tools.preflight.explainer.title': 'Mengapa penghitung karakter saja tidak cukup',
  'web.tools.preflight.explainer.body':
    'Platform tidak sepakat tentang apa itu karakter. Beberapa menghitung unit kode, jadi satu emoji berbiaya dua. Beberapa menghitung grafem, jadi bendera atau emoji keluarga berbiaya satu. Beberapa menulis ulang setiap tautan ke lebar tetap, jadi URL 200 karakter berbiaya sama dengan yang 20 karakter. Alat ini menerapkan setiap aturan platform secara terpisah.',
  'web.tools.preflight.explainer.counting':
    'Draf diukur dengan segmenter Intl browser, yang membagi teks menjadi unit yang akan disebut karakter oleh pembaca, lalu disesuaikan dengan aturan platform.',
  'web.tools.preflight.field.draft.label': 'Draf Anda',
  'web.tools.preflight.field.draft.help':
    'Tempel isi postingan. Tautan terdeteksi secara otomatis sehingga biayanya dapat diterapkan per platform.',
  'web.tools.preflight.field.platforms.label': 'Platform untuk diperiksa',
  'web.tools.preflight.field.platforms.help': 'Pilih sebanyak yang Anda posting.',
  'web.tools.preflight.field.mediaKind.label': 'Media terlampir',
  'web.tools.preflight.field.mediaKind.none': 'Tanpa media',
  'web.tools.preflight.field.mediaKind.image': 'Gambar',
  'web.tools.preflight.field.mediaKind.video': 'Satu video',
  'web.tools.preflight.field.mediaCount.label': 'Berapa banyak gambar',
  'web.tools.preflight.field.byteSize.label': 'Ukuran berkas dalam megabita',
  'web.tools.preflight.field.byteSize.help': 'Berkas tunggal terbesar. Kosongkan untuk lewati.',
  'web.tools.preflight.field.duration.label': 'Panjang video dalam detik',
  'web.tools.preflight.field.duration.help': 'Kosongkan untuk melewati pemeriksaan durasi.',
  'web.tools.preflight.field.width.label': 'Lebar media dalam piksel',
  'web.tools.preflight.field.height.label': 'Tinggi media dalam piksel',
  'web.tools.preflight.field.dimensions.help':
    'Opsional. Hanya digunakan untuk menampilkan rasio aspek yang akan Anda terbitkan.',
  'web.tools.preflight.results.title': 'Hasil per platform',
  'web.tools.preflight.results.empty': 'Pilih setidaknya satu platform untuk melihat hasil.',
  'web.tools.preflight.results.summary':
    '{fail, plural, =0 {Tidak ada yang menghalangi} other {# akan gagal}}, {warning, plural, =0 {tanpa peringatan} other {# untuk diperiksa}}.',
  'web.tools.preflight.status.pass': 'Sesuai',
  'web.tools.preflight.status.warning': 'Perlu diperiksa',
  'web.tools.preflight.status.fail': 'Akan gagal',
  'web.tools.preflight.status.unavailable': 'Tidak tersedia',
  'web.tools.preflight.count.label':
    '{count} dari {limit} {unit, select, grapheme {karakter} utf16 {unit kode} weighted {karakter berbobot} other {karakter}}',
  'web.tools.preflight.finding.textOver':
    'Melebihi batas sebanyak {over, plural, other {# karakter}}.',
  'web.tools.preflight.finding.textNear': 'Dalam {remaining} karakter dari batas.',
  'web.tools.preflight.finding.textFits': 'Isinya sesuai.',
  'web.tools.preflight.finding.linkFixed':
    'Setiap tautan ditulis ulang ke lebar tetap, jadi masing-masing berbiaya {cost} karakter berapa pun panjang aslinya.',
  'web.tools.preflight.finding.linkActual': 'Tautan dihitung sebagai karakter yang ditempatinya.',
  'web.tools.preflight.finding.imagesOver':
    'Platform ini menerima {limit, plural, =0 {tidak ada gambar} other {# gambar}} dalam satu postingan.',
  'web.tools.preflight.finding.videosOver':
    'Platform ini menerima {limit, plural, =0 {tidak ada video} other {# video}} dalam satu postingan.',
  'web.tools.preflight.finding.bytesOver': 'Berkas lebih besar dari batas {limit}.',
  'web.tools.preflight.finding.bytesUnknown':
    'Tidak ada batas byte terdokumentasi untuk jenis media ini, jadi ukurannya tidak diperiksa.',
  'web.tools.preflight.finding.durationOver': 'Lebih panjang dari batas {limit} detik.',
  'web.tools.preflight.finding.durationUnder': 'Lebih pendek dari minimum {limit} detik.',
  'web.tools.preflight.finding.durationUnknown':
    'Tidak ada batas durasi terdokumentasi, jadi panjangnya tidak diperiksa.',
  'web.tools.preflight.finding.altText':
    'Teks alternatif diterima hingga {limit} karakter, yang layak digunakan.',
  'web.tools.preflight.finding.ratio': 'Anda akan menerbitkan dengan rasio sekitar {ratio} banding 1.',
  'web.tools.preflight.faq.counting.q': 'Bagaimana Anda menghitung karakter?',
  'web.tools.preflight.faq.counting.a':
    'Berdasarkan grafem, menggunakan segmenter Intl browser, yang merupakan unit yang dimaksud pembaca sebagai karakter. Di mana platform mendokumentasikan aturan berbeda, seperti menghitung unit kode atau membebankan lebar tetap per tautan, aturan itu diterapkan di atasnya.',
  'web.tools.preflight.faq.accuracy.q': 'Seberapa terkini batasan ini?',
  'web.tools.preflight.faq.accuracy.a':
    'Setiap batas dihasilkan dari kode konektor di repositori kami alih-alih diketik ke halaman, dan setiap baris platform menampilkan dokumen resmi asalnya dan tanggal seseorang membacanya. Jika platform mengubah angka, perbaikannya adalah satu perubahan kode dan setiap alat di sini mengikutinya.',
  'web.tools.preflight.faq.privacy.q': 'Apakah draf saya diunggah?',
  'web.tools.preflight.faq.privacy.a':
    'Tidak. Pemeriksaan berjalan di browser Anda. Tidak ada permintaan yang membawa teks Anda, tidak ada yang disimpan, dan menutup tab sudah cukup untuk membuangnya.',
  'web.tools.preflight.faq.publish.q': 'Bisakah alat ini memposting untuk saya?',
  'web.tools.preflight.faq.publish.a':
    'Belum hari ini. Belum ada konektor yang menyelesaikan verifikasi penyedia, jadi tidak ada yang terbit ke platform dari situs ini. Halaman ini adalah pemeriksa batas, bukan penyusun.',

  /* ---------------------------------------------------------------------- */
  /* Pembuat UTM                                                            */
  /* ---------------------------------------------------------------------- */

  'web.tools.utm.title': 'Pembuat tautan UTM',
  'web.tools.utm.lede':
    'Tambahkan parameter kampanye ke URL tanpa kehilangan string kueri yang sudah dimilikinya, dan tanpa menebak arti setiap parameter.',
  'web.tools.utm.explainer.title': 'Untuk apa setiap parameter',
  'web.tools.utm.explainer.body':
    'Parameter UTM dibaca oleh alat analitik, bukan oleh platform tempat Anda memposting. Parameter ini berjalan di dalam URL, jadi siapa pun yang melihat tautan itu melihatnya. Buat singkat, huruf kecil, dan konsisten, karena dua ejaan kampanye yang sama menjadi dua baris dalam laporan.',
  'web.tools.utm.field.url.label': 'URL tujuan',
  'web.tools.utm.field.url.help': 'Halaman yang ingin Anda tuju orang, termasuk https.',
  'web.tools.utm.field.url.invalid': 'Itu tidak terurai sebagai URL http atau https.',
  'web.tools.utm.field.source.label': 'Sumber kampanye',
  'web.tools.utm.field.source.help': 'Dari mana klik itu berasal. Misalnya nama platform.',
  'web.tools.utm.field.medium.label': 'Media kampanye',
  'web.tools.utm.field.medium.help': 'Jenis tautan. Misalnya sosial, email, atau rujukan.',
  'web.tools.utm.field.campaign.label': 'Nama kampanye',
  'web.tools.utm.field.campaign.help': 'Peluncuran, promosi, atau tema tempat tautan ini menjadi bagian.',
  'web.tools.utm.field.term.label': 'Istilah kampanye',
  'web.tools.utm.field.term.help': 'Opsional. Secara tradisional kata kunci berbayar.',
  'web.tools.utm.field.content.label': 'Konten kampanye',
  'web.tools.utm.field.content.help':
    'Opsional. Memisahkan dua tautan ke halaman yang sama, misalnya dua versi postingan.',
  'web.tools.utm.result.title': 'URL bertag Anda',
  'web.tools.utm.result.empty': 'Masukkan URL tujuan untuk melihat hasilnya.',
  'web.tools.utm.result.label': 'URL yang disusun',
  'web.tools.utm.result.preserved':
    'String kueri yang sudah ada di URL Anda dipertahankan persis seperti yang Anda ketik.',
  'web.tools.utm.result.replaced':
    'URL Anda sudah membawa salah satu parameter ini. Nilai yang Anda masukkan di sini menggantikannya.',
  'web.tools.utm.faq.encoding.q': 'Apa yang terjadi pada spasi dan aksen?',
  'web.tools.utm.faq.encoding.a':
    'Ini dienkode persen, yang membuat tautan bertahan saat ditempel ke postingan. Spasi menjadi tanda plus dan huruf beraksen menjadi bentuk terenkodenya, dan alat analitik mendekode keduanya kembali.',
  'web.tools.utm.faq.existing.q': 'Akankah ini merusak URL yang sudah memiliki parameter?',
  'web.tools.utm.faq.existing.a':
    'Tidak. Parameter yang ada dipertahankan dalam urutan aslinya, dan hanya parameter UTM yang Anda isi yang ditambahkan atau diganti. Fragmen di akhir URL tetap di akhir.',
  'web.tools.utm.faq.privacy.q': 'Apakah URL saya dikirim ke suatu tempat?',
  'web.tools.utm.faq.privacy.a':
    'Tidak. URL disusun di browser Anda dan tidak pernah meninggalkan halaman ini.',

  /* ---------------------------------------------------------------------- */
  /* Pemeriksa panjang judul YouTube                                        */
  /* ---------------------------------------------------------------------- */

  'web.tools.youtubeTitle.title': 'Pemeriksa panjang judul YouTube',
  'web.tools.youtubeTitle.lede':
    'Judul yang satu karakter terlalu panjang ditolak saat diunggah. Judul yang sekadar panjang terpotong di tempat yang tidak Anda pilih.',
  'web.tools.youtubeTitle.explainer.title': 'Dua batas yang berbeda',
  'web.tools.youtubeTitle.explainer.body':
    'Batas keras adalah apa yang diterima titik akhir unggahan. Di mana judul ditampilkan adalah pertanyaan terpisah: hasil pencarian, sidebar, dan ponsel semuanya memotong judul di titik berbeda, dan tidak satu pun dari titik potong itu dipublikasikan. Alat ini menyatakan batas terdokumentasi dan menunjukkan bentuk judul Anda, dan tidak merekayasa angka pemotongan.',
  'web.tools.youtubeTitle.field.title.label': 'Judul video',
  'web.tools.youtubeTitle.field.title.help': 'Dihitung berdasarkan grafem, jadi emoji berbiaya satu.',
  'web.tools.youtubeTitle.result.count': '{count} dari {limit} karakter',
  'web.tools.youtubeTitle.result.over':
    'Melebihi {over, plural, other {# karakter}}. Unggahan akan ditolak.',
  'web.tools.youtubeTitle.result.fits': 'Dalam batas terdokumentasi.',
  'web.tools.youtubeTitle.result.front':
    'Karakter {count} pertama membawa bobot terbesar, karena itu kira-kira yang muat di tata letak sempit. Judul Anda dimulai: {preview}',
  'web.tools.youtubeTitle.result.unavailable':
    'Batas judul tidak tersedia dalam build ini, jadi tidak ada yang diperiksa di sini.',
  'web.tools.youtubeTitle.faq.limit.q': 'Dari mana batas ini berasal?',
  'web.tools.youtubeTitle.faq.limit.a':
    'Dari referensi videos insert resmi, dihasilkan ke halaman ini dari kode konektor yang sama yang akan digunakan pengunggah kami. Tanggal seseorang terakhir membaca halaman itu ditampilkan di samping angkanya.',
  'web.tools.youtubeTitle.faq.truncation.q': 'Di mana tepatnya YouTube memotong judul?',
  'web.tools.youtubeTitle.faq.truncation.a':
    'Tergantung permukaan dan area pandang, dan YouTube tidak menerbitkan jumlah karakter untuk itu. Kami menampilkan batas, yang terdokumentasi, dan kami tidak mencetak angka pemotongan yang akan menjadi tebakan.',
  'web.tools.youtubeTitle.faq.emoji.q': 'Apakah emoji dihitung sebagai satu karakter?',
  'web.tools.youtubeTitle.faq.emoji.a':
    'Dalam penghitung ini, ya, karena kami menghitung grafem. Platform yang menghitung unit kode secara internal mungkin membebankan lebih untuk emoji yang sama, itulah sebabnya pemeriksa pra-terbang menerapkan setiap aturan platform secara terpisah.',

  /* ---------------------------------------------------------------------- */
  /* Perencana zona waktu dan waktu musim panas                            */
  /* ---------------------------------------------------------------------- */

  'web.tools.timeZone.title': 'Perencana zona waktu dan waktu musim panas',
  'web.tools.timeZone.lede':
    'Slot mingguan yang terlihat stabil di kalender Anda bergeser bagi separuh audiens Anda dua kali setahun. Ini menunjukkan di mana dan kapan.',
  'web.tools.timeZone.explainer.title': 'Mengapa waktu lokal tetap bukanlah waktu tetap',
  'web.tools.timeZone.explainer.body':
    'Waktu hanya berarti sesuatu dengan zona yang menyertainya. Zona mengubah selisihnya pada tanggal yang berbeda menurut negara, dan dua wilayah yang berjarak lima jam pada Januari bisa berjarak empat jam pada April. Jadwal yang disimpan sebagai momen ditambah zona bertahan dari itu. Jadwal yang disimpan sebagai jam lokal tidak.',
  'web.tools.timeZone.field.date.label': 'Tanggal',
  'web.tools.timeZone.field.time.label': 'Waktu',
  'web.tools.timeZone.field.zone.label': 'Zona Anda',
  'web.tools.timeZone.field.audience.label': 'Zona audiens',
  'web.tools.timeZone.field.audience.help': 'Pilih zona tempat pembaca Anda benar-benar berada.',
  'web.tools.timeZone.result.title': 'Momen yang sama, di mana pun Anda pilih',
  'web.tools.timeZone.result.empty': 'Pilih setidaknya satu zona audiens.',
  'web.tools.timeZone.result.shift':
    'Perubahan waktu musim panas jatuh antara tanggal ini dan hari yang sama empat minggu kemudian, jadi jam lokal bergeser.',
  'web.tools.timeZone.result.stable': 'Tidak ada perubahan selisih dalam empat minggu ke depan.',
  'web.tools.timeZone.result.later': 'Empat minggu kemudian, {time}.',
  'web.tools.timeZone.result.invalidDate': 'Masukkan tanggal dan waktu untuk melihat perbandingan.',
  'web.tools.timeZone.faq.dst.q': 'Ke arah mana jam bergeser?',
  'web.tools.timeZone.faq.dst.a':
    'Tergantung zona dan arah perubahan, itulah sebabnya tabel menunjukkan waktu lokal sebenarnya empat minggu kemudian alih-alih menjelaskan aturannya. Selisih untuk setiap zona dibaca dari basis data zona waktu browser Anda.',
  'web.tools.timeZone.faq.storage.q': 'Bagaimana seharusnya postingan terjadwal menyimpan waktunya?',
  'web.tools.timeZone.faq.storage.a':
    'Sebagai momen ditambah zona IANA yang dipilih orang itu, tidak pernah sebagai waktu lokal murni. Itulah yang kami lakukan secara internal, dan itulah sebabnya postingan yang dijadwalkan sebelum perubahan jam tetap mendarat pada jam lokal yang dimaksudkan.',

  /* ---------------------------------------------------------------------- */
  /* Kalkulator tingkat keterlibatan                                        */
  /* ---------------------------------------------------------------------- */

  'web.tools.engagementRate.title': 'Kalkulator tingkat keterlibatan',
  'web.tools.engagementRate.lede':
    'Ketik angka yang sudah ditunjukkan dasbor Anda sendiri. Ini membaginya tiga cara dan berhenti di situ: tanpa tolok ukur, tanpa ambang "baik", tidak ada yang sebenarnya tidak kami miliki.',
  'web.tools.engagementRate.explainer.title': 'Mengapa tiga penyebut, bukan satu',
  'web.tools.engagementRate.explainer.body':
    'Jangkauan, pengikut, dan tayangan menjawab pertanyaan berbeda. Tingkat berdasarkan jangkauan memberi tahu Anda bagaimana orang yang benar-benar melihat postingan itu merespons. Tingkat berdasarkan pengikut memberi tahu Anda porsi audiens Anda yang terlibat, terlepas dari apakah postingan menjangkau semua orang. Tingkat berdasarkan tayangan menghitung setiap tampilan, termasuk yang berulang. Membandingkan tingkat yang dihitung satu cara dengan tingkat yang dihitung cara lain adalah sumber umum angka keterlibatan yang terlihat salah.',
  'web.tools.engagementRate.field.interactions.label': 'Interaksi',
  'web.tools.engagementRate.field.interactions.help':
    'Suka, komentar, bagikan, dan simpan dijumlahkan, dari postingan yang Anda ukur.',
  'web.tools.engagementRate.field.reach.label': 'Jangkauan',
  'web.tools.engagementRate.field.reach.help': 'Akun yang melihat postingan setidaknya sekali.',
  'web.tools.engagementRate.field.followers.label': 'Pengikut',
  'web.tools.engagementRate.field.followers.help': 'Ukuran akun pada saat postingan.',
  'web.tools.engagementRate.field.impressions.label': 'Tayangan',
  'web.tools.engagementRate.field.impressions.help': 'Total tampilan, termasuk orang yang melihatnya dua kali.',
  'web.tools.engagementRate.result.title': 'Tingkat keterlibatan, tiga cara',
  'web.tools.engagementRate.result.empty': 'tidak tersedia',
  'web.tools.engagementRate.result.note':
    'Tidak ada tingkat baik universal untuk dibandingkan. Tergantung platform, format, ukuran audiens, dan industri, dan angka tunggal apa pun yang ditawarkan sebagai tolok ukur adalah tebakan yang berpakaian sebagai data.',
  'web.tools.engagementRate.basis.reach': 'Berdasarkan jangkauan',
  'web.tools.engagementRate.basis.followers': 'Berdasarkan pengikut',
  'web.tools.engagementRate.basis.impressions': 'Berdasarkan tayangan',
  'web.tools.engagementRate.faq.formula.q': 'Apa rumus sebenarnya?',
  'web.tools.engagementRate.faq.formula.a':
    'Interaksi dibagi penyebut yang Anda pilih, ditampilkan sebagai persentase. Interaksi di sini berarti suka, komentar, bagikan, dan simpan dijumlahkan; beberapa platform melaporkan ini secara terpisah, dalam hal ini jumlahkan sendiri sebelum mengetik totalnya.',
  'web.tools.engagementRate.faq.basis.q': 'Penyebut mana yang harus saya gunakan?',
  'web.tools.engagementRate.faq.basis.a':
    'Mana pun yang dilaporkan platform Anda beserta postingannya, sehingga kedua angka berasal dari jendela pengukuran yang sama. Membandingkan tingkat berdasarkan jangkauan pada satu postingan dengan tingkat berdasarkan pengikut pada postingan lain bukanlah perbandingan yang adil meskipun keduanya disebut tingkat keterlibatan.',
} as const;
