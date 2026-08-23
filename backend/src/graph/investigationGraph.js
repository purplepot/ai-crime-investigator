import { StateGraph, END, START } from "@langchain/langgraph";
import { Annotation } from "@langchain/langgraph";
import { executeGenericAgent } from "../agents/genericAgent.js";
import { broadcast } from "../websocket/wsServer.js";
import { updateCaseState } from "../db/queries.js";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const InvestigationState = Annotation.Root({
  caseId: Annotation({ reducer: (x, y) => y ?? x, default: () => "" }),
  stage: Annotation({ reducer: (x, y) => y ?? x, default: () => "CASE_CREATED" }),
  knownFacts: Annotation({ reducer: (x, y) => y ? [...new Set([...x, ...y])] : x, default: () => [] }),
  unknowns: Annotation({ reducer: (x, y) => y ? [...new Set([...x, ...y])] : x, default: () => [] }),
  suspects: Annotation({ reducer: (x, y) => y ?? x, default: () => [] }),
  hypotheses: Annotation({ reducer: (x, y) => y ? [...x, ...y] : x, default: () => [] }),
  pendingActions: Annotation({ reducer: (x, y) => y ? [...x, ...y] : x, default: () => [] }),
  completedActions: Annotation({ reducer: (x, y) => y ? [...x, ...y] : x, default: () => [] }),
  contradictions: Annotation({ reducer: (x, y) => y ? [...new Set([...x, ...y])] : x, default: () => [] }),
  confidence: Annotation({ reducer: (x, y) => y ?? x, default: () => 0 }),
  status: Annotation({ reducer: (x, y) => y ?? x, default: () => "ACTIVE" }),
  blockReason: Annotation({ reducer: (x, y) => y ?? x, default: () => "" }),
  recommendedAction: Annotation({ reducer: (x, y) => y ?? x, default: () => null }),
  messages: Annotation({ reducer: (x, y) => y ? [...x, ...y] : x, default: () => [] }),
  caseData: Annotation({ reducer: (x, y) => y ?? x, default: () => ({}) }),
  evidence: Annotation({ reducer: (x, y) => y ?? x, default: () => [] }),
  persons: Annotation({ reducer: (x, y) => y ?? x, default: () => [] }),
  statements: Annotation({ reducer: (x, y) => y ?? x, default: () => [] }),
  events: Annotation({ reducer: (x, y) => y ?? x, default: () => [] }),
});

export const buildInvestigationGraph = (roster) => {
  const graphBuilder = new StateGraph(InvestigationState);

  // Sort roster by sequence_order if not already sorted
  const sortedRoster = [...roster].sort((a, b) => (a.sequence_order || 0) - (b.sequence_order || 0));

  for (let i = 0; i < sortedRoster.length; i++) {
    const character = sortedRoster[i];
    const nodeKey = character.agent_key.toUpperCase();
    const nextNodeKey = i < sortedRoster.length - 1 ? sortedRoster[i + 1].agent_key.toUpperCase() : "RESOLVED";

    graphBuilder.addNode(nodeKey, async (state) => {
      // Broadcast stage change
      broadcast({ type: 'stage_change', payload: { stage: nodeKey, caseId: state.caseId } });
      
      await delay(1500);

      const result = await executeGenericAgent(character, state);

      broadcast({ type: 'agent_message', payload: { 
        agent_name: character.display_name, 
        agent_id: character.agent_key, 
        message_type: result.message_type, 
        content: result.content || result.summary, 
        case_id: state.caseId, 
        created_at: new Date().toISOString() 
      }});

      const baseUpdate = {
        messages: [{ agent: character.display_name, content: result.summary }]
      };

      if (character.role_type === 'COORDINATOR') {
        return {
          ...baseUpdate,
          stage: nextNodeKey,
          knownFacts: result.known_facts,
          unknowns: result.unknowns,
          confidence: result.confidence || 0.1
        };
      } else if (character.role_type === 'FORENSICS') {
        return {
          ...baseUpdate,
          stage: nextNodeKey,
          confidence: Math.max(state.confidence, result.confidence || 0.2)
        };
      } else if (character.role_type === 'PROFILER') {
        return {
          ...baseUpdate,
          stage: nextNodeKey,
          suspects: result.suspect_profiles || [],
          confidence: Math.max(state.confidence, result.confidence || 0.2)
        };
      } else if (character.role_type === 'SPECIALIST' || character.role_type === 'WITNESS_ANALYST') {
        return {
          ...baseUpdate,
          stage: nextNodeKey,
          knownFacts: result.key_findings || result.key_observations || [],
          confidence: Math.max(state.confidence, result.confidence || 0.2)
        };
      } else if (character.role_type === 'INTERROGATOR') {
        return {
          ...baseUpdate,
          stage: nextNodeKey,
          pendingActions: (result.recommended_actions || []).map(a => ({...a, agent: character.display_name})),
          confidence: Math.max(state.confidence, result.confidence || 0.2)
        };
      } else if (character.role_type === 'LEGAL_REVIEW') {
        const finalStatus = result.status === 'BLOCKED' ? 'BLOCKED' : 'RESOLVED';
        const finalStage = result.status === 'BLOCKED' ? 'BLOCKED' : 'RESOLVED';
        
        if (result.status === 'BLOCKED') {
          broadcast({ type: 'investigation_blocked', payload: {
            case_id: state.caseId,
            block_reason: result.block_reason,
            recommended_action: result.recommended_action
          }});
        }
        
        const finalUpdate = {
          ...baseUpdate,
          confidence: Math.max(state.confidence, result.confidence || 0.2),
          status: finalStatus,
          stage: finalStage,
          blockReason: result.block_reason,
          recommendedAction: result.recommended_action
        };
        
        await updateCaseState(state.caseId, finalUpdate);
        
        broadcast({ type: 'state_update', payload: {
          caseId: state.caseId,
          status: finalStatus,
          stage: finalStage,
          confidence: finalUpdate.confidence
        }});

        return finalUpdate;
      }
      
      // Fallback
      return {
        ...baseUpdate,
        stage: nextNodeKey,
        confidence: Math.max(state.confidence, result.confidence || 0.2)
      };
    });
  }

  // Chain edges
  if (sortedRoster.length > 0) {
    graphBuilder.addEdge(START, sortedRoster[0].agent_key.toUpperCase());
    
    for (let i = 0; i < sortedRoster.length - 1; i++) {
      graphBuilder.addEdge(sortedRoster[i].agent_key.toUpperCase(), sortedRoster[i + 1].agent_key.toUpperCase());
    }
    
    graphBuilder.addEdge(sortedRoster[sortedRoster.length - 1].agent_key.toUpperCase(), END);
  } else {
    graphBuilder.addEdge(START, END); // Fallback for empty roster
  }

  return graphBuilder.compile();
};
