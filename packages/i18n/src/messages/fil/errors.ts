/**
 * One entry per `RelayError` code.
 *
 * Every code has `error.<code>.message`, the sentence a person reads, and
 * `error.<code>.action`, what they can do next. Messages name the account or
 * the action. They never leak a provider payload, a token or an internal ID.
 */
export const errorMessages = {
  'error.unknown.message': 'May nangyaring mali at hindi namin ma-classify ito.',
  'error.unknown.action':
    'Subukan muli. Kung patuloy itong nangyayari, ipadala sa amin ang sanggunian sa ibaba.',
  'error.internal.message': 'Ito ay isang problema sa aming panig, hindi sa iyong nilalaman.',
  'error.internal.action':
    'Ang iyong gawa ay nai-save. Naalerto na kami. Subukang muli sa loob ng ilang minuto.',
  'error.not_implemented.message': 'Hindi pa ito nagagawa ng Post Array.',
  'error.not_implemented.action': 'Sundin ang changelog kung kailan ito ipapadala.',
  'error.offline.message': 'Offline ka.',
  'error.offline.action':
    'Ang iyong draft ay pinananatili sa device na ito. Ipagpatuloy ang pag-publish at pag-iskedyul kapag bumalik ang koneksyon.',
  'error.network_unreachable.message': 'Hindi namin maabot ang server.',
  'error.network_unreachable.action': 'Suriin ang iyong koneksyon at subukang muli. Walang nawala.',
  'error.request_invalid.message': 'Ang kahilingan ay wala sa hugis na maaari naming tanggapin.',
  'error.request_invalid.action':
    'Suriin ang mga field na nakalista sa ibaba at ipadala itong muli.',
  'error.validation_failed.message':
    'Ang ilang mga field ay nangangailangan ng pagbabago bago ito ma-save.',
  'error.validation_failed.action': 'Ayusin ang mga naka-highlight na field.',
  'error.unauthenticated.message': 'Kailangan mong naka-sign in para magawa ito.',
  'error.unauthenticated.action': 'Mag-sign in at ibabalik ka namin dito.',
  'error.session_expired.message': 'Nag-expire ang iyong session.',
  'error.session_expired.action': 'Mag-sign in muli. Nai-save ang iyong draft.',
  'error.mfa_required.message':
    'Ang pagkilos na ito ay nangangailangan ng dalawang salik na kumpirmasyon.',
  'error.mfa_required.action': 'Kumpirmahin gamit ang iyong authenticator app para magpatuloy.',
  'error.forbidden.message': 'Hindi pinapayagan ng iyong tungkulin ang pagkilos na ito.',
  'error.forbidden.action': 'Humingi ng access sa isang may-ari o admin ng workspace na ito.',
  'error.insufficient_scope.message': 'Walang saklaw ang kredensyal na ito {scope}.',
  'error.insufficient_scope.action':
    'Ibigay ang saklaw na iyon o gumamit ng kredensyal na mayroon na nito.',
  'error.workspace_not_found.message': 'Wala ang workspace na iyon o hindi ka miyembro.',
  'error.workspace_not_found.action': 'Pumili ng workspace na kinabibilangan mo.',
  'error.workspace_suspended.message': 'Nasuspinde ang workspace na ito.',
  'error.workspace_suspended.action':
    'Makipag-ugnayan sa suporta upang malutas ito. Ang iyong data ay buo.',
  'error.not_found.message': 'Wala na ang item na iyon.',
  'error.not_found.action': 'Maaaring ito ay tinanggal. Bumalik at i-refresh ang listahan.',
  'error.conflict.message': 'May ibang nagbago nito habang ginagawa mo ito.',
  'error.conflict.action': 'Suriin ang parehong bersyon, pagkatapos ay i-save muli.',
  'error.idempotency_key_reused.message':
    'Nagamit na ang idempotency key na ito para sa ibang kahilingan.',
  'error.idempotency_key_reused.action':
    'Gumamit ng bagong key, o ulitin ang eksaktong orihinal na kahilingan.',
  'error.rate_limited.message': 'Masyadong maraming kahilingan.',
  'error.rate_limited.action': 'Subukan muli pagkatapos {time}.',
  'error.quota_exceeded.message':
    'Lampas sa limitasyon ang pagkilos na ito para sa kasalukuyang panahon.',
  'error.quota_exceeded.action': 'Nire-reset ang limitasyon {relativeTime}.',
  'error.payment_required.message': 'Walang aktibong subscription ang workspace na ito.',
  'error.payment_required.action':
    'Simulan ang subscription para mag-publish muli. Walang tinatanggal.',
  'error.subscription_past_due.message': 'Hindi natuloy ang huling bayad.',
  'error.subscription_past_due.action': 'I-update ang paraan ng pagbabayad sa Polar portal.',
  'error.trial_expired.message': 'Natapos ang paglilitis noong {date}.',
  'error.trial_expired.action': 'Simulan ang subscription upang magpatuloy sa pag-publish.',
  'error.post_credits_exhausted.message':
    'Nagamit na ng workspace na ito ang lahat ng libreng post nito. Gumagana pa rin ang lahat ng iba.',
  'error.post_credits_exhausted.action':
    'Pumili ng plano para makapagpatuloy sa pag-publish. Nananatiling konektado ang iyong mga account at nakatago ang iyong mga draft at iskedyul.',
  'error.entitlement_missing.message': 'Walang access ang workspace na ito sa feature na iyon.',
  'error.entitlement_missing.action':
    'Tingnan ang mga setting ng pagsingil, o makipag-ugnayan sa suporta.',
  'error.channel_limit_reached.message':
    'Ginagamit na ng workspace na ito ang lahat {limit} mga aktibong channel.',
  'error.channel_limit_reached.action': 'Idiskonekta ang isang channel bago kumonekta sa isa pa.',
  'error.project_limit_reached.message':
    'Nagamit na ng workspace na ito ang lahat ng {limit} aktibong proyekto.',
  'error.project_limit_reached.action':
    'I-archive ang isang hindi aktibong proyekto o baguhin ang allowance ng proyekto ng workspace.',
  'error.project_has_connections.message':
    'May {connected, plural, one {# konektadong channel} other {# konektadong channel}} pa ang proyektong ito.',
  'error.project_has_connections.action':
    'Idiskonekta ang lahat ng channel sa proyektong ito bago ito i-archive.',
  'error.project_last_active.message': 'Dapat may kahit isang aktibong proyekto ang workspace.',
  'error.project_last_active.action': 'Gumawa ng ibang proyekto bago i-archive ang isang ito.',
  'error.connection_not_found.message': 'Ang koneksyon na iyon ay wala na sa workspace na ito.',
  'error.connection_not_found.action':
    'Ikonekta muli ang account upang patuloy na mag-publish dito.',
  'error.connection_revoked.message': '{account} binawi ang pag-access sa {provider}.',
  'error.connection_revoked.action':
    'Ikonekta muli ang account. Magpapatuloy ang mga naka-iskedyul na post pagkatapos nito.',
  'error.connection_expired.message': 'Access para sa {account} nag-expire na.',
  'error.connection_expired.action':
    'Muling ikonekta ang account upang maibalik ang pag-publish at analytics.',
  'error.connection_paused.message': '{account} ay naka-pause.',
  'error.connection_paused.action': 'Ipagpatuloy ito mula sa Connections kapag handa ka na.',
  'error.connection_permission_missing.message':
    '{account} ay hindi nagbigay ng pahintulot na kailangan para gawin ito.',
  'error.connection_permission_missing.action':
    'Muling kumonekta at tanggapin {permission} sa screen ng pahintulot.',
  'error.connection_account_type_invalid.message':
    'Kailangan ng Instagram ng isang propesyonal na account. {account} ay isang personal na account.',
  'error.connection_account_type_invalid.action':
    'Ilipat ito sa isang account ng negosyo o creator sa Instagram app, pagkatapos ay muling kumonekta.',
  'error.connection_review_pending.message':
    '{provider} ay sinusuri pa rin ang app na ito para sa {account}.',
  'error.connection_review_pending.action':
    'Pribado ang pag-publish ng mga post hanggang sa matapos ang pagsusuri. Ina-update namin ang page na ito kapag nagbago ito.',
  'error.capability_unsupported.message':
    '{provider} ay hindi nag-aalok nito sa pamamagitan ng opisyal nitong API.',
  'error.capability_unsupported.action': 'Gumamit ng format na sinusuportahan ng account na ito.',
  'error.capability_not_implemented.message': 'Hindi ito ginawa ni Post Array {provider} pa.',
  'error.capability_not_implemented.action':
    'Ang pahina ng kakayahan ay naglilista kung ano ang magagawa ng bawat connector ngayon.',
  'error.capability_requires_review.message':
    '{provider} ibibigay lang ito pagkatapos nitong suriin ang app o ang account.',
  'error.capability_requires_review.action':
    'Ito ay mananatiling hindi available hanggang sa matapos ang pagsusuring iyon.',
  'error.content_invalid.message':
    '{provider} hindi tatanggapin ang nilalamang ito para sa {account}.',
  'error.content_invalid.action':
    'Ang mga isyu ay nakalista sa target. Ayusin ang mga ito at subukang muli.',
  'error.content_changed_after_approval.message':
    'Nagbago ang post na ito matapos itong maaprubahan.',
  'error.content_changed_after_approval.action':
    'Humiling muli ng pag-apruba bago ito mai-publish.',
  'error.duplicate_content.message':
    'Ang napakakatulad na nilalaman ay nai-publish sa {account} {relativeTime}.',
  'error.duplicate_content.action':
    'Baguhin ang teksto, o i-publish ito sa ibang pagkakataon. Pinaghihigpitan ng mga platform ang mga duplicate na post.',
  'error.cadence_limit_reached.message':
    '{account} ay umabot na sa itinakdang ritmo ng pag-post para sa workspace na ito.',
  'error.cadence_limit_reached.action':
    'I-iskedyul ito para sa susunod na slot, o taasan ang limitasyon ng cadence.',
  'error.media_invalid.message': 'Ang file na ito ay hindi mai-publish sa {provider}.',
  'error.media_invalid.action': 'Ang eksaktong limitasyon ay ipinapakita sa tabi ng file.',
  'error.media_too_large.message': 'Ang file na ito ay mas malaki kaysa sa {provider} tinatanggap.',
  'error.media_too_large.action':
    'I-compress ito o mag-upload ng mas maliit na bersyon. Ang orihinal ay itinatago.',
  'error.media_processing_failed.message': 'Hindi namin maihanda ang file na ito {provider}.',
  'error.media_processing_failed.action': 'Subukan itong i-upload muli, o gumamit ng ibang format.',
  'error.media_rights_undeclared.message':
    'Ang media na ito ay walang deklarasyon ng mga karapatan.',
  'error.media_rights_undeclared.action':
    'Kumpirmahin na mayroon kang mga karapatang i-publish ito, kasama ang sinumang tao dito.',
  'error.alt_text_required.message':
    'Ang larawang ito ay nangangailangan ng alt text para sa {provider}.',
  'error.alt_text_required.action': 'Ilarawan ang larawan, o markahan ito bilang pandekorasyon.',
  'error.approval_required.message':
    'Nangangailangan ng pag-apruba ang workspace na ito bago i-publish.',
  'error.approval_required.action': 'Humiling ng pag-apruba mula sa {approver}.',
  'error.approval_expired.message': 'Nag-expire ang pag-apruba para sa post na ito noong {date}.',
  'error.approval_expired.action': 'Humiling muli ng pag-apruba.',
  'error.schedule_in_past.message': 'Lumipas na ang oras na iyon {timeZone}.',
  'error.schedule_in_past.action': 'Pumili ng ibang pagkakataon, o mag-publish ngayon.',
  'error.schedule_conflict.message':
    '{account} mayroon nang post sa loob {duration} ng panahong ito.',
  'error.schedule_conflict.action':
    'Ilipat ang isa sa mga ito, o magpatuloy kung nilayon ang puwang na iyon.',
  'error.time_zone_invalid.message': 'Hindi namin nakikilala ang time zone {timeZone}.',
  'error.time_zone_invalid.action': 'Pumili ng zone mula sa listahan.',
  'error.destination_unavailable.message':
    'Ang patutunguhan {destination} ay hindi na magagamit sa {provider}.',
  'error.destination_unavailable.action':
    'I-refresh ang listahan ng patutunguhan at pumili ng isa pa.',
  'error.mention_unresolved.message':
    'Ang isang pagbanggit ay hindi naitugma sa isang tunay {provider} account.',
  'error.mention_unresolved.action':
    'Hanapin at piliin ang account, o alisin ang pagbanggit. Hindi kami kailanman nag-publish ng pekeng native na tag.',
  'error.provider_transient.message': '{provider} hindi ito maproseso sa ngayon.',
  'error.provider_transient.action': 'Awtomatikong susubukan naming muli. Walang nadoble.',
  'error.provider_permanent.message':
    '{provider} tinanggihan ito at hindi tatanggap ng muling pagsubok.',
  'error.provider_permanent.action': 'Ang sanitized na tugon ay nasa resibo.',
  'error.provider_rate_limited.message': '{provider} nililimitahan ng rate ang workspace na ito.',
  'error.provider_rate_limited.action': 'Susubukan naming muli pagkatapos {time}.',
  'error.provider_unavailable.message': '{provider} ay hindi tumutugon.',
  'error.provider_unavailable.action':
    'Suriin ang pahina ng katayuan. Ang mga naka-iskedyul na post ay patuloy na sinusubukang muli.',
  'error.provider_content_rejected.message':
    '{provider} tinanggihan ang nilalamang ito sa ilalim ng sarili nitong mga patakaran.',
  'error.provider_content_rejected.action':
    'Nasa resibo ang ibinigay na dahilan. I-edit ang nilalaman o apela gamit ang {provider}.',
  'error.user_action_required.message':
    '{account} nangangailangan ng isang bagay mula sa iyo bago ito mai-publish.',
  'error.user_action_required.action': 'Buksan ang koneksyon upang makita kung ano ang nawawala.',
  'error.short_link_destination_blocked.message': 'Hindi maaaring paikliin ang destinasyong iyon.',
  'error.short_link_destination_blocked.action':
    'Ang mga pribadong network, hindi ligtas na mga scheme at kilalang mapang-abusong destinasyon ay hinaharangan.',
  'error.short_link_domain_unverified.message': 'Ang domain {domain} ay hindi pa nabe-verify.',
  'error.short_link_domain_unverified.action':
    'Idagdag ang DNS record na ipinapakita sa mga setting, pagkatapos ay i-verify.',
  'error.rss_feed_invalid.message': 'Ang URL na iyon ay hindi nagbalik ng wastong RSS o Atom feed.',
  'error.rss_feed_invalid.action':
    'Suriin ang address. Ligtas naming kinukuha ito at walang mga pribadong pag-redirect.',
  'error.webhook_signature_invalid.message': 'Hindi na-verify ang lagda sa webhook na iyon.',
  'error.webhook_signature_invalid.action':
    'Tingnan kung ginagamit ng nagpadala ang kasalukuyang sikreto sa pagpirma. Hindi naproseso ang payload.',
  'error.webhook_delivery_failed.message': 'Paghahatid sa {endpoint} nabigo.',
  'error.webhook_delivery_failed.action':
    'Sinubukan naming muli nang may backoff. Nasa delivery log ang tugon.',
  'error.automation_rule_not_permitted.message':
    'Labag sa panuntunan ng platform ang panuntunang iyon, kaya hindi ito magagawa.',
  'error.automation_rule_not_permitted.action':
    'Ang mga awtomatikong pag-like, pagsubaybay, hindi hinihinging mga tugon at duplicate na mass posting ay hindi kailanman magagamit.',
  'error.ai_unavailable.message': 'Ang writing assistant ay hindi available sa ngayon.',
  'error.ai_unavailable.action': 'Ang iyong text ay hindi nagalaw. Subukan muli sa ilang sandali.',
  'error.ai_output_invalid.message':
    'Ibinalik ng katulong ang isang bagay na hindi namin ma-validate.',
  'error.ai_output_invalid.action': 'Walang inilapat sa iyong draft. Subukan muli.',
  'error.ai_budget_exceeded.message':
    'Naabot ng workspace na ito ang limitasyon ng assistant nito sa ngayon.',
  'error.ai_budget_exceeded.action':
    'Nire-reset ang limitasyon {relativeTime}. Gumagana pa rin ang pagsusulat gamit ang kamay.',
  'error.storage_unavailable.message': 'Hindi namin maabot ang media storage.',
  'error.storage_unavailable.action':
    'Ang iyong teksto ay nai-save. Subukang muli ang pag-upload sa ilang sandali.',
  'error.export_unavailable.message': 'Ang pag-export na iyon ay hindi magawa.',
  'error.export_unavailable.action':
    'Subukan ang isang mas maliit na hanay, o makipag-ugnayan sa suporta gamit ang reference.',

  'error.reference': 'Sanggunian {correlationId}',
  'error.reportToSupport': 'Ipadala ito upang suportahan',
  'error.contentPreserved': 'Ang iyong nilalaman ay napanatili. Walang nai-publish.',
} as const;
