import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

const Dashboard = () => {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [emails, setEmails] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [copied, setCopied] = useState('')
  const [showTab, setShowTab] = useState('email')

  useEffect(() => {
    if (user) fetchEmails()
  }, [user])

  const fetchEmails = async () => {
    const { data } = await supabase
      .from('generated_emails')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setEmails(data || [])
    setLoading(false)
  }

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  const handleCopy = (text, key) => {
    if (!text) return
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(''), 2000)
  }

  const getTabContent = () => {
    if (!selected) return ''
    if (showTab === 'email') return selected.email
    if (showTab === 'followup1') return selected.followup1 || 'No follow up 1 generated.'
    if (showTab === 'followup2') return selected.followup2 || 'No follow up 2 generated.'
    return ''
  }

  const statusColors = {
    replied: 'bg-green-100 text-green-600',
    opened: 'bg-blue-100 text-blue-600',
    sent: 'bg-gray-100 text-gray-500',
  }

  const navItems = [
    { id: 'overview', icon: '📊', label: 'Overview' },
    { id: 'emails', icon: '✉️', label: 'My Emails', count: emails.length },
    { id: 'profile', icon: '👤', label: 'Profile' },
  ]

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* ── SIDEBAR ─────────────────────────── */}
      <aside className="w-64 bg-white border-r border-gray-100 fixed top-0 left-0 h-screen flex flex-col z-50">

        {/* Logo */}
        {/* <div className="p-6 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black">✉</div>
            <span className="text-xl font-black text-gray-900">ColdMail<span className="text-indigo-600">AI</span></span>
          </Link>
        </div> */}

        {/* User Info */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-base flex-shrink-0">
              {profile?.full_name?.charAt(0).toUpperCase() || '?'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-gray-900 truncate">{profile?.full_name || 'User'}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 flex flex-col gap-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all w-full text-left ${
                activeTab === item.id
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span>{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.count > 0 && (
                <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 flex flex-col gap-1">
          <Link to="/generator" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all">
            <span>✉</span> Generator
          </Link>
          <Link to="/inbox" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all">
            <span>📧</span> Inbox
          </Link>
          <Link to="/analytics" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all">
            <span>📊</span> Analytics
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all w-full text-left"
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ────────────────────── */}
      <main className="ml-64 flex-1 p-8">

        {/* ── OVERVIEW ──────────────────────── */}
        {activeTab === 'overview' && (
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-black text-gray-900">
                Welcome back, {profile?.full_name?.split(' ')[0] || 'there'}! 👋
              </h1>
              <p className="text-gray-400 mt-1">Here's your email dashboard</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { icon: '✉️', label: 'Emails Generated', value: emails.length, color: 'bg-indigo-50 text-indigo-600' },
                { icon: '✅', label: 'Replied', value: emails.filter(e => e.status === 'replied').length, color: 'bg-green-50 text-green-600' },
                { icon: '👁️', label: 'Opened', value: emails.filter(e => e.status === 'opened').length, color: 'bg-blue-50 text-blue-600' },
                { icon: '⭐', label: 'Plan', value: profile?.plan || 'Free', color: 'bg-yellow-50 text-yellow-600' },
              ].map((stat, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 flex items-center gap-4">
                  <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-2xl`}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-400">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { icon: '✨', title: 'Generate Cold Email', desc: 'Write AI powered cold email', action: () => navigate('/generator') },
                { icon: '📧', title: 'Smart Inbox', desc: 'Read and reply to emails', action: () => navigate('/inbox') },
                { icon: '📊', title: 'View Analytics', desc: 'Track your email performance', action: () => navigate('/analytics') },
              ].map((action, i) => (
                <button
                  key={i}
                  onClick={action.action}
                  className="bg-white border-2 border-gray-100 hover:border-indigo-300 rounded-2xl p-6 text-left transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <span className="text-3xl block mb-3">{action.icon}</span>
                  <h3 className="font-bold text-gray-900 mb-1 text-sm">{action.title}</h3>
                  <p className="text-xs text-gray-400">{action.desc}</p>
                </button>
              ))}
            </div>

            {/* Recent Emails */}
            {emails.length > 0 && (
              <>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Emails</h2>
                <div className="flex flex-col gap-3">
                  {emails.slice(0, 5).map(email => (
                    <div
                      key={email.id}
                      onClick={() => { setSelected(email); setActiveTab('emails') }}
                      className="bg-white border border-gray-100 hover:border-indigo-200 rounded-2xl p-4 flex items-center gap-4 cursor-pointer transition-all hover:shadow-md"
                    >
                      <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0">✉️</div>
                      <div className="flex-1 overflow-hidden">
                        <h4 className="font-bold text-gray-900 text-sm truncate">{email.subject}</h4>
                        <p className="text-xs text-gray-400 truncate">To: {email.prospect_name} at {email.prospect_company}</p>
                      </div>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full flex-shrink-0 ${statusColors[email.status] || 'bg-gray-100 text-gray-500'}`}>
                        {email.status}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {emails.length === 0 && !loading && (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <span className="text-5xl block mb-4">✉️</span>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No emails yet!</h3>
                <p className="text-gray-400 mb-6">Generate your first AI cold email now.</p>
                <Link to="/generator" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3.5 rounded-xl text-sm transition-all inline-block">
                  Generate Email →
                </Link>
              </div>
            )}
          </div>
        )}

        {/* ── MY EMAILS TAB ─────────────────── */}
        {activeTab === 'emails' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-black text-gray-900">My Emails ✉️</h1>
                <p className="text-gray-400 mt-1">All your AI generated cold emails</p>
              </div>
              <Link
                to="/generator"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all"
              >
                + Generate New
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-16">
                <div className="text-4xl mb-4 animate-spin">⏳</div>
                <p className="text-gray-400">Loading emails...</p>
              </div>
            ) : emails.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <span className="text-5xl block mb-4">✉️</span>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No emails yet!</h3>
                <p className="text-gray-400 mb-6">Generate your first AI cold email.</p>
                <Link to="/generator" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3.5 rounded-xl text-sm transition-all inline-block">
                  Generate Email →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Email List */}
                <div className="md:col-span-1">
                  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100">
                      <p className="text-sm font-bold text-gray-900">{emails.length} emails generated</p>
                    </div>
                    <div className="overflow-y-auto max-h-96">
                      {emails.map(email => (
                        <div
                          key={email.id}
                          onClick={() => { setSelected(email); setShowTab('email') }}
                          className={`p-4 border-b border-gray-50 cursor-pointer transition-all ${
                            selected?.id === email.id
                              ? 'bg-indigo-50 border-l-4 border-l-indigo-500'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <p className="text-sm font-bold text-gray-900 truncate mb-1">{email.prospect_name}</p>
                          <p className="text-xs text-gray-500 truncate mb-1">{email.subject}</p>
                          <div className="flex items-center justify-between">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${statusColors[email.status] || 'bg-gray-100 text-gray-500'}`}>
                              {email.status}
                            </span>
                            <p className="text-xs text-gray-400">
                              {new Date(email.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Email Detail */}
                <div className="md:col-span-2">
                  {!selected ? (
                    <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center h-full flex items-center justify-center">
                      <div>
                        <p className="text-5xl mb-4">✉️</p>
                        <h3 className="font-black text-gray-900 mb-2">Select an email</h3>
                        <p className="text-gray-400 text-sm">Click any email to view</p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">

                      {/* Meta */}
                      <div className="p-6 border-b border-gray-100">
                        <h3 className="font-black text-gray-900 mb-1">{selected.subject}</h3>
                        <p className="text-sm text-gray-500">To: {selected.prospect_name} at {selected.prospect_company}</p>
                        <p className="text-xs text-gray-400 mt-1">{new Date(selected.created_at).toLocaleDateString()}</p>
                      </div>

                      {/* Tabs */}
                      <div className="flex border-b border-gray-100">
                        {[
                          { id: 'email', label: '📧 Email' },
                          { id: 'followup1', label: '🔄 Follow Up 1' },
                          { id: 'followup2', label: '🔄 Follow Up 2' },
                        ].map(tab => (
                          <button
                            key={tab.id}
                            onClick={() => setShowTab(tab.id)}
                            className={`flex-1 py-3 text-xs font-bold transition-all ${
                              showTab === tab.id
                                ? 'border-b-2 border-indigo-600 text-indigo-600'
                                : 'text-gray-400 hover:text-gray-600'
                            }`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="bg-gray-50 rounded-xl p-4 mb-4 min-h-48">
                          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                            {getTabContent()}
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleCopy(getTabContent(), showTab)}
                            className="flex-1 border-2 border-gray-200 hover:border-indigo-300 hover:text-indigo-600 text-gray-600 font-bold py-3 rounded-xl text-sm transition-all"
                          >
                            {copied === showTab ? '✅ Copied!' : '📋 Copy'}
                          </button>
                          
                         <a   href={`mailto:?subject=${encodeURIComponent(selected.subject)}&body=${encodeURIComponent(getTabContent())}`}
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-sm transition-all text-center"
                          >
                            📨 Open in Email
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── PROFILE TAB ───────────────────── */}
        {activeTab === 'profile' && (
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-black text-gray-900">My Profile 👤</h1>
              <p className="text-gray-400 mt-1">Your account information</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-3xl p-8 max-w-2xl">
              <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100">
                <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-3xl">
                  {profile?.full_name?.charAt(0).toUpperCase() || '?'}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900">{profile?.full_name}</h2>
                  <p className="text-gray-400">{user?.email}</p>
                  <span className="inline-block mt-2 bg-indigo-50 text-indigo-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    {profile?.plan || 'Free'} Plan
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { label: 'Full Name', value: profile?.full_name || 'Not set' },
                  { label: 'Email', value: user?.email },
                  { label: 'Plan', value: profile?.plan || 'Free' },
                  { label: 'Member Since', value: new Date(user?.created_at).toLocaleDateString() },
                  { label: 'Emails Generated', value: emails.length },
                ].map((field, i) => (
                  <div key={i}>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{field.label}</p>
                    <p className="text-sm font-semibold text-gray-900">{field.value}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={handleLogout}
                className="mt-8 border-2 border-gray-200 hover:border-red-300 hover:text-red-500 text-gray-600 font-semibold px-6 py-3 rounded-xl text-sm transition-all"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}

export default Dashboard