import { z } from "zod"

export type Matrix = {
  matrix: MatrixEntry,
  include?: MatrixEntry[],
  exclude?: MatrixEntry[],
}

export type MatrixEntry = {
  [key: string]: string[]
}

export const StrategySchema = z.object({
  strategy: z.object({
    matrix: z.record(z.array(z.string()))
  })
})
