<script setup lang="ts">
// High-quality original goggle-creature mascot (built in Three.js, studio-lit).
// Expressive: blinks, emotes (happy / surprised / curious), tracks the cursor,
// and lip-syncs its mouth to the AI's live voice (useInterview().mouth).
const props = withDefaults(defineProps<{
  state?: 'idle' | 'listening' | 'speaking'
  dark?: boolean
}>(), { state: 'idle', dark: true })

const { mouth } = useInterview()
const el = ref<HTMLCanvasElement | null>(null)
const failed = ref(false)
let cleanup: (() => void) | null = null

onMounted(async () => {
  if (!el.value) return
  try {
    const THREE = await import('three')
    const { RoomEnvironment } = await import('three/addons/environments/RoomEnvironment.js')

    const canvas = el.value
    const parent = canvas.parentElement as HTMLElement
    const size = () => ({ w: parent.clientWidth || 300, h: parent.clientHeight || 300 })

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15

    const scene = new THREE.Scene()
    const pmrem = new THREE.PMREMGenerator(renderer)
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.035).texture

    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100)
    camera.position.set(0, 0.15, 5.4)
    camera.lookAt(0, -0.05, 0)

    const key = new THREE.DirectionalLight(0xffffff, 1.8); key.position.set(2.5, 4, 4); scene.add(key)
    const rim = new THREE.DirectionalLight(0xffd9a8, 0.9); rim.position.set(-3, 1, -2); scene.add(rim)

    const disp: any[] = []
    const G = (g: any) => { disp.push(g); return g }
    const MAT = (o: any) => { const m = new THREE.MeshStandardMaterial(o); disp.push(m); return m }
    const GLASS = (o: any) => { const m = new THREE.MeshPhysicalMaterial(o); disp.push(m); return m }

    const YELLOW = 0xFFC531, DARK = 0x27272b, DENIM = 0x384766, METAL = 0xb9bec6, GLOVE = 0x3a3a40

    const char = new THREE.Group(); scene.add(char)

    // Body — smooth capsule
    const body = new THREE.Mesh(G(new THREE.CapsuleGeometry(0.72, 1.0, 12, 48)), MAT({ color: YELLOW, roughness: 0.42, metalness: 0.0, envMapIntensity: 0.9 }))
    char.add(body)

    // Overalls
    const overalls = new THREE.Mesh(G(new THREE.CylinderGeometry(0.78, 0.7, 0.72, 48, 1, true)), MAT({ color: DENIM, roughness: 0.75, side: THREE.DoubleSide, envMapIntensity: 0.6 }))
    overalls.position.y = -0.62; char.add(overalls)
    const pocket = new THREE.Mesh(G(new THREE.BoxGeometry(0.34, 0.26, 0.05)), MAT({ color: DENIM, roughness: 0.75 }))
    pocket.position.set(0, -0.55, 0.73); char.add(pocket)
    for (const sx of [-1, 1]) {
      const strapO = new THREE.Mesh(G(new THREE.BoxGeometry(0.1, 0.5, 0.05)), MAT({ color: DENIM, roughness: 0.75 }))
      strapO.position.set(sx * 0.3, -0.1, 0.72); strapO.rotation.z = sx * 0.12; char.add(strapO)
    }

    // Goggle + eye
    const eye = new THREE.Group(); eye.position.set(0, 0.5, 0.56); char.add(eye)
    const strap = new THREE.Mesh(G(new THREE.TorusGeometry(0.74, 0.06, 16, 48)), MAT({ color: DARK, roughness: 0.5 }))
    strap.position.set(0, -0.1, -0.5); strap.rotation.x = Math.PI / 2; char.add(strap)
    const goggle = new THREE.Mesh(G(new THREE.TorusGeometry(0.4, 0.11, 24, 48)), MAT({ color: METAL, roughness: 0.28, metalness: 0.9, envMapIntensity: 1.2 }))
    eye.add(goggle)
    const sclera = new THREE.Mesh(G(new THREE.SphereGeometry(0.37, 40, 40)), MAT({ color: 0xf3f3f0, roughness: 0.25 }))
    sclera.position.z = -0.04; eye.add(sclera)
    const iris = new THREE.Mesh(G(new THREE.SphereGeometry(0.16, 32, 32)), MAT({ color: 0x6b4326, roughness: 0.35 }))
    iris.position.z = 0.24; eye.add(iris)
    const pupil = new THREE.Mesh(G(new THREE.SphereGeometry(0.085, 24, 24)), MAT({ color: 0x0a0a0a, roughness: 0.4 }))
    pupil.position.z = 0.34; eye.add(pupil)
    const glint = new THREE.Mesh(G(new THREE.SphereGeometry(0.035, 16, 16)), MAT({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.7 }))
    glint.position.set(0.07, 0.07, 0.37); eye.add(glint)
    const glass = new THREE.Mesh(G(new THREE.SphereGeometry(0.4, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2.1)), GLASS({ transmission: 0.9, roughness: 0.1, thickness: 0.2, transparent: true, opacity: 0.25, color: 0xffffff }))
    glass.rotation.x = -Math.PI / 2; glass.position.z = 0.12; eye.add(glass)
    // eyelids (blink + emotion)
    const lidGeoU = G(new THREE.SphereGeometry(0.4, 40, 24, 0, Math.PI * 2, 0, Math.PI / 2))
    const lidMat = MAT({ color: YELLOW, roughness: 0.42 })
    const upperLid = new THREE.Mesh(lidGeoU, lidMat); upperLid.position.z = -0.04; eye.add(upperLid)
    const lowerLid = new THREE.Mesh(G(new THREE.SphereGeometry(0.4, 40, 24, 0, Math.PI * 2, 0, Math.PI / 2)), lidMat)
    lowerLid.rotation.x = Math.PI; lowerLid.position.z = -0.04; eye.add(lowerLid)
    // brow
    const brow = new THREE.Mesh(G(new THREE.BoxGeometry(0.5, 0.06, 0.1)), MAT({ color: DARK, roughness: 0.6 }))
    brow.position.set(0, 0.5, 0.9); char.add(brow)

    // Mouth
    const mouthMesh = new THREE.Mesh(G(new THREE.SphereGeometry(0.16, 24, 20)), MAT({ color: 0x3a1f16, roughness: 0.5 }))
    mouthMesh.position.set(0, -0.02, 0.72); mouthMesh.scale.set(1.3, 0.25, 0.5); char.add(mouthMesh)

    // Arms
    const armMat = MAT({ color: YELLOW, roughness: 0.42 }), gloveMat = MAT({ color: GLOVE, roughness: 0.55 })
    const mkArm = (sx: number) => {
      const g = new THREE.Group()
      const arm = new THREE.Mesh(G(new THREE.CapsuleGeometry(0.13, 0.36, 8, 20)), armMat); arm.position.y = -0.2; g.add(arm)
      const hand = new THREE.Mesh(G(new THREE.SphereGeometry(0.16, 24, 24)), gloveMat); hand.position.y = -0.44; g.add(hand)
      g.position.set(sx * 0.72, -0.32, 0.18); g.rotation.z = sx * 0.32; char.add(g); return g
    }
    const armL = mkArm(-1), armR = mkArm(1)

    // Legs + feet
    const legMat = MAT({ color: DENIM, roughness: 0.75 }), footMat = MAT({ color: DARK, roughness: 0.5 })
    for (const sx of [-1, 1]) {
      const leg = new THREE.Mesh(G(new THREE.CapsuleGeometry(0.15, 0.22, 6, 16)), legMat); leg.position.set(sx * 0.28, -1.12, 0); char.add(leg)
      const foot = new THREE.Mesh(G(new THREE.SphereGeometry(0.19, 20, 20)), footMat); foot.scale.set(1, 0.65, 1.35); foot.position.set(sx * 0.28, -1.32, 0.08); char.add(foot)
    }

    // Hair
    const hairMat = MAT({ color: DARK, roughness: 0.6 })
    for (const dx of [-0.16, -0.05, 0.06, 0.17]) {
      const h = new THREE.Mesh(G(new THREE.CapsuleGeometry(0.016, 0.18, 3, 6)), hairMat)
      h.position.set(dx, 1.12, -0.02); h.rotation.z = dx * 1.6; char.add(h)
    }

    char.position.y = 0.2

    const resize = () => { const { w, h } = size(); renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix() }
    resize(); const ro = new ResizeObserver(resize); ro.observe(parent)

    const target = { x: 0, y: 0 }
    const onMove = (e: PointerEvent) => { target.x = (e.clientX / window.innerWidth - 0.5) * 2; target.y = (e.clientY / window.innerHeight - 0.5) * 2 }
    window.addEventListener('pointermove', onMove, { passive: true })

    // --- expression state machine ---
    type Emo = 'neutral' | 'happy' | 'surprised' | 'curious'
    let emo: Emo = 'neutral', emoUntil = 0, nextEmo = 2 + Math.random() * 3

    let raf = 0, t = 0, blink = 2, lip = 0
    const rot = { x: 0, y: 0 }
    const cur = { lidU: 0, lidL: 0, browY: 0, browR: 0, eyeS: 1, smile: 0 }
    const animate = () => {
      t += 0.016
      const st = props.state

      // pick idle emotions occasionally
      if (st === 'listening') emo = 'curious'
      else if (st === 'speaking') emo = 'neutral'
      else {
        if (t > nextEmo) { emo = Math.random() < 0.6 ? 'happy' : 'surprised'; emoUntil = t + 1.1 + Math.random() * 0.8; nextEmo = t + 4 + Math.random() * 4 }
        if (emo !== 'neutral' && t > emoUntil) emo = 'neutral'
      }

      // emotion targets
      let tLidU = 0, tLidL = 0, tBrowY = 0, tBrowR = 0, tEyeS = 1, tSmile = st === 'speaking' ? 0.2 : 0.35
      if (emo === 'happy') { tLidL = 0.5; tSmile = 0.9; tBrowY = 0.05 }
      else if (emo === 'surprised') { tEyeS = 1.18; tLidU = -0.15; tBrowY = 0.14; tSmile = 0.1 }
      else if (emo === 'curious') { tBrowR = 0.18; tBrowY = 0.08; tSmile = 0.45 }

      // blink
      blink += 0.016; let bl = 0
      if (blink > 3.2) { const p = (blink - 3.2) / 0.13; if (p < 1) bl = Math.sin(p * Math.PI); else blink = 0 }

      // ease
      cur.lidU += (Math.max(tLidU, bl) - cur.lidU) * 0.3
      cur.lidL += (Math.max(tLidL, bl) - cur.lidL) * 0.3
      cur.browY += (tBrowY - cur.browY) * 0.12
      cur.browR += (tBrowR - cur.browR) * 0.12
      cur.eyeS += (tEyeS - cur.eyeS) * 0.12
      cur.smile += (tSmile - cur.smile) * 0.12

      // eyelids: scale the hemisphere caps down over the eye (0 = open, 1 = closed)
      upperLid.scale.set(1, Math.max(0.001, cur.lidU), 1)
      lowerLid.scale.set(1, Math.max(0.001, cur.lidL), 1)
      sclera.scale.setScalar(cur.eyeS)
      brow.position.y = 0.92 + cur.browY
      brow.rotation.z = cur.browR

      // head / body follow cursor
      rot.y += ((target.x * 0.4) - rot.y) * 0.05
      rot.x += ((-target.y * 0.2) - rot.x) * 0.05
      char.rotation.y = rot.y; char.rotation.x = rot.x
      char.rotation.z = Math.sin(t * 0.7) * 0.03

      // eye look
      const ex = target.x * 0.1, ey = -target.y * 0.08
      iris.position.set(ex, ey, 0.24); pupil.position.set(ex, ey, 0.34); glint.position.set(0.07 + ex, 0.07 + ey, 0.37)

      // bounce (squash & stretch when speaking)
      const bs = st === 'speaking' ? 5.2 : st === 'listening' ? 2.4 : 1.5
      const ba = st === 'speaking' ? 0.09 : st === 'listening' ? 0.05 : 0.035
      const bounce = Math.sin(t * bs)
      char.position.y = 0.2 + bounce * ba
      body.scale.set(1 - bounce * 0.03, 1 + bounce * 0.04, 1 - bounce * 0.03)

      // lip-sync
      let m = mouth.value
      if (st === 'speaking' && m < 0.04) m = 0.15 + Math.abs(Math.sin(t * 11)) * 0.55
      lip += (m - lip) * 0.5
      mouthMesh.scale.set(1.3 - cur.smile * 0.2, 0.22 + lip * 0.9, 0.5)
      mouthMesh.position.y = -0.02 - lip * 0.06 + cur.smile * 0.02
      mouthMesh.rotation.z = 0 // keep neutral; smile widens via scale.x

      // arm wiggle
      const wig = st === 'speaking' ? 0.55 : st === 'listening' ? 0.22 : 0.06
      armL.rotation.z = 0.32 + Math.sin(t * bs) * wig
      armR.rotation.z = -0.32 - Math.sin(t * bs) * wig

      renderer.render(scene, camera)
      raf = requestAnimationFrame(animate)
    }
    animate()

    cleanup = () => {
      cancelAnimationFrame(raf); window.removeEventListener('pointermove', onMove)
      ro.disconnect(); pmrem.dispose(); renderer.dispose(); disp.forEach((d) => d.dispose?.())
    }
  } catch (e) {
    console.error('[mascot] failed', e); failed.value = true
  }
})

onBeforeUnmount(() => cleanup?.())
</script>

<template>
  <canvas v-show="!failed" ref="el" class="mascot-canvas"></canvas>
  <div v-if="failed" class="mascot-fallback">🟡</div>
</template>

<style scoped>
.mascot-fallback { width: 100%; height: 100%; display: grid; place-items: center; font-size: 2.2rem; }
</style>
