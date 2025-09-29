const commands = {
    help: () => `
        <p><span class="highlight">Available Commands:</span></p>
        <p>help           - Shows this help message</p>
        <p>fonts          - Change the terminal font</p>
        <p>clear          - Clears the terminal screen</p>
        <p>echo [text]    - Prints the specified text</p>
        <p>run [filename] - Executes a specified file (if runnable)</p>
        <p>date           - Shows current date and time</p>
        <p>fastfetch      - Displays system information</p>
        <p>whoami         - Shows current user</p>
        <p>history        - Shows command history</p>
        <p>battery        - Shows battery status</p>
        <p>software       - Shows system changelog</p>
        <p>weather        - Shows weather information</p>
        <p>processes      - Lists running processes</p>
        <p>calc [expr]    - Calculate mathematical expression</p>
        <p>browser [url]  - Opens a URL in an iframe</p>
        <p>music          - Opens the music player</p>
        <p>video          - Opens the video player</p>
        <p>stop [process] - Stop a process or component</p>
        <p>fortune        - Get a random fortune message</p>
        <p>cowsay [text]  - Display a cow saying your message</p>
        <p>shutdown       - Shutsdown OrbitOS</p>
        <p>reboot         - Reboots OrbitOS</p>
    `,

    video: () => {
        if (document.getElementById('video-player-container') || document.getElementById('mini-video-player-container')) {
            return '<p class="error-message">A video player instance is already running.</p>';
        }

        const playerContainer = document.createElement('div');
        playerContainer.id = 'video-player-container';
        playerContainer.style.cssText = `
            position: fixed; top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            width: 550px; max-width: 90vw;
            background-color: #252525; border: 1px solid #444;
            border-radius: 8px; box-shadow: 0 8px 25px rgba(0,0,0,0.7);
            z-index: 1000; color: #ccc; font-family: 'JetBrains Mono', monospace;
            display: flex; flex-direction: column; padding: 15px;
        `;

        playerContainer.innerHTML = `
            <div id="video-player-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; cursor: move;">
                <span id="video-title" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 450px; font-size: 0.9em;">No video loaded</span>
                <button id="close-video-player" style="background: #e03131; border: none; color: white; width: 22px; height: 22px; border-radius: 50%; cursor: pointer; font-weight: bold; display: flex; align-items: center; justify-content: center; transition: background-color 0.2s;" onmouseover="this.style.backgroundColor='#c92a2a'" onmouseout="this.style.backgroundColor='#e03131'">X</button>
            </div>
            <div style="width: 100%; background-color: black; border-radius: 4px; overflow: hidden;">
                <video id="video-element" style="width: 100%; height: auto; display: block; aspect-ratio: 16 / 9;"></video>
            </div>
            <input type="range" id="video-seek-bar" value="0" style="width: 100%; margin: 12px 0; accent-color: #2196F3;">
            <div id="video-controls" style="display: flex; justify-content: center; gap: 10px;">
                <button id="video-play-pause-btn" style="background: #3a3a3a; border: 1px solid #555; color: white; padding: 8px 15px; border-radius: 5px; cursor: pointer; transition: background-color 0.2s;" onmouseover="this.style.backgroundColor='#4a4a4a'" onmouseout="this.style.backgroundColor='#3a3a3a'">Play</button>
                <button id="video-stop-btn" style="background: #3a3a3a; border: 1px solid #555; color: white; padding: 8px 15px; border-radius: 5px; cursor: pointer; transition: background-color 0.2s;" onmouseover="this.style.backgroundColor='#4a4a4a'" onmouseout="this.style.backgroundColor='#3a3a3a'">Stop</button>
                <button id="video-hide-btn" style="background: #3a3a3a; border: 1px solid #555; color: white; padding: 8px 15px; border-radius: 5px; cursor: pointer; transition: background-color 0.2s;" onmouseover="this.style.backgroundColor='#4a4a4a'" onmouseout="this.style.backgroundColor='#3a3a3a'">Hide</button>
            </div>
        `;
        document.body.appendChild(playerContainer);

        const miniPlayerContainer = document.createElement('div');
        miniPlayerContainer.id = 'mini-video-player-container';
        miniPlayerContainer.style.cssText = `
            position: fixed; bottom: 20px; right: 20px;
            background-color: #2a2a2a; border: 1px solid #444;
            border-radius: 6px; box-shadow: 0 3px 10px rgba(0,0,0,0.6);
            z-index: 1001; color: #ccc; font-family: 'JetBrains Mono', monospace;
            padding: 10px; display: none; align-items: center; gap: 10px; cursor: move;
        `;
        miniPlayerContainer.innerHTML = `
            <span id="mini-video-title" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 150px;"></span>
            <button id="show-video-player-btn" style="background: #2196F3; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Show</button>
            <button id="stop-mini-video-btn" style="background: #f44336; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Stop</button>
        `;
        document.body.appendChild(miniPlayerContainer);

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.mp4';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);
        fileInput.click();

        const video = document.getElementById('video-element');
        const playPauseBtn = document.getElementById('video-play-pause-btn');
        const stopBtn = document.getElementById('video-stop-btn');
        const hideBtn = document.getElementById('video-hide-btn');
        const showPlayerBtn = document.getElementById('show-video-player-btn');
        const stopMiniBtn = document.getElementById('stop-mini-video-btn');
        const seekBar = document.getElementById('video-seek-bar');
        const videoTitle = document.getElementById('video-title');
        const miniVideoTitle = document.getElementById('mini-video-title');
        const closeBtn = document.getElementById('close-video-player');

        const stopVideo = () => {
            video.pause();
            if (video.src) URL.revokeObjectURL(video.src);
            playerContainer.remove();
            miniPlayerContainer.remove();
            fileInput.remove();
        };

        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                video.src = URL.createObjectURL(file);
                videoTitle.textContent = file.name;
                miniVideoTitle.textContent = file.name;
                video.play();
                playPauseBtn.textContent = 'Pause';
            } else {
                stopVideo();
            }
        };

        playPauseBtn.onclick = () => {
            if (!video.src) return;
            if (video.paused) {
                video.play();
                playPauseBtn.textContent = 'Pause';
            } else {
                video.pause();
                playPauseBtn.textContent = 'Play';
            }
        };

        stopBtn.onclick = () => {
            if (!video.src) return;
            video.pause();
            video.currentTime = 0;
            playPauseBtn.textContent = 'Play';
        };

        hideBtn.onclick = () => {
            if (!video.src) return;
            playerContainer.style.display = 'none';
            miniPlayerContainer.style.display = 'flex';
        };

        showPlayerBtn.onclick = () => {
            playerContainer.style.display = 'flex';
            miniPlayerContainer.style.display = 'none';
        };

        closeBtn.onclick = stopVideo;
        stopMiniBtn.onclick = stopVideo;

        video.ontimeupdate = () => {
            if (video.duration) seekBar.value = (video.currentTime / video.duration) * 100;
        };

        seekBar.oninput = () => {
            if (video.duration) video.currentTime = (seekBar.value / 100) * video.duration;
        };

        video.onended = () => {
            playPauseBtn.textContent = 'Play';
            seekBar.value = 0;
            video.currentTime = 0;
        }

        dragElement(playerContainer);
        dragElement(miniPlayerContainer);

        return '<p>Opening video player...</p>';
    },

    music: () => {
        if (document.getElementById('music-player-container') || document.getElementById('mini-player-container')) {
            return '<p class="error-message">A music player instance is already running.</p>';
        }

        const playerContainer = document.createElement('div');
        playerContainer.id = 'music-player-container';
        playerContainer.style.cssText = `
            position: fixed; top: 50%; left: 50%;
            transform: translate(-50%, -50%); width: 350px;
            background-color: #1e1e1e; border: 1px solid #333;
            border-radius: 8px; box-shadow: 0 5px 20px rgba(0,0,0,0.5);
            z-index: 1000; color: #ccc; font-family: 'JetBrains Mono', monospace;
            display: flex; flex-direction: column; padding: 15px;
        `;

        playerContainer.innerHTML = `
            <div id="music-player-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; cursor: move;">
                <span id="song-title">No song loaded</span>
                <button id="close-music-player" style="background: #e03131; border: none; color: white; width: 20px; height: 20px; border-radius: 50%; cursor: pointer; font-weight: bold; display: flex; align-items: center; justify-content: center;">X</button>
            </div>
            <audio id="audio-player"></audio>
            <input type="range" id="seek-bar" value="0" style="width: 100%; margin-bottom: 10px; accent-color: #4CAF50;">
            <div id="music-controls" style="display: flex; justify-content: center; gap: 10px;">
                <button id="play-pause-btn" style="background: #4CAF50; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">Play</button>
                <button id="stop-btn" style="background: #f44336; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">Stop</button>
                <button id="hide-btn" style="background: #ff9800; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">Hide</button>
            </div>
        `;
        document.body.appendChild(playerContainer);

        const miniPlayerContainer = document.createElement('div');
        miniPlayerContainer.id = 'mini-player-container';
        miniPlayerContainer.style.cssText = `
            position: fixed; bottom: 20px; right: 20px;
            background-color: #2a2a2a; border: 1px solid #444;
            border-radius: 6px; box-shadow: 0 3px 10px rgba(0,0,0,0.6);
            z-index: 1001; color: #ccc; font-family: 'JetBrains Mono', monospace;
            padding: 10px; display: none; align-items: center; gap: 10px; cursor: move;
        `;
        miniPlayerContainer.innerHTML = `
            <span id="mini-song-title" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 150px;"></span>
            <button id="show-player-btn" style="background: #2196F3; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Show</button>
            <button id="stop-mini-btn" style="background: #f44336; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Stop</button>
        `;
        document.body.appendChild(miniPlayerContainer);
        
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.mp3';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);
        fileInput.click();

        const audio = document.getElementById('audio-player');
        const playPauseBtn = document.getElementById('play-pause-btn');
        const stopBtn = document.getElementById('stop-btn');
        const hideBtn = document.getElementById('hide-btn');
        const showPlayerBtn = document.getElementById('show-player-btn');
        const stopMiniBtn = document.getElementById('stop-mini-btn');
        const seekBar = document.getElementById('seek-bar');
        const songTitle = document.getElementById('song-title');
        const miniSongTitle = document.getElementById('mini-song-title');
        const closeBtn = document.getElementById('close-music-player');

        const stopMusic = () => {
            audio.pause();
            audio.currentTime = 0;
            if (audio.src) URL.revokeObjectURL(audio.src);
            playerContainer.remove();
            miniPlayerContainer.remove();
            fileInput.remove();
        };

        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                audio.src = URL.createObjectURL(file);
                songTitle.textContent = file.name;
                miniSongTitle.textContent = file.name;
                audio.play();
                playPauseBtn.textContent = 'Pause';
            } else {
                stopMusic();
            }
        };

        playPauseBtn.onclick = () => {
            if (!audio.src) return;
            if (audio.paused) {
                audio.play();
                playPauseBtn.textContent = 'Pause';
            } else {
                audio.pause();
                playPauseBtn.textContent = 'Play';
            }
        };
        
        stopBtn.onclick = () => {
            if (!audio.src) return;
             audio.pause();
             audio.currentTime = 0;
             playPauseBtn.textContent = 'Play';
        };

        hideBtn.onclick = () => {
            if (!audio.src) return;
            playerContainer.style.display = 'none';
            miniPlayerContainer.style.display = 'flex';
        };

        showPlayerBtn.onclick = () => {
            playerContainer.style.display = 'flex';
            miniPlayerContainer.style.display = 'none';
        };

        closeBtn.onclick = stopMusic;
        stopMiniBtn.onclick = stopMusic;

        audio.ontimeupdate = () => {
            if (audio.duration) seekBar.value = (audio.currentTime / audio.duration) * 100;
        };
        
        seekBar.oninput = () => {
             if (audio.duration) audio.currentTime = (seekBar.value / 100) * audio.duration;
        };
        
        audio.onended = () => {
            playPauseBtn.textContent = 'Play';
            seekBar.value = 0;
            audio.currentTime = 0;
        }

        dragElement(playerContainer);
        dragElement(miniPlayerContainer);

        return '<p>Opening music player...</p>';
    },

    fonts: (args) => {
        const fontNumber = parseInt(args.trim());
        if (!args || isNaN(fontNumber)) {
            return `
                <p>Available fonts:</p>
                <p>1. JetBrains Mono (Default)</p>
                <p>2. Fira Code</p>
                <p>3. Source Code Pro</p>
                <p>4. IBM Plex Mono</p>
                <p>5. Anonymous Pro</p>
                <p>Usage: fonts [number]</p>
            `;
        }
        if (applyFont(fontNumber)) {
            return `<p>Font updated successfully.</p>`;
        } else {
            return `<p class="error-message">Error: Invalid font number. Please choose a number between 1 and 5.</p>`;
        }
    },

    clear: () => {
        output.innerHTML = '';
        return '';
    },

    echo: (args) => args ? `<p>${args}</p>` : '<p>Nothing to echo.</p>',

    run: (args) => {
        return `<p class="error-message">Error: No runnable files found in the current system.</p>`;
    },

    stop: (args) => {
        const processName = args.trim().toLowerCase();

        if (!processName) {
            return '<p>Usage: stop [process]</p><p>Available: terminal, system, browser, music, video, process</p>';
        }

        if (processName === 'terminal') {
            toggleTerminal(false);
            return '<p class="highlight">Terminal interface stopped. Refresh page to restore.</p>';
        } else if (processName === 'system') {
            setTimeout(systemHalt, 500);
            return '<p class="highlight">WARNING: Critical system process stopping...</p>';
        } else if (processName === 'browser') {
            if (stoppedProcesses.includes('browser')) {
                return '<p class="error-message">Browser process already stopped.</p>';
            }
            stoppedProcesses.push('browser');
            return '<p>Browser process stopped. "browser" command is now disabled.</p>';
        } else if (processName === 'music') {
             const player = document.getElementById('music-player-container');
             const miniPlayer = document.getElementById('mini-player-container');
             if (player || miniPlayer) {
                 const closeBtn = document.getElementById('close-music-player');
                 if(closeBtn) closeBtn.click();
                 return '<p>Music player stopped.</p>';
             } else {
                 return '<p class="error-message">Music player is not running.</p>';
             }
        } else if (processName === 'video') {
             const player = document.getElementById('video-player-container');
             const miniPlayer = document.getElementById('mini-video-player-container');
             if (player || miniPlayer) {
                 const closeBtn = document.getElementById('close-video-player');
                 if(closeBtn) closeBtn.click();
                 return '<p>Video player stopped.</p>';
             } else {
                 return '<p class="error-message">Video player is not running.</p>';
             }
        } else if (processName === 'process') {
            const pid = Math.floor(Math.random() * 1000) + 1;
            return `<p>Process with PID ${pid} stopped successfully.</p>`;
        } else {
            return `<p class="error-message">Error: Process '${processName}' not found or cannot be stopped.</p>`;
        }
    },

    date: () => `<p>${new Date().toLocaleString()}</p>`,

    fastfetch: () => {
        const {
            totalDisk,
            freeDisk,
            totalRAM,
            freeRAM
        } = config.dynamicStorage;
        return `
            <pre class="highlight" style="font-family: 'JetBrains Mono', monospace;">
              /\\
             /  \\
            /    \\
           /      \\
          /   ◢◤   \\
         /    ||    \\
        /     ||     \\
       /      ||      \\
      /________________\\
            </pre>
            <p><span class="highlight">${config.systemInfo.os}</span>@${config.username}</p>
            <p>-----------------</p>
            <p>OS: ${config.systemInfo.os} ${config.systemInfo.version}</p>
            <p>Kernel: ${config.systemInfo.kernel}</p>
            <p>Architecture: ${config.systemInfo.architecture}</p>
            <p>Total Disk: ${totalDisk.toFixed(2)} GB (${freeDisk.toFixed(2)} GB free)</p>
            <p>Total RAM: ${totalRAM.toFixed(2)} GB (${freeRAM.toFixed(2)} GB free)</p>
            <p>Uptime: ${getUptime()}</p>
        `;
    },

    whoami: () => `<p class="highlight">${config.username}@${config.hostname}</p>`,

    history: () => commandHistory.map((cmd, i) => `<p>${i + 1}. ${cmd}</p>`).join('') || '<p>No command history yet.</p>',

    battery: () => {
        const percentage = config.batteryInfo.percentage;
        const isCharging = config.batteryInfo.charging;
        const timeRemaining = generateBatteryTimeRemaining(percentage, isCharging);

        return `
            <p>Battery Status:</p>
            <p>Charge: ${percentage}%</p>
            <p>Status: ${isCharging ? 'Charging' : 'Discharging'}</p>
            <p>Time ${isCharging ? 'to full' : 'remaining'}: ${timeRemaining}</p>
        `;
    },

    software: () => {
        const checkMessage = '<p style="color: var(--terminal-success);">Checking for updates...</p>';

        setTimeout(() => {
            const updateMessage = document.createElement('div');
            updateMessage.innerHTML = `
                <p style="color: var(--terminal-error);">You are using the latest version!</p>
                <p>Last successful update: September 28, 2025</p>
                <p>Version 3.5.4</p>
                <p></p>
                <ul>
                    </li>• Added a new rm -rf command along with a basic BIOS interface, giving users low-level access to system operations. Right now, the BIOS is limited to executing rm -rf, but this is just the beginning. Starting with version 4.0, the BIOS will expand its capabilities, allowing full system control such as restarting the system, managing core processes, and performing other advanced administrative functions, paving the way for a more powerful and flexible user experience.
</li>

          </ul>
            `;
            output.appendChild(updateMessage);
            scrollToBottom();
        }, 1500);

        return checkMessage;
    },

    weather: () => {
        const weather = generateRandomWeather();
        const {
            location,
            temperature,
            condition,
            humidity,
            windSpeed,
            precipitation,
            precipChance
        } = weather;

        return `
            <p class="highlight">Current Weather:</p>
            <p>Location: ${location.city}, ${location.country}</p>
            <p>Temperature: ${temperature}°C</p>
            <p>Condition: ${condition}</p>
            <p>Humidity: ${humidity}%</p>
            <p>Wind Speed: ${windSpeed} km/h</p>
            <p>Precipitation: ${precipitation} (${precipChance}% chance)</p>
        `;
    },

    processes: () => {
        let runningProcesses = `
            <p class="highlight">Running Processes:</p>
            <p>1. system_core    (PID: 1)</p>
            <p>2. terminal       (PID: 245)</p>
            <p>3. user_session   (PID: 892)</p>
        `;
        let pidCounter = 4;
        if (document.getElementById('music-player-container')) {
            runningProcesses += `<p>${pidCounter++}. music_player   (PID: ${Math.floor(Math.random() * 500) + 1000})</p>`;
        }
        if (document.getElementById('video-player-container')) {
             runningProcesses += `<p>${pidCounter++}. video_player   (PID: ${Math.floor(Math.random() * 500) + 1500})</p>`;
        }
        if (stoppedProcesses.length > 0) {
            runningProcesses += '<p class="highlight">Stopped Processes:</p>' + stoppedProcesses.map(proc => `<p>- ${proc}</p>`).join('');
        }
        return runningProcesses;
    },

    shutdown: () => {
        const response = '<p>Shutting down...</p>';
        isSystemBricked = true;
        inputField.disabled = true;
        prompt.style.display = 'none';
        setTimeout(() => {
            document.body.innerHTML = '<p style="color: #ccc; font-family: JetBrains Mono, monospace; text-align: center; margin-top: 50px;">System halted.</p>';
        }, 1000);
        return response;
    },

    reboot: () => {
        output.innerHTML = '<p>Rebooting system...</p>';
        inputField.disabled = true;
        prompt.style.display = 'none';


        (async () => {
            await new Promise(resolve => setTimeout(resolve, 1500));

            if (typeof simulateBootSequence === 'function') {
                await simulateBootSequence();
            }
            if (typeof finalizeBootSequence === 'function') {
                finalizeBootSequence();
            }
        })();

        return '';
    },

    calc: (args) => {
        try {
            if (!args) return "<p>Usage: calc [expression]</p>";
            const safeArgs = args.replace(/[^-()\d/*+.]/g, '');
            if (!safeArgs) return `<p class="error-message">Error: Invalid characters in expression</p>`;
            const result = new Function(`return ${safeArgs}`)();
            return `<p>Result: ${result}</p>`;
        } catch (error) {
            console.error("Calc Error:", error);
            return `<p class="error-message">Error: Invalid expression or calculation failed</p>`;
        }
    },

    browser: (args) => {
        if (stoppedProcesses.includes('browser')) {
            return '<p class="error-message">Browser process is stopped. Use "reboot" to restore functionality.</p>';
        }

        const url = args.trim();
        if (!url) {
            return `<p>Usage: browser [url]</p><p>Example: browser https://example.com</p>`;
        }

        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            return `<p class="error-message">Invalid URL. Please include http:// or https://</p>`;
        }

        return `
            <p class="highlight" style="color: var(--terminal-error);">
            ⚠️ OrbitOS uses a iframe to load sites, however not all sites can load.
            </p>
            <p>Loading ${url}...</p>
            <div style="width:100%; height:600px; border: 1px solid #444; margin-top: 10px; background-color: white; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); overflow: hidden;">
                <iframe src="${url}" style="width:100%; height:100%; border:none;" sandbox="allow-scripts allow-same-origin"></iframe>
            </div>
        `;
    },

    fortune: () => {
        const fortunes = [
            "You will find a hidden treasure where you least expect it.",
            "A beautiful, smart, and loving person will be coming into your life.",
            "Your hard work is about to pay off. Remember, Rome wasn't built in a day.",
            "A dubious friend may be an enemy in camouflage.",
            "A faithful friend is a strong defense.",
            "A fresh start will put you on your way.",
            "A person of words and not deeds is like a garden full of weeds.",
            "All the effort you are making will ultimately pay off."
        ];

        const randomIndex = Math.floor(Math.random() * fortunes.length);
        return `<p class="highlight">Fortune says:</p><p>${fortunes[randomIndex]}</p>`;
    },

    cowsay: (args) => {
        const message = args.trim() || "Moo!";

        const bubbleWidth = message.length + 2;
        const topLine = ` ${'_'.repeat(bubbleWidth)} `;
        const bottomLine = ` ${'-'.repeat(bubbleWidth)} `;
        const textLine = `< ${message} >`;

        const cow = `
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||
    `;

        return `<pre style="font-family: 'JetBrains Mono', monospace;">${topLine}
${textLine}
${bottomLine}${cow}</pre>`;
    },

    rm: (args) => {
        const validFlags = ['-rf', '-rf /', '-rf --no-preserve-root'];
        if (!validFlags.includes(args.trim())) {
            return `<p>rm: missing operand</p><p>Try 'rm --help' for more information.</p>`;
        }

        inputField.disabled = true;
        prompt.style.display = 'none';

        const generateRandomPath = () => {
            const dirs = ['/bin', '/etc', '/home', '/usr', '/var', '/lib', '/root', '/tmp', '/dev', '/proc', '/sbin', '/opt'];
            const subdirs = ['local', 'share', 'log', 'mail', 'spool', 'games', 'X11R6', 'include', 'config', 'cache', 'www'];
            const files = ['kernel.log', 'config.sys', 'profile', 'bashrc', 'shadow', 'passwd', 'fstab', 'hosts', 'null', 'random', 'zero', 'vmlinuz', 'initrd.img'];

            let path = dirs[Math.floor(Math.random() * dirs.length)];
            const depth = Math.floor(Math.random() * 4);

            for (let i = 0; i < depth; i++) {
                path += '/' + subdirs[Math.floor(Math.random() * subdirs.length)];
            }

            path += '/' + files[Math.floor(Math.random() * files.length)] + Math.random().toString(36).substring(2, 8);
            return path;
        };

        const deletionInterval = setInterval(() => {
            const errorElement = document.createElement('p');
            errorElement.className = 'error-message';
            errorElement.style.margin = '0';
            errorElement.style.lineHeight = '1.2';
            errorElement.textContent = `rm: cannot remove '${generateRandomPath()}': No such file or directory`;
            output.appendChild(errorElement);
            scrollToBottom();
        }, 40);

        setTimeout(() => {
            clearInterval(deletionInterval);
            document.body.innerHTML = `<div style="background-color: #0000AA; color: #FFFFFF; width: 100%; height: 100vh; font-family: 'Perfect DOS VGA', monospace; padding: 2em; box-sizing: border-box;">
                <p style="text-align: center; background-color: #CCCCCC; color: #0000AA; display: inline-block; padding: 0 0.5em;"> BIOS </p>
                <p>A fatal exception 0E has occurred at 0137:BFF73456. /sys could not be mounted.</p>
                <br>
                <p>* Press any key to try again</p>
                <p>* Press CTRL+ALT+DEL again to restart your computer. You will lose any unsaved information in all applications.</p>
                <br>
                <p style="text-align: center;">Press any key to continue _</p>
            </div>`;
        }, 8000);

        return '';
    }
};

function dragElement(elmnt) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  const headerId = elmnt.id.includes('mini') ? elmnt.id : `${elmnt.id}-header`;
  const header = document.getElementById(headerId) || elmnt;
  
  if (header) {
    header.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    elmnt.style.top = `${elmnt.offsetTop - pos2}px`;
    elmnt.style.left = `${elmnt.offsetLeft - pos1}px`;
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}


