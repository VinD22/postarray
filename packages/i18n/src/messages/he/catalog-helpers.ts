/**
 * Hebrew is a beta catalog. The English source provides a complete fallback
 * while individual modules replace interface copy with Hebrew. ICU plurals
 * must nevertheless express Hebrew's one, two and other categories.
 */
export function withHebrewPluralForms<T extends Readonly<Record<string, string>>>(
  messages: T,
): Readonly<Record<keyof T, string>> {
  return Object.fromEntries(
    Object.entries(messages).map(([key, value]) => [
      key,
      preserveGlossaryTerms(addHebrewPluralForms(value)),
    ]),
  ) as Readonly<Record<keyof T, string>>;
}

/** Terms in this map are protected verbatim by the Relay interface glossary. */
const PROTECTED_TERM_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ['דפי פייסבוק', 'Facebook Pages'],
  ['עמוד פייסבוק', 'Facebook Pages'],
  ['וריליי', 'ו-Relay'],
  ['ממסר', 'Relay'],
  ['מלחין', 'Composer'],
  ['יועץ צמיחה', 'Growth Advisor'],
  ['מרכז פעולה', 'Action Center'],
  ['סביבת העבודה', 'Workspace'],
  ['סביבות עבודה', 'Workspace'],
  ['חללי עבודה', 'Workspace'],
  ['סביבת עבודה', 'Workspace'],
  ['לינקדאין', 'LinkedIn'],
  ['אינסטגרם', 'Instagram'],
  ['שרשורים', 'Threads'],
  ['חוטים', 'Threads'],
  ['יוטיוב', 'YouTube'],
  ['בלוסקיי', 'Bluesky'],
  ['בלוסקי', 'Bluesky'],
  ['פרויקט', 'Project'],
];

function preserveGlossaryTerms(value: string): string {
  return PROTECTED_TERM_REPLACEMENTS.reduce(
    (normalized, [translated, protectedTerm]) => normalized.replaceAll(translated, protectedTerm),
    value,
  );
}

function addHebrewPluralForms(message: string): string {
  let output = '';
  let cursor = 0;

  while (cursor < message.length) {
    if (message[cursor] !== '{') {
      output += message[cursor];
      cursor += 1;
      continue;
    }

    const end = matchingBrace(message, cursor);
    if (end === -1) {
      return message;
    }
    output += transformArgument(message.slice(cursor + 1, end));
    cursor = end + 1;
  }

  return output;
}

function transformArgument(content: string): string {
  const commas = topLevelCommas(content);
  if (commas.length < 2) {
    return `{${content}}`;
  }
  const firstComma = commas[0];
  const secondComma = commas[1];
  if (firstComma === undefined || secondComma === undefined) {
    return `{${content}}`;
  }

  const kind = content.slice(firstComma + 1, secondComma).trim();
  if (kind !== 'plural' && kind !== 'select' && kind !== 'selectordinal') {
    return `{${content}}`;
  }

  const prefix = content.slice(0, secondComma + 1);
  const options = parseOptions(content.slice(secondComma + 1));
  if (options === undefined) {
    return `{${content}}`;
  }

  const rendered = options.map(
    (option) => `${option.leading}${option.selector} {${addHebrewPluralForms(option.value)}}`,
  );
  if (kind === 'plural' && !options.some((option) => option.selector === 'two')) {
    const other = options.find((option) => option.selector === 'other');
    if (other !== undefined) {
      rendered.push(` two {${addHebrewPluralForms(other.value)}}`);
    }
  }

  return `{${prefix}${rendered.join('')}}`;
}

function matchingBrace(value: string, start: number): number {
  let depth = 0;
  for (let index = start; index < value.length; index += 1) {
    if (value[index] === '{') depth += 1;
    if (value[index] === '}') {
      depth -= 1;
      if (depth === 0) return index;
    }
  }
  return -1;
}

function topLevelCommas(value: string): number[] {
  const commas: number[] = [];
  let depth = 0;
  for (let index = 0; index < value.length; index += 1) {
    if (value[index] === '{') depth += 1;
    else if (value[index] === '}') depth -= 1;
    else if (value[index] === ',' && depth === 0) commas.push(index);
  }
  return commas;
}

interface IcuOption {
  readonly leading: string;
  readonly selector: string;
  readonly value: string;
}

function parseOptions(value: string): readonly IcuOption[] | undefined {
  const options: IcuOption[] = [];
  let cursor = 0;
  while (cursor < value.length) {
    const whitespace = value.slice(cursor).match(/^\s*/)?.[0] ?? '';
    cursor += whitespace.length;
    if (cursor >= value.length) break;
    const selector = value.slice(cursor).match(/^[^\s{]+/)?.[0];
    if (selector === undefined) return undefined;
    cursor += selector.length;
    const gap = value.slice(cursor).match(/^\s*/)?.[0] ?? '';
    cursor += gap.length;
    if (value[cursor] !== '{') return undefined;
    const end = matchingBrace(value, cursor);
    if (end === -1) return undefined;
    options.push({ leading: whitespace, selector, value: value.slice(cursor + 1, end) });
    cursor = end + 1;
  }
  return options;
}
