
import { watch } from "vue";
import { createI18n } from "vue-i18n";
//@ts-ignore
import EN from "./en.json";
//@ts-ignore
import ZHS from "./zh-Hans.json";
//@ts-ignore
import ZHT from "./zh-Hant.json";
//@ts-ignore
import JA from "./ja.json";

let defaultLanguage = "zh-Hans";

const i18n = createI18n({
  locale: "zh-Hans", // 默认语言
  fallbackLocale: "zh-Hans", // 备用语言
  messages: {
    "zh-Hans": {
      ...ZHS,
    },
    "zh-Hant": {
      ...ZHT,
    },
    en: {
      ...EN,
    },
    ja: {
      ...JA,
    },
  },
  warnHtmlMessage: true,
  legacy: false
});

// set window title to i18n.global.t("name")

document.title = i18n.global.t("name")
watch(
  i18n.global.locale,
  (newLocale) => {
    document.title = i18n.global.t("name")
  }
)

document.documentElement.lang = defaultLanguage
watch(
  i18n.global.locale,
  (newLocale) => {
    console.log(newLocale);
    document.documentElement.lang = newLocale
  }
)

export default i18n;