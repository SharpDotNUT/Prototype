<script setup lang="ts">
const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})
</script>

<template>
  <div id="title">
    <h2 lang="zh-Hans">
      {{ data.name }}
    </h2>
    <p lang="zh-Hans" style="color: #777">
      {{ data.alias }}
    </p>
  </div>
</template>
