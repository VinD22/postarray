'use client';

import { usePathname } from 'next/navigation';
import { ImagePlus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { useToast } from '@relay/design-system/primitives';

import { useSession } from '@/lib/auth/session-context';
import { useLocalizedRouter, useTranslations } from '@/lib/i18n';
import { createUploadTransport } from '@/features/media/state/upload-transport';

import { droppableMedia, isFileDrag, shellDropEnabled } from './shell-drop';

/**
 * Drop an image anywhere in the app to start a post with it.
 *
 * The file goes through the same upload transport the library and composer
 * use (ticket, signed PUT, checksum-verified finalize), so it lands in the
 * library as pending and is scanned like any other upload. The composer then
 * opens on `/compose?mediaId=`, which attaches it. Screens that own their own
 * drop zone (the composer, the library) and read-only roles are left alone.
 */
export function ShellDropTarget() {
  const t = useTranslations();
  const pathname = usePathname();
  const router = useLocalizedRouter();
  const { toast } = useToast();
  const { project, canPublish } = useSession();
  const projectId = project?.id ?? null;
  const [over, setOver] = useState(false);
  const [uploading, setUploading] = useState(0);
  const depth = useRef(0);
  const enabled = canPublish && shellDropEnabled(pathname);

  useEffect(() => {
    if (!enabled) return undefined;

    const onEnter = (event: DragEvent) => {
      if (!isFileDrag(event.dataTransfer)) return;
      depth.current += 1;
      setOver(true);
    };
    const onOver = (event: DragEvent) => {
      if (!isFileDrag(event.dataTransfer)) return;
      event.preventDefault();
      if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
    };
    const onLeave = (event: DragEvent) => {
      if (!isFileDrag(event.dataTransfer)) return;
      depth.current = Math.max(0, depth.current - 1);
      if (depth.current === 0) setOver(false);
    };
    const onDrop = (event: DragEvent) => {
      if (!isFileDrag(event.dataTransfer)) return;
      event.preventDefault();
      depth.current = 0;
      setOver(false);
      const files = droppableMedia(Array.from(event.dataTransfer?.files ?? []));
      if (files.length === 0) {
        toast({ title: t('shell.drop.unsupported'), tone: 'warning' });
        return;
      }
      void upload(files);
    };

    const upload = async (files: readonly File[]) => {
      setUploading(files.length);
      const transport = createUploadTransport(projectId);
      const controller = new AbortController();
      const mediaIds: string[] = [];
      try {
        for (const file of files) {
          const created = await transport.createUploadUrl(file, controller.signal);
          await transport.sendChunk(created.uploadUrl, file, 0, controller.signal);
          const { mediaId } = await transport.finalize(created.uploadId, file);
          mediaIds.push(mediaId);
        }
      } catch {
        toast({ title: t('shell.drop.failed'), tone: 'destructive' });
      } finally {
        setUploading(0);
      }
      if (mediaIds.length === 0) return;
      const query = mediaIds.map((id) => `mediaId=${encodeURIComponent(id)}`).join('&');
      router.push(`/compose?${query}`);
    };

    window.addEventListener('dragenter', onEnter);
    window.addEventListener('dragover', onOver);
    window.addEventListener('dragleave', onLeave);
    window.addEventListener('drop', onDrop);
    return () => {
      window.removeEventListener('dragenter', onEnter);
      window.removeEventListener('dragover', onOver);
      window.removeEventListener('dragleave', onLeave);
      window.removeEventListener('drop', onDrop);
    };
  }, [enabled, projectId, router, t, toast]);

  if (!over && uploading === 0) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="bg-surface-canvas/90 border-accent pointer-events-none fixed inset-2 z-(--z-index-overlay) flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-6 text-center"
    >
      <ImagePlus aria-hidden="true" className="text-text-accent size-10" />
      <p className="text-title-lg text-text-primary font-semibold">
        {uploading > 0 ? t('shell.drop.uploading', { count: uploading }) : t('shell.drop.title')}
      </p>
      {uploading > 0 ? null : (
        <p className="text-body text-text-secondary max-w-prose">{t('shell.drop.body')}</p>
      )}
    </div>
  );
}
