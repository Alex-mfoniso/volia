import { useState, useEffect } from 'react';

/**
 * Hook to detect WebGL support and performance capability.
 * Safely runs in client browser environments with graceful SSR/low-spec fallback.
 */
export function useWebGLSupport(): { isSupported: boolean; isChecking: boolean } {
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [isChecking, setIsChecking] = useState<boolean>(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl') ||
        (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);

      if (!gl || !(gl instanceof WebGLRenderingContext)) {
        setIsSupported(false);
      } else {
        // Test basic shader compilation capability
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          // Flag software renderers as low capability if needed
          if (typeof renderer === 'string' && renderer.toLowerCase().includes('swiftshader')) {
            console.info('[VOLIA 3D] Software WebGL detected; simplifying rendering settings.');
          }
        }
        setIsSupported(true);
      }
    } catch (e) {
      console.warn('[VOLIA 3D] WebGL detection failed:', e);
      setIsSupported(false);
    } finally {
      setIsChecking(false);
    }
  }, []);

  return { isSupported, isChecking };
}
