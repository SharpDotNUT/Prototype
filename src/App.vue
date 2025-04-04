<script setup>
import { ref, onMounted } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import AppBar from '@/components/app-bar.vue'
import { useI18n } from 'vue-i18n'
const { locale } = useI18n()
const route = useRoute()
const loading = ref(false)

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
      <div id="content" class="elevation-12">
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

<style lang="css" scoped>
@import url('./app.css');
</style>
