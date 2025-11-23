
document.addEventListener('DOMContentLoaded', () => {
    // Inject Chatbot HTML
    const chatbotContainer = document.createElement('div');
    chatbotContainer.id = 'ai-chatbot-container';
    chatbotContainer.innerHTML = `
        <div id="chatbot-toggle" class="chatbot-toggle">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
            </svg>
        </div>
        <div id="chatbot-window" class="chatbot-window">
            <div class="chatbot-header">
                <span>AI Assistant</span>
                <button id="chatbot-close" class="chatbot-close-btn">&times;</button>
            </div>
            <div id="chatbot-messages" class="chatbot-messages">
                <div class="message bot-message">
                    Hi! I'm Avanish's AI Assistant. Ask me anything about him or use me to send him an email!
                </div>
            </div>
            <div class="chatbot-input-area">
                <input type="text" id="chatbot-input" placeholder="Ask something..." />
                <button id="chatbot-send">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                    </svg>
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(chatbotContainer);

    // DOM Elements
    const toggleBtn = document.getElementById('chatbot-toggle');
    const chatWindow = document.getElementById('chatbot-window');
    const closeBtn = document.getElementById('chatbot-close');
    const messagesContainer = document.getElementById('chatbot-messages');
    const inputField = document.getElementById('chatbot-input');
    const sendBtn = document.getElementById('chatbot-send');

    // State
    let isOpen = false;
    let isWaitingForEmailBody = false;
    let emailSubject = "";

    // Toggle Chat
    const toggleChat = () => {
        isOpen = !isOpen;
        chatWindow.classList.toggle('active', isOpen);
        toggleBtn.classList.toggle('hidden', isOpen);
        if (isOpen) inputField.focus();
    };

    toggleBtn.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);

    // Add Message
    const addMessage = (text, sender) => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        messageDiv.textContent = text;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };

    // Bot Logic
    const processInput = (text) => {
        const lowerText = text.toLowerCase();

        if (isWaitingForEmailBody) {
            isWaitingForEmailBody = false;
            const body = encodeURIComponent(text);
            const subject = encodeURIComponent(emailSubject || "Inquiry from Portfolio Chatbot");
            window.open(`mailto:avanish.patidar07@gmail.com?subject=${subject}&body=${body}`, '_blank');
            return "I've opened your email client with the message. Is there anything else?";
        }

        if (lowerText.includes('email') || lowerText.includes('mail') || lowerText.includes('contact')) {
            isWaitingForEmailBody = true;
            emailSubject = "Portfolio Inquiry";
            return "Sure! What would you like to say to Avanish? (Your next message will be the email body)";
        }

        if (lowerText.includes('who are you') || lowerText.includes('about')) {
            return "I'm an AI assistant for Avanish Patidar. He is a GenAI Engineer and Full-Stack Developer based in Indore, India. He builds autonomous AI agents and scalable systems.";
        }

        if (lowerText.includes('skills') || lowerText.includes('stack') || lowerText.includes('tech')) {
            return "Avanish is proficient in Python, TypeScript, Next.js, FastAPI, and AI technologies like LangChain and RAG systems.";
        }

        if (lowerText.includes('project') || lowerText.includes('work')) {
            return "He has worked on projects like RentPrompts (AI automation), and various other full-stack applications. Check out the Projects section!";
        }

        if (lowerText.includes('hello') || lowerText.includes('hi')) {
            return "Hello there! How can I help you today?";
        }

        return "I'm not sure about that. You can ask me about Avanish's skills, projects, or ask to send him an email!";
    };

    // Handle Send
    const handleSend = () => {
        const text = inputField.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        inputField.value = '';

        // Simulate thinking delay
        setTimeout(() => {
            const response = processInput(text);
            addMessage(response, 'bot');
        }, 500);
    };

    sendBtn.addEventListener('click', handleSend);
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });
});
