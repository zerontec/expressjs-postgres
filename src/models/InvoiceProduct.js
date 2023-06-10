const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('invoiceProduct', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    iva: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    ivaAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  });
};
