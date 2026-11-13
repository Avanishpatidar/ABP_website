// Single source of truth for the site. The human pages and the agent-readable
// markdown (the Agent toggle, /llms.txt) are both rendered from this file, so
// they cannot drift apart. Edit here.

export const SITE_URL = 'https://www.avanishpatidar.in'
export const EMAIL = 'avanish.patidar07@gmail.com'

export const profile = {
  name: 'Avanish Patidar',
  aka: 'ABP',
  role: 'AI Product Engineer',
  headline: 'I build AI products that reach paying users, and the agents inside them.',
  sub: 'Co-Founder & CTO at HiringAnt. Agentic AI Lead at RentPrompts. Based in Indore, India.',
  location: 'Indore, India',
  links: [
    { label: 'GitHub', url: 'https://github.com/Avanishpatidar' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/avanish-patidar-b3ba2b230/' },
    { label: 'X', url: 'https://twitter.com/Avanish_patidar' },
    { label: 'YouTube', url: 'https://www.youtube.com/@error_by_night_' }
  ]
}

export const about = {
  intro: [
    'I am Avanish Patidar, an AI product engineer from Indore, India. Most people know me as ABP.',
    'I joined RentPrompts as a GenAI intern in mid-2025. Within a year I was leading its agentic AI work and building HiringAnt as co-founder and CTO. I designed HiringAnt from the first commit, wrote most of it, and took it to paying users.',
    'I like the whole job, not one layer of it: talking to the people who will use the thing, deciding what to build, shipping the frontend, the backend and the agents, then watching the numbers and fixing what they show.'
  ],
  principles: [
    { title: 'Agents have to survive production', text: 'A demo that works once is easy. I spend most of my time on what makes it work the thousandth time: structured outputs, retries, evals, cost tracking and human-approval gates before anything irreversible.' },
    { title: 'Ship the product, not the model', text: 'Users pay for an outcome. I start from the job they need done and pick the simplest system that does it, which is often less AI than expected.' },
    { title: 'Own it end to end', text: 'Frontend, API, queues, database, deploys, SEO, payments. One person who understands every layer moves faster than a relay of handoffs.' },
    { title: 'Measure, then decide', text: 'Every feature gets an event and every agent gets an eval set. Opinions lose to the dashboard.' }
  ]
}

export interface Product { name: string; url: string; role: string; summary: string; points: string[]; stack: string }
export const products: Product[] = [
  {
    name: 'HiringAnt',
    url: 'https://hiringant.ai',
    role: 'Co-Founder & CTO',
    summary: 'An AI hiring platform with two sides. Job seekers upload a résumé and an agent searches the live web for jobs they fit. Employers get AI screening, matching and a first-round AI interviewer.',
    points: [
      'Built from the first commit and taken to paying users, on both the job-seeker and employer side.',
      'A multi-agent pipeline for sourcing, screening, interviewing and decisions, with human approval before anything is sent.',
      'A real-time voice AI interviewer, a résumé builder, mock interviews and always-on Job Agents.',
      'Everything around the AI too: payments, SEO, email, admin tools, CI gates and production monitoring.'
    ],
    stack: 'Next.js 16 · React 19 · FastAPI · MongoDB · Celery + Redis · OpenAI Agents SDK · Cloudflare R2'
  },
  {
    name: 'RentPrompts',
    url: 'https://rentprompts.com',
    role: 'Agentic AI Lead',
    summary: 'An AI marketplace and app studio where people learn, create and earn with AI.',
    points: [
      'Started as a GenAI intern in June 2025, became GenAI Developer, then Agentic AI Lead in January 2026.',
      'Multi-agent workflows, tool-using agents with memory, and prompt systems that run in production.',
      'FastAPI services for AI pipelines, Payload CMS + Next.js dashboards, Dockerised deploys behind Nginx.'
    ],
    stack: 'Python · LangChain · FastAPI · Next.js · Payload CMS · Docker · Celery'
  },
  {
    name: 'Yashraj Books',
    url: 'https://yashrajbooks.com',
    role: 'Builder',
    summary: 'A digital bookstore for CA, CS, CMA and commerce students. Buy a title or a package and read it instantly on any device.',
    points: [],
    stack: ''
  }
]

export interface Build { name: string; url?: string; text: string }
export const builds: Build[] = [
  { name: 'JobFit Resume', url: 'https://job-fit-resume.vercel.app', text: 'An AI résumé analyser and ATS checker that tells you how well you fit a job before you apply.' },
  { name: 'MediBot', url: 'https://ai-pharma.vercel.app', text: 'An AI assistant for medicine and pharmacy questions.' },
  { name: 'Free Flow', url: 'https://free-flow-iota.vercel.app', text: 'Open public chat rooms. Jump in and talk in real time.' },
  { name: 'Savo Technologies', url: 'https://sava-technologies.vercel.app', text: 'The website for a digital and AI services studio.' },
  { name: 'Error by Night', url: 'https://ebn-beta.vercel.app', text: 'The official site for the Error by Night community.' },
  { name: 'TradeIQ', text: 'A trading intelligence engine on real-time BSE/NSE data, with a custom strategy builder and LLM signal extraction.' },
  { name: 'AI Live Assist', text: 'Real-time voice, video and shared drawing with an AI that understands the screen.' },
  { name: 'Aradhya Manpower', text: 'My first client project, the one that started it all.' }
]

export interface Role { title: string; org: string; url?: string; time: string; points: string[] }
export const experience: Role[] = [
  {
    title: 'Co-Founder & CTO', org: 'HiringAnt', url: 'https://hiringant.ai', time: 'Feb 2026 to now · Indore',
    points: [
      'Own the product and the whole stack: architecture, agents, backend, frontend and infrastructure.',
      'Took the platform from an empty repository to paying job seekers and employers.',
      'Run the engineering process: PR gates, hermetic tests, contract checks, nightly performance and load runs.'
    ]
  },
  {
    title: 'Agentic AI Lead', org: 'RentPrompts', url: 'https://rentprompts.com', time: 'Jan 2026 to now · Indore',
    points: [
      'Lead the design of multi-agent systems and autonomous agents with memory, tools and reasoning.',
      'Work with product and design to turn agent capabilities into shipped features.'
    ]
  },
  {
    title: 'GenAI Developer', org: 'RentPrompts', time: 'Aug 2025 to Jan 2026 · Indore',
    points: [
      'Built multi-tool agents with structured reasoning and RAG, and the FastAPI services behind them.',
      'Shipped Payload CMS + Next.js dashboards and a Dockerised stack with Nginx, SSL and Celery workers.'
    ]
  },
  {
    title: 'GenAI Intern', org: 'RentPrompts', time: 'Jun 2025 to Aug 2025 · Indore',
    points: ['Built AI agents and RAG pipelines with LangChain, and applied-AI prototypes that became product features.']
  }
]

export const stack: Record<string, string[]> = {
  'Agents & AI': ['OpenAI Agents SDK', 'LangGraph', 'LangChain', 'CrewAI', 'RAG', 'Realtime voice', 'Evals', 'n8n'],
  'Product': ['TypeScript', 'Next.js', 'React', 'Nuxt', 'Tailwind CSS', 'Payload CMS'],
  'Backend': ['Python', 'FastAPI', 'Node.js', 'Celery', 'Redis', 'WebSockets'],
  'Data': ['MongoDB', 'PostgreSQL', 'pgvector', 'Pinecone', 'ChromaDB'],
  'Infra': ['Docker', 'Nginx', 'Cloudflare', 'Vercel', 'GitHub Actions']
}

export interface Service { name: string; text: string; includes: string[] }
export const services: Service[] = [
  {
    name: 'AI product, zero to launch',
    text: 'You have an idea or a rough prototype. I design it, build it and put it in front of real users, including the unglamorous parts that decide whether people pay.',
    includes: ['Scoping what to build first', 'Full-stack build: web app, API, database', 'Auth, payments, email, analytics', 'Launch, SEO and the first iterations']
  },
  {
    name: 'Agents and automation',
    text: 'A workflow in your business that people repeat every day. I turn it into an agent pipeline that does the work and asks a human only when it should.',
    includes: ['Multi-agent pipelines and tool design', 'RAG over your own data', 'Human-approval gates and audit trails', 'Eval sets so quality is measured, not guessed']
  },
  {
    name: 'Voice and interview AI',
    text: 'Real-time voice agents that hold a structured conversation: interviewers, screeners, intake and support.',
    includes: ['Low-latency speech in and out', 'Structured question plans and scoring', 'Recording, transcripts and review tools']
  },
  {
    name: 'Production hardening and tech leadership',
    text: 'Your AI feature works in the demo and misbehaves in production. I find out why, fix it and leave your team with the process to keep it fixed.',
    includes: ['Cost, latency and reliability audits', 'Retries, queues and structured outputs', 'CI gates, tests and monitoring', 'Part-time technical lead for a small team']
  }
]

export const howItWorks = [
  { step: 'Write to me', text: 'Email what you are trying to do and what is in the way. A paragraph is enough.' },
  { step: 'A scoped plan', text: 'You get a short written plan: what I would build first, what I would leave out, and what it needs from you.' },
  { step: 'Ship in the open', text: 'Working software every week on a link you can open, not a status report.' },
  { step: 'Hand over', text: 'Code, docs and a running system your team can own.' }
]

export interface Post { title: string; url: string; date: string; summary: string; where: 'HiringAnt' | 'Here' }
export const HIRINGANT_AUTHOR_URL = 'https://hiringant.ai/blog/author/avanish-patidar'
export const hiringantPosts: Post[] = [
  { where: 'HiringAnt', date: 'Oct 2026', title: "How we tell a resume from a pitch deck: the upload check that refuses non-resumes, and why it isn't an LLM", url: 'https://hiringant.ai/blog/how-we-tell-a-resume-from-a-pitch-deck', summary: 'HiringAnt refuses decks, invoices, contracts and marksheets at upload. Here is how, and why a model was the wrong tool.' },
  { where: 'HiringAnt', date: 'Aug 2026', title: 'Why we can interview every candidate who clears screening', url: 'https://hiringant.ai/blog/why-we-interview-every-candidate-who-clears-screening', summary: 'First rounds are expensive, so teams ration them. An AI interviewer changes that arithmetic.' },
  { where: 'HiringAnt', date: 'Oct 2026', title: "Fake coding interview malware: how a take-home test can hack a developer's laptop", url: 'https://hiringant.ai/blog/fake-coding-interview-malware', summary: 'If a recruiter asks you to clone a repo and run it, stop. How the attack works and how to run a take-home safely.' },
  { where: 'HiringAnt', date: 'Oct 2026', title: 'ATS-friendly resume format for India: how screening software reads your resume', url: 'https://hiringant.ai/blog/ats-friendly-resume-india', summary: 'What the software can and cannot read, and what actually gets you shortlisted.' },
  { where: 'HiringAnt', date: 'Sep 2026', title: 'AI interview preparation: what gets scored, and how to get ready in a week', url: 'https://hiringant.ai/blog/ai-interview-preparation-guide', summary: 'An AI interview rates every candidate against the same checklist. This is what is on it.' },
  { where: 'HiringAnt', date: 'Oct 2026', title: 'Will AI take my job? A role-by-role check for people working in India', url: 'https://hiringant.ai/blog/will-ai-take-my-job-india', summary: 'What the research on AI and jobs measures, what it does not, and how to read it for your own role.' }
]

export interface OwnPost { slug: string; title: string; date: string; iso: string; summary: string }
export const ownPosts: OwnPost[] = [
  { slug: 'agentic-ai', title: 'The Rise of Agentic AI: From Chatbots to Autonomous Workers', date: 'Nov 2025', iso: '2025-11-23', summary: "Why AI is moving from talking to doing, and what it means for the future of work." },
  { slug: 'coding-2025', title: 'Coding in 2025: How AI Agents are Redefining Software Engineering', date: 'Nov 2025', iso: '2025-11-23', summary: 'The shift from syntax to semantics, and how software gets built next.' },
  { slug: 'cursor-vs-copilot', title: 'Cursor vs Copilot: My Honest Take After 3 Months', date: 'Nov 2024', iso: '2024-11-23', summary: 'I switched from GitHub Copilot to Cursor. Here is what actually happened.' }
]

export const nav = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/work', label: 'Work' },
  { to: '/services', label: 'Services' },
  { to: '/writing', label: 'Writing' }
]

export const pages: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Avanish Patidar | AI Product Engineer, Co-Founder & CTO of HiringAnt',
    description: 'Avanish Patidar (ABP) is an AI product engineer in Indore, India. Co-Founder & CTO of HiringAnt and Agentic AI Lead at RentPrompts. He builds AI products and agents that reach paying users.'
  },
  '/about': {
    title: 'About Avanish Patidar | AI Product Engineer in Indore, India',
    description: 'Who Avanish Patidar is, how he works, and his path from GenAI intern to Co-Founder & CTO of HiringAnt in under a year. Experience, principles and stack.'
  },
  '/work': {
    title: 'Work | Products built by Avanish Patidar: HiringAnt, RentPrompts and more',
    description: 'Products Avanish Patidar has built and shipped: HiringAnt (AI hiring platform), RentPrompts (AI marketplace), Yashraj Books, and earlier projects, each with a live link.'
  },
  '/services': {
    title: 'Hire an AI Product Engineer | Agents, voice AI and zero-to-launch builds',
    description: 'Work with Avanish Patidar: AI products from zero to launch, agent pipelines and automation, real-time voice and interview AI, and production hardening for AI features.'
  },
  '/writing': {
    title: 'Writing | Avanish Patidar on AI agents, hiring and building products',
    description: 'Articles by Avanish Patidar: engineering notes from building HiringAnt, guides on AI interviews and job search, and essays on agentic AI.'
  }
}

// ---------- Agent-readable markdown, generated from the data above ----------

const link = (label: string, url?: string) => (url ? `[${label}](${url})` : label)

const mdHome = () => [
  `# ${profile.name} (${profile.aka})`,
  `> ${profile.role}. ${profile.headline}`,
  profile.sub,
  [`- Email: ${EMAIL}`, ...profile.links.map(l => `- ${l.label}: ${l.url}`)].join('\n'),
  `## Pages`,
  [
    ...nav.filter(n => n.to !== '/').map(n => `- ${link(n.label, SITE_URL + n.to)}: ${pages[n.to].description}`),
    `- ${link('Everything in one file', SITE_URL + '/llms.txt')}`
  ].join('\n')
].join('\n\n')

const mdAbout = () => [
  `# About ${profile.name}`,
  ...about.intro,
  `## How I work`,
  ...about.principles.map(p => `- **${p.title}.** ${p.text}`),
  `## Experience`,
  ...experience.map(r => [`### ${r.title}, ${link(r.org, r.url)}`, r.time, ...r.points.map(p => `- ${p}`)].join('\n')),
  `## Stack`,
  ...Object.entries(stack).map(([k, v]) => `- **${k}:** ${v.join(', ')}`)
].join('\n\n').replace(/\n\n- /g, '\n- ')

const mdWork = () => [
  `# Work`,
  `## Products`,
  ...products.map(p => [
    `### ${link(p.name, p.url)} (${p.role})`,
    p.summary,
    ...p.points.map(x => `- ${x}`),
    p.stack ? `Stack: ${p.stack}` : ''
  ].filter(Boolean).join('\n')),
  `## More builds`,
  builds.map(b => `- **${link(b.name, b.url)}**: ${b.text}`).join('\n')
].join('\n\n')

const mdServices = () => [
  `# Services`,
  `I work as an AI product engineer and builder. To start, email ${EMAIL}.`,
  ...services.map(s => [`## ${s.name}`, s.text, ...s.includes.map(i => `- ${i}`)].join('\n')),
  `## How it works`,
  howItWorks.map((p, i) => `${i + 1}. **${p.step}.** ${p.text}`).join('\n')
].join('\n\n')

const mdWriting = () => [
  `# Writing`,
  `## On the HiringAnt blog`,
  hiringantPosts.map(p => `- ${link(p.title, p.url)} (${p.date}): ${p.summary}`).join('\n'),
  `All posts: ${HIRINGANT_AUTHOR_URL}`,
  `## On this site`,
  ownPosts.map(p => `- ${link(p.title, `${SITE_URL}/writing/${p.slug}`)} (${p.date}): ${p.summary}`).join('\n')
].join('\n\n')

const byPath: Record<string, () => string> = {
  '/': mdHome, '/about': mdAbout, '/work': mdWork, '/services': mdServices, '/writing': mdWriting
}

export const markdownFor = (path: string) => (byPath[path] || mdHome)()

export const fullMarkdown = () =>
  [mdHome(), mdAbout(), mdWork(), mdServices(), mdWriting(), `## Contact\n\nEmail ${EMAIL}. That is the only contact channel.`].join('\n\n---\n\n') + '\n'
