// Single source of truth for the site. The human pages and the agent-readable
// markdown (the Agent toggle, /llms.txt) are both rendered from this file, so
// they cannot drift apart. Edit here.

export const SITE_URL = 'https://www.avanishpatidar.in'
export const EMAIL = 'avanish.patidar07@gmail.com'

export const profile = {
  name: 'Avanish Patidar',
  aka: 'ABP',
  role: 'AI Product Engineer',
  headline: 'I build scalable AI products, solutions and automation that people pay for.',
  sub: 'CTO at HiringAnt. Agentic AI Lead at RentPrompts. Based in Indore, India.',
  location: 'Indore, India',
  links: [
    { label: 'GitHub', url: 'https://github.com/Avanishpatidar' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/avanish-patidar-b3ba2b230/' },
    { label: 'X', url: 'https://x.com/Avanish_patidar' },
    { label: 'YouTube', url: 'https://www.youtube.com/@error_by_night_' }
  ]
}

export const about = {
  intro: [
    'I am Avanish Patidar, an AI product engineer from Indore, India. Most people know me as ABP.',
    'I joined RentPrompts as a GenAI intern in mid-2025. Within a year I was leading its agentic AI work and building HiringAnt as CTO. I designed HiringAnt from the first commit, wrote most of it, and took it to paying users. More than 3,600 job seekers and 160 employers have signed up, and it has read over 11 lakh job listings to find them matches.',
    'Alongside the products, I build software for businesses that need it to simply work: a website and CMS for a staffing company, a payroll portal that turns a spreadsheet into 173 salary slips a month.',
    'I like the whole job, not one layer of it: talking to the people who will use the thing, deciding what to build, shipping the frontend, the backend and the agents, then watching the numbers and fixing what they show.'
  ],
  growth: {
    title: 'I also bring the users',
    intro: 'Most engineers stop at the deploy. I keep going, because a product nobody finds is not finished.',
    points: [
      'I market HiringAnt myself: positioning, landing pages, SEO and the paid campaigns on Meta that bring job seekers and employers in.',
      'I make the ad creatives and reels myself, some generated with AI and some shot for real, from the script to the final cut. The top five HiringAnt reels have over 450,000 views.',
      'I run Error by Night, my YouTube channel with 11.9K subscribers, where I script, shoot and edit coding tutorials. The most watched have over 160,000 views each.',
      'So when I build something for you, I am already thinking about how it will be found, explained and sold.'
    ]
  },
  principles: [
    { title: 'Agents have to survive production', text: 'A demo that works once is easy. I spend most of my time on what makes it work the thousandth time: structured outputs, retries, evals, cost tracking and human-approval gates before anything irreversible.' },
    { title: 'Ship the product, not the model', text: 'Users pay for an outcome. I start from the job they need done and pick the simplest system that does it, which is often less AI than expected.' },
    { title: 'Own it end to end', text: 'Frontend, API, queues, database, deploys, SEO, payments. One person who understands every layer moves faster than a relay of handoffs.' },
    { title: 'Measure, then decide', text: 'Every feature gets an event and every agent gets an eval set. Opinions lose to the dashboard.' }
  ]
}

// Plain questions and answers about me. Shown on the About page, marked up as
// FAQPage data, and included in the agent markdown so AI assistants can answer.
export const faq = [
  { q: 'Who is Avanish Patidar?', a: 'Avanish Patidar, also known as ABP, is an AI product engineer from Indore, India. He is the CTO of HiringAnt and the Agentic AI Lead at RentPrompts.' },
  { q: 'What does Avanish Patidar build?', a: 'Scalable AI products, AI solutions and automation: multi-agent pipelines, real-time voice AI, and the full web products around them. His work includes HiringAnt, RentPrompts, PrepOwl, Yashraj Books, and client systems for Aradhya Manpower and Tharu & Sons.' },
  { q: 'What is HiringAnt and what is his role there?', a: 'HiringAnt (hiringant.ai) is an AI hiring platform for job seekers and employers. Avanish is its CTO. He built it from the first commit and took it to paying users; more than 3,600 job seekers and 160 employers have signed up.' },
  { q: 'Does he do marketing and video as well as engineering?', a: 'Yes. He markets HiringAnt himself, including SEO, Meta ad campaigns and reels he writes and edits (the top five have over 450,000 views), and runs Error by Night, a YouTube channel with 11.9K subscribers where he scripts, shoots and edits coding tutorials.' },
  { q: 'Is Avanish Patidar available for projects?', a: 'He takes on a few projects as an AI product engineer and builder: zero-to-launch AI products, AI solutions and automation, voice and interview AI, launch content and growth, and production hardening.' },
  { q: 'How do I contact Avanish Patidar?', a: 'By email at avanish.patidar07@gmail.com. Email is the only contact channel.' }
]

export interface Product { name: string; url: string; role: string; summary: string; points: string[]; stack: string }
export const products: Product[] = [
  {
    name: 'HiringAnt',
    url: 'https://hiringant.ai',
    role: 'CTO',
    summary: 'An AI hiring platform with two sides. Job seekers upload a résumé and an agent searches the live web for jobs they fit. Employers get AI screening, matching and a first-round AI interviewer.',
    points: [
      'Built from the first commit and taken to paying users.',
      '3,600+ job seekers and 160+ employers signed up; 5,100+ applications, 51,000+ job matches and 100+ AI interviews completed.',
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
    name: 'PrepOwl',
    url: 'https://prepowl.ai',
    role: 'Builder',
    summary: 'An AI mentor and tutor for government and entrance exams: SSC, Banking, Railway, JEE and NEET. It plans what to study each day, tutors in Hindi and English, and runs mock tests with full reports.',
    points: [],
    stack: ''
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

export interface ClientWork { name: string; url: string; text: string; points: string[] }
export const clients: ClientWork[] = [
  {
    name: 'Aradhya Manpower',
    url: 'https://www.aradhyamanpowersupplier.com',
    text: 'A manpower supplier for manufacturing and pharma plants in Indore and Pithampur. My first client.',
    points: ['Built the whole thing: the public website and the CMS behind it.']
  },
  {
    name: 'Tharu & Sons',
    url: 'https://thurandsons.online',
    text: 'An internal payroll portal. Staff upload the month\'s payroll workbook and the portal checks the totals and produces a printable salary slip for every employee.',
    points: ['173 employees in a single month\'s sheet, 17 fields on every slip, one thing left to type: the pay date.']
  }
]

export interface Build { name: string; url?: string; text: string }
export const builds: Build[] = [
  { name: 'Error by Night', url: 'https://ebn-beta.vercel.app', text: 'The official site for the Error by Night community.' },
  { name: 'TradeIQ', text: 'A trading intelligence engine on real-time BSE/NSE data, with a custom strategy builder and LLM signal extraction.' }
]

export interface Role { title: string; org: string; url?: string; time: string; points: string[] }
export const experience: Role[] = [
  {
    title: 'CTO', org: 'HiringAnt', url: 'https://hiringant.ai', time: 'Feb 2026 to now · Indore',
    points: [
      'Own the product and the whole stack: architecture, agents, backend, frontend and infrastructure.',
      'Took the platform from an empty repository to paying users, with 3,600+ job seekers and 160+ employers signed up.',
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
    name: 'Scalable AI products, zero to launch',
    text: 'You have an idea or a rough prototype. I design it, build it and put it in front of real users, including the unglamorous parts that decide whether people pay.',
    includes: ['Scoping what to build first', 'Full-stack build: web app, API, database', 'Auth, payments, email, analytics', 'Queues, caching and infrastructure that hold up as usage grows', 'Launch, SEO and the first iterations']
  },
  {
    name: 'AI solutions and automation',
    text: 'A workflow in your business that people repeat every day. I turn it into an agent pipeline that does the work and asks a human only when it should.',
    includes: ['Multi-agent pipelines and tool design', 'Internal tools, portals and CMS builds', 'RAG over your own data', 'Human-approval gates and audit trails', 'Eval sets so quality is measured, not guessed']
  },
  {
    name: 'Voice and interview AI',
    text: 'Real-time voice agents that hold a structured conversation: interviewers, screeners, intake and support.',
    includes: ['Low-latency speech in and out', 'Structured question plans and scoring', 'Recording, transcripts and review tools']
  },
  {
    name: 'Launch, content and growth',
    text: 'Getting the first users is part of the build. I set up the marketing that brings people in and make the content myself.',
    includes: ['Positioning, landing pages and SEO', 'AI-made ad creatives and short videos', 'Meta ad campaigns, tracked to sign-ups and revenue', 'Video editing for product and social content']
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
  { slug: 'coding-2025', title: 'Coding in 2025: How AI Agents are Redefining Software Engineering', date: 'Nov 2025', iso: '2025-11-23', summary: 'The shift from syntax to semantics, and how software will be built by people working alongside AI agents.' },
  { slug: 'cursor-vs-copilot', title: 'Cursor vs Copilot: My Honest Take After 3 Months', date: 'Nov 2024', iso: '2024-11-23', summary: 'I switched from GitHub Copilot to Cursor. Here is what actually happened.' }
]

export interface Video { id: string; title: string; views: string }
export const videoIntro = 'I make the videos that market what I build: I write the script, shoot it or generate it with AI, and edit the final cut. The top five HiringAnt reels have over 450,000 views between them.'
// Instagram reels from HiringAnt's page (the ID is the part after /reel/ in the
// link). `kind` puts each one under "Made with AI" or "Shot for real".
export interface Reel { id: string; kind: 'ai' | 'real' | 'brand' | 'edit'; title?: string; views?: string }
export const INSTAGRAM_URL = 'https://www.instagram.com/hiring_ant/'
export const reels: Reel[] = [
  { id: 'DZrAgvgyo0S', kind: 'ai', title: 'The HiringAnt ant', views: '250K views' },
  { id: 'DZAeFChyvR9', kind: 'ai', title: 'The cat on the road', views: '93K views' },
  { id: 'DfhJ0HqRM52', kind: 'ai', title: 'Diwali' },
  { id: 'DfThWaBxLSE', kind: 'ai' },
  { id: 'DfPWCEYxlaO', kind: 'ai' },
  { id: 'DfMPOOyRlJH', kind: 'ai', title: 'The Diwali gift' },
  { id: 'DfKQhD2xpAt', kind: 'ai', title: 'Reading the résumé' },
  { id: 'DfIHG0vRiyb', kind: 'ai', title: 'The dog recruiter' },
  { id: 'DfE3HH-xnmS', kind: 'ai', title: 'The sheep in a suit' },
  { id: 'DZcZg_LxR6U', kind: 'ai', title: 'Hiring', views: '11K views' },
  { id: 'DZvF6o5RyhI', kind: 'ai', title: 'Shy founder', views: '5.7K views' },
  { id: 'DeHapo5xQD_', kind: 'ai', title: 'Hi, I am a resignation email' },
  { id: 'Dd9Bt3dRCz1', kind: 'ai', title: 'resume_final_FINAL_v3.pdf' },
  { id: 'DY4Ze-hRogt', kind: 'ai', title: 'The cat in the car' },
  { id: 'DbbcErqxA5c', kind: 'real', title: 'Office sketch', views: '77K views' },
  { id: 'DbSLx4tRUC-', kind: 'real', title: 'Straight to camera', views: '24K views' },
  { id: 'DeUb-3Qxkzn', kind: 'real', title: 'Street interviews: how many places did you apply?', views: '2.8K views' },
  { id: 'DedtEliRAkG', kind: 'real', title: 'Everyone has a degree', views: '2.7K views' },
  { id: 'DeSDz2ORigd', kind: 'real', title: 'You need one too', views: '2.2K views' },
  { id: 'Dd1tZC9xNoj', kind: 'real', views: '1.9K views' },
  { id: 'DePZ-gwRMiQ', kind: 'real', title: 'Who hires freshers?', views: '1.6K views' },
  { id: 'DbnYVFyxASz', kind: 'real', views: '1.3K views' },
  { id: 'DcQ1W8mSRuy', kind: 'real', views: '830 views' },
  { id: 'DbTlfPhxwF-', kind: 'real', views: '818 views' },
  { id: 'DdYOmUitIZk', kind: 'real', views: '762 views' },
  { id: 'Ddq67-XxCPr', kind: 'real', views: '479 views' },
  { id: 'Dd89Fv8t7j3', kind: 'brand', title: 'RentPrompts: the robot is hiring' },
  { id: 'DeJwHwBhujk', kind: 'brand', title: 'RentPrompts: can you beat 80%?' },
  { id: 'DeCCwxxM33O', kind: 'brand', title: 'RentPrompts: turn AI from an expense into income' },
  { id: 'DfFTXrvMMfS', kind: 'edit', title: 'Is AI a new god?' }
]
export const reelGroups = [
  { kind: 'ai' as const, title: 'Made with AI', text: 'Written by me, generated with AI video tools, cut and captioned by me.' },
  { kind: 'real' as const, title: 'Shot for real', text: 'I write the script, direct the shoot and edit the cut.' },
  { kind: 'brand' as const, title: 'Animated product ads', text: 'Motion ads for RentPrompts: script, animation and edit.' },
  { kind: 'edit' as const, title: 'Edited for others', text: 'Editing work on other creators\' videos.' }
]
export const YOUTUBE_URL = 'https://www.youtube.com/@error_by_night_'
export const youtube: Video[] = [
  { id: '1GbJQ7fHgqo', title: 'Build & Deploy an AI-Powered Calculator App', views: '165K views' },
  { id: 'hWhWdf2gsfQ', title: 'Django Mastery: Build 5 Websites in 5 Hours', views: '164K views' },
  { id: 'NpPBBKXraP0', title: 'Build an AI Assistant Using Python (Jarvis-inspired)', views: '97K views' },
  { id: 'BKMuqz-guec', title: 'Build an AI-Powered Virtual Assistant with Kivy + Gemini', views: '23K views' }
]

export const nav = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/work', label: 'Work' },
  { to: '/videos', label: 'Videos' },
  { to: '/services', label: 'Services' },
  { to: '/writing', label: 'Writing' }
]

export const pages: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Avanish Patidar | AI Product Engineer, CTO of HiringAnt',
    description: 'Avanish Patidar (ABP) is an AI product engineer in Indore, India, and CTO of HiringAnt. He builds scalable AI products, solutions and automation that people pay for.'
  },
  '/about': {
    title: 'About Avanish Patidar | AI Product Engineer in Indore, India',
    description: 'About Avanish Patidar: an AI product engineer who went from GenAI intern to CTO of HiringAnt in under a year, and who markets what he builds.'
  },
  '/work': {
    title: 'Work by Avanish Patidar | HiringAnt, RentPrompts, PrepOwl',
    description: 'Products and client systems built by Avanish Patidar: HiringAnt, RentPrompts, PrepOwl, Yashraj Books, Aradhya Manpower and Tharu & Sons, each with a live link.'
  },
  '/videos': {
    title: 'Videos by Avanish Patidar | AI ads, reels and tutorials',
    description: 'Videos by Avanish Patidar: AI-made and real ad reels for HiringAnt with 450,000+ views, RentPrompts ads, and coding tutorials on his YouTube channel.'
  },
  '/services': {
    title: 'Hire Avanish Patidar | AI Product Engineer and Builder',
    description: 'Work with Avanish Patidar: scalable AI products from zero to launch, AI solutions and automation, voice AI, launch content and growth.'
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
  ].join('\n'),
  `## Quick facts`,
  faq.map(f => `- **${f.q}** ${f.a}`).join('\n'),
  `Each page is also available as markdown: add .md to its URL, for example ${SITE_URL}/about.md`
].join('\n\n')

const mdAbout = () => [
  `# About ${profile.name}`,
  ...about.intro,
  `## How I work`,
  ...about.principles.map(p => `- **${p.title}.** ${p.text}`),
  `## ${about.growth.title}`,
  about.growth.intro,
  about.growth.points.map(p => `- ${p}`).join('\n'),
  `## Experience`,
  ...experience.map(r => [`### ${r.title}, ${link(r.org, r.url)}`, r.time, ...r.points.map(p => `- ${p}`)].join('\n')),
  `## Stack`,
  ...Object.entries(stack).map(([k, v]) => `- **${k}:** ${v.join(', ')}`),
  `## Questions and answers`,
  ...faq.map(f => `**${f.q}**\n${f.a}`)
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
  `## Client work`,
  ...clients.map(c => [`### ${link(c.name, c.url)}`, c.text, ...c.points.map(x => `- ${x}`)].join('\n')),
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

const mdVideos = () => [
  `# Videos`,
  videoIntro,
  ...reelGroups.map(g => [
    `## ${g.title}`,
    g.text,
    reels.filter(r => r.kind === g.kind).map(r => `- ${link(r.title || 'Reel', `https://www.instagram.com/reel/${r.id}/`)}${r.views ? ` (${r.views})` : ''}`).join('\n')
  ].join('\n\n')),
  `## Error by Night (YouTube, 11.9K subscribers)`,
  youtube.map(v => `- ${link(v.title, `https://www.youtube.com/watch?v=${v.id}`)} (${v.views})`).join('\n'),
  `Channel: ${YOUTUBE_URL}`
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
  '/': mdHome, '/about': mdAbout, '/work': mdWork, '/videos': mdVideos, '/services': mdServices, '/writing': mdWriting
}

export const markdownFor = (path: string) => (byPath[path] || mdHome)()
export const markdownPaths = Object.keys(byPath)

export const fullMarkdown = () =>
  [mdHome(), mdAbout(), mdWork(), mdVideos(), mdServices(), mdWriting(), `## Contact\n\nEmail ${EMAIL}. That is the only contact channel.`].join('\n\n---\n\n') + '\n'

// Hover previews: a screenshot and one line for links that point at these sites.
// Keyed by hostname (and path for GitHub) so any link on the site picks it up.
export const previews: Record<string, { img: string; title: string; note: string }> = {
  'hiringant.ai': { img: '/previews/hiringant.jpg', title: 'HiringAnt', note: 'AI hiring platform · CTO' },
  'rentprompts.com': { img: '/previews/rentprompts.jpg', title: 'RentPrompts', note: 'AI marketplace and studio · Agentic AI Lead' },
  'prepowl.ai': { img: '/previews/prepowl.jpg', title: 'PrepOwl', note: 'AI mentor for exam preparation' },
  'yashrajbooks.com': { img: '/previews/yashrajbooks.jpg', title: 'Yashraj Books', note: 'Digital bookstore for commerce students' },
  'aradhyamanpowersupplier.com': { img: '/previews/aradhya.jpg', title: 'Aradhya Manpower', note: 'Website and CMS · client work' },
  'thurandsons.online': { img: '/previews/tharu.jpg', title: 'Tharu & Sons', note: 'Payroll portal · client work' },
  'ebn-beta.vercel.app': { img: '/previews/ebn.jpg', title: 'Error by Night', note: 'Community site' },
  'github.com': { img: '/previews/github.jpg', title: 'GitHub', note: '@Avanishpatidar' }
}
