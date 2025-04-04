<script setup>
import { ref, onMounted, watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AppBar from '@/components/app-bar.vue'
import { useI18n } from 'vue-i18n'
import { Locale } from '@varlet/ui'
const { locale, t } = useI18n()
const route = useRoute()
const loading = ref(false)

onMounted(() => {
  const lang = route.query.lang || 'request'
  if (lang !== 'request') {
    locale.value = lang
  }
})

watch(locale, (newLocale) => {
  document.title = t('name')
  document.documentElement.lang = newLocale
  Locale.use(newLocale)
})
</script>

<template>
  <div id="app">
    <div id="app-bar">
      <AppBar />
    </div>
    <var-loading :loading="loading" type="wave">
      <div id="content" class="elevation-12">
        <RouterView />
      </div>
      <template #description>
        <span>
          {{ t('test') }}
          {{ $t('test') }}
        </span>
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

<style lang="css" scoped>
@import url('./app.css');
</style>
