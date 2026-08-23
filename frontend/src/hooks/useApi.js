import { useState, useCallback } from 'react';
import { useCaseStore } from '../stores/caseStore';

const BASE_URL = 'http://localhost:3001/api';

export function useApi() {
  const { setCases, setCurrentCase, setMessages, setActions, setTimeline, setSuspects, setEvidence, setLoading, setError, setRoster } = useCaseStore();

  const fetchCases = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/cases`);
      const data = await res.json();
      setCases(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [setCases, setLoading, setError]);

  const fetchCase = useCallback(async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/cases/${id}`);
      const data = await res.json();
      const state = data.state || {};
      const caseData = data.case || data;
      if (data.roster) {
        setRoster(data.roster);
      }
      setCurrentCase({
        ...caseData,
        ...state,
        known_facts: state.knownFacts || state.known_facts || caseData.known_facts || [],
        unknowns: state.unknowns || caseData.unknowns || [],
        contradictions: state.contradictions || caseData.contradictions || [],
        next_action: state.recommendedAction || state.recommended_action || caseData.next_action || null,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [setCurrentCase, setLoading, setError, setRoster]);

  const fetchCaseData = useCallback(async (id) => {
    try {
      const [msgs, acts, tl, sus, ev, rosterData] = await Promise.all([
        fetch(`${BASE_URL}/cases/${id}/messages`).then(res => res.json()),
        fetch(`${BASE_URL}/cases/${id}/actions`).then(res => res.json()),
        fetch(`${BASE_URL}/cases/${id}/timeline`).then(res => res.json()),
        fetch(`${BASE_URL}/cases/${id}/suspects`).then(res => res.json()),
        fetch(`${BASE_URL}/evidence/${id}`).then(res => res.json()),
        fetch(`${BASE_URL}/cases/${id}/roster`).then(res => res.json()).catch(() => []),
      ]);
      setMessages(msgs);
      setActions(acts);
      setTimeline(tl);
      setSuspects(sus);
      setEvidence(ev);
      if (rosterData && Array.isArray(rosterData) && rosterData.length > 0) {
        setRoster(rosterData);
      }
    } catch (err) {
      setError(err.message);
    }
  }, [setMessages, setActions, setTimeline, setSuspects, setEvidence, setRoster, setError]);

  const createCase = async (caseData) => {
    const res = await fetch(`${BASE_URL}/cases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(caseData)
    });
    return res.json();
  };

  const startInvestigation = async (id) => {
    const res = await fetch(`${BASE_URL}/cases/${id}/investigate`, { method: 'POST' });
    return res.json();
  };

  const addEvidence = async (id, evidence) => {
    const res = await fetch(`${BASE_URL}/cases/${id}/evidence`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(evidence)
    });
    return res.json();
  };

  return { fetchCases, fetchCase, fetchCaseData, createCase, startInvestigation, addEvidence };
}
