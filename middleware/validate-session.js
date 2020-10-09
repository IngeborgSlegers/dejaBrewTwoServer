const jwt = require("jsonwebtoken");
const { User } = require("../models/indexModel");

const validateSession = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  } else if (
    req.headers.authorization &&
    req.headers.authorization.includes("Bearer")
  ) {
    const { authorization } = req.headers;
    const payload = authorization
      ? jwt.verify(
          authorization.includes("Bearer")
            ? authorization.split(" ")[1]
            : authorization,
          process.env.JWT_SECRET
        )
      : undefined;
      console.log(payload)
    if (payload) {
      User.findOne({
        where: {
          id: payload.id,
        },
      }).then((user) => {
        req.user = user;
        next();
      });
    } else {
      res.status(401).json({
        message: "Not authorized",
      });
    }
  } else {
    res.status(401).json({
      message: "No token provided",
    });
  }
};

module.exports = validateSession;
