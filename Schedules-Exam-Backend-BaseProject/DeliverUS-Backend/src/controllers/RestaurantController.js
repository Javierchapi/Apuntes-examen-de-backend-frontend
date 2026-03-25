import { Restaurant, Product, RestaurantCategory, ProductCategory, Schedule } from '../models/models.js'

const index = async function (req, res) {
  try {
    const restaurants = await Restaurant.findAll(
      {
        attributes: { exclude: ['userId'] },
        include:
      {
        model: RestaurantCategory,
        as: 'restaurantCategory'
      },
        order: [[{ model: RestaurantCategory, as: 'restaurantCategory' }, 'name', 'ASC']]
      }
    )
    res.json(restaurants)
  } catch (err) {
    res.status(500).send(err)
  }
}

const indexOwner = async function (req, res) {
  try {
    const restaurants = await Restaurant.findAll(
      {
        attributes: { exclude: ['userId'] },
        where: { userId: req.user.id },
        include: [{
          model: RestaurantCategory,
          as: 'restaurantCategory'
        }]
      })
    res.json(restaurants)
  } catch (err) {
    res.status(500).send(err)
  }
}

const create = async function (req, res) {
  const newRestaurant = Restaurant.build(req.body)
  newRestaurant.userId = req.user.id // usuario actualmente autenticado
  try {
    const restaurant = await newRestaurant.save()
    res.json(restaurant)
  } catch (err) {
    res.status(500).send(err)
  }
}

const show = async function (req, res) {
  // Only returns PUBLIC information of restaurants
  try {
    const restaurant = await Restaurant.findByPk(req.params.restaurantId, {
      attributes: { exclude: ['userId'] },
      include: [{
        model: Product,
        as: 'products',
        include: { model: ProductCategory, as: 'productCategory' }
      },
      {
        model: RestaurantCategory,
        as: 'restaurantCategory'
      }],
      order: [[{ model: Product, as: 'products' }, 'order', 'ASC']]
    }
    )
    res.json(restaurant)
  } catch (err) {
    res.status(500).send(err)
  }
}

const showWithActiveProducts = async function (req, res) {
  try {
    const currentTime = new Date().toTimeString().split(' ')[0]

    // 1. Buscamos el restaurante con todos sus productos y horarios (sin filtros SQL aquí)
    const restaurant = await Restaurant.findByPk(req.params.restaurantId, {
      attributes: { exclude: ['userId'] },
      include: [
        {
          model: Product,
          as: 'products',
          include: [
            { model: ProductCategory, as: 'productCategory' },
            { model: Schedule, as: 'schedule' } // Simplemente lo incluimos
          ]
        },
        { model: RestaurantCategory, as: 'restaurantCategory' }
      ],
      order: [[{ model: Product, as: 'products' }, 'order', 'ASC']]
    })

    if (!restaurant) {
      return res.status(404).send('Restaurant not found')
    }

    // 2. EL FILTRO INFALIBLE EN JAVASCRIPT
    // Filtramos el array a mano. Si no tiene horario, o la hora no cuadra, lo descartamos.
    const activeProducts = restaurant.products.filter(product => {
      if (!product.schedule) return false // RF5: Con schedule nulo no son activos
      return product.schedule.startTime <= currentTime && product.schedule.endTime >= currentTime
    })

    // 3. Sobrescribimos los productos del restaurante con nuestra lista filtrada
    restaurant.dataValues.products = activeProducts

    res.json(restaurant)
  } catch (err) {
    res.status(500).send(err)
  }
}

const update = async function (req, res) {
  try {
    await Restaurant.update(req.body, { where: { id: req.params.restaurantId } })
    const updatedRestaurant = await Restaurant.findByPk(req.params.restaurantId)
    res.json(updatedRestaurant)
  } catch (err) {
    res.status(500).send(err)
  }
}

const destroy = async function (req, res) {
  try {
    const result = await Restaurant.destroy({ where: { id: req.params.restaurantId } })
    let message = ''
    if (result === 1) {
      message = 'Sucessfuly deleted restaurant id.' + req.params.restaurantId
    } else {
      message = 'Could not delete restaurant.'
    }
    res.json(message)
  } catch (err) {
    res.status(500).send(err)
  }
}

const RestaurantController = {
  index,
  indexOwner,
  create,
  show,
  showWithActiveProducts,
  update,
  destroy
}
export default RestaurantController
