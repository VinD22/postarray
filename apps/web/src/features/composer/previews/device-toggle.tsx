'use client';

/**
 * Mobile or desktop.
 *
 * Most published posts are read on a phone, so mobile is the default and the
 * choice is remembered. `localStorage` is read after mount, not during render,
 * so the server HTML and the first client paint agree.
 */

import { useCallback, useEffect, useState } from 'react';
import { Monitor, Smartphone } from 'lucide-react';
import { SegmentedControl } from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';

import { PREVIEW_DEVICE_STORAGE_KEY, type PreviewDevice } from './types';

function readStored(): PreviewDevice | null {
  try {
    const stored = window.localStorage.getItem(PREVIEW_DEVICE_STORAGE_KEY);
    return stored === 'mobile' || stored === 'desktop' ? stored : null;
  } catch {
    // A browser with storage blocked still gets a working toggle, it just does
    // not remember the choice.
    return null;
  }
}

export function usePreviewDevice(): readonly [PreviewDevice, (next: PreviewDevice) => void] {
  const [device, setDevice] = useState<PreviewDevice>('mobile');

  useEffect(() => {
    const stored = readStored();
    if (stored !== null) {
      setDevice(stored);
    }
  }, []);

  const choose = useCallback((next: PreviewDevice) => {
    setDevice(next);
    try {
      window.localStorage.setItem(PREVIEW_DEVICE_STORAGE_KEY, next);
    } catch {
      // See `readStored`.
    }
  }, []);

  return [device, choose] as const;
}

export interface DeviceToggleProps {
  readonly device: PreviewDevice;
  readonly onChange: (next: PreviewDevice) => void;
}

export function DeviceToggle({ device, onChange }: DeviceToggleProps): React.ReactNode {
  const t = useTranslations();
  return (
    <SegmentedControl
      size="sm"
      aria-label={t.full('composerWeb.preview.device.legend')}
      value={device}
      onValueChange={(next) => onChange(next === 'desktop' ? 'desktop' : 'mobile')}
      items={[
        {
          value: 'mobile',
          label: t.full('composerWeb.preview.device.mobile'),
          icon: <Smartphone aria-hidden />,
        },
        {
          value: 'desktop',
          label: t.full('composerWeb.preview.device.desktop'),
          icon: <Monitor aria-hidden />,
        },
      ]}
    />
  );
}
