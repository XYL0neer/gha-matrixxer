import { type Matrix, type MatrixDefinition, type MatrixEntry } from '@/types/matrix'
import isEqual from 'lodash-es/isEqual'

export function interpretMatrix(m: Matrix) {
  const exclusions = m.exclude
  const result = []

  for (const v of newGenMatrix(m.matrix)) {
    if (exclusions !== undefined && matchExclusion(v, exclusions)) {
      console.debug('Exclude entry', v)
      continue
    }

    console.debug('Add entry', v)
    result.push(v)
  }
  if (m.include) {
    addInclusions(m.include, result, m.matrix)
  }

  console.log('Created matrix', result)
  return result
}

function addInclusions(inclusions: MatrixEntry[], result: MatrixEntry[], matrix: MatrixDefinition) {
  const newEntries = []
  const matrixIsEmpty = Object.keys(matrix).length === 0
  for (const include of inclusions) {
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
      newEntries.push(include)
      console.debug('Add only on matching entries', include)
    } else if (hasExtendableMatrixKeyValue) {
      result.forEach((value) => {
        const matchedKey = Object.entries(include).every(
          ([key, v]) => !matrix.hasOwnProperty(key) || isEqual(value[key], v),
        )
        if (matchedKey) {
          console.debug('Add to object', value)
          Object.assign(value, include)
        }
      })
    } else {
      console.debug('Add to all original entries', include)
      result.forEach((value) => {
        extendObject(value, include)
      })
    }
  }

  result.push(...newEntries)
}

function extendObject(obj1: MatrixEntry, obj2: MatrixEntry) {
  Object.keys(obj2).forEach((currentKey) => {
    if (!obj1[currentKey]) {
      obj1[currentKey] = obj2[currentKey]
    }
  })
}

function matchExclusion(v: MatrixEntry, exclusions: MatrixEntry[]) {
  for (const exclude of exclusions) {
    const matches = Object.entries(exclude).every(([key, value]) => isEqual(v[key], value))
    if (matches) return true
  }
  return false
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
      const o: MatrixEntry = {}
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
