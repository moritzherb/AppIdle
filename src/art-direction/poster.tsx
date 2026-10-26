import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import Svg, { Circle, G, Line, Path, Rect } from 'react-native-svg';
import { Icon } from '../art/icons';
import { Ink, InkDefs, ellipse } from '../art/Ink';
import { METERS, OffsetText, ROOMS, pad4, useMeter, type Skin } from './shared';

const C = {
  red: '#C8102E',
  navy: '#1B2A4A',
  cream: '#F3E6C8',
  creamDeep: '#E9D6AA',
  mustard: '#E8A93B',
  teal: '#2E8B85',
  ink: '#1A1A1A',
  navyLit: '#0F1A30',
};

function star(cx: number, cy: number, r: number) {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 === 0 ? r : r * 0.45;
    pts.push(`${(cx + Math.cos(a) * rr).toFixed(1)},${(cy + Math.sin(a) * rr).toFixed(1)}`);
  }
  return `M${pts.join(' L')} Z`;
}

function rays(cx: number, cy: number, n: number, r: number) {
  const out: string[] = [];
  for (let i = 0; i < n; i += 2) {
    const a0 = (i / n) * Math.PI * 2;
    const a1 = ((i + 1) / n) * Math.PI * 2;
    out.push(
      `M${cx},${cy} L${(cx + Math.cos(a0) * r).toFixed(1)},${(cy + Math.sin(a0) * r).toFixed(1)} L${(
        cx +
        Math.cos(a1) * r
      ).toFixed(1)},${(cy + Math.sin(a1) * r).toFixed(1)} Z`,
    );
  }
  return out.join(' ');
}

const Backdrop: Skin['Backdrop'] = ({ dir }) => {
  return (
    <Svg style={StyleSheet.absoluteFill} viewBox="0 0 400 760" preserveAspectRatio="xMidYMax slice">
      <InkDefs />
      <Rect x={0} y={0} width={400} height={760} fill={C.cream} />
      <Path d={rays(200, 520, 36, 900)} fill={C.creamDeep} />
      <Circle cx={200} cy={470} r={150} fill={C.mustard} />
      <Circle cx={200} cy={470} r={150} fill="url(#pl-halftone-big)" />
      <Circle cx={200} cy={470} r={150} fill="none" stroke={C.ink} strokeWidth={3} />
      <Ink dir={dir} fill={C.red} d={star(62, 300, 20)} k={0.9} />
      <Ink dir={dir} fill={C.teal} d={star(350, 262, 14)} k={0.8} />
      <Ink dir={dir} fill={C.mustard} d={star(326, 336, 9)} k={0.7} />
      {/* varsity stripes */}
      <Rect x={0} y={584} width={400} height={12} fill={C.red} />
      <Rect x={0} y={598} width={400} height={6} fill={C.teal} />
      {/* floor */}
      <Rect x={0} y={604} width={400} height={160} fill={C.navy} />
      <Rect x={0} y={604} width={400} height={160} fill="url(#pl-halftone)" opacity={0.6} />
      <Path d="M40,760 C80,660 320,660 360,760" stroke={C.mustard} strokeWidth={4} fill="none" />
      <Line x1={0} y1={604} x2={400} y2={604} stroke={C.ink} strokeWidth={3} />
      {/* weight plate leaning on the wall */}
      <G>
        <Ink dir={dir} fill={C.red} d={ellipse(52, 566, 40, 40)} />
        <Ink dir={dir} fill={C.ink} kind="flat" d={ellipse(52, 566, 9, 9)} />
        <Path d={ellipse(52, 566, 27, 27)} stroke={C.ink} strokeWidth={2} fill="none" opacity={0.5} />
      </G>
      {/* dumbbell rack */}
      <Ink dir={dir} fill={C.teal} d="M300,520 L392,520 L392,532 L300,532 Z" />
      <Ink dir={dir} fill={C.teal} d="M306,532 L316,532 L316,604 L306,604 Z" />
      <Ink dir={dir} fill={C.teal} d="M376,532 L386,532 L386,604 L376,604 Z" />
      {[316, 350].map((x, i) => (
        <G key={x}>
          <Ink dir={dir} fill={C.cream} d={`M${x},508 L${x + 26},508 L${x + 26},512 L${x},512 Z`} k={0.7} />
          <Ink dir={dir} fill={i ? C.red : C.mustard} d={`M${x - 6},498 L${x + 4},498 L${x + 4},522 L${x - 6},522 Z`} k={0.8} />
          <Ink dir={dir} fill={i ? C.red : C.mustard} d={`M${x + 22},498 L${x + 32},498 L${x + 32},522 L${x + 22},522 Z`} k={0.8} />
        </G>
      ))}
    </Svg>
  );
};

const Header: Skin['Header'] = ({ dir, name, stage, path, coins }) => (
  <View style={ps.header}>
    <View style={{ flexShrink: 1 }}>
      <View style={ps.tape}>
        <Text style={[ps.tapeText, { fontFamily: dir.fonts.bodyBold }]}>
          {stage} · {path}
        </Text>
      </View>
      <OffsetText
        style={[ps.name, { fontFamily: dir.fonts.display }]}
        shadowColor={C.navy}
        dx={4}
        dy={3}
        containerStyle={{ transform: [{ skewX: '-9deg' }], marginLeft: 6 }}
      >
        {name.toUpperCase()}
      </OffsetText>
    </View>
    <View style={ps.scoreWrap}>
      <View style={ps.scoreShadow} />
      <View style={ps.score}>
        <Icon name="coin" dir={dir} size={24} color={C.mustard} accent={C.red} />
        <View style={{ flexDirection: 'row', gap: 2 }}>
          {pad4(coins)
            .split('')
            .map((d, i) => (
              <View key={i} style={ps.digitCell}>
                <Text style={[ps.digit, { fontFamily: dir.fonts.display }]}>{d}</Text>
              </View>
            ))}
        </View>
      </View>
    </View>
  </View>
);

function Segments({ value }: { value: number }) {
  const { level, pop } = useMeter(value);
  const SEG = 8;
  const colStyle = useAnimatedStyle(() => ({ transform: [{ scale: 1 + pop.value * 0.12 }] }));
  return (
    <Animated.View style={[{ flexDirection: 'row', gap: 2 }, colStyle]}>
      {Array.from({ length: SEG }).map((_, i) => (
        <Seg key={i} i={i} n={SEG} level={level} low={value < 25} />
      ))}
    </Animated.View>
  );
}

function Seg({ i, n, level, low }: { i: number; n: number; level: ReturnType<typeof useMeter>['level']; low: boolean }) {
  const lit = useAnimatedStyle(() => ({ opacity: Math.min(1, Math.max(0, level.value * n - i)) }));
  return (
    <View style={ps.seg}>
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: low ? C.red : C.mustard }, lit]} />
    </View>
  );
}

const Meters: Skin['Meters'] = ({ dir, values }) => (
  <View style={ps.meterWrap}>
    <View style={ps.meterShadow} />
    <View style={ps.meterPanel}>
      {METERS.map((m) => (
        <View key={m.key} style={ps.meterCol}>
          <Icon name={m.icon} dir={dir} size={26} color={C.cream} accent={C.mustard} light={C.cream} />
          <Text style={[ps.meterLabel, { fontFamily: dir.fonts.headline }]}>{m.label.toUpperCase()}</Text>
          <Segments value={values[m.key]} />
        </View>
      ))}
    </View>
    <Pennants dir={dir} />
  </View>
);

/** Pennant string hanging under the scoreboard. */
function Pennants({ dir }: { dir: Parameters<Skin['Meters']>[0]['dir'] }) {
  const flags = [C.red, C.teal, C.mustard, C.navy, C.red, C.teal, C.mustard, C.navy];
  return (
    <View style={{ position: 'absolute', left: 0, right: 0, top: '100%', marginTop: 3 }} pointerEvents="none">
    <Svg width="100%" height={44} viewBox="0 0 360 44" preserveAspectRatio="none">
      <Path d="M14,2 C120,16 240,16 346,2" stroke={C.ink} strokeWidth={2} fill="none" />
      {flags.map((f, i) => {
        const x = 26 + i * 40;
        const y = 2 + Math.sin(((x - 14) / 332) * Math.PI) * 11;
        return <Ink key={i} dir={dir} fill={f} d={`M${x},${y - 1} L${x + 28},${y + 1} L${x + 13},${y + 28} Z`} k={0.7} />;
      })}
    </Svg>
    </View>
  );
}

const Button: Skin['Button'] = ({ dir, label, icon, variant, onPress }) => {
  const press = useSharedValue(0);
  const face = useAnimatedStyle(() => ({
    transform: [{ translateX: press.value * 4 }, { translateY: press.value * 4 }],
  }));
  const bg = variant === 0 ? C.red : C.teal;
  return (
    <Pressable
      onPressIn={() => (press.value = withTiming(1, { duration: 50 }))}
      onPressOut={() => (press.value = withSpring(0, { damping: 7, stiffness: 300 }))}
      onPress={onPress}
      style={{ flex: 1 }}
      accessibilityRole="button"
    >
      <View style={{ transform: [{ skewX: '-10deg' }] }}>
        <View style={[ps.btnShadow]} />
        <Animated.View style={[ps.btn, { backgroundColor: bg }, face]}>
          <View style={ps.btnInner} pointerEvents="none" />
          <Icon name={icon} dir={dir} size={30} color={C.cream} accent={C.mustard} light={C.cream} />
          <Text style={[ps.btnText, { fontFamily: dir.fonts.display }]}>{label.toUpperCase()}</Text>
        </Animated.View>
      </View>
    </Pressable>
  );
};

const Bubble: Skin['Bubble'] = ({ dir, text }) => (
  <View style={{ alignItems: 'center' }}>
    <View>
      <View style={ps.bubbleShadow} />
      <View style={ps.bubble}>
        <Text style={[ps.bubbleText, { fontFamily: dir.fonts.bodyBold }]}>{text}</Text>
      </View>
    </View>
    <Svg width={30} height={16} viewBox="0 0 30 16" style={{ marginTop: -3 }}>
      <Path d="M3,0 L27,0 L10,15 Z" fill={C.cream} stroke={C.ink} strokeWidth={3} strokeLinejoin="round" />
      <Rect x={4} y={-2} width={22} height={3.5} fill={C.cream} />
    </Svg>
  </View>
);

const Tabs: Skin['Tabs'] = ({ dir, active, onSelect }) => (
  <View style={ps.tabs}>
    {ROOMS.map((r) => {
      const on = r.key === active;
      return (
        <Pressable key={r.key} onPress={() => onSelect(r.key)} style={ps.tab} accessibilityRole="tab">
          {on ? (
            <Svg style={StyleSheet.absoluteFill} viewBox="0 0 60 70" preserveAspectRatio="none">
              <Path d="M3,0 L57,0 L57,70 L30,56 L3,70 Z" fill={C.mustard} stroke={C.ink} strokeWidth={2.5} />
            </Svg>
          ) : null}
          <Icon name={r.icon} dir={dir} size={26} color={on ? C.red : C.cream} accent={on ? C.navy : C.mustard} light={C.cream} />
          <Text style={[ps.tabText, { fontFamily: dir.fonts.headline, color: on ? C.ink : C.cream }]}>
            {r.label.toUpperCase()}
          </Text>
        </Pressable>
      );
    })}
  </View>
);

export const posterSkin: Skin = { Backdrop, Header, Meters, Button, Bubble, Tabs };

const ps = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 16, gap: 10 },
  tape: {
    alignSelf: 'flex-start',
    backgroundColor: C.mustard,
    borderWidth: 2,
    borderColor: C.ink,
    paddingHorizontal: 8,
    paddingVertical: 2,
    transform: [{ rotate: '-2deg' }],
  },
  tapeText: { fontSize: 12, letterSpacing: 1.4, color: C.ink },
  name: { fontSize: 58, lineHeight: 60, color: C.red, letterSpacing: 1 },
  scoreWrap: { marginTop: 6 },
  scoreShadow: { position: 'absolute', left: 4, top: 4, right: -4, bottom: -4, backgroundColor: C.red },
  score: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: C.navy,
    borderWidth: 3,
    borderColor: C.ink,
    paddingHorizontal: 7,
    paddingVertical: 6,
  },
  digitCell: { backgroundColor: C.navyLit, paddingHorizontal: 3, minWidth: 17, alignItems: 'center' },
  digit: { color: C.mustard, fontSize: 24, lineHeight: 28 },
  meterWrap: { marginHorizontal: 16, marginTop: 10 },
  meterShadow: { position: 'absolute', left: 5, top: 5, right: -5, bottom: -5, backgroundColor: C.red },
  meterPanel: {
    flexDirection: 'row',
    backgroundColor: C.navy,
    borderWidth: 3,
    borderColor: C.ink,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  meterCol: { flex: 1, alignItems: 'center', gap: 3 },
  meterLabel: { color: C.cream, fontSize: 12, letterSpacing: 1.2 },
  seg: { width: 5, height: 9, backgroundColor: '#2C3D62', overflow: 'hidden' },
  btnShadow: { position: 'absolute', left: 5, top: 5, right: -5, bottom: -5, backgroundColor: C.navy },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 3,
    borderColor: C.ink,
    paddingVertical: 10,
  },
  btnInner: { position: 'absolute', left: 4, right: 4, top: 4, bottom: 4, borderWidth: 1.5, borderColor: C.cream, opacity: 0.55 },
  btnText: { color: C.cream, fontSize: 30, lineHeight: 34, letterSpacing: 2 },
  bubbleShadow: { position: 'absolute', left: 5, top: 5, right: -5, bottom: -5, backgroundColor: C.mustard },
  bubble: { backgroundColor: C.cream, borderWidth: 3, borderColor: C.ink, paddingHorizontal: 14, paddingVertical: 8, maxWidth: 280 },
  bubbleText: { color: C.navy, fontSize: 17, lineHeight: 21, textAlign: 'center' },
  tabs: { flexDirection: 'row', backgroundColor: C.navy, borderTopWidth: 3, borderColor: C.ink, paddingHorizontal: 6 },
  tab: { flex: 1, alignItems: 'center', paddingTop: 8, paddingBottom: 12, gap: 2 },
  tabText: { fontSize: 13, letterSpacing: 1.2 },
});
