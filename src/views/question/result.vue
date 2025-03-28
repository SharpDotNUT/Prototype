<script setup>
import { computed } from 'vue'
import { useQuestionStore } from './store'
const questionStore = useQuestionStore()

const rightRate = computed(() => {
  console.log(
    questionStore.result.rightAnswer,
    questionStore.result.totalAnswer
  )
  return (
    (questionStore.result.rightAnswer / questionStore.result.totalAnswer) * 100
  )
})
const rightRateColor = computed(() => {
  //渐变
  if (rightRate.value > 90) {
    return 'green'
  } else if (rightRate.value > 75) {
    return 'orange'
  } else {
    return 'red'
  }
})
</script>

<template>
  <div>
    <br />
    <p>
      <span style="font-size: 28px; font-weight: bold">
        {{ $t('question.question-rank-is') }}
      </span>
      <span style="font-size: 56px; font-weight: bold">
        「{{ questionStore.result.questionRankName }}」
      </span>
    </p>
    <br />
    <p style="font-size: 28px">
      {{
        $t('question.result.tip', [
          questionStore.result.totalAnswer,
          questionStore.result.rightAnswer
        ])
      }}
    </p>
    <p style="font-size: 28px">
      正确率：
      <span :style="{ color: rightRateColor }">{{ rightRate }}%</span>
    </p>
  </div>
  <p></p>
</template>
