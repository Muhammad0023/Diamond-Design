'use client'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { HiX, HiPlus, HiMinus } from 'react-icons/hi'

export default function ImageZoomModal({ images, startIndex = 0, name = '', onClose }) {
  const [isTouch] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
  )

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="absolute inset-0 bg-black" style={{ colorScheme: 'dark' }}>
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 p-3 bg-white/15 hover:bg-white/25 rounded-full text-white backdrop-blur-md"
        style={{ zIndex: 10 }}
      >
        <HiX className="w-6 h-6" />
      </button>

      {isTouch ? (
        <TouchViewer src={images[startIndex]} alt={name} />
      ) : (
        <DesktopViewer images={images} startIndex={startIndex} name={name} />
      )}
    </div>
  )
}

/* ---------------- DESKTOP: stacked images, native scroll = pan ---------------- */
function DesktopViewer({ images, startIndex, name }) {
  const [zoom, setZoom] = useState(1)
  const [ratios, setRatios] = useState({})
  const [dragging, setDragging] = useState(false)
  const scrollRef = useRef(null)
  const itemRefs = useRef([])
  const zoomRef = useRef(1)
  const drag = useRef(null)
  zoomRef.current = zoom

  // open at the image that was clicked
  useLayoutEffect(() => {
    const el = itemRefs.current[startIndex]
    if (el && scrollRef.current) scrollRef.current.scrollTop = el.offsetTop
  }, [])

  // zoom around a point (cursor, or screen centre when no point is given)
  const applyZoom = useCallback((next, fx, fy) => {
    const el = scrollRef.current
    if (!el) return
    const prev = zoomRef.current
    const z = Math.min(Math.max(next, 1), 5)
    if (z === prev) return
    const rect = el.getBoundingClientRect()
    const px = fx == null ? rect.width / 2 : fx - rect.left
    const py = fy == null ? rect.height / 2 : fy - rect.top
    const k = z / prev
    const left = (el.scrollLeft + px) * k - px
    const top = (el.scrollTop + py) * k - py
    zoomRef.current = z
    flushSync(() => setZoom(z))
    el.scrollLeft = left
    el.scrollTop = top
  }, [])

  // trackpad pinch = wheel + ctrlKey (Chrome/Edge/Firefox); Safari uses gesture events
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onWheel = (e) => {
      if (!e.ctrlKey) return // plain wheel / two-finger swipe = native scroll (pan)
      e.preventDefault()
      const delta = Math.max(-30, Math.min(30, e.deltaY))
      applyZoom(zoomRef.current * Math.exp(-delta * 0.01), e.clientX, e.clientY)
    }
    let gestureStart = 1
    const onGestureStart = (e) => { e.preventDefault(); gestureStart = zoomRef.current }
    const onGestureChange = (e) => { e.preventDefault(); applyZoom(gestureStart * e.scale, e.clientX, e.clientY) }
    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('gesturestart', onGestureStart)
    el.addEventListener('gesturechange', onGestureChange)
    return () => {
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('gesturestart', onGestureStart)
      el.removeEventListener('gesturechange', onGestureChange)
    }
  }, [applyZoom])

  // mouse: click and drag to pan
  const onPointerDown = (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return
    const el = scrollRef.current
    drag.current = { x: e.clientX, y: e.clientY, left: el.scrollLeft, top: el.scrollTop }
    el.setPointerCapture(e.pointerId)
    setDragging(true)
  }
  const onPointerMove = (e) => {
    const d = drag.current
    if (!d) return
    const el = scrollRef.current
    el.scrollLeft = d.left - (e.clientX - d.x)
    el.scrollTop = d.top - (e.clientY - d.y)
  }
  const endDrag = () => {
    if (drag.current) {
      drag.current = null
      setDragging(false)
    }
  }

  return (
    <div className="absolute inset-0">
      <div
        ref={scrollRef}
        className="absolute inset-0 overflow-auto"
        style={{ cursor: dragging ? 'grabbing' : 'grab', overscrollBehavior: 'contain' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div style={{ width: `${zoom * 100}%` }}>
          {images.map((src, i) => (
            <div
              key={i}
              ref={(el) => { itemRefs.current[i] = el }}
              style={{ aspectRatio: String(ratios[i] ?? 0.75) }}
            >
              <img
                src={src}
                alt={`${name} – view ${i + 1}`}
                draggable={false}
                onLoad={(e) => {
                  const r = e.target.naturalWidth / e.target.naturalHeight
                  setRatios((prev) => (Math.abs((prev[i] ?? 0.75) - r) > 0.005 ? { ...prev, [i]: r } : prev))
                }}
                className="block w-full h-full select-none"
                style={{ objectFit: 'contain' }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-6 right-8 flex flex-col gap-2" style={{ zIndex: 10 }}>
        <button
          onClick={() => applyZoom(zoomRef.current * 1.4)}
          aria-label="Zoom in"
          className="p-3 bg-white/15 hover:bg-white/25 rounded-full text-white backdrop-blur-md"
        >
          <HiPlus className="w-5 h-5" />
        </button>
        <button
          onClick={() => applyZoom(zoomRef.current / 1.4)}
          aria-label="Zoom out"
          className="p-3 bg-white/15 hover:bg-white/25 rounded-full text-white backdrop-blur-md"
        >
          <HiMinus className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

/* ---------------- MOBILE: one image, touch pan + pinch zoom ---------------- */
function TouchViewer({ src, alt }) {
  const boxRef = useRef(null)
  const imgRef = useRef(null)
  const [view, setView] = useState({ w: 0, h: 0 })
  const [ratio, setRatio] = useState(0.75)
  const [loaded, setLoaded] = useState(false)
  const [t, setT] = useState({ s: 1, x: 0, y: 0 })
  const tRef = useRef(t)
  const pointers = useRef(new Map())
  const gesture = useRef(null)
  tRef.current = t

  useLayoutEffect(() => {
    const measure = () => {
      const el = boxRef.current
      if (el) setView({ w: el.clientWidth, h: el.clientHeight })
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const { w: vw, h: vh } = view
  let cw = 0
  let ch = 0
  let s0 = 1
  if (vw && vh) {
    if (vw / vh > ratio) { ch = vh; cw = vh * ratio } else { cw = vw; ch = vw / ratio }
    s0 = Math.max(vw / cw, vh / ch) // scale at which the image covers the whole screen
  }
  const MAX = s0 * 4

  // start already zoomed in, filling the screen
  useEffect(() => {
    if (vw && vh) setT({ s: s0, x: 0, y: 0 })
  }, [vw, vh, ratio])

  // image may already be cached
  useEffect(() => {
    const el = imgRef.current
    if (el && el.complete && el.naturalWidth) {
      setRatio(el.naturalWidth / el.naturalHeight)
      setLoaded(true)
    }
  }, [cw])

  const clamp = (s, x, y) => {
    const ns = Math.min(Math.max(s, s0), MAX)
    const maxX = Math.max(0, (cw * ns - vw) / 2)
    const maxY = Math.max(0, (ch * ns - vh) / 2)
    return { s: ns, x: Math.min(Math.max(x, -maxX), maxX), y: Math.min(Math.max(y, -maxY), maxY) }
  }

  const center = (a, b) => {
    const rect = boxRef.current.getBoundingClientRect()
    return {
      cx: (a.x + b.x) / 2 - rect.left - rect.width / 2,
      cy: (a.y + b.y) / 2 - rect.top - rect.height / 2,
    }
  }

  const begin = () => {
    const pts = [...pointers.current.values()]
    const cur = tRef.current
    if (pts.length === 1) {
      gesture.current = { type: 'pan', sx: pts[0].x, sy: pts[0].y, ox: cur.x, oy: cur.y }
    } else if (pts.length >= 2) {
      const [a, b] = pts
      const { cx, cy } = center(a, b)
      gesture.current = {
        type: 'pinch',
        d: Math.hypot(a.x - b.x, a.y - b.y) || 1,
        s: cur.s,
        px: (cx - cur.x) / cur.s,
        py: (cy - cur.y) / cur.s,
      }
    }
  }

  const onDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    begin()
  }

  const onMove = (e) => {
    if (!pointers.current.has(e.pointerId)) return
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    const g = gesture.current
    if (!g) return
    const pts = [...pointers.current.values()]
    if (g.type === 'pan' && pts.length === 1) {
      setT(clamp(tRef.current.s, g.ox + (pts[0].x - g.sx), g.oy + (pts[0].y - g.sy)))
    } else if (g.type === 'pinch' && pts.length >= 2) {
      const [a, b] = pts
      const d = Math.hypot(a.x - b.x, a.y - b.y) || 1
      const { cx, cy } = center(a, b)
      const s = Math.min(Math.max((g.s * d) / g.d, s0), MAX)
      setT(clamp(s, cx - g.px * s, cy - g.py * s))
    }
  }

  const onUp = (e) => {
    pointers.current.delete(e.pointerId)
    if (pointers.current.size === 0) gesture.current = null
    else begin()
  }

  return (
    <div
      ref={boxRef}
      className="absolute inset-0 overflow-hidden flex items-center justify-center"
      style={{ touchAction: 'none', overscrollBehavior: 'contain' }}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      {cw > 0 && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          draggable={false}
          onLoad={(e) => {
            setRatio(e.target.naturalWidth / e.target.naturalHeight)
            setLoaded(true)
          }}
          style={{
            width: cw,
            height: ch,
            maxWidth: 'none',
            flex: 'none',
            opacity: loaded ? 1 : 0,
            transform: `translate(${t.x}px, ${t.y}px) scale(${t.s})`,
            transformOrigin: 'center',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            willChange: 'transform',
          }}
        />
      )}
    </div>
  )
}
