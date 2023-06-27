'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('NotaCreditos', 'productosDevueltos', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },


  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('NotaCreditos', 'productosDevueltos');
  },
};
