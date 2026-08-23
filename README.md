# 🔍 AI Crime Investigator
### Autonomous Multi-Agent Forensic Swarm & In-Memory Analytical Database Engine

**AI Crime Investigator** is a multi-agent forensic investigation system where autonomous swarms of specialized AI agents collaborate in real-time to solve complex homicide cases.

Unlike traditional LLM applications that hallucinate premature conclusions, this system enforces a rigorous legal and analytical framework: agents cross-examine evidence, reconstruct timelines, profile suspects using quantitative **MOMA** (Motive, Opportunity, Means, Alibi) metrics, and recognize when evidence is insufficient—transitioning into a structured **`WAITING`** state to prescribe exact forensic actions needed to proceed.

The system is powered by **Exasol DB** as its high-performance in-memory analytical relational memory, **LangGraph.js** as the dynamic state machine orchestration engine, **Google Gemini** with intelligent multi-model/multi-key failover as the reasoning backbone, and a **React 18** minimalist interface with real-time WebSocket telemetry.

## 🎬 Video Demonstration & Pitch Deck

* 🎥 **Video Demonstration & Project Walkthrough:** [Watch on Google Drive](https://drive.google.com/file/d/1IC_M9RkLj84B-t620IxXMRloJg_O0u2Y/view?usp=sharing)
* 📊 **Official Pitch Deck Presentation:** [View Slides on Google Docs](https://docs.google.com/presentation/d/1MaO4JPZqbYWCaFDfgs_xBxyjIXgStHaF/edit?usp=sharing&ouid=100561647106105216866&rtpof=true&sd=true)

---

## 🏛️ System Architecture

```
                                      USER INTERFACE
                             (React 18 + Vite + Tailwind CSS)
                      Light / Dark Mode • Dynamic Swarm Network Graph
                                             │
                                       WebSocket / REST
                                             │
                                             ▼
                                    NODE.JS BACKEND
                             (Express API + WebSocket Server)
                                             │
                                             ▼
                            DYNAMIC LANGGRAPH ORCHESTRATOR
                       (Data-Driven State Machine per Case Roster)
                                             │
       ┌─────────────────────┬───────────────┼───────────────┬─────────────────────┐
       ▼                     ▼               ▼               ▼                     ▼
👮 Officer Kowalski   🔦 Frankie Miller 📦 Agent Cross  🔬 Diver Hayes   🎤 Det. Carla Ruiz   ⚖️ DA Walsh
  (COORDINATOR)      (WITNESS ANALYST)  (SPECIALIST)    (FORENSICS)       (INTERROGATOR)    (LEGAL REVIEW)
       │                     │               │               │                     │              │
       └─────────────────────┴───────────────┼───────────────┴─────────────────────┴──────────────┘
                                             │
                                             ▼
                                         EXASOL DB
                     ┌───────────────────────────────────────────────┐
                     │  • In-Memory Analytical Relational Memory     │
                     │  • 13 Investigation Tables (`INVESTIGATION`)  │
                     │  • Dynamic Case Character Rosters             │
                     │  • Analytical SQL Contradiction Engine        │
                     │  • Versioned State Snapshots & Auditing       │
                     └───────────────────────────────────────────────┘
```

---

## 💾 Database Layer: Exasol as the Investigation Memory

The core backbone of the system is **Exasol**, utilized not merely as a passive data store, but as an **active, high-speed analytical relational memory engine** that maintains the collective state, factual ground truth, forensic cross-references, and dynamic character rosters for the AI agent swarm.

---

### ⚡ Why Exasol? How It Differs from Traditional SQL & Powers Our Swarm

| Feature | Traditional SQL (PostgreSQL, MySQL, SQLite) | Exasol In-Memory Analytical Database |
|---|---|---|
| **Storage Architecture** | **Row-Oriented Disk Storage:** Reads entire rows from disk/SSD into cache page-by-page. | **In-Memory Columnar Storage:** Entire database resides in RAM with columnar compression. Queries only load required columns, speeding up aggregations and analytical scans by **10x–100x**. |
| **Execution Model** | **Single-Threaded / OLTP Focused:** Optimized for single-row CRUD transactions; struggles under complex multi-table joins. | **Vectorized In-Memory Analytics:** Executes complex analytical joins (`JOIN`, `GROUP BY`, mathematical scoring) across millions of data points with vectorized CPU instructions in sub-milliseconds. |
| **Concurrency Under AI Swarms** | **Lock Contention:** Parallel multi-agent write operations frequently block or slow down analytical read queries. | **High-Throughput Concurrent Analytics:** Multiple agents read forensic evidence and write structured deductions simultaneously without table-level locking bottlenecks. |
| **Indexing & Performance Tuning** | **Manual B-Trees & Vacuums:** Requires manual index creation (`CREATE INDEX`), query planner hints, and periodic maintenance. | **Auto-Indexing & Self-Tuning:** Automatically builds in-memory hash indexes, join trees, and projection projections on the fly based on query patterns. |

---

#### 🧠 How Exasol Specifically Supercharges "AI Crime Investigator"

1. **Sub-Millisecond Contradiction Detection (Cross-Evidence Relational Joins):**
   - In a murder investigation, finding contradictions between suspect statements, CCTV camera logs, RFID gate telemetry, and forensic lab tests requires joining 4 to 5 relational tables simultaneously (`STATEMENTS` ⨝ `EVENTS` ⨝ `EVIDENCE` ⨝ `LOCATIONS`).
   - Exasol performs these multi-table joins directly in RAM in sub-milliseconds. Instead of feeding thousands of disorganized tokens to an LLM and hoping it notices a timeline mismatch, Exasol's analytical SQL engine computes the contradictions mathematically and delivers verified factual ground truth to the agents.

2. **High-Throughput Multi-Agent Concurrency Without Bottlenecks:**
   - During an active swarm run, 6 agents execute in parallel, reading case facts and simultaneously persisting actions, suspect profiles, forensic assessments, and messages.
   - Exasol's in-memory engine handles concurrent agent telemetry writes and analytical aggregations smoothly without lock contention or query stalls.

3. **In-Engine Forensic Scoring (Mathematical MOMA Model):**
   - The multi-dimensional MOMA scoring formula:
     $$\text{Suspicion} = \frac{(\text{Motive} \times 0.35) + (\text{Opportunity} \times 0.35) + (\text{Means} \times 0.15) + (\text{Alibi Deficit} \times 0.15)}{1.0}$$
     and suspect percentile rankings are computed directly within Exasol via analytical queries (`queries.sql`), offloading complex math from prompt tokens into Exasol's computation engine.

4. **Combatting LLM Hallucinations via Structured Relational Ground Truth:**
   - Traditional AI bots suffer from context degradation and hallucination when context windows grow large.
   - By using Exasol as the central relational memory, agents only receive structured, verified facts extracted via SQL queries. At the end of each run, an immutable snapshot of the entire knowledge graph is committed to `INVESTIGATION_STATE` for auditing, debugging, and point-in-time replayability.

5. **Data-Driven Dynamic Multi-Agent Orchestration (`CASE_ROSTER`):**
   - The swarm pipeline architecture is not hardcoded in JavaScript. The database stores the team roster, role frameworks, avatars, and execution order in `INVESTIGATION.CASE_ROSTER`. Exasol acts as the control plane that drives the dynamic LangGraph state machine.

---

### 1. The `INVESTIGATION` Relational Schema (13 Tables)

The database models real-world forensic epistemology across 13 relational tables:

| Table | Purpose & Architecture |
|---|---|
| **`CASES`** | Primary case registry storing case metadata, confidence score (0–100%), stage tracking, and lifecycle status (`CREATED`, `ACTIVE`, `WAITING`, `RESOLVED`). |
| **`CASE_ROSTER`** | **Dynamic Character Roster.** Stores per-case investigator casts (`roster_id`, `case_id`, `agent_key`, `display_name`, `role_type`, `persona`, `initials`, `color`, `icon`, `sequence_order`). |
| **`PERSONS`** | Entities of interest categorized by role (`VICTIM`, `SUSPECT`, `WITNESS`, `OTHER`) with demographic, occupation, and relationship data. |
| **`LOCATIONS`** | Physical scene anchors, rooms, zones, and security checkpoints with descriptions and case relevance. |
| **`EVIDENCE`** | Forensic artifacts categorized by type (`PHYSICAL`, `DIGITAL`, `FORENSIC`, `TESTIMONY`, `DOCUMENT`, `CCTV`), reliability index ($0.00 - 1.00$), and analysis state. |
| **`STATEMENTS`** | Formal interrogation records, witness accounts, referenced timestamps, and credibility weightings. |
| **`EVENTS`** | Chronological event logs reconstructed from digital telemetry, CCTV records, and physical traces, with verification flags. |
| **`SUSPECT_PROFILES`** | Quantitative **MOMA** framework profiles calculating motive, opportunity, means, alibi status (`VERIFIED`, `UNVERIFIED`, `BROKEN`, `CONTRADICTED`), and cumulative suspicion score ($0.00 - 1.00$). |
| **`HYPOTHESES`** | Plausible case theories formulated by agents, tracking supporting evidence, contradicting evidence, and confidence score. |
| **`INTERVIEWS`** | Recorded interview sessions conducted by agents with specific targets, goals, and transcripts. |
| **`AGENT_MESSAGES`** | High-throughput inter-agent communication stream capturing structured message types (`ANALYSIS`, `FINDING`, `QUESTION`, `DIRECTION`, `ALERT`, `CONCLUSION`). |
| **`AGENT_ACTIONS`** | Specific actionable investigative tasks assigned by agents (`FORENSIC_TEST`, `VERIFY_ALIBI`, `COLLECT_EVIDENCE`, `INTERVIEW`, `ANALYZE`), with priority and completion status. |
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

### 3. Exasol Deployment: Docker Container & Local Architecture

The database environment is designed for zero-configuration, production-grade local execution using Docker:

#### 🐳 Docker Container Configuration
The system leverages the official **`exasol/docker-db`** image, which spins up a standalone Exasol in-memory cluster running in an isolated Linux container:

```bash
# Pull and start the Exasol database container in background
docker run --name exasoldb \
  -p 8563:8563 \
  --detach \
  --privileged \
  exasol/docker-db:latest
```

* **Port Mapping (`-p 8563:8563`):** Forwards host TCP port `8563` to the internal Exasol WebSocket service.
* **In-Memory Analytical Engine:** Tables, indexes, and join hash trees reside in-memory with columnar compression, allowing sub-millisecond execution of complex multi-table analytical forensic queries.
* **Persistent Container Operations:**
  ```bash
  # Check container status
  docker ps -f name=exasoldb

  # Inspect database startup logs
  docker logs -f exasoldb

  # Restart / Stop container
  docker restart exasoldb
  docker stop exasoldb
  ```

---

#### 🔌 Local Driver Connection & Security
* **WebSocket Driver Integration:** Direct connection to Exasol via `@exasol/exasol-driver-ts` over encrypted WebSocket channels (`wss://localhost:8563`).
* **Self-Signed TLS Bypass for Local Dev:** Configured `NODE_TLS_REJECT_UNAUTHORIZED=0` in `.env` to allow seamless local development with Exasol's default TLS certificates.
* **System Credentials:** Uses standard administrative credentials (`sys` / `exasol`) connecting directly to the default database catalog.

---

#### 🚀 Automated Schema Initialization & Data Seeding
The backend includes an automated database lifecycle runner (`backend/src/db/schema.js`):
1. **Schema Check:** On server boot, connects to Exasol and checks if the `INVESTIGATION` schema exists.
2. **DDL Execution (`schema.sql`):** Creates all 13 relational tables if not already present.
3. **DML Seeding (`seed.sql`):** Populates the 3 comprehensive murder mystery cases, persons, evidence items, locations, statements, timeline events, and dynamic character rosters automatically.
4. **Idempotency:** Safe to run repeatedly on restarts without corrupting existing records or violating primary key constraints.

---

#### 🔒 Asynchronous Mutex & Column-to-Row Data Transformation
* **Asynchronous Mutex Concurrency Layer (`backend/src/db/connection.js`):** When 6 AI agents execute simultaneously in the LangGraph swarm, they generate concurrent read/write queries. An asynchronous Mutex serializes queries over the single underlying WebSocket channel, eliminating socket race conditions.
* **Dynamic Column-to-Row Data Mapper (`backend/src/db/queries.js`):** Exasol natively returns query results in column-oriented matrices (`data[colIndex][rowIndex]`). Our custom `mapResult()` transformer automatically transposes and maps column metadata into standard JavaScript object arrays consumed by the frontend and AI agents.

---

## 👥 Dynamic Per-Case Character Rosters & Orchestration

Instead of recycling the same static agents across every scenario, **AI Crime Investigator** dynamically loads unique character casts from the Exasol database.

Every case defines a custom roster in `CASE_ROSTER`, mapping each investigator or witness to one of **7 analytical role frameworks**:

```
CASE_ROSTER (Exasol)
┌────────────────────────────────────────────────────────────────────────┐
│ case_id │ agent_key      │ display_name           │ role_type          │
│ 1025    │ dr_thorne      │ Dr. Aris Thorne        │ FORENSICS          │
│ 1025    │ chief_bradley  │ Chief Bradley          │ SPECIALIST         │
│ 1025    │ julian_ashford │ Julian Ashford         │ WITNESS_ANALYST    │
│ 1025    │ agent_kapoor   │ Agent Priya Kapoor     │ PROFILER           │
│ 1025    │ inspector_moreau│ Inspector Moreau      │ COORDINATOR        │
│ 1025    │ prosecutor_holt│ Prosecutor Diane Holt  │ LEGAL_REVIEW       │
└────────────────────────────────────────────────────────────────────────┘
         │
         ▼
   ┌─────────────┐
   │ Graph Builder│──► Dynamically compiles LangGraph nodes in sequence_order
   └─────────────┘
         │
         ▼
   ┌─────────────┐
   │ Generic Agent│──► Injects character persona into analytical role prompt
   │   Executor  │    and executes LLM reasoning
   └─────────────┘
```

### The 7 Analytical Role Frameworks:
1. **`COORDINATOR`**: Directs the team, establishes lines of inquiry, and identifies critical information gaps.
2. **`FORENSICS`**: Examines physical, digital, and biological evidence; evaluates forensic reliability scores ($0.00 - 1.00$).
3. **`PROFILER`**: Evaluates Motive, Opportunity, Means, and Alibi (**MOMA**) to compute weighted suspicion scores.
4. **`SPECIALIST`**: Analyzes domain-specific artifacts (e.g., deadbolt mechanisms, maritime shipping logs, hotel keycard telemetry).
5. **`WITNESS_ANALYST`**: Provides personal testimony, relationship context, and insider observations.
6. **`INTERROGATOR`**: Identifies statement contradictions and formulates targeted cross-examination questions.
7. **`LEGAL_REVIEW`**: Gatekeeper evaluating legal admissibility and reasonable doubt (`WAITING` vs `RESOLVED`).

---

## 📁 The 3 Seeded Cases & Character Casts

### 🔒 Case #1024: The Locked Room Murder
*Tech CEO John Harrison found dead in a private study locked from the inside by a heavy brass deadbolt.*
- 👮 **Patrol Officer Davis** (`COORDINATOR`): First responder who breached the locked door.
- 🔬 **Forensics Lead Sterling** (`FORENSICS`): Fingerprint and blood spatter specialist.
- 🔑 **Master Locksmith Jenkins** (`SPECIALIST`): Physical security and deadbolt mechanism expert.
- 👩 **Claire Harrison** (`WITNESS_ANALYST`): Victim's sister providing personal and financial context.
- 🎤 **Det. Reynolds** (`INTERROGATOR`): Homicide interrogator probing alibi gaps.
- ⚖️ **ADA Kathleen Shaw** (`LEGAL_REVIEW`): Assistant District Attorney evaluating indictment sufficiency.

### 🥂 Case #1025: The Poisoned Gala
*Billionaire philanthropist Dr. Arthur Pendelton collapses from cyanide-laced champagne in a private VIP lounge.*
- 🩺 **Dr. Aris Thorne** (`FORENSICS`): Chief Medical Examiner & toxicologist.
- 🛡️ **Chief Bradley** (`SPECIALIST`): Hotel Head of Security tracking VIP keycard access.
- 🥂 **Julian Ashford** (`WITNESS_ANALYST`): Victim's lifelong friend and gala co-chair.
- 💻 **Agent Priya Kapoor** (`PROFILER`): Financial fraud investigator tracing offshore accounts.
- 🕵️ **Inspector Moreau** (`COORDINATOR`): Lead detective coordinating specialist findings.
- ⚖️ **Prosecutor Diane Holt** (`LEGAL_REVIEW`): Senior prosecutor evaluating chemical chain of custody.

### ⚓ Case #1026: The Midnight Pier Mystery
*Harbor Master Gregory Vance bludgeoned with an industrial bronze mooring wrench and thrown into the harbor basin.*
- 👮 **Officer Kowalski** (`COORDINATOR`): Harbor Patrol first responder securing the dock perimeter.
- 🔦 **Frankie Miller** (`WITNESS_ANALYST`): Dock night watchman ("Nightowl") and eyewitness.
- 📦 **Agent Maya Cross** (`SPECIALIST`): Maritime Customs agent tracing contraband shipping manifests.
- 🔬 **Forensic Diver Hayes** (`FORENSICS`): Dive unit leader analyzing the murder weapon and harbor silt.
- 🎤 **Det. Carla Ruiz** (`INTERROGATOR`): Maritime interrogator dismantling tide-based alibis.
- ⚖️ **District Attorney Walsh** (`LEGAL_REVIEW`): DA evaluating admissibility under port authority jurisdiction.

---

## ⚡ Multi-Model & Multi-Key Failover Engine

To guarantee resilience during high-concurrency investigations, `geminiModel.js` implements **two-dimensional fallback switching**:

1. **Intra-Key Model Switching**: If a model encounters a rate limit (429), quota exhaustion, temporary overload (503), or deprecation, it instantly attempts fallback models using the **same API key**:
   - `gemini-2.5-flash` → `gemini-2.0-flash` → `gemini-1.5-flash` → `gemini-2.5-pro` → `gemini-1.5-pro` → `gemini-3.5-flash` → `gemini-3-flash` → `gemini-3.6-flash` → `gemini-3.7-flash` → `gemini-3.1-pro`
2. **Key Cascading**: If all models for an API key are depleted or if a key is invalid/unauthorized (401/403), the engine instantly switches to the next fallback key (`GOOGLE_API_KEY_FALLBACK_1`, `GOOGLE_API_KEY_FALLBACK_2`, etc.) and retries the models.
3. **Zero-Delay Failover**: Uses `maxRetries: 0` on internal LangChain calls to bypass exponential backoffs and failover in milliseconds.

---

## 🔄 Investigation Lifecycle

```
[ Case Selected ] ──► Load Case Roster from Exasol
                              │
                              ▼
                      [ Start Investigation ]
                              │
                              ▼
                ┌───────────────────────────┐
                │   Dynamic LangGraph Pass  │
                │  • Coordinator Briefing   │
                │  • Specialist Findings    │
                │  • MOMA Suspect Profiling │
                │  • Witness Context        │
                │  • Cross-Examination Qs   │
                └─────────────┬─────────────┘
                              │
                              ▼
                [ Legal Review Gatekeeper ]
                     /                 \
                    /                   \
         Evidence Overwhelming?      Reasonable Doubt / Missing Evidence?
                  │                                    │
                  ▼                                    ▼
        ✅ Status: RESOLVED                  ⏳ Status: WAITING
        (Case Solved & Final Theory)         (Prescribes Specific Next Action)
                                                       │
                                                       ▼
                                          [ User Submits Required Evidence ]
                                                       │
                                                       └─► (Triggers Fresh Swarm Pass)
```

---

## ✨ Frontend Features & UI Showcase

The frontend is built with **React 18 + Vite + Tailwind CSS**, featuring a responsive minimalist dark aesthetic with real-time WebSocket state streaming:

### 📸 Core Application Views

#### 1. 🗂️ Active Investigations Dashboard
* **Master Case Registry:** Displays all active homicide cases with their live investigative confidence scores and stage markers.
* **Legal Status Badges:** Visual indicators highlighting cases in `ACTIVE`, `RESOLVED`, or `WAITING` states.

#### 2. 🕸️ Dynamic Swarm Architecture Network (`Live Routing`)
* **3-Column Forensic Pipeline:** Dynamically maps investigator roles into a clean 3-tier routing topology:
  - **Column 1 (Left):** First Responder / Scene Coordinator (e.g., `Officer Kowalski`).
  - **Column 2 (Center):** Parallel Forensic Specialists & Eyewitnesses (e.g., `Frankie Miller`, `Agent Maya Cross`, `Forensic Diver Hayes`, `Det. Carla Ruiz`).
  - **Column 3 (Right):** Legal Review Gatekeeper (e.g., `District Attorney Walsh`).
* **Responsive SVG Bezier Connectors:** Renders smooth curved connection paths calculated from live DOM coordinates.
* **Active Glow Telemetry:** Pulsing green indicators reflect the currently active agent streaming deductions.
* **Agent Log Stream Popover:** Clicking any investigator node opens their dedicated deduction stream in the bottom-right corner.

#### 3. 💬 Case View & Forensic Telemetry (`Swarm Chat & Prescribed Next Actions`)
* **High-Density Bulleted Chat:** Formats complex agent reasoning into concise, high-signal bulleted cards with bold headlines.
* **Legal Sufficiency Action Panel:** Highlights the Prosecutor's prescribed next step (e.g. `FORENSIC_TEST — Heavy Bronze Mooring Wrench`) and enables one-click evidence submission via `[SUBMIT REQUIRED EVIDENCE]`.
* **Rich Suspect Dossiers (MOMA Engine):** Cards featuring suspect biographies, relationship to victim, background connections, live MOMA score progress bars, and alibi verification badges.
* **Full Theme Support:** Instant toggle between Dark Mode and Light Mode with persistent local preferences.

---

## 🚀 Quick Start Guide

### Prerequisites
* **Node.js** v18 or higher
* **Exasol Database** (Local Docker instance or Cloud instance running on port `8563`)
* **Google Gemini API Key**

---

### Step 1: Database Setup

Start your Exasol instance:
```bash
# If using Exasol Docker
docker run --name exasoldb -p 8563:8563 -d exasol/docker-db:latest
```

The backend automatically executes `schema.sql` and `seed.sql` on startup, creating the `INVESTIGATION` schema and loading all 3 cases with their custom character rosters.

---

### Step 2: Backend Setup

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
GOOGLE_API_KEY=your_gemini_api_key_here
GOOGLE_API_KEY_FALLBACK_1=optional_backup_key_1
GOOGLE_API_KEY_FALLBACK_2=optional_backup_key_2
```

Start the backend server:
```bash
npm run dev
# Server running at http://localhost:3001
```

---

### Step 3: Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
# Web UI running at http://localhost:5173
```

---

### Step 4: Run an Investigation

1. Open `http://localhost:5173` in your browser.
2. Select any of the 3 cases: **"The Locked Room Murder"**, **"The Poisoned Gala"**, or **"The Midnight Pier Mystery"**.
3. View the unique character roster loaded dynamically from Exasol on the network graph.
4. Click **`INITIATE INVESTIGATION`**.
5. Watch the customized swarm analyze evidence, cross-examine suspects, and stream deductions in real-time over WebSocket.
6. When the case enters **`WAITING`**, review the legal reviewer's prescribed next step, submit the required evidence, and unblock the investigation!

---

## 📁 Repository Structure

```
exasol-hack/
├── backend/
│   ├── src/
│   │   ├── agents/            # Generic dynamic agent executor & Gemini failover wrapper
│   │   │   ├── genericAgent.js
│   │   │   └── geminiModel.js
│   │   ├── db/                # Exasol connection pool, mutex, queries, and schema loader
│   │   │   ├── connection.js
│   │   │   ├── queries.js
│   │   │   └── schema.js
│   │   ├── graph/             # Dynamic LangGraph builder & state definition
│   │   │   ├── investigationGraph.js
│   │   │   └── stateDefinition.js
│   │   ├── routes/            # Express REST API routes (cases, evidence, agents)
│   │   ├── services/          # Case & investigation pipeline orchestrators
│   │   ├── websocket/         # Real-time WebSocket event broadcaster
│   │   └── server.js          # Application entry point
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/        # Dynamic AgentGraph, Chat, SuspectCard, EvidenceModal, etc.
│   │   ├── hooks/             # WebSocket and REST API data hooks
│   │   ├── pages/             # Dashboard and CaseView pages
│   │   ├── stores/            # Zustand global state store (with roster support)
│   │   ├── App.jsx            # Main React routing and layout
│   │   └── index.css          # Theme variables & typography
│   ├── tailwind.config.js
│   └── package.json
├── db/
│   ├── schema.sql             # 13 Exasol investigation tables (DDL)
│   ├── seed.sql               # 3 unique cases and dynamic character rosters (DML)
│   └── queries.sql            # Analytical forensic SQL queries
└── README.md
```

---

## 📄 License

This project is open-source and available under the **MIT License**.
