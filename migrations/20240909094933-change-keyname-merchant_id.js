'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('users', 'merchants_id', 'merchant_id');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('users', 'merchant_id', 'merchants_id');
  }
};
