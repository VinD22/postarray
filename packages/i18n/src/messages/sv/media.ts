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
 * restore or fix, because Post Array does not do any of those and copy that hinted
 * otherwise would be the first half of a promise the product cannot keep. The
 * word used throughout is "version": an edit adds one, and the original stays
 * exactly where it was.
 */
export const mediaMessages = {
  // ==================================================== the editor ====
  'mediaLib.derivative.heading': 'Redigera denna bild',
  'mediaLib.derivative.description':
    'Beskär, rotera, ändra storlek, byt format eller komprimera. Varje ändring arbetar med pixlarna som redan finns i din fil. Inget läggs till som inte fanns där.',
  'mediaLib.derivative.originalKept':
    'Originalet ersätts aldrig. Varje redigering sparas som en separat version du kan välja när du skapar ett inlägg.',
  'mediaLib.derivative.apply': 'Spara denna version',
  'mediaLib.derivative.applying': 'Sparar denna version',
  'mediaLib.derivative.discard': 'Förkasta ändringar',
  'mediaLib.derivative.noChanges': 'Inget att spara än. Ändra ett värde ovan.',

  'mediaLib.derivative.tab.crop': 'Beskär',
  'mediaLib.derivative.tab.transform': 'Rotera och ändra storlek',
  'mediaLib.derivative.tab.output': 'Format',

  'mediaLib.derivative.cropHint':
    'Skriv siffrorna, eller använd piltangenterna i valfritt fält. Inget steg här kräver en mus.',
  'mediaLib.derivative.cropX': 'Vänsterkant, i pixlar',
  'mediaLib.derivative.cropY': 'Överkant, i pixlar',
  'mediaLib.derivative.cropWidth': 'Beskärningsbredd, i pixlar',
  'mediaLib.derivative.cropHeight': 'Beskärningshöjd, i pixlar',
  'mediaLib.derivative.rotate': 'Rotera',
  'mediaLib.derivative.rotateNone': 'Ingen rotation',
  'mediaLib.derivative.rotateDegrees': '{degrees} grader medurs',
  'mediaLib.derivative.resizeWidth': 'Ny bredd, i pixlar',
  'mediaLib.derivative.resizeHeight': 'Ny höjd, i pixlar',
  'mediaLib.derivative.lockRatio': 'Behåll formen när jag ändrar en sida',
  'mediaLib.derivative.format': 'Spara som',
  'mediaLib.derivative.formatSame': 'Behåll nuvarande format',
  'mediaLib.derivative.quality': 'Kvalitet',
  'mediaLib.derivative.qualityHint':
    'Lägre kvalitet ger en mindre fil. Gäller JPEG och WebP. PNG är förlustfritt och ignorerar det.',
  'mediaLib.derivative.projected': 'Denna version blir {width} gånger {height} pixlar.',
  'mediaLib.derivative.projectedUnavailable':
    'Storleken på denna version är inte tillgänglig förrän den skapas.',

  // ==================================================== the versions list ====
  'mediaLib.derivative.listHeading': 'Versioner',
  'mediaLib.derivative.original': 'Original',
  'mediaLib.derivative.originalHint': 'Bevaras alltid. Skrivs aldrig över.',
  'mediaLib.derivative.item': '{width} gånger {height}, {mimeType}, {size}',
  'mediaLib.derivative.empty': 'Inga redigerade versioner än. Originalet är den enda filen här.',
  'mediaLib.derivative.select': 'Använd denna version',
  'mediaLib.derivative.selected': 'Används för detta inlägg',
  'mediaLib.derivative.useOriginal': 'Använd originalet',
  'mediaLib.derivative.processing': 'Denna version skapas. Den visas här när den är klar.',
  'mediaLib.derivative.alreadyExists':
    'Du har gjort exakt denna redigering tidigare, så vi återanvände den versionen i stället för att göra en till.',
  'mediaLib.derivative.failedTitle': 'Denna version kunde inte skapas',
  'mediaLib.derivative.failedBody':
    'Inget sparades och ditt original är orört. Ändra värdena och försök igen.',
  'mediaLib.derivative.openEditor': 'Redigera {name}',

  'mediaLib.derivative.unsupportedTitle': 'Redigering fungerar bara på bilder',
  'mediaLib.derivative.unsupportedBody':
    'Video, ljud och dokument kan inte redigeras här. Förbered filen innan du laddar upp den. Din ursprungliga uppladdning ändras aldrig, oavsett.',

  'mediaLib.derivative.nonGenerative':
    'Post Array genererar inte bilder eller video. Denna redigerare beskär, roterar, ändrar storlek på, konverterar och komprimerar bara det du laddade upp.',

  // ==================================================== refusals ====
  'error.media_derivative_no_operations.message':
    'Välj minst en ändring innan du sparar en version.',
  'error.media_derivative_duplicate_operation.message':
    'Varje typ av ändring kan förekomma en gång. Ta bort den andra {operation}.',
  'error.media_derivative_crop_out_of_bounds.message':
    'Den beskärningen når förbi bildens kant, som är {sourceWidth} gånger {sourceHeight} pixlar. Flytta den eller gör den mindre.',
  'error.media_derivative_upscale_rejected.message':
    'Denna redigerare förstorar aldrig en bild, eftersom de extra pixlarna skulle vara påhittade och inte dina. Den största möjliga storleken för denna version är {availableWidth} gånger {availableHeight}.',
  'error.media_derivative_source_unsupported.message':
    'Redigering fungerar på JPEG-, PNG-, WebP- och GIF-bilder. Denna fil är {mimeType}.',
  'error.media_derivative_dimensions_unknown.message':
    'Vi känner inte till storleken på denna bild än, så vi kan inte kontrollera ändringen mot den. Försök igen när bearbetningen är klar.',
  'error.media_derivative_format_required.message':
    'Välj ett format att spara som. En {sourceMimeType}-fil kan inte sparas tillbaka som sig själv här.',
  'error.media_derivative_quality_unsupported.message':
    'PNG är förlustfritt, så en kvalitetsinställning skulle inte göra något. Ta bort den, eller spara som JPEG eller WebP.',
  'error.media_derivative_no_change.message': 'Det är redan formatet som denna fil använder.',
  'error.media_derivative_source_unavailable.message':
    'Filen som denna version skulle komma från finns inte längre i lagringen.',
  'error.media_derivative_preset_mismatch.message':
    'Denna redigeringsbegäran matchar inte ändringarna den beskriver. Inget skapades. Försök igen från redigeraren.',
  'error.media_derivative_empty_result.message':
    'Redigeringen gav ingen bild, så inget sparades. Ditt original är orört.',
  'error.media_derivative_transform_failed.message':
    'Denna bild kunde inte läsas eller skrivas. Inget sparades och ditt original är orört.',
  'error.media_derivative_write_failed.message':
    'Denna version kunde inte registreras. Inget sparades och ditt original är orört.',
} as const;
