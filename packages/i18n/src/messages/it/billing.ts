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
  'billing.title': 'Fatturazione',
  'billing.plan.name': 'Relay',
  'billing.plan.single': 'Un piano. Ogni caratteristica. Nessun livello.',
  'billing.plan.monthlyPrice': '$29/mese',
  'billing.plan.annualPrice': '$ 300/anno',
  'billing.plan.annualFraming': "$ 25 al mese fatturati annualmente. Risparmia $ 48 all'anno.",
  'billing.plan.interval.monthly': 'Mensile',
  'billing.plan.interval.annual': 'Annuale',
  'billing.plan.selectInterval': 'Scegli un intervallo di fatturazione',
  'billing.plan.includes.title': 'Cosa è incluso',
  'billing.plan.includes.channels': 'Fino a 30 canali social attivi',
  'billing.plan.includes.members': 'Membri del team illimitati',
  'billing.plan.includes.posts': 'Bozze illimitate e post programmati in condizioni di fair use',
  'billing.plan.includes.connectors': 'Ogni connettore approvato',
  'billing.plan.includes.analytics': 'Analisi conservate dal giorno in cui colleghi un account',
  'billing.plan.includes.api': 'API REST, server MCP remoto, CLI e webhook',
  'billing.plan.includes.automation':
    'Regole di automazione, post automatico RSS e collegamenti tracciati',
  'billing.plan.includes.ai': 'Assistenza SMS DeepSeek con limiti di abuso e costi',
  'billing.plan.includes.support': "Supporto via e-mail e nell'app",
  'billing.plan.fairUse':
    'Fair use significa controlli antispam, tariffe e costi del fornitore che proteggono i tuoi account. Funzionano allo stesso modo per ogni abbonato.',

  'billing.trial.length': 'Prova di sette giorni con tutte le funzionalità',
  'billing.trial.dueToday': '$ 0 con scadenza oggi',
  'billing.trial.paymentMethodRequired':
    'Polar raccoglie subito un metodo di pagamento e oggi non addebita alcun costo.',
  'billing.trial.firstCharge': 'Prima carica {amount} su {date}',
  'billing.trial.renewal': 'Successivamente rinnova {amount} ogni {interval}',
  'billing.trial.cancelBefore':
    'Annulla nelle Impostazioni prima di questa data e non ti verrà addebitato alcun importo.',
  'billing.trial.reminder':
    "Polar ti invia un'e-mail tre giorni prima della conversione della prova.",
  'billing.trial.daysRemaining':
    '{count, plural, =0 {La prova termina oggi} one {Prova, # giorni rimanenti} many {Prova, # giorni rimanenti} other {Prova, # giorni rimanenti}}',
  'billing.trial.converted': 'La tua prova è stata convertita su {date}.',
  'billing.trial.canceled': 'La tua prova è stata annullata. Non ti verrà addebitato alcun costo.',
  'billing.trial.abusePrevention':
    "Le prove ripetute sono limitate. Se non è disponibile una prova per questo account, contatta l'assistenza.",

  'billing.checkout.open': 'Continua alla cassa',
  'billing.checkout.hostedBy':
    'Il pagamento e le fatture sono gestiti da Polar, il nostro commerciante registrato.',
  'billing.checkout.taxNote':
    'Polar riscuote e versa eventuali imposte sulle vendite o IVA applicabili.',
  'billing.checkout.notEntitledYet':
    "Concediamo l'accesso dopo che Polar ha confermato l'abbonamento, non dal reindirizzamento del browser. Solitamente l'operazione richiede alcuni secondi.",
  'billing.checkout.returning': "Conferma dell'abbonamento con Polar",

  'billing.subscription.status.trialing': 'Prova',
  'billing.subscription.status.active': 'Attivo',
  'billing.subscription.status.pastDue': 'Pagamento in ritardo',
  'billing.subscription.status.canceled': 'Annullato',
  'billing.subscription.status.unpaid': 'Non pagato',
  'billing.subscription.status.none': 'Nessun abbonamento',
  'billing.subscription.renewsOn': 'Rinnova {amount} su {date}',
  'billing.subscription.endsOn': "L'accesso continua fino a {date}",
  'billing.subscription.pastDueBody':
    "L'ultimo pagamento non è andato a buon fine. Aggiorna il metodo di pagamento per continuare a pubblicare. Dopo il periodo di tolleranza, l'area di lavoro diventa di sola lettura e i post pianificati vengono interrotti.",
  'billing.subscription.readOnly':
    'Questo spazio di lavoro è di sola lettura. I tuoi contenuti, ricevute e connessioni sono intatti.',
  'billing.subscription.portal': 'Aprire il portale clienti Polar',
  'billing.subscription.invoices': 'Fatture',
  'billing.subscription.paymentMethod': 'Metodo di pagamento',
  'billing.subscription.managedByPolar': 'Gestito da Polar',

  'billing.cancel.title': 'Annulla il tuo abbonamento',
  'billing.cancel.beforeTrialEnd':
    'Annulla ora e non ti verrà addebitato alcun costo. Mantieni tutte le funzionalità fino a {date}.',
  'billing.cancel.afterTrial':
    "Mantieni l'accesso fino a {date}. Al termine non viene eliminato nulla.",
  'billing.cancel.confirm': "Annulla l'abbonamento",
  'billing.cancel.confirmed': 'Annullato. Non ti verrà addebitato alcun costo.',
  'billing.cancel.keepData': "Le tue bozze, ricevute e analisi rimangono in quest'area di lavoro.",

  'billing.usage.title': 'Utilizzo',
  'billing.usage.meteredNote':
    'Alcuni costi del provider vengono trasferiti al costo perché il provider addebita per operazione.',
  'billing.usage.xCharges':
    'X addebiti per ogni post. I post che contengono un URL costano più del semplice testo.',
  'billing.usage.balance': 'Bilancio di utilizzo {amount}',
  'billing.usage.estimatedBeforeAction': 'Questa azione è stimata in {amount}.',
  'billing.usage.periodTotal': '{amount} utilizzato da {date}',
  'billing.usage.noMediaCredits':
    'Non sono previsti crediti per la generazione di immagini o video, poiché Relay non genera contenuti multimediali.',

  'billing.downgrade.overLimit':
    'Questo spazio di lavoro ha {count, plural, one {# canale} many {# canali} other {# canali}} oltre il limite. Le nuove azioni su questi canali vengono bloccate. Niente è disconnesso per te.',

  'billing.mediaGeneration.title': 'Perché non generiamo immagini o video',
  'billing.mediaGeneration.explanation':
    "Ci concentriamo sull'aiutarti a pianificare, approvare, pubblicare e apprendere. Non generiamo immagini o video nella V1 perché i media pronti per il marchio richiedono più di un breve messaggio: hanno bisogno del tuo sistema visivo completo, dettagli accurati del prodotto, risorse concesse in licenza, persone e autorizzazioni di utilizzo e un'attenta revisione. Anche i modelli creativi cambiano rapidamente. Consigliamo strumenti specialistici attualmente verificati e semplifichiamo l'inserimento del loro lavoro finito nelle tue campagne mantenendo il controllo creativo.",

  'billing.referral.title': 'Referral',
  'billing.referral.disclosure':
    'I link di riferimento devono essere divulgati ovunque li condividi. La Commissione non è mai subordinata a una revisione positiva.',
  'billing.referral.link': 'Il tuo link di riferimento',
  'billing.referral.attributed':
    '{count, plural, one {# iscrizioni attribuite} many {# iscrizioni attribuite} other {# iscrizioni attribuite}}',
  'billing.referral.commissionPending':
    'In sospeso, trattenuto fino alla chiusura della finestra di rimborso',
  'billing.referral.commissionApproved': 'Approvato',
  'billing.referral.commissionReversed': 'Annullato dopo un rimborso',
  'billing.referral.payout': 'I pagamenti vengono eseguiti {schedule}.',
} as const;
