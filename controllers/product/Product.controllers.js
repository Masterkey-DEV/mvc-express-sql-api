import { ProductModel } from '../../models/product/Product.model.js'
import db from '../../db/run_db.js'

export class ProductControllers {
  static async getProducts (req, res) {
    const sql = 'SELECT * FROM products'

    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error('Error al acceder a los productos:', err.message)
        return res.status(500).send({ error: 'Error al acceder a los productos' })
      }
      if (!rows) {
        res.status(404).send({ message: 'no hay productos para ver' })
      }
      res.status(200).send({ rows })
    })
  }

  static async getProductByID (req, res) {
    const { id } = req.params
    try {
      const sql = 'SELECT * FROM products WHERE product_id = ?'
      if (isNaN(parseInt(id))) {
        res.status(500).send({ message: 'send an int valid id' })
        return
      }
      db.get(sql, [id], (err, row) => {
        if (err) {
          console.error('Error al acceder a los productos:', err.message)
          return res.status(500).send({ message: 'Error al acceder a los productos' })
        }
        if (!row) {
          return res.status(404).send({ message: 'Product not found' })
        }
        try {
          const product = ProductModel.parse(row)
          res.status(200).send({ product })
        } catch (err) {
          console.error({ message: 'Error al validar los productos obtenidos', error: err.errors })
          return res.status(500).send({ message: 'Error al obtener los datos' })
        }
      })
    } catch (err) {
      console.error('Error al acceder a la base de datos', err)
      return res.status(500).send({ message: 'Error al acceder a los productos' })
    }
  }

  static async searchProduct (req, res) {
    const {
      name = '',
      minPrice = 1,
      maxPrice = 1000,
      description = ''
    } = req.query

    try {
      let searchSQL = 'SELECT * FROM products WHERE 1=1'
      const queryParams = []

      if (name) {
        searchSQL += ' AND name LIKE ?'
        queryParams.push(`%${name}%`)
      }
      if (description) {
        searchSQL += ' AND description LIKE ?'
        queryParams.push(`%${description}%`)
      }
      if (minPrice && !isNaN(parseInt(minPrice))) {
        searchSQL += ' AND price >= ?'
        queryParams.push(minPrice)
      }
      if (maxPrice && !isNaN(parseInt(maxPrice))) {
        searchSQL += ' AND price <= ?'
        queryParams.push(maxPrice)
      }

      db.all(searchSQL, queryParams, (err, rows) => {
        if (err) {
          console.error('Error al buscar productos:', err.message)
          return res.status(500).send({ message: 'Error al buscar productos' })
        }
        res.status(200).send({ products: rows })
      })
    } catch (err) {
      console.error('Error en la búsqueda de productos:', err)
      res.status(500).send({ message: 'Error en la búsqueda de productos' })
    }
  }
}
