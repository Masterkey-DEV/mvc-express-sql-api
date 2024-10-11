import { Router } from 'express'
import { onlyAdmins } from '../../middlewares/admins/admins.middlewares.js'
import { AdminControllers } from '../../controllers/admin/admin.controllers.js'
const AdminRoutes = Router()
AdminRoutes.post('/admin/products',
  onlyAdmins,
  AdminControllers.createProduct)

AdminRoutes.put('/admin/products/:id',
  onlyAdmins,
  AdminControllers.updateProduct
)

AdminRoutes.delete('/admin/products/:id',
  onlyAdmins,
  AdminControllers.deleteProduct)

export default AdminRoutes
