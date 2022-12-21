<template>
  <BookSearch />
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

import { BookSearch } from "#components";
</script>

<style scoped>

</style>
