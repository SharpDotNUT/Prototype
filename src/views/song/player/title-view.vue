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
      {{ data.alias[0] }}
    </p>
    <h4>
      <var-link
        :href="'https://music.163.com/#/artist?id=' + data.artist[0].id"
        target="_blank">
        {{ data.artist[0].name }}
      </var-link>
      <span v-for="artist in data.artist.slice(1)" :key="artist.id">
        <span>、</span>
        <var-link
          :href="'https://music.163.com/#/artist?id=' + artist.id"
          target="_blank">
          {{ artist.name }}
        </var-link>
      </span>
    </h4>
  </div>
</template>
