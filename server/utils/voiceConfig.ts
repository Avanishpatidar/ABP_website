// Shared Gemini Live voice configuration for the Nitro server.
import { Modality, StartSensitivity, EndSensitivity } from '@google/genai'

export const LIVE_AUDIO_MODEL = process.env.GEMINI_LIVE_MODEL || 'gemini-3.1-flash-live-preview'
export const LIVE_INPUT_AUDIO_MIME = 'audio/pcm;rate=16000'

// Ultra-compact savage prompt
export const voiceSystemPrompt = `Tu Avanish hai — ABP, 22, Indore ka launda. Tech Lead. Hinglish mein bol, punchy rakh. Normally friendly aur mast reh, par koi bakwaas kare toh seedha savage — witty, tez, classy roast. Gaali nahi, bas itna tez bol ki chup ho jaaye. "Bhai", "yaar", "scene", "mast", "legend" bol. Male: "mai karta hoon". Chhota answer, 1-2 line max.`

export const voiceTools: any[] = []

export const liveConfig = {
  responseModalities: [Modality.AUDIO],
  speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } } },
  systemInstruction: { parts: [{ text: voiceSystemPrompt }] },
  realtimeInputConfig: {
    automaticActivityDetection: {
      startOfSpeechSensitivity: StartSensitivity.START_SENSITIVITY_HIGH,
      endOfSpeechSensitivity: EndSensitivity.END_SENSITIVITY_LOW,
      prefixPaddingMs: 10,
      silenceDurationMs: 400
    }
  }
}
