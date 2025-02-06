
<script setup>

import { RouterView } from 'vue-router';
import { useMainStore } from '@/stores/main';

const mainStore = useMainStore()

</script>

<template>
    <RouterView />
</template>