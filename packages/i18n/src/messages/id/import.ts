export const importMessages = {
  'import.title': 'Impor postingan dari CSV',
  'import.subtitle':
    'Unggah spreadsheet, baca apa yang akan dilakukannya, lalu putuskan. Mengunggah hanya memeriksa berkas. Tidak ada yang dibuat.',

  'import.step.upload': 'Unggah',
  'import.step.columns': 'Kolom',
  'import.step.review': 'Tinjau',
  'import.step.apply': 'Terapkan',
  'import.step.results': 'Hasil',
  'import.step.position': 'Langkah {current} dari {total}',

  'import.upload.heading': 'Pilih berkas CSV',
  'import.upload.help':
    'Hanya CSV. Berkas spreadsheet seperti .xlsx tidak dibaca. Ekspor sheet Anda sebagai CSV terlebih dahulu.',
  'import.upload.field': 'Berkas CSV',
  'import.upload.fieldHelp': 'Pilih berkas, atau tempel baris ke dalam kotak di bawah.',
  'import.upload.paste': 'Atau tempel teks CSV',
  'import.upload.pasteHelp': 'Sertakan baris header. Semuanya diperiksa sebelum ada yang dibuat.',
  'import.upload.project': 'Proyek',
  'import.upload.projectHelp': 'Setiap baris dalam satu berkas termasuk proyek ini.',
  'import.upload.submit': 'Periksa berkas ini',
  'import.upload.submitting': 'Membaca berkas',
  'import.upload.allowPast': 'Izinkan waktu yang sudah lewat',
  'import.upload.allowPastHelp':
    'Nonaktif secara default. Baris dengan tanggal di masa lalu dilaporkan agar Anda dapat memperbaikinya, bukan dipindahkan otomatis.',
  'import.upload.tooLarge': 'Berkas itu lebih besar dari {limit} karakter. Pecah dan coba lagi.',
  'import.upload.duplicate':
    'Ini adalah berkas yang sama dengan yang Anda unggah sebelumnya, jadi Anda melihat impor itu, bukan salinan keduanya.',

  'import.template.heading': 'Arti setiap kolom',
  'import.template.download': 'Unduh templat CSV',
  'import.template.required': 'Kolom wajib',
  'import.template.optional': 'Kolom opsional',
  'import.column.external_row_id': 'ID Anda sendiri untuk baris ini. Harus unik di dalam berkas.',
  'import.column.project': 'Nama atau id proyek yang menjadi milik baris ini.',
  'import.column.targets':
    'Salah satu: diawali dengan id set target, atau id akun dipisahkan tanda garis vertikal.',
  'import.column.caption': 'Teks postingan.',
  'import.column.scheduled_local_time':
    'Tanggal dan waktu lokal, ditulis sebagai 2026-09-01T10:00.',
  'import.column.time_zone': 'Zona IANA tempat waktu lokal dibaca, misalnya Europe/Berlin.',
  'import.column.media':
    'Id media, sha256: diikuti checksum media yang sudah Anda miliki, atau alamat https untuk diambil oleh server.',
  'import.column.title': 'Judul, jika tujuan menggunakannya.',
  'import.column.destination': 'Halaman, papan, atau kanal di dalam akun.',
  'import.column.privacy': 'Nilai privasi yang diharapkan tujuan.',
  'import.column.first_comment': 'Teks yang diposting sebagai komentar pertama setelah postingan.',
  'import.column.approval_policy': 'Kebijakan persetujuan yang dilampirkan ke setiap draf.',
  'import.column.perPlatform':
    'Kolom caption_ atau title_ yang dinamai sesuai platform hanya menimpa platform itu, misalnya caption_instagram.',

  'import.columns.heading': 'Pemeriksaan kolom',
  'import.columns.ok': 'Setiap kolom wajib ada.',
  'import.columns.missing': '{count, plural, other {# kolom wajib tidak ada}}',
  'import.columns.unknown': '{count, plural, other {# kolom tidak dikenali dan diabaikan}}',
  'import.columns.present': 'Kolom yang ditemukan',

  'import.review.heading': 'Apa yang akan dilakukan berkas ini',
  'import.review.counts':
    '{valid, plural, =0 {Tidak ada baris yang siap} other {# baris siap}}, {invalid, plural, =0 {tidak ada yang perlu diperhatikan} other {# perlu diperhatikan}}.',
  'import.review.empty': 'Tidak ada baris yang terbaca dari berkas ini.',
  'import.review.rowsHeading': 'Baris',
  'import.review.filterAll': 'Semua baris',
  'import.review.filterValid': 'Siap',
  'import.review.filterInvalid': 'Perlu perhatian',
  'import.review.filterFailed': 'Gagal',
  'import.review.downloadErrors': 'Unduh masalah sebagai CSV',
  'import.review.parsedWith': 'Dibaca dengan parser {version}',

  'import.table.row': 'Id baris',
  'import.table.line': 'Baris',
  'import.table.state': 'Status',
  'import.table.caption': 'Keterangan',
  'import.table.time': 'Dijadwalkan',
  'import.table.problems': 'Masalah',
  'import.table.draft': 'Draf',
  'import.table.noProblems': 'Tidak ada',

  'import.state.pending': 'Belum diperiksa',
  'import.state.valid': 'Siap',
  'import.state.invalid': 'Perlu perhatian',
  'import.state.applied': 'Draf dibuat',
  'import.state.skipped': 'Sudah selesai',
  'import.state.failed': 'Gagal',

  'import.job.state.uploaded': 'Diunggah',
  'import.job.state.validating': 'Memeriksa',
  'import.job.state.validated': 'Diperiksa',
  'import.job.state.applying': 'Menerapkan',
  'import.job.state.applied': 'Diterapkan',
  'import.job.state.failed': 'Tidak dapat dibaca',

  'import.apply.heading': 'Apa yang harus terjadi pada baris yang sudah siap?',
  'import.apply.drafts': 'Buat draf',
  'import.apply.draftsHelp':
    'Pengaturan bawaan. Setiap baris siap menjadi draf yang dapat Anda buka, edit, dan setujui. Tidak ada yang dijadwalkan.',
  'import.apply.scheduled': 'Buat draf dan jadwalkan',
  'import.apply.scheduledHelp':
    'Setiap baris siap menjadi draf dan menggunakan waktu yang tertulis di berkas. Pilih ini hanya jika waktunya benar.',
  'import.apply.confirm': 'Terapkan {count, plural, other {# baris}}',
  'import.apply.confirmScheduled': 'Buat dan jadwalkan {count, plural, other {# baris}}',
  'import.apply.running': 'Menerapkan baris',
  'import.apply.safeToRepeat':
    'Menerapkan dua kali aman. Baris yang sudah membuat draf tidak akan diubah.',

  'import.results.heading': 'Hasil',
  'import.results.applied': '{count, plural, other {# draf dibuat}}',
  'import.results.skipped': '{count, plural, other {# baris sudah selesai}}',
  'import.results.failed': '{count, plural, other {# baris gagal}}',
  'import.results.retry': 'Terapkan lagi baris yang tersisa',
  'import.results.openDrafts': 'Buka draf',
  'import.results.unavailable': 'tidak tersedia',

  'import.history.heading': 'Impor sebelumnya',
  'import.history.empty': 'Belum ada impor.',
  'import.history.open': 'Buka',

  'import.a11y.rowsTable': 'Baris manifes dan masalahnya',
  'import.a11y.stepList': 'Langkah impor',
  'import.a11y.uploadedFile': 'Berkas terpilih: {filename}',

  'import.error.emptyFile': 'Berkas itu tidak memiliki baris.',
  'import.error.missingColumn': 'Kolom {column} tidak ada.',
  'import.error.unknownColumn': 'Kolom {column} tidak dikenali, jadi diabaikan.',
  'import.error.duplicateRowId': 'Id baris {value} digunakan lebih dari sekali di berkas ini.',
  'import.error.required': 'Sel ini tidak boleh kosong.',
  'import.error.invalidCell': 'Sel ini tidak dalam bentuk yang dapat kami baca.',
  'import.error.rowShape': 'Baris ini memiliki {actual} sel tetapi header memiliki {expected}.',
  'import.error.invalidLocalTime':
    'Waktu {value} bukan tanggal dan waktu lokal seperti 2026-09-01T10:00.',
  'import.error.invalidTimeZone': 'Zona {value} bukan nama zona waktu IANA.',
  'import.error.nonexistentLocalTime': 'Waktu {value} tidak ada di {zone}. Jam melompatinya.',
  'import.error.ambiguousLocalTime':
    'Waktu {value} terjadi dua kali di {zone} pada hari itu. Pilih waktu lain.',
  'import.error.scheduleInPast': 'Waktu {value} di {zone} sudah lewat.',
  'import.error.invalidTargets': 'Nilai {value} bukan set target tersimpan atau daftar id akun.',
  'import.error.invalidMedia': 'Nilai {value} bukan id media, checksum sha256, atau alamat https.',
  'import.error.mediaNotFound': 'Tidak ada media di ruang kerja ini yang cocok dengan {value}.',
  'import.error.mediaImportStarted':
    'Media di {value} sedang diambil. Terapkan berkas ini lagi setelah berada di pustaka.',
  'import.error.unknownVariantTarget':
    'Baris ini tidak memiliki akun {provider}, jadi keterangan {provider} tidak digunakan.',
  'import.error.applyFailed': 'Baris ini tidak dapat diterapkan. Referensi: {code}.',
  'import.error.alreadyApplied': 'Baris ini sudah membuat draf, jadi tidak diubah.',
  'import.error.tooManyRows': 'Hanya {limit} baris pertama dalam berkas yang dibaca.',
} as const;
