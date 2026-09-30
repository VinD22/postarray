import type { ProblemJson } from '@relay/contracts';
import { createTranslator, en } from '@relay/i18n';

/**
 * The few strings this server shows people, resolved from the English catalog.
 *
 * MCP clients render tool titles in their own UI (Claude shows them in the
 * approval prompt) and show a tool error's text to the person, so both are
 * product copy and come from `@relay/i18n` like every other user-visible
 * string. The server does not know the person's language at `tools/list`
 * time, and V1 ships English, so this is the English catalog.
 */

const translator = createTranslator('en', en);
const catalogKeys = new Set(Object.keys(en));

/** The human title for a tool, or its name when the catalog has none. */
export function toolTitle(toolName: string): string {
  const key = `developer.connect.tool.${toolName}`;
  return catalogKeys.has(key) ? translator.format(key) : toolName;
}

type Primitive = string | number | boolean;

function primitiveValues(
  detail: Readonly<Record<string, unknown>> | undefined,
): Record<string, Primitive> {
  const values: Record<string, Primitive> = {};
  for (const [name, value] of Object.entries(detail ?? {})) {
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      values[name] = value;
    }
  }
  return values;
}

/**
 * A plain English sentence for a problem document, from its `messageKey`.
 * Falls back to the problem title when the key is unknown or its arguments
 * are not in the detail, so a tool error always carries readable text.
 */
export function problemMessage(problem: ProblemJson): string {
  if (!catalogKeys.has(problem.messageKey)) {
    return problem.title;
  }
  try {
    const message = translator.format(problem.messageKey, primitiveValues(problem.detail));
    return message.length > 0 && !message.includes('{') ? message : problem.title;
  } catch {
    return problem.title;
  }
}
