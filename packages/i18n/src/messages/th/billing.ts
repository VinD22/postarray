/** th beta catalog namespace. */
export const billingMessages = {
  'billing.title': 'การเรียกเก็บเงิน',
  'billing.plan.name': 'Relay',
  'billing.plan.single': 'แผนหนึ่ง ทุกคุณสมบัติ ไม่มีชั้น.',
  'billing.plan.monthlyPrice': '$29/เดือน',
  'billing.plan.annualPrice': '$300/ปี',
  'billing.plan.annualFraming': '$25/เดือน เรียกเก็บเงินเป็นรายปี ประหยัด $48/ปี',
  'billing.plan.interval.monthly': 'รายเดือน',
  'billing.plan.interval.annual': 'ประจำปี',
  'billing.plan.selectInterval': 'เลือกช่วงเวลาการเรียกเก็บเงิน',
  'billing.plan.includes.title': 'สิ่งที่รวมอยู่ด้วย',
  'billing.plan.includes.channels': 'มากถึง 30 ช่องทางโซเชียลที่ใช้งานอยู่',
  'billing.plan.includes.members': 'สมาชิกในทีมไม่จำกัด',
  'billing.plan.includes.posts': 'ร่างและโพสต์ตามกำหนดเวลาไม่จำกัดภายใต้การใช้งานโดยชอบ',
  'billing.plan.includes.connectors': 'ทุกตัวเชื่อมต่อที่ได้รับอนุมัติ',
  'billing.plan.includes.analytics': 'การวิเคราะห์จะถูกเก็บไว้ตั้งแต่วันที่คุณเชื่อมต่อบัญชี',
  'billing.plan.includes.api': 'REST API, เซิร์ฟเวอร์ MCP ระยะไกล, CLI และ webhooks',
  'billing.plan.includes.automation': 'กฎการทำงานอัตโนมัติ โพสต์อัตโนมัติ RSS และลิงก์ที่ติดตาม',
  'billing.plan.includes.ai':
    'ความช่วยเหลือทางข้อความ DeepSeek ภายใต้การละเมิดและขีดจำกัดค่าใช้จ่าย',
  'billing.plan.includes.support': 'การสนับสนุนทางอีเมลและในแอป',
  'billing.plan.fairUse':
    'การใช้งานที่เหมาะสมหมายถึงการป้องกันสแปม อัตรา และการควบคุมต้นทุนของผู้ให้บริการที่ปกป้องบัญชีของคุณ พวกเขาทำงานเหมือนกันสำหรับสมาชิกทุกคน',
  'billing.trial.length': 'ทดลองใช้งานเจ็ดวันพร้อมทุกฟีเจอร์',
  'billing.trial.dueToday': '$0 ครบกำหนดชำระวันนี้',
  'billing.trial.paymentMethodRequired':
    'Polar รวบรวมวิธีการชำระเงินทันทีและไม่เรียกเก็บเงินใดๆ ในวันนี้',
  'billing.trial.firstCharge': 'ชาร์จครั้งแรก {amount} เมื่อ {date}',
  'billing.trial.renewal': 'ต่ออายุ {amount} ทุก ๆ {interval} หลังจากนั้น',
  'billing.trial.cancelBefore': 'ยกเลิกในการตั้งค่าก่อนวันที่นี้ และคุณจะไม่ถูกเรียกเก็บเงิน',
  'billing.trial.reminder': 'Polar ส่งอีเมลถึงคุณสามวันก่อนการแปลงรุ่นทดลองใช้',
  "billing.trial.daysRemaining": "{count, plural, =0 {Trial ends today} one {Trial, # day remaining} other {Trial, # days remaining}}",
  'billing.trial.converted': 'รุ่นทดลองใช้ของคุณแปลงเมื่อ {date}',
  'billing.trial.canceled': 'การทดลองใช้ของคุณถูกยกเลิก คุณจะไม่ถูกเรียกเก็บเงิน',
  'billing.trial.abusePrevention':
    'การทดลองซ้ำมีจำกัด หากไม่มีรุ่นทดลองใช้สำหรับบัญชีนี้ โปรดติดต่อฝ่ายสนับสนุน',
  'billing.checkout.open': 'ดำเนินการชำระเงินต่อไป',
  'billing.checkout.hostedBy':
    'การชำระเงินและใบแจ้งหนี้ได้รับการจัดการโดย Polar ซึ่งเป็นผู้ค้าที่บันทึกไว้ของเรา',
  'billing.checkout.taxNote': 'Polar รวบรวมและนำส่งภาษีการขายหรือภาษีมูลค่าเพิ่มที่เกี่ยวข้อง',
  'billing.checkout.notEntitledYet':
    'เราให้สิทธิ์การเข้าถึงหลังจากที่ Polar ยืนยันการสมัครสมาชิก ไม่ใช่จากการเปลี่ยนเส้นทางของเบราว์เซอร์ โดยปกติจะใช้เวลาไม่กี่วินาที',
  'billing.checkout.returning': 'ยืนยันการสมัครของคุณกับ Polar',
  'billing.subscription.status.trialing': 'ทดลอง',
  'billing.subscription.status.active': 'ใช้งานอยู่',
  'billing.subscription.status.pastDue': 'ค้างชำระ',
  'billing.subscription.status.canceled': 'ยกเลิกแล้ว',
  'billing.subscription.status.unpaid': 'ค้างชำระ',
  'billing.subscription.status.none': 'ไม่มีการสมัครสมาชิก',
  'billing.subscription.renewsOn': 'ต่ออายุ {amount} บน {date}',
  'billing.subscription.endsOn': 'การเข้าถึงดำเนินต่อไปจนถึง {date}',
  'billing.subscription.pastDueBody':
    'งวดล่าสุดไม่ผ่าน อัปเดตวิธีการชำระเงินเพื่อเผยแพร่ต่อไป หลังจากช่วงผ่อนผัน พื้นที่ทำงานจะกลายเป็นแบบอ่านอย่างเดียวและโพสต์ตามกำหนดการจะหยุดลง',
  'billing.subscription.readOnly':
    'พื้นที่ทำงานนี้เป็นแบบอ่านอย่างเดียว เนื้อหา ใบเสร็จรับเงิน และการเชื่อมต่อของคุณยังคงอยู่',
  'billing.subscription.portal': 'เปิดพอร์ทัลลูกค้าโพลาร์',
  'billing.subscription.invoices': 'ใบแจ้งหนี้',
  'billing.subscription.paymentMethod': 'วิธีการชำระเงิน',
  'billing.subscription.managedByPolar': 'จัดการดูแลโดยโพลาร์',
  'billing.cancel.title': 'ยกเลิกการสมัครสมาชิกของคุณ',
  'billing.cancel.beforeTrialEnd':
    'ยกเลิกตอนนี้และคุณจะไม่ถูกเรียกเก็บเงิน คุณเก็บทุกฟีเจอร์ไว้จนถึง {date}',
  'billing.cancel.afterTrial': 'คุณเข้าถึงได้จนถึง {date} ไม่มีอะไรถูกลบเมื่อสิ้นสุด',
  'billing.cancel.confirm': 'ยกเลิกการสมัครสมาชิก',
  'billing.cancel.confirmed': 'ยกเลิกแล้ว คุณจะไม่ถูกเรียกเก็บเงิน',
  'billing.cancel.keepData':
    'แบบร่าง ใบเสร็จรับเงิน และการวิเคราะห์ของคุณจะยังคงอยู่ในพื้นที่ทำงานนี้',
  'billing.usage.title': 'การใช้งาน',
  'billing.usage.meteredNote':
    'ต้นทุนของผู้ให้บริการบางรายจะถูกส่งผ่านด้วยต้นทุน เนื่องจากผู้ให้บริการคิดค่าธรรมเนียมต่อการดำเนินการ',
  'billing.usage.xCharges':
    'X ค่าใช้จ่ายสำหรับแต่ละโพสต์ โพสต์ที่มี URL มีราคาสูงกว่าข้อความธรรมดา',
  'billing.usage.balance': 'ยอดการใช้งาน {amount}',
  'billing.usage.estimatedBeforeAction': 'การดำเนินการนี้คาดว่าจะอยู่ที่ {amount}',
  'billing.usage.periodTotal': '{amount} ใช้ตั้งแต่ {date}',
  'billing.usage.noMediaCredits':
    'ไม่มีเครดิตการสร้างรูปภาพหรือวิดีโอ เนื่องจาก Relay ไม่ได้สร้างสื่อ',
  "billing.downgrade.overLimit": "This workspace has {count, plural, one {# channel} other {# channels}} over the limit. New actions on those channels are blocked. Nothing is disconnected for you.",
  'billing.mediaGeneration.title': 'เหตุใดเราไม่สร้างภาพหรือวิดีโอ',
  'billing.mediaGeneration.explanation':
    'เรามุ่งเน้นที่การช่วยคุณวางแผน อนุมัติ เผยแพร่ และเรียนรู้ เราไม่สร้างรูปภาพหรือวิดีโอใน V1 เนื่องจากสื่อที่พร้อมสำหรับแบรนด์ต้องการมากกว่าข้อความแจ้งสั้นๆ แต่ต้องการระบบภาพที่สมบูรณ์ รายละเอียดสินค้าที่ถูกต้อง ทรัพย์สินที่ได้รับอนุญาต ผู้คนและการอนุญาตการใช้งาน และการตรวจสอบอย่างรอบคอบ โมเดลเชิงสร้างสรรค์ก็เปลี่ยนแปลงอย่างรวดเร็วเช่นกัน เราขอแนะนำเครื่องมือผู้เชี่ยวชาญที่ได้รับการยืนยันในปัจจุบัน และทำให้ง่ายต่อการนำงานที่เสร็จแล้วมาสู่แคมเปญของคุณในขณะที่คุณควบคุมการสร้างสรรค์',
  'billing.referral.title': 'การอ้างอิง',
  'billing.referral.disclosure':
    'ลิงก์ผู้อ้างอิงจะต้องเปิดเผยทุกที่ที่คุณแชร์ ค่าคอมมิชชันไม่มีเงื่อนไขในการทบทวนเชิงบวก',
  'billing.referral.link': 'ลิงค์ผู้อ้างอิงของคุณ',
  "billing.referral.attributed": "{count, plural, one {# attributed signup} other {# attributed signups}}",
  'billing.referral.commissionPending': 'รอดำเนินการ ระงับไว้จนกว่าหน้าต่างการคืนเงินจะปิดลง',
  'billing.referral.commissionApproved': 'อนุมัติแล้ว',
  'billing.referral.commissionReversed': 'ย้อนกลับหลังจากการคืนเงิน',
  'billing.referral.payout': 'การจ่ายเงินดำเนินการ {schedule}',
} as const;
