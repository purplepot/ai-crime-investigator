import { ChatGoogle } from "./geminiModel.js";
import { saveAgentMessage } from "../db/queries.js";

export const executeEvidenceAnalyst = async (state) => {
  const llm = new ChatGoogle({ model: "gemini-3.5-flash", temperature: 0.1 });

  const prompt = `You are a FORENSIC EVIDENCE ANALYST working a murder investigation.

CURRENT CASE DATA:
${JSON.stringify(state, null, 2)}

YOUR RESPONSIBILITIES:
1. Examine EACH piece of evidence individually
2. Determine what each evidence item tells us about the case
3. Assign reliability scores (0.0-1.0) based on type and source
4. Find connections between evidence items
5. Identify what additional forensic tests or evidence collection is needed
6. Flag any evidence that contradicts other evidence or statements

EVIDENCE ANALYSIS FRAMEWORK:
- PHYSICAL evidence (weapons, objects): What does it prove? Who had access?
- DIGITAL evidence (CCTV, phones, records): What timeline does it establish?
- FORENSIC evidence (fingerprints, DNA): Who does it connect to the scene?
- TESTIMONIAL evidence (statements): Does it align with physical evidence?

OUTPUT STRICT JSON (no markdown, no backticks):
{
  "agent_name": "Evidence Analyst",
  "message_type": "ANALYSIS",
  "summary": "Brief summary of evidence findings",
  "content": "Detailed evidence analysis (2-4 paragraphs covering key evidence items and their significance)",
  "evidence_analysis": [
    {
      "evidence_name": "name",
      "significance": "what it tells us",
      "reliability": 0.0 to 1.0,
      "connects_to": ["person or other evidence"],
      "gaps": "what we still need to know about this evidence"
    }
  ],
  "connections": ["evidence item A connects to B because..."],
  "recommended_tests": [
    {"action_type": "FORENSIC_TEST", "target": "what to test", "reason": "why", "priority": "HIGH"}
  ],
  "confidence": 0.0 to 1.0
}`;

  const response = await llm.invoke(prompt);
  let parsed;
  try {
    parsed = JSON.parse(response.content);
  } catch {
    parsed = {
      agent_name: "Evidence Analyst",
      message_type: "ANALYSIS",
      summary: "Evidence analysis in progress",
      content: response.content,
      evidence_analysis: [],
      connections: [],
      recommended_tests: [],
      confidence: 0.2
    };
  }

  await saveAgentMessage(
    state.caseId, 'evidence_analyst', 'Evidence Analyst',
    'ANALYSIS',
    parsed.content || parsed.summary,
    parsed.summary,
    state.stage
  );

  return parsed;
};
