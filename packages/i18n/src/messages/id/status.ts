/** id beta catalog namespace. */
export const statusMessages = {
  'empty.calendar.title': 'Belum ada yang dijadwalkan',
  'empty.calendar.body':
    'Tulis posting pertama Anda dan pilih waktu. Anda dapat mengubahnya nanti.',
  'empty.calendar.action': 'Buat postingan',
  'empty.drafts.title': 'Tidak ada konsep',
  'empty.drafts.body': 'Draf yang Anda simpan muncul di sini beserta target dan permasalahannya.',
  'empty.connections.title': 'Tidak ada akun yang terhubung',
  'empty.connections.body':
    'Hubungkan akun untuk mempublikasikannya. Kami menunjukkan kepada Anda izin persisnya terlebih dahulu.',
  'empty.connections.action': 'Hubungkan akun',
  'empty.analytics.title': 'Belum ada metrik',
  'empty.analytics.body':
    'Metrik muncul setelah postingan pertama Anda ditayangkan cukup lama sehingga platform dapat melaporkannya.',
  'empty.analytics.noPermission':
    'Akun ini belum memberikan akses analitik. Hubungkan kembali untuk menambahkannya.',
  'empty.approvals.title': 'Tidak ada yang menunggumu',
  'empty.approvals.body': 'Permintaan persetujuan untuk merek Anda muncul di sini.',
  'empty.library.title': 'Perpustakaan Anda kosong',
  'empty.library.body': 'Unggah gambar dan video, atau impor dari URL atau API.',
  'empty.library.action': 'Unggah media',
  'empty.automation.title': 'Belum ada aturan',
  'empty.automation.body':
    'Sebuah aturan bereaksi terhadap sesuatu dan mengusulkan suatu tindakan. Setiap aturan menunjukkan batasannya sebelum Anda mengaktifkannya.',
  'empty.webhooks.title': 'Tidak ada titik akhir',
  'empty.webhooks.body':
    'Tambahkan titik akhir untuk menerima peristiwa yang ditandatangani tentang penerbitan dan koneksi.',
  'empty.searchResults.title': 'Tidak ada hasil untuk {query}',
  'empty.searchResults.body': 'Periksa ejaannya, atau hapus filter.',
  'empty.filtered.title': 'Tidak ada yang cocok dengan filter ini',
  'empty.filtered.action': 'Hapus filter',
  'empty.auditLog.title': 'Belum ada aktivitas',
  'empty.receipts.title': 'Belum ada kuitansi',
  'empty.receipts.body':
    'Setiap publikasi menghasilkan tanda terima yang dapat Anda periksa dan bagikan.',
  'loading.default': 'Memuat',
  'loading.calendar': 'Memuat kalender Anda',
  'loading.analytics': 'Memuat metrik',
  'loading.preview': 'Membangun pratinjau',
  'loading.validating': 'Memeriksa terhadap batasan platform saat ini',
  'loading.publishing': 'Menerbitkan ke {provider}',
  'loading.uploading': 'Mengunggah {name}',
  'loading.uploadProgress': '{percent} diunggah',
  'loading.connecting': 'Menghubungkan ke {provider}',
  'loading.savingDraft': 'Menyimpan draf Anda',
  'loading.generatingPlan': 'Membangun rencana Anda',
  'loading.longRunning': 'Ini memakan waktu lebih lama dari biasanya. Ini masih berjalan.',
  'offline.banner': 'Anda sedang luring. Perubahan disimpan di perangkat ini.',
  'offline.draftSafe': 'Draf Anda aman. Ini disinkronkan ketika Anda kembali online.',
  'offline.publishDisabled':
    'Penerbitan membutuhkan koneksi. Ini tidak akan diantri secara diam-diam.',
  'offline.scheduleQueued':
    'Permintaan jadwal ini dimasukkan dalam antrean di perangkat ini dan akan dikirim saat Anda kembali online.',
  'offline.reconnected': 'Kembali daring. Menyinkronkan perubahan Anda.',
  'offline.syncConflict':
    'Beberapa perubahan tidak dapat digabungkan secara otomatis. Tinjaulah sebelum menyimpannya.',
  'permission.denied.title': 'Anda tidak memiliki akses ke ini',
  'permission.denied.role': 'Ini membutuhkan peran {role}. Anda adalah {currentRole}.',
  'permission.denied.scope': 'Kredensial ini memerlukan cakupan {scope}.',
  'permission.denied.contactOwner': 'Minta {owner} untuk mengabulkannya.',
  'permission.denied.projectScope': 'Akses Anda dibatasi hingga {projects}.',
  'permission.readOnly': 'Ruang kerja ini hanya dapat dibaca saat ini.',
  'permission.mfaRequired': 'Konfirmasikan dengan otentikasi dua faktor untuk melanjutkan.',
  'rateLimit.title': 'Pelan-pelan sejenak',
  'rateLimit.body': 'Anda telah membuat permintaan {count} di {window}. Batasnya adalah {limit}.',
  'rateLimit.resetsAt': 'Ini direset pada {time}.',
  'rateLimit.cheaperAlternative': 'Menjadwalkan alih-alih menerbitkan kini menghindari batas ini.',
  'rateLimit.providerCost':
    '{provider} dikenakan biaya per operasi. Tindakan ini diperkirakan sebesar {amount}.',
  'incident.providerDegraded':
    '{provider} mengalami masalah. Postingan terjadwal terus dicoba ulang.',
  'incident.providerDown':
    '{provider} tidak tersedia. Tidak ada yang hilang dan tidak ada yang terduplikasi.',
  'incident.isolated': 'Platform lain tidak terpengaruh.',
  'incident.statusPage': 'Status langsung berdasarkan konektor dan permukaan',
  'incident.startedAt': 'Memulai {relativeTime}',
  'translation.incomplete':
    'Beberapa teks di layar ini belum diterjemahkan ke dalam {language} dan ditampilkan dalam bahasa Inggris.',
  'translation.beta': 'Bahasa ini masih dalam versi beta. Laporkan apa pun yang salah baca.',
  'confirm.discardChanges.title': 'Hapus perubahan Anda?',
  'confirm.discardChanges.body': 'Hal ini tidak dapat dibatalkan.',
  'confirm.deleteItem.title': 'Hapus {name}?',
  'confirm.deleteItem.body': 'Hal ini tidak dapat dibatalkan.',
  'confirm.cancelScheduled.title': 'Batalkan postingan terjadwal ini?',
  'confirm.cancelScheduled.body':
    'Itu tidak akan dipublikasikan. Drafnya tetap di sini sehingga Anda dapat menjadwalkannya lagi.',
  'confirm.publishNow.title': 'Publikasikan sekarang?',
  'confirm.publishNow.body':
    '{count, plural, one {This publishes to # account immediately} other {This publishes to # accounts immediately}}. It cannot be recalled from Relay.',
  'confirm.typeToConfirm': 'Ketik {word} untuk mengonfirmasi.',
} as const;
