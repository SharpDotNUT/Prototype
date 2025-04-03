//@ts-ignore
import { ref } from 'vue'
//@ts-ignore
import { defineStore } from 'pinia'
import i18n from '@/locales/i18n'
const { t, locale } = i18n.global
//@ts-ignore
import { Themes, StyleProvider, Dialog } from '@varlet/ui'

import PackageJSON from '../../package.json'
import { watch } from 'vue'

export const useMainStore = defineStore('main', () => {
  const version = ref(PackageJSON.version)
  // @ts-ignore
  const host_name = import.meta.env.VITE_API_HOST as string
  const theme = ref('')
  const logged = ref(false)
  const user_info = ref({})
  const isUsingTeyvatFont = ref(false)
  const windowSize = ref({
    width: window.innerHeight,
    height: window.innerWidth
  })
  let beforeInstallPromptEvent = ref(null)
  window.addEventListener('beforeinstallprompt', function (e: any) {
    // 阻止默认事件
    e.preventDefault()
    // 保存事件对象
    beforeInstallPromptEvent.value = e
  })
  function setTheme(themeName: string) {
    function updateThemeAuto() {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        StyleProvider(Themes.md3Dark)
        theme.value = 'dark'
      } else {
        StyleProvider(Themes.md3Light)
        theme.value = 'light'
      }
    }
    switch (themeName) {
      case 'dark':
        StyleProvider(Themes.md3Dark)
        theme.value = 'dark'
        break
      case 'light':
        StyleProvider(Themes.md3Light)
        theme.value = 'light'
        break
      case 'system': {
        updateThemeAuto()
        window
          .matchMedia('(prefers-color-scheme: dark)')
          .addEventListener('change', updateThemeAuto)
      }
    }
  }
  watch(locale, () => {
    isUsingTeyvatFont.value = false
  })
  window.addEventListener('resize', () => {
    windowSize.value = {
      width: window.innerHeight,
      height: window.innerWidth
    }
  })
  const plugin_version = '1.0.0'
  return {
    version,
    host_name,
    theme,
    setTheme,
    logged,
    user_info,
    plugin_version,
    isUsingTeyvatFont,
    beforeInstallPromptEvent,
    windowSize
  }
})
