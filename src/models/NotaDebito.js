const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('notaDebito', {
    numeroNota: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      fechaEmision: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      monto: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      motivo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      clienteData: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
  });
};
