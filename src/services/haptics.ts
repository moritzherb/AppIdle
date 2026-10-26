import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

// Single entry point for vibration so a settings toggle can mute it later.
let enabled = true;
const ok = () => enabled && Platform.OS !== 'web';

export const haptics = {
  setEnabled(value: boolean) {
    enabled = value;
  },
  tap() {
    if (ok()) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  },
  thud() {
    if (ok()) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
  },
  success() {
    if (ok()) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  },
};
