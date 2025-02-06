<script setup>
  import { watch, computed, ref } from "vue";

  const props = defineProps({
    lyrics_url: String,
    autoScroll: {
      type: Boolean,
      default: true,
    },
  });
  defineEmits(["play"]);

  const lyrics = ref();
  let isValidLyrics = true;

  function timeToMilliseconds(timeStr) {
    const [minutes, seconds] = timeStr.split(":");
    const [secondsPart, milliseconds] = seconds.split(".");
    const minutesInMs = parseInt(minutes) * 60 * 1000;
    const secondsInMs = parseInt(secondsPart) * 1000;
    const millisecondsPart = parseInt(milliseconds);
    return minutesInMs + secondsInMs + millisecondsPart;
  }

  const timeFormat = time => {
    return `${Math.floor(time / 60)}:${Math.floor(time % 60)
      .toString()
      .padStart(2, "0")}`;
  };

  async function fetchLyrics() {
    isValidLyrics = true;
    const response = await fetch(props.lyrics_url);
    let data = await response.text();
    data = data.split("\n");
    data = data.filter(line => line !== "");
    lyrics.value = [];
    data.forEach((line, index) => {
      let timestamp_p = line.indexOf("]");
      let translation_p = line.indexOf(" (");
      let timestamp;
      if (timestamp_p === -1) {
        (isValidLyrics = false), (timestamp = "00:00.000");
      } else {
        timestamp = line.slice(1, timestamp_p);
      }
      let translation;
      if (translation_p === -1) {
        translation = "";
        translation_p = line.length;
      } else {
        translation = line.slice(translation_p + 2, line.length - 1);
      }
      lyrics.value.push({
        timestamp: timeToMilliseconds(timestamp),
        text: line.slice(timestamp_p + 1, translation_p + 1),
        translation,
      });
    });
  }
  fetchLyrics();
  watch(
    () => props.lyrics_url,
    () => {
      fetchLyrics();
    }
  );

  const nowPlayingLyrics = ref();
  const nowPlayedTime = ref();
  const ref_lyrics = ref([]);
  let lastRAF;
  let isPlaying = 0;
  let frame = 0;

  function pause() {
    isPlaying = 0;
  }

  function play(timestamp = 0) {
    pause();
    if (isPlaying) {
      clearInterval(isPlaying);
      console.log("clear interval", isPlaying);
    }
    if (!isValidLyrics) {
      return;
    }
    let starPlayTime = new Date().getTime();
    function getPlayedTime() {
      return new Date().getTime() - starPlayTime + timestamp;
    }
    let i = 0;
    for (let j = 0; j < lyrics.value.length; j++) {
      if (lyrics.value[j].timestamp <= getPlayedTime()) {
        i = j;
      } else {
        break;
      }
    }
    isPlaying = 1;
    cancelAnimationFrame(lastRAF);
    function playNext() {
      nowPlayedTime.value = getPlayedTime();
      if (getPlayedTime() >= lyrics.value[lyrics.value.length - 1].timestamp) {
        clearInterval(isPlaying);
        return;
      }
      if (lyrics.value[i].timestamp <= getPlayedTime()) {
        nowPlayingLyrics.value = i;
        if (props.autoScroll) {
          ref_lyrics.value[i]?.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        i++;
      }
      if (isPlaying) {
        lastRAF = requestAnimationFrame(playNext);
        frame++;
      }
    }
    lastRAF = requestAnimationFrame(playNext);
  }

  defineExpose({
    play,
    pause,
  });
</script>

<template>
  <div id="lyrics-container">
    <div id="lyrics" ref="lyricsContainer">
      <div style="height: 50dvh"></div>
      <div
        v-for="(lyric, index) in lyrics"
        :ref="el => (ref_lyrics[index] = el)"
        :key="index"
        :class="nowPlayingLyrics === index && isValidLyrics ? 'now-playing lyrics' : 'lyrics'"
        @click="
          play(lyric.timestamp);
          $emit('play', lyric.timestamp);
        ">
        <p class="lyrics-text">{{ lyric.text }}</p>
        <p class="lyrics-translation" v-if="isValidLyrics">
          {{ lyric.translation }}
        </p>
      </div>
      <div style="height: 50dvh"></div>
    </div>
  </div>
</template>

<style scoped>
  #lyrics-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  #lyrics {
    overflow-y: auto;
    padding: 5px;
  }

  .lyrics {
    position: relative;
    transition: color 2s;
    text-align: center;
    margin: 10px 0;
    transform: scale(calc(1 / 1.2));
    border-radius: 10px;
    cursor: pointer;
  }

  .lyrics-text {
    font-size: 24px;
  }

  .lyrics-translation {
    font-size: 16px;
  }

  .lyrics:hover {
    > p {
      text-shadow: 0px 0px 20px var(--color-text);
    }
  }

  .now-playing {
    color: var(--color-primary);
    transform: scale(1);
    transition: transform 0.5s, color 0.5s;
  }

  .now-playing:hover {
    > p {
      text-shadow: 0px 0px 20px var(--color-primary);
    }
  }
</style>
