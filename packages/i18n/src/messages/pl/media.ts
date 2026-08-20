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
  'mediaLib.derivative.heading': 'Edytuj ten obraz',
  'mediaLib.derivative.description':
    'Przytnij, obróć, zmień rozmiar, format lub skompresuj. Każda zmiana działa na pikselach już obecnych w Twoim pliku. Nie jest dodawane nic, czego wcześniej nie było.',
  'mediaLib.derivative.originalKept':
    'Oryginał nigdy nie jest zastępowany. Każda edycja zapisywana jest jako osobna wersja, którą możesz wybrać podczas tworzenia posta.',
  'mediaLib.derivative.apply': 'Zapisz tę wersję',
  'mediaLib.derivative.applying': 'Zapisywanie tej wersji',
  'mediaLib.derivative.discard': 'Odrzuć zmiany',
  'mediaLib.derivative.noChanges': 'Nie ma jeszcze nic do zapisania. Zmień wartość powyżej.',

  'mediaLib.derivative.tab.crop': 'Przycinanie',
  'mediaLib.derivative.tab.transform': 'Obrót i zmiana rozmiaru',
  'mediaLib.derivative.tab.output': 'Format',

  'mediaLib.derivative.cropHint':
    'Wpisz liczby lub użyj klawiszy strzałek w dowolnym polu. Żaden krok tutaj nie wymaga myszy.',
  'mediaLib.derivative.cropX': 'Lewa krawędź, w pikselach',
  'mediaLib.derivative.cropY': 'Górna krawędź, w pikselach',
  'mediaLib.derivative.cropWidth': 'Szerokość przycięcia, w pikselach',
  'mediaLib.derivative.cropHeight': 'Wysokość przycięcia, w pikselach',
  'mediaLib.derivative.rotate': 'Obróć',
  'mediaLib.derivative.rotateNone': 'Bez obrotu',
  'mediaLib.derivative.rotateDegrees': '{degrees} stopni zgodnie z ruchem wskazówek zegara',
  'mediaLib.derivative.resizeWidth': 'Nowa szerokość, w pikselach',
  'mediaLib.derivative.resizeHeight': 'Nowa wysokość, w pikselach',
  'mediaLib.derivative.lockRatio': 'Zachowaj proporcje przy zmianie jednego boku',
  'mediaLib.derivative.format': 'Zapisz jako',
  'mediaLib.derivative.formatSame': 'Zachowaj bieżący format',
  'mediaLib.derivative.quality': 'Jakość',
  'mediaLib.derivative.qualityHint':
    'Niższa jakość daje mniejszy plik. Dotyczy JPEG i WebP. PNG jest bezstratny i ją ignoruje.',
  'mediaLib.derivative.projected': 'Ta wersja będzie mieć {width} na {height} pikseli.',
  'mediaLib.derivative.projectedUnavailable':
    'Rozmiar tej wersji jest niedostępny, dopóki nie zostanie utworzona.',

  // ==================================================== the versions list ====
  'mediaLib.derivative.listHeading': 'Wersje',
  'mediaLib.derivative.original': 'Oryginał',
  'mediaLib.derivative.originalHint': 'Zawsze zachowywany. Nigdy nie nadpisywany.',
  'mediaLib.derivative.item': '{width} na {height}, {mimeType}, {size}',
  'mediaLib.derivative.empty': 'Brak jeszcze edytowanych wersji. Oryginał jest tu jedynym plikiem.',
  'mediaLib.derivative.select': 'Użyj tej wersji',
  'mediaLib.derivative.selected': 'Używana w tym poście',
  'mediaLib.derivative.useOriginal': 'Użyj oryginału',
  'mediaLib.derivative.processing': 'Ta wersja jest tworzona. Pojawi się tutaj, gdy będzie gotowa.',
  'mediaLib.derivative.alreadyExists':
    'Wykonałeś już dokładnie taką samą edycję wcześniej, więc ponownie użyliśmy tamtej wersji zamiast tworzyć drugą.',
  'mediaLib.derivative.failedTitle': 'Nie udało się utworzyć tej wersji',
  'mediaLib.derivative.failedBody':
    'Nic nie zostało zapisane, a Twój oryginał jest nienaruszony. Zmień wartości i spróbuj ponownie.',
  'mediaLib.derivative.openEditor': 'Edytuj {name}',

  'mediaLib.derivative.unsupportedTitle': 'Edycja działa tylko dla obrazów',
  'mediaLib.derivative.unsupportedBody':
    'Wideo, dźwięku i dokumentów nie można tu edytować. Przygotuj plik przed przesłaniem. Twój oryginalny przesłany plik nigdy nie jest zmieniany, niezależnie od tego.',

  'mediaLib.derivative.nonGenerative':
    'Relay nie generuje obrazów ani wideo. Ten edytor jedynie przycina, obraca, zmienia rozmiar, konwertuje i kompresuje to, co przesłałeś.',

  // ==================================================== refusals ====
  'error.media_derivative_no_operations.message': 'Wybierz co najmniej jedną zmianę przed zapisaniem wersji.',
  'error.media_derivative_duplicate_operation.message':
    'Każdy rodzaj zmiany może wystąpić tylko raz. Usuń drugi {operation}.',
  'error.media_derivative_crop_out_of_bounds.message':
    'To przycięcie wykracza poza krawędź obrazu, który ma {sourceWidth} na {sourceHeight} pikseli. Przesuń je lub zmniejsz.',
  'error.media_derivative_upscale_rejected.message':
    'Ten edytor nigdy nie powiększa obrazu, ponieważ dodatkowe piksele byłyby wymyślone, a nie Twoje. Maksymalny rozmiar tej wersji to {availableWidth} na {availableHeight}.',
  'error.media_derivative_source_unsupported.message':
    'Edycja działa dla obrazów JPEG, PNG, WebP i GIF. Ten plik to {mimeType}.',
  'error.media_derivative_dimensions_unknown.message':
    'Nie znamy jeszcze rozmiaru tego obrazu, więc nie możemy sprawdzić zmiany względem niego. Spróbuj ponownie po zakończeniu przetwarzania.',
  'error.media_derivative_format_required.message':
    'Wybierz format do zapisu. Pliku {sourceMimeType} nie można tu zapisać z powrotem jako on sam.',
  'error.media_derivative_quality_unsupported.message':
    'PNG jest bezstratny, więc ustawienie jakości nic by nie zmieniło. Usuń je albo zapisz jako JPEG lub WebP.',
  'error.media_derivative_no_change.message': 'To już jest format, którego ten plik używa.',
  'error.media_derivative_source_unavailable.message':
    'Plik, z którego miałaby powstać ta wersja, nie znajduje się już w pamięci.',
  'error.media_derivative_preset_mismatch.message':
    'To żądanie edycji nie odpowiada opisywanym w nim zmianom. Nic nie zostało utworzone. Spróbuj ponownie z edytora.',
  'error.media_derivative_empty_result.message':
    'Edycja nie dała żadnego obrazu, więc nic nie zostało zapisane. Twój oryginał jest nienaruszony.',
  'error.media_derivative_transform_failed.message':
    'Nie udało się odczytać ani zapisać tego obrazu. Nic nie zostało zapisane, a Twój oryginał jest nienaruszony.',
  'error.media_derivative_write_failed.message':
    'Nie udało się zapisać tej wersji. Nic nie zostało zapisane, a Twój oryginał jest nienaruszony.',
} as const;
