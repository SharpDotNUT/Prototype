<script setup>
import { ref, onMounted } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { useMainStore } from './stores/main'
import AppBar from '@/components/app-bar.vue'
import { useI18n } from 'vue-i18n'
const locale = useI18n().locale
const mainStore = useMainStore()
const route = useRoute()
const router = useRouter()
const loading = ref(false)

router.beforeEach(async () => {
  loading.value = true
  return true
})
router.afterEach(() => {
  loading.value = false
})

onMounted(() => {
  const lang = route.query.lang || 'request'
  if (lang !== 'request') {
    locale.value = lang
  }
})
</script>

<template>
  <div id="app">
    <div id="app-bar">
      <AppBar />
    </div>
    <var-loading :loading="loading" type="wave">
      <div
        id="content"
        class="elevation-12"
        :style="{ opacity: loading ? 0 : 1 }">
        <RouterView />
      </div>
      <template #description>
        {{ $t('global.loading') }}
      </template>
    </var-loading>
  </div>
</template>

<style>
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}
</style>

<style scoped>
#app {
  height: 100dvh;
}
#content {
  box-shadow: 0 0 10px var(--color-body);
  height: calc(100dvh - var(--app-bar-height));
  overflow: auto;
  margin: 0 auto;
  transition: opacity 0.25s ease-in-out;
}

#router-loading {
  position: fixed;
  top: var(--app-bar-height);
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
}

html[data-theme='dark'] #router-loading {
  background-color: rgba(0, 0, 0, 0.8);
}
</style>
