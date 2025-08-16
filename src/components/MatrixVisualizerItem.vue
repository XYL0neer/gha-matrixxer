<script setup lang="ts">
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Badge, type BadgeVariants } from '@/components/ui/badge'
import type { MatrixResult } from '@/types/matrix'
import { computed, defineProps, useId } from 'vue'
import MatrixVisualizerItemRow from './MatrixVisualizerItemRow.vue'

const { result } = defineProps<{ result: MatrixResult }>()
const id = useId()
const resultBadgeProps = computed((): { label: string; variant: BadgeVariants['variant'] } => {
  if (result.exclusionIndex != undefined) {
    return { label: 'Excluded', variant: 'destructive' }
  }

  if (result.entries.every((e) => e.from === 'include')) {
    return { label: 'Included', variant: 'secondary' }
  }

  return { label: 'Matrix', variant: 'default' }
})
</script>

<template>
  <li>
    <Card>
      <CardHeader>
        <p>
          <Badge :variant="resultBadgeProps.variant">{{ resultBadgeProps.label }}</Badge>
        </p>
      </CardHeader>
      <CardContent>
        <MatrixVisualizerItemRow v-for="e of result.entries" :entry="e" :key="`${id}-${e.key}`" />
      </CardContent>
    </Card>
  </li>
</template>
