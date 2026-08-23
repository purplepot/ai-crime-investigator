import { getDb } from './connection.js';
import crypto from 'crypto';

const mapResult = (result) => {
  if (!result || !result.resultSet || !result.resultSet.data || !result.resultSet.columns) return [];
  
  const cols = result.resultSet.columns.map(c => c.name.toLowerCase());
  const numRows = result.resultSet.numRows;
  
  // Exasol returns column-oriented data by default: data[colIndex][rowIndex]
  const isColumnOriented = result.resultSet.data.length === cols.length;
  
  const rows = [];
  for (let r = 0; r < numRows; r++) {
    const obj = {};
    for (let c = 0; c < cols.length; c++) {
      let val = isColumnOriented ? result.resultSet.data[c][r] : result.resultSet.data[r][c];
      let key = cols[c];
      
      // Map common snake_case DB columns to frontend camelCase / short names
      if (key.endsWith('_id') && key !== 'case_id' && key !== 'location_id' && key !== 'person_id') {
        // e.g. event_id -> id, evidence_id -> id
        obj['id'] = val;
      }
      if (key === 'case_id') obj['id'] = val; // Always expose 'id' for lists
      
      if (key === 'created_at') obj['createdAt'] = val;
      if (key === 'updated_at') obj['updatedAt'] = val;
      if (key === 'event_time') obj['eventTime'] = val;
      if (key === 'discovered_at') obj['discoveredAt'] = val;
      if (key === 'current_stage') obj['currentStage'] = val;
      
      obj[key] = val; // Also keep the original key for backend usage
    }
    rows.push(obj);
  }
  return rows;
};

// ─── CASES ────────────────────────────────────────────────────────
export const getAllCases = async () => {
  const db = await getDb();
  const resultRaw = await db.query('SELECT * FROM INVESTIGATION.CASES ORDER BY created_at DESC');
  return mapResult(resultRaw);
};

export const getCaseById = async (caseId) => {
  const db = await getDb();
  const resultRaw = await db.query(`SELECT * FROM INVESTIGATION.CASES WHERE case_id = '${caseId}'`);
  const rows = mapResult(resultRaw);
  return rows.length > 0 ? rows[0] : null;
};

export const createCase = async (data) => {
  const db = await getDb();
  const id = crypto.randomUUID();
  await db.execute(`INSERT INTO INVESTIGATION.CASES (case_id, title, description, status, current_stage, confidence) VALUES ('${id}', '${data.title.replace(/'/g, "''")}', '${data.description.replace(/'/g, "''")}', 'ACTIVE', 'INITIALIZATION', 0)`);
  return id;
};

export const updateCaseStatus = async (caseId, stateUpdate) => {
  const db = await getDb();
  
  let updates = [];
  if (stateUpdate.status) updates.push(`status = '${stateUpdate.status}'`);
  if (stateUpdate.current_stage) updates.push(`current_stage = '${stateUpdate.current_stage}'`);
  if (stateUpdate.confidence !== undefined) updates.push(`confidence = ${stateUpdate.confidence}`);
  
  if (updates.length > 0) {
    await db.execute(`UPDATE INVESTIGATION.CASES SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE case_id = '${caseId}'`);
  }
};
export const updateCaseState = updateCaseStatus;

// A re-run is a new investigation pass. Keep case evidence/persons/events, but
// remove derived outputs so stale messages and blocked actions cannot leak into it.
export const clearInvestigationRun = async (caseId) => {
  const db = await getDb();
  await db.execute(`DELETE FROM INVESTIGATION.AGENT_MESSAGES WHERE case_id = '${caseId}'`);
  await db.execute(`DELETE FROM INVESTIGATION.AGENT_ACTIONS WHERE case_id = '${caseId}'`);
  await db.execute(`DELETE FROM INVESTIGATION.INVESTIGATION_STATE WHERE case_id = '${caseId}'`);
  await updateCaseStatus(caseId, { status: 'ACTIVE', current_stage: 'INITIAL_ANALYSIS', confidence: 0 });
};

// ─── INVESTIGATION STATE ──────────────────────────────────────────
export const saveInvestigationState = async (caseId, stateJson) => {
  const db = await getDb();
  const stateId = crypto.randomUUID();
  await db.execute(`INSERT INTO INVESTIGATION.INVESTIGATION_STATE (state_id, case_id, state_json, version) VALUES ('${stateId}', '${caseId}', '${JSON.stringify(stateJson).replace(/'/g, "''")}', 1)`);
};

export const getLatestInvestigationState = async (caseId) => {
  const db = await getDb();
  const resultRaw = await db.query(`SELECT * FROM INVESTIGATION.INVESTIGATION_STATE WHERE case_id = '${caseId}' ORDER BY created_at DESC`);
  const rows = mapResult(resultRaw);
  if (rows && rows.length > 0) {
    return JSON.parse(rows[0].state_json);
  }
  return null;
};

// ─── PERSONS & SUSPECTS ───────────────────────────────────────────
export const getPersonsForCase = async (caseId) => {
  const db = await getDb();
  const resultRaw = await db.query(`SELECT * FROM INVESTIGATION.PERSONS WHERE case_id = '${caseId}' ORDER BY role, name`);
  return mapResult(resultRaw);
};

export const getSuspectsForCase = async (caseId) => {
  const db = await getDb();
  const resultRaw = await db.query(`SELECT * FROM INVESTIGATION.PERSONS WHERE case_id = '${caseId}' AND role = 'SUSPECT' ORDER BY name`);
  return mapResult(resultRaw);
};

export const upsertSuspectProfile = async (caseId, data) => {
  const db = await getDb();
  const id = crypto.randomUUID();
  await db.execute(`INSERT INTO INVESTIGATION.SUSPECT_PROFILES (profile_id, case_id, person_id, motive, opportunity, means, alibi_status, overall_suspicion, summary) VALUES ('${id}', '${caseId}', '${data.person_id}', '${String(data.motive ?? data.motive_score ?? 0).replace(/'/g, "''")}', '${String(data.opportunity ?? data.opportunity_score ?? 0).replace(/'/g, "''")}', '${String(data.means ?? data.means_score ?? 0).replace(/'/g, "''")}', '${data.alibi_status || 'UNKNOWN'}', ${data.overall_suspicion ?? 0}, '${(data.summary || '').replace(/'/g, "''")}')`);
  return id;
};

// ─── EVIDENCE ─────────────────────────────────────────────────────
export const getEvidenceForCase = async (caseId) => {
  const db = await getDb();
  const resultRaw = await db.query(`SELECT * FROM INVESTIGATION.EVIDENCE WHERE case_id = '${caseId}' ORDER BY created_at`);
  return mapResult(resultRaw);
};

export const insertEvidence = async (caseId, data) => {
  const db = await getDb();
  const id = crypto.randomUUID();
  await db.execute(`INSERT INTO INVESTIGATION.EVIDENCE (evidence_id, case_id, type, name, description, location, origin, reliability) VALUES ('${id}', '${caseId}', '${data.type || 'PHYSICAL'}', '${(data.name || '').replace(/'/g, "''")}', '${(data.description || '').replace(/'/g, "''")}', '${(data.location || '').replace(/'/g, "''")}', '${(data.origin || data.source || '').replace(/'/g, "''")}', ${data.reliability || 0.5})`);
  return id;
};

export const updateEvidenceAnalysis = async (evidenceId, analysis, status) => {
  const db = await getDb();
  await db.execute(`UPDATE INVESTIGATION.EVIDENCE SET analysis = '${analysis.replace(/'/g, "''")}', status = '${status}' WHERE evidence_id = '${evidenceId}'`);
};

// ─── EVENTS / TIMELINE ───────────────────────────────────────────
export const getEventsForCase = async (caseId) => {
  const db = await getDb();
  const resultRaw = await db.query(`SELECT * FROM INVESTIGATION.EVENTS WHERE case_id = '${caseId}' ORDER BY event_time ASC`);
  return mapResult(resultRaw);
};

export const insertEvent = async (caseId, data) => {
  const db = await getDb();
  const id = crypto.randomUUID();
  await db.execute(`INSERT INTO INVESTIGATION.EVENTS (event_id, case_id, event_time, description, location_id, origin, verified, confidence) VALUES ('${id}', '${caseId}', TIMESTAMP '${data.event_time}', '${(data.description || '').replace(/'/g, "''")}', '${data.location_id || ''}', '${(data.origin || data.source || '').replace(/'/g, "''")}', ${data.verified || false}, ${data.confidence || 0.5})`);
  return id;
};

// ─── STATEMENTS ───────────────────────────────────────────────────
export const getStatementsForCase = async (caseId) => {
  const db = await getDb();
  const resultRaw = await db.query(`SELECT s.*, p.name as person_name FROM INVESTIGATION.STATEMENTS s JOIN INVESTIGATION.PERSONS p ON s.person_id = p.person_id WHERE s.case_id = '${caseId}' ORDER BY s.created_at`);
  return mapResult(resultRaw);
};

export const getSuspectProfilesForCase = async (caseId) => {
  const db = await getDb();
  const resultRaw = await db.query(`SELECT sp.*, p.name, p.occupation, p.relationship, p.description as person_description FROM INVESTIGATION.SUSPECT_PROFILES sp JOIN INVESTIGATION.PERSONS p ON sp.person_id = p.person_id WHERE sp.case_id = '${caseId}' ORDER BY sp.overall_suspicion DESC`);
  return mapResult(resultRaw);
};

// ─── MESSAGES & ACTIONS ───────────────────────────────────────────
export const saveAgentMessage = async (caseId, agentId, ...args) => {
  const db = await getDb();
  const id = crypto.randomUUID();
  // Supports both the original compact form and the agents' richer form:
  // (caseId, agentId, content, type) or (caseId, agentId, agentName, type, content).
  const richForm = args.length >= 3;
  const agentName = richForm ? args[0] : agentId;
  const messageType = richForm ? args[1] : (args[1] || 'THOUGHT');
  const content = richForm ? args[2] : args[0];
  await db.execute(`INSERT INTO INVESTIGATION.AGENT_MESSAGES (message_id, case_id, agent_id, agent_name, message_type, content) VALUES ('${id}', '${caseId}', '${agentId}', '${agentName.replace(/'/g, "''")}', '${messageType}', '${(content || '').replace(/'/g, "''")}')`);
  return id;
};

export const getMessagesForCase = async (caseId) => {
  const db = await getDb();
  const resultRaw = await db.query(`SELECT * FROM INVESTIGATION.AGENT_MESSAGES WHERE case_id = '${caseId}' ORDER BY created_at ASC`);
  return mapResult(resultRaw);
};

export const saveAgentAction = async (caseId, agentId, action) => {
  const db = await getDb();
  const id = crypto.randomUUID();
  await db.execute(`INSERT INTO INVESTIGATION.AGENT_ACTIONS (action_id, case_id, agent_id, action_type, target, question, reason, priority, status) VALUES ('${id}', '${caseId}', '${agentId}', '${action.action_type || 'ANALYZE'}', '${(action.target || '').replace(/'/g, "''")}', '${(action.question || '').replace(/'/g, "''")}', '${(action.reason || '').replace(/'/g, "''")}', '${action.priority || 'MEDIUM'}', 'PENDING')`);
  return id;
};

export const getActionsForCase = async (caseId) => {
  const db = await getDb();
  const resultRaw = await db.query(`SELECT * FROM INVESTIGATION.AGENT_ACTIONS WHERE case_id = '${caseId}' ORDER BY CASE priority WHEN 'CRITICAL' THEN 1 WHEN 'HIGH' THEN 2 WHEN 'MEDIUM' THEN 3 WHEN 'LOW' THEN 4 END, created_at DESC`);
  return mapResult(resultRaw);
};

export const updateActionStatus = async (actionId, status, result) => {
  const db = await getDb();
  await db.execute(`UPDATE INVESTIGATION.AGENT_ACTIONS SET status = '${status}', "RESULT" = '${(result || '').replace(/'/g, "''")}', completed_at = CURRENT_TIMESTAMP WHERE action_id = '${actionId}'`);
};

export const getAgentMessages = getMessagesForCase;
export const getAgentActions = getActionsForCase;
export const getSuspectProfiles = getSuspectProfilesForCase;
export const getInvestigationState = getLatestInvestigationState;
