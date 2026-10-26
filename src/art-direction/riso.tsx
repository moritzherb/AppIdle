import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import Svg, { Circle, G, Path, Rect } from 'react-native-svg';
import { Icon } from '../art/icons';
import { Ink, InkDefs, ellipse } from '../art/Ink';
import { METERS, OffsetText, ROOMS, pad4, useMeter, type MeterKey, type Skin } from './shared';

const C = {
  pink: '#FF48B0',
  blue: '#0078BF',
  yellow: '#FFE800',
  green: '#00A95C',
  paper: '#F5EFE0',
  black: '#222222',
};

const METER_INK: Record<MeterKey, string> = {
  hunger: C.pink,
  fuel: C.blue,
  energy: C.green,
  mood: C.yellow,
  pump: C.pink,
};

/** Tape strip with torn zigzag ends, stretched to its box. */
function Tape({ color, opacity = 0.92 }: { color: string; opacity?: number }) {
  return (
    <Svg style={StyleSheet.absoluteFill} viewBox="0 0 200 40" preserveAspectRatio="none">
      <Path
        d="M6,0 L194,0 L200,5 L195,10 L200,15 L195,20 L200,25 L195,30 L200,35 L194,40 L6,40 L0,35 L5,30 L0,25 L5,20 L0,15 L5,10 L0,5 Z"
        fill={color}
        opacity={opacity}
      />
    </Svg>
  );
}

const Backdrop: Skin['Backdrop'] = ({ dir }) => (
  <Svg style={StyleSheet.absoluteFill} viewBox="0 0 400 760" preserveAspectRatio="xMidYMax slice">
    <InkDefs />
    <Rect x={0} y={0} width={400} height={760} fill={C.paper} />
    {/* sun + overprinted panels */}
    <Circle cx={318} cy={250} r={96} fill={C.yellow} opacity={0.95} />
    <Path d="M40,330 L292,300 L310,600 L58,620 Z" fill={C.pink} opacity={0.82} />
    <Path d="M120,250 L360,270 L344,520 L104,500 Z" fill={C.blue} opacity={0.55} />
    <Circle cx={318} cy={250} r={96} fill="url(#pl-dither)" opacity={0.25} />
    {/* barbell rack, key-line only */}
    <G transform="translate(2,-1)" opacity={0.9}>
      <Path d="M300,470 L392,470 M314,470 L314,600 M380,470 L380,600" stroke={C.black} strokeWidth={4} />
      <Path d="M286,460 L406,460" stroke={C.black} strokeWidth={3} />
    </G>
    <Ink dir={dir} fill={C.green} d={ellipse(300, 460, 10, 26)} k={1.2} />
    <Ink dir={dir} fill={C.green} d={ellipse(392, 460, 10, 26)} k={1.2} />
    {/* floor band */}
    <Rect x={0} y={604} width={400} height={160} fill={C.green} opacity={0.9} />
    <Rect x={0} y={604} width={400} height={160} fill="url(#pl-dither)" opacity={0.45} />
    <Path d="M0,606 L400,602" stroke={C.black} strokeWidth={2} />
    {/* plates leaning on wall */}
    <Ink dir={dir} fill={C.blue} d={ellipse(46, 568, 36, 36)} k={1.2} />
    <Ink dir={dir} fill={C.pink} d={ellipse(70, 580, 24, 24)} k={1.2} />
    <Circle cx={70} cy={580} r={5} fill={C.paper} />
    <Circle cx={46} cy={568} r={6} fill={C.paper} />
  </Svg>
);

const Header: Skin['Header'] = ({ dir, name, stage, path, coins }) => (
  <View style={rs.header}>
    <View style={{ flexShrink: 1 }}>
      <OffsetText
        style={[rs.name, { fontFamily: dir.fonts.display }]}
        shadowColor={C.blue}
        dx={-2.5}
        dy={2}
        shadowOpacity={0.85}
      >
        {name.toUpperCase()}
      </OffsetText>
      <View style={rs.stageTape}>
        <Tape color={C.yellow} />
        <Text style={[rs.stageText, { fontFamily: dir.fonts.bodyBold }]}>
          {stage.toUpperCase()} / {path.toUpperCase()}
        </Text>
      </View>
    </View>
    <View style={rs.ticket}>
      <View style={[rs.notch, { left: -7 }]} />
      <View style={[rs.notch, { right: -7 }]} />
      <Text style={[rs.ticketSmall, { fontFamily: dir.fonts.bodyBold }]}>COINS</Text>
      <View style={rs.perf} />
      <Text style={[rs.ticketBig, { fontFamily: dir.fonts.display }]}>{pad4(coins)}</Text>
    </View>
  </View>
);

function InkBar({ value, color }: { value: number; color: string }) {
  const { level, pop } = useMeter(value);
  const fill = useAnimatedStyle(() => ({
    width: `${Math.max(0, Math.min(1, level.value)) * 100}%`,
    transform: [{ translateY: -pop.value * 2 }],
  }));
  return (
    <View style={rs.bar}>
      <Animated.View style={[rs.barFill, { backgroundColor: color }, fill]}>
        <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
          <InkDefs />
          <Rect width="100%" height="100%" fill="url(#pl-dither)" opacity={0.5} />
        </Svg>
      </Animated.View>
      <View style={rs.barKey} pointerEvents="none" />
    </View>
  );
}

const Meters: Skin['Meters'] = ({ dir, values }) => (
  <View style={rs.meters}>
    {METERS.map((m) => (
      <View key={m.key} style={rs.meterCol}>
        <Icon name={m.icon} dir={dir} size={26} color={METER_INK[m.key]} accent={C.blue} light={C.paper} />
        <Text style={[rs.meterLabel, { fontFamily: dir.fonts.bodyBold }]}>{m.label.toUpperCase()}</Text>
        <InkBar value={values[m.key]} color={METER_INK[m.key]} />
      </View>
    ))}
  </View>
);

const Button: Skin['Button'] = ({ dir, label, icon, variant, onPress }) => {
  const press = useSharedValue(0);
  const face = useAnimatedStyle(() => ({
    transform: [{ rotate: `${variant === 0 ? -2 : 1.5}deg` }, { scale: 1 - press.value * 0.05 }],
  }));
  return (
    <Pressable
      onPressIn={() => (press.value = withTiming(1, { duration: 50 }))}
      onPressOut={() => (press.value = withSpring(0, { damping: 6, stiffness: 300 }))}
      onPress={onPress}
      style={{ flex: 1 }}
      accessibilityRole="button"
    >
      <Animated.View style={[rs.btn, face]}>
        <Tape color={variant === 0 ? C.yellow : C.pink} />
        <Icon name={icon} dir={dir} size={28} color={variant === 0 ? C.pink : C.yellow} accent={C.blue} light={C.paper} />
        <OffsetText style={[rs.btnText, { fontFamily: dir.fonts.display }]} shadowColor={variant === 0 ? C.pink : C.blue} dx={-1.5} dy={1.5} shadowOpacity={0.8}>
          {label.toUpperCase()}
        </OffsetText>
      </Animated.View>
    </Pressable>
  );
};

const Bubble: Skin['Bubble'] = ({ dir, text }) => (
  <View style={{ alignItems: 'center' }}>
    <View style={rs.scrap}>
      <View style={rs.scrapKey} pointerEvents="none" />
      <View style={rs.scrapTape} />
      <Text style={[rs.bubbleText, { fontFamily: dir.fonts.body }]}>{text}</Text>
    </View>
  </View>
);

const Tabs: Skin['Tabs'] = ({ dir, active, onSelect }) => (
  <View style={rs.tabs}>
    {ROOMS.map((r) => {
      const on = r.key === active;
      return (
        <Pressable key={r.key} onPress={() => onSelect(r.key)} style={rs.tab} accessibilityRole="tab">
          <View style={rs.tabIconWrap}>
            {on ? <View style={rs.stamp} /> : null}
            <Icon name={r.icon} dir={dir} size={26} color={on ? C.yellow : C.paper} accent={on ? C.blue : C.pink} light={C.paper} />
          </View>
          <Text style={[rs.tabText, { fontFamily: dir.fonts.bodyBold, color: on ? C.yellow : C.paper }]}>
            {r.label.toUpperCase()}
          </Text>
        </Pressable>
      );
    })}
  </View>
);

export const risoSkin: Skin = { Backdrop, Header, Meters, Button, Bubble, Tabs };

const rs = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 16, gap: 10 },
  name: { fontSize: 44, lineHeight: 54, color: C.pink },
  stageTape: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 3, transform: [{ rotate: '-2deg' }], marginTop: -2 },
  stageText: { fontSize: 12, color: C.black, letterSpacing: 0.5 },
  ticket: {
    backgroundColor: C.blue,
    paddingHorizontal: 12,
    paddingVertical: 5,
    alignItems: 'center',
    marginTop: 8,
    transform: [{ rotate: '3deg' }],
  },
  notch: { position: 'absolute', top: '42%', width: 14, height: 14, borderRadius: 7, backgroundColor: C.paper },
  perf: { width: '100%', borderTopWidth: 1.5, borderStyle: 'dashed', borderColor: C.paper, marginVertical: 3 },
  ticketSmall: { fontSize: 11, color: C.paper, letterSpacing: 2 },
  ticketBig: { fontSize: 22, color: C.yellow, lineHeight: 28 },
  meters: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 10,
    paddingVertical: 8,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: C.black,
    borderStyle: 'dashed',
  },
  meterCol: { flex: 1, alignItems: 'center', gap: 3, paddingHorizontal: 3 },
  meterLabel: { fontSize: 11, color: C.black, letterSpacing: 0.6 },
  bar: { width: '100%', height: 10, marginTop: 1 },
  barFill: { position: 'absolute', left: -1.5, top: 1.5, height: '100%', opacity: 0.92, overflow: 'hidden' },
  barKey: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, borderWidth: 1.5, borderColor: C.black },
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12 },
  btnText: { fontSize: 24, lineHeight: 30, color: C.black },
  scrap: {
    backgroundColor: '#FFFBF0',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    maxWidth: 280,
    transform: [{ rotate: '-1.5deg' }],
  },
  scrapKey: { position: 'absolute', left: 2, top: -2, right: -2, bottom: 2, borderWidth: 1.5, borderColor: C.black },
  scrapTape: {
    position: 'absolute',
    top: -9,
    alignSelf: 'center',
    width: 64,
    height: 18,
    backgroundColor: C.yellow,
    opacity: 0.85,
    transform: [{ rotate: '4deg' }],
  },
  bubbleText: { color: C.black, fontSize: 15, lineHeight: 20, textAlign: 'center' },
  tabs: { flexDirection: 'row', backgroundColor: C.black, paddingHorizontal: 6 },
  tab: { flex: 1, alignItems: 'center', paddingTop: 8, paddingBottom: 12, gap: 2 },
  tabIconWrap: { width: 40, height: 34, alignItems: 'center', justifyContent: 'center' },
  stamp: { position: 'absolute', width: 38, height: 38, borderRadius: 19, backgroundColor: C.pink, left: 0, top: -2 },
  tabText: { fontSize: 11, letterSpacing: 0.8 },
});
