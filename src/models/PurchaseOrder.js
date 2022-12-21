const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('purchaseOrder', {
        state: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        date: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: false,
        },
        credit_card: {
            type: DataTypes.STRING,
            
        },
        total: {
            type: DataTypes.DECIMAL(10, 2),
          
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        buyServicesId: {
            type: DataTypes.ARRAY(DataTypes.INTEGER),
            allowNull: false,
        },
        });
};