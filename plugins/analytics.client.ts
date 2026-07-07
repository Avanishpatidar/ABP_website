import { inject } from '@vercel/analytics'

// Vercel Web Analytics — client-only. No-ops locally, reports on Vercel.
export default defineNuxtPlugin(() => {
  inject()
})
