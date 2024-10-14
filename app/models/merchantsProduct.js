'use strict';

module.exports = (sequelize, DataTypes) => {
  const MerchantProduct = sequelize.define('MerchantProduct', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    merchant_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'merchants',
        key: 'id'
      }
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id'
      }
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'merchant_products',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,
    paranoid: true
  });

  MerchantProduct.associate = function(models) {

    MerchantProduct.belongsTo(models.Merchant, {
      foreignKey: 'merchant_id',
      as: 'merchants'
    });

    MerchantProduct.belongsTo(models.Product, {
      foreignKey: 'product_id',
      as: 'products'
    });
  };

  return MerchantProduct;
};
