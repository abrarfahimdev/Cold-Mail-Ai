import { useState } from 'react'
import { Link } from 'react-router-dom'

// ── SAMPLE HISTORY DATA ────────────────────
const historyData = [
  {
    id: 1,
    subject: 'Website Redesign Proposal for TechCorp',
    to: 'john@techcorp.ng',
    prospect: 'John Smith',
    company: 'TechCorp Nigeria',
    created: '2 hours ago',
    tone: 'professional',
    goal: 'book_meeting',
    status: 'replied',
    email: `Hi John,

I hope this email finds you well. I noticed that TechCorp Nigeria has been growing rapidly and I believe your current website might not be reflecting the quality of your services.

I'm Fahim Abrar, a React Developer who has built several high-converting websites for businesses like yours. I recently built AgentHub, an AI marketplace that handles 1000+ users daily.

I'd love to show you how I can modernize your website and potentially increase your conversions by 40%.

Would you be open to a 15-minute call this week?

Best regards,
Fahim Abrar`,
    followup1: `Hi John,

Just following up on my previous email about modernizing TechCorp's website.

I wanted to share that I just completed a similar project for a Nigerian tech company and they saw a 35% increase in leads within the first month.

Would love to show you the results. Are you available for a quick call this week?

Best,
Fahim Abrar`,
    followup2: `Hey John,

Last follow up from my side — I know you're busy!

I've put together a free mockup of what TechCorp's new website could look like. No obligation, just want to show you the potential.

Interested in seeing it?

Fahim Abrar`,
  },
  {
    id: 2,
    subject: 'AI Chatbot Solution for BrazilTech',
    to: 'maria@braziltech.com',
    prospect: 'Maria Santos',
    company: 'BrazilTech Solutions',
    created: '1 day ago',
    tone: 'friendly',
    goal: 'get_reply',
    status: 'opened',
    email: `Hi Maria,

I came across BrazilTech Solutions and was impressed by your customer service focus. I noticed you might benefit from an AI chatbot solution.

I recently built AI-powered tools including an AI chatbot that handles 500+ queries daily with 95% satisfaction rate.

I can build you a custom chatbot that supports Portuguese and English, integrates with your website, and reduces support costs by 70%.

Interested in seeing a demo?

Cheers,
Fahim Abrar`,
    followup1: `Hi Maria,

Just checking in on my previous email about the AI chatbot for BrazilTech.

Quick question — are you currently using any automation for customer support? I'd love to understand your current setup before suggesting a solution.

Looking forward to hearing from you!

Fahim`,
    followup2: '',
  },
  {
    id: 3,
    subject: 'React Development for StartupKenya MVP',
    to: 'sarah@startupkenya.com',
    prospect: 'Sarah Okonkwo',
    company: 'StartupKenya',
    created: '2 days ago',
    tone: 'confident',
    goal: 'close_sale',
    status: 'replied',
    email: `Hi Sarah,

Your startup idea is exciting and I'd love to help you build it right.

I'm a React Developer who has built 5+ production apps in the last 30 days including AgentHub and SnapCV. I work fast, communicate clearly and deliver on time.

For your MVP I can build:
- Core features in 2 weeks
- Mobile responsive design
- Admin dashboard
- User authentication

Budget: $500-800 as discussed.

Ready to start Monday. Are you in?

Fahim Abrar`,
    followup1: '',
    followup2: '',
  },
  {
    id: 4,
    subject: 'Digital Menu System for Restaurant Chain',
    to: 'ahmed@digitalghana.com',
    prospect: 'Ahmed Hassan',
    company: 'Digital Ghana Restaurant Group',
    created: '3 days ago',
    tone: 'professional',
    goal: 'book_meeting',
    status: 'sent',
    email: `Hi Ahmed,

I came across your restaurant chain and noticed a great opportunity to streamline your ordering process with a digital menu system.

I can build a complete solution including:
- Digital menu for all 5 locations
- QR code ordering system
- Admin dashboard to update menu in real-time
- Analytics on popular items

Similar systems I've built have increased order efficiency by 60% and reduced errors by 80%.

Would you be open to a quick demo call this week?

Best regards,
Fahim Abrar`,
    followup1: `Hi Ahmed,

Following up on my email about the digital menu system for your restaurant chain.

I've actually put together a quick prototype of what the system would look like for Digital Ghana. Would love to show you — takes only 10 minutes.

Are you free for a call Thursday or Friday?

Fahim`,
    followup2: '',
  },
]

const statusColors = {
  replied: 'bg-green-100 text-green-600',
  opened: 'bg-blue-100 text-blue-600',
  sent: 'bg-gray-100 text-gray-500',
  bounced: 'bg-red-100 text-red-500',
}

const toneColors = {
  professional: 'bg-indigo-100 text-indigo-600',
  friendly: 'bg-green-100 text-green-600',
  confident: 'bg-purple-100 text-purple-600',
  casual: 'bg-yellow-100 text-yellow-600',
  formal: 'bg-gray-100 text-gray-600',
}

const History = () => {
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [copied, setCopied] = useState('')
  const [showTab, setShowTab] = useState('email')

  // Filter emails
  const filtered = historyData.filter(e => {
    const matchSearch =
      e.subject.toLowerCase().includes(search.toLowerCase()) ||
      e.prospect.toLowerCase().includes(search.toLowerCase()) ||
      e.company.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || e.status === filter
    return matchSearch && matchFilter
  })

  const handleCopy = (text, key) => {
    if (!text) return
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(''), 2000)
  }

  const getTabContent = () => {
    if (!selected) return ''
    if (showTab === 'email') return selected.email
    if (showTab === 'followup1') return selected.followup1 || 'No follow up 1 generated for this email.'
    if (showTab === 'followup2') return selected.followup2 || 'No follow up 2 generated for this email.'
    return ''
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── HEADER ──────────────────────────── */}
      <div className="bg-white border-b border-gray-100 px-4 md:px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-sm">✉</div>
            <span className="font-black text-gray-900">ColdMail<span className="text-indigo-600">AI</span></span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/inbox" className="text-gray-500 hover:text-indigo-600 font-semibold px-3 py-2 rounded-xl hover:bg-indigo-50 transition-all text-sm hidden md:block">
              📧 Inbox
            </Link>
            <Link to="/analytics" className="text-gray-500 hover:text-indigo-600 font-semibold px-3 py-2 rounded-xl hover:bg-indigo-50 transition-all text-sm hidden md:block">
              📊 Analytics
            </Link>
            <Link to="/generator" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all">
              ✉ Generator
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">

        {/* ── PAGE HEADER ─────────────────────── */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900">Email History 📁</h1>
          <p className="text-gray-400 mt-1">All your AI generated cold emails in one place</p>
        </div>

        {/* ── STATS ───────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Emails', value: historyData.length, icon: '📧', color: 'bg-indigo-50 text-indigo-600' },
            { label: 'Replied', value: historyData.filter(e => e.status === 'replied').length, icon: '✅', color: 'bg-green-50 text-green-600' },
            { label: 'Opened', value: historyData.filter(e => e.status === 'opened').length, icon: '👁️', color: 'bg-blue-50 text-blue-600' },
            {
              label: 'Reply Rate',
              value: `${Math.round((historyData.filter(e => e.status === 'replied').length / historyData.length) * 100)}%`,
              icon: '📈',
              color: 'bg-purple-50 text-purple-600'
            },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-3 hover:border-indigo-200 transition-all">
              <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center text-xl flex-shrink-0`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-xl font-black text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-400">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* ── EMAIL LIST ──────────────────────── */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">

              {/* Search + Filter */}
              <div className="p-4 border-b border-gray-100">
                <input
                  type="text"
                  placeholder="🔍 Search emails..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-200 focus:border-indigo-500 rounded-xl px-3 py-2 text-sm outline-none transition-all text-gray-900 placeholder-gray-400 mb-3"
                />
                <div className="flex gap-1">
                  {['all', 'replied', 'opened', 'sent'].map(f => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all capitalize ${
                        filter === f
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* List */}
              <div className="overflow-y-auto max-h-96">
                {filtered.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-4xl mb-2">📭</p>
                    <p className="text-gray-400 text-sm">No emails found</p>
                  </div>
                ) : (
                  filtered.map(email => (
                    <div
                      key={email.id}
                      onClick={() => { setSelected(email); setShowTab('email') }}
                      className={`p-4 border-b border-gray-50 cursor-pointer transition-all ${
                        selected?.id === email.id
                          ? 'bg-indigo-50 border-l-4 border-l-indigo-500'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <p className="text-sm font-bold text-gray-900 truncate flex-1">{email.prospect}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ml-2 flex-shrink-0 ${statusColors[email.status]}`}>
                          {email.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate mb-1">{email.subject}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${toneColors[email.tone]}`}>
                          {email.tone}
                        </span>
                        <p className="text-xs text-gray-400">{email.created}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Generate New */}
              <div className="p-4 border-t border-gray-100">
                <Link
                  to="/generator"
                  className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-sm transition-all text-center"
                >
                  ✨ Generate New Email
                </Link>
              </div>
            </div>
          </div>

          {/* ── EMAIL DETAIL ────────────────────── */}
          <div className="md:col-span-2">
            {!selected ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center h-full flex items-center justify-center min-h-64">
                <div>
                  <p className="text-5xl mb-4">📁</p>
                  <h3 className="font-black text-gray-900 text-lg mb-2">Select an email</h3>
                  <p className="text-gray-400 text-sm">Click any email to view details</p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">

                {/* Email Meta */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 mr-4">
                      <h3 className="font-black text-gray-900 text-base mb-1">{selected.subject}</h3>
                      <p className="text-sm text-gray-500">
                        To: <span className="font-semibold">{selected.prospect}</span> at {selected.company}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{selected.to} • {selected.created}</p>
                    </div>
                    <span className={`text-xs px-3 py-1.5 rounded-full font-bold flex-shrink-0 ${statusColors[selected.status]}`}>
                      {selected.status}
                    </span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <span className={`text-xs px-2 py-1 rounded-lg font-semibold ${toneColors[selected.tone]}`}>
                      {selected.tone}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-lg font-semibold bg-gray-100 text-gray-600 capitalize">
                      {selected.goal.replace(/_/g, ' ')}
                    </span>
                  </div>
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

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleCopy(getTabContent(), showTab)}
                      className="flex-1 border-2 border-gray-200 hover:border-indigo-300 hover:text-indigo-600 text-gray-600 font-bold py-3 rounded-xl text-sm transition-all"
                    >
                      {copied === showTab ? '✅ Copied!' : '📋 Copy'}
                    </button>
                    <a
                      href={`mailto:${selected.to}?subject=${encodeURIComponent(selected.subject)}&body=${encodeURIComponent(getTabContent())}`}
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
      </div>
    </div>
  )
}

export default History