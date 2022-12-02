<template>
  <BookSearch>
  </BookSearch>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

import BookSearch from "../components/BookSearch";
</script>

<style scoped>

</style>
