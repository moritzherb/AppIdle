# Milestone 0: Art direction

Three candidate looks for Pocket Lifter. All three render the **same sample screen**
(gym room, athlete, meters, Train/Feed buttons, room tabs) so they can be compared
like for like. Switch between them with the bar at the top of the app.

The same character rig and icon set are used in all three; only the "print
treatment" changes (see `src/art/Ink.tsx`). The winning direction will get its own
treatment tuned further, and the other two are deleted.

## A: Locker Room Poster
A 1970s varsity gym poster.

| | |
|---|---|
| Palette | Varsity Red `#C8102E`, Navy `#1B2A4A`, Cream `#F3E6C8`, Mustard `#E8A93B`, Teal `#2E8B85`, Ink `#1A1A1A` |
| Shapes | Chunky geometry, pennants, stars, sunburst rays, slanted panels |
| Outline | Medium ink line plus a navy offset shadow, like a slightly misaligned print |
| Texture | Halftone dots in shadows, faded paper grain |
| Fonts | **Big Shoulders Display** (condensed scoreboard display) + **Barlow Semi Condensed** |
| UI objects | Scoreboard meters with light segments, slanted felt-letter buttons, pennant tabs |

## B: Saturday Morning
A loud, bouncy TV cartoon.

| | |
|---|---|
| Palette | Tomato `#FF5A36`, Sky `#4FC3E8`, Lime `#B6E33B`, Butter `#FFD84A`, Bubblegum `#FF8FB1`, Outline `#20141A`, Paper `#FFF6E5` |
| Shapes | Soft but bold blobs, oversized heads and hands, slightly wonky geometry |
| Outline | Thick uniform dark outline everywhere, round joins |
| Texture | None: flat fills, small cel highlights, hard cel shadows |
| Fonts | **Lilita One** (chunky display) + **Bricolage Grotesque** |
| UI objects | Sticker buttons with a chunky lip, round badge meters that fill like liquid |

## C: Riso Club
A screen-printed gym flyer.

| | |
|---|---|
| Palette | Riso Pink `#FF48B0`, Riso Blue `#0078BF`, Sunflower `#FFE800`, Green `#00A95C`, Paper `#F5EFE0`, Black `#222222` |
| Shapes | Simple flat shapes, overlapping translucent ink layers, big circles |
| Outline | No true outline: a thin black key line printed slightly off-register |
| Texture | Paper grain everywhere, pink/blue overprints for shadows, dither |
| Fonts | **Bowlby One SC** (heavy stamped display) + **Courier Prime** (typewriter) |
| UI objects | Gym-tape labels with torn ends, ticket-stub coin counter, typewriter notes |

## What to try on the sample screen
- Tap the athlete's head (wobble) or body (squash).
- Drag your finger around: the eyes follow it.
- **Train**: flex pose, screen shake, sweat, heavy haptic, Pump meter rises.
- **Feed**: a banana flies in, chewing animation, Hunger and Fuel rise.
- Wait: blinking, looking around, and random idle routines (bicep check, stretch, yawn).
- **Spec sheet**: palette with hex codes, type specimen, and rules for the direction.

Mixing is fine, e.g. "B's characters with C's palette and fonts".
