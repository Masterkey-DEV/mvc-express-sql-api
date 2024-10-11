import { ProductModel } from '../../models/product/Product.model.js'
import db from '../../db/run_db.js'

export class AdminControllers {
  static async createProduct (req, res) {
    try {
      const sql = 'INSERT INTO products (name, price, description) VALUES (?, ?, ?)'
      const product = ProductModel.parse(req.body)
      const { name, price, description } = product

      db.run(sql, [name, price, description], function (err) {
        if (err) {
          console.error({ message: 'Error al crear el producto', error: err.message })
          return res.status(500).send({ error: err.message, message: 'Error creando el producto' })
        }
        res.status(201).send({ message: 'Producto creado correctamente', id: this.lastID, ...product })
      })
    } catch (err) {
      console.error('Error de validación:', err.errors)
      return res.status(400).send({ error: 'Datos inválidos', details: err.errors })
    }
  }

  static async deleteProduct (req, res) {
    const { id } = req.params
    try {
      const sql = 'DELETE FROM products WHERE product_id = ?'
      db.run(sql, [id], function (err) {
        if (err) {
          console.error('Error al eliminar un producto:', err.message)
          return res.status(500).send({ message: 'Error al acceder a la base de datos' })
        }
        if (this.changes === 0) {
          return res.status(404).send({ message: 'Product not found' })
        }
        res.status(202).send({ message: 'Producto eliminado exitosamente', id })
      })
    } catch (error) {
      console.error('Error al acceder a la base de datos', error)
      return res.status(500).send({ message: 'Error al acceder a la base de datos' })
    }
  }

  static async updateProduct (req, res) {
    const { id } = req.params
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).send({ message: 'A valid ID is required' })
    }

    const { name, price, description } = req.body
    const selectSQL = 'SELECT * FROM products WHERE product_id = ?'

    try {
      const productData = await new Promise((resolve, reject) => {
        db.get(selectSQL, [id], (err, row) => {
          if (err) {
            reject(err)
          } else {
            resolve(row)
          }
        })
      })

      if (!productData) {
        res.status(404).send({ message: 'Product not found' })
        return
      }

      const updateProduct = ProductModel.parse({
        name: name ?? productData.name,
        price: price ?? productData.price,
        description: description ?? productData.description
      })
      try {
        const updateSQL = 'UPDATE products SET name = ?, price = ?, description = ? WHERE product_id = ?'
        db.run(updateSQL, [updateProduct.name, updateProduct.price, updateProduct.description, id], function (err) {
          if (err) {
            console.error('Error al actualizar el producto:', err)
            return res.status(500).send({ message: 'Error al actualizar el producto' })
          }
          res.status(202).send({ message: 'Producto actualizado correctamente', changes: this.changes })
        })
      } catch (err) {
        res.status(500).send({ message: 'no se pudo actualizar el prodcto' })
        console.error({ message: 'error al actualizar un producto', err })
      }
    } catch (err) {
      console.error('Error al acceder a la base de datos:', err)
      return res.status(500).send({ message: 'Error al acceder a la base de datos' })
    }
  }
}
