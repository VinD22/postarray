export const validationMessages = {
  'validation.text_required.message': '{provider} 要求此貼文類型含有文字。',
  'validation.text_too_long.message': '{over, plural, other {超過 {account} 的字元限制 # 個字元}}',
  'validation.text_too_long.hint': '{provider} 允許此帳號使用 {limit} 個字元。',
  'validation.text_too_short.message': '{provider} 在此至少需要 {min} 個字元。',
  'validation.title_required.message': '{provider} 要求標題。',
  'validation.title_too_long.message': '標題超過 {limit} 個字元的限制。',
  'validation.description_too_long.message': '說明超過 {limit} 個字元的限制。',
  'validation.media_required.message': '{provider} 要求此貼文類型至少包含一張圖片或一部影片。',
  'validation.media_count_exceeded.message':
    '{provider} 在此最多接受 {limit, plural, other {# 個檔案}}。此貼文有 {count} 個。',
  'validation.media_type_unsupported.message': '{provider} 不接受 {mimeType} 檔案。',
  'validation.media_aspect_ratio_unsupported.message':
    '此檔案比例為 {actual}。{provider} 需要介於 {min} 與 {max} 的比例。',
  'validation.media_aspect_ratio_unsupported.hint': '使用平台預設裁切即可修正。',
  'validation.media_resolution_too_low.message':
    '此檔案為 {actual}。{provider} 至少需要 {required}。',
  'validation.media_duration_too_long.message':
    '此影片為 {actual}。{provider} 對此帳號最多接受 {limit}。',
  'validation.media_duration_too_short.message': '此影片為 {actual}。{provider} 至少需要 {limit}。',
  'validation.media_file_too_large.message': '此檔案為 {actual}。{provider} 最多接受 {limit}。',
  'validation.media_mixed_types_unsupported.message':
    '{provider} 無法在同一篇貼文中發布圖片和影片。',
  'validation.media_unavailable.message': '附加的檔案已不再可用。請將其從貼文中移除，或重新上傳。',
  'validation.alt_text_missing.message': '{count, plural, other {# 張圖片缺少替代文字}}。',
  'validation.alt_text_missing.hint': '描述圖片，或標示為裝飾用途。',
  'validation.thumbnail_unsupported.message': '{provider} 在此不接受自訂縮圖。',
  'validation.destination_required.message': '選擇要在 {provider} 的何處發布。',
  'validation.destination_unsupported.message':
    '{destination} 不接受在 {provider} 上發布此貼文類型。',
  'validation.mention_unresolved.message': '{count, plural, other {# 個提及尚未比對到真實帳號}}。',
  'validation.mention_unresolved.hint':
    '從搜尋結果選取帳號，或移除提及。純文字絕不會發布為原生標籤。',
  'validation.hashtag_count_exceeded.message':
    '{count} 個雜湊標籤。{provider} 將超過 {limit} 視為垃圾內容。',
  'validation.link_not_allowed.message': '{provider} 不允許此欄位使用連結。',
  'validation.link_destination_unverified.message': '連結網域 {domain} 尚未針對此 Workspace 驗證。',
  'validation.privacy_setting_required.message': '{provider} 要求在發布前明確選擇隱私權設定。',
  'validation.privacy_setting_required.hint': '沒有預設值。請選擇誰可以看到此貼文。',
  'validation.disclosure_required.message': '依 {market} 的專案規則，此貼文需要揭露。',
  'validation.first_comment_unsupported.message': '{provider} 不支援此帳號排程首則留言。',
  'validation.thread_unsupported.message': '{provider} 不支援此帳號的討論串。',
  'validation.repeat_end_required.message': '重複貼文需要結束日期或重複次數。',
  'validation.schedule_in_past.message': '此時間在 {timeZone} 已過去。',
  'validation.schedule_too_far_ahead.message':
    '貼文最多可提前 {limit} 排程，上傳的媒體檔案也保留相同的時間。',
  'validation.schedule_outside_quiet_hours.message': '這落在為 {project} 設定的安靜時段內。',
  'validation.duplicate_within_window.message':
    '在 {window} 內，已有非常相似的內容為 {account} 排程或發布。',
  'validation.blocked_term_present.message': '文字包含 {project} 的封鎖詞彙。',
  'validation.unsupported_claim.message': '此聲明不在 {project} 的核准聲明中。',
  'validation.unsupported_claim.hint': '以證據加入核准聲明，或改寫此句。',
  'validation.cadence_exceeded.message':
    '{account} 當天會發布 {count, plural, other {# 次}}，超過 {limit} 的限制。',
  'validation.connection_paused.message': '{account} 已暫停，不會發布。',
  'validation.account_type_invalid.message':
    '{account} 並非 {provider} 對此貼文類型要求的帳號類型。',
  'validation.severity.error': '必須修正',
  'validation.severity.warning': '請檢查',
  'validation.severity.info': '供你參考',
  'validation.field.required': '此欄位為必填。',
  'validation.field.tooShort': '至少使用 {min, plural, other {# 個字元}}。',
  'validation.field.tooLong': '最多使用 {max, plural, other {# 個字元}}。',
  'validation.field.invalidEmail': '輸入有效的電子郵件地址。',
  'validation.field.invalidUrl': '輸入包含 https 的完整 URL。',
  'validation.field.invalidDate': '輸入有效日期。',
  'validation.field.invalidTime': '輸入有效時間。',
  'validation.field.invalidNumber': '輸入數字。',
  'validation.field.outOfRange': '輸入介於 {min} 與 {max} 的值。',
  'validation.field.mustMatch': '這兩個值必須相符。',
  'validation.field.alreadyTaken': '此值已在使用中。',
  'validation.field.unsafeValue': '此值不可在此使用。',
} as const;
