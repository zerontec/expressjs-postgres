const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('devolucionesVentas', {
        numeroDevolucion: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
          },
          fechaDevolucion: {
            type: DataTypes.DATE,
            allowNull: false,
          },
          motivo: {
            type: DataTypes.STRING,
            allowNull: false,
          },

        
          invoiceNumber: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          productoD: {
            type: DataTypes.JSONB,
            allowNull: true,
          },

          total: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
          },

     
        });
};
