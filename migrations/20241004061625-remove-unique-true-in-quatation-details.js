'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.removeIndex('quotation_details', 'quote_number');

    await queryInterface.changeColumn('quotation_details', 'quote_number', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('quotation_details', 'quote_number', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true, // Restore the unique constraint
    });
  },
};
