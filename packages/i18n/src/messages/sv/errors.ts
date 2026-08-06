/**
 * One entry per `RelayError` code.
 *
 * Every code has `error.<code>.message`, the sentence a person reads, and
 * `error.<code>.action`, what they can do next. Messages name the account or
 * the action. They never leak a provider payload, a token or an internal ID.
 */
export const errorMessages = {
  'error.unknown.message': 'Något gick fel och vi kunde inte klassificera det.',
  'error.unknown.action': 'Försök igen. Om det fortsätter att hända, skicka oss referensen nedan.',
  'error.internal.message': 'Det här är ett problem från vår sida, inte med ditt innehåll.',
  'error.internal.action':
    'Ditt arbete är sparat. Vi har blivit larmade. Försök igen om några minuter.',
  'error.not_implemented.message': 'Relay har inte byggt detta ännu.',
  'error.not_implemented.action': 'Följ ändringsloggen för när den skickas.',
  'error.offline.message': 'Du är offline.',
  'error.offline.action':
    'Ditt utkast sparas på den här enheten. Publicering och schemaläggning återupptas när anslutningen återkommer.',
  'error.network_unreachable.message': 'Vi kunde inte nå servern.',
  'error.network_unreachable.action':
    'Kontrollera din anslutning och försök igen. Ingenting gick förlorat.',
  'error.request_invalid.message': 'Förfrågan var inte i en form som vi kan acceptera.',
  'error.request_invalid.action': 'Kontrollera fälten nedan och skicka det igen.',
  'error.validation_failed.message': 'Vissa fält behöver ändras innan detta kan sparas.',
  'error.validation_failed.action': 'Åtgärda de markerade fälten.',
  'error.unauthenticated.message': 'Du måste vara inloggad för att göra detta.',
  'error.unauthenticated.action': 'Logga in så tar vi dig tillbaka hit.',
  'error.session_expired.message': 'Din session har löpt ut.',
  'error.session_expired.action': 'Logga in igen. Ditt utkast har sparats.',
  'error.mfa_required.message': 'Denna åtgärd behöver tvåfaktorsbekräftelse.',
  'error.mfa_required.action': 'Bekräfta med din autentiseringsapp för att fortsätta.',
  'error.forbidden.message': 'Din roll tillåter inte denna åtgärd.',
  'error.forbidden.action': 'Be en ägare eller administratör av denna arbetsyta om åtkomst.',
  'error.insufficient_scope.message': 'Denna legitimation har inte omfattningen {scope}.',
  'error.insufficient_scope.action':
    'Bevilja den omfattningen eller använd en legitimation som redan har den.',
  'error.workspace_not_found.message': 'Den arbetsytan finns inte eller så är du inte medlem.',
  'error.workspace_not_found.action': 'Välj en arbetsplats du tillhör.',
  'error.workspace_suspended.message': 'Denna arbetsyta är avstängd.',
  'error.workspace_suspended.action': 'Kontakta supporten för att lösa det. Din data är intakt.',
  'error.not_found.message': 'Den artikeln finns inte längre.',
  'error.not_found.action': 'Det kan ha tagits bort. Gå tillbaka och uppdatera listan.',
  'error.conflict.message': 'Någon annan ändrade detta medan du arbetade med det.',
  'error.conflict.action': 'Granska båda versionerna och spara sedan igen.',
  'error.idempotency_key_reused.message':
    'Denna idempotensnyckel användes redan för en annan begäran.',
  'error.idempotency_key_reused.action':
    'Använd en ny nyckel eller upprepa den exakta ursprungliga begäran.',
  'error.rate_limited.message': 'För många förfrågningar.',
  'error.rate_limited.action': 'Försök igen efter {time}.',
  'error.quota_exceeded.message': 'Denna åtgärd är över gränsen för den aktuella perioden.',
  'error.quota_exceeded.action': 'Gränsen återställs {relativeTime}.',
  'error.payment_required.message': 'Den här arbetsytan har ingen aktiv prenumeration.',
  'error.payment_required.action':
    'Starta prenumerationen för att publicera igen. Ingenting raderas.',
  'error.subscription_past_due.message': 'Den sista betalningen gick inte igenom.',
  'error.subscription_past_due.action': 'Uppdatera betalningsmetoden i Polar-portalen.',
  'error.trial_expired.message': 'Rättegången avslutades {date}.',
  'error.trial_expired.action': 'Starta prenumerationen för att fortsätta publicera.',
  'error.entitlement_missing.message': 'Den här arbetsytan har inte åtkomst till den funktionen.',
  'error.entitlement_missing.action':
    'Kontrollera faktureringsinställningarna eller kontakta supporten.',
  'error.channel_limit_reached.message':
    'Denna arbetsyta använder redan alla {limit} aktiva kanaler.',
  'error.channel_limit_reached.action': 'Koppla bort en kanal innan du ansluter en annan.',
  'error.connection_not_found.message': 'Den anslutningen finns inte längre i den här arbetsytan.',
  'error.connection_not_found.action': 'Anslut kontot igen för att fortsätta publicera till det.',
  'error.connection_revoked.message': '{account} återkallade åtkomst på {provider}.',
  'error.connection_revoked.action': 'Återanslut kontot. Schemalagda inlägg återupptas efter det.',
  'error.connection_expired.message': 'Åtkomsten för {account} har löpt ut.',
  'error.connection_expired.action': 'Återanslut kontot för att återställa publicering och analys.',
  'error.connection_paused.message': '{account} är pausad.',
  'error.connection_paused.action': 'Återuppta det från Connections när du är redo.',
  'error.connection_permission_missing.message':
    '{account} har inte gett det tillstånd som behövs för att göra detta.',
  'error.connection_permission_missing.action':
    'Återanslut och acceptera {permission} på samtyckesskärmen.',
  'error.connection_account_type_invalid.message':
    'Instagram behöver ett professionellt konto. {account} är ett personligt konto.',
  'error.connection_account_type_invalid.action':
    'Byt det till ett företags- eller skaparkonto i Instagram-appen och anslut sedan igen.',
  'error.connection_review_pending.message':
    '{provider} recenserar fortfarande den här appen för {account}.',
  'error.connection_review_pending.action':
    'Inlägg publiceras privat tills recensionen går igenom. Vi uppdaterar den här sidan när den ändras.',
  'error.capability_unsupported.message': '{provider} erbjuder inte detta via sitt officiella API.',
  'error.capability_unsupported.action': 'Använd ett format som detta konto stöder.',
  'error.capability_not_implemented.message': 'Relay har inte byggt detta för {provider} än.',
  'error.capability_not_implemented.action':
    'Funktionssidan listar vad varje anslutning kan göra idag.',
  'error.capability_requires_review.message':
    '{provider} beviljar detta endast efter att den granskat appen eller kontot.',
  'error.capability_requires_review.action':
    'Den förblir otillgänglig tills den recensionen går igenom.',
  'error.content_invalid.message': '{provider} accepterar inte detta innehåll för {account}.',
  'error.content_invalid.action': 'Problemen är listade på målet. Åtgärda dem och försök igen.',
  'error.content_changed_after_approval.message': 'Detta inlägg ändrades efter att det godkändes.',
  'error.content_changed_after_approval.action': 'Begär godkännande igen innan det kan publiceras.',
  'error.duplicate_content.message':
    'Mycket liknande innehåll publicerades till {account} {relativeTime}.',
  'error.duplicate_content.action':
    'Ändra texten eller publicera den senare. Plattformar begränsar dubbletter av inlägg.',
  'error.cadence_limit_reached.message':
    '{account} har nått den postningskadens som är inställd för den här arbetsytan.',
  'error.cadence_limit_reached.action':
    'Schemalägg detta för en senare plats, eller höj kadensgränsen.',
  'error.media_invalid.message': 'Den här filen kan inte publiceras till {provider}.',
  'error.media_invalid.action': 'Den exakta gränsen visas bredvid filen.',
  'error.media_too_large.message': 'Den här filen är större än {provider} accepterar.',
  'error.media_too_large.action':
    'Komprimera den eller ladda upp en mindre version. Originalet behålls.',
  'error.media_processing_failed.message': 'Vi kunde inte förbereda den här filen för {provider}.',
  'error.media_processing_failed.action':
    'Försök att ladda upp den igen eller använd ett annat format.',
  'error.media_rights_undeclared.message': 'Detta media har ingen rättighetsdeklaration.',
  'error.media_rights_undeclared.action':
    'Bekräfta att du har rättigheterna att publicera den, inklusive alla personer i den.',
  'error.alt_text_required.message': 'Den här bilden behöver alt-text för {provider}.',
  'error.alt_text_required.action': 'Beskriv bilden eller markera den som dekorativ.',
  'error.approval_required.message': 'Den här arbetsytan kräver godkännande innan den publiceras.',
  'error.approval_required.action': 'Begär godkännande från {approver}.',
  'error.approval_expired.message': 'Godkännandet för denna tjänst gick ut {date}.',
  'error.approval_expired.action': 'Begär godkännande igen.',
  'error.schedule_in_past.message': 'Den tiden har redan passerat i {timeZone}.',
  'error.schedule_in_past.action': 'Välj ett senare tillfälle eller publicera nu.',
  'error.schedule_conflict.message':
    '{account} har redan ett inlägg inom {duration} efter denna tid.',
  'error.schedule_conflict.action': 'Flytta en av dem, eller fortsätt om avståndet är avsett.',
  'error.time_zone_invalid.message': 'Vi känner inte igen tidszonen {timeZone}.',
  'error.time_zone_invalid.action': 'Välj en zon från listan.',
  'error.destination_unavailable.message':
    'Destinationen {destination} är inte längre tillgänglig på {provider}.',
  'error.destination_unavailable.action': 'Uppdatera destinationslistan och välj en annan.',
  'error.mention_unresolved.message':
    'Ett omnämnande har inte matchats med ett riktigt {provider}-konto.',
  'error.mention_unresolved.action':
    'Sök och välj kontot eller ta bort omnämnandet. Vi publicerar aldrig en falsk native-tagg.',
  'error.provider_transient.message': '{provider} kunde inte bearbeta detta just nu.',
  'error.provider_transient.action':
    'Vi kommer att försöka igen automatiskt. Ingenting är duplicerat.',
  'error.provider_permanent.message':
    '{provider} avvisade detta och kommer inte att acceptera ett nytt försök.',
  'error.provider_permanent.action': 'Det sanerade svaret finns på kvittot.',
  'error.provider_rate_limited.message': '{provider} hastigheten begränsade denna arbetsyta.',
  'error.provider_rate_limited.action': 'Vi försöker igen efter {time}.',
  'error.provider_unavailable.message': '{provider} svarar inte.',
  'error.provider_unavailable.action':
    'Kontrollera statussidan. Schemalagda inlägg fortsätter att försöka igen.',
  'error.provider_content_rejected.message':
    '{provider} avvisade detta innehåll enligt sin egen policy.',
  'error.provider_content_rejected.action':
    'Anledningen till det står på kvittot. Redigera innehållet eller överklagan med {provider}.',
  'error.user_action_required.message':
    '{account} behöver något från dig innan det kan publiceras.',
  'error.user_action_required.action': 'Öppna anslutningen för att se vad som saknas.',
  'error.short_link_destination_blocked.message': 'Den destinationen kan inte förkortas.',
  'error.short_link_destination_blocked.action':
    'Privata nätverk, osäkra system och kända missbruksdestinationer blockeras.',
  'error.short_link_domain_unverified.message': 'Domänen {domain} är inte verifierad ännu.',
  'error.short_link_domain_unverified.action':
    'Lägg till DNS-posten som visas i inställningarna och verifiera.',
  'error.rss_feed_invalid.message':
    'Den webbadressen returnerade inte ett giltigt RSS- eller Atom-flöde.',
  'error.rss_feed_invalid.action':
    'Kontrollera adressen. Vi hämtar det säkert och följer inga privata omdirigeringar.',
  'error.webhook_signature_invalid.message': 'Signaturen på den webhooken verifierades inte.',
  'error.webhook_signature_invalid.action':
    'Kontrollera att avsändaren använder den aktuella signeringshemligheten. Nyttolasten bearbetades inte.',
  'error.webhook_delivery_failed.message': 'Leverans till {endpoint} misslyckades.',
  'error.webhook_delivery_failed.action':
    'Vi försöker igen med backoff. Leveransloggen har svaret.',
  'error.automation_rule_not_permitted.message':
    'Den regeln skulle bryta mot en plattformsregel, så den kan inte skapas.',
  'error.automation_rule_not_permitted.action':
    'Automatiserade gilla-markeringar, följer, oönskade svar och dubbletter av massinlägg är aldrig tillgängliga.',
  'error.ai_unavailable.message': 'Skrivassistenten är inte tillgänglig just nu.',
  'error.ai_unavailable.action': 'Din text är orörd. Försök snart igen.',
  'error.ai_output_invalid.message': 'Assistenten returnerade något som vi inte kunde validera.',
  'error.ai_output_invalid.action': 'Ingenting tillämpades på ditt utkast. Försök igen.',
  'error.ai_budget_exceeded.message': 'Den här arbetsytan nådde sin assistentgräns för nu.',
  'error.ai_budget_exceeded.action':
    'Gränsen återställs {relativeTime}. Att skriva för hand fungerar fortfarande.',
  'error.storage_unavailable.message': 'Vi kunde inte nå medialagring.',
  'error.storage_unavailable.action':
    'Din text har sparats. Försök att ladda upp igen om ett ögonblick.',
  'error.export_unavailable.message': 'Den exporten kunde inte produceras.',
  'error.export_unavailable.action':
    'Prova ett mindre sortiment, eller kontakta supporten med referensen.',

  'error.reference': 'Referens {correlationId}',
  'error.reportToSupport': 'Skicka detta till supporten',
  'error.contentPreserved': 'Ditt innehåll är bevarat. Ingenting publicerades.',
} as const;
