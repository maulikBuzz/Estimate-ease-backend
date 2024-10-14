'use strict';

module.exports = (sequelize, DataTypes) => {
  const MerchantSubProduct = sequelize.define('MerchantSubProduct', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    merchant_product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'merchantProducts',
        key: 'id'
      }
    },
    merchant_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'merchants',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2)
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
    tableName: 'merchant_sub_products',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,
    paranoid: true
  });

  MerchantSubProduct.associate = function (models) {
    // MerchantSubProduct model
    MerchantSubProduct.hasMany(models.SubProductUnit, { as: 'SubProductUnits', foreignKey: 'sub_product_id' });
    MerchantSubProduct.hasMany(models.QuotationMaterial, { as: 'quotation_materials', foreignKey: 'material_id' });


    MerchantSubProduct.belongsTo(models.MerchantProduct, {
      foreignKey: 'merchant_product_id',
      as: 'merchantProducts'
    });

    MerchantSubProduct.belongsTo(models.Merchant, {
      foreignKey: 'merchant_id',
      as: 'merchants'
    });
  };

  return MerchantSubProduct;
};
