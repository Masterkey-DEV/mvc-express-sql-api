import { Router } from 'express'
import { ProductControllers } from '../../controllers/product/Product.controllers.js'
const ProductRoutes = Router()

ProductRoutes.get('/products',
  ProductControllers.getProducts
)

ProductRoutes.get('/products/search',
  ProductControllers.searchProduct)

ProductRoutes.get('/products/:id',
  ProductControllers.getProductByID
)

export default ProductRoutes
