/** Workspace settings: members, roles, projects, localization, security, data. */
export const settingsMessages = {
  'settings.title': 'Instellingen',
  'settings.saved': 'Opgeslagen',
  'settings.unsavedChanges': 'U heeft niet-opgeslagen wijzigingen.',

  'settings.workspace.title': 'Workspace',
  'settings.workspace.name': 'Workspace-naam',
  'settings.workspace.defaultTimeZone': 'Standaard tijdzone',
  'settings.workspace.defaultLocale': 'Standaard interfacetaal',
  'settings.workspace.defaultContentLocale': 'Standaard inhoudstaal',
  'settings.workspace.transferOwnership': 'Eigendom overdragen',
  'settings.workspace.delete': 'Werkruimte verwijderen',
  'settings.workspace.deleteWarning':
    'Als u een werkruimte verwijdert, worden geplande berichten geannuleerd, verbindingen ingetrokken en opgeslagen media verwijderd. Ontvangsten worden bewaard gedurende de bewaartermijn vermeld in de Voorwaarden.',

  'settings.members.title': 'Leden en rollen',
  'settings.members.invite': 'Nodig mensen uit',
  'settings.members.inviteEmail': 'E-mailadres',
  'settings.members.inviteSent': 'Uitnodiging verzonden naar {email}.',
  'settings.members.pending': 'Uitgenodigd, nog niet geaccepteerd',
  'settings.members.count': '{count, plural, one {# lid} other {# leden}}',
  'settings.members.removeConfirm':
    '{name} uit deze werkruimte verwijderen? Hun eerdere acties blijven in het auditlogboek staan.',
  'settings.role.owner.label': 'Eigenaar',
  'settings.role.admin.label': 'Beheerder',
  'settings.role.manager.label': 'Beheerder',
  'settings.role.editor.label': 'Redacteur',
  'settings.role.approver.label': 'Goedkeurder',
  'settings.role.analyst.label': 'Analist',
  'settings.role.viewer.label': 'Kijker',
  'settings.role.owner.description': 'Alles, inclusief facturering, beveiliging en verwijdering.',
  'settings.role.admin.description': 'Alles behalve facturering en verwijdering van werkruimte.',
  'settings.role.manager.description': "Beheer projecten, verbindingen, schema's en regels.",
  'settings.role.editor.description': 'Creëer en bewerk inhoud, vraag goedkeuring aan.',
  'settings.role.approver.description': 'Keur inhoud goed of af en plan wat wordt goedgekeurd.',
  'settings.role.analyst.description': 'Lees analyses en ontvangstbewijzen.',
  'settings.role.viewer.description': 'Alleen lezen.',
  'settings.role.scopeLabel': 'Beperk tot projecten en accounts',
  'settings.role.mfaRequired': 'Eigenaars moeten tweefactorauthenticatie gebruiken.',

  'settings.projects.title': 'Projecten',
  'settings.projects.add': 'Voeg een project toe',
  'settings.projects.voice': 'Stem',
  'settings.projects.audience': 'Publiek',
  'settings.projects.approvedClaims': 'Goedgekeurde claims',
  'settings.projects.blockedTerms': 'Geblokkeerde termen',
  'settings.projects.disclosureDefaults': 'Standaardwaarden voor openbaarmaking',
  'settings.projects.domains': 'Domeinen',
  'settings.projects.glossary.title': 'Woordenlijst',
  'settings.projects.glossary.term': 'Termijn',
  'settings.projects.glossary.preferred': 'Voorkeur vertaling',
  'settings.projects.glossary.prohibited': 'Niet vertalen als',
  'settings.projects.glossary.context': 'Context',
  'settings.projects.glossary.keepUntranslated': 'Onvertaald houden',
  'settings.projects.localeRules.title': 'Lokale regels',
  'settings.projects.localeRules.formality': 'Formaliteit',
  'settings.projects.localeRules.pronouns': 'Voornaamwoorden en eretitels',
  'settings.projects.localeRules.idioms': 'Idioom om te vermijden',
  'settings.projects.localeRules.emoji': 'Emoji- en hashtag-normen',
  'settings.projects.localeRules.legal': 'Regionale juridische openbaarmakingen',
  'settings.projects.localeRules.cta': 'Oproep tot actie per markt',
  'settings.projects.localeRules.reviewedExamples':
    'Voorbeelden goedgekeurd door een native reviewer',

  'settings.sets.title': 'Stelt in',
  'settings.sets.description':
    'Een herbruikbare groep doelen, varianten, instellingen, opmerkingen en vertragingen. Door een set toe te passen, ontstaat een zelfstandig concept.',
  'settings.sets.editNote':
    'Als u een set bewerkt, worden berichten die al zijn goedgekeurd of gepland niet gewijzigd.',
  'settings.signatures.title': 'Handtekeningen',
  'settings.signatures.description':
    'Slottekst, hashtags, links of mededelingen, gerangschikt per project, platform en taal.',
  'settings.signatures.autoApply': 'Automatisch toevoegen wanneer de context overeenkomt',

  'settings.localization.title': 'Lokalisatie',
  'settings.localization.interfaceLocale': 'Interfacetaal',
  'settings.localization.interfaceLocaleHelp':
    'De taal van deze app voor jou. Het verandert niets aan de taal van uw berichten.',
  'settings.localization.contentLocales': 'Inhoud talen',
  'settings.localization.contentLocalesHelp':
    'De talen waarin je publiceert. Elk project kan per taal regels en een woordenlijst instellen.',
  'settings.localization.marketLocales': 'Publiekmarkten',
  'settings.localization.beta': 'Bèta-vertaling',
  'settings.localization.betaHelp':
    'Deze taal wordt door een machine ondersteund en is nog niet volledig door iemand beoordeeld. Onvertaalde tekst valt terug naar het Engels.',
  'settings.localization.humanReviewed': 'Beoordeeld door een native speaker',
  'settings.localization.timeZone': 'Tijdzone',
  'settings.localization.weekStart': 'Eerste dag van de week',
  'settings.localization.hourCycle.label': 'Tijdformaat',
  'settings.localization.hourCycle.h12': '12 uur',
  'settings.localization.hourCycle.h23': '24 uur',

  'settings.notifications.title': 'Meldingen',
  'settings.notifications.email': 'E-mail',
  'settings.notifications.inApp': 'In app',
  'settings.notifications.approvalRequests': 'Goedkeuringsverzoeken',
  'settings.notifications.publishResults': 'Resultaten publiceren',
  'settings.notifications.connectionHealth': 'Verbindingsstatus',
  'settings.notifications.ruleFailures': 'Automatiseringsfouten',
  'settings.notifications.weeklySummary': 'Wekelijkse samenvatting',
  'settings.notifications.digestOnly': 'Groepeer deze in één dagelijks bericht',

  'settings.security.title': 'Beveiliging',
  'settings.security.mfa': 'Tweefactorauthenticatie',
  'settings.security.mfaEnable': 'Schakel tweefactorauthenticatie in',
  'settings.security.mfaRequiredFor':
    'Vereist voor factureringswijzigingen, serviceaccounts, het opnieuw verbinden van een account en het intrekken van inloggegevens.',
  'settings.security.passkeys': 'Wachtwoorden',
  'settings.security.sessions': 'Actieve sessies',
  'settings.security.sessionRevoke': 'Meld u af voor deze sessie',
  'settings.security.auditLog.title': 'Auditlogboek',
  'settings.security.auditLog.description':
    'Elke actie, wie of wat deze heeft uitgevoerd en wanneer. Exporteerbaar door eigenaren en beheerders.',
  'settings.security.killSwitch': 'Noodstop',
  'settings.security.killSwitchBody':
    'Stopt elke geplande publicatie en automatisering in deze werkruimte onmiddellijk. Er wordt niets verwijderd. Je kunt het weer uitschakelen.',
  'settings.security.killSwitchActive':
    'De noodstop is ingeschakeld. Er wordt geen bericht gepubliceerd.',

  'settings.data.title': 'Gegevenscontroles',
  'settings.data.export': 'Exporteer uw gegevens',
  'settings.data.exportPreparing':
    'Uw export voorbereiden. Wij sturen u een e-mail als het klaar is.',
  'settings.data.deletionRequest': 'Verwijdering aanvragen',
  'settings.data.deletionExplain':
    'Door het verwijderen worden geplande workflows geannuleerd, wordt de toegang van de provider ingetrokken, worden opgeslagen media en tombstones-analyses verwijderd waar de provider dit nodig heeft.',
  'settings.data.retention': 'Retentie',
  'settings.data.consents': 'Toestemmingen',
  'settings.data.consent.productAnalytics': 'Productanalyse',
  'settings.data.consent.diagnostics': 'Deel diagnostische gegevens met ondersteuning',
  'settings.data.consent.aiImprovement':
    'Gebruik mijn inhoud om de assistent te verbeteren. Dit is uitgeschakeld, tenzij u het inschakelt.',
  'settings.data.consent.marketingEmail': 'Productnieuws per e-mail',
} as const;
