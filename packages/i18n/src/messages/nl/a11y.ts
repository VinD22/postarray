/**
 * Screen reader announcements and accessible names.
 *
 * These are read aloud, not shown. Keep them short, factual and in the order a
 * listener needs them. Live region announcements must not repeat decoration.
 */
export const a11yMessages = {
  'a11y.region.navigation': 'Primaire navigatie',
  'a11y.region.main': 'Hoofdinhoud',
  'a11y.region.composer': 'Composer',
  'a11y.region.preview': 'Voorbeeld',
  'a11y.region.validation': 'Validatieproblemen',
  'a11y.region.targets': 'Doelaccounts',
  'a11y.region.notifications': 'Meldingen',

  'a11y.announce.saved': 'Concept opgeslagen',
  'a11y.announce.saving': 'Concept opslaan',
  'a11y.announce.saveFailed': 'Concept kan niet worden opgeslagen. Je tekst staat er nog.',
  'a11y.announce.offline': 'Je bent offline. Wijzigingen worden op dit apparaat bewaard.',
  'a11y.announce.online': 'Terug online',
  'a11y.announce.validationCount':
    '{count, plural, =0 {Geen validatieproblemen} one {# validatieprobleem} other {# validatieproblemen}}',
  'a11y.announce.validationCleared': 'Alle validatieproblemen opgelost',
  'a11y.announce.targetSelected':
    '{account} geselecteerd. {count, plural, one {# doel} other {# doelen}} in totaal.',
  'a11y.announce.targetOverridden': '{account} heeft nu een eigen versie',
  'a11y.announce.targetReset': '{account} wordt teruggezet naar het hoofdconcept',
  'a11y.announce.uploadProgress': '{name}, {percent} geüpload',
  'a11y.announce.uploadComplete': '{name} geüpload',
  'a11y.announce.uploadFailed': '{name} kan niet worden geüpload',
  'a11y.announce.scheduled': 'Gepland voor {time} in {timeZone}',
  'a11y.announce.rescheduled': 'Verplaatst naar {time} in {timeZone}',
  'a11y.announce.publishing': 'Publiceren',
  'a11y.announce.published':
    '{count, plural, one {Gepubliceerd naar # account} other {Gepubliceerd naar # accounts}}',
  'a11y.announce.publishPartial':
    'Gepubliceerd naar {published} van {total}-accounts. {failed, plural, one {# account heeft aandacht nodig} other {# accounts hebben aandacht nodig}}.',
  'a11y.announce.publishFailed': 'Publiceren is mislukt. Uw inhoud blijft behouden.',
  'a11y.announce.approvalRequested': 'Goedkeuring aangevraagd bij {approver}',
  'a11y.announce.approved': 'Goedgekeurd',
  'a11y.announce.connectionAdded': '{account} verbonden',
  'a11y.announce.connectionRemoved': '{account} verbinding verbroken',
  'a11y.announce.filterApplied':
    '{count, plural, =0 {Filters gewist} one {# filter toegepast} other {# filters toegepast}}, {results, plural, one {# resultaat} other {# resultaten}}',
  'a11y.announce.pageChanged': '{title}',
  'a11y.announce.copiedToClipboard': 'Gekopieerd naar het klembord',
  'a11y.announce.suggestionApplied': 'Suggestie toegepast',
  'a11y.announce.suggestionRejected': 'Suggestie afgewezen',

  'a11y.label.closeDialog': 'Dialoogvenster sluiten',
  'a11y.label.openMenu': 'Menu openen',
  'a11y.label.sortBy': 'Sorteren op {field}',
  'a11y.label.sortAscending': 'Oplopend gesorteerd',
  'a11y.label.sortDescending': 'Gesorteerd aflopend',
  'a11y.label.removeTarget': 'Verwijder {account} van de doelen',
  'a11y.label.removeMedia': '{name} verwijderen',
  'a11y.label.editAltText': 'Bewerk de alternatieve tekst voor {name}',
  'a11y.label.mediaPreview': 'Voorbeeld van {name}',
  'a11y.label.playVideo': 'Speel {name}',
  'a11y.label.pauseVideo': 'Pauzeer {name}',
  'a11y.label.calendarCell':
    '{date}, {count, plural, =0 {niets gepland} one {# bericht} other {# berichten}}',
  'a11y.label.postSummary': '{account} op {provider}, {state}, {time}',
  'a11y.label.characterCount': '{used} van {limit}-tekens gebruikt',
  'a11y.label.requiredField': 'Vereist',
  'a11y.label.externalLink': 'Opent in een nieuw tabblad',
  'a11y.label.loadingRegion': 'Inhoud laden',
  'a11y.label.expandRow': 'Details weergeven voor {name}',
  'a11y.label.collapseRow': 'Details voor {name} verbergen',
  'a11y.languagePicker.label': 'Kies interfacetaal',
  'a11y.languagePicker.filterLabel': 'Talen filteren',
  'a11y.languagePicker.announceChanged': 'Interfacetaal gewijzigd in {language}',

  'a11y.keyboard.hint.calendar':
    'Gebruik de pijltjestoetsen om tussen slots te bewegen. Druk op Enter om een ​​bericht te openen. Druk op de spatiebalk en vervolgens op de pijltjestoetsen om een ​​nieuwe planning te maken.',
  'a11y.keyboard.hint.composer':
    'Druk op Control en de haakjestoetsen om tussen doelen te bewegen. Druk op Control en I om naar het volgende nummer te gaan.',
  'a11y.keyboard.hint.dialog': 'Druk op Escape om te sluiten.',
  'a11y.keyboard.shortcutsTitle': 'Sneltoetsen',

  'a11y.table.alternative': 'Tabelweergave',
  'a11y.table.alternativeHint': 'Hetzelfde schema als een sorteerbare tafel.',
  'a11y.motion.reduced': 'Animaties worden verminderd vanwege uw systeeminstelling.',
} as const;
