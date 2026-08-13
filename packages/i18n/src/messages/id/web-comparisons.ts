export const webComparisonMessages = {
  'web.comparison.eyebrow': 'Perbandingan',

  'web.comparison.state.yes': 'Ya',
  'web.comparison.state.no': 'Tidak',
  'web.comparison.state.partial': 'Sebagian',
  'web.comparison.state.notVerified': 'Belum diverifikasi',

  'web.comparison.label.claim': 'Klaim',
  'web.comparison.label.sourceRead': 'Dibaca {date}',
  'web.comparison.label.checked': 'Setiap baris diperiksa {date}',
  'web.comparison.label.nextReview': 'Pemeriksaan berikutnya jatuh tempo {date}',
  'web.comparison.label.backToIndex': 'Semua perbandingan',

  'web.comparison.table.title': 'Apa yang dilakukan setiap opsi',
  'web.comparison.table.caption': 'Satu klaim per baris, dengan sumber di balik setiap jawaban',

  'web.comparison.bestFor.title': 'Mana yang cocok',
  'web.comparison.bestFor.ours': 'Pilih produk ini saat',
  'web.comparison.bestFor.alternative': 'Pilih {name} saat',

  'web.comparison.notDo.title': 'Apa yang tidak dilakukan produk ini',
  'web.comparison.notDo.body':
    'Kalimat ini dibaca dari kode yang menentukannya, bukan diketik dengan tangan, jadi bagian ini tidak dapat menyimpang dari apa produk ini sebenarnya hari ini.',
  'web.comparison.disclosure.connectors':
    '{count, plural, =0 {Belum ada konektor yang menyelesaikan verifikasi penyedia, jadi tidak ada yang terbit ke platform mana pun melalui produk ini hari ini.} other {# konektor telah menyelesaikan verifikasi penyedia. Setiap platform lain dalam kelompok ini masih berupa niat.}}',
  'web.comparison.disclosure.locales':
    '{count, plural, =0 {Belum ada bahasa yang menyelesaikan tinjauan manusia, jadi setiap bahasa dalam antarmuka diberi label beta.} other {# bahasa telah menyelesaikan tinjauan manusia. Setiap bahasa lain diberi label beta.}}',
  'web.comparison.disclosure.tiers':
    '{count, plural, =0 {Setiap tingkat harga telah diputuskan dan memiliki harga sebenarnya.} other {# tingkat harga masih berupa placeholder yang belum diputuskan dan tidak dapat dibeli.}}',

  'web.comparison.notVerified.title': 'Apa arti belum diverifikasi',
  'web.comparison.notVerified.body':
    'Sebuah sel mengatakan belum diverifikasi ketika fakta itu tidak dapat dibaca dari dokumentasi publik resmi opsi lain pada hari pemeriksaan. Tidak pernah diisi dari ingatan, dan tidak pernah disalin dari ringkasan yang ditulis orang lain.',

  'web.comparison.method.title': 'Bagaimana halaman ini dibuat',
  'web.comparison.method.body':
    'Setiap baris adalah satu klaim, dengan dokumen asalnya dan tanggal seseorang membacanya. Tidak ada tangkapan layar pesaing, tidak ada kata-kata fitur yang disalin, dan tidak ada kelemahan yang direkayasa.',
  'web.comparison.method.cadence':
    'Setiap perbandingan diperiksa ulang setidaknya sekali setiap 90 hari, dan segera saat platform atau opsi mengubah sesuatu yang dinyatakan dalam baris.',

  'web.comparison.questions.title': 'Pertanyaan',
  'web.comparison.sources.title': 'Sumber yang dikutip di halaman ini',

  'web.comparison.index.title': 'Perbandingan yang diterbitkan',
  'web.comparison.index.body':
    'Setiap halaman membandingkan produk ini dengan kategori alternatif yang faktanya dapat dibaca dari dokumentasi resmi. Produk bernama mendapatkan halaman ketika fakta terkininya dapat dibaca dari halaman publiknya sendiri, dan tidak sebelum itu.',
  'web.comparison.index.checked': 'Diperiksa {date}',
} as const;
