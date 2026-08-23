// State definition is now handled via Annotation API in investigationGraph.js
// This file exports the initial state factory for creating new investigations

export const createInitialState = (caseId, caseData, evidence, persons, statements, events) => ({
  caseId,
  stage: 'CASE_CREATED',
  knownFacts: [],
  unknowns: [],
  suspects: [],
  hypotheses: [],
  pendingActions: [],
  completedActions: [],
  contradictions: [],
  confidence: 0,
  status: 'ACTIVE',
  blockReason: '',
  recommendedAction: null,
  messages: [],
  // Injected data from Exasol
  caseData: caseData || {},
  evidence: evidence || [],
  persons: persons || [],
  statements: statements || [],
  events: events || [],
});
