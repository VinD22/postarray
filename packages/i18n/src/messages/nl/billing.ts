/**
 * Billing, trial and plan copy.
 *
 * Several strings here are mandated word for word by the research and by the
 * launch acceptance checklist. Do not soften or restyle them:
 *  - `billing.trial.dueToday` must read "$0 due today".
 *  - `billing.plan.annualFraming` must state the saving in currency, never a
 *    percentage discount.
 *  - `billing.mediaGeneration.explanation` is the approved boundary paragraph.
 *    Tool Radar and the pricing page use this same key.
 */
export const billingMessages = {
  'billing.title': 'Facturering',
  'billing.plan.name': 'Relay',
  'billing.plan.single': 'Eén plan. Elke functie. Geen niveaus.',
  'billing.plan.monthlyPrice': '$ 29/maand',
  'billing.plan.annualPrice': '$ 300/jaar',
  'billing.plan.annualFraming': '$ 25/maand, jaarlijks gefactureerd. Bespaar $ 48/jaar.',
  'billing.plan.interval.monthly': 'Maandelijks',
  'billing.plan.interval.annual': 'Jaarlijks',
  'billing.plan.selectInterval': 'Kies een factureringsinterval',
  'billing.plan.includes.title': 'Wat is inbegrepen',
  'billing.plan.includes.channels': 'Maximaal 30 actieve sociale kanalen',
  'billing.plan.includes.members': 'Onbeperkt teamleden',
  'billing.plan.includes.posts':
    'Onbeperkte concepten en geplande berichten onder redelijk gebruik',
  'billing.plan.includes.connectors': 'Elke goedgekeurde connector',
  'billing.plan.includes.analytics':
    'Analytics wordt bijgehouden vanaf de dag dat u een account koppelt',
  'billing.plan.includes.api': 'REST API, externe MCP-server, CLI en webhooks',
  'billing.plan.includes.automation': 'Automatiseringsregels, RSS-autopost en bijgehouden links',
  'billing.plan.includes.ai': 'DeepSeek-sms-hulp onder misbruik en kostenlimieten',
  'billing.plan.includes.support': 'E-mail- en in-app-ondersteuning',
  'billing.plan.fairUse':
    'Eerlijk gebruik betekent anti-spam-, tarief- en providerkostencontroles die uw accounts beschermen. Ze werken hetzelfde voor elke abonnee.',

  'billing.trial.length': 'Op proef van zeven dagen met elke functie',
  'billing.trial.dueToday': 'Vandaag $ 0 verschuldigd',
  'billing.trial.paymentMethodRequired':
    'Polar verzamelt nu een betaalmethode en brengt vandaag niets in rekening.',
  'billing.trial.firstCharge': 'Laad eerst {amount} op {date}',
  'billing.trial.renewal': 'Verlengt {amount} daarna elke {interval}',
  'billing.trial.cancelBefore':
    'Annuleer vóór deze datum via Instellingen. Er worden dan geen kosten in rekening gebracht.',
  'billing.trial.reminder': 'Polar e-mailt je drie dagen voordat de proefperiode wordt omgezet.',
  'billing.trial.daysRemaining':
    '{count, plural, =0 {Proefperiode eindigt vandaag} one {Proefperiode, # dag resterend} other {Proefperiode, # dagen resterend}}',
  'billing.trial.converted': 'Uw proefperiode omgezet op {date}.',
  'billing.trial.canceled':
    'Uw proefperiode is geannuleerd. Er worden geen kosten in rekening gebracht.',
  'billing.trial.abusePrevention':
    'Herhaalproeven zijn beperkt. Als er geen proefversie beschikbaar is voor dit account, neem dan contact op met de ondersteuning.',

  'billing.checkout.open': 'Ga verder naar afrekenen',
  'billing.checkout.hostedBy':
    'Het afrekenen en de facturen worden afgehandeld door Polar, onze geregistreerde verkoper.',
  'billing.checkout.taxNote': 'Polar int en draagt alle toepasselijke omzetbelasting of BTW af.',
  'billing.checkout.notEntitledYet':
    'We verlenen toegang nadat Polar het abonnement heeft bevestigd, niet via de browseromleiding. Dit duurt meestal enkele seconden.',
  'billing.checkout.returning': 'Je abonnement bij Polar bevestigen',

  'billing.subscription.status.trialing': 'Proef',
  'billing.subscription.status.active': 'Actief',
  'billing.subscription.status.pastDue': 'Betaling te laat',
  'billing.subscription.status.canceled': 'Geannuleerd',
  'billing.subscription.status.unpaid': 'Onbetaald',
  'billing.subscription.status.none': 'Geen abonnement',
  'billing.subscription.renewsOn': 'Verlengt {amount} op {date}',
  'billing.subscription.endsOn': 'De toegang loopt door tot {date}',
  'billing.subscription.pastDueBody':
    'De laatste betaling is niet gelukt. Update de betaalmethode om te blijven publiceren. Na de respijtperiode wordt de werkruimte alleen-lezen en stoppen geplande berichten.',
  'billing.subscription.readOnly':
    'Deze werkruimte is alleen-lezen. Uw inhoud, bonnen en verbindingen zijn intact.',
  'billing.subscription.portal': 'Open het Polar-klantenportaal',
  'billing.subscription.invoices': 'Facturen',
  'billing.subscription.paymentMethod': 'Betaalmethode',
  'billing.subscription.managedByPolar': 'Beheerd door Polar',

  'billing.cancel.title': 'Annuleer uw abonnement',
  'billing.cancel.beforeTrialEnd':
    'Annuleer nu en er worden geen kosten in rekening gebracht. Je behoudt elke functie tot {date}.',
  'billing.cancel.afterTrial':
    'Je behoudt toegang tot {date}. Er wordt niets verwijderd wanneer het eindigt.',
  'billing.cancel.confirm': 'Abonnement opzeggen',
  'billing.cancel.confirmed': 'Geannuleerd. Er worden geen kosten in rekening gebracht.',
  'billing.cancel.keepData': 'Uw concepten, bonnen en analyses blijven in deze werkruimte.',

  'billing.usage.title': 'Gebruik',
  'billing.usage.meteredNote':
    'Sommige providerkosten worden tegen kostprijs doorberekend, omdat de provider per verrichting rekent.',
  'billing.usage.xCharges':
    'X kosten voor elke post. Berichten die een URL bevatten, kosten meer dan gewone tekst.',
  'billing.usage.balance': 'Gebruikssaldo {amount}',
  'billing.usage.estimatedBeforeAction': 'Deze actie wordt geschat op {amount}.',
  'billing.usage.periodTotal': '{amount} gebruikt sinds {date}',
  'billing.usage.noMediaCredits':
    "Er zijn geen credits voor het genereren van afbeeldingen of video's, omdat Relay geen media genereert.",

  'billing.downgrade.overLimit':
    'Deze werkruimte heeft {count, plural, one {# kanaal} other {# kanalen}} over de limiet. Nieuwe acties op die kanalen worden geblokkeerd. Niets is voor u afgesloten.',

  'billing.mediaGeneration.title': 'Waarom we geen afbeeldingen of video genereren',
  'billing.mediaGeneration.explanation':
    'Wij richten ons erop u te helpen bij het plannen, goedkeuren, publiceren en leren. We genereren geen afbeeldingen of video in V1 omdat merkklare media meer nodig hebben dan een korte prompt: het heeft uw volledige visuele systeem, nauwkeurige productdetails, gelicentieerde assets, mensen en gebruiksrechten en zorgvuldige beoordeling nodig. Creatieve modellen veranderen ook snel. We raden momenteel geverifieerde specialistische tools aan en maken het gemakkelijk om het voltooide werk in uw campagnes te integreren, terwijl u de creatieve controle behoudt.',

  'billing.referral.title': 'Verwijzingen',
  'billing.referral.disclosure':
    'Verwijzingslinks moeten openbaar worden gemaakt, waar u ze ook deelt. De Commissie is nooit afhankelijk van een positieve beoordeling.',
  'billing.referral.link': 'Uw verwijzingslink',
  'billing.referral.attributed':
    '{count, plural, one {# toegeschreven aanmelding} other {# toegeschreven aanmeldingen}}',
  'billing.referral.commissionPending':
    'In behandeling, vastgehouden totdat het terugbetalingsvenster sluit',
  'billing.referral.commissionApproved': 'Goedgekeurd',
  'billing.referral.commissionReversed': 'Na terugbetaling teruggedraaid',
  'billing.referral.payout': 'Uitbetalingen lopen op {schedule}.',
} as const;
