<script setup lang="ts">
const props = defineProps<{
  songMetaData: any
}>()

const selectedAlbum = defineModel('selectedAlbum', {
  type: Number,
  default: 0
})
const selectedSong = defineModel('selectedSong', { type: Number, default: 0 })
</script>

<template>
  <div class="__selector" style="height: 100%; width: 100%">
    <div>
      <p>专辑</p>
      <div class="list">
        <div
          class="cell"
          v-for="(item, index) in songMetaData"
          :class="{ selected: index === selectedAlbum }"
          @click="selectedAlbum = index"
          :key="item.id"
          :value="index"
          :label="item.name">
          <div style="display: flex; align-items: center; gap: 10px">
            <img
              :src="item.picUrl + '?param=100y100'"
              style="width: 40px; height: 40px; border-radius: 5px" />
            <p>
              <span>{{ item.name }}</span>
              <span v-if="item.alias[0]" style="color: #999">
                <br />
                ({{ item.alias[0] }})
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div>
      <p>歌曲</p>
      <div class="list">
        <div
          class="cell"
          v-for="(item, index) in songMetaData[selectedAlbum].songs"
          :class="{ selected: index === selectedSong }"
          @click="selectedSong = index"
          :key="item.id"
          :value="index"
          :label="item.name">
          <div style="display: flex; align-items: center; gap: 10px">
            <img
              :src="songMetaData[selectedAlbum].picUrl + '?param=100y100'"
              style="width: 40px; height: 40px; border-radius: 5px" />
            <p>
              <span>{{ item.name }}</span>
              <span v-if="item.alias[0]" style="color: #999">
                <br />
                ({{ item.alias[0] }})
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('./control-panel.css');
</style>
