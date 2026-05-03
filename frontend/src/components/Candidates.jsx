import React, { useState, useEffect } from 'react';

// Simple module-level cache for efficiency
let cachedCandidates = null;

const Candidates = () => {
  const [candidates, setCandidates] = useState(cachedCandidates || []);
  const [loading, setLoading] = useState(!cachedCandidates);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  useEffect(() => {
    if (cachedCandidates) return; // Use cache if available

    fetch('http://localhost:8000/candidates')
      .then(res => res.json())
      .then(data => {
        cachedCandidates = data; // Set cache
        setCandidates(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching candidates:', err);
        setLoading(false);
      });
  }, []);

  const getSymbolIcon = (symbol) => {
    switch (symbol) {
      case 'lotus': return '🌸';
      case 'front_hand': return '✋';
      case 'cleaning_services': return '🧹';
      case 'elephant': return '🐘';
      case 'kettle': return '☕';
      default: return '🗳️';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <section aria-labelledby="candidates-heading" className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* ... existing header content ... */}
          <div>
            <h1 id="candidates-heading" className="text-3xl font-bold tracking-tight text-on-surface mb-2">Know Your Candidate (KYC)</h1>
            <p className="text-outline">Bhopal Constituency (General) | Lok Sabha Elections 2024</p>
          </div>
          <div className="bg-primary-container text-on-primary-container px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">verified</span>
            Verified Affidavits
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
          {candidates.map((candidate) => (
            <article 
              key={candidate.id}
              role="listitem"
              className="group bg-white rounded-3xl border border-surface-container-highest overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 cursor-pointer focus-within:ring-2 focus-within:ring-primary outline-none"
              tabIndex={0}
              aria-label={`View profile of ${candidate.name}`}
              onClick={() => setSelectedCandidate(candidate)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedCandidate(candidate);
                }
              }}
            >
              <div className="relative h-48 overflow-hidden bg-surface-container-high flex items-center justify-center">
                <div className="text-6xl opacity-20">
                  {getSymbolIcon(candidate.partySymbol)}
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-2xl shadow-sm">
                  {getSymbolIcon(candidate.partySymbol)}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <h3 className="text-white font-bold text-xl">{candidate.name}</h3>
                  <p className="text-white/80 text-xs font-medium">{candidate.party}</p>
                </div>
              </div>
              
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] text-outline uppercase tracking-wider font-bold">Assets</p>
                    <p className="text-sm font-bold text-on-surface">{candidate.assets}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-outline uppercase tracking-wider font-bold">Education</p>
                    <p className="text-sm font-bold text-on-surface">{candidate.education}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-surface-container-highest">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${candidate.criminalCases > 0 ? 'bg-error' : 'bg-success'}`}></div>
                    <p className="text-xs font-medium">
                      {candidate.criminalCases} Criminal Cases
                    </p>
                  </div>
                  <button className="text-primary text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                    View Profile <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Candidate Detail Modal - Moved outside the animated container to escape stacking context */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 backdrop-glass animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="modal-candidate-name">
          <article className="bg-white rounded-[40px] w-full max-w-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
            <div className="relative h-48 bg-primary/5 flex items-center justify-center">
              <div className="text-8xl opacity-10">
                {getSymbolIcon(selectedCandidate.partySymbol)}
              </div>
              <button 
                onClick={() => setSelectedCandidate(null)}
                aria-label="Close candidate profile modal"
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-surface-container-highest text-on-surface hover:bg-surface-container-high transition-all flex items-center justify-center focus:ring-2 focus:ring-primary outline-none"
              >
                <span className="material-symbols-outlined" aria-hidden="true">close</span>
              </button>
            </div>
            
            <div className="px-8 pb-4 pt-4 border-b border-surface-container-highest">
               <div className="flex items-end justify-between">
                  <div>
                    <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2">
                      {selectedCandidate.party}
                    </span>
                    <h2 id="modal-candidate-name" className="text-3xl font-black text-on-surface">{selectedCandidate.name}</h2>
                  </div>
                  <div className="text-4xl bg-surface-container-low p-3 rounded-2xl shadow-inner">
                    {getSymbolIcon(selectedCandidate.partySymbol)}
                  </div>
                </div>
            </div>
            
            <div className="p-8 space-y-6">
              <p className="text-on-surface-variant leading-relaxed">
                {selectedCandidate.description}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-surface-container-low p-4 rounded-2xl">
                  <p className="text-[10px] text-outline font-bold uppercase mb-1">Age</p>
                  <p className="text-lg font-black text-on-surface">{selectedCandidate.age}</p>
                </div>
                <div className="bg-surface-container-low p-4 rounded-2xl">
                  <p className="text-[10px] text-outline font-bold uppercase mb-1">Cases</p>
                  <p className={`text-lg font-black ${selectedCandidate.criminalCases > 0 ? 'text-error' : 'text-success'}`}>
                    {selectedCandidate.criminalCases}
                  </p>
                </div>
                <div className="bg-surface-container-low p-4 rounded-2xl">
                  <p className="text-[10px] text-outline font-bold uppercase mb-1">Assets</p>
                  <p className="text-lg font-black text-on-surface">{selectedCandidate.assets}</p>
                </div>
                <div className="bg-surface-container-low p-4 rounded-2xl">
                  <p className="text-[10px] text-outline font-bold uppercase mb-1">Liabilities</p>
                  <p className="text-lg font-black text-error">{selectedCandidate.liabilities}</p>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button className="flex-1 bg-primary text-on-primary py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all focus:ring-2 focus:ring-primary focus:ring-offset-2 outline-none">
                  View Full Affidavit (PDF)
                </button>
                <button aria-label="Share candidate profile" className="bg-surface-container-highest text-on-surface-variant px-6 rounded-2xl font-bold hover:bg-surface-container-high transition-all focus:ring-2 focus:ring-primary focus:ring-offset-2 outline-none">
                  <span className="material-symbols-outlined mt-1" aria-hidden="true">share</span>
                </button>
              </div>
            </div>
          </article>
        </div>
      )}
    </>
  );
};

export default Candidates;
