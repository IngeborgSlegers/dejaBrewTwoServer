const { DataTypes } = require("sequelize");
const db = require("../db");

const Tea = db.define("tea", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('black', 'white', 'green', 'herbal', 'oolong', 'pu-erh'),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  temp: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  steepTime: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantitea: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  }
});

module.exports = Tea;
