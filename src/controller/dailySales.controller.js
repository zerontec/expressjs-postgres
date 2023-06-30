const { Op } = require("sequelize");
const { DailySales } = require('../db');
const  io  = require('../socket');
// const app = require('../')
// const { sequelize } = require('sequelize');
const { sequelize } = require('../db');

// let totalSales = 0; // declara totalSales en el ámbito global

const getDailySales = async (req, res, next) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const result = await DailySales.findOne({
      where: {
        createdAt: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
      attributes: [[sequelize.fn('sum', sequelize.col('amount')), 'totalSales']],
    });

    let totalSales = 0;
    if (result && result.dataValues.totalSales) {
      totalSales = result.dataValues.totalSales;
    }

    res.status(200).json(totalSales);

    console.log(totalSales);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDailySales,
}