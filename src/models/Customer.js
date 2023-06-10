const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('customer', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
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


          }
     
        });
};
