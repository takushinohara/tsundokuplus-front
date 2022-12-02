<template>
  <div class="bg-white py-6 sm:py-8 lg:py-12">
    <div class="max-w-screen-2xl px-4 md:px-8 mx-auto">
      <h2 class="text-gray-800 text-2xl lg:text-3xl font-bold text-center mb-4 md:mb-8">Login</h2>

      <div class="max-w-lg border rounded-lg mx-auto">
        <div class="flex flex-col gap-4 p-4 md:p-8">
          <div>
            <label for="email" class="inline-block text-gray-800 text-sm sm:text-base mb-2">Email</label>
            <input
              name="email"
              class="w-full bg-gray-50 text-gray-800 border focus:ring ring-indigo-300 rounded outline-none transition duration-100 px-3 py-2"
              v-model="state.email"
            />
          </div>

          <div>
            <label for="password" class="inline-block text-gray-800 text-sm sm:text-base mb-2">Password</label>
            <input
              type="password"
              name="password"
              class="w-full bg-gray-50 text-gray-800 border focus:ring ring-indigo-300 rounded outline-none transition duration-100 px-3 py-2"
              v-model="state.password"
            />
          </div>

          <button
            @click="doLogin(false)"
            class="block bg-gray-800 hover:bg-gray-700 active:bg-gray-600 focus-visible:ring ring-gray-300 text-white text-sm md:text-base font-semibold text-center rounded-lg outline-none transition duration-100 px-8 py-3"
          >
            Log in
          </button>

        </div>

        <div class="flex justify-center items-center bg-gray-100 p-4 pb-0">
          <p class="text-gray-500 text-sm text-center">Don't have an account? Please
            <a href="https://twitter.com/takushinohara" class="text-indigo-500 hover:text-indigo-600 active:text-indigo-700 transition duration-100">contact me</a>
          </p>
        </div>
        <div class="flex justify-center items-center bg-gray-100 pb-4">
          <p class="text-gray-500 text-sm text-center">or try
            <NuxtLink @click="doLogin(true)" class="text-indigo-500 hover:text-indigo-600 active:text-indigo-700 font-semibold transition duration-100">Log in as Demo User</NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const { login, setUser } = useAuth()
const config = useRuntimeConfig()

const state = ref({
  email: '',
  password: ''
})

async function doLogin(withDemoUser: boolean) {
  const email = withDemoUser ? config.public.demoUser.email : state.value.email
  const password = withDemoUser ? config.public.demoUser.password : state.value.password
  await $fetch(`${config.public.tsundokuApiBaseUrl}/login`,
    {
      method: 'POST',
      body: {
        "email": email,
        "password": password
      },
      credentials: 'include'
    }).then(setupLogin)
}

async function setupLogin() {
  sessionStorage.setItem('loginStatus', '1')
  await login()
  const user = await $fetch(`${config.public.tsundokuApiBaseUrl}/user`, { credentials: 'include' })
  await setUser(user)
}
</script>

<style scoped>

</style>
