<script setup>
import Intro from "@/components/CIntro.vue";
import Articles from "../../../docs/views/question/zh-CN.md?raw";
</script>

<template>
  <Intro :content="Articles" />
  <var-button block 
  round="false"
  class="question-bank"
  @click="$router.push('/quiz/answer')" type="primary">
    <h3>「星月银0」</h3>
    <br/>
    <p>共 40 题</p>
  </var-button>
</template>

<style lang="css" scoped>

@import url("./home.css");

</style>