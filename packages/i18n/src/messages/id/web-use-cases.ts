export const webUseCaseMessages = {
  'web.meta.useCases.title': 'Kasus penggunaan',
  'web.meta.useCases.description':
    'Tiga alur kerja tempat produk ini dibangun: menjalankan beberapa klien di satu tempat, membuat pekerjaan disetujui sebelum diterbitkan, dan membawa satu ide ke beberapa platform tanpa menulis ulang.',
  'web.meta.useCase.clients.title': 'Mengelola beberapa klien',
  'web.meta.useCase.clients.description':
    'Proyek terpisah, akun terhubung terpisah, persetujuan terpisah, dan pelaporan terpisah, untuk tim yang menerbitkan atas nama orang lain.',
  'web.meta.useCase.approvals.title': 'Alur kerja persetujuan',
  'web.meta.useCase.approvals.description':
    'Bagaimana draf menjadi postingan yang disetujui: siapa yang meninjaunya, apa yang membatalkan persetujuan, dan mengapa aturan yang sama berlaku di setiap permukaan.',
  'web.meta.useCase.crossPlatform.title': 'Penerbitan lintas platform',
  'web.meta.useCase.crossPlatform.description':
    'Satu draf utama, satu versi yang disesuaikan per platform, divalidasi terhadap batas tercatat setiap platform sebelum apa pun dijadwalkan.',

  'web.useCases.index.title': 'Kasus penggunaan',
  'web.useCases.index.lede':
    'Tiga alur kerja tempat produk ini dibangun. Setiap halaman mengatakan apa yang alur kerja itu biayakan pada tim hari ini, bagaimana produk dirancang untuk menanganinya, dan bagian mana yang benar-benar dibangun.',
  'web.useCases.index.listLabel': 'Kasus penggunaan',

  'web.useCases.notice.title': 'Ini menjelaskan sebuah rancangan, bukan layanan yang berjalan',
  'web.useCases.notice.body':
    'Belum ada konektor yang diverifikasi dalam produksi, jadi tidak ada yang terbit ke mana pun dari halaman ini. Di mana bagian dari alur kerja sudah dibangun, halaman ini mengatakannya. Di mana belum, halaman ini juga mengatakannya.',

  'web.useCases.section.problem': 'Masalahnya',
  'web.useCases.section.approach': 'Bagaimana produk dirancang',
  'web.useCases.section.today': 'Apa yang sebenarnya dibangun',
  'web.useCases.section.related': 'Terkait',

  'web.useCases.clients.title': 'Mengelola beberapa klien',
  'web.useCases.clients.lede':
    'Pekerjaan untuk satu klien tidak boleh hanya satu klik yang salah dari pembaca klien lain.',
  'web.useCases.clients.problem':
    'Sebagian besar tim memisahkan klien dengan bersikap hati-hati. Satu akun bersama memegang setiap halaman terhubung, satu kalender memegang setiap jadwal, dan satu-satunya yang berdiri antara draf klien dan pembaca yang salah adalah orang yang melihat layar pada pukul 6 sore. Ketika seseorang meninggalkan tim, pemisahan itu ikut hilang bersama kebiasaannya.',
  'web.useCases.clients.approach1':
    'Proyek adalah unit pemisahan. Akun terhubung, draf, antrean, media, dan tanda terima menjadi milik proyek, dan anggota hanya melihat proyek tempat mereka ditambahkan.',
  'web.useCases.clients.approach2':
    'Pemisahan ini diberlakukan tiga kali: saat autentikasi, di dalam layanan aplikasi yang mengotorisasi tindakan, dan di dalam basis data itu sendiri melalui keamanan tingkat baris. Masuk tidak pernah dianggap sebagai izin.',
  'web.useCases.clients.approach3':
    'Pelaporan mengikuti batas yang sama, sehingga laporan per klien adalah bentuk bawaan, bukan spreadsheet yang dirakit seseorang secara manual.',
  'web.useCases.clients.today':
    'Proyek, keanggotaan yang dibatasi proyek, dan kebijakan keamanan tingkat baris di baliknya sudah dibangun dan diuji, termasuk pengujian yang mencoba pembacaan lintas proyek dan memastikan gagal. Paket ditentukan berdasarkan berapa banyak proyek yang dibutuhkan tim. Belum ada yang terbit ke platform dari proyek mana pun.',

  'web.useCases.approvals.title': 'Alur kerja persetujuan',
  'web.useCases.approvals.lede':
    'Persetujuan hanya berarti sesuatu jika yang disetujui adalah yang benar-benar terbit.',
  'web.useCases.approvals.problem':
    'Persetujuan biasanya berada di luar alat yang menerbitkan. Tangkapan layar dikirim ke klien, klien membalas ya, lalu teksnya berubah. Persetujuan sekarang merujuk pada draf yang tidak dimiliki siapa pun, dan alat itu tidak tahu, jadi ia menerbitkan apa pun yang terakhir diberikan.',
  'web.useCases.approvals.approach1':
    'Persetujuan dilampirkan pada konten persis yang ditinjau. Mengedit draf yang disetujui membatalkan persetujuan dan mengatakan bidang mana yang berubah, alih-alih diam-diam membawa keputusan lama ke depan.',
  'web.useCases.approvals.approach2':
    'Peninjau dapat menyetujui, meminta perubahan, atau menolak, dan komentar diwajibkan untuk apa pun selain persetujuan, sehingga penulis tidak pernah dibiarkan menebak apa yang harus diperbaiki.',
  'web.useCases.approvals.approach3':
    'Aturan ini berada di lapisan aplikasi bersama, sehingga aplikasi web, REST API, server MCP, CLI, dan webhook semuanya mematuhinya. Tidak ada permukaan yang memiliki jalan pintas untuk melewati tinjauan.',
  'web.useCases.approvals.today':
    'Status persetujuan, permukaan tinjauan, aturan persetujuan ulang, dan peristiwa audit di baliknya sudah dibangun. Yang belum dibangun adalah langkah terakhir, karena belum ada konektor yang menyelesaikan definisi selesainya, jadi postingan yang disetujui belum memiliki tujuan.',

  'web.useCases.crossPlatform.title': 'Penerbitan lintas platform',
  'web.useCases.crossPlatform.lede':
    'Satu ide, satu edit, dan versi per platform yang menghormati apa yang benar-benar diterima platform itu.',
  'web.useCases.crossPlatform.problem':
    'Memposting teks yang sama di mana-mana menghasilkan versi yang dipotong di satu platform, kehilangan judul wajib di platform lain, dan membawa tautan yang secara diam-diam dihapus platform ketiga. Alternatifnya, menulis ulang dengan tangan lima kali, adalah tempat pekerjaan itu sebenarnya pergi.',
  'web.useCases.crossPlatform.approach1':
    'Draf utama memegang ide. Setiap akun yang dipilih mendapatkan versinya sendiri, dan edit pada draf utama hanya berlaku di mana cocok, mengatakan dengan jelas target mana yang tidak dapat menerimanya dan mengapa.',
  'web.useCases.crossPlatform.approach2':
    'Validasi berjalan terhadap batas tercatat untuk setiap platform, dihitung dengan cara platform itu menghitung, sehingga batas karakter diperiksa dalam grafem di mana platform menggunakan grafem dan dalam unit berbobot di mana platform menggunakan itu.',
  'web.useCases.crossPlatform.approach3':
    'Setiap batas platform yang ditampilkan di mana pun di situs ini dihasilkan dari registri konektor dan membawa dokumen asalnya dan tanggal seseorang membacanya.',
  'web.useCases.crossPlatform.today':
    'Penyusun, versi per target, aturan validasi, dan kumpulan data batas yang dihasilkan sudah dibangun. Langkah penerbitan belum: belum ada konektor yang diverifikasi dalam produksi, jadi draf yang divalidasi dapat dijadwalkan secara internal dan tidak dapat mencapai platform.',
} as const;
