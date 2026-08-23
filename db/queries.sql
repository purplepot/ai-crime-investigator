-- ============================================================
-- ANALYTICAL QUERIES — Showcasing Exasol's Value
-- ============================================================
-- These demonstrate why Exasol is more than "just a database"
-- ============================================================

OPEN SCHEMA INVESTIGATION;

-- -----------------------------------------------------------
-- 1. CONTRADICTION DETECTION
-- Find statements that conflict with evidence timestamps
-- -----------------------------------------------------------
SELECT 
    p.name AS suspect,
    s.content AS statement,
    s.timestamp_ref AS claimed_time,
    e.name AS evidence_name,
    ev.event_time AS actual_time,
    CASE 
        WHEN ABS(MINUTES_BETWEEN(s.timestamp_ref, ev.event_time)) > 30 
        THEN 'MAJOR CONTRADICTION'
        WHEN ABS(MINUTES_BETWEEN(s.timestamp_ref, ev.event_time)) > 10 
        THEN 'MINOR DISCREPANCY'
        ELSE 'CONSISTENT'
    END AS contradiction_level
FROM STATEMENTS s
JOIN PERSONS p ON s.person_id = p.person_id
CROSS JOIN EVENTS ev
LEFT JOIN EVIDENCE e ON ev.source = e.source
WHERE s.case_id = 'case-1024'
  AND ev.case_id = 'case-1024'
  AND p.role = 'SUSPECT'
  AND ev.verified = TRUE
ORDER BY contradiction_level, p.name;

-- -----------------------------------------------------------
-- 2. SUSPECT RANKING BY EVIDENCE WEIGHT
-- Rank suspects by cumulative evidence pointing at them
-- -----------------------------------------------------------
SELECT 
    p.name AS suspect,
    sp.motive_score,
    sp.opportunity_score,
    sp.means_score,
    sp.alibi_score,
    sp.alibi_status,
    ROUND((sp.motive_score + sp.opportunity_score + sp.means_score + (1 - sp.alibi_score)) / 4, 2) AS composite_suspicion,
    sp.summary
FROM SUSPECT_PROFILES sp
JOIN PERSONS p ON sp.person_id = p.person_id
WHERE sp.case_id = 'case-1024'
ORDER BY composite_suspicion DESC;

-- -----------------------------------------------------------
-- 3. TIMELINE GAP ANALYSIS
-- Find gaps in the timeline where events are missing
-- -----------------------------------------------------------
SELECT 
    ev1.event_time AS event_start,
    ev1.description AS event_description,
    ev2.event_time AS next_event,
    ev2.description AS next_description,
    MINUTES_BETWEEN(ev1.event_time, ev2.event_time) AS gap_minutes,
    CASE 
        WHEN MINUTES_BETWEEN(ev1.event_time, ev2.event_time) > 60 THEN 'CRITICAL GAP'
        WHEN MINUTES_BETWEEN(ev1.event_time, ev2.event_time) > 30 THEN 'SIGNIFICANT GAP'
        ELSE 'NORMAL'
    END AS gap_severity
FROM EVENTS ev1
JOIN EVENTS ev2 ON ev1.case_id = ev2.case_id 
    AND ev2.event_time = (
        SELECT MIN(event_time) 
        FROM EVENTS 
        WHERE case_id = ev1.case_id 
          AND event_time > ev1.event_time
    )
WHERE ev1.case_id = 'case-1024'
ORDER BY ev1.event_time;

-- -----------------------------------------------------------
-- 4. AGENT ACTIVITY ANALYSIS
-- Which agents are most active and what are they doing
-- -----------------------------------------------------------
SELECT 
    agent_name,
    message_type,
    COUNT(*) AS message_count,
    MIN(created_at) AS first_message,
    MAX(created_at) AS last_message
FROM AGENT_MESSAGES
WHERE case_id = 'case-1024'
GROUP BY agent_name, message_type
ORDER BY message_count DESC;

-- -----------------------------------------------------------
-- 5. INVESTIGATION BOTTLENECK ANALYSIS
-- What actions are blocking progress
-- -----------------------------------------------------------
SELECT 
    aa.action_type,
    aa.target,
    aa.reason,
    aa.priority,
    aa.status,
    aa.created_at,
    CASE 
        WHEN aa.status = 'PENDING' AND aa.priority = 'CRITICAL' THEN 'URGENT BLOCKER'
        WHEN aa.status = 'PENDING' AND aa.priority = 'HIGH' THEN 'BLOCKER'
        ELSE 'QUEUED'
    END AS bottleneck_level
FROM AGENT_ACTIONS aa
WHERE aa.case_id = 'case-1024'
  AND aa.status IN ('PENDING', 'IN_PROGRESS')
ORDER BY 
    CASE aa.priority 
        WHEN 'CRITICAL' THEN 1 
        WHEN 'HIGH' THEN 2 
        WHEN 'MEDIUM' THEN 3 
        WHEN 'LOW' THEN 4 
    END;

-- -----------------------------------------------------------
-- 6. EVIDENCE RELIABILITY OVERVIEW
-- Distribution of evidence quality for the case
-- -----------------------------------------------------------
SELECT 
    type AS evidence_type,
    COUNT(*) AS count,
    ROUND(AVG(reliability), 2) AS avg_reliability,
    ROUND(MIN(reliability), 2) AS min_reliability,
    ROUND(MAX(reliability), 2) AS max_reliability
FROM EVIDENCE
WHERE case_id = 'case-1024'
GROUP BY type
ORDER BY avg_reliability DESC;

-- -----------------------------------------------------------
-- 7. HYPOTHESIS EVOLUTION
-- Track how hypotheses change over time
-- -----------------------------------------------------------
SELECT 
    h.agent_id,
    h.hypothesis,
    h.confidence,
    h.status,
    h.supporting,
    h.contradicting,
    h.created_at,
    h.updated_at
FROM HYPOTHESES h
WHERE h.case_id = 'case-1024'
ORDER BY h.created_at ASC;

-- -----------------------------------------------------------
-- 8. CROSS-CASE PATTERN MATCHING
-- Find similar patterns across historical cases
-- -----------------------------------------------------------
SELECT 
    c.case_id,
    c.title,
    COUNT(DISTINCT e.evidence_id) AS evidence_count,
    COUNT(DISTINCT p.person_id) AS suspect_count,
    c.confidence AS final_confidence,
    c.status
FROM CASES c
LEFT JOIN EVIDENCE e ON c.case_id = e.case_id
LEFT JOIN PERSONS p ON c.case_id = p.case_id AND p.role = 'SUSPECT'
GROUP BY c.case_id, c.title, c.confidence, c.status
ORDER BY c.created_at DESC;
