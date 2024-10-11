import sqlite3 from 'sqlite3'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

sqlite3.verbose()

const db = new sqlite3.Database(`${__dirname}/full.db`, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error('Error connecting to the database', err.message)
    throw new Error('Error connecting to the database')
  }
  console.log('Successfully connected to the database')
})

export default db
