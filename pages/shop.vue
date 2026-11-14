<script setup lang="ts">
import { kits, kitUrl, kitPrice, rpApps, RP_PROFILE, SHOP_URL, markdownFor, SITE_URL } from '~/data/site'
usePageSeo('/shop')
useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: kits.map((k, i) => ({
        '@type': 'ListItem', position: i + 1,
        item: {
          '@type': 'Product', name: k.title, description: k.text, image: SITE_URL + k.img, url: kitUrl(k),
          brand: { '@type': 'Brand', name: 'Avanish Patidar' },
          offers: { '@type': 'Offer', price: k.price.toFixed(2), priceCurrency: 'USD', availability: 'https://schema.org/InStock', url: kitUrl(k) }
        }
      }))
    })
  }]
})
</script>

<template>
  <ModeView :md="markdownFor('/shop')">
    <h1>Shop</h1>
    <p>
      Kits for people building AI products, made from what I learned shipping HiringAnt. Everything is a download you
      keep. Start with the free checklist if you are not sure.
    </p>

    <div class="kits">
      <div v-for="(k, i) in kits" :key="k.id" class="kit">
        <a :href="kitUrl(k)" target="_blank" rel="noopener" class="kit-link" :aria-label="`${k.short}, ${kitPrice(k)}, on Gumroad`"></a>
        <img :src="k.img" :alt="k.title" width="900" height="506" :loading="i < 2 ? 'eager' : 'lazy'" />
        <span class="kit-body">
          <span class="kit-top">
            <strong>{{ k.short }}</strong>
            <span class="kit-price" :class="{ free: k.price === 0 }">{{ kitPrice(k) }}</span>
          </span>
          <span v-if="k.badge" class="kit-badge">{{ k.badge }}</span>
          <span class="kit-text">{{ k.text }}</span>
          <a v-if="k.rp" :href="k.rp" target="_blank" rel="noopener" class="kit-alt">Or buy with Joules on RentPrompts</a>
        </span>
      </div>
    </div>

    <h2>AI apps on RentPrompts</h2>
    <p>
      Apps I built and published on <a :href="RP_PROFILE" target="_blank" rel="noopener">RentPrompts</a>. Anyone can run
      them; each run costs a few Joules, RentPrompts' credits.
    </p>
    <div class="kits">
      <a v-for="a in rpApps" :key="a.url" :href="a.url" target="_blank" rel="noopener" class="kit kit-plain">
        <img :src="a.img" :alt="a.name" width="900" height="506" loading="lazy" />
        <span class="kit-body">
          <span class="kit-top"><strong>{{ a.name }}</strong></span>
          <span class="kit-badge">{{ a.cost }}</span>
          <span class="kit-text">{{ a.text }}</span>
        </span>
      </a>
    </div>

    <p class="small muted" style="margin-top: 22px">
      Kits are sold through Gumroad at <a :href="SHOP_URL" target="_blank" rel="noopener">shop.avanishpatidar.in</a>; apps run on <a :href="RP_PROFILE" target="_blank" rel="noopener">RentPrompts</a>.
    </p>
  </ModeView>
</template>
