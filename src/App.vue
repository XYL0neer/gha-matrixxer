<script setup lang="ts">
import { ref, watchEffect } from "vue"
import { parse } from "yaml"
import { Textarea } from "@/components/ui/textarea"

const input = ref("")

watchEffect(() => {
  try {
    const value = parse(input.value)
    console.log(value)
  } catch (error) {
    if (error instanceof Error) {
      console.warn("No valid yaml", error)
    }
  }
})
</script>

<template>
  <header class="mx-auto mb-8 mt-1 container">
    <h1 class="text-2xl">GitHub Actions Matrixxer</h1>
  </header>

  <main>
    <section class="mx-auto container">
      <Textarea v-model="input" class="h-md" />
    </section>

    <section class="mx-auto container">

    </section>
  </main>
</template>
