/**
 * One entry per `RelayError` code.
 *
 * Every code has `error.<code>.message`, the sentence a person reads, and
 * `error.<code>.action`, what they can do next. Messages name the account or
 * the action. They never leak a provider payload, a token or an internal ID.
 */
export const errorMessages = {
  'error.unknown.message': 'Er is iets misgegaan en we konden het niet classificeren.',
  'error.unknown.action':
    'Probeer het opnieuw. Als het blijft gebeuren, stuur ons dan onderstaande referentie.',
  'error.internal.message': 'Dit is een probleem aan onze kant, niet met uw inhoud.',
  'error.internal.action':
    'Uw werk is opgeslagen. Wij zijn gewaarschuwd. Probeer het over een paar minuten opnieuw.',
  'error.not_implemented.message': 'Relay heeft dit nog niet gebouwd.',
  'error.not_implemented.action': 'Volg de changelog voor wanneer deze wordt verzonden.',
  'error.offline.message': 'Je bent offline.',
  'error.offline.action':
    'Je concept wordt op dit apparaat bewaard. Het publiceren en plannen wordt hervat wanneer de verbinding terugkeert.',
  'error.network_unreachable.message': 'We konden de server niet bereiken.',
  'error.network_unreachable.action':
    'Controleer uw verbinding en probeer het opnieuw. Er ging niets verloren.',
  'error.request_invalid.message': 'Het verzoek was niet in een vorm die we kunnen accepteren.',
  'error.request_invalid.action': 'Controleer de onderstaande velden en verzend het opnieuw.',
  'error.validation_failed.message':
    'Sommige velden moeten worden gewijzigd voordat deze kunnen worden opgeslagen.',
  'error.validation_failed.action': 'Corrigeer de gemarkeerde velden.',
  'error.unauthenticated.message': 'Hiervoor moet u ingelogd zijn.',
  'error.unauthenticated.action': 'Meld u aan en wij brengen u hier terug.',
  'error.session_expired.message': 'Uw sessie is verlopen.',
  'error.session_expired.action': 'Meld u opnieuw aan. Uw concept is opgeslagen.',
  'error.mfa_required.message': 'Deze actie heeft bevestiging op twee factoren nodig.',
  'error.mfa_required.action': 'Bevestig met uw authenticator-app om door te gaan.',
  'error.forbidden.message': 'Uw rol staat deze actie niet toe.',
  'error.forbidden.action': 'Vraag een eigenaar of beheerder van deze werkruimte om toegang.',
  'error.insufficient_scope.message': 'Deze referentie heeft niet de reikwijdte {scope}.',
  'error.insufficient_scope.action':
    'Verleen die reikwijdte of gebruik een referentie die deze al heeft.',
  'error.workspace_not_found.message': 'Die werkruimte bestaat niet of je bent geen lid.',
  'error.workspace_not_found.action': 'Kies een werkruimte waartoe u behoort.',
  'error.workspace_suspended.message': 'Deze werkruimte is opgeschort.',
  'error.workspace_suspended.action':
    'Neem contact op met de ondersteuning om het probleem op te lossen. Uw gegevens zijn intact.',
  'error.not_found.message': 'Dat artikel bestaat niet meer.',
  'error.not_found.action': 'Mogelijk is deze verwijderd. Ga terug en vernieuw de lijst.',
  'error.conflict.message': 'Iemand anders heeft dit gewijzigd terwijl u eraan werkte.',
  'error.conflict.action': 'Controleer beide versies en sla ze vervolgens opnieuw op.',
  'error.idempotency_key_reused.message':
    'Deze idempotentiesleutel werd al gebruikt voor een ander verzoek.',
  'error.idempotency_key_reused.action':
    'Gebruik een nieuwe sleutel of herhaal exact het oorspronkelijke verzoek.',
  'error.rate_limited.message': 'Te veel verzoeken.',
  'error.rate_limited.action': 'Probeer het opnieuw na {time}.',
  'error.quota_exceeded.message': 'Deze actie overschrijdt de limiet voor de huidige periode.',
  'error.quota_exceeded.action': 'De limiet wordt opnieuw ingesteld op {relativeTime}.',
  'error.payment_required.message': 'Deze werkruimte heeft geen actief abonnement.',
  'error.payment_required.action':
    'Start het abonnement om opnieuw te publiceren. Er wordt niets verwijderd.',
  'error.subscription_past_due.message': 'De laatste betaling is niet gelukt.',
  'error.subscription_past_due.action': 'Update de betaalmethode in de Polar portal.',
  'error.trial_expired.message': 'De proefperiode eindigde op {date}.',
  'error.trial_expired.action': 'Start het abonnement om door te gaan met publiceren.',
  'error.entitlement_missing.message': 'Deze werkruimte heeft geen toegang tot die functie.',
  'error.entitlement_missing.action':
    'Controleer de factureringsinstellingen of neem contact op met de ondersteuning.',
  'error.channel_limit_reached.message':
    'Deze werkruimte gebruikt al alle actieve {limit}-kanalen.',
  'error.channel_limit_reached.action': 'Ontkoppel een kanaal voordat u een ander kanaal aansluit.',
  'error.connection_not_found.message': 'Die verbinding bevindt zich niet meer in deze werkruimte.',
  'error.connection_not_found.action':
    'Verbind het account opnieuw om ernaar te blijven publiceren.',
  'error.connection_revoked.message': '{account} heeft de toegang tot {provider} ingetrokken.',
  'error.connection_revoked.action':
    'Koppel het account opnieuw. Geplande berichten worden daarna hervat.',
  'error.connection_expired.message': 'Toegang voor {account} verlopen.',
  'error.connection_expired.action':
    'Maak opnieuw verbinding met het account om de publicatie en analyse te herstellen.',
  'error.connection_paused.message': '{account} is gepauzeerd.',
  'error.connection_paused.action': 'Hervat het vanuit Connections wanneer u klaar bent.',
  'error.connection_permission_missing.message':
    '{account} heeft hiervoor geen toestemming verleend.',
  'error.connection_permission_missing.action':
    'Maak opnieuw verbinding en accepteer {permission} op het toestemmingsscherm.',
  'error.connection_account_type_invalid.message':
    'Instagram heeft een professioneel account nodig. {account} is een persoonlijk account.',
  'error.connection_account_type_invalid.action':
    'Schakel het over naar een bedrijfs- of makersaccount in de Instagram-app en maak vervolgens opnieuw verbinding.',
  'error.connection_review_pending.message':
    '{provider} beoordeelt deze app nog steeds voor {account}.',
  'error.connection_review_pending.action':
    'Berichten worden privé gepubliceerd totdat de beoordeling is goedgekeurd. We werken deze pagina bij wanneer deze verandert.',
  'error.capability_unsupported.message': '{provider} biedt dit niet aan via zijn officiële API.',
  'error.capability_unsupported.action': 'Gebruik een indeling die dit account ondersteunt.',
  'error.capability_not_implemented.message': 'Relay heeft dit nog niet gebouwd voor {provider}.',
  'error.capability_not_implemented.action':
    'Op de mogelijkhedenpagina wordt vermeld wat elke connector vandaag kan doen.',
  'error.capability_requires_review.message':
    '{provider} verleent dit alleen nadat zij de app of het account heeft beoordeeld.',
  'error.capability_requires_review.action':
    'Het blijft niet beschikbaar totdat de beoordeling is geslaagd.',
  'error.content_invalid.message': '{provider} accepteert deze inhoud niet voor {account}.',
  'error.content_invalid.action':
    'De problemen worden vermeld op het doel. Corrigeer ze en probeer het opnieuw.',
  'error.content_changed_after_approval.message':
    'Dit bericht is gewijzigd nadat het was goedgekeurd.',
  'error.content_changed_after_approval.action':
    'Vraag opnieuw goedkeuring aan voordat het kan publiceren.',
  'error.duplicate_content.message':
    'Zeer vergelijkbare inhoud werd gepubliceerd als {account} {relativeTime}.',
  'error.duplicate_content.action':
    'Wijzig de tekst of publiceer deze later. Platforms beperken dubbele berichten.',
  'error.cadence_limit_reached.message':
    '{account} heeft de postcadans bereikt die voor deze werkruimte is ingesteld.',
  'error.cadence_limit_reached.action':
    'Plan dit voor een later tijdstip, of verhoog de cadanslimiet.',
  'error.media_invalid.message': 'Dit bestand kan niet worden gepubliceerd naar {provider}.',
  'error.media_invalid.action': 'De exacte limiet wordt naast het bestand weergegeven.',
  'error.media_too_large.message': 'Dit bestand is groter dan {provider} accepteert.',
  'error.media_too_large.action':
    'Comprimeer het of upload een kleinere versie. Het origineel wordt bewaard.',
  'error.media_processing_failed.message':
    'We konden dit bestand niet voorbereiden voor {provider}.',
  'error.media_processing_failed.action':
    'Probeer het opnieuw te uploaden of gebruik een ander formaat.',
  'error.media_rights_undeclared.message': 'Dit medium heeft geen rechtenverklaring.',
  'error.media_rights_undeclared.action':
    'Bevestig dat je de rechten hebt om het te publiceren, inclusief de mensen die erin voorkomen.',
  'error.alt_text_required.message':
    'Deze afbeelding heeft alternatieve tekst nodig voor {provider}.',
  'error.alt_text_required.action': 'Beschrijf de afbeelding of markeer deze als decoratief.',
  'error.approval_required.message':
    'Deze werkruimte vereist goedkeuring voordat deze wordt gepubliceerd.',
  'error.approval_required.action': 'Vraag goedkeuring aan bij {approver}.',
  'error.approval_expired.message': 'De goedkeuring voor dit bericht is verlopen op {date}.',
  'error.approval_expired.action': 'Vraag opnieuw goedkeuring aan.',
  'error.schedule_in_past.message': 'Die tijd is al verstreken in {timeZone}.',
  'error.schedule_in_past.action': 'Kies een later tijdstip of publiceer nu.',
  'error.schedule_conflict.message': '{account} heeft al een post binnen {duration} van deze tijd.',
  'error.schedule_conflict.action': 'Verplaats een ervan, of ga verder als die afstand bedoeld is.',
  'error.time_zone_invalid.message': 'We herkennen de tijdzone {timeZone} niet.',
  'error.time_zone_invalid.action': 'Kies een zone uit de lijst.',
  'error.destination_unavailable.message':
    'De bestemming {destination} is niet langer beschikbaar op {provider}.',
  'error.destination_unavailable.action': 'Vernieuw de bestemmingenlijst en kies een andere.',
  'error.mention_unresolved.message':
    'Een vermelding is niet gekoppeld aan een echt {provider}-account.',
  'error.mention_unresolved.action':
    'Zoek en selecteer het account, of verwijder de vermelding. We publiceren nooit een nep-native tag.',
  'error.provider_transient.message': '{provider} kan dit momenteel niet verwerken.',
  'error.provider_transient.action':
    'We zullen het automatisch opnieuw proberen. Er wordt niets gedupliceerd.',
  'error.provider_permanent.message':
    '{provider} heeft dit afgewezen en accepteert geen nieuwe poging.',
  'error.provider_permanent.action': 'Het opgeschoonde antwoord staat op de bon.',
  'error.provider_rate_limited.message': 'Het {provider}-tarief heeft deze werkruimte beperkt.',
  'error.provider_rate_limited.action': 'We zullen het opnieuw proberen na {time}.',
  'error.provider_unavailable.message': '{provider} reageert niet.',
  'error.provider_unavailable.action':
    'Controleer de statuspagina. Geplande berichten blijven opnieuw proberen.',
  'error.provider_content_rejected.message':
    '{provider} heeft deze inhoud op grond van zijn eigen beleid afgewezen.',
  'error.provider_content_rejected.action':
    'De reden die werd opgegeven staat op de bon. Bewerk de inhoud of het beroep met {provider}.',
  'error.user_action_required.message':
    '{account} heeft iets van je nodig voordat het kan publiceren.',
  'error.user_action_required.action': 'Open de verbinding om te zien wat er ontbreekt.',
  'error.short_link_destination_blocked.message': 'Die bestemming kan niet worden ingekort.',
  'error.short_link_destination_blocked.action':
    "Privénetwerken, onveilige programma's en bekende misbruikbestemmingen worden geblokkeerd.",
  'error.short_link_domain_unverified.message': 'Het domein {domain} is nog niet geverifieerd.',
  'error.short_link_domain_unverified.action':
    'Voeg de DNS-record toe die wordt weergegeven in de instellingen en verifieer vervolgens.',
  'error.rss_feed_invalid.message': 'Die URL heeft geen geldige RSS- of Atom-feed geretourneerd.',
  'error.rss_feed_invalid.action':
    'Controleer het adres. We halen het veilig op en volgen geen privé-omleidingen.',
  'error.webhook_signature_invalid.message': 'De handtekening op die webhook is niet geverifieerd.',
  'error.webhook_signature_invalid.action':
    'Controleer of de afzender het huidige ondertekeningsgeheim gebruikt. De payload is niet verwerkt.',
  'error.webhook_delivery_failed.message': 'Levering aan {endpoint} is mislukt.',
  'error.webhook_delivery_failed.action':
    'We proberen het opnieuw met uitstel. Het leveringslogboek bevat het antwoord.',
  'error.automation_rule_not_permitted.message':
    'Die regel zou een platformregel overtreden en kan dus niet worden gemaakt.',
  'error.automation_rule_not_permitted.action':
    'Geautomatiseerde likes, volgers, ongevraagde antwoorden en dubbele massaposts zijn nooit beschikbaar.',
  'error.ai_unavailable.message': 'De schrijfassistent is momenteel niet beschikbaar.',
  'error.ai_unavailable.action': 'Uw tekst is onaangeroerd. Probeer het binnenkort opnieuw.',
  'error.ai_output_invalid.message':
    'De assistent heeft iets teruggestuurd dat we niet konden valideren.',
  'error.ai_output_invalid.action': 'Er is niets toegepast op uw concept. Probeer het opnieuw.',
  'error.ai_budget_exceeded.message': 'Deze werkruimte heeft voorlopig de assistentlimiet bereikt.',
  'error.ai_budget_exceeded.action':
    'De limiet wordt opnieuw ingesteld op {relativeTime}. Met de hand schrijven werkt nog steeds.',
  'error.storage_unavailable.message': 'We konden de mediaopslag niet bereiken.',
  'error.storage_unavailable.action':
    'Uw tekst wordt opgeslagen. Probeer het uploaden over enkele ogenblikken opnieuw.',
  'error.export_unavailable.message': 'Die export kon niet worden geproduceerd.',
  'error.export_unavailable.action':
    'Probeer een kleiner bereik, of neem contact op met de ondersteuning met de referentie.',

  'error.reference': 'Referentie {correlationId}',
  'error.reportToSupport': 'Stuur dit naar ondersteuning',
  'error.contentPreserved': 'Uw inhoud blijft behouden. Er werd niets gepubliceerd.',
} as const;
