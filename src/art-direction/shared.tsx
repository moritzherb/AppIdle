import { useEffect, type ReactNode } from 'react';
import { Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import {
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import type { IconName } from '../art/icons';
import type { Direction } from '../theme/directions';

export type MeterKey = 'hunger' | 'fuel' | 'energy' | 'mood' | 'pump';
export type MeterValues = Record<MeterKey, number>;

export const METERS: { key: MeterKey; label: string; icon: IconName }[] = [
  { key: 'hunger', label: 'Hunger', icon: 'hunger' },
  { key: 'fuel', label: 'Fuel', icon: 'fuel' },
  { key: 'energy', label: 'Energy', icon: 'energy' },
  { key: 'mood', label: 'Mood', icon: 'mood' },
  { key: 'pump', label: 'Pump', icon: 'pump' },
];

export type RoomKey = 'gym' | 'kitchen' | 'bedroom' | 'locker' | 'arena';
export const ROOMS: { key: RoomKey; label: string; icon: IconName }[] = [
  { key: 'gym', label: 'Gym', icon: 'gym' },
  { key: 'kitchen', label: 'Kitchen', icon: 'kitchen' },
  { key: 'bedroom', label: 'Bed', icon: 'bedroom' },
  { key: 'locker', label: 'Locker', icon: 'locker' },
  { key: 'arena', label: 'Arena', icon: 'arena' },
];

export interface SkinProps {
  dir: Direction;
}

export interface Skin {
  Backdrop: (p: SkinProps) => ReactNode;
  Header: (p: SkinProps & { name: string; stage: string; path: string; coins: number }) => ReactNode;
  Meters: (p: SkinProps & { values: MeterValues }) => ReactNode;
  Button: (
    p: SkinProps & { label: string; icon: IconName; variant: 0 | 1; onPress: () => void },
  ) => ReactNode;
  Bubble: (p: SkinProps & { text: string }) => ReactNode;
  Tabs: (p: SkinProps & { active: RoomKey; onSelect: (r: RoomKey) => void }) => ReactNode;
}

/** Springs to value/100 and fires a little "pop" whenever the value rises. */
export function useMeter(value: number): { level: SharedValue<number>; pop: SharedValue<number> } {
  const level = useSharedValue(value / 100);
  const pop = useSharedValue(0);
  useEffect(() => {
    const rising = value / 100 > level.value + 0.001;
    level.value = withSpring(value / 100, { damping: 11, stiffness: 120 });
    if (rising) {
      pop.value = withSequence(withTiming(1, { duration: 90 }), withSpring(0, { damping: 5, stiffness: 260 }));
    }
  }, [value, level, pop]);
  return { level, pop };
}

/**
 * Text printed twice: a hard offset copy underneath. Used for misprint
 * shadows and riso misregistration. Avoids textShadow, which blurs on Android.
 */
export function OffsetText({
  children,
  style,
  shadowColor,
  dx,
  dy,
  shadowOpacity = 1,
  containerStyle,
}: {
  children: ReactNode;
  style: StyleProp<TextStyle>;
  shadowColor: string;
  dx: number;
  dy: number;
  shadowOpacity?: number;
  containerStyle?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={containerStyle}>
      <Text
        style={[style, { color: shadowColor, position: 'absolute', left: dx, right: -dx, top: dy, opacity: shadowOpacity }]}
        accessible={false}
        aria-hidden
        importantForAccessibility="no-hide-descendants"
        numberOfLines={1}
      >
        {children}
      </Text>
      <Text style={style} numberOfLines={1}>
        {children}
      </Text>
    </View>
  );
}

export const pad4 = (n: number) => String(Math.max(0, Math.min(9999, Math.round(n)))).padStart(4, '0');
