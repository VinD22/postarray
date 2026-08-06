/**
 * Screen reader announcements and accessible names.
 *
 * These are read aloud, not shown. Keep them short, factual and in the order a
 * listener needs them. Live region announcements must not repeat decoration.
 */
export const a11yMessages = {
  'a11y.region.navigation': 'Primární navigace',
  'a11y.region.main': 'Hlavní obsah',
  'a11y.region.composer': 'Skladatel',
  'a11y.region.preview': 'Náhled',
  'a11y.region.validation': 'Problémy s ověřením',
  'a11y.region.targets': 'Cílové účty',
  'a11y.region.notifications': 'Oznámení',

  'a11y.announce.saved': 'Koncept uložen',
  'a11y.announce.saving': 'Ukládání konceptu',
  'a11y.announce.saveFailed': 'Koncept nelze uložit. Váš text je stále zde.',
  'a11y.announce.offline': 'Jste offline. Změny jsou uloženy na tomto zařízení.',
  'a11y.announce.online': 'Zpět online',
  'a11y.announce.validationCount':
    '{count, plural, =0 {Žádné problémy s ověřením} one {# problém s ověřením} other {# problémy s ověřením} few {# problémy s ověřením} many {# problémy s ověřením}}',
  'a11y.announce.validationCleared': 'Všechny problémy s ověřením vyřešeny',
  'a11y.announce.targetSelected':
    '{account} vybráno. {count, plural, one {# cíl} other {# cíle} few {# cíle} many {# cíle}} celkem.',
  'a11y.announce.targetOverridden': '{account} má nyní svou vlastní verzi',
  'a11y.announce.targetReset': '{account} resetovat na hlavní koncept',
  'a11y.announce.uploadProgress': '{name}, {percent} nahráno',
  'a11y.announce.uploadComplete': '{name} nahráno',
  'a11y.announce.uploadFailed': '{name} se nepodařilo nahrát',
  'a11y.announce.scheduled': 'Naplánováno na {time} v {timeZone}',
  'a11y.announce.rescheduled': 'Přesunuto do {time} v {timeZone}',
  'a11y.announce.publishing': 'Publikování',
  'a11y.announce.published':
    '{count, plural, one {Zveřejněno na # účet} other {Zveřejněno na # účty} few {Zveřejněno na # účty} many {Zveřejněno na # účty}}',
  'a11y.announce.publishPartial':
    'Zveřejněno na {published} z {total} účty. {failed, plural, one {# účet vyžaduje pozornost} other {# účty vyžadují pozornost} few {# účty vyžadují pozornost} many {# účty vyžadují pozornost}}.',
  'a11y.announce.publishFailed': 'Publikování se nezdařilo. Váš obsah je zachován.',
  'a11y.announce.approvalRequested': 'Požadováno schválení od {approver}',
  'a11y.announce.approved': 'Schváleno',
  'a11y.announce.connectionAdded': '{account} připojeno',
  'a11y.announce.connectionRemoved': '{account} odpojeno',
  'a11y.announce.filterApplied':
    '{count, plural, =0 {Filtry vymazány} one {# použit filtr} other {# použité filtry} few {# použité filtry} many {# použité filtry}}, {results, plural, one {# výsledek} other {# výsledky} few {# výsledky} many {# výsledky}}',
  'a11y.announce.pageChanged': '{title}',
  'a11y.announce.copiedToClipboard': 'Zkopírováno do schránky',
  'a11y.announce.suggestionApplied': 'Návrh byl použit',
  'a11y.announce.suggestionRejected': 'Návrh zamítnut',

  'a11y.label.closeDialog': 'Zavřít dialog',
  'a11y.label.openMenu': 'Otevřít nabídku',
  'a11y.label.sortBy': 'Seřadit podle {field}',
  'a11y.label.sortAscending': 'Seřazeno vzestupně',
  'a11y.label.sortDescending': 'Seřazeno sestupně',
  'a11y.label.removeTarget': 'Odebrat {account} z cílů',
  'a11y.label.removeMedia': 'Odebrat {name}',
  'a11y.label.editAltText': 'Upravit alternativní text pro {name}',
  'a11y.label.mediaPreview': 'Náhled {name}',
  'a11y.label.playVideo': 'Přehrát {name}',
  'a11y.label.pauseVideo': 'Pozastavit {name}',
  'a11y.label.calendarCell':
    '{date}, {count, plural, =0 {nic naplánovaného} one {# příspěvek} other {# příspěvky} few {# příspěvky} many {# příspěvky}}',
  'a11y.label.postSummary': '{account} na {provider}, {state}, {time}',
  'a11y.label.characterCount': '{used} z {limit} použité znaky',
  'a11y.label.requiredField': 'Povinné',
  'a11y.label.externalLink': 'Otevře se na nové kartě',
  'a11y.label.loadingRegion': 'Načítání obsahu',
  'a11y.label.expandRow': 'Zobrazit podrobnosti pro {name}',
  'a11y.label.collapseRow': 'Skrýt podrobnosti pro {name}',
  'a11y.languagePicker.label': 'Vyberte jazyk rozhraní',
  'a11y.languagePicker.filterLabel': 'Filtrovat jazyky',
  'a11y.languagePicker.announceChanged': 'Jazyk rozhraní změněn na {language}',

  'a11y.keyboard.hint.calendar':
    'Pro pohyb mezi sloty použijte klávesy se šipkami. Stisknutím klávesy Enter otevřete příspěvek. Stiskněte mezerník a poté klávesy se šipkami pro přeplánování.',
  'a11y.keyboard.hint.composer':
    'Stiskněte Control a klávesy se závorkami pro pohyb mezi cíli. Stiskněte Control a I pro přechod na další číslo.',
  'a11y.keyboard.hint.dialog': 'Zavřete stisknutím klávesy Escape.',
  'a11y.keyboard.shortcutsTitle': 'Klávesové zkratky',

  'a11y.table.alternative': 'Zobrazení tabulky',
  'a11y.table.alternativeHint': 'Stejný rozvrh jako tříditelná tabulka.',
  'a11y.motion.reduced': 'Animace jsou omezeny kvůli vašemu nastavení systému.',
} as const;
