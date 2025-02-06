<script setup>

import { ref } from "vue";
defineEmits(["load"]);

const data = ref();

const upload = (file) => {
  console.log(file);
  const fileReader = new FileReader();
  fileReader.onload = (e) => {
    data.value = JSON.stringify(JSON.parse(e.target.result), null, 4);
  };
  fileReader.readAsText(file.file);
};
</script>

<template>
  <var-input textarea variant="outlined" v-model="data" placeholder="粘贴或导入 UIAF 文件" class="aaa">
    <template #append-icon>
      <var-uploader
        block
        accept="application/json"
        @after-read="upload"
        style="display: inline-block"
      >
        <var-button type="primary">导入</var-button>
        <template #extra-message>
          <var-button type="primary" @click="$emit('load', data)">确定</var-button></template
        >
      </var-uploader>
    </template>
  </var-input>
</template>

<style scoped>
.aaa {
  font-family: "JetBrains Mono";
}
</style>
