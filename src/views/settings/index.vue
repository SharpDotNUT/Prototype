<script setup>
import { ref, watch, onMounted } from 'vue'
import { useMainStore } from '@/stores/main'
import { useRoute, useRouter } from 'vue-router'
import About from '../about/index.vue'
import { useI18n } from 'vue-i18n'
const { locale } = useI18n()
const mainStore = useMainStore()
const ui_isTeyvatFont = ref(mainStore.isUsingTeyvatFont)
const theme = ref('system')

watch(theme, () => {
  mainStore.setTheme(theme.value)
})
watch(ui_isTeyvatFont, () => {
  if (ui_isTeyvatFont.value) {
    locale.value = 'en'
    mainStore.isUsingTeyvatFont = true
    router.push({ query: { lang: locale.value } })
    document.documentElement.classList.add('teyvat')
  } else {
    mainStore.isUsingTeyvatFont = false
    document.documentElement.classList.remove('teyvat')
  }
})

const route = useRoute()
const router = useRouter()

const showMenu = ref(false)

const s_isWidthOver800 = ref(false)
onMounted(() => {
  s_isWidthOver800.value = window.innerWidth > 800
  window.addEventListener('resize', () => {
    s_isWidthOver800.value = window.innerWidth > 800
  })
})
</script>

<template>
  <div class="__container_settings">
    <div
      id="tabs"
      :style="{
        transform: showMenu ? 'translateX(0)' : 'translateX(-100%)'
      }">
      <div>
        <h2>{{ $t('setting.title') }}</h2>
      </div>
      <div name="theme" @click="scrollToView('theme')">
        {{ $t('setting.theme.title') }}
      </div>
      <div name="language" @click="scrollToView('language')">
        {{ $t('setting.language.title') }}
      </div>
      <div name="about" @click="scrollToView('about')">
        {{ $t('setting.about.title') }}
      </div>
    </div>
    <div
      id="views"
      :style="{
        marginLeft: showMenu && s_isWidthOver800 ? '200px' : '0'
      }">
      <div>
        <div>
          <h2>{{ $t('setting.theme.title') }}</h2>
          <br />
          <var-select
            variant="outlined"
            v-model="theme"
            :placeholder="$t('setting.theme.select')">
            <template #prepend-icon><var-icon name="palette" /></template>
            <var-option
              :label="$t('setting.theme.light')"
              value="light"></var-option>
            <var-option
              :label="$t('setting.theme.dark')"
              value="dark"></var-option>
            <var-option
              :label="$t('setting.theme.system')"
              value="system"></var-option>
            <template #append-icon></template>
          </var-select>
        </div>
        <div>
          <h2>{{ $t('setting.language.title') }}</h2>
          <br />
          <var-select
            :disabled="ui_isTeyvatFont"
            variant="outlined"
            v-model="locale"
            :placeholder="$t('setting.language.select')">
            <template #prepend-icon><var-icon name="translate" /></template>
            <var-option label="English" value="en"></var-option>
            <var-option label="中文（简体）" value="zh-Hans"></var-option>
            <var-option label="日本語" value="ja"></var-option>
          </var-select>
          <br />
          <p
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
            ">
            <span>{{ $t('setting.language.teyvat') }}</span>
            <var-switch v-model="ui_isTeyvatFont" :variant="true" />
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('./index.css');
</style>
