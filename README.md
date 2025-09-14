<h1 align="center">Multiwatch for wots.live</h1>

<p align="center">
  🚧 <strong>Beta Notice:</strong> This project is currently in <em>beta</em>.  
  Expect some bugs and rough edges — active updates and improvements are in progress!
</p>

<p align="center">
  Monitor and watch multiple live streams from <a href="https://wots.live" target="_blank" rel="noopener">wots.live</a> using a tiny Node.js + Express service.
</p>

<p align="center">
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-≥18.x-339933?logo=node.js&logoColor=white">
  <img alt="Express" src="https://img.shields.io/badge/Express-5.x-black?logo=express">
  <img alt="License" src="https://img.shields.io/badge/License-MIT-blue">
</p>

<hr/>

<h2>Overview</h2>
<p>
This service polls the <code>livebeam.live</code> API (used by wots.live) for a list of channels, determines who is live, and exposes a JSON endpoint
that powers a simple frontend UI. Live streams return playable Mux HLS URLs, while offline channels return the most recent VOD (if available).
</p>

<hr/>

<h2>Features</h2>
<ul>
  <li>✅ Multi-channel polling with configurable interval</li>
  <li>✅ Live/VOD detection with Mux playback URLs</li>
  <li>✅ JSON endpoint at <code>/streams</code></li>
  <li>✅ Static frontend served from <code>/public</code></li>
  <li>✅ Minimal dependencies (Express + Axios)</li>
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
</code></pre>

<ol start="3">
  <li><strong>Run</strong> the server:</li>
</ol>

<pre><code>npm start
# or:
node monitor.js
</code></pre>

<p>
By default it starts on <code>http://localhost:3000</code> and begins polling immediately.
</p>

<hr/>

<h2>Configuration</h2>
<p>Defined at the top of <code>monitor.js</code>:</p>

<pre><code>const CHANNELS_TO_WATCH = [ "mrbased", "bjornlive", "riotcoke", ... ];
const CHECK_INTERVAL_MS = 30000;
const API_BASE_URL = "https://api.livebeam.live/api";
</code></pre>

<ul>
  <li><code>CHANNELS_TO_WATCH</code> → Array of usernames to monitor.</li>
  <li><code>CHECK_INTERVAL_MS</code> → Polling interval (ms).</li>
  <li><code>API_BASE_URL</code> → Livebeam API base URL.</li>
</ul>

<hr/>

<h2>Endpoints</h2>

<h3><code>GET /streams</code></h3>
<p>Returns JSON snapshot of all configured channels (live or offline).</p>

<pre><code>curl http://localhost:3000/streams
</code></pre>

<h3>Static UI</h3>
<p>
The <code>public/index.html</code> frontend is served automatically. It displays live streams and recent VODs using
<a href="https://github.com/video-dev/hls.js/" target="_blank" rel="noopener">hls.js</a>.
</p>

<hr/>

<h2>Frontend</h2>
<ul>
  <li><strong>Live streams</strong>: autoplay when visible (lazy via <code>IntersectionObserver</code>)</li>
  <li><strong>Offline VODs</strong>: click-to-play with overlay</li>
  <li><strong>Responsive grid</strong>: styled via <code>styles.css</code></li>
</ul>

<p>Preview of <code>index.html</code> behavior:</p>

<pre><code>&lt;div id="live-section"&gt;
  &lt;img src="live.jpg" class="status-logo"&gt;Live Streams
  &lt;div id="streams-live"&gt;&lt;/div&gt;
&lt;/div&gt;

&lt;div id="offline-section"&gt;
  &lt;img src="offline.png" class="status-logo"&gt;Offline VODs
  &lt;div id="streams-offline"&gt;&lt;/div&gt;
&lt;/div&gt;
</code></pre>

<hr/>

<h2>Project Structure</h2>

<pre><code>.
├─ monitor.js          # Express server + polling
├─ public/
│  ├─ index.html       # Frontend UI
│  ├─ styles.css       # Styling
│  └─ assets...
└─ package.json
</code></pre>

<hr/>

<h2>Deployment</h2>

<h3>Docker</h3>
<pre><code>docker build -t multiwatch .
docker run --rm -p 3000:3000 multiwatch
</code></pre>

<h3>PM2</h3>
<pre><code>npm i -g pm2
pm2 start monitor.js --name multiwatch
pm2 save
</code></pre>

<hr/>

<h2>Known Issues & Roadmap</h2>

<ul>
  <li>⚠️ Some streams occasionally fail to load — retry logic is being improved</li>
  <li>⚠️ Offline VOD detection is inconsistent for certain channels</li>
  <li>⚠️ UI may not scale well on smaller mobile screens</li>
</ul>

<p><strong>Planned Updates:</strong></p>
<ul>
  <li>🔄 More stable polling and error handling</li>
  <li>📱 Improved mobile-friendly UI</li>
  <li>⚡ Configurable frontend (custom channel selection)</li>
  <li>🛠️ Docker Compose support for easier deployment</li>
</ul>

<hr/>

<h2>License</h2>
<p>GNU General Public License v3.0  — see <code>LICENSE</code>.</p>

<hr/>

<h2>Credits</h2>
<ul>
  <li>Built for the <a href="https://wots.live" target="_blank" rel="noopener">wots.live</a> community</li>
  <li>Thanks to <a href="https://mux.com" target="_blank" rel="noopener">Mux</a> for streaming infra</li>
</ul>
