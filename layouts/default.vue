<script setup lang="ts">
const { isLight, toggle, init } = useTheme()
const menuOpen = ref(false)
const showTop = ref(false)

const links = [
  { to: '/', label: 'home' },
  { to: '/work', label: 'work' },
  { to: '/experience', label: 'experience' },
  { to: '/writing', label: 'writing' },
  { to: '/contact', label: 'contact' }
]

const onScroll = () => { showTop.value = window.scrollY > 300 }
onMounted(() => { init(); window.addEventListener('scroll', onScroll, { passive: true }) })
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

const closeMenu = () => { menuOpen.value = false; document.body.style.overflow = '' }
const toggleMenu = () => { menuOpen.value = !menuOpen.value; document.body.style.overflow = menuOpen.value ? 'hidden' : '' }
const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
</script>

<template>
  <div>
    <div class="background-canvas"><div class="background-canvas-glows"></div></div>

    <div class="container">
      <div class="sidebar">
        <nav class="nav">
          <NuxtLink v-for="l in links" :key="l.to" :to="l.to" class="nav-link" active-class="active">{{ l.label }}</NuxtLink>
        </nav>
      </div>

      <main class="content">
        <slot />
      </main>

      <button class="mobile-menu-btn" @click="toggleMenu">{{ menuOpen ? '// CLOSE' : '// MENU' }}</button>
      <div class="mobile-menu-overlay" :class="{ active: menuOpen }">
        <NuxtLink v-for="(l, i) in links" :key="l.to" :to="l.to" class="mobile-nav-link" :style="{ transitionDelay: (i + 1) * 0.08 + 's' }" @click="closeMenu">{{ l.label }}</NuxtLink>
      </div>
    </div>

    <button id="scroll-to-top" class="scroll-to-top" :class="{ active: showTop }" aria-label="Scroll to top" @click="toTop">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
    </button>

    <button id="theme-toggle" class="theme-toggle" aria-label="Toggle theme" @click="toggle">
      <svg v-if="!isLight" class="sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
      <svg v-else class="moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
      <span class="theme-toggle-text">{{ isLight ? 'Light' : 'Dark' }}</span>
    </button>

    <a href="https://wa.me/917697793284" target="_blank" rel="noopener" class="cta-btn cta-lets-talk" aria-label="Let's Talk">
      <div class="cta-icon"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg></div>
      <span class="cta-text">Let's Talk</span>
    </a>
    <a href="mailto:avanish.patidar07@gmail.com" class="cta-btn cta-hire-me" aria-label="Hire Me">
      <div class="cta-icon"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/></svg></div>
      <span class="cta-text">Hire Me</span>
    </a>

    <ClientOnly><AiDock /></ClientOnly>
  </div>
</template>
