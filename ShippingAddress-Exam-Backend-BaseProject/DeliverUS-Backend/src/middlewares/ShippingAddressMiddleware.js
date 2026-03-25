import { ShippingAddress } from '../models/models.js'

const checkShippingAddressOwnership = async (req, res, next) => {
  try {
    const address = await ShippingAddress.findByPK(req.params.shippingAddressId)
    if (address.userId === req.user.id) {
      return next()
    } else {
      return res.status(403).send('Not enough privileges. This entity does not belong to you')
    }
  } catch (err) {
    res.status(500).send(err.message)
  }
}
export { checkShippingAddressOwnership }
