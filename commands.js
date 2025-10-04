function applyFont(fontNumber) {
    const fontMap = { 1: "'JetBrains Mono', monospace", 2: "'Fira Code', monospace", 3: "'Source Code Pro', monospace", 4: "'IBM Plex Mono', monospace", 5: "'Anonymous Pro', monospace", 6: "'Roboto Mono', monospace", 7: "'Space Mono', monospace", 8: "'Ubuntu Mono', monospace", 9: "'VT323', monospace", 10: "'Nanum Gothic Coding', monospace", 11: "'Cutive Mono', monospace", 12: "'Share Tech Mono', monospace", 13: "'Major Mono Display', monospace", 14: "'Nova Mono', monospace", 15: "'Syne Mono', monospace" };
    const fontFamily = fontMap[fontNumber];
    if (fontFamily) { document.querySelector('.terminal').style.fontFamily = fontFamily; return true; }
    return false;
}

function applyFontColor(color) {
    if (color) {
        document.documentElement.style.setProperty('--on-surface', color);
    } else {
        document.documentElement.style.setProperty('--on-surface', '#c9d1d9');
    }
}

function dragElement(elmnt, headerId) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const header = document.getElementById(headerId) || elmnt;
    if (header) { header.onmousedown = dragMouseDown; header.style.cursor = 'grab'; }
    function dragMouseDown(e) { e = e || window.event; e.preventDefault(); pos3 = e.clientX; pos4 = e.clientY; document.onmouseup = closeDragElement; document.onmousemove = elementDrag; if (header) header.style.cursor = 'grabbing'; elmnt.style.transition = 'none'; }
    function elementDrag(e) { e = e || window.event; e.preventDefault(); pos1 = pos3 - e.clientX; pos2 = pos4 - e.clientY; pos3 = e.clientX; pos4 = e.clientY; elmnt.style.top = `${elmnt.offsetTop - pos2}px`; elmnt.style.left = `${elmnt.offsetLeft - pos1}px`; }
    function closeDragElement() { document.onmouseup = null; document.onmousemove = null; if (header) header.style.cursor = 'grab'; elmnt.style.transition = 'opacity 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease'; }
}

const lastUpdatedDate = new Date('2025-10-04');

let guessTheNumberGame = {
    isActive: false,
    secretNumber: 0,
    attempts: 0,
};

const commands = {
    help: (args) => {
        const page = parseInt(args.trim()) || 1;
        let output = `<p><span class="highlight">Command List (Page ${page}/3)</span></p><br/>`;
        switch (page) {
            case 1:
                output += `
                    <p class="highlight">--- [ General ] ---</p>
                    <p><span class="highlight-secondary">help [page]</span>      - Shows this help message</p>
                    <p><span class="highlight-secondary">clear</span>            - Clears the terminal screen</p>
                    <p><span class="highlight-secondary">echo [text]</span>      - Prints the specified text</p>
                    <p><span class="highlight-secondary">date</span>             - Shows current date and time</p>
                    <p><span class="highlight-secondary">history</span>          - Shows command history</p>
                    <br/>
                    <p class="highlight">--- [ Customization ] ---</p>
                    <p><span class="highlight-secondary">whoami</span>           - Shows current user and host</p>
                    <p><span class="highlight-secondary">setname [name]</span>   - Set a custom username</p>
                    <p><span class="highlight-secondary">sethost [name]</span>   - Set a custom hostname</p>
                    <p><span class="highlight-secondary">fonts</span>            - Change the terminal font</p>
                    <p><span class="highlight-secondary">fontcolor</span>        - Change the terminal font color</p>
                    <p><span class="highlight-secondary">themes</span>           - Change the terminal color scheme</p>
                    <p><span class="highlight-secondary">welcomemsg</span>       - Set a custom welcome message</p>
                    <br/>
                    <p>Type <span class="highlight">'help 2'</span> or <span class="highlight">'help 3'</span> for more commands.</p>
                `;
                break;
            case 2:
                output += `
                    <p class="highlight">--- [ System ] ---</p>
                    <p><span class="highlight-secondary">fastfetch</span>        - Displays detailed system information</p>
                    <p><span class="highlight-secondary">software</span>         - View system software info and changelog</p>
                    <p><span class="highlight-secondary">logs</span>             - View recent system logs</p>
                    <p><span class="highlight-secondary">battery</span>          - Shows battery status</p>
                    <p><span class="highlight-secondary">processes</span>        - Lists running processes</p>
                    <p><span class="highlight-secondary">stop [process]</span>   - Stop a process or component</p>
                    <p><span class="highlight-secondary">reset</span>            - Reset all user data</p>
                    <p><span class="highlight-secondary">bios</span>             - Enter the BIOS utility</p>
                    <p><span class="highlight-secondary">shutdown</span>         - Shutsdown OrbitOS</p>
                    <p><span class="highlight-secondary">reboot</span>           - Reboots OrbitOS</p>
                    <p><span class="highlight-secondary">rm</span>               - ...</p>
                    <br/>
                    <p>Type <span class="highlight">'help 3'</span> for more commands.</p>
                `;
                break;
            case 3:
                output += `
                    <p class="highlight">--- [ Tools, Games & Fun ] ---</p>
                    <p><span class="highlight-secondary">guess [number]</span>   - Play a number guessing game</p>
                    <p><span class="highlight-secondary">cowsay [msg]</span>     - The cow says your message</p>
                    <p><span class="highlight-secondary">fortune</span>          - Displays a random fortune cookie</p>
                    <p><span class="highlight-secondary">passgen [len]</span>    - Generates a random password</p>
                    <p><span class="highlight-secondary">notes</span>            - Manage your notes</p>
                    <p><span class="highlight-secondary">calc [expr]</span>      - Calculate mathematical expression</p>
                    <p><span class="highlight-secondary">translate [fr:to]</span>- Translates text</p>
                    <p><span class="highlight-secondary">wiki [query]</span>     - Search Wikipedia and display summary</p>
                    <p><span class="highlight-secondary">tts [text]</span>       - Text to speech</p>
                    <br/>
                    <p class="highlight">--- [ Media ] ---</p>
                    <p><span class="highlight-secondary">browser [url]</span>    - Opens a URL in a frame</p>
                    <p><span class="highlight-secondary">hide [player]</span>    - Hides/shows the music or video player</p>
                    <p><span class="highlight-secondary">music</span>            - Opens the music player</p>
                    <p><span class="highlight-secondary">video</span>            - Opens the video player</p>
                    <br/>
                    <p>End of command list.</p>
                `;
                break;
            default:
                output = `<p class="error-message">Invalid page number. Please use 'help 1', 'help 2', or 'help 3'.</p>`;
        }
        return output;
    },
     themes: (args) => {
        const themeMap = {
            1: { name: 'Orbit', id: 'default' },
            2: { name: 'Solar Flare', id: 'solar-flare' },
            3: { name: 'Nebula', id: 'nebula' },
            4: { name: 'Matrix', id: 'matrix' },
            5: { name: 'Arctic', id: 'arctic' },
            6: { name: 'Cyberpunk', id: 'cyberpunk' },
            7: { name: 'Oceanic', id: 'oceanic' },
            8: { name: 'Forest', id: 'forest' },
            9: { name: 'Sunset', id: 'sunset' },
            10: { name: 'Monokai', id: 'monokai' },
            11: { name: 'Dracula', id: 'dracula' },
            12: { name: 'Nord', id: 'nord' },
            13: { name: 'Gruvbox', id: 'gruvbox' },
            14: { name: 'Crimson', id: 'crimson' },
            15: { name: 'Gold', id: 'gold' }
        };
        const input = args.trim().toLowerCase();

        if (input === 'reset') {
            applyTheme('default');
            deleteCookie('theme');
            return `<p>Theme reset to Orbit (Default).</p>`;
        }

        const num = parseInt(input);
        if (!isNaN(num) && num >= 1 && num <= Object.keys(themeMap).length) {
            const selectedTheme = themeMap[num];
            applyTheme(selectedTheme.id);
            setCookie('theme', selectedTheme.id, 365);
            return `<p>Theme changed to ${selectedTheme.name}.</p>`;
        }

        let output = '<p>Available themes:</p>';
        for (const [key, value] of Object.entries(themeMap)) {
            output += `<p style="display: flex; gap: 1ch;"><span>${key}.</span><span>${value.name}${key == 1 ? ' (Default)' : ''}</span></p>`;
        }
        output += `<p><br/>Usage: themes [number] or themes reset</p>`;
        return output;
    },
    logs: () => {
        const logLevels = [ { level: 'INFO', color: 'var(--on-surface)' }, { level: 'WARN', color: 'var(--accent-secondary)' }, { level: 'ERROR', color: 'var(--error)' } ];
        const logTemplates = {
            INFO: [ "System boot initiated.", "Kernel v6.1.5-orbit loaded successfully.", "Service '{service}' started.", "User '{user}' authenticated successfully.", "Filesystem check on /dev/sda1 completed without errors.", "UI compositor 'window-manager' loaded.", "System time synchronized with ntp.orbit.os.", "Bluetooth adapter found: BCM20702A0." ],
            WARN: [ "High CPU temperature detected: {temp}°C.", "Low disk space on /var/log. {usage}% used.", "Connection to update server 'pkg.orbit.os' is unstable.", "Network interface eth0: DHCP lease renewal failed, will retry.", "Process '{process}' is using excessive memory.", "Deprecated configuration file found at /etc/sys.conf.old." ],
            ERROR: [ "Failed to mount /dev/sdb1: No such device.", "Authentication failed for user '{user}'.", "Service '{service}' crashed with signal 11 (SIGSEGV).", "Failed to start {service}. See 'journalctl -u {service}'.", "Unhandled exception in 'terminal.js': TypeError: cannot read property 'length' of undefined." ]
        };
        const placeholders = {
            service: ['network-manager', 'audio-daemon', 'cron', 'udevd', 'bluetoothd'],
            user: [config.username, 'root', 'guest'],
            process: ['media-scanner', 'backup-client', 'updater'],
            temp: () => Math.floor(Math.random() * 15) + 75,
            usage: () => Math.floor(Math.random() * 10) + 90
        };
        const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
        let output = '<p class="highlight">System Logs:</p>';
        const now = new Date();
        for (let i = 0; i < 12; i++) {
            const randomLevelInfo = getRandom(logLevels);
            const level = randomLevelInfo.level;
            let logMessage = getRandom(logTemplates[level]);
            logMessage = logMessage.replace(/{(\w+)}/g, (match, placeholder) => {
                if (placeholders[placeholder]) {
                    const replacer = placeholders[placeholder];
                    return typeof replacer === 'function' ? replacer() : getRandom(replacer);
                }
                return match;
            });
            const pid = Math.floor(Math.random() * 8000) + 1000;
            const logTime = new Date(now.getTime() - Math.random() * 60000 * 10);
            const timeString = logTime.toLocaleTimeString([], { hour12: false });
            output += `<p><span style="color: var(--accent-primary);">${timeString}</span> [<span style="color: ${randomLevelInfo.color}; font-weight: 500;">${level.padEnd(5)}</span>] [PID:${pid}] ${logMessage}</p>`;
        }
        return output;
    },
    fastfetch: () => {
        if (document.getElementById('fastfetch-container')) { document.getElementById('fastfetch-container').remove(); }
        const ffContainer = document.createElement('div');
        ffContainer.id = 'fastfetch-container';
        ffContainer.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            width: 650px; max-width: 90vw;
            background: var(--surface);
            backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
            border: 1px solid var(--outline); border-radius: 12px;
            box-shadow: 0 10px 50px var(--glow);
            z-index: 1000; color: var(--on-surface); font-family: 'Inter', sans-serif;
            display: flex; flex-direction: column; animation: fadeIn 0.3s ease;
            transition: transform 0.3s ease, box-shadow 0.3s ease;`;
        const lastUpdate = lastUpdatedDate.toLocaleDateString();
        ffContainer.innerHTML = `
            <div id="fastfetch-header" style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid var(--outline);">
                <span style="font-weight: 500; color: var(--on-surface);">System Information</span>
                <button id="close-fastfetch" style="background: #ff5f56; border: none; width: 16px; height: 16px; border-radius: 50%; cursor: pointer; transition: transform 0.2s ease, filter 0.2s ease;" onmouseover="this.style.transform='scale(1.15)'; this.style.filter='brightness(1.2)';" onmouseout="this.style.transform='scale(1)'; this.style.filter='brightness(1)';"></button>
            </div>
            <div style="display: flex; padding: 20px; gap: 20px;">
                <pre style="color: var(--accent-primary); font-family: 'JetBrains Mono', monospace; font-size: 0.9rem; margin-top: -10px;">
      .o.
     .o o.
    .o   o.
   .o     o.
  .o       o.
 .o         o.
.o           o.
 o...     ...o
  o.....o...
    o.....o
      o.o
       o
                </pre>
                <div style="font-size: 0.9rem; line-height: 1.8; flex-grow: 1;">
                    <p><span class="highlight-secondary">${config.username}@${config.hostname}</span></p>
                    <p>---------------------------------</p>
                    <p><span style="width: 120px; display: inline-block;">OS</span>: <span class="highlight">${config.systemInfo.os} ${config.systemInfo.version}</span></p>
                    <p><span style="width: 120px; display: inline-block;">Build Number</span>: ${config.systemInfo.build}</p>
                    <p><span style="width: 120px; display: inline-block;">Kernel</span>: ${config.systemInfo.kernel}</p>
                    <p><span style="width: 120px; display: inline-block;">Last Update</span>: ${lastUpdate}</p>
                    <p><span style="width: 120px; display: inline-block;">Uptime</span>: ${getUptime()}</p>
                    <p><span style="width: 120px; display: inline-block;">CPU</span>: OrbitCore i9-13900K</p>
                    <p><span style="width: 120px; display: inline-block;">GPU</span>: Nebula RTX 4090</p>
                </div>
            </div>`;
        document.body.appendChild(ffContainer);
        document.getElementById('close-fastfetch').onclick = () => ffContainer.remove();
        dragElement(ffContainer, 'fastfetch-header');
        return '<p>Displaying system information...</p>';
    },
    wiki: async (args) => {
        const query = args.trim();
        if (!query) return '<p>Usage: wiki [search query]</p>';
        const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
        try {
            const response = await fetch(url);
            if (!response.ok) { return `<p class="error-message">Could not find a Wikipedia article for "${query}".</p>`; }
            const data = await response.json();
            const summary = data.extract_html || data.extract;
            const pageUrl = data.content_urls.desktop.page;
            return `<div><h3 class="highlight" style="margin-bottom: 0.5rem;">${data.title}</h3><p>${summary}</p><a href="${pageUrl}" target="_blank" rel="noopener noreferrer" style="color: var(--accent-secondary);">Read full article...</a></div>`;
        } catch (error) { console.error("Wikipedia API error:", error); return '<p class="error-message">Failed to fetch data from Wikipedia. Check your connection.</p>'; }
    },
    video: () => {
        if (document.getElementById('video-player-container')) return '<p class="error-message">Video player is already running.</p>';
        const playerContainer = document.createElement('div'); playerContainer.id = 'video-player-container';
        playerContainer.style.cssText = `position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 600px; max-width: 90vw; background: var(--surface); backdrop-filter: blur(20px); border: 1px solid var(--outline); border-radius: 12px; box-shadow: 0 10px 50px var(--glow); z-index: 1000; color: #e0e0e0; font-family: 'Inter', sans-serif; display: flex; flex-direction: column; animation: fadeIn 0.3s ease;`;
        playerContainer.innerHTML = `<div id="video-player-header" style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid var(--outline);"><span id="video-title" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 450px; font-size: 0.9em; font-weight: 500; color: var(--on-surface);">No video loaded</span><div style="display: flex; align-items: center; gap: 0.75rem;"><button id="hide-video-player" style="background: #ffbd2e; border: none; width: 16px; height: 16px; border-radius: 50%; cursor: pointer; display:flex; justify-content:center; align-items:center; color: #995700; font-weight: bold; line-height:16px; transition: transform 0.2s ease, filter 0.2s ease;" onmouseover="this.style.transform='scale(1.15)'; this.style.filter='brightness(1.2)';" onmouseout="this.style.transform='scale(1)'; this.style.filter='brightness(1)';">–</button><button id="close-video-player" style="background: #ff5f56; border: none; width: 16px; height: 16px; border-radius: 50%; cursor: pointer; transition: transform 0.2s ease, filter 0.2s ease;" onmouseover="this.style.transform='scale(1.15)'; this.style.filter='brightness(1.2)';" onmouseout="this.style.transform='scale(1)'; this.style.filter='brightness(1)';"></button></div></div><div id="video-player-body"><div style="width: 100%; background-color: black; border-radius: 0 0 11px 11px; overflow: hidden;"><video id="video-element" style="width: 100%; display: block;"></video></div><div style="padding: 12px 16px;"><input type="range" id="video-seek-bar" value="0" style="width: 100%; margin: 8px 0; accent-color: var(--accent-primary);"><div id="video-controls" style="display: flex; justify-content: center; align-items:center; gap: 15px;"><button id="video-play-pause-btn" style="background: transparent; border: none; color: white; cursor: pointer; opacity: 0.8; transition: opacity 0.2s ease, transform 0.2s ease;"><svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></button></div></div></div>`;
        document.body.appendChild(playerContainer);
        const fileInput = document.createElement('input'); fileInput.type = 'file'; fileInput.accept = '.mp4'; fileInput.style.display = 'none'; document.body.appendChild(fileInput); fileInput.click();
        const video = document.getElementById('video-element'), playBtn = document.getElementById('video-play-pause-btn'), seek = document.getElementById('video-seek-bar'), title = document.getElementById('video-title'), close = document.getElementById('close-video-player'), hideBtn = document.getElementById('hide-video-player'), playerBody = document.getElementById('video-player-body');
        const playIcon = '<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>', pauseIcon = '<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
        playBtn.onmouseover = () => { playBtn.style.opacity = '1'; playBtn.style.transform = 'scale(1.1)'; }; playBtn.onmouseout = () => { playBtn.style.opacity = '0.8'; playBtn.style.transform = 'scale(1)'; };
        const stop = () => { video.pause(); if (video.src) URL.revokeObjectURL(video.src); playerContainer.remove(); fileInput.remove(); };
        fileInput.onchange = (e) => { const f = e.target.files[0]; if (f) { video.src = URL.createObjectURL(f); title.textContent = f.name; video.play(); playBtn.innerHTML = pauseIcon; } else { stop(); } };
        playBtn.onclick = () => { if (!video.src) return; if (video.paused) { video.play(); playBtn.innerHTML = pauseIcon; } else { video.pause(); playBtn.innerHTML = playIcon; } };
        hideBtn.onclick = () => { playerContainer.classList.toggle('player-minimized'); const isHidden = playerContainer.classList.contains('player-minimized'); playerBody.style.display = isHidden ? 'none' : 'block'; hideBtn.innerHTML = isHidden ? '+' : '–'; };
        close.onclick = stop; video.ontimeupdate = () => { if (video.duration) seek.value = (video.currentTime / video.duration) * 100; }; seek.oninput = () => { if (video.duration) video.currentTime = (seek.value / 100) * video.duration; }; video.onended = () => { playBtn.innerHTML = playIcon; seek.value = 0; video.currentTime = 0; }
        dragElement(playerContainer, 'video-player-header'); return '<p>Opening video player...</p>';
    },
    music: () => {
        if (document.getElementById('music-player-container')) return '<p class="error-message">Music player is already running.</p>';
        const playerContainer = document.createElement('div'); playerContainer.id = 'music-player-container';
        playerContainer.style.cssText = `position: fixed; top: 60%; left: 50%; transform: translate(-50%, -50%); width: 350px; background: var(--surface); backdrop-filter: blur(20px); border: 1px solid var(--outline); border-radius: 12px; box-shadow: 0 10px 50px var(--glow); z-index: 1000; color: #e0e0e0; font-family: 'Inter', sans-serif; display: flex; flex-direction: column; animation: fadeIn 0.3s ease;`;
        playerContainer.innerHTML = `<div id="music-player-header" style="display: flex; justify-content: space-between; align-items: center; padding: 15px;"><span style="font-weight: 500; color: var(--on-surface);">Music Player</span><div style="display:flex; align-items:center; gap: 0.75rem;"><button id="hide-music-player" style="background: #ffbd2e; border: none; width: 16px; height: 16px; border-radius: 50%; cursor: pointer; display:flex; justify-content:center; align-items:center; color: #995700; font-weight: bold; line-height:16px; transition: transform 0.2s ease, filter 0.2s ease;" onmouseover="this.style.transform='scale(1.15)'; this.style.filter='brightness(1.2)';" onmouseout="this.style.transform='scale(1)'; this.style.filter='brightness(1)';">–</button><button id="close-music-player" style="background: #ff5f56; border: none; width: 16px; height: 16px; border-radius: 50%; cursor: pointer; transition: transform 0.2s ease, filter 0.2s ease;" onmouseover="this.style.transform='scale(1.15)'; this.style.filter='brightness(1.2)';" onmouseout="this.style.transform='scale(1)'; this.style.filter='brightness(1)';"></button></div></div><div id="music-player-body" style="padding: 0 15px 15px;"><div style="text-align: center; padding-top: 5px;"><span id="song-title" style="display: block; margin-bottom: 10px; font-size: 1.1rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">No song loaded</span><audio id="audio-player"></audio><input type="range" id="seek-bar" value="0" style="width: 100%; margin-bottom: 15px; accent-color: var(--accent-secondary);"></div><div id="music-controls" style="display: flex; justify-content: center; align-items: center; gap: 20px;"><button id="play-pause-btn" style="background: var(--accent-secondary); color: var(--background); border: none; width: 50px; height: 50px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: transform 0.2s ease;"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></button></div></div>`;
        document.body.appendChild(playerContainer);
        const fileInput = document.createElement('input'); fileInput.type = 'file'; fileInput.accept = '.mp3'; fileInput.style.display = 'none'; document.body.appendChild(fileInput); fileInput.click();
        const audio = document.getElementById('audio-player'), playBtn = document.getElementById('play-pause-btn'), seek = document.getElementById('seek-bar'), title = document.getElementById('song-title'), close = document.getElementById('close-music-player'), hideBtn = document.getElementById('hide-music-player'), playerBody = document.getElementById('music-player-body');
        playBtn.onmouseover = () => playBtn.style.transform = 'scale(1.1)'; playBtn.onmouseout = () => playBtn.style.transform = 'scale(1)';
        const playIcon = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>', pauseIcon = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
        const stop = () => { audio.pause(); if (audio.src) URL.revokeObjectURL(audio.src); playerContainer.remove(); fileInput.remove(); };
        fileInput.onchange = (e) => { const f = e.target.files[0]; if (f) { audio.src = URL.createObjectURL(f); title.textContent = f.name; audio.play(); playBtn.innerHTML = pauseIcon; } else { stop(); } };
        playBtn.onclick = () => { if (!audio.src) return; if (audio.paused) { audio.play(); playBtn.innerHTML = pauseIcon; } else { audio.pause(); playBtn.innerHTML = playIcon; } };
        hideBtn.onclick = () => { playerContainer.classList.toggle('player-minimized'); const isHidden = playerContainer.classList.contains('player-minimized'); playerBody.style.display = isHidden ? 'none' : 'block'; hideBtn.innerHTML = isHidden ? '+' : '–'; };
        close.onclick = stop; audio.ontimeupdate = () => { if (audio.duration) seek.value = (audio.currentTime / audio.duration) * 100; }; seek.oninput = () => { if (audio.duration) audio.currentTime = (seek.value / 100) * audio.duration; }; audio.onended = () => { playBtn.innerHTML = playIcon; seek.value = 0; audio.currentTime = 0; };
        dragElement(playerContainer, 'music-player-header'); return '<p>Opening music player...</p>';
    },
    software: () => {
        if (document.getElementById('software-container')) { document.getElementById('software-container').remove(); }
        const swContainer = document.createElement('div');
        swContainer.id = 'software-container';
        swContainer.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            width: 700px; max-width: 90vw; height: 500px;
            background: var(--surface);
            backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
            border: 1px solid var(--outline); border-radius: 12px;
            box-shadow: 0 10px 50px var(--glow);
            z-index: 1000; color: var(--on-surface); font-family: 'Inter', sans-serif;
            display: flex; flex-direction: column; animation: fadeIn 0.3s ease;
            transition: transform 0.3s ease, box-shadow 0.3s ease;`;

        swContainer.innerHTML = `
            <div id="software-header" style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid var(--outline); cursor: grab;">
                <span style="font-weight: 500; color: var(--on-surface);">Software Update</span>
                <button id="close-software" style="background: #ff5f56; border: none; width: 16px; height: 16px; border-radius: 50%; cursor: pointer; transition: transform 0.2s ease, filter 0.2s ease;" onmouseover="this.style.transform='scale(1.15)'; this.style.filter='brightness(1.2)';" onmouseout="this.style.transform='scale(1)'; this.style.filter='brightness(1)';"></button>
            </div>
            <div id="software-body" style="padding: 20px; font-size: 0.9rem; line-height: 1.8; flex-grow: 1; overflow-y: auto;">
                <p>Checking for updates...</p>
            </div>`;
        document.body.appendChild(swContainer);
        document.getElementById('close-software').onclick = () => swContainer.remove();
        dragElement(swContainer, 'software-header');

        setTimeout(() => {
            const body = document.getElementById('software-body');
            if(body) {
                body.innerHTML = `
                    <p style="color: var(--success); font-weight: 500;">✓ You are using the latest version of OrbitOS.</p>
                    <br>
                    <p class="highlight">System Information</p>
                    <p style="color: var(--accent-secondary);"><span style="width: 150px; display: inline-block;">OS Version</span>: ${config.systemInfo.version}</p>
                    <p style="color: var(--accent-secondary);"><span style="width: 150px; display: inline-block;">Build Number</span>: ${config.systemInfo.build}</p>
                    <p style="color: var(--accent-secondary);"><span style="width: 150px; display: inline-block;">Kernel</span>: ${config.systemInfo.kernel}</p>
                    <p style="color: var(--accent-secondary);"><span style="width: 150px; display: inline-block;">Last Checked</span>: ${new Date().toLocaleString()}</p>
                    <br>
                    <p class="highlight">Changelog (v4.0)</p>
                    <p style="color: var(--accent-secondary);"><span class="highlight-secondary">[+]</span> Added 'translate' command for live translation.</p>
                    <p style="color: var(--accent-secondary);"><span class="highlight-secondary">[+]</span> Added 'cowsay' and 'fortune' for fun.</p>
                    <p style="color: var(--accent-secondary);"><span class="highlight-secondary">[+]</span> Added 5 new font colors.</p>
                    <p style="color: var(--accent-secondary);"><span class="highlight-secondary">[*]</span> other bug fixes</p>
                    <p style="color: var(--accent-secondary);"><span class="highlight-secondary">[*]</span> Fixed a bug causing keyboard to open automatically on mobile.</p>
                    <p style="color: var(--accent-secondary);"><span class="highlight-secondary">[*]</span> General performance and stability improvements.</p>
                `;
            }
        }, 1500);

        return '<p>Opening software information...</p>';
    },
    browser: (args) => { const u = args.trim(); if (!u) return `<p>Usage: browser [url]</p>`; if (!u.startsWith('http')) return `<p class="error-message">Invalid URL. Please include http:// or https://</p>`; return `<p class="error-message">⚠️ Note: Not all websites support being loaded in a frame.</p><p>Loading ${u}...</p><div style="width:100%; height:600px; border: 1px solid var(--outline); margin-top: 10px; background-color: white; border-radius: 8px; overflow: hidden;"><iframe src="${u}" style="width:100%; height:100%; border:none;" sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"></iframe></div>`; },
    rm: (args) => {
        if (args.trim() !== '-rf') return `<p>rm: missing operand</p>`;
        inputField.disabled = true;
        prompt.style.display = 'none';
        const i = setInterval(() => {
            const p = document.createElement('p');
            p.className = 'error-message';
            p.style.margin = '0';
            p.style.lineHeight = '1.2';
            p.textContent = `rm: /sys/lib/${Math.random().toString(36).substring(2)}: Permission denied`;
            output.appendChild(p);
            scrollToBottom();
        }, 75);
        setTimeout(() => { clearInterval(i); triggerBSOD('CRITICAL_PROCESS_DIED'); }, 4000);
        return '';
    },
    fonts: (args) => { const n=parseInt(args.trim()),f={1:"JetBrains Mono",2:"Fira Code",3:"Source Code Pro",4:"IBM Plex Mono",5:"Anonymous Pro",6:"Roboto Mono",7:"Space Mono",8:"Ubuntu Mono",9:"VT323",10:"Nanum Gothic Coding",11:"Cutive Mono",12:"Share Tech Mono",13:"Major Mono Display",14:"Nova Mono",15:"Syne Mono"};if(!args||isNaN(n)){let l='<p>Available fonts:</p>';for(const[i,m]of Object.entries(f)){l+=`<p>${i}. ${m}${i==1?' (Default)':''}</p>`}l+='<p>Usage: fonts [number]</p>';return l}if(applyFont(n)){setCookie('font',n,365);return`<p>Font set to ${f[n]}.</p>`}else{return'<p class="error-message">Invalid font number.</p>'}},
    clear: () => { output.innerHTML = ''; return ''; },
    echo: (args) => args ? `<p>${args.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>` : '<p>Nothing to echo.</p>',
    stop: (args) => { const p=args.trim().toLowerCase(); if(!p)return'<p>Usage: stop [process]</p>';if(p==='music'){const m=document.getElementById('music-player-container');if(m){m.remove();return'<p>Music player stopped.</p>'}else{return'<p class="error-message">Not running.</p>'}}if(p==='video'){const v=document.getElementById('video-player-container');if(v){v.remove();return'<p>Video player stopped.</p>'}else{return'<p class="error-message">Not running.</p>'}}if(p==='fastfetch'){const f=document.getElementById('fastfetch-container');if(f){f.remove();return'<p>System info closed.</p>'}else{return'<p class="error-message">Not running.</p>'}}if(p==='software'){const s=document.getElementById('software-container');if(s){s.remove();return'<p>Software info closed.</p>'}else{return'<p class="error-message">Not running.</p>'}}return`<p class="error-message">Process '${p}' not found.</p>`; },
    date: () => `<p>${new Date().toLocaleString()}</p>`,
    whoami: () => `<p class="highlight-secondary">${config.username}@${config.hostname}</p>`,
    history: () => commandHistory.map((c, i) => `<p>${i + 1}. ${c}</p>`).join('') || '<p>No history.</p>',
    battery: () => { if(!config.batteryInfo.level)return`<p class="error-message">Battery API unavailable.</p>`;return`<p>Battery: ${config.batteryInfo.level}% (${config.batteryInfo.charging?'Charging':'Discharging'})</p>`;},
    processes: () => { let r=`<p class="highlight">Processes:</p><p>system_core</p><p>terminal</p>`;if(document.getElementById('music-player-container'))r+=`<p>music_player</p>`;if(document.getElementById('video-player-container'))r+=`<p>video_player</p>`;if(document.getElementById('fastfetch-container'))r+=`<p>sys_info</p>`;if(document.getElementById('software-container'))r+=`<p>sw_update</p>`;return r;},
    shutdown: () => { isSystemBricked=true;inputField.disabled=true;prompt.style.display='none';setTimeout(()=>{document.body.innerHTML='<p style="font-family:var(--font-mono);text-align:center;padding:2rem;">System halted.</p>'},1000);return'<p>Shutting down...</p>';},
    reboot: () => { output.innerHTML='<p>Rebooting...</p>';inputField.disabled=true;prompt.style.display='none';setTimeout(()=>window.location.reload(),1500);return'';},
    restart: () => commands.reboot(),
    calc: (args) => { try{if(!args)return"<p>Usage: calc [expression]</p>";const s=args.replace(/[^-()\d/*+.]/g,'');if(!s)return`<p class="error-message">Invalid characters.</p>`;return`<p>Result: ${new Function(`return ${s}`)()}</p>`}catch(e){return`<p class="error-message">Invalid expression.</p>`}},
    hide: (args) => { const target = args.trim().toLowerCase(); if (!target) return '<p>Usage: hide [music|video]</p>'; let hideBtn, name; if (target === 'music') { hideBtn = document.getElementById('hide-music-player'); name = 'Music player'; } else if (target === 'video') { hideBtn = document.getElementById('hide-video-player'); name = 'Video player'; } else { return `<p class="error-message">Cannot hide '${target}'. Valid options are 'music' or 'video'.</p>`; } if (hideBtn) { hideBtn.click(); const isHidden = hideBtn.innerHTML === '+'; return `<p>${isHidden ? 'Hiding' : 'Showing'} ${name}.</p>`; } else { return `<p class="error-message">${name} is not running.</p>`; } },
    tts: (args) => { if(!args.trim())return'<p>Usage: tts [text]</p>';if('speechSynthesis' in window){speechSynthesis.speak(new SpeechSynthesisUtterance(args));return'<p>Speaking...</p>'}else{return'<p class="error-message">TTS not supported.</p>'}},
    reset: (args) => {
        if (args.trim() === 'confirm') {
            deleteCookie('username');
            deleteCookie('hostname');
            deleteCookie('font');
            deleteCookie('lastLogin');
            deleteCookie('fontColor');
            deleteCookie('theme');
            localStorage.removeItem('orbitos_notes');
            localStorage.removeItem('orbitos_welcome_message');
            applyFontColor(null);
            applyTheme('default');
            output.innerHTML = '<p>Data reset. Rebooting...</p>';
            setTimeout(() => window.location.reload(), 1500);
            return ''
        }
        return `<p class="error-message">WARNING: This will erase all saved settings and notes. Type <span class="highlight">reset confirm</span> to proceed.</p>`;
    },
    setname: (args) => {
        const n = args.trim();
        if (!n) return '<p>Usage: setname [username]</p>';
        if (n.length > 15) return '<p class="error-message">Username too long (max 15 chars).</p>';
        config.username = n;
        setCookie('username', n, 365);
        prompt.textContent = `${config.username}@${config.hostname}:~$ `;
        return `<p>Username changed to <span class="highlight">${n}</span>.</p>`;
    },
    sethost: (args) => {
        const h = args.trim();
        if (!h) return '<p>Usage: sethost [hostname]</p>';
        if (h.length > 15) return '<p class="error-message">Hostname too long (max 15 chars).</p>';
        config.hostname = h;
        setCookie('hostname', h, 365);
        prompt.textContent = `${config.username}@${config.hostname}:~$ `;
        return `<p>Hostname changed to <span class="highlight">${h}</span>.</p>`;
    },
    bios: () => {
        document.querySelector('.terminal').style.display = 'none';
        document.getElementById('status-bar').style.display = 'none';
        const biosScreen = document.getElementById('bios-screen');
        const biosContainer = biosScreen.querySelector('.bios-container');

        biosContainer.innerHTML = `
            <h1>ORBIT BIOS UTILITY</h1>
            <div class="bios-menu">
                <button class="bios-button" id="bios-restart">Restart System</button>
                <button class="bios-button danger" id="bios-reset">Reset All User Data</button>
                <button class="bios-button" id="bios-exit">Exit BIOS</button>
            </div>`;

        biosScreen.style.display = 'flex';

        document.getElementById('bios-restart').onclick = () => {
            biosContainer.innerHTML = '<h1>REBOOTING SYSTEM</h1><p>Please wait...</p>';
            setTimeout(() => window.location.reload(), 1500);
        };

        document.getElementById('bios-reset').onclick = () => {
            biosContainer.innerHTML = `
                <h1>CONFIRM DATA WIPE</h1>
                <p class="error-message" style="margin-bottom: 2rem; max-width: 400px; margin-left:auto; margin-right:auto; line-height: 1.6;">This action is irreversible and will delete all user settings and notes. Are you sure you want to proceed?</p>
                <div class="bios-menu">
                    <button class="bios-button danger" id="bios-confirm-reset">Yes, Wipe Data</button>
                    <button class="bios-button" id="bios-cancel-reset">No, Go Back</button>
                </div>
            `;
            document.getElementById('bios-confirm-reset').onclick = () => {
                biosContainer.innerHTML = '<h1>RESETTING DATA</h1><p>All user data is being erased. The system will reboot shortly...</p>';
                commands.reset('confirm');
            };
            document.getElementById('bios-cancel-reset').onclick = () => {
                commands.bios();
            };
        };

        document.getElementById('bios-exit').onclick = () => {
            biosScreen.style.display = 'none';
            document.querySelector('.terminal').style.display = 'flex';
            document.getElementById('status-bar').style.display = 'flex';
            inputField.disabled = false;
            inputField.focus();
        };

        inputField.disabled = true;
        return '';
    },
    notes: (args) => {
        const getNotes = () => JSON.parse(localStorage.getItem('orbitos_notes')) || [];
        const saveNotes = (notes) => localStorage.setItem('orbitos_notes', JSON.stringify(notes));
        const parts = args.trim().split(' ');
        const action = parts[0];
        const content = parts.slice(1).join(' ');

        switch (action) {
            case 'add':
                if (!content) return '<p>Usage: notes add [your note here]</p>';
                const notes = getNotes();
                notes.push(content);
                saveNotes(notes);
                return '<p>Note added.</p>';
            case 'view':
                const currentNotes = getNotes();
                if (currentNotes.length === 0) return '<p>You have no notes.</p>';
                let output = '<p class="highlight">Your Notes:</p>';
                currentNotes.forEach((note, index) => {
                    output += `<p><span class="highlight-secondary">[${index + 1}]</span> ${note.replace(/</g, "&lt;")}</p>`;
                });
                return output;
            case 'delete':
                const index = parseInt(content) - 1;
                let notesToDelete = getNotes();
                if (isNaN(index) || index < 0 || index >= notesToDelete.length) {
                    return '<p class="error-message">Invalid note number. Use "notes view" to see note numbers.</p>';
                }
                notesToDelete.splice(index, 1);
                saveNotes(notesToDelete);
                return `<p>Deleted note ${index + 1}.</p>`;
            case 'clear':
                saveNotes([]);
                return '<p>All notes have been cleared.</p>';
            default:
                return '<p>Usage: notes [add|view|delete|clear]</p>';
        }
    },
    fontcolor: (args) => {
        const colorMap = { 1: { name: 'Default', hex: '#c9d1d9' }, 2: { name: 'Mint', hex: '#80ffdb' }, 3: { name: 'Sky', hex: '#72ddf7' }, 4: { name: 'Sand', hex: '#f2e9c9' }, 5: { name: 'Lavender', hex: '#d7bce3' }, 6: { name: 'Amber', hex: '#FFC107' }, 7: { name: 'Crimson', hex: '#DC143C' }, 8: { name: 'Lime', hex: '#00FF00' }, 9: { name: 'Violet', hex: '#EE82EE' }, 10: { name: 'Teal', hex: '#008080' } };
        const num = parseInt(args.trim());
        if (args.trim().toLowerCase() === 'reset') { applyFontColor(null); deleteCookie('fontColor'); return `<p>Font color reset to Default.</p>`; }
        if (!isNaN(num) && num >= 1 && num <= Object.keys(colorMap).length) { const color = colorMap[num].hex; applyFontColor(color); setCookie('fontColor', color, 365); return `<p>Font color changed to ${colorMap[num].name}.</p>`; }
        let output = '<p>Available font colors:</p>';
        for (const [key, value] of Object.entries(colorMap)) { output += `<p>${key}. <span style="color:${value.hex};">${value.name}</span></p>`; }
        output += `<p><br/>Usage: fontcolor [number] or fontcolor reset</p>`;
        return output;
    },
    welcomemsg: (args) => {
        const [subcommand, ...msgParts] = args.trim().split(' ');
        const message = msgParts.join(' ');
        if (subcommand === 'set') {
            if (!message) return '<p class="error-message">Usage: welcomemsg set [your message]</p>';
            localStorage.setItem('orbitos_welcome_message', message);
            return '<p>Custom welcome message saved.</p>';
        } else if (subcommand === 'reset') {
            localStorage.removeItem('orbitos_welcome_message');
            return '<p>Welcome message reset to default.</p>';
        } else {
            return '<p>Usage: welcomemsg [set|reset]</p>';
        }
    },
    passgen: (args) => {
        const length = parseInt(args.trim()) || 12;
        if (length < 4 || length > 128) return '<p class="error-message">Length must be between 4 and 128.</p>';
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';
        let password = '';
        for (let i = 0; i < length; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return `<p>Generated Password:</p><p class="highlight">${password}</p>`;
    },
    guess: (args) => {
        const input = args.trim();

        if (input === 'reset' || input === 'quit') {
            if (guessTheNumberGame.isActive) {
                guessTheNumberGame.isActive = false;
                return '<p>Game stopped. Type "guess" to start a new one.</p>';
            }
            return '<p>No active game to stop.</p>';
        }

        if (!guessTheNumberGame.isActive) {
            guessTheNumberGame.isActive = true;
            guessTheNumberGame.secretNumber = Math.floor(Math.random() * 100) + 1;
            guessTheNumberGame.attempts = 0;
            return "<p>I'm thinking of a number between 1 and 100. Try to guess it!</p><p>Usage: guess [your number]</p>";
        }

        const playerGuess = parseInt(input);
        if (isNaN(playerGuess)) {
            return '<p class="error-message">That\'s not a valid number. Try again.</p>';
        }

        guessTheNumberGame.attempts++;

        if (playerGuess < guessTheNumberGame.secretNumber) {
            return '<p>Too low! Guess again.</p>';
        } else if (playerGuess > guessTheNumberGame.secretNumber) {
            return '<p>Too high! Guess again.</p>';
        } else {
            const message = `<p class="highlight">Congratulations! You guessed the number ${guessTheNumberGame.secretNumber} in ${guessTheNumberGame.attempts} attempts.</p>`;
            guessTheNumberGame.isActive = false;
            return message;
        }
    },
    translate: async (args) => {
        const parts = args.split(' ');
        if (parts.length < 2) return '<p>Usage: translate [from:to] [text]</p><p>Example: translate en:es Hello world</p>';
        const langPair = parts[0];
        const text = parts.slice(1).join(' ');
        const [from, to] = langPair.split(':');
        if (!to) return `<p class="error-message">Invalid language pair format. Use from:to (e.g., en:fr).</p>`;
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.responseStatus !== 200) {
                return `<p class="error-message">Translation failed: ${data.responseDetails}</p>`;
            }
            return `<p>"<span class="highlight">${data.responseData.translatedText}</span>"</p>`;
        } catch (error) {
            return '<p class="error-message">Failed to connect to translation service.</p>';
        }
    },
    cowsay: (args) => {
        const message = args.trim() || "Moo!";
        const lines = message.split('\n');
        const maxLength = Math.max(...lines.map(line => line.length));
        
        const pad = (str, len) => str + ' '.repeat(len - str.length);

        let bubble = ' ' + '_'.repeat(maxLength + 2) + '\n';
        if (lines.length === 1) {
            bubble += `< ${message} >\n`;
        } else {
            bubble += `/ ${pad(lines[0], maxLength)} \\\n`;
            for (let i = 1; i < lines.length - 1; i++) {
                bubble += `| ${pad(lines[i], maxLength)} |\n`;
            }
            bubble += `\\ ${pad(lines[lines.length - 1], maxLength)} /\n`;
        }
        bubble += ' ' + '-'.repeat(maxLength + 2);

        const cow = `
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`;
        
        const escapeHTML = (str) => str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');

        return `<pre style="line-height: 1.2; user-select: text;">${escapeHTML(bubble)}${escapeHTML(cow)}</pre>`;
    },
    fortune: () => {
        const fortunes = [
            "The early bird gets the worm, but the second mouse gets the cheese.",
            "A conclusion is the place where you got tired of thinking.",
            "He who laughs last thinks slowest.",
            "The journey of a thousand miles begins with a single step... and a broken fan belt.",
            "You will be hungry again in one hour.",
            "A day without sunshine is like, you know, night.",
            "If at first you don't succeed, skydiving is not for you.",
            "Never trust a computer you can't throw out a window.",
            "An expert is someone who knows more and more about less and less, until they know absolutely everything about nothing."
        ];
        const randomIndex = Math.floor(Math.random() * fortunes.length);
        return `<p>${fortunes[randomIndex]}</p>`;
    }
};

