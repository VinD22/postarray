export const mediaMessages = {
  // ==================================================== der Editor ====
  'mediaLib.derivative.heading': 'Dieses Bild bearbeiten',
  'mediaLib.derivative.description':
    'Zuschneiden, drehen, skalieren, das Format ändern oder komprimieren. Jede Änderung wirkt auf die Pixel, die schon in deiner Datei sind. Es wird nichts hinzugefügt, was nicht schon da war.',
  'mediaLib.derivative.originalKept':
    'Das Original wird nie ersetzt. Jede Bearbeitung wird als separate Version gespeichert, die du beim Verfassen auswählen kannst.',
  'mediaLib.derivative.apply': 'Diese Version speichern',
  'mediaLib.derivative.applying': 'Diese Version wird gespeichert',
  'mediaLib.derivative.discard': 'Änderungen verwerfen',
  'mediaLib.derivative.noChanges': 'Noch nichts zu speichern. Ändere oben einen Wert.',

  'mediaLib.derivative.tab.crop': 'Zuschneiden',
  'mediaLib.derivative.tab.transform': 'Drehen und skalieren',
  'mediaLib.derivative.tab.output': 'Format',

  'mediaLib.derivative.cropHint':
    'Gib die Zahlen ein, oder nutze die Pfeiltasten in jedem Feld. Kein Schritt hier braucht eine Maus.',
  'mediaLib.derivative.cropX': 'Linker Rand, in Pixeln',
  'mediaLib.derivative.cropY': 'Oberer Rand, in Pixeln',
  'mediaLib.derivative.cropWidth': 'Breite des Zuschnitts, in Pixeln',
  'mediaLib.derivative.cropHeight': 'Höhe des Zuschnitts, in Pixeln',
  'mediaLib.derivative.rotate': 'Drehen',
  'mediaLib.derivative.rotateNone': 'Keine Drehung',
  'mediaLib.derivative.rotateDegrees': '{degrees} Grad im Uhrzeigersinn',
  'mediaLib.derivative.resizeWidth': 'Neue Breite, in Pixeln',
  'mediaLib.derivative.resizeHeight': 'Neue Höhe, in Pixeln',
  'mediaLib.derivative.lockRatio': 'Form beibehalten, wenn ich eine Seite ändere',
  'mediaLib.derivative.format': 'Speichern als',
  'mediaLib.derivative.formatSame': 'Aktuelles Format beibehalten',
  'mediaLib.derivative.quality': 'Qualität',
  'mediaLib.derivative.qualityHint':
    'Geringere Qualität ergibt eine kleinere Datei. Gilt für JPEG und WebP. PNG ist verlustfrei und ignoriert es.',
  'mediaLib.derivative.projected': 'Diese Version wird {width} mal {height} Pixel groß.',
  'mediaLib.derivative.projectedUnavailable':
    'Die Größe dieser Version ist nicht verfügbar, bis sie erstellt wurde.',

  // ==================================================== die Versionsliste ====
  'mediaLib.derivative.listHeading': 'Versionen',
  'mediaLib.derivative.original': 'Original',
  'mediaLib.derivative.originalHint': 'Wird immer behalten. Nie überschrieben.',
  'mediaLib.derivative.item': '{width} mal {height}, {mimeType}, {size}',
  'mediaLib.derivative.empty': 'Noch keine bearbeiteten Versionen. Das Original ist die einzige Datei hier.',
  'mediaLib.derivative.select': 'Diese Version verwenden',
  'mediaLib.derivative.selected': 'Für diesen Beitrag im Einsatz',
  'mediaLib.derivative.useOriginal': 'Original verwenden',
  'mediaLib.derivative.processing': 'Diese Version wird erstellt. Sie erscheint hier, sobald sie fertig ist.',
  'mediaLib.derivative.alreadyExists':
    'Du hast genau diese Bearbeitung schon einmal gemacht, also haben wir diese Version wiederverwendet, statt eine zweite zu erstellen.',
  'mediaLib.derivative.failedTitle': 'Diese Version konnte nicht erstellt werden',
  'mediaLib.derivative.failedBody':
    'Nichts wurde gespeichert und dein Original ist unverändert. Ändere die Werte und versuche es erneut.',
  'mediaLib.derivative.openEditor': '{name} bearbeiten',

  'mediaLib.derivative.unsupportedTitle': 'Bearbeitung funktioniert nur bei Bildern',
  'mediaLib.derivative.unsupportedBody':
    'Video, Audio und Dokumente können hier nicht bearbeitet werden. Bereite die Datei vor, bevor du sie hochlädst. Dein ursprünglicher Upload wird so oder so nicht verändert.',

  'mediaLib.derivative.nonGenerative':
    'Das Werkzeug erzeugt keine Bilder oder Videos. Dieser Editor schneidet nur zu, dreht, skaliert, konvertiert und komprimiert, was du hochgeladen hast.',

  // ==================================================== Ablehnungen ====
  'error.media_derivative_no_operations.message': 'Wähle mindestens eine Änderung, bevor du eine Version speicherst.',
  'error.media_derivative_duplicate_operation.message':
    'Jede Art von Änderung darf einmal vorkommen. Entferne das zweite {operation}.',
  'error.media_derivative_crop_out_of_bounds.message':
    'Dieser Zuschnitt reicht über den Rand des Bildes hinaus, das {sourceWidth} mal {sourceHeight} Pixel groß ist. Verschiebe ihn oder mache ihn kleiner.',
  'error.media_derivative_upscale_rejected.message':
    'Dieser Editor vergrößert ein Bild nie, weil die zusätzlichen Pixel erfunden statt echt wären. Die größte Größe für diese Version ist {availableWidth} mal {availableHeight}.',
  'error.media_derivative_source_unsupported.message':
    'Bearbeitung funktioniert bei JPEG-, PNG-, WebP- und GIF-Bildern. Diese Datei ist {mimeType}.',
  'error.media_derivative_dimensions_unknown.message':
    'Wir kennen die Größe dieses Bildes noch nicht, also können wir die Änderung nicht dagegen prüfen. Versuche es erneut, sobald die Verarbeitung abgeschlossen ist.',
  'error.media_derivative_format_required.message':
    'Wähle ein Format zum Speichern. Eine {sourceMimeType}-Datei kann hier nicht als sich selbst gespeichert werden.',
  'error.media_derivative_quality_unsupported.message':
    'PNG ist verlustfrei, eine Qualitätseinstellung würde also nichts bewirken. Entferne sie, oder speichere als JPEG oder WebP.',
  'error.media_derivative_no_change.message': 'Das ist bereits das Format, das diese Datei verwendet.',
  'error.media_derivative_source_unavailable.message':
    'Die Datei, aus der diese Version stammen würde, ist nicht mehr im Speicher.',
  'error.media_derivative_preset_mismatch.message':
    'Diese Bearbeitungsanfrage stimmt nicht mit den beschriebenen Änderungen überein. Es wurde nichts erstellt. Versuche es erneut vom Editor aus.',
  'error.media_derivative_empty_result.message':
    'Die Bearbeitung hat kein Bild ergeben, also wurde nichts gespeichert. Dein Original ist unverändert.',
  'error.media_derivative_transform_failed.message':
    'Dieses Bild konnte nicht gelesen oder geschrieben werden. Nichts wurde gespeichert und dein Original ist unverändert.',
  'error.media_derivative_write_failed.message':
    'Diese Version konnte nicht erfasst werden. Nichts wurde gespeichert und dein Original ist unverändert.',
} as const;
