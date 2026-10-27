// ============================================================
// script.js — page logic
// You don't need to edit this file. All customization lives in config.js
// ============================================================


// ============================================================
// INIT — runs once the HTML is ready
// ============================================================
document.addEventListener("DOMContentLoaded", () => {

  // -- Entry screen symbol --
  document.getElementById("entry-symbol").textContent = CONFIG.entrySymbol;

  // -- Name + interference effect --
  initNameEffect();

  // -- Badges --
  document.documentElement.style.setProperty("--badge-size",             CONFIG.badgeSize);
  document.documentElement.style.setProperty("--badge-container-bg",     CONFIG.badgeContainerBackground);
  document.documentElement.style.setProperty("--badge-container-border", CONFIG.badgeContainerBorder);

  const badgesContainer = document.getElementById("badges");
  (CONFIG.badges || []).forEach((badge) => {
    const item    = document.createElement("div");
    item.className = "badge-item";

    const tooltip = document.createElement("span");
    tooltip.className   = "badge-tooltip";
    tooltip.textContent = badge.label || "";

    const img = document.createElement("img");
    img.src = badge.icon;
    img.alt = badge.label || "";

    item.appendChild(tooltip);
    item.appendChild(img);
    badgesContainer.appendChild(item);
  });

  // -- Avatar --
  document.documentElement.style.setProperty("--avatar-size", CONFIG.avatarSize);

  // Probe the local photo — when it's missing, hide the broken image
  // and let renderLanyard swap in the live Discord avatar instead
  const avatarEl = document.getElementById("avatar");
  const avatarProbe = new Image();
  avatarProbe.onload  = () => { avatarEl.src = CONFIG.avatar; };
  avatarProbe.onerror = () => {
    avatarFileMissing = true;
    if (lanyardUser) {
      avatarEl.src = lanyardAvatarUrl(lanyardUser);
    } else {
      avatarEl.style.visibility = "hidden";
    }
  };
  avatarProbe.src = CONFIG.avatar;

  const decorationEl = document.getElementById("avatar-decoration");
  if (CONFIG.avatarDecoration) {
    decorationEl.src = CONFIG.avatarDecoration;
  } else {
    decorationEl.style.display = "none";
  }

  // -- Background video --
  const bgVideo = document.getElementById("bg-video");
  document.getElementById("bg-video-source").src = CONFIG.backgroundVideo;
  bgVideo.load();

  // -- Accent theme (one color repaints text, tooltips, buttons, glows) --
  document.documentElement.style.setProperty("--accent",           CONFIG.accentColor    || "#acc8ff");
  document.documentElement.style.setProperty("--entry-glow-color", CONFIG.entryGlowColor || "#0011ff");
  document.documentElement.style.setProperty("--status-cursor",    `"${CONFIG.statusCursor || "|"}"`);

  // -- Card appearance --
  document.documentElement.style.setProperty("--card-max-width",        CONFIG.cardMaxWidth);
  document.documentElement.style.setProperty("--card-border-radius",    CONFIG.cardBorderRadius);
  document.documentElement.style.setProperty("--card-background",       CONFIG.cardBackground);
  document.documentElement.style.setProperty("--card-border",           CONFIG.cardBorder);
  document.documentElement.style.setProperty("--card-tilt-perspective", CONFIG.cardTiltPerspective);
  document.documentElement.style.setProperty("--username-glow",         CONFIG.usernameGlow);

  // -- Discord box --
  document.documentElement.style.setProperty("--discord-box-background", CONFIG.discordBoxBackground);
  document.documentElement.style.setProperty("--discord-box-radius",     CONFIG.discordBoxRadius);
  document.documentElement.style.setProperty("--discord-box-border",     CONFIG.discordBoxBorder);
  document.documentElement.style.setProperty("--discord-avatar-size",    CONFIG.discordAvatarSize);
  document.documentElement.style.setProperty("--discord-avatar-border",  CONFIG.discordAvatarBorder);

  // -- Social icons --
  document.documentElement.style.setProperty("--icon-size",          CONFIG.iconSize);
  document.documentElement.style.setProperty("--icon-border-radius", CONFIG.iconBorderRadius);
  document.documentElement.style.setProperty("--icon-glow-color",    CONFIG.iconGlowColor);

  const socialContainer = document.getElementById("social-links");
  CONFIG.socialLinks.forEach((link) => {
    const a = document.createElement("a");
    a.href   = link.url;
    a.target = "_blank";
    a.rel    = "noopener noreferrer";
    a.title  = link.name;

    const icon = document.createElement("img");
    icon.className = "social-icon";
    icon.src = link.icon;
    icon.alt = link.name;

    a.appendChild(icon);
    socialContainer.appendChild(a);
  });

  // -- Media embeds --
  initEmbeds();

  // -- Discord presence --
  if (CONFIG.lanyardUserId) {
    // Live profile via Lanyard (falls back to the static values on failure)
    initLanyard(CONFIG.lanyardUserId, renderStaticDiscord);
  } else {
    renderStaticDiscord();
  }

  // -- Lyrics widget (LRCLIB, follows Lanyard Spotify) --
  initLyricsWidget();

  // -- Music player (local playlist in assets/audio) --
  initMusicPlayer();

  // -- Custom cursor --
  if (CONFIG.customCursor) {
    const style = document.createElement("style");
    style.textContent = `* { cursor: url("${CONFIG.customCursor}") ${CONFIG.customCursorHotspot}, auto !important; }`;
    document.head.appendChild(style);
  }

  // -- Tab title typewriter --
  initTabTitle(CONFIG.tabTitle);

  // -- Cursor sparkle trail (active from page load) --
  initCursorTrail();

  // --------------------------------------------------------
  // Entry screen click — starts everything
  // --------------------------------------------------------
  const profileCard = document.getElementById("profile-card");

  document.getElementById("entry-screen").addEventListener("click", (e) => {
    e.currentTarget.classList.add("hidden");

    // Playlist exists → the video is a silent backdrop, music plays
    // from <audio>. No playlist → original behavior (video sound).
    if (musicTracks.length) {
      bgVideo.muted = true;
      bgAudio.play().catch(() => {});
    } else {
      bgVideo.muted = false;
    }
    bgVideo.play().catch(() => {});

    initParticles();

    setTimeout(() => {
      profileCard.classList.add("revealed");
      initTypewriter(document.getElementById("profile-status"), CONFIG.statusText, 60);
    }, CONFIG.cardRevealDelay);
  });

  // --------------------------------------------------------
  // 3D card tilt on mouse move
  // --------------------------------------------------------
  if (CONFIG.cardTiltIntensity > 0) {
    const tiltTransform = (x, y) =>
      `translate(-50%, -50%) perspective(${CONFIG.cardTiltPerspective}) rotateX(${x}deg) rotateY(${y}deg)`;

    const resetTransform = () => {
      profileCard.style.transform = tiltTransform(0, 0);
    };

    const applyTilt = (clientX, clientY) => {
      const rect    = profileCard.getBoundingClientRect();
      const offsetX = (clientX - rect.left)  / rect.width  - 0.5;
      const offsetY = (clientY - rect.top)   / rect.height - 0.5;
      profileCard.style.transform = tiltTransform(
        -offsetY * 2 * CONFIG.cardTiltIntensity,
         offsetX * 2 * CONFIG.cardTiltIntensity
      );
    };

    // Mouse
    profileCard.addEventListener("mousemove",  (e) => applyTilt(e.clientX, e.clientY));
    profileCard.addEventListener("mouseleave", resetTransform);

    // Touch (mobile)
    profileCard.addEventListener("touchmove", (e) => applyTilt(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
    profileCard.addEventListener("touchend",  resetTransform);
  }

  // --------------------------------------------------------
  // Volume button — targets the active audio source
  // --------------------------------------------------------
  const volumeBtn = document.getElementById("volume-btn");
  const audioTarget = musicTracks.length ? bgAudio : bgVideo;
  volumeBtn.addEventListener("click", () => {
    audioTarget.muted = !audioTarget.muted;
    volumeBtn.textContent = audioTarget.muted ? "🔇" : "🔊";
  });

});


// ============================================================
// NAME INTERFERENCE EFFECT
// Applies an SVG displacement filter to the name span.
// The filter seed changes every 40ms, making the letters
// "vibrate" like a bad TV signal — all done by the GPU.
// ============================================================
function initNameEffect() {
  const nameEl  = document.getElementById("name-text");
  const tooltip = document.getElementById("name-tooltip");

  nameEl.textContent  = CONFIG.profileName;
  tooltip.textContent = CONFIG.nameTooltip || "";

  if (CONFIG.nameEffect !== "noise") {
    nameEl.style.filter = "none";
    return;
  }

  const turb = document.getElementById("name-turb");
  const disp = document.getElementById("name-disp");

  setInterval(() => {
    turb.setAttribute("seed", Math.floor(Math.random() * 9999));
    // 80% of the time: heavy distortion / 20%: almost clean
    const scale = Math.random() < 0.8
      ? 4 + Math.random() * 8
      : 0.5 + Math.random() * 2;
    disp.setAttribute("scale", scale.toFixed(1));
  }, 40);
}


// ============================================================
// TAB TITLE TYPEWRITER
// Types the title in the browser tab, pauses, deletes, repeats.
// ============================================================
function initTabTitle(text) {
  let index     = 0;
  let isTyping  = true;

  function tick() {
    if (isTyping) {
      document.title = text.substring(0, index + 1);
      index++;
      if (index === text.length) {
        isTyping = false;
        setTimeout(tick, 1500);
        return;
      }
    } else {
      document.title = text.substring(0, index - 1);
      index--;
      if (index === 0) isTyping = true;
    }
    setTimeout(tick, 100);
  }

  tick();
}


// ============================================================
// STATUS TYPEWRITER
// Types the status text, pauses, deletes, and repeats.
// The blinking cursor "|" is added via CSS (::after on #profile-status).
// ============================================================
function initTypewriter(el, text, speed = 80) {
  let i          = 0;
  let isDeleting = false;

  function tick() {
    if (!isDeleting) {
      el.textContent = text.substring(0, i);
      i++;
      if (i > text.length) {
        setTimeout(() => { isDeleting = true; tick(); }, 1800);
        return;
      }
    } else {
      el.textContent = text.substring(0, i);
      i--;
      if (i < 0) {
        i = 0;
        isDeleting = false;
        setTimeout(tick, 500);
        return;
      }
    }
    setTimeout(tick, isDeleting ? speed * 0.5 : speed);
  }

  tick();
}


// ============================================================
// BACKGROUND PARTICLES
// Dots that fall from top to bottom with a gentle horizontal
// sway. They also shift opposite to the mouse movement,
// creating a parallax depth effect.
// Starts only after the entry screen is clicked.
// ============================================================
function initParticles() {
  const canvas = document.getElementById("bg-canvas");
  const ctx    = canvas.getContext("2d");

  const { particleColor, particleCount, particleFallDuration,
          particleSwayDuration, particleSwayAmount, particleParallaxStrength } = CONFIG;

  let particles = [];
  let mouseX    = window.innerWidth / 2;

  document.addEventListener("mousemove", (e) => { mouseX = e.clientX; });

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        baseX:      Math.random() * canvas.width,
        y:          Math.random() * canvas.height * 1.5 - canvas.height * 0.5,
        r:          1 + Math.random() * 1.8,
        swayPhase:  Math.random() * Math.PI * 2,
        swaySpeed:  (Math.random() * 0.6 + 0.7) / particleSwayDuration,
        fallSpeed:  (canvas.height * 1.1) / (particleFallDuration * 60) * (0.7 + Math.random() * 0.6),
        opacity:    0.4 + Math.random() * 0.6,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = particleColor;

    const parallaxOffset = -(mouseX - canvas.width / 2) * particleParallaxStrength;

    particles.forEach((p) => {
      p.y += p.fallSpeed;
      if (p.y > canvas.height + 10) {
        p.y     = -10;
        p.baseX = Math.random() * canvas.width;
      }

      const sway = Math.sin(performance.now() * 0.001 * p.swaySpeed + p.swayPhase) * particleSwayAmount;
      let x = p.baseX + sway + parallaxOffset;
      x = ((x % canvas.width) + canvas.width) % canvas.width;

      ctx.globalAlpha = p.opacity;
      ctx.beginPath();
      ctx.arc(x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  window.addEventListener("resize", () => { resize(); createParticles(); });
  requestAnimationFrame(draw);
}


// ============================================================
// DISCORD PRESENCE — LANYARD API (live)
// Pulls username / avatar / status / activity from
// https://github.com/Phineas/lanyard and keeps them in sync
// over WebSocket. On failure it paints the static config values.
// ============================================================
const DISCORD_CDN = "https://cdn.discordapp.com";
const LANYARD_API = "https://api.lanyard.rest/v1";
const LANYARD_WS  = "wss://api.lanyard.rest/socket";

const STATUS_ICONS = {
  online:  "assets/icons/status/online.png",
  idle:    "assets/icons/status/inactive.png",
  dnd:     "assets/icons/status/busy.png",
  offline: "assets/icons/status/offline.png",
};

let lanyardUser       = null; // last presence snapshot — reused for avatar fallback
let avatarFileMissing = false; // true when the local avatar file fails to load

// Paint the static fallback values from config.js
function renderStaticDiscord() {
  document.getElementById("discord-username").textContent = CONFIG.discordUsername;
  document.getElementById("discord-activity").textContent = CONFIG.discordStatus;
  document.getElementById("discord-status-icon").src      =
    STATUS_ICONS[CONFIG.discordPresenceStatus] || STATUS_ICONS.offline;

  // Local file first — Discord's default avatar when it's missing
  const discordAvatarEl = document.getElementById("discord-avatar");
  const probe = new Image();
  probe.onload  = () => { if (!lanyardUser) discordAvatarEl.src = CONFIG.discordAvatar; };
  probe.onerror = () => { if (!lanyardUser) discordAvatarEl.src = `${DISCORD_CDN}/embed/avatars/0.png`; };
  probe.src     = CONFIG.discordAvatar;
}

// Resolve a user's avatar URL from their CDN hash
// (gif when animated, default avatar when none is set)
function lanyardAvatarUrl(user) {
  if (!user.avatar) {
    const index = user.discriminator && user.discriminator !== "0"
      ? Number(user.discriminator) % 5
      : Number((BigInt(user.id) >> 22n) % 6n);
    return `${DISCORD_CDN}/embed/avatars/${index}.png`;
  }
  const ext = user.avatar.startsWith("a_") ? "gif" : "png";
  return `${DISCORD_CDN}/avatars/${user.id}/${user.avatar}.${ext}?size=256`;
}

// One line describing what the user is doing right now:
// custom status first, then game / Spotify / stream / watch
function lanyardActivityLine(data) {
  const activities = data.activities || [];
  const custom = activities.find((a) => a.type === 4);

  if (custom && custom.state) {
    return custom.emoji && custom.emoji.name
      ? `${custom.emoji.name} ${custom.state}`
      : custom.state;
  }

  const activity = activities.find((a) => a.type !== 4);
  if (!activity) return "";

  if (activity.type === 2 && activity.name === "Spotify") {
    const song   = activity.details || "";
    const artist = (activity.assets && activity.assets.large_text) || "";
    return [song, artist].filter(Boolean).join(" — ") || "Spotify";
  }

  const verbs = {
    0: "Playing",      // game
    1: "Streaming",    // stream
    2: "Listening to", // music
    3: "Watching",     // watching
    5: "Competing in", // competing
  };
  return `${verbs[activity.type] || "Playing"} ${activity.name}`;
}

// Paint one presence snapshot into the card
function renderLanyard(data) {
  const user = data.discord_user;
  lanyardUser = user;

  // Main card photo missing on disk → use the live Discord avatar
  if (avatarFileMissing) {
    const avatarEl = document.getElementById("avatar");
    avatarEl.style.visibility = "";
    avatarEl.src = lanyardAvatarUrl(user);
  }

  document.getElementById("discord-username").textContent =
    user.global_name || user.username;

  document.getElementById("discord-avatar").src = lanyardAvatarUrl(user);

  document.getElementById("discord-status-icon").src =
    STATUS_ICONS[data.discord_status] || STATUS_ICONS.offline;

  // No activity → keep the static fallback text from config.js
  document.getElementById("discord-activity").textContent =
    lanyardActivityLine(data) || CONFIG.discordStatus || "";

  // Feed the lyrics widget (LRCLIB)
  updateLyrics(data);

  // Decoration ring — only when the user hasn't set one in config.js
  if (!CONFIG.avatarDecoration && user.avatar_decoration_data) {
    const decorationEl = document.getElementById("avatar-decoration");
    decorationEl.style.display = "";
    decorationEl.src = `${DISCORD_CDN}/avatar-decorations/${user.id}/${user.avatar_decoration_data.asset}.png?size=96&passthrough=true`;
  }
}

// REST fetch — instant first render + fallback when WebSocket is blocked
async function fetchLanyard(userId, fallback) {
  try {
    const res  = await fetch(`${LANYARD_API}/users/${userId}`);
    const json = await res.json();

    if (json.success) {
      renderLanyard(json.data);
      return true;
    }
    console.warn(`[lanyard] ${json.error.message} — join https://discord.gg/lanyard with your account and make sure your profile is public.`);
  } catch (err) {
    console.warn("[lanyard] request failed:", err);
  }
  fallback();
  return false;
}

// WebSocket — live updates: INIT_STATE once, then PRESENCE_UPDATE on
// every change (status, game, Spotify song…), no polling needed
function connectLanyard(userId) {
  let heartbeat;

  const connect = () => {
    const ws = new WebSocket(LANYARD_WS);

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      // Hello — start heartbeating, then subscribe to the user
      if (msg.op === 1) {
        heartbeat = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ op: 3 }));
          }
        }, msg.d.heartbeat_interval);
        ws.send(JSON.stringify({ op: 2, d: { subscribe_to_id: userId } }));
      }

      if (msg.op === 0 && (msg.t === "INIT_STATE" || msg.t === "PRESENCE_UPDATE")) {
        renderLanyard(msg.d);
      }
    };

    ws.onclose = () => {
      clearInterval(heartbeat);
      setTimeout(connect, 5000); // reconnect after 5s
    };
  };

  connect();
}

function initLanyard(userId, fallback) {
  fetchLanyard(userId, fallback);
  connectLanyard(userId);
}


// ============================================================
// BACKGROUND MUSIC — local playlist (assets/audio)
// One random track per visit, starts on entry click. When a
// playlist exists the lyrics widget follows it with perfect
// sync from <audio>.currentTime; with no playlist the widget
// falls back to Spotify via Lanyard.
// ============================================================
const bgAudio = document.getElementById("bg-audio");
let musicTracks = []; // playlist for this visit
let musicIndex  = 0;

function initMusicPlayer() {
  const music = CONFIG.music || {};
  musicTracks = (music.tracks || []).filter((t) => t && t.file);
  if (!musicTracks.length) return;

  musicIndex = musicTracks.length > 1 && music.shuffle !== false
    ? Math.floor(Math.random() * musicTracks.length)
    : 0;

  bgAudio.volume = typeof music.volume === "number" ? music.volume : 0.7;

  // styling vars
  const setVar = (name, value) => {
    if (value) document.documentElement.style.setProperty(name, value);
  };
  setVar("--music-box-background", music.boxBackground);
  setVar("--music-box-border",     music.boxBorder);
  setVar("--music-box-radius",     music.boxRadius);

  document.getElementById("music-player").hidden = false;

  // controls
  document.getElementById("player-prev").addEventListener("click", () => shiftTrack(-1));
  document.getElementById("player-next").addEventListener("click", () => shiftTrack(1));
  document.getElementById("player-play").addEventListener("click", togglePlay);

  // click the progress bar to seek
  document.getElementById("player-progress").addEventListener("click", (e) => {
    if (!bgAudio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    bgAudio.currentTime = ((e.clientX - rect.left) / rect.width) * bgAudio.duration;
  });

  // play / pause icon follows the audio element
  bgAudio.addEventListener("play",  () => setPlayIcon(true));
  bgAudio.addEventListener("pause", () => setPlayIcon(false));

  // time labels + progress bar refresh (CSS transition smooths it)
  setInterval(updatePlayerTimes, 250);

  // auto advance to the next song when one ends
  if (music.autoAdvance !== false) {
    bgAudio.addEventListener("ended", () => shiftTrack(1));
  }

  // synced lyrics — fetched once the duration is known (tighter match)
  bgAudio.addEventListener("loadedmetadata", () => {
    const track = musicTracks[musicIndex];
    if (track) loadLyrics(localTrackObject(track));
  });

  loadTrack(musicIndex, false); // reveal the player, autoplay comes on entry
}

function loadTrack(index, autoplay = true) {
  musicIndex = (index + musicTracks.length) % musicTracks.length;
  const track = musicTracks[musicIndex];

  bgAudio.src = track.file;
  // with auto-advance the playlist flows; otherwise the track loops
  bgAudio.loop = !musicAutoAdvance() && (CONFIG.music || {}).loop !== false;
  bgAudio.load();
  if (autoplay) bgAudio.play().catch(() => {});

  // player fields
  const coverEl = document.getElementById("player-cover");
  if (track.cover) {
    coverEl.style.display = "";
    coverEl.src = track.cover;
  } else {
    coverEl.style.display = "none";
    coverEl.removeAttribute("src");
  }
  document.getElementById("player-track-name").textContent   = track.trackName || track.title || "";
  document.getElementById("player-track-artist").textContent = track.artist || "";

  updatePlayerTimes();
  fillPlayerProgress(0);
}

function musicAutoAdvance() {
  return (CONFIG.music || {}).autoAdvance !== false;
}

function localTrackObject(track) {
  return {
    track_id: `local:${track.file}`,
    song:     track.title  || "",
    artist:   track.artist || "",
    album:    track.album  || "",
    timestamps: {
      start: Date.now(),
      end:   Date.now() + Math.round((bgAudio.duration || 0) * 1000),
    },
  };
}

function shiftTrack(direction) {
  loadTrack(musicIndex + direction);
}

function togglePlay() {
  if (bgAudio.paused) bgAudio.play().catch(() => {});
  else bgAudio.pause();
}

function setPlayIcon(isPlaying) {
  document.getElementById("player-play").textContent = isPlaying ? "⏸" : "▶";
  document.getElementById("music-player").classList.toggle("paused", !isPlaying);
}

function fmtTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

function updatePlayerTimes() {
  const nowEl   = document.getElementById("player-time-now");
  const totalEl = document.getElementById("player-time-total");
  const fill    = document.getElementById("player-progress-fill");

  if (bgAudio.duration > 0) {
    nowEl.textContent   = fmtTime(bgAudio.currentTime || 0);
    totalEl.textContent = fmtTime(bgAudio.duration);
    fill.style.width    = `${(bgAudio.currentTime / bgAudio.duration) * 100}%`;
  }
}

function fillPlayerProgress(percent) {
  const fill = document.getElementById("player-progress-fill");
  fill.style.width = `${Math.max(0, Math.min(percent, 100))}%`;
}


// ============================================================
// LYRICS WIDGET — LRCLIB (https://lrclib.net)
// Scrolls the synced lyrics of the Spotify song currently
// playing on the Lanyard user's account. Playback position is
// derived from Lanyard's Spotify timestamps, line timing from
// the track's LRC data. Everything is config-driven.
// ============================================================
const LRCLIB_API = "https://lrclib.net/api";

let lyricsState = { trackId: null, lines: [], startAt: 0, activeIndex: -1, raf: 0 };
const lyricsCache = new Map(); // track id -> parsed lines

function initLyricsWidget() {
  const widget = document.getElementById("lyrics-widget");
  const lw = CONFIG.lyricsWidget || {};

  if (!lw.enabled) {
    widget.hidden = true;
    return;
  }

  widget.hidden = false;
  const setVar = (name, value) => {
    if (value) document.documentElement.style.setProperty(name, value);
  };
  setVar("--lyrics-height",         lw.height);
  setVar("--lyrics-box-background", lw.boxBackground);
  setVar("--lyrics-box-border",     lw.boxBorder);
  setVar("--lyrics-box-radius",     lw.boxRadius);

  setLyricsMessage(lw.idleText);
}

// Hook called on every Lanyard presence snapshot
function updateLyrics(data) {
  const lw = CONFIG.lyricsWidget || {};
  if (!lw.enabled) return;
  if (musicTracks.length) return; // local playlist owns the widget

  const sp = data.spotify;
  if (!sp || !sp.song || !sp.timestamps) {
    lyricsIdle();
    return;
  }

  if (sp.track_id === lyricsState.trackId) {
    // Same track — just refresh the playback window
    lyricsState.startAt = sp.timestamps.start;
    return;
  }
  loadLyrics(sp);
}

function lyricsIdle() {
  cancelAnimationFrame(lyricsState.raf);
  if (lyricsState.trackId === null) return; // already idle

  lyricsState = { trackId: null, lines: [], startAt: 0, activeIndex: -1, raf: 0 };
  setLyricsMessage((CONFIG.lyricsWidget || {}).idleText);
}

async function loadLyrics(sp) {
  const lw = CONFIG.lyricsWidget || {};
  lyricsState.trackId = sp.track_id;
  lyricsState.startAt = sp.timestamps.start;
  lyricsState.duration = Math.round((sp.timestamps.end - sp.timestamps.start) / 1000);
  lyricsState.lines   = [];
  lyricsState.activeIndex = -1;

  if (lyricsCache.has(sp.track_id)) {
    applyLyrics(lyricsCache.get(sp.track_id));
    return;
  }

  setLyricsMessage(lw.loadingText);
  try {
    const lines = await fetchLyrics(sp);
    if (lyricsState.trackId !== sp.track_id) return; // track changed meanwhile
    lyricsCache.set(sp.track_id, lines);
    applyLyrics(lines);
  } catch (err) {
    console.warn("[lrclib] fetch failed:", err);
    if (lyricsState.trackId === sp.track_id) {
      setLyricsMessage(lw.notFoundText);
    }
  }
}

function applyLyrics(lines) {
  if (!lines || lines.length === 0) {
    setLyricsMessage((CONFIG.lyricsWidget || {}).notFoundText);
    return;
  }
  lyricsState.lines = lines;
  lyricsState.activeIndex = -1;
  renderLyricLines(lines);
  startLyricTicker();
}

// /get with album + duration is the tightest match; relax, then search
async function fetchLyrics(sp) {
  const duration = sp.timestamps && sp.timestamps.end
    ? Math.round((sp.timestamps.end - sp.timestamps.start) / 1000)
    : 0;

  const attempts = [
    { track_name: sp.song, artist_name: sp.artist,
      ...(sp.album ? { album_name: sp.album } : {}),
      ...(duration ? { duration } : {}) },
    { track_name: sp.song, artist_name: sp.artist },
  ];

  for (const params of attempts) {
    const json = await lrclibRequest(`${LRCLIB_API}/get?${new URLSearchParams(params)}`);
    if (json && json.syncedLyrics) return parseLrc(json.syncedLyrics);
  }

  const list = await lrclibRequest(`${LRCLIB_API}/search?${new URLSearchParams({ q: `${sp.song} ${sp.artist}` })}`);
  const hit  = Array.isArray(list) && list.find((r) => r.syncedLyrics);
  return hit ? parseLrc(hit.syncedLyrics) : null;
}

// null on any network / parse error — the caller shows a cute message
async function lrclibRequest(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn("[lrclib] request failed:", err);
    return null;
  }
}

// "[mm:ss.xx] text" -> { time, text }
function parseLrc(lrc) {
  const lines = [];
  for (const raw of lrc.split("\n")) {
    const m = raw.match(/^\s*\[(\d{1,2}):(\d{1,2})(?:\.(\d{1,3}))?\](.*)$/);
    if (!m) continue;
    const fracRaw = m[3] || "0";
    const frac = Number(fracRaw) / Math.pow(10, fracRaw.length);
    lines.push({
      time: Number(m[1]) * 60 + Number(m[2]) + frac,
      text: (m[4] || "").trim(),
    });
  }
  return lines.sort((a, b) => a.time - b.time);
}

function renderLyricLines(lines) {
  // switch from the message state back to the scrolling state
  const msg    = document.getElementById("lyrics-msg");
  const scroll = document.getElementById("lyrics-scroll");
  msg.hidden    = true;
  scroll.hidden = false;   // ← this was the bug: scroll stayed hidden

  const container = document.getElementById("lyrics-lines");
  container.innerHTML = "";
  lines.forEach((line) => {
    const div = document.createElement("div");
    div.className   = "lyric-line";
    div.textContent = line.text || "♪"; // instrumental gap
    container.appendChild(div);
  });
}

function startLyricTicker() {
  cancelAnimationFrame(lyricsState.raf);

  const tick = () => {
    const music = CONFIG.music || {};
    const lw    = CONFIG.lyricsWidget || {};
    const local = musicTracks.length > 0;

    const { lines } = lyricsState;
    if (lines.length) {
      // local playback syncs straight from <audio> (perfect timing);
      // spotify falls back to wall clock since the last presence update
      const elapsed = local
        ? bgAudio.currentTime * (music.syncFactor || 1) + (lw.delay || 0)
        : (Date.now() - lyricsState.startAt) / 1000 + (lw.delay || 0);

      let idx = -1;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].time <= elapsed) idx = i; else break;
      }

      if (idx !== lyricsState.activeIndex) {
        lyricsState.activeIndex = idx;
        highlightLyric(idx);
      }
    }

    lyricsState.raf = requestAnimationFrame(tick);
  };

  lyricsState.raf = requestAnimationFrame(tick);
}

function highlightLyric(idx) {
  const container = document.getElementById("lyrics-lines");
  const widget    = document.getElementById("lyrics-widget");
  const children  = container.children;

  for (let i = 0; i < children.length; i++) {
    children[i].classList.toggle("active", i === idx);
    children[i].classList.toggle("past",   idx >= 0 && i < idx);
  }

  if (idx >= 0 && children[idx]) {
    const current = children[idx];
    const offset  = current.offsetTop + current.offsetHeight / 2 - widget.clientHeight / 2;
    container.style.transform = `translateY(${-Math.max(offset, 0)}px)`;
  }
}

// Message state (idle / loading / not-found) — hides the scroll area
function setLyricsMessage(text) {
  cancelAnimationFrame(lyricsState.raf);
  lyricsState.raf = 0;

  const msg    = document.getElementById("lyrics-msg");
  const scroll = document.getElementById("lyrics-scroll");
  const container = document.getElementById("lyrics-lines");

  msg.hidden      = false;
  scroll.hidden   = true;
  msg.textContent = text;

  container.innerHTML  = "";
  container.style.transform = "translateY(0)";
}


// ============================================================
// MEDIA EMBEDS
// Turns pasted links into embedded players / media:
//   YouTube (video, shorts, playlist), Spotify (track, album,
//   playlist, episode), SoundCloud, direct mp4/mp3/gif/images,
//   and any other URL as a raw iframe.
// ============================================================
function initEmbeds() {
  const container = document.getElementById("embeds");
  (CONFIG.embeds || []).forEach((item) => {
    if (!item || !item.url) return;
    const embed = buildEmbed(item.url, item.height);
    container.appendChild(embed);
  });
}

// Build the right element for a pasted link
function buildEmbed(url, heightOverride) {
  let parsed;
  try {
    parsed = new URL(url, window.location.href);
  } catch (err) {
    const span = document.createElement("span");
    span.textContent = url;
    return span;
  }

  const host = parsed.hostname.replace(/^www\./, "");
  const path = parsed.pathname;
  let type = "iframe", src = url, wide = true, height = 0;

  // -- YouTube --
  if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
    const id   = parsed.searchParams.get("v");
    const list = parsed.searchParams.get("list");
    if (id) {
      src = `https://www.youtube.com/embed/${id}${list ? `?list=${list}` : ""}`;
    } else if (list) {
      src = `https://www.youtube.com/embed/videoseries?list=${list}`;
    } else if (path.startsWith("/shorts/")) {
      src = `https://www.youtube.com/embed${path.replace("/shorts/", "/")}`;
    }
  } else if (host === "youtu.be" && path.length > 1) {
    src = `https://www.youtube.com/embed${path}`;
  }

  // -- Spotify --
  const spotify = host === "open.spotify.com"
    ? path.match(/^\/(track|album|playlist|episode|show)\/([^/?]+)/)
    : null;
  if (spotify) {
    type  = "iframe";
    src   = `https://open.spotify.com/embed/${spotify[1]}/${spotify[2]}`;
    wide  = false;
    height = spotify[1] === "track" || spotify[1] === "episode" ? 152 : 352;
  }

  // -- SoundCloud (pink waveform to match the theme) --
  if (host === "soundcloud.com") {
    type  = "iframe";
    src   = `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23ffb7d5&theme_color=%231a1a1e&visual=false`;
    wide  = false;
    height = 166;
  }

  // -- direct media files --
  if (/\.(mp4|webm|mov)$/i.test(path))    { type = "video"; src = url; wide = false; }
  if (/\.(mp3|ogg|wav|m4a|flac)$/i.test(path)) { type = "audio"; src = url; wide = false; }
  if (/\.(png|jpe?g|gif|webp|avif)$/i.test(path)) { type = "image"; src = url; wide = false; }

  return embedElement(type, src, wide, heightOverride || height);
}

function embedElement(type, src, wide, height) {
  const wrapper = document.createElement("div");
  wrapper.className = "embed-item";

  if (type === "iframe") {
    const frame = document.createElement("iframe");
    frame.className = "embed-iframe" + (wide ? " wide" : "");
    frame.src = src;
    frame.loading = "lazy";
    frame.allow = "autoplay; clipboard-write; encrypted-media; picture-in-picture";
    frame.allowFullscreen = true;
    if (height) frame.style.height = `${height}px`;
    wrapper.appendChild(frame);
  }

  if (type === "video") {
    const video = document.createElement("video");
    video.className = "embed-video";
    video.src = src;
    video.controls = true;
    video.preload = "metadata";
    wrapper.appendChild(video);
  }

  if (type === "audio") {
    const audio = document.createElement("audio");
    audio.className = "embed-audio";
    audio.src = src;
    audio.controls = true;
    audio.preload = "metadata";
    wrapper.appendChild(audio);
  }

  if (type === "image") {
    const img = document.createElement("img");
    img.className = "embed-image";
    img.src = src;
    img.loading = "lazy";
    img.alt = "";
    wrapper.appendChild(img);
  }

  return wrapper;
}
// ============================================================
// CURSOR SPARKLE TRAIL
// 4-pointed star sparkles that appear at the cursor position
// and fade out while drifting. Spawning is done inside the
// requestAnimationFrame loop (not in mousemove) to avoid lag.
// ============================================================
function initCursorTrail() {
  const canvas = document.getElementById("cursor-canvas");
  const ctx    = canvas.getContext("2d");

  const { shootingStarColors, shootingStarSize,
          shootingStarMaxParticles, shootingStarFadeFrames,
          shootingStarGlow } = CONFIG;

  let particles = [];
  let mouseX = -999, mouseY = -999;
  let lastX  = -999, lastY  = -999;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function drawStar(x, y, size, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.quadraticCurveTo( size * 0.2, -size * 0.2,  size, 0);
    ctx.quadraticCurveTo( size * 0.2,  size * 0.2,  0,    size);
    ctx.quadraticCurveTo(-size * 0.2,  size * 0.2, -size, 0);
    ctx.quadraticCurveTo(-size * 0.2, -size * 0.2,  0,   -size);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Spawn new particles only when the mouse has moved
    if (mouseX !== lastX || mouseY !== lastY) {
      for (let i = 0; i < shootingStarMaxParticles; i++) {
        particles.push({
          x:             mouseX,
          y:             mouseY,
          vx:            (Math.random() - 0.5) * 1.2,
          vy:            (Math.random() - 0.5) * 1.2,
          life:          1,
          size:          shootingStarSize * (0.5 + Math.random() * 0.7),
          rotation:      Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.12,
          twinklePhase:  Math.random() * Math.PI * 2,
          color:         shootingStarColors[Math.floor(Math.random() * shootingStarColors.length)],
        });
      }
      lastX = mouseX;
      lastY = mouseY;
    }

    particles.forEach((p) => {
      p.x        += p.vx;
      p.y        += p.vy;
      p.vx       *= 0.97;
      p.vy       *= 0.97;
      p.rotation += p.rotationSpeed;
      p.life     -= 1 / shootingStarFadeFrames;

      const life    = Math.max(p.life, 0);
      const twinkle = 0.75 + 0.25 * Math.sin(performance.now() * 0.015 + p.twinklePhase);

      ctx.globalAlpha = life;
      ctx.fillStyle   = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur  = shootingStarGlow;
      drawStar(p.x, p.y, p.size * life * twinkle, p.rotation);
    });

    particles     = particles.filter((p) => p.life > 0);
    ctx.globalAlpha = 1;
    ctx.shadowBlur  = 0;
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener("resize", resize);
  requestAnimationFrame(draw);
}