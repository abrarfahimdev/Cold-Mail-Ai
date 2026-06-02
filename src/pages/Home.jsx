import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
const Home = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-white">

      {/* ── NAVBAR ──────────────────────────── */}
      <nav className="border-b border-gray-100 px-4 md:px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-sm">✉</div>
            <span className="font-black text-gray-900 text-lg">ColdMail<span className="text-indigo-600">AI</span></span>
          </div>
        <div className="hidden md:flex items-center gap-2">
  <Link to="/inbox" className="text-gray-500 hover:text-indigo-600 font-semibold px-4 py-2 rounded-xl hover:bg-indigo-50 transition-all text-sm">
    📧 Inbox
  </Link>
  <Link to="/analytics" className="text-gray-500 hover:text-indigo-600 font-semibold px-4 py-2 rounded-xl hover:bg-indigo-50 transition-all text-sm">
    📊 Analytics
  </Link>
</div>
{user ? (
  <Link to="/dashboard" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 md:px-5 py-2 md:py-2.5 rounded-xl text-sm transition-all">
    Dashboard →
  </Link>
) : (
  <div className="flex items-center gap-2">
    <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-semibold text-sm transition-colors">
      Login
    </Link>
    <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 md:px-5 py-2 md:py-2.5 rounded-xl text-sm transition-all">
      Try Free →
    </Link>
  </div>
)}
        </div>
      </nav>

      {/* ── HERO ────────────────────────────── */}
      <section className="px-4 md:px-6 py-16 md:py-24 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-indigo-50 rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 md:w-64 h-48 md:h-64 bg-purple-50 rounded-full blur-3xl opacity-60" />

        <div className="max-w-3xl mx-auto relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-600 text-xs md:text-sm font-semibold px-3 md:px-4 py-2 rounded-full mb-6 md:mb-8">
            🤖 Powered by Groq AI
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight tracking-tight mb-4 md:mb-6">
            Write Cold Emails That
            <span className="text-indigo-600"> Actually Get Replies</span>
          </h1>

          {/* Subheading */}
          <p className="text-base md:text-xl text-gray-500 leading-relaxed mb-8 md:mb-10 max-w-xl mx-auto">
            Stop wasting hours writing cold emails. Let AI write personalized,
            high-converting emails in seconds.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-12 md:mb-16">
            <Link
              to="/generator"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 md:px-8 py-3.5 md:py-4 rounded-2xl text-sm md:text-base transition-all hover:shadow-xl hover:shadow-indigo-200 hover:-translate-y-1"
            >
              Generate Free Email →
            </Link>
            
           <a   href="#features"
              className="border-2 border-gray-200 hover:border-indigo-300 text-gray-700 hover:text-indigo-600 font-bold px-6 md:px-8 py-3.5 md:py-4 rounded-2xl text-sm md:text-base transition-all"
            >
              See Examples
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12">
            {[
              { value: '10K+', label: 'Emails Generated' },
              { value: '45%', label: 'Average Reply Rate' },
              { value: '60s', label: 'Generation Time' },
              { value: 'Free', label: 'To Get Started' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl md:text-3xl font-black text-indigo-600">{stat.value}</p>
                <p className="text-xs text-gray-400 uppercase tracking-wide mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────── */}
      <section id="features" className="py-16 md:py-24 bg-gray-50 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-4">
              Everything You Need To Close More Deals
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base">
              Stop guessing what to write. Our AI analyzes top performing cold emails
              and writes one specifically for your prospect.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {[
              { icon: '🎯', title: 'Hyper Personalized', desc: 'Every email is tailored to your prospect, their company and their specific pain points.' },
              { icon: '⚡', title: 'Generated in Seconds', desc: 'No more staring at blank screens. Get a complete email with subject line in under 60 seconds.' },
              { icon: '📈', title: 'High Converting', desc: 'Trained on thousands of cold emails with 40%+ reply rates. Not generic templates.' },
              { icon: '🔄', title: 'Follow Up Sequences', desc: 'Get a complete 3-email sequence including follow ups that close deals.' },
              { icon: '✏️', title: 'Fully Editable', desc: 'Edit the generated email to match your voice. Copy with one click.' },
              { icon: '🌍', title: 'Multiple Tones', desc: 'Professional, friendly, bold or casual. Match the tone to your prospect.' },
            ].map((f, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-indigo-200 hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-2xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2 text-sm md:text-base">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────── */}
      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
              How It Works
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { step: '01', icon: '📝', title: 'Enter Details', desc: 'Tell us about yourself and your prospect.' },
              { step: '02', icon: '🤖', title: 'AI Writes It', desc: 'Our AI generates a personalized email.' },
              { step: '03', icon: '✏️', title: 'Edit & Refine', desc: 'Tweak the email to match your voice.' },
              { step: '04', icon: '📨', title: 'Send & Close', desc: 'Send and watch the replies come in!' },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-600 text-white rounded-xl md:rounded-2xl flex items-center justify-center font-black text-xs md:text-sm mx-auto mb-3 md:mb-4">
                  {step.step}
                </div>
                <div className="text-2xl md:text-3xl mb-2 md:mb-3">{step.icon}</div>
                <h3 className="font-bold text-gray-900 mb-1 md:mb-2 text-sm">{step.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────── */}
      <section className="py-16 md:py-24 bg-gray-50 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
              People Love ColdMailAI
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {[
              { name: 'James Wilson', role: 'Sales Manager, Lagos', avatar: '👨‍💼', text: 'I went from 5% to 35% reply rate in one week. This tool is insane!', rating: 5 },
              { name: 'Sarah Okonkwo', role: 'Freelancer, Nairobi', avatar: '👩‍💻', text: 'Got my first $500 client from a cold email written by this AI. Worth every penny!', rating: 5 },
              { name: 'Ahmed Hassan', role: 'Startup Founder, Cairo', avatar: '🧑‍🚀', text: 'My team uses this daily. We close 3x more deals than before.', rating: 5 },
            ].map((t, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-indigo-200 transition-all hover:-translate-y-1 hover:shadow-lg">
                <div className="text-yellow-400 text-sm mb-3">{'⭐'.repeat(t.rating)}</div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-xl">{t.avatar}</div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-gray-400 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────── */}
      <section className="py-16 md:py-20 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl md:rounded-3xl px-6 md:px-12 py-14 md:py-20 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
                Start Writing Better Cold Emails Today
              </h2>
              <p className="text-indigo-100 text-sm md:text-lg mb-8 md:mb-10 max-w-xl mx-auto">
                Join thousands of sales professionals who close more deals with ColdMailAI.
              </p>
              <Link
                to="/generator"
                className="bg-white text-indigo-600 hover:bg-indigo-50 font-black px-8 md:px-10 py-3.5 md:py-4 rounded-2xl text-sm md:text-base transition-all hover:shadow-xl inline-block"
              >
                Generate Your First Email Free →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────── */}
      <footer className="border-t border-gray-100 px-4 md:px-6 py-6 md:py-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-xs">✉</div>
            <span className="font-black text-gray-900">ColdMail<span className="text-indigo-600">AI</span></span>
          </div>
          <p className="text-gray-400 text-sm text-center">© 2026 ColdMailAI. Built by Fahim Abrar</p>
        </div>
      </footer>

    </div>
  )
}

export default Home