require("dotenv").config();

const Express = require("express");
const app = Express();
const db = require("./db");

const controllers = require("./controllers");

const middleware = require("./middleware/indexMiddleware");

app.use(require("./middleware/headers"));

app.use(Express.json());

app.use("/user", controllers.User);
app.use("/tea", 
// middleware.validateAccess, 
controllers.Tea);

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
