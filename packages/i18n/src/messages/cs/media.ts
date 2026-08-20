/**
 * Media derivatives: the non-generative editor and the refusals it can hit.
 *
 * Two groups. `mediaLib.derivative.*` is what a person reads while cropping,
 * rotating, resizing, converting or compressing a file they already uploaded.
 * `error.media_derivative_*.message` is what the application boundary says when it
 * refuses a plan, and every one of those sentences names the reason and the
 * next step rather than reporting that something failed.
 *
 * The vocabulary is deliberate. Nothing here says generate, enhance, upscale,
 * restore or fix, because Relay does not do any of those and copy that hinted
 * otherwise would be the first half of a promise the product cannot keep. The
 * word used throughout is "version": an edit adds one, and the original stays
 * exactly where it was.
 */
export const mediaMessages = {
  // ==================================================== the editor ====
  'mediaLib.derivative.heading': 'Upravit tento obrázek',
  'mediaLib.derivative.description':
    'Oříznout, otočit, změnit velikost, formát nebo komprimovat. Každá změna pracuje s pixely, které už jsou ve vašem souboru. Nic, co tam nebylo, se nepřidává.',
  'mediaLib.derivative.originalKept':
    'Originál se nikdy nenahrazuje. Každá úprava se ukládá jako samostatná verze, kterou si můžete vybrat při vytváření příspěvku.',
  'mediaLib.derivative.apply': 'Uložit tuto verzi',
  'mediaLib.derivative.applying': 'Ukládání této verze',
  'mediaLib.derivative.discard': 'Zahodit změny',
  'mediaLib.derivative.noChanges': 'Zatím není co uložit. Změňte hodnotu výše.',

  'mediaLib.derivative.tab.crop': 'Ořez',
  'mediaLib.derivative.tab.transform': 'Otočení a změna velikosti',
  'mediaLib.derivative.tab.output': 'Formát',

  'mediaLib.derivative.cropHint':
    'Zadejte čísla nebo použijte v libovolném poli šipky. Žádný krok zde nevyžaduje myš.',
  'mediaLib.derivative.cropX': 'Levý okraj, v pixelech',
  'mediaLib.derivative.cropY': 'Horní okraj, v pixelech',
  'mediaLib.derivative.cropWidth': 'Šířka ořezu, v pixelech',
  'mediaLib.derivative.cropHeight': 'Výška ořezu, v pixelech',
  'mediaLib.derivative.rotate': 'Otočit',
  'mediaLib.derivative.rotateNone': 'Bez otočení',
  'mediaLib.derivative.rotateDegrees': '{degrees} stupňů po směru hodinových ručiček',
  'mediaLib.derivative.resizeWidth': 'Nová šířka, v pixelech',
  'mediaLib.derivative.resizeHeight': 'Nová výška, v pixelech',
  'mediaLib.derivative.lockRatio': 'Zachovat tvar při změně jedné strany',
  'mediaLib.derivative.format': 'Uložit jako',
  'mediaLib.derivative.formatSame': 'Zachovat aktuální formát',
  'mediaLib.derivative.quality': 'Kvalita',
  'mediaLib.derivative.qualityHint':
    'Nižší kvalita znamená menší soubor. Platí pro JPEG a WebP. PNG je bezztrátový a toto nastavení ignoruje.',
  'mediaLib.derivative.projected': 'Tato verze bude mít {width} krát {height} pixelů.',
  'mediaLib.derivative.projectedUnavailable': 'Velikost této verze je nedostupná, dokud nebude vytvořena.',

  // ==================================================== the versions list ====
  'mediaLib.derivative.listHeading': 'Verze',
  'mediaLib.derivative.original': 'Originál',
  'mediaLib.derivative.originalHint': 'Vždy zachován. Nikdy nepřepsán.',
  'mediaLib.derivative.item': '{width} krát {height}, {mimeType}, {size}',
  'mediaLib.derivative.empty': 'Zatím žádné upravené verze. Originál je zde jediným souborem.',
  'mediaLib.derivative.select': 'Použít tuto verzi',
  'mediaLib.derivative.selected': 'Používá se pro tento příspěvek',
  'mediaLib.derivative.useOriginal': 'Použít originál',
  'mediaLib.derivative.processing': 'Tato verze se vytváří. Objeví se zde, jakmile bude hotová.',
  'mediaLib.derivative.alreadyExists':
    'Tuto přesnou úpravu jste již dříve provedli, takže jsme tuto verzi znovu použili místo vytvoření druhé.',
  'mediaLib.derivative.failedTitle': 'Tuto verzi se nepodařilo vytvořit',
  'mediaLib.derivative.failedBody':
    'Nic nebylo uloženo a váš originál zůstal nedotčen. Změňte hodnoty a zkuste to znovu.',
  'mediaLib.derivative.openEditor': 'Upravit {name}',

  'mediaLib.derivative.unsupportedTitle': 'Úpravy fungují pouze u obrázků',
  'mediaLib.derivative.unsupportedBody':
    'Video, zvuk a dokumenty zde nelze upravovat. Připravte soubor před nahráním. Váš původní nahraný soubor se v žádném případě nikdy nemění.',

  'mediaLib.derivative.nonGenerative':
    'Relay negeneruje obrázky ani video. Tento editor pouze ořezává, otáčí, mění velikost, převádí a komprimuje to, co jste nahráli.',

  // ==================================================== refusals ====
  'error.media_derivative_no_operations.message': 'Před uložením verze vyberte alespoň jednu změnu.',
  'error.media_derivative_duplicate_operation.message':
    'Každý druh změny se může objevit jen jednou. Odeberte druhý {operation}.',
  'error.media_derivative_crop_out_of_bounds.message':
    'Tento ořez přesahuje okraj obrázku, který má {sourceWidth} krát {sourceHeight} pixelů. Přesuňte jej nebo jej zmenšete.',
  'error.media_derivative_upscale_rejected.message':
    'Tento editor nikdy nezvětšuje obrázek, protože přidané pixely by byly vymyšlené, ne vaše. Největší možná velikost této verze je {availableWidth} krát {availableHeight}.',
  'error.media_derivative_source_unsupported.message':
    'Úpravy fungují u obrázků JPEG, PNG, WebP a GIF. Tento soubor je {mimeType}.',
  'error.media_derivative_dimensions_unknown.message':
    'Velikost tohoto obrázku zatím neznáme, takže proti ní nemůžeme změnu zkontrolovat. Zkuste to znovu, jakmile zpracování skončí.',
  'error.media_derivative_format_required.message':
    'Vyberte formát, ve kterém chcete uložit. Soubor {sourceMimeType} zde nelze uložit zpět jako stejný.',
  'error.media_derivative_quality_unsupported.message':
    'PNG je bezztrátový, takže nastavení kvality by nic nedělalo. Odeberte je, nebo uložte jako JPEG či WebP.',
  'error.media_derivative_no_change.message': 'To je formát, který tento soubor už používá.',
  'error.media_derivative_source_unavailable.message':
    'Soubor, ze kterého by tato verze měla vzniknout, už není v úložišti.',
  'error.media_derivative_preset_mismatch.message':
    'Tento požadavek na úpravu neodpovídá změnám, které popisuje. Nic nebylo vytvořeno. Zkuste to znovu z editoru.',
  'error.media_derivative_empty_result.message':
    'Úprava nevytvořila žádný obrázek, takže nic nebylo uloženo. Váš originál zůstal nedotčen.',
  'error.media_derivative_transform_failed.message':
    'Tento obrázek se nepodařilo přečíst ani zapsat. Nic nebylo uloženo a váš originál zůstal nedotčen.',
  'error.media_derivative_write_failed.message':
    'Tuto verzi se nepodařilo zaznamenat. Nic nebylo uloženo a váš originál zůstal nedotčen.',
} as const;
