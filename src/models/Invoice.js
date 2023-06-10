const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('invoice', {
        invoiceNumber: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
          },
          issueDate: {
            type: DataTypes.DATE,
            allowNull: true,
          },
          dueDate: {
            type: DataTypes.DATE,
            allowNull: true,
          },
          status: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          paymentMethod: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          notes: {
            type: DataTypes.TEXT,
            allowNull: true,
          },
     
        });
};
