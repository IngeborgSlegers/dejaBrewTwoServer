const User = require('./user');
const Tea = require('./tea');
const Order = require('./order');
const Address = require('./address');

User.hasMany(Order);
Order.belongsTo(User);

Tea.hasMany(Order);
Order.belongsTo(Tea);

User.hasMany(Address);
Address.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

module.exports = {User, Tea, Order, Address}