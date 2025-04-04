import { watch } from 'vue'
import { createI18n } from 'vue-i18n'
//@ts-ignore
import EN from './en.json'
//@ts-ignore
import ZHS from './zh-Hans.json'
//@ts-ignore
import JA from './ja.json'

//@ts-ignore
import { Locale } from '@varlet/ui'
Locale.add('zh-Hans', Locale.zhCN)
Locale.add('en', Locale.enUS)
Locale.add('ja', Locale.jaJP)

let defaultLanguage = 'zh-Hans'

const i18n = createI18n<
  [typeof EN, typeof ZHS, typeof JA],
  'zh-Hans' | 'en' | 'ja'
>({
  locale: 'zh-Hans', // 默认语言
  fallbackLocale: 'zh-Hans', // 备用语言
  messages: {
    'zh-Hans': {
      ...ZHS
    },
    en: {
      ...EN
    },
    ja: {
      ...JA
    }
  },
  warnHtmlMessage: false,
  legacy: false
})

document.title = i18n.global.t('name')

export default i18n
