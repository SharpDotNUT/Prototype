<script setup>
import { Dialog } from "@varlet/ui";
import { ref,onMounted } from "vue";

const dom_audio = ref(null);
const s_playBGM = ref(false);

onMounted(() => {
  Dialog({
    title: "提示",
    message: "需要播放背景音乐吗",
    confirmButtonText: "播放",
    cancelButtonText: "不播放",
    onConfirm: () => {
      s_playBGM.value = true;
      dom_audio.value.play();
    },
  });
});
</script>

<template>
  <audio
    ref="dom_audio"
    src="https://api.injahow.cn/meting/?type=url&&id=1481390644"
    :muted="!s_playBGM"
    loop
  ></audio>
</template>
