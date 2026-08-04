import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Field } from './field.js';
import { Input } from './input.js';

// Test fixtures only. Product copy lives in @relay/i18n.
const LABEL = 'Post time';
const DESCRIPTION = 'Shown in the workspace time zone.';
const ERROR = 'Choose a time at least five minutes from now.';

describe('Field', () => {
  it('associates the label with the control', async () => {
    const user = userEvent.setup();
    render(
      <Field label={LABEL}>{(control) => <Input {...control} />}</Field>,
    );
    const input = screen.getByLabelText(LABEL);
    await user.click(screen.getByText(LABEL));
    expect(input).toHaveFocus();
  });

  it('wires the description through aria-describedby', () => {
    render(
      <Field label={LABEL} description={DESCRIPTION}>
        {(control) => <Input {...control} />}
      </Field>,
    );
    const input = screen.getByLabelText(LABEL);
    const describedBy = input.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    const description = document.getElementById(describedBy ?? '');
    expect(description).toHaveTextContent(DESCRIPTION);
  });

  it('adds the error to aria-describedby and sets aria-invalid', () => {
    render(
      <Field label={LABEL} description={DESCRIPTION} error={ERROR}>
        {(control) => <Input {...control} />}
      </Field>,
    );
    const input = screen.getByLabelText(LABEL);
    expect(input).toHaveAttribute('aria-invalid', 'true');

    const ids = (input.getAttribute('aria-describedby') ?? '').split(' ');
    expect(ids).toHaveLength(2);
    const texts = ids.map((id) => document.getElementById(id)?.textContent ?? '');
    expect(texts.join(' ')).toContain(DESCRIPTION);
    expect(texts.join(' ')).toContain(ERROR);
  });

  it('points aria-errormessage at the error node', () => {
    render(
      <Field label={LABEL} error={ERROR}>
        {(control) => <Input {...control} />}
      </Field>,
    );
    const input = screen.getByLabelText(LABEL);
    const errorId = input.getAttribute('aria-errormessage');
    expect(errorId).toBeTruthy();
    expect(document.getElementById(errorId ?? '')).toHaveTextContent(ERROR);
  });

  it('is neither invalid nor described by an error when there is none', () => {
    render(<Field label={LABEL}>{(control) => <Input {...control} />}</Field>);
    const input = screen.getByLabelText(LABEL);
    expect(input).not.toHaveAttribute('aria-invalid');
    expect(input).not.toHaveAttribute('aria-describedby');
  });

  it('announces the error politely rather than assertively', () => {
    const { container } = render(
      <Field label={LABEL} error={ERROR}>
        {(control) => <Input {...control} />}
      </Field>,
    );
    const live = container.querySelector('[aria-live]');
    expect(live).toHaveAttribute('aria-live', 'polite');
    expect(live).toHaveTextContent(ERROR);
  });

  it('passes required and disabled through to the control', () => {
    render(
      <Field label={LABEL} required disabled requiredIndicator="*">
        {(control) => <Input {...control} />}
      </Field>,
    );
    const input = screen.getByLabelText(new RegExp(LABEL));
    expect(input).toBeRequired();
    expect(input).toBeDisabled();
  });

  it('gives every field instance a unique control id', () => {
    render(
      <>
        <Field label={LABEL}>{(control) => <Input {...control} />}</Field>
        <Field label="Second">{(control) => <Input {...control} />}</Field>
      </>,
    );
    const first = screen.getByLabelText(LABEL);
    const second = screen.getByLabelText('Second');
    expect(first.id).not.toBe(second.id);
  });
});
