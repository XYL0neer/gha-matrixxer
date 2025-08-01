<script setup lang="ts">
import MatrixForm from './components/MatrixForm.vue'
import MatrixVisualizer from './components/MatrixVisualizer.vue'
</script>

<template>
  <header class="mx-auto mb-8 mt-1 container">
    <h1 class="text-2xl">GitHub Actions Matrixxer</h1>
  </header>

  <main>
    <section class="mx-auto mb-8 container">
      <MatrixForm />
    </section>

    <section class="mx-auto container">
      <MatrixVisualizer />
    </section>
  </main>
</template>
