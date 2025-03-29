<script setup lang="ts">
//@ts-ignore
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiArrowLeft, mdiArrowRight } from '@mdi/js'
import { ref } from 'vue'

const props = defineProps<{
  songMetaData: any
  isMobileWidth: boolean
}>()

const ui_tabIsAlbum = ref(true)

const selectedAlbum = defineModel('selectedAlbum', {
  type: Number,
  default: 0
})
const selectedSong = defineModel('selectedSong', { type: Number, default: 0 })
</script>

<template>
  <div lang="zh-Hans" class="__selector" style="height: 100%; width: 100%">
    <div
      :style="{
        position: isMobileWidth ? 'absolute' : 'relative',
        right: ui_tabIsAlbum || !isMobileWidth ? '0%' : '100%'
      }">
      <p>{{ $t('song-player.album') }}</p>
      <div class="list">
        <div
          class="cell"
          v-for="(item, index) in songMetaData"
          style="justify-content: space-between"
          :class="{ selected: index === selectedAlbum }"
          @click="selectedAlbum = index"
          :key="item.id"
          :value="index"
          :label="item.name">
          <div style="display: flex; gap: 10px; align-items: center">
            <img
              :src="item.picUrl + '?param=100y100'"
              style="width: 40px; height: 40px; border-radius: 5px" />
            <p>
              <span lang="zh-Hans">{{ item.name }}</span>
              <span lang="zh-Hans" v-if="item.alias" class="sub-text">
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
          <var-button
            round
            @click="ui_tabIsAlbum = false"
            v-if="isMobileWidth"
            style="flex-shrink: 0">
            <SvgIcon type="mdi" :path="mdiArrowRight" />
          </var-button>
        </div>
      </div>
      <p>{{ $t('song-player.album-description') }}</p>
      <div style="flex-shrink: 0; max-height: 40%; overflow-y: auto">
        <pre
          lang="zh-Hans"
          style="white-space: pre-wrap; word-wrap: break-word"
          >{{ songMetaData[selectedAlbum].description }}</pre
        >
      </div>
    </div>
    <div
      :style="{
        position: isMobileWidth ? 'absolute' : 'relative',
        left: !ui_tabIsAlbum || !isMobileWidth ? '0%' : '100%'
      }">
      <p style="display: flex; align-items: center; gap: 10px">
        <var-button round @click="ui_tabIsAlbum = true" v-if="isMobileWidth">
          <SvgIcon type="mdi" :path="mdiArrowLeft" />
        </var-button>
        {{ $t('song-player.songs') }}
      </p>
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
            <span lang="zh-Hans">{{ item.name }}</span>
            <span lang="zh-Hans" v-if="item.alias" class="sub-text">
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
</template>

<style scoped>
@import url('./control-panel.css');
</style>
