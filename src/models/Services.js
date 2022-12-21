const {DataTypes} = require ('sequelize');

module.exports = (sequelize) => {

    sequelize.define('services',{
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        type:{

            type: DataTypes.STRING,
            allowNull:false,
            unique:true

        },

        description:{

            type:DataTypes.STRING,
            allowNull:false,


        },
    
        image:{

            type:DataTypes.STRING,
            allowNull:false,
            unique:true

        },
        price:{

            type:DataTypes.INTEGER,
            allowNull:false

        }
        



    })


}