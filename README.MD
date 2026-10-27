<div align="center">

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

# 🌐 Bio-Link Profile Template

A customizable bio-link profile page inspired by my [guns.lol template](https://guns.lol/templates/a51af3a4-ffc7-49e0-8866-b44683d075ff) · 👤 [Visit my profile at guns.lol](https://guns.lol/jefer).  
Everything you want to change lives in **one single file**: `js/config.js`.

[**Live Demo**](https://gunslol-template.pages.dev/)

</div>

---

## ✨ Features

- 🎬 **Video background** with audio that starts on click
- 🌧️ **Animated rain particles** with mouse parallax
- ✨ **Sparkle cursor trail**
- 📺 **Analog interference effect** on the name (TV static style)
- ⌨️ **Typewriter** on the status text (types, deletes, repeats)
- 🃏 **3D card tilt** on mouse move (works on mobile too)
- 🎭 **Discord presence** — live via the [Lanyard API](https://github.com/Phineas/lanyard) (WebSocket, no polling)
- 🎵 **Synced lyrics widget** — follows the page's playlist (or your Spotify via Lanyard), lyrics from [LRCLIB](https://lrclib.net)
- 🏅 **Badges / roles** with hover tooltips
- 🔗 **Social links** with glow effect
- 🧩 **Media embeds** — YouTube / Spotify / SoundCloud / direct media cards at the bottom
- 💌 **Share embed** — pretty card when the link is sent to Discord / X
- 🖱️ **Custom cursor**
- 🔤 **Custom font** support (just drop your `.otf` file)
- ⚙️ **100% configurable** from a single file

---

## 📁 Project Structure

```
gunslol-template/
├── index.html              # Page structure — no need to edit
├── css/
│   └── style.css           # Visual styles — no need to edit
├── js/
│   ├── config.js           ✏️ THE ONLY FILE YOU NEED TO EDIT
│   └── script.js           # Page logic — no need to edit
└── assets/
    ├── avatar.jpg          # Your profile photo
    ├── background.mp4      # Background video
    ├── cursor.png          # Custom cursor image
    ├── favicon.png         # Browser tab icon
    ├── badges/             # Your badge/role GIFs or PNGs
    ├── fonts/              # Your custom font (rename to fuente.otf)
    └── icons/
        ├── instagram.png   # Social link icons
        ├── spotify.png
        ├── tiktok.png
        └── status/         # Discord status icons
            ├── online.png
            ├── idle.png (inactive.png)
            ├── dnd.png (busy.png)
            └── offline.png
```

---

## 🚀 Getting Started

**1.** Clone or download this repository  
**2.** Drop your files into the `assets/` folder  
**3.** Open `js/config.js` and fill in your info  
**4.** Open `index.html` with [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) or upload to GitHub Pages

That's it. No installs, no build steps, no dependencies.

---

## ⚙️ Configuration (`js/config.js`)

Everything is grouped into clear sections:

### 👤 Profile
| Field | What it does |
|---|---|
| `profileName` | Your name on the card |
| `nameTooltip` | Text that appears when hovering your name |
| `nameEffect` | `"noise"` = TV interference \| `"none"` = plain |
| `statusText` | Text below your name (typewriter effect) |
| `tabTitle` | Animated title in the browser tab |
| `entrySymbol` | Symbol shown on the entry screen |

### 🖼️ Files
| Field | What it does |
|---|---|
| `avatar` | Path to your profile photo — if the file is missing, the live Discord avatar from Lanyard is used instead |
| `backgroundVideo` | Path to your background video (`.mp4`) |
| `customCursor` | Path to your cursor image |
| `avatarDecoration` | Animated Discord ring (URL or `""` to disable) |

### 🏅 Badges
```js
badges: [
  { icon: "assets/badges/owner.png", label: "Owner" },
  { icon: "assets/badges/verified.png", label: "Verified" },
]
```
- Add or remove as many as you want
- `label` is the tooltip text shown on hover
- Supports `.png`, `.gif`, `.webp`

### 💬 Discord (live via Lanyard)
| Field | What it does |
|---|---|
| `lanyardUserId` | Your Discord user ID — enables **live** presence (username, avatar, status dot, activity) via the [Lanyard API](https://github.com/Phineas/lanyard). `""` = disabled |
| `discordUsername` | Fallback username (used when Lanyard is off or unreachable) |
| `discordStatus` | Fallback status text (also shown when you have no activity) |
| `discordAvatar` | Fallback avatar path |
| `discordPresenceStatus` | Fallback status: `"online"` \| `"idle"` \| `"dnd"` \| `"offline"` |

**Setting up Lanyard:**
1. Join the [Lanyard Discord server](https://discord.gg/lanyard) with your account — the API can only see users who are in it
2. Enable Developer Mode (Discord → Settings → Advanced), then right-click your name → **Copy User ID**
3. Paste the ID into `lanyardUserId` in `config.js`

Once enabled, the card shows your real display name, CDN avatar (animated `.gif` if you have one), live status dot, and a line describing what you're doing (custom status, playing a game, listening to a Spotify song…) — updating in real time over WebSocket.

### 🎵 Lyrics Widget (LRCLIB)
Scrolls the **synced lyrics** of the song playing in the music player above — the active line glows and stays centered while the rest drifts past. No playlist configured? Then it follows whatever your Discord account plays on Spotify (via Lanyard, needs `lanyardUserId`).

```js
lyricsWidget: {
  enabled:       true,
  height:        "88px",
  boxBackground: "rgba(255, 183, 213, 0.06)",
  boxBorder:     "2px solid rgba(255, 183, 213, 0.06)",
  boxRadius:     "14px",
  idleText:      "♡ nothing playing right now ♡",
  loadingText:   "♪ loading lyrics ♪",
  notFoundText:  "no lyrics found for this one... ૮ ˶´ ༀ `˶ ა",
  delay:         0,
}
```
| Field | What it does |
|---|---|
| `enabled` | Show the widget (`false` removes it entirely) |
| `height` | Box height — roughly 4 lyric lines |
| `boxBackground` / `boxBorder` / `boxRadius` | Box styling (pink tint by default) |
| `idleText` | Shown when nothing is playing |
| `loadingText` | Shown while lyrics are being fetched |
| `notFoundText` | Shown when LRCLIB has no synced lyrics for the track |
| `delay` | Shift all timings in seconds — positive shows lines earlier, negative later |

> Lyrics come from [LRCLIB](https://lrclib.net) — a free, public lyrics database. Match quality is best for popular tracks; instrumental gaps show a little `♪`.

### 🎧 Music (local playlist)
Drop your songs into `assets/audio/` and list them in `config.js`. One **random track plays on every visit** (starts on the entry click, loops). The lyrics widget follows the chosen song — timing comes straight from `<audio>`, so it's sample-accurate.

```js
music: {
  shuffle:     true,  // random track on every page load
  volume:      0.7,   // 0..1
  autoAdvance: true,  // play the next song when one ends
  loop:        true,  // repeat the same track (when autoAdvance is false)
  boxBackground: "rgba(255, 183, 213, 0.08)",
  boxBorder:     "2px solid rgba(255, 183, 213, 0.06)",
  boxRadius:     "14px",
  tracks: [
    {
      file:      "assets/audio/your-song.mp3",
      trackName: "Song — Artist",  // shown in the player
      title:     "Song",           // ─┐
      artist:    "Artist",         //  ├─ LRCLIB lyric lookup
      album:     "",               // ─┘
      cover:     "",               // cover image ("" hides it)
      syncFactor: 1,                 // ~0.8 if the file is slowed + reverb
    },
  ],
}
```
| Field | What it does |
|---|---|
| `shuffle` | Pick a random track on every visit (`false` = always the first one) |
| `volume` | Playback volume, `0..1` |
| `autoAdvance` | Play the next song when one ends (playlist flows forever) |
| `loop` | Repeat the chosen track — only when `autoAdvance` is `false` |
| `boxBackground` / `boxBorder` / `boxRadius` | Player box styling |
| `file` | Path to the audio file |
| `trackName` | Title shown in the player |
| `title` / `artist` / `album` | Sent to LRCLIB to find synced lyrics |
| `cover` | Optional cover image next to the track info |
| `syncFactor` | Timing compensation — `1` for normal speed, `~0.8` for slowed+reverb edits |

> **Playlist empty?** The lyrics widget then follows whatever your Discord account plays on Spotify (via Lanyard) instead.

### 🔗 Social Links
```js
socialLinks: [
  { name: "Instagram", url: "https://instagram.com/you", icon: "assets/icons/instagram.png" },
  { name: "GitHub",    url: "https://github.com/you",    icon: "assets/icons/github.png"    },
]
```
- Add, remove or reorder links freely
- Use any `.png` as an icon

### 🧩 Embeds
Paste links at the bottom of the profile — they turn into embedded players automatically:

| Link | Renders as |
|---|---|
| YouTube `watch?v=` / `youtu.be` / `/shorts/` | 16:9 video player (playlist links work too) |
| Spotify `track` / `album` / `playlist` / `episode` | official Spotify embed (152px track, 352px lists) |
| SoundCloud | player with a pink waveform to match the theme |
| direct `.mp4` `.webm` / `.mp3` `.ogg`… | native video / audio player |
| direct `.png` `.jpg` `.gif` `.webp` | image card |
| any other URL | raw iframe |

```js
embeds: [
  { url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
  { url: "https://open.spotify.com/track/6WrI0zfc7fLJGsfaAUDDaZ" },
]
```
- `height` (optional) overrides an iframe's height in px

### 💌 Share Embed (Discord / X)
The card shown when your link is sent in chat lives in `index.html`'s `<head>` — the one section **outside `config.js`**, because crawlers (Discord, X, Facebook) don't run JavaScript:

```html
<meta property="og:title" content="nyan.exe ♡" />
<meta property="og:description" content="૮₍ ˶ᵔ ᵕ ᵔ˶ ₎ა ♡" />
<meta property="og:image" content="https://your-domain.com/assets/icons/avatar.gif" />
<meta name="theme-color" content="#ffb7d5" />
```
- `og:image` needs a **full URL** (`https://…`) — relative paths are ignored by Discord
- `theme-color` tints the embed's side stripe — set it to your `accentColor` to match the theme

### 🎨 Card & Colors
| Field | What it does |
|---|---|
| `cardBorderRadius` | How round the card corners are (`"85px"` = pill shape) |
| `cardBackground` | Card background color (use `rgba()` to keep it transparent) |
| `cardTiltIntensity` | How dramatic the 3D tilt is (0 = disabled) |
| `usernameGlow` | Glow color behind your name (`"none"` to disable) |
| `iconGlowColor` | Glow color behind the social icons |
| `accentColor` | One color that repaints text, tooltips, volume button, entry glow and muted text at once — `"#ffb7d5"` pastel pink, `"#c4b5fd"` pastel purple, `"#a7f3d0"` mint… |
| `entryGlowColor` | Deep glow color behind the entry screen symbol |
| `statusCursor` | Blinking cursor shown after the status text (`"♡"`, `"✦"`, `"|"`…) |

### 🌧️ Particles & Cursor
| Field | What it does |
|---|---|
| `particleColor` | Color of the rain dots |
| `particleCount` | How many dots fall at once |
| `particleParallaxStrength` | How much they shift with the mouse (0 = off) |
| `shootingStarColors` | Colors of the cursor sparkles |
| `shootingStarSize` | Size of each sparkle |

---

## 🖼️ What Images Can You Add?

| Image | Where to put it | Recommended size |
|---|---|---|
| Profile photo | `assets/avatar.jpg` | At least 200×200px, square *(optional when Lanyard is on — the live Discord avatar is used)* |
| Background video | `assets/background.mp4` | Any resolution, keep the file size reasonable |
| Custom cursor | `assets/cursor.png` | 32×32px or 64×64px, transparent background |
| Browser tab icon | `assets/favicon.png` | 32×32px |
| Badges / roles | `assets/badges/` | Any size, `.gif` works for animated |
| Social icons | `assets/icons/` | 96×96px, transparent background |
| Discord status icons | `assets/icons/status/` | 48×48px, transparent background |
| Custom font | `assets/fonts/fuente.otf` | `.otf`, `.ttf` or `.woff2` |

> **Tip for icons:** Remove the black background before using them so the glow effect works correctly.  
> **Tip for the cursor:** The hotspot (click point) is set by `customCursorHotspot` in `config.js`.

---

## 💡 Tips

- **Video not playing?** Make sure the file is named `background.mp4` and placed inside `assets/`. Some browsers need the file to be served (use Live Server, not just opening the file directly).
- **Font not loading?** Rename your font file to `fuente.otf` and drop it in `assets/fonts/`. The page falls back to the default font if the file is missing — no errors.
- **Badge GIF has a white background?** You need to remove it before using it. Any image editor or online tool like [remove.bg](https://www.remove.bg) works.
- **Want more social links?** Just copy one of the existing lines in `socialLinks` and change the URL and icon path.
- **Card too wide on mobile?** Lower the `cardMaxWidth` value in `config.js`.

---

## 📄 License

This project is open source and free to use. Credit is appreciated but not required.

---

<div align="center">

Made with 🖤 — based on my <a href="https://guns.lol/templates/a51af3a4-ffc7-49e0-8866-b44683d075ff">guns.lol template</a>

🔗 Check out my live profile: <a href="https://guns.lol/jefer">guns.lol/jefer</a>

</div>