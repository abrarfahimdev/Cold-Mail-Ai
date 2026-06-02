import { useState } from 'react'
import { Link } from 'react-router-dom'

// ── SAMPLE DATA ────────────────────────────
const weeklyData = [
  { day: 'Mon', sent: 12, replied: 5, opened: 9 },
  { day: 'Tue', sent: 18, replied: 8, opened: 14 },
  { day: 'Wed', sent: 8, replied: 3, opened: 6 },
  { day: 'Thu', sent: 22, replied: 11, opened: 18 },
  { day: 'Fri', sent: 15, replied: 7, opened: 12 },
  { day: 'Sat', sent: 5, replied: 2, opened: 4 },
  { day: 'Sun', sent: 3, replied: 1, opened: 2 },
]

const recentEmails = [
  { subject: 'Website Redesign Proposal', to: 'john@techcorp.ng', sent: '2h ago', status: 'replied', score: 92 },
  { subject: 'React Development Services', to: 'sarah@startupkenya.com', sent: '5h ago', status: 'opened', score: 78 },
  { subject: 'Digital Menu System', to: 'ahmed@digitalghana.com', sent: '1d ago', status: 'sent', score: 85 },
  { subject: 'AI Chatbot Development', to: 'maria@braziltech.com', sent: '2d ago', status: 'replied', score: 90 },
  { subject: 'Frontend Developer Role', to: 'careers@pixacloudlabs.com', sent: '3d ago', status: 'opened', score: 88 },
]

const statusColors = {
  replied: 'bg-green-100 text-green-600',
  opened: 'bg-blue-100 text-blue-600',
  sent: 'bg-gray-100 text-gray-500',
  bounced: 'bg-red-100 text-red-500',
}

const statusIcons = {
  replied: '✅',
  opened: '👁️',
  sent: '📨',
  bounced: '❌',
}

const Analytics = () => {
  const [period, setPeriod] = useState('week')

  // Calculate totals
  const totalSent = weeklyData.reduce((sum, d) => sum + d.sent, 0)
  const totalReplied = weeklyData.reduce((sum, d) => sum + d.replied, 0)
  const totalOpened = weeklyData.reduce((sum, d) => sum + d.opened, 0)
  const replyRate = Math.round((totalReplied / totalSent) * 100)
  const openRate = Math.round((totalOpened / totalSent) * 100)

  // Max value for chart
  const maxValue = Math.max(...weeklyData.map(d => d.sent))

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
            <Link to="/inbox" className="text-gray-500 hover:text-indigo-600 font-semibold px-3 py-2 rounded-xl hover:bg-indigo-50 transition-all text-sm">
              📧 Inbox
            </Link>
            <Link to="/generator" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all">
              ✉ Generator
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">

        {/* ── PAGE HEADER ─────────────────────── */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Email Analytics 📊</h1>
            <p className="text-gray-400 mt-1">Track your email performance and improve results</p>
          </div>
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-1">
            {['week', 'month', 'year'].map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${
                  period === p ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* ── STATS CARDS ─────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Emails Sent', value: totalSent, icon: '📨', color: 'bg-indigo-50 text-indigo-600', change: '+12%' },
            { label: 'Replies Received', value: totalReplied, icon: '💬', color: 'bg-green-50 text-green-600', change: '+8%' },
            { label: 'Reply Rate', value: `${replyRate}%`, icon: '📈', color: 'bg-purple-50 text-purple-600', change: '+5%' },
            { label: 'Open Rate', value: `${openRate}%`, icon: '👁️', color: 'bg-amber-50 text-amber-600', change: '+3%' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-indigo-200 transition-all hover:shadow-lg">
              <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center text-xl mb-3`}>
                {stat.icon}
              </div>
              <p className="text-2xl font-black text-gray-900 mb-1">{stat.value}</p>
              <p className="text-xs text-gray-400 mb-2">{stat.label}</p>
              <span className="text-xs font-bold text-green-500">{stat.change} this week</span>
            </div>
          ))}
        </div>

        {/* ── CHART ───────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-black text-gray-900">Email Activity</h3>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-indigo-500 rounded-full" />
                <span className="text-gray-500">Sent</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-gray-500">Replied</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-amber-500 rounded-full" />
                <span className="text-gray-500">Opened</span>
              </div>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="flex items-end gap-3 h-48">
            {weeklyData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex items-end gap-0.5 h-40">
                  {/* Sent bar */}
                  <div
                    className="flex-1 bg-indigo-500 rounded-t-lg transition-all hover:bg-indigo-600"
                    style={{ height: `${(d.sent / maxValue) * 100}%` }}
                    title={`Sent: ${d.sent}`}
                  />
                  {/* Opened bar */}
                  <div
                    className="flex-1 bg-amber-400 rounded-t-lg transition-all hover:bg-amber-500"
                    style={{ height: `${(d.opened / maxValue) * 100}%` }}
                    title={`Opened: ${d.opened}`}
                  />
                  {/* Replied bar */}
                  <div
                    className="flex-1 bg-green-500 rounded-t-lg transition-all hover:bg-green-600"
                    style={{ height: `${(d.replied / maxValue) * 100}%` }}
                    title={`Replied: ${d.replied}`}
                  />
                </div>
                <p className="text-xs text-gray-400 font-semibold">{d.day}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

          {/* ── BEST DAY ────────────────────────── */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-black text-gray-900 mb-4">🏆 Best Performing Day</h3>
            {(() => {
              const best = weeklyData.reduce((a, b) =>
                (b.replied / b.sent) > (a.replied / a.sent) ? b : a
              )
              return (
                <div className="text-center">
                  <p className="text-5xl font-black text-indigo-600 mb-2">{best.day}</p>
                  <p className="text-gray-400 text-sm mb-4">
                    {Math.round((best.replied / best.sent) * 100)}% reply rate
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-indigo-50 rounded-xl p-2 text-center">
                      <p className="font-black text-indigo-600">{best.sent}</p>
                      <p className="text-xs text-gray-400">Sent</p>
                    </div>
                    <div className="bg-amber-50 rounded-xl p-2 text-center">
                      <p className="font-black text-amber-600">{best.opened}</p>
                      <p className="text-xs text-gray-400">Opened</p>
                    </div>
                    <div className="bg-green-50 rounded-xl p-2 text-center">
                      <p className="font-black text-green-600">{best.replied}</p>
                      <p className="text-xs text-gray-400">Replied</p>
                    </div>
                  </div>
                </div>
              )
            })()}
          </div>

          {/* ── REPLY RATE GAUGE ────────────────── */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-black text-gray-900 mb-4">📈 Reply Rate</h3>
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                  <circle
                    cx="18" cy="18" r="15.9"
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="3"
                    strokeDasharray={`${replyRate} ${100 - replyRate}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-2xl font-black text-indigo-600">{replyRate}%</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">Industry average: 8%</p>
              <p className="text-green-500 font-bold text-sm mt-1">
                {replyRate > 8 ? `🔥 ${replyRate - 8}% above average!` : 'Keep improving!'}
              </p>
            </div>
          </div>

          {/* ── TIPS ────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-black text-gray-900 mb-4">💡 Improvement Tips</h3>
            <div className="flex flex-col gap-3">
              {[
                { tip: 'Send emails on Thursday for best results', icon: '📅' },
                { tip: 'Keep subject lines under 50 characters', icon: '✏️' },
                { tip: 'Follow up within 3 days of no reply', icon: '🔄' },
                { tip: 'Personalize first line for each prospect', icon: '🎯' },
              ].map((t, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-base flex-shrink-0">{t.icon}</span>
                  <p className="text-xs text-gray-600 leading-relaxed">{t.tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RECENT EMAILS TABLE ──────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-black text-gray-900">Recent Emails</h3>
            <Link to="/inbox" className="text-indigo-600 text-sm font-bold hover:underline">
              View All →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider pb-3">Subject</th>
                  <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider pb-3">To</th>
                  <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider pb-3">Sent</th>
                  <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider pb-3">Status</th>
                  <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider pb-3">Score</th>
                </tr>
              </thead>
              <tbody>
                {recentEmails.map((email, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 pr-4">
                      <p className="text-sm font-semibold text-gray-900 truncate max-w-xs">{email.subject}</p>
                    </td>
                    <td className="py-3 pr-4">
                      <p className="text-sm text-gray-500 truncate max-w-xs">{email.to}</p>
                    </td>
                    <td className="py-3 pr-4">
                      <p className="text-sm text-gray-400">{email.sent}</p>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusColors[email.status]}`}>
                        {statusIcons[email.status]} {email.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-100 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${email.score >= 80 ? 'bg-green-500' : email.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${email.score}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-gray-600">{email.score}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Analytics