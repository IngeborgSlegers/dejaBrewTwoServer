const User = require('./user');
const Tea = require('./tea');
const Order = require('./order');
const Profile = require('./profile');

User.hasMany(Order);
Order.belongsTo(User);

Tea.hasMany(Order);
Order.belongsTo(Tea);

User.hasOne(Profile);
Profile.belongsTo(User);

Profile.hasMany(Order);
Order.belongsTo(Profile);

module.exports = {User, Tea, Order}