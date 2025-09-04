const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = 3000;

// --- CONFIGURATION ---
const CHANNELS_TO_WATCH = [
  "mrbased",
  "bjornlive",
  "notjosh",
  "riotcoke",
  "TheRealTenza",
  "dambit",
  "dexpuppy",
  "artgarfunkeljr",
  "oggeezer",
  "regiwock",
];
const CHECK_INTERVAL_MS = 30000;
const API_BASE_URL = "https://api.livebeam.live/api";

// Store channel data in memory
let channelData = [];

/**
 * Fetch last VOD for offline channel
 */
async function fetchLastVod(channelId) {
  try {
    const res = await axios.get(`${API_BASE_URL}/get-livestreams?channel_id=${channelId}`);
    const streams = res.data?.data?.streams ?? [];
    if (!streams.length) return null;

    const lastStream = streams
      .filter((s) => s.status === "ended")
      .sort((a, b) => new Date(b.ended_at) - new Date(a.ended_at))[0];

    if (!lastStream) return null;

    return {
      vodTitle: lastStream.title ?? "Previous stream",
      vodThumbnail: lastStream.thumbnail_url ?? null,
      vodPlaybackUrl: lastStream.vod_playback_id
        ? `https://stream.mux.com/${lastStream.vod_playback_id}.m3u8`
        : null,
      vodEndedAt: lastStream.ended_at,
    };
  } catch (err) {
    console.error(`❌ ERROR fetching VOD for ${channelId}: ${err.message}`);
    return null;
  }
}

/**
 * Check live status + fetch playback URLs for a channel.
 */
async function fetchChannelData(username) {
  try {
    const response = await axios.get(`${API_BASE_URL}/live-status/${username}`);
    const data = response.data?.data;

    if (!data) {
      return {
        username,
        isLive: false,
        profile_picture_url: null,
        live: null,
        vod: null,
      };
    }

    const isLive = data.is_live === true;
    const profilePicture = data.profile_picture_url ?? null;
    const channelId = data.channel_id;

    if (!channelId) {
      return {
        username,
        isLive: false,
        profile_picture_url: profilePicture,
        live: null,
        vod: null,
      };
    }

    if (isLive) {
      // ---- ONLINE ----
      const title = data.stream_title ?? "Untitled stream";
      const viewerCount = data.viewer_count ?? 0;

      const streamInfoRes = await axios.get(`${API_BASE_URL}/get_livestream?channel_id=${channelId}`);
      const info = streamInfoRes.data;

      if (!info?.success || !info.playback_ids?.length) {
        return {
          username,
          isLive: true,
          profile_picture_url: profilePicture,
          live: null,
          vod: null,
        };
      }

      const playbackUrls = info.playback_ids.map(
        (entry) => `https://stream.mux.com/${entry.id}.m3u8`
      );

      return {
        username,
        isLive: true,
        profile_picture_url: profilePicture,
        live: {
          title,
          viewerCount,
          playbackUrls,
        },
        vod: null, // live channels don’t include vod
      };
    } else {
      // ---- OFFLINE ----
      const lastVod = await fetchLastVod(channelId);
      return {
        username,
        isLive: false,
        profile_picture_url: profilePicture,
        live: null,
        vod: lastVod, // may be null if no VOD exists
      };
    }
  } catch (err) {
    console.error(`❌ ERROR fetching ${username}: ${err.message}`);
    return {
      username,
      isLive: false,
      profile_picture_url: null,
      live: null,
      vod: null,
    };
  }
}

/**
 * Refresh channel data
 */
async function refreshChannels() {
  console.log(`[${new Date().toLocaleTimeString()}] Refreshing channels...`);
  const results = await Promise.all(CHANNELS_TO_WATCH.map(fetchChannelData));
  channelData = results;
  const liveCount = results.filter((c) => c.isLive).length;
  console.log(`✅ Found ${liveCount} live stream(s).`);
}

/**
 * Start monitoring
 */
function startMonitoring() {
  refreshChannels();
  setInterval(refreshChannels, CHECK_INTERVAL_MS);
}

// --- EXPRESS SERVER ---

app.use(express.static(path.join(__dirname, "public")));

app.get("/streams", (req, res) => {
  res.json(channelData);
});

app.listen(PORT, () => {
  console.log(`🚀 Multiwatch running at http://localhost:${PORT}`);
  startMonitoring();
});
