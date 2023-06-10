const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('seller', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },

          codigo:{

            type:DataTypes.STRING,

          },

          identification:{

            type:DataTypes.STRING,

          },
          name: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          address:{

            type:DataTypes.STRING,


          },
          telf:{
            type:DataTypes.STRING

          }
     
        });
};
