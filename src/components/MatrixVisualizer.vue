<script setup lang="ts">
import MatrixVisualizerItem from './MatrixVisualizerItem.vue'
import { useMatrix } from '@/stores/useMatrix'
import { storeToRefs } from 'pinia'

const matrixStore = useMatrix()
const { resolvedMatrix } = storeToRefs(matrixStore)
</script>

<template>
  <ul class="grid grid-cols-4 gap-4">
    <MatrixVisualizerItem
      v-for="entry of resolvedMatrix"
      :key="JSON.stringify(entry)"
      :entry="entry"
    >
    </MatrixVisualizerItem>
  </ul>
</template>
