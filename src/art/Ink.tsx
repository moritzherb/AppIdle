import { Circle, Defs, G, Path, Pattern, Rect } from 'react-native-svg';
import type { Direction } from '../theme/directions';

// One drawing primitive for every vector shape in the game. The same path
// data is "printed" differently depending on the art direction's treatment:
//   poster  - ink outline + navy offset shadow, halftone in shaded areas
//   cartoon - thick round outline, flat cel shading
//   riso    - no outline, fills off-register against a thin black key line
export type InkKind = 'fill' | 'shade' | 'flat' | 'line';

interface InkProps {
  d: string;
  dir: Direction;
  fill?: string;
  kind?: InkKind;
  /** Multiplier for stroke widths and offsets (icons are drawn smaller). */
  k?: number;
  opacity?: number;
}

export function Ink({ d, dir, fill = 'none', kind = 'fill', k = 1, opacity = 1 }: InkProps) {
  const t = dir.treatment;

  if (kind === 'line') {
    const w = (t === 'cartoon' ? 3 : t === 'poster' ? 2.2 : 1.6) * k;
    return (
      <Path
        d={d}
        fill="none"
        stroke={dir.ink}
        strokeWidth={w}
        strokeLinecap="round"
        strokeLinejoin="round"
        transform={t === 'riso' ? `translate(${0.7 * k},${-0.5 * k})` : undefined}
        opacity={opacity}
      />
    );
  }

  if (kind === 'flat') {
    return <Path d={d} fill={fill} opacity={opacity} />;
  }

  if (kind === 'shade') {
    if (t === 'poster') {
      return (
        <G opacity={opacity}>
          <Path d={d} fill={fill} />
          <Path d={d} fill="url(#pl-halftone)" />
        </G>
      );
    }
    if (t === 'riso') return <Path d={d} fill={fill} opacity={0.34 * opacity} />;
    return <Path d={d} fill={fill} opacity={opacity} />;
  }

  if (t === 'poster') {
    const o = 2.4 * k;
    return (
      <G opacity={opacity}>
        <Path d={d} fill={dir.shadow} transform={`translate(${o},${o})`} />
        <Path d={d} fill={fill} stroke={dir.ink} strokeWidth={dir.strokeWidth * k} strokeLinejoin="round" />
      </G>
    );
  }
  if (t === 'cartoon') {
    return (
      <Path
        d={d}
        fill={fill}
        stroke={dir.ink}
        strokeWidth={dir.strokeWidth * k}
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity={opacity}
      />
    );
  }
  const o = 0.9 * k;
  return (
    <G opacity={opacity}>
      <Path d={d} fill={fill} transform={`translate(${-o},${o * 0.6})`} opacity={0.94} />
      <Path
        d={d}
        fill="none"
        stroke={dir.ink}
        strokeWidth={dir.strokeWidth * k}
        strokeLinejoin="round"
        transform={`translate(${o},${-o * 0.6})`}
        opacity={0.85}
      />
    </G>
  );
}

/** Shared pattern definitions. Include once inside every <Svg> that uses them. */
export function InkDefs() {
  return (
    <Defs>
      <Pattern id="pl-halftone" patternUnits="userSpaceOnUse" width={4} height={4} patternTransform="rotate(45)">
        <Circle cx={2} cy={2} r={0.95} fill="#1A1A1A" opacity={0.42} />
      </Pattern>
      <Pattern id="pl-halftone-big" patternUnits="userSpaceOnUse" width={9} height={9} patternTransform="rotate(30)">
        <Circle cx={4.5} cy={4.5} r={2.1} fill="#1A1A1A" opacity={0.16} />
      </Pattern>
      <Pattern id="pl-grain" patternUnits="userSpaceOnUse" width={11} height={11}>
        <Rect x={1} y={2} width={0.9} height={0.9} fill="#222" opacity={0.22} />
        <Rect x={6} y={1} width={0.7} height={0.7} fill="#222" opacity={0.16} />
        <Rect x={8.5} y={6} width={1} height={1} fill="#222" opacity={0.2} />
        <Rect x={3.5} y={8} width={0.8} height={0.8} fill="#222" opacity={0.14} />
        <Rect x={9.5} y={9.6} width={0.6} height={0.6} fill="#fff" opacity={0.35} />
        <Rect x={4.6} y={4.4} width={0.6} height={0.6} fill="#fff" opacity={0.3} />
      </Pattern>
      <Pattern id="pl-dither" patternUnits="userSpaceOnUse" width={3} height={3}>
        <Rect x={0} y={0} width={1.5} height={1.5} fill="#222" opacity={0.35} />
      </Pattern>
    </Defs>
  );
}

/** Mirror absolute-coordinate path data (M/L/C/Q/Z only) across x = axis. */
export function mirrorX(d: string, axis = 100): string {
  let i = 0;
  return d.replace(/-?\d*\.?\d+/g, (n) => {
    const v = parseFloat(n);
    const out = i % 2 === 0 ? 2 * axis - v : v;
    i++;
    return String(Math.round(out * 100) / 100);
  });
}

/** Ellipse as path data, so it can go through the Ink pipeline too. */
export function ellipse(cx: number, cy: number, rx: number, ry: number): string {
  const k = 0.5523;
  return [
    `M${cx - rx},${cy}`,
    `C${cx - rx},${cy - ry * k} ${cx - rx * k},${cy - ry} ${cx},${cy - ry}`,
    `C${cx + rx * k},${cy - ry} ${cx + rx},${cy - ry * k} ${cx + rx},${cy}`,
    `C${cx + rx},${cy + ry * k} ${cx + rx * k},${cy + ry} ${cx},${cy + ry}`,
    `C${cx - rx * k},${cy + ry} ${cx - rx},${cy + ry * k} ${cx - rx},${cy}`,
    'Z',
  ].join(' ');
}
