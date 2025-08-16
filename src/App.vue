<script setup lang="ts">
import MatrixForm from './components/MatrixForm.vue'
import MatrixVisualizer from './components/MatrixVisualizer.vue'
</script>

<template>
  <header class="container mx-auto mb-8 mt-1">
    <h1 class="text-2xl">GitHub Actions Matrixxer</h1>
  </header>

  <main>
    <section class="container mx-auto mb-8">
      <MatrixForm />
    </section>

    <section class="container mx-auto">
      <MatrixVisualizer />
    </section>
  </main>
</template>
