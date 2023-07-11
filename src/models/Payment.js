const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('payment', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          loanId: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
          sellerId: {
            type: DataTypes.INTEGER,
            
          },
          amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
          },
          createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
          },
          updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
          },
        });

     
      

        
};
