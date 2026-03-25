import { check } from 'express-validator'

const create = [
  check('alias').exists().isString().isLength({ min: 1, max: 255 }).trim(),
  check('street').exists().isString().isLength({ min: 1, max: 255 }).trim(),
  check('city').exists().isString().isLength({ min: 1, max: 255 }).trim(),
  check('zipCode').exists().isString().isLength({ min: 1, max: 255 }).trim(),
  check('province').exists().isString().isLength({ min: 1, max: 255 }).trim()
]

const update = [
  // No necesitamos validar el body porque la ruta PATCH /default
  // no recibe datos, solo usa el ID de la URL.
]

export { create, update }
