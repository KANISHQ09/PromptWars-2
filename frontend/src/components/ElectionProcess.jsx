import React, { useState, useEffect } from 'react'

const ElectionProcess = () => {
  const [steps, setSteps] = useState([])
  const [showEvmDetails, setShowEvmDetails] = useState(false)
  const [showVideoModal, setShowVideoModal] = useState(false)

  useEffect(() => {
    fetch('http://localhost:8000/election/steps')
      .then(res => res.json())
      .then(data => setSteps(data))
      .catch(err => console.error(err))
  }, [])

  const evmSteps = [
    { title: 'Verification', desc: 'Identify yourself with EPIC card and get your finger marked with ink.', icon: 'person_check' },
    { title: 'Ballot Activation', desc: 'The polling officer activates the Ballot Unit from the Control Unit.', icon: 'power_settings_new' },
    { title: 'Cast Vote', desc: 'Press the blue button next to your chosen candidate symbol.', icon: 'touch_app' },
    { title: 'Confirm VVPAT', desc: 'Verify your choice on the printed slip for 7 seconds.', icon: 'receipt_long' },
  ]

  return (
    <div className="animate-fade-in pb-20">
      {/* Video Modal Overlay */}
      {showVideoModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300">
          <div 
            className="absolute inset-0 bg-on-background/90 backdrop-blur-md" 
            onClick={() => setShowVideoModal(false)}
          />
          <div className="relative z-10 w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/10 animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setShowVideoModal(false)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all z-20 backdrop-blur-sm border border-white/10"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <iframe 
              className="w-full h-full"
              src="https://www.youtube.com/embed/uqdmAlqn070?autoplay=1" 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              referrerPolicy="strict-origin-when-cross-origin" 
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-on-surface tracking-tight">Election Process</h1>
          <p className="text-outline mt-1 font-medium">Understanding the journey of a single vote.</p>
        </div>
        <div className="flex gap-2">
           <button className="p-2 rounded-lg border border-surface-container-highest hover:bg-white transition-all">
             <span className="material-symbols-outlined text-outline">download</span>
           </button>
           <button className="p-2 rounded-lg border border-surface-container-highest hover:bg-white transition-all">
             <span className="material-symbols-outlined text-outline">share</span>
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map((step, index) => (
          <div key={step.title} className="card group hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between h-full">
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <span className="text-xl font-black">{index + 1}</span>
                </div>
                <span className="material-symbols-outlined text-surface-container-highest group-hover:text-primary/20 transition-colors text-4xl">
                  {['assignment', 'campaign', 'how_to_vote', 'analytics', 'done_all'][index] || 'category'}
                </span>
              </div>
              <h3 className="text-xl font-bold text-on-surface group-hover:text-primary transition-colors">{step.title}</h3>
              <p className="text-sm text-outline mt-3 leading-relaxed">{step.details}</p>
            </div>
            
            <div className="mt-8 pt-6 border-t border-surface-container-high flex justify-between items-center">
               <span className="text-[10px] font-bold text-outline uppercase tracking-wider">Estimated Duration</span>
               <span className="text-xs font-bold text-on-surface">Varies</span>
            </div>
          </div>
        ))}

        {/* Informational EVM Card */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 mt-4 bg-tertiary text-on-tertiary p-8 rounded-2xl flex flex-col md:flex-row items-center gap-8 shadow-xl overflow-hidden relative min-h-[400px]">
           <div className="relative z-10 space-y-6 max-w-2xl">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold">Secure Voting with EVM & VVPAT</h2>
                <p className="text-on-tertiary/80 leading-relaxed text-lg">
                  India uses Electronic Voting Machines (EVM) integrated with Voter Verifiable Paper Audit Trail (VVPAT). 
                  When you cast your vote, a paper slip is displayed for 7 seconds, confirming your choice before it drops into a sealed box.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4 pt-2">
                 <button 
                  onClick={() => setShowEvmDetails(!showEvmDetails)}
                  className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${showEvmDetails ? 'bg-tertiary-fixed text-on-tertiary-fixed' : 'bg-white text-tertiary hover:bg-tertiary-fixed'}`}
                 >
                    {showEvmDetails ? 'Hide Details' : 'Learn How it Works'}
                    <span className="material-symbols-outlined text-sm">{showEvmDetails ? 'expand_less' : 'expand_more'}</span>
                 </button>
                 <button 
                  onClick={() => setShowVideoModal(true)}
                  className="bg-tertiary-container text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-all flex items-center gap-2 border border-white/20"
                 >
                    Watch Demo
                    <span className="material-symbols-outlined text-sm">play_circle</span>
                 </button>
              </div>

              {showEvmDetails && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 animate-slide-up">
                  {evmSteps.map((s, i) => (
                    <div key={i} className="bg-white/10 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="material-symbols-outlined text-tertiary-fixed">{s.icon}</span>
                        <h4 className="font-bold text-sm">{s.title}</h4>
                      </div>
                      <p className="text-xs text-on-tertiary/70 leading-relaxed">{s.desc}</p>
                    </div>
                  ))}
                </div>
              )}
           </div>
           
           <div 
            onClick={() => setShowVideoModal(true)}
            className="relative z-10 w-full md:w-1/2 aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 group cursor-pointer"
           >
              <iframe 
                className="w-full h-full pointer-events-none"
                src="https://www.youtube.com/embed/uqdmAlqn070?si=CKFCZGtIs564D5m4" 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen
              ></iframe>
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center scale-75 group-hover:scale-100 transition-all duration-500 shadow-2xl border border-white/30">
                  <span className="material-symbols-outlined text-white text-5xl fill-icon">play_arrow</span>
                </div>
              </div>
           </div>
           
           <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
           <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
        </div>
      </div>
    </div>
  )
}

export default ElectionProcess
