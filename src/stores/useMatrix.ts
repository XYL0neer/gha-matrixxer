import { interpretMatrix } from '@/lib/matrix-interpreter'
import type { Matrix } from '@/types/matrix'
import { defineStore } from 'pinia'
import { computed, shallowRef } from 'vue'

export const useMatrix = defineStore('matrix', () => {
  const matrix = shallowRef<Matrix>()

  const resolvedMatrix = computed(() => {
    if (!matrix.value) {
      return []
    }
    return interpretMatrix(matrix.value)
  })

  function setMatrix(m: Matrix) {
    matrix.value = m
  }

  return { matrix, resolvedMatrix, setMatrix }
})
