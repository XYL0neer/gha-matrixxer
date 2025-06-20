<script setup lang="ts">
import { useForm, FieldArray } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { FormControl, FormField, FormItem } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { useMatrix } from '@/stores/useMatrix'
import { CircleMinus, CirclePlus } from 'lucide-vue-next'
import type { Matrix } from '@/types/matrix'

const matrixStore = useMatrix()

const FormMatrixValue = z.union([z.string(), z.number()])

const form = useForm({
  validationSchema: toTypedSchema(
    z.object({
      matrix: z.array(
        z.object({
          key: z.string(),
          values: z.array(FormMatrixValue),
        }),
      ),
      exclude: z.array(z.array(z.object({ key: z.string(), value: FormMatrixValue }))),
      include: z.array(z.array(z.object({ key: z.string(), value: FormMatrixValue }))),
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
    exclude: [
      [
        { key: 'os', value: 'ubuntu-latest' },
        { key: 'version', value: 14 },
      ],
    ],
    include: [
      [
        { key: 'os', value: 'ubuntu-latest' },
        { key: 'version', value: 18 },
      ],
    ],
  },
})

const onSubmit = form.handleSubmit((values) => {
  console.log('submit matrix', values)
  const m: Matrix = {
    matrix: Object.fromEntries(values.matrix.map((mat) => [mat.key, mat.values])),
    exclude: values.exclude.map((ex) => Object.fromEntries(ex.map((x) => [x.key, x.value]))),
    include: values.include.map((inc) => Object.fromEntries(inc.map((i) => [i.key, i.value]))),
  }
  matrixStore.setMatrix(m)
})
</script>

<template>
  <form @submit="onSubmit">
    <p>Matrix Entries</p>
    <div class="mb-6 flex gap-8">
      <FieldArray name="matrix" v-slot="{ fields, push, remove }">
        <fieldset v-for="(field, idx) in fields" :key="field.key">
          <FormField
            :name="`matrix[${idx}].key`"
            :id="`matrix[${idx}].key`"
            v-slot="{ componentField }"
          >
            <FormItem>
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
    <p>Exclusions</p>
    <div class="mb-6 flex">
      <FieldArray name="exclude" v-slot="{ fields, push, remove }">
        <fieldset v-for="(field, exIdx) in fields" :key="`exclude[${exIdx}]`">
          <div>
            <Button type="button" @click="remove(exIdx)" variant="secondary"
              ><CircleMinus /> Remove Exclusion</Button
            >
            <FieldArray
              :name="`exclude[${exIdx}]`"
              v-slot="{ fields: exclusion, push: addEntry, remove: removeEntry }"
            >
              <fieldset
                v-for="(ex, exEntryIdx) in exclusion"
                :key="`exclude[${exIdx}][${exEntryIdx}]-${ex.key}`"
              >
                <div class="flex">
                  <FormField
                    :name="`exclude[${exIdx}][${exEntryIdx}].key`"
                    v-slot="{ componentField: fieldKey }"
                  >
                    <FormItem>
                      <FormControl><Input type="text" v-bind="fieldKey" /></FormControl>
                    </FormItem>
                  </FormField>
                  <span>:</span>
                  <FormField
                    :name="`exclude[${exIdx}][${exEntryIdx}].value`"
                    v-slot="{ componentField: fieldValue }"
                  >
                    <FormItem>
                      <FormControl><Input type="text" v-bind="fieldValue" /></FormControl>
                    </FormItem>
                  </FormField>
                  <Button type="button" @click="removeEntry(exEntryIdx)" size="icon" variant="ghost"
                    ><CircleMinus
                  /></Button>
                  <Button
                    type="button"
                    @click="addEntry({ key: '', value: '' })"
                    size="icon"
                    variant="ghost"
                    ><CirclePlus
                  /></Button>
                </div>
              </fieldset>
            </FieldArray>
          </div>
        </fieldset>

        <Button type="button" @click="push([{ key: '', value: '' }])" variant="secondary"
          ><CirclePlus /> Add Exclusion</Button
        >
      </FieldArray>
    </div>

    <p>Exclusions</p>
    <div class="mb-6 flex">
      <FieldArray name="include" v-slot="{ fields, push, remove }">
        <fieldset v-for="(field, inIdx) in fields" :key="field.key">
          <div>
            <Button type="button" @click="remove(inIdx)" variant="secondary"
              ><CircleMinus /> Remove Inclusion</Button
            >
            <FieldArray
              :name="`include[${inIdx}]`"
              v-slot="{ fields: inclusion, push: addEntry, remove: removeEntry }"
            >
              <fieldset v-for="(inc, exEntryIdx) in inclusion" :key="inc.key">
                <div class="flex">
                  <FormField
                    :name="`include[${inIdx}][${exEntryIdx}].key`"
                    v-slot="{ componentField: fieldKey }"
                  >
                    <FormItem>
                      <FormControl><Input type="text" v-bind="fieldKey" /></FormControl>
                    </FormItem>
                  </FormField>
                  <span>:</span>
                  <FormField
                    :name="`include[${inIdx}][${exEntryIdx}].value`"
                    v-slot="{ componentField: fieldValue }"
                  >
                    <FormItem>
                      <FormControl><Input type="text" v-bind="fieldValue" /></FormControl>
                    </FormItem>
                  </FormField>
                  <Button type="button" @click="removeEntry(exEntryIdx)" size="icon" variant="ghost"
                    ><CircleMinus
                  /></Button>
                  <Button
                    type="button"
                    @click="addEntry({ key: '', value: '' })"
                    size="icon"
                    variant="ghost"
                    ><CirclePlus
                  /></Button>
                </div>
              </fieldset>
            </FieldArray>
          </div>
        </fieldset>

        <Button type="button" @click="push([{ key: '', value: '' }])" variant="secondary"
          ><CirclePlus /> Add Exclusion</Button
        >
      </FieldArray>
    </div>
    <Button type="submit">Generate</Button>
  </form>
</template>
