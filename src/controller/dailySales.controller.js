const { Op } = require("sequelize");
const { DailySales } = require('../db');
const  io  = require('../socket');
// const app = require('../')
// const { sequelize } = require('sequelize');
const { sequelize } = require('../db');

// let totalSales = 0; // declara totalSales en el ámbito global

const getDailySales = async (req, res, next) => {
  try {
    const result = await DailySales.findOne({
      attributes: [[sequelize.fn('sum', sequelize.col('amount')), 'totalSales']],
    });
    
    if (result && result.dataValues.totalSales) {
      totalSales = result.dataValues.totalSales;
      io.emit('dailySales', totalSales);
    } else {
      totalSales = 0;
    }
    
    res.status(200).json(totalSales);
   
 console.log(totalSales)
 
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDailySales,
}