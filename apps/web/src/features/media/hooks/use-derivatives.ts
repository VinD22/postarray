'use client';

/**
 * Derivatives for one asset: read them, ask for a new one, hold the refusal.
 *
 * The hook does no pixel work and makes no decision the server does not also
 * make. It exists so the dialog can stay a form: state in, one call out, and a
 * refusal rendered as the sentence the boundary supplied rather than a generic
 * apology.
 *
 * `alreadyExisted` is worth surfacing. Asking for an edit that was already made
 * returns the version that exists and reprocesses nothing, and a person who
 * pressed save twice deserves to be told that rather than left wondering why
 * there is only one new row.
 */

import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from '@relay/i18n/react';

import { newIdempotencyKey } from '@/lib/api';

import { describeDerivativeFailure } from '../state/derivative-errors';
import {
  derivativesApi,
  type DerivativeOperation,
  type DerivativeView,
} from '../state/derivatives-api';

export interface DerivativesState {
  readonly derivatives: readonly DerivativeView[];
  readonly loading: boolean;
  readonly busy: boolean;
  readonly processing: boolean;
  readonly alreadyExisted: boolean;
  readonly failure: string | null;
  apply(operations: readonly DerivativeOperation[]): Promise<void>;
  reset(): void;
}

export function useDerivatives(mediaId: string | null): DerivativesState {
  const t = useTranslations();
  const [derivatives, setDerivatives] = useState<readonly DerivativeView[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [alreadyExisted, setAlreadyExisted] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);

  useEffect(() => {
    if (mediaId === null) {
      setDerivatives([]);
      return;
    }
    let live = true;
    setLoading(true);
    derivativesApi
      .list(mediaId)
      .then((rows) => {
        if (live) {
          setDerivatives(rows);
        }
      })
      .catch(() => {
        // A list that cannot be read is unavailable, not empty. The list
        // component says so; it does not claim there are no versions.
        if (live) {
          setDerivatives([]);
        }
      })
      .finally(() => {
        if (live) {
          setLoading(false);
        }
      });
    return () => {
      live = false;
    };
  }, [mediaId]);

  const reset = useCallback(() => {
    setFailure(null);
    setAlreadyExisted(false);
    setProcessing(false);
  }, []);

  const apply = useCallback(
    async (operations: readonly DerivativeOperation[]): Promise<void> => {
      if (mediaId === null || operations.length === 0) {
        return;
      }
      setBusy(true);
      setFailure(null);
      setAlreadyExisted(false);
      try {
        const result = await derivativesApi.create(mediaId, operations, newIdempotencyKey('mder'));
        if (result === null) {
          return;
        }
        setAlreadyExisted(result.status === 'ready');
        setProcessing(result.status === 'processing');
        if (result.derivative !== null) {
          const made = result.derivative;
          setDerivatives((current) =>
            current.some((entry) => entry.id === made.id) ? current : [...current, made],
          );
        }
      } catch (error: unknown) {
        // The boundary already decided what to say and in which language. The
        // browser renders that sentence rather than inventing a second one.
        setFailure(describeDerivativeFailure(error, t));
      } finally {
        setBusy(false);
      }
    },
    [mediaId, t],
  );

  return { derivatives, loading, busy, processing, alreadyExisted, failure, apply, reset };
}
