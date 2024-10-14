'use strict';

module.exports = (sequelize, DataTypes) => {
  const Unit = sequelize.define('Unit', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    code: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    tableName: 'units',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
  });

  Unit.associate = function (models) {
    Unit.hasMany(models.SubProductUnit, {
      foreignKey: 'unit_id',
      as: 'sub_products_units'  
    });
   };

  return Unit;
};
