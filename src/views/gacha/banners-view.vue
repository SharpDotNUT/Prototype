<script setup>
import { ref,watch } from "vue";
import Data from "./data.json";
import Banner from "./banner-view.vue";

defineEmits(["select"]);

const props = defineProps({
  isNeedSelect: {
    type: Boolean,
    default: false,
  },
});

const s_version = ref(
  Object.keys(Data.data)[Object.keys(Data.data).length - 1]
);
const s_bannerIndex = ref("1");

watch(s_version, () => {
  s_bannerIndex.value = "1";
});

</script>

<template>
  <var-tabs v-model:active="s_version">
    <var-tab v-for="(value, version) in Data.data" :name="version">
      {{ version }}
    </var-tab>
  </var-tabs>
  <var-tabs v-model:active="s_bannerIndex">
    <var-tab v-for="(banners, index) in Data.data[s_version]" :name="index">
      第{{ ["", "一", "二", "三"][index] }}期活动祈愿
    </var-tab>
  </var-tabs>
  <!-- v-for="banner in Data.data[s_version][s_bannerIndex]"-->
  <Banner
    v-for="banner in Data.data[s_version][s_bannerIndex]"
    :banner="banner"
    :isNeedSelect="props.isNeedSelect"
    @select="$emit('select', $event)"
  ></Banner>
</template>

<style scoped>
@import url("./banners-view.css");
</style>
