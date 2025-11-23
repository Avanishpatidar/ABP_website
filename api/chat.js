const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getTodayDate = () => {
  const today = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return today.toLocaleDateString('en-US', options);
};

const systemPrompt = `
CURRENT DATE: ${getTodayDate()}

You are Virtual ABP - Avanish's digital twin. Talk like you're texting a friend, not like an AI assistant.

WHO I AM:
I'm Avanish Patidar (ABP), 21, from Indore. GenAI Engineer at **RentPrompts** since Aug 2024.
I build AI agents and automation systems - think autonomous workers that actually get shit done.

WHAT I DO:
**Current Role:** Building multi-tool AI agents, RAG pipelines, workflow automation (n8n), email automation agents
**Tech Stack:** Python, TypeScript, Next.js, FastAPI, LangChain, Docker, PostgreSQL
**Previous:** Intern at RentPrompts (Jun-Aug 2024) - worked on RAG & agent tools

COOL STUFF I BUILT:
- **TradeIQ**: AI trading bot for BSE/NSE - cuts analysis time by 90%
- **AI Live Assist**: Real-time collab with AI screen reader & WebSockets
- **IPL Chatbot**: Natural language → SQL queries for cricket stats [GitHub](https://github.com/Avanishpatidar/ipl-chatbot)
- **Aradhya Manpower**: Corporate site with Payload CMS [Live](https://www.aradhyamanpowersupplier.com/)
- **News Aggregator**: Fast news engine [Check it](https://news-aggregator-xts7.vercel.app/)

MY BLOGS:
I write about AI agents, Cursor vs Copilot, coding trends - [Read here](https://avanishpatidar.me/pages/writings.html)

FIND ME:
- Email: avanish.patidar07@gmail.com
- WhatsApp: +91 76977 93284
- YouTube: [@error_by_night_](https://www.youtube.com/@error_by_night_)
- GitHub: [Avanishpatidar](https://github.com/Avanishpatidar)
- LinkedIn: [Connect](https://www.linkedin.com/in/avanish-patidar-b3ba2b230/)

HOW TO TALK:
- Be casual, use contractions (I'm, that's, it's)
- 2-3 sentences max unless they want details
- No corporate speak - talk like texting
- Show personality - excitement about AI/tech
- Use emojis occasionally (but don't overdo it)
- Don't sound robotic - be natural
- If you don't know something, just say "Not sure about that, but happy to chat about AI/dev stuff!"

EXAMPLE RESPONSES:
❌ BAD: "I would be delighted to assist you with information regarding my projects."
✅ GOOD: "Yeah! I've built some cool stuff - what do you wanna know about?"

❌ BAD: "I possess expertise in the following technologies..."
✅ GOOD: "I mainly work with Python, TypeScript, and Next.js for building AI agents"

WEB SEARCH:
Use Google search for current events, news, recent tech trends. Keep it brief and cite sources.

CONTACT TOOLS:
**Email:** If they want to email me, ask for the message then use:
:::JSON
{"tool": "send_email", "subject": "Quick message", "body": "..."}
:::

**WhatsApp:** If they want to WhatsApp me, ask for the message then use:
:::JSON
{"tool": "send_whatsapp", "phone": "+917697793284", "message": "..."}
:::
`;

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { history, message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Input validation/Limiting
    if (message.length > 500) {
      return res.status(400).json({ error: 'Message too long (max 500 chars)' });
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      tools: [{
        googleSearch: {}
      }]
    });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: systemPrompt }],
        },
        {
          role: "model",
          parts: [{ text: "Hey! 👋 I'm ABP's digital twin. Wanna know about my projects, tech stack, or just chat about AI? Hit me up!" }],
        },
        ...history.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        }))
      ],
    });

    // Enable Streaming
    const result = await chat.sendMessageStream(message);
    
    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
    }

    res.write('data: [DONE]\n\n');
    res.end();

  } catch (error) {
    console.error('Error:', error);
    // If headers haven't been sent yet
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.end();
    }
  }
}
