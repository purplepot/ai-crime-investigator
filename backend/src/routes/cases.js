import express from 'express';
import { createCase } from '../services/caseService.js';
import { startInvestigation } from '../services/investigationService.js';
import { 
  getAllCases, getCaseById, getAgentMessages, getAgentActions,
  getEventsForCase, getSuspectProfiles, getSuspectsForCase, getEvidenceForCase,
  getPersonsForCase, getInvestigationState, clearInvestigationRun
} from '../db/queries.js';
import { broadcast } from '../websocket/wsServer.js';

const router = express.Router();

// GET /api/cases — List all cases
router.get('/', async (req, res) => {
  try {
    const cases = await getAllCases();
    res.json(cases || []);
  } catch (err) {
    console.error('Error fetching cases:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/cases — Create a new case
router.post('/', async (req, res) => {
  try {
    const newCase = await createCase(req.body);
    res.json(newCase);
  } catch (err) {
    console.error('Error creating case:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/cases/:id — Get full case details
router.get('/:id', async (req, res) => {
  try {
    const caseData = await getCaseById(req.params.id);
    if (!caseData) return res.status(404).json({ error: 'Case not found' });
    
    const evidence = await getEvidenceForCase(req.params.id);
    const persons = await getPersonsForCase(req.params.id);
    const state = await getInvestigationState(req.params.id);
    
    res.json({ case: caseData, evidence, persons, state });
  } catch (err) {
    console.error('Error fetching case:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/cases/:id/investigate — Start or resume investigation
router.post('/:id/investigate', async (req, res) => {
  try {
    await clearInvestigationRun(req.params.id);
    broadcast({ type: 'state_update', payload: {
      caseId: req.params.id, status: 'ACTIVE', current_stage: 'INITIAL_ANALYSIS', confidence: 0,
      next_action: null, recommendedAction: null, knownFacts: [], known_facts: [], unknowns: [], contradictions: []
    }});
    // Run in the background after the reset is committed.
    startInvestigation(req.params.id).catch(err => {
      console.error('Investigation error:', err);
    });
    res.json({ message: 'Fresh investigation started', caseId: req.params.id });
  } catch (err) {
    console.error('Error starting investigation:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/cases/:id/messages — Get agent conversation log
router.get('/:id/messages', async (req, res) => {
  try {
    const messages = await getAgentMessages(req.params.id);
    res.json(messages || []);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/cases/:id/actions — Get agent actions
router.get('/:id/actions', async (req, res) => {
  try {
    const actions = await getAgentActions(req.params.id);
    res.json(actions || []);
  } catch (err) {
    console.error('Error fetching actions:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/cases/:id/timeline — Get timeline events
router.get('/:id/timeline', async (req, res) => {
  try {
    const events = await getEventsForCase(req.params.id);
    res.json(events || []);
  } catch (err) {
    console.error('Error fetching timeline:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/cases/:id/suspects — Get suspect profiles
router.get('/:id/suspects', async (req, res) => {
  try {
    const profiles = await getSuspectProfiles(req.params.id);
    // Before an agent pass, show the seeded persons of interest with unknown scores.
    res.json(profiles?.length ? profiles : await getSuspectsForCase(req.params.id));
  } catch (err) {
    console.error('Error fetching suspects:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/cases/:id/state — Get investigation state
router.get('/:id/state', async (req, res) => {
  try {
    const state = await getInvestigationState(req.params.id);
    res.json(state || {});
  } catch (err) {
    console.error('Error fetching state:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
