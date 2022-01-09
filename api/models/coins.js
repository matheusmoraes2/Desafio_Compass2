'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class coins extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      coins.hasMany(models.transactions,{
        foreignKey: 'coin_id'
      })
      coins.belongsTo(models.wallet,{
        foreignKey: 'wallet_id',
        onDelete: 'cascade'
      })
    }
  };
  coins.init({
    coin: DataTypes.STRING,
    fullname: DataTypes.STRING,
    amont: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'coins',
  });
  return coins;
};