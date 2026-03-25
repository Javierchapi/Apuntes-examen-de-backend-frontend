import ShippingAddressController from '../controllers/ShippingAddressController.js'
import * as ShippingAddressValidation from '../controllers/validation/ShippingAddressValidation.js'
import { isLoggedIn, hasRole } from '../middlewares/AuthMiddleware.js'
import { handleValidation } from '../middlewares/ValidationHandlingMiddleware.js'
import { checkEntityExists } from '../middlewares/EntityMiddleware.js'
import { ShippingAddress } from '../models/models.js'
import ShippingAddressMiddleware from '../middlewares/ShippingAddressMiddleware.js'

const loadShippingAddressRoutes = function (app) {
  app.route('/shippingaddresses')
    .get(
      isLoggedIn,
      hasRole('customer'),
      ShippingAddressController.index
    )
    .post(
      isLoggedIn,
      hasRole('customer'),
      ShippingAddressValidation.create,
      handleValidation,
      ShippingAddressController.create
    )
  app.route('/shippingaddresses/:shippingAddressId/default')
    .patch(
      isLoggedIn,
      hasRole('customer'),
      checkEntityExists(ShippingAddress, 'shippingAddressId'),
      ShippingAddressMiddleware.checkShippingAddressOwnership,
      ShippingAddressController.markDefault
    )
  app.route('/shippingaddresses/:shippingAddressId')
    .delete(
      isLoggedIn,
      hasRole('customer'),
      checkEntityExists(ShippingAddress, 'shippingAddressId'),
      ShippingAddressMiddleware.checkShippingAddressOwnership,
      ShippingAddressController.destroy
    )
}

export default loadShippingAddressRoutes
