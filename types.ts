export interface User {
  id: string
  email: string
  password: string
  name: string
}

export type UserWithoutPassword = Omit<User, 'password'>
