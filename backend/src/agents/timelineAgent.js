import { ChatGoogle } from "./geminiModel.js";
import { saveAgentMessage } from "../db/queries.js";

export const executeTimelineAgent = async (state) => {
  const llm = new ChatGoogle({ model: "gemini-3.5-flash", temperature: 0.1 });

  const prompt = `You are a TIMELINE ANALYST / CHRONOLOGIST working a murder investigation.

CURRENT CASE DATA:
${JSON.stringify(state, null, 2)}

YOUR RESPONSIBILITIES:
1. Reconstruct a COMPLETE timeline from ALL available sources (evidence, statements, events)
2. For each event, note: time, what happened, source, verification status
3. DETECT CONTRADICTIONS between different sources (e.g., statement says "left at 10 PM" but CCTV shows entry at 10:42 PM)
4. Identify GAPS in the timeline where we don't know what happened
5. Determine the WINDOW OF OPPORTUNITY for the crime
6. Map each suspect's claimed location against evidence-verified locations

CONTRADICTION DETECTION:
- Compare each person's statement timeline against physical evidence
- Compare CCTV timestamps against stated movements
- Compare phone records against claimed locations
- Flag ANY discrepancy, even minor ones (they may reveal deception)

TIMELINE FORMAT:
"HH:MM → Event description [SOURCE] [VERIFIED/UNVERIFIED]"

OUTPUT STRICT JSON (no markdown, no backticks):
{
  "agent_name": "Timeline Agent",
  "message_type": "FINDING",
  "summary": "Brief overview of timeline findings and contradictions",
  "content": "Detailed timeline reconstruction with analysis of gaps and contradictions (3-4 paragraphs)",
  "timeline": [
    {
      "time": "HH:MM",
      "event": "description",
      "persons_involved": ["names"],
      "source": "where this info comes from",
      "verified": true/false,
      "confidence": 0.0 to 1.0
    }
  ],
  "contradictions": [
    {
      "description": "What contradicts what",
      "source_a": "First source",
      "source_b": "Second source",
      "severity": "MAJOR | MINOR",
      "implication": "What this means for the investigation"
    }
  ],
  "gaps": [
    {
      "from": "HH:MM",
      "to": "HH:MM",
      "description": "What we don't know during this period",
      "severity": "CRITICAL | SIGNIFICANT | MINOR"
    }
  ],
  "crime_window": {
    "earliest": "HH:MM",
    "latest": "HH:MM",
    "description": "Based on evidence, the crime occurred in this window"
  },
  "confidence": 0.0 to 1.0
}`;

  const response = await llm.invoke(prompt);
  let parsed;
  try {
    parsed = JSON.parse(response.content);
  } catch {
    parsed = {
      agent_name: "Timeline Agent",
      message_type: "FINDING",
      summary: "Timeline reconstruction in progress",
      content: response.content,
      timeline: [],
      contradictions: [],
      gaps: [],
      crime_window: {},
      confidence: 0.2
    };
  }

  await saveAgentMessage(
    state.caseId, 'timeline_agent', 'Timeline Agent',
    'FINDING',
    parsed.content || parsed.summary,
    parsed.summary,
    state.stage
  );

  return parsed;
};
