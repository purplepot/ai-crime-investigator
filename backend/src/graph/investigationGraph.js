import { StateGraph, END, START } from "@langchain/langgraph";
import { Annotation } from "@langchain/langgraph";
import { executeLeadDetective } from "../agents/leadDetective.js";
import { executeEvidenceAnalyst } from "../agents/evidenceAnalyst.js";
import { executeSuspectAnalyst } from "../agents/suspectAnalyst.js";
import { executeInterviewAgent } from "../agents/interviewAgent.js";
import { executeTimelineAgent } from "../agents/timelineAgent.js";
import { executeProsecutorAgent } from "../agents/prosecutorAgent.js";
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
  // Data from DB injected before graph starts
  caseData: Annotation({ reducer: (x, y) => y ?? x, default: () => ({}) }),
  evidence: Annotation({ reducer: (x, y) => y ?? x, default: () => [] }),
  persons: Annotation({ reducer: (x, y) => y ?? x, default: () => [] }),
  statements: Annotation({ reducer: (x, y) => y ?? x, default: () => [] }),
  events: Annotation({ reducer: (x, y) => y ?? x, default: () => [] }),
});

const buildGraph = () => {
  const workflow = new StateGraph(InvestigationState);

  // ── Node 1: Lead Detective Initial Analysis ──
  workflow.addNode("INITIAL_ANALYSIS", async (state) => {
    broadcast({ type: "stage_change", payload: { stage: "INITIAL_ANALYSIS", caseId: state.caseId } });
    await delay(1500);
    
    const result = await executeLeadDetective(state);
    
    broadcast({ type: "agent_message", payload: { 
      agent_name: "Lead Detective", agent_id: "lead_detective",
      message_type: "DIRECTION", content: result.content || result.summary,
      case_id: state.caseId, created_at: new Date().toISOString()
    }});

    return { 
      stage: "EVIDENCE_ANALYSIS", 
      knownFacts: result.knownFacts || result.known_facts,
      unknowns: result.unknowns,
      confidence: result.confidence || 0.1,
      messages: [{ agent: "Lead Detective", content: result.summary }]
    };
  });

  // ── Node 2: Evidence Analysis ──
  workflow.addNode("EVIDENCE_ANALYSIS", async (state) => {
    broadcast({ type: "stage_change", payload: { stage: "EVIDENCE_ANALYSIS", caseId: state.caseId } });
    await delay(1500);
    
    const result = await executeEvidenceAnalyst(state);
    
    broadcast({ type: "agent_message", payload: {
      agent_name: "Evidence Analyst", agent_id: "evidence_analyst",
      message_type: "ANALYSIS", content: result.content || result.summary,
      case_id: state.caseId, created_at: new Date().toISOString()
    }});

    return { 
      stage: "SUSPECT_ANALYSIS",
      confidence: Math.max(state.confidence, result.confidence || 0.2),
      messages: [{ agent: "Evidence Analyst", content: result.summary }]
    };
  });

  // ── Node 3: Suspect Analysis ──
  workflow.addNode("SUSPECT_ANALYSIS", async (state) => {
    broadcast({ type: "stage_change", payload: { stage: "SUSPECT_ANALYSIS", caseId: state.caseId } });
    await delay(1500);
    
    const result = await executeSuspectAnalyst(state);
    
    broadcast({ type: "agent_message", payload: {
      agent_name: "Suspect Analyst", agent_id: "suspect_analyst",
      message_type: "ANALYSIS", content: result.content || result.summary,
      case_id: state.caseId, created_at: new Date().toISOString()
    }});

    return { 
      stage: "TIMELINE_CONSTRUCTION",
      suspects: result.suspect_profiles || [],
      confidence: Math.max(state.confidence, result.confidence || 0.3),
      messages: [{ agent: "Suspect Analyst", content: result.summary }]
    };
  });

  // ── Node 4: Timeline Construction ──
  workflow.addNode("TIMELINE_CONSTRUCTION", async (state) => {
    broadcast({ type: "stage_change", payload: { stage: "TIMELINE_CONSTRUCTION", caseId: state.caseId } });
    await delay(1500);
    
    const result = await executeTimelineAgent(state);
    
    broadcast({ type: "agent_message", payload: {
      agent_name: "Timeline Agent", agent_id: "timeline_agent",
      message_type: "FINDING", content: result.content || result.summary,
      case_id: state.caseId, created_at: new Date().toISOString()
    }});

    const contradictions = (result.contradictions || []).map(c => 
      typeof c === 'string' ? c : c.description
    );

    return { 
      stage: "GAP_ANALYSIS",
      contradictions,
      confidence: Math.max(state.confidence, result.confidence || 0.4),
      messages: [{ agent: "Timeline Agent", content: result.summary }]
    };
  });

  // ── Node 5: Interview / Gap Analysis ──
  workflow.addNode("GAP_ANALYSIS", async (state) => {
    broadcast({ type: "stage_change", payload: { stage: "GAP_ANALYSIS", caseId: state.caseId } });
    await delay(1500);
    
    const result = await executeInterviewAgent(state);
    
    broadcast({ type: "agent_message", payload: {
      agent_name: "Interview Agent", agent_id: "interview_agent",
      message_type: "QUESTION", content: result.content || result.summary,
      case_id: state.caseId, created_at: new Date().toISOString()
    }});

    const actions = (result.recommended_actions || []).map(a => ({
      ...a, agent: "Interview Agent"
    }));

    return { 
      stage: "CASE_REVIEW",
      pendingActions: actions,
      confidence: Math.max(state.confidence, result.confidence || 0.5),
      messages: [{ agent: "Interview Agent", content: result.summary }]
    };
  });

  // ── Node 6: Prosecutor Review ──
  workflow.addNode("CASE_REVIEW", async (state) => {
    broadcast({ type: "stage_change", payload: { stage: "CASE_REVIEW", caseId: state.caseId } });
    await delay(1500);
    
    const result = await executeProsecutorAgent(state);
    
    broadcast({ type: "agent_message", payload: {
      agent_name: "Prosecutor", agent_id: "prosecutor",
      message_type: "CONCLUSION", content: result.content || result.summary,
      case_id: state.caseId, created_at: new Date().toISOString()
    }});

    const newState = {
      confidence: result.confidence || state.confidence,
      status: result.status || "BLOCKED",
      messages: [{ agent: "Prosecutor", content: result.summary }]
    };

    if (result.status === "BLOCKED") {
      newState.blockReason = result.block_reason || "Insufficient evidence to proceed";
      newState.recommendedAction = result.recommended_action || null;
      newState.stage = "BLOCKED";
      
      broadcast({ type: "investigation_blocked", payload: {
        case_id: state.caseId,
        block_reason: newState.blockReason,
        recommended_action: newState.recommendedAction,
        confidence: newState.confidence
      }});
    } else {
      newState.stage = "RESOLVED";
    }

    // Save final state to DB
    try {
      await updateCaseState(state.caseId, { ...state, ...newState });
    } catch (e) {
      console.error('Error saving final state:', e.message);
    }

    broadcast({ type: "state_update", payload: { ...state, ...newState } });

    return newState;
  });

  // ── Edges ──
  workflow.addEdge(START, "INITIAL_ANALYSIS");
  workflow.addEdge("INITIAL_ANALYSIS", "EVIDENCE_ANALYSIS");
  workflow.addEdge("EVIDENCE_ANALYSIS", "SUSPECT_ANALYSIS");
  workflow.addEdge("SUSPECT_ANALYSIS", "TIMELINE_CONSTRUCTION");
  workflow.addEdge("TIMELINE_CONSTRUCTION", "GAP_ANALYSIS");
  workflow.addEdge("GAP_ANALYSIS", "CASE_REVIEW");
  workflow.addEdge("CASE_REVIEW", END);

  return workflow.compile();
};

export const investigationGraph = buildGraph();
