'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('quotation_materials', 'material_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: {
          tableName: 'merchant_sub_products',
        },
        key: 'id',
      } 
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('quotation_materials', 'material_id');
  }
};
