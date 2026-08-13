export const webPlatformsMessages = {
  /* ---------------------------------------------------------------------- */
  /* Metadata                                                               */
  /* ---------------------------------------------------------------------- */

  'web.meta.schedule.title': 'Penjadwalan, platform demi platform',
  'web.meta.schedule.description':
    'Apa yang diharuskan setiap platform dalam kelompok peluncuran dari akun terhubung, batasan yang diberlakukan API resminya, dan seberapa jauh produk ini telah mencapainya.',
  'web.meta.schedulePlatform.title': 'Penjadwalan untuk {platform}',
  'web.meta.schedulePlatform.description':
    'Apa yang diharuskan {platform} dari akun terhubung, batasan yang diberlakukan API resminya, dan bagian mana dari itu yang sudah dibangun produk ini.',

  /* ---------------------------------------------------------------------- */
  /* Indeks                                                                 */
  /* ---------------------------------------------------------------------- */

  'web.schedule.index.title': 'Penjadwalan, platform demi platform',
  'web.schedule.index.lede':
    'Satu halaman per platform dalam kelompok peluncuran. Setiap halaman menyatakan apa yang diminta platform dari akun terhubung, batasan yang diberlakukan API resminya, dan di mana posisi pembangunannya. Setiap angka membawa dokumen asalnya dan tanggal seseorang membacanya.',
  'web.schedule.index.listLabel': 'Platform dalam kelompok peluncuran',
  'web.schedule.index.cohortNote':
    'Kelompok ini adalah kumpulan platform yang sedang dibangun produk ini untuknya. Ini adalah rencana, bukan daftar ketersediaan.',
  'web.schedule.index.limitsKnown': 'Batasan tercatat',
  'web.schedule.index.limitsUnknown': 'Batasan belum tercatat',

  /* ---------------------------------------------------------------------- */
  /* Halaman platform                                                       */
  /* ---------------------------------------------------------------------- */

  'web.schedule.platform.title': 'Penjadwalan untuk {platform}',
  'web.schedule.platform.lede':
    'Apa yang diminta {platform} dari akun terhubung, batasan yang diberlakukan API resminya, dan mana dari itu yang sudah dibangun produk ini sejauh ini.',

  'web.schedule.notice.title': 'Belum ada yang terbit ke {platform}',
  'web.schedule.notice.body':
    'Belum ada konektor yang lulus definisi selesainya, dan tidak ada yang diverifikasi dalam produksi. Halaman ini menjelaskan apa yang diminta platform dan apa yang dimaksudkan produk ini untuk didukung. Ini bukan penjadwal yang berfungsi.',

  'web.schedule.requirements.title': 'Apa yang diminta {platform}',
  'web.schedule.requirements.accountTypes': 'Jenis akun',
  'web.schedule.requirements.restriction': 'Batasan platform',
  'web.schedule.requirements.cost': 'Biaya API',
  'web.schedule.requirements.unavailable.title': 'Belum ada catatan konektor yang ditinjau',
  'web.schedule.requirements.unavailable.body':
    'Platform ini bergabung dengan kelompok setelah putaran riset konektor terakhir, jadi tidak ada catatan bertanggal tentang persyaratan akunnya untuk ditampilkan. Akan muncul di sini begitu seseorang membaca dokumentasi resmi dan mencatatnya.',
  'web.schedule.requirements.apiSource': 'Dokumentasi API resmi',
  'web.schedule.requirements.policySource': 'Kebijakan platform',

  /* ---------------------------------------------------------------------- */
  /* Batasan                                                                */
  /* ---------------------------------------------------------------------- */

  'web.schedule.limits.title': 'Batasan yang diberlakukan {platform}',
  'web.schedule.limits.lede':
    'Dibaca untuk akun yang baru terhubung tanpa kelayakan yang ditingkatkan. Platform dapat menaikkan atau menurunkan salah satu dari ini tanpa memberi tahu siapa pun, itulah sebabnya setiap kumpulan membawa tanggal saat dibaca.',
  'web.schedule.limits.unavailable.title': 'Batasan belum tercatat untuk {platform}',
  'web.schedule.limits.unavailable.body':
    'Build ini tidak mengirimkan adapter untuk platform ini, jadi tidak ada batas tercatat untuk ditampilkan. Angka rekaan akan lebih buruk daripada tidak sama sekali.',
  'web.schedule.limits.sourceLabel': 'Dokumentasi platform resmi',

  'web.schedule.limits.text': 'Teks isi',
  'web.schedule.limits.title_field': 'Kolom judul',
  'web.schedule.limits.countingUnit': 'Bagaimana karakter dihitung',
  'web.schedule.limits.links': 'Bagaimana tautan dihitung',
  'web.schedule.limits.images': 'Gambar per postingan',
  'web.schedule.limits.videos': 'Video per postingan',
  'web.schedule.limits.videoDuration': 'Panjang video',
  'web.schedule.limits.imageBytes': 'Gambar terbesar',
  'web.schedule.limits.gifBytes': 'Gambar animasi terbesar',
  'web.schedule.limits.videoBytes': 'Video terbesar',
  'web.schedule.limits.documentBytes': 'Dokumen terbesar',
  'web.schedule.limits.altText': 'Teks alternatif',
  'web.schedule.limits.mimeTypes': 'Jenis berkas yang diterima',
  'web.schedule.limits.markdown': 'Tanda pemformatan',

  'web.schedule.value.characters': '{count, plural, other {# karakter}}',
  'web.schedule.value.files': '{count, plural, =0 {Tidak ada} other {# berkas}}',
  'web.schedule.value.durationRange': 'Antara {min} dan {max}',
  'web.schedule.value.durationMax': 'Hingga {max}',
  'web.schedule.value.markdownYes': 'Diterima',
  'web.schedule.value.markdownNo': 'Diterbitkan sebagai karakter biasa',

  'web.schedule.unit.utf16':
    'Berdasarkan unit kode UTF-16, yang dilaporkan sebagian besar editor sebagai jumlah karakter.',
  'web.schedule.unit.grapheme':
    'Berdasarkan grafem, sehingga emoji yang terdiri dari beberapa titik kode tetap berbiaya satu karakter.',
  'web.schedule.unit.weighted':
    'Berdasarkan skema berbobot di mana sebagian besar karakter non-Latin berbiaya dua alih-alih satu.',

  'web.schedule.link.none': 'Tautan tidak dihitung terhadap batas.',
  'web.schedule.link.actual': 'Tautan berbiaya persis karakter yang ditempatinya.',
  'web.schedule.link.fixed':
    'Setiap tautan ditulis ulang ke pemendek platform dan berbiaya {count, plural, other {# karakter}} berapa pun panjang aslinya.',

  /* ---------------------------------------------------------------------- */
  /* Status kemampuan                                                       */
  /* ---------------------------------------------------------------------- */

  'web.schedule.capabilities.title': 'Apa yang dibangun untuk {platform}',
  'web.schedule.capabilities.lede':
    'Dihasilkan dari registri konektor, bukan ditulis di sini. "Tidak ditawarkan platform" adalah fakta tentang platform dan bersifat final. "Belum dibangun" adalah fakta tentang produk ini dan merupakan bawaan yang jujur selama belum ada konektor yang lulus definisi selesainya.',
  'web.schedule.capabilities.unavailable.title': 'Belum ada catatan kemampuan untuk {platform}',
  'web.schedule.capabilities.unavailable.body':
    'Tidak ada adapter dalam build ini, jadi registri tidak memiliki apa pun untuk dilaporkan. Baris akan muncul di matriks kemampuan begitu ada sesuatu yang nyata untuk dikatakan.',
  'web.schedule.capabilities.matrixLink': 'Baca matriks kemampuan lengkap',

  'web.schedule.next.title': 'Ke mana selanjutnya',
  'web.schedule.next.body':
    'Matriks kemampuan membawa setiap platform dan setiap kemampuan dalam satu tabel. Halaman kasus penggunaan menjelaskan alur kerja yang sedang dibangun produk ini di sekitarnya.',
} as const;
