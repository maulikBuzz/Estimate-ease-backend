'use strict';

module.exports = (sequelize, DataTypes) => {
  const Material = sequelize.define('QuotationMaterial', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    quote_item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'quotationItems',
        key: 'id'
      }
    },
    material_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'merchant_sub_products',
        key: 'id'
      }
    },
    unit_of_measure: {
      type: DataTypes.STRING,
      allowNull: false
    },
    qty: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
  }, {
    tableName: 'quotation_materials',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
  });

  Material.associate = function (models) {
    Material.belongsTo(models.QuotationItem, {
      foreignKey: 'quote_item_id',
      as: 'quotation_items'
    });
    Material.belongsTo(models.MerchantSubProduct, {
      foreignKey: 'material_id',
      as: 'merchant_sub_products'
    });
  };

  return Material;
};
