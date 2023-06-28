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

          fechaVentaF: {
            type: DataTypes.DATE,
            
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
            type: DataTypes.ARRAY(DataTypes.JSONB),
            allowNull: true,
          },

          total: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
          },

          customerData:{


            type:DataTypes.JSONB
          },


          
     
        });
};

