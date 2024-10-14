'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => { 
    
    await queryInterface.addColumn('customers', 'merchant_id', {
      type: Sequelize.INTEGER,
      allowNull: true,   
      references: {
        model: {
          tableName: 'merchants',
        },
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    await queryInterface.addColumn('quotation_details', 'merchant_id', {
      type: Sequelize.INTEGER,
      allowNull: true,  
      references: {
        model: {
          tableName: 'merchants',
        },
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('customers', 'merchant_id');
    await queryInterface.removeColumn('quotation_details', 'merchant_id');
  },
};
