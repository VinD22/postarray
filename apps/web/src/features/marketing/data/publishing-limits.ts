/**
 * Generated from the @relay/connectors registry. Do not edit by hand.
 * Run `pnpm generate:publishing-limits`.
 *
 * Numbers come from each provider adapter's capability snapshot, read for a
 * freshly connected account with no elevated eligibility. Every citation is
 * copied from the reviewed marketing connector records; none is invented here.
 * A provider with no adapter in this build carries nulls and
 * `adapterPresent: false`, and must render as unavailable rather than as zero.
 */
import type { ProviderLimits, PublishingLimitProvider } from './publishing-limits-types';

/** The launch cohort, in the order the cohort declares it. */
export const PUBLISHING_LIMIT_PROVIDERS: readonly PublishingLimitProvider[] = ["x","instagram","facebook","linkedin","tiktok","youtube","pinterest","bluesky","threads","google_business_profile"];

export const PUBLISHING_LIMITS: Readonly<Record<PublishingLimitProvider, ProviderLimits>> = {
  "x": {
    "provider": "x",
    "adapterPresent": true,
    "countingUnit": "weighted",
    "maxTitleLength": null,
    "text": {
      "maxLength": 280,
      "minLength": 0,
      "supportsMarkdown": false,
      "linkCountingMode": "fixed",
      "charactersPerLink": 23
    },
    "media": {
      "maxImages": 4,
      "maxVideos": 1,
      "allowedMimeTypes": ["image/jpeg","image/png","image/webp","image/gif","video/mp4"],
      "maxImageBytes": 5242880,
      "maxGifBytes": 15728640,
      "maxVideoBytes": 536870912,
      "maxDocumentBytes": null,
      "maxDurationSeconds": 140,
      "minDurationSeconds": 1,
      "requiresThumbnail": false,
      "maxAltTextLength": 1000
    },
    "source": {
      "url": "https://docs.x.com/x-api/posts/create-post",
      "readOn": "2026-08-04"
    }
  },
  "instagram": {
    "provider": "instagram",
    "adapterPresent": true,
    "countingUnit": "grapheme",
    "maxTitleLength": null,
    "text": {
      "maxLength": 2200,
      "minLength": 0,
      "supportsMarkdown": false,
      "linkCountingMode": "actual",
      "charactersPerLink": null
    },
    "media": {
      "maxImages": 10,
      "maxVideos": 1,
      "allowedMimeTypes": ["image/jpeg","video/mp4","video/quicktime"],
      "maxImageBytes": 8388608,
      "maxGifBytes": null,
      "maxVideoBytes": 1073741824,
      "maxDocumentBytes": null,
      "maxDurationSeconds": 900,
      "minDurationSeconds": 3,
      "requiresThumbnail": false,
      "maxAltTextLength": null
    },
    "source": {
      "url": "https://developers.facebook.com/docs/instagram-platform/content-publishing/",
      "readOn": "2026-08-04"
    }
  },
  "facebook": {
    "provider": "facebook",
    "adapterPresent": true,
    "countingUnit": "utf16",
    "maxTitleLength": null,
    "text": {
      "maxLength": 63206,
      "minLength": 0,
      "supportsMarkdown": false,
      "linkCountingMode": "actual",
      "charactersPerLink": null
    },
    "media": {
      "maxImages": 10,
      "maxVideos": 1,
      "allowedMimeTypes": ["image/jpeg","image/png","image/gif","image/webp","video/mp4","video/quicktime"],
      "maxImageBytes": 10485760,
      "maxGifBytes": 10485760,
      "maxVideoBytes": 1073741824,
      "maxDocumentBytes": null,
      "maxDurationSeconds": 14400,
      "minDurationSeconds": 1,
      "requiresThumbnail": false,
      "maxAltTextLength": null
    },
    "source": {
      "url": "https://developers.facebook.com/docs/pages-api/posts/",
      "readOn": "2026-08-04"
    }
  },
  "linkedin": {
    "provider": "linkedin",
    "adapterPresent": true,
    "countingUnit": "utf16",
    "maxTitleLength": null,
    "text": {
      "maxLength": 3000,
      "minLength": 0,
      "supportsMarkdown": false,
      "linkCountingMode": "actual",
      "charactersPerLink": null
    },
    "media": {
      "maxImages": 20,
      "maxVideos": 1,
      "allowedMimeTypes": ["image/jpeg","image/png","image/gif","video/mp4","application/pdf","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document","application/vnd.ms-powerpoint","application/vnd.openxmlformats-officedocument.presentationml.presentation"],
      "maxImageBytes": 10485760,
      "maxGifBytes": 10485760,
      "maxVideoBytes": 524288000,
      "maxDocumentBytes": 104857600,
      "maxDurationSeconds": 900,
      "minDurationSeconds": 3,
      "requiresThumbnail": false,
      "maxAltTextLength": null
    },
    "source": {
      "url": "https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api?view=li-lms-2026-03",
      "readOn": "2026-08-04"
    }
  },
  "tiktok": {
    "provider": "tiktok",
    "adapterPresent": true,
    "countingUnit": "grapheme",
    "maxTitleLength": null,
    "text": {
      "maxLength": 2200,
      "minLength": 0,
      "supportsMarkdown": false,
      "linkCountingMode": "actual",
      "charactersPerLink": null
    },
    "media": {
      "maxImages": 35,
      "maxVideos": 1,
      "allowedMimeTypes": ["video/mp4","video/quicktime","video/webm","image/jpeg","image/webp"],
      "maxImageBytes": 20971520,
      "maxGifBytes": null,
      "maxVideoBytes": 4294967296,
      "maxDocumentBytes": null,
      "maxDurationSeconds": 600,
      "minDurationSeconds": 3,
      "requiresThumbnail": false,
      "maxAltTextLength": null
    },
    "source": {
      "url": "https://developers.tiktok.com/doc/content-posting-api-get-started/",
      "readOn": "2026-08-04"
    }
  },
  "youtube": {
    "provider": "youtube",
    "adapterPresent": true,
    "countingUnit": "utf16",
    "maxTitleLength": 100,
    "text": {
      "maxLength": 5000,
      "minLength": 0,
      "supportsMarkdown": false,
      "linkCountingMode": "actual",
      "charactersPerLink": null
    },
    "media": {
      "maxImages": 0,
      "maxVideos": 1,
      "allowedMimeTypes": ["video/mp4","video/quicktime","video/x-matroska","video/webm","video/mpeg","video/x-msvideo"],
      "maxImageBytes": null,
      "maxGifBytes": null,
      "maxVideoBytes": 137438953472,
      "maxDocumentBytes": null,
      "maxDurationSeconds": 900,
      "minDurationSeconds": 1,
      "requiresThumbnail": false,
      "maxAltTextLength": null
    },
    "source": {
      "url": "https://developers.google.com/youtube/v3/docs/videos/insert",
      "readOn": "2026-08-04"
    }
  },
  "pinterest": {
    "provider": "pinterest",
    "adapterPresent": true,
    "countingUnit": "grapheme",
    "maxTitleLength": 100,
    "text": {
      "maxLength": 500,
      "minLength": 0,
      "supportsMarkdown": false,
      "linkCountingMode": "actual",
      "charactersPerLink": null
    },
    "media": {
      "maxImages": 1,
      "maxVideos": 0,
      "allowedMimeTypes": ["image/jpeg","image/png","image/webp","image/gif"],
      "maxImageBytes": 20971520,
      "maxGifBytes": 20971520,
      "maxVideoBytes": null,
      "maxDocumentBytes": null,
      "maxDurationSeconds": null,
      "minDurationSeconds": null,
      "requiresThumbnail": false,
      "maxAltTextLength": null
    },
    "source": {
      "url": "https://developers.pinterest.com/docs/api/v5/",
      "readOn": "2026-08-04"
    }
  },
  "bluesky": {
    "provider": "bluesky",
    "adapterPresent": true,
    "countingUnit": "grapheme",
    "maxTitleLength": null,
    "text": {
      "maxLength": 300,
      "minLength": 0,
      "supportsMarkdown": false,
      "linkCountingMode": "actual",
      "charactersPerLink": null
    },
    "media": {
      "maxImages": 4,
      "maxVideos": 1,
      "allowedMimeTypes": ["image/jpeg","image/png","image/webp","image/gif","video/mp4"],
      "maxImageBytes": 1048576,
      "maxGifBytes": 1048576,
      "maxVideoBytes": 52428800,
      "maxDocumentBytes": null,
      "maxDurationSeconds": 180,
      "minDurationSeconds": 1,
      "requiresThumbnail": false,
      "maxAltTextLength": 2000
    },
    "source": {
      "url": "https://docs.bsky.app/docs/advanced-guides/posts",
      "readOn": "2026-08-04"
    }
  },
  "threads": {
    "provider": "threads",
    "adapterPresent": true,
    "countingUnit": "grapheme",
    "maxTitleLength": null,
    "text": {
      "maxLength": 500,
      "minLength": 0,
      "supportsMarkdown": false,
      "linkCountingMode": "actual",
      "charactersPerLink": null
    },
    "media": {
      "maxImages": 20,
      "maxVideos": 1,
      "allowedMimeTypes": ["image/jpeg","image/png","video/mp4","video/quicktime"],
      "maxImageBytes": 8388608,
      "maxGifBytes": null,
      "maxVideoBytes": 1073741824,
      "maxDocumentBytes": null,
      "maxDurationSeconds": 300,
      "minDurationSeconds": 1,
      "requiresThumbnail": false,
      "maxAltTextLength": null
    },
    "source": {
      "url": "https://www.postman.com/meta/threads/documentation/dht3nzz/threads-api",
      "readOn": "2026-08-04"
    }
  },
  "google_business_profile": {
    "provider": "google_business_profile",
    "adapterPresent": false,
    "countingUnit": null,
    "maxTitleLength": null,
    "text": null,
    "media": null,
    "source": null
  }
};
