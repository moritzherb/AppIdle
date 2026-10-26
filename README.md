# Pocket Lifter

A virtual-pet game for iOS and Android where your pet is a cartoon athlete.
Built with Expo (React Native) and TypeScript.

> Status: **Milestone 0, art direction.** The app currently opens the Art Lab,
> a sample screen rendered in three candidate visual styles. See
> [`docs/art-direction.md`](docs/art-direction.md).

## Run it on your phone (Expo Go)

You need [Node.js LTS](https://nodejs.org) on your computer and the **Expo Go** app
on your phone (App Store / Google Play). Phone and computer on the same Wi-Fi.

```bash
git clone https://github.com/moritzherb/appidle.git
cd appidle
npm install
npx expo start
```

A QR code appears in the terminal.
- **Android:** open Expo Go and tap "Scan QR code".
- **iPhone:** scan it with the normal Camera app and tap the banner.

If the QR code doesn't connect (e.g. on a work or university Wi-Fi), stop the
server and run `npx expo start --tunnel` instead.

To pull updates later: `git pull`, `npm install`, `npx expo start`.

## Useful commands

```bash
npx tsc --noEmit                 # typecheck
npx expo start --web             # quick look in a desktop browser
```

Store builds (EAS), ads/IAP setup and store checklists will be documented here in Milestone 9.
