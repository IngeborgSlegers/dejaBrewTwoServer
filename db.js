const Sequelize = require('sequelize');

const sequelize = new Sequelize('dejaVtwo', 'postgres', 'PostgresOwl3140_', {
  host: 'localhost', 
  dialect: 'postgres'
});

sequelize.authenticate()
  .then( () => console.log('Connected to DejaVTwo postgres database'))
  .catch(err => console.log(err))

const Users = sequelize.import('./models/user')
const Teas = sequelize.import('./models/tea')
const Orders = sequelize.import('./models/order')

Users.hasMany(Orders);
Orders.belongsTo(Users);

Teas.hasMany(Orders);
Orders.belongsTo(Teas);

module.exports = sequelize;