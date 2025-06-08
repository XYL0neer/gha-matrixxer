import { type Matrix, StrategySchema } from "@/types/matrix"
import { ref, computed } from "vue"
import { parse } from "yaml"

export function useMatrixParser() {
  const input = ref("")

  const matrix = computed(() => {
    const m: Matrix = { matrix: {} }
    try {
      const yaml = parse(input.value)
      const s = StrategySchema.parse(yaml)
      m.matrix = s.strategy.matrix
    } catch (error) {
      console.warn("Failed to parse input", error)
    }
    return m
  })

  return { input, matrix }


}
