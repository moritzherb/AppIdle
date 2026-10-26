import { useEffect, useRef, useState, type RefObject } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Rect } from 'react-native-svg';
import { InkDefs } from '../art/Ink';
import { Athlete, type AthleteHandle } from '../character/Athlete';
import { CANVAS } from '../character/rigs';
import { haptics } from '../services/haptics';
import type { Direction, Sex } from '../theme/directions';
import { OffsetText, type MeterValues, type RoomKey, type Skin } from './shared';

const LINES = [
  'Is it leg day? Please tell me it is not leg day.',
  'I lifted a sandwich today. That counts, right?',
  'Hey! That tickles.',
  'One day these arms will need their own postcode.',
  'Okay, okay. I am awake. Mostly.',
  'Did you see that? I flexed. Something moved.',
];

const POKE_LINES = ['Hey! That tickles.', 'Ow. My one muscle!', 'Rude. Accurate, but rude.', 'Boop received.'];

interface Pop {
  id: number;
  text: string;
}

export interface SampleScreenProps {
  dir: Direction;
  skin: Skin;
  floor: string;
  sex: Sex;
  bottomInset: number;
  athlete: RefObject<AthleteHandle | null>;
}

export function SampleScreen({ dir, skin, floor, sex, bottomInset, athlete }: SampleScreenProps) {
  const [values, setValues] = useState<MeterValues>({ hunger: 62, fuel: 38, energy: 80, mood: 66, pump: 18 });
  const [coins, setCoins] = useState(240);
  const [line, setLine] = useState(LINES[0]);
  const [room, setRoom] = useState<RoomKey>('gym');
  const [pops, setPops] = useState<Pop[]>([]);
  const [roomH, setRoomH] = useState(0);
  const [stage, setStage] = useState({ w: 0, h: 0 });
  const popId = useRef(0);
  const shake = useSharedValue(0);

  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shake.value }] }));

  useEffect(() => {
    const t = setInterval(() => setLine(LINES[Math.floor(Math.random() * LINES.length)]), 7000);
    return () => clearInterval(t);
  }, []);

  const addPop = (text: string) => {
    const id = ++popId.current;
    setPops((p) => [...p, { id, text }]);
    setTimeout(() => setPops((p) => p.filter((x) => x.id !== id)), 1000);
  };

  const bump = (patch: Partial<MeterValues>) =>
    setValues((v) => {
      const next = { ...v };
      for (const [k, d] of Object.entries(patch) as [keyof MeterValues, number][]) {
        next[k] = Math.max(0, Math.min(100, v[k] + d));
      }
      return next;
    });

  const train = () => {
    athlete.current?.flex();
    haptics.thud();
    shake.value = withSequence(
      withTiming(-7, { duration: 40 }),
      withTiming(6, { duration: 50 }),
      withTiming(-4, { duration: 50 }),
      withTiming(0, { duration: 60, easing: Easing.out(Easing.quad) }),
    );
    bump({ pump: 22, energy: -9, fuel: -6, mood: 4 });
    setCoins((c) => c + 5);
    addPop('+22 PUMP');
    setLine('Rep one! Only... several hundred more to go.');
  };

  const feed = () => {
    athlete.current?.eat();
    haptics.tap();
    bump({ hunger: 18, fuel: 14, mood: 6 });
    addPop('+14 FUEL');
    setLine('Mmm. Banana. The official fruit of lifters.');
  };

  const onPoke = (zone: 'head' | 'body') => {
    athlete.current?.poke(zone);
    haptics.tap();
    bump({ mood: 2 });
    setLine(POKE_LINES[Math.floor(Math.random() * POKE_LINES.length)]);
  };

  // Place the athlete so the feet stand on the backdrop floor.
  const W = stage.w;
  const scale = roomH ? Math.max(W / 400, roomH / 760) : 1;
  const floorBand = 156 * scale;
  const feetY = floorBand * 0.42;
  const athleteW = Math.max(130, Math.min(W * 0.6, 300, (stage.h - feetY - 92) / 1.6));
  const s = athleteW / CANVAS.w;

  return (
    <View style={{ flex: 1, backgroundColor: floor }}>
      <Animated.View
        style={[{ flex: 1 }, shakeStyle]}
        onLayout={(e: LayoutChangeEvent) => setRoomH(e.nativeEvent.layout.height)}
      >
        <skin.Backdrop dir={dir} />
        <View style={{ paddingTop: 10 }}>
          <skin.Header dir={dir} name={sex === 'man' ? 'Bruno' : 'Rosa'} stage="Beginner" path="Bodybuilder" coins={coins} />
          <skin.Meters dir={dir} values={values} />
        </View>
        <View
          style={{ flex: 1 }}
          onLayout={(e: LayoutChangeEvent) => setStage({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })}
        >
          {W > 0 ? (
            <>
              <View style={[styles.center, { bottom: feetY - (CANVAS.h - 303) * s }]}>
                <Athlete ref={athlete} sex={sex} dir={dir} width={athleteW} onPoke={onPoke} />
              </View>
              <View style={[styles.center, { bottom: feetY + (303 - 18) * s, paddingHorizontal: 24 }]} pointerEvents="none">
                <skin.Bubble dir={dir} text={line} />
              </View>
              <View style={[styles.pops, { bottom: feetY + 190 * s, left: W / 2 + athleteW * 0.18 }]} pointerEvents="none">
                {pops.map((p) => (
                  <FloatPop key={p.id} dir={dir} text={p.text} />
                ))}
              </View>
            </>
          ) : null}
        </View>
      </Animated.View>
      <View style={styles.controls}>
        <skin.Button dir={dir} label="Train" icon="pump" variant={0} onPress={train} />
        <skin.Button dir={dir} label="Feed" icon="hunger" variant={1} onPress={feed} />
      </View>
      <View style={{ paddingBottom: bottomInset, backgroundColor: 'transparent' }}>
        <skin.Tabs dir={dir} active={room} onSelect={(r) => {
          setRoom(r);
          haptics.tap();
        }} />
      </View>
      {dir.treatment !== 'cartoon' ? <Grain /> : null}
    </View>
  );
}

function FloatPop({ dir, text }: { dir: Direction; text: string }) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withTiming(1, { duration: 1000, easing: Easing.linear });
  }, [t]);
  const style = useAnimatedStyle(() => ({
    opacity: t.value < 0.7 ? 1 : 1 - (t.value - 0.7) / 0.3,
    transform: [
      { translateY: -(1 - Math.pow(1 - t.value, 3)) * 80 },
      { scale: t.value < 0.15 ? 0.6 + t.value * 4 : 1.2 - Math.min(0.2, (t.value - 0.15) * 0.6) },
      { rotate: `${-6 + t.value * 4}deg` },
    ],
  }));
  const color =
    dir.treatment === 'poster' ? '#E8A93B' : dir.treatment === 'cartoon' ? '#FFF6E5' : '#FF48B0';
  const shadow =
    dir.treatment === 'poster' ? '#1B2A4A' : dir.treatment === 'cartoon' ? '#20141A' : '#0078BF';
  return (
    <Animated.View style={[{ position: 'absolute', left: 0, bottom: 0 }, style]}>
      <OffsetText
        style={{ fontFamily: dir.fonts.display, fontSize: 34, lineHeight: 40, color }}
        containerStyle={{ alignSelf: 'flex-start' }}
        shadowColor={shadow}
        dx={dir.treatment === 'riso' ? -2 : 3}
        dy={3}
      >
        {text}
      </OffsetText>
    </Animated.View>
  );
}

function Grain() {
  return (
    <Svg style={StyleSheet.absoluteFill} width="100%" height="100%" pointerEvents="none">
      <InkDefs />
      <Rect width="100%" height="100%" fill="url(#pl-grain)" />
    </Svg>
  );
}

const styles = StyleSheet.create({
  center: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  pops: { position: 'absolute', width: 220, height: 44 },
  controls: { flexDirection: 'row', gap: 18, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 16 },
});
