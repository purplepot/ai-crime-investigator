import { ChatGoogle } from "./geminiModel.js";
import { saveAgentMessage, saveAgentAction } from "../db/queries.js";

export const executeProsecutorAgent = async (state) => {
  const llm = new ChatGoogle({ model: "gemini-3.5-flash", temperature: 0.1 });

  const prompt = `You are a PROSECUTOR / CASE REVIEWER evaluating a murder investigation.

CURRENT CASE DATA:
${JSON.stringify(state, null, 2)}

YOUR RESPONSIBILITIES:
1. Critically evaluate whether the CURRENT EVIDENCE is sufficient to:
   a) Identify a primary suspect
   b) Build a coherent case theory
   c) Address potential defense arguments
2. List what evidence is STRONG and what is WEAK
3. Identify what is MISSING that would make the case stronger
4. Determine if the investigation should CONTINUE or is BLOCKED

EVALUATION CRITERIA:
- Is there a clear motive established for any suspect?
- Is there physical evidence connecting a suspect to the crime?
- Has the timeline been verified independently?
- Are there unresolved contradictions?
- Could a defense attorney create reasonable doubt?

CRITICAL RULE: You MUST err on the side of INSUFFICIENT EVIDENCE.
- If alibis are unverified → BLOCKED
- If contradictions are unexplained → BLOCKED
- If motive is unclear for the top suspect → BLOCKED
- Only mark RESOLVED if evidence is overwhelming

When BLOCKED, you MUST provide a specific, actionable next step.

OUTPUT STRICT JSON (no markdown, no backticks):
{
  "agent_name": "Prosecutor",
  "message_type": "CONCLUSION",
  "summary": "Brief verdict on investigation status",
  "content": "Detailed case review explaining the strength of evidence and what's needed (3-4 paragraphs)",
  "status": "BLOCKED" or "RESOLVED",
  "confidence": 0.0 to 1.0,
  "strong_evidence": ["list of strong evidence items"],
  "weak_evidence": ["list of weak evidence items"],
  "missing_evidence": ["what we still need"],
  "contradictions_unresolved": ["unresolved contradictions"],
  "block_reason": "If BLOCKED: specific explanation of why (required if BLOCKED)",
  "recommended_action": {
    "action_type": "INTERVIEW | INVESTIGATE_LOCATION | FORENSIC_TEST | VERIFY_ALIBI | COLLECT_EVIDENCE",
    "target": "who or what",
    "question": "specific question if interview",
    "reason": "why this is the most important next step",
    "priority": "CRITICAL"
  },
  "case_theory": "If there's enough evidence, a brief theory of what happened",
  "defense_vulnerabilities": ["what a defense attorney would attack"]
}`;

  const response = await llm.invoke(prompt);
  let parsed;
  try {
    parsed = JSON.parse(response.content);
  } catch {
    parsed = {
      agent_name: "Prosecutor",
      message_type: "CONCLUSION",
      summary: "Case review in progress",
      content: response.content,
      status: "BLOCKED",
      confidence: 0.3,
      strong_evidence: [],
      weak_evidence: [],
      missing_evidence: [],
      contradictions_unresolved: [],
      block_reason: "Unable to parse LLM response — manual review needed",
      recommended_action: { action_type: "ANALYZE", target: "Full case", reason: "Re-evaluation needed", priority: "HIGH" }
    };
  }

  await saveAgentMessage(
    state.caseId, 'prosecutor', 'Prosecutor',
    'CONCLUSION',
    parsed.content || parsed.summary,
    parsed.summary,
    state.stage
  );

  // Save recommended action if blocked
  if (parsed.status === 'BLOCKED' && parsed.recommended_action) {
    try {
      await saveAgentAction(state.caseId, 'prosecutor', parsed.recommended_action);
    } catch (e) {
      console.error('Error saving prosecutor action:', e.message);
    }
  }

  return parsed;
};
