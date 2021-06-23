const { DataTypes } = require("sequelize");
const db = require("../db");
const states = require('../states');
// console.log(states)

const Address = db.define("address", {
  addressName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address1: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address2: {
    type: DataTypes.STRING,
    allowNull: true
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false
  },
  zipcode: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      min: 5
    }
  },
  state: {
    type: DataTypes.ENUM({
      values: states,
    }),
    allowNull: false
  }
});

module.exports = Address;
