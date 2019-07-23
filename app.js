require('dotenv').config();

const express = require('express');
const app = express();
const sequelize = require('./db');
const bodyParser = require('body-parser');
const tea = require('./controllers/teacontroller');
const user = require('./controllers/usercontroller');
const order = require('./controllers/ordercontroller');
// const validateSession = require('./middleware/validate-session');

sequelize.sync();
// sequelize.sync({force: true}); reset the tables

app.use(require('./middleware/headers'));

app.use(bodyParser.json());

app.use('/user', user);
app.use('/tea', tea);
app.use(require('./middleware/validate-session'));
app.use('/order', order);

app.listen(3000, function() {
  console.log(`App is listening on ${process.env.PORT}.`)
});