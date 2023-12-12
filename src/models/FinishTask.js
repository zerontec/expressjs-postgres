const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('finishTask', {
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

    },

    tareaId:{

            type:DataTypes.INTEGER

    }

  });
};


 //   estatus: {
  //     type: DataTypes.STRING,
  //     allowNull: false,
  //     defaultValue: 'Pendiente', // o cualquier otro valor por defecto
  //     validate: {
  //         isIn: [['Pendiente', 'En Progreso', 'Terminada']], // asegura que el valor esté en la lista permitida
  //     },
  // },