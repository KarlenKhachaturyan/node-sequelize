'use strict';
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate({ Photos }) {
      User.hasOne(Photos, {
        foreignKey: 'ownerId',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      })
    }
  }
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    passwordHash: DataTypes.STRING,
    role: DataTypes.STRING,
    status: DataTypes.STRING,
    verificationToken: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });

  User.authenticate = async (email, password) => {
      const user = await User.findOne({where: {email}});
      if (user) {
          if (bcrypt.compareSync(password, user.password)) {
              return await user.authorize();
          } else {
              throw new Error();
          }
      }
  }

  User.prototype.authorize = async function () {
      const user = this;

      if (user) {
          const accessToken = jwt.sign(
              {
                  id: user.dataValues.id,
                  email: user.dataValues.email,
              },
              process.env.TOKEN_SECRET,
              {expiresIn: process.env.TOKEN_EXPIRES * process.env.TOKEN_EXPIRES});

          return {accessToken};
      }
  };


  return User;
};