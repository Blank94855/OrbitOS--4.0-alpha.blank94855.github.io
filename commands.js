function applyFontColor(color) {
    if (color) {
        document.documentElement.style.setProperty('--on-surface', color);
    } else {
        document.documentElement.style.setProperty('--on-surface', '#c9d1d9');
    }
}

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
    function dragMouseDown(e) { e = e || window.event; e.preventDefault(); pos3 = e.clientX; pos4 = e.clientY; document.onmouseup = closeDragElement; document.onmousemove = elementDrag; if (header) header.style.cursor = 'grabbing'; elmnt.style.transition = 'none'; }
    function elementDrag(e) { e = e || window.event; e.preventDefault(); pos1 = pos3 - e.clientX; pos2 = pos4 - e.clientY; pos3 = e.clientX; pos4 = e.clientY; elmnt.style.top = `${elmnt.offsetTop - pos2}px`; elmnt.style.left = `${elmnt.offsetLeft - pos1}px`; }
    function closeDragElement() { document.onmouseup = null; document.onmousemove = null; if (header) header.style.cursor = 'grab'; elmnt.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease'; }
}

const lastUpdatedDate = new Date('2025-10-01');

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
                    <p><span class="highlight-secondary">battery</span>          - Shows battery status</p>
                    <p><span class="highlight-secondary">processes</span>        - Lists running processes</p>
                    <p><span class="highlight-secondary">stop [process]</span>   - Stop a process or component</p>
                    <p><span class="highlight-secondary">reset</span>            - Reset all user data</p>
                    <p><span class="highlight-secondary">bios</span>             - Enter the BIOS utility</p>
                    <p><span class="highlight-secondary">shutdown</span>         - Shutsdown OrbitOS</p>
                    <p><span class="highlight-secondary">reboot</span>           - Reboots OrbitOS</p>
                    <p><span class="highlight-secondary">rm -rf</span>           - ...</p>
                    <br/>
                    <p>Type <span class="highlight">'help 3'</span> for more commands.</p>
                `;
                break;
            case 3:
                output += `
                    <p class="highlight">--- [ Tools, Games & Media ] ---</p>
                    <p><span class="highlight-secondary">guess [number]</span>   - Play a number guessing game</p>
                    <p><span class="highlight-secondary">passgen [len]</span>    - Generates a random password</p>
                    <p><span class="highlight-secondary">notes</span>            - Manage your notes</p>
                    <p><span class="highlight-secondary">browser [url]</span>    - Opens a URL in a frame</p>
                    <p><span class="highlight-secondary">calc [expr]</span>      - Calculate mathematical expression</p>
                    <p><span class="highlight-secondary">wiki [query]</span>     - Search Wikipedia and display summary</p>
                    <p><span class="highlight-secondary">tts [text]</span>       - Text to speech</p>
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
    fastfetch: () => { /* ...fastfetch implementation... */ return '<p>Displaying system information...</p>'; },
    wiki: async (args) => { /* ...wiki implementation... */ return `...`; },
    video: () => { /* ...video implementation... */ return '<p>Opening video player...</p>'; },
    music: () => { /* ...music implementation... */ return '<p>Opening music player...</p>'; },
    software: () => `<div style="line-height: 1.8;"><p><strong><span class="highlight">What's new in OrbitOS ${config.systemInfo.version}</span></strong></p><p>Last updated: ${lastUpdatedDate.toLocaleDateString()}</p><br><p><strong>Orbit OS 4.0 Alpha 4 – Utilities & Games Update</strong></p><p style="color: var(--accent-secondary);">This update adds several new command-line tools and games, along with more personalization options for the user experience.</p><br><p><strong>New Games & Tools</strong></p><p style="color: var(--accent-secondary);">Challenge yourself with the 'guess' number game or generate secure passwords with the 'passgen' command, right from the terminal.</p><br><p><strong>Custom Welcome Message</strong></p><p style="color: var(--accent-secondary);">Personalize your boot-up sequence by setting a custom welcome message with the new 'welcomemsg' command. Your message is saved and will greet you every time you start the OS.</p></div>`,
    browser: (args) => { /* ...browser implementation... */ return `...`; },
    rm: (args) => { /* ...rm implementation... */ return ''; },
    fonts: (args) => { /* ...fonts implementation... */ return `...`; },
    clear: () => { output.innerHTML = ''; return ''; },
    echo: (args) => args ? `<p>${args.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>` : '<p>Nothing to echo.</p>',
    stop: (args) => { /* ...stop implementation... */ return `...`; },
    date: () => `<p>${new Date().toLocaleString()}</p>`,
    whoami: () => `<p class="highlight-secondary">${config.username}@${config.hostname}</p>`,
    history: () => commandHistory.map((c, i) => `<p>${i + 1}. ${c}</p>`).join('') || '<p>No history.</p>',
    battery: () => { if(!config.batteryInfo.level)return`<p class="error-message">Battery API unavailable.</p>`;return`<p>Battery: ${config.batteryInfo.level}% (${config.batteryInfo.charging?'Charging':'Discharging'})</p>`;},
    processes: () => { let r=`<p class="highlight">Processes:</p><p>system_core</p><p>terminal</p>`;if(document.getElementById('music-player-container'))r+=`<p>music_player</p>`;if(document.getElementById('video-player-container'))r+=`<p>video_player</p>`;if(document.getElementById('fastfetch-container'))r+=`<p>sys_info</p>`;return r;},
    shutdown: () => { isSystemBricked=true;inputField.disabled=true;prompt.style.display='none';setTimeout(()=>{document.body.innerHTML='<p style="font-family:var(--font-mono);text-align:center;padding:2rem;">System halted.</p>'},1000);return'<p>Shutting down...</p>';},
    reboot: () => { output.innerHTML='<p>Rebooting...</p>';inputField.disabled=true;prompt.style.display='none';setTimeout(()=>window.location.reload(),1500);return'';},
    restart: () => commands.reboot(),
    calc: (args) => { try{if(!args)return"<p>Usage: calc [expression]</p>";const s=args.replace(/[^-()\d/*+.]/g,'');if(!s)return`<p class="error-message">Invalid characters.</p>`;return`<p>Result: ${new Function(`return ${s}`)()}</p>`}catch(e){return`<p class="error-message">Invalid expression.</p>`}},
    hide: (args) => { /* ...hide implementation... */ return `...`; },
    tts: (args) => { if(!args.trim())return'<p>Usage: tts [text]</p>';if('speechSynthesis' in window){speechSynthesis.speak(new SpeechSynthesisUtterance(args));return'<p>Speaking...</p>'}else{return'<p class="error-message">TTS not supported.</p>'}},
    reset: (args) => { if(args.trim()==='confirm'){deleteCookie('username');deleteCookie('hostname');deleteCookie('font');deleteCookie('lastLogin');deleteCookie('fontColor');localStorage.removeItem('orbitos_notes');localStorage.removeItem('orbitos_welcome_message');output.innerHTML='<p>Data reset. Rebooting...</p>';setTimeout(()=>window.location.reload(),1500);return''}return`<p class="error-message">WARNING: This will erase all saved settings and notes. Type <span class="highlight">reset confirm</span> to proceed.</p>`;},
    setname: (args) => { const n = args.trim(); if (!n) return '<p>Usage: setname [username]</p>'; if (n.length > 15) return '<p class="error-message">Username too long (max 15 chars).</p>'; config.username = n; setCookie('username', n, 365); prompt.textContent = `${config.username}@${config.hostname}:~$ `; return `<p>Username changed to <span class="highlight">${n}</span>.</p>`; },
    sethost: (args) => { const h = args.trim(); if (!h) return '<p>Usage: sethost [hostname]</p>'; if (h.length > 15) return '<p class="error-message">Hostname too long (max 15 chars).</p>'; config.hostname = h; setCookie('hostname', h, 365); prompt.textContent = `${config.username}@${config.hostname}:~$ `; return `<p>Hostname changed to <span class="highlight">${h}</span>.</p>`; },
    bios: () => { /* ...bios implementation... */ return ''; },
    notes: (args) => { /* ...notes implementation... */ return `...`; },
    fontcolor: (args) => {
        const colorMap = { 1: { name: 'Default', hex: '#c9d1d9' }, 2: { name: 'Mint', hex: '#80ffdb' }, 3: { name: 'Sky', hex: '#72ddf7' }, 4: { name: 'Sand', hex: '#f2e9c9' }, 5: { name: 'Lavender', hex: '#d7bce3' } };
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
    }
};


