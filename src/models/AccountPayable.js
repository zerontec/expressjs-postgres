const {
  DataTypes
} = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('accountPayable', {
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    dueDate: {
      type: DataTypes.DATE,
      // allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
    paymentMethod: {
      type: DataTypes.STRING,

    },
    paymentDate: {
      type: DataTypes.DATE,

    },
    notes: {
      type: DataTypes.TEXT,

    },

    clientData: {

      type: DataTypes.STRING
    },
    supplierRif: {

      type: DataTypes.STRING
    },
    supplierName: {

      type: DataTypes.STRING

    },
    invoiceN:{

      type:DataTypes.STRING

    },
    abonos:{
type:DataTypes.DECIMAL(10,2)

    },

    saldoPendiente:{

      type:DataTypes.DECIMAL(10,2)

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
  });
};