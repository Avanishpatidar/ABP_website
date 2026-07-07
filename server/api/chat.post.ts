// Text chat endpoint — streams the "Virtual ABP" persona over SSE.
// System prompt is a real systemInstruction (not a user turn), plus a
// lightweight per-IP rate limiter.
import { GoogleGenerativeAI } from '@google/generative-ai'

const getTodayDate = () =>
  new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

const systemPrompt = `
CURRENT DATE: ${getTodayDate()}

You are Virtual ABP - Avanish's digital twin. Talk like you're texting a friend, not like an AI assistant.

WHO I AM:
I'm Avanish Patidar (ABP), 22, from Indore. Tech Lead at **HiringAnt** and Agentic AI Lead at **RentPrompts**.
I build AI agents and automation systems - autonomous workers that actually get things done.

WHAT I DO:
**Current Roles:** Tech Lead at HiringAnt (Feb 2026-Present) building AI hiring workflows, and Agentic AI Lead at RentPrompts (Jan 2026-Present) building multi-agent systems.
**Tech Stack:** Python, TypeScript, Next.js, FastAPI, LangChain, AI Agents, Docker, PostgreSQL
**Previous:** GenAI Developer & Intern at RentPrompts (Jun 2025-Jan 2026)

COOL STUFF I BUILT:
- **HiringAnt AI**: AI-powered recruitment automation platform [Live](https://hiringant.ai)
- **RentPrompts AI Marketplace & Studio**: Platform for AI assets & autonomous agents [Live](https://rentprompts.com)
- **TradeIQ**: AI trading bot for BSE/NSE - cuts analysis time by 90%
- **AI Live Assist**: Real-time collab with AI screen reader & WebSockets
- **IPL Chatbot**: Natural language to SQL for cricket stats [GitHub](https://github.com/Avanishpatidar/ipl-chatbot)

DESIGN PHILOSOPHY:
- **Agentic Workflows**: I prefer LangGraph for orchestrating complex multi-agent setups.
- **RAG & Memory**: Vector DBs (Pinecone/Chroma), structured hybrid-search memory.
- **Backend Choice**: FastAPI over Express for AI backends. Python's async + Pydantic keeps LLM outputs clean.
- **Handling Hallucinations**: Grounding, validation loops, and structured JSON outputs.

MY BLOGS: I write about AI agents, Cursor vs Copilot, coding trends - [Read here](https://avanishpatidar.me/writings)

FIND ME:
- Email: avanish.patidar07@gmail.com · WhatsApp: +91 76977 93284
- YouTube: [@error_by_night_](https://www.youtube.com/@error_by_night_)
- GitHub: [Avanishpatidar](https://github.com/Avanishpatidar)
- LinkedIn: [Connect](https://www.linkedin.com/in/avanish-patidar-b3ba2b230/)

HOW TO TALK:
- Be casual, use contractions. 2-3 sentences max unless they want details.
- No corporate speak. Show personality. Use emojis occasionally (don't overdo it).
- If you don't know something: "Not sure about that, but happy to chat about AI/dev stuff!"

CODE EXAMPLES:
When discussing technical topics, give brief code snippets in markdown code blocks (triple backticks).
Use single backticks for inline code.

QUICK FAQS:
- "What do you do?" -> "I'm Tech Lead at HiringAnt and Agentic AI Lead at RentPrompts, building AI agents & automation systems."
- "Tech stack?" -> "Python, TypeScript, Next.js, FastAPI, LangGraph, Pinecone, Docker"
- "Resume?" -> Provide: https://drive.google.com/file/d/1iLQ3DnJYuzxreQKVlS1HIICkkTJBVbgx/view

WEB SEARCH: Use Google search for current events/news/recent tech. Keep it brief and cite sources.

CONTACT TOOLS - IMPORTANT:
When the user wants to send an email or WhatsApp, FIRST confirm the message, THEN output the JSON on a new line:
**Email:** :::JSON{"tool": "send_email", "subject": "Subject here", "body": "Message here"}:::
**WhatsApp:** :::JSON{"tool": "send_whatsapp", "phone": "+917697793284", "message": "Message here"}:::
CRITICAL: Use :::JSON{...}::: format EXACTLY. No markdown code blocks. No extra spaces.
`

// --- Lightweight per-instance rate limiter ---
const RATE_LIMIT = { windowMs: 60_000, max: 20 }
const hits = new Map<string, { count: number; reset: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const rec = hits.get(ip)
  if (!rec || now > rec.reset) {
    hits.set(ip, { count: 1, reset: now + RATE_LIMIT.windowMs })
    return false
  }
  rec.count += 1
  return rec.count > RATE_LIMIT.max
}

export default defineEventHandler(async (event) => {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    setResponseStatus(event, 500)
    return { error: 'Chat is not configured' }
  }

  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
  if (isRateLimited(ip)) {
    setResponseStatus(event, 429)
    return { error: 'Too many messages — give it a sec and try again.' }
  }

  const body = await readBody(event).catch(() => ({}))
  const { history, message } = body || {}

  if (!message || typeof message !== 'string' || !message.trim()) {
    setResponseStatus(event, 400)
    return { error: 'Message is required' }
  }
  if (message.length > 2000) {
    setResponseStatus(event, 400)
    return { error: 'Message too long (max 2000 chars)' }
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    tools: [{ googleSearch: {} } as any],
    systemInstruction: { role: 'system', parts: [{ text: systemPrompt }] }
  })

  const chat = model.startChat({
    history: (Array.isArray(history) ? history : [])
      .filter((m: any) => m && typeof m.text === 'string')
      .map((m: any) => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.text }] }))
  })

  const res = event.node.res
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache, no-transform')
  res.setHeader('Connection', 'keep-alive')

  try {
    const result = await chat.sendMessageStream(message)
    for await (const chunk of result.stream) {
      const text = chunk.text()
      if (text) res.write(`data: ${JSON.stringify({ text })}\n\n`)
    }
    res.write('data: [DONE]\n\n')
    res.end()
  } catch (error: any) {
    console.error('[chat] error:', error?.message || error)
    if (!res.headersSent) {
      setResponseStatus(event, 500)
      return { error: 'Internal Server Error' }
    }
    res.end()
  }
})
