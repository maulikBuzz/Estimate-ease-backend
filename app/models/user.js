// models/user.js
'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    merchant_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'merchants',
        key: 'id'
      },
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    phone_number: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    password: {
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
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,
    paranoid: true
  });

  User.associate = function(models) {

    User.hasMany(models.QuotationDetail, {
      foreignKey: 'created_by',
      as: 'quotationDetail' 
    });
    
    // Define associations here
    User.belongsTo(models.Merchant, {
      foreignKey: 'merchant_id',
      as: 'merchant'
    });
  };

  return User;
};
