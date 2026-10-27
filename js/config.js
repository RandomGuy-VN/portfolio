// ============================================================
// config.js — the only file you need to edit
// ============================================================

const CONFIG = {

  // ----------------------------------------------------------
  // PROFILE
  // ----------------------------------------------------------
  profileName:   "vitl",      // name shown on the card
  nameTooltip:   "meowwwww",         // tooltip on hover over the name
  nameEffect:    "noise",         // "noise" = TV interference | "none" = plain text
  statusText:    "🌸 that one who tries to dreaming... ૮ ˶ᵔ ᵕ ᵔ˶ ა", // text below the name (typewriter effect)
  tabTitle:      "@vitl1107",      // animated browser tab title
  entrySymbol:   "૮₍ ˶ᵔ ᵕ ᵔ˶ ₎ა ♡",            // symbol shown on the entry screen

  // ----------------------------------------------------------
  // FILES — place them in assets/ with these exact names
  // ----------------------------------------------------------
  avatar:              "assets/icons/avatar.gif",
  backgroundVideo:     "assets/background.mp4",
  customCursor:        "assets/cursor.png",
  customCursorHotspot: "0 0",    // "0 0" = tip of the cursor (top-left corner)

  // ----------------------------------------------------------
  // AVATAR
  // ----------------------------------------------------------
  avatarSize:       "118px",
  // animated Discord-style decoration — leave "" to disable
  avatarDecoration: "",

  // ----------------------------------------------------------
  // BADGES / ROLES
  // Add, remove or reorder. "icon" = path inside assets/badges/
  // ----------------------------------------------------------
  badges: [
    { icon: "assets/badges/owner.png",    label: "Owner"    },
    { icon: "assets/badges/verified.png", label: "Verified" },
    { icon: "assets/badges/partner.png",  label: "Partner"  },
    { icon: "assets/badges/hate.gif",     label: "hate"     },
  ],
  badgeSize:                "22px",
  badgeContainerBackground: "rgba(255, 183, 213, 0.08)",
  badgeContainerBorder:     "2px solid rgba(255, 183, 213, 0.06)",

  // ----------------------------------------------------------
  // DISCORD (fallback values — used when Lanyard is off/unreachable)
  // ----------------------------------------------------------
  discordUsername: "Jofagg_",
  discordStatus:   "acalme-se vadia...",
  discordAvatar:   "assets/discord-avatar.jpg",
  discordAvatarSize:   "74px",
  discordAvatarBorder: "2px solid rgba(255, 183, 213, 0.25)",
  // status: "online" | "idle" | "dnd" | "offline"
  discordPresenceStatus: "online",

  // ----------------------------------------------------------
  // LANYARD — live Discord presence (overrides the values above)
  // 1. Join the https://discord.gg/lanyard server with your account
  //    (the API can only see users who are in it)
  // 2. Enable Developer Mode (Discord → Settings → Advanced), then
  //    right-click your name → "Copy User ID"
  // 3. Paste the ID below. "" = disabled → static values above
  // ----------------------------------------------------------
  lanyardUserId: "1188448675140223039",

  // ----------------------------------------------------------
  // MUSIC PLAYER — playlist in assets/audio, starts on entry
  // click. One random track per visit (shuffle), prev/play/next
  // controls, click the progress bar to seek. The lyrics widget
  // follows the chosen song. Empty tracks [] → lyric widget
  // follows your Spotify via Lanyard instead.
  // ----------------------------------------------------------
  music: {
    shuffle:     true,    // random track on every page load
    volume:      0.7,     // 0..1
    autoAdvance: true,    // play the next song when one ends
    loop:        true,    // repeat the same track (when autoAdvance is false)

    boxBackground: "rgba(255, 183, 213, 0.08)",
    boxBorder:     "2px solid rgba(255, 183, 213, 0.06)",
    boxRadius:     "14px",

    tracks: [
      {
        file:      "assets/audio/SpotiDownloader.com - Đốt - Ngọt.mp3",
        trackName: "Đốt — Ngọt",     // shown in the widget header
        title:     "Đốt",            // ─┐
        artist:    "Ngọt",           //  ├─ LRCLIB lyric lookup
        album:     "",               // ─┘
        cover:     "",               // header image ("" hides it)
        syncFactor: 1,               // ~0.8 if the file is slowed + reverb
      },
      {
        file:      "assets/audio/SpotiDown.App - In Love - Low G.mp3",
        trackName: "In Love — Low G",
        title:     "In Love",
        artist:    "Low G",
        album:     "",
        cover:     "",
        syncFactor: 1,
      },
    ],
  },

  // ----------------------------------------------------------
  // SOCIAL LINKS
  // Add, remove or reorder. "icon" = path inside assets/icons/
  // ----------------------------------------------------------
  socialLinks: [
    { name: "Instagram", url: "https://instagram.com/user",         icon: "assets/icons/instagram.png" },
    { name: "Spotify",   url: "https://open.spotify.com/user", icon: "assets/icons/spotify.png"   },
    { name: "TikTok",    url: "https://www.tiktok.com/user",           icon: "assets/icons/tiktok.png"    },
    { name: "OnlyFans",  url: "https://onlyfans.com/user",          icon: "assets/icons/onlyfans.png"  },
    { name: "Github",  url: "https://github.com/user",          icon: "assets/icons/github.png"  },
,
  ],
  iconSize:         "36px",
  iconBorderRadius: "8px",
  iconGlowColor:    "#ffb7d5",

  // ----------------------------------------------------------
  // CARD
  // ----------------------------------------------------------
  cardMaxWidth:        "44rem",
  cardBorderRadius:    "85px",
  cardBackground:      "rgba(255, 183, 213, 0.04)",
  cardBorder:          "1px solid rgba(255, 183, 213, 0.12)",
  cardRevealDelay:     300,        // ms between entry click and card appearance
  cardTiltIntensity:   15,         // tilt degrees on mouse move (0 = disabled)
  cardTiltPerspective: "1000px",   // 3D perspective (lower = more dramatic)

  // ----------------------------------------------------------
  // DISCORD BOX (presence box inside the card)
  // ----------------------------------------------------------
  discordBoxBackground: "rgba(255, 183, 213, 0.07)",
  discordBoxRadius:     "14px",
  discordBoxBorder:     "2px solid rgba(255, 183, 213, 0.06)",

  // ----------------------------------------------------------
  // LYRICS WIDGET — synced lyrics via LRCLIB (https://lrclib.net)
  // Scrolls the lyrics of the song playing in the music player
  // above (or of your Spotify via Lanyard when the playlist
  // is empty).
  // ----------------------------------------------------------
  lyricsWidget: {
    enabled:       true,
    height:        "88px",                               // box height
    boxBackground: "rgba(255, 183, 213, 0.06)",
    boxBorder:     "2px solid rgba(255, 183, 213, 0.06)",
    boxRadius:     "14px",
    idleText:      "♡ nothing playing right now ♡",      // shown when not listening
    loadingText:   "♪ loading lyrics ♪",
    notFoundText:  "no lyrics found for this one... ૮ ˶´ ༀ `˶ ა",
    delay:         0,   // seconds — shift lyrics earlier (positive) or later (negative)
  },

  // ----------------------------------------------------------
  // COLORS / STYLE — pastel pink ♡
  // accentColor repaints text, tooltips, volume button and
  // glows all at once. Other cute options:
  //   pastel purple "#c4b5fd" · mint "#a7f3d0" · peach "#fcd6b3"
  // ----------------------------------------------------------
  accentColor:    "#ffb7d5",
  usernameGlow:   "0 0 16.5px #ffb7d5",
  entryGlowColor: "#ff8ec7",   // deep glow on the entry screen symbol
  statusCursor:   "♡",         // blinking cursor after the status text

  // ----------------------------------------------------------
  // BACKGROUND PARTICLES
  // ----------------------------------------------------------
  particleColor:            "#ffb7d5",
  particleCount:            70,
  particleFallDuration:     10,    // seconds to cross the screen top to bottom
  particleSwayDuration:     3,     // seconds per horizontal sway cycle
  particleSwayAmount:       80,    // pixels of horizontal sway
  particleParallaxStrength: 0.08,  // mouse parallax strength (0 = disabled)

  // ----------------------------------------------------------
  // CURSOR TRAIL
  // ----------------------------------------------------------
  shootingStarColors:       ["#ffb7d5", "#ffd6e8", "#ffe9f3"],
  shootingStarSize:         3,
  shootingStarMaxParticles: 4,     // particles spawned per mouse movement
  shootingStarFadeFrames:   30,    // frames until each particle fades out
  shootingStarGlow:         8,     // glow intensity around each sparkle

};