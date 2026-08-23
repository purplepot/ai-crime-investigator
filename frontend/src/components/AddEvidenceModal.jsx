import React, { useState } from 'react';
import { XCircle } from 'lucide-react';

export default function AddEvidenceModal({ onClose, onSubmit }) {
  const [type, setType] = useState('document');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ type, name, description, reliability: 1.0 });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-surface border border-border rounded-md p-6 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-text-primary">Submit Evidence</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary"><XCircle size={20} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-xs font-bold text-text-secondary mb-1">TYPE</label>
            <select className="w-full bg-primary border border-border rounded p-2 text-text-primary outline-none focus:border-text-secondary" value={type} onChange={e=>setType(e.target.value)}>
              <option value="document">Document</option>
              <option value="physical">Physical</option>
              <option value="testimony">Testimony</option>
              <option value="location">Location Data</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-bold text-text-secondary mb-1">NAME</label>
            <input required className="w-full bg-primary border border-border rounded p-2 text-text-primary outline-none focus:border-text-secondary" value={name} onChange={e=>setName(e.target.value)} />
          </div>
          <div className="mb-6">
            <label className="block text-xs font-bold text-text-secondary mb-1">DESCRIPTION / CONTENTS</label>
            <textarea required className="w-full bg-primary border border-border rounded p-2 text-text-primary outline-none focus:border-text-secondary h-24 resize-none custom-scrollbar" value={description} onChange={e=>setDescription(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-sm text-xs font-semibold uppercase tracking-wider border border-border text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-sm text-xs font-semibold uppercase tracking-wider bg-text-primary text-primary hover:bg-text-secondary transition-colors">Submit to Swarm</button>
          </div>
        </form>
      </div>
    </div>
  );
}
