const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('purchase', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      purchaseNumber: {

        type: DataTypes.INTEGER,
        
      
        
      },

      invoiceNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      totalAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      costo: {
        type: DataTypes.FLOAT,
        
      },
      remainingAmount: {
        type: DataTypes.FLOAT,
        
      },
      supplierId:{

        type:DataTypes.INTEGER

      },
      supplierName:{

        type:DataTypes.STRING,
      },
      supplierAddress:{

        type:DataTypes.STRING,
      },
      supplierPhone:{

type:DataTypes.STRING

      },
      supplierRif:{

type:DataTypes.STRING

      },

      cantidad:{

        type:DataTypes.INTEGER
      },

      status:{

        type:DataTypes.STRING
      },
      productDetails: {
        type: DataTypes.ARRAY(DataTypes.JSONB),
        allowNull: true,
      },

     
        });
      
};
