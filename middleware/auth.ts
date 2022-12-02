import { useAuth } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { loginStatus } = useAuth()
  if (!loginStatus.value && to.path !== '/login') {
    const path = '/reload'
    return { path }
  }
})
