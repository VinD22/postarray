/**
 * Maintained pattern lists used by the guardrails and the growth
 * post-processor. Kept in one file so a security review has a single place to
 * read, and so the phrase lists can be extended without touching logic.
 */

/** Instruction-shaped text that has no business appearing inside source data. */
export const INJECTION_PATTERNS: readonly RegExp[] = [
  /ignore\s+(all\s+|any\s+)?(previous|prior|above|earlier)\s+(instructions?|prompts?|rules?)/i,
  /disregard\s+(the\s+)?(previous|prior|above|system)\s+(instructions?|prompts?|message)/i,
  /forget\s+(everything|all)\s+(you|above|previously)/i,
  /you\s+are\s+now\s+(a|an|the)\s+\w+/i,
  /\bnew\s+(system\s+)?(instructions?|prompt|rules?)\s*[:.]/i,
  /\bsystem\s*(prompt|message|role)\s*[:=]/i,
  /^\s*(system|assistant|developer)\s*:/im,
  /<\|\s*(im_start|im_end|system|endoftext)\s*\|>/i,
  /\[\/?\s*(inst|sys|system)\s*\]/i,
  /```\s*system\b/i,
  /\bact\s+as\s+(the\s+)?(system|administrator|root|developer)\b/i,
  /\b(reveal|print|show|output|repeat)\s+(your|the)\s+(system\s+)?(prompt|instructions?|rules?)/i,
  /\b(api[_-]?key|access[_-]?token|secret|password|credential)s?\b[^.\n]{0,40}\b(send|post|email|exfiltrate|include|output)\b/i,
  /\b(send|post|upload|exfiltrate|forward)\b[^.\n]{0,40}\b(to|at)\s+https?:\/\//i,
  /\bcall\s+the\s+\w+\s+tool\b/i,
  /\bwithout\s+(asking|approval|confirmation|review)\b/i,
  /\bbypass\s+(the\s+)?(approval|review|policy|guardrail|filter)/i,
  /\boverride\s+(the\s+)?(policy|schema|rules?|authorization)/i,
  /\byou\s+(must|should)\s+(now\s+)?(publish|submit|schedule|post)\b/i,
  /\bdeveloper\s+mode\b/i,
  /\bjailbreak\b/i,
];

/**
 * Claims and behaviours the product refuses to make or imply. R8 of the growth
 * post-processor matches against this list.
 */
export const PROHIBITED_BEHAVIOUR_PATTERNS: readonly RegExp[] = [
  /\bauto(matic|matically)?[- ]?(submit|submission|submitting)\b/i,
  /\bwe\s+will\s+submit\b/i,
  /\bsubmit\s+(this|it|the\s+form|your\s+listing)\s+(for\s+you|automatically|on\s+your\s+behalf)\b/i,
  /\bbulk\s+(directory\s+)?submi(t|ssion)/i,
  /\bmass\s+(submit|outreach|email|dm)/i,
  /\bautomated\s+outreach\b/i,
  /\bcold\s+(email|dm)\s+(campaign|automation|blast)/i,
  /\bguarantee[ds]?\s+(ranking|rankings|reach|placement|backlinks?|traffic|virality|results?)/i,
  /\bwill\s+(definitely\s+)?(rank|go\s+viral|guarantee)/i,
  /\bbuy\s+(links?|backlinks?|followers?|engagement)/i,
  /\blink\s+(exchange|farm|scheme)/i,
  /\bengagement\s+pod\b/i,
  /\bfollow[- ]?for[- ]?follow\b/i,
  /\bauto[- ]?(like|follow|dm|reply|comment)(s|ing)?\b/i,
  /\bscrape\b/i,
  /\bbypass\s+(moderation|review|the\s+queue)/i,
  /\bfake\s+(reviews?|testimonials?|engagement)/i,
];

/**
 * Data exfiltration channels. A generated string may not carry any of these
 * outside the fields where the application, not the model, injects them.
 */
export const URL_PATTERN =
  /\b(?:https?:\/\/|ftp:\/\/|data:|javascript:|file:\/\/|\/\/)[^\s<>"')]+/i;

export const BARE_DOMAIN_PATTERN =
  /\b(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+(?:com|net|org|io|ai|co|dev|app|xyz|me|gg|sh|so|to|ly|info|biz|site|online|store|link|click|page|cloud|tech|news|blog|email|zip|mov)\b/i;

export const EMAIL_PATTERN = /\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b/i;

export const PHONE_PATTERN = /(?:\+\d{1,3}[\s.-]?)?(?:\(\d{2,4}\)[\s.-]?)?\d{3,4}[\s.-]\d{3,4}(?:[\s.-]\d{2,4})?/;

/** Markup and metadata channels that can smuggle a destination past a reader. */
export const MARKUP_EXFILTRATION_PATTERNS: readonly RegExp[] = [
  /<\s*(img|iframe|script|link|object|embed|form|svg|meta|base)\b/i,
  /\bon(?:error|load|click|mouseover)\s*=/i,
  /!\[[^\]]*\]\([^)]*\)/,
  /\[[^\]]*\]\((?!#)[^)]*\)/,
  /\bxlink:href\b/i,
  /\bsrcset\b/i,
];

/**
 * Secret-shaped material. The gateway refuses to place any of this in model
 * context even when a caller passes it by mistake.
 */
export const SECRET_PATTERNS: readonly RegExp[] = [
  /\b(?:sk|pk|rk)[-_](?:live|test|prod)?[-_]?[A-Za-z0-9]{16,}\b/,
  /\bBearer\s+[A-Za-z0-9._-]{20,}\b/i,
  /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{5,}\b/,
  /-----BEGIN\s+[A-Z ]*PRIVATE KEY-----/,
  /\bAKIA[0-9A-Z]{16}\b/,
  /\bghp_[A-Za-z0-9]{20,}\b/,
  /\b(?:api[_-]?key|secret|password|access[_-]?token|refresh[_-]?token|client[_-]?secret)\s*[:=]\s*\S{8,}/i,
];

/** First-person customer testimonial shapes, checked by growth rule R10. */
export const TESTIMONIAL_PATTERNS: readonly RegExp[] = [
  /\bI\s+(saved|increased|doubled|tripled|grew|earned|made)\b/i,
  /\b(?:we|our team)\s+(saved|increased|doubled|tripled|grew)\s+\w+\s+(?:by|to)\s/i,
  /\bthis\s+(product|tool|service)\s+(changed|transformed|saved)\s+(my|our)\b/i,
  /\bsince\s+(using|switching\s+to)\s+\w+[^.]{0,60}\bI\b/i,
  /\bhighly\s+recommend\b/i,
];

/** Words the product voice avoids. Used as an eval scorer, not a hard block. */
export const BANNED_VOICE_WORDS: readonly string[] = [
  'revolutionary',
  'magical',
  'effortless',
  'viral',
  'autonomous',
  'game-changing',
  'game changing',
  'seamless',
  'unleash',
  'supercharge',
  'skyrocket',
  'unlock the power',
];

/** Em dash and its lookalikes. Product-visible copy must not contain them. */
export const EM_DASH_PATTERN = /[—–]/;
