/**
 * A tiny, deterministic YAML emitter plus a reader for exactly the subset it
 * emits.
 *
 * Block style only. No anchors, no aliases, no tags, no flow collections, no
 * document separators. The same object always produces byte-identical output,
 * which is what the round-trip test and the source-control friendly export
 * depend on. It only needs to handle JSON-shaped values, because that is all a
 * validated plan can contain.
 */

const PLAIN_SCALAR = /^[A-Za-z_][A-Za-z0-9_ .,'()/-]*$/;
const RESERVED_PLAIN = new Set(['true', 'false', 'null', 'yes', 'no', 'on', 'off', '~', 'y', 'n']);

function quote(value: string): string {
  const escaped = value
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
  return `"${escaped}"`;
}

export function yamlScalar(value: string): string {
  if (value.length === 0) {
    return '""';
  }
  if (RESERVED_PLAIN.has(value.toLowerCase())) {
    return quote(value);
  }
  if (/^-?\d/.test(value)) {
    return quote(value);
  }
  if (!PLAIN_SCALAR.test(value)) {
    return quote(value);
  }
  if (value !== value.trim()) {
    return quote(value);
  }
  return value;
}

function emitValue(value: unknown, indent: number, lines: string[], keyPrefix: string): void {
  const pad = ' '.repeat(indent);

  if (value === null || value === undefined) {
    lines.push(`${pad}${keyPrefix}null`);
    return;
  }
  if (typeof value === 'boolean') {
    lines.push(`${pad}${keyPrefix}${String(value)}`);
    return;
  }
  if (typeof value === 'number') {
    lines.push(`${pad}${keyPrefix}${Number.isFinite(value) ? String(value) : 'null'}`);
    return;
  }
  if (typeof value === 'string') {
    lines.push(`${pad}${keyPrefix}${yamlScalar(value)}`);
    return;
  }
  if (Array.isArray(value)) {
    if (value.length === 0) {
      lines.push(`${pad}${keyPrefix}[]`);
      return;
    }
    if (keyPrefix.length > 0) {
      lines.push(`${pad}${keyPrefix.trimEnd()}`);
    }
    const itemIndent = keyPrefix.length > 0 ? indent + 2 : indent;
    for (const entry of value) {
      emitArrayItem(entry, itemIndent, lines);
    }
    return;
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).filter(
      ([, entry]) => entry !== undefined,
    );
    if (entries.length === 0) {
      lines.push(`${pad}${keyPrefix}{}`);
      return;
    }
    if (keyPrefix.length > 0) {
      lines.push(`${pad}${keyPrefix.trimEnd()}`);
    }
    const childIndent = keyPrefix.length > 0 ? indent + 2 : indent;
    for (const [key, entry] of entries) {
      emitValue(entry, childIndent, lines, `${key}: `);
    }
    return;
  }
  lines.push(`${pad}${keyPrefix}null`);
}

function emitArrayItem(value: unknown, indent: number, lines: string[]): void {
  const pad = ' '.repeat(indent);
  if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
    const entries = Object.entries(value as Record<string, unknown>).filter(
      ([, entry]) => entry !== undefined,
    );
    if (entries.length === 0) {
      lines.push(`${pad}- {}`);
      return;
    }
    const head: string[] = [];
    const first = entries[0];
    if (first === undefined) {
      lines.push(`${pad}- {}`);
      return;
    }
    emitValue(first[1], 0, head, `${first[0]}: `);
    lines.push(`${pad}- ${head[0] ?? `${first[0]}: null`}`);
    for (const extra of head.slice(1)) {
      lines.push(`${pad}  ${extra}`);
    }
    for (const [key, entry] of entries.slice(1)) {
      emitValue(entry, indent + 2, lines, `${key}: `);
    }
    return;
  }
  if (Array.isArray(value)) {
    if (value.length === 0) {
      lines.push(`${pad}- []`);
      return;
    }
    lines.push(`${pad}-`);
    for (const entry of value) {
      emitArrayItem(entry, indent + 2, lines);
    }
    return;
  }
  const scalar: string[] = [];
  emitValue(value, 0, scalar, '');
  lines.push(`${pad}- ${scalar[0] ?? 'null'}`);
}

/** Serialize a JSON-shaped value to deterministic block-style YAML. */
export function toYaml(value: unknown): string {
  const lines: string[] = [];
  emitValue(value, 0, lines, '');
  return `${lines.join('\n')}\n`;
}

/* ------------------------------------------------------------------------- */
/* Reader                                                                     */
/* ------------------------------------------------------------------------- */

interface YamlLine {
  readonly indent: number;
  readonly text: string;
}

function tokenize(input: string): YamlLine[] {
  const lines: YamlLine[] = [];
  for (const raw of input.split('\n')) {
    if (raw.trim().length === 0) {
      continue;
    }
    const indent = raw.length - raw.trimStart().length;
    lines.push({ indent, text: raw.trimStart() });
  }
  return lines;
}

function parseScalar(token: string): unknown {
  if (token === 'null' || token === '~') {
    return null;
  }
  if (token === 'true') {
    return true;
  }
  if (token === 'false') {
    return false;
  }
  if (token === '[]') {
    return [];
  }
  if (token === '{}') {
    return {};
  }
  if (token.startsWith('"')) {
    return JSON.parse(token);
  }
  if (/^-?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(token)) {
    return Number(token);
  }
  return token;
}

function splitKey(text: string): { key: string; rest: string } | null {
  const separator = text.indexOf(': ');
  if (separator > 0) {
    return { key: text.slice(0, separator), rest: text.slice(separator + 2) };
  }
  if (text.endsWith(':')) {
    return { key: text.slice(0, -1), rest: '' };
  }
  return null;
}

function parseBlock(lines: readonly YamlLine[], start: number, indent: number): [unknown, number] {
  const first = lines[start];
  if (first === undefined) {
    return [null, start];
  }
  if (first.text === '-' || first.text.startsWith('- ')) {
    const items: unknown[] = [];
    let index = start;
    while (index < lines.length) {
      const line = lines[index];
      if (
        line === undefined ||
        line.indent !== indent ||
        !(line.text === '-' || line.text.startsWith('- '))
      ) {
        break;
      }
      const content = line.text === '-' ? '' : line.text.slice(2);
      const sub: YamlLine[] = [];
      if (content.length > 0) {
        sub.push({ indent: indent + 2, text: content });
      }
      index += 1;
      while (index < lines.length) {
        const next = lines[index];
        if (next === undefined || next.indent <= indent) {
          break;
        }
        sub.push(next);
        index += 1;
      }
      const [value] = sub.length === 0 ? [null] : parseBlock(sub, 0, indent + 2);
      items.push(value);
    }
    return [items, index];
  }

  // A block that is not a sequence and not a mapping is a plain scalar. This is
  // how the content of a scalar sequence item ("- one") arrives here; without
  // this branch it fell through to the mapping case and produced an empty object.
  if (splitKey(first.text) === null) {
    return [parseScalar(first.text), start + 1];
  }

  const map: Record<string, unknown> = {};
  let index = start;
  while (index < lines.length) {
    const line = lines[index];
    if (line === undefined || line.indent !== indent) {
      break;
    }
    const split = splitKey(line.text);
    if (split === null) {
      break;
    }
    if (split.rest.length > 0) {
      map[split.key] = parseScalar(split.rest);
      index += 1;
      continue;
    }
    const next = lines[index + 1];
    if (next === undefined || next.indent <= indent) {
      map[split.key] = null;
      index += 1;
      continue;
    }
    const [value, consumed] = parseBlock(lines, index + 1, next.indent);
    map[split.key] = value;
    index = consumed;
  }
  return [map, index];
}

/** Read back YAML produced by `toYaml`. Not a general purpose YAML parser. */
export function fromYaml(input: string): unknown {
  const lines = tokenize(input);
  if (lines.length === 0) {
    return null;
  }
  const [value] = parseBlock(lines, 0, lines[0]?.indent ?? 0);
  return value;
}
