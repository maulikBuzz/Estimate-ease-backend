'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('quotation_items', 'quot_id', 'quote_id');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('quotation_items', 'quote_id', 'quot_id');
  }
}; 
