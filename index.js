const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = 3000;

// --- CONFIGURATION ---
const CHANNELS_TO_WATCH = ["mrbased", "bjornlive", "notjosh", "riotcoke", "TheRealTenza", "dambit", "dexpuppy", "artgarfunkeljr", "oggeezer", "regiwock"];
const CHECK_INTERVAL_MS = 30000; // refresh backend every 30s
const API_BASE_URL = "https://api.livebeam.live/api";

// Store channel data in memory
let channelData = [];

/**
 * Check live status + fetch playback URLs for a channel.
 */
async function fetchChannelData(username) {
  try {
    const response = await axios.get(`${API_BASE_URL}/live-status/${username}`);
    const data = response.data?.data;

    if (!data) {
      return { username, isLive: false };
    }

    const isLive = data.is_live === true;
    const profilePicture = data.profile_picture_url ?? null;

    // Base object (works for offline too)
    const channelObj = {
      username,
      isLive,
      profile_picture_url: profilePicture,
    };

    // If offline, just return minimal info
    if (!isLive) {
      return channelObj;
    }

    // Live: fetch playback URLs
    const channelId = data.channel_id;
    const title = data.stream_title ?? "Untitled stream";
    const viewerCount = data.viewer_count ?? 0;

    if (!channelId) return channelObj;

    const streamInfoRes = await axios.get(`${API_BASE_URL}/get_livestream?channel_id=${channelId}`);
    const info = streamInfoRes.data;

    if (!info?.success || !info.playback_ids?.length) {
      return channelObj;
    }

    const playbackUrls = info.playback_ids.map(
      (entry) => `https://stream.mux.com/${entry.id}.m3u8`
    );

    return {
      ...channelObj,
      title,
      viewerCount,
      playbackUrls,
    };
  } catch (err) {
    console.error(`❌ ERROR fetching ${username}: ${err.message}`);
    return { username, isLive: false };
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

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

// API: return all channels (both live & offline)
app.get("/streams", (req, res) => {
  res.json(channelData);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Multiwatch running at http://localhost:${PORT}`);
  startMonitoring();
});
