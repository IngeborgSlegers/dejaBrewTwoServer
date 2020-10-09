const { DataTypes } = require("sequelize");
const db = require("../db");

const Order = db.define("order", {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Order;
