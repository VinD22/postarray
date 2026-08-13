export const mediaMessages = {
  'mediaLib.derivative.heading': 'Edit gambar ini',
  'mediaLib.derivative.description':
    'Potong, putar, ubah ukuran, ubah format, atau kompres. Setiap perubahan bekerja pada piksel yang sudah ada di berkas Anda. Tidak ada yang ditambahkan yang sebelumnya tidak ada.',
  'mediaLib.derivative.originalKept':
    'Aslinya tidak pernah diganti. Setiap edit disimpan sebagai versi terpisah yang dapat Anda pilih saat menyusun.',
  'mediaLib.derivative.apply': 'Simpan versi ini',
  'mediaLib.derivative.applying': 'Menyimpan versi ini',
  'mediaLib.derivative.discard': 'Buang perubahan',
  'mediaLib.derivative.noChanges': 'Belum ada yang perlu disimpan. Ubah nilai di atas.',

  'mediaLib.derivative.tab.crop': 'Potong',
  'mediaLib.derivative.tab.transform': 'Putar dan ubah ukuran',
  'mediaLib.derivative.tab.output': 'Format',

  'mediaLib.derivative.cropHint':
    'Ketik angkanya, atau gunakan tombol panah di kolom mana pun. Tidak ada langkah di sini yang memerlukan mouse.',
  'mediaLib.derivative.cropX': 'Tepi kiri, dalam piksel',
  'mediaLib.derivative.cropY': 'Tepi atas, dalam piksel',
  'mediaLib.derivative.cropWidth': 'Lebar potongan, dalam piksel',
  'mediaLib.derivative.cropHeight': 'Tinggi potongan, dalam piksel',
  'mediaLib.derivative.rotate': 'Putar',
  'mediaLib.derivative.rotateNone': 'Tanpa rotasi',
  'mediaLib.derivative.rotateDegrees': '{degrees} derajat searah jarum jam',
  'mediaLib.derivative.resizeWidth': 'Lebar baru, dalam piksel',
  'mediaLib.derivative.resizeHeight': 'Tinggi baru, dalam piksel',
  'mediaLib.derivative.lockRatio': 'Pertahankan bentuk saat saya mengubah satu sisi',
  'mediaLib.derivative.format': 'Simpan sebagai',
  'mediaLib.derivative.formatSame': 'Pertahankan format saat ini',
  'mediaLib.derivative.quality': 'Kualitas',
  'mediaLib.derivative.qualityHint':
    'Kualitas lebih rendah menghasilkan berkas lebih kecil. Berlaku untuk JPEG dan WebP. PNG tanpa kehilangan kualitas dan mengabaikannya.',
  'mediaLib.derivative.projected': 'Versi ini akan berukuran {width} kali {height} piksel.',
  'mediaLib.derivative.projectedUnavailable':
    'Ukuran versi ini tidak tersedia sampai versi itu dibuat.',

  'mediaLib.derivative.listHeading': 'Versi',
  'mediaLib.derivative.original': 'Asli',
  'mediaLib.derivative.originalHint': 'Selalu disimpan. Tidak pernah ditimpa.',
  'mediaLib.derivative.item': '{width} kali {height}, {mimeType}, {size}',
  'mediaLib.derivative.empty': 'Belum ada versi yang diedit. Aslinya adalah satu-satunya berkas di sini.',
  'mediaLib.derivative.select': 'Gunakan versi ini',
  'mediaLib.derivative.selected': 'Digunakan untuk postingan ini',
  'mediaLib.derivative.useOriginal': 'Gunakan yang asli',
  'mediaLib.derivative.processing': 'Versi ini sedang dibuat. Akan muncul di sini saat siap.',
  'mediaLib.derivative.alreadyExists':
    'Anda pernah membuat edit yang persis sama sebelumnya, jadi kami menggunakan kembali versi itu, bukan membuat versi kedua.',
  'mediaLib.derivative.failedTitle': 'Versi ini tidak dapat dibuat',
  'mediaLib.derivative.failedBody':
    'Tidak ada yang disimpan dan aslinya tidak tersentuh. Ubah nilainya dan coba lagi.',
  'mediaLib.derivative.openEditor': 'Edit {name}',

  'mediaLib.derivative.unsupportedTitle': 'Pengeditan hanya berlaku untuk gambar',
  'mediaLib.derivative.unsupportedBody':
    'Video, audio, dan dokumen tidak dapat diedit di sini. Siapkan berkas sebelum Anda mengunggahnya. Unggahan asli Anda tetap tidak berubah.',

  'mediaLib.derivative.nonGenerative':
    'Relay tidak menghasilkan gambar atau video. Editor ini hanya memotong, memutar, mengubah ukuran, mengonversi, dan mengompres apa yang Anda unggah.',

  'error.media_derivative_no_operations.message': 'Pilih setidaknya satu perubahan sebelum menyimpan versi.',
  'error.media_derivative_duplicate_operation.message':
    'Setiap jenis perubahan hanya dapat muncul sekali. Hapus {operation} yang kedua.',
  'error.media_derivative_crop_out_of_bounds.message':
    'Potongan itu melewati tepi gambar, yang berukuran {sourceWidth} kali {sourceHeight} piksel. Pindahkan atau perkecil.',
  'error.media_derivative_upscale_rejected.message':
    'Editor ini tidak pernah memperbesar gambar, karena piksel tambahan itu akan direkayasa, bukan milik Anda. Ukuran terbesar versi ini adalah {availableWidth} kali {availableHeight}.',
  'error.media_derivative_source_unsupported.message':
    'Pengeditan berlaku untuk gambar JPEG, PNG, WebP, dan GIF. Berkas ini adalah {mimeType}.',
  'error.media_derivative_dimensions_unknown.message':
    'Kami belum tahu ukuran gambar ini, jadi kami tidak dapat memeriksa perubahan itu. Coba lagi setelah pemrosesan selesai.',
  'error.media_derivative_format_required.message':
    'Pilih format untuk disimpan. Berkas {sourceMimeType} tidak dapat disimpan kembali sebagai dirinya sendiri di sini.',
  'error.media_derivative_quality_unsupported.message':
    'PNG tanpa kehilangan kualitas, jadi pengaturan kualitas tidak akan berpengaruh. Hapus itu, atau simpan sebagai JPEG atau WebP.',
  'error.media_derivative_no_change.message': 'Itu adalah format yang sudah digunakan berkas ini.',
  'error.media_derivative_source_unavailable.message':
    'Berkas asal versi ini tidak lagi ada di penyimpanan.',
  'error.media_derivative_preset_mismatch.message':
    'Permintaan edit ini tidak cocok dengan perubahan yang dijelaskannya. Tidak ada yang dibuat. Coba lagi dari editor.',
  'error.media_derivative_empty_result.message':
    'Editan tidak menghasilkan gambar, jadi tidak ada yang disimpan. Aslinya tidak tersentuh.',
  'error.media_derivative_transform_failed.message':
    'Gambar ini tidak dapat dibaca atau ditulis. Tidak ada yang disimpan dan aslinya tidak tersentuh.',
  'error.media_derivative_write_failed.message':
    'Versi ini tidak dapat direkam. Tidak ada yang disimpan dan aslinya tidak tersentuh.',
} as const;
