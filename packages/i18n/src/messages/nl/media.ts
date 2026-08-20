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
  'mediaLib.derivative.heading': 'Deze afbeelding bewerken',
  'mediaLib.derivative.description':
    'Bijsnijden, roteren, formaat wijzigen, indeling wijzigen of comprimeren. Elke wijziging werkt op de pixels die al in je bestand zitten. Er wordt niets toegevoegd dat er niet al was.',
  'mediaLib.derivative.originalKept':
    'Het origineel wordt nooit vervangen. Elke bewerking wordt opgeslagen als een aparte versie die je kunt kiezen bij het opstellen.',
  'mediaLib.derivative.apply': 'Deze versie opslaan',
  'mediaLib.derivative.applying': 'Deze versie wordt opgeslagen',
  'mediaLib.derivative.discard': 'Wijzigingen verwerpen',
  'mediaLib.derivative.noChanges': 'Nog niets om op te slaan. Wijzig hierboven een waarde.',

  'mediaLib.derivative.tab.crop': 'Bijsnijden',
  'mediaLib.derivative.tab.transform': 'Roteren en formaat wijzigen',
  'mediaLib.derivative.tab.output': 'Indeling',

  'mediaLib.derivative.cropHint':
    'Typ de getallen, of gebruik de pijltjestoetsen in elk veld. Geen enkele stap hier vereist een muis.',
  'mediaLib.derivative.cropX': 'Linkerrand, in pixels',
  'mediaLib.derivative.cropY': 'Bovenrand, in pixels',
  'mediaLib.derivative.cropWidth': 'Bijsnijbreedte, in pixels',
  'mediaLib.derivative.cropHeight': 'Bijsnijhoogte, in pixels',
  'mediaLib.derivative.rotate': 'Roteren',
  'mediaLib.derivative.rotateNone': 'Geen rotatie',
  'mediaLib.derivative.rotateDegrees': '{degrees} graden met de klok mee',
  'mediaLib.derivative.resizeWidth': 'Nieuwe breedte, in pixels',
  'mediaLib.derivative.resizeHeight': 'Nieuwe hoogte, in pixels',
  'mediaLib.derivative.lockRatio': 'Vorm behouden als ik één zijde wijzig',
  'mediaLib.derivative.format': 'Opslaan als',
  'mediaLib.derivative.formatSame': 'Huidige indeling behouden',
  'mediaLib.derivative.quality': 'Kwaliteit',
  'mediaLib.derivative.qualityHint':
    'Lagere kwaliteit levert een kleiner bestand op. Dit geldt voor JPEG en WebP. PNG is verliesvrij en negeert dit.',
  'mediaLib.derivative.projected': 'Deze versie wordt {width} bij {height} pixels.',
  'mediaLib.derivative.projectedUnavailable':
    'De afmeting van deze versie is niet beschikbaar totdat hij is gemaakt.',

  // ==================================================== the versions list ====
  'mediaLib.derivative.listHeading': 'Versies',
  'mediaLib.derivative.original': 'Origineel',
  'mediaLib.derivative.originalHint': 'Altijd bewaard. Nooit overschreven.',
  'mediaLib.derivative.item': '{width} bij {height}, {mimeType}, {size}',
  'mediaLib.derivative.empty': 'Nog geen bewerkte versies. Het origineel is hier het enige bestand.',
  'mediaLib.derivative.select': 'Gebruik deze versie',
  'mediaLib.derivative.selected': 'In gebruik voor dit bericht',
  'mediaLib.derivative.useOriginal': 'Gebruik het origineel',
  'mediaLib.derivative.processing': 'Deze versie wordt gemaakt. Hij verschijnt hier zodra hij klaar is.',
  'mediaLib.derivative.alreadyExists':
    'Je hebt deze exacte bewerking al eerder gemaakt, dus we hebben die versie hergebruikt in plaats van een tweede te maken.',
  'mediaLib.derivative.failedTitle': 'Deze versie kon niet worden gemaakt',
  'mediaLib.derivative.failedBody':
    'Er is niets opgeslagen en je origineel is onaangeroerd. Wijzig de waarden en probeer het opnieuw.',
  'mediaLib.derivative.openEditor': '{name} bewerken',

  'mediaLib.derivative.unsupportedTitle': 'Bewerken werkt alleen bij afbeeldingen',
  'mediaLib.derivative.unsupportedBody':
    'Video, audio en documenten kunnen hier niet worden bewerkt. Bereid het bestand voor voordat je het uploadt. Je originele upload wordt hoe dan ook nooit gewijzigd.',

  'mediaLib.derivative.nonGenerative':
    'Relay genereert geen afbeeldingen of video. Deze editor snijdt alleen bij, roteert, wijzigt het formaat, converteert en comprimeert wat je hebt geüpload.',

  // ==================================================== refusals ====
  'error.media_derivative_no_operations.message': 'Kies minstens één wijziging voordat je een versie opslaat.',
  'error.media_derivative_duplicate_operation.message':
    'Elk soort wijziging kan één keer voorkomen. Verwijder de tweede {operation}.',
  'error.media_derivative_crop_out_of_bounds.message':
    'Dat bijsnijkader reikt voorbij de rand van de afbeelding, die {sourceWidth} bij {sourceHeight} pixels is. Verplaats het of maak het kleiner.',
  'error.media_derivative_upscale_rejected.message':
    'Deze editor vergroot een afbeelding nooit, omdat de extra pixels verzonnen zouden zijn en niet van jou. Het grootste formaat voor deze versie is {availableWidth} bij {availableHeight}.',
  'error.media_derivative_source_unsupported.message':
    'Bewerken werkt bij JPEG-, PNG-, WebP- en GIF-afbeeldingen. Dit bestand is {mimeType}.',
  'error.media_derivative_dimensions_unknown.message':
    'We kennen de afmeting van deze afbeelding nog niet, dus we kunnen de wijziging er niet tegen controleren. Probeer het opnieuw zodra de verwerking is voltooid.',
  'error.media_derivative_format_required.message':
    'Kies een indeling om in op te slaan. Een {sourceMimeType}-bestand kan hier niet als zichzelf worden opgeslagen.',
  'error.media_derivative_quality_unsupported.message':
    'PNG is verliesvrij, dus een kwaliteitsinstelling zou niets doen. Verwijder hem, of sla op als JPEG of WebP.',
  'error.media_derivative_no_change.message': 'Dat is al de indeling die dit bestand gebruikt.',
  'error.media_derivative_source_unavailable.message':
    'Het bestand waar deze versie vandaan zou komen, staat niet meer in de opslag.',
  'error.media_derivative_preset_mismatch.message':
    'Dit bewerkingsverzoek komt niet overeen met de wijzigingen die het beschrijft. Er is niets gemaakt. Probeer het opnieuw vanuit de editor.',
  'error.media_derivative_empty_result.message':
    'De bewerking leverde geen afbeelding op, dus er is niets opgeslagen. Je origineel is onaangeroerd.',
  'error.media_derivative_transform_failed.message':
    'Deze afbeelding kon niet worden gelezen of geschreven. Er is niets opgeslagen en je origineel is onaangeroerd.',
  'error.media_derivative_write_failed.message':
    'Deze versie kon niet worden vastgelegd. Er is niets opgeslagen en je origineel is onaangeroerd.',
} as const;
