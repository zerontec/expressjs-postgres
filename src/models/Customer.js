const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("customer", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    identification: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
    },

    numeroContacto: {
      type: DataTypes.STRING,
    },

    nombreContacto: {
      type: DataTypes.STRING,
    },
    telf: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },

    task: {
      type: DataTypes.STRING,
    },

    tarea_id: {
      type: DataTypes.INTEGER,
    },

    historialTareasTerminadasId: {
      type: DataTypes.INTEGER,
    },
  });
};
