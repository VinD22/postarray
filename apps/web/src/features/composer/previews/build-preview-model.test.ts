import { describe, expect, it } from 'vitest';

import { initialComposerState, SEED_ACCOUNTS, SEED_BOOTSTRAP } from '../state/seed';
import type { TargetAccount } from '../types';
import { buildPreviewModel, domainOf, type PreviewMediaLookup } from './build-preview-model';

const EMPTY_MEDIA: PreviewMediaLookup = { get: () => null };

function account(provider: string): TargetAccount {
  const entry = SEED_ACCOUNTS.find((candidate) => candidate.provider === provider);
  if (entry === undefined) {
    throw new Error(`the seed has no ${provider} account`);
  }
  return entry;
}

function stateWith(body: string, mediaIds: readonly string[] = []) {
  const base = initialComposerState(SEED_BOOTSTRAP);
  return { ...base, master: { ...base.master, body, mediaIds: [...mediaIds] } };
}

function imageLookup(available = true): PreviewMediaLookup {
  return {
    get: (mediaId) => ({
      id: mediaId,
      kind: 'image' as const,
      altText: null,
      altTextWaived: false,
      width: 1200,
      height: 800,
      durationMs: null,
      available,
      loading: false,
      thumbnailUrl: null,
    }),
  };
}

describe('buildPreviewModel', () => {
  it('takes the content kind support straight from the snapshot', () => {
    const x = account('x');
    const model = buildPreviewModel({
      state: stateWith('hello'),
      account: x,
      media: EMPTY_MEDIA,
      postedAtLabel: 'Just now',
    });
    expect(model.kindSupport).toBe(x.capabilities.contentKinds[model.contentKind]);
  });

  it('counts the body the validator counts, not the body plus the signature', () => {
    const x = account('x');
    const base = initialComposerState(SEED_BOOTSTRAP);
    const state = {
      ...base,
      master: {
        ...base.master,
        body: 'body',
        signature: {
          signatureId: 'sig_01j000000000000000000001',
          appliedText: 'a signature that is much longer than the body',
          locale: 'en',
          autoApplied: true,
        },
      },
    };
    const model = buildPreviewModel({
      state,
      account: x,
      media: EMPTY_MEDIA,
      postedAtLabel: 'Just now',
    });
    expect(model.counter.used).toBe(4);
    expect(model.text).toContain('a signature');
  });

  it('marks media past the platform maximum as not sent, in draft order', () => {
    const x = account('x');
    const limit = x.capabilities.media.maxImages;
    const ids = Array.from({ length: limit + 2 }, (_unused, index) => `media_0${index}`);
    const model = buildPreviewModel({
      state: stateWith('hello', ids),
      account: x,
      media: imageLookup(),
      postedAtLabel: 'Just now',
    });
    expect(model.media).toHaveLength(limit + 2);
    expect(model.media.filter((file) => file.sent)).toHaveLength(limit);
    expect(model.media.slice(limit).every((file) => !file.sent)).toBe(true);
  });

  it('keeps every attachment in the model rather than dropping the extras', () => {
    const x = account('x');
    const ids = Array.from({ length: 9 }, (_unused, index) => `media_1${index}`);
    const model = buildPreviewModel({
      state: stateWith('hello', ids),
      account: x,
      media: imageLookup(),
      postedAtLabel: 'Just now',
    });
    expect(model.media.map((file) => file.id)).toEqual(ids);
  });

  it('reports an unloaded attachment as loading rather than as missing', () => {
    const model = buildPreviewModel({
      state: stateWith('hello', ['media_unknown']),
      account: account('x'),
      media: EMPTY_MEDIA,
      postedAtLabel: 'Just now',
    });
    expect(model.media[0]?.loading).toBe(true);
  });

  it('says whether alt text and mentions are supported, from the snapshot alone', () => {
    const youtube = account('youtube');
    const model = buildPreviewModel({
      state: stateWith('hello'),
      account: youtube,
      media: EMPTY_MEDIA,
      postedAtLabel: 'Just now',
    });
    expect(model.showsAltText).toBe(youtube.capabilities.media.altText === 'supported');
    expect(model.resolvesMentions).toBe(youtube.capabilities.mentions.support === 'supported');
  });

  it('never invents a link headline', () => {
    const model = buildPreviewModel({
      state: stateWith('read https://blog.example.com/post/1 today'),
      account: account('x'),
      media: EMPTY_MEDIA,
      postedAtLabel: 'Just now',
    });
    expect(model.links).toHaveLength(1);
    expect(model.links[0]?.domain).toBe('blog.example.com');
    expect(model.links[0]?.title).toBeNull();
    expect(model.links[0]?.description).toBeNull();
  });
});

describe('domainOf', () => {
  it('drops a leading www', () => {
    expect(domainOf('https://www.example.com/x')).toBe('example.com');
  });

  it('returns an empty string rather than throwing on rubbish', () => {
    expect(domainOf('not a url')).toBe('');
  });
});
