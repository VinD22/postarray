import { llmsFullText } from '@/features/marketing/llms-full';

/**
 * The long form companion to `/llms.txt`: every article body and every
 * recorded platform value, with its source and the date a person read it, in
 * one plain-text file an AI system can read without JavaScript.
 */
export const dynamic = 'force-static';

export async function GET(): Promise<Response> {
  return new Response(await llmsFullText(), {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
