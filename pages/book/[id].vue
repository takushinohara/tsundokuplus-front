<template>
  <div class="bg-white py-6 sm:py-8 lg:py-12">
    <div class="max-w-screen-lg flex flex-col lg:flex-row items-center gap-8 p-8 mx-auto">

      <div class="border rounded-lg overflow-hidden">
        <div class="h-48 bg-gray-100">
          <img
            :src="book.thumbnail.replace('http', 'https')"
            loading="lazy"
            :alt="book.title"
            class="w-full h-full object-cover object-center"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4">
        <div>
          <div class="font-semibold mb-1">Title</div>
          <p class="text-sm text-gray-500"> {{ book.title }} </p>
        </div>
        <div>
          <div class="font-semibold mb-1">Authors</div>
          <p class="text-sm text-gray-500"> {{ book.author }} </p>
        </div>
        <div>
          <div class="font-semibold mb-1">Publisher</div>
          <p class="text-sm text-gray-500"> {{ book.publisher }} </p>
        </div>
      </div>

    </div>

    <div class="max-w-screen-lg px-4 md:px-8 mx-auto">
      <label for="message" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">Note</label>
      <textarea
          id="message"
          v-model="state.note.contents"
          rows="4"
          class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Your note...">
      </textarea>
      <p class="text-sm text-gray-500"> Last updated at {{ state.note.updatedAt }} </p>
    </div>

    <div class="max-w-screen-lg px-4 md:px-8 mx-auto">
      <div class="lg:flex flex-col sm:flex-row sm:justify-center lg:justify-start gap-2.5">
        <NuxtLink to="/home" class="inline-block focus-visible:ring ring-indigo-300 text-gray-500 hover:text-indigo-500 active:text-indigo-600 text-sm md:text-base font-semibold text-center rounded-lg outline-none transition duration-100 px-4 py-2">
          Go back
        </NuxtLink>

        <button @click="save" class="inline-block bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 focus-visible:ring ring-indigo-300 text-white text-sm md:text-base font-medium text-center rounded-lg outline-none transition duration-100 px-4 py-2">
          Save
        </button>

        <button @click="deleteBook" class="inline-block bg-red-500 hover:bg-red-600 active:bg-indigo-700 focus-visible:ring ring-indigo-300 text-white text-sm md:text-base font-medium text-center rounded-lg outline-none transition duration-100 px-4 py-2">
          Delete
        </button>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

import { computed, onMounted, ref } from 'vue'

const route = useRoute()
const config = useRuntimeConfig()

const state = ref({
  isLoading: false,
  fetchResult: '',
  note: ''
})

async function getBook() {
  state.value.isLoading = true
  state.value.fetchResult = await $fetch(`${config.public.tsundokuApiBaseUrl}/book/${route.params.id}`, {credentials: 'include'})
  state.value.note = state.value.fetchResult.note
  state.value.isLoading = false
}

async function save() {
  const csrfToken = await $fetch(`${config.public.tsundokuApiBaseUrl}/csrf-token`, { credentials: 'include' })
  await $fetch(`${config.public.tsundokuApiBaseUrl}/book/${route.params.id}`,
    {
      method: 'PUT',
      headers: { 'X-CSRF-TOKEN': csrfToken.token },
      body: { "note": state.value.note.contents },
      credentials: 'include'
    }).then(getBook)
}

async function deleteBook() {
  const csrfToken = await $fetch(`${config.public.tsundokuApiBaseUrl}/csrf-token`, { credentials: 'include' })
  await $fetch(`${config.public.tsundokuApiBaseUrl}/book/${route.params.id}`,
    {
      method: 'DELETE',
      headers: { 'X-CSRF-TOKEN': csrfToken.token },
      body: {},
      credentials: 'include'
    }).then(useRouter().push('/home'))
}

const book = computed(() => {
  if (state.value.fetchResult !== '') {
    return {
      title: state.value.fetchResult.title,
      author: state.value.fetchResult.author,
      publisher: state.value.fetchResult.publisher,
      thumbnail: state.value.fetchResult.thumbnail,
      note: state.value.fetchResult.note.contents
    }
  } else {
    return {
      title: "loading...",
      author: "loading...",
      publisher: "loading...",
      thumbnail: "loading..."
    }
  }
})

onMounted(() => {
  getBook()
})
</script>

<style scoped>

</style>
