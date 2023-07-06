const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('notaCredito', {
    numeroNota: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: true,
      },
      fecha: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      monto: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      clienteData: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      facturaAfectada:{

        type:DataTypes.STRING
      },

      productosDevueltos: {
        type: DataTypes.TEXT, // Puedes ajustar el tipo de columna según tus necesidades
        allowNull: true,
      },
  });
};
