const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('historialTareasTerminadas', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          fechaTerminacion: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
          },
          tecnico_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
          tarea_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
          description:{

            type:DataTypes.STRING
          },

          client:{

            type:DataTypes.STRING

          },

          address:{

type:DataTypes.STRING

          },
      
          cliente_id:{

            type:DataTypes.INTEGER
          }
     
        });
};
