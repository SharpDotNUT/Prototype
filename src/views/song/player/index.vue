<script setup>
  import { ref, onMounted, watch } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import SvgIcon from "@jamescoyle/vue-icon";
  import LyricsView from "./lyrics-view.vue";
  import { copyToClipboard } from "@/script/tools";
  import Data from "./songs.json";

  import { open, fetchData as _fetchData } from "./index";

  const route = useRoute();
  const router = useRouter();
  const _log = console.log;

  import {
    mdiSkipNext,
    mdiSkipPrevious,
    mdiPlay,
    mdiPause,
  } from "@mdi/js";
  import { watchEffect } from "vue";

  const songMetaData = Data.data;
  const selectedAlbum = ref(songMetaData.length - 74); // 空气蛹
  const selectedSong = ref(0);
  const currentSongID = ref(songMetaData[selectedAlbum.value].songs[selectedSong.value].id);
  function copyLink() {
    let url = new URL(window.location.href);
    url.searchParams.set("album", songMetaData.length - selectedAlbum.value);
    url.searchParams.set("song", selectedSong.value);
    copyToClipboard(url);
  }
  function randomASong() {
    selectedAlbum.value = Math.floor(Math.random() * songMetaData.length);
    selectedSong.value = Math.floor(Math.random() * songMetaData[selectedAlbum.value].songs.length);
    fetchData();
  }
  watch(selectedAlbum, () => {
    selectedSong.value = 0;
    fetchData();
    currentSongID.value = songMetaData[selectedAlbum.value].songs[selectedSong.value].id;
  });
  watch(selectedSong, () => {
    fetchData();
    currentSongID.value = songMetaData[selectedAlbum.value].songs[selectedSong.value].id;
    if (selectedSong.value >= songMetaData[selectedAlbum.value].songs.length) {
      selectedSong.value = 0;
    } else if (selectedSong.value < 0) {
      selectedSong.value = songMetaData[selectedAlbum.value].songs.length - 1;
    }
  });
  if (route.query.album) {
    selectedAlbum.value = songMetaData.length - parseInt(route.query.album);
    picURL.value = songMetaData[selectedAlbum.value].picUrl;
    _log("selectedAlbum: ", route.query.album);
  }
  if (route.query.song) {
    selectedSong.value = parseInt(route.query.song);
    _log("selectedSong: ", route.query.song);
  }
  router.push({ query: { album: undefined } });
  router.push({ query: { song: undefined } });

  const data = ref();
  const songURL = ref(undefined);
  const picURL = ref(songMetaData[selectedAlbum.value].picUrl);
  const imageLoaded = ref(false);
  const lyricsView = ref(null);
  const audio = new Audio();
  const isMuted = ref(false);
  const isAutoScroll = ref(true);
  const process = ref(0);
  const processMax = ref(0);
  const onChangeProcess = ref(false);
  const hasChangedProcess = ref(false);
  const pause = ref(true);
  watch(pause, () => {
    if (pause.value) {
      audio.pause();
    } else {
      audio.play();
    }
  });
  watch(picURL, () => {
    imageLoaded.value = false;
  });

  const timeFormat = time => {
    return `${Math.floor(time / 60)}:${Math.floor(time % 60)
      .toString()
      .padStart(2, "0")}`;
  };

  onMounted(() => {
    watchEffect(() => {
      audio.src = songURL.value;
      audio.muted = isMuted.value;
    });
    audio.addEventListener("loadedmetadata", () => {
      processMax.value = Math.ceil(audio.duration);
      process.value = 0;
    });
    audio.addEventListener("canplay", () => {
      if (!pause.value) {
        audio.play();
      }
    });
    audio.addEventListener("play", () => {
      lyricsView.value.play(Math.floor(audio.currentTime * 1000));
    });
    audio.addEventListener("pause", () => {
      lyricsView.value.pause();
    });
    audio.addEventListener("timeupdate", () => {
      if (!onChangeProcess.value) {
        process.value = Math.ceil(audio.currentTime);
      }
      if (hasChangedProcess.value) {
        lyricsView.value.play(Math.floor(audio.currentTime * 1000));
        hasChangedProcess.value = false;
      }
    });
  });

  async function fetchData() {
    _fetchData(songMetaData, data, songURL, picURL, selectedAlbum, selectedSong);
  }
  fetchData();
</script>

<template>
  <div id="container">
    <div id="bar">
      <h2>{{ songMetaData[selectedAlbum].songs[selectedSong].name }}</h2>
      <h4>
        <span v-for="artist in songMetaData[selectedAlbum].songs[selectedSong].artist" :key="artist.id">
          <span> · </span>
          <var-link :href="'https://music.163.com/#/artist?id=' + artist.id" target="_blank">
            {{ artist.name }}
          </var-link>
        </span>
      </h4>
      <p style="color: #999">
        {{ songMetaData[selectedAlbum].songs[selectedSong].alias[0] }}
      </p>
      <br />
      <var-loading :loading="!imageLoaded">
        <img :src="picURL" width="100%" @load="imageLoaded = true" style="border-radius: 20px" />
      </var-loading>
      <var-select v-model="selectedAlbum" :placeholder="`请选择专辑 专辑ID:${songMetaData.length - selectedAlbum}`">
        <var-option
          class="option-style"
          v-for="(item, index) in songMetaData"
          :key="item.id"
          :value="index"
          :label="item.name">
          <div style="display: flex; align-items: center; gap: 10px">
            <img :src="item.picUrl + '?param=90y90'" style="width: 40px; height: 40px; border-radius: 5px" />
            <p>
              <span>{{ item.name }} </span>
              <span v-if="item.alias[0]" style="color: #999"> ({{ item.alias[0] }}) </span>
            </p>
          </div>
        </var-option>
      </var-select>
      <var-select v-model="selectedSong" :placeholder="`请选择歌曲 歌曲ID:${selectedSong}`">
        <var-option
          class="option-style"
          v-for="(item, index) in songMetaData[selectedAlbum].songs"
          :key="item.id"
          :value="index"
          :label="item.name">
          <p>
            <span>{{ item.name }} </span>
            <span v-if="item.alias[0]" style="color: #999"> ({{ item.alias[0] }}) </span>
          </p>
        </var-option>
        <template #clear-icon></template>
      </var-select>
      <br />
      <div style="display: flex; align-items: center">
        <span>{{ timeFormat(process) }}</span>
        <var-slider
          v-model="process"
          @start="onChangeProcess = true"
          @end="
            audio.currentTime = process;
            onChangeProcess = false;
            hasChangedProcess = true;
          "
          min="0"
          :max="Math.ceil(processMax)"
          :disabled="!data"
          block
          label-visible="never"
          style="padding: 0px 6px" />
        <span>{{ timeFormat(processMax) }}</span>
      </div>
      <p></p>
      <var-button-group style="width: 100%">
        <var-button
          @click="
            selectedSong--;
            fetchData();
          "
          block>
          <SvgIcon type="mdi" :path="mdiSkipPrevious" />
        </var-button>

        <var-button @click="pause = !pause" :disabled="!data" block>
          <SvgIcon v-if="pause" type="mdi" :path="mdiPlay" />
          <SvgIcon v-else type="mdi" :path="mdiPause" />
        </var-button>
        <var-button
          @click="
            selectedSong++;
            fetchData();
          "
          block>
          <SvgIcon type="mdi" :path="mdiSkipNext" />
        </var-button>
      </var-button-group>
      <br />
      <br />
      <div style="display: flex; flex-direction: column; gap: 10px">
        <var-button @click="isAutoScroll = !isAutoScroll" block>
          <span style="color: var(--button-default-text-color)" v-if="isAutoScroll">停止</span>
          <span style="color: var(--button-default-text-color)" v-else>开启</span>
          自动滚动
        </var-button>
        <var-button @click="copyLink()" block>
          {{ $t("song-player.actions.share") }}
        </var-button>
        <var-button @click="randomASong()" block>随机选择一首</var-button>
        <var-button
          @click="open('https://music.163.com/#/song?id=' + songMetaData[selectedAlbum].songs[selectedSong].id)"
          block>
          {{ $t("song-player.actions.open-in-wyy") }}
        </var-button>
      </div>
    </div>
    <LyricsView
      v-if="data"
      id="lyrics"
      :lyrics_url="data[0].lrc"
      :autoScroll="isAutoScroll"
      ref="lyricsView"
      @play="
        audio.currentTime = $event / 1000;
        audio.play();
        pause = false;
      ">
    </LyricsView>
  </div>
</template>

<style scoped>
  #container {
    position: absolute;
    height:100%;
    display: flex;
  }

  #bar {
    min-width: min(40vw, 400px);
    width: min(40vw, 400px);
    height: 100%;
    overflow-y: auto;
    padding: 20px;
    background-color: var(--color-body);
  }

  #lyrics {
    height: 100%;
    flex-grow: 1;
  }
</style>
