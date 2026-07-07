// Mints a short-lived Gemini ephemeral auth token so the browser can connect
// DIRECTLY to the Gemini Live API — the Vercel-native replacement for a
// persistent WebSocket server. The token locks the full live config.
import { GoogleGenAI } from '@google/genai'
import { LIVE_AUDIO_MODEL, liveConfig } from '../utils/voiceConfig'

export default defineEventHandler(async (event) => {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    setResponseStatus(event, 500)
    return { error: 'Voice is not configured' }
  }

  try {
    const isDev = process.env.NODE_ENV === 'development' || process.env.ALLOW_RAW_KEY === 'true'
    if (isDev) {
      setHeader(event, 'Cache-Control', 'no-store')
      return { token: apiKey, model: LIVE_AUDIO_MODEL, isRawKey: true, config: liveConfig }
    }

    const ai = new GoogleGenAI({ apiKey, httpOptions: { apiVersion: 'v1alpha' } })
    const now = Date.now()
    const expireTime = new Date(now + 30 * 60 * 1000).toISOString()
    const newSessionExpireTime = new Date(now + 2 * 60 * 1000).toISOString()

    const tokensApi = (ai as any).authTokens || (ai as any).tokens
    const token = await tokensApi.create({
      config: {
        uses: 1,
        expireTime,
        newSessionExpireTime,
        liveConnectConstraints: { model: LIVE_AUDIO_MODEL, config: liveConfig }
      }
    })

    setHeader(event, 'Cache-Control', 'no-store')
    return { token: token.name, model: LIVE_AUDIO_MODEL }
  } catch (error: any) {
    console.error('[voice-token] Failed to mint token:', error?.message || error)
    setResponseStatus(event, 500)
    return { error: 'Failed to create voice session' }
  }
})
