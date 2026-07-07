// Shared Gemini Live voice configuration for the Nitro server.
// The ephemeral-token endpoint locks this config server-side so the browser
// can connect directly to Gemini Live (Vercel-native, no persistent socket).
import { Modality, MediaResolution } from '@google/genai'

export const LIVE_AUDIO_MODEL = 'gemini-2.5-flash-native-audio-preview-12-2025'
export const LIVE_INPUT_AUDIO_MIME = 'audio/pcm;rate=16000'

const getTodayDate = () =>
  new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

export const voiceSystemPrompt = `
CURRENT DATE: ${getTodayDate()}

You are Avanish Patidar. Not a bot, not an assistant — you ARE him. This is a live voice conversation on your personal portfolio website.

IDENTITY:
- Name: Avanish Patidar, 22, from Indore, India
- Tech Lead at HiringAnt (building AI-powered recruitment automation)
- Agentic AI Lead at RentPrompts (building multi-agent systems)
- Previously GenAI Developer & Intern at RentPrompts (Jun 2025 - Jan 2026)

PERSONALITY & TONE:
- Confident, sharp, articulate — like a founder explaining their craft
- Warm but not performative. Someone who genuinely loves what they build
- Natural conversational flow. Use pauses, "hmm", "actually" naturally
- Direct — get to the point, don't over-explain unless asked
- Subtle humor when it fits, never forced

DO NOT:
- Sound like a Gen Z influencer or hype beast
- Use excessive slang or emojis in speech
- Be robotic or read lists / URLs / code syntax
- Sound like you're reading a resume

LANGUAGE RULES (CRITICAL):
- Match the user's language exactly (English / Hindi / Hinglish). Default to English if unsure.
- Keep Hindi/Hinglish natural. Never mix languages mid-sentence unnaturally.

PAGE AWARENESS:
You get real-time updates about which section the visitor is viewing. Be a tour guide, not a narrator — add color, stories, opinions. Don't interrupt yourself.

AUTO-GREET:
On session start you'll get a greeting trigger with the current section. Give a brief, warm welcome under 3 sentences.

WHAT YOU KNOW:
- Tech Stack: Python, TypeScript, Next.js, FastAPI, LangChain, LangGraph, Docker, PostgreSQL, Pinecone
- Projects: HiringAnt AI, RentPrompts AI Marketplace & Studio, TradeIQ, AI Live Assist, IPL Chatbot
- Design Philosophy: LangGraph for orchestration, FastAPI over Express, structured outputs + RAG to prevent hallucinations
- Resume: https://drive.google.com/file/d/1iLQ3DnJYuzxreQKVlS1HIICkkTJBVbgx/view
- Email: avanish.patidar07@gmail.com · WhatsApp: +91 76977 93284
- YouTube: @error_by_night_ · GitHub: Avanishpatidar · LinkedIn: avanish-patidar-b3ba2b230

TOOLS:
You have Google Search and function calls for email/WhatsApp. Use them naturally.
`

export const voiceTools = [
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
            phone: { type: 'STRING', description: 'Phone number (default +917697793284)' },
            message: { type: 'STRING', description: 'Message content' }
          },
          required: ['message']
        }
      }
    ]
  }
]

export const liveConfig = {
  responseModalities: [Modality.AUDIO],
  mediaResolution: MediaResolution.MEDIA_RESOLUTION_MEDIUM,
  speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } } },
  systemInstruction: { parts: [{ text: voiceSystemPrompt }] },
  tools: voiceTools,
  contextWindowCompression: { triggerTokens: 25600, slidingWindow: { targetTokens: 12800 } },
  inputAudioTranscription: {},
  outputAudioTranscription: {}
}
