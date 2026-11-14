<script setup lang="ts">
import { kits, kitUrl, kitPrice, SHOP_URL, markdownFor, SITE_URL } from '~/data/site'
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
      <a v-for="(k, i) in kits" :key="k.id" :href="kitUrl(k)" target="_blank" rel="noopener" class="kit">
        <img :src="k.img" :alt="k.title" width="900" height="506" :loading="i < 2 ? 'eager' : 'lazy'" />
        <span class="kit-body">
          <span class="kit-top">
            <strong>{{ k.short }}</strong>
            <span class="kit-price" :class="{ free: k.price === 0 }">{{ kitPrice(k) }}</span>
          </span>
          <span v-if="k.badge" class="kit-badge">{{ k.badge }}</span>
          <span class="kit-text">{{ k.text }}</span>
        </span>
      </a>
    </div>

    <p class="small muted" style="margin-top: 22px">
      Payments and downloads are handled by Gumroad at <a :href="SHOP_URL" target="_blank" rel="noopener">shop.avanishpatidar.in</a>.
    </p>
  </ModeView>
</template>
