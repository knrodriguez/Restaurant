const Sequelize = require('sequelize');
const db = require('./db');

const Restaurant = db.define('restaurant', {
  // Your code here
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate:{
      notEmpty: true
    }
  },
  cuisineType: {
    type: Sequelize.ENUM('CHINESE', 'MEXICAN', 'KOREAN', 'INDIAN', 'AMERICAN'),
    allowNull: false,
    validate:{
      notEmpty: true
    }
  },
  rating: {
    type: Sequelize.FLOAT(2),
    allowNull: false,
    validate:{
      min: 0,
      max: 5
    }
  },
  numVisits: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  description:{
    type: Sequelize.VIRTUAL,
    get() {
      return `${this.name} serves ${this.cuisineType} food!`;
    }
  }
});

// Your instance + class methods go here
//Class method
Restaurant.findBestBy = async function(rating) {
  const best = await Restaurant.findAll({
    where: {
      rating:{
        [Sequelize.Op.gte]: rating
      }
    }
  })
  return best;
}

//Instance method
Restaurant.prototype.rate = async function (newRating) {
  this.rating = newRating;
  await this.save();
}

// Your hooks go here
Restaurant.beforeUpdate((restaurant) => {
  restaurant.numVisits += 1;
})

Restaurant.beforeCreate((restaurant) => {
  restaurant.name = restaurant.name.split(' ').map(char => {
    return char.substring(0,1).toUpperCase() + char.substring(1);
  }).join(' ');
})
//restaurant first
//[restaurant, first]
//[R, F]

Restaurant.beforeDestroy((restaurant) => {
  if(restaurant.cuisineType === 'CHINESE'){
    throw new Error(' We Like Chinese Food!')
  }
})

module.exports = Restaurant;
