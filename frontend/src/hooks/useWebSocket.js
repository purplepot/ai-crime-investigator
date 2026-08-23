import { useEffect, useRef } from 'react';
import { useCaseStore } from '../stores/caseStore';

export function useWebSocket(caseId) {
  const ws = useRef(null);
  const { addMessage, addAction, updateCaseState, updateCaseStage } = useCaseStore();

  useEffect(() => {
    if (!caseId) return;

    ws.current = new WebSocket('ws://localhost:3001');

    ws.current.onopen = () => {
      console.log('WS Connected');
      // maybe subscribe to case channel if backend supports it
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // Only process events for current case if applicable
        if (data.caseId && data.caseId !== caseId) return;

        switch (data.type) {
          case 'agent_message':
            addMessage(data.payload);
            break;
          case 'agent_action':
            addAction(data.payload);
            break;
          case 'state_update':
            updateCaseState({
              ...data.payload,
              known_facts: data.payload.knownFacts || data.payload.known_facts,
              unknowns: data.payload.unknowns,
              contradictions: data.payload.contradictions,
              next_action: data.payload.recommendedAction || data.payload.recommended_action || data.payload.next_action,
            });
            break;
          case 'stage_change':
            updateCaseStage(data.payload.stage || data.payload);
            break;
          case 'investigation_blocked':
            updateCaseState({ status: 'BLOCKED', next_action: data.payload });
            break;
          default:
            console.log('Unknown WS event:', data.type);
        }
      } catch (err) {
        console.error('Error parsing WS message', err);
      }
    };

    ws.current.onclose = () => {
      console.log('WS Disconnected');
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [caseId, addMessage, addAction, updateCaseState, updateCaseStage]);
}
