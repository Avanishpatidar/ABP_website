
document.addEventListener('DOMContentLoaded', () => {
    const chatbotContainer = document.createElement('div');
    chatbotContainer.id = 'ai-chatbot-container';
    chatbotContainer.innerHTML = `
        <!-- Ask ABP: text chat trigger (right side) -->
        <div id="chatbot-toggle" class="cta-btn cta-ask-abp">
            <div class="cta-icon">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
                </svg>
            </div>
            <span class="cta-text">Ask ABP</span>
        </div>

        <!-- Text chat overlay -->
        <div id="chatbot-overlay" class="chatbot-overlay">
            <div id="chatbot-terminal" class="chatbot-terminal">
                <div class="terminal-header">
                    <div class="terminal-title">virtual-abp -- -zsh -- 80x24</div>
                    <div class="terminal-controls">
                        <button id="chatbot-close" class="close-terminal">[x] close</button>
                    </div>
                </div>
                <div id="chatbot-messages" class="terminal-messages">
                    <div class="mascot-container">
                        <div class="mascot-wave">👋</div>
                        <div class="intro-text">Hey, I'm Virtual ABP!</div>
                        <div class="intro-sub">Ask me anything about Avanish's projects, skills, or just say hi.</div>
                    </div>
                </div>
                <div class="terminal-input-area">
                    <span class="prompt-label">visitor@avanish.dev:~$</span>
                    <input type="text" id="chatbot-input" class="terminal-input" autocomplete="off" spellcheck="false" />
                    <div class="terminal-cursor"></div>
                </div>
            </div>
        </div>

        <!-- Floating voice mascot: always visible at bottom-center -->
        <div id="voice-mascot" class="voice-mascot">
            <div class="voice-mascot-inner" id="mascot-click-area">
                <div class="voice-mascot-face" id="mascot-face">
                    <div class="mascot-face-ring"></div>
                    <div class="mascot-face-letter">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2ZM6.5 6.5L8 2L9.5 6.5L14 8L9.5 9.5L8 14L6.5 9.5L2 8L6.5 6.5Z" />
                        </svg>
                    </div>
                    <div class="mascot-face-waves" id="mascot-waves">
                        <span></span><span></span><span></span>
                    </div>
                </div>
                <div class="voice-mascot-body">
                    <div class="voice-mascot-status" id="mascot-status">Tap anywhere to start</div>
                    <div class="voice-mascot-controls" id="mascot-controls" style="display:none;">
                        <button id="mascot-mic-btn" class="mascot-mic-btn muted" title="Turn on mic">
                            <svg class="mic-off-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2c0 .76-.12 1.49-.35 2.17"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
                            <svg class="mic-on-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
                        </button>
                        <button id="mascot-stop-btn" class="mascot-stop-btn" title="End voice session">
                            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>
                        </button>
                    </div>
                </div>
            </div>
            <div class="voice-mascot-action-display" id="mascot-action-display"></div>
        </div>
    `;
    document.body.appendChild(chatbotContainer);

    // DOM — text chat
    const toggleBtn = document.getElementById('chatbot-toggle');
    const heroChatBtn = document.getElementById('hero-chat-btn');
    const overlay = document.getElementById('chatbot-overlay');
    const closeTerminalBtn = document.getElementById('chatbot-close');
    const messagesContainer = document.getElementById('chatbot-messages');
    const inputField = document.getElementById('chatbot-input');

    // DOM — floating mascot
    const voiceMascot = document.getElementById('voice-mascot');
    const mascotClickArea = document.getElementById('mascot-click-area');
    const mascotFace = document.getElementById('mascot-face');
    const mascotWaves = document.getElementById('mascot-waves');
    const mascotStatus = document.getElementById('mascot-status');
    const mascotControls = document.getElementById('mascot-controls');
    const mascotMicBtn = document.getElementById('mascot-mic-btn');
    const mascotStopBtn = document.getElementById('mascot-stop-btn');
    const mascotActionDisplay = document.getElementById('mascot-action-display');

    let isOpen = false;
    let chatHistory = [];
    let voiceStarted = false;

    // Auto-start voice on first user interaction (browser requires gesture for mic + audio)
    let autoStartTriggered = false;
    const autoStartVoice = () => {
        if (autoStartTriggered) return;
        autoStartTriggered = true;
        document.removeEventListener('click', autoStartVoice);
        document.removeEventListener('touchstart', autoStartVoice);
        document.removeEventListener('keydown', autoStartVoice);
        startVoiceWithMic();
    };
    document.addEventListener('click', autoStartVoice);
    document.addEventListener('touchstart', autoStartVoice);
    document.addEventListener('keydown', autoStartVoice);

    // ===== Section tracking =====
    let currentSection = 'about';
    const sectionIds = ['about', 'experience', 'case-studies', 'projects', 'skills', 'github', 'contact'];

    const sectionObserver = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
                const id = entry.target.id;
                if (id && id !== currentSection) {
                    currentSection = id;
                    if (voiceWs && voiceWs.readyState === WebSocket.OPEN) {
                        voiceWs.send(JSON.stringify({ type: 'section_change', section: id }));
                    }
                }
            }
        }
    }, { threshold: [0.3, 0.6] });

    for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) sectionObserver.observe(el);
    }

    // ===== Hover tracking =====
    let lastHoverContext = '';
    let hoverDebounce = null;

    const getHoverContext = (el) => {
        if (!el || el === document.body || el === document.documentElement) return null;

        const projectCard = el.closest('.project-card, .work-item, .case-study-card');
        if (projectCard) {
            const title = projectCard.querySelector('.project-title, .work-title, .case-study-title, h3');
            const desc = projectCard.querySelector('.project-description, .work-description, p');
            if (title) {
                return {
                    type: 'card',
                    title: title.textContent.trim(),
                    description: desc ? desc.textContent.trim().slice(0, 120) : ''
                };
            }
        }

        const skillBadge = el.closest('.skill-item, .skill-badge, .skill-tag');
        if (skillBadge) {
            const name = skillBadge.querySelector('.skill-name, span') || skillBadge;
            return { type: 'skill', title: name.textContent.trim() };
        }

        const strengthCard = el.closest('.strength-card');
        if (strengthCard) {
            const h3 = strengthCard.querySelector('h3');
            if (h3) return { type: 'strength', title: h3.textContent.trim() };
        }

        const navLink = el.closest('.nav-link, .mobile-nav-link');
        if (navLink) {
            return { type: 'nav', title: navLink.textContent.trim() };
        }

        const link = el.closest('a.view-button, a.work-link');
        if (link) {
            return { type: 'link', title: link.textContent.trim(), href: link.href };
        }

        const sectionTitle = el.closest('.section-title');
        if (sectionTitle) {
            return { type: 'heading', title: sectionTitle.textContent.trim() };
        }

        return null;
    };

    document.addEventListener('mouseover', (e) => {
        if (!voiceStarted || !voiceWs || voiceWs.readyState !== WebSocket.OPEN) return;

        const ctx = getHoverContext(e.target);
        if (!ctx) return;

        const key = ctx.type + ':' + ctx.title;
        if (key === lastHoverContext) return;
        lastHoverContext = key;

        clearTimeout(hoverDebounce);
        hoverDebounce = setTimeout(() => {
            voiceWs.send(JSON.stringify({ type: 'hover', ...ctx }));
        }, 800);
    });

    // ===== VOICE: WebSocket =====
    let voiceWs = null;
    let micStream = null;
    let micAudioContext = null;
    let audioWorkletNode = null;
    let recorderWorkletLoaded = false;
    let isStreaming = false;
    let isMicOn = false;
    const RECORDER_WORKLET_NAME = 'pcm-recorder-processor';

    let playbackContext = null;
    let nextStartTime = 0;
    let shouldStopAudio = false;
    let pendingAudioSources = [];

    const floatTo16BitPCM = (f32) => {
        const buf = new ArrayBuffer(f32.length * 2);
        const v = new DataView(buf);
        for (let i = 0; i < f32.length; i++) {
            const s = Math.max(-1, Math.min(1, f32[i]));
            v.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
        }
        return new Uint8Array(buf);
    };

    const uint8ToBase64 = (u8) => {
        let b = '';
        for (let i = 0; i < u8.length; i++) b += String.fromCharCode(u8[i]);
        return btoa(b);
    };

    const ensureRecorderWorklet = async () => {
        if (!micAudioContext?.audioWorklet || recorderWorkletLoaded) return;
        const src = `
            class PCMRecorderProcessor extends AudioWorkletProcessor {
                process(inputs) {
                    const ch = inputs[0]?.[0];
                    if (ch?.length > 0) this.port.postMessage(ch.slice());
                    return true;
                }
            }
            registerProcessor('${RECORDER_WORKLET_NAME}', PCMRecorderProcessor);
        `;
        await micAudioContext.audioWorklet.addModule(
            URL.createObjectURL(new Blob([src], { type: 'application/javascript' }))
        );
        recorderWorkletLoaded = true;
    };

    const initMicrophone = async () => {
        if (micStream) return true;
        try {
            micStream = await navigator.mediaDevices.getUserMedia({
                audio: { channelCount: 1, sampleRate: 16000, echoCancellation: true, noiseSuppression: true, autoGainControl: true }
            });
            micAudioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
            return true;
        } catch (err) {
            console.error('Mic error:', err);
            return false;
        }
    };

    const setMascotState = (state) => {
        mascotWaves.className = 'mascot-face-waves ' + state;
        mascotFace.className = 'voice-mascot-face ' + state;
    };

    const connectVoiceWs = () => {
        return new Promise((resolve, reject) => {
            const proto = location.protocol === 'https:' ? 'wss' : 'ws';

            // Check if we are on localhost vs production 
            const isLocal = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
            let wsUrl = '';

            if (isLocal) {
                wsUrl = `${proto}://${location.host}/voice`;
            } else {
                // Adjust this URL to point to a valid WebSocket server 
                // If Vercel serverless functions don't support continuous WebSockets, 
                // you'll need a dedicated backend URL like Render/Railway here.
                // For now, defaulting to the same host but be aware of Vercel WS limits.
                wsUrl = `${proto}://${location.host}/voice`;
            }

            const ws = new WebSocket(wsUrl);

            ws.onopen = () => resolve(ws);

            ws.onmessage = (evt) => {
                let data;
                try { data = JSON.parse(evt.data); } catch { return; }

                if (data.event === 'session_open') {
                    setMascotState('idle');
                    mascotStatus.textContent = '';
                    ws.send(JSON.stringify({ type: 'greet', section: currentSection }));
                    if (startWithMic) {
                        startWithMic = false;
                        setTimeout(async () => {
                            isMicOn = true;
                            mascotMicBtn.classList.remove('muted');
                            mascotMicBtn.title = 'Turn off mic';
                            await startAudioStream();
                        }, 500);
                    }
                }

                if (data.event === 'interrupted') {
                    stopAllAudio();
                    setMascotState(isMicOn ? 'listening' : 'idle');
                    mascotStatus.textContent = isMicOn ? 'Listening...' : '';
                }

                if (data.inputTranscript) {
                    mascotStatus.textContent = `"${data.inputTranscript}"`;
                    chatHistory.push({ role: 'user', text: data.inputTranscript });
                }

                if (data.audio && !shouldStopAudio) {
                    setMascotState('speaking');
                    mascotStatus.textContent = 'Speaking...';
                    playAudioChunk(data.audio);
                }

                if (data.transcript) {
                    mascotStatus.textContent = data.transcript.length > 60
                        ? data.transcript.slice(0, 60) + '...'
                        : data.transcript;
                    chatHistory.push({ role: 'model', text: data.transcript });
                }

                if (data.event === 'search_result') {
                    showMascotAction('🔍', 'Searching...', data.sources?.[0] || '');
                    hideMascotAction(4000);
                }

                if (data.event === 'tool_call') handleToolCall(data);

                if (data.event === 'turn_complete') {
                    if (!mascotWaves.classList.contains('speaking')) {
                        setMascotState(isMicOn ? 'listening' : 'idle');
                    }
                }

                if (data.event === 'session_closed') {
                    handleSessionEnd();
                }

                if (data.error) {
                    console.error('[Voice] Error:', data.error);
                    mascotStatus.textContent = 'Connection issue';
                    setMascotState('idle');
                }

                if (chatHistory.length > 30) chatHistory = chatHistory.slice(-30);
            };

            ws.onclose = () => {
                if (voiceStarted) handleSessionEnd();
                voiceWs = null;
            };

            ws.onerror = (err) => reject(err);
        });
    };

    const handleSessionEnd = () => {
        voiceStarted = false;
        setMascotState('');
        mascotStatus.textContent = 'Tap to reconnect';
        mascotControls.style.display = 'none';
        stopAudioStream();
    };

    const handleToolCall = (data) => {
        const { tool, args } = data;
        if (tool === 'send_email') {
            showMascotAction('📧', 'Opening Email', args.subject || '');
            setTimeout(() => window.open(`mailto:avanish.patidar07@gmail.com?subject=${encodeURIComponent(args.subject || '')}&body=${encodeURIComponent(args.body || '')}`, '_blank'), 1500);
            hideMascotAction(4000);
        }
        if (tool === 'send_whatsapp') {
            showMascotAction('📱', 'Opening WhatsApp');
            setTimeout(() => {
                const ph = (args.phone || '+917697793284').replace(/\+/g, '');
                window.open(`https://wa.me/${ph}?text=${encodeURIComponent(args.message || '')}`, '_blank');
            }, 1500);
            hideMascotAction(4000);
        }
    };

    // ===== Mic streaming (buffered, no client-side interruption of own audio) =====
    let pcmBuffer = [];
    let pcmBufferLen = 0;
    let flushInterval = null;
    let aiSpeaking = false;
    const FLUSH_MS = 150;

    const flushAudioBuffer = () => {
        if (pcmBufferLen === 0 || !voiceWs || voiceWs.readyState !== WebSocket.OPEN) return;
        const combined = new Uint8Array(pcmBufferLen);
        let off = 0;
        for (const chunk of pcmBuffer) { combined.set(chunk, off); off += chunk.length; }
        pcmBuffer = [];
        pcmBufferLen = 0;
        voiceWs.send(JSON.stringify({ type: 'audio', data: uint8ToBase64(combined) }));
    };

    const onAudioChunk = (float32) => {
        if (!isStreaming) return;
        const pcm16 = floatTo16BitPCM(float32);
        pcmBuffer.push(pcm16);
        pcmBufferLen += pcm16.length;
    };

    const startAudioStream = async () => {
        if (isStreaming) return;
        const ok = await initMicrophone();
        if (!ok) { mascotStatus.textContent = 'Mic access denied'; return; }

        isStreaming = true;
        pcmBuffer = [];
        pcmBufferLen = 0;
        const source = micAudioContext.createMediaStreamSource(micStream);

        if (micAudioContext.audioWorklet) {
            await ensureRecorderWorklet();
            const wn = new AudioWorkletNode(micAudioContext, RECORDER_WORKLET_NAME, {
                numberOfInputs: 1, numberOfOutputs: 0, channelCount: 1
            });
            source.connect(wn);
            wn.port.onmessage = (e) => onAudioChunk(e.data);
            audioWorkletNode = wn;
        } else {
            const sn = micAudioContext.createScriptProcessor(4096, 1, 1);
            source.connect(sn);
            sn.connect(micAudioContext.destination);
            sn.onaudioprocess = (e) => onAudioChunk(e.inputBuffer.getChannelData(0));
            audioWorkletNode = sn;
        }

        flushInterval = setInterval(flushAudioBuffer, FLUSH_MS);
        setMascotState('listening');
        mascotStatus.textContent = 'Listening...';
    };

    const stopAudioStream = () => {
        isStreaming = false;
        if (flushInterval) { clearInterval(flushInterval); flushInterval = null; }
        flushAudioBuffer();
        pcmBuffer = [];
        pcmBufferLen = 0;
        if (audioWorkletNode) { try { audioWorkletNode.disconnect(); } catch { } audioWorkletNode = null; }
    };

    const toggleMic = async () => {
        if (!voiceWs || voiceWs.readyState !== WebSocket.OPEN) return;
        isMicOn = !isMicOn;
        mascotMicBtn.classList.toggle('muted', !isMicOn);
        mascotMicBtn.title = isMicOn ? 'Turn off mic' : 'Turn on mic';
        if (isMicOn) {
            await startAudioStream();
        } else {
            stopAudioStream();
            setMascotState('idle');
            mascotStatus.textContent = '';
        }
    };

    // ===== Audio playback =====
    const playAudioChunk = (b64) => {
        if (shouldStopAudio) return;
        if (!playbackContext) playbackContext = new (window.AudioContext || window.webkitAudioContext)();
        if (playbackContext.state === 'suspended') playbackContext.resume();

        try {
            const bin = atob(b64);
            const bytes = new Uint8Array(bin.length);
            for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
            const i16 = new Int16Array(bytes.buffer);
            const f32 = new Float32Array(i16.length);
            for (let i = 0; i < i16.length; i++) f32[i] = i16[i] / 32768.0;

            const buf = playbackContext.createBuffer(1, f32.length, 24000);
            buf.getChannelData(0).set(f32);
            const src = playbackContext.createBufferSource();
            src.buffer = buf;
            src.connect(playbackContext.destination);

            const now = playbackContext.currentTime;
            if (nextStartTime < now) nextStartTime = now;
            src.start(nextStartTime);
            nextStartTime += buf.duration;
            pendingAudioSources.push(src);
            aiSpeaking = true;

            src.onended = () => {
                const idx = pendingAudioSources.indexOf(src);
                if (idx > -1) pendingAudioSources.splice(idx, 1);
                if (pendingAudioSources.length === 0) {
                    aiSpeaking = false;
                    if (!shouldStopAudio && playbackContext.currentTime >= nextStartTime - 0.15) {
                        setMascotState(isMicOn ? 'listening' : 'idle');
                        mascotStatus.textContent = isMicOn ? 'Listening...' : '';
                    }
                }
            };
        } catch (e) {
            console.error('Playback error:', e);
        }
    };

    const stopAllAudio = () => {
        shouldStopAudio = true;
        aiSpeaking = false;
        for (const s of pendingAudioSources) { try { s.stop(); } catch { } }
        pendingAudioSources = [];
        if (playbackContext) nextStartTime = playbackContext.currentTime;
        setTimeout(() => { shouldStopAudio = false; }, 100);
    };

    // ===== Mascot action display =====
    const showMascotAction = (icon, text, sub = '') => {
        mascotActionDisplay.innerHTML = `<div class="mascot-action-card"><span class="mascot-action-icon">${icon}</span><span class="mascot-action-text">${text}</span>${sub ? `<span class="mascot-action-sub">${sub}</span>` : ''}</div>`;
        mascotActionDisplay.classList.add('active');
    };
    const hideMascotAction = (delay = 3000) => {
        setTimeout(() => mascotActionDisplay.classList.remove('active'), delay);
    };

    // ===== Start/stop voice =====
    let startWithMic = false;

    const startVoice = async (withMic = false) => {
        if (voiceStarted) return;
        voiceStarted = true;
        startWithMic = withMic;
        mascotStatus.textContent = 'Connecting...';
        setMascotState('connecting');
        mascotControls.style.display = 'flex';
        isMicOn = false;
        mascotMicBtn.classList.add('muted');
        shouldStopAudio = false;

        try {
            voiceWs = await connectVoiceWs();
        } catch (err) {
            mascotStatus.textContent = 'Failed to connect';
            voiceStarted = false;
            mascotControls.style.display = 'none';
            console.error('[Voice] Connection failed:', err);
        }
    };

    const startVoiceWithMic = () => startVoice(true);

    const stopVoice = () => {
        voiceStarted = false;
        isMicOn = false;
        stopAudioStream();
        stopAllAudio();
        mascotControls.style.display = 'none';
        setMascotState('');
        mascotStatus.textContent = 'Click to talk to Avanish';
        if (voiceWs) { voiceWs.close(); voiceWs = null; }
    };

    // ===== Mascot click: start voice or interrupt =====
    mascotFace.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!voiceStarted) {
            startVoiceWithMic();
        } else if (mascotWaves.classList.contains('speaking')) {
            stopAllAudio();
            setMascotState(isMicOn ? 'listening' : 'idle');
            mascotStatus.textContent = isMicOn ? 'Listening...' : 'Interrupted';
        }
    });

    mascotMicBtn.addEventListener('click', toggleMic);
    mascotStopBtn.addEventListener('click', stopVoice);

    // ===== Text chat =====
    const toggleChat = () => {
        isOpen = !isOpen;
        overlay.classList.toggle('active', isOpen);
        toggleBtn.classList.toggle('hidden', isOpen);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            inputField.focus();
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } else {
            document.body.style.overflow = '';
        }
    };

    overlay.addEventListener('click', (e) => { if (e.target === overlay) toggleChat(); });
    toggleBtn.addEventListener('click', toggleChat);
    if (heroChatBtn) heroChatBtn.addEventListener('click', (e) => { e.preventDefault(); toggleChat(); });
    closeTerminalBtn.addEventListener('click', toggleChat);

    const parseMarkdown = (text) => {
        return text
            .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
            .replace(/```([\s\S]*?)```/g, (m, code) => `<pre><code class="code-block">${code.trim()}</code></pre>`)
            .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
    };

    const addMessage = (text, sender) => {
        const div = document.createElement('div');
        div.className = `term-msg ${sender}`;
        const prefix = sender === 'user' ? 'visitor@avanish.dev:~$' : 'virtual-abp:';
        div.innerHTML = `<div class="msg-prefix">${prefix}</div><div class="msg-content">${parseMarkdown(text)}</div>`;
        messagesContainer.appendChild(div);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };

    const handleSend = async () => {
        const text = inputField.value.trim();
        if (!text) return;
        if (text.toLowerCase() === 'clear') {
            messagesContainer.innerHTML = `<div class="mascot-container"><div class="mascot-wave">👋</div><div class="intro-text">Hey, I'm Virtual ABP!</div><div class="intro-sub">Ask me anything about Avanish's projects, skills, or just say hi.</div></div>`;
            inputField.value = '';
            chatHistory = [];
            return;
        }
        addMessage(text, 'user');
        inputField.value = '';
        chatHistory.push({ role: 'user', text });

        const botDiv = document.createElement('div');
        botDiv.className = 'term-msg bot';
        botDiv.innerHTML = `<div class="msg-prefix">virtual-abp:<span class="typing-cursor">|</span></div><div class="msg-content"></div>`;
        messagesContainer.appendChild(botDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        const prefixDiv = botDiv.querySelector('.msg-prefix');
        const contentDiv = botDiv.querySelector('.msg-content');
        let fullText = '', displayedText = '', queue = [], typing = false;

        const typeWriter = async () => {
            if (typing) return;
            typing = true;
            while (queue.length > 0) {
                const n = Math.min(3, queue.length);
                for (let i = 0; i < n; i++) displayedText += queue.shift();
                let vis = displayedText.replace(/:::JSON[\s\S]*?:::/g, '').replace(/```json\s*\{[\s\S]*?"tool"[\s\S]*?\}[\s\S]*?```/gi, '');
                contentDiv.innerHTML = parseMarkdown(vis.trim()) + '<span class="typing-cursor">|</span>';
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
                await new Promise(r => setTimeout(r, 8));
            }
            prefixDiv.innerHTML = 'virtual-abp:';
            let fin = displayedText.replace(/:::JSON[\s\S]*?:::/g, '').replace(/```json\s*\{[\s\S]*?"tool"[\s\S]*?\}[\s\S]*?```/gi, '');
            contentDiv.innerHTML = parseMarkdown(fin.trim());
            typing = false;
        };

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text, history: chatHistory.slice(-10) })
            });
            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                for (const line of decoder.decode(value).split('\n')) {
                    if (!line.startsWith('data: ')) continue;
                    const d = line.slice(6);
                    if (d === '[DONE]') break;
                    try {
                        const data = JSON.parse(d);
                        if (data.text) {
                            fullText += data.text;
                            for (const ch of data.text) queue.push(ch);
                            if (!typing) typeWriter();
                        }
                    } catch { }
                }
            }
            while (queue.length > 0 || typing) await new Promise(r => setTimeout(r, 50));
            chatHistory.push({ role: 'model', text: fullText });

            let toolData = null;
            const m1 = fullText.match(/:::JSON\s*({[\s\S]*?})\s*:::/);
            if (m1) try { toolData = JSON.parse(m1[1]); } catch { }
            if (!toolData) { const m2 = fullText.match(/```json\s*({[\s\S]*?"tool"[\s\S]*?})\s*```/i); if (m2) try { toolData = JSON.parse(m2[1]); } catch { } }
            if (!toolData) { const m3 = fullText.match(/\{[^{}]*"tool"\s*:\s*"(send_email|send_whatsapp)"[^{}]*\}/); if (m3) try { toolData = JSON.parse(m3[0]); } catch { } }

            if (toolData?.tool === 'send_email') {
                const link = `mailto:avanish.patidar07@gmail.com?subject=${encodeURIComponent(toolData.subject || '')}&body=${encodeURIComponent(toolData.body || '')}`;
                const a = document.createElement('div'); a.className = 'term-msg bot';
                a.innerHTML = `<div class="msg-prefix">system:</div><div class="msg-content">📧 Opening email... <a href="${link}" target="_blank">[Click if not opened]</a></div>`;
                messagesContainer.appendChild(a);
                setTimeout(() => window.open(link, '_blank'), 500);
            }
            if (toolData?.tool === 'send_whatsapp') {
                const ph = (toolData.phone || '+917697793284').replace(/\+/g, '');
                const link = `https://wa.me/${ph}?text=${encodeURIComponent(toolData.message || '')}`;
                const a = document.createElement('div'); a.className = 'term-msg bot';
                a.innerHTML = `<div class="msg-prefix">system:</div><div class="msg-content">📱 Opening WhatsApp... <a href="${link}" target="_blank">[Click if not opened]</a></div>`;
                messagesContainer.appendChild(a);
                setTimeout(() => window.open(link, '_blank'), 500);
            }
        } catch (error) {
            contentDiv.textContent = 'Error: Connection failed. Please try again.';
            console.error('Chat Error:', error);
        }
    };

    inputField.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSend(); });
    document.querySelector('.chatbot-terminal').addEventListener('click', () => inputField.focus());
});
