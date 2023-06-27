const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('productosDefectuosos', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          barcode: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          cantidadDevuelta: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
          name: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          fechaDevolucion: {
            type: DataTypes.DATE,
            allowNull: false,
          },
          invoiceNumber:{

            type:DataTypes.STRING 
       },
        });
};
