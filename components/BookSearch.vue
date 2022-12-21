<template>
  <div class="max-w-screen-2xl px-4 md:px-8 mx-auto">
    <div class="max-w-screen-md grid sm:grid-cols-2 gap-4 mx-auto">
      <div class="sm:col-span-2">
        <input
          type="search"
          placeholder="Search new books"
          class="w-full bg-gray-50 text-gray-800 border focus:ring ring-indigo-300 rounded outline-none transition duration-100 px-3 py-2"
          v-model="state.searchQuery"
        />
      </div>

      <div class="sm:col-span-2 flex justify-between items-center">
        <button @click="useRouter().push('/home')" class="inline-block bg-gray-50 hover:bg-gray-100 active:bg-gray-200 focus-visible:ring ring-indigo-300 text-gray-500 hover:text-indigo-500 active:text-indigo-600 text-sm md:text-base font-semibold text-center rounded-lg outline-none transition duration-100 px-4 py-2">
          &lt; Go back
        </button>
        <button @click="getNewBooks" class="inline-block bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 focus-visible:ring ring-indigo-300 text-white text-sm md:text-base text-center rounded-lg outline-none transition duration-100 px-4 py-2">
          Search
        </button>
      </div>
    </div>

    <div class="max-w-screen-md grid sm:grid-cols-1 mx-auto mt-2">
      <div v-if="state.isLoading">
        <Loading />
      </div>
      <div v-else>
        <div v-if="bookSummaryList !== ''">
          <div v-for="book in bookSummaryList">
            <div class="flex items-center bg-white border rounded-lg shadow-md hover:bg-gray-100 mb-2">
              <img :src="book.smallThumbnail.replace('http', 'https')" loading="lazy" :alt="book.title" />
              <div class="flex flex-col w-full justify-between p-4 leading-normal">
                <h5 class="text-sm md:text-base font-bold tracking-tight text-gray-900">{{ book.title }}</h5>
                <p class="text-sm md:text-base text-gray-700">{{ book.author }}</p>
                <p class="text-sm md:text-base text-gray-500">{{ book.publisher }}</p>
                <div class="flex flex-row-reverse mt-5">
                  <button :disabled="isAdding(book.id)" @click="addBook(book.id)" class="inline-block bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 focus-visible:ring ring-indigo-300 text-white text-sm md:text-base text-center rounded-lg outline-none transition duration-100 px-4 py-2">
                    <LoadingButtonIcon :show="isAdding(book.id)"/>
                    {{ isAdding(book.id) ? "Adding..." : "Add" }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useNotification } from "@kyvg/vue3-notification";
import { Loading, LoadingButtonIcon } from "#components";

const { notify } = useNotification()
const config = useRuntimeConfig()
const googleBooksApiURL = "https://www.googleapis.com/books/v1"

const state = ref({
  searchQuery: null,
  searchResult: null,
  isLoading: false,
  isAdding: {
    status: false,
    id: null
  }
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

function isAdding(bookId): boolean {
  return state.value.isAdding.status && state.value.isAdding.id === bookId
}

function setAdding(bookId) {
  state.value.isAdding.status = true
  state.value.isAdding.id = bookId
}

function clearAdding() {
  state.value.isAdding.status = false
  state.value.isAdding.id = null
}

async function getNewBooks() {
  state.value.isLoading = true
  state.value.searchResult = await $fetch(`${googleBooksApiURL}/volumes?q=${state.value.searchQuery}`,
    {
      async onResponse({ response }) {
        switch (response.status) {
          case 200: break
          default: notify({ type: "error", title: "Error", text: "Oops! Something went wrong." })
        }
      }
    })
  state.value.isLoading = false
}

async function addBook(id) {
  setAdding(id)
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

  const csrfToken = await $fetch(`${config.public.tsundokuApiBaseUrl}/csrf-token`,
    {
      credentials: 'include',
      async onResponse({ response }) {
        switch (response.status) {
          case 200: break
          case 401: useRouter().push('/login'); break
          default: notify({ type: "error", title: "Error", text: "Oops! Something went wrong." }); clearAdding()
        }
      }
    })

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
      credentials: 'include',
      async onResponse({ response }) {
        switch (response.status) {
          case 201: notify({ type: "success", title: "Success", text: "The book has been added." }); break
          case 401: useRouter().push('/login'); break
          default: notify({ type: "error", title: "Error", text: "Oops! Something went wrong." }); clearAdding()
        }
      }
    })

  clearAdding()
}
</script>

<style scoped>

</style>
