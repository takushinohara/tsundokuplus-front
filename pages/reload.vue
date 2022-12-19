<template>
  <div class="bg-white py-6 sm:py-8 lg:py-12">
    <Loading />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "custom"
});

import { onMounted } from "vue";
import { useNotification } from "@kyvg/vue3-notification";
import { Loading } from "#components";

const { notify } = useNotification()
const { login, setUser } = useAuth()
const config = useRuntimeConfig()

onMounted(async () => {
  if (sessionStorage.getItem('loginStatus') === '1') {
    login()
    const user = await $fetch(`${config.public.tsundokuApiBaseUrl}/user`,
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
    setUser(user)
  } else {
    useRouter().push('/login')
  }
})
</script>

<style scoped>

</style>
