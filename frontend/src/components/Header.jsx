import React from 'react'

const Header = ({ userProfile, onNavigate, setGlobalSearch, onMenuToggle }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showResults, setShowResults] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);

  // Comprehensive searchable app items
  const appItems = [
    // Pages
    { type: 'Page', title: 'Go to Dashboard', id: 'dashboard', icon: 'dashboard', category: 'navigation' },
    { type: 'Page', title: 'View Candidates', id: 'candidates', icon: 'group', category: 'navigation' },
    { type: 'Page', title: 'Polling Booths Map', id: 'polling', icon: 'location_on', category: 'navigation' },
    { type: 'Page', title: 'Election Timeline', id: 'timeline', icon: 'event_note', category: 'navigation' },
    { type: 'Page', title: 'Report Violation (MCC)', id: 'report', icon: 'verified_user', category: 'navigation' },
    { type: 'Page', title: 'Open AI Assistant', id: 'assistant', icon: 'smart_toy', category: 'navigation' },
    { type: 'Page', title: 'My Settings & Profile', id: 'settings', icon: 'settings', category: 'navigation' },
    
    // Candidates
    { type: 'Candidate', title: 'Alok Sharma (BJP)', id: 'candidates', icon: 'person', category: 'data', query: 'Alok Sharma' },
    { type: 'Candidate', title: 'Arun Shrivastava (INC)', id: 'candidates', icon: 'person', category: 'data', query: 'Arun Shrivastava' },
    { type: 'Candidate', title: 'Bhanu Pratap Singh (BSP)', id: 'candidates', icon: 'person', category: 'data', query: 'Bhanu Pratap' },
    { type: 'Candidate', title: 'Akshay Gothi (PPI)', id: 'candidates', icon: 'person', category: 'data', query: 'Akshay' },
    { type: 'Candidate', title: 'Mudit Bhatnagar (SUCI)', id: 'candidates', icon: 'person', category: 'data', query: 'Mudit' },
    
    // Quick Tasks
    { type: 'Action', title: 'Find my polling booth', id: 'polling', icon: 'map', category: 'navigation' },
    { type: 'Action', title: 'Check election dates', id: 'timeline', icon: 'calendar_month', category: 'navigation' },
    { type: 'Action', title: 'Ask a question', id: 'assistant', icon: 'chat', category: 'navigation' },
    { type: 'Action', title: 'Update my profile', id: 'settings', icon: 'account_circle', category: 'navigation' },
    
    // Location Data
    { type: 'Location', title: 'Arera Colony Booths', id: 'polling', icon: 'location_away', category: 'data', query: 'Arera' },
    { type: 'Location', title: 'MP Nagar Booths', id: 'polling', icon: 'location_away', category: 'data', query: 'MP Nagar' },
    { type: 'Location', title: 'Gulmohar Area', id: 'polling', icon: 'location_away', category: 'data', query: 'Gulmohar' },
  ];

  const filteredResults = searchQuery.trim() === '' 
    ? [] 
    : appItems.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6);

  const handleSelect = (item) => {
    if (item.category === 'data') {
      if (setGlobalSearch) setGlobalSearch(item.query);
    }
    onNavigate(item.id);
    setSearchQuery('');
    setShowResults(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      setActiveIndex(prev => Math.min(prev + 1, filteredResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      setActiveIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0) {
        handleSelect(filteredResults[activeIndex]);
      } else if (filteredResults.length > 0) {
        handleSelect(filteredResults[0]);
      }
    } else if (e.key === 'Escape') {
      setShowResults(false);
    }
  };

  return (
    <header className="fixed top-0 right-0 w-full lg:w-[calc(100%-256px)] h-16 z-[100] bg-white/80 backdrop-blur-md border-b border-surface-container-highest shadow-sm flex justify-between items-center px-3 sm:px-4 md:px-8 gap-2 sm:gap-4">
      <div className="flex items-center gap-2">
        <button 
          onClick={onMenuToggle}
          aria-label="Toggle mobile sidebar menu"
          aria-expanded={false}
          className="lg:hidden p-2 -ml-2 rounded-full hover:bg-surface-container-low transition-colors shrink-0 focus:ring-2 focus:ring-primary outline-none"
        >
          <span className="material-symbols-outlined" aria-hidden="true">menu</span>
        </button>
        <span className="text-lg md:text-xl font-bold tracking-tight text-primary hidden lg:block shrink-0">Election Assistant</span>
      </div>
      
      <div className="flex-1 max-w-xl mx-2 sm:mx-4 md:mx-8 relative" role="search">
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors" aria-hidden="true">search</span>
          <input 
            className="w-full bg-surface-container-low border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl pl-10 sm:pl-12 pr-4 py-2 sm:py-2.5 text-xs sm:text-sm transition-all outline-none" 
            placeholder="Search candidates, booths..." 
            aria-label="Global search for candidates, booths, and pages"
            type="search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowResults(true);
              setActiveIndex(-1);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowResults(true)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
          />
        </div>

        {/* Search Results Dropdown */}
        {showResults && searchQuery.trim() !== '' && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-surface-container-highest overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            {filteredResults.length > 0 ? (
              <>
                <div className="p-2">
                  <p className="text-[10px] font-black text-outline uppercase tracking-widest px-3 py-2">Quick Navigation</p>
                  {filteredResults.map((result, idx) => (
                    <button
                      key={`${result.id}-${idx}`}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSelect(result);
                      }}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all group text-left ${
                        activeIndex === idx ? 'bg-primary/5' : 'hover:bg-primary/5'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                        activeIndex === idx ? 'bg-primary/10 text-primary' : 'bg-surface-container-low text-outline'
                      }`}>
                        <span className="material-symbols-outlined">{result.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-bold truncate ${activeIndex === idx ? 'text-primary' : 'text-on-surface'}`}>{result.title}</p>
                        <p className="text-[10px] text-outline font-medium uppercase tracking-wider truncate">{result.type}</p>
                      </div>
                      <span className={`material-symbols-outlined text-primary text-sm transition-all shrink-0 ${
                        activeIndex === idx ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                      }`}>arrow_forward</span>
                    </button>
                  ))}
                </div>
                <div className="p-3 bg-surface-container-low border-t border-surface-container-highest flex justify-between items-center">
                  <p className="text-[10px] text-outline font-medium hidden sm:block">Use <span className="font-bold">↑↓</span> to navigate</p>
                  <p className="text-[10px] text-outline font-medium">Press <span className="font-bold">Enter</span> to select</p>
                </div>
              </>
            ) : (
              <div className="p-8 text-center">
                <span className="material-symbols-outlined text-outline/20 text-4xl mb-2">search_off</span>
                <p className="text-sm font-bold text-on-surface">No results found</p>
                <p className="text-[10px] text-outline uppercase tracking-wider mt-1">Try searching for "Candidates" or "Dashboard"</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4 text-outline shrink-0">
        <button 
          onClick={() => onNavigate('assistant')}
          aria-label="Open AI Help and Support"
          className="hover:bg-surface-container-low p-2 rounded-full transition-all active:scale-95 hidden sm:block focus:ring-2 focus:ring-primary outline-none"
          title="Help & Support"
        >
          <span className="material-symbols-outlined" aria-hidden="true">help_outline</span>
        </button>
        <div className="h-8 w-px bg-surface-container-highest mx-0 sm:mx-1 hidden sm:block" aria-hidden="true"></div>
        <button 
          className="flex items-center gap-2 sm:gap-3 cursor-pointer hover:bg-surface-container-low p-1 sm:pr-3 rounded-full transition-all focus:ring-2 focus:ring-primary outline-none"
          onClick={() => onNavigate('settings')}
          aria-label={`User profile settings for ${userProfile?.name || 'Voter'}`}
        >
          <div className="text-right hidden lg:block">
            <p className="text-xs font-bold text-on-surface">{userProfile?.name || 'Voter'}</p>
            <p className="text-[10px] text-outline uppercase tracking-wider">Voter ID: {userProfile?.voterId || 'N/A'}</p>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-primary-fixed shadow-sm overflow-hidden bg-surface-container-high flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-primary fill-icon text-sm sm:text-base" aria-hidden="true">person</span>
          </div>
        </button>
      </div>
    </header>
  )
}

export default Header
