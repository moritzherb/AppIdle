import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import Svg, { G, Path } from 'react-native-svg';
import { Icon } from '../art/icons';
import { Ink, InkDefs, ellipse } from '../art/Ink';
import type { Direction } from '../theme/directions';
import { METERS, OffsetText, ROOMS, useMeter, type MeterKey, type Skin } from './shared';

const C = {
  tomato: '#FF5A36',
  sky: '#4FC3E8',
  skyDeep: '#3BAFD6',
  lime: '#B6E33B',
  butter: '#FFD84A',
  gum: '#FF8FB1',
  ink: '#20141A',
  paper: '#FFF6E5',
};

const METER_COLOR: Record<MeterKey, string> = {
  hunger: C.tomato,
  fuel: C.butter,
  energy: C.lime,
  mood: C.gum,
  pump: C.sky,
};

const Backdrop: Skin['Backdrop'] = ({ dir }) => (
  <Svg style={StyleSheet.absoluteFill} viewBox="0 0 400 760" preserveAspectRatio="xMidYMax slice">
    <InkDefs />
    <Path d="M0,0 L400,0 L400,760 L0,760 Z" fill={C.sky} />
    {/* wobbly wallpaper stripes */}
    {[30, 120, 210, 300, 390].map((x) => (
      <Path key={x} d={`M${x},0 C${x + 14},120 ${x - 14},260 ${x},400 C${x + 14},520 ${x - 10},600 ${x},640 L${x + 34},640 C${x + 24},600 ${x + 48},520 ${x + 34},400 C${x + 20},260 ${x + 48},120 ${x + 34},0 Z`} fill={C.skyDeep} />
    ))}
    {/* window */}
    <Ink dir={dir} fill={C.paper} d="M34,206 C34,196 40,190 52,190 L148,192 C158,192 164,198 164,208 L162,318 C162,328 156,332 146,332 L50,330 C40,330 34,324 34,314 Z" />
    <Ink dir={dir} fill="#9BE3F7" d="M50,206 L148,207 L147,316 L51,315 Z" />
    <Ink dir={dir} fill={C.paper} d="M62,262 C56,252 66,242 76,248 C80,236 98,236 102,248 C112,244 120,254 114,262 Z" k={0.8} />
    <Ink dir={dir} fill="#FFFFFF" kind="flat" d="M58,214 L78,214 L60,236 Z" opacity={0.7} />
    <Ink dir={dir} fill={C.paper} d="M97,206 L101,206 L101,316 L97,316 Z" k={0.6} />
    {/* wall clock */}
    <Ink dir={dir} fill={C.butter} d={ellipse(322, 236, 34, 34)} />
    <Ink dir={dir} fill={C.paper} d={ellipse(322, 236, 23, 23)} k={0.8} />
    <Ink dir={dir} kind="line" d="M322,236 L322,220 M322,236 L333,242" k={1.1} />
    {/* baseboard + floor mat */}
    <Ink dir={dir} fill={C.butter} d="M-10,600 L410,600 L410,622 L-10,622 Z" />
    <Ink dir={dir} fill={C.lime} d="M48,640 L352,640 C366,640 376,650 380,662 L404,770 L-4,770 L20,662 C24,650 34,640 48,640 Z" />
    <Ink dir={dir} fill="#9BCB25" kind="flat" d="M70,668 L330,668 L334,680 L66,680 Z" />
    <Path d="M0,622 L400,622 L400,640 L0,640 Z" fill="#E7C247" />
    {/* plant */}
    <G>
      <Ink dir={dir} fill={C.lime} d="M44,520 C20,500 22,468 40,470 C52,472 54,500 50,520 Z" />
      <Ink dir={dir} fill={C.lime} d="M54,516 C58,480 82,462 92,476 C100,490 76,506 60,522 Z" />
      <Ink dir={dir} fill={C.lime} d="M48,524 C34,520 8,526 10,540 C12,552 36,544 50,532 Z" />
      <Ink dir={dir} fill={C.gum} d="M22,530 L80,530 L72,598 C72,602 68,604 64,604 L38,604 C34,604 30,602 30,598 Z" />
      <Ink dir={dir} fill="#FFFFFF" kind="flat" d="M32,540 L40,540 L37,580 L34,580 Z" opacity={0.55} />
    </G>
    {/* dumbbell rack */}
    <Ink dir={dir} fill={C.tomato} d="M286,520 C286,514 290,510 296,510 L374,510 C380,510 384,514 384,520 L384,528 L286,528 Z" />
    <Ink dir={dir} fill={C.tomato} d="M296,528 L306,528 L304,602 L298,602 Z" />
    <Ink dir={dir} fill={C.tomato} d="M364,528 L374,528 L372,602 L366,602 Z" />
    {[302, 342].map((x, i) => (
      <G key={x}>
        <Ink dir={dir} fill={C.paper} d={`M${x + 6},496 L${x + 30},496 L${x + 30},502 L${x + 6},502 Z`} k={0.7} />
        <Ink dir={dir} fill={i ? C.gum : C.butter} d={ellipse(x + 4, 499, 8, 12)} k={0.85} />
        <Ink dir={dir} fill={i ? C.gum : C.butter} d={ellipse(x + 32, 499, 8, 12)} k={0.85} />
      </G>
    ))}
  </Svg>
);

const Header: Skin['Header'] = ({ dir, name, stage, path, coins }) => (
  <View style={cs.header}>
    <View style={{ flexShrink: 1, alignItems: 'flex-start' }}>
      <View style={[cs.sticker, { transform: [{ rotate: '-3deg' }] }]}>
        <Text style={[cs.name, { fontFamily: dir.fonts.display }]}>{name}</Text>
      </View>
      <View style={[cs.subSticker, { transform: [{ rotate: '2deg' }] }]}>
        <Text style={[cs.subText, { fontFamily: dir.fonts.bodyBold }]}>
          {stage} {path}
        </Text>
      </View>
    </View>
    <View style={cs.coins}>
      <Icon name="coin" dir={dir} size={28} color={C.butter} accent={C.tomato} />
      <Text style={[cs.coinText, { fontFamily: dir.fonts.display }]}>{coins}</Text>
    </View>
  </View>
);

function Badge({ dir, k, icon, label, value }: { dir: Direction; k: MeterKey; icon: (typeof METERS)[number]['icon']; label: string; value: number }) {
  const { level, pop } = useMeter(value);
  const fill = useAnimatedStyle(() => ({ height: `${Math.max(0, Math.min(1, level.value)) * 100}%` }));
  const bounce = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + pop.value * 0.16 }, { rotate: `${pop.value * -6}deg` }],
  }));
  return (
    <View style={{ alignItems: 'center', gap: 3, flex: 1 }}>
      <Animated.View style={[cs.badge, bounce]}>
        <Animated.View style={[cs.badgeFill, { backgroundColor: METER_COLOR[k] }, fill]}>
          <View style={cs.badgeShine} />
        </Animated.View>
        <View style={StyleSheet.absoluteFill}>
          <View style={cs.badgeIcon}>
            <Icon name={icon} dir={dir} size={30} color={C.paper} accent={METER_COLOR[k] === C.paper ? C.tomato : C.ink} light={C.paper} />
          </View>
        </View>
      </Animated.View>
      <Text style={[cs.badgeLabel, { fontFamily: dir.fonts.display }]}>{label}</Text>
    </View>
  );
}

const Meters: Skin['Meters'] = ({ dir, values }) => (
  <View style={cs.meters}>
    {METERS.map((m) => (
      <Badge key={m.key} dir={dir} k={m.key} icon={m.icon} label={m.label} value={values[m.key]} />
    ))}
  </View>
);

const Button: Skin['Button'] = ({ dir, label, icon, variant, onPress }) => {
  const press = useSharedValue(0);
  const face = useAnimatedStyle(() => ({ transform: [{ translateY: press.value * 6 }] }));
  const bg = variant === 0 ? C.tomato : C.lime;
  return (
    <Pressable
      onPressIn={() => (press.value = withTiming(1, { duration: 50 }))}
      onPressOut={() => (press.value = withSpring(0, { damping: 6, stiffness: 320 }))}
      onPress={onPress}
      style={{ flex: 1 }}
      accessibilityRole="button"
    >
      <View style={cs.btnLip} />
      <Animated.View style={[cs.btn, { backgroundColor: bg }, face]}>
        <View style={cs.btnShine} pointerEvents="none" />
        <Icon name={icon} dir={dir} size={32} color={C.paper} accent={C.butter} light={C.paper} />
        <OffsetText style={[cs.btnText, { fontFamily: dir.fonts.display }]} shadowColor={C.ink} dx={0} dy={3}>
          {label}
        </OffsetText>
      </Animated.View>
    </Pressable>
  );
};

const Bubble: Skin['Bubble'] = ({ dir, text }) => (
  <View style={{ alignItems: 'center' }}>
    <View style={cs.bubble}>
      <Text style={[cs.bubbleText, { fontFamily: dir.fonts.bodyBold }]}>{text}</Text>
    </View>
    <Svg width={34} height={20} viewBox="0 0 34 20" style={{ marginTop: -4 }}>
      <Path d="M4,1 C12,4 20,4 30,1 C24,8 18,14 8,19 C11,13 10,7 4,1 Z" fill={C.paper} stroke={C.ink} strokeWidth={4} strokeLinejoin="round" />
      <Path d="M3,0 L31,0 L31,3.4 L3,3.4 Z" fill={C.paper} />
    </Svg>
  </View>
);

const Tabs: Skin['Tabs'] = ({ dir, active, onSelect }) => (
  <View style={cs.tabs}>
    {ROOMS.map((r) => {
      const on = r.key === active;
      return (
        <Pressable key={r.key} onPress={() => onSelect(r.key)} style={cs.tab} accessibilityRole="tab">
          <View style={[cs.tabDisc, on && cs.tabDiscOn]}>
            <Icon name={r.icon} dir={dir} size={28} color={on ? C.tomato : C.sky} accent={C.butter} light={C.paper} />
          </View>
          <Text style={[cs.tabText, { fontFamily: dir.fonts.display }]}>{r.label}</Text>
        </Pressable>
      );
    })}
  </View>
);

export const cartoonSkin: Skin = { Backdrop, Header, Meters, Button, Bubble, Tabs };

const cs = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 16, gap: 10 },
  sticker: {
    backgroundColor: C.paper,
    borderWidth: 4,
    borderBottomWidth: 8,
    borderColor: C.ink,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 2,
    paddingBottom: 2,
  },
  name: { fontSize: 40, lineHeight: 48, color: C.tomato },
  subSticker: {
    marginTop: -4,
    marginLeft: 22,
    backgroundColor: C.butter,
    borderWidth: 3,
    borderColor: C.ink,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  subText: { fontSize: 12, color: C.ink, letterSpacing: 0.4 },
  coins: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: C.butter,
    borderWidth: 4,
    borderBottomWidth: 7,
    borderColor: C.ink,
    borderRadius: 30,
    paddingLeft: 6,
    paddingRight: 14,
    paddingVertical: 3,
    marginTop: 6,
  },
  coinText: { fontSize: 26, color: C.ink },
  meters: { flexDirection: 'row', paddingHorizontal: 10, marginTop: 12 },
  badge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 4,
    borderColor: C.ink,
    backgroundColor: C.paper,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  badgeFill: { width: '100%', borderTopWidth: 3, borderColor: C.ink },
  badgeShine: { position: 'absolute', top: 3, left: 8, width: 12, height: 4, borderRadius: 2, backgroundColor: '#FFFFFF', opacity: 0.6 },
  badgeIcon: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  badgeLabel: { fontSize: 14, color: C.ink },
  btnLip: { position: 'absolute', left: 0, right: 0, top: 8, bottom: -6, borderRadius: 40, backgroundColor: C.ink },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 4,
    borderColor: C.ink,
    borderRadius: 40,
    paddingVertical: 9,
  },
  btnShine: { position: 'absolute', top: 6, left: 18, width: 28, height: 7, borderRadius: 4, backgroundColor: '#FFFFFF', opacity: 0.55 },
  btnText: { fontSize: 28, lineHeight: 34, color: C.paper },
  bubble: {
    backgroundColor: C.paper,
    borderWidth: 4,
    borderColor: C.ink,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 9,
    maxWidth: 280,
  },
  bubbleText: { color: C.ink, fontSize: 16, lineHeight: 21, textAlign: 'center' },
  tabs: {
    flexDirection: 'row',
    backgroundColor: C.paper,
    borderWidth: 4,
    borderBottomWidth: 0,
    borderColor: C.ink,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 6,
    marginHorizontal: -2,
  },
  tab: { flex: 1, alignItems: 'center', paddingTop: 6, paddingBottom: 10 },
  tabDisc: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  tabDiscOn: { backgroundColor: C.butter, borderWidth: 4, borderColor: C.ink, marginTop: -18, width: 52, height: 52, borderRadius: 26 },
  tabText: { fontSize: 13, color: C.ink },
});
