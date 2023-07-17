const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('pagoCompras', {
    proveedor: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      montoPagado: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      fechaPago: {
        type: DataTypes.DATE,
        allowNull: false,
      }
 
    });

};