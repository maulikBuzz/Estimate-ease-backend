'use strict';

module.exports = (sequelize, DataTypes) => {
  const BusinessCategory = sequelize.define('BusinessCategory', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    tableName: 'business_categories',
    timestamps: false,
    underscored: true
  });

  BusinessCategory.associate = function(models) {
    // A BusinessCategory has many Merchants
    BusinessCategory.hasMany(models.Merchant, {
      foreignKey: 'business_category_id',
      as: 'merchants' // alias for the association
    });
    BusinessCategory.hasMany(models.Product, {
      foreignKey: 'business_category_id',
      as: 'products' // alias for the association
    });
  };

  return BusinessCategory;
};
