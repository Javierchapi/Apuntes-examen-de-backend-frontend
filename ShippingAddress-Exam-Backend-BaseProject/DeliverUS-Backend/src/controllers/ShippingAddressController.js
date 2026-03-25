import { ShippingAddress } from '../models/models.js'

const ShippingAddressController = {
  async index (req, res) {
    try {
      // RF1: Devuelve todas las direcciones del usuario logueado
      const shippingAddresses = await ShippingAddress.findAll({ where: { userId: req.user.id } })
      res.json(shippingAddresses)
    } catch (err) {
      res.status(500).send(err.message)
    }
  },

  async create (req, res) {
    try {
      const newAddress = ShippingAddress.build(req.body)
      newAddress.userId = req.user.id

      // RF2: LA TRAMPA DEL EXAMEN. Si es la primera dirección, se marca como predeterminada automáticamente.
      const count = await ShippingAddress.count({ where: { userId: req.user.id } })
      if (count === 0) {
        newAddress.isDefault = true
      } else {
        newAddress.isDefault = false
      }

      await newAddress.save()
      res.json(newAddress)
    } catch (err) {
      res.status(500).send(err.message)
    }
  },

  async update (req, res) {
    // Aunque el enunciado no pide explícitamente editar todos los campos,
    // lo dejamos bien hecho corrigiendo la sintaxis (es findByPk, con la 'k' minúscula, y sin llaves dentro)
    try {
      await ShippingAddress.update(req.body, { where: { id: req.params.shippingAddressId } })
      const updatedAddress = await ShippingAddress.findByPk(req.params.shippingAddressId)
      res.json(updatedAddress)
    } catch (err) {
      res.status(500).send(err.message)
    }
  },

  async destroy (req, res) {
    try {
      // RF4: Borra la dirección especificada
      const result = await ShippingAddress.destroy({ where: { id: req.params.shippingAddressId } })
      let message = ''
      if (result === 1) {
        message = 'Successfully deleted address id.' + req.params.shippingAddressId
      } else {
        message = 'Could not delete address.'
      }
      res.json(message)
    } catch (err) {
      res.status(500).send(err.message)
    }
  },

  async markDefault (req, res) {
    try {
      // RF3: Primero quitamos el 'isDefault' a TODAS las direcciones del usuario
      await ShippingAddress.update(
        { isDefault: false },
        { where: { userId: req.user.id } }
      )

      // Segundo, le ponemos 'isDefault: true' SÓLO a la que nos han pasado por la URL
      await ShippingAddress.update(
        { isDefault: true },
        { where: { id: req.params.shippingAddressId } }
      )

      // Por último, buscamos esa dirección actualizada y la devolvemos
      const updatedAddress = await ShippingAddress.findByPk(req.params.shippingAddressId)
      res.json(updatedAddress)
    } catch (err) {
      res.status(500).send(err.message)
    }
  }
}

export default ShippingAddressController
