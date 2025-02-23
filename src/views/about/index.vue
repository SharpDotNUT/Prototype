<template>
  <div class="__container_about">
    <div id="main">
      <img src="/img/UI_NameCardPic_Yunjin_P.png" style="width: 100%; border-radius: 20px;opacity: 0.75;" />
      <div id="main_text">
        <p style="font-size: 5vw">{{ $t("name") }}</p>
        <var-badge :value="'v ' + PackageJSON.version"></var-badge>
        <p>
          <var-link href="https://github.com/SharpDotNUT" target="_blank"> #.NUT Studio </var-link>
          |
          <var-link href="https://github.com/Kuriyota" target="_blank">Kuriyota</var-link>
        </p>
      </div>
    </div>
    <a :href="`https://github.com/${Meta.repo}`" target="_blank" style="display: flex; gap: 5px">
      <img :src="`https://img.shields.io/github/stars/${Meta.repo}`" />
      <img :src="`https://img.shields.io/github/license/${Meta.repo}`" />
    </a>
    <p>
      {{ $t("about.build-time", [new Date(BuildTime).toLocaleString()]) }}
    </p>
    <p>Copyright © 2025 SharpDotNUT. All rights reserved.</p>
  </div>
</template>

<script setup lang="ts">
  import PackageJSON from "../../../package.json";
  import Meta from "@/meta";
  const BuildTime = __BUILD_TIME;
  const show = defineModel("show", { type: Boolean, default: true });
</script>

<style lang="css" scoped>
  .__container_about {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 20px max(5vw, calc((100vw - 600px) / 2));
    #main {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      #main_text {
        position: absolute;
        display: flex;
        flex-direction: column;
        height: 100%;
        align-items: center;
        justify-content: center;
      }
    }
  }
</style>
