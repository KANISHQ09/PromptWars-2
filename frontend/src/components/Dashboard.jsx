import React from 'react'

const Dashboard = ({ onNavigate, userProfile, setGlobalSearch }) => {
  const [searchQuery, setSearchQuery] = React.useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    // Set global search for polling page
    if (setGlobalSearch) setGlobalSearch(searchQuery)
    // Navigate to polling booths page
    onNavigate('polling')
  }

  const quickActions = [
    { id: 'candidates', label: 'Know Candidates', sub: 'Profiles & Affidavits', icon: 'group', color: 'bg-primary/5', text: 'text-primary' },
    { id: 'report', label: 'Report Violation', sub: 'cVIGIL Citizen Action', icon: 'verified_user', color: 'bg-error/5', text: 'text-error' },
    { id: 'process', label: 'Learn Process', sub: 'Step-by-step voting guide', icon: 'how_to_vote', color: 'bg-tertiary/5', text: 'text-tertiary' },
    { id: 'assistant', label: 'Ask Assistant', sub: 'Chat with Civic Bot', icon: 'chat_bubble', color: 'bg-secondary/5', text: 'text-secondary' },
  ]

  const upcomingDates = [
    { month: 'May', day: '05', title: 'Campaigning Ends', sub: 'Last 48 hours of public rallies', active: true },
    { month: 'May', day: '07', title: 'Phase 3 (Bhopal)', sub: 'Polling day - 4 days to go', active: false },
    { month: 'May', day: '13', title: 'Phase 4 Voting', sub: '96 seats across India', active: false },
    { month: 'Jun', day: '04', title: 'Counting Day', sub: 'Final results declaration', active: false },
  ]

  return (
    <div className="animate-fade-in space-y-8">
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-on-surface tracking-tight">Hi, {userProfile.name} 👋</h1>
          <p className="text-base md:text-lg text-outline mt-2 font-medium">Madhya Pradesh is voting in Phase 3. Are you ready?</p>
        </div>
        <div className="w-full md:w-auto bg-white px-6 py-4 rounded-2xl shadow-sm border border-primary/10 flex items-center gap-5">
          <div className="relative shrink-0">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-3xl">timer</span>
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-error rounded-full border-2 border-white animate-pulse shadow-sm"></div>
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-black text-primary uppercase tracking-widest">Election Countdown</p>
            <p className="text-lg font-black text-on-surface leading-tight">4 Days to Go</p>
            <p className="text-[11px] text-outline font-medium">Bhopal votes on May 07</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-12 gap-6">
        {/* Hero Search Card */}
        <div className="col-span-12 lg:col-span-8 card relative overflow-hidden flex flex-col justify-between min-h-[240px]">
          <div className="relative z-10">
            <h3 className="text-xl sm:text-2xl font-bold text-on-surface mb-2">Ready to explore elections?</h3>
            <p className="text-sm sm:text-base text-outline max-w-md">Find upcoming local, state, and federal elections tailored to your residential district.</p>
          </div>
          <form onSubmit={handleSearch} className="relative z-10 mt-6 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary">search</span>
              <input 
                className="w-full bg-surface-container-low border-2 border-transparent focus:border-primary/20 focus:ring-0 rounded-xl pl-12 pr-4 py-4 outline-none transition-all text-sm sm:text-base" 
                placeholder="Enter your ZIP code or city..." 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button type="submit" className="bg-primary text-on-primary px-8 py-4 sm:py-2 rounded-xl font-bold hover:opacity-90 shadow-lg active:scale-95 transition-all w-full sm:w-auto">
              Search
            </button>
          </form>
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
        </div>

        {/* Status Card */}
        <div className="col-span-12 lg:col-span-4 card border-l-4 border-l-tertiary flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold uppercase tracking-widest rounded-full">Active Status</span>
              <span className="material-symbols-outlined text-tertiary text-3xl fill-icon">check_circle</span>
            </div>
            <h3 className="text-xl font-bold text-on-surface">Registration Status</h3>
            <p className="text-sm text-outline mt-2 leading-relaxed">You are currently registered to vote in <strong>{userProfile.district}</strong>.</p>
          </div>
          <button 
            onClick={() => onNavigate('assistant')}
            className="mt-6 w-full py-3 border-2 border-surface-container-highest rounded-lg text-on-surface font-bold hover:bg-surface-container-low transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            Check Status <span className="material-symbols-outlined text-sm">open_in_new</span>
          </button>
        </div>

        {/* Quick Actions */}
        <div className="col-span-12 lg:col-span-7 space-y-4">
          <h4 className="text-[10px] font-bold text-outline uppercase tracking-widest">Quick Actions</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <button 
                key={action.label} 
                onClick={() => onNavigate(action.id)}
                className="bg-white p-6 rounded-xl border border-surface-container-highest shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:border-primary/40 hover:-translate-y-1 transition-all group text-left w-full"
              >
                <div className={`w-12 h-12 rounded-lg shrink-0 ${action.color} flex items-center justify-center ${action.text} group-hover:bg-primary group-hover:text-white transition-colors`}>
                  <span className="material-symbols-outlined">{action.icon}</span>
                </div>
                <div>
                  <p className="font-bold text-on-surface">{action.label}</p>
                  <p className="text-xs text-outline mt-1">{action.sub}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Upcoming Dates */}
        <div className="col-span-12 lg:col-span-5 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-[10px] font-bold text-outline uppercase tracking-widest">Upcoming Dates</h4>
            <button onClick={() => onNavigate('timeline')} className="text-xs font-bold text-primary hover:underline">View All</button>
          </div>
          <div className="bg-white rounded-xl border border-surface-container-highest shadow-sm divide-y divide-surface-container-high overflow-hidden">
            {upcomingDates.map((date) => (
              <div 
                key={date.title} 
                onClick={() => onNavigate('timeline')}
                className="flex items-center gap-4 p-4 hover:bg-surface-container-low transition-colors cursor-pointer"
              >
                <div className="flex flex-col items-center justify-center min-w-[56px] h-14 bg-surface-container-high rounded-lg">
                  <span className="text-[10px] font-bold text-outline uppercase">{date.month}</span>
                  <span className="text-xl font-black text-on-surface leading-tight">{date.day}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-on-surface">{date.title}</p>
                  <p className="text-xs text-outline">{date.sub}</p>
                </div>
                {date.active && <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
