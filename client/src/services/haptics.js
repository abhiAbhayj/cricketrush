// Haptic feedback service for Web and Capacitor Android

export const haptics = {
  // Light tick for UI clicks
  light: () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(12);
      }
    } catch {
      // Ignore vibration errors
    }
  },

  // Medium vibration for bat contact (1 or 2 runs)
  medium: () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(35);
      }
    } catch {
      // Ignore
    }
  },

  // Heavy blast for boundary 4 or 6!
  heavy: () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([60, 40, 70]);
      }
    } catch {
      // Ignore
    }
  },

  // Stumps clattering / Wicket vibration
  wicket: () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([100, 50, 150]);
      }
    } catch {
      // Ignore
    }
  }
};
