const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('inventory', {
        id: {
            type: DataTypes.INTEGER,
          
            primaryKey: true,
            autoIncrement: true,
        },
name:{

  type:DataTypes.STRING
},
        barcode: {
          type: DataTypes.STRING,
          allowNull: false,
        },

        description: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        price: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },


        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
          },

          quantityInStore: {
            type: DataTypes.INTEGER,
           
          },
          supplierRif: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          alertThreshold: {
            type: DataTypes.INTEGER,
            allowNull: true,
          },

          productId:{

            type:DataTypes.INTEGER

          }


     
        });
};
