<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { Textarea } from '@/components/ui/textarea'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { parse } from 'yaml'
import type { Matrix } from '@/types/matrix'
import { useMatrix } from '@/stores/useMatrix'

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
const formSchema = toTypedSchema(
  z.object({
    rawInput: z.string(),
  }),
)

const matrixStore = useMatrix()

const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    rawInput: initialRawMatrix,
  },
})

const onSubmit = form.handleSubmit((values) => {
  console.log('Form submitted!', values)
  const val = parse(values.rawInput)
  const { strategy } = strategySchema.parse(val)
  const { include, exclude, ...m } = strategy.matrix
  const matrix: Matrix = {
    matrix: m,
    include: include,
    exclude: exclude,
  }

  console.log(matrix)
  matrixStore.setMatrix(matrix)
})
</script>
<template>
  <form @submit="onSubmit">
    <FormField v-slot="{ componentField }" name="rawInput">
      <FormItem>
        <FormLabel>Raw Input</FormLabel>
        <FormControl>
          <Textarea type="text" placeholder="yaml" v-bind="componentField" rows="20" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <Button class="mt-2" type="submit">Generate Matrix</Button>
  </form>
</template>
