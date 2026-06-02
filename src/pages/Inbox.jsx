import { useState } from 'react'
import { Link } from 'react-router-dom'
import { groqAI } from '../lib/groq'

// ── SAMPLE EMAILS ──────────────────────────
const sampleEmails = [
  {
    id: 1,
    from: 'John Smith',
    email: 'john@techcorp.ng',
    subject: 'Re: Website Redesign Proposal',
    preview: 'Thanks for sending over the proposal. I reviewed it with my team...',
    body: `Hi,

Thanks for sending over the proposal. I reviewed it with my team and we have a few questions.

1. Can you complete the project in 2 weeks instead of 4?
2. Is there any flexibility on the pricing?
3. Do you have experience with e-commerce websites?

We're interested in moving forward but need these answers first.

Best regards,
John Smith
CEO, TechCorp Nigeria`,
    time: '10:30 AM',
    date: 'Today',
    read: false,
    label: 'important',
    category: 'client',
  },
  {
    id: 2,
    from: 'Sarah Okonkwo',
    email: 'sarah@startupkenya.com',
    subject: 'Interested in your React development services',
    preview: 'Hello! I came across your portfolio and I\'m very impressed...',
    body: `Hello!

I came across your portfolio and I'm very impressed with your work on AgentHub.

We're a startup based in Nairobi and we're looking for a React developer to build our MVP. Budget is around $500-800.

Are you available to take on new projects? We'd love to have a quick call this week.

Looking forward to hearing from you!

Sarah Okonkwo
Co-founder, StartupKenya`,
    time: '9:15 AM',
    date: 'Today',
    read: false,
    label: 'opportunity',
    category: 'lead',
  },
  {
    id: 3,
    from: 'Ahmed Hassan',
    email: 'ahmed@digitalghana.com',
    subject: 'Follow up on our conversation',
    preview: 'Hi Fahim, Just following up on our conversation last week...',
    body: `Hi Fahim,

Just following up on our conversation last week about building a digital menu system for our restaurant chain.

We have 5 locations across Accra and we need:
- Digital menu for each location
- QR code ordering system
- Admin dashboard to update menu

What would be your timeline and cost for this?

Ahmed Hassan
Digital Ghana Restaurant Group`,
    time: '8:00 AM',
    date: 'Today',
    read: true,
    label: 'important',
    category: 'lead',
  },
  {
    id: 4,
    from: 'Maria Santos',
    email: 'maria@braziltech.com',
    subject: 'AI chatbot development inquiry',
    preview: 'Good day! We need an AI chatbot for our customer service...',
    body: `Good day!

We need an AI chatbot for our customer service department. We handle about 500 customer queries per day and want to automate at least 70%.

Requirements:
- Train on our FAQ database
- Integrate with our website
- Support Portuguese and English
- Analytics dashboard

What's your experience with AI chatbots? Please send your portfolio and pricing.

Maria Santos
CTO, BrazilTech Solutions`,
    time: 'Yesterday',
    date: 'Yesterday',
    read: true,
    label: 'opportunity',
    category: 'lead',
  },
  {
    id: 5,
    from: 'PixaCloud Labs',
    email: 'careers@pixacloudlabs.com',
    subject: 'RE: Frontend Developer Application',
    preview: 'Thank you for applying to PixaCloud Labs...',
    body: `Dear Fahim,

Thank you for applying to the Frontend Developer position at PixaCloud Labs.

We have reviewed your application and portfolio. We are impressed with your projects, particularly AgentHub and SnapCV.

We would like to invite you for a technical interview next week. Please let us know your availability for a 1-hour video call.

Best regards,
HR Team
PixaCloud Labs`,
    time: '2 days ago',
    date: '2 days ago',
    read: false,
    label: 'important',
    category: 'job',
  },
]

const labelColors = {
  important: 'bg-red-100 text-red-600',
  opportunity: 'bg-green-100 text-green-600',
  job: 'bg-blue-100 text-blue-600',
  other: 'bg-gray-100 text-gray-600',
}

const Inbox = () => {
  const [emails, setEmails] = useState(sampleEmails)
  const [selected, setSelected] = useState(null)
  const [generating, setGenerating] = useState(false)
  const [reply, setReply] = useState('')
  const [replyGenerated, setReplyGenerated] = useState(false)
  const [activeFilter, setActiveFilter] = useState('all')
  const [pastedEmail, setPastedEmail] = useState('')
  const [showPaste, setShowPaste] = useState(false)
  const [scoring, setScoring] = useState(false)
  const [score, setScore] = useState(null)
  const [copied, setCopied] = useState(false)

  // Filter emails
  const filtered = emails.filter(e => {
    if (activeFilter === 'unread') return !e.read
    if (activeFilter === 'important') return e.label === 'important'
    if (activeFilter === 'leads') return e.category === 'lead'
    if (activeFilter === 'jobs') return e.category === 'job'
    return true
  })

  // Mark as read
  const markRead = (id) => {
    setEmails(emails.map(e => e.id === id ? { ...e, read: true } : e))
  }

  // Select email
  const selectEmail = (email) => {
    setSelected(email)
    setReply('')
    setReplyGenerated(false)
    setScore(null)
    markRead(email.id)
  }

  // Generate AI reply
  const generateReply = async () => {
    try {
      setGenerating(true)
      const prompt = `Read this email and write a professional reply:

FROM: ${selected.from} (${selected.email})
SUBJECT: ${selected.subject}
EMAIL:
${selected.body}

Write a professional, helpful and concise reply.
- Address all questions or points raised
- Be friendly but professional
- Keep it concise (3-4 paragraphs max)
- End with a clear next step
- Sign as Fahim Abrar, React Developer`

      const response = await groqAI(prompt, 'You are an expert email writer. Write professional email replies that build relationships and close deals.')
      setReply(response)
      setReplyGenerated(true)
    } catch (err) {
      console.error(err)
    } finally {
      setGenerating(false)
    }
  }

  // Score email
  const scoreEmail = async () => {
    try {
      setScoring(true)
      const prompt = `Analyze this email and give it a score:

FROM: ${selected.from}
SUBJECT: ${selected.subject}
EMAIL: ${selected.body}

Respond in JSON only:
{
  "score": 85,
  "intent": "Client interested in hiring for React project",
  "urgency": "high",
  "sentiment": "positive",
  "action": "Reply within 2 hours with portfolio and pricing",
  "tags": ["client", "react", "paid-work"]
}`

      const response = await groqAI(prompt, 'You are an email analyzer. Always respond with valid JSON only.')
      const cleaned = response.replace(/```json|```/g, '').trim()
      setScore(JSON.parse(cleaned))
    } catch (err) {
      console.error(err)
    } finally {
      setScoring(false)
    }
  }

  // Add pasted email
  const addPastedEmail = async () => {
    if (!pastedEmail.trim()) return
    const newEmail = {
      id: Date.now(),
      from: 'Unknown Sender',
      email: 'unknown@email.com',
      subject: 'Pasted Email',
      preview: pastedEmail.slice(0, 60) + '...',
      body: pastedEmail,
      time: 'Just now',
      date: 'Today',
      read: false,
      label: 'other',
      category: 'other',
    }
    setEmails([newEmail, ...emails])
    setPastedEmail('')
    setShowPaste(false)
    setSelected(newEmail)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* ── HEADER ──────────────────────────── */}
      <div className="bg-white border-b border-gray-100 px-4 md:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-sm">✉</div>
            <span className="font-black text-gray-900">ColdMail<span className="text-indigo-600">AI</span></span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/generator" className="text-gray-500 hover:text-indigo-600 font-semibold px-3 py-2 rounded-xl hover:bg-indigo-50 transition-all text-sm hidden md:block">
              ✉ Generator
            </Link>
            <Link to="/analytics" className="text-gray-500 hover:text-indigo-600 font-semibold px-3 py-2 rounded-xl hover:bg-indigo-50 transition-all text-sm hidden md:block">
              📊 Analytics
            </Link>
            <button
              onClick={() => setShowPaste(!showPaste)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all"
            >
              + Add Email
            </button>
          </div>
        </div>
      </div>

      {/* ── PASTE EMAIL MODAL ───────────────── */}
      {showPaste && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl">
            <h3 className="font-black text-gray-900 text-lg mb-2">Paste Email</h3>
            <p className="text-gray-400 text-sm mb-4">Paste any email content to analyze and reply with AI</p>
            <textarea
              placeholder="Paste email content here..."
              rows={8}
              value={pastedEmail}
              onChange={e => setPastedEmail(e.target.value)}
              className="w-full bg-gray-50 border-2 border-gray-200 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm outline-none transition-all resize-none text-gray-900 placeholder-gray-400 mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowPaste(false)}
                className="flex-1 border-2 border-gray-200 text-gray-600 font-bold py-3 rounded-xl text-sm"
              >
                Cancel
              </button>
              <button
                onClick={addPastedEmail}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-sm"
              >
                Add Email →
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto w-full flex flex-1 gap-0">

        {/* ── SIDEBAR ─────────────────────────── */}
        <div className="w-full md:w-72 bg-white border-r border-gray-100 flex flex-col">

          {/* Filters */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex flex-col gap-1">
              {[
                { id: 'all', label: '📧 All Emails', count: emails.length },
                { id: 'unread', label: '🔵 Unread', count: emails.filter(e => !e.read).length },
                { id: 'important', label: '🔴 Important', count: emails.filter(e => e.label === 'important').length },
                { id: 'leads', label: '💰 Leads', count: emails.filter(e => e.category === 'lead').length },
                { id: 'jobs', label: '💼 Jobs', count: emails.filter(e => e.category === 'job').length },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left ${
                    activeFilter === f.id
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span>{f.label}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    activeFilter === f.id ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {f.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Email List */}
          <div className="flex-1 overflow-y-auto">
            {filtered.map(email => (
              <div
                key={email.id}
                onClick={() => selectEmail(email)}
                className={`p-4 border-b border-gray-50 cursor-pointer transition-all ${
                  selected?.id === email.id
                    ? 'bg-indigo-50 border-l-4 border-l-indigo-500'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <p className={`text-sm ${!email.read ? 'font-black text-gray-900' : 'font-semibold text-gray-600'}`}>
                    {email.from}
                  </p>
                  <p className="text-xs text-gray-400 flex-shrink-0 ml-2">{email.time}</p>
                </div>
                <p className={`text-xs mb-1 ${!email.read ? 'font-bold text-gray-800' : 'text-gray-500'}`}>
                  {email.subject}
                </p>
                <p className="text-xs text-gray-400 truncate">{email.preview}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${labelColors[email.label]}`}>
                    {email.label}
                  </span>
                  {!email.read && (
                    <span className="w-2 h-2 bg-indigo-500 rounded-full" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── EMAIL DETAIL ─────────────────────── */}
        <div className="flex-1 flex flex-col">
          {!selected ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">📧</div>
                <h3 className="font-black text-gray-900 text-xl mb-2">Select an email</h3>
                <p className="text-gray-400 text-sm">Choose an email from the list to read and reply</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-6">

              {/* Email Header */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="font-black text-gray-900 text-xl mb-1">{selected.subject}</h2>
                    <div className="flex items-center gap-3">
                      <p className="text-sm text-gray-500">From: <span className="font-semibold text-gray-700">{selected.from}</span> ({selected.email})</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${labelColors[selected.label]}`}>
                        {selected.label}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">{selected.date}</p>
                </div>

                {/* Email Body */}
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{selected.body}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={generateReply}
                    disabled={generating}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2"
                  >
                    {generating ? <><span className="animate-spin">⏳</span> Generating...</> : '🤖 Generate AI Reply'}
                  </button>
                  <button
                    onClick={scoreEmail}
                    disabled={scoring}
                    className="border-2 border-indigo-200 hover:border-indigo-400 text-indigo-600 font-bold px-5 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2"
                  >
                    {scoring ? <><span className="animate-spin">⏳</span> Scoring...</> : '📊 Analyze Email'}
                  </button>
                  <Link
                    to="/generator"
                    className="border-2 border-gray-200 hover:border-indigo-200 text-gray-600 font-bold px-5 py-2.5 rounded-xl text-sm transition-all"
                  >
                    ✉ Write Cold Email
                  </Link>
                </div>
              </div>

              {/* Email Score */}
              {score && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
                  <h3 className="font-black text-gray-900 mb-4">📊 Email Analysis</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-indigo-50 rounded-xl p-3 text-center">
                      <p className="text-2xl font-black text-indigo-600">{score.score}</p>
                      <p className="text-xs text-gray-400 mt-1">Priority Score</p>
                    </div>
                    <div className="bg-orange-50 rounded-xl p-3 text-center">
                      <p className="text-sm font-black text-orange-600 capitalize">{score.urgency}</p>
                      <p className="text-xs text-gray-400 mt-1">Urgency</p>
                    </div>
                    <div className="bg-green-50 rounded-xl p-3 text-center">
                      <p className="text-sm font-black text-green-600 capitalize">{score.sentiment}</p>
                      <p className="text-xs text-gray-400 mt-1">Sentiment</p>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-3 text-center">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {score.tags?.map((tag, i) => (
                          <span key={i} className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">{tag}</span>
                        ))}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Tags</p>
                    </div>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">Intent</p>
                    <p className="text-sm text-amber-800">{score.intent}</p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 mt-3">
                    <p className="text-xs font-bold text-green-600 uppercase tracking-wider mb-1">Recommended Action</p>
                    <p className="text-sm text-green-800">{score.action}</p>
                  </div>
                </div>
              )}

              {/* AI Reply */}
              {replyGenerated && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-black text-gray-900">🤖 AI Generated Reply</h3>
                    <button
                      onClick={generateReply}
                      disabled={generating}
                      className="text-xs text-indigo-600 font-bold hover:underline"
                    >
                      🔄 Regenerate
                    </button>
                  </div>

                  <textarea
                    value={reply}
                    onChange={e => setReply(e.target.value)}
                    rows={10}
                    className="w-full bg-gray-50 border-2 border-gray-200 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm outline-none transition-all resize-none text-gray-900 mb-4"
                  />

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(reply)
                        setCopied(true)
                        setTimeout(() => setCopied(false), 2000)
                      }}
                      className="flex-1 border-2 border-gray-200 hover:border-indigo-300 text-gray-600 hover:text-indigo-600 font-bold py-3 rounded-xl text-sm transition-all"
                    >
                      {copied ? '✅ Copied!' : '📋 Copy Reply'}
                    </button>
                    
                    <a  href={`mailto:${selected.email}?subject=Re: ${selected.subject}&body=${encodeURIComponent(reply)}`}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-sm transition-all text-center"
                    >
                      📨 Open in Email App
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Inbox