import { ONBOARDING_USE_CASES } from '@relay/application';
import { z } from 'zod';

import { projectIdSchema } from '../../common/schemas';

/**
 * Onboarding payloads.
 *
 * Both bodies are tiny and both are strict, for the same reason: this is the
 * first endpoint a brand new account ever writes to, and a permissive schema
 * here would let the first row in the table be the one that teaches everybody
 * what shape the column really has.
 */

/**
 * What the person says they are here to do. A closed set, shared with the
 * database enum, because this value only ever personalises first-run copy: it
 * carries no entitlement, no limit and no pricing decision.
 */
export const onboardingUseCaseSchema = z.enum(ONBOARDING_USE_CASES);

export const setOnboardingUseCaseSchema = z
  .object({
    useCase: onboardingUseCaseSchema,
    /**
     * Optional. Present only when the step was reached with a project already
     * selected, and checked for ownership by the application service rather
     * than trusted here.
     */
    projectId: projectIdSchema.optional(),
  })
  .strict();

/**
 * A step id from the first-run sequence. The sequence itself is product copy
 * and lives in the web app, so what the API pins is the shape: a short,
 * lowercase, hyphenated identifier and nothing that could be a sentence.
 */
export const completeOnboardingStepSchema = z
  .object({
    step: z
      .string()
      .trim()
      .min(1)
      .max(32)
      .regex(/^[a-z][a-z0-9-]*$/),
  })
  .strict();

export type SetOnboardingUseCaseInput = z.infer<typeof setOnboardingUseCaseSchema>;
export type CompleteOnboardingStepInput = z.infer<typeof completeOnboardingStepSchema>;
