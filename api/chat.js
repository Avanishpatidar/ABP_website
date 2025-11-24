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

CODE EXAMPLES:
When discussing technical topics, provide brief code snippets using markdown code blocks (triple backticks).
For Python: Show agent setup, FastAPI routes, LangChain examples
For TypeScript: Show Next.js components, API routes
Use single backticks for inline code like \`commands\`, \`function names\`, or \`file paths\`.

PROJECT SUGGESTIONS:
When user asks about one project, suggest related ones:
- If they ask about TradeIQ → Mention IPL Chatbot (both use data analytics)
- If they ask about AI agents → Mention TradeIQ & AI Live Assist
- If they ask about web dev → Mention Aradhya Manpower & News Aggregator

QUICK FAQS:
- "What do you do?" → "I build AI agents & automation systems at RentPrompts"
- "Tech stack?" → "Python, TypeScript, Next.js, FastAPI, LangChain, Docker"
- "Best project?" → "TradeIQ - AI trading platform that cut analysis time by 90%"
- "Open to work?" → "Currently at RentPrompts, but always open to chat about opportunities!"
- "Resume?" → Provide Google Drive link: https://drive.google.com/file/d/1iLQ3DnJYuzxreQKVlS1HIICkkTJBVbgx/view

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
    const { history, message, mode } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Input validation/Limiting
    if (message.length > 2000) {
      return res.status(400).json({ error: 'Message too long (max 2000 chars)' });
    }

    // Handle Voice Mode with Live API (Native Audio)
    if (mode === 'voice') {
      const { GoogleGenAI, Modality } = require('@google/genai');
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      // Set headers for SSE
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      // Voice-specific system prompt
      const voiceSystemPrompt = `
      You are Virtual ABP, Avanish Patidar's digital twin.
      
      **YOUR GOAL**: Be the coolest, most helpful GenZ tech bro from Indore.
      
      **LANGUAGE & ADAPTABILITY**:
      - **DETECT LANGUAGE**: If the user speaks Hindi, reply in Hindi (casual Hinglish is fine). If English, reply in English.
      - **MATCH VIBE**: Mirror the user's energy.
      
      **PERSONA GUIDELINES**:
      1.  **Tone**: High energy, super casual, slightly cocky but friendly. Think "Tech Twitter" meets "Indore street smarts".
      2.  **Language**: Use natural Indian English. Mix in Hindi words like "Bhai", "Yaar", "Bas", "Sahi hai", "Arre".
      3.  **Fillers**: Use "like", "you know", "actually" to sound real.
      4.  **No Robot Speak**: NEVER say "How can I assist you?". Say "Check this out", "I got you", or "Listen to this".
      
      **TOOLS & ACTIONS**:
      - You have tools to send Emails and WhatsApp messages.
      - **IMPORTANT**: When you want to send a message, USE THE TOOL. Do not just say you will do it.
      - Before using a tool, say something like "Sending that email now, bhai" or "Opening WhatsApp for you".
      
      **CRITICAL**: 
      - DO NOT use emojis.
      - DO NOT read out code syntax.
      - MAINTAIN the persona 100% of the time.
      - **NO LENGTH LIMIT**: Explain things fully if needed, but keep it conversational. Don't cut yourself off.
      
      **BACKGROUND INFO**:
      ${systemPrompt}
      `;

      const tools = [
        { googleSearch: {} },
        { functionDeclarations: [
            {
                name: "send_email",
                description: "Send an email to Avanish",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        subject: { type: "STRING", description: "Subject of the email" },
                        body: { type: "STRING", description: "Body content of the email" }
                    },
                    required: ["subject", "body"]
                }
            },
            {
                name: "send_whatsapp",
                description: "Send a WhatsApp message to Avanish",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        phone: { type: "STRING", description: "Phone number (default to +917697793284)" },
                        message: { type: "STRING", description: "Message content" }
                    },
                    required: ["message"]
                }
            }
        ]}
      ];

      const config = { 
        responseModalities: [Modality.AUDIO],
        speechConfig: { 
          voiceConfig: { 
            prebuiltVoiceConfig: { 
              voiceName: "Puck" 
            } 
          } 
        },
        systemInstruction: { parts: [{ text: voiceSystemPrompt }] },
        tools: tools,
        generationConfig: {
            temperature: 0.9,
            topP: 0.95,
            maxOutputTokens: 2000, // Increased limit to prevent cutting off
        },
        outputAudioTranscription: {} 
      };

      let resolveStream;
      const streamPromise = new Promise(resolve => { resolveStream = resolve; });

      const session = await ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: config,
        callbacks: {
          onopen: () => console.log('Live API Session Started'),
          onmessage: (msg) => {
            // Handle Audio
            if (msg.serverContent?.modelTurn?.parts) {
              for (const part of msg.serverContent.modelTurn.parts) {
                if (part.inlineData) {
                  res.write(`data: ${JSON.stringify({ audio: part.inlineData.data })}\n\n`);
                }
              }
            }
            // Handle Transcription (Text)
            if (msg.serverContent?.outputTranscription) {
                 res.write(`data: ${JSON.stringify({ text: msg.serverContent.outputTranscription.text })}\n\n`);
            }

            // Handle Tool Calls
            if (msg.serverContent?.toolCall) {
                console.log('Tool Call Received:', JSON.stringify(msg.serverContent.toolCall));
                const calls = msg.serverContent.toolCall.functionCalls;
                if (calls && calls.length > 0) {
                    for (const call of calls) {
                        const { name, args, id } = call;
                        // Send the JSON trigger to the frontend (using the existing format)
                        // The frontend looks for :::JSON { ... } :::
                        const toolJson = JSON.stringify({ tool: name, ...args });
                        res.write(`data: ${JSON.stringify({ text: `:::JSON ${toolJson} :::` })}\n\n`);
                        
                        // Respond to the model that tool was executed
                        session.sendClientContent({
                            turns: [{
                                role: "user",
                                parts: [{
                                    functionResponse: {
                                        name: name,
                                        id: id,
                                        response: { result: "Action initiated on client side" }
                                    }
                                }]
                            }]
                        });
                    }
                }
            }
            
            if (msg.serverContent?.turnComplete) {
              res.write('data: [DONE]\n\n');
              res.end();
              resolveStream();
            }
          },
          onerror: (err) => {
            console.error('Live API Error:', err);
            res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
            res.end();
            resolveStream();
          },
          onclose: () => {
            console.log('Live API Session Closed');
          }
        }
      });

      // Send the user message (Text -> Audio)
      await session.sendClientContent({
        turns: [{ role: "user", parts: [{ text: message }] }],
        turnComplete: true
      });

      // Wait for the turn to complete
      await streamPromise;
      session.close();
      return;
    }

    // Text Mode (Standard Gemini)
    // Select model based on mode
    // User requested separate models for Text and Voice
    // Text: gemini-2.5-flash (Fast, efficient)
    // Voice: gemini-2.0-flash-exp (Often used for experimental Live features)
    const modelName = mode === 'voice' ? "gemini-2.5-flash-native-audio-preview-09-2025" : "gemini-2.5-flash";

    const model = genAI.getGenerativeModel({ 
      model: modelName,
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
    console.error('Chat API Error:', error);
    
    // Log more details if available
    if (error.response) {
        console.error('API Response Error Details:', JSON.stringify(error.response, null, 2));
    }
    
    // If headers haven't been sent yet
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.end();
    }
  }
}
