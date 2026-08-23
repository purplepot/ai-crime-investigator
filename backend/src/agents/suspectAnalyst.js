import { ChatGoogle } from "./geminiModel.js";
import { saveAgentMessage, upsertSuspectProfile } from "../db/queries.js";

export const executeSuspectAnalyst = async (state) => {
  const llm = new ChatGoogle({ model: "gemini-3.5-flash", temperature: 0.1 });

  const prompt = `You are a CRIMINAL PROFILER / SUSPECT ANALYST working a murder investigation.

CURRENT CASE DATA:
${JSON.stringify(state, null, 2)}

YOUR RESPONSIBILITIES:
1. Profile EACH suspect individually using the MOMA framework:
   - MOTIVE: Why would they commit this crime? (financial gain, revenge, jealousy, etc.)
   - OPPORTUNITY: Could they have physically committed the crime? (location, access, timing)
   - MEANS: Did they have the ability/tools to commit the crime? (weapon access, physical capability)
   - ALIBI: Can their whereabouts be independently verified? (witnesses, CCTV, records)

2. Score each dimension from 0.0 to 1.0:
   - 0.0 = No evidence / Unknown
   - 0.3 = Weak evidence
   - 0.5 = Moderate evidence  
   - 0.7 = Strong evidence
   - 1.0 = Confirmed / Definitive

3. Calculate an overall suspicion score as a weighted average
4. Compare suspects against each other
5. Flag any suspect whose alibi has contradictions

IMPORTANT: Do NOT declare anyone guilty. Profile objectively based on available evidence.

OUTPUT STRICT JSON (no markdown, no backticks):
{
  "agent_name": "Suspect Analyst",
  "message_type": "ANALYSIS",
  "summary": "Brief overview of suspect rankings",
  "content": "Detailed profiling of each suspect (paragraph per suspect)",
  "suspect_profiles": [
    {
      "person_id": "person-xxx",
      "name": "Name",
      "motive_score": 0.0 to 1.0,
      "motive_detail": "explanation",
      "opportunity_score": 0.0 to 1.0,
      "opportunity_detail": "explanation",
      "means_score": 0.0 to 1.0,
      "means_detail": "explanation",
      "alibi_score": 0.0 to 1.0,
      "alibi_detail": "explanation",
      "alibi_status": "UNKNOWN | UNVERIFIED | VERIFIED | BROKEN",
      "overall_suspicion": 0.0 to 1.0,
      "summary": "1-2 sentence profile summary"
    }
  ],
  "ranking": ["most suspicious first"],
  "key_concerns": ["what worries you most"],
  "confidence": 0.0 to 1.0
}`;

  const response = await llm.invoke(prompt);
  let parsed;
  try {
    parsed = JSON.parse(response.content);
  } catch {
    parsed = {
      agent_name: "Suspect Analyst",
      message_type: "ANALYSIS",
      summary: "Suspect profiling in progress",
      content: response.content,
      suspect_profiles: [],
      ranking: [],
      key_concerns: [],
      confidence: 0.2
    };
  }

  await saveAgentMessage(
    state.caseId, 'suspect_analyst', 'Suspect Analyst',
    'ANALYSIS',
    parsed.content || parsed.summary,
    parsed.summary,
    state.stage
  );

  // Save suspect profiles to DB
  if (parsed.suspect_profiles) {
    for (const profile of parsed.suspect_profiles) {
      if (profile.person_id) {
        try {
          await upsertSuspectProfile(state.caseId, profile);
        } catch (e) {
          console.error('Error saving suspect profile:', e.message);
        }
      }
    }
  }

  return parsed;
};
