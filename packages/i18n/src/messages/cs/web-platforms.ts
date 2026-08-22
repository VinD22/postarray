/**
 * The per platform scheduler pages.
 *
 * Rules that bind this file specifically:
 *
 *  - Not one string here names a platform, states a character ceiling, a file
 *    size or a capability. Every one of those comes from the generated
 *    datasets the page reads, so a page physically cannot claim support the
 *    connectors do not have. The strings below are labels and framing only.
 *  - The framing is always "what the platform requires" and "what this product
 *    intends to support". Never "what you can publish". No connector has
 *    passed its definition of done, so nothing publishes.
 *  - Anything a platform does not document is `common.unavailable`, never a
 *    zero and never a guess.
 *
 * Note: this locale file translates only the `web.schedule.*` and
 * `web.meta.schedule*` keys. The `web.specs.*` and `web.meta.specs*` keys in
 * the English source stay on the reviewed English fallback for beta locales
 * and are intentionally not duplicated here.
 */
export const webPlatformsMessages = {
  /* ---------------------------------------------------------------------- */
  /* Metadata                                                               */
  /* ---------------------------------------------------------------------- */

  'web.meta.schedule.title': 'Plánování, platforma po platformě',
  'web.meta.schedule.description':
    'Co každá platforma ve startovní skupině vyžaduje od propojeného účtu, jaké limity vynucuje její oficiální API a jak daleko tento produkt vůči nim dospěl.',
  'web.meta.schedulePlatform.title': 'Plánování pro {platform}',
  'web.meta.schedulePlatform.description':
    'Co {platform} vyžaduje od propojeného účtu, jaké limity vynucuje její oficiální API a které části z toho tento produkt postavil.',

  /* ---------------------------------------------------------------------- */
  /* Index                                                                  */
  /* ---------------------------------------------------------------------- */

  'web.schedule.index.title': 'Plánování, platforma po platformě',
  'web.schedule.index.lede':
    'Jedna stránka na platformu ve startovní skupině. Každá uvádí, co platforma vyžaduje od propojeného účtu, jaké limity vynucuje její oficiální API a kde stojí vývoj. Každé číslo nese dokument, ze kterého pochází, a datum, kdy jej někdo přečetl.',
  'web.schedule.index.listLabel': 'Platformy ve startovní skupině',
  'web.schedule.index.cohortNote':
    'Startovní skupina je množina platforem, pro které je tento produkt budován. Je to plán, ne seznam dostupnosti.',
  'web.schedule.index.limitsKnown': 'Limity zaznamenané',
  'web.schedule.index.limitsUnknown': 'Limity zatím nezaznamenané',

  /* ---------------------------------------------------------------------- */
  /* Platform page                                                          */
  /* ---------------------------------------------------------------------- */

  'web.schedule.platform.title': 'Plánování pro {platform}',
  'web.schedule.platform.lede':
    'Co {platform} vyžaduje od propojeného účtu, jaké limity vynucuje její oficiální API a proti kterým z nich byl tento produkt dosud postaven.',

  'web.schedule.notice.title': 'Na {platform} se zatím nic nepublikuje',
  'web.schedule.notice.body':
    'Žádný konektor neprošel svou definicí hotovo a žádný není ověřen v produkci. Tato stránka popisuje, co platforma vyžaduje a co tento produkt hodlá podporovat. Nepopisuje fungující plánovač.',

  'web.schedule.requirements.title': 'Co vyžaduje {platform}',
  'web.schedule.requirements.accountTypes': 'Typ účtu',
  'web.schedule.requirements.restriction': 'Omezení platformy',
  'web.schedule.requirements.cost': 'Náklady na API',
  'web.schedule.requirements.unavailable.title': 'Zatím žádný ověřený záznam konektoru',
  'web.schedule.requirements.unavailable.body':
    'Tato platforma se připojila ke skupině po posledním průzkumu konektorů, takže neexistuje datovaný záznam jejích požadavků na účet k zobrazení. Objeví se zde, jakmile někdo přečte oficiální dokumentaci a zaznamená ji.',
  'web.schedule.requirements.apiSource': 'Oficiální dokumentace API',
  'web.schedule.requirements.policySource': 'Zásady platformy',

  /* ---------------------------------------------------------------------- */
  /* Limits                                                                 */
  /* ---------------------------------------------------------------------- */

  'web.schedule.limits.title': 'Limity, které vynucuje {platform}',
  'web.schedule.limits.lede':
    'Čteno pro nově propojený účet bez zvýšené způsobilosti. Platforma může kterýkoli z nich zvýšit nebo snížit, aniž by to komukoli oznámila, a proto každá sada nese datum, kdy byla přečtena.',
  'web.schedule.limits.unavailable.title': 'Limity nezaznamenané pro {platform}',
  'web.schedule.limits.unavailable.body':
    'Tento build neobsahuje adaptér pro tuto platformu, takže neexistuje žádný zaznamenaný limit k zobrazení. Vymyšlené číslo by bylo horší než žádné.',
  'web.schedule.limits.sourceLabel': 'Oficiální dokumentace platformy',

  'web.schedule.limits.text': 'Text příspěvku',
  'web.schedule.limits.title_field': 'Pole titulku',
  'web.schedule.limits.countingUnit': 'Jak se počítají znaky',
  'web.schedule.limits.links': 'Jak se počítají odkazy',
  'web.schedule.limits.images': 'Obrázky na příspěvek',
  'web.schedule.limits.videos': 'Videa na příspěvek',
  'web.schedule.limits.videoDuration': 'Délka videa',
  'web.schedule.limits.imageBytes': 'Největší obrázek',
  'web.schedule.limits.gifBytes': 'Největší animovaný obrázek',
  'web.schedule.limits.videoBytes': 'Největší video',
  'web.schedule.limits.documentBytes': 'Největší dokument',
  'web.schedule.limits.altText': 'Alternativní text',
  'web.schedule.limits.mimeTypes': 'Přijímané typy souborů',
  'web.schedule.limits.markdown': 'Formátovací značky',

  'web.schedule.value.characters':
    '{count, plural, one {# znak} few {# znaky} many {# znaku} other {# znaků}}',
  'web.schedule.value.files':
    '{count, plural, =0 {Žádný} one {# soubor} few {# soubory} many {# souboru} other {# souborů}}',
  'web.schedule.value.durationRange': 'Mezi {min} a {max}',
  'web.schedule.value.durationMax': 'Až {max}',
  'web.schedule.value.markdownYes': 'Přijímáno',
  'web.schedule.value.markdownNo': 'Publikováno jako prostý text',

  'web.schedule.unit.utf16':
    'Podle jednotky kódu UTF-16, což většina editorů uvádí jako počet znaků.',
  'web.schedule.unit.grapheme':
    'Podle grafému, takže emoji složené z několika kódových bodů stále stojí jeden znak.',
  'web.schedule.unit.weighted':
    'Podle váženého schématu, kde většina nelatinských znaků stojí dva místo jednoho.',

  'web.schedule.link.none': 'Odkazy se nezapočítávají do limitu.',
  'web.schedule.link.actual': 'Odkaz stojí přesně tolik znaků, kolik zabírá.',
  'web.schedule.link.fixed':
    'Každý odkaz je přepsán na zkracovač platformy a stojí {count, plural, one {# znak} few {# znaky} many {# znaku} other {# znaků}} bez ohledu na jeho skutečnou délku.',

  /* ---------------------------------------------------------------------- */
  /* Capability state                                                       */
  /* ---------------------------------------------------------------------- */

  'web.schedule.capabilities.title': 'Co je postaveno pro {platform}',
  'web.schedule.capabilities.lede':
    'Generováno z registru konektorů, nepsáno zde. „Platformou nenabízeno“ je fakt o platformě a je konečný. „Zatím nepostaveno“ je fakt o tomto produktu a je to čestný výchozí stav, dokud žádný konektor neprošel svou definicí hotovo.',
  'web.schedule.capabilities.unavailable.title': 'Zatím žádný záznam o schopnostech pro {platform}',
  'web.schedule.capabilities.unavailable.body':
    'V tomto buildu není adaptér, takže registr nemá co hlásit. Řádek se objeví v matici schopností, jakmile bude co reálného říct.',
  'web.schedule.capabilities.matrixLink': 'Přečíst celou matici schopností',

  'web.schedule.next.title': 'Kam dál',
  'web.schedule.next.body':
    'Matice schopností nese každou platformu a každou schopnost v jedné tabulce. Stránky případů užití popisují pracovní postupy, kolem kterých je tento produkt budován.',
} as const;
