import { ChatGoogle } from './geminiModel.js';
import { saveAgentMessage, saveAgentAction, upsertSuspectProfile } from '../db/queries.js';

const getFrameworkForRole = (roleType, character) => {
  switch (roleType) {
    case 'COORDINATOR':
      return `YOUR RESPONSIBILITIES:
1. Review ALL available evidence, suspect profiles, statements, and timeline events
2. Identify the most critical gaps in the investigation
3. Determine what information is missing and what needs to happen next
4. Assign priorities to different lines of inquiry
5. If you see contradictions, flag them immediately

IMPORTANT RULES:
- Do NOT declare anyone guilty. You are directing the investigation, not making judgments.
- Be extremely CONCISE and PUNCHY. No long essays or walls of text.
- In "content", write 1 brief opening sentence followed by 2 to 3 bullet points with bold labels. Max 60-80 words total.

OUTPUT STRICT JSON (no markdown wrapper, no backticks):
{
  "agent_name": "${character.display_name}",
  "message_type": "DIRECTION",
  "summary": "Brief 1-sentence summary",
  "content": "Opening sentence.\\n• **Primary Objective:** key priority\\n• **Critical Gap:** what is missing\\n• **Directive:** assignment for specialists",
  "known_facts": ["fact1", "fact2"],
  "unknowns": ["unknown1", "unknown2"],
  "critical_gaps": ["gap1", "gap2"],
  "assignments": [{"agent": "name", "task": "what to do"}],
  "confidence": 0.0 to 1.0,
  "status": "ACTIVE"
}`;

    case 'FORENSICS':
      return `YOUR RESPONSIBILITIES:
1. Examine EACH piece of evidence individually
2. Determine what each evidence item tells us about the case
3. Assign reliability scores (0.0-1.0) based on type and source
4. Find connections between evidence items
5. Identify what additional forensic tests or evidence collection is needed
6. Flag any evidence that contradicts other evidence or statements

IMPORTANT RULES:
- Be extremely CONCISE and PUNCHY. No long essays.
- In "content", write 1 brief opening sentence followed by 2 to 3 bullet points with bold labels. Max 60-80 words total.

OUTPUT STRICT JSON (no markdown wrapper, no backticks):
{
  "agent_name": "${character.display_name}",
  "message_type": "ANALYSIS",
  "summary": "Brief 1-sentence evidence summary",
  "content": "Forensic findings summary.\\n• **Key Evidence:** item and significance\\n• **Forensic Connection:** link between items/persons\\n• **Recommended Test:** what test is needed",
  "evidence_analysis": [{"evidence_name": "name", "significance": "what it tells us", "reliability": 0.9, "connects_to": ["person"], "gaps": "what we need"}],
  "connections": ["evidence A connects to B because..."],
  "recommended_tests": [{"action_type": "FORENSIC_TEST", "target": "what", "reason": "why", "priority": "HIGH"}],
  "confidence": 0.0 to 1.0
}`;

    case 'PROFILER':
      return `YOUR RESPONSIBILITIES:
1. Profile EACH suspect individually using the MOMA framework (Motive, Opportunity, Means, Alibi)
2. Score each dimension from 0.0 to 1.0
3. Calculate an overall suspicion score as a weighted average
4. Compare suspects against each other
5. Flag any suspect whose alibi has contradictions

IMPORTANT RULES:
- Do NOT declare anyone guilty.
- Be extremely CONCISE and PUNCHY. No long paragraphs.
- In "content", write 1 brief overview sentence followed by 2 to 3 bullet points. Max 60-80 words total.

OUTPUT STRICT JSON (no markdown wrapper, no backticks):
{
  "agent_name": "${character.display_name}",
  "message_type": "ANALYSIS",
  "summary": "Brief overview of suspect rankings",
  "content": "Suspect ranking assessment.\\n• **Top Suspect:** name — Motive & Opportunity summary\\n• **Alibi Vulnerability:** which alibi is broken or unverified\\n• **Key Concern:** main investigative risk",
  "suspect_profiles": [{"person_id": "person-xxx", "name": "Name", "motive_score": 0.7, "motive_detail": "explanation", "opportunity_score": 0.5, "opportunity_detail": "explanation", "means_score": 0.6, "means_detail": "explanation", "alibi_score": 0.3, "alibi_detail": "explanation", "alibi_status": "UNVERIFIED", "overall_suspicion": 0.6, "summary": "1-2 sentence summary"}],
  "ranking": ["most suspicious first"],
  "key_concerns": ["what worries you most"],
  "confidence": 0.0 to 1.0
}`;

    case 'SPECIALIST':
      return `YOUR RESPONSIBILITIES:
1. Analyze the case from your specific domain expertise
2. Provide targeted insights that only a specialist in your field would notice
3. Identify critical details that generalists might miss
4. Recommend specific domain actions

IMPORTANT RULES:
- Be extremely CONCISE and PUNCHY. No long paragraphs.
- In "content", write 1 brief opening sentence followed by 2 to 3 bullet points with bold labels. Max 60-80 words total.

OUTPUT STRICT JSON (no markdown wrapper, no backticks):
{
  "agent_name": "${character.display_name}",
  "message_type": "ANALYSIS",
  "summary": "Brief specialist assessment",
  "content": "Domain analysis summary.\\n• **Specialist Finding:** key technical or domain discovery\\n• **Anomaly Detected:** irregularity found\\n• **Action Item:** recommended next step",
  "key_findings": ["finding1", "finding2"],
  "recommendations": [{"action": "what to do", "reason": "why", "priority": "HIGH"}],
  "confidence": 0.0 to 1.0
}`;

    case 'WITNESS_ANALYST':
      return `YOUR RESPONSIBILITIES:
1. Analyze all witness and suspect statements for inconsistencies
2. Provide personal context about relationships between the people involved
3. Identify what personal knowledge reveals about motives and opportunities
4. Flag any behavioral red flags or suspicious relationship dynamics

IMPORTANT RULES:
- Be extremely CONCISE and PUNCHY. No long essays.
- In "content", write 1 brief opening sentence followed by 2 to 3 bullet points. Max 60-80 words total.

OUTPUT STRICT JSON (no markdown wrapper, no backticks):
{
  "agent_name": "${character.display_name}",
  "message_type": "FINDING",
  "summary": "Brief statement and relationship summary",
  "content": "Witness and relationship context.\\n• **Statement Conflict:** what contradicts their testimony\\n• **Personal Dynamics:** relationship motive or tension\\n• **Critical Observation:** key insight",
  "personal_insights": ["insight1", "insight2"],
  "relationship_dynamics": ["dynamic1", "dynamic2"],
  "key_observations": ["observation1", "observation2"],
  "confidence": 0.0 to 1.0
}`;

    case 'INTERROGATOR':
      return `YOUR RESPONSIBILITIES:
1. Identify GAPS in the current statements and evidence
2. Find CONTRADICTIONS between what people said and what evidence shows
3. Generate SPECIFIC, TARGETED questions for each suspect/witness
4. Each question should be designed to either CONFIRM or BREAK an alibi

IMPORTANT RULES:
- Be extremely CONCISE and PUNCHY. No long paragraphs.
- In "content", write 1 brief strategy sentence followed by 2 to 3 bullet points. Max 60-80 words total.

OUTPUT STRICT JSON (no markdown wrapper, no backticks):
{
  "agent_name": "${character.display_name}",
  "message_type": "QUESTION",
  "summary": "Brief interrogation strategy",
  "content": "Interrogation strategy.\\n• **Primary Target:** suspect name\\n• **Line of Questioning:** key contradiction to press\\n• **Alibi Probe:** specific timestamp or claim being challenged",
  "interviews": [{"person_id": "person-xxx", "person_name": "Name", "priority": "HIGH", "reason": "Why", "questions": [{"question": "The question", "purpose": "What we hope to learn", "based_on": "What evidence prompted this"}]}],
  "recommended_actions": [{"action_type": "INTERVIEW", "target": "person name", "question": "key question", "reason": "why important", "priority": "HIGH"}],
  "confidence": 0.0 to 1.0
}`;

    case 'LEGAL_REVIEW':
      return `YOUR RESPONSIBILITIES:
1. Critically evaluate whether the CURRENT EVIDENCE is sufficient
2. List what evidence is STRONG and what is WEAK
3. Identify what is MISSING that would make the case stronger
4. Determine if the investigation should CONTINUE or is BLOCKED

CRITICAL RULE: You MUST err on the side of INSUFFICIENT EVIDENCE.
- If alibis are unverified -> BLOCKED
- If contradictions are unexplained -> BLOCKED
- If motive is unclear for the top suspect -> BLOCKED
- Only mark RESOLVED if evidence is overwhelming

IMPORTANT RULES:
- Be extremely CONCISE and PUNCHY. No long paragraphs.
- In "content", write 1 brief verdict sentence followed by 2 to 3 bullet points. Max 60-80 words total.

OUTPUT STRICT JSON (no markdown wrapper, no backticks):
{
  "agent_name": "${character.display_name}",
  "message_type": "CONCLUSION",
  "summary": "Brief verdict on investigation status",
  "content": "Case legal review.\\n• **Status:** BLOCKED or RESOLVED\\n• **Key Obstacle:** primary reason for reasonable doubt\\n• **Required Action:** exact next step needed to proceed",
  "status": "BLOCKED or RESOLVED",
  "confidence": 0.0 to 1.0,
  "strong_evidence": ["list"],
  "weak_evidence": ["list"],
  "missing_evidence": ["list"],
  "contradictions_unresolved": ["list"],
  "block_reason": "If BLOCKED: specific explanation",
  "recommended_action": {"action_type": "INTERVIEW or FORENSIC_TEST or VERIFY_ALIBI or COLLECT_EVIDENCE", "target": "who or what", "question": "specific question if interview", "reason": "why this is most important", "priority": "CRITICAL"},
  "case_theory": "Brief theory of what happened",
  "defense_vulnerabilities": ["what defense would attack"]
}`;

    default:
      return `Analyze the case data based on your persona and expertise.
Keep "content" concise (1 opening sentence + 2-3 bullet points, max 60-80 words).

OUTPUT STRICT JSON (no markdown wrapper, no backticks):
{
  "agent_name": "${character.display_name}",
  "message_type": "ANALYSIS",
  "summary": "Brief summary",
  "content": "Summary.\\n• **Point 1:** detail\\n• **Point 2:** detail",
  "confidence": 0.0 to 1.0
}`;
  }
};

export const executeGenericAgent = async (character, state) => {
  const isInterrogator = character.role_type === 'INTERROGATOR';
  const llm = new ChatGoogle({ model: 'gemini-2.5-flash', temperature: isInterrogator ? 0.2 : 0.1 });

  const framework = getFrameworkForRole(character.role_type, character);

  const prompt = `You are ${character.display_name}. ${character.persona}

${framework}

CURRENT CASE DATA:
${JSON.stringify(state, null, 2)}`;

  const response = await llm.invoke(prompt);
  let parsed;
  try {
    const raw = response.content.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    parsed = JSON.parse(raw);
  } catch {
    parsed = {
      agent_name: character.display_name,
      message_type: 'ANALYSIS',
      summary: `${character.display_name} analysis complete`,
      content: response.content,
      confidence: 0.1,
      status: 'ACTIVE'
    };
  }

  // Save agent message to DB
  await saveAgentMessage(
    state.caseId,
    character.agent_key,
    character.display_name,
    parsed.message_type || 'ANALYSIS',
    parsed.content || parsed.summary,
    parsed.summary,
    state.stage
  );

  // Role-specific DB side effects
  if (character.role_type === 'PROFILER' && parsed.suspect_profiles) {
    for (const profile of parsed.suspect_profiles) {
      let matchedPerson = (state.persons || []).find(p => 
        p.person_id === profile.person_id || 
        p.name?.toLowerCase() === profile.name?.toLowerCase() ||
        p.name?.toLowerCase().includes(profile.name?.toLowerCase()) ||
        profile.name?.toLowerCase().includes(p.name?.toLowerCase())
      );
      const personId = matchedPerson ? matchedPerson.person_id : profile.person_id;
      if (personId) {
        try {
          await upsertSuspectProfile(state.caseId, { ...profile, person_id: personId });
        } catch (e) {
          console.error('Error saving suspect profile:', e.message);
        }
      }
    }
  }

  if (character.role_type === 'INTERROGATOR' && parsed.recommended_actions) {
    for (const action of parsed.recommended_actions) {
      try {
        await saveAgentAction(state.caseId, character.agent_key, action);
      } catch (e) {
        console.error('Error saving action:', e.message);
      }
    }
  }

  if (character.role_type === 'LEGAL_REVIEW' && parsed.status === 'BLOCKED' && parsed.recommended_action) {
    try {
      await saveAgentAction(state.caseId, character.agent_key, parsed.recommended_action);
    } catch (e) {
      console.error('Error saving prosecutor action:', e.message);
    }
  }

  return {
    ...parsed,
    knownFacts: parsed.known_facts || parsed.key_findings || parsed.key_observations || [],
    unknowns: parsed.unknowns || [],
  };
};
