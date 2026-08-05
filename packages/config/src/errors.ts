import type { EnvKey } from './schema';

/**
 * Configuration errors happen before the i18n runtime and the logger exist, so
 * their messages are operator facing and English by construction. They are
 * never rendered to an end user: the admin panel renders `RuntimeCapabilities`.
 *
 * No error in this module ever carries a variable's value, only its key.
 */

export type ConfigIssueKind = 'missing' | 'invalid' | 'missing_one_of';

export interface ConfigIssue {
  readonly kind: ConfigIssueKind;
  /** The variables this issue is about. `missing_one_of` names several. */
  readonly keys: readonly EnvKey[];
  /** Operator facing explanation. Never contains a value. */
  readonly detail: string;
}

export const ENV_FILE_HINT = '.env (copy .env.example and fill it in)';

function describeIssue(issue: ConfigIssue): string {
  const keys = issue.keys.join(' or ');
  return `  - ${keys}: ${issue.detail}`;
}

export class ConfigValidationError extends Error {
  readonly code = 'config_invalid';
  readonly issues: readonly ConfigIssue[];
  readonly service: string | undefined;
  readonly envFile = ENV_FILE_HINT;

  constructor(issues: readonly ConfigIssue[], service?: string) {
    const scope = service === undefined ? 'Relay' : `Relay ${service}`;
    const lines = [
      `${scope} cannot start: ${issues.length} environment ${
        issues.length === 1 ? 'variable is' : 'variables are'
      } missing or invalid.`,
      ...issues.map(describeIssue),
      `Fix them in ${ENV_FILE_HINT}. Values are never printed, only key names.`,
    ];
    super(lines.join('\n'));
    this.name = 'ConfigValidationError';
    this.issues = issues;
    this.service = service;
  }

  /** Every key mentioned by any issue, de-duplicated and stable ordered. */
  get keys(): readonly EnvKey[] {
    const seen = new Set<EnvKey>();
    for (const issue of this.issues) {
      for (const key of issue.keys) seen.add(key);
    }
    return [...seen];
  }
}

export class CapabilityUnavailableError extends Error {
  readonly code = 'capability_unavailable';
  readonly capability: string;
  readonly level: 'degraded' | 'disabled';
  readonly reason: string;
  readonly requiredEnvVars: readonly string[];

  constructor(input: {
    capability: string;
    level: 'degraded' | 'disabled';
    reason: string;
    requiredEnvVars: readonly string[];
  }) {
    const remedy =
      input.requiredEnvVars.length > 0
        ? ` Set ${input.requiredEnvVars.join(', ')} in ${ENV_FILE_HINT}.`
        : '';
    super(`Capability "${input.capability}" is ${input.level}: ${input.reason}.${remedy}`);
    this.name = 'CapabilityUnavailableError';
    this.capability = input.capability;
    this.level = input.level;
    this.reason = input.reason;
    this.requiredEnvVars = input.requiredEnvVars;
  }
}
