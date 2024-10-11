import { Router } from 'express'
import { UserControllers } from '../../controllers/user/user.controllers.js'
import { CartControllers } from '../../controllers/user/cart/Cart.controllers.js'
import authUser from '../../middlewares/users/Users.middlewares.js'
const UserRoutes = Router()

UserRoutes.post('/login', UserControllers.userLogin)
UserRoutes.post('/sign', UserControllers.createUser)
UserRoutes.post('/cart', authUser, CartControllers.getCart)
UserRoutes.post('/cart/add/', authUser, CartControllers.addProduct)
UserRoutes.delete('/cart', authUser, CartControllers.deleteProduct)

export default UserRoutes
