const { DataTypes } = require("sequelize")


module.exports = (sequelize) => {
sequelize.define('propiedad', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
type:{
type:DataTypes.STRING,
allowNull: false,

}, 
address:{
    type:DataTypes.STRING,
    allowNull:false

}, 
price:{

    type:DataTypes.STRING,
    allowNull:false

}, 
asesor:{

    type:DataTypes.STRING,
    allowNull:false

}, 
image:{

    type:DataTypes.STRING,
},
disable: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
}



})


}