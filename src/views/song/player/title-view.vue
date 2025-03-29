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
    <h2>
      {{ data.name }}
    </h2>
    <p style="color: #777">
      {{ data.alias }}
    </p>
  </div>
</template>
