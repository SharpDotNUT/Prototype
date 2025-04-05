//@ts-ignore
import { ref } from 'vue'
//@ts-ignore
import { defineStore } from 'pinia'
import { useI18n } from 'vue-i18n'
//@ts-ignore
import { Themes, StyleProvider } from '@varlet/ui'

import PackageJSON from '../../package.json'
import ResourceManager from '@/script/RM/resource-manager'

export const useMainStore = defineStore('main', () => {
  const { locale } = useI18n()
  const version = ref(PackageJSON.version)
  const host_name = import.meta.env.VITE_API_HOST as string
  const theme = ref('')
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
  window.addEventListener('resize', () => {
    windowSize.value = {
      width: window.innerHeight,
      height: window.innerWidth
    }
  })
  const RM = new ResourceManager(import.meta.env.VITE_RESOURCE_HOST)
  //@ts-ignore
  window.RM = RM
  return {
    RM,
    version,
    host_name,
    theme,
    setTheme,
    isUsingTeyvatFont,
    beforeInstallPromptEvent,
    windowSize
  }
})
