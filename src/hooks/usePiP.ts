'use client';

import { useState, useEffect, useCallback } from 'react';

export function usePiP() {
  const [isSupported, setIsSupported] = useState(false);
  const [isPiPActive, setIsPiPActive] = useState(false);

  useEffect(() => {
    // Check if PiP is supported
    setIsSupported(
      'documentPictureInPicture' in window ||
      'pictureInPictureEnabled' in document
    );
  }, []);

  const enterPiP = useCallback(async () => {
    if (!isSupported) return;

    try {
      if ('documentPictureInPicture' in window) {
        // Modern PiP API
        const pipWindow = await (window as any).documentPictureInPicture.requestWindow({
          width: 400,
          height: 600,
        });
        
        // Clone the current document to the PiP window
        pipWindow.document.body.innerHTML = document.body.innerHTML;
        setIsPiPActive(true);
      } else if ('pictureInPictureEnabled' in document) {
        // Legacy video PiP (fallback)
        const video = document.createElement('video');
        video.srcObject = new MediaStream();
        await video.requestPictureInPicture();
        setIsPiPActive(true);
      }
    } catch (error) {
      console.error('Failed to enter PiP mode:', error);
    }
  }, [isSupported]);

  const exitPiP = useCallback(async () => {
    if (!isSupported) return;

    try {
      if ('documentPictureInPicture' in window) {
        // Close PiP window if it exists
        const pipWindows = (window as any).documentPictureInPicture.window;
        if (pipWindows) {
          pipWindows.close();
        }
      } else if ('pictureInPictureEnabled' in document) {
        await document.exitPictureInPicture();
      }
      setIsPiPActive(false);
    } catch (error) {
      console.error('Failed to exit PiP mode:', error);
    }
  }, [isSupported]);

  return {
    isSupported,
    isPiPActive,
    enterPiP,
    exitPiP,
  };
} 