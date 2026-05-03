'use client'

import { useEffect, useRef, useState, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'
import { ArrowUpRight, Mail, Github, Linkedin, Twitter } from 'lucide-react'

const PROJECTS = [
  {
    num: '01',
    tag: 'Computer Vision / Edge ML',
    title: 'Optic — Real-time defect detection',
    problem: 'Factory lines inspected 6 parts/sec, humans burned out by lunch.',
    solution: 'A distilled YOLOv8 model quantized to INT8, shipped to Jetson Orin with a WebRTC operator console.',
    impact: '38ms p95 · 99.2% recall · $1.4M saved/yr',
    img: 'https://images.unsplash.com/photo-1762279388952-85187155e48d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTF8MHwxfHNlYXJjaHwzfHxhYnN0cmFjdCUyMGRhdGElMjB2aXN1YWxpemF0aW9ufGVufDB8fHx8MTc3Nzc5ODYzMHww&ixlib=rb-4.1.0&q=85',
    stack: ['PyTorch', 'ONNX', 'TensorRT', 'Go', 'Next.js'],
  },
  {
    num: '02',
    tag: 'LLM Systems / RAG',
    title: 'Nimbus — Context engine for legal',
    problem: 'Associates lost 9 hrs/week searching across 40 yrs of case law.',
    solution: 'Hybrid retrieval (BM25 + ColBERT) over a re-ranker graph, with provenance-first prompts and streaming UI.',
    impact: '4.2× recall@20 · 71% citation accuracy · $0.003 / query',
    img: 'https://images.pexels.com/photos/18069816/pexels-photo-18069816.png?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    stack: ['LlamaIndex', 'Qdrant', 'FastAPI', 'React', 'Postgres'],
  },
  {
    num: '03',
    tag: 'Recommender / Backend',
    title: 'Signal — Personalization at 20M req/day',
    problem: 'Homepage ranked by rules; CTR plateaued for 9 months.',
    solution: 'Two-tower retrieval + lightweight GBM reranker, online feature store on Redis, A/B infra in Go.',
    impact: '+18.4% CTR · 43ms p99 · 20M daily ranked feeds',
    img: 'https://images.unsplash.com/photo-1674027444485-cec3da58eef4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MDZ8MHwxfHNlYXJjaHwzfHxuZXVyYWwlMjBuZXR3b3JrfGVufDB8fHx8MTc3Nzc5ODYzMHww&ixlib=rb-4.1.0&q=85',
    stack: ['TensorFlow', 'Go', 'Redis', 'Kafka', 'BigQuery'],
  },
  {
    num: '04',
    tag: 'Data Platform',
    title: 'Forma — Self-serve analytics fabric',
    problem: 'Data teams shipped dashboards in weeks; PMs gave up asking.',
    solution: 'Semantic layer on dbt + a natural-language-to-SQL agent with hallucination guardrails and query budgets.',
    impact: '3 days → 12 min avg dashboard · 92% query accuracy',
    img: 'https://images.unsplash.com/photo-1573384293689-0327bf65bd86?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTJ8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwYXJjaGl0ZWN0dXJlfGVufDB8fHx8MTc3Nzc5ODYzMHww&ixlib=rb-4.1.0&q=85',
    stack: ['dbt', 'Snowflake', 'Python', 'Anthropic', 'Next.js'],
  },
]

const EXPERIENCES = [
  { year: '2024 — Now', role: 'Senior AI Engineer', company: 'Stealth · AI infra', note: 'Leading retrieval & eval infrastructure. Shipping LLM-native products from 0→1.' },
  { year: '2022 — 2024', role: 'Staff ML Engineer', company: 'Nova Labs', note: 'Owned personalization platform serving 20M DAU. Built two-tower retrieval + online feature store.' },
  { year: '2020 — 2022', role: 'Backend Engineer', company: 'Cartograph', note: 'Go microservices for geo-indexing. H3 + vector tiles. Latency from 700ms → 42ms.' },
  { year: '2018 — 2020', role: 'Data Scientist', company: 'Meridian Research', note: 'Forecasting + causal inference for public-health interventions. Published 2 papers.' },
]

function Cursor() {
  const dot = useRef(null)
  const ring = useRef(null)
  useEffect(() => {
    if (typeof window === 'undefined' || window.matchMedia('(max-width: 768px)').matches) return
    const dEl = dot.current
    const rEl = ring.current
    let x = window.innerWidth / 2, y = window.innerHeight / 2
    let rx = x, ry = y
    const onMove = (e) => { x = e.clientX; y = e.clientY }
    let raf
    const tick = () => {
      rx += (x - rx) * 0.18
      ry += (y - ry) * 0.18
      if (dEl) dEl.style.transform = `translate3d(${x - 4}px, ${y - 4}px, 0)`
      if (rEl) rEl.style.transform = `translate3d(${rx - 18}px, ${ry - 18}px, 0)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    window.addEventListener('mousemove', onMove)
    const onEnter = () => rEl && rEl.classList.add('cursor-grow')
    const onLeave = () => rEl && rEl.classList.remove('cursor-grow')
    const hoverables = document.querySelectorAll('a, button, [data-hover]')
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      hoverables.forEach(el => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeave)
      })
    }
  }, [])
  return (
    <>
      <div ref={ring} className="cursor-ring fixed top-0 left-0 w-9 h-9 rounded-full border border-white pointer-events-none z-[9999] mix-blend-difference transition-transform duration-200 ease-out hidden md:block" />
      <div ref={dot} className="fixed top-0 left-0 w-2 h-2 rounded-full bg-white pointer-events-none z-[9999] mix-blend-difference hidden md:block" />
    </>
  )
}

function Preloader({ onDone }) {
  const root = useRef(null)
  const counter = useRef(null)
  useEffect(() => {
    const tl = gsap.timeline({ onComplete: onDone })
    tl.to({ v: 0 }, {
      v: 100, duration: 1.8, ease: 'power2.inOut',
      onUpdate: function () {
        if (counter.current) counter.current.textContent = Math.floor(this.targets()[0].v).toString().padStart(3, '0')
      },
    })
    tl.to('.pre-line', { scaleX: 1, duration: 0.9, ease: 'expo.inOut' }, 0.2)
    tl.to('.pre-name', { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out' }, '-=0.6')
    tl.to(root.current, { yPercent: -100, duration: 1.1, ease: 'expo.inOut', delay: 0.35 })
  }, [onDone])
  return (
    <div ref={root} className="fixed inset-0 z-[100] bg-[hsl(var(--ink))] text-[hsl(var(--bone))] flex flex-col justify-between p-6 md:p-10">
      <div className="flex items-center justify-between text-xs tracking-[0.2em] uppercase opacity-80">
        <span>Portfolio · 2026</span>
        <span>Cinematic build</span>
      </div>
      <div className="flex flex-col items-center gap-6">
        <div className="pre-line h-px w-[60%] bg-[hsl(var(--bone))] origin-left scale-x-0" />
        <div className="flex items-end gap-8">
          <div ref={counter} className="font-display text-7xl md:text-9xl leading-none tabular-nums">000</div>
          <div className="pre-name translate-y-6 opacity-0 text-sm tracking-[0.3em] uppercase mb-4">
            <div className="opacity-60">Booting</div>
            <div>Aryan Kapoor</div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between text-xs tracking-[0.2em] uppercase opacity-70">
        <span>AI · Systems · Craft</span>
        <span>Loading</span>
      </div>
    </div>
  )
}

// --- Hero3D: cinematic Three.js wireframe icosahedron with dust halo ---
function Hero3D() {
  const ref = useRef(null)
  useEffect(() => {
    const container = ref.current
    if (!container || typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.matchMedia('(max-width: 768px)').matches) return  // skip 3D entirely on mobile

    const isMobile = false  // we no-op above, but keep variable for clarity

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, container.offsetWidth / container.offsetHeight, 0.1, 100)
    // Offset upper-right so typography stays the focal point
    camera.position.set(-1.4, -0.7, 6.0)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setSize(container.offsetWidth, container.offsetHeight)
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)

    // Outer + inner icosahedrons for moiré depth
    const detail = isMobile ? 1 : 2
    const outerGeo = new THREE.IcosahedronGeometry(1.55, detail)
    const innerGeo = new THREE.IcosahedronGeometry(1.05, detail - 1 < 0 ? 0 : detail - 1)

    // Vertex color gradient (indigo -> violet -> cyan)
    const applyGradient = (geo) => {
      const pos = geo.attributes.position
      const colors = new Float32Array(pos.count * 3)
      const a = new THREE.Color('#4f46e5')
      const b = new THREE.Color('#a78bfa')
      const c = new THREE.Color('#06b6d4')
      for (let i = 0; i < pos.count; i++) {
        const y = pos.getY(i)
        const t = (y + 1.6) / 3.2
        const col = t < 0.5 ? a.clone().lerp(b, t * 2) : b.clone().lerp(c, (t - 0.5) * 2)
        colors[i * 3 + 0] = col.r
        colors[i * 3 + 1] = col.g
        colors[i * 3 + 2] = col.b
      }
      geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    }
    applyGradient(outerGeo)
    applyGradient(innerGeo)

    // Outer wireframe
    const outerEdges = new THREE.EdgesGeometry(outerGeo, 1)
    const outerLineMat = new THREE.LineBasicMaterial({
      color: 0x0b0b10, transparent: true, opacity: 0.42
    })
    const outerLine = new THREE.LineSegments(outerEdges, outerLineMat)

    // Outer faint fill (vertex colors, low alpha)
    const outerFillMat = new THREE.MeshBasicMaterial({
      vertexColors: true, transparent: true, opacity: 0.06, side: THREE.DoubleSide
    })
    const outerFill = new THREE.Mesh(outerGeo, outerFillMat)

    // Inner glowing wireframe
    const innerEdges = new THREE.EdgesGeometry(innerGeo, 1)
    const innerLineMat = new THREE.LineBasicMaterial({
      color: 0x4f46e5, transparent: true, opacity: 0.40
    })
    const innerLine = new THREE.LineSegments(innerEdges, innerLineMat)

    const innerFillMat = new THREE.MeshBasicMaterial({
      vertexColors: true, transparent: true, opacity: 0.12, side: THREE.DoubleSide
    })
    const innerFill = new THREE.Mesh(innerGeo, innerFillMat)

    const group = new THREE.Group()
    group.add(outerFill, outerLine, innerFill, innerLine)
    scene.add(group)

    // Dust particles around
    const dustCount = isMobile ? 240 : 600
    const dustGeo = new THREE.BufferGeometry()
    const dPos = new Float32Array(dustCount * 3)
    const dCol = new Float32Array(dustCount * 3)
    const baseCol = new THREE.Color()
    for (let i = 0; i < dustCount; i++) {
      const r = 1.9 + Math.pow(Math.random(), 0.7) * 2.6
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      dPos[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta)
      dPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      dPos[i * 3 + 2] = r * Math.cos(phi)
      // Color: lerp between indigo and cyan based on radius
      const t = (r - 1.9) / 2.6
      baseCol.setHSL(0.66 - t * 0.18, 0.85, 0.55)
      dCol[i * 3 + 0] = baseCol.r
      dCol[i * 3 + 1] = baseCol.g
      dCol[i * 3 + 2] = baseCol.b
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dPos, 3))
    dustGeo.setAttribute('color', new THREE.BufferAttribute(dCol, 3))
    const dustMat = new THREE.PointsMaterial({
      size: 0.018, vertexColors: true, transparent: true, opacity: 0.7,
      sizeAttenuation: true, depthWrite: false,
    })
    const dust = new THREE.Points(dustGeo, dustMat)
    scene.add(dust)

    // Cursor parallax
    let tmx = 0, tmy = 0, mx = 0, my = 0
    const onMove = (e) => {
      tmx = (e.clientX / window.innerWidth - 0.5) * 2
      tmy = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMove)

    const resize = () => {
      const w = container.offsetWidth, h = container.offsetHeight
      if (w === 0 || h === 0) return
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', resize)

    let raf, t = 0
    const animate = () => {
      t += 0.005
      mx += (tmx - mx) * 0.04
      my += (tmy - my) * 0.04

      // Slow auto-rotation + cursor tilt
      group.rotation.y += 0.0028
      group.rotation.x = my * 0.35 + Math.sin(t * 0.8) * 0.12
      group.rotation.z = mx * 0.18 + Math.cos(t * 0.6) * 0.07

      // Inner counter-rotates for living motion
      innerLine.rotation.y -= 0.005
      innerLine.rotation.x += 0.003
      innerFill.rotation.y -= 0.005
      innerFill.rotation.x += 0.003

      // Breathing scale
      const breath = 1 + Math.sin(t * 1.4) * 0.025
      group.scale.setScalar(breath)

      // Dust slow orbit
      dust.rotation.y -= 0.0015
      dust.rotation.x += 0.0008

      renderer.render(scene, camera)
      raf = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', resize)
      outerGeo.dispose(); innerGeo.dispose()
      outerEdges.dispose(); innerEdges.dispose()
      outerLineMat.dispose(); innerLineMat.dispose()
      outerFillMat.dispose(); innerFillMat.dispose()
      dustGeo.dispose(); dustMat.dispose()
      renderer.dispose()
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement)
    }
  }, [])
  return <div ref={ref} className="absolute inset-0 pointer-events-none" />
}

function HeroCanvas() {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let w, h, dpr, raf, t = 0
    const blobs = [
      { cx: 0.25, cy: 0.35, r: 0.35, color: [79, 70, 229] },
      { cx: 0.75, cy: 0.30, r: 0.30, color: [139, 92, 246] },
      { cx: 0.55, cy: 0.80, r: 0.32, color: [6, 182, 212] },
      { cx: 0.15, cy: 0.78, r: 0.22, color: [233, 179, 132] },
    ]
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.offsetWidth; h = canvas.offsetHeight
      canvas.width = w * dpr; canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const onResize = () => resize()
    window.addEventListener('resize', onResize)
    const draw = () => {
      t += 0.003
      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = '#F6F2EA'
      ctx.fillRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'multiply'
      blobs.forEach((b, i) => {
        const wobbleX = Math.sin(t + i) * 0.06
        const wobbleY = Math.cos(t * 1.2 + i) * 0.05
        const cx = (b.cx + wobbleX) * w
        const cy = (b.cy + wobbleY) * h
        const r = b.r * Math.min(w, h)
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
        g.addColorStop(0, `rgba(${b.color.join(',')}, 0.55)`)
        g.addColorStop(1, `rgba(${b.color.join(',')}, 0)`)
        ctx.fillStyle = g
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize) }
  }, [])
  return <canvas ref={ref} className="absolute inset-0 w-full h-full" />
}

function NeuralCanvas() {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let w, h, dpr, raf, t = 0
    const layers = [5, 8, 10, 8, 3]
    let nodes = []
    const build = () => {
      nodes = []
      const padX = w * 0.12, padY = h * 0.15
      const innerW = w - padX * 2, innerH = h - padY * 2
      layers.forEach((count, li) => {
        const x = padX + (innerW * li) / (layers.length - 1)
        for (let i = 0; i < count; i++) {
          const y = padY + (innerH * (i + 0.5)) / count
          nodes.push({ x, y, l: li, i, pulse: Math.random() })
        }
      })
    }
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.offsetWidth; h = canvas.offsetHeight
      canvas.width = w * dpr; canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      build()
    }
    resize()
    window.addEventListener('resize', resize)
    const draw = () => {
      t += 0.012
      ctx.clearRect(0, 0, w, h)
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]
        for (let j = 0; j < nodes.length; j++) {
          const b = nodes[j]
          if (b.l === a.l + 1) {
            const flow = (Math.sin(t * 2 + a.l + a.i * 0.3 + b.i * 0.7) + 1) / 2
            ctx.strokeStyle = `rgba(139, 165, 255, ${0.05 + flow * 0.22})`
            ctx.lineWidth = 0.6
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke()
          }
        }
      }
      nodes.forEach(n => {
        const pulse = (Math.sin(t * 2 + n.pulse * 6) + 1) / 2
        const r = 2 + pulse * 3
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 4)
        g.addColorStop(0, `rgba(167, 139, 250, ${0.5 + pulse * 0.4})`)
        g.addColorStop(1, 'rgba(167, 139, 250, 0)')
        ctx.fillStyle = g
        ctx.beginPath(); ctx.arc(n.x, n.y, r * 4, 0, Math.PI * 2); ctx.fill()
        ctx.fillStyle = '#F6F2EA'
        ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2); ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={ref} className="absolute inset-0 w-full h-full" />
}

function Magnetic({ children, className = '' }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      const x = e.clientX - (r.left + r.width / 2)
      const y = e.clientY - (r.top + r.height / 2)
      gsap.to(el, { x: x * 0.25, y: y * 0.25, duration: 0.4, ease: 'power3.out' })
    }
    const onLeave = () => gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' })
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [])
  return <div ref={ref} className={className}>{children}</div>
}

function splitChars(text) {
  return text.split('').map((c, i) => (
    <span key={i} className="char hero-char" aria-hidden="true">{c === ' ' ? '\u00A0' : c}</span>
  ))
}

// --- Ambient audio (Web Audio API, generative drone + minor pad) ---
function useAmbient() {
  const ctxRef = useRef(null)
  const masterRef = useRef(null)
  const targetVolRef = useRef(0.32)
  const [enabled, setEnabled] = useState(false)
  const startedRef = useRef(false)

  const ensureGraph = () => {
    if (ctxRef.current) return ctxRef.current
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) return null
    const ctx = new Ctx()
    ctxRef.current = ctx

    const master = ctx.createGain()
    master.gain.value = 0
    masterRef.current = master

    // Soft master limiter via DynamicsCompressor (prevents harshness)
    const comp = ctx.createDynamicsCompressor()
    comp.threshold.value = -18
    comp.knee.value = 12
    comp.ratio.value = 6
    comp.attack.value = 0.05
    comp.release.value = 0.4
    master.connect(comp).connect(ctx.destination)

    // Drone bass (sine 55Hz with slow detune wobble)
    const drone = ctx.createOscillator()
    drone.type = 'sine'
    drone.frequency.value = 55
    const droneLFO = ctx.createOscillator()
    droneLFO.frequency.value = 0.07
    const droneLFOGain = ctx.createGain()
    droneLFOGain.gain.value = 1.4
    droneLFO.connect(droneLFOGain).connect(drone.frequency)
    const droneGain = ctx.createGain()
    droneGain.gain.value = 0.45
    drone.connect(droneGain).connect(master)
    drone.start(); droneLFO.start()

    // Pad chord — A minor (A2, C3, E3) → 110, 130.81, 164.81
    const notes = [110, 130.81, 164.81, 220]
    notes.forEach((freq, i) => {
      const osc1 = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      osc1.type = 'triangle'
      osc2.type = 'sine'
      osc1.frequency.value = freq
      osc2.frequency.value = freq * 1.0035

      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.value = 700 + i * 80
      filter.Q.value = 0.6

      const lfo = ctx.createOscillator()
      lfo.frequency.value = 0.06 + i * 0.025
      const lfoGain = ctx.createGain()
      lfoGain.gain.value = 90
      lfo.connect(lfoGain).connect(filter.frequency)

      const gain = ctx.createGain()
      gain.gain.value = 0.07 + (i === 3 ? -0.02 : 0)

      osc1.connect(filter)
      osc2.connect(filter)
      filter.connect(gain).connect(master)

      osc1.start(); osc2.start(); lfo.start()
    })

    // Soft shimmer — high sine drifting in slowly
    const shim = ctx.createOscillator()
    shim.type = 'sine'
    shim.frequency.value = 880
    const shimLFO = ctx.createOscillator()
    shimLFO.frequency.value = 0.04
    const shimLFOGain = ctx.createGain()
    shimLFOGain.gain.value = 8
    shimLFO.connect(shimLFOGain).connect(shim.frequency)
    const shimGain = ctx.createGain()
    shimGain.gain.value = 0.018
    shim.connect(shimGain).connect(master)
    shim.start(); shimLFO.start()

    return ctx
  }

  const start = () => {
    const ctx = ensureGraph()
    if (!ctx) return
    if (ctx.state === 'suspended') ctx.resume()
    const m = masterRef.current
    m.gain.cancelScheduledValues(ctx.currentTime)
    m.gain.linearRampToValueAtTime(targetVolRef.current, ctx.currentTime + 1.4)
    startedRef.current = true
    setEnabled(true)
    try { sessionStorage.setItem('ak-ambient', '1') } catch (e) {}
  }

  const stop = () => {
    const ctx = ctxRef.current
    if (!ctx || !masterRef.current) { setEnabled(false); return }
    masterRef.current.gain.cancelScheduledValues(ctx.currentTime)
    masterRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6)
    setEnabled(false)
    try { sessionStorage.setItem('ak-ambient', '0') } catch (e) {}
  }

  const setVolumeFromScroll = (p) => {
    targetVolRef.current = computeVolume(p)
    if (!enabled || !masterRef.current || !ctxRef.current) return
    masterRef.current.gain.setTargetAtTime(targetVolRef.current, ctxRef.current.currentTime, 0.6)
  }

  return { enabled, start, stop, setVolumeFromScroll }
}

// Volume curve: full at hero (0-12%), dip in middle scenes (35-65%), rise at CTA (>85%)
function computeVolume(p) {
  if (p < 0.12) return 0.32
  if (p < 0.35) return 0.32 - (p - 0.12) / 0.23 * 0.18  // 0.32 → 0.14
  if (p < 0.65) return 0.14
  if (p < 0.85) return 0.14 + (p - 0.65) / 0.20 * 0.18  // 0.14 → 0.32
  return 0.34
}

function AmbientToggle({ enabled, onToggle }) {
  return (
    <button
      onClick={onToggle}
      data-hover
      aria-label={enabled ? 'Mute ambient sound' : 'Play ambient sound'}
      className="fixed bottom-5 left-5 md:bottom-6 md:left-6 z-[60] glass rounded-full pl-3 pr-4 py-2 flex items-center gap-2.5 text-[10px] tracking-[0.25em] uppercase text-ink hover:bg-white transition"
    >
      <span className="flex items-end gap-[2px] h-3 w-4">
        {[0, 1, 2, 3].map(i => (
          <span
            key={i}
            className={`w-[2px] bg-current rounded-full origin-bottom ${enabled ? 'audio-bar' : ''}`}
            style={{
              height: enabled ? '100%' : '30%',
              animationDelay: `${i * 0.12}s`,
              animationDuration: `${0.7 + (i % 2) * 0.4}s`,
            }}
          />
        ))}
      </span>
      <span>{enabled ? 'Sound · on' : 'Sound · off'}</span>
    </button>
  )
}

// --- GENESIS: scroll-scrubbed canvas image sequence ---
// 4-phase generative animation: noise → lattice → clusters → ring (intelligence)
function GenesisCanvas({ progressRef }) {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let w = 0, h = 0, dpr = 1, raf
    const N = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches ? 380 : 720
    let particles = []
    const easeInOut = (t) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2

    const buildTargets = () => {
      particles = new Array(N)
      const cols = 36, rows = 18
      const clusterCount = 6
      for (let i = 0; i < N; i++) {
        // T0 — noise (chaos)
        const t0 = { x: Math.random() * w, y: Math.random() * h }
        // T1 — lattice (structure)
        const ci = i % cols, ri = Math.floor(i / cols) % rows
        const t1 = {
          x: w * 0.10 + (ci + 0.5) * (w * 0.80) / cols,
          y: h * 0.22 + (ri + 0.5) * (h * 0.56) / rows,
        }
        // T2 — clusters (intelligence forming)
        const cIdx = i % clusterCount
        const cAng = (cIdx / clusterCount) * Math.PI * 2 - Math.PI / 2
        const cx = w / 2 + Math.cos(cAng) * Math.min(w, h) * 0.26
        const cy = h / 2 + Math.sin(cAng) * Math.min(w, h) * 0.22
        const rr = Math.pow(Math.random(), 0.6) * 70
        const aa = Math.random() * Math.PI * 2
        const t2 = { x: cx + Math.cos(aa) * rr, y: cy + Math.sin(aa) * rr }
        // T3 — ring (impact / converged)
        const ringA = (i / N) * Math.PI * 2
        const ringR = Math.min(w, h) * 0.30
        const t3 = {
          x: w / 2 + Math.cos(ringA) * ringR,
          y: h / 2 + Math.sin(ringA) * ringR,
        }
        particles[i] = { t0, t1, t2, t3, x: t0.x, y: t0.y, seed: Math.random() }
      }
    }

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.offsetWidth
      h = canvas.offsetHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      buildTargets()
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      const p = Math.max(0, Math.min(1, progressRef.current || 0))
      const seg = p * 3
      const phase = Math.min(2, Math.floor(seg))
      const tt = easeInOut(seg - phase)
      const keys = ['t0', 't1', 't2', 't3']
      const now = performance.now() * 0.0006

      ctx.clearRect(0, 0, w, h)

      // update positions
      for (let i = 0; i < N; i++) {
        const pt = particles[i]
        const a = pt[keys[phase]], b = pt[keys[phase + 1]]
        let x = a.x + (b.x - a.x) * tt
        let y = a.y + (b.y - a.y) * tt
        // gentle drift in early phases, calm at impact
        const drift = (1 - p) * 6 + 2
        x += Math.sin(now + pt.seed * 12) * drift
        y += Math.cos(now * 1.3 + pt.seed * 7) * drift
        pt.x = x; pt.y = y
      }

      // edges — appear in build phase, peak at intelligence, fade at impact
      const edgeWeight =
        p < 0.18 ? 0
        : p < 0.55 ? (p - 0.18) / 0.37
        : p < 0.85 ? 1
        : Math.max(0, 1 - (p - 0.85) / 0.15)

      if (edgeWeight > 0.02) {
        const threshold = 55 + p * 50
        const t2sq = threshold * threshold
        ctx.lineWidth = 0.5
        const hue = 240 - p * 60   // indigo -> cyan
        for (let i = 0; i < N; i++) {
          const a = particles[i]
          const lim = Math.min(N, i + 7)
          for (let j = i + 1; j < lim; j++) {
            const b = particles[j]
            const dx = a.x - b.x, dy = a.y - b.y
            const d2 = dx * dx + dy * dy
            if (d2 < t2sq) {
              const alpha = (1 - Math.sqrt(d2) / threshold) * edgeWeight * 0.45
              ctx.strokeStyle = `hsla(${hue}, 80%, 65%, ${alpha})`
              ctx.beginPath()
              ctx.moveTo(a.x, a.y)
              ctx.lineTo(b.x, b.y)
              ctx.stroke()
            }
          }
        }
      }

      // points
      const radius = 1.4 + p * 1.8
      for (let i = 0; i < N; i++) {
        const pt = particles[i]
        const hue = 240 - p * 70 + (pt.seed * 24 - 12)
        const light = 70 + p * 14
        const al = 0.65 + p * 0.30
        ctx.fillStyle = `hsla(${hue}, 92%, ${light}%, ${al})`
        ctx.beginPath()
        ctx.arc(pt.x, pt.y, radius, 0, Math.PI * 2)
        ctx.fill()
      }

      // central glow at the impact phase
      if (p > 0.7) {
        const k = (p - 0.7) / 0.3
        const cg = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.min(w, h) * 0.42)
        cg.addColorStop(0, `rgba(167, 139, 250, ${0.22 * k})`)
        cg.addColorStop(0.5, `rgba(56, 189, 248, ${0.10 * k})`)
        cg.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.fillStyle = cg
        ctx.fillRect(0, 0, w, h)
      }

      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [progressRef])
  return <canvas ref={ref} className="absolute inset-0 w-full h-full" />
}

const GENESIS_PHASES = [
  { k: 'Problem',      t: 'Most data is noise.',                    d: 'Logs. Events. Streams that whisper nothing.' },
  { k: 'Build',        t: 'I weave structure through it.',          d: 'Pipelines. Schemas. The boring spine of every model.' },
  { k: 'Intelligence', t: 'Patterns emerge. The system thinks.',    d: 'Embeddings cluster. Loss curves bend. A model arrives.' },
  { k: 'Impact',       t: 'Quietly, in production.',                d: 'No demo. Throughput, latency, money saved.' },
]

function Genesis({ progressRef }) {
  return (
    <section id="genesis" className="relative h-screen w-full overflow-hidden bg-[hsl(var(--ink))] text-white">
      <GenesisCanvas progressRef={progressRef} />
      {/* radial vignette over canvas */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 30%, hsl(var(--ink) / 0.55) 95%)' }} />

      {/* parallax floating labels */}
      <div className="absolute inset-0 pointer-events-none font-mono">
        <span data-speed="0.4" className="gn-label absolute top-[14%] left-[7%] text-[10px] tracking-[0.3em] uppercase text-white/45">η = 0.001</span>
        <span data-speed="0.7" className="gn-label absolute top-[20%] right-[12%] text-[10px] tracking-[0.3em] uppercase text-white/45">tokens · 8192</span>
        <span data-speed="0.5" className="gn-label absolute bottom-[36%] left-[14%] text-[10px] tracking-[0.3em] uppercase text-white/45 hidden md:inline">loss · 4.2e-3</span>
        <span data-speed="0.9" className="gn-label absolute bottom-[28%] right-[8%] text-[10px] tracking-[0.3em] uppercase text-white/45">recall@20 · 0.91</span>
        <span data-speed="0.6" className="gn-label absolute top-[46%] left-[5%] text-[10px] tracking-[0.3em] uppercase text-white/45 hidden md:inline">batch · 64</span>
        <span data-speed="0.8" className="gn-label absolute top-[62%] right-[6%] text-[10px] tracking-[0.3em] uppercase text-white/45 hidden md:inline">layer · 24</span>
        <span data-speed="0.3" className="gn-label absolute top-[8%] right-[34%] text-[10px] tracking-[0.3em] uppercase text-white/40 hidden md:inline">σ · noise</span>
        <span data-speed="0.55" className="gn-label absolute bottom-[10%] left-[40%] text-[10px] tracking-[0.3em] uppercase text-white/40 hidden md:inline">∇ · descent</span>
      </div>

      {/* TOP overlay — title + progress meter */}
      <div className="absolute top-0 left-0 right-0 px-6 md:px-10 pt-32 flex items-start justify-between pointer-events-none">
        <div>
          <div className="text-xs tracking-[0.3em] uppercase opacity-60 mb-3">— 07 / Genesis</div>
          <h2 className="font-display text-3xl md:text-5xl tracking-[-0.03em] leading-[1.05] max-w-md">
            How <span className="font-serif-display italic">intelligence</span> takes shape.
          </h2>
        </div>
        <div className="hidden md:flex items-center gap-3 text-[10px] tracking-[0.3em] uppercase text-white/60 font-mono">
          <span className="gn-progress-num tabular-nums">00</span>
          <div className="w-40 h-px bg-white/15 relative overflow-hidden">
            <div className="gn-progress-bar absolute inset-0 bg-[hsl(var(--cyan))] origin-left scale-x-0" />
          </div>
          <span>scrub</span>
        </div>
      </div>

      {/* BOTTOM — phase storytelling cards (4) */}
      <div className="absolute bottom-0 left-0 right-0 px-6 md:px-10 pb-14 grid grid-cols-12 gap-4 md:gap-6 pointer-events-none">
        {GENESIS_PHASES.map((s, i) => (
          <div key={i} data-phase={i} className="gn-panel col-span-6 md:col-span-3 opacity-30 will-change-transform">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-[10px] tabular-nums text-[hsl(var(--cyan))]">0{i + 1}</span>
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-white/55">{s.k}</span>
            </div>
            <div className="font-display text-lg md:text-2xl leading-[1.2] tracking-tight mb-2">{s.t}</div>
            <div className="text-xs text-white/50 leading-relaxed hidden md:block">{s.d}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function Page() {
  const [loaded, setLoaded] = useState(false)
  const scope = useRef(null)
  const genesisProgress = useRef(0)
  const ambient = useAmbient()

  useLayoutEffect(() => {
    if (!loaded) return
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-char', { yPercent: 120, rotateX: -60, opacity: 0 }, {
        yPercent: 0, rotateX: 0, opacity: 1, duration: 1.1, ease: 'expo.out', stagger: 0.025,
      })
      gsap.fromTo('.hero-sub', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'expo.out', delay: 0.5 })
      gsap.fromTo('.hero-meta', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'expo.out', delay: 0.8, stagger: 0.08 })

      gsap.to('.hero-title', {
        scale: 0.6, yPercent: -20, opacity: 0.15, filter: 'blur(4px)',
        scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('.hero-bg', {
        opacity: 0.25,
        scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('.hero-3d', {
        opacity: 0.15, scale: 1.2,
        scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
      })

      const idLines = gsap.utils.toArray('.identity-line')
      const idTl = gsap.timeline({
        scrollTrigger: { trigger: '#identity', start: 'top top', end: '+=2600', scrub: 0.8, pin: true }
      })
      idLines.forEach((line, i) => {
        idTl.fromTo(line, { clipPath: 'inset(0 100% 0 0)', opacity: 0.2 }, { clipPath: 'inset(0 0% 0 0)', opacity: 1, duration: 1, ease: 'power2.inOut' })
        if (i < idLines.length - 1) {
          idTl.to(line, { clipPath: 'inset(0 0 0 100%)', opacity: 0.1, duration: 1, ease: 'power2.inOut' }, '+=0.4')
        }
      })
      gsap.to('.identity-orb', {
        scale: 1.8, backgroundPosition: '100% 50%',
        scrollTrigger: { trigger: '#identity', start: 'top top', end: '+=2600', scrub: true }
      })

      gsap.utils.toArray('.bento').forEach((tile) => {
        gsap.fromTo(tile, { y: 60, opacity: 0 }, {
          y: 0, opacity: 1, duration: 1, ease: 'expo.out',
          scrollTrigger: { trigger: tile, start: 'top 85%', toggleActions: 'play none none reverse' }
        })
      })

      gsap.utils.toArray('.exp-row').forEach((row) => {
        gsap.fromTo(row, { opacity: 0.25, x: -20 }, {
          opacity: 1, x: 0, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: row, start: 'top 75%', end: 'top 40%', scrub: true }
        })
      })

      const track = document.querySelector('.proj-track')
      const isDesktop = window.matchMedia('(min-width: 768px)').matches
      if (track && isDesktop) {
        const totalX = track.scrollWidth - window.innerWidth
        gsap.to(track, {
          x: -totalX, ease: 'none',
          scrollTrigger: {
            trigger: '#projects', start: 'top top',
            end: () => `+=${totalX + 200}`,
            scrub: 1, pin: true, anticipatePin: 1,
          }
        })
      }

      gsap.fromTo('.dt-line', { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, stagger: 0.1, duration: 1, ease: 'expo.out',
        scrollTrigger: { trigger: '#deeptech', start: 'top 60%' }
      })

      // GENESIS — scroll-scrubbed image sequence (GSAP-pinned)
      const genesis = document.getElementById('genesis')
      if (genesis) {
        const setProgress = gsap.quickTo(genesisProgress, 'current', { duration: 0.35, ease: 'power3.out' })
        const PIN_DURATION = '+=3600'  // 4.5 viewport heights of scrub
        ScrollTrigger.create({
          trigger: genesis,
          start: 'top top',
          end: PIN_DURATION,
          scrub: true,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            setProgress(self.progress)
            const numEl = document.querySelector('.gn-progress-num')
            if (numEl) numEl.textContent = String(Math.round(self.progress * 100)).padStart(2, '0')
          },
        })
        // progress bar fill
        gsap.to('.gn-progress-bar', {
          scaleX: 1, ease: 'none',
          scrollTrigger: { trigger: genesis, start: 'top top', end: PIN_DURATION, scrub: true }
        })
        // phase panels highlight in their scroll window
        gsap.utils.toArray('.gn-panel').forEach((panel) => {
          const i = parseInt(panel.dataset.phase || '0', 10)
          const startPct = i * 25
          const peakPct = i * 25 + 10
          const fadeOutStart = (i + 1) * 25 - 4
          gsap.fromTo(panel,
            { opacity: 0.18, y: 24, filter: 'blur(2px)' },
            {
              opacity: 1, y: 0, filter: 'blur(0px)',
              scrollTrigger: {
                trigger: genesis,
                start: `top+=${startPct * 36} top`,
                end: `top+=${peakPct * 36} top`,
                scrub: true,
              }
            }
          )
          gsap.to(panel, {
            opacity: 0.22, y: -12, filter: 'blur(2px)',
            scrollTrigger: {
              trigger: genesis,
              start: `top+=${fadeOutStart * 36} top`,
              end: `top+=${(fadeOutStart + 6) * 36} top`,
              scrub: true,
            }
          })
        })
        // parallax floating labels
        gsap.utils.toArray('.gn-label').forEach((el) => {
          const speed = parseFloat(el.dataset.speed || '0.5')
          gsap.fromTo(el,
            { y: 80 * speed, opacity: 0.25 },
            {
              y: -80 * speed, opacity: 0.85, ease: 'none',
              scrollTrigger: { trigger: genesis, start: 'top top', end: PIN_DURATION, scrub: true }
            }
          )
        })
      }

      gsap.fromTo('.break-text', { scale: 0.85, opacity: 0 }, {
        scale: 1, opacity: 1,
        scrollTrigger: { trigger: '#break', start: 'top 80%', end: 'bottom top', scrub: true }
      })

      gsap.fromTo('.cta-char', { yPercent: 120 }, {
        yPercent: 0, stagger: 0.02, ease: 'expo.out', duration: 1,
        scrollTrigger: { trigger: '#cta', start: 'top 70%' }
      })

      // Global scroll → ambient volume scrub (only audible when user enables sound)
      ScrollTrigger.create({
        start: 0, end: 'max',
        onUpdate: (self) => ambient.setVolumeFromScroll(self.progress),
      })

      ScrollTrigger.refresh()
    }, scope)
    return () => ctx.revert()
  }, [loaded])

  return (
    <div ref={scope} className="relative">
      {!loaded && <Preloader onDone={() => setLoaded(true)} />}
      <Cursor />
      <AmbientToggle enabled={ambient.enabled} onToggle={ambient.enabled ? ambient.stop : ambient.start} />

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 mix-blend-difference">
        <div className="flex items-center justify-between px-6 md:px-10 py-5 text-[hsl(var(--bone))]">
          <a href="#hero" className="font-display text-base tracking-tight flex items-center">
            <span className="inline-block w-2 h-2 rounded-full bg-[hsl(var(--cyan))] mr-2" />
            aryan.k
          </a>
          <div className="hidden md:flex items-center gap-8 text-xs tracking-[0.2em] uppercase">
            <a href="#skills" className="hover:opacity-70 transition">Skills</a>
            <a href="#experience" className="hover:opacity-70 transition">Work</a>
            <a href="#projects" className="hover:opacity-70 transition">Projects</a>
            <a href="#cta" className="hover:opacity-70 transition">Contact</a>
          </div>
          <a href="#cta" className="text-xs tracking-[0.2em] uppercase flex items-center gap-2">
            Available · Q3 <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </a>
        </div>
      </nav>

      {/* SCENE 2 — HERO */}
      <section id="hero" className="relative h-screen w-full overflow-hidden grain">
        <div className="hero-bg absolute inset-0">
          <HeroCanvas />
        </div>
        {/* Three.js wireframe icosahedron + dust halo (mid layer) */}
        <div className="hero-3d absolute inset-0 z-[1]" style={{ mixBlendMode: 'multiply' }}>
          <Hero3D />
        </div>
        <div className="relative z-10 h-full flex flex-col justify-between px-6 md:px-10 pt-28 pb-12">
          <div className="hero-meta flex items-center justify-between text-xs tracking-[0.25em] uppercase text-ink-soft">
            <span>◉ Bengaluru / Remote</span>
            <span>Scroll to begin</span>
          </div>

          <div className="hero-title flex-1 flex items-center">
            <h1 className="font-display font-semibold leading-[0.82] text-[18vw] md:text-[14vw] tracking-[-0.04em] text-ink">
              <div className="overflow-hidden">
                <div className="flex flex-wrap">{splitChars('Aryan')}<span className="hero-char inline-block w-[0.3em]"> </span>{splitChars('Kapoor.')}</div>
              </div>
            </h1>
          </div>

          <div className="grid grid-cols-12 items-end gap-6">
            <div className="hero-sub col-span-12 md:col-span-5 text-ink-soft text-base md:text-lg max-w-md">
              AI engineer building production systems at the seam of <em className="font-serif-display italic">machine learning, backend and craft</em>.
            </div>
            <div className="hero-meta col-span-6 md:col-span-3 md:col-start-8 text-xs tracking-[0.2em] uppercase text-ink-soft">
              <div className="opacity-60 mb-1">Currently</div>
              <div>Retrieval & Eval infra</div>
            </div>
            <div className="hero-meta col-span-6 md:col-span-2 text-xs tracking-[0.2em] uppercase text-ink-soft text-right">
              <div className="opacity-60 mb-1">Index</div>
              <div>10 scenes</div>
            </div>
          </div>
        </div>
        <div className="hero-meta absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-ink-soft">
          <span>Scroll</span>
          <div className="w-px h-10 bg-[hsl(var(--ink))] animate-pulse" />
        </div>
      </section>

      {/* SCENE 3 — IDENTITY REVEAL */}
      <section id="identity" className="relative h-screen w-full bg-[hsl(var(--bone))] overflow-hidden">
        <div className="identity-orb absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full opacity-70 blur-3xl"
          style={{ background: 'linear-gradient(120deg, hsl(var(--electric)) 0%, hsl(var(--violet)) 50%, hsl(var(--cyan)) 100%)', backgroundSize: '200% 200%' }} />
        <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-16 max-w-[1400px] mx-auto">
          <div className="text-xs tracking-[0.3em] uppercase text-muted mb-8">— Identity</div>
          <div className="space-y-6 md:space-y-10 font-display text-5xl md:text-8xl leading-[0.95] tracking-[-0.03em]">
            <div className="identity-line">I build <span className="font-serif-display italic text-ink-soft">quiet</span> systems</div>
            <div className="identity-line">that think at <span className="gradient-text">scale</span>,</div>
            <div className="identity-line">learn from <span className="font-serif-display italic text-ink-soft">noise</span>,</div>
            <div className="identity-line">and <span className="underline decoration-[hsl(var(--electric))] decoration-4 underline-offset-8">ship to production</span>.</div>
          </div>
          <div className="mt-16 flex items-center gap-4 text-xs tracking-[0.25em] uppercase text-muted">
            <div className="w-12 h-px bg-[hsl(var(--line))]" />
            <span>Six years building. Two of shipping AI that matters.</span>
          </div>
        </div>
      </section>

      {/* SCENE 4 — SKILLS BENTO */}
      <section id="skills" className="relative bg-[hsl(var(--bone))] px-6 md:px-10 py-24 md:py-40">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-end justify-between mb-16">
            <div>
              <div className="text-xs tracking-[0.3em] uppercase text-muted mb-4">— 04 / Toolkit</div>
              <h2 className="font-display text-5xl md:text-7xl tracking-[-0.03em]">The <span className="font-serif-display italic">stack</span></h2>
            </div>
            <div className="hidden md:block text-sm text-muted max-w-sm">
              Not a laundry list. A working understanding of how these pieces fit — and when to leave them out.
            </div>
          </div>
          <div className="grid grid-cols-6 gap-4 md:gap-5 auto-rows-[minmax(160px,auto)]">
            <div className="bento col-span-6 md:col-span-4 md:row-span-2 rounded-3xl p-8 md:p-10 bg-[hsl(var(--ink))] text-[hsl(var(--bone))] relative overflow-hidden grain">
              <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full" style={{ background: 'radial-gradient(circle, hsl(var(--violet) / 0.8), transparent 60%)' }} />
              <div className="absolute right-10 bottom-10 w-56 h-56 rounded-full" style={{ background: 'radial-gradient(circle, hsl(var(--cyan) / 0.6), transparent 60%)' }} />
              <div className="relative">
                <div className="text-xs tracking-[0.25em] uppercase opacity-60 mb-3">AI / Machine Learning</div>
                <div className="font-display text-3xl md:text-5xl leading-[1.05] tracking-tight mb-8">
                  From notebook to <span className="font-serif-display italic">production-grade</span> intelligence.
                </div>
                <div className="flex flex-wrap gap-2">
                  {['PyTorch','TensorFlow','Transformers','LangGraph','Qdrant','Ray','ONNX','TensorRT','MLflow','W&B'].map(s => (
                    <span key={s} className="px-3 py-1.5 rounded-full border border-white/20 text-xs tracking-wide">{s}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bento col-span-6 md:col-span-2 rounded-3xl p-6 md:p-8 bg-white border border-line relative overflow-hidden">
              <div className="text-xs tracking-[0.25em] uppercase text-muted mb-3">Backend</div>
              <div className="font-display text-2xl md:text-3xl leading-tight tracking-tight mb-5">
                Quiet systems that handle <span className="gradient-text">scale</span>.
              </div>
              <div className="space-y-1.5 text-sm text-ink-soft">
                <div className="flex justify-between"><span>Python · FastAPI</span><span className="text-muted">8y</span></div>
                <div className="flex justify-between"><span>Node.js · NestJS</span><span className="text-muted">6y</span></div>
                <div className="flex justify-between"><span>Go · gRPC</span><span className="text-muted">4y</span></div>
                <div className="flex justify-between"><span>Postgres · Redis</span><span className="text-muted">7y</span></div>
                <div className="flex justify-between"><span>Kafka · NATS</span><span className="text-muted">3y</span></div>
              </div>
            </div>

            <div className="bento col-span-3 md:col-span-2 rounded-3xl p-6 md:p-8 bg-[hsl(var(--paper))] relative overflow-hidden">
              <div className="text-xs tracking-[0.25em] uppercase text-muted mb-3">Data Science</div>
              <div className="font-display text-xl md:text-2xl leading-tight tracking-tight mb-4">
                Noise → <span className="font-serif-display italic">signal</span>.
              </div>
              <div className="flex flex-wrap gap-1.5">
                {['Pandas','Polars','dbt','Spark','DuckDB','Airflow'].map(s => (
                  <span key={s} className="px-2.5 py-1 rounded-full bg-white border border-line text-xs">{s}</span>
                ))}
              </div>
            </div>

            <div className="bento col-span-3 md:col-span-2 rounded-3xl p-6 md:p-8 relative overflow-hidden" style={{ background: 'linear-gradient(140deg, #F6F2EA, #EDE6D6)' }}>
              <div className="text-xs tracking-[0.25em] uppercase text-muted mb-3">Frontend</div>
              <div className="font-display text-xl md:text-2xl leading-tight tracking-tight mb-4">
                Interfaces that <span className="font-serif-display italic">breathe</span>.
              </div>
              <div className="flex flex-wrap gap-1.5">
                {['Next.js','React','Tailwind','GSAP','Three.js','Framer Motion'].map(s => (
                  <span key={s} className="px-2.5 py-1 rounded-full bg-white/70 backdrop-blur border border-line text-xs">{s}</span>
                ))}
              </div>
            </div>

            <div className="bento col-span-6 md:col-span-2 rounded-3xl p-6 md:p-8 glass-dark text-[hsl(var(--bone))] relative overflow-hidden">
              <div className="text-xs tracking-[0.25em] uppercase opacity-60 mb-3">Currently shipped</div>
              <div className="grid grid-cols-2 gap-6">
                <div><div className="font-display text-5xl tabular-nums">20M</div><div className="text-xs opacity-70">daily ranked requests</div></div>
                <div><div className="font-display text-5xl tabular-nums">42<span className="text-xl">ms</span></div><div className="text-xs opacity-70">p99 API latency</div></div>
                <div><div className="font-display text-5xl tabular-nums">99.2<span className="text-xl">%</span></div><div className="text-xs opacity-70">recall on defect ML</div></div>
                <div><div className="font-display text-5xl tabular-nums">12</div><div className="text-xs opacity-70">systems in production</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SCENE 5 — EXPERIENCE TIMELINE */}
      <section id="experience" className="relative bg-[hsl(var(--bone))] px-6 md:px-10 py-24 md:py-40 border-t border-line">
        <div className="max-w-[1400px] mx-auto grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-4 md:sticky md:top-28 md:self-start">
            <div className="text-xs tracking-[0.3em] uppercase text-muted mb-4">— 05 / Trajectory</div>
            <h2 className="font-display text-5xl md:text-7xl tracking-[-0.03em] leading-[0.95]">Six<br/><span className="font-serif-display italic">years.</span><br/>Four chapters.</h2>
            <p className="mt-6 text-muted text-sm max-w-xs">Each role taught me one thing: most problems are <em className="font-serif-display italic">not</em> model problems.</p>
          </div>
          <div className="col-span-12 md:col-span-8 md:col-start-5">
            <div className="relative border-l border-line">
              {EXPERIENCES.map((e, i) => (
                <div key={i} className="exp-row pl-8 md:pl-12 pb-16 relative">
                  <div className="absolute left-0 top-2 -translate-x-1/2 w-3 h-3 rounded-full bg-[hsl(var(--ink))] border-4 border-[hsl(var(--bone))]" />
                  <div className="text-xs tracking-[0.25em] uppercase text-muted mb-2">{e.year}</div>
                  <div className="font-display text-3xl md:text-4xl tracking-[-0.02em] mb-1">{e.role}</div>
                  <div className="text-ink-soft mb-3">{e.company}</div>
                  <p className="text-muted max-w-xl leading-relaxed">{e.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Marquee break */}
      <section className="bg-[hsl(var(--ink))] text-[hsl(var(--bone))] py-6 overflow-hidden border-y border-white/10">
        <div className="flex whitespace-nowrap marquee font-display text-5xl md:text-7xl tracking-[-0.03em]">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex items-center gap-12 pr-12">
              <span>Python</span><span className="text-[hsl(var(--cyan))]">✦</span>
              <span className="font-serif-display italic opacity-70">Machine Learning</span><span>✦</span>
              <span>Node.js</span><span className="text-[hsl(var(--violet))]">✦</span>
              <span className="font-serif-display italic opacity-70">Retrieval Systems</span><span>✦</span>
              <span>Go</span><span className="text-[hsl(var(--cyan))]">✦</span>
              <span className="font-serif-display italic opacity-70">Data Infra</span><span>✦</span>
              <span>Next.js</span><span className="text-[hsl(var(--violet))]">✦</span>
            </div>
          ))}
        </div>
      </section>

      {/* SCENE 6 — PROJECTS horizontal (desktop only) */}
      <section id="projects" className="relative h-screen w-full overflow-hidden bg-[hsl(var(--bone))] hidden md:block">
        <div className="absolute top-0 left-0 right-0 px-6 md:px-10 pt-10 z-20 flex items-end justify-between mix-blend-difference text-[hsl(var(--bone))]">
          <div>
            <div className="text-xs tracking-[0.3em] uppercase opacity-70 mb-2">— 06 / Case studies</div>
            <h2 className="font-display text-4xl md:text-6xl tracking-[-0.03em]">Selected <span className="font-serif-display italic">work.</span></h2>
          </div>
          <div className="text-xs tracking-[0.25em] uppercase opacity-70 hidden md:block">Scroll ←→</div>
        </div>
        <div className="proj-track absolute top-0 left-0 h-full flex items-center will-change-transform" style={{ paddingLeft: '6vw', paddingRight: '6vw' }}>
          {PROJECTS.map((p, i) => (
            <article key={i} className="proj-card relative shrink-0 w-[88vw] md:w-[72vw] h-[78vh] mr-6 md:mr-10 rounded-[28px] overflow-hidden bg-white border border-line flex flex-col md:flex-row">
              <div className="relative md:w-[55%] h-56 md:h-full overflow-hidden bg-[hsl(var(--paper))]">
                <img src={p.img} alt={p.title} className="proj-img absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(79,70,229,0.18), rgba(6,182,212,0.10))' }} />
                <div className="absolute top-6 left-6 text-white">
                  <div className="font-display text-7xl tabular-nums leading-none drop-shadow-lg">{p.num}</div>
                  <div className="text-xs tracking-[0.25em] uppercase mt-2 opacity-90">{p.tag}</div>
                </div>
              </div>
              <div className="md:w-[45%] p-8 md:p-12 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-3xl md:text-5xl leading-[1.05] tracking-[-0.02em] mb-8">{p.title}</h3>
                  <div className="space-y-5">
                    <div>
                      <div className="text-[10px] tracking-[0.3em] uppercase text-muted mb-1">Problem</div>
                      <p className="text-ink-soft leading-relaxed">{p.problem}</p>
                    </div>
                    <div>
                      <div className="text-[10px] tracking-[0.3em] uppercase text-muted mb-1">Approach</div>
                      <p className="text-ink-soft leading-relaxed">{p.solution}</p>
                    </div>
                    <div>
                      <div className="text-[10px] tracking-[0.3em] uppercase text-muted mb-1">Impact</div>
                      <p className="font-display text-xl tracking-tight text-ink">{p.impact}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-6 border-t border-line mt-6">
                  {p.stack.map(s => (
                    <span key={s} className="px-2.5 py-1 rounded-full bg-[hsl(var(--paper))] text-xs">{s}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
          <div className="shrink-0 w-[50vw] h-[78vh] flex items-center">
            <div className="px-10">
              <div className="text-xs tracking-[0.3em] uppercase text-muted mb-3">End of reel</div>
              <div className="font-display text-4xl md:text-6xl tracking-[-0.03em]">More, <span className="font-serif-display italic">on request.</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* SCENE 6 — PROJECTS vertical stack (mobile only) */}
      <section id="projects-mobile" className="md:hidden relative bg-[hsl(var(--bone))] px-5 py-20">
        <div className="mb-10">
          <div className="text-[10px] tracking-[0.3em] uppercase text-muted mb-2">— 06 / Case studies</div>
          <h2 className="font-display text-4xl tracking-[-0.03em]">Selected <span className="font-serif-display italic">work.</span></h2>
        </div>
        <div className="space-y-6">
          {PROJECTS.map((p, i) => (
            <article key={i} className="proj-m-card relative rounded-2xl overflow-hidden bg-white border border-line">
              <div className="relative h-48 overflow-hidden bg-[hsl(var(--paper))]">
                <img src={p.img} alt={p.title} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(79,70,229,0.20), rgba(6,182,212,0.10))' }} />
                <div className="absolute top-4 left-4 text-white">
                  <div className="font-display text-4xl tabular-nums leading-none drop-shadow-lg">{p.num}</div>
                  <div className="text-[9px] tracking-[0.25em] uppercase mt-1 opacity-90">{p.tag}</div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-display text-2xl leading-[1.1] tracking-[-0.02em] mb-5">{p.title}</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <div className="text-[9px] tracking-[0.3em] uppercase text-muted mb-1">Problem</div>
                    <p className="text-ink-soft leading-relaxed">{p.problem}</p>
                  </div>
                  <div>
                    <div className="text-[9px] tracking-[0.3em] uppercase text-muted mb-1">Approach</div>
                    <p className="text-ink-soft leading-relaxed">{p.solution}</p>
                  </div>
                  <div>
                    <div className="text-[9px] tracking-[0.3em] uppercase text-muted mb-1">Impact</div>
                    <p className="font-display text-base tracking-tight text-ink">{p.impact}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-5 border-t border-line mt-5">
                  {p.stack.map(s => (
                    <span key={s} className="px-2 py-0.5 rounded-full bg-[hsl(var(--paper))] text-[10px]">{s}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* SCENE 6.5 — GENESIS (scroll-scrubbed canvas sequence) */}
      <Genesis progressRef={genesisProgress} />

      {/* SCENE 7 — DEEP TECH */}
      <section id="deeptech" className="relative bg-[hsl(var(--ink))] text-[hsl(var(--bone))] overflow-hidden">
        <div className="absolute inset-0 opacity-90"><NeuralCanvas /></div>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 0%, hsl(var(--ink)) 80%)' }} />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 py-32 md:py-44">
          <div className="text-xs tracking-[0.3em] uppercase opacity-60 mb-8 dt-line">— 07 / Under the hood</div>
          <h2 className="font-display text-5xl md:text-8xl tracking-[-0.04em] leading-[0.9] max-w-5xl">
            <span className="dt-line block">I don&apos;t ship demos.</span>
            <span className="dt-line block">I ship <span className="font-serif-display italic opacity-80">pipelines,</span></span>
            <span className="dt-line block">evals, <span className="gradient-text">retries,</span></span>
            <span className="dt-line block">and the boring plumbing</span>
            <span className="dt-line block">that keeps <span className="font-serif-display italic">intelligence</span> alive at 3am.</span>
          </h2>
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 dt-line">
            {[
              { k: 'Retrieval', v: 'hybrid · rerank · cache' },
              { k: 'Serving', v: 'KV reuse · batching · gpu' },
              { k: 'Eval', v: 'golden · LLM-judge · traces' },
              { k: 'Ops', v: 'SLOs · drift · rollback' },
            ].map(b => (
              <div key={b.k} className="border-t border-white/15 pt-4">
                <div className="text-xs tracking-[0.25em] uppercase opacity-60 mb-1">{b.k}</div>
                <div className="text-sm">{b.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SCENE 8 — BREAK */}
      <section id="break" className="relative bg-[hsl(var(--bone))] px-6 md:px-10 py-40 md:py-56 flex items-center justify-center">
        <div className="text-center max-w-5xl">
          <div className="break-text font-serif-display italic text-ink text-6xl md:text-[9vw] leading-[0.95] tracking-[-0.02em]">
            Code is craft.
          </div>
          <div className="mt-6 text-xs tracking-[0.3em] uppercase text-muted">— a short pause —</div>
        </div>
      </section>

      {/* SCENE 9 — CTA */}
      <section id="cta" className="relative bg-[hsl(var(--ink))] text-[hsl(var(--bone))] overflow-hidden grain">
        <div className="absolute inset-0 mesh-bg opacity-50" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 py-32 md:py-52">
          <div className="text-xs tracking-[0.3em] uppercase opacity-60 mb-8">— 09 / The invitation</div>
          <h2 className="font-display text-6xl md:text-[11vw] tracking-[-0.04em] leading-[0.88]">
            <div className="overflow-hidden"><div>{'Let’s build'.split('').map((c,i)=>(<span key={i} className="char cta-char inline-block">{c===' '?'\u00A0':c}</span>))}</div></div>
            <div className="overflow-hidden"><div>{'something'.split('').map((c,i)=>(<span key={i} className="char cta-char inline-block">{c===' '?'\u00A0':c}</span>))}</div></div>
            <div className="overflow-hidden"><div className="font-serif-display italic opacity-90">{'worth shipping.'.split('').map((c,i)=>(<span key={i} className="char cta-char inline-block">{c===' '?'\u00A0':c}</span>))}</div></div>
          </h2>

          <div className="mt-16 flex flex-col md:flex-row items-start md:items-center gap-8">
            <Magnetic>
              <a href="mailto:aryan@example.com" className="group inline-flex items-center gap-4 pl-8 pr-6 py-6 rounded-full bg-[hsl(var(--bone))] text-[hsl(var(--ink))] font-display text-xl md:text-2xl tracking-tight hover:bg-white transition">
                <Mail className="w-5 h-5" />
                aryan@example.com
                <span className="w-12 h-12 rounded-full bg-[hsl(var(--ink))] text-[hsl(var(--bone))] flex items-center justify-center group-hover:rotate-45 transition-transform">
                  <ArrowUpRight className="w-5 h-5" />
                </span>
              </a>
            </Magnetic>
            <div className="text-sm opacity-70 max-w-xs">
              Contract · full-time · advisory. I respond within 24h. Usually with a plan attached.
            </div>
          </div>

          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
            {[
              { k: 'Open to', v: 'AI platform · infra · 0→1' },
              { k: 'Base', v: 'Bengaluru · GMT+5:30' },
              { k: 'Remote', v: 'fully distributed' },
              { k: 'Rate', v: 'on request' },
            ].map(b => (
              <div key={b.k} className="border-t border-white/15 pt-4">
                <div className="text-[10px] tracking-[0.3em] uppercase opacity-60 mb-1">{b.k}</div>
                <div>{b.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SCENE 10 — FOOTER */}
      <footer className="relative bg-[hsl(var(--ink))] text-[hsl(var(--bone))] px-6 md:px-10 py-10 border-t border-white/10">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="w-2 h-2 rounded-full bg-[hsl(var(--cyan))] animate-pulse" />
            <span className="font-display text-lg">aryan.k</span>
            <span className="text-xs opacity-60 tracking-[0.2em] uppercase">© 2026 — all systems nominal</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            {[
              { icon: Github, label: 'Github', href: '#' },
              { icon: Linkedin, label: 'LinkedIn', href: '#' },
              { icon: Twitter, label: 'X', href: '#' },
              { icon: Mail, label: 'Email', href: 'mailto:aryan@example.com' },
            ].map(({ icon: Icon, label, href }) => (
              <a key={label} href={href} className="group inline-flex items-center gap-2 hover:text-[hsl(var(--cyan))] transition">
                <Icon className="w-4 h-4" />
                <span className="relative">
                  {label}
                  <span className="absolute left-0 -bottom-0.5 w-0 h-px bg-[hsl(var(--cyan))] group-hover:w-full transition-all" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
