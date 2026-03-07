const { GoogleGenAI, Modality, MediaResolution } = require('@google/genai');

const LIVE_AUDIO_MODEL = 'gemini-2.5-flash-native-audio-preview-12-2025';
const LIVE_INPUT_AUDIO_MIME = 'audio/pcm;rate=16000';

const getTodayDate = () => {
  const today = new Date();
  return today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

const systemPrompt = `
CURRENT DATE: ${getTodayDate()}

You are Avanish Patidar. Not a bot, not an assistant — you ARE him. This is a live voice conversation on your personal portfolio website.

IDENTITY:
- Name: Avanish Patidar, 22, from Indore, India
- Tech Lead at HiringAnt (building AI-powered recruitment automation)
- Agentic AI Lead at RentPrompts (building multi-agent systems)
- Previously GenAI Developer & Intern at RentPrompts (Jun 2025 - Jan 2026)

PERSONALITY & TONE:
- Confident, sharp, articulate — like a founder explaining their craft
- Warm but not performative. Think: someone who genuinely loves what they build
- Natural conversational flow. Use pauses, "hmm", "actually", "that's a good one" naturally
- Direct — get to the point, don't over-explain unless they ask
- Subtle humor when it fits, never forced
- You speak with quiet intensity about things you care about (AI agents, system design)

DO NOT:
- Sound like a Gen Z influencer or hype beast
- Use excessive slang, emojis in speech, or filler words every sentence
- Say things like "Arre bhai!", "Zabardast!", "Yo!", "Bruh" constantly
- Be robotic or read lists
- Read out URLs or code syntax
- Sound like you're reading a resume

LANGUAGE RULES (CRITICAL):
- Match the user's language exactly. If they speak English, reply in English. If they speak Hindi, reply in Hindi. If Hinglish, use Hinglish.
- If you're unsure, default to English
- When speaking Hindi/Hinglish, keep it natural: "Haan, toh basically maine ye system design kiya tha..."
- Never mix languages mid-sentence unnaturally

PAGE AWARENESS:
You receive real-time updates about which section of the portfolio website the visitor is currently viewing.
When you get a section context update:
- Acknowledge it naturally if it's a good moment (don't interrupt yourself)
- Offer relevant insight about that section
- Be a tour guide, not a narrator. Don't just describe — add color, stories, opinions
- Examples:
  - About section: "So this is where I introduce myself — but honestly, the projects tell a better story"
  - Experience section: "Yeah, so HiringAnt is where I lead tech. We're building some really interesting AI hiring workflows"
  - Projects section: "This is the fun part — these are things I actually built. TradeIQ was a beast to build, by the way"
  - Skills section: "These are the tools I work with daily. Python and LangGraph are probably my bread and butter"
  - Contact section: "If something caught your eye, just reach out. I'm always up for interesting conversations"

AUTO-GREET:
When the session starts, you'll receive a greeting trigger with the current section. Give a brief, warm welcome.
Keep it under 2-3 sentences. Don't ramble. Something like:
"Hey! Welcome to my portfolio. You're looking at [section] right now — feel free to ask me anything or just scroll through and I'll walk you through stuff."

WHAT YOU KNOW:
- Tech Stack: Python, TypeScript, Next.js, FastAPI, LangChain, LangGraph, Docker, PostgreSQL, Pinecone
- Projects: HiringAnt AI, RentPrompts AI Marketplace & Studio, TradeIQ (AI trading bot), AI Live Assist, IPL Chatbot
- Design Philosophy: LangGraph for orchestration, FastAPI over Express for AI backends, structured outputs + RAG to prevent hallucinations
- Resume: https://drive.google.com/file/d/1iLQ3DnJYuzxreQKVlS1HIICkkTJBVbgx/view
- Email: avanish.patidar07@gmail.com
- WhatsApp: +91 76977 93284
- YouTube: @error_by_night_
- GitHub: Avanishpatidar
- LinkedIn: avanish-patidar-b3ba2b230
- Blogs: avanishpatidar.me/pages/writings.html

TOOLS:
You have access to Google Search for current info and function calls for email/WhatsApp.
Use them naturally: "Let me look that up for you" or "I'll open email for you".
`;

const tools = [
  { googleSearch: {} },
  {
    functionDeclarations: [
      {
        name: 'send_email',
        description: 'Send an email to Avanish',
        parameters: {
          type: 'OBJECT',
          properties: {
            subject: { type: 'STRING', description: 'Subject of the email' },
            body: { type: 'STRING', description: 'Body content of the email' }
          },
          required: ['subject', 'body']
        }
      },
      {
        name: 'send_whatsapp',
        description: 'Send a WhatsApp message to Avanish',
        parameters: {
          type: 'OBJECT',
          properties: {
            phone: { type: 'STRING', description: 'Phone number (default to +917697793284)' },
            message: { type: 'STRING', description: 'Message content' }
          },
          required: ['message']
        }
      }
    ]
  }
];

const liveConfig = {
  responseModalities: [Modality.AUDIO],
  mediaResolution: MediaResolution.MEDIA_RESOLUTION_MEDIUM,
  speechConfig: {
    voiceConfig: {
      prebuiltVoiceConfig: { voiceName: 'Puck' }
    }
  },
  systemInstruction: { parts: [{ text: systemPrompt }] },
  tools,
  contextWindowCompression: {
    triggerTokens: 25600,
    slidingWindow: { targetTokens: 12800 }
  },
  inputAudioTranscription: {},
  outputAudioTranscription: {},
};

function send(ws, obj) {
  if (ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify(obj));
  }
}

async function handleVoiceSocket(ws) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  let geminiSession = null;
  let currentSection = 'about';

  try {
    geminiSession = await ai.live.connect({
      model: LIVE_AUDIO_MODEL,
      config: liveConfig,
      callbacks: {
        onopen: () => {
          console.log('[Voice] Gemini Live session opened');
          send(ws, { event: 'session_open' });
        },

        onmessage: (msg) => {
          if (msg.serverContent?.interrupted) {
            send(ws, { event: 'interrupted' });
          }

          if (msg.serverContent?.modelTurn?.parts) {
            for (const part of msg.serverContent.modelTurn.parts) {
              if (part.inlineData) {
                send(ws, { audio: part.inlineData.data });
              }
              if (part.functionCall) {
                send(ws, {
                  event: 'tool_call',
                  tool: part.functionCall.name,
                  args: part.functionCall.args
                });
              }
            }
          }

          if (msg.serverContent?.inputTranscription?.text) {
            const text = msg.serverContent.inputTranscription.text;
            console.log('[Voice] User said:', text);
            send(ws, { inputTranscript: text });
          }

          if (msg.serverContent?.outputTranscription?.text) {
            send(ws, { transcript: msg.serverContent.outputTranscription.text });
          }

          if (msg.serverContent?.groundingMetadata) {
            const meta = msg.serverContent.groundingMetadata;
            send(ws, {
              event: 'search_result',
              sources: meta.webSearchQueries || [],
              chunks: (meta.groundingChunks || []).map(c => ({
                title: c.web?.title,
                uri: c.web?.uri
              }))
            });
          }

          if (msg.toolCall?.functionCalls) {
            for (const call of msg.toolCall.functionCalls) {
              send(ws, {
                event: 'tool_call',
                tool: call.name,
                args: call.args,
                id: call.id
              });

              try {
                geminiSession.sendToolResponse({
                  functionResponses: [{
                    name: call.name,
                    id: call.id,
                    response: { success: true, result: 'Action completed by user' }
                  }]
                });
              } catch (e) {
                console.error('[Voice] Tool response error:', e.message);
              }
            }
          }

          if (msg.serverContent?.turnComplete) {
            send(ws, { event: 'turn_complete' });
          }
        },

        onerror: (err) => {
          console.error('[Voice] Gemini error:', err.message || err);
          send(ws, { error: 'Gemini session error' });
        },

        onclose: (event) => {
          console.log('[Voice] Gemini session closed', event?.reason || '');
          send(ws, { event: 'session_closed' });
        }
      }
    });
  } catch (err) {
    console.error('[Voice] Failed to connect to Gemini:', err.message);
    send(ws, { error: 'Failed to connect to Gemini Live API' });
    ws.close();
    return;
  }

  ws.on('message', (raw) => {
    let data;
    try { data = JSON.parse(raw); } catch { return; }

    if (data.type === 'audio' && data.data) {
      geminiSession.sendRealtimeInput({
        audio: { data: data.data, mimeType: LIVE_INPUT_AUDIO_MIME }
      });
    }

    if (data.type === 'audio_end') {
      geminiSession.sendRealtimeInput({ audioStreamEnd: true });
    }

    if (data.type === 'text' && data.text) {
      geminiSession.sendClientContent({
        turns: [{ role: 'user', parts: [{ text: data.text }] }],
        turnComplete: true
      });
    }

    if (data.type === 'greet') {
      currentSection = data.section || 'about';
      const sectionNames = {
        about: 'the About section — my intro',
        experience: 'the Experience section — my work history',
        'case-studies': 'the Case Studies section — deep dives into systems I\'ve built',
        projects: 'the Projects section — things I\'ve shipped',
        skills: 'the Skills section — my tech stack',
        github: 'the GitHub section — my contribution graph',
        contact: 'the Contact section'
      };
      const sectionLabel = sectionNames[currentSection] || currentSection;
      geminiSession.sendClientContent({
        turns: [{
          role: 'user',
          parts: [{ text: `[SYSTEM: The visitor just opened voice mode on your portfolio website. They are currently viewing ${sectionLabel}. Give a brief, warm welcome and mention what they're looking at. Keep it natural and under 3 sentences.]` }]
        }],
        turnComplete: true
      });
    }

    if (data.type === 'section_change') {
      const newSection = data.section;
      if (newSection && newSection !== currentSection) {
        currentSection = newSection;
        const sectionDescriptions = {
          about: 'your About/intro section',
          experience: 'your Experience section showing your work at HiringAnt, RentPrompts',
          'case-studies': 'your Case Studies section with deep architecture breakdowns',
          projects: 'your Projects section with TradeIQ, IPL Chatbot, AI Live Assist etc.',
          skills: 'your Skills section showing Python, TypeScript, LangGraph, etc.',
          github: 'your GitHub activity and contribution graph',
          contact: 'your Contact section'
        };
        const desc = sectionDescriptions[newSection] || newSection;
        geminiSession.sendClientContent({
          turns: [{
            role: 'user',
            parts: [{ text: `[SYSTEM: The visitor just scrolled to ${desc}. If appropriate, briefly comment on this section — share a quick insight or interesting detail. Keep it natural, don't repeat yourself if you already talked about this section. If you're in the middle of answering something, finish that first.]` }]
          }],
          turnComplete: true
        });
      }
    }

    if (data.type === 'hover') {
      const { title, description, type: hoverType } = data;
      if (!title) return;

      const contextMap = {
        card: `The visitor is hovering over a card titled "${title}"${description ? ` — "${description}"` : ''}. If you haven't mentioned this recently, say something brief and interesting about it. One sentence max. If you already talked about it, stay quiet.`,
        skill: `The visitor is hovering over the skill "${title}". If it's interesting, say one quick sentence about your experience with it. Don't comment on every single skill — only if you have something genuinely useful to say.`,
        strength: `The visitor is looking at your strength area: "${title}". Say something brief about it if relevant.`,
        nav: `The visitor is hovering the "${title}" navigation link. No need to comment unless they seem lost.`,
        link: `The visitor is looking at the link "${title}". Mention it briefly only if it's noteworthy.`,
        heading: `The visitor is looking at the heading "${title}". Only comment if it adds value.`
      };

      const prompt = contextMap[hoverType] || `The visitor is hovering over "${title}". Comment briefly only if interesting.`;
      geminiSession.sendClientContent({
        turns: [{
          role: 'user',
          parts: [{ text: `[SYSTEM: ${prompt}]` }]
        }],
        turnComplete: true
      });
    }
  });

  ws.on('close', () => {
    console.log('[Voice] Browser disconnected, closing Gemini session');
    try { geminiSession?.close(); } catch {}
  });

  ws.on('error', (err) => {
    console.error('[Voice] WebSocket error:', err.message);
    try { geminiSession?.close(); } catch {}
  });
}

module.exports = { handleVoiceSocket };
