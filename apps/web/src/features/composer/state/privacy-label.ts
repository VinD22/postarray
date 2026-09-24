import type { MessageKey } from '@relay/i18n';

/**
 * The words a person sees for a provider's audience value.
 *
 * Providers return their own tokens (`public`, `PUBLIC`, `SELF_ONLY`,
 * `MUTUAL_FOLLOW_FRIENDS`), and the capability snapshot's `labelKey` is not a
 * reliable catalog key today, so the label is chosen from the value itself.
 * An unrecognised value gets a generic sentence naming the provider, never the
 * raw token.
 */
const PRIVACY_LABEL_KEY: Readonly<Record<string, MessageKey>> = {
  public: 'composerWeb.privacyOption.public',
  public_to_everyone: 'composerWeb.privacyOption.public',
  anyone: 'composerWeb.privacyOption.public',
  unlisted: 'composerWeb.privacyOption.unlisted',
  private: 'composerWeb.privacyOption.private',
  followers: 'composerWeb.privacyOption.followers',
  follower_of_creator: 'composerWeb.privacyOption.followers',
  friends: 'composerWeb.privacyOption.friends',
  mutual_follow_friends: 'composerWeb.privacyOption.friends',
  connections: 'composerWeb.privacyOption.connections',
  self_only: 'composerWeb.privacyOption.selfOnly',
  direct: 'composerWeb.privacyOption.direct',
};

/** Only the translator shape this needs, so the function is testable without React. */
export type PrivacyTranslator = (key: string, values?: Record<string, string>) => string;

export function privacyLabelKey(value: string): MessageKey | null {
  return PRIVACY_LABEL_KEY[value.trim().toLowerCase()] ?? null;
}

export function describePrivacy(
  value: string,
  providerName: string,
  translate: PrivacyTranslator,
): string {
  const key = privacyLabelKey(value);
  return key === null
    ? translate('composerWeb.privacyOption.other', { provider: providerName })
    : translate(key);
}
