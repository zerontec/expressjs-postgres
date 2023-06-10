const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('notaCredito', {
    numeroNota: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
  });
};
