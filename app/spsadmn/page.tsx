import Link from "next/link"

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-[32px] font-bold text-[#17345a] mb-2">Admin paneel</h1>
      <p className="text-[15px] text-[#5a6474] mb-10">Vali vasakult menüüst, mida soovid hallata.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </div>
    </div>
  )
}
