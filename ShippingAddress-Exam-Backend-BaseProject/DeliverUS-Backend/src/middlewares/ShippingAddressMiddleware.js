import { ShippingAddress } from '../models/models.js'

const checkShippingAddressOwnership = async (req, res, next) => {
  try {
    const address = await ShippingAddress.findByPk(req.params.shippingAddressId)
    if (address.userId === req.user.id) {
      return next()
    }
    return res.status(403).send('Not enough privileges. This entity does not belong to you')
  } catch (err) {
    return res.status(500).send(err.message)
  }
}

export { checkShippingAddressOwnership }
