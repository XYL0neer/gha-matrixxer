<script setup lang="ts">
import { useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { load, YAMLException } from 'js-yaml'
import type { Matrix } from '@/types/matrix'
import { useMatrix } from '@/stores/useMatrix'
import { Codemirror } from 'vue-codemirror'
import { yamlLanguage } from '@codemirror/lang-yaml'
import { linter, type Diagnostic } from '@codemirror/lint'
import { oneDark } from '@codemirror/theme-one-dark'

const lintYaml = linter((view) => {
  const diagnostics: Diagnostic[] = []
  try {
    load(view.state.doc.toString())
  } catch (error) {
    if (error instanceof YAMLException) {
      console.log(error)
      const loc = error.mark
      const from = loc ? loc.position : 0
      const to = from
      const severity = 'error'
      diagnostics.push({ from: from, to: to, message: error.message, severity: severity })
    }
  }
  return diagnostics
})

const extensions = [yamlLanguage.extension, lintYaml, oneDark]
const initialRawMatrix = `
strategy:
  matrix:
    os: ["windows-latest", "ubuntu-latest"]
    version: [12,14]
    include:
      - os: "windows-latest"
        version: 16
    exclude:
      - os: "ubuntu-latest"
        version: 12`.trim()

const strategySchema = z.object({
  strategy: z.object({
    matrix: z.any(),
  }),
})

const formSchema = z.string().refine((val) => {
  try {
    load(val)
    return true
  } catch (error) {
    console.log(error)
    return false
  }
}, 'invalid yaml')

const matrixStore = useMatrix()

const { value: matrixInput, errorMessage } = useField('rawInput', toTypedSchema(formSchema), {
  syncVModel: true,
  initialValue: initialRawMatrix,
})

const onSubmit = () => {
  console.log('Form submitted!', matrixInput.value)
  const val = load(matrixInput.value)
  const { strategy } = strategySchema.parse(val)
  const { include, exclude, ...m } = strategy.matrix
  const matrix: Matrix = {
    matrix: m,
    include: include,
    exclude: exclude,
  }

  console.log(matrix)
  matrixStore.setMatrix(matrix)
}
</script>

<template>
  <form @submit.prevent="onSubmit">
    <codemirror v-model="matrixInput" :extensions="extensions" />
    <Button class="mt-4" type="submit" :disabled="errorMessage !== undefined"
      >Generate Matrix</Button
    >
  </form>
</template>
