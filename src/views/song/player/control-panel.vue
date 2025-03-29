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
      <p>{{ $t('song-player.album') }}</p>
      <div class="list">
        <div
          class="cell"
          v-for="(item, index) in songMetaData"
          :class="{ selected: index === selectedAlbum }"
          @click="selectedAlbum = index"
          :key="item.id"
          :value="index"
          :label="item.name">
          <img
            :src="item.picUrl + '?param=100y100'"
            style="width: 40px; height: 40px; border-radius: 5px" />
          <p>
            <span>{{ item.name }}</span>
            <span v-if="item.alias" class="sub-text">
              <br />
              {{ item.alias }}
            </span>
            <br />
            <span class="sub-text">
              <span>
                {{ $t('song-player.songs-in-total', [item.songs.length]) }}
              </span>
              <span>&nbsp-&nbsp</span>
              <span>
                {{
                  $t('global.time.min-sec', [
                    Math.ceil(item.dt / 60000),
                    Math.ceil((item.dt % 60000) / 1000)
                  ])
                }}
              </span>
            </span>
          </p>
        </div>
      </div>
    </div>
    <div>
      <p>{{ $t('song-player.songs') }}</p>
      <div style="display: flex; justify-content: center; height: 100%">
        <div class="list">
          <div
            class="cell"
            v-for="(item, index) in songMetaData[selectedAlbum].songs"
            style="display: flex; align-items: center; gap: 10px"
            :class="{ selected: index === selectedSong }"
            @click="selectedSong = index"
            :key="item.id"
            :value="index"
            :label="item.name">
            <img
              :src="songMetaData[selectedAlbum].picUrl + '?param=100y100'"
              style="width: 40px; height: 40px; border-radius: 5px" />
            <p>
              <span>{{ item.name }}</span>
              <span v-if="item.alias" class="sub-text">
                <br />
                {{ item.alias }}
              </span>
              <br />
              <span class="sub-text">
                {{ $t('global.time.sec', [Math.ceil(item.dt / 1000)]) }}
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
