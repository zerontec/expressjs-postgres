const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('product', {
        id: {
            type: DataTypes.INTEGER,
          
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            
        },
        description: {
            type: DataTypes.STRING,
            
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
          },
  
        barcode: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          quantity:{

            type:DataTypes.INTEGER
          },
          cantidad:{

            type:DataTypes.INTEGER
          },
          costo: {
            type: DataTypes.FLOAT,
            
          },
          defectuosos:{

          type:DataTypes.INTEGER

          }

     
        });

        
};
