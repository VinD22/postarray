import { rememberedTargetsViewSchema } from '@relay/contracts';
import { z } from 'zod';

import { connectionIdSchema } from '../../common/schemas';

/**
 * Remembered target payloads.
 *
 * The remember body has exactly one field, and that is the design. There is no
 * place here for a caption, a schedule, a privacy value or an approval state,
 * and `.strict()` means a client that tries to send one gets a 422 rather than
 * having it quietly dropped. A selection is not content.
 */

export const rememberTargetsSchema = z
  .object({ connectionIds: z.array(connectionIdSchema).max(200) })
  .strict();

export const setTargetMemorySchema = z.object({ enabled: z.boolean() }).strict();

export type RememberTargetsInput = z.infer<typeof rememberTargetsSchema>;
export type SetTargetMemoryInput = z.infer<typeof setTargetMemorySchema>;

export { rememberedTargetsViewSchema };
