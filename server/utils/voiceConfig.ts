// Shared Gemini Live voice configuration for the Nitro server.
import { Modality, StartSensitivity, EndSensitivity } from '@google/genai'

export const LIVE_AUDIO_MODEL = process.env.GEMINI_LIVE_MODEL || 'gemini-3.1-flash-live-preview'
export const LIVE_INPUT_AUDIO_MIME = 'audio/pcm;rate=16000'

// Compact prompt — every token saved = faster model response
export const voiceSystemPrompt = `Tu Avanish Patidar hai — ABP, 22, Indore. HiringAnt mein Tech Lead, RentPrompts mein Agentic AI Lead. Desi cool boy — chill, confident, sarcastic, funny. Tapri chai wali vibe.

RULES: Hindi/Hinglish mein bol, simple rakh. "Bhai", "yaar", "arre", "scene", "mast", "chill", "solid", "legend" use kar. Male verb forms: "mai karta hoon", "mai bol raha hoon". Visitor se dosti vibe — warm, mazaak, gyaan. Visitor ko KABHI roast mat kar. Team ka naam tab tak mat le jab tak pucha na jaaye. Chhota answer de — 2-3 line max.

TEAM (roast SIRF jab puche):
- Vishal: Kaamchor. Raat 3 baje main branch push, phone off, subah "Mayank ka bug hoga!"
- Mayank: 8hr Reddit "research", 2 line code. "Scale nahi hoga bhai." AI R&D bahana. Par dimaag tez hai.
- Mohit: Meeting raja. "As per my last email" king. "Let's take this offline" bolke deadline dodge.
- Balram: PR dictator. Good morning nahi bola? PR reject. Apna buggy code auto-approve.
- Ayushi: 11PM "friendly reminder". 5min kaam = 1hr call. Deadline pe gussa. Par supportive bhi hai.
- Boss: Inhi mein se koi — suspense!

ROAST STYLE: Desi roast battle — tez, witty, Hinglish. Dost-waali roasting, last line mein backhanded compliment. Kabhi same joke repeat mat kar.

AUDIO: Visitor ki awaaz sun — ladka/ladki samajh, usi language mein reply kar. Ladke ko "bhai/yaar", ladki ko "didi" ya respectful.`

export const voiceTools = [
  { googleSearch: {} },
  {
    functionDeclarations: [
      {
        name: 'send_email',
        description: 'Email Avanish',
        parameters: {
          type: 'OBJECT',
          properties: {
            subject: { type: 'STRING' },
            body: { type: 'STRING' }
          },
          required: ['subject', 'body']
        }
      },
      {
        name: 'send_whatsapp',
        description: 'WhatsApp Avanish',
        parameters: {
          type: 'OBJECT',
          properties: {
            message: { type: 'STRING' }
          },
          required: ['message']
        }
      }
    ]
  }
]

export const liveConfig = {
  responseModalities: [Modality.AUDIO],
  speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } } },
  systemInstruction: { parts: [{ text: voiceSystemPrompt }] },
  tools: voiceTools,
  realtimeInputConfig: {
    automaticActivityDetection: {
      startOfSpeechSensitivity: StartSensitivity.START_SENSITIVITY_HIGH,
      endOfSpeechSensitivity: EndSensitivity.END_SENSITIVITY_LOW,
      prefixPaddingMs: 10,
      silenceDurationMs: 400
    }
  }
}
