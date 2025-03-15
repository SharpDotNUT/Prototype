<script setup lang="ts">
  import { watch, ref, type Ref } from 'vue'
  import { mergeLyrics, parseLyrics, type t_Lyrics } from './lyrics'
  import { useAPIStore } from '@/stores/api'

  const props = defineProps({
    song_id: Number,
    autoScroll: {
      type: Boolean,
      default: true
    }
  })
  defineEmits(['play'])

  const APIStore = useAPIStore()

  const raw_lyrics = ref({
    raw: '',
    translation: '',
    romaji: ''
  })
  const lyrics: Ref<t_Lyrics> = ref({})
  const lyricsContainer = ref<HTMLElement | null>(null)
  const ref_lyrics = ref<HTMLElement[]>([])
  const nowPlayingTime = ref(0)
  const nowPlayingIndex = ref(-1) // 当前播放歌词的索引
  const isPlaying = ref(false)
  let animationFrameId: number | null = null

  const s_isFetchFailed = ref(false)
  // 获取歌词数据
  async function fetchLyrics() {
    let data: any = null
    try {
      const res = await APIStore.fetchAPI('/lyric/' + props.song_id)
      data = await res.json()
    } catch {
      s_isFetchFailed.value = true
      return
    }
    raw_lyrics.value.raw = data.lrc.lyric
    raw_lyrics.value.translation = data?.tlyric?.lyric
    raw_lyrics.value.romaji = data?.romalrc?.lyric
    lyrics.value = mergeLyrics(
      parseLyrics(raw_lyrics.value.raw),
      parseLyrics(raw_lyrics.value.translation),
      parseLyrics(raw_lyrics.value.romaji)
    )
  }

  // 播放控制
  function play(timestamp = 0) {
    pause()
    isPlaying.value = true
    const startTime = performance.now() - timestamp

    const update = () => {
      if (!isPlaying.value) return
      const elapsed = performance.now() - startTime
      nowPlayingTime.value = elapsed
      const currentIndex = findCurrentLyricIndex(elapsed)
      if (currentIndex !== nowPlayingIndex.value) {
        nowPlayingIndex.value = currentIndex
        if (props.autoScroll && currentIndex !== -1) {
          scrollToLyric(currentIndex, 500)
        }
      }

      animationFrameId = requestAnimationFrame(update)
    }

    animationFrameId = requestAnimationFrame(update)
  }

  function pause() {
    isPlaying.value = false
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
    }
    console.log('pause')
  }

  // 查找当前播放的歌词索引
  function findCurrentLyricIndex(currentTime: number): number {
    const timestamps = Object.keys(lyrics.value)
      .map(Number)
      .sort((a, b) => a - b)
    for (let i = timestamps.length - 1; i >= 0; i--) {
      if (currentTime >= timestamps[i]) return i
    }
    return -1
  }

  // 手动滚动函数
  function scrollToLyric(index: number, duration: number = 500) {
    const container = lyricsContainer.value
    const targetElement = ref_lyrics.value[index]

    if (!container || !targetElement) return

    const targetRect = targetElement.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()

    // 计算目标滚动位置
    let targetScrollTop: number
    targetScrollTop =
      targetRect.top -
      containerRect.top +
      container.scrollTop -
      container.clientHeight / 2 +
      targetRect.height / 2

    const startScrollTop = container.scrollTop
    const startTime = performance.now()
    function animateScroll(currentTime: number) {
      if (!container || !targetElement) return
      const elapsedTime = currentTime - startTime
      const progress = Math.min(elapsedTime / duration, 1)
      const easedProgress = easeInOut(progress)
      container.scrollTop =
        startScrollTop + (targetScrollTop - startScrollTop) * easedProgress
      if (!container || !targetElement) return
      if (progress < 1) {
        requestAnimationFrame(animateScroll)
      }
    }
    requestAnimationFrame(animateScroll)
  }

  function scrollToCurrentLyric() {
    const currentIndex = findCurrentLyricIndex(nowPlayingTime.value)
    if (currentIndex !== -1) {
      scrollToLyric(currentIndex)
    }
  }

  // 缓动函数
  function easeInOut(t: number): number {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
  }

  watch(
    () => props.song_id,
    async newSongId => {
      if (newSongId) await fetchLyrics()
    },
    { immediate: true }
  )

  defineExpose({ play, pause, scrollToCurrentLyric })
</script>

<template>
  <div class="lyrics-container" ref="lyricsContainer">
    <div style="height: 50dvh"></div>
    <div
      v-if="!s_isFetchFailed"
      v-for="(lyric, timestamp, index) in lyrics"
      :key="timestamp"
      :ref="(el) => (ref_lyrics[index] = el as HTMLElement)"
      :class="['lyric-item', { 'now-playing': nowPlayingIndex === index }]"
      @click="play(Number(timestamp)), $emit('play', Number(timestamp))">
      <div class="lyrics-content">
        <p class="lyrics-text">{{ lyric.raw }}</p>
        <p class="lyrics-translation" v-if="lyric.translation">
          {{ lyric.translation }}
        </p>
        <p class="lyrics-romaji" v-if="lyric.romaji">{{ lyric.romaji }}</p>
      </div>
    </div>
    <div v-else>歌词获取失败</div>
    <div style="height: 50dvh"></div>
  </div>
</template>

<style scoped>
  @import './lyrics.css';
</style>
