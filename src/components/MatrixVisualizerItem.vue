<script setup lang="ts">
import { Card, CardHeader } from '@/components/ui/card'
import type { MatrixEntry } from '@/types/matrix'
import { defineProps, useId } from 'vue'

const { entry } = defineProps<{ entry: MatrixEntry }>()
const id = useId()
</script>

<template>
  <li>
    <Card>
      <CardHeader>
        <p v-for="[key, value] of Object.entries(entry)" :key="`${id}-${key}`">
          <span class="text-zinc font-bold">{{ key }}: </span>
          <span v-if="typeof value == 'string'" class="text-green">{{ value }}</span>
          <span v-if="typeof value == 'number'" class="text-orange">{{ value }}</span>
          <span v-if="typeof value == 'object'" class="text-violet">{{
            JSON.stringify(value)
          }}</span>
        </p>
      </CardHeader>
    </Card>
  </li>
</template>
