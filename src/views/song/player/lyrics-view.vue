<script setup lang="ts">
import { watch, ref, type Ref } from 'vue'
import { mergeLyrics, parseLyrics, type t_Lyrics } from './lyrics'
import { useAPIStore } from '@/stores/api'
import { nextTick } from 'vue'

const props = defineProps({
  song_id: Number
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
const isAutoScrolling = ref(false)
const isUserScrolling = ref(false)
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
  isPlaying.value = true
  nowPlayingTime.value = timestamp

  const update = () => {
    const currentIndex = findCurrentLyricIndex(nowPlayingTime.value)
    if (currentIndex !== nowPlayingIndex.value) {
      nowPlayingIndex.value = currentIndex
      if (!isUserScrolling.value && currentIndex !== -1) {
        scrollToLyric(currentIndex, 500)
      }
    }

    animationFrameId = requestAnimationFrame(update)
  }

  animationFrameId = requestAnimationFrame(update)
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
  isAutoScrolling.value = true
  function animateScroll(currentTime: number) {
    if (!container || !targetElement) return
    const elapsedTime = currentTime - startTime
    const progress = Math.min(elapsedTime / duration, 1)
    const easedProgress = easeInOut(progress)
    container.scrollTop =
      startScrollTop + (targetScrollTop - startScrollTop) * easedProgress
    if (!container || !targetElement) {
      return
    }
    if (progress < 1) {
      requestAnimationFrame(animateScroll)
    } else {
      nextTick(() => {
        isAutoScrolling.value = false
      })
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

let lastUserScroll = 0
watch(
  () => props.song_id,
  async (newSongId) => {
    if (newSongId) await fetchLyrics()
  },
  { immediate: true }
)
defineExpose({ play, scrollToCurrentLyric })
</script>

<template>
  <div
    class="lyrics-container"
    ref="lyricsContainer"
    @wheel="isUserScrolling = true"
    @touchmove="isUserScrolling = true">
    <div
      v-if="isUserScrolling"
      style="position: sticky; top: 0px; padding: 20px; width: 100%"
      @click="(scrollToCurrentLyric(), (isUserScrolling = false))">
      <var-button block>
        {{ $t('song-player.jump-to-current-lyric') }}
      </var-button>
    </div>
    <div
      v-for="(lyric, timestamp, index) in lyrics"
      :key="timestamp"
      :ref="(el) => (ref_lyrics[index] = el as HTMLElement)"
      :class="{
        'lyric-item': true,
        'lyric-item-active': nowPlayingIndex === index
      }"
      lang="zh-Hans"
      @click="(play(Number(timestamp)), $emit('play', Number(timestamp)))">
      <p class="lyric-text">{{ lyric.raw }}</p>
      <p class="lyric-translation" v-if="lyric.translation">
        {{ lyric.translation }}
      </p>
      <p class="lyric-romaji" v-if="lyric.romaji">{{ lyric.romaji }}</p>
    </div>
  </div>
</template>

<style scoped>
@import './lyrics.css';
</style>
