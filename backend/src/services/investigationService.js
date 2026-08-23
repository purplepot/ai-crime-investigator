import { buildInvestigationGraph } from '../graph/investigationGraph.js';
import { createInitialState } from '../graph/stateDefinition.js';
import { 
  getCaseById, getEvidenceForCase, getPersonsForCase, 
  getStatementsForCase, getEventsForCase, updateCaseStatus,
  saveInvestigationState, saveAgentMessage, getRosterForCase
} from '../db/queries.js';
import { broadcast } from '../websocket/wsServer.js';

export const startInvestigation = async (caseId) => {
  try {
    const caseData = await getCaseById(caseId);
    if (!caseData) throw new Error(`Case ${caseId} not found`);

    const evidence = await getEvidenceForCase(caseId);
    const persons = await getPersonsForCase(caseId);
    const statements = await getStatementsForCase(caseId);
    const events = await getEventsForCase(caseId);
    
    const roster = await getRosterForCase(caseId);
    if (!roster || roster.length === 0) {
      throw new Error(`No investigation roster found for case ${caseId}. Please add characters to CASE_ROSTER.`);
    }

    const initialState = createInitialState(
      caseId, caseData, evidence, persons, statements, events
    );

    const initialStage = roster[0].agent_key.toUpperCase();

    await updateCaseStatus(caseId, { status: 'ACTIVE', current_stage: initialStage, confidence: 0 });

    broadcast({ type: 'state_update', payload: { 
      caseId, status: 'ACTIVE', stage: initialStage, confidence: 0 
    }});

    console.log(`Starting investigation for case ${caseId}`);

    const graph = buildInvestigationGraph(roster);
    const finalState = await graph.invoke(initialState);

    await saveInvestigationState(caseId, finalState);

    await updateCaseStatus(caseId, {
      status: finalState.status || 'BLOCKED',
      current_stage: finalState.stage || 'CASE_REVIEW',
      confidence: finalState.confidence || 0
    });

    console.log(`Investigation complete for case ${caseId}: ${finalState.status}`);

    return finalState;
  } catch (error) {
    console.error(`Investigation error for case ${caseId}:`, error);
    await updateCaseStatus(caseId, { status: 'BLOCKED', current_stage: 'BLOCKED', confidence: 0 });
    const failureMessage = `The AI investigation could not continue: ${error.message}`;
    try {
      await saveAgentMessage(caseId, 'system', 'Investigation System', 'ALERT', failureMessage, failureMessage, 'BLOCKED');
    } catch (saveError) {
      console.error('Unable to save investigation error message:', saveError.message);
    }
    broadcast({ type: 'agent_message', payload: {
      case_id: caseId, agent_id: 'system', agent_name: 'Investigation System',
      message_type: 'ALERT', content: failureMessage, created_at: new Date().toISOString()
    }});
    broadcast({ type: 'investigation_blocked', payload: { 
      case_id: caseId, 
      block_reason: `System error: ${error.message}`,
      recommended_action: { action_type: 'ANALYZE', target: 'System', reason: 'Investigation encountered an error', priority: 'CRITICAL' }
    }});
    throw error;
  }
};
