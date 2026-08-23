-- ============================================================
-- MURDER MYSTERY AI AGENT SWARM — Exasol Database Schema
-- ============================================================
-- Investigation memory + evidence layer for multi-agent system
-- ============================================================

CREATE SCHEMA INVESTIGATION;
OPEN SCHEMA INVESTIGATION;

-- -----------------------------------------------------------
-- 1. CASES — Master case record
-- -----------------------------------------------------------
CREATE TABLE CASES (
    case_id         VARCHAR(36)   PRIMARY KEY,
    title           VARCHAR(500)  NOT NULL,
    description     VARCHAR(10000),
    status          VARCHAR(20)   DEFAULT 'CREATED',   -- CREATED, ACTIVE, BLOCKED, RESOLVED
    current_stage   VARCHAR(50)   DEFAULT 'CASE_CREATED',
    confidence      DECIMAL(5,4)  DEFAULT 0.0,         -- 0.0000 - 1.0000
    block_reason    VARCHAR(2000),
    created_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------
-- 2. PERSONS — All people related to a case
-- -----------------------------------------------------------
CREATE TABLE  PERSONS (
    person_id       VARCHAR(36)   PRIMARY KEY,
    case_id         VARCHAR(36)   NOT NULL,
    name            VARCHAR(200)  NOT NULL,
    age             INTEGER,
    occupation      VARCHAR(200),
    role            VARCHAR(50),   -- VICTIM, SUSPECT, WITNESS, OTHER
    relationship    VARCHAR(500),  -- relationship to victim
    description     VARCHAR(2000),
    created_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (case_id) REFERENCES CASES(case_id)
);

-- -----------------------------------------------------------
-- 3. EVIDENCE — Physical/digital evidence items
-- -----------------------------------------------------------
CREATE TABLE  EVIDENCE (
    evidence_id     VARCHAR(36)   PRIMARY KEY,
    case_id         VARCHAR(36)   NOT NULL,
    type            VARCHAR(50)   NOT NULL,  -- PHYSICAL, DIGITAL, FORENSIC, DOCUMENT, CCTV, TESTIMONY
    name            VARCHAR(200)  NOT NULL,
    description     VARCHAR(5000),
    location        VARCHAR(500),
    discovered_at   TIMESTAMP,
    origin          VARCHAR(200),
    reliability     DECIMAL(3,2)  DEFAULT 0.50,  -- 0.00 - 1.00
    status          VARCHAR(20)   DEFAULT 'UNPROCESSED',  -- UNPROCESSED, ANALYZED, CONTRADICTORY
    analysis        VARCHAR(5000),
    created_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (case_id) REFERENCES CASES(case_id)
);

-- -----------------------------------------------------------
-- 4. LOCATIONS — Places relevant to the case
-- -----------------------------------------------------------
CREATE TABLE  LOCATIONS (
    location_id     VARCHAR(36)   PRIMARY KEY,
    case_id         VARCHAR(36)   NOT NULL,
    name            VARCHAR(200)  NOT NULL,
    type            VARCHAR(50),   -- CRIME_SCENE, RESIDENCE, WORKPLACE, PUBLIC
    address         VARCHAR(500),
    description     VARCHAR(2000),
    relevance       VARCHAR(2000),
    created_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (case_id) REFERENCES CASES(case_id)
);

-- -----------------------------------------------------------
-- 5. EVENTS — Timeline events with timestamps
-- -----------------------------------------------------------
CREATE TABLE  EVENTS (
    event_id        VARCHAR(36)   PRIMARY KEY,
    case_id         VARCHAR(36)   NOT NULL,
    event_time      TIMESTAMP     NOT NULL,
    description     VARCHAR(2000) NOT NULL,
    location_id     VARCHAR(36),
    person_id       VARCHAR(36),
    origin          VARCHAR(200),  -- Who/what reported this event
    verified        BOOLEAN       DEFAULT FALSE,
    confidence      DECIMAL(3,2)  DEFAULT 0.50,
    created_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (case_id) REFERENCES CASES(case_id)
);

-- -----------------------------------------------------------
-- 6. INTERVIEWS — Interview sessions
-- -----------------------------------------------------------
CREATE TABLE  INTERVIEWS (
    interview_id    VARCHAR(36)   PRIMARY KEY,
    case_id         VARCHAR(36)   NOT NULL,
    person_id       VARCHAR(36)   NOT NULL,
    agent_id        VARCHAR(50)   NOT NULL,
    purpose         VARCHAR(1000),
    status          VARCHAR(20)   DEFAULT 'PENDING',  -- PENDING, COMPLETED, FOLLOW_UP
    summary         VARCHAR(5000),
    conducted_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (case_id) REFERENCES CASES(case_id)
);

-- -----------------------------------------------------------
-- 7. STATEMENTS — Recorded statements from persons
-- -----------------------------------------------------------
CREATE TABLE  STATEMENTS (
    statement_id    VARCHAR(36)   PRIMARY KEY,
    case_id         VARCHAR(36)   NOT NULL,
    person_id       VARCHAR(36)   NOT NULL,
    interview_id    VARCHAR(36),
    content         VARCHAR(10000) NOT NULL,
    timestamp_ref   TIMESTAMP,     -- What time the statement refers to
    confidence      DECIMAL(3,2)  DEFAULT 0.50,
    is_contradicted BOOLEAN       DEFAULT FALSE,
    contradiction   VARCHAR(2000),
    created_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (case_id) REFERENCES CASES(case_id)
);

-- -----------------------------------------------------------
-- 8. HYPOTHESES — Agent-generated hypotheses
-- -----------------------------------------------------------
CREATE TABLE  HYPOTHESES (
    hypothesis_id   VARCHAR(36)   PRIMARY KEY,
    case_id         VARCHAR(36)   NOT NULL,
    agent_id        VARCHAR(50)   NOT NULL,
    hypothesis      VARCHAR(5000) NOT NULL,
    supporting      VARCHAR(5000),  -- Supporting evidence/reasoning
    contradicting   VARCHAR(5000),  -- Contradicting evidence/reasoning
    confidence      DECIMAL(3,2)  DEFAULT 0.50,
    status          VARCHAR(20)   DEFAULT 'ACTIVE',  -- ACTIVE, SUPPORTED, REFUTED, SUPERSEDED
    created_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (case_id) REFERENCES CASES(case_id)
);

-- -----------------------------------------------------------
-- 9. SUSPECT_PROFILES — Per-suspect analysis
-- -----------------------------------------------------------
CREATE TABLE  SUSPECT_PROFILES (
    profile_id      VARCHAR(36)   PRIMARY KEY,
    case_id         VARCHAR(36)   NOT NULL,
    person_id       VARCHAR(36)   NOT NULL,
    motive_score    DECIMAL(3,2)  DEFAULT 0.00,  -- 0.00 = unknown, 1.00 = strong
    motive_detail   VARCHAR(2000),
    opportunity_score DECIMAL(3,2) DEFAULT 0.00,
    opportunity_detail VARCHAR(2000),
    means_score     DECIMAL(3,2)  DEFAULT 0.00,
    means_detail    VARCHAR(2000),
    alibi_score     DECIMAL(3,2)  DEFAULT 0.00,  -- 0 = unverified, 1 = confirmed
    alibi_detail    VARCHAR(2000),
    alibi_status    VARCHAR(20)   DEFAULT 'UNKNOWN',  -- UNKNOWN, UNVERIFIED, VERIFIED, BROKEN
    overall_suspicion DECIMAL(3,2) DEFAULT 0.00,
    summary         VARCHAR(5000),
    created_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (case_id) REFERENCES CASES(case_id)
);

-- -----------------------------------------------------------
-- 10. AGENT_MESSAGES — Inter-agent communication log
-- -----------------------------------------------------------
CREATE TABLE  AGENT_MESSAGES (
    message_id      VARCHAR(36)   PRIMARY KEY,
    case_id         VARCHAR(36)   NOT NULL,
    agent_id        VARCHAR(50)   NOT NULL,      -- Sender agent
    agent_name      VARCHAR(100)  NOT NULL,      -- Display name
    receiver_id     VARCHAR(50),                  -- Receiver agent (NULL = broadcast)
    message_type    VARCHAR(30)   NOT NULL,       -- ANALYSIS, FINDING, QUESTION, DIRECTION, ALERT, CONCLUSION
    content         VARCHAR(10000) NOT NULL,
    reasoning       VARCHAR(5000),
    stage           VARCHAR(50),
    created_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (case_id) REFERENCES CASES(case_id)
);

-- -----------------------------------------------------------
-- 11. AGENT_ACTIONS — Structured actions agents propose
-- -----------------------------------------------------------
CREATE TABLE  AGENT_ACTIONS (
    action_id       VARCHAR(36)   PRIMARY KEY,
    case_id         VARCHAR(36)   NOT NULL,
    agent_id        VARCHAR(50)   NOT NULL,
    action_type     VARCHAR(30)   NOT NULL,  -- INTERVIEW, INVESTIGATE_LOCATION, FORENSIC_TEST, VERIFY_ALIBI, COLLECT_EVIDENCE, ANALYZE
    target          VARCHAR(200),
    target_id       VARCHAR(36),
    question        VARCHAR(2000),
    reason          VARCHAR(2000),
    priority        VARCHAR(10)   DEFAULT 'MEDIUM',  -- LOW, MEDIUM, HIGH, CRITICAL
    status          VARCHAR(20)   DEFAULT 'PENDING',  -- PENDING, IN_PROGRESS, COMPLETED, CANCELLED
    "RESULT"          VARCHAR(5000),
    created_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    completed_at    TIMESTAMP,
    FOREIGN KEY (case_id) REFERENCES CASES(case_id)
);

-- -----------------------------------------------------------
-- 12. INVESTIGATION_STATE — Full state snapshot (JSON blob)
-- -----------------------------------------------------------
CREATE TABLE  INVESTIGATION_STATE (
    state_id        VARCHAR(36)   PRIMARY KEY,
    case_id         VARCHAR(36)   NOT NULL,
    state_json      VARCHAR(2000000),  -- Full state as JSON
    version         INTEGER       DEFAULT 1,
    created_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (case_id) REFERENCES CASES(case_id)
);

-- -----------------------------------------------------------
-- 13. CASE_ROSTER — Per-case investigation team characters
-- -----------------------------------------------------------
CREATE TABLE  CASE_ROSTER (
    roster_id       VARCHAR(36)   PRIMARY KEY,
    case_id         VARCHAR(36)   NOT NULL,
    agent_key       VARCHAR(50)   NOT NULL,      -- Unique key within this case (e.g., officer_davis)
    display_name    VARCHAR(200)  NOT NULL,      -- UI display name
    role_type       VARCHAR(30)   NOT NULL,      -- COORDINATOR, FORENSICS, PROFILER, SPECIALIST, WITNESS_ANALYST, INTERROGATOR, LEGAL_REVIEW
    persona         VARCHAR(5000),               -- Character background injected into LLM prompt
    initials        VARCHAR(5),                  -- Avatar initials (e.g., PD, FS)
    color           VARCHAR(30)   DEFAULT 'slate', -- Tailwind color key
    icon            VARCHAR(30)   DEFAULT 'user',  -- Lucide icon name
    sequence_order  INTEGER       NOT NULL,      -- Execution order in the pipeline (1, 2, 3...)
    created_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (case_id) REFERENCES CASES(case_id)
);
