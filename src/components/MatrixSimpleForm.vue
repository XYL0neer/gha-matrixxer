<script setup lang="ts">
import { useForm, FieldArray } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { useMatrix } from '@/stores/useMatrix'
import { CircleMinus, CirclePlus } from 'lucide-vue-next'
import type { Matrix } from '@/types/matrix'

const matrixStore = useMatrix()

const form = useForm({
  validationSchema: toTypedSchema(
    z.object({
      matrix: z.array(
        z.object({
          key: z.string(),
          values: z.array(z.union([z.string(), z.number()])),
        }),
      ),
    }),
  ),
  initialValues: {
    matrix: [
      {
        key: 'os',
        values: ['ubuntu-latest', 'macos-latest'],
      },
      {
        key: 'version',
        values: [14, 16],
      },
    ],
  },
})

const onSubmit = form.handleSubmit((values) => {
  console.log('submit matrix', values)
  const m: Matrix = {
    matrix: Object.fromEntries(values.matrix.map((mat) => [mat.key, mat.values])),
  }
  matrixStore.setMatrix(m)
})
</script>

<template>
  <form @submit="onSubmit">
    <div class="mb-6 flex gap-8">
      <FieldArray name="matrix" v-slot="{ fields, push, remove }">
        <fieldset v-for="(field, idx) in fields" :key="field.key">
          <FormField
            :name="`matrix[${idx}].key`"
            :id="`matrix[${idx}].key`"
            v-slot="{ componentField }"
          >
            <FormItem>
              <FormLabel>Matrix Entry</FormLabel>
              <div class="flex gap-1">
                <FormControl>
                  <Input type="text" v-bind="componentField" />
                </FormControl>
                <Button type="button" class="ml-4" @click="remove(idx)" variant="secondary">
                  <CircleMinus /> Remove Entry
                </Button>
              </div>
            </FormItem>
          </FormField>
          <FieldArray :name="`matrix[${idx}].values`" v-slot="{ fields: values, push, remove }">
            <p>Values</p>
            <fieldset v-for="(value, vIdx) in values" :key="value.key">
              <FormField :name="`matrix[${idx}].values[${vIdx}]`" v-slot="{ componentField: v }">
                <FormItem>
                  <div class="mb-2 flex gap-1">
                    <FormControl>
                      <Input type="text" v-bind="v" />
                    </FormControl>
                    <Button type="button" @click="remove(vIdx)" size="icon" variant="ghost"
                      ><CircleMinus
                    /></Button>
                  </div>
                </FormItem>
              </FormField>
            </fieldset>
            <Button type="button" @click="push('')" variant="secondary"
              ><CirclePlus /> Add Value</Button
            >
          </FieldArray>
        </fieldset>
        <Button type="button" @click="push({ key: '', values: [] })" variant="secondary"
          ><CirclePlus /> New Entry</Button
        >
      </FieldArray>
    </div>
    <Button type="submit">Generate</Button>
  </form>
</template>
