'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Photos extends Model {
    static associate({ User }) {
      Photos.belongsTo(User, {
        foreignKey: 'ownerId',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      })
    }
  }
  Photos.init({
    ownerId: DataTypes.INTEGER,
    imagePath: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Photos',
  });
  return Photos;
};