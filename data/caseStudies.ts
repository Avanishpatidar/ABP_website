// Auto-generated from the original data files. Edit here going forward.
export interface CaseStudy { title:string; challenge:string; solution:string; mermaid:string }
export const caseStudies: CaseStudy[] = [
  {
    "title": "HiringAnt: Multi-Agent Recruitment Pipeline",
    "challenge": "Automate the entire screening, matching, and shortlisting process without losing human nuance.",
    "solution": "A LangGraph-orchestrated system with specialized agent nodes (Parser, Matcher, Ranker) backing onto a FastAPI + PostgreSQL/pgvector stack.",
    "mermaid": "graph TD\n    Client[Next.js Client] -->|API Request| FastAPI[FastAPI Gateway]\n    FastAPI --> Auth{Auth Node}\n    Auth -->|Valid| Orchestrator[LangGraph Orchestrator]\n    \n    Orchestrator --> Agent1[Resume Parsing Agent]\n    Orchestrator --> Agent2[Job Matching Agent]\n    Orchestrator --> Agent3[Ranking Agent]\n    \n    Agent1 -->|Extract| LLM[LLM/Gemini]\n    Agent2 <-->|Vector Search| PGV[(PostgreSQL + pgvector)]\n    \n    Agent1 -.-> State[(Graph State)]\n    Agent2 -.-> State\n    Agent3 -.-> State\n    \n    State -->|Final Result| FastAPI"
  },
  {
    "title": "TradeIQ: Real-Time Signal Extraction",
    "challenge": "Process high-velocity financial streams and extract actionable trading signals in under 5 seconds.",
    "solution": "Dedicated WebSocket listeners feeding into an async processing queue, analyzed by parallel LLM workers with strict Pydantic output validation.",
    "mermaid": "sequenceDiagram\n    participant NSE as Stock Exchange\n    participant WS as WebSocket Service\n    participant Celery as Async Queue\n    participant Agent as Signal Agent\n    participant DB as Redis Cache\n    participant Client as User Dashboard\n\n    NSE->>WS: Raw Tick Data (JSON)\n    WS->>Celery: Enqueue for Analysis\n    Celery->>Agent: Batch Trigger\n    Agent->>Agent: LLM Sentiment & Pattern Analysis\n    Agent-->>DB: Cache Result (TTL 5m)\n    DB-->>Client: Real-Time Update (Socket.io)"
  }
]
