import type { BlogByline } from './types';

/**
 * The two standing desks that own this writing.
 *
 * A byline exists so a reader can tell who is accountable for a sentence. It
 * is not decoration, so no name here is invented: these are the roles that do
 * the work, and they are catalog keys because they are page chrome, not
 * article prose. When the founder decides how the team is named publicly, the
 * change is two catalog values and nothing else.
 */

export const EDITORIAL_DESK: BlogByline = {
  nameKey: 'web.blog.byline.editorial.name',
  roleKey: 'web.blog.byline.editorial.role',
};

export const PLATFORM_DESK: BlogByline = {
  nameKey: 'web.blog.byline.platform.name',
  roleKey: 'web.blog.byline.platform.role',
};
