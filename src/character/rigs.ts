import { ellipse, mirrorX, type InkKind } from '../art/Ink';
import type { CharRole, Sex } from '../theme/directions';

// Character canvas is 200 x 320 units; feet stand on y = 303.
// Every part is drawn in canvas coordinates so layers can be stacked as
// full-size views and rotated around their joint (pivot) points.

export interface Shape {
  d: string;
  role?: CharRole;
  kind?: InkKind;
}

export interface ArmRig {
  shoulder: [number, number];
  elbow: [number, number];
  upper: Shape[];
  bicep: Shape[];
  bicepOrigin: [number, number];
  fore: Shape[];
}

export interface Rig {
  legs: Shape[];
  torso: Shape[];
  neck: Shape[];
  armFront: ArmRig; // viewer's left
  armBack: ArmRig; // viewer's right (mirrored)
  ponytail?: { pivot: [number, number]; shapes: Shape[] };
  hairBack: Shape[];
  head: Shape[];
  hairFront: Shape[];
  brows: Shape[];
  eyes: { left: [number, number]; right: [number, number]; r: number; pupil: number };
  lashes: Shape[];
  nose: Shape[];
  blush: Shape[];
  smile: Shape[];
  munch: Shape[];
  neckPivot: [number, number];
  waist: [number, number];
}

const both = (s: Shape): Shape[] => [s, { ...s, d: mirrorX(s.d) }];
const mirrorShapes = (shapes: Shape[]): Shape[] => shapes.map((s) => ({ ...s, d: mirrorX(s.d) }));

function mirrorArm(a: ArmRig): ArmRig {
  return {
    shoulder: [200 - a.shoulder[0], a.shoulder[1]],
    elbow: [200 - a.elbow[0], a.elbow[1]],
    upper: mirrorShapes(a.upper),
    bicep: mirrorShapes(a.bicep),
    bicepOrigin: [200 - a.bicepOrigin[0], a.bicepOrigin[1]],
    fore: mirrorShapes(a.fore),
  };
}

// ---------------------------------------------------------------- man

const manArm: ArmRig = {
  shoulder: [78, 150],
  elbow: [70, 184],
  upper: [
    {
      role: 'skin',
      d: 'M74,144 C82,142 86,150 84,158 L77,186 C75,192 63,191 63,185 L68,154 C69,149 71,145 74,144 Z',
    },
  ],
  bicep: [{ role: 'skin', d: 'M65,155 C54,159 54,178 64,181 C71,175 71,161 65,155 Z' }],
  bicepOrigin: [65, 168],
  fore: [
    { role: 'skin', d: 'M63,182 C64,178 76,178 77,184 L74,212 C73,218 62,218 62,212 Z' },
    { role: 'band', d: 'M62.5,201 L75.5,201 L75,208 L62.5,208 Z' },
    { role: 'skin', d: 'M59,213 C59,205 77,205 77,213 C77,221 73,225 68,225 C63,225 59,221 59,213 Z' },
    { kind: 'line', d: 'M64,214 C66,217 70,217 72,214' },
  ],
};

const MAN: Rig = {
  legs: [
    { role: 'skin', d: 'M80,244 L94,244 L93,290 L81,290 Z' },
    { role: 'skin', d: 'M106,244 L120,244 L119,290 L107,290 Z' },
    { role: 'sock', d: 'M80.5,276 L93.5,276 L93.5,291 L80.5,291 Z' },
    { role: 'sock', d: 'M106.5,276 L119.5,276 L119.5,291 L106.5,291 Z' },
    { role: 'topAlt', kind: 'flat', d: 'M81,279 L93,279 L93,282 L81,282 Z' },
    { role: 'topAlt', kind: 'flat', d: 'M107,279 L119,279 L119,282 L107,282 Z' },
    {
      role: 'shoe',
      d: 'M77,289 C78,284 96,284 97,290 L98,299 C98,302 96,303 94,303 L71,303 C67,303 66,300 68,297 C70,294 73,292 77,289 Z',
    },
    {
      role: 'shoe',
      d: 'M103,290 C104,284 122,284 123,289 C127,292 130,294 132,297 C134,300 133,303 129,303 L106,303 C104,303 102,302 102,299 Z',
    },
    { role: 'sole', d: 'M67.5,299 L98,299 L98,303 L71,303 C68,303 67,301 67.5,299 Z' },
    { role: 'sole', d: 'M102,299 L132.5,299 C133,301 132,303 129,303 L102,303 Z' },
  ],
  torso: [
    {
      role: 'skin',
      d: 'M76,146 C84,140 116,140 124,146 C128,160 130,180 131,200 C132,214 120,222 100,222 C80,222 68,214 69,200 C70,180 72,160 76,146 Z',
    },
    {
      role: 'top',
      d: 'M80,146 L88,146 C90,158 110,158 112,146 L120,146 C124,162 127,182 128,200 C129,213 118,220 100,220 C82,220 71,213 72,200 C73,182 76,162 80,146 Z',
    },
    { role: 'topAlt', kind: 'flat', d: 'M73.2,186 C90,191 110,191 126.8,186 L127.4,194 C110,199 90,199 72.6,194 Z' },
    { role: 'skinShade', kind: 'shade', d: 'M86,147 C90,155 110,155 114,147 C110,152 90,152 86,147 Z' },
    { role: 'shorts', d: 'M70,206 C88,212 112,212 130,206 L133,248 L104,250 L100,232 L96,250 L67,248 Z' },
    { role: 'skinShade', kind: 'shade', d: 'M70.5,207 C88,213 112,213 129.5,207 L130,214 C112,220 88,220 70,214 Z' },
    { kind: 'line', d: 'M100,214 L100,228' },
  ],
  neck: [
    { role: 'skin', d: 'M92,124 L108,124 L109,146 C104,150 96,150 91,146 Z' },
    { role: 'skinShade', kind: 'shade', d: 'M92,126 L108,126 L108.5,136 C103,140 97,140 91.5,136 Z' },
  ],
  armFront: manArm,
  armBack: mirrorArm(manArm),
  hairBack: [],
  head: [
    ...both({ role: 'skin', d: 'M63,80 C51,77 49,99 63,101 Z' }),
    ...both({ role: 'skinShade', kind: 'shade', d: 'M60,85 C55,86 55,94 60,96 Z' }),
    {
      role: 'skin',
      d: 'M62,58 C62,38 80,30 100,30 C120,30 138,38 138,58 L139,96 C139,118 122,128 100,128 C78,128 61,118 61,96 Z',
    },
    {
      role: 'skinShade',
      kind: 'shade',
      d: 'M66,104 C72,120 86,126 100,126 C114,126 128,120 134,104 C128,116 114,121 100,121 C86,121 72,116 66,104 Z',
    },
  ],
  hairFront: [
    {
      role: 'hair',
      d: 'M60,70 C54,40 76,20 102,22 C128,22 146,40 140,72 C138,62 132,56 124,56 C118,48 108,46 100,52 C92,46 80,48 76,56 C68,56 62,62 60,70 Z',
    },
    { role: 'hair', d: 'M96,27 C93,16 102,9 111,11 C105,15 104,21 108,26 Z' },
  ],
  brows: both({ role: 'hair', d: 'M75,72 C80,67 90,67 95,71 L94,76 C88,72.5 81,72.5 76,76.5 Z' }),
  eyes: { left: [85, 87], right: [115, 87], r: 9.5, pupil: 4.6 },
  lashes: [],
  nose: [{ kind: 'line', d: 'M98,92 C95.5,98 98,102 103,101' }],
  blush: [
    { role: 'blush', kind: 'flat', d: ellipse(73, 103, 6, 3.4) },
    { role: 'blush', kind: 'flat', d: ellipse(127, 103, 6, 3.4) },
  ],
  smile: [{ role: 'mouth', d: 'M88,107 C92,118 108,118 112,107 C104,110.5 96,110.5 88,107 Z' }],
  munch: [{ role: 'mouth', d: ellipse(100, 111, 7, 6) }],
  neckPivot: [100, 126],
  waist: [100, 222],
};

// -------------------------------------------------------------- woman

const womanArm: ArmRig = {
  shoulder: [79, 150],
  elbow: [71, 184],
  upper: [
    {
      role: 'skin',
      d: 'M75,144 C82,142 85,150 83,158 L77,186 C75,191 65,190 65,185 L69,154 C70,149 72,145 75,144 Z',
    },
  ],
  bicep: [{ role: 'skin', d: 'M67,156 C57,160 57,177 66,180 C72,174 72,162 67,156 Z' }],
  bicepOrigin: [67, 168],
  fore: [
    { role: 'skin', d: 'M65,182 C66,178 76,178 77,184 L74,211 C73,216 64,216 64,211 Z' },
    { role: 'band', d: 'M64.3,201 L76,201 L75.4,207 L64.2,207 Z' },
    { role: 'skin', d: 'M61.5,211 C61.5,204.5 76.5,204.5 76.5,211 C76.5,218 72.5,222 69,222 C65,222 61.5,218 61.5,211 Z' },
    { kind: 'line', d: 'M66,212 C67.5,214.5 70.5,214.5 72,212' },
  ],
};

const WOMAN: Rig = {
  legs: [
    { role: 'skin', d: 'M80,244 L95,244 C96,258 96,268 93,290 L82,290 C79,270 79,258 80,244 Z' },
    { role: 'skin', d: 'M105,244 L120,244 C121,258 121,270 118,290 L107,290 C104,268 104,258 105,244 Z' },
    { role: 'sock', d: 'M81.5,281 L93.8,281 L93.5,291 L81.8,291 Z' },
    { role: 'sock', d: 'M106.2,281 L118.5,281 L118.2,291 L106.5,291 Z' },
    {
      role: 'shoe',
      d: 'M78,289 C79,283 95,283 96,289 L97,299 C97,302 95,303 93,303 L72,303 C68,303 67,300 69,297 C71,294 74,292 78,289 Z',
    },
    {
      role: 'shoe',
      d: 'M104,289 C105,283 121,283 122,289 C126,292 129,294 131,297 C133,300 132,303 128,303 L107,303 C105,303 103,302 103,299 Z',
    },
    { role: 'sole', d: 'M68.5,299 L97,299 L97,303 L72,303 C69,303 68,301 68.5,299 Z' },
    { role: 'sole', d: 'M103,299 L131.5,299 C132,301 131,303 128,303 L103,303 Z' },
    { role: 'topAlt', kind: 'flat', d: 'M84,290 L92,288 L92.5,291 L84.5,293 Z' },
    { role: 'topAlt', kind: 'flat', d: 'M115.5,288 L108,290 L107.5,293 L115,291 Z' },
  ],
  torso: [
    {
      role: 'skin',
      d: 'M78,146 C86,140 114,140 122,146 C126,160 126,172 123,184 C121,192 122,200 126,210 L74,210 C78,200 79,192 77,184 C74,172 74,160 78,146 Z',
    },
    {
      role: 'top',
      d: 'M80,146 L88,146 C90,156 110,156 112,146 L120,146 C124,158 124,170 123.5,182 C108,186 92,186 76.5,182 C76,170 76,158 80,146 Z',
    },
    { role: 'topAlt', kind: 'flat', d: 'M77,175 C92,179 108,179 123,175 L123.3,181.5 C108,185.5 92,185.5 76.8,181.5 Z' },
    { role: 'skinShade', kind: 'shade', d: 'M77,184 C92,188 108,188 123,184 L122.6,190 C108,193 92,193 77.4,190 Z' },
    { kind: 'line', d: 'M99,197 C99.5,199 101,199 101.2,197' },
    { role: 'shorts', d: 'M73,206 C88,210 112,210 127,206 L131,256 L104,258 L100,236 L96,258 L69,256 Z' },
    { role: 'topAlt', kind: 'flat', d: 'M71.6,240 L74.5,240 L75,255.5 L69.4,255.7 Z' },
    { role: 'topAlt', kind: 'flat', d: 'M128.4,240 L125.5,240 L125,255.5 L130.6,255.7 Z' },
  ],
  neck: [
    { role: 'skin', d: 'M93,124 L107,124 L108,146 C104,149 96,149 92,146 Z' },
    { role: 'skinShade', kind: 'shade', d: 'M93,126 L107,126 L107.5,135 C103,139 97,139 92.5,135 Z' },
  ],
  armFront: womanArm,
  armBack: mirrorArm(womanArm),
  ponytail: {
    pivot: [116, 34],
    shapes: [
      {
        role: 'hair',
        d: 'M110,34 C122,8 158,4 164,30 C168,50 158,74 151,96 C149,80 145,64 137,53 C131,45 123,39 116,41 Z',
      },
      { role: 'skinShade', kind: 'shade', d: 'M140,30 C150,36 154,54 151,74 C148,60 144,48 137,40 Z' },
      { role: 'band', d: 'M107,31 C110,23 122,24 123,33 C119,38 112,38 107,31 Z' },
    ],
  },
  hairBack: [
    {
      role: 'hair',
      d: 'M58,92 C52,52 72,26 100,26 C128,26 148,52 142,92 C142,80 139,72 135,66 L65,66 C61,72 58,80 58,92 Z',
    },
  ],
  head: [
    ...both({ role: 'skin', d: 'M64,84 C55,82 54,99 64,100 Z' }),
    { role: 'band', d: ellipse(59.5, 103, 2.6, 2.6) },
    { role: 'band', d: ellipse(140.5, 103, 2.6, 2.6) },
    {
      role: 'skin',
      d: 'M100,30 C122,30 138,44 138,70 L138,94 C138,116 120,129 100,129 C80,129 62,116 62,94 L62,70 C62,44 78,30 100,30 Z',
    },
  ],
  hairFront: [
    {
      role: 'hair',
      d: 'M62,76 C60,44 78,27 102,27 C126,27 140,44 138,76 C133,62 122,54 110,51 C110,58 103,62 94,62 C99,58 100,54 98,51 C84,54 70,62 62,76 Z',
    },
  ],
  brows: both({ role: 'hair', d: 'M76,72 C81,67.5 90,67.5 94.5,71 L93.8,74 C88,71.5 82,71.6 77.2,75 Z' }),
  eyes: { left: [85, 88], right: [115, 88], r: 10, pupil: 4.9 },
  lashes: [
    ...both({ kind: 'line', d: 'M76.2,84 L71.5,80.5' }),
    ...both({ kind: 'line', d: 'M75.4,88.5 L70.5,88' }),
  ],
  nose: [{ kind: 'line', d: 'M99,94 C97,98.5 99,101.5 103,100.5' }],
  blush: [
    { role: 'blush', kind: 'flat', d: ellipse(74, 104, 6.4, 3.6) },
    { role: 'blush', kind: 'flat', d: ellipse(126, 104, 6.4, 3.6) },
  ],
  smile: [{ role: 'mouth', d: 'M89,108 C93,117.5 107,117.5 111,108 C104,111 96,111 89,108 Z' }],
  munch: [{ role: 'mouth', d: ellipse(100, 112, 6.6, 5.8) }],
  neckPivot: [100, 127],
  waist: [100, 222],
};

export const RIGS: Record<Sex, Rig> = { man: MAN, woman: WOMAN };
export const CANVAS = { w: 200, h: 320 };
