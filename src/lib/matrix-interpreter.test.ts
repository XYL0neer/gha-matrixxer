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
      { version: 10, os: 'ubuntu-latest' },
      { version: 10, os: 'windows-latest' },
      { version: 12, os: 'ubuntu-latest' },
      { version: 12, os: 'windows-latest' },
      { version: 14, os: 'ubuntu-latest' },
      { version: 14, os: 'windows-latest' },
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

    const expected = [{ version: 10 }, { version: 12 }, { version: 14 }]

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
      { os: 'ubuntu-22.04', version: 10 },
      { os: 'ubuntu-22.04', version: 12 },
      { os: 'ubuntu-22.04', version: 14 },
      { os: 'ubuntu-20.04', version: 10 },
      { os: 'ubuntu-20.04', version: 12 },
      { os: 'ubuntu-20.04', version: 14 },
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
      { os: 'ubuntu-latest', node: { version: 14 } },
      { os: 'ubuntu-latest', node: { version: 20, env: 'NODE_OPTIONS=--openssl-legacy-provider' } },
      { os: 'macos-latest', node: { version: 14 } },
      { os: 'macos-latest', node: { version: 20, env: 'NODE_OPTIONS=--openssl-legacy-provider' } },
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
      { fruit: 'apple', animal: 'cat', color: 'pink', shape: 'circle' },
      { fruit: 'apple', animal: 'dog', color: 'green', shape: 'circle' },
      { fruit: 'pear', animal: 'cat', color: 'pink' },
      { fruit: 'pear', animal: 'dog', color: 'green' },
      { fruit: 'banana' },
      { fruit: 'banana', animal: 'cat' },
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
      { os: 'windows-latest', node: 14 },
      { os: 'windows-latest', node: 16, npm: 6 },
      { os: 'ubuntu-latest', node: 14 },
      { os: 'ubuntu-latest', node: 16 },
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
      { os: 'macos-latest', version: 12 },
      { os: 'macos-latest', version: 14 },
      { os: 'macos-latest', version: 16 },
      { os: 'windows-latest', version: 12 },
      { os: 'windows-latest', version: 14 },
      { os: 'windows-latest', version: 16 },
      { os: 'ubuntu-latest', version: 12 },
      { os: 'ubuntu-latest', version: 14 },
      { os: 'ubuntu-latest', version: 16 },
      { os: 'windows-latest', version: 17 },
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
      { site: 'production', datacenter: 'site-a' },
      { site: 'staging', datacenter: 'site-b' },
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
      { os: 'macos-latest', version: 12, environment: 'staging' },
      { os: 'macos-latest', version: 12, environment: 'production' },
      { os: 'macos-latest', version: 14, environment: 'staging' },
      { os: 'macos-latest', version: 14, environment: 'production' },
      { os: 'macos-latest', version: 16, environment: 'staging' },
      { os: 'macos-latest', version: 16, environment: 'production' },
      { os: 'windows-latest', version: 12, environment: 'staging' },
      { os: 'windows-latest', version: 14, environment: 'staging' },
      { os: 'windows-latest', version: 14, environment: 'production' },
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
      { os: 'ubuntu-latest', node: { version: 14 } },
      {
        os: 'ubuntu-latest',
        node: { version: 20, env: 'NODE_OPTIONS=--openssl-legacy-provider' },
        shell: 'bash',
      },
      { os: 'macos-latest', node: { version: 14 } },
      { os: 'macos-latest', node: { version: 20, env: 'NODE_OPTIONS=--openssl-legacy-provider' } },
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
      { os: 'ubuntu-latest', node: { version: 14 } },
      { os: 'ubuntu-latest', node: { version: 20, env: 'NODE_OPTIONS=--openssl-legacy-provider' } },
      { os: 'macos-latest', node: { version: 14 } },
      { os: 'macos-latest', node: { version: 20, env: 'NODE_OPTIONS=--openssl-legacy-provider' } },
      { os: 'ubuntu-latest', node: { version: 18, env: 'NODE_OPTIONS=--openssl-legacy-provider' } },
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
      { os: 'ubuntu-latest', node: { version: 14 } },
      { os: 'macos-latest', node: { version: 14 } },
      { os: 'macos-latest', node: { version: 20, env: 'NODE_OPTIONS=--openssl-legacy-provider' } },
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
      { fruit: 'apple', animal: 'cat', color: 'pink', shape: 'circle' },
      { fruit: 'pear', animal: 'cat', color: 'pink' },
      { fruit: 'pear', animal: 'dog', color: 'green' },
      { fruit: 'banana' },
      { fruit: 'banana', animal: 'cat' },
    ]

    const result = interpretMatrix(matrix)

    expect(result).toStrictEqual(expected)
  })
})
