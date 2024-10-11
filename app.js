import express, { json } from 'express'
import { COOKIE_KEY } from './environment/Const.js'
import db from './db/run_db.js'
import cookieParser from 'cookie-parser'
import ProductRoutes from './routes/products/Products.routes.js'
import AdminRoutes from './routes/admin/Admin.routes.js'
import UserRoutes from './routes/users/Users.routes.js'

const PORT = process.env.PORT ?? 3000

const app = express()

app.disable('x-powered-by')
app.use(json())
app.use(cookieParser(COOKIE_KEY))
app.use(ProductRoutes)
app.use(AdminRoutes)
app.use(UserRoutes)
app.get('/', (req, res) => {
  res.send('Hello world')
})
app.listen(PORT, () => {
  console.log('server running on http://localhost:3000')
})
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error al cerrar la base de datos', err.message)
    } else {
      console.log('Base de datos cerrada')
    }
    process.exit(0)
  })
})
