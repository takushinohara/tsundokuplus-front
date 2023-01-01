<template>
  <div class="bg-white">

    <div class="max-w-screen-lg px-4 md:px-8 mx-auto">
      <button @click="useRouter().push('/home')" class="inline-block bg-gray-50 hover:bg-gray-100 active:bg-gray-200 focus-visible:ring ring-indigo-300 text-gray-500 hover:text-indigo-500 active:text-indigo-600 text-sm md:text-base font-semibold text-center rounded-lg outline-none transition duration-100 px-4 py-2">
        &lt; Go back
      </button>
    </div>

    <div v-if="state.isLoading">
      <Loading />
    </div>
    <div v-else>
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

        <div class="grid grid-cols-1 gap-4 w-full">
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
        <label for="message" class="block mb-2 text-sm font-medium">Note</label>
        <textarea
          id="message"
          rows="4"
          class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Your note..."
          v-model="state.note.contents"
        >
      </textarea>
        <p class="text-sm text-gray-500"> Last updated at {{ convertToJST(state.note.updatedAt) }} </p>
      </div>

      <div class="max-w-screen-lg px-4 md:px-8 mx-auto">
        <div class="flex justify-between items-center py-4 md:py-8">
          <button @click="save" :disabled="state.isSaving" class="inline-block bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 focus-visible:ring ring-indigo-300 text-white text-sm md:text-base font-medium text-center rounded-lg outline-none transition duration-100 px-4 py-2">
            <LoadingButtonIcon :show="state.isSaving"/>
            {{ state.isSaving ? "Saving..." : "Save" }}
          </button>

          <button @click="state.openModal = true" class="inline-block bg-red-500 hover:bg-red-600 active:bg-indigo-700 focus-visible:ring ring-indigo-300 text-white text-sm md:text-base font-medium text-center rounded-lg outline-none transition duration-100 px-4 py-2">
            Delete
          </button>
        </div>
      </div>
    </div>

    <TransitionRoot as="template" :show="state.openModal">
      <Dialog as="div" class="relative z-10" @close="state.openModal = false">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div class="sm:flex sm:items-start">
                    <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <ExclamationTriangleIcon class="h-6 w-6 text-red-600" aria-hidden="true" />
                    </div>
                    <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">Delete the book</DialogTitle>
                      <div class="mt-2">
                        <p class="text-sm text-gray-500">Are you sure you want to delete your book?</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button :disabled="state.isDeleting" type="button" class="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm" @click="deleteBook">
                    <LoadingButtonIcon :show="state.isDeleting" />
                    {{ state.isDeleting ? "Deleting..." : "Delete" }}
                  </button>
                  <button type="button" class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" @click="state.openModal = false" ref="cancelButtonRef">
                    Cancel
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

import { computed, onMounted, ref } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import { useNotification } from "@kyvg/vue3-notification";
import { Loading, LoadingButtonIcon } from "#components";

const { notify } = useNotification()
const route = useRoute()
const config = useRuntimeConfig()

const state = ref({
  isLoading: false,
  fetchResult: '',
  note: '',
  openModal: false,
  isSaving: false,
  isDeleting: false
})

function convertToJST(value: string) {
  const date = new Date(value)
  date.setHours(date.getHours() + 9);
  return date.toLocaleString()
}

async function getBook() {
  state.value.isLoading = true
  state.value.fetchResult = await $fetch(`${config.public.tsundokuApiBaseUrl}/books/${route.params.id}`,
    {
      credentials: 'include',
      async onResponse({ response }) {
        switch (response.status) {
          case 200: break
          case 401: useRouter().push('/login'); break
          case 404: useRouter().push('/errors/404'); break
          default:
            notify({ type: "error", title: "Error", text: "Oops! Something went wrong." })
            state.value.isLoading = false
        }
      }
    })
  state.value.note = state.value.fetchResult.note
  state.value.isLoading = false
}

async function save() {
  state.value.isSaving = true
  const csrfToken = await $fetch(`${config.public.tsundokuApiBaseUrl}/csrf-token`,
    {
      credentials: 'include',
      async onResponse({ response }) {
        switch (response.status) {
          case 200: break
          case 401: useRouter().push('/login'); break
          default:
            notify({ type: "error", title: "Error", text: "Oops! Something went wrong." })
            state.value.isSaving = false
        }
      }
    })
  await $fetch(`${config.public.tsundokuApiBaseUrl}/books/${route.params.id}`,
    {
      method: 'PUT',
      headers: { 'X-CSRF-TOKEN': csrfToken.token },
      body: { "note": state.value.note.contents },
      credentials: 'include',
      async onResponse({ response }) {
        switch (response.status) {
          case 204: notify({ type: "success", title: "Success", text: "The book has been saved." }); break
          case 401: useRouter().push('/login'); break
          case 404: useRouter().push('/errors/404'); break
          default:
            notify({ type: "error", title: "Error", text: "Oops! Something went wrong." })
            state.value.isSaving = false
        }
      }
    }).then(getBook)

  state.value.isSaving = false
}

async function deleteBook() {
  state.value.isDeleting = true
  const csrfToken = await $fetch(`${config.public.tsundokuApiBaseUrl}/csrf-token`,
    {
      credentials: 'include',
      async onResponse({ response }) {
        switch (response.status) {
          case 200: break
          case 401: useRouter().push('/login'); break
          default:
            notify({ type: "error", title: "Error", text: "Oops! Something went wrong." })
            state.value.isDeleting = false
        }
      }
    })
  await $fetch(`${config.public.tsundokuApiBaseUrl}/books/${route.params.id}`,
    {
      method: 'DELETE',
      headers: { 'X-CSRF-TOKEN': csrfToken.token },
      body: {},
      credentials: 'include',
      async onResponse({ response }) {
        switch (response.status) {
          case 204:
            notify({ type: "success", title: "Success", text: "The book has been deleted." });
            useRouter().push('/home'); break
          case 401: useRouter().push('/login'); break
          case 404: useRouter().push('/errors/404'); break
          default:
            notify({ type: "error", title: "Error", text: "Oops! Something went wrong." })
            state.value.isDeleting = false
        }
      }
    })

  state.value.isDeleting = false
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
      thumbnail: ""
    }
  }
})

onMounted(() => {
  getBook()
})
</script>

<style scoped>

</style>
