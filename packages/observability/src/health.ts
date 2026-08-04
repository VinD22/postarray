import {
  CONNECTOR_KEYS,
  SUBSYSTEM_NAMES,
  capabilityLevel,
  capabilityReason,
  missingEnvVars,
  redactString,
  type CapabilityLevel,
  type CapabilityStatus,
  type RuntimeCapabilities,
} from '@relay/config';

/**
 * The health report.
 *
 * This is what `/health` returns and what the public status page renders. It
 * distinguishes live, degraded and disabled, and it never contains a config
 * value: only capability names, levels, reasons and the variables an operator
 * still has to set.
 */

export type HealthStatus = 'ok' | 'degraded' | 'down';

export type CheckStatus = 'pass' | 'warn' | 'fail';

export interface HealthCheck {
  /** Stable machine name, for example "database.query" or "temporal.ping". */
  readonly name: string;
  readonly status: CheckStatus;
  readonly latencyMs?: number;
  /** Short operator facing note. Redacted before it is included. */
  readonly detail?: string;
  readonly observedAt?: string;
}

export interface HealthComponent {
  readonly name: string;
  readonly level: CapabilityLevel;
  readonly reason: string | undefined;
  readonly requiredEnvVars: readonly string[];
}

export interface HealthSummary {
  readonly live: number;
  readonly degraded: number;
  readonly disabled: number;
  readonly failingChecks: number;
}

export interface HealthReport {
  readonly status: HealthStatus;
  readonly service: string | undefined;
  readonly version: string | undefined;
  readonly checkedAt: string;
  readonly uptimeSeconds: number | undefined;
  readonly subsystems: readonly HealthComponent[];
  readonly connectors: readonly HealthComponent[];
  readonly checks: readonly HealthCheck[];
  readonly summary: HealthSummary;
}

export interface HealthReportOptions {
  readonly service?: string;
  readonly version?: string;
  /** Epoch milliseconds when the process started. */
  readonly startedAt?: number;
  /** Injectable clock, so the report is testable. */
  readonly now?: () => Date;
  /**
   * Subsystems whose absence means the surface cannot serve requests at all.
   * Defaults to the data plane: the database and the token vault.
   */
  readonly criticalSubsystems?: readonly string[];
}

const DEFAULT_CRITICAL: readonly string[] = ['database', 'encryption'];
const MAX_DETAIL = 200;

function toComponent(name: string, status: CapabilityStatus): HealthComponent {
  return {
    name,
    level: capabilityLevel(status),
    reason: capabilityReason(status),
    requiredEnvVars: missingEnvVars(status),
  };
}

function sanitizeCheck(check: HealthCheck): HealthCheck {
  const sanitized: {
    name: string;
    status: CheckStatus;
    latencyMs?: number;
    detail?: string;
    observedAt?: string;
  } = {
    name: check.name,
    status: check.status,
  };
  if (typeof check.latencyMs === 'number' && Number.isFinite(check.latencyMs)) {
    sanitized.latencyMs = Math.round(check.latencyMs);
  }
  if (check.detail !== undefined) {
    sanitized.detail = redactString(check.detail).slice(0, MAX_DETAIL);
  }
  if (check.observedAt !== undefined) sanitized.observedAt = check.observedAt;
  return sanitized;
}

/**
 * Build the health document.
 *
 * `down` means a critical subsystem is disabled or a check failed. `degraded`
 * means the surface works through a substitute or with a feature switched off.
 * Everything else is `ok`.
 */
export function buildHealthReport(
  capabilities: RuntimeCapabilities,
  checks: readonly HealthCheck[] = [],
  options: HealthReportOptions = {},
): HealthReport {
  const now = (options.now ?? (() => new Date()))();
  const critical = new Set(options.criticalSubsystems ?? DEFAULT_CRITICAL);

  const subsystems = SUBSYSTEM_NAMES.map((name) => toComponent(name, capabilities[name]));
  const connectors = CONNECTOR_KEYS.map((key) =>
    toComponent(key, capabilities.connectors[key]),
  );
  const sanitizedChecks = checks.map(sanitizeCheck);

  const components = [...subsystems, ...connectors];
  const summary: HealthSummary = {
    live: components.filter((component) => component.level === 'live').length,
    degraded: components.filter((component) => component.level === 'degraded').length,
    disabled: components.filter((component) => component.level === 'disabled').length,
    failingChecks: sanitizedChecks.filter((check) => check.status === 'fail').length,
  };

  const criticalDown = subsystems.some(
    (component) => critical.has(component.name) && component.level === 'disabled',
  );
  const anyWarning =
    sanitizedChecks.some((check) => check.status === 'warn') ||
    summary.degraded > 0 ||
    summary.disabled > 0;

  const status: HealthStatus = criticalDown || summary.failingChecks > 0
    ? 'down'
    : anyWarning
      ? 'degraded'
      : 'ok';

  return {
    status,
    service: options.service,
    version: options.version,
    checkedAt: now.toISOString(),
    uptimeSeconds:
      options.startedAt === undefined
        ? undefined
        : Math.max(0, Math.round((now.getTime() - options.startedAt) / 1000)),
    subsystems,
    connectors,
    checks: sanitizedChecks,
    summary,
  };
}

/** The HTTP status code a `/health` endpoint should answer with. */
export function healthHttpStatus(report: HealthReport): number {
  return report.status === 'down' ? 503 : 200;
}
