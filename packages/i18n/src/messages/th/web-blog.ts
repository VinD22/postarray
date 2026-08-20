/**
 * The blog's page chrome.
 *
 * What belongs here: headings, labels, cluster names, byline names, feed
 * strings. What deliberately does not: article prose. The English catalog is
 * merged into one object that every page resolves, so putting article bodies
 * here would ship several thousand words of publishing advice to a reader who
 * opened the pricing page. Article content lives in typed modules under
 * `apps/web/src/features/blog/articles`, loaded per slug.
 *
 * The same rules bind both: no em dash, no hype word, and nothing that claims
 * this product publishes to any platform today, because no connector has
 * passed its definition of done.
 */
export const webBlogMessages = {
  'web.blog.meta.title': 'บทความเกี่ยวกับการดำเนินงานด้านการเผยแพร่',
  'web.blog.meta.description':
    'บทความเรื่องจังหวะการโพสต์ รูปแบบการกำหนดเวลา เขตเวลา การปรับเนื้อหาตามแต่ละแพลตฟอร์ม และการดูแลงานลูกค้าให้แยกเป็นแต่ละโปรเจกต์',

  'web.blog.title': 'บทความ',
  'web.blog.lede':
    'บันทึกเกี่ยวกับกลไกของการเผยแพร่งาน: กำหนดเวลาถูกวางขนาดอย่างไร คิวทำงานอย่างไรเมื่อสัปดาห์เลื่อน อะไรที่แตกต่างกันจริง ๆ ระหว่างแพลตฟอร์ม และงานลูกค้าถูกแยกออกจากกันอย่างไร',

  'web.blog.notice.prelaunch.title': 'บทความเหล่านี้พูดถึงปัญหา ไม่ใช่ผลิตภัณฑ์ที่คุณใช้งานได้แล้ว',
  'web.blog.notice.prelaunch.body':
    'ยังไม่มีการเชื่อมต่อใดที่นี่ผ่านการยืนยันจากผู้ให้บริการแล้ว จึงยังไม่มีอะไรถูกเผยแพร่ไปยังแพลตฟอร์มใดผ่านผลิตภัณฑ์นี้ในวันนี้ กฎของแต่ละแพลตฟอร์มด้านล่างล้วนมาพร้อมเอกสารทางการที่มันมาจากและวันที่มีคนอ่านเอกสารนั้น',

  'web.blog.cluster.cadence': 'จังหวะการโพสต์',
  'web.blog.cluster.scheduling': 'การกำหนดเวลา',
  'web.blog.cluster.adaptation': 'การปรับเนื้อหาตามแต่ละแพลตฟอร์ม',
  'web.blog.cluster.operations': 'การดำเนินงานของเอเจนซี',
  'web.blog.cluster.developers': 'การเชื่อมต่อผ่าน API',

  'web.blog.label.published': 'เผยแพร่ {date}',
  'web.blog.label.updated': 'อัปเดต {date}',
  'web.blog.label.writtenBy': 'เขียนโดย {name}',
  'web.blog.label.reviewedBy': 'ตรวจทานโดย {name}',
  'web.blog.label.sources': 'แหล่งที่มา',
  'web.blog.label.sourceRead': 'อ่านเมื่อ {date}',
  'web.blog.label.cluster': 'หัวข้อ',
  'web.blog.label.articleList': 'บทความ',
  'web.blog.label.backToIndex': 'บทความทั้งหมด',
  'web.blog.label.count': '{count, plural, =0 {ยังไม่มีบทความ} other {# บทความ}}',

  'web.blog.byline.editorial.name': 'ทีมวิจัยด้านการเผยแพร่',
  'web.blog.byline.editorial.role': 'เขียนและดูแลบทความเหล่านี้',
  'web.blog.byline.platform.name': 'ทีมเอกสารแพลตฟอร์ม',
  'web.blog.byline.platform.role': 'ตรวจสอบทุกประโยคเกี่ยวกับแพลตฟอร์มเทียบกับแหล่งที่มาทางการ',

  'web.blog.feed.title': 'บทความเกี่ยวกับการดำเนินงานด้านการเผยแพร่',
  'web.blog.feed.description':
    'บทความใหม่เรื่องจังหวะการโพสต์ รูปแบบการกำหนดเวลา เขตเวลา การปรับเนื้อหาตามแต่ละแพลตฟอร์ม และการดำเนินงานของเอเจนซี',
  'web.blog.feed.label': 'ฟีด RSS',

  'web.blog.empty.title': 'ยังไม่มีอะไรเผยแพร่ที่นี่',
  'web.blog.empty.body': 'บทความแรก ๆ กำลังถูกเขียนอยู่ ฟีดจะมีบทความเหล่านั้นเมื่อพร้อม',

  'web.blog.label.language': 'อ่านเป็นภาษา',
  'web.blog.label.notTranslated':
    'บทความนี้ยังไม่ได้เขียนเป็นภาษาของคุณ กำลังแสดงฉบับภาษาอังกฤษ',
  'web.blog.label.languageCount': '{count, plural, other {# ภาษา}}',
} as const;
