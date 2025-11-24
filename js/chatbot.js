
document.addEventListener('DOMContentLoaded', () => {
    // Inject Chatbot HTML (Terminal Overlay Design)
    const chatbotContainer = document.createElement('div');
    chatbotContainer.id = 'ai-chatbot-container';
    chatbotContainer.innerHTML = `
        <!-- 1. Trigger Button (Styled like CTAs) -->
        <div id="chatbot-toggle" class="cta-btn cta-ask-abp">
            <div class="cta-icon">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
                </svg>
            </div>
            <span class="cta-text">Ask ABP</span>
        </div>

        <!-- 2. Full Screen Overlay -->
        <div id="chatbot-overlay" class="chatbot-overlay">
            
            <!-- Voice Interface -->
            <div id="chatbot-voice-interface" class="chatbot-voice-interface hidden">
                <div class="voice-container">
                    <div class="voice-header">
                        <div class="voice-title">Virtual ABP • Live</div>
                        <div class="voice-controls">
                            <button id="btn-switch-to-text" class="switch-mode-btn">
                                <span class="icon">💬</span> Text Mode
                            </button>
                            <button id="voice-close" class="close-terminal">[x] end</button>
                        </div>
                    </div>
                    <div class="voice-visualizer">
                        <div class="voice-circle"></div>
                        <div class="voice-waves">
                            <span></span><span></span><span></span><span></span><span></span>
                        </div>
                    </div>
                    <div id="voice-status" class="voice-status">Listening...</div>
                    <div id="voice-action-display" class="voice-action-display"></div>
                    <div id="voice-transcript" class="voice-transcript"></div>
                </div>
            </div>

            <!-- Terminal Interface -->
            <div id="chatbot-terminal" class="chatbot-terminal">
                <!-- Header -->
                <div class="terminal-header">
                    <div class="terminal-title">virtual-abp -- -zsh -- 80x24</div>
                    <div class="terminal-controls">
                        <button id="btn-switch-to-voice" class="switch-mode-btn">
                            <span class="icon">🎙️</span> Live Mode
                        </button>
                        <button id="chatbot-close" class="close-terminal">[x] close</button>
                    </div>
                </div>

                <!-- Messages Area -->
                <div id="chatbot-messages" class="terminal-messages">
                    <!-- Initial Mascot & Greeting -->
                    <div class="mascot-container">
                        <div class="mascot-wave">👋</div>
                        <div class="intro-text">Hey, I'm Virtual ABP!</div>
                        <div class="intro-sub">Ask me anything about Avanish's projects, skills, or just say hi.</div>
                    </div>
                </div>

                <!-- Input Area -->
                <div class="terminal-input-area">
                    <span class="prompt-label">visitor@avanish.dev:~$</span>
                    <input type="text" id="chatbot-input" class="terminal-input" autocomplete="off" spellcheck="false" />
                    <div class="terminal-cursor"></div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(chatbotContainer);

    // DOM Elements
    const toggleBtn = document.getElementById('chatbot-toggle');
    const heroChatBtn = document.getElementById('hero-chat-btn');
    const overlay = document.getElementById('chatbot-overlay');
    
    // Screens
    const terminalInterface = document.getElementById('chatbot-terminal');
    const voiceInterface = document.getElementById('chatbot-voice-interface');

    // Buttons
    const btnSwitchToVoice = document.getElementById('btn-switch-to-voice');
    const btnSwitchToText = document.getElementById('btn-switch-to-text');
    const closeTerminalBtn = document.getElementById('chatbot-close');
    const closeVoiceBtn = document.getElementById('voice-close');

    // Terminal Elements
    const messagesContainer = document.getElementById('chatbot-messages');
    const inputField = document.getElementById('chatbot-input');

    // Voice Elements
    const voiceStatus = document.getElementById('voice-status');
    const voiceTranscript = document.getElementById('voice-transcript');
    const voiceWaves = document.querySelector('.voice-waves');

    // State
    let isOpen = false;
    let chatHistory = []; 
    let isVoiceActive = false;
    let recognition = null;
    let synthesis = window.speechSynthesis;

    // Initialize Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = false; // We want turn-taking
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            voiceStatus.textContent = "Listening...";
            voiceWaves.classList.add('active');
        };

        recognition.onend = () => {
            if (isVoiceActive && voiceStatus.textContent !== "Speaking...") {
                // If we are still in voice mode and not speaking, start listening again
                // But wait a bit to avoid loops
                // setTimeout(() => { if(isVoiceActive) recognition.start(); }, 1000);
                voiceStatus.textContent = "Tap to speak";
                voiceWaves.classList.remove('active');
            }
        };

        recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }

            if (interimTranscript) {
                voiceTranscript.textContent = interimTranscript;
            }

            if (finalTranscript) {
                voiceTranscript.textContent = finalTranscript;
                handleVoiceInput(finalTranscript);
            }
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error);
            voiceStatus.textContent = "Error: " + event.error;
            voiceWaves.classList.remove('active');
        };
    } else {
        console.warn("Speech Recognition not supported");
        if(btnSwitchToVoice) {
            btnSwitchToVoice.style.display = 'none'; // Hide if not supported
        }
    }

    // Toggle Chat Overlay
    const toggleChat = () => {
        isOpen = !isOpen;
        overlay.classList.toggle('active', isOpen);
        toggleBtn.classList.toggle('hidden', isOpen);
        
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            // Default to text chat
            startTextChat();
        } else {
            document.body.style.overflow = '';
            stopVoiceMode();
        }
    };

    const startTextChat = () => {
        terminalInterface.classList.remove('hidden');
        voiceInterface.classList.add('hidden');
        inputField.focus();
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        stopVoiceMode();
    };

    const startVoiceMode = () => {
        terminalInterface.classList.add('hidden');
        voiceInterface.classList.remove('hidden');
        isVoiceActive = true;
        
        // Start listening
        if (recognition) {
            try {
                recognition.start();
            } catch (e) {
                console.error("Could not start recognition", e);
            }
        } else {
            voiceStatus.textContent = "Voice not supported in this browser.";
        }
    };

    const stopVoiceMode = () => {
        isVoiceActive = false;
        if (recognition) recognition.stop();
        if (synthesis) synthesis.cancel();
        voiceWaves.classList.remove('active');
    };

    // Event Listeners
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            toggleChat();
        }
    });

    toggleBtn.addEventListener('click', toggleChat);
    if (heroChatBtn) {
        heroChatBtn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleChat();
        });
    }
    
    closeTerminalBtn.addEventListener('click', toggleChat);
    closeVoiceBtn.addEventListener('click', toggleChat);

    btnSwitchToVoice.addEventListener('click', startVoiceMode);
    btnSwitchToText.addEventListener('click', startTextChat);

    // Voice Interaction Logic
    let voices = [];
    
    const loadVoices = () => {
        voices = synthesis.getVoices();
    };

    if (synthesis.onvoiceschanged !== undefined) {
        synthesis.onvoiceschanged = loadVoices;
    }
    loadVoices();

    // Audio Context for Native Audio
    let audioContext;
    let nextStartTime = 0;

    const playAudioChunk = (base64Audio) => {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }

        const binaryString = window.atob(base64Audio);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        
        const int16Array = new Int16Array(bytes.buffer);
        const float32Array = new Float32Array(int16Array.length);
        for (let i = 0; i < int16Array.length; i++) {
            float32Array[i] = int16Array[i] / 32768.0;
        }

        const buffer = audioContext.createBuffer(1, float32Array.length, 24000);
        buffer.getChannelData(0).set(float32Array);

        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContext.destination);

        const currentTime = audioContext.currentTime;
        if (nextStartTime < currentTime) {
            nextStartTime = currentTime;
        }
        
        source.start(nextStartTime);
        nextStartTime += buffer.duration;
        
        voiceWaves.classList.remove('processing');
        voiceWaves.classList.add('speaking');
        
        // Reset visualizer after this chunk plays
        source.onended = () => {
             if (audioContext.currentTime >= nextStartTime - 0.1) {
                 voiceWaves.classList.remove('speaking');
                 voiceWaves.classList.add('active');
                 // Resume listening if needed
                 if (isVoiceActive && recognition) {
                     try { recognition.start(); } catch(e){}
                 }
             }
        };
    };

    const handleVoiceInput = async (text) => {
        if (!text) return;
        
        // Stop listening while processing
        recognition.stop();
        voiceStatus.textContent = "Thinking...";
        voiceWaves.classList.add('processing'); // Different animation for thinking?

        try {
            // Reuse the same API endpoint
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    history: chatHistory.slice(-10),
                    mode: 'voice' // Indicate voice mode
                })
            });

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullText = "";
            let hasReceivedAudio = false;

            // Reset audio timing
            if (audioContext) {
                nextStartTime = audioContext.currentTime;
            }

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');
                
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const dataStr = line.slice(6);
                        if (dataStr === '[DONE]') break;
                        try {
                            const data = JSON.parse(dataStr);
                            
                            // Handle Native Audio
                            if (data.audio) {
                                hasReceivedAudio = true;
                                playAudioChunk(data.audio);
                            }
                            
                            // Handle Text (Transcription or Text Response)
                            if (data.text) {
                                fullText += data.text;
                                // Hide tool calls from transcript
                                const cleanText = fullText.replace(/:::JSON[\s\S]*?:::/g, '').trim();
                                if (cleanText) {
                                    voiceTranscript.textContent = cleanText;
                                }
                            }
                        } catch (e) {}
                    }
                }
            }

            // Add to history
            chatHistory.push({ role: 'user', text: text });
            chatHistory.push({ role: 'model', text: fullText });

            // Handle Tool Calls (Email & WhatsApp)
            const jsonMatch = fullText.match(/:::JSON\s*({[\s\S]*?})\s*:::/);
            if (jsonMatch) {
                try {
                    const toolData = JSON.parse(jsonMatch[1]);
                    const actionDisplay = document.getElementById('voice-action-display');
                    
                    if (actionDisplay) {
                        actionDisplay.innerHTML = `
                            <div class="action-card">
                                <div class="action-icon">${toolData.tool === 'send_whatsapp' ? '📱' : '📧'}</div>
                                <div class="action-text">Opening ${toolData.tool === 'send_whatsapp' ? 'WhatsApp' : 'Email'}...</div>
                            </div>
                        `;
                        actionDisplay.classList.add('active');
                        
                        // Hide after a few seconds
                        setTimeout(() => {
                            actionDisplay.classList.remove('active');
                        }, 3000);
                    }

                    setTimeout(() => {
                        if (toolData.tool === 'send_email') {
                            const { subject, body } = toolData;
                            const mailtoLink = `mailto:avanish.patidar07@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                            window.open(mailtoLink, '_blank');
                        }
                        if (toolData.tool === 'send_whatsapp') {
                            const { phone, message } = toolData;
                            const whatsappLink = `https://wa.me/${phone.replace(/\+/g, '')}?text=${encodeURIComponent(message)}`;
                            window.open(whatsappLink, '_blank');
                        }
                    }, 1000);
                } catch (e) {
                    console.error("Error parsing tool JSON", e);
                }
            }

            // Speak the response ONLY if we didn't get native audio
            if (!hasReceivedAudio) {
                speakResponse(fullText);
            } else {
                // If we did get audio, just ensure visualizer resets eventually
                voiceStatus.textContent = "Listening...";
            }

        } catch (error) {
            console.error('Voice Chat Error:', error);
            voiceStatus.textContent = "Error. Tap to retry.";
            voiceWaves.classList.remove('processing');
        }
    };

    const speakResponse = (text) => {
        if (!synthesis) return;

        // Clean text for speech (remove markdown, code blocks, emojis)
        const speechText = text
            .replace(/```[\s\S]*?```/g, "I've provided some code in the chat.")
            .replace(/`[^`]+`/g, "code")
            .replace(/\*\*/g, "")
            .replace(/:::JSON[\s\S]*?:::/g, "") // Remove tool calls
            .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, ""); // Remove emojis

        const utterance = new SpeechSynthesisUtterance(speechText);
        
        // Ensure voices are loaded
        if (voices.length === 0) {
            voices = synthesis.getVoices();
        }

        // Simple Male Voice Selection (Removed hardcoded lists)
        // Just try to find a voice that sounds male or is the default
        const preferredVoice = voices.find(v => 
            v.name.includes('Male') || v.name.includes('David') || v.name.includes('Google US English')
        );

        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }
        
        // Adjust for happy/energetic persona
        utterance.pitch = 1.0; 
        utterance.rate = 1.1;

        utterance.onstart = () => {
            voiceStatus.textContent = "Speaking...";
            voiceWaves.classList.remove('processing');
            voiceWaves.classList.add('speaking');
            voiceTranscript.textContent = text; // Show what is being said
        };

        utterance.onend = () => {
            voiceStatus.textContent = "Listening...";
            voiceWaves.classList.remove('speaking');
            voiceWaves.classList.add('active');
            if (isVoiceActive) {
                recognition.start();
            }
        };

        synthesis.speak(utterance);
    };

    // Enhanced Markdown Parser with Code Syntax Highlighting
    const parseMarkdown = (text) => {
        let html = text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            // Code blocks with syntax highlighting
            .replace(/```([\s\S]*?)```/g, (match, code) => {
                return `<pre><code class="code-block">${code.trim()}</code></pre>`;
            })
            // Inline code
            .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
        return html;
    };

    // Show typing indicator
    const showTypingIndicator = () => {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'term-msg bot typing-indicator';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="msg-prefix">virtual-abp:</div>
            <div class="msg-content">
                <span class="typing-cursor">|</span>
            </div>
        `;
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        return typingDiv;
    };

    // Remove typing indicator
    const removeTypingIndicator = () => {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.remove();
    };

    // Add Message to Terminal
    const addMessage = (text, sender) => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `term-msg ${sender}`;
        
        const prefix = sender === 'user' ? 'visitor@avanish.dev:~$' : 'virtual-abp:';
        const prefixSpan = `<div class="msg-prefix">${prefix}</div>`;
        const contentSpan = `<div class="msg-content">${parseMarkdown(text)}</div>`;
        
        msgDiv.innerHTML = prefixSpan + contentSpan;
        messagesContainer.appendChild(msgDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        return msgDiv;
    };

    // Handle Send
    const handleSend = async () => {
        const text = inputField.value.trim();
        if (!text) return;

        // Handle Terminal Commands
        if (text.toLowerCase() === 'clear') {
            messagesContainer.innerHTML = `
                <div class="mascot-container">
                    <div class="mascot-wave">👋</div>
                    <div class="intro-text">Hey, I'm Virtual ABP!</div>
                    <div class="intro-sub">Ask me anything about Avanish's projects, skills, or just say hi.</div>
                </div>
            `;
            inputField.value = '';
            chatHistory = [];
            return;
        }

        // 1. Add User Message
        addMessage(text, 'user');
        inputField.value = '';
        chatHistory.push({ role: 'user', text: text });

        // 2. Create Bot Message Placeholder with blinking cursor
        const botMsgDiv = document.createElement('div');
        botMsgDiv.className = `term-msg bot`;
        botMsgDiv.innerHTML = `<div class="msg-prefix">virtual-abp:<span class="typing-cursor">|</span></div><div class="msg-content"></div>`;
        messagesContainer.appendChild(botMsgDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        const prefixDiv = botMsgDiv.querySelector('.msg-prefix');
        const contentDiv = botMsgDiv.querySelector('.msg-content');
        let fullText = "";
        let displayedText = "";
        let typewriterQueue = [];
        let isTyping = false;

        // Typewriter effect function
        const typeWriter = async () => {
            if (isTyping) return;
            isTyping = true;
            
            while (typewriterQueue.length > 0) {
                const char = typewriterQueue.shift();
                displayedText += char;
                
                // Hide tool calls
                const jsonIndex = displayedText.indexOf(':::JSON');
                let visibleText = displayedText;
                if (jsonIndex !== -1) {
                    visibleText = displayedText.substring(0, jsonIndex);
                }
                
                contentDiv.innerHTML = parseMarkdown(visibleText) + '<span class="typing-cursor">|</span>';
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
                
                // Variable speed: faster for spaces, slower for other chars
                const delay = char === ' ' ? 10 : (char === '\n' ? 20 : 25);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
            
            // Remove cursor from prefix and content when done
            prefixDiv.innerHTML = 'virtual-abp:';
            const jsonIndex = displayedText.indexOf(':::JSON');
            let finalText = displayedText;
            if (jsonIndex !== -1) {
                finalText = displayedText.substring(0, jsonIndex);
            }
            contentDiv.innerHTML = parseMarkdown(finalText);
            
            isTyping = false;
        };

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    history: chatHistory.slice(-10)
                })
            });

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');
                
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const dataStr = line.slice(6);
                        if (dataStr === '[DONE]') break;
                        
                        try {
                            const data = JSON.parse(dataStr);
                            if (data.text) {
                                fullText += data.text;
                                
                                // Add new characters to typewriter queue
                                for (let char of data.text) {
                                    typewriterQueue.push(char);
                                }
                                
                                // Start typewriter if not already running
                                if (!isTyping) {
                                    typeWriter();
                                }
                            }
                        } catch (e) {
                            console.error("Error parsing stream", e);
                        }
                    }
                }
            }
            
            // Wait for typewriter to finish
            while (typewriterQueue.length > 0 || isTyping) {
                await new Promise(resolve => setTimeout(resolve, 50));
            }

            chatHistory.push({ role: 'model', text: fullText });

            // Handle Tool Calls (Email & WhatsApp)
            const jsonMatch = fullText.match(/:::JSON\s*({[\s\S]*?})\s*:::/);
            if (jsonMatch) {
                try {
                    const toolData = JSON.parse(jsonMatch[1]);
                    
                    if (toolData.tool === 'send_email') {
                        const { subject, body } = toolData;
                        const mailtoLink = `mailto:avanish.patidar07@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                        
                        const actionDiv = document.createElement('div');
                        actionDiv.className = 'term-msg bot';
                        actionDiv.innerHTML = `<div class="msg-prefix">system:</div><div class="msg-content">Opening email client... <a href="${mailtoLink}" target="_blank">[Click here if it didn't open]</a></div>`;
                        messagesContainer.appendChild(actionDiv);
                        messagesContainer.scrollTop = messagesContainer.scrollHeight;
                        
                        window.open(mailtoLink, '_blank');
                    }
                    
                    if (toolData.tool === 'send_whatsapp') {
                        const { phone, message } = toolData;
                        const whatsappLink = `https://wa.me/${phone.replace(/\+/g, '')}?text=${encodeURIComponent(message)}`;
                        
                        const actionDiv = document.createElement('div');
                        actionDiv.className = 'term-msg bot';
                        actionDiv.innerHTML = `<div class="msg-prefix">system:</div><div class="msg-content">Opening WhatsApp... <a href="${whatsappLink}" target="_blank">[Click here if it didn't open]</a></div>`;
                        messagesContainer.appendChild(actionDiv);
                        messagesContainer.scrollTop = messagesContainer.scrollHeight;
                        
                        window.open(whatsappLink, '_blank');
                    }
                } catch (e) {
                    console.error("Error parsing tool JSON", e);
                }
            }

        } catch (error) {
            removeTypingIndicator();
            contentDiv.textContent = "Error: Connection failed. Please try again.";
            console.error('Chat Error:', error);
        }
    };

    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });
    
    // Focus input on click anywhere in terminal
    document.querySelector('.chatbot-terminal').addEventListener('click', () => {
        inputField.focus();
    });
});
