import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

// Chat-scoped: gates the message list's auto-scroll animation and any other
// chat motion. Defaults to false (motion allowed) until the OS setting
// resolves, since most users don't have it enabled.
export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (mounted) setReducedMotion(enabled);
    });
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReducedMotion);
    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  return reducedMotion;
}
