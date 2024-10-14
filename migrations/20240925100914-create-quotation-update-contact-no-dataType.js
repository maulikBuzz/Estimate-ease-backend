'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('customers', 'contact_no', {
      type: Sequelize.STRING(15),
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('customers', 'contact_no', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },
};
