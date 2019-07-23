module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('order', {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  })
  return Order
}