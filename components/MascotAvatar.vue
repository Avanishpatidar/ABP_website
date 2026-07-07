<script setup lang="ts">
// Cute, high-quality original goggle-creature mascot (Three.js, studio-lit).
// Two expressive eyes that blink + track the cursor, rosy cheeks, and a mouth
// that lip-syncs to the AI's live voice (useInterview().mouth). Original design.
const props = withDefaults(defineProps<{
  state?: 'idle' | 'listening' | 'speaking'
  dark?: boolean
}>(), { state: 'idle', dark: true })

const { mouth } = useInterview()
const el = ref<HTMLCanvasElement | null>(null)
const failed = ref(false)
let cleanup: (() => void) | null = null

const isBananaJumping = ref(false)
let jumpStartTime = 0

const handleMascotClick = () => {
  if (isBananaJumping.value) return
  isBananaJumping.value = true
  jumpStartTime = Date.now()

  try {
    const utterance = new SpeechSynthesisUtterance("banana!")
    utterance.pitch = 2.0
    utterance.rate = 1.5
    const voices = window.speechSynthesis.getVoices()
    const preferred = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Female')))
    if (preferred) utterance.voice = preferred
    window.speechSynthesis.speak(utterance)
  } catch (e) {
    console.error('Speech synthesis failed:', e)
  }

  setTimeout(() => {
    isBananaJumping.value = false
  }, 800)
}

onMounted(async () => {
  if (!el.value) return
  try {
    const THREE = await import('three')
    const { RoomEnvironment } = await import('three/addons/environments/RoomEnvironment.js')

    const canvas = el.value
    const parent = canvas.parentElement as HTMLElement
    const size = () => ({ w: parent.clientWidth || 300, h: parent.clientHeight || 300 })

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2

    const scene = new THREE.Scene()
    const pmrem = new THREE.PMREMGenerator(renderer)
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.03).texture

    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100)
    camera.position.set(0, 0.1, 5.2)
    camera.lookAt(0, -0.02, 0)

    const key = new THREE.DirectionalLight(0xffffff, 1.7); key.position.set(2.5, 4, 4); scene.add(key)
    const rim = new THREE.DirectionalLight(0xffe0b0, 1.0); rim.position.set(-3, 1.5, -2); scene.add(rim)
    const fill = new THREE.DirectionalLight(0xfff6e8, 0.5); fill.position.set(0, -2, 3); scene.add(fill)

    const disp: any[] = []
    const G = (g: any) => { disp.push(g); return g }
    const MAT = (o: any) => { const m = new THREE.MeshStandardMaterial(o); disp.push(m); return m }

    const YELLOW = 0xFFD23F, DENIM = 0x4E77BE, DENIM_D = 0x3c5c95, METAL = 0xd2d6db, DARK = 0x2a2a30, GLOVE = 0x323238, IRIS = 0x6b4324, CHEEK = 0xff8a6a

    const char = new THREE.Group(); scene.add(char)

    // Chubby round body
    const body = new THREE.Mesh(G(new THREE.CapsuleGeometry(0.82, 0.55, 16, 56)), MAT({ color: YELLOW, roughness: 0.4, envMapIntensity: 0.9 }))
    char.add(body)

    // Overalls
    const overalls = new THREE.Mesh(G(new THREE.CylinderGeometry(0.9, 0.82, 0.72, 56, 1, true)), MAT({ color: DENIM, roughness: 0.72, side: THREE.DoubleSide, envMapIntensity: 0.6 }))
    overalls.position.y = -0.6; char.add(overalls)
    const pocket = new THREE.Mesh(G(new THREE.BoxGeometry(0.4, 0.3, 0.05)), MAT({ color: DENIM_D, roughness: 0.72 }))
    pocket.position.set(0, -0.55, 0.84); char.add(pocket)
    for (const sx of [-1, 1]) {
      const strap = new THREE.Mesh(G(new THREE.BoxGeometry(0.11, 0.55, 0.05)), MAT({ color: DENIM, roughness: 0.72 }))
      strap.position.set(sx * 0.34, -0.05, 0.82); strap.rotation.z = sx * 0.13; char.add(strap)
      const btn = new THREE.Mesh(G(new THREE.CylinderGeometry(0.05, 0.05, 0.03, 16)), MAT({ color: METAL, roughness: 0.4, metalness: 0.7 }))
      btn.rotation.x = Math.PI / 2; btn.position.set(sx * 0.34, -0.28, 0.86); char.add(btn)
    }

    // Goggle bridge
    const bridge = new THREE.Mesh(G(new THREE.CylinderGeometry(0.05, 0.05, 0.34, 16)), MAT({ color: METAL, roughness: 0.3, metalness: 0.9 }))
    bridge.rotation.z = Math.PI / 2; bridge.position.set(0, 0.5, 0.74); char.add(bridge)
    const strapBand = new THREE.Mesh(G(new THREE.TorusGeometry(0.84, 0.055, 16, 56)), MAT({ color: DARK, roughness: 0.5 }))
    strapBand.position.set(0, 0.44, -0.35); strapBand.rotation.x = Math.PI / 2; char.add(strapBand)

    // --- two eyes ---
    const eyes: any[] = []
    const mkEye = (sx: number) => {
      const g = new THREE.Group(); g.position.set(sx * 0.36, 0.5, 0.5); char.add(g)
      const ring = new THREE.Mesh(G(new THREE.TorusGeometry(0.32, 0.085, 20, 40)), MAT({ color: METAL, roughness: 0.28, metalness: 0.9, envMapIntensity: 1.2 }))
      g.add(ring)
      const sclera = new THREE.Mesh(G(new THREE.SphereGeometry(0.3, 36, 36)), MAT({ color: 0xf5f4f0, roughness: 0.22 }))
      sclera.position.z = -0.03; g.add(sclera)
      const iris = new THREE.Mesh(G(new THREE.SphereGeometry(0.135, 28, 28)), MAT({ color: IRIS, roughness: 0.35 }))
      iris.position.z = 0.2; g.add(iris)
      const pupil = new THREE.Mesh(G(new THREE.SphereGeometry(0.075, 20, 20)), MAT({ color: 0x0a0a0a }))
      pupil.position.z = 0.28; g.add(pupil)
      const glint = new THREE.Mesh(G(new THREE.SphereGeometry(0.03, 12, 12)), MAT({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.7 }))
      glint.position.set(0.06, 0.06, 0.31); g.add(glint)
      const lidMat = MAT({ color: YELLOW, roughness: 0.4 })
      const upper = new THREE.Mesh(G(new THREE.SphereGeometry(0.33, 36, 20, 0, Math.PI * 2, 0, Math.PI / 2)), lidMat); upper.position.z = -0.03; g.add(upper)
      const lower = new THREE.Mesh(G(new THREE.SphereGeometry(0.33, 36, 20, 0, Math.PI * 2, 0, Math.PI / 2)), lidMat); lower.rotation.x = Math.PI; lower.position.z = -0.03; g.add(lower)
      upper.scale.y = 0.001; lower.scale.y = 0.001
      eyes.push({ iris, pupil, glint, upper, lower, sclera })
    }
    mkEye(-1); mkEye(1)

    // rosy cheeks
    for (const sx of [-1, 1]) {
      const cheek = new THREE.Mesh(G(new THREE.SphereGeometry(0.15, 20, 20)), MAT({ color: CHEEK, roughness: 0.6, transparent: true, opacity: 0.55 }))
      cheek.scale.set(1.2, 0.8, 0.4); cheek.position.set(sx * 0.55, 0.12, 0.66); char.add(cheek)
    }

    // Mouth (cute — smiles, opens for lip-sync)
    const mouthMesh = new THREE.Mesh(G(new THREE.SphereGeometry(0.15, 28, 22)), MAT({ color: 0x3a1d14, roughness: 0.5 }))
    mouthMesh.position.set(0, 0.02, 0.82); mouthMesh.scale.set(1.4, 0.28, 0.5); char.add(mouthMesh)

    // Arms
    const armMat = MAT({ color: YELLOW, roughness: 0.4 }), gloveMat = MAT({ color: GLOVE, roughness: 0.55 })
    const mkArm = (sx: number) => {
      const g = new THREE.Group()
      const arm = new THREE.Mesh(G(new THREE.CapsuleGeometry(0.15, 0.3, 8, 20)), armMat); arm.position.y = -0.18; g.add(arm)
      const hand = new THREE.Mesh(G(new THREE.SphereGeometry(0.17, 24, 24)), gloveMat); hand.position.y = -0.4; g.add(hand)
      g.position.set(sx * 0.84, -0.3, 0.2); g.rotation.z = sx * 0.35; char.add(g); return g
    }
    const armL = mkArm(-1), armR = mkArm(1)

    // Feet
    const footMat = MAT({ color: DARK, roughness: 0.5 })
    for (const sx of [-1, 1]) {
      const foot = new THREE.Mesh(G(new THREE.SphereGeometry(0.2, 22, 22)), footMat)
      foot.scale.set(1, 0.6, 1.4); foot.position.set(sx * 0.34, -1.12, 0.1); char.add(foot)
    }

    // Hair
    const hairMat = MAT({ color: DARK, roughness: 0.6 })
    for (const dx of [-0.14, 0, 0.14]) {
      const h = new THREE.Mesh(G(new THREE.CapsuleGeometry(0.016, 0.16, 3, 6)), hairMat)
      h.position.set(dx, 1.18, -0.02); h.rotation.z = dx * 1.8; char.add(h)
    }

    char.position.y = 0.24

    const resize = () => { const { w, h } = size(); renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix() }
    resize(); const ro = new ResizeObserver(resize); ro.observe(parent)

    // Only render while on-screen and the tab is visible (saves CPU/battery).
    let onScreen = true
    const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting }, { threshold: 0.01 })
    io.observe(parent)

    const target = { x: 0, y: 0 }
    const onMove = (e: PointerEvent) => { target.x = (e.clientX / window.innerWidth - 0.5) * 2; target.y = (e.clientY / window.innerHeight - 0.5) * 2 }
    window.addEventListener('pointermove', onMove, { passive: true })

    type Emo = 'neutral' | 'happy' | 'surprised' | 'curious'
    let emo: Emo = 'neutral', emoUntil = 0, nextEmo = 2 + Math.random() * 3
    let raf = 0, t = 0, blink = 2, lip = 0
    const rot = { x: 0, y: 0 }
    const cur = { lidU: 0, lidL: 0, smile: 0, eyeS: 1 }

    const animate = () => {
      raf = requestAnimationFrame(animate)
      if (!onScreen || document.hidden) return // pause GPU work when not visible
      t += 0.016
      const st = props.state

      // Handle custom jump / click animation
      let isJumping = isBananaJumping.value
      let jumpTime = isJumping ? (Date.now() - jumpStartTime) / 800 : 0 // normalized 0..1

      if (isJumping) emo = 'happy'
      else if (st === 'listening') emo = 'curious'
      else if (st === 'speaking') emo = 'neutral'
      else {
        if (t > nextEmo) { emo = Math.random() < 0.65 ? 'happy' : 'surprised'; emoUntil = t + 1.2 + Math.random() * 0.9; nextEmo = t + 4 + Math.random() * 4 }
        if (emo !== 'neutral' && t > emoUntil) emo = 'neutral'
      }

      let tLidU = 0, tLidL = 0, tSmile = st === 'speaking' ? 0.25 : 0.4, tEyeS = 1
      if (emo === 'happy' || isJumping) { tLidL = 0.75; tLidU = 0.75; tSmile = 1; } // Squint happily
      else if (emo === 'surprised') { tEyeS = 1.16; tSmile = 0.1 }
      else if (emo === 'curious') { tSmile = 0.5 }

      blink += 0.016; let bl = 0
      if (!isJumping && blink > 3.2) { const p = (blink - 3.2) / 0.13; if (p < 1) bl = Math.sin(p * Math.PI); else blink = 0 }

      cur.lidU += (Math.max(tLidU, bl) - cur.lidU) * 0.3
      cur.lidL += (Math.max(tLidL, bl) - cur.lidL) * 0.3
      cur.smile += (tSmile - cur.smile) * 0.12
      cur.eyeS += (tEyeS - cur.eyeS) * 0.12

      // head follow + look directly if speaking/jumping
      let targetX = target.x
      let targetY = target.y
      if (st === 'speaking' || isJumping) {
        targetX = 0
        targetY = 0
      }
      rot.y += ((targetX * 0.36) - rot.y) * 0.05
      rot.x += ((-targetY * 0.18) - rot.x) * 0.05
      char.rotation.y = rot.y; char.rotation.x = rot.x

      // Wobble spin during banana jump
      if (isJumping) {
        char.rotation.z = Math.sin(jumpTime * Math.PI * 2) * 0.2
      } else {
        char.rotation.z = Math.sin(t * 0.7) * 0.025
      }

      // Jump and bounce
      const bs = st === 'speaking' ? 5 : st === 'listening' ? 2.3 : 1.5
      const ba = st === 'speaking' ? 0.08 : st === 'listening' ? 0.045 : 0.03
      const bounce = Math.sin(t * bs)
      
      let jumpY = 0
      if (isJumping) {
        // Parabole curve for jump height
        jumpY = Math.sin(jumpTime * Math.PI) * 0.6
      }
      char.position.y = 0.24 + bounce * ba + jumpY

      if (isJumping) {
        // Stretch/squash on jump
        body.scale.set(0.9, 1.15, 0.9)
      } else {
        body.scale.set(1 - bounce * 0.025, 1 + bounce * 0.03, 1 - bounce * 0.025)
      }

      const ex = targetX * 0.09, ey = -targetY * 0.07
      for (const e of eyes) {
        e.iris.position.set(ex, ey, 0.2); e.pupil.position.set(ex, ey, 0.28); e.glint.position.set(0.06 + ex, 0.06 + ey, 0.31)
        e.upper.scale.y = Math.max(0.001, cur.lidU); e.lower.scale.y = Math.max(0.001, cur.lidL)
        e.sclera.scale.setScalar(cur.eyeS)
      }

      // Mouth opening logic
      let m = mouth.value
      if (isJumping) {
        m = 0.9 // Open mouth wide for banana scream!
      } else if (st === 'speaking' && m < 0.04) {
        m = 0.15 + Math.abs(Math.sin(t * 11)) * 0.55
      }
      lip += (m - lip) * 0.5
      mouthMesh.scale.set(1.4 + cur.smile * 0.5, 0.22 + lip * 0.9, 0.5)
      mouthMesh.position.y = 0.02 - lip * 0.05

      // Arms logic
      const wig = st === 'speaking' ? 0.5 : st === 'listening' ? 0.08 : 0.05
      if (isJumping) {
        // Arms raise up celebrating
        armL.rotation.z = 2.6
        armR.rotation.z = -2.6
      } else if (st === 'listening') {
        // Hands on ears listening
        armL.rotation.z = 2.4 + Math.sin(t * 2) * wig
        armL.rotation.x = -0.3
        armR.rotation.z = -2.4 - Math.sin(t * 2) * wig
        armR.rotation.x = -0.3
      } else if (st === 'speaking') {
        // Gesturing while speaking
        armL.rotation.z = 0.8 + Math.sin(t * bs) * wig
        armR.rotation.z = -0.8 - Math.sin(t * bs) * wig
        armL.rotation.x = 0
        armR.rotation.x = 0
      } else {
        // Idle hanging arms
        armL.rotation.z = 0.35 + Math.sin(t * bs) * wig
        armR.rotation.z = -0.35 - Math.sin(t * bs) * wig
        armL.rotation.x = 0
        armR.rotation.x = 0
      }

      renderer.render(scene, camera)
    }
    animate()

    cleanup = () => {
      cancelAnimationFrame(raf); window.removeEventListener('pointermove', onMove)
      ro.disconnect(); io.disconnect(); pmrem.dispose(); renderer.dispose(); disp.forEach((d) => d.dispose?.())
    }
  } catch (e) {
    console.error('[mascot] failed', e); failed.value = true
  }
})

onBeforeUnmount(() => cleanup?.())
</script>

<template>
  <canvas v-show="!failed" ref="el" class="mascot-canvas" @click="handleMascotClick"></canvas>
  <div v-if="failed" class="mascot-fallback">🟡</div>
</template>

<style scoped>
.mascot-fallback { width: 100%; height: 100%; display: grid; place-items: center; font-size: 2.2rem; }
</style>
