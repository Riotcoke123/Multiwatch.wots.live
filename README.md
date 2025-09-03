<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  
</head>
<body>
<!-- README.md (HTML-flavored) -->

<h1 align="center">Multiwatch for wots.live</h1>
<p align="center">
  Monitor and watch multiple live streams from <a href="https://wots.live" target="_blank" rel="noopener">wots.live</a> using a tiny Node.js service.
</p>

<p align="center">
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-≥18.x-339933?logo=node.js&logoColor=white">
  <img alt="Express" src="https://img.shields.io/badge/Express-5.x-black?logo=express">
  <img alt="License" src="https://img.shields.io/badge/License-MIT-blue">
</p>

<hr/>

<h2>Overview</h2>
<p>
This project polls the <code>livebeam.live</code> API (used by wots.live) for a list of channels, determines who is live, and exposes a lightweight JSON endpoint
you can use to build a multi-view UI. For live channels, it returns playable Mux HLS URLs; for offline channels, it fetches the most recent VOD if available.
</p>

<pre><code>// High level:
- Poll a set list of channel usernames on an interval
- For each channel:
  - If LIVE: return stream title, viewer count, and Mux playback URLs
  - If OFFLINE: return most recent VOD (title, thumbnail, playback URL) when available
- Expose results at GET /streams
- Serve any static UI from /public
</code></pre>

<hr/>

<h2>Features</h2>
<ul>
  <li>✅ Multi-channel polling with a configurable interval</li>
  <li>✅ Live / VOD detection with Mux playback URLs</li>
  <li>✅ Single JSON endpoint (<code>/streams</code>) for your frontend</li>
  <li>✅ Static hosting for your UI via <code>/public</code></li>
  <li>✅ Minimal dependencies (Express + Axios)</li>
</ul>

<hr/>

<h2>Prerequisites</h2>
<ul>
  <li><a href="https://nodejs.org/" target="_blank" rel="noopener">Node.js</a> 18 or newer</li>
  <li>npm or pnpm/yarn</li>
</ul>

<hr/>

<h2>Quick Start</h2>

<ol>
  <li><strong>Clone</strong> the repo:</li>
</ol>
<pre><code>git clone https://github.com/Riotcoke123/Multiwatch.wots.live.git
cd Multiwatch.wots.live
</code></pre>

<ol start="2">
  <li><strong>Install</strong> dependencies:</li>
</ol>
<pre><code>npm install
# or: pnpm install / yarn
</code></pre>

<ol start="3">
  <li><strong>Run</strong> the server:</li>
</ol>
<pre><code>npm start
# or: node index.js
</code></pre>

<p>
By default it starts on <code>http://localhost:3000</code> and begins polling immediately.
</p>

<hr/>

<h2>Configuration</h2>
<p>Configuration lives at the top of <code>index.js</code>:</p>

<pre><code>const CHANNELS_TO_WATCH = [
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
</code></pre>

<ul>
  <li><code>CHANNELS_TO_WATCH</code> — List of usernames to monitor (strings as they appear on wots.live).</li>
  <li><code>CHECK_INTERVAL_MS</code> — Poll cadence (milliseconds). Default: 30s.</li>
  <li><code>API_BASE_URL</code> — Base URL for the livebeam API.</li>
</ul>

<p><em>Tip:</em> You can move these into environment variables if you prefer (e.g., using <code>dotenv</code>).</p>

<hr/>

<h2>How It Works</h2>

<h3>APIs called under the hood</h3>
<ul>
  <li><code>GET /live-status/:username</code> — Live status + channel IDs</li>
  <li><code>GET /get_livestream?channel_id=ID</code> — Playback IDs for live streams</li>
  <li><code>GET /get-livestreams?channel_id=ID</code> — Historical streams (to find the latest VOD)</li>
</ul>

<h3>Data shape</h3>
<p>Each entry in the array returned from <code>/streams</code> looks like:</p>

<pre><code>{
  "username": "riotcoke",
  "isLive": true,
  "profile_picture_url": "https://cdn.example/avatar.png",
  "live": {
    "title": "Untitled stream",
    "viewerCount": 123,
    "playbackUrls": [
      "https://stream.mux.com/&lt;PLAYBACK_ID&gt;.m3u8",
      "..."
    ]
  },
  "vod": null
}

// When offline and a VOD exists:
{
  "username": "riotcoke",
  "isLive": false,
  "profile_picture_url": "https://cdn.example/avatar.png",
  "live": null,
  "vod": {
    "vodTitle": "Previous stream",
    "vodThumbnail": "https://thumb.example.jpg",
    "vodPlaybackUrl": "https://stream.mux.com/&lt;VOD_PLAYBACK_ID&gt;.m3u8",
    "vodEndedAt": "2025-08-31T19:12:34Z"
  }
}
</code></pre>

<hr/>

<h2>Endpoints</h2>

<h3><code>GET /streams</code></h3>
<p>Returns the current snapshot for all configured channels.</p>

<pre><code>curl http://localhost:3000/streams
</code></pre>

<h3>Static UI</h3>
<p>
Any files in the <code>public/</code> directory are served statically. You can drop a simple front-end here
to render cards for each channel and attach an HLS player (e.g., <a href="https://github.com/video-dev/hls.js/" target="_blank" rel="noopener">hls.js</a>) to the returned Mux URLs.
</p>

<hr/>

<h2>Minimal Frontend Example</h2>
<p>Create <code>public/index.html</code> to visualize results:</p>

<pre><code>&lt;!doctype html&gt;
&lt;html&gt;
&lt;head&gt;
  &lt;meta charset="utf-8"&gt;
  &lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
  &lt;title&gt;Multiwatch&lt;/title&gt;
  &lt;style&gt;
    body { font-family: ui-sans-serif, system-ui; margin: 2rem; }
    .grid { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }
    .card { border: 1px solid #eee; border-radius: 12px; padding: 1rem; }
    .live { background: #e6ffec; }
    .offline { background: #fafafa; }
    video { width: 100%; border-radius: 8px; }
  &lt;/style&gt;
  &lt;script src="https://cdn.jsdelivr.net/npm/hls.js@latest"&gt;&lt;/script&gt;
&lt;/head&gt;
&lt;body&gt;
  &lt;h1&gt;Multiwatch&lt;/h1&gt;
  &lt;div id="root" class="grid"&gt;&lt;/div&gt;

  &lt;script&gt;
    async function load() {
      const res = await fetch('/streams');
      const channels = await res.json();

      const root = document.getElementById('root');
      root.innerHTML = '';

      channels.forEach(ch =&gt; {
        const card = document.createElement('div');
        card.className = 'card ' + (ch.isLive ? 'live' : 'offline');
        card.innerHTML = `
          &lt;h3&gt;${ch.username} ${ch.isLive ? '🔴' : '⚫'}&lt;/h3&gt;
          ${ch.isLive ? `&lt;p&gt;${ch.live.title} — 👀 ${ch.live.viewerCount}&lt;/p&gt;` : ''}
          ${!ch.isLive &amp;&amp; ch.vod ? `&lt;p&gt;Last VOD: ${ch.vod.vodTitle}&lt;/p&gt;` : ''}
          &lt;div class="player"&gt;&lt;/div&gt;
        `;

        const player = card.querySelector('.player');

        const url = ch.isLive ? ch.live.playbackUrls?.[0] : ch.vod?.vodPlaybackUrl;
        if (url) {
          const video = document.createElement('video');
          video.controls = true;
          if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(video);
          } else {
            video.src = url;
          }
          player.appendChild(video);
        }

        root.appendChild(card);
      });
    }

    load();
    setInterval(load, 30000);
  &lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;
</code></pre>

<hr/>

<h2>Project Structure</h2>

<pre><code>.
├─ public/             # Your static UI (optional)
├─ index.js            # Express server + polling logic
├─ package.json
└─ README.md
</code></pre>

<hr/>

<h2>Development Notes</h2>
<ul>
  <li><strong>Polling</strong>: Set via <code>CHECK_INTERVAL_MS</code>. Be considerate of API usage; avoid overly aggressive intervals.</li>
  <li><strong>Playback URLs</strong>: Responses return Mux <code>.m3u8</code> HLS URLs. Use a browser HLS library (e.g., hls.js) for playback.</li>
  <li><strong>Error Handling</strong>: Failures for a channel are logged and that channel is returned as offline with nulls.</li>
  <li><strong>Extending</strong>: Consider adding caching, retries/backoff, metrics, and env-based config.</li>
</ul>

<hr/>

<h2>Deployment</h2>

<h3>Docker (example)</h3>
<pre><code># Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 3000
CMD ["node", "index.js"]
</code></pre>

<pre><code>docker build -t multiwatch .
docker run --rm -p 3000:3000 multiwatch
</code></pre>

<h3>PM2 (system service)</h3>
<pre><code>npm i -g pm2
pm2 start index.js --name multiwatch
pm2 save
pm2 startup  # follow instructions
</code></pre>

<hr/>

<h2>Troubleshooting</h2>
<ul>
  <li><strong>No streams returned?</strong> Confirm usernames in <code>CHANNELS_TO_WATCH</code> are correct.</li>
  <li><strong>Video won't play?</strong> Ensure you use hls.js on browsers without native HLS support (most desktop Chrome/Firefox).</li>
  <li><strong>CORS issues?</strong> You’re fetching from your own server (<code>/streams</code>) in the same origin; if you host the UI elsewhere, enable CORS.</li>
  <li><strong>Rate limits / timeouts?</strong> Increase interval, add retry/backoff, and log the underlying errors.</li>
</ul>

<hr/>

<h2>License</h2>
<p>MIT — see <code>LICENSE</code>.</p>

<hr/>

<h2>Credits</h2>
<ul>
  <li>Built for the <a href="https://wots.live" target="_blank" rel="noopener">wots.live</a> community</li>
  <li>Thanks to <a href="https://mux.com" target="_blank" rel="noopener">Mux</a> for streaming infra</li>
</ul>
