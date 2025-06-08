import { z } from 'zod'

export type Matrix = {
  matrix: MatrixDefinition
  include?: MatrixEntry[]
  exclude?: MatrixEntry[]
}

export type MatrixDefinition = {
  [key: string]: MatrixValue[]
}

export type MatrixEntry = Record<string, MatrixValue>
export type MatrixValue = string | number | object

export const StrategySchema = z.object({
  strategy: z.object({
    matrix: z.unknown(),
  }),
})
