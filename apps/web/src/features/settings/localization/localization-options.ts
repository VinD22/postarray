import { ACTIVE_LOCALES } from '@relay/i18n';

/**
 * Content-language choices currently exposed to workspace members.
 *
 * Future and retired catalogs remain available for compatibility, but they are
 * not selectable until the public locale roster promotes them explicitly.
 */
export const CONTENT_LOCALE_OPTIONS = ACTIVE_LOCALES;
