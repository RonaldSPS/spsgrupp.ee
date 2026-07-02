import Link from "next/link"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="pt-[110px] pb-[80px] min-h-screen flex items-center">
        <div className="max-w-[600px] mx-auto px-[25px] text-center">
          <div className="text-[120px] font-bold text-[#17345a] leading-none opacity-10 select-none">
            404
          </div>
          <div className="mt-[-60px] mb-10">
            <h1 className="text-[32px] font-bold text-[#17345a] mb-4">
              Lehekülge ei leitud
            </h1>
            <p className="text-[16px] text-[#2f353f] leading-relaxed mb-8 font-light">
              Otsitavat lehekülge ei leitud või see on teisaldatud.
              Kontrollige aadressi või pöörduge tagasi avalehele.
            </p>
            <Link
              href="/"
              className="btn-primary text-[15px] py-2.5 px-6 inline-flex items-center gap-2"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Tagasi avalehele
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
