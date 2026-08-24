/** id beta catalog namespace. */
export const validationMessages = {
  'validation.text_required.message':
    '{provider} memerlukan beberapa teks untuk jenis posting ini.',
  'validation.text_too_long.message':
    '{over, plural, one {# character over the limit for {account}} other {# characters over the limit for {account}}}',
  'validation.text_too_long.hint': '{provider} mengizinkan karakter {limit} untuk akun ini.',
  'validation.text_too_short.message': '{provider} memerlukan setidaknya karakter {min} di sini.',
  'validation.title_required.message': '{provider} membutuhkan judul.',
  'validation.title_too_long.message': 'Judul melebihi batas karakter {limit}.',
  'validation.description_too_long.message': 'Deskripsi melebihi batas karakter {limit}.',
  'validation.media_required.message':
    '{provider} memerlukan setidaknya satu gambar atau video untuk jenis postingan ini.',
  'validation.media_count_exceeded.message':
    '{provider} accepts at most {limit, plural, one {# file} other {# files}} here. This post has {count}.',
  'validation.media_type_unsupported.message': '{provider} tidak menerima file {mimeType}.',
  'validation.media_aspect_ratio_unsupported.message':
    'File ini adalah {actual}. {provider} membutuhkan rasio antara {min} dan {max}.',
  'validation.media_aspect_ratio_unsupported.hint':
    'Pangkas dengan platform yang telah ditetapkan untuk memperbaikinya.',
  'validation.media_resolution_too_low.message':
    'File ini adalah {actual}. {provider} membutuhkan setidaknya {required}.',
  'validation.media_duration_too_long.message':
    'Video ini adalah {actual}. {provider} menerima hingga {limit} untuk akun ini.',
  'validation.media_duration_too_short.message':
    'Video ini adalah {actual}. {provider} membutuhkan setidaknya {limit}.',
  'validation.media_file_too_large.message':
    'File ini adalah {actual}. {provider} menerima hingga {limit}.',
  'validation.media_mixed_types_unsupported.message':
    '{provider} tidak dapat mempublikasikan gambar dan video di postingan yang sama.',
  'validation.alt_text_missing.message':
    'Alt text is missing on {count, plural, one {# image} other {# images}}.',
  'validation.alt_text_missing.hint':
    'Deskripsikan gambar tersebut, atau tandai sebagai gambar dekoratif.',
  'validation.thumbnail_unsupported.message': '{provider} tidak menerima thumbnail khusus di sini.',
  'validation.destination_required.message': 'Pilih tempat penerbitannya di {provider}.',
  'validation.destination_unsupported.message':
    '{destination} tidak menerima jenis posting ini di {provider}.',
  'validation.mention_unresolved.message':
    '{count, plural, one {# mention has not been matched to a real account} other {# mentions have not been matched to real accounts}}.',
  'validation.mention_unresolved.hint':
    'Pilih akun dari hasil pencarian, atau hapus penyebutannya. Teks biasa tidak pernah dipublikasikan sebagai tag asli.',
  'validation.hashtag_count_exceeded.message':
    'Tagar {count}. {provider} dihitung lebih banyak daripada {limit} sebagai spam.',
  'validation.link_not_allowed.message': '{provider} tidak mengizinkan tautan di bidang ini.',
  'validation.link_destination_unverified.message':
    'Domain tautan {domain} tidak diverifikasi untuk ruang kerja ini.',
  'validation.privacy_setting_required.message':
    '{provider} memerlukan pilihan privasi eksplisit sebelum dipublikasikan.',
  'validation.privacy_setting_required.hint':
    'Tidak ada standarnya. Pilih siapa yang dapat melihat postingan ini.',
  'validation.disclosure_required.message':
    'Postingan ini memerlukan pengungkapan berdasarkan aturan proyek untuk {market}.',
  'validation.first_comment_unsupported.message':
    '{provider} tidak mendukung komentar pertama yang dijadwalkan untuk akun ini.',
  'validation.thread_unsupported.message': '{provider} tidak mendukung thread untuk akun ini.',
  'validation.repeat_end_required.message':
    'Postingan yang berulang memerlukan tanggal akhir atau beberapa pengulangan.',
  'validation.schedule_in_past.message': 'Waktu itu telah berlalu di {timeZone}.',
  'validation.schedule_too_far_ahead.message':
    'Postingan dapat dijadwalkan hingga {limit} sebelumnya, yang juga merupakan lama media yang diunggah disimpan.',
  'validation.schedule_outside_quiet_hours.message':
    'Ini termasuk dalam jam tenang yang ditetapkan untuk {project}.',
  'validation.duplicate_within_window.message':
    'Konten yang sangat mirip telah dijadwalkan atau diterbitkan untuk {account} dalam {window}.',
  'validation.blocked_term_present.message': 'Teks berisi istilah yang diblokir untuk {project}.',
  'validation.unsupported_claim.message':
    'Klaim ini tidak termasuk dalam klaim yang disetujui untuk {project}.',
  'validation.unsupported_claim.hint':
    'Tambahkan ke klaim yang disetujui dengan bukti, atau susun ulang kalimatnya.',
  'validation.cadence_exceeded.message':
    '{account} would publish {count, plural, one {# time} other {# times}} that day, over the limit of {limit}.',
  'validation.connection_paused.message': '{account} dijeda dan tidak akan dipublikasikan.',
  'validation.account_type_invalid.message':
    '{account} bukan jenis akun yang dibutuhkan {provider} untuk jenis posting ini.',
  'validation.severity.error': 'Harus diperbaiki',
  'validation.severity.warning': 'Periksa ini',
  'validation.severity.info': 'Untuk informasi Anda',
  'validation.field.required': 'Bidang ini wajib diisi.',
  'validation.field.tooShort':
    'Use at least {min, plural, one {# character} other {# characters}}.',
  'validation.field.tooLong': 'Use at most {max, plural, one {# character} other {# characters}}.',
  'validation.field.invalidEmail': 'Masukkan alamat email yang valid.',
  'validation.field.invalidUrl': 'Masukkan URL lengkap, termasuk https.',
  'validation.field.invalidDate': 'Masukkan tanggal yang valid.',
  'validation.field.invalidTime': 'Masukkan waktu yang valid.',
  'validation.field.invalidNumber': 'Masukkan nomor.',
  'validation.field.outOfRange': 'Masukkan nilai antara {min} dan {max}.',
  'validation.field.mustMatch': 'Kedua nilai ini harus cocok.',
  'validation.field.alreadyTaken': 'Itu sudah digunakan.',
  'validation.field.unsafeValue': 'Nilai itu tidak diperbolehkan di sini.',
} as const;
