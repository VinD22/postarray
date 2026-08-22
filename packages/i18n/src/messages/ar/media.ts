export const mediaMessages = {
  'mediaLib.derivative.heading': 'تحرير هذه الصورة',
  'mediaLib.derivative.description':
    'اقصص، أدر، غيّر الحجم، غيّر الصيغة أو اضغط. كل تغيير يعمل على البكسلات الموجودة بالفعل في ملفك. لا يُضاف شيء لم يكن موجودًا.',
  'mediaLib.derivative.originalKept':
    'الأصل لا يُستبدل أبدًا. يُحفظ كل تعديل كنسخة منفصلة يمكنك اختيارها عند التأليف.',
  'mediaLib.derivative.apply': 'حفظ هذه النسخة',
  'mediaLib.derivative.applying': 'جارٍ حفظ هذه النسخة',
  'mediaLib.derivative.discard': 'تجاهل التغييرات',
  'mediaLib.derivative.noChanges': 'لا شيء لحفظه بعد. غيّر قيمة أعلاه.',

  'mediaLib.derivative.tab.crop': 'قص',
  'mediaLib.derivative.tab.transform': 'إدارة وتغيير الحجم',
  'mediaLib.derivative.tab.output': 'الصيغة',

  'mediaLib.derivative.cropHint':
    'اكتب الأرقام، أو استخدم مفاتيح الأسهم في أي حقل. لا توجد خطوة هنا تحتاج إلى فأرة.',
  'mediaLib.derivative.cropX': 'الحافة اليسرى، بالبكسل',
  'mediaLib.derivative.cropY': 'الحافة العلوية، بالبكسل',
  'mediaLib.derivative.cropWidth': 'عرض القص، بالبكسل',
  'mediaLib.derivative.cropHeight': 'ارتفاع القص، بالبكسل',
  'mediaLib.derivative.rotate': 'دوران',
  'mediaLib.derivative.rotateNone': 'بلا دوران',
  'mediaLib.derivative.rotateDegrees': '{degrees} درجة باتجاه عقارب الساعة',
  'mediaLib.derivative.resizeWidth': 'عرض جديد، بالبكسل',
  'mediaLib.derivative.resizeHeight': 'ارتفاع جديد، بالبكسل',
  'mediaLib.derivative.lockRatio': 'الحفاظ على الشكل عند تغيير جانب واحد',
  'mediaLib.derivative.format': 'حفظ بصيغة',
  'mediaLib.derivative.formatSame': 'الاحتفاظ بالصيغة الحالية',
  'mediaLib.derivative.quality': 'الجودة',
  'mediaLib.derivative.qualityHint':
    'الجودة الأقل تنتج ملفًا أصغر. تنطبق على JPEG وWebP. صيغة PNG بلا فقدان وتتجاهلها.',
  'mediaLib.derivative.projected': 'ستكون هذه النسخة بمقاس {width} في {height} بكسل.',
  'mediaLib.derivative.projectedUnavailable': 'حجم هذه النسخة غير متاح حتى يتم إنشاؤها.',

  'mediaLib.derivative.listHeading': 'النسخ',
  'mediaLib.derivative.original': 'الأصل',
  'mediaLib.derivative.originalHint': 'يُحفظ دائمًا. لا يُستبدل أبدًا.',
  'mediaLib.derivative.item': '{width} في {height}، {mimeType}، {size}',
  'mediaLib.derivative.empty': 'لا توجد نسخ معدّلة بعد. الأصل هو الملف الوحيد هنا.',
  'mediaLib.derivative.select': 'استخدام هذه النسخة',
  'mediaLib.derivative.selected': 'قيد الاستخدام لهذا المنشور',
  'mediaLib.derivative.useOriginal': 'استخدام الأصل',
  'mediaLib.derivative.processing': 'يتم إنشاء هذه النسخة. ستظهر هنا عند جاهزيتها.',
  'mediaLib.derivative.alreadyExists':
    'قمت بهذا التعديل بالضبط من قبل، لذا أعدنا استخدام تلك النسخة بدلًا من إنشاء نسخة ثانية.',
  'mediaLib.derivative.failedTitle': 'تعذّر إنشاء هذه النسخة',
  'mediaLib.derivative.failedBody': 'لم يُحفظ شيء وأصلك لم يُلمس. غيّر القيم وحاول مجددًا.',
  'mediaLib.derivative.openEditor': 'تحرير {name}',

  'mediaLib.derivative.unsupportedTitle': 'التحرير يعمل مع الصور فقط',
  'mediaLib.derivative.unsupportedBody':
    'لا يمكن تحرير الفيديو أو الصوت أو المستندات هنا. جهّز الملف قبل رفعه. رفعك الأصلي لا يتغيّر في كلتا الحالتين.',

  'mediaLib.derivative.nonGenerative':
    'Relay لا يولّد صورًا أو فيديو. هذا المحرر يقص ويدير ويغيّر الحجم ويحوّل ويضغط فقط ما رفعته.',

  'error.media_derivative_no_operations.message': 'اختر تغييرًا واحدًا على الأقل قبل حفظ نسخة.',
  'error.media_derivative_duplicate_operation.message':
    'كل نوع تغيير يمكن أن يظهر مرة واحدة فقط. احذف {operation} الثاني.',
  'error.media_derivative_crop_out_of_bounds.message':
    'ذلك القص يتجاوز حافة الصورة، التي مقاسها {sourceWidth} في {sourceHeight} بكسل. حرّكه أو صغّره.',
  'error.media_derivative_upscale_rejected.message':
    'هذا المحرر لا يكبّر صورة أبدًا، لأن البكسلات الإضافية ستكون مصطنعة وليست ملكك. أكبر حجم لهذه النسخة هو {availableWidth} في {availableHeight}.',
  'error.media_derivative_source_unsupported.message':
    'التحرير يعمل مع صور JPEG وPNG وWebP وGIF. هذا الملف بصيغة {mimeType}.',
  'error.media_derivative_dimensions_unknown.message':
    'لا نعرف حجم هذه الصورة بعد، لذا لا يمكننا التحقق من التغيير. حاول مجددًا بعد اكتمال المعالجة.',
  'error.media_derivative_format_required.message':
    'اختر صيغة للحفظ بها. لا يمكن حفظ ملف {sourceMimeType} بنفس صيغته هنا.',
  'error.media_derivative_quality_unsupported.message':
    'صيغة PNG بلا فقدان، لذا لن يكون لإعداد الجودة أي تأثير. احذفه، أو احفظ بصيغة JPEG أو WebP.',
  'error.media_derivative_no_change.message': 'هذه هي الصيغة التي يستخدمها هذا الملف بالفعل.',
  'error.media_derivative_source_unavailable.message':
    'الملف الذي كانت ستأتي منه هذه النسخة لم يعد موجودًا في التخزين.',
  'error.media_derivative_preset_mismatch.message':
    'طلب التحرير هذا لا يطابق التغييرات التي يصفها. لم يُنشأ شيء. حاول مجددًا من المحرر.',
  'error.media_derivative_empty_result.message':
    'التعديل لم ينتج صورة، لذا لم يُحفظ شيء. أصلك لم يُلمس.',
  'error.media_derivative_transform_failed.message':
    'تعذّرت قراءة أو كتابة هذه الصورة. لم يُحفظ شيء وأصلك لم يُلمس.',
  'error.media_derivative_write_failed.message':
    'تعذّر تسجيل هذه النسخة. لم يُحفظ شيء وأصلك لم يُلمس.',
} as const;
