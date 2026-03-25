import * as ShippingAddressValidation from '../controllers/validation/ShippingAddressValidation.js'
import ShippingAddressController from '../controllers/ShippingAddressController.js'
import { isLoggedIn, hasRole } from '../middlewares/AuthMiddleware.js'
import { handleValidation } from '../middlewares/ValidationHandlingMiddleware.js'
import { checkEntityExists } from '../middlewares/EntityMiddleware.js'
import * as ShippingAddressMiddleware from '../middlewares/ShippingAddressMiddleware.js'
import { ShippingAddress } from '../models/models.js'

const loadFileRoutes = function (app) {
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
      ShippingAddressMiddleware.checkShippingAddressOwnership, // <-- Usamos el nombre que corregimos antes
      ShippingAddressController.markDefault // <-- ¡AQUÍ ESTABA EL FALLO! (markDefault)
    )

  app.route('/shippingaddresses/:shippingAddressId')
    .delete(
      isLoggedIn,
      hasRole('customer'),
      checkEntityExists(ShippingAddress, 'shippingAddressId'),
      ShippingAddressMiddleware.checkShippingAddressOwnership, // <-- Usamos el nombre correcto
      ShippingAddressController.destroy
    )
}

export default loadFileRoutes
