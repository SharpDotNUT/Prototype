<script setup lang="ts">
  import { LyricPlayer } from '@applemusic-like-lyrics/vue'
  import { ref, watch } from 'vue'
  import { useAPIStore } from '@/stores/api'
  import { parseLrcToLyricLines } from './lyrics'

  const APIStore = useAPIStore()

  const lyricData : any = ref([])
  const id = ref(0)

  const props = defineProps({
    song_id: Number
  })

  async function fetchLyrics() {
    let data: any = null
    id.value = 0
    try {
      const res = await APIStore.fetchAPI('/lyric/' + props.song_id)
      data = await res.json()
    } catch {
      return
    }
    lyricData.value = parseLrcToLyricLines(data.lrc.lyric)
    console.log(lyricData.value)
    id.value = 1
  }

  watch(
    () => props.song_id,
    async newSongId => {
      if (newSongId) await fetchLyrics()
    },
    { immediate: true }
  )

  const currentTime = ref(0)

  function play(time: number) {
    currentTime.value = time
  }

  defineExpose({
    play
  })
</script>

<template>
  <div style="height: 100%; width: 100%">
    <LyricPlayer
      style="height: 100%; width: 100%"
      :lyric-lines="lyricData"
      :current-time="currentTime"
      @line-click="null /*e => $emit('play', e.line.getLine().startTime)*/"
      align-anchor="top"
      :alignPosition="0.2"
      enable
      enable-blur
      enable-scale
      enable-spring />
  </div>
</template>
