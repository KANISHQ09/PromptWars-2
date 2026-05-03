import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import Assistant from './components/Assistant'
import Timeline from './components/Timeline'
import ElectionProcess from './components/ElectionProcess'
import PollingBooths from './components/PollingBooths'
import Settings from './components/Settings'
import Candidates from './components/Candidates'
import ReportViolation from './components/ReportViolation'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [sharedContext, setSharedContext] = useState(null)
  const [globalSearchQuery, setGlobalSearchQuery] = useState('')
  const [userProfile, setUserProfile] = useState({
    name: 'Kanishq',
    email: 'kanishq@example.com',
    voterId: '8821-X-2024',
    district: 'Arera Colony, Bhopal',
    language: 'English (US)',
    theme: 'Light Mode',
    notifications: 'Enabled'
  });

  const [reports, setReports] = useState([
    { id: '#BH-7721-V', category: 'Illegal Posters', status: 'In Progress', time: '2 hours ago', location: 'MP Nagar' },
    { id: '#BH-6612-V', category: 'Noise Violation', status: 'Resolved', time: 'Yesterday', location: 'Arera Colony' }
  ]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard 
          onNavigate={setCurrentPage} 
          userProfile={userProfile} 
          setGlobalSearch={setGlobalSearchQuery} 
        />
      case 'assistant':
        return <Assistant context={sharedContext} setContext={setSharedContext} />
      case 'timeline':
        return <Timeline />
      case 'process':
        return <ElectionProcess />
      case 'polling':
        return <PollingBooths 
          onNavigate={setCurrentPage} 
          setContext={setSharedContext} 
          initialSearch={globalSearchQuery}
          onSearchClear={() => setGlobalSearchQuery('')}
          userProfile={userProfile}
        />
      case 'candidates':
        return <Candidates />
      case 'report':
        return <ReportViolation reports={reports} setReports={setReports} />
      case 'settings':
        return <Settings userProfile={userProfile} setUserProfile={setUserProfile} />
      default:
        return <Dashboard userProfile={userProfile} />
    }
  }

  return (
    <div className="flex min-h-screen bg-background relative overflow-x-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[150] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      <Sidebar 
        activePage={currentPage} 
        onNavigate={(page) => {
          setCurrentPage(page);
          setIsSidebarOpen(false);
        }} 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0 transition-all duration-300">
        <Header 
          userProfile={userProfile} 
          onNavigate={(page) => {
            setCurrentPage(page);
            setIsSidebarOpen(false);
          }} 
          setGlobalSearch={setGlobalSearchQuery} 
          onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <main id="main-content" className="p-4 md:p-8 pt-20 md:pt-28 max-w-full overflow-x-hidden focus:outline-none" tabIndex="-1" aria-live="polite">
          {renderPage()}
        </main>
      </div>
    </div>
  )
}

export default App
