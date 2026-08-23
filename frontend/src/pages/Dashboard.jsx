import React, { useEffect, useState } from 'react';
import { useCaseStore } from '../stores/caseStore';
import { useApi } from '../hooks/useApi';
import CaseCard from '../components/CaseCard';
import NewCaseModal from '../components/NewCaseModal';
import { Plus } from 'lucide-react';

export default function Dashboard() {
  const { cases, loading } = useCaseStore();
  const { fetchCases, createCase } = useApi();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  const activeCount = cases.filter(c => c.status === 'ACTIVE').length;
  const blockedCount = cases.filter(c => c.status === 'BLOCKED').length;
  const resolvedCount = cases.filter(c => c.status === 'RESOLVED').length;

  const handleCreate = async (data) => {
    await createCase(data);
    setShowModal(false);
    fetchCases();
  };

  return (
    <div className="p-6 h-full overflow-y-auto custom-scrollbar flex flex-col gap-6 max-w-6xl mx-auto w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Active Investigations</h1>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-text-primary text-primary hover:bg-text-secondary px-4 py-2 rounded-sm font-semibold text-xs uppercase tracking-wider transition-colors shadow-sm">
          <Plus size={16} /> New Investigation
        </button>
      </div>
      
      <div className="flex gap-4 mb-2">
        <div className="bg-surface border border-border rounded px-4 py-3 flex-1 flex justify-between items-center">
          <span className="text-text-secondary text-sm font-bold">ACTIVE</span>
          <span className="text-xl font-bold text-accent-amber">{activeCount}</span>
        </div>
        <div className="bg-surface border border-border rounded px-4 py-3 flex-1 flex justify-between items-center">
          <span className="text-text-secondary text-sm font-bold">WAITING</span>
          <span className="text-xl font-bold text-accent-amber">{blockedCount}</span>
        </div>
        <div className="bg-surface border border-border rounded px-4 py-3 flex-1 flex justify-between items-center">
          <span className="text-text-secondary text-sm font-bold">RESOLVED</span>
          <span className="text-xl font-bold text-accent-green">{resolvedCount}</span>
        </div>
      </div>

      {loading ? (
        <div className="text-text-secondary">Loading cases...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cases.map(c => <CaseCard key={c.id} caseItem={c} />)}
        </div>
      )}

      {showModal && <NewCaseModal onClose={() => setShowModal(false)} onSubmit={handleCreate} />}
    </div>
  );
}
