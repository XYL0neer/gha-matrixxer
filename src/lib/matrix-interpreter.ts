import { type Matrix, type MatrixEntry } from "@/types/matrix";

export function interpretMatrix(m: Matrix) {
  const exclusions = m.exclude
  const result = []

  for (const v of newGenMatrix(m.matrix)) {
    if (exclusions !== undefined && matchExclusion(v, exclusions)) continue

    result.push(v)
  }

  return result
}

function matchExclusion(v: Record<string, string>, exclusions: Record<string, string>[]) {
  for (const exclude of exclusions) {
    const matches = Object.entries(exclude).every(([key, value]) => v[key] === value)
    if (matches) return true
  }
  return false
}

function* newGenMatrix(m: MatrixEntry) {
  const indexes = Object.keys(m).map(() => 0)
  const keys = Object.keys(m)
  const values = Object.values(m)
  let yieldCount = 0

  function increaseIndex() {
    for (let f = 0; f < indexes.length; f++) {
      indexes[f] += 1;
      if (indexes[f] < values[f].length) {
        break;
      }
      if (f + 1 >= indexes.length) {
        break;
      }

      indexes[f] = 0;
    }
  }

  for (let i = 0; i < indexes.length; i++) {
    if (values[i].length <= 1) continue;
    const iterations = values.reduce((prev, curr, index) => {
      if (index > i) return prev;
      return prev * curr.length;
    }, 1) - yieldCount
    let iterCount = 0

    while (iterCount < iterations) {
      const o: Record<string, string> = {}
      for (let j = 0; j < indexes.length; j++) {
        const key = keys[j]
        const value = m[key][indexes[j]]
        o[key] = value
      }
      increaseIndex()
      iterCount++
      yieldCount++
      yield o
    }
  }
}

