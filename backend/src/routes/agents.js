import express from 'express';
import { getAgentMessages, getAgentActions } from '../db/queries.js';

const router = express.Router();

// GET /api/agents/:caseId/messages — Get all agent messages for a case
router.get('/:caseId/messages', async (req, res) => {
  try {
    const messages = await getAgentMessages(req.params.caseId);
    res.json(messages || []);
  } catch (err) {
    console.error('Error fetching agent messages:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/agents/:caseId/actions — Get all agent actions for a case
router.get('/:caseId/actions', async (req, res) => {
  try {
    const actions = await getAgentActions(req.params.caseId);
    res.json(actions || []);
  } catch (err) {
    console.error('Error fetching agent actions:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
