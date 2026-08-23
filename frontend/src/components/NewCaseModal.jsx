import React, { useState } from 'react';
import { XCircle } from 'lucide-react';

export default function NewCaseModal({ onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, description });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-surface border border-border rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">New Investigation</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary"><XCircle size={20} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-xs font-bold text-text-secondary mb-1">CASE TITLE</label>
            <input 
              required
              className="w-full bg-primary border border-border rounded p-2 text-text-primary focus:border-text-secondary outline-none"
              value={title} onChange={e => setTitle(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-xs font-bold text-text-secondary mb-1">INITIAL DESCRIPTION / INCIDENT REPORT</label>
            <textarea 
              required
              className="w-full bg-primary border border-border rounded p-2 text-text-primary focus:border-text-secondary outline-none h-32 resize-none custom-scrollbar"
              value={description} onChange={e => setDescription(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-sm text-xs font-semibold uppercase tracking-wider border border-border text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-sm text-xs font-semibold uppercase tracking-wider bg-text-primary text-primary hover:bg-text-secondary transition-colors">Create Case</button>
          </div>
        </form>
      </div>
    </div>
  );
}
