/**
 * Billing, trial and plan copy.
 *
 * Several strings here are mandated word for word by the research and by the
 * launch acceptance checklist. Do not soften or restyle them:
 *  - `billing.trial.dueToday` must read "$0 due today".
 *  - `billing.plan.annualFraming` must state the saving in currency, never a
 *    percentage discount.
 *  - `billing.mediaGeneration.explanation` is the approved boundary paragraph.
 *    Tool Radar and the pricing page use this same key.
 */
export const billingMessages = {
  'billing.title': 'Billing',
  'billing.plan.name': 'Relay',
  'billing.plan.single': 'One plan. Every feature. No tiers.',
  'billing.plan.monthlyPrice': '$29/month',
  'billing.plan.annualPrice': '$300/year',
  'billing.plan.annualFraming': '$25/month billed annually. Save $48/year.',
  'billing.plan.interval.monthly': 'Monthly',
  'billing.plan.interval.annual': 'Annual',
  'billing.plan.selectInterval': 'Choose a billing interval',
  'billing.plan.includes.title': 'What is included',
  'billing.plan.includes.channels': 'Up to 30 active social channels',
  'billing.plan.includes.members': 'Unlimited team members',
  'billing.plan.includes.posts': 'Unlimited drafts and scheduled posts under fair use',
  'billing.plan.includes.connectors': 'Every approved connector',
  'billing.plan.includes.analytics': 'Analytics kept from the day you connect an account',
  'billing.plan.includes.api': 'REST API, remote MCP server, CLI and webhooks',
  'billing.plan.includes.automation': 'Automation rules, RSS autopost and tracked links',
  'billing.plan.includes.ai': 'DeepSeek text assistance under abuse and cost limits',
  'billing.plan.includes.support': 'Email and in app support',
  'billing.plan.fairUse':
    'Fair use means anti spam, rate and provider cost controls that protect your accounts. They work the same for every subscriber.',

  'billing.trial.length': 'Seven day trial with every feature',
  'billing.trial.dueToday': '$0 due today',
  'billing.trial.paymentMethodRequired':
    'Polar collects a payment method now and charges nothing today.',
  'billing.trial.firstCharge': 'First charge {amount} on {date}',
  'billing.trial.renewal': 'Renews {amount} every {interval} after that',
  'billing.trial.cancelBefore':
    'Cancel in Settings before this date and you will not be charged.',
  'billing.trial.reminder': 'Polar emails you three days before the trial converts.',
  'billing.trial.daysRemaining':
    '{count, plural, =0 {Trial ends today} one {Trial, # day remaining} other {Trial, # days remaining}}',
  'billing.trial.converted': 'Your trial converted on {date}.',
  'billing.trial.canceled': 'Your trial is canceled. You will not be charged.',
  'billing.trial.abusePrevention':
    'Repeat trials are limited. If a trial is not available for this account, contact support.',

  'billing.checkout.open': 'Continue to checkout',
  'billing.checkout.hostedBy': 'Checkout and invoices are handled by Polar, our merchant of record.',
  'billing.checkout.taxNote': 'Polar collects and remits any sales tax or VAT that applies.',
  'billing.checkout.notEntitledYet':
    'We grant access after Polar confirms the subscription, not from the browser redirect. This usually takes a few seconds.',
  'billing.checkout.returning': 'Confirming your subscription with Polar',

  'billing.subscription.status.trialing': 'Trial',
  'billing.subscription.status.active': 'Active',
  'billing.subscription.status.pastDue': 'Payment overdue',
  'billing.subscription.status.canceled': 'Canceled',
  'billing.subscription.status.unpaid': 'Unpaid',
  'billing.subscription.status.none': 'No subscription',
  'billing.subscription.renewsOn': 'Renews {amount} on {date}',
  'billing.subscription.endsOn': 'Access continues until {date}',
  'billing.subscription.pastDueBody':
    'The last payment did not go through. Update the payment method to keep publishing. After the grace period the workspace becomes read only and scheduled posts stop.',
  'billing.subscription.readOnly':
    'This workspace is read only. Your content, receipts and connections are intact.',
  'billing.subscription.portal': 'Open the Polar customer portal',
  'billing.subscription.invoices': 'Invoices',
  'billing.subscription.paymentMethod': 'Payment method',
  'billing.subscription.managedByPolar': 'Managed by Polar',

  'billing.cancel.title': 'Cancel your subscription',
  'billing.cancel.beforeTrialEnd':
    'Cancel now and you will not be charged. You keep every feature until {date}.',
  'billing.cancel.afterTrial': 'You keep access until {date}. Nothing is deleted when it ends.',
  'billing.cancel.confirm': 'Cancel subscription',
  'billing.cancel.confirmed': 'Canceled. You will not be charged.',
  'billing.cancel.keepData': 'Your drafts, receipts and analytics stay in this workspace.',

  'billing.usage.title': 'Usage',
  'billing.usage.meteredNote':
    'Some provider costs are passed through at cost because the provider charges per operation.',
  'billing.usage.xCharges':
    'X charges for each post. Posts that contain a URL cost more than plain text.',
  'billing.usage.balance': 'Usage balance {amount}',
  'billing.usage.estimatedBeforeAction': 'This action is estimated at {amount}.',
  'billing.usage.periodTotal': '{amount} used since {date}',
  'billing.usage.noMediaCredits':
    'There are no image or video generation credits, because Relay does not generate media.',

  'billing.downgrade.overLimit':
    'This workspace has {count, plural, one {# channel} other {# channels}} over the limit. New actions on those channels are blocked. Nothing is disconnected for you.',

  'billing.mediaGeneration.title': 'Why we do not generate images or video',
  'billing.mediaGeneration.explanation':
    'We focus on helping you plan, approve, publish and learn. We do not generate images or video in V1 because brand-ready media needs more than a short prompt: it needs your complete visual system, accurate product details, licensed assets, people and usage permissions, and careful review. Creative models also change quickly. We recommend currently verified specialist tools and make it easy to bring their finished work into your campaigns while you keep creative control.',

  'billing.referral.title': 'Referrals',
  'billing.referral.disclosure':
    'Referral links must be disclosed wherever you share them. Commission is never conditional on a positive review.',
  'billing.referral.link': 'Your referral link',
  'billing.referral.attributed':
    '{count, plural, one {# attributed signup} other {# attributed signups}}',
  'billing.referral.commissionPending': 'Pending, held until the refund window closes',
  'billing.referral.commissionApproved': 'Approved',
  'billing.referral.commissionReversed': 'Reversed after a refund',
  'billing.referral.payout': 'Payouts run {schedule}.',
} as const;
