export const postingSetMessages = {
  'calendar.hold.action': 'Jeda',
  'calendar.hold.resumeAction': 'Lanjutkan',
  'calendar.hold.badge': 'Dijeda',
  'calendar.hold.badgeBilling': 'Dijeda oleh penagihan',
  'calendar.hold.term': 'Penahanan',
  'calendar.hold.byPerson': 'Dijeda oleh Anda pada {date}.',
  'calendar.hold.byBilling': 'Dijeda pada {date} karena ruang kerja ini kehilangan akses penuh.',
  'calendar.hold.none': 'Tidak dijeda',

  'calendar.hold.confirmTitle': 'Jeda postingan ini?',
  'calendar.hold.confirmBody':
    'Postingan ini akan tetap di tempatnya dan tidak akan terbit pada {time}. Anda dapat melanjutkannya kapan saja sebelum itu, atau pilih waktu baru jika waktu itu sudah lewat.',
  'calendar.hold.confirmScope':
    'Menjeda menghentikan apa yang belum terjadi. Apa pun yang sudah diterbitkan ke platform tetap diterbitkan, dan menjeda tidak menghapus atau mengeditnya.',
  'calendar.hold.confirmNoteLabel': 'Mengapa Anda menjeda ini? (opsional)',
  'calendar.hold.confirmNoteHint':
    'Disimpan dalam catatan audit untuk tim Anda. Tidak dikirim ke platform mana pun.',
  'calendar.hold.confirm': 'Jeda postingan ini',
  'calendar.hold.cancel': 'Biarkan terjadwal',

  'calendar.hold.resumeTitle': 'Lanjutkan postingan ini?',
  'calendar.hold.resumeBody': 'Akan terbit pada {time}, di {timeZone}.',
  'calendar.hold.resumeMissedTitle': 'Waktu itu sudah lewat',
  'calendar.hold.resumeMissedBody':
    'Postingan ini seharusnya terbit pada {time} saat dijeda. Pilih waktu baru agar tidak langsung terbit saat Anda melanjutkannya.',
  'calendar.hold.resumeTimeLabel': 'Waktu terbit baru',
  'calendar.hold.resumeConfirm': 'Lanjutkan',

  'calendar.hold.paused': 'Dijeda. Tidak akan terbit sampai Anda melanjutkannya.',
  'calendar.hold.resumed': 'Dilanjutkan. Akan terbit pada {time}.',

  'calendar.hold.blocked.published':
    'Postingan ini sudah terbit. Menjeda tidak dapat menariknya kembali dari platform.',
  'calendar.hold.blocked.inFlight':
    'Postingan ini sedang dikirim sekarang. Sudah terlambat untuk menjedanya, dan menghentikannya di tengah jalan dapat membuatnya terbit sebagian.',
  'calendar.hold.blocked.finished':
    'Postingan ini sudah selesai, jadi tidak ada yang perlu dijeda.',
  'calendar.hold.blocked.billing':
    'Postingan ini ditahan karena ruang kerja kehilangan akses penuh. Melanjutkannya adalah masalah penagihan, bukan penjadwalan.',
  'calendar.hold.blocked.billingAction': 'Buka penagihan',

  'set.title': 'Set Posting',
  'set.lede':
    'Jawaban tersimpan untuk "kepada siapa saya memposting ini, dan bagaimana caranya". Menerapkan Set menyalin pengaturannya ke draf baru.',
  'set.appliedOnce':
    'Set dibaca sekali, saat Anda menerapkannya. Mengeditnya nanti mengubah apa yang menjadi awal postingan berikutnya. Draf dan postingan terjadwal yang sudah Anda buat darinya tetap seperti apa adanya.',
  'set.empty.title': 'Belum ada Set',
  'set.empty.body':
    'Buat satu untuk berhenti membangun ulang daftar akun yang sama untuk setiap postingan.',
  'set.create': 'Set baru',
  'set.edit': 'Edit Set',
  'set.archive': 'Arsipkan Set',
  'set.archived': 'Diarsipkan',
  'set.archivedNote':
    'Set yang diarsipkan disembunyikan dari pemilih. Postingan yang dibuat darinya tidak berubah.',
  'set.showArchived': 'Tampilkan yang diarsipkan',
  'set.saved': 'Set disimpan.',
  'set.archivedToast': 'Set diarsipkan. Postingan yang sudah dibuat darinya tidak berubah.',

  'set.field.name': 'Nama',
  'set.field.nameHint': 'Yang akan Anda cari di pemilih. Satu per proyek.',
  'set.field.description': 'Deskripsi',
  'set.field.descriptionHint': 'Opsional. Untuk apa Set ini.',
  'set.field.targets': 'Akun',
  'set.field.targetsHint': 'Setiap akun yang menjadi awal postingan yang dibuat dari Set ini.',
  'set.field.targetCount': '{count, plural, =0 {Tidak ada akun} other {# akun}}',
  'set.field.signature': 'Tanda tangan',
  'set.field.signatureNone': 'Tanpa tanda tangan',
  'set.field.approval': 'Persetujuan',
  'set.field.approvalHint':
    'Persetujuan yang dibutuhkan postingan yang dibuat dari Set ini sebelum dapat diterbitkan.',
  'set.field.schedule': 'Kapan menerbitkan',

  'set.approval.none': 'Tidak perlu persetujuan',
  'set.approval.single_approver': 'Satu penyetuju bernama',
  'set.approval.any_approver': 'Penyetuju mana pun',
  'set.approval.named_approver': 'Penyetuju tertentu',
  'set.approval.policy_auto': 'Sesuai kebijakan ruang kerja',

  'set.slot.next_free_slot': 'Slot kosong berikutnya dari antrean',
  'set.slot.next_free_slotHint':
    'Menggunakan aturan antrean proyek ini untuk menawarkan waktu. Ini mengusulkan; Anda menerima.',
  'set.slot.pick_time': 'Minta saya untuk memilih waktu',
  'set.slot.pick_timeHint': 'Menerapkan Set membiarkan waktu kosong untuk Anda pilih.',
  'set.slot.draft_only': 'Biarkan sebagai draf',
  'set.slot.draft_onlyHint': 'Menerapkan Set tidak menyentuh jadwal sama sekali.',
  'set.slot.noRules':
    'Proyek ini belum memiliki aturan antrean, jadi antrean akan menawarkan jam kosong pertama dan mengatakannya.',
  'set.slot.rulesLink': 'Aturan antrean',

  'set.defaults.title': 'Bawaan per platform',
  'set.defaults.body':
    'Nilai awal yang disalin ke setiap postingan baru. Anda dapat mengubah salah satunya di penyusun setelahnya.',
  'set.defaults.add': 'Tambahkan platform',
  'set.defaults.remove': 'Hapus bawaan {platform}',
  'set.defaults.privacy': 'Privasi',
  'set.defaults.privacyNone': 'Bawaan platform',
  'set.defaults.bodyPrefix': 'Teks sebelum postingan',
  'set.defaults.bodySuffix': 'Teks setelah postingan',
  'set.defaults.requireAltText': 'Wajibkan teks alternatif pada setiap gambar',
  'set.defaults.requireAltTextHint':
    'Postingan yang dibuat dari Set ini tidak dapat dijadwalkan ke platform ini sampai setiap gambar memiliki teks alternatif.',
  'set.defaults.empty': 'Tidak ada bawaan per platform. Setiap akun mulai dari postingan utama.',

  'set.error.nameTaken': 'Set lain di proyek ini sudah menggunakan nama itu.',
  'set.error.archived': 'Set ini diarsipkan. Pulihkan sebelum mengeditnya.',
  'set.error.duplicateTarget': 'Akun itu sudah ada di Set ini.',
  'set.error.duplicatePlatform': 'Set ini sudah memiliki bawaan untuk platform itu.',

  'targetMemory.setting.title': 'Ingat akun antar postingan',
  'targetMemory.setting.body':
    'Saat ini aktif, penyusun memulai setiap postingan baru dengan akun yang dipilih orang itu terakhir kali di proyek ini. Nonaktif kecuali Anda mengaktifkannya.',
  'targetMemory.setting.stored':
    'Hanya daftar akun yang disimpan, dan hanya untuk orang yang memilihnya. Tidak ada keterangan, waktu, pengaturan privasi, atau status persetujuan yang disimpan, dan tidak ada orang lain di proyek yang dapat melihat daftar Anda.',
  'targetMemory.setting.offNote': 'Saat ini nonaktif, tidak ada yang disimpan sama sekali.',
  'targetMemory.setting.turnOffWarning':
    'Menonaktifkan ini menghapus setiap pilihan tersimpan di proyek ini, untuk semua orang.',
  'targetMemory.setting.enabled': 'Aktif',
  'targetMemory.setting.disabled': 'Nonaktif',
  'targetMemory.setting.saved': 'Pengaturan disimpan.',
  'targetMemory.setting.cleared':
    'Pengaturan disimpan. Pilihan tersimpan di proyek ini telah dihapus.',

  'targetMemory.composer.restored':
    '{count, plural, other {Dimulai dengan # akun dari terakhir kali.}}',
  'targetMemory.composer.droppedSome':
    '{count, plural, other {# akun yang Anda gunakan terakhir kali dikeluarkan karena perlu perhatian.}}',
  'targetMemory.composer.droppedAll':
    'Tidak ada akun yang Anda gunakan terakhir kali yang tersedia sekarang, jadi tidak ada yang dipilih sebelumnya.',
  'targetMemory.composer.undo': 'Hapus pilihan',
  'targetMemory.composer.forget': 'Berhenti mengingat akun saya',
  'targetMemory.composer.forgotten': 'Pilihan tersimpan Anda telah dihapus.',
  'targetMemory.composer.reviewAccounts': 'Tinjau akun',
} as const;
