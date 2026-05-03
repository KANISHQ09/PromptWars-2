import React, { useState, useEffect } from 'react'

const Timeline = () => {
  const [timeline, setTimeline] = useState([])

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/election/timeline`)
      .then(res => res.json())
      .then(data => setTimeline(data))
      .catch(err => console.error(err))
  }, [])

  return (
    <div className="animate-fade-in">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-on-surface tracking-tight">Election Timeline</h1>
        <p className="text-outline mt-1 font-medium">The key stages of the Indian General Election process.</p>
      </div>

      <div className="relative border-l-2 border-primary/20 ml-6 pl-10 space-y-12">
        {timeline.map((item, index) => {
          // Mock current date for logic: May 03, 2024
          const isCompleted = index < 3; // Announcement, Notification, Nominations done
          const isLive = index === 3;    // Campaigning is ongoing (Ends May 05)
          const isUpcoming = index > 3;  // Polling and Counting yet to happen

          return (
            <div key={item.stage} className="relative">
              {/* Dot */}
              <div className={`absolute -left-[51px] top-0 w-6 h-6 rounded-full border-4 border-white shadow-md transition-all duration-500 ${
                isLive ? 'bg-primary scale-125 ring-4 ring-primary/20' : 
                isCompleted ? 'bg-success' : 'bg-surface-container-highest'
              }`}>
                {isCompleted && (
                  <span className="material-symbols-outlined text-white text-[10px] flex items-center justify-center h-full">check</span>
                )}
              </div>
              
              <div className={`card transition-all group ${isLive ? 'border-primary ring-1 ring-primary/20' : 'hover:border-primary/20'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded ${
                        isLive ? 'bg-primary text-on-primary' : 
                        isCompleted ? 'bg-success/10 text-success' : 'bg-primary/5 text-primary'
                      }`}>
                        {isLive ? 'Current Stage' : isCompleted ? 'Completed' : `Stage ${index + 1}`}
                      </span>
                      {isLive && <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>}
                    </div>
                    <h3 className="text-xl font-bold text-on-surface mt-2">{item.stage}</h3>
                    <p className={`text-sm font-bold ${isLive ? 'text-primary' : isCompleted ? 'text-success' : 'text-outline'}`}>
                      {item.date}
                    </p>
                  </div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isLive ? 'bg-primary/10 text-primary' : 'bg-surface-container-low text-outline'}`}>
                    <span className="material-symbols-outlined">
                      {['announcement', 'description', 'assignment', 'campaign', 'how_to_vote', 'analytics', 'account_balance'][index] || 'event'}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <p className="text-sm text-outline leading-relaxed">{item.description}</p>
                  
                  <div className={`p-4 rounded-lg border flex items-start gap-3 ${
                    isLive ? 'bg-primary/5 border-primary/10' : 'bg-tertiary/5 border-tertiary/10'
                  }`}>
                     <span className={`material-symbols-outlined text-sm mt-0.5 ${isLive ? 'text-primary' : 'text-tertiary'}`}>
                       {isLive ? 'info' : 'bolt'}
                     </span>
                     <div>
                       <p className={`text-[10px] font-black uppercase tracking-widest ${isLive ? 'text-primary' : 'text-tertiary'}`}>
                         {isLive ? 'Current Focus' : 'Impact'}
                       </p>
                       <p className="text-xs text-on-surface-variant font-medium mt-1">{item.impact}</p>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default Timeline
