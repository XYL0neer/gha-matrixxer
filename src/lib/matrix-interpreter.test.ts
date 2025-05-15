import type { Matrix } from "@/types/matrix"
import { describe, expect, test } from "vitest"
import { interpretMatrix } from "./matrix-interpreter"

describe("matrixInterpreter", () => {
  test("basic", () => {
    expect(1 + 1).toBe(2)
  })
  test("Simple matrix", () => {
    const matrix: Matrix = {
      matrix: {
        color: ["red", "green"]
      }
    }
    const expected = [{ color: "red" }, { color: "green" }]

    const result = interpretMatrix(matrix)

    expect(result).toStrictEqual(expected)
  })
  test("2 Dimensional matrix with 2 and 1 elements", () => {
    const matrix: Matrix = {
      matrix: {
        animal: ["cat", "dog"],
        color: ["red"],
      }
    }
    const expected = [{ animal: "cat", color: "red" }, { animal: "dog", color: "red" }]

    const result = interpretMatrix(matrix)

    expect(result).toStrictEqual(expected)
  })
  test("2 Dimensional matrix, with 2 and 2 elements", () => {
    const matrix: Matrix = {
      matrix: {
        animal: ["cat", "dog"],
        color: ["red", "green"],
      }
    }
    const expected = [{ animal: "cat", color: "red" }, { animal: "dog", color: "red" }, { animal: "cat", color: "green" }, { animal: "dog", color: "green" }]

    const result = interpretMatrix(matrix)

    expect(result).toStrictEqual(expected)
  })
  test("3 Dimensional matrix, with 2 2 2 elements", () => {
    const matrix: Matrix = {
      matrix: {
        animal: ["cat", "dog"],
        color: ["red", "green"],
        other: ["one", "two"]
      }
    }
    const expected = [{ animal: "cat", color: "red", other: "one" }, { animal: "dog", color: "red", other: "one" }, { animal: "cat", color: "green", other: "one" }, { animal: "dog", color: "green", other: "one" }, { animal: "cat", color: "red", other: "two" }, { animal: "dog", color: "red", other: "two" }, { animal: "cat", color: "green", other: "two" }, { animal: "dog", color: "green", other: "two" }]

    const result = interpretMatrix(matrix)

    expect(result).toStrictEqual(expected)
  })
})
