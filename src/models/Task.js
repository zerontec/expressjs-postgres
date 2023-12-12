const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Task =  sequelize.define('task', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    estatus: {
      type: DataTypes.STRING,
      
    },
    
    tecnico_id: {
      type: DataTypes.INTEGER, // Asegúrate de que coincida con el tipo de la clave primaria en la tabla 'tecnicos'
      
    },
    cliente_id: {
      type: DataTypes.INTEGER, // Asegúrate de que coincida con el tipo de la clave primaria en la tabla 'clientes'
      allowNull: false,
    },

    tarea_id: {
      type: DataTypes.INTEGER, // Asegúrate de que coincida con el tipo de la clave primaria en la tabla 'clientes'
      
    },
    image: {
      type: DataTypes.STRING,
    },

    asignar_tecnico: {
      type: DataTypes.BOOLEAN,
     
      defaultValue: false, // Valor predeterminado: no asignar un técnico
    },

    date:{

        type:DataTypes.DATE

    },
    note:{
type:DataTypes.STRING

    },
    address:{
type:DataTypes.STRING

    }

  });



  // Task.prototype.removeTarea = function (tarea) {
  //   return this.removeTareas(tarea);
  // }


};