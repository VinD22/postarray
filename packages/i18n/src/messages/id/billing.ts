/** id beta catalog namespace. */
export const billingMessages = {
  'billing.title': 'Penagihan',
  'billing.plan.name': 'Post Array',
  'billing.plan.single': 'Satu rencana. Setiap fitur. Tidak ada tingkatan.',
  'billing.plan.monthlyPrice': '$29/bulan',
  'billing.plan.annualPrice': '$300/tahun',
  'billing.plan.annualFraming': '$25/bulan ditagih setiap tahun. Hemat $48/tahun.',
  'billing.plan.interval.monthly': 'Bulanan',
  'billing.plan.interval.annual': 'Tahunan',
  'billing.plan.selectInterval': 'Pilih interval penagihan',
  'billing.plan.includes.title': 'Apa yang disertakan',
  'billing.plan.includes.channels': 'Hingga 30 saluran sosial aktif',
  'billing.plan.includes.members': 'Anggota tim tidak terbatas',
  'billing.plan.includes.posts': 'Draf tak terbatas dan postingan terjadwal dalam penggunaan wajar',
  'billing.plan.includes.connectors': 'Setiap konektor yang disetujui',
  'billing.plan.includes.analytics': 'Analisis disimpan sejak Anda menghubungkan akun',
  'billing.plan.includes.api': 'REST API, server MCP jarak jauh, CLI, dan webhook',
  'billing.plan.includes.automation': 'Aturan otomatisasi, RSS autopost, dan tautan terlacak',
  'billing.plan.includes.ai': 'Bantuan teks DeepSeek di bawah batas penyalahgunaan dan biaya',
  'billing.plan.includes.support': 'Dukungan email dan aplikasi',
  'billing.plan.fairUse':
    'Penggunaan wajar berarti anti spam, kontrol tarif dan biaya penyedia yang melindungi akun Anda. Mereka bekerja sama untuk setiap pelanggan.',
  'billing.trial.dueToday': '$0 jatuh tempo hari ini',
  'billing.trial.paymentMethodRequired':
    'Polar mengumpulkan metode pembayaran sekarang dan tidak mengenakan biaya apa pun hari ini.',
  'billing.trial.firstCharge': 'Pengisian pertama {amount} pada {date}',
  'billing.trial.renewal': 'Perbarui {amount} setiap {interval} setelah itu',
  'billing.trial.cancelBefore':
    'Batalkan di Pengaturan sebelum tanggal ini dan Anda tidak akan dikenakan biaya.',
  'billing.trial.reminder': 'Polar mengirimi Anda email tiga hari sebelum uji coba diubah.',
  'billing.trial.daysRemaining':
    '{count, plural, =0 {Trial ends today} one {Trial, # day remaining} other {Trial, # days remaining}}',
  'billing.trial.converted': 'Uji coba Anda dikonversi pada {date}.',
  'billing.trial.canceled': 'Uji coba Anda dibatalkan. Anda tidak akan dikenakan biaya.',
  'billing.trial.abusePrevention':
    'Uji coba berulang terbatas. Jika uji coba tidak tersedia untuk akun ini, hubungi dukungan.',
  'billing.checkout.open': 'Lanjutkan ke pembayaran',
  'billing.checkout.hostedBy':
    'Pembayaran dan faktur ditangani oleh Polar, pedagang tercatat kami.',
  'billing.checkout.taxNote':
    'Polar mengumpulkan dan mengirimkan pajak penjualan atau PPN apa pun yang berlaku.',
  'billing.checkout.notEntitledYet':
    'Kami memberikan akses setelah Polar mengonfirmasi langganan, bukan dari pengalihan browser. Ini biasanya memakan waktu beberapa detik.',
  'billing.checkout.returning': 'Mengonfirmasi langganan Anda dengan Polar',
  'billing.subscription.status.trialing': 'Percobaan',
  'billing.subscription.status.active': 'Aktif',
  'billing.subscription.status.pastDue': 'Pembayaran terlambat',
  'billing.subscription.status.canceled': 'Dibatalkan',
  'billing.subscription.status.unpaid': 'Tidak dibayar',
  'billing.subscription.status.none': 'Tidak ada langganan',
  'billing.subscription.renewsOn': 'Memperbarui {amount} di {date}',
  'billing.subscription.endsOn': 'Akses berlanjut hingga {date}',
  'billing.subscription.pastDueBody':
    'Pembayaran terakhir tidak berhasil. Perbarui metode pembayaran untuk terus memublikasikan. Setelah masa tenggang, ruang kerja menjadi hanya baca dan postingan terjadwal berhenti.',
  'billing.subscription.readOnly':
    'Ruang kerja ini bersifat hanya baca. Konten, tanda terima, dan koneksi Anda masih utuh.',
  'billing.subscription.portal': 'Buka portal pelanggan Polar',
  'billing.subscription.invoices': 'Faktur',
  'billing.subscription.paymentMethod': 'Metode pembayaran',
  'billing.subscription.managedByPolar': 'Dikelola oleh Polar',
  'billing.cancel.title': 'Batalkan langganan Anda',
  'billing.cancel.beforeTrialEnd':
    'Batalkan sekarang dan Anda tidak akan dikenakan biaya. Anda menyimpan setiap fitur hingga {date}.',
  'billing.cancel.afterTrial':
    'Anda tetap memiliki akses hingga {date}. Tidak ada yang dihapus ketika itu berakhir.',
  'billing.cancel.confirm': 'Batalkan langganan',
  'billing.cancel.confirmed': 'Dibatalkan. Anda tidak akan dikenakan biaya.',
  'billing.cancel.keepData':
    'Draf, tanda terima, dan analisis Anda tetap berada di ruang kerja ini.',
  'billing.usage.title': 'Penggunaan',
  'billing.usage.meteredNote':
    'Beberapa biaya penyedia dibebankan pada biaya karena penyedia mengenakan biaya per operasi.',
  'billing.usage.xCharges':
    'X mengenakan biaya untuk setiap posting. Postingan yang berisi URL harganya lebih mahal daripada teks biasa.',
  'billing.usage.balance': 'Saldo pemakaian {amount}',
  'billing.usage.estimatedBeforeAction': 'Tindakan ini diperkirakan sebesar {amount}.',
  'billing.usage.periodTotal': '{amount} digunakan sejak {date}',
  'billing.usage.noMediaCredits':
    'Tidak ada kredit pembuatan gambar atau video, karena Post Array tidak menghasilkan media.',
  'billing.downgrade.overLimit':
    'This workspace has {count, plural, one {# channel} other {# channels}} over the limit. New actions on those channels are blocked. Nothing is disconnected for you.',
  'billing.mediaGeneration.title': 'Mengapa kami tidak menghasilkan gambar atau video',
  'billing.mediaGeneration.explanation':
    'Kami fokus membantu Anda merencanakan, menyetujui, menerbitkan, dan mempelajari. Kami tidak menghasilkan gambar atau video di V1 karena media siap merek memerlukan lebih dari sekadar perintah singkat: media tersebut memerlukan sistem visual lengkap Anda, detail produk yang akurat, aset berlisensi, orang dan izin penggunaan, serta peninjauan yang cermat. Model kreatif juga berubah dengan cepat. Kami merekomendasikan alat spesialis yang saat ini terverifikasi dan memudahkan untuk menghadirkan hasil akhir ke dalam kampanye Anda sambil tetap mengontrol materi iklan.',
  'billing.referral.title': 'Referensi',
  'billing.referral.disclosure':
    'Tautan rujukan harus diungkapkan di mana pun Anda membagikannya. Komisi tidak pernah bergantung pada tinjauan positif.',
  'billing.referral.link': 'Tautan referensi Anda',
  'billing.referral.attributed':
    '{count, plural, one {# attributed signup} other {# attributed signups}}',
  'billing.referral.commissionPending':
    'Menunggu keputusan, ditahan hingga periode pengembalian dana ditutup',
  'billing.referral.commissionApproved': 'Disetujui',
  'billing.referral.commissionReversed': 'Terbalik setelah pengembalian dana',
  'billing.referral.payout': 'Pembayaran dijalankan {schedule}.',
} as const;
