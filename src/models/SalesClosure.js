const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('salesClosure', {
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
          },
          totalSales: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
          },
          paymentTotals: {
            type: DataTypes.JSON,
            allowNull: false,
          },
        });
};
