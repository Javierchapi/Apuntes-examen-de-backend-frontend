import { Model } from 'sequelize'

const loadModel = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate (models) {

    }
  }

  Review.init({
    stars: {
      allowNull: false,
      type: DataTypes.INTEGER,
      validation: {
        min: 0,
        max: 5
      }
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    restaurantId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'Restaurants',
        key: 'id'
      }
    },
    customerId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        models: 'Users',
        key: 'id'
      }
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: new Date()
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: new Date()
    }

  }, {
    sequelize,
    modelName: 'Review'
  })

  return Review
}

export default loadModel
