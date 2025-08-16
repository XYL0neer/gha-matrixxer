<script setup lang="ts">
import type { ContextfulMatrixValue } from '@/types/matrix'

const { entry } = defineProps<{ entry: ContextfulMatrixValue }>()
</script>
<template>
  <p>
    <span class="text-zinc font-bold">{{ entry.key }}: </span>
    <span>{{ JSON.stringify(entry.value) }}</span>
  </p>
</template>
