import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import CaseView from './pages/CaseView'
import ThemeToggle from './components/ThemeToggle'
import { Shield } from 'lucide-react'

function App() {
  return (
    <BrowserRouter>
      <div className="h-screen bg-primary text-text-primary font-sans flex flex-col overflow-hidden">
        <header className="h-14 border-b border-border bg-surface flex items-center justify-between px-6 shrink-0">
          <Link to="/" className="flex items-center gap-2 text-text-primary font-bold tracking-wider hover:opacity-80 transition-opacity">
            <Shield className="w-5 h-5" />
            AI CRIME INVESTIGATOR
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 min-h-0 overflow-hidden flex flex-col relative">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/case/:id" element={<CaseView />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
