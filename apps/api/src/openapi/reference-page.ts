/**
 * A self-contained API reference page.
 *
 * Rendered server side from the same document `/openapi.json` returns, with no
 * external request of any kind, so the API origin keeps a strict content
 * security policy. Everything inline is nonce-tagged.
 *
 * It is deliberately plain. This page exists so a developer can see the route
 * list, the scopes and the required headers without leaving the terminal they
 * are already in. The rich reading experience belongs in the documentation
 * site, which consumes the same specification.
 */

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

interface OperationRow {
  readonly method: string;
  readonly path: string;
  readonly summary: string;
  readonly scopes: readonly string[];
  readonly idempotent: boolean;
  readonly stepUp: boolean;
}

function collectRows(document: Record<string, unknown>): Map<string, OperationRow[]> {
  const grouped = new Map<string, OperationRow[]>();
  const paths = document['paths'];
  if (typeof paths !== 'object' || paths === null) {
    return grouped;
  }
  for (const [path, methods] of Object.entries(paths as Record<string, unknown>)) {
    if (typeof methods !== 'object' || methods === null) {
      continue;
    }
    for (const [method, raw] of Object.entries(methods as Record<string, unknown>)) {
      if (typeof raw !== 'object' || raw === null) {
        continue;
      }
      const operation = raw as Record<string, unknown>;
      const tags = Array.isArray(operation['tags']) ? (operation['tags'] as string[]) : ['other'];
      const tag = tags[0] ?? 'other';
      const security = Array.isArray(operation['security'])
        ? (operation['security'] as Record<string, string[]>[])
        : [];
      const scopes = security.flatMap((entry) => entry['bearerToken'] ?? []);
      const parameters = Array.isArray(operation['parameters'])
        ? (operation['parameters'] as Record<string, unknown>[])
        : [];
      const rows = grouped.get(tag) ?? [];
      rows.push({
        method: method.toUpperCase(),
        path,
        summary: typeof operation['summary'] === 'string' ? operation['summary'] : '',
        scopes,
        idempotent: parameters.some(
          (parameter) => parameter['name'] === 'idempotency-key' && parameter['required'] === true,
        ),
        stepUp: operation['x-relay-step-up'] === true,
      });
      grouped.set(tag, rows);
    }
  }
  return grouped;
}

const STYLES = `
:root { color-scheme: light dark; --ink: #1c1a17; --muted: #6b645c; --line: #e3ded6; --bg: #faf8f5; --accent: #7a4a2b; }
@media (prefers-color-scheme: dark) { :root { --ink: #eee9e2; --muted: #a49b90; --line: #322e29; --bg: #16140f; --accent: #d99a6c; } }
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--ink); font: 15px/1.55 ui-sans-serif, system-ui, sans-serif; }
main { max-width: 60rem; margin-inline: auto; padding-inline: 1.5rem; padding-block: 3rem; }
h1 { font-size: 1.6rem; margin-block-end: 0.25rem; font-weight: 620; letter-spacing: -0.01em; }
p.lede { color: var(--muted); margin-block: 0 2.5rem; max-width: 46rem; }
h2 { font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.09em; color: var(--muted); margin-block: 2.5rem 0.75rem; font-weight: 600; }
table { width: 100%; border-collapse: collapse; }
td, th { text-align: start; padding-block: 0.55rem; border-block-end: 1px solid var(--line); vertical-align: baseline; }
th { font-weight: 600; font-size: 0.78rem; color: var(--muted); }
td.method { font-family: ui-monospace, monospace; font-size: 0.78rem; color: var(--accent); white-space: nowrap; padding-inline-end: 0.75rem; }
td.path { font-family: ui-monospace, monospace; font-size: 0.82rem; padding-inline-end: 1rem; }
td.summary { color: var(--muted); }
.tags { display: flex; gap: 0.3rem; flex-wrap: wrap; margin-block-start: 0.25rem; }
.tag { font-size: 0.68rem; border: 1px solid var(--line); border-radius: 6px; padding: 0.05rem 0.35rem; color: var(--muted); }
a { color: var(--accent); }
.scroll { overflow-x: auto; }
`;

/** Render the page. `nonce` tags the inline style so the CSP stays strict. */
export function renderReference(document: Record<string, unknown>, nonce: string): string {
  const info = (document['info'] ?? {}) as Record<string, unknown>;
  const grouped = collectRows(document);
  const sections = [...grouped.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([tag, rows]) => {
      const body = rows
        .sort((left, right) => left.path.localeCompare(right.path))
        .map((row) => {
          const badges = [
            ...row.scopes.map((scope) => `<span class="tag">${escapeHtml(scope)}</span>`),
            row.idempotent ? '<span class="tag">idempotency-key</span>' : '',
            row.stepUp ? '<span class="tag">step-up</span>' : '',
          ]
            .filter((badge) => badge.length > 0)
            .join('');
          return `<tr><td class="method">${escapeHtml(row.method)}</td><td class="path">${escapeHtml(
            row.path,
          )}${badges.length > 0 ? `<div class="tags">${badges}</div>` : ''}</td><td class="summary">${escapeHtml(
            row.summary,
          )}</td></tr>`;
        })
        .join('');
      return `<h2>${escapeHtml(tag)}</h2><div class="scroll"><table><thead><tr><th>Method</th><th>Path</th><th>Summary</th></tr></thead><tbody>${body}</tbody></table></div>`;
    })
    .join('');

  return `<!doctype html>
<html lang="en" dir="ltr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${escapeHtml(String(info['title'] ?? 'Relay API'))}</title>
<style nonce="${escapeHtml(nonce)}">${STYLES}</style>
</head>
<body>
<main>
<h1>${escapeHtml(String(info['title'] ?? 'Relay API'))} <span class="tag">${escapeHtml(
    String(info['version'] ?? ''),
  )}</span></h1>
<p class="lede">${escapeHtml(String(info['description'] ?? ''))} The machine readable document is at <a href="/openapi.json">/openapi.json</a>.</p>
${sections}
</main>
</body>
</html>`;
}
