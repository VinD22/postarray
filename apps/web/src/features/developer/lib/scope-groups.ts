/**
 * Scopes grouped by what accepting them actually costs the user.
 *
 * The registry in `@relay/contracts` already carries a risk level per scope,
 * and the consent screen shows those levels as separate groups. This is the
 * mechanism that makes a vague "full access" impossible: `billing:read` and
 * `connections:admin` are named scopes with their own rows, so they cannot be
 * folded into a bundle the user did not read.
 */

import { ALL_SCOPES, SCOPES, type Scope, type ScopeRisk } from '@relay/contracts';

export interface ScopeGroup {
  readonly risk: ScopeRisk;
  readonly titleKey: string;
  readonly helpKey: string;
  readonly scopes: readonly Scope[];
}

const GROUP_ORDER: readonly ScopeRisk[] = ['read', 'reversible', 'consequential'];

const TITLE_KEYS: Readonly<Record<ScopeRisk, string>> = {
  read: 'developer.ui.apps.scopeGroup.read',
  reversible: 'developer.ui.apps.scopeGroup.reversible',
  consequential: 'developer.ui.apps.scopeGroup.consequential',
};

const HELP_KEYS: Readonly<Record<ScopeRisk, string>> = {
  read: 'developer.ui.apps.scopeGroupHelp.read',
  reversible: 'developer.ui.apps.scopeGroupHelp.reversible',
  consequential: 'developer.ui.apps.scopeGroupHelp.consequential',
};

/** Every scope, grouped. Read first, consequential last, registry order within. */
export function scopeGroups(scopes: readonly Scope[] = ALL_SCOPES): readonly ScopeGroup[] {
  return GROUP_ORDER.map((risk) => ({
    risk,
    titleKey: TITLE_KEYS[risk],
    helpKey: HELP_KEYS[risk],
    scopes: scopes.filter((scope) => SCOPES[scope].risk === risk),
  })).filter((group) => group.scopes.length > 0);
}

/**
 * The catalog key describing one scope in plain language.
 *
 * `@relay/contracts` names a key per scope for the API and the CLI. The web
 * catalog carries its own sentence for the same scope because the consent
 * screen is read by an end user rather than by a developer, and the two
 * audiences need different words for the same permission.
 */
export function scopeDescriptionKey(scope: Scope): string {
  return `developer.ui.scope.${scope.replace(':', '_')}`;
}

/** Scopes the app did not ask for, so the consent screen can list them too. */
export function withheldScopes(requested: readonly Scope[]): readonly Scope[] {
  return ALL_SCOPES.filter((scope) => !requested.includes(scope));
}
