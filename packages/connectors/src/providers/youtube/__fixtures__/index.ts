/**
 * Recorded YouTube Data API v3 response shapes. Every id and URL is fabricated.
 * Retrieved 4 August 2026.
 */

export const YOUTUBE_CHANNELS_FIXTURE = {
  items: [
    {
      id: 'UCFAKECHANNEL0000000001',
      snippet: {
        title: 'Sample Studio',
        customUrl: '@samplestudiofake',
        thumbnails: { default: { url: 'https://example.invalid/yt-avatar.jpg' } },
      },
      status: { privacyStatus: 'public', isLinked: true, longUploadsStatus: 'disallowed' },
      statistics: { viewCount: '184200', subscriberCount: '5120', videoCount: '73' },
      contentDetails: { relatedPlaylists: { uploads: 'UUFAKECHANNEL0000000001' } },
    },
  ],
} as const;

export const YOUTUBE_VIDEO_PROCESSING_FIXTURE = {
  items: [
    {
      id: 'FAKEVIDEOID001',
      snippet: { title: 'Sample upload', channelId: 'UCFAKECHANNEL0000000001' },
      status: { uploadStatus: 'uploaded', privacyStatus: 'private' },
      processingDetails: {
        processingStatus: 'processing',
        processingProgress: { partsTotal: '100', partsProcessed: '35' },
      },
    },
  ],
} as const;

export const YOUTUBE_VIDEO_PROCESSED_FIXTURE = {
  items: [
    {
      id: 'FAKEVIDEOID001',
      snippet: {
        title: 'Sample upload',
        description: 'A sample description.',
        channelId: 'UCFAKECHANNEL0000000001',
        publishedAt: '2026-08-04T12:04:00Z',
      },
      status: {
        uploadStatus: 'processed',
        privacyStatus: 'private',
        selfDeclaredMadeForKids: false,
      },
      processingDetails: { processingStatus: 'succeeded' },
      statistics: { viewCount: '0', likeCount: '0', favoriteCount: '0', commentCount: '0' },
    },
  ],
} as const;

export const YOUTUBE_VIDEO_REJECTED_FIXTURE = {
  items: [
    {
      id: 'FAKEVIDEOID002',
      status: { uploadStatus: 'rejected', rejectionReason: 'copyright', privacyStatus: 'private' },
      processingDetails: { processingStatus: 'failed', processingFailureReason: 'other' },
    },
  ],
} as const;

export const YOUTUBE_VIDEO_STATISTICS_FIXTURE = {
  items: [
    {
      id: 'FAKEVIDEOID001',
      statistics: {
        viewCount: '15230',
        likeCount: '412',
        favoriteCount: '0',
        commentCount: '38',
      },
    },
  ],
} as const;

/** A channel that hid its like count simply omits the field. */
export const YOUTUBE_VIDEO_STATISTICS_HIDDEN_LIKES_FIXTURE = {
  items: [{ id: 'FAKEVIDEOID003', statistics: { viewCount: '900', commentCount: '2' } }],
} as const;

export const YOUTUBE_QUOTA_EXCEEDED_FIXTURE = {
  error: {
    code: 403,
    message: 'The request cannot be completed because you have exceeded your quota.',
    status: 'RESOURCE_EXHAUSTED',
    errors: [
      {
        domain: 'youtube.quota',
        reason: 'quotaExceeded',
        message: 'The request cannot be completed because you have exceeded your quota.',
      },
    ],
  },
} as const;

export const YOUTUBE_UPLOAD_STARTED_HEADERS = {
  location:
    'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&upload_id=FAKEUPLOADSESSION001',
} as const;

export const YOUTUBE_UPLOAD_COMPLETE_FIXTURE = {
  id: 'FAKEVIDEOID001',
  snippet: { title: 'Sample upload', channelId: 'UCFAKECHANNEL0000000001' },
  status: { uploadStatus: 'uploaded', privacyStatus: 'private' },
} as const;

export const YOUTUBE_COMMENT_THREAD_FIXTURE = { id: 'FAKECOMMENTTHREAD001' } as const;
