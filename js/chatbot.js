
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
            <div class="chatbot-terminal">
                <!-- Header -->
                <div class="terminal-header">
                    <div class="terminal-title">virtual-abp -- -zsh -- 80x24</div>
                    <button id="chatbot-close" class="close-terminal">[x] close</button>
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
    const closeBtn = document.getElementById('chatbot-close');
    const messagesContainer = document.getElementById('chatbot-messages');
    const inputField = document.getElementById('chatbot-input');

    // State
    let isOpen = false;
    let chatHistory = []; 

    // Toggle Chat
    const toggleChat = () => {
        isOpen = !isOpen;
        overlay.classList.toggle('active', isOpen);
        toggleBtn.classList.toggle('hidden', isOpen);
        
        // Toggle Body Scroll
        if (isOpen) {
            document.body.style.overflow = 'hidden'; // Disable scroll
            inputField.focus();
            // Scroll to bottom on open
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } else {
            document.body.style.overflow = ''; // Enable scroll
        }
    };

    // Close on overlay click
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
    closeBtn.addEventListener('click', toggleChat);

    // Simple Markdown Parser
    const parseMarkdown = (text) => {
        let html = text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
        return html;
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
            return;
        }

        // 1. Add User Message
        addMessage(text, 'user');
        inputField.value = '';
        chatHistory.push({ role: 'user', text: text });

        // 2. Create Bot Message Placeholder
        const botMsgDiv = document.createElement('div');
        botMsgDiv.className = `term-msg bot`;
        botMsgDiv.innerHTML = `<div class="msg-prefix">virtual-abp:</div><div class="msg-content"></div>`;
        messagesContainer.appendChild(botMsgDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        const contentDiv = botMsgDiv.querySelector('.msg-content');
        let fullText = "";

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
                                
                                // Hide tool calls
                                const jsonIndex = fullText.indexOf(':::JSON');
                                let displayText = fullText;
                                if (jsonIndex !== -1) {
                                    displayText = fullText.substring(0, jsonIndex);
                                }
                                
                                contentDiv.innerHTML = parseMarkdown(displayText);
                                messagesContainer.scrollTop = messagesContainer.scrollHeight;
                            }
                        } catch (e) {
                            console.error("Error parsing stream", e);
                        }
                    }
                }
            }

            chatHistory.push({ role: 'model', text: fullText });

            // Handle Tool Call (Email)
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
                } catch (e) {
                    console.error("Error parsing tool JSON", e);
                }
            }

        } catch (error) {
            contentDiv.textContent = "Error: Connection failed.";
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
