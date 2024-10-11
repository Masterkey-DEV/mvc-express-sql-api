import { z } from 'zod'

export const UserModel = z.object({
  name: z.string().min(1).max(30),
  email: z.string().email(),
  password: z.string()
})
