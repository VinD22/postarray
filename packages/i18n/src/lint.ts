/**
 * Catalog lint rules, run in CI.
 *
 * These are the rules a reviewer would otherwise have to hold in their head
 * while reading a few thousand strings. They fail loudly and name every
 * offending key, because a lint result nobody can act on is noise.
 */

import { parse } from '@formatjs/icu-messageformat-parser';
import type { MessageFormatElement } from '@formatjs/icu-messageformat-parser';

import {
  APPROVAL_STATES,
  PUBLISH_STATES,
  RELAY_ERROR_CODES,
  VALIDATION_ISSUE_CODES,
} from './codes';
import { getCardinalPluralCategories } from './locales';

export type LintSeverity = 'error' | 'warning';

export type LintRule =
  | 'key-format'
  | 'key-collision'
  | 'key-is-english-text'
  | 'message-empty'
  | 'message-parses'
  | 'plural-categories'
  | 'no-concatenation-marker'
  | 'no-em-dash'
  | 'no-retired-brand-name'
  | 'no-hype-word'
  | 'no-trailing-whitespace'
  | 'error-code-coverage'
  | 'publish-state-coverage'
  | 'approval-state-coverage'
  | 'validation-code-coverage'
  | 'argument-parity';

export interface LintFinding {
  readonly rule: LintRule;
  readonly severity: LintSeverity;
  readonly key: string;
  readonly message: string;
}

export interface LintResult {
  readonly locale: string;
  readonly ok: boolean;
  readonly findings: readonly LintFinding[];
  readonly errorCount: number;
  readonly warningCount: number;
  readonly keyCount: number;
}

export interface LintOptions {
  /** Locale the catalog is written for. Drives the plural category rule. */
  readonly locale?: string;
  /**
   * Reference catalog. When given, argument parity is checked against it, so a
   * translation cannot silently drop `{account}` from a sentence.
   */
  readonly reference?: Readonly<Record<string, string>>;
  /** Skip the coverage rules for a partial catalog under translation. */
  readonly requireCoverage?: boolean;
}

/**
 * Words the product voice forbids. Matched on word boundaries, case
 * insensitively, so "seamlessly" is caught and "unleashed" is caught.
 */
const HYPE_WORDS: readonly string[] = [
  'revolutionary',
  'magical',
  'magically',
  'effortless',
  'effortlessly',
  'viral',
  'virality',
  'autonomous',
  'autonomously',
  'game-changing',
  'game changing',
  'gamechanging',
  'seamless',
  'seamlessly',
  'unleash',
  'unleashes',
  'unleashing',
  'supercharge',
  'supercharges',
  'blazing fast',
  'cutting edge',
  'cutting-edge',
  'next-generation',
  'world-class',
  'effortlessness',
];

/** Em dash and horizontal bar. Both are forbidden in product visible copy. */
const FORBIDDEN_DASHES: readonly string[] = ['—', '―'];

/**
 * The retired codename, in the shapes that are actually a brand.
 *
 * The product is Post Array. `relay` survives only in package scopes and code
 * symbols, never as a name a reader sees. This rule exists because the rename
 * missed German entirely: that catalog had translated the codename as a word,
 * so searching for the English string found nothing while the German homepage
 * said `Relais` twenty four times including in its title, one page title read
 * `Staffel für Kreative`, and an analytics hint began `Im Staffellauf`.
 *
 * Deliberately narrow. A plain lowercase `relay` is an ordinary English word,
 * and the API terms legitimately prohibit "using Post Array as a relay for
 * content you are not authorized to publish". So this matches only the shapes
 * that are always a name and never a word:
 *
 *  - `Relay` / `Relais` capitalised at a word boundary, which also catches
 *    German compounds like `Relaisoberfläche`,
 *  - `Staffel` and `Staffellauf`, the other German words for a relay, and
 *  - the screaming-snake prefix `RELAY_`, which caught a live defect: the demo
 *    banner told people to set `NEXT_PUBLIC_RELAY_API_URL` long after that
 *    variable was renamed.
 *
 * ICU placeholders are exempt: `{relayValue}` is an argument name, and AGENTS.md
 * requires argument names to stay in English in every locale.
 */
const RETIRED_BRAND_PATTERN = /\bRelais?\b|\bStaffell?(auf|äufe)?\b|RELAY_/u;

/**
 * Markers of a sentence assembled from fragments. A translator cannot reorder
 * around these, so they are always a bug.
 */
const CONCATENATION_MARKERS: readonly { readonly pattern: RegExp; readonly reason: string }[] = [
  { pattern: /%[sd]/, reason: 'printf style placeholder' },
  { pattern: /\{\d+\}/, reason: 'positional placeholder' },
  { pattern: /\{\{/, reason: 'double brace placeholder' },
  { pattern: /\$\{/, reason: 'template literal placeholder' },
  { pattern: /(^|\s)\+\s*$/, reason: 'trailing concatenation operator' },
  { pattern: /^\s*\+/, reason: 'leading concatenation operator' },
  { pattern: /<%=?/, reason: 'template tag' },
];

/** A key segment: lower case start, then letters, digits or underscores. */
const KEY_SEGMENT = /^[a-z0-9][a-zA-Z0-9_]*$/;

/** Words that suggest a key was derived from its English sentence. */
const ENGLISH_KEY_SIGNALS = /\s|[.]{2}|[?!,'"]/;

export function lintCatalog(
  catalog: Readonly<Record<string, string>>,
  options: LintOptions = {},
): LintResult {
  const locale = options.locale ?? 'en';
  const requireCoverage = options.requireCoverage ?? true;
  const findings: LintFinding[] = [];
  const keys = Object.keys(catalog);

  const add = (rule: LintRule, severity: LintSeverity, key: string, message: string): void => {
    findings.push({ rule, severity, key, message });
  };

  checkKeyShape(keys, add);
  checkCollisions(keys, add);

  for (const key of keys) {
    const value = catalog[key];
    if (value === undefined) {
      continue;
    }
    checkMessage(key, value, locale, add);
    if (options.reference) {
      checkArgumentParity(key, value, options.reference[key], add);
    }
  }

  if (requireCoverage) {
    checkCoverage(catalog, add);
  }

  const errorCount = findings.filter((finding) => finding.severity === 'error').length;
  const warningCount = findings.length - errorCount;
  return {
    locale,
    ok: errorCount === 0,
    findings,
    errorCount,
    warningCount,
    keyCount: keys.length,
  };
}

type Add = (rule: LintRule, severity: LintSeverity, key: string, message: string) => void;

function checkKeyShape(keys: readonly string[], add: Add): void {
  for (const key of keys) {
    if (ENGLISH_KEY_SIGNALS.test(key)) {
      add(
        'key-is-english-text',
        'error',
        key,
        'Key looks like English text. Keys are intent based, for example action.saveDraft.',
      );
      continue;
    }
    const segments = key.split('.');
    if (segments.length < 2) {
      add('key-format', 'error', key, 'Key needs at least one namespace, for example nav.home.');
      continue;
    }
    for (const segment of segments) {
      if (!KEY_SEGMENT.test(segment)) {
        add(
          'key-format',
          'error',
          key,
          `Segment "${segment}" must start with a lower case letter or digit and contain only letters, digits or underscores.`,
        );
        break;
      }
    }
    if (key.length > 80) {
      add('key-format', 'warning', key, 'Key is unusually long. Consider a shorter namespace.');
    }
  }
}

function checkCollisions(keys: readonly string[], add: Add): void {
  const seenLowerCase = new Map<string, string>();
  const keySet = new Set(keys);

  for (const key of keys) {
    const lower = key.toLowerCase();
    const previous = seenLowerCase.get(lower);
    if (previous !== undefined && previous !== key) {
      add(
        'key-collision',
        'error',
        key,
        `Collides with "${previous}". Two keys must not differ only by case.`,
      );
    } else {
      seenLowerCase.set(lower, key);
    }

    // A leaf key must not also be used as a namespace.
    const segments = key.split('.');
    for (let length = 1; length < segments.length; length += 1) {
      const prefix = segments.slice(0, length).join('.');
      if (keySet.has(prefix)) {
        add(
          'key-collision',
          'error',
          key,
          `"${prefix}" is used both as a message and as a namespace. Give the leaf its own segment, for example ${prefix}.label.`,
        );
        break;
      }
    }
  }
}

function checkMessage(key: string, value: string, locale: string, add: Add): void {
  if (value.trim().length === 0) {
    add('message-empty', 'error', key, 'Message is empty.');
    return;
  }
  if (value !== value.trim()) {
    add(
      'no-trailing-whitespace',
      'error',
      key,
      'Message starts or ends with whitespace. Spacing belongs in the layout.',
    );
  }

  for (const dash of FORBIDDEN_DASHES) {
    if (value.includes(dash)) {
      add(
        'no-em-dash',
        'error',
        key,
        'Message contains an em dash. Use a period, comma, colon or parentheses.',
      );
      break;
    }
  }

  // Strip ICU placeholders first: an argument name is code, not copy.
  if (RETIRED_BRAND_PATTERN.test(value.replace(/\{[^}]*\}/gu, ''))) {
    add(
      'no-retired-brand-name',
      'error',
      key,
      'Message contains the retired name Relay. The product is Post Array, and a brand name is not translated.',
    );
  }

  const lowerCaseValue = value.toLowerCase();
  for (const word of HYPE_WORDS) {
    if (containsWord(lowerCaseValue, word)) {
      add('no-hype-word', 'error', key, `Message contains the forbidden word "${word}".`);
      break;
    }
  }

  for (const marker of CONCATENATION_MARKERS) {
    if (marker.pattern.test(value)) {
      add(
        'no-concatenation-marker',
        'error',
        key,
        `Message contains a ${marker.reason}. Use a named ICU argument instead.`,
      );
      break;
    }
  }

  let ast: MessageFormatElement[];
  try {
    ast = parse(value, { requiresOtherClause: false });
  } catch (error) {
    add('message-parses', 'error', key, `Message is not valid ICU: ${describeError(error)}`);
    return;
  }

  checkPluralCategories(key, ast, locale, add);
}

function checkPluralCategories(
  key: string,
  elements: readonly MessageFormatElement[],
  locale: string,
  add: Add,
): void {
  const required = new Set(getCardinalPluralCategories(locale));
  walkOptionArguments(elements, (kind, options) => {
    const provided = new Set(Object.keys(options));
    if (!provided.has('other')) {
      add(
        'plural-categories',
        'error',
        key,
        `The ${kind} argument is missing the required "other" case.`,
      );
    }
    if (kind !== 'plural') {
      return;
    }
    if (hasExplicitCover(provided)) {
      return;
    }
    const missing = [...required].filter(
      (category) => category !== 'other' && !provided.has(category),
    );
    if (missing.length > 0) {
      add(
        'plural-categories',
        'error',
        key,
        `Plural is missing the ${missing.join(', ')} case${missing.length > 1 ? 's' : ''} required by ${locale}.`,
      );
    }
  });
}

/**
 * A message may spell out exact values instead of categories, for example
 * `=0 {} =1 {} other {}`. That is legitimate for counters, so exact selectors
 * satisfy the category requirement.
 */
function hasExplicitCover(provided: ReadonlySet<string>): boolean {
  for (const option of provided) {
    if (option.startsWith('=')) {
      return true;
    }
  }
  return false;
}

type OptionKind = 'plural' | 'selectordinal' | 'select';

type OptionVisitor = (kind: OptionKind, options: Record<string, unknown>) => void;

function walkOptionArguments(
  elements: readonly MessageFormatElement[],
  visit: OptionVisitor,
): void {
  for (const element of elements) {
    const candidate = element as unknown as {
      type: number;
      options?: Record<string, { value: MessageFormatElement[] }>;
      pluralType?: string;
      children?: MessageFormatElement[];
    };
    if (candidate.options) {
      const kind: OptionKind =
        candidate.pluralType === undefined
          ? 'select'
          : candidate.pluralType === 'ordinal'
            ? 'selectordinal'
            : 'plural';
      visit(kind, candidate.options);
      for (const option of Object.values(candidate.options)) {
        walkOptionArguments(option.value, visit);
      }
    }
    if (candidate.children) {
      walkOptionArguments(candidate.children, visit);
    }
  }
}

function checkArgumentParity(
  key: string,
  value: string,
  reference: string | undefined,
  add: Add,
): void {
  if (reference === undefined) {
    return;
  }
  const referenceArguments = new Set(argumentNames(reference));
  const translatedArguments = new Set(argumentNames(value));
  const missing = [...referenceArguments].filter((name) => !translatedArguments.has(name));
  const extra = [...translatedArguments].filter((name) => !referenceArguments.has(name));
  if (missing.length > 0) {
    add(
      'argument-parity',
      'error',
      key,
      `Translation drops the argument${missing.length > 1 ? 's' : ''} ${missing.join(', ')}.`,
    );
  }
  if (extra.length > 0) {
    add(
      'argument-parity',
      'error',
      key,
      `Translation introduces the unknown argument${extra.length > 1 ? 's' : ''} ${extra.join(', ')}.`,
    );
  }
}

function argumentNames(message: string): readonly string[] {
  try {
    const names: string[] = [];
    collectNames(parse(message), names);
    return names;
  } catch {
    return [];
  }
}

function collectNames(elements: readonly MessageFormatElement[], names: string[]): void {
  for (const element of elements) {
    const candidate = element as unknown as {
      value?: unknown;
      options?: Record<string, { value: MessageFormatElement[] }>;
      children?: MessageFormatElement[];
      type: number;
    };
    // Type 0 is literal text, type 7 is the plural `#`. Everything else with a
    // string `value` is an argument name.
    if (candidate.type !== 0 && candidate.type !== 7 && typeof candidate.value === 'string') {
      names.push(candidate.value);
    }
    if (candidate.options) {
      for (const option of Object.values(candidate.options)) {
        collectNames(option.value, names);
      }
    }
    if (candidate.children) {
      collectNames(candidate.children, names);
    }
  }
}

function checkCoverage(catalog: Readonly<Record<string, string>>, add: Add): void {
  for (const code of RELAY_ERROR_CODES) {
    const key = `error.${code}.message`;
    if (catalog[key] === undefined) {
      add('error-code-coverage', 'error', key, `RelayError code "${code}" has no message.`);
    }
  }
  for (const state of PUBLISH_STATES) {
    const key = `state.${state}.label`;
    if (catalog[key] === undefined) {
      add('publish-state-coverage', 'error', key, `Publish state "${state}" has no label.`);
    }
  }
  for (const state of APPROVAL_STATES) {
    const key = `state.approval.${state}.label`;
    if (catalog[key] === undefined) {
      add('approval-state-coverage', 'error', key, `Approval state "${state}" has no label.`);
    }
  }
  for (const code of VALIDATION_ISSUE_CODES) {
    const key = `validation.${code}.message`;
    if (catalog[key] === undefined) {
      add('validation-code-coverage', 'error', key, `Validation issue "${code}" has no message.`);
    }
  }
}

function containsWord(lowerCaseText: string, word: string): boolean {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[^a-z])${escaped}([^a-z]|$)`).test(lowerCaseText);
}

function describeError(error: unknown): string {
  if (error instanceof Error) {
    return error.message.split('\n')[0] ?? error.name;
  }
  return 'unknown parse error';
}

/** Render a lint result as a report a person can act on. */
export function formatLintResult(result: LintResult): string {
  if (result.findings.length === 0) {
    return `${result.keyCount} keys checked for ${result.locale}. No findings.`;
  }
  const lines = result.findings.map(
    (finding) =>
      `${finding.severity === 'error' ? 'error' : 'warn '}  ${finding.key}  [${finding.rule}]  ${finding.message}`,
  );
  return [
    `${result.keyCount} keys checked for ${result.locale}.`,
    `${result.errorCount} errors, ${result.warningCount} warnings.`,
    ...lines,
  ].join('\n');
}

/** Throw when a catalog has any error level finding. Used by CI and tests. */
export function assertCatalogValid(
  catalog: Readonly<Record<string, string>>,
  options: LintOptions = {},
): void {
  const result = lintCatalog(catalog, options);
  if (!result.ok) {
    throw new Error(`Catalog lint failed.\n${formatLintResult(result)}`);
  }
}
