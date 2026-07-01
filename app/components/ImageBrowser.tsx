"use client"

import { useState, useEffect, useRef, useCallback } from "react"

interface ImageInfo {
  url: string
  name: string
  dir: string
  size: number
  modified: string
}

interface ImageBrowserProps {
  open: boolean
  onClose: () => void
  onSelect: (url: string) => void
}

export default function ImageBrowser({ open, onClose, onSelect }: ImageBrowserProps) {
  const [images, setImages] = useState<ImageInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("")
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadImages = useCallback(async () => {
    setLoading(true)
    try {
      const r = await fetch("/api/spsadmn/images")
      const data = await r.json()
      setImages(data.images || [])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    loadImages()
  }, [open, loadImages])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (open) window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [open, onClose])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError("")
    const formData = new FormData()
    formData.append("file", file)
    try {
      const res = await fetch("/api/spsadmn/images", { method: "POST", body: formData })
      const data = await res.json()
      if (data.success && data.url) {
        setImages((prev) => [{ url: data.url, name: data.name, dir: "uploads", size: data.size, modified: new Date().toISOString() }, ...prev])
        onSelect(data.url)
        onClose()
      } else {
        setError(data.error || "Upload failed")
      }
    } catch {
      setError("Upload failed")
    }
    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  if (!open) return null

  const dirs = [...new Set(images.map((img) => img.dir))]
  const filtered = filter
    ? images.filter((img) => img.dir.toLowerCase().includes(filter.toLowerCase()) || img.name.toLowerCase().includes(filter.toLowerCase()))
    : images

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-[900px] w-[95vw] max-h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-[rgba(23,52,90,0.08)] shrink-0">
          <h2 className="text-[18px] font-bold text-[#17345a]">Pildihaldur</h2>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filtreeri..."
              className="border border-[rgba(23,52,90,0.15)] rounded-xl px-3 py-1.5 text-[15px] w-[180px] focus:outline-none focus:border-[#3abeff]"
            />
            <label className={`py-2 px-4 rounded-xl text-[15px] font-medium cursor-pointer transition-colors flex items-center gap-1.5 ${uploading ? "bg-gray-200 text-gray-500" : "bg-[#17345a] text-white hover:bg-[#1e4a7a]"}`}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              {uploading ? "Laadin..." : "Laadi üles"}
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
            </label>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-[#5a6474]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex gap-1.5 px-4 py-2 border-b border-[rgba(23,52,90,0.05)] overflow-x-auto shrink-0">
          <button
            onClick={() => setFilter("")}
            className={`px-3 py-1 rounded-lg text-[15px] whitespace-nowrap transition-colors ${!filter ? "bg-[#17345a] text-white" : "bg-gray-100 text-[#5a6474] hover:bg-gray-200"}`}
          >
            Kõik ({images.length})
          </button>
          {dirs.map((dir) => (
            <button
              key={dir}
              onClick={() => setFilter(dir)}
              className={`px-3 py-1 rounded-lg text-[15px] whitespace-nowrap transition-colors ${filter === dir ? "bg-[#17345a] text-white" : "bg-gray-100 text-[#5a6474] hover:bg-gray-200"}`}
            >
              {dir}
            </button>
          ))}
        </div>

        {error && (
          <div className="px-4 py-2 bg-red-50 text-red-600 text-[15px] shrink-0">{error}</div>
        )}

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-[200px] text-[15px] text-[#5a6474]">Laadin...</div>
          ) : filtered.length === 0 ? (
            <div className="flex items-center justify-center h-[200px] text-[15px] text-[#5a6474]">Pilte ei leitud</div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filtered.map((img) => (
                <button
                  key={img.url}
                  onClick={() => {
                    setPreview(img.url)
                  }}
                  onDoubleClick={() => {
                    onSelect(img.url)
                    onClose()
                  }}
                  className={`relative group rounded-xl overflow-hidden border-2 bg-[#eef7fc] aspect-square transition-all ${preview === img.url ? "border-[#3abeff] ring-2 ring-[#3abeff]/20" : "border-transparent hover:border-[#3abeff]/50"}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt={img.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-end p-2">
                    <span className="text-white text-[15px] truncate w-full hidden group-hover:block bg-black/60 px-1.5 py-0.5 rounded">
                      {img.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {preview && (
          <div className="shrink-0 p-4 border-t border-[rgba(23,52,90,0.08)] flex items-center justify-between bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#eef7fc]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="text-[15px] font-medium text-[#17345a]">{preview.split("/").pop()}</div>
                <div className="text-[15px] text-[#5a6474] font-mono">{preview}</div>
              </div>
            </div>
            <button
              onClick={() => {
                onSelect(preview)
                onClose()
              }}
              className="bg-[#17345a] text-white py-2 px-5 rounded-xl text-[15px] font-medium hover:bg-[#1e4a7a] transition-colors"
            >
              Lisa pilt
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
