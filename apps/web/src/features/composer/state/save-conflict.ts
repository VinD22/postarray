/**
 * The two ways a composer save can fail that are not "try again".
 *
 * Both are thrown by the gateway and caught by the provider, which turns them
 * into designed states: a conflict shows the two versions side by side, and a
 * partial save keeps the failed targets dirty. Neither may let a commit go on
 * to freeze a version that is not what the person sees.
 */

/** Somebody saved a newer version of this draft while this one was being written. */
export class ComposerSaveConflict extends Error {
  readonly theirBody: string;
  readonly changedAt: string;
  readonly serverVersionId: string;
  /** Rebase the next save on the server's version, after the person has chosen. */
  readonly accept: () => void;

  constructor(input: {
    readonly theirBody: string;
    readonly changedAt: string;
    readonly serverVersionId: string;
    readonly accept: () => void;
  }) {
    super('COMPOSER_SAVE_CONFLICT');
    this.name = 'ComposerSaveConflict';
    this.theirBody = input.theirBody;
    this.changedAt = input.changedAt;
    this.serverVersionId = input.serverVersionId;
    this.accept = input.accept;
  }
}

/** A save that reached the server for some targets and not others. */
export class ComposerPartialSave extends Error {
  readonly failedConnectionIds: readonly string[];

  constructor(failedConnectionIds: readonly string[]) {
    super('COMPOSER_PARTIAL_SAVE');
    this.name = 'ComposerPartialSave';
    this.failedConnectionIds = failedConnectionIds;
  }
}

export function isComposerSaveConflict(error: unknown): error is ComposerSaveConflict {
  return error instanceof ComposerSaveConflict;
}
