import { z } from 'zod'

export type Matrix = {
  matrix: MatrixDefinition
  include?: MatrixEntry[]
  exclude?: MatrixEntry[]
}

export type MatrixDefinition = {
  [key: string]: MatrixValue[]
}
export type MatrixValue = string | number | object

export type MatrixEntry = Record<string, MatrixValue>
export type MatrixResult = {
  entries: ContextfulMatrixValue[]
  exclusionIndex?: number
}
export type ContextfulMatrixValue = {
  value: string | number | object
  from: 'matrix' | 'include'
  index: number
  key: string
  isExcluded?: true
}

export const StrategySchema = z.object({
  strategy: z.object({
    matrix: z.unknown(),
  }),
})
