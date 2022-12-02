<template>
  <div>
    <div class="max-w-screen-md grid sm:grid-cols-2 gap-4 mx-auto">
      <div class="sm:col-span-2">
        <input
            type="search"
            name="subject"
            placeholder="Search new books"
            class="w-full bg-gray-50 text-gray-800 border focus:ring ring-indigo-300 rounded outline-none transition duration-100 px-3 py-2"
            v-model="state.searchQuery"
        />
      </div>

      <div class="sm:col-span-2 flex justify-between items-center">
        <NuxtLink to="/home" class="inline-block focus-visible:ring ring-indigo-300 text-gray-500 hover:text-indigo-500 active:text-indigo-600 text-sm md:text-base text-center rounded-lg outline-none transition duration-100 px-4 py-2">
          Go back
        </NuxtLink>
        <button @click="getNewBooks" class="inline-block bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 focus-visible:ring ring-indigo-300 text-white text-sm md:text-base text-center rounded-lg outline-none transition duration-100 px-4 py-2">
          Search
        </button>
      </div>
    </div>

    <div class="max-w-screen-md grid sm:grid-cols-1 mx-auto">
      <div v-if="state.isLoading">
        Loading...
      </div>
      <div v-else>
        <div v-if="bookSummaryList !== ''">
          <ul>
            <div v-for="book in bookSummaryList">
              <li class="bg-gray-100 overflow-hidden rounded-lg shadow-lg mb-2 sm:mb-4">
                <div class="flex justify-between items-end gap-4 m-2">
                  <img :src=book.smallThumbnail loading="lazy" alt="Photo by Radu Florin" />
                  <ul class="h-40">
                    <li>{{ book.title }}</li>
                    <li>{{ book.author }}</li>
                    <li>{{ book.publisher }}</li>
                  </ul>
                  <button @click="addBook(book.id)" class="inline-block bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 focus-visible:ring ring-indigo-300 text-white text-sm md:text-base text-center rounded-lg outline-none transition duration-100 px-4 py-2">
                    Add
                  </button>
                </div>
              </li>
            </div>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const config = useRuntimeConfig()
const googleBooksApiURL = "https://www.googleapis.com/books/v1"

const state = ref({
  searchQuery: null,
  searchResult: null,
  isLoading: false
})

const bookSummaryList = computed(() => {
  if (state.value.searchResult !== null) {
    const items = state.value.searchResult.items
    return items.map((item) => {
      const id = item.id
      const title = item.volumeInfo.title
      const smallThumbnail = 'imageLinks' in item.volumeInfo
          ? item.volumeInfo.imageLinks.smallThumbnail
          : ''
      const author = 'authors' in item.volumeInfo
          ? item.volumeInfo.authors[0]
          : ''
      const publisher = item.volumeInfo.publisher
      return {
        "id": id,
        "title": title,
        "smallThumbnail": smallThumbnail,
        "author": author,
        "publisher": publisher
      }
    })
  } else {
    return ''
  }
})

async function getNewBooks() {
  state.value.isLoading = true
  state.value.searchResult = await $fetch(`${googleBooksApiURL}/volumes?q=${state.value.searchQuery}`)
  state.value.isLoading = false
}

async function addBook(id) {
  const item = state.value.searchResult.items.find(element => element.id === id)
  const title = item.volumeInfo.title
  const thumbnail = 'imageLinks' in item.volumeInfo
      ? item.volumeInfo.imageLinks.thumbnail
      : ''
  const smallThumbnail = 'imageLinks' in item.volumeInfo
      ? item.volumeInfo.imageLinks.smallThumbnail
      : ''
  const author = 'authors' in item.volumeInfo
      ? item.volumeInfo.authors[0]
      : ''
  const publisher = item.volumeInfo.publisher

  const csrfToken = await $fetch(`${config.public.tsundokuApiBaseUrl}/csrf-token`, { credentials: 'include' })
  await $fetch(`${config.public.tsundokuApiBaseUrl}/book`,
      {
        method: 'POST',
        headers: { 'X-CSRF-TOKEN': csrfToken.token },
        body: {
          "title": title,
          "author": author,
          "publisher": publisher,
          "thumbnail": thumbnail,
          "smallThumbnail": smallThumbnail
        },
        credentials: 'include'
      })
}
</script>

<style scoped>

</style>
