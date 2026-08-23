import { ChatGoogle } from "./geminiModel.js";
import { saveAgentMessage, saveAgentAction } from "../db/queries.js";

export const executeInterviewAgent = async (state) => {
  const llm = new ChatGoogle({ model: "gemini-3.5-flash", temperature: 0.2 });

  const prompt = `You are an expert CRIMINAL INTERVIEWER working a murder investigation.

CURRENT CASE DATA:
${JSON.stringify(state, null, 2)}

YOUR RESPONSIBILITIES:
1. Identify GAPS in the current statements and evidence
2. Find CONTRADICTIONS between what people said and what evidence shows
3. Generate SPECIFIC, TARGETED questions for each suspect/witness
4. Each question should be designed to either CONFIRM or BREAK an alibi
5. Prioritize questions that would most effectively narrow down suspects

QUESTIONING STRATEGIES:
- Open questions first: "Tell me about your evening"
- Then specific: "You said you left at 10 PM, but CCTV shows entry at 10:42"
- Challenge contradictions directly but professionally
- Ask about relationships, motives, and recent conflicts
- Probe timeline gaps systematically

IMPORTANT:
- Frame questions to detect lies without being accusatory
- Reference specific evidence when questioning contradictions
- Each question should have a clear investigative PURPOSE

OUTPUT STRICT JSON (no markdown, no backticks):
{
  "agent_name": "Interview Agent",
  "message_type": "QUESTION",
  "summary": "Brief overview of questioning strategy",
  "content": "Detailed explanation of who should be questioned and why (2-3 paragraphs)",
  "interviews": [
    {
      "person_id": "person-xxx",
      "person_name": "Name",
      "priority": "HIGH | MEDIUM | LOW",
      "reason": "Why this person should be interviewed",
      "questions": [
        {
          "question": "The actual question to ask",
          "purpose": "What we hope to learn",
          "based_on": "What evidence/contradiction prompted this question"
        }
      ]
    }
  ],
  "recommended_actions": [
    {
      "action_type": "INTERVIEW",
      "target": "person name",
      "question": "key question",
      "reason": "why this is important",
      "priority": "HIGH"
    }
  ],
  "confidence": 0.0 to 1.0
}`;

  const response = await llm.invoke(prompt);
  let parsed;
  try {
    parsed = JSON.parse(response.content);
  } catch {
    parsed = {
      agent_name: "Interview Agent",
      message_type: "QUESTION",
      summary: "Preparing interview questions",
      content: response.content,
      interviews: [],
      recommended_actions: [],
      confidence: 0.2
    };
  }

  await saveAgentMessage(
    state.caseId, 'interview_agent', 'Interview Agent',
    'QUESTION',
    parsed.content || parsed.summary,
    parsed.summary,
    state.stage
  );

  // Save recommended actions to DB
  if (parsed.recommended_actions) {
    for (const action of parsed.recommended_actions) {
      try {
        await saveAgentAction(state.caseId, 'interview_agent', action);
      } catch (e) {
        console.error('Error saving action:', e.message);
      }
    }
  }

  return parsed;
};
