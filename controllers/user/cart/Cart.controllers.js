import db from '../../../db/run_db.js'
export class CartControllers {
  static async addProduct (req, res) {
    const { product_id, quantity } = req.body
    if (!product_id || !quantity && isNaN(parseInt(quantity))) {
      res.status(500).send({ message: 'must be given an valid id and quantity' })
    }
    const { user_id } = req.user
    try {
      const addCartSQL = 'INSERT INTO shopping_cart (quantity, user_id, product_id) VALUES (?, ?, ?)'
      db.run(addCartSQL, [quantity, user_id, product_id], (err) => {
        if (err) {
          res.status(500).send({ message: 'error al guardar los productos' })
          console.error(err)
          return
        }
        res.status(201).send({ message: 'product created succesflly', id: product_id })
      })
    } catch (err) {
      console.error({ message: 'erro al acceder al carrito', err })
      res.status(500).send({ message: 'erro al acceder al carrito' })
    }
  }

  static async getCart (req, res) {
    const { user_id } = req.user
    try {
      const cartSQL = `SELECT products.product_id, products.name, products.description, products.price, shopping_cart.quantity, shopping_cart.added_at
  FROM shopping_cart
  INNER JOIN users ON users.user_id = shopping_cart.user_id
  INNER JOIN products ON products.product_id = shopping_cart.product_id
  WHERE users.user_id = ?`
      db.all(cartSQL, [user_id], (err, rows) => {
        if (err) {
          res.status(500).send({ message: ' error al acceder a la base de datos' })
          console.error({ message: 'error al obtener el carrito en la db', error: err })
          return
        }
        if (rows.length === 0) {
          res.status(404).send({ message: ' no products added to cart yet' })
          return
        }
        res.status(200).send(rows)
      })
    } catch (err) {
      res.status(500).send({ message: 'erro en la consulta a la db' })
      console.error({ message: 'erro al consultar la db para el carrito', errro: err })
    }
  }

  static async deleteProduct (req, res) {
    const { product_id } = req.body
    const { user_id } = req.user
    if (!product_id) {
      res.status(500).send({ message: 'product id must be given' })
      return
    }
    try {
      const deleteSQL = 'DELETE FROM shopping_cart WHERE product_id = ? AND user_id = ?'
      db.run(deleteSQL, [product_id, user_id], function (err) {
        if (err) {
          console.error({ message: 'error al eliminar los productos', err })
          res.status(500).send({ message: 'error al eliminar los productos' })
          return
        }
        if (this.changes === 0) {
          res.status(404).send({ message: 'no se encontro el produco en el carrito' })
          return
        }
        res.status(202).send({ message: 'producto eliminado correctamente', id: product_id })
      })
    } catch (err) {
      res.status(500).send({ message: 'erro al eliminar los productos' })
      console.error({ message: 'error al eliminar los productos', error: err })
    }
  }
}
