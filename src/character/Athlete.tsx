import { useEffect, useImperativeHandle, useRef, type ReactNode, type Ref } from 'react';
import { Pressable, StyleSheet, type GestureResponderEvent, type HostInstance } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { Ink, InkDefs, ellipse } from '../art/Ink';
import type { Direction, Sex } from '../theme/directions';
import { CANVAS, RIGS, type Shape } from './rigs';

export interface AthleteHandle {
  poke(zone: 'head' | 'body'): void;
  flex(): void;
  eat(): void;
  lookAt(pageX: number, pageY: number): void;
}

interface Props {
  sex: Sex;
  dir: Direction;
  width: number;
  ref?: Ref<AthleteHandle>;
  onPoke?: (zone: 'head' | 'body') => void;
}

type Pt = [number, number];
const sine = Easing.inOut(Easing.sin);
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const rand = (a: number, b: number) => a + Math.random() * (b - a);

function Layer({
  s,
  origin,
  style,
  art,
  children,
}: {
  s: number;
  origin?: Pt;
  style?: object;
  art?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFill,
        origin ? { transformOrigin: `${origin[0] * s}px ${origin[1] * s}px` } : null,
        style,
      ]}
    >
      {art ? (
        <Svg width="100%" height="100%" viewBox={`0 0 ${CANVAS.w} ${CANVAS.h}`}>
          <InkDefs />
          {art}
        </Svg>
      ) : null}
      {children}
    </Animated.View>
  );
}

// Animate a set of shared values to targets, hold, then return to rest.
function pose(values: [SharedValue<number>, number][], hold: number, inMs = 260) {
  for (const [sv, target] of values) {
    sv.value = withSequence(
      withSpring(target, { damping: 9, stiffness: 140, mass: 0.8 }),
      withDelay(hold, withTiming(0, { duration: inMs, easing: sine })),
    );
  }
}

export function Athlete({ sex, dir, width, ref, onPoke }: Props) {
  const rig = RIGS[sex];
  const c = dir.char[sex];
  const s = width / CANVAS.w;
  const height = CANVAS.h * s;

  const draw = (shapes: Shape[]) =>
    shapes.map((sh, i) => (
      <Ink key={i} d={sh.d} dir={dir} kind={sh.kind} fill={sh.role ? c[sh.role] : 'none'} />
    ));

  // ---------------------------------------------------------- motion state
  const breath = useSharedValue(0);
  const blink = useSharedValue(0);
  const squash = useSharedValue(0);
  const wobble = useSharedValue(0);
  const tilt = useSharedValue(0);
  const stretchY = useSharedValue(0);
  const upF = useSharedValue(0);
  const foreF = useSharedValue(0);
  const upB = useSharedValue(0);
  const foreB = useSharedValue(0);
  const bicep = useSharedValue(0);
  const mouth = useSharedValue(0);
  const sweat = useSharedValue(0);
  const food = useSharedValue(0);
  const px = useSharedValue(0);
  const py = useSharedValue(0);

  const lastLook = useRef(0);
  const busy = useRef(false);
  const origin = useRef({ x: 0, y: 0 });
  const viewRef = useRef<HostInstance>(null);

  useEffect(() => {
    breath.value = withRepeat(withTiming(1, { duration: 1500, easing: sine }), -1, true);
    return () => cancelAnimation(breath);
  }, [breath]);

  // Blinking: random intervals, sometimes a double blink.
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const once = () =>
      withSequence(withTiming(1, { duration: 70 }), withTiming(0, { duration: 110 }));
    const loop = () => {
      blink.value = Math.random() < 0.25 ? withSequence(once(), withDelay(90, once())) : once();
      t = setTimeout(loop, rand(2200, 5200));
    };
    t = setTimeout(loop, 1200);
    return () => clearTimeout(t);
  }, [blink]);

  // Idle life: wander the eyes, and now and then do a little routine.
  useEffect(() => {
    const wander = setInterval(() => {
      if (Date.now() - lastLook.current < 2500 || busy.current) return;
      px.value = withTiming(rand(-3, 3), { duration: 220 });
      py.value = withTiming(rand(-1.5, 2), { duration: 220 });
    }, 2600);

    let t: ReturnType<typeof setTimeout>;
    const routines = [
      () => {
        // Admire own (tiny) bicep.
        pose([[upF, 82], [foreF, 102], [bicep, 0.8], [tilt, -7]], 900);
        px.value = withSequence(withTiming(-3.4, { duration: 200 }), withDelay(1000, withTiming(0)));
        py.value = withSequence(withTiming(1.5, { duration: 200 }), withDelay(1000, withTiming(0)));
      },
      () => {
        // Big stretch.
        pose([[upF, 168], [foreF, 12], [upB, -168], [foreB, -12], [stretchY, 1]], 700, 420);
        blink.value = withSequence(withTiming(0.85, { duration: 200 }), withDelay(700, withTiming(0)));
      },
      () => {
        // Yawn.
        mouth.value = withSequence(
          withTiming(1.35, { duration: 520, easing: sine }),
          withDelay(500, withTiming(0, { duration: 260 })),
        );
        tilt.value = withSequence(withTiming(5, { duration: 520 }), withDelay(500, withTiming(0)));
        blink.value = withSequence(withTiming(0.8, { duration: 400 }), withDelay(620, withTiming(0)));
      },
    ];
    const loop = () => {
      if (!busy.current) routines[Math.floor(Math.random() * routines.length)]();
      t = setTimeout(loop, rand(8000, 13000));
    };
    t = setTimeout(loop, 5000);
    return () => {
      clearInterval(wander);
      clearTimeout(t);
    };
  }, [px, py, upF, foreF, upB, foreB, bicep, tilt, stretchY, blink, mouth]);

  const markBusy = (ms: number) => {
    busy.current = true;
    setTimeout(() => (busy.current = false), ms);
  };

  useImperativeHandle(ref, () => ({
    poke(zone) {
      if (zone === 'head') {
        wobble.value = withSequence(
          withTiming(rand(0, 1) > 0.5 ? 9 : -9, { duration: 60 }),
          withSpring(0, { damping: 3, stiffness: 220 }),
        );
        blink.value = withSequence(withTiming(1, { duration: 50 }), withDelay(160, withTiming(0)));
      } else {
        squash.value = withSequence(
          withTiming(0.13, { duration: 70 }),
          withSpring(0, { damping: 5, stiffness: 300 }),
        );
      }
    },
    flex() {
      markBusy(1500);
      pose([[upF, 86], [foreF, 106], [upB, -86], [foreB, -106], [tilt, 3]], 850);
      bicep.value = withSequence(
        withDelay(140, withSpring(1.15, { damping: 4, stiffness: 260 })),
        withDelay(700, withTiming(0, { duration: 260 })),
      );
      squash.value = withSequence(withTiming(0.08, { duration: 90 }), withSpring(0, { damping: 6 }));
      sweat.value = 0;
      sweat.value = withTiming(1, { duration: 1300, easing: Easing.in(Easing.quad) });
      mouth.value = withSequence(withTiming(0.5, { duration: 120 }), withDelay(900, withTiming(0)));
    },
    eat() {
      markBusy(2200);
      food.value = 0;
      food.value = withTiming(1, { duration: 420, easing: Easing.in(Easing.cubic) });
      mouth.value = withSequence(
        withTiming(1, { duration: 300 }),
        withRepeat(
          withSequence(withTiming(0.2, { duration: 140 }), withTiming(0.8, { duration: 140 })),
          5,
          false,
        ),
        withTiming(0, { duration: 140 }),
      );
      tilt.value = withSequence(
        withDelay(420, withRepeat(withSequence(withTiming(2.5, { duration: 140 }), withTiming(-1, { duration: 140 })), 5)),
        withTiming(0),
      );
    },
    lookAt(pageX, pageY) {
      lastLook.current = Date.now();
      const eyeX = origin.current.x + 100 * s;
      const eyeY = origin.current.y + rig.eyes.left[1] * s;
      px.value = withTiming(clamp((pageX - eyeX) / 110, -1, 1) * 3.4, { duration: 90 });
      py.value = withTiming(clamp((pageY - eyeY) / 140, -1, 1) * 3, { duration: 90 });
    },
  }));

  // ------------------------------------------------------- animated styles
  const bodyStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${wobble.value * 0.35}deg` },
      { scaleX: 1 + squash.value * 0.8 - stretchY.value * 0.02 },
      { scaleY: 1 - squash.value + stretchY.value * 0.04 },
    ],
  }));
  const torsoStyle = useAnimatedStyle(() => ({
    transform: [{ scaleY: 1 + breath.value * 0.026 }, { scaleX: 1 + breath.value * 0.012 }],
  }));
  const headStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: -breath.value * 2.4 * s },
      { rotate: `${tilt.value + wobble.value}deg` },
    ],
  }));
  const ponyStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${breath.value * 3 - 1.5 - wobble.value * 1.8 + tilt.value * 0.6}deg` }],
  }));
  const upFStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -breath.value * 1.7 * s }, { rotate: `${upF.value + 7 + breath.value * 1.8}deg` }],
  }));
  const upBStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -breath.value * 1.7 * s }, { rotate: `${upB.value - 7 - breath.value * 1.8}deg` }],
  }));
  const foreFStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${foreF.value - 9}deg` }] }));
  const foreBStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${foreB.value + 9}deg` }] }));
  const bicepStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 0.3 + Math.max(bicep.value, Math.min(1, Math.abs(upF.value) / 86) * 0.5) * 0.75 }],
  }));
  const bicepBStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 0.3 + Math.max(bicep.value, Math.min(1, Math.abs(upB.value) / 86) * 0.5) * 0.75 }],
  }));
  const eyesStyle = useAnimatedStyle(() => ({ transform: [{ scaleY: 1 - blink.value * 0.88 }] }));
  const pupilStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: px.value * s }, { translateY: py.value * s }],
  }));
  const smileStyle = useAnimatedStyle(() => ({ opacity: mouth.value > 0.08 ? 0 : 1 }));
  const munchStyle = useAnimatedStyle(() => ({
    opacity: mouth.value > 0.08 ? 1 : 0,
    transform: [{ scaleY: 0.3 + mouth.value * 0.7 }, { scaleX: 0.85 + mouth.value * 0.15 }],
  }));
  const sweatStyle = useAnimatedStyle(() => ({
    opacity: sweat.value > 0 && sweat.value < 1 ? 1 - sweat.value * 0.7 : 0,
    transform: [{ translateY: sweat.value * 22 * s }],
  }));
  const foodStyle = useAnimatedStyle(() => ({
    opacity: food.value > 0 && food.value < 1 ? 1 : 0,
    transform: [
      { translateX: (1 - food.value) * 70 * s },
      { translateY: (1 - food.value) * 130 * s - Math.sin(food.value * Math.PI) * 40 * s },
      { scale: 1 - food.value * 0.55 },
    ],
  }));

  const eyeY = rig.eyes.left[1];
  const mouthC: Pt = [100, eyeY + 24];

  const handlePress = (e: GestureResponderEvent) => {
    const zone = e.nativeEvent.locationY < 130 * s ? 'head' : 'body';
    onPoke?.(zone);
  };

  const eye = (p: Pt) => (
    <Ink d={ellipse(p[0], p[1], rig.eyes.r, rig.eyes.r * 1.08)} dir={dir} fill={c.eyeWhite} k={0.6} />
  );
  const pupil = (p: Pt) => (
    <>
      <Circle cx={p[0]} cy={p[1] + 1} r={rig.eyes.pupil} fill={c.pupil} />
      <Circle cx={p[0] + 1.6} cy={p[1] - 0.8} r={1.5} fill="#FFFFFF" />
    </>
  );

  const arm = (a: typeof rig.armFront, up: object, fore: object, bic: object) => (
    <Layer s={s} origin={a.shoulder} style={up}>
      <Layer s={s} origin={a.bicepOrigin} style={bic} art={draw(a.bicep)} />
      <Layer s={s} art={draw(a.upper)} />
      <Layer s={s} origin={a.elbow} style={fore} art={draw(a.fore)} />
    </Layer>
  );

  return (
    <Pressable
      ref={viewRef}
      onPress={handlePress}
      onLayout={() =>
        viewRef.current?.measureInWindow((x, y) => {
          origin.current = { x, y };
        })
      }
      style={{ width, height }}
      accessibilityRole="button"
      accessibilityLabel="Your athlete. Tap to poke."
    >
      <Layer s={s} origin={[100, 303]} style={bodyStyle}>
        <Layer s={s} art={draw(rig.legs)} />
        <Layer s={s} art={draw(rig.neck)} />
        <Layer s={s} origin={rig.waist} style={torsoStyle} art={draw(rig.torso)} />
        {arm(rig.armBack, upBStyle, foreBStyle, bicepBStyle)}
        {arm(rig.armFront, upFStyle, foreFStyle, bicepStyle)}
        <Layer s={s} origin={rig.neckPivot} style={headStyle}>
          {rig.ponytail ? (
            <Layer s={s} origin={rig.ponytail.pivot} style={ponyStyle} art={draw(rig.ponytail.shapes)} />
          ) : null}
          <Layer
            s={s}
            art={
              <>
                {draw(rig.hairBack)}
                {draw(rig.head)}
                {draw(rig.hairFront)}
                {draw(rig.blush)}
                {draw(rig.nose)}
              </>
            }
          />
          <Layer s={s} origin={[100, eyeY]} style={eyesStyle}>
            <Layer s={s} art={<>{eye(rig.eyes.left)}{eye(rig.eyes.right)}</>} />
            <Layer s={s} style={pupilStyle} art={<>{pupil(rig.eyes.left)}{pupil(rig.eyes.right)}</>} />
            <Layer s={s} art={<>{draw(rig.lashes)}</>} />
          </Layer>
          <Layer s={s} art={draw(rig.brows)} />
          <Layer s={s} style={smileStyle} art={draw(rig.smile)} />
          <Layer s={s} origin={mouthC} style={munchStyle} art={draw(rig.munch)} />
          <Layer
            s={s}
            style={sweatStyle}
            art={
              <>
                <Ink dir={dir} fill="#BFE8F7" d="M142,52 C146,60 149,64 149,68 C149,72 146,74 143,74 C140,74 137,72 137,68 C137,64 140,60 142,52 Z" k={0.7} />
                <Ink dir={dir} fill="#BFE8F7" d="M56,66 C59,72 61,75 61,78 C61,81 59,83 56.5,83 C54,83 52,81 52,78 C52,75 54,72 56,66 Z" k={0.6} />
              </>
            }
          />
        </Layer>
        <Layer s={s} origin={mouthC} style={foodStyle} art={<FoodBanana dir={dir} at={mouthC} />} />
      </Layer>
    </Pressable>
  );
}

function FoodBanana({ dir, at }: { dir: Direction; at: Pt }) {
  const [x, y] = at;
  const banana = `M${x - 16},${y - 6} C${x - 10},${y + 10} ${x + 10},${y + 12} ${x + 18},${y - 2} C${x + 20},${y - 6} ${x + 16},${y - 8} ${x + 14},${y - 5} C${x + 8},${y + 3} ${x - 6},${y + 2} ${x - 11},${y - 8} C${x - 13},${y - 11} ${x - 17},${y - 10} ${x - 16},${y - 6} Z`;
  return (
    <>
      <Ink d={banana} dir={dir} fill="#FFD84A" />
      <Ink d={`M${x - 17},${y - 9} L${x - 15},${y - 13} L${x - 12},${y - 11} Z`} dir={dir} fill="#6B4A1E" k={0.6} />
    </>
  );
}
