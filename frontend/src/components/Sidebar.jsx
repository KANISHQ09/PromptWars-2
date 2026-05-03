import React from 'react'

const Sidebar = ({ activePage, onNavigate, isOpen, setIsOpen }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'process', label: 'Election Process', icon: 'how_to_vote' },
    { id: 'candidates', label: 'Know Candidates', icon: 'group' },
    { id: 'timeline', label: 'Timeline', icon: 'event_note' },
    { id: 'polling', label: 'Polling Booths', icon: 'location_on' },
    { id: 'report', label: 'Report Violation', icon: 'verified_user' },
    { id: 'assistant', label: 'AI Assistant', icon: 'smart_toy' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ]

  return (
    <aside className={`fixed left-0 top-0 h-screen w-64 z-[200] bg-surface-container-lowest border-r border-surface-container-highest flex flex-col p-4 transform transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="mb-8 px-4 py-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary-container fill-icon">account_balance</span>
          </div>
          <div>
            <h2 className="text-lg font-black text-primary uppercase tracking-wider">Civic Portal</h2>
            <p className="text-[10px] text-outline font-medium">Official Election Assistant</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1" aria-label="Main Navigation">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            aria-current={activePage === item.id ? 'page' : undefined}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary outline-none ${
              activePage === item.id
                ? 'bg-primary/10 text-primary border-r-4 border-primary rounded-r-none'
                : 'text-secondary hover:bg-surface-container-low hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined mr-3" aria-hidden="true">{item.icon}</span>
            <span className="text-sm font-semibold">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto p-4 bg-primary/5 rounded-xl border border-primary/10">
        <p className="text-xs font-semibold text-primary mb-2">Need assistance?</p>
        <button 
          onClick={() => onNavigate('assistant')}
          className="w-full bg-primary text-on-primary py-2 px-4 rounded-lg text-sm font-bold hover:opacity-90 transition-all active:scale-95"
        >
          Get Support
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
