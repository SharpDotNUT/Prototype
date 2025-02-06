<script setup>

//console.clear()

import { ref, watch } from 'vue'

//import Achievement from '@/data/Snap.Metadata-main/Genshin/CHS/Achievement.json'

let data_loaded = false, Achievement = []
fetch('https://snap-hutao-meta-data.pages.dev/Genshin/CHS/Achievement.json').then(
    res => res.json().then(data => {
        Achievement = data
        data_loaded = true
    })
)

function AchievementIdToAchievementDataObject(id) {
    for (let i = 0; i < Achievement.length; i++) {
        if (Achievement[i].Id === id) {
            return Achievement[i]
        }
    }
    return {'Unknown':'Unknown'}
}

import UserAchievements from './uiaf-20240606202557 copy.json'
let userAchievements = UserAchievements.list
let achievementList = ref()

function render() {
    achievementList.value = []
    userAchievements = userAchievements.filter(achievement => achievement.timestamp !== 0)
    userAchievements.sort((a, b) => a.timestamp - b.timestamp)
    console.log(achievementList.value)
    for (let i = 0; i < userAchievements.length; i++) {
        let achievement = userAchievements[i]
        let achievementDataObject = AchievementIdToAchievementDataObject(achievement.id)
        let time = new Date(achievement.timestamp * 1000).toLocaleString()
        achievementList.value.push({
            data: achievementDataObject,
            timestamp: time
        })
    }
    console.log(achievementList.value)
}

const user_upload = ref()

watch(user_upload, (file) => {
    console.log(file)
    if (file.length > 0) {
        let reader = new FileReader()
        reader.readAsText(file[0].file, 'UTF-8')
        reader.onload = function (evt) {
            let json = JSON.parse(evt.target.result)
            userAchievements = json.list
            render()
        }
    }
})

</script>

<template>

    <var-uploader accept="application/json" v-model="user_upload"></var-uploader>

    <var-icon name="app"></var-icon>

    <var-card>
    </var-card>

    <var-card v-for="achievement in achievementList" :key="achievement.timestamp">

        
    </var-card>

    <var-chip>为什么</var-chip>

</template>