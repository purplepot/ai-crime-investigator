# 🔍 AI Crime Investigator
### Autonomous Multi-Agent Forensic Swarm & Analytical Database Engine

**AI Crime Investigator** is an autonomous multi-agent forensic investigation system where dynamic swarms of specialized AI agents collaborate in real-time to solve complex criminal cases.

Unlike traditional LLM applications that hallucinate premature conclusions, this system employs a rigorous legal and analytical framework: agents cross-examine evidence, verify timelines, profile suspects using quantitative **MOMA** (Motive, Opportunity, Means, Alibi) metrics, and recognize when evidence is insufficient—transitioning into a structured **`WAITING`** state to prescribe exact forensic actions.

The system is powered by **Exasol DB** as its in-memory analytical memory, **LangGraph.js** as the dynamic state machine orchestration engine, **Google Gemini** with intelligent multi-model/multi-key failover as the reasoning backbone, and a **React 18** interface with real-time WebSocket telemetry.

---

## 🏛️ System Architecture

```
                                  USER INTERFACE
                          (React 18 + Vite + Tailwind CSS)
                       Light / Dark Mode • Dynamic Swarm Graph
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
     ┌───────────────────┬───────────────┼───────────────┬───────────────────┐
     ▼                   ▼               ▼               ▼                   ▼
👮 Coordinator       🔬 Forensics     👤 Profiler     ⏱️ Chronology   🎤 Interrogator  ⚖️ Legal Review
(e.g., Officer Davis) (e.g., Dr. Thorne) (MOMA Engine)  (e.g., Locksmith) (e.g., Det. Ruiz) (e.g., DA Walsh)
     │                   │               │               │                   │              │
     └───────────────────┴───────────────┼───────────────┴───────────────────┴──────────────┘
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

The foundational backbone of the system is **Exasol**, utilized as an **active, high-speed in-memory analytical database** that maintains the collective state, factual ground truth, forensic relationships, and dynamic character rosters for the AI agent swarm.

### 1. The `INVESTIGATION` Relational Schema (13 Tables)

The database models real-world forensic epistemology across 13 relational tables:

| Table | Purpose & Architecture |
|---|---|
| **`CASES`** | Primary case registry storing case metadata, confidence score (0–100%), stage tracking, and lifecycle status (`CREATED`, `ACTIVE`, `WAITING`, `RESOLVED`). |
| **`CASE_ROSTER`** | **Dynamic Character Roster.** Stores per-case investigator casts (`roster_id`, `case_id`, `agent_key`, `display_name`, `role_type`, `persona`, `initials`, `color`, `icon`, `sequence_order`). |
| **`PERSONS`** | Entities of interest categorized by role (`VICTIM`, `SUSPECT`, `WITNESS`, `OTHER`) with demographic and relationship data. |
| **`LOCATIONS`** | Physical scene anchors, rooms, zones, and security checkpoints with descriptions and case relevance. |
| **`EVIDENCE`** | Forensic artifacts categorized by type (`PHYSICAL`, `DIGITAL`, `FORENSIC`, `TESTIMONY`, `DOCUMENT`, `CCTV`), reliability index ($0.00 - 1.00$), and analysis state. |
| **`STATEMENTS`** | Formal interrogation records, witness accounts, referenced timestamps, and credibility weightings. |
| **`EVENTS`** | Chronological event logs reconstructed from digital telemetry, CCTV records, and physical traces, with verification flags. |
| **`SUSPECT_PROFILES`** | Quantitative **MOMA** framework profiles calculating motive, opportunity, means, alibi status (`VERIFIED`, `UNVERIFIED`, `BROKEN`), and cumulative suspicion score ($0.00 - 1.00$). |
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

### 3. Exasol Driver & Concurrency Architecture

* **WebSocket Driver Integration:** Direct connection to Exasol via `@exasol/exasol-driver-ts` over encrypted WebSocket channels.
* **Asynchronous Mutex Concurrency Layer:** Implemented an in-memory asynchronous Mutex in `backend/src/db/connection.js` to serialize high-throughput parallel queries emitted simultaneously by all agents during swarm execution.
* **Dynamic Column-to-Row Data Mapper:** Integrated bidirectional result set transformation (`backend/src/db/queries.js`) that translates Exasol's high-efficiency column-oriented data structures (`data[colIndex][rowIndex]`) into standard JavaScript row-oriented object arrays.

---

## 👥 Dynamic Per-Case Character Rosters & Orchestration

Instead of recycling the same static agents across every case, **AI Crime Investigator** dynamically loads unique character casts from the Exasol database.

Each character is defined in `CASE_ROSTER` and maps to one of **7 core analytical role frameworks**:

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
1. **`COORDINATOR`**: Directs the investigation team, defines lines of inquiry, and identifies critical information gaps.
2. **`FORENSICS`**: Examines physical, digital, and biological evidence; evaluates forensic reliability scores ($0.00 - 1.00$).
3. **`PROFILER`**: Evaluates Motive, Opportunity, Means, and Alibi (**MOMA**) to compute weighted suspicion scores.
4. **`SPECIALIST`**: Analyzes domain-specific artifacts (e.g. lock mechanisms, maritime customs manifests, hotel security systems).
5. **`WITNESS_ANALYST`**: Provides personal testimony, relationship context, and insider observations.
6. **`INTERROGATOR`**: Identifies statement contradictions and formulates targeted cross-examination questions.
7. **`LEGAL_REVIEW`**: Gatekeeper evaluating legal admissibility and reasonable doubt (`WAITING` vs `RESOLVED`).

---

## 📁 The 3 Seeded Cases & Character Casts

### 🔒 Case #1024: The Locked Room Murder
*Tech CEO John Harrison found dead in a study locked from the inside by a heavy brass deadbolt.*
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

To guarantee 100% uptime during high-concurrency investigations, `geminiModel.js` implements **two-dimensional fallback switching**:

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

## ✨ Frontend Features

* **Dynamic Network Topology Graph:** Adapts automatically to any case's character roster, rendering a 3-column layout with dynamic SVG bezier curves and active pulsing glow indicators.
* **Agent Log Stream Popover:** Click any investigator node to open their dedicated investigation log and reasoning chain in the bottom-right corner.
* **Multitask Split Workspace:** Pinned tabs (Swarm Network, Real-time Chat, Suspect Profiles, Evidence Locker, Timeline) ensure seamless multitasking.
* **Evidence Submission Portal:** Modal dialog to inject newly discovered physical artifacts, digital logs, statements, or location data into Exasol to unblock stalled cases.
* **Light & Dark Theme Support:** Instant theme toggle with CSS variable injection and persistent preference storage.

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
│   │   ├── components/        # Dynamic AgentGraph, Chat, StatusBadge, EvidenceModal, etc.
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
