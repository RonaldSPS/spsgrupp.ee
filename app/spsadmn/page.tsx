import Link from "next/link"

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-[24px] sm:text-[32px] font-bold text-[#17345a] mb-2">Admin paneel</h1>
      <p className="text-[15px] text-[#5a6474] mb-8 sm:mb-10">Vali vasakult menüüst, mida soovid hallata.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <Link
          href="/spsadmn/blog"
          className="bg-white rounded-2xl p-8 shadow-sm border border-[rgba(23,52,90,0.08)] hover:shadow-md hover:border-[#3abeff]/30 transition-all group"
        >
          <div className="w-14 h-14 rounded-2xl bg-[#eef7fc] flex items-center justify-center mb-4 group-hover:bg-[#d4eef9] transition-colors">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
              <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <h2 className="text-[20px] font-bold text-[#17345a] mb-1">Blogi artiklid</h2>
          <p className="text-[15px] text-[#5a6474]">Muuda pealkirju, pilte, sisu ja slug&apos;e</p>
        </Link>

        <Link
          href="/spsadmn/toole"
          className="bg-white rounded-2xl p-8 shadow-sm border border-[rgba(23,52,90,0.08)] hover:shadow-md hover:border-[#3abeff]/30 transition-all group"
        >
          <div className="w-14 h-14 rounded-2xl bg-[#ecfdf5] flex items-center justify-center mb-4 group-hover:bg-[#d0f5e4] transition-colors">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2d9e6b" strokeWidth="2">
              <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-[20px] font-bold text-[#17345a] mb-1">Tööpakkumised</h2>
          <p className="text-[15px] text-[#5a6474]">Halda Tule tööle kuulutusi</p>
        </Link>

        <Link
          href="/spsadmn/testimonials"
          className="bg-white rounded-2xl p-8 shadow-sm border border-[rgba(23,52,90,0.08)] hover:shadow-md hover:border-[#3abeff]/30 transition-all group"
        >
          <div className="w-14 h-14 rounded-2xl bg-[#fef3c7] flex items-center justify-center mb-4 group-hover:bg-[#fde9a0] transition-colors">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#92400e" strokeWidth="2">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" />
            </svg>
          </div>
          <h2 className="text-[20px] font-bold text-[#17345a] mb-1">Arvamused</h2>
          <p className="text-[15px] text-[#5a6474]">Halda kliendi arvamusi ja tõlkeid</p>
        </Link>

        <Link
          href="/spsadmn/seaded"
          className="bg-white rounded-2xl p-8 shadow-sm border border-[rgba(23,52,90,0.08)] hover:shadow-md hover:border-[#3abeff]/30 transition-all group"
        >
          <div className="w-14 h-14 rounded-2xl bg-[#eceef1] flex items-center justify-center mb-4 group-hover:bg-[#dde1e6] transition-colors">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#17345a" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
            </svg>
          </div>
          <h2 className="text-[20px] font-bold text-[#17345a] mb-1">Seaded</h2>
          <p className="text-[15px] text-[#5a6474]">Halda e-posti saajaid ja administraatoreid</p>
        </Link>
      </div>
    </div>
  )
}
