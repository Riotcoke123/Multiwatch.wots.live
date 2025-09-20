<!DOCTYPE html>
<html lang="en">

<body class="bg-slate-900 text-white p-6">
    <div class="max-w-4xl mx-auto space-y-8">
        <div class="flex justify-center">
            <img width="533" height="138" alt="wots" src="https://github.com/user-attachments/assets/35008bb8-cf04-40dd-abe4-768f054abed0" />
        </div>
        <header class="text-center space-y-2">
            <h1 class="text-4xl md:text-5xl font-extrabold text-indigo-400">Multiwatch.wots.live</h1>
            <p class="text-lg text-slate-300">A multi-stream viewer for <a href="https://wots.live/" class="text-indigo-400 hover:text-indigo-200 underline">Wots.Live</a> channels, designed to let you watch multiple live streams and VODs simultaneously.</p>
        </header>
        <section class="space-y-4">
            <h2 class="text-2xl md:text-3xl font-bold text-indigo-300">Features</h2>
            <ul class="list-disc list-inside space-y-2 text-slate-200">
                <li><strong class="font-semibold">Real-time Live Stream Monitoring:</strong> Automatically detects and displays live streams from a predefined list of Wots.Live channels.</li>
                <li><strong class="font-semibold">Lazy Loading & Autoplay:</strong> Live streams only load and play when they are visible in the viewport, optimizing performance and bandwidth usage.</li>
                <li><strong class="font-semibold">Offline VOD Access:</strong> Shows the most recent VOD (Video on Demand) for channels that are currently offline.</li>
                <li><strong class="font-semibold">Dynamic UI:</strong> The interface automatically updates to reflect which channels are live or offline without needing a page refresh.</li>
            </ul>
        </section>
        <section class="space-y-4">
            <h2 class="text-2xl md:text-3xl font-bold text-indigo-300">How It Works</h2>
            <p class="text-slate-200">
                This application consists of a backend server (<code>monitor.js</code>) and a frontend UI (<code>index.html</code>). It uses the <a href="https://github.com/Riotcoke123/wots.live_API_V1" class="text-indigo-400 hover:text-indigo-200 underline">Wots.Live API</a> to fetch stream information.
            </p>
            <ol class="list-decimal list-inside space-y-2 text-slate-200">
                <li>The server continuously polls the Wots.Live API to check the status of a list of specified channels.</li>
                <li>It collects information about live streams (title, viewer count, playback URLs) and the most recent VODs for offline channels.</li>
                <li>The frontend makes a request to the server's <code>/streams</code> endpoint to get the latest channel data.</li>
                <li>The JavaScript in the frontend dynamically creates and updates the video widgets, using <code>hls.js</code> to play the M3U8 stream formats.</li>
            </ol>
        </section>
        <section class="space-y-4">
            <h2 class="text-2xl md:text-3xl font-bold text-indigo-300">Technologies Used</h2>
            <ul class="list-disc list-inside space-y-2 text-slate-200">
                <li><strong class="font-semibold">Backend:</strong> Node.js, Express, Axios</li>
                <li><strong class="font-semibold">Frontend:</strong> HTML5, CSS, JavaScript</li>
                <li><strong class="font-semibold">Video Playback:</strong> hls.js for HLS streaming</li>
            </ul>
        </section>
                <section class="space-y-4">
            <h2 class="text-2xl md:text-3xl font-bold text-indigo-300">Getting Started Locally</h2>
            <p class="text-slate-200">To run this project on your local machine, follow these steps:</p>
            <ol class="list-decimal list-inside space-y-2 text-slate-200">
                <li>Make sure you have Node.js installed.</li>
                <li>Clone the repository: <code>git clone https://github.com/Riotcoke123/Multiwatch.wots.live.git</code></li>
                <li>Navigate into the project directory: <code>cd Multiwatch.wots.live</code></li>
                <li>Install dependencies: <code>npm install express axios</code></li>
                <li>Start the server: <code>node monitor.js</code></li>
                <li>Open your web browser and go to <code>http://localhost:3000</code>.</li>
            </ol>
        </section>
        <section class="space-y-4">
            <h2 class="text-2xl md:text-3xl font-bold text-indigo-300">License</h2>
            <p class="text-slate-200">
                This project is licensed under the <a href="https://www.gnu.org/licenses/gpl-3.0.en.html" class="text-indigo-400 hover:text-indigo-200 underline">GNU General Public License v3.0</a>.
            </p>
        </section>
    </div>
</body>
</html>
