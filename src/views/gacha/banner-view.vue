<script setup>

import {ref} from "vue";
import IdToName from "@/data/id_to_name.CHS.json";

defineEmits(["select"]);

const props = defineProps({
  banner: Object,
  isNeedSelect: {
    type: Boolean,
    default: false,
  },
});
const img = ref(null);

img.value,
  addEventListener("load", function () {
    console.log("图片加载完成");
  });
</script>

<template>
  <div class="banner" style="display: flex; flex-direction: column; gap: 10px">
    <img ref="img" :src="banner.img" :alt="banner.name" style="width: 100%" />
    <p>
      {{ new Date(banner.from).toLocaleString() }} -
      {{ new Date(banner.to).toLocaleString() }}
    </p>
    <div
      v-if="
        new Date(banner.from) < new Date() && new Date(banner.to) > new Date()
      ">
      <p>
        进行中 - 还有
        {{ Math.floor((new Date(banner.to) - new Date()) / 86400000) }} 天
        {{
          Math.floor(((new Date(banner.to) - new Date()) % 86400000) / 3600000)
        }}
        小时
        {{
          Math.floor(((new Date(banner.to) - new Date()) % 3600000) / 60000)
        }}
        分钟
      </p>
      <p>
        <var-progress
          :value="
            ((new Date() - new Date(banner.from)) /
              (new Date(banner.to) - new Date(banner.from))) *
            100
          " />
      </p>
    </div>
    <p>
      UP :
      <var-chip type="primary" v-for="star5 in banner.star5">
        {{ IdToName[star5] }}
      </var-chip>
      <var-chip v-for="star4 in banner.star4">
        {{ IdToName[star4] }}
      </var-chip>
    </p>
    <var-button
      v-if="props.isNeedSelect"
      @click="$emit('select', banner)"
      block>
      选择该卡池
    </var-button>
    <hr />
  </div>
</template>
