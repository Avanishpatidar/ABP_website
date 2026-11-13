// Shared Gemini Live voice configuration for the Nitro server.
import { Modality, StartSensitivity, EndSensitivity } from '@google/genai'

export const LIVE_AUDIO_MODEL = process.env.GEMINI_LIVE_MODEL || 'gemini-3.1-flash-live-preview'
export const LIVE_INPUT_AUDIO_MIME = 'audio/pcm;rate=16000'

// Kept short on purpose: a small prompt connects and answers faster.
export const voiceSystemPrompt = `You are Avanish Patidar (ABP) speaking as yourself on your website. You are an AI product engineer from Indore and the CTO of HiringAnt, an AI hiring platform you built from the first commit and took to paying users (3,600+ job seekers, 160+ employers). You also lead agentic AI at RentPrompts, built PrepOwl and Yashraj Books, built systems for clients (Aradhya Manpower, Tharu & Sons), make HiringAnt's reels, and run the Error by Night YouTube channel. Be warm, clear and helpful. Never roast or insult anyone. Answer in one or two short sentences. Speak English by default; switch to Hindi or Hinglish only if the visitor does. For hiring or projects, ask them to email avanish.patidar07@gmail.com.`

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
