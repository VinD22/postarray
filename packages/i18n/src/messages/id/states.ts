/** id beta catalog namespace. */
export const stateMessages = {
  'state.draft.label': 'Draf',
  'state.draft.description':
    'Hanya orang-orang di ruang kerja ini yang dapat melihatnya. Tidak ada yang dijadwalkan.',
  'state.validation_needed.label': 'Diperlukan validasi',
  'state.validation_needed.description':
    'Satu atau beberapa target mempunyai masalah yang harus diperbaiki sebelum dapat dijadwalkan.',
  'state.approval_requested.label': 'Persetujuan diminta',
  'state.approval_requested.description': 'Menunggu {approver} untuk memutuskan.',
  'state.approved.label': 'Disetujui',
  'state.approved.description':
    'Disetujui oleh {approver}. Sekarang dapat dijadwalkan atau dipublikasikan.',
  'state.scheduled.label': 'Dijadwalkan',
  'state.scheduled.description': 'Menerbitkan {time} di {timeZone}.',
  'state.preparing_media.label': 'Mempersiapkan media',
  'state.preparing_media.description': 'Mengunggah dan mengonversi file untuk platform.',
  'state.dispatching.label': 'Pengiriman',
  'state.dispatching.description': 'Mengirim ke {provider} sekarang.',
  'state.provider_processing.label': 'Pemrosesan penyedia',
  'state.provider_processing.description':
    '{provider} menerima unggahan tersebut dan masih memprosesnya. Kami mengonfirmasi saat siaran langsung.',
  'state.published.label': 'Diterbitkan',
  'state.published.description': 'Langsung di {provider} sejak {time}.',
  'state.partially_published.label': 'Diterbitkan sebagian',
  'state.partially_published.description':
    '{published, plural, one {# target published} other {# targets published}}, {failed, plural, one {# failed} other {# failed}}. The published posts are live and were not rolled back.',
  'state.action_required.label': 'Diperlukan tindakan',
  'state.action_required.description': 'Ini tidak dapat berlanjut sampai Anda melakukan sesuatu.',
  'state.retry_scheduled.label': 'Percobaan ulang dijadwalkan',
  'state.retry_scheduled.description':
    'Percobaan {attempt} dari {max} akan dijalankan di {time}. Tidak ada yang diduplikasi.',
  'state.failed_permanently.label': 'Gagal',
  'state.failed_permanently.description':
    'Ini tidak akan dicoba lagi. Konten Anda dipertahankan dan alasannya ada pada tanda terima.',
  'state.canceled.label': 'Dibatalkan',
  'state.canceled.description':
    'Dibatalkan oleh {actor} pada {date}. Tidak ada yang dipublikasikan.',
  'state.deleted_externally.label': 'Dihapus di platform',
  'state.deleted_externally.description':
    'Postingan ini tidak lagi ada di {provider}. Tanda terima dan metrik yang dikumpulkan sebelum dikirim disimpan.',
  'state.approval.not_required.label': 'Tidak diperlukan persetujuan',
  'state.approval.not_required.description':
    'Kebijakan untuk target ini tidak memerlukan persetujuan.',
  'state.approval.requested.label': 'Diminta',
  'state.approval.requested.description': 'Dikirim ke {approver} {relativeTime}.',
  'state.approval.in_review.label': 'Dalam ulasan',
  'state.approval.in_review.description': '{approver} sedang melihat ini sekarang.',
  'state.approval.approved.label': 'Disetujui',
  'state.approval.approved.description': 'Disetujui oleh {approver} pada {date}.',
  'state.approval.changes_requested.label': 'Perubahan diminta',
  'state.approval.changes_requested.description': '{approver} meminta perubahan pada {date}.',
  'state.approval.rejected.label': 'Ditolak',
  'state.approval.rejected.description': 'Ditolak oleh {approver} di {date}.',
  'state.approval.expired.label': 'Kedaluwarsa',
  'state.approval.expired.description': 'Permintaan ini berakhir pada {date} tanpa keputusan.',
  'state.approval.withdrawn.label': 'Ditarik',
  'state.approval.withdrawn.description': 'Penulis menarik permintaan ini pada {date}.',
  'state.summary.targets':
    '{ready, plural, one {# target ready} other {# targets ready}}, {blocked, plural, =0 {none blocked} one {# blocked} other {# blocked}}',
  'state.changedAt': 'Mengubah {relativeTime}',
} as const;
