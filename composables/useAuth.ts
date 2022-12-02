import type { Ref } from 'vue'
import { UserWithoutPassword } from "~/types";

const login = (loginStatus: Ref<boolean>) => async () => {
  loginStatus.value = true
  const to = useRoute().redirectedFrom?.path || '/home'
  useRouter().push(to)
}

const logout = (loginStatus: Ref<boolean>) => async () => {
  loginStatus.value = false
  return navigateTo('/login')
}

const setUser = (user: Ref<UserWithoutPassword | null>) => async (val) => {
  user.value = val
}

export const useAuth = () => {
  const loginStatus: Ref<boolean> = useState('loginStatus', () => false)
  const user: Ref<UserWithoutPassword | null> = useState('user', () => null)

  return {
    loginStatus: readonly(loginStatus),
    user: readonly(user),
    login: login(loginStatus),
    logout: logout(loginStatus),
    setUser: setUser(user)
  }
}
