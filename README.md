# 🔍 Murder Mystery AI Agent Swarm

An AI-powered multi-agent investigation system where specialized AI agents collaborate to solve murder cases. Built with **Exasol DB**, **LangGraph.js**, and **React**.

## Architecture

```
                    USER
                     │
                     ▼
               React Frontend        ◄── Dark minimalist investigation UI
                     │
                WebSocket/SSE
                     │
                     ▼
              Node.js Backend        ◄── Express API + WebSocket server
                     │
                     ▼
              LangGraph Runtime      ◄── Agent orchestration state machine
                     │
         ┌───────────┼───────────┐
         ▼           ▼           ▼
    Lead Agent  Evidence    Interview
    Suspect     Timeline    Prosecutor
         │           │           │
         └───────────┼───────────┘
                     ▼
                 EXASOL DB          ◄── Investigation memory + analytics
```

## The Team of Agents

| Agent | Role |
|-------|------|
| 🕵️ **Lead Detective** | Directs the investigation, assigns tasks, evaluates findings |
| 🔬 **Evidence Analyst** | Analyzes physical/digital evidence, assigns reliability scores |
| 👤 **Suspect Analyst** | Profiles suspects: motive, opportunity, means, alibi |
| 🎤 **Interview Agent** | Generates targeted questions based on gaps and contradictions |
| ⏱️ **Timeline Agent** | Builds/validates timeline, detects contradictions |
| ⚖️ **Prosecutor** | Evaluates evidence sufficiency, prevents premature conclusions |

## Key Feature

> Agents don't have to solve the case. They know when they **cannot** solve it,
> explain why, identify the missing information, and propose the next investigative action.

## Tech Stack

- **Database**: Exasol (investigation memory + analytics)
- **Backend**: Node.js + Express + LangGraph.js
- **LLM**: OpenAI GPT-4o-mini
- **Frontend**: React + Vite + Tailwind CSS
- **Real-time**: WebSocket

## Setup

### Prerequisites

- Node.js 18+
- Exasol Personal Edition ([install](https://www.exasol.com/install/))
- OpenAI API key

### 1. Database

```bash
# Install Exasol Personal (if not already installed)
curl https://www.exasol.com/install/ | sh
exasol install local

# Run schema + seed data via Exasol SQL client
# Execute db/schema.sql then db/seed.sql
```

### 2. Backend

```bash
cd backend
npm install

# Edit .env with your API keys
# OPENAI_API_KEY=sk-your-key-here

npm run dev
# Server starts on http://localhost:3001
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
# UI starts on http://localhost:5173
```

### 4. Use it

1. Open `http://localhost:5173`
2. You'll see the demo case "The Locked Room Murder"
3. Click into the case → Click **Start Investigation**
4. Watch the agents discuss the case in real-time
5. See them analyze evidence, profile suspects, build timelines
6. When they get stuck → they tell you exactly what to do next

## Project Structure

```
exasol-hack/
├── frontend/          # React + Vite + Tailwind
├── backend/           # Node.js + Express + LangGraph
├── db/                # Exasol SQL schemas + seed data
│   ├── schema.sql     # 12 investigation tables
│   ├── seed.sql       # Sample murder case
│   └── queries.sql    # Analytical showcase queries
└── README.md
```

## Exasol Analytical Queries

The `db/queries.sql` file contains powerful analytical queries that showcase Exasol's value:

- **Contradiction Detection** — Find statements that conflict with evidence
- **Suspect Ranking** — Rank suspects by cumulative evidence weight
- **Timeline Gap Analysis** — Identify missing periods in the timeline
- **Investigation Bottleneck Analysis** — What's blocking progress
- **Cross-Case Pattern Matching** — Find similar patterns across cases

## License

MIT
