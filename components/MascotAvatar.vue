<script setup lang="ts">
// A friendly Minion-style character mascot (original, built procedurally in
// Three.js — no external/copyrighted model). Idles + bobs, tracks the cursor
// with its eye, blinks, and "talks" (mouth + bounce) when speaking.
const props = withDefaults(defineProps<{
  state?: 'idle' | 'listening' | 'speaking'
  dark?: boolean
}>(), { state: 'idle', dark: true })

const el = ref<HTMLCanvasElement | null>(null)
let cleanup: (() => void) | null = null

onMounted(async () => {
  if (!el.value) return
  const THREE = await import('three')
  const canvas = el.value
  const parent = canvas.parentElement as HTMLElement
  const size = () => ({ w: parent.clientWidth || 300, h: parent.clientHeight || 300 })

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100)
  camera.position.set(0, 0.1, 4.6)
  camera.lookAt(0, -0.05, 0)

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  const disposables: any[] = []
  const mat = (opts: any) => { const m = new THREE.MeshStandardMaterial(opts); disposables.push(m); return m }
  const geo = (g: any) => { disposables.push(g); return g }

  const YELLOW = 0xFFC24B
  const DARK = 0x2b2b30
  const DENIM = 0x3a4568
  const METAL = 0x9aa0a8

  const char = new THREE.Group(); scene.add(char)

  // Body (capsule)
  const body = new THREE.Mesh(geo(new THREE.CapsuleGeometry(0.62, 0.95, 6, 24)), mat({ color: YELLOW, roughness: 0.55, metalness: 0.05 }))
  char.add(body)

  // Overalls band (lower)
  const overalls = new THREE.Mesh(geo(new THREE.CylinderGeometry(0.66, 0.6, 0.62, 24, 1, true)), mat({ color: DENIM, roughness: 0.7, side: THREE.DoubleSide }))
  overalls.position.y = -0.55; char.add(overalls)
  const pocket = new THREE.Mesh(geo(new THREE.BoxGeometry(0.28, 0.22, 0.04)), mat({ color: DENIM, roughness: 0.7 }))
  pocket.position.set(0, -0.5, 0.62); char.add(pocket)

  // Goggle strap
  const strap = new THREE.Mesh(geo(new THREE.TorusGeometry(0.64, 0.055, 12, 32)), mat({ color: DARK, roughness: 0.6 }))
  strap.position.y = 0.4; strap.rotation.x = Math.PI / 2; char.add(strap)

  // Goggle ring + eye
  const eyeGroup = new THREE.Group(); eyeGroup.position.set(0, 0.4, 0.5); char.add(eyeGroup)
  const goggle = new THREE.Mesh(geo(new THREE.TorusGeometry(0.34, 0.1, 16, 32)), mat({ color: METAL, roughness: 0.35, metalness: 0.7 }))
  eyeGroup.add(goggle)
  const eyeball = new THREE.Mesh(geo(new THREE.SphereGeometry(0.3, 24, 24)), mat({ color: 0xf5f5f5, roughness: 0.3 }))
  eyeball.position.z = -0.02; eyeGroup.add(eyeball)
  const iris = new THREE.Mesh(geo(new THREE.SphereGeometry(0.13, 20, 20)), mat({ color: 0x5a3a24, roughness: 0.3 }))
  iris.position.set(0, 0, 0.22); eyeGroup.add(iris)
  const pupil = new THREE.Mesh(geo(new THREE.SphereGeometry(0.06, 16, 16)), mat({ color: 0x111111 }))
  pupil.position.set(0, 0, 0.32); eyeGroup.add(pupil)
  const glint = new THREE.Mesh(geo(new THREE.SphereGeometry(0.03, 12, 12)), mat({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.6 }))
  glint.position.set(0.06, 0.06, 0.35); eyeGroup.add(glint)
  // eyelid (for blink) — a yellow cap that scales down to reveal the eye
  const lid = new THREE.Mesh(geo(new THREE.SphereGeometry(0.31, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2)), mat({ color: YELLOW, roughness: 0.55 }))
  lid.position.z = -0.02; eyeGroup.add(lid)

  // Mouth
  const mouth = new THREE.Mesh(geo(new THREE.CapsuleGeometry(0.05, 0.18, 4, 12)), mat({ color: 0x3a2418, roughness: 0.5 }))
  mouth.rotation.z = Math.PI / 2; mouth.position.set(0, -0.02, 0.62); char.add(mouth)

  // Arms
  const armMat = mat({ color: YELLOW, roughness: 0.55 })
  const handMat = mat({ color: DARK, roughness: 0.6 })
  const mkArm = (side: number) => {
    const g = new THREE.Group()
    const arm = new THREE.Mesh(geo(new THREE.CapsuleGeometry(0.12, 0.34, 4, 12)), armMat)
    arm.position.y = -0.18; g.add(arm)
    const hand = new THREE.Mesh(geo(new THREE.SphereGeometry(0.14, 16, 16)), handMat)
    hand.position.y = -0.4; g.add(hand)
    g.position.set(side * 0.66, -0.35, 0.15); g.rotation.z = side * 0.35
    char.add(g); return g
  }
  const armL = mkArm(-1), armR = mkArm(1)

  // Legs + feet
  const legMat = mat({ color: DENIM, roughness: 0.7 })
  const footMat = mat({ color: DARK, roughness: 0.6 })
  const mkLeg = (side: number) => {
    const leg = new THREE.Mesh(geo(new THREE.CapsuleGeometry(0.14, 0.2, 4, 12)), legMat)
    leg.position.set(side * 0.26, -1.02, 0); char.add(leg)
    const foot = new THREE.Mesh(geo(new THREE.SphereGeometry(0.17, 16, 16)), footMat)
    foot.scale.set(1, 0.7, 1.3); foot.position.set(side * 0.26, -1.2, 0.06); char.add(foot)
  }
  mkLeg(-1); mkLeg(1)

  // Hair sprouts
  const hairMat = mat({ color: DARK, roughness: 0.6 })
  for (const dx of [-0.12, 0, 0.12]) {
    const h = new THREE.Mesh(geo(new THREE.CapsuleGeometry(0.018, 0.16, 3, 6)), hairMat)
    h.position.set(dx, 1.02, 0); h.rotation.z = dx * 1.5; char.add(h)
  }

  // Lights
  const key = new THREE.DirectionalLight(0xffffff, 2.4); key.position.set(2.5, 3.5, 4); scene.add(key)
  const rim = new THREE.DirectionalLight(0xffd9a0, 1.0); rim.position.set(-3, -1, -2); scene.add(rim)
  scene.add(new THREE.AmbientLight(0xffffff, 0.55))

  char.position.y = 0.15

  const resize = () => {
    const { w, h } = size(); renderer.setSize(w, h, false)
    camera.aspect = w / h; camera.updateProjectionMatrix()
  }
  resize()
  const ro = new ResizeObserver(resize); ro.observe(parent)

  const target = { x: 0, y: 0 }
  const onMove = (e: PointerEvent) => {
    target.x = (e.clientX / window.innerWidth - 0.5) * 2
    target.y = (e.clientY / window.innerHeight - 0.5) * 2
  }
  window.addEventListener('pointermove', onMove, { passive: true })

  let raf = 0, t = 0, blink = 0
  const rot = { x: 0, y: 0 }
  const animate = () => {
    t += 0.016
    const st = props.state
    const speed = st === 'speaking' ? 5 : st === 'listening' ? 2.4 : 1.4
    const amp = st === 'speaking' ? 0.1 : st === 'listening' ? 0.05 : 0.035

    // bob + sway
    char.position.y = 0.15 + Math.sin(t * speed) * amp
    char.rotation.z = Math.sin(t * 0.7) * 0.03

    // look toward cursor
    rot.y += ((target.x * 0.5) - rot.y) * 0.06
    rot.x += ((target.y * 0.3) - rot.x) * 0.06
    char.rotation.y = rot.y
    // iris follows within the goggle
    iris.position.x = pupil.position.x = target.x * 0.08
    iris.position.y = pupil.position.y = -target.y * 0.06
    glint.position.x = 0.06 + target.x * 0.08
    glint.position.y = 0.06 - target.y * 0.06

    // blink every ~3.6s
    blink += 0.016
    let lidScale = 0.001
    if (blink > 3.6) { const p = (blink - 3.6) / 0.16; if (p < 1) lidScale = Math.sin(p * Math.PI) * 1; else blink = 0 }
    lid.scale.y = 0.001 + lidScale

    // mouth: talk when speaking, small otherwise
    if (st === 'speaking') mouth.scale.set(1, 0.6 + Math.abs(Math.sin(t * 12)) * 1.4, 1)
    else mouth.scale.set(1, st === 'listening' ? 0.8 : 0.5, 1)

    // arm wiggle when live
    const wig = st === 'speaking' ? 0.5 : st === 'listening' ? 0.2 : 0.06
    armL.rotation.z = 0.35 + Math.sin(t * speed) * wig
    armR.rotation.z = -0.35 - Math.sin(t * speed) * wig

    renderer.render(scene, camera)
    raf = requestAnimationFrame(animate)
  }
  animate()

  cleanup = () => {
    cancelAnimationFrame(raf)
    window.removeEventListener('pointermove', onMove)
    ro.disconnect()
    disposables.forEach((d) => d.dispose?.())
    renderer.dispose()
  }
})

onBeforeUnmount(() => cleanup?.())
</script>

<template>
  <canvas ref="el" class="mascot-canvas"></canvas>
</template>
