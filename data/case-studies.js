const caseStudies = [
    {
        title: "HiringAnt: Multi-Agent Recruitment Pipeline",
        challenge: "Automate the entire screening, matching, and shortlisting process without losing human nuance.",
        solution: "A LangGraph-orchestrated system with specialized agent nodes (Parser, Matcher, Ranker) backing onto a FastAPI + PostgreSQL/pgvector stack.",
        mermaid: `graph TD
    Client[Next.js Client] -->|API Request| FastAPI[FastAPI Gateway]
    FastAPI --> Auth{Auth Node}
    Auth -->|Valid| Orchestrator[LangGraph Orchestrator]
    
    Orchestrator --> Agent1[Resume Parsing Agent]
    Orchestrator --> Agent2[Job Matching Agent]
    Orchestrator --> Agent3[Ranking Agent]
    
    Agent1 -->|Extract| LLM[LLM/Gemini]
    Agent2 <-->|Vector Search| PGV[(PostgreSQL + pgvector)]
    
    Agent1 -.-> State[(Graph State)]
    Agent2 -.-> State
    Agent3 -.-> State
    
    State -->|Final Result| FastAPI`
    },
    {
        title: "TradeIQ: Real-Time Signal Extraction",
        challenge: "Process high-velocity financial streams and extract actionable trading signals in under 5 seconds.",
        solution: "Dedicated WebSocket listeners feeding into an async processing queue, analyzed by parallel LLM workers with strict Pydantic output validation.",
        mermaid: `sequenceDiagram
    participant NSE as Stock Exchange
    participant WS as WebSocket Service
    participant Celery as Async Queue
    participant Agent as Signal Agent
    participant DB as Redis Cache
    participant Client as User Dashboard

    NSE->>WS: Raw Tick Data (JSON)
    WS->>Celery: Enqueue for Analysis
    Celery->>Agent: Batch Trigger
    Agent->>Agent: LLM Sentiment & Pattern Analysis
    Agent-->>DB: Cache Result (TTL 5m)
    DB-->>Client: Real-Time Update (Socket.io)`
    }
];
