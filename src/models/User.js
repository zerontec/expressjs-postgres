const {DataTypes} = require ('sequelize');

module.exports = (sequelize) => {

    sequelize.define('user',{
        name:{

            type: DataTypes.STRING,
            allowNull:false,
            require
           

        },

        username:{


            type:DataTypes.STRING,
             unique:true,
            require
        },

        email:{

            type:DataTypes.STRING,
            allowNull:false,
            unique:true,
            require   
             },
             
        password:{
            type:DataTypes.STRING,
            allowNull:false,
            unique:true,
            require
        },
        image:{

            type:DataTypes.STRING,
           

        },

        address:{

            type:DataTypes.STRING,
        },
        resetToken:{
            type:DataTypes.STRING,

        },
        resetTokenExpires: {
            type:DataTypes.DATE
        },
        passwordReset:{
            type:DataTypes.DATE
        }



    })


}