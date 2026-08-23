/** Weekly digest copy for the Indonesian interface. */
export const digestMessages = {
  'digest.title': 'Minggu ini',
  'digest.subtitle': 'Yang dapat kami lihat dari {windowStart} hingga {windowEnd}.',
  'digest.empty':
    'Belum ada yang dapat diringkas untuk minggu ini. Publikasikan sesuatu dan hasilnya akan muncul di sini.',
  'digest.regenerate': 'Buat ulang ringkasan minggu ini',
  'digest.generating': 'Membuat ringkasan minggu ini',
  'digest.source.deterministic':
    'Ditulis dari catatan publikasi dan pengukuran Anda sendiri, tanpa asisten penulisan.',
  'digest.source.ai':
    'Ditulis oleh asisten dari catatan Anda sendiri. Setiap angka sudah diperiksa berdasarkan catatan tersebut.',
  'digest.unavailable.aiOff':
    'Asisten penulisan sedang nonaktif, jadi ini adalah versi biasa. Tidak ada yang hilang.',
  'digest.unavailable.rejected':
    'Versi asisten tidak cocok dengan data Anda, jadi dibuang. Ini adalah versi biasa.',
  'digest.headline.published':
    '{published, plural, =0 {Tidak ada posting yang selesai} one {# posting selesai} other {# posting selesai}} antara {windowStart} dan {windowEnd}.',
  'digest.headline.nothingPublished':
    'Tidak ada yang dipublikasikan antara {windowStart} dan {windowEnd}.',
  'digest.outcome.published':
    '{count, plural, one {# posting selesai di {provider}} other {# posting selesai di {provider}}}.',
  'digest.outcome.partial':
    '{count, plural, one {# posting mencapai beberapa tujuannya di {provider}, tetapi tidak mencapai tujuan lainnya} other {# posting mencapai beberapa tujuannya di {provider}, tetapi tidak mencapai tujuan lainnya}}.',
  'digest.outcome.failed':
    '{count, plural, one {# posting tidak terkirim di {provider}} other {# posting tidak terkirim di {provider}}}.',
  'digest.metrics.noneYet':
    'Belum ada pengukuran yang masuk minggu ini. Artinya kami tidak tahu kinerja posting ini, bukan berarti kinerjanya buruk.',
  'digest.freshness.statement':
    '{label, select, fresh {Pengukuran terakhir disinkronkan pada {lastObservedAt}.} stale {Pengukuran belum disinkronkan sejak {lastObservedAt}, jadi angka di atas mungkin sudah tidak terbaru.} other {Belum ada yang disinkronkan, jadi tidak ada yang di atas yang terukur.}}',
  'digest.narrative.headline': '{statement}',
  'digest.narrative.observation': '{statement}',
  'digest.narrative.confounder': 'Perlu diketahui: {confounder}',
  'digest.narrative.notSupported': '{statement}',
  'digest.narrative.nextAction': '{statement}',
  'digest.settings.title': 'Email ringkasan mingguan',
  'digest.settings.description':
    'Email singkat setiap minggu berisi apa yang dipublikasikan dan apa yang dapat kami ukur. Aktif secara default.',
  'digest.settings.enabled': 'Kirim ringkasan mingguan',
  'email.digest.subject': 'Minggu Anda di {workspaceName}',
  'email.digest.intro':
    'Berikut yang dapat kami lihat untuk {workspaceName} antara {windowStart} dan {windowEnd}.',
  'email.digest.noData':
    'Kami tidak dapat mengukur apa pun minggu ini. Jika sebuah angka tidak ada, itu karena kami tidak dapat membacanya, bukan karena nilainya nol.',
  'email.digest.footer':
    'Anda menerima ini karena ringkasan mingguan aktif untuk {workspaceName}. Nonaktifkan di pengaturan ruang kerja.',
} as const;

