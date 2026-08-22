'use client';

import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';
import { LoadingState, SkeletonText } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';

/**
 * The assistant's own chunk.
 *
 * This module is the only place in the app that imports `assistant-screen`,
 * and `next/dynamic(..., { ssr: false })` gives it a chunk of its own that no
 * other route downloads. The screen is a conversation with a server: it has
 * nothing meaningful to render on the server, so nothing is lost by keeping it
 * off every other route's bundle, which is the same discipline the WebGL hero
 * follows in `lib/motion/webgl/hero-webgl-stage.tsx`.
 *
 * The loading fallback reserves the shape of the conversation instead of
 * spinning, so the layout does not jump when the chunk lands.
 */
const AssistantScreenLazy = dynamic(
  () => import('./assistant-screen').then((module) => module.AssistantScreen),
  {
    ssr: false,
    loading: () => <AssistantSkeleton />,
  },
);

function AssistantSkeleton(): ReactNode {
  const t = useTranslations();
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 md:px-6">
      <LoadingState label={t('settings.ui.state.loading', { section: t('assistantWeb.title') })}>
        <SkeletonText lines={6} />
      </LoadingState>
    </div>
  );
}

export function AssistantLazy(): ReactNode {
  return <AssistantScreenLazy />;
}
