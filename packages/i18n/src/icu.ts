/**
 * A small structural walker over ICU MessageFormat source.
 *
 * It exists so `pseudo.ts` can transform only human readable literal text, and
 * `translate.ts` can strip arguments out of a message it failed to format,
 * without either of them re-implementing brace matching. Validation is not its
 * job: `lint.ts` uses the real FormatJS parser for that.
 */

export interface IcuTransform {
  /** Called for each run of literal, translatable text. */
  readonly literal: (text: string) => string;
  /**
   * Called for each complete simple or formatted argument, braces included,
   * for example `{count}` or `{when, date, medium}`.
   */
  readonly argument?: (source: string) => string;
  /**
   * Notified for `plural`, `select` and `selectordinal` arguments, whose sub
   * messages the walker descends into instead of handing to `argument`.
   */
  readonly subMessage?: (name: string, type: string) => void;
}

interface WalkContext {
  readonly literal: (text: string) => string;
  readonly argument: (source: string) => string;
  readonly subMessage: (name: string, type: string) => void;
}

const SUB_MESSAGE_TYPES: ReadonlySet<string> = new Set(['plural', 'select', 'selectordinal']);

/**
 * Walk `message`, applying `transform.literal` to translatable text and
 * `transform.argument` to argument placeholders. Sub messages inside `plural`,
 * `select` and `selectordinal` options are descended into so their literal text
 * is transformed while option keywords stay intact.
 *
 * ICU quoting is preserved: a run beginning with `'` that escapes a brace or
 * `#` is passed through untouched.
 */
export function transformIcu(message: string, transform: IcuTransform): string {
  const context: WalkContext = {
    literal: transform.literal,
    argument: transform.argument ?? ((source) => source),
    subMessage: transform.subMessage ?? (() => undefined),
  };
  return walk(message, context);
}

function walk(source: string, context: WalkContext): string {
  let output = '';
  let literal = '';
  let index = 0;

  const flush = (): void => {
    if (literal.length > 0) {
      output += context.literal(literal);
      literal = '';
    }
  };

  while (index < source.length) {
    const char = source[index];
    if (char === undefined) {
      break;
    }

    if (char === "'") {
      const quoted = readQuoted(source, index);
      if (quoted) {
        flush();
        output += quoted.text;
        index = quoted.nextIndex;
        continue;
      }
      literal += char;
      index += 1;
      continue;
    }

    if (char === '{') {
      const end = findMatchingBrace(source, index);
      if (end === -1) {
        literal += char;
        index += 1;
        continue;
      }
      flush();
      output += rewriteArgument(source.slice(index, end + 1), context);
      index = end + 1;
      continue;
    }

    literal += char;
    index += 1;
  }

  flush();
  return output;
}

/**
 * ICU quoting: `''` is a literal apostrophe, and `'` starts a quoted run only
 * when the next character is `{`, `}` or `#`.
 */
function readQuoted(source: string, start: number): { text: string; nextIndex: number } | undefined {
  const next = source[start + 1];
  if (next === "'") {
    return { text: "''", nextIndex: start + 2 };
  }
  if (next !== '{' && next !== '}' && next !== '#') {
    return undefined;
  }
  const closing = source.indexOf("'", start + 2);
  if (closing === -1) {
    return { text: source.slice(start), nextIndex: source.length };
  }
  return { text: source.slice(start, closing + 1), nextIndex: closing + 1 };
}

function findMatchingBrace(source: string, openIndex: number): number {
  let depth = 0;
  let index = openIndex;
  while (index < source.length) {
    const char = source[index];
    if (char === "'") {
      const quoted = readQuoted(source, index);
      if (quoted) {
        index = quoted.nextIndex;
        continue;
      }
    }
    if (char === '{') {
      depth += 1;
    } else if (char === '}') {
      depth -= 1;
      if (depth === 0) {
        return index;
      }
    }
    index += 1;
  }
  return -1;
}

function rewriteArgument(argumentSource: string, context: WalkContext): string {
  const inner = argumentSource.slice(1, -1);
  const firstComma = indexOfTopLevel(inner, ',');
  if (firstComma === -1) {
    return context.argument(argumentSource);
  }
  const name = inner.slice(0, firstComma);
  const rest = inner.slice(firstComma + 1);
  const secondComma = indexOfTopLevel(rest, ',');
  const typeSegment = secondComma === -1 ? rest : rest.slice(0, secondComma);
  const type = typeSegment.trim().toLowerCase();

  if (!SUB_MESSAGE_TYPES.has(type) || secondComma === -1) {
    return context.argument(argumentSource);
  }

  context.subMessage(name.trim(), type);
  const options = rest.slice(secondComma + 1);
  return `{${name},${typeSegment},${rewriteOptions(options, context)}}`;
}

function rewriteOptions(options: string, context: WalkContext): string {
  let output = '';
  let index = 0;
  while (index < options.length) {
    const char = options[index];
    if (char === '{') {
      const end = findMatchingBrace(options, index);
      if (end === -1) {
        output += options.slice(index);
        break;
      }
      output += `{${walk(options.slice(index + 1, end), context)}}`;
      index = end + 1;
      continue;
    }
    // Option keywords, offsets and whitespace pass through untouched.
    output += char;
    index += 1;
  }
  return output;
}

function indexOfTopLevel(source: string, needle: string): number {
  let depth = 0;
  let index = 0;
  while (index < source.length) {
    const char = source[index];
    if (char === "'") {
      const quoted = readQuoted(source, index);
      if (quoted) {
        index = quoted.nextIndex;
        continue;
      }
    }
    if (char === '{') {
      depth += 1;
    } else if (char === '}') {
      depth -= 1;
    } else if (depth === 0 && char === needle) {
      return index;
    }
    index += 1;
  }
  return -1;
}

/**
 * Remove every argument from a message, keeping its literal text.
 *
 * Used as the last resort when a message cannot be formatted. Showing
 * "Publishing to accounts" is acceptable. Showing `composer.targets.count` or a
 * half interpolated string is not.
 *
 * A plural or select argument keeps the text of its `other` option, because
 * that option is the one written for the general case.
 */
export function stripArguments(message: string): string {
  return collapseWhitespace(unquote(stripRun(message, false)));
}

function stripRun(source: string, insidePlural: boolean): string {
  let output = '';
  let index = 0;
  while (index < source.length) {
    const char = source[index];
    if (char === undefined) {
      break;
    }
    if (char === "'") {
      const quoted = readQuoted(source, index);
      if (quoted) {
        output += quoted.text;
        index = quoted.nextIndex;
        continue;
      }
    }
    if (char === '{') {
      const end = findMatchingBrace(source, index);
      if (end === -1) {
        index += 1;
        continue;
      }
      output += stripArgument(source.slice(index, end + 1));
      index = end + 1;
      continue;
    }
    if (char === '#' && insidePlural) {
      index += 1;
      continue;
    }
    output += char;
    index += 1;
  }
  return output;
}

function stripArgument(argumentSource: string): string {
  const inner = argumentSource.slice(1, -1);
  const firstComma = indexOfTopLevel(inner, ',');
  if (firstComma === -1) {
    return '';
  }
  const rest = inner.slice(firstComma + 1);
  const secondComma = indexOfTopLevel(rest, ',');
  const type = (secondComma === -1 ? rest : rest.slice(0, secondComma)).trim().toLowerCase();
  if (!SUB_MESSAGE_TYPES.has(type) || secondComma === -1) {
    return '';
  }
  const other = findOptionBody(rest.slice(secondComma + 1), 'other');
  if (other === undefined) {
    return '';
  }
  return stripRun(other, type !== 'select');
}

/** The body of a named option inside a plural or select argument. */
function findOptionBody(options: string, name: string): string | undefined {
  let index = 0;
  let keyword = '';
  while (index < options.length) {
    const char = options[index];
    if (char === '{') {
      const end = findMatchingBrace(options, index);
      if (end === -1) {
        return undefined;
      }
      if (keyword.trim() === name) {
        return options.slice(index + 1, end);
      }
      keyword = '';
      index = end + 1;
      continue;
    }
    keyword += char;
    index += 1;
  }
  return undefined;
}

const APOSTROPHE_SENTINEL = '\u0000';

function unquote(source: string): string {
  return source
    .replace(/''/g, APOSTROPHE_SENTINEL)
    .replace(/'([{}#][^']*)'/g, '$1')
    .replace(/'([{}#])/g, '$1')
    .split(APOSTROPHE_SENTINEL)
    .join("'");
}

function collapseWhitespace(source: string): string {
  return source
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.:;!?])/g, '$1')
    .trim();
}

/** Every argument name used by a message, including plural and select names. */
export function collectArgumentNames(message: string): readonly string[] {
  const names = new Set<string>();
  transformIcu(message, {
    literal: (text) => text,
    argument: (source) => {
      const inner = source.slice(1, -1);
      const comma = indexOfTopLevel(inner, ',');
      const name = (comma === -1 ? inner : inner.slice(0, comma)).trim();
      if (name.length > 0) {
        names.add(name);
      }
      return source;
    },
    subMessage: (name) => {
      names.add(name);
    },
  });
  return [...names];
}
