const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('store', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          barcode: {
            type: DataTypes.STRING,
            allowNull: false
          },
          name: {
            type: DataTypes.STRING,
            allowNull: false
          },
          description: {
            type: DataTypes.TEXT,
            allowNull: true
          },
          price: {
            type: DataTypes.FLOAT,
            allowNull: false
          },
          quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
          }
     
        });
};
