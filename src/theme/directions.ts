// Milestone 0: three candidate art directions. Once one is chosen, the other
// two are deleted and the winner becomes the single theme in /src/theme.

export type Treatment = 'poster' | 'cartoon' | 'riso';
export type Sex = 'woman' | 'man';

export type CharRole =
  | 'skin'
  | 'skinShade'
  | 'hair'
  | 'top'
  | 'topAlt'
  | 'shorts'
  | 'shoe'
  | 'sock'
  | 'sole'
  | 'eyeWhite'
  | 'pupil'
  | 'blush'
  | 'mouth'
  | 'band';

export type CharColors = Record<CharRole, string>;

export interface Direction {
  id: 'A' | 'B' | 'C';
  treatment: Treatment;
  name: string;
  tagline: string;
  palette: { name: string; hex: string }[];
  notes: { shapes: string; outline: string; texture: string; ui: string };
  ink: string; // outline / line colour
  strokeWidth: number; // outline width in character units
  shadow: string; // poster: offset print shadow. riso: second ink for overprints
  bg: string;
  fonts: {
    display: string;
    headline: string;
    body: string;
    bodyBold: string;
  };
  fontNames: { display: string; body: string };
  char: Record<Sex, CharColors>;
}

export const POSTER: Direction = {
  id: 'A',
  treatment: 'poster',
  name: 'Locker Room Poster',
  tagline: 'A 1970s varsity gym poster: halftone, misprint shadows, scoreboard numbers.',
  palette: [
    { name: 'Varsity Red', hex: '#C8102E' },
    { name: 'Navy', hex: '#1B2A4A' },
    { name: 'Cream', hex: '#F3E6C8' },
    { name: 'Mustard', hex: '#E8A93B' },
    { name: 'Teal', hex: '#2E8B85' },
    { name: 'Ink', hex: '#1A1A1A' },
  ],
  notes: {
    shapes: 'Chunky geometric shapes, pennants, stars, sunburst rays, slanted panels.',
    outline: 'Medium ink line plus a navy offset shadow, like a slightly misaligned print.',
    texture: 'Halftone dots in shadows, faded paper grain.',
    ui: 'Scoreboard light meters, slanted felt-letter buttons, pennant tabs.',
  },
  ink: '#1A1A1A',
  strokeWidth: 2.6,
  shadow: '#1B2A4A',
  bg: '#F3E6C8',
  fonts: {
    display: 'BigShouldersDisplay_900Black',
    headline: 'BigShouldersDisplay_800ExtraBold',
    body: 'BarlowSemiCondensed_500Medium',
    bodyBold: 'BarlowSemiCondensed_700Bold',
  },
  fontNames: { display: 'Big Shoulders Display', body: 'Barlow Semi Condensed' },
  char: {
    man: {
      skin: '#E3A27A',
      skinShade: '#C9825C',
      hair: '#2B1A12',
      top: '#C8102E',
      topAlt: '#F3E6C8',
      shorts: '#1B2A4A',
      shoe: '#2E8B85',
      sock: '#F3E6C8',
      sole: '#F3E6C8',
      eyeWhite: '#FFF8EA',
      pupil: '#1A1A1A',
      blush: '#E0705E',
      mouth: '#5A1620',
      band: '#E8A93B',
    },
    woman: {
      skin: '#B97A56',
      skinShade: '#9A5F40',
      hair: '#1A1A1A',
      top: '#2E8B85',
      topAlt: '#E8A93B',
      shorts: '#1B2A4A',
      shoe: '#C8102E',
      sock: '#F3E6C8',
      sole: '#F3E6C8',
      eyeWhite: '#FFF8EA',
      pupil: '#1A1A1A',
      blush: '#D0604E',
      mouth: '#4A1018',
      band: '#C8102E',
    },
  },
};

export const CARTOON: Direction = {
  id: 'B',
  treatment: 'cartoon',
  name: 'Saturday Morning',
  tagline: 'A loud, bouncy TV cartoon: thick outlines, flat colour, toy-like buttons.',
  palette: [
    { name: 'Tomato', hex: '#FF5A36' },
    { name: 'Sky', hex: '#4FC3E8' },
    { name: 'Lime', hex: '#B6E33B' },
    { name: 'Butter', hex: '#FFD84A' },
    { name: 'Bubblegum', hex: '#FF8FB1' },
    { name: 'Outline', hex: '#20141A' },
    { name: 'Paper', hex: '#FFF6E5' },
  ],
  notes: {
    shapes: 'Soft but bold blobs, oversized heads and hands, slightly wonky geometry.',
    outline: 'Thick uniform dark outline on everything, round joins.',
    texture: 'None. Flat fills with small cel highlights and hard cel shadows.',
    ui: 'Sticker buttons with a chunky lip, round badge meters that fill like liquid.',
  },
  ink: '#20141A',
  strokeWidth: 4.2,
  shadow: '#20141A',
  bg: '#4FC3E8',
  fonts: {
    display: 'LilitaOne_400Regular',
    headline: 'LilitaOne_400Regular',
    body: 'BricolageGrotesque_500Medium',
    bodyBold: 'BricolageGrotesque_800ExtraBold',
  },
  fontNames: { display: 'Lilita One', body: 'Bricolage Grotesque' },
  char: {
    man: {
      skin: '#FFC9A0',
      skinShade: '#F2A57A',
      hair: '#7A3E1D',
      top: '#FF5A36',
      topAlt: '#FFD84A',
      shorts: '#4FC3E8',
      shoe: '#B6E33B',
      sock: '#FFFFFF',
      sole: '#FFFFFF',
      eyeWhite: '#FFFFFF',
      pupil: '#20141A',
      blush: '#FF8FB1',
      mouth: '#7A1F2B',
      band: '#FF8FB1',
    },
    woman: {
      skin: '#C98B62',
      skinShade: '#A86E48',
      hair: '#20141A',
      top: '#B6E33B',
      topAlt: '#FF8FB1',
      shorts: '#FF5A36',
      shoe: '#FFD84A',
      sock: '#FFFFFF',
      sole: '#FFFFFF',
      eyeWhite: '#FFFFFF',
      pupil: '#20141A',
      blush: '#FF8FB1',
      mouth: '#6A1622',
      band: '#4FC3E8',
    },
  },
};

export const RISO: Direction = {
  id: 'C',
  treatment: 'riso',
  name: 'Riso Club',
  tagline: 'A screen-printed gym flyer: four spot inks, misregistration, grain.',
  palette: [
    { name: 'Riso Pink', hex: '#FF48B0' },
    { name: 'Riso Blue', hex: '#0078BF' },
    { name: 'Sunflower', hex: '#FFE800' },
    { name: 'Green', hex: '#00A95C' },
    { name: 'Paper', hex: '#F5EFE0' },
    { name: 'Black', hex: '#222222' },
  ],
  notes: {
    shapes: 'Simple flat shapes, overlapping translucent ink layers, big circles.',
    outline: 'No true outlines: a thin black key line printed slightly off-register.',
    texture: 'Paper grain everywhere, blue overprint for shadows.',
    ui: 'Gym-tape labels with torn ends, ticket stubs, typewriter stamps.',
  },
  ink: '#222222',
  strokeWidth: 1.4,
  shadow: '#0078BF',
  bg: '#F5EFE0',
  fonts: {
    display: 'BowlbyOneSC_400Regular',
    headline: 'BowlbyOneSC_400Regular',
    body: 'CourierPrime_400Regular',
    bodyBold: 'CourierPrime_700Bold',
  },
  fontNames: { display: 'Bowlby One SC', body: 'Courier Prime' },
  char: {
    man: {
      skin: '#F9C3B4',
      skinShade: '#FF48B0',
      hair: '#222222',
      top: '#0078BF',
      topAlt: '#FFE800',
      shorts: '#FF48B0',
      shoe: '#00A95C',
      sock: '#F5EFE0',
      sole: '#F5EFE0',
      eyeWhite: '#F5EFE0',
      pupil: '#222222',
      blush: '#FF48B0',
      mouth: '#222222',
      band: '#FFE800',
    },
    woman: {
      skin: '#E7A47E',
      skinShade: '#FF48B0',
      hair: '#0078BF',
      top: '#00A95C',
      topAlt: '#FF48B0',
      shorts: '#222222',
      shoe: '#FF48B0',
      sock: '#F5EFE0',
      sole: '#F5EFE0',
      eyeWhite: '#F5EFE0',
      pupil: '#222222',
      blush: '#FF48B0',
      mouth: '#222222',
      band: '#FFE800',
    },
  },
};

export const DIRECTIONS: Direction[] = [POSTER, CARTOON, RISO];
