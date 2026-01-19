/**
 * Auto-save hook for draft sessions
 *
 * Automatically saves draft state to PostgreSQL every 2 seconds
 * Replaces localStorage-based session management
 */

import { useEffect, useRef } from 'react';

interface DraftState {
  draftId: string | null;
  currentStep: string;
  youtubeUrl?: string;
  videoInfo?: any;
  videoId?: string | null;
  processingStatus?: string;
  transcriptData?: any;
  transcriptSource?: string | null;
  errorMessage?: string | null;
}

interface UseDraftAutoSaveOptions {
  enabled?: boolean;
  interval?: number; // milliseconds
  onSave?: (success: boolean) => void;
  onError?: (error: Error) => void;
}

export function useDraftAutoSave(
  state: DraftState,
  options: UseDraftAutoSaveOptions = {}
) {
  const {
    enabled = true,
    interval = 2000, // 2 seconds
    onSave,
    onError,
  } = options;

  const lastSavedStateRef = useRef<string>('');
  const saveInProgressRef = useRef(false);

  useEffect(() => {
    if (!enabled || !state.draftId) return;

    const currentStateStr = JSON.stringify(state);

    // Skip if state hasn't changed
    if (currentStateStr === lastSavedStateRef.current) return;

    const autoSaveInterval = setInterval(async () => {
      // Skip if already saving
      if (saveInProgressRef.current) return;

      // Skip if state hasn't changed since last save
      const latestStateStr = JSON.stringify(state);
      if (latestStateStr === lastSavedStateRef.current) return;

      saveInProgressRef.current = true;

      try {
        const response = await fetch(`/api/drafts/${state.draftId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            currentStep: state.currentStep,
            youtubeUrl: state.youtubeUrl,
            title: state.videoInfo?.title,
            thumbnail: state.videoInfo?.thumbnail,
            duration: state.videoInfo?.duration,
            youtubeId: state.videoInfo?.id,
            uploader: state.videoInfo?.uploader,
            description: state.videoInfo?.description,
            videoId: state.videoId,
            processingStatus: state.processingStatus,
            transcriptData: state.transcriptData,
            transcriptSource: state.transcriptSource,
            errorMessage: state.errorMessage,
            lastAccessedAt: new Date().toISOString(),
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to save draft');
        }

        lastSavedStateRef.current = latestStateStr;
        onSave?.(true);

        console.log('[Draft Auto-save] Saved successfully');
      } catch (error) {
        console.error('[Draft Auto-save] Error:', error);
        onError?.(error as Error);
        onSave?.(false);
      } finally {
        saveInProgressRef.current = false;
      }
    }, interval);

    return () => clearInterval(autoSaveInterval);
  }, [
    enabled,
    state.draftId,
    state.currentStep,
    state.youtubeUrl,
    state.videoInfo,
    state.videoId,
    state.processingStatus,
    state.transcriptData,
    state.transcriptSource,
    state.errorMessage,
    interval,
    onSave,
    onError,
  ]);

  // Manual save function
  const saveNow = async () => {
    if (!state.draftId) {
      throw new Error('No draft ID available');
    }

    saveInProgressRef.current = true;

    try {
      const response = await fetch(`/api/drafts/${state.draftId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentStep: state.currentStep,
          youtubeUrl: state.youtubeUrl,
          title: state.videoInfo?.title,
          thumbnail: state.videoInfo?.thumbnail,
          duration: state.videoInfo?.duration,
          youtubeId: state.videoInfo?.id,
          uploader: state.videoInfo?.uploader,
          description: state.videoInfo?.description,
          videoId: state.videoId,
          processingStatus: state.processingStatus,
          transcriptData: state.transcriptData,
          transcriptSource: state.transcriptSource,
          errorMessage: state.errorMessage,
          lastAccessedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save draft');
      }

      lastSavedStateRef.current = JSON.stringify(state);
      console.log('[Draft] Manual save successful');
      return true;
    } catch (error) {
      console.error('[Draft] Manual save error:', error);
      throw error;
    } finally {
      saveInProgressRef.current = false;
    }
  };

  return { saveNow };
}
