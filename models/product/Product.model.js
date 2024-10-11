import { z } from 'zod'

export const ProductModel = z.object({
  name: z.string()
    .min(1, { message: 'Name is required and cannot be empty' })
    .max(30, { message: 'Name must not exceed 30 characters' }),

  description: z.string()
    .min(20, { message: 'Description must be at least 20 characters long' })
    .max(100, { message: 'Description must not exceed 100 characters' }),

  price: z.number()
    .min(1, { message: 'Price must be at least 1' })
    .max(100, { message: 'Price must not exceed 100' })
})
