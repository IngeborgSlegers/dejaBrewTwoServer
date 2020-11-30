require("dotenv").config();

const Express = require("express");
const app = Express();
const db = require("./db");

const controllers = require("./controllers");

const middleware = require("./middleware");

app.use(Express.json());
app.use(middleware.headers)

app.use("/user", controllers.User);
app.use("/tea", controllers.Tea);
app.use("/address", 
// middleware.validateSession, 
controllers.Address);

app.use("/order", middleware.validateSession, controllers.Order);

db.authenticate()
  .then(() => db.sync())
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`[Server]: App is listening on ${process.env.PORT}.`);
    });
  })
  .catch((err) => {
    console.log(`[Server]: Server crashed. Error = ${err}`);
  });
