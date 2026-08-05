import { describe, expect, it } from 'vitest';

import { composerReducer } from './composer-reducer.js';
import { commitGlobalEdit, planGlobalEdit } from './global-edit.js';
import { initialComposerState, SEED_ACCOUNTS, SEED_BOOTSTRAP } from './seed.js';
import { readCounter } from './capability-rules.js';

const X = 'conn_seed_x_acme';
const LINKEDIN = 'conn_seed_li_acme';

function stateWithBothTargets() {
  return initialComposerState(SEED_BOOTSTRAP);
}

describe('global edit', () => {
  it('names the targets that cannot take a change instead of dropping it', () => {
    const body = 'A'.repeat(900);
    const plan = planGlobalEdit({
      state: stateWithBothTargets(),
      accounts: SEED_ACCOUNTS,
      field: 'body',
      body,
    });

    expect(plan.appliesTo).toEqual([LINKEDIN]);
    expect(plan.incompatible.map((entry) => entry.connectionId)).toEqual([X]);
    expect(plan.incompatible[0]?.reasons[0]?.code).toBe('text_too_long');
    expect(plan.incompatible[0]?.reasons[0]?.params).toMatchObject({ limit: 280, actual: 900 });
  });

  it('offers an adapted value that actually fits the incompatible target', () => {
    const body = `${'word '.repeat(120)}end.`;
    const plan = planGlobalEdit({
      state: stateWithBothTargets(),
      accounts: SEED_ACCOUNTS,
      field: 'body',
      body,
    });
    const adapted = plan.incompatible[0]?.adaptedBody ?? '';
    const x = SEED_ACCOUNTS.find((account) => account.connectionId === X);

    expect(x).toBeDefined();
    expect(adapted.length).toBeGreaterThan(0);
    if (x === undefined) {
      throw new Error('expected the X seed account');
    }
    expect(readCounter(adapted, x.capabilities).level).not.toBe('over');
  });

  it('leaves a target that already has its own version alone', () => {
    let state = stateWithBothTargets();
    state = composerReducer(state, {
      type: 'variant/override',
      connectionId: LINKEDIN,
      field: 'body',
      value: 'LinkedIn wrote its own.',
    });

    const plan = planGlobalEdit({
      state,
      accounts: SEED_ACCOUNTS,
      field: 'body',
      body: 'Short enough for everyone.',
    });

    expect(plan.keepsOverride).toEqual([LINKEDIN]);
    expect(plan.appliesTo).toEqual([X]);
  });

  it('commits the master change plus one explicit override per adapted target', () => {
    const body = 'B'.repeat(500);
    const input = {
      state: stateWithBothTargets(),
      accounts: SEED_ACCOUNTS,
      field: 'body' as const,
      body,
    };
    const plan = planGlobalEdit(input);
    const actions = commitGlobalEdit(plan, input);

    let state = input.state;
    for (const action of actions) {
      state = composerReducer(state, action);
    }

    expect(state.master.body).toBe(body);
    expect(state.overrides[LINKEDIN] ?? {}).toEqual({});
    expect(state.overrides[X]?.body).toBeDefined();
    expect(state.overrides[X]?.body).not.toBe(body);
  });

  it('reports when nothing would change', () => {
    const plan = planGlobalEdit({
      state: stateWithBothTargets(),
      accounts: SEED_ACCOUNTS,
      field: 'body',
      body: SEED_BOOTSTRAP.master.body,
    });
    expect(plan.noChange).toBe(true);
  });
});
