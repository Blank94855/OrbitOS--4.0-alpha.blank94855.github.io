function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
}

function deleteCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999; path=/; SameSite=Lax';
}

function dragElement(elmnt, headerId) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const header = document.getElementById(headerId) || elmnt;

    if (header) { header.onmousedown = dragMouseDown; header.style.cursor = 'grab'; }

    function dragMouseDown(e) {
        e = e || window.event; e.preventDefault();
        pos3 = e.clientX; pos4 = e.clientY;
        document.onmouseup = closeDragElement; document.onmousemove = elementDrag;
        if (header) header.style.cursor = 'grabbing';
        elmnt.style.transition = 'none';
    }

    function elementDrag(e) {
        e = e || window.event; e.preventDefault();
        pos1 = pos3 - e.clientX; pos2 = pos4 - e.clientY;
        pos3 = e.clientX; pos4 = e.clientY;
        elmnt.style.top = `${elmnt.offsetTop - pos2}px`;
        elmnt.style.left = `${elmnt.offsetLeft - pos1}px`;
    }

    function closeDragElement() {
        document.onmouseup = null; document.onmousemove = null;
        if (header) header.style.cursor = 'grab';
        elmnt.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
    }
}

const weatherData = [
    { city: "Bucharest, RO", temp: "19°C", desc: "Clear Skies" }, { city: "London, UK", temp: "15°C", desc: "Cloudy" },
    { city: "New York, US", temp: "22°C", desc: "Sunny" }, { city: "Tokyo, JP", temp: "28°C", desc: "Humid" },
    { city: "Paris, FR", temp: "20°C", desc: "Light Rain" }, { city: "Sydney, AU", temp: "18°C", desc: "Windy" },
    { city: "Moscow, RU", temp: "12°C", desc: "Overcast" }, { city: "Cairo, EG", temp: "35°C", desc: "Hot and Sunny" },
    { city: "Rio de Janeiro, BR", temp: "25°C", desc: "Partly Cloudy" }, { city: "Beijing, CN", temp: "26°C", desc: "Hazy" },
    { city: "New Delhi, IN", temp: "33°C", desc: "Scorching" }, { city: "Berlin, DE", temp: "17°C", desc: "Showers" },
    { city: "Rome, IT", temp: "24°C", desc: "Pleasant" }, { city: "Madrid, ES", temp: "27°C", desc: "Dry Heat" },
    { city: "Toronto, CA", temp: "19°C", desc: "Cool Breeze" }
];

const lastUpdatedDate = new Date('2025-09-30');

const commands = {
    help: (args) => {
        const page = parseInt(args.trim()) || 1;
        let output = `<p><span class="highlight">Command List (Page ${page}/3)</span></p><br/>`;

        switch (page) {
            case 1:
                output += `
                    <p class="highlight">--- [ General ] ---</p>
                    <p><span class="highlight-secondary">help [page]</span>    - Shows this help message</p>
                    <p><span class="highlight-secondary">clear</span>          - Clears the terminal screen</p>
                    <p><span class="highlight-secondary">echo [text]</span>    - Prints the specified text</p>
                    <p><span class="highlight-secondary">date</span>           - Shows current date and time</p>
                    <p><span class="highlight-secondary">history</span>        - Shows command history</p>
                    <br/>
                    <p class="highlight">--- [ Customization ] ---</p>
                    <p><span class="highlight-secondary">whoami</span>         - Shows current user and host</p>
                    <p><span class="highlight-secondary">setname [name]</span> - Set a custom username</p>
                    <p><span class="highlight-secondary">sethost [name]</span> - Set a custom hostname</p>
                    <p><span class="highlight-secondary">fonts</span>          - Change the terminal font</p>
                    <br/>
                    <p>Type <span class="highlight">'help 2'</span> or <span class="highlight">'help 3'</span> to see other commands.</p>
                `;
                break;
            case 2:
                output += `
                    <p class="highlight">--- [ System ] ---</p>
                    <p><span class="highlight-secondary">fastfetch</span>      - Displays detailed system information</p>
                    <p><span class="highlight-secondary">software</span>       - View system software info and changelog</p>
                    <p><span class="highlight-secondary">battery</span>        - Shows battery status</p>
                    <p><span class="highlight-secondary">processes</span>      - Lists running processes</p>
                    <p><span class="highlight-secondary">stop [process]</span> - Stop a process or component</p>
                    <p><span class="highlight-secondary">reset</span>          - Reset all user data</p>
                    <p><span class="highlight-secondary">bios</span>           - Enter the BIOS utility</p>
                    <p><span class="highlight-secondary">shutdown</span>       - Shutsdown OrbitOS</p>
                    <p><span class="highlight-secondary">reboot</span>         - Reboots OrbitOS</p>
                    <p><span class="highlight-secondary">rm -rf</span>         - ...</p>
                    <br/>
                    <p>Type <span class="highlight">'help 3'</span> to see media and tool commands.</p>
                `;
                break;
            case 3:
                output += `
                    <p class="highlight">--- [ Tools & Media ] ---</p>
                    <p><span class="highlight-secondary">notes</span>          - Manage your notes (add, view, delete, clear)</p>
                    <p><span class="highlight-secondary">browser [url]</span>  - Opens a URL in a frame</p>
                    <p><span class="highlight-secondary">calc [expr]</span>    - Calculate mathematical expression</p>
                    <p><span class="highlight-secondary">wiki [query]</span>   - Search Wikipedia and display summary</p>
                    <p><span class="highlight-secondary">tts [text]</span>     - Text to speech</p>
                    <p><span class="highlight-secondary">translate [l] [t]</span> - Translate text</p>
                    <p><span class="highlight-secondary">weather</span>        - Shows weather information</p>
                    <p><span class="highlight-secondary">fortune</span>        - Get a random fortune message</p>
                    <p><span class="highlight-secondary">cowsay [text]</span>  - Display a cow saying your message</p>
                    <p><span class="highlight-secondary">hide [player]</span>  - Hides/shows the music or video player</p>
                    <p><span class="highlight-secondary">music</span>          - Opens the music player</p>
                    <p><span class="highlight-secondary">video</span>          - Opens the video player</p>
                    <br/>
                    <p>End of command list.</p>
                `;
                break;
            default:
                output = `<p class="error-message">Invalid page number. Please use 'help 1', 'help 2', or 'help 3'.</p>`;
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
            background: var(--surface); backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px);
            border: 1px solid var(--outline); border-radius: 12px;
            box-shadow: 0 10px 50px var(--glow);
            z-index: 1000; color: var(--on-surface); font-family: 'Inter', sans-serif;
            display: flex; flex-direction: column; animation: fadeIn 0.3s ease;
            transition: transform 0.3s ease, box-shadow 0.3s ease;`;
        const lastUpdate = lastUpdatedDate.toLocaleDateString();
        ffContainer.innerHTML = `
            <div id="fastfetch-header" style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid var(--outline);">
                <span style="font-weight: 500; color: var(--on-surface);">System Information</span>
                <button id="close-fastfetch" style="background: #ff5f56; border: none; width: 14px; height: 14px; border-radius: 50%; cursor: pointer;"></button>
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
        playerContainer.style.cssText = `position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 600px; max-width: 90vw; background: var(--surface); backdrop-filter: blur(15px); border: 1px solid var(--outline); border-radius: 12px; box-shadow: 0 10px 50px var(--glow); z-index: 1000; color: #e0e0e0; font-family: 'Inter', sans-serif; display: flex; flex-direction: column; animation: fadeIn 0.3s ease;`;
        playerContainer.innerHTML = `<div id="video-player-header" style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid var(--outline);"><span id="video-title" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 450px; font-size: 0.9em; font-weight: 500; color: var(--on-surface);">No video loaded</span><div style="display: flex; align-items: center; gap: 8px;"><button id="hide-video-player" style="background: #ffbd2e; border: none; width: 14px; height: 14px; border-radius: 50%; cursor: pointer; display:flex; justify-content:center; align-items:center; color: #995700; font-weight: bold; line-height:14px;">–</button><button id="close-video-player" style="background: #ff5f56; border: none; width: 14px; height: 14px; border-radius: 50%; cursor: pointer;"></button></div></div><div id="video-player-body"><div style="width: 100%; background-color: black; border-radius: 0 0 11px 11px; overflow: hidden;"><video id="video-element" style="width: 100%; display: block;"></video></div><div style="padding: 12px 16px;"><input type="range" id="video-seek-bar" value="0" style="width: 100%; margin: 8px 0; accent-color: var(--accent-primary);"><div id="video-controls" style="display: flex; justify-content: center; align-items:center; gap: 15px;"><button id="video-play-pause-btn" style="background: transparent; border: none; color: white; cursor: pointer; opacity: 0.8; transition: opacity 0.2s ease, transform 0.2s ease;"><svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></button></div></div></div>`;
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
        playerContainer.style.cssText = `position: fixed; top: 60%; left: 50%; transform: translate(-50%, -50%); width: 350px; background: var(--surface); backdrop-filter: blur(15px); border: 1px solid var(--outline); border-radius: 12px; box-shadow: 0 10px 50px var(--glow); z-index: 1000; color: #e0e0e0; font-family: 'Inter', sans-serif; display: flex; flex-direction: column; animation: fadeIn 0.3s ease;`;
        playerContainer.innerHTML = `<div id="music-player-header" style="display: flex; justify-content: space-between; align-items: center; padding: 15px;"><span style="font-weight: 500; color: var(--on-surface);">Music Player</span><div style="display:flex; align-items:center; gap: 8px;"><button id="hide-music-player" style="background: #ffbd2e; border: none; width: 14px; height: 14px; border-radius: 50%; cursor: pointer; display:flex; justify-content:center; align-items:center; color: #995700; font-weight: bold; line-height:14px;">–</button><button id="close-music-player" style="background: #ff5f56; border: none; width: 14px; height: 14px; border-radius: 50%; cursor: pointer;"></button></div></div><div id="music-player-body" style="padding: 0 15px 15px;"><div style="text-align: center; padding-top: 5px;"><span id="song-title" style="display: block; margin-bottom: 10px; font-size: 1.1rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">No song loaded</span><audio id="audio-player"></audio><input type="range" id="seek-bar" value="0" style="width: 100%; margin-bottom: 15px; accent-color: var(--accent-secondary);"></div><div id="music-controls" style="display: flex; justify-content: center; align-items: center; gap: 20px;"><button id="play-pause-btn" style="background: var(--accent-secondary); color: var(--background); border: none; width: 50px; height: 50px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: transform 0.2s ease;"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></button></div></div>`;
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
    software: () => `<div style="line-height: 1.8;"><p><strong><span class="highlight">What's new in OrbitOS ${config.systemInfo.version}</span></strong></p><p>Last updated: ${lastUpdatedDate.toLocaleDateString()}</p><br><p><strong>Orbit OS 4.0 Alpha 3 – UI Polish & Safety Update</strong></p><p style="color: var(--accent-secondary);">This update improves mobile usability, adds a critical safety feature to the BIOS, and polishes the user interface for a cleaner experience.</p><br><p><strong>BIOS Reset Confirmation</strong></p><p style="color: var(--accent-secondary);">To prevent accidental data loss, the 'Reset All User Data' option in the BIOS now requires an explicit confirmation before proceeding.</p><br><p><strong>Mobile Viewport Fix</strong></p><p style="color: var(--accent-secondary);">The terminal now correctly adjusts its size when the on-screen keyboard is opened on mobile devices, ensuring the command input is always visible.</p><br><p><strong>UI and Performance Tweaks</strong></p><p style="color: var(--accent-secondary);">The default blue highlight on interactive elements has been removed for a more consistent aesthetic. The command prompt has been slightly adjusted for better readability. Minor under-the-hood adjustments have been made for a smoother feel.</p></div>`,
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
        setTimeout(() => {
            clearInterval(i);
            triggerBSOD('CRITICAL_PROCESS_DIED');
        }, 4000);
        return '';
    },
    fonts: (args) => { const n=parseInt(args.trim()),f={1:"JetBrains Mono",2:"Fira Code",3:"Source Code Pro",4:"IBM Plex Mono",5:"Anonymous Pro",6:"Roboto Mono",7:"Space Mono",8:"Ubuntu Mono",9:"VT323",10:"Nanum Gothic Coding",11:"Cutive Mono",12:"Share Tech Mono",13:"Major Mono Display",14:"Nova Mono",15:"Syne Mono"};if(!args||isNaN(n)){let l='<p>Available fonts:</p>';for(const[i,m]of Object.entries(f)){l+=`<p>${i}. ${m}${i==1?' (Default)':''}</p>`}l+='<p>Usage: fonts [number]</p>';return l}if(applyFont(n)){setCookie('font',n,365);return`<p>Font set to ${f[n]}.</p>`}else{return'<p class="error-message">Invalid font number.</p>'}},
    clear: () => { output.innerHTML = ''; return ''; },
    echo: (args) => args ? `<p>${args.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>` : '<p>Nothing to echo.</p>',
    stop: (args) => { const p=args.trim().toLowerCase(); if(!p)return'<p>Usage: stop [process]</p>';if(p==='music'){const m=document.getElementById('music-player-container');if(m){m.remove();return'<p>Music player stopped.</p>'}else{return'<p class="error-message">Not running.</p>'}}if(p==='video'){const v=document.getElementById('video-player-container');if(v){v.remove();return'<p>Video player stopped.</p>'}else{return'<p class="error-message">Not running.</p>'}}if(p==='fastfetch'){const f=document.getElementById('fastfetch-container');if(f){f.remove();return'<p>System info closed.</p>'}else{return'<p class="error-message">Not running.</p>'}}return`<p class="error-message">Process '${p}' not found.</p>`; },
    date: () => `<p>${new Date().toLocaleString()}</p>`,
    whoami: () => `<p class="highlight-secondary">${config.username}@${config.hostname}</p>`,
    history: () => commandHistory.map((c, i) => `<p>${i + 1}. ${c}</p>`).join('') || '<p>No history.</p>',
    battery: () => { if(!config.batteryInfo.level)return`<p class="error-message">Battery API unavailable.</p>`;return`<p>Battery: ${config.batteryInfo.level}% (${config.batteryInfo.charging?'Charging':'Discharging'})</p>`;},
    processes: () => { let r=`<p class="highlight">Processes:</p><p>system_core</p><p>terminal</p>`,c=4;if(document.getElementById('music-player-container'))r+=`<p>music_player</p>`;if(document.getElementById('video-player-container'))r+=`<p>video_player</p>`;if(document.getElementById('fastfetch-container'))r+=`<p>sys_info</p>`;return r;},
    shutdown: () => { isSystemBricked=true;inputField.disabled=true;prompt.style.display='none';setTimeout(()=>{document.body.innerHTML='<p style="font-family:var(--font-mono);text-align:center;padding:2rem;">System halted.</p>'},1000);return'<p>Shutting down...</p>';},
    reboot: () => { output.innerHTML='<p>Rebooting...</p>';inputField.disabled=true;prompt.style.display='none';setTimeout(()=>window.location.reload(),1500);return'';},
    restart: () => commands.reboot(),
    calc: (args) => { try{if(!args)return"<p>Usage: calc [expression]</p>";const s=args.replace(/[^-()\d/*+.]/g,'');if(!s)return`<p class="error-message">Invalid characters.</p>`;return`<p>Result: ${new Function(`return ${s}`)()}</p>`}catch(e){return`<p class="error-message">Invalid expression.</p>`}},
    fortune: () => `<p class="highlight">Fortune:</p><p>${["A faithful friend is a strong defense.","A fresh start will put you on your way.","Your hard work is about to pay off."][Math.floor(Math.random()*3)]}</p>`,
    cowsay: (args) => { const m=args.trim()||"Moo!";return`<pre style="font-family:var(--font-mono);">${` _${'_'.repeat(m.length)}_ \n< ${m} >\n -${'-'.repeat(m.length)}- \n        \\   ^__^\n         \\  (oo)\\_______\n            (__)\\       )\\/\\\n                ||----w |\n                ||     ||`}</pre>`;},
    hide: (args) => { const target = args.trim().toLowerCase(); if (!target) return '<p>Usage: hide [music|video]</p>'; let hideBtn, name; if (target === 'music') { hideBtn = document.getElementById('hide-music-player'); name = 'Music player'; } else if (target === 'video') { hideBtn = document.getElementById('hide-video-player'); name = 'Video player'; } else { return `<p class="error-message">Cannot hide '${target}'. Valid options are 'music' or 'video'.</p>`; } if (hideBtn) { hideBtn.click(); const isHidden = hideBtn.innerHTML === '+'; return `<p>${isHidden ? 'Hiding' : 'Showing'} ${name}.</p>`; } else { return `<p class="error-message">${name} is not running.</p>`; } },
    tts: (args) => { if(!args.trim())return'<p>Usage: tts [text]</p>';if('speechSynthesis' in window){speechSynthesis.speak(new SpeechSynthesisUtterance(args));return'<p>Speaking...</p>'}else{return'<p class="error-message">TTS not supported.</p>'}},
    translate: async (args) => { const parts = args.split(' '); if (parts.length < 2) { return '<p>Usage: translate [lang] [text]</p>'; } const targetLang = parts[0]; const textToTranslate = parts.slice(1).join(' '); const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(textToTranslate)}`; try { const response = await fetch(url); if (!response.ok) { return '<p class="error-message">Translation service returned an error.</p>'; } const data = await response.json(); if (data && data[0] && data[0][0] && data[0][0][0]) { return `<p>${data[0][0][0]}</p>`; } else { return '<p class="error-message">Could not parse translation response.</p>'; } } catch (error) { console.error("Translation API error:", error); return '<p class="error-message">Failed to connect to the translation service. Check your connection.</p>'; } },
    reset: (args) => { if(args.trim()==='confirm'){deleteCookie('username');deleteCookie('hostname');deleteCookie('font');deleteCookie('lastLogin');localStorage.removeItem('orbitos_notes');output.innerHTML='<p>Data reset. Rebooting...</p>';setTimeout(()=>window.location.reload(),1500);return''}return`<p class="error-message">WARNING: This will erase all saved settings and notes. Type <span class="highlight">reset confirm</span> to proceed.</p>`;},
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
    weather: () => { const report = weatherData[Math.floor(Math.random() * weatherData.length)]; return `<p class="highlight">Weather:</p><p>${report.city}: ${report.temp}, ${report.desc}</p>`; },
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
                deleteCookie('username');
                deleteCookie('hostname');
                deleteCookie('font');
                deleteCookie('lastLogin');
                localStorage.removeItem('orbitos_notes');
                setTimeout(() => window.location.reload(), 2500);
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
};


