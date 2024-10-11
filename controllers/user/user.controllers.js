import { UserModel } from '../../models/user/User.model.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import db from '../../db/run_db.js'
import { SECRET_KEY, SALT_ROUNDS } from '../../environment/Const.js'
const ROUNDS = parseInt(SALT_ROUNDS)

export class UserControllers {
  static async createUser (req, res) {
    try {
      const user = UserModel.parse(req.body)
      user.password = await bcrypt.hash(user.password, ROUNDS)
      const createSQL = 'INSERT INTO users (name,email,password) VALUES (?, ?, ?)'
      db.run(createSQL, [user.name, user.email, user.password], function (err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            res.status(409).send({ message: 'user email already exists' })
            return
          }
          res.status(500).send({ message: 'erro al acceder a la base de datos' })
          console.error({ message: 'error al acceder a la base de datos', error: err })
          return
        }
        res.status(201).send({ message: 'usuario creado satisfactoriamente', userID: this.lastID })
      })
    } catch (err) {
      console.error(err)
      res.status(400).send({ message: 'datos de usuario no validos', error: err.errors })
    }
  }

  static async userLogin (req, res) {
    const { name, email, password } = req.body
    if (req.user) {
      res.status(200).send({ message: 'you are already signed' })
    }
    try {
      const logginSQL = 'SELECT * FROM users  WHERE name = ? AND email = ?'
      const userData = await new Promise((resolve, reject) => {
        db.get(logginSQL, [name, email], (err, row) => {
          if (err) {
            reject(err)
          }
          if (!row) {
            res.status(404).send({ message: 'User not found' })
            return
          }
          resolve(row)
        })
      })
      const correctPassword = bcrypt.compare(password, userData.password)
      if (!correctPassword) {
        res.status(401).send('credenciales invalidas')
        return
      }
      const token = jwt.sign(
        { user_id: userData.user_id, name: userData.name, email: userData.email, role: userData.role },
        SECRET_KEY,
        { expiresIn: '3h' }
      )
      res.cookie('authToken', token, {
        httpOnly: true,
        maxAge: 3 * 60 * 60 * 1000,
        signed: true
      }).status(200).send({ message: 'logeado satisfactoriamente' })
    } catch (err) {
      console.error('Error al iniciar sesión:', err.message)
      res.status(500).send({ message: 'Error al procesar el inicio de sesión' })
    }
  }
}
