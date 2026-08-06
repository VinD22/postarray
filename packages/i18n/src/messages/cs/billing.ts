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
  'billing.title': 'Fakturace',
  'billing.plan.name': 'Relé',
  'billing.plan.single': 'Jeden plán. Každá funkce. Žádné úrovně.',
  'billing.plan.monthlyPrice': '29 $ měsíčně',
  'billing.plan.annualPrice': '300 $/rok',
  'billing.plan.annualFraming': '25 $ měsíčně účtováno ročně. Ušetřete 48 $ ročně.',
  'billing.plan.interval.monthly': 'Měsíčně',
  'billing.plan.interval.annual': 'Roční',
  'billing.plan.selectInterval': 'Vyberte interval účtování',
  'billing.plan.includes.title': 'Co je zahrnuto',
  'billing.plan.includes.channels': 'Až 30 aktivních sociálních kanálů',
  'billing.plan.includes.members': 'Neomezený počet členů týmu',
  'billing.plan.includes.posts':
    'Neomezené koncepty a plánované příspěvky v rámci principu fair use',
  'billing.plan.includes.connectors': 'Každý schválený konektor',
  'billing.plan.includes.analytics': 'Analytics uchovávané ode dne připojení účtu',
  'billing.plan.includes.api': 'REST API, vzdálený MCP server, CLI a webhooky',
  'billing.plan.includes.automation':
    'Pravidla automatizace, automatické odesílání RSS a sledované odkazy',
  'billing.plan.includes.ai': 'Textová pomoc DeepSeek při zneužívání a limitech nákladů',
  'billing.plan.includes.support': 'E-mail a podpora v aplikaci',
  'billing.plan.fairUse':
    'Spravedlivé použití znamená kontrolu proti spamu, sazbě a nákladům poskytovatele, které chrání vaše účty. Fungují stejně pro každého předplatitele.',

  'billing.trial.length': 'Sedmidenní zkušební verze se všemi funkcemi',
  'billing.trial.dueToday': '0 $ splatných dnes',
  'billing.trial.paymentMethodRequired':
    'Polar nyní vybírá platební metodu a dnes si nic neúčtuje.',
  'billing.trial.firstCharge': 'První nabití {amount} na {date}',
  'billing.trial.renewal': 'Obnoví {amount} každých {interval} poté',
  'billing.trial.cancelBefore': 'Zrušte v Nastavení před tímto datem a nebudou vám účtovány.',
  'billing.trial.reminder': 'Polar vám pošle e-mail tři dny před převodem zkušební verze.',
  'billing.trial.daysRemaining':
    '{count, plural, =0 {Zkušební verze dnes končí} one {Zkušební verze, # zbývající den} other {Zkušební verze, # zbývající dny} few {Zkušební verze, # zbývající dny} many {Zkušební verze, # zbývající dny}}',
  'billing.trial.converted': 'Vaše zkušební verze převedena na {date}.',
  'billing.trial.canceled': 'Vaše zkušební verze je zrušena. Nebude vám nic účtováno.',
  'billing.trial.abusePrevention':
    'Opakované pokusy jsou omezené. Pokud zkušební verze pro tento účet není k dispozici, kontaktujte podporu.',

  'billing.checkout.open': 'Pokračovat k pokladně',
  'billing.checkout.hostedBy':
    'Pokladna a faktury jsou zpracovány společností Polar, naším známým obchodníkem.',
  'billing.checkout.taxNote': 'Polar vybírá a odvádí veškeré příslušné daně z obratu nebo DPH.',
  'billing.checkout.notEntitledYet':
    'Přístup udělujeme poté, co Polar potvrdí předplatné, nikoli z přesměrování prohlížeče. Obvykle to trvá několik sekund.',
  'billing.checkout.returning': 'Potvrzení předplatného s Polar',

  'billing.subscription.status.trialing': 'Zkušební verze',
  'billing.subscription.status.active': 'Aktivní',
  'billing.subscription.status.pastDue': 'Platba po splatnosti',
  'billing.subscription.status.canceled': 'Zrušeno',
  'billing.subscription.status.unpaid': 'Nezaplaceno',
  'billing.subscription.status.none': 'Žádné předplatné',
  'billing.subscription.renewsOn': 'Obnoví {amount} na {date}',
  'billing.subscription.endsOn': 'Přístup pokračuje do {date}',
  'billing.subscription.pastDueBody':
    'Poslední platba neprošla. Chcete-li pokračovat v publikování, aktualizujte platební metodu. Po uplynutí doby odkladu se pracovní prostor stane pouze pro čtení a plánované příspěvky se zastaví.',
  'billing.subscription.readOnly':
    'Tento pracovní prostor je pouze pro čtení. Váš obsah, účtenky a spojení jsou nedotčeny.',
  'billing.subscription.portal': 'Otevřete zákaznický portál Polar',
  'billing.subscription.invoices': 'Faktury',
  'billing.subscription.paymentMethod': 'Způsob platby',
  'billing.subscription.managedByPolar': 'Spravováno společností Polar',

  'billing.cancel.title': 'Zrušte své předplatné',
  'billing.cancel.beforeTrialEnd':
    'Zrušte nyní a nebudou vám účtovány poplatky. Všechny funkce si ponecháte do {date}.',
  'billing.cancel.afterTrial': 'Přístup si ponecháte do {date}. Po skončení se nic nesmaže.',
  'billing.cancel.confirm': 'Zrušit předplatné',
  'billing.cancel.confirmed': 'Zrušeno. Nebude vám nic účtováno.',
  'billing.cancel.keepData':
    'Vaše koncepty, účtenky a analýzy zůstávají v tomto pracovním prostoru.',

  'billing.usage.title': 'Využití',
  'billing.usage.meteredNote':
    'Některé náklady poskytovatele jsou převedeny na náklady, protože poskytovatel účtuje za operaci.',
  'billing.usage.xCharges':
    'X poplatků za každý příspěvek. Příspěvky, které obsahují adresu URL, jsou dražší než prostý text.',
  'billing.usage.balance': 'Zůstatek využití {amount}',
  'billing.usage.estimatedBeforeAction': 'Tato akce se odhaduje na {amount}.',
  'billing.usage.periodTotal': '{amount} používané od {date}',
  'billing.usage.noMediaCredits':
    'Neexistují žádné titulky pro generování obrázků nebo videa, protože Relay negeneruje média.',

  'billing.downgrade.overLimit':
    'Tento pracovní prostor má {count, plural, one {# kanál} other {# kanály} few {# kanály} many {# kanály}} nad limit. Nové akce na těchto kanálech jsou blokovány. Nic pro vás není odpojeno.',

  'billing.mediaGeneration.title': 'Proč negenerujeme obrázky ani videa',
  'billing.mediaGeneration.explanation':
    'Zaměřujeme se na to, abychom vám pomohli plánovat, schvalovat, publikovat a učit se. Negenerujeme obrázky ani videa ve verzi V1, protože média připravená na značku potřebují více než krátkou výzvu: potřebují váš kompletní vizuální systém, přesné podrobnosti o produktu, licencovaná aktiva, osoby a oprávnění k použití a pečlivou kontrolu. Kreativní modely se také rychle mění. Doporučujeme aktuálně ověřené specializované nástroje, které usnadní převedení jejich hotové práce do vašich kampaní, zatímco vy budete mít kreativu pod kontrolou.',

  'billing.referral.title': 'Doporučení',
  'billing.referral.disclosure':
    'Odkazy na doporučení musí být zveřejněny všude, kde je sdílíte. Provize není nikdy podmíněna kladnou kontrolou.',
  'billing.referral.link': 'Váš odkaz na doporučení',
  'billing.referral.attributed':
    '{count, plural, one {# přiřazená registrace} other {# přiřazené registrace} few {# přiřazené registrace} many {# přiřazené registrace}}',
  'billing.referral.commissionPending':
    'Nevyřízeno, pozastaveno, dokud se neuzavře okno pro vrácení peněz',
  'billing.referral.commissionApproved': 'Schváleno',
  'billing.referral.commissionReversed': 'Vráceno po vrácení peněz',
  'billing.referral.payout': 'Probíhají výplaty {schedule}.',
} as const;
