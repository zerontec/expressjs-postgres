const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('invoiceFactura', {
        invoiceNumber: {

            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
          },
       invoiceDate: {

         type: DataTypes.DATE,
       },

       credit:{
        type: DataTypes.BOOLEAN,
        default:false

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

          clienteData: {
            type: DataTypes.JSONB, // Puedes usar JSONB para almacenar datos en formato JSON
            allowNull: true,
          },
          vendedorData: {
            type: DataTypes.JSONB,
            allowNull: true,
          },

          productoFactura: {
            type: DataTypes.ARRAY(DataTypes.JSONB),
            allowNull: true,
          },
          quantity:{

            type:DataTypes.INTEGER
          },
          date: {
            type: DataTypes.DATEONLY,
            
          },
          
        }

        
        );

        
        
};

