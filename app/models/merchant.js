'use strict';

module.exports = (sequelize, DataTypes) => {
  const Merchant = sequelize.define('Merchant', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    business_category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'businessCategories',
        key: 'id'
      }
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    state: {
      type: DataTypes.STRING(255),
      allowNull: false
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
    tableName: 'merchants',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,
    paranoid: true
  });

  Merchant.associate = function(models) {

    Merchant.belongsTo(models.BusinessCategory, {
      foreignKey: 'business_category_id',
      as: 'businessCategory'
    });

    Merchant.hasMany(models.User, {
        foreignKey: 'merchant_id',
        as: 'merchants',
      });
  };

  return Merchant;
};
