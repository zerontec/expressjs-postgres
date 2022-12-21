const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('rating', {
        rating: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });
};