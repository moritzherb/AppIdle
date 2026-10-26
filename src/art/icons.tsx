import type { ReactNode } from 'react';
import { View } from 'react-native';
import Svg, { G } from 'react-native-svg';
import type { Direction } from '../theme/directions';
import { Ink, InkDefs, ellipse } from './Ink';

// Hand-drawn icon set on a 32 x 32 grid. No icon fonts, no emoji.
export type IconName =
  | 'hunger'
  | 'fuel'
  | 'energy'
  | 'mood'
  | 'pump'
  | 'coin'
  | 'gym'
  | 'kitchen'
  | 'bedroom'
  | 'locker'
  | 'arena';

interface IconProps {
  name: IconName;
  dir: Direction;
  size?: number;
  /** Main colour; each icon picks supporting colours from `accent`/`light`. */
  color: string;
  accent?: string;
  light?: string;
}

export function Icon({ name, dir, size = 28, color, accent = color, light = '#FFFFFF' }: IconProps) {
  const k = 0.7;
  const P = (d: string, fill: string, kind?: 'fill' | 'flat' | 'line' | 'shade') => (
    <Ink d={d} dir={dir} fill={fill} kind={kind} k={k} />
  );
  let body: ReactNode = null;

  switch (name) {
    case 'hunger': // bowl with steam
      body = (
        <>
          {P('M11,9 C9,7 11,5 10,3', 'none', 'line')}
          {P('M16,9 C14,7 16,5 15,3', 'none', 'line')}
          {P('M21,9 C19,7 21,5 20,3', 'none', 'line')}
          {P('M4,14 L28,14 C28,22 23,27 16,27 C9,27 4,22 4,14 Z', color)}
          {P('M6,14 C8,11 12,10 16,11 C20,10 24,11 26,14 Z', accent)}
          {P('M10,29 L22,29 L21,27 L11,27 Z', color)}
        </>
      );
      break;
    case 'fuel': // shaker bottle
      body = (
        <>
          {P('M12,2 L20,2 L20,6 L12,6 Z', accent)}
          {P('M9,7 L23,7 L23,10 L9,10 Z', accent)}
          {P('M9.5,10 L22.5,10 L21,28 C21,29.5 20,30 19,30 L13,30 C12,30 11,29.5 11,28 Z', color)}
          {P('M10.4,16 L21.6,16 L21.1,22 L10.9,22 Z', light, 'flat')}
        </>
      );
      break;
    case 'energy': // battery
      body = (
        <>
          {P('M4,9 L25,9 L25,25 L4,25 Z', light)}
          {P('M25,13 L29,13 L29,21 L25,21 Z', color)}
          {P('M7,12 L13,12 L13,22 L7,22 Z', color, 'flat')}
          {P('M14.5,12 L20.5,12 L20.5,22 L14.5,22 Z', color, 'flat')}
        </>
      );
      break;
    case 'mood': // grin
      body = (
        <>
          {P(ellipse(16, 16, 12.5, 12.5), color)}
          {P(ellipse(11.5, 13, 1.8, 2.4), '#1A1A1A', 'flat')}
          {P(ellipse(20.5, 13, 1.8, 2.4), '#1A1A1A', 'flat')}
          {P('M9,18 C11,25 21,25 23,18 C19,20 13,20 9,18 Z', accent)}
        </>
      );
      break;
    case 'pump': // flexed arm
      body = (
        <>
          {P(
            'M5,27 C3,20 6,15 11,13 L13,6 C13.5,3.5 18,3 18.5,6 L18,11 C22,10.5 27,13 27.5,18 C28,24 23,28 17,28 L8,28 C6.5,28 5.5,27.8 5,27 Z',
            color,
          )}
          {P('M12,19 C14,16 19,16 21,19', 'none', 'line')}
        </>
      );
      break;
    case 'coin':
      body = (
        <>
          {P(ellipse(16, 16, 13, 13), color)}
          {P(ellipse(16, 16, 8.6, 8.6), accent)}
          {P('M16,9.5 L18,14 L22.6,14.3 L19,17.3 L20.2,21.8 L16,19.2 L11.8,21.8 L13,17.3 L9.4,14.3 L14,14 Z', color, 'flat')}
        </>
      );
      break;
    case 'gym': // dumbbell
      body = (
        <G transform="rotate(-20 16 16)">
          {P('M9,14.5 L23,14.5 L23,17.5 L9,17.5 Z', accent)}
          {P('M3,9 L9,9 L9,23 L3,23 Z', color)}
          {P('M23,9 L29,9 L29,23 L23,23 Z', color)}
          {P('M0.5,12 L3,12 L3,20 L0.5,20 Z', color)}
          {P('M29,12 L31.5,12 L31.5,20 L29,20 Z', color)}
        </G>
      );
      break;
    case 'kitchen': // frying pan with egg
      body = (
        <>
          {P('M21,18 L30,25 L28,27.5 L19,21 Z', accent)}
          {P(ellipse(13, 15, 11, 9.5), color)}
          {P('M7,14 C6,9 12,7 15,9 C19,8 21,12 19,16 C18,20 11,21 8.5,18 C7,17 7,15.5 7,14 Z', light)}
          {P(ellipse(13.5, 13.5, 3, 3), accent, 'flat')}
        </>
      );
      break;
    case 'bedroom': // moon and pillow
      body = (
        <>
          {P('M4,22 C4,18 7,17 16,17 C25,17 28,18 28,22 C28,26 25,27 16,27 C7,27 4,26 4,22 Z', light)}
          {P('M17,3 C11,4 9,11 12,15 C15,18 21,17 23,12 C19,14 15,11 16,7 C16,5.5 16.5,4 17,3 Z', color)}
        </>
      );
      break;
    case 'locker': // tank top
      body = (
        <>
          {P(
            'M9,3 L13,3 C13.5,7 18.5,7 19,3 L23,3 C22.5,8 24,11 26,13 L26,28 C26,29 25,30 24,30 L8,30 C7,30 6,29 6,28 L6,13 C8,11 9.5,8 9,3 Z',
            color,
          )}
          {P('M6.2,20 L25.8,20 L25.8,23 L6.2,23 Z', accent, 'flat')}
        </>
      );
      break;
    case 'arena': // trophy
      body = (
        <>
          {P('M6,6 C1,6 1,14 8,15 M26,6 C31,6 31,14 24,15', 'none', 'line')}
          {P('M8,4 L24,4 L23,13 C22,18 19,20 16,20 C13,20 10,18 9,13 Z', color)}
          {P('M14,20 L18,20 L18.5,24 L13.5,24 Z', color)}
          {P('M10,24 L22,24 L23,29 L9,29 Z', accent)}
          {P('M12,7 L14,7 L13.5,13 L12.5,13 Z', light, 'flat')}
        </>
      );
      break;
  }

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="-1 -1 34 34">
        <InkDefs />
        {body}
      </Svg>
    </View>
  );
}
