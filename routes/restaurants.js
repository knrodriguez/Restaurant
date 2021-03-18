const express = require('express');
const { Restaurant, MenuItem } = require('../models');
const restaurantsRouter = express.Router();

// Your routes go here

restaurantsRouter.get('/', async (req,res,next) => {
    const restaurant = await Restaurant.findAll();
    res.send(restaurant);
})

restaurantsRouter.get('/:restaurantId', async(req,res,next) => {
    const restaurant = await Restaurant.findByPk(req.params.restaurantId, {
        include: 'dishes'
    });
    res.send(restaurant);
})

restaurantsRouter.delete('/:id', async (req,res,next) => {
    try {
        await Restaurant.destroy({ where: {
            id: req.params.id
        }})
        res.sendStatus(204)
    } catch (error) {
        next(error)
    } 
})

module.exports = restaurantsRouter;
