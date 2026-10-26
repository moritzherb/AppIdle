import { useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, type GestureResponderEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { AthleteHandle } from '../character/Athlete';
import { haptics } from '../services/haptics';
import { DIRECTIONS, type Direction, type Sex } from '../theme/directions';
import { cartoonSkin } from './cartoon';
import { posterSkin } from './poster';
import { risoSkin } from './riso';
import { SampleScreen } from './SampleScreen';
import type { Skin } from './shared';

// Milestone 0 only: compare the three directions on the same sample screen.

const SKINS: Record<Direction['id'], { skin: Skin; floor: string }> = {
  A: { skin: posterSkin, floor: '#1B2A4A' },
  B: { skin: cartoonSkin, floor: '#B6E33B' },
  C: { skin: risoSkin, floor: '#3FB97F' },
};

const LAB_INK = '#141414';
const LAB_PAPER = '#EDEDE6';

export function LabScreen() {
  const insets = useSafeAreaInsets();
  const [dirId, setDirId] = useState<Direction['id']>('A');
  const [sex, setSex] = useState<Sex>('man');
  const [spec, setSpec] = useState(false);
  const athlete = useRef<AthleteHandle>(null);
  const dir = DIRECTIONS.find((d) => d.id === dirId)!;
  const { skin, floor } = SKINS[dirId];

  const look = (e: GestureResponderEvent | { nativeEvent: { pageX: number; pageY: number } }) => {
    athlete.current?.lookAt(e.nativeEvent.pageX, e.nativeEvent.pageY);
  };

  return (
    <View
      style={{ flex: 1, backgroundColor: LAB_INK }}
      onTouchStart={look}
      onTouchMove={look}
      onPointerMove={(e) => look(e as unknown as { nativeEvent: { pageX: number; pageY: number } })}
    >
      <View style={[styles.lab, { paddingTop: insets.top + 6 }]}>
        <View style={styles.row}>
          {DIRECTIONS.map((d) => (
            <Chip
              key={d.id}
              on={d.id === dirId}
              label={`${d.id}  ${d.name}`}
              onPress={() => {
                setDirId(d.id);
                haptics.tap();
              }}
              flex
            />
          ))}
        </View>
        <View style={styles.row}>
          <Chip on={sex === 'woman'} label="Woman" onPress={() => setSex('woman')} />
          <Chip on={sex === 'man'} label="Man" onPress={() => setSex('man')} />
          <View style={{ flex: 1 }} />
          <Chip on={spec} label={spec ? 'Close spec' : 'Spec sheet'} onPress={() => setSpec((v) => !v)} />
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <SampleScreen
          key={`${dirId}-${sex}`}
          dir={dir}
          skin={skin}
          floor={floor}
          sex={sex}
          bottomInset={insets.bottom}
          athlete={athlete}
        />
        {spec ? <SpecSheet dir={dir} bottom={insets.bottom} /> : null}
      </View>
    </View>
  );
}

function Chip({ on, label, onPress, flex }: { on: boolean; label: string; onPress: () => void; flex?: boolean }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, on && styles.chipOn, flex && { flex: 1 }]} accessibilityRole="button">
      <Text numberOfLines={1} style={[styles.chipText, on && { color: LAB_INK }]}>
        {label}
      </Text>
    </Pressable>
  );
}

function SpecSheet({ dir, bottom }: { dir: Direction; bottom: number }) {
  const sample = dir.treatment === 'poster' ? 'SQUAT 140' : dir.treatment === 'cartoon' ? 'Squat 140!' : 'SQUAT 140';
  return (
    <ScrollView
      style={[StyleSheet.absoluteFill, { backgroundColor: dir.bg }]}
      contentContainerStyle={{ padding: 20, paddingBottom: bottom + 30, gap: 18 }}
    >
      <View>
        <Text style={[styles.specKicker, { fontFamily: dir.fonts.bodyBold, color: dir.ink }]}>DIRECTION {dir.id}</Text>
        <Text style={{ fontFamily: dir.fonts.display, fontSize: 40, lineHeight: 46, color: dir.ink }}>{dir.name}</Text>
        <Text style={{ fontFamily: dir.fonts.body, fontSize: 16, lineHeight: 22, color: dir.ink }}>{dir.tagline}</Text>
      </View>

      <View style={{ gap: 8 }}>
        <Text style={[styles.specKicker, { fontFamily: dir.fonts.bodyBold, color: dir.ink }]}>PALETTE</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {dir.palette.map((p) => (
            <View key={p.hex} style={{ width: 96, gap: 4 }}>
              <View style={{ height: 56, backgroundColor: p.hex, borderWidth: 2, borderColor: dir.ink }} />
              <Text style={{ fontFamily: dir.fonts.bodyBold, fontSize: 13, color: dir.ink }}>{p.name}</Text>
              <Text style={{ fontFamily: dir.fonts.body, fontSize: 13, color: dir.ink }}>{p.hex}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={{ gap: 6 }}>
        <Text style={[styles.specKicker, { fontFamily: dir.fonts.bodyBold, color: dir.ink }]}>TYPE</Text>
        <Text style={{ fontFamily: dir.fonts.display, fontSize: 52, lineHeight: 58, color: dir.ink }}>{sample}</Text>
        <Text style={{ fontFamily: dir.fonts.body, fontSize: 14, color: dir.ink }}>Display: {dir.fontNames.display}</Text>
        <Text style={{ fontFamily: dir.fonts.body, fontSize: 17, lineHeight: 24, color: dir.ink }}>
          Body: {dir.fontNames.body}. Rosa ate three good meals and slept like a log. Pump is high, fuel is full: gains
          incoming.
        </Text>
      </View>

      <View style={{ gap: 10 }}>
        <Text style={[styles.specKicker, { fontFamily: dir.fonts.bodyBold, color: dir.ink }]}>RULES</Text>
        {(
          [
            ['Shapes', dir.notes.shapes],
            ['Outline', dir.notes.outline],
            ['Texture', dir.notes.texture],
            ['UI objects', dir.notes.ui],
          ] as const
        ).map(([k, v]) => (
          <View key={k}>
            <Text style={{ fontFamily: dir.fonts.bodyBold, fontSize: 15, color: dir.ink }}>{k}</Text>
            <Text style={{ fontFamily: dir.fonts.body, fontSize: 15, lineHeight: 21, color: dir.ink }}>{v}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  lab: { paddingHorizontal: 10, paddingBottom: 8, gap: 6, backgroundColor: LAB_INK },
  row: { flexDirection: 'row', gap: 6 },
  chip: { borderWidth: 1.5, borderColor: LAB_PAPER, paddingHorizontal: 8, paddingVertical: 5 },
  chipOn: { backgroundColor: LAB_PAPER },
  chipText: { color: LAB_PAPER, fontFamily: 'BarlowSemiCondensed_700Bold', fontSize: 13, letterSpacing: 0.4 },
  specKicker: { fontSize: 12, letterSpacing: 2 },
});
