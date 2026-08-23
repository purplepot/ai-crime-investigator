import { create } from 'zustand'

export const useCaseStore = create((set, get) => ({
  cases: [],
  currentCase: null,
  messages: [],
  actions: [],
  timeline: [],
  suspects: [],
  evidence: [],
  loading: false,
  error: null,
  
  setCases: (cases) => set({ cases }),
  setCurrentCase: (caseData) => set({ currentCase: caseData }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setActions: (actions) => set({ actions }),
  addAction: (action) => set((state) => ({ actions: [...state.actions, action] })),
  setTimeline: (timeline) => set({ timeline }),
  setSuspects: (suspects) => set({ suspects }),
  setEvidence: (evidence) => set({ evidence }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  updateCaseState: (stateUpdate) => set((state) => ({
    currentCase: state.currentCase ? { ...state.currentCase, ...stateUpdate } : null
  })),
  updateCaseStage: (stage) => set((state) => ({
    currentCase: state.currentCase ? { ...state.currentCase, current_stage: stage } : null
  }))
}))
