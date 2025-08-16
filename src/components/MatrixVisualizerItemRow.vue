<script setup lang="ts">
import type { MatrixValue } from '@/types/matrix'

const { property, value } = defineProps<{ property: string; value: MatrixValue }>()
</script>
<template>
  <p>
    <span class="text-zinc font-bold">{{ property }}: </span>
    <span>{{ JSON.stringify(value) }}</span>
  </p>
</template>
