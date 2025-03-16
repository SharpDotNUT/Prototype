
import { watch } from "vue";
import { createI18n } from "vue-i18n";
//@ts-ignore
import EN from "./en.json";
//@ts-ignore
import ZHS from "./zh-Hans.json";
//@ts-ignore
import JA from "./ja.json";

//@ts-ignore
import { Locale } from '@varlet/ui'
Locale.add('zh-Hans', Locale.zhCN)
Locale.add('en', Locale.enUS)
Locale.add('ja', Locale.jaJP)

let defaultLanguage = "zh-Hans";

const i18n = createI18n({
  locale: "zh-Hans", // 默认语言
  fallbackLocale: "zh-Hans", // 备用语言
  messages: {
    "zh-Hans": {
      ...ZHS,
    },
    en: {
      ...EN,
    },
    ja: {
      ...JA,
    },
  },
  warnHtmlMessage: false,
  legacy: false
});

// set window title to i18n.global.t("name")

document.title = i18n.global.t("name")

document.documentElement.lang = defaultLanguage
watch(
  i18n.global.locale,
  (newLocale) => {
    console.log(newLocale);
    document.title = i18n.global.t("name")
    document.documentElement.lang = newLocale
    Locale.use(newLocale)
  }
)

export default i18n;