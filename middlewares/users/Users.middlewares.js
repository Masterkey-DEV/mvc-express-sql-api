import jwt from 'jsonwebtoken'
import { SECRET_KEY } from '../../environment/Const.js'
const authUser = (req, res, next) => {
  const signedCookies = req.signedCookies
  if (signedCookies.authToken) {
    try {
      const decoded = jwt.verify(signedCookies.authToken, SECRET_KEY)
      req.user = decoded
      next()
    } catch (err) {
      res.status(401).send({ message: 'No estás autorizado, token inválido o expirado.' })
    }
  } else {
    res.status(401).send({ message: 'No estás autorizado, inicia sesión primero.' })
  }
}

export default authUser
