"use client"

import { useEffect, useRef, useState } from "react"

type Props = {
  src: string
  poster?: string
  /** Accessible description of the video content (decorative videos pass an empty string). */
  ariaLabel: string
  playLabel: string
  pauseLabel: string
  /** CSS object-position for the cover crop, e.g. "30% center" to bias the visible window left. */
  objectPosition?: string
}

/**
 * Inline content video for the 6:7 image slot on service detail pages.
 * Autoplays muted when scrolled into view (IntersectionObserver), pauses when
 * out of view; a play/pause control appears on hover / keyboard focus
 * (always visible on touch devices). Manual pause is respected until the
 * video leaves the viewport.
 */
export default function ContentVideo({ src, poster, ariaLabel, playLabel, pauseLabel, objectPosition = "center" }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const userOverride = useRef<"play" | "pause" | null>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    const wrap = wrapRef.current
    if (!video || !wrap) return

    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    video.addEventListener("play", onPlay)
    video.addEventListener("pause", onPause)

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (userOverride.current !== "pause") video.play().catch(() => {})
        } else {
          if (!video.paused) video.pause()
          userOverride.current = null
        }
      },
      { threshold: 0.35 }
    )
    io.observe(wrap)

    return () => {
      io.disconnect()
      video.removeEventListener("play", onPlay)
      video.removeEventListener("pause", onPause)
    }
  }, [])

  const toggle = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      userOverride.current = "play"
      video.play().catch(() => {})
    } else {
      userOverride.current = "pause"
      video.pause()
    }
  }

  return (
    <div ref={wrapRef} className="group relative aspect-[6/7] w-full">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={ariaLabel}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition }}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? pauseLabel : playLabel}
        className="absolute inset-0 m-auto flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border-none bg-[rgba(23,52,90,0.75)] text-white opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 [@media(hover:none)]:opacity-100"
      >
        {playing ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8 5.5v13l11-6.5z" />
          </svg>
        )}
      </button>
    </div>
  )
}
