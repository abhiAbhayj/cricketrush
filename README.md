# 🏏 Cricket Rush - Standalone Web & Android Arcade Game

**Cricket Rush** is a fast-paced, top-down 2D arcade cricket chase game built for **Web (React/PWA)** and **Android (Capacitor)**. It features precise 60 FPS timing-based batting mechanics, custom user-generated challenges, shareable codes & links, unlockable gear, quests, and global leaderboards.

---

## 🏗️ Architecture & Directory Layout

```
cricketrush/
  ├── client/                  # Frontend Web App & Game Engine (Vite + React + Tailwind CSS)
  │     ├── android/           # Generated Native Android project (Capacitor wrapper)
  │     ├── capacitor.config.json # Capacitor native configuration
  │     ├── src/
  │     │     ├── components/  # React UI screens (Game, Menu, Challenges, Quests, Shop, Leaderboard)
  │     │     ├── game/        # Physics engine, AI Fielders, Web Audio Synthesizer, Stadiums
  │     │     └── services/    # API client with seamless offline fallback, local storage & haptics
  │     └── dist/              # Production web build output
  ├── server/                  # Backend REST API (Node.js + Express + Persistent JSON Store)
  │     ├── server.js          # REST API endpoints (/api/challenges, /api/scores, /api/leaderboard)
  │     └── database.js        # Cross-platform persistent storage
  ├── package.json             # Root monorepo workspace scripts
  └── README.md
```

---

## ⚡ Quick Start

### 1. Install Dependencies
Run in both client and server directories:
```bash
# In client/
cd client
npm install

# In server/
cd ../server
npm install
```

### 2. Run Development Server
You can launch both frontend and backend concurrently:

```bash
# Start backend (Port 4000)
npm run dev:server

# Start web client (Port 5173)
npm run dev:client
```

Open your browser at `http://localhost:5173`.

---

## 📱 Android App Deployment (via Capacitor)

The project includes pre-configured **Capacitor Android** native wrapper files.

### Build and Sync to Android:
```bash
# 1. Build the React web distribution
npm run build:client

# 2. Sync web assets into Android project
npm run android:sync

# 3. Open project directly in Android Studio
npm run android:open
```

### Generate Android `.apk` or `.aab`:
Once opened in Android Studio:
1. Select **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
2. The generated debug APK will be located in:
   `client/android/app/build/outputs/apk/debug/app-debug.apk`.

Or build from command line with Gradle:
```bash
cd client/android
./gradlew assembleDebug
```

---

## 🎮 Batting Mechanics & Physics

* **Perspective:** Top-down view featuring the pitch, popping creases, 30-yard circle, stumps, and dynamic outfield fielders.
* **Bowler Variations:**
  * **Express Fast (140-152 km/h):** Quick pitching with sharp bounce. Requires rapid reflexes.
  * **Swing Bowling:** Noticeable late in/out swing in the air.
  * **Mystery Spin:** Drift through the air followed by sharp lateral deviation upon bouncing on the pitch.
* **Timing Windows:**
  * **PERFECT (±38ms):** Sweet spot smash! Rocket launch angle for 4 or 6.
  * **GOOD (±85ms):** Controlled contact driven into outfield gaps for 1-2 runs.
  * **EARLY / LATE (±150ms):** Edge or mistimed skied shot with fielder catch risk.
  * **MISS:** Ball beats the bat. If on line of stumps -> **BOWLED!**
* **Shot Direction Controls:**
  * **Off:** Cover Drive / Cut
  * **Straight:** Long-off / Long-on loft
  * **Leg:** Mid-wicket pull / slog sweep
  * Controls can be triggered via on-screen buttons, screen taps, or Arrow / Spacebar keys.

---

## 🌐 Custom Challenge Creation & Sharing

* **Create Custom Scenarios:** Players configure Target Runs (6-45), Balls Allowed (3-18), Wickets Allowed, Bowler Style, and Difficulty.
* **Instant Unique Code:** Generates a 6-character code (e.g., `CHASE6`, `SPIN36`).
* **One-Click Share:** Uses the **Web Share API** or clipboard copy. Friends opening `https://yourapp.com/#challenge=CODE` jump directly into the custom match!

---

## 📡 Backend API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status |
| `GET` | `/api/challenges` | List all community and preset challenges |
| `GET` | `/api/challenges/:code` | Fetch specific challenge settings |
| `POST` | `/api/challenges` | Create and publish a new custom challenge |
| `GET` | `/api/leaderboard` | Global leaderboards sorted by score and strike rate |
| `POST` | `/api/scores` | Record match result and update leaderboards |
| `GET` | `/api/quests` | Daily rotating quests and reward configuration |

---

## 📴 Offline Resilience

Even without a backend connection:
* All challenges, scores, equipped skins, and daily quests fall back gracefully to **LocalStorage / IndexedDB**.
* Play offline anytime on mobile devices!
