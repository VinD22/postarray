import type { MetadataRoute } from 'next';

import {
  SITEMAP_CLUSTERS,
  type SitemapCluster,
  sitemapCluster,
} from '@/features/marketing/sitemap-clusters';

/**
 * One sitemap file per cluster, at `/sitemaps/sitemap/<cluster>.xml`.
 * `/sitemap.xml` is the index that lists them (see `app/sitemap.xml/route.ts`).
 */
export function generateSitemaps(): { id: SitemapCluster }[] {
  return SITEMAP_CLUSTERS.map((id) => ({ id }));
}

function isCluster(value: string): value is SitemapCluster {
  return (SITEMAP_CLUSTERS as readonly string[]).includes(value);
}

export default async function sitemap(props: {
  readonly id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const id = await props.id;
  return isCluster(id) ? sitemapCluster(id) : [];
}
