import type { Matrix } from '@/types/matrix'
import { describe, expect, test } from 'vitest'
import { interpretMatrix } from './matrix-interpreter'

describe('Matrix examples from official docs https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/running-variations-of-jobs-in-a-workflow', () => {
  test('First Matrix example', () => {
    const matrix: Matrix = {
      matrix: {
        version: [10, 12, 14],
        os: ['ubuntu-latest', 'windows-latest'],
      },
    }

    const expected = [
      {
        entries: [
          { value: 10, from: 'matrix', key: 'version', index: 0 },
          { value: 'ubuntu-latest', from: 'matrix', key: 'os', index: 0 },
        ],
      },
      {
        entries: [
          { value: 10, from: 'matrix', key: 'version', index: 0 },
          { value: 'windows-latest', from: 'matrix', key: 'os', index: 1 },
        ],
      },
      {
        entries: [
          { value: 12, from: 'matrix', key: 'version', index: 1 },
          { value: 'ubuntu-latest', from: 'matrix', key: 'os', index: 0 },
        ],
      },
      {
        entries: [
          { value: 12, from: 'matrix', key: 'version', index: 1 },
          { value: 'windows-latest', from: 'matrix', key: 'os', index: 1 },
        ],
      },
      {
        entries: [
          { value: 14, from: 'matrix', key: 'version', index: 2 },
          { value: 'ubuntu-latest', from: 'matrix', key: 'os', index: 0 },
        ],
      },
      {
        entries: [
          { value: 14, from: 'matrix', key: 'version', index: 2 },
          { value: 'windows-latest', from: 'matrix', key: 'os', index: 1 },
        ],
      },
    ]

    const result = interpretMatrix(matrix)

    expect(result).toStrictEqual(expected)
  })
  test('Single-dimension matrix', () => {
    const matrix: Matrix = {
      matrix: {
        version: [10, 12, 14],
      },
    }

    const expected = [
      { entries: [{ value: 10, key: 'version', index: 0, from: 'matrix' }] },
      { entries: [{ value: 12, key: 'version', index: 1, from: 'matrix' }] },
      { entries: [{ value: 14, key: 'version', index: 2, from: 'matrix' }] },
    ]

    const result = interpretMatrix(matrix)

    expect(result).toStrictEqual(expected)
  })
  test('Mutli-dimension matrix', () => {
    const matrix: Matrix = {
      matrix: {
        os: ['ubuntu-22.04', 'ubuntu-20.04'],
        version: [10, 12, 14],
      },
    }

    const expected = [
      {
        entries: [
          { value: 'ubuntu-22.04', key: 'os', index: 0, from: 'matrix' },
          { value: 10, key: 'version', index: 0, from: 'matrix' },
        ],
      },
      {
        entries: [
          { value: 'ubuntu-22.04', key: 'os', index: 0, from: 'matrix' },
          { value: 12, key: 'version', index: 1, from: 'matrix' },
        ],
      },
      {
        entries: [
          { value: 'ubuntu-22.04', key: 'os', index: 0, from: 'matrix' },
          { value: 14, key: 'version', index: 2, from: 'matrix' },
        ],
      },
      {
        entries: [
          { value: 'ubuntu-20.04', key: 'os', index: 1, from: 'matrix' },
          { value: 10, key: 'version', index: 0, from: 'matrix' },
        ],
      },
      {
        entries: [
          { value: 'ubuntu-20.04', key: 'os', index: 1, from: 'matrix' },
          { value: 12, key: 'version', index: 1, from: 'matrix' },
        ],
      },
      {
        entries: [
          { value: 'ubuntu-20.04', key: 'os', index: 1, from: 'matrix' },
          { value: 14, key: 'version', index: 2, from: 'matrix' },
        ],
      },
    ]

    const result = interpretMatrix(matrix)

    expect(result).toStrictEqual(expected)
  })
  test('Array of objects', () => {
    const matrix: Matrix = {
      matrix: {
        os: ['ubuntu-latest', 'macos-latest'],
        node: [{ version: 14 }, { version: 20, env: 'NODE_OPTIONS=--openssl-legacy-provider' }],
      },
    }

    const expected = [
      {
        entries: [
          { value: 'ubuntu-latest', key: 'os', index: 0, from: 'matrix' },
          { value: { version: 14 }, key: 'node', index: 0, from: 'matrix' },
        ],
      },
      {
        entries: [
          { value: 'ubuntu-latest', key: 'os', index: 0, from: 'matrix' },
          {
            value: { version: 20, env: 'NODE_OPTIONS=--openssl-legacy-provider' },
            key: 'node',
            index: 1,
            from: 'matrix',
          },
        ],
      },
      {
        entries: [
          { value: 'macos-latest', key: 'os', index: 1, from: 'matrix' },
          { value: { version: 14 }, key: 'node', index: 0, from: 'matrix' },
        ],
      },
      {
        entries: [
          { value: 'macos-latest', key: 'os', index: 1, from: 'matrix' },
          {
            value: { version: 20, env: 'NODE_OPTIONS=--openssl-legacy-provider' },
            key: 'node',
            index: 1,
            from: 'matrix',
          },
        ],
      },
    ]

    const result = interpretMatrix(matrix)

    expect(result).toStrictEqual(expected)
  })

  test('Basic example for inclusion', () => {
    const matrix: Matrix = {
      matrix: {
        fruit: ['apple', 'pear'],
        animal: ['cat', 'dog'],
      },
      include: [
        { color: 'green' },
        { color: 'pink', animal: 'cat' },
        { fruit: 'apple', shape: 'circle' },
        { fruit: 'banana' },
        { fruit: 'banana', animal: 'cat' },
      ],
    }
    const expected = [
      {
        entries: [
          { value: 'apple', key: 'fruit', index: 0, from: 'matrix' },
          { value: 'cat', key: 'animal', index: 0, from: 'matrix' },
          { value: 'green', key: 'color', index: 0, from: 'include' },
          { value: 'pink', key: 'color', index: 1, from: 'include' },
          { value: 'circle', key: 'shape', index: 2, from: 'include' },
        ],
      },
      {
        entries: [
          { value: 'apple', key: 'fruit', index: 0, from: 'matrix' },
          { value: 'dog', key: 'animal', index: 1, from: 'matrix' },
          { value: 'green', key: 'color', index: 0, from: 'include' },
          { value: 'circle', key: 'shape', index: 2, from: 'include' },
        ],
      },
      {
        entries: [
          { value: 'pear', key: 'fruit', index: 1, from: 'matrix' },
          { value: 'cat', key: 'animal', index: 0, from: 'matrix' },
          { value: 'green', key: 'color', index: 0, from: 'include' },
          { value: 'pink', key: 'color', index: 1, from: 'include' },
        ],
      },
      {
        entries: [
          { value: 'pear', key: 'fruit', index: 1, from: 'matrix' },
          { value: 'dog', key: 'animal', index: 1, from: 'matrix' },
          { value: 'green', key: 'color', index: 0, from: 'include' },
        ],
      },
      { entries: [{ value: 'banana', key: 'fruit', index: 3, from: 'include' }] },
      {
        entries: [
          { value: 'banana', key: 'fruit', index: 4, from: 'include' },
          { value: 'cat', key: 'animal', index: 4, from: 'include' },
        ],
      },
    ]

    const result = interpretMatrix(matrix)

    expect(result).toStrictEqual(expected)
  })
  test('Example Expanding configurations', () => {
    const matrix: Matrix = {
      matrix: {
        os: ['windows-latest', 'ubuntu-latest'],
        node: [14, 16],
      },
      include: [{ os: 'windows-latest', node: 16, npm: 6 }],
    }

    const expected = [
      {
        entries: [
          { value: 'windows-latest', key: 'os', index: 0, from: 'matrix' },
          { value: 14, key: 'node', index: 0, from: 'matrix' },
        ],
      },
      {
        entries: [
          { value: 'windows-latest', key: 'os', index: 0, from: 'matrix' },
          { value: 16, key: 'node', index: 1, from: 'matrix' },
          { value: 6, key: 'npm', index: 0, from: 'include' },
        ],
      },
      {
        entries: [
          { value: 'ubuntu-latest', key: 'os', index: 1, from: 'matrix' },
          { value: 14, key: 'node', index: 0, from: 'matrix' },
        ],
      },
      {
        entries: [
          { value: 'ubuntu-latest', key: 'os', index: 1, from: 'matrix' },
          { value: 16, key: 'node', index: 1, from: 'matrix' },
        ],
      },
    ]

    const result = interpretMatrix(matrix)

    expect(result).toStrictEqual(expected)
  })
  test('Example Adding configurations', () => {
    const matrix: Matrix = {
      matrix: {
        os: ['macos-latest', 'windows-latest', 'ubuntu-latest'],
        version: [12, 14, 16],
      },
      include: [{ os: 'windows-latest', version: 17 }],
    }

    const expected = [
      {
        entries: [
          { value: 'macos-latest', key: 'os', index: 0, from: 'matrix' },
          { value: 12, key: 'version', index: 0, from: 'matrix' },
        ],
      },
      {
        entries: [
          { value: 'macos-latest', key: 'os', index: 0, from: 'matrix' },
          { value: 14, key: 'version', index: 1, from: 'matrix' },
        ],
      },
      {
        entries: [
          { value: 'macos-latest', key: 'os', index: 0, from: 'matrix' },
          { value: 16, key: 'version', index: 2, from: 'matrix' },
        ],
      },
      {
        entries: [
          { value: 'windows-latest', key: 'os', index: 1, from: 'matrix' },
          { value: 12, key: 'version', index: 0, from: 'matrix' },
        ],
      },
      {
        entries: [
          { value: 'windows-latest', key: 'os', index: 1, from: 'matrix' },
          { value: 14, key: 'version', index: 1, from: 'matrix' },
        ],
      },
      {
        entries: [
          { value: 'windows-latest', key: 'os', index: 1, from: 'matrix' },
          { value: 16, key: 'version', index: 2, from: 'matrix' },
        ],
      },
      {
        entries: [
          { value: 'ubuntu-latest', key: 'os', index: 2, from: 'matrix' },
          { value: 12, key: 'version', index: 0, from: 'matrix' },
        ],
      },
      {
        entries: [
          { value: 'ubuntu-latest', key: 'os', index: 2, from: 'matrix' },
          { value: 14, key: 'version', index: 1, from: 'matrix' },
        ],
      },
      {
        entries: [
          { value: 'ubuntu-latest', key: 'os', index: 2, from: 'matrix' },
          { value: 16, key: 'version', index: 2, from: 'matrix' },
        ],
      },
      {
        entries: [
          { value: 'windows-latest', key: 'os', index: 0, from: 'include' },
          { value: 17, key: 'version', index: 0, from: 'include' },
        ],
      },
    ]

    const result = interpretMatrix(matrix)

    expect(result).toStrictEqual(expected)
  })
  test('Example no matrix variables', () => {
    const matrix: Matrix = {
      matrix: {},
      include: [
        { site: 'production', datacenter: 'site-a' },
        { site: 'staging', datacenter: 'site-b' },
      ],
    }

    const expected = [
      {
        entries: [
          { value: 'production', key: 'site', index: 0, from: 'include' },
          { value: 'site-a', key: 'datacenter', index: 0, from: 'include' },
        ],
      },
      {
        entries: [
          { value: 'staging', key: 'site', index: 1, from: 'include' },
          { value: 'site-b', key: 'datacenter', index: 1, from: 'include' },
        ],
      },
    ]

    const result = interpretMatrix(matrix)

    expect(result).toStrictEqual(expected)
  })
  test('Example Excluding configurations', () => {
    const matrix: Matrix = {
      matrix: {
        os: ['macos-latest', 'windows-latest'],
        version: [12, 14, 16],
        environment: ['staging', 'production'],
      },
      exclude: [
        { os: 'windows-latest', version: 12, environment: 'production' },
        { os: 'windows-latest', version: 16 },
      ],
    }
    const expected = [
      {
        entries: [
          { value: 'macos-latest', key: 'os', index: 0, from: 'matrix' },
          { value: 12, key: 'version', index: 0, from: 'matrix' },
          { value: 'staging', key: 'environment', index: 0, from: 'matrix' },
        ],
      },
      {
        entries: [
          { value: 'macos-latest', key: 'os', index: 0, from: 'matrix' },
          { value: 12, key: 'version', index: 0, from: 'matrix' },
          {
            value: 'production',
            key: 'environment',
            index: 1,
            from: 'matrix',
          },
        ],
      },
      {
        entries: [
          { value: 'macos-latest', key: 'os', index: 0, from: 'matrix' },
          { value: 14, key: 'version', index: 1, from: 'matrix' },
          { value: 'staging', key: 'environment', index: 0, from: 'matrix' },
        ],
      },
      {
        entries: [
          { value: 'macos-latest', key: 'os', index: 0, from: 'matrix' },
          { value: 14, key: 'version', index: 1, from: 'matrix' },
          {
            value: 'production',
            key: 'environment',
            index: 1,
            from: 'matrix',
          },
        ],
      },
      {
        entries: [
          { value: 'macos-latest', key: 'os', index: 0, from: 'matrix' },
          { value: 16, key: 'version', index: 2, from: 'matrix' },
          { value: 'staging', key: 'environment', index: 0, from: 'matrix' },
        ],
      },
      {
        entries: [
          { value: 'macos-latest', key: 'os', index: 0, from: 'matrix' },
          { value: 16, key: 'version', index: 2, from: 'matrix' },
          {
            value: 'production',
            key: 'environment',
            index: 1,
            from: 'matrix',
          },
        ],
      },
      {
        entries: [
          { value: 'windows-latest', key: 'os', index: 1, from: 'matrix' },
          { value: 12, key: 'version', index: 0, from: 'matrix' },
          { value: 'staging', key: 'environment', index: 0, from: 'matrix' },
        ],
      },
      {
        exclusionIndex: 0,
        entries: [
          {
            value: 'windows-latest',
            key: 'os',
            index: 1,
            from: 'matrix',
            isExcluded: true,
          },
          {
            value: 12,
            key: 'version',
            index: 0,
            from: 'matrix',
            isExcluded: true,
          },
          {
            value: 'production',
            key: 'environment',
            index: 1,
            from: 'matrix',
            isExcluded: true,
          },
        ],
      },
      {
        entries: [
          { value: 'windows-latest', key: 'os', index: 1, from: 'matrix' },
          { value: 14, key: 'version', index: 1, from: 'matrix' },
          { value: 'staging', key: 'environment', index: 0, from: 'matrix' },
        ],
      },
      {
        entries: [
          { value: 'windows-latest', key: 'os', index: 1, from: 'matrix' },
          { value: 14, key: 'version', index: 1, from: 'matrix' },
          {
            value: 'production',
            key: 'environment',
            index: 1,
            from: 'matrix',
          },
        ],
      },
      {
        exclusionIndex: 1,
        entries: [
          {
            value: 'windows-latest',
            key: 'os',
            index: 1,
            from: 'matrix',
            isExcluded: true,
          },
          {
            value: 16,
            key: 'version',
            index: 2,
            from: 'matrix',
            isExcluded: true,
          },
          { value: 'staging', key: 'environment', index: 0, from: 'matrix' },
        ],
      },
      {
        exclusionIndex: 1,
        entries: [
          {
            value: 'windows-latest',
            key: 'os',
            index: 1,
            from: 'matrix',
            isExcluded: true,
          },
          {
            value: 16,
            key: 'version',
            index: 2,
            from: 'matrix',
            isExcluded: true,
          },
          {
            value: 'production',
            key: 'environment',
            index: 1,
            from: 'matrix',
          },
        ],
      },
    ]

    const result = interpretMatrix(matrix)

    expect(result).toStrictEqual(expected)
  })
})

describe('Additional edge cases', () => {
  test('Include with matching object', () => {
    const matrix: Matrix = {
      matrix: {
        os: ['ubuntu-latest', 'macos-latest'],
        node: [{ version: 14 }, { version: 20, env: 'NODE_OPTIONS=--openssl-legacy-provider' }],
      },
      include: [
        {
          os: 'ubuntu-latest',
          node: { version: 20, env: 'NODE_OPTIONS=--openssl-legacy-provider' },
          shell: 'bash',
        },
      ],
    }

    const expected = [
      {
        entries: [
          { value: 'ubuntu-latest', key: 'os', index: 0, from: 'matrix' },
          { value: { version: 14 }, key: 'node', index: 0, from: 'matrix' },
        ],
      },
      {
        entries: [
          { value: 'ubuntu-latest', key: 'os', index: 0, from: 'matrix' },
          {
            value: { version: 20, env: 'NODE_OPTIONS=--openssl-legacy-provider' },
            key: 'node',
            index: 1,
            from: 'matrix',
          },
          { value: 'bash', key: 'shell', index: 0, from: 'include' },
        ],
      },
      {
        entries: [
          { value: 'macos-latest', key: 'os', index: 1, from: 'matrix' },
          { value: { version: 14 }, key: 'node', index: 0, from: 'matrix' },
        ],
      },
      {
        entries: [
          { value: 'macos-latest', key: 'os', index: 1, from: 'matrix' },
          {
            value: { version: 20, env: 'NODE_OPTIONS=--openssl-legacy-provider' },
            key: 'node',
            index: 1,
            from: 'matrix',
          },
        ],
      },
    ]

    const result = interpretMatrix(matrix)

    expect(result).toStrictEqual(expected)
  })
  test('Include with not matching object', () => {
    const matrix: Matrix = {
      matrix: {
        os: ['ubuntu-latest', 'macos-latest'],
        node: [{ version: 14 }, { version: 20, env: 'NODE_OPTIONS=--openssl-legacy-provider' }],
      },
      include: [
        {
          os: 'ubuntu-latest',
          node: { version: 18, env: 'NODE_OPTIONS=--openssl-legacy-provider' },
        },
      ],
    }

    const expected = [
      {
        entries: [
          { value: 'ubuntu-latest', key: 'os', index: 0, from: 'matrix' },
          { value: { version: 14 }, key: 'node', index: 0, from: 'matrix' },
        ],
      },
      {
        entries: [
          { value: 'ubuntu-latest', key: 'os', index: 0, from: 'matrix' },
          {
            value: { version: 20, env: 'NODE_OPTIONS=--openssl-legacy-provider' },
            key: 'node',
            index: 1,
            from: 'matrix',
          },
        ],
      },
      {
        entries: [
          { value: 'macos-latest', key: 'os', index: 1, from: 'matrix' },
          { value: { version: 14 }, key: 'node', index: 0, from: 'matrix' },
        ],
      },
      {
        entries: [
          { value: 'macos-latest', key: 'os', index: 1, from: 'matrix' },
          {
            value: { version: 20, env: 'NODE_OPTIONS=--openssl-legacy-provider' },
            key: 'node',
            index: 1,
            from: 'matrix',
          },
        ],
      },
      {
        entries: [
          { value: 'ubuntu-latest', key: 'os', index: 0, from: 'include' },
          {
            value: { version: 18, env: 'NODE_OPTIONS=--openssl-legacy-provider' },
            key: 'node',
            index: 0,
            from: 'include',
          },
        ],
      },
    ]

    const result = interpretMatrix(matrix)

    expect(result).toStrictEqual(expected)
  })
  test('Exclude with object', () => {
    const matrix: Matrix = {
      matrix: {
        os: ['ubuntu-latest', 'macos-latest'],
        node: [{ version: 14 }, { version: 20, env: 'NODE_OPTIONS=--openssl-legacy-provider' }],
      },
      exclude: [
        {
          os: 'ubuntu-latest',
          node: { version: 20, env: 'NODE_OPTIONS=--openssl-legacy-provider' },
        },
      ],
    }

    const expected = [
      {
        entries: [
          { value: 'ubuntu-latest', key: 'os', index: 0, from: 'matrix' },
          { value: { version: 14 }, key: 'node', index: 0, from: 'matrix' },
        ],
      },
      {
        exclusionIndex: 0,
        entries: [
          { value: 'ubuntu-latest', key: 'os', index: 0, from: 'matrix', isExcluded: true },
          {
            value: { version: 20, env: 'NODE_OPTIONS=--openssl-legacy-provider' },
            key: 'node',
            index: 1,
            from: 'matrix',
            isExcluded: true,
          },
        ],
      },
      {
        entries: [
          { value: 'macos-latest', key: 'os', index: 1, from: 'matrix' },
          { value: { version: 14 }, key: 'node', index: 0, from: 'matrix' },
        ],
      },
      {
        entries: [
          { value: 'macos-latest', key: 'os', index: 1, from: 'matrix' },
          {
            value: { version: 20, env: 'NODE_OPTIONS=--openssl-legacy-provider' },
            key: 'node',
            index: 1,
            from: 'matrix',
          },
        ],
      },
    ]

    const result = interpretMatrix(matrix)

    expect(result).toStrictEqual(expected)
  })
  test('Inclusions and Exclusions (exclude is evaluated before inclusions)', () => {
    const matrix: Matrix = {
      matrix: {
        fruit: ['apple', 'pear'],
        animal: ['cat', 'dog'],
      },
      exclude: [{ fruit: 'apple', animal: 'dog' }],
      include: [
        { color: 'green' },
        { color: 'pink', animal: 'cat' },
        { fruit: 'apple', shape: 'circle' },
        { fruit: 'banana' },
        { fruit: 'banana', animal: 'cat' },
      ],
    }

    const expected = [
      {
        entries: [
          { value: 'apple', key: 'fruit', index: 0, from: 'matrix' },
          { value: 'cat', key: 'animal', index: 0, from: 'matrix' },
          { value: 'green', key: 'color', index: 0, from: 'include' },
          { value: 'pink', key: 'color', index: 1, from: 'include' },
          { value: 'circle', key: 'shape', index: 2, from: 'include' },
        ],
      },
      {
        exclusionIndex: 0,
        entries: [
          {
            value: 'apple',
            key: 'fruit',
            index: 0,
            from: 'matrix',
            isExcluded: true,
          },
          {
            value: 'dog',
            key: 'animal',
            index: 1,
            from: 'matrix',
            isExcluded: true,
          },
          { value: 'green', key: 'color', index: 0, from: 'include' },
          { value: 'circle', key: 'shape', index: 2, from: 'include' },
        ],
      },
      {
        entries: [
          { value: 'pear', key: 'fruit', index: 1, from: 'matrix' },
          { value: 'cat', key: 'animal', index: 0, from: 'matrix' },
          { value: 'green', key: 'color', index: 0, from: 'include' },
          { value: 'pink', key: 'color', index: 1, from: 'include' },
        ],
      },
      {
        entries: [
          { value: 'pear', key: 'fruit', index: 1, from: 'matrix' },
          { value: 'dog', key: 'animal', index: 1, from: 'matrix' },
          { value: 'green', key: 'color', index: 0, from: 'include' },
        ],
      },
      { entries: [{ value: 'banana', key: 'fruit', index: 3, from: 'include' }] },
      {
        entries: [
          { value: 'banana', key: 'fruit', index: 4, from: 'include' },
          { value: 'cat', key: 'animal', index: 4, from: 'include' },
        ],
      },
    ]

    const result = interpretMatrix(matrix)

    expect(result).toStrictEqual(expected)
  })
})
