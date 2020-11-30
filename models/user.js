const { DataTypes } = require("sequelize");
const db = require("../db");

const User = db.define("user", {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phoneNumber: {
    type:DataTypes.STRING,
    allowNull: true,
    min: 10,
    max: 10
  },
  role: {
    type: DataTypes.ENUM,
    values: ["user", "admin", "banned"],
    allownull: false,
    defaultValue: "user"
  }
});

module.exports = User;
