<script setup lang="ts">
import MatrixVisualizerItem from './MatrixVisualizerItem.vue'
import { useMatrix } from '@/stores/useMatrix'
import { storeToRefs } from 'pinia'
import { Switch } from './ui/switch'
import { Label } from './ui/label'
import { computed, ref } from 'vue'

const matrixStore = useMatrix()
const { resolvedMatrix } = storeToRefs(matrixStore)
const showExcludedResults = ref(false)
const filteredResultMatrix = computed(() => {
  if (!showExcludedResults.value) {
    return resolvedMatrix.value.filter((r) => r.exclusionIndex === undefined)
  }

  return resolvedMatrix.value
})
</script>

<template>
  <div class="flex items-center space-x-2">
    <Switch id="show-excluded-results" v-model="showExcludedResults" />
    <Label id="show-excluded-results">Show exclusions</Label>
  </div>
  <ul class="grid grid-cols-4 mt-4 gap-4">
    <MatrixVisualizerItem
      v-for="result of filteredResultMatrix"
      :key="JSON.stringify(result)"
      :result="result"
    >
    </MatrixVisualizerItem>
  </ul>
</template>
