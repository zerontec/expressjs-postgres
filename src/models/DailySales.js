const {DataTypes} = require ('sequelize');

module.exports = (sequelize) => {

    sequelize.define('dailySales',{

        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            unique: true
          },
          amount: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            defaultValue: 0.00
          }


    })


}