/**
 * The comparison pages' chrome.
 *
 * What belongs here: state words, section headings, labels, and the three
 * disclosure sentences whose numbers are read at render time from the code
 * that decides them. What deliberately does not: the claims themselves. A
 * comparison table is several hundred words of dated, sourced content per
 * page, and the English catalog is merged into one object that every page load
 * resolves, so those claims live in typed modules under
 * `apps/web/src/features/comparisons/entries` and are loaded per slug.
 *
 * The `web.compare.*` namespace is the older `/compare` index. This namespace
 * is the per comparison page, kept separate so the index copy that beta locales
 * already carry is not disturbed.
 */
export const webComparisonMessages = {
  'web.comparison.eyebrow': 'Paghahambing',

  'web.comparison.state.yes': 'Oo',
  'web.comparison.state.no': 'Hindi',
  'web.comparison.state.partial': 'Bahagya',
  'web.comparison.state.notVerified': 'Hindi pa na-verify',

  'web.comparison.label.claim': 'Pahayag',
  'web.comparison.label.sourceRead': 'Nabasa {date}',
  'web.comparison.label.checked': 'Na-check ang bawat row {date}',
  'web.comparison.label.nextReview': 'Susunod na check sa {date}',
  'web.comparison.label.backToIndex': 'Lahat ng paghahambing',

  'web.comparison.table.title': 'Ano ang kaya ng bawat opsyon',
  'web.comparison.table.caption': 'Isang claim bawat row, kasama ang source sa likod ng bawat sagot',

  'web.comparison.bestFor.title': 'Alin ang bagay para sa iyo',
  'web.comparison.bestFor.ours': 'Piliin ang produktong ito kapag',
  'web.comparison.bestFor.alternative': 'Piliin ang {name} kapag',

  'web.comparison.notDo.title': 'Ang hindi kaya ng produktong ito',
  'web.comparison.notDo.body':
    'Binabasa ang mga pangungusap na ito mula sa code na nagtatakda sa mga ito, hindi na-type nang manwal, kaya hindi maaaring lumihis ang seksyong ito mula sa kung ano talaga ang produkto ngayon.',
  'web.comparison.disclosure.connectors':
    '{count, plural, =0 {Wala pang koneksyon na nakumpleto ang provider verification, kaya wala pang na-publish sa anumang platform sa pamamagitan ng produktong ito ngayon.} one {Nakumpleto ng # koneksyon ang provider verification. Intent pa rin ang bawat ibang platform sa cohort.} other {Nakumpleto ng # na koneksyon ang provider verification. Intent pa rin ang bawat ibang platform sa cohort.}}',
  'web.comparison.disclosure.locales':
    '{count, plural, =0 {Wala pang wikang nakumpleto ang human review, kaya beta ang label ng bawat wika sa interface.} one {Nakumpleto ng # wika ang human review. Beta ang label ng bawat ibang wika.} other {Nakumpleto ng # na wika ang human review. Beta ang label ng bawat ibang wika.}}',
  'web.comparison.disclosure.tiers':
    '{count, plural, =0 {Napagpasyahan na ang bawat pricing tier at may tunay na presyo na ito.} one {# pricing tier pa rin ang hindi napagpapasyahan at hindi pa mabibili.} other {# na pricing tier pa rin ang hindi napagpapasyahan at hindi pa mabibili.}}',

  'web.comparison.notVerified.title': 'Ano ang ibig sabihin ng hindi pa na-verify',
  'web.comparison.notVerified.body':
    'Sinasabi ng isang cell na hindi pa na-verify kapag hindi mababasa ang katotohanan mula sa opisyal na pampublikong dokumentasyon ng kabilang opsyon sa araw ng pagsusuri. Hindi ito kailanman pinupunan mula sa alaala, at hindi kailanman kinokopya mula sa buod na isinulat ng iba.',

  'web.comparison.method.title': 'Paano ginawa ang page na ito',
  'web.comparison.method.body':
    'Ang bawat row ay isang claim, kasama ang dokumentong pinagmulan nito at ang petsang binasa iyon ng isang tao. Walang screenshot ng kompetisyon, walang kinopyang mga salita ng feature, at walang gawa-gawang kahinaan.',
  'web.comparison.method.cadence':
    'Chine-check ulit ang bawat paghahambing nang hindi bababa sa isang beses bawat 90 araw, at agad kapag may binago ang isang platform o opsyon na sinasabi ng isang row.',

  'web.comparison.questions.title': 'Mga tanong',
  'web.comparison.sources.title': 'Mga source na sinipi sa page na ito',

  'web.comparison.index.title': 'Mga na-publish na paghahambing',
  'web.comparison.index.body':
    'Inihahambing ng bawat page ang produktong ito sa isang kategorya ng alternatibong mababasa ang mga katotohanan mula sa opisyal na dokumentasyon. Nagkakaroon ng page ang isang pinangalanang produkto kapag mababasa ang kasalukuyang katotohanan nito mula sa sarili nitong mga pampublikong page, at hindi bago noon.',
  'web.comparison.index.checked': 'Na-check {date}',
} as const;
