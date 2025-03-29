<script setup>
import { ref, watch, watchEffect, onUnmounted, useTemplateRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SvgIcon from '@jamescoyle/vue-icon'
import LyricsView from './lyrics-view.vue'
import TitleView from './title-view.vue'
import ControlPanel from './control-panel.vue'
import { Snackbar, Dialog } from '@varlet/ui'
import {
  mdiSkipNext,
  mdiSkipPrevious,
  mdiPlay,
  mdiPause,
  mdiListBox,
  mdiTextBox,
  mdiImageArea
} from '@mdi/js'
const ref_image = ref(null)

let Data = []
const s_dataLoaded = ref(false)
const d_dataURL = 'https://prototype-oss.sharpdotnut.com/song_meta.json'
caches.open('prototype').then((cache) =>
  cache.match(d_dataURL).then(async (res) => {
    if (res) {
      res.json().then((data) => {
        Snackbar('从缓存加载成功')
        Data = data
        init()
      })
    } else {
      const res = await fetch(d_dataURL)
      cache.put(d_dataURL, res.clone())
      res.json().then((data) => {
        Snackbar('从网络下载成功')
        Data = data
        init()
      })
    }
  })
)
function init() {
  s_dataLoaded.value = true
  songMetaData.value = Data
  selectedAlbum.value = songMetaData.value.length - 74 // 空气蛹
  picURL.value = songMetaData.value[selectedAlbum.value].picUrl
  currentSongID.value =
    songMetaData.value[selectedAlbum.value].songs[selectedSong.value].id
}

const route = useRoute()
const router = useRouter()

const songMetaData = ref([])
const selectedAlbum = ref(0) // 空气蛹
const selectedSong = ref(0)
const currentSongID = ref({})
watch(selectedAlbum, () => {
  selectedSong.value = 0
  currentSongID.value =
    songMetaData.value[selectedAlbum.value].songs[selectedSong.value].id
  picURL.value = songMetaData.value[selectedAlbum.value].picUrl
})
watch(selectedSong, () => {
  currentSongID.value =
    songMetaData.value[selectedAlbum.value].songs[selectedSong.value].id
  if (
    selectedSong.value >= songMetaData.value[selectedAlbum.value].songs.length
  ) {
    selectedSong.value = 0
  } else if (selectedSong.value < 0) {
    selectedSong.value =
      songMetaData.value[selectedAlbum.value].songs.length - 1
  }
})
if (route.query.album) {
  selectedAlbum.value = songMetaData.value.length - parseInt(route.query.album)
  picURL.value = songMetaData.value[selectedAlbum.value].picUrl
}
if (route.query.song) {
  selectedSong.value = parseInt(route.query.song)
}
router.push({ query: { album: undefined } })
router.push({ query: { song: undefined } })

const picURL = ref('')
const imageLoaded = ref(false)
const lyricsView = ref(null)
const audio = useTemplateRef('audio')
const isMuted = ref(false)
const process = ref(0)
const processMax = ref(0)
const onChangeProcess = ref(false)
const hasChangedProcess = ref(false)
const pause = ref(true)
const ui_showControlPanel = ref(true)
const isMobileWidth = ref(false)
const isViewingLyrics = ref(false)
function checkMobileWidth() {
  isMobileWidth.value = window.innerWidth <= 800
}
checkMobileWidth()
window.addEventListener('resize', checkMobileWidth)
watch(pause, () => {
  if (pause.value) {
    audio.value.pause()
  } else {
    audio.value.play()
  }
})
watch(picURL, () => {
  imageLoaded.value = false
})

const timeFormat = (time) => {
  return `${Math.floor(time / 60)}:${Math.floor(time % 60)
    .toString()
    .padStart(2, '0')}`
}

watch(audio, () => {
  watchEffect(() => {
    audio.value.src = `https://music.163.com/song/media/outer/url?id=${currentSongID.value}.mp3`
    audio.value.muted = isMuted.value
  })
  audio.value.addEventListener('loadedmetadata', () => {
    processMax.value = Math.ceil(audio.value.duration)
    process.value = 0
  })
  audio.value.addEventListener('canplay', () => {
    if (!pause.value) {
      audio.value.play()
    }
  })
  audio.value.addEventListener('play', () => {
    lyricsView.value.play(Math.floor(audio.value.currentTime * 1000))
  })
  audio.value.addEventListener('timeupdate', () => {
    lyricsView.value.play(Math.floor(audio.value.currentTime * 1000))
    if (!onChangeProcess.value) {
      process.value = Math.ceil(audio.value.currentTime)
    }
    if (hasChangedProcess.value) {
      hasChangedProcess.value = false
    }
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobileWidth)
})
</script>

<template>
  <div id="container" v-if="s_dataLoaded">
    <audio ref="audio"></audio>
    <TitleView
      v-show="isMobileWidth && ui_showControlPanel"
      :data="songMetaData[selectedAlbum].songs[selectedSong]" />
    <div id="main">
      <div id="view">
        <div
          id="pic"
          :style="{
            position: isMobileWidth ? 'absolute' : 'relative',
            right: !isViewingLyrics || !isMobileWidth ? '0%' : '100%'
          }">
          <img
            ref="ref_image"
            :src="picURL"
            width="100%"
            @load="imageLoaded = true"
            style="border-radius: 5px" />
          <TitleView
            v-if="!isMobileWidth"
            :data="songMetaData[selectedAlbum].songs[selectedSong]" />
        </div>
        <LyricsView
          id="lyrics"
          :style="{
            position: isMobileWidth ? 'absolute' : 'relative',
            left: isViewingLyrics || !isMobileWidth ? '0%' : '100%'
          }"
          :song_id="songMetaData[selectedAlbum].songs[selectedSong].id"
          ref="lyricsView"
          @play="
            console.log($event)
            ;(audio.currentTime = $event / 1000), audio.play(), (pause = false)
          "></LyricsView>
      </div>
      <ControlPanel
        id="control-panel"
        :style="{
          transform: ui_showControlPanel ? 'translateY(100%)' : 'translateY(0%)'
        }"
        :isMobileWidth="isMobileWidth"
        :songMetaData="songMetaData"
        v-model:selectedAlbum="selectedAlbum"
        v-model:selectedSong="selectedSong" />
    </div>
    <div id="controller">
      <div style="display: flex; align-items: center">
        <span>{{ timeFormat(process) }}</span>
        <var-slider
          v-model="process"
          @start="onChangeProcess = true"
          @end="
            ;(audio.currentTime = process),
              (onChangeProcess = false),
              (hasChangedProcess = true)
          "
          min="0"
          :max="Math.ceil(processMax)"
          block
          label-visible="never"
          style="padding: 0px 6px" />
        <span>{{ timeFormat(processMax) }}</span>
      </div>
      <div id="controls">
        <var-button
          v-if="isMobileWidth"
          style="position: absolute; left: 20px"
          @click="
            isViewingLyrics = !isViewingLyrics
            // setTimeout(()=>{lyricsView.scrollToCurrentLyric()},500)
          ">
          <SvgIcon v-if="!isViewingLyrics" type="mdi" :path="mdiTextBox" />
          <SvgIcon v-else type="mdi" :path="mdiImageArea" />
        </var-button>
        <var-button @click="selectedSong--">
          <SvgIcon type="mdi" :path="mdiSkipPrevious" />
        </var-button>
        <var-button size="large" @click="pause = !pause">
          <SvgIcon v-if="pause" type="mdi" :path="mdiPlay" />
          <SvgIcon v-else type="mdi" :path="mdiPause" />
        </var-button>
        <var-button @click="selectedSong++">
          <SvgIcon type="mdi" :path="mdiSkipNext" />
        </var-button>
        <var-button
          style="position: absolute; right: 20px"
          @click="ui_showControlPanel = !ui_showControlPanel">
          <SvgIcon type="mdi" :path="mdiListBox" />
        </var-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import './index.css';
</style>
