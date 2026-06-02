import { useState } from 'react'
import { Link } from 'react-router-dom'
import { groqAI } from '../lib/groq'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
const Generator = () => {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [copied, setCopied] = useState('')
  const { user } = useAuth();

  const [form, setForm] = useState({
    // Your details
    your_name: '',
    your_role: '',
    your_company: '',
    your_service: '',

    // Prospect details
    prospect_name: '',
    prospect_company: '',
    prospect_role: '',
    prospect_pain: '',

    // Email settings
    tone: 'professional',
    goal: 'book_meeting',
    include_followup: true,
  })

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  // Generate email with AI
  const generateEmail = async () => {
    try {
      setLoading(true)
      setResult(null)

      const prompt = `Write a cold email with the following details:

SENDER:
Name: ${form.your_name}
Role: ${form.your_role}
Company: ${form.your_company}
Service/Product: ${form.your_service}

PROSPECT:
Name: ${form.prospect_name}
Company: ${form.prospect_company}
Role: ${form.prospect_role}
Pain Point: ${form.prospect_pain}

SETTINGS:
Tone: ${form.tone}
Goal: ${form.goal === 'book_meeting' ? 'Book a meeting' : form.goal === 'get_reply' ? 'Get a reply' : 'Close a sale'}
Include follow up: ${form.include_followup ? 'Yes' : 'No'}

Generate in this EXACT JSON format:
{
  "subject": "Email subject line here",
  "email": "Full email body here",
  "followup1": "First follow up email (3 days later)",
  "followup2": "Second follow up email (7 days later)",
  "tips": ["Tip 1", "Tip 2", "Tip 3"]
}`

      const response = await groqAI(
        prompt,
        'You are a world class cold email copywriter. You write emails that get 40%+ reply rates. Always respond with valid JSON only. No markdown.'
      )

      const cleaned = response.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(cleaned)
setResult(parsed)
setStep(3)

// Save to Supabase if logged in
if (user) {
  await supabase.from('generated_emails').insert([{
    user_id: user.id,
    subject: parsed.subject,
    email: parsed.email,
    followup1: parsed.followup1,
    followup2: parsed.followup2,
    prospect_name: form.prospect_name,
    prospect_company: form.prospect_company,
    your_name: form.your_name,
    tone: form.tone,
    goal: form.goal,
    status: 'sent',
  }])
}

    } catch (err) {
      console.error(err)
      alert('Generation failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Copy text
  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(''), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── HEADER ──────────────────────────── */}
      <div className="bg-white border-b border-gray-100 px-4 md:px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-sm">✉</div>
            <span className="font-black text-gray-900">ColdMail<span className="text-indigo-600">AI</span></span>
          </Link>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            {['Your Details', 'Prospect', 'Result'].map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  step > i + 1 ? 'bg-green-500 text-white' :
                  step === i + 1 ? 'bg-indigo-600 text-white' :
                  'bg-gray-200 text-gray-400'
                }`}>
                  {step > i + 1 ? '✓' : i + 1}
                </div>
                <span className={`hidden md:block text-xs font-semibold ${step === i + 1 ? 'text-indigo-600' : 'text-gray-400'}`}>
                  {s}
                </span>
                {i < 2 && <div className="w-8 h-px bg-gray-200" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 md:px-6 py-8 md:py-12">

        {/* ── STEP 1 — Your Details ────────── */}
        {step === 1 && (
          <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm">
            <h2 className="text-2xl font-black text-gray-900 mb-1">About You</h2>
            <p className="text-gray-400 text-sm mb-8">Tell us about yourself and what you offer</p>

            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Your Name *</label>
                  <input
                    type="text"
                    placeholder="Fahim Abrar"
                    value={form.your_name}
                    onChange={e => updateField('your_name', e.target.value)}
                    className="w-full bg-gray-50 border-2 border-gray-200 focus:border-indigo-500 focus:bg-white rounded-xl px-4 py-2.5 text-sm outline-none transition-all text-gray-900 placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Your Role</label>
                  <input
                    type="text"
                    placeholder="React Developer"
                    value={form.your_role}
                    onChange={e => updateField('your_role', e.target.value)}
                    className="w-full bg-gray-50 border-2 border-gray-200 focus:border-indigo-500 focus:bg-white rounded-xl px-4 py-2.5 text-sm outline-none transition-all text-gray-900 placeholder-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Your Company / Brand</label>
                <input
                  type="text"
                  placeholder="Freelancer / Your Company Name"
                  value={form.your_company}
                  onChange={e => updateField('your_company', e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-200 focus:border-indigo-500 focus:bg-white rounded-xl px-4 py-2.5 text-sm outline-none transition-all text-gray-900 placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Your Service / Product *</label>
                <textarea
                  placeholder="I build modern React websites and AI-powered tools for businesses. My recent project is AgentHub, an AI agent marketplace."
                  rows={3}
                  value={form.your_service}
                  onChange={e => updateField('your_service', e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-200 focus:border-indigo-500 focus:bg-white rounded-xl px-4 py-2.5 text-sm outline-none transition-all resize-none text-gray-900 placeholder-gray-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Email Tone</label>
                  <select
                    value={form.tone}
                    onChange={e => updateField('tone', e.target.value)}
                    className="w-full bg-gray-50 border-2 border-gray-200 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm outline-none transition-all text-gray-900"
                  >
                    <option value="professional">Professional</option>
                    <option value="friendly">Friendly & Warm</option>
                    <option value="confident">Confident & Bold</option>
                    <option value="casual">Casual</option>
                    <option value="formal">Formal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Email Goal</label>
                  <select
                    value={form.goal}
                    onChange={e => updateField('goal', e.target.value)}
                    className="w-full bg-gray-50 border-2 border-gray-200 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm outline-none transition-all text-gray-900"
                  >
                    <option value="book_meeting">Book a Meeting</option>
                    <option value="get_reply">Get a Reply</option>
                    <option value="close_sale">Close a Sale</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-indigo-50 p-4 rounded-xl">
                <input
                  type="checkbox"
                  id="followup"
                  checked={form.include_followup}
                  onChange={e => updateField('include_followup', e.target.checked)}
                  className="w-4 h-4 accent-indigo-600"
                />
                <label htmlFor="followup" className="text-sm font-semibold text-indigo-700 cursor-pointer">
                  Include 2 follow-up emails (recommended!)
                </label>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!form.your_name || !form.your_service}
              className="mt-8 w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl text-sm transition-all"
            >
              Next: Prospect Details →
            </button>
          </div>
        )}

        {/* ── STEP 2 — Prospect Details ──────── */}
        {step === 2 && (
          <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm">
            <h2 className="text-2xl font-black text-gray-900 mb-1">About Your Prospect</h2>
            <p className="text-gray-400 text-sm mb-8">Who are you emailing?</p>

            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Prospect Name *</label>
                  <input
                    type="text"
                    placeholder="John Smith"
                    value={form.prospect_name}
                    onChange={e => updateField('prospect_name', e.target.value)}
                    className="w-full bg-gray-50 border-2 border-gray-200 focus:border-indigo-500 focus:bg-white rounded-xl px-4 py-2.5 text-sm outline-none transition-all text-gray-900 placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Their Role</label>
                  <input
                    type="text"
                    placeholder="CEO / Marketing Manager"
                    value={form.prospect_role}
                    onChange={e => updateField('prospect_role', e.target.value)}
                    className="w-full bg-gray-50 border-2 border-gray-200 focus:border-indigo-500 focus:bg-white rounded-xl px-4 py-2.5 text-sm outline-none transition-all text-gray-900 placeholder-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Their Company *</label>
                <input
                  type="text"
                  placeholder="TechCorp Nigeria"
                  value={form.prospect_company}
                  onChange={e => updateField('prospect_company', e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-200 focus:border-indigo-500 focus:bg-white rounded-xl px-4 py-2.5 text-sm outline-none transition-all text-gray-900 placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Their Pain Point / Problem</label>
                <textarea
                  placeholder="They have an outdated website that doesn't convert visitors. Their competitors have modern sites with AI features."
                  rows={4}
                  value={form.prospect_pain}
                  onChange={e => updateField('prospect_pain', e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-200 focus:border-indigo-500 focus:bg-white rounded-xl px-4 py-2.5 text-sm outline-none transition-all resize-none text-gray-900 placeholder-gray-400"
                />
              </div>

              {/* Summary */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Email Summary</p>
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-gray-700"><span className="font-semibold">From:</span> {form.your_name || '—'} ({form.your_role || '—'})</p>
                  <p className="text-sm text-gray-700"><span className="font-semibold">To:</span> {form.prospect_name || '—'} at {form.prospect_company || '—'}</p>
                  <p className="text-sm text-gray-700"><span className="font-semibold">Tone:</span> {form.tone}</p>
                  <p className="text-sm text-gray-700"><span className="font-semibold">Goal:</span> {form.goal.replace(/_/g, ' ')}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setStep(1)}
                className="flex-1 border-2 border-gray-200 hover:border-gray-300 text-gray-600 font-bold py-3.5 rounded-xl text-sm transition-all"
              >
                ← Back
              </button>
              <button
                onClick={generateEmail}
                disabled={loading || !form.prospect_name || !form.prospect_company}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Generating...
                  </>
                ) : (
                  '✨ Generate Email →'
                )}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3 — Results ─────────────── */}
        {step === 3 && result && (
          <div className="flex flex-col gap-5">

            {/* Success Banner */}
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
              <span className="text-2xl">🎉</span>
              <div>
                <p className="font-bold text-green-700 text-sm">Your cold email is ready!</p>
                <p className="text-green-600 text-xs">Edit if needed, then copy and send!</p>
              </div>
            </div>

            {/* Main Email */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-black text-gray-900">📧 Cold Email</h3>
                <button
                  onClick={() => { setResult(null); setStep(1) }}
                  className="text-xs text-indigo-600 font-bold hover:underline"
                >
                  ← Generate New
                </button>
              </div>

              {/* Subject */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Subject Line</label>
                  <button
                    onClick={() => handleCopy(result.subject, 'subject')}
                    className="text-xs text-indigo-600 font-semibold hover:underline"
                  >
                    {copied === 'subject' ? '✅ Copied!' : '📋 Copy'}
                  </button>
                </div>
                <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3 text-sm font-semibold text-gray-900">
                  {result.subject}
                </div>
              </div>

              {/* Email Body */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Body</label>
                  <button
                    onClick={() => handleCopy(result.email, 'email')}
                    className="text-xs text-indigo-600 font-semibold hover:underline"
                  >
                    {copied === 'email' ? '✅ Copied!' : '📋 Copy'}
                  </button>
                </div>
                <textarea
                  value={result.email}
                  onChange={e => setResult({ ...result, email: e.target.value })}
                  rows={12}
                  className="w-full bg-gray-50 border-2 border-gray-200 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm outline-none transition-all resize-none text-gray-900"
                />
              </div>

              {/* Copy All Button */}
              <button
                onClick={() => handleCopy(`Subject: ${result.subject}\n\n${result.email}`, 'all')}
                className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl text-sm transition-all"
              >
                {copied === 'all' ? '✅ Copied!' : '📋 Copy Subject + Email'}
              </button>
            </div>

            {/* Follow Ups */}
            {form.include_followup && result.followup1 && (
              <>
                {/* Follow Up 1 */}
                <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-black text-gray-900">📧 Follow Up #1</h3>
                      <p className="text-xs text-gray-400 mt-1">Send 3 days after first email</p>
                    </div>
                    <button
                      onClick={() => handleCopy(result.followup1, 'followup1')}
                      className="text-xs text-indigo-600 font-semibold hover:underline"
                    >
                      {copied === 'followup1' ? '✅ Copied!' : '📋 Copy'}
                    </button>
                  </div>
                  <textarea
                    value={result.followup1}
                    onChange={e => setResult({ ...result, followup1: e.target.value })}
                    rows={6}
                    className="w-full bg-gray-50 border-2 border-gray-200 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm outline-none transition-all resize-none text-gray-900"
                  />
                </div>

                {/* Follow Up 2 */}
                <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-black text-gray-900">📧 Follow Up #2</h3>
                      <p className="text-xs text-gray-400 mt-1">Send 7 days after first email</p>
                    </div>
                    <button
                      onClick={() => handleCopy(result.followup2, 'followup2')}
                      className="text-xs text-indigo-600 font-semibold hover:underline"
                    >
                      {copied === 'followup2' ? '✅ Copied!' : '📋 Copy'}
                    </button>
                  </div>
                  <textarea
                    value={result.followup2}
                    onChange={e => setResult({ ...result, followup2: e.target.value })}
                    rows={6}
                    className="w-full bg-gray-50 border-2 border-gray-200 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm outline-none transition-all resize-none text-gray-900"
                  />
                </div>
              </>
            )}

            {/* Tips */}
            {result.tips && result.tips.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6">
                <h3 className="font-black text-amber-800 mb-4">💡 Pro Tips To Increase Reply Rate</h3>
                <div className="flex flex-col gap-3">
                  {result.tips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="text-amber-500 font-bold flex-shrink-0">→</span>
                      <p className="text-amber-800 text-sm">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Generate New */}
            <button
              onClick={() => { setResult(null); setStep(1); setForm({ your_name: '', your_role: '', your_company: '', your_service: '', prospect_name: '', prospect_company: '', prospect_role: '', prospect_pain: '', tone: 'professional', goal: 'book_meeting', include_followup: true }) }}
              className="border-2 border-gray-200 hover:border-indigo-300 hover:text-indigo-600 text-gray-600 font-bold py-3.5 rounded-xl text-sm transition-all w-full"
            >
              ✨ Generate Another Email
            </button>

          </div>
        )}

      </div>
    </div>
  )
}

export default Generator