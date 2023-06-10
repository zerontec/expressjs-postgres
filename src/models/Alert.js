const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('alert', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          message: {
            type: DataTypes.STRING,
            allowNull: false,
          }
     
        });
};
