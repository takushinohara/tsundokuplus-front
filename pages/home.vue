<template>
  <div class="bg-white">

    <div class="max-w-screen-2xl px-4 md:px-8 mx-auto">
      <div class="flex justify-between items-end gap-4 mb-6">
        <div class="w-full md:max-w-md flex gap-2">
          <input v-model="state.filterKeyword" placeholder="Filter your books" class="w-full flex-1 bg-gray-50 text-gray-800 placeholder-gray-500 border focus:ring ring-indigo-300 rounded outline-none transition duration-100 px-3 py-2" />
        </div>

        <NuxtLink to="/add" class="inline-block bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 focus-visible:ring ring-indigo-300 text-white text-sm md:text-base font-semibold text-center rounded outline-none transition duration-100 px-8 py-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </NuxtLink>
      </div>
    </div>

    <div class="max-w-screen-2xl px-4 md:px-8 mx-auto">
      <div v-if="state.isLoading">
        <Loading />
      </div>
      <div v-else>
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-x-4 md:gap-x-8 gap-y-12">
          <div v-if="books.length" v-for="tsundoku in filteredBooks">
            <div>
              <NuxtLink :to="`/book/${tsundoku.id}`" class="group h-48 block rounded-lg overflow-hidden relative mb-2 lg:mb-3">
                <img
                  :src="tsundoku.thumbnail.replace('http', 'https')"
                  loading="lazy"
                  :alt="tsundoku.title"
                  class="h-full object-cover object-center group-hover:scale-110 transition duration-200"
                />
              </NuxtLink>

              <div>
                <NuxtLink :to="`/book/${tsundoku.id}`" class="text-gray-500 hover:text-gray-800 text-sm font-semibold transition duration-100 mb-1">{{ tsundoku.title }}</NuxtLink>

                <div class="flex items-end gap-2">
                  <span class="text-gray-500 text-sm">{{ tsundoku.author }}</span>
                  <span class="text-gray-400 text-sm">{{ tsundoku.publisher }}</span>
                </div>
              </div>
            </div>
          </div>
          <div v-if="state.hasNoBooks">
            Let's add your first Tsundoku!
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

import { ref, computed, onMounted } from "vue"
import { useNotification } from "@kyvg/vue3-notification";
import { Loading } from "#components";

const { notify } = useNotification()
const config = useRuntimeConfig()

const state = ref({
  isLoading: false,
  fetchResult: {
    bookList: []
  },
  filterKeyword: '',
  hasNoBooks: false
})

const books = computed(() => {
  return state.value.fetchResult.bookList
})

const filteredBooks = computed(() => {
  const targetKeys = ["title", "author", "publisher"]
  let data = state.value.fetchResult.bookList
  let keyword = state.value.filterKeyword
  if (keyword) {
    keyword = keyword.toLowerCase()
    data = data.filter((row) => {
      return Object.keys(row).some((key) => {
        if (!targetKeys.includes(key)) return false
        return String(row[key]).toLowerCase().indexOf(keyword) > -1
      })
    })
  }

  return data
})

async function getBooks() {
  state.value.isLoading = true
  state.value.fetchResult = await $fetch(`${config.public.tsundokuApiBaseUrl}/book/list`,
    {
      credentials: 'include',
      async onResponse({ response }) {
        switch (response.status) {
          case 200: break
          case 401: useRouter().push('/login'); break
          default:  notify({ type: "error", title: "Error", text: "Oops! Something went wrong." })
        }
      },
    })
  state.value.isLoading = false

  state.value.hasNoBooks = state.value.fetchResult.bookList.length === 0;
}

onMounted(() => {
  getBooks()
})
</script>

<style scoped>

</style>
