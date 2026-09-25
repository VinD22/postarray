/**
 * The confirm sheet serves both Publish now and Schedule. Its title has to
 * name the one the person pressed: "Confirm before scheduling" above a sheet
 * that is about to publish immediately is exactly the ambiguity it exists to
 * remove.
 */
export function confirmTitleKey(
  instant: string | null,
): 'composer.schedule.confirmPublishTitle' | 'composer.schedule.confirmTitle' {
  return instant === null
    ? 'composer.schedule.confirmPublishTitle'
    : 'composer.schedule.confirmTitle';
}
