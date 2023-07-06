const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('loan', {
      
          amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
          },
          issueDate: {
            type: DataTypes.DATE,
            allowNull: true,
          },
          dueDate: {
            type: DataTypes.DATE,
            allowNull: true,
          },
          status: {
            type: DataTypes.STRING,
            allowNull: false,
          },
     
          notes: {
            type: DataTypes.TEXT,
            allowNull: false,
          },
          codigoSeller:{
            type:DataTypes.STRING

          }
     
        });
};
