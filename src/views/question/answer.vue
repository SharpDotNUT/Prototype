<script setup lang="ts">
import Data from '@/data/question/星月银0.json'
import Markdown from '@/components/markdown.vue'
import type { Question, QuestionsList } from '@/data/question/types'
import { computed, ref, watch } from 'vue'
import { Dialog, Snackbar } from '@varlet/ui'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useQuestionStore } from './store'
const { t } = useI18n()
const data: QuestionsList = Data
const questionStore = useQuestionStore()
const router = useRouter()
const currentIndex = ref(0)
const point = ref({
  right: 0,
  sp_right: 0
})
//@ts-ignore
const isDev = process.env.NODE_ENV === 'development'
const answered = ref(false)
const isRight = ref(false)
const selected = ref({ A: false, B: false, C: false, D: false } as any)
const result = ref({ A: '', B: '', C: '', D: '' } as any)
//多选
const isMultiple = computed(() => {
  return data.questions[currentIndex.value].answer.length > 1
})
watch(currentIndex, () => {
  if (currentIndex.value >= data.questions.length) {
    questionStore.result = {
      questionRankName: '星月银0',
      rightAnswer: point.value.right,
      totalAnswer: data.questions.length
    }
    router.push('result')
  }
  selected.value = { A: false, B: false, C: false, D: false }
  result.value = { A: '', B: '', C: '', D: '' }
  answered.value = false
})
// 验证答案
function checkAnswer() {
  const rightAnswer = data.questions[currentIndex.value].answer
  isRight.value = true
  for (const key in selected.value) {
    if (selected.value[key] && !rightAnswer.includes(key)) {
      isRight.value = false
      result.value[key] = 'warning '
    }
    if (!selected.value[key] && rightAnswer.includes(key)) {
      isRight.value = false
      result.value[key] = 'success'
    }
  }
  if (isRight.value) {
    point.value.right += 1
    Snackbar.success(t('question.answer-right'))
  } else {
    Snackbar.warning(t('question.answer-wrong'))
  }
  answered.value = true
}
function clickAnswer(index: string) {
  if (!isMultiple.value) {
    console.log('单选')
    for (const key in selected.value) {
      selected.value[key] = false
    }
  }
  selected.value[index] = !selected.value[index]
}
</script>

<template>
  <!--题号，题目，ABCD-->
  <di class="__container">
    <div id="question">
      <var-progress :value="(currentIndex / data.questions.length) * 100" />
      <h2>
        {{ $t('question.question-number', [data.questions[currentIndex].id]) }}
        <var-chip v-for="text in data.questions[currentIndex].tag">
          {{ text }}
        </var-chip>
      </h2>
      <div id="text">
        <Markdown :content="data.questions[currentIndex].question" />
      </div>
    </div>
    <div id="actions">
      <div id="answers">
        <div
          class="answer"
          v-for="(answer, index) in data.questions[currentIndex].answers"
          @click="clickAnswer(index)">
          <var-chip
            block
            style="width: 100%"
            :type="
              result[index]
                ? result[index]
                : selected[index] == true
                  ? 'primary'
                  : 'default'
            ">
            <p style="cursor: pointer">{{ answer }}</p>
          </var-chip>
        </div>
      </div>
      <div>
        <var-button block v-if="isDev" type="primary" @click="currentIndex++">
          {{ $t('question.next-question') }}
        </var-button>
        <var-button block v-if="!answered" type="primary" @click="checkAnswer">
          {{ $t('question.submit-answer') }}
        </var-button>
        <var-button block v-else type="primary" @click="currentIndex++">
          {{ $t('question.next-question') }}
        </var-button>
      </div>
    </div>
  </di>
</template>

<style lang="css" scoped>
@import url('./answer.css');
</style>
