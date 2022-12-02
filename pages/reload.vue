<template>
  <div class="bg-white py-6 sm:py-8 lg:py-12">
    <div>
      reloading...
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "custom"
});

import { onMounted } from "vue";

const { login, setUser } = useAuth()
const config = useRuntimeConfig()

onMounted(async () => {
  if (sessionStorage.getItem('loginStatus') === '1') {
    login()
    const user = await $fetch(`${config.public.tsundokuApiBaseUrl}/user`, { credentials: 'include' })
    setUser(user)
  } else {
    useRouter().push('/login')
  }
})
</script>

<style scoped>

</style>
