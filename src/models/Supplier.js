const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('supplier', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          name: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          address: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          rif: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
          },
          phoneNumber: {
            type: DataTypes.STRING,
            allowNull: false,
          },
     
        });
};
