<script setup>
  import { ref, onMounted, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import SvgIcon from '@jamescoyle/vue-icon'
  import LyricsView from './lyrics-view.vue'

  let Data = {}
  const s_dataLoaded = ref(false)
  const d_dataURL = 'https://prototype-oss.sharpdotnut.com/songs.json'
  /*
    caches.open('prototype').then(cache => {
    cache.match(WordsPath).then(async res => {
      if (res) {
        res.json().then(data => {
          Words = shuffleArray(data)
          Words_loaded.value = true
          Snackbar('从缓存加载成功')
          load()
          search(null, true)
        })
      } else {
        const res = await fetch(WordsPath)
        cache.put(WordsPath, res.clone())
        res.json().then(data => {
          Words = shuffleArray(data)
          Words_loaded.value = true
          Snackbar('从网络下载成功')
          load()
          search(null, true)
        })
      }
    })
  */
  fetch('https://prototype-oss.sharpdotnut.com/songs.json')
  .then((response) => response.json())
  .then((data) => {
    Data = data
    s_dataLoaded.value = true
    songMetaData.value = Data.data
    selectedAlbum.value = songMetaData.value.length - 74 // 空气蛹
    picURL.value = songMetaData.value[selectedAlbum.value].picUrl
    currentSongID.value =
      songMetaData.value[selectedAlbum.value].songs[selectedSong.value].id
  })

  const route = useRoute()
  const router = useRouter()

  import {
    mdiSkipNext,
    mdiSkipPrevious,
    mdiPlay,
    mdiPause,
    mdiListBox,
    mdiTextBox,
    mdiImageArea
  } from '@mdi/js'
  import { watchEffect } from 'vue'
  import { onUnmounted } from 'vue'

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
    if (selectedSong.value >= songMetaData.value[selectedAlbum.value].songs.length) {
      selectedSong.value = 0
    } else if (selectedSong.value < 0) {
      selectedSong.value = songMetaData.value[selectedAlbum.value].songs.length - 1
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
  const audio = new Audio()
  const isMuted = ref(false)
  const isAutoScroll = ref(true)
  const process = ref(0)
  const processMax = ref(0)
  const onChangeProcess = ref(false)
  const hasChangedProcess = ref(false)
  const pause = ref(true)
  const ui_tabSelector = ref(0)
  const ui_showSelector = ref(false)
  const isMobileWidth = ref(false)
  const isViewingLyrics = ref(false)
  function checkMobileWidth() {
    isMobileWidth.value = window.innerWidth <= 600
  }
  checkMobileWidth()
  window.addEventListener('resize', checkMobileWidth)
  watch(pause, () => {
    if (pause.value) {
      audio.pause()
    } else {
      audio.play()
    }
  })
  watch(picURL, () => {
    imageLoaded.value = false
  })

  const timeFormat = time => {
    return `${Math.floor(time / 60)}:${Math.floor(time % 60)
      .toString()
      .padStart(2, '0')}`
  }

  onMounted(() => {
    watchEffect(() => {
      audio.src = `https://music.163.com/song/media/outer/url?id=${currentSongID.value}.mp3`
      audio.muted = isMuted.value
    })
    audio.addEventListener('loadedmetadata', () => {
      processMax.value = Math.ceil(audio.duration)
      process.value = 0
    })
    audio.addEventListener('canplay', () => {
      if (!pause.value) {
        audio.play()
      }
    })
    audio.addEventListener('play', () => {
      lyricsView.value.play(Math.floor(audio.currentTime * 1000))
    })
    audio.addEventListener('pause', () => {
      lyricsView.value.pause()
    })
    audio.addEventListener('timeupdate', () => {
      if (!onChangeProcess.value) {
        process.value = Math.ceil(audio.currentTime)
      }
      if (hasChangedProcess.value) {
        lyricsView.value.play(Math.floor(audio.currentTime * 1000))
        hasChangedProcess.value = false
      }
    })
  })

  onUnmounted(() => {
    audio.remove()
    window.removeEventListener('resize', checkMobileWidth)
  })
</script>

<template>
  <div id="container" v-if="s_dataLoaded">
    <div id="title">
      <h2>{{ songMetaData[selectedAlbum].songs[selectedSong].name }}</h2>
      <p style="color: #777">
        {{ songMetaData[selectedAlbum].songs[selectedSong].alias[0] }}
      </p>
      <h4>
        <span
          v-for="artist in songMetaData[selectedAlbum].songs[selectedSong]
            .artist"
          :key="artist.id">
          <span>·</span>
          <var-link
            :href="'https://music.163.com/#/artist?id=' + artist.id"
            target="_blank">
            {{ artist.name }}
          </var-link>
        </span>
      </h4>
    </div>
    <div id="main">
      <div
        id="pic"
        :style="{
          position: isMobileWidth ? 'absolute' : 'relative',
          right: (!isViewingLyrics || !isMobileWidth) ? '0%' : '100%'
        }">
        <img
          :src="picURL"
          width="100%"
          @load="imageLoaded = true"
          style="border-radius: 20WWpx" />
      </div>
      <LyricsView
        id="lyrics"
        :style="{
          position: isMobileWidth ? 'absolute' : 'relative',
          left: isViewingLyrics || !isMobileWidth ? '0%' : '100%'
        }"
        :song_id="songMetaData[selectedAlbum].songs[selectedSong].id"
        :autoScroll="isAutoScroll"
        ref="lyricsView"
        @play="
          ;(audio.currentTime = $event / 1000), audio.play(), (pause = false)
        "></LyricsView>
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
          @click="ui_showSelector = true">
          <SvgIcon type="mdi" :path="mdiListBox" />
        </var-button>
        <var-popup
          position="bottom"
          v-model:show="ui_showSelector">
          <div id="selector">
            <var-tabs v-model:active="ui_tabSelector">
              <var-tab>专辑列表</var-tab>
              <var-tab>歌曲列表</var-tab>
            </var-tabs>
            <br />
            <div id="list">
            <var-tabs-items v-model:active="ui_tabSelector">
              <var-tab-item>
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
                      :src="item.picUrl + '?param=40y40'"
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
              </var-tab-item>
              <var-tab-item>
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
                      :src="songMetaData[selectedAlbum].picUrl + '?param=40y40'"
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
                <template #clear-icon></template>
              </var-tab-item>
            </var-tabs-items></div>
          </div>
        </var-popup>
      </div>
    </div>
  </div>
</template>

<style scoped>
  @import './index.css';
</style>
