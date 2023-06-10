const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('accountsReceivable', {
        dueDate: {
            type: DataTypes.DATE,
            allowNull: false,
          },
          status: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          paymentMethod: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          paymentDate: {
            type: DataTypes.DATE,
            allowNull: true,
          },
          notes: {
            type: DataTypes.TEXT,
            allowNull: true,
          },
          createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
          },
          updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
          },

          clienteDataC: {
            type: DataTypes.JSONB, // Puedes usar JSONB para almacenar datos en formato JSON
            allowNull: true,
          },
          vendedorDataC: {
            type: DataTypes.JSONB,
            allowNull: true,
          },
          montoCobrar: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
          },
     
        });
};
