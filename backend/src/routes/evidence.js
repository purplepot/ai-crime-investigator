import express from 'express';
import { insertEvidence, getEvidenceForCase } from '../db/queries.js';
import { broadcast } from '../websocket/wsServer.js';

const router = express.Router();

// POST /api/evidence/:id — Add evidence to a case
router.post('/:id', async (req, res) => {
  try {
    const caseId = req.params.id;
    const evidenceId = await insertEvidence(caseId, req.body);
    
    // Broadcast to connected clients
    broadcast({ type: 'new_evidence', payload: { case_id: caseId, evidence_id: evidenceId, ...req.body } });
    
    res.json({ evidence_id: evidenceId, message: 'Evidence added successfully' });
  } catch (err) {
    console.error('Error adding evidence:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/evidence/:id — Get all evidence for a case
router.get('/:id', async (req, res) => {
  try {
    const evidence = await getEvidenceForCase(req.params.id);
    res.json(evidence || []);
  } catch (err) {
    console.error('Error fetching evidence:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
