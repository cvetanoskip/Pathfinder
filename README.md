# PathFinder – GPS Route & Step Tracker (Expo React Native)

Mobile app for tracking routes (GPS path + distance + duration + pace) and estimating steps (real pedometer in foreground + GPS-based estimation in background). Built with Expo (managed workflow + custom dev client for background location).

**Features:**
- Real-time route tracking with foreground & background location
- Step counting (hardware pedometer when app is open, estimated from distance when backgrounded)
- Clean UI with map (MapTiler tiles), stats, start/stop controls
- Fully standalone APK installable on Android

## How to Run the Project

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- **Android Studio** installed (with Android SDK & emulator configured) – required for local native builds
- Android phone with USB debugging enabled (for live debugging) or just for sideloading APK
- A free **MapTiler API key** (used for map tiles)

### 1. Get MapTiler API Key (free tier available)
1. Go to https://cloud.maptiler.com/
2. Sign up / log in (free account)
3. Go to Account → API keys → Copy the **default key** (for testing) or create a new protected key
4. Create `.env` file in project root and add:

   ```env
   EXPO_PUBLIC_MAPTILER_KEY=pk.yourlongkeyhere...
   ```
2. Install dependencies
```bash
  npm install
```
3. Quick test with sideloaded APK (recommended for reviewers – no computer needed after build)
You need Android Studio to build the APK once.

Run this command (first time may take 5–15 minutes – it sets up the custom dev client):
```bash
 npx expo run:android --variant debug --no-install
```
### Find the APK here:
Windows: android\app\build\outputs\apk\debug\app-debug.apk

macOS/Linux: android/app/build/outputs/apk/debug/app-debug.apk

Transfer the app-debug.apk to your Android phone (email, Telegram, Google Drive, USB, etc.)


On the phone:

Enable "Install unknown apps" for your file manager/browser

Tap the APK file → Install

Open "PathFinder" app

Grant location permissions ("Allow all the time" for background tracking)

Grant physical activity permission (needed for step counting on supported devices)

Start tracking → it works fully standalone (no USB or computer needed)

4. Live development / debugging (optional – needs phone connected)

Connect Android phone via USB (enable Developer options → USB debugging)
Run:
```bash
npx expo run:android → Builds/installs + opens Metro bundler → hot reloading works
```

## AI Tools Used & How They Helped

I designed and built the entire PathFinder app, including:

  -Overall architecture and state management with Zustand + persistence

  -Navigation, routing, and UI components with styled-components

  -Core business logic: activity tracking, GPS route recording, distance calculation, and history storage

  -Ensuring a smooth, intentional user experience across the app

I used ChatGPT selectively to accelerate my workflow on specific tricky tasks, such as:

  -Handling background location tracking and TaskManager callbacks

  -Building the hybrid step counter (pedometer + GPS fallback)

  -Debugging Jest tests for hooks with AppState and ref issues

AI helped me prototype solutions faster and explore edge cases more efficiently, but I reviewed, adapted, and implemented every line that ended up in the final app.
