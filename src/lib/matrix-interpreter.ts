import {
  type ContextfulMatrixValue,
  type Matrix,
  type MatrixDefinition,
  type MatrixEntry,
  type MatrixResult,
} from '@/types/matrix'
import isEqual from 'lodash-es/isEqual'

export function interpretMatrix(m: Matrix) {
  const exclusions = m.exclude
  const result: MatrixResult[] = []

  for (const v of newGenMatrix(m.matrix)) {
    const entry: MatrixResult = { entries: v }
    if (exclusions !== undefined) {
      const exclusionIndex = matchExclusion(v, exclusions)
      if (exclusionIndex != undefined) {
        entry.exclusionIndex = exclusionIndex
      }
    }

    console.debug('Add entry', v)
    result.push(entry)
  }
  if (m.include) {
    addInclusions(m.include, result, m.matrix)
  }

  console.log('Created matrix', result)
  return result
}

function addInclusions(
  inclusions: MatrixEntry[],
  result: MatrixResult[],
  matrix: MatrixDefinition,
) {
  const newEntries = []
  const matrixIsEmpty = Object.keys(matrix).length === 0
  for (const [includeIndex, include] of inclusions.entries()) {
    console.debug('Handle inclusion', include)
    const hasNewValueForExistingMatrixKey =
      matrixIsEmpty ||
      Object.entries(include).some(
        ([key, value]) => matrix.hasOwnProperty(key) && !matrix[key].some((e) => isEqual(e, value)),
      )
    const hasExtendableMatrixKeyValue = Object.entries(include).some(
      ([key, value]) => matrix.hasOwnProperty(key) && matrix[key].some((e) => isEqual(e, value)),
    )

    if (hasNewValueForExistingMatrixKey) {
      console.debug('Add as new Entry', include)
      newEntries.push({
        entries: Object.entries(include).map(
          ([key, value]) =>
            ({ value, key, index: includeIndex, from: 'include' }) satisfies ContextfulMatrixValue,
        ),
      })
    } else if (hasExtendableMatrixKeyValue) {
      console.debug('Add only on matching entries', include)
      result.forEach((value) => {
        const matchedKey = Object.entries(include).every(
          ([key, v]) =>
            !matrix.hasOwnProperty(key) ||
            value.entries.some((e) => e.key === key && isEqual(e.value, v)),
        )
        if (matchedKey) {
          console.debug('Add to object', value)
          value.entries.push(
            ...Object.entries(include)
              .filter(([key]) => !Object.keys(matrix).includes(key))
              .map(
                ([key, value]) =>
                  ({
                    value,
                    key,
                    index: includeIndex,
                    from: 'include',
                  }) satisfies ContextfulMatrixValue,
              ),
          )
        }
      })
    } else {
      console.debug('Add to all original entries', include)
      result.forEach((value) => {
        value.entries.push(
          ...Object.entries(include)
            .filter(([key]) => !Object.keys(matrix).includes(key))
            .map(
              ([key, value]) =>
                ({
                  value,
                  key,
                  index: includeIndex,
                  from: 'include',
                }) satisfies ContextfulMatrixValue,
            ),
        )
      })
    }
  }

  result.push(...newEntries)
}

function matchExclusion(v: ContextfulMatrixValue[], exclusions: MatrixEntry[]) {
  for (let i = 0; i < exclusions.length; i++) {
    const exclude = exclusions[i]
    const hasExclusion = Object.entries(exclude).every(([key, value]) =>
      isEqual(v.find((e) => e.key === key)?.value, value),
    )

    if (hasExclusion) {
      v.forEach((e) => {
        if (Object.keys(exclude).includes(e.key)) {
          e.isExcluded = true
        }
      })
      return i
    }
  }
}

function* newGenMatrix(m: MatrixDefinition) {
  const indexes = Object.keys(m).map(() => 0)
  const keys = Object.keys(m)
  const values = Object.values(m)
  let yieldCount = 0

  function increaseIndex() {
    for (let f = indexes.length - 1; f >= 0; f--) {
      indexes[f] += 1
      if (indexes[f] < values[f].length) {
        break
      }

      indexes[f] = 0
    }
  }

  for (let i = 0; i < indexes.length; i++) {
    if (values[i].length <= 1) continue
    const iterations =
      values.reduce((prev, curr, index) => {
        if (index > i) return prev
        return prev * curr.length
      }, 1) - yieldCount
    let iterCount = 0

    while (iterCount < iterations) {
      const o: ContextfulMatrixValue[] = []
      for (let j = 0; j < indexes.length; j++) {
        const key = keys[j]
        const value = m[key][indexes[j]]
        o.push({ value, key, index: indexes[j], from: 'matrix' })
      }
      increaseIndex()
      iterCount++
      yieldCount++
      yield o
    }
  }
}
