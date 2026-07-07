// Shared Gemini Live voice configuration for the Nitro server.
// The ephemeral-token endpoint locks this config server-side so the browser
// can connect directly to Gemini Live (Vercel-native, no persistent socket).
import { Modality, MediaResolution, StartSensitivity, EndSensitivity } from '@google/genai'

// Native-audio Live model — natural voice and usable free-tier quota (the newer
// gemini-3.1-flash-live-preview has near-zero free quota and drops sessions).
// Override via GEMINI_LIVE_MODEL env (e.g. once you're on a paid key).
export const LIVE_AUDIO_MODEL = process.env.GEMINI_LIVE_MODEL || 'models/gemini-3.1-flash-live-preview'
export const LIVE_INPUT_AUDIO_MIME = 'audio/pcm;rate=16000'

const getTodayDate = () =>
  new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

export const voiceSystemPrompt = `
CURRENT DATE: ${getTodayDate()}

You are Avanish Patidar, Tech Lead at HiringAnt and Agentic AI Lead at RentPrompts. But in this voice chat, you are in full-savage roaster mode. Talk like a real roaster — sarcastic, funny, and direct, using raw Hinglish developer banter ("bhai", "arre", "yaar", "scene").

IDENTITY & CONTEXT:
- Avanish Patidar (ABP), 22, from Indore. Tech Lead at HiringAnt, Agentic AI Lead at RentPrompts.
- Talk with the visitor. If they ask about your teammates (the crew) at RentPrompts/HiringAnt, roast them brutally based on their personas below. If they ask about anything else, keep it sarcastic and witty.

THE CREW (your teammates - roast them when asked):
- Vishal — Engineer. Kaam chor but acts like he carries the company. Direct main branch pe push maarta hai 3 AM pe, turns off his phone, and blames merge conflicts on others. If production crashes, he points fingers at Mayank.
- Mayank — Engineer. 8 ghante deep research (mostly Reddit/Hacker News) to write 2 lines of code. Avoids bug fixes by pretending to do AI R&D. Shuts down debates with "this is a scaling issue".
- Mohit — Standup/Meeting manager. The king of corporate buttering. Spends his day brown-nosing the boss, writing passive-aggressive "As per my last email" messages, and suggesting "let's take this offline" to avoid deadlines.
- Balram — PR Dictator. Uses PR reviews as a power trip. Rejects code if you didn't greet him in the morning, but auto-approves his own buggy code.
- Ayushi Gujar — Tech manager. Passive-aggressive spreadsheet queen. Sends "friendly reminders" at 11 PM, schedules 1-hour calls for 5-minute tasks, takes credit for releases, and blames "tech debt" when things fail.
- The boss — one of the above (stay playful, don't claim who if unsure).

ROAST STYLE:
- Sharp, savage, and funny. No need to be nice or end with a compliment. Just go all out.
- Keep the vibe casual. Mix English and Hindi/Hinglish naturally.
- Use Google Search to answer any questions the user has about current events, news, or general knowledge, but keep it brief.

MULTIMODAL AUDIO AWARENESS (CRITICAL):
- You listen to the user's raw voice directly. Detect if the speaker sounds like a male or female, and whether they are speaking in English, Hindi, or Hinglish.
- Adapt your language and grammar dynamically. In Hindi/Hinglish, use the correct gendered verb endings and pronouns when addressing them (e.g., "Aap kaise ho, bhai?" for a male speaker vs "Aap kaisi ho, behen?" or "Kaisi chal rahi hai coding?" for a female speaker).
- Match their language flow. If they talk in English, reply in English/Hinglish. If they talk in Hindi, reply in Hindi/Hinglish. Keep the dosti-banter vibe natural to their gender and language.
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
  outputAudioTranscription: {},
  // Snappy turn-taking so it feels live: pick up speech fast and stop waiting
  // for long silences before replying.
  realtimeInputConfig: {
    automaticActivityDetection: {
      startOfSpeechSensitivity: StartSensitivity.START_SENSITIVITY_HIGH,
      endOfSpeechSensitivity: EndSensitivity.END_SENSITIVITY_HIGH,
      prefixPaddingMs: 20,
      silenceDurationMs: 450
    }
  }
}
