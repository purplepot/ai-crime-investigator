import { getDb } from '../db/connection.js';
import crypto from 'crypto';
import { saveInvestigationState } from '../db/queries.js';

export const createCase = async (caseData) => {
  const db = await getDb();
  const caseId = `case-${crypto.randomUUID().slice(0, 8)}`;
  const title = (caseData.title || 'New Case').replace(/'/g, "''");
  const description = (caseData.description || '').replace(/'/g, "''");

  await db.execute(`INSERT INTO INVESTIGATION.CASES (case_id, title, description, status, current_stage, confidence) VALUES ('${caseId}', '${title}', '${description}', 'CREATED', 'CASE_CREATED', 0.0)`);

  // Create initial investigation state
  const initialState = {
    caseId,
    stage: 'CASE_CREATED',
    status: 'CREATED',
    confidence: 0,
    knownFacts: [], unknowns: [], suspects: [], hypotheses: [],
    pendingActions: [], completedActions: [], contradictions: [], messages: [],
    _version: 0
  };
  await saveInvestigationState(caseId, initialState);

  // If persons are provided, insert them
  if (caseData.persons && Array.isArray(caseData.persons)) {
    for (const person of caseData.persons) {
      const personId = `person-${crypto.randomUUID().slice(0, 8)}`;
      const name = (person.name || 'Unknown').replace(/'/g, "''");
      const role = person.role || 'OTHER';
      const relationship = (person.relationship || '').replace(/'/g, "''");
      const desc = (person.description || '').replace(/'/g, "''");
      await db.execute(`INSERT INTO INVESTIGATION.PERSONS (person_id, case_id, name, age, occupation, role, relationship, description) VALUES ('${personId}', '${caseId}', '${name}', ${person.age || 0}, '${(person.occupation || '').replace(/'/g, "''")}', '${role}', '${relationship}', '${desc}')`);
    }
  }

  return { case_id: caseId, title: caseData.title, description: caseData.description, status: 'CREATED' };
};
