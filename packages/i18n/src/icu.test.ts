import { describe, expect, it } from 'vitest';

import { collectArgumentNames, stripArguments, transformIcu } from './icu.js';

describe('transformIcu', () => {
  it('passes a plain message through unchanged', () => {
    expect(transformIcu('Save draft', { literal: (text) => text })).toBe('Save draft');
  });

  it('separates literal text from arguments', () => {
    const literals: string[] = [];
    transformIcu('{account} on {provider} now', {
      literal: (text) => {
        literals.push(text);
        return text;
      },
    });
    expect(literals).toEqual([' on ', ' now']);
  });

  it('descends into plural options', () => {
    const output = transformIcu('{count, plural, one {# account} other {# accounts}}', {
      literal: (text) => text.toUpperCase(),
    });
    expect(output).toBe('{count, plural, one {# ACCOUNT} other {# ACCOUNTS}}');
  });

  it('descends into select options', () => {
    const output = transformIcu('{when, select, now {right now} other {later}}', {
      literal: (text) => text.toUpperCase(),
    });
    expect(output).toBe('{when, select, now {RIGHT NOW} other {LATER}}');
  });

  it('handles nested arguments inside a plural option', () => {
    const source = '{count, plural, one {# post for {account}} other {# posts for {account}}}';
    expect(transformIcu(source, { literal: (text) => text })).toBe(source);
  });

  it('leaves formatted arguments alone', () => {
    const source = 'Published {when, date, medium}';
    expect(transformIcu(source, { literal: (text) => text })).toBe(source);
  });

  it('preserves ICU quoting', () => {
    const source = "This is a literal brace: '{not an argument}";
    expect(transformIcu(source, { literal: (text) => text })).toBe(source);
  });
});

describe('collectArgumentNames', () => {
  it('finds simple, formatted and sub message arguments', () => {
    const names = collectArgumentNames(
      '{account} published {count, plural, one {# post} other {# posts}} at {when, time, short}',
    );
    expect([...names].sort()).toEqual(['account', 'count', 'when']);
  });

  it('returns nothing for a static message', () => {
    expect(collectArgumentNames('Save draft')).toEqual([]);
  });
});

describe('stripArguments', () => {
  it('keeps the sentence and drops the placeholders', () => {
    expect(stripArguments('{account} on {provider}')).toBe('on');
    expect(stripArguments('Published {count} times to {account}')).toBe('Published times to');
  });

  it('keeps the other case of a plural and leaves no brace behind', () => {
    const output = stripArguments('{count, plural, one {# account} other {# accounts}}');
    expect(output).toBe('accounts');
    expect(output).not.toContain('{');
    expect(output).not.toContain('}');
  });

  it('keeps the other case of a select', () => {
    expect(stripArguments('{when, select, now {right now} other {later}}')).toBe('later');
  });

  it('unquotes escaped braces', () => {
    expect(stripArguments("A literal '{brace}")).toBe('A literal {brace}');
  });
});
