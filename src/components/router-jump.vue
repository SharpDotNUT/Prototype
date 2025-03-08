<script setup>
  import { ref, watch } from "vue";
  import SvgIcon from "@jamescoyle/vue-icon";
  import { mdiCog, mdiGithub, mdiInformation } from "@mdi/js";
  import { useI18n } from "vue-i18n";
  import { useMainStore } from "@/stores/main";
  const { t, locale } = useI18n();

  const mainStore = useMainStore();
  import Meta from "@/meta";

  function openGithub() {
    window.open(`https://github.com/${Meta.repo}`, "_blank");
  }

  const RouteData = ref([]);
  function getRouteData() {
    RouteData.value = [
      {
        name: t("home.title"),
        path: "/",
      },
      {
        name: t("translator.title"),
        path: "/translator",
      },
      {
        name: t("song-player.title"),
        path: "/song-player",
      },
      {
        name: t("achievement.title"),
        path: "/achievement"
      },
      {
        name: t("dictionary.title"),
        path: "/dictionary",
      },
      {
        name: t("sp-key.title"),
        path: "/sp-key",
      },
      {
        name: t("quiz.title"),
        path: "/quiz",
        beta: true,
      },
      {
        name: t("gacha.view.title"),
        path: "/gacha/view",
        beta: true,
      },
      {
        name: t("gacha.simulator.title"),
        path: "/gacha/simulator",
        beta: true,
      },
    ];
  }
  watch(locale, () => {
    getRouteData();
  });
  getRouteData();
</script>

<template>
  <div id="container">
    <h3>{{ $t("name") }} <var-badge :value="'v ' + mainStore.version"></var-badge></h3>
    <var-divider />
    <div id="apps">
      <var-paper elevation="3" class="app var-button" @click="openGithub">
        <a class="app-name">
          <SvgIcon class="icon" type="mdi" :path="mdiGithub" />
          <span>{{ $t("global.github-os-repo") }}</span>
        </a>
      </var-paper>
      <var-paper elevation="3" class="app var-button">
        <RouterLink class="app-name" to="/settings">
          <SvgIcon class="icon" type="mdi" :path="mdiCog" />
          <span>{{ $t("setting.title") }}</span>
        </RouterLink>
      </var-paper>
      <var-paper elevation="3" class="app var-button">
        <RouterLink class="app-name" to="/about">
          <SvgIcon class="icon" type="mdi" :path="mdiInformation" />
          <span>{{ $t("global.about") }}</span>
        </RouterLink>
      </var-paper>
      <var-divider />
      <var-paper elevation="3" v-for="route in RouteData" class="app var-button">
        <RouterLink class="app-name" :to="route.path">
            {{ route.name }}
            <var-chip v-if="route.beta" type="warning" size="small">Beta</var-chip>
        </RouterLink>
      </var-paper>
    </div>
  </div>
</template>

<style scoped>
  @import url("./router-jump.css");
</style>
