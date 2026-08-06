/** id beta catalog namespace. */
export const analyticsMessages = {
  'analytics.title': 'Analisis',
  'analytics.subtitle':
    'Apa yang terjadi, seberapa segarnya, dan apa yang layak untuk diuji selanjutnya.',
  'analytics.range.7d': '7 hari terakhir',
  'analytics.range.30d': '30 hari terakhir',
  'analytics.range.90d': '90 hari terakhir',
  'analytics.range.custom': 'Rentang khusus',
  'analytics.range.limitedByProvider':
    '{provider} returns at most {days, plural, one {# day} other {# days}} of history for this account.',
  'analytics.account.select': 'Pilih akun',
  'analytics.compareTo': 'Dibandingkan dengan {baseline}',
  'analytics.baseline.trailingMedian':
    'your median of the previous {count, plural, one {# comparable post} other {# comparable posts}}',
  'analytics.metric.followers': 'Pengikut',
  'analytics.metric.subscribers': 'Pelanggan',
  'analytics.metric.profileViews': 'Tampilan profil',
  'analytics.metric.impressions': 'Tayangan',
  'analytics.metric.reach': 'Jangkau',
  'analytics.metric.views': 'Tampilan',
  'analytics.metric.videoViews': 'Penayangan video',
  'analytics.metric.watchTime': 'Waktu menonton',
  'analytics.metric.averageViewDuration': 'Durasi penayangan rata-rata',
  'analytics.metric.averageViewPercentage': 'Persentase rata-rata dilihat',
  'analytics.metric.likes': 'Suka dan reaksi',
  'analytics.metric.comments': 'Komentar dan balasan',
  'analytics.metric.shares': 'Bagikan, posting ulang, dan kutipan',
  'analytics.metric.saves': 'Menyimpan dan menandai',
  'analytics.metric.linkClicks': 'Klik tautan',
  'analytics.metric.clickThroughRate': 'Rasio klik-tayang',
  'analytics.metric.engagementRate': 'Tingkat keterlibatan',
  'analytics.metric.publishedCount': 'Postingan diterbitkan',
  'analytics.metric.followerChange': 'Perubahan pengikut',
  'analytics.definition.title': 'Bagaimana {metric} didefinisikan',
  'analytics.definition.provider': 'Dilaporkan oleh {provider} sebagai {providerField}.',
  'analytics.definition.denominator.label': 'Penyebut: {denominator}.',
  'analytics.definition.unit': 'Satuan: {unit}.',
  'analytics.definition.normalized':
    'Dinormalisasi dari nilai penyedia. Nilai mentah disimpan dan tersedia.',
  'analytics.definition.notComparable':
    '{provider} dan {otherProvider} mendefinisikannya secara berbeda. Bandingkan dengan hati-hati.',
  'analytics.value.unavailable': 'Tidak tersedia',
  'analytics.value.unavailableReason.permission':
    'Akun ini belum memberikan izin yang diperlukan untuk metrik ini.',
  'analytics.value.unavailableReason.unsupported': '{provider} tidak melaporkan metrik ini.',
  'analytics.value.unavailableReason.tooEarly':
    '{provider} menerbitkan metrik ini nanti. Periksa lagi setelah {time}.',
  'analytics.value.unavailableReason.syncFailed':
    'Sinkronisasi terakhir gagal. Kami sedang mencoba ulang dan tidak akan menampilkan nomor tebakan.',
  'analytics.freshness.synced': '{relativeTime} yang disinkronkan',
  'analytics.freshness.stale':
    'Sinkronisasi terakhir yang berhasil {relativeTime}. Ini mungkin sudah ketinggalan jaman.',
  'analytics.freshness.coverage':
    '{covered} dari postingan {total} dalam rentang ini memiliki data terkini.',
  'analytics.feedback.title': 'Apa yang disarankan di sini',
  'analytics.feedback.aboveBaseline':
    'Postingan ini menerima {percent} lebih banyak {metric} daripada {baseline}.',
  'analytics.feedback.belowBaseline':
    'Postingan ini menerima {percent} lebih sedikit {metric} dibandingkan {baseline}.',
  'analytics.feedback.notComparableFormats':
    'Postingan gambar dan postingan video tidak dapat dibandingkan secara langsung di sini.',
  'analytics.feedback.smallSample':
    'Sampelnya kecil. Uji kembali pengait yang sama sebelum menarik kesimpulan.',
  'analytics.feedback.association':
    'Komentar bertambah setelah penundaan komentar pertama diubah dari {before} menjadi {after}. Ini adalah sebuah asosiasi, bukan bukti sebab.',
  'analytics.feedback.nextTest': 'Apa yang harus diuji selanjutnya',
  'analytics.feedback.doNotInfer': 'Ini tidak menunjukkan apa pun',
  'analytics.feedback.noScore':
    'Tidak ada skor lintas platform tunggal di sini. Pilih metrik dengan definisi yang Anda percayai.',
  'analytics.experiment.title': 'Eksperimen',
  'analytics.experiment.hypothesis': 'Hipotesis',
  'analytics.experiment.variants': 'Varian',
  'analytics.experiment.successMetric': 'Metrik keberhasilan',
  'analytics.experiment.window': 'Jendela pengukuran',
  'analytics.experiment.status.running': 'Berjalan sampai {date}',
  'analytics.experiment.status.complete': 'Lengkap',
  'analytics.experiment.tagBeforePublishing':
    'Beri tag pada eksperimen sebelum dipublikasikan sehingga perbandingan tidak dilakukan setelah faktanya.',
  'analytics.experiment.caveats': 'Peringatan',
  'analytics.export.title': 'Ekspor',
  'analytics.export.csv': 'Unduh CSV',
  'analytics.export.json': 'Unduh JSON',
  'analytics.export.providerRestriction':
    '{provider} membatasi bagaimana datanya dapat digabungkan atau disimpan. Beberapa bidang tidak disertakan.',
  'analytics.links.title': 'Tautan yang dilacak',
  'analytics.links.subtitle':
    'Pengukuran pengalihan pihak pertama. Ini adalah rangkaian terpisah dari klik tautan yang dilaporkan platform.',
  'analytics.links.destination': 'Tujuan',
  'analytics.links.shortUrl': 'URL pendek',
  'analytics.links.totalRequests': 'Jumlah permintaan',
  'analytics.links.humanClicks': 'Klik yang dihapus duplikatnya',
  'analytics.links.suspectedBots': 'Diduga bot',
  'analytics.links.referrerClass': 'Perujuk',
  'analytics.links.deviceClass': 'Perangkat',
  'analytics.links.country': 'Negara',
  'analytics.links.lastEvent': 'Terakhir klik {relativeTime}',
  'analytics.links.privacyNote':
    'Kami hanya mempertahankan lokasi kasar dan kelas perangkat. Alamat IP mentah disimpan sebentar untuk penyalahgunaan dan deteksi duplikat, lalu dibuang.',
  'analytics.links.separateSources':
    'Jangan tambahkan klik ini ke nomor yang dilaporkan platform. Mereka menghitung hal yang berbeda.',
} as const;
