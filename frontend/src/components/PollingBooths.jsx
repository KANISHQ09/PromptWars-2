import React, { useState, useEffect, useRef } from 'react'

const PollingBooths = ({ onNavigate, setContext, initialSearch, onSearchClear, userProfile }) => {
  const [allBooths, setAllBooths] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(initialSearch || '')
  const [activeFilter, setActiveFilter] = useState('All')
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [activeLayer, setActiveLayer] = useState('Voyager')
  const mapRef = useRef(null)
  const mapInstance = useRef(null)
  const tileLayerRef = useRef(null)
  const markersRef = useRef([])

  // Sync initialSearch if it changes from outside (e.g. Dashboard)
  useEffect(() => {
    if (initialSearch !== undefined) {
      setSearchQuery(initialSearch)
    }
  }, [initialSearch])

  useEffect(() => {
    const fetchBooths = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/booths`)
        const data = await response.json()
        setAllBooths(data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching booths:', error)
        setLoading(false)
      }
    }
    fetchBooths()
  }, [])

  const filterOptions = ['All', 'OPEN', 'CLOSED', 'Full access', 'Limited access']

  const booths = allBooths.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         b.address.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (activeFilter === 'All') return matchesSearch
    if (activeFilter === 'OPEN' || activeFilter === 'CLOSED') {
      return matchesSearch && b.status === activeFilter
    }
    return matchesSearch && b.access === activeFilter
  })

  // Map Initialization and Booth Markers
  useEffect(() => {
    if (!window.L || loading || allBooths.length === 0) return;

    if (!mapInstance.current) {
      // Default center is Bhopal
      const defaultCenter = [23.25, 77.41];
      mapInstance.current = window.L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView(defaultCenter, 13);

      // Handle location errors/found
      mapInstance.current.on('locationerror', () => {
        console.log("Location access denied or unavailable.");
      });
      
      mapInstance.current.on('locationfound', (e) => {
        // Check if user is in Bhopal (approx)
        const bhopalBounds = window.L.latLngBounds([23.0, 77.1], [23.5, 77.7]);
        if (!bhopalBounds.contains(e.latlng)) {
          alert("Your current location is outside Bhopal. Showing Bhopal polling booths instead.");
          mapInstance.current.setView(defaultCenter, 13);
        }
      });
    }

    // Update Tile Layer based on activeLayer
    if (tileLayerRef.current) {
      tileLayerRef.current.remove();
    }

    let url = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    if (activeLayer === 'Terrain') {
      url = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
    } else if (activeLayer === 'Traffic') {
      url = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'; // Lighter map for "traffic" context
    }

    tileLayerRef.current = window.L.tileLayer(url, {
      maxZoom: 20,
      attribution: '© OpenStreetMap'
    }).addTo(mapInstance.current);

    // Clear and Add Markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    booths.forEach(booth => {
      const customIcon = window.L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: ${booth.closed ? '#727687' : '#0050cb'}; color: white; padding: 8px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.2); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); transform-origin: bottom center;" class="marker-pin"><span class="material-symbols-outlined" style="font-size: 20px; display: block;">how_to_vote</span></div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      const marker = window.L.marker(booth.coords, { icon: customIcon })
        .addTo(mapInstance.current)
        .bindPopup(`
          <div style="padding: 12px; font-family: 'Public Sans', sans-serif; min-width: 200px;">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
              <b style="font-size: 16px; color: #1b1b1f;">${booth.name}</b>
              <span style="background: ${booth.status === 'OPEN' ? '#006d39' : '#ba1a1a'}; color: white; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: bold;">${booth.status}</span>
            </div>
            <p style="font-size: 12px; color: #44474e; margin: 0 0 12px 0;">${booth.address}</p>
            <div style="margin-bottom: 12px; padding: 8px; background: #f0f4f8; border-radius: 12px; display: flex; align-items: center; gap: 10px;">
              <div style="width: 32px; height: 32px; border-radius: 50%; background: #0050cb; display: flex; align-items: center; justify-content: center; color: white;">
                <span class="material-symbols-outlined" style="font-size: 18px;">person</span>
              </div>
              <div>
                <p style="font-size: 9px; color: #44474e; margin: 0; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">BLO: ${booth.bloName}</p>
                <p style="font-size: 12px; color: #0050cb; margin: 0; font-weight: 900;">${booth.bloContact}</p>
              </div>
            </div>
            <div style="display: flex; gap: 8px;">
              <button onclick="window.handleNavigate(${booth.coords[0]}, ${booth.coords[1]})" style="flex: 1; padding: 8px; background: #0050cb; color: white; border: none; border-radius: 8px; font-size: 12px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;">
                <span class="material-symbols-outlined" style="font-size: 18px;">near_me</span>
                Navigate
              </button>
              <button onclick="window.askAI('${booth.name}')" style="padding: 8px; background: #f0f4f8; color: #0050cb; border: none; border-radius: 8px; font-size: 12px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                <span class="material-symbols-outlined" style="font-size: 18px;">smart_toy</span>
              </button>
            </div>
          </div>
        `, {
          className: 'premium-popup'
        });
      markersRef.current.push(marker);
    });

    // If initial search is empty but we have user district, center on those booths first
    if (!searchQuery && userProfile?.district && activeFilter === 'All') {
      const area = userProfile.district.split(',')[0].toLowerCase().trim();
      const districtBooths = allBooths.filter(b => b.address.toLowerCase().includes(area) || b.name.toLowerCase().includes(area));
      
      if (districtBooths.length > 0) {
        // Find markers for these booths
        const districtMarkers = markersRef.current.filter((_, idx) => 
          districtBooths.some(db => db.name === booths[idx].name)
        );
        if (districtMarkers.length > 0) {
          const group = new window.L.featureGroup(districtMarkers);
          mapInstance.current.fitBounds(group.getBounds().pad(0.3));
          return; // Skip general fitBounds
        }
      }
    }

    if (booths.length > 0 && (searchQuery || activeFilter !== 'All')) {
      const group = new window.L.featureGroup(markersRef.current);
      mapInstance.current.fitBounds(group.getBounds().pad(0.1));
    }
  }, [booths, loading, allBooths, activeLayer, userProfile]);

  // Expose global functions to window for popup clicks
  useEffect(() => {
    window.askAI = (name) => {
      const booth = allBooths.find(b => b.name === name)
      if (booth) handleAskAI(booth)
    }
    window.handleNavigate = (lat, lng) => {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
    }
    return () => {
      delete window.askAI;
      delete window.handleNavigate;
    }
  }, [allBooths])

  const handleAskAI = (booth) => {
    if (setContext) {
      setContext({ 
        type: 'booth_inquiry', 
        booth: booth 
      })
    }
    if (onNavigate) {
      onNavigate('assistant')
    }
  }

  const zoomIn = () => mapInstance.current?.zoomIn();
  const zoomOut = () => mapInstance.current?.zoomOut();
  const locateMe = () => mapInstance.current?.locate({ setView: true, maxZoom: 15 });

  if (loading) {
    return (
      <div className="h-[calc(100vh-160px)] flex items-center justify-center bg-surface-container-lowest -m-8">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-bold text-primary uppercase tracking-widest">Loading Polling Data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in flex flex-col md:flex-row h-[calc(100vh-160px)] -m-8 overflow-hidden">
      <div className="w-full md:w-[450px] bg-white border-r border-surface-container-highest flex flex-col h-full z-20 shadow-xl relative">
        <div className="p-8 space-y-4 border-b border-surface-container-highest bg-white">
          <h1 className="text-3xl font-bold text-on-surface tracking-tight">Polling Booths</h1>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-outline uppercase tracking-widest">Search by location</label>
            <div className="relative group">
              <input 
                className="w-full h-12 pl-12 pr-4 bg-surface-container-low border-2 border-transparent focus:border-primary/20 rounded-xl font-medium outline-none transition-all focus:bg-white" 
                placeholder="Enter area or booth name" 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="material-symbols-outlined absolute left-4 top-3 text-primary">search</span>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface-container-lowest no-scrollbar">
          <div className="mb-4 px-2 flex items-center justify-between relative">
             <span className="text-[10px] font-bold text-outline uppercase tracking-widest">{booths.length} Booths available</span>
             <div className="relative">
               <button 
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className={`text-[10px] font-bold flex items-center gap-1 uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all ${activeFilter !== 'All' ? 'bg-primary text-white' : 'text-primary bg-primary/5 hover:bg-primary/10'}`}
               >
                 <span className="material-symbols-outlined text-sm">tune</span> {activeFilter === 'All' ? 'Filter' : activeFilter}
               </button>
               
               {showFilterMenu && (
                 <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-2xl border border-surface-container-highest z-50 overflow-hidden animate-fade-in">
                   {filterOptions.map(option => (
                     <button
                       key={option}
                       onClick={() => {
                         setActiveFilter(option)
                         setShowFilterMenu(false)
                       }}
                       className={`w-full text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider transition-colors ${activeFilter === option ? 'bg-primary text-white' : 'hover:bg-surface-container-low text-on-surface'}`}
                     >
                       {option}
                     </button>
                   ))}
                 </div>
               )}
             </div>
          </div>

          {booths.length > 0 ? booths.map((booth) => (
            <div 
              key={booth.name} 
              className={`bg-white p-6 rounded-2xl shadow-sm border-l-4 ${booth.border} transition-all hover:shadow-md cursor-pointer ${booth.active ? 'ring-2 ring-primary/20 border-primary' : 'border-surface-container-highest'} ${booth.closed ? 'opacity-80' : ''}`}
              onClick={() => {
                if (mapInstance.current) {
                  mapInstance.current.setView(booth.coords, 16);
                }
              }}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-on-surface text-lg">{booth.name}</h3>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  booth.status === 'OPEN' ? 'bg-tertiary-fixed text-on-tertiary-fixed' : 'bg-surface-container-highest text-on-surface-variant'
                }`}>
                  {booth.status}
                </span>
              </div>
              <p className="text-xs text-outline mb-4 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">location_on</span>
                {booth.address}
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2 text-[10px] font-bold text-secondary">
                  <span className="material-symbols-outlined text-primary text-lg">schedule</span>
                  {booth.time}
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-secondary">
                  <span className="material-symbols-outlined text-primary text-lg">accessible</span>
                  {booth.access}
                </div>
              </div>

              <div className="bg-surface-container-low p-3 rounded-xl flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-lg">person</span>
                </div>
                <div>
                  <p className="text-[9px] text-outline font-black uppercase tracking-widest">Booth Level Officer</p>
                  <p className="text-xs font-bold text-on-surface">{booth.bloName} • {booth.bloContact}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); window.handleNavigate(booth.coords[0], booth.coords[1]); }}
                  className={`flex-1 h-10 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95 ${
                    booth.closed ? 'bg-surface-container text-outline cursor-not-allowed' : 'bg-primary text-on-primary hover:opacity-90 shadow-lg shadow-primary/20'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">near_me</span>
                  Navigate
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleAskAI(booth); }}
                  className="h-10 px-4 bg-primary/10 text-primary rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all active:scale-95 group"
                  title="Ask Assistant about this booth"
                >
                  <span className="material-symbols-outlined text-lg group-hover:animate-bounce">smart_toy</span>
                </button>
              </div>
            </div>
          )) : (
            <div className="p-8 text-center text-outline">
              <span className="material-symbols-outlined text-4xl mb-2 opacity-20">search_off</span>
              <p className="text-sm font-medium">No results for "{searchQuery}" in Bhopal</p>
              <p className="text-[10px] mt-2 text-outline uppercase tracking-wider">Try searching for areas like Arera Colony or MP Nagar</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 relative bg-surface-container overflow-hidden">
        <div ref={mapRef} className="absolute inset-0 z-0"></div>

        <div className="absolute bottom-8 right-8 flex flex-col gap-2 z-30">
          <button 
            onClick={zoomIn}
            className="w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center text-on-surface hover:bg-surface-container-low transition-all active:scale-90 border border-surface-container-highest"
          >
            <span className="material-symbols-outlined">add</span>
          </button>
          <button 
            onClick={zoomOut}
            className="w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center text-on-surface hover:bg-surface-container-low transition-all active:scale-90 border border-surface-container-highest"
          >
            <span className="material-symbols-outlined">remove</span>
          </button>
          <button 
            onClick={locateMe}
            className="w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center text-primary mt-4 hover:bg-surface-container-low transition-all active:scale-90 border border-surface-container-highest"
          >
            <span className="material-symbols-outlined">my_location</span>
          </button>
        </div>

        <div className="absolute top-8 right-8 flex items-center bg-white rounded-full shadow-xl px-4 py-2 gap-4 border border-surface-container-highest z-30">
          <button 
            onClick={() => setActiveLayer('Voyager')}
            className={`flex items-center gap-2 text-xs font-bold transition-colors ${activeLayer === 'Voyager' ? 'text-primary' : 'text-outline hover:text-primary'}`}
          >
            <span className="material-symbols-outlined text-lg">layers</span>
            Voyager
          </button>
          <div className="h-4 w-px bg-surface-container-highest"></div>
          <button 
            onClick={() => setActiveLayer('Terrain')}
            className={`flex items-center gap-2 text-xs font-bold transition-colors ${activeLayer === 'Terrain' ? 'text-primary' : 'text-outline hover:text-primary'}`}
          >
            <span className="material-symbols-outlined text-lg">landscape</span>
            Terrain
          </button>
          <div className="h-4 w-px bg-surface-container-highest"></div>
          <button 
            onClick={() => setActiveLayer('Traffic')}
            className={`flex items-center gap-2 text-xs font-bold transition-colors ${activeLayer === 'Traffic' ? 'text-primary' : 'text-outline hover:text-primary'}`}
          >
            <span className="material-symbols-outlined text-lg">traffic</span>
            Traffic
          </button>
        </div>

        <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-primary/20 z-30 max-w-xs animate-fade-in">
           <div className="flex items-center gap-2 mb-2">
             <span className="material-symbols-outlined text-primary text-lg">smart_toy</span>
             <span className="text-[10px] font-bold text-primary uppercase tracking-widest">AI Mapping Insight</span>
           </div>
           <p className="text-[11px] leading-relaxed text-on-surface-variant font-medium">
             Based on live traffic data in Bhopal, <b>Arera Colony</b> is currently seeing moderate turnout. <b>MP Nagar</b> is recommended for a faster voting experience.
           </p>
        </div>
      </div>
    </div>

  )
}

export default PollingBooths
