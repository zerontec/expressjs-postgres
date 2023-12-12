const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('historialGeneral', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          tareaId: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
          tecnicoId: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
          

     
        });
};
