import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useQuestionStore = defineStore('question', () => {
  const result = ref({
    questionRankName: '',
    rightAnswer: 0,
    totalAnswer: 0
  })
  return {
    result
  }
})
