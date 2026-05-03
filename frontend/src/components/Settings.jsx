import React, { useState } from 'react'

const Settings = ({ userProfile, setUserProfile }) => {
  const [editedProfile, setEditedProfile] = useState(userProfile)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  const sections = [
    {
      title: 'Profile Settings',
      items: [
        { label: 'Full Name', key: 'name', value: editedProfile.name, icon: 'person' },
        { label: 'Email Address', key: 'email', value: editedProfile.email, icon: 'mail' },
        { label: 'Voter ID', key: 'voterId', value: editedProfile.voterId, icon: 'badge' },
        { label: 'Residential District', key: 'district', value: editedProfile.district, icon: 'location_on' },
      ]
    },
    {
      title: 'Preferences',
      items: [
        { label: 'Language', key: 'language', value: editedProfile.language, icon: 'language' },
        { label: 'Theme', key: 'theme', value: editedProfile.theme, icon: 'light_mode' },
        { label: 'Notifications', key: 'notifications', value: editedProfile.notifications, icon: 'notifications' },
      ]
    }
  ]

  const handleChange = (key, value) => {
    setEditedProfile(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      setUserProfile(editedProfile)
      setIsSaving(false)
      setSaveMessage('Changes saved successfully!')
      setTimeout(() => setSaveMessage(''), 3000)
    }, 800)
  }

  const handleReset = () => {
    setEditedProfile(userProfile)
  }

  return (
    <div className="animate-fade-in max-w-4xl mx-auto pb-12">
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-on-surface tracking-tight">Settings</h1>
          <p className="text-outline mt-1 font-medium">Manage your profile and application preferences.</p>
        </div>
        {saveMessage && (
          <div className="bg-success-container text-on-success-container px-4 py-2 rounded-lg font-bold text-sm animate-bounce">
            {saveMessage}
          </div>
        )}
      </div>

      <div className="space-y-8">
        {sections.map((section) => (
          <div key={section.title} className="card p-0 overflow-hidden shadow-sm">
            <div className="px-8 py-4 bg-surface-container-low border-b border-surface-container-highest">
              <h3 className="font-bold text-primary text-sm uppercase tracking-widest">{section.title}</h3>
            </div>
            <div className="divide-y divide-surface-container-high">
              {section.items.map((item) => (
                <div key={item.label} className="px-8 py-6 flex items-center justify-between hover:bg-surface-container-low/50 transition-colors group">
                  <div className="flex items-center gap-6 flex-1">
                    <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <span className="material-symbols-outlined">{item.icon}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-bold text-outline uppercase tracking-wider">{item.label}</p>
                      <input 
                        type="text" 
                        value={item.value} 
                        onChange={(e) => handleChange(item.key, e.target.value)}
                        className="w-full bg-transparent border-none p-0 text-sm font-bold text-on-surface mt-0.5 focus:ring-0 focus:outline-none"
                      />
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors cursor-pointer">edit</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex gap-4">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={`flex-1 bg-primary text-on-primary py-4 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 ${isSaving ? 'opacity-70' : ''}`}
          >
            {isSaving ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Saving...
              </>
            ) : (
              'Save All Changes'
            )}
          </button>
          <button 
            onClick={handleReset}
            className="flex-1 bg-white text-on-surface border-2 border-surface-container-highest py-4 rounded-xl font-bold hover:bg-surface-container-low transition-all active:scale-[0.98]"
          >
            Discard Changes
          </button>
        </div>

        <div className="pt-8 border-t border-surface-container-highest">
          <div className="bg-error/5 p-6 rounded-2xl border border-error/10 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-error">Danger Zone</h4>
              <p className="text-xs text-outline mt-1">Permanently delete your account and all associated civic data.</p>
            </div>
            <button className="bg-error text-white px-6 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-all active:scale-95 shadow-sm">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings

