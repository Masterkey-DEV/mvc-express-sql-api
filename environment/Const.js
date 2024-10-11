import { config } from 'dotenv'
config()
export const SECRET_KEY = process.env.SECRET_KEY
export const SALT_ROUNDS = process.env.SALT_ROUNDS
export const COOKIE_KEY = process.env.COOKIE_KEY
