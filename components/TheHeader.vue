<template>
  <div class="bg-white lg:pb-12">
    <div class="max-w-screen-2xl px-4 md:px-8 mx-auto">
      <header class="flex justify-between items-center py-4 md:py-8">
        <!-- logo - start -->
        <NuxtLink to="/home" class="inline-flex items-center text-black-800 text-2xl md:text-3xl font-bold gap-2.5" aria-label="logo">
          <img src="~/assets/images/tsundokuplus-logo.svg" class="w-6 h-auto">

          Tsundoku+
        </NuxtLink>
        <!-- logo - end -->

        <!-- menu - start -->
        <div class="lg:flex flex-col sm:flex-row sm:justify-center lg:justify-start gap-2.5 -ml-8">

          <NuxtLink v-if="!loginStatus && useRoute().path !== '/login'" to="/login" class="inline-block focus-visible:ring ring-indigo-300 text-gray-500 hover:text-indigo-500 active:text-indigo-600 text-sm md:text-base font-semibold text-center rounded-lg outline-none transition duration-100 px-4 py-3">
            Sign in
          </NuxtLink>

          <Menu v-if="loginStatus && user !== null" as="div" class="relative inline-block text-left">
            <div>
              <MenuButton class="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
                {{ user.name }}
                <ChevronDownIcon class="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
              </MenuButton>
            </div>

            <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
              <MenuItems class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div class="py-1">
                  <MenuItem v-slot="{ active }">
                    <NuxtLink @click="doLogout" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">Sign out</NuxtLink>
                  </MenuItem>
                </div>
              </MenuItems>
            </transition>
          </Menu>

        </div>
        <!-- menu - end -->
      </header>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/20/solid'

const { loginStatus, user, setUser, logout } = useAuth()
const config = useRuntimeConfig()

async function doLogout() {
  const csrfToken = await $fetch(`${config.public.tsundokuApiBaseUrl}/csrf-token`, { credentials: 'include' })
  await $fetch(`${config.public.tsundokuApiBaseUrl}/logout`,
    {
      method: 'POST',
      headers: { 'X-CSRF-TOKEN': csrfToken.token },
      body: {},
      credentials: 'include'
    }).then(setupLogout)
}

async function setupLogout() {
  await logout()
  sessionStorage.setItem('loginStatus', '0')
  await setUser(null)
}
</script>

<style scoped>

</style>
