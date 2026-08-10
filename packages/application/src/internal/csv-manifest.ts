import {
  BULK_IMPORT_OPTIONAL_COLUMNS,
  BULK_IMPORT_REQUIRED_COLUMNS,
  CSV_MANIFEST_PARSER_VERSION,
  ID_PREFIXES,
  bulkImportRowPayloadSchema,
  checksumSchema,
  ianaTimeZoneSchema,
  isId,
  localDateTimeSchema,
  parsePerPlatformColumn,
  providerIdSchema,
  webUrlSchema,
  type BulkImportIssue,
  type BulkImportMediaRef,
  type BulkImportOptions,
  type BulkImportRowPayload,
  type BulkImportColumnReport,
} from '@relay/contracts';

import { resolveWallClock } from './zone-time';

/**
 * The CSV manifest parser.
 *
 * Pure: text in, records out. No clock of its own, no database, no storage, no
 * network. Everything it decides is a function of its arguments, which is what
 * lets the edge cases that actually bite (a byte order mark from Excel, a
 * caption with a comma, a caption with a newline, a zone nobody has heard of,
 * a time that already passed, the same row id written twice) be tested as
 * ordinary unit tests rather than through an upload.
 *
 * It validates with the contract schemas the composer already uses. It does not
 * restate them: a second copy of "how long may a caption be" is a second answer
 * waiting to disagree with the first.
 */

const MAX_ROWS = 5_000;
const CELL_SEPARATOR = ',';
const TARGET_SEPARATOR = '|';

export interface CsvManifestRow {
  readonly externalRowKey: string;
  /** 1-based physical line the record starts on. The header is line 1. */
  readonly lineNumber: number;
  readonly payload: BulkImportRowPayload | null;
  readonly issues: readonly BulkImportIssue[];
}

export interface CsvManifest {
  readonly parserVersion: string;
  readonly columns: BulkImportColumnReport;
  readonly rows: readonly CsvManifestRow[];
  /** Problems with the file as a whole rather than with one row. */
  readonly issues: readonly BulkImportIssue[];
}

export interface CsvManifestOptions {
  readonly now: Date;
  readonly options: BulkImportOptions;
}

function issue(
  key: string,
  column: string | null,
  values: Readonly<Record<string, string | number | boolean>> = {},
): BulkImportIssue {
  return { key, column, values };
}

/** Bounded so a hostile cell cannot push a novel into an error message. */
function short(value: string): string {
  return value.length <= 80 ? value : `${value.slice(0, 79)}…`;
}

interface RawRecord {
  readonly cells: readonly string[];
  readonly lineNumber: number;
}

/**
 * RFC 4180 reader.
 *
 * A quoted field may contain the separator, a doubled quote, CR, LF or CRLF. A
 * leading byte order mark is dropped: Excel writes one, and a header that
 * silently begins with U+FEFF is the single most common reason a correct file
 * is reported as missing every column.
 */
export function readDelimitedText(text: string): readonly RawRecord[] {
  const source = text.startsWith('\ufeff') ? text.slice(1) : text;
  const records: RawRecord[] = [];
  let cells: string[] = [];
  let cell = '';
  let quoted = false;
  let line = 1;
  let recordLine = 1;
  let touched = false;

  const endCell = (): void => {
    cells.push(cell);
    cell = '';
  };
  const endRecord = (): void => {
    endCell();
    if (touched) {
      records.push({ cells, lineNumber: recordLine });
    }
    cells = [];
    touched = false;
    recordLine = line;
  };

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index] ?? '';
    if (quoted) {
      if (character === '"') {
        if (source[index + 1] === '"') {
          cell += '"';
          index += 1;
        } else {
          quoted = false;
        }
      } else {
        if (character === '\n') line += 1;
        cell += character;
      }
      continue;
    }
    if (character === '"' && cell === '') {
      quoted = true;
      touched = true;
      continue;
    }
    if (character === CELL_SEPARATOR) {
      touched = true;
      endCell();
      continue;
    }
    if (character === '\r' || character === '\n') {
      if (character === '\r' && source[index + 1] === '\n') index += 1;
      line += 1;
      endRecord();
      continue;
    }
    touched = true;
    cell += character;
  }
  if (touched || cell !== '' || cells.length > 0) {
    endRecord();
  }
  return records;
}

function headerReport(headers: readonly string[]): BulkImportColumnReport {
  const present = headers.map((header) => header.trim().toLowerCase());
  const known = new Set<string>([...BULK_IMPORT_REQUIRED_COLUMNS, ...BULK_IMPORT_OPTIONAL_COLUMNS]);
  return {
    present,
    missingRequired: BULK_IMPORT_REQUIRED_COLUMNS.filter((column) => !present.includes(column)),
    unrecognized: present.filter(
      (header) => !known.has(header) && parsePerPlatformColumn(header) === null,
    ),
  };
}

function cellsByHeader(
  headers: readonly string[],
  record: RawRecord,
): Readonly<Record<string, string>> {
  const values: Record<string, string> = {};
  headers.forEach((header, index) => {
    values[header] = (record.cells[index] ?? '').trim();
  });
  return values;
}

function parseTargets(
  raw: string,
  problems: BulkImportIssue[],
): { setId: string | null; connectionIds: string[] } {
  if (raw.startsWith('set:')) {
    const setId = raw.slice(4).trim();
    if (!isId(ID_PREFIXES.set, setId)) {
      problems.push(issue('import.error.invalidTargets', 'targets', { value: short(raw) }));
    }
    return { setId: isId(ID_PREFIXES.set, setId) ? setId : null, connectionIds: [] };
  }
  const connectionIds = raw
    .split(TARGET_SEPARATOR)
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
  const bad = connectionIds.filter((entry) => !isId(ID_PREFIXES.connection, entry));
  for (const entry of bad) {
    problems.push(issue('import.error.invalidTargets', 'targets', { value: short(entry) }));
  }
  return { setId: null, connectionIds: bad.length === 0 ? connectionIds : [] };
}

/**
 * A media cell names media the workspace already has, by id or by checksum, or
 * an http(s) address the server imports through its own guarded path. It never
 * names a file on a disk, because nothing in this system can read one.
 */
function parseMedia(raw: string, problems: BulkImportIssue[]): BulkImportMediaRef[] {
  const refs: BulkImportMediaRef[] = [];
  for (const entry of raw.split(TARGET_SEPARATOR).map((part) => part.trim())) {
    if (entry === '') continue;
    // `isId` is a type predicate over `unknown`, so testing it directly in an
    // if/else narrows the negative branch to `never`. Reading it as a plain
    // boolean keeps the remaining branches about strings, which they are.
    const isMediaId: boolean = isId(ID_PREFIXES.media, entry);
    if (isMediaId) {
      refs.push({ kind: 'id', value: entry });
    } else if (entry.startsWith('sha256:') && checksumSchema.safeParse(entry.slice(7)).success) {
      refs.push({ kind: 'checksum', value: entry.slice(7) });
    } else if (webUrlSchema.safeParse(entry).success) {
      refs.push({ kind: 'url', value: entry });
    } else {
      problems.push(issue('import.error.invalidMedia', 'media', { value: short(entry) }));
    }
  }
  return refs;
}

function parseVariants(
  headers: readonly string[],
  values: Readonly<Record<string, string>>,
): BulkImportRowPayload['variants'] {
  const byProvider = new Map<string, { body: string | null; title: string | null }>();
  for (const header of headers) {
    const parsed = parsePerPlatformColumn(header);
    const raw = values[header] ?? '';
    if (parsed === null || raw === '') continue;
    const current = byProvider.get(parsed.provider) ?? { body: null, title: null };
    byProvider.set(parsed.provider, { ...current, [parsed.field]: raw });
  }
  return [...byProvider.entries()].map(([provider, override]) => ({
    provider: providerIdSchema.parse(provider),
    body: override.body,
    title: override.title,
  }));
}

/**
 * Resolve the wall clock the person wrote, in the zone they named, to an
 * instant. A local time with no zone is never accepted as an instant; the zone
 * either comes from the row or from an explicit option, and otherwise the row
 * is invalid.
 */
function resolveSchedule(
  local: string,
  zone: string,
  problems: BulkImportIssue[],
): string | null {
  const [datePart = '', timePart = ''] = local.split('T');
  const [year, month, day] = datePart.split('-').map((part) => Number.parseInt(part, 10));
  const [hour, minute] = timePart.split(':').map((part) => Number.parseInt(part, 10));
  if (
    year === undefined ||
    month === undefined ||
    day === undefined ||
    hour === undefined ||
    minute === undefined
  ) {
    problems.push(issue('import.error.invalidLocalTime', 'scheduled_local_time', { value: local }));
    return null;
  }
  const resolved = resolveWallClock({ year, month, day, minuteOfDay: hour * 60 + minute }, zone);
  if (resolved.kind === 'nonexistent') {
    problems.push(
      issue('import.error.nonexistentLocalTime', 'scheduled_local_time', { value: local, zone }),
    );
    return null;
  }
  if (resolved.kind === 'ambiguous') {
    problems.push(
      issue('import.error.ambiguousLocalTime', 'scheduled_local_time', { value: local, zone }),
    );
  }
  return resolved.instant.toISOString();
}

function normalizeRow(
  headers: readonly string[],
  record: RawRecord,
  context: CsvManifestOptions,
): { payload: BulkImportRowPayload | null; issues: BulkImportIssue[] } {
  const problems: BulkImportIssue[] = [];
  if (record.cells.length !== headers.length) {
    problems.push(
      issue('import.error.rowShape', null, {
        expected: headers.length,
        actual: record.cells.length,
      }),
    );
  }
  const values = cellsByHeader(headers, record);
  const required = (column: string): string => {
    const value = values[column] ?? '';
    if (value === '') {
      problems.push(issue('import.error.required', column, {}));
    }
    return value;
  };

  const projectRef = required('project');
  const body = required('caption');
  const local = required('scheduled_local_time');
  const targetsRaw = required('targets');
  const mediaRaw = values['media'] ?? '';
  const zoneRaw = values['time_zone'] ?? context.options.defaultTimeZone ?? '';

  if (local !== '' && !localDateTimeSchema.safeParse(local).success) {
    problems.push(issue('import.error.invalidLocalTime', 'scheduled_local_time', { value: local }));
  }
  const zone = ianaTimeZoneSchema.safeParse(zoneRaw);
  if (!zone.success) {
    problems.push(issue('import.error.invalidTimeZone', 'time_zone', { value: short(zoneRaw) }));
  }

  const targets = targetsRaw === '' ? { setId: null, connectionIds: [] } : parseTargets(targetsRaw, problems);
  if (targets.setId === null && targets.connectionIds.length === 0 && targetsRaw !== '') {
    problems.push(issue('import.error.invalidTargets', 'targets', { value: short(targetsRaw) }));
  }
  const media = parseMedia(mediaRaw, problems);
  if (media.length === 0) {
    problems.push(issue('import.error.required', 'media', {}));
  }

  const instant =
    zone.success && localDateTimeSchema.safeParse(local).success
      ? resolveSchedule(local, zone.data, problems)
      : null;
  if (
    instant !== null &&
    !context.options.allowPastSchedules &&
    Date.parse(instant) < context.now.getTime()
  ) {
    problems.push(
      issue('import.error.scheduleInPast', 'scheduled_local_time', {
        value: local,
        zone: zone.success ? zone.data : '',
      }),
    );
  }

  const optional = (column: string): string | null => {
    const value = values[column] ?? '';
    return value === '' ? null : value;
  };

  const candidate = {
    projectRef,
    targets,
    body,
    title: optional('title'),
    variants: parseVariants(headers, values),
    scheduledLocalTime: local,
    ianaTimeZone: zone.success ? zone.data : '',
    scheduledInstant: instant ?? '',
    media,
    destination: optional('destination'),
    privacyValue: optional('privacy'),
    firstComment: optional('first_comment'),
    approvalPolicy: optional('approval_policy'),
  };
  const parsed = bulkImportRowPayloadSchema.safeParse(candidate);
  if (!parsed.success) {
    for (const detail of parsed.error.issues) {
      const column = typeof detail.path[0] === 'string' ? detail.path[0] : null;
      if (!problems.some((existing) => existing.column === column)) {
        problems.push(issue('import.error.invalidCell', column, {}));
      }
    }
    return { payload: null, issues: problems };
  }
  return { payload: problems.length === 0 ? parsed.data : null, issues: problems };
}

/** Parse a whole manifest. Every row is independent of every other row. */
export function parseCsvManifest(text: string, context: CsvManifestOptions): CsvManifest {
  const records = readDelimitedText(text);
  const header = records[0];
  if (header === undefined) {
    return {
      parserVersion: CSV_MANIFEST_PARSER_VERSION,
      columns: { present: [], missingRequired: [...BULK_IMPORT_REQUIRED_COLUMNS], unrecognized: [] },
      rows: [],
      issues: [issue('import.error.emptyFile', null, {})],
    };
  }
  const columns = headerReport(header.cells);
  const manifestIssues: BulkImportIssue[] = [
    ...columns.missingRequired.map((column) =>
      issue('import.error.missingColumn', column, { column }),
    ),
    ...columns.unrecognized.map((column) => issue('import.error.unknownColumn', column, { column })),
  ];

  const body = records.slice(1);
  if (body.length > MAX_ROWS) {
    manifestIssues.push(issue('import.error.tooManyRows', null, { limit: MAX_ROWS }));
  }
  if (columns.missingRequired.length > 0) {
    return {
      parserVersion: CSV_MANIFEST_PARSER_VERSION,
      columns,
      rows: [],
      issues: manifestIssues,
    };
  }

  const seen = new Set<string>();
  const rows: CsvManifestRow[] = [];
  for (const record of body.slice(0, MAX_ROWS)) {
    const values = cellsByHeader(columns.present, record);
    const externalRowKey = (values['external_row_id'] ?? '').trim();
    if (externalRowKey === '') {
      rows.push({
        externalRowKey: `line_${record.lineNumber}`,
        lineNumber: record.lineNumber,
        payload: null,
        issues: [issue('import.error.required', 'external_row_id', {})],
      });
      continue;
    }
    if (seen.has(externalRowKey)) {
      rows.push({
        externalRowKey: `${externalRowKey}#line_${record.lineNumber}`,
        lineNumber: record.lineNumber,
        payload: null,
        issues: [
          issue('import.error.duplicateRowId', 'external_row_id', { value: short(externalRowKey) }),
        ],
      });
      continue;
    }
    seen.add(externalRowKey);
    const normalized = normalizeRow(columns.present, record, context);
    rows.push({
      externalRowKey,
      lineNumber: record.lineNumber,
      payload: normalized.payload,
      issues: normalized.issues,
    });
  }

  return { parserVersion: CSV_MANIFEST_PARSER_VERSION, columns, rows, issues: manifestIssues };
}
