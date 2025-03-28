<template>
  <div class="__container">
    <!-- 工具栏 -->
    <div class="toolbar">
      <var-button @click="exportJson" class="export-button">
        导出 JSON
      </var-button>
      <var-button @click="addVersion" class="add-button">添加版本</var-button>
    </div>

    <!-- 版本列表 -->
    <div v-for="(item, index) in data" :key="item.version" class="item">
      <div class="version-header">
        <h3 class="version">{{ item.version }}</h3>
        <div class="actions">
          <var-button @click="moveVersionUp(index)" class="action-button">
            ⬆️
          </var-button>
          <var-button @click="moveVersionDown(index)" class="action-button">
            ⬇️
          </var-button>
          <var-button @click="deleteVersion(index)" class="action-button">
            ❌
          </var-button>
        </div>
      </div>

      <div v-if="editable" class="editable-section">
        <var-input v-model="item.name" placeholder="名称" class="input-field" />
        <var-input
          textarea
          v-model="item.description"
          placeholder="描述"
          class="textarea-field"></var-input>
        <var-input
          textarea
          v-model="item.description_en"
          placeholder="英文描述"
          class="textarea-field"></var-input>

        <div
          v-for="(change, changeIndex) in item.changes"
          :key="change.commit_id"
          class="change">
          <div class="change-header">
            <var-input
              v-model="change.commit_id"
              placeholder="Commit ID"
              class="input-field" />
            <div class="actions">
              <var-button
                @click="moveChangeUp(index, changeIndex)"
                class="action-button">
                ⬆️
              </var-button>
              <var-button
                @click="moveChangeDown(index, changeIndex)"
                class="action-button">
                ⬇️
              </var-button>
              <var-button
                @click="deleteChange(index, changeIndex)"
                class="action-button">
                ❌
              </var-button>
            </div>
          </div>

          <div
            v-for="(detail, detailIndex) in change.changes"
            :key="detailIndex"
            class="detail">
            <var-input
              v-model="detail.type"
              placeholder="类型"
              class="input-field" />
            <var-input
              v-model="detail.scope"
              placeholder="范围"
              class="input-field" />
            <var-input
              textarea
              v-model="detail.description"
              placeholder="描述"
              class="textarea-field"></var-input>
            <var-input
              textarea
              v-model="detail.description_en"
              placeholder="英文描述"
              class="textarea-field"></var-input>
          </div>
          <var-button
            @click="addChangeDetail(index, changeIndex)"
            class="add-detail-button">
            添加变更详情
          </var-button>
        </div>
        <var-button @click="addChange(index)" class="add-change-button">
          添加变更
        </var-button>
      </div>

      <div v-else class="preview-section">
        <p class="name">{{ item.name }}</p>
        <p class="description">{{ item.description }}</p>
        <p class="description-en">{{ item.description_en }}</p>

        <div
          v-for="(change, changeIndex) in item.changes"
          :key="change.commit_id"
          class="change">
          <p class="commit-id">
            <strong>Commit ID:</strong>
            {{ change.commit_id }}
          </p>
          <div
            v-for="(detail, detailIndex) in change.changes"
            :key="detailIndex"
            class="detail">
            <p>
              <strong>类型:</strong>
              {{ detail.type }}
            </p>
            <p>
              <strong>范围:</strong>
              {{ detail.scope }}
            </p>
            <p>
              <strong>描述:</strong>
              {{ detail.description }}
            </p>
            <p>
              <strong>英文描述:</strong>
              {{ detail.description_en }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 定义 props
const props = defineProps({
  editable: {
    type: Boolean,
    default: true
  }
})

import Update_log from '@/docs/update_log/changes.json'

// 元数据
const data = ref(Update_log)

// 添加版本
const addVersion = () => {
  data.value.push({
    version: `新版本 ${data.value.length + 1}`,
    name: '',
    changes: []
  })
}

// 删除版本
const deleteVersion = (index) => {
  data.value.splice(index, 1)
}

// 上移版本
const moveVersionUp = (index) => {
  if (index > 0) {
    const temp = data.value[index]
    data.value[index] = data.value[index - 1]
    data.value[index - 1] = temp
  }
}

// 下移版本
const moveVersionDown = (index) => {
  if (index < data.value.length - 1) {
    const temp = data.value[index]
    data.value[index] = data.value[index + 1]
    data.value[index + 1] = temp
  }
}

// 添加变更
const addChange = (versionIndex) => {
  data.value[versionIndex].changes.push({
    commit_id: `commit_${data.value[versionIndex].changes.length + 1}`,
    changes: []
  })
}

// 删除变更
const deleteChange = (versionIndex, changeIndex) => {
  data.value[versionIndex].changes.splice(changeIndex, 1)
}

// 上移变更
const moveChangeUp = (versionIndex, changeIndex) => {
  if (changeIndex > 0) {
    const temp = data.value[versionIndex].changes[changeIndex]
    data.value[versionIndex].changes[changeIndex] =
      data.value[versionIndex].changes[changeIndex - 1]
    data.value[versionIndex].changes[changeIndex - 1] = temp
  }
}

// 下移变更
const moveChangeDown = (versionIndex, changeIndex) => {
  if (changeIndex < data.value[versionIndex].changes.length - 1) {
    const temp = data.value[versionIndex].changes[changeIndex]
    data.value[versionIndex].changes[changeIndex] =
      data.value[versionIndex].changes[changeIndex + 1]
    data.value[versionIndex].changes[changeIndex + 1] = temp
  }
}

// 添加变更详情
const addChangeDetail = (versionIndex, changeIndex) => {
  data.value[versionIndex].changes[changeIndex].changes.push({
    type: '',
    scope: '',
    description: '',
    description_en: ''
  })
}

// 导出 JSON 文件
const exportJson = () => {
  const jsonString = JSON.stringify(data.value, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'data.json'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped></style>
