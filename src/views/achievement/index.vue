<script setup lang="ts">
import { ref, watch } from 'vue'
import { searchAchievement, SearchPlatforms as D_SearchPlatform } from './index'
import AchievementData from '@/data/achievement/Achievement.json'
import _TextMap from '@/data/achievement/TextMap.json'
import type { t_AchievementGroup } from '@/data/achievement/types'
import { stringIndexOfIgnoreCase } from '@/script/tools'
import { useI18n } from 'vue-i18n'

const TextMap: any = _TextMap
const { locale } = useI18n()
const f_Versions: any = { '-1': AchievementData.versions }
for (const goal of AchievementData.data) {
  f_Versions[goal.order - 1] = goal.versions
}

const f_selectedGoal = ref(-1)
const f_searchPlatform = ref('miyoushe')
const f_search = ref({
  text: '',
  version: 'all',
  finished: 'all'
})
const pagination = ref({
  page: 1,
  pageSize: 20
})
watch(f_selectedGoal, () => {
  f_search.value.version = 'all'
})
const ui_SearchedAchievementList: any = ref([])
const ui_AchievementList: any = ref([])
function search() {
  let data: Array<any> = []
  if (f_selectedGoal.value == -1) {
    for (const goal of AchievementData.data) {
      data = data.concat(goal.achievementGroups)
    }
  } else {
    data = AchievementData.data[f_selectedGoal.value].achievementGroups
  }
  data = data.filter((achievements: t_AchievementGroup) => {
    let _version = true
    let _text = false
    if (!(f_search.value.version == 'all')) {
      if (!(achievements.version == f_search.value.version)) {
        _version = false
      }
    }
    if (f_search.value.text == '') {
      _text = true
    } else if (
      stringIndexOfIgnoreCase(
        TextMap[locale.value][achievements.name],
        f_search.value.text
      )
    ) {
      _text = true
    } else
      for (const achievement of achievements.achievements) {
        if (
          stringIndexOfIgnoreCase(
            TextMap[locale.value][achievement.description],
            f_search.value.text
          )
        ) {
          _text = true
        }
      }
    return _version && _text
  })
  ui_SearchedAchievementList.value = data
  pagination.value.page = 1
}
watch(
  [
    () => f_search.value.version,
    () => f_search.value.text,
    () => f_selectedGoal.value
  ],
  () => {
    search()
  },
  { immediate: true }
)
watch(
  [
    ui_SearchedAchievementList,
    () => pagination.value.page,
    () => pagination.value.pageSize
  ],
  () => {
    ui_AchievementList.value = ui_SearchedAchievementList.value.slice(
      (pagination.value.page - 1) * pagination.value.pageSize,
      pagination.value.page * pagination.value.pageSize
    )
  },
  { immediate: true }
)
</script>

<template>
  <div class="__container">
    <var-paper id="bar">
      <div id="form">
        <var-input
          variant="outlined"
          v-model="f_search.text"
          :placeholder="$t('achievement.search')"
          clearable></var-input>
        <br />
        <div style="display: flex; width: 100%; gap: 1em">
          <var-select
            style="flex: 1"
            :disabled="
              f_selectedGoal != -1 && f_Versions[f_selectedGoal].length == 1
            "
            variant="outlined"
            v-model="f_search.version"
            :placeholder="$t('achievement.select-version')">
            <var-option
              :value="'all'"
              :label="$t('achievement.all')"></var-option>
            <var-option
              v-for="version in f_Versions[f_selectedGoal]"
              :value="version"
              :label="version"></var-option>
          </var-select>
          <var-select
            disabled
            style="flex: 1"
            variant="outlined"
            v-model="f_search.finished"
            :placeholder="$t('achievement.finish.is-finished')">
            <var-option
              :value="'all'"
              :label="$t('achievement.all')"></var-option>
            <var-option
              :value="'unfinished'"
              :label="$t('achievement.finish.unfinished')"></var-option>
            <var-option
              :value="'unfinished'"
              :label="$t('achievement.finish.finished')"></var-option>
          </var-select>
        </div>
        <br />
        <var-select
          variant="outlined"
          v-model="f_searchPlatform"
          :placeholder="$t('achievement.platforms-to-search')">
          <var-option
            v-for="(value, key) in D_SearchPlatform"
            :value="key"
            :label="value.name"></var-option>
        </var-select>
        <br />
        <var-button block disabled type="primary">
          {{ $t('achievement.import-export') }}
        </var-button>
      </div>
      <br />
      <div id="goal-list">
        <var-cell
          :class="{ selected: f_selectedGoal === -1 }"
          border
          :value="-1"
          ripple
          @click="f_selectedGoal = -1">
          <p style="font-size: 120%">{{ $t('achievement.all') }}</p>
          <p>
            {{
              $t('achievement.numbers', [
                AchievementData.numberOfGroups,
                AchievementData.numberOfAchievements
              ])
            }}
          </p>
          <p></p>
        </var-cell>
        <var-cell
          border
          ripple
          v-for="(goal, index) in AchievementData.data"
          :class="{ selected: f_selectedGoal === index }"
          @click="f_selectedGoal = goal.order - 1">
          <p style="font-size: 120%">{{ TextMap[locale][goal.name] }}</p>
          <p>
            {{
              $t('achievement.numbers', [
                goal.numberOfGroups,
                goal.numberOfAchievements
              ])
            }}
          </p>
        </var-cell>
      </div>
    </var-paper>
    <div id="achievement">
      <var-paper id="pagination">
        <div>
          <var-pagination
            v-model:current="pagination.page"
            v-model:size="pagination.pageSize"
            :simple="false"
            :total="ui_SearchedAchievementList.length"
            :show-total="(total) => `共 ${total} 个成就组`" />
        </div>
      </var-paper>
      <div id="list">
        <div>
          <var-card v-for="(group, index) in ui_AchievementList" :key="index">
            <h2>
              {{ TextMap[locale][group.name] }}
              <var-chip>{{ group.version }}</var-chip>
            </h2>
            <div
              v-for="(achievement, index) in group.achievements"
              :key="index">
              <p>
                <span>
                  {{ achievement.rewards }}
                  <img style="height: 1em" src="./img/Primo.webp" />
                </span>
                {{ TextMap[locale][achievement.description] }}
              </p>
            </div>
            <var-space justify="flex-end">
              <var-button
                @click="
                  searchAchievement(
                    TextMap[locale][group.name],
                    f_searchPlatform
                  )
                ">
                {{
                  $t(
                    'achievement.search-with',
                    //@ts-ignore
                    [D_SearchPlatform[f_searchPlatform].name]
                  )
                }}
              </var-button>
            </var-space>
          </var-card>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('./index.css');
</style>
