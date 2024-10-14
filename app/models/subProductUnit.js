'use strict';

module.exports = (sequelize, DataTypes) => {
  const SubProductUnit = sequelize.define('SubProductUnit', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    unit_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'units',
        key: 'id'
      }
    },
    sub_product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'merchantSubProducts',
        key: 'id'
      }
    }
  }, {
    tableName: 'sub_products_units',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
  });

  SubProductUnit.associate = function(models) {
    SubProductUnit.belongsTo(models.Unit, {
      foreignKey: 'unit_id',
      as: 'units'
    });

    SubProductUnit.belongsTo(models.MerchantSubProduct, {
      foreignKey: 'sub_product_id',
      as: 'merchantSubProducts'
    });
  };

  return SubProductUnit;
};
