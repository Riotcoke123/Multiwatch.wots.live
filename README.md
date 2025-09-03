<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  
</head>
<body>

<img width="533" height="138" alt="wots" src="https://github.com/user-attachments/assets/1ee89fd5-5a43-4470-9a72-8a3668d94e09" />

  <img width="1234" height="716" alt="123" src="https://github.com/user-attachments/assets/a5252768-a3e8-4268-bb47-a5321a023145" />

  <h1>Multiwatch.wots.live</h1>
  <p>
    Multiwatch.wots.live is a Node.js application that allows you to monitor and watch multiple live streams from 
    <a href="https://wots.live" target="_blank">wots.live</a>. It automatically tracks selected channels, fetches live status, viewer counts, stream titles, and playback URLs, and exposes this data via a simple API.
  </p>
  <h2>Features</h2>
  <ul>
    <li>Monitor multiple channels simultaneously.</li>
    <li>Automatic refresh of channel data every 30 seconds.</li>
    <li>Fetch live stream details including:
      <ul>
        <li>Stream title</li>
        <li>Viewer count</li>
        <li>Playback URLs</li>
        <li>Profile picture</li>
      </ul>
    </li>
    <li>Serves a static frontend for easy viewing (optional).</li>
    <li>Simple API endpoint to get all channel data.</li>
  </ul>

  <h2>Configuration</h2>
  <p>Update the following values in <code>monitor.js</code> as needed:</p>
  <pre><code>const CHANNELS_TO_WATCH = ["mrbased", "bjornlive", "notjosh", "riotcoke", "TheRealTenza", "dambit", "dexpuppy", "artgarfunkeljr", "oggeezer", "regiwock"];
const CHECK_INTERVAL_MS = 30000;
const API_BASE_URL = "https://api.livebeam.live/api";</code></pre>

  <h2>Installation</h2>
  <pre><code>git clone https://github.com/Riotcoke123/Multiwatch.wots.live.git
cd Multiwatch.wots.live
npm install</code></pre>

  <h2>Usage</h2>
  <pre><code>npm start
# or
node monitor.js</code></pre>
  <p>
    - Access the frontend (if available) via: <a href="http://localhost:3000" target="_blank">http://localhost:3000</a><br>
    - API endpoint for all streams: <code>http://localhost:3000/streams</code>
  </p>

  <h2>Example API Response</h2>
  <pre><code>[
  {
    "username": "mrbased",
    "isLive": true,
    "profile_picture_url": "https://example.com/avatar.jpg",
    "title": "Chill Stream",
    "viewerCount": 123,
    "playbackUrls": [
      "https://stream.mux.com/abc123.m3u8"
    ]
  },
  {
    "username": "bjornlive",
    "isLive": false,
    "profile_picture_url": "https://example.com/avatar2.jpg"
  }
]</code></pre>

  <h2>License</h2>
  <p>This project is licensed under the <strong>GNU General Public License v3.0</strong>.</p>

  <h2>API Reference</h2>
  <p>The API for <a href="https://wots.live" target="_blank">wots.live</a> is available at: 
    <a href="https://github.com/Riotcoke123/wots.live_API_V1" target="_blank">https://github.com/Riotcoke123/wots.live_API_V1</a>
  </p>
</body>
</html>
