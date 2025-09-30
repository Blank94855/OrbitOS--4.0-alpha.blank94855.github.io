const output = document.getElementById('output');
const inputField = document.getElementById('input');
const prompt = document.getElementById('prompt');
const terminalElement = document.querySelector('.terminal');
const lockScreen = document.getElementById('lock-screen');
const unlockButton = document.getElementById('unlock-button');
const statusBar = document.getElementById('status-bar');

let isSystemBricked = false;
let commandHistory = [];
let historyIndex = -1;

const bootSequence = [ "Starting system...", "Loading kernel modules...", "Mounting /system...", "Starting ueventd...", "Starting servicemanager...", "Starting zygote...", "Boot completed." ];
const config = {
    username: 'root',
    hostname: 'orbit',
    lastBootTime: new Date(),
    systemInfo: {
        os: 'OrbitOS',
        version: '4.0. - alpha 5',
        build: `20250930-${Math.floor(Math.random() * 900) + 100}`,
        kernel: '6.5.0-orbit'
    },
    batteryInfo: {},
};

function triggerBSOD(errorCode) {
    isSystemBricked = true;
    document.querySelector('.os-container').style.display = 'none';
    document.getElementById('status-bar').style.display = 'none';
    const bsodScreen = document.getElementById('bsod-screen');
    const errorCodeEl = document.getElementById('bsod-error-code');
    errorCodeEl.textContent = `Stop Code: ${errorCode}`;
    bsodScreen.style.display = 'flex';
    setTimeout(() => window.location.reload(), 5000);
}

function setCookie(name, value, days) { let expires = ""; if (days) { const date = new Date(); date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); expires = "; expires=" + date.toUTCString(); } document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax"; }
function getCookie(name) { const nameEQ = name + "="; const ca = document.cookie.split(';'); for (let i = 0; i < ca.length; i++) { let c = ca[i]; while (c.charAt(0) == ' ') c = c.substring(1, c.length); if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length); } return null; }
function deleteCookie(name) { document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax;'; }

function loadSettings() {
    const savedUser = getCookie('username');
    if (savedUser) config.username = savedUser;

    const savedHost = getCookie('hostname');
    if (savedHost) config.hostname = savedHost;

    const savedFont = getCookie('font');
    if (savedFont) applyFont(parseInt(savedFont));
}

function simulateBootSequence() {
    isSystemBricked = false; inputField.disabled = true; prompt.style.display = 'none'; output.innerHTML = '';
    return new Promise((resolve) => {
        bootSequence.forEach((message, index) => {
            setTimeout(() => {
                if(isSystemBricked) return;
                const p = document.createElement('p');
                p.innerHTML = `<span class="highlight-secondary">[OK]</span> ${message}`;
                output.appendChild(p);
                scrollToBottom();
                if (index === bootSequence.length - 1) setTimeout(resolve, 500);
            }, 150 * (index + 1));
        });
    });
}

function finalizeBootSequence() {
    const lastLogin = getCookie('lastLogin');
    let welcomeMessage = `<div class="command-block"><p>Welcome to <span class="highlight">OrbitOS ${config.systemInfo.version}</span></p><p>Type 'help' for a list of commands</p>`;
    if (lastLogin) { welcomeMessage += `<p><br/>Last login: ${new Date(lastLogin).toLocaleString()}</p>`; }
    welcomeMessage += `</div>`;
    setCookie('lastLogin', new Date().toISOString(), 365);
    output.innerHTML = welcomeMessage;
    inputField.disabled = false; prompt.style.display = 'inline-block'; inputField.focus();
    prompt.textContent = `${config.username}@${config.hostname}:~$`;
}

function updateLockScreenTime() {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const date = now.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    document.getElementById('lock-time').textContent = time;
    document.getElementById('lock-date').textContent = date;
}

function updateStatusBar() {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    document.getElementById('status-time').textContent = time;
}

async function updateBatteryStatus() {
    try {
        const battery = await navigator.getBattery();
        const updateLevel = () => {
            config.batteryInfo.level = Math.floor(battery.level * 100);
            config.batteryInfo.charging = battery.charging;
            const levelEl = document.getElementById('battery-level');
            const iconEl = document.getElementById('battery-icon');
            if (levelEl) levelEl.textContent = `${config.batteryInfo.level}%`;
            if (battery.charging) { iconEl.innerHTML = `<path d="M5 18H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.19M15 6h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3.19"></path><line x1="23" y1="13" x2="23" y2="11"></line><polyline points="11 6 7 12 13 12 9 18"></polyline>`; }
            else { iconEl.innerHTML = `<rect x="1" y="6" width="18" height="12" rx="2" ry="2"></rect><line x1="23" y1="13" x2="23" y2="11"></line>`; }
        };
        updateLevel();
        battery.addEventListener('levelchange', updateLevel); battery.addEventListener('chargingchange', updateLevel);
    } catch (e) { document.getElementById('status-battery').style.display = 'none'; }
}

function getUptime() {
    const diff = new Date() - config.lastBootTime;
    let minutes = Math.floor(diff / 60000); let hours = Math.floor(minutes / 60);
    return `${hours % 24}h ${minutes % 60}m`;
}

function applyFont(fontNumber) {
    const fontMap = { 1: "'JetBrains Mono', monospace", 2: "'Fira Code', monospace", 3: "'Source Code Pro', monospace", 4: "'IBM Plex Mono', monospace", 5: "'Anonymous Pro', monospace", 6: "'Roboto Mono', monospace", 7: "'Space Mono', monospace", 8: "'Ubuntu Mono', monospace", 9: "'VT323', monospace", 10: "'Nanum Gothic Coding', monospace", 11: "'Cutive Mono', monospace", 12: "'Share Tech Mono', monospace", 13: "'Major Mono Display', monospace", 14: "'Nova Mono', monospace", 15: "'Syne Mono', monospace" };
    const fontFamily = fontMap[fontNumber];
    if (fontFamily) { terminalElement.style.fontFamily = fontFamily; return true; }
    return false;
}

async function executeCommand(input) {
    if (isSystemBricked) return '<p class="error-message">System halted. Please reboot.</p>';
    const trimmedInput = input.trim(); if (!trimmedInput) return '';
    const [command, ...args] = trimmedInput.split(' ');
    const lowerCaseCommand = command.toLowerCase();
    const commandFunction = commands[lowerCaseCommand] || (command === 'rm' && args[0] === '-rf' ? commands.rm : null);

    if (typeof commandFunction === 'function') {
        if (trimmedInput && commandHistory[commandHistory.length - 1] !== trimmedInput) { commandHistory.push(trimmedInput); }
        historyIndex = commandHistory.length;
        return await commandFunction(args.join(' '));
    } else {
        return `<p class="error-message">Command not found: ${command}. Type 'help' for available commands.</p>`;
    }
}

async function displayResponse(rawInput) {
    const input = rawInput.trim();
    const commandBlock = document.createElement('div');
    commandBlock.className = 'command-block';
    
    commandBlock.innerHTML = `<p><span class="highlight-secondary">${prompt.textContent} </span>${rawInput.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>`;
    output.appendChild(commandBlock);

    if (!input) {
        scrollToBottom();
        inputField.value = '';
        return;
    }

    const isAsync = commands[input.split(' ')[0].toLowerCase()]?.constructor.name === 'AsyncFunction';
    let loadingIndicator;

    if (isAsync) {
        loadingIndicator = document.createElement('p');
        loadingIndicator.textContent = 'Fetching...';
        commandBlock.appendChild(loadingIndicator);
        scrollToBottom();
    }

    const responseHTML = await executeCommand(rawInput); 
    if (loadingIndicator) loadingIndicator.remove();
    
    if (responseHTML) {
        commandBlock.insertAdjacentHTML('beforeend', responseHTML);
    }

    scrollToBottom();
    inputField.value = '';
}


function scrollToBottom() {
    requestAnimationFrame(() => {
        output.scrollTop = output.scrollHeight;
    });
}


window.addEventListener('DOMContentLoaded', async () => {
    const style = document.createElement('style');
    style.textContent = `
        .command-block {
            content-visibility: auto;
            contain-intrinsic-size: 40px;
        }
    `;
    document.head.appendChild(style);

    loadSettings();
    if (getCookie('fpsMonitor') === 'true') {
        commands.fps('on');
    }
    updateLockScreenTime(); setInterval(updateLockScreenTime, 1000);
    dragElement(terminalElement, 'terminal-header');

    unlockButton.addEventListener('click', async () => {
        lockScreen.classList.add('hidden');
        statusBar.style.display = 'flex'; terminalElement.style.display = 'flex';
        updateStatusBar(); setInterval(updateStatusBar, 1000); updateBatteryStatus();
        await simulateBootSequence();
        finalizeBootSequence();
    });
});

inputField.addEventListener('keydown', (e) => {
    if (isSystemBricked) { e.preventDefault(); return; }
    if (e.key === 'Enter') {
        e.preventDefault();
        displayResponse(inputField.value);
        historyIndex = commandHistory.length;
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIndex > 0) { historyIndex--; inputField.value = commandHistory[historyIndex]; inputField.setSelectionRange(inputField.value.length, inputField.value.length); }
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) { historyIndex++; inputField.value = commandHistory[historyIndex]; inputField.setSelectionRange(inputField.value.length, inputField.value.length); }
        else { historyIndex = commandHistory.length; inputField.value = ''; }
    }
});

inputField.addEventListener('focus', () => {
    setTimeout(() => {
        scrollToBottom();
    }, 100);
});

terminalElement.addEventListener('click', (e) => { if (e.target.tagName !== 'A' && !isSystemBricked) { inputField.focus(); } });

