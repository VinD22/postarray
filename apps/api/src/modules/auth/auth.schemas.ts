import { ianaTimeZoneSchema, localeSchema } from '@relay/contracts';
import { z } from 'zod';

/**
 * Authentication payloads.
 *
 * Two rules shape every schema here.
 *
 * **No credential ever travels in a URL.** Passwords, one-time codes and magic
 * link tokens are all request bodies. A credential in a query string ends up in
 * browser history, a referrer header, a CDN log and a proxy log, and none of
 * those are places we can reach to delete it.
 *
 * **The login form takes one field.** `identifier` is an email address or a
 * username alias, and the server decides which. Two separate endpoints would
 * let a caller learn which kind of value exists just by choosing where to send
 * it.
 */

/**
 * Minimum twelve characters, no composition rules, no forced rotation. Length
 * is the property that resists guessing; a mandatory punctuation mark mostly
 * produces `Password1!` and a sticky note. The provider additionally checks the
 * value against known breach corpora.
 */
export const passwordSchema = z.string().min(12).max(256);

export const identifierSchema = z.string().trim().min(3).max(320);

export const signUpSchema = z
  .object({
    email: z.string().trim().min(3).max(320).toLowerCase(),
    password: passwordSchema,
    displayName: z.string().trim().min(1).max(100),
    locale: localeSchema.default('en'),
    timeZone: ianaTimeZoneSchema.default('UTC'),
    /** Exact version hashes of the documents the person actually saw. */
    termsVersionHash: z.string().regex(/^[0-9a-f]{64}$/),
    privacyVersionHash: z.string().regex(/^[0-9a-f]{64}$/),
    acceptedTerms: z.literal(true),
  })
  .strict();

export const signInSchema = z
  .object({
    identifier: identifierSchema,
    password: passwordSchema,
  })
  .strict();

export const magicLinkSchema = z
  .object({
    identifier: identifierSchema,
    locale: localeSchema.default('en'),
  })
  .strict();

export const verifyOtpSchema = z
  .object({
    identifier: identifierSchema,
    /** Six digits, single use, ten minute expiry. Never in a URL. */
    code: z
      .string()
      .trim()
      .regex(/^\d{6}$/),
  })
  .strict();

export const passwordResetSchema = z
  .object({
    identifier: identifierSchema,
    locale: localeSchema.default('en'),
  })
  .strict();

export const signOutSchema = z
  .object({
    /**
     * Sign out everywhere also revokes MCP grants and CLI device tokens issued
     * to this identity. It does not revoke workspace-owned API keys, and the UI
     * says so, because those belong to the workspace and not to the person.
     */
    scope: z.enum(['current', 'all']).default('current'),
  })
  .strict();

export const setAliasSchema = z
  .object({
    /**
     * The raw value the person typed. Normalization, the single-script rule,
     * confusable skeleton uniqueness and the reserved list all live in
     * `@relay/application`, in one function shared by creation and lookup.
     */
    alias: z.string().trim().min(3).max(30),
  })
  .strict();

export const verifyTotpSchema = z
  .object({
    factorId: z.string().trim().min(1).max(128),
    code: z
      .string()
      .trim()
      .regex(/^\d{6}$/),
  })
  .strict();

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
