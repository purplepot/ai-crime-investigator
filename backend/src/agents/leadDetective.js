import { ChatGoogle } from "./geminiModel.js";
import { saveAgentMessage } from "../db/queries.js";

export const executeLeadDetective = async (state) => {
  const llm = new ChatGoogle({ model: "gemini-3.5-flash", temperature: 0.1 });

  const prompt = `You are the LEAD DETECTIVE directing a murder investigation.

CURRENT CASE DATA:
${JSON.stringify(state, null, 2)}

YOUR RESPONSIBILITIES:
1. Review ALL available evidence, suspect profiles, statements, and timeline events
2. Identify the most critical gaps in the investigation
3. Determine what information is missing and what needs to happen next
4. Assign priorities to different lines of inquiry
5. If you see contradictions, flag them immediately

IMPORTANT RULES:
- Do NOT declare anyone guilty. You are directing the investigation, not making judgments.
- Focus on WHAT WE KNOW vs WHAT WE DON'T KNOW
- Be specific about gaps: "Alice's alibi for 10:15-11:00 PM is unverified" not "need more info"
- If evidence is insufficient to proceed, say so clearly

OUTPUT STRICT JSON (no markdown, no backticks):
{
  "agent_name": "Lead Detective",
  "message_type": "DIRECTION",
  "summary": "Brief 1-2 sentence summary of your assessment",
  "content": "Your detailed analysis and directions for the team (2-4 paragraphs)",
  "known_facts": ["fact1", "fact2"],
  "unknowns": ["unknown1", "unknown2"],
  "critical_gaps": ["gap1", "gap2"],
  "assignments": [
    {"agent": "Evidence Analyst", "task": "what to analyze"},
    {"agent": "Suspect Analyst", "task": "what to profile"}
  ],
  "confidence": 0.0 to 1.0,
  "status": "ACTIVE"
}`;

  const response = await llm.invoke(prompt);
  let parsed;
  try {
    parsed = JSON.parse(response.content);
  } catch {
    parsed = {
      agent_name: "Lead Detective",
      message_type: "DIRECTION",
      summary: "Initial case assessment in progress",
      content: response.content,
      known_facts: [],
      unknowns: [],
      critical_gaps: [],
      assignments: [],
      confidence: 0.1,
      status: "ACTIVE"
    };
  }

  const saved = await saveAgentMessage(
    state.caseId, 'lead_detective', 'Lead Detective', 
    parsed.message_type || 'DIRECTION',
    parsed.content || parsed.summary,
    parsed.summary,
    state.stage
  );

  return {
    ...parsed,
    ...saved,
    knownFacts: parsed.known_facts || [],
    unknowns: parsed.unknowns || [],
  };
};
