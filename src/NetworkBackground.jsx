import { useEffect, useRef } from 'react'

// Živé pozadie: uzly sa pomaly pohybujú a blízke uzly sa spoja linkou.
// Po linkách putujú pakety vo farbách káblov, kurzor je ďalší uzol siete
// a kliknutie do prázdneho miesta vyšle dávku paketov z okolitých uzlov.
// Pri scrollovaní sa sieť posúva do hĺbky a „zahustí sa prevádzka“.

const CABLE_VARIABLES = ['--orange', '--green', '--blue', '--brown']
const LINK_DISTANCE = 150
const POINTER_DISTANCE = 200
const PACKET_SPEED = 120 // px za sekundu

function NetworkBackground({ animate, dark }) {
  const canvasRef = useRef(null)
  const animateRef = useRef(animate)
  const startRef = useRef(null)
  const refreshColorsRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    // Farby sa čítajú z CSS premenných, aby sedeli so svetlým aj tmavým režimom.
    const palette = { ink: '', colors: [], linkAlpha: 0.3 }

    function readPalette() {
      const rootStyles = getComputedStyle(document.documentElement)
      palette.ink = rootStyles.getPropertyValue('--ink').trim()
      palette.colors = CABLE_VARIABLES.map((name) =>
        rootStyles.getPropertyValue(name).trim(),
      )
      palette.linkAlpha = document.documentElement.dataset.theme === 'dark' ? 0.22 : 0.3
    }

    readPalette()

    let width = 0
    let height = 0
    let nodes = []
    let packets = []
    let ripples = []
    let animationFrame = 0
    let lastTime = performance.now()
    let spawnTimer = 0
    // 0 až 1: ako veľmi sa práve scrolluje. Zvyšuje počet a rýchlosť paketov.
    let traffic = 0
    const pointer = { x: 0, y: 0, active: false }

    function createNodes() {
      const count = Math.round(Math.min(120, Math.max(36, (width * height) / 12500)))

      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.5) * 14,
        radius: Math.random() < 0.2 ? 4 : 2.5,
        // Ako rýchlo sa uzol posúva pri scrollovaní: vytvára dojem hĺbky.
        depth: 0.2 + Math.random() * 0.45,
        colorIndex: Math.floor(Math.random() * CABLE_VARIABLES.length),
      }))
      packets = []
    }

    function resize() {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
      // Na mobile sa výška mení pri skrývaní lišty prehliadača, vtedy sieť nechávame.
      const widthChanged = window.innerWidth !== width
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * pixelRatio
      canvas.height = height * pixelRatio
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      if (widthChanged) {
        createNodes()
      }
      draw()
    }

    function distance(a, b) {
      return Math.hypot(a.x - b.x, a.y - b.y)
    }

    function sendPacket(from, to) {
      packets.push({ from, to, progress: 0, length: distance(from, to) })
    }

    function spawnRandomPacket() {
      const from = nodes[Math.floor(Math.random() * nodes.length)]
      const neighbours = nodes.filter(
        (node) => node !== from && distance(node, from) < LINK_DISTANCE,
      )

      if (neighbours.length > 0) {
        sendPacket(from, neighbours[Math.floor(Math.random() * neighbours.length)])
      }
    }

    function update(seconds) {
      for (const node of nodes) {
        if (pointer.active) {
          const dx = node.x - pointer.x
          const dy = node.y - pointer.y
          const pointerDistance = Math.hypot(dx, dy)

          // Uzly blízko kurzora jemne uhnú nabok.
          if (pointerDistance < 110 && pointerDistance > 0) {
            const push = ((110 - pointerDistance) / 110) * 60 * seconds
            node.x += (dx / pointerDistance) * push
            node.y += (dy / pointerDistance) * push
          }
        }

        node.x += node.vx * seconds
        node.y += node.vy * seconds

        if (node.x < -20) node.x = width + 20
        if (node.x > width + 20) node.x = -20
        if (node.y < -20) node.y = height + 20
        if (node.y > height + 20) node.y = -20
      }

      traffic = Math.max(0, traffic - seconds * 0.7)

      spawnTimer -= seconds
      if (spawnTimer <= 0) {
        spawnRandomPacket()
        spawnTimer = (0.25 + Math.random() * 0.35) / (1 + traffic * 8)
      }

      const speed = PACKET_SPEED * (1 + traffic * 1.5)
      packets = packets.filter((packet) => {
        packet.length = distance(packet.from, packet.to)
        packet.progress += (speed * seconds) / Math.max(packet.length, 1)
        return packet.progress < 1 && packet.length < LINK_DISTANCE * 1.6
      })

      ripples = ripples.filter((ripple) => {
        ripple.age += seconds
        return ripple.age < 0.9
      })
    }

    function draw() {
      context.clearRect(0, 0, width, height)
      const color = (node) => palette.colors[node.colorIndex]
      const linkAlpha = palette.linkAlpha * (1 + traffic * 0.9)
      context.lineWidth = 1
      context.strokeStyle = palette.ink

      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const linkDistance = distance(nodes[i], nodes[j])

          if (linkDistance < LINK_DISTANCE) {
            context.globalAlpha = (1 - linkDistance / LINK_DISTANCE) * linkAlpha
            context.beginPath()
            context.moveTo(nodes[i].x, nodes[i].y)
            context.lineTo(nodes[j].x, nodes[j].y)
            context.stroke()
          }
        }
      }

      if (pointer.active) {
        context.lineWidth = 1.5

        for (const node of nodes) {
          const pointerDistance = distance(node, pointer)

          if (pointerDistance < POINTER_DISTANCE) {
            context.globalAlpha = (1 - pointerDistance / POINTER_DISTANCE) * 0.75
            context.strokeStyle = color(node)
            context.beginPath()
            context.moveTo(pointer.x, pointer.y)
            context.lineTo(node.x, node.y)
            context.stroke()
          }
        }
      }

      for (const node of nodes) {
        const near = pointer.active && distance(node, pointer) < POINTER_DISTANCE
        context.globalAlpha = near ? 1 : 0.7
        context.fillStyle = color(node)
        context.beginPath()
        context.arc(node.x, node.y, near ? node.radius + 1 : node.radius, 0, Math.PI * 2)
        context.fill()
      }

      context.globalAlpha = 1
      for (const packet of packets) {
        const x = packet.from.x + (packet.to.x - packet.from.x) * packet.progress
        const y = packet.from.y + (packet.to.y - packet.from.y) * packet.progress
        context.fillStyle = color(packet.from)
        context.save()
        context.translate(x, y)
        context.rotate(Math.PI / 4)
        context.fillRect(-3, -3, 6, 6)
        context.restore()
      }

      context.strokeStyle = palette.ink
      context.lineWidth = 1.5
      for (const ripple of ripples) {
        context.globalAlpha = (1 - ripple.age / 0.9) * 0.45
        context.beginPath()
        context.arc(ripple.x, ripple.y, 12 + ripple.age * 180, 0, Math.PI * 2)
        context.stroke()
      }

      context.globalAlpha = 1
    }

    function loop(time) {
      const seconds = Math.min((time - lastTime) / 1000, 0.05)
      lastTime = time
      update(seconds)
      draw()
      animationFrame = requestAnimationFrame(loop)
    }

    function start() {
      cancelAnimationFrame(animationFrame)

      if (!animateRef.current || document.hidden) {
        draw()
        return
      }

      lastTime = performance.now()
      animationFrame = requestAnimationFrame(loop)
    }

    function handlePointerMove(event) {
      pointer.x = event.clientX
      pointer.y = event.clientY
      pointer.active = event.pointerType === 'mouse'
    }

    let lastScroll = window.scrollY

    // Sieť sa pri scrollovaní posúva pomalšie ako obsah (paralaxa).
    function handleScroll() {
      const delta = window.scrollY - lastScroll
      lastScroll = window.scrollY

      if (!animateRef.current) {
        return
      }

      const step = Math.max(-80, Math.min(80, delta))
      for (const node of nodes) {
        node.y -= step * node.depth
      }
      traffic = Math.min(1, traffic + Math.abs(step) / 300)
    }

    function handlePointerLeave() {
      pointer.active = false
    }

    function handlePointerDown(event) {
      if (!animateRef.current) {
        return
      }

      // Kliky na odkazy, tlačidlá a texty nechávame tak.
      if (event.target.closest('a, button, input, textarea, p, h1, h2, h3, dd, dt, img, .tag')) {
        return
      }

      const origin = { x: event.clientX, y: event.clientY }
      const nearby = nodes
        .filter((node) => distance(node, origin) < POINTER_DISTANCE * 1.2)
        .sort((a, b) => distance(a, origin) - distance(b, origin))

      ripples.push({ ...origin, age: 0 })

      for (const from of nearby.slice(0, 6)) {
        for (const to of nodes) {
          if (to !== from && distance(to, from) < LINK_DISTANCE) {
            sendPacket(from, to)
          }
        }
      }
    }

    resize()
    start()
    startRef.current = start
    refreshColorsRef.current = () => {
      readPalette()
      draw()
    }

    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('scroll', handleScroll, { passive: true })
    document.documentElement.addEventListener('pointerleave', handlePointerLeave)
    document.addEventListener('visibilitychange', start)

    return () => {
      cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('scroll', handleScroll)
      document.documentElement.removeEventListener('pointerleave', handlePointerLeave)
      document.removeEventListener('visibilitychange', start)
    }
  }, [])

  // Prepínač animácií na stránke: zastaví alebo znovu spustí pohyb siete.
  useEffect(() => {
    animateRef.current = animate
    startRef.current?.()
  }, [animate])

  // Prepnutie tmavého režimu: načítať nové farby z CSS.
  useEffect(() => {
    refreshColorsRef.current?.()
  }, [dark])

  return <canvas ref={canvasRef} className="network-background" aria-hidden="true" />
}

export default NetworkBackground
