import type { Prisma } from '@relay/database';

/**
 * The one place a structured value crosses into a Prisma `Json` column.
 *
 * `Prisma.InputJsonValue` describes JSON *structurally*: every object in it must
 * carry a string index signature. Almost nothing we actually persist does. A
 * zod-inferred payload, a hand-written `interface` and a `Record<string,
 * unknown>` are all perfectly good JSON at runtime, and TypeScript still refuses
 * every one of them, because "has no excess properties" is not something it can
 * prove about a named type.
 *
 * So this is a genuine ORM impedance mismatch rather than a type error hiding a
 * bug, and it is resolved here once instead of at each of the twenty call sites.
 * The assertion changes no value and drops no field: what the caller passes is
 * what Prisma serializes.
 *
 * What it does not do is check that the value *is* JSON. A `Date`, a `Map` or a
 * class instance would be accepted here and would serialize to something the
 * caller did not intend. Pass a plain object, an array, or a primitive.
 */
export function toJson<T>(value: T): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue;
}
