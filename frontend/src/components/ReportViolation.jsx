import React, { useState, useEffect } from 'react';

const ReportViolation = ({ reports, setReports }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evidence, setEvidence] = useState(null);

  const [formData, setFormData] = useState({
    category: '',
    description: '',
    location: '',
    anonymous: false
  });

  const categories = [
    { id: 'liquor', label: 'Liquor Distribution', icon: 'local_bar', color: 'bg-orange-500' },
    { id: 'money', label: 'Cash for Votes', icon: 'payments', color: 'bg-green-600' },
    { id: 'noise', label: 'Loudspeaker/Noise', icon: 'volume_up', color: 'bg-blue-500' },
    { id: 'fights', label: 'Candidate Fights', icon: 'gavel', color: 'bg-red-600' },
    { id: 'ads', label: 'Illegal Posters/Ads', icon: 'ad_units', color: 'bg-purple-500' },
    { id: 'other', label: 'Other Violations', icon: 'report_problem', color: 'bg-gray-600' }
  ];

  const [selectedReport, setSelectedReport] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEvidence({
        name: file.name,
        preview: URL.createObjectURL(file)
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newReport = {
      id: `#BH-${Math.floor(Math.random() * 9000) + 1000}-V`,
      category: categories.find(c => c.id === formData.category)?.label || 'Report',
      status: 'Submitted',
      time: 'Just now',
      location: formData.location,
      description: formData.description,
      evidence: evidence?.preview
    };
    
    setReports([newReport, ...reports]);
    setIsSubmitting(false);
    setStep(3);
  };

  const handleAcknowledgeAndClose = (e) => {
    e.stopPropagation();
    // Remove the report from the list
    setReports(reports.filter(r => r.id !== selectedReport.id));
    setSelectedReport(null);
  };

  const [showAll, setShowAll] = useState(false);
  const displayedReports = showAll ? reports : reports.slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
      {/* Report Details Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer" onClick={() => setSelectedReport(null)}></div>
          <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
            <div className="bg-surface-container-low p-6 flex items-center justify-between border-b border-surface-container-highest">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">{selectedReport.id}</span>
                <h3 className="font-bold text-on-surface">Investigation Dossier</h3>
              </div>
              <button 
                type="button"
                onClick={(e) => { e.stopPropagation(); setSelectedReport(null); }} 
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-3xl">info</span>
                </div>
                <div>
                  <p className="text-[10px] font-black text-outline uppercase tracking-widest">Category</p>
                  <p className="text-xl font-black text-on-surface leading-tight">{selectedReport.category}</p>
                </div>
              </div>

              <div className="p-6 bg-surface-container-low rounded-[32px] border border-surface-container-highest">
                <p className="text-[10px] font-black text-outline uppercase tracking-widest mb-2">Description</p>
                <p className="text-sm text-on-surface-variant font-medium leading-relaxed italic">"{selectedReport.description || 'No description provided.'}"</p>
              </div>

              {selectedReport.evidence && (
                <div className="space-y-2">
                   <p className="text-[10px] font-black text-outline uppercase tracking-widest">Captured Evidence</p>
                   <div className="w-full h-48 rounded-[32px] overflow-hidden border-2 border-surface-container-highest shadow-inner bg-surface-container-low flex items-center justify-center">
                      <img src={selectedReport.evidence} alt="Evidence" className="w-full h-full object-contain" />
                   </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 bg-surface-container-low rounded-2xl">
                    <p className="text-[9px] font-black text-outline uppercase tracking-widest">Location</p>
                    <p className="text-xs font-bold text-on-surface">{selectedReport.location}</p>
                 </div>
                 <div className="p-4 bg-surface-container-low rounded-2xl">
                    <p className="text-[9px] font-black text-outline uppercase tracking-widest">Investigation</p>
                    <div className="flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                       <p className="text-xs font-bold text-primary">{selectedReport.status}</p>
                    </div>
                 </div>
              </div>
            </div>

            <div className="p-6 bg-surface-container-low border-t border-surface-container-highest">
               <button 
                 type="button"
                 onClick={handleAcknowledgeAndClose}
                 className="w-full py-4 bg-primary text-on-primary font-black uppercase text-[11px] tracking-widest rounded-2xl shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-95 flex items-center justify-center gap-2"
               >
                  <span className="material-symbols-outlined text-sm">done_all</span>
                  Acknowledge & Remove
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Reporting Form */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-[40px] border border-surface-container-highest overflow-hidden shadow-2xl">
          <div className="bg-error-container p-8 text-on-error-container relative overflow-hidden">
             {/* Decorative Background Icon */}
            <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[120px] opacity-10 rotate-12 select-none">verified_user</span>
            
            <div className="flex items-center gap-4 mb-2 relative z-10">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl">verified_user</span>
              </div>
              <h1 className="text-2xl font-black tracking-tight">cVIGIL Report</h1>
            </div>
            <p className="text-sm opacity-90 font-medium max-w-md relative z-10">Submit live evidence of Model Code of Conduct violations. Reports are investigated within 100 minutes.</p>
          </div>

          <div className="p-8">
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-on-surface">Select Category</h2>
                  <span className="text-[10px] font-black text-outline uppercase tracking-widest bg-surface-container-low px-3 py-1 rounded-full">Step 1 of 2</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setFormData({ ...formData, category: cat.id });
                        setStep(2);
                      }}
                      className="flex flex-col items-center gap-4 p-6 rounded-[32px] border border-surface-container-highest hover:border-primary hover:bg-primary/5 hover:shadow-lg transition-all group relative overflow-hidden"
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${cat.color} group-hover:scale-110 transition-transform shadow-lg`}>
                        <span className="material-symbols-outlined text-2xl">{cat.icon}</span>
                      </div>
                      <span className="text-[11px] font-bold text-on-surface-variant text-center leading-tight">
                        {cat.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center justify-between">
                   <h2 className="text-lg font-bold text-on-surface">Incident Details</h2>
                   <span className="text-[10px] font-black text-outline uppercase tracking-widest bg-surface-container-low px-3 py-1 rounded-full">Step 2 of 2</span>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-outline uppercase tracking-widest px-1">Describe what you saw</label>
                  <textarea 
                    required
                    rows="4"
                    className="w-full bg-surface-container-low border-none rounded-[32px] p-6 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none"
                    placeholder="Provide as much detail as possible (Date, Time, People involved...)"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div className="relative">
                  <input 
                    type="file" 
                    id="evidence-upload" 
                    className="hidden" 
                    onChange={handleFileChange}
                    accept="image/*,video/*"
                  />
                  <label 
                    htmlFor="evidence-upload"
                    className="flex flex-col items-center justify-center bg-surface-container-lowest border-2 border-dashed border-surface-container-highest rounded-[32px] p-10 text-center cursor-pointer hover:bg-surface-container-low hover:border-primary/30 transition-all group"
                  >
                    {evidence ? (
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-primary/20 shadow-xl">
                          <img src={evidence.preview} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-primary">{evidence.name}</p>
                          <p className="text-[10px] text-outline uppercase font-black">Click to change</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <span className="material-symbols-outlined text-4xl text-primary">add_a_photo</span>
                        </div>
                        <p className="text-sm font-bold text-on-surface">Upload Photo/Video Proof</p>
                        <p className="text-[10px] text-outline mt-1 uppercase tracking-wider font-medium">Mandatory for live verification</p>
                      </>
                    )}
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 flex items-center gap-4 p-4 bg-surface-container-low rounded-3xl border border-surface-container-highest">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined">location_on</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-[9px] font-black text-outline uppercase tracking-widest">Incident Location</p>
                      <input 
                        type="text" 
                        required
                        className="w-full bg-transparent border-none text-xs font-bold text-on-surface focus:ring-0 p-0 outline-none placeholder:text-outline"
                        placeholder="Enter incident location..."
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-3xl border border-surface-container-highest">
                    <input 
                      type="checkbox" 
                      id="anon"
                      className="w-6 h-6 rounded-lg border-surface-container-highest text-primary focus:ring-primary/20 cursor-pointer"
                      checked={formData.anonymous}
                      onChange={(e) => setFormData({...formData, anonymous: e.target.checked})}
                    />
                    <label htmlFor="anon" className="text-xs font-bold text-on-surface-variant cursor-pointer">Post Anonymously</label>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setStep(1)}
                    className="flex-1 h-14 bg-surface-container-highest text-on-surface font-black uppercase text-[11px] tracking-widest rounded-2xl transition-all"
                  >
                    Back
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting || !evidence}
                    className={`flex-[2] h-14 flex items-center justify-center gap-3 font-black uppercase text-[11px] tracking-widest rounded-2xl shadow-xl transition-all active:scale-95 ${
                      isSubmitting || !evidence ? 'bg-surface-container-high text-outline cursor-not-allowed' : 'bg-primary text-on-primary hover:opacity-90 shadow-primary/20'
                    }`}
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        Submit Report
                        <span className="material-symbols-outlined text-lg">send</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {step === 3 && (
              <div className="text-center py-12 animate-in zoom-in-95 duration-500">
                <div className="w-24 h-24 bg-success-container text-on-success-container rounded-[32px] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-success/10 rotate-3">
                  <span className="material-symbols-outlined text-5xl">check_circle</span>
                </div>
                <h2 className="text-2xl font-black text-on-surface mb-2 tracking-tight">Report Successfully Filed</h2>
                <p className="text-outline text-sm mb-10 px-8 leading-relaxed font-medium">
                  Your report has been received and assigned ID <span className="text-primary font-black">{reports[0]?.id || '#BH-88291-C'}</span>. 
                  Our Flying Squad will reach the location within <span className="text-primary font-black">100 minutes</span>.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => {
                      setFormData({ category: '', description: '', location: '', anonymous: false });
                      setEvidence(null);
                      setStep(1);
                    }}
                    className="h-14 px-8 bg-primary text-on-primary font-black uppercase text-[11px] tracking-widest rounded-2xl hover:opacity-90 transition-all shadow-xl shadow-primary/20"
                  >
                    File Another
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedReport(reports[0]);
                      setFormData({ category: '', description: '', location: '', anonymous: false });
                      setEvidence(null);
                      setStep(1);
                    }}
                    className="h-14 px-8 bg-surface-container-highest text-on-surface font-black uppercase text-[11px] tracking-widest rounded-2xl hover:bg-surface-container-high transition-all"
                  >
                    View Status
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar: Guidelines and History */}
      <div className="space-y-6">
        {/* History Tracker */}
        <div className="bg-white rounded-[32px] border border-surface-container-highest p-6 shadow-xl overflow-hidden relative">
           <div className="flex items-center justify-between mb-6">
              <h3 className="font-black text-[11px] uppercase tracking-widest text-on-surface">My History</h3>
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
           </div>
           
           <div className="space-y-4">
             {displayedReports.map((report) => (
               <div 
                 key={report.id} 
                 onClick={() => setSelectedReport(report)}
                 className="p-4 bg-surface-container-lowest rounded-2xl border border-surface-container-highest group cursor-pointer hover:border-primary/30 transition-all hover:shadow-md active:scale-95"
               >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-black text-primary">{report.id}</span>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                      report.status === 'Resolved' ? 'bg-success-container text-on-success-container' : 'bg-primary/10 text-primary'
                    }`}>
                      {report.status}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-on-surface mb-1 group-hover:text-primary transition-colors">{report.category}</p>
                  <p className="text-[10px] text-outline font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    {report.location} • {report.time}
                  </p>
               </div>
             ))}
             {reports.length === 0 && (
               <p className="text-xs text-outline font-medium text-center py-4">No reports filed yet.</p>
             )}
           </div>
           
           {reports.length > 3 && (
             <button 
               onClick={() => setShowAll(!showAll)}
               className="w-full mt-6 py-4 text-[10px] font-black text-outline uppercase tracking-widest border-t border-surface-container-highest hover:text-primary transition-colors"
             >
                {showAll ? 'Show Less' : `View All ${reports.length} Reports`}
             </button>
           )}
        </div>

        {/* Guidelines */}
        <div className="bg-primary-container p-8 rounded-[32px] border border-primary/10 text-on-primary-container relative overflow-hidden">
          <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[80px] opacity-10 -rotate-12 select-none">gavel</span>
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <span className="material-symbols-outlined text-primary">info</span>
            <h3 className="font-black text-[11px] uppercase tracking-widest">ECI Guidelines</h3>
          </div>
          <ul className="space-y-4 relative z-10">
            {[
              'Always capture live evidence at the location.',
              'Photos/Videos must show the violation clearly.',
              'False reporting is a punishable offense.',
              'Response time is guaranteed within 100 mins.'
            ].map((text, i) => (
              <li key={i} className="flex gap-3 text-xs font-bold leading-tight opacity-90">
                <span className="text-primary">•</span>
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReportViolation;
