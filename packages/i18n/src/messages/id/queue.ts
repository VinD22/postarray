export const queueMessages = {
  'queue.title': 'Antrean posting',
  'queue.subtitle':
    'Kapan proyek ini bersedia memposting, dan seberapa berjauhan. Tidak ada yang terbit tanpa seseorang menerima waktunya.',

  'queue.rules.heading': 'Aturan antrean',
  'queue.rules.empty':
    'Belum ada aturan antrean. Sampai Anda menambahkan satu, slot berikutnya hanyalah jam kosong pertama.',
  'queue.rules.create': 'Aturan antrean baru',
  'queue.rules.count': '{count, plural, =0 {Tidak ada aturan} other {# aturan}}',
  'queue.rules.enabled': 'Digunakan',
  'queue.rules.disabled': 'Dijeda',
  'queue.rules.archived': 'Diarsipkan',
  'queue.rules.edit': 'Edit aturan',
  'queue.rules.archive': 'Arsipkan aturan',
  'queue.rules.archiveHelp':
    'Mengarsipkan menghentikan usulan mendatang. Slot yang sudah dipesan mempertahankan waktu dan alasannya.',

  'queue.field.name': 'Nama aturan',
  'queue.field.nameHelp': 'Nama yang akan Anda kenali nanti, misalnya Pagi hari kerja.',
  'queue.field.timeZone': 'Zona waktu',
  'queue.field.timeZoneHelp':
    'Jendela waktu, jumlah harian, dan tanggal larangan semuanya dibaca dalam zona ini.',
  'queue.field.minimumGap': 'Jeda minimum',
  'queue.field.minimumGapHelp': 'Menit antara dua postingan. Nol berarti tidak ada aturan jarak.',
  'queue.field.maximumPerDay': 'Maksimum per hari',
  'queue.field.maximumPerDayHelp':
    'Kosongkan untuk tanpa batas harian. Nol berarti aturan ini tidak mengusulkan apa pun.',
  'queue.field.maximumPerDayUnlimited': 'Tanpa batas harian',
  'queue.field.priority': 'Prioritas',
  'queue.field.priorityHelp':
    'Aturan prioritas tertinggi yang dapat menawarkan slot adalah yang digunakan.',
  'queue.field.enabled': 'Gunakan aturan ini',

  'queue.windows.heading': 'Jendela mingguan',
  'queue.windows.help':
    'Pilih jam lokal proyek ini boleh memposting. Gunakan kolom hari dan waktu, atau tombol pada grid.',
  'queue.windows.empty':
    'Belum ada jendela. Aturan tanpa jendela tidak pernah dapat menawarkan slot.',
  'queue.windows.add': 'Tambah jendela',
  'queue.windows.remove': 'Hapus jendela',
  'queue.windows.entry': '{weekday}, {start} sampai {end}',
  'queue.windows.start': 'Dari',
  'queue.windows.end': 'Sampai',
  'queue.windows.weekday': 'Hari',
  'queue.windows.toggleCell': '{weekday} pada {hour}',
  'queue.windows.gridLabel': 'Ketersediaan mingguan, satu tombol per hari dan jam',

  'queue.weekday.1': 'Senin',
  'queue.weekday.2': 'Selasa',
  'queue.weekday.3': 'Rabu',
  'queue.weekday.4': 'Kamis',
  'queue.weekday.5': 'Jumat',
  'queue.weekday.6': 'Sabtu',
  'queue.weekday.7': 'Minggu',

  'queue.blackouts.heading': 'Tanggal larangan',
  'queue.blackouts.help':
    'Tanggal proyek ini tidak akan memposting, dibaca dalam zona waktu aturan.',
  'queue.blackouts.empty': 'Tidak ada tanggal larangan.',
  'queue.blackouts.add': 'Tambah larangan',
  'queue.blackouts.remove': 'Hapus larangan',
  'queue.blackouts.from': 'Hari pertama',
  'queue.blackouts.to': 'Hari terakhir',
  'queue.blackouts.entry': '{from} sampai {to}',

  'queue.connections.heading': 'Akun',
  'queue.connections.all': 'Setiap akun di proyek ini',
  'queue.connections.scoped': '{count, plural, other {# akun}} yang berlaku untuk aturan ini',

  'queue.slot.heading': 'Slot antrean berikutnya',
  'queue.slot.action': 'Gunakan slot antrean berikutnya',
  'queue.slot.proposed': '{local} di {timeZone}',
  'queue.slot.utc': 'Itu adalah {utc} dalam UTC.',
  'queue.slot.why': 'Mengapa waktu ini',
  'queue.slot.accept': 'Gunakan waktu ini',
  'queue.slot.release': 'Pilih waktu lain',
  'queue.slot.expires': 'Usulan ini ditahan sampai {expires}.',
  'queue.slot.unavailable': 'Slot antrean tidak tersedia saat ini.',
  'queue.slot.pending': 'Mencari slot berikutnya.',
  'queue.slot.accepted': 'Dijadwalkan untuk {local} di {timeZone}.',
  'queue.slot.notAutomatic': 'Tidak ada yang dijadwalkan sampai Anda memilih waktu ini.',

  'queue.reason.noRulesConfigured':
    'Proyek ini tidak memiliki aturan antrean yang dikonfigurasi, jadi tidak ada jendela yang berlaku.',
  'queue.reason.fallbackFirstFreeHour':
    'Jam kosong pertama setelah sekarang digunakan sebagai gantinya.',
  'queue.reason.matchedRule': 'Aturan {name} memilih waktu ini, di {zone}.',
  'queue.reason.matchedWindow': 'Ini jatuh dalam jendela {start} sampai {end} di {zone}.',
  'queue.reason.minimumGap': 'Setidaknya {minutes} menit dari setiap postingan lain.',
  'queue.reason.noMinimumGap': 'Aturan ini tidak menetapkan jeda minimum antar postingan.',
  'queue.reason.dailyCap': 'Hari itu menampung paling banyak {limit} postingan, dan belum penuh.',
  'queue.reason.dailyCapUnlimited': 'Aturan ini tidak menetapkan batas harian.',
  'queue.reason.blackoutSkipped':
    '{days, plural, other {# hari larangan}} dilewati untuk mencapainya.',
  'queue.reason.dstNonexistentSkipped':
    'Waktu pertama dalam jendela tidak ada pada tanggal itu di {zone}, jadi waktu berikutnya yang ada digunakan.',
  'queue.reason.dstAmbiguousFirst':
    'Waktu lokal itu terjadi dua kali di {zone} pada tanggal itu. Kejadian pertama digunakan.',
  'queue.reason.priorityChosen':
    'Aturan ini memiliki prioritas {priority}, tertinggi yang dapat menawarkan.',
  'queue.reason.connectionScoped': 'Aturan ini mencakup {count, plural, other {# akun}}.',
  'queue.reason.horizonExhausted': 'Tidak ada jendela kosong dalam {days} hari.',
} as const;
