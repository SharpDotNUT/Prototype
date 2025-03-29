<template>
  <div class="update-log-container">
    <div class="filters">
      <div>
        <var-select v-model="selectedMajor" :placeholder="$t('update-log.major-versions')">
          <var-option value="All" :label="$t('global.all')"></var-option>
          <var-option
            v-for="majorVersion in majorVersions"
            :value="majorVersion"
            :label="majorVersion + '.x'"></var-option>
        </var-select>
        <var-select
          v-model="selectedMinor"
          :placehupdate-log.minor-versionse-log.minor')"
          :disabled="selectedMajor === 'All'">
          <var-option value="All" :label="$t('global.all')"></var-option>
          <var-option
            v-for="minorVersion in minorVersions"
            :value="minorVersion"
            :label="selectedMajor + '.' + minorVersion + '.x'"></var-option>
        </var-select>
      </div>
      <div>
        <var-select
          v-model="selectedAreas"
          :placeholder="$t('update-log.area')"
          multiple>
          <var-option
            v-for="area in allAreas"
            :key="area"
            :label="area"
            :value="area"></var-option>
        </var-select>
        <var-select
          v-model="selectedTypes"
          :placeholder="$t('update-log.type')"
          multiple>
          <var-option
            v-for="type in allTypes"
            :key="type"
            :value="type"
            :label="type"></var-option>
        </var-select>
      </div>
    </div>
    <br />
    <div class="list">
      <template v-if="filteredLogs.length > 0">
        <var-card
          v-for="log in filteredLogs"
          :key="log.version"
          class="version">
          <div class="version-content">
            <h1>
              <span style="font-family: JetBrains Mono">
                {{ log.version }}
              </span>
              <span v-if="log['name-zh']">
                &nbsp- {{ log['name-zh'] }} {{ log['name-en'] }}
              </span>
            </h1>
            <h3 style="display: flex; align-items: center">
              <span class="date">{{ formatDate(log.date) }}</span>
              <span v-if="log.version.endsWith('.0.0')">&nbsp</span>
              <var-chip type="primary" v-if="log.version.endsWith('.0.0')">
                {{ $t('update-log.major-version') }}
              </var-chip>
              <span v-if="log.version.endsWith('.0')">&nbsp</span>
              <var-chip type="success" v-if="log.version.endsWith('.0')">
                {{ $t('update-log.minor-version') }}
              </var-chip>
            </h3>
            <var-divider />
            <div>
              <div
                v-for="(item, itemIndex) in log.items"
                :key="itemIndex"
                class="change-item">
                <div class="change-meta">
                  <var-chip size="small" type="primary" class="area">
                    {{$t('update-log.area')}} : {{ item.area }}
                  </var-chip>
                  <span>&nbsp</span>
                  <var-chip
                    size="small"
                    :color="colors[item.type]"
                    text-color="#e9dbff"
                    class="type">
                    {{ $t('update-log.type') }} : {{ item.type }}
                  </var-chip>
                </div>
                <div style="margin: 10px 0; font-size: 1.5em">
                  <p>{{ item['content-zh'] }}</p>
                  <p>{{ item['content-en'] }}</p>
                </div>
              </div>
            </div>
            <var-divider />
            <div
              v-if="log.commits && log.commits.length > 0"
              class="commits-section">
              <h3>Commits:</h3>
              <ul>
                <var-link
                  v-for="(commit, commitIndex) in log.commits"
                  :href="`https://github.com/${Meta.repo}/commit/${commit}`"
                  target="_blank"
                  :key="commitIndex">
                  {{ commit }}
                </var-link>
              </ul>
            </div>
          </div>
        </var-card>
      </template>
      <div v-else class="no-results">No results found.</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Meta from '@/meta'
import UpdateLogsData from '@/data/update_logs/logs'
import { watch } from 'vue'

const UpdateLogs = UpdateLogsData.sort(
  // 根据 版本号降序排序
  (a, b) => {
    const [aMajor, aMinor, aPatch] = a.version.split('.').map(Number)
    const [bMajor, bMinor, bPatch] = b.version.split('.').map(Number)
    return bMajor - aMajor || bMinor - aMinor || bPatch - aPatch
  }
)

const { locale } = useI18n()

// 筛选状态
const selectedMajor = ref('All')
const selectedMinor = ref('All')
const selectedAreas: Ref<string[]> = ref([])
const selectedTypes: Ref<string[]> = ref([])

// 计算属性
const majorVersions = computed(() => {
  const versions = new Set()
  UpdateLogs.forEach((log) => {
    const [major] = log.version.split('.')
    versions.add(major)
  })
  return Array.from(versions).sort((a: any, b: any) => b - a)
})

const minorVersions = computed(() => {
  const versions = new Set()
  UpdateLogs.forEach((log) => {
    const [major, minor] = log.version.split('.')
    if (major === selectedMajor.value || selectedMajor.value === 'All') {
      versions.add(minor)
    }
  })
  return Array.from(versions).sort((a: any, b: any) => b - a)
})

const allAreas = computed(() => {
  const areas = new Set()
  UpdateLogs.forEach((log: { items: any[] }) => {
    log.items.forEach((item: { area: unknown }) => {
      areas.add(item.area)
    })
  })
  return Array.from(areas).sort()
})

const allTypes = computed(() => {
  const types = new Set()
  UpdateLogs.forEach((log: { items: any[] }) => {
    log.items.forEach((item: { type: unknown }) => {
      types.add(item.type)
    })
  })
  return Array.from(types).sort()
})

const filteredLogs = computed(() => {
  return UpdateLogs.filter((log) => {
    // 版本筛选
    const [major, minor] = log.version.split('.')

    // 主版本筛选
    if (selectedMajor.value !== 'All' && major !== selectedMajor.value) {
      return false
    }

    // 次版本筛选
    if (
      selectedMajor.value !== 'All' &&
      selectedMinor.value !== 'All' &&
      minor !== selectedMinor.value
    ) {
      return false
    }

    // 如果没有任何区域或类型被选中，则显示所有项目
    if (selectedAreas.value.length === 0 && selectedTypes.value.length === 0) {
      return true
    }

    // 检查日志项是否包含任何选中的区域或类型
    const hasMatchingItems = log.items.some((item) => {
      const areaMatch =
        selectedAreas.value.length === 0 ||
        selectedAreas.value.includes(item.area)
      const typeMatch =
        selectedTypes.value.length === 0 ||
        selectedTypes.value.includes(item.type)
      return areaMatch && typeMatch
    })

    return hasMatchingItems
  })
    .map((log) => {
      // 如果筛选了区域或类型，只显示匹配的项目
      if (selectedAreas.value.length > 0 || selectedTypes.value.length > 0) {
        return {
          ...log,
          items: log.items.filter((item) => {
            const areaMatch =
              selectedAreas.value.length === 0 ||
              selectedAreas.value.includes(item.area)
            const typeMatch =
              selectedTypes.value.length === 0 ||
              selectedTypes.value.includes(item.type)
            return areaMatch && typeMatch
          })
        }
      }
      return log
    })
    .filter((log) => log.items.length > 0) // 确保只返回有项目的日志
})

const formatDate = (timestamp: string | number | Date) => {
  return new Date(timestamp).toLocaleDateString(locale.value, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

watch(selectedMajor, () => {
  selectedMinor.value = 'All'
})

const colors = {
  'UI & UX': '#6f42c1',
  'Bug Fix': '#d73a49',
  Feature: '#28a745',
  Performance: '#005cc5',
  Others: '#a0a000'
}
</script>

<style scoped>
@import url('./index.css');
</style>
