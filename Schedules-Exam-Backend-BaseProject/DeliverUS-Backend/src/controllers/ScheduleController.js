import { Schedule } from '../models/models.js'

// ¡Ojo! Asegúrate de que reciben (req, res) en ese orden
const indexRestaurant = async function (req, res) {
  try {
    const schedules = await Schedule.findAll({ where: { restaurantId: req.params.restaurantId } })
    res.json(schedules)
  } catch (err) {
    res.status(500).send(err)
  }
}

const create = async function (req, res) {
  try {
    const newSchedule = Schedule.build(req.body)
    newSchedule.restaurantId = req.params.restaurantId
    const savedSchedule = await newSchedule.save()
    res.json(savedSchedule)
  } catch (err) {
    res.status(500).send(err)
  }
}

const update = async function (req, res) {
  try {
    await Schedule.update(req.body, { where: { id: req.params.scheduleId } })
    const updatedSchedule = await Schedule.findByPk(req.params.scheduleId)
    res.json(updatedSchedule)
  } catch (err) {
    res.status(500).send(err)
  }
}

const destroy = async function (req, res) {
  try {
    const result = await Schedule.destroy({ where: { id: req.params.scheduleId } })
    let message = ''
    if (result === 1) {
      message = 'Successfully deleted schedule id.' + req.params.scheduleId
    } else {
      message = 'Could not delete schedule.'
    }
    res.json(message)
  } catch (err) {
    res.status(500).send(err)
  }
}

const ScheduleController = { indexRestaurant, create, update, destroy }
export default ScheduleController
