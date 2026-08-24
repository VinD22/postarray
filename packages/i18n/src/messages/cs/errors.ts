/**
 * One entry per `RelayError` code.
 *
 * Every code has `error.<code>.message`, the sentence a person reads, and
 * `error.<code>.action`, what they can do next. Messages name the account or
 * the action. They never leak a provider payload, a token or an internal ID.
 */
export const errorMessages = {
  'error.unknown.message': 'Něco se pokazilo a nemohli jsme to klasifikovat.',
  'error.unknown.action':
    'Zkuste to znovu. Pokud se to bude opakovat, pošlete nám níže uvedený odkaz.',
  'error.internal.message': 'Toto je problém na naší straně, nikoli s vaším obsahem.',
  'error.internal.action':
    'Vaše práce je uložena. Byli jsme upozorněni. Zkuste to znovu za několik minut.',
  'error.not_implemented.message': 'Relé toto ještě nepostavilo.',
  'error.not_implemented.action': 'Při odeslání sledujte changelog.',
  'error.offline.message': 'Jste offline.',
  'error.offline.action':
    'Váš koncept je uložen v tomto zařízení. Publikování a plánování se obnoví, když se připojení vrátí.',
  'error.network_unreachable.message': 'Nemohli jsme se spojit se serverem.',
  'error.network_unreachable.action':
    'Zkontrolujte připojení a zkuste to znovu. Nic se neztratilo.',
  'error.request_invalid.message': 'Požadavek nebyl ve tvaru, který můžeme přijmout.',
  'error.request_invalid.action': 'Zkontrolujte pole uvedená níže a odešlete jej znovu.',
  'error.validation_failed.message': 'Některá pole je třeba před uložením změnit.',
  'error.validation_failed.action': 'Opravte zvýrazněná pole.',
  'error.unauthenticated.message': 'Abyste to mohli provést, musíte být přihlášeni.',
  'error.unauthenticated.action': 'Přihlaste se a my vás sem vrátíme.',
  'error.session_expired.message': 'Platnost vaší relace vypršela.',
  'error.session_expired.action': 'Znovu se přihlaste. Váš koncept je uložen.',
  'error.mfa_required.message': 'Tato akce vyžaduje dvoufaktorové potvrzení.',
  'error.mfa_required.action': 'Pokračujte potvrzením pomocí aplikace pro ověřování.',
  'error.forbidden.message': 'Vaše role tuto akci neumožňuje.',
  'error.forbidden.action':
    'Požádejte vlastníka nebo správce tohoto pracovního prostoru o přístup.',
  'error.insufficient_scope.message': 'Toto pověření nemá rozsah {scope}.',
  'error.insufficient_scope.action':
    'Udělte tento rozsah nebo použijte pověření, které jej již má.',
  'error.workspace_not_found.message': 'Tento pracovní prostor neexistuje nebo nejste jeho členem.',
  'error.workspace_not_found.action': 'Vyberte si pracovní prostor, do kterého patříte.',
  'error.workspace_suspended.message': 'Tento pracovní prostor je pozastaven.',
  'error.workspace_suspended.action':
    'Pro vyřešení problému kontaktujte podporu. Vaše data jsou nedotčená.',
  'error.not_found.message': 'Tato položka již neexistuje.',
  'error.not_found.action': 'Možná byla smazána. Vraťte se a obnovte seznam.',
  'error.conflict.message': 'Někdo jiný to změnil, když jste na tom pracovali.',
  'error.conflict.action': 'Prohlédněte si obě verze a poté znovu uložte.',
  'error.idempotency_key_reused.message':
    'Tento klíč idempotency již byl použit pro jiný požadavek.',
  'error.idempotency_key_reused.action':
    'Použijte nový klíč nebo opakujte přesně původní požadavek.',
  'error.rate_limited.message': 'Příliš mnoho požadavků.',
  'error.rate_limited.action': 'Zkuste to znovu po {time}.',
  'error.quota_exceeded.message': 'Tato akce překračuje limit pro aktuální období.',
  'error.quota_exceeded.action': 'Limit se resetuje {relativeTime}.',
  'error.payment_required.message': 'Tento pracovní prostor nemá aktivní předplatné.',
  'error.payment_required.action': 'Spusťte předplatné a publikujte znovu. Nic se nesmaže.',
  'error.subscription_past_due.message': 'Poslední platba neprošla.',
  'error.subscription_past_due.action': 'Aktualizujte platební metodu na portálu Polar.',
  'error.trial_expired.message': 'Zkušební verze skončila {date}.',
  'error.trial_expired.action': 'Zahajte předplatné a pokračujte v publikování.',
  'error.post_credits_exhausted.message':
    'Tento pracovní prostor vyčerpal všechny bezplatné příspěvky. Vše ostatní funguje dál.',
  'error.post_credits_exhausted.action':
    'Vyberte si tarif a publikujte dál. Vaše účty zůstávají připojené a koncepty i naplánované příspěvky se zachovají.',
  'error.entitlement_missing.message': 'Tento pracovní prostor nemá přístup k této funkci.',
  'error.entitlement_missing.action': 'Zkontrolujte nastavení fakturace nebo kontaktujte podporu.',
  'error.channel_limit_reached.message':
    'Tento pracovní prostor již používá všechny {limit} aktivní kanály.',
  'error.channel_limit_reached.action': 'Před připojením dalšího kanálu odpojte kanál.',
  'error.project_limit_reached.message':
    'Tento pracovní prostor už používá všech {limit} aktivních projektů.',
  'error.project_limit_reached.action':
    'Archivujte neaktivní projekt nebo změňte limit projektů pracovního prostoru.',
  'error.project_has_connections.message':
    'Tento projekt stále má {connected, plural, one {# připojený kanál} few {# připojené kanály} many {# připojeného kanálu} other {# připojených kanálů}}.',
  'error.project_has_connections.action':
    'Před archivací tohoto projektu odpojte každý kanál v něm.',
  'error.project_last_active.message': 'Pracovní prostor musí mít alespoň jeden aktivní projekt.',
  'error.project_last_active.action': 'Před archivací tohoto vytvořte jiný projekt.',
  'error.connection_not_found.message': 'Toto připojení již není v tomto pracovním prostoru.',
  'error.connection_not_found.action': 'Znovu připojte účet, abyste do něj mohli dále publikovat.',
  'error.connection_revoked.message': '{account} odebral přístup na {provider}.',
  'error.connection_revoked.action': 'Znovu připojte účet. Poté se obnoví naplánované příspěvky.',
  'error.connection_expired.message': 'Přístup pro {account} vypršela.',
  'error.connection_expired.action': 'Znovu připojte účet a obnovte publikování a analýzy.',
  'error.connection_paused.message': '{account} je pozastaveno.',
  'error.connection_paused.action': 'Až budete připraveni, pokračujte v aplikaci Connections.',
  'error.connection_permission_missing.message': '{account} neudělil oprávnění potřebné k tomu.',
  'error.connection_permission_missing.action':
    'Znovu připojte a přijměte {permission} na obrazovce souhlasu.',
  'error.connection_account_type_invalid.message':
    'Instagram potřebuje profesionální účet. {account} je osobní účet.',
  'error.connection_account_type_invalid.action':
    'Přepněte jej na účet firmy nebo autora v aplikaci Instagram a poté se znovu připojte.',
  'error.connection_review_pending.message':
    '{provider} stále kontroluje tuto aplikaci pro {account}.',
  'error.connection_review_pending.action':
    'Příspěvky se publikují soukromě, dokud kontrola neprojde. Tuto stránku aktualizujeme, když se změní.',
  'error.capability_unsupported.message':
    '{provider} to prostřednictvím svého oficiálního API nenabízí.',
  'error.capability_unsupported.action': 'Použijte formát, který tento účet podporuje.',
  'error.capability_not_implemented.message': 'Relé nevytvořilo toto pro {provider} zatím.',
  'error.capability_not_implemented.action':
    'Stránka schopností uvádí, co dnes každý konektor umí.',
  'error.capability_requires_review.message':
    '{provider} toto uděluje až poté, co zkontroluje aplikaci nebo účet.',
  'error.capability_requires_review.action': 'Zůstane nedostupná, dokud tato kontrola neprojde.',
  'error.content_invalid.message': '{provider} nepřijme tento obsah pro {account}.',
  'error.content_invalid.action': 'Problémy jsou uvedeny v cíli. Opravte je a zkuste to znovu.',
  'error.content_changed_after_approval.message': 'Tento příspěvek se po schválení změnil.',
  'error.content_changed_after_approval.action': 'Před zveřejněním znovu požádejte o schválení.',
  'error.duplicate_content.message':
    'Velmi podobný obsah byl publikován na {account} {relativeTime}.',
  'error.duplicate_content.action':
    'Změňte text nebo jej publikujte později. Platformy omezují duplicitní příspěvky.',
  'error.cadence_limit_reached.message':
    '{account} dosáhlo kadence odesílání nastavené pro tento pracovní prostor.',
  'error.cadence_limit_reached.action': 'Naplánujte to na pozdější slot nebo zvyšte limit kadence.',
  'error.media_invalid.message': 'Tento soubor nelze publikovat na {provider}.',
  'error.media_invalid.action': 'Přesný limit je zobrazen vedle souboru.',
  'error.media_too_large.message': 'Tento soubor je větší než {provider} přijímá.',
  'error.media_too_large.action':
    'Zkomprimujte jej nebo nahrajte menší verzi. Originál je zachován.',
  'error.media_processing_failed.message': 'Tento soubor se nepodařilo připravit pro {provider}.',
  'error.media_processing_failed.action': 'Zkuste to nahrát znovu nebo použijte jiný formát.',
  'error.media_rights_undeclared.message': 'Toto médium nemá žádné prohlášení o právech.',
  'error.media_rights_undeclared.action':
    'Potvrďte, že máte práva k jeho zveřejnění, včetně všech osob v něm obsažených.',
  'error.alt_text_required.message': 'Tento obrázek vyžaduje alternativní text pro {provider}.',
  'error.alt_text_required.action': 'Popište obrázek nebo jej označte jako dekorativní.',
  'error.approval_required.message': 'Tento pracovní prostor vyžaduje před publikováním schválení.',
  'error.approval_required.action': 'Požádejte o schválení od {approver}.',
  'error.approval_expired.message': 'Schválení tohoto příspěvku vypršelo dne {date}.',
  'error.approval_expired.action': 'Požádejte o schválení znovu.',
  'error.schedule_in_past.message': 'Tato doba již uplynula v {timeZone}.',
  'error.schedule_in_past.action': 'Zvolte pozdější čas nebo publikujte nyní.',
  'error.schedule_conflict.message': '{account} již má příspěvek v rámci {duration} této doby.',
  'error.schedule_conflict.action':
    'Přesuňte jeden z nich nebo pokračujte, pokud je tato mezera zamýšlena.',
  'error.time_zone_invalid.message': 'Nerozpoznáváme časové pásmo {timeZone}.',
  'error.time_zone_invalid.action': 'Vyberte zónu ze seznamu.',
  'error.destination_unavailable.message': 'Cíl {destination} již není k dispozici na {provider}.',
  'error.destination_unavailable.action': 'Obnovte seznam cílů a vyberte jiný.',
  'error.mention_unresolved.message': 'Zmínka nebyla přiřazena skutečnému {provider} účet.',
  'error.mention_unresolved.action':
    'Vyhledejte a vyberte účet nebo zmínku odstraňte. Nikdy nepublikujeme falešnou nativní značku.',
  'error.provider_transient.message': '{provider} to teď nemohl zpracovat.',
  'error.provider_transient.action': 'Zkusíme to automaticky znovu. Nic není duplicitní.',
  'error.provider_permanent.message': '{provider} to odmítl a nebude akceptovat další pokus.',
  'error.provider_permanent.action': 'Dezinfikovaná odpověď je na potvrzení.',
  'error.provider_rate_limited.message': '{provider} sazba omezila tento pracovní prostor.',
  'error.provider_rate_limited.action': 'Zkusíme to znovu po {time}.',
  'error.provider_unavailable.message': '{provider} nereaguje.',
  'error.provider_unavailable.action':
    'Zkontrolujte stavovou stránku. Naplánované příspěvky se neustále opakují.',
  'error.provider_content_rejected.message':
    '{provider} odmítl tento obsah na základě svých vlastních zásad.',
  'error.provider_content_rejected.action':
    'Důvod je uveden na účtence. Upravte obsah nebo se odvolejte pomocí {provider}.',
  'error.user_action_required.message':
    '{account} od vás něco potřebuje, než bude moci publikovat.',
  'error.user_action_required.action': 'Otevřete připojení a podívejte se, co chybí.',
  'error.short_link_destination_blocked.message': 'Tento cíl nelze zkrátit.',
  'error.short_link_destination_blocked.action':
    'Soukromé sítě, nebezpečná schémata a známé zneužívající cíle jsou blokovány.',
  'error.short_link_domain_unverified.message': 'Doména {domain} zatím není ověřeno.',
  'error.short_link_domain_unverified.action':
    'Přidejte záznam DNS zobrazený v nastavení a ověřte.',
  'error.rss_feed_invalid.message': 'Tato adresa URL nevrátila platný zdroj RSS nebo Atom.',
  'error.rss_feed_invalid.action':
    'Zkontrolujte adresu. Načítáme jej bezpečně a neprovádíme žádná soukromá přesměrování.',
  'error.webhook_signature_invalid.message': 'Podpis na tomto webhooku nebyl ověřen.',
  'error.webhook_signature_invalid.action':
    'Zkontrolujte, zda odesílatel používá aktuální podpisový klíč. Užitná zátěž nebyla zpracována.',
  'error.webhook_delivery_failed.message': 'Doručení do {endpoint} se nezdařilo.',
  'error.webhook_delivery_failed.action':
    'Zkusíme to znovu s ústupem. Protokol doručení má odpověď.',
  'error.automation_rule_not_permitted.message':
    'Toto pravidlo by porušilo pravidlo platformy, takže ho nelze vytvořit.',
  'error.automation_rule_not_permitted.action':
    'Automatické lajky, sledování, nevyžádané odpovědi a duplicitní hromadné příspěvky nejsou nikdy dostupné.',
  'error.ai_unavailable.message': 'Asistent psaní není momentálně k dispozici.',
  'error.ai_unavailable.action': 'Váš text je nedotčen. Zkuste to za chvíli znovu.',
  'error.ai_output_invalid.message': 'Asistent vrátil něco, co jsme nemohli ověřit.',
  'error.ai_output_invalid.action': 'Na váš koncept nebylo nic použito. Zkuste to znovu.',
  'error.ai_budget_exceeded.message':
    'Tento pracovní prostor prozatím dosáhl limitu pro asistenty.',
  'error.ai_budget_exceeded.action': 'Limit se resetuje {relativeTime}. Psaní rukou stále funguje.',
  'error.storage_unavailable.message': 'Nemohli jsme dosáhnout úložiště médií.',
  'error.storage_unavailable.action': 'Váš text je uložen. Zkuste nahrát znovu za chvíli.',
  'error.export_unavailable.message': 'Tento export nebylo možné vyrobit.',
  'error.export_unavailable.action': 'Zkuste menší rozsah nebo kontaktujte podporu s odkazem.',

  'error.reference': 'Reference {correlationId}',
  'error.reportToSupport': 'Odeslat na podporu',
  'error.contentPreserved': 'Váš obsah je zachován. Nic nebylo zveřejněno.',
} as const;
