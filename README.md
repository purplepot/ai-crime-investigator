# 🔍 AI Crime Investigator
### Autonomous Multi-Agent Forensic Swarm & Analytical Database Engine

**AI Crime Investigator** is an autonomous multi-agent forensic investigation system where a swarm of specialized AI agents collaborate in real-time to solve complex criminal cases. 

Unlike traditional LLM applications that hallucinate premature conclusions, this system employs a rigorous legal framework: agents cross-examine evidence, verify timelines, profile suspects using quantitative **MOMA** (Motive, Opportunity, Means, Alibi) metrics, and know when they **cannot** solve a case—transitioning into a structured **`WAITING`** state to prescribe exact forensic actions.

The system is powered by **Exasol DB** as its high-performance in-memory analytical memory, **LangGraph.js** as the agent orchestration state machine, **Google Gemini** as the reasoning backbone, and a **React 18** minimalist interface with real-time WebSocket telemetry.

---

## 🏛️ System Architecture

```
                                  USER INTERFACE
                          (React 18 + Vite + Tailwind CSS)
                           Light / Dark Mode • Dynamic Graph
                                         │
                                   WebSocket / REST
                                         │
                                         ▼
                                NODE.JS BACKEND
                         (Express API + WebSocket Server)
                                         │
                                         ▼
                               LANGGRAPH RUNTIME
                     (State Machine Orchestration Engine)
                                         │
     ┌───────────────────┬───────────────┼───────────────┬───────────────────┐
     ▼                   ▼               ▼               ▼                   ▼
🕵️ Lead Detective   🔬 Evidence      👤 Suspect     ⏱️ Timeline     🎤 Interview   ⚖️ Prosecutor
   (Coordinator)      (Forensics)     (MOMA Model)   (Chronology)    (Questioning)   (Legal Review)
     │                   │               │               │                   │              │
     └───────────────────┴───────────────┼───────────────┴───────────────────┴──────────────┘
                                         │
                                         ▼
                                     EXASOL DB
                 ┌───────────────────────────────────────────────┐
                 │  • In-Memory Analytical Relational Memory     │
                 │  • 12 Investigation Tables (`INVESTIGATION`)  │
                 │  • Analytical SQL Contradiction Engine        │
                 │  • Versioned State Snapshots & Auditing       │
                 └───────────────────────────────────────────────┘
```

---

## 💾 Database Layer: Exasol as the Investigation Memory

The core backbone of the system is **Exasol**, utilized not merely as a passive data store, but as an **active, high-speed analytical memory engine** that maintains the collective state, factual ground truth, and cross-evidence relationships for the AI agent swarm.

### 1. The `INVESTIGATION` Relational Schema (12 Tables)

The database models real-world forensic epistemology across 12 relational tables:

| Table | Purpose & Architecture |
|---|---|
| **`CASES`** | Primary case registry storing case metadata, confidence score (0–100%), stage tracking, and lifecycle status (`CREATED`, `ACTIVE`, `WAITING`, `RESOLVED`). |
| **`PERSONS`** | Entities of interest categorized by role (`VICTIM`, `SUSPECT`, `WITNESS`, `PERSON_OF_INTEREST`) with demographic and relationship data. |
| **`LOCATIONS`** | Physical scene anchors, rooms, zones, and security access points with coordinates. |
| **`EVIDENCE`** | Forensic artifacts categorized by type (`PHYSICAL`, `DIGITAL`, `FORENSIC`, `TESTIMONY`, `DOCUMENT`, `LOCATION`), reliability index ($0.00 - 1.00$), and analysis state. |
| **`STATEMENTS`** | Formal interrogation records, witness accounts, timestamps, locations, and credibility weightings. |
| **`EVENTS`** | Chronological event logs reconstructed from digital telemetry, CCTV records, and physical traces, with verification flags. |
| **`SUSPECT_PROFILES`** | Quantitative **MOMA** framework profiles calculating motive, opportunity, means, alibi status (`VERIFIED`, `UNVERIFIED`, `BROKEN`), and cumulative suspicion score ($0.00 - 1.00$). |
| **`HYPOTHESES`** | Plausible case theories formulated by agents, tracking supporting evidence, contradicting evidence, and plausibility score. |
| **`CONTRADICTIONS`** | Factual conflicts identified during cross-examination (e.g. alibi statements conflicting with CCTV event timestamps). |
| **`AGENT_MESSAGES`** | High-throughput inter-agent communication stream capturing structured message types (`ANALYSIS`, `FINDING`, `QUESTION`, `DIRECTION`, `ALERT`, `CONCLUSION`). |
| **`AGENT_ACTIONS`** | Specific actionable investigative tasks assigned by agents (`FORENSIC_TEST`, `VERIFY_ALIBI`, `COLLECT_EVIDENCE`, `INTERVIEW`), with priority and completion status. |
| **`INVESTIGATION_STATE`** | Immutable, versioned JSON state snapshots of the entire LangGraph knowledge graph for point-in-time auditing and replayability. |

---

### 2. Analytical Forensics SQL Engine (`db/queries.sql`)

The database executes complex analytical SQL queries to compute forensic insights directly in-engine:

* **Contradiction Detection Engine:** Performs relational joins across `STATEMENTS`, `EVENTS`, and `EVIDENCE` to identify temporal and spatial impossibilities (e.g., suspect claiming to be home while CCTV proves entry elsewhere).
* **Multi-Dimensional Suspect Ranking:** Computes weighted mathematical scores combining physical evidence reliability, alibi fragility, and motive strength to rank persons of interest.
* **Timeline Gap & Anomaly Analysis:** Detects unobserved critical intervals between timestamps in `EVENTS` to highlight windows of opportunity.
* **Investigation Bottleneck Identification:** Analyzes open `AGENT_ACTIONS` to pinpoint critical-path blockers preventing case resolution.
* **Cross-Case Pattern Matching:** Compares modus operandi and weapon characteristics across distinct cases.

---

### 3. Exasol Integration & Concurrency Management

* **WebSocket Driver Integration:** Direct connection to Exasol via `@exasol/exasol-driver-ts` over encrypted WebSocket channels.
* **Asynchronous Mutex Concurrency Layer:** Implemented an in-memory asynchronous Mutex in the Node.js database layer (`src/db/connection.js`) to serialize high-throughput parallel queries emitted simultaneously by all 6 agents during swarm execution.
* **Dynamic Column-to-Row Data Mapper:** Integrated bidirectional result set transformation (`src/db/queries.js`) that translates Exasol's high-efficiency column-oriented data structures into standard entity models consumed by the frontend and AI agents.

---

## 🤖 The 6-Agent Swarm

Each agent operates as a specialized autonomous node in the **LangGraph** state machine:

| Agent | Avatar | Role & Forensic Responsibility |
|---|:---:|---|
| **Lead Detective** | 🔵 `LD` | **Chief Coordinator.** Evaluates the case briefing, decomposes the investigation into sub-goals, and assigns targeted investigation directives to specialists. |
| **Evidence Analyst** | 🔷 `EA` | **Forensic Specialist.** Examines physical, digital, and biological evidence; assesses forensic reliability; identifies uncollected evidence. |
| **Suspect Analyst** | 🔴 `SA` | **Behavioral Profiler.** Applies the quantitative **MOMA** model (Motive, Opportunity, Means, Alibi) to calculate suspicion indices for each person of interest. |
| **Timeline Agent** | 🟠 `TA` | **Chronology Specialist.** Reconstructs minute-by-minute sequences from phone logs, CCTV records, and testimonies to pinpoint gaps and contradictions. |
| **Interview Agent** | 🟢 `IA` | **Interrogator.** Analyzes witness and suspect statements, identifying inconsistencies and formulating high-leverage interrogation questions. |
| **Prosecutor** | 🟣 `PR` | **Legal Review Gatekeeper.** Enforces strict legal sufficiency standards. Evaluates reasonable doubt, detects defense vulnerabilities, and renders the verdict (`WAITING` vs `RESOLVED`). |

---

## 🔄 Investigation Lifecycle

```
[ Case Created ] ──► [ Lead Detective Briefing ]
                             │
                             ▼
               ┌───────────────────────────┐
               │    Parallel Analysis      │
               │  • Evidence Evaluation    │
               │  • MOMA Suspect Profiling │
               │  • Timeline Construction  │
               │  • Witness Statement Exam │
               └─────────────┬─────────────┘
                             │
                             ▼
                  [ Gap & Contradiction Exam ]
                             │
                             ▼
               [ Prosecutor Legal Review ]
                    /                 \
                   /                   \
        Evidence Overwhelming?      Reasonable Doubt / Missing Evidence?
                 │                                    │
                 ▼                                    ▼
       ✅ Status: RESOLVED                  ⏳ Status: WAITING
       (Case Solved & Final Verdict)         (Specific Action Required)
                                                      │
                                                      ▼
                                         [ User Submits Evidence ]
                                                      │
                                                      └─► (Re-runs Swarm)
```

---

## ✨ Frontend Features

* **Interactive Swarm Architecture Network:** Real-time visual graph displaying the 6 agents with dynamic SVG bezier curve routing and active pulsing indicators.
* **Pinned Multitask Workspace:** Independent scroll zones ensure navigation tabs (Chat, Network, Evidence Registry, Suspects, Chronological Timeline) remain pinned during active review.
* **Agent Log Stream:** Click on any agent node in the network to open a dedicated log popover displaying their specific deductions, queries, and findings.
* **Full Light & Dark Theme Support:** Instant, persistent theme toggle with CSS variable injection and high-contrast typography.
* **Evidence Submission Portal:** Modal dialog to inject new physical items, documents, testimonies, or location data into Exasol to unblock stalled cases.

---

## 🚀 Quick Start Guide

### Prerequisites
* **Node.js** v18 or higher
* **Exasol Database** (Local or Cloud instance running on port `8563`)
* **Google Gemini API Key** (or OpenAI API Key)

---

### Step 1: Database Setup

Ensure your Exasol instance is running:
```bash
# If using Exasol Docker
docker run --name exasoldb -p 8563:8563 -d exasol/docker-db:latest
```

The backend automatically runs schema initialization and seed migration on startup, creating the `INVESTIGATION` schema and loading the sample case *"The Locked Room Murder"*.

---

### Step 2: Backend Configuration & Startup

```bash
cd backend
npm install
```

Configure your `.env` file in `backend/.env`:
```env
PORT=3001
EXASOL_HOST=localhost
EXASOL_PORT=8563
EXASOL_USER=sys
EXASOL_PASSWORD=exasol
GEMINI_API_KEY=your_gemini_api_key_here
```

Start the backend server:
```bash
npm run dev
# Backend API & WebSocket running at http://localhost:3001
```

---

### Step 3: Frontend Startup

```bash
cd ../frontend
npm install
npm run dev
# Frontend web interface running at http://localhost:5173
```

---

### Step 4: Run an Investigation

1. Open `http://localhost:5173` in your browser.
2. Select **"The Locked Room Murder"** from the dashboard.
3. Review the initial evidence, suspect profiles, and timeline events loaded from Exasol.
4. Click **`INITIATE INVESTIGATION`**.
5. Watch the 6 agents communicate over WebSocket, construct timelines, detect contradictions, and output findings.
6. When the investigation enters **`WAITING`**, review the Prosecutor's recommended next action, click **`SUBMIT REQUIRED EVIDENCE`** to provide the missing clue, and trigger re-analysis!

---

## 📁 Repository Structure

```
exasol-hack/
├── backend/
│   ├── src/
│   │   ├── agents/            # The 6 AI agent persona definitions & prompts
│   │   ├── db/                # Exasol connection pool, schema runner & query mapper
│   │   ├── graph/             # LangGraph state machine & state definitions
│   │   ├── routes/            # Express REST endpoints (cases, evidence, agents)
│   │   ├── services/          # Investigation & case management orchestrators
│   │   ├── websocket/         # Real-time WebSocket event broadcaster
│   │   └── server.js          # Application entry point
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/        # UI components (AgentGraph, Chat, Cards, Modals, Toggle)
│   │   ├── hooks/             # WebSocket and REST API data hooks
│   │   ├── pages/             # Dashboard and CaseView pages
│   │   ├── stores/            # Zustand global state store
│   │   ├── App.jsx            # Main React routing and navigation header
│   │   └── index.css          # Theme variables and global styling
│   ├── tailwind.config.js
│   └── package.json
├── db/
│   ├── schema.sql             # 12 Exasol investigation tables (DDL)
│   ├── seed.sql               # "The Locked Room Murder" seed dataset (DML)
│   └── queries.sql            # Analytical forensic showcase queries
└── README.md
```

---

## 📄 License

This project is open-source and available under the **MIT License**.
