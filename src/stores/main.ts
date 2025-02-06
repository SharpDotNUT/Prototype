//@ts-ignore
import { ref } from "vue";
//@ts-ignore
import { defineStore } from "pinia";
import i18n from "@/locales/i18n";
const { t, locale } = i18n.global;
//@ts-ignore
import { Themes, StyleProvider, Dialog } from "@varlet/ui";

import PackageJSON from "../../package.json";
import { watch } from "vue";

export const useMainStore = defineStore("main", () => {
  // @ts-ignore
  const version = ref(PackageJSON.version);
  const host_name = import.meta.env.VITE_API_HOST as string;
  const theme = ref("");
  const logged = ref(false);
  const user_info = ref({});
  const isUsingTeyvatFont = ref(false);
  const token = ref("");
  function setTheme(themeName: string) {
    function updateThemeAuto() {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        StyleProvider(Themes.md3Dark);
        theme.value = "dark";
      } else {
        StyleProvider(Themes.md3Light);
        theme.value = "light";
      }
    }
    switch (themeName) {
      case "dark":
        StyleProvider(Themes.md3Dark);
        theme.value = "dark";
        break;
      case "light":
        StyleProvider(Themes.md3Light);
        theme.value = "light";
        break;
      case "system": {
        updateThemeAuto();
        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", updateThemeAuto);
      }
    }
    if (themeName !== "system") {
      window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", updateThemeAuto);
    }
  }
  function initUserInfo() {
    try {
      if (localStorage.getItem("yunhan-meta-user") && localStorage.getItem("yunhan-meta-user")) {
        user_info.value = JSON.parse(localStorage.getItem("yunhan-meta-user") as string);
        token.value = localStorage.getItem("yunhan-meta-token") as string;
        logged.value = true;
      }
    } catch (e) {
      console.log(e);
      Dialog({
        title: "提示",
        message: "登录信息有误，请重新登录。",
      });
    }
  }
  watch(locale, () => {
    isUsingTeyvatFont.value = false;
  })
  const plugin_version = "1.0.0";
  // const plugin_version = ref((window as any)?.["yunhan_plugin_version"] ?? undefined);
  return {
    version,
    host_name,
    theme,
    setTheme,
    logged,
    user_info,
    token,
    initUserInfo,
    plugin_version,
    isUsingTeyvatFont,
  };
});
